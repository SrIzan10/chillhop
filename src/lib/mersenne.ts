/*
 * Original API from TypeScript port by Thilo Planz.
 * https://gist.github.com/thiloplanz/6abf04f957197e9e3912
 * 
 * SFMT implementation by Claude Sonnet 4.
 */

/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new SIMDMersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new SIMDMersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/*
 * SIMD-oriented Fast Mersenne Twister (SFMT) TypeScript implementation
 * Based on the SFMT algorithm by Mutsuo Saito and Makoto Matsumoto
 * 
 * This implementation provides better performance through SIMD-like operations
 * while maintaining the same API as the standard Mersenne Twister.
 */

/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

export class SIMDMersenneTwister {
  /* SFMT period parameters for SFMT19937 */
  private readonly MEXP = 19937;
  private readonly N = Math.floor(this.MEXP / 128) + 1; // 156
  private readonly N32 = this.N * 4; // 624
  private readonly POS1 = 122;
  private readonly SL1 = 18;
  private readonly SL2 = 1;
  private readonly SR1 = 11;
  private readonly SR2 = 1;
  private readonly MSK1 = 0xdfffffef;
  private readonly MSK2 = 0xddfecb7f;
  private readonly MSK3 = 0xbffaffff;
  private readonly MSK4 = 0xbffffff6;
  private readonly PARITY1 = 0x00000001;
  private readonly PARITY2 = 0x00000000;
  private readonly PARITY3 = 0x00000000;
  private readonly PARITY4 = 0x13c9e684;

  /* 128-bit state array represented as 32-bit chunks */
  private state = new Uint32Array(this.N32);
  private idx = this.N32; /* index counter */

  constructor(seed?: number) {
    if (seed === undefined) {
      seed = new Date().getTime();
    }
    this.init_genrand(seed);
  }

  /* Initialize generator state with seed */
  private init_genrand(seed: number): void {
    this.state[0] = seed >>> 0;
    for (let i = 1; i < this.N32; i++) {
      this.state[i] = (1812433253 * (this.state[i - 1] ^ (this.state[i - 1] >>> 30)) + i) >>> 0;
    }
    this.idx = this.N32;
    this.period_certification();
  }

  /* Period certification */
  private period_certification(): void {
    const PARITY = [this.PARITY1, this.PARITY2, this.PARITY3, this.PARITY4];
    let inner = 0;
    
    for (let i = 0; i < 4; i++) {
      inner ^= this.state[i] & PARITY[i];
    }
    
    for (let i = 16; i > 0; i >>= 1) {
      inner ^= inner >> i;
    }
    inner &= 1;
    
    if (inner === 1) return;
    
    /* Period certification failed, fix it */
    for (let i = 0; i < 4; i++) {
      let work = 1;
      for (let j = 0; j < 32; j++) {
        if ((work & PARITY[i]) !== 0) {
          this.state[i] ^= work;
          return;
        }
        work <<= 1;
      }
    }
  }

  /* Initialize by an array with array-length */
  init_by_array(init_key: number[], key_length: number): void {
    let i = 1, j = 0;
    let count = this.N32 > key_length ? this.N32 : key_length;
    
    this.init_genrand(19650218);
    
    for (; count > 0; count--) {
      this.state[i] = ((this.state[i] ^ ((this.state[i - 1] ^ (this.state[i - 1] >>> 30)) * 1664525)) + init_key[j] + j) >>> 0;
      i++;
      j++;
      if (i >= this.N32) {
        this.state[0] = this.state[this.N32 - 1];
        i = 1;
      }
      if (j >= key_length) j = 0;
    }
    
    for (count = this.N32 - 1; count > 0; count--) {
      this.state[i] = ((this.state[i] ^ ((this.state[i - 1] ^ (this.state[i - 1] >>> 30)) * 1566083941)) - i) >>> 0;
      i++;
      if (i >= this.N32) {
        this.state[0] = this.state[this.N32 - 1];
        i = 1;
      }
    }
    
    this.state[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    this.idx = this.N32;
    this.period_certification();
  }

  /* SIMD 128-bit recursion */
  private do_recursion(a: Uint32Array, b: Uint32Array, c: Uint32Array, d: Uint32Array): void {
    const lshift128 = (a: Uint32Array, out: Uint32Array, shift: number): void => {
      const th = shift >>> 5;
      const tl = shift & 31;
      const tr = 32 - tl;
      
      if (th >= 4) {
        out[0] = out[1] = out[2] = out[3] = 0;
        return;
      }
      
      for (let i = 0; i < 4 - th; i++) {
        out[i] = (a[i + th] << tl) | (i + th + 1 < 4 ? a[i + th + 1] >>> tr : 0);
      }
      for (let i = 4 - th; i < 4; i++) {
        out[i] = 0;
      }
    };

    const rshift128 = (a: Uint32Array, out: Uint32Array, shift: number): void => {
      const th = shift >>> 5;
      const tl = shift & 31;
      const tr = 32 - tl;
      
      if (th >= 4) {
        out[0] = out[1] = out[2] = out[3] = 0;
        return;
      }
      
      for (let i = 3; i >= th; i--) {
        out[i] = (a[i - th] >>> tl) | (i - th - 1 >= 0 ? a[i - th - 1] << tr : 0);
      }
      for (let i = th - 1; i >= 0; i--) {
        out[i] = 0;
      }
    };

    const x = new Uint32Array(4);
    const y = new Uint32Array(4);
    
    lshift128(a, x, this.SL2);
    rshift128(c, y, this.SR2);
    
    a[0] = a[0] ^ x[0] ^ ((b[0] >>> this.SR1) & this.MSK1) ^ y[0] ^ (d[0] << this.SL1);
    a[1] = a[1] ^ x[1] ^ ((b[1] >>> this.SR1) & this.MSK2) ^ y[1] ^ (d[1] << this.SL1);
    a[2] = a[2] ^ x[2] ^ ((b[2] >>> this.SR1) & this.MSK3) ^ y[2] ^ (d[2] << this.SL1);
    a[3] = a[3] ^ x[3] ^ ((b[3] >>> this.SR1) & this.MSK4) ^ y[3] ^ (d[3] << this.SL1);
  }

  /* Generate the next N 128-bit blocks */
  private gen_rand_all(): void {
    let r1 = this.N - 2;
    let r2 = this.N - 1;
    
    for (let i = 0; i < this.N - this.POS1; i++) {
      this.do_recursion(
        this.state.subarray(i * 4, (i + 1) * 4),
        this.state.subarray((i + this.POS1) * 4, (i + this.POS1 + 1) * 4),
        this.state.subarray(r1 * 4, (r1 + 1) * 4),
        this.state.subarray(r2 * 4, (r2 + 1) * 4)
      );
      r1 = r2;
      r2 = i;
    }
    
    for (let i = this.N - this.POS1; i < this.N; i++) {
      this.do_recursion(
        this.state.subarray(i * 4, (i + 1) * 4),
        this.state.subarray((i + this.POS1 - this.N) * 4, (i + this.POS1 - this.N + 1) * 4),
        this.state.subarray(r1 * 4, (r1 + 1) * 4),
        this.state.subarray(r2 * 4, (r2 + 1) * 4)
      );
      r1 = r2;
      r2 = i;
    }
    
    this.idx = 0;
  }

  /* generates a random number on [0,0xffffffff]-interval */
  genrand_int32(): number {
    if (this.idx >= this.N32) {
      this.gen_rand_all();
    }
    return this.state[this.idx++];
  }

  /* generates a random number on [0,0x7fffffff]-interval */
  genrand_int31(): number {
    return this.genrand_int32() >>> 1;
  }

  /* generates a random number on [0,1]-real-interval */
  genrand_real1(): number {
    return this.genrand_int32() * (1.0 / 4294967295.0);
  }

  /* generates a random number on [0,1)-real-interval */
  random(): number {
    return this.genrand_int32() * (1.0 / 4294967296.0);
  }

  /* generates a random number on (0,1)-real-interval */
  genrand_real3(): number {
    return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
  }

  /* generates a random number on [0,1) with 53-bit resolution*/
  genrand_res53(): number {
    const a = this.genrand_int32() >>> 5;
    const b = this.genrand_int32() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }
}

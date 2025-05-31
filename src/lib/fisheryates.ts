// source: https://decipher.dev/30-seconds-of-typescript/docs/shuffle/
// modified to use existing SIMDMersenneTwister constructor for random number generation

import type { SIMDMersenneTwister } from "./mersenne";

export const fisherYates = (sfml: SIMDMersenneTwister, ...arr: any[]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(sfml.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};
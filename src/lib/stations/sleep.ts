import type { Song, StationClass } from "@/types";

export class SleepStation implements StationClass {
  stationId = 50000;
  private m = new MersenneTwister();
  async getFiles(): Promise<string[]> {
    const res = await fetch('https://lofi-cdn.srizan.dev/sleep/list.json');
    const data = await res.json();
    return data;
  }

  async finalData(): Promise<Song[]> {
    const files = await this.getFiles();
    const mapped = files.map(file => {
      const [artist, title] = file.replace('.opus', '').split(' - ');
      return {
        id: parseInt((this.m.random() * 1000000).toFixed(0)),
        fileId: file.replace('.opus', ''),
        endpoint: `https://lofi-cdn.srizan.dev/sleep/${file}`,
        artists: artist,
        title: title,
        image: `https://lofi-cdn.srizan.dev/sleep/thumbs/${file.replace('.opus', '')}.webp`,
      };
    }) as Song[];
    const shuffled = mapped.sort(() => 0.5 - this.m.random()).slice(0, 5);
    return shuffled;
  }
}
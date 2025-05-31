import type { Song } from "@/types";
import { SIMDMersenneTwister } from "@/mersenne";
import { fisherYates } from "@/fisheryates";

export async function getSleepStationSongs(): Promise<Song[]> {
  const m = new SIMDMersenneTwister();
  
  const res = await fetch('https://lofi-cdn.srizan.dev/sleep/list.json');
  const files = await res.json() as string[];
  
  const mapped = files.map(file => {
    const [artist, title] = file.replace('.opus', '').split(' - ');
    return {
      fileId: file.replace('.opus', ''),
      endpoint: `https://lofi-cdn.srizan.dev/sleep/${file}`,
      artists: artist,
      title: title,
      image: `https://lofi-cdn.srizan.dev/sleep/thumbs/${file.replace('.opus', '')}.webp`,
      label: 'Chilled Cat',
      duration: 0, // TODO: get duration for all songs and put them in list.json
    };
  }) as Song[];

  const shuffled = fisherYates(mapped, m).slice(0, 5);
  return shuffled;
}

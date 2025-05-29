import type { Song } from "@/types";

export async function getSleepStationSongs(): Promise<Song[]> {
  const m = new MersenneTwister();
  
  const res = await fetch('https://lofi-cdn.srizan.dev/sleep/list.json');
  const files = await res.json() as string[];
  
  const mapped = files.map(file => {
    const [artist, title] = file.replace('.opus', '').split(' - ');
    return {
      id: parseInt((m.random() * 1000000).toFixed(0)),
      fileId: file.replace('.opus', ''),
      endpoint: `https://lofi-cdn.srizan.dev/sleep/${file}`,
      artists: artist,
      title: title,
      image: `https://lofi-cdn.srizan.dev/sleep/thumbs/${file.replace('.opus', '')}.webp`,
    };
  }) as Song[];
  
  const shuffled = mapped.sort(() => 0.5 - m.random()).slice(0, 5);
  return shuffled;
}

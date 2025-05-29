import type { Song } from "@/types";

export async function getChillhopStation(id: number): Promise<Song[]> {
  const res = await fetch(`https://stream.chillhop.com/live/${id}`);
  const data = await res.json() as Song[];
  return data;
}

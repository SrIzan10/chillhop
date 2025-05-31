import type { CHSong, Song } from "@/types";

export async function getChillhopStation(id: number): Promise<Song[]> {
  const res = await fetch(`https://stream.chillhop.com/live/${id}`);
  const data = await res.json() as CHSong[];

  const finalData = data.map(song => ({
    artists: song.artists,
    title: song.title,
    endpoint: `https://stream.chillhop.com/mp3/${song.fileId}`,
    image: song.image,
    label: 'Chillhop Music',
    spotifyId: song.spotifyId,
    duration: song.duration,
  })) as Song[];
  
  return finalData;
}

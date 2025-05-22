import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ChillhopData, Song } from './types';
import { state } from './state.svelte';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getGeneralData() {
  const res = await fetch('/api/stations');
  const data = (await res.json()) as ChillhopData;
  return data;
}

export async function getChillhopData() {
  const res = await fetch('https://stream.chillhop.com/presets');
  const data = (await res.json()) as ChillhopData;
  return data;
}

export async function getStationSongs(stationId: number) {
  const res = await fetch(`/api/live/${stationId}`);
  const data = (await res.json()) as Song[];
  return data;
}

export function setSongTime() {
  if (!state.currentSong!.startTime) {
    state.currentTime = 0;
    return;
  }
  const currentTime = new Date().getTime() / 1000;
  const startTime = new Date(state.currentSong!.startTime).getTime() / 1000;
  const endTime = new Date(state.currentSong!.endTime!).getTime() / 1000;
  const duration = endTime - startTime;
  const elapsed = currentTime - startTime;
  if (elapsed > 0 && elapsed < duration) {
    state.currentTime = elapsed;
  } else {
    state.currentTime = 0;
  }
}

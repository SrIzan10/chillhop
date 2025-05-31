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


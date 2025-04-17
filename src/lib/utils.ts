import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getGeneralData() {
	const res = await fetch('https://stream.chillhop.com/presets')
	const data = await res.json();

	return data;
}
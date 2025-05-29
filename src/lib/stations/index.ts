import type { Song } from '@/types';
import { getChillhopStation } from './chillhop';
import { getSleepStationSongs } from './sleep';

const customStations: Record<number, () => Promise<Song[]>> = {
  50000: getSleepStationSongs,
};

export const stations: Record<number, () => Promise<Song[]>> = new Proxy(customStations, {
  get(target, prop) {
    const stationId = Number(prop);
    
    if (target[stationId]) {
      return target[stationId];
    }
    
    if (stationId >= 10000 && stationId < 20000) {
      return () => getChillhopStation(stationId);
    }
    
    return undefined;
  },
  
  has(target, prop) {
    const stationId = Number(prop);
    return target[stationId] !== undefined || (stationId >= 10000 && stationId < 20000);
  }
});

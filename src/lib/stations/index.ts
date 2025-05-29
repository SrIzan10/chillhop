import { getChillhopStation } from './chillhop';
import { getSleepStationSongs } from './sleep';

const customStations = {
  50000: getSleepStationSongs,
};
const chillhopStations = Object.fromEntries(
  Array.from({ length: 100 }, (_, i) => {
    const stationId = 10000 + i;
    return [stationId, getChillhopStation.bind(null, stationId)];
  })
);

export const stations = {
  ...customStations,
  ...chillhopStations,
};

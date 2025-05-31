import { stations } from '@/stations/index.js';

export async function GET(event) {
  const { stationId } = event.params;
  const stationIdInt = parseInt(stationId);
  if (isNaN(stationIdInt)) {
    return new Response('Invalid station ID', { status: 400 });
  }

  const stationFunction = stations[stationIdInt];
  if (!stationFunction) {
    return new Response('Station not found', { status: 404 });
  }

  const songs = await stationFunction();
  return new Response(JSON.stringify(songs), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
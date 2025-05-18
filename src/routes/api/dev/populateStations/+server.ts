import { getChillhopData } from '@/utils';
import type { RequestHandler } from './$types';
import { BASEROW_ENDPOINT, BASEROW_TOKEN } from '$env/static/private'
import { dev } from '$app/environment';
import type { BRStation } from '@/types';

export const GET: RequestHandler = async () => {
  if (!dev) {
    return new Response('Not allowed', {
      status: 403
    });
  }
  const generalData = await getChillhopData();
  const existingRows = await fetch(`${BASEROW_ENDPOINT}/api/database/rows/table/685/?user_field_names=true`, {
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`
    }
  }).then(async (res) => await res.json()).then(d => d.results as BRStation[]);
  const chillhopStations = existingRows.filter(r => r.Source === 'chillhop');
  await fetch(`${BASEROW_ENDPOINT}/api/database/rows/table/685/batch-delete/ `, {
    method: 'POST',
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: chillhopStations.map(r => r.id)
    })
  })

  const stations = generalData.stations.map((station) => ({
    ID: station.id,
    Name: station.name,
    Source: 'chillhop'
  }));
  await fetch(`${BASEROW_ENDPOINT}/api/database/rows/table/685/batch/?user_field_names=true`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: stations
    })
  });

  return new Response('done');
}

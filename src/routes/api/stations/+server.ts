import { BASEROW_ENDPOINT, BASEROW_TOKEN } from "$env/static/private"
import type { BRStation } from "@/types";
import { getChillhopData } from "@/utils";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const responses = await Promise.all([
    fetch(`${BASEROW_ENDPOINT}/api/database/rows/table/685/?user_field_names=true`, {
      headers: {
        Authorization: `Token ${BASEROW_TOKEN}`
      }
    }).then(async (res) => await res.json()).then(d => d.results as BRStation[]).then(stations => stations.map(stations => {
      return {
        id: stations.ID,
        name: stations.Name,
      }
    })),
    getChillhopData(),
  ]);

  return new Response(JSON.stringify({ stations: responses[0], backgrounds: responses[1].backgrounds, atmospheres: responses[1].atmospheres }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
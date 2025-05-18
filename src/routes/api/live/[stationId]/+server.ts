export async function GET(event) {
  const { stationId } = event.params;
  const stationIdInt = parseInt(stationId);
  if (isNaN(stationIdInt)) {
    return new Response('Invalid station ID', { status: 400 });
  }

  if (stationId.startsWith('50')) {
    // custom stations
    if (stationIdInt === 50000) {
      const data = await fetch('https://lofi-cdn.srizan.dev/sleep/list.json').then(async (res) => await res.json() as string[]);
      const randomData = data.sort(() => 0.5 - Math.random()).slice(0, 5).map(song => {
        const noOpus = song.replace('.opus', '');
        const [artist, title] = noOpus.split(' - ');
        return {
          id: parseInt((Math.random() * 1000000).toFixed(0)),
          endpoint: `https://lofi-cdn.srizan.dev/sleep/${song}`,
          fileId: noOpus,
          image: `https://lofi-cdn.srizan.dev/sleep/thumbs/${noOpus}.webp`,
          artists: artist,
          title: title,
        }
      });
      return new Response(JSON.stringify(randomData), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } else {
    // chillhop stations
    const res = await fetch(`https://stream.chillhop.com/live/${stationId}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
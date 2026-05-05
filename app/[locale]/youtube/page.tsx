import YouTubePage from '@/components/YouTubePage';

const CHANNEL_ID = 'UCU6B-Ujv1usqVYKGZy_43Zg';

export interface VideoItem {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

async function getLatestVideos(): Promise<VideoItem[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } } // re-fetch at most once per hour
    );
    if (!res.ok) return [];
    const text = await res.text();

    // Pull out each <entry> block
    const entries = text.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    return entries.slice(0, 6).map((entry) => {
      const id =
        (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/) ?? [])[1] ?? '';
      const rawTitle =
        (entry.match(/<title>(.*?)<\/title>/) ?? [])[1] ?? '';
      const published =
        (entry.match(/<published>(.*?)<\/published>/) ?? [])[1] ?? '';

      const title = rawTitle
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      return {
        id,
        title,
        published,
        // YouTube always serves a thumbnail at this URL for any public video
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    });
  } catch {
    return [];
  }
}

export default async function Page() {
  const videos = await getLatestVideos();
  return <YouTubePage videos={videos} />;
}

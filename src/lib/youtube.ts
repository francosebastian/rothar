export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

export async function getLatestVideos(channelId: string, maxResults: number = 9): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not defined");
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch videos from YouTube");
  }

  const data = await response.json();
  
  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    youtubeId: item.id.videoId,
  }));
}

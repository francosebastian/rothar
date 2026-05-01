import { NextRequest, NextResponse } from 'next/server';
import { getLatestVideos } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId') || "UC5fLT1qMxEEiMAeuuRNoSNQ";
  const maxResults = parseInt(searchParams.get('maxResults') || '9');

  try {
    const videos = await getLatestVideos(channelId, maxResults);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos' },
      { status: 500 }
    );
  }
}

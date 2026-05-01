import { NextRequest, NextResponse } from 'next/server';
import { getLatestVideos } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId') || "UC5fLT1qMxEEiMAeuuRNoSNQ";
  const maxResults = parseInt(searchParams.get('maxResults') || '9');

  try {
    const videos = await getLatestVideos(channelId, maxResults);
    return NextResponse.json(
      { videos },
      { 
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { error: 'Error al obtener videos' },
      { status: 500 }
    );
  }
}

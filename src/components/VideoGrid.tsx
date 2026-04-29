'use client';

import { useState } from 'react';
import { YouTubeVideo } from '@/lib/youtube';

interface VideoGridProps {
  videos: YouTubeVideo[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {videos.map((video) => (
        <div
          key={video.id}
          className="group bg-[#084C4C] overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
        >
          <div 
            className="relative aspect-video overflow-hidden cursor-pointer"
            onClick={() => setPlayingId(video.id === playingId ? null : video.id)}
          >
            {playingId === video.id ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-[#E6DAB9] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-[#084C4C] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-4 transition-colors">
              {video.title}
            </h3>
            <div className="flex items-center justify-between text-sm text-[#E6DAB9]/70">
              {playingId === video.id ? (
                <button
                  onClick={(e) => { e.stopPropagation(); setPlayingId(null); }}
                  className="text-[#E6DAB9] font-bold hover:underline uppercase"
                >
                  Cerrar video
                </button>
              ) : (
                <span></span>
              )}
              <a
                href={`https://youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6DAB9] font-bold hover:underline uppercase"
                onClick={(e) => e.stopPropagation()}
              >
                Ver en YouTube
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

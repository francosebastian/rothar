import Link from 'next/link';
import { videos, youtubeChannelUrl } from '@/data/videos';

export default function VideosPreview() {
  const latestVideos = videos.slice(0, 3);

  return (
    <section className="py-20 bg-[#063d3d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-[#E6DAB9] tracking-wider mb-4">
            VIDEOS RECIENTES
          </h2>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-4"></div>
          <p className="text-[#E6DAB9]/70 text-lg">
            Tutoriales y vlogs de mecánica de bicicletas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {latestVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#084C4C] overflow-hidden group relative shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-16 h-16 bg-[#E6DAB9] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#084C4C] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1">
                  {video.views} vistas
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-display text-[#E6DAB9] tracking-wider group-hover:text-[#E6DAB9] transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </div>
              <a
                href={`https://youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">Ver video</span>
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/videos"
            className="inline-block bg-[#E6DAB9] text-[#084C4C] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#d4c9a5] transition-colors"
          >
            VER CANAL DE YOUTUBE
          </Link>
        </div>
      </div>
    </section>
  );
}
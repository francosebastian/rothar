import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLatestVideos, YouTubeVideo } from "@/lib/youtube";
import VideoGrid from "@/components/VideoGrid";
import { youtubeChannelUrl } from "@/data/videos";

export default async function VideosPage() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  let videos: YouTubeVideo[] = [];

  try {
    videos = await getLatestVideos(channelId);
  } catch (error) {
    console.error("Error fetching videos:", error);
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="pt-32 pb-20 bg-[#063d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider mb-4 animate-fade-in-up">
            ROTHAR WORKSHOP TV
          </h1>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-8 animate-fade-in-up delay-100"></div>
          <p className="text-[#E6DAB9]/70 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
            Mira cómo trabajamos. Tutoriales de mecánica, reviews de partes y el día a día 
            en el taller más apasionado.
          </p>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-[#E6DAB9] text-[#084C4C] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#d4c9a5] transition-colors animate-fade-in-up delay-300"
          >
            SUSCRÍBETE EN YOUTUBE
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="py-20 bg-[#E6DAB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoGrid videos={videos} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
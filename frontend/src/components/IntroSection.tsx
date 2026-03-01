import { SectionHeader } from './SectionHeader';
import { ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { animeSiteConfig } from '../content/animeSiteConfig';
import { normalizeIntroEmbedUrl } from '../utils/normalizeIntroEmbedUrl';

export function IntroSection() {
  const introVideoUrl = animeSiteConfig.intro.videoUrl;
  const fallbackUrl = animeSiteConfig.intro.fallbackUrl;
  const embedUrl = normalizeIntroEmbedUrl(introVideoUrl);
  
  // Extract first paragraph from synopsis (split by double newline)
  const synopsisExcerpt = animeSiteConfig.synopsis.split('\n\n')[0];

  // Check if it's a direct video file
  const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <section id="intro" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Introduction" />
        
        <div className="max-w-4xl mx-auto mt-12">
          {/* Responsive video container with 16:9 aspect ratio */}
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-muted" style={{ paddingBottom: '56.25%' }}>
            {isDirectVideo ? (
              <video
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                controls
                preload="metadata"
                title="Whispers of the White Moon - Introduction"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Whispers of the White Moon - Introduction"
              />
            )}
          </div>

          {/* Fallback link/button always visible */}
          <div className="mt-6 text-center">
            <Button
              asChild
              size="lg"
              className="gap-2"
            >
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={20} />
                Watch Intro
              </a>
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Click the button above if the video doesn't load
            </p>
          </div>

          {/* Tagline and Synopsis Excerpt */}
          <div className="mt-12 space-y-6 text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground italic">
              {animeSiteConfig.tagline}
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              {synopsisExcerpt}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

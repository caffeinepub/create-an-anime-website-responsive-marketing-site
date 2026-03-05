import { ExternalLink } from "lucide-react";
import { animeSiteConfig } from "../content/animeSiteConfig";
import { normalizeIntroEmbedUrl } from "../utils/normalizeIntroEmbedUrl";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./ui/button";

export function IntroSection() {
  const introVideoUrl = animeSiteConfig.intro.videoUrl;
  const fallbackUrl = animeSiteConfig.intro.fallbackUrl;
  const embedUrl = normalizeIntroEmbedUrl(introVideoUrl);

  // Extract first paragraph from synopsis (split by double newline)
  const synopsisExcerpt = animeSiteConfig.synopsis.split("\n\n")[0];

  // Check if it's a direct video file
  const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <section
      id="intro"
      data-ocid="intro.section"
      className="py-20"
      style={{ backgroundColor: "oklch(0.14 0.04 195)" }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Introduction"
          accentColor="oklch(0.68 0.16 195)"
        />

        <div className="max-w-4xl mx-auto mt-12">
          {/* Responsive video container with 16:9 aspect ratio */}
          <div
            className="relative w-full overflow-hidden rounded-lg shadow-lg"
            style={{
              paddingBottom: "56.25%",
              backgroundColor: "oklch(0.10 0.03 195)",
              border: "1px solid oklch(0.68 0.16 195 / 0.25)",
            }}
          >
            {isDirectVideo ? (
              <video
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                controls
                preload="metadata"
                title="Whispers of the White Moon - Introduction"
              >
                <track kind="captions" />
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
              style={{
                backgroundColor: "oklch(0.68 0.16 195)",
                color: "oklch(0.98 0.005 85)",
                border: "none",
              }}
            >
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={20} />
                Watch Intro
              </a>
            </Button>
            <p
              className="mt-3 text-sm"
              style={{ color: "oklch(0.55 0.04 195)" }}
            >
              Click the button above if the video doesn't load
            </p>
          </div>

          {/* Tagline and Synopsis Excerpt */}
          <div className="mt-12 space-y-6 text-center">
            <h3
              className="text-2xl md:text-3xl font-display font-semibold italic"
              style={{ color: "oklch(0.68 0.16 195)" }}
            >
              {animeSiteConfig.tagline}
            </h3>
            <p
              className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: "oklch(0.72 0.04 195)" }}
            >
              {synopsisExcerpt}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

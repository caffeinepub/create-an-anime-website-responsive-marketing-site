import { useState, useEffect } from 'react';
import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import type { SelectedEpisode } from '../App';

interface VideoSectionProps {
  selectedEpisode: SelectedEpisode | null;
}

export function VideoSection({ selectedEpisode }: VideoSectionProps) {
  const [hasError, setHasError] = useState(false);
  const { video } = animeSiteConfig;

  // Determine which video source to use
  const videoSource = selectedEpisode?.videoSourceUrl || video.sourceUrl;
  const displayTitle = selectedEpisode 
    ? `Episode ${selectedEpisode.number}: ${selectedEpisode.title}`
    : null;

  // Reset error state when video source changes
  useEffect(() => {
    setHasError(false);
  }, [videoSource]);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <section id="video" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title={video.title} />
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6 shadow-lg">
            {displayTitle && (
              <div className="mb-4 pb-4 border-b border-foreground/20">
                <h3 className="text-xl font-bold text-foreground text-center">
                  {displayTitle}
                </h3>
              </div>
            )}
            
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                key={videoSource}
                controls
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                onError={handleError}
                preload="metadata"
              >
                <source src={videoSource} type="video/mp4" />
                <source src={videoSource.replace('.mp4', '.webm')} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {hasError && (
              <div className="mt-4 p-4 bg-muted rounded-lg border border-foreground/20">
                <p className="text-foreground/80 mb-3 text-center">
                  {selectedEpisode && !selectedEpisode.videoSourceUrl
                    ? 'This episode video is not yet available.'
                    : 'Unable to load the video. Please try opening it in a new tab.'}
                </p>
                {(!selectedEpisode || selectedEpisode.videoSourceUrl) && (
                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="outline"
                      className="gap-2"
                    >
                      <a
                        href={video.fallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                        {video.fallbackText}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

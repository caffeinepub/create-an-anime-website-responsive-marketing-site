import React from 'react';
import { Episode } from '../backend';
import { normalizeIntroEmbedUrl } from '../utils/normalizeIntroEmbedUrl';

interface VideoSectionProps {
  selectedEpisode: Episode | null;
}

export function VideoSection({ selectedEpisode }: VideoSectionProps) {
  const videoUrl = selectedEpisode?.videoUrl ?? '';
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
  const embedUrl = videoUrl && !isDirectVideo ? normalizeIntroEmbedUrl(videoUrl) : null;

  return (
    <section id="video" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {selectedEpisode ? (
            <>
              <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                {selectedEpisode.title}
              </h2>
              <p className="text-accent text-center mb-6 font-medium">
                Season {Number(selectedEpisode.seasonNumber)} · Episode {Number(selectedEpisode.episodeNumber)}
              </p>
            </>
          ) : (
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Watch</h2>
          )}

          <div className="aspect-video bg-foreground/5 rounded-lg overflow-hidden border border-foreground/10 flex items-center justify-center">
            {selectedEpisode && videoUrl ? (
              isDirectVideo ? (
                <video
                  key={videoUrl}
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  onError={() => {}}
                >
                  Your browser does not support the video tag.
                </video>
              ) : embedUrl ? (
                <iframe
                  key={embedUrl}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={selectedEpisode.title}
                />
              ) : (
                <div className="text-center text-foreground/50 p-8">
                  <p className="text-lg mb-2">Video unavailable</p>
                  <p className="text-sm">The video URL for this episode could not be loaded.</p>
                </div>
              )
            ) : (
              <div className="text-center text-foreground/50 p-8">
                <p className="text-lg">There are no available videos.</p>
              </div>
            )}
          </div>

          {selectedEpisode?.description && (
            <p className="mt-4 text-foreground/70 leading-relaxed text-center">
              {selectedEpisode.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

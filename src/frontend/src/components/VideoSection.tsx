import React from "react";
import type { Episode } from "../backend";
import { normalizeIntroEmbedUrl } from "../utils/normalizeIntroEmbedUrl";

interface VideoSectionProps {
  selectedEpisode: Episode | null;
}

export function VideoSection({ selectedEpisode }: VideoSectionProps) {
  const videoUrl = selectedEpisode?.videoUrl ?? "";
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
  const embedUrl =
    videoUrl && !isDirectVideo ? normalizeIntroEmbedUrl(videoUrl) : null;

  return (
    <section
      id="video"
      data-ocid="video.section"
      className="py-20"
      style={{ backgroundColor: "oklch(0.13 0.03 195)" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {selectedEpisode ? (
            <>
              <h2
                className="text-3xl font-bold mb-2 text-center"
                style={{ color: "oklch(0.94 0.01 85)" }}
              >
                {selectedEpisode.title}
              </h2>
              <p
                className="text-center mb-6 font-medium"
                style={{ color: "oklch(0.68 0.16 195)" }}
              >
                Season {Number(selectedEpisode.seasonNumber)} · Episode{" "}
                {Number(selectedEpisode.episodeNumber)}
              </p>
            </>
          ) : (
            <h2
              className="text-3xl font-bold mb-6 text-center"
              style={{ color: "oklch(0.94 0.01 85)" }}
            >
              Watch
            </h2>
          )}

          <div
            className="aspect-video rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: "oklch(0.10 0.02 195)",
              border: "1px solid oklch(0.68 0.16 195 / 0.20)",
            }}
          >
            {selectedEpisode && videoUrl ? (
              isDirectVideo ? (
                <video
                  key={videoUrl}
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  onError={() => {}}
                >
                  <track kind="captions" />
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
                <div
                  className="text-center p-8"
                  style={{ color: "oklch(0.50 0.04 195)" }}
                >
                  <p className="text-lg mb-2">Video unavailable</p>
                  <p className="text-sm">
                    The video URL for this episode could not be loaded.
                  </p>
                </div>
              )
            ) : (
              <div
                className="text-center p-8"
                style={{ color: "oklch(0.50 0.04 195)" }}
              >
                <p className="text-lg">There are no available videos.</p>
              </div>
            )}
          </div>

          {selectedEpisode?.description && (
            <p
              className="mt-4 leading-relaxed text-center"
              style={{ color: "oklch(0.65 0.04 195)" }}
            >
              {selectedEpisode.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

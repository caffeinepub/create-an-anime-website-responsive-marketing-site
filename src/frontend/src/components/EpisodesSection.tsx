import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import type { Episode } from "../backend";
import { useGetAllEpisodes } from "../hooks/useQueries";
import { SectionHeader } from "./SectionHeader";

interface EpisodesSectionProps {
  onEpisodeSelect?: (episode: Episode) => void;
}

const CRIMSON_ACCENT = "oklch(0.62 0.20 20)";
const CRIMSON_BG = "oklch(0.14 0.04 20)";
const CRIMSON_CARD = "oklch(0.18 0.04 20)";

export function EpisodesSection({ onEpisodeSelect }: EpisodesSectionProps) {
  const { data: episodes, isLoading, isError } = useGetAllEpisodes();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sortedEpisodes = episodes
    ? [...episodes].sort((a, b) => {
        const seasonDiff = Number(a.seasonNumber) - Number(b.seasonNumber);
        if (seasonDiff !== 0) return seasonDiff;
        return Number(a.episodeNumber) - Number(b.episodeNumber);
      })
    : [];

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedId(episode.id);
    if (onEpisodeSelect) {
      onEpisodeSelect(episode);
    }
    const videoSection = document.getElementById("video");
    if (videoSection) {
      const offset = 80;
      const top =
        videoSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="episodes"
      data-ocid="episodes.section"
      className="py-20"
      style={{ backgroundColor: CRIMSON_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Episodes" accentColor={CRIMSON_ACCENT} />

        {isLoading && (
          <div
            data-ocid="episodes.loading_state"
            className="max-w-5xl mx-auto space-y-4 mt-8"
          >
            {["a", "b", "c"].map((id) => (
              <div
                key={id}
                className="flex gap-4 rounded-lg p-4"
                style={{
                  backgroundColor: CRIMSON_CARD,
                  border: `1px solid ${CRIMSON_ACCENT}20`,
                }}
              >
                <Skeleton className="h-20 w-32 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div
            data-ocid="episodes.error_state"
            className="text-center py-16 max-w-5xl mx-auto"
            style={{ color: "oklch(0.55 0.04 20)" }}
          >
            <p className="text-lg">
              Failed to load episodes. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && sortedEpisodes.length === 0 && (
          <div
            data-ocid="episodes.empty_state"
            className="text-center py-16 max-w-5xl mx-auto"
            style={{ color: "oklch(0.55 0.04 20)" }}
          >
            <p className="text-lg">There are no available episodes.</p>
          </div>
        )}

        {!isLoading && !isError && sortedEpisodes.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-4">
            {sortedEpisodes.map((episode, idx) => (
              <button
                key={episode.id}
                type="button"
                data-ocid={`episodes.item.${idx + 1}`}
                onClick={() => handleEpisodeClick(episode)}
                className="w-full text-left p-6 rounded-r-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: CRIMSON_CARD,
                  borderLeft:
                    selectedId === episode.id
                      ? `8px solid ${CRIMSON_ACCENT}`
                      : `4px solid ${CRIMSON_ACCENT}`,
                  boxShadow:
                    selectedId === episode.id
                      ? `0 4px 20px ${CRIMSON_ACCENT}30`
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== episode.id) {
                    (e.currentTarget as HTMLButtonElement).style.borderLeft =
                      `8px solid ${CRIMSON_ACCENT}`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 4px 20px ${CRIMSON_ACCENT}25`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== episode.id) {
                    (e.currentTarget as HTMLButtonElement).style.borderLeft =
                      `4px solid ${CRIMSON_ACCENT}`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "none";
                  }
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {episode.thumbnailUrl && (
                    <div
                      className="flex-shrink-0 w-32 h-20 overflow-hidden rounded"
                      style={{ backgroundColor: "oklch(0.10 0.02 20)" }}
                    >
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-shrink-0">
                    <span
                      className="inline-block font-bold text-lg px-4 py-2 rounded"
                      style={{
                        backgroundColor: CRIMSON_ACCENT,
                        color: "oklch(0.98 0.005 85)",
                      }}
                    >
                      S{Number(episode.seasonNumber)}E
                      {Number(episode.episodeNumber)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: "oklch(0.94 0.01 85)" }}
                    >
                      {episode.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: "oklch(0.70 0.04 20)" }}
                    >
                      {episode.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

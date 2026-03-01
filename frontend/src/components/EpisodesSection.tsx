import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { useGetAllEpisodes } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Episode } from '../backend';

interface EpisodesSectionProps {
  onEpisodeSelect?: (episode: Episode) => void;
}

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
    const videoSection = document.getElementById('video');
    if (videoSection) {
      const offset = 80;
      const top = videoSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="episodes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title="Episodes" />

        {isLoading && (
          <div className="max-w-5xl mx-auto space-y-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 bg-card border border-foreground/10 rounded-lg p-4">
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
          <div className="text-center py-16 text-foreground/50 max-w-5xl mx-auto">
            <p className="text-lg">Failed to load episodes. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && sortedEpisodes.length === 0 && (
          <div className="text-center py-16 text-foreground/50 max-w-5xl mx-auto">
            <p className="text-lg italic">No episodes have been added yet.</p>
            <p className="text-sm mt-2">Check back soon for new episodes.</p>
          </div>
        )}

        {!isLoading && !isError && sortedEpisodes.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-4">
            {sortedEpisodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => handleEpisodeClick(episode)}
                className={`bg-card border-l-4 p-6 rounded-r-lg hover:shadow-lg transition-all cursor-pointer hover:bg-card/80 ${
                  selectedId === episode.id
                    ? 'border-accent border-l-8 shadow-lg'
                    : 'border-accent hover:border-l-8'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {episode.thumbnailUrl && (
                    <div className="flex-shrink-0 w-32 h-20 overflow-hidden rounded bg-foreground/5">
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-shrink-0">
                    <span className="inline-block bg-accent text-accent-foreground font-bold text-lg px-4 py-2 rounded">
                      S{Number(episode.seasonNumber)}E{Number(episode.episodeNumber)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{episode.title}</h3>
                    <p className="text-foreground/80 leading-relaxed">{episode.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

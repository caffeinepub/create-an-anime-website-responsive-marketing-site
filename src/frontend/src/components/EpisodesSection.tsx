import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';
import { scrollToSection } from '../utils/scrollToSection';
import type { SelectedEpisode } from '../App';

interface EpisodesSectionProps {
  onEpisodeSelect: (episode: SelectedEpisode) => void;
}

export function EpisodesSection({ onEpisodeSelect }: EpisodesSectionProps) {
  const handleEpisodeClick = (episode: typeof animeSiteConfig.episodes[0]) => {
    onEpisodeSelect({
      number: episode.number,
      title: episode.title,
      videoSourceUrl: episode.videoSourceUrl
    });
    scrollToSection('video');
  };

  return (
    <section id="episodes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title="Episodes" />
        <div className="max-w-5xl mx-auto space-y-4">
          {animeSiteConfig.episodes.map((episode) => (
            <div
              key={episode.number}
              onClick={() => handleEpisodeClick(episode)}
              className="bg-card border-l-4 border-accent p-6 rounded-r-lg hover:shadow-lg transition-all hover:border-l-8 cursor-pointer hover:bg-card/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-block bg-accent text-accent-foreground font-bold text-lg px-4 py-2 rounded">
                    EP {episode.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{episode.title}</h3>
                  <p className="text-foreground/80 leading-relaxed">{episode.synopsis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

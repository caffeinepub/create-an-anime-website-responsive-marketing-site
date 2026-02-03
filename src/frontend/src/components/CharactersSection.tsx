import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';

export function CharactersSection() {
  return (
    <section id="characters" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title="Characters" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {animeSiteConfig.characters.map((character, index) => (
            <div
              key={index}
              className="bg-card border-2 border-foreground/20 rounded-lg p-6 hover:border-accent hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">{character.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-accent font-semibold">
                  {character.clan} • Age {character.age} • {character.height} • Rank {character.rank}
                </p>
                <p className="text-foreground/70 text-sm italic">{character.design}</p>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-3">{character.bio}</p>
              {character.weapon && character.weapon !== 'None specified' && (
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold">Weapon:</span> {character.weapon}
                </p>
              )}
              <p className="text-sm text-foreground/70 mt-2">
                <span className="font-semibold">Power State:</span> {character.powerState}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

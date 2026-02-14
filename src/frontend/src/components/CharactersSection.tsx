import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';

export function CharactersSection() {
  return (
    <section id="characters" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title="Characters" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {animeSiteConfig.characters.map((character, index) => {
            // Build metadata parts conditionally
            const metadataParts = [character.clan];
            if (typeof character.age === 'number' || (typeof character.age === 'string' && character.age !== '')) {
              metadataParts.push(`Age ${character.age}`);
            }
            metadataParts.push(character.height);
            metadataParts.push(`Rank ${character.rank}`);

            // Check if character has a valid top-of-card image (exists and is non-empty after trimming)
            const imageSrc = 'imageSrc' in character ? (character.imageSrc as string | undefined) : undefined;
            const hasImage = imageSrc && typeof imageSrc === 'string' && imageSrc.trim() !== '';

            // Check if character has a valid bio/description-area image
            // Disable bio portrait rendering for Kazeyori Shiranagi
            const bioImageSrc = 'bioImageSrc' in character ? (character.bioImageSrc as string | undefined) : undefined;
            const bioImageAlt = 'bioImageAlt' in character ? (character.bioImageAlt as string | undefined) : character.name;
            const hasBioImage = character.name !== 'Kazeyori Shiranagi' && bioImageSrc && typeof bioImageSrc === 'string' && bioImageSrc.trim() !== '';

            return (
              <div
                key={index}
                className="bg-card border-2 border-foreground/20 rounded-lg p-6 hover:border-accent hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {hasImage && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={imageSrc}
                      alt={character.name}
                      className="w-48 h-48 object-cover rounded-lg border-2 border-accent/30"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-2">{character.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-accent font-semibold">
                    {metadataParts.join(' • ')}
                  </p>
                  <p className="text-foreground/70 text-sm italic">{character.design}</p>
                </div>
                
                {hasBioImage && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={bioImageSrc}
                      alt={bioImageAlt}
                      className="w-40 h-40 object-cover rounded-lg border-2 border-accent/20 shadow-md"
                    />
                  </div>
                )}
                
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

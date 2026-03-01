import { Button } from './ui/button';
import { RotateCcw, Sparkles } from 'lucide-react';
import { animeSiteConfig } from '../content/animeSiteConfig';
import { Progress } from './ui/progress';

type CharacterMatch = {
  character: typeof animeSiteConfig.characters[0];
  score: number;
  percentage: number;
};

interface CharacterMatchResultProps {
  match: CharacterMatch;
  onRestart: () => void;
}

export function CharacterMatchResult({ match, onRestart }: CharacterMatchResultProps) {
  const { character, percentage } = match;

  // Build metadata parts conditionally
  const metadataParts = [character.clan];
  if (typeof character.age === 'number' || (typeof character.age === 'string' && character.age !== '')) {
    metadataParts.push(`Age ${character.age}`);
  }
  metadataParts.push(character.height);
  metadataParts.push(`Rank ${character.rank}`);

  // Check if character has a valid top-of-card image
  const imageSrc = 'imageSrc' in character ? (character.imageSrc as string | undefined) : undefined;
  const hasImage = imageSrc && typeof imageSrc === 'string' && imageSrc.trim() !== '';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Result Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-accent/10 px-6 py-3 rounded-full mb-4">
          <Sparkles className="text-accent" size={24} />
          <span className="text-accent font-bold text-lg">Your Character Match!</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          You are {character.name}!
        </h2>
        <p className="text-foreground/70 text-lg">
          {percentage}% Match
        </p>
      </div>

      {/* Match Percentage Bar */}
      <div className="mb-8">
        <Progress value={percentage} className="h-3" />
      </div>

      {/* Character Card */}
      <div className="bg-card border-2 border-accent rounded-lg p-8 mb-6 shadow-xl">
        {hasImage && (
          <div className="mb-6 flex justify-center">
            <img
              src={imageSrc}
              alt={character.name}
              className="w-64 h-64 object-cover rounded-lg border-2 border-accent shadow-lg"
            />
          </div>
        )}

        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-foreground mb-3">{character.name}</h3>
          <p className="text-accent font-semibold text-lg mb-2">
            {metadataParts.join(' • ')}
          </p>
          <p className="text-foreground/70 italic">{character.design}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">About</h4>
            <p className="text-foreground/80 leading-relaxed">{character.bio}</p>
          </div>

          {character.weapon && character.weapon !== 'None specified' && (
            <div>
              <h4 className="text-lg font-bold text-foreground mb-2">Weapon</h4>
              <p className="text-foreground/80">{character.weapon}</p>
            </div>
          )}

          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">Personality</h4>
            <p className="text-foreground/80">{character.personality}</p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-foreground mb-2">Power State</h4>
            <p className="text-foreground/80">{character.powerState}</p>
          </div>
        </div>
      </div>

      {/* Why This Match */}
      <div className="bg-muted/50 border-2 border-foreground/10 rounded-lg p-6 mb-8">
        <h4 className="text-xl font-bold text-foreground mb-3">Why This Match?</h4>
        <p className="text-foreground/80 leading-relaxed">
          Based on your answers, you share key personality traits and values with {character.name}. 
          Your responses about {getMatchReason(character.name)} align perfectly with their character profile 
          in Whispers of the White Moon.
        </p>
      </div>

      {/* Restart Button */}
      <div className="text-center">
        <Button
          onClick={onRestart}
          size="lg"
          className="flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Take Quiz Again
        </Button>
      </div>
    </div>
  );
}

function getMatchReason(characterName: string): string {
  const reasons: Record<string, string> = {
    'Kazeyori Shiranagi': 'endurance, quiet strength, and hidden potential',
    'Sankei Enshiro': 'determination, energy, and ambition',
    'Haruna Hishigawa': 'kindness, support, and loyalty',
    'Iwagami Sekien': 'wisdom, patience, and mentorship',
    'Aurelian': 'power, dominance, and ruthlessness',
    'Suma': 'aggression, skill, and fierce determination'
  };
  return reasons[characterName] || 'your unique traits';
}

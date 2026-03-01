import { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { CharacterMatchQuiz } from './CharacterMatchQuiz';
import { CharacterMatchResult } from './CharacterMatchResult';
import { animeSiteConfig } from '../content/animeSiteConfig';

type QuizState = 'not-started' | 'in-progress' | 'completed';

type CharacterMatch = {
  character: typeof animeSiteConfig.characters[0];
  score: number;
  percentage: number;
};

export function CharacterMatchSection() {
  const [quizState, setQuizState] = useState<QuizState>('not-started');
  const [matchResult, setMatchResult] = useState<CharacterMatch | null>(null);

  const handleStart = () => {
    setQuizState('in-progress');
  };

  const handleQuizComplete = (match: CharacterMatch) => {
    setMatchResult(match);
    setQuizState('completed');
  };

  const handleRestart = () => {
    setMatchResult(null);
    setQuizState('not-started');
  };

  return (
    <section id="character-match" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Character Match" />

        {quizState === 'not-started' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card border-2 border-foreground/20 rounded-lg p-12 shadow-lg">
              <div className="mb-6 flex justify-center">
                <div className="bg-accent/10 p-6 rounded-full">
                  <Sparkles className="text-accent" size={64} />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Discover Your Character Match
              </h3>
              
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                Answer a few questions about your personality and preferences to find out which character 
                from Whispers of the White Moon you're most like. Will you match with the quiet strength 
                of Kazeyori, the fiery determination of Sankei, or someone else entirely?
              </p>

              <Button
                onClick={handleStart}
                size="lg"
                className="text-lg px-8 py-6 flex items-center gap-3 mx-auto"
              >
                <Sparkles size={24} />
                Start the Quiz
              </Button>
            </div>
          </div>
        )}

        {quizState === 'in-progress' && (
          <CharacterMatchQuiz onComplete={handleQuizComplete} />
        )}

        {quizState === 'completed' && matchResult && (
          <CharacterMatchResult match={matchResult} onRestart={handleRestart} />
        )}
      </div>
    </section>
  );
}

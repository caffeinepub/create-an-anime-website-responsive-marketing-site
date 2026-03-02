import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { useGetAllCharacters } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const INITIAL_LIMIT = 6;

export function CharactersSection() {
  const { data: characters, isLoading, isError } = useGetAllCharacters();
  const [showAll, setShowAll] = useState(false);

  const visibleCharacters = showAll ? characters : characters?.slice(0, INITIAL_LIMIT);
  const hasMore = characters && characters.length > INITIAL_LIMIT;

  return (
    <section id="characters" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title="Characters" />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border-2 border-foreground/20 rounded-lg p-6 space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-foreground/50 max-w-6xl mx-auto">
            <p className="text-lg">Failed to load characters. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (!characters || characters.length === 0) && (
          <div className="text-center py-16 text-foreground/50 max-w-6xl mx-auto">
            <p className="text-lg italic">No characters have been added yet.</p>
            <p className="text-sm mt-2">Check back soon for character profiles.</p>
          </div>
        )}

        {!isLoading && !isError && characters && characters.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {visibleCharacters!.map((character) => (
                <div
                  key={character.id}
                  className="bg-card border-2 border-foreground/20 rounded-lg p-6 hover:border-accent hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {character.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-48 h-48 object-cover rounded-lg border-2 border-accent/30"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{character.name}</h3>
                  <p className="text-accent font-semibold mb-3">{character.role}</p>
                  <p className="text-foreground/80 leading-relaxed mb-3">{character.bio}</p>

                  <div className="space-y-1 border-t border-foreground/10 pt-3 mt-3">
                    {character.weapon && (
                      <p className="text-sm text-foreground/70">
                        <span className="font-semibold">Weapon:</span> {character.weapon}
                      </p>
                    )}
                    {character.power && (
                      <p className="text-sm text-foreground/70">
                        <span className="font-semibold">Power:</span> {character.power}
                      </p>
                    )}
                    {character.traits && character.traits.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {character.traits.map((trait, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="gap-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent px-8 py-2"
                >
                  {showAll ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show More ({characters.length - INITIAL_LIMIT} more) <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

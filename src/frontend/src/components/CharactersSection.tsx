import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { useGetAllCharacters } from "../hooks/useQueries";
import { SectionHeader } from "./SectionHeader";

const INITIAL_LIMIT = 6;

const AMBER_ACCENT = "oklch(0.72 0.18 75)";
const AMBER_BG = "oklch(0.14 0.04 75)";
const AMBER_CARD = "oklch(0.18 0.04 75)";

export function CharactersSection() {
  const { data: characters, isLoading, isError } = useGetAllCharacters();
  const [showAll, setShowAll] = useState(false);

  const visibleCharacters = showAll
    ? characters
    : characters?.slice(0, INITIAL_LIMIT);
  const hasMore = characters && characters.length > INITIAL_LIMIT;

  return (
    <section
      id="characters"
      data-ocid="characters.section"
      className="py-20"
      style={{ backgroundColor: AMBER_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Characters" accentColor={AMBER_ACCENT} />

        {isLoading && (
          <div
            data-ocid="characters.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8"
          >
            {["a", "b", "c", "d"].map((id) => (
              <div
                key={id}
                className="rounded-lg p-6 space-y-4"
                style={{
                  backgroundColor: AMBER_CARD,
                  border: `1px solid ${AMBER_ACCENT}30`,
                }}
              >
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
          <div
            data-ocid="characters.error_state"
            className="text-center py-16 max-w-6xl mx-auto"
            style={{ color: "oklch(0.60 0.02 85)" }}
          >
            <p className="text-lg">
              Failed to load characters. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && (!characters || characters.length === 0) && (
          <div
            data-ocid="characters.empty_state"
            className="text-center py-16 max-w-6xl mx-auto"
            style={{ color: "oklch(0.60 0.02 85)" }}
          >
            <p className="text-lg italic">No characters have been added yet.</p>
            <p className="text-sm mt-2">
              Check back soon for character profiles.
            </p>
          </div>
        )}

        {!isLoading && !isError && characters && characters.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {visibleCharacters!.map((character, idx) => (
                <div
                  key={character.id}
                  data-ocid={`characters.item.${idx + 1}`}
                  className="rounded-lg p-6 transition-all transform hover:-translate-y-1"
                  style={{
                    backgroundColor: AMBER_CARD,
                    border: `2px solid ${AMBER_ACCENT}30`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      `2px solid ${AMBER_ACCENT}`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 8px 32px ${AMBER_ACCENT}25`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      `2px solid ${AMBER_ACCENT}30`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  {character.imageUrl && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-48 h-48 object-cover rounded-lg"
                        style={{ border: `2px solid ${AMBER_ACCENT}50` }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: "oklch(0.94 0.01 85)" }}
                  >
                    {character.name}
                  </h3>
                  <p
                    className="font-semibold mb-3"
                    style={{ color: AMBER_ACCENT }}
                  >
                    {character.role}
                  </p>
                  <p
                    className="leading-relaxed mb-3"
                    style={{ color: "oklch(0.78 0.03 85)" }}
                  >
                    {character.bio}
                  </p>

                  <div
                    className="space-y-1 pt-3 mt-3"
                    style={{ borderTop: `1px solid ${AMBER_ACCENT}20` }}
                  >
                    {character.weapon && (
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.68 0.03 85)" }}
                      >
                        <span className="font-semibold">Weapon:</span>{" "}
                        {character.weapon}
                      </p>
                    )}
                    {character.power && (
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.68 0.03 85)" }}
                      >
                        <span className="font-semibold">Power:</span>{" "}
                        {character.power}
                      </p>
                    )}
                    {character.traits && character.traits.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {character.traits.map((trait) => (
                          <span
                            key={trait}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${AMBER_ACCENT}18`,
                              color: AMBER_ACCENT,
                              border: `1px solid ${AMBER_ACCENT}35`,
                            }}
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
                  data-ocid="characters.toggle"
                  variant="outline"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="gap-2 px-8 py-2"
                  style={{
                    borderColor: `${AMBER_ACCENT}60`,
                    color: AMBER_ACCENT,
                    backgroundColor: "transparent",
                  }}
                >
                  {showAll ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show More ({characters.length - INITIAL_LIMIT} more){" "}
                      <ChevronDown className="w-4 h-4" />
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

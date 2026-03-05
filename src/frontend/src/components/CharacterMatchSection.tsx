import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { animeSiteConfig } from "../content/animeSiteConfig";
import { CharacterMatchQuiz } from "./CharacterMatchQuiz";
import { CharacterMatchResult } from "./CharacterMatchResult";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./ui/button";

type QuizState = "not-started" | "in-progress" | "completed";

type CharacterMatch = {
  character: (typeof animeSiteConfig.characters)[0];
  score: number;
  percentage: number;
};

const CYAN_ACCENT = "oklch(0.70 0.14 200)";
const CYAN_BG = "oklch(0.13 0.04 200)";
const CYAN_CARD = "oklch(0.17 0.04 200)";

export function CharacterMatchSection() {
  const [quizState, setQuizState] = useState<QuizState>("not-started");
  const [matchResult, setMatchResult] = useState<CharacterMatch | null>(null);

  const handleStart = () => {
    setQuizState("in-progress");
  };

  const handleQuizComplete = (match: CharacterMatch) => {
    setMatchResult(match);
    setQuizState("completed");
  };

  const handleRestart = () => {
    setMatchResult(null);
    setQuizState("not-started");
  };

  return (
    <section
      id="character-match"
      data-ocid="character-match.section"
      className="py-20"
      style={{ backgroundColor: CYAN_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Character Match" accentColor={CYAN_ACCENT} />

        {quizState === "not-started" && (
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="rounded-lg p-12 shadow-lg"
              style={{
                backgroundColor: CYAN_CARD,
                border: `2px solid ${CYAN_ACCENT}30`,
              }}
            >
              <div className="mb-6 flex justify-center">
                <div
                  className="p-6 rounded-full"
                  style={{ backgroundColor: `${CYAN_ACCENT}18` }}
                >
                  <Sparkles style={{ color: CYAN_ACCENT }} size={64} />
                </div>
              </div>

              <h3
                className="text-3xl font-bold mb-4"
                style={{ color: "oklch(0.94 0.01 85)" }}
              >
                Discover Your Character Match
              </h3>

              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.72 0.04 200)" }}
              >
                Answer a few questions about your personality and preferences to
                find out which character from Whispers of the White Moon you're
                most like. Will you match with the quiet strength of Kazeyori,
                the fiery determination of Sankei, or someone else entirely?
              </p>

              <Button
                data-ocid="character-match.primary_button"
                onClick={handleStart}
                size="lg"
                className="text-lg px-8 py-6 flex items-center gap-3 mx-auto"
                style={{
                  backgroundColor: CYAN_ACCENT,
                  color: "oklch(0.10 0.015 240)",
                  border: "none",
                }}
              >
                <Sparkles size={24} />
                Start the Quiz
              </Button>
            </div>
          </div>
        )}

        {quizState === "in-progress" && (
          <CharacterMatchQuiz onComplete={handleQuizComplete} />
        )}

        {quizState === "completed" && matchResult && (
          <CharacterMatchResult match={matchResult} onRestart={handleRestart} />
        )}
      </div>
    </section>
  );
}

import { animeSiteConfig } from "../content/animeSiteConfig";
import { SectionHeader } from "./SectionHeader";

const BROWN_ACCENT = "oklch(0.72 0.14 60)";
const BROWN_BG = "oklch(0.14 0.04 60)";
const BROWN_CARD = "oklch(0.18 0.04 60)";

export function WorldbuildingSection() {
  const { worldbuilding } = animeSiteConfig;

  return (
    <section
      id="worldbuilding"
      data-ocid="worldbuilding.section"
      className="py-20"
      style={{ backgroundColor: BROWN_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Worldbuilding" accentColor={BROWN_ACCENT} />
        <div className="max-w-5xl mx-auto space-y-8">
          {/* The World & Clans */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: BROWN_CARD,
              border: `2px solid ${BROWN_ACCENT}30`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: BROWN_ACCENT }}
            >
              The World & Clans
            </h3>
            <p className="mb-4" style={{ color: "oklch(0.75 0.04 85)" }}>
              The world is divided into six clans, each with its own power,
              culture, and eye.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {worldbuilding.clans.map((clan) => (
                <div
                  key={clan.name}
                  className="rounded p-4"
                  style={{
                    backgroundColor: "oklch(0.12 0.03 60)",
                    border: `1px solid ${BROWN_ACCENT}20`,
                  }}
                >
                  <p
                    className="font-bold"
                    style={{ color: "oklch(0.92 0.01 85)" }}
                  >
                    {clan.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.65 0.04 85)" }}
                  >
                    Eye: {clan.eye}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clan Eyes */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: BROWN_CARD,
              border: `2px solid ${BROWN_ACCENT}30`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: BROWN_ACCENT }}
            >
              Clan Eyes
            </h3>
            <p className="mb-4" style={{ color: "oklch(0.75 0.04 85)" }}>
              Each clan has a unique eye that visually reflects its clan. In the
              early anime:
            </p>
            <ul className="space-y-2">
              {worldbuilding.clanEyeRules.map((rule) => (
                <li key={rule} className="flex items-start">
                  <span className="mr-2" style={{ color: BROWN_ACCENT }}>
                    •
                  </span>
                  <span style={{ color: "oklch(0.75 0.04 85)" }}>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Power System */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: BROWN_CARD,
              border: `2px solid ${BROWN_ACCENT}30`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: BROWN_ACCENT }}
            >
              {worldbuilding.powerSystem.title}
            </h3>
            <ul className="space-y-2">
              {worldbuilding.powerSystem.rules.map((rule) => (
                <li key={rule} className="flex items-start">
                  <span className="mr-2" style={{ color: BROWN_ACCENT }}>
                    •
                  </span>
                  <span style={{ color: "oklch(0.75 0.04 85)" }}>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rank System */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: BROWN_CARD,
              border: `2px solid ${BROWN_ACCENT}30`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: BROWN_ACCENT }}
            >
              {worldbuilding.rankSystem.title}
            </h3>
            <p className="mb-4" style={{ color: "oklch(0.75 0.04 85)" }}>
              {worldbuilding.rankSystem.description}
            </p>
            <div className="space-y-2">
              <p
                className="font-semibold"
                style={{ color: "oklch(0.92 0.01 85)" }}
              >
                Starting Ranks:
              </p>
              {worldbuilding.rankSystem.startingRanks.map((entry) => (
                <p
                  key={entry.character}
                  style={{ color: "oklch(0.75 0.04 85)" }}
                >
                  {entry.character} → Rank {entry.rank}
                </p>
              ))}
            </div>
          </div>

          {/* Shiranagi Family */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: BROWN_CARD,
              border: `2px solid ${BROWN_ACCENT}30`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: BROWN_ACCENT }}
            >
              {worldbuilding.shiranagFamily.title}
            </h3>
            <div className="space-y-4">
              <div>
                <p
                  className="font-bold"
                  style={{ color: "oklch(0.92 0.01 85)" }}
                >
                  {worldbuilding.shiranagFamily.father.name}
                </p>
                <p className="text-sm mb-1" style={{ color: BROWN_ACCENT }}>
                  {worldbuilding.shiranagFamily.father.role}
                </p>
                <p style={{ color: "oklch(0.75 0.04 85)" }}>
                  {worldbuilding.shiranagFamily.father.details}
                </p>
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{ color: "oklch(0.92 0.01 85)" }}
                >
                  {worldbuilding.shiranagFamily.mother.name}
                </p>
                <p style={{ color: "oklch(0.75 0.04 85)" }}>
                  {worldbuilding.shiranagFamily.mother.details}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

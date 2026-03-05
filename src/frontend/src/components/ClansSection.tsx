import { SectionHeader } from "./SectionHeader";

interface Clan {
  name: string;
  sigil: string;
  description: string;
}

const clans: Clan[] = [
  {
    name: "Moon Clan",
    sigil: "/assets/generated/moon-clan-sigil.dim_512x512.png",
    description:
      "Masters of illusion and shadow manipulation, the Moon Clan draws power from the lunar cycles. Their abilities peak under moonlight, granting them enhanced perception and the power to bend reality itself.",
  },
  {
    name: "Sun Clan",
    sigil: "/assets/generated/sun-clan-sigil.dim_512x512.png",
    description:
      "Wielders of radiant energy and divine light, the Sun Clan channels the power of daybreak. Their warriors are known for their unwavering courage and ability to purify darkness with blazing solar techniques.",
  },
  {
    name: "Fire Clan",
    sigil: "/assets/generated/fire-clan-sigil.dim_512x512.png",
    description:
      "Born from volcanic fury, the Fire Clan commands destructive flames and explosive power. Their passionate warriors transform rage into devastating attacks that can reduce entire battlefields to ash.",
  },
  {
    name: "Water Clan",
    sigil: "/assets/generated/water-clan-sigil.dim_512x512.png",
    description:
      "Flowing like rivers and crashing like tides, the Water Clan adapts to any situation. Their mastery over liquid forms grants them healing abilities and the power to overwhelm opponents with relentless waves.",
  },
  {
    name: "Lightning Clan",
    sigil: "/assets/generated/lightning-clan-sigil.dim_512x512.png",
    description:
      "Swift as thunder and deadly as a storm, the Lightning Clan harnesses electrical energy. Their techniques strike with blinding speed, making them the fastest warriors in all the realms.",
  },
  {
    name: "Earth Clan",
    sigil: "/assets/generated/earth-clan-sigil.dim_512x512.png",
    description:
      "Rooted in ancient stone and eternal mountains, the Earth Clan possesses unbreakable defense and immense strength. Their connection to the land makes them nearly invincible on solid ground.",
  },
  {
    name: "Balance Clan",
    sigil: "/assets/generated/balance-clan-sigil.dim_512x512.png",
    description:
      "The Balance Clan once stood as the strongest and most feared clan in existence. Their warriors possessed the ability to manipulate multiple forces simultaneously, allowing them to maintain harmony between rival clans. Their downfall marked the beginning of the modern era of conflict. Even after their disappearance, legends warn that true balance can never remain buried forever.",
  },
];

const NAVY_ACCENT = "oklch(0.60 0.14 250)";
const NAVY_BG = "oklch(0.13 0.05 250)";
const NAVY_CARD = "oklch(0.17 0.05 250)";

export function ClansSection() {
  return (
    <section
      id="clans"
      data-ocid="clans.section"
      className="py-20 px-4"
      style={{ backgroundColor: NAVY_BG }}
    >
      <div className="container mx-auto max-w-7xl">
        <SectionHeader title="Clans" accentColor={NAVY_ACCENT} />

        <p
          className="text-center text-lg md:text-xl mb-16 max-w-3xl mx-auto"
          style={{ color: "oklch(0.65 0.04 250)" }}
        >
          Each clan wields unique elemental powers passed down through
          generations. Discover their strengths, their legends, and their role
          in the coming war.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clans.map((clan, idx) => (
            <div
              key={clan.name}
              data-ocid={`clans.item.${idx + 1}`}
              className="rounded-lg p-6 transition-all duration-300"
              style={{
                backgroundColor: NAVY_CARD,
                border: `1px solid ${NAVY_ACCENT}30`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.border =
                  `1px solid ${NAVY_ACCENT}`;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 6px 24px ${NAVY_ACCENT}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.border =
                  `1px solid ${NAVY_ACCENT}30`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={clan.sigil}
                  alt={`${clan.name} sigil`}
                  className="w-32 h-32 object-contain mb-4"
                  style={{
                    filter: "drop-shadow(0 0 8px oklch(0.60 0.14 250 / 0.4))",
                  }}
                />
                <h3
                  className="text-2xl font-bold text-center"
                  style={{ color: "oklch(0.94 0.01 85)" }}
                >
                  {clan.name}
                </h3>
              </div>
              <p
                className="text-center leading-relaxed"
                style={{ color: "oklch(0.65 0.04 250)" }}
              >
                {clan.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

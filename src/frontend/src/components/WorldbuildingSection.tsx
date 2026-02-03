import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';

export function WorldbuildingSection() {
  const { worldbuilding } = animeSiteConfig;

  return (
    <section id="worldbuilding" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Worldbuilding" />
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* The World & Clans */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">The World & Clans</h3>
            <p className="text-foreground/80 mb-4">
              The world is divided into six clans, each with its own power, culture, and eye.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {worldbuilding.clans.map((clan, index) => (
                <div key={index} className="bg-muted/50 rounded p-4 border border-foreground/10">
                  <p className="font-bold text-foreground">{clan.name}</p>
                  <p className="text-sm text-foreground/70">Eye: {clan.eye}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clan Eyes */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">Clan Eyes</h3>
            <p className="text-foreground/80 mb-4">
              Each clan has a unique eye that visually reflects its clan. In the early anime:
            </p>
            <ul className="space-y-2">
              {worldbuilding.clanEyeRules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span className="text-foreground/80">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Power System */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">{worldbuilding.powerSystem.title}</h3>
            <ul className="space-y-2">
              {worldbuilding.powerSystem.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span className="text-foreground/80">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rank System */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">{worldbuilding.rankSystem.title}</h3>
            <p className="text-foreground/80 mb-4">{worldbuilding.rankSystem.description}</p>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Starting Ranks:</p>
              {worldbuilding.rankSystem.startingRanks.map((entry, index) => (
                <p key={index} className="text-foreground/80">
                  {entry.character} → Rank {entry.rank}
                </p>
              ))}
            </div>
          </div>

          {/* Shiranagi Family */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">{worldbuilding.shiranagFamily.title}</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-foreground">{worldbuilding.shiranagFamily.father.name}</p>
                <p className="text-sm text-accent mb-1">{worldbuilding.shiranagFamily.father.role}</p>
                <p className="text-foreground/80">{worldbuilding.shiranagFamily.father.details}</p>
              </div>
              <div>
                <p className="font-bold text-foreground">{worldbuilding.shiranagFamily.mother.name}</p>
                <p className="text-foreground/80">{worldbuilding.shiranagFamily.mother.details}</p>
              </div>
            </div>
          </div>

          {/* Moon Rock */}
          <div className="bg-card border-2 border-foreground/20 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-accent mb-4">{worldbuilding.moonRock.title}</h3>
            <p className="text-foreground/80">{worldbuilding.moonRock.description}</p>
          </div>

        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';

export function RewardsSection() {
  return (
    <section id="donations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Donation" />
        
        <div className="mt-12 max-w-4xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-12 space-y-4">
            <p className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <span>🌙</span>
              <span>Support Whispers Of The White Moon</span>
            </p>
            
            <p className="text-lg text-muted-foreground">
              Help bring the story, animation, and characters to life.
            </p>
            
            <p className="text-lg text-muted-foreground">
              Every donation helps support development, voice acting, art, and future episodes.
            </p>
            
            <div className="mt-8 space-y-2">
              <p className="text-lg text-foreground">
                Every supporter becomes part of the Whispers Of The White Moon journey.
              </p>
              <p className="text-lg text-foreground">
                Choose your tier and help shape the story.
              </p>
            </div>
          </div>

          {/* Cash App Donation Block */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg mb-12 max-w-2xl mx-auto">
            <div className="space-y-4 text-center">
              <p className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <span>🔥</span>
                <span>Donate Via Cash App</span>
              </p>
              
              <p className="text-lg text-muted-foreground">
                Send support to:
              </p>
              
              <p className="text-3xl font-bold text-accent">
                $WOTWM
              </p>
              
              <p className="text-lg text-foreground flex items-center justify-center gap-2">
                <span>Thank you for your support!</span>
                <span>💙</span>
              </p>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center text-foreground mb-8">
              Rewards
            </h3>
            
            <div className="space-y-6">
              {animeSiteConfig.rewards.tiers.map((tier, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">
                      {tier.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-foreground mb-1">
                        {tier.name}
                      </h4>
                      
                      <p className="text-lg text-accent font-semibold mb-3">
                        {tier.donationRange}
                      </p>
                      
                      <ul className="space-y-2">
                        {tier.perks.map((perk, perkIndex) => (
                          <li 
                            key={perkIndex}
                            className="text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-accent mt-1">•</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

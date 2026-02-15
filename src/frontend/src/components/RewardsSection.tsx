import { SectionHeader } from './SectionHeader';

export function RewardsSection() {
  return (
    <section id="donations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="Donations" />
        
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <div className="space-y-4">
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
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from './SectionHeader';
import { animeSiteConfig } from '../content/animeSiteConfig';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="About the Series" />
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed whitespace-pre-line">
              {animeSiteConfig.synopsis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

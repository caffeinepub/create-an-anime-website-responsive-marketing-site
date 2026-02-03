import { animeSiteConfig } from '../content/animeSiteConfig';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/anime-hero-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
            {animeSiteConfig.title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 font-medium">
            {animeSiteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={scrollToAbout}
              className="px-8 py-4 bg-accent text-accent-foreground font-bold text-lg rounded-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg"
            >
              {animeSiteConfig.ctaButtons.primary}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('characters');
                if (element) {
                  const offset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="px-8 py-4 bg-background border-2 border-foreground text-foreground font-bold text-lg rounded-lg hover:bg-foreground hover:text-background transition-all transform hover:scale-105 shadow-lg"
            >
              {animeSiteConfig.ctaButtons.secondary}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-full p-2"
          aria-label="Scroll to content"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}

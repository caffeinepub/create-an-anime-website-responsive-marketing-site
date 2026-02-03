import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CharactersSection } from './components/CharactersSection';
import { WorldbuildingSection } from './components/WorldbuildingSection';
import { EpisodesSection } from './components/EpisodesSection';
import { ContactSection } from './components/ContactSection';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <HeroSection />
        <AboutSection />
        <CharactersSection />
        <WorldbuildingSection />
        <EpisodesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;

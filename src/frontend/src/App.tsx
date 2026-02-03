import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CharactersSection } from './components/CharactersSection';
import { WorldbuildingSection } from './components/WorldbuildingSection';
import { EpisodesSection } from './components/EpisodesSection';
import { ContactSection } from './components/ContactSection';
import { AdminSection } from './components/AdminSection';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <TopNav />
        <main>
          <HeroSection />
          <AboutSection />
          <CharactersSection />
          <WorldbuildingSection />
          <EpisodesSection />
          <ContactSection />
          <AdminSection />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { VideoSection } from './components/VideoSection';
import { AboutSection } from './components/AboutSection';
import { CharactersSection } from './components/CharactersSection';
import { CharacterMatchSection } from './components/CharacterMatchSection';
import { WorldbuildingSection } from './components/WorldbuildingSection';
import { ClansSection } from './components/ClansSection';
import { EpisodesSection } from './components/EpisodesSection';
import { RewardsSection } from './components/RewardsSection';
import { ContactSection } from './components/ContactSection';
import { AdminSection } from './components/AdminSection';
import { AdminDashboard } from './components/AdminDashboard';
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

export type SelectedEpisode = {
  number: number;
  title: string;
  videoSourceUrl?: string;
};

const isAdminRoute = window.location.pathname === '/admin';

function App() {
  const [selectedEpisode, setSelectedEpisode] = useState<SelectedEpisode | null>(null);

  if (isAdminRoute) {
    return (
      <QueryClientProvider client={queryClient}>
        <AdminDashboard />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <TopNav />
        <main>
          <HeroSection />
          <IntroSection />
          <VideoSection selectedEpisode={selectedEpisode} />
          <AboutSection />
          <CharactersSection />
          <CharacterMatchSection />
          <WorldbuildingSection />
          <ClansSection />
          <EpisodesSection onEpisodeSelect={setSelectedEpisode} />
          <RewardsSection />
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

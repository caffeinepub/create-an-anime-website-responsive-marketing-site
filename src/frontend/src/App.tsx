import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Episode } from "./backend";
import { AboutSection } from "./components/AboutSection";
import { AdminDashboard } from "./components/AdminDashboard";
import { CharacterMatchSection } from "./components/CharacterMatchSection";
import { CharactersSection } from "./components/CharactersSection";
import { ClansSection } from "./components/ClansSection";
import { ContactSection } from "./components/ContactSection";
import { ContentSection } from "./components/ContentSection";
import { EpisodesSection } from "./components/EpisodesSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { IntroSection } from "./components/IntroSection";
import { RewardsSection } from "./components/RewardsSection";
import { TopNav } from "./components/TopNav";
import { VideoSection } from "./components/VideoSection";
import { WorldbuildingSection } from "./components/WorldbuildingSection";
import { Toaster } from "./components/ui/sonner";

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

const isAdminRoute = window.location.pathname === "/admin";

function App() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Force dark mode globally
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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
          <ContentSection />
          <RewardsSection />
          <ContactSection />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from "react";
import VividCursor from "./components/cursor/VividCursor";
import VividLoader from "./components/loader/VividLoader";
import Hero from "./components/hero/Hero";
import useLenis from "./hooks/useLenis";
import Navigation from "./components/navigation/Navigation";
import Intro from "./components/intro/Intro";
import Services from "./components/services/Services";
import Sectors from "./components/sectors/Sectors";
import Projects from "./components/projects/Projects";
import Contact from "./components/contact/Contact";

function App() {
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useLenis();

  return (
    <>
      <VividCursor />

      {loading && <VividLoader onComplete={() => setLoading(false)} />}

      <Navigation />

      <main>
        <Hero />

        <Intro />

        <Services />

        <Sectors onSelectSector={setSelectedSector} />

        <Projects
          selectedSector={selectedSector}
          onClearSector={() => setSelectedSector(null)}
        />

        <Contact />
      </main>
    </>
  );
}

export default App;

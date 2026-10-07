import { useCallback, useState } from "react";
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
import Clients from "./components/clients/Clients";

function App() {
  const [loading, setLoading] = useState(true);

  // stable reference: the loader timeline must not restart on re-render
  const handleLoaded = useCallback(() => setLoading(false), []);

  useLenis();

  return (
    <>
      <VividCursor />

      {loading && <VividLoader onComplete={handleLoaded} />}

      <Navigation />

      <main>
        <Hero />

        <Intro />

        <Services />

        <Sectors />

        <Projects />

        <Clients />

        <Contact />
      </main>
    </>
  );
}

export default App;

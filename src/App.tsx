import { useState } from "react";
import VividCursor from "./components/cursor/VividCursor";
import VividLoader from "./components/loader/VividLoader";
import Hero from "./components/hero/Hero";
import useLenis from "./hooks/useLenis";
import Navigation from "./components/navigation/Navigation";
import Intro from "./components/intro/Intro";
import Sectors from "./components/sectors/Sectors";
import Projects from "./components/projects/Projects";
import Contact from "./components/contact/Contact";

function App() {
  const [loading, setLoading] = useState(true);

  useLenis();

  return (
    <>
      <VividCursor />

      {loading && <VividLoader onComplete={() => setLoading(false)} />}

      <Navigation />

      <main>
        <Hero />

        <Intro />

        <Sectors />

        <Projects />

        <Contact />
      </main>
    </>
  );
}

export default App;

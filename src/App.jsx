import { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import SkillTree from './components/SkillTree';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';

// La scène 3D (three.js, la partie la plus lourde du site) est chargée à part :
// le texte et la navigation s'affichent sans l'attendre.
const GlobalScene = lazy(() => import('./components/GlobalScene'));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary name="global-scene" silent>
        <Suspense fallback={null}>
          <GlobalScene />
        </Suspense>
      </ErrorBoundary>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <SkillTree />
        <Projects />
        <Timeline />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}

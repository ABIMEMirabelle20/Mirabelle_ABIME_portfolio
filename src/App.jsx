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
import GlobalScene from './components/GlobalScene';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <GlobalScene />
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

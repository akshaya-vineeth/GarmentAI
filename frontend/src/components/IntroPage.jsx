import React, { useEffect, useRef } from 'react';
import { Sparkles, Zap, Cpu, ImageIcon, ArrowRight, Wand2, Layers, ScanFace } from 'lucide-react';
import '../IntroPage.css';

const features = [
  {
    icon: <ScanFace size={28} />,
    title: 'Intelligent Model Generation',
    desc: 'Describe your target customer — age, body type, skin tone — and let AI create the perfect fitting model in seconds.',
  },
  {
    icon: <Wand2 size={28} />,
    title: 'LLM-Powered Prompting',
    desc: 'Mistral AI transforms your product specs into rich, detailed image prompts that capture every nuance of your garment.',
  },
  {
    icon: <Layers size={28} />,
    title: 'Garment-Aware Rendering',
    desc: 'Upload your clothing image and our pipeline preserves every stitch, pattern, and color in the final generated output.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Cloud Pipeline',
    desc: 'Powered by Hugging Face diffusion models for fast, high-quality photorealistic fashion imagery at scale.',
  },
];

const tech = ['React', 'FastAPI', 'Mistral AI', 'Stable Diffusion', 'Python', 'Hugging Face'];

export default function IntroPage({ onEnter }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="intro-root" ref={heroRef}>
      {/* Animated background orbs */}
      <div className="intro-orb intro-orb-1" />
      <div className="intro-orb intro-orb-2" />
      <div className="intro-orb intro-orb-3" />

      {/* Noise overlay */}
      <div className="intro-noise" />

      {/* Nav */}
      <nav className="intro-nav">
        <div className="intro-logo">
          <Sparkles size={24} color="#a78bfa" />
          GarmentAI
        </div>
        <span className="intro-badge">Beta</span>
      </nav>

      {/* Hero */}
      <section className="intro-hero">
        <div className="intro-pill">
          <Cpu size={14} />
          AI-Powered Fashion Visualization
        </div>

        <h1 className="intro-headline">
          Transform Garments
          <br />
          <span className="intro-gradient-text">Into Stunning Campaigns</span>
        </h1>

        <p className="intro-subtext">
          Upload your clothing, define your ideal customer, and watch GarmentAI generate
          photorealistic model imagery — no studio, no photoshoot, no waiting.
        </p>

        <div className="intro-cta-row">
          <button className="intro-cta-btn" onClick={onEnter} id="enter-app-btn">
            <ImageIcon size={18} />
            Launch the Studio
            <ArrowRight size={18} className="intro-arrow" />
          </button>
          <a
            className="intro-secondary-btn"
            href="https://github.com/akshaya-vineeth/GarmentAI"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>

        {/* Floating stat chips */}
        <div className="intro-stats">
          <div className="stat-chip">
            <span className="stat-num">~15s</span>
            <span className="stat-label">Generation Time</span>
          </div>
          <div className="stat-chip">
            <span className="stat-num">1024px</span>
            <span className="stat-label">Output Resolution</span>
          </div>
          <div className="stat-chip">
            <span className="stat-num">9+</span>
            <span className="stat-label">Model Attributes</span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="intro-features">
        <h2 className="intro-section-title">Everything You Need</h2>
        <div className="intro-feature-grid">
          {features.map((f) => (
            <div className="intro-feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="intro-stack">
        <p className="stack-label">Built with</p>
        <div className="stack-pills">
          {tech.map((t) => (
            <span className="stack-pill" key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="intro-bottom-cta">
        <h2>Ready to reimagine your product photography?</h2>
        <button className="intro-cta-btn intro-cta-large" onClick={onEnter} id="enter-app-btn-2">
          <Sparkles size={20} />
          Get Started — It's Free
        </button>
      </section>

      <footer className="intro-footer">
        <p>© 2025 GarmentAI · Built with ❤️ using React, FastAPI &amp; Mistral AI</p>
      </footer>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  History as HistoryIcon,
  HeartHandshake,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Layers
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import HeroVisual from '../components/home/HeroVisual';

interface HomeProps {
  setPage?: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  const diseaseClasses = [
    'Healthy Pomegranate',
    'Cercospora Spot',
    'Anthracnose',
    'Bacterial Blight',
    'Alternaria Rot',
  ];

  const features = [
    {
      icon: Activity,
      title: 'AI Detection',
      desc: 'Instant real-time classification using fine-tuned deep learning models on pomegranate crops.',
    },
    {
      icon: ShieldCheck,
      title: 'Expert Recommendations',
      desc: 'Actionable pesticide dosages, active ingredients, and safety precautions for crop recovery.',
    },
    {
      icon: HistoryIcon,
      title: 'Track History',
      desc: 'Seamlessly log and monitor your disease scan history across time to control orchard spread.',
    },
    {
      icon: HeartHandshake,
      title: 'Support Farmers',
      desc: 'Empowering growers with modern agricultural intelligence for maximized yields and profit.',
    },
  ];

  return (
    <div className="app-wrapper">
      <div className="ambient-orb ambient-orb-top-left" />
      <div className="ambient-orb ambient-orb-bottom-right" />

      <div className="app-content">
        <Navbar currentPage="home" setPage={setPage} />

        <main className="home-container">
          {/* HERO SECTION (#hero) */}
          <section id="hero" className="hero-section">
            <div>
              <div className="hero-badge">
                <Sparkles size={15} />
                <span>AI-Powered Precision Agriculture</span>
              </div>

              <h1 className="hero-title">
                Healthy <span>Pomegranates</span>, Stronger Farmers
              </h1>

              <p className="hero-subtitle">
                Detect pomegranate crop diseases using advanced AI vision. Get instant diagnosis,
                tailored pesticide recommendations, and protect your orchards for maximized yield.
              </p>

              <div className="hero-cta-group">
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setPage && setPage('signup')}
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>

                <a href="#about" className="btn btn-glass">
                  <span>Learn More</span>
                </a>
              </div>
            </div>

            {/* HERO VISUAL COMPOSITION */}
            <HeroVisual />
          </section>

          {/* FEATURES SECTION (#features) */}
          <section id="features">
            <div className="section-header">
              <h2 className="section-title">Smart Agriculture at Your Fingertips</h2>
              <p className="section-subtitle">
                Designed specifically for pomegranate cultivators and farm managers seeking rapid, accurate leaf & fruit diagnostics.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feat, index) => {
                const IconComponent = feat.icon;
                return (
                  <div key={index} className="glass-panel feature-card">
                    <div className="feature-icon-box">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="feature-card-title">{feat.title}</h3>
                    <p className="feature-card-desc">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ABOUT SECTION (#about) */}
          <section id="about">
            <div className="glass-panel about-card">
              <div>
                <div className="hero-badge">
                  <Layers size={14} />
                  <span>About FarmVision AI</span>
                </div>
                <h2 style={{ fontSize: '28px', marginBottom: '14px' }}>
                  Protecting Pomegranate Orchards with Computer Vision
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '18px' }}>
                  FarmVision AI utilizes convolutional neural networks trained on verified pomegranate fruit and leaf datasets.
                  Farmers can capture or upload an image directly from the field to immediately identify fungal and bacterial infections.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <CheckCircle size={16} color="var(--healthy-color)" />
                    <span>Real-time image classification with confidence scoring</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <CheckCircle size={16} color="var(--healthy-color)" />
                    <span>Scientifically verified pesticide dosages & fungicide sprays</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <CheckCircle size={16} color="var(--healthy-color)" />
                    <span>Historical records to monitor outbreak patterns</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel-subtle" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} className="text-purple" />
                  <span>Target Classifications</span>
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Our system evaluates both healthy tissues and major commercial threats:
                </p>
                <div className="disease-tag-list">
                  {diseaseClasses.map((item, i) => (
                    <span key={i} className="disease-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION (#contact) */}
          <section id="contact">
            <div className="glass-panel contact-card">
              <h2 style={{ fontSize: '26px', marginBottom: '10px' }}>Need Field Support or Technical Assistance?</h2>
              <p style={{ fontSize: '14px', maxWidth: '600px', margin: '0 auto 28px auto' }}>
                Our agronomy and technical support teams are dedicated to helping farmers achieve peak crop health and yield.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '30px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Mail size={18} className="text-purple" />
                  <span>support@farmvision.ai</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <Phone size={18} className="text-purple" />
                  <span>+1 (800) 555-FARM</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <MapPin size={18} className="text-purple" />
                  <span>Agricultural Research Center</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} FarmVision AI. Smart Disease Detection for Healthier Pomegranates. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;

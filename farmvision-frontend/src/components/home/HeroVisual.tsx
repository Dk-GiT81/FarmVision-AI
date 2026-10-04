import React from 'react';
import PomegranateArt from '../common/PomegranateArt';
import { Scan, ShieldCheck, Cpu } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  return (
    <div className="hero-visual-composition" aria-label="AI Pomegranate Crop Analysis Visual">
      {/* Ambient Radial Backlight */}
      <div className="hero-visual-glow" />

      {/* Main Glass Carrier Card */}
      <div className="glass-panel hero-glass-card">
        {/* Top Minimal Tech Bar */}
        <div className="hero-card-meta-bar">
          <div className="meta-pill">
            <span className="live-indicator-dot" />
            <Cpu size={12} className="meta-icon" />
            <span>ResNet-50 Vision Active</span>
          </div>
          <div className="meta-pill meta-pill-secondary">
            <ShieldCheck size={12} className="meta-icon text-healthy" />
            <span>5 Disease Classes</span>
          </div>
        </div>

        {/* Central Subject with Computer Vision Overlays */}
        <div className="hero-subject-wrapper">
          {/* Subtle Optical Scan Radar Ring */}
          <div className="optical-scanner-ring" />
          <div className="optical-pulse-ring" />

          {/* Corner Precision Reticles */}
          <div className="reticle-corner reticle-top-left" />
          <div className="reticle-corner reticle-top-right" />
          <div className="reticle-corner reticle-bottom-left" />
          <div className="reticle-corner reticle-bottom-right" />

          {/* Centered Pomegranate Artwork */}
          <div className="subject-art-container">
            <PomegranateArt size={250} />
          </div>

          {/* Subdued Scanning Beam */}
          <div className="scanner-sweep-line" />
        </div>

        {/* Bottom Minimal Diagnostic Badge */}
        <div className="hero-card-footer-pill">
          <Scan size={14} className="text-purple" />
          <span className="footer-pill-label">Diagnostic Target:</span>
          <span className="footer-pill-val">Punica Granatum (Pomegranate)</span>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;

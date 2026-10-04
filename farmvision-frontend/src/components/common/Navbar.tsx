import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentPage?: string;
  setPage?: (page: string) => void;
  showBackHome?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  showBackHome = false,
  setPage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (setPage) setPage('home');
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-wrapper">
      <Link
        to="/"
        className="navbar-brand"
        style={{ textDecoration: 'none' }}
        onClick={() => setPage && setPage('home')}
      >
        <div className="navbar-brand-icon">
          <BrandLogo size={22} />
        </div>
        <span>FarmVision AI</span>
      </Link>

      {!showBackHome && (
        <ul className="navbar-links">
          <li>
            <a
              href="#hero"
              className="navbar-link"
              onClick={(e) => handleAnchorClick(e, 'hero')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="navbar-link"
              onClick={(e) => handleAnchorClick(e, 'about')}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#features"
              className="navbar-link"
              onClick={(e) => handleAnchorClick(e, 'features')}
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="navbar-link"
              onClick={(e) => handleAnchorClick(e, 'contact')}
            >
              Contact
            </a>
          </li>
        </ul>
      )}

      <div className="navbar-actions">
        <ThemeToggle />

        {showBackHome ? (
          <Link
            to="/"
            className="btn btn-glass btn-sm"
            onClick={() => setPage && setPage('home')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-glass btn-sm"
              onClick={() => setPage && setPage('login')}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm"
              onClick={() => setPage && setPage('signup')}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

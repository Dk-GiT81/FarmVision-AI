import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App, { AppContent } from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PredictionResult from './components/upload/PredictionResult';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { User, PredictionResult as PredictionResultType } from './types';

// Helper to render with Theme and Notification providers
const renderWithProviders = (ui: React.ReactElement, routerProps?: { initialEntries?: string[] }) => {
  return render(
    <MemoryRouter {...routerProps}>
      <ThemeProvider>
        <NotificationProvider>
          {ui}
        </NotificationProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

beforeEach(() => {
  window.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

describe('FarmVision AI Frontend Verification', () => {
  test('1. renders FarmVision AI branding and Home page', () => {
    renderWithProviders(<Home setPage={jest.fn()} />);
    expect(screen.getAllByText(/FarmVision AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart Agriculture at Your Fingertips/i)).toBeInTheDocument();
  });

  test('2. renders Login page with email and password inputs', () => {
    renderWithProviders(<Login setUser={jest.fn()} setPage={jest.fn()} />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('3. renders Register (Signup) page with simplified user registration (no admin selector)', () => {
    renderWithProviders(<Signup setPage={jest.fn()} />);
    expect(screen.getAllByText(/Create Account/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Ramesh Patil/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    // Admin selector must not exist on the public registration page
    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });

  test('4. renders Farmer Dashboard Overview (/dashboard) with real stats and quick actions', () => {
    const mockFarmer: User = {
      name: 'Ramesh Farmer',
      email: 'ramesh@farm.com',
      role: 'farmer',
    };

    renderWithProviders(
      <Dashboard
        user={mockFarmer}
        onLogout={jest.fn()}
        refreshTrigger={0}
        setRefreshTrigger={jest.fn()}
      />,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getAllByText(/Ramesh Farmer/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Total Scans/i)).toBeInTheDocument();
    expect(screen.getByText(/Diseases Detected/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Detect Disease/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Recent Predictions/i).length).toBeGreaterThan(0);
  });

  test('4b. renders dedicated AI Detection Workspace (/dashboard/upload)', () => {
    const mockFarmer: User = {
      name: 'Ramesh Farmer',
      email: 'ramesh@farm.com',
      role: 'farmer',
    };

    renderWithProviders(
      <Dashboard
        user={mockFarmer}
        onLogout={jest.fn()}
        refreshTrigger={0}
        setRefreshTrigger={jest.fn()}
      />,
      { initialEntries: ['/dashboard/upload'] }
    );

    expect(screen.getAllByText(/AI Disease Detection/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload \/ Browse Image/i })).toBeInTheDocument();
    expect(screen.getByText(/Prediction Result/i)).toBeInTheDocument();
  });

  test('5. renders PredictionResult empty state and loading state', () => {
    const { rerender } = render(<PredictionResult result={null} loading={false} />);
    expect(screen.getByText(/No prediction yet/i)).toBeInTheDocument();

    rerender(<PredictionResult result={null} loading={true} />);
    expect(screen.getByText(/Analyzing Image.../i)).toBeInTheDocument();
  });

  test('6. renders PredictionResult with diagnosis, confidence, pesticide, and precautions', () => {
    const mockResult: PredictionResultType = {
      disease: 'bacterial_blight',
      confidence: 94.5,
      diagnosis: 'Bacterial blight infection detected on pomegranate fruit.',
      recommended_pesticide: 'Copper oxychloride or Streptocycline spray',
      precaution: 'Use disease-free planting material and ensure proper drainage.',
    };

    render(<PredictionResult result={mockResult} loading={false} />);

    expect(screen.getAllByText(/bacterial blight/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/94.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/Bacterial blight infection detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Copper oxychloride or Streptocycline spray/i)).toBeInTheDocument();
    expect(screen.getByText(/Use disease-free planting material/i)).toBeInTheDocument();
  });

  test('7. renders Admin Dashboard with admin privileges and stats cards', () => {
    const mockAdmin: User = {
      name: 'Admin User',
      email: 'admin@farmvision.com',
      role: 'admin',
    };

    renderWithProviders(
      <Dashboard
        user={mockAdmin}
        onLogout={jest.fn()}
        refreshTrigger={0}
        setRefreshTrigger={jest.fn()}
      />,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getAllByText(/Admin Dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Predictions/i)).toBeInTheDocument();
    expect(screen.getByText(/Diseased Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Healthy Cases/i)).toBeInTheDocument();
  });

  test('8. renders ThemeProvider and mounts top-level App with React Router', () => {
    render(
      <ThemeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    );

    const brandTitles = screen.getAllByText(/FarmVision AI/i);
    expect(brandTitles.length).toBeGreaterThan(0);
  });

  test('9. redirects unauthenticated user visiting /dashboard to /login', () => {
    renderWithProviders(
      <AppContent user={null} setUser={jest.fn()} handleLogout={jest.fn()} />,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('10. redirects legacy /signup path to /register', () => {
    renderWithProviders(
      <AppContent user={null} setUser={jest.fn()} handleLogout={jest.fn()} />,
      { initialEntries: ['/signup'] }
    );

    expect(screen.getAllByText(/Create Account/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Ramesh Patil/i)).toBeInTheDocument();
  });

  test('11. redirects unknown path to Home landing page', () => {
    renderWithProviders(
      <AppContent user={null} setUser={jest.fn()} handleLogout={jest.fn()} />,
      { initialEntries: ['/unknown-random-route'] }
    );

    expect(screen.getAllByText(/FarmVision AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  test('12. redirects authenticated user visiting /login to /dashboard', () => {
    const mockFarmer: User = {
      name: 'Suresh Farmer',
      email: 'suresh@farm.com',
      role: 'farmer',
    };

    renderWithProviders(
      <AppContent user={mockFarmer} setUser={jest.fn()} handleLogout={jest.fn()} />,
      { initialEntries: ['/login'] }
    );

    expect(screen.getAllByText(/Suresh Farmer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Detect Disease/i).length).toBeGreaterThan(0);
  });
});

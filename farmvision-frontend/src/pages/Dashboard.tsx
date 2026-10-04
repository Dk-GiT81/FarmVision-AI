import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, HistoryItem, PredictionResult as PredictionResultType, AdminStats } from '../types';
import Sidebar from '../components/common/Sidebar';
import TopHeader from '../components/common/TopHeader';
import FarmerOverview from '../components/dashboard/FarmerOverview';
import AIDetectionWorkspace from '../components/dashboard/AIDetectionWorkspace';
import RecentPredictionsTable from '../components/history/RecentPredictionsTable';
import History from '../components/history/History';
import AdminStatsCards from '../components/analytics/AdminStatsCards';
import DiseaseAnalytics from '../components/analytics/DiseaseAnalytics';
import { getHistory, clearHistory } from '../services/api';
import { Shield, Users, UserCheck } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { UserRole } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  refreshTrigger?: number;
  setRefreshTrigger?: React.Dispatch<React.SetStateAction<number>>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error: notifyError } = useNotification();

  // Authoritative admin access check: only admin@farmvision.com can access admin views
  const effectiveRole: UserRole = useMemo(() => {
    if (user.role === 'admin' && user.email.toLowerCase() === 'admin@farmvision.com') {
      return 'admin';
    }
    return 'farmer';
  }, [user.role, user.email]);

  const [localRefreshTrigger, setLocalRefreshTrigger] = useState<number>(0);
  const currentRefreshTrigger = refreshTrigger ?? localRefreshTrigger;
  const currentSetRefreshTrigger = setRefreshTrigger ?? setLocalRefreshTrigger;

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [predictionLoading, setPredictionLoading] = useState<boolean>(false);

  // Sync activeTab dynamically from URL pathname
  const activeTab = useMemo(() => {
    const path = location.pathname.replace(/\/$/, '');
    const parts = path.split('/');
    if (parts.length > 2 && parts[1] === 'dashboard') {
      return parts[2]; // 'upload', 'history', 'analytics', 'users', 'all_predictions', 'profile'
    }
    return 'dashboard';
  }, [location.pathname]);

  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  }, [navigate]);

  // Load history data whenever user or currentRefreshTrigger changes
  const fetchAllHistory = useCallback(async () => {
    try {
      const data = await getHistory(user.email, effectiveRole);
      setHistoryData(data);
    } catch (err) {
      console.error('Error fetching dashboard history:', err);
    }
  }, [user.email, effectiveRole]);

  useEffect(() => {
    fetchAllHistory();
  }, [fetchAllHistory, currentRefreshTrigger]);

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setPredictionResult(null);
      await fetchAllHistory();
      currentSetRefreshTrigger((prev) => prev + 1);
      success('Prediction history cleared successfully.');
    } catch (err) {
      console.error('Error clearing history:', err);
      notifyError('Unable to clear prediction history. Please try again.');
    }
  };

  // Compute Admin Stats dynamically from actual history data
  const adminStats: AdminStats = useMemo(() => {
    const totalPredictions = historyData.length;
    const uniqueEmails = new Set(
      historyData.map((item) => item.user_email).filter((email) => Boolean(email && email !== 'unknown'))
    );
    // At least the current logged-in user if emails are logged
    const totalUsers = Math.max(uniqueEmails.size, 1);

    let healthyCases = 0;
    let diseasedCases = 0;

    historyData.forEach((item) => {
      if (item.disease.toLowerCase() === 'healthy') {
        healthyCases += 1;
      } else {
        diseasedCases += 1;
      }
    });

    const healthyPercentage =
      totalPredictions > 0 ? Math.round((healthyCases / totalPredictions) * 100) : 0;
    const diseasedPercentage =
      totalPredictions > 0 ? Math.round((diseasedCases / totalPredictions) * 100) : 0;

    return {
      totalUsers,
      totalPredictions,
      diseasedCases,
      healthyCases,
      healthyPercentage,
      diseasedPercentage,
    };
  }, [historyData]);

  // List of unique active user records for Admin "User Management" tab
  const activeUserList = useMemo(() => {
    const map = new Map<string, { email: string; scanCount: number; lastActive: string }>();
    historyData.forEach((item) => {
      const email = item.user_email || 'anonymous';
      if (!map.has(email)) {
        map.set(email, {
          email,
          scanCount: 1,
          lastActive: item.timestamp,
        });
      } else {
        const entry = map.get(email)!;
        entry.scanCount += 1;
      }
    });
    return Array.from(map.values());
  }, [historyData]);

  return (
    <div className="app-wrapper">
      <div className="ambient-orb ambient-orb-top-left" />
      <div className="ambient-orb ambient-orb-bottom-right" />

      <div className="app-content dashboard-layout">
        {/* REUSABLE SIDEBAR */}
        <Sidebar
          role={effectiveRole}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={onLogout}
        />

        {/* MAIN DASHBOARD CONTENT */}
        <div className="dashboard-main">
          <TopHeader user={user} />

          <main className="dashboard-content">
            {/* FARMER / USER DASHBOARD VIEW */}
            {effectiveRole === 'farmer' && (
              <>
                {/* TAB: DASHBOARD (Farmer Overview) */}
                {activeTab === 'dashboard' && (
                  <FarmerOverview
                    user={user}
                    historyData={historyData}
                    onNavigate={handleTabChange}
                  />
                )}

                {/* TAB: UPLOAD / DETECT DISEASE (Dedicated AI Detection Workspace) */}
                {activeTab === 'upload' && (
                  <AIDetectionWorkspace
                    user={user}
                    predictionResult={predictionResult}
                    predictionLoading={predictionLoading}
                    setPredictionResult={setPredictionResult}
                    setPredictionLoading={setPredictionLoading}
                    setRefreshTrigger={currentSetRefreshTrigger}
                  />
                )}

                {/* TAB: FULL HISTORY */}
                {activeTab === 'history' && (
                  <History
                    user={user}
                    refreshTrigger={currentRefreshTrigger}
                    onDataLoaded={setHistoryData}
                  />
                )}

                {/* TAB: PROFILE (View-only for existing user information) */}
                {activeTab === 'profile' && (
                  <div className="glass-panel" style={{ padding: '36px', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-title-row" style={{ marginBottom: '24px' }}>
                      <h3>
                        <UserCheck size={20} className="text-purple" />
                        <span>Farmer Profile</span>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="result-detail-box">
                        <div className="result-label">Name</div>
                        <div className="result-value">{user.name}</div>
                      </div>
                      <div className="result-detail-box">
                        <div className="result-label">Email Address</div>
                        <div className="result-value">{user.email}</div>
                      </div>
                      <div className="result-detail-box">
                        <div className="result-label">Role</div>
                        <div className="result-value" style={{ textTransform: 'capitalize' }}>
                          Farmer (Crop Caretaker)
                        </div>
                      </div>
                      <div className="result-detail-box">
                        <div className="result-label">Total Predictions Made</div>
                        <div className="result-value">{historyData.length} scans</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ADMIN DASHBOARD VIEW (Panel 5) */}
            {effectiveRole === 'admin' && (
              <>
                {/* ADMIN WELCOME BANNER */}
                <div className="welcome-banner">
                  <div className="welcome-banner-text">
                    <h2>
                      <Shield size={24} className="text-purple" />
                      <span>Admin Dashboard</span>
                    </h2>
                    <p>Overview of system usage, predictions, and agricultural diagnostics activity.</p>
                  </div>
                </div>

                {/* 4 STAT METRIC CARDS (Panel 5) */}
                <AdminStatsCards stats={adminStats} />

                {/* TAB: MAIN ADMIN DASHBOARD */}
                {activeTab === 'dashboard' && (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.05fr 0.95fr',
                        gap: '24px',
                        marginBottom: '32px',
                      }}
                    >
                      <DiseaseAnalytics historyData={historyData} />
                      <RecentPredictionsTable
                        historyData={historyData}
                        onClearHistory={handleClearHistory}
                        showUserEmail={true}
                      />
                    </div>
                  </>
                )}

                {/* TAB: PREDICTION ANALYTICS */}
                {activeTab === 'analytics' && (
                  <div style={{ marginBottom: '32px' }}>
                    <DiseaseAnalytics historyData={historyData} />
                  </div>
                )}

                {/* TAB: ALL PREDICTIONS / FULL HISTORY */}
                {activeTab === 'all_predictions' && (
                  <History
                    user={user}
                    refreshTrigger={currentRefreshTrigger}
                    onDataLoaded={setHistoryData}
                  />
                )}

                {/* TAB: USER MANAGEMENT (Activity logs derived from existing history) */}
                {activeTab === 'users' && (
                  <div className="glass-panel table-panel">
                    <div className="card-title-row">
                      <h3>
                        <Users size={20} className="text-purple" />
                        <span>Registered / Active Users</span>
                      </h3>
                    </div>

                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Email</th>
                            <th>Scans Performed</th>
                            <th>Last Active Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeUserList.map((usr, idx) => (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td style={{ fontWeight: 600 }}>{usr.email}</td>
                              <td>{usr.scanCount}</td>
                              <td style={{ color: 'var(--text-muted)' }}>{usr.lastActive}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB: ADMIN PROFILE */}
                {activeTab === 'profile' && (
                  <div className="glass-panel" style={{ padding: '36px', maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-title-row" style={{ marginBottom: '24px' }}>
                      <h3>
                        <Shield size={20} className="text-purple" />
                        <span>Administrator Profile</span>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="result-detail-box">
                        <div className="result-label">Admin Name</div>
                        <div className="result-value">{user.name || 'System Administrator'}</div>
                      </div>
                      <div className="result-detail-box">
                        <div className="result-label">Email Address</div>
                        <div className="result-value">{user.email}</div>
                      </div>
                      <div className="result-detail-box">
                        <div className="result-label">Role Privilege</div>
                        <div className="result-value">Administrator (Full Analytics & History Access)</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useMemo } from 'react';
import { User, HistoryItem } from '../../types';
import {
  Sparkles,
  UploadCloud,
  History as HistoryIcon,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FarmerOverviewProps {
  user: User;
  historyData: HistoryItem[];
  onNavigate: (tab: string) => void;
}

export const FarmerOverview: React.FC<FarmerOverviewProps> = ({
  user,
  historyData,
  onNavigate,
}) => {
  // Derive real statistics strictly from existing history data
  const stats = useMemo(() => {
    const totalScans = historyData.length;
    let healthyCount = 0;
    let diseasedCount = 0;

    historyData.forEach((item) => {
      if (item.disease.toLowerCase() === 'healthy') {
        healthyCount += 1;
      } else {
        diseasedCount += 1;
      }
    });

    const latestScan = historyData.length > 0 ? historyData[0] : null;

    return {
      totalScans,
      healthyCount,
      diseasedCount,
      latestScan,
    };
  }, [historyData]);

  const formatDisease = (disease: string) => {
    return disease
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const formatDate = (rawTimestamp: string) => {
    try {
      const date = new Date(rawTimestamp);
      if (isNaN(date.getTime())) {
        return rawTimestamp || 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return rawTimestamp || 'N/A';
    }
  };

  const getPesticideHint = (disease: string) => {
    const d = disease.toLowerCase();
    if (d === 'healthy') return 'Maintenance & balanced nutrients';
    if (d === 'anthracnose') return 'Carbendazim 50% WP';
    if (d === 'bacterial_blight') return 'Streptocycline spray';
    if (d === 'cercospora') return 'Mancozeb fungicide';
    if (d === 'alternaria') return 'Azoxystrobin treatment';
    return 'Standard recommendation';
  };

  const recentPredictions = useMemo(() => {
    return historyData.slice(0, 5);
  }, [historyData]);

  return (
    <div className="farmer-overview-container">
      {/* 1. WELCOME BANNER */}
      <div className="welcome-banner">
        <div className="welcome-banner-text">
          <h2>
            <Sparkles size={24} className="text-purple" />
            <span>Welcome back, {user.name || 'Farmer'}!</span>
          </h2>
          <p>Monitor your pomegranate health and recent AI insights.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate('upload')}
          style={{ gap: '8px', padding: '12px 20px', borderRadius: '12px' }}
        >
          <UploadCloud size={18} />
          <span>Detect Disease</span>
        </button>
      </div>

      {/* 2. REAL STATISTICS CARDS */}
      <div className="dashboard-stats-grid">
        {/* Total Scans */}
        <div className="glass-panel stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Scans</span>
            <div className="stat-card-icon icon-purple">
              <Activity size={18} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalScans}</div>
          <div className="stat-card-desc">Lifetime diagnostic scans recorded</div>
        </div>

        {/* Healthy Crops */}
        <div className="glass-panel stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Healthy</span>
            <div className="stat-card-icon icon-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-card-value text-healthy">{stats.healthyCount}</div>
          <div className="stat-card-desc">
            {stats.totalScans > 0
              ? `${Math.round((stats.healthyCount / stats.totalScans) * 100)}% of orchard samples sound`
              : 'Zero scan records'}
          </div>
        </div>

        {/* Diseases Detected */}
        <div className="glass-panel stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Diseases Detected</span>
            <div className="stat-card-icon icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-card-value text-disease">{stats.diseasedCount}</div>
          <div className="stat-card-desc">
            {stats.totalScans > 0
              ? `${Math.round((stats.diseasedCount / stats.totalScans) * 100)}% requiring agronomic care`
              : 'Zero infection records'}
          </div>
        </div>

        {/* Latest Scan */}
        <div className="glass-panel stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Latest Scan</span>
            <div className="stat-card-icon icon-blue">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '18px', textTransform: 'capitalize' }}>
            {stats.latestScan ? formatDisease(stats.latestScan.disease) : 'No scans yet'}
          </div>
          <div className="stat-card-desc">
            {stats.latestScan
              ? `${stats.latestScan.confidence}% confidence • ${formatDate(stats.latestScan.timestamp)}`
              : 'Ready for initial diagnostic'}
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS GRID */}
      <div className="quick-actions-row">
        {/* Quick Action 1: Detect Disease */}
        <div
          className="glass-panel quick-action-card action-detect"
          onClick={() => onNavigate('upload')}
        >
          <div className="quick-action-icon-circle action-icon-detect">
            <UploadCloud size={24} />
          </div>
          <div className="quick-action-content">
            <div className="quick-action-title">
              <span>Detect Disease</span>
              <span className="badge badge-purple" style={{ fontSize: '10px' }}>Primary</span>
            </div>
            <p className="quick-action-desc">
              Upload fruit or leaf photo for real-time convolutional neural network disease classification.
            </p>
          </div>
          <div className="quick-action-arrow">
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Quick Action 2: View History */}
        <div
          className="glass-panel quick-action-card action-history"
          onClick={() => onNavigate('history')}
        >
          <div className="quick-action-icon-circle action-icon-history">
            <HistoryIcon size={24} />
          </div>
          <div className="quick-action-content">
            <div className="quick-action-title">
              <span>View History</span>
              <span className="badge badge-subtle" style={{ fontSize: '10px' }}>Full Records</span>
            </div>
            <p className="quick-action-desc">
              Filter by date, search specific diseases, sort by confidence, and review historical treatments.
            </p>
          </div>
          <div className="quick-action-arrow">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>

      {/* 4. RECENT PREDICTIONS (LATEST 5) */}
      <div className="glass-panel recent-predictions-panel">
        <div className="card-title-row" style={{ marginBottom: '18px' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} className="text-purple" />
              <span>Recent Predictions</span>
              <span className="badge badge-subtle" style={{ fontSize: '11px', marginLeft: '6px' }}>
                Latest 5 Scans
              </span>
            </h3>
            <p className="card-subtitle" style={{ margin: '3px 0 0 0' }}>
              Your most recent pomegranate health diagnostics and agronomic suggestions.
            </p>
          </div>

          {historyData.length > 0 && (
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={() => onNavigate('history')}
              style={{ gap: '6px' }}
            >
              <span>View All History</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {recentPredictions.length === 0 ? (
          <div className="empty-recent-state">
            <AlertCircle size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5, color: 'var(--accent-purple)' }} />
            <h4 style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              No crop predictions yet
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 16px auto' }}>
              Upload your first pomegranate leaf or fruit image to get instant AI disease diagnosis and expert recommendations.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('upload')}
              style={{ gap: '6px' }}
            >
              <UploadCloud size={16} />
              <span>Detect First Disease</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Date</th>
                  <th>Disease</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Recommendation Hint</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((item, index) => {
                  const isHealthy = item.disease.toLowerCase() === 'healthy';
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {formatDate(item.timestamp)}
                      </td>
                      <td>
                        <span className={`badge ${isHealthy ? 'badge-healthy' : 'badge-disease'}`}>
                          {formatDisease(item.disease)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.confidence}%
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: isHealthy ? 'var(--healthy-bg)' : 'var(--disease-bg)',
                            color: isHealthy ? 'var(--healthy-color)' : 'var(--disease-color)',
                          }}
                        >
                          {isHealthy ? 'Optimal' : 'Action Needed'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {getPesticideHint(item.disease)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border-subtle)' }}>
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => onNavigate('history')}
                style={{ gap: '6px' }}
              >
                <span>View All History</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerOverview;

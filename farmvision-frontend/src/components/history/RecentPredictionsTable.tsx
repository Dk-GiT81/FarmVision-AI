import React from 'react';
import { HistoryItem } from '../../types';
import { Trash2, AlertCircle } from 'lucide-react';

interface RecentPredictionsTableProps {
  historyData: HistoryItem[];
  onClearHistory?: () => void;
  showUserEmail?: boolean;
}

export const RecentPredictionsTable: React.FC<RecentPredictionsTableProps> = ({
  historyData,
  onClearHistory,
  showUserEmail = false,
}) => {
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
        return rawTimestamp;
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return rawTimestamp;
    }
  };

  const getPesticideHint = (disease: string) => {
    const d = disease.toLowerCase();
    if (d === 'healthy') return 'Maintain balanced nutrition';
    if (d === 'anthracnose') return 'Carbendazim 50% WP';
    if (d === 'bacterial_blight') return 'Streptocycline spray';
    if (d === 'cercospora') return 'Mancozeb (2.5 g/L)';
    if (d === 'alternaria') return 'Azoxystrobin fungicide';
    return 'Standard pesticide';
  };

  return (
    <div className="glass-panel table-panel">
      <div className="card-title-row">
        <h3>
          <span>Recent Predictions</span>
        </h3>
        {onClearHistory && historyData.length > 0 && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onClearHistory}
            title="Clear all predictions from history"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {historyData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 10px auto', opacity: 0.6 }} />
          <p>No predictions recorded yet</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                {showUserEmail && <th>User Email</th>}
                <th>Disease</th>
                <th>Confidence</th>
                <th>Recommendation</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {historyData.slice(0, 10).map((item, index) => {
                const isHealthy = item.disease.toLowerCase() === 'healthy';
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                    {showUserEmail && (
                      <td style={{ fontWeight: 500 }}>{item.user_email || 'N/A'}</td>
                    )}
                    <td>
                      <span className={`badge ${isHealthy ? 'badge-healthy' : 'badge-disease'}`}>
                        {formatDisease(item.disease)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.confidence}%</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {getPesticideHint(item.disease)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {formatDate(item.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentPredictionsTable;


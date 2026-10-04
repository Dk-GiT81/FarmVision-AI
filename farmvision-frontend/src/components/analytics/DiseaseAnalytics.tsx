import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { HistoryItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, AlertCircle } from 'lucide-react';

interface DiseaseAnalyticsProps {
  historyData: HistoryItem[];
}

export const DiseaseAnalytics: React.FC<DiseaseAnalyticsProps> = ({ historyData }) => {
  const { theme } = useTheme();

  const count: Record<string, number> = {};
  historyData.forEach((item) => {
    if (item.disease) {
      count[item.disease] = (count[item.disease] || 0) + 1;
    }
  });

  const formatLabel = (name: string) => {
    return name
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const chartData = Object.keys(count).map((key) => ({
    disease: formatLabel(key),
    rawDisease: key.toLowerCase(),
    count: count[key],
  }));

  const getBarColor = (rawDisease: string) => {
    if (rawDisease === 'healthy') return '#10b981';
    if (rawDisease === 'anthracnose') return '#ec4899';
    if (rawDisease === 'bacterial_blight') return '#f59e0b';
    if (rawDisease === 'cercospora') return '#8b5cf6';
    if (rawDisease === 'alternaria') return '#6366f1';
    return '#8b5cf6';
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', height: '100%' }}>
      <div className="card-title-row">
        <h3>
          <BarChart3 size={20} className="text-purple" />
          <span>Disease Distribution</span>
        </h3>
      </div>

      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 10px auto', opacity: 0.6 }} />
          <p>No analytics data available yet</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 320, marginTop: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.15)'}
                vertical={false}
              />
              <XAxis
                dataKey="disease"
                stroke={theme === 'dark' ? '#cbd5e1' : '#64748b'}
                tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b', fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                stroke={theme === 'dark' ? '#cbd5e1' : '#64748b'}
                tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#64748b', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#181432' : '#ffffff',
                  borderColor: theme === 'dark' ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  color: theme === 'dark' ? '#ffffff' : '#1e1b4b',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rawDisease)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DiseaseAnalytics;


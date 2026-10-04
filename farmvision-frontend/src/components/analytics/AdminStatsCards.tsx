import React from 'react';
import { Users, BarChart2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AdminStats } from '../../types';

interface AdminStatsCardsProps {
  stats: AdminStats;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
  return (
    <div className="admin-stats-grid">
      {/* 1. Total Users */}
      <div className="glass-panel admin-stat-card">
        <div className="stat-icon-circle stat-icon-purple">
          <Users size={24} />
        </div>
        <div className="stat-content-box">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-subtext">Active system users</div>
        </div>
      </div>

      {/* 2. Total Predictions */}
      <div className="glass-panel admin-stat-card">
        <div className="stat-icon-circle stat-icon-blue">
          <BarChart2 size={24} />
        </div>
        <div className="stat-content-box">
          <div className="stat-label">Total Predictions</div>
          <div className="stat-value">{stats.totalPredictions.toLocaleString()}</div>
          <div className="stat-subtext">Cumulative scans analyzed</div>
        </div>
      </div>

      {/* 3. Diseased Cases */}
      <div className="glass-panel admin-stat-card">
        <div className="stat-icon-circle stat-icon-red">
          <AlertTriangle size={24} />
        </div>
        <div className="stat-content-box">
          <div className="stat-label">Diseased Cases</div>
          <div className="stat-value">{stats.diseasedCases.toLocaleString()}</div>
          <div className="stat-subtext">
            {stats.diseasedPercentage}% of total scans
          </div>
        </div>
      </div>

      {/* 4. Healthy Cases */}
      <div className="glass-panel admin-stat-card">
        <div className="stat-icon-circle stat-icon-green">
          <ShieldCheck size={24} />
        </div>
        <div className="stat-content-box">
          <div className="stat-label">Healthy Cases</div>
          <div className="stat-value">{stats.healthyCases.toLocaleString()}</div>
          <div className="stat-subtext">
            {stats.healthyPercentage}% of total scans
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCards;


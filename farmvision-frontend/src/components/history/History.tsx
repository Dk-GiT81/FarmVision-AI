import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { HistoryItem, User } from '../../types';
import { clearHistory as apiClearHistory, getHistory } from '../../services/api';
import {
  Trash2,
  AlertCircle,
  Search,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface HistoryProps {
  refreshTrigger: number;
  user: User;
  onDataLoaded?: (data: HistoryItem[]) => void;
}

type DateFilterOption = 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'month';
type SortOption = 'newest' | 'oldest' | 'highest_confidence' | 'lowest_confidence';

export const History: React.FC<HistoryProps> = ({
  refreshTrigger,
  user,
  onDataLoaded,
}) => {
  const { success, error: notifyError } = useNotification();
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search, Filter, Sort, Pagination state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const pageSize = 10;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const historyList = await getHistory(user.email, user.role);
      setData(historyList);
      if (onDataLoaded) {
        onDataLoaded(historyList);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      notifyError('Unable to load prediction history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user.email, user.role, onDataLoaded, notifyError]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshTrigger]);

  const handleClearHistory = async () => {
    try {
      await apiClearHistory();
      setData([]);
      setIsConfirmingClear(false);
      success('Prediction history cleared successfully.');
      await fetchHistory();
    } catch (error) {
      console.error('Failed to clear history:', error);
      notifyError('Unable to clear prediction history. Please try again.');
    }
  };

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
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return rawTimestamp || 'N/A';
    }
  };

  const getPesticideHint = (disease: string) => {
    const d = disease.toLowerCase();
    if (d === 'healthy') return 'No pesticide required';
    if (d === 'anthracnose') return 'Carbendazim 50% WP';
    if (d === 'bacterial_blight') return 'Streptocycline spray';
    if (d === 'cercospora') return 'Mancozeb fungicide';
    if (d === 'alternaria') return 'Azoxystrobin or Difenoconazole';
    return 'Standard treatment';
  };

  // Compact Summary Calculation
  const summary = useMemo(() => {
    const total = data.length;
    let healthy = 0;
    let diseased = 0;

    data.forEach((item) => {
      if (item.disease.toLowerCase() === 'healthy') {
        healthy += 1;
      } else {
        diseased += 1;
      }
    });

    const latest = data.length > 0 ? data[data.length - 1] : null;

    return { total, healthy, diseased, latest };
  }, [data]);

  // Date filtering and text searching
  const filteredAndSortedData = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return data
      .filter((item) => {
        // Search filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const diseaseMatch = item.disease.toLowerCase().includes(term);
          const emailMatch = item.user_email?.toLowerCase().includes(term);
          if (!diseaseMatch && !emailMatch) return false;
        }

        // Date filter
        if (dateFilter === 'all') return true;

        const itemDate = new Date(item.timestamp);
        if (isNaN(itemDate.getTime())) return true; // keep if timestamp unparseable

        if (dateFilter === 'today') {
          return itemDate >= startOfToday;
        }
        if (dateFilter === 'yesterday') {
          return itemDate >= startOfYesterday && itemDate < startOfToday;
        }
        if (dateFilter === '7days') {
          return itemDate >= sevenDaysAgo;
        }
        if (dateFilter === '30days') {
          return itemDate >= thirtyDaysAgo;
        }
        if (dateFilter === 'month') {
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          const tA = new Date(a.timestamp).getTime() || 0;
          const tB = new Date(b.timestamp).getTime() || 0;
          return tB - tA;
        }
        if (sortBy === 'oldest') {
          const tA = new Date(a.timestamp).getTime() || 0;
          const tB = new Date(b.timestamp).getTime() || 0;
          return tA - tB;
        }
        if (sortBy === 'highest_confidence') {
          return b.confidence - a.confidence;
        }
        if (sortBy === 'lowest_confidence') {
          return a.confidence - b.confidence;
        }
        return 0;
      });
  }, [data, searchTerm, dateFilter, sortBy]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  return (
    <div className="glass-panel" style={{ padding: '28px', marginTop: '20px' }}>
      {/* HEADER ROW */}
      <div className="card-title-row" style={{ flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} className="text-purple" />
            <span>Prediction History</span>
          </h3>
          <p className="card-subtitle" style={{ margin: '4px 0 0 0' }}>
            Inspect, filter, and track verified pomegranate crop disease diagnostic scans.
          </p>
        </div>

        {data.length > 0 && (
          <div>
            {!isConfirmingClear ? (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setIsConfirmingClear(true)}
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--disease-color)' }}>
                  Clear all records?
                </span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleClearHistory}
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  className="btn btn-glass btn-sm"
                  onClick={() => setIsConfirmingClear(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPACT SUMMARY CARDS */}
      {data.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '22px',
          }}
        >
          <div className="glass-panel-subtle" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL SCANS</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {summary.total}
            </div>
          </div>
          <div className="glass-panel-subtle" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--healthy-color)' }}>HEALTHY</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--healthy-color)', marginTop: '2px' }}>
              {summary.healthy}
            </div>
          </div>
          <div className="glass-panel-subtle" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--disease-color)' }}>DISEASED</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--disease-color)', marginTop: '2px' }}>
              {summary.diseased}
            </div>
          </div>
          <div className="glass-panel-subtle" style={{ padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-purple)' }}>LATEST SCAN</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {summary.latest ? formatDisease(summary.latest.disease) : 'None'}
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SORT TOOLBAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 220px', minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by disease or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '13px' }}
          />
        </div>

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={16} className="text-purple" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
            className="input-field"
            style={{ height: '40px', padding: '0 12px', fontSize: '13px', cursor: 'pointer', width: 'auto' }}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={16} className="text-purple" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input-field"
            style={{ height: '40px', padding: '0 12px', fontSize: '13px', cursor: 'pointer', width: 'auto' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_confidence">Highest Confidence</option>
            <option value="lowest_confidence">Lowest Confidence</option>
          </select>
        </div>
      </div>

      {/* TABLE / CARDS CONTENT */}
      {loading && data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p>Loading history records...</p>
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '44px 20px', color: 'var(--text-muted)' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
          <p style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>No records match your criteria</p>
          <p style={{ fontSize: '13px' }}>Try resetting the search keyword or date filter.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  {user.role === 'admin' && <th>User Email</th>}
                  <th>Disease</th>
                  <th>Confidence</th>
                  <th>Recommendation Hint</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const isHealthy = item.disease.toLowerCase() === 'healthy';
                  const rowNumber = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{rowNumber}</td>
                      {user.role === 'admin' && (
                        <td style={{ fontWeight: 500 }}>{item.user_email || 'N/A'}</td>
                      )}
                      <td>
                        <span className={`badge ${isHealthy ? 'badge-healthy' : 'badge-disease'}`}>
                          {formatDisease(item.disease)}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{item.confidence}%</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {getPesticideHint(item.disease)}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(item.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--glass-border-subtle)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} scans
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default History;

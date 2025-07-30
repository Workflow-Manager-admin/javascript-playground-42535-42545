import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
const ExecutionHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, [pagination.offset]);

  // PUBLIC_INTERFACE
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/execute/history', {
        params: {
          limit: pagination.limit,
          offset: pagination.offset
        }
      });
      
      if (response.data.status === 'success') {
        const newHistory = response.data.data.history;
        setHistory(prev => pagination.offset === 0 ? newHistory : [...prev, ...newHistory]);
        setPagination(prev => ({
          ...prev,
          hasMore: response.data.data.pagination.hasMore
        }));
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setError('Failed to load execution history');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/execute/stats');
      if (response.data.status === 'success') {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // PUBLIC_INTERFACE
  const loadMore = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // PUBLIC_INTERFACE
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
      alert('Failed to copy code');
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading execution history...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Execution History</h2>

      {/* Statistics */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="snippet-card">
            <div className="snippet-title">Total Executions</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {stats.total_executions}
            </div>
          </div>
          <div className="snippet-card">
            <div className="snippet-title">Average Time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
              {stats.avg_execution_time?.toFixed(1)}ms
            </div>
          </div>
          <div className="snippet-card">
            <div className="snippet-title">Errors</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--error-color)' }}>
              {stats.error_count}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--error-color)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <p>No execution history yet. Run some code in the editor to see history here!</p>
        </div>
      ) : (
        <>
          {history.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-header">
                <div>
                  <strong>Executed: {formatDate(item.created_at)}</strong>
                  {item.snippet_id && (
                    <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>
                      (From saved snippet)
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.execution_time}ms
                  </span>
                  <button 
                    onClick={() => copyCode(item.code)}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="history-code">{item.code}</div>

              <div style={{ 
                backgroundColor: item.error ? 'var(--error-color)' : 'var(--success-color)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                opacity: 0.9
              }}>
                <strong>{item.error ? 'Error:' : 'Output:'}</strong>
                <pre style={{ 
                  margin: '4px 0 0 0', 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit'
                }}>
                  {item.error || item.output || 'No output'}
                </pre>
              </div>
            </div>
          ))}

          {pagination.hasMore && (
            <div className="text-center" style={{ marginTop: '24px' }}>
              <button 
                onClick={loadMore}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExecutionHistory;

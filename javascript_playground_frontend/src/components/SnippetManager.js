import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
const SnippetManager = ({ user }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    is_public: false
  });

  useEffect(() => {
    fetchSnippets();
  }, []);

  // PUBLIC_INTERFACE
  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/snippets');
      if (response.data.status === 'success') {
        setSnippets(response.data.data.snippets);
      }
    } catch (error) {
      console.error('Failed to fetch snippets:', error);
      setError('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setFormData({
      title: snippet.title,
      description: snippet.description || '',
      code: snippet.code,
      is_public: snippet.is_public
    });
  };

  // PUBLIC_INTERFACE
  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/snippets/${editingSnippet.id}`, formData);
      if (response.data.status === 'success') {
        await fetchSnippets();
        setEditingSnippet(null);
        setFormData({ title: '', description: '', code: '', is_public: false });
      }
    } catch (error) {
      console.error('Failed to update snippet:', error);
      setError('Failed to update snippet');
    }
  };

  // PUBLIC_INTERFACE
  const handleDelete = async (snippetId) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) {
      return;
    }

    try {
      await axios.delete(`/api/snippets/${snippetId}`);
      await fetchSnippets();
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      setError('Failed to delete snippet');
    }
  };

  // PUBLIC_INTERFACE
  const handleShare = async (snippet) => {
    try {
      const shareUrl = `${window.location.origin}/share/${snippet.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy share link:', error);
      alert('Failed to copy share link');
    }
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading snippets...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2>My Code Snippets</h2>
      
      {error && (
        <div style={{ color: 'var(--error-color)', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {snippets.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <p>No snippets saved yet. Create your first snippet in the editor!</p>
        </div>
      ) : (
        <div className="snippet-grid">
          {snippets.map(snippet => (
            <div key={snippet.id} className="snippet-card">
              <div className="snippet-title">{snippet.title}</div>
              {snippet.description && (
                <div className="snippet-description">{snippet.description}</div>
              )}
              
              <div className="snippet-meta">
                <span>Created: {formatDate(snippet.created_at)}</span>
                <span>{snippet.is_public ? '🌍 Public' : '🔒 Private'}</span>
              </div>

              <div className="snippet-code">
                <pre style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  maxHeight: '100px',
                  overflow: 'hidden',
                  whiteSpace: 'pre-wrap'
                }}>
                  {snippet.code.length > 200 
                    ? snippet.code.substring(0, 200) + '...' 
                    : snippet.code
                  }
                </pre>
              </div>

              <div className="snippet-actions">
                <button 
                  onClick={() => handleEdit(snippet)}
                  className="btn btn-primary"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleShare(snippet)}
                  className="btn btn-accent"
                >
                  🔗 Share
                </button>
                <button 
                  onClick={() => handleDelete(snippet.id)}
                  className="btn btn-error"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSnippet && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>Edit Snippet</h3>
            
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Code</label>
              <textarea
                className="form-input"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                rows={10}
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                />
                Make this snippet public
              </label>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setEditingSnippet(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetManager;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// PUBLIC_INTERFACE
const SharedSnippet = () => {
  const { token } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchSharedSnippet();
  }, [token]);

  // PUBLIC_INTERFACE
  const fetchSharedSnippet = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/snippets/share/${token}`);
      if (response.data.status === 'success') {
        setSnippet(response.data.data.snippet);
      } else {
        setError('Snippet not found');
      }
    } catch (error) {
      console.error('Failed to fetch shared snippet:', error);
      if (error.response?.status === 404) {
        setError('Snippet not found or is no longer available');
      } else {
        setError('Failed to load shared snippet');
      }
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const executeCode = async () => {
    if (!snippet?.code.trim()) {
      setOutput('Error: No code to execute');
      setHasError(true);
      return;
    }

    setIsExecuting(true);
    setOutput('Executing...');
    setHasError(false);
    setExecutionTime(null);

    try {
      // For shared snippets, we'll execute without authentication
      // The backend should handle this case
      const response = await axios.post('/api/execute', {
        code: snippet.code
      });

      if (response.data.status === 'success') {
        const result = response.data.data;
        setOutput(result.output || 'Code executed successfully (no output)');
        setHasError(result.hasError);
        setExecutionTime(result.executionTime);
      } else {
        setOutput('Execution failed: ' + response.data.message);
        setHasError(true);
      }
    } catch (error) {
      console.error('Execution error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to execute code. Please try again.';
      setOutput('Error: ' + errorMessage);
      setHasError(true);
    } finally {
      setIsExecuting(false);
    }
  };

  // PUBLIC_INTERFACE
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
      alert('Failed to copy code');
    }
  };

  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading shared snippet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Oops!</h2>
        <p style={{ color: 'var(--error-color)', marginBottom: '24px' }}>{error}</p>
        <Link to="/" className="btn btn-primary">
          Go to Playground
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)'
      }}>
        <h1 style={{ margin: '0 0 8px 0' }}>{snippet.title}</h1>
        {snippet.description && (
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            {snippet.description}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: 'var(--text-light)'
        }}>
          <span>
            By {snippet.username} • Created {formatDate(snippet.created_at)}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={copyCode} className="btn btn-outline">
              📋 Copy Code
            </button>
            <Link to="/" className="btn btn-accent">
              Open in Playground
            </Link>
          </div>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="editor-container" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Code Viewer */}
        <div className="editor-pane">
          <div className="pane-header">
            <span>Code</span>
            <button 
              onClick={executeCode}
              className="btn btn-success"
              disabled={isExecuting}
            >
              {isExecuting ? '⏳ Running...' : '▶️ Run Code'}
            </button>
          </div>
          <div className="pane-content">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={snippet.code}
              options={{
                readOnly: true,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                lineNumbers: 'on'
              }}
              theme="vs-light"
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="output-pane">
          <div className="pane-header">
            <span>Output</span>
            {executionTime !== null && (
              <span className="text-secondary">
                Executed in {executionTime}ms
              </span>
            )}
          </div>
          <div className="pane-content">
            <div className={`output-content ${hasError ? 'output-error' : 'output-success'}`}>
              {output || 'Click "Run Code" to see the output here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedSnippet;

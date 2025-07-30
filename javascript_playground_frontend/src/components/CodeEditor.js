import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// PUBLIC_INTERFACE
const CodeEditor = ({ user }) => {
  const [code, setCode] = useState('// Welcome to JavaScript Playground!\n// Write your JavaScript code here and click "Run Code" to execute\n\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetDescription, setSnippetDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const editorRef = useRef(null);

  // PUBLIC_INTERFACE
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  };

  // PUBLIC_INTERFACE
  const executeCode = async () => {
    if (!code.trim()) {
      setOutput('Error: No code to execute');
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setOutput('Executing...');
    setHasError(false);
    setExecutionTime(null);

    try {
      const response = await axios.post('/api/execute', {
        code: code,
        snippetId: currentSnippet?.id
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
      setIsLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const saveSnippet = async () => {
    if (!snippetTitle.trim()) {
      alert('Please enter a title for your snippet');
      return;
    }

    try {
      const payload = {
        title: snippetTitle,
        code: code,
        description: snippetDescription,
        isPublic: false
      };

      let response;
      if (currentSnippet) {
        // Update existing snippet
        response = await axios.put(`/api/snippets/${currentSnippet.id}`, {
          ...payload,
          is_public: payload.isPublic
        });
      } else {
        // Create new snippet
        response = await axios.post('/api/snippets', payload);
      }

      if (response.data.status === 'success') {
        setCurrentSnippet(response.data.data.snippet);
        setShowSaveForm(false);
        setSnippetTitle('');
        setSnippetDescription('');
        alert(currentSnippet ? 'Snippet updated successfully!' : 'Snippet saved successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save snippet: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  // PUBLIC_INTERFACE
  const clearEditor = () => {
    setCode('// New code snippet\n\n');
    setOutput('');
    setCurrentSnippet(null);
    setHasError(false);
    setExecutionTime(null);
  };

  // PUBLIC_INTERFACE
  const shareSnippet = async () => {
    if (!currentSnippet) {
      alert('Please save the snippet first to share it');
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/share/${currentSnippet.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to copy share link');
    }
  };

  // PUBLIC_INTERFACE
  const loadSnippet = (snippet) => {
    setCode(snippet.code);
    setCurrentSnippet(snippet);
    setOutput('');
    setHasError(false);
    setExecutionTime(null);
  };

  return (
    <div className="editor-container">
      {/* Editor Pane */}
      <div className="editor-pane">
        <div className="pane-header">
          <div className="flex items-center gap-8">
            <span>Code Editor</span>
            {currentSnippet && (
              <span className="text-secondary">({currentSnippet.title})</span>
            )}
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setShowSaveForm(true)}
              className="btn btn-accent"
              title="Save snippet"
            >
              💾 Save
            </button>
            {currentSnippet && (
              <button 
                onClick={shareSnippet}
                className="btn btn-outline"
                title="Share snippet"
              >
                🔗 Share
              </button>
            )}
            <button 
              onClick={clearEditor}
              className="btn btn-outline"
              title="New snippet"
            >
              📄 New
            </button>
            <button 
              onClick={executeCode}
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Running...' : '▶️ Run Code'}
            </button>
          </div>
        </div>
        <div className="pane-content">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-light"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              rulers: [80],
              folding: true,
              glyphMargin: true,
              showFoldingControls: 'always'
            }}
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

      {/* Save Form Modal */}
      {showSaveForm && (
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
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3>{currentSnippet ? 'Update Snippet' : 'Save Snippet'}</h3>
            
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="Enter snippet title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-input"
                value={snippetDescription}
                onChange={(e) => setSnippetDescription(e.target.value)}
                placeholder="Enter snippet description"
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setShowSaveForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={saveSnippet}
                className="btn btn-primary"
              >
                {currentSnippet ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;

import React, { useState } from 'react';
import './ChatExporter.css';

export default function ChatExporter() {
  const [chatMessages, setChatMessages] = useState([]);
  const [conversationName, setConversationName] = useState('my-chat');
  const [exportFormat, setExportFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePastChat = (e) => {
    const content = e.target.value;
    setMessage(content);
  };

  const handleImportChat = async () => {
    if (!message.trim()) {
      alert('Please paste chat content first');
      return;
    }

    setLoading(true);
    try {
      const lines = message.split('\n\n').filter(line => line.trim());
      const messages = [];
      
      lines.forEach((line) => {
        if (line.trim().startsWith('User:')) {
          messages.push({
            role: 'user',
            content: line.replace(/^User:\s*/i, '').trim(),
            timestamp: new Date().toISOString()
          });
        } else if (line.trim().startsWith('Assistant:') || line.trim().startsWith('ChatNow:')) {
          messages.push({
            role: 'assistant',
            content: line.replace(/^(Assistant:|ChatNow:)\s*/i, '').trim(),
            timestamp: new Date().toISOString()
          });
        }
      });

      if (messages.length === 0) {
        alert('No messages found. Please use format:\nUser: message\n\nAssistant: response');
        setLoading(false);
        return;
      }

      setChatMessages(messages);
      setSuccessMessage(`✅ Successfully parsed ${messages.length} messages!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Error parsing chat: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (chatMessages.length === 0) {
      alert('No messages to export');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: exportFormat,
          conversationName
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(`✅ ${data.message}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Export failed: ' + data.error);
      }
    } catch (error) {
      alert('Error exporting: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exporter-container">
      <header className="app-header">
        <h1>💬 ChatNow Conversation Exporter</h1>
        <p>Export your ChatNow conversations in JSON, Markdown, or CSV format</p>
      </header>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="section">
        <h2>Step 1: Import Chat</h2>
        <p className="section-desc">Paste your ChatNow conversation in this format:</p>
        <div className="format-example">
          <code>
            User: Hello, how are you?<br/>
            <br/>
            Assistant: I'm doing great! How can I help?
          </code>
        </div>
        <textarea
          value={message}
          onChange={handlePastChat}
          placeholder="Paste your ChatNow conversation here..."
          rows="10"
        />
        <button onClick={handleImportChat} disabled={loading} className="btn-primary">
          {loading ? '⏳ Parsing...' : '📝 Parse Chat'}
        </button>
      </div>

      {chatMessages.length > 0 && (
        <div className="section">
          <h2>Step 2: Preview & Export</h2>
          <p className="section-desc">✅ Found <strong>{chatMessages.length}</strong> messages</p>
          
          <div className="preview">
            <h3>Preview (first 3 messages):</h3>
            {chatMessages.slice(0, 3).map((msg, idx) => (
              <div key={idx} className={`message message-${msg.role}`}>
                <strong>{msg.role === 'user' ? '👤 You:' : '🤖 ChatNow:'}</strong>
                <p>{msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}</p>
              </div>
            ))}
            {chatMessages.length > 3 && <p className="more-messages">... and <strong>{chatMessages.length - 3}</strong> more messages</p>}
          </div>

          <div className="export-options">
            <div className="input-group">
              <label>Conversation Name:</label>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder="e.g., my-chat"
              />
            </div>
            
            <div className="input-group">
              <label>Export Format:</label>
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option value="json">📄 JSON</option>
                <option value="markdown">📝 Markdown</option>
                <option value="csv">📊 CSV</option>
              </select>
            </div>

            <button onClick={handleExport} disabled={loading} className="btn-export">
              {loading ? '⏳ Exporting...' : `✨ Export as ${exportFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

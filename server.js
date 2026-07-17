// Backend: Node.js + Express to handle exports
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Store chat data temporarily
let chatHistory = [];

// API endpoint to receive chat data from ChatNow
app.post('/api/import-chat', (req, res) => {
  const { messages, conversationName } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  
  chatHistory = messages;
  
  // Export to JSON
  exportToJSON(messages, conversationName);
  
  res.json({ 
    success: true, 
    message: `Chat exported successfully!`,
    fileCount: messages.length 
  });
});

// Export as JSON
function exportToJSON(messages, conversationName = 'chat') {
  const filename = `${conversationName}-${Date.now()}.json`;
  const filepath = path.join(__dirname, 'exports', filename);
  
  // Create exports directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'exports'))) {
    fs.mkdirSync(path.join(__dirname, 'exports'));
  }
  
  fs.writeFileSync(filepath, JSON.stringify(messages, null, 2));
  console.log(`✅ Exported to: ${filepath}`);
  return filepath;
}

// Export as Markdown
function exportToMarkdown(messages, conversationName = 'chat') {
  let markdown = `# Chat Conversation: ${conversationName}\n\n`;
  markdown += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;
  
  messages.forEach((msg, index) => {
    const role = msg.role === 'user' ? '👤 You' : '🤖 ChatNow';
    markdown += `## ${role}\n\n${msg.content}\n\n---\n\n`;
  });
  
  const filename = `${conversationName}-${Date.now()}.md`;
  const filepath = path.join(__dirname, 'exports', filename);
  
  if (!fs.existsSync(path.join(__dirname, 'exports'))) {
    fs.mkdirSync(path.join(__dirname, 'exports'));
  }
  
  fs.writeFileSync(filepath, markdown);
  console.log(`✅ Exported to: ${filepath}`);
  return filepath;
}

// Export as CSV
function exportToCSV(messages, conversationName = 'chat') {
  let csv = 'Role,Message,Timestamp\n';
  
  messages.forEach((msg) => {
    const role = msg.role === 'user' ? 'User' : 'Assistant';
    const content = `"${msg.content.replace(/"/g, '""')}"`;
    const timestamp = msg.timestamp || new Date().toISOString();
    csv += `${role},${content},${timestamp}\n`;
  });
  
  const filename = `${conversationName}-${Date.now()}.csv`;
  const filepath = path.join(__dirname, 'exports', filename);
  
  if (!fs.existsSync(path.join(__dirname, 'exports'))) {
    fs.mkdirSync(path.join(__dirname, 'exports'));
  }
  
  fs.writeFileSync(filepath, csv);
  console.log(`✅ Exported to: ${filepath}`);
  return filepath;
}

// Endpoint to export in specific format
app.post('/api/export', (req, res) => {
  const { format = 'json', conversationName = 'chat' } = req.body;
  
  try {
    let filepath;
    switch(format) {
      case 'markdown':
        filepath = exportToMarkdown(chatHistory, conversationName);
        break;
      case 'csv':
        filepath = exportToCSV(chatHistory, conversationName);
        break;
      default:
        filepath = exportToJSON(chatHistory, conversationName);
    }
    
    res.json({ 
      success: true, 
      filepath,
      message: `Chat exported as ${format.toUpperCase()}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download exported file
app.get('/api/download/:filename', (req, res) => {
  const filepath = path.join(__dirname, 'exports', req.params.filename);
  
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Export server running on http://localhost:${PORT}`);
  console.log(`📁 Exports will be saved to: ${path.join(__dirname, 'exports')}`);
});

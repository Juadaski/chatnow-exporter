# ChatNow Conversation Exporter

A simple desktop/web app to export ChatNow AI conversations in multiple formats (JSON, Markdown, CSV).

## Features

✅ **Text-based chat import** - Paste your ChatNow conversations as plain text
✅ **Multiple export formats** - JSON, Markdown, CSV
✅ **Preview before export** - See your parsed messages
✅ **Local file storage** - All files saved locally on your machine
✅ **No API required** - Works with text format chats

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **File System**: Local exports folder

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Juadaski/chatnow-exporter.git
cd chatnow-exporter

# 2. Install backend dependencies
npm install

# 3. Create React app
npx create-react-app client
cd client
npm install axios
cd ..
```

### Running the App

**Terminal 1 - Start Backend Server:**
```bash
node server.js
# Server runs on http://localhost:3001
```

**Terminal 2 - Start React Frontend:**
```bash
cd client
npm start
# App opens on http://localhost:3000
```

## Usage

1. **Copy your ChatNow conversation** from the ChatNow interface
2. **Paste the text** into the app's textarea
3. **Click "Parse Chat"** to import messages
4. **Preview** the parsed conversation
5. **Select export format** (JSON, Markdown, or CSV)
6. **Click "Export"** to save the file locally

## Chat Format

The app supports this text format:

```
User: Hello, how are you?

Assistant: I'm doing great! How can I help?

User: Tell me a joke

Assistant: Why did the AI go to school? To improve its learning!
```

Or with "ChatNow:" prefix:

```
User: Hello

ChatNow: Hi there!
```

## File Structure

```
chatnow-exporter/
├── server.js              # Express backend
├── client/                # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── ChatExporter.jsx
│   │   ├── ChatExporter.css
│   │   └── index.js
│   └── package.json
├── exports/               # Generated exports (auto-created)
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/import-chat`
Import and parse chat messages
```json
{
  "messages": [{"role": "user", "content": "..."}],
  "conversationName": "my-chat"
}
```

### POST `/api/export`
Export chat in specified format
```json
{
  "format": "json|markdown|csv",
  "conversationName": "my-chat"
}
```

### GET `/api/download/:filename`
Download an exported file

## Export Formats

### JSON
Structured data format:
```json
[
  {"role": "user", "content": "message"},
  {"role": "assistant", "content": "response"}
]
```

### Markdown
Human-readable format with timestamps

### CSV
Tabular format with Role, Message, Timestamp columns

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in server.js or kill existing process
lsof -i :3001
kill -9 <PID>
```

**CORS errors:**
Ensure backend is running on port 3001 and frontend proxy is configured

**Messages not parsing:**
Make sure conversations follow the format: `User: message` or `Assistant: response`

## Future Enhancements

- [ ] Batch export multiple conversations
- [ ] Chat search functionality
- [ ] Custom export templates
- [ ] SQLite local database instead of JSON
- [ ] Drag & drop file support
- [ ] Desktop app with Electron

## License

MIT

## Support

If you have questions, open an issue on GitHub!

# Setup Guide for ChatNow Conversation Exporter

## Prerequisites
- Node.js v14 or higher
- npm or yarn
- Git

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Juadaski/chatnow-exporter.git
cd chatnow-exporter
```

### 2. Install Backend Dependencies
```bash
npm install
```

This installs:
- Express (web framework)
- CORS (cross-origin support)
- fs, path (Node.js built-ins)

### 3. Create and Setup React Frontend
```bash
npx create-react-app client
cd client
npm install axios
cd ..
```

### 4. Running the Application

**Option A: Two Terminal Windows (Recommended for Development)**

*Terminal 1 - Start Backend:*
```bash
node server.js
```
You should see:
```
🚀 Export server running on http://localhost:3001
📁 Exports will be saved to: /path/to/exports
```

*Terminal 2 - Start Frontend:*
```bash
cd client
npm start
```
The app will automatically open at `http://localhost:3000`

**Option B: Single Terminal with Concurrently**

Install concurrently:
```bash
npm install --save-dev concurrently
```

Update `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "client": "cd client && npm start",
  "dev": "concurrently \"npm start\" \"npm run client\""
}
```

Then run:
```bash
npm run dev
```

## Troubleshooting

### Port 3001 Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Port 3000 Already in Use
```bash
cd client
PORT=3001 npm start
```

### CORS Errors
Ensure:
1. Backend is running on `http://localhost:3001`
2. Frontend is running on `http://localhost:3000`
3. `cors` package is installed in backend

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# For React client
cd client
rm -rf node_modules
npm install
```

## Testing the App

1. **Backend Test:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Frontend Test:**
   - Open `http://localhost:3000`
   - Paste a sample conversation
   - Click "Parse Chat"
   - Choose export format
   - Click "Export"

3. **Sample Chat Format:**
   ```
   User: Hello, how are you?

   Assistant: I'm doing great! How can I help?
   ```

## Next Steps

1. ✅ Verify both servers are running
2. ✅ Test with sample conversation
3. ✅ Check exports folder for files
4. ✅ Try different export formats

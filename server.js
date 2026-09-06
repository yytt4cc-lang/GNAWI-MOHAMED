import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from './database/db.js';
import questRoutes from './routes/quests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Initialize Database
await initializeDatabase();

// Routes
app.use('/api', questRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running ✅', timestamp: new Date() });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     🎮 Quest Completer Web v2.0 🎮                ║
║════════════════════════════════════════════════════║
║  Server running on: http://localhost:${PORT}        ║
║  Status: Ready to complete quests! ✅             ║
╚════════════════════════════════════════════════════╝
  `);
});

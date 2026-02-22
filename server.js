import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('enquetes.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'single', -- single or multiple
    status TEXT DEFAULT 'active', -- draft, active, closed
    starts_at DATETIME,
    ends_at DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS poll_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    ip_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id),
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (option_id) REFERENCES poll_options(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('adsense_client_id', '');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('adsense_slot_id_list', '');
  CREATE INDEX IF NOT EXISTS idx_votes_poll_user ON votes (poll_id, user_id);
  CREATE INDEX IF NOT EXISTS idx_polls_status ON polls (status);
  CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options (poll_id);
`);

// Seed Admin if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
if (!adminExists) {
  const hash = crypto.createHash('sha256').update('admin123').digest('hex');
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
    'Administrador',
    'admin@enquetesbh.com.br',
    hash,
    'admin'
  );
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.static('public'));

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?').get(email, hash);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    try {
      const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hash);
      const user = { id: result.lastInsertRowid, name, email, role: 'user' };
      res.json({ success: true, user });
    } catch (e) {
      res.status(400).json({ success: false, message: 'E-mail já cadastrado' });
    }
  });

  app.get('/api/polls', (req, res) => {
    const limit = parseInt(req.query.limit || 10);
    const offset = parseInt(req.query.offset || 0);

    const polls = db.prepare(`
      SELECT p.*, 
      (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as total_votes
      FROM polls p 
      WHERE p.status != 'draft'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const totalPolls = db.prepare(`SELECT COUNT(*) as count FROM polls WHERE status != 'draft'`).get().count;

    res.json({ polls, totalPolls });
  });

  app.get('/api/categories', (req, res) => {
    const stmt = db.prepare('SELECT DISTINCT category FROM polls WHERE category IS NOT NULL AND category != ""');
    const categories = stmt.all().map(row => row.category);
    res.json(categories);
  });

  app.get('/api/polls/category/:category', (req, res) => {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const polls = db.prepare(`
      SELECT p.*, 
      (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as total_votes
      FROM polls p 
      WHERE p.category = ? AND p.status != 'draft'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(category, limit, offset);

    const totalPolls = db.prepare(`SELECT COUNT(*) as count FROM polls WHERE category = ? AND status != 'draft'`).get(category).count;

    res.json({ polls, totalPolls });
  });

  app.get('/api/polls/:id', (req, res) => {
    const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Enquete não encontrada' });
    
    const options = db.prepare('SELECT * FROM poll_options WHERE poll_id = ? ORDER BY position ASC').all(req.params.id);

    let userVoted = false;
    const { userId } = req.query;
    if (userId) {
      const vote = db.prepare('SELECT id FROM votes WHERE poll_id = ? AND user_id = ?').get(req.params.id, userId);
      if (vote) {
        userVoted = true;
      }
    }

    res.json({ ...poll, options, userVoted });
  });

  app.post('/api/polls/:id/vote', (req, res) => {
    const { optionId, userId } = req.body;
    const pollId = req.params.id;
    
    try {
      db.prepare('INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)').run(pollId, optionId, userId);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ success: false, message: 'Você já votou nesta enquete' });
    }
  });

  app.get('/api/polls/:id/results', (req, res) => {
    const pollId = req.params.id;
    const results = db.prepare(`
      SELECT po.id, po.label, COUNT(v.id) as votes
      FROM poll_options po
      LEFT JOIN votes v ON v.option_id = po.id
      WHERE po.poll_id = ?
      GROUP BY po.id
      ORDER BY po.position ASC
    `).all(pollId);

    const totalVotesResult = db.prepare('SELECT COUNT(*) as count FROM votes WHERE poll_id = ?').get(pollId);
    const totalVotes = totalVotesResult.count;

    res.json({ results, totalVotes });
  });

  // User Profile
  app.get('/api/user/:id/history', (req, res) => {
    const userId = req.params.id;
    const history = db.prepare(`
      SELECT 
        p.title as poll_title,
        po.label as chosen_option,
        v.created_at as voted_at
      FROM votes v
      JOIN polls p ON p.id = v.poll_id
      JOIN poll_options po ON po.id = v.option_id
      WHERE v.user_id = ?
      ORDER BY v.created_at DESC
    `).all(userId);
    res.json(history);
  });

  // Admin Routes
  app.get('/api/admin/stats', (req, res) => {
    const stats = {
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      totalPolls: db.prepare('SELECT COUNT(*) as count FROM polls').get().count,
      totalVotes: db.prepare('SELECT COUNT(*) as count FROM votes').get().count,
      activePolls: db.prepare("SELECT COUNT(*) as count FROM polls WHERE status = 'active'").get().count,
    };
    res.json(stats);
  });

  // Admin Settings
  app.get('/api/admin/settings', (req, res) => {
    const settingsRaw = db.prepare('SELECT key, value FROM settings').all();
    const settings = settingsRaw.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  });

  app.post('/api/admin/settings', (req, res) => {
    const { adsense_client_id, adsense_slot_id_list, adsense_slot_id_results } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run('adsense_client_id', adsense_client_id);
    stmt.run('adsense_slot_id_list', adsense_slot_id_list);
    stmt.run('adsense_slot_id_results', adsense_slot_id_results);
    res.json({ success: true });
  });

  app.get('/api/admin/polls', (req, res) => {
    const polls = db.prepare('SELECT * FROM polls ORDER BY created_at DESC').all();
    res.json(polls);
  });

  app.post('/api/admin/polls', (req, res) => {
    const { title, description, type, status, options } = req.body;
    const result = db.prepare('INSERT INTO polls (title, description, type, status) VALUES (?, ?, ?, ?)').run(
      title, description, type, status
    );
    const pollId = result.lastInsertRowid;
    
    const insertOption = db.prepare('INSERT INTO poll_options (poll_id, label, position) VALUES (?, ?, ?)');
    options.forEach((opt, index) => {
      insertOption.run(pollId, opt, index);
    });
    
    res.json({ success: true, id: pollId });
  });

  app.get('/api/admin/polls/:id/report', (req, res) => {
    const pollId = req.params.id;
    const options = db.prepare(`
      SELECT po.label, COUNT(v.id) as votes
      FROM poll_options po
      LEFT JOIN votes v ON v.option_id = po.id
      WHERE po.poll_id = ?
      GROUP BY po.id
    `).all(pollId);
    
    const timeline = db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM votes
      WHERE poll_id = ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all(pollId);
    
    res.json({ options, timeline });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

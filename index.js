const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Load mock users
const USERS_FILE_PATH = path.join(__dirname, 'mock-data', 'users.json');

// Seed data
const DEFAULT_USERS = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// Ensure file exists and load users
let users = [];

if (!fs.existsSync(USERS_FILE_PATH)) {
  console.log('⚠️ users.json not found — creating with default data...');
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(DEFAULT_USERS, null, 2), 'utf8');
  users = [...DEFAULT_USERS];
} else {
  try {
    users = require('./mock-data/users.json');
    console.log('✅ Loaded users from file');
  } catch (err) {
    console.error('❌ Failed to load users.json:', err.message);
    users = [...DEFAULT_USERS];
  }
}


function saveUsersToFile(res = null) {
  try {
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('❌ Failed to write users.json:', err.message);
    if (res) {
      res.status(500).json({ error: 'Failed to save user data' });
    }
    return false;
  }
}



try {
  users = require('./mock-data/users.json');
  console.log('Mock users loaded:', users);
} catch (err) {
  console.error('Failed to load users:', err.message);
}

// GET /users with optional query filters
app.get('/users', (req, res) => {
  const { id, name, email } = req.query;

  let results = users;

  if (id) {
    results = results.filter(u => u.id === Number(id));
  }

  if (name) {
    const nameLower = name.toLowerCase();
    results = results.filter(u => u.name.toLowerCase().includes(nameLower));
  }

  if (email) {
    const emailLower = email.toLowerCase();
    results = results.filter(u => u.email.toLowerCase().includes(emailLower));
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'No users found' });
  }

  res.json(results);
});

// POST /users to create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string' || !emailPattern.test(email)) {
    return res.status(400).json({ error: 'Email is invalid' });
  }

  if (users.some(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name: name.trim(),
    email: email.toLowerCase()
  };

  users.push(newUser);
  if (!saveUsersToFile(res)) return;

  res.status(201).json(newUser);
});



// PUT /users/:id to update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name;
  if (email) user.email = email;

  if (!saveUsersToFile(res)) return;

  res.json(user);
});


// DELETE /users/:id to remove a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const deleted = users.splice(index, 1);

  if (!saveUsersToFile(res)) return;

  res.json({ deleted: deleted[0] });
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

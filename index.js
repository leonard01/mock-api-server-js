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
let users = [];

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
  console.log('POST /users hit:', req.body);

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id to update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = users.find(u => u.id === Number(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// DELETE /users/:id to remove a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deleted = users.splice(index, 1);
  res.json({ deleted: deleted[0] });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

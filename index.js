const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

let users = [];

try {
  users = require('./mock-data/users.json');
  console.log('Mock users loaded:', users);
} catch (err) {
  console.error('Failed to load users:', err.message);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running at http://localhost:${PORT}/health`);
});


app.get('/users', (req, res) => {
  const { id } = req.query;

  if (id) {
    const user = users.find(u => u.id === Number(id));
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  }

  res.json(users);
});
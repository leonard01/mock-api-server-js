const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { loadUsersFromFile, saveUsersToFile } = require('./lib/data');
const { setUsers, getUsers, addUser, updateUser, deleteUser } = require('./lib/users');
const { validateUserInput } = require('./lib/validateUser');

// Middleware
app.use(express.json());

// Load users from file into memory at startup
const initialUsers = loadUsersFromFile();
setUsers(initialUsers);

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// GET all users
app.get('/users', (req, res) => {
  res.json(getUsers());
});

// POST a new user
app.post('/users', (req, res) => {
  const users = getUsers();
  const validation = validateUserInput(req.body, users);

  if (!validation.valid) {
    const status = validation.message.includes('exists') ? 409 : 400;
    return res.status(status).json({ error: validation.message });
  }

  const newUser = addUser(req.body);
  saveUsersToFile(getUsers());
  res.status(201).json(newUser);
});

// PUT (update) a user by ID
app.put('/users/:id', (req, res) => {
  const updated = updateUser(parseInt(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  saveUsersToFile(getUsers());
  res.json(updated);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
  const deleted = deleteUser(parseInt(req.params.id));

  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  saveUsersToFile(getUsers());
  res.json({ deleted });
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} else {
  module.exports = app; // for Supertest
}

// 代码生成时间: 2025-08-06 17:12:05
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define routes with their respective handlers
app.get('/api/users', (req, res) => {
  res.status(200).json({ message: 'List of users' });
});

app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }
  res.status(201).json({ message: 'User created', user: { username, email } });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  if (!username || !email || !id) {
    return res.status(400).json({ error: 'Username, email, and id are required' });
  }
  res.status(200).json({ message: 'User updated', user: { id, username, email } });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
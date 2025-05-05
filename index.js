const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON request bodies
app.use(express.json());

// CRUD endpoints
app.get('/items', async (_, res) => {
  const { rows } = await pool.query('SELECT * FROM items');
  res.json(rows);
});

app.post('/items', async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO items(name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(201).json(rows[0]);
});

// (Add PUT /items/:id and DELETE /items/:id similarly)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));

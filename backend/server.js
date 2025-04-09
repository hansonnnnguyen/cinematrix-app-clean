const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to the Postgres database using DATABASE_URL from Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render's SSL connection
  }
});

// Root test route
app.get('/', (req, res) => {
  res.send('Cinematrix backend is running!');
});

// Fetch all movies
app.get('/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Movies');
    res.json(result.rows);
  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a new movie
app.post('/movies', async (req, res) => {
  const { title, release_year, genre_id, rating, duration } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Movies (title, release_year, genre_id, rating, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, release_year, genre_id, rating, duration]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

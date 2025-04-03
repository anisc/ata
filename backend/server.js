// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Use bcryptjs
require('dotenv').config();
const { Pool } = require('pg'); // Import the Pool class from the 'pg' library

const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL Connection Pool Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection (IMPORTANT)
async function testDbConnection() {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to PostgreSQL database successfully!");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1); // Exit if cannot connect
  }
}
testDbConnection(); // Call the test function

app.use(express.json());
app.use(cors());

// --- API Endpoints ---

// Get all members
app.get('/api/members', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM members'); // Use pool.query
    const formattedRows = rows.map((row) => ({
      ...row,
      familyMembers: row.familyMembers ? JSON.parse(row.familyMembers) : [],
    }));
    res.json(formattedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching members' });
  }
});

// Add a new member
app.post('/api/members', async (req, res) => {
  try {
    const { name, email, location, age, sex, workStatus, tunisianCity, isFamily, familyMembers, occupation, settlingYear } = req.body;
    console.log("Received member request", req.body);

    if (!name || !email || !location || !age || !sex || !workStatus || !tunisianCity || !settlingYear) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const familyMembersJSON = JSON.stringify(familyMembers || []);

    const result = await pool.query( // Use pool.query
      `INSERT INTO members (name, email, location, age, sex, workStatus, tunisianCity, isFamily, familyMembers, occupation, settlingYear)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id`, // Use RETURNING id for PostgreSQL
      [name, email, location, age, sex, workStatus, tunisianCity, isFamily ? 1 : 0, familyMembersJSON, occupation, settlingYear]
    );
    // Access the new ID from result.rows[0].id
    res.status(201).json({ message: 'Member added successfully', id: String(result.rows[0].id) }); // Access id from result.rows[0]

  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Error adding member' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', req.body);

  try {
    // 1. Fetch the user from the database based on the username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // Use pool.query

    if (result.rows.length === 0) {
      // User not found
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    const user = result.rows[0];

    // 2. Compare the provided password with the *hashed* password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // 3. Login successful!
      console.log('Login successful');
      res.status(200).json({ message: 'Login successful', success: true });
    } else {
      // 4. Passwords don't match
      console.log('Login failed: Incorrect password');
      res.status(401).json({ message: 'Invalid credentials', success: false });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events'); // Use pool.query
    const events = rows.map(row => ({
      ...row,
      start: new Date(row.start).toISOString(), // Keep as ISO string for frontend
      end: new Date(row.end).toISOString(), // Keep as ISO string for frontend
    }));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Add a new event
app.post('/api/events', async (req, res) => { /* ... existing add event route, updated for pool.query ... */
  try {
    console.log("Received event request", req.body);
    const { title, start, end, location, description } = req.body;

    if (!title || !start || !end || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    const result = await pool.query( // Use pool.query
      'INSERT INTO events (title, start, end, location, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, startTimestamp, endTimestamp, location, description]
    );

    res.status(201).json({ message: 'Event added successfully', id: String(result.rows[0].id) }); // Access id from result.rows[0]
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event' });
  }
});

//Delete an event
app.delete('/api/events/:id', async (req, res) => { /* ... existing delete event route, updated for pool.query ... */
  try {
    const eventId = req.params.id;
    console.log('Received delete request for event ID:', eventId);

    // Check if the event exists (optional, but good practice)
    const { rows } = await pool.query({ // Use pool.query
      sql: 'SELECT * FROM events WHERE id = $1',
      args: [eventId],
    });
    console.log('Event found (rows):', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete the event
    await pool.query({ // Use pool.query
      sql: 'DELETE FROM events WHERE id = $1',
      args: [eventId],
    });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// --- Database Initialization ---
async function initializeApp() {
  console.log('initializeApp started');

  try {
    // --- Helper function to check if a table exists ---
    async function tableExists(tableName) {
      console.log('Checking if table exists:', tableName);
      try {
        // Corrected query for PostgreSQL to check if a table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename  = $1
      );
    `, [tableName]);
    console.log('Table check result:', tableName, result.rows); // Log the result.rows
    return result.rows[0].exists;
      } catch (error) {
        console.error(`Error checking if table ${tableName} exists:`, error);
        return false; // Assume it doesn't exist on error
      }
    }

    // --- Check and create the members table ---
    console.log('Checking members table...');
    if (!(await tableExists('members'))) {
      console.log('Creating members table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS members (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            location TEXT NOT NULL,
            age INTEGER NOT NULL,
            sex TEXT NOT NULL,
            workStatus TEXT NOT NULL,
            tunisianCity TEXT NOT NULL,
            isFamily INTEGER NOT NULL,
            familyMembers TEXT,
            occupation TEXT,
            settlingYear INTEGER NOT NULL
        )
      `);
      console.log('Members table created successfully');
    } else {
      console.log('Members table already exists');
    }

    // --- Check and create the events table ---
    console.log('Checking events table...');
    if (!(await tableExists('events'))) {
      console.log('Creating events table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            start INTEGER NOT NULL,  -- Changed to INTEGER
            endTime INTEGER NOT NULL,    -- Changed to INTEGER
            location TEXT,
            description TEXT
        )
      `);
      console.log('Events table created successfully');
    } else {
      console.log('Events table already exists');
    }

    // --- Check and create the users table ---
    console.log('Checking users table...');
    if (!(await tableExists('users'))) {
      console.log('Creating users table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
      `);
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
    }

    // // --- TEMPORARY: Create an initial admin user (REMOVE THIS LATER) ---
      try {
        const existingAdmin = await pool.query("SELECT * FROM users WHERE username = $1", ['admin']);
        if (existingAdmin.rows.length === 0) {
          const hashedPassword = await bcrypt.hash('password', 10); // Replace with a strong password
          await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword]); // Corrected line
          console.log('Admin user created.');
        } else {
          console.log('Admin user already exists.');
        }
      } catch (adminError) {
        console.error("Error creating admin user:", adminError);
      }
    // // --- END TEMPORARY SECTION ---

    console.log('Starting server...');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeApp();
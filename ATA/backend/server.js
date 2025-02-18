// backend/server.js
const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Import dotenv

const app = express();
const port = 3001;

const db = createClient({
  url: 'file:./my-database.db',
});

// IMPORTANT: Middleware order!
app.use(express.json()); // Parse JSON request bodies (MUST come before cors and routes)
app.use(cors());       // Enable CORS (MUST come before your routes)

// --- TEMPORARY: Hardcoded admin credentials (FOR DEVELOPMENT ONLY!) ---
// const ADMIN_USERNAME = 'admin';
// const ADMIN_PASSWORD = 'password'; //  CHANGE THIS IMMEDIATELY!

// --- API Endpoints ---

// Get all members
app.get('/api/members', async (req, res) => {
  try {
    const { rows } = await db.execute('SELECT * FROM members');
     // Convert familyMembers back to an object from JSON string
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
// backend/server.js (inside the POST /api/members route)
app.post('/api/members', async (req, res) => {
  try {
      console.log("Received member request. Raw req.body:", req.body); // Log the raw request body

      const { name, email, location, age, sex, workStatus, tunisianCity, isFamily, familyMembers, occupation, settlingYear } = req.body;

      console.log("Extracted values:");
      console.log("  name:", name, typeof name);
      console.log("  email:", email, typeof email);
      console.log("  location:", location, typeof location);
      console.log("  age:", age, typeof age);
      console.log("  sex:", sex, typeof sex);
      console.log("  workStatus:", workStatus, typeof workStatus);
      console.log("  tunisianCity:", tunisianCity, typeof tunisianCity);
      console.log("  isFamily:", isFamily, typeof isFamily);
      console.log("  familyMembers:", familyMembers, typeof familyMembers);
      console.log("  occupation:", occupation, typeof occupation);
      console.log("  settlingYear:", settlingYear, typeof settlingYear);


      if (!name || !email || !location || !age || !sex || !workStatus || !tunisianCity || !settlingYear) {
          console.log("Missing required fields. Returning 400.");
          return res.status(400).json({ message: 'Missing required fields' });
      }

      // Ensure familyMembers is ALWAYS a valid JSON string, even if empty
      let familyMembersJSON;
      try {
          familyMembersJSON = JSON.stringify(familyMembers || []);
          console.log("familyMembersJSON:", familyMembersJSON, typeof familyMembersJSON); // Log the JSON string
      } catch (error) {
          console.error("Error stringifying familyMembers:", error);
          return res.status(500).json({ message: 'Error processing family data' });
      }


      const result = await db.execute({
          sql: `INSERT INTO members (name, email, location, age, sex, workStatus, tunisianCity, isFamily, familyMembers, occupation, settlingYear)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [name, email, location, age, sex, workStatus, tunisianCity, isFamily ? 1 : 0, familyMembersJSON, occupation, settlingYear],
      });

      console.log("Database insert result:", result); // Log the result

      res.status(201).json({ message: 'Member added successfully', id: String(result.lastInsertRowid) });

  } catch (error) {
      console.error('Error adding member:', error); // Log any errors
      console.log('Error stack trace:', error.stack); // Add stack trace
      res.status(500).json({ message: 'Error adding member' });
  }
});


// // Login endpoint
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log('Received login request:', req.body); // Log request body

//   if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
//     console.log('Login successful'); // Log success
//     res.status(200).json({ message: 'Login successful', success: true });
//   } else {
//     console.log('Login failed'); // Log failure
//     res.status(401).json({ message: 'Invalid credentials', success: false }); // 401 Unauthorized
//   }
// });

// // Login endpoint
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   console.log('Received login request:', req.body);

//   // Use environment variables for admin credentials
//   if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
//     console.log('Login successful');
//     res.status(200).json({ message: 'Login successful', success: true });
//   } else {
//     console.log('Login failed');
//     res.status(401).json({ message: 'Invalid credentials', success: false });
//   }
// });

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', req.body);

  try {
    // 1. Fetch the user from the database based on the username
    const { rows } = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username],
    });

    if (rows.length === 0) {
      // User not found
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    const user = rows[0];

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
    const { rows } = await db.execute('SELECT * FROM events');
    // Convert start and end to ISO strings for JSON serialization
    const events = rows.map(row => ({
        ...row,
        start: new Date(row.start).toISOString(),
        end: new Date(row.end).toISOString(),
    }));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Add a new event
app.post('/api/events', async (req, res) => {
  try {
        console.log("Received event request", req.body);
        const { title, start, end, location, description } = req.body;

    if (!title || !start || !end || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();

    const result = await db.execute({
      sql: 'INSERT INTO events (title, start, end, location, description) VALUES (?, ?, ?, ?, ?)',
      args: [title, startTimestamp, endTimestamp, location, description],
    });

    res.status(201).json({ message: 'Event added successfully', id: String(result.lastInsertRowid) });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event' });
  }
});

//Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log('Received delete request for event ID:', eventId);

    // Check if the event exists (optional, but good practice)
    const { rows } = await db.execute({
      sql: 'SELECT * FROM events WHERE id = ?',
      args: [eventId],
    });
    console.log('Event found (rows):', rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete the event
    await db.execute({
      sql: 'DELETE FROM events WHERE id = ?',
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
          const { rows } = await db.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`);
          console.log('Table check result:', tableName, rows);
          return rows.length > 0;
        } catch (error) {
          console.error(`Error checking if table ${tableName} exists:`, error);
          return false; // Assume it doesn't exist on error
        }
      }

      // --- Check and create the members table ---
      console.log('Checking members table...');
      if (!(await tableExists('members'))) {
        console.log('Creating members table...');
        await db.execute(`
          CREATE TABLE members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        await db.execute(`
          CREATE TABLE events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            start INTEGER NOT NULL,
            end INTEGER NOT NULL,
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
        await db.execute(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          )
        `);
        console.log('Users table created successfully');
      } else {
        console.log('Users table already exists');
      }

      console.log('Starting server...');
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });

    //    // --- TEMPORARY: Create an initial admin user (REMOVE THIS LATER) ---
    // try {
    //   const existingAdmin = await db.execute("SELECT * FROM users WHERE username = 'admin'");
    //   if (existingAdmin.rows.length === 0) {
    //     const hashedPassword = await bcrypt.hash('password', 10); // Replace with a strong password, and use a good salt rounds value (10 is common)
    //     await db.execute({
    //       sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
    //       args: ['admin', hashedPassword],
    //     });
    //     console.log('Admin user created.');
    //   } else {
    //     console.log('Admin user already exists.');
    //   }
    // } catch (adminError) {
    //   console.error("Error creating admin user:", adminError);
    // }
    // // --- END TEMPORARY SECTION ---

    } catch (error) {
        // General error handling, but specifically ignore SQLITE_OK *after* table creation
        if (error.code !== 'SQLITE_OK') { // Only exit if it's a *real* error
            console.error('Error initializing database:', error);
            process.exit(1);
        } else {
            console.log("Ignoring SQLITE_OK during table creation.");
        }
    }
  }

initializeApp();

import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT_API;

const db = mysql.createConnection({
  host: process.env.HOST_API,
  user: process.env.USER_API,
  password: process.env.PASSWORD_API,
  database: process.env.DATABASE_API,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
  } else {
    console.log('Connected to database');
  }
});

// Rute untuk form login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM route';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ message: 'Error inside server' });
    } else {
      res.json(result);
    }
  });
});

app.post('/route', (req, res) => {
  const { shiptoname, address, remarks, area } = req.body;

  // Get the last inserted ID from the table
  const sqlLastId = 'SELECT id FROM route ORDER BY id DESC LIMIT 1';
  db.query(sqlLastId, (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json(err);
    } else {
      let lastId = 0;
      if (result.length > 0) {
        lastId = parseInt(result[0].id.slice(3), 10); // Extract the numeric part of the last ID
      }

      const newId = 'KLS' + String(lastId + 1).padStart(3, '0'); // Create the new ID

      const sql = 'INSERT INTO route (id, shiptoname, address, remarks, area) VALUES (?, ?, ?, ?, ?)';
      const values = [newId, shiptoname, address, remarks, area];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error executing SQL query: ', err);
          res.status(500).json(err);
        } else {
          const insertedData = { id: newId, shiptoname, address, remarks, area };
          res.json(insertedData);
        }
      });
    }
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Periksa apakah pengguna sudah terdaftar
  const checkUserQuery = 'SELECT * FROM user WHERE username = ?';
  db.query(checkUserQuery, [username], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar.' });
    } else if (result.length > 0) {
      res.status(409).json({ error: 'Username sudah digunakan.' });
    } else {
      // Generate salt untuk proses hashing
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error('Error generating salt: ', err);
          res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar.' });
        } else {
          // Hash password menggunakan salt
          bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
              console.error('Error hashing password: ', err);
              res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar.' });
            } else {
              // Simpan data pengguna ke database
              const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
              const values = [username, hashedPassword];
              db.query(insertUserQuery, values, (err, result) => {
                if (err) {
                  console.error('Error executing SQL query: ', err);
                  res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar.' });
                } else {
                  res.status(200).json({ message: 'Registrasi berhasil.', userId: result.insertId });
                }
              });
            }
          });
        }
      });
    }
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Ambil data pengguna dari database berdasarkan username
  const getUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(getUserQuery, [username], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
    } else if (result.length === 0) {
      res.status(401).json({ error: 'Username atau password salah.' });
    } else {
      // Bandingkan password yang diinput dengan password di database menggunakan bcrypt
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords: ', err);
          res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
        } else if (isMatch) {
          res.status(200).json({ message: 'Login berhasil.', userId: result[0].userid });
        } else {
          res.status(401).json({ error: 'Username atau password salah.' });
        }
      });
    }
  });
});

// Update route
app.put('/route/:id', (req, res) => {
  const id = req.params.id;
  const { shiptoname, address, remarks, area } = req.body;

  const sql = 'UPDATE route SET shiptoname = ?, address = ?, remarks = ?, area = ? WHERE id = ?';
  const values = [shiptoname, address, remarks, area, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.delete('/route/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM route WHERE id = ?';

  db.query(sql, id, (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/user', (req, res) => {
  const userId = req.query.userId; // Mendapatkan userId dari parameter query

  // Ambil data pengguna dari database berdasarkan userId
  const getUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(getUserQuery, [userId], (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data pengguna.' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    } else {
      // Menghapus password dari objek hasil query
      const user = { ...result[0] };
      delete user.password;

      res.status(200).json(user);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


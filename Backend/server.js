const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // body-parser helyett ez kell JSON-hoz

// MySQL kapcsolat
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // vagy saját MySQL user
    password: '',         // saját jelszó
    database: 'userdb'
});

// Kapcsolódás
db.connect(err => {
    if (err) {
        console.error('❌ Hiba a MySQL kapcsolódáskor:', err);
        return;
    }
    console.log('✅ MySQL kapcsolódva.');
});

// GET – összes felhasználó
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST – új felhasználó
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    db.query(
        'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
        [name, email, age],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ id: result.insertId, name, email, age });
        }
    );
});

// PUT – felhasználó frissítése
app.put('/users/:id', (req, res) => {
    const { name, email, age } = req.body;
    const id = req.params.id;

    db.query(
        'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
        [name, email, age, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ id, name, email, age });
        }
    );
});

// DELETE – felhasználó törlése
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: '🗑️ Felhasználó törölve.' });
    });
});

// Szerver indítása
app.listen(port, () => {
    console.log(`🚀 Szerver fut: http://localhost:${port}`);
});

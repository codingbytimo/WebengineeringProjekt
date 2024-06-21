const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('pages')); 

// SQLite-Datenbank einrichten
const db = new sqlite3.Database('./flappybird.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS highscores (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, score INTEGER NOT NULL)");
});

// Highscore speichern
app.post('/highscores', (req, res) => {
    const { name, score } = req.body;
    if (!name || score === undefined) {
        return res.status(400).json({ 
            error: 'Name and score are required' 
        });
    }

    db.run("INSERT INTO highscores (name, score) VALUES (?, ?)", [name, score], function(err) {
        if (err) {
            return res.status(500).json({ 
                error: err.message
            });
        }
        res.status(200).json({ id: this.lastID });
    });
});

// Highscores abzurufen
app.get('/highscores', (req, res) => {
    db.all("SELECT name, score FROM highscores ORDER BY score DESC LIMIT 3", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ 
                error: err.message 
            });
        }
        res.json(rows);
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf ${port}`);
});

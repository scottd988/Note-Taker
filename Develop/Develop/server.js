const express = require('express');
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3002;
const generateUniqueId = require("generate-unique-id");
// Import and store notes data
const oldNote = require("./db/db.json");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// GET route for landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET route to the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


// GET route for retrieving notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json('Error in retrieving notes');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// POST route for adding notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = generateUniqueId({length: 5});
    // Write updated notes to db/db.json file
    const allNotes = JSON.stringify(oldNote, null, 2);

    // Reads notes from db/db.json file
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error in reading notes' });
        }
        // Adds new note to array of notes
        const notes = JSON.parse(data);
        notes.push(newNote);

        // Writes the updated notes back to db/db.json
        fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error in adding note' });
            }
            res.json(newNote); // Send the new note as a response
        });
    });
});

app.listen(PORT, () => 
    console.log(`App listening on port ${PORT}!`)
);
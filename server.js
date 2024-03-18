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
    // Generate unique id for new note
    newNote.id = generateUniqueId({length: 5});
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error in reading notes' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

    // Reads notes from db/db.json file
    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error in adding note' });
        }
            res.json(newNote); // Send the new note as a response
        });
    });
});

// delete route for deleting notes
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;   
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        const notes = JSON.parse(data);
        const updatedNotes = notes.filter(note => note.id !== noteId);
        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
            res.json(updatedNotes); // Send the updated note list as a response
        });
    });
})
;
app.listen(PORT, () => 
    console.log(`App listening on port ${PORT}!`)
);
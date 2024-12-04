const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'notes.db');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
let db = null;

const initializeDbServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log('server run at 3000 port')
        });
    }catch(e) {
        console.log(`DB error: ${e.message}`);
        process.exit(1);
    }
}

initializeDbServer();

// Adding a new note

app.post('/notes', async(request, response) => {
    try {
        const {id, title, description, category, createdAt, updatedAt} = request.body;
        const addNewNoteQuery = `
            INSERT INTO 
                notes(id, title, description, category, created_at, updated_at)
            VALUES
                (
                    '${id}',
                    '${title}',
                    '${description}',
                    '${category}',
                    ${createdAt},
                    ${updatedAt}
            );
        `;
        await db.run(addNewNoteQuery);
        response.send('sucessfully add new note');

    }catch(e) {
        console.log(`error: ${e.message}`);
    }
});

app.get('/notes', async(request, response) => {
    try {
        const getNotesQuery = `SELECT * FROM notes;`;
        const notesArray = await db.all(getNotesQuery);
        response.send(notesArray);
    }catch(e) {
        console.log(`error: ${e.message}`);
    }
});

app.put('/notes/:id', async(request, response) => {
    const {id} = request.params;
    const {title, description, category} = request.body;
    const updateNoteQuery = `
        UPDATE 
            notes
        SET 
            title = '${title}',
            description = '${description}',
            category = '${category}'
        WHERE
            id = '${id}';
    `;
    await db.run(updateNoteQuery);
    response.send("updated note successfully")
});

app.delete("/notes/:id", async(request, response) => {
    try {
        const {id} = request.params;
        const deleteNoteQuery = `DELETE FROM notes WHERE id = '${id}';`;
        await db.run(deleteNoteQuery);
        response.send("delete note successfully");
    }catch(e) {
        console.log(`Error: ${e.message}`);
    }
});

module.exports = app;


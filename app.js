const path = require('path');
const fs = require('fs');
const express = require('Express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/notes', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(JSON.parse(fs.readFileSync('./db/db.json') || []));
});

app.post('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json') || []);
  let newNote = {
    id: Math.max(...notes.map(note => note.id)) + 1,
    ...req.body,
  };
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json') || []);
  let noteIndex = notes.findIndex(note => note.id === +req.params.id);
  let note = notes.splice(noteIndex, 1);

  fs.writeFileSync('./db/db.json', JSON.stringify(notes));

  res.send(note);
});

app.get('/:wildcard', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Restarted at ${new Date().toLocaleTimeString()}`);
  console.log(`Listening at http://localhost:${PORT}`);
});
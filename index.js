const express = require('express');
const app = express();
const csv = require('csv-parser')
const fs = require('fs');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const prefix = `\x1b[1m[${new Date().toLocaleTimeString()}]\x1b[0m`;

app.use((req, res, next) => {
    console.log(`${prefix} ${req.hostname} -> ${req.method}: ${req.url}`);
    next();
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
      res.status(500).send("Could not find file.")
      return;
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => res.status(200).send(results));
})

console.clear();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`${prefix} Listening on port ${port}`));

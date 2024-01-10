// index.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const shortid = require('shortid');

const app = express();
const port = 3001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    const uniqueIdentifier = shortid.generate();
    cb(null, uniqueIdentifier + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  const files = fs.readdirSync('./uploads/');
  res.render('index', { files });
});

app.get('/download/:identifier', (req, res) => {
  const fileName = req.params.identifier;
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Check if the file exists before attempting to download
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  const fileName = req.file.filename;
  const downloadLink = `${req.protocol}://${req.get('host')}/download/${fileName}`;
  res.send(`File uploaded successfully. Share this link with your friend: ${downloadLink}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const app = express();
const path = require('path');
const port = 3000; // You can use any available port

const buildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(buildPath));

app.get('/', (req, res) => {
  // res.send('Hello, World!');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

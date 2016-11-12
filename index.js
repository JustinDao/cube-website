'use strict';
let express = require('express');
let path = require('path');

let PORT = process.env.PORT || 3000;
let FILE_PATH = path.join(__dirname, 'page.html');

let app = express();
app.get('**', (req, res) => res.sendFile(FILE_PATH));

app.listen(PORT, () => console.log('Server listening on port %s', PORT));

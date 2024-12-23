// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const tanamanRoutes = require('./routes/tanamanRoute.js');
const qrRoutes = require('./routes/qrRoute.js');

const app = express();

app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.use('/api/tanaman', tanamanRoutes);
app.use('/scan', qrRoutes);

app.listen(3001, () => {
    console.log('Server berjalan di http://localhost:3001');
});

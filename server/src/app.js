// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const tanamanRoutes = require('./routes/tanamanRoute.js');

const app = express();

app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tanaman', tanamanRoutes);

app.get('/scan/:qrCode', (req, res) => {
    const qrCode = req.params.qrCode;
    const tanamanDetail = tanaman.find(t => t.nama === qrCode);
    if (tanamanDetail) {
        res.render('detail', { tanaman: tanamanDetail });
    } else {
        res.status(404).send('Tanaman tidak ditemukan');
    }
});

app.listen(3001, () => {
    console.log('Server berjalan di http://localhost:3001');
});

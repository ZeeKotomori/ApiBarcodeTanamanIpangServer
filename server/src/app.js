const express = require('express');
const bodyParser = require('body-parser');
const tanamanRoutes = require('./routes/tanamanRoute.js');
const cors = require('cors');
const qrRoutes = require('./routes/qrRoute.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server' });
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use('/api/tanaman', tanamanRoutes);
app.use('/scan', qrRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const tanamanRoutes = require('./routes/tanamanRoute.js');
const qrRoutes = require('./routes/qrRoute.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the static folder
app.use('/public', express.static(path.join(__dirname,'..', 'public')));

app.use('/api/tanaman', tanamanRoutes);
app.use('/scan', qrRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
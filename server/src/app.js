const express = require('express');
const cors = require('cors');
const path = require('path');

const tanamanRoutes = require('./routes/tanamanRoute.js');
const qrRoutes = require('./routes/qrRoute.js');
const adminRoutes = require('./routes/userRoute.js');
const authRoutes = require('./routes/authRoute.js');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname,'..', 'public')));

app.use('/api/tanaman', tanamanRoutes);
app.use('/scan', qrRoutes);
app.use('/admin', adminRoutes);
app.use('/', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
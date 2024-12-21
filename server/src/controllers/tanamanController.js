// src/controllers/tanamanController.js

const tanaman = require('../models/tanamanModel.js');  // Import model tanaman

// Menampilkan semua tanaman
exports.getAllTanaman = (req, res) => {
    res.status(200).json(tanaman);
};

// Menampilkan tanaman berdasarkan id
exports.getTanamanById = (req, res) => {
    const id = parseInt(req.params.id);
    const tanamanDetail = tanaman.find((t) => t.id === id);

    if (tanamanDetail) {
        res.status(200).json(tanamanDetail);
    } else {
        res.status(404).send('Tanaman tidak ditemukan');
    }
};

// Menambahkan tanaman baru
exports.createTanaman = (req, res) => {
    const { nama, namaLatin, khasiat } = req.body;
    const newTanaman = {
        id: tanaman.length + 1,
        nama,
        namaLatin,
        khasiat,
    };
    tanaman.push(newTanaman);
    res.status(201).json(newTanaman);
};

// Mengupdate tanaman berdasarkan id
exports.updateTanaman = (req, res) => {
    const id = parseInt(req.params.id);
    const { nama, namaLatin, khasiat } = req.body;
    const tanamanIndex = tanaman.findIndex((t) => t.id === id);

    if (tanamanIndex !== -1) {
        tanaman[tanamanIndex] = { id, nama, namaLatin, khasiat };
        res.status(200).json(tanaman[tanamanIndex]);
    } else {
        res.status(404).send('Tanaman tidak ditemukan');
    }
};

// Menghapus tanaman berdasarkan id
exports.deleteTanaman = (req, res) => {
    const id = parseInt(req.params.id);
    const tanamanIndex = tanaman.findIndex((t) => t.id === id);

    if (tanamanIndex !== -1) {
        tanaman.splice(tanamanIndex, 1);
        res.status(200).send('Tanaman dihapus');
    } else {
        res.status(404).send('Tanaman tidak ditemukan');
    }
};

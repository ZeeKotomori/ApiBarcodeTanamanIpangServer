const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const domain = "https://localhost:3001";

exports.getAllTanaman = async (req, res) => {
    try {
        const tanaman = await prisma.tanaman.findMany();
        res.status(200).json(tanaman);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.getTanamanById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const tanaman = await prisma.tanaman.findUnique({ where: { id } });

        if (tanaman) {
            res.status(200).json(tanaman);
        } else {
            res.status(404).send('Tanaman tidak ditemukan');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.createTanaman = async (req, res) => {
    const { nama, namaLatin, khasiat ,bagianYangDigunakan} = req.body;

    if (!nama || !namaLatin || !khasiat || !bagianYangDigunakan) {
        return res.status(400).json({ message: 'Nama, namaLatin, khasiat, dan bagianYangDigunakan harus diisi' });
    }

    try {
        const domain = process.env.APP_DOMAIN || 'http://localhost:3001';

        const qrCodeUrl = `${domain}/scan/${namaLatin}`;
        
        const newTanaman = await prisma.tanaman.create({
            data: {
                nama,
                namaLatin,
                khasiat,
                bagianYangDigunakan,
                qrCodeUrl,
            },
        });

        const qrCodeDir = path.join(__dirname, '..', 'public', 'qrCodes');
        if (!fs.existsSync(qrCodeDir)) {
            fs.mkdirSync(qrCodeDir, { recursive: true });
        }

        const fileName = `qr-${newTanaman.namaLatin}.png`;
        const filePath = path.join(qrCodeDir, fileName);

        await QRCode.toFile(filePath, qrCodeUrl);

        res.status(201).json({
            id: newTanaman.id,
            nama: newTanaman.nama,
            namaLatin: newTanaman.namaLatin,
            khasiat: newTanaman.khasiat,
            qrCodeUrl: newTanaman.qrCodeUrl,
            qrCodeFile: `/public/qrCodes/${fileName}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.updateTanaman = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nama, namaLatin, khasiat, bagianYangDigunakan} = req.body;
    try {
        const updatedTanaman = await prisma.tanaman.update({
            where: { id },
            data: {
                nama,
                namaLatin,
                khasiat,
                bagianYangDigunakan
            },
        });
        res.status(200).json(updatedTanaman);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).send('Tanaman tidak ditemukan');
        } else {
            res.status(500).send('Terjadi kesalahan pada server');
        }
    }
};

exports.deleteTanaman = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.tanaman.delete({ where: { id } });
        res.status(200).send('Tanaman dihapus');
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).send('Tanaman tidak ditemukan');
        } else {
            res.status(500).send('Terjadi kesalahan pada server');
        }
    }
};
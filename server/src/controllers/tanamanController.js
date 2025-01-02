const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const domain = process.env.APP_DOMAIN || '';

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

exports.getAllTanaman = async (req, res) => {
    try {
        const tanaman = await prisma.tanaman.findMany(
            { include : {
                khasiat : true,
                bagianYangDigunakan : true
            }}
        );
        const jumlahTanaman = tanaman.length;

        if (tanaman) {
            res.status(200).json({
                jumlahTanaman,
                data: tanaman,
            });
        } else {
            res.status(404).send('Tanaman tidak ditemukan');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.getTanamanById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const tanaman = await prisma.tanaman.findUnique(
            { where: { id },
            include : {
                khasiat :  true,
                bagianYangDigunakan : true
            } 
        }
        );

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
    const { nama, namaLatin, khasiat, bagianYangDigunakan } = req.body;

    if (!nama || !namaLatin || !khasiat || !bagianYangDigunakan) {
        return res.status(400).send({ message: 'Nama, namaLatin, khasiat, dan bagianYangDigunakan harus diisi' });
    }

    try {
        const findExists = await prisma.tanaman.findFirst({ where: { namaLatin : namaLatin } });

        if (findExists) return res.status(400).send("Tanaman sudah terdaftar silahkan melakukan update pada tanaman atau hapus tanaman dan buat baru");

        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const fileExtension = path.extname(file.originalname);
        const fileImageName = `${namaLatin}-${formattedDate}`;

        const qrUrl = `${domain}/scan/${namaLatin}`;
        const imageUrl = `${domain}/public/uploads/${fileImageName}${fileExtension}`;
        const qrImageUrl = `${domain}/public/qrCodes/qr-${fileImageName}.png`;

        const newTanaman = await prisma.tanaman.create({
            data: {
                nama,
                namaLatin,
                khasiat: { create: [{ deskripsi: khasiat }] },
                bagianYangDigunakan: { create: [{ bagian: bagianYangDigunakan }] },
                qrUrl,
                qrImageUrl,
                imageUrl,
            },
        });

        const qrCodeDir = path.join(__dirname, '..', '..', 'public', 'qrCodes');
        ensureDirectoryExists(qrCodeDir);

        const fileName = `qr-${newTanaman.namaLatin}-${formattedDate}.png`;
        const filePath = path.join(qrCodeDir, fileName);

        await QRCode.toFile(filePath, qrUrl);

        res.status(201).send(newTanaman);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.updateTanaman = async (req, res) => {
    const { id } = req.params;
    const { nama, namaLatin, khasiat, bagianYangDigunakan } = req.body;

    try {
        const existingTanaman = await prisma.tanaman.findUnique({ where: { id: parseInt(id) } });
        if (!existingTanaman) {
            return res.status(404).send('Tanaman tidak ditemukan');
        }

        let imageUrl = existingTanaman.imageUrl;
        if (req.file) {
            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0];
            const fileImageName = `${req.file.filename}-${formattedDate}`;
            const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', fileImageName);

            if (imageUrl && fs.existsSync(path.join(__dirname, '..', '..', imageUrl))) {
                fs.unlinkSync(path.join(__dirname, '..', '..', imageUrl));
            }
            imageUrl = `public/uploads/${fileImageName}`;
            fs.renameSync(req.file.path, uploadPath);
        }

        const updatedTanaman = await prisma.tanaman.update({
            where: { id: parseInt(id) },
            data: {
                nama,
                namaLatin,
                khasiat: { update: { deskripsi: khasiat } },
                bagianYangDigunakan: { update: { bagian: bagianYangDigunakan } },
                imageUrl,
            },
        });

        res.status(200).send(updatedTanaman);
    } catch (error) {
        console.error('Error updating tanaman:', error);
        res.status(500).send('Terjadi kesalahan pada server');
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
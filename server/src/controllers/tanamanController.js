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

        if (tanaman) {
            res.status(200).send({ data : tanaman });
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
        return res.status(400).send('Nama, namaLatin, khasiat, dan bagianYangDigunakan harus diisi');
    }

    try {
        const findExists = await prisma.tanaman.findFirst({ where: { namaLatin : namaLatin } });

        if (findExists) return res.status(400).send("Tanaman sudah terdaftar silahkan melakukan update pada tanaman atau hapus tanaman dan buat baru");

        const file = req.file;
        console.log(file);

        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const fileExtension = path.extname(file.originalname);
        const fileImageName = `${namaLatin}-${formattedDate}`;

        const qrUrl = `${domain}/scan/${namaLatin}`;
        const imageUrl = `/public/uploads/${fileImageName}${fileExtension}`;
        const qrImageUrl = `/public/qrCodes/qr-${fileImageName}.png`;

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
        res.status(500).send('Terjadi kesalahan pada server' );
    }
};

exports.updateTanaman = async (req, res) => {
    const { id } = req.params;
    const { nama, namaLatin, khasiat, bagianYangDigunakan } = req.body;

    if (!namaLatin || !nama || !khasiat || !bagianYangDigunakan) {
        return res.status(400).send('semua field harus diisi');
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const existingTanaman = await prisma.tanaman.findUnique({ where: { id: parseInt(id) } });
        if (!existingTanaman) {
            return res.status(404).send('Tanaman tidak ditemukan');
        }

        let imageUrl = existingTanaman.imageUrl;
        let qrImageUrl = existingTanaman.qrImageUrl;

        if (req.file) {
            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0];
            const fileExtension = path.extname(req.file.originalname);
            const fileImageName = `${namaLatin}-${formattedDate}${fileExtension}`;
            const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads', fileImageName);
        
            imageUrl = `/public/uploads/${fileImageName}`;
            qrImageUrl = `/public/qrCodes/qr-${fileImageName}`;
            fs.renameSync(req.file.path, uploadPath);

            if (existingTanaman.imageUrl && fs.existsSync(path.join(__dirname, '..', '..', existingTanaman.imageUrl))) {
                fs.unlinkSync(path.join(__dirname, '..', '..', existingTanaman.imageUrl));
            }
            if (existingTanaman.qrImageUrl && fs.existsSync(path.join(__dirname, '..', '..', existingTanaman.qrImageUrl))) {
                fs.unlinkSync(path.join(__dirname, '..', '..', existingTanaman.qrImageUrl));
            }
        }

        const updatedTanaman = await prisma.tanaman.update({
            where: { id: parseInt(id) },
            data: {
                nama,
                namaLatin,
                khasiat: {
                    update: {
                        where: { id: existingTanaman.id },
                        data: { deskripsi: khasiat }
                    }
                },
                bagianYangDigunakan: {
                    update: {
                        where: { id: existingTanaman.id },
                        data: { bagian: bagianYangDigunakan }
                    }
                },
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
    
    const tanaman = await prisma.tanaman.findFirst({ where : { id } });
    
    if (tanaman.length === 0) {
        return res.status(404).send('Tidak ditemukan satupun tanaman untuk dihapus');
    }

    try {
        
        if (tanaman.imageUrl && fs.existsSync(path.join(__dirname, '..', '..', tanaman.imageUrl))) {
            fs.unlinkSync(path.join(__dirname, '..', '..', tanaman.imageUrl));
        }
        if (tanaman.qrImageUrl && fs.existsSync(path.join(__dirname, '..', '..', tanaman.qrImageUrl))) {
            fs.unlinkSync(path.join(__dirname, '..', '..', tanaman.qrImageUrl));
        }
        
        await prisma.tanaman.delete({ where: { id } });

        res.status(200).send('Tanaman dihapus');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.deleteMultipleTanaman = async (req, res) => {
    const { ids } = req.body;

    if(!Array.isArray(ids)) {
        return res.status(400).send('IDs harus berupa array');
    }

    if(ids.length === 0) {
        return res.status(400).send('IDs tidak boleh kosong');
    }

    try {
        const tanamans = await prisma.tanaman.findMany({ where: { id: { in: ids } } });

        if (tanamans.length === 0) {
            return res.status(404).send('Tidak ditemukan satupun tanaman untuk dihapus');
        }

        tanamans.forEach(tanaman => {
            if (tanaman.imageUrl && fs.existsSync(path.join(__dirname, '..', '..', tanaman.imageUrl))) {
                fs.unlinkSync(path.join(__dirname, '..', '..', tanaman.imageUrl));
            }
            if (tanaman.qrImageUrl && fs.existsSync(path.join(__dirname, '..', '..', tanaman.qrImageUrl))) {
                fs.unlinkSync(path.join(__dirname, '..', '..', tanaman.qrImageUrl));
            }
        });

        await prisma.tanaman.deleteMany({ where: { id: { in: ids } } });

        res.status(200).send({ msg : 'Tanaman berhasil dihapus', deletedTanaman: tanamans });
    } catch (error) {
        console.log(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}
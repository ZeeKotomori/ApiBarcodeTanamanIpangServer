const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.qrTanaman = async (req, res) => { 
    const namaLatin = req.params.qrTanaman;

    try {
        const tanaman = await prisma.tanaman.findFirst({ 
            where: { namaLatin : namaLatin },
            include : {
                khasiat :  true,
                bagianYangDigunakan : true
            } 
        });
        if (tanaman) {
            res.status(200).json(tanaman);
        } else {
            res.status(404).send('Tanaman tidak ditemukan');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};
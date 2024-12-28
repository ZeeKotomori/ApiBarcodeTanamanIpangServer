// uploadMulter.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Tambahkan ini untuk menggunakan modul fs

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
        ensureDirectoryExists(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const namaLatin = req.body.namaLatin || path.basename(file.originalname, fileExtension);
        cb(null, `${namaLatin}${fileExtension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format file tidak didukung'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
});

module.exports = upload;
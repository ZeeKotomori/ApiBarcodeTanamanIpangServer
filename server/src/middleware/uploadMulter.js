const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', '..', 'public', 'uploads');
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (error) {
                console.error('Gagal membuat folder:', error.message);
                return cb(error);
            }
        }        
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal ukuran file 10MB
    fileFilter: (req, file, cb) => {
        // Memeriksa ekstensi file yang diterima (misalnya, hanya gambar)
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Hanya file gambar yang diperbolehkan'));
        }
        cb(null, true);
    },
});


module.exports = upload;
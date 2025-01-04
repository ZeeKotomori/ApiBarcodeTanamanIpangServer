const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        if (!req.body.namaLatin) {
            return cb(new Error('Nama Latin tidak boleh kosong!'));
        }
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const fileExtension = path.extname(file.originalname);
        const namaLatin = req.body.namaLatin;
        cb(null, `${namaLatin}-${formattedDate}${fileExtension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
}).single('file');

module.exports = upload;
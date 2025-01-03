const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    const tokenBearer = token && token.split(' ')[1];

    if (!tokenBearer) {
        return res.status(401).send('Token tidak ditemukan');
    }
    
    jwt.verify(tokenBearer, secret, (err, user) => {
        if (err) {
            return res.status(403).send('Token tidak valid');
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
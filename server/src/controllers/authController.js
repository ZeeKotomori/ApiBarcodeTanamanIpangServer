const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send('Email dan password harus diisi');

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).send('Email tidak ditemukan');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).send('Password tidak valid');
        }

        const role = user.role

        const token = jwt.sign({ email, role }, secret, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login berhasil',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.logout = async (req, res) => {
    try {
        res.setHeader('Authorization', '');
        return res.status(200).send('Logout berhasil');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Terjadi kesalahan pada server');
    }
}
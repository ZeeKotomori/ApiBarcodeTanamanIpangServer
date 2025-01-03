const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const jumlahUsers = users.length;

        if (users) {
            res.status(200).json({
                jumlahUsers,
                data: users,
            });
        } else {
            res.status(404).send('User tidak ditemukan');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique(
            { where: { id }
        }
        );

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User tidak ditemukan');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) return res.status(400).send('Username, email, dan password harus diisi');
    
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userExists = await prisma.user.findFirst({ 
            where: { 
                OR: [
                    { email },
                    { username }
                ]
            } 
        });
        if (userExists) return res.status(400).send('Username/Email sudah terdaftar');

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password : hashedPassword
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body;

        
    if (!username || !email || !password) return res.status(400).send('Username, email, dan password harus diisi');

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                password : hashedPassword
            }
        });

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.makeUserAsAdmin = async (req, res) => {
    const id = req.params.id;
    try {
        const userExists = await prisma.user.findUnique({ where: { id } });
        if (!userExists) return res.status(404).send('User tidak ditemukan');

        const user = await prisma.user.update({
            where: { id },
            data: {
                role: 'ADMIN'
            }
        });


        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {

        const userExists = await prisma.user.findUnique({ where: { id } });

        if (!userExists) return res.status(404).send('User tidak ditemukan');

        const user = await prisma.user.delete({
            where: { id }
        });

        res.status(200).json(`user dengan id ${id} telah dihapus`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
}
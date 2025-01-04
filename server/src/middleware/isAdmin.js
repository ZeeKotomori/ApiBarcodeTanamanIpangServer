const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        const email = req.user.email; 

        console.log(email);
        const existsUser = prisma.user.findUnique({  where: { email : email } });

        if (!existsUser) return res.status(404).send('User tidak ditemukan/sudah non-active');
        next();
    } else {
        res.status(403).send({ msg: 'Access denied. Admins only.' });
    }
};

module.exports = isAdmin;
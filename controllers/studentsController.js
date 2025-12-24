const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        return res.json(students);
    } catch (err) {
        console.error('getAllStudents error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 
const createNewStudent = async (req, res) => {
    try {
        const { name, password, contact } = req.body;
        if (!name || !password || !contact) {
            return res.status(400).json({ error: 'name, password and contact are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = await prisma.student.create({
            data: {
                name,
                password: hashedPassword,
                contact
            }
        });
        return res.status(201).json(newStudent);
    } catch (err) {
        if (err && err.code === 'P2002') {
            return res.status(409).json({ error: 'Name or contact already exists' });
        }
        console.error('createNewStudent error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}   
const loginStudent = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }
        const student = await prisma.student.findUnique({ where: { name } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const isValid = await bcrypt.compare(password, student.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not set');
            return res.status(500).json({ error: 'Server misconfiguration' });
        }
        const payload = {
            sub: student.id,
            name: student.name,
            contact: student.contact
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Successfully logged in', token });
    } catch (err) {
        console.error('loginStudent error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    getAllStudents,
    createNewStudent,
    loginStudent
}
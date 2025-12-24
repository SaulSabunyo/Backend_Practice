//import supertest
const request = require('supertest');
//import the server
const server = require('../app');
//import prisma client
const prisma = require('../prismaClient');

describe('Students API Endpoints test suite',() =>{    // Ensure a clean slate for unique constraints before tests
    beforeAll(async () => {
        await prisma.student.deleteMany({
            where: {
                OR: [
                    { name: 'teststudent' },
                    { contact: '1234567890' }
                ]
            }
        });
    });
    it('Create a new user using /students/register', async () => {
    const newStudent = {
        name: 'teststudent',
        password: 'testpassword',
        contact: '1234567890'
    };
    const res = await request(server)
        .post('/students/register')
        .send(newStudent);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
});

    it('Login with the created user using /students/login', async () => {  
    const loginDetails = {
        name: 'teststudent',
        password: 'testpassword'
    };
    const res = await request(server)
        .post('/students/login')
        .send(loginDetails);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
});

    it('Fetch all students using /students (protected route)', async () => {
    // First, login to get the token
    const loginDetails = {
        name: 'teststudent',
        password: 'testpassword'
    };
    const loginRes = await request(server)
        .post('/students/login')
        .send(loginDetails);
    const token = loginRes.body.token;  
    // Now, access the protected route
    const res = await request(server)
        .get('/students')
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
});

    // Clean up: delete the test student after tests
    afterAll(async () => {
    await prisma.student.deleteMany({
        where: { name: 'teststudent' }
    });
    await prisma.$disconnect();
});
});

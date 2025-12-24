const prisma = require('../prismaClient');

const getALLSchools = async (req, res) => {
    let schools = await prisma.school.findMany();
    res.send(schools);
}
const createNewSchool = async (req, res) => {
    let newSchool = await prisma.school.create({
        data: req.body
    });
    res.send(newSchool);
}   
module.exports = {
    getALLSchools,
    createNewSchool
}
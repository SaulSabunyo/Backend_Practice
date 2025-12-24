// Use the configured Prisma client (with adapter) and faker
const prisma = require('../prismaClient');
const { faker } = require('@faker-js/faker');

const NUM_OF_SCHOOLS = 5;

async function main() {
  // Create NUM_OF_SCHOOLS schools each with 2-3 students
  const creations = Array.from({ length: NUM_OF_SCHOOLS }).map(() =>
    prisma.school.create({
      data: {
        name: faker.company.name(),
        contact: faker.phone.number(),
        students: {
          createMany: {
            data: Array.from({ length: faker.number.int({ min: 2, max: 3 }) }).map(() => ({
              name: faker.person.fullName(),
              password: faker.internet.password(),
              contact: faker.phone.number(),
            })),
          },
        },
      },
    })
  );

  const createdSchools = await Promise.all(creations);
  console.log(`Created ${createdSchools.length} schools with their students.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
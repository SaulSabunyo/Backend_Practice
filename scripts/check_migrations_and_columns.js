require('dotenv/config');
const prisma = require('../prismaClient');

(async () => {
  try {
    console.log('Connected to DB via', process.env.DATABASE_URL);

    const cols = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Student';
    `;
    console.log('\nStudent table columns:');
    console.table(cols);

    const migrations = await prisma.$queryRaw`
      SELECT id, migration_name, finished_at
      FROM _prisma_migrations
      ORDER BY finished_at DESC;
    `;
    console.log('\n_prisma_migrations latest entries:');
    console.table(migrations);
  } catch (err) {
    console.error('Error querying DB:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
})();

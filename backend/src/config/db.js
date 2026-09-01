// Single shared Prisma client instance (acts as our DB connection / unit of work).
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;

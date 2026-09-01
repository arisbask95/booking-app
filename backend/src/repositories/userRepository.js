// ---- Repository layer ----
// Isolates all Prisma/SQL knowledge for the User aggregate.
// Services depend on this interface, never on Prisma directly.
const prisma = require("../config/db");

const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  create({ name, email, password, role }) {
    return prisma.user.create({
      data: { name, email, password, role: role || "CUSTOMER" },
    });
  },
};

module.exports = userRepository;

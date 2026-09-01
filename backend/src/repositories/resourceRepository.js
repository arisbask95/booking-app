// ---- Repository layer ----
const prisma = require("../config/db");

const resourceRepository = {
  findAll() {
    return prisma.resource.findMany({ orderBy: { name: "asc" } });
  },

  findById(id) {
    return prisma.resource.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.resource.create({ data });
  },

  update(id, data) {
    return prisma.resource.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.resource.delete({ where: { id } });
  },
};

module.exports = resourceRepository;

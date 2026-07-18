const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Using local instance, ideally imported from a shared db/prisma module

class CategoryRepository {
  async create(data) {
    return await prisma.category.create({ data });
  }

  async findAll() {
    return await prisma.category.findMany();
  }

  async findById(id) {
    return await prisma.category.findUnique({ where: { id } });
  }

  async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await prisma.category.delete({ where: { id } });
  }

  async findByName(name) {
    return await prisma.category.findFirst({ where: { name } });
  }
}

module.exports = new CategoryRepository();

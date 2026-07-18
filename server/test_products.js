import { prisma } from "./src/config/db.js";

async function main() {
  try {
    console.log("Acquiring products...");
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        category: true,
        vendor: true
      }
    });
    console.log("Success! Count:", products.length);
  } catch (error) {
    console.error("Prisma error acquiring products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

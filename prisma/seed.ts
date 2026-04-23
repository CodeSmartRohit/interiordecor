import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@decor.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@decor.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@demo.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("Demo user created:", user.email);

  // Seed products
  const products = [
    {
      title: "Artisan Ceramic Vase",
      description: "Handcrafted ceramic vase with a matte finish and organic form. Perfect for fresh or dried floral arrangements. Each piece is uniquely made by skilled artisans.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=600&fit=crop",
      category: "Decor",
      stock: 25,
      featured: true,
    },
    {
      title: "Minimalist Table Lamp",
      description: "Contemporary table lamp featuring a brushed brass base and linen shade. Provides warm ambient lighting for any room. LED compatible.",
      price: 149.99,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop",
      category: "Lighting",
      stock: 18,
      featured: true,
    },
    {
      title: "Woven Throw Blanket",
      description: "Luxuriously soft woven throw blanket made from 100% organic cotton. Features a subtle herringbone pattern in neutral tones.",
      price: 65.00,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
      category: "Textiles",
      stock: 40,
      featured: false,
    },
    {
      title: "Abstract Wall Art Print",
      description: "Museum-quality giclée print on archival paper. Abstract composition in earth tones that complements modern and traditional interiors alike.",
      price: 129.00,
      imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&h=600&fit=crop",
      category: "Wall Art",
      stock: 15,
      featured: true,
    },
    {
      title: "Scandinavian Side Table",
      description: "Clean-lined side table crafted from solid oak with tapered legs. Features a natural oil finish that highlights the wood grain.",
      price: 245.00,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
      category: "Furniture",
      stock: 10,
      featured: true,
    },
    {
      title: "Linen Cushion Cover Set",
      description: "Set of 2 premium linen cushion covers in sage green. Features invisible zipper closure and pre-washed for extra softness.",
      price: 45.00,
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
      category: "Textiles",
      stock: 50,
      featured: false,
    },
    {
      title: "Brass Candle Holders",
      description: "Elegant set of 3 brass candle holders in varying heights. Features an antique brass finish that develops a beautiful patina over time.",
      price: 78.00,
      imageUrl: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
      category: "Decor",
      stock: 30,
      featured: false,
    },
    {
      title: "Modern Pendant Light",
      description: "Statement pendant light with a matte black exterior and warm gold interior. Creates a striking focal point over dining tables or kitchen islands.",
      price: 199.00,
      imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=600&fit=crop",
      category: "Lighting",
      stock: 12,
      featured: true,
    },
    {
      title: "Terrazzo Bookends",
      description: "Pair of contemporary terrazzo bookends in white with colorful aggregate chips. Each piece is weighted for stability.",
      price: 55.00,
      imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=600&h=600&fit=crop",
      category: "Decor",
      stock: 20,
      featured: false,
    },
    {
      title: "Botanical Line Art Set",
      description: "Set of 3 minimalist botanical line drawings. Printed on premium matte paper with archival inks. Frames not included.",
      price: 85.00,
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&h=600&fit=crop",
      category: "Wall Art",
      stock: 22,
      featured: false,
    },
    {
      title: "Velvet Accent Chair",
      description: "Luxurious velvet accent chair with a curved silhouette and gold-finished legs. Deep seat cushion provides exceptional comfort.",
      price: 450.00,
      imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop",
      category: "Furniture",
      stock: 8,
      featured: true,
    },
    {
      title: "Handwoven Jute Rug",
      description: "Natural jute area rug with a chunky handwoven texture. Adds warmth and organic texture to any space. Size: 5x7 ft.",
      price: 189.00,
      imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=600&fit=crop",
      category: "Textiles",
      stock: 14,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);
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

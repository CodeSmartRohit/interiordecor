import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = (session.user as { role?: string }).role === "ADMIN";

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, imageUrl: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, address, fullName, email, phone, notes } = await request.json();

    if (!items || !items.length || !address || !fullName || !email || !phone) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Verify stock and calculate total
    let totalAmount = 0;
    const orderItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order and reduce stock in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          totalAmount,
          address,
          fullName,
          email,
          phone,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, title: true, imageUrl: true } },
            },
          },
        },
      });

      // Reduce stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

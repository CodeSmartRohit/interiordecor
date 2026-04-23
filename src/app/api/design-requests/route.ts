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

    const requests = await prisma.designRequest.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Design requests GET error:", error);
    return NextResponse.json({ error: "Failed to fetch design requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { address, roomType, roomDimensions, description, inspirationLink } = data;

    if (!address || !roomType || !roomDimensions || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const designRequest = await prisma.designRequest.create({
      data: {
        userId: session.user.id,
        address,
        roomType,
        roomDimensions,
        description,
        inspirationLink: inspirationLink || null,
      },
    });

    return NextResponse.json(designRequest, { status: 201 });
  } catch (error) {
    console.error("Design request POST error:", error);
    return NextResponse.json({ error: "Failed to create design request" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

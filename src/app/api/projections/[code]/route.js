import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE : supprimer une projection
export async function DELETE(request, { params }) {
  try {
    const { code } = params;

    const existing = await prisma.projection.findUnique({
      where: { id: code },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Projection non trouvée" },
        { status: 404 }
      );
    }

    await prisma.projection.delete({
      where: { id: code },
    });

    return NextResponse.json({ success: true, message: "Projection supprimée" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { code } = params;

    if (!code) {
      return NextResponse.json({ success: false, error: "Code du film manquant." }, { status: 400 });
    }

    // Suppression du film
    const deletedFilm = await prisma.film.delete({
      where: { codeFilm: code },
    });

    return NextResponse.json({ success: true, data: deletedFilm });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}

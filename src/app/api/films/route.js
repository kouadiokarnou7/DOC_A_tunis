import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - récupérer tous les films
export async function GET() {
  try {
    const films = await prisma.film.findMany({
      include: {
        realisateur: true,
        producteur: true,
      },
    });
    return NextResponse.json({ success: true, data: films });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - créer un nouveau film
export async function POST(request) {
  try {
    const body = await request.json();
    const { codeFilm, titre, dateFilm, sujet, codeRealisateur, codeProducteur } = body;

    if (!codeFilm || !titre || !dateFilm || !codeRealisateur || !codeProducteur) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Vérifier si le film existe
    const existing = await prisma.film.findUnique({ where: { codeFilm } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ce code de film existe déjà" },
        { status: 409 }
      );
    }

    // Créer le film avec relations
    const film = await prisma.film.create({
      data: {
        codeFilm,
        titre,
        dateFilm: new Date(dateFilm),
        sujet,
        realisateur: { connect: { code: codeRealisateur } },
        producteur: { connect: { code: codeProducteur } },
      },
      include: {
        realisateur: true,
        producteur: true,
      },
    });

    return NextResponse.json({ success: true, data: film }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

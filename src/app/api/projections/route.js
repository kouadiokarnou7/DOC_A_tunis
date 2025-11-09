import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - récupérer toutes les projections
export async function GET() {
  try {
    const projections = await prisma.projection.findMany({
      include: { film: true }, // inclut les infos du film lié
    });
    return NextResponse.json({ success: true, data: projections });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - créer une nouvelle projection
export async function POST(request) {
  try {
    const body = await request.json();
    const { filmCode, dateProjection, heure, salle } = body;

    if (!filmCode || !dateProjection || !heure || !salle) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    // Vérifier si le film existe
    const film = await prisma.film.findUnique({ where: { codeFilm: filmCode } });
    if (!film) {
      return NextResponse.json(
        { success: false, error: "Film introuvable." },
        { status: 404 }
      );
    }

    const projection = await prisma.projection.create({
      data: {
        filmCode,
        dateProjection: new Date(dateProjection),
        heure,
        salle,
      },
    });

    return NextResponse.json({ success: true, data: projection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

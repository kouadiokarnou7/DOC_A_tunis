// src/app/api/president/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const juryCode = searchParams.get("juryCode");
    const filmCode = searchParams.get("filmCode");

    let filter = {};
    if (juryCode) filter.juryCode = juryCode;
    if (filmCode) filter.filmCode = filmCode;

    const assignations = await prisma.assignation.findMany({
      where: filter,
      include: { film: true, jury: true },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json(assignations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    const assignations = await prisma.assignation.findMany({
      include: {
        film: true,
        jury: true,
      },
    });

    // Récupérer les notes correspondantes
    const notes = await prisma.note.findMany();
    const assignationsAvecNotes = assignations.map((a) => {
      const note = notes.find(
        (n) => n.filmCode === a.filmCode && n.juryCode === a.juryCode
      );
      return { ...a, note: note ? note.note : null };
    });

    return NextResponse.json(assignationsAvecNotes);
  } catch (err) {
    console.error("Erreur GET /assignments:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des assignations" },
      { status: 500 }
    );
  }
}
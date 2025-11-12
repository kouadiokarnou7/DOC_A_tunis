// src/app/api/notes/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ----------- RÉCUPÉRER TOUTES LES NOTES -----------
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { id: "asc" },
      include: {
        film: true,
        jury: true,
      },
    });
    return NextResponse.json({ success: true, data: notes });
  } catch (err) {
    console.error("Erreur GET /notes:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const { filmCode, juryCode, note } = await req.json();

    if (!filmCode || !juryCode || note === undefined) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifie si une note existe déjà pour ce film et ce jury
    const existing = await prisma.note.findFirst({
      where: { filmCode, juryCode },
    });

    let newNote;
    if (existing) {
      // Mise à jour si déjà existante
      newNote = await prisma.note.update({
        where: { id: existing.id },
        data: { note: parseFloat(note) },
      });
    } else {
      // Création sinon
      newNote = await prisma.note.create({
        data: {
          filmCode,
          juryCode,
          note: parseFloat(note),
        },
      });
    }

    return NextResponse.json({ success: true, data: newNote });
  } catch (err) {
    console.error("Erreur POST /notes:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// ----------- SUPPRIMER UNE NOTE -----------
export async function DELETE(req) {
  try {
    const { filmCode, juryCode } = await req.json();

    if (!filmCode || !juryCode) {
      return NextResponse.json({ error: "filmCode ou juryCode manquant" }, { status: 400 });
    }

    const existing = await prisma.note.findFirst({
      where: { filmCode, juryCode },
    });

    if (!existing) {
      return NextResponse.json({ error: "Note introuvable" }, { status: 404 });
    }

    const deleted = await prisma.note.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    console.error("Erreur DELETE /notes:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

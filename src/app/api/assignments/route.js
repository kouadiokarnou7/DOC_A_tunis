
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const assignations = await prisma.assignation.findMany({
      include: {
        film: true,
        jury: true
      },
      orderBy: { id: "asc" }
    });
    return NextResponse.json(assignations); 
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




export async function POST(request) {
  try {
    const body = await request.json();
    const { filmCode, jurys, salle, date, heure } = body;

    if (!filmCode || !jurys || !Array.isArray(jurys) || jurys.length === 0 || !date || !heure || !salle) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants ou invalides" },
        { status: 400 }
      );
    }

    const created = await Promise.all(
      jurys.map((juryCode) =>
        prisma.assignation.create({
          data: {
            filmCode,
            juryCode,
            salle,
            dateAssignation: new Date(date),
            heure,
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: created });
  } catch (err) {
    console.error("Erreur assignation:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      );
    }

    await prisma.assignation.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Assignation supprimée avec succès' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT : mettre à jour une assignation
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, films, jury, date, heure } = body;

    if (!id || !films || !Array.isArray(films) || films.length === 0 || !jury || !date || !heure) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants ou invalides' },
        { status: 400 }
      );
    }

    // Supprimer l'ancienne assignation et créer une nouvelle (simplifié)
    await prisma.assignation.delete({
      where: { id: parseInt(id) }
    });

    const assignationsUpdated = [];
    for (const filmCode of films) {
      const assignation = await prisma.assignation.create({
        data: {
          filmCode,
          juryCode: jury,
          dateAssignation: new Date(date),
          heure
        }
      });
      assignationsUpdated.push(assignation);
    }

    return NextResponse.json({
      success: true,
      message: 'Assignation(s) mise(s) à jour avec succès',
      data: assignationsUpdated
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

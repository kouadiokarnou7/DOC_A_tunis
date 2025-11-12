import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET : récupérer toutes les assignations
export async function GET() {
  try {
    const assignations = await prisma.assignation.findMany({
      include: { film: true, jury: true },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json({ data: assignations });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST : créer des assignations film ↔ jury
export async function POST(request) {
  try {
    const body = await request.json();
    const { films, juryCodes, date, heure, salle } = body;

    // Validation
    if (!films || !Array.isArray(films) || films.length === 0)
      return NextResponse.json({ success: false, error: 'Films manquants' }, { status: 400 });
    if (!juryCodes || !Array.isArray(juryCodes) || juryCodes.length === 0)
      return NextResponse.json({ success: false, error: 'Jury(s) manquant(s)' }, { status: 400 });
    if (!date || !heure || !salle)
      return NextResponse.json({ success: false, error: 'Date, heure ou salle manquante' }, { status: 400 });

    const assignationsCreated = [];

    // Créer une assignation par film et par membre du jury
    for (const filmCode of films) {
      for (const juryCode of juryCodes) {
        const assignation = await prisma.assignation.create({
          data: {
            filmCode,
            juryCode,
            dateAssignation: new Date(date),
            heure,
            salle
          }
        });
        assignationsCreated.push(assignation);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assignations créées avec succès',
      data: assignationsCreated
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE : supprimer une assignation
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    await prisma.assignation.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Assignation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT : mise à jour d'une assignation
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, films, juryCodes, date, heure, salle } = body;

    if (!id || !films || !Array.isArray(films) || films.length === 0)
      return NextResponse.json({ success: false, error: 'Films manquants' }, { status: 400 });
    if (!juryCodes || !Array.isArray(juryCodes) || juryCodes.length === 0)
      return NextResponse.json({ success: false, error: 'Jury(s) manquant(s)' }, { status: 400 });
    if (!date || !heure || !salle)
      return NextResponse.json({ success: false, error: 'Date, heure ou salle manquante' }, { status: 400 });

    // Supprimer l'ancienne assignation
    await prisma.assignation.delete({ where: { id: parseInt(id) } });

    const updatedAssignations = [];
    for (const filmCode of films) {
      for (const juryCode of juryCodes) {
        const assignation = await prisma.assignation.create({
          data: {
            filmCode,
            juryCode,
            dateAssignation: new Date(date),
            heure,
            salle
          }
        });
        updatedAssignations.push(assignation);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Assignations mises à jour avec succès',
      data: updatedAssignations
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

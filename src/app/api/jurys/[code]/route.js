import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE : supprimer un jury
export async function DELETE(request, { params }) {
  const { code } = params;
  try {
    await prisma.jury.delete({ where: { code } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

// PUT : mettre à jour un jury
export async function PUT(request, { params }) {
  const { code } = params;
  const body = await request.json();

  try {
    const jury = await prisma.jury.update({
      where: { code },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        date_Naissance: body.dateNaissance ? new Date(body.dateNaissance) : null,
        telephone: body.telephone,
        nationalite: body.nationalite,
      },
    });

    return NextResponse.json({ data: jury });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

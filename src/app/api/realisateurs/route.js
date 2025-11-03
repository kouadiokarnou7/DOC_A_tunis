import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - récupérer tous les réalisateurs
export async function GET() {
  try {
    const realisateurs = await prisma.realisateur.findMany();
    return NextResponse.json({ success: true, data: realisateurs });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - créer un nouveau réalisateur
export async function POST(request) {
  try {
    const body = await request.json();
    const { code, nom, prenom, dateNaissance } = body;

    if (!code || !nom || !prenom || !dateNaissance) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const existing = await prisma.realisateur.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ce code existe déjà" },
        { status: 409 }
      );
    }

    const realisateur = await prisma.realisateur.create({
      data: { code, nom, prenom, dateNaissance: new Date(dateNaissance) },
    });

    return NextResponse.json({ success: true, data: realisateur }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

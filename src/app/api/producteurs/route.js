import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assure-toi que le chemin vers ton client Prisma est correct

// GET - récupérer tous les producteurs
export async function GET() {
  try {
    const producteurs = await prisma.producteur.findMany();
    return NextResponse.json({ success: true, data: producteurs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - créer un nouveau producteur
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

    // Vérifier si le code existe déjà
    const existing = await prisma.producteur.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ce code existe déjà" },
        { status: 409 }
      );
    }

    const producteur = await prisma.producteur.create({
      data: { code, nom, prenom, dateNaissance: new Date(dateNaissance) },
    });

    return NextResponse.json({ success: true, data: producteur }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// src/app/api/jurys/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - récupérer tous les jurys
export async function GET() {
  try {
    const jurys = await prisma.jury.findMany({
      orderBy: { code: 'asc' },
    });
    return NextResponse.json({ success: true, data: jurys });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - créer un nouveau jury
export async function POST(request) {
  try {
    const body = await request.json();
    const { code, nom, prenom, dateNaissance, telephone, nationalite } = body;

    if (!code || !nom || !prenom) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà
    const existing = await prisma.jury.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ce code existe déjà' },
        { status: 409 }
      );
    }

    const newJury = await prisma.jury.create({
      data: {
        code,
        nom,
        prenom,
        date_Naissance: dateNaissance ? new Date(dateNaissance) : null,
        telephone,
        nationalite: nationalite,
      },
    });

    return NextResponse.json({ success: true, data: newJury }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

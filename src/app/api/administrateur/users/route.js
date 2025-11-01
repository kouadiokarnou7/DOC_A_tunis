import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null, // Ne pas inclure les utilisateurs supprimés
      },
      select: {
        id: true,
        nomComplet: true,
        email: true,
        role: true,
        statut: true,
        code: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Normaliser les données pour le frontend
    const normalizedUsers = users.map((user) => ({
      id: user.id,
      name: user.nomComplet,
      email: user.email,
      role: user.role,
      status: user.statut === 'actif' ? 'Actif' : 'Inactif',
      code: user.code,
    }));

    return NextResponse.json({ success: true, users: normalizedUsers }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', users: [] },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { id } from 'date-fns/locale';

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

// --- SUPPRESSION (soft delete) ---
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Paramètre 'id' manquant" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Soft delete : on met juste deletedAt
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// --- MISE À JOUR ---
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, ...updatedData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Paramètre 'id' manquant" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour les champs passés dans updatedData
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
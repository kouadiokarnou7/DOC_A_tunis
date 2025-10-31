import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email;
    const motDePasseBrut = body.motDePasse ?? body.password;

    if (!email || !motDePasseBrut) {
      return NextResponse.json({ success: false, message: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Identifiants invalides' }, { status: 401 });
    }

    const ok = await bcrypt.compare(motDePasseBrut, user.motDePasse);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Identifiants invalides' }, { status: 401 });
    }

    const publicUser = {
      id: user.id,
      nomComplet: user.nomComplet,
      email: user.email,
      role: user.role,
      statut: user.statut,
    };

    const res = NextResponse.json({ success: true, user: publicUser }, { status: 200 });
    // simple cookie-based session (not secure for production without signing/JWT)
    res.cookies.set('sessionUser', JSON.stringify(publicUser), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      // session cookie; optionally set maxAge
    });
    return res;
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}



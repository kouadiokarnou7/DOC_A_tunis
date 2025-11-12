import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    // Accepter name/password depuis le front et mapper vers nomComplet/motDePasse
    const nomComplet = body.nomComplet ?? body.name;
    const email = body.email;
    const role = body.role;
    const motDePasseBrut = body.motDePasse ?? body.password;

    if (!nomComplet || !email || !motDePasseBrut) {
      return NextResponse.json(
        { success: false, message: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Verifier l'existence
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email déjà utilisé" },
        { status: 400 }
      );
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(motDePasseBrut, 10);

    // Normalisation simple du rôle (facultatif, laisser passer la valeur si fournie)
    const roleValue = role || "UTILISATEUR";

    const created = await prisma.user.create({
      data: {
        //on doit générer le code de l'utilisateur
        //code: crypto.randomBytes(5).toString('hex'),
        nomComplet,
        email,
        motDePasse: hash,
        role: "UTILISATEUR",
        statut: "actif",
      },
      select: {
        id: true,
        nomComplet: true,
        email: true,

        role: true,
        statut: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: created }, { status: 201 });
  } catch (error) {
    console.error("Erreur ajout utilisateur:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// GET - récupérer tous les films
export async function GET() {
  try {
    const films = await prisma.film.findMany({
      include: {
        realisateur: true,
        producteur: true,
      },
    });
    return NextResponse.json({ success: true, data: films });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - créer un nouveau film (avec image)
export async function POST(request) {
  try {
    const formData = await request.formData();

    const codeFilm = formData.get("codeFilm");
    const titre = formData.get("titre");
    const dateFilm = formData.get("dateFilm");
    const sujet = formData.get("sujet");
    const codeRealisateur = formData.get("codeRealisateur");
    const codeProducteur = formData.get("codeProducteur");
    const image = formData.get("image");

    if (!codeFilm || !titre || !dateFilm || !codeRealisateur || !codeProducteur) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Vérifier si le film existe déjà
    const existing = await prisma.film.findUnique({ where: { codeFilm } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ce code de film existe déjà" },
        { status: 409 }
      );
    }

    // Gestion du fichier image
    let imageUrl = null;
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}_${image.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // Création du film
    const film = await prisma.film.create({
      data: {
        codeFilm,
        titre,
        dateFilm: new Date(dateFilm),
        sujet,
        image: imageUrl, // champ image à ajouter dans ton modèle Prisma
        realisateur: { connect: { code: codeRealisateur } },
        producteur: { connect: { code: codeProducteur } },
      },
      include: {
        realisateur: true,
        producteur: true,
      },
    });

    return NextResponse.json({ success: true, data: film }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  
}

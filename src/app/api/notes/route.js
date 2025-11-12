// stockage en mémoire de secours (dev / si Prisma indisponible)
let notesStore = [];

// helper pour obtenir dynamic Prisma (ou null si indisponible)
let _prismaClient = null;
async function getPrisma() {
	// renvoie le client déjà instancié si présent
	if (_prismaClient) return _prismaClient;
	try {
		const mod = await import("@prisma/client");
		const PrismaClient = mod?.PrismaClient;
		if (!PrismaClient) return null;
		const prisma = global.__prisma_client__ || new PrismaClient();
		if (process.env.NODE_ENV !== "production") global.__prisma_client__ = prisma;
		_prismaClient = prisma;
		return prisma;
	} catch (e) {
		// Prisma non disponible / non généré -> fallback
		console.warn("Prisma non disponible, utilisation du store en mémoire.", e?.message);
		_prismaClient = null;
		return null;
	}
}

export async function GET() {
	try {
		const prisma = await getPrisma();
		if (prisma) {
			const notes = await prisma.note.findMany();
			return new Response(JSON.stringify({ data: notes }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
		// fallback mémoire
		return new Response(JSON.stringify({ data: notesStore }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err) {
		console.error("GET /api/notes error", err);
		return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
	}
}

export async function POST(request) {
	try {
		const body = await request.json();
		const { filmCode, juryCode, note } = body ?? {};

		// validation basique
		if (!filmCode || !juryCode || typeof note !== "number") {
			return new Response(JSON.stringify({ error: "Données invalides" }), { status: 400 });
		}

		const prisma = await getPrisma();
		if (!prisma) {
			// fallback mémoire: mise à jour si existant sinon création
			const idx = notesStore.findIndex(n => n.filmCode === filmCode && n.juryCode === juryCode);
			if (idx !== -1) {
				notesStore[idx] = { ...notesStore[idx], note };
				return new Response(JSON.stringify({ success: true, data: notesStore[idx] }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
			const entry = { filmCode, juryCode, note };
			notesStore.push(entry);
			return new Response(JSON.stringify({ success: true, data: entry }), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Avec Prisma : vérifier existence film/jury pour éviter FK error
		const film = await prisma.film.findUnique({ where: { codeFilm } });
		if (!film) return new Response(JSON.stringify({ error: "Film introuvable" }), { status: 400 });

		const jury = await prisma.jury.findUnique({ where: { codeJury } });
		if (!jury) return new Response(JSON.stringify({ error: "Jury introuvable" }), { status: 400 });

		// Essayer upsert via clé composite (si définie dans schema)
		try {
			const upsertResult = await prisma.note.upsert({
				where: { filmCode_juryCode: { filmCode, juryCode } }, // adapter si votre nom diffère
				create: { filmCode, juryCode, note },
				update: { note },
			});
			return new Response(JSON.stringify({ success: true, data: upsertResult }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} catch (upsertErr) {
			// fallback si la contrainte composite n'existe pas ou erreur Prisma de type P*
			if (upsertErr && typeof upsertErr.code === "string") {
				const existing = await prisma.note.findFirst({ where: { filmCode, juryCode } });
				let result;
				if (existing) {
					// si votre modèle Note n'a pas d'id, adaptez where en clé composite
					result = await prisma.note.update({ where: { id: existing.id }, data: { note } });
					return new Response(JSON.stringify({ success: true, data: result }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} else {
					result = await prisma.note.create({ data: { filmCode, juryCode, note } });
					return new Response(JSON.stringify({ success: true, data: result }), {
						status: 201,
						headers: { "Content-Type": "application/json" },
					});
				}
			}
			throw upsertErr;
		}
	} catch (err) {
		// Gestion spécifique Prisma pour violation de FK (P2003)
		if (err?.code === "P2003") {
			console.warn("POST /api/notes FK violation", err);
			return new Response(JSON.stringify({ error: "Clé étrangère invalide (film ou jury manquant)" }), { status: 400 });
		}
		console.error("POST /api/notes: erreur interne", err);
		return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
	}
}

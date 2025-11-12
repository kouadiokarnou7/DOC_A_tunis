"use client"; // obligatoire pour Next.js 13+ App Router si c'est un composant client

import { useState, useEffect } from "react";

export default function Page() {
  const [films, setFilms] = useState([]);
  const [jurys, setJurys] = useState([]);
  // --- NOUVEAU: notes et états UI
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const [filmCode, setFilmCode] = useState("");
  const [juryCode, setJuryCode] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [resFilms, resJurys, resNotes] = await Promise.all([
          fetch("/api/films"),
          fetch("/api/jurys"),
          fetch("/api/notes"),
        ]);

        if (!resFilms.ok) throw new Error(`Erreur films: ${resFilms.status}`);
        if (!resJurys.ok) throw new Error(`Erreur jurys: ${resJurys.status}`);
        // notes endpoint peut renvoyer 200 avec { data: [] } ou 500 — gérer en conséquence
        const filmsData = await resFilms.json();
        const jurysData = await resJurys.json();
        const notesData = resNotes.ok ? await resNotes.json() : { data: [] };

        setFilms(filmsData.data || filmsData);
        setJurys(jurysData.data || jurysData);
        setNotes(notesData.data || notesData || []);

        setFilmCode((filmsData.data || filmsData)[0]?.codeFilm || "");
        setJuryCode((jurysData.data || jurysData)[0]?.codeJury || "");
      } catch (err) {
        setError(err?.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- NOUVEAU: validation/clamp côté client
  const clampNote = n => Math.max(0, Math.min(20, n));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    const parsed = parseFloat(note);
    if (!filmCode || !juryCode || isNaN(parsed)) {
      return setServerMsg("Veuillez remplir tous les champs correctement.");
    }
    const clamped = clampNote(parsed);

    setSubmitting(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmCode, juryCode, note: clamped }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        setServerMsg(payload?.error || "Erreur serveur lors de l'enregistrement");
        return;
      }

      const newNote = payload?.data ?? { filmCode, juryCode, note: clamped };

      setNotes(prev => {
        const idx = prev.findIndex(n => n.filmCode === filmCode && n.juryCode === juryCode);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], note: newNote.note };
          return next;
        }
        return [...prev, newNote];
      });

      setNote("");
      setServerMsg("Note enregistrée !");
    } catch (err) {
      console.error(err);
      setServerMsg("Erreur lors de l'enregistrement de la note");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600 font-bold">Erreur: {error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Films et Jurys</h1>

      {/* ...existing code for film & jury selects ... */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Film</label>
        <select
          value={filmCode}
          onChange={e => setFilmCode(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          {films.map(f => (
            <option key={f.codeFilm} value={f.codeFilm}>
              {f.titre || f.name || f.title || f.codeFilm}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Jury</label>
        <select
          value={juryCode}
          onChange={e => setJuryCode(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          {jurys.map(j => (
            <option key={j.codeJury} value={j.codeJury}>
              {j.prenom} {j.nom}
            </option>
          ))}
        </select>
      </div>

      {/* --- NOUVEAU: formulaire note */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 border p-4 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Note (0 - 20)</label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.1"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full border rounded px-2 py-1"
            disabled={submitting}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Enregistrement..." : "Enregistrer la note"}
          </button>
          {serverMsg && <span className="text-sm text-gray-700">{serverMsg}</span>}
        </div>
      </form>

      {/* --- NOUVEAU: liste des notes */}
      <div className="border rounded shadow p-4">
        <h2 className="font-bold mb-2">Notes enregistrées</h2>
        {notes.length === 0 ? (
          <p>Aucune note enregistrée</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Film</th>
                <th className="border p-2 text-left">Jury</th>
                <th className="border p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(n => {
                const film = films.find(f => f.codeFilm === n.filmCode);
                const jury = jurys.find(j => j.codeJury === n.juryCode);
                const key = `${n.filmCode}-${n.juryCode}`;
                return (
                  <tr key={key} className="odd:bg-white even:bg-gray-50">
                    <td className="border p-2">{film?.titre || film?.name || n.filmCode}</td>
                    <td className="border p-2">{jury ? `${jury.prenom} ${jury.nom}` : n.juryCode}</td>
                    <td className="border p-2">{n.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

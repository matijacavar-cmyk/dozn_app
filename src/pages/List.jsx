import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../db";
import Button from "../components/Button";
import GhostButton from "../components/GhostButton";
import Toolbar from "../components/Toolbar";
import { exportSveDoznakeExcel, exportDoznakaExcel } from "../excel";

export default function List() {
  const [q, setQ] = useState("");
  const [doznake, setDoznake] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    db.doznake
      .orderBy("createdAt")
      .reverse()
      .toArray()
      .then(setDoznake);
  }, []);

  const filtrirane = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return doznake;
    return doznake.filter((d) =>
      [d.dkBroj, d.klasa, d.podnositelj, d.kreirao, d.gj, d.odj_ods, d.zupanija, d.ko, d.savjetnik, d.brojRacuna]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [q, doznake]);

  async function deleteDoznaka(id) {
    if (!confirm("Obrisati doznaku i sva njena stabla?")) return;
    await db.transaction("rw", db.doznake, db.stabla, async () => {
      await db.stabla.where({ doznakaId: id }).delete();
      await db.doznake.delete(id);
    });
    const refreshed = await db.doznake.orderBy("createdAt").reverse().toArray();
    setDoznake(refreshed);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Doznake</h1>
        <Toolbar>
          <GhostButton onClick={() => exportSveDoznakeExcel()}>Izvoz svih (Excel)</GhostButton>
          <GhostButton onClick={() => alert("Odjava – demo. Autentikaciju dodajemo kasnije.")}>Logout</GhostButton>
          <Button onClick={() => nav("/nova")}>+ Nova doznaka</Button>
        </Toolbar>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraži DK broj, klasu, podnositelja, ..."
          className="w-full px-3 py-2 rounded-2xl border border-gray-300"
        />
      </div>

      <div className="grid gap-3">
        {filtrirane.map((d) => (
          <div key={d.id} className="bg-white border rounded-2xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="font-semibold">{d.dkBroj}</div>
              <div className="text-sm text-gray-600">
                {d.podnositelj ? `${d.podnositelj} • ` : ""}
                {d.klasa || "Bez klase"} • {d.datum}
              </div>
            </div>
            <div className="flex gap-2">
              <GhostButton onClick={() => nav(`/pregled/${d.id}`)}>Pregled / Dodaj stabla</GhostButton>
              <GhostButton onClick={() => nav(`/uredi/${d.id}`)}>Uredi</GhostButton>
              <Button className="bg-red-600" onClick={() => deleteDoznaka(d.id)}>Obriši</Button>
              <GhostButton onClick={() => exportDoznakaExcel(d.id)}>Excel</GhostButton>
            </div>
          </div>
        ))}

        {!filtrirane.length && (
          <div className="text-center text-gray-500 py-12">Nema doznaka. Klikni „Nova doznaka”.</div>
        )}
      </div>
    </div>
  );
}
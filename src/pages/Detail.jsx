import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, STATUSI, toCurrency } from "../db";
import Button from "../components/Button";
import GhostButton from "../components/GhostButton";
import LabeledInput from "../components/LabeledInput";
import Toolbar from "../components/Toolbar";
import { exportDoznakaExcel } from "../excel";

export default function Detail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);
  const [list, setList] = useState([]);
  const [novo, setNovo] = useState({ vrsta: "", debljinski: "", status: STATUSI[0] });

  useEffect(() => {
    db.doznake.get(id).then(setD);
    db.stabla.where({ doznakaId: id }).toArray().then(setList);
  }, [id]);

  async function addStablo() {
    if (!novo.vrsta || !novo.debljinski) { alert("Vrsta i debljinski stupanj su obavezni."); return; }
    const rec = { id: crypto.randomUUID(), doznakaId: id, vrsta: novo.vrsta, debljinski: Number(novo.debljinski), status: novo.status };
    await db.stabla.add(rec);
    setList(await db.stabla.where({ doznakaId: id }).toArray());
    setNovo({ vrsta: "", debljinski: "", status: STATUSI[0] });
  }

  async function removeStablo(sid) {
    await db.stabla.delete(sid);
    setList(await db.stabla.where({ doznakaId: id }).toArray());
  }

  if (!d) return <div className="p-6">Učitavanje...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{d.dkBroj} — Kratki pregled</h1>
        <Toolbar>
          <GhostButton onClick={() => nav(`/uredi/${d.id}`)}>Uredi doznaku</GhostButton>
          <GhostButton onClick={() => exportDoznakaExcel(d.id)}>Excel</GhostButton>
          <GhostButton onClick={() => nav(-1)}>Natrag</GhostButton>
        </Toolbar>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border shadow md:col-span-2">
          <h2 className="font-semibold mb-2">Podaci</h2>
          <div className="text-sm grid md:grid-cols-2 gap-x-6 gap-y-1">
            <div><b>Klasa:</b> {d.klasa || "—"}</div>
            <div><b>Podnositelj:</b> {d.podnositelj || "—"}</div>
            <div><b>Kreirao:</b> {d.kreirao || "—"}</div>
            <div><b>Datum:</b> {d.datum || "—"}</div>
            <div><b>GJ:</b> {d.gj || "—"}</div>
            <div><b>ODJ/ODS:</b> {d.odj_ods || "—"}</div>
            <div><b>Županija:</b> {d.zupanija || "—"}</div>
            <div><b>K.O.:</b> {d.ko || "—"}</div>
            <div><b>Savjetnik:</b> {d.savjetnik || "—"}</div>
            <div><b>Volumen:</b> {d.volumen ? `${d.volumen} m³` : "—"}</div>
            <div><b>Jed. cijena:</b> {d.jedinicnaCijena ? toCurrency(d.jedinicnaCijena) : "—"}</div>
            <div><b>Iznos:</b> {d.iznos ? toCurrency(d.iznos) : "—"}</div>
            <div><b>Račun izdan:</b> {d.racunIzdan ? "DA" : "NE"}</div>
            <div><b>Naplaćeno:</b> {d.naplaceno ? "DA" : "NE"}</div>
            <div><b>Br. računa:</b> {d.brojRacuna || "—"}</div>
            <div className="md:col-span-2"><b>Napomena:</b> {d.napomena || "—"}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow">
          <h2 className="font-semibold mb-2">Dodaj stablo</h2>
          <div className="grid gap-2">
            <LabeledInput label="Vrsta"><input className="border rounded-2xl px-3 py-2 w-full" value={novo.vrsta} onChange={(e) => setNovo({ ...novo, vrsta: e.target.value })} /></LabeledInput>
            <LabeledInput label="Debljinski stupanj (1–20)"><input type="number" min={1} max={20} className="border rounded-2xl px-3 py-2 w-full" value={novo.debljinski} onChange={(e) => setNovo({ ...novo, debljinski: e.target.value })} /></LabeledInput>
            <LabeledInput label="Status">
              <select className="border rounded-2xl px-3 py-2 w-full" value={novo.status} onChange={(e) => setNovo({ ...novo, status: e.target.value })}>
                {STATUSI.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </LabeledInput>
            <Button onClick={addStablo}>+ Dodaj</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border shadow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Stabla ({list.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 pr-2">Vrsta</th>
                <th className="py-2 pr-2">Debljinski</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, idx) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2 pr-2">{idx + 1}</td>
                  <td className="py-2 pr-2">{s.vrsta}</td>
                  <td className="py-2 pr-2">{s.debljinski}</td>
                  <td className="py-2 pr-2">{s.status}</td>
                  <td className="py-2 pr-2 text-right">
                    <Button className="bg-red-600" onClick={() => removeStablo(s.id)}>Obriši</Button>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr>
                  <td className="py-6 text-center text-gray-500" colSpan={5}>Nema stabala. Dodaj prvo stablo s desne strane.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
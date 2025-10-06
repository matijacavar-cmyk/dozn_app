import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, toCurrency } from "../db";
import Button from "../components/Button";
import GhostButton from "../components/GhostButton";
import Section from "../components/Section";
import LabeledInput from "../components/LabeledInput";
import Toolbar from "../components/Toolbar";

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState(null);

  useEffect(() => { db.doznake.get(id).then(setD); }, [id]);
  if (!d) return <div className="p-6">Učitavanje...</div>;

  function upd(p) { setD((prev) => ({ ...prev, ...p })); }
  async function save() {
    const now = new Date().toISOString();
    await db.doznake.update(id, { ...d, updatedAt: now });
    nav(-1);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uredi doznaku — {d.dkBroj}</h1>
        <Toolbar>
          <GhostButton onClick={() => nav(-1)}>Natrag</GhostButton>
          <Button onClick={save}>Spremi</Button>
        </Toolbar>
      </div>

      <Section title="2. Podaci o lokaciji">
        <LabeledInput label="GJ"><input className="border rounded-2xl px-3 py-2" value={d.gj || ""} onChange={(e) => upd({ gj: e.target.value })} /></LabeledInput>
        <LabeledInput label="ODJ/ODS"><input className="border rounded-2xl px-3 py-2" value={d.odj_ods || ""} onChange={(e) => upd({ odj_ods: e.target.value })} /></LabeledInput>
        <LabeledInput label="Županija"><input className="border rounded-2xl px-3 py-2" value={d.zupanija || ""} onChange={(e) => upd({ zupanija: e.target.value })} /></LabeledInput>
        <LabeledInput label="K.O."><input className="border rounded-2xl px-3 py-2" value={d.ko || ""} onChange={(e) => upd({ ko: e.target.value })} /></LabeledInput>
        <LabeledInput label="Savjetnik"><input className="border rounded-2xl px-3 py-2" value={d.savjetnik || ""} onChange={(e) => upd({ savjetnik: e.target.value })} /></LabeledInput>
      </Section>

      <Section title="3. Računovodstveni podaci">
        <LabeledInput label="Volumen (m³)"><input className="border rounded-2xl px-3 py-2" value={d.volumen ?? ""} onChange={(e) => upd({ volumen: e.target.value })} /></LabeledInput>
        <LabeledInput label="Jedinična cijena (EUR/m³)"><input className="border rounded-2xl px-3 py-2" value={d.jedinicnaCijena ?? ""} onChange={(e) => upd({ jedinicnaCijena: e.target.value })} /></LabeledInput>
        <LabeledInput label="Iznos (EUR)"><input className="border rounded-2xl px-3 py-2" value={d.iznos ?? ""} onChange={(e) => upd({ iznos: e.target.value })} /></LabeledInput>
        <LabeledInput label="Računa za?"><input className="border rounded-2xl px-3 py-2" value={d.racunaZa || ""} onChange={(e) => upd({ racunaZa: e.target.value })} /></LabeledInput>
        <LabeledInput label="Platitelj"><input className="border rounded-2xl px-3 py-2" value={d.platitelj || ""} onChange={(e) => upd({ platitelj: e.target.value })} /></LabeledInput>
        <LabeledInput label="Račun izdan"><input type="checkbox" className="w-5 h-5" checked={!!d.racunIzdan} onChange={(e) => upd({ racunIzdan: e.target.checked })} /></LabeledInput>
        <LabeledInput label="Naplaćeno"><input type="checkbox" className="w-5 h-5" checked={!!d.naplaceno} onChange={(e) => upd({ naplaceno: e.target.checked })} /></LabeledInput>
        <LabeledInput label="Br. računa"><input className="border rounded-2xl px-3 py-2" value={d.brojRacuna || ""} onChange={(e) => upd({ brojRacuna: e.target.value })} /></LabeledInput>
      </Section>

      <Section title="4. Ostalo">
        <LabeledInput label="Napomena"><textarea className="border rounded-2xl px-3 py-2 min-h-[100px]" value={d.napomena || ""} onChange={(e) => upd({ napomena: e.target.value })} /></LabeledInput>
      </Section>
    </div>
  );
}
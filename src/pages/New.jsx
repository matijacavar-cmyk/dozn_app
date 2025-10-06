import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { db, generateDkBroj, todayISO } from "../db";
import Button from "../components/Button";
import GhostButton from "../components/GhostButton";
import Section from "../components/Section";
import LabeledInput from "../components/LabeledInput";
import Toolbar from "../components/Toolbar";

export default function New() {
  const nav = useNavigate();
  const [frm, setFrm] = useState({
    dkBroj: generateDkBroj(),
    klasa: "",
    podnositelj: "",
    kreirao: "",
    datum: todayISO(),
  });

  async function save() {
    const id = uuidv4();
    const now = new Date().toISOString();
    await db.doznake.add({ id, ...frm, createdAt: now, updatedAt: now });
    nav(`/pregled/${id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova doznaka</h1>
        <Toolbar>
          <GhostButton onClick={() => nav(-1)}>Odustani</GhostButton>
          <Button onClick={save}>Spremi</Button>
        </Toolbar>
      </div>

      <Section title="Osnovni podaci">
        <LabeledInput label="DK broj (automatski, može se kasnije urediti)">
          <input value={frm.dkBroj} onChange={(e) => setFrm({ ...frm, dkBroj: e.target.value })} className="px-3 py-2 rounded-2xl border" />
        </LabeledInput>
        <LabeledInput label="Klasa zahtjeva">
          <input value={frm.klasa} onChange={(e) => setFrm({ ...frm, klasa: e.target.value })} className="px-3 py-2 rounded-2xl border" />
        </LabeledInput>
        <LabeledInput label="Podnositelj zahtjeva">
          <input value={frm.podnositelj} onChange={(e) => setFrm({ ...frm, podnositelj: e.target.value })} className="px-3 py-2 rounded-2xl border" />
        </LabeledInput>
        <LabeledInput label="Doznaku kreirao (ime i prezime)">
          <input value={frm.kreirao} onChange={(e) => setFrm({ ...frm, kreirao: e.target.value })} className="px-3 py-2 rounded-2xl border" />
        </LabeledInput>
        <LabeledInput label="Datum">
          <input type="date" value={frm.datum} onChange={(e) => setFrm({ ...frm, datum: e.target.value })} className="px-3 py-2 rounded-2xl border" />
        </LabeledInput>
      </Section>
    </div>
  );
}
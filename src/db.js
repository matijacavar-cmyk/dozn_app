import Dexie from "dexie";

class DoznakaDB extends Dexie {
  doznake;
  stabla;
  constructor() {
    super("doznaka-db");
    this.version(1).stores({
      doznake:
        "id, dkBroj, klasa, podnositelj, kreirao, datum, gj, odj_ods, zupanija, ko, savjetnik, volumen, jedinicnaCijena, iznos, racunaZa, platitelj, racunIzdan, naplaceno, brojRacuna, napomena, createdAt, updatedAt",
      stabla: "id, doznakaId, vrsta, debljinski, status",
    });
    this.doznake = this.table("doznake");
    this.stabla = this.table("stabla");
  }
}
export const db = new DoznakaDB();

export const STATUSI = [
  "Živo",
  "Sušac",
  "Vjetrolom",
  "Vjetroizvala",
  "Snjegolom",
  "Krađa",
  "Drugo",
];

export const todayISO = () => new Date().toISOString().slice(0, 10);
export function generateDkBroj() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
  return `DK-${stamp}`;
}
export function toCurrency(n) {
  if (n === undefined || n === null || n === "") return "";
  const val = Number(n);
  if (isNaN(val)) return String(n);
  return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(val);
}

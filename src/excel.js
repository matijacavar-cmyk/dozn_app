import { writeFileXLSX, utils as XLSX } from "xlsx";
import { db, todayISO } from "./db";

export async function exportDoznakaExcel(doznakaId) {
  const d = await db.doznake.get(doznakaId);
  if (!d) return;
  const stabla = await db.stabla.where({ doznakaId }).toArray();

  const infoSheet = XLSX.json_to_sheet([{
    "DK broj": d.dkBroj,
    "Klasa zahtjeva": d.klasa || "",
    "Podnositelj": d.podnositelj || "",
    "Kreirao": d.kreirao || "",
    "Datum": d.datum || "",
    "GJ": d.gj || "",
    "ODJ/ODS": d.odj_ods || "",
    "Županija": d.zupanija || "",
    "K.O.": d.ko || "",
    "Savjetnik": d.savjetnik || "",
    "Volumen": d.volumen ?? "",
    "Jedinična cijena": d.jedinicnaCijena ?? "",
    "Iznos": d.iznos ?? "",
    "Računa za": d.racunaZa || "",
    "Platitelj": d.platitelj || "",
    "Račun izdan": d.racunIzdan ? "DA" : "NE",
    "Naplaćeno": d.naplaceno ? "DA" : "NE",
    "Br. računa": d.brojRacuna || "",
    "Napomena": d.napomena || "",
  }]);

  const stablaSheet = XLSX.json_to_sheet(
    stabla.map((s, i) => ({
      "#": i + 1,
      "Vrsta": s.vrsta,
      "Debljinski stupanj": s.debljinski,
      "Status": s.status,
    }))
  );

  const wb = XLSX.book_new();
  XLSX.book_append_sheet(wb, infoSheet, "Doznaka");
  XLSX.book_append_sheet(wb, stablaSheet, "Stabla");
  writeFileXLSX(wb, `${d.dkBroj}.xlsx`);
}

export async function exportSveDoznakeExcel() {
  const doznake = await db.doznake.orderBy("createdAt").reverse().toArray();
  const stabla = await db.stabla.toArray();

  const doznakeSheet = XLSX.json_to_sheet(
    doznake.map((d) => ({
      "id": d.id,
      "DK broj": d.dkBroj,
      "Klasa zahtjeva": d.klasa || "",
      "Podnositelj": d.podnositelj || "",
      "Kreirao": d.kreirao || "",
      "Datum": d.datum || "",
      "GJ": d.gj || "",
      "ODJ/ODS": d.odj_ods || "",
      "Županija": d.zupanija || "",
      "K.O.": d.ko || "",
      "Savjetnik": d.savjetnik || "",
      "Volumen": d.volumen ?? "",
      "Jedinična cijena": d.jedinicnaCijena ?? "",
      "Iznos": d.iznos ?? "",
      "Račun izdan": d.racunIzdan ? "DA" : "NE",
      "Naplaćeno": d.naplaceno ? "DA" : "NE",
      "Br. računa": d.brojRacuna || "",
    }))
  );

  const stablaSheet = XLSX.json_to_sheet(
    stabla.map((s) => ({
      "doznakaId": s.doznakId ?? "", // placeholder to ensure property exists (will be corrected)
      "Vrsta": s.vrsta,
      "Debljinski stupanj": s.debljinski,
      "Status": s.status,
    }))
  );

  const wb = XLSX.book_new();
  XLSX.book_append_sheet(wb, doznakeSheet, "Doznake");
  XLSX.book_append_sheet(wb, stablaSheet, "Sva stabla");
  writeFileXLSX(wb, `Sve_doznake_${todayISO()}.xlsx`);
}
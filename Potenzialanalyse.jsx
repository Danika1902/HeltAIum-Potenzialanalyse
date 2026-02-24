import { useState, useEffect, useRef } from "react";

// ⚡ HIER DEINEN N8N WEBHOOK EINTRAGEN:
const WEBHOOK_URL = "https://n8n.srv1249219.hstgr.cloud/webhook/c4c76f9a-5c37-4401-a0bd-6ac9536b8216";

const T = {
  de: {
    steps: [
      { id: "intro", label: "Start" },
      { id: "contact", label: "Über dich" },
      { id: "pain", label: "Schmerzpunkte" },
      { id: "processes", label: "Prozesse" },
      { id: "tools", label: "Software" },
      { id: "vision", label: "Vision" },
      { id: "result", label: "Ergebnis" },
    ],
    painPoints: [
      { id: "slow_followup", icon: "🔥", label: "Verbranntes Geld", desc: "Wir verlieren Leads, weil wir zu langsam im Follow-up sind.", savingsHoursWeek: 4, savingsEuroMonth: 800 },
      { id: "copy_paste", icon: "🐒", label: "Affenarbeit", desc: "Stunden pro Woche gehen für stupide Copy & Paste-Aufgaben drauf.", savingsHoursWeek: 6, savingsEuroMonth: 600 },
      { id: "data_chaos", icon: "💾", label: "Daten-Chaos", desc: "Kundendaten liegen in mehreren Tools – niemand kennt den aktuellen Stand.", savingsHoursWeek: 3, savingsEuroMonth: 400 },
      { id: "expensive_agencies", icon: "💸", label: "Teure Dienstleister", desc: "Wir bezahlen Agenturen für Aufgaben, die KI günstiger erledigen könnte.", savingsHoursWeek: 2, savingsEuroMonth: 1500 },
      { id: "bottleneck", icon: "🚧", label: "Der Flaschenhals bin ich", desc: "Ohne mich bricht das operative Geschäft zusammen.", savingsHoursWeek: 5, savingsEuroMonth: 500 },
      { id: "scaling", icon: "📈", label: "Wachstumsbremse", desc: "Bei doppelt so vielen Kunden bricht unser System zusammen.", savingsHoursWeek: 4, savingsEuroMonth: 700 },
    ],
    processQuestions: [
      { id: "lead_source", question: "Wie kommen neue Anfragen zu euch?", placeholder: "z.B. Website-Formular, Social Media, Kaltakquise, Empfehlungen..." },
      { id: "after_sale", question: "Was passiert nach dem Kauf?", placeholder: "Beschreibe jeden manuellen Schritt: Verträge, Rechnungen, Onboarding, E-Mails..." },
      { id: "manual_transfer", question: "Welche Daten übertragt ihr täglich händisch zwischen Programmen?", placeholder: "z.B. CRM → Excel, E-Mail → Projektmanagement-Tool, Formulardaten → CRM..." },
      { id: "outsourced", question: "Welche Aufgaben sind an externe Dienstleister outgesourct?", placeholder: "z.B. Newsletter (500€/Monat), Social Media (800€/Monat), Datenpflege..." },
    ],
    toolCategories: [
      { id: "crm", label: "CRM / Vertrieb", placeholder: "z.B. HubSpot, Pipedrive, Salesforce" },
      { id: "pm", label: "Projektmanagement", placeholder: "z.B. Asana, ClickUp, Trello, Monday" },
      { id: "email", label: "E-Mail-Marketing", placeholder: "z.B. ActiveCampaign, Mailchimp, Brevo" },
      { id: "accounting", label: "Buchhaltung", placeholder: "z.B. Lexoffice, SevDesk, DATEV" },
      { id: "payment", label: "Zahlungsanbieter", placeholder: "z.B. Stripe, PayPal, Mollie" },
      { id: "booking", label: "Terminbuchung", placeholder: "z.B. Calendly, Cal.com, Acuity" },
      { id: "website", label: "Website / Shop", placeholder: "z.B. WordPress, Shopify, Webflow" },
      { id: "communication", label: "Kommunikation", placeholder: "z.B. Slack, Teams, WhatsApp Business" },
    ],
    visionOptions: [
      { id: "ease", icon: "☀️", label: "Leichtigkeit", desc: "Morgens aufklappen – alles ist organisiert." },
      { id: "growth", icon: "🚀", label: "Grenzenloses Wachstum", desc: "Doppelt so viele Kunden, ohne ins Schwitzen zu geraten." },
      { id: "security", icon: "🛡️", label: "Ruhe & Sicherheit", desc: "Kein Lead geht verloren, keine Fehler passieren." },
      { id: "freedom", icon: "🏖️", label: "Wahre Freiheit", desc: "Das Unternehmen läuft profitabel – auch ohne dich." },
    ],
    employeeOptions: ["Solo / Freelancer", "2–5 Mitarbeiter", "6–15 Mitarbeiter", "16–50 Mitarbeiter", "Über 50 Mitarbeiter"],
    budgetOptions: [
      { label: "Unter 1.000 €", tag: "Notfall-Pflaster" },
      { label: "1.000 – 3.000 €", tag: "Engpässe eliminieren" },
      { label: "3.000 – 5.000 €", tag: "Große Prozessketten" },
      { label: "Über 5.000 €", tag: "System-Transformation" },
    ],
    ui: {
      freeAnalysis: "Kostenlose Potenzialanalyse",
      heroTitle1: "Finde heraus, wo dein",
      heroTitle2: "Unternehmen",
      heroHighlight: "Zeit & Geld",
      heroTitle3: "verbrennt",
      heroSubtitle: "In nur 5 Minuten zeigen wir dir glasklar auf, wie viel Einsparpotenzial in deinen aktuellen Prozessen schlummert – und wie KI-Automatisierung dein Business transformieren kann.",
      startBtn: "Analyse starten →",
      badge1: "5 Min.", badge2: "Vertraulich", badge3: "Individuell",
      contactTitle: "Erzähl uns von dir",
      contactSubtitle: "Damit wir deine Analyse personalisieren und dir im Erstgespräch direkt Lösungen präsentieren können.",
      firstName: "Vorname *", lastName: "Nachname *", company: "Unternehmen *", role: "Rolle / Position",
      emailLabel: "E-Mail *", phone: "Telefon *", website: "Webseite", teamSize: "Teamgröße",
      selectPlaceholder: "Bitte wählen",
      painTitle: "Wo blutet dein Unternehmen?",
      painSubtitle: "Sei ehrlich zu dir selbst – Mehrfachauswahl erwünscht. Je genauer, desto besser können wir helfen.",
      manualHoursLabel: "Wie viele Stunden pro Woche verbringt dein Team mit manuellen Aufgaben?",
      mainPainLabel: "Dein absoluter Schmerzpunkt – welche EINE Aufgabe würdest du sofort loswerden?",
      mainPainPlaceholder: "Die eine Sache, die dich jeden Tag aufs Neue nervt...",
      processTitle: "Deine aktuellen Abläufe",
      processSubtitle: "Hilf uns, die genauen Stellen zu identifizieren, an denen Automatisierung den größten Hebel hat.",
      toolsTitle: "Eure Software-Landschaft",
      toolsSubtitle: "Damit wir wissen, welche Systeme wir per API verbinden und automatisieren können.",
      visionTitle: "Deine Vision",
      visionSubtitle: "Lass uns den Schmerz beiseitelegen. Stell dir vor, alle nervigen Flaschenhälse sind eliminiert.",
      visionFeelLabel: "Wie soll sich dein Business in 6 Monaten anfühlen?",
      timeGoalLabel: "Was machst du mit 15–20 freien Stunden pro Woche?",
      timeGoalPlaceholder: "z.B. Umsatz verdoppeln, Mehr Zeit mit der Familie, Endlich 3 Wochen Urlaub",
      bizGoalLabel: "Dein ultimatives Ziel für die nächsten 12–24 Monate?",
      bizGoalPlaceholder: "z.B. Umsatz auf X€ skalieren, mehr Freiheit, Team aufbauen...",
      budgetLabel: "Welches Budget hast du reserviert, um diese Schmerzpunkte zu beseitigen?",
      resultTag: "Dein Ergebnis",
      resultTitle: "Dein Automatisierungs-Potenzial",
      resultSubtitlePre: "basierend",
      resultSubtitleNoPre: "Basierend",
      resultSubtitlePost: "auf deinen Angaben haben wir folgendes Einsparpotenzial ermittelt:",
      savingsWeek: "Zeitersparnis / Woche", savingsMonth: "Ersparnis / Monat",
      savingsYear: "Hochgerechnet auf 12 Monate", savingsYearSub: "potenzielle Ersparnis pro Jahr",
      savedHours: "eingesparte Arbeitsstunden", savedMoney: "monetäre Einsparung", yearSavings: "potenzielle Jahresersparnis",
      painListTitle: "Deine identifizierten Schmerzpunkte",
      ctaTitle: "Bereit, dieses Potenzial zu aktivieren?",
      ctaSubtitle: "Im kostenlosen Erstgespräch zeigen wir dir konkret, welche Automatisierungen für dein Business den größten ROI bringen.",
      savePdf: "📄 Analyse als PDF speichern", bookCall: "📞 Erstgespräch buchen",
      tagline: "AI Automation für dein Business",
      back: "← Zurück", next: "Weiter →", seeResult: "Ergebnis ansehen →",
      submitting: "⏳ Daten werden übermittelt...", submitted: "✓ Deine Analyse wurde erfolgreich übermittelt", retrying: "Übermittlung wird wiederholt...",
      pdfTitle: "Potenzialanalyse", pdfSaveBtn: "⬇️ Als PDF speichern",
      pdfPainTitle: "Identifizierte Schmerzpunkte", pdfArea: "Bereich", pdfTimeSaving: "Zeitersparnis", pdfCostSaving: "Kostenersparnis",
      pdfMainPain: "Absoluter Schmerzpunkt", pdfProcesses: "Aktuelle Prozesse & Abläufe", pdfSoftware: "Software-Landschaft",
      pdfVisionGoals: "Vision & Ziele", pdfFeeling: "GEWÜNSCHTES GEFÜHL:", pdfTimeInvest: "ZEIT-INVESTITION:",
      pdfBizGoal: "12–24 MONATS-ZIEL:", pdfBudget: "INVESTITIONSRAHMEN:",
      pdfCtaTitle: "Bereit, dieses Potenzial zu aktivieren?",
      pdfCtaSub: "Im kostenlosen Erstgespräch zeigen wir dir konkret, welche Automatisierungen für dein Business den größten ROI bringen.",
      pdfCtaBtn: "Erstgespräch buchen →",
      pdfFooter: "Diese Analyse wurde automatisch erstellt. Alle Werte sind Schätzungen basierend auf Branchendurchschnitten.",
      perWeek: "/ Woche", perMonth: "/ Monat",
      rolePlaceholder: "Geschäftsführer",
    },
  },
  hu: {
    steps: [
      { id: "intro", label: "Start" },
      { id: "contact", label: "Rólad" },
      { id: "pain", label: "Fájdalompontok" },
      { id: "processes", label: "Folyamatok" },
      { id: "tools", label: "Szoftver" },
      { id: "vision", label: "Jövőkép" },
      { id: "result", label: "Eredmény" },
    ],
    painPoints: [
      { id: "slow_followup", icon: "🔥", label: "Elégett pénz", desc: "Leadeket veszítünk, mert túl lassúak vagyunk a visszajelzésben.", savingsHoursWeek: 4, savingsEuroMonth: 800 },
      { id: "copy_paste", icon: "🐒", label: "Majommunka", desc: "Hetente órák mennek el értelmetlen copy & paste feladatokra.", savingsHoursWeek: 6, savingsEuroMonth: 600 },
      { id: "data_chaos", icon: "💾", label: "Adatkáosz", desc: "Az ügyféladatok több eszközben szétszórva – senki nem tudja, mi az aktuális.", savingsHoursWeek: 3, savingsEuroMonth: 400 },
      { id: "expensive_agencies", icon: "💸", label: "Drága szolgáltatók", desc: "Ügynökségeknek fizetünk olyan feladatokért, amiket AI olcsóbban megoldana.", savingsHoursWeek: 2, savingsEuroMonth: 1500 },
      { id: "bottleneck", icon: "🚧", label: "Én vagyok a szűk keresztmetszet", desc: "Nélkülem összeomlik az operatív működés.", savingsHoursWeek: 5, savingsEuroMonth: 500 },
      { id: "scaling", icon: "📈", label: "Növekedési fék", desc: "Ha megdupláznánk az ügyfeleinket, a rendszerünk összeomlana.", savingsHoursWeek: 4, savingsEuroMonth: 700 },
    ],
    processQuestions: [
      { id: "lead_source", question: "Hogyan érkeznek az új megkeresések?", placeholder: "pl. webes űrlap, közösségi média, hideghívás, ajánlások..." },
      { id: "after_sale", question: "Mi történik a vásárlás után?", placeholder: "Írd le minden manuális lépést: szerződések, számlák, onboarding, e-mailek..." },
      { id: "manual_transfer", question: "Milyen adatokat kell naponta kézzel átvinni egyik programból a másikba?", placeholder: "pl. CRM → Excel, E-mail → Projektmenedzsment eszköz..." },
      { id: "outsourced", question: "Milyen feladatokat adtál ki külső szolgáltatóknak?", placeholder: "pl. Hírlevél (500€/hó), Közösségi média (800€/hó), Adatkarbantartás..." },
    ],
    toolCategories: [
      { id: "crm", label: "CRM / Értékesítés", placeholder: "pl. HubSpot, Pipedrive, Salesforce" },
      { id: "pm", label: "Projektmenedzsment", placeholder: "pl. Asana, ClickUp, Trello, Monday" },
      { id: "email", label: "E-mail marketing", placeholder: "pl. ActiveCampaign, Mailchimp, Brevo" },
      { id: "accounting", label: "Könyvelés", placeholder: "pl. Billingo, szamlazz.hu, NAV Online" },
      { id: "payment", label: "Fizetési szolgáltató", placeholder: "pl. Stripe, PayPal, SimplePay, Barion" },
      { id: "booking", label: "Időpontfoglalás", placeholder: "pl. Calendly, Cal.com, Acuity" },
      { id: "website", label: "Weboldal / Webshop", placeholder: "pl. WordPress, Shopify, Webflow" },
      { id: "communication", label: "Kommunikáció", placeholder: "pl. Slack, Teams, WhatsApp Business" },
    ],
    visionOptions: [
      { id: "ease", icon: "☀️", label: "Könnyedség", desc: "Reggel kinyitom a laptopot – minden szervezett." },
      { id: "growth", icon: "🚀", label: "Határtalan növekedés", desc: "Kétszer annyi ügyfelet veszünk fel, izzadás nélkül." },
      { id: "security", icon: "🛡️", label: "Nyugalom & Biztonság", desc: "Egyetlen lead sem veszik el, nincs hiba." },
      { id: "freedom", icon: "🏖️", label: "Igazi szabadság", desc: "A vállalkozás nyereségesen működik – nélküled is." },
    ],
    employeeOptions: ["Egyéni vállalkozó", "2–5 munkatárs", "6–15 munkatárs", "16–50 munkatárs", "Több mint 50 munkatárs"],
    budgetOptions: [
      { label: "1.000 € alatt", tag: "Sürgős javítás" },
      { label: "1.000 – 3.000 €", tag: "Szűk keresztmetszetek" },
      { label: "3.000 – 5.000 €", tag: "Teljes folyamatlánc" },
      { label: "5.000 € felett", tag: "Rendszer-átalakítás" },
    ],
    ui: {
      freeAnalysis: "Ingyenes potenciálelemzés",
      heroTitle1: "Tudd meg, hol éget",
      heroTitle2: "a vállalkozásod",
      heroHighlight: "időt és pénzt",
      heroTitle3: "feleslegesen",
      heroSubtitle: "Mindössze 5 perc alatt megmutatjuk, mekkora megtakarítási potenciál rejtőzik a jelenlegi folyamataidban – és hogyan alakíthatja át az AI-automatizálás a vállalkozásodat.",
      startBtn: "Elemzés indítása →",
      badge1: "5 perc", badge2: "Bizalmas", badge3: "Egyéni",
      contactTitle: "Mesélj magadról",
      contactSubtitle: "Hogy személyre szabhassuk az elemzésed, és az első beszélgetésen konkrét megoldásokat mutathassunk.",
      firstName: "Keresztnév *", lastName: "Vezetéknév *", company: "Cég *", role: "Pozíció",
      emailLabel: "E-mail *", phone: "Telefon *", website: "Weboldal", teamSize: "Csapatméret",
      selectPlaceholder: "Kérjük válassz",
      painTitle: "Hol vérzik a vállalkozásod?",
      painSubtitle: "Légy őszinte magadhoz – több válasz is lehetséges. Minél pontosabb, annál jobban tudunk segíteni.",
      manualHoursLabel: "Hetente hány órát tölt a csapatod manuális feladatokkal?",
      mainPainLabel: "A legfőbb fájdalompontod – melyik EGY feladatot szüntetnéd meg azonnal?",
      mainPainPlaceholder: "Az a dolog, ami minden nap az idegedre megy...",
      processTitle: "A jelenlegi munkafolyamataid",
      processSubtitle: "Segíts azonosítani a pontos helyeket, ahol az automatizálás a legnagyobb hatást érheti el.",
      toolsTitle: "A szoftverkörnyezetetek",
      toolsSubtitle: "Hogy tudjuk, mely rendszereket köthetjük össze API-n keresztül és automatizálhatjuk.",
      visionTitle: "A jövőképed",
      visionSubtitle: "Tegyük félre a fájdalmat. Képzeld el, hogy minden bosszantó szűk keresztmetszet megszűnt.",
      visionFeelLabel: "Hogyan érezze magát a vállalkozásod 6 hónap múlva?",
      timeGoalLabel: "Mit csinálsz heti 15–20 felszabadult órával?",
      timeGoalPlaceholder: "pl. Bevétel duplázása, Több idő a családdal, Végre 3 hét szabadság",
      bizGoalLabel: "Az ultimátum célod a következő 12–24 hónapra?",
      bizGoalPlaceholder: "pl. Bevétel X€-ra skálázása, több szabadság, csapatépítés...",
      budgetLabel: "Mekkora keretet szántál arra, hogy ezeket a fájdalompontokat megszüntesd?",
      resultTag: "Az eredményed",
      resultTitle: "Az automatizálási potenciálod",
      resultSubtitlePre: "a",
      resultSubtitleNoPre: "A",
      resultSubtitlePost: "megadott adatok alapján a következő megtakarítási potenciált állapítottuk meg:",
      savingsWeek: "Időmegtakarítás / hét", savingsMonth: "Megtakarítás / hónap",
      savingsYear: "12 hónapra vetítve", savingsYearSub: "potenciális éves megtakarítás",
      savedHours: "megtakarított munkaóra", savedMoney: "pénzbeli megtakarítás", yearSavings: "potenciális éves megtakarítás",
      painListTitle: "Az azonosított fájdalompontjaid",
      ctaTitle: "Készen állsz, hogy aktiváld ezt a potenciált?",
      ctaSubtitle: "Az ingyenes első konzultáción konkrétan megmutatjuk, mely automatizálások hozzák a legnagyobb megtérülést a vállalkozásodnak.",
      savePdf: "📄 Elemzés mentése PDF-ként", bookCall: "📞 Konzultáció foglalása",
      tagline: "AI automatizálás a vállalkozásodnak",
      back: "← Vissza", next: "Tovább →", seeResult: "Eredmény megtekintése →",
      submitting: "⏳ Adatok küldése...", submitted: "✓ Az elemzésed sikeresen elküldve", retrying: "Újrapróbálkozás...",
      pdfTitle: "Potenciálelemzés", pdfSaveBtn: "⬇️ Mentés PDF-ként",
      pdfPainTitle: "Azonosított fájdalompontok", pdfArea: "Terület", pdfTimeSaving: "Időmegtakarítás", pdfCostSaving: "Költségmegtakarítás",
      pdfMainPain: "Legfőbb fájdalompont", pdfProcesses: "Jelenlegi folyamatok", pdfSoftware: "Szoftverkörnyezet",
      pdfVisionGoals: "Jövőkép & Célok", pdfFeeling: "KÍVÁNT ÉRZÉS:", pdfTimeInvest: "IDŐ-BEFEKTETÉS:",
      pdfBizGoal: "12–24 HÓNAPOS CÉL:", pdfBudget: "BEFEKTETÉSI KERET:",
      pdfCtaTitle: "Készen állsz, hogy aktiváld ezt a potenciált?",
      pdfCtaSub: "Az ingyenes első konzultáción konkrétan megmutatjuk, mely automatizálások hozzák a legnagyobb megtérülést a vállalkozásodnak.",
      pdfCtaBtn: "Konzultáció foglalása →",
      pdfFooter: "Ez az elemzés automatikusan készült. Minden érték iparági átlagokon alapuló becslés.",
      perWeek: "/ hét", perMonth: "/ hónap",
      rolePlaceholder: "Ügyvezető",
    },
  },
};

function AnimatedNumber({ value, suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <span>{display.toLocaleString("de-DE")}{suffix}</span>;
}

export default function Potenzialanalyse() {
  const [lang, setLang] = useState("de");
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [contact, setContact] = useState({ vorname: "", nachname: "", unternehmen: "", rolle: "", email: "", telefon: "", webseite: "", mitarbeiter: "" });
  const [pains, setPains] = useState([]);
  const [mainPain, setMainPain] = useState("");
  const [processes, setProcesses] = useState({});
  const [tools, setTools] = useState({});
  const [vision, setVision] = useState([]);
  const [timeGoal, setTimeGoal] = useState("");
  const [bizGoal, setBizGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [manualHours, setManualHours] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const t = T[lang];
  const ui = t.ui;

  const submitToWebhook = async () => {
    if (submitted) return;
    setSubmitStatus("sending");
    const totalHours = pains.reduce((s, id) => { const p = t.painPoints.find(pp => pp.id === id); return s + (p?.savingsHoursWeek || 0); }, 0) + Math.round(manualHours * 0.7);
    const totalEuro = pains.reduce((s, id) => { const p = t.painPoints.find(pp => pp.id === id); return s + (p?.savingsEuroMonth || 0); }, 0) + Math.round(manualHours * 35 * 4 * 0.7);
    const payload = {
      timestamp: new Date().toISOString(), language: lang, contact: { ...contact },
      analyse: { schmerzpunkte: pains.map(id => { const p = t.painPoints.find(pp => pp.id === id); return { id: p.id, label: p.label, savingsHoursWeek: p.savingsHoursWeek, savingsEuroMonth: p.savingsEuroMonth }; }), hauptschmerzpunkt: mainPain, manuelle_stunden_pro_woche: manualHours },
      prozesse: { lead_gewinnung: processes.lead_source || "", nach_kauf: processes.after_sale || "", manuelle_uebertragung: processes.manual_transfer || "", externe_dienstleister: processes.outsourced || "" },
      software: { ...tools },
      vision: { gewuenschtes_gefuehl: vision.map(vid => t.visionOptions.find(v => v.id === vid)?.label).filter(Boolean), zeit_investition: timeGoal, business_ziel: bizGoal, budget },
      ergebnis: { zeitersparnis_stunden_woche: totalHours, ersparnis_euro_monat: totalEuro, ersparnis_euro_jahr: totalEuro * 12 },
    };
    try {
      await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), mode: "no-cors" });
      setSubmitted(true); setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setTimeout(async () => { try { await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), mode: "no-cors" }); setSubmitted(true); setSubmitStatus("success"); } catch(e) {} }, 3000);
    }
  };

  const transition = (newStep) => {
    setFade(false);
    setTimeout(() => { setStep(newStep); setFade(true); if (newStep === t.steps.length - 1) submitToWebhook(); }, 300);
  };

  const totalSavingsHours = pains.reduce((s, id) => { const p = t.painPoints.find(pp => pp.id === id); return s + (p?.savingsHoursWeek || 0); }, 0) + Math.round(manualHours * 0.7);
  const totalSavingsEuro = pains.reduce((s, id) => { const p = t.painPoints.find(pp => pp.id === id); return s + (p?.savingsEuroMonth || 0); }, 0) + Math.round(manualHours * 35 * 4 * 0.7);

  const S = {
    input: { width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#E8E4DF", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.3s, box-shadow 0.3s", boxSizing: "border-box" },
    btnP: { padding: "16px 40px", background: "linear-gradient(135deg, #D4A853 0%, #B8860B 100%)", color: "#0D0D0D", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "700", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.3s", letterSpacing: "0.3px" },
    btnS: { padding: "14px 32px", background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.3s" },
    title: { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "800", fontFamily: "'Playfair Display', serif", color: "#FFFFFF", lineHeight: "1.25", marginBottom: "8px" },
    sub: { fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "36px", maxWidth: "560px" },
    label: { fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block", fontWeight: "500" },
    label2: { fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", display: "block", fontWeight: "600" },
  };
  const textarea = { ...S.input, minHeight: "100px", resize: "vertical", lineHeight: "1.6" };
  const fIn = (e) => { e.target.style.borderColor = "#D4A853"; e.target.style.boxShadow = "0 0 0 3px rgba(212,168,83,0.15)"; };
  const fOut = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; };
  const hIn = (e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(212,168,83,0.3)"; };
  const hOut = (e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; };
  const card = (a) => ({ padding: "20px", background: a ? "rgba(212,168,83,0.08)" : "rgba(255,255,255,0.02)", border: a ? "1.5px solid rgba(212,168,83,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", cursor: "pointer", transition: "all 0.3s", userSelect: "none" });

  const LangSwitch = () => (
    <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 200, display: "flex", gap: "0", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "3px", border: "1px solid rgba(255,255,255,0.08)" }}>
      {[["de","Deutsch"],["hu","Magyar"]].map(([c,label]) => (
        <button key={c} onClick={() => setLang(c)} style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: lang === c ? "rgba(212,168,83,0.2)" : "transparent", color: lang === c ? "#D4A853" : "rgba(255,255,255,0.35)", fontSize: "13px", cursor: "pointer", fontWeight: lang === c ? "700" : "500", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", letterSpacing: "0.3px" }}>
          {label}
        </button>
      ))}
    </div>
  );

  const renderIntro = () => (
    <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "3px", color: "#D4A853", textTransform: "uppercase", marginBottom: "24px" }}>{ui.freeAnalysis}</div>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", fontFamily: "'Playfair Display', serif", color: "#FFF", lineHeight: "1.15", marginBottom: "24px" }}>{ui.heroTitle1}<br/>{ui.heroTitle2} <span style={{ color: "#D4A853" }}>{ui.heroHighlight}</span><br/>{ui.heroTitle3}</h1>
      <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", maxWidth: "500px", margin: "0 auto 48px" }}>{ui.heroSubtitle}</p>
      <button style={S.btnP} onClick={() => transition(1)} onMouseOver={hIn} onMouseOut={hOut}>{ui.startBtn}</button>
      <div className="hero-badges" style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        {[["⏱️",ui.badge1],["🔒",ui.badge2],["🎯",ui.badge3]].map(([i,x]) => <div key={x} style={{ display:"flex",alignItems:"center",gap:"10px",color:"rgba(255,255,255,0.35)",fontSize:"14px" }}><span style={{fontSize:"18px"}}>{i}</span>{x}</div>)}
      </div>
    </div>
  );

  const renderContact = () => {
    const fields = [["vorname",ui.firstName,"Max"],["nachname",ui.lastName,"Mustermann"],["unternehmen",ui.company,"Musterfirma GmbH"],["rolle",ui.role,ui.rolePlaceholder],["email",ui.emailLabel,"max@musterfirma.de"],["telefon",ui.phone,"+49 123 456789"]];
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={S.title}>{ui.contactTitle}</h2>
        <p style={S.sub}>{ui.contactSubtitle}</p>
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {fields.map(([k,l,p]) => <div key={k}><label style={S.label}>{l}</label><input style={S.input} placeholder={p} value={contact[k]} onChange={e => setContact({...contact,[k]:e.target.value})} onFocus={fIn} onBlur={fOut}/></div>)}
          <div><label style={S.label}>{ui.website}</label><input style={S.input} placeholder="www.example.com" value={contact.webseite} onChange={e => setContact({...contact,webseite:e.target.value})} onFocus={fIn} onBlur={fOut}/></div>
          <div><label style={S.label}>{ui.teamSize}</label>
            <select style={{...S.input,appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 16px center"}} value={contact.mitarbeiter} onChange={e => setContact({...contact,mitarbeiter:e.target.value})} onFocus={fIn} onBlur={fOut}>
              <option value="" style={{background:"#1a1a1a"}}>{ui.selectPlaceholder}</option>
              {t.employeeOptions.map(o => <option key={o} value={o} style={{background:"#1a1a1a"}}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderPain = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={S.title}>{ui.painTitle}</h2>
      <p style={S.sub}>{ui.painSubtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        {t.painPoints.map(p => {
          const a = pains.includes(p.id);
          return (
            <div key={p.id} style={card(a)} onClick={() => setPains(a ? pains.filter(x=>x!==p.id) : [...pains,p.id])}>
              <div style={{ display:"flex",alignItems:"flex-start",gap:"14px" }}>
                <span style={{ fontSize:"24px",flexShrink:0,marginTop:"2px" }}>{p.icon}</span>
                <div style={{ flex:1 }}><div style={{ fontWeight:"700",color:a?"#D4A853":"#E8E4DF",fontSize:"15px",marginBottom:"4px" }}>{p.label}</div><div style={{ fontSize:"14px",color:"rgba(255,255,255,0.4)",lineHeight:"1.5" }}>{p.desc}</div></div>
                <div style={{ width:"24px",height:"24px",borderRadius:"8px",border:a?"2px solid #D4A853":"2px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a?"rgba(212,168,83,0.15)":"transparent",transition:"all 0.3s" }}>{a && <span style={{color:"#D4A853",fontSize:"14px",fontWeight:"bold"}}>✓</span>}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginBottom: "28px" }}>
        <label style={S.label2}>{ui.manualHoursLabel}</label>
        <div style={{ display:"flex",alignItems:"center",gap:"16px",marginTop:"12px" }}>
          <input type="range" min="1" max="60" value={manualHours} onChange={e => setManualHours(Number(e.target.value))} style={{ flex:1,accentColor:"#D4A853" }}/>
          <div style={{ background:"rgba(212,168,83,0.1)",border:"1px solid rgba(212,168,83,0.3)",borderRadius:"10px",padding:"8px 16px",fontWeight:"700",color:"#D4A853",fontSize:"18px",minWidth:"80px",textAlign:"center" }}>{manualHours}h</div>
        </div>
      </div>
      <div><label style={S.label2}>{ui.mainPainLabel}</label><textarea style={textarea} value={mainPain} onChange={e => setMainPain(e.target.value)} placeholder={ui.mainPainPlaceholder} onFocus={fIn} onBlur={fOut}/></div>
    </div>
  );

  const renderProcesses = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={S.title}>{ui.processTitle}</h2>
      <p style={S.sub}>{ui.processSubtitle}</p>
      <div style={{ display:"flex",flexDirection:"column",gap:"28px" }}>
        {t.processQuestions.map((q,i) => (
          <div key={q.id}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:"10px" }}>
              <span style={{ background:"rgba(212,168,83,0.1)",color:"#D4A853",width:"28px",height:"28px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"700",flexShrink:0 }}>{i+1}</span>
              <label style={{ fontSize:"15px",color:"rgba(255,255,255,0.75)",fontWeight:"600",lineHeight:"1.5" }}>{q.question}</label>
            </div>
            <textarea style={{...textarea,marginLeft:"40px",width:"calc(100% - 40px)"}} value={processes[q.id]||""} onChange={e => setProcesses({...processes,[q.id]:e.target.value})} placeholder={q.placeholder} onFocus={fIn} onBlur={fOut}/>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTools = () => (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={S.title}>{ui.toolsTitle}</h2>
      <p style={S.sub}>{ui.toolsSubtitle}</p>
      <div className="grid-2col" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px" }}>
        {t.toolCategories.map(tc => <div key={tc.id}><label style={S.label}>{tc.label}</label><input style={S.input} placeholder={tc.placeholder} value={tools[tc.id]||""} onChange={e => setTools({...tools,[tc.id]:e.target.value})} onFocus={fIn} onBlur={fOut}/></div>)}
      </div>
    </div>
  );

  const renderVision = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={S.title}>{ui.visionTitle}</h2>
      <p style={S.sub}>{ui.visionSubtitle}</p>
      <div style={{ marginBottom: "32px" }}>
        <label style={S.label2}>{ui.visionFeelLabel}</label>
        <div className="grid-2col" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
          {t.visionOptions.map(v => {
            const a = vision.includes(v.id);
            return (
              <div key={v.id} style={card(a)} onClick={() => setVision(a ? vision.filter(x=>x!==v.id) : [...vision,v.id])}>
                <div style={{ fontSize:"28px",marginBottom:"10px" }}>{v.icon}</div>
                <div style={{ fontWeight:"700",fontSize:"14px",color:a?"#D4A853":"#E8E4DF",marginBottom:"4px" }}>{v.label}</div>
                <div style={{ fontSize:"13px",color:"rgba(255,255,255,0.35)",lineHeight:"1.5" }}>{v.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom:"28px" }}><label style={S.label2}>{ui.timeGoalLabel}</label><textarea style={textarea} value={timeGoal} onChange={e => setTimeGoal(e.target.value)} placeholder={ui.timeGoalPlaceholder} onFocus={fIn} onBlur={fOut}/></div>
      <div style={{ marginBottom:"28px" }}><label style={S.label2}>{ui.bizGoalLabel}</label><textarea style={{...textarea,minHeight:"80px"}} value={bizGoal} onChange={e => setBizGoal(e.target.value)} placeholder={ui.bizGoalPlaceholder} onFocus={fIn} onBlur={fOut}/></div>
      <div>
        <label style={S.label2}>{ui.budgetLabel}</label>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          {t.budgetOptions.map(b => {
            const a = budget === b.label;
            return (
              <div key={b.label} style={card(a)} onClick={() => setBudget(b.label)}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
                    <div style={{ width:"20px",height:"20px",borderRadius:"50%",border:a?"2px solid #D4A853":"2px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s" }}>{a && <div style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#D4A853" }}/>}</div>
                    <span style={{ fontWeight:"600",fontSize:"15px",color:a?"#D4A853":"#E8E4DF" }}>{b.label}</span>
                  </div>
                  <span style={{ fontSize:"12px",color:"rgba(255,255,255,0.3)",fontWeight:"500" }}>{b.tag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const generatePDF = () => {
    const yearSavings = totalSavingsEuro * 12;
    const today = new Date().toLocaleDateString(lang === "hu" ? "hu-HU" : "de-DE", { day: "2-digit", month: "long", year: "numeric" });
    const painRows = pains.map(pid => { const p = t.painPoints.find(pp => pp.id === pid); return '<tr><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;">'+p.icon+' '+p.label+'</td><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;text-align:right;font-weight:700;color:#B8860B;">~'+p.savingsHoursWeek+'h '+ui.perWeek+'</td><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;text-align:right;font-weight:700;color:#2E7D32;">~'+p.savingsEuroMonth.toLocaleString("de-DE")+'€ '+ui.perMonth+'</td></tr>'; }).join("");
    const processEntries = t.processQuestions.map(q => { const v=processes[q.id]; if(!v)return""; return '<div style="margin-bottom:16px;"><div style="font-weight:700;color:#1a1a1a;margin-bottom:4px;font-size:13px;">'+q.question+'</div><div style="color:#444;font-size:12px;line-height:1.6;padding:8px 12px;background:#f8f6f2;border-radius:6px;">'+v+'</div></div>'; }).filter(Boolean).join("");
    const toolEntries = t.toolCategories.map(tc => { const v=tools[tc.id]; if(!v)return""; return '<span style="display:inline-block;background:#f0ebe3;padding:5px 12px;border-radius:6px;font-size:11px;margin:3px 4px;"><strong>'+tc.label+':</strong> '+v+'</span>'; }).filter(Boolean).join("");
    const visionLabels = vision.map(vid => t.visionOptions.find(v=>v.id===vid)).filter(Boolean).map(v => '<span style="display:inline-block;background:#f0ebe3;padding:5px 12px;border-radius:6px;font-size:11px;margin:3px 4px;">'+v.icon+' '+v.label+'</span>').join("");
    const manualCalc = lang==="hu" ? 'Manuális feladatok ('+manualHours+' óra/hét × 70% automatizálás)' : 'Manuelle Aufgaben ('+manualHours+'h/Wo × 70% Automatisierung)';
    const createdFor = contact.vorname ? (lang==="hu" ? 'Készült: '+contact.vorname+' '+contact.nachname+' részére' : 'Erstellt für '+contact.vorname+' '+contact.nachname) : ui.pdfTitle;

    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+ui.pdfTitle+' – '+(contact.unternehmen||"")+'</title><style>@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap");*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"DM Sans",sans-serif;color:#1a1a1a;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page{width:210mm;min-height:297mm;margin:0 auto;padding:28mm 24mm;}@media print{.page{padding:20mm 22mm;}.no-print{display:none!important;}}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #B8860B;}.logo{font-family:"Playfair Display",serif;font-size:26px;font-weight:800;color:#B8860B;}.logo-sub{font-size:11px;color:#888;margin-top:2px;}.meta{text-align:right;font-size:11px;color:#666;line-height:1.7;}.hero{text-align:center;margin:28px 0 36px;padding:32px 24px;background:linear-gradient(135deg,#fdf8ef,#f5efe3);border-radius:16px;border:1px solid #e8dcc8;}.hero h1{font-family:"Playfair Display",serif;font-size:28px;font-weight:800;margin-bottom:6px;}.hero p{font-size:13px;color:#777;}.kpi-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:32px;}.kpi{text-align:center;padding:24px 16px;border-radius:14px;border:1px solid #e8e4df;}.kpi.gold{background:linear-gradient(160deg,#fdf6e8,#fefcf7);border-color:#d4c9a8;}.kpi.green{background:linear-gradient(160deg,#edf7ee,#f8fcf8);border-color:#b8d4ba;}.kpi.dark{background:#1a1a1a;border-color:#333;color:#fff;}.kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin-bottom:6px;font-weight:600;}.kpi.dark .kpi-label{color:#aaa;}.kpi-value{font-family:"Playfair Display",serif;font-size:36px;font-weight:800;}.kpi.gold .kpi-value{color:#B8860B;}.kpi.green .kpi-value{color:#2E7D32;}.kpi.dark .kpi-value{color:#fff;}.kpi-unit{font-size:11px;color:#999;margin-top:2px;}.section{margin-bottom:28px;}.section-title{font-size:14px;font-weight:700;color:#B8860B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #e8e4df;}table{width:100%;border-collapse:collapse;font-size:12px;}table th{background:#f8f6f2;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;}.cta{text-align:center;margin-top:36px;padding:28px;background:linear-gradient(135deg,#fdf8ef,#f5efe3);border-radius:16px;border:1px solid #e8dcc8;}.cta h3{font-family:"Playfair Display",serif;font-size:20px;font-weight:800;margin-bottom:8px;}.cta p{font-size:12px;color:#777;line-height:1.7;}.cta a{display:inline-block;margin-top:14px;padding:10px 28px;background:#B8860B;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:13px;}.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e8e4df;font-size:10px;color:#aaa;}.print-btn{position:fixed;bottom:24px;right:24px;padding:14px 28px;background:#B8860B;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:"DM Sans",sans-serif;box-shadow:0 4px 20px rgba(184,134,11,0.3);z-index:999;}</style></head><body><button class="print-btn no-print" onclick="window.print()">'+ui.pdfSaveBtn+'</button><div class="page"><div class="header"><div><div class="logo">HeltAIum</div><div class="logo-sub">'+ui.tagline+'</div></div><div class="meta"><strong>'+ui.pdfTitle+'</strong><br>'+today+(contact.unternehmen?'<br>'+contact.unternehmen:'')+(contact.vorname?'<br>'+contact.vorname+' '+contact.nachname:'')+'</div></div><div class="hero"><h1>'+ui.resultTitle+'</h1><p>'+createdFor+(contact.unternehmen?' · '+contact.unternehmen:'')+'</p></div><div class="kpi-grid"><div class="kpi gold"><div class="kpi-label">'+ui.savingsWeek+'</div><div class="kpi-value">'+totalSavingsHours+'h</div><div class="kpi-unit">'+ui.savedHours+'</div></div><div class="kpi green"><div class="kpi-label">'+ui.savingsMonth+'</div><div class="kpi-value">'+totalSavingsEuro.toLocaleString("de-DE")+'€</div><div class="kpi-unit">'+ui.savedMoney+'</div></div><div class="kpi dark"><div class="kpi-label">'+ui.savingsYear+'</div><div class="kpi-value">'+yearSavings.toLocaleString("de-DE")+'€</div><div class="kpi-unit">'+ui.yearSavings+'</div></div></div>'+(pains.length>0?'<div class="section"><div class="section-title">'+ui.pdfPainTitle+'</div><table><thead><tr><th>'+ui.pdfArea+'</th><th style="text-align:right;">'+ui.pdfTimeSaving+'</th><th style="text-align:right;">'+ui.pdfCostSaving+'</th></tr></thead><tbody>'+painRows+'<tr style="font-weight:700;background:#f8f6f2;"><td style="padding:10px 14px;">'+manualCalc+'</td><td style="padding:10px 14px;text-align:right;color:#B8860B;">~'+Math.round(manualHours*0.7)+'h '+ui.perWeek+'</td><td style="padding:10px 14px;text-align:right;color:#2E7D32;">~'+(Math.round(manualHours*35*4*0.7)).toLocaleString("de-DE")+'€ '+ui.perMonth+'</td></tr></tbody></table></div>':'')+(mainPain?'<div class="section"><div class="section-title">'+ui.pdfMainPain+'</div><div style="padding:14px 18px;background:#fdf6e8;border-left:3px solid #B8860B;border-radius:0 8px 8px 0;font-size:13px;color:#444;line-height:1.6;font-style:italic;">"'+mainPain+'"</div></div>':'')+(processEntries?'<div class="section"><div class="section-title">'+ui.pdfProcesses+'</div>'+processEntries+'</div>':'')+(toolEntries?'<div class="section"><div class="section-title">'+ui.pdfSoftware+'</div><div>'+toolEntries+'</div></div>':'')+(visionLabels||timeGoal||bizGoal?'<div class="section"><div class="section-title">'+ui.pdfVisionGoals+'</div>'+(visionLabels?'<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">'+ui.pdfFeeling+'</strong><br><div style="margin-top:6px;">'+visionLabels+'</div></div>':'')+(timeGoal?'<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">'+ui.pdfTimeInvest+'</strong><div style="padding:8px 12px;background:#f8f6f2;border-radius:6px;font-size:12px;margin-top:4px;">'+timeGoal+'</div></div>':'')+(bizGoal?'<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">'+ui.pdfBizGoal+'</strong><div style="padding:8px 12px;background:#f8f6f2;border-radius:6px;font-size:12px;margin-top:4px;">'+bizGoal+'</div></div>':'')+(budget?'<div><strong style="font-size:11px;color:#888;">'+ui.pdfBudget+'</strong><div style="padding:8px 12px;background:#f0ebe3;border-radius:6px;font-size:12px;margin-top:4px;font-weight:600;">'+budget+'</div></div>':'')+'</div>':'')+'<div class="cta"><h3>'+ui.pdfCtaTitle+'</h3><p>'+ui.pdfCtaSub+'</p><a href="https://calendly.com/daniel-helt19/audit">'+ui.pdfCtaBtn+'</a></div><div class="footer">HeltAIum · '+ui.tagline+' · heltaium.com<br>'+ui.pdfFooter+'</div></div></body></html>';
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) { const a = document.createElement("a"); a.href = url; a.download = ui.pdfTitle+"_"+(contact.unternehmen||"Ergebnis")+".html"; a.click(); }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const renderResult = () => {
    const yearSavings = totalSavingsEuro * 12;
    const subtitle = contact.vorname ? contact.vorname+", "+ui.resultSubtitlePre : ui.resultSubtitleNoPre;
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "3px", color: "#D4A853", textTransform: "uppercase", marginBottom: "20px" }}>{ui.resultTag}</div>
        <h2 style={{ ...S.title, fontSize: "clamp(28px, 5vw, 42px)", marginBottom: "16px" }}>{ui.resultTitle}</h2>
        <p style={{ ...S.sub, textAlign: "center", margin: "0 auto 40px" }}>{subtitle} {ui.resultSubtitlePost}</p>
        <div className="kpi-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(160deg, rgba(212,168,83,0.12), rgba(212,168,83,0.03))", border: "1px solid rgba(212,168,83,0.2)", borderRadius: "20px", padding: "32px 24px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1.5px" }}>{ui.savingsWeek}</div>
            <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "800", color: "#D4A853", fontFamily: "'Playfair Display', serif" }}><AnimatedNumber value={totalSavingsHours} suffix="h"/></div>
          </div>
          <div style={{ background: "linear-gradient(160deg, rgba(76,175,80,0.1), rgba(76,175,80,0.02))", border: "1px solid rgba(76,175,80,0.2)", borderRadius: "20px", padding: "32px 24px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1.5px" }}>{ui.savingsMonth}</div>
            <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "800", color: "#4CAF50", fontFamily: "'Playfair Display', serif" }}><AnimatedNumber value={totalSavingsEuro} suffix="€"/></div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px 32px", marginBottom: "40px" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{ui.savingsYear}</div>
          <div style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: "800", color: "#E8E4DF", fontFamily: "'Playfair Display', serif" }}><AnimatedNumber value={yearSavings} suffix="€" duration={1600}/></div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>{ui.savingsYearSub}</div>
        </div>
        {pains.length > 0 && (
          <div style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px 32px", marginBottom: "32px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.6)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>{ui.painListTitle}</div>
            {pains.map(pid => { const p = t.painPoints.find(pp => pp.id === pid); return (
              <div key={pid} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: "20px" }}>{p.icon}</span>
                <span style={{ flex: 1, color: "#E8E4DF", fontSize: "14px" }}>{p.label}</span>
                <span style={{ color: "#D4A853", fontSize: "13px", fontWeight: "600" }}>~{p.savingsHoursWeek}h/W</span>
              </div>
            ); })}
          </div>
        )}
        <div style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))", border: "1px solid rgba(212,168,83,0.25)", borderRadius: "20px", padding: "36px 32px" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#FFF", fontFamily: "'Playfair Display', serif", marginBottom: "12px" }}>{ui.ctaTitle}</div>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", maxWidth: "420px", margin: "0 auto 24px" }}>{ui.ctaSubtitle}</p>
          <div className="cta-buttons" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={S.btnP} onClick={generatePDF} onMouseOver={hIn} onMouseOut={hOut}>{ui.savePdf}</button>
            <button style={{ ...S.btnP, background: "linear-gradient(135deg, #4CAF50, #2E7D32)", color: "#FFF" }} onClick={() => window.open("https://calendly.com/daniel-helt19/audit", "_blank")} onMouseOver={(e) => { e.target.style.transform="translateY(-2px)"; e.target.style.boxShadow="0 8px 30px rgba(76,175,80,0.3)"; }} onMouseOut={hOut}>{ui.bookCall}</button>
          </div>
        </div>
        <div style={{ marginTop: "40px", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#D4A853", fontFamily: "'Playfair Display', serif" }}>HeltAIum</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>— {ui.tagline}</span>
          </div>
          {submitStatus && <div style={{ marginTop: "12px", fontSize: "12px", color: submitStatus==="success"?"rgba(76,175,80,0.6)":submitStatus==="sending"?"rgba(255,255,255,0.3)":"rgba(255,100,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {submitStatus==="sending"&&ui.submitting}{submitStatus==="success"&&ui.submitted}{submitStatus==="error"&&ui.retrying}
          </div>}
        </div>
      </div>
    );
  };

  const steps = [renderIntro, renderContact, renderPain, renderProcesses, renderTools, renderVision, renderResult];

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#E8E4DF", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`
        @media (max-width: 640px) {
          .grid-2col { grid-template-columns: 1fr !important; }
          .kpi-grid-2 { grid-template-columns: 1fr !important; }
          .cta-buttons { flex-direction: column !important; align-items: stretch !important; }
          .cta-buttons button { width: 100% !important; text-align: center !important; }
          .hero-badges { gap: 20px !important; }
        }
      `}</style>
      <div style={{ position: "fixed", top: "-30%", right: "-20%", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 65%)", pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: "-20%", left: "-15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(212,168,83,0.03) 0%, transparent 60%)", pointerEvents: "none" }}/>
      <LangSwitch/>
      {step > 0 && step < t.steps.length - 1 && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "16px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontWeight: "500" }}>{ui.stepOf ? (lang==="hu" ? step+". lépés / "+(t.steps.length-2) : "Schritt "+step+" von "+(t.steps.length-2)) : ""}</span>
              <span style={{ fontSize: "13px", color: "#D4A853", fontWeight: "600" }}>{t.steps[step].label}</span>
            </div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: (step/(t.steps.length-2))*100+"%", background: "linear-gradient(90deg, #D4A853, #B8860B)", borderRadius: "2px", transition: "width 0.5s ease" }}/>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: step > 0 && step < t.steps.length - 1 ? "100px 24px 120px" : "60px 24px 120px", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
        {steps[step]()}
      </div>
      {step > 0 && step < t.steps.length - 1 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 24px", zIndex: 100 }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={S.btnS} onClick={() => transition(step-1)}>{ui.back}</button>
            <button style={S.btnP} onClick={() => transition(step+1)} onMouseOver={hIn} onMouseOut={hOut}>{step === t.steps.length - 2 ? ui.seeResult : ui.next}</button>
          </div>
        </div>
      )}
    </div>
  );
}

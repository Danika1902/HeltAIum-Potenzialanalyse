import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "intro", label: "Start" },
  { id: "contact", label: "Über dich" },
  { id: "pain", label: "Schmerzpunkte" },
  { id: "processes", label: "Prozesse" },
  { id: "tools", label: "Software" },
  { id: "vision", label: "Vision" },
  { id: "result", label: "Ergebnis" },
];

// ⚡ HIER DEINEN N8N WEBHOOK EINTRAGEN:
const WEBHOOK_URL = "https://DEINE-N8N-INSTANZ.app/webhook/potenzialanalyse";

const PAIN_POINTS = [
  {
    id: "slow_followup",
    icon: "🔥",
    label: "Verbranntes Geld",
    desc: "Wir verlieren Leads, weil wir zu langsam im Follow-up sind.",
    savingsHoursWeek: 4,
    savingsEuroMonth: 800,
  },
  {
    id: "copy_paste",
    icon: "🐒",
    label: "Affenarbeit",
    desc: "Stunden pro Woche gehen für stupide Copy & Paste-Aufgaben drauf.",
    savingsHoursWeek: 6,
    savingsEuroMonth: 600,
  },
  {
    id: "data_chaos",
    icon: "💾",
    label: "Daten-Chaos",
    desc: "Kundendaten liegen in mehreren Tools – niemand kennt den aktuellen Stand.",
    savingsHoursWeek: 3,
    savingsEuroMonth: 400,
  },
  {
    id: "expensive_agencies",
    icon: "💸",
    label: "Teure Dienstleister",
    desc: "Wir bezahlen Agenturen für Aufgaben, die KI günstiger erledigen könnte.",
    savingsHoursWeek: 2,
    savingsEuroMonth: 1500,
  },
  {
    id: "bottleneck",
    icon: "🚧",
    label: "Der Flaschenhals bin ich",
    desc: "Ohne mich bricht das operative Geschäft zusammen.",
    savingsHoursWeek: 5,
    savingsEuroMonth: 500,
  },
  {
    id: "scaling",
    icon: "📈",
    label: "Wachstumsbremse",
    desc: "Bei doppelt so vielen Kunden bricht unser System zusammen.",
    savingsHoursWeek: 4,
    savingsEuroMonth: 700,
  },
];

const PROCESS_QUESTIONS = [
  {
    id: "lead_source",
    question: "Wie kommen neue Anfragen zu euch?",
    placeholder: "z.B. Website-Formular, Social Media, Kaltakquise, Empfehlungen...",
  },
  {
    id: "after_sale",
    question: "Was passiert nach dem Kauf?",
    placeholder:
      "Beschreibe jeden manuellen Schritt: Verträge, Rechnungen, Onboarding, E-Mails...",
  },
  {
    id: "manual_transfer",
    question: "Welche Daten übertragt ihr täglich händisch zwischen Programmen?",
    placeholder: "z.B. CRM → Excel, E-Mail → Projektmanagement-Tool, Formulardaten → CRM...",
  },
  {
    id: "outsourced",
    question: "Welche Aufgaben sind an externe Dienstleister outgesourct?",
    placeholder:
      "z.B. Newsletter (500€/Monat), Social Media (800€/Monat), Datenpflege...",
  },
];

const TOOL_CATEGORIES = [
  { id: "crm", label: "CRM / Vertrieb", placeholder: "z.B. HubSpot, Pipedrive, Salesforce" },
  { id: "pm", label: "Projektmanagement", placeholder: "z.B. Asana, ClickUp, Trello, Monday" },
  { id: "email", label: "E-Mail-Marketing", placeholder: "z.B. ActiveCampaign, Mailchimp, Brevo" },
  { id: "accounting", label: "Buchhaltung", placeholder: "z.B. Lexoffice, SevDesk, DATEV" },
  { id: "payment", label: "Zahlungsanbieter", placeholder: "z.B. Stripe, PayPal, Mollie" },
  { id: "booking", label: "Terminbuchung", placeholder: "z.B. Calendly, Cal.com, Acuity" },
  { id: "website", label: "Website / Shop", placeholder: "z.B. WordPress, Shopify, Webflow" },
  { id: "communication", label: "Kommunikation", placeholder: "z.B. Slack, Teams, WhatsApp Business" },
];

const VISION_OPTIONS = [
  { id: "ease", icon: "☀️", label: "Leichtigkeit", desc: "Morgens aufklappen – alles ist organisiert." },
  { id: "growth", icon: "🚀", label: "Grenzenloses Wachstum", desc: "Doppelt so viele Kunden, ohne ins Schwitzen zu geraten." },
  { id: "security", icon: "🛡️", label: "Ruhe & Sicherheit", desc: "Kein Lead geht verloren, keine Fehler passieren." },
  { id: "freedom", icon: "🏖️", label: "Wahre Freiheit", desc: "Das Unternehmen läuft profitabel – auch ohne dich." },
];

const EMPLOYEE_OPTIONS = ["Solo / Freelancer", "2–5 Mitarbeiter", "6–15 Mitarbeiter", "16–50 Mitarbeiter", "Über 50 Mitarbeiter"];
const BUDGET_OPTIONS = [
  { label: "Unter 1.000 €", tag: "Notfall-Pflaster" },
  { label: "1.000 – 3.000 €", tag: "Engpässe eliminieren" },
  { label: "3.000 – 5.000 €", tag: "Große Prozessketten" },
  { label: "Über 5.000 €", tag: "System-Transformation" },
];

function AnimatedNumber({ value, suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
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
  return (
    <span>
      {display.toLocaleString("de-DE")}
      {suffix}
    </span>
  );
}

export default function Potenzialanalyse() {
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
  const [submitStatus, setSubmitStatus] = useState(null); // null | "sending" | "success" | "error"

  const submitToWebhook = async () => {
    if (submitted) return;
    setSubmitStatus("sending");

    const totalHours = pains.reduce((sum, id) => {
      const p = PAIN_POINTS.find((pp) => pp.id === id);
      return sum + (p?.savingsHoursWeek || 0);
    }, 0) + Math.round(manualHours * 0.7);

    const totalEuro = pains.reduce((sum, id) => {
      const p = PAIN_POINTS.find((pp) => pp.id === id);
      return sum + (p?.savingsEuroMonth || 0);
    }, 0) + Math.round(manualHours * 35 * 4 * 0.7);

    const payload = {
      timestamp: new Date().toISOString(),
      contact: {
        vorname: contact.vorname,
        nachname: contact.nachname,
        unternehmen: contact.unternehmen,
        rolle: contact.rolle,
        email: contact.email,
        telefon: contact.telefon,
        webseite: contact.webseite,
        mitarbeiter: contact.mitarbeiter,
      },
      analyse: {
        schmerzpunkte: pains.map((id) => {
          const p = PAIN_POINTS.find((pp) => pp.id === id);
          return { id: p.id, label: p.label, savingsHoursWeek: p.savingsHoursWeek, savingsEuroMonth: p.savingsEuroMonth };
        }),
        hauptschmerzpunkt: mainPain,
        manuelle_stunden_pro_woche: manualHours,
      },
      prozesse: {
        lead_gewinnung: processes.lead_source || "",
        nach_kauf: processes.after_sale || "",
        manuelle_uebertragung: processes.manual_transfer || "",
        externe_dienstleister: processes.outsourced || "",
      },
      software: { ...tools },
      vision: {
        gewuenschtes_gefuehl: vision.map((vid) => VISION_OPTIONS.find((v) => v.id === vid)?.label).filter(Boolean),
        zeit_investition: timeGoal,
        business_ziel: bizGoal,
        budget: budget,
      },
      ergebnis: {
        zeitersparnis_stunden_woche: totalHours,
        ersparnis_euro_monat: totalEuro,
        ersparnis_euro_jahr: totalEuro * 12,
      },
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });
      setSubmitted(true);
      setSubmitStatus("success");
    } catch (err) {
      console.error("Webhook error:", err);
      setSubmitStatus("error");
      // Retry once after 3 seconds
      setTimeout(async () => {
        try {
          await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            mode: "no-cors",
          });
          setSubmitted(true);
          setSubmitStatus("success");
        } catch (e) {
          console.error("Webhook retry failed:", e);
        }
      }, 3000);
    }
  };

  const transition = (newStep) => {
    setFade(false);
    setTimeout(() => {
      setStep(newStep);
      setFade(true);
      // Auto-submit when reaching result page
      if (newStep === STEPS.length - 1) {
        submitToWebhook();
      }
    }, 300);
  };

  const totalSavingsHours = pains.reduce((sum, id) => {
    const p = PAIN_POINTS.find((pp) => pp.id === id);
    return sum + (p?.savingsHoursWeek || 0);
  }, 0) + Math.round(manualHours * 0.7);

  const totalSavingsEuro = pains.reduce((sum, id) => {
    const p = PAIN_POINTS.find((pp) => pp.id === id);
    return sum + (p?.savingsEuroMonth || 0);
  }, 0) + Math.round(manualHours * 35 * 4 * 0.7);

  const progressPercent = Math.round((step / (STEPS.length - 1)) * 100);

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#E8E4DF",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxSizing: "border-box",
  };

  const inputFocusHandler = (e) => {
    e.target.style.borderColor = "#D4A853";
    e.target.style.boxShadow = "0 0 0 3px rgba(212,168,83,0.15)";
  };
  const inputBlurHandler = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  const textareaStyle = { ...inputStyle, minHeight: "100px", resize: "vertical", lineHeight: "1.6" };

  const btnPrimary = {
    padding: "16px 40px",
    background: "linear-gradient(135deg, #D4A853 0%, #B8860B 100%)",
    color: "#0D0D0D",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.3s",
    letterSpacing: "0.3px",
  };

  const btnSecondary = {
    padding: "14px 32px",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  const sectionTitle = {
    fontSize: "clamp(26px, 4vw, 36px)",
    fontWeight: "800",
    fontFamily: "'Playfair Display', serif",
    color: "#FFFFFF",
    lineHeight: "1.25",
    marginBottom: "8px",
  };

  const sectionSubtitle = {
    fontSize: "16px",
    color: "rgba(255,255,255,0.5)",
    lineHeight: "1.7",
    marginBottom: "36px",
    maxWidth: "560px",
  };

  const cardStyle = (active) => ({
    padding: "20px",
    background: active ? "rgba(212,168,83,0.08)" : "rgba(255,255,255,0.02)",
    border: active ? "1.5px solid rgba(212,168,83,0.4)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s",
    userSelect: "none",
  });

  const renderIntro = () => (
    <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "3px", color: "#D4A853", textTransform: "uppercase", marginBottom: "24px" }}>
        Kostenlose Potenzialanalyse
      </div>
      <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", fontFamily: "'Playfair Display', serif", color: "#FFF", lineHeight: "1.15", marginBottom: "24px" }}>
        Finde heraus, wo dein<br />Unternehmen{" "}
        <span style={{ color: "#D4A853" }}>Zeit & Geld</span>
        <br />verbrennt
      </h1>
      <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "48px", maxWidth: "500px", margin: "0 auto 48px" }}>
        In nur 5 Minuten zeigen wir dir glasklar auf, wie viel Einsparpotenzial in deinen aktuellen Prozessen schlummert – und wie KI-Automatisierung dein Business transformieren kann.
      </p>
      <button style={btnPrimary} onClick={() => transition(1)} onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(212,168,83,0.3)"; }} onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
        Analyse starten →
      </button>
      <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        {[["⏱️", "5 Min."], ["🔒", "Vertraulich"], ["🎯", "Individuell"]].map(([icon, text]) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
            <span style={{ fontSize: "18px" }}>{icon}</span> {text}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={sectionTitle}>Erzähl uns von dir</h2>
      <p style={sectionSubtitle}>Damit wir deine Analyse personalisieren und dir im Erstgespräch direkt Lösungen präsentieren können.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          ["vorname", "Vorname *", "Max"],
          ["nachname", "Nachname *", "Mustermann"],
          ["unternehmen", "Unternehmen *", "Musterfirma GmbH"],
          ["rolle", "Rolle / Position", "Geschäftsführer"],
          ["email", "E-Mail *", "max@musterfirma.de"],
          ["telefon", "Telefon *", "+49 123 456789"],
        ].map(([key, label, ph]) => (
          <div key={key}>
            <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block", fontWeight: "500" }}>{label}</label>
            <input style={inputStyle} placeholder={ph} value={contact[key]} onChange={(e) => setContact({ ...contact, [key]: e.target.value })} onFocus={inputFocusHandler} onBlur={inputBlurHandler} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block", fontWeight: "500" }}>Webseite</label>
          <input style={inputStyle} placeholder="www.musterfirma.de" value={contact.webseite} onChange={(e) => setContact({ ...contact, webseite: e.target.value })} onFocus={inputFocusHandler} onBlur={inputBlurHandler} />
        </div>
        <div>
          <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block", fontWeight: "500" }}>Teamgröße</label>
          <select
            style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
            value={contact.mitarbeiter}
            onChange={(e) => setContact({ ...contact, mitarbeiter: e.target.value })}
            onFocus={inputFocusHandler}
            onBlur={inputBlurHandler}
          >
            <option value="" style={{ background: "#1a1a1a" }}>Bitte wählen</option>
            {EMPLOYEE_OPTIONS.map((o) => (
              <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderPain = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={sectionTitle}>Wo blutet dein Unternehmen?</h2>
      <p style={sectionSubtitle}>Sei ehrlich zu dir selbst – Mehrfachauswahl erwünscht. Je genauer, desto besser können wir helfen.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        {PAIN_POINTS.map((p) => {
          const active = pains.includes(p.id);
          return (
            <div
              key={p.id}
              style={cardStyle(active)}
              onClick={() => setPains(active ? pains.filter((x) => x !== p.id) : [...pains, p.id])}
              onMouseOver={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseOut={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", color: active ? "#D4A853" : "#E8E4DF", fontSize: "15px", marginBottom: "4px" }}>{p.label}</div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>{p.desc}</div>
                </div>
                <div style={{ width: "24px", height: "24px", borderRadius: "8px", border: active ? "2px solid #D4A853" : "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: active ? "rgba(212,168,83,0.15)" : "transparent", transition: "all 0.3s" }}>
                  {active && <span style={{ color: "#D4A853", fontSize: "14px", fontWeight: "bold" }}>✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "6px", display: "block", fontWeight: "600" }}>
          Wie viele Stunden pro Woche verbringt dein Team mit manuellen Aufgaben?
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
          <input
            type="range"
            min="1"
            max="60"
            value={manualHours}
            onChange={(e) => setManualHours(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#D4A853" }}
          />
          <div style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: "10px", padding: "8px 16px", fontWeight: "700", color: "#D4A853", fontSize: "18px", minWidth: "80px", textAlign: "center" }}>
            {manualHours}h
          </div>
        </div>
      </div>

      <div>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", display: "block", fontWeight: "600" }}>
          Dein absoluter Schmerzpunkt – welche EINE Aufgabe würdest du sofort loswerden?
        </label>
        <textarea style={textareaStyle} value={mainPain} onChange={(e) => setMainPain(e.target.value)} placeholder="Die eine Sache, die dich jeden Tag aufs Neue nervt..." onFocus={inputFocusHandler} onBlur={inputBlurHandler} />
      </div>
    </div>
  );

  const renderProcesses = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={sectionTitle}>Deine aktuellen Abläufe</h2>
      <p style={sectionSubtitle}>Hilf uns, die genauen Stellen zu identifizieren, an denen Automatisierung den größten Hebel hat.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {PROCESS_QUESTIONS.map((q, i) => (
          <div key={q.id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
              <span style={{ background: "rgba(212,168,83,0.1)", color: "#D4A853", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>
                {i + 1}
              </span>
              <label style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", fontWeight: "600", lineHeight: "1.5" }}>{q.question}</label>
            </div>
            <textarea
              style={{ ...textareaStyle, marginLeft: "40px", width: "calc(100% - 40px)" }}
              value={processes[q.id] || ""}
              onChange={(e) => setProcesses({ ...processes, [q.id]: e.target.value })}
              placeholder={q.placeholder}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTools = () => (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={sectionTitle}>Eure Software-Landschaft</h2>
      <p style={sectionSubtitle}>Damit wir wissen, welche Systeme wir per API verbinden und automatisieren können.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {TOOL_CATEGORIES.map((t) => (
          <div key={t.id}>
            <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "6px", display: "block", fontWeight: "500" }}>{t.label}</label>
            <input
              style={inputStyle}
              placeholder={t.placeholder}
              value={tools[t.id] || ""}
              onChange={(e) => setTools({ ...tools, [t.id]: e.target.value })}
              onFocus={inputFocusHandler}
              onBlur={inputBlurHandler}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderVision = () => (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <h2 style={sectionTitle}>Deine Vision</h2>
      <p style={sectionSubtitle}>Lass uns den Schmerz beiseitelegen. Stell dir vor, alle nervigen Flaschenhälse sind eliminiert.</p>

      <div style={{ marginBottom: "32px" }}>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "12px", display: "block", fontWeight: "600" }}>
          Wie soll sich dein Business in 6 Monaten anfühlen?
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {VISION_OPTIONS.map((v) => {
            const active = vision.includes(v.id);
            return (
              <div
                key={v.id}
                style={cardStyle(active)}
                onClick={() => setVision(active ? vision.filter((x) => x !== v.id) : [...vision, v.id])}
              >
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{v.icon}</div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: active ? "#D4A853" : "#E8E4DF", marginBottom: "4px" }}>{v.label}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: "1.5" }}>{v.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", display: "block", fontWeight: "600" }}>
          Was machst du mit 15–20 freien Stunden pro Woche?
        </label>
        <textarea style={textareaStyle} value={timeGoal} onChange={(e) => setTimeGoal(e.target.value)} placeholder='z.B. "Umsatz verdoppeln", "Mehr Zeit mit der Familie", "Endlich 3 Wochen Urlaub"' onFocus={inputFocusHandler} onBlur={inputBlurHandler} />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", display: "block", fontWeight: "600" }}>
          Dein ultimatives Ziel für die nächsten 12–24 Monate?
        </label>
        <textarea style={{ ...textareaStyle, minHeight: "80px" }} value={bizGoal} onChange={(e) => setBizGoal(e.target.value)} placeholder="z.B. Umsatz auf X€ skalieren, mehr Freiheit, Team aufbauen..." onFocus={inputFocusHandler} onBlur={inputBlurHandler} />
      </div>

      <div>
        <label style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "12px", display: "block", fontWeight: "600" }}>
          Welches Budget hast du reserviert, um diese Schmerzpunkte zu beseitigen?
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {BUDGET_OPTIONS.map((b) => {
            const active = budget === b.label;
            return (
              <div key={b.label} style={cardStyle(active)} onClick={() => setBudget(b.label)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: active ? "2px solid #D4A853" : "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                      {active && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D4A853" }} />}
                    </div>
                    <span style={{ fontWeight: "600", fontSize: "15px", color: active ? "#D4A853" : "#E8E4DF" }}>{b.label}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: "500" }}>{b.tag}</span>
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
    const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

    const painRows = pains.map((pid) => {
      const p = PAIN_POINTS.find((pp) => pp.id === pid);
      return `<tr><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;">${p.icon} ${p.label}</td><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;text-align:right;font-weight:700;color:#B8860B;">~${p.savingsHoursWeek}h / Woche</td><td style="padding:10px 14px;border-bottom:1px solid #e8e4df;text-align:right;font-weight:700;color:#2E7D32;">~${p.savingsEuroMonth.toLocaleString("de-DE")}€ / Monat</td></tr>`;
    }).join("");

    const processEntries = PROCESS_QUESTIONS.map((q) => {
      const val = processes[q.id];
      if (!val) return "";
      return `<div style="margin-bottom:16px;"><div style="font-weight:700;color:#1a1a1a;margin-bottom:4px;font-size:13px;">${q.question}</div><div style="color:#444;font-size:12px;line-height:1.6;padding:8px 12px;background:#f8f6f2;border-radius:6px;">${val}</div></div>`;
    }).filter(Boolean).join("");

    const toolEntries = TOOL_CATEGORIES.map((t) => {
      const val = tools[t.id];
      if (!val) return "";
      return `<span style="display:inline-block;background:#f0ebe3;padding:5px 12px;border-radius:6px;font-size:11px;margin:3px 4px;"><strong>${t.label}:</strong> ${val}</span>`;
    }).filter(Boolean).join("");

    const visionLabels = vision.map((vid) => VISION_OPTIONS.find((v) => v.id === vid)).filter(Boolean).map((v) => `<span style="display:inline-block;background:#f0ebe3;padding:5px 12px;border-radius:6px;font-size:11px;margin:3px 4px;">${v.icon} ${v.label}</span>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Potenzialanalyse – ${contact.unternehmen || "Ihr Unternehmen"}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'DM Sans',sans-serif;color:#1a1a1a;background:#fff;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
@page{size:A4;margin:0;}
.page{width:210mm;min-height:297mm;margin:0 auto;padding:28mm 24mm;position:relative;}
@media print{.page{padding:20mm 22mm;}.no-print{display:none !important;}}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #B8860B;}
.logo{font-family:'Playfair Display',serif;font-size:26px;font-weight:800;color:#B8860B;}
.logo-sub{font-size:11px;color:#888;margin-top:2px;font-family:'DM Sans',sans-serif;font-weight:400;}
.meta{text-align:right;font-size:11px;color:#666;line-height:1.7;}
.hero{text-align:center;margin:28px 0 36px;padding:32px 24px;background:linear-gradient(135deg,#fdf8ef 0%,#f5efe3 100%);border-radius:16px;border:1px solid #e8dcc8;}
.hero h1{font-family:'Playfair Display',serif;font-size:28px;font-weight:800;color:#1a1a1a;margin-bottom:6px;}
.hero p{font-size:13px;color:#777;}
.kpi-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:32px;}
.kpi{text-align:center;padding:24px 16px;border-radius:14px;border:1px solid #e8e4df;}
.kpi.gold{background:linear-gradient(160deg,#fdf6e8,#fefcf7);border-color:#d4c9a8;}
.kpi.green{background:linear-gradient(160deg,#edf7ee,#f8fcf8);border-color:#b8d4ba;}
.kpi.dark{background:#1a1a1a;border-color:#333;color:#fff;}
.kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin-bottom:6px;font-weight:600;}
.kpi.dark .kpi-label{color:#aaa;}
.kpi-value{font-family:'Playfair Display',serif;font-size:36px;font-weight:800;}
.kpi.gold .kpi-value{color:#B8860B;}
.kpi.green .kpi-value{color:#2E7D32;}
.kpi.dark .kpi-value{color:#fff;}
.kpi-unit{font-size:11px;color:#999;margin-top:2px;}
.section{margin-bottom:28px;}
.section-title{font-size:14px;font-weight:700;color:#B8860B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #e8e4df;}
table{width:100%;border-collapse:collapse;font-size:12px;}
table th{background:#f8f6f2;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;}
table td{padding:10px 14px;border-bottom:1px solid #f0ece4;}
.cta{text-align:center;margin-top:36px;padding:28px;background:linear-gradient(135deg,#fdf8ef 0%,#f5efe3 100%);border-radius:16px;border:1px solid #e8dcc8;}
.cta h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:800;margin-bottom:8px;}
.cta p{font-size:12px;color:#777;line-height:1.7;}
.cta a{display:inline-block;margin-top:14px;padding:10px 28px;background:#B8860B;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:13px;}
.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e8e4df;font-size:10px;color:#aaa;}
.print-btn{position:fixed;bottom:24px;right:24px;padding:14px 28px;background:#B8860B;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 20px rgba(184,134,11,0.3);z-index:999;}
.print-btn:hover{background:#9a7209;transform:translateY(-1px);}
</style></head><body>
<button class="print-btn no-print" onclick="window.print()">⬇️ Als PDF speichern</button>
<div class="page">
<div class="header">
  <div><div class="logo">HeltAIum</div><div class="logo-sub">AI Automation für dein Business</div></div>
  <div class="meta"><strong>Potenzialanalyse</strong><br>${today}<br>${contact.unternehmen ? `${contact.unternehmen}` : ""}${contact.vorname ? `<br>${contact.vorname} ${contact.nachname}` : ""}</div>
</div>

<div class="hero">
  <h1>Dein Automatisierungs-Potenzial</h1>
  <p>${contact.vorname ? `Erstellt für ${contact.vorname} ${contact.nachname}` : "Individuelle Analyse"}${contact.unternehmen ? ` · ${contact.unternehmen}` : ""}</p>
</div>

<div class="kpi-grid">
  <div class="kpi gold"><div class="kpi-label">Zeitersparnis / Woche</div><div class="kpi-value">${totalSavingsHours}h</div><div class="kpi-unit">eingesparte Arbeitsstunden</div></div>
  <div class="kpi green"><div class="kpi-label">Ersparnis / Monat</div><div class="kpi-value">${totalSavingsEuro.toLocaleString("de-DE")}€</div><div class="kpi-unit">monetäre Einsparung</div></div>
  <div class="kpi dark"><div class="kpi-label">Hochgerechnet / Jahr</div><div class="kpi-value">${yearSavings.toLocaleString("de-DE")}€</div><div class="kpi-unit">potenzielle Jahresersparnis</div></div>
</div>

${pains.length > 0 ? `<div class="section"><div class="section-title">Identifizierte Schmerzpunkte</div>
<table><thead><tr><th>Bereich</th><th style="text-align:right;">Zeitersparnis</th><th style="text-align:right;">Kostenersparnis</th></tr></thead><tbody>${painRows}
<tr style="font-weight:700;background:#f8f6f2;"><td style="padding:10px 14px;">Manuelle Aufgaben (${manualHours}h/Wo × 70% Automatisierung)</td><td style="padding:10px 14px;text-align:right;color:#B8860B;">~${Math.round(manualHours * 0.7)}h / Woche</td><td style="padding:10px 14px;text-align:right;color:#2E7D32;">~${(Math.round(manualHours * 35 * 4 * 0.7)).toLocaleString("de-DE")}€ / Monat</td></tr>
</tbody></table></div>` : ""}

${mainPain ? `<div class="section"><div class="section-title">Absoluter Schmerzpunkt</div><div style="padding:14px 18px;background:#fdf6e8;border-left:3px solid #B8860B;border-radius:0 8px 8px 0;font-size:13px;color:#444;line-height:1.6;font-style:italic;">"${mainPain}"</div></div>` : ""}

${processEntries ? `<div class="section"><div class="section-title">Aktuelle Prozesse & Abläufe</div>${processEntries}</div>` : ""}

${toolEntries ? `<div class="section"><div class="section-title">Software-Landschaft</div><div>${toolEntries}</div></div>` : ""}

${visionLabels || timeGoal || bizGoal ? `<div class="section"><div class="section-title">Vision & Ziele</div>
${visionLabels ? `<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">GEWÜNSCHTES GEFÜHL:</strong><br><div style="margin-top:6px;">${visionLabels}</div></div>` : ""}
${timeGoal ? `<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">ZEIT-INVESTITION:</strong><div style="padding:8px 12px;background:#f8f6f2;border-radius:6px;font-size:12px;margin-top:4px;">${timeGoal}</div></div>` : ""}
${bizGoal ? `<div style="margin-bottom:12px;"><strong style="font-size:11px;color:#888;">12–24 MONATS-ZIEL:</strong><div style="padding:8px 12px;background:#f8f6f2;border-radius:6px;font-size:12px;margin-top:4px;">${bizGoal}</div></div>` : ""}
${budget ? `<div><strong style="font-size:11px;color:#888;">INVESTITIONSRAHMEN:</strong><div style="padding:8px 12px;background:#f0ebe3;border-radius:6px;font-size:12px;margin-top:4px;font-weight:600;">${budget}</div></div>` : ""}
</div>` : ""}

<div class="cta">
  <h3>Bereit, dieses Potenzial zu aktivieren?</h3>
  <p>Im kostenlosen Erstgespräch zeigen wir dir konkret, welche Automatisierungen<br>für dein Business den größten ROI bringen.</p>
  <a href="https://calendly.com/daniel-helt19/audit">Erstgespräch buchen →</a>
</div>

<div class="footer">
  HeltAIum · AI Automation für dein Business · heltaium.com<br>
  Diese Analyse wurde automatisch erstellt. Alle Werte sind Schätzungen basierend auf Branchendurchschnitten.
</div>
</div></body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `Potenzialanalyse_${contact.unternehmen || "Ergebnis"}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const renderResult = () => {
    const yearSavings = totalSavingsEuro * 12;
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "3px", color: "#D4A853", textTransform: "uppercase", marginBottom: "20px" }}>
          Dein Ergebnis
        </div>
        <h2 style={{ ...sectionTitle, fontSize: "clamp(28px, 5vw, 42px)", marginBottom: "16px" }}>
          Dein Automatisierungs-Potenzial
        </h2>
        <p style={{ ...sectionSubtitle, textAlign: "center", margin: "0 auto 40px" }}>
          {contact.vorname ? `${contact.vorname}, basierend` : "Basierend"} auf deinen Angaben haben wir folgendes Einsparpotenzial ermittelt:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(160deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.03) 100%)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: "20px", padding: "32px 24px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1.5px" }}>Zeitersparnis / Woche</div>
            <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "800", color: "#D4A853", fontFamily: "'Playfair Display', serif" }}>
              <AnimatedNumber value={totalSavingsHours} suffix="h" />
            </div>
          </div>
          <div style={{ background: "linear-gradient(160deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.02) 100%)", border: "1px solid rgba(76,175,80,0.2)", borderRadius: "20px", padding: "32px 24px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "8px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1.5px" }}>Ersparnis / Monat</div>
            <div style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: "800", color: "#4CAF50", fontFamily: "'Playfair Display', serif" }}>
              <AnimatedNumber value={totalSavingsEuro} suffix="€" />
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px 32px", marginBottom: "40px" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Hochgerechnet auf 12 Monate</div>
          <div style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: "800", color: "#E8E4DF", fontFamily: "'Playfair Display', serif" }}>
            <AnimatedNumber value={yearSavings} suffix="€" duration={1600} />
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>
            potenzielle Ersparnis pro Jahr
          </div>
        </div>

        {pains.length > 0 && (
          <div style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px 32px", marginBottom: "32px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.6)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Deine identifizierten Schmerzpunkte</div>
            {pains.map((pid) => {
              const p = PAIN_POINTS.find((pp) => pp.id === pid);
              return (
                <div key={pid} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "20px" }}>{p.icon}</span>
                  <span style={{ flex: 1, color: "#E8E4DF", fontSize: "14px" }}>{p.label}</span>
                  <span style={{ color: "#D4A853", fontSize: "13px", fontWeight: "600" }}>~{p.savingsHoursWeek}h/Wo</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.05) 100%)", border: "1px solid rgba(212,168,83,0.25)", borderRadius: "20px", padding: "36px 32px", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#FFF", fontFamily: "'Playfair Display', serif", marginBottom: "12px" }}>
            Bereit, dieses Potenzial zu aktivieren?
          </div>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "24px", maxWidth: "420px", margin: "0 auto 24px" }}>
            Im kostenlosen Erstgespräch zeigen wir dir konkret, welche Automatisierungen für dein Business den größten ROI bringen.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={btnPrimary}
              onClick={generatePDF}
              onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(212,168,83,0.3)"; }}
              onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              📄 Analyse als PDF speichern
            </button>
            <button
              style={{ ...btnPrimary, background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", color: "#FFF" }}
              onClick={() => window.open("https://calendly.com/daniel-helt19/audit", "_blank")}
              onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(76,175,80,0.3)"; }}
              onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              📞 Erstgespräch buchen
            </button>
          </div>
        </div>

        <div style={{ marginTop: "40px", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#D4A853", fontFamily: "'Playfair Display', serif" }}>HeltAIum</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>— AI Automation für dein Business</span>
          </div>
          {submitStatus && (
            <div style={{ marginTop: "12px", fontSize: "12px", color: submitStatus === "success" ? "rgba(76,175,80,0.6)" : submitStatus === "sending" ? "rgba(255,255,255,0.3)" : "rgba(255,100,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              {submitStatus === "sending" && "⏳ Daten werden übermittelt..."}
              {submitStatus === "success" && "✓ Deine Analyse wurde erfolgreich übermittelt"}
              {submitStatus === "error" && "Übermittlung wird wiederholt..."}
            </div>
          )}
        </div>
      </div>
    );
  };

  const steps = [renderIntro, renderContact, renderPain, renderProcesses, renderTools, renderVision, renderResult];

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#E8E4DF", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* Subtle background glow */}
      <div style={{ position: "fixed", top: "-30%", right: "-20%", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-15%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(212,168,83,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Progress bar */}
      {step > 0 && step < STEPS.length - 1 && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "16px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontWeight: "500" }}>
                Schritt {step} von {STEPS.length - 2}
              </span>
              <span style={{ fontSize: "13px", color: "#D4A853", fontWeight: "600" }}>
                {STEPS[step].label}
              </span>
            </div>
            <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(step / (STEPS.length - 2)) * 100}%`, background: "linear-gradient(90deg, #D4A853, #B8860B)", borderRadius: "2px", transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: step > 0 && step < STEPS.length - 1 ? "100px 24px 120px" : "60px 24px 120px", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}>
        {steps[step]()}
      </div>

      {/* Navigation */}
      {step > 0 && step < STEPS.length - 1 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 24px", zIndex: 100 }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={btnSecondary} onClick={() => transition(step - 1)}>
              ← Zurück
            </button>
            <button
              style={btnPrimary}
              onClick={() => transition(step + 1)}
              onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(212,168,83,0.25)"; }}
              onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
            >
              {step === STEPS.length - 2 ? "Ergebnis ansehen →" : "Weiter →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

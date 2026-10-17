"use client";
import { useEffect, useRef, useState } from "react";
import TeaLogo from "../tea-logo";

function saat(iso) {
  try { return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.stop(ctx.currentTime + 0.6);
  } catch {}
}

function caylar() {
  try {
    const u = new SpeechSynthesisUtterance("Çaylar!");
    u.lang = "tr-TR"; u.rate = 0.95; u.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

export default function Ekran() {
  const [orders, setOrders] = useState([]);
  const [alarm, setAlarm] = useState(false);
  const prevIds = useRef(new Set());
  const [sound, setSound] = useState(true);
  const alarmTimer = useRef(null);

  async function load() {
    const r = await fetch("/api/orders?bugun=1");
    const j = await r.json();
    const aktif = j.filter((o) => o.status === "bekliyor" || o.status === "hazir");
    if (sound) {
      const ids = new Set(aktif.map((o) => o.id));
      let yeni = false;
      for (const id of ids) if (!prevIds.current.has(id)) { yeni = true; break; }
      if (yeni && prevIds.current.size > 0) {
        beep();
        caylar();
        setAlarm(true);
        if (alarmTimer.current) clearTimeout(alarmTimer.current);
        alarmTimer.current = setTimeout(() => setAlarm(false), 8000);
      }
      prevIds.current = ids;
    } else {
      prevIds.current = new Set(aktif.map((o) => o.id));
    }
    // Önce hazırlanmamış (en eski üstte), sonra hazırlar (soluk, altta)
    aktif.sort((a, b) => {
      if (a.status !== b.status) return a.status === "bekliyor" ? -1 : 1;
      return a.id - b.id;
    });
    setOrders(aktif);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [sound]);

  async function setStatus(id, status) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  const bahce = orders.filter((o) => o.location === "bahce");
  const disari = orders.filter((o) => o.location === "disari");

  function Kart({ o }) {
    const hazir = o.status === "hazir";
    return (
      <div className={`order-card ${o.location} ${o.status}`} style={hazir ? { opacity: 0.55, filter: "saturate(.6)" } : {}}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <b>#{o.id} {o.name}</b>
          <b>{saat(o.createdAt)}</b>
        </div>
        <div className="big" style={{ margin: "6px 0" }}>
          {o.items.map((i) => `${i.qty} ${i.name}`).join(" • ")}
        </div>
        <div className="muted">{o.total} TL — {o.status === "bekliyor" ? "BEKLİYOR" : "HAZIR ✓"}</div>
        <div className="row" style={{ marginTop: 8 }}>
          {o.status === "bekliyor" && <button className="btn" onClick={() => setStatus(o.id, "hazir")}>Hazırlandı ✓</button>}
          {o.status === "hazir" && <button className="btn blue" onClick={() => setStatus(o.id, "bekliyor")}>Geri Al</button>}
          <button className="btn ghost" onClick={() => setStatus(o.id, "iptal")}>İptal</button>
        </div>
      </div>
    );
  }

  const bugun = new Date().toLocaleDateString("tr-TR");

  return (
    <div>
      <div className="topbar">
        <a href="/" className="btn ghost">← Geri</a>
        <TeaLogo />
        <span className="muted">SİPARİŞ AKIŞI • Bugün {bugun} • gece 12'de arşivlenir</span>
        <div className="row">
          <button className="btn ghost" onClick={() => setSound(!sound)}>{sound ? "Ses: Açık" : "Ses: Kapalı"}</button>
          <a href="/" className="muted">Menü</a>
        </div>
      </div>
      {alarm && <div className="caylar-alarm">ÇAYLARRRR! Yeni sipariş geldi</div>}
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="grid2">
          <div>
            <h2 style={{ color: "#22c55e" }}>🌿 BAHÇE ({bahce.length})</h2>
            {bahce.map((o) => <Kart key={o.id} o={o} />)}
            {!bahce.length && <div className="muted">Sipariş yok</div>}
          </div>
          <div>
            <h2 style={{ color: "#f59e0b" }}>🛵 DIŞARISI ({disari.length})</h2>
            {disari.map((o) => <Kart key={o.id} o={o} />)}
            {!disari.length && <div className="muted">Sipariş yok</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

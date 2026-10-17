"use client";
import { useEffect, useRef, useState } from "react";
import TeaLogo from "../tea-logo";

function saat(iso) {
  try { return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}

function beep(ctx) {
  if (!ctx) return;
  const play = () => {
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      o.stop(ctx.currentTime + 0.6);
    } catch {}
  };
  try {
    if (ctx.state === "suspended") ctx.resume().then(play).catch(play);
    else play();
  } catch { play(); }
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
  const [unlocked, setUnlocked] = useState(false);
  const alarmTimer = useRef(null);
  const audioRef = useRef(null);

  function getCtx() {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      return audioRef.current;
    } catch { return null; }
  }

  async function unlockAudio() {
    const ctx = getCtx();
    if (ctx && ctx.state === "suspended") { try { await ctx.resume(); } catch {} }
    setUnlocked(true);
  }

  useEffect(() => {
    const h = () => unlockAudio();
    window.addEventListener("click", h);
    window.addEventListener("keydown", h);
    window.addEventListener("touchstart", h);
    return () => {
      window.removeEventListener("click", h);
      window.removeEventListener("keydown", h);
      window.removeEventListener("touchstart", h);
    };
  }, []);

  function testSes() {
    const v = !sound;
    setSound(v);
    if (v) {
      unlockAudio();
      beep(getCtx());
      caylar();
    }
  }

  async function load() {
    const r = await fetch("/api/orders?bugun=1");
    const j = await r.json();
    const aktif = j.filter((o) => o.status === "bekliyor" || o.status === "hazir");
    const ids = new Set(aktif.map((o) => o.id));
    let yeni = false;
    for (const id of ids) if (!prevIds.current.has(id)) { yeni = true; break; }
    if (yeni && prevIds.current.size > 0) {
      setAlarm(true);
      if (alarmTimer.current) clearTimeout(alarmTimer.current);
      alarmTimer.current = setTimeout(() => setAlarm(false), 8000);
      if (sound) {
        beep(getCtx());
        caylar();
      }
    }
    prevIds.current = ids;
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
          <button className="btn ghost" onClick={testSes}>{sound ? "🔔 Ses: Açık" : "🔇 Ses: Kapalı"}</button>
          <a href="/" className="muted">Menü</a>
        </div>
      </div>
      {alarm && <div className="caylar-alarm">ÇAYLARRRR! Yeni sipariş geldi</div>}
      {!unlocked && <div className="card" style={{ borderLeft: "6px solid #f59e0b", marginTop: 8 }}>🔇 Bildirim sesi için ekrana <b>bir kez dokun</b> (tarayıcı kilidi). Sonra "🔔 Ses: Açık" düğmesine basıp test et.</div>}
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="grid2">
          <div>
            <h2 style={{ color: "#22c55e" }}>🌿 BAHÇE ({bahce.length})</h2>
            {bahce.map((o) => <Kart key={o.id} o={o} />)}
            {!bahce.length && <div className="muted">Sipariş yok</div>}
          </div>
          <div>
            <h2 style={{ color: "#f59e0b" }}>🛵 DIŞARI ({disari.length})</h2>
            {disari.map((o) => <Kart key={o.id} o={o} />)}
            {!disari.length && <div className="muted">Sipariş yok</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

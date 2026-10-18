"use client";
import { useEffect, useState } from "react";
import TeaLogo from "./tea-logo";

export default function Home() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_pw")) {
      setPw(localStorage.getItem("admin_pw"));
      setOk(true);
    }
  }, []);

  if (!ok) {
    return (
      <div className="container" style={{ maxWidth: 400 }}>
        <h1><TeaLogo size={30} /></h1>
        <p className="muted">Bu alan sadece çay ocağı yönetimine açıktır. Müşteriyseniz QR kodunuzu okutun.</p>
        <input type="password" placeholder="Şifre" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn" style={{ marginTop: 8, width: "100%" }} onClick={() => { localStorage.setItem("admin_pw", pw); setOk(true); }}>Giriş</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1><TeaLogo size={34} /></h1>
      <p className="muted">Çay ocağı sipariş ve takip sistemi</p>

      <div className="card" style={{ marginTop: 16, borderLeft: "6px solid #f59e0b" }}>
        <div className="big">🔒 Yönetim</div>
        <p className="muted">Bu linkler müşterilerle paylaşılmaz.</p>
        <div className="grid2" style={{ marginTop: 8 }}>
          <a className="bigbtn" href="/ekran">🖥️ Ocak Ekranı<small>Sipariş akışı: Bahçe / Dışarı</small></a>
          <a className="bigbtn" href="/kasa">💰 Kasa / Borç<small>Hesap kapatma, borç defteri, günlük rapor</small></a>
          <a className="bigbtn" href="/istatistik">📊 İstatistik<small>Aylık ciro, kar, dükkan ve saat kırılımı</small></a>
          <a className="bigbtn" href="/admin">⚙️ Admin<small>Ürün, masa, dükkan, QR kodları</small></a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="big">Kurulum</div>
        <ol>
          <li>/admin → fiyatları ve geliş maliyetlerini gir (şifre: cems123)</li>
          <li>/admin → QR kodlarını yazdır, masalara ve dükkanlara as</li>
          <li>/ekran → ocak bilgisayarında açık bırak (gece 12'de arşivlenir, sıfırlanır)</li>
          <li>/kasa → hesap kapatma, borç defteri, günlük rapor</li>
          <li>/istatistik → aylık ciro/kar, dükkan ve saat kırılımları</li>
        </ol>
        <button className="btn ghost" onClick={() => { localStorage.removeItem("admin_pw"); setOk(false); }}>Çıkış</button>
      </div>
    </div>
  );
}

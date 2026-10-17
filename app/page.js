import TeaLogo from "./tea-logo";

export default function Home() {
  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1><TeaLogo size={34} /></h1>
      <p className="muted">Çay ocağı sipariş ve takip sistemi</p>

      <div className="card" style={{ marginTop: 16, borderLeft: "6px solid #22c55e" }}>
        <div className="big">📱 Müşteri Linki</div>
        <p className="muted">Müşteriler ve dükkanlar QR kodla bu sayfaya gelir, sipariş verir.</p>
        <div className="row nav">
          <a href="/s">Sipariş Ver (/s)</a>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12, borderLeft: "6px solid #f59e0b" }}>
        <div className="big">🔒 Admin Linkleri (sadece siz)</div>
        <p className="muted">Bu linkler müşterilerle paylaşılmaz.</p>
        <div className="row nav" style={{ marginTop: 8 }}>
          <a href="/ekran">Ocak Ekranı (/ekran)</a>
          <a href="/kasa">Kasa / Borç (/kasa)</a>
          <a href="/istatistik">İstatistik (/istatistik)</a>
          <a href="/admin">Admin — Ürün, Masa, QR (/admin)</a>
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
      </div>
    </div>
  );
}

import TeaLogo from "./tea-logo";

export default function Home() {
  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1><TeaLogo size={34} /></h1>
      <p className="muted">Çay ocağı sipariş ve takip sistemi</p>

      <a href="/s" className="card clickcard" style={{ marginTop: 16, borderLeft: "6px solid #22c55e" }}>
        <div className="big">📱 Müşteri Linki — Sipariş Ver →</div>
        <p className="muted">Müşteriler ve dükkanlar QR kodla bu sayfaya gelir, sipariş verir. Açmak için kutuya dokun.</p>
      </a>

      <div className="card" style={{ marginTop: 12, borderLeft: "6px solid #f59e0b" }}>
        <div className="big">🔒 Admin Linkleri (sadece siz)</div>
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
      </div>
    </div>
  );
}

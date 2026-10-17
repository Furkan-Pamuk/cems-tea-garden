import "./globals.css";
export const metadata = {
  title: "Cems Tea Garden",
  description: "Çay ocağı sipariş ve takip sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

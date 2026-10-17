import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Vercel gibi salt-okunur dosya sistemlerinde kayıtlar bellekte tutulur.
let memCache = null;

function seed() {
  return {
    products: [
      // Organik Çaylar
      { id: "cay", name: "Çay", price: 4, cat: "Organik Çaylar", active: true },
      { id: "cay-duble", name: "Çay Duble", price: 8, cat: "Organik Çaylar", active: true },
      { id: "melisa", name: "Melisa", price: 20, cat: "Organik Çaylar", active: true },
      { id: "organik-ada", name: "Ada (Organik)", price: 20, cat: "Organik Çaylar", active: true },
      { id: "organik-yesil", name: "Yeşil (Organik)", price: 20, cat: "Organik Çaylar", active: true },
      { id: "yayla", name: "Yayla", price: 20, cat: "Organik Çaylar", active: true },
      { id: "organik-ihlamur", name: "Ihlamur (Organik)", price: 20, cat: "Organik Çaylar", active: true },
      // Sallama Çaylar
      { id: "sallama-yesil", name: "Yeşil (Sallama)", price: 8, cat: "Sallama Çaylar", active: true },
      { id: "sallama-ihlamur", name: "Ihlamur (Sallama)", price: 8, cat: "Sallama Çaylar", active: true },
      { id: "sallama-ada", name: "Ada (Sallama)", price: 8, cat: "Sallama Çaylar", active: true },
      { id: "sallama-elma", name: "Elma (Sallama)", price: 8, cat: "Sallama Çaylar", active: true },
      { id: "sallama-kusburnu", name: "Kuşburnu (Sallama)", price: 8, cat: "Sallama Çaylar", active: true },
      // Sıcak Kahveler
      { id: "turk-kahvesi", name: "Türk Kahvesi", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "sade-nescafe", name: "Sade Nescafe", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "sutlu-nescafe", name: "Sütlü Nescafe", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "espresso", name: "Espresso", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "americano", name: "Americano", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "cappuccino", name: "Cappuccino", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "vanilyali-cappuccino", name: "Vanilyalı Cappuccino", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "mocha", name: "Mocha", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "cafe-latte", name: "Cafe Latte", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "sicak-cikolata", name: "Sıcak Çikolata", price: 10, cat: "Sıcak Kahveler", active: true },
      { id: "salep", name: "Salep", price: 15, cat: "Sıcak Kahveler", active: true },
      // Soğuk Kahveler
      { id: "buzlu-nescafe", name: "Buzlu Nescafe", price: 15, cat: "Soğuk Kahveler", active: true },
      { id: "buzlu-latte", name: "Buzlu Latte", price: 15, cat: "Soğuk Kahveler", active: true },
      { id: "buzlu-mocha", name: "Buzlu Mocha", price: 15, cat: "Soğuk Kahveler", active: true },
      { id: "buzlu-soguk-cikolata", name: "Buzlu Soğuk Çikolata", price: 15, cat: "Soğuk Kahveler", active: true },
      // Soğuk İçecekler
      { id: "su", name: "Su", price: 3, cat: "Soğuk İçecekler", active: true },
      { id: "cola", name: "Cola", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "fanta", name: "Fanta", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "sprite", name: "Sprite", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "ice-tea", name: "Ice Tea", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "limonata", name: "Limonata", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "gazoz", name: "Gazoz", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "meyve-suyu", name: "Meyve Suyu", price: 7, cat: "Soğuk İçecekler", active: true },
      { id: "ayran", name: "Ayran", price: 5, cat: "Soğuk İçecekler", active: true },
      { id: "soda", name: "Soda", price: 5, cat: "Soğuk İçecekler", active: true },
      { id: "redbull", name: "Redbull", price: 10, cat: "Soğuk İçecekler", active: true },
      { id: "nescafe-xpress", name: "Nescafe Xpress", price: 10, cat: "Soğuk İçecekler", active: true },
      // Ekstralar
      { id: "tost", name: "Tost", price: 80, cat: "Ekstralar", active: true },
      { id: "kivi", name: "Kivi", price: 50, cat: "Ekstralar", active: true },
    ],
    tables: ["Bahçe-1", "Bahçe-2", "Bahçe-3", "Bahçe-4", "Bahçe-5", "Bahçe-6", "Bahçe-7", "Bahçe-8", "Bahçe-9", "Bahçe-10"],
    shops: ["Eczane", "Gözlükçü", "Arzen", "Nisa", "Bulut"],
    orders: [],
    seq: 1,
  };
}

export function readDb() {
  if (memCache) return memCache;
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const s = seed();
      fs.writeFileSync(DB_PATH, JSON.stringify(s, null, 2), "utf-8");
      memCache = s;
      return s;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(raw);
    if (!db.products) Object.assign(db, seed());
    memCache = db;
    return db;
  } catch {
    if (!memCache) memCache = seed();
    return memCache;
  }
}

export function writeDb(db) {
  memCache = db;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // salt-okunur ortam (Vercel): bellek içi devam et
  }
}

export function isAdmin(req) {
  const pw = process.env.ADMIN_PASSWORD || "cems123";
  const h = req.headers.get("x-admin-password") || "";
  return h === pw;
}

export function todayKey(d = new Date()) {
  return localKey(d.toISOString());
}

export function localKey(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return String(iso || "").slice(0, 10);
  }
}

export function orderDay(o) {
  return o.day || localKey(o.createdAt);
}

import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  const map = {};
  for (const o of db.orders || []) {
    if (o.status !== "kapandi" || o.payMethod !== "borc" || o.debtPaid) continue;
    const key = o.borrower || o.name;
    if (!map[key]) map[key] = { name: key, orders: [], total: 0 };
    map[key].orders.push(o);
    map[key].total += Number(o.total) || 0;
  }
  return NextResponse.json(Object.values(map).sort((a, b) => b.total - a.total));
}

export async function POST(req) {
  const body = await req.json();
  const borrower = String(body.borrower || "").trim();
  if (!borrower) return NextResponse.json({ error: "isim gerekli" }, { status: 400 });
  const db = readDb();
  const now = new Date().toISOString();
  for (const o of db.orders || []) {
    if (o.status === "kapandi" && o.payMethod === "borc" && !o.debtPaid && (o.borrower || o.name) === borrower) {
      o.debtPaid = true;
      o.debtPaidAt = now;
    }
  }
  writeDb(db);
  return NextResponse.json({ ok: true });
}

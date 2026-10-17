import { NextResponse } from "next/server";
import { readDb, writeDb, isAdmin } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ tables: db.tables || [], shops: db.shops || [] });
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  const body = await req.json();
  const db = readDb();
  db.tables = db.tables || [];
  db.shops = db.shops || [];
  const v = String(body.value || "").trim();
  if (!v) return NextResponse.json({ error: "değer boş" }, { status: 400 });
  if (body.action === "add-table") { if (!db.tables.includes(v)) db.tables.push(v); }
  if (body.action === "remove-table") { db.tables = db.tables.filter((x) => x !== v); }
  if (body.action === "add-shop") { if (!db.shops.includes(v)) db.shops.push(v); }
  if (body.action === "remove-shop") { db.shops = db.shops.filter((x) => x !== v); }
  writeDb(db);
  return NextResponse.json({ tables: db.tables, shops: db.shops });
}

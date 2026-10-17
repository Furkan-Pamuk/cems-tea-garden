import { NextResponse } from "next/server";
import { readDb, writeDb, isAdmin } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.products.filter((p) => p.active !== false));
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  const body = await req.json();
  const db = readDb();
  const id = (body.name || "urun").toLowerCase().replace(/[^a-z0-9çğıöşü]+/gi, "-") + "-" + Date.now();
  const p = { id, name: body.name, price: Number(body.price) || 0, cat: body.cat || "Diğer", cost: Number(body.cost) || 0, active: true };
  db.products.push(p);
  writeDb(db);
  return NextResponse.json(p);
}

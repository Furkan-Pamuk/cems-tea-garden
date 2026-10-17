import { NextResponse } from "next/server";
import { readDb, writeDb, isAdmin } from "@/lib/db";

export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  const body = await req.json();
  const db = readDb();
  const p = db.products.find((x) => x.id === params.id);
  if (!p) return NextResponse.json({ error: "bulunamadı" }, { status: 404 });
  if (body.name !== undefined) p.name = body.name;
  if (body.price !== undefined) p.price = Number(body.price);
  if (body.cat !== undefined) p.cat = body.cat;
  if (body.cost !== undefined) p.cost = Number(body.cost);
  if (body.active !== undefined) p.active = body.active;
  writeDb(db);
  return NextResponse.json(p);
}

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  const db = readDb();
  db.products = db.products.filter((x) => x.id !== params.id);
  writeDb(db);
  return NextResponse.json({ ok: true });
}

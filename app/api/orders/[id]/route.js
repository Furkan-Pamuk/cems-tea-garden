import { NextResponse } from "next/server";
import { readDb, writeDb, orderDay } from "@/lib/db";

export async function GET(req, { params }) {
  const db = readDb();
  const o = (db.orders || []).find((x) => String(x.id) === String(params.id));
  if (!o) return NextResponse.json({ error: "bulunamadı" }, { status: 404 });
  return NextResponse.json({ ...o, day: orderDay(o) });
}

export async function PATCH(req, { params }) {
  const body = await req.json();
  const db = readDb();
  const o = (db.orders || []).find((x) => String(x.id) === String(params.id));
  if (!o) return NextResponse.json({ error: "bulunamadı" }, { status: 404 });
  const allowed = ["bekliyor", "hazir", "kapandi", "iptal"];
  if (body.status && allowed.includes(body.status)) o.status = body.status;
  writeDb(db);
  return NextResponse.json(o);
}

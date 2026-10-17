import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  const orderIds = (body.orderIds || []).map(String);
  const method = body.method === "borc" ? "borc" : "nakit";
  const borrower = String(body.borrower || "").trim();
  if (!orderIds.length) return NextResponse.json({ error: "sipariş yok" }, { status: 400 });
  if (method === "borc" && !borrower) return NextResponse.json({ error: "borç ismi gerekli" }, { status: 400 });

  const db = readDb();
  const now = new Date().toISOString();
  for (const o of db.orders || []) {
    if (orderIds.includes(String(o.id))) {
      o.status = "kapandi";
      o.payMethod = method;
      o.borrower = method === "borc" ? borrower : o.name;
      o.closedAt = now;
      o.debtPaid = method === "nakit";
      o.debtPaidAt = method === "nakit" ? now : null;
    }
  }
  writeDb(db);
  return NextResponse.json({ ok: true });
}

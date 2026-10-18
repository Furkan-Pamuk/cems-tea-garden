const SB = "https://blzwhdjytwbgewenhipt.supabase.co";
const KEY = "sb_publishable_Kjlepk92uxjSOlp8H48Yig_6SWE4UE0";
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const ids = [
  "turk-kahvesi", "sade-nescafe", "sutlu-nescafe", "espresso", "americano",
  "cappuccino", "vanilyali-cappuccino", "mocha", "cafe-latte", "sicak-cikolata", "salep",
  "buzlu-nescafe", "buzlu-latte", "buzlu-mocha", "buzlu-soguk-cikolata",
  "sallama-yesil", "sallama-ihlamur", "sallama-ada", "sallama-elma", "sallama-kusburnu",
  "cay", "cay-duble", "melisa", "organik-ada", "organik-yesil", "yayla", "organik-ihlamur",
  "su", "cola", "fanta", "sprite", "ice-tea", "limonata", "gazoz", "meyve-suyu",
  "ayran", "soda", "redbull", "nescafe-xpress",
  "tost", "kivi",
];
async function main() {
  for (let i = 0; i < ids.length; i++) {
    const r = await fetch(`${SB}/rest/v1/products?id=eq.${ids[i]}`, {
      method: "PATCH", headers: H, body: JSON.stringify({ sira: i + 1 }),
    });
    if (!r.ok) { console.log("HATA", ids[i], r.status, await r.text()); process.exit(1); }
  }
  console.log("SIRA_OK", ids.length);
}
main().catch((e) => { console.error(e); process.exit(1); });

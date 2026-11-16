/**
 * 新しいしおりの行き先を、行き先の一覧（PlaceMaster）に足して結び付ける（しおりえ(制作補助2)、2026-11-16）
 * 仕様: docs/specs/20261116-spot-search-and-place-master.md B節
 * - 名前・座標・都道府県は、しおりで確かめ済みの値をそのまま使う（同じ場所は同じ点）
 * - 一覧に同じ名前（別名を含む・同じ都道府県）があり、点が同じ（6けたで一致）なら、新しく足さずに結び付ける
 * - 同じ名前があって点が違うときは、そのスポットは書き込まない（企画運営に知らせる）
 * - 無ければ新しく足して結び付ける（写真は入れない。写真の欄は別の確認の流れで足す）
 * - 昼食などの施設でない点は、設定ファイルに書かない（対象外）
 *
 * 設定ファイル（JSON）:
 *   { "itineraryId": "<完全なID>", "prefecture": "沖縄県",
 *     "spots": [ { "name": "<しおりのスポット名>", "placeName": "<一覧での名前。省略時は name>", "category": "castle", "isWideArea": false, "aliases": ["別名"] } ] }
 *   category は castle|temple|shrine|mountain|water|beach|onsen|museum|townscape|park|gourmet|craft|view|sake_brewery|other、または null（お墓など。種類を付けない）
 *   isMemorial: true … お墓・慰霊の場所（一覧のほかのお墓と同じ扱い。法務2 11/16）
 *   fixMasterPoint: "<一覧のID>" … 一覧の同じ名前の行き先の点が違うとき、その行き先の点だけを、しおりの点に直してから結び付ける（企画運営の指示があるときだけ使う）
 *
 * 使い方(admin-site): npm run prod -- npx tsx prisma/link-place-master.ts <設定ファイル> [--commit]
 * 確認モード（--commit なし）では、足す・結び付ける・止める の一覧を出すだけで、何も書き込まない
 */
import fs from "fs";
import { prisma } from "../src/lib/prisma";

type Cfg = {
  itineraryId: string;
  prefecture: string;
  spots: { name: string; placeName?: string; category: string | null; isWideArea?: boolean; isMemorial?: boolean; aliases?: string[]; fixMasterPoint?: string; positionSource?: string }[];
};
const CATS = new Set(["castle", "temple", "shrine", "mountain", "water", "beach", "onsen", "museum", "townscape", "park", "gourmet", "craft", "view", "sake_brewery", "other"]);
const s6 = (v: unknown) => (v == null ? "" : Number(String(v)).toFixed(6));

async function run() {
  const file = process.argv[2];
  if (!file || file.startsWith("--")) throw new Error("設定ファイルを指定してください");
  const COMMIT = process.argv.includes("--commit");
  const cfg: Cfg = JSON.parse(fs.readFileSync(file, "utf8"));

  const pref = await prisma.area.findFirst({ where: { name: cfg.prefecture, level: "prefecture" }, select: { id: true } });
  if (!pref) throw new Error(`都道府県が見つかりません: ${cfg.prefecture}`);
  const it = await prisma.itinerary.findUnique({
    where: { id: cfg.itineraryId },
    select: { id: true, title: true, status: true, days: { orderBy: { dayNumber: "asc" }, select: { dayNumber: true, spots: { orderBy: { orderNo: "asc" }, select: { id: true, name: true, lat: true, lng: true, placeMasterId: true } } } } },
  });
  if (!it) throw new Error(`しおりが見つかりません: ${cfg.itineraryId}`);
  console.log(`しおり ${it.id}（${it.status}）${it.title}`);
  const all = it.days.flatMap((d) => d.spots.map((s) => ({ ...s, day: d.dayNumber })));

  type Plan = { kind: "link" | "create" | "skip" | "fixlink"; spotId: string; label: string; masterId?: string; data?: any; aliases?: string[]; note: string; from?: string; lat?: string; lng?: string };
  const plans: Plan[] = [];
  for (const c of cfg.spots) {
    if (c.category !== null && !CATS.has(c.category)) throw new Error(`category が一覧にありません: ${c.name} ${c.category}`);
    const hits = all.filter((s) => s.name === c.name);
    if (hits.length !== 1) throw new Error(`しおりの中で「${c.name}」が ${hits.length} 件です（1件であること）`);
    const sp = hits[0];
    const label = `${sp.day}日目 ${sp.name}`;
    if (sp.lat == null || sp.lng == null) { plans.push({ kind: "skip", spotId: sp.id, label, note: "座標が空" }); continue; }
    if (sp.placeMasterId) { plans.push({ kind: "skip", spotId: sp.id, label, note: `すでに結び付いている ${sp.placeMasterId}` }); continue; }
    const placeName = c.placeName || c.name;
    const names = [placeName, c.name, ...(c.aliases || [])];
    const found = await prisma.placeMaster.findMany({
      where: { prefectureAreaId: pref.id, OR: [{ name: { in: names } }, { aliases: { some: { alias: { in: names } } } }] },
      select: { id: true, name: true, lat: true, lng: true, aliases: { select: { alias: true } } },
    });
    const pt = `${s6(sp.lat)},${s6(sp.lng)}`;
    if (found.length > 1) { plans.push({ kind: "skip", spotId: sp.id, label, note: `一覧に同じ名前が ${found.length} 件: ${found.map((f) => `${f.id} ${f.name} ${s6(f.lat)},${s6(f.lng)}`).join(" / ")}（企画運営に知らせる）` }); continue; }
    if (found.length === 1) {
      const f = found[0];
      const fpt = `${s6(f.lat)},${s6(f.lng)}`;
      if (fpt === pt) plans.push({ kind: "link", spotId: sp.id, label, masterId: f.id, note: `一覧の ${f.id}「${f.name}」${fpt} に結び付ける（点が同じ）` });
      else if (c.fixMasterPoint && c.fixMasterPoint === f.id) plans.push({ kind: "fixlink", spotId: sp.id, label, masterId: f.id, from: fpt, lat: s6(sp.lat), lng: s6(sp.lng), note: `一覧の ${f.id}「${f.name}」の点を ${fpt} → ${pt} に直して結び付ける（点のほかは変えない）` });
      else plans.push({ kind: "skip", spotId: sp.id, label, note: `一覧の ${f.id}「${f.name}」は点が違う（一覧 ${fpt} / しおり ${pt}）。書き込まない（企画運営に知らせる）` });
      continue;
    }
    // 名前は違うが、同じ点の行き先が一覧にないかも見る（知らせだけ）
    const near = await prisma.placeMaster.findMany({
      where: { prefectureAreaId: pref.id, lat: { gte: Number(sp.lat) - 0.002, lte: Number(sp.lat) + 0.002 }, lng: { gte: Number(sp.lng) - 0.002, lte: Number(sp.lng) + 0.002 } },
      select: { id: true, name: true, lat: true, lng: true },
    });
    plans.push({
      kind: "create", spotId: sp.id, label, aliases: c.aliases || [],
      data: { name: placeName, lat: s6(sp.lat), lng: s6(sp.lng), prefectureAreaId: pref.id, category: c.category, isWideArea: !!c.isWideArea, isMemorial: !!c.isMemorial, source: "ai_collected", positionSource: c.positionSource || "nominatim", verifiedAt: new Date(new Date().toISOString().slice(0, 10)) },
      note: `新しく足す「${placeName}」${pt} ${cfg.prefecture} ${c.category ?? "種類なし"}${c.isWideArea ? " 広い場所" : ""}${c.isMemorial ? " 慰霊・お墓(isMemorial)" : ""}${c.aliases?.length ? ` 別名:${c.aliases.join("・")}` : ""}` + (near.length ? `　※近く(約200m以内)に一覧の行き先: ${near.map((n) => `${n.name} ${s6(n.lat)},${s6(n.lng)}`).join(" / ")}` : ""),
    });
  }

  const listed = new Set(cfg.spots.map((c) => c.name));
  for (const s of all) if (!listed.has(s.name)) console.log(`  対象外 ${s.day}日目 ${s.name}`);
  for (const p of plans) console.log(`■ ${p.label}: [${p.kind === "link" ? "結び付け" : p.kind === "create" ? "追加" : p.kind === "fixlink" ? "点を直して結び付け" : "止める"}] ${p.note}`);
  console.log(`点を直して結び付け ${plans.filter((p) => p.kind === "fixlink").length}・追加 ${plans.filter((p) => p.kind === "create").length}・結び付け ${plans.filter((p) => p.kind === "link").length}・止める ${plans.filter((p) => p.kind === "skip").length}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    for (const p of plans) {
      if (p.kind === "skip") continue;
      let mid = p.masterId;
      if (p.kind === "fixlink") {
        const cur = await tx.placeMaster.findUnique({ where: { id: mid! }, select: { lat: true, lng: true } });
        if (!cur || `${s6(cur.lat)},${s6(cur.lng)}` !== p.from) throw new Error(`一覧の点がすでに変わっている: ${p.label}`);
        await tx.placeMaster.update({ where: { id: mid! }, data: { lat: p.lat, lng: p.lng } });
        console.log(`  一覧の点を直しました ${mid} ${p.from} → ${p.lat},${p.lng}`);
      }
      if (p.kind === "create") {
        const m = await tx.placeMaster.create({ data: { ...p.data, aliases: p.aliases?.length ? { create: p.aliases.map((a) => ({ alias: a })) } : undefined }, select: { id: true } });
        mid = m.id;
      }
      const r = await tx.spot.updateMany({ where: { id: p.spotId, placeMasterId: null }, data: { placeMasterId: mid } });
      if (r.count !== 1) throw new Error(`結び付けに失敗（すでに変わっている）: ${p.label}`);
      console.log(`  書き込みました ${p.label} → ${mid}`);
    }
  });
  console.log("書き込みました");
}

run()
  .catch((e) => { console.error("エラー:", e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

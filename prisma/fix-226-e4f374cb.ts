/**
 * #226 e4f374cb「祖谷のかずら橋、シラクチカズラで編まれた秘境の吊り橋プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:30 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみいただけたことでしょう」）
 * 車の旅（JR阿波池田駅の近くでレンタカーを借りて返す）:
 *   祖谷のかずら橋 9:30 → 琵琶の滝 → 大歩危峡まんなか（昼食・遊覧船）→ 道の駅大歩危 妖怪屋敷と石の博物館 → 箸蔵寺（ロープウェイ）→ 阿波池田うだつの家 16:30 → 阿波池田駅
 *   #7133c8fe（祖谷渓・落合集落 1泊2日）と重ならない。#789cfdef（大歩危の遊覧船）とは遊覧船だけ重なるので、文は別に書いた
 *   児啼爺の像・小歩危展望台・賢見神社は、OSM に名前つきの点がなく、国土地理院の住所検索も結果が出なかったので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く。ロープウェイは other
 * 本文の出典: 三好市観光 https://miyoshi-tourism.jp/spot/<番号>/ —
 *   46 祖谷のかずら橋（シラクチカズラ 重さ約6トン・長さ45m、幅2m、水面上14m・3年ごとに架け替え・国の重要有形民俗文化財・日本三奇橋・由来に諸説）／
 *   88 琵琶の滝（平家の落人が琵琶を奏でたと言い伝え・高さ約40m・虹・石段で川辺へ・かずら橋夢舞台の駐車場）／
 *   24284 大歩危峡まんなか（遊覧船 約30分・約1億年の峡谷・同じ施設にレストラン）／53 大歩危小歩危（結晶片岩・国の天然記念物と名勝）／
 *   75 道の駅大歩危 妖怪屋敷と石の博物館（世界の珍しい石・児啼爺の故郷・地元の妖怪伝承・住民の手作りの妖怪人形・9:00〜17:00）／
 *   153 箸蔵寺（天長5年に空海が金比羅神の御神託を受けて開基したといわれる・金毘羅奥の院・真言宗）／104 箸蔵山ロープウェイ（日本初の方式「フニテル」・全長950m・約4分）／
 *   145 うだつの町並み・阿波池田うだつの家たばこ資料館（たばこの集積地として発展した旧街道・幕末から明治のたばこ製造業者の旧居宅・中庭・9:00〜17:00 入館16:30）
 * 座標: OSM — かずら橋 way 258405234・大歩危峡まんなか way 132681165・道の駅大歩危 way 437443473・箸蔵寺 way 320598244（いずれも Nominatim の中心）／
 *   びわの滝 node 756335384・阿波池田うだつの家 node 1423661439（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-226-e4f374cb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e4f374cb-4d71-42af-8aff-c698e55962e2";
const DAY_ID = "8ee613a7-c90c-464c-ae90-0cf7796fa35e";
const KAZURA = "aeb6c90c-6d8a-4e88-9d11-14fe0061eaa9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "シラクチカズラで編まれた祖谷のかずら橋を渡り、平家の伝説が残る琵琶の滝へ。大歩危峡では遊覧船で峡谷をめぐり、川を眺めながら昼食に。妖怪の伝承を伝える道の駅から、ロープウェイで上る箸蔵寺、たばこで栄えた池田のうだつの町並みへとめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KAZURA, { h: 9, m: 30, stay: 50, legs: [], lat: 33.8750942, lng: 133.8354225, address: "徳島県三好市西祖谷山村善徳162-2",
    memo: "この旅は車でめぐります。JR阿波池田駅の近くでレンタカーを借りて、車で約1時間の西祖谷へ。重さ約6トンのシラクチカズラを編んで造られた、長さ45m、幅2m、水面からの高さ14mの吊り橋で、国の重要有形民俗文化財に指定され、3年ごとに架け替えられています。日本三奇橋のひとつに数えられ、平家の落人が追っ手から逃れるために切り落とせるように造ったという説や、弘法大師が村人のために架けたという説などが伝えられています。足もとの隙間から谷底が見え、橋は揺れるので、両側の綱をしっかり握って、ゆっくり渡りましょう。" }),
  cre("琵琶の滝", { h: 10, m: 25, stay: 25, legs: [{ mode: "walk", min: 5 }], lat: 33.8753034, lng: 133.8364569, address: "徳島県三好市西祖谷山村善徳",
    memo: "かずら橋から歩いて約5分。高さ約40mの滝で、昔、平家の落人が都をしのんでこの滝のそばで琵琶を奏で、心を慰め合ったことから名付けられたと言い伝えられています。天気によっては、しぶきに虹がかかることもあります。川辺へ下りる石段は滑りやすいので、足元に気をつけましょう。" }),
  cre("大歩危峡まんなか", { h: 11, m: 30, stay: 90, legs: [{ mode: "walk", min: 5 }, { mode: "car", min: 35 }], lat: 33.883966, lng: 133.7595759, address: "徳島県三好市山城町西宇1520",
    memo: "琵琶の滝から駐車場へ歩いて戻り、車で約35分の大歩危峡へ（あわせて約40分）。結晶片岩が川の流れに削られてできた峡谷で、大歩危小歩危は国の天然記念物と名勝に指定されています。ここから出る遊覧船は約30分で、エメラルドグリーンの吉野川を進みながら、両岸にそびえる岩壁を間近に眺められます。施設の中のレストランで、峡谷を眺めながら昼食にしましょう。船の上では、指示に従い、身を乗り出さないようにしましょう。" }),
  cre("道の駅大歩危 妖怪屋敷と石の博物館", { h: 13, m: 15, stay: 55, legs: [{ mode: "car", min: 15 }], lat: 33.8810783, lng: 133.7600963, address: "徳島県三好市山城町上名1553-1",
    memo: "大歩危峡まんなかから車で約15分。世界の珍しい石を集めた石の博物館と、地元に伝わる妖怪の話を紹介する妖怪屋敷を合わせた道の駅です。近くの山城町上名は、漫画にも登場する妖怪「児啼爺」の伝承が残る地とされ、館内には地元の人たちが手作りした妖怪の人形が数多く並びます。" }),
  cre("箸蔵寺", { h: 14, m: 50, stay: 45, legs: [{ mode: "car", min: 35 }, { mode: "other", min: 5 }], lat: 34.049176, lng: 133.8418271, address: "徳島県三好市池田町州津蔵谷1006",
    memo: "道の駅から車で約35分、箸蔵山ロープウェイの乗り場へ。日本で初めての方式で架けられたロープウェイで、長さ950mを約4分で山の上へ上ります（あわせて約40分）。天長5年（828年）に空海が金比羅神のお告げを受けて開いたといわれる真言宗の寺で、「こんぴら奥の院」としても知られています。境内は石段が多いので、足元に気をつけましょう。" + PRAY }),
  cre("阿波池田うだつの家", { h: 15, m: 50, stay: 40, legs: [{ mode: "other", min: 5 }, { mode: "car", min: 10 }], lat: 34.0294665, lng: 133.8089918, address: "徳島県三好市池田町マチ2465-1",
    memo: "ロープウェイで山を下り、車で約10分の池田の町なかへ（あわせて約15分）。交通の要所で、たばこの集まる地として栄えた池田の旧街道には、屋根の両端に「うだつ」を上げた古い家並みが残ります。幕末から明治にかけて栄えたたばこ製造業者の住まいを、たばこの歴史を伝える資料館として公開していて、四季の移ろう中庭も見られます。入館できる時間は公式の案内で確かめましょう。町並みには今も人が暮らしているので、静かに歩きましょう。帰りは、歩いて約5分のJR阿波池田駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== KAZURA) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "祖谷のかずら橋(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

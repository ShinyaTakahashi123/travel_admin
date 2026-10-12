/**
 * #480 e7f63845（熱海 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜13:20（來宮神社 →（車）MOA美術館 →（車）熱海城）で、移動が車、本文はガイドの語り口、大楠の「寿命が延びる」「願いが叶う」のご利益の言い方があった
 *   バスと歩き、ロープウェイでめぐり、昼は熱海駅前の商店街、午後は起雲閣と海辺の親水公園を通って熱海城で締めくくる（戻らない）
 *   來宮神社 9:10〜9:50 →（バス35分）MOA美術館 10:25〜11:40 →（バスと歩き15分）熱海駅前商店街（新規・昼食）11:55〜13:00 →（バスと歩き20分）起雲閣（新規）13:20〜14:25
 *   →（歩き15分）親水公園・ムーンテラス（新規）14:40〜15:10 →（歩きとロープウェイ15分）熱海城 15:25〜16:30
 *   閉まる時刻: MOA美術館 9:30〜16:30（入館16:00まで・木曜休館）、起雲閣 9:00〜17:00（入館16:30まで・水曜休館）、熱海城 9:00〜17:00（入場16:30まで）、ロープウェイ 9:30〜17:30。本文に時刻・曜日は書かない
 * 本文の出典: あたみニュース（熱海市観光協会）https://www.ataminews.gr.jp/spot/115 （來宮神社・熱海駅からバスで約15分）・/spot/331 （熱海駅前商店街）・/spot/114 （起雲閣）・/spot/121 （親水公園）・/spot/106 （ロープウェイ）・/spot/12 （熱海城）、
 *   來宮神社 https://kinomiya.or.jp/top/overview/ookusu/ 、MOA美術館 https://www.moaart.or.jp/event/bestcollection2026/ ・ https://www.museum.or.jp/museum/4360 （熱海駅からバス7分）
 * 座標の出典: OSM（來宮神社 way 377806606／MOA美術館 node 1421003343／平和通り名店街 way 325856210／起雲閣 node 3600159420／親水公園 node 5603023726／熱海城 way 564247122）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-480-e7f63845.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e7f63845-d62e-4ada-9896-22f9fb1d408f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "樹齢2100年をこえるとされる大楠の來宮神社から、国宝を所蔵するMOA美術館へ。熱海駅前の商店街で昼食をとり、文豪に愛された起雲閣、海辺の親水公園を歩いて、ロープウェイで熱海城へ。熱海の社とアート、海の眺めをめぐる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["来宮神社", "MOA美術館", "熱海城"].join()) throw new Error("構成が想定と違います");
  const [kinomiya, moa, castle] = day.spots;

  const order = [
    { id: kinomiya.id, data: { name: "來宮神社", visitTime: t(9, 10), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.100104, lng: 139.067877, address: "静岡県熱海市西山町43-1",
      memo: "この旅はバスと歩き、ロープウェイでめぐります。JR熱海駅から元箱根・西山方面のバスで約15分の來宮神社へ。古くから来福・縁起の神として信仰されてきた神社で、本殿の横には、国の天然記念物の大楠がそびえます。樹齢2100年をこえるとされ、幹のまわりは約24mです。" + RESPECT } },
    { id: moa.id, data: { visitTime: t(10, 25), stayDurationMin: 75, transitMode: "bus", transitDurationMin: 35, transitLine: "東海バス", lat: 35.109262, lng: 139.075335, address: "静岡県熱海市桃山町26-2",
      memo: "バスで熱海駅へ戻り、MOA美術館行きのバスで約7分。相模灘を見下ろす高台に建つ美術館で、江戸時代中期の絵師・尾形光琳の最高傑作と評される国宝「紅白梅図屏風」を所蔵しています。豊臣秀吉ゆかりの「黄金の茶室」を、資料をもとに復元した展示もあります。展示の時期と休館日は公式の案内で確かめましょう。" } },
    { create: mk({ name: "熱海駅前商店街", h: 11, m: 55, stay: 65, mode: "bus", min: 15, line: "東海バス", lat: 35.102156, lng: 139.076908, address: "静岡県熱海市田原本町",
      memo: "バスで熱海駅へ戻り、駅前の仲見世商店街と平和通り商店街へ。創業60年、70年という老舗もある小さな店が集まり、干物や温泉まんじゅう、海鮮丼などが並びます。このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "起雲閣", h: 13, m: 20, stay: 65, mode: "bus", min: 20, line: "東海バス", lat: 35.092735, lng: 139.071436, address: "静岡県熱海市昭和町4-2",
      memo: "駅前からバスで起雲閣へ。大正8年（1919年）に別荘として建てられ、「熱海の三大別荘」とたたえられた邸宅で、昭和22年（1947年）に旅館となってからは、山本有三、志賀直哉、谷崎潤一郎、太宰治などの文豪に愛されました。和風の本館と、和・中・洋の意匠を合わせた洋館、庭園を見学できます。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "親水公園・ムーンテラス", h: 14, m: 40, stay: 30, mode: "walk", min: 15, lat: 35.094188, lng: 139.075071, address: "静岡県熱海市渚町",
      memo: "起雲閣から海の方へ歩いて、親水公園へ。熱海サンビーチの南に続く海辺の公園で、姉妹都市のイタリア・サンレモ市にちなんで、地中海のリゾートをイメージして整えられました。海辺では足元や波に気をつけましょう。" }) },
    { id: castle.id, data: { visitTime: t(15, 25), stayDurationMin: 65, transitMode: "other", transitDurationMin: 15, transitLine: null, lat: 35.086378, lng: 139.078682, address: "静岡県熱海市熱海1993",
      memo: "親水公園のそばの熱海後楽園から、ロープウェイで約3分の山頂駅へ上り、歩いて約3分の熱海城へ。昭和34年（1959年）に錦ヶ浦の山の上に建てられた観光施設で、天守閣の展望台からは360度の眺めが楽しめます。館内には武家文化の資料館や浮世絵の展示もあります。熱海の社とアート、海の眺めをめぐる旅を、ここで締めくくりましょう。帰りは、ロープウェイで下りて、バスで熱海駅へ。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 來宮神社 9:10 →（バス）MOA 10:25 →（バス）駅前商店街（昼食）11:55 →（バス）起雲閣 13:20 → 親水公園 14:40 →（ロープウェイ）熱海城 15:25〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

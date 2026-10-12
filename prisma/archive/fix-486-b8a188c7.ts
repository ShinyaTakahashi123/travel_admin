/**
 * #486 b8a188c7（高梁 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜12:15（高梁基督教会堂 → 郷土資料館 →（車）松連寺）で、昼食の一言がなく、松連寺に「自害した寺」という死にかかわる言い方があった
 *   「明治の学びと祈り」に合わせ、教会堂・郷土資料館（明治の校舎）・山田方谷記念館・池上邸から、紺屋川筋（昼食・藩校有終館跡）を通って南へ、薬師院・松連寺、高梁市歴史美術館で締めくくる（戻らない）
 *   #421（備中松山城・頼久寺・石火矢町・紺屋川筋で昼食・郷土資料館・吹屋）と重なるのは、もとからある郷土資料館のほかは紺屋川筋だけ
 *   高梁基督教会堂 9:10〜9:50 →（歩き5分）高梁市郷土資料館 9:55〜10:50 →（歩き5分）山田方谷記念館（新規）10:55〜11:40 →（歩き10分）池上邸（新規）11:50〜12:35
 *   →（歩き10分）紺屋川筋（新規・昼食）12:45〜13:55 →（歩き15分）薬師院（新規）14:10〜14:35 →（歩き5分）松連寺 14:40〜15:05 →（歩き10分）高梁市歴史美術館（新規）15:15〜16:30
 *   閉まる時刻: 教会堂 9:00〜17:00（日曜の午前は見学不可）、郷土資料館 9:00〜17:00、方谷記念館 9:00〜17:00、池上邸 10:00〜16:00、歴史美術館 9:00〜17:00（入館16:30まで・火曜休館）。本文に時刻・曜日・料金は書かない
 * 本文の出典: 高梁観光情報 https://takahasikanko.or.jp/modules/spot/index.php?content_id=7 （教会堂）・content_id=6 （郷土資料館）・content_id=62 （山田方谷記念館）・content_id=5 （池上邸）・content_id=55 （紺屋川筋）・content_id=8 （薬師院・松連寺）、
 *   岡山観光WEB https://www.okayama-kanko.jp/spot/10851 （教会堂・駅から徒歩約15分）・ https://www.okayama-kanko.jp/spot/10869 （歴史美術館・駅から徒歩約10分）、
 *   高梁市 https://www.city.takahashi.lg.jp/site/takahashi-historical-museum/ （歴史美術館の住所 原田北町1203番地1）・ https://www.city.takahashi.lg.jp/site/yamada-hokoku-museum/ （方谷記念館の開館）・津山瓦版 https://www.e-tsuyama.com/report/2021/03/post-2188.html （方谷記念館の3つのテーマ）
 * 座標の出典: OSM（高梁基督教会堂 way 358203494／高梁市郷土資料館 way 498329579／観光物産館紺屋川 way 361818264（紺屋川筋の点として）／薬師院 way 361818257／松連寺 way 361818256／高梁市歴史美術館 way 358203564）、
 *   山田方谷記念館・池上邸は OSM に点がないので地理院の住所検索（向町21番地 34.795757,133.618073／本町94番地 34.799427,133.616501）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-486-b8a188c7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b8a188c7-b6f1-4e8c-845f-036e2dd25b9b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";

const DESCRIPTION = "岡山県でいちばん古いとされる教会堂から、明治の木造校舎の郷土資料館、山田方谷記念館、商家の池上邸へ。桜と柳の紺屋川筋で昼食をとり、石段と石垣の薬師院・松連寺を通って、高梁市歴史美術館で締めくくる、明治の学びと祈りの城下町を歩く日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["高梁基督教会堂", "高梁市郷土資料館", "松連寺"].join()) throw new Error("構成が想定と違います");
  const [church, museum, shoren] = day.spots;

  const order = [
    { id: church.id, data: { visitTime: t(9, 10), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.796222, lng: 133.6178014, address: "岡山県高梁市柿木町26",
      memo: "この旅は歩きでめぐります。JR備中高梁駅から歩いて約15分、紺屋川のほとりの高梁基督教会堂へ。明治22年（1889年）に建てられた、今残る岡山県の教会堂ではいちばん古いとされる建物で、明治の洋風建築としても貴重なものとして、県の史跡に指定されています。高梁でのキリスト教の布教は明治12年に始まり、翌年に新島襄が訪れてから大きく広がり、信者の浄財によってこの教会堂が建てられました。今も礼拝が続く場所ですので、静かに、敬意をもって見学してください。礼拝や行事の時間は、見学を控えましょう。" } },
    { id: museum.id, data: { visitTime: t(9, 55), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.7946902, lng: 133.6178613, address: "岡山県高梁市向町21",
      memo: "教会堂から歩いて、高梁市郷土資料館へ。明治37年（1904年）に建てられた旧高梁小学校の本館で、洋風の木造建築です。2階の格天井は、節のないモミの柾目の材を使ったもので、日露戦争のさなかに造られました。館内には、約3,000点の民具が展示されています。" } },
    { create: mk({ name: "山田方谷記念館", h: 10, m: 55, stay: 45, mode: "walk", min: 5, lat: 34.795757, lng: 133.618073, address: "岡山県高梁市向町21",
      memo: "郷土資料館と同じ向町の山田方谷記念館へ。備中松山藩の藩政改革で、財政が傾いた藩を立て直し、教育者として三島中洲や川田甕江などを育てた郷土の偉人・山田方谷を紹介する施設で、平成31年（2019年）に旧高梁中央図書館を生かして開館しました。「儒学者への道」「藩政改革」「教育への情熱」の3つのテーマで、資料やパネルを展示しています。" }) },
    { create: mk({ name: "高梁市商家資料館 池上邸", h: 11, m: 50, stay: 45, mode: "walk", min: 10, lat: 34.799427, lng: 133.616501, address: "岡山県高梁市本町94",
      memo: "北へ歩いて、古い商家の並ぶ本町通りの池上邸へ。江戸時代の享保年間に小間物屋を始め、両替商や高瀬舟の船主などを経て、醤油の製造で財をなした豪商の家です。" + TOWN }) },
    { create: mk({ name: "紺屋川筋", h: 12, m: 45, stay: 70, mode: "walk", min: 10, lat: 34.7967574, lng: 133.6162032, address: "岡山県高梁市鍜冶町",
      memo: "池上邸から南へ歩いて、紺屋川筋へ。高梁川に流れ込む紺屋川は、かつて備中松山城の外堀の役割を果たした川で、桜と柳の並木道が続き、「日本の道100選」にも選ばれています。川のほとりには、藩校・有終館の跡もあります。このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "薬師院", h: 14, m: 10, stay: 25, mode: "walk", min: 15, lat: 34.7893031, lng: 133.6200014, address: "岡山県高梁市上谷町",
      memo: "紺屋川筋から南へ歩いて、石段の上に建つ薬師院へ。昭和58年に映画「男はつらいよ」のロケが行われたことで知られる寺です。石段では足元に気をつけましょう。" + RESPECT }) },
    { id: shoren.id, data: { visitTime: t(14, 40), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.7887982, lng: 133.6199733, address: "岡山県高梁市上谷町4102",
      memo: "薬師院のとなりの松連寺へ。城の砦として築かれたことを物語る、城郭そのままの高い石垣が残る寺です。" + RESPECT } },
    { create: mk({ name: "高梁市歴史美術館", h: 15, m: 15, stay: 75, mode: "walk", min: 10, lat: 34.7853376, lng: 133.6148249, address: "岡山県高梁市原田北町1203-1",
      memo: "松連寺から駅の方へ歩いて、高梁市文化交流館の2階にある高梁市歴史美術館へ。歴史展示室では、戦国時代から江戸時代の終わりまでの、備中松山城にかかわる歴史を紹介し、特別展や企画展では、高梁の歴史や芸術家の作品を紹介しています。休館日は公式の案内で確かめましょう。明治の学びと祈りの町をめぐる旅を、ここで締めくくりましょう。帰りは、歩いて約10分の備中高梁駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 教会堂 9:10 → 郷土資料館 9:55 → 方谷記念館 10:55 → 池上邸 11:50 → 紺屋川筋（昼食）12:45 → 薬師院 14:10 → 松連寺 14:40 → 歴史美術館 15:15〜16:30");
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

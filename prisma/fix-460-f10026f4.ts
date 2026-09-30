/**
 * #460 f10026f4（筑波山 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜12:00（筑波山神社 →（車）ロープウェイ 90分）。筑波山ケーブルカーは今、運転休止中（公式）なので使わない
 *   ロープウェイで上り、女体山 → 男体山 → 御幸ヶ原（昼食）→ 御幸ヶ原コースを歩いて下り、筑波山神社へ（同じ道を戻らない）。午後はバスでつくば駅へ戻り、つくばエキスポセンター
 *   筑波山ロープウェイ 9:30〜9:50 →（歩き10分）女体山御本殿（新規）10:00〜10:25 →（御幸ヶ原を通って歩き25分）男体山御本殿（新規）10:50〜11:20
 *   →（歩き10分）御幸ヶ原（新規・昼食）11:30〜12:30 →（御幸ヶ原コースを下って約70分）筑波山神社 13:40〜14:25 →（シャトルバス45分）つくばエキスポセンター（新規）15:10〜16:30
 *   閉まる時刻: ロープウェイ 9:20〜17:00、エキスポセンター 9:50〜17:00（入館16:30まで・月曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: 筑波山ケーブルカー&ロープウェイ https://mt-tsukuba.com/ 、つくば市 https://www.city.tsukuba.lg.jp/soshikikarasagasu/keizaibukankosuishinka/gyomuannai/3/3/1001419.html （シャトルバスの所要時間）、
 *   つくば観光コンベンション協会 https://ttca.jp/tourisminfo/mttsukuba/登山コース案内/ 、筑波山神社 https://tsukubasanjinja.jp/history/ ・/keidai/ 、
 *   つくばエキスポセンター https://www.expocenter.or.jp/information/access/ ・/information/opening/ 、観光いばらき https://www.ibarakiguide.jp/spot.php?mode=detail&code=779
 * 座標の出典: OSM（ロープウェイ つつじヶ丘駅 node 389746306／筑波山神社女体山御本殿 way 577718534／筑波山神社男体山御本殿 node 4195452993／御幸ヶ原 way 92831986／
 *   筑波山神社 way 1123456494／つくばエキスポセンター way 382222852）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-460-f10026f4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f10026f4-2dda-43fa-84f9-6b2c5654e616";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "「西の富士、東の筑波」と称される筑波山へ。ロープウェイで上り、女体山と男体山の山頂の御本殿にお参りして、御幸ヶ原で昼食。御幸ヶ原コースを歩いて下り、ふもとの筑波山神社へ。午後はつくば駅に戻って、科学館のつくばエキスポセンターを楽しむ日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["筑波山神社", "筑波山ロープウェイ"].join()) throw new Error("構成が想定と違います");
  const [jinja, rope] = day.spots;

  const order = [
    { id: rope.id, data: { visitTime: t(9, 30), stayDurationMin: 20, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.219807, lng: 140.118879, address: "茨城県つくば市筑波（つつじヶ丘駅）",
      memo: "この旅はバスとロープウェイ、歩きでめぐります。つくばエクスプレスのつくば駅・つくばセンターから筑波山シャトルバスで約50分のつつじヶ丘へ。筑波山ロープウェイで、標高840mの女体山駅へ上ります。悪天候のときは運転を休むことがあるので、公式の案内で確かめましょう。" } },
    { create: mk({ name: "女体山御本殿", h: 10, m: 0, stay: 25, mode: "walk", min: 10, lat: 36.225472, lng: 140.106641, address: "茨城県つくば市筑波（女体山山頂）",
      memo: "女体山駅から歩いて、標高877mの女体山の山頂へ。筑波山神社の御本殿のひとつで、筑波女大神（伊弉冊尊）をまつっています。" + RESPECT + "山頂は岩場なので、足元に十分気をつけましょう。" }) },
    { create: mk({ name: "男体山御本殿", h: 10, m: 50, stay: 30, mode: "walk", min: 25, lat: 36.22578, lng: 140.098359, address: "茨城県つくば市筑波（男体山山頂）",
      memo: "女体山から尾根の道を歩き、御幸ヶ原を通って標高871mの男体山の山頂へ。筑波山神社の御本殿のひとつで、筑波男大神（伊弉諾尊）をまつっています。" + RESPECT + "山道は岩や木の根が多いので、歩きやすい靴で足元に気をつけましょう。" }) },
    { create: mk({ name: "御幸ヶ原", h: 11, m: 30, stay: 60, mode: "walk", min: 10, lat: 36.226016, lng: 140.100869, address: "茨城県つくば市筑波",
      memo: "男体山から少し下って、男体山と女体山の間の御幸ヶ原へ。二神が常に御幸（往来）することから、この名がついたといわれます。このあたりで昼食にしましょう。" }) },
    { id: jinja.id, data: { visitTime: t(13, 40), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 70, transitLine: null, lat: 36.213116, lng: 140.101265, address: "茨城県つくば市筑波",
      memo: "御幸ヶ原から、ケーブルカーの線路に沿って続く御幸ヶ原コースを歩いて下ります（下りで約70分。樹齢数百年の杉の巨木が並ぶ道で、滑りやすいところもあるので、歩きやすい靴で足元に気をつけましょう）。ふもとの筑波山神社は、三千年以上の信仰の歴史を持つといわれる霊峰・筑波山を御神体と仰ぐ神社で、山の中腹の拝殿から山上の境内を拝む古い信仰の形を今に伝えています。拝殿と随神門は、寛永10年に3代将軍・徳川家光が寄進したもので、随神門は文化8年に再建されました。奈良時代の『万葉集』には、筑波の歌が25首載せられています。" + RESPECT } },
    { create: mk({ name: "つくばエキスポセンター", h: 15, m: 15, stay: 75, mode: "bus", min: 45, line: "筑波山シャトルバス", lat: 36.086623, lng: 140.110575, address: "茨城県つくば市吾妻2-9",
      memo: "筑波山神社入口から筑波山シャトルバスでつくばセンターへ戻り、つくば駅のA2出口から歩いて約5分のつくばエキスポセンターへ。科学技術を見て・触れて・楽しめる科学館で、科学の不思議を体験できる展示や、世界最大級とされるプラネタリウムがあります。休館日は公式の案内で確かめましょう。筑波山の山頂から科学の街までめぐる旅を、ここで締めくくりましょう。帰りは、つくば駅からつくばエクスプレスで。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: ロープウェイ 9:30 → 女体山 10:00 → 男体山 10:50 → 御幸ヶ原（昼食）11:30 →（下山70分）筑波山神社 13:40 →（バス）エキスポセンター 15:10〜16:30");
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

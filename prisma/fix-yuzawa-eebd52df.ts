/**
 * eebd52df(雪国館と川端康成ゆかりの地)の組み直し(2026-11-05、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない)。企画運営・法務の判断(11/05 19時台〜20時)。
 * - 最後の行き先 CoCoLo湯沢(駅の中の商業施設)を外し、湯沢町の共同浴場「山の湯」にする。出典は湯沢町公式
 *   https://www.town.yuzawa.lg.jp/soshikikarasagasu/kikkakusangyoukankoubu/kankyonorinka/9/2/1/1016.html 、
 *   住所「湯沢町湯沢930」は外湯めぐり https://yuzawaonsen.com/?page_id=62 (町のページの関連リンク)。
 *   点は OSM に山の湯の点がないため、地理院の住所検索「新潟県湯沢町湯沢930番地」36.942539,138.798218(番地の点の例外)。
 * - 湯沢高原パノラマパークは 160→100分。展望地として書き直す(344行の展望地の例外。料金・店・遊具にふれない)。
 *   ジップライン・マウンテンゴーカート・食事処・滞在の中の昼食の文を外す。出典は湯沢町公式
 *   https://www.town.yuzawa.lg.jp/soshikikarasagasu/kikkakusangyoukankoubu/kankyonorinka/9/2/2/1017.html
 * - 昼食は別の行き先「湯沢温泉線のあたりで昼食」(通りの線「湯沢温泉線」way27400608 の Nominatim の中心 36.943675,138.802375。
 *   山の上は店の点だけで、まわりにバス停・案内板もないため、380行の順で通り)
 * - 区間(routing.openstreetmap.de routed-foot): 大杉→昼食 447.5秒で歩8、昼食→山麓駅 417.8秒で歩7、山麓駅→山の湯 760.0秒で歩13
 *   (ロープウェイの下りは上りと同じ other10)、帰り 山の湯→越後湯沢駅 1114.0秒で歩19。雪国館→主水公園 233.6秒(歩5)・主水公園→大杉 1070.2秒(歩20)はそのまま
 * - 時刻: 滞在を延ばさず、足りない20分は1か所目を 9:00→9:20 にして合わせる(383行②)。
 *   雪国館 9:20・70、主水公園 10:35・15、大杉 11:10・40、昼食 11:58・40、ロープウェイ 12:45・15、パノラマパーク 13:10・100、山の湯 15:13・80 → 16:33
 * - 季節から冬を外す(主水公園は冬に入れず、パノラマパークは冬はスキー場で、この組み方では冬に回れない。企画運営 11/05)
 * - 説明文の最後を、山の湯で締めくくる形に。CoCoLo湯沢のスポットは外す(写真なし)。写真2枚(雪国館・パノラマパーク)はそのまま
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-yuzawa-eebd52df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "eebd52df";
const DAY_ID = "86882543-8f41-4ed0-9208-5a3ec60844dd";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const YUKIGUNI = "2fec9aa7-9566-4cc6-9d33-2164eba6e944";
const MONDO = "402c16aa-ee5f-49e0-a526-8c77df3a52cf";
const OSUGI = "9ceba5a9-6267-4125-9edb-9ce11f3e35d2";
const ROPEWAY = "4a159eac-2432-47ab-8c71-8ddd59b8c0d7";
const PARK = "115e3d7a-8a48-4804-b708-71f0eb0bc3ca";
const COCOLO = "e11a53e6-26e7-48f3-ba76-5f6ce5fba2f6"; // 外す
const EXPECT: [string, string][] = [
  [YUKIGUNI, "雪国館"], [MONDO, "主水公園（雪国の碑）"], [OSUGI, "諏訪社の大杉"], [ROPEWAY, "湯沢高原ロープウェイ"], [PARK, "湯沢高原パノラマパーク"], [COCOLO, "CoCoLo湯沢"],
];
const PHOTOS_EXPECT = ["50b93e32-40bb-40d8-a82b-588f37028b94", "d1cf0e21-6e06-4d08-aaa9-2070d050a2d2"].sort();

const DESC_FROM = "最後は駅の中の店で地酒やお米のお土産を選ぶ日帰りプランです。";
const DESC_TO = "最後は康成も入ったといわれる共同浴場「山の湯」で旅を締めくくる日帰りプランです。";
const ROPE_FROM = "諏訪社から歩いて約15分、";
const ROPE_TO = "湯沢温泉線のあたりから歩いておよそ7分、";
const SEASONS_OLD = ["spring", "summer", "autumn", "winter"];
const SEASONS_NEW = ["spring", "summer", "autumn"];

const M = {
  lunch:
    "諏訪社の大杉から歩いておよそ8分、湯沢温泉線のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ7分、湯沢高原ロープウェイの山麓駅へ向かいましょう。",
  park:
    "ロープウェイでおよそ7分、山頂駅を出ると、湯沢高原パノラマパークの高原が広がります。高原の「アルプの里」には1,000種類もの高山植物が育つとされ、2,500メートル級の高い山の自然を再現した岩のお花畑「ロックガーデン」では、めずらしい高山植物を見ながら歩けます。眼下には湯沢の町と越後の山並みが広がります。冬は一面の銀世界となり、スキー場になります。山の上は町より気温が低いので、上着を持って行きましょう。この後は、ロープウェイで山麓駅へ下り、歩いておよそ13分、山の湯へ向かいましょう。",
  yamanoyu:
    "湯沢高原パノラマパークからロープウェイで山麓駅へ下り、歩いておよそ13分、山の湯に着きます。越後湯沢でいちばん歴史があるといわれる共同浴場で、川端康成が小説『雪国』を書いた旅館の近くにあり、康成自身も入ったといわれています。湯船は小さく、5、6人でいっぱいになるほどですが、昔ながらの湯の風情を味わえます。地元の人も使う浴場ですので、静かに、決まりを守って入りましょう。営業は午前10時から午後9時までで、定休日は火曜日です。休みの日と時間は、公式の案内で確かめましょう。旅を締めくくったら、越後湯沢駅までは歩いておよそ19分です。",
};

const count = (s: string, sub: string) => s.split(sub).length - 1;

async function main() {
  const rows: { id: string }[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like $1`, `${ITIN_ID}%`);
  if (rows.length !== 1) throw new Error("しおりが1本に決まりません");
  const it = await prisma.itinerary.findUnique({ where: { id: rows[0].id }, select: { id: true, description: true, seasons: true } });
  if (!it || count(it.description ?? "", DESC_FROM) !== 1) throw new Error("説明文が想定と違います");
  if (JSON.stringify(it.seasons) !== JSON.stringify(SEASONS_OLD)) throw new Error(`季節が想定と違います ${it.seasons}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" }, select: { id: true, name: true, memo: true, day: { select: { itineraryId: true } } } });
  if (JSON.stringify(spots.map((s) => [s.id, s.name])) !== JSON.stringify(EXPECT)) throw new Error(`スポットが想定と違います: ${spots.map((s) => s.name).join(",")}`);
  if (spots[0].day.itineraryId !== it.id) throw new Error("日がしおりと合いません");
  const rope = spots.find((s) => s.id === ROPEWAY)!;
  if (count(rope.memo ?? "", ROPE_FROM) !== 1) throw new Error("ロープウェイの書き出しが想定と違います");
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います ${photos.map((p) => p.id)}`);
  if (photos.some((p) => p.spotId === COCOLO)) throw new Error("外すスポットに写真があります");

  const descNew = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  const ropeMemo = (rope.memo ?? "").replace(ROPE_FROM, ROPE_TO);
  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "雪国館(9:00→9:20)", item: { id: YUKIGUNI, data: { visitTime: T(9, 20), stayDurationMin: 70, transitLegs: { deleteMany: {} } } } },
    { label: "主水公園(時刻だけ)", item: { id: MONDO, data: { visitTime: T(10, 35), stayDurationMin: 15, transitLegs: L(["walk", 5]) } } },
    { label: "諏訪社の大杉(時刻だけ)", item: { id: OSUGI, data: { visitTime: T(11, 10), stayDurationMin: 40, transitLegs: L(["walk", 20]) } } },
    {
      label: "湯沢温泉線のあたりで昼食(新規。通り way27400608)",
      item: { create: { name: "湯沢温泉線のあたりで昼食", lat: "36.943675", lng: "138.802375", visitTime: T(11, 58), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["walk", 8]) } },
    },
    { label: "湯沢高原ロープウェイ(歩15→歩7、書き出しを直す)", item: { id: ROPEWAY, data: { visitTime: T(12, 45), stayDurationMin: 15, memo: ropeMemo, transitLegs: L(["walk", 7]) } } },
    { label: "湯沢高原パノラマパーク(160→100、展望地として書き直し)", item: { id: PARK, data: { visitTime: T(13, 10), stayDurationMin: 100, memo: M.park, transitLegs: L(["other", 10]) } } },
    {
      label: "山の湯(新規。地理院 湯沢930番地)",
      item: { create: { name: "山の湯", address: "新潟県南魚沼郡湯沢町湯沢930", lat: "36.942539", lng: "138.798218", visitTime: T(15, 13), stayDurationMin: 80, memo: M.yamanoyu, transitLegs: C(["other", 10], ["walk", 13]) } },
    },
  ];

  console.log(`説明文: …${DESC_FROM}\n  → …${DESC_TO}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}\n`);
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${label}\n  着 ${hm(d.visitTime as Date)}／滞在 ${d.stayDurationMin}／区間 ${ls}${d.lat ? `／点 ${d.lat},${d.lng}` : ""}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
  }
  console.log("■ [外す] CoCoLo湯沢\n\n  終わり 山の湯 15:13+80=16:33(16:30〜17:00)。帰り 越後湯沢駅まで歩いておよそ19分");
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: it.id }, data: { description: descNew, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [COCOLO] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

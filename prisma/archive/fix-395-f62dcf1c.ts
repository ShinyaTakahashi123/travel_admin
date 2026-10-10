/**
 * チェックリスト #395 f62dcf1c「千秋公園と秋田県立美術館、定番の秋田市内さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 千秋公園 → 佐竹史料館 → 秋田県立美術館 → エリアなかいち（昼食）→ 赤れんが郷土館 → ねぶり流し館 → 旧金子家住宅 → 秋田市民市場（8か所 09:00〜16:35）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、出典で確かめられない記述もあったので書き直す）
 * 座標の出典: Nominatim（千秋公園 leisure=park 39.7215481,140.1235423／秋田市立佐竹史料館 39.7198614,140.1247989／秋田県立美術館 39.7174373,140.1215722／
 *   なかいち秋田銘品館（なかいちの商業棟）39.7168084,140.1215640／赤れんが郷土館 39.7167230,140.1158653／秋田市民俗芸能伝承館 39.7203611,140.1169722／
 *   旧金子家住宅 39.7202325,140.1169844／秋田市民市場 39.7146652,140.1257453）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-395-f62dcf1c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f62dcf1c-c574-4658-8654-5492cbca334e";
const DAY1_ID = "89a85ce2-70ed-4e5b-8b91-066a8a4880b2";
const SENSHU_ID = "c548bc2f-a34f-4dc3-90a0-871b20126ba5";
const MUSEUM_ID = "c647b09d-388d-4cd9-a53d-26bd6d60e70d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "佐竹氏の久保田城の跡の千秋公園と佐竹史料館で秋田藩の歴史にふれ、藤田嗣治の大壁画「秋田の行事」のある秋田県立美術館へ。午後は明治の赤れんがの銀行建築や、竿燈を手に持って体験できるねぶり流し館、江戸時代の町家をめぐり、最後は駅近くの市場で秋田の味を探す、秋田市内の歩いてまわる日帰りプランです。";

const MEMO_SENSHU =
  "関ヶ原の戦いのあと秋田に移った藩主・佐竹義宣が、神明山と呼ばれたこの地に築いた久保田城の跡の公園です。城内には8つの御隅櫓があったといわれ、そのうち本丸の北西の隅にあった櫓が、市制100周年を記念して復元されました。見張り場と武器庫の役目をもっていた櫓で、上に加えられた展望室からは秋田の市内を見渡せます。堀や緑の中を歩いて、城の跡の雰囲気を味わいましょう。御隅櫓は冬の間は閉まっているので、公式の案内で確かめてから訪れましょう。";

const MEMO_MUSEUM =
  "佐竹史料館から歩いて約10分、千秋公園の向かいにある美術館です。建築家・安藤忠雄の設計で2013年に開館し、建物そのものも見どころです。いちばんの見どころは、画家・藤田嗣治が1937年に描いた大壁画「秋田の行事」で、秋田の祭りや暮らしが大きな画面いっぱいに描かれています。藤田を支えた秋田の資産家・平野政吉ゆかりの作品も伝わります。休館日は公式の案内で確かめてから訪れましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: "walk", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const SATAKE: NewSpot = {
  name: "秋田市立佐竹史料館", h: 10, m: 5, stay: 40, dur: 5, lat: 39.719861, lng: 140.124799, address: "秋田県秋田市千秋公園1-4",
  memo:
    "千秋公園の中にある史料館です。秋田藩主の佐竹氏と秋田藩にかかわる大切な資料を集めて紹介し、関ヶ原の戦いのあとに秋田へ移り、神明山に新しい城を築いた佐竹義宣から続く藩政の時代を伝えています。1990年に開館し、2025年に新しい建物でリニューアルオープンしました。2階には公園を見渡せるデッキもあります。休館日は公式の案内で確かめてから訪れましょう。",
};

const AFTER: NewSpot[] = [
  {
    name: "エリアなかいち（昼食）", h: 12, m: 10, stay: 50, dur: 5, lat: 39.716808, lng: 140.121564, address: "秋田県秋田市中通1丁目",
    memo:
      "美術館のとなり、千秋公園に面した「エリアなかいち」は、県立美術館、にぎわい交流館、商業施設、広場からなる町の中心の一角です。商業施設には食事のできる店もあるので、ここで昼食にしましょう。",
  },
  {
    name: "秋田市立赤れんが郷土館", h: 13, m: 10, stay: 60, dur: 10, lat: 39.716723, lng: 140.115865, address: "秋田県秋田市大町3-3-21",
    memo:
      "なかいちから歩いて約10分。明治42年に着工し、明治45年（1912年）に完成した旧秋田銀行本店の建物で、赤れんがの外観が目を引きます。国の重要文化財に指定されています。新館では、郷土の歴史や民俗、工芸を紹介する展示のほか、秋田の風景や暮らしを描いた版画家・勝平得之の作品を紹介する記念館もあります。展示替えで休む日もあるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "ねぶり流し館（秋田市民俗芸能伝承館）", h: 14, m: 20, stay: 55, dur: 10, lat: 39.720361, lng: 140.116972, address: "秋田県秋田市大町1丁目",
    memo:
      "赤れんが郷土館から歩いて約10分。竿燈の起源ともいわれる七夕行事「ねぶり流し」にちなむ愛称の施設で、竿燈まつりや土崎港曳山まつりなど、秋田の祭りや民俗芸能を資料や映像で紹介しています。祭りの本番で使われている竿燈に実際にふれて、演技を体験することもできます。重いので、係の人の案内に従い、まわりに気をつけて持ちましょう。",
  },
  {
    name: "旧金子家住宅", h: 15, m: 20, stay: 30, dur: 5, lat: 39.720233, lng: 140.116984, address: "秋田県秋田市大町1丁目",
    memo:
      "ねぶり流し館のとなりにある、江戸時代後期の町家の造りを残す商家の建物です。綿や麻の織物を扱っていた昭和の初めごろの店先の様子や、幕末に建てられた土蔵、火事に備えて屋根の上に置かれた天水甕などが見られます。城下町の商人の暮らしを感じてみましょう。",
  },
  {
    name: "秋田市民市場", h: 16, m: 5, stay: 30, dur: 15, lat: 39.714665, lng: 140.125745, address: "秋田県秋田市中通4-7-35",
    memo:
      "旧金子家住宅から歩いて約15分、秋田駅から歩いて約5分の市場です。地元でとれた新鮮な魚介や山菜、きのこ、果物など秋田の旬の味が並び、きりたんぽ鍋の材料や秋田の地酒も扱っています。帰りの列車の前に、お土産を選びましょう。店によって営業時間が違い、定休日もあるので、公式の案内で確かめてから訪れましょう。",
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${SENSHU_ID},${MUSEUM_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: SENSHU_ID, data: { visitTime: t(9, 0), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 39.721548, lng: 140.123542, memo: MEMO_SENSHU } },
    cre(SATAKE),
    { id: MUSEUM_ID, data: { visitTime: t(10, 55), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 39.717437, lng: 140.121572, memo: MEMO_MUSEUM } },
    ...AFTER.map(cre),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === SENSHU_ID ? "千秋公園(既存)" : "秋田県立美術館(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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

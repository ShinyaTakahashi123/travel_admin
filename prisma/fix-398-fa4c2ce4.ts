/**
 * チェックリスト #398 fa4c2ce4「四万十川源流の森と一斗俵沈下橋、清流の源をたどる1泊2日」の見直し（しおりえ(制作補助2)）
 * 車の旅。1日目: 四万十川源流点 → 道の駅 布施ヶ坂（昼食）→ 天狗高原（四国カルスト）→ 梼原町歴史民俗資料館（4か所 09:00〜16:30、梼原泊）
 * 2日目: 一斗俵沈下橋 → 岩本寺 → 久礼大正町市場（昼食）→ 高知城 → ひろめ市場（5か所 09:30〜16:30）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）
 * 源流点の座標は既存（33.4381,133.0244）が不入山より約4km西にずれていたので、OSMの「四万十川源流之碑」（遊歩道の入口）に直す
 * 座標の出典: OSM/Overpass（四万十川源流之碑 33.441435,133.072300）、Nominatim（道の駅 布施ヶ坂 33.4267480,133.0998930／檮原町立歴史民俗資料館 33.3913130,132.9271270／
 *   岩本寺 landuse=religious 33.2081737,133.1346673／久礼大正町市場 33.3290738,133.2306964／高知城 33.5606910,133.5314588／ひろめ市場 33.5604480,133.5356877）、
 *   国土地理院（天狗高原 33.4819391,133.0156088／一斗俵沈下橋 33.2847618,133.1098887＝既存と同じ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-398-fa4c2ce4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fa4c2ce4-3769-458a-888f-3212199fd34a";
const DAY1_ID = "e8ba5b51-2071-4a25-a3be-a1243d205ca6";
const DAY2_ID = "4c5d41e1-bda1-451d-b35c-c62aa0a35464";
const GENRYU_ID = "6960109f-1c30-497b-b1af-081625b8d7d6";
const ITTOHYO_ID = "f20d8910-fe5b-4011-a24f-0c72877c5264";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "車で四万十川の源流点を訪ね、森の中の遊歩道を歩いて清流の始まりを見に行く1泊2日。1日目は四国カルストの天狗高原で高原の眺めを楽しみ、梼原に泊まります。2日目は四万十川に残る古い沈下橋の一斗俵沈下橋から、窪川の札所、カツオの町・久礼の市場をめぐり、高知城とひろめ市場で旅を締めくくります。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const day1 = [
  {
    id: GENRYU_ID,
    data: {
      visitTime: t(9, 0), stayDurationMin: 90, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.441435, lng: 133.0723,
      memo:
        "津野町の不入山にある、四万十川の始まりの地点です。ここで生まれた水は、約196kmの旅をして太平洋へ注ぎます。車で行ける「四万十川源流之碑」のあたりから、森の中の遊歩道を歩いて源流点へ向かいましょう。山の中の道なので、訪れる前に道路の状況を確かめ、歩きやすい靴で、足元に気をつけて歩いてください。近くにはトイレがないので、手前の道の駅などで済ませておきましょう。",
    },
  },
  cre({
    name: "道の駅 布施ヶ坂（昼食）", h: 11, m: 5, stay: 55, mode: "car", dur: 35, lat: 33.426748, lng: 133.099893, address: "高知県高岡郡津野町船戸",
    memo:
      "源流点から車で山を下り、国道197号沿いの道の駅へ。地元の人たちが育てた新鮮な野菜や果物、津野町ならではの特産品や加工品が並び、食堂もあるので、ここで昼食にしましょう。食堂の営業時間は公式の案内で確かめてください。",
  }),
  cre({
    name: "天狗高原（四国カルスト）", h: 12, m: 45, stay: 115, mode: "car", dur: 45, lat: 33.481939, lng: 133.015609, address: "高知県高岡郡津野町",
    memo:
      "道の駅から車で山を上り、四国カルストの天狗高原へ。いちばん高い「天狗の森」は標高1485mで、ブナやヒメシャラ、アケボノツツジなどの森が広がり、森林浴の道も整えられています。空気が澄んだ日には、四国の山々を広く見渡せることもあります。冬は雪が積もるので、道路の状況とタイヤの備えを確かめてから向かいましょう。高原は町より気温が低いので、上着を持って行きましょう。",
  }),
  cre({
    name: "梼原町歴史民俗資料館", h: 15, m: 30, stay: 60, mode: "car", dur: 50, lat: 33.391313, lng: 132.927127, address: "高知県高岡郡梼原町梼原1428-1",
    memo:
      "天狗高原から車で梼原の町へ。縄文時代の前期から各時代の遺物や、町で使われてきた道具など、約6000点を展示する資料館です。山あいの町の長い歴史と暮らしにふれてみましょう。冬は開館の時間が短くなるので、公式の案内で確かめてから訪れましょう。今夜は梼原の町に泊まります。",
  }),
];

const day2 = [
  {
    id: ITTOHYO_ID,
    data: {
      visitTime: t(9, 30), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null,
      memo:
        "梼原から車で四万十町へ。昭和10年（1935年）に架けられた、四万十川に残る沈下橋の中で最も古いとされる橋で、国の登録有形文化財です。沈下橋は建てられた時代ごとに特徴があり、昔は生活の道として、今は子どもたちの川遊びの場として、流域の人々に親しまれてきました。欄干がないので、橋の上では端に寄らず、車にも気をつけて歩きましょう。",
    },
  },
  cre({
    name: "岩本寺", h: 10, m: 30, stay: 50, mode: "car", dur: 20, lat: 33.208174, lng: 133.134667, address: "高知県高岡郡四万十町茂串町",
    memo:
      "一斗俵沈下橋から車で窪川の町へ。四国八十八ヶ所霊場の第37番札所で、5体の本尊をまつっています。1976年から78年にかけて広く増築された本堂の天井には、高知県内外のプロやアマチュア約400人が描いた575枚の色とりどりの板絵が並んでいます。弘法大師にちなむ「七不思議」の言い伝えも残ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "久礼大正町市場（昼食）", h: 12, m: 0, stay: 60, mode: "car", dur: 40, lat: 33.329074, lng: 133.230696, address: "高知県高岡郡中土佐町久礼",
    memo:
      "窪川から車で海沿いの中土佐町久礼へ。100年以上の歴史をもつ、アーケードと露天の市場で、昔から町の台所として新鮮な魚介や青果が売られてきました。旦那さんが釣った魚を売る漁師のおかみさんの姿も見られ、カツオ好きの高知の人が食べに来る市場としても知られています。ここで昼食にしましょう。店によって営業時間と定休日が違うので、公式の案内で確かめてください。",
  }),
  cre({
    name: "高知城", h: 14, m: 10, stay: 90, mode: "car", dur: 70, lat: 33.560691, lng: 133.531459, address: "高知県高知市丸ノ内1丁目",
    memo:
      "久礼から車で高知市へ。土佐藩の初代藩主・山内一豊が1603年に築いた城で、今の天守は1749年に再建されたものです。天守が残る12の城の一つで、本丸御殿が天守につながる形で残るのは高知城だけといわれます。天守や本丸御殿、追手門など15棟が国の重要文化財に指定されています。天守の階段は急なので、手すりを持ってゆっくり上り下りしましょう。",
  }),
  cre({
    name: "ひろめ市場", h: 15, m: 50, stay: 40, mode: "walk", dur: 10, lat: 33.560448, lng: 133.535688, address: "高知県高知市帯屋町2-3-1",
    memo:
      "高知城から歩いて約10分。土佐藩の家老の屋敷跡の近くにあり、屋敷がなくなった明治以降も「弘人屋敷」と親しまれてきたことから名付けられた市場です。鮮魚や精肉、雑貨の店や飲食店が集まり、市場の中のテーブルで、好きな店で買ったものを持ち寄って食べるスタイルです。旅の最後に高知の味を楽しみましょう。お酒は20歳から。車を運転する人は飲まないでください。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== GENRYU_ID || days[1].spots.map((s) => s.id).join() !== ITTOHYO_ID) throw new Error("既存スポットが想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === GENRYU_ID ? "四万十川源流点(既存)" : "一斗俵沈下橋(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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

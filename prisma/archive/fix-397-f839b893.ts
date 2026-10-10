/**
 * チェックリスト #397 f839b893「大塚国際美術館、世界の名画を陶板で再現した美術館プラン」の見直し（しおりえ(制作補助2)）
 * 大塚国際美術館（館内で昼食）→ 渦の道 → 大鳴門橋架橋記念館エディ → お茶園展望台 → 千畳敷展望台（5か所 09:30〜16:30、すべて徒歩）
 * 既存の美術館はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す。住所に紛れ込んでいた「totomacho」も直す）
 * 説明文の「世界初の陶板名画美術館」「渦潮とは違う」は外し、中身（午後は鳴門公園）に合わせる
 * 座標の出典: Nominatim（大塚国際美術館 34.2325795,134.6375369／渦の道 34.2361791,134.6421065／千畳敷展望台 34.2370283,134.6424379）、
 *   OSM/Overpass（大鳴門橋架橋記念館エディ 34.234940,134.640097／お茶園休憩所 viewpoint 34.233330,134.640072）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-397-f839b893.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f839b893-522c-4fa9-b6d0-8a32a7c0dbf5";
const DAY1_ID = "ff9b1b31-db41-4275-a9f1-98d81764b2b2";
const MUSEUM_ID = "94a5d28d-4c17-440c-a330-bb4c4645dc9a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界の名画を原寸大の陶板で再現した大塚国際美術館で、約4kmの鑑賞ルートをたっぷり歩いて名画をめぐり、午後はとなりの鳴門公園へ。大鳴門橋の橋の中の遊歩道「渦の道」から鳴門海峡をのぞき、展望台から橋と海峡の眺めを楽しむ日帰りプランです。";

const MEMO_MUSEUM =
  "鳴門公園のそばにある美術館です。大塚グループの創立75周年を記念して1998年に開館し、世界25か国、190余りの美術館が所蔵する名画約1000点を、陶板で原寸大に再現して展示しています。「システィーナ・ホール」をはじめ、鑑賞ルートは約4kmにもなるので、歩きやすい靴で、時間に余裕をもってまわりましょう。館内にはレストランやカフェがあるので、昼食も館内でとれます。休館日は公式の案内で確かめてから訪れましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: "walk", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const AFTER: NewSpot[] = [
  {
    name: "渦の道（大鳴門橋遊歩道）", h: 13, m: 0, stay: 60, dur: 15, lat: 34.236179, lng: 134.642107, address: "徳島県鳴門市鳴門町",
    memo:
      "美術館から鳴門公園へ歩いて約15分。大鳴門橋の橋桁の中につくられた遊歩道で、展望室まで450m、渦の上45mの高さにあるガラス床から、真下の鳴門海峡をのぞき込めます。鳴門海峡は世界三大潮流に数えられる海峡で、渦潮で知られています。渦潮は時間によっては見られないこともあるので、公式の潮見表で見ごろの時間を確かめてから向かいましょう。ガラス床の上では、走ったり跳びはねたりしないようにしましょう。",
  },
  {
    name: "大鳴門橋架橋記念館エディ", h: 14, m: 10, stay: 60, dur: 10, lat: 34.23494, lng: 134.640097, address: "徳島県鳴門市鳴門町",
    memo:
      "渦の道から歩いて約10分。「渦」と「橋」をテーマに、学んで遊べる体験型のミュージアムです。渦の道で見た海峡と大鳴門橋のことを、ここでもう一度くわしく知ることができます。臨時に休館することもあるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "お茶園展望台", h: 15, m: 15, stay: 30, dur: 5, lat: 34.23333, lng: 134.640072, address: "徳島県鳴門市鳴門町",
    memo:
      "エディから歩いてすぐ、鳴門公園の中の展望台です。展望台には、歌川広重が鳴門のあたりから対岸の淡路島を眺めた風景を描いた「阿波鳴門之風景」の案内看板があり、絵に描かれた昔の景色と、目の前の大鳴門橋のある今の景色を見くらべることができます。",
  },
  {
    name: "千畳敷展望台", h: 15, m: 55, stay: 35, dur: 10, lat: 34.237028, lng: 134.642438, address: "徳島県鳴門市鳴門町",
    memo:
      "お茶園展望台から歩いて約10分。大鳴門橋を間近に望む展望台で、この眺めは国の名勝「鳴門」に指定されています。記念撮影にもぴったりの場所です。まわりにはみやげ物店や飲食店が集まっているので、旅の最後にお土産を選びましょう。帰りは「鳴門公園」のバス停から、路線バスでJR鳴門駅へ向かいます。",
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== MUSEUM_ID) throw new Error("構成が想定と違います");

  const order = [
    { id: MUSEUM_ID, data: { visitTime: t(9, 30), stayDurationMin: 195, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.23258, lng: 134.637537, address: "徳島県鳴門市鳴門町", memo: MEMO_MUSEUM } },
    ...AFTER.map(cre),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "大塚国際美術館(既存)" : d.name} ${String(d.memo).length}字`);
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

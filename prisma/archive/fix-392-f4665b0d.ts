/**
 * チェックリスト #392 f4665b0d「座間味島、古座間味ビーチとホエールウォッチングのプラン」の見直し（しおりえ(制作補助2)）
 * 季節は夏だけなので、企画運営の判断（案A、2026-09-29）で、冬のホエールウォッチングを中心から外し、タイトルを中身に合わせる
 * 泊港 北岸 →（高速船）座間味港 → 古座間味ビーチ → 座間味の集落（昼食）→ 高月山展望台 →（村内バス）阿真ビーチ（6か所 08:40〜16:30）
 * 最初の泊港は高速船の出港に合わせるため8:40着（例外。帰りは座間味港から夕方の高速船）
 * 既存の古座間味ビーチはIDのまま直す（座標は集落の役場のあたりだったので、OSMの浜の点に直す）
 * 座標の出典: OSM/Overpass（那覇（泊）ferry_terminal 北側 26.226125,127.682389／座間味港フェリーターミナル 26.226596,127.301984／集落「座間味」quarter 26.230039,127.300150／
 *   高月山第一展望台 26.230906,127.309447）、Nominatim（古座間味ビーチ natural=beach 26.2237461,127.3087095／阿真ビーチ natural=beach 26.2269001,127.2919696）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-392-f4665b0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f4665b0d-7529-416b-b259-398d83c1b3c1";
const DAY1_ID = "3b614918-04ca-455f-b6d7-b9505d8b69df";
const FURU_ID = "d66df421-3f2b-4a81-88fd-c5b470cab5ab";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "座間味島、ケラマブルーの2つのビーチと高月山展望台をめぐる日帰りプラン";
const DESCRIPTION =
  "那覇の泊港から高速船で慶良間諸島の座間味島へ。白い砂浜と澄んだ海の古座間味ビーチで泳ぎ、集落で昼食をとってから、高月山の展望台で島々の眺めを楽しみ、ウミガメに出会えることもある阿真ビーチへ。慶良間諸島国立公園の海を1日で味わう夏の日帰りプランです。";

const MEMO_FURU =
  "座間味港から坂道を歩いて約20分、島の東側にある座間味島を代表するビーチです。真っ白なサンゴの砂と、どこまでも透き通った青い海の対比が美しく、ミシュラン・グリーンガイド・ジャポンで2つ星を獲得しています。浅瀬から少し沖に出るとサンゴや熱帯魚が見られ、シュノーケリングも楽しめます。泳ぐときは決められた遊泳区域の中で、監視員がいるかどうか、クラゲよけのネットがあるかどうかなど、現地の案内を確かめましょう。潮が引いているときは、サンゴを守るために遊泳区域が狭くなることがあります。サンゴは生き物なので、踏んだり触ったりしないようにしましょう。日差しがとても強いので、帽子や日焼け止め、こまめな水分補給を忘れずに。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string; lat: number; lng: number; address: string; memo: string };

const BEFORE: NewSpot[] = [
  {
    name: "泊港 北岸（高速船乗り場）", h: 8, m: 40, stay: 20, mode: null, dur: null, lat: 26.226125, lng: 127.682389, address: "沖縄県那覇市前島",
    memo:
      "那覇の泊港から、座間味島へ向かう高速船に乗ります。高速船の乗り場は泊港の北岸で、旅客ターミナルビル「とまりん」から歩いて7〜8分ほど離れているので、時間に余裕をもって向かいましょう。予約は1か月前から受け付けています。天候によって欠航や時刻の変更があるので、行きと帰りの便の時刻と運航の状況は、座間味村の公式の案内で確かめてください。",
  },
  {
    name: "座間味港", h: 9, m: 50, stay: 20, mode: "other", dur: 50, lat: 26.226596, lng: 127.301984, address: "沖縄県島尻郡座間味村座間味",
    memo:
      "高速船で約50分、座間味島の玄関口の港です。慶良間諸島は2014年に国立公園に指定され、「ケラマブルー」と呼ばれる透明度の高い海や、多様なサンゴ礁が広がっています。港の近くには観光の案内所があり、村内バスの乗り場もあるので、島の地図や帰りの便を確かめてから歩き始めましょう。冬には、島のまわりの海がザトウクジラの繁殖の場所になり、ホエールウォッチングの季節を迎えます。",
  },
];

const AFTER: NewSpot[] = [
  {
    name: "座間味の集落（昼食）", h: 12, m: 50, stay: 50, mode: "walk", dur: 20, lat: 26.230039, lng: 127.30015, address: "沖縄県島尻郡座間味村座間味",
    memo:
      "古座間味ビーチから歩いて約20分、港のまわりに広がる座間味の集落です。食事のできる店があるので、ここで昼食をとり、ひと休みしましょう。集落の中は住む人の暮らしの場なので、静かに歩き、家の敷地に入ったり、人を勝手に撮ったりしないようにしましょう。",
  },
  {
    name: "高月山展望台", h: 14, m: 10, stay: 30, mode: "walk", dur: 30, lat: 26.230906, lng: 127.309447, address: "沖縄県島尻郡座間味村座間味",
    memo:
      "集落から坂道を歩いて約30分、標高137mの高月山にある展望台です。座間味の集落や古座間味ビーチ、入り江、まわりに点在する慶良間の島々を見渡せ、島の地形がよくわかります。上り坂が続くので、暑い時間は無理をせず、水分をとりながらゆっくり上りましょう。",
  },
  {
    name: "阿真ビーチ", h: 15, m: 25, stay: 65, mode: "bus", dur: 45, line: "座間味村の村内バス（座間味港→阿真。高月山から港までは徒歩約25分）",
    lat: 26.2269, lng: 127.29197, address: "沖縄県島尻郡座間味村阿真",
    memo:
      "高月山から港へ下り、村内バスで島の西側へ。遠浅で波の静かなビーチで、目の前の海は、世界的に貴重なサンゴ礁の海としてラムサール条約に登録されています。運がよければウミガメに出会えることもありますが、ウミガメを見かけても、触らない、追いかけない、近づきすぎないようにしましょう。遠浅なので、潮の満ち引きと泳ぐ時間に気をつけてください。天気が悪いときや海が荒れているときは泳げません。帰りは村内バスか歩いて約20分で座間味港へ。帰りの高速船の時刻に遅れないよう、早めに港へ向かいましょう。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== FURU_ID) throw new Error("構成が想定と違います");

  const order = [
    ...BEFORE.map(toCreate),
    { id: FURU_ID, data: { visitTime: t(10, 30), stayDurationMin: 120, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 26.223746, lng: 127.30871, memo: MEMO_FURU } },
    ...AFTER.map(toCreate),
  ];
  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "古座間味ビーチ(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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

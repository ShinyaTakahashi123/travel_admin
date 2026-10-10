/**
 * #420 550bf094 の追いの修正2（しおりえ(制作補助2)、企画運営の指摘: 1日目の黒門市場・法善寺横丁・道頓堀が84〜85分ずつで長い（決まりA）、法務: 「絆具」の一文は宣伝に近い）
 * 1日目: 花月 9:00〜9:50 →（歩き15分）今宮戎神社（新規）10:05〜10:35 →（歩き15分）道具屋筋 10:50〜11:30 →（歩き5分）黒門市場（昼食）11:35〜12:35
 *   →（歩き10分）生國魂神社（新規）12:45〜13:15 →（歩き10分）高津宮（新規）13:25〜13:50 →（歩き15分）法善寺横丁 14:05〜14:35
 *   →（歩き2分）上方浮世絵館 14:37〜15:27 →（歩き5分）道頓堀 15:32〜16:30
 *   道具屋筋の「絆具」の一文と、道頓堀の「かに道楽など」（会社名）を外す。法善寺横丁のお参りの一言を決まりの形に
 *   生國魂神社は 9:00〜17:00・年中無休（OSAKA-INFO）、高津宮は受付 9時〜17時（公式）。本文に時刻・曜日は書かない
 * 本文の出典: OSAKA-INFO https://osaka-info.jp/spot/imamiyaebisujinja/ （今宮戎神社）・https://osaka-info.jp/spot/ikutamajinjya/ （生國魂神社）、
 *   高津宮 https://kouzu.or.jp/yuisho/ ・https://kouzu.or.jp/gaiyou/
 * 座標の出典: OSM（今宮戎神社 way 447890316 34.655264,135.502306／生國魂神社 way 603542168 34.665277,135.512678／高津宮 way 1121693756 34.668853,135.513903）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-420d-550bf094.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "550bf094-cd88-4920-8866-26c35fcba842";
const DAY1_ID = "9aa06298-19c5-4656-b9eb-bc33b57ca9c6";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["なんばグランド花月", "千日前道具屋筋商店街", "黒門市場", "法善寺横丁", "上方浮世絵館", "道頓堀"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [ngk, dogu, kuro, hoz, uki, doton] = day.spots;

  const ngkMemo = rep(ngk.memo ?? "", "次は、道具の専門店が並ぶ千日前道具屋筋商店街へ向かいましょう。", "次は、南へ歩いて今宮戎神社へ向かいましょう。");
  const doguMemo = rep(
    rep(dogu.memo ?? "", "なんばグランド花月から歩いてすぐ、料理道具や食器の専門店が軒を連ねる商店街です。", "今宮戎神社から北へ歩いて、料理道具や食器の専門店が軒を連ねる千日前道具屋筋商店街へ。"),
    "料理道具の技と文化を次の世代へつなぐオリジナルブランド「絆具-TSUNAGU-」も立ち上げています。", "");
  const kuroMemo = rep(kuro.memo ?? "", "ここで昼食にしましょう。次は法善寺横丁へ向かいましょう。", "ここで昼食にしましょう。次は、東へ歩いて上町台地の生國魂神社へ向かいましょう。");
  const hozMemo = rep(
    rep(hoz.memo ?? "", "黒門市場から歩いて、石畳の路地・法善寺横丁へ。", "高津宮から坂を下って西へ歩き、石畳の路地・法善寺横丁へ。"),
    "今もお参りが続く場所なので、静かに、敬意をもってお参りしましょう。", RESPECT);
  const dotonMemo = rep(doton.memo ?? "", "かに道楽などの巨大な立体看板が並び、", "巨大な立体看板が並び、");
  if (/絆具|かに道楽/.test(doguMemo + dotonMemo)) throw new Error("消す文が残っています");
  const description = rep(it.description ?? "", "1日目はなんばグランド花月の笑いから千日前道具屋筋商店街、黒門市場、法善寺横丁、",
    "1日目はなんばグランド花月の笑いから、えべっさんの今宮戎神社、千日前道具屋筋商店街、黒門市場、上町台地の生國魂神社と高津宮、法善寺横丁、");

  const order = [
    { id: ngk.id, data: { memo: ngkMemo } },
    { create: { name: "今宮戎神社", visitTime: t(10, 5), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.655264, lng: 135.502306, address: "大阪府大阪市浪速区恵美須西",
      memo: "花月から南へ歩いて、「えべっさん」と親しまれる商売の神さま・今宮戎神社へ。推古天皇の時代に、聖徳太子が四天王寺を建てたとき、西の守り神としてお祀りしたのが始まりとされます。1月の「十日戎」は3日間にわたって行われ、たくさんの参拝客でにぎわいます。商売繁盛を願う人がお参りする神社です。" + RESPECT + "次は、北へ歩いて千日前道具屋筋商店街へ向かいましょう。" } },
    { id: dogu.id, data: { memo: doguMemo, visitTime: t(10, 50), stayDurationMin: 40, transitDurationMin: 15 } },
    { id: kuro.id, data: { memo: kuroMemo, visitTime: t(11, 35), stayDurationMin: 60, transitDurationMin: 5 } },
    { create: { name: "生國魂神社", visitTime: t(12, 45), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.665277, lng: 135.512678, address: "大阪府大阪市天王寺区生玉町",
      memo: "黒門市場から東へ歩いて、上町台地に建つ生國魂神社へ。生島神・足島神を、今の大阪城のあたりの石山崎にお祀りしたのが始まりとされる古い神社で、平安時代の延喜式にも名神大社として記されています。1580年の石山合戦で焼け、1583年に豊臣秀吉が大阪城を築くときに今の地へ移されました。本殿は「生國魂造」と呼ばれる造りです。上方落語の祖とされる米澤彦八にちなむ「彦八まつり」でも知られます。" + RESPECT + "次は、北へ歩いて高津宮へ向かいましょう。" } },
    { create: { name: "高津宮", visitTime: t(13, 25), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.668853, lng: 135.513903, address: "大阪府大阪市中央区高津1丁目",
      memo: "生國魂神社から北へ歩いて、高津宮へ。難波の地に都「高津宮」を置いた仁徳天皇をお祀りする神社で、貞観8年（866年）に、旧都の跡を探して社地を定め、社殿を築いたのが始まりと伝わります。1583年、豊臣秀吉が大阪城を築くときに今の地へ移りました。昭和20年（1945年）の戦災で社殿のほとんどが焼けましたが、戦後に再建されています。古典落語「高津の富」の舞台としても知られます。" + RESPECT + "次は、坂を下って法善寺横丁へ向かいましょう。" } },
    { id: hoz.id, data: { memo: hozMemo, visitTime: t(14, 5), stayDurationMin: 30, transitDurationMin: 15 } },
    { id: uki.id, data: { visitTime: t(14, 37), stayDurationMin: 50, transitDurationMin: 2 } },
    { id: doton.id, data: { memo: dotonMemo, visitTime: t(15, 32), stayDurationMin: 58, transitDurationMin: 5 } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`花月: …${ngkMemo.slice(-30)}`);
  console.log(`道具屋筋: ${doguMemo}`);
  console.log(`黒門: …${kuroMemo.slice(-45)}`);
  console.log(`法善寺: ${hozMemo.slice(0, 35)}…${hozMemo.slice(-55)}`);
  console.log(`道頓堀: …${dotonMemo.slice(-110)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY1_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

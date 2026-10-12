/**
 * #485 b79dfc58 の追いの直し（しおりえ(制作補助2)、企画運営 9/30 21:59・法務 9/30 21:56 の指摘）
 *   城下町プラザは中身が観光案内所・土産売り場・バス乗り場なので、帰りのバスに乗る場所として10分に（決まりA）。空いた時間に長敬寺（新規）を入れる
 *   八幡神社 15:10〜15:40 →（歩き15分）長敬寺 15:55〜16:15 →（歩き5分）城下町プラザ 16:20〜16:30
 *   長敬寺: 郡上八幡観光協会 https://www.gujohachiman.com/kanko/temples.html （1601年に遠藤慶隆が創建、東常縁の玄孫の正欽を招く）、
 *     TABITABI郡上 https://tabitabigujo.com/spots/hachiman/%E9%95%B7%E6%95%AC%E5%AF%BA/ （遠藤慶隆の菩提寺、凌霜隊、職人町742）。#36 には入っていない
 *     座標は OSM（光耀山 長敬寺 node 5599491296）
 *   説明文: 「名水百選の第1号に選ばれた宗祇水」→「名水百選の第1号として知られる宗祇水」（法務）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-485c-b79dfc58.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b79dfc58-26a7-4cbc-b1f2-b089a25ace29";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const D_FROM = "名水百選の第1号に選ばれた宗祇水から、";
const D_TO = "名水百選の第1号として知られる宗祇水から、";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true, days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const day = it.days[0];
  const names = day.spots.map((s) => s.name);
  if (names.join() !== ["宗祇水", "安養寺", "柳町", "郡上八幡博覧館", "郡上八幡旧庁舎記念館", "郡上八幡城", "八幡神社", "郡上八幡城下町プラザ"].join()) throw new Error("構成が想定と違います");
  if (!(it.description ?? "").includes(D_FROM)) throw new Error("説明文が想定と違います");
  const description = (it.description ?? "").replace(D_FROM, D_TO);
  const plaza = day.spots[7];
  const order = [
    ...day.spots.slice(0, 6).map((s) => ({ id: s.id, data: {} })),
    { id: day.spots[6].id, data: { visitTime: t(15, 10), stayDurationMin: 30 } },
    { create: { name: "長敬寺", visitTime: t(15, 55), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 35.7534791, lng: 136.9559996, address: "岐阜県郡上市八幡町職人町742",
      memo: "八幡神社から城下町へ下りて、職人町の突き当たりの長敬寺へ。慶長6年（1601年）に郡上八幡城主の遠藤慶隆が、自らの菩提寺として創建した寺です。幕末の戊辰戦争で会津藩の救援に向かった郡上藩士の「凌霜隊」は、戦いのあと、住職たちの嘆願によってこの寺に移され、謹慎ののちに釈放されたとされています。" + RESPECT } },
    { id: plaza.id, data: { visitTime: t(16, 20), stayDurationMin: 10, transitDurationMin: 5, memo: (plaza.memo ?? "").replace("八幡神社から歩いて、郡上八幡城下町プラザへ。", "長敬寺から歩いてすぐの郡上八幡城下町プラザへ。") } },
  ];
  if (!(order[8] as any).data.memo.startsWith("長敬寺から")) throw new Error("プラザの本文が想定と違います");
  console.log(`説明文: ${description}`);
  console.log("八幡神社 15:10〜15:40 → 長敬寺 15:55〜16:15 → 城下町プラザ 16:20〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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

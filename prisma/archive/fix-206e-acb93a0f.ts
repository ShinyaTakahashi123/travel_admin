/**
 * #206 acb93a0f の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営・法務の指摘）
 * 企画運営: ① たつこ像が浮木神社と同じ点だったので、OSM の生の API（bbox 140.60,39.68,140.75,39.78）で見つけた、
 *   像のすぐそばの駐車場 way 1547373509（amenity=parking、39.7135942,140.6343148）に。推定（像そのものの点は OSM にない）
 *   ② たつこ像の30分は長いので15分に。以降を15分ずつ早める（終わり 16:40）
 * 法務: ③ たつこ像に付いていた写真（Lake_Tazawa_and_Kansa-gū_20210213.jpg）は漢槎宮（浮木神社）の社殿と湖の写真なので、漢槎宮のスポットへ付け替える（表紙はそのまま）
 *   ④（任意）姫観音と姫塚公園に「静かに見学しましょう」の一言
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206e-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "cb412991-fdf1-43da-b3e7-c568905e3424";
const PHOTO_ID = "4b21cb2b-9077-4527-b12a-968ef266bfc4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const QUIET = "静かに見学しましょう。";
// [時, 分, 滞在(null=そのまま), 本文の置き換え]
const PLAN: Record<string, [number, number, number | null, [string, string][]]> = {
  田沢湖遊覧船: [9, 0, null, []],
  白浜と姫観音: [10, 10, null, [["まわりの寺の住職たちが中心となって建てたものです。", "まわりの寺の住職たちが中心となって建てたものです。" + QUIET]]],
  御座石神社: [11, 15, null, []],
  むらっこ物産館: [12, 10, null, []],
  たつこ像: [13, 15, 15, []],
  "漢槎宮（浮木神社）": [13, 35, null, []],
  思い出の潟分校: [14, 10, null, []],
  県民の森: [15, 0, null, []],
  姫塚公園: [16, 10, null, [["村の祖になったと伝えられる場所です。", "村の祖になったと伝えられる場所です。" + QUIET]]],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" }, include: { photos: true } });
  if (spots.map((s) => s.name).join() !== Object.keys(PLAN).join()) throw new Error("構成が想定と違います");
  const tatsuko = spots.find((s) => s.name === "たつこ像")!;
  const kansa = spots.find((s) => s.name === "漢槎宮（浮木神社）")!;
  const ph = tatsuko.photos.find((p) => p.id === PHOTO_ID);
  if (!ph || !String(ph.sourceUrl).includes("Kansa")) throw new Error("写真が想定と違います");
  const items = spots.map((s) => {
    const [h, m, stay, reps] = PLAN[s.name];
    let memo = s.memo ?? "";
    for (const [a, b] of reps) {
      if (!memo.includes(a)) throw new Error(`${s.name}: 本文が想定と違います`);
      memo = memo.replace(a, b);
    }
    const data: Record<string, unknown> = { visitTime: t(h, m), memo };
    if (stay !== null) data.stayDurationMin = stay;
    if (s.id === tatsuko.id) Object.assign(data, { lat: 39.7135942, lng: 140.6343148 });
    console.log(`${h}:${String(m).padStart(2, "0")} +${stay ?? s.stayDurationMin} ${s.name}`);
    return { id: s.id, data };
  });
  console.log(`写真 ${PHOTO_ID} を たつこ像 → 漢槎宮 へ`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.photo.update({ where: { id: PHOTO_ID }, data: { spotId: kansa.id } });
      await setDaySpotOrder(DAY_ID, items as never, { tx });
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

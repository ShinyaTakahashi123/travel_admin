/**
 * #200 9a719ffb の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 0.4〜0.7km の自転車の移動が10分になっていて水増しだったので、5分に（岡寺の上り坂と石舞台への1km余りは10分）
 * - 縮んだ時間は、実在の見学先「奈良県立万葉文化館」（飛鳥寺の近く）を入れて埋める。最後は飛鳥寺 16:30 にし、
 *   甘樫丘は外す（甘樫丘からでは、橿原神宮前駅の営業所が閉まる17時までに自転車を返す余裕がないため）
 *   万葉文化館の出典: 古都飛鳥保存財団 https://www.asukabito.or.jp/spot_44.html （検索結果の要約: 日本画家154人が万葉歌をテーマに描いた作品・人形やジオラマ・万葉劇場・万葉庭園・月曜休）
 *   座標: OSM node 1423058462（奈良県立万葉文化館）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-200b-9a719ffb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9a719ffb-4a30-415f-bf49-b86c4c744759";
const DAY_ID = "7d5f2694-1d2b-43cf-a992-bb96e2b8e113";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const ORDER = ["高松塚古墳", "天武・持統天皇陵", "亀石", "橘寺", "石舞台古墳", "島庄", "岡寺", "酒船石遺跡", "飛鳥寺", "甘樫丘"];

// [時, 分, 滞在, 手段, 移動分, 本文の置き換え(前→後)]
const PLAN: Record<string, [number, number, number, string | null, number | null, [string, string][]]> = {
  高松塚古墳: [9, 15, 45, null, null, []],
  "天武・持統天皇陵": [10, 5, 20, "other", 5, [["自転車で北へ約10分", "自転車で北へ約5分"]]],
  亀石: [10, 30, 15, "other", 5, [["自転車で東へ約10分", "自転車で東へ約5分"]]],
  橘寺: [10, 50, 35, "other", 5, [["自転車で東へ約10分", "自転車で東へ約5分"]]],
  石舞台古墳: [11, 35, 40, "other", 10, [["自転車で東へ約15分", "自転車で東へ約10分"]]],
  島庄: [12, 20, 55, "walk", 5, []],
  岡寺: [13, 25, 45, "other", 10, [["自転車で北へ約15分", "自転車で北へ約10分"]]],
  酒船石遺跡: [14, 15, 20, "other", 5, [["自転車で北へ約10分", "自転車で北へ約5分"]]],
  飛鳥寺: [15, 55, 35, "other", 5, [
    ["酒船石遺跡から自転車で北へ約10分。", "万葉文化館から自転車ですぐ。"],
    [RESPECT, RESPECT + "見学のあとは、自転車で約15分の近鉄橿原神宮前駅の東口にある営業所で自転車を返し、近鉄で帰りましょう。借りた営業所と別の所で返せますが、返す時間は公式の案内で確かめておきましょう。"],
  ]],
};

const MANYO = {
  name: "奈良県立万葉文化館", visitTime: t(14, 40), stayDurationMin: 70, transitMode: "other", transitDurationMin: 5, transitLine: null,
  lat: 34.47723, lng: 135.822312, address: "奈良県高市郡明日香村飛鳥10",
  memo: "酒船石遺跡から自転車で約5分。「万葉集」をテーマにした県立の文化施設です。日本画家154人が万葉の歌をテーマに描いた作品の展示室や、万葉の時代を人形やジオラマで感じられる空間、万葉劇場があり、外には万葉庭園も広がります。休館日は公式の案内で確かめましょう。",
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
  if (spots.map((s) => s.name).join() !== ORDER.join()) throw new Error(`構成が想定と違います: ${spots.map((s) => s.name).join()}`);
  const items: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const s of spots) {
    if (s.name === "甘樫丘") continue;
    const [h, m, stay, mode, min, reps] = PLAN[s.name];
    let memo = s.memo ?? "";
    for (const [a, b] of reps) {
      if (!memo.includes(a)) throw new Error(`${s.name}: 本文が想定と違います（${a}）`);
      memo = memo.replace(a, b);
    }
    items.push({ id: s.id, data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: min, memo } });
    console.log(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} +${stay} ${mode ?? "-"}/${min ?? "-"} ${s.name}`);
    if (s.name === "酒船石遺跡") {
      items.push({ create: MANYO });
      console.log(`14:40 +70 other/5 ${MANYO.name}`);
    }
  }
  const remove = spots.filter((s) => s.name === "甘樫丘").map((s) => s.id);
  console.log(`外す: 甘樫丘 ${remove.join()}`);
  console.log(`\n飛鳥寺: ${(items.find((x) => "id" in x && spots.find((s) => s.id === x.id)?.name === "飛鳥寺") as { data: { memo: string } }).data.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      const it = await tx.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
      const description = (it.description ?? "").replace("をたずね、最後は甘樫丘から飛鳥の里を見渡します。", "と、万葉集をテーマにした万葉文化館をたずねます。");
      if (description === it.description) throw new Error("説明文が想定と違います");
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
      await setDaySpotOrder(DAY_ID, items as never, { remove, tx });
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

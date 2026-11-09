/**
 * 冬の特集の追加の見直し(docs/content/20261102-winter-feature-rule-pass.md「追加の見直し」77931546)。
 * 熱田神宮(d4fc7a52)の終わりの文7か所(分がない)と、説明文の「食べ歩き」を直す。
 * 文のみ、時刻・点・滞在・移動の分数そのものは変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-round3-atsuta.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-round3-atsuta.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d4fc7a52-9a79-4c7d-b11d-f805ee857a23";

const edits: { spotId?: string; field: "memo" | "description"; find: string; replace: string; label: string }[] = [
  {
    spotId: "", // filled after spot lookup
    field: "memo",
    find: "参拝を終えたら、歩いて白鳥庭園へ向かいましょう。",
    replace: "参拝を終えたら、歩いておよそ10分、白鳥庭園へ向かいましょう。",
    label: "熱田神宮",
  },
  {
    spotId: "",
    field: "memo",
    find: "見学を終えたら、電車で大須観音へ向かいましょう。",
    replace: "見学を終えたら、電車でおよそ20分、大須観音へ向かいましょう。",
    label: "白鳥庭園",
  },
  {
    spotId: "",
    field: "memo",
    find: "見学を終えたら、歩いて三輪神社へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ7分、三輪神社へ向かいましょう。",
    label: "大須観音",
  },
  {
    spotId: "",
    field: "memo",
    find: "見学を終えたら、歩いて万松寺へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ3分、万松寺へ向かいましょう。",
    label: "三輪神社",
  },
  {
    spotId: "",
    field: "memo",
    find: "見学を終えたら、歩いて大須商店街へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ2分、大須商店街へ向かいましょう。",
    label: "万松寺",
  },
  {
    spotId: "",
    field: "memo",
    find: "お昼は大須商店街で食べ歩きを楽しみましょう。",
    replace: "お昼は大須商店街で食事をしましょう。",
    label: "大須商店街(書き出し)",
  },
  {
    spotId: "",
    field: "memo",
    find: "古着屋やアニメ・サブカルチャーの店から、食べ歩きグルメの店までが混在する、独特の活気にあふれる商店街です。",
    replace: "古着屋やアニメ・サブカルチャーの店から、飲食店までが混在する、独特の活気にあふれる商店街です。",
    label: "大須商店街(本文)",
  },
  {
    spotId: "",
    field: "memo",
    find: "お腹を満たしたら、地下鉄と徒歩で名古屋城へ向かいましょう。",
    replace: "お腹を満たしたら、地下鉄と徒歩でおよそ25分、名古屋城へ向かいましょう。",
    label: "大須商店街(閉じ)",
  },
  {
    spotId: "",
    field: "memo",
    find: "見学を終えたら、歩いて名古屋市役所本庁舎へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ10分、名古屋市役所本庁舎へ向かいましょう。",
    label: "名古屋城",
  },
];

const DESC_FIND =
  "三種の神器の一つ・草薙神剣を祀る熱田神宮や、徳川家康が築いた名古屋城をはじめ、白鳥庭園・大須観音・三輪神社・万松寺の社寺めぐりと、大須商店街の食べ歩きグルメを一日で楽しむ、名古屋の信仰と歴史を巡るプランです。";
const DESC_REPLACE =
  "三種の神器の一つ・草薙神剣を祀る熱田神宮や、徳川家康が築いた名古屋城をはじめ、白鳥庭園・大須観音・三輪神社・万松寺の社寺めぐりと、大須商店街での食事を一日で楽しむ、名古屋の信仰と歴史を巡るプランです。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } }, orderBy: { orderNo: "asc" } });
  const byOrder = new Map(spots.map((s) => [s.orderNo, s]));
  const orderByLabel: Record<string, number> = {
    "熱田神宮": 1,
    "白鳥庭園": 2,
    "大須観音": 3,
    "三輪神社": 4,
    "万松寺": 5,
    "大須商店街(書き出し)": 6,
    "大須商店街(本文)": 6,
    "大須商店街(閉じ)": 6,
    "名古屋城": 7,
  };
  for (const e of edits) {
    const orderNo = orderByLabel[e.label];
    if (!orderNo) throw new Error(`[想定と違います] ラベルに対応するorderNoがありません: ${e.label}`);
    e.spotId = byOrder.get(orderNo)!.id;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const e of edits) {
        const spot = await tx.spot.findUniqueOrThrow({ where: { id: e.spotId! } });
        if (!spot.memo?.includes(e.find)) throw new Error(`[想定と違います] ${e.label}のメモに対象の文がありません`);
        const newMemo = spot.memo.replace(e.find, e.replace);
        console.log(`\n=== ${e.label} ===`);
        console.log("直前:", spot.memo);
        console.log("直後:", newMemo);
        await tx.spot.update({ where: { id: e.spotId! }, data: { memo: newMemo } });
      }

      const it = await tx.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID } });
      if (!it.description?.includes(DESC_FIND)) throw new Error("[想定と違います] 説明文が対象の文と違います");
      const newDesc = it.description.replace(DESC_FIND, DESC_REPLACE);
      console.log("\n=== 説明文 ===");
      console.log("直前:", it.description);
      console.log("直後:", newDesc);
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDesc } });

      if (!commit) {
        console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
    if (e.message === "DRY_RUN_ROLLBACK") return;
    throw e;
  });

  if (commit) console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

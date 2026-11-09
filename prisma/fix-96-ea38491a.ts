/**
 * #96 熊本市現代美術館と下通アーケード、街なかアート散策1泊2日 の初日・最終日の見直し。
 *
 * - 初日(熊本城)の1か所目が09:00と早すぎたので、JR熊本駅の入口の時刻(10:30ごろ)から
 *   組み直し、10:48開始・16:49終了に(10:45〜11:45・16:30〜17:00の範囲)
 * - 2日目(1泊2日の最終日)は、移動を実測で測り直すと16:17に終わってしまうため、
 *   1か所目を09:13に後ろへ(8:30〜9:30の範囲内)、終了16:30に(見直す前と同じ、16:30〜17:00の範囲)
 * - 歩きの区間は routing.openstreetmap.de/routed-foot の道のり(m)÷75m/分で測り直した
 * - 市電(水前寺公園⇔辛島町、熊本駅前⇔熊本城・市役所前)は、NAVITIME・matcha-jpの時刻表を
 *   開いて測った値に直した
 * - 座標は、OSM(Nominatim)の名前つきの地物の値にぴったり合わせた(熊本城→天守閣の建物、
 *   加藤神社→社の建物、桜の馬場城彩苑→施設そのもの、現代美術館→ミュージアムの点、
 *   上通アーケード→歩行者道、藤崎八旛宮→境内のリレーション、下通アーケード→歩行者道、
 *   熊本博物館→ミュージアムの点、熊本県立美術館→ミュージアムの点。水前寺成趣園は、広い
 *   庭園なのでメモに出てくる名前のある出水神社の点に(法務 2026-10-30)。サクラマチクマモトは
 *   もとから一致していたので変更なし)
 * - 加藤神社・熊本県立美術館の書き出しの「すぐ」を実測の分数に、熊本城の1か所目に
 *   入口(JR熊本駅)からの行き方、水前寺成趣園に宿からの行き方、熊本県立美術館(最終日の
 *   最後)に帰りの一文を追加
 * - 説明文の「工芸館」は、今のスポットに当たる場所がないため外す(企画運営 2026-10-30)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-96-ea38491a.ts
 *   反映: npm run prod -- npx tsx prisma/fix-96-ea38491a.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ea38491a-1d85-432a-b2ed-6687d493e6ef";
const KUMAMOTOJO_ID = "18f4a311-bf65-418f-9d53-b7f08c2ec457";
const KATOJINJA_ID = "fda6eb67-0148-4186-b709-ab1933e0196f";
const JOSAIEN_ID = "b54826c7-ed54-487c-9409-0403cab593a3";
const BIJUTSUKAN_ID = "d458be04-606a-4bdb-920e-fa301d3cf0a8";
const KAMITORI_ID = "4a56e589-b253-4b24-b6c2-9aa5fb702406";
const FUJISAKI_ID = "6a28a873-3d5f-4284-9560-45662b2a2fa5";

const SUIZENJI_ID = "1c242b9d-47fe-4c1e-b262-ca527b9ddc1f";
const SAKURAMACHI_ID = "c19ce24c-0d79-4d88-8dc4-ac996926360d";
const SHIMODORI_ID = "c0cf3c6f-e047-4497-9e17-8286d03eccf2";
const HAKUBUTSUKAN_ID = "64f7c3c0-ea69-4e43-b6df-a4187ff3b4ae";
const KENRITSUBIJUTSUKAN_ID = "6f5c52ab-47a0-4600-b219-7d0ca4b3c517";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: KUMAMOTOJO_ID, h: 10, m: 48 },
  { id: KATOJINJA_ID, h: 12, m: 8 },
  { id: JOSAIEN_ID, h: 12, m: 44 },
  { id: BIJUTSUKAN_ID, h: 13, m: 46 },
  { id: KAMITORI_ID, h: 14, m: 59 },
  { id: FUJISAKI_ID, h: 15, m: 59 },
  { id: SUIZENJI_ID, h: 9, m: 13 },
  { id: SAKURAMACHI_ID, h: 10, m: 34 },
  { id: SHIMODORI_ID, h: 11, m: 43 },
  { id: HAKUBUTSUKAN_ID, h: 13, m: 26 },
  { id: KENRITSUBIJUTSUKAN_ID, h: 15, m: 0 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: KUMAMOTOJO_ID, label: "熊本城(天守閣)", lat: 32.806217, lng: 130.705836 },
  { id: KATOJINJA_ID, label: "加藤神社", lat: 32.807241, lng: 130.705185 },
  { id: JOSAIEN_ID, label: "桜の馬場城彩苑", lat: 32.803557, lng: 130.703562 },
  { id: BIJUTSUKAN_ID, label: "熊本市現代美術館", lat: 32.803237, lng: 130.710938 },
  { id: KAMITORI_ID, label: "上通アーケード", lat: 32.804496, lng: 130.710925 },
  { id: FUJISAKI_ID, label: "藤崎八旛宮", lat: 32.808321, lng: 130.718497 },
  { id: SHIMODORI_ID, label: "下通アーケード", lat: 32.801143, lng: 130.708492 },
  { id: HAKUBUTSUKAN_ID, label: "熊本博物館", lat: 32.808624, lng: 130.699343 },
  { id: SUIZENJI_ID, label: "水前寺成趣園(出水神社)", lat: 32.791896, lng: 130.734238 },
  { id: KENRITSUBIJUTSUKAN_ID, label: "熊本県立美術館", lat: 32.807451, lng: 130.700474 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number }[] = [
  { spotId: JOSAIEN_ID, label: "加藤神社→桜の馬場城彩苑", min: 14 },
  { spotId: BIJUTSUKAN_ID, label: "桜の馬場城彩苑→現代美術館", min: 12 },
  { spotId: KAMITORI_ID, label: "現代美術館→上通アーケード", min: 3 },
  { spotId: SAKURAMACHI_ID, label: "水前寺成趣園→サクラマチクマモト(市電)", min: 21 },
  { spotId: SHIMODORI_ID, label: "サクラマチクマモト→下通アーケード", min: 9 },
  { spotId: HAKUBUTSUKAN_ID, label: "下通→熊本博物館", min: 23 },
  { spotId: KENRITSUBIJUTSUKAN_ID, label: "熊本博物館→熊本県立美術館", min: 4 },
];

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: KUMAMOTOJO_ID,
    label: "熊本城(入口の一文)",
    find: "JR熊本駅から市電で約15分、熊本城・市役所前で降りて歩いて城へ。",
    replace: "JR熊本駅に10:30ごろ着いたら、市電で約10分、熊本城・市役所前で降りて、歩いて約8分の天守閣へ。",
  },
  {
    id: KATOJINJA_ID,
    label: "加藤神社(書き出し)",
    find: "熊本城の本丸から歩いてすぐ、城の中にある神社です。",
    replace: "熊本城の本丸から歩いて約5分、城の中にある神社です。",
  },
  {
    id: JOSAIEN_ID,
    label: "桜の馬場城彩苑(書き出し)",
    find: "加藤神社から城の南側へ歩いて約15分、2011年3月に開業した、",
    replace: "加藤神社から城の南側へ歩いて約14分、2011年3月に開業した、",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "熊本市現代美術館(書き出し)",
    find: "城彩苑から歩いて約20分、通町筋と上通が交わる角のビルにある美術館です。",
    replace: "城彩苑から歩いて約12分、通町筋と上通が交わる角のビルにある美術館です。",
  },
  {
    id: KAMITORI_ID,
    label: "上通アーケード(書き出し)",
    find: "現代美術館を出てすぐ、北へ延びるアーケード街です。",
    replace: "現代美術館を出て歩いて約3分、北へ延びるアーケード街です。",
  },
  {
    id: SUIZENJI_ID,
    label: "水前寺成趣園(宿からの行き方)",
    find: "2日目は、熊本の街なかから市電で水前寺公園へ。",
    replace: "2日目は、熊本の街なかの宿から市電で約21分の水前寺公園へ。",
  },
  {
    id: SAKURAMACHI_ID,
    label: "サクラマチクマモト(書き出し)",
    find: "水前寺公園から市電で辛島町へ、降りてすぐです。",
    replace: "水前寺公園から市電で約21分、辛島町で降りてすぐです。",
  },
  {
    id: SHIMODORI_ID,
    label: "下通アーケード(書き出し)",
    find: "サクラマチクマモトから歩いて約10分。全長およそ511m",
    replace: "サクラマチクマモトから歩いて約9分。全長およそ511m",
  },
  {
    id: HAKUBUTSUKAN_ID,
    label: "熊本博物館(書き出し)",
    find: "下通から熊本城の西側の三の丸へ歩いて約25分。熊本の自然",
    replace: "下通から熊本城の西側の三の丸へ歩いて約23分。熊本の自然",
  },
  {
    id: KENRITSUBIJUTSUKAN_ID,
    label: "熊本県立美術館(書き出し・帰りの一文)",
    find: "熊本博物館から歩いてすぐ、熊本城の二の丸にある美術館です。",
    replace: "熊本博物館から歩いて約4分、熊本城の二の丸にある美術館です。",
  },
  {
    id: KENRITSUBIJUTSUKAN_ID,
    label: "熊本県立美術館(帰りの一文)",
    find: "休館日があるので、公式の案内で確かめてから訪れましょう。2日間の街なか散策はここで締めくくりです。",
    replace:
      "休館日があるので、公式の案内で確かめてから訪れましょう。2日間の街なか散策はここで締めくくりです。見学を終えたら、歩いて約20分の熊本城・市役所前電停へ。市電で約10分のJR熊本駅へ戻りましょう。",
  },
];

const DESCRIPTION_FIND = "熊本城と城下の神社・工芸館をめぐり、現代アートの美術館と上通のアーケードへ歩く1日目。";
const DESCRIPTION_REPLACE = "熊本城と城下の神社をめぐり、現代アートの美術館と上通のアーケードへ歩く1日目。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(MEMO_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  let description = itinerary.description ?? "";

  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  if (!description.includes(DESCRIPTION_FIND)) {
    console.log(`[想定と違います] 説明文に「${DESCRIPTION_FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }
  description = description.replace(DESCRIPTION_FIND, DESCRIPTION_REPLACE);

  console.log("=== #96 初日・最終日の見直し ===\n");
  console.log("[時刻]");
  for (const v of VISIT_TIMES) {
    console.log(`  ${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")}`);
  }
  console.log("\n[座標]");
  for (const c of COORD_UPDATES) {
    console.log(`  ${c.label}: ${c.lat},${c.lng}`);
  }
  console.log("\n[移動(分)]");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分`);
  }
  console.log("\n[メモ]");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 70));
    console.log();
  }
  console.log("[説明文]");
  console.log(description);

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    ...VISIT_TIMES.map((v) => prisma.spot.update({ where: { id: v.id }, data: { visitTime: t(v.h, v.m) } })),
    ...COORD_UPDATES.map((c) => prisma.spot.update({ where: { id: c.id }, data: { lat: c.lat, lng: c.lng } })),
    ...LEG_UPDATES.map((l) =>
      prisma.spotTransitLeg.updateMany({ where: { spotId: l.spotId }, data: { transitDurationMin: l.min } })
    ),
    ...ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })),
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } }),
  ]);

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

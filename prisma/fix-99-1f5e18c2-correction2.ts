/**
 * #99 訂正その2。法務の本番確認(2026-10-30 14:08)の指摘に対応する。
 *
 * 文の直し: 城山展望台のタクシーの理由文を仙巌園と同じ言い方に、仙巌園の昼食の文の
 * 「よいでしょう」を外す。
 *
 * 座標の直し: 維新ふるさと館・尚古集成館(丸めをやめ元のOSMの値に)、多賀山公園(公園全体の
 * 中心→東郷平八郎像node6237753710)、桜島(抜けていた。足湯「桜島溶岩なぎさ公園足湯」
 * way612662915に。前回の修正で座標の書き込みを忘れていた)。
 *
 * 座標を変えた前後の分数を道のり÷75で測り直し、時刻も合わせた(2日目は見直す前の
 * 16:35より遅くならないよう16:34に)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-99-1f5e18c2-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-99-1f5e18c2-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ISHINFURUSATOKAN_ID = "727b6605-6813-4500-aae4-fd6d21b5639d";
const TERUKUNIJINJA_ID = "1faac2db-d19f-4c51-b255-550680cccaeb";
const BIJUTSUKAN_ID = "4ece185e-b846-4e94-a6a8-07561d34deeb";
const SAIGODOZO_ID = "3728de81-058e-43cd-bb45-702aa0e88cbf";
const REIMEIKAN_ID = "576569f1-c8ed-4d5a-970b-46910a8d9689";
const SHIGAKKOATO_ID = "9a88dc19-4cde-43ce-96ed-4500993f5dc7";
const SHIROYAMA_ID = "01c372fb-4095-47f3-a1bd-d2ad63ff34e9";
const SAIGONANSHUKENSHOKAN_ID = "edcbfb27-8586-41b7-a9ce-685a996098b5";
const NANSHUJINJA_ID = "f8820c0a-41f4-4813-b93f-76e22731a195";
const SAKURAJIMA_ID = "23cc2abd-db07-4902-b2cc-65a40468d1be";
const SENGANEN_ID = "200816b5-93fa-4019-985d-835351d05d7a";
const SHOKOSHUSEIKAN_ID = "80e39879-fea5-4cfa-9b1c-dd3d83fffbb2";
const IJINKAN_ID = "94443b50-84df-47bb-a16e-2c407a53b631";
const TAGAYAMAKOEN_ID = "391dd09f-ab05-4b68-8d43-366f7dadd710";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: TERUKUNIJINJA_ID, h: 11, m: 57 },
  { id: BIJUTSUKAN_ID, h: 12, m: 33 },
  { id: SAIGODOZO_ID, h: 13, m: 13 },
  { id: REIMEIKAN_ID, h: 13, m: 35 },
  { id: SHIGAKKOATO_ID, h: 14, m: 30 },
  { id: SHIROYAMA_ID, h: 15, m: 0 },
  { id: SAIGONANSHUKENSHOKAN_ID, h: 15, m: 41 },
  { id: NANSHUJINJA_ID, h: 16, m: 17 },
  { id: TAGAYAMAKOEN_ID, h: 15, m: 59 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: ISHINFURUSATOKAN_ID, label: "維新ふるさと館", lat: 31.584626, lng: 130.54785 },
  { id: SHOKOSHUSEIKAN_ID, label: "尚古集成館", lat: 31.617324, lng: 130.576301 },
  { id: TAGAYAMAKOEN_ID, label: "多賀山公園(東郷平八郎像)", lat: 31.606115, lng: 130.569345 },
  { id: SAKURAJIMA_ID, label: "桜島(足湯)", lat: 31.591436, lng: 130.593508 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number }[] = [
  { spotId: TERUKUNIJINJA_ID, label: "維新ふるさと館→照国神社", min: 22 },
  { spotId: TAGAYAMAKOEN_ID, label: "異人館→多賀山公園", min: 21 },
];

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: SHIROYAMA_ID,
    label: "城山展望台(終わりの一文)",
    find: "見学を終えたら、バスの乗り継ぎがわかりにくいためタクシーを利用します。タクシーでおよそ11分、西郷南洲顕彰館へ向かいましょう。",
    replace: "見学を終えたら、この区間は、タクシーを使うと便利です。タクシーでおよそ11分、西郷南洲顕彰館へ向かいましょう。",
  },
  {
    id: SENGANEN_ID,
    label: "仙巌園(昼食の一文)",
    find: "このあたりの茶屋などで昼食をとるとよいでしょう。",
    replace: "このあたりの茶屋などで、昼食にしましょう。",
  },
  {
    id: ISHINFURUSATOKAN_ID,
    label: "維新ふるさと館(終わりの一文)",
    find: "見学を終えたら、歩いておよそ23分の照国神社へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ22分の照国神社へ向かいましょう。",
  },
  {
    id: TERUKUNIJINJA_ID,
    label: "照国神社(書き出し)",
    find: "維新ふるさと館から歩いておよそ23分、照国神社に着きます。",
    replace: "維新ふるさと館から歩いておよそ22分、照国神社に着きます。",
  },
  {
    id: IJINKAN_ID,
    label: "異人館(終わりの一文)",
    find: "続いては、歩いておよそ22分の多賀山公園へ向かいましょう。",
    replace: "続いては、歩いておよそ21分の多賀山公園へ向かいましょう。",
  },
  {
    id: TAGAYAMAKOEN_ID,
    label: "多賀山公園(書き出し)",
    find: "異人館からは歩いておよそ22分です。",
    replace: "異人館からは歩いておよそ21分です。",
  },
  {
    id: TAGAYAMAKOEN_ID,
    label: "多賀山公園(帰りの一文)",
    find: "見学を終えたら、歩いて約19分の鹿児島駅前電停へ。市電で約19分の鹿児島中央駅前へ戻り、駅ビルでお土産を探したり、郷土料理を味わったりしてから、電車で帰路につきましょう。",
    replace: "見学を終えたら、歩いて約17分の鹿児島駅前電停へ。市電で約19分の鹿児島中央駅前へ戻り、駅ビルでお土産を探したり、郷土料理を味わったりしてから、電車で帰路につきましょう。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(MEMO_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #99 訂正その2 ===\n");
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
  ]);

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

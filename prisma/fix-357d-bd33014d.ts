/**
 * #357の続き。企画運営の指摘: Day1も16:30〜17:00に収める(夜景のための17:58までの
 * 延長は例外にしない。長崎の日の入りは季節で17時〜19時半と大きく変わるため)。
 * #49(1c95d06d、函館山)と同じ書き方に合わせ、稲佐山は日中(15時台〜16時台)に上って
 * 昼の眺めを中心に書き、夜景は「日が暮れるまで残れば…楽しめます」という選べる
 * 補足として書く。夕食の店名も削除。
 *
 * タイトル・説明文も、夜景を見る旅だと約束する形をやめ、内容に合わせて変更。
 *
 * 新しいDay1の時刻(08:45〜16:33、8か所、他は変更なし):
 * (…長崎県美術館14:13-15:13(60)…) → 15:28 稲佐山(65) → 16:33
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-357d-bd33014d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";
const INASAYAMA_ID = "529782c7-7313-47da-8369-ef598ff7f9e2";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const newTitle = "稲佐山の眺めと出島、鎖国時代の長崎をたどる1泊2日";
  if (itin.title === newTitle) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      title: newTitle,
      description:
        "長崎市街を一望する稲佐山と、鎖国時代の対外窓口だった出島。グラバー園や中華街とは違う、長崎の高台からの眺めと歴史をたどる1泊2日です。",
    },
  });
  console.log("タイトル・説明文を変更");

  await updateSpotInItinerary(ITIN_ID, { spotId: INASAYAMA_ID }, {
    visitTime: T(15, 28),
    stayDurationMin: 65,
    memo: "長崎県美術館から、長崎ロープウェイでおよそ15分、次に訪れるのは稲佐山です。標高333mのこの山からの夜景は「世界新三大夜景」の一つとされていますが、昼間の眺めも見事です。すり鉢状の地形に家々が立ち並ぶ長崎港を取り囲む市街地を一望でき、稲佐山だけでなく鍋冠山や風頭公園、女神大橋など、さまざまな場所から表情豊かな景色を楽しめる土地としても知られています。日が暮れるまで山頂に残れば、宝石箱をひっくり返したような夜景を眺めることもできます。山頂からの絶景をゆっくり楽しみましょう。今夜はこの近くの宿に宿泊します。",
  });
  console.log("稲佐山: 日中の眺めを中心に、夜景は補足の書き方に修正");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

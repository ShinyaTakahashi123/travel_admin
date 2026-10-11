/**
 * #157(関空の絶景とアウトレット、海辺の泉南をのんびり楽しむ日帰り旅、
 * 3441e3a7)を09:30〜16:30台に組み直す。
 *
 * 元は4か所(二色の浜公園・水間寺・りんくう公園・りんくうプレミアム・
 * アウトレット)あったが、14:55終了(終了時刻の決まり違反)で、昼食も
 * なかった。また、二色の浜公園へは南海本線の駅から徒歩で来ているのに、
 * 次の水間寺への移動がいきなり車になっており、車をどこで借りたかの
 * 説明もなかった(決まり8)。水間寺の到着時刻も、移動時間と合っていな
 * かった(11:00着だが車15分なら10:45着のはず)。
 *
 * 直した内容:
 * - 二色の浜公園の結びに「駅前でレンタカーを借りて」を追加し、車の
 *   出どころを明記
 * - 水間寺の到着時刻を10:45に修正(時刻の計算を合わせた)
 * - りんくうタウン駅前で昼食(新設、34.4107517,135.2996565)を追加
 * - 関空展望ホール スカイビュー(新設、34.4408294,135.2581462。タイトルの
 *   「関空の絶景」にちょうど合う、関西空港の滑走路を間近に望める展望施設)
 *   を最後に追加
 * - りんくう公園・りんくうプレミアム・アウトレットの間のつなぎの文を調整
 *
 * 新しい時刻(09:30〜16:39、6か所):
 * 二色の浜公園09:30(60)→水間寺10:45(40)→昼食(りんくうタウン駅前)11:45(70)→
 * りんくう公園13:00(40)→りんくうプレミアム・アウトレット13:52(80)→
 * 関空展望ホール スカイビュー15:24(75)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-157-3441e3a7.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "f31b13cc-c09e-41cc-8ad9-67ac4bc563d0";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const futairo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "二色の浜公園" } });
  const mizuma = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "水間寺" } });
  const rinkuPark = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "りんくう公園" } });
  const outlet = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "りんくうプレミアム・アウトレット" } });

  if (mizuma.visitTime?.getUTCHours() === 10 && mizuma.visitTime?.getUTCMinutes() === 45) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: futairo.id,
      data: {
        memo: futairo.memo?.replace(
          "海辺の景色を満喫したら、次は古くから厄除け観音として親しまれてきた水間寺へ向かいましょう。",
          "海辺の景色を満喫したら、駅前でレンタカーを借りて、古くから厄除け観音として親しまれてきた水間寺へ向かいましょう。"
        ),
      },
    },
    {
      id: mizuma.id,
      data: {
        visitTime: T(10, 45),
        memo: mizuma.memo?.replace(
          "厳かな空気を味わったら、次は関西空港を望む絶景スポット、りんくう公園へ向かいましょう。",
          "厳かな空気を味わったら、車でりんくうタウンへ向かい、お昼を食べましょう。"
        ),
      },
    },
    {
      create: {
        name: "りんくうタウン駅前で昼食",
        address: "泉佐野市りんくう往来北",
        lat: 34.4107517,
        lng: 135.2996565,
        visitTime: T(11, 45),
        stayDurationMin: 70,
        memo: "水間寺から車でおよそ20分、お昼はりんくうタウン駅前で食事をとりましょう。駅周辺には、洋食・和食からカフェまで、さまざまな飲食店が集まっています。関西空港を望む開放的な雰囲気の中、ゆっくりと食事をとりましょう。お腹を満たしたら、歩いてりんくう公園へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
      },
    },
    {
      id: rinkuPark.id,
      data: {
        visitTime: T(13, 0),
        memo: rinkuPark.memo
          ?.replace(
            "厳かな水間寺の境内から一転、次に訪れるりんくう公園では、関西空港を望む開放的な景色が広がります。",
            "りんくうタウン駅前から歩いて5分ほど、次に訪れるりんくう公園では、関西空港を望む開放的な景色が広がります。"
          )
          .replace(
            "水間寺で静かなひとときを過ごした後だからこそ、この開けた景色のスケールの大きさがより一層感じられるはずです。景色を楽しんだら、次はすぐ近くのりんくうプレミアム・アウトレットへ向かい、お買い物を楽しみましょう。",
            "海を望む開けた景色のスケールの大きさを楽しみましょう。景色を楽しんだら、次はすぐ近くのりんくうプレミアム・アウトレットへ向かい、お買い物を楽しみましょう。"
          ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
    {
      id: outlet.id,
      data: {
        visitTime: T(13, 52),
        stayDurationMin: 80,
        memo: outlet.memo?.replace(
          "水間寺の歴史散策、りんくう公園からの絶景と巡ってきた一日の最後に、お気に入りの一着やおみやげを探しながら、ゆっくりお買い物を楽しんでください。",
          "お気に入りの一着やおみやげを探しながら、ゆっくりお買い物を楽しみましょう。お買い物を終えたら、車に戻り、関空展望ホール スカイビューへ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "関空展望ホール スカイビュー",
        address: "泉佐野市泉州空港北1",
        lat: 34.4408294,
        lng: 135.2581462,
        visitTime: T(15, 24),
        stayDurationMin: 75,
        memo: "りんくうプレミアム・アウトレットから車でおよそ12分、関西国際空港連絡橋を渡った先、旅の最後に訪れるのは関空展望ホール スカイビューです。関西空港の滑走路を間近に見渡せる展望施設で、メインホールの4階・5階と、エントランスホール5階の「スカイデッキ」から、離着陸する飛行機を真横からの迫力ある角度で眺めることができます。夕方には、海に沈む夕日と機体のシルエットが重なる景色も人気です。関空の多彩な表情を、旅の締めくくりにじっくりと楽しみましょう。見学を終えたら、車で借りた駅まで戻り、レンタカーを返却してから帰りましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
      },
    },
  ]);

  console.log("#157: 終了時刻・昼食・車の出どころを是正。6か所・09:30〜16:39に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

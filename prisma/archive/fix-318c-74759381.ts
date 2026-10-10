/**
 * #318の続き。企画運営2026-09-30 22:25の3点 + 法務2026-09-30 22:21の2点に対応。
 *
 * 企画運営:
 * 1) 決まり8(乗り物のつじつま): 九谷焼窯跡展示館→石川県九谷焼美術館が、日の
 *    ほかの区間がすべて徒歩なのに「車でおよそ15分」だけ浮いていた。実際に
 *    使える公共交通を確かめたところ、山代温泉と大聖寺は、加賀周遊バス
 *    「キャン・バス」では別方向の周遊ルート(山まわり線／海まわり線)で直結
 *    しておらず、乗り継ぐと加賀温泉駅まで大回りして片道90分以上かかってしまう
 *    ため使えないと判断。代わりに、北鉄加賀バス(山代温泉⇔加賀温泉駅、実測
 *    13分)＋IRいしかわ鉄道(加賀温泉駅⇔大聖寺駅、3〜4分)＋徒歩(大聖寺駅⇔
 *    美術館、公式10分)を乗り継ぐ現実の経路に直した。バス停までの徒歩や
 *    乗り継ぎの間を含め、区間全体でおよそ35分とし、後続スポットの時刻も
 *    すべて繰り下げた(35分-15分=20分のずれ分)。
 * 2) 古総湯の入浴の一文(「浴場ではほかの入浴客を撮らず、施設の決まりに従い
 *    ましょう。長湯を避けて、こまめに水分をとりましょう。」)を追加(法務も
 *    同じ指摘)。
 * 3) 九谷焼窯跡展示館メモの1文目のねじれ(主語「九谷焼窯跡展示館は」なのに
 *    「古九谷」の歴史を語る文が続いていた)を、「九谷焼は、…はじまりとされ、
 *    …再興されました。九谷焼窯跡展示館では、…」の2文に分けて直した。
 *
 * 法務:
 * 1) 古総湯の入浴の一文 → 企画運営2)と同じ対応。
 * 2) 九谷焼窯跡展示館の写真(KUTANI_Ewer.JPG、ReijiYamashina)が、施設内の
 *    展示品(水注)の写真で、場所の写真として不適切だったため削除。ストレージ
 *    本体は消さず、DBのPhoto行だけ削除(未使用画像はCronが自動整理する決まり
 *    のため)。
 *
 * 出典追加確認(企画運営「Wikipediaだけの事実があれば公式で確かめ直す」の
 * 指摘を受けて):
 * - 江沼神社の祭神(前田利治・菅原道真)は、石川県神社庁公式サイト
 *   (ishikawa-jinjacho.or.jp/shrine/j0400)でも確認、Wikipediaのみの
 *   出典ではなくなった
 * - 長流亭の建立年(宝永6年・1709)・前田利直との関係は、石川県公式観光サイト
 *   hot-ishikawa.jp(detail_5812)でも確認済み
 *
 * 移動時間の出典:
 * - 北鉄加賀バス 山代温泉⇔加賀温泉駅: 実測13分(NAVITIME調べ)
 * - IRいしかわ鉄道 加賀温泉駅⇔大聖寺駅: 3〜4分(jorudan/NAVITIME時刻表)
 * - 大聖寺駅⇔石川県九谷焼美術館: 徒歩約10分(kutani-mus.jp公式)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-318c-74759381.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74759381-8ba1-4cc4-af19-4c1c523341be";

async function main() {
  // --- 企画運営2) / 法務1): 古総湯に入浴の一文 ---
  const kosoyu = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "山代温泉古総湯" },
  });
  {
    const old = "味わってみましょう。続いては、";
    const next =
      "味わってみましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。続いては、";
    if (kosoyu.memo?.includes(old) && !kosoyu.memo.includes("ほかの入浴客を撮らず")) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kosoyu.id }, { memo: kosoyu.memo.replace(old, next) });
    }
  }

  // --- 企画運営1) / 3): 窯跡展示館の文を分け、後続の移動をバス+電車+徒歩に ---
  const kiln = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "九谷焼窯跡展示館" },
  });
  {
    const old =
      "九谷焼窯跡展示館は、江戸時代初期、加賀・大聖寺藩の命により、現在の加賀市九谷村で焼かれ始めたのが「古九谷」と呼ばれる九谷焼のはじまりで、謎の廃窯を経て、およそ100年後にここ山代温泉の地で再興されました。館内には、国指定史跡となっている江戸時代の窯跡のほか、昭和15年(1940)から昭和40年(1965)まで実際に使われていた登り窯、かつての九谷焼窯元の古民家が保存されており、九谷焼の歴史を実物とともにたどることができます。絵付けやろくろの体験もでき、九谷焼の華やかな絵付けを自分の手で試してみることもできます。続いては、車でおよそ15分の石川県九谷焼美術館へ向かいましょう。";
    const next =
      "九谷焼は、江戸時代初めに、加賀・大聖寺藩の命により現在の加賀市九谷村で焼かれ始めた「古九谷」がはじまりとされ、謎の廃窯を経て、およそ100年後にここ山代温泉の地で再興されました。九谷焼窯跡展示館では、国指定史跡となっている江戸時代の窯跡のほか、昭和15年(1940)から昭和40年(1965)まで実際に使われていた登り窯、かつての九谷焼窯元の古民家が保存されており、九谷焼の歴史を実物とともにたどることができます。絵付けやろくろの体験もでき、九谷焼の華やかな絵付けを自分の手で試してみることもできます。続いては、山代温泉のバス停まで歩き、北鉄加賀バスで加賀温泉駅へ(およそ13分)、IRいしかわ鉄道に乗り換えて大聖寺駅へ(およそ4分)、そこから歩いておよそ10分の石川県九谷焼美術館へ向かいましょう。";
    if (kiln.memo === old) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kiln.id }, { memo: next });
    }
  }

  // --- 法務2): 窯跡展示館の場所違いの写真を削除 ---
  await prisma.photo.deleteMany({
    where: { spotId: kiln.id, sourceUrl: "https://commons.wikimedia.org/wiki/File:KUTANI_Ewer.JPG" },
  });

  // --- 企画運営1)続き: 石川県九谷焼美術館以降、visitTimeを+20分カスケード ---
  const museum = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "石川県九谷焼美術館" },
  });
  if (museum.transitMode === "car") {
    const museumOld = "九谷焼窯跡展示館からは車でおよそ15分です。";
    const museumNext = "九谷焼窯跡展示館からは、バスと電車を乗り継いでおよそ35分です。";
    const museumMemo = (museum.memo ?? "").replace(museumOld, museumNext);
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: museum.id },
      {
        memo: museumMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 45)),
        transitMode: "bus",
        transitDurationMin: 35,
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: museum.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: museum.id, orderNo: 1, transitMode: "bus", transitDurationMin: 35 },
    });

    const cascade: [string, number, number][] = [
      ["全昌寺", 13, 48],
      ["江沼神社", 14, 30],
      ["深田久弥 山の文化館", 15, 3],
      ["錦城山公園", 15, 50],
    ];
    for (const [name, h, min] of cascade) {
      const s = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name } });
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, h, min)) });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

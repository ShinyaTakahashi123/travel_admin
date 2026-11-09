/**
 * 日田(承認待ち、597de6fa)への直し v3。法務の2回目の指摘・企画運営の決定(2026-11-02)を反映する。
 *
 * ①咸宜園跡・月隈公園・廣瀬資料館の滞在は、v2で+10/+10/+7分のばしたが、決まりA(滞在を
 *   のばさない・浮いた時間を他に回さない)に当たるため、もとの45/35/35分に戻す(v2は
 *   --commitせずに終わっていたため、本番はもともと45/35/35のまま)。
 * ②浮いた時間は、決まりAの順番③「本当の行き先を1つ足す」で埋める。日田祇園山鉾会館
 *   (tourism=museum、wikidata Q11509923、隈地区寺町)を、豆田の辻公園のあとに追加する。
 *   (v4: 「平成2年(1990)に復元された10m級の平成山鉾」はWebSearchの要約(祭り全体の
 *   巡行の説明)を会館の展示の説明と取り違えた誤りだったため、法務の「出典を」の指摘で
 *   見つけた。開館年・展示の基数などはWikipediaにはあるが、日田市・観光協会・会館自身の
 *   公式のページでは確かめられなかったため、企画運営の決定で、確かめられる数字だけ
 *   (祭りがユネスコ無形文化遺産・国の重要無形民俗文化財であること)を残し、会館の中身は
 *   「祭りで使われる山鉾を間近に展示する施設」という、公式でなくても確かめられる言い方に
 *   直した)
 * ③レンタカーの車の分に+5分(那須・四万十と同じ慣例)。日田駅-小鹿田焼陶芸館間
 *   routed-car 17.8分+5=23分(行き・帰りとも)。「手続きに15分ほど」の文言は、
 *   itinerary-rules.md59行の決まりのとおり残す(企画運営の訂正)。
 * ④新しい区間: 豆田の辻公園→日田祇園山鉾会館はwalk(OSRM徒歩24.1分→25分)。
 *   日田祇園山鉾会館→(日田駅経由)→小鹿田焼の里はwalk13分(日田駅までOSRM12.5分)+
 *   手続き15分(他のしおりと同じくother扱いで区間に持たせる。法務の指摘で、文にある
 *   「手続きに15分ほど」が区間に入っておらず時刻がつながっていなかったのを直した)+
 *   car23分(駅→陶芸館)。
 * ⑤「終点の小鹿田焼の里」→レンタカー(車)なので「終点の」を外す(法務の指摘。もとは
 *   バス便の表現が残っていた)。
 * ⑥写真: 廣瀬資料館(淡窓の肖像)・天領日田歴史資料館(祇園祭の写真)を削除(建物ではない
 *   ため、法務の指摘)。日田祇園山鉾会館は、Wikipedia「日田祇園山鉾会館」の画像
 *   (File:Hita_Gion_Museum.jpg、建物外観)を取得して登録する。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { fetchAndUploadImage } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");
const ITIN_ID = "597de6fa-205e-48ac-b805-558c50b5a069";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const spots = await prisma.spot.findMany({
    where: { day: { itineraryId: ITIN_ID } },
    orderBy: { orderNo: "asc" },
    include: { transitLegs: true, photos: true },
  });
  const byName = (n: string) => {
    const s = spots.find((x) => x.name === n);
    if (!s) throw new Error(`スポットが見つかりません: ${n}`);
    return s;
  };
  const kangien = byName("咸宜園跡");
  const tsukikuma = byName("月隈公園");
  const yasaka = byName("豆田八坂神社");
  const hirose = byName("廣瀬資料館");
  const tenryo = byName("天領日田歴史資料館");
  const tsujikoen = byName("豆田の辻公園");
  const onta = byName("小鹿田焼の里");

  if (kangien.stayDurationMin !== 45) throw new Error("咸宜園跡: 滞在の現在値が期待(45)と不一致");
  if (tsukikuma.stayDurationMin !== 35) throw new Error("月隈公園: 滞在の現在値が期待(35)と不一致");
  if (hirose.stayDurationMin !== 35) throw new Error("廣瀬資料館: 滞在の現在値が期待(35)と不一致");

  const TSUJIKOEN_MEMO_OLD =
    "天領日田歴史資料館から歩いておよそ6分、豆田の辻公園に着きます。白壁の町家が並ぶ豆田町の一角にある小さな公園で、ここで昼食にしましょう。周辺には、食事ができる店も並んでいます。腰かけて、豆田町の町並みをゆっくり眺めましょう。この後は、歩いて日田駅まで戻り、バスで小鹿田焼の里へ向かいましょう。";
  const TSUJIKOEN_MEMO_NEW =
    "天領日田歴史資料館から歩いておよそ6分、豆田の辻公園に着きます。白壁の町家が並ぶ豆田町の一角にある小さな公園で、ここで昼食にしましょう。周辺には、食事ができる店も並んでいます。腰かけて、豆田町の町並みをゆっくり眺めましょう。この後は、歩いておよそ25分、日田祇園山鉾会館へ向かいましょう。";
  if (tsujikoen.memo !== TSUJIKOEN_MEMO_OLD) throw new Error("豆田の辻公園: memo現在値が期待と不一致");

  const GIONKAIKAN_MEMO =
    "豆田の辻公園から歩いておよそ25分、日田祇園山鉾会館に着きます。日田祇園祭は、豆田・隈・竹田の3地区の山鉾が市内を曳き回る祭りで、平成28年(2016)12月にユネスコ無形文化遺産に登録され、国の重要無形民俗文化財にも指定されています。ここは、日田祇園の山鉾を間近に展示する施設で、祭りの時期以外にも、山鉾の大きさや飾りを見ることができます。この後は、歩いておよそ13分の日田駅へ戻り、駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ23分、小鹿田焼の里へ向かいましょう。";

  const ONTA_MEMO_OLD =
    "豆田の辻公園から歩いておよそ23分の日田駅へ戻り、バスでおよそ40分、終点の小鹿田焼の里に着きます。江戸時代中期の1705年(宝永2年)、または1737年(元文2年)に、日田の代官が領内で使う生活雑器をつくるために興したと伝えられる窯の里で、陶工の柳瀬三右衛門と、彼を招いた黒木十兵衛によって始められたとされています。技法は一子相伝で受け継がれ、集落の中心にある登り窯は、近くの窯元が共同で使っています。谷川の水の力で陶土を砕く「唐臼」が今も動いており、その音は、平成8年(1996)に「日本の音風景100選」の一つに選ばれました。陶芸館では、小鹿田焼の歴史や作られる工程、古い陶器などが展示されています。見学できる時間は、訪れる前に確かめておきましょう。集落の小道を歩きながら、窯元が連なる山あいの景観をゆっくり眺めましょう。見学を終えたら、バスでおよそ40分の日田駅へ戻り、帰路につきましょう。";
  const ONTA_MEMO_NEW =
    "日田祇園山鉾会館から歩いておよそ13分の日田駅へ戻り、駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ23分、小鹿田焼の里に着きます。江戸時代中期の1705年(宝永2年)、または1737年(元文2年)に、日田の代官が領内で使う生活雑器をつくるために興したと伝えられる窯の里で、陶工の柳瀬三右衛門と、彼を招いた黒木十兵衛によって始められたとされています。技法は一子相伝で受け継がれ、集落の中心にある登り窯は、近くの窯元が共同で使っています。谷川の水の力で陶土を砕く「唐臼」が今も動いており、その音は、平成8年(1996)に「日本の音風景100選」の一つに選ばれました。陶芸館では、小鹿田焼の歴史や作られる工程、古い陶器などが展示されています。見学できる時間は、訪れる前に確かめておきましょう。集落の小道を歩きながら、窯元が連なる山あいの景観をゆっくり眺めましょう。見学を終えたら、車でおよそ23分の日田駅へ戻り、レンタカーを返して、帰路につきましょう。";
  if (onta.memo !== ONTA_MEMO_OLD) throw new Error("小鹿田焼の里: memo現在値が期待と不一致");
  if (onta.transitLegs.length !== 2) throw new Error("小鹿田焼の里: 区間数が期待(2)と不一致");

  console.log("\n[新しい時刻・滞在・区間(1〜5は変更なし)]");
  console.log("咸宜園跡: 09:30 / 滞在45分(変更なし)");
  console.log("月隈公園: 10:33 / 滞在35分(変更なし)");
  console.log("豆田八坂神社: 11:17 / 滞在15分(変更なし)");
  console.log("廣瀬資料館: 11:39 / 滞在35分(変更なし)");
  console.log("天領日田歴史資料館: 12:16 / 滞在25分(変更なし)");
  console.log("豆田の辻公園: 12:47 / 滞在40分(変更なし、昼食は11:30〜13:30内)");
  console.log("日田祇園山鉾会館(新規): 13:52 / 滞在35分 / incoming walk25分");
  console.log("小鹿田焼の里: 15:18(14:30から変更) / 滞在100分(120から変更) / incoming walk13分+other15分(手続き)+car23分(OSRM17.8分+5)");
  console.log("終わり: 15:18+100分=16:58(日帰りの発車16:30〜17:00の中)。帰りは車でおよそ23分の日田駅");

  console.log("\n[写真の削除]");
  console.log(`廣瀬資料館: ${hirose.photos.length}枚削除(淡窓の肖像で建物ではないため)`);
  console.log(`天領日田歴史資料館: ${tenryo.photos.length}枚削除(祇園祭の写真で建物ではないため)`);
  console.log("日田祇園山鉾会館(新規): Wikipedia「日田祇園山鉾会館」の画像を取得");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = tsujikoen.dayId;

  await prisma.$transaction(async (tx) => {
    for (const p of hirose.photos) await tx.photo.delete({ where: { id: p.id } });
    for (const p of tenryo.photos) await tx.photo.delete({ where: { id: p.id } });

    await setDaySpotOrder(
      dayId,
      [
        { id: kangien.id, data: {} },
        { id: tsukikuma.id, data: {} },
        { id: yasaka.id, data: {} },
        { id: hirose.id, data: {} },
        { id: tenryo.id, data: {} },
        { id: tsujikoen.id, data: { memo: TSUJIKOEN_MEMO_NEW } },
        {
          create: {
            name: "日田祇園山鉾会館",
            lat: 33.3155195,
            lng: 130.9314056,
            memo: GIONKAIKAN_MEMO,
            visitTime: t(13, 52),
            stayDurationMin: 35,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25 }] },
          },
        },
        {
          id: onta.id,
          data: {
            memo: ONTA_MEMO_NEW,
            visitTime: t(15, 18),
            stayDurationMin: 100,
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "walk", transitDurationMin: 13 },
                { orderNo: 2, transitMode: "other", transitDurationMin: 15 },
                { orderNo: 3, transitMode: "car", transitDurationMin: 23 },
              ],
            },
          },
        },
      ],
      { tx }
    );
  });

  const gionkaikan = await prisma.spot.findFirstOrThrow({
    where: { name: "日田祇園山鉾会館", day: { itineraryId: ITIN_ID } },
  });
  const spotSeed = { name: "日田祇園山鉾会館", wikiTitle: "日田祇園山鉾会館" } as any;
  const imageCache = new Map<string, string | null>();
  const creditCache = new Map<string, any>();
  const url = await fetchAndUploadImage(imageCache, spotSeed, "official-local-02-hita", creditCache);
  if (url) {
    const credit = creditCache.get(spotSeed.name);
    await prisma.photo.create({
      data: {
        spotId: gionkaikan.id,
        url,
        caption: spotSeed.name,
        sourceUrl: credit?.sourceUrl ?? null,
        author: credit?.author ?? null,
        license: credit?.license ?? null,
        licenseUrl: credit?.licenseUrl ?? null,
      },
    });
    console.log(`画像取得OK: 日田祇園山鉾会館 -> ${url}`);
  } else {
    console.log("画像取得失敗: 日田祇園山鉾会館");
  }

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

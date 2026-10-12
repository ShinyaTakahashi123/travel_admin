/**
 * #124 c1204e30の直し(4回目)。企画運営・法務(2026-10-11、法務記録bdb8f00)
 * の指摘。
 *
 * 業者名のスポット: 「北一硝子三号館」(ガラス店・喫茶店)と「小樽運河
 * プラザ」(本文に洋菓子店ルタオが運営する店舗と明記)を、#217が同じ建物
 * (旧小樽倉庫)のスポットを外したのと同じ考え方で削除。代わりに、業者で
 * ない実在の行き先「日本銀行旧小樽支店金融資料館」(無料・公的、ja.
 * wikipedia.org/wiki/日本銀行旧小樽支店金融資料館で確認)と「小樽運河」
 * (運河そのもの、業者を介さない公共空間、ja.wikipedia.org/wiki/小樽運河で
 * 確認)を追加。
 *
 * タイトル・説明文の「青の洞窟クルーズ」: 積丹・美国に「青の洞窟」という
 * 観光地はなく、美国港発の観光船「水中展望船ニューしゃこたん号」も
 * 2026年10月8日時点で運航中止(積丹観光協会 kanko-shakotan.jp で確認)の
 * ため、中身に合わせてタイトル・説明文を書き直す。
 *
 * 写真: 積丹半島（美国町）の写真は#217で撮影場所が確かめられず外したのと
 * 同じ写真のため削除。
 *
 * 安全の一言: 旧手宮線(レール・踏切の足元)、黄金岬(崖に近い遊歩道)、
 * 積丹岬(断崖の遊歩道・風)を追加。
 *
 * 座標(すべてOSM):
 * - 小樽運河: 43.1977730, 141.0030447(展望地点、osm_id 4279688789)
 * - 日本銀行旧小樽支店金融資料館: 43.1963, 141.0003(node 462763241)
 * - 積丹半島（美国町）: 43.3008895, 140.6028561(美国港、osm_id 5668239022)
 * - 積丹岬: 43.3721992, 140.4622215(osm_id 3092235149)
 *
 * 口調: 「〜のだそうです」「いただける」をサイトの標準に修正。
 * 旧手宮線96分(決まりA)→45分に短縮。車の借り方(小樽駅前)・返し方
 * (積丹岬から小樽へ戻り返却)を明記。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KINYU_MEMO =
  "JR小樽駅前でレンタカーを借りて、今日はまず日本銀行旧小樽支店金融資料館から始まります。徒歩でも行き来できる距離です。明治45年(1912)に竣工した、東京駅の設計で知られる建築家・辰野金吾らが手がけた建物で、入館は無料です。日本銀行の歴史を紹介する展示室のほか、実際に使われていた金庫や、1億円の重さを体感できるコーナーもあります。この後は、歩いておよそ5分、小樽運河へ向かいましょう。";

const UNGA_MEMO =
  "金融資料館から歩いておよそ5分、小樽運河に着きます。大正12年(1923)に完成した運河で、沿岸には木骨石造の倉庫群が今も残り、昭和61年(1986)の再整備で散策路に63基のガス灯が設けられました。夕暮れからはガス灯に灯がともり、昼とは違った趣があります。運河沿いをゆっくりと散策しましょう。この後は、歩いておよそ5分、旧手宮線へ向かいましょう。";

const TEMIYASEN_FROM =
  "運河沿いを歩いていくと、ふいに線路と踏切が現れる不思議な一角にたどり着きます。ここは旧手宮線、かつて幌内(三笠市)で採掘された石炭を小樽港まで運搬した、北海道で最初の鉄道とされる「官営幌内鉄道」の名残です。開通は1880年、廃線となったのは1985年のこと。廃線後は約1.6kmが遊歩道として整備され、当時のレールや踏切、遮断機がほぼそのままの状態で今に伝わっています。2018年には北海道遺産「小樽の鉄道遺産」に選定されました。イベント会場として賑わうこともある、地元でも人気の散歩道です。次はいよいよ、車で積丹半島へ向かいます。";
const TEMIYASEN_TO =
  "小樽運河から歩いておよそ5分、旧手宮線に着きます。かつて幌内(三笠市)で採掘された石炭を小樽港まで運搬した、北海道で最初の鉄道とされる「官営幌内鉄道」の名残です。開通は1880年、廃線となったのは1985年のこと。廃線後は約1.6kmが遊歩道として整備され、当時のレールや踏切、遮断機がほぼそのままの状態で今に伝わっています。2018年には北海道遺産「小樽の鉄道遺産」に選定されました。イベント会場として賑わうこともある、地元でも人気の散歩道です。レールや踏切が残っているので、足元に気をつけながら歩きましょう。この後は、車でおよそ60分、積丹半島へ向かいます。";

const MIKUNI_FROM1 = "新鮮なウニ丼をいただけるので、ここで昼食にしましょう。";
const MIKUNI_TO1 = "新鮮なウニ丼を味わえるので、ここで昼食にしましょう。";
const MIKUNI_FROM2 = "難解地名のひとつに数えられているのだそうです。";
const MIKUNI_TO2 = "難解地名のひとつに数えられています。";
const MIKUNI_FROM3 = "次は、美国漁港のそばにある黄金岬へ向かいます。";
const MIKUNI_TO3 = "次は、車でおよそ10分の黄金岬へ向かいます。";

const OGANE_FROM = "岬の先端からは、積丹ブルーと呼ばれる透明度の高い海を望めます。";
const OGANE_TO = "岬の先端からは、積丹ブルーと呼ばれる透明度の高い海を望めます。遊歩道は崖に近い場所もあるので、足元に気をつけましょう。";

const CAPE_FROM = "弾丸日帰りの旅は、この絶景を目に焼き付けて締めくくります。";
const CAPE_TO =
  "断崖沿いの遊歩道は、足元と風に気をつけて歩きましょう。弾丸日帰りの旅は、この絶景を目に焼き付けて締めくくります。小樽まで車でおよそ2時間、レンタカーを返して、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c1204e30%'`);
  const itinId = rows[0].id;

  const kitaichi = await findSpotInItinerary(itinId, { spotName: "北一硝子三号館" });
  const ungaPlaza = await findSpotInItinerary(itinId, { spotName: "小樽運河プラザ" });
  const temiyasen = await findSpotInItinerary(itinId, { spotName: "旧手宮線" });
  const mikuni = await findSpotInItinerary(itinId, { spotName: "積丹半島（美国町）" });
  const ogane = await findSpotInItinerary(itinId, { spotName: "黄金岬" });
  const cape = await findSpotInItinerary(itinId, { spotName: "積丹岬" });

  if (!temiyasen.memo?.includes(TEMIYASEN_FROM)) throw new Error("旧手宮線の文言が想定外です");
  if (!mikuni.memo?.includes(MIKUNI_FROM1) || !mikuni.memo?.includes(MIKUNI_FROM2) || !mikuni.memo?.includes(MIKUNI_FROM3)) {
    throw new Error("美国の文言が想定外です");
  }
  if (!ogane.memo?.includes(OGANE_FROM)) throw new Error("黄金岬の文言が想定外です");
  if (!cape.memo?.includes(CAPE_FROM)) throw new Error("積丹岬の文言が想定外です");

  console.log("確認OK。dayId:", temiyasen.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "小樽運河と積丹ブルー、絶景をめぐる日帰り弾丸プラン",
        description:
          "小樽運河の散策と、積丹半島の黄金岬・積丹岬。小樽と積丹の絶景を1日で回る弾丸プランです。",
      },
    });

    await tx.photo.deleteMany({ where: { spotId: mikuni.id } });

    let temiyasenMemo = temiyasen.memo!.replace(TEMIYASEN_FROM, TEMIYASEN_TO);
    let mikuniMemo = mikuni.memo!.replace(MIKUNI_FROM1, MIKUNI_TO1).replace(MIKUNI_FROM2, MIKUNI_TO2).replace(MIKUNI_FROM3, MIKUNI_TO3);
    let oganeMemo = ogane.memo!.replace(OGANE_FROM, OGANE_TO);
    let capeMemo = cape.memo!.replace(CAPE_FROM, CAPE_TO);

    const spots = await tx.spot.findMany({ where: { dayId: temiyasen.dayId }, orderBy: { orderNo: "asc" } });
    const items: SpotOrderItem[] = [];
    for (const s of spots) {
      if (s.id === kitaichi.id || s.id === ungaPlaza.id) continue; // 削除
      if (s.id === temiyasen.id) {
        items.push({
          id: s.id,
          data: { memo: temiyasenMemo, visitTime: t(11, 25), stayDurationMin: 45 },
        });
        continue;
      }
      if (s.id === mikuni.id) {
        items.push({
          id: s.id,
          data: {
            memo: mikuniMemo,
            visitTime: t(13, 25),
            stayDurationMin: 60,
            lat: 43.3008895,
            lng: 140.6028561,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 75, transitLine: null }] },
          },
        });
        continue;
      }
      if (s.id === ogane.id) {
        items.push({ id: s.id, data: { memo: oganeMemo, visitTime: t(14, 35) } });
        continue;
      }
      if (s.id === cape.id) {
        items.push({
          id: s.id,
          data: {
            memo: capeMemo,
            visitTime: t(15, 32),
            lat: 43.3721992,
            lng: 140.4622215,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 32, transitLine: null }] },
          },
        });
        continue;
      }
      items.push({ id: s.id, data: {} });
    }

    await setDaySpotOrder(
      temiyasen.dayId,
      [
        {
          create: {
            name: "日本銀行旧小樽支店金融資料館",
            memo: KINYU_MEMO,
            lat: 43.1963,
            lng: 141.0003,
            visitTime: t(9, 0),
            stayDurationMin: 45,
          },
        },
        {
          create: {
            name: "小樽運河",
            memo: UNGA_MEMO,
            lat: 43.197773,
            lng: 141.0030447,
            visitTime: t(9, 50),
            stayDurationMin: 25,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
          },
        },
        ...items,
      ],
      { remove: [kitaichi.id, ungaPlaza.id], tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

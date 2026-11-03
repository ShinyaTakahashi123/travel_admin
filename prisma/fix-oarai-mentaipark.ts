/**
 * 大洗(3a0ab316、公開中)の組み直し v2。「めんたいパーク大洗」(会社が運営する店の施設その
 * ものが行き先になっている)を外し、磯浜古墳群・日下ヶ塚古墳(令和2年(2020)3月、国の
 * 史跡に指定)に置きかえる(企画運営の指示、連絡用ファイル15番)。制作補助2が先に
 * 会社名の1文は外していたが、行き先そのものを公共の場所に置きかえる。
 *
 * v2での直し(法務の指摘2026-11-03):
 * ①点: tourism=information(案内板、node4172454050)ではなく、historic=archaeological_site
 *   (古墳そのもの、way416522950「日下ヶ塚」)のNominatimの値(36.3160153,140.5702962)に。
 * ②時刻: マリンタワー14:10+35分=14:45+car8分=14:53(古墳、14:51から変更)。
 *   古墳14:53+30分=15:23+car8分=15:31(幕末と明治の博物館、15:29から変更)。
 *   終わりは15:31+65分=16:36(日帰りの発車16:30〜17:00の中)。
 * ③説明文「サメの飼育種類数日本一を誇る」に、同じ文で「とされる」のぼかしを入れる。
 * ④「人骨とともに、」を外す(死にかかわる言葉を減らす、法務の提案)。
 *
 * 事実の出典: 文化庁文化遺産オンライン(online.bunka.go.jp/heritages/region/8/8309)
 * 「磯浜古墳群…古墳時代前期から中期初頭の古墳群」「日下ヶ塚古墳は墳長約101.4mの大型
 * 前方後円墳で、人骨のほか鏡2面・石製模造品・玉類・鉄製品など約4,000点の豊富な
 * 副葬品が出土し」。国史跡指定の年月(令和2年3月)は茨城県広報「ひばり」2020年11月号
 * (pref.ibaraki.jp/bugai/koho/kenmin/hibari/hibari-site/hibari202011/11tokusyu4.html)
 * 「今年3月に国の史跡に指定されました」で確認(発行が2020年11月号のため)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const DAY_ID_QUERY = { itineraryId: "3a0ab316-a30a-48a6-8cdb-3453683fb365" };

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TOWER_MEMO_OLD =
  "大洗マリンタワーは、昭和63年(1988)に開業した、高さ60mの展望タワーです。地上55mの展望フロアからは、大洗港や大洗の町並み、太平洋を一望でき、晴れた日には富士山や日光・那須の山々まで望むことができます。";
const TOWER_MEMO_NEW =
  "大洗マリンタワーは、昭和63年(1988)に開業した、高さ60mの展望タワーです。地上55mの展望フロアからは、大洗港や大洗の町並み、太平洋を一望でき、晴れた日には富士山や日光・那須の山々まで望むことができます。この後は、車でおよそ8分、日下ヶ塚古墳へ向かいましょう。";

const KOFUN_MEMO =
  "大洗マリンタワーから車でおよそ8分、日下ヶ塚古墳に着きます。磯浜古墳群を代表する古墳で、4世紀中ごろに築かれたとされる、全長およそ101mの前方後円墳です。鏡2面や石でつくられた飾り、玉、鉄製品など、およそ4,000点にもおよぶ副葬品が出土しています。古墳時代前期から中期初頭にかけて築かれた6基からなる磯浜古墳群は、令和2年(2020)3月、国の史跡に指定されました。大きな墳丘の姿を、外から静かに眺めましょう。この後は、車でおよそ8分、幕末と明治の博物館へ向かいましょう。";

const BAKUMATSU_MEMO_OLD_PREFIX = "幕末と明治の博物館は、";

const DESC_OLD =
  "太平洋の海中に立つ鳥居で有名な大洗磯前神社と、サメの飼育種類数日本一を誇るアクアワールド大洗。大洗の海の魅力を凝縮したプランです。";
const DESC_NEW =
  "太平洋の海中に立つ鳥居で有名な大洗磯前神社と、サメの飼育種類数日本一とされるアクアワールド大洗。大洗の海の魅力を凝縮したプランです。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: "3a0ab316-a30a-48a6-8cdb-3453683fb365" } });
  if (itin.description !== DESC_OLD) throw new Error("説明文: 現在値が期待と不一致");

  const tower = await prisma.spot.findFirstOrThrow({ where: { name: "大洗マリンタワー", day: DAY_ID_QUERY } });
  const mentai = await prisma.spot.findFirstOrThrow({ where: { name: "めんたいパーク大洗", day: DAY_ID_QUERY } });
  const bakumatsu = await prisma.spot.findFirstOrThrow({ where: { name: "幕末と明治の博物館", day: DAY_ID_QUERY } });
  const allSpots = await prisma.spot.findMany({ where: { day: DAY_ID_QUERY }, orderBy: { orderNo: "asc" } });
  const untouchedIds = allSpots
    .map((s) => s.id)
    .filter((id) => ![tower.id, mentai.id, bakumatsu.id].includes(id));

  if (tower.memo !== TOWER_MEMO_OLD) throw new Error("大洗マリンタワー: memo現在値が期待と不一致");
  if (!bakumatsu.memo?.startsWith(BAKUMATSU_MEMO_OLD_PREFIX)) throw new Error("幕末と明治の博物館: memo現在値が期待と不一致");

  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);
  console.log(`\n[大洗マリンタワー]\n旧: ${TOWER_MEMO_OLD}\n新: ${TOWER_MEMO_NEW}`);
  console.log(`\n[めんたいパーク大洗]\n削除(店そのものが行き先のため)`);
  console.log(`\n[日下ヶ塚古墳(新規)]\n新: ${KOFUN_MEMO}`);

  console.log("\n[新しい時刻・滞在・区間]");
  console.log(`大洗マリンタワー: 14:10(変更なし)/滞在35分(変更なし)`);
  console.log(`日下ヶ塚古墳(新規): 14:53(14:51から変更)/滞在30分(変更なし)/incoming car8分(OSRM2.3分+5)`);
  console.log(`幕末と明治の博物館: 15:31(15:29から変更)/incoming car8分(変更なし、OSRM3.0分+5)`);
  console.log(`終わり: 15:31+65分=16:36(日帰りの発車16:30〜17:00の中)`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itin.id }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      tower.dayId,
      [
        ...allSpots
          .filter((s) => untouchedIds.includes(s.id) && s.orderNo < tower.orderNo)
          .map((s) => ({ id: s.id, data: {} })),
        { id: tower.id, data: { memo: TOWER_MEMO_NEW } },
        {
          create: {
            name: "日下ヶ塚古墳",
            lat: 36.3160153,
            lng: 140.5702962,
            memo: KOFUN_MEMO,
            visitTime: t(14, 53),
            stayDurationMin: mentai.stayDurationMin,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
          },
        },
        {
          id: bakumatsu.id,
          data: {
            visitTime: t(15, 31),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
          },
        },
        ...allSpots
          .filter((s) => untouchedIds.includes(s.id) && s.orderNo > bakumatsu.orderNo)
          .map((s) => ({ id: s.id, data: {} })),
      ],
      { remove: [mentai.id], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

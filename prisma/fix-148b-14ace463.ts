/**
 * #148 14ace463の直し(2回目)。企画運営・法務の指摘。
 *
 * 企画運営:
 * ①遠野ふるさと村の150分は決まりA(時間合わせ)のため85分に短縮し、空いた
 *   時間に荒神神社(茅葺きの社殿、田園風景、遠野遺産。2本の既存競合に
 *   使われていない)を追加して6か所に。
 * ②続石の座標(国土地理院の地名点、同名候補5件のうち1件)は、地名点を
 *   使わない決まりに当たる。OSM・GSI番地点を探したが見つからず、座標は
 *   今回変更せず企画運営に相談中(別途連絡)。
 *
 * 法務:
 * ③座標: 遠野ふるさと村をw249358775のNominatimの中心39.3960403,
 *   141.5404068に(もとは丸めた値)。
 * ④座標: 遠野の市街(昼食)を、OSMの遠野駅の点(node264254176)
 *   39.3324341,141.5311486に(もとは大字だけのGSI点)。
 * ⑤座標: 山口の水車・デンデラ野は、遠野市公式サイト(認定番号9・21、
 *   遠野遺産)で「土淵町山口2地割9番地」「土淵町山口5地割」という具体的な
 *   番地まで確認できたが、国土地理院の住所検索では(全角・半角どちらの
 *   数字でも)大字の点までしか解決できなかった。OSMにも点がないため、
 *   座標は変更せず、この事情を企画運営・法務に報告(別途連絡)。
 * ⑥安全: 続石の山道の足元の一文・クマの決まった一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FURUSATO_FROM =
  "遠野駅からバスでおよそ25分、里山に広がる遠野ふるさと村に着きます。江戸時代の中ごろから明治の中ごろにかけて建てられた「南部曲り家」を6棟移築し、遠野地方の昔ながらの農村風景を再現した施設です。南部曲り家は、母屋と馬屋がひとつながりになったL字型の住まいで、かつて岩手県の広い範囲で見られました。敷地内には水車小屋や炭焼き小屋、田んぼも点在し、「まぶりっと」と呼ばれる語り部や案内人から、もちつきやそば打ちなど昔ながらの暮らしの体験を教わることもできます。この後は、車でおよそ25分、遠野の市街へ向かいましょう。";
const FURUSATO_TO =
  "遠野駅からバスでおよそ25分、里山に広がる遠野ふるさと村に着きます。江戸時代の中ごろから明治の中ごろにかけて建てられた「南部曲り家」を6棟移築し、遠野地方の昔ながらの農村風景を再現した施設です。南部曲り家は、母屋と馬屋がひとつながりになったL字型の住まいで、かつて岩手県の広い範囲で見られました。敷地内には水車小屋や炭焼き小屋、田んぼも点在し、「まぶりっと」と呼ばれる語り部や案内人から、もちつきやそば打ちなど昔ながらの暮らしの体験を教わることもできます。この後は、車でおよそ25分、荒神神社へ向かいましょう。";

const GOJIN_MEMO =
  "遠野ふるさと村から車でおよそ25分、荒神神社に着きます。茅葺き屋根の小さな社殿が、春は水を張った田んぼ、秋は黄金色の稲穂に囲まれる景色で知られ、遠野遺産の一つにも数えられています。権現様がまつられているので、静かに参拝しましょう。この後は、車でおよそ15分、遠野の市街へ向かいましょう。";

const LUNCH_FROM = "遠野ふるさと村から車でおよそ25分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ20分、山口の水車へ向かいましょう。";
const LUNCH_TO = "荒神神社から車でおよそ15分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ20分、山口の水車へ向かいましょう。";

const TSUZUKIISHI_FROM =
  "デンデラ野から車でおよそ28分、続石の駐車場に着きます。山道を15分ほど歩くと、台座の石の上に大きな石を載せた続石が現れます。土台の石は高さ2m、上に載る石は幅7m・奥行5m・厚さ2mあり、怪力で知られた弁慶がこの石を積み上げたという言い伝えから「弁慶の力石」とも呼ばれます。近くには、弁慶が枕にしたという枕石や、涙を流すと伝わる泣石もあります。見学を終えたら、歩いて駐車場まで戻り、車で遠野駅まで戻りましょう。";
const TSUZUKIISHI_TO =
  "デンデラ野から車でおよそ28分、続石の駐車場に着きます。山道を15分ほど歩くと、台座の石の上に大きな石を載せた続石が現れます。土台の石は高さ2m、上に載る石は幅7m・奥行5m・厚さ2mあり、怪力で知られた弁慶がこの石を積み上げたという言い伝えから「弁慶の力石」とも呼ばれます。近くには、弁慶が枕にしたという枕石や、涙を流すと伝わる泣石もあります。山道は足元に気をつけて歩きましょう。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。見学を終えたら、歩いて駐車場まで戻り、車で遠野駅まで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const furusato = await findSpotInItinerary(itinId, { spotName: "遠野ふるさと村" });
  const lunch = await findSpotInItinerary(itinId, { spotName: "遠野の市街(昼食)" });
  const suisha = await findSpotInItinerary(itinId, { spotName: "山口の水車" });
  const dendera = await findSpotInItinerary(itinId, { spotName: "デンデラ野" });
  const tsuzuki = await findSpotInItinerary(itinId, { spotName: "続石" });
  const dayId = furusato.dayId;

  if (!furusato.memo?.includes(FURUSATO_FROM)) throw new Error("遠野ふるさと村の文言が想定外です");
  if (lunch.memo !== LUNCH_FROM) throw new Error("遠野の市街(昼食)の文言が想定外です");
  if (tsuzuki.memo !== TSUZUKIISHI_FROM) throw new Error("続石の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: furusato.id,
        data: {
          lat: 39.3960403,
          lng: 141.5404068,
          stayDurationMin: 85,
          memo: furusato.memo!.replace(FURUSATO_FROM, FURUSATO_TO),
        },
      },
      {
        create: {
          name: "荒神神社",
          address: "遠野市青笹町中沢二十一地割",
          lat: 39.304073,
          lng: 141.581909,
          visitTime: t(11, 20),
          stayDurationMin: 65,
          memo: GOJIN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25 }] },
        },
      },
      {
        id: lunch.id,
        data: {
          lat: 39.3324341,
          lng: 141.5311486,
          visitTime: t(12, 40),
          memo: LUNCH_TO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
      {
        id: suisha.id,
        data: {
          visitTime: t(13, 50),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
        },
      },
      {
        id: dendera.id,
        data: { visitTime: t(14, 30) },
      },
      {
        id: tsuzuki.id,
        data: {
          visitTime: t(15, 28),
          stayDurationMin: 80,
          memo: TSUZUKIISHI_TO,
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

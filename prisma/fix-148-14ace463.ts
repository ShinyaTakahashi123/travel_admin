/**
 * #148 14ace463「遠野ふるさと村で日本の原風景に出会う、定番の遠野日帰りプラン」の
 * 直し。1日4か所以上・9時ごろ〜17時ごろの決まりに合わせる。
 *
 * もとは遠野ふるさと村の1か所のみ(09:30〜11:30)、終始案内役の話し方(皆様/ご案内)
 * だった。既存の競合(388f880b=伝承園・カッパ淵・常堅寺・遠野駅前昼食・とおの物語の
 * 館・遠野市立博物館・卯子酉神社・五百羅漢、9dff2862=1泊2日でとおの物語の館・遠野
 * 市立博物館・鍋倉公園・道の駅遠野風の丘・遠野馬の里・遠野郷八幡宮・五百羅漢・卯子酉
 * 神社・早池峯神社・遠野ふるさと村・伝承園・カッパ淵・福泉寺・めがね橋・遠野蔵の道
 * ギャラリー)と重ならない3か所(山口の水車・デンデラ野・続石)+昼食を追加。
 *
 * 候補の千葉家住宅(実物の南部曲り家、国重要文化財)は、平成28年(2016)からの大
 * 規模修理で現在も休館中と確認できたため使っていない。
 *
 * 車の旅(遠野駅でレンタカーを借りる想定)。座標は山口の水車・デンデラ野は国土地理院
 * の番地点(OSMに単独の点がないため)、続石は国土地理院の地名点(複数の同名候補から、
 * 遠野市綾織町に近い座標を採用)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FURUSATO_FROM =
  "皆様、本日ご案内するのは遠野ふるさと村です。遠野駅からバスで25分ほどの里山に広がるこの施設では、江戸時代の中頃から明治の中頃にかけて建てられた「南部曲り家」を6棟移築し、遠野地方の昔ながらの農村風景を再現しています。南部曲り家とは、母屋と馬屋がひとつながりになった、この地方ならではのL字型の住まいで、かつて岩手県の広い範囲で見られたものです。人と馬が同じ屋根の下で暮らしてきたことからも、農作業に欠かせない馬をどれほど大切にしてきたかがうかがえます。敷地内には水車小屋や炭焼き小屋、田んぼも点在し、「まぶりっと」と呼ばれる語り部や案内人が、もちつきやそば打ちなど、昔ながらの暮らしの体験を教えてくれます。日本の懐かしい原風景の中で、遠野に伝わる暮らしの知恵をゆっくりと味わっていただければと思います。";
const FURUSATO_TO =
  "遠野駅からバスでおよそ25分、里山に広がる遠野ふるさと村に着きます。江戸時代の中ごろから明治の中ごろにかけて建てられた「南部曲り家」を6棟移築し、遠野地方の昔ながらの農村風景を再現した施設です。南部曲り家は、母屋と馬屋がひとつながりになったL字型の住まいで、かつて岩手県の広い範囲で見られました。敷地内には水車小屋や炭焼き小屋、田んぼも点在し、「まぶりっと」と呼ばれる語り部や案内人から、もちつきやそば打ちなど昔ながらの暮らしの体験を教わることもできます。この後は、車でおよそ25分、遠野の市街へ向かいましょう。";

const LUNCH_MEMO =
  "遠野ふるさと村から車でおよそ25分、遠野の市街に着きます。中央通りの周辺には食堂やそば店が並んでいるので、ここで昼食をとりましょう。遠野は「遠野物語」の舞台として知られ、まちの中にも河童や座敷わらしにまつわる看板をいくつも見かけます。この後は、車でおよそ20分、山口の水車へ向かいましょう。";

const SUISHA_MEMO =
  "遠野の市街から車でおよそ20分、山口の水車に着きます。茅葺きに芝草をのせた水車小屋で、かつて雑穀類の脱穀や製粉に使われていました。遠野を代表する農村風景の一つとして知られています。近くには、「遠野物語」を柳田国男に語った佐々木喜善の生家もあります。この後は、車でおよそ15分、デンデラ野へ向かいましょう。";

const DENDERANO_MEMO =
  "山口の水車から車でおよそ15分、デンデラ野に着きます。「遠野物語」に伝わる土地で、60歳を過ぎた年寄りたちがここに集まって暮らしたという言い伝えが残っています。昼は里に下りて農家の手伝いをし、夜はここに戻って過ごしたとされ、古い遠野の暮らしや死生観を伝える場所として知られています。この後は、車でおよそ28分、続石へ向かいましょう。";

const TSUZUKIISHI_MEMO =
  "デンデラ野から車でおよそ28分、続石の駐車場に着きます。山道を15分ほど歩くと、台座の石の上に大きな石を載せた続石が現れます。土台の石は高さ2m、上に載る石は幅7m・奥行5m・厚さ2mあり、怪力で知られた弁慶がこの石を積み上げたという言い伝えから「弁慶の力石」とも呼ばれます。近くには、弁慶が枕にしたという枕石や、涙を流すと伝わる泣石もあります。見学を終えたら、歩いて駐車場まで戻り、車で遠野駅まで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '14ace463%'`);
  const itinId = rows[0].id;
  const furusato = await findSpotInItinerary(itinId, { spotName: "遠野ふるさと村" });
  const dayId = furusato.dayId;

  if (!furusato.memo?.includes(FURUSATO_FROM)) throw new Error("遠野ふるさと村の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: furusato.id,
        data: {
          visitTime: t(9, 30),
          stayDurationMin: 150,
          memo: furusato.memo!.replace(FURUSATO_FROM, FURUSATO_TO),
        },
      },
      {
        create: {
          name: "遠野の市街(昼食)",
          address: "遠野市中央通り",
          lat: 39.329964,
          lng: 141.52948,
          visitTime: t(12, 25),
          stayDurationMin: 50,
          memo: LUNCH_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25 }] },
        },
      },
      {
        create: {
          name: "山口の水車",
          address: "遠野市土淵町山口",
          lat: 39.35397,
          lng: 141.627289,
          visitTime: t(13, 35),
          stayDurationMin: 25,
          memo: SUISHA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
        },
      },
      {
        create: {
          name: "デンデラ野",
          address: "遠野市土淵町土淵",
          lat: 39.351601,
          lng: 141.562805,
          visitTime: t(14, 15),
          stayDurationMin: 30,
          memo: DENDERANO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
      {
        create: {
          name: "続石",
          address: "遠野市綾織町上綾織",
          lat: 39.3368744822276,
          lng: 141.4490314313,
          visitTime: t(15, 13),
          stayDurationMin: 85,
          memo: TSUZUKIISHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 28 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

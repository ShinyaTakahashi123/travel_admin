/**
 * #133 dba1a628の直し(3回目)。企画運営・法務の指摘をまとめて反映。
 * ・両日に昼食スポットを新設(小町通り/長谷駅のまわり)
 * ・滞在の長さの見直し(高徳院・銭洗弁財天ほか)
 * ・書き出しの抜け(建長寺・鶴岡八幡宮・銭洗弁財天・甘縄神明神社)を追加
 * ・「ご利益」表現の削除(宝戒寺・成就院)
 * ・御霊神社の日付(9月18日→9月の例大祭)
 * ・建長寺にぼかし(とされる寺です)を追加
 * ・座標6か所の修正(法務の指摘)
 * ・説明文の2か所を直す
 * ・妙本寺の結びを直す
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESC_OLD =
  "源頼朝ゆかりの鶴岡八幡宮、鎌倉五山の禅寺・円覚寺と建長寺、「鎌倉大仏」で知られる高徳院、日本最大級の十一面観音を祀る長谷寺、「銭洗い」の風習で知られる銭洗弁財天宇賀福神社をめぐり、鎌倉の社寺で御朱印をいただく1泊2日です。御朱印は、お参りした証としていただくものです。先にお参りを済ませてから、授与所でお願いしましょう。受付の時間や御朱印の種類、書き置き（紙でのお渡し）かどうかは寺社ごとに異なり、変わることもあるので、お出かけ前に各寺社の公式の案内で確かめてください。御朱印の売り買いはやめましょう。";
const DESC_NEW =
  "源頼朝ゆかりの鶴岡八幡宮、鎌倉五山の禅寺・円覚寺と建長寺、「鎌倉大仏」で知られる高徳院、日本最大級とされる十一面観音を祀る長谷寺、「銭洗い」の風習で知られる銭洗弁財天宇賀福神社をめぐり、鎌倉の社寺で御朱印をいただく1泊2日です。御朱印は、お参りした証としていただくものです。先にお参りを済ませてから、授与所でお願いしましょう。受付の時間や御朱印の種類、書き置き（紙でのお渡し）かどうかは寺社ごとに異なり、変わることもあるので、お出かけ前に各寺社の公式の案内で確かめましょう。御朱印の売り買いはやめましょう。";

const KENCHOJI_MEMO =
  "浄智寺から歩いておよそ16分、建長寺に着きます。建長5年(1253)、鎌倉幕府5代執権・北条時頼が、日本で初めての禅の専門道場として開いたとされる寺です。開山には、南宋から渡来した高僧・蘭渓道隆が招かれました。鎌倉五山の第一位に位置づけられ、最盛期には1,000人を超える修行僧がこの地で禅の修行に打ち込んだと伝えられています。総門・三門・仏殿・法堂が一直線に並ぶ伽藍配置は、禅宗寺院ならではの厳かな空気を漂わせています。今も座禅会が開かれる修行の場ですので、静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ21分、鎌倉駅近くの小町通りへ向かいましょう。";

const KOMACHI_MEMO =
  "建長寺から歩いておよそ21分、鎌倉駅近くの小町通りに着きます。鶴岡八幡宮の一の鳥居から鎌倉駅東口まで、およそ360メートルにわたって食事処やみやげ物店が軒を連ねる、鎌倉でもっとも賑やかな通りです。ここで昼食をとりましょう。食事を終えたら、歩いておよそ9分、宝戒寺へ向かいましょう。";

const HOKAIJI_MEMO =
  "小町通りから歩いておよそ9分、宝戒寺に着きます。建武2年(1335)、後醍醐天皇の命を受けた足利尊氏が、鎌倉幕府の滅亡で亡くなった北条一族の霊を慰めるために建てたと伝えられる寺です。このあたりは、北条氏の執権が代々邸宅を構えた「小町亭」の跡地でもあります。9月には境内一面に萩の花が咲くことから「萩寺」としても知られています。本尊は、子育てや安産の地蔵として親しまれてきた子育経読地蔵大菩薩です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ7分、鶴岡八幡宮へ向かいましょう。";

const TSURUGAOKA_MEMO =
  "宝戒寺から歩いておよそ7分、鶴岡八幡宮に着きます。源頼朝の祖先・源頼義が、前九年の役の勝利に感謝して京都の石清水八幡宮を鎌倉に勧請し、由比郷鶴岡に祀ったのが始まりと伝えられています。治承4年(1180)、鎌倉に入った源頼朝がこの地に遷し、鎌倉幕府の守護神として整備しました。参道の若宮大路は、京の朱雀大路にならって頼朝自らも整備に加わったと伝えられ、由比ヶ浜から一直線に本宮へと続いています。流鏑馬や舞楽など、鎌倉幕府ゆかりの神事が今も受け継がれる、鎌倉の町の象徴です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ15分、妙本寺へ向かいましょう。";

const MYOHONJI_MEMO =
  "鶴岡八幡宮から歩いておよそ15分、妙本寺に着きます。鎌倉幕府の有力な御家人だった比企能員の屋敷があった「比企谷」に建つ、日蓮宗では最も古い寺院の一つとされるお寺です。比企一族が滅ぼされたのち、ただ一人生き残った末子・能本が、晩年をともにした日蓮に法華堂を開くことを許し、これが寺の始まりと伝えられています。境内では、春には桜とともに、薄紅色の海棠(かいどう)の花が咲き誇ります。静かに、敬意を持ってお参りしましょう。この日は、鎌倉駅のまわりの宿に泊まりましょう。";

const AMANAWA_MEMO =
  "鎌倉駅のまわりの宿を出て、江ノ電で長谷駅へ向かいます。長谷駅から歩いておよそ5分、長谷の高台に鎮座する甘縄神明神社に着きます。和銅3年(710)、行基が建てたという伝承が残り、鎌倉で最も古い神社の一つとされています。天照大御神を祭神とし、源頼家がこの社に祈願したところ、のちに長男・一幡に恵まれたという言い伝えから、安産の神社としても信仰されてきました。鎌倉幕府の有力な武将・和田義盛が生まれた地とも伝えられています。境内からは、鎌倉の海を望むこともできます。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、高徳院へ向かいましょう。";

const HASEDERA_MEMO =
  "高徳院から歩いておよそ8分、長谷寺に着きます。寺伝によれば、徳道上人が一本の木から2体の十一面観音像を彫り、1体をこの地に祀ったのが始まりと伝えられ、像高9.18mの本尊は、木造の仏像としては日本最大級とされています。境内の石段沿いには、3体並んだ「良縁地蔵」が安置されており、3体すべてを写真に収めると良縁に恵まれるという言い伝えがあります。6月には、40種以上およそ2500株のあじさいが咲き誇る「あじさい路」も見どころの一つです。見晴台からは由比ヶ浜や三浦半島まで見渡せます。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、長谷駅のまわりへ向かいましょう。昼食をとりましょう。";

const HASEEKI_MEMO =
  "長谷寺から歩いておよそ5分、長谷駅のまわりに着きます。江ノ電長谷駅の周辺には、食事処やしらす料理の店、和菓子店などが並んでいます。ここで昼食をとりましょう。食事を終えたら、歩いておよそ5分、御霊神社へ向かいましょう。";

const GORYO_MEMO =
  "長谷駅のまわりから歩いておよそ5分、御霊神社に着きます。源頼朝が鎌倉に入る以前からこの地にあったと伝えられる古い神社で、後三年の役で活躍した武将・鎌倉権五郎景政を祀っていることから、「権五郎神社」とも呼ばれています。境内のすぐそばを江ノ電が走り抜ける光景は、鎌倉らしい眺めとして知られています。9月の例大祭では、さまざまな仮面をつけた10人が練り歩く「面掛行列」が行われ、国の重要無形民俗文化財に指定されています。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ4分、成就院へ向かいましょう。";

const JOJU_MEMO =
  "御霊神社から歩いておよそ4分、成就院に着きます。承久元年(1219)、鎌倉幕府3代執権・北条泰時が、空海(弘法大師)が平安時代にこの地で修行したという伝承に基づいて開いたと伝えられる寺です。極楽寺坂切通のそばにあり、縁結びの寺として親しまれています。石段の参道からは、由比ヶ浜を見渡す眺めが広がります。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ35分、銭洗弁財天宇賀福神社へ向かいましょう。";

const ZENIARAI_MEMO =
  "成就院から歩いておよそ35分、銭洗弁財天宇賀福神社に着きます。文治元年(1185)、源頼朝の夢に、人の頭と蛇の体を持つ水神・宇賀福神が現れ、「この地に湧く水で神仏を供養すれば天下が治まる」とのお告げを受けたことから、社を建てたのが始まりと伝えられています。正嘉元年(1257)には、5代執権・北条時頼が、このお告げの水でお金を洗い、一族の繁栄を祈願したことから、「銭洗い」の風習が始まったといわれています。奥宮の洞窟に湧く「銭洗水」は鎌倉五名水の一つに数えられ、この水でお金を洗うと福を招くと伝えられ、多くの参拝者が訪れます。静かに、敬意を持ってお参りしましょう。参拝を終えたら、歩いておよそ20分、鎌倉駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'dba1a628%'`);
  const itinId = rows[0].id;

  const engakuji = await findSpotInItinerary(itinId, { spotName: "円覚寺" });
  const joxhiji = await findSpotInItinerary(itinId, { spotName: "浄智寺" });
  const kenchoji = await findSpotInItinerary(itinId, { spotName: "建長寺" });
  const hokaiji = await findSpotInItinerary(itinId, { spotName: "宝戒寺" });
  const tsurugaoka = await findSpotInItinerary(itinId, { spotName: "鶴岡八幡宮" });
  const myohonji = await findSpotInItinerary(itinId, { spotName: "妙本寺" });
  const amanawa = await findSpotInItinerary(itinId, { spotName: "甘縄神明神社" });
  const kotokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });
  const hasedera = await findSpotInItinerary(itinId, { spotName: "長谷寺" });
  const goryo = await findSpotInItinerary(itinId, { spotName: "御霊神社" });
  const joju = await findSpotInItinerary(itinId, { spotName: "成就院" });
  const zeniarai = await findSpotInItinerary(itinId, { spotName: "銭洗弁財天宇賀福神社" });

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: itinId } });
  if (itin.description !== DESC_OLD) throw new Error("説明文が想定と一致しません");

  console.log("day1:", engakuji.dayId, "day2:", kotokuin.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESC_NEW } });

    const day1: SpotOrderItem[] = [
      { id: engakuji.id, data: { visitTime: t(9, 30), stayDurationMin: 70, lat: 35.337936, lng: 139.54782 } },
      {
        id: joxhiji.id,
        data: {
          visitTime: t(10, 48),
          stayDurationMin: 30,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        id: kenchoji.id,
        data: {
          visitTime: t(11, 34),
          stayDurationMin: 65,
          lat: 35.332445,
          lng: 139.557534,
          memo: KENCHOJI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
        },
      },
      {
        create: {
          name: "小町通り",
          lat: 35.3207763,
          lng: 139.5519605,
          visitTime: t(13, 0),
          stayDurationMin: 60,
          memo: KOMACHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
        },
      },
      {
        id: hokaiji.id,
        data: {
          visitTime: t(14, 9),
          stayDurationMin: 30,
          memo: HOKAIJI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        id: tsurugaoka.id,
        data: {
          visitTime: t(14, 46),
          stayDurationMin: 60,
          lat: 35.326045,
          lng: 139.556391,
          memo: TSURUGAOKA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        id: myohonji.id,
        data: {
          visitTime: t(16, 1),
          stayDurationMin: 35,
          memo: MYOHONJI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(engakuji.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      { id: amanawa.id, data: { visitTime: t(9, 30), stayDurationMin: 40, memo: AMANAWA_MEMO } },
      {
        id: kotokuin.id,
        data: {
          visitTime: t(10, 15),
          stayDurationMin: 40,
          lat: 35.316499,
          lng: 139.535729,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: hasedera.id,
        data: {
          visitTime: t(11, 3),
          stayDurationMin: 85,
          lat: 35.312269,
          lng: 139.533309,
          memo: HASEDERA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "長谷駅のまわり",
          lat: 35.3112793,
          lng: 139.5358725,
          visitTime: t(12, 33),
          stayDurationMin: 85,
          memo: HASEEKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: goryo.id,
        data: {
          visitTime: t(14, 3),
          stayDurationMin: 35,
          lat: 35.310992,
          lng: 139.532789,
          memo: GORYO_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: joju.id,
        data: {
          visitTime: t(14, 42),
          stayDurationMin: 35,
          memo: JOJU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      {
        id: zeniarai.id,
        data: {
          visitTime: t(15, 52),
          stayDurationMin: 40,
          memo: ZENIARAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 35 }] },
        },
      },
    ];
    await setDaySpotOrder(kotokuin.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

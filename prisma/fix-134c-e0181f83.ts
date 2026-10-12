/**
 * #134 e0181f83の直し(3回目)。企画運営・法務の指摘をまとめて反映。
 * ・座標3か所をOSMの実点(名前のある点)に修正
 * ・大聖院105→40分、山頂110→65分に短縮
 * ・安全の一文(ロープウエーの乗り降り・登山道の足元)を追加
 * ・大聖院の書き出しが78026dc9と63%似ていたため書き換え
 * ・勅願堂の文の分かりにくさを直す
 * ・「お過ごしください」等の案内役の言い方を直す
 * ・紅葉谷公園の書き出しにフェリーの一文、山の上に食事処がない注意を追加
 * (多宝塔・清盛神社・宮島水族館は、確認の結果すべて他の既存しおり
 *  (3155fabf・78026dc9)で使用済みのため追加せず。企画運営へ別途申し送り)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MOMIJIDANI_MEMO =
  "宮島口から宮島フェリーでおよそ10分、宮島桟橋に着いたら、歩いておよそ15分、紅葉谷公園に着きます。弥山の山麓、紅葉谷川沿いに広がる公園で、弥山へ登るいくつかの道のうち「紅葉谷コース」の起点でもあり、宮島ロープウエーの紅葉谷駅もこの公園の中にあります。山の上には食事の店がないので、昼食を用意してから登りましょう。渓流のせせらぎを聞きながら、ひと息ついて、これから登る弥山に思いを巡らせましょう。この後は、宮島ロープウエーで榧谷駅を経て、およそ14分、獅子岩駅へ向かいましょう。乗り降りの際は、係の人の案内に従いましょう。";

const SHISHIIWA_MEMO =
  "紅葉谷駅から宮島ロープウエーで榧谷駅を経て、およそ14分、山上の終点・獅子岩駅に着きます。駅のすぐそばには、ライオンの姿に見えるとされる巨岩「獅子岩」があります。ここから弥山山頂までは、さらに徒歩での登山となります。歩きやすい靴で、足元に気をつけて歩きましょう。この後は、弥山本堂・霊火堂や獅子岩展望台を経て、歩いておよそ30分、弥山山頂展望台へ向かいましょう。";

const MISEN_MEMO =
  "獅子岩駅から歩いておよそ30分、弥山山頂展望台に着きます。途中には弥山本堂・霊火堂があり、弘法大師空海の修行以来1200年以上消えることなく燃え続けているとされる「消えずの火」があります。この火は、広島平和記念公園の「平和の灯」の元火にもなったと伝えられています。標高535mのこの山は、大同元年(806)に空海が開いたと伝えられる、古くからの信仰の対象で、真言密教の修行の場として大切にされてきました。大きな岩が積み重なる山頂の展望台からは、瀬戸内海に浮かぶ島々を一望する多島美のパノラマが広がります。北側の斜面には、国の天然記念物に指定された「弥山原始林」が広がり、暖温帯性の針葉樹と南方系の植物が共存する貴重な自然も見られます。厳島神社とその前面の海、そしてこの弥山の原始林をあわせた一帯は、世界文化遺産にも登録されています。持ってきた軽食やお弁当を広げて、ここで昼食をとりましょう。今も信仰の対象となっている霊山ですので、静かに過ごしましょう。この後は、大聖院コースを歩いておよそ75分、釈迦涅槃堂へ向かいましょう。石段の続く下り道です。歩きやすい靴で、足元に気をつけて歩きましょう。";

const SHAKANEHAN_MEMO =
  "弥山山頂展望台から、大聖院コースを歩いておよそ75分、釈迦涅槃堂に着きます。大聖院の境内にあるお堂で、お釈迦様が涅槃(亡くなる際の姿)で安置された涅槃像を祀っています。長い下り道を歩いてきた体を、ここで少し休めましょう。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、大聖院へ向かいましょう。";

const DAISHOIN_MEMO =
  "釈迦涅槃堂から歩いておよそ5分、大聖院に着きます。大聖院コースを歩いて下りてきた道の終着点で、空海が開いたと伝えられる弥山のふもとに建つ寺です。本堂である勅願堂には、豊臣秀吉が寄進したと伝えられる本尊・波切不動明王像が安置されています。もとの建物は、12世紀に宮島を訪れた鳥羽天皇の命により建てられた、境内で最も古い建物でしたが、焼失し、明治43年(1910)に今の建物が再建されました。「勅願」とは、天皇が国の平和と繁栄を祈ることを意味します。静かに、敬意を持ってお参りしましょう。参拝を終えたら、歩いておよそ10分、宮島桟橋へ向かい、帰りのフェリーに乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;

  const momijidani = await findSpotInItinerary(itinId, { spotName: "紅葉谷公園" });
  const shishiiwa = await findSpotInItinerary(itinId, { spotName: "獅子岩駅" });
  const misen = await findSpotInItinerary(itinId, { spotName: "弥山（宮島ロープウェー）" });
  const shakanehan = await findSpotInItinerary(itinId, { spotName: "釈迦涅槃堂" });
  const daishoin = await findSpotInItinerary(itinId, { spotName: "大聖院" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: momijidani.id }, data: { memo: MOMIJIDANI_MEMO } }),
    prisma.spot.update({ where: { id: shishiiwa.id }, data: { memo: SHISHIIWA_MEMO } }),
    prisma.spot.update({
      where: { id: misen.id },
      data: { lat: 34.279702, lng: 132.319646, stayDurationMin: 65, memo: MISEN_MEMO },
    }),
    prisma.spot.update({
      where: { id: shakanehan.id },
      data: { lat: 34.291503, lng: 132.318658, visitTime: t(13, 39), memo: SHAKANEHAN_MEMO },
    }),
    prisma.spot.update({
      where: { id: daishoin.id },
      data: { lat: 34.291729, lng: 132.318578, visitTime: t(14, 4), stayDurationMin: 40, memo: DAISHOIN_MEMO },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

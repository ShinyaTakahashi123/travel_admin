/**
 * 28352652（那須どうぶつ王国で動物とふれあう、家族で楽しむ那須日帰りプラン）の残り2点の対応
 *
 * 【1. 那須温泉神社の点】
 * OSM way452370586のNominatimの中心(37.0999602,139.9989996、6けたに丸め37.099960,139.999000)が
 * 本番の今の値(37.09996,139.999)と同じ値のため、点は変更しない(企画運営・法務 11/05)。
 *
 * 【2. 王国ファームの昼食を切り出す】
 * 王国ファーム→りんどう湖ファミリー牧場の車ルート上にある「道の駅那須高原 友愛の森」
 * (highway=services way414890757、Nominatim中心37.0413767,140.0134551、6けたに丸め
 * 37.041377,140.013455)に昼食を切り出す(企画運営・法務 11/05)。行き先の名前は
 * 「道の駅那須高原 友愛の森のあたりで昼食」。メモで店・品・値段・買い物の文は書かない。
 *
 * 区間(OSRM car。ceil(秒/60)+5):
 * 王国ファーム→道の駅: 1394.1秒→ceil24+5=29分(直行の29分とほぼ同じで、ほぼルート上)
 * 道の駅→りんどう湖: 450.9秒→ceil8+5=13分
 *
 * 王国ファームの滞在を90分→50分(見学のみ。延ばしではない)にし、「ここで昼食にしましょう」を外す。
 * 道の駅で昼食40分(35〜45分の範囲内)を新しいスポットとして挿入する。
 *
 * 通しの時刻: 王国タウン9:30(滞在90、変更なし)→王国ファーム11:08(滞在50)→
 * 道の駅(昼食)12:27(滞在40)→りんどう湖13:20(滞在100、変更なし)→鹿の湯15:17(滞在15、変更なし)→
 * 那須温泉神社15:40(滞在30、変更なし)→殺生石16:14(滞在45、変更なし)→16:59終了。
 * もとの16:46から13分のびるが、日帰りの決まり(16:30〜17:00)の中(企画運営・法務 11/05)。
 *
 * orderNoの付け替え: 新しい昼食スポットをorderNo3に入れるため、殺生石(6→7)・那須温泉神社(5→6)・
 * 鹿の湯(4→5)・りんどう湖(3→4)の順に後ろから動かす。
 *
 * 確認: 法務・企画運営
 */

import { prisma } from "../src/lib/prisma";

const DAY_ID = "d1785848-03e8-40da-ac14-28622dab7c16";

function t(h: number, m: number): Date {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const FARM_ID = "1f4bc053-75ed-4786-88ef-7e7594cf202a";
const LUNCH_ID = "43df885d-25c1-4b6f-8f49-c2760e3bec74";
const RINDO_ID = "d825e018-87d1-4323-ab31-12d82c510528";
const SHIKANOYU_ID = "d2575a6d-a0ab-4dd1-8585-c62c3857705c";
const JINJA_ID = "84a420ca-5006-4df6-bb8b-c2990fa7c745";
const SESSHOSEKI_ID = "1038341e-21e1-476e-9b37-4674ee26e606";

const UPDATE_SPOTS: {
  id: string;
  orderNo: number;
  visitTime: Date;
  stayDurationMin: number;
  memo: string;
  leg?: { transitMode: string; transitDurationMin: number };
}[] = [
  {
    id: FARM_ID,
    orderNo: 2,
    visitTime: t(11, 8),
    stayDurationMin: 50,
    memo:
      "王国タウンから、ワンニャンバスでおよそ8分、王国ファームに着きます。雄大な自然の中、ヒツジファームやカンガルーファーム、アルパカの丘など、動物たちとふれあえる施設が集まっているエリアです。ライドパークやホースコーナーもあります。見学を終えたら、車でおよそ29分、道の駅那須高原 友愛の森のあたりへ向かいましょう。",
  },
  {
    id: RINDO_ID,
    orderNo: 4,
    visitTime: t(13, 20),
    stayDurationMin: 100,
    memo:
      "道の駅那須高原 友愛の森のあたりから、車でおよそ13分、りんどう湖ファミリー牧場に着きます。「りんどう湖」を中心に、観光牧場と遊園地の両方が楽しめるテーマパークです。エサやり体験やちびっこ乗馬、乳牛の乳しぼりなど、動物とのふれあいが充実しているほか、アイスクリームやバターの手作り体験もあります。湖上をワイヤーで滑空するジップラインKAKKUもあります。那須連山を望むのどかな園内で、家族みんなで楽しみましょう。見学を終えたら、車でおよそ17分、鹿の湯へ向かいましょう。",
    leg: { transitMode: "car", transitDurationMin: 13 },
  },
  {
    id: SHIKANOYU_ID,
    orderNo: 5,
    visitTime: t(15, 17),
    stayDurationMin: 15,
    memo:
      "りんどう湖ファミリー牧場から、車でおよそ17分、鹿の湯に着きます。七世紀前半、舒明天皇の御世に開けたと伝わる、歴史ある共同浴場です。鹿が傷を癒していたという、鹿の湯の名の由来とされる伝説が伝わります。木造の湯小屋を外から眺め、漂う硫黄の香りに、およそ1300年の歴史を感じてみましょう。見学を終えたら、歩いておよそ8分、那須温泉神社へ向かいましょう。",
  },
  {
    id: JINJA_ID,
    orderNo: 6,
    visitTime: t(15, 40),
    stayDurationMin: 30,
    memo:
      "鹿の湯から歩いておよそ8分、那須温泉神社に着きます。舒明天皇の時代、630年頃に、猟師が白鹿を追って山に入り、谷に湧く温泉を見つけたことから、温泉の守り神として創建されたと伝わる古社です。境内には鳥居や社殿が並び、那須温泉の守り神として、今も大切にされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いておよそ4分、殺生石へ向かいましょう。",
  },
  {
    id: SESSHOSEKI_ID,
    orderNo: 7,
    visitTime: t(16, 14),
    stayDurationMin: 45,
    memo:
      "那須温泉神社から歩いておよそ4分、殺生石に着きます。平安の昔、帝に愛された妃「玉藻の前」の正体が、唐・天竺から飛来した九尾の狐だったという那須の伝説にまつわる史跡です。陰陽師の阿倍泰成に正体を見破られた狐は、やがて那須の地で巨大な石に姿を変え、毒気をふりまいたと伝わります。今もあたりには独特な硫黄の香りが漂い、伝説の余韻を感じさせます。このあたりは那須岳(茶臼岳)の活動による火山ガスが今も噴出しているため、気象庁や現地の最新の案内で火山の情報を確かめ、遊歩道から外れないようにしましょう。この一帯は、国の名勝「おくのほそ道の風景地」の一つに指定されています（2014年3月18日指定）。帰りは、車でおよそ33分、那須塩原駅の近くで車を返しましょう。那須どうぶつ王国で動物とふれあう、家族で楽しむ那須日帰りプランは、これで終わりです。",
  },
];

const LUNCH = {
  id: LUNCH_ID,
  name: "道の駅那須高原 友愛の森のあたりで昼食",
  orderNo: 3,
  visitTime: t(12, 27),
  stayDurationMin: 40,
  lat: "37.041377",
  lng: "140.013455",
  memo:
    "王国ファームから、車でおよそ29分、道の駅那須高原 友愛の森のあたりに着きます。このあたりで昼食にしましょう。腹ごしらえをしたら、車でおよそ13分、りんどう湖ファミリー牧場へ向かいましょう。",
  leg: { transitMode: "car", transitDurationMin: 29 },
};

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード ===");

  for (const s of UPDATE_SPOTS) {
    console.log("----");
    console.log("名前:", s.id, "orderNo:", s.orderNo);
    console.log(
      "時刻:",
      `${String(s.visitTime.getUTCHours()).padStart(2, "0")}:${String(s.visitTime.getUTCMinutes()).padStart(2, "0")}`,
      "滞在:",
      s.stayDurationMin,
    );
    console.log("memo:", s.memo);
    if (s.leg) console.log("  区間:", JSON.stringify(s.leg));
  }
  console.log("----");
  console.log("名前:", LUNCH.name, "orderNo:", LUNCH.orderNo);
  console.log(
    "時刻:",
    `${String(LUNCH.visitTime.getUTCHours()).padStart(2, "0")}:${String(LUNCH.visitTime.getUTCMinutes()).padStart(2, "0")}`,
    "滞在:",
    LUNCH.stayDurationMin,
  );
  console.log("座標:", LUNCH.lat, LUNCH.lng);
  console.log("memo:", LUNCH.memo);
  console.log("  区間:", JSON.stringify(LUNCH.leg));

  if (!commit) {
    console.log("\n--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // orderNoの付け替え(unique(dayId, orderNo)にぶつからない順。後ろから動かす)
    await tx.spot.update({ where: { id: SESSHOSEKI_ID }, data: { orderNo: 7 } });
    await tx.spot.update({ where: { id: JINJA_ID }, data: { orderNo: 6 } });
    await tx.spot.update({ where: { id: SHIKANOYU_ID }, data: { orderNo: 5 } });
    await tx.spot.update({ where: { id: RINDO_ID }, data: { orderNo: 4 } });

    for (const s of UPDATE_SPOTS) {
      await tx.spot.update({
        where: { id: s.id },
        data: { visitTime: s.visitTime, stayDurationMin: s.stayDurationMin, memo: s.memo },
      });
      if (s.leg) {
        await tx.spotTransitLeg.updateMany({
          where: { spotId: s.id, orderNo: 1 },
          data: { transitMode: s.leg.transitMode, transitDurationMin: s.leg.transitDurationMin },
        });
      }
    }

    await tx.spot.create({
      data: {
        id: LUNCH.id,
        dayId: DAY_ID,
        orderNo: LUNCH.orderNo,
        name: LUNCH.name,
        lat: LUNCH.lat,
        lng: LUNCH.lng,
        visitTime: LUNCH.visitTime,
        memo: LUNCH.memo,
        stayDurationMin: LUNCH.stayDurationMin,
        stampCategory: "gourmet",
      },
    });
    await tx.spotTransitLeg.create({
      data: {
        spotId: LUNCH.id,
        orderNo: 1,
        transitMode: LUNCH.leg.transitMode,
        transitDurationMin: LUNCH.leg.transitDurationMin,
      },
    });
  });

  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

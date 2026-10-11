/**
 * #128 c9b3ad40(伊勢神宮の初詣、新年の参拝とおかげ横丁を楽しむプラン)の
 * 全面見直し。
 *
 * もとは内宮・おかげ横丁の2か所のみ(09:00〜12:00)で4か所未満。終始
 * 案内役の話し方(ご案内させていただきます・ぜひご注目ください・
 * お参りいただくのがおすすめです・お過ごしください など)、おかげ横丁の
 * 文中に老舗「赤福」という業者名が2回。内宮の文中に「後ほどご案内する
 * 外宮」とあるのに、外宮自体はスポットになっていなかった。
 *
 * 直し方: 伝統的な伊勢参りの順序(二見浦で禊→外宮→内宮)にならい、
 * 二見興玉神社(夫婦岩、禊浜)→外宮(豊受大神宮)→内宮(皇大神宮、既存)→
 * おかげ横丁(既存、赤福の名は外す)→猿田彦神社の5か所に組み直す。
 * 初詣の時期は、外宮・内宮とも通常より大幅に混雑し、参拝に時間が
 * かかることが知られているため(banzokubiology.com各ページで確認)、
 * 滞在・移動とも実態に合わせて長めに設定。
 *
 * 座標(すべてOSM):
 * - 二見興玉神社: 34.5083432, 136.7888011(osm relation 9591959)
 * - 外宮: 34.4873519, 136.7036975(osm way 688114973)
 * - 猿田彦神社: 34.4673587, 136.7202043(osm way 688373744)
 *
 * 出典: 外宮の豊受大御神・創建の由来はco-trip.jp/post/619481ほかで、
 * 二見興玉神社の夫婦岩・禊浜はjeepe.jp/ja/articles/futami-okitama-shrine-mie-1191
 * ほかで、猿田彦神社の祭神・みちひらきはkankomie.or.jp/spot/2938で確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const FUTAMI_MEMO =
  "JR二見浦駅から歩いておよそ15分、二見興玉神社に着きます。祭神・猿田彦大神ゆかりの興玉神石を沖合に拝む神社で、海に浮かぶ夫婦岩はその鳥居にあたります。高さ16mの男岩と9mの女岩を結ぶ大しめ縄が有名で、5月から7月ごろには岩の間から朝日が昇る様子を望めます。この一帯はかつて、伊勢神宮を参拝する前に心身を清める「浜参宮」の地とされてきました。初詣の時期は多くの参拝者で賑わい、社殿までの列ができることもあります。波打ち際は足元が滑りやすいので、気をつけて歩きましょう。この後は、電車とバスでおよそ25分、外宮へ向かいましょう。";

const GEKU_MEMO =
  "二見興玉神社から電車とバスでおよそ25分、伊勢神宮外宮(豊受大神宮)に着きます。衣食住や産業をつかさどる神・豊受大御神を祀る神社で、およそ1500年前、天照大御神のお告げにより、丹波国(現在の京都府宮津市)から現在の地に迎えられたのが始まりと伝えられています。創建以来、神様に朝夕の食事をお供えする「日別朝夕大御饌祭」が、一日も欠かさず続けられています。初詣の時期は、内宮よりも早い時間帯から参拝者で混み合うことが知られています。御正宮をはじめ、別宮もあわせて参拝しましょう。この後は、バスでおよそ25分、内宮へ向かいましょう。";

const NAIKU_FROM = "伊勢神宮内宮、正式には皇大神宮は、伊勢神宮125社の中心となるお宮です。近鉄・JR伊勢市駅からバスで約15分ほどで到着します。";
const NAIKU_TO = "外宮からバスでおよそ25分、伊勢神宮内宮に着きます。正式には皇大神宮といい、伊勢神宮125社の中心となるお宮です。";

const NAIKU_GUIDE_FROM = "ご神体は三種の神器のひとつ「八咫鏡」で、こちらは神話に伝わるお話として案内させていただきます。";
const NAIKU_GUIDE_TO = "ご神体は三種の神器のひとつ「八咫鏡」で、こちらは神話に伝わるお話として伝えられています。";

const NAIKU_SIDE_FROM = "内宮の参道は右側通行、後ほどご案内する外宮とは逆になりますので、覚えておいていただくと安心です。";
const NAIKU_SIDE_TO = "内宮の参道は右側通行で、外宮とは逆になります。覚えておくと安心です。";

const NAIKU_RECOMMEND_FROM = "清らかな杜の空気を感じながら正宮まで進み、日頃の感謝をお伝えするような気持ちでお参りいただくのがおすすめです。";
const NAIKU_RECOMMEND_TO = "清らかな杜の空気を感じながら正宮まで進み、日頃の感謝を伝える気持ちでお参りしましょう。初詣の時期は参拝の列が長くなることもあるので、時間に余裕を持って訪れましょう。";

const NAIKU_END_FROM = "参拝を終えましたら、次はおかげ横丁へご案内いたします。";
const NAIKU_END_TO = "参拝を終えたら、次はおかげ横丁へ歩いて向かいましょう。";

const OKAGE_FROM = "内宮の参拝を終えたら、すぐそばのおかげ横丁へご案内します。ここは1993年、第61回の式年遷宮が行われた年に、老舗「赤福」が中心となって開いた町並みです。もともと門前町として栄えたおはらい町の賑わいを取り戻したいという願いから、伊勢路の伝統的な建物を再現して作られました。開業当初は27店舗ほどでしたが、現在では数多くのお店が軒を連ねる人気のスポットに育っています。「おかげ横丁」という名前には、赤福がこの地で長く商いを続けてこられたことへの感謝、そして江戸時代から明治の初めにかけて大流行した「おかげ参り」への思いが込められていると言われています。おかげ参りとは、短期間に全国から数百万人もの人々が伊勢を目指した現象で、道中で出会った人々から食べ物や宿を無償で提供される「施行」という助け合いがあったそうです。そうした人々への感謝の気持ちが、この名前に表れているのですね。町並みを歩きながら、伊勢の歴史に思いを馳せてみてください。この後は近くのお店をのぞいたり、名物を味わったりしながら、ゆっくりとお過ごしください。";
const OKAGE_TO =
  "内宮から歩いてすぐ、おかげ横丁に着きます。1993年、第61回の式年遷宮が行われた年に開かれた町並みです。もともと門前町として栄えたおはらい町の賑わいを取り戻したいという願いから、伊勢路の伝統的な建物を再現して作られました。開業当初は27店舗ほどでしたが、現在では数多くのお店が軒を連ねる人気のスポットに育っています。「おかげ横丁」という名前には、江戸時代から明治の初めにかけて大流行した「おかげ参り」への思いが込められていると言われています。おかげ参りとは、短期間に全国から数百万人もの人々が伊勢を目指した現象で、道中で出会った人々から食べ物や宿を無償で提供される「施行」という助け合いがあったそうです。町並みを歩きながら、ここで昼食をとり、名物を味わってみましょう。この後は、歩いておよそ8分、猿田彦神社へ向かいましょう。";

const SARUTAHIKO_MEMO =
  "おかげ横丁から歩いておよそ8分、猿田彦神社に着きます。「みちひらき」の神として知られる猿田彦大神を祀る神社で、古事記・日本書紀には、天孫降臨の際に天上から道案内をしたと伝えられています。境内には、芸能の神・天鈿女命を祀る佐瑠女神社もあわせて祀られています。伊勢参りの締めくくりに、これからの道が開けるよう祈りましょう。参拝を終えたら、近鉄五十鈴川駅または内宮前のバス停から、帰りの電車・バスに乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;

  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });
  const okage = await findSpotInItinerary(itinId, { spotName: "おかげ横丁" });

  if (!naiku.memo?.includes(NAIKU_FROM)) throw new Error("内宮の文言が想定外です(1)");
  if (!naiku.memo?.includes(NAIKU_GUIDE_FROM)) throw new Error("内宮の文言が想定外です(2)");
  if (!naiku.memo?.includes(NAIKU_SIDE_FROM)) throw new Error("内宮の文言が想定外です(3)");
  if (!naiku.memo?.includes(NAIKU_RECOMMEND_FROM)) throw new Error("内宮の文言が想定外です(4)");
  if (!naiku.memo?.includes(NAIKU_END_FROM)) throw new Error("内宮の文言が想定外です(5)");
  if (!okage.memo?.includes(OKAGE_FROM)) throw new Error("おかげ横丁の文言が想定外です");

  console.log("確認OK。dayId:", naiku.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "伊勢神宮の初詣、外宮から内宮・おかげ横丁をめぐる新年の参拝",
        description:
          "日本人の心のふるさと・伊勢神宮への初詣。外宮・内宮の参拝に加えて、おかげ横丁での食べ歩きや猿田彦神社の参拝もあわせて楽しむ、新年の始まりにふさわしいプランです。",
      },
    });

    const naikuMemo = naiku
      .memo!.replace(NAIKU_FROM, NAIKU_TO)
      .replace(NAIKU_GUIDE_FROM, NAIKU_GUIDE_TO)
      .replace(NAIKU_SIDE_FROM, NAIKU_SIDE_TO)
      .replace(NAIKU_RECOMMEND_FROM, NAIKU_RECOMMEND_TO)
      .replace(NAIKU_END_FROM, NAIKU_END_TO);

    const items: SpotOrderItem[] = [
      {
        create: {
          name: "二見興玉神社",
          memo: FUTAMI_MEMO,
          lat: 34.5083432,
          lng: 136.7888011,
          visitTime: t(8, 30),
          stayDurationMin: 75,
        },
      },
      {
        create: {
          name: "伊勢神宮外宮",
          memo: GEKU_MEMO,
          lat: 34.4873519,
          lng: 136.7036975,
          visitTime: t(10, 10),
          stayDurationMin: 75,
          transitLegs: { create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 25, transitLine: null }] },
        },
      },
      {
        id: naiku.id,
        data: {
          memo: naikuMemo,
          visitTime: t(11, 50),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 25, transitLine: null }] },
        },
      },
      {
        id: okage.id,
        data: {
          memo: okage.memo!.replace(OKAGE_FROM, OKAGE_TO),
          visitTime: t(13, 35),
          stayDurationMin: 75,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
        },
      },
      {
        create: {
          name: "猿田彦神社",
          memo: SARUTAHIKO_MEMO,
          lat: 34.4673587,
          lng: 136.7202043,
          visitTime: t(14, 58),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(naiku.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * 追加の直し、28352652（那須どうぶつ王国）。りんどう湖ファミリー牧場の滞在120分
 * (上限90〜100分を超える。法務の指摘・企画運営の決定、2026-11-02)を100分に縮め、
 * 空いた時間(20分)とあわせて、那須湯本に実在の行き先「鹿の湯」を追加する。
 *
 * 鹿の湯: amenity=public_bath way625505798 37.0982619,140.0011120。
 *  公式(shikanoyu.jp/history/)で確認: 舒明天皇の時代、七世紀前半(およそ1300年前)に
 *  開けたと伝わる那須温泉いちばん古い共同浴場で、那須温泉神社と同じ「鹿が傷を癒していた
 *  湯」の伝説が、この湯に伝わっている。店ではない公共の施設のため、名前を書いてよい
 *  (6章)。料金・営業時間は書かない。15分の立ち寄りのため、入浴ではなく、木造の湯小屋を
 *  外から眺める形にした(企画運営の指摘)
 *
 * 順番: りんどう湖→鹿の湯→那須温泉神社→殺生石(法務の指摘・企画運営の決定。鹿の湯が
 *  神社の南東、殺生石が神社の北にあるため、神社→鹿の湯→殺生石の順だと戻りが生まれる。
 *  りんどう湖→鹿の湯→神社→殺生石の順なら戻りがない)。りんどう湖→鹿の湯は車(OSRM
 *  11.5分+5=17分)、鹿の湯→神社は歩き(routed-foot 589m・7.8分)、神社→殺生石は歩き
 *  (routed-foot 234m・3.1分、もとのまま4分)
 *
 * 那須温泉神社「今も多くの参拝者が訪れます」(混み具合の言い方)→「今も大切にされています」
 *  (法務の指摘)
 *
 * 時刻の組み直し: りんどう湖13:07(100分、もと120分)→鹿の湯15:04(15分、新規)→那須温泉
 *  神社15:27(30分)→殺生石16:01(45分)、終わり16:46(日帰りの発車16:30〜17:00の中)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "28352652-5cbe-4344-bceb-c35d67f3bd6d";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TOWN = "那須どうぶつ王国（王国タウン）";
const FARM = "那須どうぶつ王国（王国ファーム）";
const RINDO = "りんどう湖ファミリー牧場";
const JINJA = "那須温泉神社";
const SESSYOSEKI = "殺生石";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const town = await prisma.spot.findFirstOrThrow({ where: { name: TOWN, day: { itineraryId: ITIN_ID } } });
  const farm = await prisma.spot.findFirstOrThrow({ where: { name: FARM, day: { itineraryId: ITIN_ID } } });
  const rindo = await prisma.spot.findFirstOrThrow({ where: { name: RINDO, day: { itineraryId: ITIN_ID } } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { name: JINJA, day: { itineraryId: ITIN_ID } } });
  const sessyoseki = await prisma.spot.findFirstOrThrow({ where: { name: SESSYOSEKI, day: { itineraryId: ITIN_ID } } });

  if (rindo.stayDurationMin !== 120) throw new Error(`りんどう湖: 滞在現在値が期待と不一致(${rindo.stayDurationMin})`);

  const RINDO_MEMO_OLD =
    "王国ファームから、車でおよそ29分、りんどう湖ファミリー牧場に着きます。那須高原唯一とされる湖「りんどう湖」を中心に、観光牧場と遊園地の両方が楽しめるテーマパークです。エサやり体験やちびっこ乗馬、乳牛の乳しぼりなど、動物とのふれあいが充実しているほか、アイスクリームやバター、クッキーづくりの体験プログラムもあります。湖上をワイヤーで滑空する、日本最長級ともいわれるジップラインもあります。那須連山を望むのどかな園内で、家族みんなで楽しみましょう。見学を終えたら、車でおよそ19分、那須温泉神社へ向かいましょう。";
  const RINDO_MEMO_NEW =
    "王国ファームから、車でおよそ29分、りんどう湖ファミリー牧場に着きます。那須高原唯一とされる湖「りんどう湖」を中心に、観光牧場と遊園地の両方が楽しめるテーマパークです。エサやり体験やちびっこ乗馬、乳牛の乳しぼりなど、動物とのふれあいが充実しているほか、アイスクリームやバター、クッキーづくりの体験プログラムもあります。湖上をワイヤーで滑空する、日本最長級ともいわれるジップラインもあります。那須連山を望むのどかな園内で、家族みんなで楽しみましょう。見学を終えたら、車でおよそ17分、鹿の湯へ向かいましょう。";
  if (rindo.memo !== RINDO_MEMO_OLD) throw new Error("りんどう湖ファミリー牧場: memo現在値が期待と不一致");

  const SHIKANOYU_MEMO_NEW =
    "りんどう湖ファミリー牧場から、車でおよそ17分、鹿の湯に着きます。舒明天皇の時代、七世紀前半に開けたと伝わる、那須温泉いちばん古い共同浴場とされています。那須温泉神社の由来となった、猟師が鹿を追って見つけた「鹿が傷を癒していた湯」の伝説は、この鹿の湯に伝わるものです。木造の湯小屋を外から眺め、漂う硫黄の香りに、およそ1300年の歴史を感じてみましょう。見学を終えたら、歩いておよそ8分、那須温泉神社へ向かいましょう。";

  const JINJA_MEMO_OLD =
    "りんどう湖ファミリー牧場から、車でおよそ19分、那須温泉神社に着きます。舒明天皇の御代、630年の創建と伝わる古社です。7世紀ごろ、猟師が矢傷を負わせた鹿を追って山に入ったところ、翁が現れて教えてくれたのが、鹿が傷を癒していたこの温泉だったと伝えられています。温泉の発見に感謝して祠を建てたのが、神社の始まりとされています。屋島の戦いで扇の的を射たことで知られる武将・那須与一が、この神社で戦勝を祈願したともいわれています。境内には鳥居や社殿が並び、那須温泉の守り神として、今も多くの参拝者が訪れます。今も祈りが続く神社ですので、境内では静かに、敬意をもってお参りしましょう。見学を終えたら、歩いておよそ4分、殺生石へ向かいましょう。";
  const JINJA_MEMO_NEW =
    "鹿の湯から歩いておよそ8分、那須温泉神社に着きます。舒明天皇の御代、630年の創建と伝わる古社です。7世紀ごろ、猟師が矢傷を負わせた鹿を追って山に入ったところ、翁が現れて教えてくれたのが、鹿が傷を癒していたこの温泉だったと伝えられています。温泉の発見に感謝して祠を建てたのが、神社の始まりとされています。屋島の戦いで扇の的を射たことで知られる武将・那須与一が、この神社で戦勝を祈願したともいわれています。境内には鳥居や社殿が並び、那須温泉の守り神として、今も大切にされています。今も祈りが続く神社ですので、境内では静かに、敬意をもってお参りしましょう。見学を終えたら、歩いておよそ4分、殺生石へ向かいましょう。";
  if (jinja.memo !== JINJA_MEMO_OLD) throw new Error("那須温泉神社: memo現在値が期待と不一致");

  const SESSYOSEKI_MEMO_OLD =
    "那須温泉神社から歩いておよそ4分、殺生石に着きます。平安時代、鳥羽上皇に仕えた美しい官女「玉藻の前」の正体が、悪行を重ねた九尾の狐だったという那須の伝説にまつわる史跡です。陰陽師に正体を見破られた狐は那須に逃げ込み、討伐されたのちに巨石へと姿を変え、長きにわたって毒気を放ち続けたと伝えられています。今もあたりには独特な硫黄の香りが漂い、伝説の余韻を感じさせます。今も火山ガスが噴出しているため、遊歩道から外れないようにしましょう。石までの遊歩道沿いには、寄進によりおよそ800体を超えるまで増え続けている「千体地蔵」や、伝説の残る「盲蛇石」もあり、あわせてゆっくり歩いてみましょう。国の名勝にも指定されている一帯です。帰りは、車でおよそ31分の那須塩原駅まで戻りましょう。那須どうぶつ王国で動物とふれあう、家族で楽しむ那須日帰りプランは、これで終わりです。";
  const SESSYOSEKI_MEMO_NEW = SESSYOSEKI_MEMO_OLD;
  if (sessyoseki.memo !== SESSYOSEKI_MEMO_OLD) throw new Error("殺生石: memo現在値が期待と不一致");

  console.log(`\n[りんどう湖ファミリー牧場]\n旧: ${RINDO_MEMO_OLD}\n新: ${RINDO_MEMO_NEW}`);
  console.log(`\n[鹿の湯(新規)]\n新: ${SHIKANOYU_MEMO_NEW}`);
  console.log(`\n[那須温泉神社]\n旧: ${JINJA_MEMO_OLD}\n新: ${JINJA_MEMO_NEW}`);
  console.log(`\n[殺生石]\n変更なし(メモはそのまま。時刻のみ変更)`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`りんどう湖ファミリー牧場: 座標変更なし / 時刻変更なし(13:07) / 滞在120→100分`);
  console.log(`鹿の湯(新規): 座標37.0982619,140.0011120 / 時刻15:04 / 滞在15分 / incoming car17分`);
  console.log(`那須温泉神社: 座標変更なし / 時刻15:26→15:27 / 滞在30分(変更なし) / incoming walk8分`);
  console.log(`殺生石: 座標変更なし / 時刻16:00→16:01 / 滞在45分(変更なし) / incoming walk4分(変更なし)`);
  console.log("終わり: 16:01+45分=16:46（日帰りの発車16:30〜17:00の中）");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = jinja.dayId;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      dayId,
      [
        { id: town.id, data: {} },
        { id: farm.id, data: {} },
        {
          id: rindo.id,
          data: {
            memo: RINDO_MEMO_NEW,
            stayDurationMin: 100,
          },
        },
        {
          create: {
            name: "鹿の湯",
            lat: 37.0982619,
            lng: 140.001112,
            memo: SHIKANOYU_MEMO_NEW,
            visitTime: t(15, 4),
            stayDurationMin: 15,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 17 }] },
          },
        },
        {
          id: jinja.id,
          data: {
            memo: JINJA_MEMO_NEW,
            visitTime: t(15, 27),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
          },
        },
        {
          id: sessyoseki.id,
          data: {
            memo: SESSYOSEKI_MEMO_NEW,
            visitTime: t(16, 1),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
      ],
      { remove: [], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

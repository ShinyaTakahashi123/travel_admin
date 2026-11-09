/**
 * 法務の10章見直し、弘前(a0c34490)の3件。
 *   1. 津軽藩ねぷた村: 1か所目に入口(弘前駅)からの行き方と分がなかった。OSM(museum,
 *      40.6111410,140.4696888)で座標を確認すると、今の値(40.6098,140.4644)から約472m
 *      ずれていた(正しい点に直す)。入口の分は、弘南バスの公式ページ(konanbus.com)に
 *      停留所ごとの時刻・所要時間の記載がなかったため、法務の指示どおりOSRM(taxi)で測った
 *      値(+5分、約9分)を使う。「バスは本数が限られるので」の一言を添える
 *      座標を正しい点に直すと、次の仲町への区間が18分→4分(routed-foot実測280m・3.7分)に
 *      なり、14分短くなる。決まりA(延ばして合わせない)と、始まりの時刻の範囲(8:30〜9:30)の
 *      中で、始まりを09:00→09:14に遅らせて吸収(決まりの順番②)。これで仲町以降の時刻は
 *      すべて今までと同じ
 *   2. 仲町伝統的建造物群保存地区: 書き出しの分を18分→4分に直す(上と同じ理由)
 *   3. 旧弘前市立図書館: 「現在は館内を見学できます」の「現在は」を外す(時間で古くなる言い方)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ITIN_ID = "a0c34490-4b62-4f3f-8162-5802cf5d401d";

const NEPUTA_NAME = "津軽藩ねぷた村";
const NEPUTA_OLD_LAT = 40.6098;
const NEPUTA_OLD_LNG = 140.4644;
const NEPUTA_NEW_LAT = 40.611141;
const NEPUTA_NEW_LNG = 140.469689;
const NEPUTA_MEMO_OLD =
  "冬の津軽をめぐる旅は、津軽藩ねぷた村からスタートです。弘前ねぷたまつりで実際に使われた大型のねぷたを間近で眺められる展示施設で、骨組みまで見える迫力ある展示もあります。笛や太鼓による演奏の実演に加え、太鼓を実際に打ち鳴らせる体験コーナーも人気です。館内では津軽三味線の生演奏を聴くこともでき、津軽蔵工房「たくみ」では津軽塗や津軽凧づくりの制作風景を見学しながら、金魚ねぷたの絵付け体験も楽しめます。「見る・聞く・食べる・買う・体験する」がひとつにそろう、津軽文化の複合施設です。見学を終えたら、歩いておよそ18分の仲町伝統的建造物群保存地区へ向かいましょう。この後は徒歩での移動が続きますので、雪道では足元に気をつけて進みましょう。";
const NEPUTA_MEMO_NEW =
  "弘前駅からタクシーでおよそ9分、津軽藩ねぷた村に着きます。冬の津軽をめぐる旅は、ここからスタートです。弘前ねぷたまつりで実際に使われた大型のねぷたを間近で眺められる展示施設で、骨組みまで見える迫力ある展示もあります。笛や太鼓による演奏の実演に加え、太鼓を実際に打ち鳴らせる体験コーナーも人気です。館内では津軽三味線の生演奏を聴くこともでき、津軽蔵工房「たくみ」では津軽塗や津軽凧づくりの制作風景を見学しながら、金魚ねぷたの絵付け体験も楽しめます。「見る・聞く・食べる・買う・体験する」がひとつにそろう、津軽文化の複合施設です。見学を終えたら、歩いておよそ4分の仲町伝統的建造物群保存地区へ向かいましょう。この後は徒歩での移動が続きますので、雪道では足元に気をつけて進みましょう。";

const NAKAMACHI_NAME = "仲町伝統的建造物群保存地区";
const NAKAMACHI_MEMO_OLD =
  "津軽藩ねぷた村からは、歩いておよそ18分です。仲町伝統的建造物群保存地区は、江戸時代の中級武士が暮らした屋敷町の面影を今に伝える一角です。道沿いに続くサワラの生垣や点在する門、板塀が、城下町ならではの落ち着いた町並みをつくっています。地区内に残る旧岩田家住宅は、寛政10年(1798)ごろに建てられた中級武士の住宅で、青森県の重宝に指定されており、公開されている武家住宅の中でも、場所を移さず当初の姿のまま残る建物とされています。地区内には今も人が暮らす住宅が多いため、敷地には立ち入らず、住まいや住人に向けた撮影は控えましょう。雪に覆われた生垣と屋敷町を、静かに歩いてみましょう。続いては、歩いておよそ18分の弘前昇天教会へ向かいましょう。";
const NAKAMACHI_MEMO_NEW = NAKAMACHI_MEMO_OLD.replace(
  "津軽藩ねぷた村からは、歩いておよそ18分です。",
  "津軽藩ねぷた村からは、歩いておよそ4分です。"
);

const TOSHOKAN_NAME = "旧弘前市立図書館";
const TOSHOKAN_MEMO_OLD =
  "弘前市立博物館からは、歩いておよそ5分です。旧弘前市立図書館は、明治39年(1906)、日露戦争の戦勝を記念して建てられた、八角形の双塔を持つルネサンス様式の木造建築です。昭和6年(1931)まで実際に市立図書館として使われ、現在は館内を見学できます。らせん階段や、当時のままの閲覧室の様子を眺めながら、明治の洋風建築の雰囲気を味わいましょう。続いては、歩いておよそ3分の青森銀行記念館へ向かいましょう。";
const TOSHOKAN_MEMO_NEW = TOSHOKAN_MEMO_OLD.replace(
  "昭和6年(1931)まで実際に市立図書館として使われ、現在は館内を見学できます。",
  "昭和6年(1931)まで実際に市立図書館として使われた建物で、館内を見学できます。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const neputa = await prisma.spot.findFirstOrThrow({ where: { name: NEPUTA_NAME, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(neputa.lat) - NEPUTA_OLD_LAT) > 1e-6 || Math.abs(Number(neputa.lng) - NEPUTA_OLD_LNG) > 1e-6) throw new Error("津軽藩ねぷた村: 座標現在値が期待と不一致");
  if (neputa.memo !== NEPUTA_MEMO_OLD) throw new Error("津軽藩ねぷた村: memo現在値が期待と不一致");

  const nakamachi = await prisma.spot.findFirstOrThrow({ where: { name: NAKAMACHI_NAME, day: { itineraryId: ITIN_ID } } });
  if (nakamachi.memo !== NAKAMACHI_MEMO_OLD) throw new Error("仲町: memo現在値が期待と不一致");

  const toshokan = await prisma.spot.findFirstOrThrow({ where: { name: TOSHOKAN_NAME, day: { itineraryId: ITIN_ID } } });
  if (toshokan.memo !== TOSHOKAN_MEMO_OLD) throw new Error("旧弘前市立図書館: memo現在値が期待と不一致");

  console.log(`\n[${NEPUTA_NAME}] 座標: ${NEPUTA_OLD_LAT},${NEPUTA_OLD_LNG} → ${NEPUTA_NEW_LAT},${NEPUTA_NEW_LNG}（約472m） 時刻: 09:00→09:14`);
  console.log(`旧: ${NEPUTA_MEMO_OLD}\n新: ${NEPUTA_MEMO_NEW}`);
  console.log(`\n[${NAKAMACHI_NAME}] 区間: 18分→4分(routed-foot実測280m・3.7分)`);
  console.log(`旧: ${NAKAMACHI_MEMO_OLD}\n新: ${NAKAMACHI_MEMO_NEW}`);
  console.log(`\n[${TOSHOKAN_NAME}]`);
  console.log(`旧: ${TOSHOKAN_MEMO_OLD}\n新: ${TOSHOKAN_MEMO_NEW}`);
  console.log("\n以降(弘前昇天教会〜青森銀行記念館)の時刻・滞在・移動の分は変更なし(14分短縮を始まりの変更で相殺)");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: neputa.id },
      data: { lat: NEPUTA_NEW_LAT, lng: NEPUTA_NEW_LNG, visitTime: t(9, 14), memo: NEPUTA_MEMO_NEW },
    });
    await tx.spot.update({
      where: { id: nakamachi.id },
      data: {
        memo: NAKAMACHI_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    });
    await tx.spot.update({ where: { id: toshokan.id }, data: { memo: TOSHOKAN_MEMO_NEW } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

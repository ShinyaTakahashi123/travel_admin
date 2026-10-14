/**
 * お遍路 本1(#7)の2回目の直し(企画運営指摘、2026-10-14)。
 * 1. 大塚国際美術館の開始を9:00→9:30(開館後)に
 * 2. 藤井寺の開始時刻の計算間違い(14:17→14:23、切幡寺終わり14:05+leg18分)を修正
 * 3. 新しい区間すべてをOSRM(http://router.project-osrm.org)の実際の道のりで
 *    確かめ直す(美術館→第九の里22分[OSRM19.8分を切り上げ]、第九の里→霊山寺3分
 *    [OSRM1.7分]、法輪寺→どなり9分[OSRM7.8分]、どなり→切幡寺16分[OSRM14.5分]、
 *    藤井寺→会館16分[OSRM14.9分]、安楽寺→十楽寺3分[OSRM2.3分])
 * 4. 道の駅第九の里の昼食を79分→60分に短縮
 * 5. 大塚国際美術館のメモから開館時間・休館日・(出典:…)を削除
 * 6. 阿波和紙伝統産業会館のメモから(出典:…)・料金の話を削除、「ください」→
 *    「ましょう」、帰路の一文を追加(日2の最後のため)
 * 7. 説明文・安楽寺メモの「ください」→「ましょう」(祈りの一文を除く)
 * 8. 地蔵寺の宿泊の一文を案内係口調でない形に
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book1-round2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book1-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "5670eb0e-fad1-490d-afc9-3ac66896a083";

const OTSUKA_NAME = "大塚国際美術館";
const DAIKUNOSATO_NAME = "道の駅第九の里（昼食）";
const WASHIKAN_NAME = "阿波和紙伝統産業会館";

const RYOZENJI_ID = "769cfc42-eb83-4168-a9f0-a515b12f690a";
const GOKURAKUJI_ID = "ecd1b1cb-1d08-4a2f-89e5-2faa01985570";
const KONSENJI_ID = "38b79db0-2ece-4807-912b-0d3db0aa7a8e";
const DAINICHIJI_ID = "6d57dafd-6bd6-490e-a0cf-4262c4f34483";
const JIZOJI_ID = "73130322-247b-4b09-95aa-52ea257f26a4";
const ANRAKUJI_ID = "6479b3bb-66d9-46fb-9e7a-fc36c632f561";
const JURAKUJI_ID = "5980acd4-eef4-4517-8c3c-20208b635af9";
const KUMADANIJI_ID = "c545894d-7596-4b44-9457-e87eac3de963";
const HORINJI_ID = "08781d22-0944-4065-acec-94f056b0df1f";
const KIRIHATAJI_ID = "a3e39d83-1d07-4b0a-9d06-c975f7732012";
const FUJIIDERA_ID = "269dbad6-dd51-4397-83ca-3d984432069a";

const OLD_DESC_SENTENCE = "お出かけ前に各寺院の公式の案内で確かめてください。";
const NEW_DESC_SENTENCE = "お出かけ前に各寺院の公式の案内で確かめましょう。";

const OTSUKA_MEMO_NEW =
  "世界26カ国の西洋名画を、陶板に焼き付けて原寸大で再現した美術館です。地下3階から地上2階までの5つのフロアに、「モナ・リザ」「最後の晩餐」「ゲルニカ」など、原寸大で再現された名画が並びます。開館日や時間は公式サイトで確かめましょう。";

const WASHIKAN_MEMO_NEW =
  "吉野川市山川町にある、阿波和紙の博物館です。2階のギャラリーでは、世界各地の手漉き紙の作品を展示しており、特別展は1〜2か月ごとに入れ替わります。実践コーナーでは紙すきの様子を見学でき、はがきなどの紙すき体験もできます(体験の内容は公式の案内で確かめましょう)。見学を終えたら、帰路につきましょう。";

const ANRAKUJI_MEMO_NEW =
  "弘仁6年(815)、弘法大師がこの地で、病に苦しむ人々を救うために薬師如来を自ら刻んで開いたと伝えられます。修行中の弘法大師を狩人が誤って弓で射てしまい、矢は近くの松に当たったという言い伝えがあり、大師はその松を逆さに植え、「この松が栄えるかぎり参拝者に災いはない」と告げたとされる「逆松」が今も伝わります。山号の「温泉山」が示すとおり、境内には四国霊場で数少ない温泉が湧き、江戸時代から続く宿坊の温泉で旅の疲れを癒やせます（入浴できるかどうかや時間は公式で確かめましょう）。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const JIZOJI_MEMO_NEW =
  "弘仁12年(821)、弘法大師がこの地で、甲冑をまとい馬にまたがる姿の勝軍地蔵菩薩を自ら刻んで本尊としたと伝えられます。この小さな勝軍地蔵は、僧が刻んだ延命地蔵菩薩の胎内に納められており、武士からの信仰を集めてきました。本堂の裏手にある羅漢堂には、安永4年(1775)に建てられて以来の五百羅漢が安置されていましたが、大正の火災で焼失し、大正11年(1922)に再建されました。今も約200体の羅漢像が、一体一体異なる表情で並んでいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。この日は、このあたりの宿に泊まりましょう。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || !itin.description || !itin.description.includes(OLD_DESC_SENTENCE)) throw new Error("想定と違います(description)");

  const otsuka = await prisma.spot.findFirst({ where: { name: OTSUKA_NAME } });
  const daikunosato = await prisma.spot.findFirst({ where: { name: DAIKUNOSATO_NAME } });
  const washikan = await prisma.spot.findFirst({ where: { name: WASHIKAN_NAME } });
  if (!otsuka || !daikunosato || !washikan) throw new Error("想定と違います(新スポットが見つからない)");

  console.log("[確認OK] 説明文の「ください」→「ましょう」");
  console.log("[確認OK] 大塚国際美術館: 9:00→9:30開始、滞在120分、メモから開館時間等を削除");
  console.log("[確認OK] 道の駅第九の里: 昼食を60分に短縮");
  console.log("[確認OK] 新しい区間をOSRM実測(切り上げ)の時間に更新");
  console.log("[確認OK] 藤井寺の時刻の計算間違いを修正(14:17→14:23)");
  console.log("[確認OK] 阿波和紙伝統産業会館: (出典)・料金の話を削除、帰路の一文を追加");
  console.log("[確認OK] 安楽寺・地蔵寺のメモの口調を修正");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { description: itin.description.replace(OLD_DESC_SENTENCE, NEW_DESC_SENTENCE) },
  });

  // --- 日1 ---
  await prisma.spot.update({ where: { id: otsuka.id }, data: { visitTime: t(9, 30), stayDurationMin: 120, memo: OTSUKA_MEMO_NEW } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: daikunosato.id }, data: { transitDurationMin: 22 } });
  await prisma.spot.update({ where: { id: daikunosato.id }, data: { visitTime: t(11, 52), stayDurationMin: 60 } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: RYOZENJI_ID }, data: { transitDurationMin: 3 } });
  await prisma.spot.update({ where: { id: RYOZENJI_ID }, data: { visitTime: t(12, 55) } });
  await prisma.spot.update({ where: { id: GOKURAKUJI_ID }, data: { visitTime: t(13, 40) } });
  await prisma.spot.update({ where: { id: KONSENJI_ID }, data: { visitTime: t(14, 23) } });
  await prisma.spot.update({ where: { id: DAINICHIJI_ID }, data: { visitTime: t(15, 10) } });
  await prisma.spot.update({ where: { id: JIZOJI_ID }, data: { visitTime: t(15, 51), memo: JIZOJI_MEMO_NEW } });

  // --- 日2 ---
  await prisma.spot.update({ where: { id: ANRAKUJI_ID }, data: { memo: ANRAKUJI_MEMO_NEW } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: JURAKUJI_ID }, data: { transitDurationMin: 3 } });
  await prisma.spot.update({ where: { id: JURAKUJI_ID }, data: { visitTime: t(9, 43) } });
  await prisma.spot.update({ where: { id: KUMADANIJI_ID }, data: { visitTime: t(10, 28) } });
  await prisma.spot.update({ where: { id: HORINJI_ID }, data: { visitTime: t(11, 15) } });

  const donari = await prisma.spot.findFirst({ where: { name: "道の駅どなり（昼食）" } });
  if (!donari) throw new Error("どなりが見つかりません");
  await prisma.spotTransitLeg.updateMany({ where: { spotId: donari.id }, data: { transitDurationMin: 9 } });
  await prisma.spot.update({ where: { id: donari.id }, data: { visitTime: t(11, 59), stayDurationMin: 60 } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KIRIHATAJI_ID }, data: { transitDurationMin: 16 } });
  await prisma.spot.update({ where: { id: KIRIHATAJI_ID }, data: { visitTime: t(13, 15) } });
  await prisma.spot.update({ where: { id: FUJIIDERA_ID }, data: { visitTime: t(14, 23) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: washikan.id }, data: { transitDurationMin: 16 } });
  await prisma.spot.update({ where: { id: washikan.id }, data: { visitTime: t(15, 19), stayDurationMin: 75, memo: WASHIKAN_MEMO_NEW } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

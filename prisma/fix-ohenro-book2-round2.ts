/**
 * お遍路 本2(#8)の2回目の直し(企画運営指摘、2026-10-14)。対象はすべてidで指定。
 *
 * 1. 文化の森総合公園(昼食)は、園内の食堂の出典が確かめられなかったため削除。
 *    代わりに、もとは日1の最後(orderNo8)にあった阿波十郎兵衛屋敷を昼食の位置
 *    (国分寺のあと)へ移し、「阿波十郎兵衛屋敷（昼食）」として昼食の時間帯に
 *    充てる(館内の食事処の有無は確かめられなかったため、「周辺の食事処で昼食を
 *    とりましょう」という安全な表現にとどめる)。井戸寺は日1の最後に戻り、
 *    宿泊の一文も元に戻す
 * 2. 恩山寺の座標を、丸めた値からOSMの名前付きの地物の点(node 293930778、
 *    「第18番札所 恩山寺」、33.9860981,134.5778614)に修正
 * 3. 立江寺の90分の理由づけを「昼食を見る時間」から外し、口調も直す(昼食は
 *    別のひなの里かつうらのため)
 * 4. 太龍寺: 鶴林寺からの移動先を道の駅鷲の里(ロープウェイ山麓駅、OSM way
 *    1469755574、33.8631482,134.5021506)にし、そこから先はロープウェイ(10分、
 *    出典: ANA公式観光案内等)で境内へ向かう形にする。料金の話と「ください」を
 *    削除し、「運行時間は公式の案内で確かめましょう」に。帰路の一文を追加(この
 *    旅の最後のため)
 * 5. 時刻の計算間違い(観音寺・ひなの里・鶴林寺の1分ずれ)を、上の変更とあわせて
 *    すべて計算し直す
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book2-round2.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book2-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY1_ID = "32ab4c48-0c31-4840-a4a1-546c5fb472ea";
const DAY2_ID = "726af385-2af7-4773-9bbc-7312837ec238";

const BUNKA_SPOT_ID = "64f6a4ec-49bf-419f-b8b2-971072e034fc";
const KANNONJI_ID = "947ce18e-a482-4859-a0ba-723352529f6f";
const IDOJI_ID = "5a4c10f0-0d15-4204-bc4f-deb3555740e3";
const JURO_SPOT_ID = "53ebf453-b474-4572-990a-557f02d37249";

const ONZANJI_ID = "3e7c0493-1de6-49f4-88b8-fbdcc58a8848";
const ONZANJI_PLACE_ID = "b34d72ac-d37d-4978-977f-7e7ea9115e93";
const TATSUEJI_ID = "beec02b4-3ea3-45b2-9902-98daef8e291c";
const HINANO_ID = "e293af1e-7159-4c7c-9129-15897bc771c9";
const KAKURINJI_ID = "dfa83673-cb86-4ac6-b58b-46dbfd866b77";
const TAIRYUJI_ID = "36c7a23d-1cd9-413c-a4a3-426cdab0f697";

const IDOJI_MEMO_ORIGINAL =
  "白鳳2年(673)、天武天皇の勅願により開かれたと伝わる、聖徳太子ゆかりの七仏薬師如来を本尊とする寺です。弘仁6年(815)、この地を訪れた弘法大師が、水不足に苦しむ村人のために錫杖で井戸を掘ったという言い伝えから「井戸寺」と呼ばれるようになりました。今も残るこの井戸は「面影の井戸」と呼ばれ、水面に自分の顔がはっきり映れば3年間無病息災、映らなければ不幸が近いという言い伝えがあります。一木造りの十一面観音立像は国の重要文化財に指定されています。今夜はこの周辺の宿にご宿泊いただきます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const JURO_MEMO_NEW =
  "徳島市川内町にある、阿波人形浄瑠璃の資料館です。人形浄瑠璃の名場面を、人形と太夫・三味線の生演奏で見せる上演が行われており(上演日時は公式の案内で確かめましょう)、精巧な人形や衣装の展示も見学できます。周辺の食事処で昼食をとりましょう。";

const TATSUEJI_MEMO_NEW =
  "天平19年(747)、聖武天皇の勅願により行基が、光明皇后の安産を願って延命地蔵菩薩を刻んで開いたと伝えられます。四国霊場の「総関所」とも呼ばれ、心に後ろめたさを抱えた者はこれより先に進めないという言い伝えがあります。境内の黒髪堂には、罪を犯して遍路の途中に懺悔した女性の髪が、鐘の綱に巻きついて抜けなくなったという伝説にちなむ髪が祀られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const WASHINOSATO_MEMO =
  "太龍寺ロープウェイの麓の駅です。売店があり、ロープウェイに乗る前後に立ち寄れます。ここから太龍寺までは、ロープウェイで向かいましょう。";

const TAIRYUJI_MEMO_NEW =
  "延暦12年(793)、桓武天皇の勅願により開かれたと伝わる山岳霊場です。弘法大師が19歳のころ、本堂近くの「舎心ヶ嶽」という岩場で、記憶力を高める修行とされる「虚空蔵求聞持法」を100日にわたり行ったと、大師自身の著作にも記されています。壮大な伽藍から「西の高野」とも呼ばれます。麓の鷲の里駅からロープウェイで、全長2,775m・西日本最長級の空中散歩を楽しみながら境内へ向かいましょう。運行時間は公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。見学を終えたら、帰路につきましょう。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const bunka = await prisma.spot.findUnique({ where: { id: BUNKA_SPOT_ID } });
  const juro = await prisma.spot.findUnique({ where: { id: JURO_SPOT_ID } });
  const onzanji = await prisma.spot.findUnique({ where: { id: ONZANJI_ID } });
  const tairyuji = await prisma.spot.findUnique({ where: { id: TAIRYUJI_ID } });
  if (!bunka || bunka.dayId !== DAY1_ID) throw new Error("想定と違います(文化の森)");
  if (!juro || juro.orderNo !== 8) throw new Error("想定と違います(十郎兵衛屋敷)");
  if (!onzanji || !tairyuji) throw new Error("想定と違います");

  console.log("[確認OK] 文化の森総合公園(昼食)を削除し、阿波十郎兵衛屋敷(昼食)を国分寺のあとに移動");
  console.log("[確認OK] 恩山寺の座標をOSMの地物の点に修正");
  console.log("[確認OK] 立江寺のメモを修正(昼食の理由づけを外す)");
  console.log("[確認OK] 太龍寺: 道の駅鷲の里(新設)→ロープウェイ→太龍寺 の形にし、帰路の一文を追加");
  console.log("[確認OK] 時刻の計算をすべてし直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1 ---
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: BUNKA_SPOT_ID } });
  await prisma.spot.delete({ where: { id: BUNKA_SPOT_ID } });

  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 93 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: JURO_SPOT_ID } });
  await prisma.spot.update({
    where: { id: JURO_SPOT_ID },
    data: { orderNo: 5, name: "阿波十郎兵衛屋敷（昼食）", memo: JURO_MEMO_NEW, visitTime: t(13, 15), stayDurationMin: 106 },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: JURO_SPOT_ID, orderNo: 1, transitMode: "car", transitDurationMin: 17 } });

  await prisma.spot.update({ where: { id: KANNONJI_ID }, data: { orderNo: 6, visitTime: t(15, 15) } });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: KANNONJI_ID }, data: { transitDurationMin: 14 } });

  await prisma.spot.update({ where: { id: IDOJI_ID }, data: { orderNo: 7, visitTime: t(15, 55), memo: IDOJI_MEMO_ORIGINAL } });

  // --- 日2 ---
  await prisma.placeMaster.update({ where: { id: ONZANJI_PLACE_ID }, data: { lat: 33.9860981, lng: 134.5778614, positionSource: "osm" } });
  await prisma.spot.update({ where: { id: ONZANJI_ID }, data: { lat: 33.9860981, lng: 134.5778614 } });

  await prisma.spot.update({ where: { id: TATSUEJI_ID }, data: { memo: TATSUEJI_MEMO_NEW } });

  await prisma.spot.update({ where: { id: HINANO_ID }, data: { visitTime: t(11, 31) } });
  await prisma.spot.update({ where: { id: KAKURINJI_ID }, data: { visitTime: t(12, 43) } });

  await prisma.spot.update({ where: { id: TAIRYUJI_ID }, data: { orderNo: 94 } }); // 退避

  const washinosatoPlace = await prisma.placeMaster.create({
    data: { name: "道の駅鷲の里", address: "徳島県那賀郡那賀町土佐", lat: 33.8631482, lng: 134.5021506, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const washinosatoSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: washinosatoPlace.id, orderNo: 5, name: "道の駅鷲の里",
      address: washinosatoPlace.address, lat: washinosatoPlace.lat, lng: washinosatoPlace.lng,
      memo: WASHINOSATO_MEMO, visitTime: t(14, 16), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: washinosatoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 18 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: TAIRYUJI_ID } });
  await prisma.spot.update({
    where: { id: TAIRYUJI_ID },
    data: { orderNo: 6, visitTime: t(14, 56), stayDurationMin: 95, memo: TAIRYUJI_MEMO_NEW },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: TAIRYUJI_ID, orderNo: 1, transitMode: "other", transitDurationMin: 10, transitLine: "太龍寺ロープウェイ" } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

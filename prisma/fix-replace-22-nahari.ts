/**
 * #22(55e932b6)奈半利の町並み（昼食）の座標・メモの差し替え(企画運営・法務の
 * 判断、2026-10-13)。地理院・OSMともに大西家住宅・正覚寺本堂・旧弘瀬家住宅の
 * 番地が解決せず、位置が確かめられなかったため、座標を奈半利駅
 * (OSM node 265020421、railway=station、33.4250589,134.0181116)に差し替え、
 * メモも個別の建物の位置を断定しない内容に書き直す。
 * 「いしぐろ」という石塀の呼び名は吉良川町(#21)のもので、奈半利町のものでは
 * ないことを確認したため使わない。「水切瓦」「石塀」は奈半利町の町並みの
 * 特徴として複数の情報源で確認(rurubu.jp等)。旧弘瀬家住宅が町の観光拠点に
 * なっていることも同様に確認。旧弘瀬家住宅の登録有形文化財としての指定は
 * 文化庁の公式ページ(online.bunka.go.jp/heritages/detail/292720)で確認。
 *
 * 座標が奈半利駅の実点に変わったことで、前後の移動時間も実際の距離に合わせて
 * 修正(モネの庭→奈半利駅: 10分→4分、奈半利駅→道の駅田野駅屋: 10分→2分)。
 * 空いた14分は、この日の最後のスポット・伊尾木洞の滞在時間に加える
 * (85分→99分。9:30〜16:30は変わらず)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NAHARI_SPOT_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";
const NAHARI_LEG_ID_LOOKUP = { dayId: null as string | null }; // filled at runtime
const TANO_SPOT_ID = "0684665a-e006-4fbf-be05-8f029f1132eb";
const IOKIDO_SPOT_ID = "e580b545-6cf1-4c27-8c39-156d681aa0c6";

const NAHARI_LAT = 33.4250589;
const NAHARI_LNG = 134.0181116;

const NAHARI_MEMO_NEW =
  "奈半利駅前に広がる町並みです。台風や海からの風雨に備え、白壁を守る「水切瓦」をつけた土佐漆喰の建物や、浜石を積んだ石塀など、独特の景観が今も残っています。国の登録有形文化財「旧弘瀬家住宅」は、現在は町の観光の拠点として使われています。駅前のお店で昼食をとりましょう。";

async function main() {
  const nahari = await prisma.spot.findUnique({ where: { id: NAHARI_SPOT_ID } });
  const tano = await prisma.spot.findUnique({ where: { id: TANO_SPOT_ID } });
  const iokido = await prisma.spot.findUnique({ where: { id: IOKIDO_SPOT_ID } });
  if (!nahari || !tano || !iokido) throw new Error("想定と違います");

  const legToNahari = await prisma.spotTransitLeg.findFirst({ where: { spotId: NAHARI_SPOT_ID } });
  const legToTano = await prisma.spotTransitLeg.findFirst({ where: { spotId: TANO_SPOT_ID } });
  if (!legToNahari || !legToTano) throw new Error("移動データが見つかりません");

  console.log("[確認OK] 奈半利の町並み（昼食）座標:", nahari.lat, nahari.lng, "→", NAHARI_LAT, NAHARI_LNG);
  console.log("[確認OK] メモを書き直し");
  console.log("[確認OK] leg モネの庭→奈半利駅:", legToNahari.transitDurationMin, "→ 4分");
  console.log("[確認OK] leg 奈半利駅→道の駅田野駅屋:", legToTano.transitDurationMin, "→ 2分");
  console.log("[確認OK] 伊尾木洞の滞在:", iokido.stayDurationMin, "→ 99分(空いた14分を加算)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (nahari.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: nahari.placeMasterId }, data: { lat: NAHARI_LAT, lng: NAHARI_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: NAHARI_SPOT_ID }, data: { lat: NAHARI_LAT, lng: NAHARI_LNG, memo: NAHARI_MEMO_NEW } });
  await prisma.spotTransitLeg.update({ where: { id: legToNahari.id }, data: { transitDurationMin: 4 } });
  await prisma.spotTransitLeg.update({ where: { id: legToTano.id }, data: { transitDurationMin: 2 } });

  // 奈半利の町並み: visit時刻は変わらず12:40のまま(直前のleg20分+スポット1終了10:30は不変)
  // 道の駅田野駅屋: leg短縮により開始が13:46に早まる
  await prisma.spot.update({ where: { id: TANO_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 46)) } });
  // 伊尾木洞: 開始14:51、滞在99分で16:30終了
  await prisma.spot.update({ where: { id: IOKIDO_SPOT_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 51)), stayDurationMin: 99 } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

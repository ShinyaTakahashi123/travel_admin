/**
 * #25 朝霧高原の牧場とふもとっぱら(66d185f1) ラウンド4: 点のみの追加修正
 *
 * 法務の本番確認で2件:
 * - 人穴富士講遺跡: OSMに「Hitoana Fuji-ko Iseki」node7431125286(tourism=attraction、
 *   35.361549,138.590719)があり、地理院の注記の点(35.361725,138.590922)より先に使う
 *   決まりのため、こちらに直す(約27mの差)。田貫湖→人穴・人穴→新富士駅の分数はOSRMで
 *   再確認し、いずれも変わらない(16分・29分のまま)。
 * - 内野神社: OSMのway739008196のNominatimの値(35.32123,138.576963)に直す(約7mの差)。
 *   前後の区間(白糸自然公園→内野神社・内野神社→まかいの牧場)もOSRMで確認し、いずれも
 *   既存の5分の範囲内のため変更なし。
 *
 * 法務のOK済み(点だけの直しのため法務のOKのみで書き込み可)。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const HITOANA = "ce27b7b4-7186-47a8-8c1c-3e81def6fa3c";
const UCHINO_JINJA = "6b56a3cf-f7c0-423a-8c27-c5912576a197";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [HITOANA, UCHINO_JINJA] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkLatLng = (id: string, lat: number, lng: number, label: string) => {
    const s = byId.get(id)!;
    const curLat = s.lat?.toNumber() ?? 0;
    const curLng = s.lng?.toNumber() ?? 0;
    if (Math.abs(curLat - lat) > 1e-6 || Math.abs(curLng - lng) > 1e-6) {
      throw new Error(`${label}: 座標の現在値が期待と不一致`);
    }
  };
  checkLatLng(HITOANA, 35.361725, 138.590922, "人穴富士講遺跡");
  checkLatLng(UCHINO_JINJA, 35.321277, 138.576918, "内野神社");

  console.log("前提の確認OK。\n");
  console.log("人穴富士講遺跡: 35.361725,138.590922 → 35.361549,138.590719(OSMのtourism=attraction点)。分数は変更なし(田貫湖→16分、新富士駅まで29分)");
  console.log("内野神社: 35.321277,138.576918 → 35.32123,138.576963(way739008196のNominatim値)。分数は変更なし(前後とも既存5分の範囲内)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: HITOANA }, data: { lat: 35.361549, lng: 138.590719 } });
    await tx.spot.update({ where: { id: UCHINO_JINJA }, data: { lat: 35.32123, lng: 138.576963 } });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

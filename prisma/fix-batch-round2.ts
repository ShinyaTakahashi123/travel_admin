/**
 * #21〜#35の座標、企画運営の再突き合わせ(2026-10-13、2回目)を受けた直し。
 * いずれもnode/way単体の直接取得で再確認済み。
 * 1. #25(a54e45e0) 田主丸駅とかっぱの町並み: まだ大字「田主丸町田主丸」のまま
 *    だった(前回429aaddで直したのはいちご狩り#5の同名スポットで、こちらは別の
 *    しおり)。同じ田主丸駅の点(node 265888949、33.3387991,130.6923219)に修正
 * 2. #26(258b3878) 調音の滝公園: 大字「浮羽町妹川」のままだった。OSMの滝そのもの
 *    (node 7078744102、waterway=waterfall、height=27。メモの「落差約27m」と
 *    一致、33.2972146,130.747835)に修正
 * 3. #24(efaee93e) 伊予西条駅前（昼食）: 前回のnode 8599386263は停車位置
 *    (public_transport=stop_position)のタグ付きだったため、駅舎の建物
 *    (way 209018054、building=train_station、33.91251318,133.18753088)に修正
 * 4. #29(6eb0ef87) 万代地区（昼食）: 無名の道路「東港線」の点だったため、
 *    万代シテイ内の実在の建物(way 154084288、「LoveLa万代」、
 *    37.91724286666666,139.0562017)に修正。建物名はメモに書かない
 * 5. #31(6ef3e7a8) 肥前浜宿（昼食）: 無名の道路の点だったため、浜町内の実在の
 *    建物(way 1080280263、「吉田松月堂」、33.092389175,130.11360558333334。
 *    同じしおりの他スポットとは重ならない点)に修正。建物名はメモに書かない
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const TAISHUMARU_25_ID = "4d412ea4-9ec9-4b5d-aee4-9815d2f64363";
const CHOONNOTAKI_ID = "9601df4c-92f0-485f-ba10-1d919a8e3e37";
const IYOSAIJO_ID = "b7919763-ddd6-4b78-a93a-42e94552fa34";
const BANDAICHIKU_ID = "5f592a2e-b26d-4bbf-abdd-dd4537839ac7";
const HAMASHUKU_LUNCH_ID = "c3917c5a-73e4-49b5-8912-f347e2c284ee";

const fixes = [
  { id: TAISHUMARU_25_ID, lat: 33.3387991, lng: 130.6923219, label: "#25田主丸駅とかっぱの町並み(OSM node 265888949)" },
  { id: CHOONNOTAKI_ID, lat: 33.2972146, lng: 130.747835, label: "#26調音の滝公園(OSM node 7078744102)" },
  { id: IYOSAIJO_ID, lat: 33.91251318, lng: 133.18753088, label: "#24伊予西条駅前（昼食）(OSM way 209018054)" },
  { id: BANDAICHIKU_ID, lat: 37.91724286666666, lng: 139.0562017, label: "#29万代地区（昼食）(OSM way 154084288)" },
  { id: HAMASHUKU_LUNCH_ID, lat: 33.092389175, lng: 130.11360558333334, label: "#31肥前浜宿（昼食）(OSM way 1080280263)" },
];

async function main() {
  const spots = await Promise.all(fixes.map((f) => prisma.spot.findUnique({ where: { id: f.id } })));
  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i];
    if (!s) throw new Error("想定と違います: " + fixes[i].id);
    console.log(fixes[i].label, ":", s.lat, s.lng, "→", fixes[i].lat, fixes[i].lng);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i]!;
    const f = fixes[i];
    if (s.placeMasterId) {
      await prisma.placeMaster.update({ where: { id: s.placeMasterId }, data: { lat: f.lat, lng: f.lng, positionSource: "osm" } });
    }
    await prisma.spot.update({ where: { id: s.id }, data: { lat: f.lat, lng: f.lng } });
  }
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

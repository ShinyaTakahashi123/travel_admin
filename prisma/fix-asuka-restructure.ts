/**
 * 組み直し、0e15e22b（石舞台と高松塚古墳、古代日本のロマンを巡る日帰りプラン）。
 *
 * 点の直し(OSM、いずれも名前のある地物):
 *  酒船石遺跡 34.4711,135.8214(約500m南西にずれ) → archaeological_site way1566437305
 *    34.4755876,135.823397
 *  岡寺 34.4694,135.8242 → place_of_worship way491841439 34.4716806,135.8283148
 *  飛鳥京跡 34.4728,135.8217 → 「飛鳥宮跡」archaeological_site way516813148
 *    34.4733744,135.8208618
 *  飛鳥寺 34.4744,135.8228(約500m南東にずれ) → place_of_worship way813386514
 *    34.4786718,135.820198
 *  奈良文化財研究所飛鳥資料館 34.4783,135.8156(約900m南西にずれ) → tourism=museum
 *    node1423058418 34.4842923,135.8251027
 *  石舞台古墳 34.4661,135.8228 → archaeological_site way1455208274 34.4668488,135.8261444
 *  高松塚古墳 34.462222,135.806472(0.1秒刻みの丸め) → archaeological_site
 *    way1566437308 34.4622811,135.8061523
 *
 * 旅の足(routed-foot実測で組み直し。距離が延びる2区間はタクシーに):
 *  酒船石遺跡→岡寺: 歩き5→17分(1.25km)／岡寺→飛鳥京跡: 6→14分(1.00km)／
 *  飛鳥京跡→飛鳥寺: 5→12分(0.84km)／飛鳥寺→飛鳥資料館: 15分(1.06km、変更なし)／
 *  飛鳥資料館→石舞台古墳: 2.59km・歩くと35分かかるため、バス15分からタクシーに直す
 *    (OSRM車2.8分+5分=8分)／石舞台古墳→高松塚古墳: 3.23km・歩くと44分かかるため、
 *    歩き19分からタクシーに直す(OSRM車4.9分+5分=10分)／高松塚古墳→鬼の俎板: 4→8分
 *    (0.60km)／鬼の俎板→亀石: 11→18分(1.31km)／亀石→橘寺: 7→11分(0.77km)／
 *    橘寺→川原寺跡: 8分(0.54km、変更なし)
 *  この組み直しで、岡寺以降の時刻がずれる。1か所目の始まりを9:00→8:30に遅らせず早めて
 *    (日帰りの始まりの範囲8:30〜9:30の中)吸収。終わりは16:51(発車16:30〜17:00の中)
 *
 * ほか:
 *  - 1か所目の書き出しに、最寄りの近鉄飛鳥駅からの行き方がなかったため追加
 *    (駅から酒船石遺跡まで徒歩3.07km・41分と遠いため、タクシーで。OSRM車4.1分+5分=9分)
 *  - 最後に帰りの一文がなかったため追加(川原寺跡→飛鳥駅、OSRM車3.1分+5分=8分)
 *  - 「1日目は」(日帰りなのに1日目という言い方) → 「今日は」
 *  - 昼食の一文がなかったため追加。石舞台古墳(滞在40分)は見学と昼食の両方には短すぎる
 *    (決まりA、延ばすのは不可)ため、滞在75分のある高松塚古墳(始まり13:11、11:30〜13:30の
 *    中)に入れた。高松塚エリアに食事処が複数あることを明日香村公式サイト
 *    (asukamura.com/sightseeing/area/takamatuzuka/)で確認。店の名前は書かない
 *  - 「〜してみてください」「〜してください」(祈りの言い方ではない所、3つ)を
 *    「〜しましょう」に。岡寺・橘寺の「お参りください」はそのまま(祈りの言い方として残す)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "0e15e22b-28ca-4f50-978e-fb3304f7ec51";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const SAKAFUNEISHI = "酒船石遺跡";
const OKADERA = "岡寺";
const ASUKAKYO = "飛鳥京跡";
const ASUKADERA = "飛鳥寺";
const SHIRYOKAN = "奈良文化財研究所飛鳥資料館";
const ISHIBUTAI = "石舞台古墳";
const TAKAMATSUZUKA = "高松塚古墳";
const ONI = "鬼の俎板・鬼の雪隠";
const KAMEISHI = "亀石";
const TACHIBANADERA = "橘寺";
const KAWAHARADERA = "川原寺跡";

const coordFixes: { name: string; oldLat: number; oldLng: number; newLat: number; newLng: number }[] = [
  { name: SAKAFUNEISHI, oldLat: 34.4711, oldLng: 135.8214, newLat: 34.4755876, newLng: 135.823397 },
  { name: OKADERA, oldLat: 34.4694, oldLng: 135.8242, newLat: 34.4716806, newLng: 135.8283148 },
  { name: ASUKAKYO, oldLat: 34.4728, oldLng: 135.8217, newLat: 34.4733744, newLng: 135.8208618 },
  { name: ASUKADERA, oldLat: 34.4744, oldLng: 135.8228, newLat: 34.4786718, newLng: 135.820198 },
  { name: SHIRYOKAN, oldLat: 34.4783, oldLng: 135.8156, newLat: 34.4842923, newLng: 135.8251027 },
  { name: ISHIBUTAI, oldLat: 34.4661, oldLng: 135.8228, newLat: 34.4668488, newLng: 135.8261444 },
  { name: TAKAMATSUZUKA, oldLat: 34.462222, oldLng: 135.806472, newLat: 34.4622811, newLng: 135.8061523 },
];

type Fix = { name: string; from: string; to: string };

const fixes: Fix[] = [
  // 酒船石遺跡
  {
    name: SAKAFUNEISHI,
    from: "1日目は、用途不明の謎めいた石造物が残る、酒船石遺跡からです。",
    to: "今日は、飛鳥駅からタクシーでおよそ9分の、用途不明の謎めいた石造物が残る酒船石遺跡から始めます。",
  },
  {
    name: SAKAFUNEISHI,
    from: "続いては岡寺へ向かいましょう。",
    to: "続いては、歩いておよそ17分、岡寺へ向かいましょう。",
  },
  // 岡寺
  {
    name: OKADERA,
    from: "酒船石遺跡から歩いておよそ5分、岡寺に着きます。",
    to: "酒船石遺跡から歩いておよそ17分、岡寺に着きます。",
  },
  {
    name: OKADERA,
    from: "境内は祈りの場ですので、静かに、敬意をもってお過ごしください。",
    to: "境内は祈りの場ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: OKADERA,
    from: "続いては飛鳥京跡へ向かいましょう。",
    to: "続いては、歩いておよそ14分、飛鳥京跡へ向かいましょう。",
  },
  // 飛鳥京跡
  {
    name: ASUKAKYO,
    from: "岡寺から歩いておよそ6分、飛鳥京跡に着きます。",
    to: "岡寺から歩いておよそ14分、飛鳥京跡に着きます。",
  },
  {
    name: ASUKAKYO,
    from: "続いては飛鳥寺へ向かいましょう。",
    to: "続いては、歩いておよそ12分、飛鳥寺へ向かいましょう。",
  },
  // 飛鳥寺
  {
    name: ASUKADERA,
    from: "飛鳥京跡から歩いておよそ5分、飛鳥寺に着きます。",
    to: "飛鳥京跡から歩いておよそ12分、飛鳥寺に着きます。",
  },
  {
    name: ASUKADERA,
    from: "大仏の、穏やかな表情をじっくりと眺めてみてください。",
    to: "大仏の、穏やかな表情をじっくりと眺めてみましょう。",
  },
  {
    name: ASUKADERA,
    from: "続いては奈良文化財研究所飛鳥資料館へ向かいましょう。",
    to: "続いては、歩いておよそ15分、奈良文化財研究所飛鳥資料館へ向かいましょう。",
  },
  // 飛鳥資料館
  {
    name: SHIRYOKAN,
    from: "続いては石舞台古墳へ向かいましょう。",
    to: "続いては、タクシーでおよそ8分、石舞台古墳へ向かいましょう。",
  },
  // 石舞台古墳
  {
    name: ISHIBUTAI,
    from: "飛鳥資料館からバスでおよそ15分、石舞台古墳に着きます。",
    to: "飛鳥資料館からタクシーでおよそ8分、石舞台古墳に着きます。",
  },
  {
    name: ISHIBUTAI,
    from: "現在も石室の中に入ることができるので、ゆっくりと巨石の迫力を楽しんでください。続いては高松塚古墳へ向かいましょう。",
    to: "現在も石室の中に入ることができるので、ゆっくりと巨石の迫力を楽しみましょう。続いては、タクシーでおよそ10分、高松塚古墳へ向かいましょう。",
  },
  // 高松塚古墳
  {
    name: TAKAMATSUZUKA,
    from: "石舞台古墳から歩いておよそ19分、高松塚古墳に着きます。",
    to: "石舞台古墳からタクシーでおよそ10分、高松塚古墳に着きます。",
  },
  {
    name: TAKAMATSUZUKA,
    from: "古代の人々の美意識と、それを今に伝える保存の努力の両方を感じられる場所です。続いては鬼の俎板・鬼の雪隠へ向かいましょう。",
    to: "古代の人々の美意識と、それを今に伝える保存の努力の両方を感じられる場所です。まわりには食事ができる店もあるので、ここで昼食にしましょう。続いては、歩いておよそ8分、鬼の俎板・鬼の雪隠へ向かいましょう。",
  },
  // 鬼の俎板・鬼の雪隠
  {
    name: ONI,
    from: "高松塚古墳から歩いておよそ4分、鬼の俎板・鬼の雪隠に着きます。",
    to: "高松塚古墳から歩いておよそ8分、鬼の俎板・鬼の雪隠に着きます。",
  },
  {
    name: ONI,
    from: "この後は、歩いておよそ11分、亀石へ向かいましょう。",
    to: "この後は、歩いておよそ18分、亀石へ向かいましょう。",
  },
  // 亀石
  {
    name: KAMEISHI,
    from: "鬼の俎板・鬼の雪隠から歩いておよそ11分、亀石に着きます。",
    to: "鬼の俎板・鬼の雪隠から歩いておよそ18分、亀石に着きます。",
  },
  {
    name: KAMEISHI,
    from: "続いては橘寺へ向かいましょう。",
    to: "続いては、歩いておよそ11分、橘寺へ向かいましょう。",
  },
  // 橘寺
  {
    name: TACHIBANADERA,
    from: "亀石から歩いておよそ7分、橘寺に着きます。",
    to: "亀石から歩いておよそ11分、橘寺に着きます。",
  },
  {
    name: TACHIBANADERA,
    from: "続いては川原寺跡へ向かいましょう。",
    to: "続いては、歩いておよそ8分、川原寺跡へ向かいましょう。",
  },
  // 川原寺跡
  {
    name: KAWAHARADERA,
    from: "橘寺から道をはさんですぐ、旅の最後は川原寺跡です。",
    to: "橘寺から歩いておよそ8分、旅の最後は川原寺跡です。",
  },
  {
    name: KAWAHARADERA,
    from: "飛鳥の歴史散策の締めくくりに、ゆっくりと余韻を味わってください。",
    to: "飛鳥の歴史散策の締めくくりに、ゆっくりと余韻を味わいましょう。帰りは、タクシーでおよそ8分の飛鳥駅から、電車に乗りましょう。",
  },
];

const timeShifts: { name: string; oldTime: [number, number]; newTime: [number, number] }[] = [
  { name: SAKAFUNEISHI, oldTime: [9, 0], newTime: [8, 30] },
  { name: OKADERA, oldTime: [9, 35], newTime: [9, 17] },
  { name: ASUKAKYO, oldTime: [10, 6], newTime: [9, 56] },
  { name: ASUKADERA, oldTime: [10, 31], newTime: [10, 28] },
  { name: SHIRYOKAN, oldTime: [11, 26], newTime: [11, 23] },
  { name: ISHIBUTAI, oldTime: [12, 31], newTime: [12, 21] },
  { name: TAKAMATSUZUKA, oldTime: [13, 30], newTime: [13, 11] },
  { name: ONI, oldTime: [14, 49], newTime: [14, 34] },
  { name: KAMEISHI, oldTime: [15, 25], newTime: [15, 17] },
  { name: TACHIBANADERA, oldTime: [15, 52], newTime: [15, 48] },
  { name: KAWAHARADERA, oldTime: [16, 35], newTime: [16, 31] },
];

const legFixes: { name: string; oldMode: string; oldMin: number; newMode: string; newMin: number }[] = [
  { name: OKADERA, oldMode: "walk", oldMin: 5, newMode: "walk", newMin: 17 },
  { name: ASUKAKYO, oldMode: "walk", oldMin: 6, newMode: "walk", newMin: 14 },
  { name: ASUKADERA, oldMode: "walk", oldMin: 5, newMode: "walk", newMin: 12 },
  { name: ISHIBUTAI, oldMode: "bus", oldMin: 15, newMode: "taxi", newMin: 8 },
  { name: TAKAMATSUZUKA, oldMode: "walk", oldMin: 19, newMode: "taxi", newMin: 10 },
  { name: ONI, oldMode: "walk", oldMin: 4, newMode: "walk", newMin: 8 },
  { name: KAMEISHI, oldMode: "walk", oldMin: 11, newMode: "walk", newMin: 18 },
  { name: TACHIBANADERA, oldMode: "walk", oldMin: 7, newMode: "walk", newMin: 11 },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const memoUpdates: { id: string; name: string; before: string; after: string }[] = [];
  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    const already = memoUpdates.find((u) => u.id === spot.id);
    const base = already ? already.after : spot.memo ?? "";
    if (!base.includes(f.from)) throw new Error(`${f.name}: 期待する文「${f.from}」が見つかりません`);
    const after = base.replace(f.from, f.to);
    if (already) already.after = after;
    else memoUpdates.push({ id: spot.id, name: f.name, before: spot.memo ?? "", after });
  }
  for (const u of memoUpdates) {
    console.log(`\n[${u.name}]\n旧: ${u.before}\n新: ${u.after}`);
  }

  const coordUpdates: { id: string; name: string; newLat: number; newLng: number }[] = [];
  for (const c of coordFixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: c.name, day: { itineraryId: ITIN_ID } } });
    if (Math.abs(Number(spot.lat) - c.oldLat) > 1e-6 || Math.abs(Number(spot.lng) - c.oldLng) > 1e-6) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致`);
    }
    coordUpdates.push({ id: spot.id, name: c.name, newLat: c.newLat, newLng: c.newLng });
    console.log(`\n[${c.name}] 座標: ${c.oldLat},${c.oldLng} → ${c.newLat},${c.newLng}`);
  }

  const timeUpdates: { id: string; name: string; oldTime: [number, number]; newTime: [number, number] }[] = [];
  for (const ts of timeShifts) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: ts.name, day: { itineraryId: ITIN_ID } } });
    const expected = t(ts.oldTime[0], ts.oldTime[1]).getTime();
    if (spot.visitTime?.getTime() !== expected) throw new Error(`${ts.name}: visitTime現在値が期待と不一致`);
    timeUpdates.push({ id: spot.id, name: ts.name, oldTime: ts.oldTime, newTime: ts.newTime });
  }
  console.log("\n[時刻の組み直し]");
  for (const tu of timeUpdates) {
    console.log(`${tu.name}: ${tu.oldTime[0]}:${String(tu.oldTime[1]).padStart(2, "0")} → ${tu.newTime[0]}:${String(tu.newTime[1]).padStart(2, "0")}`);
  }
  console.log("終わり: 16:51（日帰りの発車16:30〜17:00の中）");

  const legUpdates: { legId: string; name: string; oldMode: string; oldMin: number; newMode: string; newMin: number }[] = [];
  for (const lf of legFixes) {
    const leg = await prisma.spotTransitLeg.findFirstOrThrow({ where: { spot: { name: lf.name, day: { itineraryId: ITIN_ID } } } });
    if (leg.transitMode !== lf.oldMode || leg.transitDurationMin !== lf.oldMin) {
      throw new Error(`${lf.name}: leg現在値が期待と不一致(${leg.transitMode},${leg.transitDurationMin})`);
    }
    legUpdates.push({ legId: leg.id, name: lf.name, oldMode: lf.oldMode, oldMin: lf.oldMin, newMode: lf.newMode, newMin: lf.newMin });
  }
  console.log("\n[区間の組み直し]");
  for (const lu of legUpdates) {
    console.log(`${lu.name} incoming: ${lu.oldMode}${lu.oldMin}分 → ${lu.newMode}${lu.newMin}分`);
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of memoUpdates) {
      await tx.spot.update({ where: { id: u.id }, data: { memo: u.after } });
    }
    for (const c of coordUpdates) {
      await tx.spot.update({ where: { id: c.id }, data: { lat: c.newLat, lng: c.newLng } });
    }
    for (const tu of timeUpdates) {
      await tx.spot.update({ where: { id: tu.id }, data: { visitTime: t(tu.newTime[0], tu.newTime[1]) } });
    }
    for (const lu of legUpdates) {
      await tx.spotTransitLeg.update({ where: { id: lu.legId }, data: { transitMode: lu.newMode, transitDurationMin: lu.newMin } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

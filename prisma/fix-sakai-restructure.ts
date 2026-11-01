/**
 * 組み直し、06d30178（世界遺産・仁徳天皇陵から刃物の街を巡る堺日帰りプラン）。
 *
 * 点の直し:
 *  - 堺市博物館 34.5636,135.4844(いまの点は約540m北) → OSM tourism=museum
 *    relation17347564 34.5587792,135.4846762
 *  - 堺伝統産業会館 34.5714,135.4794(いまの点は約1.3km南東) → OSM node4937644440
 *    34.5828863,135.4774903
 *  - 二色の浜公園 34.436417,135.335667(0.1秒刻みの丸め): OSMに単独の名前の入口点はなく、
 *    公園は3つの面(leisure=park)に分かれている。名前のある地物がないため、7章の例外で
 *    最寄りの南海本線「二色浜」駅の点(34.4325084,135.3450903)に直す。書き出しに
 *    「二色浜駅から歩いておよそ18分」を追加(routed-foot 1.34km・17.9分)
 *  - 山口家住宅は、すでにOSM node5712619222の値と一致(34.586657,135.48252)のため変更なし
 *
 * 旅の足(組み直し。すべて実測+歩き/車はOSRM、車はOSRM+5分の決まりで四捨五入せず繰り上げ):
 *  大仙公園日本庭園→堺市博物館(新点): 歩き9→7分(483m・6.4分)
 *  堺市博物館(新点)→堺伝統産業会館(新点): 3.6km・歩くと48分かかる距離のため、歩き15分は
 *    誤り。直接のバス路線がなく、乗り換え2回のバス・JR(約41分)よりわかりやすいタクシーに
 *    直す(OSRM car 7.4分+5分=13分)
 *  堺伝統産業会館(新点)→山口家住宅: 704m・9.4分の近さで、バス24分は誤り。歩きに直す(10分)
 *  山口家住宅→南宗寺: 2.6km・歩くと34分。阪堺線(宿院→御陵前)も検討したが、乗換を含めても
 *    大きな時間短縮にならないため、タクシーに直す(OSRM car 5.0分+5分=10分)
 *  南宗寺→二色の浜公園: 電車50分は変更なし。書き出し・終わりの文に分の記載がなかったため追加
 *
 *  この組み直しにより、堺市博物館以降の時刻がずれる。終わりは16:30(日帰りの発車16:30〜
 *  17:00の下限)
 *
 * ほか:
 *  - 昼食の一文がなかったため、堺伝統産業会館(12:00〜12:53、始まりは昼食の時間帯11:30〜
 *    13:30の中)に追加
 *  - 堺伝統産業会館の「貴重なスポットです」の「貴重な」(出典のない形容)を外す
 *  - 南宗寺の「大坂夏の陣で徳川家康が命を落とし、密かにこの寺に葬られた」(死の場面を描く
 *    言い方、5章)→ 場面を外し、言い伝えの核だけに
 *  - 「〜してみてください」「〜してください」(祈りの言い方ではない所、5つ)を「〜しましょう」
 *    に。南宗寺の「お過ごしください」も含む
 *  - 二色の浜公園の最後に、帰りの一文(最寄り駅までの分)がなかったため追加
 *    (二色浜駅まで徒歩17.9分→18分)。「電車をご利用ください」は「電車で帰りましょう」に
 *  - 「うみテラス二色の浜」(2025年9月開業のグランピング施設の名前)を外す
 *  - 山口家住宅の「全国的にも数少ない、…貴重な建物として」の「数少ない」「貴重な」
 *    (出典のない形容)を外す
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "06d30178-8d19-4648-99f4-da80b59094a7";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const NINTOKU = "仁徳天皇陵古墳（大仙陵古墳）";
const DAISEN = "大仙公園日本庭園";
const HAKUBUTSUKAN = "堺市博物館";
const DENTOSANGYO = "堺伝統産業会館";
const YAMAGUCHI = "山口家住宅";
const NANSHUJI = "南宗寺";
const NISHIKI = "二色の浜公園";

const HAKUBUTSUKAN_LAT = 34.5587792;
const HAKUBUTSUKAN_LNG = 135.4846762;
const DENTOSANGYO_LAT = 34.5828863;
const DENTOSANGYO_LNG = 135.4774903;
const NISHIKI_LAT = 34.4325084;
const NISHIKI_LNG = 135.3450903;

type Fix = { name: string; from: string; to: string };

const fixes: Fix[] = [
  // 仁徳天皇陵
  {
    name: NINTOKU,
    from: "古代の権力の大きさに思いを馳せてみてください。",
    to: "古代の権力の大きさに思いを馳せてみましょう。",
  },
  {
    name: NINTOKU,
    from: "この後は、大仙公園の中にある日本庭園へ向かいましょう。",
    to: "この後は、歩いておよそ11分、大仙公園の中にある日本庭園へ向かいましょう。",
  },
  // 大仙公園日本庭園
  {
    name: DAISEN,
    from: "静かなひとときを過ごしてみてください。",
    to: "静かなひとときを過ごしてみましょう。",
  },
  {
    name: DAISEN,
    from: "この後は、堺市博物館へ向かいましょう。",
    to: "この後は、歩いておよそ7分、堺市博物館へ向かいましょう。",
  },
  // 堺市博物館
  {
    name: HAKUBUTSUKAN,
    from: "大仙公園日本庭園から歩いておよそ9分、大仙公園の中に建つ堺市博物館に着きます。",
    to: "大仙公園日本庭園から歩いておよそ7分、大仙公園の中に建つ堺市博物館に着きます。",
  },
  {
    name: HAKUBUTSUKAN,
    from: "展示室をひととおり見学したら、次は堺の職人技が集まる堺伝統産業会館へ向かいましょう。",
    to: "展示室をひととおり見学したら、タクシーでおよそ13分、堺の職人技が集まる堺伝統産業会館へ向かいましょう。",
  },
  // 堺伝統産業会館
  {
    name: DENTOSANGYO,
    from: "堺市博物館から移動して次に訪れるのは、堺伝統産業会館です。2011年10月にオープンした施設で、堺に息づく伝統産業をまとめて見て、買って、体験できる貴重なスポットです。",
    to: "堺市博物館からタクシーでおよそ13分、堺伝統産業会館に着きます。2011年10月にオープンした施設で、堺に息づく伝統産業をまとめて見て、買って、体験できるスポットです。",
  },
  {
    name: DENTOSANGYO,
    from: "堺ならではの品々が並びます。お土産選びを楽しんだら、次は江戸時代の商家のたたずまいを伝える山口家住宅へ向かいましょう。",
    to: "堺ならではの品々が並びます。会館のまわりには食事ができる店もあるので、ここで昼食にしましょう。お土産選びを楽しんだら、歩いておよそ10分、江戸時代の商家のたたずまいを伝える山口家住宅へ向かいましょう。",
  },
  // 山口家住宅
  {
    name: YAMAGUCHI,
    from: "堺伝統産業会館からバスでおよそ24分、堺市立町家歴史館 山口家住宅に着きます。",
    to: "堺伝統産業会館から歩いておよそ10分、堺市立町家歴史館 山口家住宅に着きます。",
  },
  {
    name: YAMAGUCHI,
    from: "全国的にも数少ない、江戸初期の町家建築が残る貴重な建物として、昭和41年(1966)に国の重要文化財に指定されました。",
    to: "江戸初期の町家建築が残る建物として、昭和41年(1966)に国の重要文化財に指定されました。",
  },
  {
    name: YAMAGUCHI,
    from: "歴史ある町家の空間を、じっくりと歩いてみてください。",
    to: "歴史ある町家の空間を、じっくりと歩いてみましょう。",
  },
  {
    name: YAMAGUCHI,
    from: "この後はバスで、千利休ゆかりの禅寺、南宗寺へ向かいましょう。",
    to: "この後はタクシーでおよそ10分、千利休ゆかりの禅寺、南宗寺へ向かいましょう。",
  },
  // 南宗寺
  {
    name: NANSHUJI,
    from: "山口家住宅から移動して次に訪れるのは、千利休ゆかりの禅寺、南宗寺です。",
    to: "山口家住宅からタクシーでおよそ10分、千利休ゆかりの禅寺、南宗寺に着きます。",
  },
  {
    name: NANSHUJI,
    from: "実はこの寺には、大坂夏の陣で徳川家康が命を落とし、密かにこの寺に葬られたという言い伝えも残っています。",
    to: "実はこの寺には、徳川家康がひそかに葬られたという言い伝えも残っています。",
  },
  {
    name: NANSHUJI,
    from: "境内では静かに、敬意をもってお過ごしください。",
    to: "境内では静かに、敬意をもってお過ごしましょう。",
  },
  {
    name: NANSHUJI,
    from: "堺での歴史散策はここでひと区切り。この後は海沿いの景勝地、二色の浜公園へと移動しましょう。",
    to: "堺での歴史散策はここでひと区切り。この後は電車でおよそ50分、海沿いの景勝地、二色の浜公園へと移動しましょう。",
  },
  // 二色の浜公園
  {
    name: NISHIKI,
    from: "堺伝統産業会館で刃物づくりの技に触れ、南宗寺で静かな禅の空気を味わった後は、海辺の景色が広がる二色の浜公園で今日一日の締めくくりです。",
    to: "南宗寺から電車でおよそ50分、二色浜駅に着きます。そこから歩いておよそ18分、海辺の景色が広がる二色の浜公園に着きます。堺伝統産業会館で刃物づくりの技に触れ、南宗寺で静かな禅の空気を味わった後は、今日一日の締めくくりです。",
  },
  {
    name: NISHIKI,
    from: "2025年9月には園内に新しくグランピング施設「うみテラス二色の浜」もオープンし、日帰りでも宿泊でも楽しめる場所へと進化しています。",
    to: "",
  },
  {
    name: NISHIKI,
    from: "堺の歴史をたどる旅の最後を、海辺の穏やかな景色で締めくくってみてください。",
    to: "堺の歴史をたどる旅の最後を、海辺の穏やかな景色で締めくくってみましょう。帰りは、歩いておよそ18分の二色浜駅から、電車で帰りましょう。",
  },
  {
    name: NISHIKI,
    from: "松林の中をゆっくり散策すれば、潮風とともに心が落ち着いていくのを感じられるはずです。",
    to: "松林の中を散策すれば、潮風とともに心が落ち着いていくのを感じられるはずです。",
  },
];

const timeShifts: { name: string; oldTime: [number, number]; newTime: [number, number] }[] = [
  { name: HAKUBUTSUKAN, oldTime: [10, 30], newTime: [10, 28] },
  { name: DENTOSANGYO, oldTime: [12, 4], newTime: [12, 0] },
  { name: YAMAGUCHI, oldTime: [13, 21], newTime: [13, 3] },
  { name: NANSHUJI, oldTime: [14, 11], newTime: [13, 43] },
  { name: NISHIKI, oldTime: [15, 56], newTime: [15, 28] },
];

const legFixes: { name: string; oldMode: string; oldMin: number; newMode: string; newMin: number }[] = [
  { name: HAKUBUTSUKAN, oldMode: "walk", oldMin: 9, newMode: "walk", newMin: 7 },
  { name: DENTOSANGYO, oldMode: "walk", oldMin: 15, newMode: "taxi", newMin: 13 },
  { name: YAMAGUCHI, oldMode: "bus", oldMin: 24, newMode: "walk", newMin: 10 },
  { name: NANSHUJI, oldMode: "bus", oldMin: 20, newMode: "taxi", newMin: 10 },
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

  const hakubutsukan = await prisma.spot.findFirstOrThrow({ where: { name: HAKUBUTSUKAN, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(hakubutsukan.lat) - 34.5636) > 1e-6 || Math.abs(Number(hakubutsukan.lng) - 135.4844) > 1e-6) {
    throw new Error("堺市博物館: 座標現在値が期待と不一致");
  }
  const dentosangyo = await prisma.spot.findFirstOrThrow({ where: { name: DENTOSANGYO, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(dentosangyo.lat) - 34.5714) > 1e-6 || Math.abs(Number(dentosangyo.lng) - 135.4794) > 1e-6) {
    throw new Error("堺伝統産業会館: 座標現在値が期待と不一致");
  }
  const nishiki = await prisma.spot.findFirstOrThrow({ where: { name: NISHIKI, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(nishiki.lat) - 34.436417) > 1e-6 || Math.abs(Number(nishiki.lng) - 135.335667) > 1e-6) {
    throw new Error("二色の浜公園: 座標現在値が期待と不一致");
  }
  console.log(`\n[堺市博物館] 座標: 34.5636,135.4844 → ${HAKUBUTSUKAN_LAT},${HAKUBUTSUKAN_LNG}`);
  console.log(`[堺伝統産業会館] 座標: 34.5714,135.4794 → ${DENTOSANGYO_LAT},${DENTOSANGYO_LNG}`);
  console.log(`[二色の浜公園] 座標: 34.436417,135.335667 → ${NISHIKI_LAT},${NISHIKI_LNG}（7章の例外。南海本線「二色浜」駅の点）`);

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
  console.log("終わり: 16:30（日帰りの発車16:30〜17:00の下限）");

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
    await tx.spot.update({ where: { id: hakubutsukan.id }, data: { lat: HAKUBUTSUKAN_LAT, lng: HAKUBUTSUKAN_LNG } });
    await tx.spot.update({ where: { id: dentosangyo.id }, data: { lat: DENTOSANGYO_LAT, lng: DENTOSANGYO_LNG } });
    await tx.spot.update({ where: { id: nishiki.id }, data: { lat: NISHIKI_LAT, lng: NISHIKI_LNG } });
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

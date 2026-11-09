/**
 * 組み直し、0928e88e（赤木城跡と丸山千枚田、山里の史跡と絶景棚田を巡るプラン・日帰り）。
 * (v2: 法務・企画運営の指示を反映。木津呂展望スポット・入鹿温泉ホテル瀞流荘〈もと瀞峡展望
 * テラス〉の2つを外し、瀞峡・北山峡・田平子峠刑場跡の3つに差し替える)
 *
 * 必ず直す・組み直しの理由:
 *  - 最後のスポットが宿の名前「入鹿温泉ホテル瀞流荘」で、名前だけ変えても点・中身がホテル
 *    のまま(6章)。木津呂展望スポットの点(33.8746,135.901)も出典がなく、しかも「ホテル裏の
 *    山から木津呂の集落が見える」という説明自体、複数の旅行サイトで「集落は見えない」とされ
 *    事実と違う可能性がある。→ 2つを外す
 *  - 代わりに、OSMの名前のある点を3つ使う: 瀞峡(Doro-kyo Gorge) tourism=viewpoint
 *    node2236308534 33.913062,135.894810(「瀞八丁」の名で国の天然記念物、昭和3年に
 *    吉野熊野国立公園指定。観光三重で確認)、北山峡(Kitayama-Kyo Gorge) tourism=viewpoint
 *    node2236308439 33.921823,135.898018(瀞峡と同じ北山川沿い、車で1分)、田平子峠刑場跡
 *    (OSM「田平子峠」memorial node7453348159 33.891151,135.948243、赤木城跡と同じ国指定
 *    史跡「赤木城跡及び田平子峠刑場跡」。文化遺産オンラインで確認)
 *  - 赤木城跡 33.895278,135.952222(度分秒から直した値)→ OSM historic=ruins
 *    node4252258060 33.8952465,135.9522196 に直す
 *
 * 旅の足・時刻:
 *  赤木城跡→丸山千枚田: 15→6分／丸山千枚田→布引の滝: 20→27分／布引の滝→紀州鉱山資料館:
 *  15→19分／紀州鉱山資料館→湯ノ口温泉: 15→10分（すべてrouted-car実測）
 *  湯ノ口温泉→瀞峡: 車15分(14.9分)／瀞峡→北山峡: 車1分(0.8分)／北山峡→田平子峠刑場跡:
 *  車13分(13.0分)
 *  滞在は瀞峡20分・北山峡20分・田平子峠刑場跡15分(慰霊の場、短め。法務の指示)。
 *  延ばして時刻に合わせることはせず、終わりは16:11(日帰りの発車16:30〜17:00より19分早い。
 *  企画運営・法務に相談中)
 *
 * 田平子峠刑場跡の文は法務の指示どおり: 処刑の様子・人数・年齢は書かない。一方的な評価の
 * 言葉（「抵抗した」など）を入れず、文化遺産オンラインの事実だけ。終わりは慰霊の場の決まりの
 * 文「慰霊の場でもあるので、静かに、敬意をもって見学しましょう」。昼食の文は入れない
 *
 * ほか: 木津呂展望スポットの「近年は静かな人気」(出典なし)は外す。紀州鉱山資料館の昼食
 * (12:52〜13:22)は既にあり、直さない
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "0928e88e-380c-4702-9559-af6252822245";
const DAY_ID = "35f3e6cc-dc1c-40a8-948a-7540d32bcda0";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const AKAGI = "赤木城跡";
const MARUYAMA = "丸山千枚田";
const NUNOBIKI = "布引の滝";
const KISEKI = "紀州鉱山資料館";
const YUNOKUCHI = "湯ノ口温泉";
const KIZURO_OLD = "木津呂展望スポット";
const TORORYUSO_OLD = "入鹿温泉ホテル瀞流荘";

const AKAGI_OLD_LAT = 33.895278;
const AKAGI_OLD_LNG = 135.952222;
const AKAGI_NEW_LAT = 33.8952465;
const AKAGI_NEW_LNG = 135.9522196;

const MARUYAMA_OLD_LAT = 33.875;
const MARUYAMA_OLD_LNG = 135.955556;
const MARUYAMA_NEW_LAT = 33.8756237;
const MARUYAMA_NEW_LNG = 135.9524885;

type MemoFix = { name: string; from: string; to: string };

const memoFixes: MemoFix[] = [
  { name: AKAGI, from: "車で約15分の丸山千枚田へ向かいましょう。", to: "車で約6分の丸山千枚田へ向かいましょう。" },
  {
    name: MARUYAMA,
    from: "赤木城跡から車で約15分、山の斜面いっぱいに広がる丸山千枚田に到着です。",
    to: "赤木城跡から車で約6分、山の斜面いっぱいに広がる丸山千枚田に到着です。",
  },
  {
    name: MARUYAMA,
    from: "この後は、車でおよそ20分、日本の滝百選のひとつ・布引の滝へ向かいましょう。",
    to: "この後は、車でおよそ27分、日本の滝百選のひとつ・布引の滝へ向かいましょう。",
  },
  {
    name: NUNOBIKI,
    from: "丸山千枚田から車でおよそ20分、日本の滝百選のひとつに数えられる布引の滝に着きます。",
    to: "丸山千枚田から車でおよそ27分、日本の滝百選のひとつに数えられる布引の滝に着きます。",
  },
  {
    name: NUNOBIKI,
    from: "この後は、車でおよそ15分、紀州鉱山の歴史を伝える紀州鉱山資料館へ向かいましょう。",
    to: "この後は、車でおよそ19分、紀州鉱山の歴史を伝える紀州鉱山資料館へ向かいましょう。",
  },
  {
    name: KISEKI,
    from: "布引の滝から車でおよそ15分、紀州鉱山の歴史を伝える紀州鉱山資料館に着きます。",
    to: "布引の滝から車でおよそ19分、紀州鉱山の歴史を伝える紀州鉱山資料館に着きます。",
  },
  {
    name: KISEKI,
    from: "この後は、車でおよそ15分、山あいの秘湯・湯ノ口温泉へ向かいましょう。",
    to: "この後は、車でおよそ10分、山あいの秘湯・湯ノ口温泉へ向かいましょう。",
  },
  {
    name: YUNOKUCHI,
    from: "紀州鉱山資料館から車でおよそ15分、山あいにひっそりと湧く湯ノ口温泉に着きます。",
    to: "紀州鉱山資料館から車でおよそ10分、山あいにひっそりと湧く湯ノ口温泉に着きます。",
  },
  {
    name: YUNOKUCHI,
    from: "この後は、車でおよそ10分、北山川に抱かれた集落を見渡す木津呂展望スポットへ向かいましょう。",
    to: "この後は、車でおよそ20分、瀞峡へ向かいましょう。",
  },
];

const timeShifts: { name: string; oldTime: [number, number]; newTime: [number, number] }[] = [
  { name: MARUYAMA, oldTime: [10, 25], newTime: [10, 16] },
  { name: NUNOBIKI, oldTime: [12, 0], newTime: [11, 58] },
  { name: KISEKI, oldTime: [12, 50], newTime: [12, 52] },
  { name: YUNOKUCHI, oldTime: [13, 35], newTime: [13, 32] },
];

const DOROKYO_NAME = "瀞峡";
const DOROKYO_LAT = 33.91306;
const DOROKYO_LNG = 135.89481;
const DOROKYO_MEMO =
  "湯ノ口温泉から車でおよそ20分、瀞峡に着きます。北山川が深い淵と断崖絶壁をつくる景観で、「瀞八丁」の名で国の特別名勝・天然記念物に指定され、吉野熊野国立公園の一部にもなっています。断崖に咲く草花と、川の静かな流れを眺めてみましょう。この後は、車でおよそ6分、北山峡へ向かいましょう。";

const KITAYAMAKYO_NAME = "北山峡";
const KITAYAMAKYO_LAT = 33.921823;
const KITAYAMAKYO_LNG = 135.898018;
const KITAYAMAKYO_MEMO =
  "瀞峡から車でおよそ6分、同じ北山川沿いに続く北山峡に着きます。瀞峡とは違う角度から、渓谷の眺めを楽しむことができます。見学を終えたら、車でおよそ18分、田平子峠刑場跡へ向かいましょう。";

const TABIRAKO_NAME = "田平子峠刑場跡";
const TABIRAKO_LAT = 33.891151;
const TABIRAKO_LNG = 135.948243;
// 「天正17年(1589年)ごろに起きたとされる北山一揆」は、既存の赤木城跡メモと同じ出典
// (文化遺産オンライン「赤木城跡及び田平子峠刑場跡」)に基づく
const TABIRAKO_MEMO =
  "北山峡から車でおよそ18分、田平子峠刑場跡に着きます。赤木城跡とあわせて「赤木城跡及び田平子峠刑場跡」として国の史跡に指定されている場所で、天正17年(1589年)ごろに起きたとされる北山一揆に関わった人々の供養の塔が建っています。慰霊の場でもあるので、静かに、敬意をもって見学しましょう。見学を終えたら、乗ってきた車で帰りましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  // メモの直し(既存5スポット)
  const memoUpdates: { id: string; name: string; before: string; after: string }[] = [];
  for (const f of memoFixes) {
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

  // 赤木城跡・丸山千枚田の座標
  const akagi = await prisma.spot.findFirstOrThrow({ where: { name: AKAGI, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(akagi.lat) - AKAGI_OLD_LAT) > 1e-6 || Math.abs(Number(akagi.lng) - AKAGI_OLD_LNG) > 1e-6) {
    throw new Error("赤木城跡: 座標現在値が期待と不一致");
  }
  console.log(`\n[赤木城跡] 座標: ${AKAGI_OLD_LAT},${AKAGI_OLD_LNG} → ${AKAGI_NEW_LAT},${AKAGI_NEW_LNG}（OSM historic=ruins node4252258060）`);

  const maruyama = await prisma.spot.findFirstOrThrow({ where: { name: MARUYAMA, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(maruyama.lat) - MARUYAMA_OLD_LAT) > 1e-6 || Math.abs(Number(maruyama.lng) - MARUYAMA_OLD_LNG) > 1e-6) {
    throw new Error("丸山千枚田: 座標現在値が期待と不一致");
  }
  console.log(`[丸山千枚田] 座標: ${MARUYAMA_OLD_LAT},${MARUYAMA_OLD_LNG} → ${MARUYAMA_NEW_LAT},${MARUYAMA_NEW_LNG}（OSM tourism=viewpoint node4268072789）`);

  // 時刻のずらし(赤木城跡〜湯ノ口温泉)
  const timeUpdates: { id: string; name: string; oldTime: [number, number]; newTime: [number, number] }[] = [];
  for (const ts of timeShifts) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: ts.name, day: { itineraryId: ITIN_ID } } });
    const expected = t(ts.oldTime[0], ts.oldTime[1]).getTime();
    if (spot.visitTime?.getTime() !== expected) throw new Error(`${ts.name}: visitTime現在値が期待と不一致`);
    timeUpdates.push({ id: spot.id, name: ts.name, oldTime: ts.oldTime, newTime: ts.newTime });
  }
  console.log("\n[時刻の組み直し(既存分)]");
  for (const tu of timeUpdates) {
    console.log(`${tu.name}: ${tu.oldTime[0]}:${String(tu.oldTime[1]).padStart(2, "0")} → ${tu.newTime[0]}:${String(tu.newTime[1]).padStart(2, "0")}`);
  }

  // 新しい3スポット
  console.log(
    "\n[出典] 田平子峠刑場跡の「天正17年(1589年)ごろに起きたとされる北山一揆」は、文化遺産オンライン" +
      "「赤木城跡及び田平子峠刑場跡」(国指定史跡)の記載に基づく。瀞峡の「国の特別名勝・天然記念物」は文化遺産" +
      "オンライン「瀞八丁」(指定1928年3月24日)、「吉野熊野国立公園」は環境省サイト(指定1936年2月1日)で確認。" +
      "本文には年を書かない(法務の指示)"
  );
  console.log("\n[新しい3スポット]");
  console.log(`瀞峡: 15:07-15:27 (20分) ${DOROKYO_LAT},${DOROKYO_LNG}\n${DOROKYO_MEMO}`);
  console.log(`\n北山峡: 15:33-15:53 (20分) ${KITAYAMAKYO_LAT},${KITAYAMAKYO_LNG}\n${KITAYAMAKYO_MEMO}`);
  console.log(`\n田平子峠刑場跡: 16:11-16:26 (15分、isMemorial=true) ${TABIRAKO_LAT},${TABIRAKO_LNG}\n${TABIRAKO_MEMO}`);
  console.log("\n終わり: 16:26（日帰りの発車16:30〜17:00より4分早い。1件ずつの例外として企画運営・法務のOK待ち）");

  console.log("\n[木津呂展望スポット・入鹿温泉ホテル瀞流荘を削除]");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const kizuro = await prisma.spot.findFirstOrThrow({ where: { name: KIZURO_OLD, day: { itineraryId: ITIN_ID } } });
  const toroyuso = await prisma.spot.findFirstOrThrow({ where: { name: TORORYUSO_OLD, day: { itineraryId: ITIN_ID } } });

  await prisma.$transaction(async (tx) => {
    for (const u of memoUpdates) {
      await tx.spot.update({ where: { id: u.id }, data: { memo: u.after } });
    }
    await tx.spot.update({ where: { id: akagi.id }, data: { lat: AKAGI_NEW_LAT, lng: AKAGI_NEW_LNG } });
    await tx.spot.update({ where: { id: maruyama.id }, data: { lat: MARUYAMA_NEW_LAT, lng: MARUYAMA_NEW_LNG } });
    for (const tu of timeUpdates) {
      await tx.spot.update({ where: { id: tu.id }, data: { visitTime: t(tu.newTime[0], tu.newTime[1]) } });
    }

    await tx.spot.delete({ where: { id: kizuro.id } });
    await tx.spot.delete({ where: { id: toroyuso.id } });

    const dorokyo = await tx.spot.create({
      data: {
        dayId: DAY_ID,
        orderNo: 6,
        name: DOROKYO_NAME,
        lat: DOROKYO_LAT,
        lng: DOROKYO_LNG,
        visitTime: t(15, 7),
        stayDurationMin: 20,
        memo: DOROKYO_MEMO,
      },
    });
    await tx.spotTransitLeg.create({ data: { spotId: dorokyo.id, orderNo: 1, transitMode: "car", transitDurationMin: 20 } });

    const kitayamakyo = await tx.spot.create({
      data: {
        dayId: DAY_ID,
        orderNo: 7,
        name: KITAYAMAKYO_NAME,
        lat: KITAYAMAKYO_LAT,
        lng: KITAYAMAKYO_LNG,
        visitTime: t(15, 33),
        stayDurationMin: 20,
        memo: KITAYAMAKYO_MEMO,
      },
    });
    await tx.spotTransitLeg.create({ data: { spotId: kitayamakyo.id, orderNo: 1, transitMode: "car", transitDurationMin: 6 } });

    const tabirako = await tx.spot.create({
      data: {
        dayId: DAY_ID,
        orderNo: 8,
        name: TABIRAKO_NAME,
        lat: TABIRAKO_LAT,
        lng: TABIRAKO_LNG,
        visitTime: t(16, 11),
        stayDurationMin: 15,
        memo: TABIRAKO_MEMO,
        isMemorial: true,
      },
    });
    await tx.spotTransitLeg.create({ data: { spotId: tabirako.id, orderNo: 1, transitMode: "car", transitDurationMin: 18 } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

/**
 * 法務の10章見直し、蔵王(ce594140)の分。(v3: 法務の直し指示を反映)
 *  1. 蔵王ロープウェイ 蔵王山麓駅(1か所目): 「山形交通の路線バス」の会社の名前を外す
 *  2. 地蔵山頂駅と樹氷原→蔵王温泉(他30): 30分はロープウェイ2本+山麓駅からの歩き。
 *     「ロープウェイで山麓駅へ下り、歩いて、あわせておよそ30分」に。書き出しにも同じ分
 *  3〜5. 蔵王温泉→高湯通り(歩5)／高湯通り→上湯共同浴場(歩5)／上湯共同浴場→
 *     酢川温泉神社(歩5): 終わりの文はそのまま。書き出しの文に同じ分を追加
 *  6. 酢川温泉神社→山形市郷土館(バス70→62): 70分には出典のない「待ち」が8分
 *     入っていたため、企画運営の決め方（公式で確かめられた待ちだけ残す。確かめられなければ
 *     作らない）どおり、待ちは作らない。区間は歩き(酢川温泉神社→蔵王温泉バスターミナル、
 *     routed-foot 525m・7分)＋バス(約40分。郷土館の元の記載と同じ、山形市内の往来で既に
 *     使われている値)＋歩き(山形駅→郷土館、約15分、元の記載のまま)＝62分。
 *     8分短くなる分は、決まり(7章②)どおり、1か所目(蔵王ロープウェイ山麓駅)から
 *     酢川温泉神社までの5か所の始まりを8分ずつ遅らせて吸収。山形市郷土館の着く時刻・
 *     帰りの時刻は変わらない(15:40着・16:30発、もとのまま)。DBのtransitLineの会社名
 *     （山形交通の路線バス）も外す
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "ce594140-b602-4b84-9a15-7e1cda98c987";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

type Fix = { name: string; from: string; to: string };

const fixes: Fix[] = [
  {
    name: "蔵王ロープウェイ 蔵王山麓駅",
    from: "JR山形駅の東口から山形交通の路線バスで約40分",
    to: "JR山形駅の東口から路線バスで約40分",
  },
  {
    name: "地蔵山頂駅と樹氷原",
    from: "防寒をしっかりして、決められた場所の外には出ないようにしましょう。",
    to: "防寒をしっかりして、決められた場所の外には出ないようにしましょう。この後は、ロープウェイで山麓駅へ下り、歩いて、あわせておよそ30分、蔵王温泉へ向かいましょう。",
  },
  {
    name: "蔵王温泉",
    from: "ロープウェイで山麓駅へ戻り、歩いて蔵王温泉の温泉街へ。",
    to: "ロープウェイで山麓駅へ戻り、歩いて、あわせておよそ30分で蔵王温泉の温泉街へ。",
  },
  {
    name: "蔵王温泉",
    from: "温泉街で昼食にしましょう。",
    to: "温泉街で昼食にしましょう。続いては、歩いておよそ5分の高湯通りへ向かいましょう。",
  },
  {
    name: "高湯通り",
    from: "昼食のあとは、蔵王温泉の古くからの温泉街「高湯通り」を歩きます。",
    to: "昼食のあとは、歩いておよそ5分、蔵王温泉の古くからの温泉街「高湯通り」を歩きます。",
  },
  {
    name: "高湯通り",
    from: "冬の道は凍っていることがあるので、滑りにくい靴で歩きましょう。",
    to: "冬の道は凍っていることがあるので、滑りにくい靴で歩きましょう。この後は、歩いておよそ5分、蔵王温泉 上湯共同浴場へ向かいましょう。",
  },
  {
    name: "蔵王温泉 上湯共同浴場",
    from: "高湯通りから、酢川温泉神社へ向かう坂の途中にある上湯共同浴場へ。",
    to: "高湯通りから歩いておよそ5分、酢川温泉神社へ向かう坂の途中にある上湯共同浴場へ。",
  },
  {
    name: "蔵王温泉 上湯共同浴場",
    from: "長湯を避けて、こまめに水分をとりましょう。",
    to: "長湯を避けて、こまめに水分をとりましょう。この後は、歩いておよそ5分、酢川温泉神社へ向かいましょう。",
  },
  {
    name: "酢川温泉神社",
    from: "上湯から、高湯通りより続く急な上りの参道をのぼって、その上にまつられる酢川温泉神社へ。",
    to: "上湯から歩いておよそ5分、高湯通りより続く急な上りの参道をのぼって、その上にまつられる酢川温泉神社へ。",
  },
  {
    name: "酢川温泉神社",
    from: "お参りのあとは、蔵王温泉バスターミナルから路線バスで山形駅へ戻ります。",
    to: "お参りのあとは、歩いておよそ7分の蔵王温泉バスターミナルから、路線バスでおよそ40分、山形駅へ戻り、歩いておよそ15分、山形市郷土館へ向かいましょう。",
  },
  {
    name: "山形市郷土館（旧済生館本館）",
    from: "蔵王温泉バスターミナルから路線バスで約40分、山形駅へ戻り、西口から霞城公園の南門を通って歩いて約15分で、霞城公園の中にある山形市郷土館へ。",
    to: "酢川温泉神社から歩いておよそ7分の蔵王温泉バスターミナルから、路線バスでおよそ40分、山形駅へ戻り、西口から霞城公園の南門を通って歩いておよそ15分で、霞城公園の中にある山形市郷土館へ。",
  },
];

// 始まりを8分遅らせて吸収する5か所(山形市郷土館は変更なし)
const timeShifts: { name: string; oldTime: [number, number]; newTime: [number, number] }[] = [
  { name: "蔵王ロープウェイ 蔵王山麓駅", oldTime: [9, 20], newTime: [9, 28] },
  { name: "地蔵山頂駅と樹氷原", oldTime: [9, 55], newTime: [10, 3] },
  { name: "蔵王温泉", oldTime: [11, 40], newTime: [11, 48] },
  { name: "高湯通り", oldTime: [12, 45], newTime: [12, 53] },
  { name: "蔵王温泉 上湯共同浴場", oldTime: [13, 15], newTime: [13, 23] },
  { name: "酢川温泉神社", oldTime: [14, 5], newTime: [14, 13] },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const updates: { id: string; name: string; before: string; after: string }[] = [];
  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    const already = updates.find((u) => u.id === spot.id);
    const base = already ? already.after : spot.memo ?? "";
    if (!base.includes(f.from)) throw new Error(`${f.name}: 期待する文「${f.from}」が見つかりません`);
    const after = base.replace(f.from, f.to);
    if (already) already.after = after;
    else updates.push({ id: spot.id, name: f.name, before: spot.memo ?? "", after });
  }

  for (const u of updates) {
    console.log(`\n[${u.name}]\n旧: ${u.before}\n新: ${u.after}`);
  }

  const timeUpdates: { id: string; name: string; oldTime: [number, number]; newTime: [number, number] }[] = [];
  for (const ts of timeShifts) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: ts.name, day: { itineraryId: ITIN_ID } } });
    const expected = t(ts.oldTime[0], ts.oldTime[1]).getTime();
    if (spot.visitTime?.getTime() !== expected) throw new Error(`${ts.name}: visitTime現在値が期待と不一致`);
    timeUpdates.push({ id: spot.id, name: ts.name, oldTime: ts.oldTime, newTime: ts.newTime });
  }
  console.log("\n[始まりの時刻を8分遅らせて吸収]");
  for (const tu of timeUpdates) {
    console.log(`${tu.name}: ${tu.oldTime[0]}:${String(tu.oldTime[1]).padStart(2, "0")} → ${tu.newTime[0]}:${String(tu.newTime[1]).padStart(2, "0")}`);
  }
  console.log("山形市郷土館: 15:40着・16:30発のまま変更なし");

  const kyodokan = await prisma.spot.findFirstOrThrow({
    where: { name: "山形市郷土館（旧済生館本館）", day: { itineraryId: ITIN_ID } },
    include: { transitLegs: true },
  });
  console.log(`\n[山形市郷土館 区間の組み直し]`);
  console.log(`旧legs: ${JSON.stringify(kyodokan.transitLegs.map((l) => ({ m: l.transitMode, d: l.transitDurationMin, line: l.transitLine })))}`);
  console.log(`新legs: 歩き7分 → バス40分(会社名なし) → 歩き15分`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of updates) {
      await tx.spot.update({ where: { id: u.id }, data: { memo: u.after } });
    }
    for (const tu of timeUpdates) {
      await tx.spot.update({ where: { id: tu.id }, data: { visitTime: t(tu.newTime[0], tu.newTime[1]) } });
    }
    await tx.spotTransitLeg.deleteMany({ where: { spotId: kyodokan.id } });
    await tx.spotTransitLeg.createMany({
      data: [
        { spotId: kyodokan.id, orderNo: 1, transitMode: "walk", transitDurationMin: 7 },
        { spotId: kyodokan.id, orderNo: 2, transitMode: "bus", transitDurationMin: 40 },
        { spotId: kyodokan.id, orderNo: 3, transitMode: "walk", transitDurationMin: 15 },
      ],
    });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

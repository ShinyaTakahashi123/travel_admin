/**
 * e9a900e3（高松・松山3泊4日）言葉2点の直し（法務指摘、2026-10-30）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const ZENTSUJI = "5e99ee67-8c81-44e3-a111-25cf4f159841";
const MARUGAMEJO = "fe772ef4-dd5b-43be-9234-531a09c52dc3";

const ZENTSUJI_MEMO_OLD =
  "偕行社から歩いて約15分。弘法大師空海が生まれた地に建つ寺で、高野山の金剛峯寺、京都の東寺と並ぶ弘法大師の三大霊跡の一つとされ、四国八十八ヶ所霊場の第75番札所でもあります。唐から帰った大師が、父から寄進された土地に大同2年（807年）に建て始め、寺の名は父の名にちなむと伝えられます。金堂や五重塔の建つ東院と、大師の生まれた佐伯家の邸宅の跡とされる西院からなる広い境内です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const ZENTSUJI_MEMO_NEW =
  "偕行社から歩いて約22分。弘法大師空海が生まれた地に建つ寺で、高野山の金剛峯寺、京都の東寺と並ぶ弘法大師の三大霊跡の一つとされ、四国八十八ヶ所霊場の第75番札所でもあります。唐から帰った大師が、父から寄進された土地に大同2年（807年）に建て始め、寺の名は父の名にちなむと伝えられます。金堂や五重塔の建つ東院と、大師の生まれた佐伯家の邸宅の跡とされる西院からなる広い境内です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const MARUGAMEJO_MEMO_OLD =
  "善通寺駅からJRで丸亀駅へ、歩いて約10分。慶長2年（1597年）に生駒親正・一正の父子が築き始めた城で、今の天守は京極家の時代の万治3年（1660年）に完成したもの。全国に12しか残っていない木造の天守のひとつとして、国の重要文化財です。内堀から天守へと積み重なる石垣は「扇の勾配」と呼ばれる美しい曲線を描きます。崩れた石垣の復旧の工事が続いていて、天守へ上がれる時間も決まっているので、公式の案内で確かめましょう。坂道や石段では足元に気をつけてください。このあと丸亀駅から特急で松山へ向かい（約2時間）、今夜から2泊は道後温泉に泊まります。";
const MARUGAMEJO_MEMO_NEW =
  "善通寺駅からJRで丸亀駅へ、歩いて約10分。慶長2年（1597年）に生駒親正・一正の父子が築き始めた城で、今の天守は京極家の時代の万治3年（1660年）に完成したもの。全国に12しか残っていない木造の天守のひとつとして、国の重要文化財です。内堀から天守へと積み重なる石垣は「扇の勾配」と呼ばれる美しい曲線を描きます。崩れた石垣の復旧の工事が続いていて、天守へ上がれる時間も決まっているので、公式の案内で確かめましょう。坂道や石段では足元に気をつけましょう。このあと丸亀駅から特急で松山へ向かい（約2時間）、今夜から2泊は道後温泉に泊まります。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [ZENTSUJI, MARUGAMEJO] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));
  if (byId.get(ZENTSUJI)!.memo !== ZENTSUJI_MEMO_OLD) throw new Error("総本山善通寺: memo現在値が期待と不一致");
  if (byId.get(MARUGAMEJO)!.memo !== MARUGAMEJO_MEMO_OLD) throw new Error("丸亀城: memo現在値が期待と不一致");
  console.log("前提の確認OK。\n");
  console.log("[総本山善通寺] 偕行社から歩いて約15分。→ 偕行社から歩いて約22分。");
  console.log("[丸亀城] 気をつけてください。→ 気をつけましょう。");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: ZENTSUJI }, data: { memo: ZENTSUJI_MEMO_NEW } }),
    prisma.spot.update({ where: { id: MARUGAMEJO }, data: { memo: MARUGAMEJO_MEMO_NEW } }),
  ]);
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

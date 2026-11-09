/**
 * #21 犬山(20a8c441)、法務指摘で書き出しの分数が抜けていた3か所を直す(決まり145、文のみ)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const LUNCH1 = "e47a8f90-347e-4491-b0c1-1f640dfa028a";
const YAGAI = "2685573d-7ae3-4c6f-9db6-2d6be4caa4b9";
const HIGASHINOMIYA = "f77aa132-fedf-4e34-b810-138f1e12510d";

const LUNCH1_MEMO_OLD = "本館から園内へ歩いてすぐ。園内には世界各地の料理を味わえるところがあるので、ここで昼食にしましょう。";
const LUNCH1_MEMO_NEW = "本館から園内へ歩いて約5分。園内には世界各地の料理を味わえるところがあるので、ここで昼食にしましょう。";

const YAGAI_MEMO_OLD =
  "昼食のあとは野外展示へ。一周約2.5kmの道に沿って、23の国と地域の31棟の建物が並びます。実際の家を移したり、建材を現地から取り寄せ、現地の大工を招いて建てたりして、復元したものです。民族衣装を着てみる体験もあります。一周すると長い道のりなので、歩きやすい靴で、ときどき休みながらめぐりましょう。";
const YAGAI_MEMO_NEW =
  "昼食のあと、歩いて約5分、野外展示へ。一周約2.5kmの道に沿って、23の国と地域の31棟の建物が並びます。実際の家を移したり、建材を現地から取り寄せ、現地の大工を招いて建てたりして、復元したものです。民族衣装を着てみる体験もあります。一周すると長い道のりなので、歩きやすい靴で、ときどき休みながらめぐりましょう。";

const HIGASHINOMIYA_MEMO_OLD =
  "遊園地から車で山のふもとへ行き、遊歩道を歩いて約15分。標高143mの白山平山の山頂にある、全長約72mの前方後方墳で、愛知県で最も古いものの一つとされます。つくられてから1700年以上たちますが、形がよく残っています。三角縁神獣鏡などの鏡が見つかり、国の重要文化財になっています。遊歩道には解説の看板があります。古墳のまわりでは、静かに過ごしましょう。帰りは、遊歩道を歩いて約15分でふもとまで下りたら、車で約4分の名鉄犬山駅へ戻り、レンタカーを返しましょう。";
const HIGASHINOMIYA_MEMO_NEW =
  "遊園地から車で約5分、山のふもとから遊歩道を歩いて約15分。標高143mの白山平山の山頂にある、全長約72mの前方後方墳で、愛知県で最も古いものの一つとされます。つくられてから1700年以上たちますが、形がよく残っています。三角縁神獣鏡などの鏡が見つかり、国の重要文化財になっています。遊歩道には解説の看板があります。古墳のまわりでは、静かに過ごしましょう。帰りは、遊歩道を歩いて約15分でふもとまで下りたら、車で約4分の名鉄犬山駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const ids = [LUNCH1, YAGAI, HIGASHINOMIYA];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  if (byId.get(LUNCH1)!.memo !== LUNCH1_MEMO_OLD) throw new Error("リトルワールド(昼食): memo現在値が期待と不一致");
  if (byId.get(YAGAI)!.memo !== YAGAI_MEMO_OLD) throw new Error("リトルワールド(野外展示): memo現在値が期待と不一致");
  if (byId.get(HIGASHINOMIYA)!.memo !== HIGASHINOMIYA_MEMO_OLD) throw new Error("東之宮古墳: memo現在値が期待と不一致");

  console.log("前提の確認OK。");
  console.log("リトルワールド(昼食)「歩いてすぐ」→「歩いて約5分」");
  console.log("リトルワールド(野外展示)「昼食のあとは野外展示へ」→「昼食のあと、歩いて約5分、野外展示へ」");
  console.log("東之宮古墳「車で山のふもとへ行き、遊歩道を歩いて約15分」→「車で約5分、山のふもとから遊歩道を歩いて約15分」");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: LUNCH1 }, data: { memo: LUNCH1_MEMO_NEW } });
    await tx.spot.update({ where: { id: YAGAI }, data: { memo: YAGAI_MEMO_NEW } });
    await tx.spot.update({ where: { id: HIGASHINOMIYA }, data: { memo: HIGASHINOMIYA_MEMO_NEW } });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

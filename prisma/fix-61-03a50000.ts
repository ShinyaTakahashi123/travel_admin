/**
 * #61 03a50000（小豆島・寒霞渓）ユーザー決定「全部直す」の対象(旧終了16:08)。
 * 滞在を延ばさず(決まりA)、エンジェルロードのあとに迷路のまち(実在、土庄本町、
 * 南北朝時代の攻防を機に複雑にしたと伝わる路地、日本遺産の一部)を追加して
 * 16:30〜17:00に収める。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "4fbe038c-a821-4f55-8889-3853588d0954";
const ANGEL_ROAD_ID = "364758e8-765c-4fa4-8700-3256fc7b28aa";

const ANGEL_ROAD_MEMO_NEW =
  "土渕海峡から歩いておよそ11分、エンジェルロードに着きます。干潮の時間帯にだけ、海の中から砂の道が現れて向かいの島へ渡れるようになる、小豆島を代表する景勝地です。大切な人と手をつないで渡ると願いが叶うとも言われ、「恋人の聖地」としても親しまれています。渡れる時間は潮の満ち引きによって日々変わるため、訪れる前に公式サイトの潮見表で確かめてください。潮が満ちてくると道はまた海に沈んでしまうので、渡ったら時間に気をつけて、早めに戻るようにしましょう。砂の道の両側に広がる穏やかな瀬戸内海の景色を眺めながら、ゆっくりと歩いてみてください。この後は、歩いておよそ11分、土庄本町の迷路のまちへ向かいましょう。";

const MEIRO_MEMO =
  "エンジェルロードから歩いておよそ11分、土庄本町の迷路のまちに着きます。南北朝時代、この地に攻め入った軍勢との攻防に備え、道を複雑に入り組ませたのが始まりと伝えられる路地で、日本に残る数少ない迷路のような町並みとして知られています。海風や海賊から暮らしを守るためとも言われ、白壁の家々の間を縫うように細い路地が続いています。地図を片手に、あるいはあえて地図を見ずに、路地に迷い込みながら歩いてみるのもおすすめです。寒霞渓の絶景から醤油の町、映画の舞台、オリーブの丘、海峡と砂の道、そして迷路のまちまで、小豆島をめぐる今日の旅を、ここで締めくくりましょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "5b3cc001-a879-4972-baa0-ac8d0ca896b9", data: {} },
    { id: "3b6c5a12-f228-4cdf-b999-ff29b4eb9e68", data: {} },
    { id: "cacba44a-d3c1-483a-8523-269469030c7d", data: {} },
    { id: "04792cb8-1448-4a83-a8f4-93fc37ef8356", data: {} },
    { id: "f467fd32-dd87-4cbe-a6f3-6ba353cf37e9", data: {} },
    { id: "cc9dd91a-af8d-4451-9a45-433315511da8", data: {} },
    { id: ANGEL_ROAD_ID, data: { memo: ANGEL_ROAD_MEMO_NEW } },
    {
      create: {
        name: "迷路のまち",
        address: "香川県小豆郡土庄町土庄本町",
        lat: 34.4859408,
        lng: 134.1865678,
        memo: MEIRO_MEMO,
        visitTime: t(16, 19),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
  ];

  console.log("最終スポット: 迷路のまち 16:19-16:54");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

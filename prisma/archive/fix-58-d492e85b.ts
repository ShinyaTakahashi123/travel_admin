/**
 * #58 d492e85b（さんまちと高山陣屋、飛騨の小京都を歩く定番日帰りプラン）
 * ユーザー決定「全部直す」の対象(旧終了16:26)。滞在を延ばさず(決まりA)、
 * 高山祭屋台会館と古い町並みの間に宗猷寺(実在、臨済宗妙心寺派、寛永9年
 * (1632)創建、金森可重の菩提寺、山岡鉄舟ゆかりの寺、高山城の石垣を移築した
 * 上に立つ)を追加して16:30〜17:00に収める。
 * あわせて、飛騨国分寺(高山駅のすぐそば)の結びに、帰りの電車の一言を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "4ce17c8e-8f05-4c87-bc60-59b5899725f5";

const YATAIKAIKAN_MEMO_NEW =
  "桜山八幡宮の境内にある高山祭屋台会館に着きます。ユネスコ無形文化遺産にも登録されている高山祭(春の山王祭・秋の八幡祭)で実際に曳き出される屋台のうち、4台が交代で展示されており、間近でその彫刻や幕、からくり人形の精巧さを見ることができます。隣接する桜山日光館には、日光東照宮を10分の1の縮尺で再現した模型もあわせて展示されています。この後は、歩いておよそ14分、宗猷寺へ向かいましょう。";

const SOYUJI_MEMO =
  "高山祭屋台会館から歩いておよそ14分、宗猷寺に着きます。寛永9年(1632)創建の臨済宗妙心寺派の寺院で、高山城主・金森可重の菩提寺として知られています。高山城から移築したと伝わる石垣の上に立ち、禅宗様式と唐様式が混じり合った本堂が特徴です。境内には、幕末から明治にかけて活躍した幕臣・山岡鉄舟にまつわる碑や、その父母の墓もあり、市の史跡に指定されています。静かに、敬意をもってお参りください。この後は、歩いておよそ10分、格子戸の町家が並ぶ古い町並み(さんまち)へ向かいましょう。";

const SANMACHI_MEMO_NEW =
  "宗猷寺から歩いておよそ10分、高山陣屋の門前、宮川の東側に南北に連なる古い町並み(さんまち)に着きます。「三町(さんまち)」と呼ばれるこの一帯は、国の重要伝統的建造物群保存地区に選定されています。江戸時代、高山は商人町として栄え、「旦那衆」と呼ばれた豪商たちの町家が、幅およそ4メートルの通りにずらりと軒を連ねていました。町家は木造・切妻屋根で、高山陣屋より高くならないよう軒を低く抑え、深いひさしと格子窓を備えているのが特徴です。今も老舗の造り酒屋や飛騨牛の店が軒を連ねているので、ここで昼食をとるのもおすすめです。食べ歩きをしながらの散策も楽しめます。「飛騨の小京都」と呼ばれるにふさわしい、江戸時代さながらの町並みをそぞろ歩いてみてください。この後は、歩いてすぐ、飛騨高山まちの博物館へ向かいましょう。";

const KOKUBUNJI_MEMO_NEW =
  "高山陣屋から歩いておよそ7分、飛騨国分寺に着きます。奈良時代、聖武天皇の詔により建てられた国分寺の一つで、飛騨で最も古い寺の歴史を伝えるとされています。境内の三重塔は江戸時代末期に再建されたもので、岐阜県指定の重要文化財です。本堂と鐘楼門の間には、樹齢1200年を超えるとされる大イチョウがそびえ、天平9年(737)、行基がみずから植えたものと伝えられています。創建当時の建物は失われましたが、この大イチョウだけは、国分寺が建てられた頃からの姿を今に伝えているといわれています。静かに、敬意をもってお参りください。宮川朝市から古い町並み、寺社の祭礼文化、そして高山陣屋まで、飛騨の小京都・高山をめぐった今日の旅を締めくくってください。高山駅からの帰りの電車の時刻は、事前に確かめておきましょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "295e5906-6951-494a-ac4b-987e68c4da36", data: {} }, // 宮川朝市
    { id: "a86e8595-6b09-482c-abbd-d09b04affe5e", data: {} }, // 日下部民藝館
    { id: "ef9ebc97-39bc-479e-b4d7-b4b5199586a1", data: {} }, // 桜山八幡宮
    { id: "77ff8246-d977-445d-b09c-87804f9a9eef", data: { memo: YATAIKAIKAN_MEMO_NEW } }, // 高山祭屋台会館
    {
      create: {
        name: "宗猷寺",
        address: "岐阜県高山市宗猷寺町218",
        lat: 36.1414661,
        lng: 137.2668119,
        memo: SOYUJI_MEMO,
        visitTime: t(12, 33),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 14,
        transitLine: null,
      },
    },
    { id: "0f38324d-7305-4934-a183-a4fe633acd3b", data: { memo: SANMACHI_MEMO_NEW, visitTime: t(13, 3), stayDurationMin: 100, transitMode: "walk", transitDurationMin: 10 } }, // 古い町並み
    { id: "6174e595-82fd-48c7-b797-5e0b8f052bdb", data: { visitTime: t(14, 45), stayDurationMin: 35, transitDurationMin: 2 } }, // 飛騨高山まちの博物館(古い町並みから徒歩2分、旧値3分のずれを修正)
    { id: "e8c33099-7009-4e75-ad51-21dbe0f96827", data: { visitTime: t(15, 25), stayDurationMin: 55 } }, // 高山陣屋
    { id: "7c118ebe-1067-4d9c-93cc-0815b498243a", data: { memo: KOKUBUNJI_MEMO_NEW, visitTime: t(16, 27), stayDurationMin: 30 } }, // 飛騨国分寺
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * #64 1a32349e（横浜）ユーザー決定「全部直す」の対象(旧D1 16:05。D2は既に16:59で対象外)。
 * 滞在を延ばさず(決まりA)、氷川丸のあとに横浜マリンタワー(実在、山下公園に隣接する
 * 高さ106mの展望タワー)を追加して16:30〜17:00に収める。
 * あわせて、見直しで見つけた既存の不具合(山下公園の書き出しが「元町商店街から
 * 10分」のままだったが、実際の一つ前は横浜中華街)も修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "1a32349e-32f2-4140-acbc-5748b6fa6f42";
const DAY1_ID = "d90a19ff-9ae9-41bd-b7d2-4efd0cf0ad3d";
const HIKAWAMARU_ID = "d610b474-3c15-4f19-85d7-2277ee29e304";

const HIKAWAMARU_MEMO_NEW =
  "山下公園から歩いてすぐ、山下公園前に係留された氷川丸に着きます。昭和5年(1930)、シアトル航路用に建造された貨客船で、戦前に日本でつくられた貨客船として現存する唯一の船とされ、平成28年(2016)には国の重要文化財に指定されました。喜劇王チャップリンも利用したという豪華な一等の客室や、当時のままの操舵室・機関室が復元・公開されていて、優雅な船旅の時代の雰囲気を味わうことができます。この後は、歩いておよそ5分、横浜マリンタワーへ向かいましょう。";

const MARINETOWER_MEMO =
  "日本郵船氷川丸から歩いておよそ5分、横浜マリンタワーに着きます。高さ106mの展望タワーで、山下公園に隣接し、港町・横浜のシンボルとして親しまれています。展望フロアからは、みなとみらいのビル群や横浜港、天気が良ければ富士山まで見渡せる360度のパノラマが広がります。港町・横浜のシンボルとして親しまれてきたこのタワーで、開港以来の異国情緒あふれる旅を締めくくりましょう。";

async function main() {
  const yamashitaPark = await findSpotInItinerary(ITIN, { spotName: "山下公園" });
  const from = "元町商店街から歩いておよそ10分、山下公園に着きます。";
  const to = "横浜中華街から歩いておよそ7分、山下公園に着きます。";
  if (!yamashitaPark.memo!.includes(from)) throw new Error("一致しません(山下公園)");
  const newYamashitaParkMemo = yamashitaPark.memo!.split(from).join(to);
  console.log("山下公園: OK(書き出し修正)");

  const spots: SpotOrderItem[] = [
    { id: "e326999e-e70d-436c-bef0-03cede98a9c2", data: {} },
    { id: "3b606379-2690-4f03-824b-8d0634e431a2", data: {} },
    { id: "5b5656a0-9850-4926-b6b1-d5b66465ddaf", data: {} },
    { id: "c22f5125-8c83-492d-8d74-3be9310aaaa3", data: {} },
    { id: "836e5d24-66c7-4948-a3bc-1e48c2d17ec5", data: {} },
    { id: "a89de8c9-b564-4df1-be50-bfb2793a01dd", data: {} },
    { id: yamashitaPark.id, data: { memo: newYamashitaParkMemo } },
    { id: HIKAWAMARU_ID, data: { memo: HIKAWAMARU_MEMO_NEW } },
    {
      create: {
        name: "横浜マリンタワー",
        address: "神奈川県横浜市中区山下町14-1",
        lat: 35.4439285,
        lng: 139.6509018,
        memo: MARINETOWER_MEMO,
        visitTime: t(16, 10),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  console.log("最終スポット: 横浜マリンタワー 16:10-16:45");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

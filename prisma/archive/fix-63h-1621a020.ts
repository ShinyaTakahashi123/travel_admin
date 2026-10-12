/**
 * #63 1621a020（五箇山・白川郷）企画運営の指摘(14:30)。1日目の開始08:00が決まり2の
 * 開始の幅(8:30〜9:30)から外れていたため08:30に。滞在は延ばさず、行き先の数で調整
 * (羽馬家住宅の外観見学15分を外す。流刑小屋のすぐ隣で、直接つないでも実質同じ経路)。
 * 城端曳山会館の開館時刻(公式9:00〜)を確認のうえ、09:02着に調整(開く前に着かない)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";

const RYUKEI_GOYA_MEMO_TO_WASHINOSATO =
  "白山宮から車でおよそ3分、田向の流刑小屋に着きます。江戸時代、加賀藩の流刑地だった五箇山に実際にあった、流刑者を収容するための小屋を復元したものです。窓が少なく、外からかんぬきをかける板戸には、監視用の小さな穴が開けられています。積雪で倒壊した後、昭和40年(1965)に復元されたもので、富山県の有形民俗文化財に指定されています。厳しい山あいの暮らしの、もう一つの歴史に触れてみてください。この後は、車でおよそ10分、五箇山和紙の里へ向かいましょう。";

const WASHINOSATO_MEMO_FROM_RYUKEI =
  "流刑小屋から車でおよそ10分、五箇山和紙の里に着きます。国の伝統的工芸品にも指定されている五箇山和紙の歴史や魅力を伝える「和紙工芸館」、実際に紙をすく体験ができる「和紙体験館」(体験には事前の予約が必要です。準備から仕上げまでおよそ1時間かかるとされています)、五箇山の歴史や産業を紹介する「たいら郷土館」の3つの施設が集まった複合施設です。五箇山和紙は江戸時代、加賀藩の手厚い保護のもとで発展してきました。丈夫で長持ちすることから、文化財の修復に用いられることもあるといわれています。合掌造りの屋根裏では、夏は塩硝づくりや養蚕、冬は紙すきと、季節に合わせた仕事が営まれてきたとされ、今日訪れた相倉や村上家の屋根の下にも、同じような暮らしの知恵が息づいていました。併設の食事処もあるので、ここで昼食にしましょう。時間をかけて、3つの施設をじっくりとめぐってみてください。この後は、車でおよそ4分、新五箇山温泉 ゆ～楽へ向かいましょう。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "e58e76b9-760f-4b3b-97fa-39cba0bfbd1e", data: { visitTime: t(8, 30), stayDurationMin: 30 } }, // 善徳寺
    { id: "d1dea107-0a17-4984-8609-60591c31341a", data: { visitTime: t(9, 2), stayDurationMin: 40 } }, // 曳山会館
    { id: "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", data: { visitTime: t(10, 12), stayDurationMin: 40 } }, // 相倉
    { id: "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7", data: { visitTime: t(10, 55), stayDurationMin: 30 } }, // 相倉民俗館
    { id: "885aea12-01b6-43d2-82de-e0fa0b1c38e2", data: { visitTime: t(11, 28), stayDurationMin: 25 } }, // 相倉伝統産業館
    { id: "2a21313a-a48c-4c1f-af68-872aa0601167", data: { visitTime: t(11, 57), stayDurationMin: 35 } }, // 村上家
    { id: "4b2453bb-1890-4895-8260-89d6f890d6c6", data: { visitTime: t(12, 37), stayDurationMin: 30 } }, // 白山宮
    {
      id: "45e6e8d9-23e6-457d-b745-7fa64300464d", // 流刑小屋
      data: { memo: RYUKEI_GOYA_MEMO_TO_WASHINOSATO, visitTime: t(13, 10), stayDurationMin: 30 },
    },
    {
      id: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", // 五箇山和紙の里 (羽馬家住宅の代わりに流刑小屋から直接)
      data: { memo: WASHINOSATO_MEMO_FROM_RYUKEI, visitTime: t(13, 50), stayDurationMin: 120, transitMode: "car", transitDurationMin: 10 },
    },
    { id: "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", data: { visitTime: t(15, 54), stayDurationMin: 60 } }, // ゆ～楽
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
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
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx, remove: ["9f8162f8-fbf7-42f8-ad5e-10e41675b170"] });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

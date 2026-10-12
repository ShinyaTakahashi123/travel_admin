/**
 * #75 7b69bad5（天橋立）ユーザー決定「全部直す」の対象(現状15:07)。滞在を
 * 延ばさず(決まりA)、実在スポットを追加。成相寺のあとに旧三上家住宅(実在、
 * 国指定重要文化財、宮津の廻船問屋を営んだ商家、OSM way 491913518)を追加。
 * 移動時間はOSRM実測(12.3km/16分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NARIAIJI_MEMO_TO_MIKAMI =
  "傘松公園から登山バスでおよそ7分、標高569mの成相山の中腹に建つ成相寺に着きます。慶雲元年(704)、文武天皇の勅願を受けた真応上人が開いたと伝わる、西国三十三所観音霊場の第28番札所です。三十三所の中でも最北端に位置する札所として知られています。本尊の聖観世音菩薩は「美人観音」とも呼ばれ、飢えに苦しむ僧のために自らの膝の肉を鹿肉と偽って与えたという「身代わり観音」の伝説も残っています。境内にある2つの展望台からは、傘松公園とはまた違う角度から、天橋立を見下ろす絶景を楽しめます。春の桜・シャクナゲ、秋の紅葉など、四季の花々でも知られています。静かに、敬意をもって拝観してください。この後は、バスでおよそ16分、山を下って旧三上家住宅へ向かいましょう。";

const MIKAMI_MEMO =
  "成相寺からバスでおよそ16分、山を下って旧三上家住宅に着きます。江戸時代から昭和にかけて、酒造業や廻船業を営んだ宮津の豪商・三上家の旧宅です。主屋をはじめ8棟の建物が、国の重要文化財に指定されています。式台や座敷、蔵など、往時の繁栄をしのばせる意匠の数々を見学できます。休館日があるので、訪れる前に公式サイトで確かめましょう。天橋立の南北の絶景に、宮津の商家文化を加えた1日をめぐる旅も、ここで無事に終了です。お疲れさまでした。お帰りは、バスやタクシーなどで天橋立駅方面へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7b69bad5%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const day1Spots: SpotOrderItem[] = [
    { id: "bff377a2-e000-49de-95fd-da8371bcdf3b", data: {} }, // 智恩寺
    { id: "dde76e6b-1696-46db-b1ed-8d47e6f385c0", data: {} }, // 天橋立ビューランド
    { id: "6ee2a312-0ff9-4f26-9915-9b84edc0af7a", data: {} }, // 天橋立(松並木散策)
    { id: "3ef89a0d-0d24-4f74-9d33-5d80a6e7acf2", data: {} }, // 元伊勢籠神社
    { id: "09d59aeb-ed38-4af4-ab55-a3a7eb6efe62", data: {} }, // 傘松公園
    {
      id: "3e96951f-8841-4091-8caf-dcb7f459ef10", // 成相寺
      data: { memo: NARIAIJI_MEMO_TO_MIKAMI },
    },
    {
      create: {
        name: "旧三上家住宅",
        address: "京都府宮津市魚屋905",
        lat: 35.5380201,
        lng: 135.1911381,
        memo: MIKAMI_MEMO,
        visitTime: t(15, 23),
        stayDurationMin: 75,
        transitMode: "bus",
        transitDurationMin: 16,
        transitLine: null,
      },
    },
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
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

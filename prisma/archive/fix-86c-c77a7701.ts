/**
 * #86 c77a7701 企画運営・法務の指摘(2026-09-30 19:24-19:25)。
 * 1) 昼食が川反(10:05〜)で仕様の11:30〜13:30より早すぎた。川反は夜の
 *    飲食店街のため午前90分は長め。40分の散策にし、昼食の一言も外す。
 *    空いた時間は赤れんが郷土館(実在、旧秋田銀行本店本館、明治45年築の
 *    重要文化財、OSM way 748909188)を新規追加して埋め、昼食の一言は
 *    到着が11:30〜13:30に収まる秋田県立美術館に移す(市場へは戻らない)。
 * 2) 千秋公園の佐竹史料館は、令和7年(2025)10月にリニューアルオープン
 *    済みで通常営業中であることを公式サイトで確認(改修休館の心配なし)。
 * 3) 法務の指摘: 川反の「秋田の地酒や旬の魚介を目当てに」にあわせ、
 *    「お酒は20歳になってから。」を追加。
 * 移動はOSM歩行者ルーティング実測(川反→赤れんが郷土館647m/9分、
 * 赤れんが郷土館→ねぶり流し館415m/6分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAWABATA_MEMO =
  "秋田市民市場から歩いておよそ5分、川反に着きます。旭川沿いに広がるこの一帯は、東北でも屈指の歓楽街とされています。「川反」という地名は、旭川を挟んで武士の住む町(内町)の反対側にあることに由来すると伝えられ、江戸時代には町人の町として栄えました。明治19年(1886)に起きた大火で、被災した芸者屋や料理店がこの地に移り集まったことがきっかけとなり、歓楽街としての川反が形づくられたのだそうです。夜になれば郷土料理店や小料理屋に明かりがともり、秋田の地酒や旬の魚介を目当てに多くの人でにぎわいますが、昼間の川反もまた、老舗の建物や路地の佇まいに、歓楽街としての長い歴史をしのぶことができます。お酒は20歳になってから。老舗の建物や路地の佇まいを、のんびりと歩いてみてください。この後は、歩いておよそ9分、赤れんが郷土館へ向かいましょう。";

const AKARENGA_MEMO =
  "川反から歩いておよそ9分、赤れんが郷土館に着きます。明治45年(1912)に旧秋田銀行本店本館として建てられた洋風建築で、国の重要文化財に指定されています。1階を磁器質の白いタイル、2階を赤れんがで仕上げた華麗な外観が特徴です。館内の旧書庫では、秋田銀線細工をはじめとする郷土の伝統工芸品を常設展示しているほか、人間国宝の鍛金家・関谷四郎の記念室、郷土の版画家・勝平得之の作品を紹介する記念館も併設されています。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ6分、秋田市民俗芸能伝承館(ねぶり流し館)へ向かいましょう。";

const NEBURI_FROM = "川反から歩いておよそ6分、秋田市民俗芸能伝承館(ねぶり流し館)に着きます。";
const NEBURI_TO = "赤れんが郷土館から歩いておよそ6分、秋田市民俗芸能伝承館(ねぶり流し館)に着きます。";

const BIJUTSUKAN_FROM = "画面いっぱいに広がる迫力ある構図が見る人を圧倒します。建築家・安藤忠雄が設計した現在の建物も、水面を望む階段状の展示空間が特徴で、あわせて楽しめます。休館日は公式サイトで確かめてから訪れましょう。";
const BIJUTSUKAN_TO =
  "画面いっぱいに広がる迫力ある構図が見る人を圧倒します。建築家・安藤忠雄が設計した現在の建物も、水面を望む階段状の展示空間が特徴で、あわせて楽しめます。館内にはカフェもあるので、ここで昼食にするのもおすすめです。休館日は公式サイトで確かめてから訪れましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const ichiba = await findSpotInItinerary(itinId, { spotName: "秋田市民市場" });
  const kawabata = await findSpotInItinerary(itinId, { spotName: "川反" });
  const neburi = await findSpotInItinerary(itinId, { spotName: "秋田市民俗芸能伝承館(ねぶり流し館)" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "秋田県立美術館" });
  const bunkasozo = await findSpotInItinerary(itinId, { spotName: "秋田市文化創造館" });
  const senshu = await findSpotInItinerary(itinId, { spotName: "千秋公園" });

  if (!neburi.memo!.includes(NEBURI_FROM)) throw new Error("一致しません(ねぶり流し館)");
  const neburiNewMemo = neburi.memo!.split(NEBURI_FROM).join(NEBURI_TO);
  if (!bijutsukan.memo!.includes(BIJUTSUKAN_FROM)) throw new Error("一致しません(美術館)");
  const bijutsukanNewMemo = bijutsukan.memo!.split(BIJUTSUKAN_FROM).join(BIJUTSUKAN_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: ichiba.id, data: {} },
    {
      id: kawabata.id,
      data: { memo: KAWABATA_MEMO, stayDurationMin: 40 },
    },
    {
      create: {
        name: "赤れんが郷土館",
        address: "秋田県秋田市大町三丁目3-21",
        lat: 39.716723,
        lng: 140.1158653,
        memo: AKARENGA_MEMO,
        visitTime: t(10, 54),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    { id: neburi.id, data: { memo: neburiNewMemo, visitTime: t(11, 45), transitMode: "walk", transitDurationMin: 6 } },
    { id: bijutsukan.id, data: { memo: bijutsukanNewMemo, visitTime: t(12, 34) } },
    { id: bunkasozo.id, data: { visitTime: t(13, 59) } },
    { id: senshu.id, data: { visitTime: t(14, 50) } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    [ichiba.id]: 60,
    [neburi.id]: 40,
    [bijutsukan.id]: 80,
    [bunkasozo.id]: 45,
    [senshu.id]: 120,
  };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * #89 d8a6076d 企画運営(22:12)・法務(22:06)の指摘を反映。
 * 1) 釣山公園の95分は水増し(柵列の跡は地下で見えない)。40分に戻し、代わりに
 *    祭畤大橋(落橋)展望の丘(新規、2008年岩手・宮城内陸地震の記憶を伝える公園、
 *    骨寺村と釣山公園の間に挿入)を追加。見学通路は4〜11月のみのため、
 *    seasonsから冬を除外。
 *    開いたURL: https://www.ichitabi.jp/spot/data.php?p=119
 * 2) 厳美渓の店名「郭公屋」と、団子の由来・味の食べ比べ(商品の説明)を削除。
 *    岩場の安全の一文を追加(法務)。
 * 3) 昼食: 骨寺村(D1)・幽玄洞(D2)の「この近くで昼食」を削除し、実際に食事が
 *    できると確認できた場所に移した。D1は一関市博物館(隣接する道の駅、
 *    公式サイトで確認済み)、D2は東山和紙紙すき館(猊鼻渓の舟乗り場周辺に
 *    食事処があることをWebSearchで確認、店名は書かない)。
 * 4) 猊鼻渓の結びが「タクシーでおよそ4分、石と賢治のミュージアムへ」のまま
 *    残っていた(紙すき館を挿入した際の直し漏れ)。歩いて2分、紙すき館へ、に修正。
 * 5) 1日目の結び(旧沼田家武家住宅)を「お休みください」からふつうの書き方に、
 *    2日目の結び(千厩酒のくら交流施設)を帰りの一言に修正。
 * 6) 説明文に、足した行き先を反映。
 * 7) 釣山公園・幽玄洞に配慮・安全の一文を追加(法務)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "奇岩と清流が織りなす厳美渓と、船頭の唄が響く猊鼻渓の舟下り。一関市博物館や達谷窟毘沙門堂、骨寺村荘園遺跡、石と賢治のミュージアムもたずねる、世界遺産の社寺とは違う、一関の自然美と歴史を楽しむ1泊2日プランです。";

const GENBIKEI_FROM =
  "渓谷沿いには「郭公屋」という茶屋があり、対岸から籠をロープで渡すしくみで団子とお茶を届けてくれることから「空飛ぶだんご」として親しまれています。籠を送ると、対岸へと滑り出し、串に刺さった団子が5つなのは、この一帯がかつて「五串村」と呼ばれていたことにちなむのだそうです。あんこ・黒ごま・しょうゆの3種の味を食べ比べてみるのも、この渓谷ならではの楽しみ方です。この後は、歩いておよそ8分、一関市博物館へ向かいましょう。";
const GENBIKEI_TO =
  "渓谷沿いには、対岸の茶屋から籠で団子が届けられる「空飛ぶだんご」という名物もあります。岩場は滑りやすいので、柵の外に出たり川に近づいたりしないようにしましょう。この後は、歩いておよそ8分、一関市博物館へ向かいましょう。";

const HAKUBUTSUKAN_FROM = "休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ12分、達谷窟毘沙門堂へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";
const HAKUBUTSUKAN_TO =
  "見学のあとは、隣接する道の駅で昼食にするとよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ12分、達谷窟毘沙門堂へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const HONEDERA_FROM = "この近くで昼食にするとよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ19分、釣山公園へ向かいましょう。";
const HONEDERA_TO = "休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ15分、祭畤大橋(落橋)展望の丘へ向かいましょう。";

const SAIDE_MEMO =
  "骨寺村荘園交流館からタクシーでおよそ15分、祭畤大橋(落橋)展望の丘に着きます。2008年の岩手・宮城内陸地震では、この一帯が大きな被害を受けました。橋げたが落下した祭畤大橋の姿が、震災当時のままの道路とともに今も残されており、地震の記憶と教訓を伝えるために整備された公園です。展望の丘や見学通路から、当時の様子をうかがうことができます。お手洗いはないので、事前に済ませておきましょう。見学通路が通れる時期・時間は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ30分、釣山公園へ向かいましょう。";

const TSURIYAMA_MEMO =
  "祭畤大橋(落橋)展望の丘からタクシーでおよそ30分、一関の市街地に戻り、釣山公園に着きます。標高90メートルの小高い丘の上にある公園で、磐井川とその両岸に広がる市街地を一望できます。旧一関城の本丸があった場所で、丘の上には一関八幡神社が鎮座し、社殿には田村神社が相殿として祀られています。田村神社は、もとは東京の田村屋敷にあったお社で、大正年代に一関藩主・田村家が一関に常住するのにあわせてこの地に移されました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。歴史と自然を楽しめる、地域の憩いの場として親しまれています。この後は、歩いておよそ11分、旧沼田家武家住宅へ向かいましょう。";

const NUMATAKE_FROM = "今夜は一関駅周辺の宿でお休みください。明日は、大船渡線で猊鼻渓へと向かいます。";
const NUMATAKE_TO = "今夜は一関駅のまわりに泊まります。明日は、大船渡線で猊鼻渓へと向かいます。";

const GEIBIKEI_FROM = "この後は、タクシーでおよそ4分、石と賢治のミュージアムへ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";
const GEIBIKEI_TO = "この後は、歩いておよそ2分、東山和紙紙すき館へ向かいましょう。";

const KAMISUKIKAN_FROM = "営業時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ5分、石と賢治のミュージアムへ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";
const KAMISUKIKAN_TO =
  "舟乗り場の周辺には食事処もあるので、ここで昼食にするとよいでしょう。営業時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ5分、石と賢治のミュージアムへ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const YUGENDO_FROM = "この近くで昼食にするとよいでしょう。開洞時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。";
const YUGENDO_TO = "洞内は滑りやすく、天井の低いところもあるので、頭上や足元に気をつけましょう。開洞時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。";

const SENMAYA_FROM = "今夜は一関駅周辺の宿でお休みください。一ノ関駅へは、タクシーでおよそ24分です。";
const SENMAYA_TO = "一ノ関駅へはタクシーでおよそ24分。ここで旅を締めくくりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const genbikei = await findSpotInItinerary(itinId, { spotName: "厳美渓" });
  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "一関市博物館" });
  const takkoku = await findSpotInItinerary(itinId, { spotName: "達谷窟毘沙門堂" });
  const honedera = await findSpotInItinerary(itinId, { spotName: "骨寺村荘園交流館" });
  const tsuriyama = await findSpotInItinerary(itinId, { spotName: "釣山公園" });
  const numatake = await findSpotInItinerary(itinId, { spotName: "旧沼田家武家住宅" });

  const check = (spot: { memo: string | null }, from: string, label: string) => {
    if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(genbikei, GENBIKEI_FROM, "厳美渓");
  check(hakubutsukan, HAKUBUTSUKAN_FROM, "一関市博物館");
  check(honedera, HONEDERA_FROM, "骨寺村荘園交流館");
  check(numatake, NUMATAKE_FROM, "旧沼田家武家住宅");

  const day1Spots: SpotOrderItem[] = [
    { id: genbikei.id, data: { memo: genbikei.memo!.replace(GENBIKEI_FROM, GENBIKEI_TO) } },
    {
      id: hakubutsukan.id,
      data: { memo: hakubutsukan.memo!.replace(HAKUBUTSUKAN_FROM, HAKUBUTSUKAN_TO), stayDurationMin: 75 },
    },
    { id: takkoku.id, data: { visitTime: t(11, 45) } },
    {
      id: honedera.id,
      data: { memo: honedera.memo!.replace(HONEDERA_FROM, HONEDERA_TO), visitTime: t(13, 3), transitMode: "car", transitDurationMin: 18, transitLine: null },
    },
    {
      create: {
        name: "祭畤大橋(落橋)展望の丘",
        address: "岩手県一関市厳美町字祭畤",
        lat: 39.0157014,
        lng: 140.8775374,
        memo: SAIDE_MEMO,
        visitTime: t(14, 18),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      id: tsuriyama.id,
      data: { memo: TSURIYAMA_MEMO, visitTime: t(15, 28), stayDurationMin: 40, transitMode: "car", transitDurationMin: 30, transitLine: null },
    },
    { id: numatake.id, data: { memo: numatake.memo!.replace(NUMATAKE_FROM, NUMATAKE_TO), visitTime: t(16, 19) } },
  ];

  const geibikei = await findSpotInItinerary(itinId, { spotName: "猊鼻渓" });
  const kamisukikan = await findSpotInItinerary(itinId, { spotName: "東山和紙紙すき館" });
  const kenji = await findSpotInItinerary(itinId, { spotName: "石と賢治のミュージアム" });
  const yugendo = await findSpotInItinerary(itinId, { spotName: "幽玄洞" });
  const ashitozan = await findSpotInItinerary(itinId, { spotName: "芦東山記念館" });
  const senmaya = await findSpotInItinerary(itinId, { spotName: "千厩酒のくら交流施設" });

  check(geibikei, GEIBIKEI_FROM, "猊鼻渓");
  check(kamisukikan, KAMISUKIKAN_FROM, "東山和紙紙すき館");
  check(yugendo, YUGENDO_FROM, "幽玄洞");
  check(senmaya, SENMAYA_FROM, "千厩酒のくら交流施設");

  const day2Spots: SpotOrderItem[] = [
    { id: geibikei.id, data: { memo: geibikei.memo!.replace(GEIBIKEI_FROM, GEIBIKEI_TO) } },
    {
      id: kamisukikan.id,
      data: { memo: kamisukikan.memo!.replace(KAMISUKIKAN_FROM, KAMISUKIKAN_TO), stayDurationMin: 55 },
    },
    { id: kenji.id, data: { visitTime: t(12, 2) } },
    {
      id: yugendo.id,
      data: { memo: yugendo.memo!.replace(YUGENDO_FROM, YUGENDO_TO), visitTime: t(13, 10) },
    },
    { id: ashitozan.id, data: { visitTime: t(14, 28) } },
    {
      id: senmaya.id,
      data: { memo: senmaya.memo!.replace(SENMAYA_FROM, SENMAYA_TO), visitTime: t(15, 44) },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[], knownStay: Record<string, number>) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots, { [genbikei.id]: 70, [takkoku.id]: 60, [numatake.id]: 40 });
  printSchedule("D2", day2Spots, { [geibikei.id]: 90, [kenji.id]: 60, [ashitozan.id]: 60, [senmaya.id]: 60 });

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] as any } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

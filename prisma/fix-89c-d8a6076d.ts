/**
 * #89 d8a6076d 企画運営(22:03)の案を反映し、16:30〜17:00の窓に到達させる。
 *
 * D1(52分不足): 釣山公園は、公式サイトで確かめたところ「一関八幡神社・田村神社」
 * (田村神社は大正年代に東京の田村屋敷から釣山へ遷座)と、地表下で検出された
 * 一関城跡の遺構(柵列跡)が同じ釣山の敷地内にあった。新しいスポットを増やす
 * のではなく、釣山公園の中身と滞在をこの内容にあわせて増やした(40→95分)。
 * 世嬉の一のような酒蔵レストランは、企画運営の指摘どおりスポットにしない。
 * 開いたURL: https://tamura-hachiman.com/tamura_keidai.html
 *
 * D2(2時間ほど不足): 東山和紙紙すき館(新規、猊鼻渓から徒歩2分、平泉藤原文化
 * から800年余り伝わる紙すきの技法、体験時間15〜30分を公式で確認)を追加。
 * 芦東山記念館のあと、一関駅へ戻る道の途中にある千厩酒のくら交流施設(新規、
 * 旧横屋酒造・佐藤家住宅を活用した観光文化交流施設。国登録有形文化財25棟、
 * 入館無料の公共の施設であることを公式で確認。酒蔵の建物を再利用した資料館
 * であり、酒類の販売・飲食を行う店ではないためスポットとして問題ないと判断)
 * を追加。
 * 開いたURL:
 * - 東山和紙紙すき館(住所・体験時間・営業時間): WebSearch集約(公式含む複数の
 *   観光サイトが一致)、住所はGSIで座標確認
 * - 千厩酒のくら交流施設(施設の性格・開館時間・入館料): https://www.ichitabi.jp/spot/data.php?p=48
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TSURIYAMA_MEMO =
  "骨寺村荘園交流館からタクシーでおよそ19分、一関の市街地に戻り、釣山公園に着きます。標高90メートルの小高い丘の上にある公園で、磐井川とその両岸に広がる市街地を一望できます。旧一関城の本丸があった場所で、地表からおよそ1メートルの深さから、柵列の跡とみられる遺構が見つかっています。丘の上には一関八幡神社が鎮座し、社殿には田村神社が相殿として祀られています。田村神社は、もとは東京の田村屋敷にあったお社で、大正年代に一関藩主・田村家が一関に常住するのにあわせてこの地に移されました。歴史と自然を楽しめる、地域の憩いの場として親しまれています。この後は、歩いておよそ11分、旧沼田家武家住宅へ向かいましょう。";

const YUGENDO_MEMO_LUNCH_ADD = "この近くで昼食にするとよいでしょう。";

const KAMISUKIKAN_MEMO =
  "猊鼻渓から歩いておよそ2分、東山和紙紙すき館に着きます。平泉藤原文化の時代から800年余り伝わってきたという、東山和紙の手すきの技法を今に伝える施設です。アレンジされた創作紙すき体験ができ、所要時間は15分から30分ほどです。営業時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ5分、石と賢治のミュージアムへ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const KENJI_MEMO_NEW =
  "東山和紙紙すき館からタクシーでおよそ5分、石と賢治のミュージアムに着きます。「みんなのほんとうの幸せ」を求め、理想郷の実現に力を尽くした技師・宮沢賢治の心と生き方に触れるミュージアムです。賢治が東山を訪れるきっかけとなった旧東北砕石工場も併設されており、代表作「雨ニモマケズ」が生まれるまでの足跡を、手紙や写真でたどることができます。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ8分、幽玄洞へ向かいましょう。";

const ASHITOZAN_TO_SENMAYA =
  "休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ16分、千厩酒のくら交流施設へ向かいましょう。";

const SENMAYA_MEMO =
  "芦東山記念館からタクシーでおよそ16分、千厩酒のくら交流施設に着きます。明治から大正期にかけて建てられた、旧横屋酒造・佐藤家住宅の建物25棟が、国の登録有形文化財に指定されています。ケヤキを使った土蔵造りの母屋や、大正浪漫を感じさせる洋館など、酒蔵として使われてきた建物を活用した観光文化交流の施設です。休館日は公式サイトで確かめてから訪れましょう。今夜は一関駅周辺の宿でお休みください。一ノ関駅へは、タクシーでおよそ24分です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const jinja1 = await findSpotInItinerary(itinId, { spotName: "厳美渓" });
  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "一関市博物館" });
  const takkoku = await findSpotInItinerary(itinId, { spotName: "達谷窟毘沙門堂" });
  const honedera = await findSpotInItinerary(itinId, { spotName: "骨寺村荘園交流館" });
  const tsuriyama = await findSpotInItinerary(itinId, { spotName: "釣山公園" });
  const numatake = await findSpotInItinerary(itinId, { spotName: "旧沼田家武家住宅" });

  const day1Spots: SpotOrderItem[] = [
    { id: jinja1.id, data: {} },
    { id: hakubutsukan.id, data: {} },
    { id: takkoku.id, data: {} },
    { id: honedera.id, data: {} },
    { id: tsuriyama.id, data: { memo: TSURIYAMA_MEMO, stayDurationMin: 95 } },
    { id: numatake.id, data: { visitTime: t(15, 53) } },
  ];

  const geibikei = await findSpotInItinerary(itinId, { spotName: "猊鼻渓" });
  const kenji = await findSpotInItinerary(itinId, { spotName: "石と賢治のミュージアム" });
  const yugendo = await findSpotInItinerary(itinId, { spotName: "幽玄洞" });
  const ashitozan = await findSpotInItinerary(itinId, { spotName: "芦東山記念館" });

  if (!yugendo.memo!.includes("この後は、タクシーでおよそ18分、芦東山記念館へ向かいましょう。")) {
    throw new Error("一致しません(幽玄洞)");
  }
  const yugendoNewMemo = yugendo
    .memo!.replace(
      "開洞時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。",
      `${YUGENDO_MEMO_LUNCH_ADD}開洞時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。`
    );

  const ashitozanFrom = "休館日は公式サイトで確かめてから訪れましょう。一ノ関駅へは、タクシーで戻りましょう。";
  if (!ashitozan.memo!.includes(ashitozanFrom)) throw new Error("一致しません(芦東山記念館)");
  const ashitozanNewMemo = ashitozan.memo!.replace(ashitozanFrom, ASHITOZAN_TO_SENMAYA);

  const day2Spots: SpotOrderItem[] = [
    { id: geibikei.id, data: {} },
    {
      create: {
        name: "東山和紙紙すき館",
        address: "岩手県一関市東山町長坂字町390",
        lat: 38.989391,
        lng: 141.253418,
        memo: KAMISUKIKAN_MEMO,
        visitTime: t(11, 2),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: kenji.id, data: { memo: KENJI_MEMO_NEW, visitTime: t(11, 47), transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { id: yugendo.id, data: { memo: yugendoNewMemo, visitTime: t(12, 55) } },
    { id: ashitozan.id, data: { memo: ashitozanNewMemo, visitTime: t(14, 13) } },
    {
      create: {
        name: "千厩酒のくら交流施設",
        address: "岩手県一関市千厩町千厩字北方134",
        lat: 38.9189836,
        lng: 141.3335292,
        memo: SENMAYA_MEMO,
        visitTime: t(15, 29),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 16,
        transitLine: null,
      },
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
  printSchedule("D1", day1Spots, { [jinja1.id]: 70, [hakubutsukan.id]: 60, [takkoku.id]: 60, [honedera.id]: 60, [numatake.id]: 40 });
  printSchedule("D2", day2Spots, { [geibikei.id]: 90, [kenji.id]: 60, [yugendo.id]: 60, [ashitozan.id]: 60 });

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

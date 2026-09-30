/**
 * #90 de041462 企画運営(22:31)・法務(22:25)の指摘を反映。
 * 1) 観潮船のメモが「うずしお観光船に乗り込みます」となっており、船会社名を
 *    誤って書いていた(公式で確かめると運航会社は「鳴門観光汽船」で、乗り場の
 *    「鳴門観光港」＝「亀浦観光港」と同じ場所)。決まりどおり船会社名を書かず
 *    「観潮船に乗り込みます」に統一し、地名は「鳴門観光港」で揃えた。船上の
 *    安全の一文も追加(法務)。
 * 2) 1か所目に、鳴門駅・徳島駅からのバスでの行き方を追加(公式時刻表PDFで
 *    実在の便を確認済み、時刻は書かない)。
 * 3) ドイツ館の滞在を90→60分に短縮。すぐ近くの霊山寺(四国八十八箇所第一番
 *    札所、公式サイトで由緒・本尊を確認)を新規に追加し、帰りは板東駅から
 *    JR高徳線で徳島駅へ、と実際の交通手段に直した。
 * 4) ドイツ館に、収容された人々への配慮の一文を追加。霊山寺には祈りと
 *    お遍路さんへの配慮の一文を追加。
 *
 * 開いたURL:
 * - うずしお観光船の運航会社・乗り場: https://www.uzusio.com/access/
 * - 霊山寺(由緒・本尊・第一番札所): https://www.awanavi.jp/archives/spot/2806
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const UZUSHIO_MEMO =
  "鳴門駅・徳島駅から、鳴門公園方面のバスに乗り、鳴門観光港で降ります。バスの本数は季節によって変わるので、訪れる前に確かめておきましょう。鳴門観光港で観潮船に乗り込みます。瀬戸内海と紀伊水道という、潮の満ち引きのタイミングが異なる2つの海域が、幅およそ1.3kmの鳴門海峡でぶつかり合うことで、1日に4回、最大で1〜1.5mもの水位差が生じ、激しい潮流と渦潮が生まれます。潮の流れは時速13〜15km、大潮の際には時速20kmに達することもあり、渦の直径は最大でおよそ30mにもおよぶ、世界最大級ともいわれる規模です。観潮船に乗れば、うねりながら巻き上がる渦潮を間近に眺めることができます。船の上では揺れに気をつけましょう。渦の大きさは大潮・小潮など潮回りによって変わるため、出発前に運航状況を確かめておきましょう。この後は、鳴門公園行きのバスでおよそ6分、渦の道へ向かいましょう。";

const DOITSUKAN_MEMO =
  "大塚国際美術館からタクシーでおよそ25分、鳴門市ドイツ館に着きます。第一次世界大戦中、この地には「板東俘虜収容所」があり、日本軍の捕虜となったドイツ兵が収容されていました。収容所では、製菓や西洋野菜の栽培、建築、音楽、スポーツなどを通して、ドイツ兵と地元の人々の間で文化交流が行われ、ベートーヴェンの交響曲第九番がアジアで初めて演奏された地とされています。館内では、当時の暮らしをミニチュア模型でたどることができ、第九が響いた様子を実物大の人形で再現した展示もあります。収容された人々の暮らしを伝える場所として、静かに見学しましょう。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ13分、霊山寺へ向かいましょう。";

const RYOZENJI_MEMO =
  "鳴門市ドイツ館から歩いておよそ13分、霊山寺に着きます。竺和山一乗院霊山寺といい、四国八十八箇所の第一番札所です。行基菩薩が開き、弘法大師が四国霊場を開くことを願ってこの地に上陸した際に創建したと伝わり、以来「発心の道場」への入り口として、多くのお遍路さんの旅の出発点となってきました。本尊の釈迦如来は、弘法大師が21日間の祈願の末に刻んだと伝えられています。白い衣のお遍路さんの姿を見かけたら、写真を撮ったりお参りの邪魔をしたりしないよう、静かに見守りましょう。この後は、歩いておよそ11分、板東駅へ向かいましょう。板東駅からはJR高徳線で徳島駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'de041462%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const uzushio = await findSpotInItinerary(itinId, { spotName: "鳴門の渦潮（亀浦観潮船乗り場）" });
  const uzunomichi = await findSpotInItinerary(itinId, { spotName: "渦の道" });
  const otsuka = await findSpotInItinerary(itinId, { spotName: "大塚国際美術館" });
  const doitsukan = await findSpotInItinerary(itinId, { spotName: "鳴門市ドイツ館" });

  const day1Spots: SpotOrderItem[] = [
    { id: uzushio.id, data: { memo: UZUSHIO_MEMO } },
    { id: uzunomichi.id, data: {} },
    { id: otsuka.id, data: {} },
    { id: doitsukan.id, data: { memo: DOITSUKAN_MEMO, stayDurationMin: 60 } },
    {
      create: {
        name: "霊山寺",
        address: "徳島県鳴門市大麻町板東塚鼻126",
        lat: 34.1594397,
        lng: 134.5027968,
        memo: RYOZENJI_MEMO,
        visitTime: t(16, 26),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = { [uzushio.id]: 35, [uzunomichi.id]: 40, [otsuka.id]: 225 };
    for (const x of day1Spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

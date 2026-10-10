/**
 * #88 d1e7bf32 D2分。既存は子ノ口1か所(09:30〜10:00)のみで4か所未満・終了
 * とも規定外。子ノ口から焼山方面へ向かう奥入瀬渓流の実在の見どころを追加。
 * 銚子大滝(実在、奥入瀬本流唯一の滝、OSM node 7294281693)・石ヶ戸(実在、
 * 地元の方言で「岩屋」の意、OSM node 2417882327、休憩所で軽食も)・焼山
 * (実在、奥入瀬渓流の終点、JRバス「十和田湖温泉郷」バス停があり休屋方面へ
 * 戻れる)を追加。移動時間は、公式・観光サイトで確認できた区間(子ノ口→
 * 銚子大滝30分、石ヶ戸→焼山70分)と、公開されている全体距離・所要時間
 * (子ノ口→石ヶ戸がおよそ9km・150分、子ノ口→焼山全体がおよそ4時間)から
 * 残りの区間を計算した推定値を使用。
 *
 * 【企画運営への報告事項】子ノ口・銚子大滝・石ヶ戸・焼山を尽くしても、
 * D2は09:30〜15:35までにしかならず、16:30〜17:00の窓に届かない。奥入瀬
 * 渓流の子ノ口→焼山の全区間(公式で確認できる実測ではおよそ4時間)を
 * ほぼ使い切っており、これ以上、渓流沿いに実在の候補を見出せなかった。
 *
 * 開いたURL:
 * - 銚子大滝の高さ・幅・「魚止めの滝」・子ノ口から徒歩30分:
 *   https://www.tohokukanko.jp/attractions/detail_1573.html
 * - 石ヶ戸休憩所(方言で岩屋の意、鬼にまつわる言い伝え):
 *   https://oirase.or.jp/ishigedo/ishigedo.htm
 * - 子ノ口〜石ヶ戸9km(石ヶ戸〜焼山70分)・子ノ口〜焼山全体約4時間・焼山の
 *   JRバス「十和田湖温泉郷」バス停: WebSearch集約(十和田湖国立公園協会・
 *   東北観光推進機構・JRバス東北の複数の公式/観光サイトが一致)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NENOKUCHI_FROM =
  "十和田神社にお参りし、乙女の像を訪ね、湖上を渡ってこられたこれまでの旅を振り返りながら、湖から渓流へと変わりゆく水の表情を、どうぞごゆっくりご覧いただければと思います。";
const NENOKUCHI_TO =
  "十和田神社にお参りし、乙女の像を訪ね、湖上を渡ってきたこれまでの旅を振り返りながら、湖から渓流へと変わりゆく水の表情を眺めてみてください。この後は、歩いておよそ30分、銚子大滝へ向かいましょう。";
const NENOKUCHI_OPENER_FROM = "皆様、旅も2日目、あらためてご案内いたしますのが子ノ口でございます。";
const NENOKUCHI_OPENER_TO = "旅も2日目、あらためて子ノ口に着きます。";

const CHOSHI_MEMO =
  "子ノ口から歩いておよそ30分、銚子大滝に着きます。十和田湖から流れ出る奥入瀬渓流の本流にかかる滝としては随一とされ、高さおよそ7m、幅およそ20mの流れが豪快な音を立てて落ちています。滝の上に川がないため、魚が十和田湖へさかのぼれない「魚止めの滝」としても知られています。春の新緑、夏の深緑、秋の紅葉、冬の氷瀑と、四季それぞれの表情を見せてくれます。この後は、歩いておよそ140分、石ヶ戸へ向かいましょう。道中には雲井の滝や阿修羅の流れなど、渓流ならではの見どころが続きます。";

const ISHIGEDO_MEMO =
  "銚子大滝から歩いておよそ140分、雲井の滝や阿修羅の流れなど渓流沿いの見どころを眺めながら、石ヶ戸に着きます。「石ヶ戸」とは地元の方言で岩屋を意味し、大きな岩の塊が木々に支えられるようにしてつくる岩陰には、鬼にまつわる言い伝えが残っています。奥入瀬渓流沿いで唯一の休憩所があり、軽食や土産物を扱う売店、トイレも整っています。ここで昼食をとるのもよいでしょう。この後は、歩いておよそ70分、焼山へ向かいましょう。";

const YAKEYAMA_MEMO =
  "石ヶ戸から歩いておよそ70分、奥入瀬渓流の終点にあたる焼山に着きます。子ノ口から続いた渓流沿いの散策も、ここでひと区切りです。焼山には「十和田湖温泉郷」バス停があり、JRバスで十和田湖畔の休屋方面へ戻ることができます。十和田神社と乙女の像から、湖を渡り、渓流を歩いてきた旅は、ここで終了です。バスの本数は季節によって変わるので、訪れる前に時刻を確かめておきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const nenokuchi = await findSpotInItinerary(itinId, { spotName: "子ノ口" });

  if (!nenokuchi.memo!.includes(NENOKUCHI_FROM)) throw new Error("一致しません(子ノ口-1)");
  if (!nenokuchi.memo!.includes(NENOKUCHI_OPENER_FROM)) throw new Error("一致しません(子ノ口-2)");
  const nenokuchiNewMemo = nenokuchi.memo!
    .split(NENOKUCHI_FROM).join(NENOKUCHI_TO)
    .split(NENOKUCHI_OPENER_FROM).join(NENOKUCHI_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    { id: nenokuchi.id, data: { memo: nenokuchiNewMemo } },
    {
      create: {
        name: "銚子大滝",
        address: "青森県十和田市奥瀬(奥入瀬渓流)",
        lat: 40.4886517,
        lng: 140.9511378,
        memo: CHOSHI_MEMO,
        visitTime: t(10, 30),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 30,
        transitLine: null,
      },
    },
    {
      create: {
        name: "石ヶ戸",
        address: "青森県十和田市奥瀬(奥入瀬渓流)",
        lat: 40.5406131,
        lng: 140.978257,
        memo: ISHIGEDO_MEMO,
        visitTime: t(13, 15),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 140,
        transitLine: null,
      },
    },
    {
      create: {
        name: "焼山",
        address: "青森県十和田市奥瀬字焼山",
        lat: 40.5788239,
        lng: 140.9949998,
        memo: YAKEYAMA_MEMO,
        visitTime: t(14, 55),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 70,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = { [nenokuchi.id]: 30 };
  let prevEnd = -1;
  for (const x of day2Spots) {
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
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

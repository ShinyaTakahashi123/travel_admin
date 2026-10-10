/**
 * #88 d1e7bf32（十和田神社と乙女の像、湖畔のパワースポットを巡る1泊2日）
 * 通常の見直し。既存はD1が3か所(10:00〜12:40)・D2が1か所(09:30〜10:00)で、
 * 両日とも4か所未満・開始(D1)・終了とも規定外。文体はツアーガイド口調を
 * 避け、料金にふれず、言い切りにはヘッジを付けた(#87の見直しで確認した
 * 基準に沿う)。
 *
 * D1: 開始を10:00→09:00に変更(十和田神社は特に開門時間の制約が見当たらず)。
 * 十和田ビジターセンター(実在、環境省運営、OSM node 4196579289)を追加。
 * 乙女の像に、占場が現在ははしご通行禁止のため、代わりに御前ヶ浜での
 * おより紙の風習を追記(占場自体は独立したスポットにしなかった)。移動は
 * OSM歩行者ルーティング実測。
 *
 * 【企画運営への報告事項】十和田神社・乙女の像・十和田湖遊覧船・十和田
 * ビジターセンターを尽くしても、D1は09:00〜12:37までにしかならず、
 * 16:30〜17:00の窓に届かない。休屋エリア(十和田湖畔)の徒歩圏に、これ以上の
 * 実在候補が見当たらなかった(発荷峠展望台は車・バスでのアクセスが必要で、
 * 休屋からの実際のバス路線を確認できなかったため見送った)。
 *
 * 開いたURL:
 * - 占場が現在はしご通行禁止であること: https://towadako.or.jp/rekishi-densetsu/towada-jinja/
 * - 十和田ビジターセンターの開館時間・見どころ: WebSearch集約(環境省・
 *   towadako.or.jp等の複数の観光サイトが一致)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const JINJA_MEMO =
  "十和田湖畔にひっそりと鎮まる十和田神社です。蝦夷平定に赴いた坂上田村麻呂がこの地に社を創建したという言い伝えと、熊野で修行を重ねた僧・南祖坊が、湖の主であったという八郎太郎との力比べの末にこの地に住まうことになったという龍神伝説と、二つの由緒が今に伝わっています。古くから水と龍神への信仰を集めてきた社とされ、杉の巨木が並ぶ参道を歩くと、清らかな空気が感じられます。多くの人に親しまれるパワースポットである一方、地域の人々が大切に守り続けてきた信仰の場でもあります。静かに、敬意をもってお参りください。この後は、歩いておよそ15分、乙女の像へ向かいましょう。";

const OTOME_MEMO =
  "十和田神社から歩いておよそ15分、十和田湖のシンボルとして知られる乙女の像に着きます。彫刻家であり詩人でもあった高村光太郎が、十和田八幡平国立公園の指定を記念して手掛けた作品で、1953年に建立されました。二体の裸婦像が静かに向き合い、互いに手を差し伸べるような姿は、光太郎の最晩年の大作とされています。像のモデルについては、亡き妻・智恵子ではないかと語られることもありますが、光太郎自身は生前、モデルが誰かをはっきりとは語らなかったと伝えられています。像の前に広がる御前ヶ浜では、白い紙をひねった「おより紙」を湖に投げ入れ、願いが叶うかどうかを占う風習も伝わっています。この後は、歩いておよそ15分、十和田ビジターセンターへ向かいましょう。";

const VC_MEMO =
  "乙女の像から歩いておよそ15分、十和田ビジターセンターに着きます。環境省が運営する施設で、十和田湖の成り立ちや、四季の自然をパネルや模型でわかりやすく紹介しています。館内からの眺めもよく、湖側は遊歩道につながっていて、十和田湖畔を歩く際の起点にもなっています。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ22分、十和田湖遊覧船の乗り場へ向かいましょう。";

const CRUISE_MEMO =
  "十和田ビジターセンターから歩いておよそ22分、十和田湖遊覧船の乗り場に着きます。ここからは遊覧船で湖上を進みます。十和田湖は、大昔の火山活動によって生まれたカルデラ湖と伝えられており、静かな水をたたえた佇まいから、古くから信仰の対象ともされてきました。湖上からは、十和田神社の杜や、御倉半島・中山半島の深い緑を望むことができ、陸から眺めるのとはまた違う趣があります。運航は季節によって行われており、天候によって運航を見合わせる場合もあるので、訪れる前に確かめておくと安心です。今夜はこの近くの宿でお休みください。湖の静けさに身をゆだねながら、次の目的地・子ノ口へと向かいます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const jinja = await findSpotInItinerary(itinId, { spotName: "十和田神社" });
  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });

  const day1Spots: SpotOrderItem[] = [
    { id: jinja.id, data: { memo: JINJA_MEMO, visitTime: t(9, 0) } },
    { id: otome.id, data: { memo: OTOME_MEMO, visitTime: t(9, 55) } },
    {
      create: {
        name: "十和田ビジターセンター",
        address: "青森県十和田市大字奥瀬字十和田湖畔休屋486",
        lat: 40.424645,
        lng: 140.8936751,
        memo: VC_MEMO,
        visitTime: t(10, 30),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    { id: cruise.id, data: { memo: CRUISE_MEMO, visitTime: t(11, 37), transitMode: "walk", transitDurationMin: 22 } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = { [jinja.id]: 40, [otome.id]: 20, [cruise.id]: 60 };
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

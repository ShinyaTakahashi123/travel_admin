/**
 * #88 d1e7bf32 企画運営(21:24)・法務(21:21)への対応。
 *
 * 【企画運営】
 * 1) 御鼻部山展望台の滞在85分は展望台での水増し(決まりA)。30分に戻す。
 *    「瞰湖台」の追加を提案されたが、実在の位置を公式(るるぶ・十和田湖国立公園協会系)
 *    で確かめたところ、瞰湖台は十和田湖東側、子ノ口〜休屋間の国道103号旧道沿い
 *    (標高583m)にあり、発荷峠→紫明亭→御鼻部山の西側のルート(樹海ライン)とは
 *    別の道だった(OSRM実測: 休屋→瞰湖台3.9分・瞰湖台→子ノ口6.0分＝休屋→子ノ口を
 *    直接行く場合の6.8分とほぼ同じ道のりで、寄り道はごくわずか)。そのため瞰湖台は
 *    D1の西側ループではなく、D2冒頭の休屋→子ノ口のタクシー移動に組み込んだ。
 *    西側ループ(発荷峠〜御鼻部山)には、確認した範囲でほかに実在の立ち寄り先が
 *    見当たらなかったため、D1はこのぶん16:30の窓に届かなくなる(15:21終了)。
 *    企画運営への報告で詳しく説明し、判断を仰ぐ。
 * 2) 十和田食堂をスポットとして独立させるのをやめ、ぷらっとの滞在(30→75分)に
 *    昼食の時間を含める形に変更。店名は書かず「休屋のあたりには…食事処があります」
 *    という書き方にした(法務の指摘と同内容)。
 *
 * 開いたURL:
 * - 瞰湖台(標高583m・位置・見える景色): https://rurubu.jp/andmore/spot/80002203
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const PLATTO_MEMO =
  "十和田湖遊覧船の乗り場から歩いておよそ2分、十和田湖観光交流センター「ぷらっと」に着きます。生きた「十和田湖ひめます」の展示や大型のジオラマがあり、乙女の像を手がけた高村光太郎、この地を愛した文人・大町桂月、十和田湖の発展に尽くした和井内貞行といった、ゆかりのある人々も紹介されています。休屋のあたりには、十和田湖のひめますを使った料理などを出す食事処があります。ここで昼食にしましょう。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ22分、十和田ビジターセンターへ向かいましょう。";

const OHANABE_MEMO =
  "紫明亭展望台からタクシーでおよそ22分、七曲りと呼ばれる急な坂道を上って御鼻部山展望台に着きます。標高およそ1,011mと、十和田湖の展望台の中でも高い場所にあり、発荷峠展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。御倉半島と中山半島が紺碧の湖面を抱くように連なる眺めが広がり、天気がよければ遠く岩手山や八幡平の山並みまで見渡せます。帰りもタクシーで、宿のある十和田湖畔まで戻りましょう。";

const KANKODAI_MEMO =
  "宿を出て、タクシーでおよそ4分、瞰湖台に着きます。標高583mの峠にある展望台で、御倉半島と中山半島の付け根にあたり、十和田湖の中でも透明度が高いといわれる中湖(なかのうみ)を目の前に見下ろすことができます。運がよければ、湖を行き交う遊覧船の姿を眺めることもできます。この後は、タクシーでおよそ6分、子ノ口へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const NENOKUCHI_OPENER_FROM = "旅も2日目、宿のある十和田湖畔からタクシーでおよそ7分、子ノ口に着きます。";
const NENOKUCHI_OPENER_TO = "瞰湖台からタクシーでおよそ6分、子ノ口に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const jinja = await findSpotInItinerary(itinId, { spotName: "十和田神社" });
  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });
  const platto = await findSpotInItinerary(itinId, { spotName: "十和田湖観光交流センター「ぷらっと」" });
  const shokudo = await findSpotInItinerary(itinId, { spotName: "十和田食堂" });
  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  const hakkatoge = await findSpotInItinerary(itinId, { spotName: "発荷峠展望台" });
  const shimeitei = await findSpotInItinerary(itinId, { spotName: "紫明亭展望台" });
  const ohanabe = await findSpotInItinerary(itinId, { spotName: "御鼻部山展望台" });

  // D1: 十和田食堂を削除、ぷらっとに昼食を統合、御鼻部山の滞在を30分に戻す
  const day1Spots: SpotOrderItem[] = [
    { id: jinja.id, data: {} },
    { id: otome.id, data: {} },
    { id: cruise.id, data: {} },
    { id: platto.id, data: { memo: PLATTO_MEMO, stayDurationMin: 75 } },
    { id: vc.id, data: { visitTime: t(12, 44), transitMode: "walk", transitDurationMin: 22, transitLine: null } },
    { id: hakkatoge.id, data: { visitTime: t(13, 37) } },
    { id: shimeitei.id, data: { visitTime: t(14, 9) } },
    { id: ohanabe.id, data: { memo: OHANABE_MEMO, visitTime: t(14, 51), stayDurationMin: 30 } },
  ];

  // D2: 瞰湖台を先頭に追加
  const nenokuchi = await findSpotInItinerary(itinId, { spotName: "子ノ口" });
  const choshi = await findSpotInItinerary(itinId, { spotName: "銚子大滝" });
  const ishigedo = await findSpotInItinerary(itinId, { spotName: "石ヶ戸" });
  const keiryukan = await findSpotInItinerary(itinId, { spotName: "奥入瀬渓流館" });
  const museum = await findSpotInItinerary(itinId, { spotName: "十和田市現代美術館" });
  if (!nenokuchi.memo!.includes(NENOKUCHI_OPENER_FROM)) throw new Error("一致しません(子ノ口)");
  const nenokuchiNewMemo = nenokuchi.memo!.replace(NENOKUCHI_OPENER_FROM, NENOKUCHI_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "瞰湖台",
        address: "青森県十和田市宇樽部(国道103号旧道)",
        lat: 40.4392963,
        lng: 140.9164381,
        memo: KANKODAI_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 24,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      id: nenokuchi.id,
      data: { memo: nenokuchiNewMemo, visitTime: t(9, 30), transitMode: "car", transitDurationMin: 6, transitLine: null },
    },
    { id: choshi.id, data: {} },
    { id: ishigedo.id, data: {} },
    { id: keiryukan.id, data: {} },
    { id: museum.id, data: {} },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = { [jinja.id]: 40, [otome.id]: 20, [cruise.id]: 50, [vc.id]: 45, [hakkatoge.id]: 30, [shimeitei.id]: 20 };
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
  console.log("--- D2 ---");
  {
    let prevEnd = -1;
    for (const x of day2Spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? 30;
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: [shokudo.id] });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

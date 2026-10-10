/**
 * #91 11ddbe6f 企画運営(22:48)の指摘で全面却下。「滞在を延ばして合わせるのは
 * なし」との指示のとおり、実在のスポットを増やして窓に近づける。
 *
 * 【調べて分かったこと】
 * - サクバルの奇岩群は、独立した遊歩道の行き先ではなく、阿嘉島の集落・
 *   阿嘉大橋・外地島の展望台から眺める景観だった(一次資料で確認)。新しい
 *   スポットにはせず、阿嘉大橋・外地展望台のメモに名前を足す形にした。
 *   開いたURL: http://shimanosanpo.com/churajima01/aka00/miru_sakubaru/index.htm
 * - 「慶留間島のビーチ」として提案のあったクシバルビーチは、複数の観光サイトを
 *   確かめたところ、実際は阿嘉島の西側にあるビーチだった(慶留間島に遊泳
 *   ビーチはない、という既存メモの記述とも一致)。位置の関係で今回は見送り、
 *   場所の違いを企画運営への報告で伝える。
 *
 * 【追加したスポット】
 * - 中岳展望台(タキバル展望台、D1、ニシハマビーチのすぐそば): 高床式の
 *   展望台。島のほぼ中央から慶良間諸島の島々を360度一望できる。
 * - さんごゆんたく館(慶良間諸島国立公園ビジターセンター、D2、港のそば):
 *   公式に開館時間9:00〜17:00・無料と確認。サンゴや島の自然を紹介する
 *   展示、カフェ・売店もある。
 * - シロの像(D2、阿嘉港フェリーターミナル前): 映画「マリリンに逢いたい」の
 *   モデルになった、座間味島のマリリンに会うため海を泳いだ犬シロの銅像。
 *
 * 開いたURL:
 * - さんごゆんたく館(開館時間・内容): WebSearch集約(座間味村観光協会・
 *   複数の観光サイトが一致、9:00-17:00・無料・2018年開業)
 * - シロの像(由来・設置場所): https://www.okinawastory.jp/spot/600010418
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NISHIHAMA_FROM =
  "この後は、レンタサイクルでおよそ15分、前浜ビーチへ向かいましょう。島の中はレンタサイクルでめぐります。自転車は港の近くで借りられるので、借りられるか事前に確かめておきましょう。坂道や車に気をつけて走りましょう。";
const NISHIHAMA_TO =
  "この後は、レンタサイクルでおよそ1分、中岳展望台へ向かいましょう。島の中はレンタサイクルでめぐります。自転車は港の近くで借りられるので、借りられるか事前に確かめておきましょう。坂道や車に気をつけて走りましょう。";

const NAKADAKE_MEMO =
  "ニシハマビーチからレンタサイクルですぐ、中岳展望台に着きます。高床式の展望台で、島のほぼ中央に位置し、安室島や渡嘉敷島、慶留間島、久場島、屋嘉比島など、慶良間諸島の島々を見渡すことができます。集落をはさんで西側には、大岩が連なるサクバルの奇岩群も望めます。この後は、レンタサイクルでおよそ6分、前浜ビーチへ向かいましょう。";

const MAEHAMA_FROM = "ニシハマビーチからレンタサイクルでおよそ15分、阿嘉港のそばにある前浜ビーチに着きます。";
const MAEHAMA_TO = "中岳展望台からレンタサイクルでおよそ6分、阿嘉港のそばにある前浜ビーチに着きます。";

const AKAOHASHI_FROM = "橋を渡る風を感じながら、慶良間ブルーと呼ばれる海の色を間近に楽しみましょう。";
const AKAOHASHI_TO =
  "橋の下には、大岩が連なるサクバルの奇岩群も見下ろせます。橋を渡る風を感じながら、慶良間ブルーと呼ばれる海の色を間近に楽しみましょう。";

const FUKAJI_FROM =
  "2階建ての展望台からは、慶良間空港の滑走路を見下ろせるほか、慶良間諸島の島々とケラマブルーの海を見渡せます。空港は、船が欠航したときや緊急時のヘリポートとしても使われています。ゆっくりと景色を楽しんだら、来た道をレンタサイクルで戻り、阿嘉港へ向かいましょう。阿嘉港からの最終便の時刻は、事前に公式サイトで確かめておきましょう。";
const FUKAJI_TO =
  "2階建ての展望台からは、慶良間空港の滑走路を見下ろせるほか、慶良間諸島の島々とケラマブルーの海を見渡せます。範囲の広いサクバルの奇岩群も、ここから眺めることができます。空港は、船が欠航したときや緊急時のヘリポートとしても使われています。ゆっくりと景色を楽しんだら、来た道をレンタサイクルで戻りましょう。この後は、レンタサイクルでおよそ15分、さんごゆんたく館へ向かいましょう。";

const SANGO_MEMO =
  "外地展望台からレンタサイクルでおよそ15分、阿嘉港のそばにあるさんごゆんたく館に着きます。正式には「慶良間諸島国立公園ビジターセンター」といい、サンゴを中心とした慶良間諸島の自然を紹介する展示のほか、観光案内所や売店、カフェも備えています。旅の締めくくりに、慶良間の海のことをあらためて学んでみましょう。休館日は公式サイトで確かめてから訪れましょう。この後は、レンタサイクルでおよそ8分、シロの像へ向かいましょう。";

const SHIRO_MEMO =
  "さんごゆんたく館からレンタサイクルでおよそ8分、阿嘉港のフェリーターミナル前にあるシロの像に着きます。阿嘉島で飼われていた犬のシロが、座間味島にいる恋人の犬マリリンに会うため、海を泳いで通っていたという実話をもとにした銅像です。この実話は映画「マリリンに逢いたい」にもなりました。座間味島には、シロと向き合うようにマリリンの像が立っています。旅の最後に、シロの一途な姿をながめてみましょう。阿嘉港からの最終便の時刻は、事前に公式サイトで確かめておきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const tomarin = await findSpotInItinerary(itinId, { spotName: "泊港旅客ターミナル「とまりん」" });
  const nishihama = await findSpotInItinerary(itinId, { spotName: "ニシハマビーチ" });
  const maehama = await findSpotInItinerary(itinId, { spotName: "前浜ビーチ" });
  const akabeach = await findSpotInItinerary(itinId, { spotName: "阿嘉ビーチ" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(nishihama.memo, NISHIHAMA_FROM, "ニシハマ結び");
  check(maehama.memo, MAEHAMA_FROM, "前浜冒頭");

  const day1Spots: SpotOrderItem[] = [
    { id: tomarin.id, data: {} },
    { id: nishihama.id, data: { memo: nishihama.memo!.replace(NISHIHAMA_FROM, NISHIHAMA_TO) } },
    {
      create: {
        name: "中岳展望台",
        address: "沖縄県島尻郡座間味村阿嘉",
        lat: 26.1990185,
        lng: 127.2807432,
        memo: NAKADAKE_MEMO,
        visitTime: t(12, 1),
        stayDurationMin: 30,
        transitMode: "other",
        transitDurationMin: 1,
        transitLine: null,
      },
    },
    {
      id: maehama.id,
      data: {
        memo: maehama.memo!.replace(MAEHAMA_FROM, MAEHAMA_TO),
        visitTime: t(12, 37),
        stayDurationMin: 75,
        transitMode: "other",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    { id: akabeach.id, data: { visitTime: t(13, 57) } },
  ];

  const tenjo = await findSpotInItinerary(itinId, { spotName: "阿嘉島 集落展望" });
  const akaohashi = await findSpotInItinerary(itinId, { spotName: "阿嘉大橋" });
  const takarake = await findSpotInItinerary(itinId, { spotName: "高良家住宅" });
  const gerumabashi = await findSpotInItinerary(itinId, { spotName: "慶留間橋" });
  const fukaji = await findSpotInItinerary(itinId, { spotName: "外地展望台" });

  check(akaohashi.memo, AKAOHASHI_FROM, "阿嘉大橋");
  check(fukaji.memo, FUKAJI_FROM, "外地展望台");

  const day2Spots: SpotOrderItem[] = [
    { id: tenjo.id, data: {} },
    { id: akaohashi.id, data: { memo: akaohashi.memo!.replace(AKAOHASHI_FROM, AKAOHASHI_TO) } },
    { id: takarake.id, data: {} },
    { id: gerumabashi.id, data: {} },
    { id: fukaji.id, data: { memo: fukaji.memo!.replace(FUKAJI_FROM, FUKAJI_TO) } },
    {
      create: {
        name: "さんごゆんたく館",
        address: "沖縄県島尻郡座間味村阿嘉936-2",
        lat: 26.19993,
        lng: 127.277527,
        memo: SANGO_MEMO,
        visitTime: t(15, 2),
        stayDurationMin: 60,
        transitMode: "other",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "シロの像",
        address: "沖縄県島尻郡座間味村阿嘉(阿嘉港)",
        lat: 26.1902748,
        lng: 127.2845342,
        memo: SHIRO_MEMO,
        visitTime: t(16, 10),
        stayDurationMin: 20,
        transitMode: "other",
        transitDurationMin: 8,
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
  printSchedule("D1", day1Spots, { [tomarin.id]: 10, [nishihama.id]: 120, [akabeach.id]: 150 });
  printSchedule("D2", day2Spots, { [tenjo.id]: 40, [akaohashi.id]: 40, [takarake.id]: 60, [gerumabashi.id]: 60, [fukaji.id]: 90 });

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

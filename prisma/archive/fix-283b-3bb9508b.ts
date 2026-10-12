/**
 * チェックリスト #283 の修正記録(2巡目、企画運営の指摘3点)。
 * しおり「坂の上の雲ミュージアムと子規記念博物館、松山文学散歩1泊2日」
 * (3bb9508b-f70c-4cc0-ada9-d4648ecb6571)
 *
 * 1. 決まりA: 道後温泉本館の150分は水増しのため90分に短縮。本館の「湯上がりには
 *    …昼食をとりましょう」は、実際には11:30発11:40着で昼食の時間がなかったため
 *    削除し、代わりに放生園(新規)を追加して、そこで昼食の時間を確保。放生園は、
 *    建武年間(1334〜1338)、伊佐爾波神社が現在地に移された際につくられた「放生池」
 *    を埋め立てた広場で、「坊っちゃんカラクリ時計」(平成6年[1994]、本館改築100周年
 *    記念)がある。松山市公式 https://www.city.matsuyama.ehime.jp/kanko/kankoguide/shitestukoen/hojyoen.html
 *    ・ https://www.city.matsuyama.ehime.jp/kanko/kankoguide/shitestukoen/karakuri.html
 *    を直接開いて確認。Wikipedia記事なしのため写真は見送り。
 *
 * 2. 愚陀仏庵→愚陀佛庵(公式表記)に修正。公式サイト https://gudabutsuan.jp/ ・
 *    松山市公式 https://www.city.matsuyama.ehime.jp/shisei/machizukuri/sakanoue/gudabutsusaiken.html
 *    を直接開いて確認: 令和8年(2026)7月に番町小学校プール跡地に再建(「このたび」を
 *    「令和8年(2026)に」に修正)。「漱石の文机を再現したコーナー」「複製原稿」は
 *    公式で確認できなかったため削除し、公式の記載(1階の和室が句会・茶会に使える
 *    よう再現、母屋ガイダンス棟に漱石・子規の展示)に合わせて書き直し。休館日の
 *    一言を追加。
 *
 * 3. 愚陀佛庵から子規堂までの距離を確認(直線距離約600m)。徒歩15分は実際の道のりに
 *    比べてやや長めだったため、10分に修正。
 *
 * itinerary-audit.cjs・prayer-check.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-283b-3bb9508b.ts
 * (実行済み。現在の並び・本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3bb9508b-f70c-4cc0-ada9-d4648ecb6571";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  // 1) 道後温泉本館の短縮 + 放生園の追加
  if (!day2.spots.some((s) => s.name === "放生園")) {
    const honkan = day2.spots.find((s) => s.name === "道後温泉本館")!;
    const isaniwa = day2.spots.find((s) => s.name === "伊佐爾波神社")!;
    const hogonji = day2.spots.find((s) => s.name === "宝厳寺")!;
    const yuzukijo = day2.spots.find((s) => s.name === "湯築城跡")!;
    const shikihaku = day2.spots.find((s) => s.name === "松山市立子規記念博物館")!;
    const ishite = day2.spots.find((s) => s.name === "石手寺")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day2.id,
        [
          {
            id: honkan.id,
            data: {
              stayDurationMin: 90,
              memo: "道後温泉本館は、明治27年(1894)に建てられた神の湯本館棟を中心とする、日本を代表する共同浴場です。夏目漱石は松山中学の英語教師として赴任していた際にこの温泉を気に入り、小説『坊っちゃん』では「住田の温泉」として登場させました。以来「坊っちゃん湯」の愛称でも親しまれています。3階の「坊っちゃんの間」は、漱石が正岡子規とともに利用したと伝えられる部屋です。保存修理工事を経て、令和6年(2024)7月に全館で営業を再開しました。建物は明治から大正にかけて増築が重ねられ、平成6年(1994)には国の重要文化財に指定されています。入浴の際は、ほかの入浴客を撮らないようにしましょう。",
            },
          },
          {
            create: {
              name: "放生園",
              address: "松山市道後湯之町6",
              lat: 33.8507103,
              lng: 132.7854625,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 33)),
              stayDurationMin: 65,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "道後温泉本館からは歩いて3分ほどです。放生園は、建武年間(1334〜1338)、伊佐爾波神社が現在の場所に移された際、境内を流れる御手洗川の水をたたえてつくられた「放生池」を、のちに埋め立てて整備された広場です。園内の「坊っちゃんカラクリ時計」は、道後温泉本館の振鷺閣をモチーフに、平成6年(1994)、本館改築100周年を記念してつくられました。毎正時(時間帯によっては30分ごと)に、音楽にあわせて時計台がせり上がり、夏目漱石の小説『坊っちゃん』の登場人物たちが現れるしかけになっています。すぐそばの道後商店街で、昼食もとりましょう。",
            },
          },
          {
            id: isaniwa.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 43)), transitMode: "walk", transitDurationMin: 5 },
          },
          { id: hogonji.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 21)) } },
          { id: yuzukijo.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 6)) } },
          { id: shikihaku.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 6)) } },
          { id: ishite.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 36)) } },
        ],
        { tx }
      );
    }, { timeout: 60000 });
  }

  // 2) 愚陀佛庵の表記・事実の修正
  const gudabutsuan = day1.spots.find((s) => s.name === "愚陀仏庵" || s.name === "愚陀佛庵");
  if (gudabutsuan) {
    const row = await prisma.spot.findUniqueOrThrow({ where: { id: gudabutsuan.id } });
    if (row.name === "愚陀仏庵" || row.memo?.includes("このたび")) {
      await prisma.spot.update({
        where: { id: gudabutsuan.id },
        data: {
          name: "愚陀佛庵",
          memo: "愚陀佛庵は、夏目漱石が松山中学の英語教師として赴任していたころに下宿していた建物です。正岡子規も52日間居候し、俳句結社「松風会」の句会がたびたび開かれました。この時期の交流は、漱石の文学に大きな影響を与えたと伝えられています。建物は松山市二番町にあった上野義方邸の離れでしたが、戦災で焼失。その後、萬翠荘北側に復元されたものの土砂崩れで倒壊し、令和8年(2026)に松山市立番町小学校のプール跡地に新たに再建されました。1階の和室は、当時のように句会や茶会に利用できる部屋として再現され、隣接する母屋ガイダンス棟では、漱石と子規の交流を紹介する展示を見ることができます。休館日は公式サイトで確かめましょう。",
        },
      });
    }
  }

  // 3) 愚陀佛庵→子規堂の移動時間の調整(愚陀佛庵15:13開始+滞在40分=15:53終了、
  // 移動15→10分で子規堂の開始は16:08→16:03)
  const shikido = await findSpotInItinerary(ITIN_ID, { spotName: "子規堂" });
  const shikidoRow = await prisma.spot.findUniqueOrThrow({ where: { id: shikido.id } });
  if (shikidoRow.transitDurationMin === 15) {
    await prisma.spot.update({
      where: { id: shikido.id },
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 3)), transitDurationMin: 10 },
    });
  }

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

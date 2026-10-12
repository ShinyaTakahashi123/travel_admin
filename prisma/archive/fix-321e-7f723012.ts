/**
 * #321の続き。企画運営2026-09-30 23:46の指摘。
 * 徳冨蘆花記念文学館の90分は長すぎた(小さめの記念館のため45分ほどが妥当)。
 * 45分に短縮し、すぐ近くのハワイ王国公使別邸(明治時代の駐日ハワイ王国
 * 公使の夏の別荘、渋川市指定史跡)を独立したスポットとして追加。
 * 閉館時刻を確認したところ、ハワイ王国公使別邸は9:00〜16:30閉館(最終入場の
 * 記載なし)のため、16:30より前に見学が終わるよう蘆花記念文学館より先に
 * 訪れる順にした(蘆花記念文学館は最終入場16:30・閉館17:00のため、あとに
 * 回しても間に合う)。宿の一言は、引き続きいちばん最後の場所(蘆花記念
 * 文学館)に置く。
 *
 * 座標の出典: ハワイ王国公使別邸、Overpassが繰り返しタイムアウトしたため
 * GSI住所検索の完全番地(群馬県渋川市伊香保町伊香保32番地、公式住所と一致)。
 * 36.499046,138.916779
 * 事実確認: city.shibukawa.lg.jp公式(9:00〜16:30、火曜等休館、2階は
 * 土日祝等限定公開)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-321e-7f723012.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "ハワイ王国公使別邸" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const sekisho = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "伊香保関所" } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "伊香保神社" } });
  const ishidan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "石段街" } });
  const udon = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "水沢うどん街" } });
  const mizusawadera = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "水澤寺" } });
  const roka = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "徳冨蘆花記念文学館" } });

  const rokaMemo =
    "ハワイ王国公使別邸からは歩いてすぐです。徳冨蘆花記念文学館は、小説「不如帰」で知られる明治の文豪・徳冨蘆花の記念館です。蘆花の生涯や愛用の品々を紹介する常設展示室のほか、庭園を眺めながらひと息つける喫茶室もあります。石段街の入口からもほど近く、静かな環境の中にあります。文豪ゆかりの静かな時間を過ごしましょう。今夜はこの温泉街の宿に泊まります。";

  await setDaySpotOrder(day1.id, [
    { id: sekisho.id, data: {} },
    { id: jinja.id, data: {} },
    { id: ishidan.id, data: {} },
    { id: udon.id, data: {} },
    { id: mizusawadera.id, data: {} },
    {
      create: {
        name: "ハワイ王国公使別邸",
        address: "渋川市伊香保町伊香保32",
        lat: 36.499046,
        lng: 138.916779,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
        stayDurationMin: 40,
        transitMode: "bus",
        transitDurationMin: 20,
        memo:
          "水澤寺からはバスでおよそ20分です。ハワイ王国公使別邸は、アメリカ合衆国がハワイを併合する以前、独立国だった当時の駐日ハワイ王国公使ロバート・W・アルウィンが、夏の別荘として使っていた建物です。平成25年(2013)に移築・改修され、伊香保とハワイ王国とのゆかりを4つのコーナーで紹介するガイダンス施設もあわせて公開されています。伊香保温泉に残る、意外な国際交流の歴史にふれてみましょう。続いては、歩いてすぐの徳冨蘆花記念文学館へ向かいましょう。",
      },
    },
    {
      id: roka.id,
      data: {
        memo: rokaMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 42)),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 2,
      },
    },
  ]);

  for (const name of ["ハワイ王国公使別邸", "徳冨蘆花記念文学館"]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode!, transitDurationMin: s.transitDurationMin! },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

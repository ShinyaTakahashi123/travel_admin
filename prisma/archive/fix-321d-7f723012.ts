/**
 * #321の続き。企画運営2026-09-30 23:38の2点。
 * 1) 石段街の160分は決まりAの水増しだった。60分に戻す。
 * 2) 昼食(水沢うどん街)が11:30より前に始まっていた。企画運営の提案どおり、
 *    朝は伊香保側(関所→神社→石段街)を先に回り、そのあとバスで水沢へ下りて
 *    11:30すぎに昼食(うどん街)→水澤寺、そこから伊香保へ戻って徳冨蘆花記念
 *    文学館(新規)で1日を締めくくる順番に組み直した。石段街から動いた
 *    宿の一言は、新しい最後の場所である徳冨蘆花記念文学館に移した。
 *
 * 座標の出典: 徳冨蘆花記念文学館、Nominatim名称一致。node 1420711179,
 * 36.4991990,138.9158580(伊香保関所からわずか89mの至近、ハワイ王国公使
 * 別邸ともほぼ同じ一角のため、別邸は独立スポットにはせず本文中で紹介する
 * にとどめた)
 * 事実確認: 小説「不如帰」で知られる徳冨蘆花の記念館、常設展示室と喫茶室
 * (itoenhotel.com・city.shibukawa.lg.jp公式)
 * 移動時間の出典: 石段街⇔水沢うどん街の直線距離約2.4kmから、既存のバス
 * 15分を踏襲(渋川駅発着の同じ系統)。水澤寺⇔伊香保(徳冨蘆花記念文学館)は
 * 同じバス系統でおよそ20分と概算
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-321d-7f723012.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7f723012-6fc6-4ba2-9c16-1d38bcf7540e";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "徳冨蘆花記念文学館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const sekisho = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "伊香保関所" } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "伊香保神社" } });
  const ishidan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "石段街" } });
  const udon = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "水沢うどん街" } });
  const mizusawadera = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "水澤寺" } });

  const sekishoMemo =
    "渋川駅からバスでおよそ25分。伊香保関所(伊香保口留番所)は、寛永8年(1631)、江戸幕府によって三国街道の裏往還の要所に設けられた関所です。約238年にわたってこの地を行き交う人々を取り締まり、明治2年(1869)の関所廃止令により役目を終えました。現在は当時の建物を復元した展示施設となっており、通行手形や十手、取り調べの様子を再現した人形などが展示されています。江戸時代の旅の様子に思いを馳せてみましょう。続いては、歩いてすぐの伊香保神社へ向かいましょう。";

  const ishidanMemo =
    "伊香保神社からは歩いておよそ6分です。石段街は、天正4年(1576)、武田勝頼の命を受けた真田昌幸が、長篠の戦いで傷ついた武士の療養地として整備したのが始まりと伝えられています。源泉を効率よく引き込むため、斜面を階段状に造成し、中央に湯樋を通したといわれています。現在の石段は365段あり、平成22年(2010)の改修で「一年365日、多くの人でにぎわうように」との願いを込めて北側に数段が加えられ、この数になりました。石段の途中には、この地を愛した与謝野晶子の詩が刻まれた碑もあり、両側には射的場やお土産屋、飲食店が並んで賑わいを見せます。趣のある石段を上り下りしながら、射的やお土産探し、食べ歩きなど、伊香保ならではの温泉街の風情を楽しみましょう。続いては、バスでおよそ15分の水沢うどん街へ向かいましょう。";

  const udonMemo =
    "石段街からはバスでおよそ15分です。水沢うどん街は、稲庭うどん、讃岐うどんと並んで日本三大うどんに数えられるという「水沢うどん」の店が軒を連ねる通りです。水澤寺の門前で、参拝客をもてなすために僧侶たちが手打ちうどんをふるまったのが始まりと伝えられ、400年以上の歴史を持つといわれています。強いコシと、つるりとした喉ごしが特徴で、店ごとに少しずつ違う味わいを食べ比べるのも楽しみ方の一つです。到着したら、まずこのあたりで昼食をとりましょう。この土地ならではの一杯を味わってみましょう。続いては、歩いておよそ15分の水澤寺へ向かいましょう。";

  const mizusawaderaMemo =
    "水沢うどん街からは歩いておよそ15分です。水澤寺(水澤観音)は、飛鳥時代の創建と伝えられる、坂東三十三観音の第十六番札所です。六角堂の中には、回すとお経を読んだのと同じ功徳があるという「六地蔵尊」が安置され、本堂には十二支それぞれの守り本尊が祀られています。この地に伝わる伊香保姫の伝説にもゆかりがあり、参拝客をもてなすためにふるまわれたうどんが、のちの水沢うどんの起源になったとも伝えられています。静かに、敬意をもってお参りください。続いては、バスでおよそ20分の徳冨蘆花記念文学館へ向かいましょう。";

  await setDaySpotOrder(day1.id, [
    { id: sekisho.id, data: { memo: sekishoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)), stayDurationMin: 30, transitMode: null, transitDurationMin: null } },
    { id: jinja.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 9, 34)), stayDurationMin: 55 } },
    { id: ishidan.id, data: { memo: ishidanMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 35)), stayDurationMin: 60 } },
    {
      id: udon.id,
      data: {
        memo: udonMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 50)),
        stayDurationMin: 95,
        transitMode: "bus",
        transitDurationMin: 15,
      },
    },
    {
      id: mizusawadera.id,
      data: {
        memo: mizusawaderaMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 40)),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 15,
      },
    },
    {
      create: {
        name: "徳冨蘆花記念文学館",
        address: "渋川市伊香保町伊香保",
        lat: 36.499199,
        lng: 138.915858,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
        stayDurationMin: 90,
        transitMode: "bus",
        transitDurationMin: 20,
        memo:
          "水澤寺からはバスでおよそ20分です。徳冨蘆花記念文学館は、小説「不如帰」で知られる明治の文豪・徳冨蘆花の記念館です。蘆花の生涯や愛用の品々を紹介する常設展示室のほか、庭園を眺めながらひと息つける喫茶室もあります。すぐそばには、明治時代の駐日ハワイ王国公使が夏の別荘として使っていた「ハワイ王国公使別邸」も残り、伊香保とハワイの意外なつながりを伝えています。石段街の入口からもほど近いので、あわせて訪ねてみるのもよいでしょう。文豪ゆかりの静かな時間を過ごしましょう。今夜はこの温泉街の宿に泊まります。",
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["伊香保神社", "walk", 4],
    ["水沢うどん街", "bus", 15],
    ["水澤寺", "walk", 15],
    ["徳冨蘆花記念文学館", "bus", 20],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }
  // 伊香保関所は1日目の最初のスポットになったため、乗り継ぎ情報を削除
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: sekisho.id } });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

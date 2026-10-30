/**
 * #35(彦根城と佐和山城跡。国宝天守と石田三成の山城をめぐる1泊2日)初日・最終日の見直し。
 *
 * - Day1: 開始を9:30→10:45枠(10:52)に。5か所すべて説明文・タイトルに名前があり外せない
 *   ため、滞在をもと以下に短縮して収める。彦根駅→彦根城は#43(77b83773)と同じ22分
 *   (railway=stationのnode3630162090を使用)。近江鉄道の実測(彦根→鳥居本4分、鳥居本→
 *   豊郷39分、いずれもYahoo!路線情報)で、当初の想定(5分・20分)より伸びることが判明。
 *   会社名「近江鉄道」を本文・transitLineから除去。終わり17:00。
 * - Day2: 昼食を50→40分(決まりの標準の長さ、もと以下)に。佐和山城跡→本丸跡node
 *   5968123185、辻番所→建物way1462011359の生の頂点node13344089503、龍潭寺・井伊神社・
 *   千代神社・開国記念館はOSMの厳密な値に。山道(井伊神社↔佐和山城跡↔龍潭寺)はrouted-
 *   footの実測(14分・13分)を採用。これらの直しで終わりが16:26(もとの16:35より早い)に
 *   なったため、決まり369の③で埋木舎(#43と同じ場所、node群から35.275618,136.256532)
 *   を追加。楽々園は公開状況の公式な出典が見つからず断念、彦根城博物館は玄宮園からの
 *   移動が長く滞在が短くなりすぎるため見送り。埋木舎は公開状況の出典
 *   https://hugkum.sho.jp/368028 (「1991年から一般公開されている」)で確認。終わり16:33
 *   (もとの16:35より早い)。
 *
 * 出典:
 * - 彦根→鳥居本4分: https://transit.yahoo.co.jp/search/result?from=彦根&to=鳥居本
 * - 鳥居本→豊郷39分: https://transit.yahoo.co.jp/search/result?from=鳥居本&to=豊郷
 * - 豊郷→彦根17分: https://transit.yahoo.co.jp/search/result?from=豊郷&to=彦根
 * - 埋木舎の公開状況: https://hugkum.sho.jp/368028
 * - 駅探・routed-footの実測は各区間に記載のとおり
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-35-4d332b95.ts
 *   反映: npm run prod -- npx tsx prisma/fix-35-4d332b95.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d332b95-a3a0-4e2a-bdc0-092b71868765";
const DAY1_ID = "b5661720-9aaf-48e7-a84d-47cde767efd8";
const DAY2_ID = "ef77a379-e77b-4d4f-87a3-3fb3ed3ab1ad";

// Day1
const CASTLE = "77be1a52-9182-4042-b3b2-906240a4381d";
const CASTLEROAD = "b0dd5b9d-45cf-47ca-8c55-1d6ef858c318";
const TORIIMOTOJUKU = "64ae27e8-57b7-4284-bfb7-c013ff0c0e19";
const ITOCHU = "e60d50d9-030e-4406-82c5-3b94f9b726b6";
const TOYOSATOSHO = "f9081458-4e5b-48fd-ac51-b26923184160";

// Day2
const RYUTANJI = "d79aa97d-dd06-4408-a26f-0b5021b1aad3";
const IIJINJA = "a1fd3465-3726-4937-a8d0-03311ee59a17";
const SAWAYAMA = "0e6545ef-9c6c-40b8-b9d9-e07fb2a0db4a";
const EKIMAE = "58d4c009-c3b5-4177-9be0-07d8b6ca74c9";
const CHIYOJINJA = "1db001e4-d79e-4b7b-8af1-a48555e748ea";
const TSUJIBANSHO = "d83f470f-8e87-45cd-a36f-94e60046d545";
const KAIKOKU = "54cc9b9b-fc74-484d-a166-641b2ef2dba9";
const GENKYUEN = "3b2b87c3-8c62-48c2-91a8-f6c50cce72e5";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  let preview = "";
  await prisma
    .$transaction(
      async (tx) => {
        // ===== Day1 =====
        await setDaySpotOrder(
          DAY1_ID,
          [
            {
              id: CASTLE,
              data: {
                visitTime: t(10, 52),
                stayDurationMin: 80,
                lat: 35.276483,
                lng: 136.251861,
                memo: "この旅は歩きと電車でめぐります。彦根駅に10時30分ごろ着いたら、歩いておよそ22分、彦根城の天守から旅を始めます。初代藩主・井伊直政から後のことを託された家老の木俣守勝が、城を移す計画を徳川家康にはかり、慶長9年（1604年）、佐和山城の西約2kmの彦根山で築城が始まりました。幕府から奉行が送られ、近くの国々の大名が手伝う天下普請のかたちで進められ、大坂の陣での中断をはさんで、およそ20年をかけて完成しました。天守は大津城の天守を移したものと考えられていて、切妻破風・入母屋破風・唐破風を組み合わせた屋根が、変化に富んだ姿をつくっています。天守は昭和27年（1952年）に国宝に指定されました。天守の中の階段は急なので、手すりにつかまり、足元に気をつけましょう。工事で見学できる範囲が変わることがあるので、公式の案内で確かめましょう。この後は、歩いておよそ14分、夢京橋キャッスルロードへ向かいましょう。",
                transitLegs: { deleteMany: {} },
              },
            },
            {
              id: CASTLEROAD,
              data: {
                visitTime: t(12, 26),
                stayDurationMin: 42,
                lat: 35.270969,
                lng: 136.251504,
                memo: "彦根城から歩いておよそ14分。京橋からすぐの通りで、江戸時代の城下町をイメージして、白壁と黒格子の町家風にそろえた建物が並び、和菓子や洋菓子の店、地元ならではの品を扱う店が軒を連ねます。近くの四番町スクエアは、「彦根の台所」としてにぎわった市場の商店街を、ガス灯の映える大正ロマンの町並みに整え直した一画です。このあたりで昼食にしましょう。今も人が暮らし、商いをしている通りなので、静かに歩きましょう。この後は、彦根駅へ歩いておよそ20分、鳥居本駅まで電車でおよそ4分、さらに歩いておよそ8分で鳥居本宿に着きます(あわせて約32分)。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14, transitLine: null }] },
              },
            },
            {
              id: TORIIMOTOJUKU,
              data: {
                visitTime: t(13, 40),
                stayDurationMin: 52,
                memo: "夢京橋キャッスルロードから彦根駅へ歩いておよそ20分、鳥居本駅まで電車でおよそ4分、さらに歩いておよそ8分で鳥居本宿に着きます(あわせて約32分)。中山道を江戸から数えて63番目の宿場で、本陣が1軒、脇本陣が2軒、旅籠が35軒ありました。宿場の最初の曲がり角には、江戸時代から胃の薬をつくり売ってきた家の堂々とした建物が今も残り、軒先には、雨合羽を売っていた家の古い看板が下がります。北の入口には松並木が続き、昭和6年（1931年）に建てられた鳥居本駅の駅舎も見どころです。今も人が暮らしている町なので、静かに歩きましょう。この後は、鳥居本駅へ歩いておよそ8分、豊郷駅まで電車でおよそ39分、さらに歩いておよそ3分で伊藤忠兵衛記念館に着きます(あわせて約50分)。",
                transitLegs: {
                  deleteMany: {},
                  create: [
                    { orderNo: 1, transitMode: "walk", transitDurationMin: 20, transitLine: null },
                    { orderNo: 2, transitMode: "train", transitDurationMin: 4, transitLine: null },
                    { orderNo: 3, transitMode: "walk", transitDurationMin: 8, transitLine: null },
                  ],
                },
              },
            },
            {
              id: ITOCHU,
              data: {
                visitTime: t(15, 22),
                stayDurationMin: 38,
                memo: "鳥居本宿から鳥居本駅へ歩いておよそ8分、豊郷駅まで電車でおよそ39分、さらに歩いておよそ3分で着きます(あわせて約50分)。近江商人の初代伊藤忠兵衛が暮らし、のちに総合商社の土台を築いた二代忠兵衛が生まれた家です。炊事場や帳場、奥の間など、当時の暮らしの場が残され、二人の愛用品や資料が展示されています。開館の時間と休館日は公式の案内で確かめましょう。この後は、歩いておよそ10分、豊郷小学校旧校舎群へ向かいましょう。",
                transitLegs: {
                  deleteMany: {},
                  create: [
                    { orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null },
                    { orderNo: 2, transitMode: "train", transitDurationMin: 39, transitLine: null },
                    { orderNo: 3, transitMode: "walk", transitDurationMin: 3, transitLine: null },
                  ],
                },
              },
            },
            {
              id: TOYOSATOSHO,
              data: {
                visitTime: t(16, 10),
                stayDurationMin: 50,
                memo: "記念館から歩いておよそ10分。昭和12年（1937年）に、近江商人の古川鉄治郎の寄付で建てられ、建築家ヴォーリズが設計した小学校の校舎です。鉄筋コンクリートの建物に、水洗トイレや暖房、内線電話など当時の最先端の設備をそなえ、「東洋一の小学校」とも呼ばれました。2階と3階の教室は当時のまま残され、講堂や図書館の建物も見られます。休館日は公式の案内で確かめましょう。帰りは、歩いておよそ11分の豊郷駅へ。電車でおよそ17分で彦根に戻り、今夜は彦根の宿に泊まりましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
              },
            },
          ],
          { tx }
        );

        // ===== Day2 =====
        await setDaySpotOrder(
          DAY2_ID,
          [
            {
              id: RYUTANJI,
              data: {
                visitTime: t(9, 30),
                stayDurationMin: 45,
                lat: 35.2827945,
                lng: 136.2664548,
                memo: "この日も歩いてめぐります。宿から歩いておよそ21分、佐和山のふもとへ。奈良時代に遠江（今の静岡県）の井伊谷で開かれたと伝わる、井伊家の始祖以来の菩提寺で、井伊直政が佐和山城主になったのを機に、この佐和山のふもとに移されました。佐和山を景色に取り入れた広い庭があり、方丈の南の「ふだらくの庭」は、白い砂に48の石を配した石庭です。茶人の小堀遠州が、ここで茶の湯を楽しんだとも伝わります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
                transitLegs: { deleteMany: {} },
              },
            },
            {
              id: IIJINJA,
              data: {
                visitTime: t(10, 19),
                stayDurationMin: 13,
                lat: 35.283818,
                lng: 136.2663953,
                memo: "龍潭寺から歩いておよそ4分、参道のわきに着きます。天保13年（1842年）、12代藩主・井伊直亮が、井伊家の始祖・井伊共保の750回忌にあたって、遠江の井伊谷の八幡宮から神を分けてまつったのが始まりとされる神社で、直政と直孝もまつられています。社殿は傷みが激しいため覆いがかけられ、中を見ることはできません。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
              },
            },
            {
              id: SAWAYAMA,
              data: {
                visitTime: t(10, 46),
                stayDurationMin: 50,
                lat: 35.2797963,
                lng: 136.269118,
                memo: "井伊神社から山道を歩いておよそ14分、佐和山城跡の本丸跡に着きます。天正18年（1590年）に石田三成が城主となり、5層の天守を構えた立派な城だったと伝わります。関ヶ原の戦いで三成が敗れたあとは井伊直政が城主となり、彦根城の築城にともなって慶長11年（1606年）に廃城になりました。石垣や建物の多くは彦根城へ運ばれ、今は、わずかに残る石垣と、後の時代に建てられた石碑が往時をしのばせます。山頂からは彦根城や琵琶湖を見渡せます。山は寺の土地なので、火は使わず、ごみは持ち帰りましょう。登城口の門が開いている時間の中で下山するきまりなので、時間に気をつけましょう。山道は足場の悪いところもあるので、歩きやすい靴で足元に気をつけましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14, transitLine: null }] },
              },
            },
            {
              id: EKIMAE,
              data: {
                visitTime: t(12, 10),
                stayDurationMin: 40,
                lat: 35.2722017,
                lng: 136.2633658,
                memo: "佐和山城跡から山道を歩いておよそ13分、龍潭寺へ戻り、さらに歩いておよそ21分で彦根駅前に着きます(あわせて約34分)。駅のまわりで昼食にしましょう。",
                transitLegs: {
                  deleteMany: {},
                  create: [
                    { orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null },
                    { orderNo: 2, transitMode: "walk", transitDurationMin: 21, transitLine: null },
                  ],
                },
              },
            },
            {
              id: CHIYOJINJA,
              data: {
                visitTime: t(13, 6),
                stayDurationMin: 25,
                lat: 35.267989,
                lng: 136.2557854,
                memo: "彦根駅前から歩いておよそ16分、千代神社に着きます。芸能の祖の神とされる天宇受売命と、猿田彦命をまつる神社で、今も俳優など芸の道に携わる人が、上達を祈りに訪れます。井伊家に守られ、この地の守り神として信仰を集めてきました。三間社流造の本殿は国の重要文化財です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16, transitLine: null }] },
              },
            },
            {
              id: TSUJIBANSHO,
              data: {
                visitTime: t(13, 42),
                stayDurationMin: 30,
                lat: 35.2681629,
                lng: 136.2495939,
                memo: "千代神社から歩いておよそ11分、彦根藩の足軽が住んだ組屋敷の町へ。辻番所は、間口1間・奥行き2間、4畳あまりの小さな番所で、2つの通りに向けて見張りの窓が2つあります。まわりの通りは見通しがきくよう、わざと食い違いになっています。中を見られる日は限られるので、公式の案内で確かめましょう。今も人が暮らしている町なので、静かに歩きましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11, transitLine: null }] },
              },
            },
            {
              id: KAIKOKU,
              data: {
                visitTime: t(14, 27),
                stayDurationMin: 40,
                lat: 35.2753394,
                lng: 136.2553264,
                memo: "辻番所から歩いておよそ15分、彦根城の佐和口へ。井伊直弼の没後100年を記念して、昭和35年（1960年）に市民の寄付で建てられた建物で、彦根城の佐和口多聞櫓の姿を再現しています。城下町の400年の歴史や、朝に訪れた井伊神社にまつわる展示があります。展示替えの休館は公式の案内で確かめましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
              },
            },
            {
              id: GENKYUEN,
              data: {
                visitTime: t(15, 11),
                stayDurationMin: 55,
                lat: 35.277265,
                lng: 136.254399,
                memo: "開国記念館から歩いておよそ4分。4代藩主・井伊直興が延宝5年（1677年）につくったとされる大名庭園で、琵琶湖や、中国の瀟湘八景にちなんで選ばれた近江八景を模して景色がつくられています。大きな池のまわりを歩いてめぐる池泉回遊式の庭で、となりの楽々園とあわせて「玄宮楽々園」として国の名勝です。この後は、歩いておよそ7分、埋木舎へ向かいましょう。",
                transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
              },
            },
            {
              create: {
                name: "埋木舎",
                visitTime: t(16, 13),
                stayDurationMin: 20,
                lat: 35.2756183,
                lng: 136.2565319,
                memo: "玄宮園から歩いておよそ7分。のちに幕府の大老となる井伊直弼が、17歳から32歳までの15年間を過ごした屋敷です。跡継ぎ以外の男子は他家の養子になる以外に世に出る道がほとんどなく、直弼も自分の境遇を「埋もれて花の咲かない木」になぞらえていたと伝えられています。ここで過ごした歳月に、武術や国学、茶道、和歌、能などを熱心に学んだといいます。1991年(平成3年)から一般公開されています。旅の締めくくりに、若き日の直弼の暮らしをしのびましょう。この後は、歩いておよそ12分の彦根駅へ向かいましょう。",
                transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
              },
            },
          ],
          { tx }
        );

        const days = await tx.day.findMany({
          where: { itineraryId: ITINERARY_ID },
          orderBy: { dayNumber: "asc" },
          include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
        });
        const hm = (dt: Date | null) => (dt ? `${String(dt.getUTCHours()).padStart(2, "0")}:${String(dt.getUTCMinutes()).padStart(2, "0")}` : "?");
        for (const d of days) {
          preview += `\n=== Day ${d.dayNumber} ===\n`;
          for (const s of d.spots) {
            const legs = s.transitLegs.map((l) => `${l.transitMode}/${l.transitDurationMin}`).join("+") || "-";
            preview += `[${s.orderNo}] ${hm(s.visitTime)} ${legs} ${s.name}(${s.stayDurationMin}分) lat=${s.lat} lng=${s.lng}\n`;
          }
        }

        if (!commit) {
          throw new Error("DRY_RUN_ROLLBACK");
        }
      },
      { timeout: 60000 }
    )
    .catch((e) => {
      if (e instanceof Error && e.message === "DRY_RUN_ROLLBACK") {
        console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません(ロールバックしました)。以下はロールバック前の実際の計算結果です。");
        return;
      }
      throw e;
    });

  console.log(preview);

  if (commit) {
    console.log("[--commit] 書き込みました。");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

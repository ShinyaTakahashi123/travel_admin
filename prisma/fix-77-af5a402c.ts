/**
 * #77(仙台市博物館と牛たん通り、歴史とグルメを楽しむ1泊2日、af5a402c)の
 * 初日・最終日の見直し(修正版)。
 *
 * Day2(最終日)は、09:30開始・16:34終了で決まり(16:30〜17:00)に合うため
 * 時刻は変更なし。言葉づかいを直し、法務の指摘でSS30展望フロア・榴岡公園
 * の座標を直した(それに伴い前後の移動を測り直した)。
 *
 * Day1(初日)は全面的に組み直した。
 *
 * 【入口の時刻】最初の版は「仙台駅10:20ごろ着」としたが、決まり(入口は
 * 10:30より前にしない)に反するため、企画運営・法務の指摘で10:30ごろ着に
 * 直した(→レンタカー手続き15分→車で約10分→仙台東照宮10:55着)。
 *
 * 【瑞鳳殿の拝観時間】瑞鳳殿は最終受付が16:30(12月〜1月は16:00)と季節で
 * 変わるため(企画運営の指摘)、最初の版の16:24着では冬に間に合わない
 * おそれがあった。仙台城跡(屋外の本丸跡で、拝観時間の制約が小さい)を
 * 最後にし、瑞鳳殿を仙台市博物館のあとに回す順番に変更した
 * (博物館→瑞鳳殿→仙台城跡)。これにより瑞鳳殿の到着が15:18となり、
 * 冬の最終受付16:00より前に余裕を持って間に合う。
 *
 * 【車と歩きの区間】仙台東照宮〜宮城県美術館は車、美術館〜仙台市博物館
 * 〜瑞鳳殿〜仙台城跡は歩き。車は宮城県美術館の駐車場に置いたままになる
 * ため、1日目の最後(仙台城跡)に、歩いて戻る(タクシーも使える)旨を
 * 加えた(企画運営の指摘)。
 *
 * 【移動の測り直し】
 * - 大崎八幡宮→宮城県美術館(car): 7分→実測12.8分。短すぎた。13分に直す
 * - 宮城県美術館→仙台市博物館(walk): 13分→実測14.2分。ほぼ一致、変更なし
 * - 仙台市博物館→瑞鳳殿(walk、新しい順番): 実測23.6分。24分に直す
 * - 瑞鳳殿→仙台城跡(walk、新しい順番・新座標): 実測34.1分。34分に直す
 * - 仙台東照宮→輪王寺・輪王寺→大崎八幡宮(car): 決まりの範囲内のため変更なし
 *
 * 滞在を短縮して16:30〜17:00の範囲(17:00ちょうど)に収めた: 東照宮45→35分、
 * 輪王寺40→30分、八幡宮45→35分、美術館75→45分、博物館70→50分、
 * 瑞鳳殿50→38分、仙台城跡50→30分(いずれも見どころは削らず、時間だけ短縮)。
 *
 * 新しい時刻: 仙台東照宮10:55(35)→輪王寺11:40(30)→大崎八幡宮12:18(35)→
 * 宮城県美術館13:06(45、昼食)→仙台市博物館14:04(50)→瑞鳳殿15:18(38)→
 * 仙台城跡16:30(30、〜17:00)
 *
 * 【言葉づかいの直し】「〜てみてください」「おすすめ」「(宿で)お休み
 * ください」「ご利用ください」を、決まりに合う形に直す(Day1・Day2両方)。
 *
 * 【座標(法務の指摘)】
 * - 仙台市博物館: OSM way226829544のNominatim値(差約15m)
 * - 仙台城跡: 名前の点がなかったため、OSM way60100947「仙台城」
 *   (historic=castle)のNominatim値38.2526098,140.8559278に直す
 * - SS30展望フロア: OSM way30614287「SS30」のNominatim値
 *   38.2562944,140.8783031に直す(建物からのずれを修正)
 * - 榴岡公園: relation16202524(公園全体の計算上の中心)は使わず、
 *   公園内の名前のある施設way61488987「仙台市歴史民俗資料館」の
 *   Nominatim値38.2609628,140.8983728に直す。これに伴い、牛たん通り→
 *   榴岡公園の道のりを測り直したが、実測26.0分でもとの26分と一致
 *   (変更なし)。朝市→SS30(新点)は実測4.9分でもとの5分とほぼ一致
 *   (変更なし)。SS30(新点)→牛たん通りは実測8.3分のため7分→8分に直す
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-77-af5a402c.ts
 *   反映: npm run prod -- npx tsx prisma/fix-77-af5a402c.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "66aaf8bf-cd72-4648-b2ff-cd9b52f7c795";

const TOSHOGU_ID = "affd6426-6544-40d1-94f1-50eda1cd5f9a";
const RINNOJI_ID = "8e938276-b74d-4695-8ac7-5447e30ca0aa";
const OSAKI_ID = "5af2e0e1-36cf-4bbd-ac79-4e43467abc1a";
const BIJUTSUKAN_ID = "abe835d0-e6e8-446a-8d9c-4f7cb311b950";
const HAKUBUTSUKAN_ID = "62354bfc-6c38-4a02-94c9-2445f801c000";
const SHIROATO_ID = "fc4bdd95-5f0f-4f57-8fc9-04da3c614b2e";
const ZUIHODEN_ID = "5c4438d4-1490-4ecd-bc49-f60e518c6e03";
const SS30_ID = "a81107c0-d39d-454b-98ad-72cdebf68532";
const GYUTAN_ID = "8623d44b-2337-46e3-ba60-7b5bf05b64ef";
const ASAICHI_ID = "4d8e8f66-fa4f-43c5-a593-e9d6d23ede2a";
const TSUTSUJIGAOKA_ID = "3fef4965-17f8-494e-a86c-af15150617dd";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TOSHOGU_MEMO =
  "JR仙台駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約10分の仙台東照宮へ。仙台藩2代藩主・伊達忠宗公により、承応3年(1654)に創建されました。本殿や唐門、随身門など15棟あまりからなる社殿を、5年の歳月と多くの人手・費用をかけて造営したと伝えられています。本殿を囲む透塀と唐門は国の重要文化財に指定されており、漆塗りに金箔や七宝の金具をあしらった意匠から、当時の建築技術の粋がうかがえます。この地は、かつて伊達政宗公の案内で徳川家康公が休息したゆかりの場所とも伝えられ、東北地方における東照宮としては最大級の規模を誇ります。参拝の際は、敬意を持ってお参りしましょう。この後は、車でおよそ10分、輪王寺へ向かいましょう。";

const RINNOJI_MEMO =
  "仙台東照宮から車でおよそ10分、仙台城下の北の守りとして社寺が並ぶ北山地区にある輪王寺に着きます。伊達家に代々ゆかりのある曹洞宗の寺院で、明治から大正にかけての復興時に整えられたという庭園が、東北有数の名園として知られています。池を中心にした池泉庭園と、石や砂で山水を表す枯山水の庭が組み合わされ、四季を通じて木々の緑や花、紅葉が美しい景色をつくりだします。木々に包まれた静かな境内を、ゆっくりと歩きましょう。参拝の際は、敬意を持ってお参りしましょう。この後は、車でおよそ8分、大崎八幡宮へ向かいましょう。";

const OSAKI_MEMO =
  "輪王寺から車でおよそ8分、大崎八幡宮に着きます。仙台藩祖・伊達政宗の命により、慶長9年(1604)から12年(1607)にかけて、豊臣家に仕えた当時の名だたる職人たちを招いて造営されました。本殿・石の間・拝殿からなる社殿は、安土桃山時代の建築様式を今に伝える唯一の遺構とされ、国宝に指定されています。随所に施された見事な彫刻や彩色は、豊国廟の建築を模したとも伝えられ、仙台に移入された桃山文化の粋を感じさせます。参拝の際は、敬意を持ってお参りしましょう。この後は、車でおよそ13分、宮城県美術館へ向かいましょう。";

const BIJUTSUKAN_MEMO =
  "大崎八幡宮から車でおよそ13分、宮城県美術館に着きます。昭和56年(1981)に開館した県立の美術館で、宮城県ゆかりの作家の作品を中心に、国内外の近現代美術を幅広く収蔵しています。老朽化にともなう大規模な改修工事のため一時休館していましたが、リニューアルオープンし、今は通常どおり開館しています。子供向けの「キッズスタジオ」や、収蔵庫の様子をのぞける「見える収蔵庫」など、新しい展示のしかたも加わっています。ここで昼食にしましょう。この後は、歩いておよそ13分、仙台市博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO =
  "宮城県美術館から歩いておよそ13分、仙台城の三の丸だった場所に立つ仙台市博物館に着きます。仙台藩主・伊達家ゆかりの品々を数多く収蔵・展示しており、中でも「慶長遣欧使節関係資料」は、伊達政宗公の命により海を渡った家臣・支倉常長にまつわる資料で、47点がまとめて国宝に指定されています。イタリアのローマ滞在中に、現地の画家が描いたという常長の肖像画は、日本人を描いた油彩画として現存最古とされ、鎖国前の日本人が海を越えて世界と渡り合った証しとして、見る人の心を打ちます。政宗公が実際に身につけていたという甲冑をはじめ、伊達家に伝わる武具や史料の数々にも出会える博物館です。仙台の歴史にじっくりと触れたら、この後は、歩いておよそ24分、瑞鳳殿へ向かいましょう。";

const ZUIHODEN_MEMO =
  "仙台市博物館から歩いておよそ24分、広瀬川を見下ろす経ヶ峰に立つ瑞鳳殿に着きます。仙台藩祖・伊達政宗公の霊屋で、寛永13年(1636)に政宗公が没した翌年、2代藩主・忠宗公によって建てられました。桃山文化の様式を伝える極彩色の廟建築で、昭和6年(1931)には国宝に指定されましたが、戦災で焼失し、現在の建物は昭和54年(1979)に再建されたものです。極彩色の彫刻や飾り金具が随所に施された絢爛豪華な意匠から、政宗公がこの地でいかに慕われていたかがうかがえます。境内にはあわせて、2代・忠宗公の霊屋である感仙殿と、3代・綱宗公の霊屋である善応殿も並んで再建されており、3代にわたる藩主の廟所をまとめて見学できます。拝観時間は季節によって変わり(最終受付は12月〜1月は16時、それ以外は16時30分)、訪れる前に公式サイトで確かめましょう。参拝の際は、敬意を持ってお参りしましょう。この後は、歩いておよそ34分、仙台城跡へ向かいましょう。";

const SHIROATO_MEMO =
  "瑞鳳殿から歩いておよそ34分、仙台城跡に着きます。青葉山の断崖を生かして伊達政宗公が築いたこの城は、東と南を天然の断崖に守られた要害で、徳川将軍家をはばかってか、天守閣は築かれなかったと伝えられています。かつてこの地は「千代」と呼ばれていましたが、政宗公が中国・唐の時代の漢詩の一節にちなんで「仙台」と改めたのだそうです。本丸跡の広場には伊達政宗公の騎馬像が立ち、仙台の市街地を見晴らす絶好の展望スポットとなっています。本丸会館では、政宗公の甲冑をイメージした衣装の試着体験もできます。博物館で伊達家の歴史に触れ、瑞鳳殿で政宗公の霊屋に参拝したあとにこの本丸跡に立つと、政宗公が見ていたであろう城下の景色が、より身近に感じられることでしょう。仙台東照宮から輪王寺、大崎八幡宮、伊達家ゆかりの地をめぐった歴史をたどる1日目は、ここで終わりです。見学を終えたら、歩いて20分ほど(タクシーも使えます)、宮城県美術館の駐車場まで戻り、車で今夜の宿へ向かいましょう。";

const SS30_FIND = "少し高いところから、仙台の街を一望してみましょう。";
const SS30_REPLACE_TEXT = "少し高いところから、仙台の街を一望しましょう。";
const SS30_FIND2 = "この後は、歩いておよそ7分、仙台駅3階の牛たん通り・すし通りへ向かいましょう。";
const SS30_REPLACE2 = "この後は、歩いておよそ8分、仙台駅3階の牛たん通り・すし通りへ向かいましょう。";

const GYUTAN_FIND = "SS30から歩いておよそ7分、JR仙台駅3階にある牛たん通り・すし通りに着きます。";
const GYUTAN_REPLACE = "SS30から歩いておよそ8分、JR仙台駅3階にある牛たん通り・すし通りに着きます。";

const ASAICHI_FIND1 = "市場内の食堂やお店で、ここで昼食にするのもおすすめです。";
const ASAICHI_REPLACE1 = "市場内の食堂やお店で昼食にしましょう。";
const ASAICHI_FIND2 = "掘り出し物を探しながら、仙台の食文化を肌で感じてみてください。";
const ASAICHI_REPLACE2 = "掘り出し物を探しながら、仙台の食文化を肌で感じましょう。";

const TSUTSUJIGAOKA_FIND1 = "公園の散策とあわせて、ゆっくりと楽しんでください。";
const TSUTSUJIGAOKA_REPLACE1 = "公園の散策とあわせて、ゆっくりと楽しみましょう。";
const TSUTSUJIGAOKA_FIND2 = "お帰りは、JR仙台駅からご利用ください。";
const TSUTSUJIGAOKA_REPLACE2 = "帰りは、JR仙台駅から帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [ss30, gyutan, asaichi, tsutsujigaoka] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: SS30_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GYUTAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ASAICHI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TSUTSUJIGAOKA_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["SS30(1)", ss30, SS30_FIND],
    ["SS30(2)", ss30, SS30_FIND2],
    ["牛たん通り", gyutan, GYUTAN_FIND],
    ["仙台朝市(1)", asaichi, ASAICHI_FIND1],
    ["仙台朝市(2)", asaichi, ASAICHI_FIND2],
    ["榴岡公園(1)", tsutsujigaoka, TSUTSUJIGAOKA_FIND1],
    ["榴岡公園(2)", tsutsujigaoka, TSUTSUJIGAOKA_FIND2],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newSs30Memo = ss30.memo!.replace(SS30_FIND, SS30_REPLACE_TEXT).replace(SS30_FIND2, SS30_REPLACE2);
  const newGyutanMemo = gyutan.memo!.replace(GYUTAN_FIND, GYUTAN_REPLACE);
  const newAsaichiMemo = asaichi.memo!.replace(ASAICHI_FIND1, ASAICHI_REPLACE1).replace(ASAICHI_FIND2, ASAICHI_REPLACE2);
  const newTsutsujigaokaMemo = tsutsujigaoka.memo!
    .replace(TSUTSUJIGAOKA_FIND1, TSUTSUJIGAOKA_REPLACE1)
    .replace(TSUTSUJIGAOKA_FIND2, TSUTSUJIGAOKA_REPLACE2);

  console.log("=== #77 Day1: 組み直し(瑞鳳殿を先に、仙台城跡を最後に) ===\n");
  console.log("仙台東照宮10:55(35)→輪王寺11:40(30)→大崎八幡宮12:18(35)→宮城県美術館13:06(45)→仙台市博物館14:04(50)→瑞鳳殿15:18(38)→仙台城跡16:30(30、〜17:00)");
  console.log("\n=== Day2: 座標・言葉づかいの直し ===");
  console.log("  新memo(SS30):", newSs30Memo);
  console.log("  新memo(牛たん通り):", newGyutanMemo);
  console.log("  新memo(仙台朝市):", newAsaichiMemo);
  console.log("  新memo(榴岡公園):", newTsutsujigaokaMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: TOSHOGU_ID, data: { visitTime: T(10, 55), stayDurationMin: 35, memo: TOSHOGU_MEMO } },
      { id: RINNOJI_ID, data: { visitTime: T(11, 40), stayDurationMin: 30, memo: RINNOJI_MEMO } },
      { id: OSAKI_ID, data: { visitTime: T(12, 18), stayDurationMin: 35, memo: OSAKI_MEMO } },
      {
        id: BIJUTSUKAN_ID,
        data: {
          visitTime: T(13, 6),
          stayDurationMin: 45,
          memo: BIJUTSUKAN_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 13 }] },
        },
      },
      {
        id: HAKUBUTSUKAN_ID,
        data: {
          visitTime: T(14, 4),
          stayDurationMin: 50,
          lat: 38.2559926,
          lng: 140.8568634,
          memo: HAKUBUTSUKAN_MEMO,
        },
      },
      {
        id: ZUIHODEN_ID,
        data: {
          visitTime: T(15, 18),
          stayDurationMin: 38,
          memo: ZUIHODEN_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 24 }] },
        },
      },
      {
        id: SHIROATO_ID,
        data: {
          visitTime: T(16, 30),
          stayDurationMin: 30,
          lat: 38.2526098,
          lng: 140.8559278,
          memo: SHIROATO_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 34 }] },
        },
      },
    ],
    { remove: [] }
  );

  await prisma.spot.update({
    where: { id: SS30_ID },
    data: { lat: 38.2562944, lng: 140.8783031, memo: newSs30Memo },
  });
  await prisma.spot.update({
    where: { id: GYUTAN_ID },
    data: {
      memo: newGyutanMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
    },
  });
  await prisma.spot.update({
    where: { id: TSUTSUJIGAOKA_ID },
    data: { lat: 38.2609628, lng: 140.8983728, memo: newTsutsujigaokaMemo },
  });
  await prisma.spot.update({ where: { id: ASAICHI_ID }, data: { memo: newAsaichiMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

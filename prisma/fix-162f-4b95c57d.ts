/**
 * #162の続き。企画運営の指摘(決まりA、滞在が時間合わせ)・法務の指摘
 * (亡くなり方の描写・店名・日付・座標)に対応。
 * ①報国寺80分→48分、Day2昼食100分→65分、海蔵寺78分→35分に短縮。
 * ②空いた時間に、Day1は鎌倉宮・荏柄天神社(瑞泉寺と鶴岡八幡宮の間、
 *   いずれも二階堂・西御門エリアで未使用)、Day2は英勝寺・寿福寺
 *   (円覚寺と海蔵寺の間、扇ガ谷エリアで未使用、鎌倉五山第三位の寿福寺)
 *   を追加。
 * ③浄妙寺の文から、境内の店の名前「石窯ガーデンテラス」を削除し、
 *   建物の由来(大正11年築の旧貴族院議員邸)だけを残す書き方に修正。
 * ④法務指摘: 鶴岡八幡宮の大銀杏の文から「3代将軍実朝の暗殺の際に公暁が
 *   隠れていた」(暗殺の場面)を削除し、倒伏とひこばえの事実だけに。
 *   明月院「戦死した」→「亡くなった」。円覚寺の公開時期の具体的な日付
 *   (正月三が日・11月上旬ごろ)を削除。明月院の紫陽花の見頃「6月中旬
 *   ごろ」→「6月ごろ」。
 * ⑤法務指摘: 既存4か所の座標をOSM実点に修正(杉本寺・鶴岡八幡宮・
 *   明月院・円覚寺)。
 *
 * 新しい時刻:
 * Day1(09:30〜16:39、7か所): 報国寺09:30(48)→杉本寺10:24(40)→
 *   浄妙寺11:09(110、昼食含む)→瑞泉寺13:07(75)→鎌倉宮14:32(25)→
 *   荏柄天神社15:00(25)→鶴岡八幡宮15:34(65)
 * Day2(09:30〜16:37、7か所): 明月院09:30(70)→東慶寺10:47(55)→
 *   昼食11:46(65)→円覚寺13:14(90)→英勝寺15:02(35)→寿福寺15:38(35)→
 *   海蔵寺16:21(35) ※時刻は実行時に再計算
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162f-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";
const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PRAYER = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

async function main() {
  const hokokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "報国寺" } });
  const sugimotodera = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "杉本寺" } });
  const jomyoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄妙寺" } });
  const zuisenji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "瑞泉寺" } });
  const tsurugaoka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "鶴岡八幡宮" } });
  const meigetsuin = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "明月院" } });
  const tokeiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "東慶寺" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "北鎌倉駅のまわりで昼食" } });
  const engakuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "円覚寺" } });
  const kaizoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海蔵寺" } });

  if (hokokuji.stayDurationMin === 48) {
    console.log("already applied, skipping");
    return;
  }

  // ---------- Day1 ----------
  await setDaySpotOrder(DAY1_ID, [
    { id: hokokuji.id, data: { stayDurationMin: 48 } },
    {
      id: sugimotodera.id,
      data: {
        visitTime: T(10, 24),
        lat: 35.3226286,
        lng: 139.5674413,
      },
    },
    {
      id: jomyoji.id,
      data: {
        visitTime: T(11, 9),
        memo: jomyoji.memo!.replace(
          "枯山水庭園を眺めながら抹茶をいただける茶堂・喜泉庵や、境内奥の高台にある石窯ガーデンテラス(大正11年に建てられた旧貴族院議員邸を改装した店)では、庭園を眺めながらお昼を楽しむこともできます。",
          "枯山水庭園を眺めながら抹茶をいただける茶堂・喜泉庵のほか、境内奥の高台には、大正11年に建てられた旧貴族院議員邸を改装した食事処もあり、庭園を眺めながらお昼を楽しむこともできます。"
        ),
      },
    },
    {
      id: zuisenji.id,
      data: {
        visitTime: T(13, 7),
        memo: zuisenji.memo!.replace(
          "見学を終えたら、歩いて鶴岡八幡宮へ向かいましょう。",
          "見学を終えたら、歩いて鎌倉宮へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "鎌倉宮",
        address: "鎌倉市二階堂",
        lat: 35.3259307,
        lng: 139.5666833,
        visitTime: T(14, 32),
        stayDurationMin: 25,
        memo: `瑞泉寺から歩いておよそ10分、次に訪れるのは鎌倉宮です。明治2年(1869)、明治天皇の勅命によって創建された、比較的新しい神社です。後醍醐天皇の皇子・護良親王をまつっており、建武の新政で活躍した護良親王が、足利尊氏との対立の末にこの地にあった東光寺に幽閉され、非業の最期を遂げたと伝えられる、その終焉の地に建てられました。境内には、親王が幽閉されたと伝わる土牢も残されています。${PRAYER}見学を終えたら、歩いて荏柄天神社へ向かいましょう。`,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
      },
    },
    {
      create: {
        name: "荏柄天神社",
        address: "鎌倉市西御門",
        lat: 35.3256809,
        lng: 139.5642532,
        visitTime: T(15, 0),
        stayDurationMin: 25,
        memo: `鎌倉宮から歩いて3分ほど、次に訪れるのは荏柄天神社です。社伝によれば長治元年(1104)の創建と伝わる古社で、学問の神様・菅原道真をまつっています。福岡の太宰府天満宮、京都の北野天満宮とあわせて、日本三天神の一つとされています。治承4年(1180)、鎌倉入りした源頼朝が、幕府の鬼門にあたるこの社を守り神として敬ったとも伝えられています。境内には樹齢900年と伝わる大イチョウがそびえるほか、河童の絵を描き続けた漫画家・清水崑ゆかりの絵筆塚もあり、漫画家たちが奉納した河童のレリーフを見ることができます。${PRAYER}見学を終えたら、歩いて鶴岡八幡宮へ向かいましょう。`,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    },
    {
      id: tsurugaoka.id,
      data: {
        visitTime: T(15, 34),
        stayDurationMin: 65,
        lat: 35.3251836,
        lng: 139.5561787,
        memo: tsurugaoka
          .memo!.replace(
            "瑞泉寺から歩いておよそ21分、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。",
            "荏柄天神社から歩いて9分ほど、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。"
          )
          .replace(
            "かつて社殿脇にそびえていた樹齢1000年ともいわれる『大銀杏』は、3代将軍実朝の暗殺の際に公暁が隠れていたという言い伝えから『隠れ銀杏』とも呼ばれていましたが、2010年の強風で倒れてしまいました。",
            "かつて社殿脇にそびえていた、樹齢1000年ともいわれる『大銀杏』は、2010年の強風で倒れてしまいました。"
          ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
      },
    },
  ]);

  // ---------- Day2 ----------
  await setDaySpotOrder(DAY2_ID, [
    {
      id: meigetsuin.id,
      data: {
        lat: 35.3349131,
        lng: 139.5516437,
        memo: meigetsuin
          .memo!.replace(
            "1159年の平治の乱で戦死した首藤(山ノ内)俊通を弔うため",
            "1159年の平治の乱で亡くなった首藤(山ノ内)俊通を弔うため"
          )
          .replace("(見頃は例年6月中旬ごろ)", "(見頃は例年6月ごろ)"),
      },
    },
    { id: tokeiji.id, data: {} },
    { id: lunch2.id, data: { stayDurationMin: 65 } },
    {
      id: engakuji.id,
      data: {
        visitTime: T(13, 14),
        lat: 35.3379364,
        lng: 139.5478197,
        memo: engakuji
          .memo!.replace(
            "見学を終えたら、歩いて海蔵寺へ向かいましょう。",
            "見学を終えたら、歩いて英勝寺へ向かいましょう。"
          )
          .replace(
            "通常は非公開となっており、正月三が日と11月上旬ごろの『宝物風入』の時期に限って、外観のみ特別に公開されます。",
            "通常は非公開となっており、限られた時期だけ外観が公開されます。公開は公式の案内で確かめましょう。"
          ),
      },
    },
    {
      create: {
        name: "英勝寺",
        address: "鎌倉市扇ガ谷",
        lat: 35.3251108,
        lng: 139.5498364,
        visitTime: T(15, 2),
        stayDurationMin: 35,
        memo: `円覚寺から歩いて18分ほど、次に訪れるのは英勝寺です。寛永13年(1636)、徳川家康の側室であったお勝の方(英勝院)が開いた、鎌倉に唯一残る尼寺です。この地は、お勝の方の祖先にあたる太田道灌の屋敷跡と伝えられ、山門の前には「太田道灌邸旧蹟」の碑が立っています。水戸徳川家の姫君が代々住職を務めた格式ある寺で、お勝の方が建立し、水戸藩の初代藩主・徳川頼房が修築したと伝わる仏殿をはじめ、唐門や鐘楼など、神奈川県の文化財に指定された建物が残されています。${PRAYER}見学を終えたら、歩いて寿福寺へ向かいましょう。`,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] },
      },
    },
    {
      create: {
        name: "寿福寺",
        address: "鎌倉市扇ガ谷",
        lat: 35.3243223,
        lng: 139.5501094,
        visitTime: T(15, 38),
        stayDurationMin: 35,
        memo: `英勝寺から歩いてすぐ、次に訪れるのは寿福寺です。正治2年(1200)、源頼朝の妻・北条政子の発願により、禅僧・栄西を開山として建てられた寺で、建長寺・円覚寺に次ぐ鎌倉五山第三位に位置づけられています。この地はもともと頼朝の父・源義朝の屋敷があった場所で、頼朝が鎌倉入りした際に最初に訪れた地とも伝えられています。本堂は非公開ですが、参道の竹林や、山門から本堂へと続く石畳の道を歩くだけでも、禅寺らしい静かな空気を感じられます。境内奥のやぐらには、源実朝と北条政子の墓と伝わる五輪塔も残されています。${PRAYER}見学を終えたら、歩いて海蔵寺へ向かいましょう。`,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: kaizoji.id,
      data: {
        visitTime: T(16, 21),
        stayDurationMin: 35,
        memo: kaizoji.memo!.replace(
          "円覚寺から歩いて13分ほど、1泊2日の旅の最後に訪れるのは海蔵寺です。",
          "寿福寺から歩いて8分ほど、1泊2日の旅の最後に訪れるのは海蔵寺です。"
        ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
      },
    },
  ]);

  console.log("#162続き: 決まりA(時間合わせの滞在)を是正。Day1に鎌倉宮・荏柄天神社を追加(7か所)。Day2に英勝寺・寿福寺を追加(7か所)。浄妙寺の店名を削除");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

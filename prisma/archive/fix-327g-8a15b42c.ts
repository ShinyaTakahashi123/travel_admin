/**
 * #327の続き。企画運営2026-10-01 03:10の指摘: 昼食の枠(遠刈田温泉)が
 * 11:30より前に始まっていた点と、遠刈田温泉を65分に縮めた分を、
 * 神の湯・刈田嶺神社・こけし館・湯神社に少しずつ配り直していた点
 * (決まりA、少しずつでも水増し)。
 *
 * 順番を「酪農センター→神の湯→刈田嶺神社→遠刈田温泉(昼食)→こけし館→
 * 新地こけしの里→青根温泉→湯神社」に組み替え、遠刈田温泉の到着を
 * 11:44(11:30より後)にした。神の湯(40分)・刈田嶺神社(25分)・
 * こけし館(55分)・湯神社(25分)は、前回水増しする前の長さに戻した。
 * 空いた時間は、こけし館のすぐ裏手にある実在の「新地こけしの里」
 * (こけし工人の家が集まる集落、ろくろの実演見学ができる)を新しい
 * スポットとして追加して埋めた。
 *
 * 座標の出典: 新地こけしの里は個別のOSM点が見つからなかったため、
 * GSI住所検索「宮城県蔵王町遠刈田温泉字新地」(140.57048,38.117413、
 * こけし館から約0.5kmの同じ新地地区内)を使用。
 *
 * 事実確認(直接開いて確認): 新地こけしの里は、みやぎ蔵王こけし館の
 * 裏手にある、こけし工人の家が集まる集落。各工人の家でろくろの実演
 * 見学や絵付け体験ができる(家によっては要相談)。
 *
 * 自己チェック: 実行後の再確認で、遠刈田温泉の座標が実際の町の中心
 * (神の湯・刈田嶺神社のあたり)から直線で3.6km離れた別の場所を指して
 * いたのを発見(「近いのに」ではなく逆に「遠いのに近い時間」のため
 * 徒歩速度の不整合として検出された)。Nominatimでバス停「遠刈田温泉
 * (白石上山線)」38.123812,140.577708を見つけ、そちらに修正。
 * 新地こけしの里への移動も、徒歩3分では速すぎたため6分に直した
 * (本文・後続のvisitTimeもあわせて修正)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327g-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "新地こけしの里" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const rakunou = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "蔵王酪農センター" } });
  const kaminoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "神の湯" } });
  const kattamine = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "刈田嶺神社(里宮)" } });
  const toogatta = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "遠刈田温泉" } });
  const kokeshikan = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "みやぎ蔵王こけし館" } });
  const aone = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "青根温泉" } });
  const yujinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "湯神社" } });

  const kaminoyuMemo =
    "蔵王酪農センターからは車でおよそ12分です。神の湯は、平成18年(2006)、老朽化のため廃止された遠刈田福祉センターに代わって整備された、遠刈田温泉の顔ともいえる共同浴場です。昭和初期のこの温泉街には「上の湯」「中の湯」「滝の湯」という3つの共同浴場があり、神の湯という名は、そのひとつ「上の湯」と同じ響きにちなんでつけられたといわれています。観光案内所や足湯も併設されており、旅の合間の休憩にも利用されています。足湯に腰かけて、温泉街の空気をゆっくり感じてみましょう。続いては、歩いてすぐの刈田嶺神社(里宮)へ向かいましょう。";

  const kattamineMemo =
    "神の湯からは歩いてすぐです。刈田嶺神社(里宮)は、蔵王連峰・刈田岳の山頂に立つ刈田嶺神社の里宮です。冬の間は雪深い山頂へのお参りが難しくなるため、ご神体がこちらの里宮に遷されます。石段を上った先の拝殿には、蔵王町の指定文化財となっている絵馬が奉納されており、表情の異なる3対の狛犬も見どころです。静かに、敬意をもってお参りください。続いては、歩いておよそ5分の遠刈田温泉へ向かいましょう。";

  const toogattaMemo =
    "刈田嶺神社からは歩いておよそ5分です。到着したら、まずこのあたりで昼食をとりましょう。遠刈田温泉は、開湯からおよそ400年の歴史を持つ温泉地です。平安時代の末、金山で富を築いた金売吉次という商人がこの地で霊泉を見つけたという言い伝えが残っていますが、実際に温泉が開かれたのは江戸時代の初め頃と考えられています。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つともいわれ、素朴な表情の「遠刈田こけし」は、湯治に訪れた人々へのお土産として発展してきたのだそうです。温泉街には昔ながらの共同浴場や、こけし工人の工房が点在しており、ろくろを挽く音に耳を傾けながら、のんびりと散策を楽しめます。温泉街の風情を味わってみましょう。続いては、歩いておよそ8分のみやぎ蔵王こけし館へ向かいましょう。";

  const kokeshikanMemo =
    "遠刈田温泉からは歩いておよそ8分です。みやぎ蔵王こけし館は、昭和59年(1984)に開館した、伝統こけしの展示館です。遠刈田系をはじめ、東北各地の伝統こけしや木地玩具、あわせておよそ5,500点を展示しており、系統ごとの表情や模様の違いを見比べることができます。併設の工房では、職人による実演の見学のほか、こけしの絵付け体験もでき、自分だけの一本を作ることができます。東北の木地師たちが受け継いできた、素朴で温かみのあるこけしの世界にふれてみましょう。続いては、歩いておよそ6分の新地こけしの里へ向かいましょう。";

  const aoneMemo =
    "新地こけしの里からは車でおよそ12分です。青根温泉は、大永8年(1528)に開湯したと伝わる、山あいの静かな温泉地です。江戸時代には仙台藩主・伊達家の御用達として愛され、藩主専用の湯治場「青根御殿」も置かれていました。伊達政宗がこの地の湯をことのほか気に入り、忘れがたいという思いを込めて名づけたという言い伝えも残っています。杉木立に囲まれた温泉街を歩けば、歴代の藩主たちが愛した静かな湯の里の風情を感じることができます。蔵王の山あいに抱かれた温泉街を、ゆっくりと歩いてみましょう。続いては、歩いておよそ5分の湯神社へ向かいましょう。";

  await setDaySpotOrder(day2.id, [
    { id: rakunou.id, data: {} },
    { id: kaminoyu.id, data: { memo: kaminoyuMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 32)), stayDurationMin: 40, transitMode: "car", transitDurationMin: 12 } },
    { id: kattamine.id, data: { memo: kattamineMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 14)), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 2 } },
    { id: toogatta.id, data: { memo: toogattaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 44)), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, lat: 38.123812, lng: 140.577708 } },
    { id: kokeshikan.id, data: { memo: kokeshikanMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 57)), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 8 } },
    {
      create: {
        name: "新地こけしの里",
        address: "宮城県刈田郡蔵王町遠刈田温泉字新地",
        lat: 38.117413,
        lng: 140.57048,
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 58)),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 6,
        memo:
          "みやぎ蔵王こけし館からは歩いておよそ6分です。新地こけしの里は、こけし館のすぐ裏手に広がる、こけし工人の家々が集まる集落です。工人の家によっては、ろくろを挽いてこけしを削り出す実演を見学できるほか、絵付け体験ができる家もあります。工房の軒先に並んだこけしを眺めながら、静かな集落をゆっくり歩いてみましょう。続いては、車でおよそ12分の青根温泉へ向かいましょう。",
      },
    },
    { id: aone.id, data: { memo: aoneMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 55)), stayDurationMin: 70, transitMode: "car", transitDurationMin: 12 } },
    { id: yujinja.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 10)), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5 } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

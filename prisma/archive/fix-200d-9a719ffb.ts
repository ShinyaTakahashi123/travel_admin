/**
 * #200 9a719ffb の書き直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘「#492 と同じ文を写すのは不可」）
 * 高松塚古墳・亀石・橘寺・石舞台古墳・島庄・酒船石遺跡・飛鳥寺の本文を、同じ出典の別の点・別の言い回しで書き直す（書き出しの分数・注意の定型文はそのまま）
 * 出典: 高松塚 国営飛鳥歴史公園 https://www.asuka-park.jp/area/takamatsuzuka/ （高松塚と中尾山の2つの古墳・男女群像の壁画・模写壁画を見られる壁画館・星宿をモチーフにした広場）／
 *   亀石 奈良県立図書館 https://www.library.pref.nara.jp/nara_2010/0214.html （用途は境界石説など諸説）／
 *   橘寺 古都飛鳥保存財団 https://www.asukabito.or.jp/spot_17.html （仏頭山北麓・聖徳太子建立七大寺の1つ・中門・塔・金堂・講堂がほぼ東西に並ぶ・多量の塼仏）／
 *   石舞台古墳 国営飛鳥歴史公園 https://www.asuka-park.jp/area/ishibutai/tumulus/ （わが国最大級の方墳・盛土が全く残らない・天井石が舞台のよう・岩の総重量約2300トン・天井石約77トン）／
 *   島庄の昼食 https://www.asukadeasobo.jp/visit/yumeichi/ （石舞台古墳西隣・村産の野菜や古代米の料理・とれたての野菜や手づくり小物）／
 *   酒船石遺跡 明日香村 https://www.asukamura.jp/gyosei_bunkazai_shitei_1_sakafune2.html （伝飛鳥板蓋宮跡の東・砂岩の石垣が斉明紀の記事に符合・両槻宮ではないかとも）／
 *   飛鳥寺 祈りの回廊 https://inori.nara-kankou.or.jp/inori/special/40shakanyorai/ （蘇我馬子が物部氏を破り法興寺を造立し始めたと日本書紀に）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-200d-9a719ffb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "9a719ffb-4a30-415f-bf49-b86c4c744759";
const COMMIT = process.argv.includes("--commit");
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BIKE = "自転車は車に気をつけて、交通ルールを守って走りましょう。";
const TOMB = "古墳はお墓でもありますので、静かに見学しましょう。";

const MEMOS: Record<string, [string, string]> = {
  高松塚古墳: ["1972年に極彩色の壁画が見つかって",
    "この旅は自転車でめぐります。近鉄飛鳥駅前のレンタサイクルの営業所で自転車を借りて、約10分の高松塚古墳へ。国営飛鳥歴史公園の高松塚周辺地区には、高松塚と中尾山の2つの古墳があります。高松塚古墳は男女の群像を描いた壁画で知られ、壁画そのものは保存のため石室ごと取り出されていてふだんは見られませんが、古墳のそばの壁画館で模写を見られます。公園には、壁画に描かれた星宿をモチーフにした広場もあります。" + TOMB + BIKE],
  亀石: ["長さおよそ3.6mの花崗岩に",
    "天武・持統天皇陵から自転車で東へ約5分。田畑のそばにある花崗岩の石造物で、亀に似たどこかユーモラスな顔が彫られています。田の境を示す石だったという説など、何のために造られたのかには諸説あり、はっきりとは分かっていません。"],
  橘寺: ["聖徳太子が生まれたと伝えられる地で",
    "亀石から自転車で東へ約5分。仏頭山の北のふもとにある、聖徳太子が建てたと伝わる七大寺の一つです。発掘調査では、中門・塔・金堂・講堂がほぼ東西に一列に並んでいたことが分かり、仏堂を飾っていたとみられるたくさんの塼仏も見つかっています。" + RESPECT],
  石舞台古墳: ["一辺およそ50mの方墳で",
    "橘寺から自転車で東へ約10分。国営飛鳥歴史公園の石舞台地区の中心にある、日本最大級の方墳です。盛り土がまったく残らず、巨大な横穴式の石室がむき出しになっていて、天井の石の上が広く平らで舞台のように見えることから、古くから「石舞台」と呼ばれてきました。30あまりの岩の重さは合わせて約2300トン、天井の石だけで約77トンあるとされ、当時の土木や運ぶ技術の高さがうかがえます。2026年には世界遺産「飛鳥・藤原の宮都」の構成資産になりました。石室の中にも入れます。" + TOMB],
  島庄: ["地元の野菜や古代米を使った料理を出す農村レストランと",
    "石舞台古墳の西どなりにある農村レストランでは、明日香村でとれた野菜や古代米を使った、四季の食材の料理を味わえます。となりには、とれたての野菜や果物、手づくりの小物を並べた店もあります。ここで昼食にしましょう。"],
  酒船石遺跡: ["7世紀中ごろに造られたとみられる祭祀の遺跡で",
    "岡寺から自転車で北へ約5分。伝飛鳥板蓋宮跡の東にある丘で、謎の石造物「酒船石」が残ります。丘では砂岩を積んだ石垣が見つかっていて、『日本書紀』の斉明天皇の時代の「宮の東の山に石を累ねて垣とす」という記事に合うことから、斉明天皇の「両槻宮」ではないかとも考えられています。丘への坂道では足元に気をつけましょう。"],
  飛鳥寺: ["蘇我馬子の発願で建てられた、日本で最初の本格的な仏教寺院と伝えられます。",
    "万葉文化館から自転車ですぐ。『日本書紀』には、仏教を受け入れるかをめぐる争いのあと、蘇我馬子が法興寺（飛鳥寺）を造り始めたと記されています。本尊の釈迦如来坐像は「飛鳥大仏」と呼ばれ、日本最古級の仏像の一つとして親しまれています。" + RESPECT +
      "見学のあとは、自転車で約15分の近鉄橿原神宮前駅の東口にある営業所で自転車を返し、近鉄で帰りましょう。借りた営業所と別の所で返せますが、返す時間は公式の案内で確かめておきましょう。"],
};

async function main() {
  const plan: { id: string; name: string; memo: string }[] = [];
  for (const [name, [mark, memo]] of Object.entries(MEMOS)) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(mark)) throw new Error(`${name}: 本文が想定と違います`);
    if (name !== "島庄" && name !== "高松塚古墳" && !s.memo.startsWith(memo.slice(0, 12))) throw new Error(`${name}: 書き出しが想定と違います`);
    plan.push({ id: s.id, name, memo });
    console.log(`\n${name}: ${memo}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const p of plan) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: p.id }, { memo: p.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

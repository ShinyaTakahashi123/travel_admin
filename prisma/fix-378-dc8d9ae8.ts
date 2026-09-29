/**
 * チェックリスト #378 dc8d9ae8「池間大橋と来間大橋、宮古島の橋めぐりを楽しむ1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 池間大橋から宮古島の北部、伊良部大橋を渡って伊良部島・下地島へ（10か所 09:00〜16:45）
 * 2日目: 来間大橋から来間島・与那覇前浜、市街の博物館・植物園、南東のうえのドイツ文化村・東平安名崎へ（7か所 09:00〜16:45）
 * 既存の池間大橋(1日目)・来間大橋(2日目)はIDのまま直す。説明文の更新と2日分の並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-378-dc8d9ae8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "dc8d9ae8-acd1-48d8-9360-d6acfc7b9cd5";
const DAY1_ID = "aa204010-7162-469a-b084-d99fad938767";
const DAY2_ID = "7945d848-1794-4f1e-841c-b4cbe948014e";
const IKEMA_ID = "15228531-e154-47ec-9909-d789b6383451";
const KURIMA_ID = "5fe9bbf5-9c69-4ee6-9856-88633e9c65b1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "エメラルドグリーンの海を渡る宮古島の大きな橋をめぐる1泊2日。1日目は池間大橋から北部の岬やマングローブ林をたどり、伊良部大橋を渡って伊良部島・下地島へ。2日目は来間大橋を渡って来間島の展望台へ上り、島の歴史にふれる博物館や、南東の東平安名崎まで足を延ばします。旅の足はレンタカーです。";

const MEMO_IKEMA =
  "宮古空港から車で約30分。宮古島と池間島を結ぶ池間大橋は、総工費99億円をかけて1992年2月に開通した全長1,425mの橋です。橋の上から見下ろす海は、浅いところの明るいエメラルドグリーンから、深いところの濃い青へと色が移り変わり、渡るだけでも気持ちのよい眺めです。池間島側まで渡ってから振り返ると、海に弧を描く橋の全体を見渡せます。橋の上には車を止めず、たもとの駐車できる場所から眺めましょう。今日は宮古島の北部をめぐり、午後は伊良部大橋を渡って伊良部島へ向かいます。";

const MEMO_KURIMA =
  "2日目は、宮古島の南西、下地の与那覇と来間島を結ぶ来間大橋からスタートです。1995年3月に開通した全長1,690mの橋で、島の人たちの暮らしを支える道として架けられました。橋の上から眺めるエメラルドグリーンの海は、昨日の池間大橋・伊良部大橋とはまた違う色合いに見えるかもしれません。渡りきった来間島の高台からは、この橋と与那覇前浜の白い砂浜を見下ろせます。橋の上には車を止めず、たもとの駐車できる場所から眺めましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; mode?: string; lat: number; lng: number; address: string; memo: string };

const D1: NewSpot[] = [
  {
    name: "西平安名崎", h: 9, m: 45, stay: 30, dur: 5, lat: 24.91023, lng: 125.25521, address: "沖縄県宮古島市平良狩俣",
    memo:
      "池間大橋のたもとから車で約5分、宮古島の北西の端に突き出た岬です。先端に向かって右手に池間大橋、左手に伊良部島を一望でき、宮古島の自然を象徴する眺めといわれます。風が強く抜ける場所なので、帽子や荷物が飛ばされないように気をつけ、岬の先の岩場では足元に注意しましょう。",
  },
  {
    name: "雪塩ミュージアム", h: 10, m: 20, stay: 30, dur: 5, lat: 24.90221, lng: 125.26821, address: "沖縄県宮古島市平良狩俣",
    memo:
      "西平安名崎から車で約5分。宮古島の地下からくみ上げた海水で、粉雪のようにさらさらとした塩「雪塩」をつくる製塩所に併設された施設です。サンゴの石灰岩でできた島の地下には、石灰岩の成分を含んだ海水がしみ込んでいて、その水をくみ上げる様子をガラス越しに見たり、塩ができるまでの流れをパネルで学んだりできます。売店では、雪塩をかけて味わうソフトクリームも人気です。",
  },
  {
    name: "島尻マングローブ林", h: 11, m: 0, stay: 30, dur: 10, lat: 24.877547, lng: 125.288597, address: "沖縄県宮古島市平良島尻",
    memo:
      "雪塩ミュージアムから車で約10分、宮古諸島で最大規模とされるマングローブ林です。入り江の水辺には、ヤエヤマヒルギやヒルギダマシなど5種類のマングローブが見られ、潮の満ち引きで水に浸かる根元から、たくさんの根が足のように伸びるようすを間近に観察できます。整えられた遊歩道から外れず、干潟の生き物をそっと眺めましょう。",
  },
  {
    name: "宮古島海中公園", h: 11, m: 35, stay: 75, dur: 5, lat: 24.87875, lng: 125.27472, address: "沖縄県宮古島市平良狩俣2511-1",
    memo:
      "マングローブ林から車で約5分。海に面した岩場の下に、海中を観察できる施設がある公園です。24枚の窓から、水深3〜5mの海の中を泳ぐ熱帯の魚たちを、濡れずにのぞくことができます。施設には、宮古島の食材を使ったメニューのあるカフェもあるので、ここで昼食にしましょう。",
  },
  {
    name: "砂山ビーチ", h: 13, m: 5, stay: 45, dur: 15, lat: 24.83938, lng: 125.28061, address: "沖縄県宮古島市平良荷川取",
    memo:
      "海中公園から車で約15分。名前のとおり、白い砂の小高い丘を越えた先に広がる砂浜です。隆起したサンゴ礁でできた岩と、真っ白な砂、青い海の組み合わせが美しく、宮古島を代表するビーチの一つです。波の浸食でできた岩のアーチで知られますが、落石や崩れのおそれがあるため、2018年からアーチの手前に柵が設けられ、まわりは立入禁止になっています。柵の中には入らず、少し離れた場所から眺めましょう。西寄りの風の日は波が高くなり、沖には急に深くなる場所もあるので、海に入るときは沖へ出ないようにしましょう。",
  },
  {
    name: "伊良部大橋", h: 14, m: 5, stay: 20, dur: 15, lat: 24.798567, lng: 125.235957, address: "沖縄県宮古島市",
    memo:
      "砂山ビーチから車で約15分、宮古島と伊良部島を結ぶ伊良部大橋を渡ります。2006年に工事が始まり、2015年1月31日に開通した全長3,540mの大きな橋です。それまで伊良部島・下地島へは船で渡るしかなく、島の人たちが長く待ち望んだ橋でした。ゆるやかに上り下りする橋の上からは、両側に広がる海の色の違いを楽しめます。橋の上には車を止めず、渡った先のたもとで海と橋を振り返りましょう。",
  },
  {
    name: "牧山展望台", h: 14, m: 35, stay: 30, dur: 10, lat: 24.81778, lng: 125.21832, address: "沖縄県宮古島市伊良部",
    memo:
      "伊良部大橋を渡って車で約10分、伊良部島でいちばん高い場所にある展望台です。白い建物は、伊良部の町のシンボルとされてきた渡り鳥・サシバが羽を広げて飛ぶ姿をかたどっています。ここからは宮古島や来間島、池間島などの島々と、伊良部大橋・池間大橋・来間大橋の3つの橋を見渡せるといわれます。今日渡ってきた橋を、上から探してみましょう。",
  },
  {
    name: "渡口の浜", h: 15, m: 15, stay: 45, dur: 10, lat: 24.81154, lng: 125.18, address: "沖縄県宮古島市伊良部伊良部",
    memo:
      "牧山展望台から車で約10分。伊良部島の南側に、ゆるやかな弓なりの白い砂浜が続くビーチです。遠浅の海はおだやかな日が多く、砂浜を歩きながら、エメラルドグリーンから青へと移り変わる海の色を楽しめます。海に入るときは、天気や波の状況を確かめ、無理をしないようにしましょう。",
  },
  {
    name: "下地島の通り池", h: 16, m: 15, stay: 35, dur: 15, lat: 24.8242, lng: 125.13628, address: "沖縄県宮古島市伊良部佐和田",
    memo:
      "渡口の浜から車で約15分、伊良部島と水路をはさんで隣り合う下地島にある、2つの丸い池です。琉球石灰岩の中にできた、海とつながる鍾乳洞の天井が2か所で崩れ落ちてできたと考えられ、2つの池は地下で、さらに海ともつながっています。このような地形は全国でも珍しく、2006年に国の名勝と天然記念物に指定されました。人の顔をした魚を釣り上げた漁師の家が、大波にのまれて池になったという伝説も残ります。池のまわりの岩場は足元が悪く、柵の外は危険なので近づかないようにしましょう。今夜は伊良部島や宮古島の宿へ向かいます。",
  },
];

const D2: NewSpot[] = [
  {
    name: "竜宮城展望台", h: 9, m: 45, stay: 30, dur: 5, lat: 24.72604, lng: 125.25167, address: "沖縄県宮古島市下地来間",
    memo:
      "来間大橋を渡って車で約5分、来間島の高台に立つ、竜宮城をかたどった3階建ての展望台です。目の前には与那覇前浜の白い砂浜、左右には来間大橋や伊良部島が広がり、砂地とサンゴが織りなす海の色のグラデーションを見下ろせます。階段の上り下りは足元に気をつけましょう。",
  },
  {
    name: "与那覇前浜", h: 10, m: 25, stay: 60, dur: 10, lat: 24.73598, lng: 125.26301, address: "沖縄県宮古島市下地与那覇",
    memo:
      "来間大橋を宮古島側へ戻って車で約10分。竜宮城展望台から見下ろした白い砂浜を、今度は歩いてみましょう。遠くまで続く白い砂浜と、来間大橋を背にした遠浅の海が広がる、宮古島を代表するビーチの一つです。はだしで歩くと、砂のきめの細かさに驚くかもしれません。海に入るときは、天気や波の状況を確かめ、無理をしないようにしましょう。",
  },
  {
    name: "宮古島市熱帯植物園・体験工芸村", h: 11, m: 50, stay: 80, dur: 25, lat: 24.80059, lng: 125.3162, address: "沖縄県宮古島市平良東仲宗根添",
    memo:
      "与那覇前浜から車で約25分、市街の東の丘に広がる熱帯植物園です。南国の木々や花が茂る園内を歩けるほか、園内の体験工芸村には、島ぞうり、陶芸、貝がら細工、宮古の織物など、島の手仕事を体験できる工房が並びます。工芸村の中には、宮古そばなどを味わえる食事処もあるので、ここで昼食にしましょう。工房の体験は予約が必要なことがあるので、公式の案内で確かめてください。",
  },
  {
    name: "宮古島市総合博物館", h: 13, m: 15, stay: 60, dur: 5, lat: 24.79693, lng: 125.31769, address: "沖縄県宮古島市平良東仲宗根添",
    memo:
      "熱帯植物園のとなり、1989年に開館した博物館です。考古・歴史、民俗、自然、美術工芸の4つの分野から、宮古の島々の歩みを紹介しています。長いあいだ島の人々を苦しめた人頭税と、その廃止を求めた人々の運動の資料や、細い糸で織り上げる宮古上布の作業のようすなど、島の暮らしと文化を知ることができます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "うえのドイツ文化村", h: 14, m: 40, stay: 60, dur: 25, lat: 24.71913, lng: 125.32428, address: "沖縄県宮古島市上野宮国775-1",
    memo:
      "博物館から車で約25分。明治のはじめ、台風で宮古島の沖に座礁したドイツの商船ロベルトソン号の乗組員を、島の人々が救い、手厚く世話をしたことが始まりの、ドイツと宮古島の友好を伝える公園です。この出来事に心を動かされたドイツ皇帝ヴィルヘルム1世は、1876年に軍艦を送り、島の人々の博愛の心をたたえる記念碑を建てたと伝えられます。園内には、ドイツの古城マルクスブルグ城を、見取り図をもとに再現した博愛記念館や、ドイツのおもちゃを展示するキンダーハウスがあります。",
  },
  {
    name: "東平安名崎", h: 16, m: 5, stay: 40, dur: 25, lat: 24.71881, lng: 125.46914, address: "沖縄県宮古島市城辺保良",
    memo:
      "うえのドイツ文化村から車で約25分、宮古島の南東の端から、紺碧の海に向かっておよそ2kmにわたって細長く突き出た岬です。国の名勝に指定され、日本の都市公園100選にも選ばれています。先端の平安名埼灯台は中に上ることができ、東シナ海と太平洋を見渡せるといわれます。灯台に上れる時間は季節で変わるので、公式の案内で確かめましょう。岬の遊歩道から外れず、崖の近くには寄らないようにしましょう。2日間の橋めぐりの締めくくりに、島の端から広い海を眺めましょう。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode ?? "car", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== IKEMA_ID || days[1].spots.map((s) => s.id).join() !== KURIMA_ID) throw new Error("既存スポットが想定と違います");

  const day1 = [
    { id: IKEMA_ID, data: { visitTime: t(9, 0), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 24.920405, lng: 125.26078, memo: MEMO_IKEMA } },
    ...D1.map(toCreate),
  ];
  const day2 = [
    { id: KURIMA_ID, data: { visitTime: t(9, 0), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 24.725401, lng: 125.262768, memo: MEMO_KURIMA } },
    ...D2.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${gap} ${"id" in x ? (x.id === IKEMA_ID ? "池間大橋(既存)" : "来間大橋(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

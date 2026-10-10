/**
 * チェックリスト #387 ea38491a「熊本市現代美術館と下通アーケード、街なかアート散策1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 熊本城 → 加藤神社 → 熊本県伝統工芸館 → 桜の馬場 城彩苑（昼食）→ 熊本市現代美術館 → 上通 → 藤崎八旛宮（7か所 09:00〜16:30）
 * 2日目: 水前寺成趣園 → サクラマチクマモト → 下通アーケード（昼食）→ 熊本博物館 → 熊本県立美術館（5か所 09:00〜16:30）
 * 既存の現代美術館(1日目)・下通(2日目)はIDのまま直す。説明文の更新と2日分の並べ替えを1つのトランザクションで行う
 * 座標の出典: OSM/Overpass（加藤神社 32.80712,130.70502／桜の馬場城彩苑 32.80361,130.70345／現代美術館 32.80324,130.71094／上通 32.80449,130.71094／藤崎八旛宮 32.80835,130.71853／水前寺成趣園 32.79093,130.73494／下通 32.80098,130.70877）、
 *   Nominatim（伝統工芸館 32.8075629,130.706923／SAKURA MACHI Kumamoto 32.8000972,130.7040507）、国土地理院（熊本博物館 32.808625,130.699325／熊本県立美術館 32.807473,130.700575）、
 *   熊本城は確認済みの公開中しおりの値（32.806028,130.705897）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-387-ea38491a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ea38491a-1d85-432a-b2ed-6687d493e6ef";
const DAY1_ID = "3afaaccb-7823-4880-b9ab-2ae68192c04d";
const DAY2_ID = "5aa7acd2-ba89-4b03-aa6e-72238e73e8bd";
const CAMK_ID = "d458be04-606a-4bdb-920e-fa301d3cf0a8";
const SHIMO_ID = "c0cf3c6f-e047-4497-9e17-8286d03eccf2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "熊本城と城下の神社・工芸館をめぐり、現代アートの美術館と上通のアーケードへ歩く1日目。2日目は大名庭園の水前寺成趣園から、新しい街の顔サクラマチクマモト、下通のアーケード、熊本の歴史と美術を伝える博物館・美術館へ。熊本の街なかを市電と徒歩で楽しむ1泊2日です。";

const MEMO_CAMK =
  "城彩苑から歩いて約20分、通町筋と上通が交わる角のビルにある美術館です。熊本出身の洋画家・井手宣通の遺族から熊本市に作品が寄贈されたことをきっかけに構想が生まれ、2002年に開館しました。館内には、ジェームズ・タレルやマリーナ・アブラモヴィッチ、草間彌生、宮島達男など、国際的に活躍する作家の作品が常設で展示され、井手宣通の作品を紹介する記念ギャラリーもあります。街なかでふらりと立ち寄れる美術館として、アートにふれてみましょう。休館日があるので、公式の案内で確かめてから訪れましょう。";

const MEMO_SHIMO =
  "サクラマチクマモトから歩いて約10分。全長およそ511m、幅・高さともにおよそ15mの大きなアーケード商店街です。昭和のはじめ、熊本城の城下町の南側に広がる形で商店街として整い始め、戦後の復興をへて今の姿に発展しました。新天街から2番街・3番街・4番街と続く通りには、百貨店や衣料品店、カフェ、地元の飲食店が並び、熊本を代表するにぎわいを見せています。2009年には、夏の暑さをやわらげるため、屋根が紫外線をさえぎる樹脂のパネルに張り替えられました。ここで昼食にしましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode?: string; dur?: number; line?: string; lat: number; lng: number; address: string; memo: string };

const D1_BEFORE: NewSpot[] = [
  {
    name: "熊本城", h: 9, m: 0, stay: 90, lat: 32.806028, lng: 130.705897, address: "熊本県熊本市中央区本丸1-1",
    memo:
      "JR熊本駅から市電で約15分、熊本城・市役所前で降りて歩いて城へ。加藤清正が茶臼山と呼ばれた台地に、当時の最新の技術を注いで慶長12年（1607年）に完成させたと伝わる城です。2016年の熊本地震で大きな被害を受けましたが、天守閣は2021年に復旧を終え、内部の公開が再開されました。天守閣の中では、城の歴史や地震からの復旧の歩みを知ることができます。城全体の復旧は今も続いているので、見学できる範囲は公式の案内で確かめましょう。石垣の上や天守閣の階段では、足元に気をつけて歩きましょう。",
  },
  {
    name: "加藤神社", h: 10, m: 35, stay: 30, mode: "walk", dur: 5, lat: 32.80712, lng: 130.70502, address: "熊本県熊本市中央区本丸2-1",
    memo:
      "熊本城の本丸から歩いてすぐ、城の中にある神社です。熊本城を築いた加藤清正をまつり、熊本の人々に「清正公さん」と親しまれてきました。清正は、城づくりだけでなく、川の治水や新田の開発などで熊本の町の土台を築いた人物として、今も慕われています。境内からは、復旧を終えた天守閣の姿を間近に望めます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "熊本県伝統工芸館", h: 11, m: 15, stay: 45, mode: "walk", dur: 10, lat: 32.807563, lng: 130.706923, address: "熊本県熊本市中央区千葉城町3-35",
    memo:
      "加藤神社から歩いて約10分、熊本城のすぐそばにある工芸館です。1982年に開館し、県内の伝統的な工芸品を展示・紹介しています。熊本の暮らしの中で受け継がれてきた手仕事の技と美しさにふれ、気に入った品をおみやげに選ぶこともできます。城を歩いたあとに、城下で受け継がれてきた職人の技を知ると、町の見え方も変わってきます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "桜の馬場 城彩苑", h: 12, m: 15, stay: 60, mode: "walk", dur: 15, lat: 32.80361, lng: 130.70345, address: "熊本県熊本市中央区二の丸1-1",
    memo:
      "工芸館から城の南側へ歩いて約15分、2011年3月に開業した、熊本城のふもとの観光施設です。城下町の町並みを再現した「桜の小路」には、熊本の郷土料理や名物を味わえる店やおみやげの店が並び、ここで昼食にしましょう。熊本城の歴史を映像や展示で楽しめる「湧々座」もあり、午前中に歩いた城の見どころをふり返ることができます。",
  },
];

const D1_AFTER: NewSpot[] = [
  {
    name: "上通アーケード", h: 14, m: 50, stay: 50, mode: "walk", dur: 5, lat: 32.80449, lng: 130.71094, address: "熊本県熊本市中央区上通町",
    memo:
      "現代美術館を出てすぐ、北へ延びるアーケード街です。全長およそ600m、幅11mで、パリのオルセー美術館をイメージしたという高い天井の白いアーケードが特徴です。古くからの書店や専門店、カフェなどが並び、アーケードの先には、並木の続く並木坂の通りも続きます。落ち着いた雰囲気の中で、ゆっくり歩いてみましょう。",
  },
  {
    name: "藤崎八旛宮", h: 15, m: 55, stay: 35, mode: "walk", dur: 15, lat: 32.80835, lng: 130.71853, address: "熊本県熊本市中央区井川淵町3-1",
    memo:
      "並木坂から歩いて約15分。承平5年（935年）、藤原純友の乱の鎮圧と九州の守りを祈って、京都の石清水八幡宮から迎えてまつられたと伝えられる神社で、熊本の人々に「藤崎宮」と親しまれてきました。熊本の総鎮守として大切にされ、秋の例大祭は熊本の大きな祭りとして知られます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。今夜は熊本の街なかの宿へ。",
  },
];

const D2_FIRST: NewSpot = {
  name: "水前寺成趣園", h: 9, m: 0, stay: 60, lat: 32.79093, lng: 130.73494, address: "熊本県熊本市中央区水前寺公園8-1",
  memo:
    "2日目は、熊本の街なかから市電で水前寺公園へ。寛永13年（1636年）ごろ、熊本藩の初代藩主・細川忠利がこの地に茶屋を設けたのが始まりで、細川家3代・約80年をかけて整えられた回遊式の大名庭園です。池のまわりに築山を配した景色は、東海道五十三次の風景を模したともいわれ、富士山をかたどったといわれる築山が見どころです。国の名勝と史跡に指定され、園内には歴代の細川家の藩主をまつる出水神社もあります。神社では静かに、敬意をもってお参りしましょう。",
};

const D2_AFTER: NewSpot[] = [
  {
    name: "熊本博物館", h: 13, m: 25, stay: 90, mode: "walk", dur: 25, lat: 32.808625, lng: 130.699325, address: "熊本県熊本市中央区古京町3-2",
    memo:
      "下通から熊本城の西側の三の丸へ歩いて約25分。熊本の自然・歴史・民俗などを幅広く紹介する市立の博物館で、大規模な改修をへて2018年12月にリニューアルオープンしました。熊本の大地の成り立ちから、城下町の暮らし、近代の歩みまで、熊本の姿を一度にたどれます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "熊本県立美術館", h: 15, m: 0, stay: 90, mode: "walk", dur: 5, lat: 32.807473, lng: 130.700575, address: "熊本県熊本市中央区二の丸2",
    memo:
      "熊本博物館から歩いてすぐ、熊本城の二の丸にある美術館です。1976年に開館し、建物はル・コルビュジエに学んだ建築家・前川國男の設計です。熊本を治めた細川家に伝わる美術工芸品や古文書を紹介する「細川コレクション 永青文庫展示室」があり、城下の歴史と美術を結びつけて楽しめます。休館日があるので、公式の案内で確かめてから訪れましょう。2日間の街なか散策はここで締めくくりです。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode ?? null, transitDurationMin: s.dur ?? null, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== CAMK_ID || days[1].spots.map((s) => s.id).join() !== SHIMO_ID) throw new Error("既存スポットが想定と違います");

  const day1 = [
    ...D1_BEFORE.map(toCreate),
    { id: CAMK_ID, data: { visitTime: t(13, 35), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 32.80324, lng: 130.71094, memo: MEMO_CAMK } },
    ...D1_AFTER.map(toCreate),
  ];
  const day2 = [
    toCreate(D2_FIRST),
    toCreate({
      name: "サクラマチクマモト", h: 10, m: 30, stay: 60, mode: "train", dur: 30, line: "熊本市電（水前寺公園→辛島町）", lat: 32.800097, lng: 130.704051, address: "熊本県熊本市中央区桜町3-10",
      memo:
        "水前寺公園から市電で辛島町へ、降りてすぐです。2019年9月、熊本交通センターの跡地の再開発で生まれた複合施設で、大きなバスターミナルと商業施設、ホテルなどが入っています。屋上には、熊本城を望む庭園が整えられていて、街なかで緑の中をひと休みできます。熊本の新しい街の顔を歩いてみましょう。",
    }),
    { id: SHIMO_ID, data: { visitTime: t(11, 40), stayDurationMin: 80, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 32.80098, lng: 130.70877, memo: MEMO_SHIMO } },
    ...D2_AFTER.map(toCreate),
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
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === CAMK_ID ? "熊本市現代美術館(既存)" : "下通アーケード(既存)") : d.name} ${String(d.memo).length}字`);
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

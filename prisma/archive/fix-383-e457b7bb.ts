/**
 * チェックリスト #383 e457b7bb「屋島とサンポート高松、絶景の古戦場と港町を巡る1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 屋島（屋島寺・談古嶺・やしまーる・獅子の霊巌）→ふもとの四国村ミウゼアム→源平屋島古戦場（6か所 09:00〜16:30）
 * 2日目: 高松の港町（サンポート高松・せとしるべ・高松城跡・北浜alley・香川県立ミュージアム・高松中央商店街・栗林公園、7か所 09:00〜16:50）
 * 既存の屋島(1日目)・サンポート高松(2日目)はIDのまま直す。説明文の更新と2日分の並べ替えを1つのトランザクションで行う
 * 座標の出典: 国土地理院（屋島寺・四国村・香川県立ミュージアム）、OSM/Nominatim（談古嶺・やしまーる・獅子の霊巌・高松シンボルタワー・せとしるべ・北浜アリー・高松城・高松丸亀町壱番街前ドーム広場）、
 *   OSMのバス停「祈り岩・与一公園前」（源平屋島古戦場。祈り岩はバス停の目の前、施設の点がないため。企画運営の判断 09-29）、
 *   確認済みの公開中しおりの値（栗林公園 34.330333,134.044403）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-383-e457b7bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e457b7bb-1646-40b7-b126-22c06d29f51d";
const DAY1_ID = "1e0c10ef-4ceb-4fd0-81e7-cfdc2e7a9877";
const DAY2_ID = "3bf0a847-bffb-41fb-b1e3-f4e8a68ddc03";
const YASHIMA_ID = "6d479c8b-194c-4f40-b0cd-8612c2d0866d";
const SUNPORT_ID = "2035000b-7968-496a-85ca-0fab4365acaa";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "源平合戦の古戦場として知られる屋島で、山上のお寺や展望台から瀬戸内海を見渡し、ふもとの四国村と古戦場の史跡をめぐる1日目。2日目は港町・高松で、赤い灯台や海の水を引いた高松城跡の堀、倉庫を生かした北浜alley、長いアーケードの商店街を歩き、最後に栗林公園へ。旅の足は電車・バス・徒歩です。";

const MEMO_YASHIMA =
  "屋島寺から歩いて約10分、山上の北側に向かう途中の展望台・談古嶺です。屋島は、およそ1400万年前の火山活動で流れ出た溶岩が硬い屋根のように残り、まわりが削られてできた、上が平らな台地の山といわれ、屋根のような形が名前の由来とされています。談古嶺という名は「古（いにしえ）を談じる峰」という意味で、明治30年（1897年）にここを訪れた尼僧が、屋島の戦いをしのんで名づけたと伝えられます。眼下には、元暦2年（1185年）の屋島の戦いの舞台となった入り江が広がり、那須与一が波間に揺れる扇の的を射抜いた話の舞台を見下ろせます。崖の近くには寄らず、柵の内側から眺めましょう。";

const MEMO_SUNPORT =
  "2日目は港町・高松を歩きます。JR高松駅からすぐのサンポート高松は、瀬戸大橋の開通で宇高連絡船がなくなったあと、港の玄関口としての役割を取り戻そうと、香川県と高松市が進めた再開発で生まれた港のエリアです。2004年に完成した高松シンボルタワーを中心に、ホテルや広場、海沿いの遊歩道が整えられています。女木島や直島などの島々へ向かう船が発着する港を眺めながら、海沿いを歩いてみましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const D1_FIRST: NewSpot = {
  name: "屋島寺", h: 9, m: 0, stay: 60, mode: "", dur: 0, lat: 34.361336, lng: 134.101131, address: "香川県高松市屋島東町1808",
  memo:
    "琴電屋島駅から屋島山上シャトルバスで山上へ。四国八十八ヶ所の第84番札所です。奈良時代、都へ向かう途中の鑑真がこの地を訪れ、北の峰に堂を建てたのが始まりと伝えられ、のちに弘法大師が南の峰の今の場所に移したといわれます。朱と黒の色合いが美しい本堂は鎌倉時代のもので、国の重要文化財に指定され、昭和の修理で鎌倉時代の姿に戻されました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
};

const D1: NewSpot[] = [
  {
    name: "やしまーる", h: 10, m: 50, stay: 60, mode: "walk", dur: 10, lat: 34.358368, lng: 134.098925, address: "香川県高松市屋島東町",
    memo:
      "談古嶺から歩いて約10分。2022年8月、瀬戸内国際芸術祭の夏の会期に合わせて開館した、屋島山上の交流拠点の施設です。地形に沿って曲がりながら延びる、長さ約200mの回廊のような建物で、屋根には地元産の庵治石が使われ、光の当たり方で色が変わって見えます。源平合戦をテーマにしたパノラマのアート作品の展示や、高松の町と瀬戸内海の島々を見渡せる窓辺があり、屋島の歴史と景色を一度に楽しめます。",
  },
  {
    name: "獅子の霊巌", h: 11, m: 55, stay: 70, mode: "walk", dur: 5, lat: 34.358105, lng: 134.098629, address: "香川県高松市屋島東町",
    memo:
      "やしまーるのすぐそば、屋島の南の峰の、高松港に面した崖の上にある展望台です。展望台の下の岩が、海に向かって吠える獅子のように見えることから、この名で呼ばれています。眼下には島々へ向かう船が出入りする高松港と市街地が広がり、その先には瀬戸内海の島々が浮かびます。まわりには山上の茶屋や食事処もあるので、景色を楽しみながら昼食にしましょう。崖の近くでは柵の内側から眺めましょう。",
  },
  {
    name: "四国村ミウゼアム", h: 13, m: 40, stay: 90, mode: "bus", dur: 35, line: "屋島山上シャトルバス（山上→琴電屋島駅。駅から徒歩約10分）",
    lat: 34.345848, lng: 134.108584, address: "香川県高松市屋島中町91",
    memo:
      "シャトルバスで山を下り、屋島のふもとへ。約5万平方メートルの敷地に、四国各地の古い民家や歴史的な建物33棟を移して復元した野外の博物館です。国の重要文化財の民家や、砂糖をしぼった小屋など、四国の人々の暮らしを伝える建物が、山の斜面に点在しています。2002年に建てられた、建築家・安藤忠雄さんの設計の「四国村ギャラリー」では、絵画や彫刻などの美術品も見られます。坂道や石段が多いので、歩きやすい靴で回りましょう。休村日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "源平屋島古戦場（祈り岩・駒立岩）", h: 15, m: 30, stay: 60, mode: "walk", dur: 20, lat: 34.35281, lng: 134.12213, address: "香川県高松市牟礼町牟礼",
    memo:
      "四国村から歩いて約20分、屋島の東側、屋島の戦いの舞台となった入り江のあたりには、源平合戦にまつわる史跡が点在しています。那須与一が扇の的を射る前に成功を祈ったと伝わる「祈り岩」、馬の足をかけたと伝わる「駒立岩」、義経の身代わりとなって討たれた佐藤継信の忠義をたたえて、高松藩の初代藩主・松平頼重が建てた碑、そして継信を運ぶときに本堂の戸板を使ったという言い伝えの残る洲崎寺など、合戦の場面をたどりながら歩けます。多くの武士が命を落とした合戦の地でもあるので、静かに見学しましょう。お寺では静かに、敬意をもってお参りください。今夜は高松の町の宿へ。",
  },
];

const D2: NewSpot[] = [
  {
    name: "せとしるべ（高松港玉藻防波堤灯台）", h: 10, m: 0, stay: 30, mode: "walk", dur: 15, lat: 34.361484, lng: 134.051766, address: "香川県高松市サンポート",
    memo:
      "サンポートから海沿いの防波堤を歩いて約15分、防波堤の先に立つ赤い灯台です。1998年に明かりが灯された高さ約14mの灯台で、半透明のガラスブロックを積み上げてつくられた、世界で初めてのガラスの灯台とされています。夜は内側から赤く光り、昼は瀬戸内海の青さに赤い姿が映えます。防波堤の上は海風が強い日もあるので、足元に気をつけて歩きましょう。",
  },
  {
    name: "高松城跡（玉藻公園）", h: 10, m: 45, stay: 60, mode: "walk", dur: 15, lat: 34.35003, lng: 134.05039, address: "香川県高松市玉藻町2-1",
    memo:
      "せとしるべから歩いて約15分。天正16年（1588年）、豊臣秀吉から讃岐を与えられた生駒親正が築き始めた城の跡です。堀には瀬戸内海の海水が引き込まれていて、鯛などの海の魚が泳いでいるのを見られるのが、海に面した城ならではの見どころ。延宝4年（1676年）に建てられた月見櫓は、海から城へ入る船を見張った櫓で、国の重要文化財に指定されています。石垣の上は段差があるので、足元に気をつけて歩きましょう。",
  },
  {
    name: "北浜alley", h: 11, m: 55, stay: 60, mode: "walk", dur: 10, lat: 34.35099, lng: 134.05668, address: "香川県高松市北浜町",
    memo:
      "高松城跡から歩いて約10分、海沿いに古い倉庫が並ぶ一角です。使われなくなっていた倉庫街が、2001年ごろからカフェや雑貨の店、ギャラリーなどが入る場所に生まれ変わりました。倉庫の古い壁や屋根をそのまま生かした店が多く、港町の歴史を感じながら買い物ができます。海側からは、高松港を出入りする船も眺められます。潮風を感じる倉庫の間を歩きながら、ここで昼食にしましょう。",
  },
  {
    name: "香川県立ミュージアム", h: 13, m: 5, stay: 90, mode: "walk", dur: 10, lat: 34.349659, lng: 134.053332, address: "香川県高松市玉藻町5-5",
    memo:
      "北浜alleyから歩いて約10分。香川の歴史と美術を紹介する県立のミュージアムで、古代から近代までの香川の歩みをたどる展示や、美術作品のコレクションを見ることができます。屋島で見た源平合戦の時代や、昨日めぐった寺や民家の背景を知ると、旅の見え方が深まります。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "高松中央商店街", h: 14, m: 50, stay: 60, mode: "walk", dur: 15, lat: 34.34601, lng: 134.05054, address: "香川県高松市丸亀町",
    memo:
      "県立ミュージアムから歩いて約15分。8つの商店街がつながり、アーケードの総延長は約2.7kmにもなる、日本一長いアーケード街といわれる商店街です。丸亀町のガラスのドーム広場をはじめ、新しい店と昔ながらの店が並び、讃岐うどんの店も点在しています。雨の日でもぬれずに歩けるので、ゆっくり見て回りましょう。",
  },
  {
    name: "栗林公園", h: 16, m: 10, stay: 40, mode: "walk", dur: 20, lat: 34.330333, lng: 134.044403, address: "香川県高松市栗林町1丁目20-16",
    memo:
      "商店街を南へ歩いて約20分、北門から入る栗林公園です。紫雲山を背景に、6つの池と13の築山を配した回遊式の大名庭園で、江戸時代に高松藩の歴代藩主が手を加えて完成させたといわれ、国の特別名勝に指定されています。今日は北門から北庭を中心に、池と松の景色をゆっくり歩いて旅を締めくくりましょう。閉園の時刻は季節で変わるので、公式の案内で確かめてください。帰りはJR栗林公園北口駅から高松駅へ向かいます。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode || null, transitDurationMin: s.dur || null, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== YASHIMA_ID || days[1].spots.map((s) => s.id).join() !== SUNPORT_ID) throw new Error("既存スポットが想定と違います");

  const day1 = [
    toCreate(D1_FIRST),
    { id: YASHIMA_ID, data: { name: "屋島（談古嶺）", visitTime: t(10, 10), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.360351, lng: 134.104462, memo: MEMO_YASHIMA } },
    ...D1.map(toCreate),
  ];
  const day2 = [
    { id: SUNPORT_ID, data: { visitTime: t(9, 0), stayDurationMin: 45, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.352456, lng: 134.046599, memo: MEMO_SUNPORT } },
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
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? `${d.name ?? "サンポート高松"}(既存)` : d.name} ${String(d.memo).length}字`);
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

/**
 * #201 9dff2862「遠野物語の里をじっくり巡る、民話とオシラサマの1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 10:00〜12:00 / 2か所 09:00〜11:00 で、昼食の一言・行き方がなく、本文はツアーガイドの話し方（「皆様」「ご案内いたします」）
 * 車の旅（遠野駅の近くでレンタカーを借りて返す）。宿は遠野の市街地
 * 1日目: とおの物語の館 9:00 → 遠野市立博物館 → 鍋倉公園（鍋倉城址）→ 道の駅遠野風の丘（昼食）→ 遠野馬の里 → 遠野郷八幡宮 → 五百羅漢 → 卯子酉神社 16:50（すべて新規）
 * 2日目: 早池峯神社 9:00 → 遠野ふるさと村（1日目から）→ 伝承園（昼食）→ カッパ淵 → 福泉寺 → めがね橋（宮守川橋梁）16:30 → 遠野駅でレンタカーを返す
 * 冬は遠野ふるさと村・伝承園が早く閉まり、鍋倉城址への市道が通行止めになるので、季節は春・夏・秋
 * 本文の出典（遠野市観光協会「遠野時間」）: とおの物語の館 https://tonojikan.jp/tourism/tono-folktale-museum/ ／遠野市立博物館 https://tonojikan.jp/tourism/tono-municipal-museum/ ／
 *   鍋倉城址 https://tonojikan.jp/tourism/nabekura-castle-site/ ・南部神社 https://tonojikan.jp/tourism/tono-nanbujinja/ ／道の駅遠野風の丘 https://tonojikan.jp/tourism/tono-kazenooka/ ／
 *   遠野馬の里 https://tonojikan.jp/tourism/tono-umanosato/ ／遠野郷八幡宮 https://tonojikan.jp/tourism/tonogo-hachimangu-shrine/ ／五百羅漢 https://tonojikan.jp/tourism/gohyakurakan/ ／
 *   卯子酉神社 https://tonojikan.jp/tourism/unetori-shrine/ ／早池峯神社 https://tonojikan.jp/tourism/hayachine-shrine/ ／遠野ふるさと村 https://tonojikan.jp/tourism/tono-furusatomura/ ／
 *   伝承園 https://tonojikan.jp/tourism/denshoen/ ／カッパ淵 https://tonojikan.jp/tourism/kappabuchi-pool/ ／福泉寺 https://tonojikan.jp/tourism/fukusenji-temple/ ／
 *   めがね橋 https://tonojikan.jp/tourism/megane-bridge/ ・道の駅みやもり https://tonojikan.jp/tourism/roadside-station-miyamori/ ／
 *   レンタカー（遠野駅のそば）: 検索結果（駅レンタカー遠野駅 8:30〜17:00）
 * 開く時間（本文には書かない）: とおの物語の館・博物館 9〜17時（受付16:30まで）／ふるさと村 3〜10月 9〜17時（受付16時まで）、11〜2月は16時まで／伝承園 3〜11月 9〜17時、食事処 11時から／
 *   遠野馬の里 10〜15時 月曜休／福泉寺 11月〜12月末は8〜16時
 * 座標の出典: OSM — とおの物語の館 way 1306419425／遠野市立博物館 node 2559699879／鍋倉公園 way 625186147／道の駅遠野風の丘 way 254309066／遠野馬の里 node 13111340418／
 *   遠野郷八幡宮 way 294907710／五百羅漢 node 4428978392（tourism=attraction）／卯子酉神社 node 2985473525／早池峯神社 way 781191803／遠野ふるさと村 way 249358775／伝承園 node 704428818／
 *   カッパ淵 way 1301527676／福泉寺 node 5947837785。推定: めがね橋は、となりの道の駅みやもり way 254308239 の点
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-201-9dff2862.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9dff2862-bb91-4d25-847e-62f2267f18de";
const DAY_IDS = ["4081ec1a-9f1e-4d2f-9461-43d88b071b9c", "3e842819-542c-4d9a-94b9-821093a3f5f8"];
const ID = {
  furusato: "19b809ea-1aa3-473a-a368-1a00beae52fc",
  densho: "d2c713ee-0e3e-4eb8-bbd2-acb07e26f950",
  kappa: "bf8d14e9-5afc-403d-a864-9876930a4b93",
};
const EXPECTED = [[ID.furusato], [ID.densho, ID.kappa]];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BEAR = "山の中にあり、熊が出ることもあるので、熊鈴を持つなど備えて歩きましょう。";

const DESCRIPTION =
  "遠野駅の近くでレンタカーを借りてめぐる、『遠野物語』の里の1泊2日です。1日目は、とおの物語の館と遠野市立博物館で物語と暮らしを知り、鍋倉城址や遠野郷八幡宮、五百羅漢、縁結びの卯子酉神社へ。2日目は、早池峯神社から南部曲り家の残る遠野ふるさと村、オシラサマをまつる伝承園、カッパ淵、福泉寺をめぐり、宮沢賢治ゆかりのめがね橋で締めくくります。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY1 = [
  cre("とおの物語の館", { h: 9, m: 0, stay: 75, mode: null, min: null, lat: 39.3292975, lng: 141.5285293, address: "岩手県遠野市中央通り",
    memo: "この旅は車でめぐります。JR遠野駅の近くでレンタカーを借りて、市街地のとおの物語の館へ。遠野の昔話や文化にふれられる施設で、かつての酒蔵を改装した「昔話蔵」では、遠野に伝わる民話や日本の昔話を音と映像で楽しめます。『遠野物語』の著者・柳田國男ゆかりの「柳田國男展示館」や、語り部の昔話を聞ける「遠野座」もあります。" }),
  cre("遠野市立博物館", { h: 10, m: 20, stay: 75, mode: "walk", min: 5, lat: 39.3277638, lng: 141.5289336, address: "岩手県遠野市東舘町3-9",
    memo: "物語の館から歩いてすぐ。『遠野物語』の世界を映像やジオラマ、実物の資料で紹介する民俗の博物館です。遠野の人々の暮らしや文化を「町」「里」「山」に分けて展示し、市場のにぎわいや農村の四季を再現しています。シアターでは、『遠野物語』や民話を題材にした映像作品や、遠野盆地の雲海の映像が見られます。" }),
  cre("鍋倉公園（鍋倉城址）", { h: 11, m: 45, stay: 35, mode: "car", min: 10, lat: 39.327514, lng: 141.5278866, address: "岩手県遠野市遠野町",
    memo: "博物館から車で鍋倉山へ。市街地の南の端、標高344mの鍋倉山にある中世の山城の跡で、岩手県内でも屈指の大きな山城跡とされます。寛永4年（1627年）に南部直栄が八戸から移り、ここを本拠に遠野を治めました。今は三の丸が公園になっていて、山の中腹には遠野南部家の当主をまつる南部神社があり、遠野の町並みを見渡せます。冬は城址への市道が通行止めになります。" }),
  cre("道の駅遠野風の丘", { h: 12, m: 40, stay: 60, mode: "car", min: 20, lat: 39.3307033, lng: 141.5007476, address: "岩手県遠野市綾織町新里",
    memo: "鍋倉公園から車で西へ。遠野の野菜や加工品、お菓子などが並ぶ道の駅で、フードホールでは地元の食材を使った食事ができます。ここで昼食にしましょう。展望デッキからは遠野の田園風景を眺められます。" }),
  cre("遠野馬の里", { h: 14, m: 0, stay: 40, mode: "car", min: 20, lat: 39.3848925, lng: 141.5617156, address: "岩手県遠野市松崎町駒木",
    memo: "道の駅から車で北東へ。全国有数の馬の産地として知られる遠野で、乗用馬の生産や育成のために整えられた施設です。ホースパークの厩舎は自由に見学でき、遠野の人々と馬の深いつながりを感じられます。関係者以外が入れない区域もあるので、案内に従い、馬を驚かせないよう静かに見学しましょう。開いている時間は公式の案内で確かめましょう。" }),
  cre("遠野郷八幡宮", { h: 14, m: 50, stay: 30, mode: "car", min: 10, lat: 39.3438111, lng: 141.5464402, address: "岩手県遠野市松崎町白岩",
    memo: "馬の里から車で南へ。鎌倉時代にこの地を治めた阿曽沼氏が、城の鎮守として八幡宮を建てたのが始まりと伝えられる、遠野を代表する神社です。寛文元年（1661年）に今の場所へ移され、遠野まつりでは流鏑馬が奉納されます。" + RESPECT }),
  cre("五百羅漢", { h: 15, m: 35, stay: 40, mode: "car", min: 15, lat: 39.324445, lng: 141.5058971, address: "岩手県遠野市綾織町新里",
    memo: "八幡宮から車で市街地の西へ。江戸時代、たび重なる凶作で亡くなった人々を供養するため、大慈寺の義山和尚が、大小500の自然石に羅漢像を彫り続けたと伝えられる場所です。苔むした石に刻まれた羅漢の姿を、静かに見て歩きましょう。" + BEAR }),
  cre("卯子酉神社", { h: 16, m: 20, stay: 20, mode: "car", min: 5, lat: 39.3246688, lng: 141.5113934, address: "岩手県遠野市下組町",
    memo: "五百羅漢から車ですぐ。縁結びの神様として知られる神社です。かつて境内の淵のほとりの芦に恋の願いを書いた紙を結ぶと、縁が結ばれるという話が『遠野物語拾遺』に残されています。今も社前の赤い布に、利き手ではない方の手で願いごとを書いて片手で結ぶと願いがかなうと伝えられています。" + RESPECT + "このあとは、車で市街地の宿へ向かいましょう。" }),
];

const DAY2 = [
  cre("早池峯神社", { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 39.4755737, lng: 141.5092865, address: "岩手県遠野市附馬牛町上附馬牛19-81",
    memo: "2日目も車でめぐります。宿から車で北へ約30分、附馬牛の早池峯神社へ。大同元年（806年）、来内村の始閣藤蔵が神霊を拝し、早池峰山大権現の宮を建てたのが始まりと伝えられます。杉や桧、イチイの古木が茂る広い境内に、鳥居、山門、拝殿、神殿が続きます。" + RESPECT }),
  upd(ID.furusato, { h: 9, m: 55, stay: 105, mode: "car", min: 15, lat: 39.3960403, lng: 141.5404068, address: "岩手県遠野市附馬牛町上附馬牛5-89-1",
    memo: "早池峯神社から車で南へ。遠野の昔の農村の集落を再現した施設で、馬と人がともに暮らした南部曲り家を移して保存し、昭和の初めごろの農村の風景をイメージして整えられています。曲り家をめぐりながら、案内をしてくれる「まぶりっと」さんとの会話を楽しんだり、工房での創作を体験したりできます。ドラマや映画のロケ地にもなっています。" }),
  upd(ID.densho, { h: 11, m: 55, stay: 90, mode: "car", min: 15, lat: 39.3573373, lng: 141.5692201, address: "岩手県遠野市土淵町土淵6-5-1",
    memo: "ふるさと村から車で土淵へ。まずは園内の食事処で、遠野の食材を使った郷土料理の昼食にしましょう。伝承園は遠野に伝わる民話の世界を感じられる施設で、国の重要文化財の曲り家「旧菊池家住宅」や、千体のオシラサマをまつる「御蚕神（オシラ）堂」、『遠野物語』の話し手・佐々木喜善の資料の展示があります。オシラサマには娘と馬の物語が伝えられ、養蚕の神さまでもあります。御蚕神堂は今も祈りの場ですので、静かに、敬意をもって見学しましょう。" }),
  upd(ID.kappa, { h: 13, m: 30, stay: 35, mode: "walk", min: 5, lat: 39.3541754, lng: 141.5705352, address: "岩手県遠野市土淵町土淵",
    memo: "伝承園から歩いて約5分。延徳2年（1490年）に開かれた曹洞宗の常堅寺の裏手を流れる小川で、『遠野物語』には、馬を淵に冷やしに行ったところ河童が馬を引き込もうとして、かえって厩の前まで引きずられてきたという話が収められています。今にも河童が出てきそうな淵の景色を眺めましょう。川べりでは足元に気をつけ、常堅寺の境内では静かに過ごしましょう。" }),
  cre("福泉寺", { h: 14, m: 15, stay: 45, mode: "car", min: 10, lat: 39.3715771, lng: 141.563128, address: "岩手県遠野市松崎町駒木7-57-1",
    memo: "カッパ淵から車で約10分。大正元年（1912年）に開かれた真言宗の寺で、2代目の住職が戦没者の慰霊と世界平和を願って12年をかけて彫り上げた、高さ17mの木彫りの観音像がまつられています。木彫りの観音像としては日本最大とされます。平成2年に建てられた五重塔もあり、春は桜、秋は紅葉の名所です。" + RESPECT }),
  cre("めがね橋（宮守川橋梁）", { h: 15, m: 35, stay: 55, mode: "car", min: 35, lat: 39.3460113, lng: 141.351618, address: "岩手県遠野市宮守町",
    memo: "福泉寺から車で西へ約35分、宮守へ。昭和18年に完成した5連のアーチが美しい鉄橋で、今はJR釜石線が通っています。この地を走っていた岩手軽便鉄道は宮沢賢治が親しんだ路線で、『銀河鉄道の夜』の着想の一つになったともいわれます。橋の手前には、大正時代の岩手軽便鉄道のレンガ造りの橋脚が残っています。となりの道の駅みやもりには、釜石線の歴史と『銀河鉄道の夜』の世界を伝える展示もあります。見学のあとは、車で遠野駅へ戻ってレンタカーを返しましょう。返す時間は公式の案内で確かめておきましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.map((d) => d.id).join() !== DAY_IDS.join()) throw new Error("日の構成が想定と違います");
  it.days.forEach((d, i) => {
    if (d.spots.map((s) => s.id).join() !== EXPECTED[i].join()) throw new Error(`${i + 1}日目のスポットが想定と違います`);
  });
  const days = [DAY1, DAY2];
  days.forEach((arr, i) => {
    console.log(`\n${i + 1}日目 ${arr.length}か所`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      const name = "id" in x ? `${Object.keys(ID).find((k) => ID[k as keyof typeof ID] === x.id)}(既存)` : (d.name as string);
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  });
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
      await tx.spot.update({ where: { id: ID.furusato }, data: { dayId: DAY_IDS[1], orderNo: 901 } });
      for (let i = 0; i < 2; i++) await setDaySpotOrder(DAY_IDS[i], days[i] as never, { tx });
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

/**
 * #247 11ac9b73「知覧特攻平和会館と武家屋敷庭園、平和と歴史を学ぶ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 知覧特攻平和会館 10:00〜11:20・2日目 知覧武家屋敷庭園 9:30〜10:30 の各1か所で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「ご宿泊いただきます」）。
 * 慰霊の場所（知覧特攻平和会館・ホタル館 富屋食堂）は #235 と同じ気配り（企画運営 2026-10-11）: 静かに敬意をもって見学する一文、「楽しむ」などは使わない、
 *   亡くなった人の数・年齢・最期の様子は書かない、そのあとの行き先へは雰囲気が急に変わらない書き方にする
 * 鹿児島・知覧のほかのしおり（c2115481: 武家屋敷庭園・平和会館・池田湖・長崎鼻・砂むし会館、be101c35: 指宿の池田湖・長崎鼻ほか、d0407258: 砂むし会館）の本文を読み、写さずに書いた。
 *   指宿の行き先は使わず、1日目は枕崎・坊津、2日目は知覧と頴娃をめぐる
 * 車の旅（JR鹿児島中央駅の近くでレンタカーを借りて返す）:
 *   1日目 知覧特攻平和会館 9:30 → ホタル館 富屋食堂 → 枕崎お魚センター（昼食）→ 火之神公園 → 坊津歴史資料センター輝津館 → 鑑真記念館 16:30 → 枕崎の宿
 *   2日目 ミュージアム知覧 9:30 → 豊玉姫神社 → 知覧武家屋敷庭園（1日目から移さず2日目のまま）→ 道の駅川辺やすらぎの郷（昼食）→ 釜蓋神社 → 知覧城跡 16:30 → 鹿児島中央駅
 *   番所鼻自然公園は OSM に点がなく、清水磨崖仏は国土地理院も大字の点だけなので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（鹿児島県観光サイト かごしまの旅 https://www.kagoshima-kankou.com/guide/<番号>）:
 *   11054 知覧特攻平和会館（特攻隊員の遺品や関係資料を展示・戦争の悲惨さと命の尊さを後の世に伝え世界の平和を願う）と公式 https://www.chiran-tokkou.jp/ （9:00〜17:00・展示室）／
 *   51314 ホタル館 富屋食堂（「特攻の母」と呼ばれた鳥濱トメの生涯・軍の指定食堂だった富屋食堂を元の場所に復元・隊員とのふれあいを写真や遺品で紹介）／
 *   11071 枕崎お魚センター（かつおの町・食事処で枕崎の魚の料理・かつお節など）／11068 火之神公園（東シナ海に突き出た岬・沖に立神岩・古事記の神話）／
 *   10863 坊津歴史資料センター輝津館（坊津の歴史と民俗・中国や南の国との交易で栄えた・明の陶磁器）／10874 鑑真記念館（753年に上陸・6度目の渡航で日本へ・律宗・1992年開館・像の複製と渡航のジオラマ・月曜休館）／
 *   11055 ミュージアム知覧（南の琉球と北の大和の文化が交わる知覧の文化・かくれ念仏・水曜休館）／11065 豊玉姫神社（安産の信仰・父の豊玉彦は海の神・7月の水からくり）／
 *   11041 道の駅川辺やすらぎの郷（地元の大豆の豆腐・知覧茶・川辺牛・レストラン・レストランは水曜休み）／50902 射楯兵主神社（釜蓋神社）（素戔嗚尊・釜のふたを頭にのせて鳥居から拝殿まで歩く願掛け・裏に希望の岬・開聞岳）
 *   南九州市 https://www.city.minamikyushu.lg.jp/soshikikarasagasu/shokokankoka/kankosuisan/1/293.html 知覧武家屋敷庭園群（重要伝統的建造物群保存地区18.6ha・7つの庭園は国の名勝・母ヶ岳を借景）／
 *     https://www.city.minamikyushu.lg.jp/soshikikarasagasu/rekishibunkazaika/bunkazai/4/2/397.html 知覧城跡（南九州を代表する山城・武家屋敷群の南約1km・シラス台地の崖・深い空堀・平成5年に約24haが国指定史跡・1353年に佐多忠光に与えられ佐多氏の居城）
 * 座標: OSM — 知覧特攻平和会館 way 503050025・枕崎お魚センター way 398717187・火の神公園 way 729525739・坊津歴史資料センター輝津館 way 1411747073・鑑真記念館 way 600299583・
 *   ミュージアム知覧 way 503050009・豊玉姫神社 way 1411750676・道の駅川辺 way 436882568・知覧城 way 1044284859（Nominatim の中心）／
 *   ホタル館 富屋食堂（復元）node 9609185377・釜蓋神社 node 9959530365（node は API で名前つきを確かめた）／国土地理院の番地の点 — 知覧武家屋敷庭園（知覧町郡13731番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-247-11ac9b73.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "11ac9b73-e139-4423-a4a0-5b32958f042d";
const DAY1 = "8170619a-045d-406f-bc96-148e67141778";
const DAY2 = "beab6d8f-fed9-4ee8-af08-aec97f916b1e";
const KAIKAN = "dba4e4ba-4eea-472e-9071-b91655322cff";
const BUKE = "5b60199c-1949-4b4f-97ed-5f39509320c6";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "1日目は知覧特攻平和会館とホタル館 富屋食堂で戦争の記憶に静かに向き合い、海の町・枕崎と、古くから海外との交易で栄えた坊津へ。2日目は知覧に戻り、郷土の文化を伝える博物館や武家屋敷の庭園、山城の跡を訪ねる、平和と歴史を学ぶ1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type Item = ReturnType<typeof upd> | ReturnType<typeof cre>;

const D1: Item[] = [
  upd(KAIKAN, { h: 9, m: 30, stay: 100, legs: [], lat: 31.3637043, lng: 130.4344322, address: "鹿児島県南九州市知覧町郡17881",
    memo: "この旅は車でめぐります。JR鹿児島中央駅の近くでレンタカーを借りて、車で約50分。特攻隊員の遺品や関係する資料を集めて展示し、戦争のむごさと命の大切さを後の世に伝え、世界の平和を願う施設です。展示の一つひとつに、ゆっくりと向き合いましょう。亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。館内の撮影の決まりは、公式の案内に従いましょう。" }),
  cre("ホタル館 富屋食堂", { h: 11, m: 20, stay: 40, legs: [car(10)], lat: 31.3771717, lng: 130.4406339, address: "鹿児島県南九州市知覧町郡103-1",
    memo: "平和会館から車で約10分、知覧の町なかへ。戦争の終わりのころ、軍の指定食堂だった富屋食堂を、元の場所に復元した資料館です。隊員たちを温かく迎え、「特攻の母」と呼ばれた鳥濱トメの生涯と、隊員とのふれあいを、写真や遺品で伝えています。ここも亡くなった方々をしのぶ場所ですので、静かに見学しましょう。" }),
  cre("枕崎お魚センター", { h: 12, m: 35, stay: 50, legs: [car(35)], lat: 31.2698101, lng: 130.2884521, address: "鹿児島県枕崎市松之尾町33-1",
    memo: "知覧から南西へ、車で約35分の枕崎へ。かつお漁の港町の産物が集まる施設で、食事処では、枕崎で水揚げされた魚の料理を味わえます。ここで昼食にしましょう。かつお節など、港町ならではの品も並びます。" }),
  cre("火之神公園", { h: 13, m: 35, stay: 30, legs: [car(10)], lat: 31.2506367, lng: 130.2784538, address: "鹿児島県枕崎市火之神岬町",
    memo: "お魚センターから車で約10分。東シナ海に突き出た岬の公園で、古事記の神話が伝わる地とされ、沖には大きな立神岩がそびえます。岩場や崖のふちには近づかず、海を眺めましょう。" }),
  cre("坊津歴史資料センター輝津館", { h: 14, m: 30, stay: 50, legs: [car(25)], lat: 31.273566, lng: 130.2247142, address: "鹿児島県南さつま市坊津町坊9424-1",
    memo: "火之神公園から海沿いを西へ、車で約25分の坊津へ。坊津は、かつて中国や南の国々との交易で栄えた港町です。この資料館では、海を越えて運ばれた明の時代の焼き物や、漁や農の暮らしの道具などから、坊津の歩みを紹介しています。" }),
  cre("鑑真記念館", { h: 15, m: 40, stay: 50, legs: [car(20)], lat: 31.3563244, lng: 130.2019942, address: "鹿児島県南さつま市坊津町秋目225-2",
    memo: "輝津館から海沿いを北へ、車で約20分の秋目へ。唐の僧・鑑真が、何度も渡航に失敗したすえ、奈良時代の753年にこの地に上陸したことを記念する館で、鑑真の像の複製や、渡航と生涯をたどるジオラマが並びます。休館日は公式の案内で確かめましょう。今夜は、車で約40分の枕崎の宿に泊まります。" }),
];

const D2: Item[] = [
  cre("ミュージアム知覧", { h: 9, m: 30, stay: 45, legs: [], lat: 31.364093, lng: 130.4341027, address: "鹿児島県南九州市知覧町郡17880",
    memo: "枕崎の宿から、車で約35分の知覧へ。南の琉球と北の大和の文化が交わって育った知覧の文化を紹介する博物館で、信仰が禁じられた時代にひそかに続けられた「かくれ念仏」の資料などを見られます。休館日は公式の案内で確かめましょう。" }),
  cre("豊玉姫神社", { h: 10, m: 25, stay: 30, legs: [car(10)], lat: 31.3726499, lng: 130.4307615, address: "鹿児島県南九州市知覧町郡",
    memo: "博物館から車で約10分。安産の神として地元で信仰されてきた豊玉姫をまつる神社で、父の豊玉彦は海の神とされ、漁に生きる人々からも敬われてきました。夏には、水車の力で人形を動かす「水からくり」が奉納されます。" + PRAY }),
  upd(BUKE, { h: 11, m: 5, stay: 80, legs: [car(10)], lat: 31.379976, lng: 130.447708, address: "鹿児島県南九州市知覧町郡13731-1",
    memo: "神社から車で約10分。石垣と生け垣が続く通りに武家屋敷が並び、そのうち7つの庭園が国の名勝に指定されています。母ヶ岳を景色に取り入れた庭が多く、門をくぐるたびに、それぞれの家の庭の工夫を見比べられます。通りの家々には今も人が暮らしているので、静かに歩き、公開されていない家には入らないようにしましょう。" }),
  cre("道の駅川辺やすらぎの郷", { h: 12, m: 45, stay: 50, legs: [car(20)], lat: 31.4125462, lng: 130.4327508, address: "鹿児島県南九州市川辺町清水6910",
    memo: "武家屋敷から北へ、車で約20分。地元でとれた大豆の豆腐や知覧茶、川辺牛など、この地域の産物が集まる道の駅で、レストランもあるので、ここで昼食にしましょう。レストランの休みの日は公式の案内で確かめましょう。" }),
  cre("釜蓋神社", { h: 14, m: 25, stay: 45, legs: [car(50)], lat: 31.2495692, lng: 130.4161145, address: "鹿児島県南九州市頴娃町別府6827",
    memo: "道の駅から南へ、車で約50分の頴娃へ。正しい名前は射楯兵主神社で、素戔嗚尊をまつります。釜のふたを頭にのせて、落とさずに鳥居から拝殿まで歩く願掛けで知られています。社殿の裏の「希望の岬」からは、開聞岳と荒々しい岩の海岸を望めます。岩場では足元に気をつけましょう。" + PRAY }),
  cre("知覧城跡", { h: 15, m: 45, stay: 45, legs: [car(35)], lat: 31.3664763, lng: 130.4429542, address: "鹿児島県南九州市知覧町郡",
    memo: "釜蓋神社から車で約35分、知覧へ戻ります。武家屋敷の南約1kmにある、南九州を代表する山城の跡で、シラス台地の崖を生かし、曲輪のあいだに深い空堀が走ります。南北朝時代に佐多氏に与えられ、その城となりました。国の史跡です。空堀の中の道は足元が悪いところもあるので、気をつけて歩きましょう。帰りは、車で約50分のJR鹿児島中央駅の近くでレンタカーを返しましょう。" }),
];

function show(label: string, items: Item[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of items) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.map((d) => d.id).join() !== [DAY1, DAY2].join() || it.days[0].spots.map((s) => s.id).join() !== KAIKAN || it.days[1].spots.map((s) => s.id).join() !== BUKE)
    throw new Error("構成が想定と違います");
  show("1日目", D1);
  show("2日目", D2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1, D1, { tx });
      await setDaySpotOrder(DAY2, D2, { tx });
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

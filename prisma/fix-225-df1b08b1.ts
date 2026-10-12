/**
 * #225 df1b08b1「尖閣湾と大野亀、佐渡島の海岸線をめぐる絶景ドライブ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所 10:00〜11:00・2日目 1か所 09:30〜10:20 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみください」）。
 *   尖閣湾の座標（38.0731,138.2364）は海の上の点で、写真2枚（尖閣湾・大野亀）はどちらも同じコモンズの写真（相川の砂浜とつづら折りの道）で、どちらの場所でもなかった
 * 車の旅（両津港の近くでレンタカーを借りて返す。相川に泊まる）:
 *   1日目: 弾埼灯台 9:30 → 二ツ亀 → 大野亀（昼食）→ 大間港 → 弁慶のはさみ岩 → 道遊の割戸 → 佐渡奉行所跡 16:40（相川泊）
 *   2日目: 旧相川拘置支所 9:00 → 夫婦岩 → 尖閣湾揚島遊園（昼食）→ トキのテラス → 両津郷土博物館 → 加茂湖 16:30 → 両津港
 *   大野亀（もと2日目）は1日目へ、尖閣湾（もと1日目）は2日目へ移し、尖閣湾は昼食の場所の「尖閣湾揚島遊園」に名前を直す
 *   #fd9af1f7（佐渡金山・北沢・揚島遊園・きらりうむ・奉行所・京町）と揚島遊園・奉行所が重なるので、文は別に書いた。#881f9752（小木・宿根木・トキの森）とは重ならない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: さど観光ナビ（佐渡観光交流機構） https://www.visitsado.com/spot/<番号>/ —
 *   detail0155 弾埼灯台（佐渡最北端・鷲崎の弾崎・八角形・映画『喜びも悲しみも幾歳月』の舞台・記念像・1919年設置・両津港から車で約45分）／
 *   detail0134 二ツ亀・detail0407 二ツ亀海水浴場（二匹の亀・潮の満ち引き・透明度佐渡随一・快水浴場100選・ミシュラン二つ星・駐車場から海へ下りる）／
 *   detail0133 大野亀（標高167mの一枚岩・ミシュラン二つ星・トビシマカンゾウの群生地）／detail0346 大野亀ロッジ（大野亀を間近に望む食事の店・9:00〜16:00・12月〜3月休み）／
 *   detail0052 賽の河原（大野亀と二ツ亀をつなぐ遊歩道・海食洞穴の石地蔵・昔から篤く信仰）／
 *   detail0461 大間港（明治25年・たたき工法・鉱石の搬出と資材の搬入・石積護岸、トラス橋、ローダー橋脚、クレーン台座）／
 *   detail0141 弁慶のはさみ岩（下相川の浜・巨岩の間のくさび型の岩・佐渡弁慶の伝説・鎮目市左衛門の墓と吹上海岸石切場跡が隣接）／
 *   detail0094 道遊の割戸（江戸時代の露天掘り跡・V字・幅約30m、深さ約74m）／
 *   detail0093 佐渡奉行所跡（1603年・2000年に御役所を復元・役所、白洲、寄勝場・8:30〜17:00 入館16:30）／
 *   detail0101 旧相川拘置支所（1954年開設・1972年まで使用・現存する木造拘置所として全国的にも珍しい・国の登録有形文化財・内部を自由に見学）／
 *   detail0142 夫婦岩（古事記の国生み神話に由来するとされる・夫の岩22.6m、妻の岩23.1m・七浦海岸・猫岩、帆かけ岩）／
 *   detail0144 尖閣湾・detail0035 尖閣湾揚島遊園（姫津から北狄まで約3kmの5つの小湾・ハルダンゲル・フィヨルドに似ていることから名付けられた・30m級の断崖・
 *     第5景 揚島峡湾・展望台・海中公園・海中透視船・軽食堂）／
 *   detail0909 トキのテラス（野生のトキの観察・屋内観察室の展示と剥製・望遠鏡・屋上から金北山と国中平野）／
 *   detail0959 両津郷土博物館（地域の歴史と文化・自然、伝統、民俗資料・8:30〜17:00）／
 *   detail0136 加茂湖（周囲約17km・新潟県最大の湖・明治期に開削して汽水湖に・昭和7年からカキの養殖）
 * 座標: OSM — 弾崎灯台 way 683975916・大間港跡 way 682609424・佐渡奉行所跡 way 681183878・旧相川拘置支所 way 1159547865・尖閣湾揚島遊園 way 679664986・
 *   両津郷土博物館 way 699176095・加茂湖 way 91543596（いずれも Nominatim の中心）／大野亀 node 6407946174・弁慶のはさみ岩 node 8867738815・
 *   道遊の割戸 node 14174733801・夫婦岩 node 10222683157・トキのテラス node 8628508125（node は API で名前つきを確かめた）
 *   二ツ亀は島の点がないので、推定として OSM の駐車場「二ツ亀」way 75861427 の中心。賽の河原は点がないのでスポットにせず、大野亀の本文で触れるだけにした
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-225-df1b08b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "df1b08b1-02e9-4397-a71e-46c51bebbf88";
const DAY1 = "7f9f685f-9008-4b5a-ad67-22d8e08ac0a5";
const DAY2 = "67c66d1f-a35f-47ce-8a0d-f934869e1cdb";
const SENKAKU = "ebe32c20-075f-4c92-940f-f5ad3270c0d0";
const ONOGAME = "6bcb4212-2616-4b46-8176-ae0941ca7b3d";
const WRONG_PHOTOS = ["29470f0f-5ffa-43e3-b0e0-7f70d5846276", "a3b41071-2831-430d-9801-fb186b56688f"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "佐渡の北の端の弾埼灯台から、二ツ亀と大野亀の海岸へ。外海府の海沿いを南へ走り、相川で金山の港や奉行所の跡をめぐって一泊します。2日目は七浦海岸の夫婦岩から尖閣湾の断崖をめぐり、トキのテラスと加茂湖を訪ねて両津港へ戻る、海岸線をめぐるドライブの1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string; name?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ ...(s.name ? { name: s.name } : {}), visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { ...base(s), name, ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
const car = (min: number): Leg => ({ mode: "car", min });

const D1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("弾埼灯台", { h: 9, m: 30, stay: 40, legs: [], lat: 38.3308808, lng: 138.5136959, address: "新潟県佐渡市鷲崎",
    memo: "この旅は車でめぐります。フェリーで両津港に着いたら、港の近くでレンタカーを借りて、車で約45分の島の最も北の端へ。鷲崎の弾崎に立つ八角形の灯台で、1919年に設けられてから、島の北を通る船を見守ってきました。灯台守の夫婦を描いた映画『喜びも悲しみも幾歳月』の舞台としても知られ、そばには記念の像があります。岬の崖の近くでは、足元に気をつけましょう。" }),
  cre("二ツ亀", { h: 10, m: 25, stay: 55, legs: [car(15)], lat: 38.3284448, lng: 138.4868009, address: "新潟県佐渡市鷲崎",
    memo: "灯台から車で約15分。2匹の亀がうずくまっているように見える島で、潮の満ち引きによって景色が変わります。海の透明度は佐渡でいちばんとされ、駐車場から海辺へ下りると、島をすぐ近くに眺められます。下りの道は坂になっているので、足元に気をつけましょう。" }),
  upd(ONOGAME, { h: 11, m: 30, stay: 80, legs: [car(10)], lat: 38.3209838, lng: 138.46123, address: "新潟県佐渡市願",
    memo: "二ツ亀から車で約10分の願へ。標高167mの一枚岩が海へ突き出した姿が迫力のある巨岩で、二ツ亀とともに『ミシュラン・グリーンガイド・ジャポン』の二つ星に選ばれています。初夏には、まわりがトビシマカンゾウの黄色い花で彩られます。大野亀を間近に望む食事の店があるので、ここで昼食にしましょう（冬の間は休むので、事前に確かめましょう）。二ツ亀との間の海沿いの遊歩道には、海の洞穴に石の地蔵が並ぶ「賽の河原」があり、昔から篤く信仰されてきました。静かに、敬意をもって訪ねましょう。岩場では足元に気をつけましょう。" }),
  cre("大間港", { h: 14, m: 0, stay: 30, legs: [car(70)], lat: 38.0391449, lng: 138.2355145, address: "新潟県佐渡市相川柴町16",
    memo: "大野亀から外海府の海沿いの道を南へ、車で約1時間10分の相川へ。明治25年に、石灰などを使った「たたき工法」で造られた港で、金銀山の鉱石を運び出し、鉱山の資材を運び入れるために使われました。今も石積みの護岸やトラス橋、クレーンの台座などが残っています。岸壁の近くでは、足元に気をつけましょう。" }),
  cre("弁慶のはさみ岩", { h: 14, m: 40, stay: 20, legs: [car(10)], lat: 38.0455287, lng: 138.237305, address: "新潟県佐渡市下相川",
    memo: "大間港から車で約10分、下相川の浜へ。大きな岩と岩の間に、くさびのような形の岩がすっぽりとはさまっている奇観です。昔、佐渡弁慶が鬼との力比べで投げ飛ばした岩が、この浜まで飛んできたと伝えられています。すぐそばには、名奉行と呼ばれた鎮目市左衛門の墓があるので、静かに訪ねましょう。" }),
  cre("道遊の割戸", { h: 15, m: 15, stay: 30, legs: [car(15)], lat: 38.0353156, lng: 138.2474361, address: "新潟県佐渡市相川銀山町",
    memo: "はさみ岩から車で約15分。佐渡金銀山の中でも早い時期に掘られたとされる、江戸時代の露天掘りの跡です。金の鉱脈を掘り進むうちに、山がV字に割れたような姿になり、山の上の割れ目は幅約30m、深さ約74mにもなります。" }),
  cre("佐渡奉行所跡", { h: 15, m: 55, stay: 45, legs: [car(10)], lat: 38.0358044, lng: 138.2396866, address: "新潟県佐渡市相川広間町1-1",
    memo: "割戸から車で約10分、相川の町なかへ。金の鉱脈が見つかって佐渡が幕府の直轄地になり、1603年に置かれた奉行所の跡です。2000年に「御役所」の部分が復元され、役所や白洲に加えて、金銀を精製する「寄勝場」も備えた、佐渡ならではの奉行所の形を見られます。入館できる時間は公式の案内で確かめましょう。この夜は、相川の宿に泊まりましょう。" }),
];

const D2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("旧相川拘置支所", { h: 9, m: 0, stay: 40, legs: [], lat: 38.0349739, lng: 138.2464533, address: "新潟県佐渡市相川新五郎町24",
    memo: "この日も車でめぐります。相川の宿から、京町通りを山側へ上ったところ。1954年に開かれ、1972年まで使われた拘置所の建物で、今も残る木造の拘置所として全国でも珍しく、国の登録有形文化財になっています。蔦の這う塀の内側を、自由に見学できます。" }),
  cre("夫婦岩", { h: 10, m: 5, stay: 50, legs: [car(25)], lat: 37.9977338, lng: 138.2342273, address: "新潟県佐渡市高瀬",
    memo: "相川から南へ、七浦海岸を車で約25分。古事記の国生みの神話に由来するとされる2つの大きな岩で、向かって右の夫の岩は高さ22.6m、左の妻の岩は23.1m。波を受けて寄り添うように立っています。まわりには「猫岩」「帆かけ岩」などの岩礁も点在します。岩場では、波と足元に気をつけましょう。" }),
  upd(SENKAKU, { name: "尖閣湾揚島遊園", h: 11, m: 30, stay: 90, legs: [car(35)], lat: 38.093894, lng: 138.248645, address: "新潟県佐渡市北狄1561",
    memo: "夫婦岩から車で約35分、相川を通って北狄へ。尖閣湾は、姫津から北狄までの約3kmの海岸に並ぶ5つの小さな湾をまとめた呼び名で、ノルウェーのハルダンゲル・フィヨルドに似ていることから名付けられました。30m級の尖った断崖が連なり、ここ揚島遊園の展望台からその眺めを見渡せます。湾の中をめぐる海中透視船もあります。軽食堂があるので、ここで昼食にしましょう。展望台や船の上では、手すりにつかまり、足元に気をつけましょう。" }),
  cre("トキのテラス", { h: 14, m: 5, stay: 45, legs: [car(65)], lat: 38.0181279, lng: 138.4493675, address: "新潟県佐渡市新穂正明寺1277",
    memo: "尖閣湾から島の真ん中の平野を横切り、車で約1時間5分の新穂へ。野生のトキを観察できる施設で、屋内の観察室には、トキの野生復帰の取り組みや暮らしについての展示があり、望遠鏡でトキや野鳥を探せます。屋上からは、金北山を中心とする大佐渡の山々と、田んぼの広がる国中平野を眺められます。トキを驚かせないよう、静かに観察しましょう。" }),
  cre("両津郷土博物館", { h: 15, m: 5, stay: 45, legs: [car(15)], lat: 38.0611056, lng: 138.4242453, address: "新潟県佐渡市秋津1596",
    memo: "トキのテラスから車で約15分、加茂湖のそばの秋津へ。地域の自然や伝統、暮らしの道具などの民俗資料を通して、佐渡の歴史と文化を紹介する博物館です。休館日は公式の案内で確かめましょう。" }),
  cre("加茂湖", { h: 15, m: 55, stay: 35, legs: [car(5)], lat: 38.0655238, lng: 138.4344204, address: "新潟県佐渡市両津〜新穂",
    memo: "博物館から車で約5分、湖のほとりへ。周囲約17kmの新潟県でいちばん大きな湖で、もとは淡水でしたが、明治時代に海へつながる水路が開かれ、海水のまじる湖になりました。昭和7年に始まったカキの養殖も盛んです。湖の眺めで旅を締めくくりましょう。湖岸の道では、車に気をつけましょう。帰りは、車で約10分の両津港へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || it.days[0].spots.map((s) => s.id).join() !== SENKAKU || it.days[1].spots.map((s) => s.id).join() !== ONOGAME) throw new Error("構成が想定と違います");
  const photoIds = it.days.flatMap((d) => d.spots.flatMap((s) => s.photos.map((p) => p.id))).sort().join();
  if (photoIds !== [...WRONG_PHOTOS].sort().join()) throw new Error("写真が想定と違います");
  for (const [label, day] of [["1日目", D1], ["2日目", D2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of day) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
      const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${d.name ?? "大野亀"}${"id" in x ? "(既存)" : ""} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`\n説明文: ${DESCRIPTION}\n外す写真: ${WRONG_PHOTOS.join(", ")}（表紙は空にする）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: null } });
      await tx.photo.deleteMany({ where: { id: { in: WRONG_PHOTOS } } });
      await tx.spot.update({ where: { id: ONOGAME }, data: { dayId: DAY1, orderNo: 901 } });
      await tx.spot.update({ where: { id: SENKAKU }, data: { dayId: DAY2, orderNo: 902 } });
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

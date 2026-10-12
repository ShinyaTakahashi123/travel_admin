/**
 * #232 f7f504b1「姫路城のライトアップと市立美術館、大人の姫路1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 10:00〜19:10（夜のライトアップを見る形）・2日目 1か所 09:30〜10:20 で、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   姫路市立美術館は、令和8年4月1日から令和9年12月末（予定）まで、大規模修繕で全館休館（姫路観光ナビ ひめのみち https://www.himeji-kanko.jp/spot/60/ ）なので外す
 *   企画運営 10/11: 9時〜17時は夜のテーマでも変わらない。ライトアップは選べる補足にし、タイトルと説明文も夜を見る旅だと約束しない形にする
 * タイトル: 「姫路城と好古園、たつのの城下町と室津をめぐる1泊2日」に変える（美術館は休館、夜を約束しない）
 * 1日目（歩きと電車）: 姫路城 9:00 → 好古園（昼食）→ 兵庫県立歴史博物館 → 日本玩具博物館 16:30 → 姫路の宿
 * 2日目（レンタカー、姫路駅の近くで借りて返す）: 龍野城 9:30 → 聚遠亭 → 龍野歴史文化資料館 → 揖保乃糸資料館そうめんの里（昼食）→ うすくち龍野醤油資料館 → 室津海駅館 → 室津民俗館 16:30 → 姫路駅
 *   #218 cbebe471（姫路城・歴博・千姫天満宮・好古園・長壁神社・本徳寺・総社）と姫路城・好古園・歴博が重なるので、取り上げることを変えて文を別に書いた。#10 54f0fa20（姫路城・好古園・美術館・動物園・文学館・書写山・水族館・手柄山）とも同じ
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   姫路市 姫路城公式 https://www.city.himeji.lg.jp/castle/ （平成5年12月に法隆寺とともに日本で初の世界文化遺産・400年以上たっても美しい姿・時間帯や季節で違う表情）
 *   ひめのみち https://www.himeji-kanko.jp/spot/<番号>/ — 4 好古園（平成4年開園の池泉回遊式・姫路城を借景・庭園を眺めながら食事ができるレストラン）／
 *     56 兵庫県立歴史博物館（1983年開館・郷土の歴史の理解・1階の無料エリアに昔のくらし、遊び、AR着付け体験の「みんなの家」・2階にひょうごの歴史、城郭、祭り、こども文化）／
 *     ライトアップ: https://www.himeji-kanko.jp/event/917/ （姫路城ライトアップのリニューアル）
 *   日本玩具博物館 公式 https://japan-toy-museum.org/ （2026年9月・10月は土日祝のみ開館・水曜休館・臨時休館あり）、museum.or.jp/museum/5640 （1974年開館・白壁土蔵造りの6棟・郷土玩具や世界約160か国の玩具・JR播但線 香呂駅から徒歩約15分）
 *   たつの市 https://www.city.tatsuno.lg.jp/ — 龍野城 /soshiki/1026/gyomu/2/1/2831.html （鶏籠山の山城と平山城の2期・山城は約500年前に赤松村秀・寛文12年に脇坂安政・桜の名所・月曜休）／
 *     聚遠亭 /soshiki/1026/gyomu/2/1/2643.html （眺望をたたえた名・心字池の上の浮堂の茶室・御涼所・三木露風の詩碑・9時〜16時30分・月曜休）／
 *     観光案内 歴史を見る /soshiki/1023/gyomu/2/3032.html （龍野は国の重要伝統的建造物群保存地区・播磨の小京都・龍野歴史文化資料館は古代から近世の資料・室津海駅館は買積廻船問屋の嶋屋・室津民俗館は海産物問屋の魚屋の跡・室津は海の宿駅）
 *   兵庫観光ナビ https://www.hyogo-tourism.jp/spot/detail_1039.html （揖保乃糸資料館そうめんの里: 起源や製法、歴史の展示・製造工程をガラス越しに見学・館内のレストランでそうめん）
 *   うすくち龍野醤油資料館: たつの市の観光案内（江戸時代からの醤油づくりの歴史・昔の作業場の再現・明治の醤油蔵の事務所）
 * 座標: OSM — 姫路城 way 23707900・好古園 way 236942009・聚遠亭 way 421297394・室津海駅館 way 445218660・室津民俗館 way 445218659（way は Nominatim の中心）／
 *   兵庫県立歴史博物館 node 1423054276・日本玩具博物館 node 1423068223・龍野城址 node 4571153666・そうめんの里 node 4346078912・うすくち龍野醤油資料館 node 1423043282（node は API で名前つきを確かめた）／
 *   国土地理院の番地の点 — 龍野歴史文化資料館（龍野町上霞城128番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-232-f7f504b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f7f504b1-6c02-407f-9648-fd54bf0edf68";
const DAY1 = "92a464b8-d17e-472e-b640-90ad9b9eeadc";
const DAY2 = "88e1c383-8d3e-45d2-895f-68817d2147dd";
const SHIRO = "a2d4923a-9899-4647-a113-6aafd3b2c4f8";
const BIJUTSUKAN = "cb25cf58-1b83-4a37-9ff7-0c98440c3fa9";
const KOKO = "a9cb15b7-f2f4-457e-84f4-f81f8ae60e52";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

const TITLE = "姫路城と好古園、たつのの城下町と室津をめぐる1泊2日";
const DESCRIPTION =
  "1日目は世界遺産の姫路城から、城を借景にした好古園、兵庫県立歴史博物館、郷土玩具を集めた日本玩具博物館へ。2日目はレンタカーで「播磨の小京都」と呼ばれる龍野の城下町と、そうめんや醤油の資料館を訪ね、海の宿駅として栄えた室津の町まで足をのばす1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const D1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(SHIRO, { h: 9, m: 0, stay: 120, legs: [], lat: 34.8393313, lng: 134.69402, address: "兵庫県姫路市本町68",
    memo: "1日目は歩きと電車でめぐります。JR姫路駅から歩いて約20分。平成5年に、奈良の法隆寺とともに日本で初めて世界文化遺産に登録された城で、築かれてから400年以上たった今も、その美しい姿を残しています。天守に上って城の造りを確かめたら、城内の門や石垣のあいだを歩いてみましょう。時間帯や季節によって、まったく違う表情を見せる城です。天守の中の階段は急なので、手すりにつかまって上り下りしましょう。" }),
  upd(KOKO, { h: 11, m: 15, stay: 90, legs: [walk(15)], lat: 34.837969, lng: 134.6896132, address: "兵庫県姫路市本町68",
    memo: "城の西へ歩いて約15分。姫路城を背景にした池泉回遊式の日本庭園で、平成4年に開かれました。園内には庭を眺めながら食事のできるレストランがあるので、ここで昼食にしましょう。食後は、城の姿が庭の景色に重なる眺めを楽しみながら、ゆっくり歩きましょう。池のほとりでは足元に気をつけましょう。" }),
  cre("兵庫県立歴史博物館", { h: 13, m: 5, stay: 60, legs: [walk(20)], lat: 34.841115, lng: 134.696872, address: "兵庫県姫路市本町68",
    memo: "好古園から城の北側を回って、歩いて約20分。郷土の歴史を知ってもらうために1983年に開かれた県立の博物館です。2階では兵庫の歴史や城郭、祭りの展示を見られ、1階には昔のくらしや遊びにふれ、AR（拡張現実）で着物の着付けを体験できる「みんなの家」もあります。休館日は公式の案内で確かめましょう。" }),
  cre("日本玩具博物館", { h: 15, m: 0, stay: 90, legs: [walk(25), { mode: "train", min: 15, line: "JR播但線" }, walk(15)], lat: 34.907581, lng: 134.745255, address: "兵庫県姫路市香寺町中仁野671-3",
    memo: "博物館から姫路駅へ歩き、JR播但線で香呂駅へ行き、歩いて約15分（あわせて約55分）。1974年に開かれた博物館で、白壁の土蔵造りの建物に、日本の郷土玩具から世界の国々の玩具まで、たくさんの資料が集められています。開館日は時期によって変わり、平日に休むこともあるので、出かける前に必ず公式の案内で確かめましょう。帰りは香呂駅から姫路へ戻り、姫路の宿に泊まりましょう。日が暮れると姫路城の天守がライトアップされるので、時間があれば、夜の姿を眺めに出かけるのもよいでしょう。" }),
];

const D2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("龍野城", { h: 9, m: 30, stay: 40, legs: [], lat: 34.8687368, lng: 134.5447312, address: "兵庫県たつの市龍野町上霞城128-1",
    memo: "2日目は車でめぐります。JR姫路駅の近くでレンタカーを借りて、車で約30分のたつの市龍野へ。鶏籠山の山頂の山城と、ふもとの平山城の2つの時代に分かれる城で、山城は約500年前に赤松村秀が築き、今の平山城は寛文12年に脇坂安政が築いたものです。春には桜の名所としても知られます。休館日は公式の案内で確かめましょう。" }),
  cre("聚遠亭", { h: 10, m: 20, stay: 30, legs: [walk(10)], lat: 34.870558, lng: 134.5418009, address: "兵庫県たつの市龍野町中霞城6",
    memo: "龍野城から歩いて約10分。前庭からの眺めのよさをたたえて名付けられたといわれる場所で、心字池の上に浮かぶように建つ茶室は、庭園や池、杉垣と調和した数寄屋風の建物です。藩主・脇坂家の御涼所も残り、池のほとりには、龍野が生んだ詩人・三木露風の詩碑もあります。休館日は公式の案内で確かめましょう。" }),
  cre("龍野歴史文化資料館", { h: 10, m: 55, stay: 40, legs: [walk(5)], lat: 34.868401, lng: 134.545013, address: "兵庫県たつの市龍野町上霞城128-3",
    memo: "聚遠亭から歩いて約5分、龍野城のそばへ。たつの市の古代から江戸時代までの歴史や文化の資料を、実物やパネル、模型で紹介する資料館です。龍野の城下町は、国の重要伝統的建造物群保存地区に選ばれ、「播磨の小京都」とも呼ばれています。休館日が月の終わりなどにもあるので、公式の案内で確かめましょう。" }),
  cre("揖保乃糸資料館そうめんの里", { h: 12, m: 0, stay: 80, legs: [walk(10), car(15)], lat: 34.8917439, lng: 134.5667112, address: "兵庫県たつの市神岡町奥村56",
    memo: "資料館から車へ歩いて戻り、車で約15分（あわせて約25分）。播州の手延べそうめん「揖保乃糸」の起源や作り方、歴史を紹介する資料館で、そうめんを作る工程をガラス越しに見学できます。館内のレストランで、そうめんの昼食にしましょう。休館日は公式の案内で確かめましょう。" }),
  cre("うすくち龍野醤油資料館", { h: 13, m: 40, stay: 50, legs: [car(20)], lat: 34.866677, lng: 134.5458785, address: "兵庫県たつの市龍野町大手54-1",
    memo: "そうめんの里から車で約20分、龍野の町へ戻ります。うすくち醤油の産地として知られる龍野で、江戸時代からの醤油づくりの歴史を伝える資料館です。昔の作業場を再現した展示や、明治時代の醤油蔵の事務所を見られます。まわりの白壁の町並みには今も人が暮らしているので、静かに歩きましょう。" }),
  cre("室津海駅館", { h: 15, m: 5, stay: 40, legs: [walk(5), car(30)], lat: 34.7673935, lng: 134.5052243, address: "兵庫県たつの市御津町室津",
    memo: "資料館の近くに停めた車で、瀬戸内海に面した室津へ（あわせて約35分）。室津は江戸時代、海の宿駅として栄えた港町です。この館は、品物の売り買いと運送をかねた廻船問屋「嶋屋」の建物を生かした資料館です。開館日と時間は公式の案内で確かめましょう。" }),
  cre("室津民俗館", { h: 15, m: 50, stay: 40, legs: [walk(5)], lat: 34.7662544, lng: 134.505845, address: "兵庫県たつの市御津町室津",
    memo: "海駅館から歩いて約5分。海産物を扱った豪商「魚屋」の屋敷の跡を、建物を守るために資料館として生かしたもので、参勤交代のころに最も栄えた室津の町の面影を伝えています。港町には今も人が暮らしているので、静かに歩きましょう。開館日と時間は公式の案内で確かめましょう。帰りは、車で約50分の姫路駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || it.days[0].spots.map((s) => s.id).join() !== [SHIRO, BIJUTSUKAN].join() || it.days[1].spots.map((s) => s.id).join() !== KOKO) throw new Error("構成が想定と違います");
  const names: Record<string, string> = { [SHIRO]: "姫路城", [KOKO]: "好古園" };
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
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}\n外すスポット: 姫路市立美術館（全館休館。写真ごと消える）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.spot.update({ where: { id: KOKO }, data: { dayId: DAY1, orderNo: 901 } });
      await setDaySpotOrder(DAY1, D1, { tx, remove: [BIJUTSUKAN] });
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

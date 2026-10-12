/**
 * #152 22b14d35「児島ジーンズストリートと鷲羽山、倉敷デニムの町と瀬戸内海の絶景1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは各日1か所（10:00〜11:30 / 09:30〜10:30）で、昼食と宿・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）
 * 車の旅（JR岡山駅前でレンタカーを借り、2日目に岡山駅で返す。児島・鷲羽山のあたりに泊まる）:
 *   1日目: 旧野﨑家住宅 9:30 → 児島ジーンズストリート → 児島駅前（昼食）→ 由加神社本宮 → 由加山蓮台寺 → 熊野神社 → 五流尊瀧院 16:30 → 宿
 *   2日目: 鷲羽山 9:30 → むかし下津井回船問屋 → 下津井漁港（昼食）→ 祇園神社 → 瀬戸大橋架橋記念公園 → 渋川マリン水族館 16:30 → 岡山駅
 * タイトル・季節はそのまま、説明文は書き直す。児島・下津井・由加山にはほかのしおりがない（鷲羽山・ジーンズストリートもこのしおりだけ）
 * 瀬戸大橋周遊観光船は冬の平日が運休なので入れない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（倉敷観光WEB kurashiki-tabi.jp ほか公式）:
 *   /see/see-215/（旧野﨑家住宅: 野﨑武左衛門が江戸時代後期に大規模な塩田を開き「塩田王国」・約3,000坪に主屋と6棟の土蔵、庭に茶室・国の重要文化財・塩づくりの資料と民具・9:00〜16:30、月曜休館）／
 *   /see/see-1303/（児島ジーンズストリート: 旧野﨑家住宅から南へ広がる商店街・地元ジーンズメーカーの店が連なる・営業時間は店ごと）／
 *   /rm_see/rm-see206/（由加神社本宮: 瑜伽大権現・災難除け、交通安全、商売繁昌の守護神・大綿津見命・かつては巨岩を御神体・天平5年に行基が開山・明治元年の神仏分離で蓮台寺と分かれた・
 *   明治27年の備前焼の大鳥居、高さ幅約5m、国の登録有形文化財・本殿は約370年前で県の重要文化財・金刀比羅宮との両参り）／
 *   /see/see-216/（由加山蓮台寺: 奈良時代に行基が創建・県指定重文の客殿・円山応挙の絶筆「竹鶏の図」をはじめ襖絵・古来より厄除けの総本山・江戸時代に藩主池田侯の祈願所・9時〜16時）／
 *   /see/see-233/（熊野神社: 701年に役行者の高弟たちが紀州熊野本宮大社から祀る・神殿は国の重要文化財、県の重要文化財が連立・全国3800社余りの熊野神社で本宮の昔の姿をこの地のみに残す・9時〜16時）／
 *   /see/see-234/（五流尊瀧院: 奈良時代に紀州熊野権現から勧請、もとは熊野権現・五流尊瀧院と熊野神社に分かれた・お日待ち祭は1,300年の伝統・9:00〜17:00）／
 *   /see/see-1272/（鷲羽山: 鷲が羽を広げた姿から名付けられた・標高133mの山頂「鍾秀峰」・日本初の国立公園として知られる瀬戸内海国立公園の代表的な景勝地・大小50余りの島と瀬戸大橋・日本の夕陽百選・ビジターセンターは標高110m）／
 *   /see/see-214/（むかし下津井回船問屋: 明治時代の回船問屋の建物を復元した資料館・母屋・下津井の資料・9:00〜17:00、火曜休館）／/see/see-5945/（下津井の町並み: 江戸から明治の中頃に北前船で栄えた・
 *   祇園神社の参道付近から田之浦への旧道に本瓦葺きの屋根や土蔵・県の町並み保存地区・平成30年に日本遺産）／/see/see-5947/（祇園神社: 町並みの西、海に突き出す岬の丘・玉垣に北前船の船主らの名・
 *   境内から瀬戸大橋と港・下津井や瀬戸内を詠んだ歌碑）／/see/see-1282/（瀬戸大橋架橋記念公園: 約16.7ha・県史跡の下津井城跡が中心・瀬戸大橋開通を記念・本丸跡、二の丸ではなく西の丸跡、三の丸跡などの広場・瀬戸内海の眺望）／
 *   okayama-kanko.jp/spot/10621（渋川マリン水族館: 玉野市立海洋博物館・昭和28年開館・34の水槽に瀬戸内海を中心に約180種2,000点・海の歴史資料・9時〜17時、入館16時30分まで・水曜休館（春休み・GW・7〜8月は無休））
 * 座標: OSM — 旧野﨑家住宅 way 597558669（attraction）・児島ジーンズストリート way 453852902（道）・熊野神社 way 601750863（日本第一熊野神社）・五流尊瀧院 way 457379916・
 *   玉野海洋博物館 way 1428895669（museum）（way は Nominatim の中心）／児島駅 node 8098643632（station）・由加神社本宮は児島由加の「由加山神社」node 4525463992（place_of_worship）・
 *   鷲羽山 node 7165143145（peak）・むかし下津井回船問屋は node 13247588612（historic、OSM の名前は「むかし下津井海鮮問屋」）・下津井漁港 node 10029246987・祇園神社 node 6953439803／
 *   蓮台寺と架橋記念公園は OSM に名前つきの点がないので、国土地理院の番地の点（児島由加2855番地・下津井吹上二丁目369番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-152-22b14d35.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "22b14d35-9cbe-40b0-a878-fcc19927489b";
const DAY1_ID = "bde2bcd2-cebe-439c-a908-ff8dcbbecc87";
const DAY2_ID = "c381c3b0-a054-43d8-b60a-cb4b70e90589";
const JEANS = "a751e2f0-0a61-44d8-876a-817b1a20d158";
const WASHU = "7e4feb9c-d998-4b95-a52b-2976e71864bf";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "塩田で栄えた野﨑家の屋敷と、地元のジーンズの店が並ぶ児島ジーンズストリートを歩き、由加山と熊野神社の古い社寺へ。2日目は鷲羽山から瀬戸大橋と島々を眺め、北前船で栄えた下津井の港町、下津井城跡の公園をめぐって、渋川の水族館で瀬戸内の生き物にふれる、車でめぐる児島の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("旧野﨑家住宅", { h: 9, m: 30, stay: 70, legs: [], lat: 34.4719754, lng: 133.8030158, address: "岡山県倉敷市児島味野1-11-19",
    memo: "この旅は車でめぐります。JR岡山駅前でレンタカーを借りて、車で約40分。江戸時代の後期に大きな塩田を開き、「塩田王国」を築いた野﨑武左衛門の屋敷で、国の重要文化財です。約3,000坪の敷地に、主屋と6棟の土蔵が軒を連ね、庭には茶室が点在します。土蔵の中では、塩づくりの歴史の資料や、江戸時代からの暮らしの道具を見られます。休館日は公式の案内で確かめましょう。" }),
  upd(JEANS, { h: 10, m: 45, stay: 55, legs: [walk(5)], lat: 34.4690504, lng: 133.8024413, address: "岡山県倉敷市児島味野2丁目",
    memo: "野﨑家の屋敷から南へ歩いてすぐ。国産ジーンズ発祥の地とされる児島の商店街で、地元のジーンズメーカーの店が並び、それぞれの店のこだわりの品を見て回れます。店の営業時間はそれぞれ違うので、公式の案内で確かめましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }),
  cre("児島駅前（昼食）", { h: 11, m: 50, stay: 50, legs: [walk(5), car(5)], lat: 34.4627408, lng: 133.8076652, address: "岡山県倉敷市児島駅前",
    memo: "車に戻り、約5分。駅のまわりで昼食にしましょう。" }),
  cre("由加神社本宮", { h: 13, m: 0, stay: 40, legs: [car(20)], lat: 34.5043373, lng: 133.8495078, address: "岡山県倉敷市児島由加2852",
    memo: "児島駅から車で約20分、由加山の中腹へ。災難除けや交通安全、商売繁昌の神として信仰を集めてきた瑜伽大権現をまつる神社で、奈良時代の天平5年（733年）に行基が開いたと伝わります。明治27年（1894年）に建てられた、高さと幅が約5mある備前焼の大鳥居は、国の登録有形文化財です。約370年前に建てられた本殿は、県の重要文化財です。香川の金刀比羅宮とあわせてお参りする「両参り」の習わしでも知られます。" + PRAY }),
  cre("由加山蓮台寺", { h: 13, m: 45, stay: 60, legs: [walk(5)], lat: 34.505901, lng: 133.850433, address: "岡山県倉敷市児島由加2855",
    memo: "由加神社本宮から歩いてすぐ。明治のはじめの神仏分離で、由加神社と分かれたお寺です。江戸時代には藩主・池田家の祈願所とされました。県の重要文化財の客殿では、円山応挙の最後の作品とされる「竹鶏の図」をはじめ、多くの襖絵を見られます。拝観の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("熊野神社", { h: 15, m: 5, stay: 45, legs: [walk(5), car(15)], lat: 34.5400294, lng: 133.8197295, address: "岡山県倉敷市林684",
    memo: "由加山から車で約15分。大宝元年（701年）に、修験道の祖・役行者の弟子たちが、紀州の熊野本宮大社から神を迎えてまつったと伝わる神社です。国の重要文化財の本殿をはじめ、県の重要文化財の社殿が並び、全国の熊野神社のなかで本宮の昔の姿をここだけに残すとされます。参拝の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("五流尊瀧院", { h: 15, m: 55, stay: 35, legs: [walk(5)], lat: 34.5367889, lng: 133.818904, address: "岡山県倉敷市林952",
    memo: "熊野神社から歩いて約5分。奈良時代に紀州の熊野権現を迎えてまつったのが始まりで、もとは熊野神社と一つの「熊野権現」でした。1,300年続くとされる「お日待ち祭」を今に伝えています。" + PRAY + "今夜は、車で約30分の児島・鷲羽山のあたりの宿に泊まります。" }),
];

const DAY2: X[] = [
  upd(WASHU, { h: 9, m: 30, stay: 60, legs: [], lat: 34.4354877, lng: 133.8124716, address: "岡山県倉敷市下津井田之浦",
    memo: "この日も車でめぐります。宿から鷲羽山の駐車場へ。鷲が羽を広げた姿に似ていることから名付けられた山で、日本で最初の国立公園として知られる瀬戸内海国立公園を代表する景勝地です。標高133mの山頂「鍾秀峰」からは、大小50あまりの島々と瀬戸大橋を見渡せます。「日本の夕陽百選」にも選ばれています。" }),
  cre("むかし下津井回船問屋", { h: 10, m: 40, stay: 60, legs: [car(10)], lat: 34.4377001, lng: 133.7975938, address: "岡山県倉敷市下津井1-7-23",
    memo: "鷲羽山から車で約10分、下津井の港町へ。明治時代の回船問屋の建物を復元した資料館で、母屋など当時の商家の様子や、下津井にまつわる資料を紹介しています。下津井は江戸時代から明治の中ごろまで北前船で栄えた港町で、このあたりの旧道には本瓦葺きの屋根や土蔵が残り、県の町並み保存地区になっています。休館日は公式の案内で確かめましょう。今も人が暮らしている町なので、静かに歩きましょう。" }),
  cre("下津井漁港（昼食）", { h: 11, m: 45, stay: 50, legs: [walk(5)], lat: 34.4361171, lng: 133.7987723, address: "岡山県倉敷市下津井",
    memo: "回船問屋から歩いて約5分。港のまわりで昼食にしましょう。" }),
  cre("祇園神社", { h: 12, m: 43, stay: 30, legs: [walk(8)], lat: 34.43714, lng: 133.7948959, address: "岡山県倉敷市下津井",
    memo: "港から町並みを西へ歩いて約8分。海に突き出した岬の丘の上に立つ神社で、境内からは瀬戸大橋と港を見渡せます。玉垣には、航海の安全を祈った日本海側の北前船の船主たちの名も刻まれています。境内のあたりには、下津井や瀬戸内を詠んだ歌碑も多く立っています。" + PRAY }),
  cre("瀬戸大橋架橋記念公園", { h: 13, m: 25, stay: 75, legs: [walk(12)], lat: 34.44117, lng: 133.796921, address: "岡山県倉敷市下津井吹上2-369-2",
    memo: "祇園神社から歩いて約12分。瀬戸大橋の開通を記念してつくられた約16.7haの公園で、県の史跡・下津井城跡を中心に、本丸跡や三の丸跡などの広場が整えられています。城跡の高台からは、瀬戸内海を見渡せます。" }),
  cre("渋川マリン水族館", { h: 15, m: 10, stay: 80, legs: [walk(10), car(20)], lat: 34.4550512, lng: 133.9053314, address: "岡山県玉野市渋川2-6-1",
    memo: "車に戻り、約20分、玉野の渋川へ。昭和28年（1953年）に開かれた玉野市立海洋博物館の水族館で、34の水槽に、瀬戸内海を中心に約180種・2,000点の海の生き物を展示しています。海の歴史の資料も見られます。休館日は公式の案内で確かめましょう。帰りは、岡山駅まで車で約50分、レンタカーを返しましょう。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
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
  const ids = it.days.map((d) => d.id + ":" + d.spots.map((s) => s.id).join());
  if (ids.join("|") !== `${DAY1_ID}:${JEANS}|${DAY2_ID}:${WASHU}`) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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

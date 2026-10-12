/**
 * #172 57863f76「大洗サンビーチとめんたいパーク、海水浴とグルメの1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 10:00〜13:00・2日目 1か所 9:00〜9:40 で、昼食や帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。めんたいパークの本文に会社名（銘柄）が出ていた
 * 季節は夏だけのまま。大洗・ひたちなかのほかのしおり（3a0ab316・fdf00843・c898c3d9: 大洗磯前神社・酒列磯前神社・おさかな市場・水族館・マリンタワー・幕末と明治の博物館など）の本文を読み、
 *   使っていない話で書いた（大洗磯前神社: 一の鳥居の高さと社殿の完成・文化財、サンビーチ: ユニバーサルビーチ、酒列: 樹叢の天然記念物、おさかな市場: 昼食だけ）。
 *   涸沼（涸沼自然公園・親沢公園・網掛公園）・国営ひたち海浜公園・阿字ヶ浦・虎塚古墳はほかのしおりにない。
 *   夕日の郷 松川は OSM に点がなく国土地理院も大字の点だけ、ひたち海浜公園のレストランも OSM に点がないので入れなかった
 * 車の旅（JR水戸駅の近くでレンタカーを借りて返す）:
 *   1日目 大洗磯前神社 9:00（2日目から移す）→ 大洗サンビーチ → めんたいパーク大洗（昼食）→ 涸沼自然公園 → 親沢公園 → 網掛公園 16:30 → 大洗の宿
 *   2日目 国営ひたち海浜公園 9:30 → 那珂湊おさかな市場（昼食）→ 酒列磯前神社 → 阿字ヶ浦海水浴場 → 虎塚古墳 16:30 → 水戸駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   たびよみ https://tabi-mag.jp/ib0069/ 大洗磯前神社（徳川光圀が造営を始め綱條の代の1730年に完成・本殿と拝殿は茨城県の有形文化財・神磯の鳥居は御神体が降り立ったと伝わる地・一の鳥居は高さ16.21m）
 *   大洗観光協会 https://www.oarai-info.jp/spot/postid_2920/ 大洗サンビーチ（遠浅・昭和59年開設・ユニバーサルビーチの考えで設計）と検索結果（快水浴場百選・水陸両用の車いすの貸し出し）
 *   めんたいパーク大洗 https://mentai-park.com/ooarai/ （工場見学・直売店・フードコート・入場無料）
 *   茨城町 https://www.town.ibaraki.lg.jp/gyousei/kenkoukaigo/sports/koen/park/000678.html 涸沼自然公園（太陽の広場から涸沼を一望・せせらぎ広場・梅雨のころ約30種1万株のあじさい）と検索結果（約34.5ha・ヒヌマイトトンボにちなむ赤い橋）／
 *     https://www.town.ibaraki.lg.jp/gyousei/kenkoukaigo/sports/koen/oyazawa/index.html 親沢公園（松の茂る古くからの景勝地・親沢の鼻は県の名勝・晴れた日に筑波山・夕日の撮影地）／
 *     https://www.town.ibaraki.lg.jp/gyousei/kenkoukaigo/sports/koen/park/001406.html 網掛公園（親沢公園の対岸・野鳥観察台）
 *   茨城県 https://www.town.ibaraki.lg.jp/gyousei/kurashitetuduki/gomirisaikle/ramsar/001468.html の検索結果（涸沼は汽水湖・2016年にラムサール条約湿地・ヤマトシジミ・ヒヌマイトトンボ）
 *   国営ひたち海浜公園 https://www.hitachikaihin.jp/spot-guide/overview.html （1991年開園・計画350ha・夏のジニアやヒマワリ・大観覧車）と検索結果（夏は毎日開園）
 *   茨城県観光物産協会 https://www.ibarakiguide.jp/spot.php?mode=detail&code=1155 那珂湊おさかな市場（鮮魚店や水産加工品の店・食事処）／code=1136 酒列磯前神社（樹齢300年を超えるヤブツバキやタブノキの約300mの参道は県の天然記念物）
 *   ひたちなか市 https://www.city.hitachinaka.lg.jp/business/kankoshinko/1002713/1010142.html 阿字ヶ浦海水浴場（弓なりの海岸線・遊泳期間と時間・飲酒後の遊泳禁止など）／
 *     https://www.city.hitachinaka.lg.jp/shiminkatsudo/bunka/1002389/1008219/1002443.html 虎塚古墳（7世紀はじめ・全長56.5m・昭和48年に彩色壁画・春と秋に石室を公開・国指定史跡）と検索結果（隣の埋蔵文化財調査センターに壁画のレプリカ・月曜休館）
 * 座標: OSM — 大洗磯前神社 way 416524886・大洗サンビーチ海水浴場 way 414528384・めんたいパーク大洗 way 432710241・涸沼自然公園 way 358619576・親沢公園 way 476016287・網掛公園 way 476016286・
 *   国営ひたち海浜公園 relation 7100484（Nominatim の中心）／那珂湊おさかな市場 node 4149451855・酒列磯前神社 node 7721020599・阿字ヶ浦海水浴場 node 2349094219・虎塚古墳 node 7721020604（node は API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-172-57863f76.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "57863f76-862a-4186-a8b0-8f2d93ee54d9";
const DAY1 = "25231ff5-c7f0-4419-ab04-82bd32741a45";
const DAY2 = "23227cda-e720-4712-961e-7aeaab2651d4";
const SUNBEACH = "a6e8f9dc-f17c-453f-984a-010406cfd7cd";
const MENTAI = "6b93b52c-2c05-4710-a8d0-8db69d4a169a";
const ISOSAKI = "4f052494-9660-4aa3-ba03-daeeedc4060e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "大洗磯前神社にお参りしてから、遠浅の大洗サンビーチで海水浴。昼食のあとは、汽水湖・涸沼のほとりの公園をめぐります。2日目は夏の花が咲く国営ひたち海浜公園から、阿字ヶ浦の海と、壁画の残る虎塚古墳へ。夏の大洗とひたちなかを楽しむ、レンタカーの1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type Item = ReturnType<typeof upd> | ReturnType<typeof cre>;

const D1: Item[] = [
  upd(ISOSAKI, { h: 9, m: 0, stay: 40, legs: [], lat: 36.3158072, lng: 140.5877519, address: "茨城県東茨城郡大洗町磯浜町6890",
    memo: "この旅は車でめぐります。JR水戸駅の近くでレンタカーを借りて、車で約30分。今の社殿は、水戸藩主の徳川光圀が造営を始め、のちの綱條の代の1730年に完成したもので、本殿と拝殿は茨城県の文化財です。参道の入口に立つ一の鳥居は、高さが16mあまりあります。社殿の下の海岸の岩の上に立つ「神磯の鳥居」は、神が降り立ったと伝わる場所です。岩場は波をかぶって滑りやすいので、近づきすぎないようにしましょう。" + PRAY }),
  upd(SUNBEACH, { h: 9, m: 50, stay: 100, legs: [car(10)], lat: 36.2951441, lng: 140.5619141, address: "茨城県東茨城郡大洗町港中央",
    memo: "神社から車で約10分。遠浅の海に広い砂浜が続く海水浴場で、昭和59年に開かれました。体の不自由な人や年を重ねた人も安心して海を楽しめる「ユニバーサルビーチ」の考えで整えられていて、砂の上を進める水陸両用の車いすの貸し出しもあります。泳ぐときは決められた区域の中で泳ぎ、監視員の指示に従いましょう。遊泳の期間は公式の案内で確かめましょう。" }),
  upd(MENTAI, { h: 11, m: 40, stay: 50, legs: [car(10)], lat: 36.3116084, lng: 140.5779082, address: "茨城県東茨城郡大洗町磯浜町8255-3",
    memo: "ビーチから車で約10分、大洗港のそばへ。ガラスごしに明太子をつくる工場を見学できる施設で、明太子を使った料理のフードコートがあるので、ここで昼食にしましょう。" }),
  cre("涸沼自然公園", { h: 13, m: 0, stay: 100, legs: [car(30)], lat: 36.285928, lng: 140.5028521, address: "茨城県東茨城郡茨城町中石崎2263",
    memo: "大洗港から西へ車で約30分。海水と淡水がまじり合う汽水湖・涸沼は、2016年にラムサール条約の湿地に登録されました。そのほとりの広い公園で、「太陽の広場」からは涸沼を一望でき、梅雨のころには約1万株のあじさいが咲きます。涸沼にすむ珍しいトンボ・ヒヌマイトトンボにちなむ赤い橋も架かっています。生きものはとらずに、見るだけにしましょう。" }),
  cre("親沢公園", { h: 14, m: 50, stay: 45, legs: [car(10)], lat: 36.277794, lng: 140.4788801, address: "茨城県東茨城郡茨城町",
    memo: "自然公園から涸沼の岸沿いに車で約10分。松が茂る古くからの景勝地で、「親沢の鼻」は茨城県の名勝に指定されています。晴れた日には湖の向こうに筑波山が見え、夕日の美しい場所として多くの写真愛好家が訪れます。水辺では足元に気をつけましょう。" }),
  cre("網掛公園", { h: 15, m: 40, stay: 50, legs: [car(5)], lat: 36.2715099, lng: 140.4835957, address: "茨城県東茨城郡茨城町網掛52",
    memo: "親沢公園から車で約5分、入り江の向かい側へ。野鳥の観察台がある見晴らしのよい公園で、涸沼の水辺に集まる鳥を眺められます。鳥には近づきすぎず、食べ物を与えないようにしましょう。近くには人が暮らしているので、大きな声を出さず静かに過ごしましょう。今夜は、車で約35分の大洗の宿に泊まります。" }),
];

const D2: Item[] = [
  cre("国営ひたち海浜公園", { h: 9, m: 30, stay: 100, legs: [], lat: 36.4025276, lng: 140.5943473, address: "茨城県ひたちなか市馬渡",
    memo: "大洗の宿から、車で約25分のひたちなかへ。太平洋に面した広い国営公園で、夏にはジニアやヒマワリが園内を彩ります。海抜100mからの眺めを楽しめる大観覧車などもあります。園内は広いので、日差しの強い日は帽子をかぶり、こまめに水分をとりましょう。" }),
  cre("那珂湊おさかな市場", { h: 11, m: 35, stay: 50, legs: [car(25)], lat: 36.3398619, lng: 140.5945224, address: "茨城県ひたちなか市湊本町19-8",
    memo: "公園から車で約25分。鮮魚の店や水産加工品の店が軒を連ねる市場で、新鮮な魚を使った料理を出す食事処もあるので、ここで昼食にしましょう。" }),
  cre("酒列磯前神社", { h: 12, m: 40, stay: 40, legs: [car(15)], lat: 36.3825735, lng: 140.623403, address: "茨城県ひたちなか市磯崎町4607-2",
    memo: "市場から車で約15分。参道には樹齢300年を超えるヤブツバキやタブノキが約300mにわたって茂り、木々のトンネルのようになっています。この樹叢は茨城県の天然記念物です。" + PRAY }),
  cre("阿字ヶ浦海水浴場", { h: 13, m: 30, stay: 100, legs: [car(10)], lat: 36.3873666, lng: 140.6155447, address: "茨城県ひたちなか市阿字ヶ浦町",
    memo: "神社から車で約10分。弓なりにのびる美しい海岸線の海水浴場で、もう一度海を楽しみましょう。泳ぐのは決められた時間と区域の中で、監視員の指示に従い、お酒を飲んだあとは泳がないようにしましょう。遊泳の期間は公式の案内で確かめましょう。" }),
  cre("虎塚古墳", { h: 15, m: 35, stay: 55, legs: [car(25)], lat: 36.3733821, lng: 140.5698715, address: "茨城県ひたちなか市中根",
    memo: "海水浴場から車で約25分。7世紀のはじめごろにつくられた、全長56.5mの前方後円墳で、昭和48年の発掘で、石室の中に赤い色で三角の模様や武具を描いた壁画が見つかりました。石室の公開は春と秋に限られますが、隣の埋蔵文化財調査センターでは壁画のレプリカを見られます。休館日は公式の案内で確かめましょう。帰りは、車で約30分のJR水戸駅の近くでレンタカーを返しましょう。" }),
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
  if (it.days.map((d) => d.id).join() !== [DAY1, DAY2].join() || it.days[0].spots.map((s) => s.id).join() !== [SUNBEACH, MENTAI].join() || it.days[1].spots.map((s) => s.id).join() !== ISOSAKI)
    throw new Error("構成が想定と違います");
  show("1日目", D1);
  show("2日目", D2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: ISOSAKI }, data: { dayId: DAY1, orderNo: 901 } });
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

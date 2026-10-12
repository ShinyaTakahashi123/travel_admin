/**
 * #236 0534e5d3「雪の白川郷と飛騨高山。冬の合掌造り集落をめぐる旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 09:00〜15:00・2日目 5か所 09:45〜13:45 で、終わりが早く、2日目の始まりも9:30より遅く、昼食の一文がなく、本文はすべて案内の話し方（「皆様」「ご案内いたします」）。
 *   「日本三大朝市」「日本三大曳山祭」などの言い切りもあった。季節は冬だけ（winter）のまま
 * 1日目（歩き、高山に泊まる）: 宮川朝市 9:00 → 高山祭屋台会館 → 櫻山八幡宮 → 古い町並（昼食）→ 飛騨国分寺 → 中橋 → 高山陣屋 16:30
 * 2日目（路線バスと歩き）: 和田家 9:30 → 明善寺郷土館 → 神田家 → 白川郷・荻町集落（昼食）→ 荻町城跡展望台 → 飛騨の里 16:30 → 高山駅
 * 説明文: ライトアップは約束しない形にする（夜の催しは書かない）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   飛騨高山旅ガイド（高山市公式）https://www.hidatakayama.or.jp/spot/detail_<番号>.html —
 *     1127 宮川朝市（宮川の東岸、鍛冶橋から弥生橋の約700m・毎朝・野菜や漬物、民芸品・冬は雪かきから始まり、ひっそりとした雰囲気）／
 *     1126 陣屋前朝市（高山の朝市の起源は文政3年ごろ高山別院を中心に開かれた桑市）／
 *     1108 高山祭屋台会館（櫻山八幡宮の境内・秋の祭の11台の屋台のうち4台を年3回入れ替えて展示・「動く陽明門」とも称えられる）／
 *     1179 櫻山八幡宮（地域の厚い信仰・秋の高山祭は櫻山八幡宮の例祭）／
 *     1101 古い町並（江戸時代の城下町、商人町・三筋の通りは国の重要伝統的建造物群保存地区・町家や造り酒屋・飛騨春慶塗などの工芸の店・飲食店・7軒の造り酒屋）／
 *     1114 中橋（陣屋と古い町並をつなぐ朱色の橋・冬は雪に彩られる・下流の筏橋から全景）／
 *     1106 高山陣屋（飛騨国を治めた幕府の役所・幕末に全国60数か所あったとされる郡代・代官所のうち、当時の建物がほぼ完全に残るのは高山陣屋だけ・安永6年に郡代に格上げ・御役所、白洲）／
 *     1104 飛騨の里（飛騨地方の古い民家を移築復元した屋外博物館・合掌造りや茅葺き屋根の民家・急勾配の屋根は豪雪の雪の重みから家を守る工夫・生活道具の展示）
 *   高山市 飛騨国分寺の大イチョウ https://www.city.takayama.lg.jp/kurashi/1000021/1000119/1000847/1000994/1000995.html 、飛騨国分寺 公式 https://hidakokubunji.jp/
 *     （創建から約1300年・大イチョウは国の天然記念物、行基が植えたとも伝わる・三重塔は文政4年の竣工で岐阜県の重要文化財）
 *   白川郷観光協会 https://shirakawa-go.gr.jp/active/<番号>/ — 13 和田家（世界遺産地区内で最大級の合掌造り・唯一国の重要文化財・名主や番所役人・今も住居として1、2階を公開）／
 *     12 明善寺郷土館（真宗大谷派の寺・本堂、庫裏、鐘楼が合掌造りのまま・本堂に浜田泰介の障壁画・囲炉裏を毎日焚く）／
 *     4 神田家（完成までに約10年・床下の焔硝づくりの場所・水曜定休）／
 *     https://shirakawa-go.gr.jp/shop/ （集落の食事処・そばや郷土料理）
 *   白川村 https://www.vill.shirakawa.lg.jp/1284.htm （荻町城跡: 断崖の中世の山城・和田家の東から歩道で登るコースと車道・展望台から荻町の集落の眺め）／展望台シャトルバス（観光協会）
 * 座標: OSM — 宮川朝市 node 2291055940・飛騨国分寺 node 4369730055・荻町城跡展望台 node 2325707789・白川郷 node 683765481（historic=unesco_world_heritage）（node は API で名前つきを確かめた）／
 *   高山屋台会館 way 490918179・桜山八幡宮 way 1321807790・三町伝統的建造物群保存地区 way 1514383783・中橋 way 26830736（bridge）・高山陣屋 way 240742820・飛騨の里 way 585276392・
 *   和田家住宅 way 236248621・明善寺 way 1260591574（way は Nominatim の中心）
 *   推定: 神田家は建物の点がないので、OSM の家の前の案内板「神田家」node 5599670545
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-236-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0534e5d3-5ada-405b-8781-ed4c0414dc75";
const DAY1 = "3bb05cca-ee70-47be-a5b8-b742b84f13a7";
const DAY2 = "d99d189d-1593-4b9c-8072-2a819d32afaf";
const ASAICHI = "8887443d-31ca-4c3c-97d5-14cde83059e4";
const JINYA = "464a5142-7c70-4eec-85fb-6c625d958a03";
const SANMACHI = "706ee2f0-3d5e-4fb2-9ad0-96db97d8db11";
const YATAI = "ebaf2121-00f6-4a9e-bad2-d45d70b94287";
const KOKUBUNJI = "619dcab9-2a4c-4a6d-8438-682cf00d614f";
const OGIMACHI = "c840694c-97f1-4336-bccc-93a9f743e87b";
const WADA = "5512710b-7b02-42df-aa7c-d1fec8710819";
const MYOZENJI = "b3a80e59-c6e4-4d52-8d20-ff73f99aaee4";
const KANDA = "8b2605be-c7a5-441c-9018-c15038a4f4e6";
const TENBODAI = "45be5af2-ae7b-44b8-a0a5-6dc6243a680d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const SNOW = "冬は雪や凍った道で滑りやすいので、滑りにくい靴でゆっくり歩きましょう。";

const DESCRIPTION =
  "1日目は朝市から始めて、祭屋台の会館や古い町並、飛騨国分寺、高山陣屋と、雪の飛騨高山を歩いてめぐります。2日目はバスで世界遺産の白川郷へ。合掌造りの家々を訪ね、展望台から雪の集落を見渡したあと、高山へ戻って飛騨の里で古い民家の暮らしにふれる、冬の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const D1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(ASAICHI, { h: 9, m: 0, stay: 40, legs: [], lat: 36.1446938, lng: 137.2578518, address: "岐阜県高山市下三之町",
    memo: "1日目は歩いてめぐります。JR高山駅から歩いて約10分。宮川の東の岸、鍛冶橋から弥生橋までの約700mの川沿いで、毎朝開かれる朝市です。地元で採れた野菜や漬物、民芸品などが並び、作った人から直接買えます。高山の朝市は、江戸時代の文政のころ、桑の市として始まったといわれます。冬は雪かきから始まり、ほかの季節よりひっそりとした雰囲気の中で、ゆっくり品定めができます。" + SNOW }),
  upd(YATAI, { h: 9, m: 55, stay: 60, legs: [walk(15)], lat: 36.1484179, lng: 137.2600988, address: "岐阜県高山市桜町178",
    memo: "朝市から宮川沿いを北へ歩いて約15分。櫻山八幡宮の境内にある会館で、秋の高山祭で曳かれる11台の屋台のうち4台を、年に3回入れ替えながら展示しています。精巧な彫刻や飾りから「動く陽明門」とも称えられる屋台を、一年中、間近で見られます。" }),
  cre("櫻山八幡宮", { h: 11, m: 0, stay: 30, legs: [walk(5)], lat: 36.1482581, lng: 137.2605415, address: "岐阜県高山市桜町178",
    memo: "屋台会館から境内を歩いてすぐ（約5分）。「八幡さま」と呼ばれ、地域の人々の厚い信仰を集めてきた神社で、秋の高山祭はこの神社の例祭です。雪の積もった境内の森を、静かに歩きましょう。" + PRAY }),
  upd(SANMACHI, { h: 11, m: 50, stay: 90, legs: [walk(20)], lat: 36.1414894, lng: 137.2595909, address: "岐阜県高山市上三之町",
    memo: "八幡宮の参道を南へ下り、歩いて約20分。江戸時代に城下町、商人町として栄えた地区で、三筋の通りは国の重要伝統的建造物群保存地区に選ばれています。町家や造り酒屋が今も多く残ります。飛騨春慶塗などの工芸の店や、飛騨牛や高山ラーメンなどの食事の店もあるので、町並みを歩きながら昼食にしましょう。町並みには今も人が暮らし、商いをしているので、静かに歩きましょう。" }),
  upd(KOKUBUNJI, { h: 13, m: 40, stay: 30, legs: [walk(20)], lat: 36.1435011, lng: 137.2538422, address: "岐阜県高山市総和町1-83",
    memo: "古い町並から宮川を渡り、駅の方へ歩いて約20分。創建から約1300年の歴史をもつといわれる寺で、境内の大イチョウは国の天然記念物です。このイチョウは、寺が開かれたときに行基が植えたとも伝えられています。文政4年に建てられた三重塔は、岐阜県の重要文化財です。" + PRAY }),
  cre("中橋", { h: 14, m: 30, stay: 20, legs: [walk(20)], lat: 36.1400102, lng: 137.2592047, address: "岐阜県高山市本町1丁目",
    memo: "国分寺から南東へ歩いて約20分。宮川にかかる朱色の橋で、高山陣屋と古い町並をつないでいます。冬は雪に彩られ、下流の筏橋から眺めると、橋の全景を見渡せます。橋の上は雪で滑りやすいので、足元に気をつけましょう。" }),
  upd(JINYA, { h: 14, m: 55, stay: 95, legs: [walk(5)], lat: 36.1396918, lng: 137.2576178, address: "岐阜県高山市八軒町1-5",
    memo: "中橋を渡り、歩いて約5分。江戸時代に飛騨国を治めた幕府の役所の跡で、幕末に全国に60あまりあったとされる郡代・代官所のうち、当時の建物がほぼそのまま残っているのは、ここだけとされています。郡代が政務をとった部屋や、罪を裁いた白洲などを見て歩けます。入場できる時間は公式の案内で確かめましょう。この夜は、高山の宿に泊まりましょう。" }),
];

const D2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(WADA, { h: 9, m: 30, stay: 35, legs: [], lat: 36.259924, lng: 136.9076278, address: "岐阜県大野郡白川村荻町997",
    memo: "2日目は路線バスと歩きでめぐります。高山濃飛バスセンターから朝のバスで約50分、白川郷で降りて歩いてすぐ。世界遺産の地区の中で最大級の合掌造りで、ただひとつ国の重要文化財に指定されている家です。江戸時代には名主や番所の役人を務めた家で、今も人が住みながら、1階と2階を公開しています。2階から眺める雪の集落も見どころです。" + SNOW }),
  upd(MYOZENJI, { h: 10, m: 15, stay: 35, legs: [walk(10)], lat: 36.2559101, lng: 136.9065906, address: "岐阜県大野郡白川村荻町679",
    memo: "和田家から集落の中を南へ歩いて約10分。本堂、庫裏、鐘楼が合掌造りのまま残る、ほかに例のない寺です。郷土館として公開されている庫裏では、毎日焚かれる囲炉裏の火の香りにふれられ、本堂では浜田泰介の障壁画も見られます。" + PRAY }),
  upd(KANDA, { h: 10, m: 55, stay: 35, legs: [walk(5)], lat: 36.257645, lng: 136.9074623, address: "岐阜県大野郡白川村荻町796",
    memo: "明善寺から歩いて約5分。完成までに約10年をかけたと伝わる合掌造りの家で、中に入って、屋根を支える組み方や内部の造りを見られます。床下には、火薬の原料の焔硝をつくっていた場所も残ります。休みの曜日があるので、公式の案内で確かめましょう。" }),
  upd(OGIMACHI, { h: 11, m: 35, stay: 75, legs: [walk(5)], lat: 36.2573454, lng: 136.9068317, address: "岐阜県大野郡白川村荻町",
    memo: "神田家から歩いてすぐ。合掌造りの家が集まる荻町の集落で、世界遺産に登録されています。集落の中には、そばや郷土料理を味わえる食事の店があるので、ここで昼食にしましょう。家々の多くは今も人が暮らす住まいなので、敷地に入ったり、家の中をのぞいたりしないようにしましょう。" + SNOW }),
  upd(TENBODAI, { h: 13, m: 0, stay: 40, legs: [{ mode: "bus", min: 10, line: "白川郷 展望台シャトルバス" }], lat: 36.2629545, lng: 136.9079634, address: "岐阜県大野郡白川村荻町",
    memo: "集落からシャトルバスで約10分。断崖の上に築かれた中世の山城の跡で、展望台からは、雪をかぶった合掌造りの家々と、まわりの山々を見渡せます。冬は和田家の東から登る歩道が凍ることもあるので、シャトルバスを使うと安心です。シャトルバスの時刻は公式の案内で確かめましょう。" }),
  cre("飛騨の里", { h: 14, m: 50, stay: 100, legs: [{ mode: "bus", min: 10, line: "白川郷 展望台シャトルバス" }, { mode: "bus", min: 50, line: "濃飛バス" }, { mode: "bus", min: 10 }], lat: 36.1314919, lng: 137.2357015, address: "岐阜県高山市上岡本町",
    memo: "展望台からシャトルバスで集落へ戻り、路線バスで高山へ戻って、バスに乗り換えて飛騨の里へ（あわせて約1時間10分）。飛騨地方の古い民家を移築して復元した屋外博物館で、合掌造りや茅葺き屋根の家々が並びます。急な茅葺き屋根は、雪の重みから家を守るための工夫で、家の中には囲炉裏や昔の暮らしの道具も展示されています。白川郷で見た合掌造りと見比べながら歩きましょう。" + SNOW + "帰りはバスで高山駅へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] 季節 ${it.seasons.join(",")}`);
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || it.days[0].spots.map((s) => s.id).join() !== [ASAICHI, JINYA, SANMACHI, YATAI, KOKUBUNJI].join() || it.days[1].spots.map((s) => s.id).join() !== [OGIMACHI, WADA, MYOZENJI, KANDA, TENBODAI].join()) throw new Error("構成が想定と違います");
  const names = new Map(it.days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));
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
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? names.get(x.id) + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
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

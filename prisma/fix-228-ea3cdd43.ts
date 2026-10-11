/**
 * #228 ea3cdd43「東山温泉に泊まる、鶴ヶ城と武家屋敷をめぐる会津1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 2か所 10:00〜17:00（鶴ヶ城のあと16時まで空き）・2日目 1か所 09:30〜10:20 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   「日本で唯一」「難攻不落」「美肌の湯」「土方歳三の傷を癒やした」など、確かめられない言い方や効き目を思わせる言い方があった。タイトルの武家屋敷も入っていなかった
 * 路線バスと歩きの旅（会津若松駅から、まちなか周遊バス「ハイカラさん」「あかべぇ」を使う。東山温泉に泊まる）:
 *   1日目: 鶴ヶ城 9:30 → 鶴ヶ城会館（昼食）→ 福島県立博物館 → 御薬園 → 東山温泉 16:30（泊）
 *   2日目: 会津藩主松平家墓所 9:00 → 飯盛山 → さざえ堂 → 旧滝沢本陣 → 会津武家屋敷（昼食）→ 阿弥陀寺 16:30 → 七日町駅・会津若松駅
 *   会津若松のほかのしおり（#4edee965・#28ec8b18・#58c64d69・#c3b9522c・#e1871a37）と同じ場所が多いので、取り上げることを変えて文を別に書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 会津若松観光ナビ（会津若松観光ビューロー） https://www.aizukanko.com/spot/<番号> —
 *   134 鶴ヶ城天守閣（約630年前に葦名直盛の東黒川館が始まりといわれる・戊辰戦争で約1か月の攻防・明治7年に取り壊し・昭和40年に再建・平成12年に干飯櫓と南走長屋を復元・天守の内部は博物館・平成23年に赤瓦・現存の天守で国内唯一の赤瓦）／
 *   186 鶴ヶ城会館（北出丸入口のレストハウス・郷土料理のわっぱ飯・ソースカツ丼・会津漆器や本郷焼のお土産）／
 *   49 福島県立博物館（旧石器時代から現代までの福島の歴史と文化・民俗、自然、考古、歴史、美術の展示室・9:30〜17:00 入館16:30）／
 *   136 御薬園（大名型山水庭園で国の名勝・約600年前に霊泉が湧く地に別荘・薬草園・戊辰戦争で新政府軍の療養所となり戦火を免れた・御茶屋御殿）／
 *   26 東山温泉（約1300年前に行基が見つけたと言われる・奥羽三楽郷・竹久夢二や与謝野晶子・会津の奥座敷）／
 *   27 松平家墓所（二代保科正経から九代容保まで・昭和62年に国の史跡・通称「院内御廟」・約15万平方メートル・三代から九代は神式）／
 *   137 白虎隊十九士の墓（白虎士中二番隊・16〜17歳・戸ノ口原から飯盛山へ・春と秋の墓前祭）／
 *   138 さざえ堂（寛政8年・高さ16.5m・六角三層・円通三匝堂・二重らせんのスロープ・上りと下りが別の一方通行・平成8年に国の重要文化財）／
 *   139 旧滝沢本陣（殿様の休息所・戊辰戦争の本営・白虎隊が出陣の命を受けた・茅葺きの書院・国の重要文化財・弾痕や刀傷）／
 *   46 会津武家屋敷（家老西郷頼母邸・2300坪・歴史資料館・陣屋・赤べこや起上り小法師の絵付け体験・食事処）／
 *   226 阿弥陀寺（鶴ヶ城本丸から移された御三階・外は三階で中は四層・戊辰戦争の戦死者の墓地・斎藤一の墓）
 * 座標: OSM — 鶴ヶ城 way 24270507・福島県立博物館 node 423793540・御薬園 way 235463581・旧滝沢本陣 way 211223924・会津武家屋敷 way 397739223（way は Nominatim の中心）／
 *   鶴ヶ城会館 node 423793541・飯盛山 node 2485922809・さざえ堂 node 6763912264・阿弥陀寺 node 2047585904（node は API で名前つきを確かめた）
 *   推定: 東山温泉は温泉街の点がないので、OSM のバス停「東山温泉駅」node 2272244943。会津藩主松平家墓所は墓所全体の点がないので、墓所の中の OSM「正三位松平容保之墓」node 6533751823
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-228-ea3cdd43.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ea3cdd43-7a1b-42cd-9f79-74d123ffc6d9";
const DAY1 = "59083e54-a260-43ea-a353-da0991fce45c";
const DAY2 = "0f247ec5-61cc-432c-8c7b-9569815e25ea";
const TSURUGA = "da31c53e-664a-476c-8296-c7090c41555b";
const HIGASHIYAMA = "7f2a2f2e-4f62-47e2-8573-a96ea1df148b";
const IIMORI = "d7d4ad4c-dfb6-4eb6-8795-6dba74557403";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BUS = "会津バス まちなか周遊バス";

const DESCRIPTION =
  "赤瓦の天守の鶴ヶ城から、福島県立博物館、大名庭園の御薬園をめぐり、会津の奥座敷・東山温泉に泊まります。2日目は藩主の眠る院内御廟から、飯盛山とさざえ堂、旧滝沢本陣、家老の屋敷を伝える会津武家屋敷、阿弥陀寺へと、戊辰戦争の歴史をたどる、バスと歩きの1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const D1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(TSURUGA, { h: 9, m: 30, stay: 110, legs: [], lat: 37.4877353, lng: 139.9297661, address: "福島県会津若松市追手町1-1",
    memo: "この旅はバスと歩きでめぐります。JR会津若松駅から、まちなか周遊バスで約20分の鶴ヶ城北口へ。約630年前、葦名直盛が築いた館が始まりといわれる城で、戊辰戦争では約1か月にわたる攻防に耐えました。明治7年に取り壊されたあと、昭和40年に天守が再建され、平成23年には幕末の姿にならって赤瓦に葺き替えられました。天守の中は博物館になっていて、会津の歴史を学べます。天守の階段は急なので、足元に気をつけましょう。" }),
  cre("鶴ヶ城会館", { h: 11, m: 35, stay: 50, legs: [{ mode: "walk", min: 15 }], lat: 37.489696, lng: 139.9317977, address: "福島県会津若松市追手町4-47",
    memo: "天守から城の北へ歩いて約15分、北出丸の入口へ。城のそばのレストハウスで、郷土料理のわっぱ飯などが味わえるので、ここで昼食にしましょう。会津漆器や会津本郷焼などのお土産もそろいます。" }),
  cre("福島県立博物館", { h: 12, m: 35, stay: 85, legs: [{ mode: "walk", min: 10 }], lat: 37.4888744, lng: 139.9346302, address: "福島県会津若松市城東町1-25",
    memo: "鶴ヶ城会館から城の東へ歩いて約10分。旧石器時代から現代までの福島の歴史と文化を、時代ごとに紹介する県立の博物館です。民俗や自然、考古、美術などのテーマごとの展示室もあります。休館日は公式の案内で確かめましょう。" }),
  cre("御薬園", { h: 14, m: 20, stay: 60, legs: [{ mode: "walk", min: 20 }], lat: 37.4910814, lng: 139.9439165, address: "福島県会津若松市花春町8-1",
    memo: "博物館から歩いて約20分。約600年前、霊泉の湧くこの地に領主が別荘を建てたのが始まりといわれ、のちに薬草を育てる薬草園が設けられたことから「御薬園」と呼ばれるようになりました。江戸時代の大名の庭園として国の名勝に指定されています。戊辰戦争では新政府軍の療養所として使われたため、戦火を免れて昔の姿をとどめています。池のまわりでは足元に気をつけましょう。" }),
  upd(HIGASHIYAMA, { h: 15, m: 50, stay: 40, legs: [{ mode: "bus", min: 30, line: BUS }], lat: 37.4787771, lng: 139.9603992, address: "福島県会津若松市東山町大字湯本字滝ノ湯110",
    memo: "御薬園からまちなか周遊バスで約30分、山あいの温泉街へ。約1300年前に名僧・行基が見つけたと言われる温泉で、奥羽三楽郷のひとつに数えられ、竹久夢二や与謝野晶子などの文人にも愛されてきました。川沿いの温泉街を歩いたら、この夜は東山温泉の宿に泊まりましょう。" }),
];

const D2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("会津藩主松平家墓所", { h: 9, m: 0, stay: 50, legs: [], lat: 37.4859587, lng: 139.9580996, address: "福島県会津若松市東山町大字石山字墓山",
    memo: "この日もバスと歩きでめぐります。東山温泉の宿から歩いて約20分。会津藩の二代藩主・保科正経から幕末の九代藩主・松平容保までが眠る墓所で、通称「院内御廟」と呼ばれ、国の史跡に指定されています。約15万平方メートルの広い墓域で、三代から九代の藩主は、全国でも珍しい神式で葬られています。石段が続くので、足元に気をつけましょう。お墓の前では、静かに、敬意をもって手を合わせましょう。" }),
  upd(IIMORI, { h: 10, m: 20, stay: 40, legs: [{ mode: "walk", min: 10 }, { mode: "bus", min: 20, line: BUS }], lat: 37.5035853, lng: 139.9559331, address: "福島県会津若松市一箕町八幡弁天下",
    memo: "墓所からバス停へ歩き、まちなか周遊バスで飯盛山下へ（あわせて約30分）。戊辰戦争のとき、16〜17歳の少年たちで編成された白虎士中二番隊が、戸ノ口原の戦場から退いてたどり着き、命を落とした地です。山の中腹には十九士の墓があり、春と秋には墓前祭が行われます。石段が急なので、足元に気をつけましょう。お墓の前では、静かに、敬意をもって手を合わせましょう。" }),
  cre("さざえ堂", { h: 11, m: 5, stay: 25, legs: [{ mode: "walk", min: 5 }], lat: 37.504577, lng: 139.9539971, address: "福島県会津若松市一箕町八幡弁天下",
    memo: "十九士の墓から歩いて約5分。寛政8年に建てられた高さ16.5mの六角三層のお堂で、正式な名は「円通三匝堂」です。二重のらせん状のスロープで、上りと下りがまったく別の通路になっている珍しい造りで、国の重要文化財に指定されています。スロープは傾きがあるので、足元に気をつけましょう。" }),
  cre("旧滝沢本陣", { h: 11, m: 40, stay: 35, legs: [{ mode: "walk", min: 10 }], lat: 37.5062225, lng: 139.952831, address: "福島県会津若松市一箕町滝沢122",
    memo: "さざえ堂から歩いて約10分。藩主が参勤交代や領内の見回りのときに休んだ場所で、戊辰戦争では本営となり、白虎隊もここで出陣の命を受けました。茅葺きの書院造りの建物は国の重要文化財で、柱などには今も弾の跡や刀の傷が残ります。" }),
  cre("会津武家屋敷", { h: 12, m: 40, stay: 150, legs: [{ mode: "bus", min: 25, line: BUS }], lat: 37.4855462, lng: 139.953534, address: "福島県会津若松市東山町石山院内1",
    memo: "本陣の近くのバス停から、まちなか周遊バスで約25分。会津藩の家老・西郷頼母の屋敷を中心に、約2300坪の敷地に歴史資料館や陣屋などが並ぶ施設です。けやきやひのきを使った屋敷の中を歩くと、会津の武士の暮らしぶりがしのばれます。施設の中に食事処があるので、ここで昼食にしましょう。赤べこや起上り小法師の絵付けも体験できます。" }),
  cre("阿弥陀寺", { h: 15, m: 35, stay: 55, legs: [{ mode: "bus", min: 25, line: BUS }], lat: 37.5007968, lng: 139.9193267, address: "福島県会津若松市七日町4-20",
    memo: "武家屋敷から、まちなか周遊バスで約25分の七日町へ。境内の「御三階」は、もとは鶴ヶ城の本丸にあった建物で、外からは三階に見えますが、中は四層になっていて、密議に使われたといわれます。戊辰戦争で亡くなった人たちの墓地もあり、新選組の斎藤一の墓もあります。" + PRAY + "帰りは、すぐそばのJR七日町駅から列車で会津若松駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || it.days[0].spots.map((s) => s.id).join() !== [TSURUGA, HIGASHIYAMA].join() || it.days[1].spots.map((s) => s.id).join() !== IIMORI) throw new Error("構成が想定と違います");
  const names: Record<string, string> = { [TSURUGA]: "鶴ヶ城", [HIGASHIYAMA]: "東山温泉", [IIMORI]: "飯盛山" };
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

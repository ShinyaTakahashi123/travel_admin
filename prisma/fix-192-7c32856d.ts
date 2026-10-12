/**
 * #192 7c32856d「羊山公園の芝桜と秩父の街、絶景フォトジェニック日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:40 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。説明文の「例年4月中旬〜5月上旬」の日付も外す
 * 歩きの旅（西武秩父駅から歩いて、帰りも歩いて西武秩父駅へ）:
 *   羊山公園（芝桜の丘）9:30 → 慈眼寺（札所13番）→ 祭の湯（昼食）→ 今宮坊（14番）→ 西光寺（16番）→ 定林寺（17番）→ 少林寺（15番）→ 秩父神社 16:30 → 西武秩父駅
 * タイトルを内容に合わせて「羊山公園の芝桜と秩父札所、秩父神社をめぐる町歩き日帰りプラン」に、季節は春のまま、説明文は書き直す
 * 秩父のほかのしおり（b0b18b71・15185f58）の本文を読み、使っていない話で書いた（羊山公園は名の由来とふれあい牧場、秩父神社は柞の森と知恵の神、権現造りの本殿）。
 *   札所の5か寺と祭の湯の昼食はほかのしおりにない（祭の湯は 15185f58 にあるが、温泉の話は使わず食事の話だけにした）。少林寺の秩父事件の話は入れない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   秩父観光協会 chichibuji.gr.jp/spot/spot-syousai10/ 羊山公園（戦前に県の緬羊種畜場があり羊山と呼ぶ・芝桜の丘は約17,600㎡に40万株以上・花のパッチワーク・ふれあい牧場・武甲山資料館）と
 *   秩父市観光 navi.city.chichibu.lg.jp/p_flower/1808/（武甲山のふもと・関東でも有数の規模・見ごろは年によって変わる・混雑）／spot-syousai01/ 秩父神社（柞の森・秩父地方の総社・創建は二千年前といわれる・
 *   八意思兼命をはじめ四柱・徳川家康が再建した権現造りの本殿は埼玉県指定有形文化財・左甚五郎作のつなぎの龍・子育ての虎・お元気三猿）／
 *   秩父札所連合会 chichibufudasho.com/fudasho/jigenji/ 慈眼寺（聖観世音菩薩・明治11年の秩父大火で焼失、明治34年に再建・あめ薬師・1,630巻の経の輪蔵）／imamiyabo/ 今宮坊（大きな欅のたもとの観音堂・
 *   宝永6年再建・秩父札所でただ一つの輪廻塔）／saikoji/ 西光寺（回廊堂に四国八十八箇所の本尊の模刻・宝永7年の本堂・札所でただ一つ残る札堂、柱の釘あと・酒樽大黒天）／jorinji/ 定林寺（長享の番付で一番・
 *   秩父神社に参ってから巡礼を始めた・県の文化財の梵鐘に西国、坂東、秩父の本尊を浮き彫り・回廊と花鳥の透かし彫り）／shorinji/ 少林寺（秩父大火の教訓で白漆喰の土蔵造り・観音経を絵解きした16枚の彩色彫刻）／
 *   p_shrine/913（秩父札所34か所）／西武レジャー seibu-leisure.co.jp/matsuri/index.html 西武秩父駅前温泉 祭の湯（秩父のお祭りがコンセプト・温泉、食事、お土産を一度に）
 * 座標: OSM — 芝桜の丘 node 4695055444（leisure=garden）・慈眼寺 node 2496925167・祭の湯 node 5907862485（public_bath）・今宮坊 node 2496925153・西光寺 node 2496925165・少林寺 node 2141043525（API で名前つき）／
 *   定林寺 way 1513865577・秩父神社 way 293866479（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-192-7c32856d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7c32856d-87b9-465d-bd0c-8c3747032d79";
const DAY1_ID = "7dcae8af-9f3c-4865-b5b9-bc031f633c1e";
const HITSUJIYAMA = "8b471753-f4fb-4c23-9946-936f7722defe";
const JINJA = "b2879e42-7205-4c2b-8c56-b044841b040c";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const HOURS = "納経の時間は季節で変わるので、公式の案内で確かめましょう。";

const TITLE = "羊山公園の芝桜と秩父札所、秩父神社をめぐる町歩き日帰りプラン";
const DESCRIPTION =
  "武甲山のふもとの羊山公園で芝桜の丘を歩き、秩父の町なかに点在する秩父札所の5つの寺をめぐります。昼食は西武秩父駅前の祭の湯で。最後は柞の森の秩父神社で、名工の彫刻を見てお参りする、西武秩父駅から歩いて楽しむ春の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(HITSUJIYAMA, { h: 9, m: 30, stay: 80, legs: [], lat: 35.9812258, lng: 139.0887078, address: "埼玉県秩父市大宮6360",
    memo: "この旅は歩いてめぐります。西武秩父駅から歩いて約20分。戦前に県の緬羊の種畜場があり、羊を飼っていたことから「羊山」と呼ばれるようになった公園です。秩父のシンボル・武甲山のふもとに広がる「芝桜の丘」には、約17,600㎡に40万株以上の芝桜が、色を組み合わせて植えられ、まるで花のパッチワークのような景色になります。関東でも有数の規模とされる芝桜の丘です。羊とふれあえる牧場や、武甲山資料館もあります。花の見ごろは年によって変わり、混み合うこともあるので、公式の案内で確かめましょう。" }, "羊山公園（芝桜の丘）"),
  cre("慈眼寺（秩父札所13番）", { h: 11, m: 15, stay: 20, legs: [walk(25)], lat: 35.9923956, lng: 139.0827014, address: "埼玉県秩父市東町",
    memo: "羊山公園から坂を下って歩いて約25分。秩父の町なかにある札所で、明治11年の秩父の大火で本堂を失い、明治34年に建て直されました。目を守る仏さまとして信仰されてきた「あめ薬師」がまつられ、1,630巻の経を納めた輪蔵もあります。" + HOURS + PRAY }),
  cre("西武秩父駅前温泉 祭の湯（昼食）", { h: 11, m: 40, stay: 50, legs: [walk(5)], lat: 35.9903912, lng: 139.0836665, address: "埼玉県秩父市野坂町1-16-15",
    memo: "慈眼寺から歩いて約5分。秩父の数多くのお祭りをテーマにした、西武秩父駅前の施設で、温泉のほか、食事やお土産の店がそろっています。ここで昼食にしましょう。" }),
  cre("今宮坊（秩父札所14番）", { h: 12, m: 45, stay: 25, legs: [walk(15)], lat: 35.9950587, lng: 139.0786807, address: "埼玉県秩父市中町",
    memo: "祭の湯から歩いて約15分。秩父の目抜き通りから坂を下った先、大きな欅のたもとに観音堂が建つ札所で、今の観音堂は宝永6年（1709年）に建て直されたものです。経を刻んだ石の輪を回す「輪廻塔」は、秩父札所の中でここにしかないとされます。" + HOURS + PRAY }),
  cre("西光寺（秩父札所16番）", { h: 13, m: 20, stay: 30, legs: [walk(10)], lat: 36.0005587, lng: 139.0774972, address: "埼玉県秩父市中村町",
    memo: "今宮坊から歩いて約10分。宝永7年（1710年）に建てられた本堂の奥に、四国八十八か所の札所の本尊を写した仏像がずらりと並ぶ回廊堂があります。巡礼者が木の札を打ちつけた「札堂」は、秩父札所でただ一つ残るものとされ、柱にはたくさんの釘のあとが残ります。境内には酒樽の上に立つ大黒天もいます。" + HOURS + PRAY }),
  cre("定林寺（秩父札所17番）", { h: 14, m: 5, stay: 30, legs: [walk(15)], lat: 36.0057798, lng: 139.0843212, address: "埼玉県秩父市桜木町",
    memo: "西光寺から歩いて約15分。室町時代の長享2年（1488年）の札所の番付では一番だった寺で、昔の巡礼者は秩父神社にお参りしてから、ここで巡礼を始めたといわれます。県の文化財の梵鐘には、西国・坂東・秩父の札所の本尊が浮き彫りにされています。観音堂の正面には、花や鳥の透かし彫りが施されています。" + HOURS + PRAY }),
  cre("少林寺（秩父札所15番）", { h: 14, m: 55, stay: 30, legs: [walk(20)], lat: 35.9952331, lng: 139.085269, address: "埼玉県秩父市番場町",
    memo: "定林寺から歩いて約20分、秩父神社の近くへ。明治11年の秩父の大火で焼けた教訓から、本堂は火に強い白い漆喰の土蔵造りで建て直されました。堂の中には、観音経の教えを絵で表した16枚の彩色の彫刻があります。" + HOURS + PRAY }),
  upd(JINJA, { h: 15, m: 30, stay: 60, legs: [walk(5)], lat: 35.9975821, lng: 139.0842446, address: "埼玉県秩父市番場町1-3",
    memo: "少林寺から歩いて約5分。町の真ん中の「柞（ははそ）の森」にたたずむ、秩父地方の総社で、創建は二千年前ともいわれます。知恵の神とされる八意思兼命をはじめ四柱の神をまつり、徳川家康が建て直した権現造りの本殿は、埼玉県の文化財です。社殿には、左甚五郎の作と伝わる「つなぎの龍」や、「子育ての虎」「お元気三猿」などの彫刻がほどこされています。帰りは、西武秩父駅まで歩いて約15分です。" + PRAY }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [HITSUJIYAMA, JINJA].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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

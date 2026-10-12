/**
 * #199 97f2f003「伊勢神宮外宮、豊受大御神を祀る「外宮先祭」の宮を巡るプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食と帰りの一言がなく、本文は案内の話し方（「お参りいただきます」）。「約1500年もの間、毎日」の言い切りもある
 * 歩きと近鉄の旅（近鉄・JR伊勢市駅から歩いて、帰りは近鉄五十鈴川駅から）:
 *   外宮 9:30 → せんぐう館 → 月夜見宮 → 伊勢市駅前（昼食）→ 近鉄で五十鈴川駅 → 倭姫宮 → 神宮美術館 → 神宮徴古館・農業館 16:30 → 五十鈴川駅
 * 外宮の別宮と、豊受大御神（食べ物の神）にちなむ農業館をたどる形にした。タイトル・季節はそのまま、説明文は書き直す
 * 写真: 外宮のスポットの1枚（commons File:Naiku_001.jpg）は、説明が「伊勢神宮内宮の正殿」で場所が違うので外し、表紙（同じ写真）も外す
 * 伊勢のほかのしおり（c9b3ad40・264f7d42・659dc2d8）の本文を読み、使っていない話で書いた（外宮は雄略天皇22年・1500年の毎日の神事を使わず、3つの別宮。倭姫宮は大正12年の創建ではなく
 *   神宮でいちばん新しい別宮と倭姫文化の森。徴古館は御神宝の展示ではなく片山東熊の建物）。せんぐう館・月夜見宮・神宮美術館・農業館はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（伊勢神宮 isejingu.or.jp ほか公式）:
 *   /about/geku/（豊受大御神は天照大御神の御饌都神・高倉山を背にして鎮まる・正宮と四所の別宮）／/about/geku/betsugu.html（多賀宮: 豊受大御神荒御魂・98段の石段の上・第一別宮で遷宮は正宮と同じ年／
 *   土宮: 大土乃御祖神・山田原の鎮守・大治3年に宮川堤防の守護神として別宮に・唯一東向きの別宮／風宮: 級長津彦命・級長戸辺命・正応6年に別宮・元寇のとき猛風で敵軍を追い返した）／
 *   /visit/course/（神宮の祭典は「外宮先祭」でまず外宮で行う・参拝も外宮から内宮の順がならわし）／
 *   sengukan.jp（まがたま池のほとり・外宮正殿の東側を原寸大で再現・外宮の殿舎配置の1/20の模型・御装束神宝714種1576点を新調・檜約1万本、足掛け9年・職員の展示ガイド）／
 *   /about/outerbetsugu/（月夜見宮: 月夜見尊と荒御魂・伊勢市駅から歩いて10分・樹齢数百年の楠・承元4年（1210）に別宮・外宮北御門からまっすぐ伸びる「神路通り」・摂社の高河原神社／
 *   倭姫宮: 倭姫命・近鉄五十鈴川駅から歩いて7分・大正12年に鎮座・神宮でもっとも新しい別宮・倉田山の西側の徴古館、農業館、美術館、神宮文庫のあたりを「倭姫文化の森」）／
 *   museum.isejingu.or.jp/artmuseum/（神宮美術館: 平成5年の第61回式年遷宮を記念・文化勲章受章者や人間国宝などが遷宮を奉賛して奉納した絵画・書・彫塑・工芸・大江宏の設計、中庭を囲む4つの棟）／
 *   /museum/history.html（農業館: 明治24年に建設が始まる・「自然の物産がいかに役に立つか」をテーマに農業を主に林業・水産業・平等院鳳凰堂をイメージした和洋折衷の木造／徴古館: 明治42年開館・
 *   ルネサンス式の凹型の平屋、外壁は備前焼の煉瓦・設計は赤坂離宮の片山東熊）／/guide/（開館 9:00〜16:00、観覧は16:30まで・木曜休館）
 * 座標: OSM — 外宮 way 688114973（伊勢神宮 外宮、place_of_worship）・せんぐう館 way 182850273（museum）・月夜見宮 way 561116140（place_of_worship）（Nominatim の中心）／
 *   伊勢市駅 node 265822735（railway=station）／倭姫宮 node 6470496188（place_of_worship）／神宮美術館 node 1420988340・神宮徴古館・農業館 node 1420999015（国土数値情報の公共施設の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-199-97f2f003.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "97f2f003-03cd-4f26-8b88-39b1eb45642a";
const DAY1_ID = "dbaa7b7f-c141-4317-b3e0-50c5311e9d66";
const GEKU = "c582508b-413c-4d67-8d5a-dba784662d6f";
const REMOVE_PHOTOS = ["b62d8d68-c4bd-4a16-87a0-9b7562866077"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "お祭りをまず外宮で行う「外宮先祭」にならって、食べ物の神・豊受大御神をまつる外宮から。せんぐう館で正殿の原寸大の模型を見て、神路通りを月夜見宮へ。午後は近鉄で倉田山へ向かい、倭姫宮にお参りして、神宮美術館と、自然の恵みを伝える農業館をめぐる、歩きと電車の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(GEKU, { h: 9, m: 30, stay: 70, legs: [], lat: 34.4873519, lng: 136.7036975, address: "三重県伊勢市豊川町279",
    memo: "この旅は歩きと電車でめぐります。近鉄・JR伊勢市駅から歩いて約5分。神宮のお祭りは、まず外宮で行う「外宮先祭」がならわしで、お参りも外宮から内宮へと進むのが昔からの順とされます。高倉山を背にした外宮には、天照大御神のお食事をつかさどる豊受大御神がまつられています。正宮のあとは、98段の石段を上った丘の上の多賀宮、山田の町の守り神で、別宮のなかでただ一つ東を向くとされる土宮、元寇のときに強い風で敵を退けたと伝わる風宮もめぐりましょう。参拝の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("せんぐう館", { h: 10, m: 45, stay: 55, legs: [walk(5)], lat: 34.4868729, lng: 136.706717, address: "三重県伊勢市豊川町前野126-1",
    memo: "外宮の正宮から、まがたま池のほとりへ歩いて約5分。20年ごとに社殿を建て替える式年遷宮を紹介する博物館です。外宮の正殿の東側を原寸大で再現した展示や、外宮の建物の並びを20分の1で表した模型があり、遷宮のたびに新しくつくる714種・1,576点の装束や神宝、約1万本の檜と足かけ9年をかける造営の工程も紹介しています。神宮の職員による展示の案内の時間や休館日は、公式の案内で確かめましょう。" }),
  cre("月夜見宮", { h: 11, m: 50, stay: 20, legs: [walk(10)], lat: 34.4929682, lng: 136.7059315, address: "三重県伊勢市宮後1-3-19",
    memo: "せんぐう館から外宮の北御門へ出て、まっすぐ伸びる「神路通り」を歩いて約10分。月夜見尊と、その荒御魂をまつる外宮の別宮で、鎌倉時代のはじめの承元4年（1210年）に別宮となりました。町なかにありながら、樹齢数百年の楠をはじめとする木々に囲まれています。境内には摂社の高河原神社もあります。" + PRAY }),
  cre("伊勢市駅前（昼食）", { h: 12, m: 16, stay: 56, legs: [walk(6)], lat: 34.4911349, lng: 136.7098291, address: "三重県伊勢市吹上",
    memo: "月夜見宮から歩いて約6分。駅のまわりで昼食にしましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }),
  cre("倭姫宮", { h: 13, m: 30, stay: 30, legs: [walk(3), train(8, "近鉄（伊勢市→五十鈴川）"), walk(7)], lat: 34.4852112, lng: 136.7233418, address: "三重県伊勢市楠部町5",
    memo: "伊勢市駅から近鉄で2駅の五十鈴川駅へ行き、歩いて約7分（あわせて約18分）。倭姫命をまつる内宮の別宮で、神宮の別宮のなかでもっとも新しいとされます。倉田山の森の中にあり、西側の博物館や美術館のあるあたりは「倭姫文化の森」と呼ばれています。" + PRAY }),
  cre("神宮美術館", { h: 14, m: 5, stay: 60, legs: [walk(5)], lat: 34.486637, lng: 136.723526, address: "三重県伊勢市神田久志本町1754-1",
    memo: "倭姫宮から森の中を歩いて約5分。平成5年（1993年）の式年遷宮を記念して開かれた美術館で、文化勲章を受けた人や人間国宝などが、遷宮を祝って神宮に納めた絵画・書・彫刻・工芸を展示しています。建物は建築家の大江宏が設計したもので、ゆるやかな屋根の4つの棟が中庭を囲み、広い窓から四季の庭を眺められます。" }),
  cre("神宮徴古館・農業館", { h: 15, m: 10, stay: 80, legs: [walk(5)], lat: 34.485915, lng: 136.72486, address: "三重県伊勢市神田久志本町1754-1",
    memo: "美術館から歩いて約5分。農業館は明治24年（1891年）に建て始められた展示館で、「自然の産物がどれほど役に立つか」をテーマに、農業を中心に林業や水産業の品々を紹介しています。平等院鳳凰堂を思わせる和洋折衷の木造の建物です。となりの徴古館は明治42年（1909年）に開かれ、赤坂離宮を手がけた片山東熊が設計した、外壁に備前焼の煉瓦を用いたルネサンス様式の建物です。開館の時間と休館日は公式の案内で確かめましょう。帰りは、五十鈴川駅まで歩いて約15分、近鉄で伊勢市駅へ戻りましょう。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [GEKU].join()) throw new Error("構成が想定と違います");
  const ph = it.days[0].spots[0].photos;
  if (ph.map((p) => p.id).join() !== REMOVE_PHOTOS.join() || ph[0].url !== it.thumbnailUrl) throw new Error("外す写真が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}\n写真 ${REMOVE_PHOTOS.join()} を外し、表紙を空にする`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: null } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
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

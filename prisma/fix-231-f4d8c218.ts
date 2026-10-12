/**
 * #231 f4d8c218「縄文杉トレッキング、屋久島の象徴的な巨木を訪ねる定番プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所（縄文杉（荒川登山口））06:00〜16:00・滞在600分で、本文は案内の話し方（「皆様」「お楽しみください」）
 * 例外（朝）: 企画運営 10/11 の判断。往復10時間前後の山歩きで、早朝の登山バスで出るしかないので6時台に始め、16:30〜17:00に小杉谷を出て登山口へ戻る
 * 昼食: 企画運営 10/11 の判断で、縄文杉の周辺の休憩所で、用意したお弁当を食べる形（店の名前は出さない）
 * 季節: 冬は積雪で登山に向かず（屋久島観光協会「積雪時は登山不向き」）、荒川登山バスも3月〜11月の規制期間の運行なので、seasons から winter を外す
 * 歩きの旅（安房の屋久杉自然館から荒川登山バス）:
 *   荒川登山口 6:00 → ウィルソン株 → 大王杉 → 夫婦杉 → 縄文杉（昼食・お弁当）→ 小杉谷集落跡 16:35 → 荒川登山口（登山バス）
 *   もとのスポット「縄文杉（荒川登山口）」は「荒川登山口」に名前を直し、縄文杉は新しいスポットにする
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   屋久島観光協会 https://yakukan.jp/feature/jomonsugi-course.html （トロッコ道約8.5kmと登山道約2.5km・所要9〜10時間・区間ごとの歩く時間・3〜11月は一般車両の乗入規制で屋久杉自然館発着の荒川登山バス・積雪時は登山不向き）／
 *     https://yakukan.jp/spot/7006.html （縄文杉: 標高1,300m・推定樹齢2,170年〜7,200年・現在確認されている中で最大）／
 *     https://yakukan.jp/spot/7007.html （ウィルソン株: 荒川登山口から約3時間・標高1,030m・屋久島最大の切り株・天正14年に秀吉への献上で伐採されたといわれるが不明・1914年にウィルソン博士・ハート型・混雑時は周りに配慮）
 *   屋久島町 https://www.town.yakushima.kagoshima.jp/soshiki/kanko_machizukuri/kankosushin/kankospot/yama/862.html （縄文杉: 1966年に紹介・1993年に世界自然遺産・展望デッキから観察・3月1日〜11月30日は荒川登山口への車両乗り入れ規制・屋久杉自然館から登山バス35分・山岳部環境保全協力金）／
 *     /yakusugikyoboku_chomeiki/555.html （大王杉: 縄文杉が知られるまで最大の屋久杉といわれた・急斜面で根元の上下に5.3mの落差・下部の割れ目の中は空洞・根を傷めないよう迂回）／
 *     /yakusugikyoboku_chomeiki/315.html （夫婦杉: 3mほど離れた2本の枝が10mほどの高さでつながる・これほど高い位置は珍しい）
 *   環境省 屋久島世界遺産センター https://www.env.go.jp/park/yakushima/ywhcc/tozan/jyoumon.html （展望デッキの外に出ない・食事は周辺の休憩所や高塚小屋で・トイレは荒川登山口、三代杉、大株歩道入口、高塚小屋）／
 *     https://www.env.go.jp/nature/nationalparks/list/yakushima/try/course/01/ （小杉谷: 屋久杉を切り出す仕事の人々の生活の場だった集落・林業遺産）
 * 座標: OSM — 荒川登山口 node 2044177424（highway=trailhead）・ウィルソン株 node 4435940690・大王杉 node 4869328350・夫婦杉 node 5640485723・縄文杉 node 2579982408（node は API で名前つきを確かめた）
 *   推定: 小杉谷集落跡は集落跡の点がないので、トロッコ道の OSM「小杉谷」node 8733016387（railway=halt）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-231-f4d8c218.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f4d8c218-e9a3-4143-9225-d5d49495c6c1";
const DAY_ID = "9ba528e8-70c7-4f82-9b0d-a52d9049971f";
const TOZANGUCHI = "76aa041e-5b19-4446-841f-f0e21627cc8f";
const PHOTO = "f10a0c72-02d7-48d0-890e-48de0ec0f13a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

const DESCRIPTION =
  "早朝の登山バスで荒川登山口へ向かい、トロッコ道と山道を歩いて、ウィルソン株や大王杉、夫婦杉をたどりながら縄文杉をめざす、往復10時間前後の山歩きです。縄文杉のそばの休憩所でお弁当を食べ、帰りは屋久杉を切り出した人々の集落の跡に立ち寄ります。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string; name?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ ...(s.name ? { name: s.name } : {}), visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { ...base(s), name, ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(TOZANGUCHI, { name: "荒川登山口", h: 6, m: 0, stay: 10, legs: [], lat: 30.3398577, lng: 130.5952086, address: "鹿児島県熊毛郡屋久島町",
    memo: "この旅は、早朝の登山バスで出かける往復10時間前後の山歩きです。安房の屋久杉自然館のバス停から、荒川登山バスで約35分。3月1日から11月30日までは荒川登山口へのマイカーの乗り入れが規制されるので、登山バスかタクシーなどで向かいます。バスの時刻やチケットの買い方は、前の日までに公式の案内で確かめましょう。昼食のお弁当は、前の日に安房などで買うか、宿で登山弁当を頼んでおきましょう（宿の案内で確かめましょう）。ここから約8.5kmのトロッコ道を歩き、約2.5kmの山道を登ります。トイレは荒川登山口、三代杉、大株歩道入口、高塚小屋の決められた場所で使いましょう。屋久島の山岳部では、環境保全協力金への協力が呼びかけられています。十分な体力と装備、雨具を用意し、天気を確かめ、山に慣れていない人はガイドの利用も考えましょう。野生のサルやシカには、食べ物を与えないようにしましょう。" }),
  cre("ウィルソン株", { h: 9, m: 25, stay: 20, legs: [walk(195)], lat: 30.3566437, lng: 130.5416813, address: "鹿児島県熊毛郡屋久島町",
    memo: "登山口からトロッコ道を歩き、小杉谷や大株歩道入口を過ぎて、山道を登り、あわせて約3時間15分。標高約1,030mにある、屋久島で最も大きな切り株で、中は大きな空洞になっています。天正14年に豊臣秀吉へ献上するために切られたといわれますが、確かなことはわかっていません。1914年に植物学者のウィルソン博士が見つけ、世界に紹介したことから、この名が付きました。中から見上げると、切り口がハートの形に見えることでも知られます。混み合うので、まわりの人に気を配って撮影しましょう。" }),
  cre("大王杉", { h: 10, m: 30, stay: 10, legs: [walk(45)], lat: 30.3596223, lng: 130.5363533, address: "鹿児島県熊毛郡屋久島町",
    memo: "ウィルソン株から山道を登って約45分。縄文杉が知られるまでは最も大きな屋久杉といわれ、「大王」の名が付けられた巨木です。急な斜面に立ち、根元の上と下では5.3mの差があり、下の部分の大きな割れ目の中は空洞になっています。根を傷めないよう、決められた道を歩きましょう。" }),
  cre("夫婦杉", { h: 10, m: 50, stay: 10, legs: [walk(10)], lat: 30.35925, lng: 130.535307, address: "鹿児島県熊毛郡屋久島町",
    memo: "大王杉から歩いて約10分。3mほど離れて立つ2本の巨木の枝が、10mほどの高さでつながっている杉です。根元から合わさる杉はありますが、これほど高いところでつながっているのは珍しいとされています。" }),
  cre("縄文杉", { h: 11, m: 30, stay: 60, legs: [walk(30)], lat: 30.3609667, lng: 130.5319, address: "鹿児島県熊毛郡屋久島町",
    memo: "夫婦杉から山道を登って約30分。標高約1,300mに立つ、現在確認されている中で最も大きな屋久杉とされ、樹齢は2,170年から7,200年といわれています。1966年に紹介され、1993年に屋久島が世界自然遺産に登録されてから、多くの人が訪れるようになりました。木を守るため、展望デッキの外には出ず、デッキから眺めましょう。食事は周辺の休憩所でとることになっているので、そこで用意したお弁当の昼食にしましょう。ごみはすべて持ち帰りましょう。" }),
  cre("小杉谷集落跡", { h: 16, m: 10, stay: 25, legs: [walk(220)], lat: 30.3521828, lng: 130.5781679, address: "鹿児島県熊毛郡屋久島町",
    memo: "縄文杉から来た道を戻り、大株歩道入口からトロッコ道を下って、あわせて約3時間40分。屋久杉を切り出す仕事にたずさわった人々が暮らした林業の集落の跡で、人と森とのかかわりの歴史を伝える場所です。ひと休みしたら、帰りはトロッコ道を歩いて約1時間の荒川登山口から、登山バスで屋久杉自然館へ戻りましょう。帰りのバスの時刻は、前もって公式の案内で確かめておきましょう。暗くなる前に下りられるよう、時間に余裕をもって歩きましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] 季節 ${it.seasons.join(",")}`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== TOZANGUCHI) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${d.name}${"id" in x ? "(既存)" : ""} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}\n季節: spring,summer,autumn にする`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
      // 写真（コモンズ Jomon_Sugi_07.jpg）は縄文杉の写真なので、名前を直した荒川登山口から、新しい縄文杉のスポットへ移す
      const jomon = await tx.spot.findFirstOrThrow({ where: { dayId: DAY_ID, name: "縄文杉" } });
      const moved = await tx.photo.updateMany({ where: { id: PHOTO, spotId: TOZANGUCHI }, data: { spotId: jomon.id, caption: "縄文杉" } });
      if (moved.count !== 1) throw new Error("写真を移せませんでした");
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

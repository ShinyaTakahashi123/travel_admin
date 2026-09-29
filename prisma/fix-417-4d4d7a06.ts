/**
 * チェックリスト #417 4d4d7a06「草津白根山のふもとと西の河原、自然を満喫する草津1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目（車）: 殺生河原 →（車）草津熱帯圏 → 片岡鶴太郎美術館 → 西の河原公園 → 湯畑（昼食）→ 熱乃湯 → 白根神社（7か所 09:00〜15:50）
 * 2日目: 草津山光泉寺 → 草津町温泉図書館 →（車）嫗仙の滝 →（車）草津ベルツ記念館（4か所 09:00〜13:00、帰る日）
 * 既存の3か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。湯畑は2日目から1日目へ移す。タイトルは内容に合っているのでそのまま
 * 殺生河原の座標（36.6453,138.5283）は約3.7km離れていたので OSM の噴気孔の点に直す
 * 写真: 殺生河原の写真（Kusatsu-Shiranesan03s5s4272.jpg）は渋峠から見た草津白根山の遠景で、殺生河原ではないので外す（Commons にほかの合う写真がない）。
 *   表紙だったので、湯畑の写真に替える
 * 本文の出典（草津温泉観光協会）: 殺生河原 https://www.kusatsu-onsen.ne.jp/kankou/1005.php ／草津熱帯圏 /kankou/1013.php ／片岡鶴太郎美術館 /kankou/1012.php ／
 *   西の河原公園 /kankou/1034.php ／湯畑 /kankou/1004.php ／熱乃湯 /kankou/1031.php ／白根神社 /kankou/1030.php ／光泉寺 /kankou/1028.php ／
 *   温泉図書館 /kankou/1009.php ／嫗仙の滝 /kankou/1002.php ／ベルツ記念館 /kankou/1010.php
 * 座標の出典: Nominatim（殺生河原 fumarole 36.6258948,138.5615247／草津熱帯圏 36.6225511,138.6042750／片岡鶴太郎美術館 36.6241021,138.5925225／
 *   西の河原公園 36.6243024,138.5894948／熱乃湯 36.6227061,138.5963224／光泉寺 36.6217872,138.5952984／白根神社 36.6246746,138.5962603）、
 *   OSM/Overpass（湯畑 relation 36.622927,138.5967399／嫗仙の滝駐車場 36.6122533,138.6170861（遊歩道の入口として）／ベルツ記念館 36.6146093,138.5906757）、
 *   草津町温泉図書館はバスターミナルの3階なので、Nominatim の「草津温泉バスターミナル」36.620524,138.596367 を使う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-417-4d4d7a06.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d4d7a06-3c87-44a4-93cc-0c9fc0905ac6";
const DAY1_ID = "f3f3ba41-0906-4dd3-954b-5558c0fd85ea";
const DAY2_ID = "0ef7124a-a0cf-4843-882f-a0ad8fb7c275";
const SESSHO_ID = "862304b7-de2b-4f23-8bce-ed0e2c04ed8f";
const SAINO_ID = "b357f2b7-ecbc-4e24-abca-e85fd005714e";
const YUBATAKE_ID = "dd1bfb4e-6675-40be-9f8e-b6d2a9490863";
const BUS_TERMINAL = { lat: 36.620524, lng: 138.596367 }; // Nominatim「草津温泉バスターミナル」
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "硫黄のにおいが漂う殺生河原から、温泉熱を利用したドームの草津熱帯圏、湯煙が上がる西の河原公園を歩き、草津温泉のシンボル・湯畑のまわりで昼食を。熱乃湯や白根神社もめぐります。2日目は、湯畑を見下ろす光泉寺にお参りし、急な坂の遊歩道の先にある嫗仙の滝と、「草津の恩人」ベルツ博士の記念館へ。草津白根山のふもとの自然と温泉街を楽しむ1泊2日です。草津白根山は火山活動により立ち入りや道路が規制されることがあり、志賀草津道路も冬の間は閉鎖されるので、訪れる前に最新の状況を公式の案内で確かめてください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

function build() {
  const day1 = [
    upd(SESSHO_ID, 9, 0, 30, null, null, 36.625895, 138.561525,
      "草津温泉のバスターミナルから車で約15分。月面のクレーターのような無数の噴気孔から、においの強い硫化水素の蒸気が噴き出し、まわりには硫黄の自然の結晶も見られる、動植物を寄せつけない荒々しい場所です。噴気孔のまわりは立ち入り禁止で、有毒な火山ガスが出ているので、立ち止まらず、決められた道から眺めるだけにしましょう。火山活動によって周辺の道路や立ち入りが規制されることもあるので、訪れる前に公式の案内で確かめてください。"),
    cre("草津熱帯圏", 9, 50, 70, "car", 15, 36.622551, 138.604275, "群馬県吾妻郡草津町大字草津286",
      "殺生河原から車で約15分。日本一標高の高い動物園として知られる施設で、高さ15mのドームの中は、温泉熱を利用した亜熱帯のエリアになっています。ワニやヘビ、トカゲなどの爬虫類のほか、カピバラの親子もいて、動物たちと間近でふれあえるコーナーもあります。"),
    cre("片岡鶴太郎美術館", 11, 15, 45, "walk", 15, 36.624102, 138.592523, "群馬県吾妻郡草津町（西の河原公園入口）",
      "草津熱帯圏から歩いて約15分、西の河原公園の入口にある美術館です。「温泉に来たお客さんが浴衣と下駄でぶらっと入って楽しめる美術館を」という思いから生まれ、片岡氏が墨彩画と呼ぶ書画をはじめ、陶器や漆器など約100点を展示しています。お茶を飲みながらくつろげるスペースもあります。"),
    upd(SAINO_ID, 12, 5, 55, "walk", 5, 36.624302, 138.589495,
      "美術館からすぐ。草津温泉の西にあり、あたり一面から温泉が湧き出して大量の湯煙を上げ、湯の川となって流れている公園です。その景色から、鬼が住む場所「鬼の泉水」とも呼ばれて恐れられ、この地では大声を出してはならないという言い伝えがあり、今も「鬼の茶釜」「鬼の相撲場」などの名前が残っています。温泉の流れは熱いところもあるので、手を入れたりせず、遊歩道を歩きましょう。"),
    upd(YUBATAKE_ID, 13, 15, 75, "walk", 15, 36.622927, 138.59674,
      "西の河原公園から歩いて約15分。毎分約4,000リットルもの温泉が湧き出す、草津温泉のシンボルです。湧き出た源泉は整然と並んだ7本の湯樋を通って温度を下げ、各施設へ送られています。湯樋には温泉の成分がたまって湯の花を採れることから、「湯畑」と名付けられました。八代将軍吉宗のお汲み上げの湯の石柱や湯枠もあり、湯畑を中心に温泉街が広がっています。まわりの温泉街で昼食にしましょう。",
      { name: "湯畑（昼食）" }),
    cre("熱乃湯", 14, 35, 30, "walk", 2, 36.622706, 138.596322, "群馬県吾妻郡草津町草津414",
      "湯畑のすぐそば。草津名物の「湯もみと踊り」をショーとして見られる施設で、草津温泉に古くからある共同浴場が、ショーの会場になりました。湯もみの体験ができる日もあります。公演の時間は公式の案内で確かめましょう。"),
    cre("白根神社", 15, 15, 35, "walk", 10, 36.624675, 138.59626, "群馬県吾妻郡草津町草津",
      "熱乃湯から歩いて約10分。温泉街を見下ろす囲山にある神社で、日本武尊をまつっています。明治になって、町の入口の旧社地にあった拝殿を、今の地に新築して移しました。まわりの囲山公園では、春の終わりごろにアズマシャクナゲが見ごろを迎えます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  ];
  const day2 = [
    cre("草津山光泉寺", 9, 0, 30, null, null, 36.621787, 138.595298, "群馬県吾妻郡草津町草津",
      "湯畑の源泉を見下ろす高台にある、真言宗豊山派の古刹です。僧・行基によって開かれたと伝わり、本堂のほか、薬師堂や釈迦堂、不動堂、鐘楼などがあります。境内には芭蕉の句碑もあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
    cre("草津町温泉図書館", 9, 40, 30, "walk", 10, BUS_TERMINAL.lat, BUS_TERMINAL.lng, "群馬県吾妻郡草津町草津28 草津温泉バスターミナル3階",
      "光泉寺から歩いて約10分、草津温泉バスターミナルの3階にある、図書館と資料館を併設した温泉図書館です。草津温泉の歴史を学べます。休館日は公式の案内で確かめてから訪れましょう。"),
    cre("嫗仙の滝", 10, 25, 95, "car", 15, 36.612253, 138.617086, "群馬県吾妻郡草津町（嫗仙の滝駐車場）",
      "温泉街から車で約10分。草津町の南東にある落差25mの滝で、繊細な流れが美しく、その名のとおり女性的な雰囲気です。駐車場から滝つぼまでは遊歩道を歩いて約30分で、急な坂が続くので、歩きやすい靴で足元に気をつけて歩きましょう。滝のわきでは、「森の巨人たち100選」に名を連ねる、樹高35m・幹周り6.7mのカツラの巨木が迎えてくれます。"),
    cre("草津ベルツ記念館", 12, 20, 40, "car", 20, 36.614609, 138.590676, "群馬県吾妻郡草津町",
      "嫗仙の滝から車で約20分。明治時代に「お雇い外国人」として来日し、東京医学校の教授や、天皇・皇太子の侍医を務めたエルウィン・フォン・ベルツ博士を記念する館です。博士は日記の中で、草津の温泉と山の空気、飲み水を高くたたえ、「ベルツの日記」によって草津は世界に広く知られるようになったことから、「草津の恩人」として今も町民に尊敬されています。"),
  ];
  return { day1, day2 };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== `${SESSHO_ID},${SAINO_ID}` || days[1].spots.map((s) => s.id).join() !== YUBATAKE_ID
  ) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));
  const sesshoPhoto = await prisma.photo.findMany({ where: { spotId: SESSHO_ID } });
  if (sesshoPhoto.length !== 1 || !sesshoPhoto[0].sourceUrl?.includes("Kusatsu-Shiranesan03")) throw new Error("殺生河原の写真が想定と違います");
  const yubatakePhoto = await prisma.photo.findFirstOrThrow({ where: { spotId: YUBATAKE_ID } });

  const { day1, day2 } = build();

  console.log(`表紙: ${it.thumbnailUrl}\n→ ${yubatakePhoto.url}`);
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`--- ${label}`);
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: yubatakePhoto.url } });
      await tx.photo.delete({ where: { id: sesshoPhoto[0].id } });
      await tx.spot.update({ where: { id: YUBATAKE_ID }, data: { dayId: DAY1_ID, orderNo: 9501 } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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

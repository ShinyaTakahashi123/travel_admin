/**
 * チェックリスト #404 069ec35c「富士山本宮浅間大社と白糸の滝、静岡側から望む富士山プラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。富士山本宮浅間大社 → 静岡県富士山世界遺産センター → お宮横丁（昼食）→ 白糸ノ滝 → 音止の滝 → 田貫湖 → 道の駅 朝霧高原（7か所 09:00〜16:30）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述（806年の遷座など）もあり、浅間大社の配慮の一文も「静かに」だけだったので書き直す）
 * 既存の写真（浅間大社の社殿）は目で見て合っているので残す
 * 座標の出典: Nominatim（富士山本宮浅間大社 35.2273399,138.6100189／静岡県富士山世界遺産センター 35.2237262,138.6089088／白糸の滝 35.3129910,138.5872234／
 *   田貫湖 35.3441028,138.5612793／道の駅 朝霧高原 35.4138052,138.5908566）、OSM/Overpass（音止めの滝 35.312382,138.589224／
 *   お宮横丁は横丁の中の「富士宮やきそばアンテナショップ」の点 35.224912,138.610166（横丁自体の点がないため）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-404-069ec35c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "069ec35c-7f89-4a5f-b487-6c3fa4aef8bc";
const DAY1_ID = "12b72909-ca7d-4cb9-ada2-0cd43ade4862";
const SENGEN_ID = "b65741f6-5151-4611-b379-d32200dc38fe";
const SHIRAITO_ID = "b76b357d-4247-40fc-936a-0166b05354f7";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "富士山をご神体とする富士山本宮浅間大社にお参りし、となりの世界遺産センターで富士山の信仰と文化を学んでから、門前のお宮横丁で富士宮やきそばの昼食を。午後は車で富士山の西麓へ向かい、白糸ノ滝と音止の滝、逆さ富士の田貫湖、朝霧高原の道の駅をめぐる、静岡側から富士山を楽しむ日帰りプランです。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const order = [
  {
    id: SENGEN_ID,
    data: {
      visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.22734, lng: 138.610019,
      memo:
        "全国に1300余りある浅間神社の総本宮で、駿河国一宮とされ、東海地方で最も古い社ともいわれます。ご神体は富士山で、木花之佐久夜毘売命（浅間大神）をまつっています。徳川家康が造営した本殿は国の重要文化財で、境内に湧き出る、富士山の雪解け水からなる「湧玉池」は国の特別天然記念物です。源頼朝の奉納に始まるとされる流鏑馬の祭りも行われます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    },
  },
  cre({
    name: "静岡県富士山世界遺産センター", h: 9, m: 55, stay: 60, mode: "walk", dur: 5, lat: 35.223726, lng: 138.608909, address: "静岡県富士宮市宮町5-12",
    memo:
      "浅間大社から歩いてすぐ。世界遺産の富士山を守り、未来に伝えるための拠点として2017年に開館した施設で、設計は坂茂建築設計です。県産材の木格子に覆われた展示棟は、前の水盤に映ると「逆さ富士」の姿になるように設計されています。展示棟では、1階から5階へらせん状のスロープを上りながら、登山をするような気分で富士山の信仰や文化を学べます。最上階からは、まわりの建物にさえぎられない富士山の眺めが広がります。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "お宮横丁（昼食）", h: 11, m: 0, stay: 50, mode: "walk", dur: 5, lat: 35.224912, lng: 138.610166, address: "静岡県富士宮市宮町",
    memo:
      "世界遺産センターと浅間大社の間にある横丁で、富士宮やきそばやジェラートなど、富士宮の名物が楽しめます。富士山からの湧き水を飲めるところもあり、富士宮やきそばを神としてまつる「やきそば神社」もあります。ここで昼食にしましょう。",
  }),
  {
    id: SHIRAITO_ID,
    data: {
      name: "白糸ノ滝", visitTime: t(12, 15), stayDurationMin: 50, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 35.312991, lng: 138.587223,
      memo:
        "お宮横丁から車で約25分。富士山の雪解け水が、水を通す新富士火山層と水を通さない古富士火山層の境目の絶壁から湧き出している滝です。高さ20m・幅150mの湾曲した絶壁から大小数百の滝が流れ落ち、幾筋もの絹糸をさらしたような姿から名付けられました。国の名勝・天然記念物で、日本の滝百選にも選ばれています。富士講の開祖とされる長谷川角行が修行した地とされ、世界文化遺産「富士山」の構成資産の一つです。滝の近くは水しぶきで足元がぬれて滑りやすいので、気をつけて歩きましょう。",
    },
  },
  cre({
    name: "音止の滝", h: 13, m: 10, stay: 25, mode: "walk", dur: 5, lat: 35.312382, lng: 138.589224, address: "静岡県富士宮市上井出",
    memo:
      "白糸ノ滝のとなり、芝川の本流にかかる滝で、大量の水が高さ25mの絶壁から水柱となって、音を響かせて落ちていきます。曽我兄弟が父の仇を討つ相談をしていたとき、滝の音で声がさえぎられたため神に念じると、一瞬滝の音が止んだという伝説から、この名が残されています。展望台からは、富士山と滝の景色も望めます。",
  }),
  cre({
    name: "田貫湖", h: 13, m: 55, stay: 80, mode: "car", dur: 20, lat: 35.344103, lng: 138.561279, address: "静岡県富士宮市佐折634-1",
    memo:
      "白糸ノ滝から車で約20分、富士山の西麓、朝霧高原の一角にある湖です。水深が浅く風が比較的穏やかなため、湖面に富士山が逆さに映る「逆さ富士」が名物です。湖畔には周遊道が整えられ、散策やレンタサイクルを楽しめます。春には湖畔に桜が咲き、展望デッキからはのんびりと富士山を眺められます。",
  }),
  cre({
    name: "道の駅 朝霧高原", h: 15, m: 35, stay: 55, mode: "car", dur: 20, lat: 35.413805, lng: 138.590857, address: "静岡県富士宮市根原492-14",
    memo:
      "田貫湖から車で約20分。地元の野菜や特産品、お土産が並ぶ道の駅で、ソフトクリームも人気です。建物の裏手には、朝霧高原の草原越しに富士山を望める展望台があります。旅の最後にお土産を選び、富士山の眺めを楽しみましょう。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${SENGEN_ID},${SHIRAITO_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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

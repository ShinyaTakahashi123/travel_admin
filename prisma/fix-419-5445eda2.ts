/**
 * チェックリスト #419 5445eda2「武蔵一宮氷川神社と大宮公園、さいたまの定番参拝日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 大宮盆栽美術館 → 大宮盆栽村（散策）→ 大宮公園 → 武蔵一宮氷川神社 → 氷川参道 →（ニューシャトル）鉄道博物館（昼食）（6か所 09:00〜16:15）
 * 既存の3か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。タイトルは内容に合っているのでそのまま
 * 既存の写真（氷川神社の境内・大宮公園の入口・盆栽美術館の庭）は目で見て合っているので残す
 * 本文の出典: 盆栽美術館 https://www.bonsai-art-museum.jp/ ・ https://www.city.saitama.lg.jp/004/005/002/001/p007717.html ／
 *   盆栽村 https://stib.jp/saitama-aruki/area-bonsai.php ・ https://visitsaitamacity.jp/spots/32 ／大宮公園 https://www.pref.saitama.lg.jp/omiya-park/index.html ・ /omiya-park/shisetsu.html ／
 *   氷川神社 https://musashiichinomiya-hikawa.or.jp/about/ ・ https://musashiichinomiya-hikawa.or.jp/keidai/ ／鉄道博物館 https://visitsaitamacity.jp/spots/2
 * 座標の出典: Nominatim（大宮盆栽美術館 35.9285484,139.6335415／盆栽四季の家 35.9267701,139.6332780（盆栽村の中の点として）／大宮公園 35.9190335,139.6318133／
 *   氷川神社 35.9167708,139.6297653／氷川参道 35.9031156,139.6315146／鉄道博物館 35.9217287,139.6178610）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-419-5445eda2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5445eda2-d558-41e6-96ff-7a0987c42d2b";
const DAY1_ID = "ac54eab6-93bc-41ce-81d6-5d4de07b3cda";
const HIKAWA_ID = "b7b1b3f3-b197-4807-a66c-ac0c62cb16c9";
const PARK_ID = "99eaeacf-c6f0-40a3-921d-7357f35ffd61";
const BONSAI_ID = "683c2eae-bebb-446b-8695-a19192d62259";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "盆栽の聖地・大宮盆栽村の盆栽美術館と盆栽園をめぐり、県内で一番歴史のある県営公園・大宮公園から、武蔵一宮氷川神社にお参り。ケヤキ並木の氷川参道を歩いて、鉄道博物館で昼食と鉄道の展示を楽しむ、さいたまの定番をめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, line: string | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, address, memo },
});

const order = [
  upd(BONSAI_ID, 9, 0, 50, null, null, null, 35.928548, 139.633542,
    "盆栽の聖地「大宮盆栽村」にある、さいたま市立の盆栽美術館で、2010年に開館した世界で初めての公立の盆栽美術館とされています。日本を代表する名品盆栽をはじめ、盆栽にまつわる美術品や歴史・民俗資料を展示していて、季節ごとに違う表情を見せる盆栽を鑑賞できます。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("大宮盆栽村（散策）", 9, 55, 40, "walk", 5, null, 35.92677, 139.633278, "埼玉県さいたま市北区盆栽町",
    "盆栽美術館から歩いてすぐ。大宮公園の北側一帯の総称で、1923年（大正12年）の関東大震災をきっかけに、東京の盆栽業者が、盆栽づくりに適した広い土地と新鮮な水と空気を求めて移り住み、形づくられました。今も、それぞれに特色のある盆栽園が点在しています。盆栽には手を触れず、それぞれの園の決まりに従って見学しましょう。"),
  upd(PARK_ID, 10, 50, 35, "walk", 15, null, 35.919034, 139.631813,
    "盆栽村から歩いて約15分。大宮駅の東北約1.5kmにあり、「さくら名所100選」や「日本の都市公園100選」に選ばれた、埼玉県で一番歴史のある県営公園です。園内には、小動物園や児童遊園地、歴史と民俗の博物館などもあります。"),
  upd(HIKAWA_ID, 11, 30, 50, "walk", 5, null, 35.916771, 139.629765,
    "大宮公園のとなり。第五代孝昭天皇の時代の創建と伝えられる武蔵一宮の神社で、須佐之男命・稲田姫命・大己貴命をまつっています。「大宮」の地名は、この神社を「大いなる宮居」とたたえたことが由来とされています。境内の神池には、今も湧水が注いでいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("氷川参道", 12, 20, 30, "walk", 2, null, 35.903116, 139.631515, "埼玉県さいたま市大宮区",
    "神社から南へ続く参道で、中山道から約2kmの長さがあり、両側に美しいケヤキ並木が続きます。緑のトンネルのような氷川参道は、大宮のシンボルになっています。散策しながら、大宮駅の方へ歩きましょう。"),
  cre("鉄道博物館（昼食）", 13, 15, 180, "train", 25, "ニューシャトル（大宮→鉄道博物館）", 35.921729, 139.617861, "埼玉県さいたま市大宮区大成町3-47",
    "参道を歩いて大宮駅へ出て、ニューシャトルで鉄道博物館駅へ。「鉄道」「歴史」「教育」をコンセプトに、日本における鉄道の役割や鉄道技術の移り変わりなどを学べる博物館です。実物車両を当時の情景を再現しながら展示しているほか、日本最大級ともいわれる鉄道ジオラマや、日本初とされる「D51」の運転台を使ったシミュレータもあります。駅弁屋や食堂車をテーマにしたレストランもあるので、ここで昼食にしましょう。休館日は公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${HIKAWA_ID},${PARK_ID},${BONSAI_ID}`) throw new Error("構成が想定と違います");
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

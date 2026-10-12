/**
 * チェックリスト #435 8e7d688e「石段街と伊香保神社、定番の伊香保温泉さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 石段街 → 伊香保関所（新規）→ 徳冨蘆花記念文学館（新規）→ 伊香保神社 → 河鹿橋 →（昼食）→ 伊香保露天風呂（新規）→（タクシー）水澤寺（新規）（7か所 09:00〜16:20）
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 石段街: 「湯樋を通したことから」「一年365日にぎわうようにとの願い」「射的場」などは開いた公式で確かめられないので外す
 *   - 伊香保神社: 「延喜式」は確かめられないので外し、公式の「上野国三宮」「温泉・医療の神」に
 *   - 河鹿橋: 「伊香保露天風呂のそば」「県内でも人気の高い」は外し、公式の「黄金の湯の源泉地そばの朱塗りの太鼓橋」に
 * 写真: 石段街・伊香保神社の写真は合っているので残す（河鹿橋は写真なし）
 * 本文の出典: 渋川伊香保温泉観光協会 石段街 https://www.ikaho-kankou.com/aboutikaho/ishidan/ ・歴史 https://www.ikaho-kankou.com/aboutikaho/history/ ・
 *   観光スポット https://www.ikaho-kankou.com/sightseeing/ikaho/ （伊香保関所・徳冨蘆花記念文学館・伊香保神社・河鹿橋・水澤寺）・
 *   伊香保露天風呂 https://www.ikaho-kankou.com/spring/spa1/ ／水澤観世音 https://mizusawakannon.or.jp/about
 * 座標の出典: Nominatim（伊香保石段街 36.4976580,138.9163875／伊香保御関所 36.4985360,138.9164190／徳冨蘆花記念文学館 36.4991990,138.9158580／
 *   伊香保神社 36.4959531,138.9158811／伊香保露天風呂 36.4910202,138.9159351／水澤寺は OSM に点がないので、寺のある水沢の集落の点 36.4794115,138.9478063）、
 *   OSM/Overpass（河鹿橋 way 311066093 36.4920772,138.9148687）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-435-8e7d688e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8e7d688e-1378-4f2e-a324-47bbc747576c";
const DAY1_ID = "1d7a8ee6-236d-4e25-b389-2994ef3b993b";
const ISHIDAN = "5c48c112-9a44-4f9c-80df-4304d41d2484";
const JINJA = "f4195a5a-2e58-4661-9630-245e86263c95";
const KAJIKA = "4024338c-d62a-4085-b3b0-2f8690013664";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "365段の石段が続く石段街から、復元された伊香保関所、徳冨蘆花記念文学館、石段の上の伊香保神社、朱塗りの河鹿橋をめぐり、源泉「黄金の湯」の露天風呂でひと休み。最後は坂東三十三観音の札所・水澤寺へ。伊香保温泉の定番を歩いてめぐる日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(ISHIDAN, 9, 0, 60, null, null, 36.497658, 138.916388,
    "旅の始まりは、伊香保温泉のシンボル・石段街へ。石段をはさんでお土産の店などが並び、その数は365段。2010年に石段が延ばされて、今の365段になりました。石段の歴史は古く、長篠の戦いのあとの天正4年（1576年）、武田勝頼が真田昌幸に将兵の療養所の造成を命じたことが伝えられています。伊香保の湯には、鉄分が酸化して茶褐色になる「黄金（こがね）の湯」と、近年湧き出しが確かめられた無色透明の「白銀（しろがね）の湯」の2種類があります。石段は雨の日に滑りやすいので、足元に気をつけて歩きましょう。"),
  cre("伊香保関所", 10, 5, 20, "walk", 3, 36.498536, 138.916419, "群馬県渋川市伊香保町伊香保34",
    "石段街の近くにある伊香保関所へ。寛永8年（1631年）に幕府の命令で設けられた関所（伊香保口留番所）を復元したもので、関所の役割などをくわしく説明しています。"),
  cre("徳冨蘆花記念文学館", 10, 30, 45, "walk", 5, 36.499199, 138.915858, "群馬県渋川市伊香保町伊香保614-8",
    "小説『不如帰（ほととぎす）』で知られる明治の文豪・徳冨蘆花の記念館です。蘆花が伊香保で定宿にしていた宿の離れを移し、復元しています。"),
  upd(JINJA, 11, 25, 30, "walk", 10, 36.495953, 138.915881,
    "石段を上りきった先に鎮座する伊香保神社へ。上野国の三宮とされる由緒ある神社で、温泉と医療の神である大己貴命と少彦名命をまつっています。" + RESPECT),
  upd(KAJIKA, 12, 5, 25, "walk", 10, 36.492077, 138.914869,
    "伊香保神社から歩いて河鹿橋へ。「黄金の湯」の源泉地のそばに架かる朱塗りの太鼓橋で、初夏は新緑、秋は紅葉の名所として知られ、紅葉の時期にはライトアップも行われます。このあと、昼食にしましょう。"),
  cre("伊香保露天風呂", 13, 45, 65, "walk", 5, 36.49102, 138.915935, "群馬県渋川市伊香保町伊香保",
    "昼食のあとは、伊香保の源泉地にある伊香保露天風呂へ。自然に囲まれた静かな露天風呂で、源泉「黄金の湯」を掛け流しで使っています。向かう道の途中には、伊香保で唯一「黄金の湯」の飲泉を体験できる飲泉所もあります。営業時間や休みの日は季節によって違うので、公式の案内で確かめましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。"),
  cre("水澤寺", 15, 10, 70, "taxi", 20, 36.479412, 138.947806, "群馬県渋川市伊香保町水沢214",
    "伊香保温泉からタクシーで、水澤観世音とも呼ばれる水澤寺へ。およそ1300年前、推古天皇・持統天皇の勅願により、高麗の高僧・恵灌僧正が開いたと伝えられる寺で、坂東三十三観音の十六番札所です。本尊は十一面千手観世音菩薩で、今の建物は、たびたびの火災のあと大永年間の仮堂を経て、宝暦から天明にかけての大改築で完成しました。" + RESPECT + "伊香保温泉さんぽの旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [ISHIDAN, JINJA, KAJIKA].join()) throw new Error("構成が想定と違います");
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

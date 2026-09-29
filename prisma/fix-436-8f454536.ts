/**
 * チェックリスト #436 8f454536「蔵造りの町並みと時の鐘、小江戸・川越を歩く日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 喜多院（新規）→ 中院（新規）→ 仙波東照宮（新規）→ 川越城本丸御殿（新規）→ 川越氷川神社 →（昼食）→ 時の鐘 → 蔵造りの町並み → 菓子屋横丁（8か所 09:00〜16:30）
 * 既存の4か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 氷川神社: 「欽明天皇2年（541）」→ 公式は「6世紀、欽明天皇の御代」。「長禄元年に太田道真・道灌父子が」は公式どおり「室町時代に太田道灌が川越城を築城して以来」に。
 *     「縁むすび風鈴」「約1500年」は開いた公式で確かめられないので外す
 *   - 蔵造りの町並み: 「1,302戸」「レンガや大谷石」は確かめられないので外す
 *   - 菓子屋横丁: 「江戸時代の職人」「明治初めののれん分け」「関東大震災」は確かめられないので外し、公式の説明に
 *   - 時の鐘: 「川越駅からバスで約10分」は外す。鐘の鳴る時刻は書かない
 * 写真: 時の鐘・蔵造りの町並み（時の鐘の見える通り）・川越氷川神社の写真は合っているので残す
 * 本文の出典: 小江戸川越観光協会 https://koedo.or.jp/spot_NNN/（時の鐘 001／一番街 002／菓子屋横丁 003／喜多院 004／中院 005／仙波東照宮 006／本丸御殿 007／川越氷川神社 008）
 * 座標の出典: Nominatim（喜多院 35.9178236,139.4889051／中院 35.9147469,139.4904278／仙波東照宮 35.9166262,139.4897977／川越城本丸御殿 35.9245029,139.4914968／
 *   川越氷川神社 35.9271396,139.4887762／時の鐘 35.9234837,139.4833395／川越一番街 35.9235447,139.4829264／菓子屋横丁 35.9250914,139.4808048）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-436-8f454536.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8f454536-d072-4d3f-a7ef-08cf1c127f59";
const DAY1_ID = "9b126313-acf5-42d9-9c8d-b1bc07bb3a4a";
const TOKI = "f2e59480-2876-48c1-bbd1-4c1677946f60";
const KURA = "2feb2230-dd8b-4c0d-b48b-6c778a88ed03";
const KASHIYA = "91b19638-8dc6-4cee-abd3-bd044f68d37a";
const HIKAWA = "3a2a4998-f5f7-4cab-9e63-f9f3b3661f92";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "天海僧正ゆかりの喜多院、中院、仙波東照宮から、川越城の遺構・本丸御殿と、縁結びで知られる川越氷川神社をめぐり、午後は時の鐘と蔵造りの町並み、菓子屋横丁へ。「小江戸」と呼ばれる川越の歴史と江戸の情緒を歩いて味わう日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("喜多院", 9, 0, 60, null, null, 35.917824, 139.488905, "埼玉県川越市小仙波町1丁目",
    "旅の始まりは喜多院へ。天長7年（830年）に慈覚大師が創建したと伝わる天台宗の名刹で、正式には星野山無量寿寺喜多院といいます。江戸時代の初め、名僧・天海僧正が住職を務めると幕府の手厚い保護を受け、江戸城から、3代将軍家光誕生の間といわれる「客殿」や、家光の乳母として知られる春日局の化粧の間といわれる「書院」が移築されました。山門や鐘楼門、慈眼堂なども重要文化財です。人間の喜怒哀楽をとらえたさまざまな表情の石仏、およそ540体の五百羅漢も並んでいます。" + RESPECT),
  cre("中院", 10, 5, 25, "walk", 5, 35.914747, 139.490428, "埼玉県川越市小仙波町1丁目",
    "喜多院のすぐ南にある、天台宗別格本山の中院へ。鎌倉時代の終わりごろ、無量寿寺から分かれたとされる寺で、喜多院に天海僧正が来るまでは、この地の中心的な寺院だったといわれます。島崎藤村ゆかりの寺としても知られ、境内には川越市の文化財に指定された、藤村ゆかりの茶室「不染亭」があります。" + RESPECT),
  cre("仙波東照宮", 10, 35, 20, "walk", 5, 35.916626, 139.489798, "埼玉県川越市小仙波町1丁目",
    "喜多院の南側に隣接する仙波東照宮へ。元和2年（1616年）に駿府で亡くなった徳川家康の遺骸を日光山へ移す途中、天海僧正によって喜多院で4日間の法要が営まれたことから、寛永10年（1633年）に建てられました。日本三大東照宮の一つともいわれます。" + RESPECT),
  cre("川越城本丸御殿", 11, 15, 45, "walk", 20, 35.924503, 139.491497, "埼玉県川越市郭町2丁目",
    "仙波東照宮から歩いて、川越城本丸御殿へ。嘉永元年（1848年）に藩主・松平斉典が造営した、武家風の落ち着いた造りの御殿で、江戸時代に17万石を誇った川越城の唯一の遺構とされます。川越城は、長禄元年（1457年）に扇谷上杉持朝の命で、家臣の太田道真・道灌父子が築いた城で、寛永16年（1639年）には川越藩主・松平信綱が大規模に拡張・整備しました。"),
  upd(HIKAWA, 12, 10, 35, "walk", 10, 35.92714, 139.488776,
    "本丸御殿から歩いて、川越氷川神社へ。6世紀、欽明天皇の御代に創建されたと伝わる古い神社で、室町時代に太田道灌が川越城を築いてからは、城の守護神・この地の総社としてあがめられ、「お氷川様」と呼ばれて親しまれてきました。東参道に立つ高さ15mの明神型の大鳥居は木製では日本最大級とされ、扁額の社号は勝海舟の直筆です。境内には樹齢500年を超える欅のご神木もあります。縁結びの神様としても信仰され、10月に行われる「川越まつり」は、氷川神社の例大祭の付祭りです。" + RESPECT + "このあと、蔵造りの町並みのほうへ歩いて、昼食にしましょう。"),
  upd(TOKI, 13, 30, 20, "walk", 15, 35.923484, 139.48334,
    "蔵造りの町並みに立つ時の鐘へ。川越藩主だった酒井忠勝によって創建されたといわれる鐘つき堂です。たびたびの火災で焼けては建て替えられ、今の建物は4代目にあたり、明治26年（1893年）の川越大火の直後に再建されたものです。木造3層のやぐらで、高さは約16m。今も蔵造りの町並みに時を告げていて、その響きのよい音色は、平成8年（1996年）に環境省の「残したい“日本の音風景100選”」に認定されています。"),
  upd(KURA, 13, 55, 75, "walk", 5, 35.923545, 139.482926,
    "時の鐘から、蔵造りの建物が立ち並ぶ町並み「一番街」を歩きましょう。同じように見えて一軒一軒違う造りをしていて、それぞれに個性を出しながら、堂々とした風格を漂わせています。今の蔵造りの多くは、町の3分の1が焼けた明治26年（1893年）の川越大火のあとに建てられたものです。東京の蔵造りが姿を消したこともあり、江戸の景観を受け継ぐ貴重な歴史的遺産として、時の鐘をはじめとするこの一番街周辺は、平成11年（1999年）に国の重要伝統的建造物群保存地区に選定されました。人通りの多い通りなので、車に気をつけて歩きましょう。"),
  upd(KASHIYA, 15, 20, 70, "walk", 10, 35.925091, 139.480805,
    "一番街から歩いて、菓子屋横丁へ。色とりどりのガラスが散りばめられた石畳の道に、約30軒ほどの菓子屋などがひしめいています。醤油の焼ける香ばしい香り、ニッキやハッカ飴、駄菓子やだんご、昔ながらの手法で作られる飴菓子やカルメ焼きなど、素朴で昔懐かしい味がそろい、大人も子どもも、世代を超えて楽しめる場所です。小江戸・川越の散策を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [TOKI, KURA, KASHIYA, HIKAWA].join()) throw new Error("構成が想定と違います");
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

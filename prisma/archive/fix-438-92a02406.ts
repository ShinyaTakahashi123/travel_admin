/**
 * チェックリスト #438 92a02406「偕楽園と水戸城、日本三名園と徳川の歴史を巡る日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 弘道館 → 水戸城跡（大手門・二の丸角櫓・薬医門）→（バス）茨城県立歴史館（新規）→（昼食）→ 偕楽園 → 常磐神社（新規）→ 千波湖（新規）（6か所 09:00〜16:30）
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 水戸城跡: 「天守の代わりに三階櫓」「平成21年に寺で見つかった扉が復元のきっかけ」は開いた公式で確かめられないので外す。
 *     写真は大手門ではなく「薬医門」（水戸第一高校の構内に移築された水戸城唯一の現存建築）なので、スポット名を「水戸城跡（大手門・薬医門）」にして本文にも書く
 *   - 弘道館: 「藩校として日本最大」は公式どおり「当時の藩校としては日本最大規模」に（ぼかす）
 * 写真: 偕楽園・弘道館・薬医門（水戸城跡）の写真は合っているので残す
 * 本文の出典: 水戸観光コンベンション協会「水戸旅」 https://mitokoumon.com/facility/…/（偕楽園 historic/kairakuen／弘道館 historic/kodokan／水戸城跡 historic/mitojoato／
 *   大手門 historic/otemon／二の丸角櫓 historic/ninomaru_sumiyagura／茨城県立歴史館 historic/rekishikan／常磐神社 temples-shrines/tokiwajinja／千波湖 park/senbako）
 * 座標の出典: Nominatim（弘道館公園 36.3759247,140.4771604／弘道館・大手門 36.3754010,140.4784770／偕楽園 36.3751350,140.4535450／常磐神社 36.3750011,140.4559263／
 *   千波湖 36.3700002,140.4611091）、OSM/Overpass（茨城県立歴史館 展示室 way 91530783 36.3792148,140.4499412）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-438-92a02406.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "92a02406-a0f0-4720-a1aa-6012cb6a1928";
const DAY1_ID = "58a9dca0-1456-4cc1-82ff-7d24cceee34d";
const KAIRAKUEN = "1f5f53bf-6a76-477b-b118-25cd0cbc69a8";
const KODOKAN = "7c07a13e-dccf-441a-87c3-0fc1546a807b";
const MITOJO = "6b9d2ae1-6fbb-4459-8542-4c46b3012aba";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "水戸藩の藩校・弘道館と、復元された大手門が立つ水戸城跡、茨城県立歴史館で水戸と茨城の歴史にふれたら、日本三名園のひとつ・偕楽園へ。春には梅の名所として知られる園を歩き、光圀公と斉昭公をまつる常磐神社、千波湖の湖畔まで。水戸の歴史と庭園を歩いてめぐる日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type Extra = Record<string, unknown>;
const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Extra = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(KODOKAN, 9, 0, 50, null, null, 36.375925, 140.47716,
    "旅の始まりは、水戸駅北口から歩いて行ける弘道館へ。水戸藩第9代藩主・徳川斉昭公が天保12年（1841年）に創設した藩校で、当時の藩校としては日本最大規模とされ、かつては約10.5haの敷地がありました。藩士に文武両道の修練を積ませようと、儒学・国学や武術をはじめ、医学・天文学・蘭学など幅広い学問を取り入れた、いわば総合大学のような場所でした。藩主が臨席して試験や儀式が行われた正庁は「学校御殿」とも呼ばれ、第15代将軍となった徳川慶喜公も、5歳のときから弘道館で教育を受けました。"),
  upd(MITOJO, 9, 55, 50, "walk", 5, 36.375401, 140.478477,
    "弘道館のすぐそばの水戸城跡へ。水戸城は、北を那珂川、南を千波湖にはさまれた、日本最大級の土造りの城で、大規模な土塁と、西の台地には五重、東の低地には三重の堀を巡らせていました。石垣を築く計画は何度かあったものの、築かれることはなかったそうです。城内でもっとも格式が高かった大手門は、もとは佐竹氏が城主だった慶長6年（1601年）ごろに建てられたと考えられ、明治期に解体されましたが、令和2年（2020年）に天保年間の姿で復元されました。高さ約13m・幅約17mの大きな櫓門です。二の丸の南西の角にあった二の丸角櫓も復元されています。水戸城で唯一現存する建物の薬医門は、今は水戸第一高校の構内に移築されています。",
    { name: "水戸城跡（大手門・薬医門）" }),
  cre("茨城県立歴史館", 11, 5, 60, "bus", 20, 36.379215, 140.449941, "茨城県水戸市緑町",
    "水戸城跡からバスで、茨城県立歴史館へ。茨城県の歴史に関する博物館と文書館の機能をあわせ持つ施設として、昭和49年（1974年）に開館しました。敷地には、明治14年（1881年）に建てられた擬洋風建築で県の文化財の旧水海道小学校本館などもあり、秋には庭園の銀杏並木が色づきます。見学のあとは、昼食にしましょう。"),
  upd(KAIRAKUEN, 13, 15, 90, "walk", 10, 36.375135, 140.453545,
    "昼食のあとは偕楽園へ。金沢の兼六園、岡山の後楽園とともに日本三名園のひとつに数えられる庭園で、天保13年（1842年）、水戸藩第9代藩主・徳川斉昭公によって造られました。「偕楽園」の名は、中国の古典『孟子』の「古の人は民と偕に楽しむ、故に能く楽しむなり」という一節から名付けられ、「領民と偕に楽しむ」場にしたいという斉昭公の思いが込められています。斉昭公は、弘道館を勉学・修行の場、偕楽園を休息の場として、対をなす施設として設計したとされます。梅の異名「好文木」に由来する別邸の好文亭も、建てる場所から意匠まで斉昭公が自ら定めたと伝えられます。2月から3月にかけての「水戸の梅まつり」のころには、約100品種3,000本の梅が咲き誇ります。"),
  cre("常磐神社", 14, 50, 30, "walk", 5, 36.375001, 140.455926, "茨城県水戸市常磐町1丁目",
    "偕楽園に隣接する常磐神社へ。水戸藩を代表する第2代藩主・徳川光圀公（義公）と第9代藩主・徳川斉昭公（烈公）をまつる神社で、明治時代の初めに、二人の徳を慕う人々が偕楽園内に建てた祠堂に由来します。明治6年（1873年）に「常磐神社」の社号を賜り、翌年に今の場所に社殿が造られました。昭和20年（1945年）の戦災で本殿などを焼失しましたが、昭和33年（1958年）に今の社殿が完成しています。境内の義烈館では、水戸学に関係する資料などが展示されています。" + RESPECT),
  cre("千波湖", 15, 30, 60, "walk", 10, 36.37, 140.461109, "茨城県水戸市",
    "常磐神社から歩いて、偕楽園の南東にある千波湖へ。周囲約3kmの湖で、ウォーキングやジョギングをする人の姿も多い、市民の憩いの場です。春には湖のまわりの桜並木が咲き、湖畔の西側には徳川光圀公（水戸黄門）の像が立っています。かつての千波湖は今の約3.8倍の広さがあり、水戸城を南から守る役割も果たしていました。湖畔を歩きながら、水戸の旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [KAIRAKUEN, KODOKAN, MITOJO].join()) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" + (d.name ? "→" + d.name : "") : d.name} ${String(d.memo).length}字`);
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

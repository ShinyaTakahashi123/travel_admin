/**
 * チェックリスト #423 61ec95e9「なかはくと闇無浜神社、中津の歴史と信仰を深掘りする1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 薦神社 →（車）中津市歴史博物館 → 中津カトリック教会 →（昼食）→ 自性寺（大雅堂）→ 村上医家史料館 → 円応寺（6か所 09:00〜16:30）
 * 2日目: 闇無浜神社 → 福澤諭吉旧居・福澤記念館 → 大江医家史料館 → 合元寺（4か所 09:00〜12:40。帰る日なので早めに終える）
 * 既存の2か所はIDのまま、本文を公式で確かめて書き直す（前の本文は案内役の話し言葉「皆様、…」で、「無料」の語や確かめられない記述があった）:
 *   - なかはく: 開館の年と前身の資料館の記述は外す。住所を公式の「三ノ丁1290」に直す
 *   - 闇無浜神社: 天平12年・弘安4年の祈願、大友宗麟の焼き討ち、「550年以上」は確かめられないので、公式の由緒（建武元年に今の地へ・永享2年の記録）に直す。
 *     住所を公式の「竜王町447」に直す
 * 写真: 2か所とも、福澤諭吉旧居の写真（Former_Residence_of_Fukuzawa_Yukichi.jpg）が付いていて場所が違う。
 *   なかはくの分の写真の行を、新しく足す「福澤諭吉旧居・福澤記念館」に付け替え（表紙の画像と同じなので、表紙も合う）、闇無浜神社の分の行は消す（Blobは消さない）
 * 本文の出典: 中津耶馬渓観光協会 https://nakatsuyaba.com/pages/N/ （薦神社 201／中津市歴史博物館 112／中津カトリック教会 149／自性寺 154／村上医家史料館 146／
 *   円応寺 159／福澤諭吉旧居・福澤記念館 141／大江医家史料館 147／合元寺 145）、中津市 https://www.city-nakatsu.jp/doc/2019103000075/ （なかはく）、
 *   闇無濱神社 https://www.kuranashihamajinja.jp/ ・御祭神 https://www.kuranashihamajinja.jp/%E5%BE%A1%E7%A5%AD%E7%A5%9E ・中津祇園 https://www.kuranashihamajinja.jp/%E4%B8%AD%E6%B4%A5%E7%A5%87%E5%9C%92
 * 座標の出典: Nominatim（薦神社 33.5672061,131.2180650／中津市歴史博物館 33.6053306,131.1846067／中津カトリック教会 33.6047993,131.1858856／
 *   自性寺 33.6029092,131.1800359／村上医家史料館 33.6019010,131.1849690／円応寺 33.6043034,131.1905768／闇無浜神社 33.6110463,131.1941337／
 *   福澤諭吉旧居 33.6072992,131.1909282／大江医家史料館 33.6042364,131.1920146／合元寺 33.6029719,131.1897830）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-423-61ec95e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "61ec95e9-752c-4fff-a7d4-b5b0f251159b";
const DAY1_ID = "16aae2d4-143a-4f19-b28d-9447ec5bae76";
const DAY2_ID = "e176cb3d-259f-4e20-a96d-6156ae9a6143";
const NAKAHAKU_ID = "a7476a28-ab81-4801-b3a1-cf78e8bb43be";
const KURANASHI_ID = "b854f9c8-4d5c-4518-a990-edda431eb5c5";
const FUKUZAWA = "福澤諭吉旧居・福澤記念館";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "宇佐神宮の祖宮ともいわれる薦神社から、中津城の石垣を館内から眺められる「なかはく」、池大雅の書画が並ぶ自性寺、医家の史料館や河童の話が残る寺町へ。2日目は豊の国の国魂神をまつる闇無浜神社から、福澤諭吉旧居、赤壁の合元寺まで。中津の歴史と信仰を深掘りする1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  cre("薦神社", 9, 0, 50, null, null, 33.567206, 131.218065, "大分県中津市大字大貞209",
    "旅の始まりは、大貞神社とも呼ばれる薦神社から。全国八幡宮の総本宮である宇佐神宮の祖宮といわれる神社で、承和年中（834〜848年）に初めて社殿が造られたとされます。本殿の裏にある三角池（みすみいけ）は、池そのものがご神体です。昔はこの池に生える真薦（まこも）という植物を枕の形に編んで、宇佐神宮のご神体の御験にしていました。江戸時代初期の珍しい形式の神門は、国の重要文化財に指定されています。例年9月には仲秋祭、11月には菊花展が行われます。" + RESPECT),
  upd(NAKAHAKU_ID, 10, 5, 100, "car", 15, 33.605331, 131.184607, "大分県中津市三ノ丁1290",
    "薦神社から車で約15分。「なかはく」の愛称で親しまれる中津市歴史博物館は、黒田官兵衛が築いた九州最古の近世城郭とされる中津城の石垣を館内から眺められるよう、石垣側の壁を総ガラス張りにした博物館です。中津の古代から近世までをたどる常設展示や企画展示の展示室のほか、体験学習ができるプレイスタジオ、中津城の石垣や日本遺産についての映像を見られる石垣シアターがあります。石垣とお城を望むカフェでひと休みもできます。城下町めぐりに便利なレンタサイクルも置かれています。"),
  cre("中津カトリック教会", 11, 50, 25, "walk", 5, 33.604799, 131.185886, "大分県中津市三ノ丁1283-1",
    "なかはくから歩いてすぐ。明治20年（1887年）、パリ外国宣教会のベレール神父が最初の洗礼を行い、中津小教区が設けられました。今の聖堂は昭和13年（1938年）に建てられたもので、昭和57年（1982年）には、イタリア生まれのセッキ神父が窓ガラスをイタリアから取り寄せ、色鮮やかなステンドグラスに改めました。48枚のステンドグラスには、「中津の殉教者」や「細川ガラシャの信仰」など、中津にゆかりのある題材も描かれています。教会の行事があるときは見学できないことがあります。今も祈りが続く場所ですので、静かに、敬意をもって見学してください。このあと、城下町で昼食にしましょう。"),
  cre("自性寺（大雅堂）", 13, 40, 60, "walk", 10, 33.602909, 131.180036, "大分県中津市新魚町3-1903",
    "昼食のあとは自性寺へ。境内の大雅堂には、雪舟・光琳とともに日本三大画家と称される池大雅の書画47点が常設展示されていて、そのうち46点は県の重要文化財です。池大雅の書画をこれだけの数、常設で展示しているのは日本でここだけとされています。1階には寺宝も並びます。境内には、「ペースメーカーの父」ともいわれる田原淳の墓（碑）や、城下を囲んだ土塁「おかこい山」（県指定）も残っています。寺院の行事で休館することがあります。" + RESPECT),
  cre("村上医家史料館", 14, 50, 60, "walk", 10, 33.601901, 131.184969, "大分県中津市諸町1780",
    "自性寺から歩いて約10分。村上医家は、初代の宗伯が寛永17年（1640年）に諸町で医院を開いて以来、今も医家として続く家で、数千点におよぶ医学などの資料が残されています。その所蔵品と建物をもとに開かれた史料館で、村上医家の史料や、人体解剖に至るまでの医学の流れを中心に展示しています。前野良澤や福澤諭吉を生んだ中津の学問の歴史にふれられます。"),
  cre("円応寺", 16, 0, 30, "walk", 10, 33.604303, 131.190577, "大分県中津市寺町961-2",
    "村上医家史料館から歩いて約10分、寺が並ぶ寺町へ。円応寺は、黒田官兵衛が開いた寺で、真誉上人が開山したと伝えられています。仏門に入って寺を火事から守ったという河童の話が残っていて、境内には河童の墓や、河童の池と伝わるものもあります。" + RESPECT + "まわりは住宅地なので、静かに歩きましょう。今夜は中津の町に泊まります。"),
];

const day2 = [
  upd(KURANASHI_ID, 9, 0, 40, null, null, 33.611046, 131.194134, "大分県中津市竜王町447",
    "2日目は闇無浜（くらなしはま）神社から。明治5年（1872年）までは豊日別国魂神社と呼ばれ、「豊日別宮」「龍王宮」の名でも知られてきました。豊国（のちの豊前国と豊後国）の国魂神である豊日別国魂神と、瀬織津姫神を主祭神としてまつっています。もとは今の中津城跡のあたりにあり、建武元年（1334年）に海岸に面した今の場所に移ったと伝えられます。摂社の祇園八坂神社の祭礼は「中津祇園（下祇園）」として知られ、例年7月に行われます。その記録として残る最も古い記述は、約600年前の永享2年（1430年）のものとされます。" + RESPECT),
  cre(FUKUZAWA, 9, 50, 80, "walk", 10, 33.607299, 131.190928, "大分県中津市留守居町586",
    "闇無浜神社から歩いて約10分。福澤諭吉は1歳6か月のときに父を亡くし、天保7年（1836年）の秋、母子6人で大坂の中津藩蔵屋敷から中津に帰ってきました。その後に移り住み、青年期までを過ごした家が今の福澤旧居で、国の史跡に指定されています。最初に住んだ家は残っていませんが、宅跡として整えられ、見学できます。隣の福澤記念館では、1階で福澤諭吉の一生を時代順にたどり、2階ではさまざまな側面に光を当てて資料を紹介しています。「学問のすすめ」の初版本や書・手紙・写真、一万円札の1号券なども展示されています。"),
  cre("大江医家史料館", 11, 15, 50, "walk", 5, 33.604236, 131.192015, "大分県中津市鷹匠町906",
    "福澤旧居から歩いて約5分。中津藩主の御典医だった大江家の旧宅を使った史料館です。大江家は初代・大江玄仙から代々御典医を務め、「医は仁ならずの術 務めて仁をなさんと欲す」という言葉が医訓として伝えられました。第5代の大江雲沢は、敷地内に薬草園をつくり、育てた薬草で薬湯療法を行いました。今も約40種類の薬草が植えられた薬草園を見られます。館内には「解体新書」や「重訂解体新書」のほか、世界で初めて全身麻酔による乳がんの摘出手術に成功したとされる華岡青洲の医学資料なども展示されています。"),
  cre("合元寺", 12, 10, 30, "walk", 5, 33.602972, 131.189783, "大分県中津市寺町973",
    "大江医家史料館から歩いてすぐ。天正15年（1587年）、黒田孝高（官兵衛）に従って姫路から中津に移った空誉上人が開いたと伝えられる寺です。天正17年（1589年）、孝高が前の領主・城井鎮房を中津城内で討ったとき、その家臣たちがこの寺を拠点に戦い、最期を遂げました。以来、門前の白壁は何度塗り替えても血の跡が消えないので、ついに赤く塗られるようになったというのが、「赤壁」の由来として伝えられています。境内の大黒柱には今も刀の跡が残り、戦死した家臣たちは延命地蔵菩薩堂にまつられています。" + RESPECT + "中津の歴史と信仰をたどる旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== NAKAHAKU_ID || days[1].spots.map((s) => s.id).join() !== KURANASHI_ID) throw new Error("構成が想定と違います");
  const photoMove = days[0].spots[0].photos;
  const photoDel = days[1].spots[0].photos;
  if (photoMove.length !== 1 || photoDel.length !== 1 || !photoMove[0].sourceUrl?.includes("Former_Residence_of_Fukuzawa_Yukichi") || !photoDel[0].sourceUrl?.includes("Former_Residence_of_Fukuzawa_Yukichi"))
    throw new Error("写真が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`写真: ${photoMove[0].id} を ${FUKUZAWA} へ付け替え／${photoDel[0].id} を消す`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
      const fk = await tx.spot.findMany({ where: { dayId: DAY2_ID, name: FUKUZAWA }, select: { id: true } });
      if (fk.length !== 1) throw new Error("福澤諭吉旧居のスポットが見つかりません");
      await tx.photo.update({ where: { id: photoMove[0].id }, data: { spotId: fk[0].id } });
      await tx.photo.delete({ where: { id: photoDel[0].id } });
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

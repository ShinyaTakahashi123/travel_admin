/**
 * チェックリスト #396 f6f7102e「佐佳枝廼社と中央公園、福井駅前をぶらり歩く1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 福井城址（山里口御門・福の井）→ 佐佳枝廼社 → 福井市中央公園 → 福井市立郷土歴史博物館 → 養浩館庭園 → 福井駅前（昼食）→ 橘曙覧記念文学館 → 足羽神社 → 足羽山公園（9か所 09:00〜16:40）
 * 2日目: 一乗谷朝倉氏遺跡博物館 → 一乗谷あさくら水の駅（昼食）→ 復原町並 → 朝倉館跡・唐門 → 湯殿跡庭園 → 諏訪館跡庭園（6か所 09:00〜16:30）
 * 中央公園は2日目から1日目へ移す（日をまたぐ移動も含め、1つのトランザクションで行う）。中身が駅前だけでなくなるので、タイトルも中身に合わせる
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す。佐佳枝廼社の配慮の一文も「敬意」を入れる）
 * 座標の出典: Nominatim（山里口御門 36.0652417,136.2207025／佐佳枝廼社 36.0639992,136.2182146／中央公園 36.0651727,136.2194984／福井市立郷土歴史博物館 36.0684359,136.2228892／
 *   養浩館庭園 36.0684485,136.2244144／福井駅 36.0621411,136.2221908）、OSM/Overpass（福井市橘曙覧記念文学館 36.059776,136.211187／足羽神社 36.058276,136.209597／
 *   足羽山公園 36.054616,136.205431／一乗谷朝倉氏遺跡博物館本館 36.015266,136.298268／道の駅「一乗谷あさくら水の駅」36.020331,136.294603／
 *   「復原武家屋敷」案内板 35.999318,136.293964（復原町並の中）／唐門 35.999720,136.295253／「湯殿跡庭園」案内板 35.998849,136.295438／「諏訪館跡庭園」案内板 35.997647,136.294580）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-396-f6f7102e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f6f7102e-84e3-426b-9fc7-2fe28a34481e";
const DAY1_ID = "18455e9f-0d28-47f8-bb82-ae11993a7ac4";
const DAY2_ID = "e5f99fab-98ae-444b-87fe-876b4e6d8d89";
const SAKAE_ID = "afc49abb-2cdb-4180-ac38-4d0f6a586c29";
const PARK_ID = "6b314605-3972-431c-a518-aac2349cb6f0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "福井城址と一乗谷朝倉氏遺跡、城下町と戦国の町をめぐる1泊2日";
const DESCRIPTION =
  "1日目は福井駅の近くの福井城址や佐佳枝廼社、藩主の別邸だった養浩館庭園など、福井藩の城下町の歴史をたどり、午後は愛宕坂から足羽山へ。2日目は戦国大名・朝倉氏の城下町の跡の一乗谷朝倉氏遺跡を訪ね、博物館で全体をつかんでから、復原された町並みや館の跡、庭園を歩く1泊2日プランです。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const day1 = [
  cre({
    name: "福井城址（山里口御門・福の井）", h: 9, m: 0, stay: 40, mode: null, dur: null, lat: 36.065242, lng: 136.220703, address: "福井県福井市大手3丁目",
    memo:
      "福井駅から歩いて約10分。徳川家康の次男で初代福井藩主の結城秀康が慶長11年（1606年）に築いた城の跡で、約270年、17代にわたって越前松平家の居城でした。今は、足羽山で採れる笏谷石で築かれた石垣と堀の一部が残り、本丸の御殿の跡には福井県庁が建っています。天守台の下には、福井の名の起こりになったという井戸「福の井」の跡があります。本丸の西側を守っていた枡形門「山里口御門」は、櫓門や棟門、石垣の上の土塀が復元されています。",
  }),
  {
    id: SAKAE_ID,
    data: {
      visitTime: t(9, 45), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.063999, lng: 136.218215,
      memo:
        "福井城址から歩いて約5分。徳川家康、福井藩の初代藩主・松平秀康（結城秀康）、幕末の藩主・松平春嶽をまつる神社です。寛永5年（1628年）に福井城の中に東照宮をまつったのが始まりで、「福井が栄えるように」との願いを込めて、松平春嶽が「佐佳枝廼社」と名付けたと伝えられます。戦災や福井地震で社殿を失い、京都から譲り受けた建物を、昭和24年（1949年）に移して拝殿としています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    },
  },
  {
    id: PARK_ID,
    data: {
      visitTime: t(10, 20), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.065173, lng: 136.219498,
      memo:
        "佐佳枝廼社のとなり、福井城の跡の西三ノ丸・西二ノ丸があった場所に整えられた公園です。2018年に全体が完成し、堀割広場やビジターセンター、広い芝生があり、市民のイベントの会場としても親しまれています。城の本丸の石垣と堀を眺めながら、ひと休みしましょう。",
    },
  },
  cre({
    name: "福井市立郷土歴史博物館", h: 11, m: 0, stay: 60, mode: "walk", dur: 10, lat: 36.068436, lng: 136.222889, address: "福井県福井市",
    memo:
      "中央公園から歩いて約10分。越前松平家の居城だった福井城と、石と木でできた珍しい橋・九十九橋を中心に、城下町に暮らした人々の歴史を紹介する博物館です。福井城の本丸の模型や、城下の絵図を焼き付けた陶板などの展示があり、「幕末維新人物ギャラリー」では福井藩内外の志士たちが紹介されています。展示替えなどで休む日があるので、公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "養浩館庭園", h: 12, m: 5, stay: 60, mode: "walk", dur: 5, lat: 36.068449, lng: 136.224414, address: "福井県福井市",
    memo:
      "郷土歴史博物館のとなりにある、福井藩主松平家の別邸の庭園です。江戸時代には「御泉水屋敷」と呼ばれ、明治17年（1884年）に松平春嶽が「養浩館」と名付けました。戦争中の空襲で建物と庭が失われましたが、国の名勝に指定されたのをきっかけに、江戸時代の図面をもとに復元され、1993年から公開されています。大きな池を中心にした池泉回遊式の庭を、ゆっくり歩いてみましょう。",
  }),
  cre({
    name: "福井駅前（昼食）", h: 13, m: 20, stay: 50, mode: "walk", dur: 15, lat: 36.062141, lng: 136.222191, address: "福井県福井市中央1丁目",
    memo:
      "養浩館庭園から歩いて約15分、福井駅のまわりで昼食にしましょう。駅の近くには食事のできる店があります。福井名物のおろしそばやソースカツ丼を探してみるのもよいでしょう。",
  }),
  cre({
    name: "橘曙覧記念文学館", h: 14, m: 30, stay: 45, mode: "walk", dur: 20, lat: 36.059776, lng: 136.211187, address: "福井県福井市足羽1-6-34",
    memo:
      "福井駅から歩いて約20分、足羽山へ上る愛宕坂のふもとにある文学館です。幕末の歌人・橘曙覧は、21歳でこの愛宕山（今の足羽山）に隠れ住み、清貧の暮らしの中で、生活や社会、自然を自由に詠みました。「たのしみは」で始まる「独楽吟」は、正岡子規に絶賛され、アメリカの大統領のスピーチにも引用されました。曙覧の住まいの一部の復元や、独楽吟の全52首を紹介する展示があります。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "足羽神社", h: 15, m: 25, stay: 30, mode: "walk", dur: 10, lat: 36.058276, lng: 136.209597, address: "福井県福井市",
    memo:
      "文学館から、笏谷石が敷かれた145段の愛宕坂を上って約10分。継体天皇と坐摩神の五柱をまつる、越前で最も古い歴史をもつといわれる神社です。境内の枝垂れ桜と、参道のタカオモミジは、福井市の天然記念物に指定されています。石段は雨の日に滑りやすいので、足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "足羽山公園", h: 16, m: 5, stay: 35, mode: "walk", dur: 10, lat: 36.054616, lng: 136.205431, address: "福井県福井市足羽上町",
    memo:
      "足羽神社から歩いて約10分。標高116.4mの足羽山の公園で、福井の礎を築いたとされる継体天皇の像や、十数基の古墳群があります。春には「桜の名所100選」にも選ばれた約3500本の桜が、初夏には市の花のアジサイが咲きます。山の上から福井の町を眺めて、1日目を締めくくりましょう。帰りは福井駅まで歩いて約25分です。",
  }),
];

const day2 = [
  cre({
    name: "一乗谷朝倉氏遺跡博物館", h: 9, m: 0, stay: 105, mode: null, dur: null, lat: 36.015266, lng: 136.298268, address: "福井県福井市安波賀中島町8-10",
    memo:
      "福井駅からJR越美北線で約15分、一乗谷駅から歩いて約3分。戦国大名の朝倉氏が5代103年にわたって越前を治める拠点として築いた城下町の跡「一乗谷朝倉氏遺跡」の博物館で、2022年に開館しました。発掘された数多くの出土品のうち約800点を展示し、朝倉氏の館の様子も伝えています。遺跡を歩く前に、ここで城下町の全体像をつかんでおきましょう。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "一乗谷あさくら水の駅（昼食）", h: 10, m: 55, stay: 50, mode: "walk", dur: 10, lat: 36.020331, lng: 136.294603, address: "福井県福井市安波賀中島町",
    memo:
      "博物館から歩いて約10分、一乗谷朝倉氏遺跡の入口にある道の駅です。イートインスペースで越前おろしそばやソースカツ丼などの福井名物を味わえるので、ここで昼食にしましょう。地元の農産物や加工品も並んでいます。",
  }),
  cre({
    name: "復原町並", h: 12, m: 20, stay: 80, mode: "walk", dur: 35, lat: 35.999318, lng: 136.293964, address: "福井県福井市城戸ノ内町",
    memo:
      "道の駅から谷あいの道を歩いて約35分（バスもあります）。発掘調査で、一乗谷には京都のように整然とした町並みがあったことがわかり、武家屋敷と町屋が並ぶ約200mの町並みが、見つかった塀の石垣や建物の礎石をそのまま使って復原されています。戦国時代の城下町を歩く気分で、屋敷や町屋をのぞいてみましょう。",
  }),
  cre({
    name: "朝倉館跡・唐門", h: 13, m: 45, stay: 70, mode: "walk", dur: 5, lat: 35.99972, lng: 136.295253, address: "福井県福井市城戸ノ内町",
    memo:
      "復原町並から歩いてすぐ。朝倉氏5代目・朝倉義景の館の跡で、全国で唯一発掘・整備された戦国大名の館跡とされています。館の正面の西門にある唐門は遺跡のシンボルで、義景の菩提を弔うために江戸時代に建てられたと推定されています。広い館の跡に立って、往時の姿を思い描いてみましょう。",
  }),
  cre({
    name: "湯殿跡庭園", h: 15, m: 0, stay: 35, mode: "walk", dur: 5, lat: 35.998849, lng: 136.295438, address: "福井県福井市城戸ノ内町",
    memo:
      "朝倉館跡から少し山を上った、館全体を見下ろす高台にある庭園です。戦国時代の荒々しく勇壮な石組が残り、1991年に国の特別名勝に指定された4つの庭園の一つです。上り道は足元が悪いところもあるので、気をつけて歩きましょう。",
  }),
  cre({
    name: "諏訪館跡庭園", h: 15, m: 45, stay: 45, mode: "walk", dur: 10, lat: 35.997647, lng: 136.29458, address: "福井県福井市城戸ノ内町",
    memo:
      "湯殿跡庭園から歩いて約10分。朝倉義景が側室の小少将のためにつくったといわれ、遺跡の中で最も大きな庭園です。戦国時代の池泉庭園としては、日本でも第一級の豪華さを誇るとされ、特別名勝に指定されています。帰りは、近くの「復原町並」のバス停から路線バスで福井駅へ戻ります。バスの時刻は公式の案内で確かめてください。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== SAKAE_ID || days[1].spots.map((s) => s.id).join() !== PARK_ID) throw new Error("既存スポットが想定と違います");

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === SAKAE_ID ? "佐佳枝廼社(既存)" : "福井市中央公園(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      // 中央公園を2日目から1日目へ移す（番号の衝突を避けて9500番台に置き、下の並べ替えで振り直す）
      await tx.spot.update({ where: { id: PARK_ID }, data: { dayId: DAY1_ID, orderNo: 9501 } });
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

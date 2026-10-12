/**
 * #174 5b2a965f「元伊勢と丹後国分寺、歴史とパワースポットを訪ねる日帰り旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 5か所 09:00〜13:40 で、昼食・朝の行き方・帰りの一言がなく、時刻の並びも前後していた。5か所の本文は c5aee4db とほぼ同じ文だったので、すべて書き直す
 * 天橋立のほかのしおり（7b69bad5・8e5d82be・c5aee4db・6ba2fc04）の本文を読み、使っていない話で書いた
 *   （籠神社: 名神大社と水琴窟、眞名井神社: 久志濱宮と磐座と御神水、成相寺: 修験の場と弁天山展望台、智恩寺: 山門の黄金閣と九世戸縁起の悪龍、国分寺跡: 建武の再建と雪舟の天橋立図、
 *    旧三上家住宅: 元結屋・白壁・府指定名勝の庭）。眞名井神社・パノラマ展望所・金引の滝はほかのしおりにない。
 *   府立丹後郷土資料館は令和9年秋まで臨時休館なので入れない
 * 車の旅（京都丹後鉄道の天橋立駅の近くでレンタカーを借りて返す）:
 *   元伊勢籠神社 9:00 → 眞名井神社 → 傘松公園 → 成相寺 → 成相山パノラマ展望所 → 丹後国分寺跡 → 文珠の門前（昼食）→ 智恩寺 → 旧三上家住宅 → 金引の滝 16:47 → 天橋立駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（天橋立観光協会 https://www.amanohashidate.jp/spot/<名前>/）:
 *   motoise 元伊勢籠神社（奈良時代に丹後の一の宮・延喜式で名神大社・山陰道唯一の大社・水琴窟・7:30〜）／manai 眞名井神社（籠神社の奥宮・別名 久志濱宮・本殿の裏に約2,500年前からの磐座・
 *   「天の眞名井の水」・籠神社から徒歩7分）／kasamatsu 傘松公園（成相山の中腹・北側から一望・昇龍観・股のぞき発祥の地・ケーブルカーとリフト）／nariaiji 成相寺（西国第二十八番・
 *   弁天山展望台・パノラマ展望台は成相寺の駐車場から車で7分、能登半島や白山まで見渡せ日本一のパノラマ展望台といわれる・8:00〜16:30・駐車場あり）と成相寺 https://www.nariaiji.jp/（日本古来の山岳宗教の修験場）／
 *   chionji 智恩寺（山門は黄金閣とも呼ばれる市の指定文化財・楼上に釈迦如来と十六羅漢・禅宗様の三間三戸二重門で丹後地方最大の山門・九世戸縁起: 暴れる悪龍を鎮めるため文殊菩薩を招いた）／
 *   food/tag/monju/（智恩寺の門前に「智恵の餅」の四軒茶屋・元禄3年の創業・文珠の食事処）／mikamike 旧三上家住宅（平成15年に主屋など8棟が重要文化財・元結屋三上家・白壁・庭園は府指定名勝で奥座敷から・
 *   係の案内・水曜休み・入館は16:30まで）／kanabiki 金引の滝（日本の滝100選・高さ約40m幅約20m・右が男滝、左が女滝・下流の白龍、臥龍とあわせて総称・滝馬公園の駐車場から約500m徒歩10分）
 *   国土交通省 多言語解説文 https://www.mlit.go.jp/tagengo-db/R2-01550.html 丹後国分寺跡（741年・1334年に再建・1542年に戦火で焼失・1683年の洪水のあと移転・礎石が残る・
 *   雪舟の「天橋立図」に16世紀はじめの金堂や五重塔が描かれる）
 * 座標: OSM — 籠神社 way 681747088・真名井神社 way 788577611・傘松公園 way 683931922・成相寺 way 683933400・丹後国分寺跡 way 1113487378・文殊堂 智恩寺 way 683935012・
 *   重要文化財 旧三上家住宅 way 491913518（Nominatim の中心）／成合山パノラマ展望所 node 6402084479・智恵の輪 node 6418603149・金引の滝 node 832671779（node は API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-174-5b2a965f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5b2a965f-d418-4fb0-93b5-b715252e8740";
const DAY_ID = "bed45266-85fe-4809-9c2e-91d7e397499c";
const KONO = "775d9174-b342-4a57-b0f4-e44dabff76e9";
const NARIAI = "148d4d79-f00b-442d-8909-0e6b675682b1";
const KASAMATSU = "29245d4d-1f2c-47f1-8e71-8e0a17fbbbc2";
const KOKUBUN = "126197ba-d2f7-485f-a034-2300d8d54e67";
const CHIONJI = "b2b94b81-159a-48a8-97e6-7c3f2203e992";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const DESCRIPTION =
  "天橋立の北の府中で、元伊勢と呼ばれる籠神社と奥宮の眞名井神社にお参りし、傘松公園と成相寺、山の上のパノラマ展望所から天橋立を見下ろします。雪舟の絵にも描かれた丹後国分寺の跡を訪ね、文珠の門前で昼食。午後は智恩寺の山門、宮津の商家・旧三上家住宅、金引の滝をめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KONO, { h: 9, m: 0, stay: 40, legs: [], lat: 35.582645, lng: 135.1967576, address: "京都府宮津市大垣430",
    memo: "この旅は車でめぐります。京都丹後鉄道の天橋立駅の近くでレンタカーを借りて、阿蘇海をぐるりと回って車で約20分。伊勢神宮にまつられる天照大神と豊受大神が、この地から伊勢へ移されたという言い伝えから「元伊勢」と呼ばれる神社です。奈良時代に丹後の国の一の宮となり、平安時代の「延喜式」では名神大社とされ、山陰道でただ一つの大社とされます。境内には、地下を流れる水の音を聞ける水琴窟もあります。" + PRAY }),
  cre("眞名井神社", { h: 9, m: 47, stay: 30, legs: [walk(7)], lat: 35.5865496, lng: 135.1984981, address: "京都府宮津市中野905",
    memo: "籠神社から歩いて約7分。籠神社の奥宮で、「久志濱宮」という別名もあります。本殿の裏には、約2500年前からそのままの形でまつられてきたとされる古代の祭りの場「磐座」があり、豊受大神や天照大神などの神々がまつられています。境内には「天の眞名井の水」と呼ばれる御神水が湧き、汲みに訪れる人も多くいます。" + PRAY }),
  upd(KASAMATSU, { h: 10, m: 27, stay: 30, legs: [walk(5), other(5, "天橋立ケーブルカー")], lat: 35.5867585, lng: 135.195117, address: "京都府宮津市大垣",
    memo: "眞名井神社から籠神社の前へ戻って歩き、ケーブルカーかリフトで上がって、あわせて約10分。成相山の中腹にある展望所で、天橋立を北側から一度に見渡せます。ここは「股のぞき」が始まった場所とされ、背を向けて股の間からのぞくと、砂州が空へ昇る龍のように見えることから、この眺めは「昇龍観」と呼ばれます。ケーブルカーやリフトに乗るときは、係の人の案内に従いましょう。" }),
  upd(NARIAI, { h: 11, m: 22, stay: 45, legs: [other(5, "天橋立ケーブルカー"), walk(5), car(15)], lat: 35.5949732, lng: 135.1878193, address: "京都府宮津市成相寺339",
    memo: "傘松公園からケーブルカーで下り、籠神社の駐車場から山道を車で約15分（あわせて約25分）。西国三十三所の第二十八番札所で、もとは日本古来の山岳信仰の修行の場だったとされます。境内の弁天山展望台からも、天橋立を見下ろせます。拝観は夕方までなので、時間に気をつけましょう。" + PRAY }),
  cre("成相山パノラマ展望所", { h: 12, m: 14, stay: 20, legs: [car(7)], lat: 35.6011235, lng: 135.1880953, address: "京都府宮津市成相寺",
    memo: "成相寺の駐車場から、さらに山道を車で約7分。成相山の上の展望所で、天気のよい日には能登半島や白山まで見渡せるとされ、日本一のパノラマ展望台ともいわれます。山道はカーブが続くので、ゆっくり運転しましょう。" }),
  upd(KOKUBUN, { h: 12, m: 54, stay: 20, legs: [car(20)], lat: 35.5791985, lng: 135.1790262, address: "京都府宮津市国分",
    memo: "展望所から山を下りて、車で約20分。奈良時代の741年に建てられた丹後国分寺の跡です。寺は1334年に建て直されましたが、1542年に戦で焼け、1683年の洪水のあと、別の場所へ移りました。今は、建物を支えた礎石が残っています。雪舟の名画「天橋立図」には、16世紀はじめの金堂や五重塔が描かれています。" }),
  cre("文珠の門前（昼食）", { h: 13, m: 29, stay: 50, legs: [car(15)], lat: 35.5582847, lng: 135.1848077, address: "京都府宮津市文珠",
    memo: "国分寺跡から阿蘇海を回って、車で約15分。天橋立の南のたもと、智恩寺の門前の文珠に着きます。車を停め、ここからは歩いてめぐります。門前には海の幸や麺類などを出す食事処が集まっているので、ここで昼食にしましょう。智恩寺の門前には、元禄のころからとされる「智恵の餅」の茶屋が四軒並び、食後のひと休みにもよい所です。" }),
  upd(CHIONJI, { h: 14, m: 22, stay: 40, legs: [walk(3)], lat: 35.5586839, lng: 135.1840746, address: "京都府宮津市文珠466",
    memo: "門前から歩いてすぐ。智恵を授ける文殊菩薩の霊場です。茶屋通りに面した山門は「黄金閣」とも呼ばれ、楼上には釈迦如来と十六羅漢が安置されています。禅宗の様式の二重門で、丹後地方で最も大きな山門とされます。昔、この地で暴れた悪龍を鎮めるために、中国から文殊菩薩を招いたという「九世戸縁起」が伝わります。" + PRAY }),
  cre("旧三上家住宅", { h: 15, m: 17, stay: 45, legs: [walk(3), car(12)], lat: 35.5380201, lng: 135.1911381, address: "京都府宮津市河原1850",
    memo: "智恩寺から駐車場へ戻り、宮津の町へ車で約12分（あわせて約15分）。江戸時代、宮津の城下でも指折りの商家だった「元結屋」三上家の住まいです。酒造り、船での商い、糸の問屋などを手がけた家で、住まいと蔵など8棟は、平成15年に国の重要文化財になりました。外は白壁の造りで、座敷にはぜいたくな造作が見られます。京都府の名勝の庭園は、奥座敷から眺めたときに最も美しく見えるようにつくられています。入館は16時半までなので、時間に気をつけましょう。休館日は公式の案内で確かめましょう。" }),
  cre("金引の滝", { h: 16, m: 17, stay: 30, legs: [car(5), walk(10)], lat: 35.5253401, lng: 135.1926886, address: "京都府宮津市滝馬",
    memo: "旧三上家住宅から車で約5分の滝馬公園の駐車場に停め、遊歩道の入り口まで歩いて約10分（あわせて約15分）。高さ約40m、幅約20mの滝で、日本の滝100選に選ばれています。岩肌を左右に分かれて流れ落ち、右側は男滝、左側は女滝と呼ばれます。下流の白龍、臥龍の滝とあわせて「金引の滝」と呼ばれています。岩場は濡れて滑りやすいので、足元に気をつけましょう。" + BEAR + "帰りは、駐車場まで歩いて戻り、車で約15分の天橋立駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || [...it.days[0].spots.map((s) => s.id)].sort().join() !== [KONO, NARIAI, KASAMATSU, KOKUBUN, CHIONJI].sort().join())
    throw new Error("構成が想定と違います");
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
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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

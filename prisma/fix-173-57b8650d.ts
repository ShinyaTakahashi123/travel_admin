/**
 * #173 57b8650d「下呂発温泉博物館と中山七里、下呂の歴史と渓谷を楽しむ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所 10:00〜10:50、2日目 1か所 09:30〜10:30 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」「お楽しみいただけたことでしょう」）。
 *   博物館の「効能」、中山七里の「金森長近が名付けた」は出典で確かめていないので書かない
 * 下呂市のほかのしおり（401d9f0c: 温泉寺の白鷺の伝説・博物館の「温泉の科学」と足湯・歩行浴）の本文を読み、使っていない話で書いた。
 *   禅昌寺・巌立峡・雨情公園・金山巨石群・筋骨めぐり・横谷峡はほかのしおりにない
 * 企画運営の指示（2026-10-11）: 1日目の昼食は下呂の温泉街（湯之島宿の点）。2日目の昼食は金山。道の駅かれんの住所（金山町金山911-1）は国土地理院で大字までしか出ないので、
 *   筋骨めぐりの点で「金山の町で昼食」とし、昼食と筋骨めぐりを1つのスポットにまとめた
 * 巌立峡の施設は3月下旬〜12月中旬なので、季節は春・夏・秋にする
 * 車の旅（JR下呂駅の近くでレンタカーを借りて返す。下呂温泉に泊まる）:
 *   1日目: 禅昌寺 9:30 → 巌立峡 → 下呂の温泉街（昼食）→ 湯のまち雨情公園 → 下呂発温泉博物館 → 温泉寺 16:30 → 下呂温泉の宿
 *   2日目: 中山七里 9:30 → 金山巨石群 → 金山の町（昼食と筋骨めぐり）→ 横谷峡 16:30 → 下呂駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（下呂温泉観光協会 https://www.gero-spa.com/ と下呂市 https://www.city.gero.lg.jp/）:
 *   gero-spa spot/detail_18 禅昌寺（平安時代の創建・宋様式の伽藍・金森宗和の作と伝わる庭「萬歳洞」は国の名勝・樹齢1200年を超える大杉は国の天然記念物・雪舟の大達磨）／
 *   spot/detail_26 巌立峡（御嶽山の噴火で流れ出た溶岩がつくった岩壁「巌立」・岐阜県の天然記念物・三ツ滝まで約600mの遊歩道・施設は3月下旬〜12月中旬）／
 *   course/detail_5（下呂温泉街での昼食、金山での昼食と筋骨めぐり、国道41号沿いの食事処）／spot/detail_49 湯のまち雨情公園（下呂市森・阿多野谷の上流・昭和初期に野口雨情が下呂を訪れて作った歌にちなむ）／
 *   spot/detail_14 下呂発温泉博物館（温泉を化学と文化の両面から紹介・5つのテーマ: 温泉の科学、温泉の文化、ようこそ下呂温泉へ、温泉博士の部屋、おもしろ温泉チャレンジ・木曜休館）／spot/detail_20 中山七里（三原から金山まで約28km・屏風岩、羅漢岩、牙岩、円空岩・
 *   飛騨木曽川国定公園・春の岩つつじ）／spot/detail_31 金山巨石群（金山町岩瀬字高平・巨石遺跡で初めて考古天文学的調査が行われた・3か所の石組みはストーンヘンジのように太陽暦として機能するよう設計されたと推定・太陽観測会）
 *   下呂市 /site/kanko/31411 温泉寺（173段の石段・薬師如来・温泉街を見下ろす）／/site/kanko/31446 筋骨めぐり（宿場町の路地を案内人と歩く・約90〜120分・金山町観光協会に予約）／
 *   /site/kanko/1461 横谷峡（飛騨木曽川国定公園内・白滝17m・二見滝13m・紅葉滝9m・鶏鳴滝33m・山道・下呂温泉街から車で約40分）
 * 座標: OSM — 龍澤山 禅昌寺 node 7230894400・巌立 node 294594339・飛騨街道 湯之島宿 node 1156316246・湯のまち 雨情公園 node 7140860330・下呂発温泉博物館 node 1420976072・
 *   湯薬師霊山 温泉寺 node 7178342180・筋骨めぐり node 5144311521（node は API で名前つきを確かめた）／帯雲橋 way 114260562・金山巨石群 way 61930670（Nominatim の中心）／
 *   横谷峡は川の線しかないので、白滝の node 10315067556（name:en=Shirataki Waterfall、日本語の名前の札はない）を使った
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-173-57b8650d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "57b8650d-ffaa-435b-81d7-27085573a508";
const DAY1_ID = "d9f099a4-6575-4748-b160-bfdc3d8da37b";
const DAY2_ID = "3eeeeb48-f978-4f47-9d7f-7eb41a8458d5";
const MUSEUM = "3f52b08a-4f3b-4f15-836a-4e95109d879c";
const NAKAYAMA = "774e4076-b039-40c8-8caa-580d79e1d452";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const DESCRIPTION =
  "1日目は、雪舟の達磨と名勝の庭が残る禅昌寺と、溶岩の岩壁がそびえる巌立峡をめぐり、下呂の温泉街へ。雨情公園、下呂発温泉博物館、温泉寺を歩いて、下呂温泉に泊まります。2日目は、飛騨川の渓谷・中山七里を下り、太陽の暦ともいわれる金山巨石群、宿場町の路地をめぐる筋骨めぐり、4つの滝が続く横谷峡を訪ねる、レンタカーの1泊2日プランです。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("禅昌寺", { h: 9, m: 30, stay: 50, legs: [], lat: 35.8460461, lng: 137.2291014, address: "岐阜県下呂市萩原町中呂1089",
    memo: "この旅は車でめぐります。JR下呂駅の近くでレンタカーを借りて、北へ車で約20分。平安時代に開かれたと伝わる禅寺で、宋の様式を取り入れた伽藍が並びます。江戸時代の茶人・金森宗和の作と伝わる庭「萬歳洞」は国の名勝に、樹齢1200年を超えるとされる大杉は国の天然記念物に指定されています。寺には、雪舟が描いたと伝わる大きな達磨の絵も残ります。" + PRAY }),
  cre("巌立峡", { h: 10, m: 50, stay: 75, legs: [car(30)], lat: 35.914071, lng: 137.3304164, address: "岐阜県下呂市小坂町落合",
    memo: "禅昌寺から北東へ、車で約30分の小坂の谷へ。御嶽山の噴火で流れ出た溶岩が冷えて固まってできた岩壁「巌立」が、目の前にそびえ立ちます。岐阜県の天然記念物に指定されています。岩壁のそばから、三ツ滝まで約600mの遊歩道が続くので、歩いて滝を見に行きましょう。遊歩道は岩や段差が多いので、歩きやすい靴で、足元に気をつけましょう。" + BEAR }),
  cre("下呂の温泉街（昼食）", { h: 12, m: 50, stay: 50, legs: [car(45)], lat: 35.8093081, lng: 137.2438732, address: "岐阜県下呂市湯之島",
    memo: "巌立峡から飛騨川に沿って南へ、車で約45分の下呂温泉へ。車は宿か近くの駐車場に置き、ここからは歩いてめぐります。飛騨川の東の岸に広がる温泉街には、食事のできる店が並んでいます。ここで昼食にしましょう。鶏肉を味付けして野菜と焼く、この地方の「鶏ちゃん」などが味わえます。" }),
  cre("湯のまち雨情公園", { h: 13, m: 45, stay: 30, legs: [walk(5)], lat: 35.8092893, lng: 137.2466944, address: "岐阜県下呂市森",
    memo: "温泉街から歩いて約5分。温泉街に近い、阿多野谷の上流に広がる公園で、下呂の山ふところから流れ出る清流が、公園の中ほどを流れています。名前は、昭和のはじめに下呂を訪れた詩人・野口雨情が、この地で作った歌にちなみます。せせらぎの音を聞きながら、ひと休みしましょう。" }),
  upd(MUSEUM, { h: 14, m: 25, stay: 70, legs: [walk(10)], lat: 35.8101125, lng: 137.2414676, address: "岐阜県下呂市湯之島543-2",
    memo: "雨情公園から歩いて約10分。温泉を、化学と文化の両方の面から紹介する博物館です。館内は5つのテーマに分かれ、「温泉の文化」「ようこそ下呂温泉へ」「温泉博士の部屋」「おもしろ温泉チャレンジ」などのコーナーを、楽しみながら見てまわれます。休館日は公式の案内で確かめましょう。" }),
  cre("温泉寺", { h: 15, m: 45, stay: 45, legs: [walk(10)], lat: 35.8100689, lng: 137.2420728, address: "岐阜県下呂市湯之島680",
    memo: "博物館から歩いて約10分。173段の石段を上った先にある寺で、薬師如来をまつっています。山門のあたりからは、飛騨川に沿って広がる温泉街を見下ろせます。石段は急なので、足元に気をつけて上りましょう。" + PRAY + "この日は下呂温泉に泊まりましょう。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。" }),
];

const DAY2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(NAKAYAMA, { h: 9, m: 30, stay: 60, legs: [car(10)], lat: 35.7799954, lng: 137.2535232, address: "岐阜県下呂市三原",
    memo: "下呂温泉の宿から南へ、車で約10分。飛騨川が山をけずってつくった渓谷で、三原の帯雲橋から金山まで、約28kmにわたって続きます。飛騨木曽川国定公園の一部で、屏風岩、羅漢岩、牙岩、円空岩など、形も名前もさまざまな岩が次々に現れ、春には岩つつじが岩場を彩ります。国道41号に沿って下りながら、車を停められる所から眺めましょう。川岸には近づきすぎないようにしましょう。" }),
  cre("金山巨石群", { h: 11, m: 10, stay: 60, legs: [car(40)], lat: 35.7546817, lng: 137.1582915, address: "岐阜県下呂市金山町岩瀬字高平",
    memo: "中山七里を金山まで下り、山あいへ入って、あわせて車で約40分。山の斜面に大きな岩が重なり合う遺跡で、日本で初めて考古天文学の調査が行われた場所とされます。3か所の石組みは、イギリスのストーンヘンジのように、太陽の暦として働くように造られたと推定されています。季節によっては、石のすき間から差し込む日の光を観る会も開かれています。" + BEAR }),
  cre("金山の町（昼食と筋骨めぐり）", { h: 12, m: 30, stay: 140, legs: [car(20)], lat: 35.6610545, lng: 137.1559925, address: "岐阜県下呂市金山町金山",
    memo: "巨石群から車で約20分、飛騨川と馬瀬川が出あう金山の町へ。国道41号に沿って食事のできる店があるので、まず昼食にしましょう。昼食のあとは「筋骨めぐり」へ。宿場町として栄えた金山の、家と家のあいだを縫うように続く細い路地を、地元の案内人と歩いて、町の暮らしの歴史にふれます。案内は約90〜120分で、前もって金山町観光協会に申し込みましょう。路地には今も人が暮らしているので、静かに歩きましょう。" }),
  cre("横谷峡", { h: 15, m: 5, stay: 85, legs: [car(15)], lat: 35.676907, lng: 137.1348389, address: "岐阜県下呂市金山町",
    memo: "金山の町から車で約15分。飛騨木曽川国定公園の中にある渓谷で、山道に沿って、白滝、二見滝、紅葉滝、鶏鳴滝の4つの滝を順にめぐれます。高さは白滝が約17m、二見滝が約13m、紅葉滝が約9m、いちばん奥の鶏鳴滝は約33mあります。谷沿いの道は濡れて滑りやすい所があるので、足元に気をつけましょう。" + BEAR + "帰りは、車で約40分のJR下呂駅の近くでレンタカーを返しましょう。" }),
];

function show(label: string, DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>>) {
  console.log(`\n${label}`);
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
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== MUSEUM ||
    it.days[1].spots.map((s) => s.id).join() !== NAKAYAMA
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: SEASONS as never } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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

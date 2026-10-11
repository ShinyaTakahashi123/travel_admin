/**
 * #224 de637e2a「昇仙峡ロープウェイで空中散歩、パノラマ台からの絶景プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ようこそ」「ご了承ください」）。
 *   「1964年に開業」「大型ヘリコプターで資材を運んだ逸話」は出典が確かめられず、住所（羽黒町）も違っていた
 * 車の旅（JR甲府駅の近くでレンタカーを借りて返す）:
 *   昇仙峡ロープウェイ 9:00 → 仙娥滝 → 金櫻神社 → 山梨県立美術館（昼食・館内のレストラン）→ 山梨県立文学館 → 舞鶴城公園 16:30 → 甲府駅
 *   渓谷の長潭橋・天鼓林・覚円峰・石門は、OSM にも国土地理院にも名前つきの点がないので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 富士の国やまなし観光ネット（山梨県公式） https://www.yamanashi-kankou.jp/ —
 *   /special/2019_shosenkyo.html （1953年に国の特別名勝・甲府駅から車で約40分・仙娥滝の落差30m・日が射すと虹・仙娥滝から滝上まで180段の階段・
 *     ロープウェイの山頂から富士山や金峰山、南アルプス、甲府盆地・山頂から歩いて約20分の弥三郎岳・ロープウェイの住所 甲府市猪狩町441）／
 *   /course/nature/005.html （仙娥滝駅からパノラマ台駅まで約5分・みはらし台から富士山と南アルプス）／
 *   /rekitabi/jisha/spot/016.html （金櫻神社: 金峰山を御神体・山頂に奥宮・御神木の鬱金の桜は甲府市の天然記念物・「金の成る木の金櫻」・昭和30年の大火で焼失し再建・本殿に伝・左甚五郎作「昇・降龍」を復元）／
 *   /kankou/spot/p1_4339.html （山梨県立美術館: 1978年開館・「ミレーの美術館」・最初の収蔵品《種をまく人》・バルビゾン派・9時〜17時）、/special/art_museum.html （館内のレストラン）／
 *   /kankou/spot/p1_4885.html （山梨県立文学館: 1989年・芸術の森公園で美術館と向かい合う・芥川龍之介、飯田蛇笏、太宰治など）／
 *   /kankou/spot/p2_4404.html （舞鶴城公園: 日本百名城の一つ・武田氏滅亡後16世紀末に築城・天守台から甲府盆地を360度、富士山や南アルプス・甲府駅から徒歩5分）
 *   甲府市 https://www.city.kofu.yamanashi.jp/kanko/shosenkyoinfo.html （ロープウェイ・金櫻神社の紹介、2026年6月更新）
 * 座標: OSM — 昇仙峡ロープウェイ（パノラマ台駅）way 416488272・山梨県立美術館 way 251145786・山梨県立文学館 way 251145788・舞鶴城公園 way 129722779（いずれも Nominatim の中心）／
 *   仙娥滝 node 8932187243・金櫻神社 node 9522304212（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-224-de637e2a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "de637e2a-f51b-41e1-a874-69fde15d5972";
const DAY_ID = "2150aedf-533c-4f95-ae3a-d1364e2146b5";
const ROPEWAY = "f85207df-0568-479b-a5d4-6e6f1202bd60";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "朝いちばんに昇仙峡ロープウェイで山頂のパノラマ台へ上がり、富士山や南アルプスを眺めたら、落差30mの仙娥滝と、金峰山を御神体とする金櫻神社へ。午後は甲府の町に下り、ミレーの作品で知られる山梨県立美術館で昼食と鑑賞、文学館と甲府城跡の舞鶴城公園をめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(ROPEWAY, { h: 9, m: 0, stay: 75, legs: [], lat: 35.7488654, lng: 138.555034, address: "山梨県甲府市猪狩町441",
    memo: "この旅は車でめぐります。JR甲府駅の近くでレンタカーを借りて、車で約40分の昇仙峡の滝上へ。仙娥滝駅からロープウェイに乗ると、約5分で山頂のパノラマ台駅に着きます。山頂からは、富士山や金峰山、南アルプスの山々と、甲府盆地を見渡せます。歩いて約20分の弥三郎岳まで足をのばすと、また違う眺めが広がります。弥三郎岳への道は山道なので、歩きやすい靴で出かけましょう。天気によっては運休することもあるので、運行は公式の案内で確かめましょう。" }),
  cre("仙娥滝", { h: 10, m: 25, stay: 25, legs: [{ mode: "walk", min: 10 }], lat: 35.7494784, lng: 138.5660912, address: "山梨県甲府市猪狩町",
    memo: "ロープウェイの仙娥滝駅から、滝上の通りを抜けて階段を下り、歩いて約10分。国の特別名勝に指定されている昇仙峡を代表する滝で、落差は30m。日が射すと、しぶきに虹がかかることもあります。滝から滝上へ戻る道は180段の階段が続くので、足元に気をつけて、ゆっくり上りましょう。" }),
  cre("金櫻神社", { h: 11, m: 10, stay: 40, legs: [{ mode: "walk", min: 10 }, { mode: "car", min: 10 }], lat: 35.7694402, lng: 138.5561097, address: "山梨県甲府市御岳町2347",
    memo: "滝上の駐車場へ歩いて戻り、車で約10分の御岳町へ（あわせて約20分）。奥秩父の金峰山を御神体とし、山頂に奥宮がある神社です。御神木の鬱金の桜は甲府市の天然記念物で、「金の成る木の金櫻」として古くから崇められてきました。昭和30年の大火で焼失したのち再建され、本殿には、左甚五郎の作と伝わる「昇・降龍」が復元されています。" + PRAY }),
  cre("山梨県立美術館", { h: 12, m: 35, stay: 105, legs: [{ mode: "car", min: 45 }], lat: 35.6602831, lng: 138.5374708, address: "山梨県甲府市貢川1-4-27",
    memo: "金櫻神社から山を下り、車で約45分、甲府の町の芸術の森公園へ。1978年の開館以来「ミレーの美術館」として親しまれ、最初に収められたミレーの《種をまく人》をはじめ、ミレーやバルビゾン派の画家たちの作品を見られます。館内のレストランで昼食にしてから、ゆっくり鑑賞しましょう。休館日は公式の案内で確かめましょう。" }),
  cre("山梨県立文学館", { h: 14, m: 25, stay: 60, legs: [{ mode: "walk", min: 5 }], lat: 35.6601736, lng: 138.5393353, address: "山梨県甲府市貢川1-5-35",
    memo: "美術館から公園の中を歩いて約5分。1989年に、芸術の森公園の中で美術館と向かい合うように開かれた文学館です。芥川龍之介や飯田蛇笏、太宰治など、山梨の出身やゆかりの作家たちの資料と作品を紹介しています。休館日は公式の案内で確かめましょう。" }),
  cre("舞鶴城公園", { h: 15, m: 45, stay: 45, legs: [{ mode: "car", min: 20 }], lat: 35.6651191, lng: 138.5713285, address: "山梨県甲府市丸の内1丁目",
    memo: "文学館から車で約20分、甲府駅のすぐ南へ。武田氏が滅んだあと、16世紀の終わりに築かれた甲府城の跡で、日本百名城のひとつに選ばれています。石垣の上の天守台からは甲府盆地を360度見渡せ、晴れた日には富士山や南アルプスも望めます。石垣や石段では足元に気をつけましょう。帰りは、車で約5分のJR甲府駅の近くへ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== ROPEWAY) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "昇仙峡ロープウェイ(既存)" : d.name} ${String(d.memo).length}字`);
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

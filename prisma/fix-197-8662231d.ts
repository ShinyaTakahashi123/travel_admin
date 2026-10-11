/**
 * #197 8662231d「慶雲館と豊国神社、長浜の歴史的建造物を巡る文化さんぽプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:10 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。もとの慶雲館の本文は 3993afce の文とほぼ同じなので書き直す
 * 歩きの旅（JR長浜駅から歩いて、帰りも長浜駅へ）:
 *   慶雲館 9:30 → 長浜鉄道スクエア → 長浜旧開知学校 → 北国街道 安藤家 → 黒壁スクエア（昼食）→ 豊国神社 → 大通寺 → 長浜城歴史博物館 16:30 → 長浜駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 長浜のほかのしおり（2d1bfca6・3993afce）の本文を読み、使っていない話で書いた
 *   （慶雲館は大灯籠と芭蕉の句碑と盆梅展、鉄道スクエアは展示の機関車と鉄道模型、豊国神社は祭神とえびすの社の形と明治31年の社殿、大通寺は長浜城の追手門の薬医門と障壁画と蘭亭庭園、
 *    長浜城歴史博物館は昭和58年の復元と5階の展望台）。長浜旧開知学校・北国街道 安藤家はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（滋賀県の観光公式サイト biwako-visitors.jp、長浜市 city.nagahama.lg.jp）:
 *   spot/detail/3577/ 慶雲館（浅見又蔵が明治天皇の行幸に合わせて建てた長浜の迎賓館・伊藤博文が命名・二代目又蔵が行幸25周年に庭園を造営、七代目小川治兵衛・高さ5mをこえる大灯籠と日本一大きな芭蕉の句碑・
 *   1月中旬〜3月中旬の長浜盆梅展）／spot/detail/762/ 長浜鉄道スクエア（旧長浜駅舎・長浜鉄道文化館・北陸線電化記念館・ED70形1号機交流電気機関車・D51形793号機蒸気機関車・琵琶湖水運の資料と鉄道模型）／
 *   city.nagahama.lg.jp/cmsfiles/contents/0000000/396/KohoNagahama130915_web01.pdf 長浜旧開知学校（滋賀県第一小学校が前身・明治7年の木造3階建て、屋上に八角形の櫓の擬洋風建築・建築費の全額を町民の寄付・
 *   平成12年に復元修理、国の登録有形文化財）／spot/detail/23167/ 北国街道 安藤家（室町時代から長浜に住む旧家・賤ヶ岳合戦で秀吉に協力・江戸期は町の自治を担う三年寄・呉服問屋・北大路魯山人の装飾・離れの小蘭亭・
 *   植宇が手がけた池泉式の庭「古翠園」）と course/detail/46/（明治38年から大正4年にかけての建物、虫籠窓と紅殻格子の近代和風建築）／spot/detail/1181/ 黒壁スクエア（明治33年の第百三十国立銀行長浜支店、
 *   黒壁銀行の愛称・平成元年に黒壁一號館とガラス館・約30店）／spot/detail/346/ 豊国神社（事代主大神、豊臣秀吉、加藤清正、木村重成をまつる・江戸時代は表にえびすをまつり、奥に秀吉の像・明治31年の秀吉300年忌に社殿）／
 *   spot/detail/575/ 大通寺（真宗大谷派の別院、長浜御坊・本堂と大広間は伏見城の遺構と伝わる・脇門の薬医門は長浜城の追手門を移築・狩野山楽、山雪、円山応挙の障壁画・名勝の含山軒庭園と蘭亭庭園、蘭亭は反橋の池泉庭園）／
 *   spot/detail/761/ 長浜城歴史博物館（昭和58年に安土桃山時代の城郭を模して復元・2階と3階の展示・5階の展望台・入館は16:30まで、月曜休館）
 * 座標: OSM — 慶雲館 way 541463079（museum）・豊国神社 way 34627584・大通寺 way 35185493・長浜城 way 412923591（historic=castle）（Nominatim の中心）／長浜旧開知学校 node 5502988829・安藤家 node 5502987824
 *   （viewpoint、API で名前つき）・黒壁美術館 node 534529037／長浜鉄道スクエア way 854120758（tourism=museum、Nominatim の中心）。黒壁スクエアの全体の点はないので、中の黒壁美術館（museum）の点を使う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-197-8662231d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8662231d-f119-4190-aa1d-b9b4d1ed051e";
const DAY1_ID = "c6048113-ec09-461b-a063-3c514d82bc6a";
const KEIUNKAN = "f94f8d7f-e8fb-4f15-9f40-735d52f86c80";
const HOKOKU = "f0b43d0f-a646-4486-b150-1e3478a2bdca";
const TETSUDO = { lat: 35.3768446, lng: 136.2658708 };
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "長浜の迎賓館・慶雲館から、機関車の並ぶ長浜鉄道スクエア、町の人の寄付で建った旧開知学校、魯山人の装飾が残る安藤家へ。黒壁スクエアで昼食をとり、豊国神社と大通寺にお参りして、長浜城歴史博物館の展望台から湖北を眺める、明治から戦国の建物をたどる町歩きです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(KEIUNKAN, { h: 9, m: 30, stay: 52, legs: [], lat: 35.3758132, lng: 136.2663396, address: "滋賀県長浜市港町2-5",
    memo: "この旅は歩いてめぐります。JR長浜駅から歩いてすぐ。明治天皇の行幸に合わせて、長浜の豪商・浅見又蔵が建てた長浜の迎賓館です。庭には高さ5mをこえる大きな灯籠や、日本一大きいとされる松尾芭蕉の句碑が置かれています。冬から早春にかけては、館内で鉢植えの梅を並べる「長浜盆梅展」が開かれます。" }),
  cre("長浜鉄道スクエア", { h: 10, m: 25, stay: 40, legs: [walk(3)], lat: TETSUDO.lat, lng: TETSUDO.lng, address: "滋賀県長浜市北船町1-41",
    memo: "慶雲館から歩いて約3分。初代の長浜駅舎のとなりに、長浜鉄道文化館と北陸線電化記念館が並ぶ鉄道の資料館です。文化館では、長浜の鉄道の歩みや琵琶湖の水運の資料、北陸線の鉄道模型を、記念館では交流電気機関車のED70形1号機と、蒸気機関車のD51形793号機を見られます。" }),
  cre("長浜旧開知学校", { h: 11, m: 13, stay: 15, legs: [walk(8)], lat: 35.3794553, lng: 136.2673518, address: "滋賀県長浜市元浜町",
    memo: "鉄道スクエアから歩いて約8分。「滋賀県第一小学校」として開かれた学校の校舎で、明治7年（1874年）に建てられた木造3階建て、屋上に八角形の櫓をのせた擬洋風の建物です。建てる費用はすべて長浜の町の人々の寄付でまかなわれました。平成12年に昔の姿に直され、国の登録有形文化財です。外から眺めましょう。" }),
  cre("北国街道 安藤家", { h: 11, m: 30, stay: 35, legs: [walk(2)], lat: 35.3798013, lng: 136.2671029, address: "滋賀県長浜市元浜町",
    memo: "旧開知学校から歩いてすぐ。室町時代から長浜に住む旧家で、賤ヶ岳の合戦では秀吉に協力し、江戸時代には町の自治を担う「三年寄」の一家、のちには呉服問屋として栄えました。明治38年から大正4年にかけて建てられた建物は、虫籠窓や紅殻格子を備えた近代和風建築です。離れの「小蘭亭」には北大路魯山人の装飾が残り、庭師・植宇が手がけた池泉式の庭「古翠園」もあります。小蘭亭の公開の日は公式の案内で確かめましょう。" }),
  cre("黒壁スクエア（昼食）", { h: 12, m: 8, stay: 52, legs: [walk(3)], lat: 35.3810716, lng: 136.2667137, address: "滋賀県長浜市元浜町",
    memo: "安藤家から歩いて約3分。明治33年（1900年）に建てられ、黒い壁から「黒壁銀行」と呼ばれた銀行の建物を生かした一画で、約30の店が並びます。このあたりで昼食にしましょう。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }),
  upd(HOKOKU, { h: 13, m: 5, stay: 30, legs: [walk(5)], lat: 35.3804842, lng: 136.2650179, address: "滋賀県長浜市南呉服町6-37",
    memo: "黒壁スクエアから歩いて約5分。事代主大神と豊臣秀吉、加藤清正、木村重成をまつる神社です。江戸時代には、商売の神のえびすを表にまつり、奥に秀吉の像をひそかにまつって守り続けたと伝わります。今の社殿は、秀吉の300年忌にあたる明治31年（1898年）に建てられたものです。" + PRAY }),
  cre("大通寺", { h: 13, m: 45, stay: 60, legs: [walk(10)], lat: 35.3832605, lng: 136.2693281, address: "滋賀県長浜市元浜町32-9",
    memo: "豊国神社から北東へ歩いて約10分。「長浜御坊」と呼ばれる真宗大谷派の別院です。脇門の薬医門は、長浜城の追手門を移したものとされます。座敷の障壁画は、狩野山楽・山雪や円山応挙が描いたもので、小さな池に反橋のかかる蘭亭庭園は国の名勝です。" + PRAY }),
  cre("長浜城歴史博物館", { h: 15, m: 0, stay: 90, legs: [walk(15)], lat: 35.3775568, lng: 136.260968, address: "滋賀県長浜市公園町10-10",
    memo: "大通寺から琵琶湖の方へ歩いて約15分。昭和58年（1983年）に、安土桃山時代の城を模して建てられた天守の形の博物館です。2階では湖北・長浜の資料を、3階では「秀吉と長浜」をテーマにした展示を見られます。5階の展望台からは湖北を見渡せ、ナレーションと効果音で、戦国の長浜の役割を感じられます。入館の時間と休館日は公式の案内で確かめましょう。帰りは、長浜駅まで歩いて約8分です。" }),
];

function show(label: string, DAY: X[]) {
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [KEIUNKAN, HOKOKU].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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

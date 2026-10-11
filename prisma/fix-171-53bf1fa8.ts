/**
 * #171 53bf1fa8「北野異人館街とメリケンパーク、定番の神戸港町さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜13:00 で、昼食・帰りの一言がなく、北野からメリケンパークへ車で移動していた。本文は案内の話し方（「皆様」「ご案内するのは」）
 * 神戸市のほかのしおり（38dec57e・bf51abd1: 北野異人館街・生田神社・南京町・神戸市立博物館・メリケンパーク・ポートタワー・海洋博物館・震災メモリアルパーク・ハーバーランド）の本文を読み、
 *   使っていない話で書いた（異人館街: 風見鶏の館、メリケンパーク: 開港120年の開園と BE KOBE）。相楽園・湊川神社・旧居留地・市役所の展望ロビーはほかのしおりにない
 * 歩きの旅（三宮駅から歩いてめぐり、元町駅へ）:
 *   北野異人館街 9:30 → 北野天満神社 → 相楽園 → 湊川神社 → 旧居留地（昼食）→ 神戸市役所展望ロビー → メリケンパーク 16:30 → 元町駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（神戸公式観光サイト Feel KOBE https://www.feel-kobe.jp/）:
 *   facilities/0000000032 風見鶏の館（明治42年ごろ、ドイツ人貿易商トーマスの自邸・設計はデ・ラランデ・レンガの外壁と尖塔の風見鶏は北野異人館のシンボル・国の重要文化財）／
 *   facilities/kitano-shrine 北野天満神社（1180年、平清盛が福原の都をつくったときに京都の北野天満宮から迎えた・菅原道真・約260年前の本殿などは神戸市の伝統的建造物）／
 *   facilities/0000000027 相楽園（小寺泰次郎の本邸の庭・明治18年ごろから築き明治末に完成・昭和16年から神戸市・旧小寺家厩舎、船屋形、旧ハッサム住宅は重要文化財）と相楽園公式の検索結果（木曜休園）／
 *   column/kobe-retro 旧居留地（開港後に外国人居留地・明治32年の条約改正で商業の中心へ・近代建築を生かした店やカフェ）と検索結果の十五番館（明治13年ごろ・居留地時代から残る唯一の建物）／
 *   facilities/0000000822 BE KOBE モニュメント（2017年に開港150年を記念して設置・阪神・淡路大震災から20年をきっかけに生まれた「神戸の魅力は人である」という思い）と検索結果（メリケンパークは開港120年の1987年に開園）
 *   湊川神社 https://www.minatogawajinja.or.jp/about/ と検索結果（南北朝時代の武将・楠木正成・明治5年創建・墓所に徳川光圀の「嗚呼忠臣楠子之墓」の碑）
 *   神戸市 https://faq.city.kobe.lg.jp/faq/show/1241 市役所1号館24階展望ロビー（2023年10月に再開・平日9:00〜22:00・無料）
 * 座標: OSM — 風見鶏の館 way 302852228・北野天満神社 way 572305913・相楽園 way 180597618・湊川神社 relation 14742022・神戸市役所1号館 way 182530152・メリケンパーク way 529083594
 *   （Nominatim の中心）／旧神戸居留地十五番館 node 5637731339（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-171-53bf1fa8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "53bf1fa8-d837-4f00-84e2-f69b487fda25";
const DAY_ID = "07af306f-9f92-4f53-9c25-0166d21aa32b";
const KITANO = "4d6a838b-1173-4f7f-b7d4-389dfd85ead4";
const TENMAN = "45623903-ad3a-4794-bc65-83e25403806c";
const MERIKEN = "2f468618-f3b5-448a-bcb4-9f19a228b0b3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "北野の異人館街で風見鶏の館を訪ね、平清盛ゆかりの北野天満神社へ。明治の庭園・相楽園と湊川神社をめぐり、旧居留地の近代建築の町で昼食。午後は市役所の展望ロビーから港を見下ろし、メリケンパークで海風に吹かれる、歩いて楽しむ神戸の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KITANO, { h: 9, m: 30, stay: 90, legs: [], lat: 34.7013855, lng: 135.189511, address: "兵庫県神戸市中央区北野町",
    memo: "この旅は歩いてめぐります。三宮駅から坂道を北へ歩いて約15分。洋館が点在する北野の町で、まず訪ねたいのが「風見鶏の館」です。明治42年（1909年）ごろ、ドイツ人の貿易商トーマスが自分の住まいとして建てた館で、レンガの外壁と、尖塔の上の風見鶏が、北野の異人館のシンボルになっています。国の重要文化財に指定されています。坂や石段の多い町なので、足元に気をつけ、今も人が暮らす家の前では静かに歩きましょう。" }),
  upd(TENMAN, { h: 11, m: 5, stay: 25, legs: [walk(5)], lat: 34.7018889, lng: 135.1895554, address: "兵庫県神戸市中央区北野町3-12-1",
    memo: "風見鶏の館のすぐそば、石段を上った先にある神社です。平安時代の終わりの1180年、平清盛がこの地に都を移そうとしたときに、京都の北野天満宮から菅原道真をまつる神を迎えたのが始まりと伝えられます。約260年前に建てられた本殿や拝殿、石段などは、神戸市の伝統的建造物に指定されています。" + PRAY }),
  cre("相楽園", { h: 11, m: 50, stay: 45, legs: [walk(20)], lat: 34.692654, lng: 135.1817356, address: "兵庫県神戸市中央区中山手通5-3-1",
    memo: "北野天満神社から西へ、歩いて約20分。明治時代の実業家・小寺泰次郎の屋敷の庭で、明治18年ごろから築き始め、明治の終わりに完成しました。重厚な正門や、洋風の旧小寺家厩舎、船屋形、旧ハッサム住宅は、いずれも国の重要文化財です。休園日は公式の案内で確かめましょう。" }),
  cre("湊川神社", { h: 12, m: 45, stay: 25, legs: [walk(10)], lat: 34.6815776, lng: 135.1754938, address: "兵庫県神戸市中央区多聞通3-1-1",
    memo: "相楽園から南へ歩いて約10分。南北朝時代の武将・楠木正成をまつる神社で、明治5年（1872年）に創建されました。境内には正成の墓所があり、江戸時代に徳川光圀が建てた「嗚呼忠臣楠子之墓」の碑が残ります。墓所は亡くなった方をしのぶ場所です。" + PRAY }),
  cre("旧居留地", { h: 13, m: 30, stay: 55, legs: [walk(20)], lat: 34.687069, lng: 135.192307, address: "兵庫県神戸市中央区明石町",
    memo: "湊川神社から東へ歩いて約20分。神戸港が開かれたあと、外国人が住む居留地として整えられた地区で、明治の終わりからは海運や貿易の会社が集まる町になりました。今も残る近代の洋風建築には、店やカフェ、レストランが入っているので、ここで昼食にしましょう。明治13年ごろに建てられた「旧神戸居留地十五番館」は、居留地のころから残るただ一つの建物とされます。" }),
  cre("神戸市役所展望ロビー", { h: 14, m: 35, stay: 30, legs: [walk(10)], lat: 34.6894296, lng: 135.1957488, address: "兵庫県神戸市中央区加納町6-5-1",
    memo: "旧居留地から北東へ歩いて約10分。市役所1号館の24階にある展望ロビーで、だれでも入ることができます。神戸の町並みと港を見渡し、このあと向かうメリケンパークの位置も確かめておきましょう。" }),
  upd(MERIKEN, { h: 15, m: 25, stay: 65, legs: [walk(20)], lat: 34.6833086, lng: 135.1893213, address: "兵庫県神戸市中央区波止場町2",
    memo: "市役所から港へ、歩いて約20分。神戸港の開港120年にあたる昭和62年（1987年）に開かれた、海に面した公園です。2017年には開港150年を記念して「BE KOBE」のモニュメントが置かれました。阪神・淡路大震災から20年をきっかけに生まれた、「神戸の魅力は人である」という思いを込めた言葉です。岸壁では、海に近づきすぎないようにしましょう。帰りは、歩いて約10分の元町駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [KITANO, TENMAN, MERIKEN].join()) throw new Error("構成が想定と違います");
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

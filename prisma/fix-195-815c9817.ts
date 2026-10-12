/**
 * #195 815c9817「高知城とひろめ市場、現存天守とご当地グルメの定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:10 で、帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。説明文の「全国唯一の城」の言い切りも直す
 * 歩きと路面電車の旅（JR高知駅から路面電車で。帰りも路面電車で高知駅へ）:
 *   高知城 9:30 → 高知城歴史博物館 → ひろめ市場（昼食）→ 山内神社 → 潮江天満宮 → 高知県立美術館 16:30 → 高知駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 高知市のほかのしおり（1d0576d3・fa4c2ce4・441b998a）の本文を読み、使っていない話で書いた（高知城は完成と再建の年と本丸の建物群、ひろめ市場は名の由来と7つのブロックを使わず高知の食が集まる場）。
 *   高知城歴史博物館・山内神社・潮江天満宮・高知県立美術館はほかのしおりにない。旧山内家下屋敷長屋は OSM に点がないので、山内神社の本文で紹介した
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   高知県立高知城 kochipark.jp/kochijyo/（本丸の建物群がすべて現存するのは高知城だけ・慶長6年着工、慶長16年完成・享保12年の大火、宝暦3年までに再建・入館は16:30まで）／
 *   高知城歴史博物館 kochi-johaku.jp（土佐の歴史と文化の拠点・3階から高知城を望む・土佐藩と山内家の260年・ミュージアムショップとカフェ）／ひろめ市場 hirome.co.jp（高知の「食」が集う場所）／
 *   高知市 city.kochi.kochi.jp/site/kanko/yamautijinjya.html（山内神社: 山内家歴代藩主と一豊夫人見性院・大政奉還を慶ぶ山内容堂公の銅像・旧山内家下屋敷長屋は国の重要文化財）／
 *   高知県観光 kochi-tabi.jp/search_spot.html?id=2951（旧山内家下屋敷長屋: 幕末に家臣7人の屋敷地を召し上げて山内容堂の下屋敷・昭和54年に国の重要文化財・本格的な武家長屋は全国的に少ない）・
 *   ?id=887（潮江天満宮: 菅原道真とともに土佐へ流された長男の高視が開いた・道真の念持仏の観音像・楼門は市の文化財）／高知県立美術館 moak.jp（マルク・シャガール・コレクション・石元泰博フォトセンター・
 *   約440人の作家の41,000点以上・年末年始以外は開館、入館は16:30まで）
 * 座標: OSM — 高知城 way 126495756（historic=castle）・高知城歴史博物館 way 500621920・ひろめ市場 way 1146148201（marketplace）・山内神社社殿 way 552076234・潮江天満宮 way 500635725・
 *   高知県立美術館 way 695573884（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-195-815c9817.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "815c9817-f49e-4bb6-8b8b-ba7d5c6e4b6f";
const DAY1_ID = "eadf2b1f-ac46-4782-a313-67e41a33c034";
const CASTLE = "358265d5-dec1-4d2b-bf3f-9971cd6690fe";
const HIROME = "5c3f99b5-4a7d-43cf-9483-373363c3372d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const tram = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "本丸の建物がすべて残るとされる高知城を歩き、高知城歴史博物館で土佐藩と山内家の歴史にふれてから、ひろめ市場で土佐の味の昼食。午後は鏡川のほとりの山内神社と潮江天満宮にお参りし、路面電車で高知県立美術館へ。歩きと路面電車で楽しむ、高知の定番の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(CASTLE, { h: 9, m: 30, stay: 90, legs: [], lat: 33.560691, lng: 133.5314588, address: "高知県高知市丸ノ内1-2-1",
    memo: "この旅は歩きと路面電車でめぐります。JR高知駅から路面電車に乗り、高知城前の電停から歩いてすぐ。慶長6年（1601年）に築き始め、慶長16年（1611年）に完成した城で、享保12年（1727年）の大火で多くを失ったのち、宝暦3年（1753年）までに元の姿で建て直されました。江戸時代に建てられた天守や本丸御殿をはじめ、本丸の建物がすべて残るのは高知城だけとされます。天守の中の階段は急なので、手すりを持ってゆっくり上り下りしましょう。入場の時間は公式の案内で確かめましょう。" }),
  cre("高知城歴史博物館", { h: 11, m: 5, stay: 45, legs: [walk(5)], lat: 33.5601674, lng: 133.5340651, address: "高知県高知市追手筋2-7-5",
    memo: "高知城から追手門を出て歩いて約5分。城のふもとに建つ、土佐の歴史と文化を伝える博物館で、土佐藩と、260年にわたってこの地を治めた山内家にまつわる資料を紹介しています。3階からは、さきほど歩いた高知城を正面に眺められます。" }),
  upd(HIROME, { h: 11, m: 55, stay: 50, legs: [walk(3)], lat: 33.560448, lng: 133.5356877, address: "高知県高知市帯屋町2-3-1",
    memo: "博物館から歩いて約3分。高知の「食」が集まる屋内の市場で、カツオのたたきをはじめ、土佐の味の店が並びます。ここで昼食にしましょう。昼どきは混み合うので、席をゆずり合って使いましょう。" }, "ひろめ市場（昼食）"),
  cre("山内神社", { h: 13, m: 0, stay: 40, legs: [walk(12)], lat: 33.5555413, lng: 133.531872, address: "高知県高知市鷹匠町2-4-65",
    memo: "ひろめ市場から南へ歩いて約12分、鏡川のほとりへ。土佐藩の歴代の藩主と、初代・山内一豊の妻の見性院をまつる神社で、境内には、大政奉還を喜んだ15代藩主・山内容堂の銅像があります。となりの旧山内家下屋敷長屋は、幕末に家臣7人の屋敷地を召し上げて設けた容堂の下屋敷に建つ長屋で、本格的な武家の長屋は全国でも少ないとされ、国の重要文化財です。" + PRAY }),
  cre("潮江天満宮", { h: 13, m: 50, stay: 30, legs: [walk(10)], lat: 33.5534562, lng: 133.5349756, address: "高知県高知市天神町19-20",
    memo: "山内神社から鏡川を渡って歩いて約10分。菅原道真とともに土佐へ移された長男の高視が、道真の持っていた観音像などをまつって開いたと伝わる神社です。楼門は高知市の文化財です。" + PRAY }),
  cre("高知県立美術館", { h: 15, m: 0, stay: 90, legs: [walk(20), tram(15, "とさでん交通（はりまや橋→県立美術館通）"), walk(5)], lat: 33.5610886, lng: 133.573345, address: "高知県高知市高須",
    memo: "潮江天満宮からはりまや橋の電停へ歩いて約20分、路面電車で約15分の県立美術館通へ、歩いて約5分（あわせて約40分）。約440人の作家の41,000点をこえる作品を収める美術館で、マルク・シャガールのコレクションや、高知ゆかりの写真家・石元泰博の作品を紹介する「石元泰博フォトセンター」があります。入館の時間は公式の案内で確かめましょう。帰りは、県立美術館通から路面電車ではりまや橋へ戻り、高知駅へ向かいましょう。" }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, HIROME].join()) throw new Error("構成が想定と違います");
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

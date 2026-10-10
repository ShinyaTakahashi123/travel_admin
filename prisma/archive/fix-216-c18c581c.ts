/**
 * #216 c18c581c「表町商店街と岡山県立美術館、岡山の街なかアートさんぽ」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:10 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみいただけたことでしょう」）。
 * 歩きと路線バス（JR岡山駅から）:
 *   岡山県立美術館 9:00 → 岡山県天神山文化プラザ → 岡山市立オリエント美術館 → 岡山禁酒會館 → 表町商店街（昼食）→ 岡山県庁舎 → 林原美術館 → 夢二郷土美術館 →（バス）岡山シティミュージアム 16:05〜16:45
 *   #73・#104（岡山城・後楽園・博物館）と重ならないよう、美術館と近代の建築をめぐる街なかの散歩にした
 * 本文の出典: 岡山観光WEB【公式】https://www.okayama-kanko.jp/spot/<番号> —
 *   県立美術館 10007（郷土にゆかりある美術品・展覧会やワークショップ・岡田新一の設計・量塊の集合・トップライト・9:00〜17:00 入館16:30）／
 *   オリエント美術館 detail_10009（古代イラクの神殿を思わせる外観・メソポタミアからイスラム時代・約5,000点・古代オリエント専門の公立の美術館とされる・3つの吹き抜け・自然光・9:00〜17:00）／
 *   天神山文化プラザ 10214（展示室・練習室・前川國男の建築・黄色のピロティ・「成層圏ブルー」の天井）／
 *   岡山禁酒會館 10033（空襲で焼けなかった数少ない建物・木造3階建・国の登録有形文化財）／表町 おか旅 https://www.okayama-kanko.jp/okatabi/1122/page （1600年ごろの商人町が始まり・アーケード）／
 *   岡山県庁舎 14801（前川國男・カーテンウォール・中庭のオブジェ『環』）／林原美術館 detail_10115（昭和39年開館・池田家の大名道具と林原一郎のコレクション・二の丸対面所跡・長屋門・10:00〜17:00）／
 *   夢二郷土美術館 10143（竹久夢二・「立田姫」・年4回の企画展・水戸岡鋭治の監修・9:00〜17:00）／岡山シティミュージアム detail_10031（岡山市の歴史と今・岡山駅から徒歩2分・10:00〜18:00）
 * 座標: OSM — 県立美術館 node 1423611098／天神山文化プラザ way 427976785（Nominatim の中心）／オリエント美術館 node 1423610534／岡山禁酒會館 way 755624532（同）／
 *   表町商店街 way 127452953（同）／岡山県庁 node 6280024331／林原美術館 way 756070005（同）／岡山シティミュージアム node 1423610324（node は API で名前つきを確かめた）
 *   夢二郷土美術館は OSM に点がないので、国土地理院の住所検索（中区浜二丁目1番32号）34.670658,133.93457
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-216-c18c581c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c18c581c-05ca-4e37-989c-dd0c74b60827";
const DAY_ID = "cf6129af-1007-4825-af8f-913c9dcee190";
const KENBI = "ea75e7ff-55c6-45e6-83f9-748b409e5dea";
const OMOTE = "ecd32cb9-ceac-4b37-8234-2227c469edaa";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "岡山県立美術館とオリエント美術館から、前川國男が手がけた天神山文化プラザや岡山県庁舎、空襲を免れた岡山禁酒會館まで、街なかの美術館と建築を歩いてめぐります。表町商店街で昼食をとり、林原美術館と夢二郷土美術館を訪ね、岡山駅のそばのシティミュージアムで締めくくる日帰りプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(KENBI, { h: 9, m: 0, stay: 70, mode: null, min: null, lat: 34.6676691, lng: 133.9298108, address: "岡山県岡山市北区天神町8-48",
    memo: "この旅は歩きと路線バスでめぐります。JR岡山駅から路面電車で城下へ行き、歩いて約5分。郷土にゆかりのある優れた美術品を集めて展示し、国内外の芸術を紹介する展覧会やワークショップも開く美術館です。建物は建築家・岡田新一の設計で、量感のある箱を組み合わせたような造りが特徴で、2階の展示室へ向かう階段からは、屋内の広場を照らす天窓の柔らかな光が見られます。休館日は公式の案内で確かめましょう。" }),
  cre("岡山県天神山文化プラザ", { h: 10, m: 15, stay: 20, mode: "walk", min: 5, lat: 34.6683519, lng: 133.9296294, address: "岡山県岡山市北区天神町8-54",
    memo: "県立美術館から歩いてすぐ。県民の文化活動を支える施設で、大小の展示室では、さまざまな展覧会が開かれています。建物は近代建築の巨匠・前川國男の設計で、黄色に彩られた1階のピロティや、「成層圏ブルー」と呼ばれる深い青の天井に、星のように散らばる照明などを見られます。" }),
  cre("岡山市立オリエント美術館", { h: 10, m: 40, stay: 50, mode: "walk", min: 5, lat: 34.6663706, lng: 133.9301513, address: "岡山県岡山市北区天神町9-31",
    memo: "文化プラザから歩いて約5分。古代イラクの神殿を思わせる外観の建物で、メソポタミア文明からイスラム時代までのオリエントの文化を紹介する美術館です。5万年前の石器から19世紀までの、イラン・イラク・シリアなどの出土品や美術品を約5,000点収蔵しています。県立美術館と同じ岡田新一の設計で、箱を積み上げたような建物の内側に3つの吹き抜けがあり、天窓から自然の光が差し込みます。" }),
  cre("岡山禁酒會館", { h: 11, m: 35, stay: 15, mode: "walk", min: 5, lat: 34.6651001, lng: 133.930666, address: "岡山県岡山市北区丸の内1-1-15",
    memo: "オリエント美術館から歩いて約5分。昭和20年の空襲で焼けずに残った数少ない建物のひとつで、外観や構造は建てられた当時の姿をほぼとどめています。木造3階建てで、ドイツ壁風の壁と白いタイルを組み合わせた正面のデザインが、街なかの歴史的な景観をつくっています。" }),
  upd(OMOTE, { h: 12, m: 0, stay: 60, mode: "walk", min: 10, lat: 34.6609248, lng: 133.9292147, address: "岡山県岡山市北区表町",
    memo: "禁酒會館から歩いて約10分。1600年ごろの商人町が始まりといわれる商店街で、アーケードがあるので、天気を気にせず歩けます。飲食店も多いので、ここで昼食にしましょう。" }),
  cre("岡山県庁舎", { h: 13, m: 15, stay: 15, mode: "walk", min: 15, lat: 34.661752, lng: 133.934919, address: "岡山県岡山市北区内山下2-4-6",
    memo: "表町から歩いて約15分。前川國男の設計で、北側の道路から中庭へ導く開かれたアプローチや、本館と議会棟を回廊で結ぶ造りは、親しみやすい庁舎の先がけになったといわれます。本館の上の階を覆うガラスと鋼のパネルの外壁や、中庭のオブジェ『環』も見どころです。今も使われている庁舎なので、外からの見学にしましょう。" }),
  cre("林原美術館", { h: 13, m: 35, stay: 45, mode: "walk", min: 5, lat: 34.6636065, lng: 133.9333856, address: "岡山県岡山市北区丸の内2-7-15",
    memo: "県庁舎から歩いて約5分。昭和39年に開館した美術館で、旧岡山藩主・池田家に伝わった大名道具と、林原一郎が集めた刀剣や陶磁器などを収蔵しています。岡山城の二の丸の対面所の跡にあり、大きな長屋門が正門です。展示はテーマごとに入れ替わるので、内容は公式の案内で確かめましょう。" }),
  cre("夢二郷土美術館", { h: 14, m: 45, stay: 50, mode: "walk", min: 25, lat: 34.670658, lng: 133.93457, address: "岡山県岡山市中区浜2-1-32",
    memo: "林原美術館から旭川を渡って歩いて約25分。岡山出身で、大正浪漫を代表する詩人画家・竹久夢二の美術館です。代表作「立田姫」などの肉筆の作品を収蔵し、年に4回の企画展で入れ替えながら展示しています。館内には、夢二の世界を感じながらひと休みできるカフェもあります。" }),
  cre("岡山シティミュージアム", { h: 16, m: 5, stay: 40, mode: "bus", min: 30, line: "路線バス（岡山駅方面）", lat: 34.66631, lng: 133.9158203, address: "岡山県岡山市北区駅元町15-1",
    memo: "夢二郷土美術館の近くのバス停から路線バスで岡山駅へ行き、歩いて約2分（あわせて約30分）。岡山市の歴史と今を記録して伝える博物館で、企画展も開かれています。展示は時期によって変わるので、公式の案内で確かめましょう。帰りは、すぐそばのJR岡山駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [KENBI, OMOTE].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${nm} ${String(d.memo).length}字`);
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

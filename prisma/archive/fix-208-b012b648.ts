/**
 * #208 b012b648「東平安名崎と砂山ビーチ、宮古島の絶景岬とビーチプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:20 で、昼食・帰りの一言がなく、本文は案内の話し方（「やってきました」「〜してくださいね」）。確かめられない数字（灯台の高さ・階段の数・設置年）が多かった
 * 車の旅（宮古空港でレンタカーを借りて返す）: イムギャーマリンガーデン 9:00 → 東平安名崎 → 新城海岸 → 島の駅みやこ（昼食）→ 宮古島市総合博物館 → パイナガマビーチ → 砂山ビーチ 16:55 → 宮古空港
 *   #378（dc8d9ae8、宮古島の橋めぐり）と重ならないよう、橋・伊良部島・池間島・来間島は入れない（砂山ビーチは両方にあるが、文は別に書く）
 *   海水浴は春から秋が中心なので、季節は春・夏・秋
 * 本文の出典（宮古島観光協会 https://miyako-guide.net/spots/ ）: イムギャーマリンガーデン spots-791 ／東平安名崎 spots-866 （約2km・日本都市公園百景・太平洋と東シナ海・天ノ梅やテッポウユリ）／
 *   新城海岸 spots-781 ／島の駅みやこ spots-521 （特産品・漁協の直営店・宮古そばの店・平良字久貝870-1）／パイナガマビーチ spots-810 （市内中心・夏はハブクラゲ防止ネット・沖は航路）／
 *   砂山ビーチ spots-804 （小さな砂山・隆起珊瑚礁の洞穴・西よりの風で波・沖の深み）／総合博物館 https://miyako-island.net/beach_and_spot/beach_spot_037/ （宮古島観光協会、自然と歴史風土の資料・ビデオや人形・ジオラマ）
 * 開く時間（本文には書かない）: 総合博物館 9:00〜16:30（入館16時まで）月曜・祝日休
 * 座標の出典: OSM（Nominatim）— イムギャーマリンガーデン way 1156534078／平安名埼灯台 node 6382122746／新城海岸 way 1005883626／宮古島市総合博物館 node 1068035371／
 *   パイナガマビーチ way 1007334745／砂山ビーチ way 496244201。島の駅みやこは OSM に点がないので、国土地理院の住所検索（平良久貝870番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-208-b012b648.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b012b648-e622-47c7-b873-11bd4b1d200e";
const DAY_ID = "e44cd0e0-8580-4d24-bd13-95e491eaaee0";
const HENNA = "bc443495-62a8-4d7d-a157-35455f4ef58d";
const SUNA = "b8b03aae-4f0f-441e-aabc-3b3927957183";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const SEA = "海に入るときは天気や潮の様子を確かめ、無理をしないようにしましょう。";

const DESCRIPTION =
  "宮古空港でレンタカーを借りて、島の東と南の海辺をめぐる日帰りプランです。入り江のイムギャーマリンガーデンから、太平洋と東シナ海を見渡す東平安名崎、サンゴの海の新城海岸へ。島の駅みやこで昼食をとり、総合博物館で島の歴史と自然にふれたら、市街地のパイナガマビーチと、砂山を越えて広がる砂山ビーチで締めくくります。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  cre("イムギャーマリンガーデン", { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 24.7236804, lng: 125.3572855, address: "沖縄県宮古島市城辺友利605-2",
    memo: "この旅は車でめぐります。宮古空港でレンタカーを借りて、車で約25分。天然の入り江を生かした、箱庭のように波の穏やかな海辺です。陸の上には散策のコースがあり、いちばん上の休憩所からは入り江と海を見渡せます。泳いでいると、真水と海水が混ざり合って水がゆらいで見えることがあります。入り江の外は時間によって潮の流れがあるので、気をつけましょう。" }),
  upd(HENNA, { h: 10, m: 0, stay: 60, mode: "car", min: 20, lat: 24.719523, lng: 125.468515, address: "沖縄県宮古島市城辺保良",
    memo: "イムギャーから車で約20分、島の最も東の岬へ。約2kmにわたって海に細長く突き出す岬で、太平洋と東シナ海を一度に見渡せる景色は、日本都市公園百景にも選ばれています。断崖に荒波が打ち寄せる力強い眺めのそばで、遊歩道のまわりには県の天然記念物の天ノ梅や、テッポウユリなど、季節ごとの花が咲きます。先端には平安名埼灯台が立っています。断崖のそばでは足元に気をつけましょう。" }),
  cre("新城海岸", { h: 11, m: 20, stay: 40, mode: "car", min: 20, lat: 24.761322, lng: 125.4222851, address: "沖縄県宮古島市城辺新城",
    memo: "東平安名崎から車で約20分、東の海岸を北へ。元気なサンゴとカラフルな熱帯魚に出会える人気の浜で、県道から浜までの道も比較的たどりやすい海岸です。駐車場はあまり広くないので、ゆずり合って使いましょう。" + SEA }),
  cre("島の駅みやこ", { h: 12, m: 40, stay: 60, mode: "car", min: 40, lat: 24.795536, lng: 125.274452, address: "沖縄県宮古島市平良字久貝870-1",
    memo: "新城海岸から車で約40分、平良の市街地へ。宮古島の新鮮な食材や特産品がそろう施設で、漁協の直営の店や宮古そばの店、島のスイーツの店も入っています。ここで昼食にしましょう。" }),
  cre("宮古島市総合博物館", { h: 13, m: 55, stay: 50, mode: "car", min: 15, lat: 24.796933, lng: 125.317688, address: "沖縄県宮古島市平良字東仲宗根添1166-287",
    memo: "島の駅から車で約15分。宮古島の自然と歴史、風土についての資料を集めた博物館で、動植物の資料や、祭りや伝統芸能など島の独特の風習と歴史を、映像や人形、ジオラマで分かりやすく紹介しています。休館日は公式の案内で確かめましょう。" }),
  cre("パイナガマビーチ", { h: 15, m: 0, stay: 40, mode: "car", min: 15, lat: 24.8029275, lng: 125.2717472, address: "沖縄県宮古島市平良",
    memo: "博物館から車で約15分。市内の中心にあり、市民の憩いの場として親しまれている浜です。夏はハブクラゲを防ぐネットが張られますが、ネットの外ではハブクラゲがよく見つかるので、ネットの中で遊びましょう。沖は船の通り道なので、遠くへは行かないようにしましょう。" }),
  upd(SUNA, { h: 15, m: 55, stay: 60, mode: "car", min: 15, lat: 24.8393898, lng: 125.2805611, address: "沖縄県宮古島市平良荷川取",
    memo: "パイナガマビーチから車で約15分。名前のとおり、小さな砂山を登った先に、白い砂浜と青い海が広がる浜です。隆起した珊瑚礁でできた洞穴が浜のシンボルですが、落石のおそれがあるため、近づかずに離れたところから眺めましょう。西よりの風が吹くと波が立ち、沖には急に深くなるところもあるので、沖へは出ないようにしましょう。帰りの砂山の上り坂は足がとられやすいので、歩きやすい靴で出かけましょう。このあとは、車で約20分の宮古空港でレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [HENNA, SUNA].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (x.id === HENNA ? "東平安名崎(既存)" : "砂山ビーチ(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
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

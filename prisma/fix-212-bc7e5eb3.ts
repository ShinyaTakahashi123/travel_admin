/**
 * #212 bc7e5eb3「彫刻の森美術館と芦ノ湖クルーズ、箱根の芸術と絶景を楽しむ日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 4か所 09:30〜14:20 で、昼食の行と帰りの一言がなく、本文は長い案内の話し方（「楽しんでください」）。言い切り（日本で最初の野外美術館）、
 *   体によいという言い伝え（黒たまごで寿命がのびる）、ご利益（運気・恋愛運）があった。大涌谷・桃源台・箱根神社の座標は度分秒から直した値だった
 * 箱根フリーパスなどで、登山電車・ケーブルカー・ロープウェイ・海賊船・歩きでめぐる（箱根湯本から）:
 *   彫刻の森美術館 9:00 → 箱根強羅公園 → 大涌谷（昼食）→ 箱根ビジターセンター → 箱根海賊船（桃源台港→箱根町港）→ 箱根関所 → 箱根神社 16:40 → 元箱根からバスで箱根湯本
 *   #4・#24（箱根）と行き先が重なるので、文は別に書いた
 * 本文の出典: 彫刻の森美術館 https://www.hakone-oam.or.jp/about/ （1969年開館・鹿内信隆の目的・井上武吉の設計・所蔵2,000点あまり）・https://www.hakone-oam.or.jp/ （ガブリエル・ロアールの高さ18mのステンドグラスの塔）／
 *   箱根ナビ（小田急箱根グループ公式）https://www.hakonenavi.jp/spot/1130 （強羅公園: 大正3年開園・日本最古のフランス式整型庭園・四季の花・クラフトハウスで陶芸や吹きガラス・9:00〜17:00）／
 *   /spot/1362 （大涌谷: 約3000年前の神山の水蒸気爆発の爆裂火口・噴気・黒たまご）／/spot/1354 （箱根ビジターセンター: 湖尻園地内・模型やパネル・標本で動植物の生態・自然観察会・9:00〜17:00 入館16:30・第2第4月曜休）／
 *   /hakone-kankosen/ （海賊船: 桃源台港から箱根町港・元箱根港を約25〜40分・船内の3Dアートや海賊のオブジェ）／/spot/1230 （箱根神社: 757年に万巻上人・坂上田村麻呂・関東総鎮守）／
 *   箱根関所 https://www.hakonesekisyo.jp/ （江戸時代交通史の重要な遺跡・当時の匠の技や道具で復元・約150年ぶり・9:00〜17:00、12〜2月は16:30まで、入場は閉館の30分前まで）
 * 座標: OSM — 彫刻の森美術館 node 5182750902／箱根強羅公園 way 281489340（Nominatim の中心）／大涌谷 way 727045804（同）／箱根ビジターセンター node 8832692379／
 *   桃源台港 way 1221627057（同）／箱根関所 way 772690985（同）／箱根神社 way 553740875（同）（node は OSM の API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-212-bc7e5eb3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "bc7e5eb3-b38a-4372-a07b-e6fa8fcb0577";
const DAY_ID = "4b5b3174-ad73-4c74-978a-f7fbc6ae5e35";
const CHOKOKU = "96ddad3b-a2ff-4164-abb4-62dd6eaa2678";
const OWAKU = "418a9b2a-f599-48f6-825b-6557114a01e4";
const KAIZOKU = "c71f53e9-4120-452f-9c6f-9759d4ffa4e4";
const JINJA = "55e46d81-6012-4f1e-ae30-34a32649f221";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "箱根湯本から登山電車で彫刻の森美術館へ。強羅公園の庭を歩き、ケーブルカーとロープウェイで大涌谷へ上って昼食をとったら、海賊船で芦ノ湖を渡り、箱根関所と箱根神社をめぐります。乗り物を乗り継いで、箱根のアートと火山、湖を一日で楽しむプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(CHOKOKU, { h: 9, m: 0, stay: 90, mode: null, min: null, lat: 35.2442838, lng: 139.0520834, address: "神奈川県足柄下郡箱根町二ノ平1121",
    memo: "この旅は、登山電車やケーブルカー、ロープウェイ、船と歩きでめぐります。箱根湯本駅から箱根登山電車で約40分の彫刻の森駅へ行き、歩いてすぐ。1969年に開館した美術館で、創設者は、彫刻のための美術館が日本にはまだなかったことから、彫刻の発展に役立てたいと考えたといわれます。彫刻家の井上武吉が設計した、丘や小川、池のある敷地に、近代と現代の彫刻が自然と溶け込むように並び、所蔵する作品は2,000点あまりにのぼります。フランスのステンドグラス作家、ガブリエル・ロアールによる高さ18mの塔の作品も見どころです。" }),
  cre("箱根強羅公園", { h: 10, m: 45, stay: 35, mode: "train", min: 15, line: "箱根登山電車", lat: 35.2486387, lng: 139.045249, address: "神奈川県足柄下郡箱根町強羅1300",
    memo: "彫刻の森駅から登山電車で1駅の強羅駅へ行き、歩いて約5分（あわせて約15分）。大正3年（1914年）に開園した、日本で最も古いフランス式の整形庭園とされる公園で、桜やつつじ、しゃくなげ、あじさい、バラなど、季節ごとの花が咲きます。園内のクラフトハウスでは、陶芸や吹きガラスの体験もできます。" }),
  upd(OWAKU, { h: 11, m: 55, stay: 60, mode: "other", min: 35, lat: 35.2474057, lng: 139.0242051, address: "神奈川県足柄下郡箱根町仙石原1251-1",
    memo: "強羅公園の上の公園上駅からケーブルカーで早雲山駅へ行き、ロープウェイに乗り換えて大涌谷へ（乗り換えを含めて約35分）。約3000年前、箱根の最高峰・神山が起こした水蒸気爆発でできた火口の跡で、今も噴気が立ちのぼる、箱根を代表する眺めの場所です。温泉の池でゆでた名物の黒たまごもあります。食事の店もあるので、ここで昼食にしましょう。火山活動や火山ガスの状況によって、立ち入りが規制されたり、ロープウェイが運休したりすることがあるので、出かける前に最新の情報を確かめましょう。" }),
  cre("箱根ビジターセンター", { h: 13, m: 25, stay: 30, mode: "other", min: 30, lat: 35.2410257, lng: 138.9960127, address: "神奈川県足柄下郡箱根町元箱根164",
    memo: "大涌谷からロープウェイで終点の桃源台駅へ行き、歩いて約10分（あわせて約30分）。芦ノ湖の北の湖尻園地にある学習施設で、模型やパネル、標本などで、箱根の動植物の暮らしを学べます。休館日は公式の案内で確かめましょう。" }),
  upd(KAIZOKU, { h: 14, m: 5, stay: 30, mode: "walk", min: 10, lat: 35.2375565, lng: 138.9945727, address: "神奈川県足柄下郡箱根町元箱根",
    memo: "ビジターセンターから歩いて約10分の桃源台港から、箱根海賊船で芦ノ湖を南へ渡り、箱根町港まで約25分。海賊船は、桃源台港と箱根町港・元箱根港を約25〜40分で結ぶ船で、船の中には3Dアートや海賊のオブジェもあります。晴れた日は、デッキから湖を囲む山々を眺めましょう。運航の時刻は公式の案内で確かめましょう。" }),
  cre("箱根関所", { h: 14, m: 45, stay: 45, mode: "walk", min: 10, lat: 35.1922057, lng: 139.0263526, address: "神奈川県足柄下郡箱根町箱根1",
    memo: "箱根町港から歩いて約10分。江戸時代の交通の歴史を伝える大切な遺跡で、当時の職人の技や道具を使って、約150年ぶりに芦ノ湖のほとりによみがえりました。建物の中を見学しながら、江戸時代の旅のきびしさにふれましょう。入場は閉館の30分前までなので、時刻を公式の案内で確かめましょう。" }),
  upd(JINJA, { h: 16, m: 0, stay: 40, mode: "walk", min: 30, lat: 35.2039731, lng: 139.0255832, address: "神奈川県足柄下郡箱根町元箱根80-1",
    memo: "関所から旧街道の杉並木を通って、湖のほとりを歩いて約30分。奈良時代の天平宝字元年（757年）に、万巻上人が神のお告げを受けて祀ったのが始まりと伝えられる神社です。東国へ向かう坂上田村麻呂がお参りして願いがかなったことから、武将たちの信仰を集め、中世からは関東の総鎮守として、歴代の幕府に大切にされてきました。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。帰りは、元箱根のバス停から箱根登山バスで箱根湯本駅へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [CHOKOKU, OWAKU, KAIZOKU, JINJA].join()) throw new Error("構成が想定と違います");
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

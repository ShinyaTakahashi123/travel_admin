/**
 * #215 c10810bd「桧木内川堤の桜並木、絶景フォトスポットを楽しむ角館プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お楽しみください」）。
 *   桧木内川堤の点が約14km北（39.731943,140.574247）にずれていた
 * 歩きの旅（JR角館駅から）: 桧木内川堤 9:00 → 武家屋敷通り（内町）→ 石黒家 → 角館歴史村・青柳家（昼食）→ 平福記念美術館 → 角館樺細工伝承館
 *   →（田町の武家屋敷通りを歩いて）新潮社記念文学館 16:30 → 角館駅
 *   #83（角館）・#194（角館1泊2日）と行き先が重なるので、文は別に書いた。古城山（角館城址）は熊の出没で通行止めのため入れない
 * 本文の出典: 桧木内川堤 全国京都会議（小京都）https://shokyoto.jp/ml/ja/sub/akita_kakunodate （左岸の堤防2km・ソメイヨシノ400本余・昭和8年の救農土木事業で完成した堤防・
 *   現上皇陛下の御誕生を記念して昭和9年に植えた・昭和50年 国の名勝・平成2年 桜名所百選・樺細工伝承館 昭和53年開館）／
 *   田沢湖・角館観光協会 https://tazawako-kakunodate.com/spots/<番号>/ — 内町 5997（元和6年 芦名氏の町づくり・佐竹北家の城下町・重要伝統的建造物群保存地区・シダレザクラとモミの大木）／
 *   石黒家 5991（直系の子孫が住み続ける唯一の武家屋敷・公開は屋敷の半分ほど・部屋に上がって見学・母屋は角館に残る中で最古といわれる・9:00〜17:00、12〜3月は16:00まで）／
 *   青柳家 5990（3000坪・武器庫や解体新書記念館など6つの資料館・カフェやレストラン）／平福記念美術館 6184（平福穂庵・百穂父子・佐竹北家家臣の屋敷跡）／
 *   角館樺細工伝承館 6181（制作の実演・工芸と歴史の資料）／田町武家屋敷通り 5998（1620年の町づくり・黒板塀・西宮家）／新潮社記念文学館 6183（佐藤義亮・新潮社・近代文学）／
 *   古城山 14757（熊出没により当面通行止め）
 * 座標: OSM — 桧木内川堤公園 way 755931873（Nominatim の中心）／武家屋敷通り node 5670412921「Samurai District」／石黒家 node 2598170890／青柳家 node 2598170891／
 *   平福記念美術館 way 253970113（同）／角館樺細工伝承館 relation 14721803（同）／新潮社記念文学館 way 253970106（同）（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-215-c10810bd.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c10810bd-7737-4403-a98b-d1e852c8d138";
const DAY_ID = "a38df1a2-c02e-4010-9187-ed0c0549f8d2";
const TSUTSUMI = "1d090ec7-d947-4fed-ab6d-71ce0d8515ad";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const HOMES = "今も人が暮らす家が並ぶ通りです。家の敷地に入ったり、住む人を撮ったりしないようにしましょう。";

const DESCRIPTION =
  "桜の季節の角館を歩いてめぐる日帰りプランです。朝は桧木内川堤の約2kmの桜並木を歩き、シダレザクラの武家屋敷通りへ。石黒家や青柳家で武家の暮らしにふれ、平福記念美術館と樺細工伝承館をめぐったら、田町の武家屋敷通りを通って新潮社記念文学館で締めくくります。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(TSUTSUMI, { h: 9, m: 0, stay: 60, mode: null, min: null, lat: 39.5996543, lng: 140.5586314, address: "秋田県仙北市角館町",
    memo: "この旅は歩いてめぐります。JR角館駅から歩いて約20分。町の西を流れる桧木内川の左岸に、約2kmにわたってソメイヨシノの並木が続きます。昭和8年に救農の土木事業で完成した堤防に、現在の上皇陛下の御誕生を記念して、翌年の春に400本あまりが植えられたもので、国の名勝に指定され、武家屋敷通りの桜とともに桜の名所百選にも選ばれています。見頃は例年4月下旬で、年によって変わるので、開花の情報を確かめて出かけましょう。" }),
  cre("武家屋敷通り（内町）", { h: 10, m: 10, stay: 50, mode: "walk", min: 10, lat: 39.5978313, lng: 140.5621565, address: "秋田県仙北市角館町",
    memo: "堤から歩いて約10分。江戸時代のはじめ、元和6年（1620年）に芦名氏が町づくりをし、その後は佐竹北家の城下町として栄えた角館の、武士の暮らした地区です。江戸時代の終わりごろの屋敷割りや、母屋・門・蔵の構えがよく残り、国の重要伝統的建造物群保存地区に選ばれています。塀の続く広い通りに、シダレザクラやモミの大木が深い木立をつくります。" + HOMES }),
  cre("石黒家", { h: 11, m: 5, stay: 40, mode: "walk", min: 5, lat: 39.6011819, lng: 140.5617229, address: "秋田県仙北市角館町表町下丁1",
    memo: "通りを北へ歩いて約5分。角館の武家屋敷の中で唯一、直系の子孫の家族が今も母屋に住み続けている屋敷で、母屋は角館に残る中で最も古いといわれます。住まいとして使われているため公開は屋敷の半分ほどですが、部屋に上がって武家屋敷の中を見学でき、屋敷の特徴について説明を聞くこともできます。高い敷居があるので、足元に気をつけましょう。" }),
  cre("角館歴史村・青柳家", { h: 11, m: 50, stay: 80, mode: "walk", min: 5, lat: 39.60051, lng: 140.5617441, address: "秋田県仙北市角館町表町下丁3",
    memo: "石黒家から歩いて約5分。草花のあふれる約3000坪の敷地に、母屋のほか、武器庫や解体新書記念館など6つの資料館が並ぶ武家屋敷です。敷地の中にはカフェやレストランもあるので、ここで昼食にしましょう。" }),
  cre("平福記念美術館", { h: 13, m: 15, stay: 50, mode: "walk", min: 5, lat: 39.6019412, lng: 140.5600672, address: "秋田県仙北市角館町表町上丁4-4",
    memo: "青柳家から歩いて約5分。近代日本画の平福穂庵・百穂の父子をはじめ、郷土の画家たちの作品を展示する美術館です。敷地は藩政時代の佐竹北家の家臣の屋敷跡で、前庭の太い木々は武家屋敷のころのものが残り、建物と武家屋敷の町並みとの調和も見どころです。休館日は公式の案内で確かめましょう。" }),
  cre("角館樺細工伝承館", { h: 14, m: 15, stay: 60, mode: "walk", min: 10, lat: 39.5995317, lng: 140.5611586, address: "秋田県仙北市角館町表町下丁10-1",
    memo: "美術館から歩いて約10分。樺細工が国の伝統的工芸品に指定されたことをきっかけに、その振興のため昭和53年に開館した施設です。館内では職人による制作の実演が行われ、細かな技を間近に見られるほか、町の工芸や文化、歴史の資料も展示されています。" }),
  cre("新潮社記念文学館", { h: 15, m: 35, stay: 55, mode: "walk", min: 20, lat: 39.5928911, lng: 140.5655624, address: "秋田県仙北市角館町田町上丁23",
    memo: "伝承館から、町の南の田町の武家屋敷通りを通って、歩いて約20分。田町は内町とは別に武士が住んだ地区で、黒板塀の続く道や、蔵の並ぶ西宮家などを眺めながら歩けます。文学館は、角館出身の佐藤義亮と、彼が創設した出版社・新潮社の業績にちなむ施設で、新潮社のあゆみをたどりながら、明治以降の日本の近代文学にふれられます。帰りは、歩いて約15分の角館駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== TSUTSUMI) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? "桧木内川堤(既存)" : d.name} ${String(d.memo).length}字`);
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

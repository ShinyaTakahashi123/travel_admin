/**
 * チェックリスト #400 fdf00843「大洗港のしらす漁と海鮮グルメ、地元の味を楽しむ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 大洗磯前神社 → 神磯の鳥居 → 幕末と明治の博物館 → 大洗漁港（昼食）→ 大洗マリンタワー → 大洗サンビーチ → アクアワールド茨城県大洗水族館 → 大洗海岸（大洗公園）（8か所 09:00〜16:50）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述（サメ約60種で日本一など）もあったので書き直す）
 * 大洗海岸の座標（36.31333,140.57486）は国土地理院の「大洗町」の代表点だったので、OSMの大洗公園に直す
 * 写真: 大洗海岸に付いていた写真（20100216_acaworld01.jpg）は水族館の水槽の写真で、表紙にも使われていたので外す。
 *   代わりに、新しく入れる「神磯の鳥居」に https://commons.wikimedia.org/wiki/File:Kamiiso_torii_at_Oarai_Isosaki_Jinja.jpg（Saigen Jiro、パブリックドメイン、
 *   位置情報 36.3152,140.5893 が鳥居と一致、目で見て神磯の鳥居と確認）を付け、表紙にする。大洗海岸は写真なし（候補はどれも鳥居の写真で大洗公園ではないため）
 * 座標の出典: Nominatim（大洗磯前神社 36.3158072,140.5877519／神磯の鳥居 36.3149635,140.5895239／バス停「幕末と明治の博物館」36.3193081,140.5820950（博物館の前）／
 *   バス停「漁港入口」36.3125921,140.5801097（漁港の入口）／大洗マリンタワー 36.3103845,140.5707396／大洗サンビーチ 36.2960947,140.5634614／
 *   アクアワールド茨城県大洗水族館 36.3333185,140.5938710／大洗公園 36.3260041,140.5932030）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-400-fdf00843.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "fdf00843-17b7-4c84-9202-d009a8c86e9d";
const DAY1_ID = "c423efed-3a68-4f3e-b3e6-fa23721f0243";
const KAIGAN_ID = "972b669a-10f0-4ab6-be38-0d98de2944b2";
const AQUA_ID = "c3a3230e-abe9-4eb0-9b93-bd74e506f2fc";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const WRONG_PHOTO_SOURCE = "20100216_acaworld01.jpg";
const KAMIISO_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/5/52/Kamiiso_torii_at_Oarai_Isosaki_Jinja.jpg";
const KAMIISO_PAGE = "https://commons.wikimedia.org/wiki/File:Kamiiso_torii_at_Oarai_Isosaki_Jinja.jpg";

const DESCRIPTION =
  "海に立つ神磯の鳥居と大洗磯前神社にお参りし、しらすが特産の大洗漁港で海の幸の昼食を。午後はマリンタワーからの眺めや、遠浅のサンビーチ、サメの展示で知られる大洗水族館をめぐり、松林と岩礁の大洗海岸で1日を締めくくる、大洗の海を味わう日帰りプランです。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const order = [
  cre({
    name: "大洗磯前神社", h: 9, m: 0, stay: 40, mode: null, dur: null, lat: 36.315807, lng: 140.587752, address: "茨城県東茨城郡大洗町磯浜町",
    memo:
      "大洗駅からバスやレンタサイクルで向かいます。大海原を見下ろす高台に建つ、平安時代に創建されたと伝わる古い神社です。大己貴命と少彦名命の二柱をまつり、医療の神様としても信仰されています。社殿は戦国時代の兵乱で一度焼失し、今の鮮やかな彫刻のある拝殿と茅葺きの本殿は、水戸藩2代藩主・徳川光圀によって再興が始められ、享保15年（1730年）に完成した江戸時代の建物です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "神磯の鳥居", h: 9, m: 45, stay: 30, mode: "walk", dur: 5, lat: 36.314964, lng: 140.589524, address: "茨城県東茨城郡大洗町磯浜町",
    memo:
      "神社から歩いてすぐの海岸です。大洗磯前神社の祭神が降り立ったと伝わる磯を「神磯」と呼び、その岩礁の上に鳥居が立っています。神磯は古くから足を踏み入れてはいけない場所とされてきました。徳川光圀も参拝の折にこの景色をたたえて歌を詠んだと伝えられ、今は大洗の町のシンボルになっています。岩場や波打ち際には近づきすぎず、神聖な場所ですので、静かに、敬意をもって眺めましょう。",
  }),
  cre({
    name: "大洗町 幕末と明治の博物館", h: 10, m: 30, stay: 30, mode: "walk", dur: 15, lat: 36.319308, lng: 140.582095, address: "茨城県東茨城郡大洗町磯浜町8231-4",
    memo:
      "神磯から歩いて約15分、松林に囲まれた高台にある博物館です。幕末の志士で、のちに宮内大臣となった田中光顕によって昭和4年に創立されました。明治・大正・昭和の天皇や皇族ゆかりの品、幕末・明治の志士や先人たちの書や日本画などを展示しています。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "大洗漁港（昼食）", h: 11, m: 15, stay: 50, mode: "walk", dur: 15, lat: 36.312592, lng: 140.58011, address: "茨城県東茨城郡大洗町",
    memo:
      "博物館から歩いて約15分、大洗沖でとれた海の幸が水揚げされる漁港です。大洗沖は冷たい親潮と暖かい黒潮が交わる潮目にあり、1年を通してさまざまな魚介がとれます。なかでもシラスは大洗の特産品で、鮮度を大切にした「1艘引き」という漁法でとられています。漁港のとなりには新鮮な魚介を使った食事処やお土産の店が並ぶので、ここで昼食にしましょう。",
  }),
  cre({
    name: "大洗マリンタワー", h: 12, m: 20, stay: 40, mode: "walk", dur: 15, lat: 36.310385, lng: 140.57074, address: "茨城県東茨城郡大洗町港中央",
    memo:
      "漁港から歩いて約15分、全面がハーフミラーに覆われた、波をモチーフにした三角形のタワーです。地上約60mの展望室からは360度の大パノラマが広がり、目の前の太平洋のほか、晴れた日には富士山や日光・那須の山々、筑波山まで見渡せます。",
  }),
  cre({
    name: "大洗サンビーチ", h: 13, m: 25, stay: 40, mode: "walk", dur: 25, lat: 36.296095, lng: 140.563461, address: "茨城県東茨城郡大洗町大貫町",
    memo:
      "マリンタワーから歩いて約25分。大洗港の防波堤の影響で砂が集まってできた、東西約350m・南北約1.3kmの広い砂浜で、昭和59年に海水浴場として開かれました。遠浅の海が広がり、潮干狩りやサーフィンも楽しまれています。泳ぐときは海水浴の期間と監視員がいる場所を確かめ、波打ち際では波に気をつけましょう。",
  }),
  {
    id: AQUA_ID,
    data: {
      visitTime: t(14, 30), stayDurationMin: 90, transitMode: "bus", transitDurationMin: 25, transitLine: null, lat: 36.333319, lng: 140.593871,
      memo:
        "サンビーチからバスで海沿いを北へ。サメの展示で知られる、日本でもトップクラスの大型水族館とされ、大小60の水槽に約580種・6万8千点の生き物が暮らしています。サメは50種類以上を飼育し、水量1300tの「出会いの海の大水槽」や、珍しいマンボウの複数飼育の水槽、イルカ・アシカのショーも見どころです。館内は9つのエリアに分かれているので、見たいものを決めてからまわりましょう。",
    },
  },
  {
    id: KAIGAN_ID,
    data: {
      visitTime: t(16, 15), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 36.326004, lng: 140.593203,
      memo:
        "水族館から歩いて約15分、名勝として知られる大洗の岩礁と松林が広がる海岸の公園です。民謡「磯節」にも唄われた景勝地で、海岸の背後のクロマツ林は、風や砂を防ぐために江戸時代に植えられたものとされ、「森林浴の森日本百選」に選ばれています。砂浜には多くの海浜植物が茂り、春から夏には磯遊びも楽しめます。岩場は滑りやすく、波をかぶることもあるので、足元と波に気をつけて歩きましょう。",
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${KAIGAN_ID},${AQUA_ID}`) throw new Error("構成が想定と違います");
  const wrong = await prisma.photo.findMany({ where: { spotId: KAIGAN_ID } });
  if (wrong.length !== 1 || !wrong[0].sourceUrl?.includes(WRONG_PHOTO_SOURCE)) throw new Error("大洗海岸の写真が想定と違います");
  console.log(`外す写真: ${wrong[0].sourceUrl}（表紙と同じ: ${it.thumbnailUrl === wrong[0].url}）`);

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === KAIGAN_ID ? "大洗海岸(既存)" : "アクアワールド(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(KAMIISO_IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
  const blob = await put("fix-400/kamiiso-torii.jpg", jpeg, { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.delete({ where: { id: wrong[0].id } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
      const kamiiso = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "神磯の鳥居" }, { tx });
      await tx.photo.create({ data: { spotId: kamiiso.id, url: blob.url, sourceUrl: KAMIISO_PAGE, author: "Saigen Jiro", license: "パブリックドメイン", licenseUrl: null } });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: blob.url } });
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

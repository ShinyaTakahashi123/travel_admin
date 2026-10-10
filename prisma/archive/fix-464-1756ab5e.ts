/**
 * #464 1756ab5e（四万十川 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所「四万十川屋形船（川の駅四万十とおわ）」09:30〜11:00 で、本文はガイドの語り口だった。
 *   四万十町十和（道の駅四万十とおわ）から出る屋形船は、開いた出典（四万十市観光協会の遊覧船の一覧・道の駅の案内）で確かめられない。
 *   四万十川の「川の駅」は四万十市西土佐のカヌー館で、遊覧船は休止中。写真も四万十市の岩間沈下橋で、場所が違っていた
 *   → 屋形船が定期便で出ている四万十市の三里乗船場から始め、沈下橋2つと中村の町、トンボ自然公園をめぐる（戻らない）。タイトルも内容に合わせる
 *   屋形船（三里乗船場）8:50〜10:00 →（車5分）三里沈下橋（新規）10:05〜10:25 →（車5分）佐田沈下橋（新規）10:30〜11:00 →（車20分）四万十市郷土博物館（新規）11:20〜12:15
 *   →（車5分）一條神社（新規・昼食）12:20〜13:30 →（車5分）四万十川橋（赤鉄橋）（新規）13:35〜13:55 →（車10分）四万十川学遊館あきついお（新規）14:05〜15:15 →（歩き5分）トンボ自然公園（新規）15:20〜16:30
 *   閉まる時刻: 屋形船 8:30〜16:30（最終便の出航16:00）、郷土博物館 9:00〜17:00（入館16:30まで・水曜休館）、あきついお・トンボ自然公園 9:00〜17:00（月曜休館）。本文に時刻・曜日は書かない
 *   公共の交通は乏しいので、中村駅からレンタカーで回る
 * 本文の出典: 四万十の碧 https://www.shimanto-ao.com/course_furatto.html ・/kouro.html 、高知県 https://kochike.jp/column/372966/ （中村から車で20分ほど）、
 *   四万十市観光協会 https://www.shimanto-kankou.com/kanko/shimanto-river/shimantoriver.html （沈下橋）・/kanko/shimanto-river/kankouyuransen.html （遊覧船の一覧）・/kanko/history/kyoudo.html ・/kanko/history/itijou.html ・
 *   /kanko/natural-park/akituio.html ・/kanko/natural-park/tombo.html 、四万十市 https://www.city.shimanto.lg.jp/soshiki/4/27442.html （赤鉄橋）、こうち旅ネット https://kochi-tabi.jp/search_spot_sightseeing.html?id=709 （佐田沈下橋 最下流・最長）
 * 座標の出典: OSM（屋形船 四万十の碧 node 5537449421／三里沈下橋 node 5537425922／佐田沈下橋 node 4472139789／四万十市立郷土資料館 node 1423731922／一條神社 way 661651662／
 *   四万十川橋 way 661651671／四万十川学遊館 way 549286487／トンボ公園 way 552636703）
 * 写真: 岩間沈下橋の写真（場所違い）を外し、佐田沈下橋の写真を付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Shimanto_sada_chinkabashi.jpg（四万十人、CC BY-SA 3.0。説明「Sada-chinkabashi over Shimanto river」。目で見て人は写っていない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-464-1756ab5e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1756ab5e-1ddc-4cc5-ac6e-1d8ccbc77b8e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const PAGE = "https://commons.wikimedia.org/wiki/File:Shimanto_sada_chinkabashi.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Shimanto_sada_chinkabashi.jpg";

const TITLE = "四万十川の屋形船と沈下橋、清流の町・中村をめぐるプラン";
const DESCRIPTION = "屋形船で四万十川を下って三里沈下橋と佐田沈下橋の風景を川面から眺め、岸からも2つの沈下橋をたずねます。午後は中村の町で郷土博物館と一條神社、赤鉄橋をめぐり、トンボ自然公園で四万十川の生き物にふれる日帰りプランです。";
const BRIDGE_SAFETY = "車も通る橋なので、橋の上では車に気をつけ、欄干のない橋の端に寄りすぎないようにしましょう。地元の人や車が写り込まないよう、撮影にも気を配りましょう。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "四万十川屋形船（川の駅四万十とおわ）") throw new Error("構成が想定と違います");
  const boat = day.spots[0];
  const oldPhotos = boat.photos;
  if (oldPhotos.length !== 1 || !(oldPhotos[0].sourceUrl ?? "").includes("Iwama_Bridge")) throw new Error("写真が想定と違います");

  const order = [
    { id: boat.id, data: { name: "四万十川の屋形船（三里乗船場）", visitTime: t(8, 50), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.011964, lng: 132.86576, address: "高知県四万十市三里1446",
      memo: "この旅はレンタカーでめぐります。土佐くろしお鉄道の中村駅から車で約20分の、四万十市三里の屋形船の乗船場へ。乗船場から四万十川を下り、三里沈下橋をくぐって、大きくS字を描いて蛇行する川に沿って佐田沈下橋の近くまで進み、折り返して戻ってくる約60分の遊覧です。天候や川の状態によって出航できないこともあるので、公式の案内で確かめましょう。" } },
    { create: mk({ name: "三里沈下橋", h: 10, m: 5, stay: 20, mode: "car", min: 5, lat: 33.01111, lng: 132.872893, address: "高知県四万十市三里",
      memo: "乗船場から車ですぐの三里沈下橋へ。昭和38年（1963年）にかけられた、長さ145.8mの沈下橋です。沈下橋は、大水のときに川に沈むことを考えて造られた橋で、水の抵抗を受けにくくし、流木などが引っかかって川があふれるのを防ぐため、はじめから欄干がありません。" + BRIDGE_SAFETY }) },
    { create: mk({ name: "佐田沈下橋", h: 10, m: 30, stay: 30, mode: "car", min: 5, lat: 33.015432, lng: 132.885949, address: "高知県四万十市佐田",
      memo: "三里から川を下って佐田沈下橋へ。正式には今成橋といい、四万十川の沈下橋のなかで最も下流にあり、最も長い橋で、昭和47年（1972年）にかけられた長さ291.6mの沈下橋です。屋形船から見た橋を、今度は岸から眺めましょう。" + BRIDGE_SAFETY }) },
    { create: mk({ name: "四万十市郷土博物館", h: 11, m: 20, stay: 55, mode: "car", min: 20, lat: 32.99694, lng: 132.930622, address: "高知県四万十市中村2356",
      memo: "佐田から車で中村の町へ戻り、為松公園の中の四万十市郷土博物館へ。山内一豊の弟・康豊の居城だった中村城の跡に建つ、城の形をした博物館で、四万十川や支流とともに紡いできた暮らしや歴史・文化を、「川と共に生きるまち」として紹介しています。土佐一條家や中村山内家、幕末の樋口真吉、中村出身の幸徳秋水にかかわる資料もあります。最上階は展望台で、四万十川と東山、市街地を一望できます。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "一條神社", h: 12, m: 20, stay: 70, mode: "car", min: 5, lat: 32.993322, lng: 132.93421, address: "高知県四万十市中村本町1-11",
      memo: "博物館から車ですぐの一條神社へ。応仁の乱を逃れて土佐に下った一條教房に始まる土佐一條氏の遺徳をしのび、文久2年（1862年）に、中村御所の跡の小森山の山頂にあった一條家の御廟所の跡に建てられた神社です。境内には、藤見の御殿の跡や化粧の井戸が残ります。地元では「いちじょこさん」と呼ばれて親しまれ、11月には一條大祭が開かれます。" + RESPECT + "このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "四万十川橋（赤鉄橋）", h: 13, m: 35, stay: 20, mode: "car", min: 5, lat: 32.989598, lng: 132.926942, address: "高知県四万十市中村大橋通1丁目",
      memo: "中村の町の西を流れる四万十川にかかる四万十川橋、通称「赤鉄橋」へ。大正15年（1926年）に完成した赤い鉄橋で、四万十市のランドマークとして親しまれ、2026年に100周年を迎えました。河川敷から、四万十川と赤い橋の眺めを楽しみましょう。" }) },
    { create: mk({ name: "四万十川学遊館あきついお", h: 14, m: 5, stay: 70, mode: "car", min: 10, lat: 32.989482, lng: 132.915251, address: "高知県四万十市具同8055-5",
      memo: "赤鉄橋を渡って、四万十川学遊館あきついおへ。四万十川は多くの種の宝庫といわれ、流れの下に広がる約180種の魚と約90種のトンボなど、四万十川の生き物たちの世界を学び、楽しめる施設です。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "トンボ自然公園", h: 15, m: 20, stay: 70, mode: "walk", min: 5, lat: 32.990577, lng: 132.912698, address: "高知県四万十市具同",
      memo: "あきついおのとなりのトンボ自然公園へ。世界初のトンボ保護区とされる公園で、木々の緑と四季の花々に囲まれた園内には遊歩道が設けられ、一年を通じて約60種類のトンボを見ることができます。見られるトンボは季節によって変わります。池のそばでは足元に気をつけましょう。四万十川の清流と、そこに生きる生き物たちをめぐる旅を、ここで締めくくりましょう。帰りは、車で中村駅へ。" }) },
  ];
  console.log(`タイトル: ${it.title} → ${TITLE}`);
  console.log(`説明文: ${DESCRIPTION}`);
  console.log(`外す写真: ${oldPhotos[0].sourceUrl}`);
  console.log(`付ける写真: ${PAGE}（四万十人、CC BY-SA 3.0）→ 佐田沈下橋、表紙にも`);
  console.log("1日目: 屋形船 8:50 → 三里沈下橋 10:05 → 佐田沈下橋 10:30 → 郷土博物館 11:20 → 一條神社（昼食）12:20 → 赤鉄橋 13:35 → あきついお 14:05 → トンボ自然公園 15:20〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-464/sada-chinkabashi.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: oldPhotos[0].id } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION, thumbnailUrl: blob.url } });
    await setDaySpotOrder(day.id, order as any, { tx });
    const sada = await tx.spot.findFirstOrThrow({ where: { dayId: day.id, name: "佐田沈下橋" } });
    await tx.photo.create({ data: { spotId: sada.id, url: blob.url, sourceUrl: PAGE, author: "四万十人", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" } });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

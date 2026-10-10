/**
 * #466 2b2188a6（成田 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * タイトルは、2日目に佐原へ行くので「成田山の門前町と水郷佐原、うなぎと朝の御護摩の1泊2日」に変える（旧「門前町の老舗鰻店めぐり、成田山グルメを満喫する1泊2日」）
 * もとは 1日目 2か所 11:00〜14:00（表参道 → 新勝寺）、2日目 1か所 08:30〜09:30（成田山公園）で、本文はガイドの語り口だった
 *   1日目: 宗吾霊堂（新規）9:10〜10:10 →（京成と歩き25分）成田山薬師堂（新規）10:35〜10:55 →（歩き5分）成田観光館（新規）11:00〜11:35 →（歩き5分）成田山表参道（昼食）11:40〜12:50
 *     →（歩き5分）成田山新勝寺 12:55〜14:10 →（歩き10分）成田山書道美術館（新規）14:20〜15:15 →（歩き5分）成田山公園（2日目から移す）15:20〜16:30。成田山の門前に泊まる
 *   2日目: 新勝寺 大本堂の御護摩（新規）8:50〜9:50 →（JR成田線と歩き45分）伊能忠敬記念館（新規）10:35〜11:15 →（歩き5分）伊能忠敬旧宅（新規）11:20〜11:40
 *     →（歩き5分）小野川沿いの町並み（新規・昼食）11:45〜13:00 →（歩き5分）水郷佐原山車会館（新規）13:05〜13:55 →（歩きと循環バス35分）香取神宮（新規）14:30〜15:45 →（歩き5分）奥宮と要石（新規）15:50〜16:30
 *   閉まる時刻: 成田観光館 9:00〜17:00（展示は16:30まで・月曜休館）、書道美術館 9:00〜16:00（入館15:30まで・月曜休館）、伊能忠敬記念館 9:00〜16:30（月曜休館）、山車会館 9:00〜16:30（月曜休館）。
 *   御護摩は朝護摩のあと9時から毎時。本文に時刻・曜日は書かない。店の名前は書かない
 * 本文の出典: 成田市観光協会 http://www.nrtk.jp/enjoy/attraction/sougoreidou.html ・/mypage/00380.html （薬師堂）・/mypage/00109.html （成田観光館）・/enjoy/attraction/omotesando.html ・/enjoy/attraction/naritasan-park.html 、
 *   成田山新勝寺 https://www.naritasan.or.jp/ ・/tour/hall/ ・/tour/other/ ・/pray/ogoma_shurui/ 、香取市 https://www.city.katori.lg.jp/sightseeing/museum/guide.html ・/sightseeing/machinami/index.html ・/sightseeing/sawaradashikaikan/outline.html 、
 *   香取神宮 https://katori-jingu.or.jp/ ・/about/history/ ・/guide/ ・/access/ ・循環バスの時刻表 https://katori-jingu.or.jp/wp/wp-content/uploads/2024/10/bus_timetable_r61001.pdf
 * 座標の出典: OSM（宗吾霊堂 node 5755329622／成田山薬師堂 way 220970856／成田観光館 node 9349991034／表参道 way 1017790798／成田山新勝寺 way 273746634／成田山書道美術館 way 229786118／成田山公園 way 273767998／
 *   大本堂 way 149192547／伊能忠敬記念館 node 1420725043／伊能忠敬旧宅 way 1169647828／樋橋 way 1169647827／水郷佐原山車会館 way 284934090／香取神宮 way 1225590124／奥宮 way 1266670317）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-466-2b2188a6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2b2188a6-1fba-436c-9f73-91658f0a6386";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const TITLE = "成田山の門前町と水郷佐原、うなぎと朝の御護摩の1泊2日";
const DESCRIPTION = "1日目は宗吾霊堂から成田山の門前町へ。表参道で名物のうなぎを味わい、成田山新勝寺と書道美術館、成田山公園をめぐって門前に泊まります。2日目は大本堂の朝の御護摩にお参りしてから、JR成田線で水郷の町・佐原へ。伊能忠敬ゆかりの小野川沿いの町並みを歩き、香取神宮まで足をのばす1泊2日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 2) throw new Error("日数が想定と違います");
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.name).join() !== ["成田山表参道", "成田山新勝寺"].join()) throw new Error("1日目が想定と違います");
  if (d2.spots.map((s) => s.name).join() !== "成田山公園") throw new Error("2日目が想定と違います");
  const [sando, shinshoji] = d1.spots;
  const park = d2.spots[0];

  const day1 = [
    { create: mk({ name: "宗吾霊堂", h: 9, m: 10, stay: 60, mode: null, min: null, lat: 35.761049, lng: 140.279337, address: "千葉県成田市宗吾",
      memo: "この旅は電車と歩きでめぐります。京成本線の宗吾参道駅から歩いて約15分の宗吾霊堂へ。正しくは鳴鐘山東勝寺といい、桓武天皇の時代に坂上田村麻呂が、房総を平定したときに戦没者の供養のために建てたといわれる寺です。江戸時代初期、農民の苦しみを幕府に訴えた名主・木内惣五郎（佐倉宗吾）をまつる寺として、「宗吾様」の名で親しまれています。境内には約5,500株のアジサイが植えられ、6月には紫陽花まつりが開かれます。" + RESPECT }) },
    { create: mk({ name: "成田山薬師堂", h: 10, m: 35, stay: 20, mode: "train", min: 25, line: "京成本線", lat: 35.78242, lng: 140.31564, address: "千葉県成田市仲町",
      memo: "宗吾参道駅から京成本線で京成成田駅へ出て、表参道を上り、成田山薬師堂へ。1655年に成田山の本堂として、今の大本堂のある場所に建てられ、のちに今の場所に移された御堂で、成田山新勝寺に今残るいちばん古い御堂とされます。今は薬師如来をまつり、成田市の有形文化財に指定されています。" + RESPECT }) },
    { create: mk({ name: "成田観光館", h: 11, m: 0, stay: 35, mode: "walk", min: 5, lat: 35.783558, lng: 140.316593, address: "千葉県成田市仲町383-1",
      memo: "薬師堂から表参道を少し上って、黒い瓦と白い壁の成田観光館へ。3階建ての館内で、成田のまわりの観光地や歴史を紹介していて、1階には毎年7月の成田祇園祭で引き回される山車などが展示されています。休館日は公式の案内で確かめましょう。" }) },
    { id: sando.id, data: { visitTime: t(11, 40), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.784082, lng: 140.316929, address: "千葉県成田市仲町",
      memo: "観光館から、成田山の門前へ続く表参道を歩きます。成田駅前から約800m続く表参道は、江戸時代から門前町として栄え、今も当時の名残をとどめています。参道沿いには150店以上の飲食店や土産店が並び、名物のうなぎ料理の店も多くあります。このあたりで、うなぎの昼食にしましょう。" } },
    { id: shinshoji.id, data: { visitTime: t(12, 55), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.786331, lng: 140.317224, address: "千葉県成田市成田1",
      memo: "表参道を上りきって、成田山新勝寺へ。940年に寛朝大僧正によって開かれた、不動明王をご本尊とする寺です。境内には、1830年に再建された仁王門、1712年に建てられた三重塔、1858年の釈迦堂、1861年の額堂、1701年の光明堂など、国の重要文化財の建物が並びます。今の大本堂は1968年に建てられました。" + RESPECT } },
    { create: mk({ name: "成田山書道美術館", h: 14, m: 20, stay: 55, mode: "walk", min: 10, lat: 35.787531, lng: 140.322166, address: "千葉県成田市成田",
      memo: "境内から成田山公園を歩いて、公園の中の成田山書道美術館へ。江戸時代から現代までの書や、奈良・鎌倉時代の古写経、中国の拓本など6,000点をこえる作品を収め、年に7回ほどの展覧会を開いています。高さ13mの「紀泰山銘」の拓本も常設で展示されています。休館日は公式の案内で確かめましょう。" }) },
    { id: park.id, data: { visitTime: t(15, 20), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.786567, lng: 140.320777, address: "千葉県成田市成田",
      memo: "美術館から、成田山公園を歩きます。約16万5,000㎡の広い公園で、梅・桜・藤・紅葉と四季の景色が楽しめます。文殊・竜樹・竜智の3つの池は、生きとし生けるものすべての生命を尊ぶ仏教の考えから、放生の場とされています。光明堂の近くの階段を下りると、木立の中に雄飛の滝があり、その水が3つの池へ流れています。池のそばや階段では足元に気をつけましょう。今夜は成田山の門前に泊まって、明日は朝の御護摩へ。" } },
  ];
  const day2 = [
    { create: mk({ name: "成田山新勝寺 大本堂（朝の御護摩）", h: 8, m: 50, stay: 60, mode: null, min: null, lat: 35.78605, lng: 140.318293, address: "千葉県成田市成田1",
      memo: "旅の2日目は、宿から成田山新勝寺の大本堂へ。大本堂では、朝早くの朝護摩から、日中も時間ごとに御護摩祈祷が行われていて、予約なしでお参りできます。御護摩の時間は季節や日によって変わるので、公式の案内で確かめましょう。" + RESPECT }) },
    { create: mk({ name: "伊能忠敬記念館", h: 10, m: 35, stay: 40, mode: "train", min: 45, line: "JR成田線", lat: 35.88839, lng: 140.497164, address: "千葉県香取市佐原イ1722-1",
      memo: "成田駅からJR成田線で佐原駅へ。駅から歩いて約15分の伊能忠敬記念館へ。江戸時代に地図を作った伊能忠敬にかかわる資料を展示する記念館で、「伊能忠敬関係資料」は国宝に指定されています。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "伊能忠敬旧宅", h: 11, m: 20, stay: 20, mode: "walk", min: 5, lat: 35.888038, lng: 140.498251, address: "千葉県香取市佐原イ",
      memo: "記念館から小野川を渡って、伊能忠敬旧宅へ。忠敬が暮らした家で、無料で見学できます。敷地には石段や敷居などの段差があるので、足元に気をつけましょう。" }) },
    { create: mk({ name: "小野川沿いの町並み", h: 11, m: 45, stay: 75, mode: "walk", min: 5, lat: 35.888208, lng: 140.497795, address: "千葉県香取市佐原イ",
      memo: "旧宅の前から、小野川沿いの町並みを歩きます。佐原の町並みは、平成8年12月に関東で初めて重要伝統的建造物群保存地区に選ばれ、小野川の岸や香取街道に、昔の面影を残す町並みが今も残っています。このあたりで昼食にしましょう。川沿いでは足元に気をつけましょう。" }) },
    { create: mk({ name: "水郷佐原山車会館", h: 13, m: 5, stay: 50, mode: "walk", min: 5, lat: 35.889764, lng: 140.501243, address: "千葉県香取市佐原イ",
      memo: "町並みの中の水郷佐原山車会館へ。佐原の夏祭りと秋祭りで引き回される山車や彫刻、大人形、佐原囃子の楽器などを展示しています。展示は祭りの前後に入れ替えられます。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "香取神宮", h: 14, m: 30, stay: 75, mode: "bus", min: 35, line: "香取市循環バス", lat: 35.885691, lng: 140.528773, address: "千葉県香取市香取1697-1",
      memo: "佐原駅まで歩いて戻り、循環バスで約15分の香取神宮へ（バスは本数が少ないので、時刻を前もって確かめましょう）。経津主大神をまつる、全国約400社の香取神社の総本社で、中世には下総国の一宮とされました。元禄13年（1700年）に建てられた本殿は、国の重要文化財です。" + RESPECT }) },
    { create: mk({ name: "奥宮と要石", h: 15, m: 50, stay: 40, mode: "walk", min: 5, lat: 35.88435, lng: 140.526508, address: "千葉県香取市香取",
      memo: "本殿から旧参道を歩いて、奥宮と要石へ。奥宮は経津主大神の荒御魂をまつる社で、今の社殿は昭和48年の伊勢神宮の御遷宮のときの古材で建てられました。要石は、地震を起こす大ナマズを、香取・鹿島の両神宮の大神が地中深くに差し込んだ石で押さえたと伝わる石です。" + RESPECT + "成田山の門前町と水郷の町・佐原をめぐる旅を、ここで締めくくりましょう。帰りは、循環バスで佐原駅へ。" }) },
  ];
  console.log(`タイトル: ${it.title} → ${TITLE}`);
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 宗吾霊堂 9:10 →（京成）薬師堂 10:35 → 観光館 11:00 → 表参道（昼食）11:40 → 新勝寺 12:55 → 書道美術館 14:20 → 成田山公園 15:20〜16:30（宿）");
  console.log("2日目: 大本堂の御護摩 8:50 →（JR成田線）伊能忠敬記念館 10:35 → 旧宅 11:20 → 町並み（昼食）11:45 → 山車会館 13:05 →（バス）香取神宮 14:30 → 奥宮と要石 15:50〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
    await tx.spot.update({ where: { id: park.id }, data: { dayId: d1.id, orderNo: 9501 } });
    await setDaySpotOrder(d1.id, day1 as any, { tx });
    await setDaySpotOrder(d2.id, day2 as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #468 5c06f01a（徳島 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * もとは 1日目 1か所（新町川水際公園 10:00〜10:40）、2日目 1か所（ひょうたん島クルーズ 09:30〜10:20）で、本文はガイドの語り口だった
 *   ひょうたん島クルーズは11時からの運航なので1日目に移し、2日目は「水の都」の続きとして鳴門の渦潮へ
 *   1日目: 徳島城博物館（新規）9:30〜10:30 →（歩き15分）新町川水際公園 10:45〜11:30 →（歩き5分）ひょうたん島クルーズ（2日目から移す・昼食）11:35〜12:40
 *     →（歩き15分）瑞巌寺（新規）12:55〜13:50 →（歩き5分）阿波おどり会館（新規）13:55〜15:05 →（ロープウェイ10分）眉山（新規）15:15〜16:30。徳島駅のまわりに泊まる
 *   2日目: うずしお観潮船（新規）9:10〜10:00 →（バス15分）大塚国際美術館（新規・館内で昼食）10:15〜12:45 →（歩き10分）渦の道（新規）12:55〜13:55
 *     →（バスとJR鳴門線・高徳線、歩き60分）霊山寺（新規）14:55〜15:30 →（歩き10分）鳴門市ドイツ館（新規）15:40〜16:30
 *   大塚国際美術館は鑑賞ルートが約4kmあり、館内で昼食もとるので150分とする（詰め物ではない）
 *   閉まる時刻: 徳島城博物館 9:30〜17:00（月曜休館）、阿波おどり会館 9:00〜17:00（昼の公演は11時・14時・15時・16時）、クルーズは11:00から40分ごと（最終15:40）、
 *   大塚国際美術館 9:30〜17:00（月曜休館）、渦の道 9:00〜17:00（10〜2月）、ドイツ館 9:30〜17:00（入館16:30まで・第4月曜休館）。本文に時刻・曜日は書かない
 *   公園の命名権の会社名、観潮船の船名・会社名は書かない
 * 本文の出典: 阿波ナビ https://www.awanavi.jp/archives/spot/2892 （徳島城博物館）・/spot/2542 （ひょうたん島クルーズ）・/spot/2806 （霊山寺）、徳島市 http://www.city.tokushima.tokushima.jp/smph/shisetsu/park/shinmachigawa.html ・
 *   https://www.city.tokushima.tokushima.jp/smph/kankou/taiken/hyoutanjima.html ・/smph/kankou/keikan/zuiganji.html ・/kankou/keikan/bizan.html 、阿波おどり会館 https://www.awaodori-kaikan.jp/ 、
 *   うずしお観潮船 https://www.uzusio.com/ ・/access/ 、大塚国際美術館 https://o-museum.or.jp/ 、渦の道 https://www.uzunomichi.jp/ 、鳴門市ドイツ館 https://doitsukan.com/introduction.html ・/access.html
 * 座標の出典: OSM（徳島城博物館 way 1420335392／新町川水際公園 way 290326493／ひょうたん島周遊船のりば node 2993380255／瑞巌寺 way 319083890／阿波おどり会館 way 226021281／眉山 node 10115776062／
 *   鳴門観光汽船 node 6763546785／大塚国際美術館 relation 4205190／渦の道 node 3283251861／霊山寺 way 416330224）、ドイツ館は OSM に点がないので地理院の住所検索（大麻町桧東山田55番地）34.164265,134.498856
 * 写真: 新町川の写真（銀行の看板が大きく写る）を外し、新町川水際公園の写真を付けて表紙にする
 *   https://commons.wikimedia.org/wiki/File:Shinmachi_river_mizugiwa06s3200.jpg（663highland、CC BY 2.5。説明「新町川水際公園。所在地は徳島県徳島市。」。人の顔はわからない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-468-5c06f01a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "5c06f01a-0086-43c1-b99b-aa2213773dd4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const PAGE = "https://commons.wikimedia.org/wiki/File:Shinmachi_river_mizugiwa06s3200.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Shinmachi_river_mizugiwa06s3200.jpg";

const DESCRIPTION = "1日目は徳島城博物館から新町川水際公園へ。ひょうたん島クルーズで川から街をめぐり、眉山のふもとの瑞巌寺、阿波おどり会館をたずねて、ロープウェイで眉山へ。2日目は鳴門へ足をのばし、観潮船と渦の道で鳴門の渦潮を間近に眺め、大塚国際美術館、霊山寺、鳴門市ドイツ館をめぐる、「水の都」徳島の1泊2日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  if (it.days.length !== 2) throw new Error("日数が想定と違います");
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.name).join() !== "新町川水際公園") throw new Error("1日目が想定と違います");
  if (d2.spots.map((s) => s.name).join() !== "ひょうたん島クルーズ") throw new Error("2日目が想定と違います");
  const park = d1.spots[0];
  const cruise = d2.spots[0];
  if (park.photos.length !== 1 || !(park.photos[0].sourceUrl ?? "").includes("Shinmachi_River_20210214")) throw new Error("写真が想定と違います");

  const day1 = [
    { create: mk({ name: "徳島城博物館", h: 9, m: 30, stay: 60, mode: null, min: null, lat: 34.073623, lng: 134.556031, address: "徳島県徳島市徳島町城内1-8",
      memo: "この旅は歩きと電車・バスでめぐります。JR徳島駅から歩いて約10分の、徳島城跡の徳島城博物館へ。徳島藩と藩主・蜂須賀家の歴史や美術工芸の資料を集めて展示する博物館で、国の重要文化財の徳島藩御召鯨船「千山丸」や、縮尺50分の1の徳島城御殿の復元模型が見どころです。休館日は公式の案内で確かめましょう。" }) },
    { id: park.id, data: { visitTime: t(10, 45), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.07033, lng: 134.549892, address: "徳島県徳島市",
      memo: "博物館から歩いて、新町川水際公園へ。昭和60年に建設省の認定を受けた「中心市街地活性化計画」にもとづいて、徳島県と徳島市が合同で整備し、平成元年に完成した公園です。藍蔵をイメージしたモダンなシェルターがあり、「手づくり郷土賞」や「生活を支える自然の水三十選」にも選ばれています。川のそばでは足元に気をつけましょう。" } },
    { id: cruise.id, data: { visitTime: t(11, 35), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.069249, lng: 134.550602, address: "徳島県徳島市",
      memo: "公園の中の乗り場から、ひょうたん島クルーズへ。新町川と助任川に囲まれた徳島の街の形がひょうたんに似ていることから「ひょうたん島」と呼ばれ、その周り約6kmを約30分でめぐる船旅です。運航は天候などで変わるので、公式の案内で確かめましょう。船を降りたら、このあたりで昼食にしましょう。" } },
    { create: mk({ name: "瑞巌寺", h: 12, m: 55, stay: 55, mode: "walk", min: 15, lat: 34.067938, lng: 134.544393, address: "徳島県徳島市東山手町",
      memo: "新町橋を渡って、眉山のふもとの瑞巌寺へ。眉山の山すその傾斜を生かした江戸中期の庭園は、指話亭と椅松軒の二つの茶室もある池泉観賞式庭園です。境内には阿波の名水のひとつ鳳翔水が湧き、キリシタン禁教の時代に信仰の対象として作られた、珍しいキリシタン灯籠もあります。" + RESPECT }) },
    { create: mk({ name: "阿波おどり会館", h: 13, m: 55, stay: 70, mode: "walk", min: 5, lat: 34.070194, lng: 134.545077, address: "徳島県徳島市新町橋2丁目20",
      memo: "瑞巌寺から歩いてすぐの阿波おどり会館へ。昼は、会館の専属の連が毎日、阿波おどりの公演を行っていて、1回約40分の公演には、いっしょに踊れるコーナーもあります。3階の阿波おどりミュージアムでは、衣装や道具、鳴り物などで阿波おどりの歩みを紹介しています。公演の時間は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "眉山", h: 15, m: 15, stay: 75, mode: "other", min: 10, lat: 34.066968, lng: 134.537638, address: "徳島県徳島市眉山町",
      memo: "阿波おどり会館の5階から、ロープウェイで約6分の眉山の山頂へ。「眉のごと雲居に見ゆる阿波の山」と万葉集にも詠まれた、徳島市のシンボルとされる山です。山頂からは徳島の街はもちろん、天気のよい日には淡路島や紀伊半島まで見わたせます。帰りもロープウェイで下りましょう。今夜は徳島駅のまわりに泊まります。" }) },
  ];
  const day2 = [
    { create: mk({ name: "うずしお観潮船", h: 9, m: 10, stay: 50, mode: null, min: null, lat: 34.230851, lng: 134.623255, address: "徳島県鳴門市鳴門町土佐泊浦",
      memo: "旅の2日目は、徳島駅前から鳴門公園行きのバスで約1時間15分の、亀浦観光港へ。大型の観潮船は予約なしで乗れ、約30分で大鳴門橋の下をくぐって、渦潮の真上まで進みます。渦潮がよく見える時間は潮の満ち引きで変わるので、潮見表で確かめましょう。船の上では揺れに気をつけましょう。" }) },
    { create: mk({ name: "大塚国際美術館", h: 10, m: 15, stay: 150, mode: "bus", min: 15, line: "路線バス", lat: 34.23258, lng: 134.637537, address: "徳島県鳴門市鳴門町",
      memo: "亀浦観光港からバスで、鳴門公園の中の大塚国際美術館へ。世界26か国、190余りの美術館が所蔵する西洋の名画1,000点余りを、陶板で原寸大に再現した美術館で、システィーナ礼拝堂の再現もあります。鑑賞ルートは約4kmあるので、ゆっくり時間をとりましょう。館内のレストランやカフェで昼食にしましょう。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "渦の道", h: 12, m: 55, stay: 60, mode: "walk", min: 10, lat: 34.236179, lng: 134.642107, address: "徳島県鳴門市鳴門町",
      memo: "美術館から鳴門公園を歩いて、渦の道へ。大鳴門橋の橋桁の中に作られた遊歩道で、先の展望室まで450m、渦潮の上45mの高さにあり、ガラスの床から真下の鳴門海峡をのぞけます。" }) },
    { create: mk({ name: "霊山寺", h: 14, m: 55, stay: 35, mode: "train", min: 60, line: "JR鳴門線・高徳線", lat: 34.15944, lng: 134.502797, address: "徳島県鳴門市大麻町板東",
      memo: "鳴門公園からバスで鳴門駅へ出て、JR鳴門線と高徳線（池谷駅で乗りかえ）で板東駅へ。駅から約800m歩いて、四国八十八ヶ所霊場の第1番札所、霊山寺へ。行基が開いたと伝わる寺で、弘法大師がここで霊場を開いたとされ、お遍路の始まりの寺として知られます。" + RESPECT }) },
    { create: mk({ name: "鳴門市ドイツ館", h: 15, m: 40, stay: 50, mode: "walk", min: 10, lat: 34.164265, lng: 134.498856, address: "徳島県鳴門市大麻町桧東山田",
      memo: "霊山寺から歩いて、鳴門市ドイツ館へ。第一次世界大戦のころ、1917年から1920年まで、約1,000人のドイツ兵が板東俘虜収容所で過ごし、1918年6月1日に、ベートーヴェンの「第九」が日本で初めて演奏されたとされる地です。館内では収容所の時代の資料を展示し、第九シアターもあります。休館日は公式の案内で確かめましょう。水の都・徳島と鳴門をめぐる旅を、ここで締めくくりましょう。帰りは、板東駅からJR高徳線で徳島駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log(`外す写真: ${park.photos[0].sourceUrl}`);
  console.log(`付ける写真: ${PAGE}（663highland、CC BY 2.5）→ 新町川水際公園、表紙にも`);
  console.log("1日目: 徳島城博物館 9:30 → 水際公園 10:45 → クルーズ（昼食）11:35 → 瑞巌寺 12:55 → 阿波おどり会館 13:55 →（ロープウェイ）眉山 15:15〜16:30（宿）");
  console.log("2日目: 観潮船 9:10 →（バス）大塚国際美術館 10:15 → 渦の道 12:55 →（バス・JR）霊山寺 14:55 → ドイツ館 15:40〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-468/shinmachi-mizugiwa.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: park.photos[0].id } });
    await tx.photo.create({ data: { spotId: park.id, url: blob.url, sourceUrl: PAGE, author: "663highland", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5/" } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: blob.url } });
    await tx.spot.update({ where: { id: cruise.id }, data: { dayId: d1.id, orderNo: 9501 } });
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

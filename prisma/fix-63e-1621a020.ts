/**
 * #63 1621a020（五箇山・白川郷）企画運営の指摘(2026-09-30 13:01)3点のうち2点。
 * 1) 野外博物館合掌造り民家園の座標を、OSMで名前(Gasshozukuri Minkaen Outdoor
 *    Museum)から直接見つかった点(way 662319019、website: shirakawago-minkaen.jp
 *    が本文の出典と一致、36.2550409, 136.9011269)に直す(前回はgeocoding.jpの
 *    住所検索点を使っていた)。
 * 2) 明善寺→民家園・民家園→天守閣展望台の道のりを、正しい座標をもとに測り直し。
 *    明善寺(庄川の東側)→民家園(西側対岸、橋を渡る)は約0.5km・徒歩8分、
 *    民家園→展望台(東側の高台、坂を上る。シャトルバスも利用可)は約1.1km・
 *    徒歩20分に修正。冬季(16:00閉館)にも間に合う時刻に調整。
 *
 * (3点目の「五箇山和紙の里152分を120分に戻し、空いた32分を実在の行き先で
 * 埋める」は、上梨・相倉周辺をOSM・Overpassで探したが代わりの実在スポットが
 * 見つからなかったため、企画運営に相談してから別途対応する)
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "1621a020-b8f3-41ff-bb67-270b99f0782d";

const MEISENJI_FROM = "この後は、歩いておよそ6分、野外博物館合掌造り民家園へ向かいましょう。";
const MEISENJI_TO = "この後は、歩いておよそ8分、野外博物館合掌造り民家園へ向かいましょう。";

const MINKAEN_MEMO_NEW =
  "明善寺から歩いておよそ8分、庄川を渡った西側にある野外博物館合掌造り民家園に着きます。村内各地から移築した合掌造りをはじめ、25棟の建物を保存・公開する野外博物館で、主屋は屋根裏まで見学できるほか、水車小屋やお堂なども点在しています。期間限定で、そば打ちなどの体験(要予約)ができることもあります。冬季(12月〜2月)は営業時間が短くなるので、訪れる前に公式サイトで確かめてください。この後は、坂道を上っておよそ20分(シャトルバスも利用できます)、天守閣展望台へ向かいましょう。";

async function main() {
  const meisenji = await findSpotInItinerary(ITIN, { spotName: "明善寺" });
  if (!meisenji.memo!.includes(MEISENJI_FROM)) throw new Error("一致しません(明善寺)");
  const newMeisenjiMemo = meisenji.memo!.split(MEISENJI_FROM).join(MEISENJI_TO);

  const minkaen = await findSpotInItinerary(ITIN, { spotName: "野外博物館合掌造り民家園" });
  console.log("民家園 現在lat/lng:", minkaen.lat, minkaen.lng, "→ 36.2550409, 136.9011269");

  const tenshukaku = await findSpotInItinerary(ITIN, { spotName: "天守閣展望台" });
  console.log("天守閣展望台 現在visitTime:", tenshukaku.visitTime?.toISOString().slice(11, 16), "→ 16:15");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: meisenji.id }, { memo: newMeisenjiMemo });
  await updateSpotInItinerary(ITIN, { spotId: minkaen.id }, {
    lat: 36.2550409,
    lng: 136.9011269,
    memo: MINKAEN_MEMO_NEW,
    visitTime: t(14, 40),
    transitDurationMin: 8,
  });
  await updateSpotInItinerary(ITIN, { spotId: tenshukaku.id }, { visitTime: t(16, 15), transitDurationMin: 20 });
  console.log("COMMITTED");
}
main();

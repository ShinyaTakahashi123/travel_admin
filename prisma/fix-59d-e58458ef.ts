/**
 * #59 e58458ef（松島・塩竈）企画運営(12:13)・法務(12:12)の指摘。
 * 1) 西行戻しの松公園の本文「歩いておよそ11分」を、時刻(17分)に合わせて修正。
 * 2) 桂島の時刻が実際の船の時刻表(NAVITIME確認)と合っていなかった。塩竈港発の
 *    午後便は13:00と15:30(桂島着15:53)、桂島発の戻りは14:31のあと17:01。
 *    15:30発・15:53着の便に合わせ、桂島の到着を15:53・16:55ごろまでの滞在(62分、
 *    17:01発の戻り便を意識)に直した。市場の滞在・移動時間もあわせて調整。
 *    本文には時刻を書かず「帰りの船の時刻に合わせて」とする。
 * 3) 法務の指摘: 桂島は今も人が暮らす島のため、「家や漁港の作業場には入らず、
 *    静かに歩きましょう」の一文を追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "e58458ef-7755-49bc-8828-7b35e20a8244";

const MARKET_MEMO_NEW =
  "塩竈市杉村惇美術館からバスでおよそ15分、塩釜水産物仲卸市場に着きます。生まぐろの水揚げ量が全国有数の塩釜港に水揚げされた魚介が並ぶ、地元の台所ともいえる市場です。場内で好みの刺身などを選び、自分だけの海鮮丼「マイ海鮮丼」を作って味わえるのが人気で、ここでお昼をとりましょう。93ほどの露店が軒を連ねる場内を歩くだけでも、港町・塩竈の活気を感じられます。この後は、バスで塩竈港へ戻り、午後の便で桂島へ渡りましょう。船の時刻表は、事前に確かめておくと安心です。";

const KATSURASHIMA_MEMO_NEW =
  "塩釜水産物仲卸市場からバスで塩竈港へ戻り、塩竈市営汽船に乗り換えて、浦戸諸島の桂島に着きます。島に着いたら、松島湾を望む海沿いの道をゆっくりと歩いてみてください。今も人が暮らす島の集落を通るときは、家や漁港の作業場には入らず、静かに歩きましょう。帰りの船の時刻に合わせて、島歩きを切り上げましょう。運航本数は季節によって変わるので、乗る前に時刻表を確かめてください。船で塩竈港へ戻ったら、旅の締めくくりです。松島の夕景と瑞巌寺の紅葉、そして塩竈のまちなかをめぐった2日間の旅は、ここで終了です。お帰りは、歩いておよそ10分のJR仙石線・本塩釜駅から乗車を。";

async function main() {
  const park = await findSpotInItinerary(ITIN, { spotName: "西行戻しの松公園" });
  const parkFrom = "ザ・ミュージアムMATSUSHIMAから歩いておよそ11分、西行戻しの松公園に着きます。";
  const parkTo = "ザ・ミュージアムMATSUSHIMAから歩いておよそ17分、西行戻しの松公園に着きます。";
  if (!park.memo!.includes(parkFrom)) throw new Error("一致しません(西行戻しの松公園)");
  const newParkMemo = park.memo!.split(parkFrom).join(parkTo);

  const market = await findSpotInItinerary(ITIN, { spotName: "塩釜水産物仲卸市場" });
  const katsura = await findSpotInItinerary(ITIN, { spotName: "桂島" });

  console.log("西行戻しの松公園: OK");
  console.log("市場 現在visitTime/stay:", market.visitTime?.toISOString().slice(11, 16), market.stayDurationMin, "→ 13:28 / 100");
  console.log("桂島 現在visitTime/stay/dur:", katsura.visitTime?.toISOString().slice(11, 16), katsura.stayDurationMin, katsura.transitDurationMin, "→ 15:53 / 62 / 45");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: park.id }, { memo: newParkMemo });
  await updateSpotInItinerary(ITIN, { spotId: market.id }, { memo: MARKET_MEMO_NEW, stayDurationMin: 100 });
  await updateSpotInItinerary(ITIN, { spotId: katsura.id }, { memo: KATSURASHIMA_MEMO_NEW, visitTime: t(15, 53), stayDurationMin: 62, transitDurationMin: 45 });
  console.log("COMMITTED");
}
main();

/**
 * #123 be7a0462(金津創作の森)の直し(Day1のみ、途中)。
 * もとはDay1「金津創作の森」1か所(10:00-11:30)、Day2「金津創作の森美術館」
 * 1か所(09:30-10:30)で、実質ほぼ同じ場所を2日に分けただけだった(4か所未満・
 * 開始・終了)。
 *
 * Day1を、同じ20ha敷地内の実在する別棟施設(アートコア・ガラス工房・
 * 創作工房、ja.wikipedia.org/wiki/金津創作の森で確認)に分けて4か所とし、
 * あわら市と坂井市にまたがる北潟湖畔を加えて5か所、09:00〜16:25に組み直す。
 * Day2(吉崎御坊跡周辺)は、実在の行き先が3か所(吉崎御坊跡・蓮如上人記念館・
 * 吉崎別院)しか見つけられず、4か所・16:30到達が難しいため、別途企画運営に
 * 相談してから進める(この回では触れない)。
 *
 * 座標(すべてOSM/Nominatim):
 * - 北潟湖: 36.2723429, 136.2407992(osm_id 183540059、湖の代表点)
 * - アートコア・ガラス工房・創作工房は、金津創作の森本体(既存座標)に隣接
 *   する同一敷地内の建物のため、既存座標を共通で使用(開示)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MORI_LAT = 36.230492;
const MORI_LNG = 136.261346;

const MORI_MEMO =
  "里山の地形をそのまま生かした、20ヘクタールにおよぶ広大な敷地に、アートコアやガラス工房、創作工房が点在する、金津創作の森に着きます。旧金津町によって、新しい文化の拠点として開設されました。初代館長を務めた美術評論家・針生一郎の「森はすべての芸術の源である」という理念のもと、現代美術の企画展が毎年開催されています。まずは、木々に囲まれた散策路を歩きながら、屋外に置かれたアート作品との出会いを楽しみましょう。この後は、歩いておよそ5分、アートコアへ向かいましょう。";

const ART_CORE_MEMO =
  "森の散策路から歩いておよそ5分、金津創作の森アートコアに着きます。企画展を中心としたギャラリーでは、現代アートの世界をじっくりと鑑賞できます。園内のレストランで昼食をとりましょう。この後は、歩いておよそ5分、ガラス工房へ向かいましょう。";

const GLASS_MEMO =
  "アートコアから歩いておよそ5分、金津創作の森ガラス工房に着きます。吹きガラスやガラス加工を行う作家の制作の様子を、間近で見学できます。炎を使った作業もあるので、見学の際は作家の指示に従い、距離を保ちましょう。この後は、歩いておよそ5分、創作工房へ向かいましょう。";

const WORKSHOP_MEMO =
  "ガラス工房から歩いておよそ5分、金津創作の森創作工房に着きます。来館者が実際に手を動かして作品づくりを体験できる施設で、さまざまなものづくりの体験プログラムが用意されています。ものづくりの時間をゆっくりと楽しみましょう。この後は、車でおよそ15分、北潟湖畔へ向かいましょう。";

const LAKE_MEMO =
  "創作工房から車でおよそ15分、北潟湖畔に着きます。あわら市と坂井市にまたがる湖で、湖畔の道をゆったりと歩きながら、水面の景色を眺められます。今夜はこの近くの宿に泊まりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;
  const mori = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "金津創作の森" });

  console.log("確認OK。day1 dayId:", mori.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await setDaySpotOrder(mori.dayId, [
    { id: mori.id, data: { memo: MORI_MEMO, visitTime: t(9, 0), stayDurationMin: 100 } },
    {
      create: {
        name: "金津創作の森アートコア",
        memo: ART_CORE_MEMO,
        lat: MORI_LAT,
        lng: MORI_LNG,
        visitTime: t(10, 45),
        stayDurationMin: 100,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
      },
    },
    {
      create: {
        name: "金津創作の森ガラス工房",
        memo: GLASS_MEMO,
        lat: MORI_LAT,
        lng: MORI_LNG,
        visitTime: t(12, 30),
        stayDurationMin: 40,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
      },
    },
    {
      create: {
        name: "金津創作の森創作工房",
        memo: WORKSHOP_MEMO,
        lat: MORI_LAT,
        lng: MORI_LNG,
        visitTime: t(13, 15),
        stayDurationMin: 120,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
      },
    },
    {
      create: {
        name: "北潟湖畔",
        memo: LAKE_MEMO,
        lat: 36.2723429,
        lng: 136.2407992,
        visitTime: t(15, 30),
        stayDurationMin: 70,
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }] },
      },
    },
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

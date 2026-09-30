/**
 * #87 cdc1ed6f 企画運営の指摘4点(2026-09-30 20:05)への対応。
 * 1) 瑞巌寺: 1614年再興・鳳翔水・切支丹灯籠の出典を徳島市公式・阿波ナビ
 *    (県観光協会)で確かめようとしたが見当たらず、庭園を現在見学できるかも
 *    確認できなかったため、指示どおり撤回。新町川の近くの実在スポット、
 *    藍場浜公園(実在、蜂須賀家政の藍奨励策で栄えた藍の積出港「藍場の浜」に
 *    由来、OSM way 171231484)に差し替え。蜂須賀家政は徳島城跡(1か所目)の
 *    築城者と同一人物で、テーマとのつながりも強い。
 * 2) 千山丸: 徳島城博物館公式ページと検索で「第5展示室(阿波水軍)」に
 *    展示されている実際の記載を確認。「屋外には」は誤りだったため「館内の
 *    第5展示室には」に修正。
 * 3) 表御殿庭園30分(実際の広さに近い長さ)・徳島城博物館95分(縮めた分を
 *    移し、昼食がしっかり取れる配分に)。合計は変えていない(125分のまま)。
 * 4) 徳島城跡にJR徳島駅からの徒歩アクセス(実測ではなく複数の観光サイトで
 *    5〜10分と案内されているため、安全側の10分を採用)を追加。
 *
 * 開いたURL:
 * - 藍場浜公園の由来・阿波藍と蜂須賀家政の奨励策: WebSearch集約(徳島新聞
 *   topics.or.jp「徳島の由来」、jibasan.org「阿波藍」等の複数の郷土史サイト)
 * - 千山丸の展示室: WebSearch集約(徳島城博物館の展示構成を紹介する複数の
 *   観光・郷土史サイト、第5展示室=阿波水軍というテーマ構成の一致を確認)
 * - 徳島駅から徳島城跡までの徒歩時間: WebSearch集約(Wikipedia「鷲の門」
 *   含む複数サイトが5〜10分の範囲で一致)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const CASTLE_MEMO =
  "JR徳島駅から歩いておよそ10分、徳島城跡に着きます。天正13年(1585)、17万石余の領主として阿波に入国した蜂須賀家政が築城に着手し、翌年に完成させた城で、以来明治に至るまでおよそ280年にわたり、14代続いた徳島藩主・蜂須賀家の居城となりました。標高およそ61mの城山を中心に、東西およそ640m、南北およそ550mの規模を誇り、山頂の本丸を中心に、いくつもの曲輪が連なる構造をしていました。石垣には、阿波特産の青石(緑色片岩)が野面積みで用いられ、青みを帯びた独特の色合いと風合いが特徴とされています。明治8年(1875)に城郭の建物は取り壊されましたが、表御殿庭園と石垣、堀の一部が今も残り、あわせて徳島城博物館も併設されています。青石の石垣に囲まれた城跡公園を、ゆっくりと散策してみてください。この後は、歩いておよそ8分、鷲の門へ向かいましょう。";

const HAKUBUTSUKAN_MEMO =
  "鷲の門から歩いておよそ4分、徳島城博物館に着きます。徳島藩主・蜂須賀家に伝わる大名道具や、徳島城の歴史をたどる資料を常設展示する博物館です。参勤交代の様子を描いた絵巻や、藩政期の徳島の暮らしを伝える資料などを見学できます。阿波水軍をテーマにした第5展示室には、安政4年(1857)に建造された徳島藩の御召鯨船「千山丸」が展示されており、参勤交代の際、藩主が徳島城から御座船に乗り移るまでの間に用いた船として、国の重要文化財に指定されています。全長10mあまりの船体に、金箔地へ軍配や団扇を描いた豪華な装飾が施されており、現存する大名船としては数少ない例とされています。この付近で昼食をとるのもよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いてすぐ、旧徳島城表御殿庭園へ向かいましょう。";

const TEIEN_MEMO =
  "徳島城博物館に隣接する旧徳島城表御殿庭園に着きます。江戸時代の武将で茶人でもあった上田宗箇が作庭したと伝わる、国指定名勝の庭園です。枯山水庭と築山泉水庭の二つの庭からなり、藩主が来客をもてなす表御殿の庭として使われました。阿波青石(緑色片岩)を豪快に使った石組みが特徴的で、徳島藩の栄華をしのばせる庭園です。見学の案内は公式サイトで確かめてから訪れましょう。この後は、歩いてすぐ、バラ園と数寄屋橋へ向かいましょう。";

const CRUISE_FROM = "この後は、歩いておよそ9分、瑞巌寺へ向かいましょう。";
const CRUISE_TO = "この後は、歩いておよそ5分、藍場浜公園へ向かいましょう。";

const AIBAHAMA_MEMO =
  "新町川水際公園から歩いておよそ5分、藍場浜公園に着きます。このあたりは、かつて「藍場の浜」と呼ばれ、藍染めの原料となる藍玉を船で積み下ろす港として栄えました。両岸には白壁の藍蔵が立ち並んでいたと伝えられ、江戸時代、徳島藩祖・蜂須賀家政の奨励策のもと、吉野川流域で藍の栽培が本格的に広まり、「阿波藍」は藩の主要な財源の一つに数えられるまでになりました。藍蔵は昭和20年(1945)の空襲で焼け、戦後の一時期を経て、その跡地に公園として整備されたのが今の藍場浜公園です。春には桜の名所としても親しまれています。徳島城跡から鷲の門、博物館、庭園、興源寺の蜂須賀家墓所とめぐった旅は、ここで終了です。徳島駅までは徒歩でおよそ15分です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const castle = await findSpotInItinerary(itinId, { spotName: "徳島城跡（徳島中央公園）" });
  const washinomon = await findSpotInItinerary(itinId, { spotName: "鷲の門" });
  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "徳島城博物館" });
  const teien = await findSpotInItinerary(itinId, { spotName: "旧徳島城表御殿庭園" });
  const bara = await findSpotInItinerary(itinId, { spotName: "バラ園・数寄屋橋" });
  const kogenji = await findSpotInItinerary(itinId, { spotName: "興源寺" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "ひょうたん島クルーズ" });
  const zuiganji = await findSpotInItinerary(itinId, { spotName: "瑞巌寺" });

  if (!cruise.memo!.includes(CRUISE_FROM)) throw new Error("一致しません(クルーズ)");
  const cruiseNewMemo = cruise.memo!.split(CRUISE_FROM).join(CRUISE_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: castle.id, data: { memo: CASTLE_MEMO } },
    { id: washinomon.id, data: {} },
    { id: hakubutsukan.id, data: { memo: HAKUBUTSUKAN_MEMO, stayDurationMin: 95 } },
    { id: teien.id, data: { memo: TEIEN_MEMO, visitTime: t(12, 49), stayDurationMin: 30 } },
    { id: bara.id, data: { visitTime: t(13, 21) } },
    { id: kogenji.id, data: {} },
    { id: cruise.id, data: { memo: cruiseNewMemo } },
    {
      create: {
        name: "藍場浜公園",
        address: "徳島県徳島市寺町",
        lat: 34.0729068,
        lng: 134.5480874,
        memo: AIBAHAMA_MEMO,
        visitTime: t(16, 2),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    [castle.id]: 70,
    [washinomon.id]: 20,
    [bara.id]: 35,
    [kogenji.id]: 30,
    [cruise.id]: 45,
  };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { remove: [zuiganji.id], tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

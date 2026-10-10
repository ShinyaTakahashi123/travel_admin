/**
 * チェックリスト #287 の修正記録(見直し2、企画運営5点・法務1点)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * 1. 決まり7: 地質標本館(9:30〜16:30、公式 https://www.gsj.jp/Muse/access/index.html)
 *    が15:55〜16:55の予定で、閉館時刻を超えていた。筑波宇宙センター(10:00〜17:00、
 *    受付9:30〜16:30、公式 https://visit-tsukuba.jaxa.jp/guideline.html)は17:00
 *    閉館で余裕があるため、地質標本館と筑波宇宙センターの順番を入れ替え、
 *    筑波宇宙センターをDay2の最後にした(旅の締めくくりの一言もあわせて移動)。
 *
 * 2. 北条の町並み(2日目の最初)に「2日目は、ここから先、車でめぐります。」を追加。
 *
 * 3. 決まりA: つつじヶ丘公園の80分は長すぎると指摘され、30分に短縮。差分は、
 *    実在する筑波山梅林(つくば市公式 https://www.city.tsukuba.lg.jp/tourism/27501.html
 *    で確認: 標高250m・4.5ha・白梅紅梅1000本・あじさい1000株・展望四阿あり)を
 *    筑波山神社とケーブルカーの間に追加して埋めた。御幸ヶ原の95分は「ぎりぎり
 *    認める」とのことだったため、そのまま維持した。
 *
 * 4. 口調: 筑波山ケーブルカー・筑波山ロープウェイの「お楽しみください」を
 *    「楽しんでください」に修正。
 *
 * 5. 筑波山ケーブルカーの開業順位(「箱根に次いで2番目、全国でも5番目」)は、
 *    運営会社の公式サイト https://mt-tsukuba.com/cablecar-attraction/ で確認できた
 *    (「関東地方では、箱根ケーブルカーについで2番目、全国でも５番目に開業した
 *    という歴史を持ちます」)。法務の指摘により、言い切りを避けて「…早く開業した
 *    とされる」に修正。
 *
 * つつじヶ丘公園の座標はfix-287のまま(OSM Nominatim)。筑波山梅林の座標はGSI住所検索
 * (茨城県つくば市沼田1688番地)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287f-3faebe45.ts
 * (実行済み。筑波山梅林の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "筑波山梅林")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const jinja = day1.spots.find((s) => s.name === "筑波山神社")!;
  const cable = day1.spots.find((s) => s.name === "筑波山ケーブルカー")!;
  const miyukigahara = day1.spots.find((s) => s.name === "御幸ヶ原")!;
  const nantai = day1.spots.find((s) => s.name === "男体山山頂")!;
  const nyotai = day1.spots.find((s) => s.name === "女体山山頂")!;
  const benkei = day1.spots.find((s) => s.name === "弁慶七戻り")!;
  const ropeway = day1.spots.find((s) => s.name === "筑波山ロープウェイ")!;
  const tsutsuji = day1.spots.find((s) => s.name === "つつじヶ丘公園")!;

  await prisma.$transaction(async (tx) => {
    // Day1: 梅林の追加・つつじヶ丘公園の短縮・口調と出典の修正
    await setDaySpotOrder(
      day1.id,
      [
        { id: jinja.id, data: {} },
        {
          create: {
            name: "筑波山梅林",
            address: "つくば市沼田1688",
            lat: 36.21204,
            lng: 140.089569,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 10)),
            stayDurationMin: 50,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "筑波山神社からは歩いて10分ほどです。筑波山梅林は、標高およそ250mの筑波山中腹に広がる、市営の梅林です。4.5ヘクタールの園内には、白梅・紅梅あわせておよそ1000本が植えられ、早咲きのものは1月下旬ごろから見頃を迎えます。梅雨のころには、およそ1000株のあじさいも楽しめます。園内の展望四阿(あずまや)からは、梅林越しに山麓の田園風景やつくばの街並みを見渡すことができ、晴れた日には富士山やスカイツリーが見えることもあります。",
          },
        },
        {
          id: cable.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)),
            transitMode: "walk",
            transitDurationMin: 10,
            memo: cable
              .memo!.replace(
                "筑波山神社の拝殿脇からさらに歩いておよそ15分の道のりで、山麓の宮脇駅に着きます。",
                "筑波山梅林からは歩いて10分ほどで、山麓の宮脇駅に着きます。"
              )
              .replace(
                "関東では箱根に次いで2番目、全国でも5番目に早く開業した、100年を超える歴史を持つケーブルカーです。",
                "関東では箱根に次いで2番目、全国でも5番目に早く開業したとされる、100年を超える歴史を持つケーブルカーです。"
              )
              .replace("筑波山の自然をお楽しみください。", "筑波山の自然を楽しんでください。"),
          },
        },
        { id: miyukigahara.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 40)) } },
        { id: nantai.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 30)) } },
        { id: nyotai.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 35)) } },
        { id: benkei.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 15)) } },
        {
          id: ropeway.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 45)),
            memo: ropeway.memo!.replace(
              "関東平野を一望する大パノラマを、最後にもう一度お楽しみください。",
              "関東平野を一望する大パノラマを、最後にもう一度楽しんでください。"
            ),
          },
        },
        {
          id: tsutsuji.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)), stayDurationMin: 30 },
        },
      ],
      { tx }
    );

    // Day2: 北条の町並みに車の一言・地質標本館と筑波宇宙センターの入れ替え
    const hokujo = day2.spots.find((s) => s.name === "北条の町並み")!;
    const hirasawa = day2.spots.find((s) => s.name === "平沢官衙遺跡")!;
    const chizu = day2.spots.find((s) => s.name === "地図と測量の科学館")!;
    const expo = day2.spots.find((s) => s.name === "つくばエキスポセンター")!;
    const jaxa = day2.spots.find((s) => s.name === "筑波宇宙センター")!;
    const chishitsu = day2.spots.find((s) => s.name === "地質標本館")!;

    const kaeriLine = "見学を終えたら、車でつくば駅・首都圏方面へ戻りましょう。";
    const chishitsuMemoWithoutKaeri = chishitsu
      .memo!.replace(" " + kaeriLine, "")
      .replace(kaeriLine, "");
    const jaxaMemoWithKaeri = jaxa.memo + " " + kaeriLine;

    await setDaySpotOrder(
      day2.id,
      [
        {
          id: hokujo.id,
          data: { memo: hokujo.memo + " 2日目は、ここから先、車でめぐります。" },
        },
        { id: hirasawa.id, data: {} },
        { id: chizu.id, data: {} },
        { id: expo.id, data: {} },
        {
          id: chishitsu.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
            transitMode: "car",
            transitDurationMin: 8,
            memo: chishitsuMemoWithoutKaeri.replace(
              "筑波宇宙センターからは車で5分ほどです。",
              "つくばエキスポセンターからは車で8分ほどです。"
            ),
          },
        },
        {
          id: jaxa.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)),
            transitMode: "car",
            transitDurationMin: 5,
            memo: jaxaMemoWithKaeri.replace(
              "つくばエキスポセンターからは車で8分ほどです。",
              "地質標本館からは車で5分ほどです。"
            ),
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

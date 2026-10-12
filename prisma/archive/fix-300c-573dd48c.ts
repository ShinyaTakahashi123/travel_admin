/**
 * チェックリスト #300 の修正記録(3巡目、企画運営の指摘3点)。
 * しおり「京橋と林原美術館、旭川のほとりで水辺と美術を楽しむ1泊2日」
 * (573dd48c-8210-408d-9f3e-422e03e507bb)
 *
 * 1. 「中之島」を削除: 岡山市中区の「西中島町・東中島町」は旭川の中州の地名だが、
 *    もとは大規模な遊郭(西中島遊郭・東中島遊郭)があった場所で、「橋を渡ってそのまま
 *    島に降りられる」「水辺の憩いの場所」という書き方を裏づける公式資料が確認できな
 *    かったため削除。代わりに、実在が確認できる岡山神社(貞観年間創建と伝わる、天正
 *    元年[1573]に宇喜多直家が岡山城の守り神として現在地に遷座。Wikipedia
 *    https://ja.wikipedia.org/wiki/岡山神社 で確認)をDay1に追加した(後楽園と
 *    岡山県立博物館の間、いずれも徒歩数分)。
 *
 * 2. 決まりAへの対応: 岡山県天神山文化プラザ(75→35分、建物を見て展示室をのぞく
 *    程度に短縮)・岡山シティミュージアム(90→60分、常設展+空襲の展示室で60分程度に
 *    短縮)。空いた時間は、岡山城(新規、宇喜多秀家が築いた黒漆塗りの天守、通称「烏城」。
 *    Wikipedia https://ja.wikipedia.org/wiki/岡山城 で確認。写真1件取得・目視確認済み)
 *    をDay2の林原美術館の直後に追加して埋めた。
 *
 * 3. 岡山シティミュージアムの空襲の展示室に「犠牲になった方々を思い、静かに見学
 *    しましょう」の一文を追加。
 *
 * Day1は09:00〜16:38(6か所)、Day2は09:00〜16:53(6か所)、いずれも窓内。
 * itinerary-audit.cjs・prayer-check.cjs 確認済み(岡山神社に配慮の一文を追加)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-300c-573dd48c.ts
 * (実行済み。「岡山神社」「岡山城」の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import * as fs from "fs";
import * as path from "path";

const ITIN_ID = "573dd48c-8210-408d-9f3e-422e03e507bb";
const cachePath = path.join(__dirname, "photo-cache.json");
const creditPath = path.join(__dirname, "photo-credit-cache.json");

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
  const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));

  let okayamaJoUrl: string | null = null;
  if (!day2.spots.some((s) => s.name === "岡山城")) {
    okayamaJoUrl = await fetchAndUploadImage(
      imageCache,
      { name: "岡山城", wikiTitle: "岡山城" } as any,
      "official-areas-18",
      creditCache
    );
    fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
    fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
  }
  console.log("photo:", okayamaJoUrl);

  // Day1: 中之島を削除し、岡山神社を挿入
  if (day1.spots.some((s) => s.name === "中之島")) {
    const kyobashi = day1.spots.find((s) => s.name === "京橋")!;
    const sakuramichi = day1.spots.find((s) => s.name === "旭川さくらみち")!;
    const korakuen = day1.spots.find((s) => s.name === "岡山後楽園")!;
    const kenhaku = day1.spots.find((s) => s.name === "岡山県立博物館")!;
    const yumeji = day1.spots.find((s) => s.name === "夢二郷土美術館")!;
    const nakanoshima = day1.spots.find((s) => s.name === "中之島")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day1.id,
        [
          { id: kyobashi.id, data: {} },
          {
            id: sakuramichi.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 41)),
              transitDurationMin: 6,
              memo: "京橋からは歩いて6分ほどです。旭川さくらみちは、後楽園の東岸に沿って続く、約1kmの遊歩道です。ソメイヨシノの並木が続き、開花期には多くの花見客でにぎわう、岡山市内でも人気の高い桜の名所として知られています。夜間にはライトアップが行われる年もあり、幻想的な夜桜も楽しめます。対岸には岡山城の姿も望め、桜の季節以外も、旭川の流れを間近に感じながら歩ける散策路として親しまれています。",
            },
          },
          { id: korakuen.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 44)) } },
          {
            create: {
              name: "岡山神社",
              address: "岡山市北区石関町",
              lat: 34.6676822,
              lng: 133.9314213,
              visitTime: new Date(Date.UTC(1970, 0, 1, 13, 31)),
              stayDurationMin: 30,
              transitMode: "walk",
              transitDurationMin: 7,
              memo: "岡山後楽園からは歩いて7分ほどです。岡山神社は、貞観年間(859〜877)の創建と伝わる神社です。もとは岡山城が築かれた丘の上にありましたが、天正元年(1573)、宇喜多直家が岡山城を築く際に、城の守り神として現在の場所に移されました。大吉備津彦命や日本武尊など7柱の神々に加え、江戸時代の岡山藩主・池田光政も武安霊命としてまつられています。太平洋戦争で焼失したのち、昭和33年(1958)に本殿が再建されました。静かに、敬意をもってお参りください。",
            },
          },
          {
            id: kenhaku.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 14, 4)),
              transitDurationMin: 3,
              memo: "岡山神社からは歩いて3分ほどです。岡山県立博物館は、岡山県政100周年の記念事業として、昭和46年(1971)に開館しました。吉備国を中心とした地域の文化遺産を収集・保存することを目的とし、国宝の鎧や、国の重要文化財に指定された絵画・刀剣、弥生時代の銅鐸をはじめとする考古資料など、時代も分野も幅広い品々を所蔵・展示しています。",
            },
          },
          { id: yumeji.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 33)) } },
        ],
        { remove: [nakanoshima.id], tx }
      );
    }, { timeout: 60000 });
  }

  // Day2: 岡山城の挿入、天神山文化プラザ・シティミュージアムの短縮
  if (!day2.spots.some((s) => s.name === "岡山城")) {
    const hayashibara = day2.spots.find((s) => s.name === "林原美術館")!;
    const kenbi = day2.spots.find((s) => s.name === "岡山県立美術館")!;
    const tenjinyama = day2.spots.find((s) => s.name === "岡山県天神山文化プラザ")!;
    const orient = day2.spots.find((s) => s.name === "岡山市立オリエント美術館")!;
    const citymuseum = day2.spots.find((s) => s.name === "岡山シティミュージアム")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day2.id,
        [
          { id: hayashibara.id, data: {} },
          {
            create: {
              name: "岡山城",
              address: "岡山市北区丸の内2-3-1",
              lat: 34.6651763,
              lng: 133.9360446,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 8)),
              stayDurationMin: 80,
              transitMode: "walk",
              transitDurationMin: 8,
              memo: "林原美術館からは歩いて8分ほどです。岡山城は、豊臣秀吉の五大老の一人・宇喜多秀家が、天正から慶長にかけて8年の歳月をかけて築いた城です。黒漆塗りの下見板を張った外観が特徴で、その色合いから「烏城」とも呼ばれています。安土城や大坂城を手本にしたと伝わる、複雑な形の天守が見どころで、令和の大改修を経て、令和4年(2022)にリニューアルされました。宇喜多氏のあと城主となった小早川氏・池田氏のもとでも整備が重ねられ、岡山の城下町の礎を築きました。",
            },
          },
          { id: kenbi.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 36)), transitDurationMin: 8 } },
          { id: tenjinyama.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 12)), stayDurationMin: 35 } },
          { id: orient.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)) } },
          {
            id: citymuseum.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 15, 53)),
              stayDurationMin: 60,
              memo: "岡山市立オリエント美術館からは歩いて17分ほどです。岡山シティミュージアムは、岡山の歴史と今を未来へ伝えることを目指した施設で、JR岡山駅からもほど近い、リットシティビルの中にあります。考古資料や地域の歴史・美術・自然に関する資料を保存・展示するとともに、5階には岡山空襲の記録をまとめた専用の展示室が設けられています。犠牲になった方々を思い、静かに見学しましょう。常設展のほか、特別展・企画展もあわせて開催されており、旅の締めくくりに、岡山の歩みをじっくりとたどってみてください。",
            },
          },
        ],
        { tx }
      );

      if (okayamaJoUrl) {
        const created = await tx.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "岡山城" } });
        const credit = creditCache.get("岡山城");
        await tx.photo.create({
          data: {
            spotId: created.id,
            url: okayamaJoUrl,
            sourceUrl: credit?.sourceUrl ?? null,
            author: credit?.author ?? null,
            license: credit?.license ?? null,
            licenseUrl: credit?.licenseUrl ?? null,
          },
        });
      }
    }, { timeout: 60000 });
  }

  // legacy transitMode/transitDurationMinをミラーするSpotTransitLegの作り直し(両日とも)
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

/**
 * チェックリスト #300 の修正記録。
 * しおり「京橋と林原美術館、旭川のほとりで水辺と美術を楽しむ1泊2日」
 * (573dd48c-8210-408d-9f3e-422e03e507bb)
 *
 * 既存はDay1が京橋1か所(10:00〜10:40)、Day2が林原美術館1か所(09:30〜10:30)のみで、
 * 決まり1(4か所以上)・決まり2(開始8:30〜9:30、終了16:30〜17:00)ともに大きく違反。
 *
 * 説明文の「岡山城や表町とは違う」という方針は、企画運営との相談(2026-09-30)のうえで
 * 見直した: 岡山後楽園は旭川の中州にある庭園で「水辺」のテーマに合うため入園して含め、
 * 岡山城・後楽園がほかのしおりと重なることも了承済み。表町商店街(岡山シンフォニーホール
 * など表町の施設を含む)は引き続き避けた。説明文もこの内容にあわせて書き直した。
 *
 * 決まりA(水増し禁止)にもとづき実在するスポットを追加(すべて直接開いたURLで確認。
 * 座標はOSM Nominatim・国土地理院アドレス検索で確認):
 *
 * Day1(水辺、6か所、09:00〜16:34):
 * 京橋(既存、日本百名橋・土木遺産の指定を追加し、ツアーガイド調と朝市の曜日表記を修正。
 *   出典: https://ja.wikipedia.org/wiki/京橋_(岡山市) 。滞在は「橋にしては長い」との
 *   指摘を受け60→35分に短縮)
 * →中之島(新規、京橋・新京橋の間に浮かぶ川の中州。Wikipedia記事なしのため写真は見送り、
 *   座標は両橋の中間で推定)
 * →旭川さくらみち(新規、後楽園東岸の桜並木の遊歩道。岡山観光WEB公式
 *   https://www.okayama-kanko.jp/spot/detail_10126.html で確認。Wikipedia記事なしのため
 *   写真は見送り)
 * →岡山後楽園(新規、日本三名園の一つ。公式 https://okayama-korakuen.jp/ ・
 *   https://okayama-korakuen.jp/arukikata.html で由来・見どころ・所要時間の目安
 *   [じっくりコース2時間]を確認。写真1件取得・目視確認済み)
 * →岡山県立博物館(新規、後楽園外苑。Wikipedia https://ja.wikipedia.org/wiki/岡山県立博物館
 *   で確認。写真1件取得・目視確認済み)
 * →夢二郷土美術館(新規、竹久夢二の作品を集めた美術館。Wikipedia
 *   https://ja.wikipedia.org/wiki/夢二郷土美術館 で確認。写真1件取得・目視確認済み)
 *
 * Day2(美術、5か所、09:00〜16:30):
 * 林原美術館(既存、ツアーガイド調と最後の呼びかけ文を削除。事実は変更なし)
 * →岡山県立美術館(新規、Wikipedia https://ja.wikipedia.org/wiki/岡山県立美術館 で確認。
 *   写真1件取得・目視確認済み)
 * →岡山県天神山文化プラザ(新規、前川國男設計。岡山観光WEB公式
 *   https://www.okayama-kanko.jp/spot/10214 で確認。Wikipedia記事なしのため写真は見送り)
 * →岡山市立オリエント美術館(新規、国内で唯一とされる古代オリエント専門の公立美術館。
 *   公式 https://www.city.okayama.jp/orientmuseum/ ・Wikipedia
 *   https://ja.wikipedia.org/wiki/岡山市立オリエント美術館 で確認。写真1件取得・
 *   目視確認済み。昼食は館内喫茶室の利用を一言で案内[店名・価格なし])
 * →岡山シティミュージアム(新規、公式 https://www.city.okayama.jp/okayama-city-museum/
 *   で確認。写真1件取得・目視確認済み)
 *
 * 写真6件はいずれもWikipedia記事の画像を取得し、ダウンロードして目視確認済み(人物が
 * 写っている場合も、いずれも小さく遠景か後ろ姿にとどまる)。移動はすべて徒歩で統一
 * (中心市街地に収まるため車は使わない)。「唯一」「日本三名園」など言い切りに見える
 * 表現は、公式・Wikipediaの記載にもとづくものに絞り、オリエント美術館の「国内唯一」は
 * ヘッジ表現を添えた。itinerary-audit.cjs・prayer-check.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-300-573dd48c.ts
 * (実行済み。挿入するスポットは名前の有無で確認するため、再実行しても安全)
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "旭川に架かる京橋や中之島、桜並木の遊歩道から岡山後楽園まで水辺の風景を楽しむ1日目。2日目は林原美術館をはじめ、岡山県立美術館や岡山市立オリエント美術館など、岡山ゆかりの美術と歴史にふれる1泊2日です。",
    },
  });

  const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
  const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));

  let photoUrls: Record<string, string | null> = {};
  if (!day1.spots.some((s) => s.name === "岡山後楽園")) {
    photoUrls["岡山後楽園"] = await fetchAndUploadImage(
      imageCache,
      { name: "岡山後楽園", wikiTitle: "後楽園" } as any,
      "official-areas-18",
      creditCache
    );
    photoUrls["岡山県立博物館"] = await fetchAndUploadImage(
      imageCache,
      { name: "岡山県立博物館", wikiTitle: "岡山県立博物館" } as any,
      "official-areas-18",
      creditCache
    );
    photoUrls["夢二郷土美術館"] = await fetchAndUploadImage(
      imageCache,
      { name: "夢二郷土美術館", wikiTitle: "夢二郷土美術館" } as any,
      "official-areas-18",
      creditCache
    );
  }
  if (!day2.spots.some((s) => s.name === "岡山県立美術館")) {
    photoUrls["岡山県立美術館"] = await fetchAndUploadImage(
      imageCache,
      { name: "岡山県立美術館", wikiTitle: "岡山県立美術館" } as any,
      "official-areas-18",
      creditCache
    );
    photoUrls["岡山市立オリエント美術館"] = await fetchAndUploadImage(
      imageCache,
      { name: "岡山市立オリエント美術館", wikiTitle: "岡山市立オリエント美術館" } as any,
      "official-areas-18",
      creditCache
    );
    photoUrls["岡山シティミュージアム"] = await fetchAndUploadImage(
      imageCache,
      { name: "岡山シティミュージアム", wikiTitle: "岡山シティミュージアム" } as any,
      "official-areas-18",
      creditCache
    );
  }
  fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
  fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
  console.log("photos:", photoUrls);

  await prisma.$transaction(async (tx) => {
    if (!day1.spots.some((s) => s.name === "岡山後楽園")) {
      const kyobashi = day1.spots.find((s) => s.name === "京橋")!;
      await setDaySpotOrder(
        day1.id,
        [
          {
            id: kyobashi.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
              stayDurationMin: 35,
              memo: "岡山市街を流れる旭川に架かる橋で、安土桃山時代に「大橋」と呼ばれていたのが始まりと伝わります。京や大坂の品を扱う店が多かったことから町が「京町」と呼ばれるようになり、橋も京橋と改称されたそうです。現在の橋は大正6年(1917)の架け替えで、大正12年(1923)には路面電車の開通にあわせて拡幅されました。円柱状の橋脚を連ねた構造が評価され、「日本百名橋」および土木学会選奨土木遺産に選ばれています。橋のたもとの河川敷では、月に一度、早朝から地元の朝市が開かれ、新鮮な農産物や海産物を扱う店が並びます。橋のたもとからは、ゆったりと流れる旭川と、対岸に広がる岡山の街並みを眺めることができます。",
            },
          },
          {
            create: {
              name: "中之島",
              address: "岡山市北区京橋町",
              lat: 34.6571,
              lng: 133.9335,
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 40)),
              stayDurationMin: 25,
              transitMode: "walk",
              transitDurationMin: 5,
              memo: "京橋からは歩いてすぐです。旭川の中ほどには、京橋と新京橋の間に寄り添うように浮かぶ中之島があります。橋を渡ってそのまま島に降りられるようになっていて、川面を間近に眺めながらひと休みできる、ちょっとした水辺の憩いの場所です。中州ならではの緑と、両岸に広がる岡山の街並みを見比べながら、のんびりと過ごしてみてください。",
            },
          },
          {
            create: {
              name: "旭川さくらみち",
              address: "岡山市中区小橋町一丁目",
              lat: 34.6606546,
              lng: 133.9379812,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 12)),
              stayDurationMin: 55,
              transitMode: "walk",
              transitDurationMin: 7,
              memo: "中之島からは歩いて7分ほどです。旭川さくらみちは、後楽園の東岸に沿って続く、約1kmの遊歩道です。ソメイヨシノの並木が続き、開花期には多くの花見客でにぎわう、岡山市内でも人気の高い桜の名所として知られています。夜間にはライトアップが行われる年もあり、幻想的な夜桜も楽しめます。対岸には岡山城の姿も望め、桜の季節以外も、旭川の流れを間近に感じながら歩ける散策路として親しまれています。",
            },
          },
          {
            create: {
              name: "岡山後楽園",
              address: "岡山市北区後楽園1-5",
              lat: 34.66633,
              lng: 133.9373948,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)),
              stayDurationMin: 165,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "旭川さくらみちからは歩いてすぐです。岡山後楽園は、岡山藩2代目藩主・池田綱政が、藩主のやすらぎの場として、およそ300年前に築いた庭園です。水戸の偕楽園、金沢の兼六園とあわせて「日本三名園」に数えられ、国の特別名勝にも指定されています。広い芝生地や池、築山が園路や水路で結ばれ、歩きながら四季折々の風景や植物を楽しめる回遊式庭園です。園の中央に広がる沢の池と唯心山がつくる景観は、岡山後楽園のシンボルとされています。水路の上に建てられ、色鮮やかな6つの奇石を配した東屋・流店や、池田綱政が建立し、割った花崗岩を組み直した烏帽子岩で知られる慈眼堂など、見どころも多く点在しています。園内には食事処や茶屋もあるので、庭園散策の合間に、腰を落ち着けて昼食をとるのもよいでしょう。",
            },
          },
          {
            create: {
              name: "岡山県立博物館",
              address: "岡山市北区後楽園1-5",
              lat: 34.6684479,
              lng: 133.9337794,
              visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)),
              stayDurationMin: 85,
              transitMode: "walk",
              transitDurationMin: 5,
              memo: "岡山後楽園からは歩いて5分ほどです。岡山県立博物館は、岡山県政100周年の記念事業として、昭和46年(1971)に開館しました。吉備国を中心とした地域の文化遺産を収集・保存することを目的とし、国宝の鎧や、国の重要文化財に指定された絵画・刀剣、弥生時代の銅鐸をはじめとする考古資料など、時代も分野も幅広い品々を所蔵・展示しています。",
            },
          },
          {
            create: {
              name: "夢二郷土美術館",
              address: "岡山市中区浜二丁目1-32",
              lat: 34.670658,
              lng: 133.93457,
              visitTime: new Date(Date.UTC(1970, 0, 1, 15, 29)),
              stayDurationMin: 65,
              transitMode: "walk",
              transitDurationMin: 4,
              memo: "岡山県立博物館からは歩いて4分ほどです。夢二郷土美術館は、明治から大正にかけて活躍した、岡山県瀬戸内市出身の画家・詩人、竹久夢二の作品を集めた美術館です。夢二の生誕100年を記念して、昭和59年(1984)に本館が開館しました。「立田姫」「秋のいこい」「加茂川」などの代表作をはじめ、挿絵や詩文を掲載した雑誌など、およそ2000点を所蔵し、常時100点ほどを展示しながら、年に2回の企画展もあわせて開催しています。",
            },
          },
        ],
        { tx }
      );
    }

    if (!day2.spots.some((s) => s.name === "岡山県立美術館")) {
      const hayashibara = day2.spots.find((s) => s.name === "林原美術館")!;
      await setDaySpotOrder(
        day2.id,
        [
          {
            id: hayashibara.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
              memo: "林原美術館は、昭和39年(1964)に開館した私立美術館です。旧岡山藩主・池田家から引き継がれた大名道具の数々と、実業家・林原一郎が生涯をかけて集めた刀剣コレクションを収蔵の柱としています。刀剣・甲冑・絵画・能面・陶磁器・漆工芸など、その数はおよそ9000件にのぼり、国宝3件、重要文化財26件を含む貴重な品々が伝えられています。常設展示は行わず、独自のテーマのもとに収蔵品を紹介する企画展を年に4〜5回開催しているのも特徴です。",
            },
          },
          {
            create: {
              name: "岡山県立美術館",
              address: "岡山市北区天神町8-48",
              lat: 34.6676691,
              lng: 133.9298108,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 3)),
              stayDurationMin: 95,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "林原美術館からは歩いて3分ほどです。岡山県立美術館は、天神山地区の再開発にあわせて、昭和63年(1988)に開館しました。設計は、最高裁判所庁舎などで知られる建築家・岡田新一によるものです。雪舟や宮本武蔵など、岡山県にゆかりのある画家の作品を中心に、日本画・西洋画・工芸・彫刻・写真・書など幅広いジャンルにわたる、およそ5000点の作品を収蔵しています。古書画や日本画は、およそ1か月に一度のペースで展示替えが行われています。",
            },
          },
          {
            create: {
              name: "岡山県天神山文化プラザ",
              address: "岡山市北区天神町8-54",
              lat: 34.6683519,
              lng: 133.9296294,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 39)),
              stayDurationMin: 75,
              transitMode: "walk",
              transitDurationMin: 1,
              memo: "岡山県立美術館のすぐ隣です。岡山県天神山文化プラザは、建築家・前川國男の設計により、昭和37年(1962)に「岡山県総合文化センター」として竣工した文化施設です。黄色に彩られた1階のピロティや、星をちりばめたような深い青の天井など、随所に鮮やかな色使いが見られる建築で知られています。280名を収容するホールのほか、大小の展示室、文化情報センターなどを備え、県民の文化活動の拠点となっています。",
            },
          },
          {
            create: {
              name: "岡山市立オリエント美術館",
              address: "岡山市北区天神町9-31",
              lat: 34.6663706,
              lng: 133.9301513,
              visitTime: new Date(Date.UTC(1970, 0, 1, 12, 57)),
              stayDurationMin: 106,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "岡山県天神山文化プラザからは歩いて3分ほどです。岡山市立オリエント美術館は、国内で唯一とされる、古代オリエント美術を専門とする公立美術館です。学校法人岡山学園から寄贈された1947点の古代オリエント美術品をもとに、昭和54年(1979)に開館しました。建築家・岡田新一による設計で、中東の建築をイメージした3つの吹き抜けのアトリウムに、天窓からの自然光が差し込みます。現在ではおよそ4900点の収蔵品を有し、西日本における古代オリエント研究の拠点としての役割も担っています。館内の喫茶室でひと息つきながら、ゆっくりとめぐってみてください。",
            },
          },
          {
            create: {
              name: "岡山シティミュージアム",
              address: "岡山市北区駅元町15-1",
              lat: 34.66631,
              lng: 133.9158203,
              visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
              stayDurationMin: 90,
              transitMode: "walk",
              transitDurationMin: 17,
              memo: "岡山市立オリエント美術館からは歩いて17分ほどです。岡山シティミュージアムは、岡山の歴史と今を未来へ伝えることを目指した施設で、JR岡山駅からもほど近い、リットシティビルの中にあります。考古資料や地域の歴史・美術・自然に関する資料を保存・展示するとともに、5階には岡山空襲の記録をまとめた専用の展示室が設けられています。常設展のほか、特別展・企画展もあわせて開催されており、旅の締めくくりに、岡山の歩みをじっくりとたどってみてください。",
            },
          },
        ],
        { tx }
      );
    }

    // 写真・legacy transitMode/transitDurationMinをミラーするSpotTransitLegの作成
    const allSpots = await tx.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
    for (const s of allSpots) {
      await tx.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
      if (s.transitMode && s.transitDurationMin != null) {
        await tx.spotTransitLeg.create({
          data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
        });
      }
    }
    for (const [name, url] of Object.entries(photoUrls)) {
      if (!url) continue;
      const spot = allSpots.find((s) => s.name === name);
      if (!spot) continue;
      const existing = await tx.photo.findFirst({ where: { spotId: spot.id } });
      if (existing) continue;
      const credit = creditCache.get(name);
      await tx.photo.create({
        data: {
          spotId: spot.id,
          url,
          sourceUrl: credit?.sourceUrl ?? null,
          author: credit?.author ?? null,
          license: credit?.license ?? null,
          licenseUrl: credit?.licenseUrl ?? null,
        },
      });
    }
  }, { timeout: 60000 });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

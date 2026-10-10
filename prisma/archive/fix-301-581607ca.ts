/**
 * チェックリスト #301 の修正記録。
 * しおり「酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日」
 * (581607ca-db3c-489b-8490-50733dcf918d)
 *
 * 既存はDay1が飛騨高山まちの博物館・古い町並み(さんまち)の2か所、Day2が宮川朝市
 * 1か所のみで、決まり1・2に違反。ユーザーの方針(2026-09-30、「近くに実在の行き先が
 * 足りない」は理由にしない。滞在を延ばさず、範囲を広げて実在の行き先を足す)にもとづき、
 * 実在するスポットを追加(すべて直接開いたURLで確認。座標はOSM Nominatim・国土地理院
 * アドレス検索で確認):
 *
 * Day1(6か所、09:00〜16:31): 飛騨国分寺(新規、天平13年[741]の国分寺建立の詔にもとづく
 * 創建と伝わる。Wikipedia https://ja.wikipedia.org/wiki/飛騨国分寺 で確認)→飛騨高山
 * まちの博物館(既存)→高山陣屋(新規、国指定史跡。Wikipedia
 * https://ja.wikipedia.org/wiki/高山陣屋 で確認)→中橋(新規、宮川に架かる朱色の橋。
 * Wikipedia https://ja.wikipedia.org/wiki/中橋_(宮川) で確認)→古い町並み(既存、滞在
 * 100→120分[企画運営の「2時間ほど」の目安にあわせて調整])→城山公園(新規、高山城跡。
 * Wikipedia https://ja.wikipedia.org/wiki/城山公園_(高山市) で確認。写真1件[金森長近像]
 * 取得・目視確認済み)。
 *
 * Day2(8か所、08:30〜16:32): 日枝神社(新規、保延7年[1141]創建と伝わる、春の高山祭
 * [山王祭]の舞台。Wikipedia https://ja.wikipedia.org/wiki/日枝神社_(高山市) で確認)
 * →宮川朝市(既存)→日下部民藝館(新規、重要文化財の商家。Wikipedia
 * https://ja.wikipedia.org/wiki/日下部民藝館 で確認)→吉島家住宅(新規、重要文化財の
 * 商家、もと酒造業。Wikipedia https://ja.wikipedia.org/wiki/吉島家住宅 で確認)→桜山
 * 八幡宮(新規、秋の高山祭[八幡祭]の舞台。Wikipedia https://ja.wikipedia.org/wiki/桜山八幡宮
 * で確認)→高山祭屋台会館(新規、桜山八幡宮境内、実際に使われる屋台の展示施設。国の
 * 重要無形民俗文化財。同じくWikipediaの桜山八幡宮記事で確認)→飛騨の里(新規、合掌造り
 * 民家を保存する野外博物館、高山駅からバスでアクセス。Wikipedia
 * https://ja.wikipedia.org/wiki/飛騨民俗村 で確認)→飛騨高山美術館(新規、ガラス工芸・
 * アール・ヌーヴォー専門の私立美術館。Wikipedia https://ja.wikipedia.org/wiki/飛騨高山美術館
 * で確認)。
 *
 * 写真8件取得・目視確認済み(いずれも人物なし、または小さく遠景)。飛騨高山美術館は
 * Wikipedia記事に画像がないため見送り。移動は町なかを徒歩、飛騨の里への行き来のみ
 * バス(さるぼぼバス)。itinerary-audit・prayer-check確認済み(日枝神社・飛騨国分寺に
 * 配慮の一文を追加)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-301-581607ca.ts
 * (実行済み。新スポットの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import * as fs from "fs";
import * as path from "path";

const ITIN_ID = "581607ca-db3c-489b-8490-50733dcf918d";
const cachePath = path.join(__dirname, "photo-cache.json");
const creditPath = path.join(__dirname, "photo-credit-cache.json");

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  const NEW_DESCRIPTION =
    "飛騨国分寺や高山陣屋、中橋から城山公園まで、まちなかの歴史を歩く1日目。2日目は日枝神社や日下部民藝館、桜山八幡宮から、合掌造りの飛騨の里まで足をのばします。老舗酒蔵の飲み比べや飛騨牛グルメも楽しめる、大人の高山旅です。お酒を飲めるのは20歳になってからです。車を運転する方は試飲をひかえましょう。";
  if (itin.description !== NEW_DESCRIPTION) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  }

  const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
  const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));

  const targets: [string, string][] = [
    ["飛騨国分寺", "飛騨国分寺"],
    ["高山陣屋", "高山陣屋"],
    ["中橋", "中橋 (宮川)"],
    ["城山公園", "城山公園 (高山市)"],
    ["日枝神社", "日枝神社 (高山市)"],
    ["日下部民藝館", "日下部民藝館"],
    ["吉島家住宅", "吉島家住宅"],
    ["桜山八幡宮", "桜山八幡宮"],
    ["高山祭屋台会館", "高山祭屋台会館"],
    ["飛騨の里", "飛騨民俗村"],
  ];
  const photoUrls: Record<string, string | null> = {};
  if (!day1.spots.some((s) => s.name === "城山公園")) {
    for (const [name, wikiTitle] of targets) {
      photoUrls[name] = await fetchAndUploadImage(imageCache, { name, wikiTitle } as any, "official-areas-06", creditCache);
    }
    fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
    fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
  }
  console.log("photos:", photoUrls);

  if (!day1.spots.some((s) => s.name === "城山公園")) {
    const machinohaku = day1.spots.find((s) => s.name === "飛騨高山まちの博物館")!;
    const sanmachi = day1.spots.find((s) => s.name === "古い町並み（さんまち）")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day1.id,
        [
          {
            create: {
              name: "飛騨国分寺",
              address: "高山市総和町1-83",
              lat: 36.1435011,
              lng: 137.2538422,
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
              stayDurationMin: 30,
              memo: "この旅で最初に立ち寄るのは飛騨国分寺です。天平13年(741)、聖武天皇の詔にもとづき全国に建てられた国分寺の一つで、行基によって開かれたと伝わります。幾度かの焼失・再建を経て、室町時代に本堂が再建されました。境内にそびえる三重塔は文政4年(1821)の再建で、高さは22mあまり、もとは七重塔だったと伝わります。まちなかの散策を始める前に、静かな境内で心を落ち着けてみてください。静かに、敬意をもってお参りください。",
            },
          },
          {
            id: machinohaku.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 33)),
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "飛騨国分寺からは歩いて3分ほどです。明治8年(1875)に建てられた、旧永田家の檜造りの土蔵をそのまま活用した博物館で、昭和28年(1953)開館の「高山市郷土館」を前身とし、平成23年(2011)のリニューアルを経て、今の姿になりました。14棟もの土蔵をそのまま展示室として再生しており、蔵をめぐりながら見学するという、独特の展示スタイルが特徴です。高山城主・金森氏ゆかりの資料をはじめ、一位一刀彫や春慶塗などの美術工芸品、飛騨の匠や酒造、火消組、高山祭に関する資料など、飛騨・高山の歴史と暮らしを伝える資料を数多く所蔵しています。まち歩きの前に立ち寄って、高山の歴史の予習をしてみてください。",
            },
          },
          {
            create: {
              name: "高山陣屋",
              address: "高山市八軒町1-5",
              lat: 36.1396918,
              lng: 137.2576178,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)),
              stayDurationMin: 65,
              transitMode: "walk",
              transitDurationMin: 7,
              memo: "飛騨高山まちの博物館からは歩いて7分ほどです。高山陣屋は、江戸幕府が飛騨国を直轄領として治めるために置いた代官所・郡代役所です。もとは金森氏の下屋敷でしたが、元禄5年(1692)に幕府の直轄領となって以降、代官所として使われるようになりました。明治維新のあとも県庁舎などとして使われ続け、平成8年(1996)に江戸時代の姿に復元されました。表門や役宅、蔵など、飛騨の雪深い気候にあわせた板葺きの屋根の建物が、当時の姿をとどめています。",
            },
          },
          {
            create: {
              name: "中橋",
              address: "高山市本町一丁目",
              lat: 36.1400102,
              lng: 137.2592047,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 37)),
              stayDurationMin: 10,
              transitMode: "walk",
              transitDurationMin: 2,
              memo: "高山陣屋からは歩いて2分ほどです。中橋は、宮川に架かる朱色の欄干が目を引く橋で、「赤い中橋」とも呼ばれています。高山が城下町として栄えた時代に架けられ、水害で何度か流失したのち、現在の橋は大正14年(1925)に再建され、昭和40年(1965)に今の朱色の姿になりました。桜や柳の木が並ぶ橋のたもとは、飛騨高山観光のシンボルとして親しまれ、春の高山祭(山王祭)では、獅子舞を伴った神楽台がこの橋を渡る「橋渡し」が祭りの見どころの一つとされています。",
            },
          },
          {
            id: sanmachi.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 49)),
              stayDurationMin: 120,
              transitMode: "walk",
              transitDurationMin: 2,
            },
          },
          {
            create: {
              name: "城山公園",
              address: "高山市城山",
              lat: 36.1373944,
              lng: 137.2642583,
              visitTime: new Date(Date.UTC(1970, 0, 1, 13, 56)),
              stayDurationMin: 155,
              transitMode: "walk",
              transitDurationMin: 7,
              memo: "古い町並みからは歩いて7分ほどです。城山公園は、高山城の跡地に整備された、高山市内でもっとも大きな公園です。天正16年(1588)、飛騨国の領主となった金森長近が築城に着手し、およそ16年をかけて高山城を完成させました。元禄8年(1695)、幕府の命により城は取り壊されましたが、明治6年(1873)に城跡が公園として整備され、今に至ります。園内には曲輪や堀、石垣などの遺構が残るほか、築城主・金森長近の騎馬像が立ち、高山の市街を見渡す高台からの眺めも楽しめます。ソメイヨシノおよそ1000本が植えられた桜の名所としても知られています。",
            },
          },
        ],
        { tx }
      );

      const spots1 = await tx.spot.findMany({ where: { dayId: day1.id } });
      for (const name of ["飛騨国分寺", "高山陣屋", "中橋", "城山公園"]) {
        const url = photoUrls[name];
        if (!url) continue;
        const spot = spots1.find((s) => s.name === name);
        if (!spot) continue;
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
  }

  if (!day2.spots.some((s) => s.name === "飛騨の里")) {
    const asaichi = day2.spots.find((s) => s.name === "宮川朝市")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day2.id,
        [
          {
            create: {
              name: "日枝神社",
              address: "高山市城山156",
              lat: 36.132834,
              lng: 137.2610846,
              visitTime: new Date(Date.UTC(1970, 0, 1, 8, 30)),
              stayDurationMin: 25,
              memo: "この旅で最初に立ち寄るのは日枝神社です。保延7年(1141)、飛騨国司・平時輔が、近江国(滋賀県)の日吉神社の神を迎えて創建したと伝わります。慶長10年(1605)、金森長近が高山城を築いた際に現在の場所へ移され、城の鎮護神となりました。明治2年(1869)の神仏分離で、今の日枝神社という名前になり、昭和13年(1938)に本殿が再建されました。春に行われるこの神社の例祭「山王祭」は、秋の桜山八幡宮の例祭とあわせて「高山祭」と呼ばれています。静かに、敬意をもってお参りください。",
            },
          },
          {
            id: asaichi.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 9, 12)),
              transitMode: "walk",
              transitDurationMin: 17,
            },
          },
          {
            create: {
              name: "日下部民藝館",
              address: "高山市大新町1-52",
              lat: 36.146435,
              lng: 137.258459,
              visitTime: new Date(Date.UTC(1970, 0, 1, 10, 5)),
              stayDurationMin: 55,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "宮川朝市からは歩いて3分ほどです。日下部民藝館は、代々飛騨代官所の御用商人を務めた日下部家の住宅を活用した施設です。11代目当主・日下部禮一が、柳宗悦の提唱した民藝運動に共感して設立し、昭和41年(1966)に開館しました。主屋は明治12年(1879)、棟梁・川尻治助によって建てられたもので、主屋と2棟の土蔵からなり、国の重要文化財に指定されています。太い梁を組み上げた吹き抜けの土間など、飛騨の匠の技が随所に見られます。",
            },
          },
          {
            create: {
              name: "吉島家住宅",
              address: "高山市大新町1-51",
              lat: 36.1466403,
              lng: 137.2584333,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 1)),
              stayDurationMin: 45,
              transitMode: "walk",
              transitDurationMin: 1,
              memo: "日下部民藝館のすぐ隣です。吉島家住宅は、酒造業を営んでいた豪商・吉島家の住宅です。明治8年(1875)の大火のあとに建てられましたが、明治38年(1905)に再び火災に見舞われ、吉島家4代目によって再建されました。間口・奥行きともおよそ26mあり、土間や台所部分が屋根まで吹き抜けになった構造に、梁と束を格子状に組み合わせた意匠が見られます。本座敷は書院造、茶室は数寄屋造りで、日下部民藝館とともに国の重要文化財に指定されています。",
            },
          },
          {
            create: {
              name: "桜山八幡宮",
              address: "高山市桜町178",
              lat: 36.1482581,
              lng: 137.2605415,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 49)),
              stayDurationMin: 30,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "吉島家住宅からは歩いて3分ほどです。桜山八幡宮は、飛騨に現れた宿儺という賊を討伐した武将が応神天皇をまつったのが始まりと伝わる神社です。江戸時代には、領主となった金森氏が氏神として保護し、地域の信仰を集めました。秋に行われるこの神社の例祭「八幡祭」は、春の日枝神社の例祭(山王祭)とあわせて「高山祭」と呼ばれ、屋台行事は国の重要無形民俗文化財に指定されています。静かに、敬意をもってお参りください。",
            },
          },
          {
            create: {
              name: "高山祭屋台会館",
              address: "高山市桜町178",
              lat: 36.1485,
              lng: 137.2607,
              visitTime: new Date(Date.UTC(1970, 0, 1, 12, 20)),
              stayDurationMin: 55,
              transitMode: "walk",
              transitDurationMin: 1,
              memo: "桜山八幡宮の境内すぐです。高山祭屋台会館は、春と秋の高山祭で実際に曳かれる屋台を、年間を通して展示する施設です。展示される屋台は定期的に入れ替えられ、訪れるたびに違う屋台に出会えます。彫刻や幕、金具など、匠の技が結集した屋台の豪華な装飾を間近で見られるのが魅力です。高山祭の屋台行事は、国の重要無形民俗文化財に指定されています。",
            },
          },
          {
            create: {
              name: "飛騨の里",
              address: "高山市上岡本町1-590",
              lat: 36.1314919,
              lng: 137.2357015,
              visitTime: new Date(Date.UTC(1970, 0, 1, 13, 45)),
              stayDurationMin: 90,
              transitMode: "bus",
              transitDurationMin: 30,
              memo: "高山祭屋台会館からは、さるぼぼバスで30分ほどです。飛騨の里(飛騨民俗村)は、昭和30年代、御母衣ダムの建設で水没することになった合掌造り民家を保存するために開かれた野外博物館です。昭和34年(1959)に「飛騨民俗館」として開館し、昭和46年(1971)に「飛騨の里」が加わりました。敷地内にはおよそ30棟の民家が移築保存されており、4棟が国の重要文化財、7棟が岐阜県指定重要文化財に指定されています。養蚕や林業で使われた飛騨の暮らしの道具も数多く展示され、工芸集落では伝統工芸の実演や体験も行われています。",
            },
          },
          {
            create: {
              name: "飛騨高山美術館",
              address: "高山市上岡本町1-124-1",
              lat: 36.136749,
              lng: 137.240707,
              visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)),
              stayDurationMin: 70,
              transitMode: "walk",
              transitDurationMin: 10,
              memo: "飛騨の里からは歩いて10分ほどです。飛騨高山美術館は、16世紀から20世紀にかけてヨーロッパで作られたガラス工芸品と、アール・ヌーヴォーやアール・デコの時代の家具・照明器具を集めた美術館です。平成9年(1997)に開設された前身の美術館が令和2年(2020)に閉館したのち、収蔵品を引き継ぐ形で、令和6年(2024)にリニューアルオープンしました。エミール・ガレやルネ・ラリックといった、アール・ヌーヴォーを代表する作家たちの作品も収蔵されています。",
            },
          },
        ],
        { tx }
      );

      const spots2 = await tx.spot.findMany({ where: { dayId: day2.id } });
      for (const name of ["日枝神社", "日下部民藝館", "吉島家住宅", "桜山八幡宮", "高山祭屋台会館", "飛騨の里"]) {
        const url = photoUrls[name];
        if (!url) continue;
        const spot = spots2.find((s) => s.name === name);
        if (!spot) continue;
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
  }

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

/**
 * チェックリスト #301 の修正記録(2巡目、企画運営の指摘3点)。
 * しおり「酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日」
 * (581607ca-db3c-489b-8490-50733dcf918d)
 *
 * 1. 決まりA: 城山公園の155分は水増しのため50分に短縮。空いた時間は実在の行き先で
 *    埋めた: 高山市政記念館(新規、Day1、高山陣屋のすぐそば。明治28年[1895]〜昭和43年
 *    [1968]の旧高山町役場を活用。公式 https://www.city.takayama.lg.jp/shisetsu/1004141/1004142/1004248.html
 *    で現在も開館していることを確認。写真1件取得・目視確認済み)、東山遊歩道(新規、
 *    Day1、金森長近が築いた「東山寺町」を巡る散策路。岐阜の旅ガイド公式
 *    https://www.kankou-gifu.jp/spot/detail_1224.html で確認。素玄寺は拝観の可否が
 *    確認できなかったため、本堂には入らず門前を歩く散策として記述。写真1件[素玄寺
 *    山門]取得・目視確認済み)。
 *
 * 2. Day2に昼食がなかったため、高山祭屋台会館のあと、まちなかに戻って昼食をとる
 *    時間を追加(店名・価格なし)。午前の滞在(日下部民藝館・吉島家住宅・桜山八幡宮)を
 *    少し短縮して調整し、17時を超えないようにした。
 *
 * 3. 「飛騨高山美術館」の表記を、現在の運営館の公式表記「飛驒高山美術館」
 *    (https://htma.rtg.jp/) にあわせて修正。
 *
 * Day1は8か所09:00〜16:32、Day2は8か所08:30〜16:50、いずれも窓内。
 * itinerary-audit.cjs・prayer-check.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-301b-581607ca.ts
 * (実行済み。新スポットの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
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

  const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
  const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));

  const photoUrls: Record<string, string | null> = {};
  if (!day1.spots.some((s) => s.name === "高山市政記念館")) {
    photoUrls["高山市政記念館"] = await fetchAndUploadImage(
      imageCache,
      { name: "高山市政記念館", wikiTitle: "高山市政記念館" } as any,
      "official-areas-06",
      creditCache
    );
    photoUrls["東山遊歩道"] = await fetchAndUploadImage(
      imageCache,
      { name: "東山遊歩道", wikiTitle: "素玄寺" } as any,
      "official-areas-06",
      creditCache
    );
    fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
    fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
  }
  console.log("photos:", photoUrls);

  // 1) Day1: 城山公園を短縮し、高山市政記念館・東山遊歩道を追加
  if (!day1.spots.some((s) => s.name === "高山市政記念館")) {
    const kokubunji = day1.spots.find((s) => s.name === "飛騨国分寺")!;
    const machinohaku = day1.spots.find((s) => s.name === "飛騨高山まちの博物館")!;
    const jinya = day1.spots.find((s) => s.name === "高山陣屋")!;
    const nakabashi = day1.spots.find((s) => s.name === "中橋")!;
    const sanmachi = day1.spots.find((s) => s.name === "古い町並み（さんまち）")!;
    const shiroyama = day1.spots.find((s) => s.name === "城山公園")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day1.id,
        [
          { id: kokubunji.id, data: {} },
          { id: machinohaku.id, data: {} },
          { id: jinya.id, data: {} },
          {
            create: {
              name: "高山市政記念館",
              address: "高山市神明町4-15",
              lat: 36.139832,
              lng: 137.259872,
              visitTime: new Date(Date.UTC(1970, 0, 1, 11, 38)),
              stayDurationMin: 30,
              transitMode: "walk",
              transitDurationMin: 3,
              memo: "高山陣屋からは歩いて3分ほどです。高山市政記念館は、明治28年(1895)から昭和43年(1968)まで、高山町役場(のち市役所)として使われていた建物を活用した資料館です。棟梁・坂下甚吉の手による、南北二つの土蔵からなる和洋折衷の2階建てで、高山で最初にガラス窓(硝子障子)を取り入れた建物と伝わります。明治から平成の合併にいたるまでの高山のあゆみを、行政資料とともに紹介しています。",
            },
          },
          {
            id: nakabashi.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 9)), transitDurationMin: 1 },
          },
          {
            id: sanmachi.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 21)), transitDurationMin: 2 },
          },
          {
            id: shiroyama.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 14, 28)),
              stayDurationMin: 50,
              transitDurationMin: 7,
            },
          },
          {
            create: {
              name: "東山遊歩道",
              address: "高山市天性寺町",
              lat: 36.143874,
              lng: 137.2653528,
              visitTime: new Date(Date.UTC(1970, 0, 1, 15, 27)),
              stayDurationMin: 65,
              transitMode: "walk",
              transitDurationMin: 9,
              memo: "城山公園からは歩いて9分ほどです。東山遊歩道は、戦国武将・金森長近が、京都の東山になぞらえて築いた「東山寺町」を巡る、およそ4kmの散策路です。天正年間、長近は町の東側の高台に寺院を集め、信仰の拠点であると同時に、城下を守る備えともしました。今も十数か寺が軒を連ね、四季折々の風情を楽しめます。長近の菩提寺である素玄寺の本堂は、高山城の遺構を伝える貴重な建物と伝わり、雲龍寺の鐘楼門も、城の解体時に移築されたものです。寺の建物や庭園は、それぞれの行事にあわせて公開日が異なるため、今回は山門など、静かな門前をたどる散策としてお楽しみください。",
            },
          },
        ],
        { tx }
      );

      const spots1 = await tx.spot.findMany({ where: { dayId: day1.id } });
      for (const name of ["高山市政記念館", "東山遊歩道"]) {
        const url = photoUrls[name];
        if (!url) continue;
        const spot = spots1.find((s) => s.name === name);
        if (!spot) continue;
        const credit = creditCache.get(name === "東山遊歩道" ? "東山遊歩道" : name);
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

  // 2) Day2: 昼食の時間を追加、午前の滞在を少し短縮
  const day2fresh = await prisma.spot.findMany({ where: { dayId: day2.id }, orderBy: { orderNo: "asc" } });
  const kusakabe = day2fresh.find((s) => s.name === "日下部民藝館")!;
  const yoshijima = day2fresh.find((s) => s.name === "吉島家住宅")!;
  const hachimangu = day2fresh.find((s) => s.name === "桜山八幡宮")!;
  const yataikaikan = day2fresh.find((s) => s.name === "高山祭屋台会館")!;
  const satoyama = day2fresh.find((s) => s.name === "飛騨の里")!;
  const bijutsukanOld = day2fresh.find((s) => s.name === "飛騨高山美術館" || s.name === "飛驒高山美術館")!;

  if (kusakabe.stayDurationMin === 55) {
    await prisma.spot.update({ where: { id: kusakabe.id }, data: { stayDurationMin: 50 } });
    await prisma.spot.update({
      where: { id: yoshijima.id },
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 56)), stayDurationMin: 40 },
    });
    await prisma.spot.update({
      where: { id: hachimangu.id },
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 39)), stayDurationMin: 25 },
    });
    await prisma.spot.update({
      where: { id: yataikaikan.id },
      data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 5)), stayDurationMin: 55 },
    });
    await prisma.spot.update({
      where: { id: satoyama.id },
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
        stayDurationMin: 80,
        transitDurationMin: 80,
        memo: "高山祭屋台会館からは、まちなかに戻って昼食をとったのち、さるぼぼバスで25分ほどです。飛騨の里(飛騨民俗村)は、昭和30年代、御母衣ダムの建設で水没することになった合掌造り民家を保存するために開かれた野外博物館です。昭和34年(1959)に「飛騨民俗館」として開館し、昭和46年(1971)に「飛騨の里」が加わりました。敷地内にはおよそ30棟の民家が移築保存されており、4棟が国の重要文化財、7棟が岐阜県指定重要文化財に指定されています。養蚕や林業で使われた飛騨の暮らしの道具も数多く展示され、工芸集落では伝統工芸の実演や体験も行われています。",
      },
    });
    await prisma.spot.update({
      where: { id: bijutsukanOld.id },
      data: {
        name: "飛驒高山美術館",
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)),
        stayDurationMin: 60,
        memo: "飛騨の里からは歩いて10分ほどです。飛驒高山美術館は、16世紀から20世紀にかけてヨーロッパで作られたガラス工芸品と、アール・ヌーヴォーやアール・デコの時代の家具・照明器具を集めた美術館です。平成9年(1997)に開設された前身の美術館が令和2年(2020)に閉館したのち、収蔵品を引き継ぐ形で、令和6年(2024)にリニューアルオープンしました。エミール・ガレやルネ・ラリックといった、アール・ヌーヴォーを代表する作家たちの作品も収蔵されています。",
      },
    });
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

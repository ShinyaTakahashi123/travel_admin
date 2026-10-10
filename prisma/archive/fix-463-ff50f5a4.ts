/**
 * #463 ff50f5a4（吉祥寺 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 10:00〜13:00（武蔵野八幡宮 → サンロード → ハモニカ横丁）で、本文はガイドの語り口だった
 *   八幡宮からサンロードを駅へ向かって歩き、商店街と横丁で食べ歩き・昼食。午後は井の頭恩賜公園を通って三鷹へ抜ける（戻らない）
 *   武蔵野八幡宮 9:10〜9:40 →（歩き5分）吉祥寺サンロード商店街 9:45〜10:25 →（歩き5分）武蔵野市立吉祥寺美術館（新規）10:30〜11:15 →（歩き5分）ハモニカ横丁（昼食）11:20〜12:30
 *   →（歩き10分）井の頭恩賜公園（新規）12:40〜13:40 →（歩き10分）井の頭自然文化園（新規）13:50〜15:00 →（歩き10分）三鷹市山本有三記念館（新規）15:10〜16:00 →（歩き10分）太宰治文学サロン（新規）16:10〜16:40
 *   閉まる時刻: 吉祥寺美術館 10:00〜19:30（毎月最終水曜休館）、自然文化園 9:30〜17:00（入園16:00まで・月曜休園）、山本有三記念館 9:30〜17:00（月曜休館）、太宰治文学サロン 10:00〜17:30（月曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: 武蔵野市観光機構 https://musashino-kanko.com/area/kichijouji/hachiman_shrine/ ・/area/kichijouji/harmonica_street/ 、サンロード https://sun-road.or.jp/history/ 、GO TOKYO https://www.gotokyo.org/jp/spot/165/index.html （ハモニカ横丁）、
 *   吉祥寺美術館 https://www.musashino.or.jp/museum/ 、東京都建設局 https://www.kensetsu.metro.tokyo.lg.jp/jimusho/seibuk/inokashira/kouenannai 、東京ズーネット https://www.tokyo-zoo.net/zoo/ino/ 、
 *   三鷹市スポーツと文化財団 https://www.mitaka-sportsandculture.or.jp/yuzo/info/ ・ https://mitaka-sportsandculture.or.jp/dazai/info/
 * 座標の出典: OSM（武蔵野八幡宮 way 41293320／吉祥寺サンロード node 10685091805／武蔵野市立吉祥寺美術館 node 1420786887／ハーモニカ横丁 way 145129803／井の頭恩賜公園は園内の七井橋 way 31877607／
 *   井の頭自然文化園 way 153789019／山本有三記念館 way 735010164）、太宰治文学サロンは OSM に点がないので地理院の住所検索（下連雀三丁目16番14号）35.700108,139.562317
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-463-ff50f5a4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ff50f5a4-5a1c-44a6-b160-bed25b4f7863";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "吉祥寺の鎮守・武蔵野八幡宮から、サンロード商店街と戦後の闇市に始まるハモニカ横丁で食べ歩き。午後は井の頭恩賜公園と井の頭自然文化園を通り、山本有三記念館と太宰治文学サロンのある三鷹へ抜ける、商店街と文学の日帰りさんぽプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["武蔵野八幡宮", "吉祥寺サンロード商店街", "ハモニカ横丁"].join()) throw new Error("構成が想定と違います");
  const [hachiman, sunroad, harmonica] = day.spots;

  const order = [
    { id: hachiman.id, data: { visitTime: t(9, 10), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.707635, lng: 139.579994, address: "東京都武蔵野市吉祥寺東町1-1-23",
      memo: "この旅は歩きでめぐります。JR・京王井の頭線の吉祥寺駅から歩いて約7分の武蔵野八幡宮へ。789年に坂上田村麻呂が宇佐八幡の御分霊をまつったと伝えられる神社で、明暦の大火のあと、焼け出された人々が移り住んで吉祥寺村が開かれたときに、村の鎮守となりました。応神天皇をまつり、境内には大國様もまつられています。約1300坪の境内にはケヤキやクスノキの大木が立ち、繁華街のそばとは思えない静けさです。" + RESPECT } },
    { id: sunroad.id, data: { visitTime: t(9, 45), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.704843, lng: 139.580385, address: "東京都武蔵野市吉祥寺本町1丁目",
      memo: "八幡宮から、吉祥寺駅の北口へのびるアーケードの商店街、吉祥寺サンロード商店街へ。昭和46年（1971年）にアーケードの工事が始まり、名前を公募して「サンロード」に決まりました。今のアーケードは平成16年（2004年）に完成したものです。駅へ向かって歩きながら、食べ歩きを楽しみましょう。お店の開く時間はそれぞれなので、前もって確かめましょう。" } },
    { create: mk({ name: "武蔵野市立吉祥寺美術館", h: 10, m: 30, stay: 45, mode: "walk", min: 5, lat: 35.704819, lng: 139.579145, address: "東京都武蔵野市吉祥寺本町1丁目8-16",
      memo: "サンロードから歩いてすぐの、コピス吉祥寺A館7階にある武蔵野市立吉祥寺美術館へ。常設展示室の「浜口陽三記念室」と「萩原英雄記念室」では、二人の版画家の作品を、テーマを変えながら紹介しています。休館日は公式の案内で確かめましょう。" }) },
    { id: harmonica.id, data: { visitTime: t(11, 20), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.703754, lng: 139.579323, address: "東京都武蔵野市吉祥寺本町1丁目",
      memo: "美術館から、吉祥寺駅北口の前のハモニカ横丁へ。昭和20年（1945年）に駅前にできたマーケット、いわゆる戦後の「闇市」がルーツの横丁で、狭い間口の店が並ぶ様子がハーモニカの吹き口に似ていることが名前の由来です。約100軒の店が並び、昼は魚屋や花屋、和菓子の店などが開き、夜は飲食店や居酒屋でにぎわいます。このあたりで昼食にしましょう。" } },
    { create: mk({ name: "井の頭恩賜公園", h: 12, m: 40, stay: 60, mode: "walk", min: 10, lat: 35.699921, lng: 139.57733, address: "東京都武蔵野市・三鷹市",
      memo: "吉祥寺駅の南口から歩いて、井の頭恩賜公園へ。大正6年（1917年）に、日本で最初の郊外公園として開園したとされる公園です。井の頭池は江戸時代に江戸の水源として知られ、歌川広重の浮世絵にも描かれました。約2万本の木々に囲まれた池のまわりを、七井橋を渡りながら散策しましょう。池のそばでは足元に気をつけましょう。" }) },
    { create: mk({ name: "井の頭自然文化園", h: 13, m: 50, stay: 70, mode: "walk", min: 10, lat: 35.700695, lng: 139.571187, address: "東京都武蔵野市御殿山1丁目17-6",
      memo: "池のまわりから、井の頭自然文化園へ。動物園と、池のほとりの水生物園からなる施設で、ニホンリスや、絶滅が心配されるツシマヤマネコなど、日本の動物たちに出会えます。園内には、彫刻家・北村西望の作品を集めた彫刻園もあります。休園日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "三鷹市山本有三記念館", h: 15, m: 10, stay: 50, mode: "walk", min: 10, lat: 35.699568, lng: 139.567653, address: "東京都三鷹市下連雀2-12-27",
      memo: "自然文化園から、玉川上水沿いの道を歩いて三鷹市山本有三記念館へ。作家・山本有三が1936年（昭和11年）から1946年（昭和21年）まで家族とともに住んだ家で、有三はここで代表作『路傍の石』や戯曲『米百俵』を書きました。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "太宰治文学サロン", h: 16, m: 10, stay: 30, mode: "walk", min: 10, lat: 35.700108, lng: 139.562317, address: "東京都三鷹市下連雀3-16-14",
      memo: "山本有三記念館から、三鷹駅の方へ歩いて太宰治文学サロンへ。太宰治が通い、作品「十二月八日」にも登場する伊勢元酒店の跡地に、平成20年（2008年）に開かれた施設で、太宰の研究の資料なども紹介しています。休館日は公式の案内で確かめましょう。吉祥寺の商店街から三鷹の文学の町まで歩く旅を、ここで締めくくりましょう。帰りは、JR三鷹駅まで歩いて向かいます。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 八幡宮 9:10 → サンロード 9:45 → 吉祥寺美術館 10:30 → ハモニカ横丁（昼食）11:20 → 井の頭恩賜公園 12:40 → 自然文化園 13:50 → 山本有三記念館 15:10 → 太宰治文学サロン 16:10〜16:40");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

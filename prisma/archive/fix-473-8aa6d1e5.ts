/**
 * #473 8aa6d1e5（吉祥寺・三鷹 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * もとは 1日目 5か所 09:00〜13:54、2日目 5か所 09:00〜14:51 で、本文は一行だけ。昼食・宿・帰りの一言、配慮の一文、駅からの行き方がなく、座標もずれていた
 *   #463（吉祥寺→三鷹 日帰り）と行き先が重なるので、この旅では「自然」を深大寺・神代植物公園、「文学」を禅林寺まで広げ、2日目の終わりに国立天文台を足す。本文は #463 と言い回しを変えて書く
 *   1日目: 武蔵野八幡宮 9:10〜9:40 →（歩き5分）サンロード 9:45〜10:25 →（歩き5分）ハモニカ横丁 10:30〜11:05 →（歩き10分）井の頭恩賜公園（昼食）11:15〜12:30
 *     →（歩き10分）井の頭自然文化園 12:40〜13:50 →（歩きと小田急バス45分）深大寺（新規）14:35〜15:25 →（歩き5分）神代植物公園（新規）15:30〜16:30。バスで吉祥寺へ戻って泊まる
 *   2日目: 山本有三記念館 9:30〜10:15 →（歩き5分）玉川上水緑道 10:20〜10:50 →（歩き5分）太宰治文学サロン 10:55〜11:25 →（歩き10分）禅林寺（昼食）11:35〜12:40
 *     →（歩き20分）三鷹の森ジブリ美術館 13:00〜14:30 →（歩きとバス45分）国立天文台 三鷹キャンパス（新規）15:15〜16:30
 *   閉まる時刻: 自然文化園 9:30〜17:00（入園16:00まで・月曜休園）、神代植物公園 9:30〜17:00（入園16:00まで・月曜休園）、山本有三記念館 9:30〜17:00（月曜休館）、太宰治文学サロン 10:00〜17:30（月曜休館）、
 *   ジブリ美術館 10:00〜18:00（日時指定の予約制・火曜休館）、国立天文台 10:00〜17:00（入場16:30まで）。本文に時刻・曜日は書かない
 *   ジブリ美術館は予約した入場時刻（13時）に合わせ、見学に90分とる
 * 本文の出典: 武蔵野市観光機構 https://musashino-kanko.com/area/kichijouji/hachiman_shrine/ ・/area/kichijouji/harmonica_street/ 、サンロード https://sun-road.or.jp/history/ 、
 *   東京都建設局 https://www.kensetsu.metro.tokyo.lg.jp/jimusho/seibuk/inokashira/kouenannai 、東京ズーネット https://www.tokyo-zoo.net/zoo/ino/ 、深大寺 https://www.jindaiji.or.jp/ 、
 *   東京都公園協会 https://www.tokyo-park.or.jp/park/jindai/index.html 、三鷹市スポーツと文化財団 https://www.mitaka-sportsandculture.or.jp/yuzo/info/ ・ https://mitaka-sportsandculture.or.jp/dazai/info/ 、
 *   禅林寺 http://www.zenrinji.jp/about/ 、みたかナビ https://mitakanavi.com/photo/temple/zenrinji/ 、三鷹市 https://www.city.mitaka.lg.jp/c_service/001/001559.html （ジブリ美術館）、
 *   国立天文台 https://www.nao.ac.jp/about-naoj/organization/facilities/mitaka/visit.html
 * 座標の出典: OSM（武蔵野八幡宮 way 41293320／吉祥寺サンロード node 10685091805／ハーモニカ横丁 way 145129803／井の頭恩賜公園は七井橋 way 31877607／井の頭自然文化園 way 153789019／深大寺 way 390563847／
 *   神代植物公園 relation 20434696／山本有三記念館 way 735010164／玉川上水緑道の案内図 node 9388262076／禅林寺 node 831194625／三鷹の森ジブリ美術館 way 1558848181／国立天文台は第一赤道儀室 way 187943395）、
 *   太宰治文学サロンは地理院の住所検索（下連雀三丁目16番14号）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-473-8aa6d1e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8aa6d1e5-c110-4e37-b4fa-916fc19c8417";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "1日目は武蔵野八幡宮から吉祥寺の商店街と横丁を歩き、井の頭恩賜公園と井の頭自然文化園へ。午後はバスで深大寺と神代植物公園の緑の中へ。2日目は玉川上水沿いに山本有三記念館、太宰治文学サロン、森鴎外と太宰治の墓がある禅林寺をたずね、三鷹の森ジブリ美術館と国立天文台で締めくくる、自然と文学の1泊2日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });
const upd = (h: number, m: number, stay: number, mode: string | null, min: number | null, lat: number, lng: number, address: string, memo: string, line: string | null = null) =>
  ({ visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: min, transitLine: line, lat, lng, address, memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 2) throw new Error("日数が想定と違います");
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.name).join() !== ["武蔵野八幡宮", "吉祥寺サンロード商店街", "ハモニカ横丁", "井の頭自然文化園", "井の頭恩賜公園"].join()) throw new Error("1日目が想定と違います");
  if (d2.spots.map((s) => s.name).join() !== ["山本有三記念館", "玉川上水緑道", "太宰治文学サロン", "禅林寺（太宰治の墓）", "三鷹の森ジブリ美術館"].join()) throw new Error("2日目が想定と違います");
  const [hachiman, sunroad, harmonica, zoo, park] = d1.spots;
  const [yuzo, josui, dazai, zenrinji, ghibli] = d2.spots;

  const day1 = [
    { id: hachiman.id, data: upd(9, 10, 30, null, null, 35.707635, 139.579994, "東京都武蔵野市吉祥寺東町1-1-23",
      "この旅は歩きとバスでめぐります。JR・京王井の頭線の吉祥寺駅から歩いて約7分の武蔵野八幡宮へ。吉祥寺村が開かれたときから村の鎮守とされてきた神社で、約1300坪の境内にはケヤキやクスノキの大木が立ち並びます。" + RESPECT) },
    { id: sunroad.id, data: upd(9, 45, 40, "walk", 5, 35.704843, 139.580385, "東京都武蔵野市吉祥寺本町1丁目",
      "八幡宮から南へ、吉祥寺駅の北口まで続くアーケードの吉祥寺サンロード商店街を歩きます。1971年に、名前を公募して「サンロード」と名づけられた商店街です。お店の開く時間はそれぞれ違うので、ぶらりと歩いてみましょう。") },
    { id: harmonica.id, data: upd(10, 30, 35, "walk", 5, 35.703754, 139.579323, "東京都武蔵野市吉祥寺本町1丁目",
      "サンロードの南の端、駅前のハモニカ横丁へ。狭い路地に小さな店がすき間なく並ぶ一角で、約100軒の店が軒を連ねます。昼は魚屋や花屋、菓子の店が開き、夜は飲食店や居酒屋でにぎわいます。") },
    { id: park.id, data: upd(11, 15, 75, "walk", 10, 35.699921, 139.57733, "東京都武蔵野市・三鷹市",
      "駅の南口から歩いて、井の頭恩賜公園へ。大正6年（1917年）に開園した公園で、約2万本の木々に囲まれた井の頭池は、江戸時代には江戸の水源として知られていました。池のまわりの散策を楽しみ、このあたりで昼食にしましょう。池のそばでは足元に気をつけましょう。") },
    { id: zoo.id, data: upd(12, 40, 70, "walk", 10, 35.700695, 139.571187, "東京都武蔵野市御殿山1丁目17-6",
      "公園の西の、井の頭自然文化園へ。動物園と水生物園に分かれた施設で、ニホンリスやツシマヤマネコなど、日本の動物を中心に出会えます。休園日は公式の案内で確かめましょう。") },
    { create: mk({ name: "深大寺", h: 14, m: 35, stay: 50, mode: "bus", min: 45, line: "小田急バス", lat: 35.667461, lng: 139.550276, address: "東京都調布市深大寺元町",
      memo: "吉祥寺駅の南口へ戻り、小田急バスの深大寺行きで約30分の深大寺へ。天平5年（733年）に開かれた、東京では浅草寺に次ぐ古刹とされる寺で、国宝の釈迦如来倚像を伝えています。" + RESPECT }) },
    { create: mk({ name: "神代植物公園", h: 15, m: 30, stay: 60, mode: "walk", min: 5, lat: 35.669906, lng: 139.547959, address: "東京都調布市深大寺元町5-31-10",
      memo: "深大寺のとなりの都立神代植物公園へ。約4,800種類、10万本の植物が育つ、都内でただひとつの植物公園とされます。バラ園や大温室、武蔵野の面影を残す雑木林を歩けます。入園できる時間と休園日は公式の案内で確かめましょう。今夜は、バスで吉祥寺へ戻って泊まります。" }) },
  ];
  const day2 = [
    { id: yuzo.id, data: { name: "三鷹市山本有三記念館", ...upd(9, 30, 45, null, null, 35.699568, 139.567653, "東京都三鷹市下連雀2-12-27",
      "旅の2日目は、玉川上水沿いの三鷹市山本有三記念館へ。作家・山本有三が昭和11年から昭和21年まで家族とともに住んだ家で、有三はここで『路傍の石』や戯曲『米百俵』を書きました。休館日は公式の案内で確かめましょう。") } },
    { id: josui.id, data: upd(10, 20, 30, "walk", 5, 35.702452, 139.561415, "東京都三鷹市下連雀3丁目",
      "記念館から、玉川上水に沿った緑の多い遊歩道を、三鷹駅の方へ歩きます。水路のそばでは足元に気をつけましょう。") },
    { id: dazai.id, data: upd(10, 55, 30, "walk", 5, 35.700108, 139.562317, "東京都三鷹市下連雀3-16-14",
      "緑道から歩いてすぐの太宰治文学サロンへ。太宰治が通い、作品「十二月八日」にも出てくる伊勢元酒店の跡に、平成20年（2008年）に開かれた施設で、太宰の研究の資料などを紹介しています。休館日は公式の案内で確かめましょう。") },
    { id: zenrinji.id, data: { name: "禅林寺", ...upd(11, 35, 65, "walk", 10, 35.694355, 139.559901, "東京都三鷹市下連雀4-18-20",
      "サロンから南へ歩いて、黄檗宗の禅林寺へ。元禄13年に今の寺の名前になり、昭和5年に開かれた三鷹駅は、禅林寺が寄付した土地も使って作られました。境内の墓地には、森鴎外（森林太郎）と太宰治の墓があり、どちらも三鷹市の文化財です。墓所のまわりでは静かに見学しましょう。" + RESPECT + "このあたりで昼食にしましょう。") } },
    { id: ghibli.id, data: upd(13, 0, 90, "walk", 20, 35.696252, 139.570451, "東京都三鷹市下連雀1丁目1-83",
      "禅林寺から歩いて、井の頭恩賜公園の中の三鷹の森ジブリ美術館へ。三鷹市立アニメーション美術館として平成13年（2001年）に開かれた、スタジオジブリの作品の世界を体験できる美術館です。入場は日時指定の予約制で、美術館の窓口ではチケットを売っていないので、前もって予約しましょう。休館日は公式の案内で確かめましょう。") },
    { create: mk({ name: "国立天文台 三鷹キャンパス", h: 15, m: 15, stay: 75, mode: "bus", min: 45, line: "路線バス", lat: 35.674268, lng: 139.538553, address: "東京都三鷹市大沢2-21-1",
      memo: "三鷹駅へ歩いて戻り、バスで天文台前へ。国立天文台の三鷹キャンパスは、見学コースを無料で歩けて、正門の守衛所で受付をします。第一赤道儀室などの観測施設の建物を見られます。見学できない日は公式の案内で確かめましょう。自然と文学の街をめぐる旅を、ここで締めくくりましょう。帰りは、天文台前からバスで三鷹駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 八幡宮 9:10 → サンロード 9:45 → ハモニカ 10:30 → 井の頭公園（昼食）11:15 → 自然文化園 12:40 →（バス）深大寺 14:35 → 神代植物公園 15:30〜16:30（宿）");
  console.log("2日目: 有三記念館 9:30 → 玉川上水 10:20 → 太宰サロン 10:55 → 禅林寺（昼食）11:35 → ジブリ 13:00 →（バス）国立天文台 15:15〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(d1.id, day1 as any, { tx });
    await setDaySpotOrder(d2.id, day2 as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

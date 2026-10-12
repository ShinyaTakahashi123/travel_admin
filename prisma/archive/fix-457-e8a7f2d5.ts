/**
 * #457 e8a7f2d5（福井市内 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜11:20（福井城址 → 養浩館庭園）。城下の北から南へ歩き、足羽山で締めくくる（戻らない）
 *   福井城址 9:10〜9:50 →（歩き5分）福井神社（新規）9:55〜10:15 →（歩き10分）養浩館庭園 10:25〜11:30 →（歩き20分）柴田神社（北庄城址・新規・昼食）11:50〜13:05
 *   →（歩き20分）愛宕坂茶道美術館（新規）13:25〜14:15 →（愛宕坂を上って15分）足羽神社（新規）14:30〜15:05 →（歩き10分）足羽山公園（新規）15:15〜16:30
 *   閉まる時刻: 養浩館庭園 9:00〜19:00（11/6〜2月末は17:00）、北の庄城址資料館 9:00〜17:00、愛宕坂茶道美術館 9:00〜17:15（入館16:45まで）、足羽神社 9:00〜17:00。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉だったので、開いたページの事実だけで書き直す
 * 本文の出典: 福いろ（福井市公式観光サイト）https://fuku-iro.jp/spot/detail_10008.html （福井城址）・detail_10172.html（福井神社）・detail_10045.html（養浩館庭園）・detail_10019.html（柴田神社）・
 *   detail_10068.html（愛宕坂茶道美術館）・detail_10387.html（愛宕坂）・detail_10364.html（足羽神社）・detail_10157.html（足羽山公園）
 * 座標の出典: OSM（福の井 node 6711119862（福井城の天守台の下）／福井神社 way 196824537／養浩館庭園 way 210921872／柴田神社 way 219779627／足羽神社 node 4379937467／
 *   足羽山公園 node 4379171294）、愛宕坂茶道美術館は OSM に点がないので地理院の住所検索（足羽一丁目8番5号）36.059845,136.211121
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-457-e8a7f2d5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e8a7f2d5-3e1a-4547-baeb-7021060f1fce";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "福井藩主松平家の居城跡・福井城址と福井神社、大名庭園の面影を残す養浩館庭園をめぐり、柴田勝家とお市ゆかりの北庄城址・柴田神社へ。午後は愛宕坂を上って茶道美術館、足羽神社、足羽山公園まで、福井の城下町を北から南へ歩いてたどる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["福井城址", "養浩館庭園"].join()) throw new Error("構成が想定と違います");
  const [castle, yokokan] = day.spots;

  const order = [
    { id: castle.id, data: { visitTime: t(9, 10), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.065518, lng: 136.221064, address: "福井県福井市大手3丁目",
      memo: "この旅は歩きでめぐります。JR福井駅から歩いて約5分で福井城址へ。福井城は、徳川家康の次男で初代福井藩主の結城秀康が慶長11年（1606年）に築き、約270年にわたって17代の越前松平家の居城となりました。築城のころは高さ37m・四層五階の天守がありましたが大火で焼け、今は、足羽山で採れる笏谷石で築かれた石垣と堀の一部が残ります。本丸の御殿の跡には福井県庁が建ち、天守台の下には「福井」の名の起こりとなったといわれる「福の井」の井戸跡があります。" } },
    { create: mk({ name: "福井神社", h: 9, m: 55, stay: 20, mode: "walk", min: 5, lat: 36.065961, lng: 136.219634, address: "福井県福井市大手3-16-1",
      memo: "城址のすぐそばの福井神社へ。第16代越前福井藩主・松平慶永（春嶽）をおまつりする神社です。" + RESPECT }) },
    { id: yokokan.id, data: { visitTime: t(10, 25), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 36.068449, lng: 136.224414, address: "福井県福井市宝永3丁目",
      memo: "福井神社から歩いて、養浩館庭園へ。大きな池を中心に、まわりに書院の建物が配置された回遊式の日本庭園で、もとは江戸時代の初めから後期にかけて造られた福井藩主松平家の別邸で、「御泉水屋敷」と呼ばれていました。池の縁では足元に気をつけましょう。" } },
    { create: mk({ name: "柴田神社（北庄城址）", h: 11, m: 50, stay: 75, mode: "walk", min: 20, lat: 36.060291, lng: 136.2195, address: "福井県福井市中央1-21-17",
      memo: "養浩館から福井駅の南へ歩いて、柴田神社へ。戦国武将・柴田勝家が築いたといわれる北庄城の跡で、城を訪れた宣教師ルイス・フロイスは、九重の天守などの壮大さに感嘆したと記しています。天正11年（1583年）、豊臣秀吉の軍に攻められた勝家は、妻で織田信長の妹のお市や一族とともに最期を遂げ、城もわずか8年でなくなりました。今は勝家とお市をまつる神社が建ち、境内には勝家・お市・三人の娘の像があり、となりの北の庄城址資料館では城の遺物などを見られます。" + RESPECT + "見学のあとは、駅のまわりで昼食にしましょう。" }) },
    { create: mk({ name: "愛宕坂茶道美術館", h: 13, m: 25, stay: 50, mode: "walk", min: 20, lat: 36.059845, lng: 136.211121, address: "福井県福井市足羽1-8-5",
      memo: "昼食のあとは南西へ歩いて、足羽山のふもとの愛宕坂茶道美術館へ。茶道史の略年表や、一乗谷朝倉氏遺跡の調査でわかった戦国時代の茶の湯、養浩館庭園にみられる福井藩主松平家の茶道など、4つのコーナーで福井の茶道の歴史を紹介しています。となりの愛宕坂は、足羽山への登山道として開かれた、145段・全長165mの石段の道で、江戸時代までは愛宕大権現社への参道として、料亭や茶屋が並んでにぎわいました。" }) },
    { create: mk({ name: "足羽神社", h: 14, m: 30, stay: 35, mode: "walk", min: 15, lat: 36.058276, lng: 136.209597, address: "福井県福井市足羽1丁目（足羽山）",
      memo: "愛宕坂の石段を上って、足羽山の足羽神社へ。第26代継体天皇と坐摩神の五柱をまつる神社で、樹齢380年の枝垂れ桜と、参道のタカオモミジは福井市の天然記念物です。" + RESPECT + "石段では足元に気をつけましょう。" }) },
    { create: mk({ name: "足羽山公園", h: 15, m: 15, stay: 75, mode: "walk", min: 10, lat: 36.054616, lng: 136.205431, address: "福井県福井市足羽山",
      memo: "足羽神社から、足羽山公園へ。標高116.4mの足羽山には、福井の礎を築いた継体天皇の像や十数基の古墳群、自然史博物館などがあり、春は「桜の名所100選」に選ばれた桜が、初夏には市の花のアジサイが咲きます。山道では足元に気をつけましょう。福井の城下町と足羽山をめぐる旅を、ここで締めくくりましょう。帰りは、福井駅まで歩いて約25分です。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 城址 9:10 → 福井神社 9:55 → 養浩館 10:25 → 柴田神社（昼食）11:50〜13:05 → 茶道美術館 13:25 → 足羽神社 14:30 → 足羽山公園 15:15〜16:30");
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

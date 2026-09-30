/**
 * #462 fa3afe40（松本 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜12:00（縄手通り → 中町通り）。説明文の「松本城とは違う」に合わせて城は入れず、駅の近くから北へ歩いてめぐる（戻らない）
 *   松本市美術館（新規）9:10〜10:25 →（歩き10分）中町通り 10:35〜11:20 →（歩き5分）縄手通り（昼食）11:25〜12:25 →（歩き5分）四柱神社（新規）12:30〜12:55
 *   →（歩き5分）松本市時計博物館（新規）13:00〜13:45 →（歩き5分）松本市立博物館（新規）13:50〜15:00 →（歩き15分）旧開智学校（新規）15:15〜16:30
 *   閉まる時刻: 美術館 9:00〜17:00（月曜休館）、時計博物館 9:00〜17:00（火曜休館）、市立博物館の展示室 9:00〜17:00（火曜休館）、旧開智学校 9:00〜17:00（入館16:30まで・12〜2月は火曜休館）。
 *   本文に時刻・曜日は書かない
 *   はかり資料館・旧司祭館は OSM に建物の点がない（バス停・案内板だけ）ので入れない
 * 本文の出典: 松本市公式観光サイト https://visitmatsumoto.com/spot/detail_1003.html （美術館）・detail_1082.html（中町通り）・detail_1083.html（縄手通り）・detail_1087.html（四柱神社）・
 *   detail_1004.html（市立博物館）・detail_1002.html（旧開智学校）、松本市 https://www.city.matsumoto.nagano.jp/soshiki/143/5637.html （時計博物館）
 * 座標の出典: OSM（松本市美術館 way 1040428833／中町通り way 149397114／縄手通り way 149397097／四柱神社 way 553159088／松本市時計博物館 node 4330952516／
 *   松本市立博物館 node 10801004187／旧開智学校 way 703211783）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-462-fa3afe40.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fa3afe40-a1bb-4610-9538-848755e1c83f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "草間彌生の作品に出会える松本市美術館から、蔵造りの町家が残る中町通り、カエルが迎える縄手通りと四柱神社、時計博物館、松本市立博物館、国宝の旧開智学校まで。松本城とは違う、松本の城下町の情緒と歴史を、食べ歩きもしながら歩いて楽しむ日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["縄手通り", "中町通り"].join()) throw new Error("構成が想定と違います");
  const [nawate, nakamachi] = day.spots;

  const order = [
    { create: mk({ name: "松本市美術館", h: 9, m: 10, stay: 75, mode: null, min: null, lat: 36.231557, lng: 137.976647, address: "長野県松本市中央4丁目",
      memo: "この旅は歩きでめぐります。JR松本駅から歩いて約12分の松本市美術館へ。松本市出身で世界的に活躍する前衛芸術家・草間彌生の作品群に出会える美術館で、入口では鮮やかなチューリップの巨大彫刻《幻の華》（2002年）が迎え、常設展では草間彌生の作品を心ゆくまで楽しめます。休館日は公式の案内で確かめましょう。" }) },
    { id: nakamachi.id, data: { visitTime: t(10, 35), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 36.233799, lng: 137.971459, address: "長野県松本市中央3丁目",
      memo: "美術館から西へ歩いて、中町通りへ。江戸末期や明治の大火から町を守るため、漆喰で作られた「なまこ壁」の白と黒の土蔵造りが今も数多く残る通りです。商店街のあちこちに井戸が残り、城下町の暮らしを静かに伝えています。" } },
    { id: nawate.id, data: { visitTime: t(11, 25), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.234613, lng: 137.971992, address: "長野県松本市大手3丁目",
      memo: "中町通りから女鳥羽川を渡って、縄手通りへ。松本城の南総堀と女鳥羽川の清流にはさまれた、縄のように細く長い土手が名の由来で、明治12年に四柱神社が建てられてからは、その参道として発達しました。通りのあちこちでカエルのモチーフが迎えてくれます。このあたりで昼食にしましょう。川沿いでは足元に気をつけましょう。" } },
    { create: mk({ name: "四柱神社", h: 12, m: 30, stay: 25, mode: "walk", min: 5, lat: 36.234893, lng: 137.970364, address: "長野県松本市大手3丁目",
      memo: "縄手通りの奥の四柱神社へ。天之御中主神・高皇産霊神・神皇産霊神・天照大神の四柱の大神をまつる神社で、明治12年（1879年）に今の場所にまつられました。「しんとう」の呼び名でも親しまれ、例祭の「神道祭」は松本平を代表する秋祭りです。" + RESPECT }) },
    { create: mk({ name: "松本市時計博物館", h: 13, m: 0, stay: 45, mode: "walk", min: 5, lat: 36.233798, lng: 137.96863, address: "長野県松本市中央1丁目",
      memo: "四柱神社から歩いてすぐの松本市時計博物館へ。古時計の研究者・技術者だった本田親蔵が、生涯をかけて集めた古時計のコレクションを松本市に寄贈したのが始まりで、平成14年（2002年）に開館しました。「時計は動いてこそ価値がある」という信念を受け継ぎ、約110点の時計をできるだけ動いている状態で展示しています。日本最大級とされる振り子時計が目印です。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "松本市立博物館", h: 13, m: 50, stay: 70, mode: "walk", min: 5, lat: 36.235277, lng: 137.969018, address: "長野県松本市大手3丁目",
      memo: "時計博物館から歩いてすぐの松本市立博物館へ。前身は明治時代に開館した「紀念館」にさかのぼる長い歴史をもつ博物館で、松本の成り立ちから城下町の発展、そして未来へと続く姿を、臨場感あふれる展示で紹介しています。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "旧開智学校", h: 15, m: 15, stay: 75, mode: "walk", min: 15, lat: 36.243049, lng: 137.968243, address: "長野県松本市開智2丁目",
      memo: "市立博物館から北へ歩いて、旧開智学校へ。明治9年（1876年）に、地元の大工棟梁・立石清重が設計・施工した擬洋風建築の傑作で、令和元年（2019年）に、近代の学校建築として初めて国宝に指定されたとされます。館内では当時の教科書や学校日誌が展示され、1階と2階を見学できます。休館日は公式の案内で確かめましょう。松本の城下町の情緒と歴史をめぐる旅を、ここで締めくくりましょう。帰りは、タウンスニーカー北コースのバスか、歩いて松本駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 美術館 9:10 → 中町 10:35 → 縄手（昼食）11:25 → 四柱神社 12:30 → 時計博物館 13:00 → 市立博物館 13:50 → 旧開智学校 15:15〜16:30");
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

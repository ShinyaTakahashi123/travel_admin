/**
 * #455 d6beaf2d（富山市内 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜11:53（城址公園 →（車）環水公園）。説明文に店の名前と「世界一美しい」があった
 *   富山城址公園（郷土博物館）9:10〜10:10 →（歩き5分）佐藤記念美術館（新規）10:15〜10:55 →（歩き5分）富山市役所展望塔（新規）11:00〜11:25
 *   →（歩き15分）富山市ガラス美術館（新規・昼食）11:40〜12:55 →（歩き5分）富山日枝神社（新規）13:00〜13:25
 *   →（市内電車と歩き40分）富山県美術館（新規）14:05〜15:20 →（歩き5分）富岩運河環水公園 15:25〜16:30
 *   閉まる時刻: 郷土博物館・佐藤記念美術館 9:00〜17:00、展望塔 平日9時〜（土日祝10時〜）・11〜3月は18時まで、ガラス美術館 9:30〜18:00（第1・3水曜休館）、
 *   富山県美術館 9:30〜18:00（水曜・祝日の翌日休館）、天門橋展望塔 9:00〜21:30。本文に時刻・曜日は書かない
 *   北前船廻船問屋 森家（岩瀬）は地震の補強工事で休館中のため使わない
 * 本文の出典: 富山市公式観光サイト https://www.toyamashi-kankoukyoukai.jp/spot/toyamajou/ ・/satokinenmuseum/ ・/toyamashiyakusyo-tenboutou/ ・/toyama-glassart-museum/ ・/hiejinja/ ・/toyamakenmuseum/ ・/kansuipark/
 * 座標の出典: OSM（富山市郷土博物館 way 198247843／富山市佐藤記念美術館 way 198247844／富山市役所 way 198148134／TOYAMAキラリ way 199752760（ガラス美術館が入る建物）／
 *   日枝神社 relation 2925730／富山県美術館 way 522869869／富岩運河環水公園 way 338875394）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-455-d6beaf2d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d6beaf2d-3089-4b72-a272-2a563064e5da";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "富山城址公園の郷土博物館と佐藤記念美術館、立山連峰を望む市役所展望塔、隈研吾設計のTOYAMAキラリにある富山市ガラス美術館、「山王さん」と親しまれる日枝神社をめぐり、午後は富山県美術館と富岩運河環水公園へ。富山市内の歴史とアートと水辺を楽しむ日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["富山城址公園", "富岩運河環水公園"].join()) throw new Error("構成が想定と違います");
  const [castle, kansui] = day.spots;

  const order = [
    { id: castle.id, data: { name: "富山城址公園（富山市郷土博物館）", visitTime: t(9, 10), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.692753, lng: 137.211466, address: "富山県富山市本丸",
      memo: "この旅は路面電車と歩きでめぐります。JR富山駅の南口から歩いて約10分で富山城址公園へ。富山城は1543年に神保長職が築いたのち、上杉氏、佐々氏、前田氏へと領主が代わりました。1954年に再建された今の天守は、戦災復興期を代表する建築として2004年に国の登録有形文化財になり、中は富山市郷土博物館として、模型や映像、ゆかりの資料で400年以上の歴史を紹介しています。最上階からは富山の街並みを眺められます。" } },
    { create: mk({ name: "富山市佐藤記念美術館", h: 10, m: 15, stay: 40, mode: "walk", min: 5, lat: 36.693958, lng: 137.211954, address: "富山県富山市本丸",
      memo: "天守のとなりの佐藤記念美術館へ。砺波市出身の実業家で茶人の佐藤助九郎のコレクションをもとにした美術館で、日本の近世絵画や工芸、東南アジアの陶磁器など東洋の古美術を展示しています。佐藤家から移築された茶室「助庵」「柳汀庵」や、総檜造りの書院座敷もあります。" }) },
    { create: mk({ name: "富山市役所展望塔", h: 11, m: 0, stay: 25, mode: "walk", min: 5, lat: 36.695914, lng: 137.213633, address: "富山県富山市新桜町",
      memo: "城址公園の北東にある富山市役所の展望塔へ。地上約70mの展望フロアから360度を見渡せ、立山連峰や富山城、路面電車、富山湾まで眺められます。開いている時間は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "富山市ガラス美術館", h: 11, m: 40, stay: 75, mode: "walk", min: 15, lat: 36.688421, lng: 137.215108, address: "富山県富山市西町（TOYAMAキラリ）",
      memo: "市役所から南へ歩いて、隈研吾の設計による複合施設「TOYAMAキラリ」の中にある富山市ガラス美術館へ。立山連峰をイメージした外観で、県産材のルーバーからやわらかな光が差し込みます。6階の常設展示「グラス・アート・ガーデン」では、現代ガラスアートを代表するデイル・チフーリの作品が見られます。休館日は公式の案内で確かめましょう。見学のあとは、このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "富山日枝神社", h: 13, m: 0, stay: 25, mode: "walk", min: 5, lat: 36.686569, lng: 137.213587, address: "富山県富山市山王町",
      memo: "キラリから歩いて、富山日枝神社へ。富山藩ゆかりの古社で、富山藩の総産土社として大切にされてきました。市民からは「山王さん」と呼ばれて親しまれ、初夏の「山王まつり」は富山を代表する祭りとして町がにぎわいます。" + RESPECT + "お参りのあとは、路面電車で富山駅へ向かいます。" }) },
    { create: mk({ name: "富山県美術館", h: 14, m: 5, stay: 75, mode: "train", min: 40, line: "富山地方鉄道 市内電車", lat: 36.710851, lng: 137.210183, address: "富山県富山市木場町",
      memo: "西町から路面電車で富山駅へ出て、北口から歩いて富山県美術館へ。「アートとデザインをつなぐ」美術館で、ピカソ、ミロ、シャガールといった巨匠の作品から、ポスターや椅子などのデザイン作品まで、幅広い表現に出会えます。屋上の「オノマトペの屋上」は、擬音語や擬態語をモチーフにしたカラフルな空間で、立山連峰と環水公園を眺められます（冬は屋上が閉まります）。休館日は公式の案内で確かめましょう。" }) },
    { id: kansui.id, data: { visitTime: t(15, 25), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 36.709696, lng: 137.212295, address: "富山県富山市湊入船町",
      memo: "美術館のとなりの富岩運河環水公園へ。運河の水辺を生かした公園で、シンボルの天門橋には展望塔があり、公園全体と街並みを一望できます。水辺では足元に気をつけましょう。富山の城と美術館と水辺をめぐる旅を、ここで締めくくりましょう。帰りは、富山駅の北口まで歩いて約9分です。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 城址 9:10 → 佐藤記念 10:15 → 展望塔 11:00 → ガラス美術館（昼食）11:40〜12:55 → 日枝神社 13:00 →（電車）県美術館 14:05 → 環水公園 15:25〜16:30");
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

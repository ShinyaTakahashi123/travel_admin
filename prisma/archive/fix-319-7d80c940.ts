/**
 * #319 鉄道博物館で1日満喫、家族で楽しむさいたま鉄道の旅(7d80c940)。
 * チェックリスト20260929: 2か所09:30〜14:20で4か所未満・終了。
 *
 * 大宮公園(氷川神社の境内地から生まれた県営公園、園内の大宮公園小動物園を含む)
 * ・武蔵一宮氷川神社(大宮の地名の由来ともいわれる古社)の実在スポット2つを
 * 追加。既存2スポットの口調(「皆様」「ご案内するのは」「ご案内いたします」)
 * もサイト標準に直し、鉄道博物館の昼食(館内「トレインレストラン日本食堂」)
 * の一言を追加。
 *
 * 座標の出典:
 * - 大宮公園: Nominatimで名称一致。relation 17337960, 35.9190335,139.6318133
 * - 大宮公園小動物園(大宮公園の説明に含める): Nominatimで名称一致確認のみ
 *   (way 580921823, 35.9184862,139.6324525。独立スポットにはせず、隣接する
 *   大宮公園の説明文の中で紹介。座標は大宮公園のものを使用)
 * - 武蔵一宮氷川神社: Nominatimで名称一致。way 1258998074,
 *   35.9167708,139.6297653
 *
 * 事実確認:
 * - トレインレストラン日本食堂: 鉄道博物館館内2F、寝台特急「北斗星」の食器を
 *   使用(shop.jr-cross.co.jp公式)
 * - 大宮公園: 明治18年(1885)開園、氷川神社の境内地から誕生した県営公園
 *   (chocotabi-saitama.jp・saitama-aruki等)
 * - 大宮公園小動物園: ニホンザル・フラミンゴ・ツキノワグマ等を飼育
 *   (parks.or.jp/omiyazoo公式)。料金の記載はしない
 * - 武蔵一宮氷川神社: 2400年以上の歴史を持つとされる(公式サイト
 *   musashiichinomiya-hikawa.or.jp)、日本一の長さを誇るとされる約2kmの参道
 *   (公式サイトは「誇る」と言い切りだが、決まり9によりヘッジして記載)。
 *   「大宮」の地名由来は「伝えられている」として記載
 * - 大宮駅⇔氷川神社: 徒歩15〜20分・約1.5km(複数の観光サイトで確認)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-319-7d80c940.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7d80c940-0507-41af-8688-ccb64b79a0a1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const museum = await prisma.spot.findFirstOrThrow({
    where: { dayId: day1.id, name: "鉄道博物館" },
  });
  const bonsai = await prisma.spot.findFirstOrThrow({
    where: { dayId: day1.id, name: "大宮盆栽美術館" },
  });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "武蔵一宮氷川神社" } });
  if (already) {
    console.log("already applied, skipping spot creation");
  } else {
    const museumMemo =
      "大宮駅からニューシャトルでおよそ3分。鉄道博物館は、JR東日本の創立20周年記念事業として、平成19年(2007)に開館しました。かつて東京・秋葉原にあった交通博物館の後継施設にあたり、実物の車両が並ぶ「車両ステーション」をはじめ、運転士気分を味わえるシミュレーターや、鉄道の仕組みを学べる展示など、鉄道の歴史と技術を五感で楽しめる施設です。平成30年(2018)には南館が新設され、収蔵する資料や展示もさらに充実しました。見学の途中、館内の「トレインレストラン日本食堂」で昼食をとりましょう。寝台特急「北斗星」で実際に使われていた食器を使うなど、食堂車の雰囲気を味わえます。子どもから大人まで夢中になれる、鉄道の世界を存分に楽しみましょう。続いては、車でおよそ15分の大宮盆栽美術館へ向かいましょう。";

    const bonsaiMemo =
      "鉄道博物館からは車でおよそ15分です。大宮盆栽美術館は、平成22年(2010)、盆栽文化を総合的に紹介する、世界で初めての公立の盆栽専門美術館として開館したといわれています。名品と呼ばれる盆栽のほか、盆栽を引き立てる鉢や水石、盆栽を描いた絵画資料などを系統的に収集・公開しています。このあたり一帯はかつて「大宮盆栽村」と呼ばれ、大正時代、東京の盆栽業者たちが移り住んだことから、盆栽づくりの町として発展してきました。鉄道博物館で最新の技術に触れたあとは、一転して、小さな鉢の中に広がる自然の世界をゆっくりと楽しみましょう。続いては、歩いておよそ14分の大宮公園へ向かいましょう。";

    await setDaySpotOrder(day1.id, [
      { id: museum.id, data: { memo: museumMemo } },
      { id: bonsai.id, data: { memo: bonsaiMemo, stayDurationMin: 60 } },
      {
        create: {
          name: "大宮公園",
          address: "さいたま市大宮区高鼻町",
          lat: 35.9190335,
          lng: 139.6318133,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 59)),
          stayDurationMin: 75,
          transitMode: "walk",
          transitDurationMin: 14,
          memo:
            "大宮盆栽美術館からは歩いておよそ14分です。大宮公園は、武蔵一宮氷川神社の境内地の一部から生まれた、明治18年(1885)開園の県営公園です。ケヤキやサクラの大木が茂る園内には、日本庭園や池、野球場・サッカー場などが広がり、春は桜の名所としても親しまれています。園内にある大宮公園小動物園では、ニホンザルやフラミンゴ、ツキノワグマなど、身近な距離で様々な動物を観察できます。緑豊かな園内を、家族でゆっくり散策してみましょう。続いては、歩いておよそ4分の武蔵一宮氷川神社へ向かいましょう。",
        },
      },
      {
        create: {
          name: "武蔵一宮氷川神社",
          address: "さいたま市大宮区高鼻町1-407",
          lat: 35.9167708,
          lng: 139.6297653,
          visitTime: new Date(Date.UTC(1970, 0, 1, 15, 18)),
          stayDurationMin: 70,
          transitMode: "walk",
          transitDurationMin: 4,
          memo:
            "大宮公園からは歩いておよそ4分です。武蔵一宮氷川神社は、2400年以上の歴史を持つとされる、関東を代表する古社の一つです。「大いなる宮居」が転じて「大宮」の地名の由来になったとも伝えられています。ケヤキなどの大樹が並ぶ、日本一長いともいわれる、およそ2kmの参道が特徴で、神池にかかる朱色の神橋も見どころです。楼門をくぐり、舞殿・本殿へと参拝しましょう。武蔵一宮として関東一円から信仰を集めてきた、大宮の氏神様に、静かに、敬意をもってお参りください。見学を終えたら、参道を歩いて大宮駅まで戻りましょう(およそ15分)。",
        },
      },
    ]);

    for (const name of ["大宮公園", "武蔵一宮氷川神社"]) {
      const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
      await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode!, transitDurationMin: s.transitDurationMin! },
      });
    }
  }

  const newDescription =
    "実物車両やシミュレーターが揃う鉄道博物館、盆栽文化にふれる大宮盆栽美術館、緑豊かな大宮公園と小動物園、大宮の氏神様・武蔵一宮氷川神社まで。子どもから大人まで夢中になれる日帰りプランです。";
  if (itin.description !== newDescription) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

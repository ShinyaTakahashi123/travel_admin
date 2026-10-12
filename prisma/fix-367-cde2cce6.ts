/**
 * #367 白山公園と白山神社、新潟の縁結びパワースポット散策プラン(cde2cce6)。
 * 白山神社・白山公園の2か所・09:30〜11:02のみだったのを、新潟市中央区を徒歩で
 * 回る7か所・09:00〜16:35に組み直す。旧文の古い案内口調
 * (「皆様、本日ご案内するのは」「ご案内いたします」)も直した。タイトルの
 * 「パワースポット」も、しおりえの基準にそぐわないため言い換えた。
 *
 * - 白山神社: OSMに点がないため、公式住所(新潟市中央区一番堀通町1-1)をGSIで
 *   実点化、37.915577,139.037735(既存座標は度分秒を丸めた値だったため修正)
 * - 白山公園: OSM way352707754、37.9138991,139.0397812(同様に実点に修正)
 * - 新潟県政記念館: OSM way352713447、37.914627,139.0405915
 * - りゅーとぴあ: OSM way257902037、37.9134531,139.0405064
 * - 本町市場(昼食): OSM node13809814215、37.9199801,139.046387(店名は出さない)
 * - 新潟市美術館: OSM way420436751、37.9284406,139.0420583
 * - 湊稲荷神社: OSM way751567276、37.931769,139.0548246
 *
 * 新しい時刻(09:00〜16:35、7か所):
 * 白山神社(80)→白山公園(55)→新潟県政記念館(35)→りゅーとぴあ(35)
 * →本町市場・昼食(70)→新潟市美術館(90)→湊稲荷神社(40)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "cde2cce6-1e6f-4ef9-8ca6-2c2604a5c190";
const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const hakusanjinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山神社" } });
  if (hakusanjinja.memo?.includes("隣接する白山公園へ向かいましょう")) {
    console.log("already applied, skipping");
    return;
  }
  const hakusanpark = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山公園" } });

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { title: "白山公園と白山神社、新潟の縁結びの神様を訪ねる散策プラン" },
  });
  console.log("タイトル: 「パワースポット」を言い換え");

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: hakusanjinja.id,
        data: {
          lat: 37.915577,
          lng: 139.037735,
          visitTime: T(9, 0),
          stayDurationMin: 80,
          memo: "新潟駅からバスでおよそ12分、新潟の旅は白山神社から始まります。千年余りの歴史を持つと伝えられる、新潟の総鎮守です。度重なる火災で古い記録を失ったため創建年ははっきりしませんが、延喜年間(901〜)ともいわれる古社です。祭神の菊理媛(くくりひめのかみ)は、日本書紀の中で、仲たがいした夫婦の神をとりなしたという逸話から、縁結びの神様として篤く信仰されてきました。初詣には多くの人が訪れることで知られ、春祭りや七夕風鈴まつりなど、四季を通じてさまざまな祭事が行われています。今も多くの人が参拝に訪れる祈りの場ですので、境内では静かにお参りください。参拝のあとは、隣接する白山公園へ向かいましょう。",
        },
      },
      {
        id: hakusanpark.id,
        data: {
          lat: 37.9138991,
          lng: 139.0397812,
          visitTime: T(10, 24),
          stayDurationMin: 55,
          memo: "白山神社から歩いて4分ほど、次に訪れるのは白山公園です。明治6年(1873)に開設された、日本で最初期の公園の一つともいわれています。白山神社に隣接するこの公園は、新潟市内でも歴史のある公園の一つで、四季折々の花や緑を楽しめる市民の憩いの場として親しまれています。園内には池や東屋、能楽堂が配され、桜の季節には多くの花見客で賑わいます。新潟市中心部にありながら落ち着いた時間が流れる公園を、ゆったりと散歩しましょう。見学を終えたら、歩いて新潟県政記念館へ向かいましょう。",
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      {
        create: {
          name: "新潟県政記念館",
          address: "新潟市中央区一番堀通町3-3",
          lat: 37.914627,
          lng: 139.0405915,
          visitTime: T(11, 21),
          stayDurationMin: 35,
          memo: "白山公園から歩いて2分ほど、次に訪れるのは新潟県政記念館です。明治16年(1883)に新潟県会議事堂として建てられた、擬洋風建築の建物です。明治期に建てられた県会議事堂が今も残るのは、新潟・京都・和歌山の3つの府県だけで、いずれも国の重要文化財に指定されています。館内には、当時の議場の様子を伝える展示もあります。レトロな洋風建築の外観を眺めながら、見学しましょう。見学を終えたら、歩いてりゅーとぴあへ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        create: {
          name: "りゅーとぴあ",
          address: "新潟市中央区一番堀通町3-2",
          lat: 37.9134531,
          lng: 139.0405064,
          visitTime: T(11, 58),
          stayDurationMin: 35,
          memo: "新潟県政記念館から歩いて2分ほど、次に訪れるのはりゅーとぴあです。平成10年(1998)に開館した新潟市民芸術文化会館で、建築家・長谷川逸子氏が設計を手がけました。コンサートホールや劇場、能楽堂を備え、新潟の文化芸術の拠点として親しまれています。公演がない日でも、ロビーやギャラリーを見学することができます。水辺に面した開放的な建物の雰囲気を楽しみましょう。見学を終えたら、歩いて本町市場へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        create: {
          name: "本町市場で昼食",
          address: "新潟市中央区本町通六番町",
          lat: 37.9199801,
          lng: 139.046387,
          visitTime: T(12, 45),
          stayDurationMin: 70,
          memo: "りゅーとぴあから歩いて12分ほど、お昼は本町市場で食事をとりましょう。新潟市民の台所として親しまれてきた市場で、アーケードの通りには鮮魚店や惣菜店が軒を連ね、野菜や生花の露店も並びます。市場らしい活気を感じながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、歩いて新潟市美術館へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
      {
        create: {
          name: "新潟市美術館",
          address: "新潟市中央区西大畑町5191-9",
          lat: 37.9284406,
          lng: 139.0420583,
          visitTime: T(14, 9),
          stayDurationMin: 90,
          memo: "本町市場から歩いて14分ほど、次に訪れるのは新潟市美術館です。昭和60年(1985)に開館した美術館で、建築家・前川國男氏が設計を手がけました。日本画や版画、新潟にゆかりのある作家の作品などを所蔵しています。企画展にあわせて、さまざまなテーマの展示が楽しめます。落ち着いた雰囲気の館内で、ゆっくりと鑑賞しましょう。見学を終えたら、歩いて湊稲荷神社へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] },
        },
      },
      {
        create: {
          name: "湊稲荷神社",
          address: "新潟市中央区西湊町通四ノ町5433",
          lat: 37.931769,
          lng: 139.0548246,
          visitTime: T(15, 55),
          stayDurationMin: 40,
          memo: "新潟市美術館から歩いて16分ほど、旅の最後に訪れるのは湊稲荷神社です。回して願いごとをする、珍しい「願懸け高麗犬(こまいぬ)」が置かれている神社です。男性は右側の阿形(あがた)を、女性は左側の吽形(うんがた)を回して、願いをかけるとされています。新潟の港町らしい歴史を持つ神社で、静かに、敬意をもって参拝しましょう。見学を終えたら、新潟駅へ戻り、新潟市中心部を巡る1日を締めくくりましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
        },
      },
    ]
  );

  console.log("#367: 新潟県政記念館・りゅーとぴあ・本町市場・新潟市美術館・湊稲荷神社を追加、09:00〜16:35着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

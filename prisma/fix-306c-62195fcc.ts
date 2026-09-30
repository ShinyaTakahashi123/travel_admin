/**
 * チェックリスト #306 の修正記録(企画運営6点・法務2点)。
 * しおり「富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン」
 * (62195fcc-88cc-4287-81fd-4c43b73a86a6)
 *
 * 企画運営・法務の指摘(重なる部分は1回で対応):
 * 1. 新屋山神社: ご利益を約束するような書き方(第三者の宣伝文句の引用・
 *    「三大」・「十分にご利益にあずかれる」)を外し、法務の指定文言
 *    「山を守る神として、林業や農業に携わる人々の信仰を集めてきた神社
 *    です。近年は金運を願う人も多くお参りします。」に差し替え。
 * 2. 新倉山浅間公園: 忠霊塔(戦没者慰霊)に配慮の一文、新倉富士浅間神社にも
 *    配慮の一文を追加。
 * 3. 忍野八海の滞在90→60分に短縮(決まりA)。空いた30分は、実在の
 *    北口本宮冨士浅間神社(way 1323583752、富士山の世界遺産構成資産、
 *    景行天皇40年[西暦110年]の日本武尊の故事に由来、延暦7年[788]創建、
 *    国重要文化財11棟、日本最大級の木造大鳥居)を追加して埋めた。
 *    出典(直接開いたURL): https://www.sengenjinja.jp/yuisho/index.html
 *    (北口本宮冨士浅間神社公式)
 * 4. 久保田一竹美術館: 「ゆっくりとご覧ください」→「ゆっくり見てみて
 *    ください」、「三拍子そろった」を削除。
 * 5. 大石公園: 「河口湖自然生活館」の案内を短く。
 * 6. 最初のスポット(大石公園)に移動手段(車でめぐる)の案内を追加。
 *
 * 座標はNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-306c-62195fcc.ts
 * (実行済み。北口本宮冨士浅間神社の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "62195fcc-88cc-4287-81fd-4c43b73a86a6";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "北口本宮冨士浅間神社")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const oishi = spots.find((s) => s.name === "大石公園")!;
  const kubota = spots.find((s) => s.name === "久保田一竹美術館")!;
  const ropeway = spots.find((s) => s.name === "河口湖〜富士山パノラマロープウェイ")!;
  const arakura = spots.find((s) => s.name === "新倉山浅間公園")!;
  const oshino = spots.find((s) => s.name === "忍野八海")!;
  const arayayama = spots.find((s) => s.name === "新屋山神社")!;

  const oishiMemo =
    "この旅は車でめぐります。河口湖の北岸に広がる大石公園は、湖の向こうに富士山を望む、河口湖でも指折りの撮影スポットとして知られています。湖畔に沿って続く「花街道」では、初夏にはラベンダー、秋にはコキアなど、季節ごとに表情を変える花々が楽しめ、富士山と湖、そして花という三つの景色が一度に楽しめるのがこの公園の魅力です。河口湖自然生活館もあります。風のない日には、湖面に富士山が映り込む姿が見られることもあります。";

  const kubotaMemo = (kubota.memo ?? "")
    .replace("作品と建築、庭園と、三拍子そろった空間をゆっくりとご覧ください。", "作品と建築、庭園を、ゆっくり見てみてください。");

  const arakuraMemo =
    "河口湖〜富士山パノラマロープウェイからは車で10分ほどです。新倉山浅間公園は、富士山と五重塔を一枚の絵のように望める、絶景スポットとして知られています。展望デッキまでは398段の階段を上りますが、たどり着けば、富士吉田の街並みの向こうに、左右対称の富士山を一望できます。塔は正式には「忠霊塔」といい、昭和38年(1963)、太平洋戦争の戦没者を慰霊するために建てられました。慰霊の塔ですので、静かに、敬意をもって見学しましょう。公園の麓に鎮座する新倉富士浅間神社は、社伝によれば西暦705年ごろの創建と伝わり、平安時代の富士山の噴火の際には、朝廷から鎮火祭のための勅使が遣わされたとも伝えられています。参拝の際は、静かに、敬意をもってお参りください。周辺には食事処もあるので、ここで昼食をとりましょう。";

  const oshinoMemo =
    "新倉山浅間公園からは車で15分ほどです。忍野八海は、富士山の伏流水が湧き出す、8か所の湧水池群です。かつてこの地にあった忍野湖が干上がって盆地になったあと、富士山や周辺の山々からの伏流水が、湧水として地表に姿を現したものと考えられています。平成25年(2013)、「富士山-信仰の対象と芸術の源泉」の構成資産の一部として、世界文化遺産に登録されました。富士登拝を行った道者たちが、この水で身を清めたと伝えられ、それぞれの池には八大竜王が祀られています。池をめぐりながら、富士山の恵みである清らかな湧水を感じてみましょう。";

  const arayayamaMemo =
    "北口本宮冨士浅間神社からは徒歩10分ほどです。新屋山神社は、天文3年(1534)の創建と伝わる、富士山麓に鎮座する神社です。大山祇命・天照皇大神・木花開耶姫命を祭神とし、山を守る神として、林業や農業に携わる人々の信仰を集めてきました。近年は金運を願う人も多くお参りします。静かに、敬意をもってお参りください。見学を終えたら、車で河口湖・富士吉田方面へ戻りましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: oishi.id, data: { memo: oishiMemo } },
        { id: kubota.id, data: { memo: kubotaMemo } },
        { id: ropeway.id, data: {} },
        { id: arakura.id, data: { memo: arakuraMemo } },
        {
          id: oshino.id,
          data: { stayDurationMin: 60, memo: oshinoMemo },
        },
        {
          create: {
            name: "北口本宮冨士浅間神社",
            address: "山梨県富士吉田市上吉田5558",
            lat: 35.4710138,
            lng: 138.7926376,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 17)),
            stayDurationMin: 45,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "忍野八海からは車で12分ほどです。北口本宮冨士浅間神社は、富士山の世界遺産の構成資産にも登録されている神社です。社伝によれば、景行天皇40年(西暦110年)、東征中の日本武尊がこの地で富士山の神霊を仰ぎ拝んだのが始まりとされ、延暦7年(788)に社殿が建立されました。参道の杉林の中にそびえる大鳥居は、木造の鳥居として日本最大級です。拝殿や本殿など、あわせて11棟が国の重要文化財に指定されています。樹齢およそ1000年の御神木「冨士太郎杉」も見どころです。静かに、敬意をもってお参りください。",
          },
        },
        {
          id: arayayama.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 12)),
            transitMode: "walk",
            transitDurationMin: 10,
            memo: arayayamaMemo,
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
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

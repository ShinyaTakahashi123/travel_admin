/**
 * 54f0fa20（姫路城と書写山圓教寺、1泊2日）初日の見直し（2026-10-30）
 * 仕様: docs/specs/20261029-first-last-day-times.md（初日11時ごろ〜、16:30〜17:00に最後の
 * 行き先を出る、3か所以上）。1泊2日のため最終日(Day2)は決まりどおり直さない。
 *
 * 初日: 大手前通り（姫路駅→姫路城の入口の道。内容を姫路城のメモの書き出しに統合）・
 * 日本城郭研究センター（説明文になし）・男山配水池公園を外し、タイトル・説明文の見どころ
 * （姫路城・好古園・姫路市立動物園・姫路文学館）の4か所に組み直す。移動は
 * OSRM(routing.openstreetmap.de/routed-foot)の道のりルーティングで算出。
 *
 * 入口: 姫路駅北口→姫路城、実測25.8分（routed-foot）。姫路駅11時ごろ着で姫路城11:26着。
 * 列車の名前・発着の時刻は本文に書かない。
 *
 * 移動は全区間をOSRM(routed-foot)で測り直した（企画運営指摘、2026-10-30）。動物園→文学館は
 * もとの値15分のままだったが、実測19分だったため直した。
 *
 * 昼食（企画運営指摘、2回目で組み直し）: 姫路城を出てすぐ昼食の一文を入れた最初の案は、
 * 時間を確保していなかったため、企画運営の案(a)のとおり、好古園の滞在(90分)内の
 * 既存の「園内のレストランで昼食」の一文をそのまま使う形にした（姫路城には昼食の一文を
 * 入れない）。好古園着13:33は13:30をわずかに過ぎるが、企画運営の了承どおり許容範囲。
 * 姫路文学館の最終入館は16:30（公式）のため、16:19着に組み、11分の余裕を持たせた。
 * 開館・最終入館の具体的な時刻は本文に書かない決まり（法務指摘）のため、文学館のメモは
 * 「入館できる時間は、公式の案内で確かめましょう」の形にした。
 *
 * 座標はすべてNominatimの値とほぼ完全一致（姫路城way 23707900・好古園way 236942009・
 * 動物園relation 3251534・文学館node 1423058869）のため変更なし。
 *
 * サムネイルは大手前通りの写真だったため、姫路城の写真に変更。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const OTEMAE = "f18e3738-43bf-46e3-8d65-fb677ec98c0b"; // 削除（姫路城メモに統合）
const HIMEJIJO = "95dc6651-cf64-40b8-9d51-516c06cbf3bb";
const KENKYU = "67c16aa7-8668-4f03-bb9f-4e6682977238"; // 削除
const KOUKOEN = "ffda9ccc-a967-4bd7-b115-63b6f3c588d3";
const OTOKOYAMA = "64bbeb71-dea4-4260-8c1c-1d27a4d6e1b5"; // 削除
const ZOO = "0b57c505-6c4f-4475-a66b-235ff1e1c783";
const BUNGAKUKAN = "650484f6-4f61-4465-a030-512a74d1ec2e";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESC_OLD =
  "現存12天守の一つで、日本で最初に登録された世界文化遺産の一つでもある国宝・姫路城を中心に、隣接する大名庭園・好古園、男山配水池公園、姫路市立動物園、姫路文学館をめぐる1日目。2日目は、ロープウェーで山上へ登り、「西の比叡山」とも呼ばれる古刹・書写山圓教寺の伽藍をめぐったあと、姫路市立水族館・手柄山平和公園へ向かいます。";
const DESC_NEW =
  "現存12天守の一つで、日本で最初に登録された世界文化遺産の一つでもある国宝・姫路城を中心に、隣接する大名庭園・好古園、姫路市立動物園、姫路文学館をめぐる1日目。2日目は、ロープウェーで山上へ登り、「西の比叡山」とも呼ばれる古刹・書写山圓教寺の伽藍をめぐったあと、姫路市立水族館・手柄山平和公園へ向かいます。";

const HIMEJIJO_MEMO_OLD =
  "羽柴秀吉が築いた小さな城を、関ヶ原の戦いで功を挙げた池田輝政が慶長14年(1609)、8年の歳月をかけて今の姿に大改修しました。白漆喰で塗り固めた優美な外観から「白鷺城」とも呼ばれます。大天守は地上6階・地下1階ながら5重に見えるよう工夫された、現存12天守の中でも最も高いとされる(約31.5m)天守で、大天守・小天守など8棟が国宝に指定されています。平成5年(1993)、法隆寺とともに、日本で最初にユネスコ世界文化遺産に登録された1つです。菱の門から入り、敵を惑わすための複雑な縄張りを体感しながら大天守を目指しましょう。令和8年(2026)7月から、二の櫓・水の一門・水の二門など大天守周辺で保存修理工事が行われており、見学できる範囲や夜間のライトアップに影響が出ることがあるので、お出かけ前に公式サイトで確かめましょう。この後は、歩いておよそ10分、日本城郭研究センターへ向かいましょう。";
const HIMEJIJO_MEMO_NEW =
  "姫路駅に11時ごろ着いたら、北口を出て正面に広がる大手前通りを歩きましょう。姫路城まで一直線に続く幅50mのメインストリートで、クスノキとイチョウの並木道は、電柱をなくし、姫路城の眺めを損なわないよう整備されています。道の先に白い天守がまっすぐ見えてくる、姫路の旅の始まりにふさわしい散歩道です。駅から歩いておよそ26分で姫路城に着きます。羽柴秀吉が築いた小さな城を、関ヶ原の戦いで功を挙げた池田輝政が慶長14年(1609)、8年の歳月をかけて今の姿に大改修しました。白漆喰で塗り固めた優美な外観から「白鷺城」とも呼ばれます。大天守は地上6階・地下1階ながら5重に見えるよう工夫された、現存12天守の中でも最も高いとされる(約31.5m)天守で、大天守・小天守など8棟が国宝に指定されています。平成5年(1993)、法隆寺とともに、日本で最初にユネスコ世界文化遺産に登録された1つです。菱の門から入り、敵を惑わすための複雑な縄張りを体感しながら大天守を目指しましょう。令和8年(2026)7月から、二の櫓・水の一門・水の二門など大天守周辺で保存修理工事が行われており、見学できる範囲や夜間のライトアップに影響が出ることがあるので、お出かけ前に公式サイトで確かめましょう。この後は、歩いておよそ17分、好古園へ向かいましょう。";

const KOUKOEN_MEMO_OLD =
  "日本城郭研究センターから歩いておよそ7分、好古園に着きます。姫路城の南西に隣接する池泉回遊式庭園。姫路市制100周年を記念し、平成4年(1992)に開園しました。江戸時代の姫路藩主の屋敷跡や武家屋敷の遺構を生かし、門や塀で仕切られた9つの趣の異なる庭が続きます。世界遺産・姫路城を借景にした景色は、時代劇やドラマのロケ地にもたびたび使われています。園内のレストランで、庭園を眺めながら昼食をとることもできます。この後は、男山へ続く石段を上り、男山配水池公園へ向かいましょう。";
const KOUKOEN_MEMO_NEW =
  "姫路城から歩いておよそ17分、好古園に着きます。姫路城の南西に隣接する池泉回遊式庭園。姫路市制100周年を記念し、平成4年(1992)に開園しました。江戸時代の姫路藩主の屋敷跡や武家屋敷の遺構を生かし、門や塀で仕切られた9つの趣の異なる庭が続きます。世界遺産・姫路城を借景にした景色は、時代劇やドラマのロケ地にもたびたび使われています。園内の食事どころで昼食にしましょう。この後は、歩いておよそ12分、姫路市立動物園へ向かいましょう。";

const ZOO_MEMO_OLD =
  "男山配水池公園から歩いておよそ12分、姫路城の三の丸広場に隣接する姫路市立動物園に着きます。昭和26年(1951)に開園した歴史ある動物園で、世界遺産・姫路城の天守を間近に望みながら動物たちを観察できる、全国的にも珍しいロケーションが魅力です。キリンやライオンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。動物にさわったあとは手を洗い、係の人の案内に従いましょう。すぐそばの姫路文学館へ向かいましょう。";
const ZOO_MEMO_NEW =
  "好古園から歩いておよそ12分、姫路城の三の丸広場に隣接する姫路市立動物園に着きます。昭和26年(1951)に開園した歴史ある動物園で、世界遺産・姫路城の天守を間近に望みながら動物たちを観察できる、全国的にも珍しいロケーションが魅力です。キリンやライオンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。動物にさわったあとは手を洗い、係の人の案内に従いましょう。姫路文学館へ向かいましょう。";

const BUNGAKUKAN_MEMO_OLD =
  "姫路市立動物園から歩いておよそ15分、姫路文学館に着きます。建築家・安藤忠雄が設計を手がけた、姫路城の白壁を望む水と緑に囲まれた施設で、姫路にゆかりのある文学者たちの資料を展示しています。北館と南館を結ぶ渡り廊下や、水面に浮かぶように見える建物の意匠も見どころです。姫路の旅1日目の締めくくりに、静かな時間を過ごしましょう。今夜は姫路駅周辺の宿に泊まりましょう。";
const BUNGAKUKAN_MEMO_NEW =
  "姫路市立動物園から歩いておよそ19分、姫路文学館に着きます。建築家・安藤忠雄が設計を手がけた、姫路城の白壁を望む水と緑に囲まれた施設で、姫路にゆかりのある文学者たちの資料を展示しています。北館と南館を結ぶ渡り廊下や、水面に浮かぶように見える建物の意匠も見どころです。入館できる時間は、公式の案内で確かめましょう。姫路の旅1日目の締めくくりに、静かな時間を過ごしましょう。今夜は姫路駅周辺の宿に泊まりましょう。";

async function main() {
  const itinerary = await prisma.itinerary.findUniqueOrThrow({
    where: { id: "54f0fa20-3251-433c-ad53-d1ff6831d4e9" },
    include: { days: { orderBy: { dayNumber: "asc" } } },
  });
  const day1 = itinerary.days.find((d) => d.dayNumber === 1);
  if (!day1) throw new Error("day1 not found");

  if (itinerary.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  const spots = await prisma.spot.findMany({ where: { id: { in: [HIMEJIJO, KOUKOEN, ZOO, BUNGAKUKAN] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));
  const himejijo = byId.get(HIMEJIJO)!;
  const koukoen = byId.get(KOUKOEN)!;
  const zoo = byId.get(ZOO)!;
  const bungakukan = byId.get(BUNGAKUKAN)!;

  if (himejijo.memo !== HIMEJIJO_MEMO_OLD) throw new Error("姫路城: memo現在値が期待と不一致");
  if (koukoen.memo !== KOUKOEN_MEMO_OLD) throw new Error("好古園: memo現在値が期待と不一致");
  if (zoo.memo !== ZOO_MEMO_OLD) throw new Error("姫路市立動物園: memo現在値が期待と不一致");
  if (bungakukan.memo !== BUNGAKUKAN_MEMO_OLD) throw new Error("姫路文学館: memo現在値が期待と不一致");

  const himejijoPhoto = await prisma.photo.findFirst({ where: { spotId: HIMEJIJO } });
  if (!himejijoPhoto) throw new Error("姫路城の写真が見つからない（サムネイルの付け替えに必要）");

  console.log("前提の確認OK。\n");

  console.log("[説明文] 男山配水池公園の記述を削除");
  console.log("\n[初日] 大手前通り（姫路城メモに統合）・日本城郭研究センター・男山配水池公園を削除。新しい並び（動物園→文学館は実測19分に直した）:");
  console.log("姫路城(11:26,stay110)→[walk17]→好古園(13:33,stay90,昼食は園内のレストランで)→[walk12]→動物園(15:15,stay45)→[walk19]→文学館(16:19,stay35、16:54出発。最終入館16:30に対し11分の余裕)");
  console.log(`\n[サムネイル] 大手前通りの写真 → 姫路城の写真(${himejijoPhoto.url})に変更`);
  console.log("座標はすべてNominatimの値とほぼ完全一致のため変更なし");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinerary.id },
      data: { description: DESC_NEW, thumbnailUrl: himejijoPhoto.url },
    });
    await setDaySpotOrder(
      day1.id,
      [
        { id: HIMEJIJO, data: { visitTime: t(11, 26), memo: HIMEJIJO_MEMO_NEW } },
        {
          id: KOUKOEN,
          data: {
            visitTime: t(13, 33),
            memo: KOUKOEN_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 17 }] },
          },
        },
        {
          id: ZOO,
          data: {
            visitTime: t(15, 15),
            memo: ZOO_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
          },
        },
        {
          id: BUNGAKUKAN,
          data: {
            visitTime: t(16, 19),
            memo: BUNGAKUKAN_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 19 }] },
          },
        },
      ],
      { remove: [OTEMAE, KENKYU, OTOKOYAMA], tx }
    );
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

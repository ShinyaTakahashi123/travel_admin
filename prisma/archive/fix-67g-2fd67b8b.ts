/**
 * #67 2fd67b8b。企画運営の指摘(15:50)。D2が天満宮→美術館(中之島)→天神橋筋という
 * 「行って戻るだけ」の並び(決まり4違反)になっていたため、国立国際美術館を外し、
 * 扇町公園→天満宮→天神橋筋→造幣博物館→天守閣→西の丸庭園→豊国神社→歴史博物館
 * という一方向の流れに組み替える。外した美術館の分の時間は、大阪城公園内の実在
 * スポット(西の丸庭園・豊国神社)と、歴史博物館に隣接する難波宮跡公園で埋める。
 * あわせて、造幣博物館の書き出しの口調、大阪城天守閣の書き出し(泉布観の説明を
 * 分離・簡潔化)も修正。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "e063b7c8-86a7-424b-a45a-dfa99436916e";

const SHOTENGAI_MEMO =
  "大阪天満宮から歩いてすぐ、天神橋一丁目から七丁目まで、全長約2.6kmにわたって続く天神橋筋商店街に着きます。一本のアーケード商店街としては日本一の長さともいわれ、端から端まで歩くだけでも、ちょっとした散歩コースになります。この商店街の起源は、大阪天満宮の参道として栄えたことにさかのぼり、江戸時代には近くに「天満青物市場」という市場が置かれていました。これは「天下の台所」と呼ばれた大坂の中でも、特に重要な三大市場のひとつに数えられていたのだそうです。現在も約800もの店が軒を連ねており、昔ながらの大衆食堂や惣菜屋、代々続く刃物屋、明治元年創業という老舗の茶舗から、新しくできたおしゃれなお店まで、新旧さまざまなお店が混在しているのが魅力です。ちょうどお昼どきになるころなので、食べ歩きをしながら、あるいは商店街の食堂で昼食をとるのもおすすめです。お土産を探しながら、活気ある商店街の空気を存分に楽しんでください。散策を終えたら、次は歩いておよそ9分、造幣博物館へ向かいましょう。";

const ZOUHEI_MEMO =
  "天神橋筋商店街から歩いておよそ9分、造幣博物館に着きます。明治時代に建てられた、造幣局の火力発電所だった建物を改装した博物館で、創業当時をしのぶ資料やガス燈をはじめ、大判・小判などの古銭、明治以降に造幣局が製造してきた貨幣、勲章やメダル、外国の貨幣まで、およそ4,000点もの品々が展示されています。れんが造りの重厚な建物そのものも見ごたえがあります。休館日があるので、訪れる前に公式サイトで確かめておくと安心です。見学を終えたら、次は大阪城公園を歩いておよそ27分、大阪城天守閣へ向かいましょう。";

const TENSHUKAKU_MEMO =
  "造幣博物館から大阪城公園を歩いておよそ27分、大阪城天守閣に到着します。天正11年(1583)、天下統一をめざす豊臣秀吉によって築造が始められた大坂城ですが、現在そびえ立つ天守閣は、大坂夏の陣での焼失、江戸時代の落雷による再焼失を経て、昭和6年(1931)に市民の寄付によって復興されたものです。地上55m、5層8階の内部には、豊臣秀吉にゆかりの品々や、大坂城にまつわる資料、甲冑や兜などが展示されているほか、徳川幕府が地中に埋めた豊臣時代の石垣を、地下で見学できるコーナーもあります。最上階の展望台からは、大阪の街並みを見渡すことができます。この後は、歩いておよそ4分、西の丸庭園へ向かいましょう。";

const NISHINOMARU_MEMO =
  "大阪城天守閣から歩いておよそ4分、西の丸庭園に着きます。かつて本丸を守る西の丸御殿があった場所で、現在はおよそ600本のソメイヨシノが植えられた、市内屈指の桜の名所として知られています。芝生が広がる開放的な庭園からは、天守閣を間近に見上げる眺めを楽しめます。庭園内にある「迎賓館」は、かつて内外の賓客をもてなす迎賓施設として建てられたもので、現在も特別な行事の際に利用されています。緑の芝生と天守閣が織りなす景色を、ゆっくりと味わってみてください。この後は、歩いておよそ4分、豊国神社へ向かいましょう。";

const HOKOKU_MEMO =
  "西の丸庭園から歩いておよそ4分、豊国神社に着きます。大坂城の本丸南側に鎮座する神社で、豊臣秀吉・秀頼・秀長の三柱を祀り、出世開運のご利益で知られています。境内には、秀吉の馬印であった千成瓢箪の形を地割に取り入れた庭園「秀石庭」もあります。静かに、敬意をもってお参りください。この後は、歩いておよそ7分、大阪歴史博物館へ向かいましょう。";

const REKISHI_MEMO =
  "豊国神社から歩いておよそ7分、大阪歴史博物館に着きます。NHK大阪放送局の新放送会館との合築施設として平成13年(2001)に開館した博物館で、敷地の地下には、大阪の歴史のルーツとされる古代の宮殿・難波宮の遺構が保存されています。10階の古代フロアから見学をスタートし、中世・近世、近代・現代へと、フロアを下りながら大阪の歴史をたどっていく構成が特徴です。最上階からは、隣接する難波宮跡公園や大阪城の眺めも楽しめます。地下の遺構見学ツアーが実施されていることもあるので、訪れる前に公式サイトで確かめましょう。館の見学のあとは、すぐそばに広がる難波宮跡公園も歩いてみてください。かつての宮殿の柱の跡を示す表示などが残る、広々とした史跡公園です。1400年にわたる大阪の歴史に、じっくりと触れてみてください。2日間の梅田さんぽ旅も、ここで無事に終了です。お疲れさまでした。お帰りは、大阪メトロ谷町線・中央線「谷町四丁目駅」(徒歩およそ3分)からご利用ください。";

async function main() {
  const day2Spots: SpotOrderItem[] = [
    { id: "1e3226ab-406a-4d30-95a2-c00617f44676", data: { visitTime: t(9, 0), stayDurationMin: 30 } }, // 扇町公園
    { id: "e4da007f-9d8d-4c1c-9f99-e18b86ff441b", data: { visitTime: t(9, 40), stayDurationMin: 35 } }, // 大阪天満宮
    {
      id: "94364d94-f7db-4f6c-a987-6da2a2680980", // 天神橋筋商店街
      data: { memo: SHOTENGAI_MEMO, visitTime: t(10, 19), stayDurationMin: 58, transitMode: "walk", transitDurationMin: 4 },
    },
    {
      id: "3fb12224-d134-4d2e-8383-58b842842281", // 造幣博物館
      data: { memo: ZOUHEI_MEMO, visitTime: t(11, 26), stayDurationMin: 45 },
    },
    {
      id: "1607f556-d309-4298-a106-6fdf1edfad5a", // 大阪城天守閣
      data: { memo: TENSHUKAKU_MEMO, visitTime: t(12, 38), stayDurationMin: 75 },
    },
    {
      create: {
        name: "西の丸庭園",
        address: "大阪府大阪市中央区大阪城2",
        lat: 34.6857,
        lng: 135.5242,
        memo: NISHINOMARU_MEMO,
        visitTime: t(13, 57),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "豊国神社",
        address: "大阪府大阪市中央区大阪城2-1",
        lat: 34.6842,
        lng: 135.5264,
        memo: HOKOKU_MEMO,
        visitTime: t(15, 1),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      id: "4b6372e3-a4a2-4900-9ac7-6e85ad5fec0c", // 大阪歴史博物館
      data: { memo: REKISHI_MEMO, visitTime: t(15, 28), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 7 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx, remove: ["990a3437-08dd-41a2-8db8-b9cfbd57713e"] });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

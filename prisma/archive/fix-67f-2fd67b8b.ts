/**
 * #67 2fd67b8b。企画運営の指摘(15:45)。国立国際美術館(開館10:00、公式で確認)に
 * 09:00着になっていたのは決まり7違反。扇町公園→大阪天満宮を先にし、美術館は
 * 10:25着に組み替える(開始時刻は変えず、日程の入れ替えだけで解決)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "e063b7c8-86a7-424b-a45a-dfa99436916e";

const OGIMACHI_MEMO =
  "梅田さんぽ2日目は、緑豊かな扇町公園から始めます。1923年に開園したこの公園ですが、実はこの場所には、かつて堀川監獄という刑務所があったことをご存じでしょうか。1882年に設置されたこの監獄は、高さ10mもの堀に囲まれた施設でしたが、1920年に堺へ移転し、その3年後にあらためて公園として整備されたのが、今の扇町公園なのだと伝えられています。「扇町」という地名は、かつてこの付近を流れていた天満堀川に架かっていた「扇橋」という橋に由来するそうです。水路が交差する場所にY字型に架けられていたことから、扇のような形の橋になったのだといいます。公園内のプールにも歴史があり、1950年には日米の国際水泳選手権を開催するため、わずか5か月という突貫工事で「大阪プール」が建設されました。これが、現在の扇町プールの前身にあたります。刑務所からプールへと、大きく姿を変えてきたこの場所で、少し足を休めてください。次は大阪天満宮へ向かいましょう。";

const TENMANGU_MEMO =
  "扇町公園から歩いておよそ10分、大阪天満宮に着きます。天暦3年(949)、村上天皇の勅命により創建されたと伝えられる神社で、学問の神様・菅原道真公を祀っています。夏に行われる天神祭は、日本三大祭のひとつともいわれる盛大なお祭りで、大川に多くの船が繰り出す船渡御をはじめ、町全体が祭り一色に染まります。すぐそばの天神橋筋商店街は、もともとこの天満宮の参道として発展してきた通りです。境内をゆっくりお参りしたら、静かに、敬意をもって過ごしてください。この後は、電車でおよそ10分、国立国際美術館へ向かいましょう。";

const BIJUTSUKAN_MEMO =
  "大阪天満宮から電車でおよそ10分、国立国際美術館に着きます。実はもともと万博記念公園の中にあった美術館で、1977年に開館しました。その後、建物の老朽化にともなって2004年にこの中之島へと移転し、国内でも珍しい、展示室がすべて地下にあるという構造の美術館として新たに建てられました。地上に出ているのは、ガラス張りの屋根を持つエントランスゲートだけで、そこから地下3階まで続く吹き抜け空間に自然光がたっぷりと降り注ぐ、開放的なつくりになっているのが特徴です。この独特な外観を手がけたのは、アルゼンチン生まれの建築家シーザー・ペリで、ステンレスの曲線的なフォルムには、竹のしなやかな生命力と、現代美術がこれからも発展・成長していく様子がイメージされていると伝えられています。地下2階と3階の展示室には、国内外の現代美術を中心に、約8,300点もの作品が収蔵されています。地上からは想像がつかないほど広々とした地下空間を、ぜひ体感してみてください。見学を終えたら、次は電車でおよそ12分、天神橋筋商店街へ向かいましょう。";

const SHOTENGAI_MEMO_OPENER_FROM = "大阪天満宮から歩いてすぐ、天神橋一丁目から七丁目まで、全長約2.6kmにわたって続く天神橋筋商店街に着きます。";
const SHOTENGAI_MEMO_OPENER_TO = "国立国際美術館から電車でおよそ12分、天神橋一丁目から七丁目まで、全長約2.6kmにわたって続く天神橋筋商店街に着きます。";

async function main() {
  const shotengai = await prisma.spot.findUniqueOrThrow({ where: { id: "94364d94-f7db-4f6c-a987-6da2a2680980" } });
  if (!shotengai.memo!.includes(SHOTENGAI_MEMO_OPENER_FROM)) throw new Error("一致しません(天神橋筋商店街)");
  const shotengaiNewMemo = shotengai.memo!.split(SHOTENGAI_MEMO_OPENER_FROM).join(SHOTENGAI_MEMO_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    {
      id: "1e3226ab-406a-4d30-95a2-c00617f44676", // 扇町公園
      data: { memo: OGIMACHI_MEMO, visitTime: t(9, 0), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      id: "e4da007f-9d8d-4c1c-9f99-e18b86ff441b", // 大阪天満宮
      data: { memo: TENMANGU_MEMO, visitTime: t(9, 40), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 10 },
    },
    {
      id: "990a3437-08dd-41a2-8db8-b9cfbd57713e", // 国立国際美術館
      data: { memo: BIJUTSUKAN_MEMO, visitTime: t(10, 25), stayDurationMin: 84, transitMode: "train", transitDurationMin: 10, transitLine: null },
    },
    {
      id: "94364d94-f7db-4f6c-a987-6da2a2680980", // 天神橋筋商店街
      data: { memo: shotengaiNewMemo, visitTime: t(12, 1), stayDurationMin: 58, transitMode: "train", transitDurationMin: 12, transitLine: null },
    },
    { id: "3fb12224-d134-4d2e-8383-58b842842281", data: { visitTime: t(13, 8), stayDurationMin: 45 } }, // 造幣博物館
    { id: "1607f556-d309-4298-a106-6fdf1edfad5a", data: { visitTime: t(14, 20), stayDurationMin: 75 } }, // 大阪城天守閣
    { id: "4b6372e3-a4a2-4900-9ac7-6e85ad5fec0c", data: { visitTime: t(15, 45), stayDurationMin: 60 } }, // 大阪歴史博物館
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
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * #147 110ab5cb の直し(4回目)。企画運営・法務の指摘。
 * ①企画運営・法務共通: 新潟縣護國神社の「大東亜戦争」は神社の呼び方なので、
 *   地の文としては一般的な「第二次世界大戦(太平洋戦争)」に直す。
 * ②法務: 祈りの一文の前に、しのぶ一文(#186の忠霊塔と同じ扱い)を入れる。
 * ③企画運営: 西海岸公園から新潟駅への戻り方(バス・何分)を具体的に書く。
 *   新潟駅バスターミナルから「附属学校入口」まで新潟交通C20/C21浜浦町線で
 *   およそ15分(ジョルダン乗換案内で確認)。
 *
 * 西海岸公園の座標(市営プールの点)は、企画運営から別の点を探すよう指摘が
 * あったが、Overpass(2つのミラーで確認)には西海岸公園自体のleisure=park
 * タグが存在せず、国土地理院の番地点(学校町通二番町)は既知の公園内施設
 * (プール・野球広場)の点から1km近くずれて不安定なため、今回は変更せず
 * 企画運営に相談中(法務は市営プールの点を既に了承済み)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const GOKOKU_FROM =
  "マリンピア日本海から歩いておよそ3分、新潟縣護國神社に着きます。戊辰役から大東亜戦争にかけて亡くなった新潟県出身の将兵をまつる神社で、クロマツ林に包まれた参道を歩いて社殿へ向かいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、西海岸公園へ向かいましょう。";
const GOKOKU_TO =
  "マリンピア日本海から歩いておよそ3分、新潟縣護國神社に着きます。戊辰戦争から第二次世界大戦(太平洋戦争)までに亡くなった新潟県出身の人々をまつる神社で、クロマツ林に包まれた参道を歩いて社殿へ向かいます。戦争で亡くなった方々をしのぶ場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、西海岸公園へ向かいましょう。";

const NISHIKAIGAN_FROM = "散策を終えたら、新潟駅まで戻りましょう。";
const NISHIKAIGAN_TO = "散策を終えたら、新潟駅バスターミナルまで、新潟交通のバスでおよそ15分戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '110ab5cb%'`);
  const itinId = rows[0].id;
  const gokoku = await findSpotInItinerary(itinId, { spotName: "新潟縣護國神社" });
  const nishikaigan = await findSpotInItinerary(itinId, { spotName: "西海岸公園" });

  if (gokoku.memo !== GOKOKU_FROM) throw new Error("新潟縣護國神社の文言が想定外です");
  if (!nishikaigan.memo?.includes(NISHIKAIGAN_FROM)) throw new Error("西海岸公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: gokoku.id }, data: { memo: GOKOKU_TO } }),
    prisma.spot.update({
      where: { id: nishikaigan.id },
      data: { memo: nishikaigan.memo!.replace(NISHIKAIGAN_FROM, NISHIKAIGAN_TO) },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

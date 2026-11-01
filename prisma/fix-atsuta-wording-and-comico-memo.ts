/**
 * 2件の直し(企画運営の指示、2026-11-02)
 *   1. 熱田神宮(d4fc7a52): 行事の日にち・時刻は書かない決まり(4章)に合わせ、「元日の早朝」を
 *      外して「毎年、年の初めには、新年の無事を祈る歳旦祭が本宮でおこなわれます。」に直す
 *   2. 由布院(27e93f15) COMICO ART MUSEUM YUFUIN: 由布院フローラルヴィレッジを外した組み直しで
 *      湯の坪橋を新規に挿入したが、COMICOの終わりの文が旧い「歩いておよそ9分、湯の坪街道へ」の
 *      まま残っていた(法務の本番確認で発見)。「歩いておよそ5分、湯の坪橋へ」に直す(メモのみ、
 *      時刻・滞在・移動の分は変更なし)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const ATSUTA_ID = "d56465c2-23fe-4667-a6ec-0272b8c96fbc";
const ATSUTA_NAME = "熱田神宮";
const ATSUTA_OLD =
  "名鉄神宮前駅から徒歩3分、名古屋の旅は熱田神宮から始まります。景行天皇43年(113)、日本武尊の妃・宮簀媛命が、夫から託された三種の神器の一つ「草薙神剣」をこの地にまつったのが始まりと伝えられる、1900年以上の歴史を持つ神社です。伊勢神宮に次ぐ格式を持つ神社とされ、古くから「熱田さん」の愛称で親しまれてきました。境内の宝物館「剣の宝庫 草薙館」には、御神体が刀剣であることにちなみ、歴代の為政者や篤志家から奉納された450振り以上の刀剣が収蔵されています。広大な境内には、樹齢1000年を超えるとされる大楠をはじめ、多くの社殿や史跡が点在し、都会の中にありながら静かな祈りの空気に包まれています。静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いて白鳥庭園へ向かいましょう。";
const ATSUTA_NEW =
  "名鉄神宮前駅から徒歩3分、名古屋の旅は熱田神宮から始まります。景行天皇43年(113)、日本武尊の妃・宮簀媛命が、夫から託された三種の神器の一つ「草薙神剣」をこの地にまつったのが始まりと伝えられる、1900年以上の歴史を持つ神社です。伊勢神宮に次ぐ格式を持つ神社とされ、古くから「熱田さん」の愛称で親しまれてきました。境内の宝物館「剣の宝庫 草薙館」には、御神体が刀剣であることにちなみ、歴代の為政者や篤志家から奉納された450振り以上の刀剣が収蔵されています。広大な境内には、樹齢1000年を超えるとされる大楠をはじめ、多くの社殿や史跡が点在し、都会の中にありながら静かな祈りの空気に包まれています。毎年、年の初めには、新年の無事を祈る歳旦祭が本宮でおこなわれます。静かに、敬意をもってお参りしましょう。参拝を終えたら、歩いて白鳥庭園へ向かいましょう。";

const COMICO_ID = "f941000c-0be8-4cd8-8c48-a807b3b86fc0";
const COMICO_NAME = "COMICO ART MUSEUM YUFUIN";
const COMICO_OLD =
  "由布院駅から歩いておよそ11分、COMICO ART MUSEUM YUFUINに着きます。国内外の現役アーティストによる企画展を、季節ごとに入れ替えながら紹介する小さな美術館です。由布院の自然に溶け込むような建物の中で、現代アートをじっくりと鑑賞できます。この後は、歩いておよそ9分、湯の坪街道へ向かいましょう。";
const COMICO_NEW = COMICO_OLD.replace(
  "この後は、歩いておよそ9分、湯の坪街道へ向かいましょう。",
  "この後は、歩いておよそ5分、湯の坪橋へ向かいましょう。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const f of [
    { id: ATSUTA_ID, name: ATSUTA_NAME, oldMemo: ATSUTA_OLD, newMemo: ATSUTA_NEW },
    { id: COMICO_ID, name: COMICO_NAME, oldMemo: COMICO_OLD, newMemo: COMICO_NEW },
  ]) {
    const spot = await prisma.spot.findUniqueOrThrow({ where: { id: f.id } });
    if (spot.name !== f.name) throw new Error(`${f.name}: name不一致`);
    if (spot.memo !== f.oldMemo) throw new Error(`${f.name}: memo現在値が期待と不一致`);
    console.log(`\n[${f.name}]\n旧: ${f.oldMemo}\n\n新: ${f.newMemo}`);
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: ATSUTA_ID }, data: { memo: ATSUTA_NEW } });
    await tx.spot.update({ where: { id: COMICO_ID }, data: { memo: COMICO_NEW } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

/**
 * 法務・企画運営指摘(2026-10-13)の直し、ラウンド2(出典が確認できたもの・
 * できず削除するもの)。
 * 1. #22 奈半利の町並み（昼食）: 「旧弘瀬家住宅は...観光の拠点として使われて
 *    います」は観光サイトの情報のみで公式の裏付けがないため削除。「浜石を積んだ
 *    石塀」は、文化庁の文化遺産オンライン(online.bunka.go.jp/heritages/region/39/39302、
 *    「濱田典彌家住宅石垣塀」の説明に「浜石を用いたコンクリート練積塀」との
 *    記載)で確認できたためそのまま残す(文言を少し整える)
 * 2. #25 田主丸大塚古墳: 「古墳の上に登って」は、久留米市の公式での登頂可否の
 *    確認ができなかったため、「公園から、古墳の形を眺めてみましょう。」に変更
 * 3. #26 春光園: 品種数(7品種・5品種)の出典がcrossroadfukuoka.jp(観光協会系の
 *    紹介サイト)のみで公式(市・園自体)の裏付けがないため削除。時期の言い切りも
 *    「時期は園の案内で確かめましょう」に変更
 * 4. #26 つづら棚田と新川田篭の町並み: 平川家住宅「内部の見学は予約制」の
 *    出典がmapple.net等の観光サイトのみで公式の裏付けがないため削除
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NAHARI_ID = "7c62d14d-06fc-410c-aaab-4f872cc87938";
const KYOHO_ID = "a857e6a8-ada1-4e01-a682-c12626cbff9a";
const SHUNKOEN_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const TSUZURA_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";

const NAHARI_MEMO_NEW =
  "奈半利駅前に広がる町並みです。台風や海からの風雨に備え、白壁を守る「水切瓦」をつけた土佐漆喰の建物や、浜石を使った石塀など、独特の景観が今も残っています。駅前のお店で昼食をとりましょう。";

const KYOHO_MEMO_NEW =
  "田主丸古墳群を構成する、国指定史跡の前方後円墳です。墳丘の全長は103m、後円部の直径は60mあり、6世紀後半の築造と推測され、当時は九州最大級の規模だったともいわれています。平成19年(2007)、古墳を中心に「大塚古墳歴史公園」として整備されました。芝生の広場があり、ヤマザクラやソメイヨシノも植えられています。公園から、古墳の形を眺めてみましょう。";

const SHUNKOEN_MEMO_NEW =
  "うきは市浮羽町山北にある観光農園で、ぶどう・なし狩りを楽しめます。時期は園の案内で確かめましょう。";

const TSUZURA_MEMO_NEW =
  "うきは市浮羽町の山あいに広がる、約7ヘクタール・およそ300枚の棚田です。石積みの多くは約400年前に積まれたものと伝わり、平成11年(1999)には農林水産省の「日本棚田百選」に選ばれました。田に水が張られる初夏や、稲穂が実る秋など、四季折々の表情が楽しめます。このあたり一帯の「新川田篭」地区は、平成24年(2012)に国の重要伝統的建造物群保存地区に選定されており、井手を利用した稲作が営まれる谷あいの集落に、近世以降の寄棟造の茅葺き主屋や、明治時代以降の入母屋造の瓦葺き主屋が残っています。国の重要文化財に指定された、くど造り民家「平川家住宅」もこの地区にあります。実際に稲作が行われ、今も人が暮らす地域ですので、あぜ道や家の敷地には入らず、道路や見晴らしの良い場所から静かに眺めましょう。";

async function main() {
  const nahari = await prisma.spot.findUnique({ where: { id: NAHARI_ID } });
  const kyoho = await prisma.spot.findUnique({ where: { id: KYOHO_ID } });
  const shunkoen = await prisma.spot.findUnique({ where: { id: SHUNKOEN_ID } });
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_ID } });
  if (!nahari || !kyoho || !shunkoen || !tsuzura) throw new Error("想定と違います");

  console.log("[確認OK] 奈半利の町並み（昼食）: 旧弘瀬家住宅の記述を削除、石塀の出典を確認");
  console.log("[確認OK] 田主丸大塚古墳: 登頂の記述を「眺める」に変更");
  console.log("[確認OK] 春光園: 品種数・時期の言い切りを削除");
  console.log("[確認OK] つづら棚田と新川田篭の町並み: 平川家住宅の予約制の記述を削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: NAHARI_ID }, data: { memo: NAHARI_MEMO_NEW } });
  await prisma.spot.update({ where: { id: KYOHO_ID }, data: { memo: KYOHO_MEMO_NEW } });
  await prisma.spot.update({ where: { id: SHUNKOEN_ID }, data: { memo: SHUNKOEN_MEMO_NEW } });
  await prisma.spot.update({ where: { id: TSUZURA_ID }, data: { memo: TSUZURA_MEMO_NEW } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

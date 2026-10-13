/**
 * #4の直し直し。企画運営の指摘(2026-10-13)に対応。
 * 1. あすかいちご狩りパークのメモが、#1〜#3の決まり(出典名・運営の団体名・お金の話を
 *    出さない、「〜しましょう」調)を反映していなかったため直す
 * 2. ぼかしを同じ文に: 説明文「日本最古の仏像」・飛鳥寺「日本最古の本格的な仏教寺院」・
 *    岡寺「日本最初の厄除け霊場」
 * 3. 万葉文化館（昼食）の「で」の重なりを直す
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "14a5c98b-444e-4431-8997-f4694aa19afe";
const DAY_ID = "bfe1386c-a512-4723-b195-a67fd732e311";
const ICHIGO_SPOT_ID = "b332cfde-3c1d-4a86-9caa-bed5fe41f654";
const ASUKADERA_SPOT_ID = "7972da74-e6fd-4573-ac32-8facd89dd0e4";

const NEW_DESCRIPTION =
  "明日香村のいちご狩りパークで「あすかルビー」を味わったあと、蘇我馬子の墓と伝わる特別史跡・石舞台古墳、日本最古とされる仏像「飛鳥大仏」で知られる飛鳥寺をめぐります。奈良県立万葉文化館で昼食をとり、甘樫丘、聖徳太子の誕生地と伝わる橘寺、西国三十三所の岡寺、高松塚壁画館をめぐる、飛鳥の歴史を感じる日帰りプランです。";

const ICHIGO_MEMO =
  "村内17か所ほどの農園に分かれたいちご狩りパークです。当日はまず受付でいちご狩りの申し込みをすませてから、案内される農園へ向かいます。明日香村特産のブランドいちご「あすかルビー」を、高設栽培で立ったまま摘み取れます。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、このいちご狩りパークの中だけにしましょう。観光農園以外の畑には入らないようにしましょう。";

async function main() {
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const asukadera = await prisma.spot.findUnique({ where: { id: ASUKADERA_SPOT_ID } });
  const manyo = await prisma.spot.findFirst({ where: { name: "万葉文化館（昼食）", dayId: DAY_ID } });
  const oka = await prisma.spot.findFirst({ where: { name: "岡寺", dayId: DAY_ID } });
  if (!ichigo || !asukadera?.memo || !manyo?.memo || !oka?.memo) throw new Error("想定と違います");

  const newAsukaderaMemo = asukadera.memo.replace("日本最古の本格的な仏教寺院です。", "日本最古の本格的な仏教寺院とされています。");
  const newManyoMemo = manyo.memo.replace("館内の飲食施設で、ここで昼食をとりましょう。", "館内の飲食施設で昼食をとりましょう。");
  const newOkaMemo = oka.memo.replace("「日本最初の厄除け霊場」として知られています。", "「日本最初の厄除け霊場」とされています。");
  if (newAsukaderaMemo === asukadera.memo || newManyoMemo === manyo.memo || newOkaMemo === oka.memo) {
    throw new Error("置換対象が見つかりません");
  }

  console.log("[確認OK] いちごの森のメモを#1〜#3の形に直す");
  console.log("[確認OK] 説明文・飛鳥寺・岡寺のぼかしを直す");
  console.log("[確認OK] 万葉文化館（昼食）の「で」の重なりを直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: ASUKADERA_SPOT_ID }, data: { memo: newAsukaderaMemo } });
  await prisma.spot.update({ where: { id: manyo.id }, data: { memo: newManyoMemo } });
  await prisma.spot.update({ where: { id: oka.id }, data: { memo: newOkaMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

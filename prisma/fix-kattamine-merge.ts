/**
 * 刈田嶺神社の3件の整理(企画運営 2026-10-13 判断、ユーザーの決まり「県の境の場所は、
 * 県ごとに分ける」に合わせる)。
 * - 宮城県の「刈田嶺神社奥宮」(90cd0904、スポット1件)と「刈田嶺神社（刈田岳山頂）」
 *   (cea7aca3、別名:奥宮、スポット1件)は同じ場所(刈田岳山頂の奥宮)なので1件にまとめる。
 *   残す方(cea7aca3)の名前を「刈田嶺神社奥宮（刈田岳山頂）」にし、もう一方の呼び方
 *   「刈田嶺神社奥宮」を別名に追加。スポットを付け替えてから、空になった90cd0904を消す。
 * - 山形県扱いの「刈田嶺神社」(174590e5)は県ごとに分ける決まりのとおり残すが、
 *   名前を「刈田嶺神社奥宮（刈田岳山頂・山形県側）」に直す。
 * ※「遠刈田温泉」(2e873bb0)と「刈田嶺神社（宮城県刈田郡蔵王町）」(里宮、f4393121)は
 *   別の場所なので対象外。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const OKUMIYA_MIYAGI_ID = "90cd0904-b1cf-470b-9010-3ce4add6a19a"; // 刈田嶺神社奥宮(宮城県)→消す
const SANCHO_ID = "cea7aca3-fb54-4c62-8672-d457472935ea"; // 刈田嶺神社（刈田岳山頂）→残す・名前変更
const YAMAGATA_ID = "174590e5-a032-4264-9136-f09430142d03"; // 刈田嶺神社(山形県)→名前変更

async function main() {
  const okumiya = await prisma.placeMaster.findUnique({ where: { id: OKUMIYA_MIYAGI_ID }, include: { spots: true } });
  const sancho = await prisma.placeMaster.findUnique({ where: { id: SANCHO_ID }, include: { aliases: true, spots: true } });
  const yamagata = await prisma.placeMaster.findUnique({ where: { id: YAMAGATA_ID } });
  if (!okumiya || okumiya.name !== "刈田嶺神社奥宮") throw new Error("想定と違います: 刈田嶺神社奥宮(宮城県)");
  if (!sancho || sancho.name !== "刈田嶺神社（刈田岳山頂）") throw new Error("想定と違います: 刈田嶺神社（刈田岳山頂）");
  if (!yamagata || yamagata.name !== "刈田嶺神社") throw new Error("想定と違います: 刈田嶺神社(山形県)");
  if (okumiya.spots.length !== 1 || sancho.spots.length !== 1) throw new Error("スポット件数が想定と違います");

  console.log("[確認OK] 刈田嶺神社奥宮(宮城県,スポット1件) を 刈田嶺神社（刈田岳山頂）に統合 → 名前「刈田嶺神社奥宮（刈田岳山頂）」、別名に「刈田嶺神社奥宮」を追加、元の行を削除");
  console.log("[確認OK] 刈田嶺神社(山形県) → 名前「刈田嶺神社奥宮（刈田岳山頂・山形県側）」に変更");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: okumiya.spots[0].id }, data: { placeMasterId: SANCHO_ID } });
  await prisma.placeMasterAlias.create({ data: { placeMasterId: SANCHO_ID, alias: "刈田嶺神社奥宮" } });
  await prisma.placeMaster.update({ where: { id: SANCHO_ID }, data: { name: "刈田嶺神社奥宮（刈田岳山頂）" } });
  await prisma.placeMaster.delete({ where: { id: OKUMIYA_MIYAGI_ID } });
  await prisma.placeMaster.update({ where: { id: YAMAGATA_ID }, data: { name: "刈田嶺神社奥宮（刈田岳山頂・山形県側）" } });

  console.log("  COMMITTED: 刈田嶺神社の整理");
}
main().finally(() => prisma.$disconnect());

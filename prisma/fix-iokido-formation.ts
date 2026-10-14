/**
 * 伊尾木洞の「成り立ち」の記述を、公式(安芸市・高知県・文化庁)の出典が
 * 確かめられなかったため、両方のしおりから削除する(企画運営指示、2026-10-14)。
 * 対象はidで指定。#22(55e932b6...)は公開中のしおりのため、メモの完全一致を
 * 確認してから書きかえる。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-iokido-formation.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-iokido-formation.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK3_IOKIDO_ID = "ca2d225c-e74c-4c25-98b0-df1a36528cc3";
const SHIEN22_IOKIDO_ID = "e580b545-6cf1-4c27-8c39-156d681aa0c6";

const BOOK3_OLD =
  "安芸市伊尾木にある、波の浸食でできた海食洞です。暖地性のシダ植物が群生する「伊尾木洞シダ群落」として、国の天然記念物に指定されています。洞内には川が流れているので、濡れてもよい靴で歩きましょう。";
const BOOK3_NEW =
  "安芸市伊尾木にある洞窟です。暖地性のシダ植物が群生する「伊尾木洞シダ群落」として、国の天然記念物に指定されています。洞内には川が流れているので、濡れてもよい靴で歩きましょう。";

const SHIEN22_OLD =
  "大正15年(1926)、国の天然記念物に指定された洞窟です。かつて海中で堆積した地層が隆起し、渓谷の水に浸食されてできた天然の洞窟で、延長約40m、幅約4m、高さ約5mあり、年間を通じて約20度に保たれています。ホウビシダ、ホウライシダ、ノコギリシダ、コモチシダ、クリハラン、シロヤマゼンマイ、マツザカシダの7種類のシダが群生しており、これらが天然記念物に指定されています。入口から洞内まで遊歩道が続きますが、ぬかるみもあるため、長靴があると安心です。";
const SHIEN22_NEW =
  "大正15年(1926)、国の天然記念物に指定された洞窟です。延長約40m、幅約4m、高さ約5mあり、年間を通じて約20度に保たれています。ホウビシダ、ホウライシダ、ノコギリシダ、コモチシダ、クリハラン、シロヤマゼンマイ、マツザカシダの7種類のシダが群生しており、これらが天然記念物に指定されています。入口から洞内まで遊歩道が続きますが、ぬかるみもあるため、長靴があると安心です。";

async function main() {
  const book3 = await prisma.spot.findUnique({ where: { id: BOOK3_IOKIDO_ID } });
  const shien22 = await prisma.spot.findUnique({ where: { id: SHIEN22_IOKIDO_ID } });
  if (!book3 || book3.memo !== BOOK3_OLD) throw new Error("想定と違います(#10)");
  if (!shien22 || shien22.memo !== SHIEN22_OLD) throw new Error("想定と違います(#22、公開中)");

  console.log("[確認OK] #10・#22ともメモが想定どおり一致。成り立ちの一文を削除");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: BOOK3_IOKIDO_ID }, data: { memo: BOOK3_NEW } });
  await prisma.spot.update({ where: { id: SHIEN22_IOKIDO_ID }, data: { memo: SHIEN22_NEW } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

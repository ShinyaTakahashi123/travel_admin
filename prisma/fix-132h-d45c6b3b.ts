/**
 * #132 d45c6b3bの直し(8回目)。企画運営(2026-10-11)の指摘。
 *
 * 白石城「予約をすれば、片倉小十郎景綱らの甲冑を再現した衣装を着て、
 * 記念撮影ができる体験」の出典を、開いて確かめられるURLで再確認した。
 * - gltjp.com/ja/directory/item/12590/(開いて確認): 甲冑を着て場内で
 *   写真撮影するオプション(要予約)があるとのことだが、誰の甲冑かは
 *   書かれていない。
 * - japankuru.com/?p=73384(開いて確認): 白石城1階で、予約不要・無料の
 *   甲冑体験が毎日行われているとのことだが、2018年の記事で、名前が
 *   出ている甲冑は真田家のみ(片倉小十郎の甲冑は明記されていない)。
 * 「片倉小十郎景綱らの」「予約をすれば」という具体的な部分は、開いた
 * URLで確かめられなかったため、確かめられた「甲冑を着て記念撮影が
 * できる体験がある」という範囲まで一般化する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "予約をすれば、片倉小十郎景綱らの甲冑を再現した衣装を着て、記念撮影ができる体験も用意されています。";
const TO = "甲冑を着て、記念撮影ができる体験も用意されています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;
  const shiroishijo = await findSpotInItinerary(itinId, { spotName: "白石城" });

  if (!shiroishijo.memo?.includes(FROM)) throw new Error("白石城の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shiroishijo.id }, { memo: shiroishijo.memo!.replace(FROM, TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

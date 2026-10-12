/**
 * #60 fb4c9c64（有田・伊万里）企画運営の指摘(2026-09-30 12:35): 窯元通りが
 * 70→85分に延びていた(町なかを縮めた分の移り先)。70分に戻し、空いた15分は
 * 伝統産業会館の絵付け体験(35→50分、本文に時間の余裕をとる一言を追加)にあてる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "fb4c9c64-c7cb-4f7a-addd-c6eec4080b84";

async function main() {
  const kamamotodori = await findSpotInItinerary(ITIN, { spotName: "大川内山の窯元通り" });
  console.log("窯元通り 現在stay:", kamamotodori.stayDurationMin, "→ 70");

  const sangyokaikan = await findSpotInItinerary(ITIN, { spotName: "伊万里・有田焼伝統産業会館" });
  const from = "館内では、湯のみや皿などに絵付けを行う体験もでき、自分だけの器を作れます。";
  const to = "館内では、湯のみや皿などに絵付けを行う体験もでき、自分だけの器を作れます。絵付けを体験するなら、時間に余裕を持って訪れましょう。";
  if (!sangyokaikan.memo!.includes(from)) throw new Error("一致しません(伝統産業会館)");
  const newSangyokaikanMemo = sangyokaikan.memo!.split(from).join(to);
  console.log("伝統産業会館 現在stay:", sangyokaikan.stayDurationMin, "→ 50、絵付けの一言追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITIN, { spotId: kamamotodori.id }, { stayDurationMin: 70 }, { tx });
    await updateSpotInItinerary(ITIN, { spotId: sangyokaikan.id }, { memo: newSangyokaikanMemo, visitTime: t(15, 42), stayDurationMin: 50 }, { tx });
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

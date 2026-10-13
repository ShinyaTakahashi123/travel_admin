/**
 * #26(258b3878)の直し(企画運営・法務指摘、2026-10-13)。
 * 1. 水神社の「天保13年(1842)建立」は、Wikidataしか裏付けがなく(企画運営の
 *    判断でWikidataは事実の出典にはしない)、うきは市・県の公式でも確認できな
 *    かったため削除。結びも決まりの形「今も祈りが続く場所ですので、静かに、
 *    敬意をもってお参りください。」に修正
 * 2. つづら棚田と新川田篭の町並み(108分)を90分に短縮し、空いた18分を、
 *    居蔵の館(12分、館内の部屋・調度品をゆっくり見る時間として)と水神社
 *    (6分、小さな神社だが境内を含めて)に分けて加える
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const IGURA_ID = "ef991f1d-a925-4c5c-b8f4-666fb36fbf2c";
const MIZUJINJA_LEG_ID_LOOKUP_NAME = "水神社";
const CHOON_ID = "9601df4c-92f0-485f-ba10-1d919a8e3e37";
const EKI_UKIHA_ID = "5bda41e2-6fbd-4ca9-9dcf-48e08ce2e203";
const SHUNKOEN_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const TSUZURA_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";

const MIZUJINJA_MEMO_NEW =
  "吉井の町並みの一角に鎮座する、小さな神社です。地域の水を見守る神様として、今も大切にされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const igura = await prisma.spot.findUnique({ where: { id: IGURA_ID } });
  const mizujinja = await prisma.spot.findFirst({ where: { name: MIZUJINJA_LEG_ID_LOOKUP_NAME, dayId: igura?.dayId } });
  const choon = await prisma.spot.findUnique({ where: { id: CHOON_ID } });
  const ekiUkiha = await prisma.spot.findUnique({ where: { id: EKI_UKIHA_ID } });
  const shunkoen = await prisma.spot.findUnique({ where: { id: SHUNKOEN_ID } });
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_ID } });
  if (!igura || !mizujinja || !choon || !ekiUkiha || !shunkoen || !tsuzura) throw new Error("想定と違います");

  console.log("[確認OK] 居蔵の館の滞在:", igura.stayDurationMin, "→ 62分");
  console.log("[確認OK] 水神社のメモを書きかえ(建立年を削除、祈りの一文を決まりの形に)、滞在:", mizujinja.stayDurationMin, "→ 21分");
  console.log("[確認OK] つづら棚田と新川田篭の町並みの滞在:", tsuzura.stayDurationMin, "→ 90分");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: IGURA_ID }, data: { stayDurationMin: 62 } });
  await prisma.spot.update({
    where: { id: mizujinja.id },
    data: { memo: MIZUJINJA_MEMO_NEW, stayDurationMin: 21, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 37)) },
  });
  await prisma.spot.update({ where: { id: CHOON_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 11)) } });
  await prisma.spot.update({ where: { id: EKI_UKIHA_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 11)) } });
  await prisma.spot.update({ where: { id: SHUNKOEN_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 14)) } });
  await prisma.spot.update({
    where: { id: TSUZURA_ID },
    data: { stayDurationMin: 90, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)) },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

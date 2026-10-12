/**
 * #14 7f972333 依水園と般若寺、奈良の穴場庭園と花の寺を訪ねる日帰り旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7f972333%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "依水園",
    "皆様、本日は奈良の穴場ともいえる庭園、依水園からご案内いたします。",
    "旅の始まりは、奈良の穴場ともいえる庭園、依水園です。",
    "依水園(書き出し)"
  );
  await fixOne(
    "依水園",
    "塀の外に広がる景色と庭とが一体になったような、奥行きのある眺めをお楽しみいただけます。池の水面に映る木々や空の色も美しく、四季を通じて表情を変える庭園です。ゆっくりと歩を進めながら、静かなひとときをお過ごしくださいませ。さて、庭園から眺めていただいた東大寺の南大門を、これから実際に間近でご覧いただきましょう。",
    "塀の外に広がる景色と庭とが一体になったような、奥行きのある眺めを楽しめます。池の水面に映る木々や空の色も美しく、四季を通じて表情を変える庭園です。ゆっくりと歩を進めながら、静かなひとときを過ごしましょう。この後は、庭園から眺めた東大寺の南大門を、実際に間近で見に行きましょう。",
    "依水園(結び)"
  );
  await fixOne(
    "東大寺",
    "先ほど依水園の庭園越しにご覧いただいた南大門を、いよいよ間近でお楽しみいただきます。743年、聖武天皇は国の困難を仏の力で鎮めようと、大仏（盧舎那仏）造立の詔を出されたと伝わっております。",
    "先ほど依水園の庭園越しに見た南大門を、いよいよ間近で見ることができます。743年、聖武天皇は国の困難を仏の力で鎮めようと、大仏（盧舎那仏）造立の詔を出したと伝わっています。",
    "東大寺(書き出し)"
  );
  await fixOne(
    "東大寺",
    "庭園から見た姿とはまた違った、堂々たる迫力をお感じいただけることでしょう。",
    "庭園から見た姿とはまた違った、堂々たる迫力を感じられます。",
    "東大寺(中盤)"
  );
  await fixOne(
    "東大寺",
    "大仏様の前では、どうぞ静かに、敬意をもってお過ごしくださいませ。それでは最後に、花の寺として親しまれる般若寺へご案内いたします。",
    "大仏様の前では、静かに、敬意をもってお参りください。この後は、花の寺として親しまれる般若寺へ向かいましょう。",
    "東大寺(結び)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());

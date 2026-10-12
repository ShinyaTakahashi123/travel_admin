/**
 * #21 feb07068 石舞台古墳と明日香の里山、飛鳥の自然と歴史を満喫する
 * 1泊2日。企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'feb07068%'`);
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
    "石舞台古墳",
    "皆様、明日香村の自然を満喫する旅、まずご案内するのは石舞台古墳です。",
    "明日香村の自然を満喫する旅の始まりは、石舞台古墳です。",
    "石舞台古墳(書き出し)"
  );
  await fixOne(
    "石舞台古墳",
    "現在も石室の中に入っていただくことができますので、ゆっくりと巨石の迫力をお楽しみください。なお春には、桜の開花にあわせて夜桜とともにライトアップが行われることもあります。日中の今は、周囲の田園風景とあわせて、のどかな明日香村の空気をゆっくりと味わっていただければと思います。それでは、次の橘寺へとまいりましょう。",
    "現在も石室の中に入ることができるので、ゆっくりと巨石の迫力を楽しんでください。なお春には、桜の開花にあわせて夜桜とともにライトアップが行われることもあります。日中の今は、周囲の田園風景とあわせて、のどかな明日香村の空気をゆっくりと味わってみてください。この後は、次の橘寺へ向かいましょう。",
    "石舞台古墳(結び)"
  );
  await fixOne(
    "橘寺",
    "続いてご案内するのは、橘寺でございます。聖徳太子がお生まれになったと伝えられる地で、",
    "続いて訪れるのは、橘寺です。聖徳太子が生まれたと伝えられる地で、",
    "橘寺(書き出し)"
  );
  await fixOne(
    "橘寺",
    "境内でゆっくりご覧いただきたいのが「二面石」です。",
    "境内でゆっくり見ておきたいのが「二面石」です。",
    "橘寺(中盤)"
  );
  await fixOne(
    "橘寺",
    "田園風景に囲まれた静かな境内は、明日香村ならではののどかな時間を感じられる場所でもございます。太子ゆかりの祈りの場ですので、静かに、敬意をもってお過ごしください。ゆっくりとお参りいただきましたら、続いては本尊の観音様で知られる岡寺へと足をお運びください。",
    "田園風景に囲まれた静かな境内は、明日香村ならではののどかな時間を感じられる場所でもあります。太子ゆかりの祈りの場ですので、静かに、敬意をもってお過ごしください。この後は、本尊の観音様で知られる岡寺へ向かいましょう。",
    "橘寺(結び)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());

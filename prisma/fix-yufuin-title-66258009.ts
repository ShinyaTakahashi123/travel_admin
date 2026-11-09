/**
 * 湯布院(66258009)のタイトル・説明文の直し(2026-11-03)。
 * 「定番」「穴場」(使わない言葉、3章)を外す。点・時刻・滞在・各スポットの文は変えない。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "66258009-2007-49b0-a1b5-fdb3131a4b15";

const TITLE_OLD = "由布院駅と金鱗湖、由布院温泉の定番と穴場をめぐるプラン";
const TITLE_NEW = "由布院駅と金鱗湖、由布岳のふもとの寺社をめぐる由布院さんぽプラン";

const DESC_OLD =
  "磯崎新設計の由布院駅から、隈研吾設計のCOMICO ART MUSEUM YUFUIN、由布岳の山里の古刹・佛山寺、由布院を代表する金鱗湖と天祖神社、湯の坪街道、音楽と美術のアルテジオ、大杉で知られる大杵社、宇奈岐日女神社、由布院盆地を一望する狭霧台まで。由布院温泉の定番と穴場を一日で巡るプランです。";
const DESC_NEW =
  "磯崎新設計の由布院駅から、隈研吾設計のCOMICO ART MUSEUM YUFUIN、由布岳の山里の古刹・佛山寺、由布院を代表する金鱗湖と天祖神社、湯の坪街道、音楽と美術のアルテジオ、大杉で知られる大杵社、宇奈岐日女神社、由布院盆地を一望する狭霧台まで。由布院温泉の見どころを一日で巡るプランです。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.title !== TITLE_OLD) throw new Error("タイトル: 現在値が期待と不一致");
  if (itin.description !== DESC_OLD) throw new Error("説明文: 現在値が期待と不一致");

  console.log(`\n旧タイトル: ${TITLE_OLD}`);
  console.log(`新タイトル: ${TITLE_NEW}`);
  console.log(`\n旧説明文: ${DESC_OLD}`);
  console.log(`新説明文: ${DESC_NEW}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

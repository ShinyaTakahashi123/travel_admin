/**
 * #79 90e7362b 石打丸山の絶景テラスと苗場ドラゴンドラ、季節の絶景を楽しむ
 * 越後湯沢1泊2日。企画運営(2026-10-01 06:27)の口調直し。
 * 時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
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
    "ザ・ヴェランダ石打丸山",
    "皆様、本日ご案内するのはザ・ヴェランダ石打丸山です。",
    "旅の始まりはザ・ヴェランダ石打丸山です。",
    "ザ・ヴェランダ石打丸山(書き出し)"
  );
  await fixOne(
    "ザ・ヴェランダ石打丸山",
    "冬とは全く違う、緑あふれる高原の絶景をどうぞお楽しみください。",
    "冬とは全く違う、緑あふれる高原の絶景をゆっくり楽しんでください。",
    "ザ・ヴェランダ石打丸山(結び)"
  );
  await fixOne(
    "西福寺開山堂",
    "透かし彫りの繊細さと極彩色の鮮やかさに満ちた作品の数々をじっくりとご覧ください。",
    "透かし彫りの繊細さと極彩色の鮮やかさに満ちた作品の数々をじっくりと眺めてください。",
    "西福寺開山堂"
  );
  await fixOne(
    "池田記念美術館",
    "アート・文学・スポーツと幅広いテーマのコレクションをゆっくりお楽しみください。休館日は公式サイトで確かめてから訪れましょう。この後は、宿へ戻ってゆっくりお休みください。旅の1日目は、ここで終了です。お疲れさまでした。",
    "アート・文学・スポーツと幅広いテーマのコレクションをゆっくり楽しんでください。休館日は公式サイトで確かめてから訪れましょう。この後は、宿へ戻ってゆっくりお休みください。旅の1日目は、ここで終わりです。",
    "池田記念美術館"
  );
  await fixOne(
    "苗場ドラゴンドラ",
    "旅の2日目にご案内するのは苗場ドラゴンドラです。",
    "旅の2日目は苗場ドラゴンドラからです。",
    "苗場ドラゴンドラ(書き出し)"
  );
  await fixOne(
    "苗場ドラゴンドラ",
    "標高差およそ425メートルを行き来しながら、四季の移ろいを空から堪能する、贅沢な空中散歩をお楽しみください。",
    "標高差およそ425メートルを行き来しながら、四季の移ろいを空から感じる、贅沢な空中散歩を楽しんでください。",
    "苗場ドラゴンドラ(結び)"
  );
  await fixOne(
    "諏訪神社",
    "旅の2日目は、ここで終了です。お疲れさまでした。お帰りは、越後湯沢駅からご利用ください。",
    "旅の2日目は、ここで終わりです。お帰りは、越後湯沢駅からご利用ください。",
    "諏訪神社(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());

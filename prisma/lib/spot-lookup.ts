/**
 * スポットの本文（メモ・座標・移動手段など）だけを直すときの安全な検索・更新関数。
 *
 * `prisma.spot.findFirst({ where: { name: "..." } })` のように、しおり・日を指定せず
 * スポット名だけで検索すると、同名スポットが別のしおりにもあった場合、意図しない
 * しおりのスポットを書きかえてしまう事故につながる。(2026-09-29、制作補助が#273の
 * 「甲州夢小路」を検索した際、補助2の別のしおり#375にも同名スポットがあり、誤って
 * ヒットしかけた。置換文字列が実際には存在しなかったため中身は変わらず実害はなかったが、
 * 同種の取り違えは制作の過去2回と合わせて3回目のため、道具で構造的に防ぐ)
 *
 * 使い方: そのしおりのID・日番号（わかれば）・スポット名またはスポットIDを渡す。
 * 該当が0件・2件以上のときはエラーにする（0件なら名前の誤り、2件以上なら日番号を
 * 指定するかspotIdを使うことで絞り込む）。
 *
 * 例:
 *   await updateSpotInItinerary(
 *     "1d70017a-...",
 *     { dayNumber: 1, spotName: "鳥羽城跡" },
 *     { stayDurationMin: 30 }
 *   );
 *
 * 今後、しおりIDを伴わずスポット名だけで検索する書き方（`spot.findFirst`/`findMany`の
 * whereに`day: { itineraryId }`が入っていないもの）は使わない決まりとする。
 */
import { prisma } from "../../src/lib/prisma";
import type { Prisma } from "@prisma/client";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export type SpotLocator =
  | { spotId: string; dayNumber?: number }
  | { spotName: string; dayNumber?: number };

async function findOne(itineraryId: string, locator: SpotLocator, tx: TxClient) {
  const dayWhere = locator.dayNumber != null ? { itineraryId, dayNumber: locator.dayNumber } : { itineraryId };

  const matches =
    "spotId" in locator
      ? await tx.spot.findMany({ where: { id: locator.spotId, day: dayWhere } })
      : await tx.spot.findMany({ where: { name: locator.spotName, day: dayWhere } });

  if (matches.length === 0) {
    const where = "spotId" in locator ? `spotId=${locator.spotId}` : `spotName=${locator.spotName}`;
    throw new Error(
      `updateSpotInItinerary: しおり(${itineraryId})${locator.dayNumber != null ? `のday${locator.dayNumber}` : ""}に、${where} に一致するスポットが見つかりません。名前の誤字や、日番号の指定漏れを確認してください。`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `updateSpotInItinerary: しおり(${itineraryId})で、spotName=${"spotName" in locator ? locator.spotName : ""} に一致するスポットが${matches.length}件見つかりました(id: ${matches.map((s) => s.id).join(", ")})。dayNumberを指定するか、spotIdで直接指定してください。`
    );
  }
  return matches[0];
}

/** そのしおり(・日)の中だけでスポットを1件検索して返す。見つからない/複数見つかる場合はエラー */
export async function findSpotInItinerary(
  itineraryId: string,
  locator: SpotLocator,
  options?: { tx?: TxClient }
) {
  if (options?.tx) return findOne(itineraryId, locator, options.tx);
  return findOne(itineraryId, locator, prisma as unknown as TxClient);
}

/** そのしおり(・日)の中だけでスポットを1件検索し、本文(orderNo・dayId以外)を更新する */
export async function updateSpotInItinerary(
  itineraryId: string,
  locator: SpotLocator,
  data: Omit<Prisma.SpotUpdateInput, "orderNo" | "day" | "dayId">,
  options?: { tx?: TxClient }
): Promise<void> {
  const run = async (tx: TxClient) => {
    const spot = await findOne(itineraryId, locator, tx);
    await tx.spot.update({ where: { id: spot.id }, data });
  };

  if (options?.tx) {
    await run(options.tx);
  } else {
    await prisma.$transaction((tx) => run(tx));
  }
}

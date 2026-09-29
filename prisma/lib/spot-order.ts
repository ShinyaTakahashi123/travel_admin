/**
 * スポットの並び替え・差し込みを安全に行うための共通関数。
 *
 * `@@unique([dayId, orderNo])` の制約があるため、既存スポットの並びの途中に新しいスポットを
 * 差し込むときは、先に既存スポットを大きな番号へ退避させてから作り直さないと、P2002の
 * 重複エラーでスクリプトが途中終了し、一部だけ反映された中途半端な状態がDBに残ってしまう。
 * (2026-09-29、#115・#127・#135・#145・#198 で計5回発生。手作業での注意には限界があるため、
 * この関数を必ず経由することでミスを構造的になくす)
 *
 * 安全のための決まり(2026-09-29 企画運営の指摘で追加):
 * 1. 全体を1つのトランザクションで行う。途中で失敗すれば全体が元に戻り、9000番台のまま
 *    残ることはない
 * 2. 渡された{id}が、すべて指定したdayIdのスポットであることを先に確かめる。違えば
 *    何もせずエラーにする(=同名スポットを別のしおりに誤って書きかえる事故を構造的に防ぐ)
 * 3. そのdayの既存スポットのうち、spots配列にもremoveにも入っていないものがあればエラーに
 *    する(入れ忘れて9000番台のまま残ることを防ぐ)。消したいスポットはremoveに明示する
 *
 * 使い方: そのしおりのその日の、最終的な並び順どおりにspotsを渡す。
 * 既存スポットを残す/直す場合は{ id, data }、新規に作る場合は{ create }を使う。
 * 配列の並び順がそのままorderNo(1始まり)になる。削除したい既存スポットはremoveに列挙する。
 */
import { prisma } from "../../src/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SpotOrderItem =
  | { id: string; data: Omit<Prisma.SpotUpdateInput, "orderNo" | "day" | "dayId"> }
  | { create: Omit<Prisma.SpotUncheckedCreateInput, "orderNo" | "dayId"> };

export async function setDaySpotOrder(
  dayId: string,
  spots: SpotOrderItem[],
  options?: { remove?: string[] }
): Promise<void> {
  const remove = options?.remove ?? [];

  await prisma.$transaction(async (tx) => {
    const current = await tx.spot.findMany({ where: { dayId }, select: { id: true } });
    const currentIds = new Set(current.map((s) => s.id));

    // 2. spotsに渡されたidが、すべてこのdayIdのものか確かめる
    const givenIds = spots.filter((s): s is Extract<SpotOrderItem, { id: string }> => "id" in s).map((s) => s.id);
    for (const id of givenIds) {
      if (!currentIds.has(id)) {
        throw new Error(
          `setDaySpotOrder: スポットID ${id} は指定したday(${dayId})に属していません。別のしおり/日のスポットを誤って渡していないか確認してください。`
        );
      }
    }

    // 3. このdayの既存スポットのうち、spotsにもremoveにも入っていないものがあればエラー
    const coveredIds = new Set([...givenIds, ...remove]);
    const missing = [...currentIds].filter((id) => !coveredIds.has(id));
    if (missing.length > 0) {
      throw new Error(
        `setDaySpotOrder: 既存スポット ${missing.join(", ")} がspots・removeのどちらにも入っていません。残す場合はspotsに、消す場合はremoveに明示してください。`
      );
    }
    if (remove.some((id) => !currentIds.has(id))) {
      throw new Error(`setDaySpotOrder: removeに指定したIDの中に、このdayに属さないものがあります。`);
    }

    // 1. 全件を大きな番号(9000番台)へ退避
    const currentArr = [...currentIds];
    for (let i = 0; i < currentArr.length; i++) {
      await tx.spot.update({ where: { id: currentArr[i] }, data: { orderNo: 9000 + i } });
    }

    // 削除対象を消す
    for (const id of remove) {
      await tx.spot.delete({ where: { id } });
    }

    // 渡された最終順序どおりに、上から1,2,3...で作成・更新する
    for (let i = 0; i < spots.length; i++) {
      const item = spots[i];
      const orderNo = i + 1;
      if ("id" in item) {
        await tx.spot.update({ where: { id: item.id }, data: { ...item.data, orderNo } });
      } else {
        await tx.spot.create({ data: { ...item.create, dayId, orderNo } });
      }
    }
  });
}

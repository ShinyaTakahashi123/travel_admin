/**
 * スポットの並び替え・差し込みを安全に行うための共通関数。
 *
 * `@@unique([dayId, orderNo])` の制約があるため、既存スポットの並びの途中に新しいスポットを
 * 差し込むときは、先に既存スポットを大きな番号へ退避させてから作り直さないと、P2002の
 * 重複エラーでスクリプトが途中終了し、一部だけ反映された中途半端な状態がDBに残ってしまう。
 * (2026-09-29、#115・#127・#135・#145・#198 で計5回発生。手作業での注意には限界があるため、
 * この関数を必ず経由することでミスを構造的になくす)
 *
 * 使い方: そのしおりのその日の、最終的な並び順どおりにspotsを渡す。
 * 既存スポットを残す/直す場合は{ id, data }、新規に作る場合は{ create }を使う。
 * 配列の並び順がそのままorderNo(1始まり)になる。
 */
import { prisma } from "../../src/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SpotOrderItem =
  | { id: string; data: Omit<Prisma.SpotUpdateInput, "orderNo" | "day" | "dayId"> }
  | { create: Omit<Prisma.SpotUncheckedCreateInput, "orderNo" | "dayId"> };

export async function setDaySpotOrder(dayId: string, spots: SpotOrderItem[]): Promise<void> {
  // 1. そのdayの既存スポットを全件、大きな番号(9000番台)へ退避させる。
  //    差し込み位置がどこであっても衝突しないよう、対象を絞らずdayの全件を退避する。
  const current = await prisma.spot.findMany({ where: { dayId }, select: { id: true } });
  for (let i = 0; i < current.length; i++) {
    await prisma.spot.update({ where: { id: current[i].id }, data: { orderNo: 9000 + i } });
  }

  // 2. 渡された最終順序どおりに、上から1,2,3...で作成・更新する。
  for (let i = 0; i < spots.length; i++) {
    const item = spots[i];
    const orderNo = i + 1;
    if ("id" in item) {
      await prisma.spot.update({ where: { id: item.id }, data: { ...item.data, orderNo } });
    } else {
      await prisma.spot.create({ data: { ...item.create, dayId, orderNo } });
    }
  }
}

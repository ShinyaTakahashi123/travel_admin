import type { Prisma } from "@prisma/client";

// テーマ判定は「タグ」または「目的タグ」のいずれかに該当するしおり(OR条件)。
// user-site側のthemeWhereInput(タグ名ベース)と同じ考え方を、DBのタグID(管理者サイトで
// 選んだ対象)ベースで組み立てる
export function themeWhereInputFromIds(tagIds: string[], purposeTagIds: string[]): Prisma.ItineraryWhereInput {
  const or: Prisma.ItineraryWhereInput[] = [];
  if (tagIds.length > 0) or.push({ tags: { some: { tagId: { in: tagIds } } } });
  if (purposeTagIds.length > 0) or.push({ purposeTags: { some: { purposeTagId: { in: purposeTagIds } } } });
  // 対象タグが1つも選ばれていないテーマは、該当するしおりが無いものとして扱う
  return { status: "published", OR: or.length > 0 ? or : [{ id: "" }] };
}

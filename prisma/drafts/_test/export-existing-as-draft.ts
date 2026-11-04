/**
 * 試し用: 公開中のしおりをDBから読み取り、下書きファイルの形に書き出す(読み取りのみ。DBは変更しない)。
 * 点の出どころ・出典・開閉の時刻は、DBに記録がないため「既存データからの書き出し(検証用)」の
 * 決まった説明を入れる(確認の道具は欄が空かどうかだけを見るので、これでも通る)。
 * 使い方: npx tsx prisma/drafts/_test/export-existing-as-draft.ts <しおりIDの先頭8文字以上> <出力先.json>
 */
import { writeFileSync } from "node:fs";
import { prisma } from "../../../src/lib/prisma";
import type { DraftItinerary, DraftSpot, Mark } from "../../lib/draft-schema";

const PLACEHOLDER_NOTE = "既存データからの書き出し(検証用。もとの記録は組み直し時の報告を参照)";

function fmt(d: Date | null): string {
  if (!d) return "00:00";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function guessMarks(name: string, memo: string): Mark[] {
  const marks: Mark[] = [];
  if (/神社|宮|大社/.test(name)) marks.push("shrine");
  if (/寺|院|堂/.test(name)) marks.push("temple");
  if (/陵|古墳/.test(name)) marks.push("kofun");
  if (/墓/.test(name)) marks.push("grave");
  if (/昼食|ランチ|で昼食/.test(memo)) marks.push("lunch");
  return marks;
}

async function main() {
  const idArg = process.argv[2];
  const outPath = process.argv[3];
  if (!idArg || !outPath) {
    console.error("使い方: npx tsx prisma/drafts/_test/export-existing-as-draft.ts <しおりID> <出力先.json>");
    process.exit(1);
  }

  // idは文字列startsWithが使えない(uuid型)ため、rawクエリで絞り込む
  const raw = await prisma.$queryRawUnsafe<{ iid: string }[]>(`select id::text iid from itinerary where id::text like $1`, `${idArg}%`);
  if (raw.length === 0) throw new Error(`しおりが見つかりません: ${idArg}`);
  const id = raw[0].iid;

  const it = await prisma.itinerary.findUniqueOrThrow({
    where: { id },
    include: {
      areas: { include: { area: true } },
      tags: { include: { tag: true } },
      purposeTags: { include: { purposeTag: true } },
      days: {
        orderBy: { dayNumber: "asc" },
        include: {
          spots: {
            orderBy: { orderNo: "asc" },
            include: { transitLegs: { orderBy: { orderNo: "asc" } }, photos: true },
          },
        },
      },
    },
  });

  const prefecture = it.areas.find((a) => a.area.level === "prefecture")?.area;
  const subAreas = it.areas.filter((a) => a.area.level !== "prefecture").map((a) => a.area.name);

  const days: DraftSpot[][] = it.days.map((day) =>
    day.spots.map((s) => ({
      name: s.name,
      address: s.address ?? undefined,
      time: fmt(s.visitTime),
      stayDurationMin: s.stayDurationMin ?? 0,
      memo: s.memo ?? "",
      legs: s.transitLegs.map((l) => ({ mode: l.transitMode as any, min: l.transitDurationMin ?? 0, line: l.transitLine ?? undefined })),
      point: { lat: Number(s.lat), lng: Number(s.lng), source: { kind: "exception" as const, reason: PLACEHOLDER_NOTE } },
      photos: s.photos.map((p) => ({ commonsFile: p.url, sourceUrl: p.sourceUrl ?? PLACEHOLDER_NOTE, author: p.author ?? PLACEHOLDER_NOTE, license: p.license ?? PLACEHOLDER_NOTE, licenseUrl: p.licenseUrl ?? undefined })),
      marks: guessMarks(s.name, s.memo ?? ""),
      hours: { note: PLACEHOLDER_NOTE, sourceUrl: PLACEHOLDER_NOTE },
      citations: [{ url: PLACEHOLDER_NOTE, excerpt: PLACEHOLDER_NOTE }],
    })),
  );

  const draft: DraftItinerary = {
    title: it.title,
    description: it.description ?? "",
    nights: it.nights,
    seasons: it.seasons as any,
    tagNames: it.tags.map((t) => t.tag.name),
    purposeNames: it.purposeTags.map((p) => p.purposeTag.name),
    prefectureName: prefecture?.name ?? "",
    areaNames: subAreas,
    cover: { commonsFile: it.thumbnailUrl ?? "", sourceUrl: PLACEHOLDER_NOTE, author: PLACEHOLDER_NOTE, license: PLACEHOLDER_NOTE },
    citations: [{ url: PLACEHOLDER_NOTE, excerpt: PLACEHOLDER_NOTE }],
    days,
  };

  writeFileSync(outPath, JSON.stringify(draft, null, 2));
  console.log(`書き出しました: ${outPath}（${id}）`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

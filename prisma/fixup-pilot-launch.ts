/**
 * seed-pilot-launch.ts のフォローアップ:
 *  1) Wikipedia側の429/404で画像取得に失敗したスポットをリトライ（間隔を空けて再取得）
 *  2) 取得できた画像をPhotoが未登録のSpotに紐付け
 *  3) Itinerary.thumbnailUrl が未設定だったバグを埋め戻す（各しおりDay1・1番目スポットの写真を使用）
 *
 * 実行方法: npx tsx prisma/fixup-pilot-launch.ts
 */
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

// name -> 代替候補を含むWikipediaタイトル候補リスト（先頭から試す）
const RETRY_TITLES: Record<string, string[]> = {
  "鴨川": ["鴨川_(淀川水系)", "鴨川 (京都府)"],
  "京都国立博物館": ["京都国立博物館"],
  "六波羅蜜寺": ["六波羅蜜寺"],
  "河原町商店街": ["河原町通"],
  "竹林の道": ["嵯峨野", "嵐山"],
  "二尊院": ["二尊院"],
  "化野念仏寺": ["化野念仏寺"],
  "保津川下り乗船場": ["保津川下り"],
  "嵐山公園": ["嵐山公園", "嵐山"],
  "車折神社": ["車折神社"],
  "波上宮": ["波上宮"],
  "沖縄県立博物館・美術館": ["沖縄県立博物館・美術館"],
  "奥武山公園": ["奥武山公園"],
  "泊いゆまち": ["泊漁港", "那覇市"],
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function tryFetchImage(wikiTitle: string): Promise<string> {
  const res = await fetch(
    `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
    { headers: { "User-Agent": "tabishiori-pilot/1.0 (contact: st.83.53.abcd@gmail.com)" } }
  );
  if (!res.ok) throw new Error(`summary ${res.status} for ${wikiTitle}`);
  const summary = await res.json();
  const imgUrl: string | undefined = summary.originalimage?.source ?? summary.thumbnail?.source;
  if (!imgUrl) throw new Error(`no image for ${wikiTitle}`);
  return imgUrl;
}

async function main() {
  const resultUrlByName = new Map<string, string>();

  for (const [name, titles] of Object.entries(RETRY_TITLES)) {
    let uploaded: string | null = null;
    for (const title of titles) {
      try {
        const imgUrl = await tryFetchImage(title);
        const imgRes = await fetch(imgUrl);
        if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const ext = imgUrl.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
        const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
        const blob = await put(`pilot-launch/${encodeURIComponent(name)}.${safeExt}`, buf, {
          access: "public",
          addRandomSuffix: true,
        });
        uploaded = blob.url;
        console.log(`OK: ${name} (${title}) -> ${blob.url}`);
        break;
      } catch (e) {
        console.warn(`  失敗: ${name} (${title}): ${(e as Error).message}`);
        await sleep(1500);
      }
    }
    if (uploaded) resultUrlByName.set(name, uploaded);
    await sleep(1500);
  }

  // Photoが無いSpotに、取得できた画像を紐付ける
  const spotsWithoutPhoto = await prisma.spot.findMany({
    where: { name: { in: Array.from(resultUrlByName.keys()) }, photos: { none: {} } },
  });
  for (const spot of spotsWithoutPhoto) {
    const url = resultUrlByName.get(spot.name);
    if (!url) continue;
    await prisma.photo.create({ data: { spotId: spot.id, url, caption: spot.name } });
  }
  console.log(`Photo補完: ${spotsWithoutPhoto.length}件`);

  // まだ画像が無いSpotを一覧表示（手動フォロー用）
  const stillMissing = await prisma.spot.findMany({
    where: { photos: { none: {} } },
    select: { name: true },
    distinct: ["name"],
  });
  if (stillMissing.length > 0) {
    console.log("画像なし(要手動対応):", stillMissing.map((s) => s.name).join(", "));
  }

  // thumbnailUrl 未設定のItineraryを埋め戻す
  const itineraries = await prisma.itinerary.findMany({
    where: { thumbnailUrl: null },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
        take: 1,
        include: { spots: { orderBy: { orderNo: "asc" }, take: 5, include: { photos: true } } },
      },
    },
  });
  let filled = 0;
  for (const it of itineraries) {
    const firstSpotWithPhoto = it.days[0]?.spots.find((s) => s.photos.length > 0);
    if (firstSpotWithPhoto) {
      await prisma.itinerary.update({
        where: { id: it.id },
        data: { thumbnailUrl: firstSpotWithPhoto.photos[0].url },
      });
      filled++;
    }
  }
  console.log(`thumbnailUrl補完: ${filled}/${itineraries.length}件`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

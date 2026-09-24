/**
 * 「加悦SL広場」の差し替え（2020年閉園・立入禁止のため。企画運営の指示 2026-09-24）
 * 差し替え先: 旧加悦鉄道加悦駅舎（加悦鉄道資料館）。現在も公開されていることを複数の公式情報源で確認済み。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/replace-kaya-sl-park.ts
 *   登録モード: npx tsx prisma/replace-kaya-sl-park.ts --commit
 */
import { toWebJpeg } from "./lib/pilot-gen";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

const NEW_NAME = "旧加悦鉄道加悦駅舎（加悦鉄道資料館）";
const NEW_ADDRESS = "京都府与謝郡与謝野町加悦433";
const NEW_LAT = 35.5039928;
const NEW_LNG = 135.0948107;
// しおりごとに文章を書き分ける（SEO対策・使い回し禁止のため）
const NEW_MEMO_BY_ITINERARY: Record<string, string> = {
  "6ba2fc04-8dad-4976-8246-d9789086a8c5":
    "大正15年（1926年）、私鉄・加悦鉄道の開業とともに建てられた木造洋風の駅舎です。かつて加悦鉄道の車両を集めていた「加悦SL広場」は2020年に閉園しましたが、こちらの駅舎は「加悦鉄道資料館」として、令和3年（2021年）のリニューアルを経て今も公開されています。運営を担うのはNPO法人。ボランティアの手で大切に守られてきた鉄道の歴史に、日帰り旅の締めくくりとして触れてみましょう。",
  "c5aee4db-13ac-41e7-bb1c-c3dcdf0ea75c":
    "2日間の締めくくりは、大正15年（1926年）に建てられた木造洋風の駅舎です。かつて加悦鉄道の車両を集めていた「加悦SL広場」は2020年に閉園しましたが、こちらの駅舎は「加悦鉄道資料館」として、令和3年（2021年）のリニューアルを経て今も公開されています。NPO法人とボランティアの手で大切に守られてきた、丹後の鉄道の歴史をたどって旅を締めくくりましょう。",
};

const IMAGE_SOURCE_URL = "https://commons.wikimedia.org/wiki/File:加悦鉄道資料館2022年リニューアル後.jpg";
const IMAGE_FILE_TITLE =
  "File:加悦鉄道資料館2022年リニューアル後.jpg";

const UA = "shiorie-photo-replace/1.0 (contact: st.83.53.abcd@gmail.com)";

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const spots = await prisma.spot.findMany({
    where: { name: "加悦SL広場" },
    select: {
      id: true,
      day: { select: { itineraryId: true, itinerary: { select: { title: true, description: true } } } },
      photos: { select: { id: true } },
    },
  });
  console.log(`対象スポット: ${spots.length}件`);
  for (const s of spots) {
    console.log(`  - ${s.day.itinerary.title} (spot:${s.id})`);
    if (s.day.itinerary.description?.includes("加悦")) {
      console.log(`    ※説明文に「加悦」の記載あり: ${s.day.itinerary.description}`);
    }
  }

  console.log(`\n新しいスポット名: ${NEW_NAME}`);
  console.log(`新しい住所: ${NEW_ADDRESS}`);
  console.log(`新しい緯度経度: ${NEW_LAT}, ${NEW_LNG}`);
  for (const s of spots) {
    const memo = NEW_MEMO_BY_ITINERARY[s.day.itineraryId];
    console.log(`\n[${s.day.itinerary.title}] 新しい紹介文(${[...memo].length}字): ${memo}`);
  }
  console.log(`\n画像の出典: ${IMAGE_SOURCE_URL}`);

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  // 画像を取得・圧縮してBlobへアップロード
  const infoRes = await fetch(
    `https://ja.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(IMAGE_FILE_TITLE)}&format=json`,
    { headers: { "User-Agent": UA } }
  );
  const infoJson = await infoRes.json();
  const page: any = Object.values(infoJson.query.pages)[0];
  const ii = page.imageinfo[0];
  const meta = ii.extmetadata ?? {};
  const license = meta.LicenseShortName?.value as string;
  const author = (meta.Artist?.value as string)?.replace(/<[^>]+>/g, "").trim().slice(0, 100);
  const licenseUrl = meta.LicenseUrl?.value as string;

  const buf = await fetchBuffer(ii.url);
  const jpeg = await toWebJpeg(buf);
  const blob = await put(`kaya-tetsudo-shiryokan/${encodeURIComponent(NEW_NAME)}.jpg`, jpeg, {
    access: "public",
    addRandomSuffix: true,
  });
  console.log(`画像アップロード完了: ${blob.url}`);

  for (const s of spots) {
    const memo = NEW_MEMO_BY_ITINERARY[s.day.itineraryId];
    await prisma.spot.update({
      where: { id: s.id },
      data: { name: NEW_NAME, address: NEW_ADDRESS, lat: NEW_LAT, lng: NEW_LNG, memo },
    });
    // 既存の写真を新しい写真に差し替え
    await prisma.photo.updateMany({
      where: { id: { in: s.photos.map((p) => p.id) } },
      data: {
        url: blob.url,
        caption: NEW_NAME,
        sourceUrl: ii.descriptionurl,
        author,
        license,
        licenseUrl,
      },
    });
    console.log(`更新完了: ${s.day.itinerary.title} (spot:${s.id})`);
  }

  // しおりの説明文に「加悦SL広場」の記載があれば差し替える
  const descTarget = await prisma.itinerary.findUnique({
    where: { id: "6ba2fc04-8dad-4976-8246-d9789086a8c5" },
    select: { description: true },
  });
  if (descTarget?.description?.includes("加悦SL広場")) {
    const newDescription = descTarget.description.replace("加悦SL広場", "加悦鉄道資料館");
    await prisma.itinerary.update({
      where: { id: "6ba2fc04-8dad-4976-8246-d9789086a8c5" },
      data: { description: newDescription },
    });
    console.log(`\nしおりの説明文を修正: ${newDescription}`);
  }

  console.log("\n登録しました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

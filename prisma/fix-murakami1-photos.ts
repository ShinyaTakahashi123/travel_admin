/**
 * 村上(地方のしおり候補4、7a436512)の写真を3枚にする(8章の決まり。企画運営 2026-11-03)。
 * 今は村上城跡・イヨボヤ会館の2枚。浄念寺に、自由に使えるライセンスの写真をWikimedia Commonsから足す。
 *
 * 浄念寺: File:Jonenji_Hondo_01.jpg (CC BY 4.0、撮影者Suikotei)
 *   説明「浄念寺本堂（村上市寺町）」、カテゴリ「Main Hall, Jōnen-ji (Murakami)」、撮影座標
 *   (38°13'29.64"N,139°28'35.85"E)がスポットの座標(38.2249023,139.4764191)とほぼ一致で場所を確認。
 *   撮影2025年5月、雪なし。人の顔・大きな看板・空撮ではない(画像を直接確認済み)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-murakami1-photos.ts [--commit]
 */
import { toWebJpeg } from "./lib/pilot-gen";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

const ITINERARY_TITLE = "城下町村上、町屋の人形さま巡りと鮭の文化をめぐる日帰りプラン";
const UA = "shiorie-photo-add/1.0 (contact: st.83.53.abcd@gmail.com)";

const TARGETS: { spotName: string; fileTitle: string }[] = [{ spotName: "浄念寺", fileTitle: "File:Jonenji_Hondo_01.jpg" }];

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: ITINERARY_TITLE },
    include: { days: { include: { spots: { include: { photos: true } } } } },
  });

  for (const t of TARGETS) {
    const spot = it.days.flatMap((d) => d.spots).find((s) => s.name === t.spotName);
    if (!spot) throw new Error(`スポットが見つかりません: ${t.spotName}`);
    console.log(`\n[${t.spotName}] 現在の写真数: ${spot.photos.length}`);

    const infoRes = await fetch(
      `https://ja.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(t.fileTitle)}&format=json`,
      { headers: { "User-Agent": UA } }
    );
    const infoJson: any = await infoRes.json();
    const page: any = Object.values(infoJson.query.pages)[0];
    const ii = page.imageinfo?.[0];
    if (!ii) throw new Error(`画像情報が取得できません: ${t.fileTitle}`);
    const meta = ii.extmetadata ?? {};
    const license = meta.LicenseShortName?.value as string;
    const author = (meta.Artist?.value as string)?.replace(/<[^>]+>/g, "").trim().slice(0, 100);
    const licenseUrl = meta.LicenseUrl?.value as string;
    console.log(`  出典: ${ii.descriptionurl}`);
    console.log(`  ライセンス: ${license} / 作者: ${author}`);

    if (commit) {
      const buf = await fetchBuffer(ii.url);
      const jpeg = await toWebJpeg(buf);
      const blob = await put(`official-local-murakami1/${encodeURIComponent(t.spotName)}-add.jpg`, jpeg, {
        access: "public",
        addRandomSuffix: true,
      });
      console.log(`  アップロード完了: ${blob.url}`);
      await prisma.photo.create({
        data: {
          spotId: spot.id,
          url: blob.url,
          caption: t.spotName,
          sourceUrl: ii.descriptionurl,
          author,
          license,
          licenseUrl,
        },
      });
      console.log(`  書き込みました: ${t.spotName}`);
    }
  }
  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

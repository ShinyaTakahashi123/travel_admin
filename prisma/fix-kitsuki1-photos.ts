/**
 * 杵築(地方のしおり候補3、40405b21)の写真を3枚以上にする(8章の決まり。企画運営 2026-11-02)。
 * 今は杵築城の1枚のみ。酢屋の坂・塩屋の坂(町並みの景色)に、自由に使えるライセンスの写真を
 * Wikimedia Commonsから1枚ずつ足す。
 *
 * 酢屋の坂: File:Suya_Slope.jpg (CC BY-SA 3.0、撮影者STA3816)
 *   説明「杵築武家屋敷・酢屋の坂」、カテゴリ「Suya-no-saka」で場所を確認。酢屋の坂と塩屋の坂が
 *   向かい合う、杵築を象徴する景観。人の顔・大きな看板・空撮ではない(画像を直接確認済み)
 * 塩屋の坂: File:Kitsuki-bukeyashiki.jpg (パブリックドメイン、撮影者As6673)
 *   説明「杵築武家屋敷」、カテゴリ「Kitsuki, Oita」「Suya-no-saka」で場所を確認。坂の上から
 *   城下町を見下ろす景観。人の顔・大きな看板・空撮ではない(画像を直接確認済み)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-kitsuki1-photos.ts [--commit]
 */
import { toWebJpeg } from "./lib/pilot-gen";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

const ITINERARY_TITLE = "杵築城と酢屋の坂・塩屋の坂、城下町と奈多海岸をめぐる日帰りプラン";
const UA = "shiorie-photo-add/1.0 (contact: st.83.53.abcd@gmail.com)";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "酢屋の坂", fileTitle: "File:Suya_Slope.jpg" },
];

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
      const blob = await put(`official-local-kitsuki1/${encodeURIComponent(t.spotName)}-add.jpg`, jpeg, {
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

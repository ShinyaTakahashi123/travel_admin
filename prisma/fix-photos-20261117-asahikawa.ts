/**
 * 旭川(8c95067c-9f3a-40c7-ba71-c415c44baa03、承認待ち)の写真補充(2026-11-17、しおりえ(制作))。
 * 写真のなかった行き先に、Wikimedia Commonsの自由利用の写真を1枚ずつ、実際に画像を見て
 * 確かめたうえで追加する。動物園(正門)は、表紙と同じホッキョクグマの写真をスポットの写真としても使う
 * (法務11/17の指摘: 表紙の出典がどのスポットの写真にも出ていなかったため)。
 *
 * 出典・ライセンス(すべてCC0/CC BY/CC BY-SA、撮影者名が明記されたもの。看板・顔のはっきりした
 * 写り込みなし):
 * - 旭山動物園(正門): Asahiyama polar bear.jpg (Douglas Perkins, CC BY 4.0) ※表紙と同じ
 * - 旭川市科学館(サイパル): SciPal Asahikawa Hokkaido Japan.jpg (ほくなん, Public domain)
 *
 * 見送った行き先(出典が弱い・見つからない・別の場所の写真にあたる・人が中くらいに写る):
 * - 上川神社(頓宮): 候補写真の撮影者欄が「推定されます」で不可
 * - 北海道立旭川美術館: 候補写真に撮影者欄が無く不可
 * - 平和通買物公園: 候補写真はいずれも看板が大きく写るか、人の顔がはっきり写っていて不可
 * - 真宗大谷派旭川別院: Commonsに写真が見当たらず
 * - 旭川市彫刻美術館ステーションギャラリー: 唯一の候補(駅東口の写真)はギャラリーそのものが写っておらず、
 *   キャプションがスポット名になるため別の場所の写真にあたる(内容確認1・法務11/17の指摘)。写真なしのまま
 * - 旭川市博物館: 候補写真(旭川市博物館.jpg)は来館者2人が中くらいに写るため見送り(内容確認1の判断、法務も同意)。
 *   権利の上では使えるが、人のいない外観写真が見つかれば差し替える。写真なしのまま
 *
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-photos-20261117-asahikawa.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "8c95067c-9f3a-40c7-ba71-c415c44baa03";
const BLOB_PREFIX = "official-asahikawa-20261117";

const TARGETS: { spotName: string; fileTitle: string }[] = [
  { spotName: "旭山動物園(正門)", fileTitle: "Asahiyama polar bear.jpg" },
  { spotName: "旭川市科学館(サイパル)", fileTitle: "SciPal Asahikawa Hokkaido Japan.jpg" },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { id: true, title: true, status: true, thumbnailUrl: true } });
  if (!it) throw new Error("しおりが見つかりません");
  console.log(`■ ${it.title} (${it.status})`);
  console.log(`  今の表紙: ${it.thumbnailUrl}`);

  let newCoverUrl: string | null = null;
  for (const t of TARGETS) {
    const spot = await findSpotInItinerary(ITINERARY_ID, { spotName: t.spotName });
    const existing = await prisma.photo.count({ where: { spotId: spot.id } });
    if (existing !== 0) {
      console.log(`  - ${t.spotName}: 既に写真が${existing}枚あるためスキップ`);
      continue;
    }
    console.log(`  - ${t.spotName} (spotId=${spot.id}) <- File:${t.fileTitle}`);
    if (!commit) continue;

    const uploaded = await uploadCommonsFile(t.fileTitle, t.spotName, BLOB_PREFIX);
    if (!uploaded) throw new Error(`${t.spotName}: Commonsからの取得・ライセンス確認に失敗しました(File:${t.fileTitle})`);
    await prisma.photo.create({
      data: {
        spotId: spot.id,
        url: uploaded.url,
        caption: t.spotName,
        sourceUrl: uploaded.credit.sourceUrl,
        author: uploaded.credit.author,
        license: uploaded.credit.license,
        licenseUrl: uploaded.credit.licenseUrl,
      },
    });
    console.log(`    書き込みました -> ${uploaded.url} (${uploaded.credit.author} / ${uploaded.credit.license})`);
    if (t.spotName === "旭山動物園(正門)") newCoverUrl = uploaded.url;
  }

  if (commit && newCoverUrl) {
    await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: newCoverUrl } });
    console.log(`  表紙を更新しました -> ${newCoverUrl}`);
  } else if (!commit) {
    console.log("  (確認モードのため、表紙の更新は行いません。--commit時に、動物園の写真と同じURLに更新します)");
  }

  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}
main().finally(() => prisma.$disconnect());

/**
 * 足あと地図・現地チェックイン機能の準備スクリプト（2026-09-28作成）
 *
 * 【注意】本番DBにはまだ is_memorial 列がありません。
 * このスクリプトは、開発が Spot モデルに isMemorial 列を追加し、
 * schema.prisma を更新して `npx prisma generate` を実行したあとに使う想定で
 * 用意しています。それより前に --commit で実行すると、Prisma Client が
 * isMemorial フィールドを知らないため PrismaClientValidationError で失敗します
 * （DBは壊れません）。
 *
 * 対象は、企画運営を通じて伝えられたユーザーの判断（2026-09-28 09:0x「よいです」）
 * にもとづく11か所・12件（飯盛山は2つのしおりに登場するため2件）。
 * しおりは作り直しでIDが変わることがあるため、しおりID＋スポット名で特定する。
 *
 * 実行方法:
 *   確認モード（存在確認のみ、書き込みなし）: npm run prod -- node prisma/fix-memorial-spots.cjs
 *   本登録（列が追加されたあとのみ）        : npm run prod -- node prisma/fix-memorial-spots.cjs --commit
 */
const {createRequire}=require("module");const r=createRequire(process.cwd()+"/package.json");
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});

const COMMIT = process.argv.includes("--commit");

// itineraryId + spotName で特定（IDは削除→作り直しで変わることがあるため名前も併記）
const TARGETS = [
  { itineraryId: "4f3c12bd-9cc2-49ed-a631-9866b62a55c2", spotName: "飯盛山", note: "会津若松しおり。白虎隊自刃の地" },
  { itineraryId: "28ec8b18-c34e-4f95-a166-830976a70133", spotName: "飯盛山", note: "飯盛山と白虎隊しおり。同上" },
  { itineraryId: "fb532960-0b0c-4170-948e-d484b575f739", spotName: "原爆ドーム", note: "" },
  { itineraryId: "fb532960-0b0c-4170-948e-d484b575f739", spotName: "平和記念公園", note: "" },
  { itineraryId: "281700ca-4efe-4466-bccc-c8cebe1ee00e", spotName: "大久野島毒ガス資料館", note: "" },
  { itineraryId: "281700ca-4efe-4466-bccc-c8cebe1ee00e", spotName: "発電所跡", note: "" },
  { itineraryId: "a4ee710d-7872-4fb5-8bb1-6b7b796cdcbd", spotName: "高崎白衣大観音", note: "戦没者慰霊のために建立された観音像" },
  { itineraryId: "41e37fe5-383f-47ff-9375-dda356f10a9a", spotName: "仁徳天皇陵古墳（大仙古墳）", note: "宮内庁管理の天皇陵" },
  { itineraryId: "9a719ffb-4a30-415f-bf49-b86c4c744759", spotName: "天武・持統天皇陵", note: "同上" },
  { itineraryId: "0d8b6309-1776-44a6-906c-e98a8e99e538", spotName: "如意輪寺", note: "境内に後醍醐天皇陵（塔尾陵）" },
  { itineraryId: "b7de8da7-4621-4e87-bc5c-38071741fcba", spotName: "泉涌寺", note: "歴代天皇・皇后の陵墓がある御寺" },
  { itineraryId: "38dec57e-25dd-4351-8318-cb397713bc80", spotName: "神戸ルミナリエ", note: "阪神・淡路大震災の犠牲者への鎮魂が由来" },
];

(async () => {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL).host);
  console.log(COMMIT ? "=== 本登録モード ===" : "=== 確認モード（書き込みなし） ===");
  console.log(`対象 ${TARGETS.length} 件\n`);

  let okCount = 0;
  let ngCount = 0;

  for (const t of TARGETS) {
    const itinerary = await p.itinerary.findUnique({
      where: { id: t.itineraryId },
      select: { id: true, title: true, status: true },
    });
    if (!itinerary) {
      console.log(`[NG] しおり見つからず itineraryId=${t.itineraryId} spot=${t.spotName}（IDが変わった可能性。要確認）`);
      ngCount++;
      continue;
    }

    const spot = await p.spot.findFirst({
      where: { name: t.spotName, day: { itineraryId: t.itineraryId } },
      select: { id: true, name: true },
    });
    if (!spot) {
      console.log(`[NG] スポット見つからず「${itinerary.title}」内に「${t.spotName}」が無い（要確認）`);
      ngCount++;
      continue;
    }

    console.log(`[OK] 「${itinerary.title}」(${itinerary.status}) の「${spot.name}」(spotId=${spot.id})${t.note ? " — " + t.note : ""}`);
    okCount++;

    if (COMMIT) {
      // isMemorial は開発が Spot モデルに列を追加したあとで有効になるフィールド名の想定。
      // 列がまだ無い場合はここで PrismaClientValidationError になる（想定内、DBへの影響なし）。
      await p.spot.update({ where: { id: spot.id }, data: { isMemorial: true } });
      console.log("      → isMemorial: true に更新しました");
    }
  }

  console.log(`\n見つかった: ${okCount} / 12、見つからず: ${ngCount} / 12`);
  if (!COMMIT) {
    console.log("これは確認モードです。書き込みは行っていません。isMemorial列の追加後、--commit を付けて実行してください。");
  }
})().finally(() => p.$disconnect());

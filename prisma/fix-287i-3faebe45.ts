/**
 * チェックリスト作業とは別枠、企画運営からの緊急依頼(2026-09-30)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる
 * 1泊2日プラン」(3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * 筑波観光鉄道の公式のお知らせ(2026-09-24「9月25日(金)以降のケーブルカー・
 * ロープウェイの運行につきまして」)により、ケーブルカーが当面の間、安全
 * 確認のため運行休止(ロープウェイは通常どおり運行)。Day1の経路を、
 * ケーブルカーを使わない形に組み直した。
 *
 * 旧: 神社→梅林→[ケーブルカーで登り]→御幸ヶ原→男体山→女体山→弁慶七戻り
 *     →[ロープウェイで下り]→つつじヶ丘公園
 * 新: 神社→梅林→[シャトルバス+ロープウェイで登り]→女体山→御幸ヶ原(昼食)
 *     →男体山→(御幸ヶ原・女体山を経由して)弁慶七戻り→[徒歩で下り]
 *     →つつじヶ丘公園
 * ロープウェイを登りに使う形にし(#460で制作補助2が使った構成を参考)、
 * 弁慶七戻り・つつじヶ丘公園はそのまま活かして徒歩の下山(白雲橋コース)に
 * 組み込んだ。シャトルバスの所要時間(筑波山神社入口→つつじヶ丘、
 * およそ15分)は関東鉄道の時刻表で確認。
 * 出典: https://www.kantetsu.co.jp/bus/tourist/mttsukuba (筑波山シャトル
 * バス、関東鉄道公式)
 *
 * 御幸ヶ原の紹介文から「ケーブルカーの終着駅がある」という一文を削除
 * (経路として使わないため)。筑波山神社の本文末尾に、ケーブルカーが
 * 運休している時期がある旨の注意書きを追加(再開時期には触れない)。
 * タイトル・説明文の「ケーブルカーとロープウェイで」は「ロープウェイと
 * 登山道で」に変更。
 *
 * itinerary-audit.cjs・flow-check.cjs で確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287i-3faebe45.ts
 * (実行済み。ケーブルカーのスポットの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  const cablecar = day1.spots.find((s) => s.name === "筑波山ケーブルカー");
  if (!cablecar) {
    console.log("既に反映済み(ケーブルカーが無い)。何もしません。");
    return;
  }

  const jinja = day1.spots.find((s) => s.name === "筑波山神社")!;
  const bairin = day1.spots.find((s) => s.name === "筑波山梅林")!;
  const ropeway = day1.spots.find((s) => s.name === "筑波山ロープウェイ")!;
  const nyotai = day1.spots.find((s) => s.name === "女体山山頂")!;
  const miyukigahara = day1.spots.find((s) => s.name === "御幸ヶ原")!;
  const nantai = day1.spots.find((s) => s.name === "男体山山頂")!;
  const benkei = day1.spots.find((s) => s.name === "弁慶七戻り")!;
  const tsutsujigaoka = day1.spots.find((s) => s.name === "つつじヶ丘公園")!;

  // 筑波山神社: ケーブルカー運休の注意書きを追加
  const jinjaNote = "筑波山ケーブルカーは、安全確認などのため運行を休んでいる時期があります。運行状況は公式の案内で確かめましょう。";
  const jinjaMemo = (jinja.memo ?? "").includes(jinjaNote) ? jinja.memo : `${jinja.memo ?? ""} ${jinjaNote}`;
  await updateSpotInItinerary(ITIN_ID, { spotId: jinja.id }, { memo: jinjaMemo });

  // 筑波山ロープウェイ: 下りの案内から、登りの案内(シャトルバス+ロープウェイ)へ
  await updateSpotInItinerary(ITIN_ID, { spotId: ropeway.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 15)),
    stayDurationMin: 20,
    transitMode: "bus",
    transitDurationMin: 15,
    memo:
      "筑波山梅林からは、筑波山シャトルバスでおよそ15分、つつじヶ丘へ向かいます。つつじヶ丘駅と女体山駅を、およそ1300メートル・6分ほどで結ぶ筑波山ロープウェイで、標高およそ800mの女体山駅まで一気に登りましょう。関東平野を見渡す大パノラマが広がります。",
  });

  // 女体山山頂: 男体山からではなく、ロープウェイの女体山駅から徒歩で
  const nyotaiMemo = (nyotai.memo ?? "").replace(
    "男体山からは、山頂連絡路と呼ばれる尾根道を歩いて、850メートル・35分ほどの道のりです。",
    "女体山駅からは、山頂まで徒歩10分ほどです。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: nyotai.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 45)),
    transitMode: "walk",
    transitDurationMin: 10,
    memo: nyotaiMemo,
  });

  // 御幸ヶ原: 女体山からの徒歩の案内を追加し、ケーブルカーの記載を削除。昼食はここで
  const miyukiMemo = (miyukigahara.memo ?? "").replace(
    "御幸ヶ原は、男体山と女体山のちょうど中間に広がる、ケーブルカーの終着駅がある広場です。",
    "女体山山頂からは、御幸ヶ原まで徒歩15分ほどです。御幸ヶ原は、男体山と女体山のちょうど中間に広がる広場です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: miyukigahara.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 30)),
    transitMode: "walk",
    transitDurationMin: 15,
    memo: miyukiMemo,
  });

  // 男体山山頂: 御幸ヶ原からの関係は変わらないため、時刻だけ更新
  await updateSpotInItinerary(ITIN_ID, { spotId: nantai.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
  });

  // 弁慶七戻り: 女体山からではなく、男体山から御幸ヶ原・女体山を経由して徒歩で
  const benkeiMemo = (benkei.memo ?? "").replace(
    "女体山山頂からは、白雲橋コースを10分ほど下ります。",
    "男体山山頂からは、御幸ヶ原・女体山を経由して、白雲橋コースの入り口まで徒歩およそ40分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: benkei.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 30)),
    transitMode: "walk",
    transitDurationMin: 40,
    memo: benkeiMemo,
  });

  // つつじヶ丘公園: ロープウェイでの到着ではなく、弁慶七戻りから徒歩の下山で到着
  const tsutsujiMemo = `弁慶七戻りからは、白雲橋コースをさらに下って、徒歩およそ45分です。${tsutsujigaoka.memo ?? ""}`;
  await updateSpotInItinerary(ITIN_ID, { spotId: tsutsujigaoka.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 16, 30)),
    transitMode: "walk",
    transitDurationMin: 45,
    memo: tsutsujiMemo,
  });

  // ケーブルカーのスポットを削除し、並びを新しい順番に
  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: jinja.id, data: {} },
        { id: bairin.id, data: {} },
        { id: ropeway.id, data: {} },
        { id: nyotai.id, data: {} },
        { id: miyukigahara.id, data: {} },
        { id: nantai.id, data: {} },
        { id: benkei.id, data: {} },
        { id: tsutsujigaoka.id, data: {} },
      ],
      { tx, remove: [cablecar.id] }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      title: "筑波山の絶景をロープウェイと登山道で、山麓の宿に泊まる1泊2日プラン",
      description:
        "筑波山の山麓に宿泊し、1日目はロープウェイと登山道で男体山・女体山、2つの峰からの絶景を楽しみ、2日目はつくば市内の史跡や科学施設をめぐる1泊2日のつくばプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

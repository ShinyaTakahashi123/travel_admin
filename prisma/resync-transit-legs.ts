/**
 * spot_transit_leg を、現在の spot.transit_*（レガシー列）の値に合わせて同期し直すスクリプト
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/resync-transit-legs.ts
 *   登録モード: npx tsx prisma/resync-transit-legs.ts --commit
 *
 * 背景: 20260925211500_add_spot_transit_leg マイグレーションは、適用した時点の
 * spot.transit_* から spot_transit_leg（1つ目の移動として）を作る一度きりの
 * バックフィルを含む。マイグレーションの適用と、乗り継ぎ対応の新しいコードの
 * 本番反映の間に間があると、その間は制作のスクリプトや（まだ新しいコードが
 * 反映されていない）プランナーの編集画面が spot.transit_* だけを書き換え続ける
 * ため、spot_transit_leg が古いまま（食い違ったまま）になる。
 *
 * 本スクリプトは、新しいコードの反映の直前（＝レガシー列だけが更新されうる
 * 期間が終わったタイミング）に実行し、spot_transit_leg の1つ目の移動
 * （order_no=1）を、そのときの spot.transit_* の値に合わせて作り直す:
 *   - transit_mode が設定されているスポット: 1つ目の移動を現在の値で
 *     作成または更新する
 *   - transit_mode が未設定のスポット: 1つ目の移動が残っていれば削除する
 *
 * 安全策: order_no が2以上の行（乗り継ぎ2区間目以降）を持つスポットは、
 * 新しい編集画面から複数区間を入力済みの可能性があるため、一切変更せず
 * スキップする（本スクリプトは新しいコードの反映前にのみ実行する前提だが、
 * 反映後に誤って再実行してしまっても、複数区間のデータを壊さないための保険）。
 */

import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const spots = await prisma.spot.findMany({
    select: {
      id: true,
      name: true,
      transitMode: true,
      transitDurationMin: true,
      transitLine: true,
      transitLegs: { orderBy: { orderNo: "asc" } },
    },
  });

  let toCreate = 0;
  let toUpdate = 0;
  let toDelete = 0;
  let alreadyInSync = 0;
  let skippedMultiLeg = 0;

  for (const spot of spots) {
    const multiLeg = spot.transitLegs.some((l) => l.orderNo > 1);
    if (multiLeg) {
      skippedMultiLeg++;
      console.log(
        `[スキップ:複数区間] ${spot.name}（${spot.transitLegs.length}区間。order_noが2以上の行があるため変更しません）`
      );
      continue;
    }

    const leg1 = spot.transitLegs.find((l) => l.orderNo === 1) ?? null;

    if (spot.transitMode == null) {
      if (leg1) {
        toDelete++;
        console.log(`[削除予定] ${spot.name}: transit_modeが未設定なのに1つ目の移動が残っています`);
        if (COMMIT) {
          await prisma.spotTransitLeg.delete({ where: { id: leg1.id } });
        }
      }
      continue;
    }

    const inSync =
      leg1 != null &&
      leg1.transitMode === spot.transitMode &&
      leg1.transitDurationMin === spot.transitDurationMin &&
      leg1.transitLine === spot.transitLine;

    if (inSync) {
      alreadyInSync++;
      continue;
    }

    if (leg1) {
      toUpdate++;
      console.log(
        `[更新予定] ${spot.name}: 旧(${leg1.transitMode},${leg1.transitDurationMin},${leg1.transitLine}) → 新(${spot.transitMode},${spot.transitDurationMin},${spot.transitLine})`
      );
    } else {
      toCreate++;
      console.log(`[作成予定] ${spot.name}: (${spot.transitMode},${spot.transitDurationMin},${spot.transitLine})`);
    }

    if (COMMIT) {
      await prisma.spotTransitLeg.upsert({
        where: { spotId_orderNo: { spotId: spot.id, orderNo: 1 } },
        update: {
          transitMode: spot.transitMode,
          transitDurationMin: spot.transitDurationMin,
          transitLine: spot.transitLine,
        },
        create: {
          spotId: spot.id,
          orderNo: 1,
          transitMode: spot.transitMode,
          transitDurationMin: spot.transitDurationMin,
          transitLine: spot.transitLine,
        },
      });
    }
  }

  console.log(
    `\n完了: 対象${spots.length}件中 作成${toCreate}件・更新${toUpdate}件・削除${toDelete}件・既に一致${alreadyInSync}件・複数区間でスキップ${skippedMultiLeg}件`
  );
  if (!COMMIT) {
    console.log("(確認モードのみ。--commit で実際に同期します)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

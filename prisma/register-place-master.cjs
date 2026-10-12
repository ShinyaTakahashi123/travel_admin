/**
 * スポットの台帳(place_master)の一括登録スクリプト(2026-09-28作成)
 *
 * 入力: prisma/_temp-master-candidates.json (本番データを読み取って作った、まとめ案。
 *       docs/content/20260928-spot-master-merge-plan.md 参照)
 * 「要確認」(座標が2km超ばらついた28件)は対象外。1,201件の確信度が高い候補のみ登録する。
 *
 * 安全装置: DATABASE_URLのホストが開発用(ep-wispy-queen-...)であることを確認してから
 * しか --commit で書き込まない(本番への誤爆防止)。本番への一括登録は、このスクリプトを
 * 使う場合も別途ユーザーの了承とバックアップ確認のあとで行う(仕様書4-5節)。
 *
 * 実行方法:
 *   確認モード: node prisma/register-place-master.cjs
 *   登録(開発DBのみ): node prisma/register-place-master.cjs --commit
 *
 * 【2026-09-28追記】知覧特攻平和会館(id 8bb94ac7-2e72-4749-85bd-838fa2457ec7)、
 * 対馬丸記念館(id baa46908-2f4e-4333-8081-fe7ffd973272)を is_memorial に追加
 * (ユーザー了承 12:5x・14:3x)。開発用DBの該当行はどちらも直接UPDATE済み。
 * 入力JSON(_temp-master-candidates.json)は削除済みのため、まとめ案を作り直して
 * このスクリプトを再実行する場合は、admin-site/prisma/fix-memorial-spots.cjs の
 * TARGETS一覧(13か所・14件、知覧特攻平和会館・対馬丸記念館を含む)を正として反映すること。
 * 新倉山浅間公園・平和台公園は加えないと判断ずみ(2026-09-28)。
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const fs = require("fs");

const COMMIT = process.argv.includes("--commit");

const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

(async () => {
  const host = new URL(process.env.DATABASE_URL).host;
  console.log("[接続先チェック] host:", host);

  // 接続先の確かめ方は scripts/assert-db-target.cjs と同じ考え方にそろえた(2026-10-12):
  // ホスト名を数え上げて止めるのではなく、「開発用として登録済み」か「npm run prod --の
  // 入口を通って明示的にSHIORIE_TARGET=prodが付いている」かだけを許可する(許可リスト方式)。
  // これで、npm run prod -- node prisma/register-place-master.cjs --commit という
  // 決まった入口からなら、本番でも--commitできるようにした(仕様書4-5節。それでも実際の
  // 本番への一括登録は、ユーザーの了承とバックアップ確認のあとで、別途はっきり判断してから行う)
  const isProd = process.env.SHIORIE_TARGET === "prod";
  const isKnownDev = process.env.SHIORIE_DEV_DB_HOST && host === process.env.SHIORIE_DEV_DB_HOST;
  if (COMMIT && !isProd && !isKnownDev) {
    console.error(
      "[中止] --commit は、開発用として登録されたDB、または npm run prod -- の入口(SHIORIE_TARGET=prod)からしか実行できません。" +
        "本番への一括登録は、ユーザーの了承とバックアップ確認のあとで、別途はっきり判断してから行ってください。"
    );
    process.exit(1);
  }
  if (COMMIT && isProd) {
    console.log("[接続先] 本番へ書きかえます。ユーザーの了承とバックアップ確認が済んでいることを確認してください。");
  }

  const { placeCandidates } = JSON.parse(fs.readFileSync("prisma/_temp-master-candidates.json", "utf8"));
  console.log(COMMIT ? "=== 登録モード ===" : "=== 確認モード（書き込みなし） ===");
  console.log(`候補 ${placeCandidates.length} 件(要確認28件は対象外)\n`);

  const prefectures = await p.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  let created = 0, skippedExisting = 0, prefNotFound = 0;
  let spotLinksResolved = 0, spotLinksNotFound = 0;
  let photosAttached = 0;

  for (const c of placeCandidates) {
    const prefectureAreaId = prefMap.get(c.prefecture) || null;
    if (c.prefecture !== "不明" && !prefectureAreaId) prefNotFound++;

    const existing = await p.placeMaster.findFirst({ where: { name: c.canonicalName, prefectureAreaId } });
    if (existing) {
      skippedExisting++;
      continue;
    }

    const photo = c.photos[0] || null;

    if (!COMMIT) {
      created++;
      continue;
    }

    const place = await p.placeMaster.create({
      data: {
        name: c.canonicalName,
        address: c.address,
        lat: c.lat,
        lng: c.lng,
        prefectureAreaId,
        category: c.category,
        isWideArea: c.isWideArea,
        isMemorial: c.isMemorial,
        stayDurationMin: c.stayDurationMin,
        websiteUrl: c.websiteUrl,
        photoUrl: photo ? photo.url : null,
        photoAuthor: photo ? photo.author : null,
        photoLicense: photo ? photo.license : null,
        photoLicenseUrl: photo ? photo.licenseUrl : null,
        photoSourceUrl: photo ? photo.sourceUrl : null,
        source: "ai_collected",
        // 位置の調べ方の記録がDBに残っていないスポットが大半のため、既定は空("不明")
        positionSource: null,
        verifiedAt: null,
      },
    });
    created++;
    if (photo) photosAttached++;

    if (c.aliases.length) {
      await p.placeMasterAlias.createMany({
        data: c.aliases.map((alias) => ({ placeMasterId: place.id, alias })),
      });
    }

    const spotIds = c.memberSpotIds.map((m) => m.spotId);
    const result = await p.spot.updateMany({
      where: { id: { in: spotIds } },
      data: { placeMasterId: place.id },
    });
    spotLinksResolved += result.count;
    spotLinksNotFound += spotIds.length - result.count;
  }

  console.log(`作成: ${created} 件 / 既存のためスキップ: ${skippedExisting} 件 / 都道府県が見つからず: ${prefNotFound} 件`);
  console.log(`写真を付けた: ${photosAttached} 件`);
  if (COMMIT) {
    console.log(`スポットのplace_master_idを更新できた: ${spotLinksResolved} 件 / このDBに元のスポットが無く更新できなかった: ${spotLinksNotFound} 件`);
    console.log("(開発用DBは9/27時点の写しのため、本番の直近24本のしおりのスポットは元々存在せず、更新できなくて正常です)");
  } else {
    console.log("これは確認モードです。書き込みは行っていません。--commit を付けると開発用DBに登録します。");
  }
})().finally(() => p.$disconnect());

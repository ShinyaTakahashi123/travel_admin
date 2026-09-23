/**
 * サンプルしおり投入スクリプト
 *
 * 実行方法: npx tsx prisma/seed-sample-itineraries.ts
 * （事前に prisma/seed.ts のシード〔エリア・タグマスタ〕が投入済みであること）
 *
 * database-design.md 4章「初期データ（シード）投入が必要なテーブル」/
 * requirements.md 4.4節「初期コンテンツ戦略」のうち、サンプルしおりの投入を行う
 * （seed.ts はスコープ外としていた部分）。
 *
 * 内容: 運営公式プランナーアカウント（is_official=true）を1つ用意し、
 * 既存のエリアマスタ5都道府県それぞれについて、1泊/2泊/3泊 × 3件 = 9件、
 * 合計45件のしおり（日程・スポット付き、status=published）を作成する。
 *
 * ⚠️ 注意: スポットの住所・緯度経度は開発用サンプルとしてAI(Claude)の一般知識から
 * 作成した概算値。requirements.md 4.4節の注意書きの通り、本番のスポットマスタとして
 * 採用する場合は地図サービス等との突合による裏取りを推奨する。
 */

import { prisma } from "../src/lib/prisma";
import { SPOTS, type SpotSeed } from "./spots-data";

const PREFECTURES = Object.keys(SPOTS);
const THEMES = ["定番観光", "グルメ", "絶景", "温泉", "家族旅行", "一人旅", "学生旅行", "紅葉", "海・リゾート"];

const OFFICIAL_PLANNER_EMAIL = "official@tabi-shiori.example.com";

async function getOrCreateOfficialPlanner() {
  let planner = await prisma.plannerAccount.findUnique({ where: { email: OFFICIAL_PLANNER_EMAIL } });
  if (!planner) {
    planner = await prisma.plannerAccount.create({
      data: {
        name: "しおりえ編集部",
        email: OFFICIAL_PLANNER_EMAIL,
        isOfficial: true,
        profile: "運営公式アカウントです。サンプルしおりを投稿しています。",
      },
    });
    console.log("運営公式プランナーアカウント「しおりえ編集部」を作成しました");
  }
  return planner;
}

function pickSpotsForDay(pool: SpotSeed[], seed: number, day: number): SpotSeed[] {
  const start = (seed * 3 + day * 2) % pool.length;
  const a = pool[start];
  const b = pool[(start + 1) % pool.length];
  return [a, b];
}

async function main() {
  const planner = await getOrCreateOfficialPlanner();

  let created = 0;
  let skipped = 0;

  for (const [prefIndex, prefName] of PREFECTURES.entries()) {
    const prefecture = await prisma.area.findFirst({ where: { name: prefName, level: "prefecture" } });
    if (!prefecture) {
      console.warn(`都道府県「${prefName}」がエリアマスタに見つからないためスキップします（先に npm run db:seed を実行してください）`);
      continue;
    }
    const pool = SPOTS[prefName];

    let seq = 0;
    for (const nights of [1, 2, 3]) {
      for (let i = 1; i <= 3; i++) {
        seq++;
        const dayCount = nights + 1;
        const theme = THEMES[(prefIndex * 9 + seq) % THEMES.length];
        const title = `${prefName}${theme}${nights}泊${dayCount}日プラン #${i}`;

        const existing = await prisma.itinerary.findFirst({
          where: { title, plannerAccountId: planner.id },
        });
        if (existing) {
          skipped++;
          continue;
        }

        const tag = await prisma.tag.findUnique({ where: { name: theme } });
        const firstSpotName = pickSpotsForDay(pool, seq, 1)[0].name;

        await prisma.itinerary.create({
          data: {
            plannerAccountId: planner.id,
            title,
            description: `${firstSpotName}をはじめ、${prefName}の人気スポットを巡る${nights}泊${dayCount}日のモデルプランです。`,
            nights,
            status: "published",
            viewCount: BigInt(Math.floor(Math.random() * 500)),
            areas: { create: [{ areaId: prefecture.id }] },
            tags: tag ? { create: [{ tagId: tag.id }] } : undefined,
            days: {
              create: Array.from({ length: dayCount }, (_, d) => {
                const dayNumber = d + 1;
                const spots = pickSpotsForDay(pool, seq, dayNumber);
                return {
                  dayNumber,
                  spots: {
                    create: spots.map((spot, idx) => ({
                      orderNo: idx + 1,
                      name: spot.name,
                      address: spot.address,
                      lat: spot.lat,
                      lng: spot.lng,
                      memo: spot.memo,
                      websiteUrl: spot.websiteUrl,
                      stayDurationMin: 60 + idx * 30,
                      transitMode: idx === 0 ? undefined : "walk",
                      transitDurationMin: idx === 0 ? undefined : 15,
                    })),
                  },
                };
              }),
            },
          },
        });
        created++;
        console.log(`作成: ${title}`);
      }
    }
  }

  console.log(`完了: ${created}件作成 / ${skipped}件スキップ（既存）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

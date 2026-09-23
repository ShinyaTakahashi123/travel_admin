/**
 * 初期データ投入スクリプト
 *
 * 実行方法: npx tsx prisma/seed.ts
 * （事前に .env の DATABASE_URL / SEED_SUPER_ADMIN_EMAIL / SEED_SUPER_ADMIN_PASSWORD を設定しておくこと）
 *
 * このスクリプトは以下を投入する:
 * 1. 初回スーパー管理者（招待フローが使えないため、ここだけ直接発行する）
 * 2. エリアマスタ（都道府県の一部サンプル。本番投入時はAI収集データに差し替える）
 * 3. タグマスタ（初期テーマセット）
 * 4. 目的タグマスタ（お寺・温泉・自然など、しおりの「目的」を表す初期セット）
 *
 * database-design.md 4章「初期データ（シード）投入が必要なテーブル」に対応。
 * place_master・運営公式プランナー・お手本しおりの投入は別スクリプトで行う想定（本スクリプトはスコープ外）。
 */

import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function seedSuperAdmin() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL;
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "SEED_SUPER_ADMIN_EMAIL / SEED_SUPER_ADMIN_PASSWORD が未設定のため、初回スーパー管理者の作成をスキップしました。"
    );
    return;
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`スーパー管理者 ${email} は既に存在します（スキップ）`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({
    data: {
      name: "スーパー管理者",
      email,
      passwordHash,
      role: "super",
      status: "active",
    },
  });
  console.log(`スーパー管理者 ${email} を作成しました`);
}

async function seedAreas() {
  // サンプルとして数都道府県分のみ投入。本番投入時はAI収集データ（4.4節）で全都道府県分を用意する。
  const prefectures: { name: string; areas: string[] }[] = [
    {
      name: "京都府",
      areas: ["京都市内（清水・祇園・河原町）", "嵐山・嵯峨野", "伏見・宇治", "天橋立・丹後"],
    },
    {
      name: "大阪府",
      areas: ["梅田・大阪駅周辺", "難波・道頓堀", "天王寺・あべの", "堺・泉南"],
    },
    {
      name: "東京都",
      areas: ["浅草・上野", "渋谷・原宿", "お台場・臨海副都心", "吉祥寺・三鷹"],
    },
    {
      name: "北海道",
      areas: ["札幌市内", "小樽・積丹", "富良野・美瑛", "函館"],
    },
    {
      name: "沖縄県",
      areas: ["那覇市内", "恩納村・北谷", "石垣島・宮古島", "慶良間諸島"],
    },
  ];

  for (const [prefIndex, pref] of prefectures.entries()) {
    // Areaにはname単体のunique制約が無いため、まず検索してから無ければ作成する
    let prefecture = await prisma.area.findFirst({
      where: { name: pref.name, level: "prefecture" },
    });
    if (!prefecture) {
      prefecture = await prisma.area.create({
        data: { name: pref.name, level: "prefecture", displayOrder: prefIndex },
      });
    }

    for (const [areaIndex, areaName] of pref.areas.entries()) {
      const existing = await prisma.area.findFirst({
        where: { name: areaName, level: "area", parentId: prefecture.id },
      });
      if (!existing) {
        await prisma.area.create({
          data: {
            name: areaName,
            level: "area",
            parentId: prefecture.id,
            displayOrder: areaIndex,
          },
        });
      }
    }
  }
  console.log(`エリアマスタを投入しました（${prefectures.length}都道府県）`);
}

async function seedTags() {
  const tagNames = ["定番観光", "グルメ", "絶景", "温泉", "家族旅行", "一人旅", "学生旅行", "紅葉", "海・リゾート"];
  for (const name of tagNames) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`タグマスタを投入しました（${tagNames.length}件）`);
}

async function seedPurposeTags() {
  // 「テーマ・ジャンル」(Tag)とは別軸の、旅の目的を表すマスタ。しおり登録時は任意入力。
  const purposeTagNames = [
    "お寺",
    "神社",
    "温泉",
    "自然",
    "グランピング",
    "ウィンタースポーツ",
    "城・史跡",
    "美術館・博物館",
    "動物園・水族館",
    "テーマパーク",
    "ビーチ・海水浴",
    "高原・避暑",
    "紅葉狩り",
    "花見・桜",
    "星空観察",
    "キャンプ",
    "ハイキング・登山",
    "サイクリング",
    "ダイビング・シュノーケリング",
    "祭り・イベント",
    "酒蔵・ワイナリー巡り",
    "ものづくり体験",
    "ペット同伴",
    "絶景・フォトスポット",
    "パワースポット",
    "離島",
    "鉄道旅",
    "ドライブ",
    "ショッピング",
    "夜景",
  ];
  for (const name of purposeTagNames) {
    await prisma.purposeTag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`目的タグマスタを投入しました（${purposeTagNames.length}件）`);
}

async function main() {
  await seedSuperAdmin();
  await seedAreas();
  await seedTags();
  await seedPurposeTags();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

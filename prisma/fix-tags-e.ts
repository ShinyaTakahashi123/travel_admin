/**
 * タグの見直し（docs/specs/20260924-seo-themes-areas-images.md E）
 *
 * 1. 紅葉: 主目的でない16件からタグ「紅葉」を外す。主目的の10件にタグ「紅葉」+目的タグ「紅葉狩り」の両方を保証
 * 2. 一人旅: 街歩き・寺社・美術館・景色中心の60件にタグ「一人旅」を追加
 * 3. 温泉・海・リゾート・家族旅行: 内容と明らかに合わないものを個別に除去
 * 4. 絶景: 内容と明らかに合わない3件を除去
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/fix-tags-e.ts
 *   登録モード: npx tsx prisma/fix-tags-e.ts --commit
 */
import { prisma } from "../src/lib/prisma";

// ============================================================
// 1. 紅葉タグの見直し
// ============================================================
const KOYO_REMOVE_IDS = [
  "0d8b6309-1776-44a6-906c-e98a8e99e538", // 南朝ゆかりの古刹めぐり、吉野の歴史をたどる日帰り旅
  "625c11c9-1f5c-40dd-b510-9e93c517f6ff", // 酒蔵と源氏物語の里を巡る、伏見・宇治ゆったり旅
  "5ffdffa6-b3e8-4424-bb83-55350a5e6331", // 東大寺と奈良公園の鹿に会える、大仏さまめぐりプラン
  "0d3ae277-170b-4e8a-a5ed-54b2034287a0", // 一目千本、桜の名所・吉野山を巡る日帰りプラン
  "4b95c57d-1424-4f19-b319-f8e7bda6fd1e", // 竹林と紫陽花、鎌倉の名庭と自然をゆったり巡る1泊2日
  "01de69f8-fa6a-43ba-80be-4dd8b8b2ab46", // 初めての京都！清水寺・祇園・錦市場を巡る鉄板プラン
  "43d3f547-91a7-407f-8e80-c52a09458501", // 伏見稲荷から平等院へ。朱と新緑に包まれる伏見・宇治めぐり
  "2eb3162a-bb0d-4f7c-8e0a-b8e9a77d702a", // 朝から夜まで満喫、京都の「和」を味わい尽くすプラン
  "7f972333-ae4c-4ed4-9634-6c0d0b9efe28", // 依水園と般若寺、奈良の穴場庭園と花の寺を訪ねる日帰り旅
  "ecdd6ad8-31a0-4e4d-9816-7297a3025225", // 金峯山寺と吉水神社、桜と信仰の山・吉野を歩く旅
  "fc54731b-8f4b-4a2a-935a-f1e73fac342f", // 歴史と食を巡る、大人のための京都名所めぐり
  "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f", // 天満宮と九州国立博物館、太宰府の歴史と文化を巡る旅
  "fcaa0edb-3539-47f5-ae75-4ee183f27044", // 清水寺から祇園へ、着物で歩く京都さんぽプラン
  "0c357818-63ed-4bb0-9248-29f2516925b8", // 梅ヶ枝餅片手に、学問の神様・太宰府天満宮を巡るプラン
  "c97e2205-85f0-449e-bb08-a071bc7a534e", // 大仏さまと鹿、ならまちの町家。奈良の魅力を巡る旅
  "27d28702-2f4b-4134-947c-b2725f9b90c0", // 千本鳥居と抹茶の香り、伏見・宇治を歩く欲張り散策プラン
];

// 紅葉が主目的：タグ「紅葉」と目的タグ「紅葉狩り」の両方を保証する（不足分のみ追加）
const KOYO_KEEP_IDS = [
  "5c281775-cb3b-404d-8339-d5f03fc2cf72",
  "3b17f9a0-a0ae-492e-bf20-9132f52d1574",
  "77a2f819-ec53-4d8c-a0d9-b736a3e35f1e",
  "bbf0c72e-356a-4ba4-a0d8-d1079aa32493",
  "77b83773-6635-47f0-a22b-ec99cf45b91e",
  "b7de8da7-4621-4e87-bc5c-38071741fcba",
  "da0eae0b-3f7d-42f6-9cc8-3cdbf92658c7",
  "94c6f1d5-12c3-43b8-997f-6f157c8d11f3",
  "02840020-5297-4b7d-9853-ea2eeaf4b5ab",
  "e58458ef-7755-49bc-8828-7b35e20a8244", // 松島の夕景と瑞巌寺の紅葉（紅葉狩りが不足）
];

// ============================================================
// 2. 一人旅タグの追加（街歩き・寺社・美術館・景色。家族向け/大人数向けは除く）
// ============================================================
const SOLO_ADD_IDS = [
  "5c281775-cb3b-404d-8339-d5f03fc2cf72", "7642cfc7-d103-4558-88eb-53c7c84a66d0",
  "d8ccb730-d487-4621-a610-a02f8af8f68a", "94c6f1d5-12c3-43b8-997f-6f157c8d11f3",
  "77a2f819-ec53-4d8c-a0d9-b736a3e35f1e", "02840020-5297-4b7d-9853-ea2eeaf4b5ab",
  "c946b414-7d46-4d6f-acba-2eeab3928a07", "8ba48819-c55a-4a3f-8ba2-8bb5711877bd",
  "b6c6744a-856b-4406-b0ab-45acdf70fbaa", "896c41e3-2a7d-4180-b052-c8ef4cf13c87",
  "cc984fa1-eedc-432e-8d6b-11ffc1020785", "0c542f79-2811-4a59-bfcb-34816ad72c3e",
  "ce55cb0f-9bec-4d98-9f46-f05f48e90be1", "79f54318-346f-4cd9-8e21-c26c4f044c1c",
  "bb5348fc-c7db-472c-82fc-5ddb3db3253b", "d686aaf2-9cd1-4c2a-a27f-87e042f9d717",
  "5d898384-fb98-4926-b61c-53aad0fed6d2", "4e695ede-8aaa-438c-a9e6-c702480b316f",
  "92a02406-a0f0-4720-a1aa-6012cb6a1928", "1f6c8824-808f-40bf-aa0e-eb4835ce78ce",
  "1fdbcd75-7fbe-48e0-8b1c-17d2d734957d", "3bf609b2-ae6f-44ac-8c77-801dc4c56157",
  "5d7ccad2-e753-4c23-b97d-28f5dc1c5c32", "6ccb23f9-c0e0-445c-a1fa-12d985c20efd",
  "ec2b0e8d-865f-4707-8f0d-bc53f4748045", "3b74d624-6a42-4c82-8c6e-d93977d146a0",
  "62195fcc-88cc-4287-81fd-4c43b73a86a6", "b0b18b71-d709-4122-a5ed-effd5296f6a3",
  "e7f63845-d62e-4ada-9896-22f9fb1d408f", "5bc07d20-8991-49e8-b10e-68cd2a02b42f",
  "f10026f4-2dda-43fa-84f9-6b2c5654e616", "998ecdfc-48e2-4e6f-81cd-e82fe6073da2",
  "5c0f7bb4-409e-465e-9231-1c33c54bc05f", "ad835f73-423a-47da-9130-7f2c5e7c289b",
  "4072c8d3-793a-4c6b-a94a-1e273a9ec2d6", "9a6ec970-81e7-4b20-b2f4-352ac108befe",
  "0c237404-68b3-458c-bd13-edf7f6a0c6f4", "bbc2264b-5108-4228-8d22-35f42dd603c7",
  "26d252e6-106f-49b2-9b2f-90d29fa04455", "7c4b9140-57ad-4526-b415-385423403358",
  "f7c8d402-2e17-4228-a93f-df40e43c9f0e", "04f797cf-7186-4ea2-a4d7-a2855062c478",
  "f62dcf1c-c574-4658-8654-5492cbca334e", "f3c75865-519e-4488-8677-d4d9a3b45ec5",
  "4b15dd96-716f-4925-bfe3-86275452108e", "d6beaf2d-3089-4b72-a272-2a563064e5da",
  "3d8afccd-caef-48e8-a49c-57847ced494b", "2c1b1d5f-d746-48f4-9d7a-d31bfbbe9757",
  "416d4fb5-5d59-4886-97f2-e36c88377b52",
  "0df57d67-3dc2-4af0-8b22-74933cfcc298", "bf4dd36f-c4db-4f50-bbd6-c0f763281a15",
  "e4f374cb-4d71-42af-8aff-c698e55962e2", "d07a1c50-be6b-4572-952d-a25feeebf78d",
  "909049ad-4221-402a-b7e0-61d8d794adb7", "af30d135-b7e7-4a4e-b6f1-dec242afcdb9",
  "17f065fd-78f0-4656-b9c4-d2a20d05f780", "264f7d42-8eab-45a9-a8c7-6405265ce6d4",
  "4124d576-4cd8-4086-b61e-9cd8a9576115", "1d0576d3-d044-42dc-94c5-103c8d2ea8fc",
];

// ============================================================
// 3. 温泉・海・リゾート・家族旅行：内容と明らかに合わないものを除去
// ============================================================
const ONSEN_REMOVE_IDS = [
  "bb3ae76a-3afb-4d83-87fb-b8a2989f663d", // 五稜郭と元町（スポットに温泉なし）
];
const RESORT_REMOVE_IDS = [
  "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b", // 首里城と国際通り（スポットにビーチなし）
];
const FAMILY_REMOVE_IDS = [
  "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038", // あべのハルカスと四天王寺（スポットに動物園なし）
  "6dc83721-bc24-44a7-b6c7-bbe59463f0ba", // さいたまスーパーアリーナ
  "ff50f5a4-5a1c-44a6-b160-bed25b4f7863", // ハモニカ横丁と吉祥寺サンロード
  "79db7413-b6dd-4645-9d32-cd073bccbed2", // 大沼公園まで足をのばす
  "feb07068-4d69-45fc-b08a-5c7361177c73", // 石舞台の夜間ライトアップも
  "51cda3be-9832-4e7b-ac74-42bb780ebb89", // 花と丘の絶景、富良野・美瑛1泊2日
  "73d0b93a-5979-41c5-8d67-3cdf7bbbf1da", // 西湖・本栖湖も、富士五湖ドライブ
  "22c9a16c-f753-481c-b2a1-e2c542feb897", // 青い池とラベンダー畑、日帰り
  "b9b5d943-e02a-4013-95e8-89ca62f50842", // グルメも歴史も。那覇
  "2b09beea-4deb-45cc-bae3-41ba5f80df2c", // 琉球王国の歴史を感じる、那覇
  "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b", // 首里城と国際通り
];

// ============================================================
// 4. 絶景：内容と明らかに合わない3件を除去
// ============================================================
const ZEKKEI_REMOVE_IDS = [
  "61ec95e9-752c-4fff-a7d4-b5b0f251159b", // なかはくと闇無浜神社（史跡・神社で景観要素なし）
  "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761", // キツネと動物ふれあい、みやぎ蔵王キツネ村
  "22e33bac-7b3c-4cc1-bd56-d225434ade10", // 旧門司三井倶楽部と出光美術館
];

// 明らかに誤っている目的タグも合わせて修正
const PURPOSE_TAG_REMOVE: { itineraryId: string; purposeTagName: string }[] = [
  { itineraryId: "bb3ae76a-3afb-4d83-87fb-b8a2989f663d", purposeTagName: "温泉" },
  { itineraryId: "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b", purposeTagName: "ビーチ・海水浴" },
  { itineraryId: "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038", purposeTagName: "動物園・水族館" },
];
const PURPOSE_TAG_ADD: { itineraryId: string; purposeTagName: string }[] = [
  { itineraryId: "e58458ef-7755-49bc-8828-7b35e20a8244", purposeTagName: "紅葉狩り" },
];

async function countByTagName(name: string) {
  return prisma.itinerary.count({ where: { status: "published", tags: { some: { tag: { name } } } } });
}

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const tagNames = ["紅葉", "一人旅", "温泉", "海・リゾート", "家族旅行", "絶景"];
  const tags = await prisma.tag.findMany({ where: { name: { in: tagNames } } });
  const tagIdByName = new Map(tags.map((t) => [t.name, t.id]));
  for (const n of tagNames) if (!tagIdByName.has(n)) throw new Error(`タグが見つかりません: ${n}`);

  const before: Record<string, number> = {};
  for (const n of tagNames) before[n] = await countByTagName(n);

  console.log("\n【変更前の件数】");
  for (const n of tagNames) console.log(`  ${n}: ${before[n]}件`);

  console.log(`\n【紅葉タグ除去】対象 ${KOYO_REMOVE_IDS.length}件`);
  console.log(`【紅葉タグ+紅葉狩り 保証】対象 ${KOYO_KEEP_IDS.length}件`);
  console.log(`【一人旅タグ追加】対象 ${SOLO_ADD_IDS.length}件`);
  console.log(`【温泉タグ除去】対象 ${ONSEN_REMOVE_IDS.length}件`);
  console.log(`【海・リゾートタグ除去】対象 ${RESORT_REMOVE_IDS.length}件`);
  console.log(`【家族旅行タグ除去】対象 ${new Set(FAMILY_REMOVE_IDS).size}件`);
  console.log(`【絶景タグ除去】対象 ${ZEKKEI_REMOVE_IDS.length}件`);
  console.log(`【目的タグ除去】対象 ${PURPOSE_TAG_REMOVE.length}件 / 【目的タグ追加】対象 ${PURPOSE_TAG_ADD.length}件`);

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  const koyoTagId = tagIdByName.get("紅葉")!;
  const soloTagId = tagIdByName.get("一人旅")!;
  const onsenTagId = tagIdByName.get("温泉")!;
  const resortTagId = tagIdByName.get("海・リゾート")!;
  const familyTagId = tagIdByName.get("家族旅行")!;
  const zekkeiTagId = tagIdByName.get("絶景")!;

  const koyogariPurposeTag = await prisma.purposeTag.findFirst({ where: { name: "紅葉狩り" } });
  if (!koyogariPurposeTag) throw new Error("目的タグが見つかりません: 紅葉狩り");

  // 1. 紅葉タグ除去
  await prisma.itineraryTag.deleteMany({ where: { tagId: koyoTagId, itineraryId: { in: KOYO_REMOVE_IDS } } });

  // 紅葉タグ+紅葉狩りの保証（skipDuplicatesで既存分は無視）
  await prisma.itineraryTag.createMany({
    data: KOYO_KEEP_IDS.map((id) => ({ itineraryId: id, tagId: koyoTagId })),
    skipDuplicates: true,
  });
  await prisma.itineraryPurposeTag.createMany({
    data: KOYO_KEEP_IDS.map((id) => ({ itineraryId: id, purposeTagId: koyogariPurposeTag.id })),
    skipDuplicates: true,
  });

  // 2. 一人旅タグ追加
  await prisma.itineraryTag.createMany({
    data: SOLO_ADD_IDS.map((id) => ({ itineraryId: id, tagId: soloTagId })),
    skipDuplicates: true,
  });

  // 3. 温泉・海・リゾート・家族旅行タグ除去
  await prisma.itineraryTag.deleteMany({ where: { tagId: onsenTagId, itineraryId: { in: ONSEN_REMOVE_IDS } } });
  await prisma.itineraryTag.deleteMany({ where: { tagId: resortTagId, itineraryId: { in: RESORT_REMOVE_IDS } } });
  await prisma.itineraryTag.deleteMany({ where: { tagId: familyTagId, itineraryId: { in: FAMILY_REMOVE_IDS } } });

  // 4. 絶景タグ除去
  await prisma.itineraryTag.deleteMany({ where: { tagId: zekkeiTagId, itineraryId: { in: ZEKKEI_REMOVE_IDS } } });

  // 明らかに誤っている目的タグの修正
  for (const { itineraryId, purposeTagName } of PURPOSE_TAG_REMOVE) {
    const pt = await prisma.purposeTag.findFirst({ where: { name: purposeTagName } });
    if (pt) await prisma.itineraryPurposeTag.deleteMany({ where: { itineraryId, purposeTagId: pt.id } });
  }
  for (const { itineraryId, purposeTagName } of PURPOSE_TAG_ADD) {
    const pt = await prisma.purposeTag.findFirst({ where: { name: purposeTagName } });
    if (pt) {
      await prisma.itineraryPurposeTag.createMany({
        data: [{ itineraryId, purposeTagId: pt.id }],
        skipDuplicates: true,
      });
    }
  }

  console.log("\n【変更後の件数】");
  const after: Record<string, number> = {};
  for (const n of tagNames) after[n] = await countByTagName(n);
  for (const n of tagNames) console.log(`  ${n}: ${before[n]}件 → ${after[n]}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * 公開中のしおりで、小数が丸められた不正確な位置になっているスポットの一括修正
 * （企画運営を通じたユーザーの了承「直してください」2026-09-28 17:4x。
 * docs/content/20260928-rounded-position-fix-survey.md に詳細と根拠を記載）
 *
 * 【重要】企画運営が一覧を地図で確認し、OKを出してから --commit すること。
 * spotIdで直接特定するため、名前の重複があっても安全。
 *
 * 実行: npm run prod -- node prisma/fix-rounded-positions.cjs [--commit]
 */
const { createRequire } = require("module");
const r = createRequire(process.cwd() + "/package.json");
r("dotenv").config();
const { PrismaClient } = r("@prisma/client");
const { PrismaPg } = r("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const COMMIT = process.argv.includes("--commit");

const TARGETS = [
  { spotId: "0b076aec-c58d-4a91-95d5-f1ef6d507816", name: "亀石", lat: 34.4710917, lng: 135.8115977 },
  { spotId: "19fc7936-fdcd-49de-b938-f10ed38491b0", name: "東京ビッグサイト", lat: 35.6297628, lng: 139.7939817 },
  { spotId: "3b227569-bd06-408a-ada8-70d515a8999c", name: "表参道", lat: 35.6695078, lng: 139.7033033 },
  { spotId: "3ef7a168-e73d-402b-b085-408e6abffe99", name: "中之島公園", lat: 34.6923995, lng: 135.5077568 },
  { spotId: "8d4c570b-058f-4d54-a080-0ad4fc9d41c8", name: "橘寺", lat: 34.4699277, lng: 135.8179119 },
  { spotId: "dd8bc2b8-ddec-4dea-a2a3-3051173f117d", name: "表参道", lat: 35.6695078, lng: 139.7033033 },
  { spotId: "3849f4d6-c15b-4b24-82bb-bd67bd9f153b", name: "羊ヶ丘展望台", lat: 42.9985649, lng: 141.3950272 },
  { spotId: "a492444b-2df5-4fa2-8e0d-1d6cf7785128", name: "関門海峡ミュージアム", lat: 33.9437966, lng: 130.9567859 },
  { spotId: "ebe1ee70-ade0-44a8-8995-0cefd5a2625f", name: "中之島公園", lat: 34.6923995, lng: 135.5077568 },
  { spotId: "a42cf93b-b345-43c8-b3da-17414214ea8f", name: "橘寺", lat: 34.4699277, lng: 135.8179119 },
  { spotId: "2d668ab4-8cc2-486d-8da8-b24204cdc9d1", name: "大沼国定公園", lat: 41.98085, lng: 140.6700799 },
  { spotId: "885937d0-9253-4130-b623-4c62725b7389", name: "高松城跡（玉藻公園）", lat: 34.3501117, lng: 134.0510134 },
  { spotId: "ba71d611-af91-46da-b5bc-725b9b9ed7f9", name: "拓真館", lat: 43.5300324, lng: 142.4895918 },
  { spotId: "6c1be77f-5009-4ff0-a78a-e1d5da2fe49b", name: "堂ヶ島", lat: 34.7841162, lng: 138.7684522 },
  { spotId: "79b8f6c9-ad7d-49c4-aec2-50921654be2d", name: "麓郷の森", lat: 43.3121973, lng: 142.5404549 },
  { spotId: "9ff2fb29-8bb4-4764-b39e-e243469b727a", name: "ファーム富田", lat: 43.4172981, lng: 142.4254766 },
  { spotId: "5b93110d-f4f6-4efb-93ad-6665c5636bf5", name: "拓真館", lat: 43.5300324, lng: 142.4895918 },
  { spotId: "c3cba7a7-090c-4895-9e27-97b7e6eca432", name: "石ヶ戸", lat: 40.5406131, lng: 140.978257 },
  { spotId: "fae2d041-5edd-473b-9cdc-0c1d8e53fb6d", name: "阿修羅の流れ", lat: 40.52967, lng: 140.97673 },
  { spotId: "f6a129fd-1b74-4a59-9072-b9498336cf2a", name: "猪苗代湖", lat: 37.4983353, lng: 140.1460855 },
  { spotId: "3c2be376-50cf-4d54-bed8-c8c1f6edc39d", name: "旧手宮線", lat: 43.2006959, lng: 141.0002232 },
  { spotId: "ab8567c8-825b-43c7-96be-edb361eff503", name: "旧手宮線", lat: 43.2006959, lng: 141.0002232 },
  { spotId: "5cf50b7b-6bdc-432a-b318-427110657d3c", name: "湯ノ湖", lat: 36.8005882, lng: 139.4236986 },
  { spotId: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", name: "五箇山和紙の里", lat: 36.419006, lng: 136.873505 },
  { spotId: "a13e47b9-38e8-4db7-bea3-d35bf1f2895f", name: "富山県美術館", lat: 36.711494, lng: 137.211365 },
  { spotId: "737f6685-0b63-4904-8ee6-1cb533b3abe4", name: "奈良町（ならまち）", lat: 34.6781294, lng: 135.8313493 },
  { spotId: "f3cab405-9fc9-4132-aa33-d6a36dd3e5d4", name: "橘寺", lat: 34.4699277, lng: 135.8179119 },
  { spotId: "88c5b850-0096-4586-943c-221c62f11b55", name: "航空科学博物館", lat: 35.738453, lng: 140.396896 },
  { spotId: "ea494c05-b11a-4c88-a87f-d5e2e1358c1f", name: "蔵王温泉大露天風呂", lat: 38.1660875, lng: 140.4018808 },
  { spotId: "33a8cd1a-2303-4769-835c-b4f746c395ee", name: "足摺岬", lat: 32.726566, lng: 133.011673 },
  { spotId: "464a5142-7c70-4eec-85fb-6c625d958a03", name: "高山陣屋", lat: 36.139629, lng: 137.25769 },
  { spotId: "e8c33099-7009-4e75-ad51-21dbe0f96827", name: "高山陣屋", lat: 36.139629, lng: 137.25769 },
  { spotId: "cfcd762f-8e3b-49b7-96d6-ca3300107e22", name: "殺生石", lat: 37.1015716, lng: 139.999027 },
  { spotId: "a492f9e5-2191-4399-87ff-2be4f8989f55", name: "松江堀川めぐり", lat: 35.474304, lng: 133.052063 },
  { spotId: "1786da25-6b42-49d1-aa85-21a5dab59d6c", name: "湯之平展望所", lat: 31.5914885, lng: 130.6299765 },
];

(async () => {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL).host);
  console.log(COMMIT ? "=== 更新モード ===" : "=== 確認モード（書き込みなし） ===");
  console.log(`対象 ${TARGETS.length} 件\n`);

  let okCount = 0, ngCount = 0;
  for (const t of TARGETS) {
    const spot = await p.spot.findUnique({
      where: { id: t.spotId },
      select: { id: true, name: true, lat: true, lng: true, day: { select: { itinerary: { select: { title: true, status: true } } } } },
    });
    if (!spot) { console.log(`[NG] スポット見つからず spotId=${t.spotId} (${t.name})`); ngCount++; continue; }
    if (spot.name !== t.name) { console.log(`[NG] 名前不一致 spotId=${t.spotId}: DB="${spot.name}" 期待="${t.name}"`); ngCount++; continue; }
    console.log(`[OK] 「${spot.day.itinerary.title}」(${spot.day.itinerary.status}) の「${spot.name}」: (${spot.lat},${spot.lng}) → (${t.lat},${t.lng})`);
    okCount++;
    if (COMMIT) {
      await p.spot.update({ where: { id: spot.id }, data: { lat: t.lat, lng: t.lng } });
      console.log("      → 更新しました");
    }
  }

  console.log(`\n見つかった: ${okCount} / ${TARGETS.length}、見つからず: ${ngCount} / ${TARGETS.length}`);
  if (!COMMIT) console.log("これは確認モードです。企画運営のOKを得てから --commit を付けて実行してください。");
})().finally(() => p.$disconnect());

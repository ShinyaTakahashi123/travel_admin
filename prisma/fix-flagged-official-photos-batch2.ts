/**
 * 台帳の写真724件の確認(docs/content/20261012-photo-review-flags.md)で見つかった、
 * 公式しおりの写真の問題を直す・その2(子ども・場所の取り違えの残り。最初の10か所分)。
 * 同じ場所が複数のしおりで使われている場合は、見つかった写真を全部に当てはめる。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofix-20261013-b2";

type Task = {
  photoId: string;
  spotId: string;
  itinId: string;
  isCover: boolean;
  fileTitle: string;
  caption: string;
  reason: string;
};

const TASKS: Task[] = [
  { photoId: "2d6e2edd-e268-4534-a6d5-8fad15e0064f", spotId: "2fec9aa7-9566-4cc6-9d33-2164eba6e944", itinId: "eebd52df-4af9-478e-9f67-95784b9af2d2", isCover: true, fileTitle: "Yuzawa Town History Museum Yukiguni-kan.JPG", caption: "雪国館", reason: "旧写真はスキー場(Naeba)で場所違い(法務指摘)" },
  { photoId: "6ce5fb7b-ac66-4c7e-838e-dd3df64714fc", spotId: "b0dd5b9d-45cf-47ca-8c55-1d6ef858c318", itinId: "4d332b95-a3a0-4e2a-bdc0-092b71868765", isCover: false, fileTitle: "Yume-Kyobashi castle road. Hikone, Shiga.JPG", caption: "夢京橋キャッスルロード", reason: "旧写真は彦根城天守で場所違い(法務指摘)" },

  { photoId: "fe125840-a1ae-435b-8c82-b12fb8867c40", spotId: "e3b3c4e0-5742-413a-89b6-55081bcbaa91", itinId: "e3e32914-5c7e-4d4c-94ae-c0c0598cdaf1", isCover: false, fileTitle: "Mojiko Station 20190831.jpg", caption: "門司港駅", reason: "旧写真は噴水で遊ぶ子どもが写っていた(1/3)" },
  { photoId: "f4e7afd1-919b-47c1-a2d6-205703850790", spotId: "80db1bef-1ae8-4218-9f17-305d338972fb", itinId: "04cfa60b-a2f6-485e-a8d8-a5dd59af7958", isCover: true, fileTitle: "Mojiko Station 20190831.jpg", caption: "門司港駅", reason: "旧写真は噴水で遊ぶ子どもが写っていた(2/3・表紙)" },
  { photoId: "8f1492bf-2a25-43db-bcc8-45360f899925", spotId: "13d5cff8-5510-40bc-a2b0-7641077e067c", itinId: "22e33bac-7b3c-4cc1-bd56-d225434ade10", isCover: true, fileTitle: "Mojiko Station 20190831.jpg", caption: "門司港駅", reason: "旧写真は噴水で遊ぶ子どもが写っていた(3/3・表紙)" },

  { photoId: "c4256bfc-bdea-44f4-822e-7a1f4fc69027", spotId: "7944cdf2-5a99-4171-b773-7b9df55db3cd", itinId: "bb5348fc-c7db-472c-82fc-5ddb3db3253b", isCover: false, fileTitle: "Izumo Hinomisaki Lighthouse (51821560441).jpg", caption: "出雲日御碕灯台", reason: "旧写真は子どものいる家族連れが写っていた" },

  { photoId: "13224614-7df8-4d8c-9259-434c6abdf1bc", spotId: "c7c38db9-00e2-4fc4-ac34-9b5d2894e2ea", itinId: "7642cfc7-d103-4558-88eb-53c7c84a66d0", isCover: false, fileTitle: "Kyoto-Arashiyama-Station-Keifuku.jpg", caption: "嵐電嵐山駅", reason: "旧写真は赤ちゃんを抱いた人が写っていた(1/3)" },
  { photoId: "ec392714-36a4-4d9a-83d9-fc47b20525d5", spotId: "873f1ce8-85dd-443c-b54f-750324ce5315", itinId: "071e87fd-03f9-4cdd-a3b5-170c62e6a807", isCover: false, fileTitle: "Kyoto-Arashiyama-Station-Keifuku.jpg", caption: "嵐電嵐山駅", reason: "旧写真は赤ちゃんを抱いた人が写っていた(2/3)" },
  { photoId: "a543c5c4-bfff-461b-8bc0-c79a8facf20e", spotId: "0c425786-da71-4077-bb92-f5f6647a6591", itinId: "0582b3c4-fa96-40c2-ad37-c998f8b087a4", isCover: false, fileTitle: "Kyoto-Arashiyama-Station-Keifuku.jpg", caption: "嵐電嵐山駅", reason: "旧写真は赤ちゃんを抱いた人が写っていた(3/3)" },

  { photoId: "c842a600-0d35-46a3-a224-3b12eac37aa6", spotId: "105f8c2c-1f6b-482c-b551-cd4967b13764", itinId: "55a33667-b603-4efa-ad4f-2b5f8e8e2f47", isCover: true, fileTitle: "View of Atami Sun Beach from northeast - Mar 14, 2024.jpg", caption: "熱海サンビーチ", reason: "旧写真は水着姿の混雑と子どもの可能性がある人物が写っていた(表紙)" },

  { photoId: "e9d3d422-2b0d-40f3-8a2d-b37ed626c82c", spotId: "3bc09d38-5804-4696-bd99-45a9adfaa7a3", itinId: "c27fe728-37c2-4ca0-9bac-06451d485ff2", isCover: false, fileTitle: "Odaiba Seaside Park @ Odaiba (9730161317).jpg", caption: "お台場海浜公園", reason: "旧写真は子どもが波打ち際にいた(1/2)" },
  { photoId: "c1c0c47a-6da0-4350-983f-20f20de9c8d4", spotId: "61317a3f-d20a-4621-b02a-2efa03e40d80", itinId: "0b3b850e-f174-49fe-8413-158011680085", isCover: false, fileTitle: "Odaiba Seaside Park @ Odaiba (9730161317).jpg", caption: "お台場海浜公園", reason: "旧写真は子どもが波打ち際にいた(2/2)" },

  { photoId: "ef72bf97-297c-4319-87a8-4a4e4e2a5f36", spotId: "b7734cb9-ec47-4df9-bb46-597ade7ce877", itinId: "ab18b6d8-403b-44e1-b7e3-26d813a6e81f", isCover: false, fileTitle: "Shiroi Koibito Park 20260703c.jpg", caption: "白い恋人パーク", reason: "旧写真は子ども連れが近距離に写っていた(1/2)" },
  { photoId: "a3b75175-c519-49b8-a619-44e1244e5024", spotId: "a64fc7c6-f0cf-4db1-b548-93032af5b394", itinId: "83518f0d-2bb9-44db-a3f1-bf8193c73dcf", isCover: false, fileTitle: "Shiroi Koibito Park 20260703c.jpg", caption: "白い恋人パーク", reason: "旧写真は子ども連れが近距離に写っていた(2/2)" },

  { photoId: "ebf2e037-7f77-4bca-a98e-978277ca092f", spotId: "3c3f8f2d-4790-453a-8ce3-466e9cb0817e", itinId: "04fcc64b-72d2-4b60-8484-ca892ff27f12", isCover: true, fileTitle: "Gala-Yuzawa (94209).jpg", caption: "ガーラ湯沢駅・スキーセンター カワバンガ", reason: "旧写真は子ども向けゲレンデで多数の子どもが写っていた(表紙)" },

  { photoId: "0d5d7ea8-11ec-47d4-b788-20c3a1f46bd9", spotId: "51e524ac-3bb4-40e3-985a-5a67faf1b416", itinId: "0fe4fa73-3422-47d8-a8ac-42ea5872ab22", isCover: false, fileTitle: "Rose garden and Miharashi Tower in Rokko Garden Terrace 20141008.jpg", caption: "六甲ガーデンテラス", reason: "旧写真はベビーカー・子どもを連れた家族が写っていた" },
];

async function main() {
  for (const t of TASKS) {
    const photo = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!photo) throw new Error(`写真が見つかりません: ${t.photoId}`);
    if (photo.spotId !== t.spotId) throw new Error(`spotIdが想定と違います: ${t.photoId}`);
    const itin = await prisma.itinerary.findUnique({ where: { id: t.itinId }, select: { title: true, thumbnailUrl: true } });
    if (!itin) throw new Error(`しおりが見つかりません: ${t.itinId}`);
    const actualIsCover = itin.thumbnailUrl === photo.url;
    if (actualIsCover !== t.isCover) throw new Error(`表紙かどうかの想定が違います: ${t.photoId} (実際: ${actualIsCover})`);
    console.log(`[確認OK] ${t.caption} (${itin.title}) | 表紙: ${t.isCover} | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  const uploadedByFile = new Map<string, { url: string; credit: any }>();
  for (const t of TASKS) {
    let result = uploadedByFile.get(t.fileTitle);
    if (!result) {
      result = (await uploadCommonsFile(t.fileTitle, t.caption, BLOB_PREFIX)) ?? undefined;
      if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
      uploadedByFile.set(t.fileTitle, result);
      console.log(`取得: ${result.url}`, result.credit);
    }

    const oldPhoto = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!oldPhoto) throw new Error(`書き込み直前に写真が見つかりません: ${t.photoId}`);

    await prisma.photo.delete({ where: { id: t.photoId } });
    await prisma.photo.create({
      data: {
        spotId: t.spotId,
        url: result.url,
        caption: t.caption,
        sourceUrl: result.credit.sourceUrl ?? null,
        author: result.credit.author ?? null,
        license: result.credit.license ?? null,
        licenseUrl: result.credit.licenseUrl ?? null,
      },
    });

    if (t.isCover) {
      await prisma.itinerary.update({ where: { id: t.itinId }, data: { thumbnailUrl: result.url } });
      console.log(`  表紙も更新: ${t.itinId}`);
    }
    console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 新規作成)`);
  }
}
main().finally(() => prisma.$disconnect());

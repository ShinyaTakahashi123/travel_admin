/**
 * 台帳の写真724件の確認(docs/content/20261012-photo-review-flags.md)で見つかった、
 * 公式しおりの写真の問題のうち、急ぐ4件を直す(場所の取り違え1件・堂内の仏像1件・
 * 看板の実在の人物1件。場所の取り違えのうち軽井沢は差し替え、もう1件の大門坂は表紙も直す)。
 * 八坂庚申堂は同じ写真が3本のしおり(公開2本・下書き1本)で使われているため、3件とも直す。
 *
 * 古い写真はPhotoごと削除し、新しい写真を作り直す(Blobの古いファイルはそのまま残るが、
 * どこからも参照されなくなるため、管理者サイトの未使用画像クリーンアップCronが後で消す)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "photofix-20261013-b1";

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
  {
    photoId: "ff80dcdf-bf90-4b6e-806e-51bd4b46a2d2",
    spotId: "90f771fc-8b8e-4ea9-a863-7fc64d56a23a",
    itinId: "10bda65e-3efd-42e7-97dc-9f862e83b9b6",
    isCover: false,
    fileTitle: "Karuizawa shopping plaza new east.JPG",
    caption: "軽井沢・プリンスショッピングプラザ",
    reason: "旧写真は池・ゴルフ場の景色で店舗が写っていなかった",
  },
  {
    photoId: "fc7f23a7-b95e-4ccf-8f80-9538693a34ac",
    spotId: "04b96850-bfb9-4028-b955-be7133557527",
    itinId: "4124d576-4cd8-4086-b61e-9cd8a9576115",
    isCover: true,
    fileTitle: "Kumano Kodo pilgrimage route Daimon-zaka World heritage 熊野古道 大門坂01.JPG",
    caption: "熊野古道 大門坂",
    reason: "旧写真は道標のみで、大門坂特有の杉並木の石段が写っていなかった(表紙)",
  },
  {
    photoId: "99ab38c6-3261-4c68-a2d2-47c3ab55da99",
    spotId: "f0a1323a-b52e-4744-8615-b599fa5d9b98",
    itinId: "625c11c9-1f5c-40dd-b510-9e93c517f6ff",
    isCover: false,
    fileTitle: "Byōdō-in Hōōdō.jpg",
    caption: "宇治平等院",
    reason: "旧写真は扉越しに阿弥陀如来像(堂内の仏像)が写っていた",
  },
  {
    photoId: "57f046c1-fdee-4898-8306-c3534058b9d0",
    spotId: "3b78213d-a9a7-47ac-80d2-b3f01782a4de",
    itinId: "fc54731b-8f4b-4a2a-935a-f1e73fac342f",
    isCover: false,
    fileTitle: "Yasaka Koshindo, May 2017.jpg",
    caption: "八坂庚申堂",
    reason: "旧写真に実在の人物の広告ポスターが写っていた(1/3)",
  },
  {
    photoId: "481bfdc1-7674-4f14-beda-91118d6abeab",
    spotId: "2f92fd44-e327-4041-9fc9-7a2e9a7129ae",
    itinId: "2eb3162a-bb0d-4f7c-8e0a-b8e9a77d702a",
    isCover: false,
    fileTitle: "Yasaka Koshindo, May 2017.jpg",
    caption: "八坂庚申堂",
    reason: "旧写真に実在の人物の広告ポスターが写っていた(2/3)",
  },
  {
    photoId: "050e83f1-5ef4-4448-b5af-9210c46ba284",
    spotId: "0b07708b-1819-4297-964b-77e8e0a070d4",
    itinId: "5595cdc0-662e-4c56-bef8-b291c9ae8005",
    isCover: false,
    fileTitle: "Yasaka Koshindo, May 2017.jpg",
    caption: "八坂庚申堂",
    reason: "旧写真に実在の人物の広告ポスターが写っていた(3/3・下書き)",
  },
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

  for (const t of TASKS) {
    const result = await uploadCommonsFile(t.fileTitle, t.caption, BLOB_PREFIX);
    if (!result) throw new Error(`画像の取得・ライセンス確認に失敗しました(${t.fileTitle})`);
    console.log(`取得: ${result.url}`, result.credit);

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

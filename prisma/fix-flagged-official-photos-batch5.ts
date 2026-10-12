/**
 * 台帳の写真の見直し(法務10/13 00:50)で分かった、公式しおりの写真5スポット(6レコード、
 * すすきのは2本のしおり)の場所の取り違えを直す。
 * 台帳側ですでにアップロード済みの写真(placemaster-fix-20261013-1)をそのまま使う
 * (同じ場所の写真なので、再アップロードはしない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

type Photo = { url: string; author: string; license: string; licenseUrl: string; sourceUrl: string };
const PHOTOS: Record<string, Photo> = {
  johnmung: {
    url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/placemaster-fix-20261013-1/%E3%82%B8%E3%83%A7%E3%83%B3%E4%B8%87%E6%AC%A1%E9%83%8E%E8%B3%87%E6%96%99%E9%A4%A8-M3yHujRJKXZ94MJ8aW8OnExV0guWD7.jpg",
    author: "inunami", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%E3%82%B8%E3%83%A7%E3%83%B3%E4%B8%87%E6%AC%A1%E9%83%8E%E8%B3%87%E6%96%99%E9%A4%A8_Sep_6,_2019.jpg",
  },
  susukino: {
    url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/placemaster-fix-20261013-1/%E3%81%99%E3%81%99%E3%81%8D%E3%81%AE-LDclyoN7wJDsHxwPeskkxGwA6WfhVc.jpg",
    author: "ぺ有家音", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Susukino_station_(shiden).JPG",
  },
  ponshukan: {
    url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/placemaster-fix-20261013-1/%E3%81%BD%E3%82%93%E3%81%97%E3%82%85%E9%A4%A8%20%E6%96%B0%E6%BD%9F%E9%A9%9B%E5%BA%97%20%E5%88%A9%E3%81%8D%E9%85%92%E7%95%AA%E6%89%80-vzHH1pFTR0yurkjHYzCVnYNLjC7uCL.jpg",
    author: "Rebirth10", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Niigata_Station_Ponsyukan2.jpg",
  },
  kitora: {
    url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/placemaster-fix-20261013-1/%E3%82%AD%E3%83%88%E3%83%A9%E5%8F%A4%E5%A2%B3%E5%A3%81%E7%94%BB%E4%BD%93%E9%A8%93%E9%A4%A8%E3%80%8C%E5%9B%9B%E7%A5%9E%E3%81%AE%E9%A4%A8%E3%80%8D-YTeFna3MKrrylqVKSSkteExjCByMbc.jpg",
    author: "8-hachiro", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sijinnoyakata.jpg",
  },
  ishiuchi: {
    url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/placemaster-fix-20261013-1/%E3%82%B6%E3%83%BB%E3%83%B4%E3%82%A7%E3%83%A9%E3%83%B3%E3%83%80%E7%9F%B3%E6%89%93%E4%B8%B8%E5%B1%B1-8Jhk2F36DAVsVXy262vhVZUVtLg9Am.jpg",
    author: "Syced", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ishiuchi_Skiing_Resort.jpg",
  },
};

type Task = { photoId: string; spotId: string; itinId: string; isCover: boolean; caption: string; photoKey: keyof typeof PHOTOS; reason: string };

const TASKS: Task[] = [
  { photoId: "eb5eef46-f8a0-47c6-910a-a87ac74f8d71", spotId: "d68b111e-a317-403c-ab7a-83d2a865f517", itinId: "47214a80-9c61-4b42-bc92-b382de9581eb", isCover: true, caption: "ジョン万次郎資料館", photoKey: "johnmung", reason: "旧写真は中浜万次郎本人の肖像写真で、資料館の建物ではなかった(表紙)" },
  { photoId: "ad629259-15c3-4e3b-8a42-9296d3101c58", spotId: "852a8b42-5f83-4fe2-9036-3fba013ac479", itinId: "83518f0d-2bb9-44db-a3f1-bf8193c73dcf", isCover: false, caption: "すすきの", photoKey: "susukino", reason: "旧写真は会社の広告看板が中心だった(1/2)" },
  { photoId: "bb2d3da3-4ec5-4386-9a19-f9172b36abb7", spotId: "8a519a5e-48c6-4287-b3d6-244b3af4894c", itinId: "ab18b6d8-403b-44e1-b7e3-26d813a6e81f", isCover: true, caption: "すすきの", photoKey: "susukino", reason: "旧写真は会社の広告看板が中心だった(2/2・表紙)" },
  { photoId: "9695d16e-a31d-4e0f-84d1-63b00938abbc", spotId: "587f0795-3e1e-4154-b4cf-00f47aefa1f6", itinId: "6eb0ef87-f3a8-4689-ba24-a2c545d46ccf", isCover: false, caption: "ぽんしゅ館 新潟驛店 利き酒番所", photoKey: "ponshukan", reason: "旧写真は工事中の新潟駅で、店が写っていなかった" },
  { photoId: "2b514025-aa76-40a9-84bc-731507f9e63d", spotId: "33a9e46a-b0e1-4065-a5eb-3c8313d3fe0f", itinId: "443379ac-eac1-427a-859b-34aaece19786", isCover: false, caption: "キトラ古墳壁画体験館「四神の館」", photoKey: "kitora", reason: "旧写真は古墳の墳丘で、体験館の建物ではなかった" },
  { photoId: "1bc76978-00e8-40f9-88a0-cf43b9a21265", spotId: "a76b6f22-aef7-4583-b9f8-c0f676334e0b", itinId: "90e7362b-8ee7-412d-895f-21fdea5187f8", isCover: true, caption: "ザ・ヴェランダ石打丸山", photoKey: "ishiuchi", reason: "旧写真は田んぼの中の一軒家が中心で、個人の家のおそれがあった(表紙)" },
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
    console.log(`[確認OK] ${t.caption} (${itin.title}) | ${t.reason}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます(新しい取得はしません)。");

  for (const t of TASKS) {
    const oldPhoto = await prisma.photo.findUnique({ where: { id: t.photoId } });
    if (!oldPhoto) throw new Error(`書き込み直前に写真が見つかりません: ${t.photoId}`);
    const ph = PHOTOS[t.photoKey];

    await prisma.photo.delete({ where: { id: t.photoId } });
    await prisma.photo.create({
      data: {
        spotId: t.spotId,
        url: ph.url,
        caption: t.caption,
        sourceUrl: ph.sourceUrl,
        author: ph.author,
        license: ph.license,
        licenseUrl: ph.licenseUrl,
      },
    });
    if (t.isCover) {
      await prisma.itinerary.update({ where: { id: t.itinId }, data: { thumbnailUrl: ph.url } });
      console.log(`  表紙も更新: ${t.itinId}`);
    }
    console.log(`  COMMITTED: ${t.caption} (photo ${t.photoId} -> 新規作成)`);
  }
}
main().finally(() => prisma.$disconnect());

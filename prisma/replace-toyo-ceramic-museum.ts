/**
 * 大阪市立東洋陶磁美術館（2026年8月3日〜2027年4月ごろ改修工事のため休館）を
 * 大阪市中央公会堂に差し替える（企画運営の指示、B案）
 * 対象: 「東洋陶磁美術館と扇町公園、アートと緑を楽しむ梅田の穴場日帰り旅」(4f25a5b4)
 * 実行: npx tsx prisma/replace-toyo-ceramic-museum.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "4f25a5b4-3398-4532-958e-c6e67d5b999b";
const SPOT_ID = "a8ace013-2f81-4f65-80a2-0dc9a4e14a5b";

const newName = "大阪市中央公会堂";
const newAddress = "大阪市北区中之島1-1-27";
const newLat = 34.6935404;
const newLng = 135.5040087;
const newMemo =
  "中之島の歴史的建築、大阪市中央公会堂からスタートしましょう。大阪メトロ淀屋橋駅から徒歩約5分です。この建物は大正7年(1918年)10月に竣工しました。株式仲買商・岩本栄之助が、実業家・渋沢栄一への相談を経て私財100万円を寄付し、建設が実現したと伝えられています。設計競技で一等入選した岡田信一郎の案をもとに、辰野金吾・片岡安が実施設計を手がけ、ネオ・ルネサンス様式にバロック的な躍動感を加えた重厚な外観が特徴です。2002年には国の重要文化財に指定されました。寄付をした岩本栄之助は、第一次世界大戦による株価暴落で財産の多くを失い、公会堂の完成を見ることなく1916年に亡くなったと伝えられています。彼の志が今もこの建物に息づいていると思うと、見上げる外観の重みが増すようです。中之島の歴史建築を眺めたら、次はすぐ近くの新しい複合施設、グラングリーン大阪(うめきた公園)へ向かいましょう。";

const newTitle = "中之島の歴史建築と扇町公園、アートと緑を楽しむ梅田の穴場日帰り旅";
const oldTitleFragment = "東洋陶磁美術館と扇町公園";

const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/8/82/Osaka_City_Central_Public_Hall_20160221.JPG";
const imageFilePage = "https://commons.wikimedia.org/wiki/File:Osaka_City_Central_Public_Hall_20160221.JPG";
const imageAuthor = "KishujiRapid";
const imageLicense = "CC BY-SA 4.0";
const imageLicenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/";
const blobPath = "osaka-chuo-kokaido/hall.jpg";

function len(s: string) {
  return [...s].length;
}

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { name: true, memo: true } });
  console.log(`[${ITINERARY_ID}] ${spot?.name} → ${newName}`);
  console.log(`  新memo(${len(newMemo)}字): ${newMemo}`);
  if (len(newMemo) < 150) console.log("  !! 150字未満");

  if (commit) {
    await prisma.spot.updateMany({
      where: { id: SPOT_ID },
      data: { name: newName, address: newAddress, lat: newLat, lng: newLng, memo: newMemo },
    });

    const res = await fetch(imageUrl, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
    const buf = Buffer.from(await res.arrayBuffer());
    const jpeg = await toWebJpeg(buf);
    const blob = await put(blobPath, jpeg, { access: "public", addRandomSuffix: true });

    await prisma.photo.deleteMany({ where: { spotId: SPOT_ID } });
    await prisma.photo.create({
      data: {
        spotId: SPOT_ID,
        url: blob.url,
        sourceUrl: imageFilePage,
        author: imageAuthor,
        license: imageLicense,
        licenseUrl: imageLicenseUrl,
      },
    });
    console.log("  写真を差し替えました:", blob.url);
  }

  // タイトル・説明文パッチ
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { title: true, description: true } });
  if (it?.title?.includes(oldTitleFragment)) {
    console.log(`\n[タイトルパッチ]`);
    console.log(`  旧: ${it.title}`);
    console.log(`  新: ${newTitle}`);
    if (commit) {
      await prisma.itinerary.updateMany({ where: { id: ITINERARY_ID }, data: { title: newTitle } });
    }
  }
  if (it?.description?.includes("東洋陶磁美術館")) {
    const newDesc = it.description.replace(/東洋陶磁美術館/g, "大阪市中央公会堂");
    console.log(`\n[説明文パッチ]`);
    console.log(`  旧: ${it.description}`);
    console.log(`  新: ${newDesc}`);
    if (commit) {
      await prisma.itinerary.updateMany({ where: { id: ITINERARY_ID }, data: { description: newDesc } });
    }
  }

  console.log(commit ? "\n反映しました。" : "\n確認モードのため反映していません。--commit で反映します。");
  await prisma.$disconnect();
}
main();

/**
 * #110 76319c13(横浜)の直し(4回目)。法務(2026-10-01 13:26)の指摘
 * (できれば対応): 横浜中華街の写真(File:横浜中華街-1.jpg、朝陽門の
 * 夜景で、周辺のゲームセンターなどの看板が目立つ)を、ゲートそのものに
 * 焦点をあてた昼間の写真に差し替える。
 *
 * File:Yokohama Chinatown entrance.jpg(朝陽門、昼間、ゲート中心の構図、
 * 看板は目立たない) / 著者 Gorgo / パブリックドメイン(著作者により
 * Wikimedia Commonsで公開)
 */
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/8/86/Yokohama_Chinatown_entrance.jpg";
const SOURCE_URL = "https://commons.wikimedia.org/wiki/File:Yokohama_Chinatown_entrance.jpg";
const AUTHOR = "Gorgo";
const LICENSE = "パブリックドメイン";
const LICENSE_URL = "https://commons.wikimedia.org/wiki/File:Yokohama_Chinatown_entrance.jpg";
const OLD_PHOTO_ID = "cf69ab4d-50b4-46ee-a822-a8779f82e6e1";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const chukagai = await findSpotInItinerary(itinId, { spotName: "横浜中華街" });
  const oldPhoto = await prisma.photo.findUnique({ where: { id: OLD_PHOTO_ID } });
  if (!oldPhoto || oldPhoto.spotId !== chukagai.id) throw new Error("既存の写真の情報が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const imgRes = await fetch(IMAGE_URL);
  if (!imgRes.ok) throw new Error(`画像の取得に失敗しました: ${imgRes.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await imgRes.arrayBuffer()));
  const blob = await put(`commons-replacement/yokohama-chukagai-gate.jpg`, jpeg, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.photo.update({
    where: { id: OLD_PHOTO_ID },
    data: { url: blob.url, sourceUrl: SOURCE_URL, author: AUTHOR, license: LICENSE, licenseUrl: LICENSE_URL },
  });
  console.log(`差し替え完了 -> ${blob.url}`);
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

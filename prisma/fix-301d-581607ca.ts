/**
 * チェックリスト #301 の修正記録(4巡目、法務の指摘3点)。
 * しおり「酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日」
 * (581607ca-db3c-489b-8490-50733dcf918d)
 *
 * 1. 「車を運転する方は試飲をひかえましょう」→「車を運転する人は、試飲もふくめて
 *    飲まないでください」に修正(説明文・古い町並みの本文)。古い町並いの本文に
 *    「お酒は20歳から。」を追加。
 * 2. 城山公園の写真: 撮影者が「投稿者」(名前なし)だったため、名前のある別の写真
 *    (Wikimedia Commons「Shiroyama park, Takayama, 2017.jpg」、撮影者: 大野一将、
 *    CC BY-SA 4.0)に差し替え。ダウンロードして目視確認済み(城山公園入口の桜、
 *    人物は小さく遠景)。
 * 3. 飛騨高山まちの博物館の写真(くろふね「古い町並み - panoramio」)は、古い町並みの
 *    通りの写真で博物館ではなかったため、古い町並み(さんまち)のスポットへ付け替え。
 *    博物館は写真なしとする。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-301d-581607ca.ts
 * (実行済み。現在の内容を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import * as fs from "fs";
import * as path from "path";

const ITIN_ID = "581607ca-db3c-489b-8490-50733dcf918d";
const cachePath = path.join(__dirname, "photo-cache.json");
const creditPath = path.join(__dirname, "photo-credit-cache.json");

async function main() {
  // 1) お酒の言い回し
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description?.includes("試飲をひかえましょう")) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: {
        description: itin.description.replace(
          "車を運転する方は試飲をひかえましょう。",
          "車を運転する人は、試飲もふくめて飲まないでください。"
        ),
      },
    });
  }

  const sanmachi = await findSpotInItinerary(ITIN_ID, { spotName: "古い町並み（さんまち）" });
  const sanmachiRow = await prisma.spot.findUniqueOrThrow({ where: { id: sanmachi.id } });
  if (sanmachiRow.memo?.includes("試飲をひかえましょう")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: sanmachi.id },
      {
        memo: sanmachiRow.memo
          .replace("車を運転する方は試飲をひかえましょう。", "車を運転する人は、試飲もふくめて飲まないでください。お酒は20歳から。")
      }
    );
  }

  // 2) 城山公園の写真差し替え
  const imageCache = new Map<string, string | null>(Object.entries(JSON.parse(fs.readFileSync(cachePath, "utf8"))));
  const creditCache = new Map<string, any>(Object.entries(JSON.parse(fs.readFileSync(creditPath, "utf8"))));

  const shiroyama = await findSpotInItinerary(ITIN_ID, { spotName: "城山公園" });
  const shiroyamaPhoto = await prisma.photo.findFirst({ where: { spotId: shiroyama.id } });
  if (shiroyamaPhoto?.sourceUrl?.includes("Statue_of_Kanamori_Nagachika")) {
    const UA = "shiorie-photo/1.0 (contact: st.83.53.abcd@gmail.com)";
    const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/f/f6/Shiroyama_park%2C_Takayama%2C_2017.jpg";
    const imgRes = await fetch(imgUrl, { headers: { "User-Agent": UA } });
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const { toWebJpeg } = await import("./lib/pilot-gen");
    const jpeg = await toWebJpeg(buf);
    const { put } = await import("@vercel/blob");
    const blob = await put(`official-areas-06/${encodeURIComponent("城山公園")}.jpg`, jpeg, {
      access: "public",
      addRandomSuffix: true,
    });
    await prisma.photo.update({
      where: { id: shiroyamaPhoto.id },
      data: {
        url: blob.url,
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Shiroyama_park,_Takayama,_2017.jpg",
        author: "大野一将",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      },
    });
    imageCache.set("城山公園", blob.url);
    creditCache.set("城山公園", {
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Shiroyama_park,_Takayama,_2017.jpg",
      author: "大野一将",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    });
    fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(imageCache), null, 2) + "\n");
    fs.writeFileSync(creditPath, JSON.stringify(Object.fromEntries(creditCache), null, 2) + "\n");
    console.log("城山公園 photo replaced:", blob.url);
  }

  // 3) 博物館の写真を古い町並みへ付け替え
  const machinohaku = await findSpotInItinerary(ITIN_ID, { spotName: "飛騨高山まちの博物館" });
  const machinohakuPhoto = await prisma.photo.findFirst({ where: { spotId: machinohaku.id } });
  const sanmachiHasPhoto = await prisma.photo.findFirst({ where: { spotId: sanmachi.id } });
  if (machinohakuPhoto && !sanmachiHasPhoto) {
    await prisma.photo.update({ where: { id: machinohakuPhoto.id }, data: { spotId: sanmachi.id } });
    console.log("moved 博物館 photo to さんまち");
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

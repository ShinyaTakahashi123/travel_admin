/**
 * 那覇市歴史博物館（休館中）を、しおりごとに異なる営業中スポットへ差し替える
 * 実行: npx tsx prisma/replace-naha-history-museum.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const commit = process.argv.includes("--commit");

type Replacement = {
  itineraryId: string;
  spotId: string;
  newName: string;
  newAddress: string;
  newLat: number;
  newLng: number;
  newMemo: string;
  imageUrl: string;
  imageFilePage: string;
  imageAuthor: string;
  imageLicense: string;
  imageLicenseUrl: string;
  blobPath: string;
};

const replacements: Replacement[] = [
  {
    itineraryId: "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b",
    spotId: "162b7579-30f8-487d-befc-99d9cd440940",
    newName: "壺屋やちむん通り",
    newAddress: "那覇市壺屋",
    newLat: 26.212461,
    newLng: 127.69236,
    newMemo:
      "国際通りから少し足をのばして訪れたいのが、やちむん（焼き物）の町として知られる壺屋です。1682年、琉球王府が県内各地に散らばっていた窯場をこの地に集めたのが壺屋焼のはじまりと伝えられ、300年以上の歴史を持つ壺屋焼は国の伝統的工芸品にも指定されています。琉球石灰岩の石畳が約400mにわたって続く通り沿いには、陶芸工房やギャラリーが軒を連ね、器を選びながらのんびり歩くのが楽しいエリアです。壺屋一帯は沖縄戦の戦禍を比較的免れたとされ、古い登り窯など、戦前の面影を残す貴重な町並みも見どころです。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/JP-47_Naha_Tsuboya-Yachimun-dori_street.jpg",
    imageFilePage: "https://commons.wikimedia.org/wiki/File:JP-47_Naha_Tsuboya-Yachimun-dori_street.jpg",
    imageAuthor: "Hajime NAKANO",
    imageLicense: "CC BY 2.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    blobPath: "naha-tsuboya-yachimun/street.jpg",
  },
  {
    itineraryId: "2b09beea-4deb-45cc-bae3-41ba5f80df2c",
    spotId: "e4088ac5-5f9d-496e-9852-e6c0cbc50d8f",
    newName: "対馬丸記念館",
    newAddress: "那覇市若狭1-25-37",
    newLat: 26.220014,
    newLng: 127.67279,
    newMemo:
      "奥武山公園から波の上ビーチへ向かう道すがら立ち寄りたいのが、対馬丸記念館です。太平洋戦争末期の1944年8月、学童疎開のため多くの子どもたちを乗せて那覇を出港した「対馬丸」は、翌日夜に米潜水艦の攻撃を受けて沈没し、1000人を超える子どもたちを含む多くの犠牲者を出しました。この記念館は2004年に開館し、当時の資料や証言をとおして、この出来事と平和の大切さを伝えています。那覇の「今」を巡る旅の中で、沖縄戦につながる歴史にも触れられる場所です。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Tsushima-maru_Memorial_Museum03n.jpg",
    imageFilePage: "https://commons.wikimedia.org/wiki/File:Tsushima-maru_Memorial_Museum03n.jpg",
    imageAuthor: "663highland",
    imageLicense: "CC BY 2.5",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/2.5/",
    blobPath: "naha-tsushimamaru/museum.jpg",
  },
  {
    itineraryId: "b9b5d943-e02a-4013-95e8-89ca62f50842",
    spotId: "185d7d98-865c-4329-b1df-79f079b71df3",
    newName: "波上護国寺",
    newAddress: "那覇市若狭1-25-5",
    newLat: 26.220068,
    newLng: 127.671579,
    newMemo:
      "福州園から奥武山公園へ向かう途中、波上宮のすぐ隣にあるのが波上護国寺です。14世紀後半、薩摩から遣わされた僧によって開かれたと伝えられ、沖縄でもっとも歴史のある寺院のひとつとされています。本尊は鎌倉時代の作と伝わる聖観世音菩薩。境内には、対馬丸の犠牲になった子どもたちを慰霊する「小桜の塔」も建てられています。現在は本堂の建て替え工事が進められていて、仮本堂での参拝となりますが、静かに手を合わせてみてください。",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gokokuji%2C_Naha.JPG",
    imageFilePage: "https://commons.wikimedia.org/wiki/File:Gokokuji,_Naha.JPG",
    imageAuthor: "ChiefHira",
    imageLicense: "CC BY-SA 3.0",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    blobPath: "naha-gokokuji/temple.jpg",
  },
];

function len(s: string) {
  return [...s].length;
}

async function main() {
  for (const r of replacements) {
    const spot = await prisma.spot.findUnique({ where: { id: r.spotId }, select: { name: true, memo: true } });
    console.log(`\n[${r.itineraryId}] ${spot?.name} → ${r.newName}`);
    console.log(`  新memo(${len(r.newMemo)}字): ${r.newMemo}`);
    if (len(r.newMemo) < 150) console.log("  !! 150字未満");

    if (commit) {
      await prisma.spot.updateMany({
        where: { id: r.spotId },
        data: { name: r.newName, address: r.newAddress, lat: r.newLat, lng: r.newLng, memo: r.newMemo },
      });

      const res = await fetch(r.imageUrl, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
      const buf = Buffer.from(await res.arrayBuffer());
      const jpeg = await toWebJpeg(buf);
      const blob = await put(r.blobPath, jpeg, { access: "public", addRandomSuffix: true });

      await prisma.photo.deleteMany({ where: { spotId: r.spotId } });
      await prisma.photo.create({
        data: {
          spotId: r.spotId,
          url: blob.url,
          sourceUrl: r.imageFilePage,
          author: r.imageAuthor,
          license: r.imageLicense,
          licenseUrl: r.imageLicenseUrl,
        },
      });
      console.log("  写真を差し替えました:", blob.url);
    }
  }

  // fbb0ba76の説明文パッチ
  const descTarget = await prisma.itinerary.findUnique({
    where: { id: "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b" },
    select: { description: true },
  });
  if (descTarget?.description?.includes("那覇市歴史博物館")) {
    const newDesc = descTarget.description.replace("那覇市歴史博物館", "壺屋やちむん通り");
    console.log(`\n[説明文パッチ] fbb0ba76`);
    console.log(`  旧: ${descTarget.description}`);
    console.log(`  新: ${newDesc}`);
    if (commit) {
      await prisma.itinerary.updateMany({
        where: { id: "fbb0ba76-da3a-4ed6-b64e-e8e50feeb39b" },
        data: { description: newDesc },
      });
    }
  }

  console.log(commit ? "\n反映しました。" : "\n確認モードのため反映していません。--commit で反映します。");
  await prisma.$disconnect();
}
main();

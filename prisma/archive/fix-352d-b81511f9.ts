/**
 * #352の続き。企画運営14:25の3点・法務14:26の2点に対応。
 *
 * 【企画運営】
 * 1. 決まりA水増し: 美浜アメリカンビレッジ180分→100分、アラハビーチ135分→
 *    60分に短縮。空いた時間に、世界遺産・中城城跡と、護佐丸ゆかりの中村家
 *    住宅(ともに中城村・北中城村、実在の公共の行き先)を新規追加し6か所に。
 * 2. 最初の北谷町立博物館に行き方がなかったため、那覇空港でレンタカーを
 *    借りる一文を追加。最後は中村家住宅から借りた場所(那覇空港)へ返す形に。
 * 3. 説明文を新しい構成に合わせて修正。
 *
 * 【法務】
 * ① 美浜アメリカンビレッジの写真が、令和4年解体済みの観覧車「SKYMAX60」
 *    を写していた。現在の街並みが写る写真(Depot Island、2010年撮影、
 *    観覧車は写っていない)に差し替え。サンセットビーチにも新規に写真を
 *    追加(いずれもWikimedia Commons、CC BY系)。
 * ② 説明文の「安良波公園・アラハビーチの史跡」は、国などが指定した史跡
 *    ではなく史実を伝える遊具のため「史実ゆかりの安良波公園・アラハ
 *    ビーチ」に修正。
 *
 * 事実確認:
 * - 中城城跡: 世界遺産(琉球王国のグスク及び関連遺産群)・国指定史跡・
 *   日本100名城。護佐丸の墓、大井戸(ウフガー)あり。8:30〜17:00開館、無休。
 *   出典: https://www.nakagusuku-jo.jp/
 * - 中村家住宅: 国指定重要文化財(昭和31年に琉球政府から、昭和47年の復帰と
 *   同時に日本政府から指定)。18世紀中頃建築と伝わる、沖縄の伝統的な住居
 *   建築の特色を備える。先祖は中城城主・護佐丸にゆかりがあると伝わる。
 *   石垣と福木(ふくぎ)の防風林で台風に備える構造。水・木・金・土・日曜
 *   開館(火曜定休)。
 *   出典: https://www.nakamurahouse.jp/
 *
 * 写真の出典:
 * - Depot Island: https://commons.wikimedia.org/wiki/File:Depot_Island_-_panoramio.jpg
 *   (hasano_jp、CC BY 3.0)
 * - サンセットビーチ: https://commons.wikimedia.org/wiki/File:Chatan_Sunset_Beach_from_breakwater.JPG
 *   (そらみみ、CC BY-SA 4.0)
 *
 * 座標の出典(Nominatim名称一致): 中城城跡26.2839342,127.8011595・
 * 中村家住宅26.2896109,127.8005416
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352d-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";
const DAY1_ID = "b1b7e2d1-5374-4fb5-9bbe-66409ec1e46b";

const HAKUBUTSUKAN_ID = "a092ee80-3290-4c84-b22e-081870087bda";
const MIHAMA_ID = "b73c64f0-94c1-4645-8300-813e39fe9270";
const SUNSET_ID = "f09075c0-a91f-4699-b215-ecf43989506a";
const ARAHA_ID = "45573490-d3ad-4870-9212-f4a5ae334b01";

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY1_ID, name: "中城城跡" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const hakubutsukan = await prisma.spot.findUniqueOrThrow({ where: { id: HAKUBUTSUKAN_ID } });
  const hakubutsukanNewMemo = hakubutsukan.memo!.replace(
    "北谷町立博物館からスタートです。",
    "那覇空港でレンタカーを借りたら、車でおよそ35分の北谷町立博物館からスタートです。"
  );
  if (hakubutsukanNewMemo === hakubutsukan.memo) throw new Error("北谷町立博物館: 書き出しの置換に失敗");

  const mihama = await prisma.spot.findUniqueOrThrow({ where: { id: MIHAMA_ID } });
  const mihamaNewMemo = mihama.memo!.replace("ひと通り見て回ったら、このあたりで昼食をとりましょう。", "");
  if (mihamaNewMemo === mihama.memo) throw new Error("美浜アメリカンビレッジ: 昼食の一言の削除に失敗");

  const sunset = await prisma.spot.findUniqueOrThrow({ where: { id: SUNSET_ID } });
  const sunsetNewMemo = sunset.memo!.replace(
    "北谷公園に隣接する、北谷町が管理するビーチです。",
    "北谷公園に隣接する、北谷町が管理するビーチです。到着したら、まずこのあたりで昼食をとりましょう。"
  );
  if (sunsetNewMemo === sunset.memo) throw new Error("サンセットビーチ: 昼食の一言の追加に失敗");

  const araha = await prisma.spot.findUniqueOrThrow({ where: { id: ARAHA_ID } });
  const arahaNewMemo = araha.memo!.replace(
    "北谷ならではの異国情緒とサンセットを、ゆっくり楽しみましょう。帰りは、那覇空港まで車でおよそ30分です。",
    "北谷ならではの異国情緒を味わいましょう。見学を終えたら、車でおよそ12分の中城城跡へ向かいましょう。"
  );
  if (arahaNewMemo === araha.memo) throw new Error("安良波公園・アラハビーチ: 結びの置換に失敗");

  const nakagusukuMemo =
    "安良波公園・アラハビーチを見学したら、車でおよそ12分の中城城跡へ向かいましょう。世界遺産(琉球王国のグスク及び関連遺産群)に登録されている、国指定史跡の城跡です。自然の岩石や地形を巧みに利用した、美しい曲線を描く石垣が見どころで、当時の高い石積み技術を伝えています。城内には、生活用水に使われたとされる大きな井戸「大井戸(ウフガー)」や、名将として知られた城主・護佐丸の墓もあります。石垣の上からは、太平洋と東シナ海の両方を見渡すことができます。琉球王国時代の石造り技術の粋を、じっくりと眺めてみましょう。見学を終えたら、歩いておよそ9分の中村家住宅へ向かいましょう。";

  const nakamuraMemo =
    "中城城跡を見学したら、歩いておよそ9分の中村家住宅へ向かいましょう。18世紀中頃の建築と伝わる、沖縄の伝統的な住居建築の特色を今に伝える農家住宅で、国の重要文化財に指定されています。中村家の先祖は、中城城の城主だった名将・護佐丸にゆかりがあると伝わり、後にこの地域の行政を担う家柄になったとされています。敷地の東・南・西を琉球石灰岩の石垣で囲い、その内側に防風林の役目を果たす福木(ふくぎ)を植えるなど、台風に備えた沖縄ならではの工夫も見どころです。かつての沖縄の暮らしを伝える住まいを、じっくりと見学しましょう。見学を終えたら、借りたレンタカーを那覇空港まで返しに行きましょう。";

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: ITIN_ID },
      data: {
        description:
          "カラフルな街並みが目印の美浜アメリカンビレッジ。万座毛とは違う、北谷ならではの異国情緒とサンセットを楽しむプランです。伊礼原遺跡に隣接する北谷町立博物館や、史実ゆかりの安良波公園・アラハビーチ、世界遺産の中城城跡もめぐります。",
      },
    });

    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: HAKUBUTSUKAN_ID, data: { memo: hakubutsukanNewMemo } },
        { id: MIHAMA_ID, data: { memo: mihamaNewMemo, stayDurationMin: 100 } },
        { id: SUNSET_ID, data: { memo: sunsetNewMemo } },
        { id: ARAHA_ID, data: { memo: arahaNewMemo, stayDurationMin: 60 } },
        {
          create: {
            name: "中城城跡",
            address: "沖縄県中頭郡中城村字泊1258",
            lat: 26.2839342,
            lng: 127.8011595,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 22)),
            stayDurationMin: 80,
            transitMode: "car",
            transitDurationMin: 12,
            memo: nakagusukuMemo,
          },
        },
        {
          create: {
            name: "中村家住宅",
            address: "沖縄県中頭郡北中城村字大城106",
            lat: 26.2896109,
            lng: 127.8005416,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 51)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 9,
            memo: nakamuraMemo,
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  // 写真の差し替え・追加
  const mihamaPhotoRes = await fetch("https://upload.wikimedia.org/wikipedia/commons/d/df/Depot_Island_-_panoramio.jpg", {
    headers: { "User-Agent": "shiorie-content-tool/1.0" },
  });
  const mihamaPhotoBuf = Buffer.from(await mihamaPhotoRes.arrayBuffer());
  const mihamaJpeg = await toWebJpeg(mihamaPhotoBuf);
  const mihamaBlob = await put("official-areas-17/mihama-depot-island.jpg", mihamaJpeg, { access: "public", addRandomSuffix: true });

  await prisma.photo.deleteMany({ where: { spotId: MIHAMA_ID } });
  await prisma.photo.create({
    data: {
      spotId: MIHAMA_ID,
      url: mihamaBlob.url,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Depot_Island_-_panoramio.jpg",
      author: "hasano_jp",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
  });
  console.log("美浜アメリカンビレッジ: 写真を差し替えました(観覧車なし)", mihamaBlob.url);

  const sunsetPhotoRes = await fetch("https://upload.wikimedia.org/wikipedia/commons/8/81/Chatan_Sunset_Beach_from_breakwater.JPG", {
    headers: { "User-Agent": "shiorie-content-tool/1.0" },
  });
  const sunsetPhotoBuf = Buffer.from(await sunsetPhotoRes.arrayBuffer());
  const sunsetJpeg = await toWebJpeg(sunsetPhotoBuf);
  const sunsetBlob = await put("official-areas-17/chatan-sunset-beach.jpg", sunsetJpeg, { access: "public", addRandomSuffix: true });

  await prisma.photo.create({
    data: {
      spotId: SUNSET_ID,
      url: sunsetBlob.url,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Chatan_Sunset_Beach_from_breakwater.JPG",
      author: "そらみみ",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  });
  console.log("サンセットビーチ: 写真を新規追加しました", sunsetBlob.url);

  console.log("#352: 企画運営・法務の指摘に対応完了");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

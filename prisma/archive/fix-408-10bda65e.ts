/**
 * チェックリスト #408 10bda65e「旧軽井沢銀座とアウトレット、軽井沢ショッピング&避暑日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。雲場池 → 軽井沢聖パウロカトリック教会 → 旧軽井沢銀座通り（昼食）→ 軽井沢ショー記念礼拝堂 → 旧三笠ホテル → 白糸の滝 → 軽井沢・プリンスショッピングプラザ（7か所 09:00〜16:35）
 * 既存の4か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。タイトルは内容に合っているのでそのまま
 * 写真: 旧軽井沢銀座通りの写真（Mt.Asama,_Karuizawa.jpg）は田畑越しの浅間山で場所違い、しかも表紙だったので替える
 *   → https://commons.wikimedia.org/wiki/File:Old_Karuizawa_ginza01s3200.jpg（663highland、CC BY 2.5、説明「Old Karuizawa Ginza」、目で見て通りと店を確認）
 *   表紙は旧三笠ホテルの写真に。ほかの3枚（聖パウロ教会・旧三笠ホテル・プラザの池と芝生）は目で見て合っているので残す
 * 本文の出典: 軽井沢観光協会 雲場池 https://karuizawa-kankokyokai.jp/spot/23234/ ／旧軽井沢銀座通り https://karuizawa-kankokyokai.jp/spot/30092/ ／
 *   ショーハウス記念館 https://karuizawa-kankokyokai.jp/spot/1144/ ／白糸の滝 https://karuizawa-kankokyokai.jp/spot/23206/ ／プリンスショッピングプラザ https://karuizawa-kankokyokai.jp/spot/1551/ ／
 *   軽井沢銀座商会 聖パウロ教会 http://karuizawa-ginza.org/shop/stpaul_church/ ・ショー記念礼拝堂 http://karuizawa-ginza.org/shop/shaw_memorial_church/ ／
 *   旧三笠ホテル https://kyu-mikasa-hotel.jp/ ・ https://kyu-mikasa-hotel.jp/guide/ ・ https://karuizawa-kankokyokai.jp/spot/1148/ ／プラザの営業時間 https://www.karuizawa-psp.jp/
 * 座標の出典: Nominatim（雲場池 tourism=viewpoint 36.3506580,138.6268330／聖パウロカトリック教会 36.3597210,138.6341300／
 *   旧軽井沢銀座 36.3598831,138.6368547／軽井沢ショー記念礼拝堂 36.3621095,138.6390282／旧三笠ホテル 36.3731331,138.6262318／
 *   白糸の滝 36.4103914,138.5924843／軽井沢・プリンスショッピングプラザ 36.3391616,138.6331098）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-408-10bda65e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "10bda65e-3efd-42e7-97dc-9f862e83b9b6";
const DAY1_ID = "ab9071c6-55de-4851-a9f0-3242466bbbf5";
const GINZA_ID = "00f41c45-2ab7-4016-b0b7-8b0fa223c09d";
const STPAUL_ID = "50100044-93b1-486c-a81c-cd0181d5b94c";
const MIKASA_ID = "7a1dba69-a3f6-4f26-a4a1-fee274f09699";
const PSP_ID = "90f771fc-8b8e-4ea9-a863-7fc64d56a23a";
const IMAGE = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Old_Karuizawa_ginza01s3200.jpg";
const PAGE = "https://commons.wikimedia.org/wiki/File:Old_Karuizawa_ginza01s3200.jpg";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "「スワンレイク」とも呼ばれる雲場池を朝に散策し、旧軽井沢の教会と、店が並ぶ旧軽井沢銀座通りで昼食を。軽井沢で最初の教会・ショー記念礼拝堂と、「軽井沢の鹿鳴館」と呼ばれた旧三笠ホテルで避暑地の歴史にふれ、白糸の滝で涼んだら、最後は軽井沢駅前のプリンスショッピングプラザでお買い物。軽井沢のショッピングと避暑を楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("雲場池", 9, 0, 40, null, null, 36.350658, 138.626833, "長野県北佐久郡軽井沢町軽井沢",
    "「スワンレイク」とも呼ばれる小さな池で、水面に映る四季折々の自然が美しく、落ち着いた雰囲気の場所です。池のまわりは約1kmの散策路になっていて、のんびり歩きながら景色を楽しめます。新緑や紅葉の季節は特に美しく、軽井沢を代表する景勝地です。まわりの駐車場は限られているので、公式の案内で確かめてから向かいましょう。"),
  upd(STPAUL_ID, 9, 55, 20, "car", 10, 36.359721, 138.63413,
    "雲場池から車で約10分。外国人の別荘が300戸を超えていた昭和10年（1935年）に建てられたカトリックの教会で、設計はアントニン・レーモンドです。今も教会として使われていて、挙式や礼拝の間は中に入れません。今も祈りが続く場所ですので、静かに、敬意をもって見学しましょう。"),
  upd(GINZA_ID, 10, 20, 100, "walk", 5, 36.359883, 138.636855,
    "聖パウロ教会から歩いてすぐ。旧軽井沢のメインストリートで、約750mの通りの両側に、老舗のベーカリーやコーヒーショップ、お土産や食べ歩きのお店が並びます。木造のクラシックな外観の軽井沢観光会館では、観光情報を教えてもらえます。通りの散策を楽しみながら、ここで昼食にしましょう。",
    { name: "旧軽井沢銀座通り（昼食）" }),
  cre("軽井沢ショー記念礼拝堂", 12, 5, 25, "walk", 5, 36.36211, 138.639028, "長野県北佐久郡軽井沢町大字軽井沢57-1",
    "旧軽井沢銀座通りから少し足を伸ばした先にある、明治28年（1895年）に造られた軽井沢で最初の教会です。軽井沢を避暑地として開いたアレキサンダー・クロフト・ショーを記念した聖公会の教会で、軽井沢に今ある教会の中で最も古い建物とされています。となりのショーハウス記念館は、ショーが明治21年（1888年）に建てた軽井沢で最初の別荘を復元したもので、ショーはこの地を「屋根のない病院」と呼んで絶賛したと伝わります。記念館は冬の間は休館し、休館日もあるので、公式の案内で確かめてから訪れましょう。今も祈りが続く場所ですので、静かに、敬意をもって見学しましょう。"),
  upd(MIKASA_ID, 12, 45, 50, "car", 10, 36.373133, 138.626232,
    "ショー記念礼拝堂から車で約10分。実業家・山本直良が明治39年（1906年）に創業したホテルで、「軽井沢の鹿鳴館」と呼ばれ、多くの文化人や政財界の人々に愛されました。設計・施工とも日本人の手による明治後期の純西洋式の木造ホテルで、八角形の塔屋を配した非対称の姿が特徴です。昭和55年（1980年）に国の重要文化財に指定され、約5年半の保存修理を経て、2025年にリニューアルオープンしました。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("白糸の滝", 13, 55, 40, "car", 20, 36.410391, 138.592484, "長野県北佐久郡軽井沢町長倉 小瀬",
    "旧三笠ホテルから車で約20分。湯川の水源にある滝で、高さ3m、幅70mの岩肌から、数百条の地下水が白い糸のように流れ落ちます。春は新緑、夏は滝しぶきと涼しい風、秋は紅葉と、季節ごとの景色を楽しめます。滝の近くは足元がぬれて滑りやすいので、気をつけて歩きましょう。"),
  upd(PSP_ID, 15, 5, 90, "car", 30, 36.339162, 138.63311,
    "白糸の滝から車で約30分。軽井沢駅の南口側に広がる、自然豊かなロケーションの中のリゾート型ショッピングモールで、アウトレットやインテリア、雑貨、スポーツ・アウトドアなどの店が集まっています。旅の最後に、お土産選びやお買い物を楽しみましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${GINZA_ID},${STPAUL_ID},${MIKASA_ID},${PSP_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));
  const ginzaPhoto = await prisma.photo.findMany({ where: { spotId: GINZA_ID } });
  if (ginzaPhoto.length !== 1 || !ginzaPhoto[0].sourceUrl?.includes("Mt.Asama")) throw new Error("旧軽井沢銀座通りの写真が想定と違います");
  const mikasaPhoto = await prisma.photo.findFirstOrThrow({ where: { spotId: MIKASA_ID } });
  console.log(`替える写真: ${ginzaPhoto[0].sourceUrl} → ${PAGE}`);
  console.log(`表紙: ${it.thumbnailUrl}\n→ ${mikasaPhoto.url}`);

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-408/kyu-karuizawa-ginza.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("上げた写真:", blob.url);
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: mikasaPhoto.url } });
      await tx.photo.update({ where: { id: ginzaPhoto[0].id }, data: { url: blob.url, sourceUrl: PAGE, author: "663highland", license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5" } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

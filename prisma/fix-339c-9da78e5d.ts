/**
 * #339の続き。企画運営07:42の指摘3点に対応。
 * 1) 由布岳に、由布院駅前でレンタカーを借りて登山口へ向かう行き方を追加
 *    (バスではなく、1日を通して同じ車を使う形に統一)。
 * 2) 塚原温泉「日本三大薬湯」は効能を思わせる言い方のため、「強い酸性の湯として
 *    知られています」に修正。
 * 3) 由布院駅の滞在50分は駅舎を見るだけには長いため、駅舎内のアートホールの
 *    企画展示に触れる形にしつつ35分に短縮。空いた15分は、企画運営が候補に
 *    挙げていた由布院ステンドグラス美術館(日本初のステンドグラス専門美術館)を
 *    2日目に新たに追加して埋めた(40分)。
 *
 * 佛山寺には、すでに宿の一言が入っている(変更なし)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-339c-9da78e5d.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9da78e5d-1fdd-415d-bd06-46c13d62d732";
const DAY2_ID = "7c3fcb3f-f642-48f0-b319-98321106c477";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "由布院ステンドグラス美術館", day: { itineraryId: ITIN_ID } } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const yufudake = await prisma.spot.findFirstOrThrow({ where: { name: "由布岳", day: { itineraryId: ITIN_ID } } });
  const oldY1 = "由布岳は、標高1,583mの、由布院盆地の北東にそびえる山で、";
  const nextY1 = "由布院駅前でレンタカーを借り、車でおよそ15分の由布岳正面登山口へ向かいます。由布岳は、標高1,583mの、由布院盆地の北東にそびえる山で、";
  const oldY2 = "下山後は、正面登山口に停めたレンタカーで移動します。続いては、車でおよそ6分の塚原温泉 火口乃泉へ向かいましょう。";
  const nextY2 = "続いては、車でおよそ6分の塚原温泉 火口乃泉へ向かいましょう。";
  if (!yufudake.memo?.includes(oldY1) && !yufudake.memo?.includes(oldY2)) {
    console.log("yufudake already fixed");
  } else {
    let m = yufudake.memo || "";
    if (m.includes(oldY1)) m = m.replace(oldY1, nextY1);
    if (m.includes(oldY2)) m = m.replace(oldY2, nextY2);
    await prisma.spot.update({ where: { id: yufudake.id }, data: { memo: m } });
    console.log("yufudake access line added");
  }

  const tsukahara = await prisma.spot.findFirstOrThrow({ where: { name: "塚原温泉 火口乃泉", day: { itineraryId: ITIN_ID } } });
  const oldT = "強い酸性の泉質でも知られ、「日本三大薬湯」の一つともいわれています。";
  const nextT = "強い酸性の泉質として知られています。";
  if (tsukahara.memo?.includes(oldT)) {
    await prisma.spot.update({ where: { id: tsukahara.id }, data: { memo: tsukahara.memo.replace(oldT, nextT) } });
    console.log("tsukahara wording softened");
  } else {
    console.log("tsukahara already fixed");
  }

  const yunotsubo = await prisma.spot.findFirstOrThrow({ where: { name: "湯の坪街道", dayId: DAY2_ID } });
  const stainedGlass = {
    name: "由布院ステンドグラス美術館",
    address: "由布市湯布院町川上2461-3",
    lat: 33.259785,
    lng: 131.365845,
    memo:
      "湯の坪街道からは歩いておよそ10分です。由布院ステンドグラス美術館は、日本で初めての本格的なステンドグラス専門美術館です。ヨーロッパの教会などで使われていた、19世紀から20世紀初頭のアンティークステンドグラスを、専用の礼拝堂やギャラリーで間近に鑑賞できます。光を通して浮かび上がる色鮮やかなガラスの意匠を、ゆっくりと眺めてみましょう。続いては、歩いておよそ5分の宇奈岐日女神社へ向かいましょう。",
  };
  const unagihime = await prisma.spot.findFirstOrThrow({ where: { name: "宇奈岐日女神社", dayId: DAY2_ID } });
  const daigosha = await prisma.spot.findFirstOrThrow({ where: { name: "大杵社", dayId: DAY2_ID } });
  const yufuinEki = await prisma.spot.findFirstOrThrow({ where: { name: "由布院駅", dayId: DAY2_ID } });
  const kinrinko = await prisma.spot.findFirstOrThrow({ where: { name: "金鱗湖", dayId: DAY2_ID } });
  const tensoJinja = await prisma.spot.findFirstOrThrow({ where: { name: "天祖神社", dayId: DAY2_ID } });
  const shitanyu = await prisma.spot.findFirstOrThrow({ where: { name: "下ん湯", dayId: DAY2_ID } });
  const comico = await prisma.spot.findFirstOrThrow({ where: { name: "COMICO ART MUSEUM YUFUIN", dayId: DAY2_ID } });

  const yunotsuboOld = "続いては、歩いておよそ11分の宇奈岐日女神社へ向かいましょう。";
  const yunotsuboNext = "続いては、歩いておよそ10分の由布院ステンドグラス美術館へ向かいましょう。";
  if (!yunotsubo.memo?.includes(yunotsuboOld)) throw new Error("yunotsubo forward line not found");

  const unagihimeOld = "湯の坪街道からは歩いておよそ11分です。";
  const unagihimeNext = "由布院ステンドグラス美術館からは歩いておよそ5分です。";
  if (!unagihime.memo?.includes(unagihimeOld)) throw new Error("unagihime opener not found");

  const yufuinEkiOldMemo = yufuinEki.memo || "";
  const yufuinEkiNextMemo = yufuinEkiOldMemo.replace(
    "礼拝堂をイメージしたという中央コンコースは、高さおよそ12mの吹き抜けで、改札口を設けない開放的なつくりが特徴です。ホームには足湯も設けられており、電車を待つ間にひと息つくこともできます。正面からは由布岳の姿を望むことができ、駅舎そのものが由布院の風景の一部となっています。木造建築ならではの温もりを感じながら、この旅を締めくくりましょう。",
    "礼拝堂をイメージしたという中央コンコースは、高さおよそ12mの吹き抜けで、改札口を設けない開放的なつくりが特徴です。駅舎内のアートホールでは企画展示が入れ替わりで行われており、ホームの足湯とあわせて、電車を待つ間に立ち寄ることができます。木造建築ならではの温もりを感じながら、この旅を締めくくりましょう。"
  );
  if (yufuinEkiNextMemo === yufuinEkiOldMemo) throw new Error("yufuin eki text not found");

  await setDaySpotOrder(DAY2_ID, [
    { id: kinrinko.id, data: {} },
    { id: tensoJinja.id, data: {} },
    { id: shitanyu.id, data: {} },
    { id: comico.id, data: {} },
    { id: yunotsubo.id, data: { memo: yunotsubo.memo.replace(yunotsuboOld, yunotsuboNext) } },
    {
      create: {
        name: stainedGlass.name,
        address: stainedGlass.address,
        lat: stainedGlass.lat,
        lng: stainedGlass.lng,
        visitTime: t(13, 41),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 10,
        memo: stainedGlass.memo,
      },
    },
    {
      id: unagihime.id,
      data: {
        visitTime: t(14, 26),
        transitMode: "walk",
        transitDurationMin: 5,
        memo: unagihime.memo.replace(unagihimeOld, unagihimeNext),
      },
    },
    { id: daigosha.id, data: { visitTime: t(15, 30) } },
    {
      id: yufuinEki.id,
      data: { visitTime: t(16, 24), stayDurationMin: 35, memo: yufuinEkiNextMemo },
    },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

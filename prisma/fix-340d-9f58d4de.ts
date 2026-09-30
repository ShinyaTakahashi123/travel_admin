/**
 * #340の続き。企画運営07:58の指摘に対応。
 * 1) 1日目で九州国立博物館(50→90分)・太宰府天満宮参道(67→90分)・
 *    光明禅寺(58→79分)を延ばして時間を合わせたのは決まりA(水増し)。
 *    博物館は常設展の目安60〜70分で68分、参道は元の67分、光明禅寺は
 *    目安30〜40分で38分に戻し、空いた時間は実在の菅公歴史館(天満宮
 *    本殿裏、博多人形で道真公の生涯を紹介)と太宰府市文化ふれあい館
 *    (国分、無料、太宰府の歴史資料)を新たに追加して埋めた。
 *    光明禅寺→文化ふれあい館はコミュニティバス「まほろば」を利用。
 * 2) 2日目の昼食を、展示施設である大宰府展示館から、食事ができる
 *    場所の枠として大宰府政庁跡(周辺に飲食店あり)の一言に移した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340d-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "8131749f-57e6-4cdf-a2ba-3d0eb2f9928c";
const DAY2_ID = "710a12c3-f43f-4f31-953c-31bcf19bc319";

const HAKUBUTSUKAN_ID = "4a7689e5-bdf2-486b-88a0-c28b3db3c86b";
const TENKAI_INARI_ID = "97be37e3-b81c-4db3-bc08-5aaeb859a511";
const TENMANGU_ID = "1fcd6d7a-aeb7-4e8e-8dde-8e41b7cb324c";
const SANDO_ID = "f5c797ff-33c3-4094-97b8-64e6d82316ac";
const KOMYOZENJI_ID = "a02f8e90-50c8-4956-8f53-18bbdcba5669";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "菅公歴史館", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const hakubutsukan = await prisma.spot.findFirstOrThrow({ where: { id: HAKUBUTSUKAN_ID } });
  const tenkaiInari = await prisma.spot.findFirstOrThrow({ where: { id: TENKAI_INARI_ID } });
  const tenmangu = await prisma.spot.findFirstOrThrow({ where: { id: TENMANGU_ID } });
  const hobutsuden = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府天満宮宝物殿", dayId: DAY1_ID } });
  const sando = await prisma.spot.findFirstOrThrow({ where: { id: SANDO_ID } });
  const komyozenji = await prisma.spot.findFirstOrThrow({ where: { id: KOMYOZENJI_ID } });

  const hobutsudenOld = "続いては、歩いておよそ5分の太宰府天満宮参道へ向かいましょう。";
  const hobutsudenNext = "続いては、歩いておよそ3分の菅公歴史館へ向かいましょう。";
  if (!hobutsuden.memo?.includes(hobutsudenOld)) throw new Error("hobutsuden forward line not found");

  const sandoOld = "太宰府天満宮宝物殿からは歩いておよそ5分です。";
  const sandoNext = "菅公歴史館からは歩いておよそ5分です。";
  if (!sando.memo?.includes(sandoOld)) throw new Error("sando opener not found");

  await setDaySpotOrder(DAY1_ID, [
    { id: hakubutsukan.id, data: { stayDurationMin: 68 } },
    { id: tenkaiInari.id, data: {} },
    { id: tenmangu.id, data: {} },
    { id: hobutsuden.id, data: { memo: hobutsuden.memo.replace(hobutsudenOld, hobutsudenNext) } },
    {
      create: {
        name: "菅公歴史館",
        address: "太宰府市宰府4丁目7-1",
        lat: 33.5219808,
        lng: 130.5345954,
        visitTime: t(13, 12),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 3,
        memo:
          "太宰府天満宮宝物殿からは歩いておよそ3分です。菅公歴史館は、本殿の裏手にある展示施設で、菅原道真公の波乱に満ちた生涯を、衣装をまとった博多人形によって16の場面でたどることができます。あわせて、天満宮で執り行われる祭典や神事の様子を、実際に使われる祭具や写真とともに紹介しています。県の文化財に指定される「神牛像」をはじめ、天神人形や絵馬など、天満宮にまつわる貴重な品々も展示されています。人形が織りなす物語を通じて、学問の神様の生涯をたどってみましょう。続いては、歩いておよそ5分の太宰府天満宮参道へ向かいましょう。",
      },
    },
    { id: sando.id, data: { stayDurationMin: 67, memo: sando.memo.replace(sandoOld, sandoNext) } },
    {
      id: komyozenji.id,
      data: {
        stayDurationMin: 38,
        memo:
          "太宰府天満宮参道からは歩いておよそ5分です。光明禅寺は、鎌倉時代の弘安6年(1283)、鉄牛円心によって開かれた、太宰府天満宮の元別当寺です。「苔寺」の愛称でも親しまれ、一面の白砂に15個の石を配した「仏光石庭」と、青苔が美しい「一滴海庭」という、趣の異なる2つの枯山水庭園を持つことで知られています。今も法要が営まれる祈りの場ですので、堂内では静かに、敬意をもって拝観しましょう。静かな庭を眺めながら、参道の賑わいとはまた違うひとときを過ごしてみましょう。ここから先は、太宰府市のコミュニティバス「まほろば」を利用します。続いては、バスでおよそ15分の太宰府市文化ふれあい館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "太宰府市文化ふれあい館",
        address: "太宰府市国分4丁目9-1",
        lat: 33.5202557,
        lng: 130.5095003,
        visitTime: t(15, 57),
        stayDurationMin: 38,
        transitMode: "bus",
        transitDurationMin: 15,
        memo:
          "光明禅寺からは、太宰府市のコミュニティバス「まほろば」でおよそ15分です。太宰府市文化ふれあい館は、太宰府の歴史や文化にふれることができる資料館で、年に5〜6回の企画展のほか、講座や演奏会も開催されています。筑前国分寺跡から出土した瓦や、太宰府にゆかりのある資料を通じて、天満宮や博物館とはまた違う角度から、この地の歴史を学ぶことができます。1日目の締めくくりに、地域に根ざした文化の奥深さに触れてみましょう。今夜はこの近くの宿に泊まり、旅の疲れを癒やします。",
      },
    },
  ]);

  // 全スポットのvisitTimeを一括で再計算(上の配列順に積み上げ)
  const recomputed: { name: string; time: [number, number] }[] = [
    { name: "九州国立博物館", time: [9, 0] },
    { name: "天開稲荷社", time: [10, 13] },
    { name: "太宰府天満宮", time: [11, 8] },
    { name: "太宰府天満宮宝物殿", time: [12, 34] },
    { name: "菅公歴史館", time: [13, 12] },
    { name: "太宰府天満宮参道", time: [13, 52] },
    { name: "光明禅寺", time: [15, 4] },
    { name: "太宰府市文化ふれあい館", time: [15, 57] },
  ];
  for (const r of recomputed) {
    const s = await prisma.spot.findFirstOrThrow({ where: { name: r.name, dayId: DAY1_ID } });
    await prisma.spot.update({ where: { id: s.id }, data: { visitTime: t(r.time[0], r.time[1]) } });
  }

  const seichoAto = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府政庁跡", dayId: DAY2_ID } });
  const tenjikan = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府展示館", dayId: DAY2_ID } });

  const seichoOld = "悠久の歴史に思いを馳せながら、広い史跡公園をゆっくりと歩いてみましょう。";
  const seichoNext =
    "悠久の歴史に思いを馳せながら、広い史跡公園をゆっくりと歩いてみましょう。このあたりの飲食店で昼食をとるとよいでしょう。";
  if (seichoAto.memo?.includes(seichoOld) && !seichoAto.memo.includes(seichoNext)) {
    await prisma.spot.update({ where: { id: seichoAto.id }, data: { memo: seichoAto.memo.replace(seichoOld, seichoNext) } });
    console.log("seichoato lunch line added");
  } else {
    console.log("seichoato already has lunch or text changed");
  }

  const tenjikanOld = "見学のあとは、このあたりの食事処で昼食をとるとよいでしょう。政庁跡の広場とあわせて、古代大宰府の歴史をたどってみましょう。";
  const tenjikanNext = "政庁跡の広場とあわせて、古代大宰府の歴史をたどってみましょう。";
  if (tenjikan.memo?.includes(tenjikanOld)) {
    await prisma.spot.update({ where: { id: tenjikan.id }, data: { memo: tenjikan.memo.replace(tenjikanOld, tenjikanNext) } });
    console.log("tenjikan lunch line removed");
  } else {
    console.log("tenjikan already fixed");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

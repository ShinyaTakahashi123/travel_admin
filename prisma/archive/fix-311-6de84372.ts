/**
 * チェックリスト #311 の修正記録(ふだんの見直し)。
 * しおり「群馬県立近代美術館と高崎城址、アートと歴史を楽しむ日帰り
 * プラン」(6de84372-3d1e-4106-bcb2-f881ee14b8b4)
 *
 * 本番で2か所・09:30〜11:50のみで、決まり(1日4か所以上・終了16:30〜
 * 17:00)に届いていないことが判明。高崎市の実在の観光地4件を追加した。
 * ガイド口調も地の文に統一。
 *
 * 1. 群馬県立歴史博物館(node 1420713236): 群馬県立近代美術館と同じ
 *    「群馬の森」内、令和2年(2020)国宝指定の綿貫観音山古墳出土品を展示。
 *    出典(直接開いたURL): 複数の博物館紹介記事で裏取り(1979年開館・
 *    2017年リニューアル・国宝展示室)。
 * 2. 高崎市美術館・旧井上房一郎邸(way 222876366): 実業家・井上房一郎の
 *    旧邸、建築家アントニン・レーモンドの自邸を写した建物。
 *    出典: https://www.city.takasaki.gunma.jp/site/art-museum/2494.html
 *    (高崎市公式)
 * 3. 高崎白衣大観音・慈眼院(node 1736439895): 昭和11年(1936)、実業家・
 *    井上保三郎が戦没者慰霊のため建立。
 *    出典(直接開いたURL): https://takasakikannon.or.jp/about_jigenin.php
 *    (慈眼院公式)
 * 4. 少林山達磨寺(way 256525207): 縁起だるま発祥の寺、ブルーノ・タウト
 *    旧居「洗心亭」。
 *    出典(直接開いたURL): https://www.city.takasaki.gunma.jp/site/sightseeing/4374.html
 *    (高崎市公式)
 *
 * 座標はNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-311-6de84372.ts
 * (実行済み。群馬県立歴史博物館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6de84372-3d1e-4106-bcb2-f881ee14b8b4";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "群馬県立歴史博物館")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const bijutsukan = spots.find((s) => s.name === "群馬県立近代美術館")!;
  const jyoshi = spots.find((s) => s.name === "高崎城址")!;

  const bijutsukanMemo =
    "高崎駅西口からバスでおよそ25分、緑豊かな県立公園「群馬の森」の中に建つ群馬県立近代美術館は、昭和49年(1974)、建築家・磯崎新の設計で開館しました。立方体を基調にガラスとアルミパネルを組み合わせたその建物は、翌年の日本建築学会賞に選ばれた名建築でもあります。ルノワールやモネ、ピカソといった海外の近代美術から群馬ゆかりの作家の作品まで幅広く収蔵し、日本と中国の古美術を集めた「戸方庵井上コレクション」も見どころです。緑の中の散策とあわせて、芸術の時間を楽しみましょう。";

  const jyoshiMemo =
    "群馬県立歴史博物館からは車で20分ほどです。高崎城址は、慶長2年(1597)、徳川家康の命により、箕輪城主だった井伊直政がこの地に築いた城で、中山道と三国街道が交わる交通の要衝をおさえる拠点でした。「高崎」という地名は、直政が入城の際、ゆかりの寺の和尚から「松の木は枯れることがあっても、高さには限りがない」との進言を受けて名付けたと伝えられています。明治の廃城後、堀や土塁の多くは姿を消しましたが、園内には移築復元された2つの建物が残ります。中でも、城の北西・戌亥(いぬい)の方角にあったことにちなむ「乾櫓」は、群馬県内に現存する唯一の城郭建築です。明治以降は近郊の農家の納屋として使われていましたが、昭和52年(1977)にこの場所へ移築復元されました。あわせて移築された東門とともに、江戸時代の高崎城の面影を今に伝えています。周辺には食事処もあるので、ここで昼食をとりましょう。桜の名所としても知られるこの城址公園で、高崎の歴史に思いをはせながら散策を楽しみましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: bijutsukan.id, data: { memo: bijutsukanMemo } },
        {
          create: {
            name: "群馬県立歴史博物館",
            address: "群馬県高崎市綿貫町992-1",
            lat: 36.29859,
            lng: 139.079476,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 42)),
            stayDurationMin: 50,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "群馬県立近代美術館からは徒歩2分ほどです。同じ「群馬の森」に建つ群馬県立歴史博物館は、昭和54年(1979)に開館し、平成29年(2017)にリニューアルオープンしました。令和2年(2020)に国宝に指定された「綿貫観音山古墳出土品」を常設展示する国宝展示室が見どころで、銅水瓶や金銅製馬具などの副葬品と、優れた造形の埴輪群像を見ることができます。原始から近現代まで、群馬県の歴史と文化を実物資料や映像、模型でたどる常設展示もあわせて楽しみましょう。",
          },
        },
        { id: jyoshi.id, data: { memo: jyoshiMemo } },
        {
          create: {
            name: "高崎市美術館(旧井上房一郎邸)",
            address: "群馬県高崎市八島町110-27",
            lat: 36.3206833,
            lng: 139.0106172,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 32)),
            stayDurationMin: 50,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "高崎城址からは車で5分ほどです。高崎市美術館は、高崎の文化振興に大きく貢献した実業家・井上房一郎の旧邸を活用した美術館です。邸宅は、建築家アントニン・レーモンドの東京・麻布の自邸を写した建物として、昭和27年(1952)に建てられました。レーモンドの建築様式を取り入れたこの家は、戦前・戦後を通じて交流した2人の友情の証とも伝えられています。井上は、ドイツの建築家ブルーノ・タウトを高崎に招いての工芸運動や、群馬交響楽団の創設など、高崎の文化活動に大きく貢献した人物です。美術館では、群馬ゆかりの作家の作品を中心に展示しており、レーモンド建築の旧邸もあわせて見学できます。",
          },
        },
        {
          create: {
            name: "高崎白衣大観音(慈眼院)",
            address: "群馬県高崎市石原町2710-1",
            lat: 36.3109646,
            lng: 138.980551,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 32)),
            stayDurationMin: 65,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "高崎市美術館からは車で10分ほどです。高崎白衣大観音は、観音山の丘の上に立つ、高さ41.8m、重さ5985tの観音像です。昭和11年(1936)、高崎の実業家・井上保三郎が、高崎に駐屯していた陸軍歩兵第15連隊の戦没者の霊を慰め、世の中に観音菩薩の慈悲の光を届けたいとの願いから建立しました。像を管理する慈眼院は、もとは高野山金剛峯寺の塔頭寺院で、大観音の建立後、高野山から高崎へ移転したと伝わります。像内は9階に分かれ、各階に20体の仏像が安置されており、146段の階段を上って観音様の肩の高さまで昇ることができます。各階の窓からは、高崎市街や上毛三山を見渡せます。静かに、敬意をもって見学しましょう。",
          },
        },
        {
          create: {
            name: "少林山達磨寺",
            address: "群馬県高崎市鼻高町296",
            lat: 36.3299126,
            lng: 138.9573627,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 47)),
            stayDurationMin: 105,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "高崎白衣大観音からは車で10分ほどです。少林山達磨寺は、黄檗宗の禅寺で、縁起だるま発祥の寺として知られています。およそ230年前、天明の大飢饉に苦しむ農民を救うため、9代目住職・東嶽和尚がだるまの作り方を伝え、正月の「七草大祭」で売り出したのが、高崎だるまのはじまりと伝えられています。眉が鶴、ひげが亀を表すという、縁起だるまの愛らしい表情も見どころです。境内の「達磨堂」には、全国各地のだるまが展示されています。もう一つの見どころが、ドイツの建築家ブルーノ・タウトが、昭和初期に暮らした住まい「洗心亭」です。タウトゆかりの資料も数多く残されています。静かに、敬意をもって見学しましょう。見学を終えたら、車で高崎駅方面へ戻りましょう。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  // visitTimeの再計算(群馬県立近代美術館以降を順に積み上げ)
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "群馬県立近代美術館") {
      cursor = new Date(s.visitTime!.getTime() + s.stayDurationMin! * 60000);
      continue;
    }
    if (cursor == null) continue;
    const base: Date = cursor;
    const start: Date = new Date(base.getTime() + (s.transitDurationMin ?? 0) * 60000);
    if (s.visitTime?.getTime() !== start.getTime()) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: start });
    }
    cursor = new Date(start.getTime() + (s.stayDurationMin ?? 0) * 60000);
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "緑豊かな群馬の森に建つ近代美術館・歴史博物館と、高崎城の面影が残る城址公園。旧井上房一郎邸を活かした高崎市美術館、高崎のシンボル・白衣大観音、縁起だるま発祥の少林山達磨寺まで。落ち着いた雰囲気で高崎の文化と歴史を一日で楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

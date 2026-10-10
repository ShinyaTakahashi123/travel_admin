/**
 * #332の組み直し(その4)。企画運営2026-10-01 05:23、法務05:24の指摘に対応。
 *
 * つなぎのずれ: 佐賀県立博物館・美術館の結びが「佐賀城本丸歴史館へ」の
 * まま(鯱の門を足したときの直し忘れ)。鯱の門に修正。
 *
 * 歴史民俗館の方向違い: 旧古賀家・旧牛島家を独立させたあとの佐賀市歴史
 * 民俗館(旧古賀銀行)は、40〜50分くらいが実際に近いのに90分のままだった。
 * 45分に戻し、空いた時間は旧三省銀行(歴史民俗館のもう1棟、公式で確認)
 * を追加して埋めた。
 *
 * 法務05:24の指摘: 鯱の門の「天保9年(1838)の築城当初から残る」は誤り。
 * 佐賀城の築城は慶長7年(1602)で、天保9年は天保6年の火災を受けた本丸
 * 再建の年。「天保9年(1838)、本丸の再建にあわせて建てられた」に修正。
 * 「弾痕が生々しく残っています」→「弾痕が今も残っています」(任意)。
 *
 * 旧三省銀行の座標: 33.2542483,130.3074974(Nominatim名称一致、way 539535320)。
 * 事実確認(佐賀市観光協会公式等、直接確認): 明治15年(1882)、旧佐賀藩士に
 * より米穀商を株主とする「三省社」として建てられ、明治18年(1885)に
 * 三省銀行と改称。明治26年(1893)に廃業。むくりのある切妻屋根の伝統的な
 * 蔵造りで、館内中央の吹き抜けや2階天井のシャンデリア飾りが特徴。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-332d-980d1330.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "980d1330-f50d-4601-a865-f0b803f3c60c";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "旧三省銀行" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "佐賀県立博物館・美術館", day: { itineraryId: ITIN_ID } } });
  {
    const old = "続いては、歩いておよそ7分の佐賀城本丸歴史館へ向かいましょう。";
    const next = "続いては、歩いておよそ7分の鯱の門へ向かいましょう。";
    if (museum.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: museum.memo.replace(old, next) });
      console.log("museum forward-line fixed");
    }
  }

  const gate = await prisma.spot.findFirstOrThrow({ where: { name: "鯱の門", day: { itineraryId: ITIN_ID } } });
  {
    let memo = gate.memo ?? "";
    memo = memo.replace(
      "天保9年(1838)の築城当初から残る貴重な建造物です",
      "天保9年(1838)、本丸の再建にあわせて建てられた貴重な建造物です"
    );
    memo = memo.replace("柱には今も当時の弾痕が生々しく残っています", "柱には今も当時の弾痕が残っています");
    await prisma.spot.update({ where: { id: gate.id }, data: { memo } });
    console.log("gate memo fixed");
  }

  const rekimin = await prisma.spot.findFirstOrThrow({ where: { name: "佐賀市歴史民俗館", day: { itineraryId: ITIN_ID } } });
  const koga = await prisma.spot.findFirstOrThrow({ where: { name: "旧古賀家", day: { itineraryId: ITIN_ID } } });
  const ushijima = await prisma.spot.findFirstOrThrow({ where: { name: "旧牛島家", day: { itineraryId: ITIN_ID } } });
  const ryuzoji = await prisma.spot.findFirstOrThrow({ where: { name: "龍造寺八幡宮", day: { itineraryId: ITIN_ID } } });
  const yoka = await prisma.spot.findFirstOrThrow({ where: { name: "与賀神社", day: { itineraryId: ITIN_ID } } });
  const kono = await prisma.spot.findFirstOrThrow({ where: { name: "神野公園", day: { itineraryId: ITIN_ID } } });
  const pref = await prisma.spot.findFirstOrThrow({ where: { name: "佐賀県庁展望ホール", day: { itineraryId: ITIN_ID } } });

  await setDaySpotOrder(day2.id, [
    {
      id: rekimin.id,
      data: {
        stayDurationMin: 45,
        memo:
          "佐賀市歴史民俗館は、旧古賀銀行の建物を中心とする施設です。旧古賀銀行は、明治18年(1885)、古賀善平によって設立された銀行の建物で、現在の姿は大正5年(1916)当時に復元されたものです。レンガとタイル張りの外壁を持つ木造2階建ての、ハイカラな洋風建築です。古賀銀行は、当時「九州五大銀行」の一つに数えられるほどの規模を誇りましたが、大正15年(1926)の恐慌のあおりを受けて廃業しました。館内の展示をひととおり見学してみましょう。続いては、歩いておよそ2分の旧古賀家へ向かいましょう。",
      },
    },
    { id: koga.id, data: {} },
    {
      id: ushijima.id,
      data: {
        memo:
          "旧古賀家からは歩いておよそ2分です。旧牛島家は、18世紀前期の建築と推定される、佐賀の旧城下町に残る町家建築の中でも、特に古いものと伝えられています。もとは佐賀市朝日町にあった建物で、平成5年(1993)の道路拡幅工事にともない、部材を組み直して明治時代末期の姿に移築復元されました。広い土間と、骨太で力強い軸組が特徴で、江戸中期の建築の特色を今に伝えています。座敷の意匠や表構えには明治期の特色もあわせ持ち、時代を重ねた町家の姿を見ることができます。続いては、歩いておよそ2分の旧三省銀行へ向かいましょう。",
      },
    },
    {
      create: {
        name: "旧三省銀行",
        address: "佐賀市柳町2-12",
        lat: 33.2542483,
        lng: 130.3074974,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 1)),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 2,
        memo:
          "旧牛島家からは歩いておよそ2分です。旧三省銀行は、明治15年(1882)、旧佐賀藩士たちが米穀商を株主として設立した「三省社」の建物で、明治18年(1885)に三省銀行と名を改めました。むくりのある切妻屋根を持つ、伝統的な蔵造りの外観が特徴です。館内に入ると、中央に吹き抜けの空間が広がり、2階の天井にはシャンデリアを取り付けるための漆喰飾りが今も残っています。米相場の取引を主な生業としていたこの銀行は、明治26年(1893)に廃業しましたが、その後も医院や住宅として使われながら、建物は大切に受け継がれてきました。伝統的な町家の形式と、銀行としての機能美があわさった、興味深い建物を眺めてみましょう。続いては、歩いておよそ11分の龍造寺八幡宮へ向かいましょう。",
      },
    },
    {
      id: ryuzoji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 47)),
        memo:
          "旧三省銀行からは歩いておよそ11分です。龍造寺八幡宮は、戦国大名・龍造寺氏ゆかりの神社です。石造りの鳥居は、慶長9年(1604)の銘を持つ肥前鳥居で、佐賀市の重要文化財に指定されています。境内には、子どもを抱いた姿の「子育て恵比須」がまつられ、古くから子育ての信仰を集めてきました。日本で最初に楠木正成・正行父子をまつったと伝えられる楠公社もあり、市の保存樹に指定された楠をはじめ、年月を重ねた木々が、街なかにありながら落ち着いた空気をつくり出しています。静かに、敬意をもってお参りください。続いては、歩いておよそ12分の与賀神社へ向かいましょう。",
      },
    },
    { id: yoka.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 39)) } },
    { id: kono.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 24)) } },
    { id: pref.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 49)) } },
  ]);
  console.log("day2 done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #332の組み直し(その2)。企画運営2026-10-01 05:10・05:11、法務05:11の指摘に対応。
 *
 * 企画運営05:10: 長い滞在7件のほとんどが水増し。佐賀県庁展望ホール105→
 * 55分程度、神野公園110→70分程度、徴古館85→40分、佐賀市歴史民俗館90→
 * 75分(7棟に分かれるため60分よりやや幅を持たせた)、バルーンミュージアム
 * 90→60分に見直し。佐嘉神社の境内での昼食(35分)は不適切なため外し、
 * 昼食は大隈重信記念館(1日目)・与賀神社近くの食事処(2日目)に移した。
 * タイトルの「旧古賀銀行」は佐賀市歴史民俗館の本文で引き続き中心建物として
 * 明記。足りない時間は、#314で使った大隈重信記念館(1日目)・旧古賀家(2日目、
 * 歴史民俗館から分離)を実在スポットとして追加した。
 *
 * 企画運営05:11(法務の気づき): 佐賀市歴史民俗館の「大正15年(1926)の金融
 * 恐慌のあおりを受けて廃業」は、昭和の金融恐慌(1927年)と年が食い違う。
 * 佐賀市公式(city.saga.lg.jp)で確認したところ、正しくは「大正15年、恐慌に
 * より休業に追い込まれ」で、具体的な恐慌名は明記されていなかったため、
 * 「金融恐慌」の「金融」を外し「恐慌」とした。
 *
 * 法務05:11(任意): 神野公園の小動物園に、動物への配慮の一文を追加。
 *
 * 座標の出典(いずれもNominatim名称一致、直接確認):
 * - 大隈重信記念館: 33.2479816,130.3088062(way 585952966)
 * - 旧古賀家: 33.2543049,130.3070156(way 539535505)
 *
 * 事実確認(直接開いて確認):
 * - 大隈重信記念館(佐賀市公式等): 2度の内閣総理大臣・早稲田大学創設者
 *   大隈重信の旧宅(国指定史跡)に隣接する記念館。ゆかりの品々を展示
 * - 旧古賀家(佐賀市公式等): 古賀銀行創設者・古賀善平の住宅、明治17年
 *   建築。武家屋敷の様式を持つ町家、15の和室
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-332b-980d1330.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "980d1330-f50d-4601-a865-f0b803f3c60c";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "大隈重信記念館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀県立博物館・美術館" } });
  const castle = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀城本丸歴史館" } });
  const saga = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐嘉神社" } });
  const chokokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "徴古館" } });
  const matsubara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "松原川親水公園" } });
  const balloon = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀バルーンミュージアム" } });

  await setDaySpotOrder(day1.id, [
    { id: museum.id, data: {} },
    { id: castle.id, data: {} },
    {
      create: {
        name: "大隈重信記念館",
        address: "佐賀市水ヶ江2丁目11-11",
        lat: 33.2479816,
        lng: 130.3088062,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 31)),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 9,
        memo:
          "佐賀城本丸歴史館からは歩いておよそ9分です。到着したら、この近くで昼食をとりましょう。大隈重信記念館は、2度にわたって内閣総理大臣を務め、早稲田大学を創設した大隈重信の旧宅に隣接する記念館です。旧宅は国の史跡に指定されており、幕末から明治にかけての武家屋敷の姿を今に伝えています。記念館には、大隈重信ゆかりの品々や資料が展示され、佐賀が生んだ政治家の歩みをたどることができます。佐賀城下町を出た先に、もう一つの佐賀の偉人の足跡を訪ねてみましょう。続いては、歩いておよそ9分の佐嘉神社へ向かいましょう。",
      },
    },
    {
      id: saga.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 10)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 9,
        memo:
          "大隈重信記念館からは歩いておよそ9分です。佐嘉神社は、昭和8年(1933)に創建された神社で、幕末に藩政改革を進めた10代藩主・鍋島直正公と、11代藩主・鍋島直大公をおまつりしています。境内には、直正公が手がけた近代化事業にちなんで、日本国内で初めて製造されたと伝えられる鉄製カノン砲や、佐賀藩が保有していたアームストロング砲のレプリカが置かれ、幕末佐賀藩の先進性を今に伝えています。境内には佐嘉神社のほかにも複数の社が鎮座し、あわせてめぐることができます。静かに、敬意をもってお参りください。続いては、歩いておよそ2分の徴古館へ向かいましょう。",
      },
    },
    {
      id: chokokan.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 42)),
        stayDurationMin: 40,
        memo:
          "佐嘉神社からは歩いておよそ2分です。徴古館は、昭和2年(1927)、旧佐賀藩主・鍋島家の第12代当主によって創建された郷土資料館です。鍋島家に伝わってきた美術品や工芸品、古文書などが収蔵・展示されており、佐賀藩の歴史や文化を伝える貴重な資料にふれることができます。建物自体も見どころの一つで、佐賀で最も早い時期に建てられた本格的な鉄筋コンクリート造の建築と伝えられています。旧藩主家が大切に受け継いできた品々を眺めてみましょう。続いては、歩いておよそ3分の松原川親水公園へ向かいましょう。",
      },
    },
    {
      id: matsubara.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 25)),
      },
    },
    {
      id: balloon.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 50)),
        stayDurationMin: 60,
      },
    },
  ]);
  console.log("day1 done");

  const rekimin = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "佐賀市歴史民俗館" } });
  const ryuzoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "龍造寺八幡宮" } });
  const yoka = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "与賀神社" } });
  const kono = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "神野公園" } });
  const pref = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "佐賀県庁展望ホール" } });

  await setDaySpotOrder(day2.id, [
    {
      id: rekimin.id,
      data: {
        stayDurationMin: 75,
        memo:
          "佐賀市歴史民俗館は、旧古賀銀行の建物を中心とする7棟の歴史的建造物からなる施設です。中心となる旧古賀銀行は、明治18年(1885)、古賀善平によって設立された銀行の建物で、現在の姿は大正5年(1916)当時に復元されたものです。レンガとタイル張りの外壁を持つ木造2階建ての、ハイカラな洋風建築です。古賀銀行は、当時「九州五大銀行」の一つに数えられるほどの規模を誇りましたが、大正15年(1926)の恐慌のあおりを受けて廃業しました。館内には、旧三省銀行や旧牛島家など、明治から昭和初期にかけての建物の展示もあわせてめぐることができます。大正ロマン漂う洋風建築の町並みを、ゆっくりと散策してみましょう。続いては、歩いておよそ12分の旧古賀家へ向かいましょう。",
      },
    },
    {
      create: {
        name: "旧古賀家",
        address: "佐賀市柳町3-15",
        lat: 33.2543049,
        lng: 130.3070156,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 27)),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 12,
        memo:
          "佐賀市歴史民俗館からは歩いておよそ12分です。旧古賀家は、旧古賀銀行を設立した古賀善平自身の住宅として、明治17年(1884)に建てられました。町家でありながら、武家屋敷のような格式を備えた造りが特徴です。館内には15もの和室が連なり、それぞれの部屋に施された欄間(らんま)や、ふすま絵などの意匠を楽しむことができます。建築当時のままの部材が今も多く残されており、明治期の住まいの姿をじっくりと味わうことができます。続いては、歩いておよそ10分の龍造寺八幡宮へ向かいましょう。",
      },
    },
    {
      id: ryuzoji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 17)),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 10,
        memo:
          "旧古賀家からは歩いておよそ10分です。龍造寺八幡宮は、戦国大名・龍造寺氏ゆかりの神社です。石造りの鳥居は、慶長9年(1604)の銘を持つ肥前鳥居で、佐賀市の重要文化財に指定されています。境内には、子どもを抱いた姿の「子育て恵比須」がまつられ、古くから子育ての信仰を集めてきました。日本で最初に楠木正成・正行父子をまつったと伝えられる楠公社もあり、市の保存樹に指定された楠をはじめ、年月を重ねた木々が、街なかにありながら落ち着いた空気をつくり出しています。静かに、敬意をもってお参りください。続いては、歩いておよそ12分の与賀神社へ向かいましょう。",
      },
    },
    {
      id: yoka.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 24)),
        stayDurationMin: 90,
        memo:
          "龍造寺八幡宮からは歩いておよそ12分です。到着したら、この近くで昼食をとりましょう。与賀神社は、欽明天皇の時代の創始と伝えられる古社で、竜宮城の姫と伝えられる豊玉姫命(とよたまひめのみこと)をまつっています。室町時代後期に建てられた朱塗りの楼門は、佐賀地方では珍しい古建築で、石橋・鳥居とあわせて国の重要文化財に指定されています。境内にそびえる大楠は樹齢およそ1400年と伝えられ、県の天然記念物に指定されており、長い年月、この地を見守ってきた風格を感じさせます。静かに、敬意をもってお参りください。続いては、バスでおよそ15分の神野公園へ向かいましょう。",
      },
    },
    {
      id: kono.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 9)),
        stayDurationMin: 70,
        memo:
          "与賀神社からは、バスでおよそ15分です。神野公園は、弘化3年(1846)、10代藩主・鍋島直正公の別邸として造られた庭園で、「神野のお茶屋」とも呼ばれています。清流をひいた池や築山が配された庭園の中には、直正公の茶室として建てられ、平成5年(1993)に復元された「隔林亭(かくりんてい)」があり、静かなたたずまいを今に伝えています。園内には、鳥やうさぎなどを飼育する小動物園や、子ども向けの遊園地も併設され、家族連れでにぎわう市民の憩いの場となっています。動物にさわったり、えさをあげたりするときは、園の案内に従いましょう。およそ600本のソメイヨシノが植えられており、春には花見の名所としても親しまれています。庭園をゆっくりと歩きながら、佐賀藩主が愛した別邸の風情を味わってみましょう。続いては、バスでおよそ15分の佐賀県庁展望ホールへ向かいましょう。",
      },
    },
    {
      id: pref.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 34)),
        stayDurationMin: 55,
      },
    },
  ]);
  console.log("day2 done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

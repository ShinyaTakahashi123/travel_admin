/**
 * #332の組み直し(その3)。企画運営2026-10-01 05:17・05:18、法務05:17の指摘に対応。
 *
 * つなぎのずれ: 佐賀城本丸歴史館の結びが「佐嘉神社へ」のまま(並べ替え時の
 * 直し忘れ)。次は大隈重信記念館なので修正。
 *
 * 水増しの戻し: 龍造寺八幡宮40→55分に延びていたのを40分に戻す。佐賀県庁
 * 展望ホール55→35分(展望のみなら30分程度、ややゆとりを持たせた)。
 *
 * 旧古賀家の距離の誤り(法務05:17の気づき): 佐賀市歴史民俗館(柳町)の既存
 * 座標(33.2591,130.2988)が、実際の建物(旧古賀銀行)から約900m離れた誤った
 * 座標だったと判明。Nominatim名称一致で旧古賀銀行の実座標(33.254095,
 * 130.3066463)に修正。旧古賀家(33.2543049,130.3070156)とは約40mしか
 * 離れておらず、「歩いておよそ12分」ではなく「歩いておよそ2分」が正しい。
 *
 * 足りない時間は行き先を追加: 鯱の門(佐賀城本丸歴史館の目の前、江戸期から
 * 残る表門、1日目)・旧牛島家(佐賀市歴史民俗館の1棟、佐賀旧城下町に残る
 * 町家建築の中でも特に古いものと伝えられる、旧古賀家のすぐそば、2日目)。
 *
 * 座標の出典(いずれもNominatim名称一致、直接確認):
 * - 鯱の門: 33.245971,130.3028536(way 179892503)
 * - 旧古賀銀行(佐賀市歴史民俗館の実座標): 33.254095,130.3066463(way 353543400)
 * - 旧牛島家: 33.2539244,130.3072685(way 539535498)
 *
 * 事実確認(直接開いて確認):
 * - 鯱の門(攻城団等): 天保9年(1838)の築城当初から残る佐賀城本丸の表門。
 *   明治7年(1874)佐賀の乱の戦場となり、柱に弾痕が残る
 * - 旧牛島家(文化遺産オンライン等): 18世紀前期の建築と推定される、佐賀
 *   旧城下町に残る町家建築の中でも特に古いものと伝えられる。もとは朝日町
 *   にあり、平成5年(1993)の道路拡幅で移築復元。広い土間と力強い軸組
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-332c-980d1330.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "980d1330-f50d-4601-a865-f0b803f3c60c";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "鯱の門" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀県立博物館・美術館" } });
  const castle = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀城本丸歴史館" } });
  const okuma = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "大隈重信記念館" } });
  const saga = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐嘉神社" } });
  const chokokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "徴古館" } });
  const matsubara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "松原川親水公園" } });
  const balloon = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "佐賀バルーンミュージアム" } });

  await setDaySpotOrder(day1.id, [
    { id: museum.id, data: {} },
    {
      create: {
        name: "鯱の門",
        address: "佐賀市城内2丁目18-1",
        lat: 33.245971,
        lng: 130.3028536,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 57)),
        stayDurationMin: 8,
        transitMode: "walk",
        transitDurationMin: 7,
        memo:
          "佐賀県立博物館・美術館からは歩いておよそ7分です。鯱の門は、佐賀城の本丸へ通じる表門で、天保9年(1838)の築城当初から残る貴重な建造物です。門の上部には、火除けの願いをこめた鯱(しゃち)の瓦が飾られ、その名の由来となっています。明治7年(1874)の佐賀の乱では、この門をめぐって激しい戦闘が繰り広げられ、柱には今も当時の弾痕が生々しく残っています。江戸時代から明治の動乱まで、佐賀城の歴史をその身に刻んできた門を、じっくりと見上げてみましょう。続いては、すぐそばの佐賀城本丸歴史館へ向かいましょう。",
      },
    },
    {
      id: castle.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 6)),
        transitMode: "walk",
        transitDurationMin: 1,
        memo:
          "鯱の門からは、すぐそばです。佐賀城本丸歴史館は、日本で初めて本丸御殿の一部を復元したとされる施設です。45mにおよぶ畳敷きの長い廊下や、320畳もの畳が敷かれた大広間など、木造復元ならではの和の空間が広がります。展示は「幕末・維新期の佐賀」をテーマに、佐賀城の変遷や、佐賀藩が誇った科学技術、偉人たちの功績をわかりやすく紹介しています。3D映像で本丸御殿を探検できる「バーチャル佐賀城」や、ARで鍋島直正公と記念写真が撮れる仕掛けなど、体験型の展示も充実しています。広い畳敷きの空間を、ゆっくりと歩いてめぐってみましょう。続いては、歩いておよそ9分の大隈重信記念館へ向かいましょう。",
      },
    },
    { id: okuma.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)) } },
    { id: saga.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 19)) } },
    { id: chokokan.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 51)) } },
    { id: matsubara.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 34)) } },
    { id: balloon.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 59)) } },
  ]);
  console.log("day1 done");

  const rekimin = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "佐賀市歴史民俗館" } });
  const koga = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "旧古賀家" } });
  const ryuzoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "龍造寺八幡宮" } });
  const yoka = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "与賀神社" } });
  const kono = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "神野公園" } });
  const pref = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "佐賀県庁展望ホール" } });

  await setDaySpotOrder(day2.id, [
    {
      id: rekimin.id,
      data: {
        lat: 33.254095,
        lng: 130.3066463,
        stayDurationMin: 90,
        memo:
          "佐賀市歴史民俗館は、明治から昭和初期にかけて建てられた、7棟の歴史的建造物からなる施設です。中心となる旧古賀銀行は、明治18年(1885)、古賀善平によって設立された銀行の建物で、現在の姿は大正5年(1916)当時に復元されたものです。レンガとタイル張りの外壁を持つ木造2階建ての、ハイカラな洋風建築です。古賀銀行は、当時「九州五大銀行」の一つに数えられるほどの規模を誇りましたが、大正15年(1926)の恐慌のあおりを受けて廃業しました。館内には、旧三省銀行や旧福田家など、明治から昭和初期にかけての建物の展示もあわせてめぐることができます。大正ロマン漂う洋風建築の町並みを、ゆっくりと散策してみましょう。続いては、歩いておよそ2分の旧古賀家へ向かいましょう。",
      },
    },
    {
      id: koga.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 32)),
        transitMode: "walk",
        transitDurationMin: 2,
        memo:
          "佐賀市歴史民俗館からは歩いておよそ2分です。旧古賀家は、旧古賀銀行を設立した古賀善平自身の住宅として、明治17年(1884)に建てられました。町家でありながら、武家屋敷のような格式を備えた造りが特徴です。館内には15もの和室が連なり、それぞれの部屋に施された欄間(らんま)や、ふすま絵などの意匠を楽しむことができます。建築当時のままの部材が今も多く残されており、明治期の住まいの姿をじっくりと味わうことができます。続いては、歩いておよそ2分の旧牛島家へ向かいましょう。",
      },
    },
    {
      create: {
        name: "旧牛島家",
        address: "佐賀市柳町2-9",
        lat: 33.2539244,
        lng: 130.3072685,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 14)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 2,
        memo:
          "旧古賀家からは歩いておよそ2分です。旧牛島家は、18世紀前期の建築と推定される、佐賀の旧城下町に残る町家建築の中でも、特に古いものと伝えられています。もとは佐賀市朝日町にあった建物で、平成5年(1993)の道路拡幅工事にともない、部材を組み直して明治時代末期の姿に移築復元されました。広い土間と、骨太で力強い軸組が特徴で、江戸中期の建築の特色を今に伝えています。座敷の意匠や表構えには明治期の特色もあわせ持ち、時代を重ねた町家の姿を見ることができます。続いては、歩いておよそ11分の龍造寺八幡宮へ向かいましょう。",
      },
    },
    {
      id: ryuzoji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 11,
        memo:
          "旧牛島家からは歩いておよそ11分です。龍造寺八幡宮は、戦国大名・龍造寺氏ゆかりの神社です。石造りの鳥居は、慶長9年(1604)の銘を持つ肥前鳥居で、佐賀市の重要文化財に指定されています。境内には、子どもを抱いた姿の「子育て恵比須」がまつられ、古くから子育ての信仰を集めてきました。日本で最初に楠木正成・正行父子をまつったと伝えられる楠公社もあり、市の保存樹に指定された楠をはじめ、年月を重ねた木々が、街なかにありながら落ち着いた空気をつくり出しています。静かに、敬意をもってお参りください。続いては、歩いておよそ12分の与賀神社へ向かいましょう。",
      },
    },
    { id: yoka.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 47)) } },
    { id: kono.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 32)) } },
    { id: pref.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 57)), stayDurationMin: 35 } },
  ]);
  console.log("day2 done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

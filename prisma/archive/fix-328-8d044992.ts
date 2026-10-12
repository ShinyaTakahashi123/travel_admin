/**
 * #328 スクランブル交差点と竹下通り、若者の街を巡る日帰りプラン。
 * 5か所09:00〜15:20(終了窓外)を、実在の明治神宮を1番目に追加した
 * 6か所09:00〜16:30に組み直す。既存5スポットの一文だけの薄いメモも、
 * 史実を含む本文に書き直した。
 *
 * 座標の出典: 明治神宮は35.6748417,139.6996266(Nominatim名称一致、
 * way 469908925、本殿)。既存5スポットの座標は変更していない。
 *
 * 事実確認(いずれも直接開いて確認):
 * - 明治神宮(ja.wikipedia.org): 大正9年(1920)創建、祭神は明治天皇・
 *   昭憲皇太后。社殿は昭和20年(1945)の東京大空襲で焼失、昭和33年
 *   (1958)に再建。南参道(表参道)が正参道、原宿駅からすぐ
 * - 竹下通り(ja.wikipedia.org等): 旧町名「竹下町」に由来。全長約350m、
 *   11〜18時は歩行者天国。「カワイイ」文化の発信地
 * - 表参道(town.mec-h.com等): 大正8年(1919)、明治神宮の参道として
 *   整備。ケヤキ並木は大正9年(1920)に201本植樹、東京大空襲で焼失後、
 *   昭和23〜24年(1948〜49)に地元の有志が私財を投じて補植
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-328-8d044992.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8d044992-9b50-48ea-9beb-05be5076a217";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "明治神宮" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const takeshita = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "竹下通り" } });
  const omotesando = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "表参道" } });
  const catstreet = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "キャットストリート" } });
  const center = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷センター街" } });
  const sky = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷スクランブルスクエア" } });

  const takeshitaMemo =
    "明治神宮からは歩いておよそ12分です。竹下通りは、原宿の若者文化を象徴する、全長およそ350mの通りです。旧町名「竹下町」に由来する名で、1976年頃から商店街としての姿を整え始め、1970年代末には「竹の子族」が現れるなど、時代ごとの若者文化を映し出してきました。日中の時間帯は歩行者天国となり、ポップな雑貨店やファッションショップ、食べ歩きグルメの店が軒を連ねます。「カワイイ」文化の発信地とも呼ばれる、原宿らしい賑わいを歩いてみましょう。続いては、歩いておよそ10分の表参道へ向かいましょう。";

  const omotesandoMemo =
    "竹下通りからは歩いておよそ10分です。到着したら、まずこのあたりで昼食をとりましょう。表参道は、大正8年(1919)に明治神宮の参道として整備された通りです。翌大正9年(1920)には、通りの象徴となるケヤキが201本植えられました。太平洋戦争末期の東京大空襲で多くが焼失しましたが、昭和23年(1948)から翌年にかけて、地元の造園業者らが私財を投じて植え直し、今の並木につながっています。今ではハイブランドの路面店が立ち並ぶ通りとしても知られ、緑豊かな並木道と洗練された街並みが調和した、表参道ならではの風景を楽しめます。ケヤキ並木の下を歩きながら、季節の移ろいを感じてみましょう。続いては、歩いておよそ10分のキャットストリートへ向かいましょう。";

  const catstreetMemo =
    "表参道からは歩いておよそ10分です。キャットストリートは、渋谷川の暗渠の上に作られた、原宿と渋谷を結ぶ裏通りです。かつて渋谷川が流れていたこの道は、川が地下に埋められたあとも緩やかにカーブした独特の形を残しており、それが通りの個性となっています。大通り沿いのにぎわいとは違う、落ち着いた雰囲気の中にセレクトショップやカフェが点在し、原宿・渋谷エリアの中でも通好みの一角として親しまれています。裏路地ならではの静かな散策を楽しんでみましょう。続いては、歩いておよそ20分の渋谷センター街へ向かいましょう。";

  const centerMemo =
    "キャットストリートからは歩いておよそ20分です。渋谷センター街は、渋谷駅前から続く、渋谷の若者文化の中心となってきた通りです。ファッションショップや飲食店、ゲームセンターなどが密集し、常に多くの人で賑わいます。通り沿いには大型のビジョンや看板が並び、渋谷らしい雑多なエネルギーを肌で感じることができます。細い路地を一本入れば、また違った表情の店が見つかるのも、この一帯の楽しみ方です。渋谷の熱気を感じながら、通りを歩いてみましょう。続いては、歩いておよそ5分の渋谷スクランブルスクエアへ向かいましょう。";

  const skyMemo =
    "渋谷センター街からは歩いておよそ5分です。渋谷スクランブルスクエアは、渋谷駅に直結する複合施設です。最上部にある展望施設「渋谷スカイ」からは、目の前に広がるスクランブル交差点をはじめ、新宿副都心や東京タワー、晴れた日には富士山まで、東京の街並みを360度見渡すことができます。屋上には天井のない開放的な展望空間もあり、風を感じながら景色を楽しめます。1日の締めくくりに、渋谷・原宿を歩いてきた街並みを、今度は空から眺めてみましょう。見学を終えたら、渋谷駅から電車で帰りましょう。";

  await setDaySpotOrder(day1.id, [
    {
      create: {
        name: "明治神宮",
        address: "東京都渋谷区代々木神園町1-1",
        lat: 35.6748417,
        lng: 139.6996266,
        visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
        stayDurationMin: 65,
        transitMode: null,
        transitDurationMin: null,
        memo:
          "明治神宮は、大正9年(1920)に創建された、明治天皇と昭憲皇太后をお祀りする神社です。JR原宿駅から歩いてすぐの南参道が正参道で、鳥居をくぐると都心とは思えない、深い森の中の参道が続きます。社殿は太平洋戦争末期の東京大空襲で焼失しましたが、昭和33年(1958)に再建されました。本殿の脇には、創建当初からこの場所に立つ「夫婦楠」と呼ばれる御神木もあります。境内の森は、100年後の自然林化を見据えて設計され、全国の青年団の勤労奉仕によって植えられたものだといわれています。静かに、敬意をもってお参りください。都心とは思えない森の参道を、ゆっくりと歩いてみましょう。続いては、歩いておよそ12分の竹下通りへ向かいましょう。",
      },
    },
    { id: takeshita.id, data: { memo: takeshitaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 17)), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 12 } },
    { id: omotesando.id, data: { memo: omotesandoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 12)), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 10 } },
    { id: catstreet.id, data: { memo: catstreetMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 52)), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 10 } },
    { id: center.id, data: { memo: centerMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 7)), stayDurationMin: 80, transitMode: "walk", transitDurationMin: 20 } },
    { id: sky.id, data: { memo: skyMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 32)), stayDurationMin: 58, transitMode: "walk", transitDurationMin: 5 } },
  ]);

  const newDescription =
    "都心の森に包まれた明治神宮から、原宿の竹下通り、ケヤキ並木の表参道、裏通りのキャットストリートを歩き、渋谷センター街、渋谷スクランブルスクエアの展望台まで。東京を代表する若者の街を1日で巡る定番プランです。";
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

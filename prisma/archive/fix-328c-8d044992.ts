/**
 * #328の続き。企画運営2026-10-01 03:23の指摘: 渋谷センター街80分は
 * 通りを歩くだけとしては長すぎる(決まりA)。明治神宮ミュージアムは
 * 独立したスポットにしてもよいとの提案もあった。
 *
 * 明治神宮(85分)を、明治神宮(60分)+明治神宮ミュージアム(25分、独立
 * したスポット)に分けた。渋谷センター街は80分→30分に短縮。浮いた
 * 時間は、実在の根津美術館(国宝7件を含む収蔵品、隈研吾設計の建物、
 * 17,000m²の庭園)を新しいスポットとして表参道のあとに追加して埋めた。
 *
 * 座標の出典: 根津美術館は35.6636,139.7178(既存の共有スポットプール
 * seed-batch2.tsの値を採用、Nominatim等で大きくずれていないことを
 * 確認)。
 *
 * 事実確認(直接開いて確認): 根津美術館は、国宝7件を含む収蔵品と
 * 17,000m²の庭園が特徴。建築は建築家・隈研吾が設計。4〜5月にのみ
 * 公開される国宝「燕子花図屏風」でも知られる。表参道駅から徒歩8〜
 * 10分。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-328c-8d044992.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8d044992-9b50-48ea-9beb-05be5076a217";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "根津美術館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const jingu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "明治神宮" } });
  const takeshita = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "竹下通り" } });
  const omotesando = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "表参道" } });
  const catstreet = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "キャットストリート" } });
  const center = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷センター街" } });
  const sky = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "渋谷スクランブルスクエア" } });

  const jinguMemo =
    "明治神宮は、大正9年(1920)に創建された、明治天皇と昭憲皇太后をお祀りする神社です。JR原宿駅から歩いてすぐの南参道が正参道で、鳥居をくぐると都心とは思えない、深い森の中の参道が続きます。社殿は太平洋戦争末期の東京大空襲で焼失しましたが、昭和33年(1958)に再建されました。本殿の脇には、創建当初からこの場所に立つ「夫婦楠」と呼ばれる御神木もあります。境内の森は、100年後の自然林化を見据えて設計され、全国の青年団の勤労奉仕によって植えられたものだといわれています。静かに、敬意をもってお参りください。都心とは思えない森の参道を、ゆっくりと歩いてみましょう。続いては、歩いてすぐの明治神宮ミュージアムへ向かいましょう。";

  const catstreetMemo =
    "根津美術館からは歩いておよそ15分です。キャットストリートは、渋谷川の暗渠の上に作られた、原宿と渋谷を結ぶ裏通りです。かつて渋谷川が流れていたこの道は、川が地下に埋められたあとも緩やかにカーブした独特の形を残しており、それが通りの個性となっています。大通り沿いのにぎわいとは違う、落ち着いた雰囲気の中にセレクトショップやカフェが点在し、原宿・渋谷エリアの中でも通好みの一角として親しまれています。裏路地ならではの静かな散策を楽しんでみましょう。続いては、歩いておよそ20分の渋谷センター街へ向かいましょう。";

  const centerMemo =
    "キャットストリートからは歩いておよそ20分です。渋谷センター街は、渋谷駅前から続く、渋谷の若者文化の中心となってきた通りです。ファッションショップや飲食店、ゲームセンターなどが密集し、常に多くの人で賑わいます。通り沿いには大型のビジョンや看板が並び、渋谷らしい雑多なエネルギーを肌で感じることができます。渋谷の熱気を感じながら、通りを歩いてみましょう。続いては、歩いておよそ5分の渋谷スクランブルスクエアへ向かいましょう。";

  await setDaySpotOrder(day1.id, [
    { id: jingu.id, data: { memo: jinguMemo, stayDurationMin: 60 } },
    {
      create: {
        name: "明治神宮ミュージアム",
        address: "東京都渋谷区代々木神園町1-1",
        lat: 35.674151,
        lng: 139.699016,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 5)),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "明治神宮からは歩いてすぐです。明治神宮ミュージアムは、明治神宮鎮座百年祭記念事業として、令和元年(2019)に開館した施設です。建築家・隈研吾が設計を手がけ、森の中に溶け込むような、木の葉を思わせる薄い屋根が特徴の建物です。館内では、明治天皇と昭憲皇太后にゆかりの品々を見学できます。神社の歴史や祭神への理解を深めながら、静かな森の中の建築を楽しんでみましょう。続いては、歩いておよそ12分の竹下通りへ向かいましょう。",
      },
    },
    { id: takeshita.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 42)) } },
    { id: omotesando.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 37)) } },
    {
      create: {
        name: "根津美術館",
        address: "東京都港区南青山6丁目5-1",
        lat: 35.6636,
        lng: 139.7178,
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 17)),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 10,
        memo:
          "表参道からは歩いておよそ10分です。根津美術館は、実業家・根津嘉一郎が集めた日本・東洋の古美術品を収蔵する美術館です。国宝7件を含む多彩なコレクションで知られ、建築家・隈研吾が手がけた和モダンな建物も見どころです。館内を抜けると、およそ17,000平方メートルにおよぶ日本庭園が広がり、4棟の茶室が点在しています。毎年4月から5月にかけては、国宝「燕子花図屏風」とあわせて、庭園のカキツバタも楽しめます。都会の喧騒を忘れさせる、緑豊かな庭園をゆっくり歩いてみましょう。続いては、歩いておよそ15分のキャットストリートへ向かいましょう。",
      },
    },
    { id: catstreet.id, data: { memo: catstreetMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 22)), transitMode: "walk", transitDurationMin: 15 } },
    { id: center.id, data: { memo: centerMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 37)), stayDurationMin: 30 } },
    { id: sky.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 12)) } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

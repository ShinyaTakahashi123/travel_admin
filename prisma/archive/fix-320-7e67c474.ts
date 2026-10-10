/**
 * #320 山梨県立美術館でミレーの「種をまく人」を鑑賞する、アート日帰りプラン
 * (7e67c474)。チェックリスト20260929: 1か所09:30〜11:00で4か所未満・終了。
 *
 * 既存1スポットの過剰な丁寧語(「皆様」「ご案内いたします」「でございます」
 * 「ご鑑賞いただき」「お楽しみくださいませ」「本日は他のご案内はございません」)
 * をサイト標準の口調に直し、実在スポット4つを追加: 山梨県立文学館(美術館と
 * 同じ芸術の森公園内)・舞鶴城公園(甲府城跡、日本百名城の一つ)・藤村記念館
 * (旧睦沢学校校舎、国重要文化財)・武田神社(躑躅ヶ崎館跡、武田信玄を祀る)。
 *
 * 座標の出典(すべてNominatimで名称一致):
 * - 山梨県立文学館: way 251145788, 35.6601736,138.5393353
 * - 舞鶴城公園: way 129722779, 35.6651191,138.5713285
 * - 藤村記念館: way 226733915, 35.6678137,138.5700537
 * - 武田神社: way 226949641, 35.6867034,138.5773899
 *
 * 事実確認:
 * - 山梨県立文学館: 平成元年(1989)開館、芸術の森公園内(art-museum.pref.
 *   yamanashi.jp公式・yamanashi-kankou.jp)
 * - 舞鶴城公園: 甲府城跡、日本百名城の一つ、16世紀末築城(yamanashi-kankou.jp
 *   公式)。入園料は無料だが本文では料金に触れない
 * - 藤村記念館: 明治8年(1875)建築の旧睦沢学校校舎、藤村式建築、国重要文化財、
 *   もとは武田神社境内、平成22年(2010)に甲府駅北口の現在地へ移築
 *   (city.kofu.yamanashi.jp公式)。入館無料だが本文では料金に触れない
 * - 武田神社: 躑躅ヶ崎館跡、大正8年(1919)創建(yamanashi-kankou.jp公式)。
 *   宝物殿は有料のため本文では紹介せず、境内(堀・石垣・姫の井戸・三葉の松)
 *   のみ紹介
 *
 * 移動時間の出典:
 * - 山梨県立美術館(バス停は文学館と共通)⇔甲府駅: 山梨交通バスで約13〜15分
 *   (ekitan/NAVITIME時刻表)
 * - 甲府駅⇔舞鶴城公園: 徒歩約5分(yamanashi-kankou.jp公式)
 * - 甲府駅⇔武田神社: バスで約10分(yamanashi-kankou.jp公式)
 * - 舞鶴城公園⇔藤村記念館: 直線距離約320mから徒歩約5分と概算
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-320-7e67c474.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "7e67c474-4ea2-4ca5-9b1e-ed4d053632ff";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const museum = await prisma.spot.findFirstOrThrow({
    where: { dayId: day1.id, name: "山梨県立美術館" },
  });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "武田神社" } });
  if (already) {
    console.log("already applied, skipping spot creation");
  } else {
    const museumMemo =
      "山梨県立美術館は、山梨県の置県100周年を記念する事業として、ミレーの「種をまく人」を購入したことをきっかけに開館した美術館です。以来「ミレーの美術館」として親しまれ、ミレーやバルビゾン派の作品を収集してきました。自然の中で働く農民の姿を描いたミレーの絵画が、山梨の風土と重なると考えられ、選ばれたといわれています。館内には「種をまく人」をはじめ、「落ち穂拾い、夏」など、ミレーの油彩画を含む作品が多数所蔵されています。じっくりと作品を鑑賞してみましょう。続いては、歩いてすぐの山梨県立文学館へ向かいましょう。";

    await setDaySpotOrder(day1.id, [
      { id: museum.id, data: { memo: museumMemo } },
      {
        create: {
          name: "山梨県立文学館",
          address: "甲府市貢川1丁目5-35",
          lat: 35.6601736,
          lng: 138.5393353,
          visitTime: new Date(Date.UTC(1970, 0, 1, 11, 3)),
          stayDurationMin: 60,
          transitMode: "walk",
          transitDurationMin: 3,
          memo:
            "山梨県立美術館からは歩いてすぐです。山梨県立文学館は、平成元年(1989)、山梨県立美術館と同じ芸術の森公園内に開館しました。樋口一葉や飯田蛇笏など、山梨にゆかりのある文学者の直筆原稿や資料を収集・展示しています。美術館で絵画を楽しんだあとは、山梨の豊かな文学の世界にもふれてみましょう。続いては、バスで甲府駅まで(およそ14分)、そこから歩いて舞鶴城公園まで向かいましょう。",
        },
      },
      {
        create: {
          name: "舞鶴城公園",
          address: "甲府市丸の内1丁目",
          lat: 35.6651191,
          lng: 138.5713285,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 23)),
          stayDurationMin: 90,
          transitMode: "bus",
          transitDurationMin: 20,
          memo:
            "山梨県立文学館からは、バスと徒歩でおよそ20分です。到着したら、まずこのあたりで昼食をとりましょう。舞鶴城公園は、日本百名城の一つに数えられる甲府城の城跡の一部を開放した公園です。武田氏の滅亡後、16世紀末に築かれ、かつてはおよそ20haにおよぶ広大な城郭でした。天守台からは甲府盆地や富士山、南アルプスを見渡すことができ、稲荷櫓や山手御門など、当時をしのばせる石垣や建物が残っています。天守台への石段は段差があるので、足元に気をつけましょう。続いては、歩いておよそ5分の藤村記念館へ向かいましょう。",
        },
      },
      {
        create: {
          name: "藤村記念館",
          address: "甲府市北口2丁目31",
          lat: 35.6678137,
          lng: 138.5700537,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 58)),
          stayDurationMin: 30,
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "舞鶴城公園からは歩いておよそ5分です。藤村記念館は、明治8年(1875)に建てられた、擬洋風建築の旧睦沢学校校舎を活用した施設です。山梨県令(知事)を務めた藤村紫朗が推し進めた擬洋風建築群は「藤村式建築」と呼ばれ、山梨県の近代化の象徴として親しまれています。もとは武田神社の境内に移築されていましたが、平成22年(2010)、甲府駅北口の現在地に移されました。国の重要文化財に指定されている、レトロな洋風建築の外観と内部を見学してみましょう。続いては、甲府駅からバスでおよそ12分の武田神社へ向かいましょう。",
        },
      },
      {
        create: {
          name: "武田神社",
          address: "甲府市古府中町2611",
          lat: 35.6867034,
          lng: 138.5773899,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 40)),
          stayDurationMin: 100,
          transitMode: "bus",
          transitDurationMin: 12,
          memo:
            "藤村記念館からは、甲府駅のバス停まで歩き、バスでおよそ12分です。武田神社は、甲斐武田氏3代の信虎・信玄・勝頼が60年余りにわたって国政を執った「躑躅ヶ崎館跡」に、大正8年(1919)創建されました。境内には当時をしのばせる堀や石垣が残り、今も水が湧き出るという「姫の井戸」や、金運を招くとも伝わる「三葉の松」などが見どころです。武田信玄公を祀る、山梨を代表するこの神社に、静かに、敬意をもってお参りください。見学を終えたら、バスで甲府駅まで戻りましょう(およそ10分)。",
        },
      },
    ]);

    for (const name of ["山梨県立文学館", "舞鶴城公園", "藤村記念館", "武田神社"]) {
      const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
      await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode!, transitDurationMin: s.transitDurationMin! },
      });
    }
  }

  const newTitle = "山梨県立美術館とミレー、甲府城跡や武田神社をめぐるアート日帰りプラン";
  const newDescription =
    "ミレーの「種をまく人」を所蔵する山梨県立美術館と隣接する山梨県立文学館、甲府城跡の舞鶴城公園、藤村式建築の藤村記念館、武田信玄を祀る武田神社まで。アートと歴史にふれる日帰りプランです。";
  if (itin.title !== newTitle || itin.description !== newDescription) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: newTitle, description: newDescription } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

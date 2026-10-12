/**
 * #371の続き。企画運営(3点)・法務(記録0a9288c、3点)の指摘に対応。
 *
 * 企画運営1/法務①: つくばエキスポセンターのH-Ⅱロケット実物大模型は、
 *    前回「つくば万博を記念して設置」としたが、H-Ⅱの初打ち上げは1994年で、
 *    昭和60年(1985)のつくば万博当時にはまだ存在しない。調べ直すと、
 *    もとの文にあった「横浜博覧会(1989年)から移設された」が正しく、
 *    https://newstsukuba.jp/59191/11/12/ に「1989年の横浜博覧会で展示
 *    された模型を1990年6月にエキスポセンター屋外展示場に移設した」と
 *    明記されている。この記述に修正した。
 * 企画運営2: 車と徒歩の切り替え: 宇宙センターの駐車場に車を置いたまま
 *    地質標本館・サイエンス・スクエアを徒歩で回っていたため、車に戻る
 *    一文を追加。同様に、つくば駅で車を止めたまま徒歩でエキスポセンター
 *    へ行くため、地図と測量の科学館へ向かう前にも車へ戻る一文を追加。
 * 企画運営3: tcheck: サイエンス・スクエアの結びと、昼食の書き出しを
 *    そろえた。
 * 法務②: 座標を2か所修正。筑波宇宙センターは見学の場所にあたる展示館
 *    「Space Dome」(w381413091、36.068142,140.130507)に、つくば
 *    エキスポセンターは名前のない点(約8mずれ)からOSM実点(w382222852
 *    「つくばエキスポセンター」、36.086623,140.110575)に修正。
 * 法務③: サイエンス・スクエアつくばの座標(36.0612099,140.1337082)は、
 *    OSMで直接確認したところ、現在の名前は「AIST-Cube」だが
 *    old_name:ja=「サイエンス・スクエア」のタグがあり、同じ施設の実点
 *    であることを確認できたため、そのまま使用する(報告で確認をお願いする)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-371b-d20ff955.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "78eb1ce7-82b5-45de-9686-a07f4031f663";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const uchu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "筑波宇宙センター" } });
  const square = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "サイエンス・スクエアつくば" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "つくば駅で昼食" } });
  const expo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "つくばエキスポセンター" } });
  const chizu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "地図と測量の科学館" } });

  if (square.stayDurationMin === 60) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({ where: { id: uchu.id }, data: { lat: 36.068142, lng: 140.130507 } });
  await prisma.spot.update({ where: { id: expo.id }, data: { lat: 36.086623, lng: 140.110575 } });

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: square.id },
      data: {
        stayDurationMin: 60,
        memo: "地質標本館から歩いて2分ほど、次に訪れるのはサイエンス・スクエアつくばです。産業技術総合研究所(産総研)の最新の研究成果を、映像や試作品の展示を通じて紹介する、産業技術のショールームです。難しい研究テーマも、体験型の展示を通してわかりやすく学べるよう工夫されています。見学には1〜2時間ほどかかることもあるので、時間に余裕をもって回りましょう。見学を終えたら、歩いて筑波宇宙センターの駐車場へ戻りましょう。",
      },
    }),
    prisma.spot.update({
      where: { id: lunch.id },
      data: {
        visitTime: T(13, 20),
        memo: "サイエンス・スクエアつくばから歩いて10分ほどの筑波宇宙センターの駐車場に戻り、車でさらに10分ほど、お昼はつくば駅周辺で食事をとりましょう。駅に直結する商業施設には、さまざまなジャンルの食事処が集まっています。研究学園都市らしい、広々とした街並みを眺めながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、歩いてつくばエキスポセンターへ向かいましょう。",
        transitLegs: {
          deleteMany: {},
          create: [
            { orderNo: 1, transitMode: "walk", transitDurationMin: 10 },
            { orderNo: 2, transitMode: "car", transitDurationMin: 10 },
          ],
        },
      },
    }),
    prisma.spot.update({
      where: { id: expo.id },
      data: {
        memo: "つくば駅から歩いて6分ほど、次に訪れるのはつくばエキスポセンターです。昭和60年(1985)に開催された「科学万博つくば'85」の第2会場として建てられ、万博の閉幕翌年である昭和61年(1986)、科学館として生まれ変わりました。館のシンボルともいえるのが、屋外展示場にそびえる、高さ50メートルのH-Ⅱロケットの実物大模型で、平成元年(1989)の横浜博覧会で展示されたのち、翌年6月にこの場所へ移設されたものです。館内にはプラネタリウムをはじめ、科学の原理を体験しながら学べる展示が数多くそろい、子どもから大人まで楽しめる科学館として親しまれています。見学を終えたら、歩いてつくば駅周辺の駐車場へ戻り、車で地図と測量の科学館へ向かいましょう。",
      },
    }),
    prisma.spot.update({
      where: { id: chizu.id },
      data: {
        visitTime: T(15, 52),
        memo: "つくばエキスポセンターから歩いて6分ほどのつくば駅周辺の駐車場に戻り、車でさらに10分ほど、旅の最後に訪れるのは地図と測量の科学館です。国土地理院が運営する、地図や測量の原理と仕組みを楽しみながら学べる科学館です。屋外には、直径およそ22メートルの日本列島球体模型があり、模型の上に立つと、人工衛星から見下ろしたような日本列島の姿を体感できます。館内には、山々や海溝を立体的に見られる「日本列島空中散歩マップ」など、遊びながら学べる展示が並びます。見学を終えたら、車で12分ほどのつくば駅へ戻り、レンタカーを返しましょう。",
        transitLegs: {
          deleteMany: {},
          create: [
            { orderNo: 1, transitMode: "walk", transitDurationMin: 6 },
            { orderNo: 2, transitMode: "car", transitDurationMin: 10 },
          ],
        },
      },
    }),
  ]);

  console.log("#371続き: H-Ⅱロケット模型の経緯を訂正、車/徒歩の切り替えの一文を追加、結び/書き出しをそろえた");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #336の続き。企画運営・法務 2026-10-01 06:27・06:43の指摘に対応。
 *
 * 1) 「パワースポット」を全て外す(タイトル・温泉寺・永楽館の結び)。タイトルは
 *    企画運営案「城崎の外湯めぐりと温泉寺、玄武洞と出石の城下町を歩く1泊2日」。
 * 2) 外湯の営業時間を確認したところ、まんだら湯・柳湯は15:00開店(城崎温泉観光協会
 *    公式で確認)で、08:30出発の順番では開店前に訪れる形になっていた。1日目を
 *    文芸館→ロープウェイ→温泉寺→御所の湯→一の湯(昼食もここで)→地蔵湯→
 *    まんだら湯→柳湯(最後、宿の一言)の順に組み直し、まんだら湯・柳湯は15時台に。
 * 3) 昼食をtransitMode"other"40分に隠していたのを直し、一の湯の滞在時間に
 *    入浴+昼食として含めた(決まりA対応)。
 * 4) 城崎文芸館の開館は9時から(公式で確認)のため、1日目の開始を8:30→9:00に。
 * 5) 外湯5つの「ご利益があるとも伝えられています」を削除(法務指摘、ご利益は
 *    書かない決まり)。地蔵湯の「水子供養」もこれに伴い削除。
 * 6) まんだら湯以外の4つの外湯に、撮影配慮・水分補給の一言を追加。
 * 7) 御所の湯「建長元年(1267)」は年号が誤り(建長元年は1249年)だったため、
 *    正しい「文永4年(1267)」に訂正(『増鏡』の記述、公式サイトで確認)。
 * 8) 2日目: 玄武洞公園に、城崎温泉駅前でレンタカーを借りる旨を追加。永楽館の
 *    結びを新タイトルに合わせ、帰りをレンタカー返却+電車に修正。コウノトリの
 *    郷公園「飼育ゲージ」の誤字を「飼育ケージ」に修正。
 * 9) まんだら湯に付いていた写真(実際は大谿川・柳並木の写真)を外し、その柳並木に
 *    言及している城崎文芸館に付け替え(法務指摘)。
 *
 * 永楽館「舞台に立って」は公式サイト等で実際に舞台へ上がれることを確認できた
 * ため、そのまま維持。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-336e-9d31758b.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9d31758b-13cf-4d8c-bbdd-87a0361b36db";
const DAY1_ID = "a1c4a50b-aa75-4320-8ef3-c94461767417";

const NEW_TITLE = "城崎の外湯めぐりと温泉寺、玄武洞と出石の城下町を歩く1泊2日";
const NEW_DESC =
  "城崎温泉の外湯めぐりと大師山温泉寺をめぐり、2日目は玄武洞の柱状節理と出石の城下町を歩く。温泉と自然、歴史的な町並みを一度に楽しめるプランです。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.title === NEW_TITLE) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: NEW_TITLE, description: NEW_DESC } });

    const bunkeikan = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "城崎文芸館" } });
    const ropeway = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "城崎温泉ロープウェイ" } });
    const onsenji = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "温泉寺（城崎）" } });
    const goshonoyu = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "御所の湯" } });
    const ichinoyu = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "一の湯" } });
    const jizoyu = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "地蔵湯" } });
    const mandarayu = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "まんだら湯" } });
    const yanagiyu = await tx.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "柳湯" } });

    await setDaySpotOrder(
      DAY1_ID,
      [
        {
          id: bunkeikan.id,
          data: {
            visitTime: t(9, 0),
          },
        },
        {
          id: ropeway.id,
          data: {
            visitTime: t(9, 45),
          },
        },
        {
          id: onsenji.id,
          data: {
            visitTime: t(10, 20),
            memo:
              "ロープウェイの中間駅からは徒歩でおよそ10分です。温泉寺は、養老元年(717)、この地を訪れた道智上人が、難病に苦しむ人々を救おうと千日にわたって経を唱え続けたところ、霊泉が湧き出したのが城崎温泉の始まりと伝えられる古刹です。天平10年(738)には、聖武天皇から「末代山温泉寺」の山号・寺号を賜り、城崎温泉の守護寺として開かれました。本尊の十一面観世音菩薩をはじめ、多くの文化財を伝え、大師山の中腹という立地から、山岳信仰とも結びついた祈りの場として知られています。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。開湯の物語と山の霊気に触れてみましょう。続いては、歩いておよそ12分の御所の湯へ向かいましょう。",
          },
        },
        {
          id: goshonoyu.id,
          data: {
            visitTime: t(11, 12),
            stayDurationMin: 70,
            transitMode: "walk",
            transitDurationMin: 12,
            memo:
              "温泉寺からは歩いておよそ12分です。御所の湯は、南北朝時代の歴史物語『増鏡』に、文永4年(1267)、後堀河天皇の姉にあたる安嘉門院が入湯したという記録が残ることにちなんで名付けられたと伝えられる外湯です。但馬の山並みを借景にした露天風呂が特徴で、令和2年(2020)に大規模なリニューアルを終え、城崎温泉を代表する風格ある佇まいを今に伝えています。ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。但馬の山並みを眺めながら、湯に浸かってみましょう。続いては、歩いておよそ4分の一の湯へ向かいましょう。",
          },
        },
        {
          id: ichinoyu.id,
          data: {
            visitTime: t(12, 26),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 4,
            memo:
              "御所の湯からは歩いておよそ4分です。一の湯は、江戸時代の医師が「天下一の湯」と称えたことが名の由来と伝えられる外湯です。飲泉場も設けられており、温泉を飲む文化が今も息づいています。ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。浴後は、このあたりの木屋町小路周辺の飲食店で昼食をとるとよいでしょう。外湯はそれぞれ開いている時間や休みの曜日が異なるため、訪れる前に公式サイトで確認しましょう。続いては、歩いておよそ5分の地蔵湯へ向かいましょう。",
          },
        },
        {
          id: jizoyu.id,
          data: {
            visitTime: t(14, 1),
            stayDurationMin: 50,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "一の湯からは歩いておよそ5分です。地蔵湯は、温泉の泉源から地蔵尊が現れたという言い伝えが名の由来とされる外湯です。七つの外湯の中でも、地域の人々の暮らしに寄り添う信仰の場として親しまれてきました。ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。ここまで巡ってきた外湯それぞれの物語を思い返しながら、湯に浸かってみましょう。続いては、歩いておよそ11分のまんだら湯へ向かいましょう。",
          },
        },
        {
          id: mandarayu.id,
          data: {
            visitTime: t(15, 2),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 11,
            memo:
              "地蔵湯からは歩いておよそ11分です。まんだら湯は、道智上人が千日にわたって経を唱え続けたところ温泉が湧き出したという、城崎温泉の開湯伝説にちなんで名付けられたと伝えられる外湯です。唐破風造りの建物が目を引き、城崎温泉の中でも歴史的な意味合いの深い一湯として知られています。浴場では、ほかの入浴客が写らないよう撮影は控え、長湯を避けて水分をとりながら静かに過ごしましょう。開湯の物語にゆかりのある湯に浸かり、旅の疲れをほぐしてみましょう。続いては、歩いておよそ7分の柳湯へ向かいましょう。",
          },
        },
        {
          id: yanagiyu.id,
          data: {
            visitTime: t(16, 9),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 7,
            memo:
              "まんだら湯からは歩いておよそ7分です。柳湯は、七つの外湯の中でもっとも小さな湯で、中国の西湖から移し植えたと伝えられる柳の木の下から温泉が湧き出したことが名の由来とされています。こぢんまりとした佇まいながら、城崎らしい風情を今に伝えています。ここでも撮影は控え、湯あたりしないよう、休みながら水分をとりましょう。一日かけて巡った外湯めぐりの締めくくりに、ゆっくりと湯に浸かってみましょう。今夜はこの近くの宿に泊まり、旅の疲れを癒やします。",
          },
        },
      ],
      { tx }
    );

    const genbudo = await tx.spot.findFirstOrThrow({ where: { name: "玄武洞公園", day: { itineraryId: ITIN_ID } } });
    await tx.spot.update({
      where: { id: genbudo.id },
      data: {
        memo:
          "旅の2日目は、玄武洞公園からです。城崎温泉駅前でレンタカーを借り、ここから先は車で移動します。円山川沿いの山裾に、玄武岩の柱状節理がそそり立つ奇観で、およそ160万年前の火山活動で流れ出た溶岩が冷え固まる際、規則正しい六角形の柱状に割れてできたと伝えられています。文化4年(1807)、儒学者・柴野栗山がこの岩壁の模様を中国神話の神獣「玄武」に見立てて名付けたのが名の由来と伝えられ、昭和6年(1931)には国の天然記念物に指定されました。園内には玄武洞のほか、青龍洞・白虎洞・南朱雀洞・北朱雀洞と、四神の名を冠した洞が点在し、隣接する施設では地質や化石の資料もあわせて学べます。悠久の時を経て姿を現した大地の造形を、ゆっくりと眺めてみましょう。続いては、車でおよそ20分の兵庫県立コウノトリの郷公園へ向かいましょう。",
      },
    });

    const konotori = await tx.spot.findFirstOrThrow({ where: { name: "兵庫県立コウノトリの郷公園", day: { itineraryId: ITIN_ID } } });
    await tx.spot.update({
      where: { id: konotori.id },
      data: {
        memo:
          "玄武洞公園からは、車でおよそ20分です。兵庫県立コウノトリの郷公園は、一度は日本国内で絶滅した特別天然記念物コウノトリを、人工繁殖と野生復帰の取り組みによって再びこの地の空に呼び戻した、保護と研究の拠点です。園内の観察ポイントや山頂のあずまやからは、大空を舞うコウノトリの姿を間近に眺めることができ、春から夏にかけては、ひなの子育ての様子が見られることもあります。隣接する豊岡市立コウノトリ文化館では、飼育ケージ内のコウノトリの生態や、野生復帰までの歩みを学べます。コウノトリを驚かせないよう、大きな声や物音は控え、静かに観察しましょう。人と自然が共に生きる、豊岡ならではの風景をゆっくりと眺めてみましょう。続いては、車でおよそ20分の出石へ向かいましょう。",
      },
    });

    const eirakukan = await tx.spot.findFirstOrThrow({ where: { name: "出石永楽館", day: { itineraryId: ITIN_ID } } });
    await tx.spot.update({
      where: { id: eirakukan.id },
      data: {
        memo:
          "出石明治館からは歩いておよそ6分です。出石永楽館は、明治時代後期に建てられた芝居小屋で、近畿地方に現存する最古の芝居小屋と伝えられています。昭和中期に一度閉館しましたが、大規模な改修を経て平成20年(2008)に芝居小屋として再開館しました。館内は一般公開されており、廻り舞台や奈落など、当時の芝居小屋の仕組みを間近に見学することができます。かつて多くの旅役者や見物客でにぎわった芝居小屋の空気を、舞台に立って感じてみましょう。城崎の外湯めぐりと温泉寺、玄武洞と出石の城下町を歩く1泊2日は、ここで終わりです。帰りは、車でおよそ20分のJR豊岡駅まで向かい、駅前でレンタカーを返却してから、電車で帰路につきます。",
      },
    });

    const photo = await tx.photo.findFirst({ where: { spotId: mandarayu.id } });
    if (photo) {
      await tx.photo.update({ where: { id: photo.id }, data: { spotId: bunkeikan.id } });
      console.log("photo reassigned from mandarayu to bunkeikan:", photo.id);
    } else {
      console.log("no photo on mandarayu (already reassigned)");
    }
  }, { timeout: 60000 });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

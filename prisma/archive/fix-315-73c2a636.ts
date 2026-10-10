/**
 * チェックリスト #315 の修正記録(ふだんの見直し)。
 * しおり「大原美術館、日本初の西洋美術中心の私立美術館プラン」
 * (73c2a636-6381-4cf5-9f24-f7d344692cc1)
 *
 * 本番で1か所09:30〜11:00のみで、決まり(4か所以上・終了16:30〜17:00)に
 * 届いていないことが判明。descriptionが「美観地区の町並みとは違う、
 * アートを楽しむプラン」と明記しているため、美観地区の町並み散策的な
 * スポットではなく、大原美術館・大原家にゆかりのある美術館・記念館を
 * 中心に追加した。
 *
 * 出典: https://www.oharahontei.jp/ (語らい座大原本邸、公式。国指定重要
 * 文化財の大原家住宅、大原孫三郎の生家)
 * 出典: https://www.city.kurashiki.okayama.jp/cityinfo/publicity/1001929/1001937/1013066/1013660/1017997.html
 * (児島虎次郎記念館、倉敷市公式。2025年4月開館、大原美術館の別館、旧
 * 第一合同銀行倉敷支店の建物)
 * 出典: https://www.fashion-press.net/news/72647 (UKIYO-E KURASHIKI/国芳館。
 * 世界初の歌川国芳のミュージアム)
 * 出典: https://www.kake.ac.jp/kakebi/ (倉敷芸術科学大学 加計美術館)
 * 出典: https://www.city.kurashiki.okayama.jp/kcam/index.html (倉敷市立
 * 美術館。丹下健三設計の旧市庁舎、池田遙邨コレクション)
 *
 * 座標: 倉敷市立美術館・UKIYO-E KURASHIKI・加計美術館はNominatim(OSM)の
 * 名称一致ノード。児島虎次郎記念館は2025年4月開館とごく新しく、OSMに
 * まだ名称一致が無かったため、GSI住所検索(本町、大字までの解像度)に
 * よる推定。語らい座大原本邸はGSI住所検索でフルの番地まで解決できた。
 *
 * 大原美術館の書き出しを、他のしおりと合わせて通常の文体に直した。
 * 末尾の締めの一言(旧・唯一のスポットだった名残)は次のスポットへの
 * 案内に差し替え。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315-73c2a636.ts
 * (実行済み。語らい座大原本邸の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "語らい座大原本邸")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const ohara = day1.spots.find((s) => s.name === "大原美術館")!;

  const oharaMemo = (ohara.memo ?? "")
    .replace("皆様、本日ご案内するのは大原美術館です。", "この旅は、歩いてめぐります。ご案内するのは大原美術館です。")
    .replace(
      "倉敷美観地区の白壁の町並みの中に佇む、西洋美術の粋をじっくりとご堪能ください。大原美術館、日本初の西洋美術中心の私立美術館プランをお楽しみいただけたことでしょう。",
      "倉敷美観地区の白壁の町並みの中に佇む、西洋美術の粋をじっくりとご堪能ください。続いては、歩いておよそ2分の語らい座大原本邸へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: ohara.id }, { memo: oharaMemo });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: ohara.id, data: {} },
        {
          create: {
            name: "語らい座大原本邸",
            address: "倉敷市中央1-2-1",
            lat: 34.597137,
            lng: 133.770615,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 2)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "大原美術館からは歩いておよそ2分です。語らい座大原本邸は、大原美術館や倉敷中央病院など、数々の事業を興した大原家の旧宅で、国の重要文化財に指定されています。江戸時代の終わりごろに建てられたこの家で、大原美術館を設立した大原孫三郎は生まれ育ちました。大原家8代にわたる歩みを紹介する展示や、大原家の蔵書に囲まれたブックカフェもあり、大原家の歴史をじっくりとたどることができます。",
          },
        },
        {
          create: {
            name: "児島虎次郎記念館",
            address: "倉敷市本町1160",
            lat: 34.596249,
            lng: 133.77417,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 7)),
            stayDurationMin: 70,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "語らい座大原本邸からは歩いておよそ5分です。児島虎次郎記念館は、大原美術館の別館として、令和7年(2025)に開館した記念館です。大正11年(1922)に旧第一合同銀行倉敷支店として建てられた、国の登録有形文化財の建物を活用しています。大原美術館の礎を築いた洋画家・児島虎次郎の作品や、彼がヨーロッパ留学中に収集した古代エジプト・西アジアの美術品などが展示されています。このあたりで、昼食をとりましょう。大原美術館の原点となったコレクションを、じっくりとご覧ください。",
          },
        },
        {
          create: {
            name: "UKIYO-E KURASHIKI/国芳館",
            address: "倉敷市本町1-24",
            lat: 34.5965463,
            lng: 133.7732839,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 19)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 2,
            memo:
              "児島虎次郎記念館からは歩いておよそ2分です。UKIYO-E KURASHIKI/国芳館は、幕末の浮世絵師・歌川国芳の作品を専門に紹介する、世界初とされる浮世絵師個人のミュージアムです。ダイナミックな構図と奇抜な発想で人気を集めた国芳の武者絵や戯画などを、じっくりと味わうことができます。西洋美術とはまた違う、江戸の絵師の想像力の豊かさを感じてみましょう。",
          },
        },
        {
          create: {
            name: "加計美術館",
            address: "倉敷市中央1丁目4-7",
            lat: 34.595721,
            lng: 133.7714865,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 7)),
            stayDurationMin: 50,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "UKIYO-E KURASHIKI/国芳館からは歩いておよそ3分です。加計美術館は、倉敷芸術科学大学と吉備国際大学を運営する加計学園が設立した美術館です。関連大学の学生や卒業生による作品、文化財修復にまつわる展示など、企画展を中心に幅広い作品にふれることができます。若い作り手たちの表現を、楽しんでみましょう。",
          },
        },
        {
          create: {
            name: "倉敷市立美術館",
            address: "倉敷市中央2丁目6-1",
            lat: 34.5946987,
            lng: 133.7689589,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 1)),
            stayDurationMin: 90,
            transitMode: "walk",
            transitDurationMin: 4,
            memo:
              "加計美術館からは歩いておよそ4分です。倉敷市立美術館は、建築家・丹下健三が昭和35年(1960)に倉敷市庁舎として設計した建物を、昭和58年(1983)に美術館として再生した施設です。横に渡されたおよそ20mの梁と、それを支える太い柱や厚い壁が、雄大なスケールを見せています。昭和55年(1980)、倉敷市出身の日本画家・池田遙邨から寄贈された489点の作品が、コレクションの基礎となっています。建築とアート、両方の見応えを楽しんでみましょう。見学を終えたら、歩いて帰りましょう。",
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

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

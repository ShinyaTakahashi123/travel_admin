/**
 * #263の続き。企画運営09:44の指摘に対応(前回見落とされていた水増し)。
 * 1日目: 黎明館90→60分・西郷南洲顕彰館85→45分に戻し、空いた時間は実在の
 * 私学校跡(西南戦争の銃弾跡、黎明館のすぐ向かい)・南洲神社・南洲墓地
 * (西郷南洲顕彰館のすぐそば、もとの本文で「隣接」と書かれていた場所を
 * 独立したスポットに)を追加して埋めた。城山展望台への移動がbus10分・
 * 0.3kmで近すぎたため、私学校跡からの徒歩8分に直した。西郷隆盛銅像に
 * 昼食の一言を追加(11:30〜13:30の範囲内)。
 * 2日目: 天文館60→30分(朝はまだ開いていない店が多いため)。鹿児島中央駅の
 * 60分の滞在は、駅での長い滞在だったため削除し、実在の異人館(旧鹿児島
 * 紡績所技師館、尚古集成館のすぐそば)・多賀山公園(東郷平八郎像)を追加し、
 * 鹿児島中央駅は帰りの一言だけにした。仙巌園に昼食の一言を追加(100分に、
 * 史跡見学+昼食として)。
 *
 * 座標はOSM raw API(私学校跡・南洲神社・異人館・多賀山公園)で確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-263b-1f5e18c2.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "bcc2925a-c371-45cb-b553-7e08a7c5db8a";
const DAY2_ID = "16d92ea1-576f-451f-a2b0-5392a5e50d68";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "私学校跡", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const ishinFurusato = await prisma.spot.findFirstOrThrow({ where: { name: "維新ふるさと館", dayId: DAY1_ID } });
  const terukuni = await prisma.spot.findFirstOrThrow({ where: { name: "照国神社", dayId: DAY1_ID } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { name: "鹿児島市立美術館", dayId: DAY1_ID } });
  const saigoDozo = await prisma.spot.findFirstOrThrow({ where: { name: "西郷隆盛銅像", dayId: DAY1_ID } });
  const reimeikan = await prisma.spot.findFirstOrThrow({ where: { name: "鹿児島県歴史・美術センター黎明館", dayId: DAY1_ID } });
  const shiroyama = await prisma.spot.findFirstOrThrow({ where: { name: "城山展望台", dayId: DAY1_ID } });
  const saigoNanshu = await prisma.spot.findFirstOrThrow({ where: { name: "西郷南洲顕彰館", dayId: DAY1_ID } });

  const saigoDozoOld = "見学を終えたら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。";
  const saigoDozoNext = "このあたりの食事処で昼食をとるとよいでしょう。見学を終えたら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。";
  if (!saigoDozo.memo?.includes(saigoDozoOld)) throw new Error("saigo dozo text not found");

  const reimeikanOld = "見学を終えたら、バスで城山展望台へ向かいましょう。";
  const reimeikanNext = "見学を終えたら、道を挟んですぐ向かいの私学校跡へ向かいましょう。";
  if (!reimeikan.memo?.includes(reimeikanOld)) throw new Error("reimeikan text not found");

  const shiroyamaOld = "黎明館を見学したら、バスで城山展望台へ向かいましょう。";
  const shiroyamaNext = "私学校跡からは歩いておよそ8分です。";
  if (!shiroyama.memo?.includes(shiroyamaOld)) throw new Error("shiroyama text not found");

  const saigoNanshuOld =
    "見学のあとは、隣接する南洲墓地・南洲神社まで歩いてお参りしましょう。西郷隆盛をはじめ多くの薩軍将士が眠る墓所ですので、静かに、敬意をもってお参りください。城山の中腹には、明治10年(1877)の西南戦争最後の5日間、西郷が桐野利秋ら私学校の幹部たちと過ごしたと伝わる「西郷洞窟」も残っています。西郷隆盛という一人の人物の生涯を、じっくりとたどりましょう。幕末維新ゆかりの史跡を巡る本日の旅は、これで終わりです。今夜はこの近くの宿にご宿泊ください。";
  const saigoNanshuNext =
    "西郷隆盛という一人の人物の生涯を、じっくりとたどりましょう。続いては、歩いておよそ5分の南洲神社・南洲墓地へ向かいましょう。";
  if (!saigoNanshu.memo?.includes(saigoNanshuOld)) throw new Error("saigo nanshu text not found");

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: ishinFurusato.id, data: {} },
      { id: terukuni.id, data: {} },
      { id: bijutsukan.id, data: {} },
      { id: saigoDozo.id, data: { memo: saigoDozo.memo.replace(saigoDozoOld, saigoDozoNext) } },
      {
        id: reimeikan.id,
        data: { stayDurationMin: 60, memo: reimeikan.memo.replace(reimeikanOld, reimeikanNext) },
      },
      {
        create: {
          name: "私学校跡",
          address: "鹿児島県鹿児島市山下町",
          lat: 31.599681,
          lng: 130.5568534,
          visitTime: t(13, 51),
          stayDurationMin: 20,
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "黎明館のすぐ向かい、道を挟んですぐの場所にあるのが私学校跡です。明治7年(1874)、西郷隆盛が旧薩摩藩士の子弟を教育するために開いた私学校の跡で、西南戦争では西郷軍の拠点ともなりました。石垣には、明治10年(1877)の西南戦争で撃ち込まれた無数の銃弾の跡が今も残り、激戦の生々しさを伝えています。歴史の表舞台となったこの場所で、西南戦争の激しさに思いを馳せてみましょう。続いては、歩いておよそ8分の城山展望台へ向かいましょう。",
        },
      },
      {
        id: shiroyama.id,
        data: {
          visitTime: t(14, 19),
          stayDurationMin: 40,
          transitMode: "walk",
          transitDurationMin: 8,
          memo: shiroyama.memo.replace(shiroyamaOld, shiroyamaNext),
        },
      },
      {
        id: saigoNanshu.id,
        data: {
          visitTime: t(15, 11),
          stayDurationMin: 45,
          memo: saigoNanshu.memo.replace(saigoNanshuOld, saigoNanshuNext),
        },
      },
      {
        create: {
          name: "南洲神社・南洲墓地",
          address: "鹿児島県鹿児島市上竜尾町",
          lat: 31.6064499,
          lng: 130.5588767,
          visitTime: t(16, 1),
          stayDurationMin: 30,
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "西郷南洲顕彰館からは歩いておよそ5分です。南洲神社・南洲墓地は、西南戦争で西郷隆盛とともに散った、2000名を超える薩軍将士が眠る墓地と、西郷を祭神として祀る神社です。西郷隆盛自身の墓を中心に、身分の上下を問わず、同じ大きさの墓石が整然と並ぶ光景は、西郷の人柄を今に伝えています。西郷の命日にあわせた慰霊祭が、今も毎年営まれています。西郷隆盛をはじめ多くの薩軍将士が眠る墓所ですので、境内では静かに、敬意をもってお参りください。幕末維新ゆかりの史跡を巡る1日目は、ここで終わりです。今夜はこの近くの宿に泊まり、旅の疲れを癒やします。",
        },
      },
    ]
  );

  const tenmonkan = await prisma.spot.findFirstOrThrow({ where: { name: "天文館", dayId: DAY2_ID } });
  const sakurajima = await prisma.spot.findFirstOrThrow({ where: { name: "桜島", dayId: DAY2_ID } });
  const senganen = await prisma.spot.findFirstOrThrow({ where: { name: "仙巌園", dayId: DAY2_ID } });
  const shokoShuseikan = await prisma.spot.findFirstOrThrow({ where: { name: "尚古集成館", dayId: DAY2_ID } });
  const kagoshimaChuo = await prisma.spot.findFirstOrThrow({ where: { name: "鹿児島中央駅", dayId: DAY2_ID } });

  const senganenOld = "世界文化遺産に登録されました。桜島を望む庭園美と、";
  const senganenNext = "世界文化遺産に登録されました。このあたりの茶屋などで昼食をとるとよいでしょう。桜島を望む庭園美と、";
  if (!senganen.memo?.includes(senganenOld)) throw new Error("senganen text not found");

  const shokoOld = "見学を終えたら、バスで鹿児島中央駅へ向かいましょう。";
  const shokoNext = "見学を終えたら、歩いて異人館へ向かいましょう。";
  if (!shokoShuseikan.memo?.includes(shokoOld)) throw new Error("shoko shuseikan text not found");

  await setDaySpotOrder(
    DAY2_ID,
    [
      { id: tenmonkan.id, data: { stayDurationMin: 30 } },
      { id: sakurajima.id, data: {} },
      {
        id: senganen.id,
        data: { stayDurationMin: 100, memo: senganen.memo.replace(senganenOld, senganenNext) },
      },
      {
        id: shokoShuseikan.id,
        data: { memo: shokoShuseikan.memo.replace(shokoOld, shokoNext) },
      },
      {
        create: {
          name: "異人館",
          address: "鹿児島県鹿児島市清水町",
          lat: 31.6156243,
          lng: 130.5741964,
          visitTime: t(15, 7),
          stayDurationMin: 40,
          transitMode: "walk",
          transitDurationMin: 4,
          memo:
            "尚古集成館からは歩いておよそ4分です。旧鹿児島紡績所技師館は、「異人館」の愛称で親しまれる洋館です。慶応3年(1867)、島津家28代当主・島津斉彬の遺志を継いで設立された鹿児島紡績所の操業を指導するため、イギリスから招かれた技師7人の宿舎として建てられました。現存する木造洋風建築として国の重要文化財に指定され、仙巌園・尚古集成館とともに「明治日本の産業革命遺産」の構成資産として世界文化遺産に登録されています。異国情緒あふれるベランダや、当時のままの部屋のつくりを見学できます。鹿児島の近代化を支えた異国の技師たちの暮らしぶりを、間近でしのんでみましょう。続いては、歩いておよそ13分の多賀山公園へ向かいましょう。",
        },
      },
      {
        create: {
          name: "多賀山公園",
          address: "鹿児島県鹿児島市清水町",
          lat: 31.6070879,
          lng: 130.5706532,
          visitTime: t(16, 0),
          stayDurationMin: 35,
          transitMode: "walk",
          transitDurationMin: 13,
          memo:
            "異人館からは歩いておよそ13分です。多賀山公園は、錦江湾を見渡す高台に広がる公園で、日露戦争で活躍した東郷平八郎元帥の銅像が立っています。桜島を望む静かな眺めは、地元の人々の憩いの場としても親しまれています。旅の終わりに、鹿児島の海と山々が織りなす景色を、ゆっくりと眺めてみましょう。維新ふるさと館と天文館、幕末の記憶と鹿児島グルメを巡る1泊2日の旅は、ここで終わりです。帰りは、バスでおよそ35分の鹿児島中央駅へ向かい、駅ビルでお土産を探したり、郷土料理を味わったりしてから、電車で帰路につきましょう。",
        },
      },
    ],
    { remove: [kagoshimaChuo.id] }
  );

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

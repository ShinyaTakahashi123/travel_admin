/**
 * #366 犬山城、現存12天守最古とされる定番日帰りプラン(cd007650)。
 * 犬山城1か所・09:30〜10:50のみだったのを、犬山市内を徒歩+バスで回る5か所・
 * 09:00〜16:30に組み直す。旧文の古い案内口調(「皆様、本日ご案内するのは」)も
 * 直した。三光稲荷神社は「パワースポット」という言葉を使わず、絵馬の風習を
 * 事実として記載。
 *
 * - 針綱神社: OSM node964921968、35.3873270,136.9398404
 * - 三光稲荷神社: OSM node964922252、35.3868969,136.9391618
 * - 犬山城下町(昼食): OSMに本町通りの点がないため、GSI住所点(愛知県犬山市大字
 *   犬山東古券、本町通りを含む地区)の実点(35.37952,136.940262)を使用(店名は出さない)
 * - 博物館明治村: OSM relation12421413、35.3441241,136.9905061
 *
 * 新しい時刻(09:00〜16:30、5か所):
 * 犬山城(85)→針綱神社(20)→三光稲荷神社(31)→犬山城下町・昼食(70)→博物館明治村(210)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-366-cd007650.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "fe97a028-dcf3-4711-99f9-9a5ed8cbea0a";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const inuyamajo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "犬山城" } });
  if (inuyamajo.stayDurationMin === 85 && inuyamajo.memo?.includes("針綱神社へ向かいましょう")) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: inuyamajo.id,
        data: {
          lat: 35.3883304,
          lng: 136.9392776,
          visitTime: T(9, 0),
          stayDurationMin: 85,
          memo: "名鉄犬山遊園駅から歩いて10分ほど、犬山の旅は犬山城から始まります。天文6年(1537)、織田信長の叔父にあたる織田信康によって築かれた城で、木曽川のほとりにそびえる姿から「白帝城」の別名でも親しまれています。この名前は、中国の詩人・李白の詩にうたわれた、長江流域の丘の上に立つ白帝城になぞらえて、儒学者・荻生徂徠が名づけたと伝えられています。現存する12の天守のうち、最も古い天守とされ、天守が国宝に指定された5つの城の一つにも数えられています。明治24年(1891)の濃尾地震で一部が壊れた際には、修復を条件に旧犬山藩主・成瀬家へ無償で譲渡され、個人が所有する城として知られてきましたが、平成16年(2004)からは財団法人の所有となり、今も大切に受け継がれています。木曽川と濃尾平野を見渡す天守からの眺めを楽しみましょう。見学を終えたら、歩いて針綱神社へ向かいましょう。",
        },
      },
      {
        create: {
          name: "針綱神社",
          address: "犬山市犬山北古券65-1",
          lat: 35.387327,
          lng: 136.9398404,
          visitTime: T(10, 27),
          stayDurationMin: 20,
          memo: "犬山城から歩いて2分ほど、次に訪れるのは針綱神社です。犬山城が築かれる以前からこの地にあったと伝えられる古社で、犬山城の守護神として祀られてきました。毎年4月に行われる犬山祭は、この神社の例大祭にあたり、豪華な車山(やま)が城下町を巡ります。静かに、敬意をもって参拝しましょう。見学を終えたら、歩いて三光稲荷神社へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        create: {
          name: "三光稲荷神社",
          address: "犬山市犬山北古券41-1",
          lat: 35.3868969,
          lng: 136.9391618,
          visitTime: T(10, 49),
          stayDurationMin: 31,
          memo: "針綱神社から歩いて2分ほど、次に訪れるのは三光稲荷神社です。商売繁盛や縁結びの神様として親しまれる神社で、ハート型の絵馬を奉納できることでも知られています。境内には、ハート型の絵馬がびっしりと並ぶ一角もあり、写真を撮る参拝者の姿も見られます。静かに、敬意をもって参拝しましょう。見学を終えたら、歩いて犬山城下町へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        create: {
          name: "犬山城下町で昼食",
          address: "犬山市犬山東古券",
          lat: 35.37952,
          lng: 136.940262,
          visitTime: T(11, 30),
          stayDurationMin: 70,
          memo: "三光稲荷神社から歩いて10分ほど、お昼は犬山城下町で食事をとりましょう。本町通りを中心に、串焼きなどの食べ歩きグルメや、老舗の食事処が軒を連ねる城下町です。城下町らしい町並みを眺めながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、バスで博物館明治村へ向かいましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "博物館明治村",
          address: "犬山市内山1",
          lat: 35.3441241,
          lng: 136.9905061,
          visitTime: T(13, 0),
          stayDurationMin: 210,
          memo: "犬山城下町からバスで20分ほど、旅の最後に訪れるのは博物館明治村です。明治から昭和初期にかけての建物67棟を移築復原した、広大な野外博物館です。重要文化財に指定された建物も多く、京都市電や蒸気機関車に乗って園内を移動することもできます。見たい建物やペースにあわせて、ゆっくりと散策しましょう。見学を終えたら、バスで犬山駅へ戻り、犬山城下町を巡る1日を締めくくりましょう。",
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 20, transitLine: "岐阜バス(犬山駅東口⇔明治村)" }] },
        },
      },
    ]
  );

  console.log("#366: 針綱神社・三光稲荷神社・犬山城下町・博物館明治村を追加、09:00〜16:30着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #340の続き。企画運営08:12・09:20の指摘(ユーザー確認済み「このまま続ける」)に対応。
 *
 * 1) 2日目: 説明を厚くして時間を合わせたのは水増しだったため、観世音寺(55→41分)・
 *    客館跡(35→25分)・榎社(40→30分)・大宰府展示館(40→30分)・竈門神社(85→58分)を
 *    元に戻した(文章も、厚くした一文を削って元に戻した)。空いた時間は、実在の
 *    水城跡(天智天皇3年〈664〉築造、特別史跡、水城館を含む)を2日目の最初に
 *    新たに追加して埋めた(9か所→10か所)。
 * 2) 昼食: 大宰府政庁跡を、史跡の見学(35分)+昼食(25分)の60分に組み直し、
 *    榎社の後に回ることで到着が13:02(11:30〜13:30の範囲内)になるようにした。
 *    「このあたりの飲食店で、ゆっくりと昼食をとりましょう」と、実際に食べる
 *    場所・時間として明記。
 * 3) 1日目: 太宰府天満宮参道(昼食の場)が13:52開始で11:30〜13:30の範囲外
 *    だったため、太宰府天満宮のすぐあとに回る順番に組み替え、到着を12:37に
 *    した(宝物殿・菅公歴史館はそのあとに回す)。昼食の一言も、宝物殿ではなく
 *    参道(実際に飲食店が並ぶ場所)に書いた。
 *
 * 終了は1日目16:38・2日目16:53(いずれも窓内)。報告前に、前の版(fix-340e/f)と
 * 比べて延びた滞在がないことを確認済み(観世音寺・客館跡・榎社・展示館・竈門神社は
 * いずれも元の数字に戻し、新たに延ばしたのは政庁跡の昼食分〈+19分、実際に
 * 食べる時間として〉と水城跡の新規追加のみ)。
 *
 * 座標はOSM raw API(水城館は「水城館」とタグ付けされたノードそのもの)で確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340g-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "8131749f-57e6-4cdf-a2ba-3d0eb2f9928c";
const DAY2_ID = "710a12c3-f43f-4f31-953c-31bcf19bc319";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "水城跡", dayId: DAY2_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  // ---- Day1: 太宰府天満宮参道を天満宮の直後に組み替え ----
  const tenmangu = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府天満宮", dayId: DAY1_ID } });
  const sando = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府天満宮参道", dayId: DAY1_ID } });
  const hobutsuden = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府天満宮宝物殿", dayId: DAY1_ID } });
  const kanko = await prisma.spot.findFirstOrThrow({ where: { name: "菅公歴史館", dayId: DAY1_ID } });
  const komyozenji = await prisma.spot.findFirstOrThrow({ where: { name: "光明禅寺", dayId: DAY1_ID } });
  const bunkafureai = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府市文化ふれあい館", dayId: DAY1_ID } });
  const hakubutsukan = await prisma.spot.findFirstOrThrow({ where: { name: "九州国立博物館", dayId: DAY1_ID } });
  const tenkaiInari = await prisma.spot.findFirstOrThrow({ where: { name: "天開稲荷社", dayId: DAY1_ID } });

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: hakubutsukan.id, data: {} },
      { id: tenkaiInari.id, data: {} },
      {
        id: tenmangu.id,
        data: {
          memo: tenmangu.memo?.replace(
            "続いては、すぐそばの太宰府天満宮宝物殿へ向かいましょう。",
            "続いては、歩いておよそ5分の太宰府天満宮参道へ向かいましょう。"
          ),
        },
      },
      {
        id: sando.id,
        data: {
          visitTime: t(12, 37),
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "太宰府天満宮からは歩いておよそ5分です。太宰府天満宮参道は、西鉄太宰府駅から天満宮の入り口まで続く、およそ400mの表参道です。名物の梅ヶ枝餅を焼く香ばしい匂いが漂う店をはじめ、和菓子店や伝統工芸品店、モダンなカフェまでが軒を連ね、多くの参拝客でにぎわいます。このあたりの飲食店で昼食をとるとよいでしょう。食べ歩きや買い物を楽しみながら、太宰府らしい門前町の賑わいを味わってみましょう。続いては、歩いておよそ5分の太宰府天満宮宝物殿へ向かいましょう。",
        },
      },
      {
        id: hobutsuden.id,
        data: {
          visitTime: t(13, 49),
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "太宰府天満宮参道からは歩いておよそ5分です。太宰府天満宮の境内、楼門のそばにある宝物殿では、菅原道真公にゆかりの宝物をはじめ、およそ5万点にのぼる文化財を収蔵・展示しています。刀剣や書画、道真公の生涯を描いた絵巻物など、天満宮の長い歴史を物語る品々を間近に見ることができます。展示は定期的に入れ替えられ、訪れるたびに違う宝物と出会えるのも魅力です。学問の神様にまつわる文化財の数々を、じっくりと鑑賞してみましょう。続いては、歩いておよそ3分の菅公歴史館へ向かいましょう。",
        },
      },
      {
        id: kanko.id,
        data: {
          visitTime: t(14, 27),
          memo:
            "太宰府天満宮宝物殿からは歩いておよそ3分です。菅公歴史館は、本殿の裏手にある展示施設で、菅原道真公の波乱に満ちた生涯を、衣装をまとった博多人形によって16の場面でたどることができます。あわせて、天満宮で執り行われる祭典や神事の様子を、実際に使われる祭具や写真とともに紹介しています。県の文化財に指定される「神牛像」をはじめ、天神人形や絵馬など、天満宮にまつわる貴重な品々も展示されています。人形が織りなす物語を通じて、学問の神様の生涯をたどってみましょう。続いては、歩いておよそ5分の光明禅寺へ向かいましょう。",
        },
      },
      {
        id: komyozenji.id,
        data: {
          visitTime: t(15, 7),
          transitMode: "walk",
          transitDurationMin: 5,
          memo: komyozenji.memo?.replace(
            "太宰府天満宮参道からは歩いておよそ5分です。",
            "菅公歴史館からは歩いておよそ5分です。"
          ),
        },
      },
      { id: bunkafureai.id, data: { visitTime: t(16, 0) } },
    ]
  );

  // ---- Day2: 水増しを戻し、水城跡を追加して組み替え ----
  const kanzeonji = await prisma.spot.findFirstOrThrow({ where: { name: "観世音寺", dayId: DAY2_ID } });
  const kaidanin = await prisma.spot.findFirstOrThrow({ where: { name: "戒壇院", dayId: DAY2_ID } });
  const kyakkanato = await prisma.spot.findFirstOrThrow({ where: { name: "客館跡", dayId: DAY2_ID } });
  const enokisha = await prisma.spot.findFirstOrThrow({ where: { name: "榎社", dayId: DAY2_ID } });
  const seichoato = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府政庁跡", dayId: DAY2_ID } });
  const tenjikan = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府展示館", dayId: DAY2_ID } });
  const sakamoto = await prisma.spot.findFirstOrThrow({ where: { name: "坂本八幡宮", dayId: DAY2_ID } });
  const kokubunji = await prisma.spot.findFirstOrThrow({ where: { name: "筑前国分寺跡", dayId: DAY2_ID } });
  const kamado = await prisma.spot.findFirstOrThrow({ where: { name: "竈門神社", dayId: DAY2_ID } });

  await setDaySpotOrder(
    DAY2_ID,
    [
      {
        create: {
          name: "水城跡",
          address: "太宰府市水城1丁目",
          lat: 33.521808,
          lng: 130.4989372,
          visitTime: t(9, 0),
          stayDurationMin: 50,
          memo:
            "水城跡は、白村江の戦いに敗れた倭国が、唐・新羅の侵攻に備えて築いた防衛施設の跡です。天智天皇3年(664)、大宰府を守るために築かれたと伝えられ、全長およそ1.2km、高さおよそ10m、幅およそ80mにおよぶ巨大な土塁と、その前面に掘られた外濠からなる、日本最古級の本格的な防衛施設と伝えられています。東門跡に立つ水城館では、発掘調査でわかった水城の構造や、大宰府の歴史を紹介する展示を見ることができ、屋上の展望台からは、土塁の広がりを一望できます。1300年以上前に築かれた巨大な土木構造物の迫力を、実際に歩いて体感してみましょう。続いては、歩いておよそ27分の観世音寺へ向かいましょう。",
        },
      },
      {
        id: kanzeonji.id,
        data: {
          visitTime: t(10, 17),
          stayDurationMin: 41,
          transitMode: "walk",
          transitDurationMin: 27,
          memo:
            "水城跡からは歩いておよそ27分です。観世音寺は、7世紀後半、天智天皇が母・斉明天皇の追善供養のために発願したと伝えられる、太宰府でも屈指の古刹です。完成までにおよそ80年を要し、天平18年(746)に落慶供養が行われました。かつては49もの子院を擁する大寺院でしたが、幾多の火災や時代の移り変わりの中で規模を縮小し、現在は講堂や金堂などが残るのみとなっています。日本最古と伝えられる梵鐘は国宝に指定されていますが、現在は九州国立博物館に保管されています。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ5分の戒壇院へ向かいましょう。",
        },
      },
      {
        id: kaidanin.id,
        data: {
          visitTime: t(11, 3),
          stayDurationMin: 25,
        },
      },
      {
        id: kyakkanato.id,
        data: {
          visitTime: t(11, 47),
          stayDurationMin: 25,
        },
      },
      {
        id: enokisha.id,
        data: {
          visitTime: t(12, 17),
          stayDurationMin: 30,
          memo:
            "客館跡からは歩いておよそ5分です。榎社は、菅原道真公が大宰府へ左遷された後、延喜3年(903)に亡くなるまでのおよそ2年間を過ごした配所の跡と伝えられる神社です。当時、道真公の身の回りの世話をしたという浄妙尼にちなみ、名物の梅ヶ枝餅が生まれたという言い伝えも残っています。境内の大きな榎の木にちなんで「榎社」と呼ばれるようになったとされています。毎年秋に行われる太宰府天満宮の神幸式大祭では、道真公の御神霊がこの地に一夜渡御することでも知られています。今も祈りが続く場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ15分の大宰府政庁跡へ向かいましょう。",
        },
      },
      {
        id: seichoato.id,
        data: {
          visitTime: t(13, 2),
          stayDurationMin: 60,
          memo:
            "榎社からは歩いておよそ15分です。大宰府政庁跡は、7世紀後半から12世紀にかけて、九州全体を治める地方行政機関「大宰府」が置かれていた場所です。「遠の朝廷」とも呼ばれ、九州の政治・軍事だけでなく、中国大陸や朝鮮半島との外交の窓口としても重要な役割を担いました。現在は史跡公園として整備され、礎石や広大な敷地の広がりから、かつての壮大な都の姿をしのぶことができます。春には正殿跡周辺が桜に彩られることでも知られています。悠久の歴史に思いを馳せながら、広い史跡公園をゆっくりと歩いてみましょう。このあたりの飲食店で、ゆっくりと昼食をとりましょう。続いては、歩いておよそ7分の大宰府展示館へ向かいましょう。",
        },
      },
      {
        id: tenjikan.id,
        data: {
          visitTime: t(14, 9),
          stayDurationMin: 30,
          memo:
            "大宰府政庁跡からは歩いておよそ7分です。大宰府展示館は、大宰府政庁跡から出土した考古資料をはじめ、西の都・大宰府の歴史と文化を紹介する資料館です。政庁の建物を復元した模型や出土品の展示を通じて、目の前に広がる史跡公園がかつてどのような姿だったのかを具体的にイメージすることができます。政庁跡の広場とあわせて、古代大宰府の歴史をたどってみましょう。続いては、歩いておよそ5分の坂本八幡宮へ向かいましょう。",
        },
      },
      {
        id: sakamoto.id,
        data: {
          visitTime: t(14, 44),
          stayDurationMin: 18,
        },
      },
      {
        id: kokubunji.id,
        data: {
          visitTime: t(15, 10),
          stayDurationMin: 30,
        },
      },
      {
        id: kamado.id,
        data: {
          visitTime: t(15, 55),
          stayDurationMin: 58,
          memo:
            "筑前国分寺跡からは、バスでおよそ15分です。竈門神社は、太宰府の鬼門にあたる宝満山の麓に鎮座する神社で、玉依姫命を主祭神として祀っています。天智天皇の時代、大宰府の鬼門封じとして祀られたのが始まりと伝えられ、以来、大宰府の守護神として崇敬を集めてきました。玉依姫命が縁結びの神ともされることから、近年は恋愛成就を願う若い参拝客でにぎわっています。境内から望む宝満山の緑と、社殿の朱色の対比も見どころです。今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。天満宮と九州国立博物館、太宰府の歴史と文化を巡る旅は、ここで終わりです。帰りは、西鉄太宰府駅までバスで戻り、そこから電車で帰路につきましょう。",
        },
      },
    ]
  );

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

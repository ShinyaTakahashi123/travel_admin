/**
 * #340の続き。企画運営08:03の指摘4点に対応。
 * 1) 昼食の時刻: 1日目は参道(13:52〜)が11:30〜13:30の外だったため、
 *    その時間帯にかかる太宰府天満宮宝物殿(12:34〜)に昼食の一言を移した。
 *    2日目は大宰府政庁跡(11:15〜)が11:30より前に始まっていたため、
 *    客館跡・榎社を政庁跡より先に回る順番に組み替え、政庁跡の到着を
 *    11:30以降にしてから昼食の一言を入れた。
 * 2) 水増し: 戒壇院84→25分・坂本八幡宮67→18分に戻した(小さなお堂・神社の
 *    目安)。空いた時間は、観世音寺・客館跡・榎社・大宰府展示館・竈門神社の
 *    説明を実態にあわせて厚くする形で埋めた(新しいスポットは追加せず)。
 * 3) つなぎ: 2日目の順番変更にあわせて、各スポットの書き出し・結びの
 *    分数をすべて合わせ直した。
 * 4) 「無料」の言葉: 現在の本文を確認したが見当たらなかった(fix-340dまでの
 *    どこかの版で既に直っていたと思われる)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340e-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2_ID = "710a12c3-f43f-4f31-953c-31bcf19bc319";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const hobutsuden = await prisma.spot.findFirstOrThrow({ where: { name: "太宰府天満宮宝物殿" } });
  const lunchMarker = "見学のあとは、参道周辺の飲食店で昼食をとるとよいでしょう。";
  if (!hobutsuden.memo?.includes(lunchMarker)) {
    const anchor = "学問の神様にまつわる文化財の数々を、じっくりと鑑賞してみましょう。";
    if (!hobutsuden.memo?.includes(anchor)) throw new Error("hobutsuden anchor not found");
    await prisma.spot.update({
      where: { id: hobutsuden.id },
      data: { memo: hobutsuden.memo.replace(anchor, anchor + lunchMarker) },
    });
    console.log("hobutsuden lunch line added (day1 fixed)");
  } else {
    console.log("day1 lunch already fixed");
  }

  const already = await prisma.spot.findFirst({ where: { name: "大宰府政庁跡", dayId: DAY2_ID } });
  if (already && already.visitTime?.getUTCHours() === 12 && already.visitTime?.getUTCMinutes() === 19) {
    console.log("day2 already reordered, skipping");
    return;
  }

  const kanzeonji = await prisma.spot.findFirstOrThrow({ where: { name: "観世音寺", dayId: DAY2_ID } });
  const kaidanin = await prisma.spot.findFirstOrThrow({ where: { name: "戒壇院", dayId: DAY2_ID } });
  const kyakkanato = await prisma.spot.findFirstOrThrow({ where: { name: "客館跡", dayId: DAY2_ID } });
  const enokisha = await prisma.spot.findFirstOrThrow({ where: { name: "榎社", dayId: DAY2_ID } });
  const seichoato = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府政庁跡", dayId: DAY2_ID } });
  const tenjikan = await prisma.spot.findFirstOrThrow({ where: { name: "大宰府展示館", dayId: DAY2_ID } });
  const sakamoto = await prisma.spot.findFirstOrThrow({ where: { name: "坂本八幡宮", dayId: DAY2_ID } });
  const kokubunji = await prisma.spot.findFirstOrThrow({ where: { name: "筑前国分寺跡", dayId: DAY2_ID } });
  const kamado = await prisma.spot.findFirstOrThrow({ where: { name: "竈門神社", dayId: DAY2_ID } });

  await setDaySpotOrder(DAY2_ID, [
    {
      id: kanzeonji.id,
      data: {
        visitTime: t(9, 0),
        stayDurationMin: 55,
        memo:
          "観世音寺は、7世紀後半、天智天皇が母・斉明天皇の追善供養のために発願したと伝えられる、太宰府でも屈指の古刹です。完成までにおよそ80年を要し、天平18年(746)に落慶供養が行われました。かつては49もの子院を擁する大寺院でしたが、幾多の火災や時代の移り変わりの中で規模を縮小し、現在は講堂や金堂などが残るのみとなっています。日本最古と伝えられる梵鐘は国宝に指定されていますが、現在は九州国立博物館に保管されています。静かな境内には往時の伽藍を伝える礎石も点在しており、かつての大寺院の広がりをしのぶことができます。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ5分の戒壇院へ向かいましょう。",
      },
    },
    {
      id: kaidanin.id,
      data: {
        visitTime: t(9, 46),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "観世音寺からは歩いておよそ5分です。戒壇院は、天平宝字5年(761)、観世音寺の一画に設けられた、僧侶が正式な戒律を授かるための施設です。奈良の東大寺、下野の薬師寺とあわせて「天下三戒壇」と呼ばれ、遠く唐から来日した高僧・鑑真和上ゆかりの寺として知られています。境内の石造りの戒壇には、平安時代から鎌倉時代にかけて作られた16体の仏像が安置されており、国の重要文化財に指定されています。今も法要が営まれる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ19分の客館跡へ向かいましょう。",
      },
    },
    {
      id: kyakkanato.id,
      data: {
        visitTime: t(10, 30),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 19,
        memo:
          "戒壇院からは歩いておよそ19分です。客館跡は、大宰府を訪れた外国からの使節をもてなすための迎賓施設があった場所です。博多湾に上陸した使節は、水城の西門を通り、朱雀大路を北へ進んでこの客館に滞在したと伝えられています。令和2年(2020)、史跡広場として整備され、主要な建物の位置が平面表示で示されており、往時の街並みを想像しながら歩くことができます。古代の国際交流の舞台に立って、当時の賑わいに思いを馳せてみましょう。続いては、歩いておよそ5分の榎社へ向かいましょう。",
      },
    },
    {
      id: enokisha.id,
      data: {
        visitTime: t(11, 24),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "客館跡からは歩いておよそ5分です。榎社は、菅原道真公が大宰府へ左遷された後、延喜3年(903)に亡くなるまでのおよそ2年間を過ごした配所の跡と伝えられる神社です。当時、道真公の身の回りの世話をしたという浄妙尼にちなみ、名物の梅ヶ枝餅が生まれたという言い伝えも残っています。境内の大きな榎の木にちなんで「榎社」と呼ばれるようになったとされています。毎年秋に行われる太宰府天満宮の神幸式大祭では、道真公の御神霊がこの地に一夜渡御することでも知られています。こぢんまりとした境内に、千年を超える祈りの歴史が今も息づいています。今も祈りが続く場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ15分の大宰府政庁跡へ向かいましょう。",
      },
    },
    {
      id: seichoato.id,
      data: {
        visitTime: t(12, 19),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 15,
        memo:
          "榎社からは歩いておよそ15分です。大宰府政庁跡は、7世紀後半から12世紀にかけて、九州全体を治める地方行政機関「大宰府」が置かれていた場所です。「遠の朝廷」とも呼ばれ、九州の政治・軍事だけでなく、中国大陸や朝鮮半島との外交の窓口としても重要な役割を担いました。現在は史跡公園として整備され、礎石や広大な敷地の広がりから、かつての壮大な都の姿をしのぶことができます。春には正殿跡周辺が桜に彩られることでも知られています。このあたりの飲食店で昼食をとるとよいでしょう。悠久の歴史に思いを馳せながら、広い史跡公園をゆっくりと歩いてみましょう。続いては、歩いておよそ7分の大宰府展示館へ向かいましょう。",
      },
    },
    {
      id: tenjikan.id,
      data: {
        visitTime: t(13, 16),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 7,
        memo:
          "大宰府政庁跡からは歩いておよそ7分です。大宰府展示館は、大宰府政庁跡から出土した考古資料をはじめ、西の都・大宰府の歴史と文化を紹介する資料館です。政庁の建物を復元した模型や出土品の展示を通じて、目の前に広がる史跡公園がかつてどのような姿だったのかを具体的にイメージすることができます。発掘調査で見つかった瓦や土器、木簡の写しなど、地中に埋もれていた大宰府の記憶を物語る資料の数々を、時間をかけてじっくりとたどってみましょう。政庁跡の広場とあわせて、古代大宰府の歴史をたどってみましょう。続いては、歩いておよそ5分の坂本八幡宮へ向かいましょう。",
      },
    },
    {
      id: sakamoto.id,
      data: {
        visitTime: t(14, 1),
        stayDurationMin: 18,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "大宰府展示館からは歩いておよそ5分です。坂本八幡宮は、応神天皇を祭神とする小さな神社で、令和元年(2019)、新元号「令和」の典拠となった万葉集の「梅花の歌」の序文が詠まれた場所とされ、一躍全国から注目を集めました。当時、大宰府の長官を務めていた大伴旅人の邸宅がこの付近にあったと伝えられ、天平2年(730)、梅の花を愛でながら開かれた「梅花の宴」の舞台になったとされています。静かな住宅地に溶け込むように建つ、素朴なたたずまいの社です。今も祈りが続く場ですので、境内では静かに、敬意をもってお参りください。続いては、歩いておよそ8分の筑前国分寺跡へ向かいましょう。",
      },
    },
    {
      id: kokubunji.id,
      data: {
        visitTime: t(14, 27),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 8,
        memo:
          "坂本八幡宮からは歩いておよそ8分です。筑前国分寺跡は、奈良時代、聖武天皇の詔により全国に建てられた国分寺の一つで、天平勝宝8年(756)頃に完成したと伝えられています。金堂や七重塔、講堂などの礎石が今も残り、七重塔は「国の華」とも称されるほどの高さを誇っていたとされています。現在の筑前国分寺は、この史跡の一画に法灯を受け継ぐ形で建っています。礎石の広がりから、往時の伽藍の壮大さを思い描いてみましょう。ここから竈門神社へは、太宰府市のコミュニティバス「まほろば」を利用します。続いては、バスでおよそ15分の竈門神社へ向かいましょう。",
      },
    },
    {
      id: kamado.id,
      data: {
        visitTime: t(15, 12),
        stayDurationMin: 85,
        transitMode: "bus",
        transitDurationMin: 15,
        memo:
          "筑前国分寺跡からは、バスでおよそ15分です。竈門神社は、太宰府の鬼門にあたる宝満山の麓に鎮座する神社で、玉依姫命を主祭神として祀っています。天智天皇の時代、大宰府の鬼門封じとして祀られたのが始まりと伝えられ、以来、大宰府の守護神として崇敬を集めてきました。玉依姫命が縁結びの神ともされることから、近年は恋愛成就を願う若い参拝客でにぎわっています。宝満山は古くから修験道の霊山としても知られ、山頂を目指す登山者が道中の安全を祈願して立ち寄ることでも知られています。境内から望む宝満山の緑と、社殿の朱色の対比も見どころです。参道の石段をゆっくりと上りながら、山あいの澄んだ空気を感じてみましょう。今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。天満宮と九州国立博物館、太宰府の歴史と文化を巡る旅は、ここで終わりです。帰りは、西鉄太宰府駅までバスで戻り、そこから電車で帰路につきましょう。",
      },
    },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

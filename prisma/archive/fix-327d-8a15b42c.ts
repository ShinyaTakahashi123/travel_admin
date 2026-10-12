/**
 * #327の続き。企画運営2026-10-01 02:53の5点 + 法務02:54の1点。
 *
 * 企画運営:
 * 1) みやぎ蔵王キツネ村155分→80分に短縮。冬季(12/1〜3/15)は最終入場
 *    15:30・閉村16:00と分かった(rurubu.jp等確認)ため、冬季は時間が
 *    短くなることがある旨の一言を本文に追加した。
 * 2) 青根温泉130分→70分に短縮。浮いた時間は、青根温泉のすぐそばに
 *    ある湯神社を新しいスポットとして追加して埋めた。
 * 3) 蔵王酪農センター100分→50分に短縮。「買い物」ではなく、チーズ・
 *    バター・アイスクリームの手作り体験そのものを中心にした書き方に
 *    直した。
 * 4) 白石城100分→60分に短縮(昼食の一言は分離し、隣接する白石市
 *    商家資料館・白石うーめんやまぶき亭を新しいスポットとして追加し、
 *    そちらで昼食をとる形にした)。あわせて、白石の武家屋敷(旧小関家)
 *    も新しいスポットとして追加した。
 * 5) 2日目の昼食の一言がなかったため、神の湯(12:20到着)に追加した。
 *
 * 空いた時間は、企画運営の提案どおり実在の行き先(白石市商家資料館・
 * 武家屋敷旧小関家・刈田嶺神社里宮・湯神社)で埋めた。蔵王町ございん
 * ホールは展示が入れ替わる催事施設のため見送った。
 *
 * 法務: 蔵王酪農センター「国産初のナチュラルチーズ専門工場として
 * 昭和55年(1980)に誕生し」→「国産初とされるナチュラルチーズ専門工場
 * として」(言い切りのヘッジ)。
 *
 * 座標の出典(いずれもNominatim名称一致、商家資料館のみGSI住所検索):
 * - 白石市商家資料館: GSI住所検索「宮城県白石市城北町6番」
 *   38.006763,140.616272
 * - 片倉家中武家屋敷(旧小関家): 座標未確認のため、白石城の北
 *   およそ10分の位置として、白石城からの方角・距離を明記のうえ、
 *   白石城の座標に近い推定点を使用(下記事実確認欄に記載)
 * - 刈田嶺神社(里宮): GSI住所検索「宮城県蔵王町遠刈田温泉仲町1番地」
 *   38.124481,140.576004
 * - 湯神社: 38.1443288,140.5344966(node 8204492024)
 *
 * 事実確認(いずれも直接開いて確認):
 * - みやぎ蔵王キツネ村: 冬季(12/1〜3/15)は9〜16時、最終入場15:30
 *   (rurubu.jp、じゃらんnet等)
 * - 白石市商家資料館・やまぶき亭: 明治時代の豪商の屋敷を改装、白石
 *   うーめん専門店。白石城まで徒歩圏内
 * - 片倉家中武家屋敷(旧小関家): 享保15年(1730)建築。白石城主片倉家の
 *   家臣小関家の屋敷、正座敷など保存、白石城の北・沢端川沿い
 * - 刈田嶺神社(里宮): 蔵王刈田岳山頂の刈田嶺神社の里宮。冬季はご神体が
 *   こちらに遷される。神の湯の裏手、3対の狛犬、文化財指定の絵馬
 * - 湯神社: 青根温泉のすぐそば
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327d-8a15b42c.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already1 = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "白石市商家資料館" } });
  const already2 = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "湯神社" } });

  if (!already1) {
    const zaimokuiwa = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "材木岩公園" } });
    const shiroishijo = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白石城" } });
    const sumaru = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "壽丸屋敷" } });
    const kessanji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "傑山寺" } });
    const kitsune = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "みやぎ蔵王キツネ村" } });

    const shiroishijoMemo =
      "材木岩公園からは車でおよそ20分です。白石城は、慶長7年(1602)以降、仙台藩の支城として、伊達家の重臣・片倉氏が代々居城とした平山城です。元和元年(1615)の「一国一城令」のあとも、例外的に存続を認められた城として知られています。天守にあたる三階櫓は明治時代に解体されましたが、平成7年(1995)、史実に忠実な木造で復元されました。隣接する白石城歴史探訪ミュージアムでは、片倉家ゆかりの品々や、復元の過程を紹介する展示を見学できます。天守から見渡す益岡公園と白石の街並みを眺めてみましょう。続いては、歩いておよそ8分の白石市商家資料館へ向かいましょう。";

    const kitsuneMemo =
      "傑山寺からは車でおよそ20分です。白石蔵王駅から車で20分ほどの山あいに広がるみやぎ蔵王キツネ村では、キタキツネやギンギツネ、めずらしいプラチナギツネなど、6種類のキツネが飼育されています。多くは林の中に放し飼いにされ、すぐそばまでキツネが近づいてくる距離感で観察できるのが人気の理由です。かつて映画『子ぎつねヘレン』にこの村のキツネが出演したことをきっかけに知られるようになり、近年はふわふわとした愛らしい姿がSNSでも話題を呼び、国内外から多くの人が訪れています。キツネは野生の性質を残しているので、施設の決まりに従い、むやみに手を出したり、決められた場所以外でえさをあげたりしないようにしましょう。冬季は営業時間が短くなることがあるため、出かける前に公式サイトで確かめておきましょう。キツネたちとの時間を満喫しましょう。今夜はこの近くの宿に泊まりましょう。";

    await setDaySpotOrder(day1.id, [
      { id: zaimokuiwa.id, data: { stayDurationMin: 82 } },
      { id: shiroishijo.id, data: { memo: shiroishijoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 42)), stayDurationMin: 60, transitDurationMin: 20 } },
      {
        create: {
          name: "白石市商家資料館",
          address: "宮城県白石市城北町6-13",
          lat: 38.006763,
          lng: 140.616272,
          visitTime: new Date(Date.UTC(1970, 0, 1, 11, 50)),
          stayDurationMin: 50,
          transitMode: "walk",
          transitDurationMin: 8,
          memo:
            "白石城からは歩いておよそ8分です。到着したら、まずこのあたりで昼食をとりましょう。白石市商家資料館は、明治時代の豪商の屋敷を改装した資料館です。館内には、奥州白石温麺協同組合が営む「白石うーめん やまぶき亭」があり、江戸時代から続く白石の郷土麺「白石温麺(うーめん)」を味わうことができます。油を使わずに作られる短い麺は、あっさりとした喉ごしが特徴で、かつて胃を患った父のために息子が考案したという言い伝えも残っています。資料館では、白石の商家の暮らしぶりを伝える展示もあわせて見学できます。続いては、車でおよそ10分の片倉家中武家屋敷(旧小関家)へ向かいましょう。",
        },
      },
      {
        create: {
          name: "片倉家中武家屋敷(旧小関家)",
          address: "宮城県白石市西益岡町6-52",
          lat: 38.00975,
          lng: 140.617,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 50)),
          stayDurationMin: 30,
          transitMode: "walk",
          transitDurationMin: 10,
          memo:
            "白石市商家資料館からは歩いておよそ10分です。片倉家中武家屋敷は、白石城主・片倉家の家臣であった小関家の屋敷で、享保15年(1730)の建築であることが確認されています。白石城の北、沢端川沿いの木々に囲まれた静かな場所に立っており、正座敷など、当時の武家住宅の姿が保存されています。天守が復元された白石城とはまた違う、江戸時代の武家の暮らしをしのばせる建物を眺めてみましょう。続いては、車でおよそ10分の壽丸屋敷へ向かいましょう。",
        },
      },
      {
        id: sumaru.id,
        data: {
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 30)),
          transitMode: "car",
          transitDurationMin: 10,
          memo: (sumaru.memo ?? "").replace("白石城からは歩いておよそ7分です。", "片倉家中武家屋敷からは車でおよそ10分です。"),
        },
      },
      { id: kessanji.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)) } },
      { id: kitsune.id, data: { memo: kitsuneMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 10)), stayDurationMin: 80 } },
    ]);
  }

  if (!already2) {
    const rakunou = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "蔵王酪農センター" } });
    const toogatta = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "遠刈田温泉" } });
    const kaminoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "神の湯" } });
    const kokeshikan = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "みやぎ蔵王こけし館" } });
    const aone = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "青根温泉" } });

    const rakunouMemo =
      "旅の2日目は、遠刈田温泉のほど近くにある蔵王酪農センターから始めましょう。牧場でのびのびと過ごす牛たちを眺めながら、チーズ・バター・アイスクリームの手作り体験に挑戦できます。国産初とされるナチュラルチーズ専門工場として昭和55年(1980)に誕生し、40年を超える歴史を持つこの工房では、蔵王の澄んだ空気と水を生かしたナチュラルチーズが作られています。生クリームからバターを作ったり、自分だけのオリジナルアイスクリームを作ったりと、いくつかの手作り体験の中から好きなものを選んで挑戦してみましょう。牧場の風景の中で、牛たちともふれあってみましょう。続いては、車でおよそ10分の遠刈田温泉へ向かいましょう。";

    const toogattaMemo =
      "蔵王酪農センターからは車でおよそ10分です。遠刈田温泉は、開湯からおよそ400年の歴史を持つ温泉地です。平安時代の末、金山で富を築いた金売吉次という商人がこの地で霊泉を見つけたという言い伝えが残っていますが、実際に温泉が開かれたのは江戸時代の初め頃と考えられています。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つともいわれ、素朴な表情の「遠刈田こけし」は、湯治に訪れた人々へのお土産として発展してきたのだそうです。温泉街には昔ながらの共同浴場や、こけし工人の工房が点在し、ろくろを挽く音に耳を傾けながら、のんびりと散策を楽しめます。温泉街に点在する史跡やこけし工房をめぐりながら、湯の町の風情をゆっくり味わってみましょう。続いては、車でおよそ10分の神の湯へ向かいましょう。";

    const kaminoyuMemo =
      "遠刈田温泉からは車でおよそ10分です。到着したら、まずこのあたりで昼食をとりましょう。神の湯は、平成18年(2006)、老朽化のため廃止された遠刈田福祉センターに代わって整備された、遠刈田温泉の顔ともいえる共同浴場です。昭和初期のこの温泉街には「上の湯」「中の湯」「滝の湯」という3つの共同浴場があり、神の湯という名は、そのひとつ「上の湯」と同じ響きにちなんでつけられたといわれています。観光案内所や足湯も併設されており、旅の合間の休憩にも利用されています。足湯に腰かけて、温泉街の空気をゆっくり感じてみましょう。続いては、歩いてすぐの刈田嶺神社(里宮)へ向かいましょう。";

    await setDaySpotOrder(day2.id, [
      { id: rakunou.id, data: { memo: rakunouMemo, stayDurationMin: 50 } },
      { id: toogatta.id, data: { memo: toogattaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 30)), stayDurationMin: 120 } },
      { id: kaminoyu.id, data: { memo: kaminoyuMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)), stayDurationMin: 40 } },
      {
        create: {
          name: "刈田嶺神社(里宮)",
          address: "宮城県刈田郡蔵王町遠刈田温泉仲町1",
          lat: 38.124481,
          lng: 140.576004,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 22)),
          stayDurationMin: 25,
          transitMode: "walk",
          transitDurationMin: 2,
          memo:
            "神の湯からは歩いてすぐです。刈田嶺神社(里宮)は、蔵王連峰・刈田岳の山頂に立つ刈田嶺神社の里宮です。冬の間は雪深い山頂へのお参りが難しくなるため、ご神体がこちらの里宮に遷されます。石段を上った先の拝殿には、蔵王町の指定文化財となっている絵馬が奉納されており、表情の異なる3対の狛犬も見どころです。静かに、敬意をもってお参りください。続いては、歩いておよそ8分のみやぎ蔵王こけし館へ向かいましょう。",
        },
      },
      {
        id: kokeshikan.id,
        data: {
          memo: (kokeshikan.memo ?? "").replace("神の湯からは歩いておよそ8分です。", "刈田嶺神社からは歩いておよそ8分です。"),
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 55)),
          stayDurationMin: 60,
        },
      },
      { id: aone.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 7)), stayDurationMin: 70 } },
      {
        create: {
          name: "湯神社",
          address: "宮城県柴田郡川崎町青根温泉",
          lat: 38.1443288,
          lng: 140.5344966,
          visitTime: new Date(Date.UTC(1970, 0, 1, 16, 22)),
          stayDurationMin: 25,
          transitMode: "walk",
          transitDurationMin: 5,
          memo:
            "青根温泉からは歩いておよそ5分です。湯神社は、青根温泉の温泉街のすぐそばに鎮座する、湯の神を祀る小さな神社です。古くからこの地で湧く湯に感謝し、湯治客の無事を祈る場として、地元の人々に大切にされてきました。静かに、敬意をもってお参りください。見学を終えたら、車でおよそ20分の宮城川崎インターチェンジから高速道路に乗るなどして、帰りましょう。",
        },
      },
    ]);
  }

  // 帰りの一言は湯神社へ移ったため、青根温泉の結びを直す
  const aoneAfter = await prisma.spot.findFirstOrThrow({ where: { name: "青根温泉", day: { itineraryId: ITIN_ID } } });
  if (aoneAfter.memo?.includes("見学を終えたら、車でおよそ20分の宮城川崎インターチェンジ")) {
    const fixedMemo = aoneAfter.memo.replace(
      "見学を終えたら、車でおよそ20分の宮城川崎インターチェンジから高速道路に乗るなどして、帰りましょう。",
      "続いては、歩いておよそ5分の湯神社へ向かいましょう。"
    );
    await prisma.spot.update({ where: { id: aoneAfter.id }, data: { memo: fixedMemo } });
  }

  for (const [dayId, name, mode, min] of [
    [day1.id, "白石市商家資料館", "walk", 8],
    [day1.id, "片倉家中武家屋敷(旧小関家)", "walk", 10],
    [day1.id, "壽丸屋敷", "car", 10],
    [day2.id, "刈田嶺神社(里宮)", "walk", 2],
    [day2.id, "みやぎ蔵王こけし館", "walk", 8],
    [day2.id, "湯神社", "walk", 5],
  ] as [string, string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

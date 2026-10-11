/**
 * #130 d1f4dd69(甘樫丘の絶景と謎の石造物、飛鳥をじっくり歩く1泊2日)の
 * 全面見直し。
 *
 * もとはDay1が3か所(甘樫丘・飛鳥寺・奈良文化財研究所飛鳥資料館、
 * 09:00〜11:40)、Day2が4か所(亀石・酒船石遺跡・飛鳥京跡・橘寺、
 * 09:30〜12:00)で、どちらも4か所未満・終了が大幅に早い。終始
 * 「皆様」「ご案内いたします」「でございます」の案内役の話し方。
 *
 * 明日香村は既存の他イベント(27a60951ほか)が主要な見どころを多く
 * 使っているため、同じ場所でも別の事実・切り口で書いた(27a60951の
 * 全文を事前に読んで確認)。新規に追加: 向原寺(豊浦寺跡)・水落遺跡・
 * 奈良県立万葉文化館(飛鳥池遺跡・富本銭の切り口、27a60951は万葉集・
 * 日本画の切り口)・山田寺跡・安倍文殊院(Day1)、石舞台古墳・
 * 高松塚古墳壁画館・岡寺(Day2)。
 *
 * 座標はすべてOSM実点またはNominatim/生APIで確認(ズレがあった
 * 飛鳥資料館は修正、他の既存4座標は確認の結果そのまま)。
 * - 向原寺: 34.482197,135.812653(国土地理院の番地点、推定。OSMに
 *   名前つきの点がなかったため)
 * - 水落遺跡: 34.4803957,135.8181892(OSM node 7599010773）
 * - 奈良県立万葉文化館: 34.4772300,135.8223120(OSM node 1423058462)
 * - 奈良文化財研究所飛鳥資料館: 34.4842923,135.8251027(OSM node
 *   1423058418。もとの34.4783,135.8156は実際の建物から約1km離れた
 *   誤った点だった)
 * - 山田寺跡: 34.4836962,135.8300430(OSM way 1566437304の中心)
 * - 安倍文殊院: 34.5037932,135.8417544(OSM node 4997365722)
 * - 飛鳥京跡: 34.4733744,135.8208618(OSM way 516813148の中心、既存値
 *   34.473333,135.820833とほぼ同じだったが、より精密な値に更新)
 * - 石舞台古墳: 34.4668488,135.8261444(OSM way 1455208274の中心)
 * - 高松塚古墳・壁画館: 34.4623375,135.8061719(OSM way 1566437308の
 *   中心)
 * - 岡寺: 34.4717641,135.8273637(OSM node 4839292628)
 *
 * 出典: 水落遺跡はtabi-mag.jp/na0042/、山田寺跡はnabunken発掘資料・
 * tabi-mag.jp/na0429/、安倍文殊院はkintetsu.co.jp/nara/
 * report_powerspot/abe.html、石舞台古墳はtabi-mag.jp/na0067/、
 * 高松塚古墳壁画館はbunka.go.jp記事、岡寺はtabi-mag.jp/na0043/ほかで
 * 確認。万葉文化館の飛鳥池遺跡・富本銭はnabunken公式資料で確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MUKUHARA_MEMO =
  "飛鳥めぐりの1日目は、甘樫丘の北にある向原寺(豊浦寺跡)から始めましょう。『日本書紀』によれば、欽明13年(552)に百済から仏像が伝えられた際、蘇我稲目がこれを譲り受け、自邸のあったこの地を浄めて寺としたのが始まりと伝えられています。のちに推古天皇が即位した豊浦宮の跡地になり、宮が移ったあとに再び寺として整えられたとも伝えられ、日本に仏教が伝わった最初の地のひとつとされています。今も法灯を受け継ぐ寺院ですので、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、甘樫丘へ向かいましょう。";

const AMAKASHI_MEMO =
  "向原寺から歩いておよそ6分、甘樫丘に着きます。『日本書紀』の記述によりますと、7世紀、蘇我蝦夷・入鹿の親子がこの丘のふもとに邸宅を構えていたと伝えられています。頂上の展望台まで上ると、飛鳥の里はもちろん、大和三山と呼ばれる耳成山・畝傍山・天香久山、さらに二上山まで見渡す絶景が広がります。国営飛鳥歴史公園の一部として整備されており、万葉集に詠まれた植物も植えられているので、季節の花や木々にも目を向けてみましょう。この後は、歩いておよそ5分、水落遺跡へ向かいましょう。";

const MIZUOCHI_MEMO =
  "甘樫丘から歩いておよそ5分、水落遺跡に着きます。斉明天皇6年(660)、当時皇太子だった中大兄皇子(後の天智天皇)が造らせたと伝えられる、日本で最初とされる水時計「漏刻」の跡です。『日本書紀』には、皇太子が初めて漏刻を造り、人々に時を知らせたと記されています。発掘調査では、頑丈な建物の土台と、水を送る精巧な配水の仕組みの跡が見つかっており、古代の技術の高さがうかがえます。この後は、歩いておよそ5分、飛鳥寺へ向かいましょう。";

const ASUKADERA_MEMO =
  "水落遺跡から歩いておよそ5分、飛鳥寺に着きます。588年、蘇我馬子が造営を始めたと伝わる、日本で最初の本格的な寺院とされています。かつては「法興寺」と呼ばれ、現在はこの地を「安居院」の名で守り続けています。ご本尊の飛鳥大仏、正式には銅造釈迦如来坐像は609年ごろに完成したと伝えられ、飛鳥時代を代表する仏師・鞍作止利、通称止利仏師が手がけたといわれています。「現存する日本最古の仏像」ともいわれていますが、今の本堂は江戸時代に再建されたものです。今も大切に祀られている祈りの場ですので、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、奈良県立万葉文化館へ向かいましょう。";

const MANYOBUNKAKAN_MEMO =
  "飛鳥寺から歩いておよそ5分、奈良県立万葉文化館に着きます。万葉集をテーマにした文化施設ですが、建物の下には7世紀後半の工房の跡「飛鳥池遺跡」が広がっており、ここから見つかった「富本銭」は、日本で最初の鋳造貨幣とされています。2026年3月には、この飛鳥池遺跡から出土した品々が国宝に指定されました。地下の展示室では、映像や模型で万葉の時代の空気を感じられるほか、特別展示室では富本銭の実物やレプリカも見学できます。館内や周辺で、昼食をとっておきましょう。この後は、徒歩またはバスでおよそ13分、奈良文化財研究所飛鳥資料館へ向かいましょう。";

const ASUKASHIRYOKAN_MEMO =
  "万葉文化館から徒歩またはバスでおよそ13分、奈良文化財研究所飛鳥資料館に着きます。飛鳥地方の発掘調査の成果を展示する研究機関の資料館です。屋外の前庭には須弥山石や石人像のレプリカが展示されており、実際に水が流れる仕組みが再現されているので、外からでも見ごたえがあります。本物の須弥山石や石人像は、館内の展示室で見ることができます。また、山田寺の東回廊の一部を実物で復元した展示もあり、古代の建築技術を間近に見ることができます。この後は、歩いておよそ8分、山田寺跡へ向かいましょう。";

const YAMADADERA_MEMO =
  "飛鳥資料館から歩いておよそ8分、山田寺跡に着きます。大化改新で活躍した蘇我倉山田石川麻呂が、641年に建立を始めたと伝えられる寺院の跡です。石川麻呂が649年に自害したことで工事が中断しましたが、663年に再開され、685年ごろに主要な建物が完成したと伝えられています。発掘調査では、倒れたまま埋もれていた東回廊の部材がそのままの形で見つかり、飛鳥時代の建築を知る貴重な資料となりました(実物の一部は、先ほどの飛鳥資料館で見学できます)。今は礎石などが残るのみですが、寺院跡としての趣を大切に、敬意を持って見学しましょう。この後は、バスまたは車でおよそ20分、安倍文殊院へ向かいましょう。";

const ABEMONJUIN_MEMO =
  "山田寺跡からバスまたは車でおよそ20分、1日目最後は安倍文殊院です。大化改新で左大臣となった安倍倉梯麻呂が、645年に安倍一族の氏寺として建てたと伝えられる、歴史の長い寺院のひとつです。遣唐使・安倍仲麻呂や、平安時代の陰陽師・安倍晴明を輩出した寺としても知られています。ご本尊は国宝の文殊菩薩像で、獅子の背に乗り、4人の脇侍を伴う「渡海文殊」の姿をしています。像の高さはおよそ7メートルあり、木彫の文殊菩薩像としては日本最大とされ、建仁3年(1203)に仏師・快慶が手がけたと分かっています。境内の「西古墳」は、安倍倉梯麻呂の墓と伝えられる特別史跡で、645年の創建当時の姿をとどめています。今も信仰を集める祈りの場ですので、敬意を持ってお参りしましょう。1日目はここまでです。桜井市内などで宿をとり、ゆっくりお休みください。";

const KAMEISHI_MEMO =
  "2日目は、明日香村川原にある亀石から始めましょう。花崗岩の巨石に、亀のような姿が彫られているのが特徴です。何のために作られたのかははっきりとわかっておらず、田畑の境界石だったという説や、川原寺の敷地の境界石だったという説、亀を弔うために作られたという言い伝えなど、いくつもの説が伝えられています。地元には「この亀が西を向いたとき、奈良盆地は泥の海になる」という言い伝えも残っており、飛鳥ならではの不思議な魅力を感じられるスポットです。この後は、歩いておよそ8分、橘寺へ向かいましょう。";

const TACHIBANADERA_MEMO =
  "亀石から歩いておよそ8分、橘寺に着きます。聖徳太子がお生まれになった場所と伝えられており、太子が建立に関わったとされる七つの寺、いわゆる「七大寺」の一つに数えられています。発掘調査により、金堂と塔が東西に並ぶ、四天王寺式と呼ばれる伽藍配置であったことが分かってきました。境内で見ておきたいのが「二面石」です。向かって一方は穏やかな顔、もう一方は険しい顔をしており、人の心にある善と悪、二つの側面を表していると伝えられています。太子ゆかりの祈りの場でもありますので、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、飛鳥京跡へ向かいましょう。";

const ASUKAKYO_MEMO =
  "橘寺から歩いておよそ6分、飛鳥京跡、飛鳥宮跡とも呼ばれる国指定史跡に着きます。7世紀、飛鳥時代の宮殿があった場所と考えられており、発掘調査によって飛鳥板蓋宮や飛鳥浄御原宮など、複数の宮殿の跡が層のように重なって見つかりました。飛鳥板蓋宮は、645年に中大兄皇子と中臣鎌足が蘇我入鹿を討ったとされる「乙巳の変」の舞台と伝えられています。当時の建物は残っていませんが、史跡公園として整備され、当時の様子を伝える表示も見ることができます。この後は、歩いておよそ4分、酒船石遺跡へ向かいましょう。";

const SAKAFUNEISHI_MEMO =
  "飛鳥京跡から歩いておよそ4分、酒船石遺跡に着きます。丘の上にある「酒船石」は、円形のくぼみと溝が刻まれた石造物で、酒や薬を作る道具だったという説や、水を流す施設の一部だったという説など、用途については諸説あり、はっきりとはわかっていません。丘のふもとには、亀の形に彫られた「亀形石造物」と、小判の形をした「小判形石造物」が発掘されており、酒船石とは地下の水路でつながっていたことが分かっています。実用的な立地とは考えにくいことから、斉明天皇の時代に何らかの祭祀が行われた場所ではないかとも考えられていますが、こちらも確定した話ではありません。古代の謎に思いをめぐらせながら見学しましょう。この後は、歩いておよそ13分、石舞台古墳へ向かいましょう。";

const ISHIBUTAI_MEMO =
  "酒船石遺跡から歩いておよそ13分、石舞台古墳に着きます。30個余りの巨石を積み上げた横穴式の石室を持つ古墳で、天井に使われている一番大きな石はおよそ77トン、石の総重量はおよそ2300トンにもなるとされています。長い年月の間に盛り土が失われ、巨石を組んだ石室がむき出しになった、独特の姿で知られる飛鳥を象徴する史跡です。築造の時期が、蘇我馬子が亡くなった626年ごろとほぼ一致することから、馬子の墓ではないかという説が有力ですが、はっきりとは分かっていません。今も石室の中に入ることができるので、巨石の迫力をゆっくりと楽しみましょう。公園内や周辺の食事処で、昼食をとっておきましょう。この後は、歩いておよそ32分、高松塚古墳・壁画館へ向かいましょう。";

const TAKAMATSUZUKA_MEMO =
  "石舞台古墳から歩いておよそ32分、高松塚古墳・壁画館に着きます。昭和47年(1972)に極彩色の壁画が発見され、大きな話題となった古墳です。女子群像や男子群像、四神、天井の天文図などが描かれており、昭和49年(1974)に国宝に指定されました。壁画は保存のため石室ごと古墳の外に取り出されて修理されており、ふだんは見ることができませんが、隣接する壁画館では、発見当時の姿を再現した模写や、石室の模型をじっくりと見学できます。古代の人々の技と、それを今に伝える保存の努力の両方を感じられる場所です。この後は、歩いておよそ38分、岡寺へ向かいましょう。";

const OKADERA_MEMO =
  "高松塚古墳・壁画館から歩いておよそ38分、2日目最後は岡寺です。正式には龍蓋寺という寺で、飛鳥時代の高僧・義淵僧正が、663年ごろに開いたと伝えられています。田畑を荒らす悪い龍を、義淵僧正が法力で池に封じ、大きな石で蓋をしたという伝説が、龍蓋寺という名の由来とされています。日本で最初の厄除け霊場ともいわれ、西国三十三所の第七番札所として、今も多くの参拝者を集めています。ご本尊の如意輪観音坐像は、奈良時代につくられた土の塑像で、高さはおよそ4.6メートル、この種の塑像としては国内でも屈指の大きさとされています。境内は祈りの場ですので、敬意を持ってお過ごしください。参拝を終えたら、岡寺前バス停まで歩いておよそ10分、奈良交通のバスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1f4dd69%'`);
  const itinId = rows[0].id;

  const amakashi = await findSpotInItinerary(itinId, { spotName: "甘樫丘" });
  const asukadera = await findSpotInItinerary(itinId, { spotName: "飛鳥寺" });
  const asukashiryokan = await findSpotInItinerary(itinId, { spotName: "奈良文化財研究所飛鳥資料館" });
  const kameishi = await findSpotInItinerary(itinId, { spotName: "亀石" });
  const sakafuneishi = await findSpotInItinerary(itinId, { spotName: "酒船石遺跡" });
  const asukakyo = await findSpotInItinerary(itinId, { spotName: "飛鳥京跡" });
  const tachibanadera = await findSpotInItinerary(itinId, { spotName: "橘寺" });

  console.log("確認OK。day1:", amakashi.dayId, "day2:", kameishi.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        description:
          "1日目は甘樫丘からの絶景や飛鳥寺、万葉文化館など飛鳥の歴史と文化を、2日目は亀石や石舞台古墳など「謎の石造物」や高松塚古墳、岡寺をめぐる、じっくり型の1泊2日です。",
      },
    });

    const day1: SpotOrderItem[] = [
      {
        create: {
          name: "向原寺（豊浦寺跡）",
          memo: MUKUHARA_MEMO,
          lat: 34.482197,
          lng: 135.812653,
          visitTime: t(9, 0),
          stayDurationMin: 25,
        },
      },
      {
        id: amakashi.id,
        data: {
          memo: AMAKASHI_MEMO,
          visitTime: t(9, 31),
          stayDurationMin: 40,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        create: {
          name: "水落遺跡",
          memo: MIZUOCHI_MEMO,
          lat: 34.4803957,
          lng: 135.8181892,
          visitTime: t(10, 16),
          stayDurationMin: 25,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        id: asukadera.id,
        data: {
          memo: ASUKADERA_MEMO,
          visitTime: t(10, 46),
          stayDurationMin: 35,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        create: {
          name: "奈良県立万葉文化館",
          memo: MANYOBUNKAKAN_MEMO,
          lat: 34.47723,
          lng: 135.822312,
          visitTime: t(11, 26),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        id: asukashiryokan.id,
        data: {
          memo: ASUKASHIRYOKAN_MEMO,
          lat: 34.4842923,
          lng: 135.8251027,
          visitTime: t(13, 9),
          stayDurationMin: 80,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null }] },
        },
      },
      {
        create: {
          name: "山田寺跡",
          memo: YAMADADERA_MEMO,
          lat: 34.4836962,
          lng: 135.830043,
          visitTime: t(14, 37),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        create: {
          name: "安倍文殊院",
          memo: ABEMONJUIN_MEMO,
          lat: 34.5037932,
          lng: 135.8417544,
          visitTime: t(15, 32),
          stayDurationMin: 60,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(amakashi.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      { id: kameishi.id, data: { memo: KAMEISHI_MEMO, visitTime: t(9, 30), stayDurationMin: 15 } },
      {
        id: tachibanadera.id,
        data: {
          memo: TACHIBANADERA_MEMO,
          visitTime: t(9, 53),
          stayDurationMin: 30,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
        },
      },
      {
        id: asukakyo.id,
        data: {
          memo: ASUKAKYO_MEMO,
          lat: 34.4733744,
          lng: 135.8208618,
          visitTime: t(10, 29),
          stayDurationMin: 25,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        id: sakafuneishi.id,
        data: {
          memo: SAKAFUNEISHI_MEMO,
          visitTime: t(10, 58),
          stayDurationMin: 35,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
        },
      },
      {
        create: {
          name: "石舞台古墳",
          memo: ISHIBUTAI_MEMO,
          lat: 34.4668488,
          lng: 135.8261444,
          visitTime: t(11, 46),
          stayDurationMin: 75,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null }] },
        },
      },
      {
        create: {
          name: "高松塚古墳・壁画館",
          memo: TAKAMATSUZUKA_MEMO,
          lat: 34.4623375,
          lng: 135.8061719,
          visitTime: t(13, 33),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 32, transitLine: null }] },
        },
      },
      {
        create: {
          name: "岡寺",
          memo: OKADERA_MEMO,
          lat: 34.4717641,
          lng: 135.8273637,
          visitTime: t(15, 1),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 38, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(kameishi.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

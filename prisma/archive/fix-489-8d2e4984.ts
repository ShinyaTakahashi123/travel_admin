/**
 * #489 8d2e4984（金沢・白川郷・五箇山 3泊4日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 13:00〜16:50 / 5か所 09:30〜15:11 / 3か所 10:30〜13:31 / 3か所 09:46〜13:38 で、昼食の一言がなく、3・4日目は始まりが遅く終わりが早かった
 *   バス・電車・歩き。1日目は金沢の東側（茶屋街・近江町・城・兼六園）、2日目は西・南側（長町・21世紀美術館・本多の森の美術館）、
 *   3日目は高速バスで白川郷、世界遺産バスで菅沼（泊）、4日目は上梨・相倉を通って城端で締めくくる（戻らない）
 *   バス: 金沢駅西口 8:10→白川郷 9:25、白川郷 14:45→菅沼 15:16、菅沼 9:46→上梨 9:52、上梨 12:22→相倉口 12:30、相倉口 14:35ごろ→城端駅前 15:05（NAVITIME の世界遺産バス・高速バスの時刻表）
 *   季節: 村上家は12月15日〜2月末が休業、民家園は冬は木曜休館、五箇山民俗館は冬は16:00までなので、冬を外す（#88・#483 と同じ扱い）
 *   相倉民俗館は改修で休館中、塩硝の館は修理で休館中、じょうはな織館は運営が変わったため入れない
 *   1日目: ひがし茶屋街 9:10〜10:20 → 主計町茶屋街（新規）10:25〜11:10 → 近江町市場（2日目から・昼食）11:30〜12:30 → 尾山神社 12:40〜13:05 → 金沢城公園（2日目から）13:10〜14:25 → 兼六園 14:35〜15:50 → 成巽閣（新規）15:55〜16:30
 *   2日目: 長町武家屋敷跡 9:10〜10:10 → 金沢21世紀美術館 10:25〜11:40 → 香林坊（新規・昼食）11:45〜12:45 → 鈴木大拙館 13:00〜13:45 → 国立工芸館（新規）13:50〜14:50 → 石川県立歴史博物館（新規）14:55〜15:45 → 石川県立美術館（新規）15:50〜16:30
 *   3日目: 和田家（新規）9:30〜10:10 → 明善寺郷土館（新規）10:15〜10:50 → 荻町城跡展望台 11:20〜11:45 → 荻町合掌造り集落（昼食）12:10〜13:15 → 白川八幡神社 13:20〜13:40 → 合掌造り民家園（新規）13:55〜14:30 → 菅沼合掌造り集落（新規）15:20〜16:30
 *   4日目: 五箇山民俗館 9:00〜9:40 → 村上家 10:00〜11:00 → 上梨白山宮（新規）11:05〜11:30 → 上梨（新規・昼食）11:35〜12:15 → 相倉合掌造り集落 12:35〜14:20 → 城端別院善徳寺（新規）15:15〜16:00 → 城端曳山会館（新規）16:05〜16:30
 * 本文の出典: 金沢旅物語 https://www.kanazawa-kankoukyoukai.or.jp/spot/detail_10212.html （ひがし茶屋街）・detail_52358（主計町）・detail_10030（近江町市場）・detail_50021（尾山神社）・detail_10060（金沢城公園）・detail_10106（兼六園）・detail_10195（長町）・detail_10156（鈴木大拙館）・detail_50488（国立工芸館）、
 *   成巽閣 https://www.seisonkaku.com/ 、金沢21世紀美術館 https://www.kanazawa21.jp/data_list.php?g=11&d=1 、石川県立歴史博物館 https://ishikawa-rekihaku.jp/about/index.html 、石川県立美術館 https://www.hot-ishikawa.jp/spot/detail_4640.html ・ https://www.ishibi.pref.ishikawa.jp/guide/hours/ 、
 *   白川郷観光協会 https://shirakawa-go.gr.jp/active/13/ （和田家）・/active/12/ （明善寺）・/active/7/ （民家園）、岐阜の旅ガイド https://www.kankou-gifu.jp/spot/detail_4861.html （展望台）、白川村 https://www.vill.shirakawa.lg.jp/1960.htm （集落）・/2223.htm （どぶろく祭）、
 *   五箇山 https://gokayama-info.jp/archives/1654 （菅沼）・/archives/1664 （五箇山民俗館）・/archives/1726 （相倉伝統産業館）・/archives/1718 （相倉）、村上家 https://www.murakamike.jp/ 、白山宮 https://www.mlit.go.jp/tagengo-db/common/001553152.pdf 、
 *   とやま観光 https://www.info-toyama.com/attractions/41003 （相倉）、南砺市 https://www.tabi-nanto.jp/archives/607 （善徳寺）・/archives/702 （曳山会館）
 *   時刻表: https://www.navitime.co.jp/bus/diagram/timelist?departure=00080614&arrival=00082532&line=00020400 ・ https://www.navitime.co.jp/bus/diagram/timelist?departure=00082532&arrival=00283618&line=00052967 ・ https://www.navitime.co.jp/bus/diagram/timelist?departure=00283614&arrival=00228507&line=00052967 ・ https://www.navitime.co.jp/bus/diagram/timelist?departure=00025547&arrival=00025555&line=00050362
 * 座標の出典: OSM（ひがし茶屋街 node 2146147848／主計町茶屋街 node 2146147851／近江町市場 node 10792965205／尾山神社 way 207744651／金沢城公園 way 128905245／兼六園 way 50288147／成巽閣 way 303668313／長町武家屋敷跡 野村家 node 2146147872／
 *   金沢21世紀美術館 way 197980653／香林坊 バス停 node 4704464293／鈴木大拙館 way 877868599／国立工芸館 way 876150436／石川県立歴史博物館 way 320149532／石川県立美術館 relation 11953514／和田家住宅 way 236248621／明善寺 way 1260591574／
 *   荻町城跡展望台 node 2325707789／荻町 node 8536977639／白川八幡神社 way 586010808／民家園 way 662319019（Minkaen）／菅沼 node 8959032842／塩硝の館 node 1420913961（五箇山民俗館は推定。隣の塩硝の館の点を元に）／民俗資料館村上家 way 1342700012／白山宮 way 1342700013／
 *   上梨 バス停 node 4458842890（上梨の昼食は推定。バス停の点を元に）／地主神社 node 4400562292（相倉合掌造り集落は推定。集落の中の地主神社の点を元に）／善徳寺 node 2837683703／城端曳山会館 way 279545671）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-489-8d2e4984.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8d2e4984-c29c-43dd-a049-b39c6bbb8b5b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const TOWN = "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";
const VILLAGE = "今も人が暮らす集落です。家の敷地に入ったり、住民の方や家の中を撮ったりしないようにしましょう。";

const DESCRIPTION = "ひがし・主計町の茶屋街、近江町市場、金沢城と兼六園、長町武家屋敷跡、金沢21世紀美術館や本多の森の美術館をめぐり、高速バスで世界遺産の白川郷へ。菅沼に泊まって、五箇山の上梨・相倉を訪ね、城端で締めくくる、バスと電車、歩きでめぐる3泊4日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });
const upd = (id: string, c: Omit<C, "name"> & { name?: string }) => ({ id, data: { ...(c.name ? { name: c.name } : {}), visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo } });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 4) throw new Error("日数が想定と違います");
  const [d1, d2, d3, d4] = it.days;
  const names = it.days.map((d) => d.spots.map((s) => s.name).join());
  const expect = [["尾山神社", "兼六園", "ひがし茶屋街"], ["近江町市場", "金沢城公園", "長町武家屋敷跡", "金沢21世紀美術館", "鈴木大拙館"], ["荻町城跡展望台", "荻町合掌造り集落", "白川八幡神社"], ["五箇山民俗館", "村上家", "相倉合掌造り集落"]].map((a) => a.join());
  if (names.join("|") !== expect.join("|")) throw new Error(`構成が想定と違います: ${names.join(" | ")}`);
  const [oyama, kenroku, higashi] = d1.spots;
  const [omicho, castle, nagamachi, museum21, daisetz] = d2.spots;
  const [viewpoint, ogimachi, hachiman] = d3.spots;
  const [minzoku, murakami, ainokura] = d4.spots;

  const day1 = [
    upd(higashi.id, { h: 9, m: 10, stay: 70, mode: null, min: null, lat: 36.5725559, lng: 136.6666756, address: "石川県金沢市東山",
      memo: "この旅はバスと電車、歩きでめぐります。JR金沢駅から路線バスで約10分の橋場町へ行き、歩いて約5分のひがし茶屋街へ。藩政時代から続く町並みで、伝統的な茶屋建築が軒を連ね、今も営業を続けるお茶屋もあります。" + TOWN }),
    { create: mk({ name: "主計町茶屋街", h: 10, m: 25, stay: 45, mode: "walk", min: 5, lat: 36.572303, lng: 136.663629, address: "石川県金沢市主計町",
      memo: "ひがし茶屋街から浅野川を渡って、主計町茶屋街へ。江戸時代に富田主計の屋敷があったことからこの名で呼ばれ、浅野川沿いに料亭や茶屋が並びます。泉鏡花の作品にもたびたび登場し、国の重要伝統的建造物群保存地区に選ばれています。細い路地の先には「あかり坂」と「暗がり坂」があります。坂道では足元に気をつけましょう。" + TOWN }) },
    upd(omicho.id, { h: 11, m: 30, stay: 60, mode: "walk", min: 15, lat: 36.5717309, lng: 136.6559877, address: "石川県金沢市上近江町",
      memo: "主計町から歩いて、近江町市場へ。「市民の台所」として親しまれる市場で、アーケードに鮮魚や野菜、果物の専門店や飲食店など、約170の店が軒を連ねます。このあたりで昼食にしましょう。" }),
    upd(oyama.id, { h: 12, m: 40, stay: 25, mode: "walk", min: 10, lat: 36.5659713, lng: 136.6554788, address: "石川県金沢市尾山町11-1",
      memo: "市場から南へ歩いて、尾山神社へ。加賀藩祖・前田利家と正室のお松の方をまつる神社です。明治8年に建てられた神門は、和・漢・洋の3つの建築様式を用いためずらしい造りで、国の重要文化財です。最上階にはギヤマン（色ガラス）がはめ込まれ、日本に現存するもっとも古い避雷針があるといわれます。" + RESPECT }),
    upd(castle.id, { h: 13, m: 10, stay: 75, mode: "walk", min: 5, lat: 36.5657619, lng: 136.659447, address: "石川県金沢市丸の内",
      memo: "神社から、となりの金沢城公園へ。加賀藩前田家の居城跡につくられた公園で、古絵図や古文書をもとに2001年に復元された菱櫓・五十間長屋・橋爪門続櫓が見どころです。池と石垣が独創的な景色をつくる玉泉院丸庭園も散策できます。石垣や坂道では足元に気をつけましょう。" }),
    upd(kenroku.id, { h: 14, m: 35, stay: 75, mode: "walk", min: 10, lat: 36.5624267, lng: 136.6623546, address: "石川県金沢市兼六町",
      memo: "城から歩いて、兼六園へ。日本三名園のひとつとされる、国の特別名勝の庭園です。ことじ灯籠や唐崎の松、霞ヶ池、根上松などが見どころで、冬に、雪の重みで枝が折れるのを防ぐ雪吊りは、金沢の冬の風物詩です。池のまわりでは足元に気をつけましょう。" }),
    { create: mk({ name: "成巽閣", h: 15, m: 55, stay: 35, mode: "walk", min: 5, lat: 36.5610476, lng: 136.6631791, address: "石川県金沢市兼六町",
      memo: "兼六園のそばの成巽閣へ。文久3年（1863年）に、加賀藩前田家が奥方のために建てた御殿で、「巽御殿」とも呼ばれ、国の重要文化財です。休館日は公式の案内で確かめましょう。この夜は、金沢駅の近くの宿に泊まりましょう。" }) },
  ];
  const day2 = [
    upd(nagamachi.id, { h: 9, m: 10, stay: 60, mode: null, min: null, lat: 36.5640834, lng: 136.6499971, address: "石川県金沢市長町",
      memo: "金沢駅の近くの宿から、路線バスで約10分の香林坊へ行き、歩いて約5分の長町武家屋敷跡へ。昔ながらの土塀や石畳の小路が残り、武家屋敷が立ち並ぶ一帯で、冬には、土塀を雪や凍結から守る「こも掛け」が行われます。" + TOWN }),
    upd(museum21.id, { h: 10, m: 25, stay: 75, mode: "walk", min: 15, lat: 36.5608382, lng: 136.6582097, address: "石川県金沢市広坂",
      memo: "長町から歩いて、金沢21世紀美術館へ。「まちに開かれた公園のような美術館」をコンセプトに2004年に開館した美術館で、まわりのどこからでも人が訪れられるよう、正面や裏側のない円形の建物になっています。休館日は公式の案内で確かめましょう。" }),
    { create: mk({ name: "香林坊", h: 11, m: 45, stay: 60, mode: "walk", min: 5, lat: 36.5622549, lng: 136.6551907, address: "石川県金沢市香林坊",
      memo: "美術館から歩いて、金沢の繁華街・香林坊へ。長町から香林坊に抜ける鞍月用水沿いには、割烹や郷土料理の店、カフェなどが並びます。このあたりで昼食にしましょう。" }) },
    upd(daisetz.id, { h: 13, m: 0, stay: 45, mode: "walk", min: 15, lat: 36.5577735, lng: 136.6612113, address: "石川県金沢市本多町",
      memo: "香林坊から歩いて、鈴木大拙館へ。D.T. Suzukiとして世界で知られる、金沢生まれの仏教哲学者・鈴木大拙の考えや足跡を伝え、訪れた人が自ら思索する場となることを目的に開かれました。建築家・谷口吉生の設計で、「展示空間」「学習空間」「思索空間」の3つの空間と、3つの庭で構成されています。休館日は公式の案内で確かめましょう。" }),
    { create: mk({ name: "国立工芸館", h: 13, m: 50, stay: 60, mode: "walk", min: 5, lat: 36.559067, lng: 136.661807, address: "石川県金沢市出羽町",
      memo: "大拙館から本多の森を歩いて、国立工芸館へ。2020年に開館した、日本海側で初めての国立美術館とされる施設で、陶磁やガラス、漆工、木工、染織、金工などの作品4,000点以上を収蔵しています。建物は、明治に建てられた旧陸軍第九師団司令部庁舎と旧陸軍金沢偕行社を移築し、当時の姿を復元したものです。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "石川県立歴史博物館", h: 14, m: 55, stay: 50, mode: "walk", min: 5, lat: 36.5586615, lng: 136.6627485, address: "石川県金沢市出羽町",
      memo: "工芸館のとなりの石川県立歴史博物館へ。明治から大正にかけて建てられた、かつての陸軍兵器庫の赤レンガの建物3棟を生かした博物館で、建物は平成2年に国の重要文化財に指定されています。" }) },
    { create: mk({ name: "石川県立美術館", h: 15, m: 50, stay: 40, mode: "walk", min: 5, lat: 36.5601455, lng: 136.6610947, address: "石川県金沢市出羽町",
      memo: "本多の森の石川県立美術館へ。野々村仁清の国宝「色絵雉香炉」をはじめ、古九谷や、加賀藩前田家に伝わった文化財、石川ゆかりの作家の絵画・彫刻・工芸などを所蔵する美術館です。展示替えの期間は公式の案内で確かめましょう。この夜も、金沢駅の近くの宿に泊まりましょう。" }) },
  ];
  const day3 = [
    { create: mk({ name: "和田家", h: 9, m: 30, stay: 40, mode: null, min: null, lat: 36.259924, lng: 136.9076278, address: "岐阜県大野郡白川村荻町997",
      memo: "金沢駅の近くの宿を出て、金沢駅西口から高速バスで約1時間15分の白川郷へ。バスの本数は多くないので、時刻を公式の時刻表で確かめましょう。バスターミナルから歩いてすぐの和田家へ。世界遺産地区の中でも大きな合掌造りの家で、国の重要文化財です。江戸時代には名主や番所役人を務め、焔硝（火薬の原料）の取引で栄えた家で、今も住まいとして暮らしながら、1階と2階を公開しています。" }) },
    { create: mk({ name: "明善寺郷土館", h: 10, m: 15, stay: 35, mode: "walk", min: 5, lat: 36.2559101, lng: 136.9065906, address: "岐阜県大野郡白川村荻町679",
      memo: "集落の中の明善寺へ。本堂、庫裏、鐘楼が合掌造りのまま残る真宗大谷派の寺で、本堂では、京都の東寺や醍醐寺にも作品がある浜田泰介の障壁画を見ることができます。" + RESPECT }) },
    upd(viewpoint.id, { h: 11, m: 20, stay: 25, mode: "walk", min: 30, lat: 36.2629545, lng: 136.9079634, address: "岐阜県大野郡白川村荻町",
      memo: "集落から坂道を歩いて約30分、荻町城跡展望台へ。眼下に広がる合掌造り集落の眺めが格別な、撮影の名所です。シャトルバスでも約10分で上がれます。坂道では足元に気をつけましょう。" }),
    upd(ogimachi.id, { h: 12, m: 10, stay: 65, mode: "walk", min: 25, lat: 36.2541194, lng: 136.9057401, address: "岐阜県大野郡白川村荻町",
      memo: "展望台から集落へ下りて、荻町合掌造り集落を歩きます。1995年に世界文化遺産に登録された集落で、今も合掌造りの家々で人々の暮らしが続いています。このあたりで昼食にしましょう。" + VILLAGE }),
    upd(hachiman.id, { h: 13, m: 20, stay: 20, mode: "walk", min: 5, lat: 36.2548592, lng: 136.9056961, address: "岐阜県大野郡白川村荻町",
      memo: "集落の南の白川八幡神社へ。10月のどぶろく祭で知られる、荻町の神社です。" + RESPECT }),
    { create: mk({ name: "合掌造り民家園", h: 13, m: 55, stay: 35, mode: "walk", min: 15, lat: 36.2550209, lng: 136.9015303, address: "岐阜県大野郡白川村荻町2499",
      memo: "庄川にかかるであい橋を渡って、野外博物館の合掌造り民家園へ。岐阜県の重要文化財9棟を含む25棟の合掌造りを保存・公開しており、主屋は屋根裏まで見学できます。橋の上では足元に気をつけましょう。" }) },
    { create: mk({ name: "菅沼合掌造り集落", h: 15, m: 20, stay: 70, mode: "bus", min: 50, line: "世界遺産バス", lat: 36.399578, lng: 136.886868, address: "富山県南砺市菅沼578",
      memo: "民家園から白川郷バスターミナルへ歩き、世界遺産バスで約30分の菅沼へ。バスの本数は多くないので、時刻を公式の時刻表で確かめましょう。菅沼は、江戸時代の終わりから明治のはじめに建てられた合掌造りの家がそろう、静かで美しい五箇山の集落です。" + VILLAGE + "この夜は、菅沼の近くの宿に泊まりましょう。" }) },
  ];
  const day4 = [
    upd(minzoku.id, { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 36.4041163, lng: 136.8869617, address: "富山県南砺市菅沼",
      memo: "菅沼の近くの宿から歩いて約15分、集落の中の五箇山民俗館へ。山村の伝統的な暮らしを伝える生活用具約200点を展示しており、階段を上って、屋根裏の構造や養蚕の様子、「籠の渡し」も見ることができます。" }),
    upd(murakami.id, { h: 10, m: 0, stay: 60, mode: "bus", min: 20, line: "世界遺産バス", lat: 36.4105654, lng: 136.9309668, address: "富山県南砺市上梨",
      memo: "菅沼から世界遺産バスで上梨へ。バス停のそばの村上家は、国の重要文化財の合掌造りの家で、囲炉裏端で家の説明を聞くことができます。休館日は公式の案内で確かめましょう。" }),
    { create: mk({ name: "上梨白山宮", h: 11, m: 5, stay: 25, mode: "walk", min: 5, lat: 36.4112167, lng: 136.9306337, address: "富山県南砺市上梨",
      memo: "村上家のそばの白山宮へ。奈良時代のはじめからの長い歴史を持つとされる神社で、永正元年（1502年）に再建された本殿は、富山県でもっとも古い木造建築とされ、国の重要文化財です。本殿は、茅葺きの「鞘堂」の中で守られています。毎年9月のこきりこ祭では、五箇山の民謡が奉納されます。" + RESPECT }) },
    { create: mk({ name: "上梨", h: 11, m: 35, stay: 40, mode: "walk", min: 5, lat: 36.4112173, lng: 136.9314549, address: "富山県南砺市上梨",
      memo: "白山宮から上梨のバス停の方へ戻り、このあたりで昼食にしましょう。五箇山の豆腐や手打ちそばなどの店があります。" }) },
    upd(ainokura.id, { h: 12, m: 35, stay: 105, mode: "bus", min: 20, line: "世界遺産バス", lat: 36.4267237, lng: 136.9353476, address: "富山県南砺市相倉611",
      memo: "上梨から世界遺産バスで相倉口へ行き、歩いて約5分の相倉合掌造り集落へ。約100〜350年前に建てられた20棟の合掌造りの家が残る、世界遺産の集落で、今も人々の暮らしが続いています。集落の中の相倉伝統産業館では、江戸時代の五箇山の三大産業だった塩硝・養蚕・和紙づくりの道具が展示されています。集落の高台からは、合掌造りの家々を見渡せます。坂道では足元に気をつけましょう。" + VILLAGE }),
    { create: mk({ name: "城端別院善徳寺", h: 15, m: 15, stay: 45, mode: "bus", min: 55, line: "世界遺産バス", lat: 36.5156196, lng: 136.9010631, address: "富山県南砺市城端",
      memo: "相倉口から世界遺産バスで城端駅前へ行き、歩いて約10分の城端別院善徳寺へ。約530年前に蓮如が開いた寺で、今は真宗大谷派（東本願寺）の城端別院です。親鸞直筆とされる「唯信抄」をはじめ、約1万点の寺宝の一部が展示されています。院内の拝観は予約が必要です。" + RESPECT }) },
    { create: mk({ name: "城端曳山会館", h: 16, m: 5, stay: 25, mode: "walk", min: 5, lat: 36.5145735, lng: 136.9021174, address: "富山県南砺市城端579-3",
      memo: "善徳寺から歩いてすぐの城端曳山会館へ。城端塗りの技を尽くした華やかな曳山が展示され、数分ごとに照明が切り替わり、庵唄を聞きながら、祭りの夜の雰囲気を味わえます。休館日は公式の案内で確かめましょう。金沢の城下町から白川郷・五箇山の合掌造りの集落をめぐる旅を、ここで締めくくりましょう。帰りは、歩いて約15分の城端駅から、JR城端線で新高岡駅へ行き、北陸新幹線に乗り換えましょう。" }) },
  ];

  console.log(`説明文: ${DESCRIPTION}`);
  for (const [i, d] of [day1, day2, day3, day4].entries()) console.log(`${i + 1}日目: ${d.map((x: any) => (x.create ?? x.data).name ?? "(既存)").join(" → ")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
    await tx.spot.update({ where: { id: omicho.id }, data: { dayId: d1.id, orderNo: 9501 } });
    await tx.spot.update({ where: { id: castle.id }, data: { dayId: d1.id, orderNo: 9502 } });
    await setDaySpotOrder(d1.id, day1 as any, { tx });
    await setDaySpotOrder(d2.id, day2 as any, { tx });
    await setDaySpotOrder(d3.id, day3 as any, { tx });
    await setDaySpotOrder(d4.id, day4 as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

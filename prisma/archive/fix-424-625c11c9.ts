/**
 * チェックリスト #424 625c11c9「酒蔵と源氏物語の里を巡る、伏見・宇治ゆったり旅」の見直し（しおりえ(制作補助2)）
 * 1日目: 城南宮 →（近鉄京都線）御香宮神社 → 伏見桃山陵（新規）→（昼食）→ 月桂冠大倉記念館 → 寺田屋 → 十石舟 → 長建寺（新規）（7か所 09:00〜16:30）
 * 2日目: 藤森神社 → 伏見稲荷大社 → 石峰寺 →（昼食）→（JR奈良線）萬福寺 →（JR奈良線）宇治市源氏物語ミュージアム（5か所 09:00〜16:30）
 * 3日目: 三室戸寺 → 宇治上神社 → 宇治橋（前の「宇治川」をIDのまま改名）→ 平等院 → 平等院表参道（前の「中村藤吉本店」をIDのまま改名。お店の名前を出さないため）（5か所 09:00〜13:30。帰る日）
 * 三室戸寺は拝観が15時10分までで、前の行程（14:30〜15:16）では間に合わないので、3日目の朝に移す。寺田屋（入館15時40分まで）・十石舟（最終便16時20分）も時間内に収める
 * 既存の本文は一文ずつ公式で確かめて書き直す。公式と合わない・確かめられない記述は外す:
 *   - 萬福寺「天王殿・大雄宝殿など主要な建物は国宝」→ 公式は「主要建物23棟などが国の重要文化財」なので「国の文化財」に
 *   - 三室戸寺「広さ5000坪の庭園に50種のアジサイ」は確かめられないので外し、公式の「2万株」「蓮250鉢・100種」に
 *   - 十石舟「1998年に月桂冠など地元の出資で復活」、寺田屋「慶長2年から船宿」「お龍が風呂から…」、御香宮「伏見の地名の由来という説」、
 *     城南宮「794年」「旅の安全を祈願する慣わし」、宇治川の鵜飼・紫式部像、宇治上神社「平等院の鎮守社」、源氏物語ミュージアム「平成10年に開館と伝えられ」などは外す
 *   - 十石舟は運航の時期（例年3月〜12月ごろ、8月は一部のみ）と予約を書く
 * 既存の写真11枚は目で見て合っているので残す
 * 本文の出典: 城南宮 https://www.jonangu.com/history.html ・ https://www.jonangu.com/garden.html ／御香宮神社 http://www.gokounomiya.kyoto.jp/history/history.html ／
 *   伏見桃山陵 https://www.kunaicho.go.jp/visit/ryobo/122.html ・ https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=901 ／
 *   月桂冠大倉記念館 https://www.gekkeikan.co.jp/enjoy/museum/floorguide/ ／寺田屋 https://ja.kyoto.travel/tourism/single01.php?category_id=13&tourism_id=940 ・
 *   https://www.kyoto-kankou.or.jp/info_search/3710 ／十石舟 https://kyoto-fushimi.or.jp/fune/unkou/ ・ https://kyoto-fushimi.or.jp/fune/ ・
 *   https://www.gekkeikan.co.jp/enjoy/kyotofushimi/fushimi/fushimi09.html ／長建寺 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=421 ／
 *   藤森神社 https://fujinomorijinjya.or.jp/wp/about/ ・ https://fujinomorijinjya.or.jp/wp/ritual/fujinomori/ ／伏見稲荷大社 https://inari.jp/about/ ・ https://inari.jp/about/faq/ ／
 *   石峰寺 https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=393 ・ https://ja.kyoto.travel/tourism/single02.php?category_id=9&tourism_id=416 ／
 *   萬福寺 https://www.obakusan.or.jp/about/ ／宇治市源氏物語ミュージアム https://museumforum.pref.kyoto.lg.jp/museum-map/genji-museum/ ／
 *   三室戸寺 https://www.mimurotoji.com/history/index.html ・ https://www.mimurotoji.com/event/hydrangea.html ・ https://www.mimurotoji.com/event/lotus.html ・ https://www.mimurotoji.com/guide/index.html ／
 *   宇治上神社 https://www.pref.kyoto.jp/isan/ujigami.html ／宇治橋 https://www.kyoto-kankou.or.jp/info_search/361 ／平等院 https://www.byodoin.or.jp/learn/history/ ／
 *   平等院表参道 https://www.kyoto-kankou.or.jp/info_search/6709
 * 座標の出典: Nominatim（城南宮 34.9505959,135.7469948／御香宮神社 34.9340912,135.7673930／月桂冠大倉記念館 34.9288793,135.7616285／寺田屋 34.9302856,135.7595574／
 *   十石舟乗船場 34.9284651,135.7615209／長建寺 34.9282364,135.7608881／藤森神社 34.9501837,135.7717009／伏見稲荷大社 34.9675192,135.7797101／石峰寺 34.9647195,135.7748620／
 *   萬福寺 34.9139921,135.8068449／宇治市源氏物語ミュージアム 34.8941030,135.8101690／三室戸寺 34.8997811,135.8187013／宇治上神社 34.8920528,135.8114573／
 *   宇治橋 34.8928016,135.8059960／平等院 34.8895001,135.8074525／平等院表参道 34.8909939,135.8065226）、OSM/Overpass（伏見桃山陵 way 629042750 34.936975,135.7811411）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-424-625c11c9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "625c11c9-1f5c-40dd-b510-9e93c517f6ff";
const DAY1_ID = "f1a9b7e0-6d7c-4434-8163-9c2ceb67ceb7";
const DAY2_ID = "a7885e43-5894-4dce-9210-ed9a89e038f8";
const DAY3_ID = "3a170255-f7a5-4f86-b483-24a654fd9bb9";
const GOKONOMIYA = "0c391b3b-4549-4ae2-9130-94d360486240";
const JIKKOKU = "d33e4590-420c-427c-9fc3-9d7d5bfe98ab";
const TERADAYA = "f80ca22b-1106-42c3-a4a6-607483fb5926";
const GEKKEIKAN = "6ff06c2f-d6e3-4db8-92c6-4abee189a2d9";
const JONANGU = "1e491e77-e80d-4354-be3a-a969428c8f3d";
const FUJINOMORI = "f00c21a3-1a0f-491d-9454-986b0a984208";
const INARI = "96557949-9dda-4a6f-bee6-ede82ab740f0";
const SEKIHOJI = "d097422f-6f8a-4256-b28f-258b27a9daee";
const MANPUKUJI = "ed42c4c1-5aeb-43d5-ac0b-fdf53fd9e004";
const GENJI = "083f1c3e-25be-4b39-89f8-db76435675da";
const UJIGAWA = "d37e86df-e4bc-4ae6-9c3a-a3f677016784";
const BYODOIN = "f0a1323a-b52e-4744-8615-b599fa5d9b98";
const NAKAMURA = "0c066afb-4322-4342-9157-0f0c8d6b368d";
const UJIGAMI = "291c00ac-f8cf-4b07-8a5d-dfab44b6e837";
const MIMUROTO = "881aa1af-d9a6-41b7-a9c0-6a272d5f0b25";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "1日目は城南宮、御香宮神社、伏見桃山陵から酒蔵の町・伏見へ。月桂冠大倉記念館や寺田屋を訪ね、十石舟で川から酒蔵の町並みを眺めます。2日目は藤森神社、伏見稲荷大社、若冲の五百羅漢が並ぶ石峰寺から、萬福寺と宇治市源氏物語ミュージアムへ。3日目は三室戸寺、宇治上神社、宇治橋、平等院をめぐり、平等院表参道で宇治茶の香りにふれます。伏見・宇治の酒どころと茶どころをゆったり巡る2泊3日です。お酒は20歳から。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type Extra = Record<string, unknown>;
const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Extra = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(JONANGU, 9, 0, 65, null, null, null, 34.950596, 135.746995,
    "旅の始まりは城南宮から。平安京への遷都に際し、都の安泰と国の守護を願って、国常立尊を八千矛神と息長帯日売尊にあわせてまつり、城南大神とあがめたのが始まりと伝えられます。城南宮とは「平安城の南に鎮まるお宮」という意味です。平安時代後期には、白河上皇や鳥羽上皇が城南宮を取り囲むように城南離宮（鳥羽離宮）を造営して院政の拠点とし、方除けの神としての信仰は平安時代から続いています。神苑「楽水苑」には『源氏物語』に描かれた80種あまりの草木が植えられ、「源氏物語花の庭」として親しまれています。神苑の拝観時間は公式の案内で確かめましょう。" + RESPECT),
  upd(GOKONOMIYA, 10, 30, 40, "train", 25, "近鉄京都線", 34.934091, 135.767393,
    "城南宮の最寄りの竹田駅から近鉄京都線で桃山御陵前駅へ。「ごこんさん」と呼ばれ、旧伏見町一帯の氏神として親しまれている神社で、安産・子育ての神として知られる神功皇后を主祭神としてまつっています。創建の年はわかっていませんが、社伝では貞観4年（862年）、境内から香りのよい水が湧き出たことから、清和天皇から「御香宮」の名を賜ったとされます。この「御香水」は伏見の七名水のひとつに数えられ、昭和60年（1985年）には環境庁（今の環境省）の名水百選に選ばれました。徳川家康の命で慶長10年（1605年）に建てられた本殿は、国の重要文化財です。" + RESPECT),
  cre("伏見桃山陵", 11, 30, 40, "walk", 20, 34.936975, 135.781141, "京都府京都市伏見区桃山町古城山",
    "御香宮神社から歩いて約20分。明治45年（1912年）に崩御した明治天皇の陵で、その年のうちに陵墓の工事が終わりました。陵の形は上円下方墳で、場所は旧伏見城の本丸跡にあたります。東側には昭憲皇太后の桃山東陵があります。参拝できる時間は宮内庁の案内で確かめ、歩きやすい靴で出かけましょう。" + RESPECT + "このあと、伏見の町なかで昼食にしましょう。"),
  upd(GEKKEIKAN, 13, 20, 50, "walk", 30, null, 34.928879, 135.761629,
    "伏見桃山陵から歩いて約30分（途中で昼食）。寛永14年（1637年）創業の月桂冠が、明治42年（1909年）に建てられた酒蔵を生かして開いている記念館です。米の洗い場の板石を使った土間や、米松の梁による天井など、昔ながらの酒蔵の風情が残ります。展示室では創業からの歴史を史料で紹介し、京都市の有形民俗文化財に指定された酒造用具も並びます。見学の最後には、きき酒処で試飲も楽しめます。お酒は20歳から。"),
  upd(TERADAYA, 14, 15, 30, "walk", 5, null, 34.930286, 135.759557,
    "記念館から歩いてすぐの、伏見の船宿です。文久2年（1862年）、薩摩藩の急進派の藩士たちがここに集まり、鎮圧に向かった藩士たちとの乱闘になった「寺田屋騒動」の舞台として知られます。慶応2年（1866年）には、泊まっていた坂本龍馬が伏見奉行所の捕り方に襲われましたが、難を逃れました。寺田屋は鳥羽伏見の戦い（1868年）で焼け、今の建物はその後に再建されたものです。見学できる時間は公式の案内で確かめましょう。"),
  upd(JIKKOKU, 15, 0, 60, "walk", 10, null, 34.928465, 135.761521,
    "寺田屋から歩いて、月桂冠大倉記念館の裏の乗船場へ。十石舟は、酒蔵や古い町並みが連なる川を進み、三栖閘門まで往復する遊覧船です（往復約55分）。途中で舟を降りて、昭和4年（1929年）につくられた三栖閘門を見学してから戻ります。港町伏見は豊臣秀吉がその基礎をつくったとされ、かつては水運で栄えました。運航は例年3月〜12月ごろ（8月は一部の期間のみ）で、運休の日もあります。出航の時間とあわせて公式の案内で確かめ、予約してから出かけましょう。",
    { address: "京都府京都市伏見区南浜町（月桂冠大倉記念館裏の乗船場）" }),
  cre("長建寺", 16, 5, 25, "walk", 5, 34.928236, 135.760888, "京都府京都市伏見区東柳町",
    "十石舟の乗船場のすぐそば。「島の弁天さん」と親しまれる真言宗醍醐派の寺で、元禄12年（1699年）、伏見奉行の建部政宇が中書島を開発したときに創建されました。京都で本尊が弁財天という寺はここだけとされ、脇仏は珍しい裸形弁財天です。桜の名所としても知られています。" + RESPECT + "今夜は伏見の近くに泊まります。"),
];

const day2 = [
  upd(FUJINOMORI, 9, 0, 40, null, null, null, 34.950184, 135.771701,
    "2日目は藤森神社から。社伝では、神功皇后が摂政3年（203年）、新羅から戻ったのち、深草の里・藤森の地に旗を立て、兵具を納めて神をまつったのが始まりとされます。5月の藤森祭は、江戸時代に「菖蒲」が「尚武」、さらに「勝負」に通じることから、菖蒲の節句発祥の祭りとされ、勇壮な駈馬神事が行われます。勝運と馬の守護神として、競馬関係者や馬にゆかりのある人たちからも信仰を集めています。" + RESPECT),
  upd(INARI, 9, 55, 120, "walk", 15, null, 34.967519, 135.77971,
    "藤森神社から歩いて約15分。全国に3万社あるといわれるお稲荷さんの総本宮で、稲荷信仰の原点は稲荷山にあります。ご祭神の稲荷大神が稲荷山に鎮座されたのは奈良時代の和銅4年（711年）とされ、2011年に御鎮座1300年を迎えました。鳥居は、願いごとが「通る」あるいは「通った」お礼に奉納する習わしが江戸時代以降に広まったもので、今は約1万基の鳥居がお山の参道全体に立ち並んでいます。朱の鳥居が続く参道は山道になるので、歩きやすい靴で出かけましょう。" + RESPECT),
  upd(SEKIHOJI, 12, 5, 40, "walk", 10, null, 34.96472, 135.774862,
    "伏見稲荷大社から歩いて約10分。黄檗宗の寺で、宝永年間（1704〜1711年）に萬福寺の千呆和尚が開いたと伝えられます。江戸時代の画家・伊藤若冲がこの地に草庵を結び、住職の協力を得て、10年余りをかけて裏山に五百羅漢の石像をつくりました。若冲が下絵を描いて石工に彫らせたもので、釈迦の誕生から涅槃までの一代記を表しています。長い年月の風雨で丸みを帯び、苔むした姿に趣があります。羅漢山の西には若冲の墓もあります。五百羅漢の写真撮影やスケッチは禁止されています。" + RESPECT + "このあと、昼食にしましょう。"),
  upd(MANPUKUJI, 14, 0, 60, "train", 20, "JR奈良線", 34.913992, 135.806845,
    "JR稲荷駅から奈良線で黄檗駅へ。黄檗宗の大本山で、1661年に中国・明の時代の僧、隠元隆琦禅師が開きました。禅師は日本からの度重なる招きに応じ、63歳で弟子20人を伴って1654年に来日し、寺の名を中国で住職を務めた寺と同じ「黄檗山萬福寺」としました。中国の明朝様式を取り入れた伽藍配置は他に例がないとされ、主要な建物や回廊などが国の文化財に指定されています。隠元豆（いんげんまめ）の名も、禅師にちなむといわれます。" + RESPECT),
  upd(GENJI, 15, 20, 70, "train", 20, "JR奈良線", 34.894103, 135.810169,
    "黄檗駅からJR奈良線で宇治駅へ。『源氏物語』五十四帖のうち、最後の十帖は宇治がおもな舞台で、「宇治十帖」と呼ばれます。その世界を紹介する宇治市の博物館で、実物大に復元した牛車や調度品を展示し、映像で物語の世界をわかりやすく紹介しています。宇治十帖をテーマにしたオリジナル映画も上映しています。2018年に開館20周年を迎えてリニューアルしました。休館日は公式の案内で確かめましょう。今夜は宇治に泊まります。"),
];

const day3 = [
  upd(MIMUROTO, 9, 0, 60, null, null, null, 34.899781, 135.818701,
    "3日目は三室戸寺から。西国第十番札所の観音霊場で、寺伝では宝亀元年（770年）、光仁天皇の勅願で開かれたとされます。杉木立の間に約2万株のあじさいが咲くあじさい園（例年6月〜7月ごろ）や、本堂前に250鉢、100種ほどの蓮が並ぶ蓮園（例年6月〜8月ごろ）で知られ、「蓮の寺」ともいわれます。拝観できる時間が夕方より前に終わるので、朝のうちに訪れましょう。" + RESPECT),
  upd(UJIGAMI, 10, 25, 30, "walk", 25, null, 34.892053, 135.811457,
    "三室戸寺から歩いて約25分。菟道稚郎子、応神天皇、仁徳天皇をまつる神社で、本殿は神社建築として日本最古とされます。平安時代後期に伐採された木材を使った本殿は、一間社流造の三つの社殿からなり、鎌倉時代前期の檜を使った拝殿とともに国宝です。世界遺産にも登録されています。" + RESPECT),
  upd(UJIGAWA, 11, 5, 20, "walk", 10, null, 34.892802, 135.805996,
    "宇治上神社から歩いて約10分。大化2年（646年）に奈良・元興寺の僧、道登が架けたと伝えられ、瀬田唐橋・山崎橋とともに日本三古橋の一つに数えられる橋です。今の橋は平成8年（1996年）に完成したもので、檜の高欄に青銅の擬宝珠を付け、歴史ある姿を今に伝えています。上流側に張り出した「三の間」は、守護神の橋姫をまつった名残といわれます。",
    { name: "宇治橋", address: "京都府宇治市宇治" }),
  upd(BYODOIN, 11, 30, 70, "walk", 5, null, 34.8895, 135.807453,
    "宇治橋を渡って平等院へ。永承7年（1052年）、関白・藤原頼通が父・道長から譲り受けた別業（別荘）を寺に改めて開きました。この年は末法の初年にあたるとされ、極楽往生を願う浄土信仰が広まっていました。翌年の天喜元年（1053年）には阿弥陀堂（鳳凰堂）が完成し、仏師・定朝による阿弥陀如来坐像がまつられました。鳳凰堂と阿弥陀如来坐像は1951年に国宝に指定され、同じ年に鳳凰堂は10円硬貨のデザインにも採用されました。世界遺産にも登録されています。" + RESPECT),
  upd(NAKAMURA, 12, 45, 45, "walk", 5, null, 34.890994, 135.806523,
    "平等院から歩いてすぐ。宇治茶の老舗や食事処、喫茶、雑貨店、土産物店などが約160mにわたって軒を連ねる参道で、お茶を焙じる香ばしい香りが漂うことから、環境省の「かおり風景100選」に選ばれています。ここで昼食をとり、宇治のお茶を味わって、旅を締めくくりましょう。",
    { name: "平等院表参道", address: "京都府宇治市宇治蓮華" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 3 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID || days[2].id !== DAY3_ID ||
    days[0].spots.map((s) => s.id).join() !== [GOKONOMIYA, JIKKOKU, TERADAYA, GEKKEIKAN, JONANGU].join() ||
    days[1].spots.map((s) => s.id).join() !== [FUJINOMORI, INARI, SEKIHOJI, MANPUKUJI, GENJI].join() ||
    days[2].spots.map((s) => s.id).join() !== [UJIGAWA, BYODOIN, NAKAMURA, UJIGAMI, MIMUROTO].join()) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2], [3, day3]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const label = "id" in x ? `${names[x.id]}(既存)${d.name ? `→${d.name}` : ""}` : d.name;
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${label} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
      await setDaySpotOrder(DAY3_ID, day3, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

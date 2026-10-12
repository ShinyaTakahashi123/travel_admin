/**
 * #184 6ff2703e「空の展望台と下町情緒。天王寺・あべのぶらり旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 09:00〜13:51、2日目 5か所 09:00〜14:54 で、昼食と帰りの一言がなく、本文は案内の話し方（「やってまいりました」「なんです」）。
 *   堀越神社の本文に、崇峻天皇の亡くなり方が書かれていたので外す。あべのハルカスの「日本一」の移り変わりの話も外す。
 *   あべのキューズモール（商業施設）と阪堺電車の停留場（乗り場）は行き先から外し、写真も外す。四天王寺は2日目へ移す
 * 天王寺・阿倍野のほかのしおり（6d8232c0: 堀越神社・四天王寺・美術館・慶沢園・茶臼山・てんしば・新世界・ハルカス、550bf094: 新世界・通天閣・四天王寺・慶沢園、
 *   e6eb7aab: 安倍晴明神社・阿倍王子神社・住吉大社・粉浜商店街・住吉公園・ハルカス）の本文を読み、使っていない話で書いた
 *   （美術館: 寄託と寄附で育ったコレクション、新世界: ジャンジャン横丁、四天王寺: 各宗の祖師のお堂と江戸初期の建物、堀越神社: 堀を越えて参る名の由来と窪津王子、
 *    てんしば: 動物園の門のにぎわいの場、ハルカス: 天上回廊と天空庭園、住吉大社: 本殿の並びと住吉造の3つの特徴、阿倍王子神社: 弘法大師の祈祷と保存樹、晴明神社: 誕生の地の碑と大正の復興）。
 *   天王寺七坂（清水寺・愛染堂勝鬘院・大江神社・口縄坂）と一心寺・安居神社・動物園はほかのしおりにない
 * 電車・路面電車と歩きの旅（JR・地下鉄の天王寺駅から。天王寺のあたりに泊まる）:
 *   1日目: 天王寺動物園 9:30 → 新世界（昼食）→ 大阪市立美術館 → 一心寺 → 安居神社 → 清水寺 → 愛染堂勝鬘院 → 大江神社 → 口縄坂 16:35 → 宿
 *   2日目: 四天王寺 9:30 → 堀越神社 → てんしば（昼食）→ あべのハルカス（ハルカス300）→ 住吉大社 → 阿倍王子神社 → 安倍晴明神社 16:32 → 天王寺駅前
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（大阪観光局 OSAKA-INFO https://osaka-info.jp/ と大阪市 https://www.city.osaka.lg.jp/）:
 *   osaka-info spot/osaka-tennoji-zoo（大正4年開園・約11ha・約170種1000点・日本でここだけのドリル・生態的展示・爬虫類生態館アイファー・ペンギンパーク＆アシカワーフ・鳥のセカイ・月曜休園）／
 *   spot/shinsekai（ジャンジャン横丁は南北130mに串カツ屋、どて焼き屋、囲碁将棋クラブなど約50軒）／osaka-art-museum.jp/about 大阪市立美術館（昭和11年開館時はコレクションなし・寄託で常設展示・
 *   市民の寄附で国宝1件、重要文化財54件を含む8700件・中国の書画と彫刻は世界的なコレクション・中央ホールは無料ゾーン）／city kensetsu/page/0000009757 一心寺（1185年に慈円が草庵・法然が日想観・
 *   戦災で失う・全国からの納骨で骨仏・本多忠朝の墓に断酒の願）／spot/yasuijinja 安居神社（少彦名神と菅原道真・901年に道真が休んだ・粟おこしの梅鉢の言い伝え・942年創建・夏安居で安居・かんしづめの井）／
 *   city kensetsu/page/0000009748 清水寺（崖の上で眺望・京都の清水の舞台をまねた舞台・寛政8年の玉出の滝・滝にうたれる人）と city tennoji/page/0000654075（玉出の滝は大阪唯一の滝として知られる）／
 *   spot/shomanin 愛染堂勝鬘院（593年に四天王寺の施薬院・勝鬘経・愛染明王・秀吉が再建した多宝塔は重要文化財・愛染めの霊水・大阪の三大夏祭りの愛染祭）と city tennoji/page/0000654078
 *   （多宝塔は市内最古の建造物・大江神社に夕陽岡の碑、夕焼けが美しい）／spot/kuchinawazaka 口縄坂（天王寺七坂・蛇に似た起伏、大坂城築城の縄打ちの説・織田作之助『木の都』の碑）／
 *   spot/shitennoji 四天王寺（最澄、空海、法然、親鸞のお堂・宗派の枠を超えた寺・中心伽藍は昭和の復興・六時礼讃堂と元三大師堂は江戸初期で重要文化財・宝物館・10〜3月は16:00まで）／
 *   spot/horikoshijinja 堀越神社（太子が崇峻天皇を偲んで茶臼山に建立と伝わる・四天王寺七宮・明治中期まで南に堀があり、越えて参詣・窪津王子・樹齢数百年の樹木）／
 *   tennoji-park.jp てんしば（エントランスエリアにカフェやレストラン・てんしばイーナは約5,000㎡に飲食施設、動物園とてんしばを結ぶ）／local_journey/stopby-osaka/abenoharukas/ ハルカス300
 *   （大阪阿部野橋駅直結・16階でチケット・60階「天上回廊」は全面ガラス、西側に床がガラスの一角・58階「天空庭園」の吹き抜けとウッドデッキ）／spot/sumiyoshitaisha 住吉大社（全国約2300社の総本社・
 *   正月三が日200万人超・航海安全、祓、農耕、和歌、武、相撲の神・第一〜第三本宮が縦、第四本宮が横で船団のよう・住吉造の3つの特徴・国宝）／spot/abeojijinja 阿倍王子神社（仁徳天皇創建の伝え・
 *   826年に弘法大師が悪疫鎮圧の祈祷・楠木5本と榎木1本は府指定保存樹・末社に晴明神社）／spot/abenoseimeijinja 安倍晴明神社（晴明誕生の伝承地・文政年間の誕生の地の碑と産湯の跡・
 *   大正10年に阿倍王子神社の末社として復興・大正14年の社殿・日替わりの占い）
 * 座標: OSM — 天王寺動物園 way 579430112・通天閣 way 254319878・大阪市立美術館 way 173693696・一心寺 way 1055909600・安居神社 way 249330744・清水寺 way 741754884・大江神社 way 237939870・
 *   口縄坂 way 36980059・四天王寺 way 579077537・堀越神社 way 1323183594・てんしば way 579430110・あべのハルカス way 187296989・住吉大社 way 186423245・阿倍王子神社 way 1137827944・
 *   安倍晴明神社 way 355594969（Nominatim の中心）／勝鬘院・愛染堂 node 6070203697（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-184-6ff2703e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6ff2703e-a791-45af-9afc-ebb75a028bab";
const DAY1_ID = "cf829bbd-e4ba-4e4e-8061-7253ae00c2ac";
const DAY2_ID = "9ba78754-874a-4ad5-84b0-335291a2e111";
const ZOO = "f005bd11-2695-4e84-b367-03fd31b8c393";
const YASUI = "e60e4036-1030-474a-8102-b3b2ba44dc85";
const SHITENNOJI = "4cf66542-88f2-409a-bbb0-2b775e9429e7";
const ISSHINJI = "05f526b8-d384-412f-82fa-466111f8d2ee";
const MUSEUM = "33a8dab7-d1f5-4b78-8241-5b701bdf62ba";
const HORIKOSHI = "1922b418-505c-44f3-bc0d-a0465eea2652";
const TENSHIBA = "6e3e9a37-5453-4e25-bd74-6c75a041761e";
const QSMALL = "283edfc1-65b4-4dd7-bdd5-af5968a19586";
const TRAMSTOP = "6ceb5f84-5269-4eef-abe0-7b0401dedc64";
const HARUKAS = "c0fcd229-44e5-4507-8486-7d60cc82f517";
const REMOVE_PHOTOS = ["33fbd79f-16b6-4415-969c-776cc9d8eec7", "641b6d41-6b5b-47b0-b9d2-7fdbd66f9f02"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const tram = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const MEMORIAL = "亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。";

const DESCRIPTION =
  "1日目は天王寺動物園から新世界で昼食、大阪市立美術館をめぐり、一心寺や安居神社から天王寺七坂へ。清水寺の玉出の滝、愛染堂、夕陽岡の大江神社、口縄坂の石畳を歩きます。2日目は四天王寺と堀越神社にお参りし、てんしばで昼食。ハルカス300から大阪を見渡し、路面電車で住吉大社と阿倍野の古社をめぐる1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(ZOO, { h: 9, m: 30, stay: 110, legs: [], lat: 34.6506421, lng: 135.5083594, address: "大阪府大阪市天王寺区茶臼山町1-108",
    memo: "この旅は電車と路面電車、歩きでめぐります。JRや地下鉄の天王寺駅から歩いて約5分。大正4年（1915年）に開かれた動物園で、約11haの園内に約170種1000点の動物が暮らしています。動物のすみかの景色をできるだけ再現する「生態的展示」に力を入れていて、爬虫類生態館「アイファー」、ペンギンやアシカが泳ぐ海辺の景色、さまざまな環境の鳥たちを見られる「鳥のセカイ」などをめぐれます。サルのなかまのドリルは、日本ではここでしか見られないとされます。動物には食べ物を与えず、大きな音を立てないようにしましょう。休園日は公式の案内で確かめましょう。" }),
  cre("新世界（昼食）", { h: 11, m: 30, stay: 50, legs: [walk(10)], lat: 34.6525393, lng: 135.5063098, address: "大阪府大阪市浪速区恵美須東",
    memo: "動物園の北側から歩いて約10分。通天閣のそびえる下町で、南北約130mの「ジャンジャン横丁」には、串カツやどて焼きの店、囲碁や将棋のクラブなど約50軒が軒を連ねます。串カツなど大阪らしい味の店が多いので、ここで昼食にしましょう。" }),
  upd(MUSEUM, { h: 12, m: 35, stay: 60, legs: [walk(15)], lat: 34.6500959, lng: 135.5105228, address: "大阪府大阪市天王寺区茶臼山町1-82",
    memo: "新世界から天王寺公園を通って歩いて約15分。昭和11年（1936年）に開かれたとき、所蔵品は1点もなく、寺社や個人から預かった作品で展示を始めた美術館です。その後、市民からの寄附でコレクションが増え、今では国宝1件、重要文化財54件を含む約8700件を所蔵しています。とくに中国の書画や彫刻は、世界的なコレクションとして知られます。中央のホールは無料で入れるので、気軽に立ち寄れます。休館日は公式の案内で確かめましょう。" }),
  upd(ISSHINJI, { h: 13, m: 43, stay: 30, legs: [walk(8)], lat: 34.6527469, lng: 135.5109092, address: "大阪府大阪市天王寺区逢阪2-8-69",
    memo: "美術館から北へ歩いて約8分。1185年に、天台座主の慈円が草庵を結んだのが始まりといわれ、法然もここで夕日を拝む修行を行ったと伝えられます。全国から納められた遺骨でつくる阿弥陀仏「お骨佛」がまつられ、大阪の人々に親しまれてきました。境内の墓地には、酒をやめたい人が願をかけるという本多忠朝の墓もあります。" + MEMORIAL + PRAY }),
  upd(YASUI, { h: 14, m: 16, stay: 20, legs: [walk(3)], lat: 34.6544859, lng: 135.5109292, address: "大阪府大阪市天王寺区逢阪1-3-24",
    memo: "一心寺から坂を上って約3分。少彦名神と菅原道真をまつる神社です。901年、大宰府へ向かう途中の道真がここで休んだという言い伝えがあり、そのとき村人がおこしを差し上げたお礼にもらった「梅鉢」の紋が、大阪名物の粟おこしの印になったといわれます。四天王寺の僧がここで夏の修行「夏安居」をしたことから、「安居」の名になったといわれます。境内には、天王寺七名水の一つ「かんしづめの井」があります。" + PRAY }),
  cre("清水寺（玉出の滝）", { h: 14, m: 41, stay: 30, legs: [walk(5)], lat: 34.655433, lng: 135.5115461, address: "大阪府大阪市天王寺区伶人町5-8",
    memo: "安居神社から天王寺七坂の一つ、天神坂を上って約5分。上町台地の崖の上に建つ寺で、京都の清水寺の舞台をまねてつくった舞台からは、大阪の町を見渡せます。境内の南の崖には、寛政8年（1796年）につくられた「玉出の滝」があり、大阪でただ一つの滝として知られます。今も滝に打たれる人の姿が見られます。" + PRAY }),
  cre("愛染堂勝鬘院", { h: 15, m: 18, stay: 30, legs: [walk(7)], lat: 34.6573891, lng: 135.5125862, address: "大阪府大阪市天王寺区夕陽丘町5-36",
    memo: "清水寺から北へ、清水坂と愛染坂のあたりを歩いて約7分。593年に、四天王寺の病人に薬を施す「施薬院」として開かれたと伝わる寺で、聖徳太子が勝鬘経を講じたことから「勝鬘院」と呼ばれるようになったといわれます。本尊の愛染明王から「愛染さん」とも親しまれ、夏の愛染祭は大阪の三大夏祭りの一つとされます。豊臣秀吉が建て直した多宝塔は重要文化財で、市内でもっとも古い建造物とされます。" + PRAY }),
  cre("大江神社", { h: 15, m: 50, stay: 20, legs: [walk(2)], lat: 34.6573041, lng: 135.5120334, address: "大阪府大阪市天王寺区夕陽丘町",
    memo: "愛染堂から愛染坂を上ってすぐ。境内には「夕陽岡」の碑があり、このあたりから見る夕焼けは今も美しいといわれます。" + PRAY }),
  cre("口縄坂", { h: 16, m: 15, stay: 20, legs: [walk(5)], lat: 34.6591467, lng: 135.5110459, address: "大阪府大阪市天王寺区夕陽丘町",
    memo: "大江神社から北へ歩いて約5分。真言坂、源聖寺坂、口縄坂、愛染坂、清水坂、天神坂、逢坂の「天王寺七坂」の一つで、静かな石畳の坂です。名前は、坂の下から見た道の起伏が蛇（くちなわ）に似ているからとも、大坂城を築くときに縄打ちを始めた地だからともいわれます。坂の上には、作家・織田作之助の小説『木の都』の一節を刻んだ碑があります。この日は、天王寺のあたりの宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  upd(SHITENNOJI, { h: 9, m: 30, stay: 90, legs: [], lat: 34.6547194, lng: 135.5167979, address: "大阪府大阪市天王寺区四天王寺1-11-18",
    memo: "地下鉄の四天王寺前夕陽ヶ丘駅から歩いて約5分。聖徳太子が開いたと伝わる寺で、境内には伝教大師最澄や弘法大師空海、法然、親鸞など、各宗の祖師にゆかりのお堂が並び、宗派の枠をこえた寺として親しまれています。中心の伽藍は昭和に再建されたものですが、北側の六時礼讃堂や元三大師堂は江戸時代のはじめの建物で、国の重要文化財です。宝物館には国宝や重要文化財が収められています。拝観の時間は季節で変わるので、公式の案内で確かめましょう。" + PRAY }),
  upd(HORIKOSHI, { h: 11, m: 15, stay: 20, legs: [walk(15)], lat: 34.6514605, lng: 135.5132937, address: "大阪府大阪市天王寺区茶臼山町1-8",
    memo: "四天王寺から南西へ歩いて約15分。聖徳太子が叔父の崇峻天皇を偲んで茶臼山に建てたと伝わる、四天王寺七宮の一つです。明治の中ごろまで境内の南に美しい堀があり、その堀を越えてお参りしたことから「堀越」の名がついたといわれます。境内には、熊野へ向かう道の第一王子だった窪津王子もまつられ、樹齢数百年の木々が、大通り沿いの境内を静かに保っています。" + PRAY }),
  upd(TENSHIBA, { h: 11, m: 40, stay: 50, legs: [walk(5)], lat: 34.6486329, lng: 135.5108758, address: "大阪府大阪市天王寺区茶臼山町5-55",
    memo: "堀越神社から歩いて約5分。天王寺公園の入り口に広がる芝生の広場で、まわりにはカフェやレストランが並びます。動物園の門のそばの「てんしばイーナ」にも、約5,000㎡の敷地に飲食の店が集まっているので、ここで昼食にしましょう。" }, "天王寺公園（てんしば）（昼食）"),
  upd(HARUKAS, { h: 12, m: 40, stay: 70, legs: [walk(10)], lat: 34.6457685, lng: 135.5140068, address: "大阪府大阪市阿倍野区阿倍野筋1-1-43",
    memo: "てんしばから歩いて約10分。近鉄の大阪阿部野橋駅に直結するビルで、58〜60階が展望台「ハルカス300」です。16階でチケットを買い、直通エレベーターで60階の「天上回廊」へ。壁がすべてガラス張りで、大阪平野から京都、奈良、和歌山の方面まで見渡せ、西側には足元までガラスになった一角もあります。58階の「天空庭園」は、60階までの吹き抜けの下に広がるウッドデッキの屋外広場です。" }, "あべのハルカス（ハルカス300）"),
  cre("住吉大社", { h: 14, m: 15, stay: 70, legs: [walk(3), tram(20, "阪堺電車上町線（天王寺駅前→住吉鳥居前）"), walk(2)], lat: 34.6130027, lng: 135.4931012, address: "大阪府大阪市住吉区住吉2-9-89",
    memo: "ハルカスのそばの天王寺駅前から路面電車の阪堺電車に乗り、約20分の住吉鳥居前で降りてすぐ（あわせて約25分）。全国約2300社の住吉神社の総本社で、正月三が日には200万人を超える人がお参りするといわれます。航海の安全や祓、農耕、和歌、武、相撲の神としてあがめられてきました。第一本宮から第三本宮までが縦に、第四本宮がその横に並ぶ本殿の配置は、海を進む船団のようといわれます。朱塗りの柱、白い板壁、まっすぐな切妻の屋根と正面の入り口の「住吉造」で、国宝です。" + PRAY }),
  cre("阿倍王子神社", { h: 15, m: 44, stay: 26, legs: [walk(2), tram(12, "阪堺電車上町線（住吉鳥居前→東天下茶屋）"), walk(5)], lat: 34.6309543, lng: 135.5091793, address: "大阪府大阪市阿倍野区阿倍野元町9-4",
    memo: "住吉鳥居前から阪堺電車で東天下茶屋へ戻り、南東へ歩いて約5分（あわせて約19分）。仁徳天皇が開いたと伝わる神社で、826年には淳和天皇の命で、弘法大師が悪い病を鎮める祈祷を行ったと伝わります。境内の楠5本と榎1本は、大阪府の保存樹に指定されています。" + PRAY }),
  cre("安倍晴明神社", { h: 16, m: 12, stay: 20, legs: [walk(2)], lat: 34.6317634, lng: 135.5091994, address: "大阪府大阪市阿倍野区阿倍野元町5-16",
    memo: "阿倍王子神社から歩いてすぐ。平安時代の陰陽師・安倍晴明が生まれた地と伝わる場所にある神社です。境内には、江戸時代の文政年間に建てられた晴明誕生の地を示す碑や、産湯の跡があります。幕末にいったん衰えましたが、大正10年に阿倍王子神社の末社として復興し、今の社殿は大正14年に建てられたといわれます。日替わりの占いのコーナーもあります。" + PRAY + "帰りは、東天下茶屋から阪堺電車で天王寺駅前へ戻りましょう。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]\n表紙: ${it.thumbnailUrl}`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== [ZOO, YASUI, SHITENNOJI, ISSHINJI, MUSEUM].join() ||
    it.days[1].spots.map((s) => s.id).join() !== [HORIKOSHI, TENSHIBA, QSMALL, TRAMSTOP, HARUKAS].join()
  )
    throw new Error("構成が想定と違います");
  const photos = it.days[1].spots.filter((s) => s.id === QSMALL || s.id === TRAMSTOP).flatMap((s) => s.photos);
  if (photos.map((p) => p.id).sort().join() !== [...REMOVE_PHOTOS].sort().join()) throw new Error("外す写真が想定と違います");
  if (photos.some((p) => p.url === it.thumbnailUrl)) throw new Error("表紙が外す写真です");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await tx.spot.update({ where: { id: SHITENNOJI }, data: { dayId: DAY2_ID, orderNo: 901 } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx, remove: [QSMALL, TRAMSTOP] });
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

/**
 * #492 443379ac「東大寺・春日大社から飛鳥・長谷寺と室生寺までめぐる奈良2泊3日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 13:00〜16:15 / 5か所 09:30〜14:33 / 2か所 09:30〜13:00 で、昼食の一言がなく、季節が空だった。宿は2泊とも奈良市内。旅の足は近鉄・バス・歩き・レンタサイクル（飛鳥）
 * 1日目: 興福寺 9:00 → 猿沢池 → 元興寺 → ならまち（昼食）→ 奈良国立博物館 → 東大寺 → 春日大社 → 新薬師寺 16:50（9:00〜17:00）
 * 2日目: 橿原神宮前でレンタサイクル（9時から）→ 甘樫丘 9:20 → 飛鳥寺 → 奈良県立万葉文化館 → 酒船石遺跡 → 石舞台古墳 → 島庄（昼食）→ 橘寺 → 川原寺跡 → 亀石 → 高松塚古墳 → キトラ古墳壁画体験館 16:40（入館16:30まで）。
 *   自転車は飛鳥駅前の営業所で返す（乗り捨て、17時まで） https://www.k-asuka.com/about/index.html
 * 3日目: 長谷寺 9:00 →（近鉄・室生口大野11:19のバス）室生寺の門前（昼食）→ 室生寺 → 室生龍穴神社 →（室生寺15:47のバス）大野寺 16:40。帰りは室生口大野駅から近鉄で
 *   バス: 室生口大野駅→室生寺 https://www.navitime.co.jp/bus/diagram/timelist?departure=00032420&arrival=00032421&line=00009786 ・室生寺発 https://www.navitime.co.jp/diagram/bus/00032421/00009786/0/ （15:47）
 * 冬は大野寺（16時まで）・室生寺（16時まで）・キトラ（入館16時まで）が早く閉まるので、季節は春・夏・秋
 * 本文の出典: 奈良市の興福寺・猿沢池・元興寺・ならまち・東大寺・春日大社は #476（a37b8c79）、奈良国立博物館は #127・#34、飛鳥の各所は #94（27a60951）・#145（0e15e22b）・#21（feb07068）で確認済みの事実を書き分けた。
 *   新薬師寺 https://yamatoji.nara-kankou.or.jp/01shaji/02tera/01north_area/shinyakushiji/ ／明日香の夢市（石舞台古墳の西どなり） https://www.asukadeasobo.jp/visit/yumeichi/ ／キトラ https://www.nabunken.go.jp/shijin/guidance/ （検索結果）／
 *   長谷寺 https://yamatoji.nara-kankou.or.jp/01shaji/02tera/03east_area/hasedera/ ・https://www.hasedera.or.jp/ （拝観時間）／室生寺 https://www.uda-kankou.jp/navigation/1324 ・https://www.pref.nara.lg.jp/masumasu/2491.html （門前の茶屋・太鼓橋・鎧坂）・https://www.murouji.or.jp/guide/ ／
 *   室生龍穴神社 https://yamatoji.nara-kankou.or.jp/01shaji/01jinja/03east_area/ryuketsujinja/ ／大野寺 https://yamatoji.nara-kankou.or.jp/01shaji/02tera/03east_area/onodera/
 * 座標の出典: OSM（Nominatim）— 興福寺 way 1134439456／猿沢池 way 59465653／元興寺 way 218642880／奈良国立博物館 way 921353198／新薬師寺 way 343175186／飛鳥寺 way 813386514（もとの値は約500mずれていた）／
 *   酒船石 node 6001946849／橘寺 way 402546839／川原寺 node 3730003044／亀石 node 4469534110／高松塚壁画館 node 1423093823／四神の館 way 1033842999／長谷寺 way 1454013909／室生寺 node 380420314／
 *   龍穴神社 node 380420359／大野寺 node 814967352。ならまちは #476 と同じ値。推定: 島庄の昼食は国土地理院の住所検索（島庄154、夢市の住所154-3の番地の点）、室生寺の門前は室生寺バス停 node 6794390190
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-492-443379ac.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "443379ac-eac1-427a-859b-34aaece19786";
const DAY_IDS = ["60bc912d-e6ff-41d6-8921-30ba166e01ab", "996680a4-2505-4f2a-a0fd-993b2eea1b06", "a9bbf974-0329-4056-aa33-dda28e1a44dd"];
const ID = {
  todaiji: "e3af3831-f988-40ed-aa6c-4928577258b1",
  kasuga: "473333c4-1805-4dbd-92d9-e5b29bd23bf3",
  shinyakushiji: "2be74ea8-b33d-4b83-ae35-0f1cadafefce",
  amakashi: "b63203d6-9631-4e83-a3c5-6baf4ddbe53e",
  asukadera: "06320fc8-7a3d-4643-82da-c4465c6d4eff",
  manyo: "5ff7c9f0-5015-44bc-880b-8634c3d6ed74",
  ishibutai: "30f9d0c6-c111-484a-bda8-67d8ab33366b",
  kitora: "33a9e46a-b0e1-4065-a5eb-3c8313d3fe0f",
  hasedera: "7894df03-b22e-4811-bcde-0a03b2b14d91",
  murouji: "424071eb-7ee6-432d-b82e-aae329699f86",
};
const EXPECTED = [[ID.todaiji, ID.kasuga, ID.shinyakushiji], [ID.amakashi, ID.asukadera, ID.manyo, ID.ishibutai, ID.kitora], [ID.hasedera, ID.murouji]];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BIKE = "自転車は車に気をつけて、交通ルールを守って走りましょう。";

const DESCRIPTION =
  "1日目は興福寺と元興寺、ならまちから、奈良国立博物館、東大寺、春日大社、新薬師寺へ。2日目はレンタサイクルで飛鳥をめぐり、甘樫丘や飛鳥寺、石舞台古墳、橘寺、高松塚古墳とキトラ古墳の壁画体験館へ。3日目は長谷寺から、女人高野・室生寺と室生龍穴神社、弥勒磨崖仏の大野寺まで。電車とバス、自転車でめぐる奈良の2泊3日です。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY1 = [
  cre("興福寺", { h: 9, m: 0, stay: 50, mode: null, min: null, lat: 34.6829744, lng: 135.8318653, address: "奈良県奈良市登大路町48",
    memo: "奈良の旅は、近鉄奈良駅から歩いて約5分の興福寺から始めます。和銅3年（710年）、藤原不比等が平城京への遷都にあわせて、飛鳥の厩坂寺をこの地に移したのが始まりと伝えられる、藤原氏の氏寺です。天平2年（730年）に光明皇后の発願で建てられた五重塔は、今は大規模な保存修理のため素屋根に覆われています。見学できる範囲は公式の案内で確かめましょう。寺の中心の中金堂は、平成30年（2018年）に創建当初の規模で再建されました。" + RESPECT }),
  cre("猿沢池", { h: 9, m: 55, stay: 15, mode: "walk", min: 5, lat: 34.6814362, lng: 135.8309487, address: "奈良県奈良市登大路町",
    memo: "興福寺から南へ石段を下りてすぐ。天平21年（749年）に、興福寺の放生会のための池として造られたと伝えられる、周囲約360mの池です。興福寺の五重塔と柳が水面に映る景色は「南都八景」の一つとして知られています（五重塔は今、修理中です）。池のそばでは足元に気をつけましょう。" }),
  cre("元興寺", { h: 10, m: 20, stay: 45, mode: "walk", min: 10, lat: 34.6776317, lng: 135.8313186, address: "奈良県奈良市中院町11",
    memo: "猿沢池から南へ歩いて約10分。日本で最初の本格的な仏教寺院とされる飛鳥寺（法興寺）を起こりとし、養老2年（718年）、平城京への遷都にあわせてこの地に移されて元興寺となりました。国宝の極楽堂と禅室の屋根には、飛鳥時代の瓦が今も使われています。世界遺産「古都奈良の文化財」の一つです。明日訪ねる飛鳥寺とのつながりも感じてみましょう。" + RESPECT }),
  cre("ならまち", { h: 11, m: 10, stay: 75, mode: "walk", min: 5, lat: 34.675024, lng: 135.830667, address: "奈良県奈良市",
    memo: "元興寺のまわりに広がる、ならまちへ。かつて元興寺の境内だった土地に、江戸から明治のころの格子の町家が残る町で、家々の軒先には「身代わり申」と呼ばれる猿のお守りが下がっています。町家を眺めながら歩き、このあたりで昼食にしましょう。今も人が暮らす町並みです。家の敷地に入ったり、住む人を撮ったりしないようにしましょう。" }),
  cre("奈良国立博物館", { h: 12, m: 45, stay: 60, mode: "walk", min: 20, lat: 34.6830955, lng: 135.8383105, address: "奈良県奈良市登大路町50",
    memo: "ならまちから北へ歩いて約20分。明治28年（1895年）に開館した、仏教美術を中心とした博物館です。なら仏像館では、飛鳥時代から鎌倉時代にかけての仏像を、間近でじっくり見られるように展示しています。毎年秋には、正倉院に伝わる宝物を公開する「正倉院展」が開かれることでも知られます。休館日は公式の案内で確かめましょう。" }),
  upd(ID.todaiji, { h: 14, m: 0, stay: 60, mode: "walk", min: 15, lat: 34.688972, lng: 135.839833, address: "奈良県奈良市雑司町406-1",
    memo: "博物館から北へ歩いて約15分。天平15年（743年）に聖武天皇が大仏造立の詔を出し、天平勝宝4年（752年）に盛大な開眼供養が行われました。本尊の盧舎那仏坐像は像高およそ15m。南大門の金剛力士像は国宝で、鎌倉時代に運慶・快慶らがごく短い期間で造り上げたと伝えられます。今の大仏殿は江戸時代の宝永6年（1709年）の再建で、木造建築としては世界最大級とされます。世界遺産「古都奈良の文化財」の一つです。奈良公園の鹿は野生の動物です。近づきすぎたり、からかったりせず、角や足に気をつけましょう。" + RESPECT }),
  upd(ID.kasuga, { h: 15, m: 20, stay: 45, mode: "walk", min: 20, lat: 34.6813, lng: 135.8481, address: "奈良県奈良市春日野町160",
    memo: "東大寺から若草山のふもとを南へ歩いて約20分。神護景雲2年（768年）、平城京の守護と国民の繁栄を祈るため、藤原永手が勅命を受けて創建したと伝えられる神社です。武甕槌命・経津主命・天児屋根命・比売神の四柱を本殿4棟にまつり、藤原氏の氏神として、氏寺の興福寺とともに手厚く守られてきました。参道の両脇や境内には、およそ3,000基ともいわれる石灯籠・釣灯籠が並びます。" + RESPECT }),
  upd(ID.shinyakushiji, { h: 16, m: 20, stay: 30, mode: "walk", min: 15, lat: 34.6758559, lng: 135.8458849, address: "奈良県奈良市高畑町1352",
    memo: "春日大社から南へ、静かな高畑の町を歩いて約15分。天平19年（747年）、光明皇后が聖武天皇の病気の平癒を願って建てたと伝えられる寺です。国宝の本堂は、創建のころの天平の建築様式を今に伝えるものとされます。本尊の薬師如来坐像は大きく美しい目で知られ、そのまわりを国宝の十二神将立像が守っています。" + RESPECT + "今夜は奈良市内の宿に泊まります。" }),
];

const DAY2 = [
  upd(ID.amakashi, { h: 9, m: 20, stay: 40, mode: null, min: null, lat: 34.479706, lng: 135.815664, address: "奈良県高市郡明日香村豊浦",
    memo: "2日目は飛鳥へ。近鉄奈良駅から近鉄で橿原神宮前駅へ向かい（大和西大寺で乗り換え）、駅の近くのレンタサイクルで自転車を借りて、約20分の甘樫丘へ。『日本書紀』には、7世紀に蘇我蝦夷・入鹿の親子がこの丘のふもとに邸宅を構えていたと記されています。頂上の展望台からは、飛鳥の里と、大和三山と呼ばれる耳成山・畝傍山・天香久山、そして二上山までを見渡せます。一帯は国営飛鳥歴史公園として整えられ、万葉集に詠まれた植物も植えられています。" + BIKE }),
  upd(ID.asukadera, { h: 10, m: 10, stay: 35, mode: "other", min: 10, lat: 34.4786718, lng: 135.820198, address: "奈良県高市郡明日香村飛鳥682",
    memo: "甘樫丘から自転車で約10分。推古4年（596年）、蘇我馬子の発願で建てられた、日本で最初の本格的な仏教寺院と伝えられます。本尊の銅造釈迦如来坐像は「飛鳥大仏」として親しまれ、推古17年（609年）に鞍作鳥（止利仏師）が手がけたと伝わる、現存する日本最古級の仏像で、国の重要文化財です。昨日訪ねた元興寺は、この寺が平城京へ移されたものです。" + RESPECT }),
  upd(ID.manyo, { h: 10, m: 50, stay: 50, mode: "walk", min: 5, lat: 34.47723, lng: 135.822312, address: "奈良県高市郡明日香村飛鳥10",
    memo: "飛鳥寺から歩いて約5分。日本最古の歌集とされる「万葉集」をテーマにした県立の文化施設です。万葉集ゆかりの品々や、歌に詠まれた古代の暮らしを紹介する展示のほか、日本画家による大型の絵画作品も見られます。万葉集に詠まれた花や木が植えられた庭園も見どころです。休館日は公式の案内で確かめましょう。" }),
  cre("酒船石遺跡", { h: 11, m: 45, stay: 20, mode: "other", min: 5, lat: 34.475311, lng: 135.8235272, address: "奈良県高市郡明日香村岡",
    memo: "万葉文化館から自転車で約5分。7世紀中ごろに造られたとみられる祭祀の遺跡で、表面に不思議な模様が刻まれた「酒船石」と呼ばれる石造物が、丘の上に残されています。近くでは湧水施設の遺構も見つかり、水にまつわる古代の国家的な祭祀の場だったと考えられています。何のために使われたのか、はっきりとは分かっていません。丘への坂道では足元に気をつけましょう。" }),
  upd(ID.ishibutai, { h: 12, m: 15, stay: 35, mode: "other", min: 10, lat: 34.4661, lng: 135.8228, address: "奈良県高市郡明日香村島庄254",
    memo: "酒船石遺跡から自転車で南へ約10分。一辺およそ50mの方墳で、国の特別史跡に指定され、2026年には世界遺産「飛鳥・藤原の宮都」の構成資産として登録されました。長い年月の間に盛り土が失われ、巨石を組み合わせた横穴式の石室がむき出しになった、独特の姿で知られます。埋葬されたのは蘇我馬子ではないかという説が有力ですが、はっきりとは分かっていません。石室の中にも入れます。古墳はお墓でもありますので、静かに見学しましょう。" }),
  cre("島庄", { h: 12, m: 55, stay: 55, mode: "walk", min: 5, lat: 34.467278, lng: 135.824097, address: "奈良県高市郡明日香村島庄",
    memo: "石舞台古墳の西どなりには、地元の野菜や古代米を使った料理を出す農村レストランと、旬の農産物や手づくりの工芸品を並べた土産処があります。ここで昼食にしましょう。" }),
  cre("橘寺", { h: 14, m: 0, stay: 30, mode: "other", min: 10, lat: 34.4699277, lng: 135.8179119, address: "奈良県高市郡明日香村橘532",
    memo: "島庄から自転車で西へ約10分。聖徳太子が生まれたと伝えられる地で、太子ゆかりの七大寺の一つとされています。発掘調査では、金堂と塔が東西に並ぶ四天王寺式の伽藍配置だったことも分かりました。境内の「二面石」は、一方が穏やかな顔、もう一方が険しい顔で、人の心の善と悪を表しているといわれます。" + RESPECT }),
  cre("川原寺跡", { h: 14, m: 35, stay: 15, mode: "walk", min: 5, lat: 34.4722013, lng: 135.8173091, address: "奈良県高市郡明日香村川原",
    memo: "橘寺から道をはさんですぐ。飛鳥時代に、橘寺と向かい合うように建てられていた大寺院の跡で、藤原京の時代には大官大寺・薬師寺・飛鳥寺とともに「飛鳥四大寺」に数えられたと伝えられます。礎石が今も残り、かつての伽藍の広さをしのべます。となりには、川原寺の法灯を継ぐという弘福寺も立っています。" }),
  cre("亀石", { h: 14, m: 55, stay: 15, mode: "other", min: 5, lat: 34.4711294, lng: 135.8115766, address: "奈良県高市郡明日香村川原",
    memo: "川原寺跡から自転車で西へ約5分。長さおよそ3.6mの花崗岩に、亀に似た顔が彫られた石造物です。奈良盆地が湖だったころの伝説があり、亀石が今の向きから西を向くと、あたり一帯が泥の海になるといわれています。" }),
  cre("高松塚古墳", { h: 15, m: 20, stay: 40, mode: "other", min: 10, lat: 34.4624561, lng: 135.8055508, address: "奈良県高市郡明日香村平田",
    memo: "亀石から自転車で南西へ約10分。1972年に極彩色の壁画が見つかって大きな話題となった古墳で、女子群像や男子群像、四神、天井の天文図などが描かれ、1974年に国宝に指定されました。壁画は保存のため石室ごと取り出して修理されていてふだんは見られませんが、となりの高松塚壁画館で、見つかったときの姿を再現した模写や石槨の模型を見学できます。" }),
  upd(ID.kitora, { h: 16, m: 10, stay: 30, mode: "other", min: 10, lat: 34.4517373, lng: 135.805082, address: "奈良県高市郡明日香村阿部山67",
    memo: "高松塚古墳から自転車で南へ約10分。2016年に開館した、となりのキトラ古墳とその壁画について学べる体験型の施設です。キトラ古墳の石室には、東西南北を守るとされる青龍・白虎・朱雀・玄武の「四神」や、天文図などの極彩色の壁画が描かれていて、館内の再現展示でその全体の姿を見られます。休館日は公式の案内で確かめましょう。帰りは自転車で約10分の飛鳥駅前の営業所へ。レンタサイクルは借りた所と別の営業所でも返せます（返す時間は公式の案内で）。飛鳥駅から近鉄で奈良市内の宿へ戻ります。" }),
];

const DAY3 = [
  upd(ID.hasedera, { h: 9, m: 0, stay: 80, mode: null, min: null, lat: 34.5350901, lng: 135.9067332, address: "奈良県桜井市初瀬731-1",
    memo: "3日目は、近鉄を乗り継いで近鉄大阪線の長谷寺駅へ。駅から歩いて約20分の長谷寺から始めます。真言宗豊山派の総本山で、西国三十三所の第8番札所です。仁王門から本堂へ続く登廊（重要文化財）は399段の石段で、天井には楕円形の灯籠が吊られています。舞台造りの本堂は国宝で、江戸幕府3代将軍・徳川家光による再建です。春は、登廊から150種・7,000株に及ぶぼたんの花が眺められます。長い石段では足元に気をつけましょう。" + RESPECT }),
  cre("室生寺の門前", { h: 11, m: 40, stay: 55, mode: "train", min: 80, line: "近鉄大阪線（長谷寺→室生口大野）・奈良交通バス（室生口大野駅→室生寺、約14分）", lat: 34.537031, lng: 136.0380042, address: "奈良県宇陀市室生",
    memo: "長谷寺駅へ戻り、近鉄大阪線で室生口大野駅へ。駅からバスで約14分の室生寺で降ります。バスはおよそ1時間に1本なので、時刻は公式の案内で確かめましょう。室生川沿いの参道には、茶屋や土産物屋、料理旅館が並びます。ここで昼食にしましょう。" }),
  upd(ID.murouji, { h: 12, m: 40, stay: 85, mode: "walk", min: 5, lat: 34.5379679, lng: 136.0406198, address: "奈良県宇陀市室生1297",
    memo: "門前から、室生川に架かる朱塗りの太鼓橋を渡って室生寺へ。今の橋は、昭和34年（1959年）の伊勢湾台風で流されたあとに架け直されたものです。奈良時代末の宝亀年間（770〜781年）に、興福寺の僧・賢璟が朝廷の命で造営したとされる寺で、女人禁制だった高野山に対し、女性の参詣が許されていたことから「女人高野」と呼ばれます。金堂と本堂はともに国宝。自然石を積み上げた「鎧坂」を上った先の五重塔も国宝で、屋外の五重塔では日本最小として知られます。春には約3,000株の石楠花が咲きます。石段が続くので、足元に気をつけましょう。" + RESPECT }),
  cre("室生龍穴神社", { h: 14, m: 25, stay: 50, mode: "walk", min: 20, lat: 34.5349683, lng: 136.0471516, address: "奈良県宇陀市室生",
    memo: "室生寺から室生川に沿って東へ、約1km歩いて約20分。水の神・竜神である高龗神をまつる神社です。平安時代には朝廷から雨乞いの使者が遣わされたといわれ、雨乞いの神として知られてきました。神社から山の奥へ進んだ渓流の近くには、竜神がすむと伝えられる「妙吉祥龍穴」があります。山道や渓流沿いは足元に気をつけましょう。" + RESPECT }),
  cre("大野寺", { h: 16, m: 0, stay: 40, mode: "bus", min: 45, line: "奈良交通バス（室生寺→大野寺）", lat: 34.5626852, lng: 136.015676, address: "奈良県宇陀市室生大野",
    memo: "室生寺のバス停まで歩いて戻り、室生口大野駅行きのバスで大野寺へ。宇陀川のほとりに立つ真言宗室生寺派の寺で、室生寺の西の大門にあたる位置にあります。本尊の地蔵菩薩立像は国の重要文化財で、「身代わり地蔵」として知られます。川の向こうの切り立った岩壁には、鎌倉時代に後鳥羽上皇の勅願で、笠置寺の磨崖仏を模して刻まれた弥勒磨崖仏があり、高さ13.8mは国内でもっとも高い磨崖仏ともいわれます。春にはしだれ桜の名所にもなります。" + RESPECT + "帰りは、歩いて約8分の室生口大野駅から近鉄で。3日間の奈良の旅はここまでです。" }),
];

const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.map((d) => d.id).join() !== DAY_IDS.join()) throw new Error("日の構成が想定と違います");
  it.days.forEach((d, i) => {
    if (d.spots.map((s) => s.id).join() !== EXPECTED[i].join()) throw new Error(`${i + 1}日目のスポットが想定と違います`);
  });
  const days = [DAY1, DAY2, DAY3];
  days.forEach((arr, i) => {
    console.log(`\n${i + 1}日目 ${arr.length}か所`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      const name = "id" in x ? `${Object.keys(ID).find((k) => ID[k as keyof typeof ID] === x.id)}(既存)` : (d.name as string);
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  });
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] } });
      for (let i = 0; i < 3; i++) await setDaySpotOrder(DAY_IDS[i], days[i] as never, { tx });
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

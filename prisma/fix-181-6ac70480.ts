/**
 * #181 6ac70480「町家とカフェ、奈良町をぶらり歩く1泊2日ゆったり旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 09:30〜14:15、2日目 2か所 09:30〜11:40 で、帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「ございます」）。
 * 企画運営の指示（2026-10-11）: 猿沢池の采女の伝説は使わない（入水）。#242（0c542f79）の本文と書き分ける。
 *   奈良国立博物館は「なら仏像館」が2026年9月14日から2028年春ごろまで改修で休館（奈良市観光協会）なので、行程から外す。
 *   猿沢池は、采女の話を外すと、ほかのしおり（443379ac・a37b8c79・c97e2205）がすでに書いた話（749年・周囲360m・南都八景）しか残らないので、行程から外す（2か所の写真も外す）
 * 奈良市のほかのしおり（443379ac・a37b8c79・0c542f79・c97e2205・5ffdffa6・7f972333）の本文を読み、使っていない話で書いた
 *   （興福寺: 南都焼き討ちと再建・大和守護・国宝館の阿修羅像、元興寺: 法輪館の五重小塔と庶民信仰、唐招提寺: 支える人々の寄進で伽藍が整った経緯、薬師寺: 薬師寺式伽藍と白鳳伽藍の復興、
 *    新薬師寺: 円形の土壇と十二神将・鎌倉時代の門）。杉岡華邨書道美術館・奈良町にぎわいの家・十輪院・白毫寺・喜光寺・天平うまし館・東院庭園・平城宮跡資料館はほかのしおりにない
 * 電車・バスと歩きの旅（近鉄奈良駅から。奈良市内に泊まる）:
 *   1日目: 興福寺（国宝館）9:30 → 奈良市杉岡華邨書道美術館 → 奈良町にぎわいの家 → ならまち（昼食）→ 十輪院 → 元興寺 → 新薬師寺 → 白毫寺 16:37 → 奈良市内の宿
 *   2日目: 喜光寺 9:30 → 唐招提寺 → 薬師寺 → 朱雀門ひろば 天平うまし館（昼食）→ 東院庭園 → 平城宮跡資料館 16:30 → 大和西大寺駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（奈良市観光協会 https://narashikanko.or.jp/spot/detail_<番号>.html ほか）:
 *   10029 興福寺（南都七大寺の中で最も密接に奈良の街とつながり・1180年の南都焼き討ちでほとんど焼失し、すぐ再建・鎌倉時代に大和守護職・春日社と一体・国宝館・阿修羅像（八部衆）・五重塔は保存修理中）と
 *     検索結果（阿修羅像は奈良時代の脱活乾漆造、高さ約153.4cm）／10048 杉岡華邨書道美術館（かな書の第一人者でかな書の分野で初の文化勲章・1913〜2012・2000年8月開館・「絵を見るように眺めて欲しい」・月曜休館）／
 *   10098 奈良町にぎわいの家（大正6年に古物商が建てた町家・表屋造、蔵は江戸期・茶室、15帖の座敷、金箔の仏間、襖絵・二十四節気・登録有形文化財・水曜休館）／feature/naramachi（平城京の北東部・社寺のまちから
 *     商業、観光のまち・江戸から明治の町屋と寺院・古民家のカフェやレストラン・庚申堂は青面金剛をまつる庚申信仰の拠点）／10035 十輪院（元正天皇の勅願で元興寺の子院とする寺伝・朝野魚養の開基とも・
 *     国宝の本堂の石仏龕（重文）に地蔵菩薩、釈迦如来、弥勒菩薩の浮彫・10:00〜16:30）／10027 元興寺（法興寺から710年の遷都で移転・ならまちの大部分を占めた・僧坊の一部が極楽堂と禅室に・境内から無数の石仏と
 *     民俗資料・法輪館に奈良時代の木造五重小塔（国宝））／10021 新薬師寺（本堂内の円形の土壇・本尊の薬師如来坐像（国宝）・日本で最古最大の奈良時代の十二神将立像（塑像・国宝）・東門、南門、鐘楼、地蔵堂は鎌倉時代、重文）／
 *   /ja/spot/temple/byakugouji/ 白毫寺（高円山の西麓の高台・奈良市街を一望・志貴皇子の山荘跡の言い伝え・鎌倉時代に叡尊が再興・宋版一切経で一切経寺・重文の仏像8体・五色椿は県天然記念物で奈良三名椿の一つ・
 *     萩の寺・9:00〜17:00）／10009 喜光寺（721年に行基が創建・菅原寺・748年に聖武天皇の行幸で本尊から光が放たれ喜光寺の名を賜ったと伝わる・本堂は「試みの大仏殿」・蓮の寺）／10008 唐招提寺（律宗の総本山・
 *     東大寺で5年・和上を支持する人々から居室や宿舎を贈られ、倉庫、食堂、講堂、仮金堂・没後に金堂と東塔・平安時代初頭に伽藍が完成して唐招提寺と称する・奈良時代の金堂と講堂）／
 *   /ja/spot/world_heritage/yakushiji/ 薬師寺（金堂の東西に2つの塔の薬師寺式伽藍配置・各層に裳階の龍宮造り・昭和43年からお写経勧進で白鳳伽藍の復興、金堂、西塔、中門、回廊、玄奘三蔵院、大講堂、食堂）／
 *   /ja/spot/world_heritage/suzakumon_hiroba/ 朱雀門ひろば（2018年完成・5つの館・天平うまし館にレストランとカフェ・復原遣唐使船）と検索結果（天平うまし館のレストランは大和野菜や郷土料理）／
 *   10129 東院庭園（平城宮の東の張り出し部分・L字型の池・皇族の宴会や儀式・1967年に遺構発見、1998年に復原・2010年に特別名勝・入場は16:00まで）／10132 平城宮跡資料館（奈良文化財研究所が1959年から続ける
 *     発掘調査の成果・出土品・役所や宮殿内部のジオラマ・入場は16:00まで）／/ja/spot/museum/narakokuritsu-hakubutsukan/（仏像館の休館）
 * 座標: OSM — 国宝館 way 98093576・十輪院 way 314265251・元興寺 way 218642880・新薬師寺 way 343175186・喜光寺 way 234985057・唐招提寺 way 218644927・薬師寺 way 208682432・
 *   天平うまし館 way 612418482・東院庭園 way 378258859・平城宮跡資料館 relation 6706545（Nominatim の中心）／奈良市杉岡華邨書道美術館 node 2465643485・奈良町にぎわいの家 node 13634935232・
 *   庚申堂 node 3201501110・白毫寺 node 357837548（node は API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-181-6ac70480.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6ac70480-f655-419c-a820-8a2a46acbfd5";
const DAY1_ID = "7e4f74cb-8c11-4e4d-b863-d2d2bd4a17d7";
const DAY2_ID = "ddbd1267-151f-46a8-8388-419a497602c1";
const MUSEUM = "ef803357-9ad0-4513-b86e-d306f8732df0";
const KOFUKUJI = "2417b4b9-421f-48f9-bdbc-3aa4223ab997";
const SARUSAWA = "3bad5ed6-bdd0-4ea8-918e-0a8e76db20cd";
const NARAMACHI = "737f6685-0b63-4904-8ee6-1cb533b3abe4";
const GANGOJI = "001ce333-0d19-4d01-b949-32ee590d7c81";
const TOSHODAIJI = "d6a7c22c-31e1-4a3d-9e2c-372d59e0e5a7";
const YAKUSHIJI = "39c9e1a0-9b62-4d61-9617-c24df81ef39b";
const REMOVE_PHOTOS = ["9578d23b-107d-4f86-adff-eda7b3d3b149", "0a10516e-7e55-4e2a-8803-4c8881824cbc"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "1日目は、興福寺の国宝館から、書道美術館や大正の町家をのぞき、ならまちで昼食。十輪院や元興寺、新薬師寺の十二神将を訪ね、奈良の町を見下ろす白毫寺まで歩きます。2日目は西ノ京へ。行基ゆかりの喜光寺、唐招提寺、薬師寺をめぐり、平城宮跡の朱雀門ひろばで昼食をとって、東院庭園と平城宮跡資料館で奈良の都の姿にふれる1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(KOFUKUJI, { h: 9, m: 30, stay: 60, legs: [], lat: 34.6835329, lng: 135.8325334, address: "奈良県奈良市登大路町48",
    memo: "この旅は電車とバス、歩きでめぐります。近鉄奈良駅から歩いて約5分。南都七大寺の中でも、とくに奈良の町と深く結びついて発展した寺といわれます。1180年の南都焼き討ちで多くのお堂を失いましたが、すぐに建て直され、鎌倉時代には大和の国を実質的に治めるほどの力を持ちました。国宝館には、八部衆の一体で、奈良時代に漆で形づくられた高さ約153cmの阿修羅像をはじめ、天平と鎌倉の時代の仏像が並びます。五重塔は今、修理中です。" + PRAY }),
  cre("奈良市杉岡華邨書道美術館", { h: 10, m: 40, stay: 40, legs: [walk(10)], lat: 34.6779044, lng: 135.8293055, address: "奈良県奈良市脇戸町3",
    memo: "興福寺から南へ、ならまちの入り口へ歩いて約10分。かな書の第一人者で、かな書の分野で初めて文化勲章を受けた書家・杉岡華邨（1913〜2012）の作品を伝えるために開かれた、書道専門の美術館です。平安時代に完成した日本独自の文字「かな」を、現代の造形芸術として洗練させた作品が並びます。「絵を見るように眺めて欲しい」という本人の言葉のとおり、文字の形と余白をゆっくり眺めましょう。休館日は公式の案内で確かめましょう。" }),
  cre("奈良町にぎわいの家", { h: 11, m: 25, stay: 30, legs: [walk(5)], lat: 34.6772344, lng: 135.8303888, address: "奈良県奈良市中新屋町5",
    memo: "美術館から歩いて約5分。大正6年（1917年）に古物商が建てた町家で、「表屋造」と呼ばれる造りの家です（蔵は江戸時代のもの）。茶室や15帖の広い座敷、金箔を張った仏間、襖絵などの意匠が見られ、登録有形文化財になっています。今は、二十四節気に合わせて、季節の町家の暮らしを伝える場になっています。休館日は公式の案内で確かめましょう。" }),
  upd(NARAMACHI, { h: 11, m: 57, stay: 50, legs: [walk(2)], lat: 34.6765429, lng: 135.8298355, address: "奈良県奈良市中新屋町",
    memo: "にぎわいの家から歩いてすぐ。ならまちは、社寺のまちから商いのまち、そして観光のまちへと移り変わってきた地区で、江戸時代から明治時代の町家や寺が今も残ります。古民家を生かしたカフェやレストランも多いので、ここで昼食にしましょう。通りの庚申堂は、青面金剛をまつる、奈良の庚申信仰の拠点です。今も人が暮らしている町なので、静かに歩きましょう。" }, "ならまち（昼食）"),
  cre("十輪院", { h: 12, m: 52, stay: 40, legs: [walk(5)], lat: 34.6763419, lng: 135.8332388, address: "奈良県奈良市十輪院町27",
    memo: "ならまちを東へ歩いて約5分。寺伝では、奈良時代に元正天皇の勅願で建てられ、元興寺の子院の一つだったとされる寺です。国宝の本堂の中には、仏像を納める厨子を石でつくった「石仏龕」（重要文化財）があり、その内側に地蔵菩薩や釈迦如来、弥勒菩薩などが浮彫りで表されています。めずらしい形の石仏を、間近で拝みましょう。" + PRAY }),
  upd(GANGOJI, { h: 13, m: 37, stay: 50, legs: [walk(5)], lat: 34.6776317, lng: 135.8313186, address: "奈良県奈良市中院町11",
    memo: "十輪院から西へ歩いて約5分。かつては今のならまちの大部分を占めた大寺で、今は僧坊の一部を改めた極楽堂と禅室が残ります。中世から庶民の信仰を集め、境内からは数えきれないほどの石仏や民俗資料が見つかりました。法輪館には、奈良時代の木造の五重小塔（国宝）が納められ、昔の塔の姿を今に伝えています。" + PRAY }),
  cre("新薬師寺", { h: 14, m: 52, stay: 50, legs: [walk(25)], lat: 34.6758559, lng: 135.8458849, address: "奈良県奈良市高畑1352",
    memo: "元興寺から東へ、高畑の町を歩いて約25分。本堂の中には円形の土壇が築かれ、中央の本尊・薬師如来坐像（国宝）を、十二神将立像が囲んでいます。十二神将は土でつくられた塑像で、奈良時代のものとしては日本で最も古く大きいとされます。東門や南門、鐘楼、地蔵堂は鎌倉時代の建物で、重要文化財です。" + PRAY }),
  cre("白毫寺", { h: 15, m: 57, stay: 40, legs: [walk(15)], lat: 34.6709963, lng: 135.8512437, address: "奈良県奈良市白毫寺町392",
    memo: "新薬師寺から南へ歩いて約15分。高円山の西のふもとの高台に建つ寺で、境内からは奈良の町を見渡せます。天智天皇の子・志貴皇子の山荘の跡に建てられたという言い伝えがあり、鎌倉時代に叡尊によって建て直されました。中国から伝わった一切経を納めたことから「一切経寺」とも呼ばれ、宝蔵には重要文化財の仏像8体がまつられています。奈良三名椿の一つとされる五色椿の古木があり、秋には参道の石段を萩が彩ります。石段は長いので、足元に気をつけましょう。" + PRAY + "この日は、奈良市内の宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  cre("喜光寺", { h: 9, m: 30, stay: 40, legs: [], lat: 34.6847062, lng: 135.7775541, address: "奈良県奈良市菅原町",
    memo: "近鉄奈良駅から近鉄で大和西大寺駅へ、乗りかえて尼ヶ辻駅へ（約15分）。駅から歩いて約10分。奈良時代、東大寺の大仏づくりに力を尽くした僧・行基が721年に開いた寺で、はじめは土地の名から「菅原寺」と呼ばれました。聖武天皇が訪れたとき、本尊から不思議な光が放たれ、それを喜んだ天皇が「喜光寺」の名を与えたと伝わります。本堂は、大仏殿の雛形として建てられたという言い伝えから「試みの大仏殿」と呼ばれています。蓮の寺としても知られます。" + PRAY }),
  upd(TOSHODAIJI, { h: 10, m: 30, stay: 50, legs: [walk(20)], lat: 34.6757374, lng: 135.7853483, address: "奈良県奈良市五条町13-46",
    memo: "喜光寺から南東へ歩いて約20分。律宗の総本山で、唐から来日した鑑真和上が、戒律を学ぶ場として開いた寺です。和上を慕う人々から住まいや宿舎が贈られ、倉庫や食堂、講義のための講堂、仮の金堂が建てられ、和上が亡くなったあとに金堂や東塔が建って、伽藍が整いました。平安時代のはじめに伽藍がそろったころ、「唐招提寺」と呼ばれるようになったといわれます。奈良時代に建てられた金堂と講堂を、ゆっくり見てまわりましょう。" + PRAY }),
  upd(YAKUSHIJI, { h: 11, m: 35, stay: 61, legs: [walk(15)], lat: 34.6685633, lng: 135.7845628, address: "奈良県奈良市西ノ京町457",
    memo: "唐招提寺から南へ歩いて約15分。金堂を中心に、東と西に2つの塔を置く「薬師寺式伽藍配置」で知られる寺で、建物の各層に裳階と呼ばれるひさしをつけた姿は「龍宮造り」とも呼ばれます。多くの建物は火災や地震で失われましたが、昭和43年から、写経を納めてもらう「お写経勧進」で白鳳伽藍の復興が進められ、金堂、西塔、中門、回廊、玄奘三蔵院、大講堂、食堂が次々に建て直されました。" + PRAY }),
  cre("朱雀門ひろば 天平うまし館（昼食）", { h: 12, m: 50, stay: 50, legs: [walk(3), train(5, "近鉄橿原線"), bus(6, "奈良交通バス（大和西大寺駅→朱雀門ひろば前）")], lat: 34.685313, lng: 135.7934558, address: "奈良県奈良市二条大路南4-6-1",
    memo: "薬師寺から西ノ京駅へ歩き、近鉄で大和西大寺駅へ。バスに乗りかえて約6分の朱雀門ひろば前で降ります（あわせて約15分）。朱雀門ひろばは、平城宮跡の朱雀門の前に2018年にできた広場で、5つの館が並びます。天平うまし館にはレストランとカフェがあり、大和野菜を使った料理などが味わえるので、ここで昼食にしましょう。広場には、復原された遣唐使船も置かれています。" }),
  cre("東院庭園", { h: 14, m: 0, stay: 45, legs: [walk(20)], lat: 34.6896027, lng: 135.8023671, address: "奈良県奈良市法華寺町",
    memo: "朱雀門ひろばから平城宮跡の東側へ歩いて約20分。平城宮の東に張り出した部分にあった庭園で、「東宮」や「東院」と呼ばれていました。L字形の池を中心に、皇族が宴や儀式を催す、迎賓館のような役割があったと考えられています。1967年に遺構が見つかり、研究をもとに1998年に復原され、特に貴重な古代の庭園として特別名勝に指定されました。入場の時間は公式の案内で確かめましょう。" }),
  cre("平城宮跡資料館", { h: 15, m: 5, stay: 85, legs: [walk(20)], lat: 34.692431, lng: 135.7895924, address: "奈良県奈良市佐紀町",
    memo: "東院庭園から平城宮跡を西へ歩いて約20分。奈良文化財研究所が1959年から続けている発掘調査の成果をもとに、平城宮と平城京を紹介する資料館です。平城宮跡から出土した品々のほか、当時の役所や宮殿の中を再現した模型があり、奈良時代の人々の暮らしを知ることができます。入館は閉館の30分前までなので、時間に気をつけましょう。広い宮跡では、日差しと足元に気をつけましょう。帰りは、歩いて約10分の近鉄大和西大寺駅へ向かいましょう。" }),
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
    it.days[0].spots.map((s) => s.id).join() !== [MUSEUM, KOFUKUJI, SARUSAWA, NARAMACHI, GANGOJI].join() ||
    it.days[1].spots.map((s) => s.id).join() !== [TOSHODAIJI, YAKUSHIJI].join()
  )
    throw new Error("構成が想定と違います");
  const photos = it.days[0].spots.filter((s) => s.id === MUSEUM || s.id === SARUSAWA).flatMap((s) => s.photos);
  if (photos.map((p) => p.id).sort().join() !== [...REMOVE_PHOTOS].sort().join()) throw new Error("外す写真が想定と違います");
  const thumbHit = photos.some((p) => p.url === it.thumbnailUrl);
  const kofukuPhoto = it.days[0].spots.find((s) => s.id === KOFUKUJI)!.photos[0];
  console.log(`表紙を変える: ${thumbHit ? "はい → 興福寺の写真 " + kofukuPhoto?.id.slice(0, 8) : "いいえ"}`);
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, ...(thumbHit ? { thumbnailUrl: kofukuPhoto.url } : {}) } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx, remove: [MUSEUM, SARUSAWA] });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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

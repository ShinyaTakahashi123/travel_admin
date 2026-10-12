/**
 * #194 7f8fb644「武家屋敷の内部見学と伝統工芸体験、角館じっくり1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所 10:00〜11:40、2日目 1か所 09:30〜10:40 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   企画運営の判断（2026-10-11、案A）で1泊2日のまま組み、樺細工伝承館は1日目へ移す。冬に閉まる小田野家・岩橋家・松本家は使わない
 * 歩きの旅（JR角館駅から歩いて、角館に泊まる）:
 *   1日目: 角館武家屋敷通り 9:30 → 河原田家 → 石黒家 → 角館歴史村・青柳家 → 外町（昼食）→ 角館樺細工伝承館（実演と体験）→ 古城山 16:30 → 宿
 *   2日目: 天寧寺 9:30 → 松庵寺 → 成就院薬師堂 → 常光院 → 角館總鎮守 神明社 → 角館駅前（昼食）→ 新潮社記念文学館 → 平福記念美術館 → 桧木内川堤 16:30 → 角館駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 角館のほかの4本（afb492ce・c10810bd・0c237404・acb93a0f）と c4f58fdd の本文を読み、同じ文や似た文にならないよう、使っていない話で書いた
 *   （武家屋敷通りは上・中級武士の町とシダレザクラの古い記録、青柳家は覗き窓の黒板塀と万延元年の門、石黒家は用人の家柄と門の木材、伝承館は体験学習と茶室、
 *    新潮社記念文学館は約27,000点の新潮社文庫と展示の構成、平福記念美術館は大江宏の設計と旧制角館中学校の跡、桧木内川堤は409本と樹齢90年をこえる桜の手当て）。
 *   河原田家・古城山・外町の寺社（天寧寺・松庵寺・成就院薬師堂・常光院・神明社）はほかのしおりにない。常光院の戊辰戦争の墓と、松庵寺の小田野直武の生涯の話は入れない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   仙北市 city.semboku.akita.jp/sightseeing/spot/07_buke.html（河原田家: 芦名家の家臣から佐竹北家へ、学者や政治家を出した家、明治24年の四室の主屋は角館の武家住宅の典型、通年公開・
 *   青柳家: 覗き窓のある黒板塀、万延元年（1860）の薬医門、井戸、米蔵、茅葺きの母屋、通年公開・石黒家: 佐竹北家の用人の家柄、嘉永6年に移る、門の木材に文化6年、通年公開・
 *   小田野家、岩橋家、松本家は4〜11月だけの公開）／07_shidare.html（角館のシダレザクラは国の天然記念物・益戸滄洲の記録・明暦2年の佐竹北家の所預かりの後まもなく植えられたと推定）／
 *   07_shiroato.html（古城山城跡: もとは小松山、戸沢氏の館、元和6年に芦名氏がこの山を軸に町割り、佐竹北家が200年以上治めた、クマの出没で園路が閉鎖されることがある）／
 *   07_someiyoshino.html（桧木内川堤ソメイヨシノ: 約1,950m、409本、昭和9年に植樹、国の名勝、樹齢90年をこえ、剪定や病害の防除、樹木医の手当てで長く保つ取り組み）／
 *   densyo/（角館樺細工伝承館: 製作実演・体験学習）／bungakukan/kaku.html・annai.html（新潮社記念文学館: 佐藤義亮の顕彰で平成12年開館、蔵書と社の出版物の寄贈が約27,000点の「新潮社文庫」に、
 *   昭和28年に火除け地広場に建てた胸像、展示は角館の生い立ちと先覚者・新潮社と文人・義亮と秋田、角館・ミニシアター）／hirafuku/keii.html・hira.html（平福記念美術館: 昭和63年開館、
 *   設計は国立能楽堂などの大江宏、佐竹北家家臣の屋敷跡で、百穂の尽力で建てられた旧制角館中学校の校舎のあと、前庭の木は武家屋敷のころのもの・百穂はアララギ派の歌人でもあった・休館日）／
 *   田沢湖・角館観光協会 tazawako-kakunodate.com/spots/5997/（内町: 重伝建、上・中級武士の屋敷、シダレザクラとモミの大木、屋敷割りや枡形）・/en/spots/7168/（伝承館: 昭和53年開館、実演、茶室と眺め）・
 *   /ja/course/8（外町さんぽ: 天寧寺は会津若松の天寧寺から分かれた寺、松庵寺は今宮家と田町の武士団の菩提寺で小田野直武の碑、成就院薬師堂は「峰の薬師さん」、常光院は佐竹北家の菩提寺、
 *   神明社は角館の総鎮守でお伊勢堂、御祭神は天照大御神）・/spots/12983/・12981/・12986/・12987/・/spots/13774/（外町: 商人町、蔵、店やレストラン、明治24年の安藤家のレンガ蔵、ふるさと景観賞）
 * 座標: OSM — 角館のシダレザクラ node 7451188061（attraction）・武家屋敷河原田家 node 2598170931・武家屋敷石黒家 node 2598170890・角館歴史村青柳家 node 2598170891・安藤醸造 仕入水 node 10121192215（natural=spring、外町）
 *   （API で名前つき）／角館樺細工伝承館 relation 14721803・角館城跡 古城山公園 way 775732270・天寧寺 way 1106097785・松庵寺 way 775146316・成就院薬師堂 way 896045040・久米山常光院 way 1106089365・
 *   神明社 way 864670899・角館駅 way 253970108（building=station）・新潮社記念文学館 way 253970106・平福記念美術館 way 253970113・桧木内川堤公園 way 755931873（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-194-7f8fb644.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7f8fb644-170d-4331-b1f5-239e7f103e0c";
const DAY1_ID = "440b1525-7548-4966-bb3f-a11e5bd7d55c";
const DAY2_ID = "64bf226e-791f-43a6-a37d-9fab2a4b8792";
const BUKEYASHIKI = "a6f5acab-f55c-4586-a30e-5cb6d4ea8894";
const DENSYO = "72c5278c-6f95-4aad-9c0c-17cddfe9469e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const DESCRIPTION =
  "1日目は武家屋敷通りで河原田家・石黒家・青柳家の中を見学し、外町で昼食。午後は樺細工伝承館で職人の実演を見て体験し、城跡の古城山へ。2日目は外町の寺社をめぐり、新潮社記念文学館と平福記念美術館で角館ゆかりの人々にふれ、桧木内川堤の桜並木を歩く、角館を歩いてじっくり味わう1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(BUKEYASHIKI, { h: 9, m: 30, stay: 30, legs: [], lat: 39.5989912, lng: 140.5618677, address: "秋田県仙北市角館町表町",
    memo: "この旅は歩いてめぐります。JR角館駅から歩いて約20分。かつての武家町のほぼ真ん中で、上級・中級の武士の屋敷が並んだ一帯です。広い通りに塀が続き、シダレザクラやモミの大木が森のような趣をつくり、道を折り曲げた「枡形」など、武家町らしい町割りも残ります。通りのシダレザクラは国の天然記念物で、江戸時代に訪れた学者・益戸滄洲は、千百の糸を垂れたような長い枝の桜を書き残しています。今も人が暮らす屋敷もあるので、敷地に入ったり住民の方を撮ったりしないようにしましょう。" }),
  cre("河原田家", { h: 10, m: 3, stay: 37, legs: [walk(3)], lat: 39.597202, lng: 140.5626807, address: "秋田県仙北市角館町",
    memo: "通りを南へ歩いて約3分。会津の芦名家の家臣だった家柄で、のちに佐竹北家に仕え、学者や政治家も出しました。明治24年に建てられた、四つの部屋からなる主屋は、角館の武家住宅の典型的な造りで、中に上がって見学できます。" }),
  cre("石黒家", { h: 10, m: 47, stay: 28, legs: [walk(7)], lat: 39.6011819, lng: 140.5617229, address: "秋田県仙北市角館町表町下丁",
    memo: "河原田家から北へ歩いて約7分。佐竹北家の用人を務めた家柄の屋敷で、嘉永6年（1853年）にこの地へ移りました。門の木材には、文化6年（1809年）の年号が残っています。公開の時間は季節で変わるので、公式の案内で確かめましょう。" }),
  cre("角館歴史村・青柳家", { h: 11, m: 17, stay: 50, legs: [walk(2)], lat: 39.60051, lng: 140.5617441, address: "秋田県仙北市角館町表町下丁",
    memo: "石黒家から歩いてすぐ。のぞき窓のある黒板塀に囲まれた屋敷で、門は万延元年（1860年）の薬医門です。敷地には井戸や米蔵が残り、茅葺きの母屋とともに、武家の暮らしの構えを今に伝えています。" }),
  cre("外町（昼食）", { h: 12, m: 22, stay: 50, legs: [walk(15)], lat: 39.5905835, lng: 140.5640765, address: "秋田県仙北市角館町",
    memo: "青柳家から南へ歩いて約15分。武家屋敷の並ぶ内町とは対照的に、商家や蔵が続く、かつての商人の町です。古い建物を生かした店やレストランもあるので、ここで昼食にしましょう。明治24年に建てられたレンガ造りの蔵など、明治の商家の建物も見られます。今も人が暮らす町並みなので、静かに歩きましょう。" }),
  upd(DENSYO, { h: 13, m: 27, stay: 90, legs: [walk(15)], lat: 39.5995317, lng: 140.5611586, address: "秋田県仙北市角館町表町下丁10-1",
    memo: "外町から北へ歩いて約15分。山桜の樹皮を使う角館の樺細工を伝える施設で、職人が品物をつくる実演を間近で見られます。体験学習もあるので、樺細工の手しごとにふれてみましょう（体験は公式の案内で確かめてから申し込みましょう）。館内には茶室もあり、窓の外の景色を眺めながらひと息つけます。" }, "角館樺細工伝承館（実演と体験）"),
  cre("古城山", { h: 15, m: 7, stay: 83, legs: [walk(10)], lat: 39.6054463, lng: 140.5619651, address: "秋田県仙北市角館町",
    memo: "伝承館から北へ歩いて約10分。かつては松が多く「小松山」と呼ばれた山で、戸沢氏の時代には山の上に館が置かれました。元和6年（1620年）に芦名氏が、この山を軸に今の角館の町割りを整え、その後は佐竹北家が200年以上この地を治めました。山頂まで歩いて上ってみましょう。クマの出没で園路が閉じられることもあるので、公式の案内で確かめましょう。" + BEAR + "この日は、角館の町の宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  cre("天寧寺", { h: 9, m: 30, stay: 25, legs: [], lat: 39.5955818, lng: 140.5661444, address: "秋田県仙北市角館町上新町17",
    memo: "宿から外町の方へ。会津若松の天寧寺から分かれた寺で、寛政3年（1791年）に建てられた山門は、角館城から移したものと伝わります。境内には、角館を治めた芦名氏3代の墓所があり、今も地元の人々がお参りしています。" + PRAY }),
  cre("松庵寺", { h: 9, m: 58, stay: 22, legs: [walk(3)], lat: 39.5938793, lng: 140.5660304, address: "秋田県仙北市角館町田町上丁47",
    memo: "天寧寺から歩いて約3分。今宮家と田町に住んだ武士たちの菩提寺です。『解体新書』の解剖図を描いた角館の武士で画家の小田野直武の碑があり、境内には直武の墓もあります。" + PRAY }),
  cre("成就院薬師堂", { h: 10, m: 26, stay: 24, legs: [walk(6)], lat: 39.5938365, lng: 140.5615598, address: "秋田県仙北市角館町西勝楽町3",
    memo: "松庵寺から歩いて約6分。勝楽町がまだ勝楽村だったころから、薬師如来をまつる村の鎮守として「峰の薬師さん」と親しまれてきたお堂です。角館の城主が目の病を治したいと祈ったところ、願いがかなったという言い伝えも残ります。" + PRAY }),
  cre("常光院", { h: 10, m: 52, stay: 33, legs: [walk(2)], lat: 39.5928628, lng: 140.5608281, address: "秋田県仙北市角館町",
    memo: "薬師堂から歩いてすぐ。江戸時代に角館を治めた佐竹北家の菩提寺です。宝暦3年（1753年）に建てられた山門は町でいちばん古い山門とされ、本堂は宝暦13年（1763年）に建てられました。蔵の奥の佐竹北家の墓所は公開されていません。亡くなった方々をしのぶ場所でもあります。" + PRAY }),
  cre("角館總鎮守 神明社", { h: 11, m: 35, stay: 20, legs: [walk(10)], lat: 39.5875597, lng: 140.5628932, address: "秋田県仙北市角館町岩瀬117",
    memo: "常光院から南へ歩いて約10分。角館の町の総鎮守で、「お伊勢堂」とも呼ばれ、天照大御神をまつっています。" + PRAY }),
  cre("角館駅前（昼食）", { h: 12, m: 7, stay: 50, legs: [walk(12)], lat: 39.5917027, lng: 140.571025, address: "秋田県仙北市角館町",
    memo: "神明社から歩いて約12分、JR角館駅の前へ。駅から続く外町には食事の店もあるので、このあたりで昼食にしましょう。" }),
  cre("新潮社記念文学館", { h: 13, m: 7, stay: 70, legs: [walk(10)], lat: 39.5928911, lng: 140.5655624, address: "秋田県仙北市角館町田町",
    memo: "駅前から歩いて約10分。新潮社の創業者・佐藤義亮をたたえる文学館です。義亮がふるさとに贈った自らの蔵書と、社の出版物は、約27,000点の「新潮社文庫」になっています。展示は、角館の生い立ちと先人の紹介、新潮社と文人、義亮と秋田・角館、ミニシアターの4つに分かれています。建物の前には、昭和28年に町の有志が建てた義亮の胸像があります。休館日は公式の案内で確かめましょう。" }),
  cre("平福記念美術館", { h: 14, m: 32, stay: 60, legs: [walk(15)], lat: 39.6019412, lng: 140.5600672, address: "秋田県仙北市角館町表町上丁4-4",
    memo: "文学館から北へ歩いて約15分。昭和63年に開かれた美術館で、建物は国立能楽堂などで知られる建築家・大江宏の設計です。敷地は、日本画家の平福百穂の尽力で建てられた旧制角館中学校の校舎があった場所です。百穂は、アララギ派の歌人としても知られています。休館日は公式の案内で確かめましょう。" }),
  cre("桧木内川堤", { h: 15, m: 37, stay: 53, legs: [walk(5)], lat: 39.5996543, lng: 140.5586314, address: "秋田県仙北市角館町",
    memo: "美術館から歩いて約5分。川沿いの堤に、約1,950mにわたって409本のソメイヨシノが並びます。植えられてから90年をこえ、ソメイヨシノとしては長生きの桜を守るため、枝の手入れや病気の予防、樹木医による手当てが続けられています。花の時期でなくても、川風を受けながら堤を歩いてみましょう。帰りは、角館駅まで歩いて約20分です。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== BUKEYASHIKI ||
    it.days[1].spots.map((s) => s.id).join() !== DENSYO
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: DENSYO }, data: { dayId: DAY1_ID, orderNo: 901 } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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

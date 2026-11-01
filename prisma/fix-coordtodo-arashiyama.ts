/**
 * docs/content/20261030-after-review-coord-todo.md の2件（制作の担当）
 *
 * 【差し戻し後の再提出・2回目】1回目は自分で重心を計算した値を使い、企画運営・法務から
 * 差し戻された。2回目は #9(0582b3c4)の値にそろえたが、#9自体に#33(071e87fd)とのずれ
 * (常寂光寺・二尊院・祇王寺が案内板/碑の点で100〜180mずれ)があったため、企画運営の指示で
 * #33 の値(Nominatimの建物・境内のway、法務が確認)にそろえ直す。対象は3本:
 *   - 94c6f1d5(秋の嵐山・日帰り): 野宮神社・常寂光寺・二尊院・祇王寺・天龍寺
 *   - 0582b3c4(#9、法✅済み): 嵐山公園・嵐電嵐山駅・天龍寺・常寂光寺・二尊院・祇王寺
 *   - 96496141: 嵐山公園(#9と同じ値)
 * 7642cfc7は制作補助2の洗い出しに入るため対象外。
 *
 * 目標値(Nominatim、法務の確認値と一致):
 *   野宮神社 way319336312 35.0177646,135.6741657 / 常寂光寺 way925807376 35.0196917,135.6686463
 *   二尊院 way961234250 35.0215552,135.6678367 / 祇王寺 way693279953(place_of_worship) 35.0235169,135.6668006
 *   天龍寺 way409723494 35.0162243,135.6729408 / 嵐電嵐山駅 way279279195 35.0152234,135.6777003
 *   嵐山公園(中之島) way519319769 35.0119890,135.6782255
 *
 * 歩く時間: routing.openstreetmap.de の routed-foot で、上の新しい点を使って自分で測り直した
 * (2026-11-02)。法務の測り直しとほぼ一致(差は1分未満)。
 *
 * 時刻・滞在・移動の分は、下のdaySpecs(1本のソース)から時刻を計算して表示し、書き込みも同じ
 * daySpecsの値を使う(法務の指摘2026-11-02 01:08: 表示が書き込みとずれないようにするため)。
 *
 * 時刻のずれは、同じ日の滞在で吸収し、終わりの時刻を今より遅くしない(昼食の時刻は動かさない)。
 *   - 94c6f1d5 Day1: 区間の合計が-9分(短縮)のため吸収不要。16:34→16:25(9分早く)で終了。
 *   - #9 Day1: 区間の合計が-3分(短縮)のため吸収不要。16:41→16:38(3分早く)で終了。
 *   - #9 Day4: 下船場所(嵐山側、下記)→新しい常寂光寺の点をrouted-footで測ると12分
 *     (法務の測定も912m・12.2分で一致)。11分から1分延伸のため、常寂光寺の滞在を
 *     35→30→29(あと1分)に短縮して吸収(20分以上を保つ)。これで二尊院(11:49)・祇王寺
 *     (12:23)・鳥居本バス停(昼食、12:59)以降は変更前と完全に同じ。企画運営・法務のOK済み
 *     (2026-11-02)。メモ「下船したら、歩いて約11分」も「約12分」に直す。
 *   - 96496141 Day2: 区間の合計が-4分(短縮)のため吸収不要。全体が4分早くなるだけ。
 *
 * 下船場所(嵐山側)の実測(法務の依頼、2026-11-02): OSM生データ(bbox)から
 * node4539039690「保津川下り下船場」(35.0135421,135.6714667、ferry=yes、
 * operator=保津川遊船企業組合)を発見(法務も同じ点をOSMで確認)。そこから新しい常寂光寺の点
 * (35.0196917,135.6686463)までrouted-footで測ると911.7m・12.4分(≒12分)。
 *
 * メモの「歩いて約N分」も、変わった区間の分にそろえて直した(数字のない文はそのまま)。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

function addMin(hm: { h: number; m: number }, min: number) {
  const total = hm.h * 60 + hm.m + min;
  return { h: Math.floor(total / 60), m: total % 60 };
}
function fmtHm(hm: { h: number; m: number }) {
  return `${String(hm.h).padStart(2, "0")}:${String(hm.m).padStart(2, "0")}`;
}
function t(hm: { h: number; m: number }) {
  return new Date(Date.UTC(1970, 0, 1, hm.h, hm.m));
}

type LegMode = "walk" | "bus" | "train";
type Seg = {
  id: string;
  name: string;
  legMin: number | null; // 直前からの移動分。先頭はnull
  legMode?: LegMode;
  legChanged: boolean; // legをDBに書き込むか
  stayMin: number;
  stayChanged: boolean; // stayDurationMinをDBに書き込むか
  memoOld?: string;
  memoNew?: string;
};

type Day = { label: string; startVisit: { h: number; m: number }; segs: Seg[] };

// ---------- 座標の直し(6本の対象スポットの座標のみ) ----------
type CoordFix = { id: string; name: string; label: string; oldLat: number; oldLng: number; newLat: number; newLng: number };

const coordFixes: CoordFix[] = [
  // 94c6f1d5
  { id: "2ed4f974-6ea9-42c8-8ca0-1dbdd80dd4c2", name: "野宮神社", label: "94c6f1d5", oldLat: 35.017905, oldLng: 135.674299, newLat: 35.0177646, newLng: 135.6741657 },
  { id: "dec99134-5f8e-4344-a2a6-6fac393b92de", name: "常寂光寺", label: "94c6f1d5", oldLat: 35.019639, oldLng: 135.668675, newLat: 35.0196917, newLng: 135.6686463 },
  { id: "7db84cbd-5f99-426a-8009-9369a983183c", name: "二尊院", label: "94c6f1d5", oldLat: 35.021228, oldLng: 135.667881, newLat: 35.0215552, newLng: 135.6678367 },
  { id: "b59f502f-5972-4687-a901-05c5eb07a931", name: "祇王寺", label: "94c6f1d5", oldLat: 35.023389, oldLng: 135.66675, newLat: 35.0235169, newLng: 135.6668006 },
  { id: "39bc8aa5-0bac-45b2-84df-617835386ad1", name: "天龍寺", label: "94c6f1d5", oldLat: 35.015612, oldLng: 135.673368, newLat: 35.0162243, newLng: 135.6729408 },
  // #9(0582b3c4)
  { id: "0c474033-e873-4ca2-8614-89c0566eeca4", name: "嵐山公園", label: "#9", oldLat: 35.012216, oldLng: 135.679814, newLat: 35.011989, newLng: 135.678226 },
  { id: "0c425786-da71-4077-bb92-f5f6647a6591", name: "嵐電嵐山駅", label: "#9", oldLat: 35.015009, oldLng: 135.677501, newLat: 35.0152234, newLng: 135.6777003 },
  { id: "68f40941-dbb1-464a-9f23-c06effd06a5b", name: "天龍寺", label: "#9", oldLat: 35.015612, oldLng: 135.673368, newLat: 35.0162243, newLng: 135.6729408 },
  { id: "03fc46e8-0544-43ef-856d-679058f48d51", name: "常寂光寺", label: "#9", oldLat: 35.01965, oldLng: 135.669774, newLat: 35.0196917, newLng: 135.6686463 },
  { id: "86b3ac09-ec33-48a6-bf1b-6ad7f01e6054", name: "二尊院", label: "#9", oldLat: 35.021776, oldLng: 135.669734, newLat: 35.0215552, newLng: 135.6678367 },
  { id: "1bcfe36b-c3de-47d8-becc-bb727e504ff6", name: "祇王寺", label: "#9", oldLat: 35.023249, oldLng: 135.668716, newLat: 35.0235169, newLng: 135.6668006 },
  // 96496141
  { id: "781892cd-dde1-42fa-9350-bf525ed3dee2", name: "嵐山公園", label: "96496141", oldLat: 35.012216, oldLng: 135.679814, newLat: 35.011989, newLng: 135.678226 },
];

// ---------- メモ(古い文/新しい文) ----------
const TOGETSUKYO_MEMO_OLD =
  "祇王寺から歩いておよそ2km、30分ほどで着く、嵐山のシンボルです。平安時代に橋が架けられた当初は近くの法輪寺にちなみ「法輪寺橋」と呼ばれていましたが、鎌倉時代、亀山上皇が満月の夜に舟遊びをした際、天空を移る月が橋の上を渡っていくように見えたことから「渡月橋」と呼ばれるようになったと伝えられています。現在の橋は昭和9年に架け替えられた鉄骨コンクリート製ですが、景観に配慮して欄干は昔ながらの木造風に仕上げられているのも隠れたこだわり。桂川の向こうに紅葉の嵐山が広がる、絵になる眺めです。橋のたもとを少し散策してから、天龍寺の塔頭・宝厳院へ向かいましょう。";
const TOGETSUKYO_MEMO_NEW = TOGETSUKYO_MEMO_OLD.replace("30分ほど", "26分ほど");

const NINE_TENRYUJI_MEMO_OLD =
  "昼食のあと、参道を歩いて約4分。嵯峨野を代表する世界遺産の禅寺です。南北朝の争いで亡くなった後醍醐天皇の菩提を弔うため、足利尊氏が夢窓疎石を開山として建立したと伝えられ、造営費を補うために中国との貿易船「天龍寺船」を送り出した逸話も残ります。曹源池庭園は、夢窓疎石が手がけた池と石組みが700年近く創建当初の姿をとどめていると言われる名庭で、日本で初めて史跡・特別名勝に指定されたとされています。嵐山や亀山を借景に取り込み、池の向こうに広がる山並みまで一つの絵のように見えるよう計算されているのが見事です。静かに、敬意をもって拝観しましょう。次はレトロな嵐電嵐山駅へ、駅の足湯で少し休憩しましょう。";
const NINE_TENRYUJI_MEMO_NEW = NINE_TENRYUJI_MEMO_OLD.replace("約4分", "約2分");

const NINE_RANDEN_MEMO_OLD =
  "天龍寺から歩いて約7分、レトロな路面電車のターミナル駅へ。1910年に嵐山電車軌道の駅として開業し、2013年のリニューアルでホーム内に嵐山温泉の足湯が整いました。少し休憩するのにぴったりです。周囲には着物姿の柱が並ぶ「キモノフォレスト」も広がり、電車を待つ時間も嵐山らしい風情を味わえます。";
const NINE_RANDEN_MEMO_NEW = NINE_RANDEN_MEMO_OLD.replace("約7分", "約8分");

const NINE_PARK_MEMO_OLD =
  "嵐電嵐山駅から歩いて約8分、渡月橋のたもとに広がる公園に着きます。上流の「亀山地区」は、山の形が亀の甲羅に似ていることが名前の由来と伝えられています。桂川の中州には「中之島地区」もあり、四季を通じて桜や紅葉が楽しめるほか、アカマツの茂る亀山地区からは保津峡の入口までの眺望も広がります。今日はここまでです。嵐山・嵯峨野エリアでの宿で、ゆっくり休みましょう。";
const NINE_PARK_MEMO_NEW = NINE_PARK_MEMO_OLD.replace("約8分", "約6分");

const NINE_NISONIN_MEMO_OLD =
  "常寂光寺から歩いて約5分。総門から本堂までまっすぐ続く参道が名物の古刹です。平安時代、嵯峨天皇の勅願を受けて慈覚大師円仁が開いたと伝えられ、鎌倉時代に法然の弟子・湛空が復興しました。寺の名は、本堂に並んで祀られる2体の仏像「発遣の釈迦如来」「来迎の阿弥陀如来」に由来します。四季を通じてもみじと桜に彩られる参道は、季節を変えて何度でも歩きたくなる道です。静かに、敬意をもって拝観しましょう。";
const NINE_NISONIN_MEMO_NEW = NINE_NISONIN_MEMO_OLD.replace("約5分", "約8分");

const NINE_GIOJI_MEMO_OLD =
  "二尊院から歩いて約3分。平家物語ゆかりの、こぢんまりとした尼寺です。平清盛に寵愛された白拍子・祇王は、新しく現れた仏御前に心変わりされ、母や妹とともにこの地で出家したと伝えられ、後に仏御前自身もここを訪ね、ともに暮らしたという逸話も残ります。明治時代にいったん廃れて荒れ果てましたが、元・京都府知事の北垣国道が別荘の茶室を寄進し、文人画家・富岡鉄斎らの尽力で明治28年に再興されたという、もう一つのドラマも秘めています。静かに、敬意をもって拝観しましょう。";
const NINE_GIOJI_MEMO_NEW = NINE_GIOJI_MEMO_OLD.replace("約3分", "約9分");

const NINE_TORIIMOTO_MEMO_OLD =
  "祇王寺から歩いて約11分。嵯峨鳥居本の町並みの入口にあたるこのあたりには食事ができる店があるので、ここで昼食にしましょう。";
const NINE_TORIIMOTO_MEMO_NEW = NINE_TORIIMOTO_MEMO_OLD.replace("約11分", "約12分");

const NINE_JOJAKKOJI_MEMO_OLD =
  "下船したら、歩いて約11分の小倉山の中腹に建つ古寺へ。安土桃山時代に日蓮宗の僧・日禎が開いたとされ、寺の名は仏教が説く理想の浄土「常寂光土」になぞらえて名づけられたと伝えられています。歌人・藤原定家が『小倉百人一首』を編んだという山荘「時雨亭」の跡地との説もあるこの一帯、茅葺きの仁王門から多宝塔へ続く石段からは、四季折々の小倉山の景色が眺められます。静かに、敬意をもって拝観しましょう。";
const NINE_JOJAKKOJI_MEMO_NEW = NINE_JOJAKKOJI_MEMO_OLD.replace("約11分", "約12分");

const OKI_PARK_MEMO_OLD =
  "清凉寺から歩いて約21分。渡月橋を挟んで桂川の両岸に広がる公園です。上流側の「亀山地区」は、小倉山から続く尾根が亀の甲羅のように盛り上がって見えることが名前の由来と伝えられています。桂川の中州には「中之島地区」もあります。アカマツやサクラ、カエデが茂る亀山地区からは、保津峡の入口まで見渡す眺望が楽しめます。渡月橋のたもとから、少し足をのばして自然の中を歩いてみましょう。";
const OKI_PARK_MEMO_NEW = OKI_PARK_MEMO_OLD.replace("約21分", "約19分");

const OKI_MONKEY_MEMO_OLD =
  "嵐山公園から歩いて約5分。嵐山の山中に暮らす野生のニホンザルに出会える公園です。1954年、京都大学の研究者たちがこの地のサルの観察を始め、1957年に一般公開できるよう整備されたのが始まりと伝えられています。現在も「嵐山群」と呼ばれる1群が暮らし、70年近くにわたる観察で全個体の親子関係が記録されているという、世界的にも珍しい調査対象です。人がサルに危害を加えないルールが徹底された結果、サルが人を恐れず自然な姿を見せてくれます。山頂からは嵐山や京都市街の絶景も広がります。";
const OKI_MONKEY_MEMO_NEW = OKI_MONKEY_MEMO_OLD.replace("約5分", "約3分");

// ---------- 1本のソース: 時刻・滞在・移動の分。表示も書き込みもここから ----------
const days: Day[] = [
  {
    label: "94c6f1d5 Day1",
    startVisit: { h: 9, m: 0 },
    segs: [
      { id: "39bc8aa5-0bac-45b2-84df-617835386ad1", name: "天龍寺", legMin: null, legChanged: false, stayMin: 60, stayChanged: false },
      { id: "ad188451-76f7-4c0f-8420-445c7be932c7", name: "竹林の小径", legMin: 4, legMode: "walk", legChanged: true, stayMin: 20, stayChanged: false },
      { id: "2ed4f974-6ea9-42c8-8ca0-1dbdd80dd4c2", name: "野宮神社", legMin: 4, legMode: "walk", legChanged: true, stayMin: 25, stayChanged: false },
      { id: "bef2ad6a-dd72-42b6-874e-20715fe89655", name: "大河内山荘", legMin: 5, legMode: "walk", legChanged: true, stayMin: 45, stayChanged: false },
      { id: "dec99134-5f8e-4344-a2a6-6fac393b92de", name: "常寂光寺", legMin: 6, legMode: "walk", legChanged: true, stayMin: 50, stayChanged: false },
      { id: "7db84cbd-5f99-426a-8009-9369a983183c", name: "二尊院", legMin: 8, legMode: "walk", legChanged: true, stayMin: 40, stayChanged: false },
      { id: "b59f502f-5972-4687-a901-05c5eb07a931", name: "祇王寺", legMin: 9, legMode: "walk", legChanged: true, stayMin: 30, stayChanged: false },
      { id: "eaea1d4e-d05e-4f56-baa6-e517391b1f91", name: "渡月橋", legMin: 26, legMode: "walk", legChanged: true, stayMin: 45, stayChanged: false, memoOld: TOGETSUKYO_MEMO_OLD, memoNew: TOGETSUKYO_MEMO_NEW },
      { id: "fd92e2c2-241f-43c0-9e79-f488f9751a26", name: "宝厳院", legMin: 8, legMode: "walk", legChanged: false, stayMin: 60, stayChanged: false },
    ],
  },
  {
    label: "#9 Day1",
    startVisit: { h: 11, m: 45 },
    segs: [
      { id: "48150c24-fe8a-49bc-8ab3-e40274ac7973", name: "竹林の道", legMin: null, legChanged: false, stayMin: 60, stayChanged: false },
      { id: "eafc1185-98bd-4fa7-acbf-78ec0c1235e4", name: "天龍寺の北門のあたり", legMin: 2, legMode: "walk", legChanged: false, stayMin: 45, stayChanged: false },
      { id: "68f40941-dbb1-464a-9f23-c06effd06a5b", name: "天龍寺", legMin: 2, legMode: "walk", legChanged: true, stayMin: 70, stayChanged: false, memoOld: NINE_TENRYUJI_MEMO_OLD, memoNew: NINE_TENRYUJI_MEMO_NEW },
      { id: "0c425786-da71-4077-bb92-f5f6647a6591", name: "嵐電嵐山駅", legMin: 8, legMode: "walk", legChanged: true, stayMin: 45, stayChanged: false, memoOld: NINE_RANDEN_MEMO_OLD, memoNew: NINE_RANDEN_MEMO_NEW },
      { id: "0c474033-e873-4ca2-8614-89c0566eeca4", name: "嵐山公園", legMin: 6, legMode: "walk", legChanged: true, stayMin: 55, stayChanged: false, memoOld: NINE_PARK_MEMO_OLD, memoNew: NINE_PARK_MEMO_NEW },
    ],
  },
  {
    label: "#9 Day4",
    startVisit: { h: 9, m: 0 },
    segs: [
      { id: "2e777cc6-dc0a-4bc0-85f5-2ec9750a4416", name: "保津川下り乗船場", legMin: null, legChanged: false, stayMin: 120, stayChanged: false },
      { id: "03fc46e8-0544-43ef-856d-679058f48d51", name: "常寂光寺", legMin: 12, legMode: "walk", legChanged: true, stayMin: 29, stayChanged: true, memoOld: NINE_JOJAKKOJI_MEMO_OLD, memoNew: NINE_JOJAKKOJI_MEMO_NEW },
      { id: "86b3ac09-ec33-48a6-bf1b-6ad7f01e6054", name: "二尊院", legMin: 8, legMode: "walk", legChanged: true, stayMin: 25, stayChanged: true, memoOld: NINE_NISONIN_MEMO_OLD, memoNew: NINE_NISONIN_MEMO_NEW },
      { id: "1bcfe36b-c3de-47d8-becc-bb727e504ff6", name: "祇王寺", legMin: 9, legMode: "walk", legChanged: true, stayMin: 24, stayChanged: true, memoOld: NINE_GIOJI_MEMO_OLD, memoNew: NINE_GIOJI_MEMO_NEW },
      { id: "43d82bdb-e959-465d-ac7a-2229c311bed3", name: "鳥居本バス停", legMin: 12, legMode: "walk", legChanged: true, stayMin: 30, stayChanged: false, memoOld: NINE_TORIIMOTO_MEMO_OLD, memoNew: NINE_TORIIMOTO_MEMO_NEW },
      { id: "603c7268-0634-4cd0-8a56-454d3535ab8e", name: "化野念仏寺", legMin: 7, legMode: "walk", legChanged: false, stayMin: 35, stayChanged: false },
      { id: "224fa9db-a29f-49a6-8772-b38f915ecf75", name: "愛宕念仏寺", legMin: 10, legMode: "walk", legChanged: false, stayMin: 28, stayChanged: false },
    ],
  },
  {
    label: "96496141 Day2",
    startVisit: { h: 9, m: 3 },
    segs: [
      { id: "35926878-32ef-4bc7-ab4a-3f1334f456fd", name: "清凉寺（嵯峨釈迦堂）", legMin: null, legChanged: false, stayMin: 58, stayChanged: false },
      { id: "781892cd-dde1-42fa-9350-bf525ed3dee2", name: "嵐山公園", legMin: 19, legMode: "walk", legChanged: true, stayMin: 41, stayChanged: false, memoOld: OKI_PARK_MEMO_OLD, memoNew: OKI_PARK_MEMO_NEW },
      { id: "3b34a879-af13-4b29-a6bf-e7051a789cc4", name: "嵐山モンキーパークいわたやま", legMin: 3, legMode: "walk", legChanged: true, stayMin: 58, stayChanged: false, memoOld: OKI_MONKEY_MEMO_OLD, memoNew: OKI_MONKEY_MEMO_NEW },
      { id: "51c5f14e-b5af-432f-994e-5d6a77046639", name: "法輪寺（嵯峨）", legMin: 6, legMode: "walk", legChanged: false, stayMin: 40, stayChanged: false },
      { id: "d73cd53b-c244-4f0c-bea1-cbf3bfa9c621", name: "車折神社", legMin: 10, legMode: "bus", legChanged: false, stayMin: 67, stayChanged: false },
      { id: "279b33a0-5b7a-4a03-b67f-ced675be8fa1", name: "鹿王院", legMin: 10, legMode: "walk", legChanged: false, stayMin: 40, stayChanged: false },
      { id: "3644523a-e113-4373-8a07-5760e4bca79e", name: "広隆寺", legMin: 8, legMode: "train", legChanged: false, stayMin: 85, stayChanged: false },
    ],
  },
];

function computeAndFormat(day: Day) {
  let cur = day.startVisit;
  const parts: string[] = [];
  const visits: { h: number; m: number }[] = [];
  for (const seg of day.segs) {
    if (seg.legMin != null) cur = addMin(cur, seg.legMin);
    visits.push(cur);
    const legStr = seg.legMin != null ? `,${seg.legMode}${seg.legMin}` : "";
    parts.push(`${seg.name} ${fmtHm(cur)}(${seg.stayMin}${legStr})`);
    cur = addMin(cur, seg.stayMin);
  }
  return { line: parts.join(" → ") + ` 終了${fmtHm(cur)}`, visits };
}

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  console.log("\n--- 座標の確認 ---");
  for (const f of coordFixes) {
    const spot = await prisma.spot.findUniqueOrThrow({ where: { id: f.id } });
    if (spot.name !== f.name) throw new Error(`${f.id}: name現在値が期待と不一致 (${spot.name})`);
    if (spot.lat == null || spot.lng == null) throw new Error(`${f.id}(${f.name}): 座標が未設定`);
    const curLat = Number(spot.lat);
    const curLng = Number(spot.lng);
    if (Math.abs(curLat - f.oldLat) > 1e-6 || Math.abs(curLng - f.oldLng) > 1e-6) {
      throw new Error(`${f.id}(${f.name}): 現在の座標が期待と不一致 (${curLat},${curLng})`);
    }
    console.log(`[${f.label}] ${f.name}: ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}`);
  }

  const dayVisits: { day: Day; visits: { h: number; m: number }[] }[] = [];
  for (const day of days) {
    console.log(`\n--- ${day.label} 時刻・区間(daySpecsから計算) ---`);
    const { line, visits } = computeAndFormat(day);
    console.log(line);
    dayVisits.push({ day, visits });
  }

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const f of coordFixes) {
        await tx.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } });
      }

      for (const { day, visits } of dayVisits) {
        for (let i = 0; i < day.segs.length; i++) {
          const seg = day.segs[i];
          const needsWrite = seg.legChanged || seg.stayChanged || i > 0; // 先頭以外は常にvisitTimeを書く(cascade反映)
          if (!needsWrite) continue;

          const data: Record<string, unknown> = {};
          if (i > 0) data.visitTime = t(visits[i]);
          if (seg.stayChanged) data.stayDurationMin = seg.stayMin;
          if (seg.legChanged && seg.legMin != null) {
            data.transitLegs = { deleteMany: {}, create: [{ orderNo: 1, transitMode: seg.legMode, transitDurationMin: seg.legMin }] };
          }
          if (seg.memoOld != null) {
            const spot = await tx.spot.findUniqueOrThrow({ where: { id: seg.id } });
            if (spot.memo !== seg.memoOld) throw new Error(`${seg.name}: memo現在値が期待と不一致`);
            data.memo = seg.memoNew;
          }
          await tx.spot.update({ where: { id: seg.id }, data });
        }
      }
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());

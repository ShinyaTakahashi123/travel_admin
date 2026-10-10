/**
 * #32 27e93f15（由布院）企画運営の指摘(2026-09-30 11:07/11:08)・法務の指摘(11:07)を
 * まとめて対応する大きな組み直し。
 *
 * 1) 城島高原パーク(185分、決まりA水増し・遊園地の宣伝・タイトルと不整合)を削除。
 * 2) 由布院空想の森アルテジオ(開館10:00、公式確認)の前に狭霧台を回す順番に変更。
 * 3) 1日目は歩いて回れる由布院の中で組み直し。九重"夢"大吊橋(車35分の突然の
 *    移動手段変更・滞在80分も長い)を削除し、COMICO ART MUSEUM YUFUIN(実在、
 *    現代アートの美術館)・大杵社(実在、宇奈岐日女神社の末社、樹齢1000年以上の
 *    大杉、国天然記念物)を追加。1日目は最後まで徒歩で統一。
 * 4) 2日目、城島高原パークを外した分は、別府の地獄めぐりを海地獄・鬼山地獄・
 *    血の池地獄・龍巻地獄の4か所から、鬼石坊主地獄・かまど地獄・白池地獄を加えた
 *    7か所に拡張(すべて実在、鉄輪エリアに密集)。昼食は地獄蒸し工房鉄輪(実在、
 *    地獄の噴気で調理を体験できる施設)で確保。すべての地獄に、柵の外に出ない
 *    旨の安全の一言を追加。龍巻地獄は間欠泉の周期(30〜40分)を待つ時間を含め70分に。
 * 5) 金鱗湖「朝食を挟んで」が実質1分しかなかった問題を、金鱗湖の滞在を65分にして
 *    湖畔のカフェでの朝食を含める形で解消。
 * 6) 口調: 宇奈岐日女神社・金鱗湖の「ご案内するのは」を削除。金鱗湖の
 *    「確実にご覧いただけるとは限りませんが」→「見られるとは限りませんが」。
 * 7) タイトル・説明文を、別府の地獄めぐりを含む今の中身に合わせて変更。
 *
 * 座標: Nominatim確認。地獄蒸し工房鉄輪・かまど地獄・白池地獄・鬼石坊主地獄・
 * 大杵社・COMICO ART MUSEUM YUFUINはすべて実在・住所確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

const YUFUIN_EKI_ID = "ed65cc48-464e-4b14-aa61-a8adb46d4426";
const YUNOTSUBO_ID = "e1497db9-5d65-4abd-8f4c-774bbf45b22e";
const FLORAL_ID = "4cca95e3-f128-4b90-99f6-c3d04c362c42";
const UNAGIHIME_ID = "7add311e-aa32-4415-b20f-8691f7da20be";
const STAINEDGLASS_ID = "bdb2e3bf-f55e-4c65-8b9d-498f9594fb4d";

const KINRINKO_ID = "7133984e-afce-4a38-a4c0-551ce9018f51";
const SHIMONOYU_ID = "564db84b-cef1-4048-b295-6d7e5cabe533";
const ARTEGIO_ID = "99d00c45-5eb0-4614-8c05-ecb69c412cde";
const SAGIRIDAI_ID = "2b3fcdbc-ca21-46b1-a0d1-27fb0c7ef97a";
const KIJIMA_ID = "5802e84f-8270-4dda-b678-7f29b00902b4"; // 削除
const UMIJIGOKU_ID = "596d7172-5a7c-4c12-91ac-cf3758cace64";
const ONIYAMAJIGOKU_ID = "ebaa09b1-2241-4ec7-9155-1f892107e59a";
const CHINOIKEJIGOKU_ID = "2b9f84d2-b507-48ce-ae1f-0c4180a77018";
const TATSUMAKIJIGOKU_ID = "14c356b3-fc47-4930-a295-a4b31cddeab7";

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
  });
  const day1Id = days[0].id;
  const day2Id = days[1].id;

  const NEW_TITLE = "金鱗湖の朝霧と由布院温泉、別府の地獄めぐりへ 冬の湯どころ1泊2日";
  const NEW_DESCRIPTION =
    "由布院の金鱗湖と温泉街を歩き、木立に囲まれた古社や現代アートの美術館をめぐる1日目。2日目は足を延ばして別府温泉へ、地獄蒸しの昼食を挟みながら、色とりどりの地獄めぐりを楽しむ、冬ならではの湯どころ満喫プランです。";

  // ---------- Day1 ----------
  const day1Spots: SpotOrderItem[] = [
    {
      id: YUFUIN_EKI_ID,
      data: {
        memo: "1日目は、建築家・磯崎新氏が設計した由布院駅からです。平成2年(1990)に竣工した木造の駅舎で、礼拝堂をイメージしたという高さ12mの吹き抜けロビーが特徴です。改札口を設けず、ホームまで一続きに抜けられる造りになっており、待合室を兼ねたアートギャラリーや、ホームの足湯も見どころです。この後は、歩いておよそ10分、COMICO ART MUSEUM YUFUINへ向かいましょう。",
      },
    },
    {
      create: {
        name: "COMICO ART MUSEUM YUFUIN",
        address: "大分県由布市湯布院町川上2995-1",
        lat: 33.265269,
        lng: 131.361577,
        memo: "由布院駅から歩いておよそ10分、COMICO ART MUSEUM YUFUINに着きます。国内外の現役アーティストによる企画展を、季節ごとに入れ替えながら紹介する小さな美術館です。由布院の自然に溶け込むような建物の中で、現代アートをじっくりと鑑賞できます。この後は、歩いておよそ9分、湯の坪街道へ向かいましょう。",
        visitTime: t(9, 40),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      id: YUNOTSUBO_ID,
      data: {
        memo: "COMICO ART MUSEUM YUFUINから歩いておよそ9分、湯の坪街道に着きます。金鱗湖まで、およそ800mにわたって続く由布院温泉のメインストリートで、カフェや雑貨店、食べ歩きグルメの店などおよそ70以上が軒を連ねています。かつて小さな山あいの温泉街だった由布院は、昭和27年(1952)に持ち上がったダム建設計画に地元の人々が反対し、自然豊かな景観を生かした観光地づくりを選んだことから、今の姿へと発展してきました。この通りは、平成に入ってから本格的に賑わいを見せるようになったといわれています。冬場は行き交う人の吐く息も白く、あたりに立ちこめる湯けむりが、いっそう温泉地らしい風情を醸し出します。続いては由布院フローラルヴィレッジへ向かいましょう。",
        visitTime: t(10, 49),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 9,
      },
    },
    {
      id: FLORAL_ID,
      data: {
        memo: "湯の坪街道から歩いておよそ4分、英国の街並みをイメージした由布院フローラルヴィレッジに着きます。石畳の小径に、色とりどりの花と小さな洋風の建物が並び、雑貨店やスイーツ店、動物とふれあえる施設などが軒を連ねています。写真映えする街並みを、ゆっくりと散策してみてください。軽食を楽しめるお店もあるので、ここでお昼をとるのもおすすめです。続いては宇奈岐日女神社へ向かいましょう。",
        visitTime: t(12, 23),
        stayDurationMin: 90,
        transitMode: "walk",
        transitDurationMin: 4,
      },
    },
    {
      id: UNAGIHIME_ID,
      data: {
        memo: "由布院フローラルヴィレッジから歩いておよそ15分、宇奈岐日女神社に着きます。由布院盆地の総鎮守とされる古社で、6柱の神を祀っています。うっそうとした木立に囲まれた境内は、温泉街の賑わいとは違う、静かで厳かな空気に包まれています。静かに、敬意をもってお参りください。続いては由布院ステンドグラス美術館へ向かいましょう。",
        visitTime: t(14, 8),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 15,
      },
    },
    {
      id: STAINEDGLASS_ID,
      data: {
        memo: "宇奈岐日女神社から歩いておよそ5分、由布院ステンドグラス美術館に着きます。ヨーロッパをはじめ世界各地から集められたアンティークステンドグラスの作品を展示する美術館で、窓越しに差し込む光が、色とりどりのガラスを通して幻想的な模様を映し出します。この後は、歩いておよそ16分、大杵社へ向かいましょう。",
        visitTime: t(14, 53),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 5,
      },
    },
    {
      create: {
        name: "大杵社",
        address: "大分県由布市湯布院町川南",
        lat: 33.252734,
        lng: 131.357661,
        memo: "由布院ステンドグラス美術館から歩いておよそ16分、大杵社に着きます。宇奈岐日女神社の末社で、拝殿のかたわらにそびえる大杉は、樹齢1000年以上ともいわれ、国の天然記念物に指定されています。高さおよそ38m、幹まわりおよそ11mという堂々とした姿は、長い年月を見守ってきた由布院の自然を象徴する存在です。静かに、敬意をもってお参りください。由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終了です。お疲れさまでした。",
        visitTime: t(15, 59),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 16,
        transitLine: null,
      },
    },
  ];

  // ---------- Day2 ----------
  const day2Spots: SpotOrderItem[] = [
    {
      id: KINRINKO_ID,
      data: {
        memo: "2日目は金鱗湖からです。由布岳を望む小さな湖で、かつては岳の麓にあることから「岳下の池」と呼ばれていました。明治17年(1884)、この地を訪れた儒学者・毛利空桑が、夕日に照らされて金色に輝く魚の鱗を見て「金鱗湖」と名付けたと伝えられています。湖の底からは温泉と清水の両方が湧き出しており、冷え込む朝には、湖面と外気の温度差によって、幻想的な朝霧が立ち込めることがあります。霧の発生は、その日の気象条件次第のため、見られるとは限りませんが、もし出会えれば、由布岳を借景にした、息をのむほど美しい光景が広がります。凛とした冬の空気の中、静けさに包まれた湖畔を、ゆっくりと歩いてみてください。湖畔のカフェで朝食をとりながら、静かな朝のひとときを過ごしましょう。続いては下ん湯へ向かいましょう。",
        stayDurationMin: 65,
      },
    },
    {
      id: SHIMONOYU_ID,
      data: {
        memo: "金鱗湖のほとりから歩いてすぐ、地元の人に親しまれてきた共同浴場、下ん湯に着きます。金鱗湖の湖畔にひっそりとたたずむ小さな湯小屋で、由布院温泉の素朴な歴史を今に伝える場所です。朝の静けさの中、湖を眺めながら過ごすひとときを味わってみてください。共同浴場なので、中をのぞいたり撮影したりしないようにしましょう。この後は、車でおよそ8分、狭霧台へ向かいましょう。",
        visitTime: t(8, 6),
        stayDurationMin: 35,
      },
    },
    {
      id: SAGIRIDAI_ID,
      data: {
        memo: "下ん湯から車でおよそ8分、狭霧台に着きます。由布院盆地を見下ろす高台にある展望地で、由布岳を背景に、盆地に広がる田園風景を一望できます。名前の通り、霧が立ち込める朝にはひときわ幻想的な眺めとなり、金鱗湖の朝霧とはまた違った、由布院盆地全体を覆う雲海のような景色に出会えることもあります。この後は、車でおよそ9分、由布院空想の森アルテジオへ向かいましょう。",
        visitTime: t(8, 49),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 8,
      },
    },
    {
      id: ARTEGIO_ID,
      data: {
        memo: "狭霧台から車でおよそ9分、由布院空想の森アルテジオに着きます。宿「山荘無量塔」の敷地内にある美術館で、音楽にまつわる美術作品を集めた展示室には、いつも静かに音楽が流れています。読書室やカフェも備えられており、静かなひとときを過ごすのにぴったりの場所です。この後は、車でおよそ45分、別府温泉の海地獄へ向かいましょう。",
        visitTime: t(10, 3),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 9,
      },
    },
    {
      id: UMIJIGOKU_ID,
      data: {
        memo: "由布院空想の森アルテジオから車でおよそ45分、別府温泉の象徴ともいえる海地獄に着きます。コバルトブルーに輝く湯の色が、まるで海のように見えることからこの名がついたと伝えられています。摂氏98度もの高温の湯からは絶えず白い蒸気が立ちのぼり、大正時代から続く別府地獄めぐりの中でも指折りの人気を誇ります。地獄の湯はとても熱いので、柵の外に出たり手を入れたりしないようにしましょう。庭園内には熱帯スイレンの温室もあり、地熱を利用して育てられた植物も見どころの一つです。この後は、歩いておよそ2分、鬼石坊主地獄へ向かいましょう。",
        visitTime: t(11, 43),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 45,
      },
    },
    {
      create: {
        name: "鬼石坊主地獄",
        address: "大分県別府市御幸",
        lat: 33.31539,
        lng: 131.470055,
        memo: "海地獄から歩いておよそ2分、鬼石坊主地獄に着きます。灰色の熱泥がぼこぼこと丸くふくらんでは弾ける様子が、坊主の頭に似ていることから、この名がついたと伝えられています。単純泉の泥地獄で、ほかの色鮮やかな地獄とはまた違う、素朴で不思議な景色を楽しめます。熱泥はとても熱いので、柵の外に出ないようにしましょう。この後は、歩いておよそ8分、地獄蒸し工房鉄輪へ向かいましょう。",
        visitTime: t(12, 15),
        stayDurationMin: 15,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "地獄蒸し工房鉄輪",
        address: "大分県別府市風呂本5組",
        lat: 33.315443,
        lng: 131.476194,
        memo: "鬼石坊主地獄から歩いておよそ8分、地獄蒸し工房鉄輪に着きます。地獄の噴気を利用した「地獄蒸し」を体験できる施設で、野菜や肉、海鮮などの食材をセットで購入し、蒸し釜で好みの蒸し時間だけ蒸し上げて味わえます。ここでお昼をとりましょう。噴気の蒸し釜は高温になるので、案内にしたがって蒸し布や器具を扱ってください。この後は、歩いておよそ5分、かまど地獄へ向かいましょう。",
        visitTime: t(12, 38),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "かまど地獄",
        address: "大分県別府市風呂本",
        lat: 33.316446,
        lng: 131.472453,
        memo: "地獄蒸し工房鉄輪から歩いておよそ5分、かまど地獄に着きます。昔、氏神様の祭礼の際にこの地の噴気を利用して大釜でご飯を炊いていたという言い伝えから、この名がついたとされています。色や湯の性質が異なる複数の池が並び、地獄ごとに違った表情を楽しめます。噴気や熱湯には近づきすぎず、柵の外に出ないようにしましょう。この後は、歩いてすぐ、鬼山地獄へ向かいましょう。",
        visitTime: t(13, 33),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      id: ONIYAMAJIGOKU_ID,
      data: {
        memo: "かまど地獄から歩いてすぐ、鬼山地獄に着きます。地獄の温泉熱を利用してワニを飼育していることから「ワニ地獄」の愛称でも親しまれています。100頭以上のワニが、もうもうと湯気の立つ池のほとりで身を寄せ合う姿は、南国さながらの不思議な光景です。柵の外に出たり、ワニに近づきすぎたりしないようにしましょう。地熱と共生する別府ならではの生態展示を楽しんでみてください。この後は、歩いておよそ2分、白池地獄へ向かいましょう。",
        visitTime: t(13, 55),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 2,
      },
    },
    {
      create: {
        name: "白池地獄",
        address: "大分県別府市風呂本",
        lat: 33.315327,
        lng: 131.474144,
        memo: "鬼山地獄から歩いておよそ2分、白池地獄に着きます。湧き出た時は無色透明の湯が、地上に出て温度と圧力が下がることで青みがかった白色に変化する、不思議な地獄です。池のほとりには熱帯魚の展示コーナーもあり、地熱を利用して育てられたピラニアなどの魚を見ることができます。湯はとても熱いので、柵の外に出ないようにしましょう。この後は、車でおよそ5分、血の池地獄へ向かいましょう。",
        visitTime: t(14, 17),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      id: CHINOIKEJIGOKU_ID,
      data: {
        memo: "白池地獄から車でおよそ5分、血の池地獄に着きます。日本最古の天然地獄ともいわれ、酸化鉄を含む赤褐色の熱泥が湧き出す様子から、その名がつけられたと伝えられています。『豊後国風土記』にもその存在が記されているとされ、古くから人々に知られてきた景観です。真っ赤に染まった池の様子は、ほかの地獄とはまた違う迫力があります。湯はとても熱いので、柵の外に出たり手を入れたりしないようにしましょう。この後は、歩いておよそ5分、龍巻地獄へ向かいましょう。",
        visitTime: t(14, 42),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 5,
      },
    },
    {
      id: TATSUMAKIJIGOKU_ID,
      data: {
        memo: "血の池地獄から歩いておよそ5分、旅の締めくくりは龍巻地獄です。およそ30分から40分の周期で、高温の熱湯と蒸気が勢いよく噴き上がる間欠泉で、天然の間欠泉としては世界でも有数の短い周期で噴出するとされています。柵の外に出ず、少し時間に余裕を持って、噴出の瞬間を待ってみてください。噴出の瞬間には、あたりに轟音とともに白い湯けむりが立ちのぼり、大迫力の景色を見せてくれます。金鱗湖の朝霧から、由布院の由緒ある神社めぐり、そして別府の地獄めぐりへと移り変わった2日目も、ここで無事に終了です。お疲れさまでした。",
        visitTime: t(15, 22),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 5,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, dayId, order] of [[1, day1Id, day1Spots], [2, day2Id, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN }, data: { title: NEW_TITLE, description: NEW_DESCRIPTION } });
    await setDaySpotOrder(day1Id, day1Spots, { remove: ["06b3259c-2bc3-439a-86fa-793b2198fd14"], tx });
    await setDaySpotOrder(day2Id, day2Spots, { remove: [KIJIMA_ID], tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

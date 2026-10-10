/**
 * #446 b70cea19（鋸山 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜12:00。日本寺は 9:00〜16:00（最終入場15:00）なので鋸山を午前にし、表参道を下って保田・勝山を南へ歩く（戻らない）
 *   鋸山ロープウェー 9:00〜9:15 →（歩き20分）地獄のぞき 9:35〜10:00 →（歩き5分）百尺観音（新規）10:05〜10:25 →（歩き30分）日本寺 10:55〜11:40
 *   →（表参道を下りて歩き55分）道の駅 保田小学校（新規・昼食）12:35〜13:25 →（歩き25分）菱川師宣記念館（新規）13:50〜14:45
 *   →（歩き20分）源頼朝上陸地（新規）15:05〜15:35 →（歩き20分）大黒山展望台（新規）15:55〜16:30、帰りは安房勝山駅から
 *   ロープウェーは 9:00〜17:00（冬は16:00まで）、菱川師宣記念館は 9:00〜17:00（入館16:30まで）・月曜休館。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉で、確かめられない記述（千葉県内で唯一、日本最大の石造大仏、高さ31m など）もあったので、開いたページの事実だけで書き直す
 * 本文の出典: 鋸山ロープウェー https://www.mt-nokogiri.co.jp/pc/p040000.php 、日本寺 https://www.nihonji.jp/ の 拝観時間-料金・access・由緒・境内案内（山頂エリア・大仏広場・中腹エリア・表参道エリア）、
 *   鋸南町 https://www.town.kyonan.chiba.jp/site/tourism/2562.html （鋸山）・0002003.html（保田小学校）・2505.html（道の駅きょなん・菱川師宣記念館）・2498.html（源頼朝上陸地）・2520.html（大黒山展望台）
 * 座標の出典: OSM（鋸山ロープウェー node 10203588126／地獄のぞき node 3606300878／百尺観音 node 3606300855／日本寺 way 1427935325／道の駅 保田小学校 way 387457773／
 *   道の駅きょなん way 457180973（菱川師宣記念館は道の駅に併設で、館そのものの点がないため）／源頼朝上陸地 node 3766840225／大黒山 node 9877578999（展望台は頂上にある）)
 *   もとの地獄のぞき（35.1917,139.8408）は日本寺から北へ約4km ずれていた
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-446-b70cea19.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b70cea19-5343-44a7-b398-e534425c1827";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "東京湾を見渡す「地獄のぞき」で知られる鋸山へ、ロープウェーで登ります。日本寺の百尺観音や大仏にお参りしたら、表参道を下って保田の町へ。廃校を活かした道の駅 保田小学校で昼食をとり、菱川師宣記念館、源頼朝の上陸地、勝山の大黒山展望台まで、鋸南町を南へ歩いてめぐる日帰りプランです。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["鋸山ロープウェー", "地獄のぞき", "日本寺（鋸山）"].join()) throw new Error("構成が想定と違います");
  const [rope, jigoku, nihonji] = day.spots;

  const order = [
    { id: rope.id, data: { visitTime: t(9, 0), stayDurationMin: 15, lat: 35.163655, lng: 139.822649, address: "千葉県富津市金谷",
      memo: "この旅は電車と歩きでめぐります。浜金谷駅から国道127号線を館山方面へ歩いて8分ほどの山麓駅から、鋸山ロープウェーで山頂駅へ。片道およそ4分の空中散歩です。むき出しの岩壁が連なる鋸山は、その名のとおり鋸の形をした山並みで、山頂からは東京湾や、天気がよければ富士山まで見渡せます。荒天の日は運転を休むことがあるので、公式の案内で確かめましょう。山頂駅からは、日本寺の西口管理所から境内に入ります。" } },
    { id: jigoku.id, data: { visitTime: t(9, 35), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 35.159374, lng: 139.833286, address: "千葉県安房郡鋸南町鋸山（日本寺境内）",
      memo: "西口管理所から日本寺の境内に入り、山道を歩いて地獄のぞきへ。山頂付近にある展望の場所で、東京湾や房総半島、富士山などを見渡せます。境内は山の中なので階段が多く、歩きにくいところもあります。歩きやすい靴で出かけましょう。高い崖の上なので、柵の外に出たり身を乗り出したりせず、足元に気をつけましょう。" } },
    { create: { name: "百尺観音", visitTime: t(10, 5), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.159136, lng: 139.833026, address: "千葉県安房郡鋸南町鋸山（日本寺境内）",
      memo: "地獄のぞきから歩いてすぐ、かつての石切場の跡に彫られた百尺観音へ。戦争で亡くなった人々と、交通事故の犠牲者の供養のために発願され、昭和35年（1960年）から6年をかけて、昭和41年（1966年）に完成しました。航海や空の旅、陸の交通の安全を願う人がお参りします。" + RESPECT } },
    { id: nihonji.id, data: { visitTime: t(10, 55), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 30, transitLine: null, lat: 35.156608, lng: 139.833152, address: "千葉県安房郡鋸南町鋸山",
      memo: "百尺観音から境内の山道を下り、千五百羅漢などにお参りしながら大仏広場へ。日本寺は、聖武天皇の勅詔を受けた行基によって神亀2年（725年）に開かれたと伝わる寺で、関東最古の勅願所とされます。大仏（薬師瑠璃光如来）は、天明3年（1783年）に大野甚五郎英令が27人の門弟とともに、3年をかけて岩山に彫ったものが原型で、昭和の修復を経て今の姿になりました。石橋山の戦いに敗れて安房に逃れた源頼朝が、再起を願って手植えしたと伝わる「頼朝蘇鉄」も境内に残っています。" + RESPECT + "お参りのあとは、元禄7年（1694年）に再建された仁王門をくぐって表参道の石段を下り、保田の町へ向かいましょう。" } },
    { create: { name: "道の駅 保田小学校", visitTime: t(12, 35), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 55, transitLine: null, lat: 35.14308, lng: 139.843828, address: "千葉県安房郡鋸南町保田724",
      memo: "日本寺の表参道を下りて保田の町を歩き、道の駅 保田小学校へ。廃校になった小学校を活かして生まれ変わった道の駅で、名前も当時の小学校名をそのまま使い、あちこちに小学校の面影が残っています。宿泊施設も備えた、全国でも珍しい道の駅です。地元の農産物を中心にそろえた直売所もあります。ここで昼食にしましょう。" } },
    { create: { name: "菱川師宣記念館", visitTime: t(13, 50), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 25, transitLine: null, lat: 35.128476, lng: 139.836496, address: "千葉県安房郡鋸南町吉浜（道の駅きょなん）",
      memo: "昼食のあとは南へ歩いて、東京湾に面した道の駅きょなんへ。ここに併設されているのが、「見返り美人図」で知られる浮世絵師・菱川師宣の記念館です。鋸南町は師宣が生まれた地で、浮世絵を紹介し、江戸の暮らしや風俗を知ることができます。年に数回、特別展も開かれます。休館日は公式の案内で確かめましょう。" } },
    { create: { name: "源頼朝上陸地", visitTime: t(15, 5), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 35.118161, lng: 139.828675, address: "千葉県安房郡鋸南町竜島",
      memo: "道の駅きょなんから南へ歩いて、竜島の源頼朝上陸地へ。治承4年（1180年）、伊豆で平家打倒の兵を挙げた源頼朝は、石橋山の戦いに敗れて真鶴岬から小船で房総へ逃れ、わずかな供とともに安房国猟島、今の竜島に上陸しました。上陸したとされる場所は千葉県指定史跡で、上陸碑が建っています。頼朝はここから房総の豪族たちを味方につけて勢いを盛り返したことから、竜島は頼朝の「再起の地」とされています。上陸のときに頼朝がサザエを踏んでけがをし、それ以来、竜島のサザエには角がなくなったという言い伝えも残っています。" } },
    { create: { name: "大黒山展望台", visitTime: t(15, 55), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 35.112899, lng: 139.827904, address: "千葉県安房郡鋸南町勝山",
      memo: "竜島から勝山の町へ歩いて、大黒山展望台へ。勝山海岸の上にそびえる大黒山の頂上にある展望台で、ふもとから歩いて10分ほどで登れます。城の形をした展望塔からは、眼下に勝山漁港や町並み、緑の濃い嶺岡の山並み、天気がよければ富士山や伊豆七島も眺められます。上り道では足元に気をつけましょう。鋸山の絶景と、保田・勝山の歴史をめぐる旅を、ここで締めくくりましょう。帰りは、安房勝山駅から内房線で。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: ロープウェー 9:00 → 地獄のぞき 9:35 → 百尺観音 10:05 → 日本寺 10:55〜11:40 → 保田小学校 12:35〜13:25 → 菱川師宣記念館 13:50 → 源頼朝上陸地 15:05 → 大黒山展望台 15:55〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

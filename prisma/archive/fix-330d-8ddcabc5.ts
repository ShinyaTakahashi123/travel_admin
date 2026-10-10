/**
 * #330の組み直し(その3)。企画運営2026-10-01 04:24、法務04:25の指摘に対応。
 *
 * 企画運営の指摘: 道の駅青雲橋140分(昼食+橋の眺めで60分までに)、高千穂神社120分
 * (境内40分+参道での昼食は45分までに、あわせて85分に)は、まだ決まりAの水増し。
 * 足りない時間は行き先を足す。候補(公式で確認): 日之影町「石垣の村」(戸川地区、
 * 七折)を2日目に追加。1日目の高千穂の神楽の展示・くしふるの里は、高千穂神社の
 * 神楽殿の公開(既存)以外に日中に立ち寄れる公開施設が見当たらなかった(「神楽の館」
 * は宿泊予約者限定)ため、既存の高千穂町歴史民俗資料館の滞在時間を、収蔵内容
 * (考古・民俗資料およそ1万点、神楽面等)に見合う時間に見直し、高千穂神社からの
 * 移動時間も町なかの実際の所要に合わせて見直した(新しい行き先の追加ではない
 * ため、この点は企画運営に報告し、判断を仰ぐ)。
 *
 * 法務04:25の4点+任意1点に対応:
 * ① 秋元神社「パワースポットとして知られる神社で」を削除(パワースポット表現は
 *    書かない決まり)、「山あいにひっそりと立つ神社で」に変更
 * ② 四皇子峰・高天原遥拝所に祈りの一文を追加
 * ③ 天真名井に祈りの一文を追加
 * ④ 道の駅青雲橋の展望デッキに安全の一文(柵から身を乗り出さない)を追加
 * 任意: 秋元神社の「風葬の跡ともいわれる」を「古くからこの地が神聖な場所と
 *    されてきたことをうかがわせます」に和らげた
 *
 * 石垣の村(戸川地区)座標の出典: 公式(日之影町観光協会)の住所「宮崎県西臼杵郡
 * 日之影町七折戸川」から、GSI住所検索で「七折」の代表点(131.405487,32.671638)
 * を使用(「戸川」単独では住所検索がヒットせず、大字「七折」までの精度)。
 * 事実確認: 日之影町観光協会・宮崎県公式ページで、戸数7戸の集落、記録に残る
 * 最古の石垣は嘉永〜安政年間(1854〜1859)、高さ11mの石垣は日本一ともいわれ、
 * 日本の棚田百選・遊歩百選に選定、と確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-330d-8ddcabc5.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8ddcabc5-91a8-49bb-881a-d60a4d29dc93";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "石垣の村(戸川地区)" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const shioujigamine = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "四皇子峰・高天原遥拝所" } });
  const amanomanai = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天真名井" } });
  const takachihoJinja = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "高千穂神社" } });
  const shiryokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "高千穂町歴史民俗資料館" } });

  const akimoto = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "秋元神社" } });
  const seiunbashi = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "道の駅青雲橋(青雲橋)" } });
  const onsen = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "高千穂の湯" } });

  // ---- Day1: 四皇子峰・天真名井に祈りの一文、高千穂神社を85分に、資料館の滞在・移動を見直し ----
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: shioujigamine.id },
      data: {
        memo:
          "槵觸神社からは歩いておよそ3分です。四皇子峰は、神武天皇とその兄弟にあたる4柱の神(五瀬命・稲飯命・三毛入野命・神日本磐余彦命)が生まれた地と伝えられる丘です。頂の南端には、高天原の方角を向いた石の祠があり、「高天原遥拝所」として、遠く天上の国をしのぶ場所とされています。静かに、敬意をもってお参りしましょう。木々に囲まれた静かな丘の上で、神話の時代に思いをはせてみましょう。続いては、歩いておよそ5分の天真名井へ向かいましょう。",
      },
    });
    await tx.spot.update({
      where: { id: amanomanai.id },
      data: {
        memo:
          "四皇子峰からは歩いておよそ5分です。天真名井は、樹齢およそ1300年ともいわれる大きなケヤキの根元から、こんこんと湧き出る水です。天孫降臨の際、この地に水がなかったことを憂いた瓊々杵尊が、高天原の「天真名井」から水種を移したのが始まりと伝えられ、高千穂峡の真名井の滝へと流れ込んでいます。ご神水として大切にされている湧き水です。静かに、敬意をもってお参りしましょう。木漏れ日の差す湧水池のほとりで、澄んだ水の音に耳を澄ませてみましょう。続いては、歩いておよそ7分の荒立神社へ向かいましょう。",
      },
    });
    await tx.spot.update({
      where: { id: takachihoJinja.id },
      data: {
        stayDurationMin: 85,
        memo:
          "荒立神社からは、車でおよそ6分です。到着したら、まずは参道近くの食事処で昼食をとりましょう。腹ごしらえをすませたら、高千穂神社へ向かいます。高千穂神社は、およそ1900年前、第11代垂仁天皇の時代の創建と伝えられる古社で、高千穂郷八十八社の総社として、古くから篤い信仰を集めてきました。境内には、2本の杉の幹が寄り添うように1本になった「夫婦杉」や、源頼朝の代参で植えられたと伝えられる樹齢およそ800年の「秩父杉」、伊勢神宮の創建にも用いられたという伝承を持つ「鎮石」など、長い歴史を物語る見どころが点在しています。夫婦杉の周りをゆっくりと一周しながら、悠久の時の流れに思いをはせてみましょう。静かに、敬意をもってお参りください。境内の神楽殿では、高千穂に伝わる「高千穂神楽」の一部が、公開の夜神楽として奉納されています。天岩戸に隠れた天照大御神を、天鈿女命が舞でお誘いした神話に始まると伝えられる、地域の方にとって大切な神事です。静かに、敬意をもって鑑賞し、撮影については神社や奉納する方々の案内に従いましょう。続いては、車でおよそ15分の高千穂町歴史民俗資料館へ向かいましょう。",
      },
    });
    await tx.spot.update({
      where: { id: shiryokan.id },
      data: {
        stayDurationMin: 85,
        transitDurationMin: 15,
        memo:
          "高千穂神社からは、車でおよそ15分です。高千穂町歴史民俗資料館は、町内から出土した考古資料や、古文書、化石、動物の剥製など、およそ1万点の資料を収蔵する施設です。考古コーナーでは、吾平原北6号横穴墓から見つかった副葬品の転写模型などが見られ、民俗コーナーでは、高千穂神楽で使われる神面や、紙で作られた「彫物(えりもの)」と呼ばれる飾りなど、今日訪ねた神楽殿の奉納をより深く味わう手がかりになる展示が並びます。これまでの1日で巡ってきた神話の舞台を、あらためて資料とともに振り返ってみましょう。今夜はこの近くの宿に宿泊し、神話の里の夜を過ごします。",
      },
    });

    // cascade recompute
    await tx.spot.update({ where: { id: takachihoJinja.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 27)) } });
    await tx.spot.update({ where: { id: shiryokan.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 7)) } });
  });
  console.log("day1 done");

  // ---- Day2: 秋元神社の言い回し、青雲橋を60分に、石垣の村を追加、高千穂の湯の書き出し ----
  const kunimigaoka = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "国見ヶ丘" } });
  const amaterasuRail = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "高千穂あまてらす鉄道" } });
  const aquarium = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "高千穂峡淡水魚水族館" } });

  await setDaySpotOrder(day2.id, [
    { id: kunimigaoka.id, data: {} },
    {
      id: akimoto.id,
      data: {
        memo:
          "国見ヶ丘からは、車でおよそ40分です。山道が続くため、引き続き安全運転を心がけましょう。秋元神社は、山あいにひっそりと立つ神社で、拝殿は鬼門の方角を封じるように建てられています。本殿の裏には、穴の空いた大岩があり、古くからこの地が神聖な場所とされてきたことをうかがわせます。奥には「太子ヶ窟(たいしがいわや)」と呼ばれる洞窟もあり、これこそが天照大御神の隠れた本当の天岩戸ではないかという説も伝えられています。山からの湧き水は「稀にみる名水」と呼ばれ、澄んだ空気とともに、人里離れた静けさを味わうことができます。静かに、敬意をもってお参りください。続いては、車でおよそ40分の高千穂あまてらす鉄道へ向かいましょう。",
      },
    },
    { id: amaterasuRail.id, data: {} },
    { id: aquarium.id, data: {} },
    {
      id: seiunbashi.id,
      data: {
        stayDurationMin: 60,
        memo:
          "水族館からは、車でおよそ35分です。到着したら、まずは展望デッキから青雲橋を眺めてみましょう。柵から身を乗り出さないようにしましょう。青雲橋は、日之影川に架かる橋長410m、水面からの高さ137mのアーチ橋で、国道に架かる道路橋としては東洋一の高さとされています。天空に浮かぶような橋の姿は、遥か下から見上げると、その大きさに圧倒されます。ひと通り眺めたら、道の駅内の食事処で昼食をとりましょう。続いては、車でおよそ20分の石垣の村(戸川地区)へ向かいましょう。",
      },
    },
    {
      create: {
        name: "石垣の村(戸川地区)",
        address: "西臼杵郡日之影町七折戸川",
        lat: 32.671638,
        lng: 131.405487,
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 31)),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 20,
        memo:
          "道の駅青雲橋からは、車でおよそ20分です。石垣の村は、日之影川沿いの山あいにひっそりと佇む、戸数わずか7戸の集落です。記録に残る中で最も古い石垣は、嘉永から安政年間(1854〜1859)に築かれたと伝えられ、宅地や耕地、石蔵から防風垣にいたるまで、集落全体が丁寧に積まれた石垣で形づくられています。中でも、高さおよそ11mの石垣は日本一ともいわれ、苔むした石組みの棚田には、先人たちの知恵と労苦がしのばれます。静かな山里の風景を、ゆっくりと歩いてめぐってみましょう。続いては、車でおよそ40分の高千穂の湯へ向かいましょう。",
      },
    },
    {
      id: onsen.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 11)),
        transitDurationMin: 40,
        memo:
          "石垣の村からは、車でおよそ40分です。高千穂の湯は、高台に立つ日帰り温泉施設で、内湯や露天風呂、サウナなどを備えています。露天風呂からは、高千穂の町並みや周囲の山々を見渡すことができ、2日間歩き回った体をゆっくりとほぐすことができます。浴場では、ほかの方が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。湯上がりには、休憩スペースでひと息ついて、旅の余韻に浸ってみましょう。高千穂神社の夜神楽と国見ヶ丘の雲海、伝統と絶景を巡った1泊2日も、ここで締めくくりです。帰りは、高千穂バスセンターまで車でおよそ5分です。そこから延岡方面へのバスや、レンタカーの返却をすませてください。",
      },
    },
  ]);
  console.log("day2 done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

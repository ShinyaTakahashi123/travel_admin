/**
 * #83 熊野三山をすべて巡る、世界遺産・熊野古道じっくり1泊2日 (74506e1f-41b4-444a-9d8d-557e13353862)
 * 初日・最終日の見直し(2回目。企画運営・法務との相談のうえ、大きく組み直す)。
 *
 * 背景: 新宮駅(入口)から本宮までの車は、国道168号の山道のため、もとの「およそ1時間」の
 * まま(法務の指示。実測ルートは短く出るが山道なので直さない)。本宮大社前から発心門王子への
 * バスは1日4便(およそ7:20・9:30・10:30・12:15)しかなく、入口10:30以降では昼食(13:30ごろ
 * まで)に間に合わない。企画運営の案で、バスではなくタクシーを使う形に組み直す:
 *   新宮駅10:30着→レンタカー手続き15分→車およそ1時間→本宮大社11:45着(1回目、昼食)
 *   →タクシーで発心門王子へ(本宮町のタクシーは台数が少ないため前もって呼んでおく。
 *     NAVITIMEの概算で約18分)→発心門王子→伏拝王子→熊野本宮大社(2回目)と熊野古道を歩いて
 *     下る(170分、変更なし)→車で湯の峰温泉・つぼ湯へ(初日最後)
 * 大斎原はスポットから外し、熊野本宮大社(2回目)のメモで「歩いて数分の大鳥居」として
 * 一言紹介する(説明文・ほかのメモに大斎原の名残がないことを確認済み)。
 *
 * これでも初日の時間が足りないため、東光寺・湯筒(どちらも説明文に名前なし、湯の峰温泉の
 * 宿のすぐそば)を2日目の朝に移す。2日目は1泊2日の最終日(8:30〜9:30開始・16:30〜17:00終了)
 * なので、1か所目(東光寺)はもとの開始(9:00)より早めず、終了も16:30〜17:00に収める。
 * 2日目に湯の峰→新宮の車(山道、もとの「およそ1時間」のまま)が入るため、神倉神社・
 * 熊野速玉大社・熊野那智大社・青岸渡寺・飛瀧神社の滞在を少しずつ短くして収める
 * (大門坂の昼食の滞在は変更なし)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-83-74506e1f.ts
 *   反映: npm run prod -- npx tsx prisma/fix-83-74506e1f.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "2395cd7a-d871-49b1-a7db-7820c6ea8c19";
const DAY2_ID = "dacc9ad1-acac-4ec1-a9e4-7f9921977332";

const HOSSHINMON_ID = "3c5c9fbf-aca4-4b92-8720-2c568c51342e";
const FUSHOGAMI_ID = "be434cff-404f-4d14-98ff-e877927dba09";
const HONGU_ID = "4f38bc3a-ff17-4e52-8933-d294d3ae4ffd";
const OYUNOHARA_ID = "c22e3130-ab24-46e3-971c-37e5ef406f90";
const TSUBOYU_ID = "6f871412-5a17-4b0a-92dd-cdb81fcee131";
const TOKOJI_ID = "6e15f475-cdac-479e-be8d-10a4509ee151";
const YUZUTSU_ID = "a047d530-7055-48fb-a2d0-df1593a004f0";

const KAMIKURA_ID = "f86e68e3-8050-4c26-9989-e727c5bf25fc";
const HAYATAMA_ID = "f3c84373-2ba7-4a9f-ad50-a25ff3009727";
const DAIMONZAKA_ID = "cf0b73c9-ad4b-4dec-af22-e0b6107fbca2";
const NACHI_ID = "8abf6a01-fd95-44b0-aef3-9694145c8a32";
const SEIGANTOJI_ID = "cbec683c-4aed-4a60-9782-887a223087e5";
const HIRYU_ID = "37b41d6a-46ae-42e5-9c93-59a9d8fbd7b3";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const HONGU1_MEMO =
  "この旅は、新宮駅で借りたレンタカーと、熊野古道を歩く区間を組み合わせてめぐります。新宮駅に10:30ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で熊野本宮大社前の駐車場まで約1時間。車を置いて、大社前のあたりで昼食にしましょう。お参りは、このあと熊野古道を歩いてきたあとにします。昼食のあとは、タクシーで発心門王子へ向かい、熊野古道を歩いて本宮まで戻ってきます。本宮町内のタクシーは台数が少ないため、前もって呼んでおきましょう。";

const HOSSHINMON_MEMO =
  "本宮大社前からタクシーでおよそ18分です。発心門王子は、熊野古道 中辺路にある九十九王子の中でも、格式の高い五体王子の一つに数えられる場所で、「発心門」とは仏の道に帰依する心を発する入り口という意味です。ここから先が熊野本宮大社の神域とされてきました。ここから熊野本宮大社まで、およそ7kmの熊野古道を歩いていきます。大きな上り下りの少ない、歩きやすい道です。歩きやすい靴で、飲み物を持ち、明るいうちに歩き終えるようにしましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const HONGU2_MEMO =
  "伏拝王子からは、熊野古道を歩いておよそ80分です。熊野本宮大社は、全国に4700社を超えるという熊野神社の総本宮で、熊野三山(本宮・速玉・那智の各大社)の中心に位置づけられています。社殿はもともと、熊野川・音無川・岩田川の合流点にある中州「大斎原」にありましたが、明治22年(1889)の大洪水で多くの建物が流失し、明治24年(1891)、流失を免れた上四社が現在の場所に移築・再建されました。熊野三山に共通して祀られる、導きの神鳥「八咫烏」は、日本サッカー協会のシンボルマークとしても知られています。大社から歩いて数分の大斎原には、高さおよそ34mの大鳥居が立っています。時間があれば立ち寄ってみましょう。境内では静かに、敬意をもってお参りください。続いては、車でおよそ15分の湯の峰温泉・つぼ湯へ向かいましょう。";

const TSUBOYU_MEMO =
  "熊野本宮大社からは車でおよそ15分です。湯の峰温泉は、開湯およそ1800年と伝わる、日本最古とされる温泉です。その中心にある岩風呂「つぼ湯」は、いにしえの熊野詣の人々が、参拝の前後に身を清めた湯垢離場で、平成16年(2004)、熊野三山・熊野古道とともにユネスコの世界遺産に登録されました。実際に入浴できる世界遺産としては、世界でここだけとされています。日によって湯の色が変わるともいわれる、天然の岩風呂で旅の疲れを癒やしましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。今夜は湯の峰温泉の宿に泊まります。";

const TOKOJI_MEMO =
  "宿を出て、歩いてすぐの東光寺へ。東光寺は、湯の峰温泉の中心部に建つ天台宗の寺院です。最初にお湯が湧き出た場所に、湯の花が自然に積もって薬師如来の姿になったと伝えられ、その姿を本尊「湯峯薬師」として祀ったのが始まりとされています。本尊の胸のあたりから温泉が湧いていたことから「湯の胸温泉」と呼ばれ、それが転じて「湯の峰温泉」の名になったといわれています。静かに、敬意をもってお参りください。続いては、歩いてすぐの湯筒へ向かいましょう。";

const YUZUTSU_MEMO =
  "東光寺からは歩いてすぐです。湯筒は、90℃ほどの高温の湯が自噴する、湯の峰温泉ならではの名所です。近くの売店で生卵や野菜を買い、赤いネットに入れて湯筒につければ、名物の温泉たまごができあがります。持ち帰り用に湯をくむことは禁じられていますので、その場で楽しみましょう。やけどに十分気をつけ、熱い湯には直接手を触れないようにしましょう。続いては、車でおよそ1時間の神倉神社へ向かいましょう。";

const KAMIKURA_MEMO =
  "湯筒からは車でおよそ1時間です。神倉神社は、熊野速玉大社の摂社にあたり、熊野権現が最初に降り立ったと伝わる聖地です。社殿の背後にそびえる巨岩「ゴトビキ岩」がご神体で、ゴトビキとは新宮の方言でヒキガエルを指すといわれています。山上へは、源頼朝が寄進したと伝わる、急勾配の石段538段を登ります。歩きやすい靴で、足元に十分気をつけながら、静かに、敬意をもって参拝しましょう。";

const HAYATAMA_MEMO =
  "神倉神社からは車でおよそ7分です。熊野速玉大社は、熊野三山のうち、熊野川の河口近くに鎮座するのがこの速玉大社で、景行天皇58年(128)、神倉山の磐座「ゴトビキ岩」に降り立った熊野権現を、現在の場所にお迎えして瑞々しい神殿を建てたのが始まりと伝えられています。ゴトビキ岩は高さおよそ11mの巨石で、今も長いしめ縄がかけられた神聖な場所として大切にされています。朱塗りの美しい社殿が立ち並ぶ境内は、熊野川を望む立地とあわせて、熊野三山の中でも格別な荘厳さをたたえています。昨日参拝した熊野本宮大社とはまた違う、水辺の聖地ならではの空気を感じながら、静かに、敬意をもってお参りください。続いては、車でおよそ20分の大門坂へ向かいましょう。";

const DAIMONZAKA_MEMO =
  "熊野速玉大社からは車でおよそ20分です。到着したら、まずこのあたりで昼食をとりましょう。大門坂は、熊野那智大社へと続く熊野古道の中でも、古の面影を最も色濃く残す区間とされています。全長およそ500m・高低差およそ100mの石畳の道が、樹齢800年を超すとされる老杉並木の中に続き、夫婦杉と呼ばれる巨木も見どころです。石段は濡れると滑りやすいので、足元に気をつけましょう。ここから那智大社まで、苔むした石段を歩いて登っていきます。";

const HIRYU_MEMO =
  "青岸渡寺からは歩いておよそ12分です。飛瀧神社は、那智の滝そのものを御神体とする神社で、本殿を持たないことで知られています。落差およそ133mは、一段の滝として日本一とされ、およそ4世紀の頃から信仰の対象とされてきました。神武天皇の一行がこの滝を探し当てたという伝承も残っています。熊野三山めぐりの締めくくりに、轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。滝のそばは濡れて滑りやすいので、足元に気をつけましょう。滝に近づいて拝観できる「お滝拝所」は、閉まる時刻が早めなので、利用したい場合は公式サイトで確かめましょう。見学を終えたら、車で新宮駅へ戻り(およそ20分)、レンタカーを返却してから帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #83 初日・最終日の見直し(2回目) ===\n");
  console.log("--- 初日(5か所) ---");
  console.log("1. 熊野本宮大社前で昼食(新規スポット、点は大社前の鳥居node7461114803) 11:45(30分、入口+昼食+タクシーの案内):");
  console.log(HONGU1_MEMO);
  console.log("\n2. 発心門王子 12:33(10分、タクシー18分):");
  console.log(HOSSHINMON_MEMO);
  console.log("\n3. 伏拝王子 14:13(10分、内容変更なし)");
  console.log("\n4. 熊野本宮大社(参拝、もとのスポットのまま) 15:43(30分、大斎原の一言紹介つき):");
  console.log(HONGU2_MEMO);
  console.log("\n5. 湯の峰温泉つぼ湯(最後) 16:28(30分、終了16:58、車15分・宿の一文):");
  console.log(TSUBOYU_MEMO);
  console.log("\n外す: 大斎原(説明文に名前なし。大鳥居は本宮2回目のメモで紹介)");

  console.log("\n--- 2日目(最終日、8か所) ---");
  console.log("1. 東光寺(移動) 09:00(20分、宿からの案内):");
  console.log(TOKOJI_MEMO);
  console.log("\n2. 湯筒(移動) 09:22(25分):");
  console.log(YUZUTSU_MEMO);
  console.log("\n3. 神倉神社 10:47(57分、もとは75分):");
  console.log(KAMIKURA_MEMO);
  console.log("\n4. 熊野速玉大社 11:51(52分、もとは70分):");
  console.log(HAYATAMA_MEMO);
  console.log("\n5. 大門坂 13:03(60分、昼食、変更なし):");
  console.log(DAIMONZAKA_MEMO);
  console.log("\n6. 熊野那智大社 14:38(39分、もとは60分、内容変更なし)");
  console.log("7. 青岸渡寺 15:20(19分、もとは30分、内容変更なし)");
  console.log("8. 飛瀧神社(那智の滝、最後) 15:51(49分、もとは65分、終了16:40。もとの最終日の終わり16:40と同じ):");
  console.log(HIRYU_MEMO);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      // 東光寺・湯筒を2日目へ移す(orderNoの重複を避けるため、先に大きな番号へ)
      await tx.spot.update({ where: { id: TOKOJI_ID }, data: { dayId: DAY2_ID, orderNo: 9101 } });
      await tx.spot.update({ where: { id: YUZUTSU_ID }, data: { dayId: DAY2_ID, orderNo: 9102 } });

      await setDaySpotOrder(
        DAY1_ID,
        [
          {
            create: {
              name: "熊野本宮大社前で昼食",
              lat: 33.841112,
              lng: 135.773327,
              visitTime: t(11, 45),
              stayDurationMin: 30,
              memo: HONGU1_MEMO,
            },
          },
          {
            id: HOSSHINMON_ID,
            data: {
              visitTime: t(12, 33),
              stayDurationMin: 10,
              memo: HOSSHINMON_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 18 }] },
            },
          },
          {
            id: FUSHOGAMI_ID,
            data: { visitTime: t(14, 13), stayDurationMin: 10 },
          },
          {
            id: HONGU_ID,
            data: {
              visitTime: t(15, 43),
              stayDurationMin: 30,
              memo: HONGU2_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 80 }] },
            },
          },
          {
            id: TSUBOYU_ID,
            data: {
              visitTime: t(16, 28),
              stayDurationMin: 30,
              memo: TSUBOYU_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
            },
          },
        ],
        { remove: [OYUNOHARA_ID], tx }
      );

      await setDaySpotOrder(
        DAY2_ID,
        [
          {
            id: TOKOJI_ID,
            data: {
              visitTime: t(9, 0),
              stayDurationMin: 20,
              memo: TOKOJI_MEMO,
              transitLegs: { deleteMany: {} },
            },
          },
          {
            id: YUZUTSU_ID,
            data: {
              visitTime: t(9, 22),
              stayDurationMin: 25,
              memo: YUZUTSU_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
            },
          },
          {
            id: KAMIKURA_ID,
            data: {
              visitTime: t(10, 47),
              stayDurationMin: 57,
              memo: KAMIKURA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 60 }] },
            },
          },
          {
            id: HAYATAMA_ID,
            data: {
              visitTime: t(11, 51),
              stayDurationMin: 52,
              memo: HAYATAMA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
            },
          },
          {
            id: DAIMONZAKA_ID,
            data: {
              visitTime: t(13, 3),
              stayDurationMin: 60,
              memo: DAIMONZAKA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
            },
          },
          {
            id: NACHI_ID,
            data: { visitTime: t(14, 38), stayDurationMin: 39 },
          },
          {
            id: SEIGANTOJI_ID,
            data: { visitTime: t(15, 20), stayDurationMin: 19 },
          },
          {
            id: HIRYU_ID,
            data: { visitTime: t(15, 51), stayDurationMin: 49, memo: HIRYU_MEMO },
          },
        ],
        { tx }
      );
    },
    { timeout: 60000 }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

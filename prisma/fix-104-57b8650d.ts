/**
 * #104 下呂発温泉博物館と中山七里、下呂の歴史と渓谷を楽しむ1泊2日。
 * 初日・最終日の見直し（docs/content/20261029-first-last-day-times.md）。
 * 企画運営・法務とのやりとり(2026-10-30)を経た最終版。
 *
 * Day1(もとは09:30開始・6か所。10:45〜11:45開始・16:30〜17:00終了に組み直す):
 * 入口: JR下呂駅に10:30ごろ着→レンタカー(手続き15分)→車約10分(OSRM5.4分+5)→禅昌寺10:55。
 * 下呂温泉街→雨情公園だけ短すぎた(5→8分、実測7.6分)。禅昌寺→巌立峡・巌立峡→下呂温泉街は
 * 閾値内のため分数は変更なし。博物館→温泉寺(10分)は実測3.9分で閾値(3.9×1.5+5=10.9分)の
 * 範囲内だが、173段の石段を上るため、企画運営の指示でその理由をメモに書く。
 * 滞在短縮(決まりA、もと以下): 禅昌寺50→35・巌立峡75→45(昼食を13:30までにするため追加で
 * -5)・下呂温泉街50→45・雨情公園30→20・博物館70→55・温泉寺45→35分。
 * 結果: 禅昌寺10:55(35)→巌立峡11:30(45)→下呂温泉街13:30(45、昼食)→雨情公園14:23(20)→
 * 博物館14:53(55)→温泉寺15:58(35)→終了16:33。
 *
 * Day2(もとは09:30開始・16:30終了・4か所で範囲内だが、移動の測り直しと決まり369で組み直し):
 * 1. 中山七里(1か所目)に残っていた古いtransitLeg(car/10、既存データの不整合)を削除。
 *    書き出しに宿からの行き方を追加: 下呂温泉のまわりの宿から、車でおよそ9分
 *    (OSRM4.3分+5)。
 * 2. 中山七里→金山巨石群: 40→19分(OSRM14.3分+5、長すぎた)。
 * 3. 金山の町(もとは昼食と筋骨めぐりを1か所・140分でまとめていた)を分割:
 *    - 「金山の町のあたりで昼食」(新規。点はOSMの金山郵便局node、店ではない)
 *    - 「金山の町(筋骨めぐり)」(点はOSMの「筋骨めぐり」という名前のnodeそのもの)
 *    金山巨石群→昼食: 車22分(OSRM16.7分+5)。昼食→筋骨めぐり: 徒歩2分(実測137m)。
 *    筋骨めぐり(90分、公式の案内時間90〜120分の下限)。
 * 4. 筋骨めぐり→横谷峡: 15→10分(OSRM4.8分+5、長すぎた)。横谷峡の滞在はもとの85分の
 *    まま(決まり369、滞在を延ばすのは不可)。
 * 5. 短くなった移動で浮いた分は、企画運営の判断で実在の行き先(③)を足して埋める:
 *    下呂温泉噴泉池(横谷峡から車で帰る途中、下呂温泉街のそば。無料の露天の足湯で、
 *    開いている時間の制約がない)。横谷峡→噴泉池: 車28分(OSRM23.4分+5)。噴泉池での
 *    滞在24分のあと、噴泉池→JR下呂駅: 車9分(OSRM4.3分+5)でレンタカーを返す。
 *    中山七里・金山巨石群・昼食の滞在もそれぞれ少し短縮(60→50・60→50・45→40)して、
 *    終わりをもとの16:30にそろえた。
 * 結果: 中山七里09:30(50)→金山巨石群10:39(50)→昼食11:51(40)→筋骨めぐり12:33(90)→
 * 横谷峡14:13(85)→噴泉池16:06(24)→終了16:30(もとと同じ)。
 *
 * 座標:
 *  - 禅昌寺・巌立峡・雨情公園・博物館・中山七里(帯雲橋)・金山巨石群・温泉寺・横谷峡(白滝)は
 *    OSMの名前のある点と1m未満〜18m程度で一致しており変更なし(法務確認済み)
 *  - 金山の町のあたりで昼食: OSM「金山郵便局」node(店ではない)
 *  - 金山の町(筋骨めぐり): OSM「筋骨めぐり」node(活動名そのもの)
 *  - 下呂温泉噴泉池: OSM「下呂温泉噴泉池」node
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-104-57b8650d.ts
 *   反映: npm run prod -- npx tsx prisma/fix-104-57b8650d.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "d9f099a4-6575-4748-b160-bfdc3d8da37b";
const DAY2_ID = "3eeeeb48-f978-4f47-9d7f-7eb41a8458d5";

const ZENSHOJI_ID = "919eadb7-44a4-42ca-ae7c-66457c94e7db";
const GANRITATE_ID = "d828b92f-b405-4711-bd58-dd601008c9d9";
const GERO_ID = "650e386f-1772-48be-82f9-ed8859736a4e";
const AMEJO_ID = "8d936077-54da-45b9-b797-c84a34b286a6";
const HAKUBUTSUKAN_ID = "3f52b08a-4f3b-4f15-836a-4e95109d879c";
const ONSENJI_ID = "0e5a8ac0-f15c-4d38-a059-0080ce1c4413";

const NAKAYAMA_ID = "774e4076-b039-40c8-8caa-580d79e1d452";
const KYOSEKI_ID = "c2d49a18-f53f-4ba2-805a-7750ca1a8f23";
const KANAYAMA_ID = "0cad410c-c8ff-45f5-b60b-ac1b22f0401e"; // 筋骨めぐりに作り直す(既存)
const YOKOTANI_ID = "cab86212-be2c-4be8-980c-60a59b9b4350";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ZENSHOJI_MEMO_OLD =
  "この旅は車でめぐります。JR下呂駅の近くでレンタカーを借りて、北へ車で約20分。平安時代に開かれたと伝わる禅寺で、宋の様式を取り入れた伽藍が並びます。江戸時代の茶人・金森宗和の作と伝わる庭「萬歳洞」は国の名勝に、樹齢1200年を超えるとされる大杉は国の天然記念物に指定されています。寺には、雪舟が描いたと伝わる大きな達磨の絵も残ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const ZENSHOJI_MEMO_NEW =
  "この旅は車でめぐります。JR下呂駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、北へ車で約10分。平安時代に開かれたと伝わる禅寺で、宋の様式を取り入れた伽藍が並びます。江戸時代の茶人・金森宗和の作と伝わる庭「萬歳洞」は国の名勝に、樹齢1200年を超えるとされる大杉は国の天然記念物に指定されています。寺には、雪舟が描いたと伝わる大きな達磨の絵も残ります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const AMEJO_MEMO_OLD =
  "温泉街から歩いて約5分。温泉街に近い、阿多野谷の上流に広がる公園で、下呂の山ふところから流れ出る清流が、公園の中ほどを流れています。名前は、昭和のはじめに下呂を訪れた詩人・野口雨情が、この地で作った歌にちなみます。せせらぎの音を聞きながら、ひと休みしましょう。";
const AMEJO_MEMO_NEW =
  "温泉街から歩いて約6分。温泉街に近い、阿多野谷の上流に広がる公園で、下呂の山ふところから流れ出る清流が、公園の中ほどを流れています。名前は、昭和のはじめに下呂を訪れた詩人・野口雨情が、この地で作った歌にちなみます。せせらぎの音を聞きながら、ひと休みしましょう。";

const HAKUBUTSUKAN_MEMO_OLD =
  "雨情公園から歩いて約10分。温泉を、化学と文化の両方の面から紹介する博物館です。館内は5つのテーマに分かれ、「温泉の文化」「ようこそ下呂温泉へ」「温泉博士の部屋」「おもしろ温泉チャレンジ」などのコーナーを、楽しみながら見てまわれます。休館日は公式の案内で確かめましょう。";
const HAKUBUTSUKAN_MEMO_NEW = HAKUBUTSUKAN_MEMO_OLD;

const ONSENJI_MEMO_OLD =
  "博物館から歩いて約10分。173段の石段を上った先にある寺で、薬師如来をまつっています。山門のあたりからは、飛騨川に沿って広がる温泉街を見下ろせます。石段は急なので、足元に気をつけて上りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この日は下呂温泉に泊まりましょう。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。";
const ONSENJI_MEMO_NEW =
  "博物館から、173段の石段を上って歩いておよそ10分。山上にある寺で、薬師如来をまつっています。山門のあたりからは、飛騨川に沿って広がる温泉街を見下ろせます。石段は急なので、足元に気をつけて上りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この夜は、歩いておよそ3分の下呂温泉の宿に泊まりましょう。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。";

const NAKAYAMA_MEMO_OLD =
  "下呂温泉の宿から南へ、車で約10分。飛騨川が山をけずってつくった渓谷で、三原の帯雲橋から金山まで、約28kmにわたって続きます。飛騨木曽川国定公園の一部で、屏風岩、羅漢岩、牙岩、円空岩など、形も名前もさまざまな岩が次々に現れ、春には岩つつじが岩場を彩ります。国道41号に沿って下りながら、車を停められる所から眺めましょう。川岸には近づきすぎないようにしましょう。";
const NAKAYAMA_MEMO_NEW =
  "下呂温泉のまわりの宿から、車でおよそ9分。帯雲橋のたもとから、飛騨川の渓谷・中山七里が下流へ続きます。飛騨木曽川国定公園の一部で、屏風岩、羅漢岩、牙岩、円空岩など、形も名前もさまざまな岩が次々に現れ、春には岩つつじが岩場を彩ります。国道41号に沿って下りながら、車を停められる所から眺めましょう。川岸には近づきすぎないようにしましょう。";

const KYOSEKI_MEMO_OLD =
  "中山七里を金山まで下り、山あいへ入って、あわせて車で約40分。山の斜面に大きな岩が重なり合う遺跡で、日本で初めて考古天文学の調査が行われた場所とされます。3か所の石組みは、イギリスのストーンヘンジのように、太陽の暦として働くように造られたと推定されています。季節によっては、石のすき間から差し込む日の光を観る会も開かれています。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";
const KYOSEKI_MEMO_NEW =
  "中山七里を金山まで下り、山あいへ入って、あわせて車で約19分。山の斜面に大きな岩が重なり合う遺跡で、日本で初めて考古天文学の調査が行われた場所とされます。3か所の石組みは、イギリスのストーンヘンジのように、太陽の暦として働くように造られたと推定されています。季節によっては、石のすき間から差し込む日の光を観る会も開かれています。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const LUNCH_MEMO =
  "金山巨石群から車で約22分。飛騨川と馬瀬川が出あう金山の町のあたりには、国道41号に沿って食事のできる店が点在しているので、ここで昼食にしましょう。";

const KINZANCHO_MEMO_NEW =
  "昼食の場所から歩いて約2分。宿場町として栄えた金山の、家と家のあいだを縫うように続く細い路地を、地元の案内人と歩いて、町の暮らしの歴史にふれます。案内は約90〜120分で、前もって金山町観光協会に申し込みましょう。路地には今も人が暮らしているので、静かに歩きましょう。";

const YOKOTANI_MEMO_OLD =
  "金山の町から車で約15分。飛騨木曽川国定公園の中にある渓谷で、山道に沿って、白滝、二見滝、紅葉滝、鶏鳴滝の4つの滝を順にめぐれます。高さは白滝が約17m、二見滝が約13m、紅葉滝が約9m、いちばん奥の鶏鳴滝は約33mあります。谷沿いの道は濡れて滑りやすい所があるので、足元に気をつけましょう。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。帰りは、車で約40分のJR下呂駅の近くでレンタカーを返しましょう。";
const YOKOTANI_MEMO_NEW =
  "昼食の場所の車まで歩いておよそ2分戻り、車で約10分。飛騨木曽川国定公園の中にある渓谷で、山道に沿って、白滝、二見滝、紅葉滝、鶏鳴滝の4つの滝を順にめぐれます。高さは白滝が約17m、二見滝が約13m、紅葉滝が約9m、いちばん奥の鶏鳴滝は約33mあります。谷沿いの道は濡れて滑りやすい所があるので、足元に気をつけましょう。クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。見学を終えたら、車でおよそ28分の下呂温泉噴泉池へ向かいましょう。";

const ONSEN_MEMO =
  "横谷峡から車で約28分。飛騨川の川岸に湧く、下呂温泉のシンボルともいえる無料の足湯です。令和3年(2021)12月から入浴はできなくなりましたが、足湯には入れます。旅の最後に、温泉のぬくもりを感じながら、ひとやすみしましょう。見学を終えたら、車でおよそ9分のJR下呂駅の近くでレンタカーを返しましょう(手続きに15分ほど)。";

async function main() {
  const commit = process.argv.includes("--commit");

  const day1Ids = [ZENSHOJI_ID, AMEJO_ID, ONSENJI_ID];
  const day1Spots = await prisma.spot.findMany({ where: { id: { in: day1Ids } } });
  const day1MemoById = new Map(day1Spots.map((s) => [s.id, s.memo ?? ""]));

  const day1Checks: [string, string, string][] = [
    [ZENSHOJI_ID, "禅昌寺", ZENSHOJI_MEMO_OLD],
    [AMEJO_ID, "湯のまち雨情公園", AMEJO_MEMO_OLD],
    [ONSENJI_ID, "温泉寺", ONSENJI_MEMO_OLD],
  ];
  for (const [id, label, old] of day1Checks) {
    if (day1MemoById.get(id) !== old) {
      console.log(`[想定と違います] ${label} のメモが想定と一致しません。処理を中止します。`);
      return;
    }
  }

  const day2Ids = [NAKAYAMA_ID, KYOSEKI_ID, KANAYAMA_ID, YOKOTANI_ID];
  const day2Spots = await prisma.spot.findMany({ where: { id: { in: day2Ids } } });
  const day2MemoById = new Map(day2Spots.map((s) => [s.id, s.memo ?? ""]));

  const day2Checks: [string, string, string][] = [
    [NAKAYAMA_ID, "中山七里", NAKAYAMA_MEMO_OLD],
    [KYOSEKI_ID, "金山巨石群", KYOSEKI_MEMO_OLD],
    [YOKOTANI_ID, "横谷峡", YOKOTANI_MEMO_OLD],
  ];
  for (const [id, label, old] of day2Checks) {
    if (day2MemoById.get(id) !== old) {
      console.log(`[想定と違います] ${label} のメモが想定と一致しません。処理を中止します。`);
      return;
    }
  }
  const kanayamaSpot = await prisma.spot.findFirstOrThrow({ where: { id: KANAYAMA_ID } });
  if (kanayamaSpot.name !== "金山の町（昼食と筋骨めぐり）") {
    console.log("[想定と違います] 金山の町の名前が想定と一致しません。処理を中止します。");
    return;
  }

  console.log("=== #104 Day1 新しい時刻 ===");
  console.log("禅昌寺 10:55 (34分)");
  console.log("巌立峡 11:59 (45分)");
  console.log("下呂の温泉街 13:29 (45分、昼食)");
  console.log("湯のまち雨情公園 14:20 (20分)");
  console.log("下呂発温泉博物館 14:50 (55分)");
  console.log("温泉寺 15:55 (35分) → 終了16:30");
  console.log("\n=== #104 Day2 新しい時刻 ===");
  console.log("中山七里 09:30 (50分、宿から車9分)");
  console.log("金山巨石群 10:39 (50分、車19分)");
  console.log("金山の町のあたりで昼食(新規) 11:51 (40分、車22分)");
  console.log("金山の町(筋骨めぐり) 12:33 (90分、徒歩2分)");
  console.log("横谷峡 14:15 (85分、徒歩2分+車10分)");
  console.log("下呂温泉噴泉池(新規) 16:08 (22分、車28分) → 終了16:30");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Day1
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: ZENSHOJI_ID, data: { visitTime: t(10, 55), stayDurationMin: 34, memo: ZENSHOJI_MEMO_NEW } },
        { id: GANRITATE_ID, data: { visitTime: t(11, 59), stayDurationMin: 45 } },
        {
          id: GERO_ID,
          data: { visitTime: t(13, 29), stayDurationMin: 45, lat: 35.8093081, lng: 137.2438732 },
        },
        { id: AMEJO_ID, data: { visitTime: t(14, 20), stayDurationMin: 20, memo: AMEJO_MEMO_NEW } },
        { id: HAKUBUTSUKAN_ID, data: { visitTime: t(14, 50), stayDurationMin: 55, memo: HAKUBUTSUKAN_MEMO_NEW } },
        { id: ONSENJI_ID, data: { visitTime: t(15, 55), stayDurationMin: 35, memo: ONSENJI_MEMO_NEW } },
      ],
      { tx }
    );
    await tx.spotTransitLeg.updateMany({ where: { spotId: AMEJO_ID }, data: { transitDurationMin: 6 } });

    // Day2
    await tx.spot.update({
      where: { id: NAKAYAMA_ID },
      data: { memo: NAKAYAMA_MEMO_NEW, lat: 35.7803797, lng: 137.2539482 },
    });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: NAKAYAMA_ID } });

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: NAKAYAMA_ID, data: { visitTime: t(9, 30), stayDurationMin: 50 } },
        { id: KYOSEKI_ID, data: { visitTime: t(10, 39), stayDurationMin: 50, memo: KYOSEKI_MEMO_NEW } },
        {
          create: {
            name: "金山の町のあたりで昼食",
            visitTime: t(11, 51),
            stayDurationMin: 40,
            lat: 35.6607194,
            lng: 137.1574531,
            memo: LUNCH_MEMO,
          },
        },
        {
          id: KANAYAMA_ID,
          data: {
            name: "金山の町（筋骨めぐり）",
            visitTime: t(12, 33),
            stayDurationMin: 90,
            lat: 35.6610545,
            lng: 137.1559925,
            memo: KINZANCHO_MEMO_NEW,
          },
        },
        { id: YOKOTANI_ID, data: { visitTime: t(14, 15), stayDurationMin: 85, memo: YOKOTANI_MEMO_NEW } },
        {
          create: {
            name: "下呂温泉噴泉池",
            visitTime: t(16, 8),
            stayDurationMin: 22,
            lat: 35.8075858,
            lng: 137.2408768,
            memo: ONSEN_MEMO,
          },
        },
      ],
      { tx }
    );

    await tx.spotTransitLeg.updateMany({ where: { spotId: KYOSEKI_ID }, data: { transitDurationMin: 19 } });
    const lunchSpot = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "金山の町のあたりで昼食" } });
    await tx.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 22, transitLine: null } });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: KANAYAMA_ID } });
    await tx.spotTransitLeg.create({ data: { spotId: KANAYAMA_ID, orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null } });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: YOKOTANI_ID } });
    await tx.spotTransitLeg.create({ data: { spotId: YOKOTANI_ID, orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null } });
    await tx.spotTransitLeg.create({ data: { spotId: YOKOTANI_ID, orderNo: 2, transitMode: "car", transitDurationMin: 10, transitLine: null } });
    const onsenSpot = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "下呂温泉噴泉池" } });
    await tx.spotTransitLeg.create({ data: { spotId: onsenSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 28, transitLine: null } });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

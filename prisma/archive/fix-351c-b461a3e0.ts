/**
 * #351の続き。企画運営10/1 13:58の3点の指摘に対応。
 *
 * 1. 文翔館(公式9:00〜16:30)が16:33発では閉館に間に合わず、125分は水増し
 *    (決まりA)だった。見学を55分に短縮し、Day2の順番を
 *    霞城公園→博物館→郷土館→文翔館→山形まるごと館紅の蔵(最後)に変更。
 *    文翔館は13:50着・14:45発で閉館時刻に十分間に合う。紅の蔵を最後の
 *    行き先にして16:30〜17:00の窓に着地させ、空いた時間はここで吸収。
 *    昼食は霞城公園のメモに移した(紅の蔵は最後なので昼食の場面ではない)。
 * 2. 銀山温泉145分(14:20〜16:45)も水増し。95分(14:57〜16:32)に短縮し、
 *    浮いた時間に、企画運営提案の尾花沢市・芭蕉清風歴史資料館(鈴木清風の
 *    旧宅跡、紅花交易で財を築いた俳人で芭蕉と親交があったと伝えられる、
 *    芭蕉が「おくのほそ道」の道中10日あまり滞在した場所)を追加。
 *    大石田駅からバスで尾花沢待合所まで行き(はながさバスの経路に
 *    大石田駅→尾花沢市役所→尾花沢待合所→銀山温泉とあることをウェブで
 *    確認)、資料館見学後は、同社の路線バスが1日5往復と本数が少なく
 *    次便まで長く待つことになるため、尾花沢待合所からタクシーで銀山温泉へ
 *    (決まり8、バスの便がない区間のタクシー利用、理由を一言メモに追加)。
 *    出典: 芭蕉・清風歴史資料館(ja.wikipedia.org)、鈴木清風の紅花商人として
 *    の経歴(thr.mlit.go.jp/yamagata/river/enc/genre/02-reki/reki0101_005.html)、
 *    はながさバスの経路(hanagasa-bus-taisei.co.jp/product3.html)
 * 3. 大石田での昼食の裏付け: Overpass(OSM)で大石田町立歴史民俗資料館
 *    (38.5888542,140.3730784)の東およそ170mに「そば処善之助」
 *    (38.5904021,140.3732493、amenity=restaurant)、大石田駅周辺にも
 *    「そば処ふうりゅう」「おさえ屋もくれん」等の飲食店を複数確認。
 *    本文では特定の店名は出さず(単一店舗の宣伝を避ける、既存の方針どおり)、
 *    報告にのみ記録。
 *
 * 座標の出典: 尾花沢待合所38.6016237,140.4010665・芭蕉清風歴史資料館
 * 38.6064124,140.4044537(ともにNominatim名称一致)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351c-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "5c704619-9dae-4341-8f20-5fd93f3c205d";
const DAY2_ID = "54d2bf64-6494-40cb-96c2-877861b27eaa";

const RISSHAKUJI_ID = "48d424b5-9b19-4766-b351-6a6579a82148";
const BASHO_ID = "53bff0b7-6e99-4111-8c15-c0277a878909";
const OISHIDA_ID = "a665b6d5-0628-49e2-9263-277d3222b7cb";
const GINZAN_ID = "50daa482-cf8e-4551-9ac0-eca54c71f578";

const SHIRAGANE_FALLS_ID = "e906056d-38c8-45b0-879e-a98dc3edbea8";
const SHIROGANEYU_ID = "c431760f-e5ec-4d32-b165-d3e7c0736fdf";
const KAJOKOEN_ID = "6c3d9355-885a-4c25-bcd0-e18788de65b9";
const MUSEUM_ID = "29811af4-c4a3-49a3-b26a-838897de68c5";
const KYODOKAN_ID = "c7d2f61b-668c-4eaf-aac6-c2f9ec3608ac";
const BENINOKURA_ID = "0eb03bc1-7dce-4990-8c70-de23840c68fc";
const BUNSHOKAN_ID = "6d4feffc-3070-461d-902b-20b56df68a63";

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY1_ID, name: "芭蕉・清風歴史資料館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const oishida = await prisma.spot.findUniqueOrThrow({ where: { id: OISHIDA_ID } });
  const oishidaNewMemo = oishida.memo!.replace(
    "見学を終えたら、大石田駅からバスでおよそ40分の銀山温泉へ向かいましょう。",
    "見学を終えたら、大石田駅からバスを乗り継いで、尾花沢市の芭蕉・清風歴史資料館へ向かいましょう。"
  );
  if (oishidaNewMemo === oishida.memo) throw new Error("大石田町立歴史民俗資料館: anchor not found");

  const seifuMemo =
    "大石田町立歴史民俗資料館を見学したら、大石田駅からバスを乗り継いで、尾花沢市の芭蕉・清風歴史資料館へ向かいましょう。紅花交易で財を築いた豪商・鈴木清風の旧宅跡に建つ資料館です。清風は俳句をたしなむ風流人としても知られ、松尾芭蕉とも親交があったと伝えられています。「おくのほそ道」の道中、芭蕉は清風のもとに10日あまり滞在したといわれています。館内には、芭蕉の真筆や、清風ゆかりの品々が展示されています。見学を終えたら、このあたりは路線バスの本数が限られるため、タクシーで銀山温泉へ向かいましょう。";

  const ginzan = await prisma.spot.findUniqueOrThrow({ where: { id: GINZAN_ID } });
  const ginzanNewMemo = ginzan.memo!.replace(
    "大石田町立歴史民俗資料館を見学したら、大石田駅からバスでおよそ40分の銀山温泉へ向かいましょう。",
    "芭蕉・清風歴史資料館を見学したら、タクシーで銀山温泉へ向かいましょう。"
  );
  if (ginzanNewMemo === ginzan.memo) throw new Error("銀山温泉: anchor not found");

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: RISSHAKUJI_ID, data: {} },
      { id: BASHO_ID, data: {} },
      { id: OISHIDA_ID, data: { memo: oishidaNewMemo } },
      {
        create: {
          name: "芭蕉・清風歴史資料館",
          address: "山形県尾花沢市中町5-36",
          lat: 38.6064124,
          lng: 140.4044537,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 57)),
          stayDurationMin: 35,
          transitMode: "bus",
          transitDurationMin: 32,
          memo: seifuMemo,
        },
      },
      {
        id: GINZAN_ID,
        data: { memo: ginzanNewMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 57)), stayDurationMin: 95, transitMode: "car", transitDurationMin: 25, transitLine: null },
      },
    ],
    {}
  );

  // Day2: 霞城公園→博物館→郷土館→文翔館→紅の蔵(最後) に並べ替え、
  // 文翔館を55分に短縮、昼食を霞城公園のメモへ移す
  const kajojoen = await prisma.spot.findUniqueOrThrow({ where: { id: KAJOKOEN_ID } });
  const kajojoenNewMemo = kajojoen.memo!.replace(
    "しろがね湯を見学したら、JR線とバスを乗り継いで霞城公園へ向かいましょう。",
    "しろがね湯を見学したら、JR線とバスを乗り継いで霞城公園へ向かいましょう。到着したら、まずこのあたりで昼食をとりましょう。"
  );
  if (kajojoenNewMemo === kajojoen.memo) throw new Error("霞城公園: anchor not found");

  const kyodokan = await prisma.spot.findUniqueOrThrow({ where: { id: KYODOKAN_ID } });
  const kyodokanNewMemo = kyodokan.memo!.replace(
    "見学を終えたら、歩いておよそ13分の山形まるごと館紅の蔵へ向かいましょう。",
    "見学を終えたら、歩いておよそ16分の文翔館へ向かいましょう。"
  );
  if (kyodokanNewMemo === kyodokan.memo) throw new Error("山形市郷土館: anchor not found");

  const bunshokanMemo =
    "山形市郷土館を見学したら、歩いておよそ16分の文翔館へ向かいましょう。大正2年(1913)に着工し、大正5年(1916)に完成した、旧山形県庁舎と旧県会議事堂からなる建物です。英国近世復興様式と呼ばれる重厚な石貼りの外観が特徴で、設計は米沢出身の建築家・中條精一郎の指導のもと、田原新之助が手がけました。昭和50年(1975)まで実際に県庁舎として使われたのち、昭和59年(1984)に国の重要文化財に指定され、復原工事を経て公開されています。れんが造りの重厚な建物を見学でき、大正ロマンの香り漂う内部装飾も見どころです。見学を終えたら、歩いておよそ16分の山形まるごと館紅の蔵へ向かいましょう。";

  const beninokuraMemo =
    "文翔館を見学したら、歩いておよそ16分の山形まるごと館紅の蔵へ向かいましょう。紅花商人の蔵屋敷だった建物群を活用した施設で、築120年あまりの蔵を改修し、そば処や食堂、土産物店、地場の農産物直売所などが入っています。山形の食や工芸にふれながら、蔵のたたずまいをゆっくり楽しみましょう。山寺の石段から銀山温泉のガス灯、そしてここまで、雪の山形を巡る旅の締めくくりに、ゆっくりと見学しましょう。山形駅へは、ここから歩いて戻ることができます。";

  await setDaySpotOrder(
    DAY2_ID,
    [
      { id: SHIRAGANE_FALLS_ID, data: {} },
      { id: SHIROGANEYU_ID, data: {} },
      { id: KAJOKOEN_ID, data: { memo: kajojoenNewMemo } },
      { id: MUSEUM_ID, data: {} },
      { id: KYODOKAN_ID, data: { memo: kyodokanNewMemo } },
      {
        id: BUNSHOKAN_ID,
        data: { memo: bunshokanMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 16 },
      },
      {
        id: BENINOKURA_ID,
        data: { memo: beninokuraMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 1)), stayDurationMin: 95, transitMode: "walk", transitDurationMin: 16 },
      },
    ],
    {}
  );

  console.log("#351: 企画運営指摘3点に対応完了");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * 冬の特集の追加の見直し。城崎(6e2f29bb)の終わりの文・書き出しの分なし(10章の一覧 C・D)。
 * 法務のOK(2026-11-02 03:07/03:12/03:13)にもとづく。
 *
 * 内容:
 *  - Day1: 玄武洞公園・四所神社・御所の湯・一の湯・大谿川の柳並木・柳湯の
 *    書き出し/終わりの文に分を追加
 *  - Day2: 城崎温泉ロープウェイ・温泉寺・鴻の湯・極楽寺・日和山海岸・
 *    城崎マリンワールドの書き出し/終わりの文に分を追加。日和山海岸の開始の文は
 *    会社名(全但バス→路線バス)と分の不一致(約10分→実は30分)を、公式時刻表で
 *    確かめた乗車およそ10分にもとづき、歩き11分+バス10分の2区間に直す
 *  - 極楽寺→日和山海岸のtransitLegを bus/30 の1区間から walk/11 + bus/10 の
 *    2区間に変更(9分短縮)
 *  - 日和山海岸・城崎マリンワールドの到着時刻を変えないため、Day2の最初(城崎温泉
 *    ロープウェイ〜極楽寺)の visitTime を9分ずつ後ろへずらす(09:10→09:19ほか)。
 *    滞在時間(stayDurationMin)は変えない
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-kinosaki.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-kinosaki.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const memoEdits = [
  // --- Day1 ---
  {
    spotId: "66a2e6d4-eaaf-46f0-8472-560d90ea2d6e",
    label: "玄武洞公園(終わり)",
    find: "岩場では足元に気をつけましょう。",
    replace: "岩場では足元に気をつけましょう。この後は、タクシーでおよそ10分、四所神社へ向かいましょう。",
  },
  {
    spotId: "fed7f0d0-58f7-4fb3-81fe-de1656c71f5b",
    label: "四所神社(書き出し)",
    find: "玄武洞からタクシーで温泉街へ。",
    replace: "玄武洞から、タクシーでおよそ10分、温泉街の四所神社に着きます。",
  },
  {
    spotId: "fed7f0d0-58f7-4fb3-81fe-de1656c71f5b",
    label: "四所神社(終わり)",
    find: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    replace: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。この後は、歩いておよそ2分、御所の湯へ向かいましょう。",
  },
  {
    spotId: "6048f7ad-4adb-4f44-8a8a-19720a461b5a",
    label: "御所の湯(書き出し)",
    find: "四所神社のすぐ隣。",
    replace: "四所神社から歩いておよそ2分、すぐ隣の御所の湯に着きます。",
  },
  {
    spotId: "6048f7ad-4adb-4f44-8a8a-19720a461b5a",
    label: "御所の湯(終わり)",
    find: "このあと、温泉街で昼食にしましょう。",
    replace: "このあと、歩いておよそ5分の城崎温泉観光協会のあたりで昼食にしましょう。",
  },
  {
    spotId: "983157d4-8b39-4b6f-8f11-bb866cfd736f",
    label: "一の湯(書き出し)",
    find: "昼食のあとは、温泉街の中ほどにある一の湯へ。",
    replace: "昼食のあとは、歩いておよそ3分、温泉街の中ほどにある一の湯に着きます。",
  },
  {
    spotId: "983157d4-8b39-4b6f-8f11-bb866cfd736f",
    label: "一の湯(終わり)",
    find: "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。",
    replace: "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。見学を終えたら、歩いておよそ2分、大谿川の柳並木へ向かいましょう。",
  },
  {
    spotId: "71373291-0cb9-4fb2-a18c-eb1e37de47b7",
    label: "大谿川の柳並木(書き出し)",
    find: "一の湯の前を流れる大谿川（おおたにがわ）沿いを、ゆかたで歩きましょう。",
    replace: "一の湯から歩いておよそ2分、大谿川（おおたにがわ）沿いに着きます。ゆかたで歩きましょう。",
  },
  {
    spotId: "71373291-0cb9-4fb2-a18c-eb1e37de47b7",
    label: "大谿川の柳並木(終わり)",
    find: "雪の日は足元が滑りやすいので、下駄で歩くときは気をつけましょう。",
    replace: "雪の日は足元が滑りやすいので、下駄で歩くときは気をつけましょう。この後は、歩いておよそ5分、柳湯へ向かいましょう。",
  },
  {
    spotId: "30bc31eb-6204-43b4-a8ef-5bc766694975",
    label: "柳湯(書き出し)",
    find: "大谿川沿いを歩いて柳湯へ。",
    replace: "大谿川沿いを歩いておよそ5分、柳湯に着きます。",
  },
  // --- Day2 ---
  {
    spotId: "f27d819a-ae1b-4910-8993-dbb764ba9946",
    label: "城崎温泉ロープウェイ(終わり)",
    find: "帰りは、途中の温泉寺駅で降りて温泉寺にお参りします。",
    replace: "帰りは、ロープウェイでおよそ5分、途中の温泉寺駅で降りて温泉寺にお参りします。",
  },
  {
    spotId: "0cdbc921-dcf1-424d-8dd6-6f316867be90",
    label: "温泉寺(書き出し)",
    find: "ロープウェイの温泉寺駅は、温泉寺にお参りするためにつくられた駅です。",
    replace: "ロープウェイでおよそ5分の温泉寺駅は、温泉寺にお参りするためにつくられた駅です。",
  },
  {
    spotId: "0cdbc921-dcf1-424d-8dd6-6f316867be90",
    label: "温泉寺(終わり)",
    find: "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    replace:
      "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。この後は、ロープウェイで山麓駅へ下り、歩いて、あわせておよそ15分、鴻の湯へ向かいましょう。",
  },
  {
    spotId: "140a6e04-960e-46dd-ab2f-1f3959648456",
    label: "鴻の湯(書き出し)",
    find: "温泉寺駅からロープウェイで下りて、鴻の湯へ。",
    replace: "温泉寺駅からロープウェイで山麓駅へ下り、歩いて、あわせておよそ15分の鴻の湯に着きます。",
  },
  {
    spotId: "d31238c3-fbfd-4b81-add6-43ef6311d4dd",
    label: "地蔵湯(終わり)",
    find: "湯で温まったら、温泉街で昼食にしましょう。",
    replace: "湯で温まったら、歩いておよそ4分の弁天山のあたりで昼食にしましょう。",
  },
  {
    spotId: "45b0bfa3-54ce-477c-9390-45bb1e0f2493",
    label: "極楽寺(書き出し)",
    find: "昼食のあとは、温泉街の西南のすみ、ロープウェイ乗り場の手前の奥まったところにある極楽寺へ。",
    replace: "昼食のあとは、歩いておよそ5分、温泉街の西南のすみ、ロープウェイ乗り場の手前の奥まったところにある極楽寺に着きます。",
  },
  {
    spotId: "c763c586-3108-4f47-b68a-37aabc2b25fc",
    label: "日和山海岸(書き出し)",
    find: "極楽寺から温泉街を歩いてバス停へ向かい、全但バスで日和山海岸へ（乗車は約10分）。",
    replace: "極楽寺から歩いておよそ11分のバス停から、路線バスでおよそ10分、日和山海岸へ向かいましょう。",
  },
  {
    spotId: "c763c586-3108-4f47-b68a-37aabc2b25fc",
    label: "日和山海岸(終わり)",
    find: "海岸の岩場や柵のない場所では、足元に気をつけましょう。",
    replace: "海岸の岩場や柵のない場所では、足元に気をつけましょう。この後は、歩いておよそ5分、城崎マリンワールドへ向かいましょう。",
  },
  {
    spotId: "31ae3e93-3f3a-4995-b527-ba9a51ad82a1",
    label: "城崎マリンワールド(書き出し)",
    find: "旅の締めくくりは、日和山海岸に面した城崎マリンワールドへ。",
    replace: "旅の締めくくりは、日和山海岸から歩いておよそ5分の城崎マリンワールドへ。",
  },
  {
    spotId: "31ae3e93-3f3a-4995-b527-ba9a51ad82a1",
    label: "城崎マリンワールド(終わり)",
    find: "帰りは、バスで城崎温泉駅へ戻ります。",
    replace: "帰りは、バスでおよそ14分、城崎温泉駅へ戻ります。",
  },
];

// Day2のvisitTimeを9分後ろへ(城崎温泉ロープウェイ〜極楽寺のみ。日和山海岸・マリンワールドは変えない)
const timeShifts = [
  { spotId: "f27d819a-ae1b-4910-8993-dbb764ba9946", label: "城崎温泉ロープウェイ", newVisitTime: Date.UTC(1970, 0, 1, 9, 19) },
  { spotId: "0cdbc921-dcf1-424d-8dd6-6f316867be90", label: "温泉寺", newVisitTime: Date.UTC(1970, 0, 1, 10, 14) },
  { spotId: "140a6e04-960e-46dd-ab2f-1f3959648456", label: "鴻の湯", newVisitTime: Date.UTC(1970, 0, 1, 11, 9) },
  { spotId: "d31238c3-fbfd-4b81-add6-43ef6311d4dd", label: "地蔵湯", newVisitTime: Date.UTC(1970, 0, 1, 12, 4) },
  { spotId: "45b0bfa3-54ce-477c-9390-45bb1e0f2493", label: "極楽寺", newVisitTime: Date.UTC(1970, 0, 1, 13, 39) },
];

const HIYORIYAMA_LEG_SPOT_ID = "c763c586-3108-4f47-b68a-37aabc2b25fc";
const OLD_LEG_ID = "6d05faf4-615c-4643-9f7d-9e50b52b0c9a";

const DAY1_ID = "278062c4-541a-4152-b871-16121ae9c38b";
const DAY2_ID = "aa643f2b-6bf0-406f-a4b1-a44cf0c234f8";
const ICHINOYU_LEG_ID = "827ad1fd-74eb-4ebf-a6a0-c68d177dab42";
const GOKURAKUJI_LEG_ID = "9e026f33-3f59-4b27-a53c-900181fb16ee";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma
    .$transaction(
      async (tx) => {
        for (const e of memoEdits) {
          const spot = await tx.spot.findUniqueOrThrow({ where: { id: e.spotId } });
          if (!spot.memo?.includes(e.find)) {
            throw new Error(`[想定と違います] ${e.label}のメモに対象の文がありません。現在のメモ: ${spot.memo}`);
          }
          const newMemo = spot.memo.replace(e.find, e.replace);
          console.log(`\n=== ${e.label} ===`);
          console.log("直前:", spot.memo);
          console.log("直後:", newMemo);
          await tx.spot.update({ where: { id: e.spotId }, data: { memo: newMemo } });
        }

        console.log("\n=== 時刻の後ろ倒し(Day2、9分) ===");
        for (const t of timeShifts) {
          const spot = await tx.spot.findUniqueOrThrow({ where: { id: t.spotId } });
          console.log(`${t.label}: ${spot.visitTime?.toISOString()} → ${new Date(t.newVisitTime).toISOString()}`);
          await tx.spot.update({ where: { id: t.spotId }, data: { visitTime: new Date(t.newVisitTime) } });
        }

        console.log("\n=== Day1 昼食スポットの追加(御所の湯→一の湯の55分のすき間) ===");
        console.log("点: 城崎温泉観光協会前 = OSM node 4883833221 (tourism=information) lat=35.6252454 lng=134.8105817");
        // 一の湯以降のorderNoを1つずつ後ろへ(大きい方から)
        for (const [name, from, to] of [
          ["まんだら湯", 7, 8],
          ["柳湯", 6, 7],
          ["大谿川の柳並木", 5, 6],
          ["一の湯", 4, 5],
        ] as const) {
          await tx.spot.updateMany({ where: { dayId: DAY1_ID, orderNo: from }, data: { orderNo: to } });
          console.log(`orderNo付け替え: ${name} ${from}→${to}`);
        }
        const lunch1 = await tx.spot.create({
          data: {
            dayId: DAY1_ID,
            orderNo: 4,
            name: "城崎温泉観光協会前（昼食）",
            lat: 35.6252454,
            lng: 134.8105817,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 10)),
            stayDurationMin: 45,
            memo:
              "御所の湯から歩いておよそ5分、城崎温泉観光協会のあたりに着きます。温泉街の中心部にあるこのあたりで、昼食にしましょう。昼食を終えたら、歩いておよそ3分、一の湯へ向かいましょう。",
          },
        });
        console.log(`新規スポット作成: ${lunch1.name} id=${lunch1.id} orderNo=4 visitTime=13:10 stay=45`);
        await tx.spotTransitLeg.create({ data: { spotId: lunch1.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
        await tx.spotTransitLeg.update({ where: { id: ICHINOYU_LEG_ID }, data: { transitDurationMin: 3 } });
        console.log("一の湯のtransitLeg: walk/5 → walk/3");

        console.log("\n=== Day1 一の湯以降を7分前へ(新しい昼食の時刻にそろえる) ===");
        for (const s of [
          { id: "983157d4-8b39-4b6f-8f11-bb866cfd736f", label: "一の湯", newVisitTime: Date.UTC(1970, 0, 1, 13, 58) },
          { id: "71373291-0cb9-4fb2-a18c-eb1e37de47b7", label: "大谿川の柳並木", newVisitTime: Date.UTC(1970, 0, 1, 14, 45) },
          { id: "30bc31eb-6204-43b4-a8ef-5bc766694975", label: "柳湯", newVisitTime: Date.UTC(1970, 0, 1, 15, 18) },
          { id: "9bd4e88c-da75-43a6-b5f1-2c0040f52c26", label: "まんだら湯", newVisitTime: Date.UTC(1970, 0, 1, 15, 58) },
        ]) {
          const spot = await tx.spot.findUniqueOrThrow({ where: { id: s.id } });
          console.log(`${s.label}: ${spot.visitTime?.toISOString()} → ${new Date(s.newVisitTime).toISOString()}`);
          await tx.spot.update({ where: { id: s.id }, data: { visitTime: new Date(s.newVisitTime) } });
        }

        console.log("\n=== Day2 昼食スポットの追加(地蔵湯→極楽寺のすき間) ===");
        console.log("点: 弁天山 = OSM node 5599996111 (tourism=viewpoint) lat=35.6258956 lng=134.8120322");
        for (const [name, from, to] of [
          ["城崎マリンワールド", 7, 8],
          ["日和山海岸", 6, 7],
          ["極楽寺", 5, 6],
        ] as const) {
          await tx.spot.updateMany({ where: { dayId: DAY2_ID, orderNo: from }, data: { orderNo: to } });
          console.log(`orderNo付け替え: ${name} ${from}→${to}`);
        }
        const lunch2 = await tx.spot.create({
          data: {
            dayId: DAY2_ID,
            orderNo: 5,
            name: "弁天山（昼食）",
            lat: 35.6258956,
            lng: 134.8120322,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 53)),
            stayDurationMin: 41,
            memo: "地蔵湯から歩いておよそ4分、弁天山のあたりに着きます。このあたりで昼食にしましょう。昼食を終えたら、歩いておよそ5分、極楽寺へ向かいましょう。",
          },
        });
        console.log(`新規スポット作成: ${lunch2.name} id=${lunch2.id} orderNo=5 visitTime=12:53 stay=41`);
        await tx.spotTransitLeg.create({ data: { spotId: lunch2.id, orderNo: 1, transitMode: "walk", transitDurationMin: 4 } });
        await tx.spotTransitLeg.update({ where: { id: GOKURAKUJI_LEG_ID }, data: { transitDurationMin: 5 } });
        console.log("極楽寺のtransitLeg: walk/15 → walk/5");

        console.log("\n=== 極楽寺→日和山海岸のtransitLegを2区間に ===");
        const oldLeg = await tx.spotTransitLeg.findUniqueOrThrow({ where: { id: OLD_LEG_ID } });
        console.log(`直前: orderNo=${oldLeg.orderNo} mode=${oldLeg.transitMode} durationMin=${oldLeg.transitDurationMin}`);
        await tx.spotTransitLeg.update({
          where: { id: OLD_LEG_ID },
          data: { transitMode: "walk", transitDurationMin: 11 },
        });
        const newLeg = await tx.spotTransitLeg.create({
          data: { spotId: HIYORIYAMA_LEG_SPOT_ID, orderNo: 2, transitMode: "bus", transitDurationMin: 10 },
        });
        console.log(`直後: [1] walk 11分, [2] bus 10分 (新規leg id=${newLeg.id})`);

        if (!commit) {
          console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
          throw new Error("DRY_RUN_ROLLBACK");
        }
      },
      { timeout: 60000 }
    )
    .catch((e) => {
      if (e.message === "DRY_RUN_ROLLBACK") return;
      throw e;
    });

  if (commit) console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

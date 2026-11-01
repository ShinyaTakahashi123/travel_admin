/**
 * 冬の特集の追加の見直し(10章の一覧 list C・D、法務 2026-11-02 03:12/03:15/03:34/03:37/03:41)。
 * 制作補助の担当で残っていた4本分(伊勢・草津・山寺銀山・成田)と、
 * 企画運営の追加の依頼(日光の輪王寺の点ずれ)をまとめて1本に。
 *
 * - 伊勢・山寺銀山・草津(白旗の湯)・草津(スキー場→図書館)・草津(西の河原通り)は
 *   既存のtransitLegの分と一致する文のみの直し(時刻・DBの変更なし)
 * - 草津(西の河原通りの帰り)は、歩き(OSRM routed-foot)+バス(JRバス関東の公式の
 *   目安およそ22〜25分)を文に追加。最後のスポットなので時刻の変更なし
 *
 * - 成田(案A、企画運営 2026-11-02決定): 表参道→宗吾霊堂、宗吾霊堂→佐倉城址公園の
 *   どちらも、電車の1区間だけで駅までの歩きが入っていなかった
 *   - 表参道→京成成田駅: OSRM routed-foot 12分
 *   - 京成成田駅→宗吾参道駅: 京成本線1駅、公式の時刻表(駅探/ジョルダン/NAVITIME)で
 *     多くの便がおよそ5分 https://ekitan.com/transit/route/sf-2073/st-2431
 *   - 宗吾参道駅→宗吾霊堂: OSRM routed-foot 13分
 *   - 宗吾霊堂→宗吾参道駅(帰り方向、ほぼ同じ): OSRM routed-foot 13分
 *   - 宗吾参道駅→京成佐倉駅: 京成本線、公式の時刻表でおよそ6〜7分(7分を使用)
 *     https://ekitan.com/transit/route/sf-2431/st-2181
 *   - 京成佐倉駅→佐倉城址公園: OSRM routed-foot 21分(佐倉市公式サイトの「徒歩約20分」とも近い)
 *   新しい移動の合計は、表参道→宗吾霊堂30分(+15)、宗吾霊堂→佐倉城址公園41分(+26)。
 *   のびた41分は、滞在を縮めて吸収(ずれは滞在で合わせる、延ばさない):
 *   表参道48→38分、宗吾霊堂35→30分、佐倉城址公園75→55分、佐倉武家屋敷通り50→44分
 *   (縮めた合計41分=10+5+20+6)。佐倉武家屋敷通りの出る時刻は16:37で、今とまったく同じ
 *
 * - 日光(8912b8d0、企画運営の依頼): 輪王寺の点が、同名の碑(OSM node13720153425、
 *   historic=memorial)の値(36.755271,139.599785)になっていた。3b74d624(制作補助2)で
 *   見つけた正しい点、OSM輪王寺way699236460(36.7547249,139.600759、place_of_worship)に
 *   そろえる。タクシー(東武日光駅→輪王寺)は11分のまま(7章の上限の中なので変えない)。
 *   輪王寺→東照宮の歩きは、点が動いたため5分→8分(OSRM)。東照宮の着く時刻11:30→11:33、
 *   滞在75→72分で、出る時刻12:45は変わらず、二荒山神社からあとの時刻はそのまま
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-round5-openings.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-round5-openings.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const edits = [
  {
    spotId: "95f78f86-aa35-401f-8899-212584b67369",
    label: "山寺の門前（昼食）(書き出し)",
    find: "立石寺から石段を下り、ふもとへ。",
    replace: "立石寺から歩いておよそ5分、石段を下りてふもとへ。",
  },
  {
    spotId: "6c3d9355-885a-4c25-bcd0-e18788de65b9",
    label: "霞城公園（山形城跡）(書き出し)",
    find: "しろがね湯を見学したら、JR線とバスを乗り継いで霞城公園へ向かいましょう。",
    replace: "しろがね湯から、JR線とバスを乗り継いで、あわせておよそ1時間50分の霞城公園に着きます。",
  },
  {
    spotId: "afbffd04-3751-4ad0-90c3-6f11663b7024",
    label: "山形美術館(書き出し)",
    find: "最上義光歴史館を見学したら、歩いてすぐの山形美術館へ向かいましょう。",
    replace: "最上義光歴史館から歩いておよそ2分、山形美術館に着きます。",
  },
  {
    spotId: "bcf48878-7cae-4987-90ef-1fdae851cf1c",
    label: "おかげ横丁(書き出し)",
    find: "内宮から歩いてすぐ、おかげ横丁に着きます。",
    replace: "内宮から歩いておよそ15分、おかげ横丁に着きます。",
  },
  {
    spotId: "5e1ac0c4-2732-4667-9ade-a154841a1159",
    label: "白旗の湯(書き出し)",
    find: "湯畑からは歩いてすぐです。",
    replace: "湯畑からは歩いておよそ1分です。",
  },
  {
    spotId: "cd4b986c-6e08-4328-a4d1-2fd013807480",
    label: "草津温泉スキー場(終わり)",
    find: "続いては、同じ路線バスで草津温泉バスターミナルへ戻り、歩いてすぐの温泉図書館へ向かいましょう。",
    replace: "続いては、同じ路線バスで草津温泉バスターミナルへ戻り、歩いておよそ1分の温泉図書館へ向かいましょう。",
  },
  {
    spotId: "c0ceb352-1604-46fc-808f-e12ce6f45616",
    label: "西の河原通り(食べ歩き表現)",
    find: "通り沿いには、温泉まんじゅうや温泉たまご、ご当地ソフトクリームなどを売る店が軒を連ねており、食べ歩きをしながらそぞろ歩くのにぴったりの通りです。",
    replace: "通り沿いには、温泉まんじゅうや温泉たまご、ご当地ソフトクリームなどを売る店が軒を連ねています。",
  },
  {
    spotId: "c0ceb352-1604-46fc-808f-e12ce6f45616",
    label: "西の河原通り(終わり・帰り)",
    find: "見学を終えたら、草津温泉バスターミナルまで歩いて戻り、路線バスで長野原草津口駅へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ7分の草津温泉バスターミナルまで戻り、路線バスでおよそ25分の長野原草津口駅へ向かいましょう。",
  },
  {
    spotId: "d5cf73e2-4d90-4d23-a96d-13772cbbbdd2",
    label: "成田山表参道(終わり)",
    find: "続いては、電車でおよそ15分、宗吾霊堂へ向かいましょう。",
    replace: "続いては、歩いておよそ12分の京成成田駅から、電車でおよそ5分、宗吾参道駅から歩いておよそ13分、宗吾霊堂へ向かいましょう。",
  },
  {
    spotId: "fa3413e5-a16c-438f-bfaf-12aa4ddc2069",
    label: "宗吾霊堂(書き出し)",
    find: "成田山表参道から電車でおよそ15分、宗吾参道駅から歩いてすぐの宗吾霊堂（東勝寺）に着きます。",
    replace: "成田山表参道から歩いておよそ12分の京成成田駅から、電車でおよそ5分、宗吾参道駅から歩いておよそ13分の宗吾霊堂（東勝寺）に着きます。",
  },
  {
    spotId: "fa3413e5-a16c-438f-bfaf-12aa4ddc2069",
    label: "宗吾霊堂(終わり)",
    find: "続いては、電車でおよそ15分、佐倉城址公園へ向かいましょう。",
    replace: "続いては、歩いておよそ13分の宗吾参道駅から、電車でおよそ7分、京成佐倉駅から歩いておよそ21分、佐倉城址公園へ向かいましょう。",
  },
  {
    spotId: "f00e17f1-9c09-42e3-b652-505985833dcb",
    label: "佐倉城址公園(書き出し)",
    find: "宗吾霊堂から電車でおよそ15分、佐倉城址公園に着きます。",
    replace: "宗吾霊堂から歩いておよそ13分の宗吾参道駅から、電車でおよそ7分、京成佐倉駅から歩いておよそ21分、佐倉城址公園に着きます。",
  },
  {
    spotId: "ec5e15e5-e0ee-4683-b839-9e65bef75d40",
    label: "日光山輪王寺(終わり)",
    find: "この後は、歩いておよそ5分、日光東照宮へ向かいましょう。",
    replace: "この後は、歩いておよそ8分、日光東照宮へ向かいましょう。",
  },
  {
    spotId: "6ba6b15d-4745-4ff5-be0f-19d9ba5c5868",
    label: "日光東照宮(書き出し)",
    find: "輪王寺から歩いておよそ5分、江戸幕府を開いた徳川家康をまつる日光東照宮に着きます。",
    replace: "輪王寺から歩いておよそ8分、江戸幕府を開いた徳川家康をまつる日光東照宮に着きます。",
  },
];

const naritaStayUpdates = [
  { spotId: "d5cf73e2-4d90-4d23-a96d-13772cbbbdd2", label: "成田山表参道", newStay: 38 },
  { spotId: "fa3413e5-a16c-438f-bfaf-12aa4ddc2069", label: "宗吾霊堂", newStay: 30 },
  { spotId: "f00e17f1-9c09-42e3-b652-505985833dcb", label: "佐倉城址公園", newStay: 55 },
  { spotId: "ca8ccc45-8470-4885-ba08-9dc9e69e9c1a", label: "佐倉武家屋敷通り", newStay: 44 },
];
const naritaTimeShifts = [
  { spotId: "fa3413e5-a16c-438f-bfaf-12aa4ddc2069", label: "宗吾霊堂", newVisitTime: Date.UTC(1970, 0, 1, 13, 35) },
  { spotId: "f00e17f1-9c09-42e3-b652-505985833dcb", label: "佐倉城址公園", newVisitTime: Date.UTC(1970, 0, 1, 14, 46) },
  { spotId: "ca8ccc45-8470-4885-ba08-9dc9e69e9c1a", label: "佐倉武家屋敷通り", newVisitTime: Date.UTC(1970, 0, 1, 15, 53) },
];
const SOGOREIDO_SPOT_ID = "fa3413e5-a16c-438f-bfaf-12aa4ddc2069";
const SAKURAJOSHI_SPOT_ID = "f00e17f1-9c09-42e3-b652-505985833dcb";
const RINNOJI_SPOT_ID = "ec5e15e5-e0ee-4683-b839-9e65bef75d40";
const TOSHOGU_SPOT_ID = "6ba6b15d-4745-4ff5-be0f-19d9ba5c5868";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      for (const e of edits) {
        const spot = await tx.spot.findUniqueOrThrow({ where: { id: e.spotId } });
        if (!spot.memo?.includes(e.find)) throw new Error(`[想定と違います] ${e.label}のメモに対象の文がありません。現在のメモ: ${spot.memo}`);
        const newMemo = spot.memo.replace(e.find, e.replace);
        console.log(`\n=== ${e.label} ===`);
        console.log("直前:", spot.memo);
        console.log("直後:", newMemo);
        await tx.spot.update({ where: { id: e.spotId }, data: { memo: newMemo } });
      }

      console.log("\n=== 宗吾霊堂のtransitLegを3区間に(train/15 → walk/12 + train/5 + walk/13) ===");
      const oldLeg1 = await tx.spotTransitLeg.findFirstOrThrow({ where: { spotId: SOGOREIDO_SPOT_ID, orderNo: 1 } });
      console.log(`直前: orderNo=${oldLeg1.orderNo} mode=${oldLeg1.transitMode} durationMin=${oldLeg1.transitDurationMin}`);
      await tx.spotTransitLeg.update({ where: { id: oldLeg1.id }, data: { transitMode: "walk", transitDurationMin: 12 } });
      const newLeg1b = await tx.spotTransitLeg.create({
        data: { spotId: SOGOREIDO_SPOT_ID, orderNo: 2, transitMode: "train", transitDurationMin: 5 },
      });
      const newLeg1c = await tx.spotTransitLeg.create({
        data: { spotId: SOGOREIDO_SPOT_ID, orderNo: 3, transitMode: "walk", transitDurationMin: 13 },
      });
      console.log(`直後: [1] walk 12分, [2] train 5分(id=${newLeg1b.id}), [3] walk 13分(id=${newLeg1c.id})`);

      console.log("\n=== 佐倉城址公園のtransitLegを3区間に(train/15 → walk/13 + train/7 + walk/21) ===");
      const oldLeg2 = await tx.spotTransitLeg.findFirstOrThrow({ where: { spotId: SAKURAJOSHI_SPOT_ID, orderNo: 1 } });
      console.log(`直前: orderNo=${oldLeg2.orderNo} mode=${oldLeg2.transitMode} durationMin=${oldLeg2.transitDurationMin}`);
      await tx.spotTransitLeg.update({ where: { id: oldLeg2.id }, data: { transitMode: "walk", transitDurationMin: 13 } });
      const newLeg2b = await tx.spotTransitLeg.create({
        data: { spotId: SAKURAJOSHI_SPOT_ID, orderNo: 2, transitMode: "train", transitDurationMin: 7 },
      });
      const newLeg2c = await tx.spotTransitLeg.create({
        data: { spotId: SAKURAJOSHI_SPOT_ID, orderNo: 3, transitMode: "walk", transitDurationMin: 21 },
      });
      console.log(`直後: [1] walk 13分, [2] train 7分(id=${newLeg2b.id}), [3] walk 21分(id=${newLeg2c.id})`);

      console.log("\n=== 成田: 滞在の圧縮(ずれは滞在で合わせる) ===");
      for (const s of naritaStayUpdates) {
        const spot = await tx.spot.findUniqueOrThrow({ where: { id: s.spotId } });
        console.log(`${s.label}: stay ${spot.stayDurationMin} → ${s.newStay}`);
        await tx.spot.update({ where: { id: s.spotId }, data: { stayDurationMin: s.newStay } });
      }

      console.log("\n=== 成田: 宗吾霊堂・佐倉城址公園・佐倉武家屋敷通りの着く時刻 ===");
      for (const t of naritaTimeShifts) {
        const spot = await tx.spot.findUniqueOrThrow({ where: { id: t.spotId } });
        console.log(`${t.label}: ${spot.visitTime?.toISOString()} → ${new Date(t.newVisitTime).toISOString()}`);
        await tx.spot.update({ where: { id: t.spotId }, data: { visitTime: new Date(t.newVisitTime) } });
      }

      console.log("\n=== 日光: 輪王寺の点を正しいOSMの点に ===");
      const rinnoji = await tx.spot.findUniqueOrThrow({ where: { id: RINNOJI_SPOT_ID } });
      console.log(`直前: lat=${rinnoji.lat} lng=${rinnoji.lng} (OSM node13720153425, historic=memorial=碑)`);
      await tx.spot.update({ where: { id: RINNOJI_SPOT_ID }, data: { lat: 36.7547249, lng: 139.600759 } });
      console.log("直後: lat=36.7547249 lng=139.600759 (OSM way699236460, place_of_worship)");

      console.log("\n=== 日光: 輪王寺→東照宮のtransitLeg(walk/5 → walk/8)と東照宮の時刻 ===");
      const toshoguLeg = await tx.spotTransitLeg.findFirstOrThrow({ where: { spotId: TOSHOGU_SPOT_ID, orderNo: 1 } });
      console.log(`直前: mode=${toshoguLeg.transitMode} durationMin=${toshoguLeg.transitDurationMin}`);
      await tx.spotTransitLeg.update({ where: { id: toshoguLeg.id }, data: { transitDurationMin: 8 } });
      const toshogu = await tx.spot.findUniqueOrThrow({ where: { id: TOSHOGU_SPOT_ID } });
      console.log(`東照宮: visit ${toshogu.visitTime?.toISOString()} → ${new Date(Date.UTC(1970, 0, 1, 11, 33)).toISOString()}, stay ${toshogu.stayDurationMin} → 72`);
      await tx.spot.update({
        where: { id: TOSHOGU_SPOT_ID },
        data: { visitTime: new Date(Date.UTC(1970, 0, 1, 11, 33)), stayDurationMin: 72 },
      });

      if (!commit) {
        console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
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

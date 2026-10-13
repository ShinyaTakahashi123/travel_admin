/**
 * 承認待ちしおりの見直し・酒蔵めぐり#30(4f3c12bd、会津若松・鶴ヶ城と末廣酒造、福島)。
 * スポットの直しはすべてIDで指定する(企画運営 2026-10-13の指示)。
 *
 * 既存4か所(七日町通り60分・飯盛山60分・鶴ヶ城90分・末廣酒造90分、09:00開始)は
 * 4か所以上を満たすが15:00終了。各滞在は時間埋めというより内容相応(城下町の
 * 散策・城の見学・酒蔵の見学+喫茶)と判断し、滞在はほぼ維持しつつ本数を増やして
 * 16:30まで延ばす。
 *
 * 飯盛山のメモに、亡くなり方(自ら命を絶った/自刃)・人数(19人)・年齢(数え16・17歳)
 * の記述があった。#490(会津若松、企画運営・法務)で「飯盛山は亡くなり方・人数・
 * 年齢を書かない形」とされた決まりと同じ場所の同じ出来事のため、同様に削除する。
 *
 * 新スポット「御薬園」(台帳に既存。鶴ヶ城公式サイトtsurugajo.com/oyakuen/で
 * 由来・庭園の歴史・薬草の数・国の名勝指定を確認)と「鶴ヶ城周辺（昼食）」を追加。
 * 末廣酒造の結びの文の案内口調も直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "4f3c12bd-9cc2-49ed-a631-9866b62a55c2";
const DAY_ID = "ed016ccb-452c-4450-9546-b6fca618cdb9";
const NANOKAMACHI_SPOT_ID = "e265a906-e999-44b5-aeb2-c4d16a321339";
const IIMORIYAMA_SPOT_ID = "d28ac6a2-7939-4698-986c-32ffe9f7e159";
const TSURUGAJO_SPOT_ID = "b8080e0c-e864-4fd7-b987-23991ac43c58";
const SUEHIRO_SPOT_ID = "d0f0f53d-cbb2-4fd4-893d-6da3e13c59f4";
const OYAKUEN_PLACE_ID = "50acc5f5-0e7a-48f2-a53f-56d9b5f02135";

const NEW_DESCRIPTION =
  "レトロな七日町通り、白虎隊ゆかりの飯盛山、会津藩の居城・鶴ヶ城、大名庭園の御薬園から、嘉永3年(1850)創業の末廣酒造嘉永蔵まで、まちなか周遊バスと徒歩でめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめましょう。";

const IIMORIYAMA_MEMO =
  "戊辰戦争のさなか、慶応4年(1868)、戸ノ口原の戦いで敗れた白虎隊士中二番隊の少年たちが、この地で亡くなりました。ただ一人助かった飯沼貞吉が後年残した手記によれば、若松城下の様子を見たのち、城へ戻るか敵陣に斬り込むかで激しい議論を交わした末のことだったとされています。長く語られてきた「城が落ちたと見誤った」という説明については、近年の研究で、見誤ったのではないとする見方も示されています。境内には、国の重要文化財に指定されている栄螺堂(さざえ堂)もあります。今も慰霊が続く場所ですので、静かに、敬意をもってお参りください。";

const LUNCH_MEMO = "鶴ヶ城の城下には、食事ができるお店が集まっています。ここで昼食をとりましょう。";

const OYAKUEN_MEMO =
  "室町時代、会津の守護職だった葦名盛久が、霊泉のわく土地に別荘を建てたのが始まりと伝わります。江戸時代には会津松平藩の藩祖・保科正之が大名庭園として整備し、二代藩主・正経が薬草園を設けました。元禄9年(1696)には、小堀遠州の流れをくむ庭師・目黒浄定の手で、中央の心字池と東山の借景を生かした今の庭園が造られました。約400種の薬草・薬木も植えられており、庭園は国の名勝に指定されています。";

const SUEHIRO_CLOSING_OLD = "今日一日の締めくくりに、そのまま七日町駅やまちなか周遊バスで会津若松駅へ戻りましょう。";
const SUEHIRO_CLOSING_NEW = "七日町駅やまちなか周遊バスで会津若松駅へ戻りましょう。";

async function main() {
  const nanokamachi = await prisma.spot.findUnique({ where: { id: NANOKAMACHI_SPOT_ID } });
  const iimoriyama = await prisma.spot.findUnique({ where: { id: IIMORIYAMA_SPOT_ID } });
  const tsurugajo = await prisma.spot.findUnique({ where: { id: TSURUGAJO_SPOT_ID } });
  const suehiro = await prisma.spot.findUnique({ where: { id: SUEHIRO_SPOT_ID } });
  const oyakuenPlace = await prisma.placeMaster.findUnique({ where: { id: OYAKUEN_PLACE_ID } });
  if (!nanokamachi || !iimoriyama?.memo || !tsurugajo || !suehiro?.memo || !oyakuenPlace) throw new Error("想定と違います");

  const newIimoriyamaMemo = IIMORIYAMA_MEMO;
  if (iimoriyama.memo === newIimoriyamaMemo) throw new Error("飯盛山のメモが想定外に一致");
  const newSuehiroMemo = suehiro.memo.replace(SUEHIRO_CLOSING_OLD, SUEHIRO_CLOSING_NEW);
  if (newSuehiroMemo === suehiro.memo) throw new Error("末廣酒造の置換対象が見つかりません");

  const dup = await prisma.placeMaster.findFirst({ where: { name: "鶴ヶ城周辺" } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 鶴ヶ城周辺");

  console.log("[確認OK] 説明文を直す(御薬園を追加、お金の話・「ください」は元々なし)");
  console.log("[確認OK] 飯盛山のメモから亡くなり方・人数・年齢の記述を削除(#490と同じ決まり)");
  console.log("[確認OK] 鶴ヶ城周辺（昼食）・御薬園(台帳の既存データを再利用)を追加して16:30まで延ばす");
  console.log("[確認OK] 末廣酒造の結びの文を直す");
  console.log("新飯盛山メモ:", newIimoriyamaMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: IIMORIYAMA_SPOT_ID }, data: { memo: newIimoriyamaMemo } });

  const tsurugajoLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: TSURUGAJO_SPOT_ID } });
  const suehiroLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: SUEHIRO_SPOT_ID } });
  if (!tsurugajoLeg || !suehiroLeg) throw new Error("移動データが見つかりません");

  // 末廣酒造をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: SUEHIRO_SPOT_ID }, data: { orderNo: 93 } });

  // 鶴ヶ城周辺（昼食）: orderNo4、鶴ヶ城(11:40+90=13:10)から10分で13:20着、50分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "鶴ヶ城周辺", address: "福島県会津若松市追手町", lat: Number(tsurugajo.lat), lng: Number(tsurugajo.lng),
      prefectureAreaId: oyakuenPlace.prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 4, name: "鶴ヶ城周辺（昼食）",
      address: "福島県会津若松市追手町", lat: Number(tsurugajo.lat), lng: Number(tsurugajo.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 20)), memo: LUNCH_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 10 } });

  // 御薬園: orderNo5、昼食(13:20+50=14:10)からバス15分で14:25着、50分滞在(台帳の既存データを再利用)
  const oyakuenSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: OYAKUEN_PLACE_ID, orderNo: 5, name: "御薬園",
      address: oyakuenPlace.address, lat: Number(oyakuenPlace.lat), lng: Number(oyakuenPlace.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 25)), memo: OYAKUEN_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: oyakuenSpot.id, orderNo: 1, transitMode: "bus", transitDurationMin: 15 } });
  if (oyakuenPlace.photoUrl) {
    await prisma.photo.create({
      data: {
        spotId: oyakuenSpot.id, url: oyakuenPlace.photoUrl, caption: "御薬園",
        sourceUrl: oyakuenPlace.photoSourceUrl, author: oyakuenPlace.photoAuthor,
        license: oyakuenPlace.photoLicense, licenseUrl: oyakuenPlace.photoLicenseUrl,
      },
    });
  }

  // 末廣酒造 嘉永蔵: orderNo6、御薬園(14:25+50=15:15)からバス20分で15:35着、55分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: SUEHIRO_SPOT_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 35)), stayDurationMin: 55, memo: newSuehiroMemo },
  });
  await prisma.spotTransitLeg.update({ where: { id: suehiroLeg.id }, data: { transitMode: "bus", transitDurationMin: 20 } });

  console.log("  COMMITTED: 酒蔵めぐり#30 会津若松(09:00〜16:30)");
}
main().finally(() => prisma.$disconnect());

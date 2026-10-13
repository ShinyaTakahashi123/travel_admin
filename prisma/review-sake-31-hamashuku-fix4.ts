/**
 * #31の直し続き(自己点検)。fix3実行時、浜庄津町浜金屋町の町並みが前回already
 * orderNo5に入っていたのを見落とし、祐徳稲荷神社の作成がorderNo衝突(P2002)で
 * 失敗した。浜金屋町はorderNo5のまま活かし、祐徳稲荷神社をorderNo6、HAMA BARを
 * orderNo7に組み直す(7か所構成に)。浜金屋町の滞在は70→35分に短縮(祐徳稲荷神社が
 * 新たに加わり時間の余裕がなくなったため)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "d91dfab4-7d06-4e8a-a675-9d09e6ccfbf5";
const HAMAKANAYA_SPOT_ID = "763397e8-936b-4a90-bee6-008d8dd9e68a";
const HAMABAR_SPOT_ID = "27786a13-7105-4742-824c-9e56052415c2";

const YUTOKU_MEMO =
  "貞享4年(1687)、肥前鹿島藩主・鍋島直朝の夫人、花山院萬子媛が、朝廷の勅願所だった稲荷大神の分霊を迎えて創建したと伝わります。御本殿・御神楽殿・楼門などは漆塗りで極彩色に飾られた華やかな造りで、「鎮西日光」とも呼ばれています。日本三大稲荷の一つとされ、商売繁盛や交通安全を願う参拝者が絶えません。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const hamakanaya = await prisma.spot.findUnique({ where: { id: HAMAKANAYA_SPOT_ID }, include: { transitLegs: true } });
  const hamabar = await prisma.spot.findUnique({ where: { id: HAMABAR_SPOT_ID }, include: { transitLegs: true } });
  const yutokuPlace = await prisma.placeMaster.findFirst({ where: { name: "祐徳稲荷神社" } });
  if (!hamakanaya || hamakanaya.orderNo !== 5 || !hamabar || hamabar.orderNo !== 94 || !yutokuPlace) {
    throw new Error("想定と違います(前回の中断状態と一致しません)");
  }
  const hamakanayaLeg = hamakanaya.transitLegs[0];
  const hamabarLeg = hamabar.transitLegs[0];
  if (!hamakanayaLeg || !hamabarLeg) throw new Error("移動データが見つかりません");

  const dupYutoku = await prisma.spot.findFirst({ where: { dayId: DAY_ID, name: "祐徳稲荷神社" } });
  if (dupYutoku) throw new Error("祐徳稲荷神社のスポットが既に存在します(想定外)");

  console.log("[確認OK] 浜庄津町浜金屋町の町並みを70分→35分に短縮");
  console.log("[確認OK] 祐徳稲荷神社をorderNo6として追加");
  console.log("[確認OK] HAMA BARをorderNo7に移動");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // 浜庄津町浜金屋町の町並み: orderNo5(変更なし)、肥前屋(12:59+55=13:54)から5分で13:59着、35分滞在
  await prisma.spot.update({
    where: { id: HAMAKANAYA_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 59)), stayDurationMin: 35 },
  });

  // 祐徳稲荷神社: orderNo6、浜金屋町(13:59+35=14:34)からバス25分で14:59着、50分滞在(台帳の既存データを再利用)
  const yutokuSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: yutokuPlace.id, orderNo: 6, name: "祐徳稲荷神社",
      address: yutokuPlace.address, lat: Number(yutokuPlace.lat), lng: Number(yutokuPlace.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 59)), memo: YUTOKU_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: yutokuSpot.id, orderNo: 1, transitMode: "bus", transitDurationMin: 25 } });
  if (yutokuPlace.photoUrl) {
    await prisma.photo.create({
      data: {
        spotId: yutokuSpot.id, url: yutokuPlace.photoUrl, caption: "祐徳稲荷神社",
        sourceUrl: yutokuPlace.photoSourceUrl, author: yutokuPlace.photoAuthor,
        license: yutokuPlace.photoLicense, licenseUrl: yutokuPlace.photoLicenseUrl,
      },
    });
  }

  // HAMA BAR(肥前浜駅): orderNo7、祐徳稲荷神社(14:59+50=15:49)からバス25分で16:14着、40分滞在(16:54終了)
  await prisma.spot.update({
    where: { id: HAMABAR_SPOT_ID },
    data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 16, 14)) },
  });
  await prisma.spotTransitLeg.update({ where: { id: hamabarLeg.id }, data: { transitMode: "bus", transitDurationMin: 25 } });

  console.log("  COMMITTED: 酒蔵めぐり#31 7か所に組み直し完了(09:30〜16:54)");
}
main().finally(() => prisma.$disconnect());

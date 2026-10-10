/**
 * #329の続き。企画運営2026-10-01 03:38の3点。
 * 1) 乗り物(決まり8): 1か所目が「水戸駅からバスで」なのに、常磐神社→
 *    水戸東照宮と水戸市立博物館→笠原水道がcar(車)になっていた。
 *    実在のバス路線(関東鉄道・茨城交通)に直した。
 *    - 常磐神社(常磐神社入口)⇔水戸駅: 関東鉄道バス「大工町・常磐神社
 *      入口・みと好文テラス」経由、または茨城交通「水戸駅〜弘道館・
 *      偕楽園〜水戸駅」系統(いずれも公式で確認)
 *    - 笠原水道(メディカルセンター)⇔水戸駅: 茨城交通「千波循環(本郷
 *      まわり/払沢まわり)」、水戸駅北口8番のりば(公式で確認)
 * 2) 弘道館100分は、昼食を含んでおらず(昼食は水戸東照宮11:50到着の
 *    枠に既にある)、単純な見学としては長すぎたため80分に短縮。
 * 3) 帰りの一言: 笠原水道の結びに、千波循環バスで水戸駅へ戻る旨を
 *    具体的に追加。
 *
 * 企画運営2026-10-01 03:40の追加指摘:
 * 4) 座標: 既存3スポット(徳川ミュージアム・常磐神社・水戸市立博物館)の
 *    座標がWikipediaの度分秒をそのまま変換したような丸い値だった。
 *    Nominatim名称一致の建物・境内の点に修正。水戸市立博物館は
 *    36.36583,140.47125→36.380169,140.46846で、実際の場所から
 *    およそ1.6km離れた誤った座標だったと判明(GSI住所検索「茨城県
 *    水戸市大町3-3-20」でも同じ点を確認)。
 * 5) 徳川ミュージアムの「山あいに立つ」は、見川の市街地(偕楽園の西)
 *    のため不正確。「偕楽園の西に立つ」に修正。
 *
 * 法務2026-10-01 03:39の指摘:
 * 6) 水戸市立博物館の写真(Kairaku-en,_Ibaraki_24.jpg)は偕楽園の梅林の
 *    写真で、博物館とは無関係だったため削除(Blobストレージ自体は
 *    消さず、Photoレコードのみ削除)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-329b-8d37aea5.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8d37aea5-fb1e-4b26-b2e7-0be27d21cd0f";

async function main() {
  const tokugawa = await prisma.spot.findFirstOrThrow({ where: { name: "徳川ミュージアム", day: { itineraryId: ITIN_ID } } });
  {
    const old = "水戸駅からバスで15分ほどの山あいに立つ徳川ミュージアムは、";
    const next = "水戸駅からバスで15分ほど、偕楽園の西に立つ徳川ミュージアムは、";
    const memo = tokugawa.memo?.includes(old) ? tokugawa.memo.replace(old, next) : tokugawa.memo;
    await updateSpotInItinerary(ITIN_ID, { spotId: tokugawa.id }, { memo, lat: 36.3716845, lng: 140.4458766 });
    console.log("tokugawa updated");
  }

  const tokiwa = await prisma.spot.findFirstOrThrow({ where: { name: "常磐神社", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: tokiwa.id }, { lat: 36.3750011, lng: 140.4559263 });
  {
    const old = "続いては、車でおよそ15分の水戸東照宮へ向かいましょう。";
    const next = "続いては、バスでおよそ20分の水戸東照宮へ向かいましょう。";
    if (tokiwa.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: tokiwa.id }, { memo: tokiwa.memo.replace(old, next) });
      console.log("tokiwa updated");
    }
  }

  const toshogu = await prisma.spot.findFirstOrThrow({ where: { name: "水戸東照宮", day: { itineraryId: ITIN_ID } } });
  {
    const old = "常磐神社からは車でおよそ15分です。";
    const next = "常磐神社からは、関東鉄道か茨城交通のバスでおよそ20分です。";
    const memo = toshogu.memo?.includes(old) ? toshogu.memo.replace(old, next) : toshogu.memo;
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: toshogu.id },
      { memo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)), transitMode: "bus", transitDurationMin: 20 }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: toshogu.id } });
    await prisma.spotTransitLeg.create({ data: { spotId: toshogu.id, orderNo: 1, transitMode: "bus", transitDurationMin: 20 } });
    console.log("toshogu updated");
  }

  const koudoukan = await prisma.spot.findFirstOrThrow({ where: { name: "弘道館", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: koudoukan.id },
    { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 48)), stayDurationMin: 80 }
  );
  console.log("koudoukan updated");

  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "水戸市立博物館", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: museum.id },
    { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 26)), lat: 36.380169, lng: 140.46846 }
  );
  await prisma.photo.deleteMany({ where: { spotId: museum.id } });
  console.log("museum updated");

  const kasahara = await prisma.spot.findFirstOrThrow({ where: { name: "笠原水道", day: { itineraryId: ITIN_ID } } });
  {
    const old = "水戸市立博物館からは車でおよそ18分です。";
    const next = "水戸市立博物館からは、水戸駅方面へ戻って千波循環バスに乗り継ぎ、あわせておよそ30分です。";
    let memo = kasahara.memo?.includes(old) ? kasahara.memo.replace(old, next) : kasahara.memo;
    const oldEnd = "見学を終えたら、水戸駅まで車で戻りましょう。";
    const newEnd = "見学を終えたら、千波循環バスで水戸駅までおよそ20分です。";
    if (memo?.includes(oldEnd)) {
      memo = memo.replace(oldEnd, newEnd);
    }
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kasahara.id },
      { memo, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 36)), transitMode: "bus", transitDurationMin: 30 }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: kasahara.id } });
    await prisma.spotTransitLeg.create({ data: { spotId: kasahara.id, orderNo: 1, transitMode: "bus", transitDurationMin: 30 } });
    console.log("kasahara updated");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

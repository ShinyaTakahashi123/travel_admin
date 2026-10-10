/**
 * #316の続き(企画運営7点・法務3点、2026-09-30 20:38〜20:42 JST)。
 * しおり「松島湾遊覧船と福浦橋、島めぐりの絶景クルーズプラン」
 * (73f0b468-46de-471e-9d7c-4e24bf3e1b10)
 *
 * 企画運営の指摘:
 * 1. 観瀾亭→遊覧船→福浦橋を車にしていたが、実際は数百mの徒歩圏内
 *    だった。松島湾遊覧船の座標(38.3556,141.0764)を調べ直したところ、
 *    実際の乗り場から2km近く離れた誤った値と判明。Nominatimで名称一致
 *    した「松島島巡り観光船」の点(38.3701325,141.0655615、観瀾亭から
 *    およそ0.3km)に訂正し、以降の移動をすべて徒歩にした。1か所目の
 *    書き出しはJR松島海岸駅から歩いての所要時間、帰りの一言も松島海岸
 *    駅までの徒歩の値にした。
 * 2. 瑞巌寺120分→60分、円通院90分→45分に短縮。空いた時間には、雄島
 *    (松島の名の由来ともいわれる島、所要時間の目安30分)・天麟院
 *    (伊達政宗の娘・五郎八姫の菩提寺、瑞巌寺の並び)を追加。陽徳院は
 *    観光協会公式サイトで「非公開」と明記されていたため対象外とした。
 *    出典: https://www.matsushima-kanko.com/miru/detail.php?id=145
 *    (天麟院、松島観光協会公式)
 *    出典: https://www.matsushima-kanko.com/miru/detail.php?id=146
 *    (陽徳院、非公開の記載を確認)
 * 3. 昼食を観瀾亭(お茶の場所)から、雄島から観瀾亭へ向かう途中(12:33
 *    〜13:09、決まりの窓内)の海岸通り沿いの案内に移した。
 * 4. 西行戻しの松公園「ご案内するのは」、福浦橋「〜てみてはいかが
 *    でしょうか」を、ふつうの書き方に直した。
 * 5. 「奥州随一の禅寺です」→「〜とされます」、「東北地方に現存する
 *    最古の桃山建築として」→「〜とされ」、「縁結びの神様・弁財天」→
 *    「縁結びの信仰で知られる弁財天」にヘッジ・和らげ(法務の指摘(1)
 *    (2)と同内容)。
 * 6. 西行戻しの松公園を、松島海岸駅から徒歩の所要時間(20分、NAVITIME
 *    の徒歩ルート算出)を踏まえ09:00に変更。
 * 7. descriptionに、足した天麟院・雄島などが入るよう書き直した。
 *
 * 法務の指摘:
 * 3. description「縁結びの橋・福浦橋も渡る」→本文の愛称どおり
 *    「『出会い橋』と呼ばれる福浦橋も渡る」に。
 *
 * 時刻の並び(すべて徒歩): 09:00西行戻し(25)→瑞巌寺(60)→天麟院(32)→
 * 円通院(45)→五大堂(25)→雄島(30)→観瀾亭(45)→松島湾遊覧船(65)→
 * 福浦橋(80)→16:31終了。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-316d-73f0b468.ts
 * (実行済み。天麟院の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "天麟院")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const saigyo = day1.spots.find((s) => s.name === "西行戻しの松公園")!;
  const zuiganji = day1.spots.find((s) => s.name === "瑞巌寺")!;
  const entsuin = day1.spots.find((s) => s.name === "円通院")!;
  const godaido = day1.spots.find((s) => s.name === "五大堂")!;
  const kanrantei = day1.spots.find((s) => s.name === "観瀾亭")!;
  const cruise = day1.spots.find((s) => s.name === "松島湾遊覧船")!;
  const fukuura = day1.spots.find((s) => s.name === "福浦橋")!;

  // 西行戻しの松公園: 書き出し・時刻
  const saigyoMemo = (saigyo.memo ?? "")
    .replace(
      "この旅は、松島の中心部は歩いてめぐり、少し離れた松島湾遊覧船・福浦橋へは車で向かいます。ご案内するのは西行戻しの松公園です。",
      "この旅は、歩いてめぐります。JR松島海岸駅からは、坂を上って徒歩およそ20分です。西行戻しの松公園は、"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: saigyo.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
    stayDurationMin: 25,
    memo: saigyoMemo,
  });

  // 瑞巌寺: 滞在短縮・ヘッジ
  const zuiganjiMemo = (zuiganji.memo ?? "").replace(
    "奥州随一の禅寺です。",
    "奥州随一の禅寺とされます。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: zuiganji.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 9, 35)),
    stayDurationMin: 60,
    memo: zuiganjiMemo,
  });

  // 円通院: 滞在短縮・書き出し(天麟院から)
  const entsuinMemo = (entsuin.memo ?? "").replace(
    "瑞巌寺からは歩いておよそ2分です。",
    "天麟院からは歩いておよそ2分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: entsuin.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 12)),
    stayDurationMin: 45,
    memo: entsuinMemo,
  });

  // 五大堂: 時刻更新
  await updateSpotInItinerary(ITIN_ID, { spotId: godaido.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 2)),
    stayDurationMin: 25,
  });

  // 観瀾亭: 昼食の一言を外し、書き出しを雄島からに、時刻・滞在を更新
  const kanranteiMemo = (kanrantei.memo ?? "")
    .replace("五大堂からは歩いておよそ3分です。", "雄島からは歩いておよそ6分です。")
    .replace(
      "このあたりで、昼食をとりましょう。伊達家の歴史に思いをはせながら、ひと休みしてみましょう。",
      "伊達家の歴史に思いをはせながら、ひと休みしてみましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: kanrantei.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 9)),
    stayDurationMin: 45,
    transitDurationMin: 6,
    memo: kanranteiMemo,
  });

  // 松島湾遊覧船: 座標訂正・徒歩に変更・時刻更新
  const cruiseMemo = (cruise.memo ?? "")
    .replace("観瀾亭からは車でおよそ10分です。", "観瀾亭からは歩いておよそ4分です。")
    .replace("続いては、車でおよそ8分の福浦橋へ向かいましょう。", "続いては、歩いておよそ8分の福浦橋へ向かいましょう。");
  await updateSpotInItinerary(ITIN_ID, { spotId: cruise.id }, {
    lat: 38.3701325,
    lng: 141.0655615,
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 58)),
    stayDurationMin: 65,
    transitMode: "walk",
    transitDurationMin: 4,
    memo: cruiseMemo,
  });

  // 福浦橋: 徒歩に変更・口調・時刻・滞在・帰りの一言
  let fukuuraMemo = (fukuura.memo ?? "").replace(
    "松島湾遊覧船からは車でおよそ8分です。",
    "松島湾遊覧船からは歩いておよそ8分です。"
  );
  fukuuraMemo = fukuuraMemo.replace(
    "縁結びの神様・弁財天を祀る弁天堂があることから、「出会い橋」という愛称で親しまれています。",
    "縁結びの信仰で知られる弁財天を祀る弁天堂があることから、「出会い橋」という愛称で親しまれています。"
  );
  fukuuraMemo = fukuuraMemo.replace(
    "海の上を歩くように橋を渡りながら、松島の旅の締めくくりに、思い思いの願いを込めてみてはいかがでしょうか。 見学を終えたら、車でJR松島海岸駅方面へ戻りましょう。",
    "海の上を歩くように橋を渡りながら、松島の旅を締めくくりましょう。見学を終えたら、JR松島海岸駅までは徒歩およそ14分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: fukuura.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 11)),
    stayDurationMin: 80,
    transitMode: "walk",
    memo: fukuuraMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: saigyo.id, data: {} },
        { id: zuiganji.id, data: {} },
        {
          create: {
            name: "天麟院",
            address: "宮城郡松島町松島字町内152",
            lat: 38.3702611,
            lng: 141.0592709,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 38)),
            stayDurationMin: 32,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "瑞巌寺からは歩いておよそ3分です。天麟院は、伊達政宗の娘・五郎八姫の菩提寺です。五郎八姫は徳川家康の六男・松平忠輝に嫁ぎましたが、忠輝が家康の怒りを買って改易されたことから離縁され、仙台へ戻って仏門に入ったと伝わります。娘の境遇を思いやった政宗が、その信仰生活を支えたといわれています。陽徳院・円通院とあわせて「松島三霊廟」の一つに数えられる、静かな寺院です。静かに、敬意をもってお参りください。",
          },
        },
        { id: entsuin.id, data: {} },
        { id: godaido.id, data: {} },
        {
          create: {
            name: "雄島",
            address: "宮城郡松島町松島字町内",
            lat: 38.3652752,
            lng: 141.062631,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 33)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 6,
            memo:
              "五大堂からは歩いておよそ6分です。雄島は、松島湾に浮かぶ260余りの島々の中でも代表的な島の一つで、松島の名の由来になったともいわれています。かつては僧侶の修行の島として知られ、島内には芭蕉の句碑をはじめ、数多くの石碑や祠が残されています。赤い橋を渡って島に入り、木々に囲まれた静かな散策路を歩いてみましょう。この先の海岸通り沿いには食事処が多いので、このあたりで昼食をとりましょう。",
          },
        },
        { id: kanrantei.id, data: {} },
        { id: cruise.id, data: {} },
        { id: fukuura.id, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "260余りの島々が浮かぶ松島湾を遊覧船で巡り、「出会い橋」と呼ばれる福浦橋も渡る。瑞巌寺や天麟院、雄島など、日本三景の絶景を海と陸から楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

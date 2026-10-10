/**
 * #88 d1e7bf32 企画運営(21:33)の案A採用。西側ループには実在の立ち寄り先が
 * 見当たらず、御鼻部山を30分に戻した結果D1が15:21で終わる問題について、
 * 「発荷峠から秋田側へ下りて大湯環状列石(世界遺産「北海道・北東北の縄文
 * 遺跡群」)へ」との案をいただいた。休屋→御鼻部山→紫明亭→発荷峠→大湯環状
 * 列石の順(北から南へ)に組み直し、行って戻るだけの道を避けた。
 *
 * OSRMの生の値(発荷峠→大湯21.3分)は、これまでの経緯(焼山→美術館の
 * 17分が実際は33分だった)を踏まえ、山道であることを考慮して30分に
 * 修正。VC→御鼻部山(14.9分)も同様に18分に修正。
 *
 * 大湯環状列石・大湯ストーンサークル館の内容は、世界遺産公式サイトを
 * 直接開いて確認(野中堂・万座の2つの環状列石、日時計状組石、出土品の
 * 展示)。見学時間が11月は16:00までとなる年があるため、早めの到着を
 * 促す一言を入れた。座標はOSM(way 245391534)。
 *
 * 開いたURL:
 * - 大湯環状列石(公式・世界遺産): https://jomon-japan.jp/learn/jomon-sites/oyu
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "神秘的な十和田湖に浮かぶ十和田神社や、湖畔のシンボル「乙女の像」をたずね、周遊の遊覧船に乗ったあと、タクシーで御鼻部山・紫明亭・発荷峠の三つの展望台を巡り、世界遺産の大湯環状列石まで足をのばします。2日目は奥入瀬渓流を歩いて焼山へ抜け、十和田市現代美術館まで足をのばす、信仰と絶景と縄文の歴史を楽しむ1泊2日プランです。";

const PLATTO_MEMO_STAY = 55; // 75→55、大湯の見学時間に間に合わせるため短縮

const OHANABE_MEMO =
  "十和田ビジターセンターからタクシーでおよそ18分、七曲りと呼ばれる急な坂道を上って御鼻部山展望台に着きます。標高およそ1,011mと、十和田湖の展望台の中でも高い場所にあり、発荷峠展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。御倉半島と中山半島が紺碧の湖面を抱くように連なる眺めが広がり、天気がよければ遠く岩手山や八幡平の山並みまで見渡せます。この後は、タクシーでおよそ22分、紫明亭展望台へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const SHIMEITEI_MEMO =
  "御鼻部山展望台からタクシーでおよそ22分、紫明亭展望台に着きます。ここから眺める十和田湖はハートの形に見えるといわれています。春の新緑、秋の紅葉と、季節ごとに色を変える湖を楽しめます。この後は、タクシーでおよそ2分、発荷峠展望台へ向かいましょう。";

const HAKKATOGE_MEMO =
  "紫明亭展望台からタクシーでおよそ2分、発荷峠展望台に着きます。ここは十和田湖の南の玄関口にあたる峠で、樹海ラインと国道103号線が交わる場所に立っています。中山半島と御倉半島が重なって湖に横たわる様子や、対岸の御鼻部山、さらに南八甲田の山々まで見渡すことができ、御鼻部山展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。展望台とお手洗いは冬期(11月中旬〜4月下旬ごろ)は閉鎖されるので、訪れる時期に注意しましょう。この後は、タクシーでおよそ30分、秋田県鹿角市の大湯環状列石へ向かいましょう。";

const VC_MEMO_FROM = "この後は、タクシーで発荷峠展望台へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";
const VC_MEMO_TO = "この後は、タクシーでおよそ18分、御鼻部山展望台へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const OYU_MEMO =
  "発荷峠展望台からタクシーでおよそ30分、世界遺産「北海道・北東北の縄文遺跡群」の一つ、大湯環状列石に着きます。野中堂(最大径44m)と万座(最大径52m)、二つの環状列石が向き合うように配置され、それぞれの中心の石と日時計状組石が一直線に並ぶことから、両者は関連づけて造られたと考えられています。隣接する大湯ストーンサークル館では、出土した土器や土偶などを多数展示し、遺跡について詳しく紹介しています。見学できる時間は季節によって変わり、11月は16時までとなる年もあるので、訪れる時期によっては早めの到着を心がけましょう。帰りもタクシーで、宿のある十和田湖畔まで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const jinja = await findSpotInItinerary(itinId, { spotName: "十和田神社" });
  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });
  const platto = await findSpotInItinerary(itinId, { spotName: "十和田湖観光交流センター「ぷらっと」" });
  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  if (!vc.memo!.includes(VC_MEMO_FROM)) throw new Error("一致しません(VC)");
  const vcNewMemo = vc.memo!.replace(VC_MEMO_FROM, VC_MEMO_TO);
  const hakkatoge = await findSpotInItinerary(itinId, { spotName: "発荷峠展望台" });
  const shimeitei = await findSpotInItinerary(itinId, { spotName: "紫明亭展望台" });
  const ohanabe = await findSpotInItinerary(itinId, { spotName: "御鼻部山展望台" });

  const day1Spots: SpotOrderItem[] = [
    { id: jinja.id, data: {} },
    { id: otome.id, data: {} },
    { id: cruise.id, data: {} },
    { id: platto.id, data: { stayDurationMin: PLATTO_MEMO_STAY } },
    { id: vc.id, data: { memo: vcNewMemo, visitTime: t(12, 24) } },
    {
      id: ohanabe.id,
      data: {
        memo: OHANABE_MEMO,
        visitTime: t(13, 27),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
    {
      id: shimeitei.id,
      data: { memo: SHIMEITEI_MEMO, visitTime: t(14, 19), transitMode: "car", transitDurationMin: 22, transitLine: null },
    },
    {
      id: hakkatoge.id,
      data: { memo: HAKKATOGE_MEMO, visitTime: t(14, 41), transitMode: "car", transitDurationMin: 2, transitLine: null },
    },
    {
      create: {
        name: "大湯環状列石",
        address: "秋田県鹿角市十和田大湯字万座45",
        lat: 40.2740079,
        lng: 140.8065571,
        memo: OYU_MEMO,
        visitTime: t(15, 41),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 30,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = { [jinja.id]: 40, [otome.id]: 20, [cruise.id]: 50, [platto.id]: PLATTO_MEMO_STAY, [vc.id]: 45 };
    for (const x of day1Spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

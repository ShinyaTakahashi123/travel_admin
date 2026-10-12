/**
 * #90 de041462（鳴門の渦潮、大迫力のうず潮を観潮船で楽しむ定番日帰りプラン）
 * 通常の見直し。既存は観潮船1か所(09:30〜10:50)のみで、4か所未満・終了とも
 * 規定外。文体はツアーガイド口調("皆様、本日ご案内するのは"等)を避けた
 * (#87の見直しで確認した基準に沿う)。
 *
 * 【座標の誤りを発見・修正】既存の観潮船乗り場(34.238333,134.651389)は、
 * うずしお汽船の公式住所(鳴門市鳴門町土佐泊浦字大毛264-1)をGSIで確かめた
 * 実際の位置(34.23045,134.623901)から約2.6kmずれていた。
 * 開いたURL: https://www.uzusio.com/access/ (住所)、GSIアドレス検索
 *
 * 追加した実在スポット:
 * - 渦の道(大鳴門橋遊歩道、新規、OSM座標): 海上45mのガラス床から渦潮を
 *   のぞける観潮施設。公式サイトで内容・営業時間を確認。
 *   開いたURL: https://www.uzunomichi.jp/usage-guide-uzu-no-michi/facility/
 * - 大塚国際美術館(新規、OSM座標): 世界26か国の西洋名画1000余点を陶板で
 *   原寸大に再現した美術館。システィーナ・ホールの環境展示、モネの
 *   「大睡蓮」の屋外展示などが見どころ。初訪問では3〜5時間ほどかかるとの
 *   案内が複数あり、館内にレストラン・カフェもあるため、滞在時間に昼食を
 *   含めた。公式サイトで開館時間・館内施設を確認。
 *   開いたURL: https://o-museum.or.jp/pages/824/
 * - 鳴門市ドイツ館(新規、GSI住所点): 第一次世界大戦中の板東俘虜収容所で、
 *   ドイツ兵捕虜と地元の人々との文化交流(製菓・西洋野菜栽培・建築・音楽・
 *   スポーツ)を伝える資料館。ベートーヴェン「第九」のアジア初演の地としても
 *   知られる。公式サイトで内容・開館時間を確認。
 *   開いたURL: https://www.awanavi.jp/archives/spot/2889
 *
 * 【バスの実在確認】観潮船乗り場(鳴門観光港)→渦の道(鳴門公園)は、徳島バスの
 * 公式時刻表(PDF)を直接開いて確認したところ、日中30〜55分間隔で実際に
 * 運行しており(例: 10:55発→11:01着鳴門公園、6分)、決まり8により路線バスを
 * 優先してこの区間はバスにした。大塚国際美術館→ドイツ館は、公式の路線バスの
 * 乗り継ぎが確認できなかったため、タクシーを利用する。
 * 開いたURL: https://www.uzusio.com/access/pdf/bus_weekday.pdf
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界最大級ともいわれる鳴門の渦潮。観潮船やガラス床の「渦の道」から間近に眺め、陶板名画で知られる大塚国際美術館、ドイツ兵捕虜との交流を伝える鳴門市ドイツ館もたずねる、鳴門観光の日帰りプランです。";

const UZUSHIO_MEMO =
  "鳴門観光港から、うずしお観光船に乗り込みます。瀬戸内海と紀伊水道という、潮の満ち引きのタイミングが異なる2つの海域が、幅およそ1.3kmの鳴門海峡でぶつかり合うことで、1日に4回、最大で1〜1.5mもの水位差が生じ、激しい潮流と渦潮が生まれます。潮の流れは時速13〜15km、大潮の際には時速20kmに達することもあり、渦の直径は最大でおよそ30mにもおよぶ、世界最大級ともいわれる規模です。観潮船に乗れば、うねりながら巻き上がる渦潮を間近に眺めることができます。渦の大きさは大潮・小潮など潮回りによって変わるため、出発前に運航状況を確かめておきましょう。この後は、鳴門公園行きのバスでおよそ6分、渦の道へ向かいましょう。";

const UZUNOMICHI_MEMO =
  "鳴門観光港からバスでおよそ6分、鳴門公園に着き、大鳴門橋遊歩道「渦の道」に入ります。大鳴門橋の橋げたの中に設けられた450メートルの遊歩道で、先にある展望室からは、海上45メートルのガラス床越しに、渦潮を真下からのぞき込むことができます。海からとはまた違う角度で、渦の巻き方や潮の色の変化を観察できます。営業時間は季節によって変わるので、公式サイトで確かめてから訪れましょう。この後は、歩いておよそ7分、大塚国際美術館へ向かいましょう。";

const OTSUKA_MEMO =
  "渦の道から歩いておよそ7分、大塚国際美術館に着きます。世界26か国、1000点余りの西洋名画を、陶板に原寸大で再現した美術館です。最初の展示室「システィーナ・ホール」では、システィーナ礼拝堂の天井画と壁画を、壁や天井ごと環境展示として再現しており、実際にその場に居合わせたかのような臨場感を味わえます。屋外には、モネが自然光のもとで見てほしいと望んだという「大睡蓮」が、池を囲むように配置されています。モナ・リザやひまわり、ゲルニカなど、教科書でおなじみの名画も数多く並び、鑑賞ルートはおよそ4キロメートルにおよびます。館内にはレストランやカフェもあるので、ここで昼食にするとよいでしょう。じっくり見て回ると3時間以上かかることも多いので、時間に余裕を持って訪れましょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ25分、鳴門市ドイツ館へ向かいましょう。この先は乗り継ぎの良い路線バスがないため、タクシーを利用します。";

const DOITSUKAN_MEMO =
  "大塚国際美術館からタクシーでおよそ25分、鳴門市ドイツ館に着きます。第一次世界大戦中、この地には「板東俘虜収容所」があり、日本軍の捕虜となったドイツ兵が収容されていました。収容所では、製菓や西洋野菜の栽培、建築、音楽、スポーツなどを通して、ドイツ兵と地元の人々の間で文化交流が行われ、ベートーヴェンの交響曲第九番がアジアで初めて演奏された地としても知られています。館内では、当時の暮らしをミニチュア模型でたどることができ、第九が響いた様子を実物大の人形で再現した展示もあります。休館日は公式サイトで確かめてから訪れましょう。鳴門駅・徳島駅へは、タクシーやバスで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'de041462%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const uzushio = await findSpotInItinerary(itinId, { spotName: "鳴門の渦潮（亀浦観潮船乗り場）" });

  const day1Spots: SpotOrderItem[] = [
    {
      id: uzushio.id,
      data: {
        lat: 34.23045,
        lng: 134.623901,
        address: "徳島県鳴門市鳴門町土佐泊浦字大毛264-1",
        memo: UZUSHIO_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 80,
      },
    },
    {
      create: {
        name: "渦の道",
        address: "徳島県鳴門市鳴門町鳴門公園門崎",
        lat: 34.2361791,
        lng: 134.6421065,
        memo: UZUNOMICHI_MEMO,
        visitTime: t(11, 1),
        stayDurationMin: 40,
        transitMode: "bus",
        transitDurationMin: 11,
        transitLine: "徳島バス 鳴門公園行き",
      },
    },
    {
      create: {
        name: "大塚国際美術館",
        address: "徳島県鳴門市鳴門町鳴門公園内",
        lat: 34.2325795,
        lng: 134.6375369,
        memo: OTSUKA_MEMO,
        visitTime: t(11, 48),
        stayDurationMin: 180,
        transitMode: "walk",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      create: {
        name: "鳴門市ドイツ館",
        address: "徳島県鳴門市大麻町桧字東山田55-2",
        lat: 34.164265,
        lng: 134.498856,
        memo: DOITSUKAN_MEMO,
        visitTime: t(15, 13),
        stayDurationMin: 90,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    for (const x of day1Spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = d.stayDurationMin as number;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
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

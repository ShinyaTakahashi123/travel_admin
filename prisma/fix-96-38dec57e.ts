/**
 * #96 38dec57e（神戸ルミナリエと冬の夜景、光あふれる神戸を楽しむプラン）
 * 通常の見直し。既存はD1に六甲山・神戸ルミナリエの2か所のみ(15:00〜19:00)
 * で、4か所未満・開始・終了とも規定外。ツアーガイド口調だったため書き直す。
 *
 * ルミナリエは薄暮からの点灯(例年1月下旬〜2月上旬)が前提のため、日中は
 * 神戸市街の観光にあて、夕方に六甲山で日没から夜景への移り変わりを
 * ゆっくり眺め、夜にルミナリエという1日の流れにした(決まりの8:30〜9:30
 * 開始は守りつつ、終了は点灯時間にあわせて夜になる)。北野異人館街・
 * 南京町・メリケンパークを新規に追加。いずれも阪神・淡路大震災からの
 * 復興というテーマでもつながる(北野は震災で被災後に修復、BE KOBEは
 * 震災20年を機に生まれた言葉)。
 *
 * 開いたURL:
 * - 北野異人館街(歴史・指定・震災復興): 神戸北野異人館街公式
 *   https://www.kobeijinkan.com/history
 * - 南京町(由来・開港年・三大中華街・広さ): 南京町公式
 *   https://www.nankinmachi.or.jp/about
 * - BE KOBEモニュメント(設置年・由来): 公式神戸観光サイト feel KOBE
 *   https://www.feel-kobe.jp/facilities/0000000822/
 * - 六甲山へのアクセス(阪急六甲駅・バス・ケーブル): WebSearch集約
 *   (六甲ケーブル公式等)、阪急三宮-六甲間4分は駅探で確認
 * - 神戸ルミナリエ(開催期間・点灯時間・由来): 神戸市公式note
 *   https://kobe-note.jp/n/nf7d09546ecd9
 * - 座標: Nominatim(OSM)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KITANO_MEMO =
  "旅の始まりは北野異人館街です。明治の神戸港開港にともない、山手の高台に外国人向けの住宅が集まったのが始まりで、明治から昭和初期にかけて200棟あまりが建てられました。昭和55年(1980)には、国の伝統的建造物群保存地区に指定されています。北野のシンボルとして知られる「風見鶏の館」(国指定重要文化財)をはじめ、公開されている洋館だけでも15館近くあり、異国情緒あふれる町並みを歩いて楽しめます。平成7年(1995)の阪神・淡路大震災では大きな被害を受けましたが、全国からの支援で修復が進められ、今の姿を取り戻しました。この後は、歩いておよそ20分、南京町へ向かいましょう。";

const NANKIN_MEMO =
  "北野異人館街から歩いておよそ20分、南京町に着きます。明治元年(1867)の神戸港開港とともに中国の人々が住み始めたことから生まれた町で、横浜中華街・長崎新地中華街とあわせて日本三大中華街のひとつに数えられています。東西およそ270メートル、南北およそ110メートルの範囲に、中華料理店や雑貨店がひしめき合っています。食べ歩きをしながら、賑やかな町の雰囲気を楽しめます。ここで昼食にしましょう。この後は、歩いておよそ8分、メリケンパークへ向かいましょう。";

const MERIKEN_MEMO =
  "南京町から歩いておよそ8分、メリケンパークに着きます。「メリケン」はアメリカのことで、外国人居留地の西端にアメリカ領事館があったことが名の由来です。神戸のシンボル、神戸ポートタワーがそびえ立ち、最上階の展望室からは神戸港や市街地、六甲山系の眺めを楽しめます。平成29年(2017)、神戸開港150年を記念して設置された「BE KOBE」モニュメントもあり、阪神・淡路大震災から20年を機に生まれた「神戸の魅力は人である」という思いが込められています。この後は、三宮駅・六甲駅を経由して六甲山上へ向かいます。徒歩・電車・バス・ケーブルカーを乗り継いで、合計およそ1時間の道のりです。";

const ROKKO_MEMO =
  "メリケンパークから、三宮駅まで歩き、阪急神戸線で六甲駅へ、神戸市バスで六甲ケーブル下へ、六甲ケーブルで六甲山上へと乗り継ぎ、六甲山に着きます。標高931mの山上に広がる展望スポットで、大阪から神戸にかけての市街地や大阪湾を一望する眺めが魅力です。昭和28年(1953)、関西電力の副社長がコラムの中で、この一帯の1か月分の電気代をドルに換算すると100万ドルになると紹介したのがきっかけとなり、当初は「100万ドルの夜景」と呼ばれるようになりました。その後、物価の変動などを経て、今では「1000万ドルの夜景」とも呼ばれています。戦後の復興とともに六甲山上バスや六甲ケーブルの整備が進み、手軽に登れる夜景の名所として親しまれるようになりました。午後の澄んだ空気の中、日没に向けて少しずつ表情を変えていく街並みを、時間をかけて眺めてみてください。この後は、来た道を戻り、神戸ルミナリエが開かれる旧居留地・メリケンパーク周辺へ向かいます。";

const LUMINARIE_MEMO =
  "六甲山から六甲ケーブル・神戸市バス・阪急神戸線を乗り継いで戻り、旧居留地・メリケンパーク一帯で開かれる神戸ルミナリエに着きます。平成7年(1995)1月17日に起きた阪神・淡路大震災の犠牲者を悼み、復興への希望を託して、同年12月に初めて開催された光の祭典です。「ルミナリエ」はイタリア語で「電飾」を意味し、震災直後の暗い街に灯った光の作品が、多くの人々に感動と勇気を与えました。例年1月下旬から2月上旬ごろ、日没後から夜にかけて点灯されています。開催時期・点灯時間は、訪れる前に公式サイトで確かめましょう。犠牲になった方々への鎮魂の思いが込められた行事であることを心にとめながら、イルミネーションの回廊を歩いてみてください。神戸ルミナリエと冬の夜景をめぐる旅は、ここで終わりです。お帰りは、三宮駅・元町駅など、最寄り駅から帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '38dec57e%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const rokko = await findSpotInItinerary(itinId, { spotName: "六甲山" });
  const luminarie = await findSpotInItinerary(itinId, { spotName: "神戸ルミナリエ" });

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "北野異人館街",
        address: "兵庫県神戸市中央区北野町三丁目",
        lat: 34.7012602,
        lng: 135.1897321,
        memo: KITANO_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 90,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "南京町",
        address: "兵庫県神戸市中央区栄町通",
        lat: 34.6875828,
        lng: 135.1887765,
        memo: NANKIN_MEMO,
        visitTime: t(11, 20),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "メリケンパーク",
        address: "兵庫県神戸市中央区波止場町",
        lat: 34.6833086,
        lng: 135.1893213,
        memo: MERIKEN_MEMO,
        visitTime: t(12, 23),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      id: rokko.id,
      data: {
        memo: ROKKO_MEMO,
        visitTime: t(14, 33),
        stayDurationMin: 170,
        transitMode: "train",
        transitDurationMin: 60,
        transitLine: "阪急神戸線・六甲ケーブル",
      },
    },
    {
      id: luminarie.id,
      data: {
        memo: LUMINARIE_MEMO,
        visitTime: t(18, 23),
        stayDurationMin: 60,
        transitMode: "train",
        transitDurationMin: 60,
        transitLine: "六甲ケーブル・阪急神戸線",
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) { console.log("(visitTime未変更)"); continue; }
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

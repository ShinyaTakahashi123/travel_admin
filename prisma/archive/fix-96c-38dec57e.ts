/**
 * #96 38dec57e 企画運営(2026-10-01 06:30)の指摘。仕様書の決まり6で、夜景・
 * ライトアップなど16時以降の内容はスポットにせず、最後のメモで案内する
 * ことになっている(fix-96の六甲山14:33〜17:23・ルミナリエ18:23〜19:23は
 * この決まりに反していた)。六甲山・神戸ルミナリエをスポットから外し、
 * 昼の実在の行き先(生田神社・神戸市立博物館を新規追加)で8:30〜9:30開始・
 * 16:30〜17:00終了の日中のプランに組み直す。夜のルミナリエ・六甲山の夜景は
 * 最後のメリケンパークのメモで一言案内する形にした(開催時期・点灯時間は
 * 年により変わるため日付は書かない)。タイトル・説明文も、この形にあわせて
 * 直した。seasonsは、当日の内容(北野・生田神社・南京町・博物館・メリケン
 * パーク)が通年楽しめるため、全季節に戻した(ルミナリエは冬限定の紹介文の
 * 一言にとどめている)。
 *
 * 開いたURL(今回の追加分):
 * - 生田神社(由緒・祭神): 公式 https://ikutajinja.or.jp/introduction
 * - 神戸市立博物館(建物・開館年・収蔵品): 公式
 *   https://www.kobecitymuseum.jp/about/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "北野異人館街と南京町、冬はルミナリエの夜景も楽しむ神戸プラン";
const DESCRIPTION =
  "異国情緒あふれる北野異人館街、日本三大中華街の南京町、港町の風景が広がるメリケンパークなど、神戸の定番スポットを1日で巡ります。冬には、旧居留地やメリケンパーク周辺で開かれる「神戸ルミナリエ」の光の祭典も楽しめます。";

const KITANO_MEMO =
  "旅の始まりは北野異人館街です。明治の神戸港開港にともない、山手の高台に外国人向けの住宅が集まったのが始まりで、明治から昭和初期にかけて200棟あまりが建てられました。昭和55年(1980)には、国の伝統的建造物群保存地区に指定されています。北野のシンボルとして知られる「風見鶏の館」(国指定重要文化財)をはじめ、公開されている洋館だけでも15館近くあり、異国情緒あふれる町並みを歩いて楽しめます。平成7年(1995)の阪神・淡路大震災では大きな被害を受けましたが、全国からの支援で修復が進められ、今の姿を取り戻しました。この後は、歩いておよそ11分、生田神社へ向かいましょう。";

const IKUTA_MEMO =
  "北野異人館街から歩いておよそ11分、生田神社に着きます。神功皇后元年(西暦201年)の創建と伝えられる、およそ1800年の歴史を持つ神社です。三韓外征からの帰途、神戸港で船が進まなくなった神功皇后が神占を行ったところ、稚日女尊(わかひるめのみこと)が現れ、この地に鎮まることを望んだのが始まりと伝わります。稚日女尊は、伊勢神宮にまつられる天照大神の和魂ともいわれ、物を生み育てる神として信仰されています。神戸の中心地・三宮にありながら、緑に囲まれた静かな境内が広がっています。静かに、敬意をもってお参りください。この後は、歩いておよそ12分、南京町へ向かいましょう。";

const NANKIN_MEMO =
  "生田神社から歩いておよそ12分、南京町に着きます。明治元年(1867)の神戸港開港とともに中国の人々が住み始めたことから生まれた町で、横浜中華街・長崎新地中華街とあわせて、日本三大中華街のひとつとされています。東西およそ270メートル、南北およそ110メートルの範囲に、中華料理店や雑貨店がひしめき合っています。食べ歩きをしながら、賑やかな町の雰囲気を楽しめます。ここで昼食にしましょう。この後は、歩いておよそ6分、神戸市立博物館へ向かいましょう。";

const MUSEUM_MEMO =
  "南京町から歩いておよそ6分、神戸市立博物館に着きます。桜井小太郎の設計、昭和10年(1935)竣工の旧横浜正金銀行神戸支店ビルを転用した建物で、新古典様式の円柱が並ぶ昭和初期の名建築として、平成10年(1998)に登録文化財となりました。昭和57年(1982)、市立南蛮美術館と考古館を統合して開館し、国宝「桜ヶ丘銅鐸・銅戈」をはじめとする考古・歴史資料や、南蛮美術のコレクションなど、神戸の歴史と東西交流の歩みを紹介しています。この後は、歩いておよそ8分、メリケンパークへ向かいましょう。";

const MERIKEN_MEMO =
  "神戸市立博物館から歩いておよそ8分、メリケンパークに着きます。「メリケン」はアメリカのことで、外国人居留地の西端にアメリカ領事館があったことが名の由来です。神戸のシンボル、神戸ポートタワーがそびえ立ち、最上階の展望室からは神戸港や市街地、六甲山系の眺めを楽しめます。隣接する神戸海洋博物館では、神戸港の歴史や船にまつわる展示を見学できます。平成29年(2017)、神戸開港150年を記念して設置された「BE KOBE」モニュメントもあり、阪神・淡路大震災から20年を機に生まれた「神戸の魅力は人である」という思いが込められています。港を望むベンチでひと休みしながら、港町・神戸の風景をゆっくり楽しんでください。神戸の旅は、ここでひと区切りです。夜には、旧居留地やメリケンパーク周辺で「神戸ルミナリエ」が開かれることがあります(開催時期・点灯時間は公式サイトで確かめましょう)。六甲山やビーナスブリッジから、神戸の夜景を楽しむのもおすすめです。お帰りは、三宮駅・元町駅など、最寄り駅からご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '38dec57e%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kitano = await findSpotInItinerary(itinId, { spotName: "北野異人館街" });
  const nankin = await findSpotInItinerary(itinId, { spotName: "南京町" });
  const meriken = await findSpotInItinerary(itinId, { spotName: "メリケンパーク" });
  const rokko = await findSpotInItinerary(itinId, { spotName: "六甲山" });
  const luminarie = await findSpotInItinerary(itinId, { spotName: "神戸ルミナリエ" });

  const day1Spots: SpotOrderItem[] = [
    { id: kitano.id, data: { memo: KITANO_MEMO, stayDurationMin: 100 } },
    {
      create: {
        name: "生田神社",
        address: "兵庫県神戸市中央区下山手通一丁目",
        lat: 34.6946102,
        lng: 135.1906166,
        memo: IKUTA_MEMO,
        visitTime: t(11, 21),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    { id: nankin.id, data: { memo: NANKIN_MEMO, visitTime: t(12, 3), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 12, transitLine: null } },
    {
      create: {
        name: "神戸市立博物館",
        address: "兵庫県神戸市中央区京町",
        lat: 34.6873944,
        lng: 135.1929302,
        memo: MUSEUM_MEMO,
        visitTime: t(13, 9),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      id: meriken.id,
      data: { memo: MERIKEN_MEMO, visitTime: t(14, 22), stayDurationMin: 130, transitMode: "walk", transitDurationMin: 8, transitLine: null },
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

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE, description: DESCRIPTION, seasons: ["spring", "summer", "autumn", "winter"] } });
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: [rokko.id, luminarie.id] });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

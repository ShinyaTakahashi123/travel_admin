/**
 * #88 d1e7bf32 の全面組み直し(企画運営の指摘、2026-09-30)。
 * fix-88・88b・88cで組んだ案(D1 09:00〜12:37・D2 09:30〜15:35)が
 * 「行き先が足りない」を理由にした未達として却下された。企画運営の案のうち、
 * D1は「秋田側の発荷峠」、D2は「焼山から十和田市中心部の現代美術館へ」を採用。
 *
 * 【バス時刻表の確認】十和田観光電鉄「十和田市～十和田湖温泉郷～焼山線」の公式
 * 時刻表(令和8年10月1日現在)を直接開いて確認したところ、焼山→十和田市方面行きは
 * 1日4便(6:26・8:55・12:47・18:06 焼山発)のみで、土・日・祝日運休の「土○」印が
 * 4便中3便に付き、毎日運行するのは8:55発の1本だけだった。奥入瀬渓流の散策が
 * 終わる午後の時間帯に使える便がなく、一般向けの通常のしおりとしては使えないと
 * 判断し、バスの利用は見送った。
 * 開いたURL: https://toutetsu.co.jp/jikoku/towada-yakeyama.htm
 *
 * 【タクシーに切り替えた理由】決まり8は「乗り物を変えるならどこで乗るかを書く」
 * であり、#428の直しの記録にあるとおり、使えるバス・JRがあるときはタクシーより
 * そちらを優先する。今回は上記のとおりバスが使えないことを確認したうえで、
 * 十和田湖周辺に実在する貸切観光タクシー(青森タクシーなど、発荷峠・御鼻部山・
 * 石ヶ戸・銚子大滝を回る定額コースが公式にある)を使うことにした。レンタカーの
 * 乗り捨て・駐車の管理という余計な設定を増やさずに済むタクシーを選んだ。
 * 開いたURL: https://hk-grp.or.jp/publics/index/785/detail=1/b_id=7060/r_id=41/
 *
 * 【D1】十和田神社→乙女の像→十和田ビジターセンターは既存のまま(昼食の一言は
 * 11:04終了で11:30より前だったため、ビジターセンターからは外し、あとで
 * 桟橋での昼食に差し替え)。新規に十和田湖観光交流センター「ぷらっと」
 * (OSM node 5604789583、十和田市公式サイトで開館時間・展示内容を確認)を追加。
 * 十和田湖遊覧船は、周遊のBコース(休屋⇔休屋、おぐら・中山半島めぐり、約50分)の
 * 13:15発に乗る形に直し、ぷらっとから乗り場までの徒歩2分に加えて出航までの
 * 待ち時間(昼食にあてる)をtransitDurationMinに含めた。2026年の公式運航時刻表
 * (PDF)を直接開いて確認した実在の便。
 * 開いたURL: https://www.toutetsu.co.jp/ship/pdf/laketowada_time_2026.pdf
 *
 * 遊覧船のあとはタクシーで、発荷峠展望台(OSM way 216109758、秋田県側、
 * 中山・御倉の両半島や御鼻部山を望む「十和田湖三大展望所」の一つ。冬期は
 * 展望台・トイレとも閉鎖)→紫明亭展望台(発荷峠から車約2分、ハート型に見える
 * 十和田湖の眺め)→御鼻部山展望台(標高1,010.6m、発荷峠・瞰湖台とともに
 * 「十和田湖三大展望所」、急な七曲りの坂道でアクセス)の順にめぐり、最後は
 * タクシーで宿のある十和田湖畔まで戻る。すべてOSM/GSIで座標を確認し、
 * 区間の所要時間はOSRMの実測(自動車)を用いた。
 * 開いたURL:
 * - 発荷峠展望台(眺め・駐車場・冬期閉鎖): https://explorekazuno.jp/tourizm/towadako-nanataki/hakkatouge/
 * - 紫明亭展望台(発荷峠からの距離・ハート型の眺め): https://www.tohokukanko.jp/attractions/detail_1007697.html
 * - 御鼻部山(標高1,010.6m・三大展望所・七曲りの道): https://ja.wikipedia.org/wiki/御鼻部山
 *   および https://travel.yahoo.co.jp/kanko/spot-00020586/
 * - ぷらっと(住所・開館時間・展示内容): https://www.city.towada.lg.jp/kanko/spot/puratto.html
 *
 * 【D2】子ノ口は、宿のある十和田湖畔からタクシーでおよそ7分の到着に変更(前回の
 * 遊覧船で片道移動する案は、D2で使う車が休屋に残る問題があり見送った)。
 * 銚子大滝・石ヶ戸は既存のまま(徒歩の実測区間で変更なし)。「焼山」は、
 * 座標を実在の奥入瀬渓流館(OSM node 6161325321、十和田市公式サイトで住所・
 * 開館時間・展示内容を確認)に合わせて「奥入瀬渓流館」に改称し、内容も
 * 差し替えた。渓流館のあとは、上記の理由でタクシーにより十和田市現代美術館
 * (GSI住所検索で座標確認、公式サイトで開館時間・作品を確認)へ向かい、
 * 1泊2日を締めくくる。
 * 開いたURL:
 * - 奥入瀬渓流館(住所・開館時間・展示内容): https://www.city.towada.lg.jp/kanko/spot/2021-0401-0830-001.html
 * - 十和田市現代美術館(住所・開館時間・休館日): https://towadaartcenter.com/overview/
 * - 十和田市現代美術館の作品(草間彌生・奈良美智・ロン・ミュエク・官庁街通りの屋外作品):
 *   https://towadaartcenter.com/collection/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "神秘的な十和田湖に浮かぶパワースポット・十和田神社や、湖畔のシンボル「乙女の像」をたずね、タクシーで発荷峠・紫明亭・御鼻部山の展望台を巡ります。2日目は奥入瀬渓流を歩いて焼山へ抜け、十和田市現代美術館まで足をのばす、信仰と絶景と現代アートの1泊2日プランです。";

const VC_MEMO_FROM = "ここで昼食にするのもよいでしょう。休館日は公式サイトで確かめてから訪れましょう。";
const VC_MEMO_TO = "休館日は公式サイトで確かめてから訪れましょう。";

const PLATTO_MEMO =
  "十和田ビジターセンターから歩いておよそ22分、湖畔の遊歩道を歩いて十和田湖観光交流センター「ぷらっと」に着きます。生きた「十和田湖ひめます」の展示や大型のジオラマがあり、乙女の像を手がけた高村光太郎、この地を愛した文人・大町桂月、十和田湖の発展に尽くした和井内貞行といった、ゆかりのある人々も紹介されています。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ2分、十和田湖遊覧船の乗り場へ向かいましょう。";

const CRUISE_MEMO =
  "ぷらっとから歩いておよそ2分、十和田湖遊覧船の乗り場に着きます。13時15分発のBコースまで少し時間があるので、桟橋周辺で昼食をとるとよいでしょう。乗るのは、休屋を出て中山半島の沖をめぐって戻る周遊のBコースです。十和田湖は、大昔の火山活動によって生まれたカルデラ湖と伝えられており、静かな水をたたえた佇まいから、古くから信仰の対象ともされてきました。湖上からは、十和田神社の杜や、御倉半島・中山半島の深い緑を望むことができ、陸から眺めるのとはまた違う趣があります。運航は季節によって行われており、天候によって運航を見合わせる場合もあるので、訪れる前に確かめておくと安心です。この後は、休屋の乗り場からタクシーに乗り、発荷峠展望台へ向かいましょう。";

const HAKKATOGE_MEMO =
  "遊覧船をおりたら、休屋の乗り場からタクシーに乗り、およそ8分で発荷峠展望台に着きます。ここは十和田湖の南の玄関口にあたる峠で、樹海ラインと国道103号線が交わる場所に立っています。中山半島と御倉半島が重なって湖に横たわる様子や、対岸の御鼻部山、さらに南八甲田の山々まで見渡すことができ、御鼻部山展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。展望台とお手洗いは冬期(11月中旬〜4月下旬ごろ)は閉鎖されるので、訪れる時期に注意しましょう。この後は、タクシーでおよそ2分、紫明亭展望台へ向かいましょう。";

const SHIMEITEI_MEMO =
  "発荷峠展望台からタクシーでおよそ2分、紫明亭展望台に着きます。ここから眺める十和田湖はハートの形に見えるといわれ、隠れたパワースポットとしても知られています。春の新緑、秋の紅葉と、季節ごとに色を変える湖を楽しめます。この後は、タクシーでおよそ19分、御鼻部山展望台へ向かいましょう。";

const OHANABE_MEMO =
  "紫明亭展望台からタクシーでおよそ19分、急な七曲りの坂道を上って御鼻部山展望台に着きます。標高およそ1,010mの山頂にあり、発荷峠展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。十和田湖を大きく見渡すことができ、天候に恵まれれば遠く岩手山や八幡平の山並みまで望めることもあります。帰りもタクシーで、宿のある十和田湖畔まで戻りましょう。";

const NENOKUCHI_MEMO =
  "旅も2日目、宿のある十和田湖畔からタクシーでおよそ7分、子ノ口に着きます。十和田神社にお参りし、乙女の像を訪ね、遊覧船や展望台巡りを楽しんだ昨日の旅を振り返りながら、湖から渓流へと変わりゆく水の表情を眺めてみてください。この後は、歩いておよそ30分、銚子大滝へ向かいましょう。";

const KEIRYUKAN_MEMO =
  "石ヶ戸から歩いておよそ70分、奥入瀬渓流の終点にあたる焼山に着き、奥入瀬渓流館に立ち寄ります。渓流の成り立ちや、そこに暮らす動植物を解説する展示があり、ガイドカウンターには自然に詳しいスタッフが常駐しています。物産コーナーには渓流散策グッズのほか、青森りんごを使ったカフェもあります。営業時間は季節によって変わるので、訪れる前に確かめておきましょう。子ノ口から続いた渓流沿いの散策も、ここでひと区切りです。この後は、焼山の乗り場からタクシーに乗り、十和田市現代美術館へ向かいましょう。";

const MUSEUM_MEMO =
  "焼山からタクシーでおよそ17分、官庁街通りに面した十和田市現代美術館に着きます。草間彌生の「愛はとこしえ十和田でうたう」や、奈良美智の「夜露死苦ガール2012」、ロン・ミュエクの「スタンディング・ウーマン」など、国内外の現代アーティストの作品を、建物と一体になった展示室でじっくり見ることができます。館の前に広がる官庁街通りには、鈴木康広の「はじまりの果実」をはじめとする屋外アート作品が点在しており、入館しなくても歩きながら眺めることができます。休館日は公式サイトで確かめてから訪れましょう。七戸十和田駅や八戸駅へは、バスなどで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const jinja = await findSpotInItinerary(itinId, { spotName: "十和田神社" });
  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });

  if (!vc.memo!.includes(VC_MEMO_FROM)) throw new Error("一致しません(VC)");
  const vcNewMemo = vc.memo!.split(VC_MEMO_FROM).join(VC_MEMO_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: jinja.id, data: {} },
    { id: otome.id, data: {} },
    { id: vc.id, data: { memo: vcNewMemo } },
    {
      create: {
        name: "十和田湖観光交流センター「ぷらっと」",
        address: "青森県十和田市大字奥瀬字十和田湖畔休屋486",
        lat: 40.4261279,
        lng: 140.8930761,
        memo: PLATTO_MEMO,
        visitTime: t(11, 26),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 22,
        transitLine: null,
      },
    },
    {
      id: cruise.id,
      data: {
        memo: CRUISE_MEMO,
        visitTime: t(13, 15),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 79,
        transitLine: null,
      },
    },
    {
      create: {
        name: "発荷峠展望台",
        address: "秋田県鹿角郡小坂町十和田湖畔",
        lat: 40.4087867,
        lng: 140.8642569,
        memo: HAKKATOGE_MEMO,
        visitTime: t(14, 13),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "紫明亭展望台",
        address: "秋田県鹿角郡小坂町十和田湖畔",
        lat: 40.4083394,
        lng: 140.8641707,
        memo: SHIMEITEI_MEMO,
        visitTime: t(14, 45),
        stayDurationMin: 20,
        transitMode: "car",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "御鼻部山展望台",
        address: "青森県十和田市奥瀬十和田湖畔",
        lat: 40.5105155,
        lng: 140.8808432,
        memo: OHANABE_MEMO,
        visitTime: t(15, 24),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 19,
        transitLine: null,
      },
    },
  ];

  const nenokuchi = await findSpotInItinerary(itinId, { spotName: "子ノ口" });
  const choshi = await findSpotInItinerary(itinId, { spotName: "銚子大滝" });
  const ishigedo = await findSpotInItinerary(itinId, { spotName: "石ヶ戸" });
  const yakeyama = await findSpotInItinerary(itinId, { spotName: "焼山" });

  const day2Spots: SpotOrderItem[] = [
    {
      id: nenokuchi.id,
      data: { memo: NENOKUCHI_MEMO, transitMode: "car", transitDurationMin: 7, transitLine: null },
    },
    { id: choshi.id, data: {} },
    { id: ishigedo.id, data: {} },
    {
      id: yakeyama.id,
      data: {
        name: "奥入瀬渓流館",
        address: "青森県十和田市大字奥瀬字栃久保183",
        lat: 40.5745801,
        lng: 140.9787529,
        memo: KEIRYUKAN_MEMO,
        stayDurationMin: 25,
      },
    },
    {
      create: {
        name: "十和田市現代美術館",
        address: "青森県十和田市西二番町10-9",
        lat: 40.613899,
        lng: 141.209351,
        memo: MUSEUM_MEMO,
        visitTime: t(15, 37),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 17,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[], knownStay: Record<string, number>) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      const nm = (d.name as string | undefined) ?? ("id" in x ? knownStay[`name:${x.id}`] : undefined);
      if (!vt) {
        console.log(`(${nm ?? "?"}: visitTime未変更)`);
        continue;
      }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  };

  printSchedule("D1", day1Spots, {
    [jinja.id]: 40,
    [otome.id]: 20,
    [vc.id]: 45,
  });
  printSchedule("D2", day2Spots, {
    [nenokuchi.id]: 30,
    [choshi.id]: 25,
    [ishigedo.id]: 30,
  });

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * #88 d1e7bf32 fix-88d/eへの企画運営(21:10)・法務(21:08)の指摘対応。
 *
 * 【企画運営の7点+2点】
 * 1) 焼山→美術館「タクシーで17分」は短すぎる(25km超)。OSRMの生の値(23.7km/17.3分
 *    =時速82km相当)は、実際には市街地・カーブを含む国道102号の区間として速すぎると
 *    判断し、33分に修正(時速43km相当、バスの実測52分[停車込み]より妥当な線)。
 * 2) ぷらっと→遊覧船の「79分」(待ち時間+昼食を移動に混ぜていた)、VC→ぷらっとの
 *    「22分/1.67km」(直線0.2kmとの乖離)を解消。昼食は実在の十和田食堂(新規、
 *    十和田湖国立公園協会の公式ページで住所・メニューを確認)を滞在の枠として追加し、
 *    D1の順序を 神社→乙女の像→遊覧船→ぷらっと→十和田食堂(昼食)→ビジターセンター→
 *    発荷峠→紫明亭→御鼻部山 に組み直した(乙女の像→遊覧船・ぷらっと→食堂・食堂→VC
 *    はいずれもOSM歩行者ルーティングの実測)。
 * 3) 季節: 十和田湖遊覧船の運航期間(公式2026時刻表でBコースは4/24〜11/16、Aコースは
 *    4/24〜11/5)、発荷峠展望台の冬期閉鎖(11月中旬〜4月下旬)から、冬はこのしおりの
 *    前提(遊覧船・3展望台めぐり)が成り立たないと判断し、seasonsから冬を外す。
 * 4) 「パワースポット」をタイトル・説明文・十和田神社・紫明亭のメモから削除(法務の
 *    指摘と同内容)。タイトルは中身に合わせて変更。
 * 5) タクシーを使う理由の一言を、最初にタクシーに乗るビジターセンターの結びに追加。
 * 6) 1日目の朝(十和田神社の書き出しに「宿を出て」を追加)、2日目の帰り(美術館の
 *    結びを「十和田市中央のバス停から八戸駅・七戸十和田駅へのバス」に具体化)。
 * 7) 御鼻部山の出典に、Wikipediaに加えて十和田湖国立公園協会の公式散策マップ
 *    (標高1011m、見える景色を直接確認)を追加。
 * 追加2点: 十和田神社の結び「15分」(実際は4分)の食い違いを修正。ビジターセンターの
 * 結びが次の行き先(発荷峠)に合っていなかったのを修正。組み直し後、全スポットの
 * 書き出し・結びを前後と読み合わせて確認した。
 *
 * 開いたURL:
 * - 十和田食堂(住所・メニュー): https://towadako.or.jp/enjoy/post1349/
 * - 御鼻部山展望台(標高1011m・見える景色、十和田湖国立公園協会公式): https://towadako.or.jp/sansaku-map/utarube/
 *
 * 【法務の指摘(4点)】
 * 1) 「パワースポット」を全4か所(タイトル・説明文・十和田神社・紫明亭)から削除。
 * 2) 乙女の像の写真(Lake_Towada_from_Ohanabe_2008、実は御鼻部山から見た湖の写真で
 *    場所違い)を、御鼻部山展望台へ付け替え。乙女の像は写真なしにする。
 * 3) 奥入瀬渓流の安全の一文を、子ノ口(歩きやすい靴・飲み物)と銚子大滝(足元・
 *    立ち入り禁止)に指定どおり追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "十和田湖の遊覧船と三つの展望台、奥入瀬渓流を歩く1泊2日";
const DESCRIPTION =
  "神秘的な十和田湖に浮かぶ十和田神社や、湖畔のシンボル「乙女の像」をたずね、周遊の遊覧船に乗ったあと、タクシーで発荷峠・紫明亭・御鼻部山の三つの展望台を巡ります。2日目は奥入瀬渓流を歩いて焼山へ抜け、十和田市現代美術館まで足をのばす、信仰と絶景と現代アートの1泊2日プランです。";

const JINJA_MEMO =
  "宿を出て、十和田湖畔にひっそりと鎮まる十和田神社へ向かいます。蝦夷平定に赴いた坂上田村麻呂がこの地に社を創建したという言い伝えと、熊野で修行を重ねた僧・南祖坊が、湖の主であったという八郎太郎との力比べの末にこの地に住まうことになったという龍神伝説と、二つの由緒が今に伝わっています。古くから水と龍神への信仰を集めてきた社とされ、杉の巨木が並ぶ参道を歩くと、清らかな空気が感じられます。地域の人々が大切に守り続けてきた信仰の場でもあるので、静かに、敬意をもってお参りください。この後は、歩いておよそ4分、乙女の像へ向かいましょう。";

const OTOME_MEMO =
  "十和田神社から歩いておよそ4分、十和田湖のシンボルとして知られる乙女の像に着きます。彫刻家であり詩人でもあった高村光太郎が、十和田八幡平国立公園の指定を記念して手掛けた作品で、1953年に建立されました。二体の裸婦像が静かに向き合い、互いに手を差し伸べるような姿は、光太郎の最晩年の大作とされています。像のモデルについては、亡き妻・智恵子ではないかと語られることもありますが、光太郎自身は生前、モデルが誰かをはっきりとは語らなかったと伝えられています。像の前に広がる御前ヶ浜では、白い紙をひねった「おより紙」を湖に投げ入れ、願いが叶うかどうかを占う風習も伝わっています。この後は、歩いておよそ11分、十和田湖遊覧船の乗り場へ向かいましょう。";

const CRUISE_MEMO =
  "乙女の像から歩いておよそ11分、十和田湖遊覧船の乗り場に着きます。乗るのは、休屋を出て中山半島の沖をめぐって戻る周遊のBコースです。十和田湖は、大昔の火山活動によって生まれたカルデラ湖と伝えられており、静かな水をたたえた佇まいから、古くから信仰の対象ともされてきました。湖上からは、十和田神社の杜や、御倉半島・中山半島の深い緑を望むことができ、陸から眺めるのとはまた違う趣があります。運航は季節によって行われており、天候によって運航を見合わせる場合もあるので、訪れる前に確かめておくと安心です。この後は、歩いておよそ2分、十和田湖観光交流センター「ぷらっと」へ向かいましょう。";

const PLATTO_MEMO =
  "十和田湖遊覧船の乗り場から歩いておよそ2分、十和田湖観光交流センター「ぷらっと」に着きます。生きた「十和田湖ひめます」の展示や大型のジオラマがあり、乙女の像を手がけた高村光太郎、この地を愛した文人・大町桂月、十和田湖の発展に尽くした和井内貞行といった、ゆかりのある人々も紹介されています。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ16分、十和田食堂へ向かいましょう。";

const SHOKUDO_MEMO =
  "ぷらっとから歩いておよそ16分、十和田食堂に着きます。十和田湖でとれるひめますを使った郷土料理をはじめ、麺類や丼物などの食事ができます。ここで昼食にしましょう。営業日は公式で確かめておくと安心です。この後は、歩いておよそ6分、十和田ビジターセンターへ向かいましょう。";

const VC_MEMO =
  "十和田食堂から歩いておよそ6分、十和田ビジターセンターに着きます。環境省が運営する施設で、十和田湖の成り立ちや、四季の自然をパネルや模型でわかりやすく紹介しています。館内からの眺めもよく、湖側は遊歩道につながっていて、十和田湖畔を歩く際の起点にもなっています。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーで発荷峠展望台へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const HAKKATOGE_MEMO =
  "十和田ビジターセンターからタクシーでおよそ8分、発荷峠展望台に着きます。ここは十和田湖の南の玄関口にあたる峠で、樹海ラインと国道103号線が交わる場所に立っています。中山半島と御倉半島が重なって湖に横たわる様子や、対岸の御鼻部山、さらに南八甲田の山々まで見渡すことができ、御鼻部山展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。展望台とお手洗いは冬期(11月中旬〜4月下旬ごろ)は閉鎖されるので、訪れる時期に注意しましょう。この後は、タクシーでおよそ2分、紫明亭展望台へ向かいましょう。";

const SHIMEITEI_MEMO =
  "発荷峠展望台からタクシーでおよそ2分、紫明亭展望台に着きます。ここから眺める十和田湖はハートの形に見えるといわれています。春の新緑、秋の紅葉と、季節ごとに色を変える湖を楽しめます。この後は、タクシーでおよそ22分、御鼻部山展望台へ向かいましょう。";

const OHANABE_MEMO =
  "紫明亭展望台からタクシーでおよそ22分、七曲りと呼ばれる急な坂道を上って御鼻部山展望台に着きます。標高およそ1,011mと、十和田湖の展望台の中でも高い場所にあり、発荷峠展望台・瞰湖台とともに「十和田湖三大展望所」の一つとされています。御倉半島と中山半島が紺碧の湖面を抱くように連なる眺めが広がり、天気がよければ遠く岩手山や八幡平の山並みまで見渡せます。腰を下ろせる休憩スペースもあるので、湖を眺めながらひと息つきましょう。帰りもタクシーで、宿のある十和田湖畔まで戻りましょう。";

const NENOKUCHI_SAFETY =
  "長い距離を歩くので、歩きやすい靴で、飲み物を持って歩きましょう。";
const CHOSHI_SAFETY =
  "渓流沿いの遊歩道は滑りやすいところがあるので、足元に気をつけ、川に近づきすぎないようにしましょう。落石や倒木にも気をつけ、立ち入り禁止の場所には入らないようにしましょう。";

const MUSEUM_MEMO =
  "焼山からタクシーでおよそ33分、官庁街通りに面した十和田市現代美術館に着きます。草間彌生の「愛はとこしえ十和田でうたう」や、奈良美智の「夜露死苦ガール2012」、ロン・ミュエクの「スタンディング・ウーマン」など、国内外の現代アーティストの作品を、建物と一体になった展示室でじっくり見ることができます。館の前に広がる官庁街通りには、鈴木康広の「はじまりの果実」をはじめとする屋外アート作品が点在しており、入館しなくても歩きながら眺めることができます。休館日は公式サイトで確かめてから訪れましょう。美術館からは、十和田市中央のバス停まで歩き、八戸駅や七戸十和田駅へ向かうバスで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const jinja = await findSpotInItinerary(itinId, { spotName: "十和田神社" });
  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  const platto = await findSpotInItinerary(itinId, { spotName: "十和田湖観光交流センター「ぷらっと」" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });
  const hakkatoge = await findSpotInItinerary(itinId, { spotName: "発荷峠展望台" });
  const shimeitei = await findSpotInItinerary(itinId, { spotName: "紫明亭展望台" });
  const ohanabe = await findSpotInItinerary(itinId, { spotName: "御鼻部山展望台" });

  const otomePhoto = await prisma.photo.findFirst({ where: { spotId: otome.id } });
  if (!otomePhoto) throw new Error("乙女の像の写真が見つかりません");

  // D1: 神社→乙女→遊覧船→ぷらっと→食堂(新規、昼食)→VC→発荷峠→紫明亭→御鼻部山
  const day1Spots: SpotOrderItem[] = [
    { id: jinja.id, data: { memo: JINJA_MEMO } },
    { id: otome.id, data: { memo: OTOME_MEMO } },
    {
      id: cruise.id,
      data: {
        memo: CRUISE_MEMO,
        visitTime: t(10, 15),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    {
      id: platto.id,
      data: {
        memo: PLATTO_MEMO,
        visitTime: t(11, 7),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "十和田食堂",
        address: "青森県十和田市大字奥瀬字十和田湖畔休屋486",
        lat: 40.4290181,
        lng: 140.8937854,
        memo: SHOKUDO_MEMO,
        visitTime: t(11, 53),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 16,
        transitLine: null,
      },
    },
    {
      id: vc.id,
      data: {
        memo: VC_MEMO,
        visitTime: t(12, 44),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      id: hakkatoge.id,
      data: { memo: HAKKATOGE_MEMO, visitTime: t(13, 37), transitMode: "car", transitDurationMin: 8, transitLine: null },
    },
    {
      id: shimeitei.id,
      data: { memo: SHIMEITEI_MEMO, visitTime: t(14, 9), transitMode: "car", transitDurationMin: 2, transitLine: null },
    },
    {
      id: ohanabe.id,
      data: {
        memo: OHANABE_MEMO,
        visitTime: t(14, 51),
        stayDurationMin: 85,
        transitMode: "car",
        transitDurationMin: 22,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  {
    let prevEnd = -1;
    const knownStay: Record<string, number> = { [jinja.id]: 40, [otome.id]: 20 };
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
    await tx.itinerary.update({
      where: { id: itinId },
      data: { title: TITLE, description: DESCRIPTION, seasons: ["spring", "summer", "autumn"] as any },
    });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await tx.photo.update({ where: { id: otomePhoto.id }, data: { spotId: ohanabe.id } });
  }, { timeout: 60000 });

  // D2: 安全の一文(子ノ口・銚子大滝)、美術館の移動時間・結びの直し
  const nenokuchi = await findSpotInItinerary(itinId, { spotName: "子ノ口" });
  const nenokuchiFrom = "この後は、歩いておよそ30分、銚子大滝へ向かいましょう。";
  if (!nenokuchi.memo!.includes(nenokuchiFrom)) throw new Error("一致しません(子ノ口)");
  const nenokuchiNewMemo = nenokuchi.memo!.replace(nenokuchiFrom, `${NENOKUCHI_SAFETY} ${nenokuchiFrom}`);
  await updateSpotInItinerary(itinId, { spotId: nenokuchi.id }, { memo: nenokuchiNewMemo });

  const choshi = await findSpotInItinerary(itinId, { spotName: "銚子大滝" });
  const choshiFrom = "この後は、歩いておよそ140分、石ヶ戸へ向かいましょう。";
  if (!choshi.memo!.includes(choshiFrom)) throw new Error("一致しません(銚子大滝)");
  const choshiNewMemo = choshi.memo!.replace(choshiFrom, `${CHOSHI_SAFETY} ${choshiFrom}`);
  await updateSpotInItinerary(itinId, { spotId: choshi.id }, { memo: choshiNewMemo });

  const yakeyama = await findSpotInItinerary(itinId, { spotName: "奥入瀬渓流館" });
  const museum = await findSpotInItinerary(itinId, { spotName: "十和田市現代美術館" });
  await updateSpotInItinerary(itinId, { spotId: museum.id }, {
    memo: MUSEUM_MEMO,
    visitTime: t(15, 53),
    stayDurationMin: 45,
    transitMode: "car",
    transitDurationMin: 33,
  });

  console.log("COMMITTED");
  console.log("D2 奥入瀬渓流館 stay終了:", yakeyama.stayDurationMin, "→美術館 15:53-16:38 (間33分)");
}
main().finally(() => prisma.$disconnect());

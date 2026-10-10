/**
 * #100 5b3004dc 明神池と穂高神社奥宮、上高地の静寂を歩く1泊2日。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元はD1 2か所(10:30〜12:00)・D2 1か所(09:30〜10:10)で、4か所未満・開始・
 * 終了とも決まりに合っていなかった。上高地の定番の遊歩道沿いにある実在の
 * 行き先(大正池・田代池・徳沢・河童橋・ウェストン碑)を追加し、D1 4か所
 * (9:00〜16:35)・D2 4か所(9:00〜16:30)に組み直した。あわせて元の文章の
 * ツアーガイド口調(皆様/ご案内いたします/お楽しみください/お過ごしいただければ)も
 * サイト標準の口調に直した。移動時間は、公式ガイドで示される徒歩の目安
 * (大正池-河童橋 約60分・河童橋-明神 約50分・河童橋-徳沢 約120分)をもとに
 * 配分した(田代池・ウェストン碑は、その途中にある実在の地点として案分)。
 * 「静寂を歩く」という元のテーマに合わせ、河童橋は歩いて通り過ぎるだけの
 * 扱いにせず、D2で実際に立ち寄るスポットとして組み込んだ。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 大正池: 36.2283914,137.6196921 / 田代池: 36.2357143,137.6245487
 * - 徳沢(徳澤園): 36.2657169,137.6905130 / 河童橋: 36.2488436,137.6378366
 * - ウェストン碑: 36.2470302,137.6266555
 *
 * 開いたURL(事実確認):
 * - 大正池(1915年焼岳噴火・泥流でせき止め): https://visitmatsumoto.com/spot/detail_1027.html
 * - 河童橋(名前の由来諸説・芥川龍之介『河童』で有名に): https://ja.wikipedia.org/wiki/%E6%B2%B3%E7%AB%A5%E6%A9%8B
 * - ウェストン碑(1937年・日本山岳会が喜寿を祝い建立・6月第一日曜のウェストン祭): https://www.kamikochi-guide.net/event/westonfest.html
 * - 徳沢(かつての牧場・1934年中部山岳国立公園指定で閉鎖・井上靖『氷壁』の舞台): https://www.kamikochi.or.jp/facilities/tokusawaen/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "神秘的な明神池と、その畔に鎮座する穂高神社奥宮を中心に、大正池から河童橋、徳沢まで上高地をじっくり歩く1泊2日です。例年4月下旬〜11月中旬の開山期間のみ訪問でき、マイカー規制のため沢渡・平湯からバスかタクシーで入ります。";

const TAISHOIKE_MEMO =
  "上高地の旅は、大正池から始まります。大正4年(1915)6月、焼岳の噴火にともなう泥流が梓川をせき止め、一夜にしてできた池と伝えられています。水没した木々は立ち枯れとなって今も水面に残り、背後にそびえる穂高連峰・焼岳の姿とともに、上高地を象徴する風景として知られています。風がやみ、水面が鏡のようになる朝は、ことに美しい眺めが楽しめます。この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";

const TASHIROIKE_MEMO =
  "大正池から歩いておよそ20分、田代池に着きます。梓川の伏流水が湧き出してできた浅い池で、湿原状の草地に囲まれています。池の周りには湿性植物が茂り、季節ごとに表情を変えます。奥に望む穂高連峰の眺めも美しく、静かな水辺でひと息つくのにちょうどよい場所です。この後は、河童橋のたもとを通り過ぎながら、歩いておよそ130分、穂高神社奥宮へ向かいましょう。";

const HOTAKA_OKUMIYA_MEMO =
  "田代池から河童橋のたもとを通り過ぎ、歩いておよそ130分、穂高神社奥宮に着きます。安曇野市にある里宮に対し、こちらは明神池のほとりに鎮座する奥宮です。祭神である穂高見命は、海神族の祖神と伝えられています。里宮・奥宮、そして奥穂高岳山頂の嶺宮を持つことから、「日本アルプスの総鎮守」とも呼ばれています。毎年10月8日には奥宮例大祭が行われ、龍頭鷁首の御船が明神池を巡る神事は「明神池お船祭り」として親しまれています。祈りの場でもあるため、参拝の際は敬意を込めて手を合わせましょう。上高地は国立公園の特別保護地区でもあるため、決められた道を歩き、自然を大切にしましょう。この後は、神域内の明神池へ向かいましょう。";

const MYOJINIKE_MEMO =
  "穂高神社奥宮の神域内にある明神池に着きます。この池は一之池と二之池からなっています。風がやむと水面に穂高連峰の姿が映り込み、その静けさは訪れる人の心を惹きつけるといわれています。拝観には手続きが必要です。ここも神域の一部のため、静かに過ごしましょう。決められた道を大切に歩きながら、この静寂の景色をゆっくりと眺めてみてください。ここで昼食にしましょう。1日目はここまでです。今夜は、明神や徳沢方面の山小屋に泊まります。";

const TOKUSAWA_MEMO =
  "2日目は、明神からさらに奥へ進んだ徳沢から歩き始めます。かつて牧場だった草地で、昭和9年(1934)の中部山岳国立公園指定にともない閉鎖されました。牧場の番小屋だった建物は、今も山小屋「徳澤園」として営業しています。作家・井上靖の小説『氷壁』の舞台としても知られ、徳澤園はその作中に登場する宿のモデルとされています。穂高連峰を望む広々とした草地で、山と静けさに包まれる時間を過ごしてみてください。この後は、歩いておよそ120分、河童橋へ向かいましょう。";

const KAPPABASHI_MEMO =
  "徳沢から歩いておよそ120分、上高地のシンボル・河童橋に着きます。梓川に架かる木製の吊橋で、橋の上から仰ぐ穂高連峰と焼岳の眺めは、上高地を代表する景観として知られています。名前の由来には諸説あり、河童が住みそうな深い淵があったためとも、まだ橋がなかった時代に衣類を頭にのせて川を渡った人の姿が河童に似ていたからともいわれています。昭和2年(1927)、芥川龍之介が発表した小説『河童』にこの橋が描かれたことで、その名が広く知られるようになりました。橋の周辺には売店や宿泊施設が集まり、上高地でもっともにぎわうエリアです。橋を渡ったり、川沿いを歩いたりしながら、思い思いに過ごせます。ここで昼食にしましょう。この後は、歩いておよそ20分、ウェストン碑へ向かいましょう。";

const WESTON_MEMO =
  "河童橋から歩いておよそ20分、ウェストン碑に着きます。イギリス人宣教師ウォルター・ウェストンは、明治時代にたびたび日本アルプスを訪れ、その魅力を『日本アルプスの登山と探検』という本で世界に紹介しました。日本の近代登山の父とも呼ばれる人物で、この碑は、日本山岳会がウェストンの喜寿を祝って昭和12年(1937)に建てたレリーフです。毎年6月第一日曜には「ウェストン祭」も開かれています。梓川のほとりに静かにたたずむ碑を訪ね、日本アルプスを愛した先人に思いをはせてみてください。この後は、歩いておよそ20分、上高地ビジターセンターへ向かいましょう。";

const VISITOR_CENTER_MEMO =
  "ウェストン碑から歩いておよそ20分、上高地ビジターセンターに着きます。環境省が運営する施設で、上高地の自然や歴史に関する展示のほか、天気や花の開花情報などの発信、ガイドウォークの受付も行っています。上高地は特別名勝・特別天然記念物にも指定された、貴重な自然が残る場所です。旅の締めくくりに、これまで歩いてきた明神池や穂高神社奥宮、徳沢や河童橋、そして穂高の山々の記憶を振り返りながら、展示をゆっくり見て回ってみてください。国立公園の豊かな自然を未来へ残すためにも、決められた道を歩くなど、自然保護に協力しましょう。静けさと祈り、そして雄大な自然に包まれた上高地の旅は、これで終わりです。なお、上高地は冬季は閉鎖されるため、出かける前に最新情報を確かめましょう。帰りは、上高地バスターミナルから、沢渡・平湯方面へのバスをご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const okumiya = await findSpotInItinerary(itinId, { spotName: "穂高神社奥宮" });
  const myojinike = await findSpotInItinerary(itinId, { spotName: "明神池" });
  const visitorCenter = await findSpotInItinerary(itinId, { spotName: "上高地ビジターセンター" });

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "大正池",
        address: "長野県松本市安曇上高地",
        lat: 36.2283914,
        lng: 137.6196921,
        memo: TAISHOIKE_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 100,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "田代池",
        address: "長野県松本市安曇上高地",
        lat: 36.2357143,
        lng: 137.6245487,
        memo: TASHIROIKE_MEMO,
        visitTime: t(11, 0),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      id: okumiya.id,
      data: { memo: HOTAKA_OKUMIYA_MEMO, visitTime: t(14, 0), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 130, transitLine: null },
    },
    {
      id: myojinike.id,
      data: { memo: MYOJINIKE_MEMO, visitTime: t(14, 45), stayDurationMin: 110, transitMode: "walk", transitDurationMin: 5, transitLine: null },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "徳沢",
        address: "長野県松本市安曇上高地",
        lat: 36.2657169,
        lng: 137.690513,
        memo: TOKUSAWA_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 100,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "河童橋",
        address: "長野県松本市安曇上高地",
        lat: 36.2488436,
        lng: 137.6378366,
        memo: KAPPABASHI_MEMO,
        visitTime: t(12, 40),
        stayDurationMin: 120,
        transitMode: "walk",
        transitDurationMin: 120,
        transitLine: null,
      },
    },
    {
      create: {
        name: "ウェストン碑",
        address: "長野県松本市安曇上高地",
        lat: 36.2470302,
        lng: 137.6266555,
        memo: WESTON_MEMO,
        visitTime: t(15, 0),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      id: visitorCenter.id,
      data: { memo: VISITOR_CENTER_MEMO, visitTime: t(15, 40), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 20, transitLine: null },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, spots] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
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
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

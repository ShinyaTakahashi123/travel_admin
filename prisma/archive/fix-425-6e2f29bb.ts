/**
 * チェックリスト #425 6e2f29bb「外湯めぐりと松葉ガニ。冬の城崎温泉でゆかた散歩」の見直し（しおりえ(制作補助2)）
 * 1日目: 玄武洞公園（新規）→（タクシー）四所神社（新規）→ 御所の湯 →（昼食）→ 城崎麦わら細工伝承館（新規）→ 一の湯 → 大谿川の柳並木（新規）→ 柳湯 → まんだら湯（8か所 09:00〜16:30）
 * 2日目: 城崎温泉ロープウェイ → 温泉寺 →（ロープウェイで下りて）鴻の湯 → 地蔵湯（4か所 09:10〜12:40。帰る日）
 * 前の行程は1日目が14時から夜20時台、2日目は昼前に終わっていた。柳湯・まんだら湯は午後から開く外湯なので（公式）、2日目の朝のまんだら湯は入れない。
 *   まんだら湯を1日目の夕方に、地蔵湯を2日目に移す（日をまたぐ移動）。夜の柳湯は夕方にする
 * 既存の本文は案内役の話し言葉「皆様、…」で、公式と合わない記述もあったので、一文ずつ公式で確かめて書き直す:
 *   - 温泉寺・まんだら湯「養老元年（717）に霊泉が湧き出した」→ 公式は「養老元年に城崎へ来て、千日の修行の末、養老4年（720）に湧出」
 *   - 鴻の湯「舒明天皇の629年」、地蔵湯「六角形の窓・玄武洞のデザイン」、一の湯「洞窟風呂・開湯1300年を超える」、御所の湯「滝の露天風呂・京都御所を思わせる唐破風」、
 *     柳湯「比較的小ぶり・締めくくりに訪れる人」、ロープウェイ「昭和38年開業・日本で唯一の中間駅」は、開いた公式で確かめられないので外すか、公式の文に直す
 *   - 説明文の「例年11月上旬〜3月」（上旬の語）と「多くの旅館で入浴券」（確かめられない）を直す
 *   - 鴻の湯は改修工事で長期休館中（公式、10月30日まで予定）なので、開いているかを確かめる一文を入れる
 * 写真: 地蔵湯に付いていた写真（Kinosaki_onsen02_1920.jpg、663highland）は、柳並木の大谿川の写真で地蔵湯ではないので、新しく足す「大谿川の柳並木」に付け替える（表紙と同じ画像なので表紙も合う）。
 *   ロープウェイ・温泉寺の写真は目で見て合っているので残す
 * 本文の出典: 城崎温泉観光協会 外湯 https://kinosaki-spa.gr.jp/about/spa/ ／歴史 https://kinosaki-spa.gr.jp/about/history/ ／城崎温泉のキホン（大谿川） https://kinosaki-spa.gr.jp/about/kinosaki/ ／
 *   鴻の湯の休館 https://kinosaki-spa.gr.jp/news/28289/ ／玄武洞公園 https://kinosaki-spa.gr.jp/facility/genbudou/ ／四所神社 https://kinosaki-spa.gr.jp/facility/shisyo/ ／
 *   城崎麦わら細工伝承館 https://kinosaki-spa.gr.jp/facility/mugiwara/ ／城崎温泉ロープウェイ https://kinosaki-ropeway.jp/ ／温泉寺 https://kinosaki-onsenji.jp/about/index.html ／
 *   松葉ガニの漁期 https://toyooka-tourism.com/event/kani_kaikin/
 * 座標の出典: Nominatim（玄武洞公園 35.5879771,134.8042576／四所神社 35.6260329,134.8075983／御所の湯 35.6258955,134.8073963／城崎麦わら細工伝承館 35.6255072,134.8087109／
 *   一の湯 35.6261621,134.8095333／まんだら湯 35.6244562,134.8057307／城崎温泉ロープウェイ 35.6240048,134.8005895／温泉寺 35.6239477,134.8004408／地蔵湯 35.6267985,134.8126854）、
 *   OSM/Overpass（柳湯 way 300742117 35.6264213,134.8102224／鴻の湯 way 300742161 35.6262747,134.8045122／大谿川 way 83407149 の一の湯の前の点 35.6259626,134.8096811）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-425-6e2f29bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e2f29bb-45c2-494a-83c1-8e42e11552c1";
const DAY1_ID = "278062c4-541a-4152-b871-16121ae9c38b";
const DAY2_ID = "aa643f2b-6bf0-406f-a4b1-a44cf0c234f8";
const JIZO = "d31238c3-fbfd-4b81-add6-43ef6311d4dd";
const ICHI = "983157d4-8b39-4b6f-8f11-bb866cfd736f";
const GOSHO = "6048f7ad-4adb-4f44-8a8a-19720a461b5a";
const YANAGI = "30bc31eb-6204-43b4-a8ef-5bc766694975";
const ROPEWAY = "f27d819a-ae1b-4910-8993-dbb764ba9946";
const ONSENJI = "0cdbc921-dcf1-424d-8dd6-6f316867be90";
const MANDARA = "9bd4e88c-da75-43a6-b5f1-2c0040f52c26";
const KOUNOYU = "140a6e04-960e-46dd-ab2f-1f3959648456";
const RIVER = "大谿川の柳並木";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "柳並木の大谿川沿いに外湯が並ぶ城崎温泉を、ゆかたで歩く1泊2日。1日目は国の天然記念物・玄武洞から、温泉の守護神の四所神社、御所の湯・一の湯・柳湯・まんだら湯へ。2日目はロープウェイで山頂駅に上り、温泉寺にお参りしてから、鴻の湯と地蔵湯へ。冬の城崎は松葉ガニの季節で、豊岡市の漁港では例年11月にズワイガニ漁が解禁されます。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。";

type Extra = Record<string, unknown>;
const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Extra = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  cre("玄武洞公園", 9, 0, 60, null, null, 35.587977, 134.804258, "兵庫県豊岡市赤石1347",
    "旅の始まりは、城崎温泉駅からタクシーで約5分の玄武洞公園へ。国の天然記念物「玄武洞」は、約160万年前の火山活動で流れ出したマグマが、冷えて固まるときにできた規則正しい割れ目の岩です。約6000年前に波に洗われて姿を現し、人が石を採取したために洞になりました。六角形の柱のような石が積み重なった姿は圧巻です。江戸時代の文化4年（1807年）に幕府の儒官・柴野栗山が「玄武洞」と名付け、明治17年（1884年）には小藤文次郎博士がその名から岩石を「玄武岩」と名付けました。昭和6年（1931年）に国の天然記念物に指定されています。岩場では足元に気をつけましょう。"),
  cre("四所神社", 10, 10, 20, "taxi", 10, 35.626033, 134.807598, "兵庫県豊岡市城崎町湯島",
    "玄武洞からタクシーで温泉街へ。外湯の「御所の湯」の隣に建つ、城崎温泉の氏神・温泉の守護神として信仰されてきた神社です。和銅元年（708年）、日生下権守が神託を受けて四柱の明神をまつったのが始まりとされ、温泉の守護神の湯山主神と、水の守護神でもある宗像三女神をまつっています。本殿と拝殿は兵庫県の登録有形文化財です。本殿の裏から湧き出る「延命水」も名水として知られ、毎年10月には秋の祭礼「城崎だんじり祭り」が行われます。" + RESPECT),
  upd(GOSHO, 10, 32, 48, "walk", 2, 35.625896, 134.807396,
    "四所神社のすぐ隣。南北朝時代の歴史物語「増鏡」に、文永4年（1267年）に後堀河天皇の姉・安嘉門院がこの地の湯に入ったという記事があることから、「御所の湯」と名付けられました。館内には但馬の山をイメージしたキンキマメザクラやミツバツツジなどが植えられ、裏山を借景にした開放感のある露天風呂があります。外湯ごとに休みの日が違うので、公式の案内で確かめておきましょう。いくつもの湯をめぐるときは、長湯を避けて、こまめに水分をとりましょう。" + BATH + "このあと、温泉街で昼食にしましょう。"),
  cre("城崎麦わら細工伝承館", 12, 40, 40, "walk", 5, 35.625507, 134.808711, "兵庫県豊岡市城崎町湯島",
    "昼食のあとは城崎麦わら細工伝承館へ。大麦のわらを原料に、桐箱や色紙に細工を施す「城崎麦わら細工」には300年の歴史があり、兵庫県の伝統的工芸品、豊岡市の無形文化財に指定されています。江戸時代後期に来日した医師シーボルトが持ち帰った資料「シーボルト・コレクション」にも収められ、明治時代にはセントルイス万国博覧会で最高名誉賞牌を受けたとされます。白壁の土蔵を生かした館内で、今の職人の作品や、明治・大正・昭和初期の作品を見られます。麦わら細工の体験もできるので、内容は館に問い合わせましょう。"),
  upd(ICHI, 13, 25, 50, "walk", 5, 35.626162, 134.809533,
    "麦わら細工伝承館から歩いてすぐ。江戸時代中期にできたころは「新湯（あらゆ）」と呼ばれていましたが、江戸時代の名医・香川修徳が著書「一本堂薬選」で「城崎新湯は天下一」とたたえたことから、「一の湯」と名を改めました。「一の湯」の「一」は、天下一の「一」なのです。" + BATH),
  cre(RIVER, 14, 17, 38, "walk", 2, 35.625963, 134.809681, "兵庫県豊岡市城崎町湯島",
    "一の湯の前を流れる大谿川（おおたにがわ）沿いを、ゆかたで歩きましょう。柳並木と石造りの太鼓橋が続く川沿いの風情は、小説の神様と呼ばれた志賀直哉にも愛されました。志賀直哉は何度も城崎温泉を訪れていて、柳並木はもちろん、春の桜や冬の雪景色と、季節ごとに違う風情を見せてくれます。雪の日は足元が滑りやすいので、下駄で歩くときは気をつけましょう。"),
  upd(YANAGI, 15, 0, 30, "walk", 5, 35.626421, 134.810222,
    "大谿川沿いを歩いて柳湯へ。中国の名勝・西湖から移した柳の木の下から湯が湧き出たことから、「柳湯」と名付けられました。外湯の中ではいちばん小さな湯ですが、風情があって人気です。柳湯とまんだら湯は、午後から開く外湯です。" + BATH),
  upd(MANDARA, 15, 40, 50, "walk", 10, 35.624456, 134.805731,
    "柳湯から歩いて約10分。奈良時代に道智上人が一千日の間、八曼陀羅経というお経を唱え続けたところ、満願して霊湯が湧き出したのが城崎温泉の始まりとされ、その仏縁から「まんだら湯」と名付けられました。建物は昔から唐破風の様式で、裏山の自然を眺めながら入る露天風呂が人気です。" + BATH + "1日目の外湯めぐりはここまで。宿に戻って、冬の味覚の松葉ガニを味わいましょう。今夜は城崎温泉に泊まります。"),
];

const day2 = [
  upd(ROPEWAY, 9, 10, 50, null, null, 35.624005, 134.80059,
    "2日目は城崎温泉ロープウェイで山頂駅へ。山頂からは、外湯めぐりで知られる城崎の町並みと、遠くに日本海までの眺めが広がります。運転の時間は公式の案内で確かめましょう。帰りは、途中の温泉寺駅で降りて温泉寺にお参りします。"),
  upd(ONSENJI, 10, 5, 40, "other", 5, 35.623948, 134.800441,
    "ロープウェイの温泉寺駅は、温泉寺にお参りするためにつくられた駅です。温泉寺は、養老4年（720年）に城崎温泉を開いた道智上人によって、天平10年（738年）に開かれた寺です。道智上人は養老元年（717年）に城崎の地を訪れ、四所明神のお告げによって一千日の修行を行い、その功徳で温泉が湧き出したと伝えられます（今のまんだら湯）。「末代山温泉寺」の山号・寺号は、聖武天皇から「城崎温泉の守護寺」として賜ったものとされます。" + RESPECT),
  upd(KOUNOYU, 11, 0, 45, "other", 15, 35.626275, 134.804512,
    "温泉寺駅からロープウェイで下りて、鴻の湯へ。道智上人の開湯とは別に、城崎温泉にはもうひとつの開湯伝説があります。昔、足をけがしたコウノトリが傷をいやしていた場所をよく見ると、温泉が湧き出していたそうで、これが「鴻の湯」の名の由来です。建物の改修工事で長く休館することもあるので、開いているかどうかを公式の案内で確かめてから出かけましょう。" + BATH),
  upd(JIZO, 11, 55, 45, "walk", 10, 35.626799, 134.812685,
    "鴻の湯から大谿川沿いを歩いて約10分。江戸時代、多くの村人が入浴したことから「里人の外湯」と呼ばれてきました。湯の泉源から地蔵尊が出たことから「地蔵湯」と名付けられたといわれ、今も庭に地蔵尊がまつられています。2階には畳敷きの広い休憩所などもあります。" + BATH + "旅の最後の湯で温まってから、城崎温泉駅へ向かいましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== [JIZO, ICHI, GOSHO, YANAGI].join() ||
    days[1].spots.map((s) => s.id).join() !== [ROPEWAY, ONSENJI, MANDARA, KOUNOYU].join()) throw new Error("構成が想定と違います");
  const jizoPhotos = days[0].spots[0].photos;
  if (jizoPhotos.length !== 1 || !jizoPhotos[0].sourceUrl?.includes("Kinosaki_onsen02_1920.jpg")) throw new Error("地蔵湯の写真が想定と違います");
  console.log(`付け替える写真: ${jizoPhotos[0].id}（表紙と同じ: ${it.thumbnailUrl === jizoPhotos[0].url}）`);
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      // 日をまたぐ移動: 地蔵湯は2日目へ、まんだら湯は1日目へ
      await tx.spot.update({ where: { id: JIZO }, data: { dayId: DAY2_ID, orderNo: 9501 } });
      await tx.spot.update({ where: { id: MANDARA }, data: { dayId: DAY1_ID, orderNo: 9502 } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
      const river = await tx.spot.findMany({ where: { dayId: DAY1_ID, name: RIVER }, select: { id: true } });
      if (river.length !== 1) throw new Error("大谿川の柳並木のスポットが見つかりません");
      await tx.photo.update({ where: { id: jizoPhotos[0].id }, data: { spotId: river[0].id } });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

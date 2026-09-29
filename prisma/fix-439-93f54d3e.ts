/**
 * チェックリスト #439 93f54d3e「柳並木と七つの外湯、城崎温泉ゆかたさんぽ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 四所神社（新規）→ 御所の湯 → 城崎麦わら細工伝承館（新規）→ 大谿川の柳並木（新規）→ 一の湯 →（昼食）→ 城崎温泉ロープウェイ → 温泉寺（新規）→
 *   （ロープウェイで下りて）まんだら湯（新規）→ 柳湯（新規）（9か所 09:00〜16:40）
 * 7つの外湯すべてをめぐる行程ではないので、タイトルを「柳並木と外湯めぐり、城崎温泉ゆかたさんぽ日帰りプラン」にする
 * 柳湯とまんだら湯は午後（15時）から開く外湯（公式）なので、夕方に入れる
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（#425 と同じ出典。前の本文は「皆様、…」の話し言葉）:
 *   - 御所の湯「京都の御所を思わせる唐破風の玄関・滝の露天風呂」、一の湯「洞窟風呂・開湯1300年を超える」、ロープウェイ「昭和38年開業・日本で唯一の中間駅」は外す
 * 写真: 御所の湯に付いていた写真（Kinosaki_onsen02_1920.jpg、663highland）は大谿川の柳並木の写真で御所の湯ではないので、新しく足す「大谿川の柳並木」に付け替える（表紙と同じなら表紙も合う）。
 *   ロープウェイの写真は合っているので残す
 * 本文の出典: 城崎温泉観光協会 外湯 https://kinosaki-spa.gr.jp/about/spa/ ／歴史 https://kinosaki-spa.gr.jp/about/history/ ／大谿川 https://kinosaki-spa.gr.jp/about/kinosaki/ ／
 *   四所神社 https://kinosaki-spa.gr.jp/facility/shisyo/ ／城崎麦わら細工伝承館 https://kinosaki-spa.gr.jp/facility/mugiwara/ ／城崎温泉ロープウェイ https://kinosaki-ropeway.jp/ ／
 *   温泉寺 https://kinosaki-onsenji.jp/about/index.html
 * 座標の出典: #425（fix-425-6e2f29bb.ts）と同じ。Nominatim（四所神社 35.6260329,134.8075983／御所の湯 35.6258955,134.8073963／城崎麦わら細工伝承館 35.6255072,134.8087109／
 *   一の湯 35.6261621,134.8095333／まんだら湯 35.6244562,134.8057307／城崎温泉ロープウェイ 35.6240048,134.8005895／温泉寺 35.6239477,134.8004408）、
 *   OSM/Overpass（柳湯 way 300742117 35.6264213,134.8102224／大谿川 way 83407149 の一の湯の前の点 35.6259626,134.8096811）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-439-93f54d3e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "93f54d3e-8bd4-4352-90e0-8f28dae8492d";
const DAY1_ID = "ae096ee9-cd46-4275-892c-16cd9ce55375";
const GOSHO = "9447807e-293c-4792-9955-91a54f01caf9";
const ROPEWAY = "1e7b3be3-f4b3-4fc6-8c0e-360ef87168c3";
const ICHI = "0a7ebd50-7d71-437f-9ed4-72a75ac04717";
const RIVER = "大谿川の柳並木";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "柳並木と外湯めぐり、城崎温泉ゆかたさんぽ日帰りプラン";
const DESCRIPTION =
  "温泉の守護神の四所神社と外湯の御所の湯から、麦わら細工伝承館、大谿川の柳並木、一の湯をめぐり、午後はロープウェイで山頂へ。温泉寺にお参りしたら、午後から開くまんだら湯と柳湯へ。ゆかたと下駄で城崎温泉を歩く日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("四所神社", 9, 0, 20, null, null, 35.626033, 134.807598, "兵庫県豊岡市城崎町湯島",
    "旅の始まりは、外湯の「御所の湯」の隣に建つ四所神社へ。城崎温泉の氏神・温泉の守護神として信仰されてきた神社で、和銅元年（708年）、日生下権守が神託を受けて四柱の明神をまつったのが始まりとされます。温泉の守護神の湯山主神と、水の守護神でもある宗像三女神をまつり、本殿と拝殿は兵庫県の登録有形文化財です。本殿の裏から湧き出る「延命水」も名水として知られています。" + RESPECT),
  upd(GOSHO, 9, 25, 50, "walk", 2, 35.625896, 134.807396,
    "四所神社のすぐ隣の御所の湯へ。南北朝時代の歴史物語「増鏡」に、文永4年（1267年）に後堀河天皇の姉・安嘉門院がこの地の湯に入ったという記事があることから、「御所の湯」と名付けられました。館内には但馬の山をイメージしたキンキマメザクラやミツバツツジなどが植えられ、裏山を借景にした開放感のある露天風呂があります。外湯ごとに休みの日が違うので、公式の案内で確かめておきましょう。いくつもの湯をめぐるときは、長湯を避けて、こまめに水分をとりましょう。" + BATH),
  cre("城崎麦わら細工伝承館", 10, 20, 40, "walk", 5, 35.625507, 134.808711, "兵庫県豊岡市城崎町湯島",
    "御所の湯から歩いてすぐ。大麦のわらを原料に、桐箱や色紙に細工を施す「城崎麦わら細工」には300年の歴史があり、兵庫県の伝統的工芸品、豊岡市の無形文化財に指定されています。江戸時代後期に来日した医師シーボルトが持ち帰った資料「シーボルト・コレクション」にも収められ、明治時代にはセントルイス万国博覧会で最高名誉賞牌を受けたとされます。白壁の土蔵を生かした館内で、今の職人の作品や、明治・大正・昭和初期の作品を見られます。"),
  cre(RIVER, 11, 5, 25, "walk", 2, 35.625963, 134.809681, "兵庫県豊岡市城崎町湯島",
    "温泉街の真ん中を流れる大谿川（おおたにがわ）沿いを、ゆかたで歩きましょう。柳並木と石造りの太鼓橋が続く川沿いの風情は、小説の神様と呼ばれた志賀直哉にも愛されました。志賀直哉は何度も城崎温泉を訪れていて、柳並木はもちろん、春の桜や冬の雪景色と、季節ごとに違う風情を見せてくれます。雨や雪の日は足元が滑りやすいので、下駄で歩くときは気をつけましょう。"),
  upd(ICHI, 11, 35, 45, "walk", 2, 35.626162, 134.809533,
    "大谿川沿いの一の湯へ。江戸時代中期にできたころは「新湯（あらゆ）」と呼ばれていましたが、江戸時代の名医・香川修徳が著書「一本堂薬選」で「城崎新湯は天下一」とたたえたことから、「一の湯」と名を改めました。「一の湯」の名は、この「天下一」に由来するとされます。" + BATH + "このあと、温泉街で昼食にしましょう。"),
  upd(ROPEWAY, 13, 30, 50, "walk", 15, 35.624005, 134.80059,
    "昼食のあとは、城崎温泉ロープウェイで山頂駅へ。山頂からは、外湯めぐりで知られる城崎の町並みと、遠くに日本海までの眺めが広がります。運転の時間は公式の案内で確かめましょう。帰りは、途中の温泉寺駅で降りて温泉寺にお参りします。"),
  cre("温泉寺", 14, 25, 35, "other", 5, 35.623948, 134.800441, "兵庫県豊岡市城崎町湯島985-2",
    "ロープウェイの温泉寺駅は、温泉寺にお参りするためにつくられた駅です。温泉寺は、養老4年（720年）に城崎温泉を開いた道智上人によって、天平10年（738年）に開かれた寺です。道智上人は養老元年（717年）に城崎の地を訪れ、四所明神のお告げによって一千日の修行を行い、その功徳で温泉が湧き出したと伝えられます（今のまんだら湯）。「末代山温泉寺」の山号・寺号は、聖武天皇から「城崎温泉の守護寺」として賜ったものとされます。" + RESPECT),
  cre("まんだら湯", 15, 15, 45, "other", 15, 35.624456, 134.805731, "兵庫県豊岡市城崎町湯島",
    "温泉寺駅からロープウェイで下りて、まんだら湯へ。道智上人が一千日の間、八曼陀羅経というお経を唱え続けたところ、満願して霊湯が湧き出したのが城崎温泉の始まりとされ、その仏縁から「まんだら湯」と名付けられました。建物は昔から唐破風の様式で、裏山の自然を眺めながら入る露天風呂が人気です。まんだら湯と柳湯は、午後から開く外湯です。" + BATH),
  cre("柳湯", 16, 10, 30, "walk", 10, 35.626421, 134.810222, "兵庫県豊岡市城崎町湯島",
    "まんだら湯から歩いて、柳湯へ。中国の名勝・西湖から移した柳の木の下から湯が湧き出たことから、「柳湯」と名付けられました。外湯の中ではいちばん小さな湯ですが、風情があって人気です。" + BATH + "城崎温泉のゆかたさんぽを、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [GOSHO, ROPEWAY, ICHI].join()) throw new Error("構成が想定と違います");
  const goshoPhotos = days[0].spots[0].photos;
  if (goshoPhotos.length !== 1 || !goshoPhotos[0].sourceUrl?.includes("Kinosaki_onsen02_1920.jpg")) throw new Error("御所の湯の写真が想定と違います");
  console.log(`付け替える写真: ${goshoPhotos[0].id}（表紙と同じ: ${it.thumbnailUrl === goshoPhotos[0].url}）`);
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
      const river = await tx.spot.findMany({ where: { dayId: DAY1_ID, name: RIVER }, select: { id: true } });
      if (river.length !== 1) throw new Error("大谿川の柳並木のスポットが見つかりません");
      await tx.photo.update({ where: { id: goshoPhotos[0].id }, data: { spotId: river[0].id } });
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

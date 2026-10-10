/**
 * #105 66d185f1 朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元はD1 朝霧高原1か所(10:00〜11:20)・D2 ふもとっぱら1か所(09:30〜10:30)で、
 * 4か所未満・開始・終了とも決まりに合っていなかった。朝霧高原一帯の実在の
 * 行き先を追加し、D1 4か所(9:00〜16:31)・D2 4か所(9:00〜16:36)に組み直した。
 * あわせて元の文章のツアーガイド口調(皆様/本日ご案内するのは/ご堪能ください/
 * お楽しみいただけたことでしょう)もサイト標準の口調に直した。
 *
 * 当初、D2に富士花鳥園を候補として調べていたが、2025年1月から休園中で
 * 運営会社が破産・敷地の賃貸借契約も解除され、2026年10月現在も再開のめどが
 * 立っていないことがWebSearchで判明したため、現在営業中の朝霧自然公園
 * (朝霧アリーナ)に差し替えた。
 *
 * 地理的に、既存の朝霧高原・ふもとっぱらは隣接する「中央エリア」にあり、
 * まかいの牧場・白糸の滝・陣馬の滝・富士ミルクランドは、そこから車で
 * 10分前後南の「南エリア」にまとまっている。南エリア4か所をすべてD1に、
 * 中央エリアの既存2か所+新規2か所(朝霧自然公園・道の駅朝霧高原)をD2にする
 * ため、朝霧高原をD1からD2へ付け替えた(D2の最初に置き、ふもとっぱらは
 * 元のままD2に残す)。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 白糸の滝: 35.312991,138.5872234 / まかいの牧場: 35.3378773,138.5839866
 * - 富士ミルクランド: 35.3404594,138.5942772 / 陣馬の滝: 35.3659994,138.5611042
 * - 朝霧自然公園(朝霧アリーナ): 35.3841912,138.5839223
 * - 道の駅朝霧高原: 35.4138052,138.5908566
 *
 * 開いたURL(事実確認):
 * - 白糸の滝(幅200m・高さ20m・2013年世界遺産構成資産・音止の滝とあわせ名勝天然記念物): https://ja.wikipedia.org/wiki/%E7%99%BD%E7%B3%B8%E3%81%AE%E6%BB%9D_(%E9%9D%99%E5%B2%A1%E7%9C%8C)
 * - まかいの牧場(動物ふれあい・乳搾り・バター作り体験): https://fujinomiya.gr.jp/guide/86/
 * - 陣馬の滝(源頼朝の巻狩り由来・滝つぼに近づける穴場): https://ja.wikipedia.org/wiki/%E9%99%A3%E9%A6%AC%E3%81%AE%E6%BB%9D
 * - 富士ミルクランド(酪農テーマパーク): https://fujiyamasan.com/fujimilkland/
 * - 朝霧自然公園/朝霧アリーナ(芝生広場・展望デッキ): https://fujinomiya.gr.jp/guide/2019/
 * - 富士花鳥園の休園状況(2025年1月休園・運営会社破産・2026年10月現在再開未定): 複数の観光メディア記事で確認
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHIRAITO_MEMO =
  "旅の1日目は、白糸の滝から始まります。富士山の雪解け水が、水を通しやすい新富士火山層と通しにくい古富士火山層の境目から湧き出し、幅およそ200m、高さおよそ20mの崖一面に、何百もの筋になって流れ落ちる滝です。細い流れが幾重にも連なるさまが、白い糸を垂らしたように見えることが名前の由来と伝えられています。隣接する音止の滝とあわせて、国の名勝・天然記念物に指定され、平成25年(2013)には、世界文化遺産「富士山-信仰の対象と芸術の源泉」の構成資産にも登録されました。滝つぼ周辺は足元が滑りやすいため、十分注意しながら眺めましょう。この後は、車でおよそ8分、まかいの牧場へ向かいましょう。";

const MAKAINO_MEMO =
  "白糸の滝から車でおよそ8分、まかいの牧場に着きます。羊や山羊、牛、うさぎ、ラマなど、さまざまな動物とふれあえる体験型の牧場です。乳搾りや子牛へのミルクやり、バターやチーズづくりなど、食にまつわる体験も豊富にそろっています。濃厚なジャージー牛のソフトクリームは、ここでの人気の一品です。ここで昼食にしましょう。この後は、車でおよそ3分、富士ミルクランドへ向かいましょう。";

const MILKLAND_MEMO =
  "まかいの牧場から車でおよそ3分、富士ミルクランドに着きます。放牧でしぼった牛乳や、自社工房で作るチーズ・ジェラートが味わえる酪農テーマパークです。動物とのふれあいや乳搾り体験もでき、敷地内には乳製品を販売するショップやレストラン、花畑なども点在しています。この後は、車でおよそ10分、陣馬の滝へ向かいましょう。";

const JINBA_MEMO =
  "富士ミルクランドから車でおよそ10分、陣馬の滝に着きます。源頼朝が、かつてこの地で富士の巻狩りを行った際に陣を張ったことが、名前の由来と伝えられています。富士山の伏流水が湧き出す小さな滝で、滝つぼのすぐそばまで近づける、静かな穴場として親しまれています。足元が滑りやすい場所もあるため、気をつけて歩きましょう。1日目はここまでです。今夜はこの近くの宿に泊まります。";

const ASAGIRIKOGEN_MEMO =
  "2日目は、朝霧高原から歩き始めます。富士山の西麓、標高およそ700から1000メートルに広がる高原地帯で、5月から8月にかけて朝夕に霧が発生しやすいことが、この名前の由来と伝えられています。建久4年(1193)、源頼朝がこの地で大規模な巻狩り「富士の巻狩り」を行ったという記録も残る、古くから人と自然が共生してきた土地です。今では全国有数の酪農地帯として知られ、広大な牧草地でホルスタイン種の牛がのびのびと放牧される風景が広がっています。富士山を間近に望む雄大な景色を眺めてみてください。この後は、車でおよそ3分、朝霧自然公園へ向かいましょう。";

const ARENA_MEMO =
  "朝霧高原から車でおよそ3分、朝霧自然公園に着きます。「朝霧アリーナ」とも呼ばれる、芝生の広場が広がる公園です。音楽イベントなどの会場としても使われ、展望デッキからは、富士山とゆったりとした高原の風景を一望できます。この後は、車でおよそ6分、ふもとっぱらへ向かいましょう。";

const FUMOTOPPARA_MEMO =
  "朝霧自然公園から車でおよそ6分、ふもとっぱらに着きます。毛無山のふもとに広がる広大な草原で、かつて東京農業大学の研修農場として使われていた土地が、平成16年(2004)に返還されたことをきっかけに、富士山を望む体験型の宿泊・休暇施設として生まれ変わりました。さかのぼれば戦国時代には金の採掘が行われ、山崩れのあとは植林によって今の姿に育てられてきたという、長い歴史を持つ土地でもあります。さえぎるものが何もない草原の向こうに、富士山がそびえる開放的な景色は、朝霧高原の中でも人気の高い眺めとして親しまれています。昨日の牧場めぐりとはまた違う、雄大な草原の富士山を眺めてみてください。この後は、車でおよそ7分、道の駅朝霧高原へ向かいましょう。";

const MICHINOEKI_MEMO =
  "ふもとっぱらから車でおよそ7分、道の駅朝霧高原に着きます。国道139号沿いにある道の駅で、展望デッキからは、裾野まで広がる富士山の姿を間近に望めます。地元の牛乳やチーズ、朝霧高原産の野菜などを扱う直売所や、乳製品を使ったスイーツの店が並び、最後の休憩にぴったりの場所です。高原1泊2日の旅はこれで終わりです。帰りは、新富士駅・富士宮駅方面へ、バスまたは車でお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66d185f1%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const asagirikogen = await findSpotInItinerary(itinId, { spotName: "朝霧高原" });
  const fumotoppara = await findSpotInItinerary(itinId, { spotName: "ふもとっぱら" });

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "白糸の滝",
        address: "静岡県富士宮市上井出",
        lat: 35.312991,
        lng: 138.5872234,
        memo: SHIRAITO_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 210,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "まかいの牧場",
        address: "静岡県富士宮市猪之頭",
        lat: 35.3378773,
        lng: 138.5839866,
        memo: MAKAINO_MEMO,
        visitTime: t(12, 38),
        stayDurationMin: 150,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "富士ミルクランド",
        address: "静岡県富士宮市上井出",
        lat: 35.3404594,
        lng: 138.5942772,
        memo: MILKLAND_MEMO,
        visitTime: t(15, 11),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "陣馬の滝",
        address: "静岡県富士宮市猪之頭",
        lat: 35.3659994,
        lng: 138.5611042,
        memo: JINBA_MEMO,
        visitTime: t(16, 11),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      id: asagirikogen.id,
      data: { memo: ASAGIRIKOGEN_MEMO, visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      create: {
        name: "朝霧自然公園",
        address: "静岡県富士宮市猪之頭",
        lat: 35.3841912,
        lng: 138.5839223,
        memo: ARENA_MEMO,
        visitTime: t(10, 13),
        stayDurationMin: 60,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      id: fumotoppara.id,
      data: { memo: FUMOTOPPARA_MEMO, visitTime: t(11, 19), stayDurationMin: 210, transitMode: "car", transitDurationMin: 6, transitLine: null },
    },
    {
      create: {
        name: "道の駅朝霧高原",
        address: "静岡県富士宮市根原",
        lat: 35.4138052,
        lng: 138.5908566,
        memo: MICHINOEKI_MEMO,
        visitTime: t(14, 56),
        stayDurationMin: 100,
        transitMode: "car",
        transitDurationMin: 7,
        transitLine: null,
      },
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
    // 朝霧高原をday2へ付け替える。ふもとっぱらの既存order_noと衝突しないよう、
    // 一旦大きな番号に退避してから付け替える
    await tx.spot.update({ where: { id: asagirikogen.id }, data: { dayId: day2.id, orderNo: 9999 } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

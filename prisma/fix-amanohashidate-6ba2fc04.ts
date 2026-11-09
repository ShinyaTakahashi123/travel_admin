/**
 * 天橋立(6ba2fc04)の組み直し(2026-11-04)。企画運営・法務の2回のレビュー指摘を反映した最終版。
 * - 傘松公園・伊根の舟屋の点を直す(他の正しい本番の値にそろえる)
 * - 伊根の舟屋⇔丹後由良の移動を20分→37分に直す(OSRM車+5分。点のせいでなく元から誤り)
 * - 傘松公園→伊根の移動を other(ケーブルカーで下る)4分+car19分に分ける(府中駅way491221765からの
 *   OSRM13.7分+5の上限で19分。開始を9:15→9:22にしたので後ろの時刻は変わらない)
 * - 回る順番はそのまま(傘松→伊根→由良→…)。由良のあとに文珠へ直行し、昼食を別スポットに分け、
 *   「天橋立」は文珠側の入口(小天橋・廻旋橋、地理院地名検索。OSMに橋そのものの地物がなく
 *   案内板のみのため7章の例外)の点で独立スポットとして残す
 * - 文珠(昼食)の点は5b2a965fの「文珠の門前」と同じ(店の点でなく智恵の輪前)にそろえる
 * - 智恩寺の点を文殊堂智恩寺way683935012(35.5586839,135.1840746、制作補助2確認)に直す(c5aee4db・5b2a965fと同じ点)
 * - 傘松公園の開幕にレンタカー手続き(15分)とケーブルカー(約4分、丹後海陸交通公式tankai.jpで通年営業を確認)を追加
 * - ちりめん街道の帰りにレンタカー返却までの分(16分、OSRM+5)を追加
 * - 智恩寺のメモ: 「三文殊のひとつに数えられる」→「ひとつとされる」(ぼかし)、祈りの一文を決まりの形に
 * 企画運営・法務のOK(2026-11-04、2回目)に基づく。確認モード(既定)→--commitで書き込み。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "6ba2fc04-8dad-4976-8246-d9789086a8c5";
const DAY_ID = "21a21c5c-e3c4-4893-a0a9-8b099aa2288e";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KASAMATSU_ID = "245aabdc-c083-45e9-92a9-cb096efcff8d";
const INE_ID = "5eade09a-dd7c-431a-8ed9-d59a47d6171e";
const YURA_ID = "a985a629-2827-4670-b9d7-6d418b01c606";
const HASHIDATE_ID = "3f62f981-c5ce-403d-8ed3-9e2aeb691917"; // 旧「天橋立」を文珠側の点に組み直して再利用
const CHIONJI_ID = "82b5da69-bb41-4c44-b73b-c3a62a64fa15";
const CHIRIMEN_SHOKKI_ID = "766ebd05-9cb2-44dd-8c68-d3613127c89a";
const KAYA_EKISHA_ID = "5706e58c-e508-487a-8e10-73c8c80fc406";
const CHIRIMEN_KAIDO_ID = "80dac465-f38e-41e0-83ec-7fd3ff607b15";

// 直す前の値(前提チェック用)
const BEFORE = {
  [KASAMATSU_ID]: { lat: "35.586337", lng: "135.195935", visitTime: "09:00" },
  [INE_ID]: { lat: "35.67494", lng: "135.289437", visitTime: "10:15" },
  [YURA_ID]: { lat: "35.515877", lng: "135.279412", visitTime: "11:28", legMin: 20 },
  [HASHIDATE_ID]: { lat: "35.569361", lng: "135.191528", visitTime: "12:13", stay: 79, legMin: 15 },
  [CHIONJI_ID]: { lat: "35.557877", lng: "135.184531", visitTime: "13:50", legMin: 18 },
  [CHIRIMEN_SHOKKI_ID]: { visitTime: "14:45" },
  [KAYA_EKISHA_ID]: { visitTime: "15:29" },
  [CHIRIMEN_KAIDO_ID]: { visitTime: "16:09" },
};

const KASAMATSU_MEMO =
  "天橋立駅でレンタカーを借り(手続きに15分ほど)、ケーブルカー乗り場まで車でおよそ14分、ケーブルカーで山上まで約4分で、旅の始まりの傘松公園に着きます。天橋立を北側から見下ろす展望公園です。展望台へと続く道の途中にある「傘松」という名の松にちなんで名づけられたと伝えられ、明治33年(1900年)ごろ、地元の人物が展望台を開いたのが始まりといわれています。股の間から景色をのぞき込むと、天と海が逆さまになり、天橋立が天に向かって舞い上がる龍のように見えることから「昇龍観」と呼ばれています。ここは「股のぞき」発祥の地としても知られる場所です。この後は、ケーブルカーで下っておよそ4分、車でおよそ19分、伊根の舟屋へ向かいましょう。";

const INE_MEMO =
  "傘松公園からケーブルカーで下っておよそ4分、車でおよそ19分、伊根の舟屋に着きます。1階が船のガレージ、2階が住居という、全国的にも珍しい建築様式の家並みが海際に立ち並ぶ漁村です。もとは山の中腹に住居を構えていた集落でしたが、18世紀ごろ、漁をしやすいように海のすぐそばへ家を移し、舟屋を建てるようになったと伝えられています。現在も約230軒の舟屋が軒を連ね、2005年には漁村としては全国で初めてとされる国の重要伝統的建造物群保存地区に選定されました。舟屋は今も人が暮らす住まいです。敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。";

const YURA_MEMO =
  "伊根の舟屋から車でおよそ37分、丹後由良に着きます。若狭湾に面したこの浜は、森鷗外の小説『山椒大夫』の舞台とされる地です。人買いにさらわれた姉弟・安寿と厨子王が、この地の長者・山椒大夫のもとで苦役を強いられたという物語が伝わっています。浜の西側には、幼い安寿が来る日も来る日も海水を汲んで運ばされたという「汐汲浜」が今も残り、物語の悲しい記憶をとどめています。この後は、車でおよそ17分、文珠へ向かいましょう。";

const MONJU_MEMO =
  "丹後由良から車でおよそ17分、文珠に着きます。天橋立の南の玄関口にあたる文珠地区は、食事処や土産物店が並ぶにぎやかな一帯です。ここで昼食にしましょう。この後は、歩いておよそ3分、天橋立へ向かいましょう。";

const HASHIDATE_MEMO =
  "文珠から歩いておよそ3分、小天橋(廻旋橋)のたもとに着きます。智恩寺側と天橋立の松並木をつなぐこの橋は、大型船が通るときに橋自体が回転する仕組みで知られています。ここから、白砂に黒松が連なる全長およそ3.6kmの砂州、天橋立が始まります。安芸の宮島・陸奥の松島とともに日本三景の一つとされ、その成り立ちについて『丹後国風土記』は、伊弉諾尊(イザナギノミコト)が天への通い路として架けた梯子が、寝ている間に倒れて海に横たわり、今の姿になったと伝えています。松並木の中を少し歩いて、砂州の上からの眺めを楽しんだら、もとの道を戻りましょう。この後は、歩いておよそ3分、智恩寺へ向かいましょう。";

const CHIONJI_MEMO =
  "小天橋から歩いておよそ3分、文珠地区にある智恩寺に着きます。「切戸の文殊」とも呼ばれ、奈良・安倍文殊院、山形・大聖寺とともに日本三文殊のひとつとされる寺です。伝承によれば大同3年(808)、平城天皇の勅願によって開かれ、延喜4年(904)に醍醐天皇から「天橋山智恩寺」の寺号を賜ったと伝えられています。本堂には、知恵を授ける文殊菩薩として知られる秘仏(国の重要文化財)が安置され、境内の多宝塔も室町時代に建てられた国の重要文化財です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ20分、ちりめん織機展示・実演場へ向かいましょう。";

const CHIRIMEN_KAIDO_MEMO =
  "加悦鉄道資料館から歩いておよそ5分、ちりめん街道に着きます。丹後ちりめんと京都を結ぶ流通の拠点として栄えた町並みで、明治・大正・昭和にかけて建てられた織物工場や土蔵、町家が今も軒を連ねています。享保7年(1722)、京都・西陣で学んだ技術が加悦に持ち帰られたのが、丹後ちりめんの始まりと伝えられています。重要伝統的建造物群保存地区に指定された通りを歩きながら、ちりめん産業で栄えた町の面影を感じてみましょう。今も人が暮らす町並みですので、家の敷地に入らず、静かに歩きましょう。日本三景・天橋立を股のぞきで楽しむ丹後さんぽはこれで終わりです。帰りは、天橋立駅まで車でおよそ16分、レンタカーを返却しましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { include: { spots: { include: { transitLegs: true }, orderBy: { orderNo: "asc" } } } } },
  });
  const day = itin.days.find((d) => d.id === DAY_ID)!;
  const byId = new Map(day.spots.map((s) => [s.id, s]));

  for (const [id, before] of Object.entries(BEFORE)) {
    const s = byId.get(id);
    if (!s) throw new Error(`前提確認: スポット ${id} が見つかりません`);
    if ("lat" in before && (s.lat?.toString() !== before.lat || s.lng?.toString() !== before.lng)) {
      throw new Error(`前提確認: ${s.name} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    }
    const vt = s.visitTime ? s.visitTime.toISOString().slice(11, 16) : null;
    if (vt !== before.visitTime) throw new Error(`前提確認: ${s.name} のvisitTimeが期待と不一致 (now ${vt})`);
    if ("stay" in before && s.stayDurationMin !== before.stay) throw new Error(`前提確認: ${s.name} の滞在が期待と不一致`);
    if ("legMin" in before) {
      const leg = s.transitLegs[0];
      if (!leg || leg.transitDurationMin !== before.legMin) throw new Error(`前提確認: ${s.name} の入りの移動分が期待と不一致`);
    }
  }
  console.log("前提の確認OK。8スポット(既存)の値が期待どおりでした。\n");

  console.log("=== 直す内容(2026-11-04 法務・企画運営の2回目の指摘を反映) ===");
  console.log("1. 傘松公園: 点 35.586759,135.195117(他の2本と同じ、way683931922)、開始 09:22(手続き15分・車10分・ケーブルカー4分)");
  console.log("2. 傘松→伊根の移動を other(ケーブルカーで下る)4分+car19分に分ける(府中駅way491221765からOSRM13.7分+5の上限で19分)。伊根の舟屋: 点 35.674672,135.291455(道の駅 舟屋の里伊根 way435212369)、住所 京都府与謝郡伊根町亀島459、到着 10:30(開始を9:22にしたため変わらず)");
  console.log("3. 丹後由良: 伊根の舟屋からの移動 20分→37分(OSRM車+5)、到着 12:00、この後の行き先を文珠(車17分)に変更");
  console.log("4. [新規]文珠(昼食): 点を智恵の輪前(5b2a965fの「文珠の門前」と同じ点、店の点ではない)35.558285,135.184808に変更、到着 12:47、滞在40分");
  console.log("5. 天橋立(組み直し): 点は小天橋(廻旋橋、地理院地名検索。OSMに橋そのものの地物がなく案内板のみのため7章の例外)35.557851,135.185481、文珠から歩き3分、到着 13:30、滞在79分→25分(内容に合わせ縮小)");
  console.log("6. 智恩寺: 点を35.558684,135.184075(文殊堂智恩寺way683935012、c5aee4db・5b2a965fと同じ)に変更。天橋立からの移動 車15分→歩き3分、到着 13:58。「日本三文殊のひとつに数えられる」→「ひとつとされる」、祈りの一文を決まりの形に");
  console.log("7〜8. ちりめん織機展示・実演場・加悦駅舎: 時刻のみ後ろにずれる(内容・移動分は変更なし)");
  console.log("9. ちりめん街道: 到着 16:17、帰りの一文に「車でおよそ16分」を追加(OSRM+5)\n");

  console.log("=== 新しい並び・時刻・移動 ===");
  const plan = [
    { name: "傘松公園", visitTime: "09:22", stay: 45, leg: null as null | { mode: string; min: number }[] },
    { name: "伊根の舟屋", visitTime: "10:30", stay: 53, leg: [{ mode: "other(ケーブルカー)", min: 4 }, { mode: "car", min: 19 }] },
    { name: "丹後由良", visitTime: "12:00", stay: 30, leg: [{ mode: "car", min: 37 }] },
    { name: "文珠(昼食・新規)", visitTime: "12:47", stay: 40, leg: [{ mode: "car", min: 17 }] },
    { name: "天橋立(小天橋)", visitTime: "13:30", stay: 25, leg: [{ mode: "walk", min: 3 }] },
    { name: "智恩寺", visitTime: "13:58", stay: 35, leg: [{ mode: "walk", min: 3 }] },
    { name: "ちりめん織機展示・実演場", visitTime: "14:53", stay: 40, leg: [{ mode: "car", min: 20 }] },
    { name: "加悦駅舎", visitTime: "15:37", stay: 35, leg: [{ mode: "walk", min: 4 }] },
    { name: "ちりめん街道", visitTime: "16:17", stay: 30, leg: [{ mode: "walk", min: 5 }] },
  ] as { name: string; visitTime: string; stay: number; leg: null | { mode: string; min: number }[] }[];
  for (const p of plan) {
    const legStr = p.leg ? p.leg.map((l) => l.mode + l.min + "分").join("+") : "なし・1か所目";
    console.log(`  ${p.name}: 着 ${p.visitTime} 滞在${p.stay}分 発 (前の移動: ${legStr})`);
  }
  console.log("  → 帰り: 天橋立駅まで車およそ16分(文中のみ、スポットなし)");
  console.log("  昼食(文珠)着 12:47 (11:30〜13:30に収まる) / 最後(ちりめん街道)発 16:47 (16:30〜17:00に収まる)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await setDaySpotOrder(
    DAY_ID,
    [
      {
        id: KASAMATSU_ID,
        data: {
          lat: "35.586759",
          lng: "135.195117",
          address: "京都府宮津市大垣",
          visitTime: T(9, 22),
          memo: KASAMATSU_MEMO,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        id: INE_ID,
        data: {
          lat: "35.674672",
          lng: "135.291455",
          address: "京都府与謝郡伊根町亀島459",
          visitTime: T(10, 30),
          memo: INE_MEMO,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "other", transitDurationMin: 4 },
              { orderNo: 2, transitMode: "car", transitDurationMin: 19 },
            ],
          },
        },
      },
      {
        id: YURA_ID,
        data: {
          visitTime: T(12, 0),
          memo: YURA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 37 }] },
        },
      },
      {
        create: {
          name: "文珠",
          address: "京都府宮津市文珠",
          lat: "35.558285",
          lng: "135.184808",
          visitTime: T(12, 47),
          memo: MONJU_MEMO,
          stayDurationMin: 40,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 17 }] },
        },
      },
      {
        id: HASHIDATE_ID,
        data: {
          lat: "35.557851",
          lng: "135.185481",
          address: "京都府宮津市字文珠",
          visitTime: T(13, 30),
          stayDurationMin: 25,
          memo: HASHIDATE_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        id: CHIONJI_ID,
        data: {
          lat: "35.558684",
          lng: "135.184075",
          visitTime: T(13, 58),
          memo: CHIONJI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        id: CHIRIMEN_SHOKKI_ID,
        data: { visitTime: T(14, 53) },
      },
      {
        id: KAYA_EKISHA_ID,
        data: { visitTime: T(15, 37) },
      },
      {
        id: CHIRIMEN_KAIDO_ID,
        data: { visitTime: T(16, 17), memo: CHIRIMEN_KAIDO_MEMO },
      },
    ],
    {}
  );

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

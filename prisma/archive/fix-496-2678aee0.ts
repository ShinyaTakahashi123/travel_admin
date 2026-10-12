/**
 * #496 2678aee0「万座毛と沖縄美ら海水族館、恩納村と沖縄本島北部をめぐるレンタカー2泊3日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 13:00〜17:00 / 3か所 09:50〜15:15 / 2か所 09:30〜13:15 で、昼食の一言がなく、季節が空。座喜味城跡の「標高127m」が公式（120m余）と違い、
 *   万座毛は「岩肌が県の天然記念物」「象の鼻」「住所 仲泊1583」が公式と合わず、水族館のアクリルパネル・ギネスの数字は確かめられなかった
 * 車の旅（那覇空港の近くで借りて、3日目の夕方に返す）。宿は2泊とも恩納村
 * 1日目: 座喜味城跡 9:00 → ユンタンザミュージアム → やちむんの里 → 残波岬 → 真栄田岬 → おんなの駅（昼食）→ 万座毛 → ナビービーチ 16:30
 * 2日目: 沖縄美ら海水族館 9:00 → 海洋博公園（昼食）→ 備瀬のフクギ並木 → 古宇利島 → 今帰仁城跡 16:30（入園17:30まで）
 * 3日目: 谷茶ビーチ 9:00 → 琉球村（9:30から）→ 美浜アメリカンビレッジ（昼食）→ 中城城跡 → 中村家住宅 → 壺屋やちむん通り 16:50 → 那覇空港
 * 本文の出典: 読谷村 https://www.yomitan-kankou.jp/tourist/watch/1611289699/ （座喜味城跡）・/1769581604/（残波岬）・/1611319504/（やちむんの里 19の工房）・
 *   https://www.vill.yomitan.okinawa.jp/soshiki/bunka_shinko/gyomu/shisetsu/museum/1416.html （ユンタンザミュージアム 2018年）／
 *   恩納村 http://www.vill.onna.okinawa.jp/sp/about/information/1484719566/1484720252/ （真栄田岬）・https://www.vill.onna.okinawa.jp/about/facility/1624949830/ （万座毛 高さ20m・名の由来）・
 *   https://www.okinawastory.jp/spot/1388 （万座毛 1726年・植物群落が県の天然記念物）・https://onnanoeki.com/ （おんなの駅）／
 *   https://churaumi.okinawa/ ・https://www.motobu-ka.com/tourist_info/tourist_info-post-699/ （水族館 2002年11月・黒潮の海・ジンベエザメ・ナンヨウマンタ）・https://oki-park.jp/kaiyohaku/ （海洋博公園）・
 *   https://www.motobu-ka.com/tourist_info/tourist_info-post-687/ （フクギ並木 約1km）／https://www.nakijinson.jp/spot.php?id=22&ct=1 （古宇利大橋 2005年・1960m）・https://www.nakijinjoseki-osi.jp/history.php （今帰仁城跡）／
 *   https://love.chatan.jp/en/topic/mihama-american-village/ （美浜）・https://www.nakagusuku-jo.jp/history （中城城跡 14世紀中頃・1440年護佐丸・6つの郭・1972年国史跡・2000年世界遺産）・
 *   https://www.nakamurahouse.jp/house/ （中村家住宅 18世紀中頃・1972年重文）・https://www.okinawastory.jp/feature/yachimun/sanpo_tsuboya （壺屋 石畳400m・空港から車で約20分）
 * 開く時間（本文には書かない）: ユンタンザ 9:00〜18:00 水曜休／水族館 8:30〜18:30／今帰仁城跡 8:00〜18:00（入園は閉園30分前まで）／琉球村 9:30〜17:00／中城城跡 8:30〜17:00（5〜9月は18:00）／おんなの駅 10:00〜19:00
 * 座標の出典: OSM（Nominatim）— 座喜味城 way 218648820（城跡）／やちむんの里 way 189820919／残波岬 node 602936534／真栄田岬 node 1993614070（展望所）／おんなの駅 way 189820922／
 *   海洋博公園 relation 6210772／備瀬 node 8302121367（集落の点）／中城城 way 380564626（入口の券売所）／中村家住宅 way 461093135／アメリカンビレッジ node 4443303792／琉球村 way 396210563。
 *   推定: ユンタンザミュージアムは国土地理院の住所検索（座喜味708、番地の点）、壺屋やちむん通りは国土地理院（壺屋一丁目の点）。万座毛・ナビービーチ・水族館・今帰仁城跡・古宇利島・谷茶ビーチは前の値
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-496-2678aee0.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2678aee0-3924-4922-9b0d-c0a7608729f2";
const DAY_IDS = ["b33ea49c-21c4-4a28-92f4-b118610b7417", "934d2cfb-af38-4283-b802-b2c991573f54", "d22062ef-c211-4546-9450-1eaeedcb41b0"];
const ID = {
  zakimi: "2fe2650e-48e1-42ff-84cd-df107c558a59",
  manzamo: "1219bd99-de46-43a2-8084-ff13bafe2ca7",
  nabee: "7d544b42-f9e3-48bf-a667-00544ab68c2c",
  churaumi: "8a33c9e3-253d-4c3e-a2d0-28c1da4ac00a",
  nakijin: "b6a39e38-4af4-4069-bf49-30c1fad3b353",
  kouri: "49c1beb2-2b72-4192-ae50-193397f4037f",
  ryukyumura: "b9b6b0a2-5270-4851-acc5-ab7aa8a99d34",
  tancha: "4d3cfff5-6bd9-4248-9c71-efd4bc9401d4",
};
const EXPECTED = [[ID.zakimi, ID.manzamo, ID.nabee], [ID.churaumi, ID.nakijin, ID.kouri], [ID.ryukyumura, ID.tancha]];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "1日目は世界遺産の座喜味城跡とユンタンザミュージアム、やちむんの里、残波岬、真栄田岬をめぐり、万座毛とナビービーチへ。2日目は沖縄美ら海水族館と海洋博公園、備瀬のフクギ並木、古宇利大橋を渡る古宇利島、世界遺産・今帰仁城跡へ。3日目は琉球村から美浜を経て、護佐丸ゆかりの中城城跡と中村家住宅、那覇の壺屋やちむん通りへ。恩納村に泊まり、レンタカーでめぐる沖縄本島の2泊3日です。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY1 = [
  upd(ID.zakimi, { h: 9, m: 0, stay: 45, mode: null, min: null, lat: 26.4084548, lng: 127.7416072, address: "沖縄県中頭郡読谷村字座喜味708-6",
    memo: "この旅はレンタカーでめぐります。那覇空港の近くで車を借りて、北へ約1時間の読谷村へ。座喜味城跡は、琉球王国が日本や中国、東南アジアとの交易で栄えた15世紀の初めに、築城の名人として知られる読谷山按司・護佐丸が築いた城の跡です。標高120m余りの丘の上にあり、もっとも高い所からは読谷村のほぼ全域を見渡せます。二つの郭からなり、アーチの石門と、重厚で美しい曲線を描く城壁が見どころです。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城壁の上は柵のない所もあるので足元に気をつけ、立ち入りできない場所には入らないようにしましょう。" }),
  cre("世界遺産座喜味城跡ユンタンザミュージアム", { h: 9, m: 50, stay: 45, mode: "walk", min: 5, lat: 26.408573, lng: 127.741501, address: "沖縄県中頭郡読谷村字座喜味708-6",
    memo: "城跡の入口にある読谷村の博物館で、平成30年（2018年）に開館しました。座喜味城跡のガイダンスのほか、読谷村の歴史や民俗文化、美術工芸、自然を紹介しています。休館日は公式の案内で確かめましょう。" }),
  cre("やちむんの里", { h: 10, m: 45, stay: 35, mode: "car", min: 10, lat: 26.4069025, lng: 127.7542655, address: "沖縄県中頭郡読谷村字座喜味",
    memo: "ミュージアムから車で約10分。「やちむん」は沖縄の言葉で焼き物のことで、19の工房が集まる焼き物の里です。工房はそれぞれ独立して営業していて、営業時間や休みも工房ごとに違うので、公式の案内で確かめましょう。工房のまわりでは、作業の邪魔にならないよう静かに見学しましょう。" }),
  cre("残波岬", { h: 11, m: 35, stay: 35, mode: "car", min: 15, lat: 26.4404961, lng: 127.7119195, address: "沖縄県中頭郡読谷村",
    memo: "やちむんの里から車で約15分。高さ30m前後の断崖が約2kmにわたって続く岬で、先には地上から灯塔の頂部まで約31mの白い灯台が立ちます。沖縄本島で夕日が最後に沈む場所としても知られます。岩場は足元が悪いので歩きやすい靴で歩き、台風などで波や風が強い日は、波打ち際に近づかないようにしましょう。" }),
  cre("真栄田岬", { h: 12, m: 25, stay: 30, mode: "car", min: 15, lat: 26.4439064, lng: 127.7720512, address: "沖縄県国頭郡恩納村字真栄田",
    memo: "残波岬から車で約15分。琉球石灰岩が隆起してできた、サンゴ礁の台地の険しい海岸で、岬の先には丸い岩がそびえ、その真下にコバルトブルーの海が広がります。ダイビングやシュノーケルの場所としても知られ、「青の洞窟」には多くの人が訪れます。泳がない人も、展望台から海を眺められます。海に入るときはライフジャケットなどを着け、現地の決まりに従いましょう。" }),
  cre("おんなの駅 なかゆくい市場", { h: 13, m: 5, stay: 55, mode: "car", min: 10, lat: 26.4362065, lng: 127.7947433, address: "沖縄県国頭郡恩納村字仲泊1656-9",
    memo: "真栄田岬から車で約10分。恩納村の島野菜や南国のフルーツ、伝統工芸品などを並べる直売の市場で、飲食の店もいくつか入っています。ここで昼食にしましょう。" }),
  upd(ID.manzamo, { h: 14, m: 20, stay: 40, mode: "car", min: 20, lat: 26.505, lng: 127.850278, address: "沖縄県国頭郡恩納村字恩納2767",
    memo: "おんなの駅から北へ車で約20分。1726年にこの地を訪れた琉球国王・尚敬が「万人を座らせるに足る」とほめたたえたことが、名の由来と伝えられます。高さ約20mの琉球石灰岩の断崖の上に芝生の台地が広がり、晴れた日は水平線まで見渡せます。石灰岩の上に育つ植物の群落は、沖縄県の天然記念物に指定されています。断崖の上は柵の内側を歩き、崖のふちには近づかないようにしましょう。" }),
  upd(ID.nabee, { h: 15, m: 10, stay: 80, mode: "car", min: 10, lat: 26.502327, lng: 127.858359, address: "沖縄県国頭郡恩納村字恩納419-4",
    memo: "万座毛から車で約10分。恩納海浜公園にあるビーチで、沖合からは万座毛を海側から眺められます。泳ぐときは、決められた遊泳区域と監視員のいる時間を守り、泳げる時期や時間は公式の案内で確かめましょう。夏はクラゲに気をつけ、現地の案内に従いましょう。今夜は恩納村に泊まります。" }),
];

const DAY2 = [
  upd(ID.churaumi, { h: 9, m: 0, stay: 120, mode: null, min: null, lat: 26.694369, lng: 127.878038, address: "沖縄県国頭郡本部町字石川424",
    memo: "2日目は、恩納村から北へ車で約1時間の本部町へ。海洋博公園の中にある沖縄美ら海水族館は、2002年11月に開館しました。「沖縄の海との出会い」をテーマに、南西諸島や黒潮の海に生きる生き物を紹介しています。大きな水槽「黒潮の海」では、世界最大の魚・ジンベエザメや、世界で初めて繁殖に成功したとされるナンヨウマンタを見られます。" }),
  cre("海洋博公園", { h: 11, m: 5, stay: 85, mode: "walk", min: 5, lat: 26.689698, lng: 127.8766766, address: "沖縄県国頭郡本部町字石川424",
    memo: "水族館のまわりに広がる国営の公園で、昭和50年（1975年）に開かれた沖縄国際海洋博覧会を記念して、その跡地に整えられました。エメラルドビーチや熱帯ドリームセンター、おきなわ郷土村などがあり、レストランもあるので、ここで昼食にしましょう。日差しの強い日は、帽子をかぶり、水分をとって熱中症に気をつけましょう。" }),
  cre("備瀬のフクギ並木", { h: 12, m: 40, stay: 45, mode: "car", min: 10, lat: 26.7030437, lng: 127.8843892, address: "沖縄県国頭郡本部町字備瀬",
    memo: "公園の北どなり、備瀬の集落へ車で約10分。防風林として家を取り囲むように植えられたフクギが連なり、備瀬崎までのおよそ1kmの並木道になっています。かつての沖縄の集落の様子と、ゆったりとした時間の流れを感じられます。今も人が暮らす集落なので、家の敷地には入らず、静かに歩きましょう。" }),
  upd(ID.kouri, { h: 14, m: 0, stay: 60, mode: "car", min: 35, lat: 26.713784, lng: 128.01484, address: "沖縄県国頭郡今帰仁村古宇利",
    memo: "フクギ並木から車で約35分。古宇利島へは、2005年に開通した全長1960mの古宇利大橋を渡ります。沖縄本島の周辺ではもっとも長い橋の一つとされ、橋の上からは青いグラデーションの海が広がります。島の北側のティーヌ浜には、2つの岩が並ぶ「ハートロック」があります。岩場は滑りやすく、潮が満ちると足場がなくなることがあるので、潮の時間に気をつけましょう。" }),
  upd(ID.nakijin, { h: 15, m: 25, stay: 65, mode: "car", min: 25, lat: 26.692208, lng: 127.927919, address: "沖縄県国頭郡今帰仁村字今泊5101",
    memo: "古宇利島から車で約25分。琉球王国が統一される前、北山王の居城だった城の跡です。14世紀には怕尼芝・珉・攀安知の三人の王が現れ、1416年（1422年とする説もあります）に中山の尚巴志に滅ぼされました。その後は北部を治める監守の居城として使われ、1609年の薩摩の琉球侵攻で城は炎上したとされます。世界遺産「琉球王国のグスク及び関連遺産群」の一つです。城壁の上や石段では足元に気をつけましょう。帰りは恩納村まで車で約1時間。今夜も恩納村に泊まります。" }),
];

const DAY3 = [
  upd(ID.tancha, { h: 9, m: 0, stay: 20, mode: null, min: null, lat: 26.464243, lng: 127.830719, address: "沖縄県国頭郡恩納村字谷茶",
    memo: "最終日は、宿の近くの谷茶ビーチを朝のうちに歩きましょう。恩納村の谷茶にある白い砂浜のビーチです。泳ぐときは、決められた遊泳区域と監視員のいる時間を守りましょう。" }),
  upd(ID.ryukyumura, { h: 9, m: 35, stay: 90, mode: "car", min: 15, lat: 26.4296258, lng: 127.7753141, address: "沖縄県国頭郡恩納村字山田1130",
    memo: "谷茶ビーチから車で約15分。沖縄各地の古い民家を移して、昔ながらの沖縄の集落の景色を再現した施設で、国の登録有形文化財の古民家も並びます。エイサーなどの沖縄の芸能の公演や、昔ながらの手仕事の体験もできます。公演の時間は公式の案内で確かめましょう。" }),
  cre("美浜アメリカンビレッジ", { h: 11, m: 40, stay: 75, mode: "car", min: 35, lat: 26.3165214, lng: 127.7573637, address: "沖縄県中頭郡北谷町美浜",
    memo: "琉球村から南へ車で約35分の北谷町美浜。買い物やライブ、食事を一度に楽しめる観光スポットで、異国の雰囲気の街並みが特徴です。ここで昼食にしましょう。" }),
  cre("中城城跡", { h: 13, m: 25, stay: 85, mode: "car", min: 30, lat: 26.2856398, lng: 127.803301, address: "沖縄県中頭郡北中城村",
    memo: "美浜から車で約30分。14世紀の中ごろに築かれ始めた城で、1440年、王の命によって護佐丸が、1日目に訪ねた座喜味グスクから移り、三の郭と北の郭を増やしました。六つの郭が連なる城で、自然の岩や地形を生かした美しい曲線の城壁と、石積みの技が見どころです。昭和47年（1972年）に国の史跡となり、2000年に世界遺産「琉球王国のグスク及び関連遺産群」に登録されました。城跡には護佐丸の墓もあるので、静かに、敬意をもって見学しましょう。石段や城壁の上では足元に気をつけてください。" }),
  cre("中村家住宅", { h: 15, m: 0, stay: 45, mode: "car", min: 10, lat: 26.2896109, lng: 127.8005416, address: "沖縄県中頭郡北中城村字大城106",
    memo: "中城城跡から車で約5分。18世紀の中ごろに建てられたと伝えられる沖縄の伝統的な住まいで、母屋（ウフヤ）や離れ（アシャギ）、高倉、豚小屋（フール）、家畜小屋を兼ねた納屋（メーヌヤー）などが残り、石垣とフクギの防風林に囲まれています。昭和47年（1972年）に国の重要文化財に指定されました。見学できる時間は公式の案内で確かめましょう。" }),
  cre("壺屋やちむん通り", { h: 16, m: 20, stay: 30, mode: "car", min: 35, lat: 26.21303, lng: 127.69162, address: "沖縄県那覇市壺屋1丁目",
    memo: "中村家住宅から車で約35分の那覇市壺屋へ。石畳の道が400mほど続き、昔ながらの風情のある町並みが残る焼き物の町で、窯元や工房が今も営まれています。戦争の被害が少なかった壺屋には、焼き物にかかわる文化財も残ります。石畳は滑りやすいので足元に気をつけましょう。帰りは車で約20分の那覇空港へ向かい、車を返します。運転に気をつけましょう。3日間の沖縄の旅はここまでです。" }),
];

const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.map((d) => d.id).join() !== DAY_IDS.join()) throw new Error("日の構成が想定と違います");
  it.days.forEach((d, i) => {
    if (d.spots.map((s) => s.id).join() !== EXPECTED[i].join()) throw new Error(`${i + 1}日目のスポットが想定と違います`);
  });
  const days = [DAY1, DAY2, DAY3];
  days.forEach((arr, i) => {
    console.log(`\n${i + 1}日目 ${arr.length}か所`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      const name = "id" in x ? `${Object.keys(ID).find((k) => ID[k as keyof typeof ID] === x.id)}(既存)` : (d.name as string);
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  });
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: ["spring", "summer", "autumn", "winter"] } });
      for (let i = 0; i < 3; i++) await setDaySpotOrder(DAY_IDS[i], days[i] as never, { tx });
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

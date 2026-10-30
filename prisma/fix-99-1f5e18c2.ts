/**
 * #99 維新ふるさと館と天文館、幕末の記憶と鹿児島グルメの1泊2日 の初日・最終日の見直し。
 *
 * 初日: 1か所目が09:30と早すぎたので、入口(鹿児島中央駅、市電で高見橋電停へ)から
 * 組み直し、10:45開始・16:48終了に(10:45〜11:45・16:30〜17:00の範囲)。歩きの区間は
 * routing.openstreetmap.de/routed-foot の道のり(m)÷75m/分で測り直した。座標を6か所
 * 直したところ(下記)、前後の分数も大きく変わった(西郷南洲顕彰館→南洲神社は、顕彰館の
 * 点が384mずれていたため10分→1分に)。
 *
 * 座標の直し(法務の確認、2026-10-30): 照国神社way1412930611・鹿児島市立美術館
 * way304380174・西郷隆盛像node2289002536(tourism=artwork、もとの点は交差点名のみで
 * OSMの点ではなかった)・黎明館relation7452097・城山展望台node589671404・
 * 西郷南洲顕彰館node14128699583。維新ふるさと館・私学校跡・南洲神社はもとから一致。
 *
 * 2日目(1泊2日の最終日): 桜島は、湯之平展望所でなく溶岩なぎさ遊歩道・足湯に変更
 * (企画運営の判断、天文館↔桜島の移動が重いため)。桜島港↔足湯は、routed-footの
 * 経路データに抜けがあり遠回りで出たため、るるぶ公式(https://rurubu.jp/andmore/spot/80041778)
 * の「徒歩10分」を使用(企画運営・法務の確認済み、#20淡輪と同じ扱い)。仙巌園の座標に
 * 684mの誤りを発見(逆引きすると吉野町の無関係な道路上の点だった)、tourism=museumの
 * 正しい点(node1309677433)に直したところ、桜島→仙巌園・仙巌園→尚古集成館の移動も
 * 大きく短くなった。これにより、6か所とも外さず、仙巌園の滞在だけ14分短縮(100→86分)で
 * 終了16:35(見直す前と同じ)に収まった。
 *
 * フェリーの出典: 鹿児島市公式ページ「片道15分かかります。」
 * (https://www.city.kagoshima.lg.jp/soumu/shichoshitu/kokusai/ja/traffic/ferry.html)。
 * 鹿児島港フェリーターミナル↔仙巌園は、バスの時刻表が確認できなかったため、法務の
 * 指摘でタクシーに変更(router.project-osrm.org の車の道のり7.7分+5分=約13分)。
 * 鹿児島市立美術館のカフェ「Sweet William Cafe ArtSound」(1階、10-17時)は公式ページで
 * 確認(https://www.city.kagoshima.lg.jp/artmuseum/cafe.html。メモには店名は書かない)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-99-1f5e18c2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-99-1f5e18c2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ISHINFURUSATOKAN_ID = "727b6605-6813-4500-aae4-fd6d21b5639d";
const TERUKUNIJINJA_ID = "1faac2db-d19f-4c51-b255-550680cccaeb";
const BIJUTSUKAN_ID = "4ece185e-b846-4e94-a6a8-07561d34deeb";
const SAIGODOZO_ID = "3728de81-058e-43cd-bb45-702aa0e88cbf";
const REIMEIKAN_ID = "576569f1-c8ed-4d5a-970b-46910a8d9689";
const SHIGAKKOATO_ID = "9a88dc19-4cde-43ce-96ed-4500993f5dc7";
const SHIROYAMA_ID = "01c372fb-4095-47f3-a1bd-d2ad63ff34e9";
const SAIGONANSHUKENSHOKAN_ID = "edcbfb27-8586-41b7-a9ce-685a996098b5";
const NANSHUJINJA_ID = "f8820c0a-41f4-4813-b93f-76e22731a195";

const TENMONKAN_ID = "bcd9ed34-2248-4a92-a0a8-03e4790abca6";
const SAKURAJIMA_ID = "23cc2abd-db07-4902-b2cc-65a40468d1be";
const SENGANEN_ID = "200816b5-93fa-4019-985d-835351d05d7a";
const SHOKOSHUSEIKAN_ID = "80e39879-fea5-4cfa-9b1c-dd3d83fffbb2";
const IJINKAN_ID = "94443b50-84df-47bb-a16e-2c407a53b631";
const TAGAYAMAKOEN_ID = "391dd09f-ab05-4b68-8d43-366f7dadd710";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: ISHINFURUSATOKAN_ID, h: 10, m: 45 },
  { id: TERUKUNIJINJA_ID, h: 11, m: 58 },
  { id: BIJUTSUKAN_ID, h: 12, m: 34 },
  { id: SAIGODOZO_ID, h: 13, m: 14 },
  { id: REIMEIKAN_ID, h: 13, m: 36 },
  { id: SHIGAKKOATO_ID, h: 14, m: 31 },
  { id: SHIROYAMA_ID, h: 15, m: 1 },
  { id: SAIGONANSHUKENSHOKAN_ID, h: 15, m: 42 },
  { id: NANSHUJINJA_ID, h: 16, m: 18 },
  { id: TENMONKAN_ID, h: 9, m: 30 },
  { id: SAKURAJIMA_ID, h: 10, m: 43 },
  { id: SENGANEN_ID, h: 12, m: 31 },
  { id: SHOKOSHUSEIKAN_ID, h: 14, m: 3 },
  { id: IJINKAN_ID, h: 14, m: 58 },
  { id: TAGAYAMAKOEN_ID, h: 16, m: 0 },
];

const STAY_UPDATES: { id: string; label: string; min: number }[] = [
  { id: ISHINFURUSATOKAN_ID, label: "維新ふるさと館", min: 50 },
  { id: TERUKUNIJINJA_ID, label: "照国神社", min: 30 },
  { id: BIJUTSUKAN_ID, label: "鹿児島市立美術館", min: 38 },
  { id: SAIGODOZO_ID, label: "西郷隆盛銅像", min: 15 },
  { id: REIMEIKAN_ID, label: "黎明館", min: 50 },
  { id: SHIGAKKOATO_ID, label: "私学校跡", min: 15 },
  { id: SHIROYAMA_ID, label: "城山展望台", min: 30 },
  { id: SAIGONANSHUKENSHOKAN_ID, label: "西郷南洲顕彰館", min: 35 },
  { id: SENGANEN_ID, label: "仙巌園", min: 86 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: TERUKUNIJINJA_ID, label: "照国神社", lat: 31.594481, lng: 130.550593 },
  { id: BIJUTSUKAN_ID, label: "鹿児島市立美術館", lat: 31.595836, lng: 130.553402 },
  { id: SAIGODOZO_ID, label: "西郷隆盛像", lat: 31.595244, lng: 130.553628 },
  { id: REIMEIKAN_ID, label: "黎明館", lat: 31.598627, lng: 130.554519 },
  { id: SHIROYAMA_ID, label: "城山展望台", lat: 31.596265, lng: 130.550087 },
  { id: SAIGONANSHUKENSHOKAN_ID, label: "西郷南洲顕彰館", lat: 31.605938, lng: 130.558178 },
  { id: SENGANEN_ID, label: "仙巌園", lat: 31.618387, lng: 130.580372 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number; mode?: string }[] = [
  { spotId: TERUKUNIJINJA_ID, label: "維新ふるさと館→照国神社", min: 23 },
  { spotId: BIJUTSUKAN_ID, label: "照国神社→美術館", min: 6 },
  { spotId: SAIGODOZO_ID, label: "美術館→西郷隆盛像", min: 2 },
  { spotId: REIMEIKAN_ID, label: "西郷隆盛像→黎明館", min: 7 },
  { spotId: SHIGAKKOATO_ID, label: "黎明館→私学校跡", min: 5 },
  { spotId: SHIROYAMA_ID, label: "私学校跡→城山展望台", min: 15 },
  { spotId: SAIGONANSHUKENSHOKAN_ID, label: "城山展望台→西郷南洲顕彰館(タクシー)", min: 11, mode: "taxi" },
  { spotId: NANSHUJINJA_ID, label: "西郷南洲顕彰館→南洲神社", min: 1 },
  { spotId: SAKURAJIMA_ID, label: "天文館→桜島(足湯)", min: 43 },
  { spotId: SENGANEN_ID, label: "桜島→仙巌園(徒歩+フェリー+タクシー)", min: 38 },
  { spotId: SHOKOSHUSEIKAN_ID, label: "仙巌園→尚古集成館", min: 6 },
  { spotId: IJINKAN_ID, label: "尚古集成館→異人館", min: 5 },
  { spotId: TAGAYAMAKOEN_ID, label: "異人館→多賀山公園", min: 22 },
];

const SAKURAJIMA_MEMO =
  "天文館から歩いて約18分の鹿児島港フェリーターミナルへ。フェリーで約15分、桜島港に着いたら、歩いて約10分の溶岩なぎさ遊歩道へ向かいましょう(あわせて約43分)。鹿児島港と桜島を結ぶ桜島フェリーは24時間運航しているのも特徴です。大正3年(1914)の噴火で流れ出た溶岩が、桜島の西側の袴腰地区の海岸を覆い、今はクロマツなどの木々が生い茂る溶岩台地になっています。「溶岩なぎさ遊歩道」は、袴腰地区と烏島展望所を結ぶ全長3kmの道で、海に浸かって急冷した溶岩の様子を間近に見ることができます。道沿いには句碑も多く、桜島を詠んだ歌を探しながら歩くのも楽しめます。隣接する「桜島溶岩なぎさ公園足湯」は、地下1000mから湧く天然温泉を使った無料の足湯で、歩き疲れた足を休めることができます。港からバスで行ける湯之平展望所などの高台もあります。火山の活動によって、立ち入れる場所が変わることがあります。出かける前に、鹿児島市などの公式の情報を確かめましょう。迫力ある活火山の姿を、間近で感じましょう。";

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: ISHINFURUSATOKAN_ID,
    label: "維新ふるさと館(入口の一文)",
    find: "本日は、幕末維新の記憶をたどる旅、維新ふるさと館からスタートです。",
    replace: "鹿児島中央駅に10:38ごろ着いたら、市電で約2分の高見橋電停へ。電停から歩いて約5分。本日は、幕末維新の記憶をたどる旅、維新ふるさと館からスタートです。",
  },
  {
    id: ISHINFURUSATOKAN_ID,
    label: "維新ふるさと館(終わりの一文)",
    find: "見学を終えたら、歩いて照国神社へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ23分の照国神社へ向かいましょう。",
  },
  {
    id: TERUKUNIJINJA_ID,
    label: "照国神社(書き出し)",
    find: "維新ふるさと館を見学したら、歩いて照国神社へ向かいましょう。",
    replace: "維新ふるさと館から歩いておよそ23分、照国神社に着きます。",
  },
  {
    id: TERUKUNIJINJA_ID,
    label: "照国神社(終わりの一文)",
    find: "参拝を終えたら、歩いて鹿児島市立美術館へ向かいましょう。",
    replace: "参拝を終えたら、歩いておよそ6分の鹿児島市立美術館へ向かいましょう。",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "美術館(書き出し・昼食)",
    find: "照国神社を参拝したら、歩いて鹿児島市立美術館へ向かいましょう。",
    replace: "照国神社から歩いておよそ6分、鹿児島市立美術館に着きます。館内のカフェなどで、昼食もとりましょう。",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "美術館(終わりの一文)",
    find: "見学を終えたら、歩いて西郷隆盛銅像へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ2分の西郷隆盛像へ向かいましょう。",
  },
  {
    id: SAIGODOZO_ID,
    label: "西郷隆盛像(書き出し)",
    find: "鹿児島市立美術館を見学したら、歩いて西郷隆盛銅像へ向かいましょう。",
    replace: "鹿児島市立美術館から歩いておよそ2分、西郷隆盛像に着きます。",
  },
  {
    id: SAIGODOZO_ID,
    label: "西郷隆盛像(終わりの一文)",
    find: "見学を終えたら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ7分の鹿児島県歴史・美術センター黎明館へ向かいましょう。",
  },
  {
    id: REIMEIKAN_ID,
    label: "黎明館(書き出し・昼食削除)",
    find: "西郷隆盛銅像を見学したら、歩いて鹿児島県歴史・美術センター黎明館へ向かいましょう。到着したら、まずこのあたりの食事処で昼食をとり、それから見学するとよいでしょう。島津家の居城「鶴丸城」の本丸跡に立つ、",
    replace: "西郷隆盛像から歩いておよそ7分、鹿児島県歴史・美術センター黎明館に着きます。島津家の居城「鶴丸城」の本丸跡に立つ、",
  },
  {
    id: REIMEIKAN_ID,
    label: "黎明館(終わりの一文)",
    find: "見学を終えたら、道を挟んですぐ向かいの私学校跡へ向かいましょう。",
    replace: "見学を終えたら、道を挟んで歩いておよそ5分の私学校跡へ向かいましょう。",
  },
  {
    id: SHIGAKKOATO_ID,
    label: "私学校跡(書き出し)",
    find: "黎明館のすぐ向かい、道を挟んですぐの場所にあるのが私学校跡です。",
    replace: "黎明館の道を挟んだ向かい、歩いておよそ5分の場所にあるのが私学校跡です。",
  },
  {
    id: SHIGAKKOATO_ID,
    label: "私学校跡(終わりの一文)",
    find: "続いては、歩いておよそ8分の城山展望台へ向かいましょう。",
    replace: "続いては、歩いておよそ15分の城山展望台へ向かいましょう。",
  },
  {
    id: SHIROYAMA_ID,
    label: "城山展望台(書き出し)",
    find: "私学校跡からは歩いておよそ8分です。",
    replace: "私学校跡からは歩いておよそ15分です。",
  },
  {
    id: SHIROYAMA_ID,
    label: "城山展望台(終わりの一文)",
    find: "見学を終えたら、バスで西郷南洲顕彰館へ向かいましょう。",
    replace: "見学を終えたら、バスの乗り継ぎがわかりにくいためタクシーを利用します。タクシーでおよそ11分、西郷南洲顕彰館へ向かいましょう。",
  },
  {
    id: SAIGONANSHUKENSHOKAN_ID,
    label: "西郷南洲顕彰館(書き出し)",
    find: "城山展望台を見学したら、バスで西郷南洲顕彰館へ向かいましょう。",
    replace: "城山展望台からは、タクシーでおよそ11分です。",
  },
  {
    id: SAIGONANSHUKENSHOKAN_ID,
    label: "西郷南洲顕彰館(終わりの一文)",
    find: "続いては、歩いておよそ5分の南洲神社・南洲墓地へ向かいましょう。",
    replace: "続いては、歩いておよそ1分の南洲神社・南洲墓地へ向かいましょう。",
  },
  {
    id: NANSHUJINJA_ID,
    label: "南洲神社(書き出し・祈り・お墓の一文)",
    find: "西郷南洲顕彰館からは歩いておよそ5分です。南洲神社・南洲墓地は、西南戦争で西郷隆盛とともに散った薩軍将士が眠る墓地と、西郷を祭神として祀る神社です。西郷隆盛自身の墓を中心に、身分の上下を問わず、同じ大きさの墓石が整然と並ぶ光景は、西郷の人柄を今に伝えています。西郷の命日にあわせた慰霊祭が、今も毎年営まれています。西郷隆盛をはじめ多くの薩軍将士が眠る墓所ですので、境内では静かに、敬意をもってお参りください。",
    replace: "西郷南洲顕彰館からは歩いておよそ1分です。南洲神社・南洲墓地は、西南戦争で西郷隆盛とともに散った薩軍将士が眠る墓地と、西郷を祭神として祀る神社です。西郷隆盛自身の墓を中心に、身分の上下を問わず、同じ大きさの墓石が整然と並ぶ光景は、西郷の人柄を今に伝えています。西郷の命日にあわせた慰霊祭が、今も毎年営まれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。お墓のまわりでは、静かに過ごしましょう。",
  },
  {
    id: TENMONKAN_ID,
    label: "天文館(宿からの行き方)",
    find: "2日目は、天文館からスタートです。",
    replace: "2日目は、宿のある鹿児島市内から市電で約8分の天文館通電停へ。天文館からスタートです。",
  },
  {
    id: TENMONKAN_ID,
    label: "天文館(終わりの一文)",
    find: "散策を終えたら、フェリーで桜島へ向かいましょう。",
    replace: "散策を終えたら、歩いて鹿児島港フェリーターミナルへ。フェリーで桜島へ向かいましょう(あわせて約43分)。",
  },
  {
    id: SAKURAJIMA_ID,
    label: "桜島(本文の書き換え)",
    find: "天文館を散策したら、フェリーで桜島へ向かいましょう。鹿児島港と桜島を結ぶ桜島フェリーは、およそ15分の船旅で、24時間運航しているのも特徴です。今なお活動を続ける活火山で、北岳4合目、標高およそ373mにある湯之平展望所は、一般が立ち入れる桜島最高地点です。荒々しい山肌や噴煙のほか、眼下に広がる錦江湾と鹿児島の市街地を一望できます。溶岩でできた海岸沿いの「溶岩なぎさ遊歩道」を歩くのもおすすめです。火山の活動によって、立ち入れる場所が変わることがあります。出かける前に、鹿児島市などの公式の情報を確かめましょう。迫力ある活火山の姿を、間近で感じましょう。見学を終えたら、フェリーとバスで仙巌園へ向かいましょう。",
    replace: SAKURAJIMA_MEMO + "見学を終えたら、歩いて桜島港へ。フェリーとタクシーで仙巌園へ向かいましょう(あわせて約38分)。",
  },
  {
    id: SENGANEN_ID,
    label: "仙巌園(書き出し)",
    find: "桜島を見学したら、フェリーとバスで仙巌園へ向かいましょう。",
    replace: "溶岩なぎさ遊歩道から歩いて約10分の桜島港へ。フェリーで約15分、鹿児島港に渡りましょう。この区間は、タクシーを使うと便利です。タクシーで約13分の仙巌園に着きます(あわせて約38分)。",
  },
  {
    id: SENGANEN_ID,
    label: "仙巌園(終わりの一文)",
    find: "見学を終えたら、歩いて尚古集成館へ向かいましょう。",
    replace: "見学を終えたら、歩いておよそ6分の尚古集成館へ向かいましょう。",
  },
  {
    id: SHOKOSHUSEIKAN_ID,
    label: "尚古集成館(書き出し)",
    find: "仙巌園を見学したら、歩いて尚古集成館へ向かいましょう。",
    replace: "仙巌園から歩いておよそ6分、尚古集成館に着きます。",
  },
  {
    id: IJINKAN_ID,
    label: "異人館(書き出し)",
    find: "尚古集成館からは歩いておよそ4分です。",
    replace: "尚古集成館からは歩いておよそ5分です。",
  },
  {
    id: IJINKAN_ID,
    label: "異人館(終わりの一文)",
    find: "続いては、歩いておよそ13分の多賀山公園へ向かいましょう。",
    replace: "続いては、歩いておよそ22分の多賀山公園へ向かいましょう。",
  },
  {
    id: TAGAYAMAKOEN_ID,
    label: "多賀山公園(書き出し)",
    find: "異人館からは歩いておよそ13分です。",
    replace: "異人館からは歩いておよそ22分です。",
  },
  {
    id: TAGAYAMAKOEN_ID,
    label: "多賀山公園(帰りの一文)",
    find: "帰りは、バスでおよそ35分の鹿児島中央駅へ向かい、駅ビルでお土産を探したり、郷土料理を味わったりしてから、電車で帰路につきましょう。",
    replace: "見学を終えたら、歩いて約19分の鹿児島駅前電停へ。市電で約19分の鹿児島中央駅前へ戻り、駅ビルでお土産を探したり、郷土料理を味わったりしてから、電車で帰路につきましょう。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(MEMO_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #99 初日・最終日の見直し ===\n");
  console.log("[時刻]");
  for (const v of VISIT_TIMES) {
    console.log(`  ${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")}`);
  }
  console.log("\n[滞在(分)]");
  for (const s of STAY_UPDATES) {
    console.log(`  ${s.label}: ${s.min}分`);
  }
  console.log("\n[座標]");
  for (const c of COORD_UPDATES) {
    console.log(`  ${c.label}: ${c.lat},${c.lng}`);
  }
  console.log("\n[移動(分)]");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分${l.mode ? `(${l.mode})` : ""}`);
  }
  console.log("\n[メモ]");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 70));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    [
      ...VISIT_TIMES.map((v) => prisma.spot.update({ where: { id: v.id }, data: { visitTime: t(v.h, v.m) } })),
      ...STAY_UPDATES.map((s) => prisma.spot.update({ where: { id: s.id }, data: { stayDurationMin: s.min } })),
      ...COORD_UPDATES.map((c) => prisma.spot.update({ where: { id: c.id }, data: { lat: c.lat, lng: c.lng } })),
      ...LEG_UPDATES.map((l) =>
        prisma.spotTransitLeg.updateMany({
          where: { spotId: l.spotId },
          data: { transitDurationMin: l.min, ...(l.mode ? { transitMode: l.mode } : {}) },
        })
      ),
      ...ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })),
    ]
  );

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

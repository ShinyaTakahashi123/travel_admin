/**
 * #76(三朝温泉の河原風呂と温泉街、三徳山と倉吉もめぐる1泊2日、476fb1d7)の
 * 初日・最終日の見直し。
 *
 * Day2(最終日)は、09:00開始・16:33終了(三佛寺本堂→投入堂参拝登山→倉吉白壁
 * 土蔵群→打吹公園→飛龍閣→倉吉博物館)で、すでに決まり(16:30〜17:00)に合う
 * ため変更なし。移動もrouting.openstreetmap.de/router.project-osrm.orgで
 * 測り直し、すべて実測との差5分未満(ほぼ一致)か、決まりの「実測×1.5+5分」
 * 以内だったため変更なし。
 *
 * Day1(初日)は、座標の大きな誤りが見つかったため、全面的に組み直した。
 *
 * 【座標の誤り(法務・企画運営の確認)】「三朝橋」「三朝温泉木造旅館街」の
 * 座標(35.3928,133.9022)が、実際の三朝温泉の中心部(株湯・恋谷橋・三朝神社
 * などがある35.407〜35.411のあたり)から約1.6km離れた、まったく別の場所を
 * 指していた。三朝温泉観光協会の公式モデルコース(misasaonsen.jp/course/03/)
 * では、恋谷橋→三朝橋が「約5分・約420m」、株湯→恋谷橋が「約4分・約400m」
 * などとあり、これらはすべて徒歩5分程度の近さにあるはずだった。
 *
 * 【スポットの組み直し(企画運営の判断、2026-10-30)】
 * - 三朝橋・恋谷橋: OSM・地理院のどちらにも名前の点がなく、300m以内にも
 *   (三朝橋は)当てはまる地物がなかったため、スポットから外し、内容を
 *   近くのスポットのメモで紹介する
 * - 三朝神社: OSM・地理院に点がなく、300m以内の地物(株湯・木屋旅館・
 *   旅館中屋など)はいずれも今回の他のスポットと重複するため、スポットから
 *   外し、確かめられた事実(神の湯の手水舎)だけを近くのスポットのメモで
 *   紹介する(御神木・映画の舞台は、公式・準公式の出典で確かめられなかった
 *   ため含めない)
 * - 河原風呂: 地理院の地名「三朝温泉」(35.411547,133.894767)の点を、
 *   企画運営の例外として使用(OSMに河原風呂自体の点がなく、公式の文章でも
 *   「三朝橋のたもと」としか分からず、隣接する施設を特定できなかったため)
 * - 三朝温泉木造旅館街: 旅館中屋(OSM node7658491455、35.4099543,133.894555)
 * - 株湯: OSM way1307989745のNominatim値(35.4076218,133.8982651、
 *   現在値との差は約40m)
 * - 上流の歴史ある木造旅館の町並み: メモに名前がある木屋旅館(OSM
 *   way1308593671、35.4101611,133.8944526。現在値はdms-check.cjsで
 *   0.1秒刻みの疑いが出ていた)
 * - 三朝温泉本通り: OSM node6272358822「陣所の館」(35.4104137,133.8929773、
 *   現在値とほぼ同じ、実在確認済み)
 *
 * 【移動の測り直し(routing.openstreetmap.de/routed-foot)】座標を直した
 * ことで、区間もすべて測り直した: 河原風呂→木造旅館街 377m・約5分、
 * 木造旅館街→株湯 502m・約7分(もとの22分は誤った座標による誤差)、
 * 株湯→上流旅館街 534m・約7分、上流旅館街→本通り 167m・約2分。
 *
 * 【新しい時刻】入口はJR倉吉駅から日ノ丸バスで約20分(公式サイト
 * misasaonsen.jp/access/の確認、上井⇔三朝線)、三朝温泉に11:40ごろ着いて
 * 河原風呂へ(1か所目の時刻は10:45〜11:45の範囲内)。見どころは削らず、
 * 滞在もすべて無変更(座標・移動の直しだけで16:30〜17:00の範囲に収まった
 * ため、滞在を短縮する必要はなかった)。
 *   河原風呂11:40(60)→木造旅館街12:45(90、昼食)→株湯14:22(60)→
 *   上流旅館街15:29(20)→本通り15:51(45、〜16:36)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-76-476fb1d7.ts
 *   反映: npm run prod -- npx tsx prisma/fix-76-476fb1d7.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "e29b355b-5cf4-4df9-a042-fa82af1d8c9a";

const MISASABASHI_ID = "e8341155-a86d-4602-af6a-c2fc8e6f703d";
const KAWARABURO_ID = "218d138a-7b86-4b15-b767-fefa044f3bce";
const RYOKANGAI_ID = "64f8faac-4c44-4e6f-9118-3697c79b83aa";
const KABUYU_ID = "a2c7cce4-a251-4a46-9e5d-6daef28de601";
const KOITANIBASHI_ID = "08805456-5aa5-4b7d-8580-6a51e9fc46c7";
const JORYU_ID = "60838109-b289-4b0f-bec4-ab5b21538489";
const SANCHO_SHRINE_ID = "b32a3077-e0c9-40c9-96ac-4c585a700396";
const HONDORI_ID = "26a9fcf6-9b4f-44fc-bf5a-24d70172530e";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAWARABURO_MEMO =
  "JR倉吉駅に11時20分ごろ着いたら、日ノ丸バスで約20分の三朝温泉へ。河原風呂は、昭和9年(1934)に建てられた、建築家・武田五一が設計したと伝えられる三朝橋のたもとに、三朝川の河原に石を積んで作られた露天風呂です。利用できる時間は公式の案内で確かめましょう。男女の仕切りがほとんどない混浴の温泉で、水着の着用はできないため、タオルなどを用意しましょう。清掃の時間帯は利用できず、大雨や増水の際には入浴が制限されることもあります。川のせせらぎを聞きながら野趣あふれる湯を楽しめる、三朝温泉らしい体験です。三朝橋は、青みを帯びた御影石を使った鉄筋コンクリートの橋でありながら、擬宝珠付きの高欄など木橋を思わせる意匠が施されており、日本遺産の構成文化財にも選ばれています。橋の上や川沿いからも見える場所にあるため、入浴中の方にカメラを向けるのは絶対にやめましょう。長湯を避けて、こまめに水分をとりましょう。";

const RYOKANGAI_MEMO =
  "河原風呂からは歩いて5分ほどです。三朝温泉の温泉街には、三徳川の両岸に木造の旅館やホテルが軒を連ねています。石畳の通りには小さな旅館や飲食店、骨董店、土産物店が並び、昭和レトロな雰囲気を今に伝えています。周辺の飲食店で昼食をとりましょう。";

const KABUYU_MEMO =
  "三朝温泉木造旅館街からは歩いて約7分です。株湯は、三朝温泉発祥の湯として知られる共同浴場で、「元湯」とも呼ばれています。平安時代末期の長寛2年(1164)、源義朝の家臣・大久保左馬之祐が、三徳山への参拝の途中に助けた白狼の導きで温泉を発見したという伝説が伝えられています。公衆浴場のほか、足湯や飲泉場も併設されています。入浴の際は、ほかの入浴客を撮らないようにしましょう。長湯を避けて、こまめに水分をとりましょう。すぐそばに架かる恋谷橋は、川に住む龍神が引き裂いた若い男女の悲恋を供養するために架けられたと伝わる橋で、フランス大使が「ヴァレ・ドゥ・ラムール(恋の谷)」と命名したことから、この名で呼ばれるようになったといわれています。橋のたもとには、縁結びのかじか蛙像があり、撫でるとご縁を授かるといわれています。";

const JORYU_MEMO =
  "株湯から歩いて約7分です。株湯からさらに上流のこのあたりには、歴史ある木造旅館が立ち並んでいます。三徳川沿いには、昭和7年(1932)に完成した木造3階建ての旅館や、明治元年(1868)創業と伝えられる旅館など、国の登録有形文化財に登録された建物が並びます。今も営業を続ける旅館なので、外観の見学にとどめましょう。すぐ近くには三朝神社があり、手水舎に引かれた温泉水は「神の湯」と呼ばれています。";

const HONDORI_FIND = "三朝神社からは歩いて8分ほどです。";
const HONDORI_REPLACE = "上流の歴史ある木造旅館の町並みからは歩いて約2分です。";

async function main() {
  const commit = process.argv.includes("--commit");

  const hondori = await prisma.spot.findFirstOrThrow({ where: { id: HONDORI_ID } });
  if (!hondori.memo?.includes(HONDORI_FIND)) {
    console.log(`[想定と違います] 三朝温泉本通りに「${HONDORI_FIND}」が見つかりません。処理を中止します。`);
    return;
  }
  const newHondoriMemo = hondori.memo!.replace(HONDORI_FIND, HONDORI_REPLACE);

  console.log("=== #76 Day1: 座標の誤りを直し、全面的に組み直す ===\n");
  console.log("[三朝橋][恋谷橋][三朝神社] 削除(内容は近くのスポットのメモへ)");
  console.log(`[河原風呂] 新visitTime: 11:40  新stay: 60(無変更)  新lat/lng: 35.411547/133.894767(地理院「三朝温泉」、企画運営の例外)`);
  console.log(`[三朝温泉木造旅館街] 新visitTime: 12:45  新stay: 90(無変更)  新lat/lng: 35.4099543/133.894555(旅館中屋)  新leg: walk/5分`);
  console.log(`[株湯] 新visitTime: 14:22  新stay: 60(無変更)  新lat/lng: 35.4076218/133.8982651(OSM way1307989745)  新leg: walk/7分`);
  console.log(`[上流の歴史ある木造旅館の町並み] 新visitTime: 15:29  新stay: 20(無変更)  新lat/lng: 35.4101611/133.8944526(木屋旅館)  新leg: walk/7分`);
  console.log(`[三朝温泉本通り] 新visitTime: 15:51  新stay: 45(無変更、〜16:36)  新lat/lng: 35.4104137/133.8929773(陣所の館)  新leg: walk/2分`);
  console.log("  新memo:", newHondoriMemo);
  console.log(
    "\nDay1 新しい時刻: 河原風呂11:40(60)→木造旅館街12:45(90)→株湯14:22(60)→上流旅館街15:29(20)→本通り15:51(45、〜16:36)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      {
        id: KAWARABURO_ID,
        data: {
          visitTime: T(11, 40),
          stayDurationMin: 60,
          lat: 35.411547,
          lng: 133.894767,
          memo: KAWARABURO_MEMO,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        id: RYOKANGAI_ID,
        data: {
          visitTime: T(12, 45),
          stayDurationMin: 90,
          lat: 35.4099543,
          lng: 133.894555,
          memo: RYOKANGAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: KABUYU_ID,
        data: {
          visitTime: T(14, 22),
          stayDurationMin: 60,
          lat: 35.4076218,
          lng: 133.8982651,
          memo: KABUYU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        id: JORYU_ID,
        data: {
          visitTime: T(15, 29),
          stayDurationMin: 20,
          lat: 35.4101611,
          lng: 133.8944526,
          memo: JORYU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        id: HONDORI_ID,
        data: {
          visitTime: T(15, 51),
          stayDurationMin: 45,
          lat: 35.4104137,
          lng: 133.8929773,
          memo: newHondoriMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
    ],
    { remove: [MISASABASHI_ID, KOITANIBASHI_ID, SANCHO_SHRINE_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

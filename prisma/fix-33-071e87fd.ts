/**
 * #33(お寺めぐりと川下り、嵐山・嵯峨野をゆったり巡る旅)初日・最終日の見直し。
 *
 * - Day1: 清凉寺・宝筐院・落柿舎を外し、車折神社から開始(10:45〜11:45の枠)。法輪寺の
 *   あとに「渡月橋のあたりで昼食」を新設(寺社の滞在の中の昼食を解消)。渡月橋→大覚寺は
 *   徒歩30分かかるためタクシー(OSRM+5)に。
 * - Day2: 宝厳院を外し、大河内山荘庭園・御髪神社をDay3から移動。天龍寺のあとに
 *   「天龍寺の北門のあたりで昼食」を新設。区間が伸びた分、開始を8:30に。
 *   鹿王院60→45・天龍寺75→60・化野念仏寺50→40に短縮(もと以下)。
 * - Day3: 宿に近い祇王寺→二尊院→常寂光寺の順に変更(滝口寺を外す)。常寂光寺のあとに
 *   「南郷公園のあたりで昼食」を新設。保津川下りの点を嵐山側→亀岡側(#9と同じ乗船場)に
 *   変更し、13:00到着・120分(もとのまま)で15:00下船(2泊以上の最終日14:30〜15:00)。
 *   昼食の滞在(63分、新規スポットのため、もとの長さの決まりなし)で、乗船場に早めに
 *   着いて13:00の便を待つ分を吸収(法務2026-10-30 19:11の指摘どおり)。
 * - 座標はOSM(Nominatim)の値にそろえた。法務の再確認(2026-10-30 19:23)で、大河内山荘庭園
 *   (庭園のway677236682)・嵐山公園(案内図/面の中心は不可のため、名前のあるbus_stopノード
 *   7875952270)・嵐電嵐山駅(駅舎のway279279195)・19世紀ホール(museumのway183905436)・
 *   天龍寺(place_of_worshipのway409723494)・嵯峨鳥居本の町並み(attractionのnode5665665228)
 *   の6か所を再修正。周辺の徒歩分数も測り直した。
 * - 文の直し(法務19:21・19:23の指摘): 祈りの一文を「今も祈りが続く場所ですので、静かに、
 *   敬意をもってお参りしましょう。」の形にそろえ、野宮神社に祈りの一文を追加。化野念仏寺に
 *   「お墓のまわりでは、静かに過ごしましょう。」を追加。「おすすめ」「〜てください」の言い方
 *   を外す。「締めくくり」は旅の最後のスポット(保津川下り)だけに。宿の一文に分数を追加し、
 *   「嵐電の」のような路線名の表記を外す。
 *
 * 出典:
 * - 保津川下り「約2時間」: https://rurubu.jp/andmore/spot/80027551
 * - JR嵯峨嵐山→亀岡11分: https://ekitan.com/transit/fare/sf-5320/st-5099
 * - 車折神社駅→嵐山駅(嵐電)4分: https://ekitan.com/transit/fare/sf-5243/st-4848
 * - 各徒歩区間はrouting.openstreetmap.de/routed-footの実測(snap距離込み)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-33-071e87fd.ts
 *   反映: npm run prod -- npx tsx prisma/fix-33-071e87fd.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "071e87fd-03f9-4cdd-a3b5-170c62e6a807";
const DAY1_ID = "198fe3df-d8f0-43e0-bdef-90e622845099";
const DAY2_ID = "e82719e2-acc2-49aa-970f-c3ee108c7401";
const DAY3_ID = "cda11f65-848e-43e6-b0ec-7c024c888e27";

// Day1 既存スポット
const KURUMAZAKI = "b59870eb-1448-44c3-90b3-997108b5d629";
const HORINJI = "ce116b8a-7ad0-499d-b83b-a8ba4d1bbe8f";
const MONKEYPARK = "5559d2e5-7bee-4b56-b8e4-0ac9309ec46d";
const TOGETSUKYO = "82719e0e-ec86-4c02-8672-b6a4735775f7";
const DAIKAKUJI = "a3a099c9-6842-4a9b-9f95-5739f198ecdc";
const SEIRYOJI = "325d3486-2438-4445-9221-4f9081dc3333"; // 外す
const HOKYOIN = "7533586a-0a54-4488-8e67-d61faacc8588"; // 外す
const RAKUSHISHA = "599f0b84-312d-48d6-bb03-ac9a760b33f6"; // 外す

// Day2 既存スポット
const ARASHIYAMA_PARK = "5d5195e5-abd5-476f-9af1-c6763dc3d3cb";
const RANDEN_ARASHIYAMA = "873f1ce8-85dd-443c-b54f-750324ce5315";
const ROKUOIN = "d9286810-3aa3-45d2-ad11-39b81a712cd5";
const HALL19 = "12e0756b-7a32-4b4f-8c98-2d69e32e14f3";
const TENRYUJI = "e9b1cf7c-698d-4117-b44d-0fcc39f6b3c4";
const NONOMIYA = "f6b1201d-64ce-4913-a3ed-f3857be369b4";
const CHIKURIN = "7f1aa34c-9652-4bdc-af07-03716966e0b9";
const ADASHINO = "856dd078-43aa-4e82-a9a7-31b83e01b0ca";
const TORIIMOTO = "7a9b51dc-7451-452c-9771-ee52351f8117";
const HOGONIN = "630b7330-0c0c-4278-9b7a-f9cb69faa9d1"; // 外す

// Day3 既存スポット(移動分含む)
const OKOCHI = "6ca1b985-250c-43c2-9a0a-6d0313db451d"; // Day3→Day2
const MIKAMIJINJA = "ede18fbe-95b1-4be1-947e-2244d759b5ff"; // Day3→Day2
const JOJAKKOJI = "27ae374c-b6d9-4a11-aa95-bb094ec8e6ba";
const NISONIN = "b7b14710-4097-4b98-882a-a11e22a8156e";
const GIOJI = "9a2b8364-0bd3-4060-9fe3-5a1d3d38053d";
const HOZUGAWA = "5cf39540-e2f4-4806-b43e-260fff3b8d07";
const TAKIGUCHIDERA = "bea2f72c-348a-4993-a074-5496f436f1b4"; // 外す

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const commit = process.argv.includes("--commit");

  let preview = "";
  await prisma.$transaction(
    async (tx) => {
      // Day3→Day2 の日またぎ移動(先にdayIdを付け替える。(day_id,order_no)の一意制約に
      // ぶつからないよう、仮の大きな番号に退避してから移す)
      await tx.spot.update({ where: { id: OKOCHI }, data: { dayId: DAY2_ID, orderNo: 50001 } });
      await tx.spot.update({ where: { id: MIKAMIJINJA }, data: { dayId: DAY2_ID, orderNo: 50002 } });

      // ===== Day1 =====
      await setDaySpotOrder(
        DAY1_ID,
        [
          {
            id: KURUMAZAKI,
            data: {
              visitTime: t(11, 0),
              stayDurationMin: 25,
              lat: 35.015854,
              lng: 135.689088,
              memo: "1日目は、車折神社駅に10時58分ごろ着いたら、歩いておよそ2分の車折神社から旅を始めましょう。平安時代の学者・清原頼業を祀り、後嵯峨天皇の牛車の轅がこの前で突然折れたことから「車折」の名がついたと伝えられています。境内の「芸能神社」を彩る、俳優や歌手の名を記した朱塗りの玉垣も見どころ。急ぎ足では素通りしてしまいがちな神社ですが、ゆったり境内を歩いて、玉垣の名前を探してみるのも楽しみ方の一つです。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車折神社駅へ戻り、電車で法輪寺へ向かいましょう。",
              transitLegs: { deleteMany: {} },
            },
          },
          {
            id: HORINJI,
            data: {
              visitTime: t(11, 42),
              stayDurationMin: 50,
              lat: 35.010001,
              lng: 135.677215,
              memo: "車折神社駅まで歩いておよそ2分、電車でおよそ4分の嵐山駅まで行き、さらに歩いておよそ11分で法輪寺に着きます。和銅6年（713年）、元明天皇の勅願により行基が創建したのが始まりと伝えられ、天長6年（829年）には空海の弟子・道昌が虚空蔵菩薩を安置し、「嵯峨の虚空蔵さん」の愛称で親しまれるようになりました。清和天皇が13歳で成人の証の法要をこの寺で営んだ故事にちなみ、子どもが13歳になると知恵を授かりにお参りする「十三まいり」の風習が生まれたといいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、渡月橋のあたりで昼食にしましょう。",
              transitLegs: {
                deleteMany: {},
                create: [
                  { orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null },
                  { orderNo: 2, transitMode: "train", transitDurationMin: 4, transitLine: null },
                  { orderNo: 3, transitMode: "walk", transitDurationMin: 11, transitLine: null },
                ],
              },
            },
          },
          {
            create: {
              name: "渡月橋のあたりで昼食",
              visitTime: t(12, 39),
              stayDurationMin: 45,
              lat: 35.012875,
              lng: 135.677764,
              memo: "法輪寺から歩いておよそ7分、渡月橋のあたりに着きます。桂川にかかるこの橋のたもとには食事処が並び、川面を眺めながら昼食をとるのにぴったりの場所です。お店を選んで、ゆっくり昼食をとりましょう。この後は、歩いておよそ4分の、嵐山モンキーパークいわたやまへ向かいましょう。",
              transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
            },
          },
          {
            id: MONKEYPARK,
            data: {
              visitTime: t(13, 28),
              stayDurationMin: 90,
              lat: 35.01142,
              lng: 135.67673,
              memo: "昼食を終えたら、歩いておよそ4分、野生のニホンザルが暮らす山へ向かいます。1954年に京都大学の研究者たちが観察を始め、1957年に一般公開できるよう整備されたのが始まりと伝えられています。「嵐山群」と呼ばれるこの群れは、70年近くにわたる観察で全個体の親子関係が記録されているという、世界的にも珍しい調査対象。ゆっくり山道を上れば、山頂からは嵐山や京都市街の眺めも待っています。この後は、歩いておよそ4分の渡月橋へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
            },
          },
          {
            id: TOGETSUKYO,
            data: {
              visitTime: t(15, 2),
              stayDurationMin: 25,
              lat: 35.012875,
              lng: 135.677764,
              memo: "嵐山モンキーパークいわたやまから歩いておよそ4分、嵐山のシンボル・渡月橋に着きます。平安時代に架けられた当初は近くの法輪寺にちなみ「法輪寺橋」と呼ばれていましたが、鎌倉時代、亀山上皇が満月の夜に舟遊びをした際、月が橋の上を渡っていくように見えたことから「渡月橋」と呼ばれるようになったと伝えられています。桂川にかかる橋の上から、ゆっくり嵐山を眺めましょう。この後はタクシーで、大覚寺へ向かいましょう。タクシーは、前もって予約しておくと安心です。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
            },
          },
          {
            id: DAIKAKUJI,
            data: {
              visitTime: t(15, 36),
              stayDurationMin: 75,
              memo: "渡月橋からタクシーでおよそ9分、大覚寺に着きます。貞観18年(876)、嵯峨天皇の離宮「嵯峨院」を寺に改めたのが始まりと伝えられる、皇室ゆかりの門跡寺院で、「嵯峨御所」とも呼ばれています。境内東側に広がる大沢池は、嵯峨天皇が弘仁年間(810-824)に造営した離宮の庭池で、日本最古の人工の林泉とされています。中国の洞庭湖になぞらえて「庭湖」とも呼ばれ、嵯峨天皇はここで詩歌管弦の宴を催したと伝えられています。大覚寺は「いけばな嵯峨御流」の家元でもあり、花の寺としても親しまれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。大覚寺からタクシーでおよそ9分の、鳥居本のあたりの宿に向かい、ゆっくり休みましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9, transitLine: null }] },
            },
          },
        ],
        { remove: [SEIRYOJI, HOKYOIN, RAKUSHISHA], tx }
      );

      // ===== Day2 =====
      await setDaySpotOrder(
        DAY2_ID,
        [
          {
            id: ARASHIYAMA_PARK,
            data: {
              visitTime: t(8, 30),
              stayDurationMin: 25,
              lat: 35.011989,
              lng: 135.678226,
              memo: "2日目は、鳥居本のあたりの宿からタクシーでおよそ9分、渡月橋のたもとに広がる公園から始めましょう。タクシーは、前もって予約しておくと安心です。桂川の中州に浮かぶ「中之島」は、この公園の一部です。上流の「亀山地区」は、山の形が亀の甲羅に似ていることが名前の由来と伝えられています。朝の澄んだ空気の中、アカマツの茂る園内をのんびり散策しましょう。この後は、歩いておよそ6分の嵐電嵐山駅へ向かいましょう。",
            },
          },
          {
            id: RANDEN_ARASHIYAMA,
            data: {
              visitTime: t(9, 1),
              stayDurationMin: 15,
              lat: 35.015223,
              lng: 135.6777,
              memo: "公園から歩いておよそ6分、レトロな路面電車のターミナル駅へ。1910年に嵐山電車軌道の駅として開業し、2013年のリニューアルでホーム内に嵐山温泉の足湯が整いました。電車を待つ間、ゆっくり足を休めるのにぴったりです。この後は、歩いておよそ13分、鹿王院へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
            },
          },
          {
            id: ROKUOIN,
            data: {
              visitTime: t(9, 29),
              stayDurationMin: 45,
              memo: "嵐電嵐山駅から歩いておよそ13分、鹿王院に着きます。室町幕府3代将軍・足利義満が、康暦元年(1379)、夢のお告げを受けて建てたと伝わる宝幢寺の開山塔頭として、至徳3年(1387)に創建されました。開山には、夢窓疎石の法系を継いだ普明国師・春屋妙葩(しゅんおくみょうは)が迎えられています。境内を切り開いた際、一帯に鹿の群れが集まっていたことから「鹿王院」の名がついたと伝えられています。総門から続く紅葉の参道や、舎利殿に安置される仏牙舎利(釈迦の歯とされる遺骨)でも知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ10分、トロッコ嵯峨駅の「19世紀ホール」へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null }] },
            },
          },
          {
            id: HALL19,
            data: {
              visitTime: t(10, 24),
              stayDurationMin: 30,
              lat: 35.01845,
              lng: 135.68047,
              memo: "鹿王院から歩いておよそ10分、嵯峨野観光鉄道の始発駅・トロッコ嵯峨駅に着きます。駅の構内にある「19世紀ホール」には、かつて実際に走っていた本物の蒸気機関車が展示され、グランドピアノやパイプオルガンも置かれています。併設のカフェで一息ついて、レトロな雰囲気を楽しみましょう。この後は、歩いておよそ15分、世界遺産・天龍寺へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
            },
          },
          {
            id: TENRYUJI,
            data: {
              visitTime: t(11, 9),
              stayDurationMin: 60,
              lat: 35.016224,
              lng: 135.672941,
              memo: "「19世紀ホール」から歩いておよそ15分、世界遺産・天龍寺に着きます。後醍醐天皇の菩提を弔うため、足利尊氏が開基となり、夢窓疎石を開山として建立された、臨済宗天龍寺派の大本山です。室町時代には京都五山の第一位に位置づけられました。見どころは、開山・夢窓疎石が手がけたと伝わる「曹源池庭園」で、亀山や嵐山を借景に取り込んだ、日本で最初に国の史跡・特別名勝に指定された名庭とされています。曹源池を中心とした池泉回遊式庭園で、龍門瀑と呼ばれる滝の石組みは、後世の日本庭園にも大きな影響を与えたといわれています。法堂の天井には、迫力ある「雲龍図」も描かれ、特別な日には公開されることもあります。1994年には「古都京都の文化財」の一つとして世界文化遺産に登録されました。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ2分、北門のあたりで昼食にしましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
            },
          },
          {
            create: {
              name: "天龍寺の北門のあたりで昼食",
              visitTime: t(12, 11),
              stayDurationMin: 40,
              lat: 35.017155,
              lng: 135.672214,
              memo: "天龍寺から歩いておよそ2分、竹林の道にほど近い北門のあたりに着きます。食事処が点在するこのあたりで、お店を選んでゆっくり昼食をとりましょう。この後は、歩いておよそ3分の野宮神社へ向かいましょう。",
              transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2, transitLine: null }] },
            },
          },
          {
            id: NONOMIYA,
            data: {
              visitTime: t(12, 54),
              stayDurationMin: 30,
              lat: 35.017765,
              lng: 135.674166,
              memo: "昼食を終えたら、歩いておよそ3分、竹林の入口に佇む、縁結びで知られる神社へ向かいます。かつて天皇に代わって伊勢神宮に仕えた斎王が、都を離れる前にこの地で身を清めたと伝えられ、『源氏物語』の「賢木」の巻にも描かれる由緒ある社。皮つきの木をそのまま使った「黒木鳥居」も見どころで、静かに手を合わせていく参拝者が絶えません。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分の竹林の道へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
            },
          },
          {
            id: CHIKURIN,
            data: {
              visitTime: t(13, 28),
              stayDurationMin: 28,
              lat: 35.016796,
              lng: 135.671266,
              memo: "野宮神社から歩いておよそ4分、青々とした竹が空を覆う約400mの道です。ここに茂るのは、成長すると高さ25mにもなるというモウソウチク（孟宗竹）。紅葉の名所が並ぶ嵯峨野の中で、一年を通して緑を保つ竹林はひと味違う涼やかな景色を見せてくれます。竹に傷をつけないようにしましょう。この後は、歩いておよそ3分の大河内山荘庭園へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
            },
          },
          {
            id: OKOCHI,
            data: {
              visitTime: t(13, 59),
              stayDurationMin: 60,
              lat: 35.016633,
              lng: 135.669586,
              memo: "竹林の道から歩いておよそ3分、昭和の映画スター・大河内傳次郎が築いた庭園に着きます。1931年、34歳のときから亡くなる1962年まで、約30年をかけて庭師とともに一木一草に手を入れ続けたと伝えられています。書院造や数寄屋造を融合させた「大乗閣」など、園内の建物は国の登録有形文化財。小倉山からの眺めをゆっくり楽しみましょう。この後は、歩いておよそ4分の御髪神社へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
            },
          },
          {
            id: MIKAMIJINJA,
            data: {
              visitTime: t(15, 3),
              stayDurationMin: 20,
              memo: "大河内山荘庭園から歩いておよそ4分、竹林の道の北の外れに佇む小さな神社に着きます。日本の髪結い職の祖と伝えられる藤原采女亮政之を祭神とする、全国でも珍しい「髪」の神社です。理容師や美容師など、髪に関わる仕事をする人たちの参拝も多く、櫛の形をしたお守りや、髪にちなんだ絵馬でも知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ22分、化野念仏寺へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
            },
          },
          {
            id: ADASHINO,
            data: {
              visitTime: t(15, 45),
              stayDurationMin: 40,
              memo: "御髪神社から歩いておよそ22分、化野(あだしの)念仏寺に着きます。「化野」は、平安時代から続く墓地・風葬の地とされ、弘仁2年(811)、空海がここに野ざらしになっていた遺骸を弔うため、千体の石仏を埋め、五智如来を祀る寺を建てたのが始まりと伝えられています。当初は真言宗でしたが、鎌倉時代初めに法然の常念仏道場となり、浄土宗に改められました。境内には、この地に葬られた人々の墓であった、およそ8,000体もの石仏・石塔が並んでいます。何百年もの歳月で無縁仏となり散乱していたものを、明治の中頃に掘り出して集めたものだと伝えられています。お墓のまわりでは、静かに過ごしましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、すぐそばに広がる嵯峨鳥居本の町並みへ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 22, transitLine: null }] },
            },
          },
          {
            id: TORIIMOTO,
            data: {
              visitTime: t(16, 28),
              stayDurationMin: 30,
              lat: 35.02642,
              lng: 135.666806,
              memo: "化野念仏寺から歩いておよそ3分、瓦屋根の町家から茅葺きの農家家屋へと姿を変えていく、愛宕山への旧参道沿いの町並みに着きます。江戸時代、山頂の愛宕神社へ向かう参拝者で賑わった愛宕街道の面影を今に伝える一帯で、国の重要伝統的建造物群保存地区に選定されています。今も人が暮らす町並みなので、家の敷地に入らず、静かに歩きましょう。静かな坂道をのんびり歩きながら、嵯峨野の昔ながらの風情を味わいましょう。歩いておよそ5分の、鳥居本のあたりの宿でゆっくり休みましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
            },
          },
        ],
        { remove: [HOGONIN], tx }
      );

      // ===== Day3 =====
      await setDaySpotOrder(
        DAY3_ID,
        [
          {
            id: GIOJI,
            data: {
              visitTime: t(8, 30),
              stayDurationMin: 45,
              lat: 35.023517,
              lng: 135.666801,
              memo: "3日目は、鳥居本のあたりの宿から歩いておよそ9分、平家物語ゆかりの、こぢんまりとした尼寺から始めましょう。平清盛に寵愛された白拍子・祇王は、新しく現れた仏御前に心変わりされ、母や妹とともにこの地で出家したと伝えられ、後に仏御前自身もここを訪ね、ともに暮らしたという逸話も残ります。明治時代にいったん廃れましたが、元・京都府知事の北垣国道と文人画家・富岡鉄斎らの尽力で明治28年に再興されました。苔むした庭を眺めましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ9分の二尊院へ向かいましょう。",
              transitLegs: { deleteMany: {} },
            },
          },
          {
            id: NISONIN,
            data: {
              visitTime: t(9, 24),
              stayDurationMin: 46,
              lat: 35.021555,
              lng: 135.667837,
              memo: "祇王寺から歩いておよそ9分、総門から本堂までまっすぐ続く参道が名物の古刹に着きます。平安時代、嵯峨天皇の勅願を受けて慈覚大師円仁が開いたと伝えられ、鎌倉時代に法然の弟子・湛空が復興しました。寺の名は、本堂に並んで祀られる2体の仏像「発遣の釈迦如来」「来迎の阿弥陀如来」に由来します。参道をゆっくり歩き、先まで進んでから振り返ってみる眺めも格別です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ9分の常寂光寺へ向かいましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9, transitLine: null }] },
            },
          },
          {
            id: JOJAKKOJI,
            data: {
              visitTime: t(10, 19),
              stayDurationMin: 68,
              lat: 35.019692,
              lng: 135.668646,
              memo: "二尊院から歩いておよそ9分、小倉山の中腹に建つ古寺に着きます。安土桃山時代に日蓮宗の僧・日禎が開いたとされ、寺の名は仏教が説く理想の浄土「常寂光土」になぞらえて名づけられたと伝えられています。歌人・藤原定家が『小倉百人一首』を編んだという山荘「時雨亭」の跡地との説もあるこの一帯、石段をゆっくり上りながら、歌に詠まれた小倉山の風情を味わってみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ20分のJR嵯峨嵐山駅へ向かい、電車でおよそ11分の亀岡駅まで行き、さらに歩いておよそ7分の、南郷公園のあたりで昼食にしましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9, transitLine: null }] },
            },
          },
          {
            create: {
              name: "南郷公園のあたりで昼食",
              visitTime: t(12, 5),
              stayDurationMin: 39,
              lat: 35.013732,
              lng: 135.583403,
              memo: "常寂光寺から歩いておよそ20分のJR嵯峨嵐山駅へ向かい、電車でおよそ11分の亀岡駅まで行き、さらに歩いておよそ7分で、南郷公園のあたりに着きます。緑に囲まれた公園の近くには食事処が点在し、川下りの前にひと息つくのにぴったりの場所です。お店を選んで、ゆっくり昼食をとりましょう。この後は、歩いておよそ16分の保津川下りの乗船場へ向かいましょう。",
              transitLegs: {
                create: [
                  { orderNo: 1, transitMode: "walk", transitDurationMin: 20, transitLine: null },
                  { orderNo: 2, transitMode: "train", transitDurationMin: 11, transitLine: null },
                  { orderNo: 3, transitMode: "walk", transitDurationMin: 7, transitLine: null },
                ],
              },
            },
          },
          {
            id: HOZUGAWA,
            data: {
              visitTime: t(13, 0),
              stayDurationMin: 120,
              lat: 35.01721,
              lng: 135.586931,
              memo: "南郷公園のあたりから歩いておよそ16分、保津川下りの乗船場に着きます。早めに着いて、受付を済ませておきましょう。慶長11年（1606年）、京都の豪商・角倉了以が保津川の川底を改修し、舟での輸送を可能にしたのが始まりと伝えられています。もとは丹波の木材を運ぶための水運でしたが、明治に入り鉄道が通って水運の役目を終えると、観光客を乗せる舟下りへと姿を変えていきました。乗船場から嵐山まで、およそ16kmの渓谷を、およそ2時間かけて下る船旅です。川の水量や天気によって、時間が変わることがあります。運航の時刻や期間は、出かける前に公式の案内で確かめましょう。ゆったりと流れに身を任せ、渓谷の景色を楽しみましょう。2泊3日の嵐山・嵯峨野の旅を、ここで締めくくりましょう。下船したら、嵐山の船着き場から歩いておよそ9分の嵐電嵐山駅から帰りましょう。",
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16, transitLine: null }] },
            },
          },
        ],
        { remove: [TAKIGUCHIDERA], tx }
      );

      // トランザクション内で結果を読み、確認モードでもロールバック前の実際の値を表示する
      const days = await tx.day.findMany({
        where: { itineraryId: ITINERARY_ID },
        orderBy: { dayNumber: "asc" },
        include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } },
      });
      const hm = (dt: Date | null) => (dt ? `${String(dt.getUTCHours()).padStart(2, "0")}:${String(dt.getUTCMinutes()).padStart(2, "0")}` : "?");
      for (const d of days) {
        preview += `\n=== Day ${d.dayNumber} ===\n`;
        for (const s of d.spots) {
          const legs = s.transitLegs.map((l) => `${l.transitMode}/${l.transitDurationMin}`).join("+") || "-";
          preview += `[${s.orderNo}] ${hm(s.visitTime)} ${legs} ${s.name}(${s.stayDurationMin}分) lat=${s.lat} lng=${s.lng}\n`;
        }
      }

      if (!commit) {
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
    if (e instanceof Error && e.message === "DRY_RUN_ROLLBACK") {
      console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません(ロールバックしました)。以下はロールバック前の実際の計算結果です。");
      return;
    }
    throw e;
  });

  console.log(preview);

  if (commit) {
    console.log("[--commit] 書き込みました。");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #84 甘樫丘の絶景と古代遺跡、飛鳥の歴史を歩く旅 (27a60951-7e74-4fe3-b47b-48cae24c2476)
 * 初日・最終日の見直し。
 *
 * 初日: 入口(近鉄飛鳥駅、徒歩実測17分=宮内庁の案内「約17分」と一致)が丸ごと欠けていたため
 * 追加(10:30着→10:47)。説明文に名前のない鬼の俎板・鬼の雪隠・キトラ古墳壁画体験館・川原寺跡
 * (企画運営の判断でさらに外す)を外す。亀石→高松塚・高松塚→石舞台・橘寺→藤原宮跡(川原寺跡を
 * 経由しない直接の道のり)は測り直した(実測20分・38分・61分)。石舞台→橘寺(8→16分)も実測より
 * 短すぎたため直す。企画運営の指摘で、滞在を細かく削るより行き先を外す考え方にそろえ、ほかの
 * 滞在はもとの長さに近づけた(天武・持統天皇陵50→42・亀石45→40・高松塚古墳75→60・
 * 石舞台古墳40→33・橘寺30→25・藤原宮跡40→30)。高松塚古墳に昼食の一文、藤原宮跡(初日最後)に
 * 宿の一文を追加。藤原宮跡の座標は、広い野原の中心(もとの値)でなく、大極殿の跡に立つ碑の点
 * (法務の勧め、OSM node10831758467「持統天皇文武天皇藤原宮趾」)に直す。
 *
 * 2日目(最終日、8:30〜9:30開始・16:30〜17:00終了): 国営飛鳥歴史公園館は、公式サイトで
 * 2026年4月1日から閉館と確認したため外す(企画運営の判断)。向原寺→甘樫丘は直接の道のりで
 * 測り直す(実測9分)。座標の直し(岡寺・酒船石遺跡・飛鳥京跡・飛鳥寺・飛鳥資料館・万葉文化館の
 * 6か所。向原寺は地理院の番地と一致していたため変更なし)にともない、岡寺→酒船石遺跡(5→17分)・
 * 飛鳥京跡→飛鳥寺(5→11分)・水落遺跡→飛鳥資料館(4→13分)・飛鳥資料館→万葉文化館(10→18分)・
 * 万葉文化館→向原寺(10→20分)も測り直す。公園館を外した分とこれらの直しを合わせると+20分に
 * なるため、飛鳥資料館(50→40)・万葉文化館(50→40)の滞在を短くし、終了をもとと同じ16:32に
 * 収める。岡寺(1か所目)に宿からの行き方(近鉄飛鳥駅・橿原神宮前駅から明日香周遊バスで
 * 「岡寺前」へ、歩いて約9分)、飛鳥資料館(12:45着)に昼食の一文を追加。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-84-27a60951.ts
 *   反映: npm run prod -- npx tsx prisma/fix-84-27a60951.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "08ff3957-9419-4272-9a14-1ea53f936b89";
const DAY2_ID = "7151a2d0-e9dd-4c8e-bc29-3c13e15d892d";

const TENMU_ID = "d2ee83f9-5c34-4750-8c28-eeba6b234b03";
const KAMEISHI_ID = "0b076aec-c58d-4a91-95d5-f1ef6d507816";
const ONI_ID = "6b8e08e7-c1eb-4e21-951a-e870a950a678";
const TAKAMATSUZUKA_ID = "6ce02298-fe93-4ff2-b1c2-45b9cf79b950";
const KITORA_ID = "81c65b12-ae2e-4af3-a965-0e3b16cbb0b0";
const ISHIBUTAI_ID = "6c1ae3e4-71ff-4d0a-91f1-0fc85247aa90";
const TACHIBANADERA_ID = "1939ef15-2b48-415f-a5f3-e84ce940f77f";
const KAWARADERA_ID = "01218cf5-c107-4b05-b32b-003817548c14";
const FUJIWARAKYU_ID = "52b8e3f2-7e95-46f6-a165-cbada73181f8";

const OKADERA_ID = "5cc5e976-8f36-4e3e-9521-932203460bd8";
const SAKAFUNEISHI_ID = "bac0bfcf-8286-4c16-8a1b-0307ffe92b62";
const ASUKAKYO_ID = "9f2f1c97-56ac-40ef-9b89-b91579233fc9";
const ASUKADERA_ID = "13256a6d-56e8-41cd-9205-c091b48f0122";
const ASUKANIMASU_ID = "e3610689-9794-4afe-ab66-6a044e591ae9";
const MIZUOCHI_ID = "3e6e3c90-452c-4fcf-96f2-a3d631f91b4d";
const SHIRYOKAN_ID = "3e7ea6eb-b64d-483f-819c-df940456ff8e";
const MANYOBUNKAKAN_ID = "15616844-3cf7-4bdc-93e6-45c46d3b668a";
const MUKOHARADERA_ID = "11c8dd04-aa49-4a9d-850b-0a31f31a6a3f";
const ASUKAPARK_ID = "b908a6d6-b9b9-4c8f-8c78-0113db779368";
const AMAKASHI_ID = "8e014793-7819-430e-9947-d8ac04585f0e";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TENMU_MEMO =
  "近鉄飛鳥駅に10:30ごろ着いたら、歩いておよそ17分で、1日目最初の天武・持統天皇陵に着きます。7世紀後半に築かれた八角形の古墳で、天武天皇とその后・持統天皇が合葬された「檜隈大内陵(ひのくまのおおうちのみささぎ)」です。八角形の墳丘は、飛鳥時代の天皇陵だけに許された特別な形と考えられています。持統天皇は、日本で初めて火葬された天皇とされています。静かに、敬意をもってお参りください。続いては亀石へ向かいましょう。";

const KAMEISHI_MEMO =
  "天武・持統天皇陵から歩いておよそ5分、亀石に着きます。長さおよそ3.6メートルの花崗岩に、亀に似た顔が彫られた石造物で、明日香村観光のシンボルの一つとして親しまれています。奈良盆地がかつて湖だった時代の伝説が伝えられており、亀石が今の向きから西を向いたとき、あたり一帯が泥の海に変わるといわれています。何度も向きを変えてきたと伝わる、ユーモラスな表情をじっくり眺めてみましょう。続いては、歩いておよそ20分の高松塚古墳へ向かいましょう。";

const TAKAMATSUZUKA_MEMO =
  "亀石から歩いておよそ20分、高松塚古墳に着きます。到着したら、このあたりで昼食をとりましょう。1972年に極彩色の壁画が発見され、大きな話題となった古墳で、女子群像や男子群像、四神、天井の天文図などが描かれており、1974年に国宝に指定されました。壁画は保存のため石室ごと古墳の外に取り出されて修理され、ふだんは見ることができませんが、隣接する高松塚壁画館では、発見当時の姿を再現した模写や石槨の模型をじっくりと見学できます。古代の人々の美意識と、それを今に伝える保存の努力の両方を感じられる場所です。続いては、歩いておよそ38分の石舞台古墳へ向かいましょう。";

const ISHIBUTAI_MEMO =
  "高松塚古墳から歩いておよそ38分、石舞台古墳に着きます。一辺およそ50メートルの方墳で、国の特別史跡に指定されており、2026年7月には「飛鳥・藤原の宮都」の構成資産として世界遺産に登録された、飛鳥を象徴する史跡です。長い年月の間に盛り土が失われ、巨石を組み合わせた横穴式の石室がむき出しになった、独特の姿で知られています。埋葬されたのは蘇我馬子ではないかという説が有力ですが、はっきりとは分かっていません。現在も石室の中に入ることができるので、ゆっくりと巨石の迫力を楽しみましょう。続いては、歩いておよそ16分の橘寺へ向かいましょう。";

const TACHIBANADERA_MEMO =
  "石舞台古墳から歩いておよそ16分、橘寺に着きます。聖徳太子がお生まれになったと伝えられる地で、太子ゆかりの七大寺の一つとされています。発掘調査では、金堂と塔が東西に並ぶ四天王寺式の伽藍配置であったことも明らかになりました。境内で見ておきたいのが「二面石」で、一方は穏やかな顔、もう一方は険しい顔を持ち、人の心にある善悪二つの相を表していると伝えられています。田園風景に囲まれた静かな境内ですので、静かに、敬意をもってお参りください。続いては、歩いておよそ61分の藤原宮跡へ向かいましょう。";

const FUJIWARAKYU_MEMO =
  "橘寺から歩いておよそ61分、1日目最後は藤原宮跡です。持統天皇8年(694)から和銅3年(710)まで、中国の都城にならった本格的な都とされる藤原京の中心だった場所です。今は建物の礎石の位置を示す表示が広い野原に点在するのみですが、季節ごとに植えられた花畑越しに、大和三山(畝傍山・耳成山・天香久山)を望むことができます。かつて即位の儀式などが行われた中心の建物「大極殿」も、このあたりにありました。夕方の澄んだ空気の中、広々とした古代の都の跡地をゆっくりと眺めましょう。この夜は、明日香村のあたりの宿に泊まりましょう。";

const OKADERA_MEMO =
  "2日目は、正式には龍蓋寺というお寺、岡寺からです。宿の近くから、近鉄飛鳥駅・橿原神宮前駅方面の明日香周遊バスで「岡寺前」へ、歩いておよそ9分です。バスの本数は多くないので、最新の時刻は公式の時刻表で確かめましょう。飛鳥時代の高僧・義淵僧正が、草壁皇子ゆかりの岡宮の地を賜って開いたと伝えられています。田畑を荒らす悪龍を、義淵僧正が法力によって池に封じ、大きな石で蓋をしたという伝説が、龍蓋寺という名の由来だそうです。日本で最初の厄除け霊場とされ、西国三十三所の第七番札所としても多くの参拝者を集めてきました。ご本尊の如意輪観音坐像は、土で造られた塑像としては国内でも屈指の大きさといわれています。境内は祈りの場ですので、静かに、敬意をもってお過ごしください。続いては、歩いておよそ17分の酒船石遺跡へ向かいましょう。";

const SAKAFUNEISHI_MEMO =
  "岡寺から歩いておよそ17分、酒船石遺跡に着きます。7世紀中ごろに造られたとみられる祭祀の遺跡で、表面に不思議な模様が刻まれた「酒船石」と呼ばれる石造物が丘の上に残されています。近くでは湧水施設の遺構も見つかっており、水にまつわる古代の国家的な祭祀の場だったと考えられています。何のために使われたのかがはっきりとは分かっていない、飛鳥ならではの謎めいた雰囲気を味わえる場所です。続いては飛鳥京跡へ向かいましょう。";

const ASUKAKYO_MEMO =
  "酒船石遺跡から歩いておよそ5分、飛鳥京跡に着きます。7世紀、飛鳥浄御原宮をはじめとする歴代の宮殿が置かれていた場所と考えられている遺跡で、発掘調査によって、たびたび建て替えられた宮殿の遺構が幾重にも重なって見つかっています。今は広々とした空き地として整備され、当時の建物の柱の位置を示す表示から、飛鳥時代の宮殿の規模をしのぶことができます。続いては、歩いておよそ11分の飛鳥寺へ向かいましょう。";

const ASUKADERA_MEMO =
  "飛鳥京跡から歩いておよそ11分、飛鳥寺に着きます。推古4年(596)、蘇我馬子の発願によって建てられた、日本で最初の本格的な仏教寺院と伝えられています。本尊の銅造釈迦如来坐像は「飛鳥大仏」として親しまれ、推古17年(609)に鞍作鳥(止利仏師)が手がけたと伝えられる、現存する日本最古級の仏像で、重要文化財に指定されています。1400年以上前からこの場所で人々を見守ってきた大仏の、穏やかな表情をじっくりと眺めてみましょう。静かに、敬意をもって拝観しましょう。続いては飛鳥坐神社へ向かいましょう。";

const MIZUOCHI_MEMO =
  "飛鳥坐神社から歩いておよそ5分、水落遺跡に着きます。斉明天皇6年(660)、当時皇太子だった中大兄皇子(後の天智天皇)が造らせたと伝えられる、日本で最初の水時計「漏刻(ろうこく)」の跡です。『日本書紀』には、皇太子が初めて漏刻を造り、人々に時を知らせたと記されています。発掘された基壇の跡から、精密な水路と、水時計を納めていたとみられる建物の規模がうかがえます。続いては、歩いておよそ13分の奈良文化財研究所飛鳥資料館へ向かいましょう。";

const SHIRYOKAN_MEMO =
  "水落遺跡から歩いておよそ13分、奈良文化財研究所飛鳥資料館に着きます。到着したら、このあたりで昼食をとりましょう。飛鳥地方の発掘調査で見つかった数々の考古資料を展示する、国の研究機関の資料館です。酒船石遺跡や飛鳥京跡など、これまで訪れた遺跡の発掘の成果や、精巧な復元模型を通して、地面の下に眠る飛鳥時代の姿をより深く知ることができます。庭には石造物の複製も置かれており、屋外でも飛鳥の石の文化に触れられます。続いては、歩いておよそ18分の奈良県立万葉文化館へ向かいましょう。";

const MANYOBUNKAKAN_MEMO =
  "飛鳥資料館から歩いておよそ18分、奈良県立万葉文化館に着きます。日本最古の歌集とされる「万葉集」をテーマにした文化施設で、万葉集ゆかりの品々や、歌に詠まれた古代の暮らしを紹介する展示のほか、日本画家による大型の絵画作品も常設で見ることができます。四季折々の植物が植えられた庭園も見どころで、万葉集に詠まれた花や木を眺めながらゆっくりと過ごせます。この後は、歩いておよそ20分、向原寺(豊浦寺跡)へ向かいましょう。";

const MUKOHARADERA_MEMO =
  "万葉文化館から歩いておよそ20分、向原寺(豊浦寺跡)に着きます。『日本書紀』によれば、欽明13年(552)に百済から仏像が伝えられた際、蘇我稲目がこれを譲り受け、向原の自邸を浄めて寺としたのが始まりと伝えられています。また、この地はのちに推古天皇が即位した豊浦宮の跡地とも伝えられ、推古天皇が小墾田宮へ移ったあと、宮の跡が豊浦寺になったと伝えられています。日本に仏教が伝わった、まさにその舞台とされる場所です。今も法灯を受け継ぐお寺ですので、静かに、敬意をもってお参りください。続いては、歩いておよそ9分の甘樫丘へ向かいましょう。";

const AMAKASHI_MEMO =
  "向原寺から歩いておよそ9分、2日目最後は甘樫丘です。『日本書紀』には、7世紀に蘇我蝦夷・入鹿の親子がこの丘のふもとに邸宅を構えていたと記されています。頂上の展望台からは、飛鳥の里はもちろん、大和三山と呼ばれる耳成山・畝傍山・天香久山、そして二上山までを一望できます。この一帯は国営飛鳥歴史公園として整備されており、万葉集に詠まれた植物も数多く植えられているので、足元の草花にも目を向けながら散策を楽しめます。ベンチに腰かけて、夕暮れが近づく飛鳥の里山の景色をゆっくりと眺めましょう。2日間で巡った飛鳥の歴史と自然を、この丘からの眺めで締めくくります。";

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("=== #84 初日・最終日の見直し ===\n");
  console.log("--- 初日(7か所。鬼の俎板・鬼の雪隠・キトラ古墳壁画体験館を外す) ---");
  console.log("1. 天武・持統天皇陵 10:47(42分、もとは50分、入口を追加):");
  console.log(TENMU_MEMO);
  console.log("\n2. 亀石 11:29(40分、もとは45分):");
  console.log(KAMEISHI_MEMO);
  console.log("\n3. 高松塚古墳 12:14(60分、もとは75分、昼食追加、座標変更なし):");
  console.log(TAKAMATSUZUKA_MEMO);
  console.log("\n4. 石舞台古墳 13:34(33分、もとは40分、言葉づかい・座標を直す):");
  console.log(ISHIBUTAI_MEMO);
  console.log("\n5. 橘寺 14:45(25分、もとは30分):");
  console.log(TACHIBANADERA_MEMO);
  console.log("\n6. 藤原宮跡(最後) 16:27(30分、もとは40分、終了16:57、座標・締めの言い方・宿の一文を直す):");
  console.log(FUJIWARAKYU_MEMO);
  console.log("\n外す: 川原寺跡(初日、説明文に名前なし。企画運営の判断でさらに外す)");

  console.log("\n--- 2日目(最終日、10か所。国営飛鳥歴史公園館を外す) ---");
  console.log("1. 岡寺 09:00(41分、宿からの行き方を追加):");
  console.log(OKADERA_MEMO);
  console.log("\n2. 酒船石遺跡 09:58(30分、座標を直す):");
  console.log(SAKAFUNEISHI_MEMO);
  console.log("\n3. 飛鳥京跡 10:33(20分、座標をOSM way516813148「飛鳥宮跡」の点に直す):");
  console.log(ASUKAKYO_MEMO);
  console.log("\n4. 飛鳥寺 11:04(40分、言葉づかい・座標を直す):");
  console.log(ASUKADERA_MEMO);
  console.log("\n5. 飛鳥坐神社 11:52(20分、内容変更なし)");
  console.log("6. 水落遺跡 12:17(15分、内容変更なし):");
  console.log(MIZUOCHI_MEMO);
  console.log("\n7. 奈良文化財研究所飛鳥資料館 12:45(40分、もとは50分、昼食追加、座標を直す):");
  console.log(SHIRYOKAN_MEMO);
  console.log("\n8. 奈良県立万葉文化館 13:43(40分、もとは50分、座標を直す):");
  console.log(MANYOBUNKAKAN_MEMO);
  console.log("\n9. 向原寺(豊浦寺跡) 14:43(30分、座標変更なし・地理院の番地と一致):");
  console.log(MUKOHARADERA_MEMO);
  console.log("\n10. 甘樫丘(最後) 15:22(70分、終了16:32、もとと同じ):");
  console.log(AMAKASHI_MEMO);
  console.log("\n外す: 鬼の俎板・鬼の雪隠、キトラ古墳壁画体験館(初日、説明文に名前なし)");
  console.log("外す: 国営飛鳥歴史公園館(2日目、2026年4月1日から閉館。企画運営の判断)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(
        DAY1_ID,
        [
          { id: TENMU_ID, data: { visitTime: t(10, 47), stayDurationMin: 42, memo: TENMU_MEMO } },
          { id: KAMEISHI_ID, data: { visitTime: t(11, 29), stayDurationMin: 40, memo: KAMEISHI_MEMO } },
          {
            id: TAKAMATSUZUKA_ID,
            data: {
              visitTime: t(12, 14),
              stayDurationMin: 60,
              memo: TAKAMATSUZUKA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
            },
          },
          {
            id: ISHIBUTAI_ID,
            data: {
              visitTime: t(13, 34),
              stayDurationMin: 33,
              lat: 34.466849,
              lng: 135.826144,
              memo: ISHIBUTAI_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 38 }] },
            },
          },
          {
            id: TACHIBANADERA_ID,
            data: {
              visitTime: t(14, 45),
              stayDurationMin: 25,
              memo: TACHIBANADERA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
            },
          },
          {
            id: FUJIWARAKYU_ID,
            data: {
              visitTime: t(16, 27),
              stayDurationMin: 30,
              lat: 34.502301,
              lng: 135.807343,
              memo: FUJIWARAKYU_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 61 }] },
            },
          },
        ],
        { remove: [ONI_ID, KITORA_ID, KAWARADERA_ID], tx }
      );

      await setDaySpotOrder(
        DAY2_ID,
        [
          { id: OKADERA_ID, data: { visitTime: t(9, 0), stayDurationMin: 41, memo: OKADERA_MEMO, lat: 34.471681, lng: 135.828315 } },
          {
            id: SAKAFUNEISHI_ID,
            data: {
              visitTime: t(9, 58),
              stayDurationMin: 30,
              lat: 34.475588,
              lng: 135.823397,
              memo: SAKAFUNEISHI_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 17 }] },
            },
          },
          {
            id: ASUKAKYO_ID,
            data: {
              visitTime: t(10, 33),
              stayDurationMin: 20,
              lat: 34.473374,
              lng: 135.820862,
              memo: ASUKAKYO_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
            },
          },
          {
            id: ASUKADERA_ID,
            data: {
              visitTime: t(11, 4),
              stayDurationMin: 40,
              lat: 34.478672,
              lng: 135.820198,
              memo: ASUKADERA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
            },
          },
          { id: ASUKANIMASU_ID, data: { visitTime: t(11, 52), stayDurationMin: 20 } },
          { id: MIZUOCHI_ID, data: { visitTime: t(12, 17), stayDurationMin: 15, memo: MIZUOCHI_MEMO } },
          {
            id: SHIRYOKAN_ID,
            data: {
              visitTime: t(12, 45),
              stayDurationMin: 40,
              lat: 34.484292,
              lng: 135.825103,
              memo: SHIRYOKAN_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
            },
          },
          {
            id: MANYOBUNKAKAN_ID,
            data: {
              visitTime: t(13, 43),
              stayDurationMin: 40,
              lat: 34.47723,
              lng: 135.822312,
              memo: MANYOBUNKAKAN_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] },
            },
          },
          {
            id: MUKOHARADERA_ID,
            data: {
              visitTime: t(14, 43),
              stayDurationMin: 30,
              memo: MUKOHARADERA_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
            },
          },
          {
            id: AMAKASHI_ID,
            data: {
              visitTime: t(15, 22),
              stayDurationMin: 70,
              memo: AMAKASHI_MEMO,
              transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
            },
          },
        ],
        { remove: [ASUKAPARK_ID], tx }
      );
    },
    { timeout: 60000 }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

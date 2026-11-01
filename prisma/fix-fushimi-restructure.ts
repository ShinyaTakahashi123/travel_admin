/**
 * 組み直し、27d28702（千本鳥居と抹茶の香り、伏見・宇治を歩く欲張り散策プラン）。(v2)
 *
 * 点の直し(OSM、いずれも名前のある地物。Nominatim):
 *  宇治上神社 34.8912,135.8098 → place_of_worship way332816179 34.8920528,135.8114573
 *  宇治川(宇治橋のたもと) 34.8907,135.8062 → tourism=attraction node「宇治橋」
 *    34.8930374,135.8063355
 *  三室戸寺 34.8965,135.8214 → place_of_worship way1290236509 34.8997811,135.8187013
 *  御香宮神社 34.9358,135.7639 → place_of_worship way802580172 34.9340912,135.767393
 *  藤森神社 34.9622,135.7695(約1.3km北にずれ) → place_of_worship way368465614
 *    34.9501837,135.7717009
 *  伏見稲荷大社 34.9671,135.7727 → tourism=viewpoint node6865347485「千本鳥居」
 *    34.966983,135.7747604
 *
 * 旅の足(組み直し。駅までの歩き・乗る分・駅からの歩きを実測して確かめた):
 *  宇治上神社→宇治川: 歩き9分(routed-foot 0.67km・8.9分)
 *  宇治川→三室戸寺: 電車10分だったが、三室戸駅から三室戸寺まで歩いて17.2分かかり
 *    (法務の指摘どおり)、宇治橋から三室戸駅までの歩き1.8分・乗車・駅からの17.2分を
 *    足すと直接歩く場合(1.65km・22.1分)より速くならないため、歩きに直す(23分)
 *  三室戸寺→御香宮神社: 電車25分だったが、三室戸駅まで17.2分歩き、乗り換えを含む
 *    電車、丹波橋駅から御香宮神社まで9.8分歩く形で、乗り換え時間を含む公式の時刻を
 *    確かめられなかったため、タクシーに直す(OSRM車7.59km・11.7分+5分=17分)
 *  御香宮神社→伏見大手筋商店街: 歩き5分(routed-foot 0.38km・5.0分)
 *  伏見大手筋商店街→藤森神社: 電車15分だったが、同じ理由（乗り換えの公式時刻を
 *    確かめられない）でタクシーに直す(OSRM車2.50km・4.2分+5分=10分)
 *  藤森神社→伏見稲荷大社: 歩き8分だったが、点の移動で2.40km・歩くと32分かかるため
 *    タクシーに直す(OSRM車6.6分+5分=12分、変更なし)
 *
 * 昼食: 御香宮神社は神社の滞在のため昼食を入れられない(決まり)。宇治川の滞在79分を
 *  40分に縮め(川べりの散策と甘味・お茶の時間として。決まりA、縮めるのはいつでも可)、
 *  空いた時間で、御香宮神社の次に実在の行き先「伏見大手筋商店街」(OSM「大手筋通」
 *  way1568194787、34.9329838,135.7646263)を追加し、昼食の場所にする(40分、始まり
 *  13:14で11:30〜13:30の中)。食事ができる店が複数あることは、京都市観光協会サイト
 *  (ja.kyoto.travel/event/single.php?event_id=10598、伏見大手筋商店街の飲食店15店舗の
 *  掲載)で確認。店の名前は書かない
 *
 *  この組み直しで終わりは16:41(日帰りの発車16:30〜17:00の中)。伏見稲荷大社の滞在は
 *  100分のまま変更なし
 *
 * ほか:
 *  - 宇治上神社に書き出し(JR宇治駅から徒歩18分、routed-foot 1.34km・17.9分)を追加
 *  - 伏見稲荷大社の最後に帰りの一文(稲荷駅までの分、routed-foot 0.44km・5.9分)を追加
 *  - 宇治川「…お茶をゆっくり味わってみてください」→「…味わいましょう」
 *  - 伏見稲荷「時間に応じて…楽しんでください」→「…楽しみましょう」
 *  - 伏見稲荷「京都でも屈指の人気といわれます」(「人気」は出典のない言い方)→
 *    「京都を代表する光景のひとつといわれます」
 *  - 最後「お帰りは、…電車で帰りましょう」(「帰り」が2回)→「帰りは、歩いておよそ6分の
 *    稲荷駅から、電車に乗りましょう」
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "27d28702-2f4b-4134-947c-b2725f9b90c0";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const UJIGAMI = "宇治上神社";
const UJIGAWA = "宇治川";
const MIMUROTOJI = "三室戸寺";
const GOKONOMIYA = "御香宮神社";
const FUJINOMORI = "藤森神社";
const FUSHIMIINARI = "伏見稲荷大社";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const ujigami = await prisma.spot.findFirstOrThrow({ where: { name: UJIGAMI, day: { itineraryId: ITIN_ID } } });
  const ujigawa = await prisma.spot.findFirstOrThrow({ where: { name: UJIGAWA, day: { itineraryId: ITIN_ID } } });
  const mimurotoji = await prisma.spot.findFirstOrThrow({ where: { name: MIMUROTOJI, day: { itineraryId: ITIN_ID } } });
  const gokonomiya = await prisma.spot.findFirstOrThrow({ where: { name: GOKONOMIYA, day: { itineraryId: ITIN_ID } } });
  const fujinomori = await prisma.spot.findFirstOrThrow({ where: { name: FUJINOMORI, day: { itineraryId: ITIN_ID } } });
  const fushimiinari = await prisma.spot.findFirstOrThrow({ where: { name: FUSHIMIINARI, day: { itineraryId: ITIN_ID } } });

  // 現在値の確認(前回の書き込みはまだ行っていない前提=もとの値のまま)
  const checks: { name: string; lat: number; lng: number; got: { lat: unknown; lng: unknown } }[] = [
    { name: UJIGAMI, lat: 34.8912, lng: 135.8098, got: ujigami },
    { name: UJIGAWA, lat: 34.8907, lng: 135.8062, got: ujigawa },
    { name: MIMUROTOJI, lat: 34.8965, lng: 135.8214, got: mimurotoji },
    { name: GOKONOMIYA, lat: 34.9358, lng: 135.7639, got: gokonomiya },
    { name: FUJINOMORI, lat: 34.9622, lng: 135.7695, got: fujinomori },
    { name: FUSHIMIINARI, lat: 34.9671, lng: 135.7727, got: fushimiinari },
  ];
  for (const c of checks) {
    if (Math.abs(Number(c.got.lat) - c.lat) > 1e-6 || Math.abs(Number(c.got.lng) - c.lng) > 1e-6) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致(現在 ${c.got.lat},${c.got.lng})`);
    }
  }

  const UJIGAMI_MEMO_OLD =
    "現存最古の神社建築とされる本殿を持つ世界遺産です。祭神は応神天皇・仁徳天皇・菟道稚郎子の三柱。本殿は平安時代後期、11世紀後半の建立と伝えられ、3棟の内殿を1つの覆屋で包む珍しい形式をしています。隣接する平等院の鎮守社として、平等院の支援を受けながら整えられてきたと伝えられ、平等院とあわせて世界遺産に登録されています。静かに、敬意をもってお参りください。";
  const UJIGAMI_MEMO_NEW =
    "JR宇治駅から歩いておよそ18分、現存最古の神社建築とされる本殿を持つ世界遺産、宇治上神社に着きます。祭神は応神天皇・仁徳天皇・菟道稚郎子の三柱。本殿は平安時代後期、11世紀後半の建立と伝えられ、3棟の内殿を1つの覆屋で包む珍しい形式をしています。隣接する平等院の鎮守社として、平等院の支援を受けながら整えられてきたと伝えられ、平等院とあわせて世界遺産に登録されています。静かに、敬意をもってお参りください。この後は、歩いておよそ9分、宇治川へ向かいましょう。";
  if (ujigami.memo !== UJIGAMI_MEMO_OLD) throw new Error("宇治上神社: memo現在値が期待と不一致");

  const UJIGAWA_MEMO_OLD =
    "宇治上神社から歩いておよそ5分、宇治橋のたもとに着きます。平安時代には貴族の間で鵜飼が楽しまれ、『蜻蛉日記』にもその様子が記されていると伝えられていますが、殺生を禁じる仏教の教えが広まるとともに衰退したといわれます。大正15年に鵜飼が復活し、今も夏には鵜匠が鵜を操る「宇治川の鵜飼」が夏の風物詩として親しまれています。宇治橋のたもとには紫式部の像も立っており、橋を渡って続くまち並みには宇治茶の老舗が軒を連ねています。清流を眺めながら、抹茶を使った甘味やお茶をゆっくり味わってみてください。続いては三室戸寺へ向かいましょう。";
  const UJIGAWA_MEMO_NEW =
    "宇治上神社から歩いておよそ9分、宇治橋のたもとに着きます。平安時代には貴族の間で鵜飼が楽しまれ、『蜻蛉日記』にもその様子が記されていると伝えられていますが、殺生を禁じる仏教の教えが広まるとともに衰退したといわれます。大正15年に鵜飼が復活し、今も夏には鵜匠が鵜を操る「宇治川の鵜飼」が夏の風物詩として親しまれています。宇治橋のたもとには紫式部の像も立っており、橋を渡って続くまち並みには宇治茶の老舗が軒を連ねています。清流を眺めながら、抹茶を使った甘味やお茶をゆっくり味わいましょう。続いては、歩いておよそ23分、三室戸寺へ向かいましょう。";
  if (ujigawa.memo !== UJIGAWA_MEMO_OLD) throw new Error("宇治川: memo現在値が期待と不一致");

  const MIMUROTOJI_MEMO_OLD =
    "約2万株のアジサイと蓮で有名な「花の寺」です。宝亀元年（770年）、山中から見つかった黄金の仏像を本尊として、光仁天皇の勅願で創建されたと伝えられています。広さ5000坪の庭園には50種2万株のアジサイが咲き誇り、7月には本堂前に250鉢の蓮が並んで極楽浄土のような光景をつくります。西国三十三所の十番札所でもあります。静かに、敬意をもって拝観しましょう。";
  const MIMUROTOJI_MEMO_NEW =
    "宇治川から歩いておよそ23分、約2万株のアジサイと蓮で有名な「花の寺」、三室戸寺に着きます。宝亀元年（770年）、山中から見つかった黄金の仏像を本尊として、光仁天皇の勅願で創建されたと伝えられています。広さ5000坪の庭園には50種2万株のアジサイが咲き誇り、7月には本堂前に250鉢の蓮が並んで極楽浄土のような光景をつくります。西国三十三所の十番札所でもあります。静かに、敬意をもって拝観しましょう。続いては、タクシーでおよそ17分、御香宮神社へ向かいましょう。";
  if (mimurotoji.memo !== MIMUROTOJI_MEMO_OLD) throw new Error("三室戸寺: memo現在値が期待と不一致");

  const GOKONOMIYA_MEMO_OLD =
    "名水が湧くことからその名がついた伏見の氏神様です。貞観4年（862年）、境内から良い香りのする水が湧き出し、その水を飲むと病がたちまち癒えたという言い伝えから、時の清和天皇より「御香宮」の名を賜ったと伝えられています。境内の「御香水」は伏見の地名の由来という説もあり、今も名水として親しまれています。静かに、敬意をもってお参りください。";
  const GOKONOMIYA_MEMO_NEW =
    "三室戸寺からタクシーでおよそ17分、名水が湧くことからその名がついた伏見の氏神様、御香宮神社に着きます。貞観4年（862年）、境内から良い香りのする水が湧き出し、その水を飲むと病がたちまち癒えたという言い伝えから、時の清和天皇より「御香宮」の名を賜ったと伝えられています。境内の「御香水」は伏見の地名の由来という説もあり、今も名水として親しまれています。静かに、敬意をもってお参りください。続いては、歩いておよそ5分、伏見大手筋商店街へ向かいましょう。";
  if (gokonomiya.memo !== GOKONOMIYA_MEMO_OLD) throw new Error("御香宮神社: memo現在値が期待と不一致");

  const OTESUJI_MEMO =
    "御香宮神社から歩いておよそ5分、伏見大手筋商店街に着きます。和菓子店や酒屋、食事ができる店が並ぶ商店街です。ここで昼食にしましょう。この後は、タクシーでおよそ10分、藤森神社へ向かいましょう。";

  const FUJINOMORI_MEMO_OLD =
    "勝運と馬の神社として競馬ファンの参拝も多い神社です。約1800年前、神功皇后によって創建されたと伝えられ、洛南深草の氏神として崇敬されてきました。毎年5月に行われる「藤森祭」は、菖蒲の節句発祥の祭ともいわれ、「菖蒲」が「尚武」に通じることから、勝負運を願う人々の信仰を集めています。祭りで奉納される「駈馬神事」の勇壮さから、馬の守護神としても知られています。静かに、敬意をもってお参りください。続いては伏見稲荷大社へ向かいましょう。";
  const FUJINOMORI_MEMO_NEW =
    "伏見大手筋商店街からタクシーでおよそ10分、勝運と馬の神社として競馬ファンの参拝も多い藤森神社に着きます。約1800年前、神功皇后によって創建されたと伝えられ、洛南深草の氏神として崇敬されてきました。毎年5月に行われる「藤森祭」は、菖蒲の節句発祥の祭ともいわれ、「菖蒲」が「尚武」に通じることから、勝負運を願う人々の信仰を集めています。祭りで奉納される「駈馬神事」の勇壮さから、馬の守護神としても知られています。静かに、敬意をもってお参りください。続いては、タクシーでおよそ12分、伏見稲荷大社へ向かいましょう。";
  if (fujinomori.memo !== FUJINOMORI_MEMO_OLD) throw new Error("藤森神社: memo現在値が期待と不一致");

  const FUSHIMIINARI_MEMO_OLD =
    "藤森神社から歩いておよそ8分、旅の最後は伏見稲荷大社です。和銅4年(711)の創建と伝えられ、全国に3万社以上あるとされる稲荷神社の総本宮で、商売繁盛や五穀豊穣の神として篤い信仰を集めてきました。稲荷山の麓から山腹にかけて、朱色の鳥居がすき間なく並ぶ「千本鳥居」は、参拝者が祈願成就のお礼として奉納してきたもので、鳥居のトンネルをくぐりながら歩く体験は、京都でも屈指の人気といわれます。稲荷山の頂上までは往復2時間ほどかかるとされますが、四つ辻あたりまでの散策でも十分に見ごたえがあります。石段が続く場所もあるので、足元に気をつけて歩きましょう。時間に応じて、無理のない範囲で鳥居のトンネルを楽しんでください。静かに、敬意をもってお参りください。";
  const FUSHIMIINARI_MEMO_NEW =
    "藤森神社からタクシーでおよそ12分、旅の最後は伏見稲荷大社です。和銅4年(711)の創建と伝えられ、全国に3万社以上あるとされる稲荷神社の総本宮で、商売繁盛や五穀豊穣の神として篤い信仰を集めてきました。稲荷山の麓から山腹にかけて、朱色の鳥居がすき間なく並ぶ「千本鳥居」は、参拝者が祈願成就のお礼として奉納してきたもので、鳥居のトンネルをくぐりながら歩く体験は、京都を代表する光景のひとつといわれます。稲荷山の頂上までは往復2時間ほどかかるとされますが、四つ辻あたりまでの散策でも十分に見ごたえがあります。石段が続く場所もあるので、足元に気をつけて歩きましょう。時間に応じて、無理のない範囲で鳥居のトンネルを楽しみましょう。静かに、敬意をもってお参りください。帰りは、歩いておよそ6分の稲荷駅から、電車に乗りましょう。";
  if (fushimiinari.memo !== FUSHIMIINARI_MEMO_OLD) throw new Error("伏見稲荷大社: memo現在値が期待と不一致");

  console.log(`\n[${UJIGAMI}]\n旧: ${UJIGAMI_MEMO_OLD}\n新: ${UJIGAMI_MEMO_NEW}`);
  console.log(`\n[${UJIGAWA}] 滞在79→40分\n旧: ${UJIGAWA_MEMO_OLD}\n新: ${UJIGAWA_MEMO_NEW}`);
  console.log(`\n[${MIMUROTOJI}]\n旧: ${MIMUROTOJI_MEMO_OLD}\n新: ${MIMUROTOJI_MEMO_NEW}`);
  console.log(`\n[${GOKONOMIYA}]\n旧: ${GOKONOMIYA_MEMO_OLD}\n新: ${GOKONOMIYA_MEMO_NEW}`);
  console.log(`\n[伏見大手筋商店街(新規)] 座標: 34.9329838,135.7646263\n${OTESUJI_MEMO}`);
  console.log(`\n[${FUJINOMORI}]\n旧: ${FUJINOMORI_MEMO_OLD}\n新: ${FUJINOMORI_MEMO_NEW}`);
  console.log(`\n[${FUSHIMIINARI}]\n旧: ${FUSHIMIINARI_MEMO_OLD}\n新: ${FUSHIMIINARI_MEMO_NEW}`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`宇治上神社: 座標34.8920528,135.8114573 / 時刻09:00(変更なし) / 滞在45分(変更なし)`);
  console.log(`宇治川: 座標34.8930374,135.8063355 / 時刻09:50→09:54 / 滞在79→40分 / incoming walk9分`);
  console.log(`三室戸寺: 座標34.8997811,135.8187013 / 時刻11:19→10:57 / 滞在62分(変更なし) / incoming walk23分`);
  console.log(`御香宮神社: 座標34.9340912,135.767393 / 時刻12:46→12:16 / 滞在53分(変更なし) / incoming taxi17分`);
  console.log(`伏見大手筋商店街(新規): 座標34.9329838,135.7646263 / 時刻13:14 / 滞在40分 / incoming walk5分`);
  console.log(`藤森神社: 座標34.9501837,135.7717009 / 時刻13:54→14:04 / 滞在45分(変更なし) / incoming taxi10分`);
  console.log(`伏見稲荷大社: 座標34.966983,135.7747604 / 時刻14:47→15:01 / 滞在121→100分 / incoming taxi12分`);
  console.log("終わり: 15:01+100分=16:41（日帰りの発車16:30〜17:00の中）");

  const DESC_OLD =
    "宇治上神社の静けさから、宇治川のせせらぎ、三室戸寺、御香宮神社、藤森神社まで。伏見・宇治の名水と信仰スポットを巡る、半日の散策プランです。";
  const DESC_NEW =
    "宇治上神社の静けさから、宇治川のせせらぎ、三室戸寺、御香宮神社、藤森神社、伏見稲荷大社まで。伏見・宇治の名水と信仰スポットを巡る、日帰りの散策プランです。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");
  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = ujigami.dayId;

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      dayId,
      [
        { id: ujigami.id, data: { memo: UJIGAMI_MEMO_NEW, lat: 34.8920528, lng: 135.8114573 } },
        {
          id: ujigawa.id,
          data: {
            memo: UJIGAWA_MEMO_NEW,
            lat: 34.8930374,
            lng: 135.8063355,
            visitTime: t(9, 54),
            stayDurationMin: 40,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: mimurotoji.id,
          data: {
            memo: MIMUROTOJI_MEMO_NEW,
            lat: 34.8997811,
            lng: 135.8187013,
            visitTime: t(10, 57),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 23 }] },
          },
        },
        {
          id: gokonomiya.id,
          data: {
            memo: GOKONOMIYA_MEMO_NEW,
            lat: 34.9340912,
            lng: 135.767393,
            visitTime: t(12, 16),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 17 }] },
          },
        },
        {
          create: {
            name: "伏見大手筋商店街",
            lat: 34.9329838,
            lng: 135.7646263,
            memo: OTESUJI_MEMO,
            visitTime: t(13, 14),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        {
          id: fujinomori.id,
          data: {
            memo: FUJINOMORI_MEMO_NEW,
            lat: 34.9501837,
            lng: 135.7717009,
            visitTime: t(14, 4),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 10 }] },
          },
        },
        {
          id: fushimiinari.id,
          data: {
            memo: FUSHIMIINARI_MEMO_NEW,
            lat: 34.966983,
            lng: 135.7747604,
            visitTime: t(15, 1),
            stayDurationMin: 100,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi", transitDurationMin: 12 }] },
          },
        },
      ],
      { remove: [], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

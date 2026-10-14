/**
 * 緊急修正: fix-ohenro-book4.ts が、#12(手を付けずに残すはずの本)自身の
 * スポット(38,足摺岬灯台,白山洞門,ジョン万次郎,39,咸陽島,大堂海岸)を
 * dayIdの書き換えで#11へ「移動」してしまい、#12が空になっていた
 * (#9のときは正しく複製していたが、今回は#12の分を複製し忘れ、直接移動していた)。
 *
 * #12(14e1c69b)の2つの日(4853231d、28b97e96)に、元の7スポットを
 * 新しいidで作り直して復元する(内容は本会話で読み取り済みの元データのまま)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/URGENT-restore-book12.ts
 *   本登録     : npm run prod -- npx tsx prisma/URGENT-restore-book12.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY1_ID = "4853231d-11c3-4390-8675-b4306056f9a5";
const DAY2_ID = "28b97e96-3ee3-4518-9748-7040d123e943";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const day1 = await prisma.day.findUnique({ where: { id: DAY1_ID }, include: { spots: true } });
  const day2 = await prisma.day.findUnique({ where: { id: DAY2_ID }, include: { spots: true } });
  if (!day1 || !day2) throw new Error("想定と違います(dayが見つからない)");
  if (day1.spots.length !== 0 || day2.spots.length !== 0) throw new Error("想定と違います(既にスポットがある。復元済みの可能性)");

  console.log("[確認OK] #12の日1・日2は空(想定どおり)。元の7スポットを復元する");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1 ---
  await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: "6d3d3c01-a48d-425a-a8dc-12c657ea8933", orderNo: 1, name: "金剛福寺",
      address: "高知県土佐清水市足摺岬214-1", lat: 32.724861, lng: 133.018936,
      memo: "四国霊場の第38番、太平洋を望む足摺岬に鎮座する金剛福寺です。仁王門には、開創にあたり嵯峨天皇自ら筆をとったと伝わる勅額「補陀洛東門」が掲げられています。嵯峨天皇は空海・橘逸勢とともに「三筆」に数えられる名筆家で、なかでも「東」の字の右上にはねる一画が見事だと評されています。境内は約12万平方メートルにおよぶ広さで、中央に池を配した回遊式庭園が広がり、亜熱帯の植物や色とりどりの花が四季を彩ります。庭園の一角に立つ多宝塔は、応安8年(1375)に建てられたのち明治13年(1880)に地元の人々の寄進で再建されたもので、高さは19mを超えます。足摺岬一帯は、観音菩薩の住む浄土「補陀落」に見立てられ、古くは小舟で単身、南の海へ漕ぎ出す「補陀落渡海」の行が行われた地としても知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
      visitTime: t(9, 0), stayDurationMin: 90,
    },
  });
  const todai = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: "c557bff3-ec8c-4ae7-9e56-f73bbd31553d", orderNo: 2, name: "足摺岬灯台",
      address: "高知県土佐清水市足摺岬", lat: 32.726566, lng: 133.011673,
      memo: "大正3年(1914)に初点灯した白亜の灯台で、太平洋を270度にわたって見渡せます。老朽化により昭和35年(1960)に改築され、太平洋戦争末期には米軍機による機銃掃射を受けた記録も残っています。灯台からは全長約2kmの遊歩道が整備され、弘法大師にまつわる「足摺七不思議」の言い伝えが残る奇岩をたどりながら、足摺岬の東側にある展望地「天狗の鼻」まで歩くことができます。あたり一帯にはヤブツバキが群生し、2月下旬から3月上旬には赤い花が咲きそろいます。岬は四国最南端として親しまれていますが、地図の上での最南端は少し西に離れた「長碆」という岩場だとされています。遊歩道の足もとは岩場で滑りやすいところもあるので、気をつけて歩きましょう。",
      visitTime: t(10, 40), stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: todai.id, orderNo: 1, transitMode: "walk", transitDurationMin: 10 } });

  const hakusan = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: "c8942d75-0ef9-4944-8d8c-d8c8d40a6faf", orderNo: 3, name: "白山洞門",
      address: "高知県土佐清水市足摺岬", lat: 32.723203, lng: 133.013886,
      memo: "長い年月をかけて波の浸食を受けてできた花崗岩の海食洞門で、高知県の天然記念物に指定されています。洞門の目の前には、ジョン万次郎にちなんで名づけられた足湯「万次郎足湯」が整備されており、太平洋の眺めと洞門を目にしながら、歩き疲れた足を休めることができます。",
      visitTime: t(11, 55), stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hakusan.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  const manjiro = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: "73028ee1-eddc-429d-916c-7d993804e559", orderNo: 4, name: "ジョン万次郎資料館",
      address: "高知県土佐清水市養老303", lat: 32.781765, lng: 132.932404,
      memo: "足摺岬近くの中浜(現在の土佐清水市中浜)の漁師の子として生まれたジョン万次郎(中浜万次郎)の生涯を紹介する資料館です。万次郎は14歳のとき、漁の途中で遭難し、アメリカの捕鯨船に救助されました。その後アメリカで英語や航海術、造船技術などを学び、鎖国下の日本へ帰国したのちは、幕末の志士たちに欧米の知識を伝える役割を果たしました。館内には、万次郎ゆかりの品や、捕鯨・航海に関する資料が展示されています。近くには太平洋を見つめる万次郎の銅像も立っています。今夜は土佐清水市内または周辺の宿にご宿泊いただきます。",
      visitTime: t(12, 45), stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: manjiro.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });

  // --- 日2 ---
  await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: "6ef18abb-035d-42e1-99f7-04120e1452a6", orderNo: 1, name: "延光寺",
      address: "高知県宿毛市平田町中山390", lat: 32.962578, lng: 132.771194,
      memo: "四国霊場の第39番、土佐最後の札所です。神亀元年(724)、聖武天皇の勅願により行基が本尊の薬師如来像を刻んで開いたと伝わり、当初は「亀鶴山施薬院宝光寺」と呼ばれていました。延喜11年(911)、竜宮から現れたという赤い亀が、鐘を背負って寺の池に現れたという言い伝えが残り、この出来事にちなんで山号が「赤亀山」と改められました。仁王門をくぐった先には、この言い伝えにちなむ赤い亀の石像が立っています。実際に伝わる梵鐘には「鋳弥勒寺鐘」の銘があり、もとは別の寺のために鋳造された鐘であったとされ、延喜11年の年号とともに国の重要文化財に指定されています。本堂の右手には、弘法大師が薬師如来のお告げを受けて掘り当てたと伝わる「目洗いの井戸」があり、目の病にご利益があると伝えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
      visitTime: t(9, 0), stayDurationMin: 90,
    },
  });
  const kanyojima = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: "0051a746-8c02-4788-b6f5-3e3ba136b4e2", orderNo: 2, name: "咸陽島",
      address: "高知県宿毛市大島", lat: 32.913297, lng: 132.683288,
      memo: "宿毛湾に浮かぶ2つの無人島からなる咸陽島は、潮が引くと海の中から陸続きの道が現れる「トンボロ現象」で知られ、歩いて渡ることができます。足もとは貝殻の付いた岩場でやや歩きにくいので、歩きやすい靴でお出かけください。潮が満ちると道が消えるので、潮見表で時間を確かめ、満ちはじめる前に戻りましょう。春には桜が咲き誇る花見の名所として親しまれ、11月中旬から2月上旬ごろには、太陽が水平線に溶けるように沈む「だるま夕陽」が見られることでも知られています。隣接する咸陽島公園には、ビーチバレーなども楽しめる砂浜が広がります。",
      visitTime: t(10, 45), stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kanyojima.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });

  const odouan = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: "70f0868e-2330-4a77-9ad9-0bcbcd8c7c67", orderNo: 3, name: "大堂海岸",
      address: "高知県幡多郡大月町大堂", lat: 32.781434, lng: 132.664082,
      memo: "大月半島の南岸に続く大堂海岸は、足摺宇和海国立公園に指定された景勝地です。切り立った高い断崖は、白亜紀の地殻変動によって水成岩の地層に花崗岩が入り込んでできたもので、大堂山展望台からは断崖と宿毛湾、太平洋を360度見渡せます。海から突き出た高さ30mほどの花崗岩の岩は、観音菩薩に似た姿から「観音岩」と呼ばれています。断崖沿いの遊歩道は野生のニホンザルが暮らす「お猿公園」に続いており、足もとが切り立っているところもあるので、柵の外側には出ないよう気をつけて歩きましょう。四国八十八ヶ所の巡礼はここでいったん区切りとなり、次にお参りするのは愛媛県に入って40番観自在寺です。",
      visitTime: t(12, 0), stayDurationMin: 70,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: odouan.id, orderNo: 1, transitMode: "car", transitDurationMin: 25 } });

  console.log("  COMMITTED(#12を復元しました)");
}

main().finally(() => prisma.$disconnect());

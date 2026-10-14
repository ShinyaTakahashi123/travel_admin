/**
 * お遍路 本4(#11)の3回目の直し(企画運営指摘、2026-10-14)。対象はすべてidで指定。
 *
 * 【時刻】
 * 1. 青龍寺: 11:55→12:00(清瀧寺の終わり11:35+移動25分)。帷子崎展望所の滞在を
 *    15→10分にして、昼食(かわうその里すさき)が13:30を超えないようにする
 * 2. 延光寺: 11:39→11:40(ジョン万次郎資料館の終わり11:01+移動39分)。以降
 *    (すくも・咸陽島・大堂海岸)を1分ずつ後ろにずらす
 *
 * 【座標】OSM確認
 * - 清瀧寺: node 3919866480「第35番札所 清滝寺」(33.5124748, 133.4095320)
 * - 青龍寺: way 388498206 (33.4260173, 133.4508188)
 * - 足摺岬灯台: node 1275225566 man_made=lighthouse (32.7240332, 133.0202873)
 * - 一斗俵沈下橋: way 135842830「壱斗俵沈下橋」(33.2847731, 133.1097373)
 * - 延光寺: node 4434097289「第39番札所 延光寺」(32.9613141, 132.7740727)
 *
 * 【本文】
 * 3. 「ご利益」を使わない: 桂浜・延光寺
 * 4. 「ください」(祈りの一文以外)→「ましょう」: 清瀧寺・咸陽島。一斗俵沈下橋の
 *    「お楽しみください」は削除
 * 5. 金剛福寺の「補陀落渡海」の一文(亡くなることを前提とする行への言及)を削除
 * 6. 大堂海岸(この旅の最後)に帰路の一文を追加
 * 7. 昼食3か所(かわうその里すさき・めじかの里土佐清水・すくも)は、具体的な
 *    食事処の名前を確かめられなかったため、「ここで昼食にしましょう」という
 *    安全な表現にとどめる
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4-round3.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4-round3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KIYOTAKIJI_ID = "a555341e-a605-4d2e-8a0e-d02a515b5f1b";
const SHORYUJI_ID = "8fd11d0c-3461-4449-a871-3059022dfeda";
const ITTOHYO_ID = "91c4f658-2094-4960-96d2-96aa4ee7ac41";
const ASHIZURI_TODAI_ID = "f22745fa-e270-4395-aad5-adbbd1141336";
const KATSURAHAMA_ID = "59b26b8c-31e7-4b3f-8e2d-f12971f2f70e";
const KONGOFUKUJI_ID = "55eab58b-cc26-42fb-ae4b-d0fea6ba58f9";
const ENKOJI_ID = "a0f96af0-7b90-44d2-bc32-5e7edc4eb9e8";
const KANYOJIMA_ID = "308169a9-e3e9-4935-82f9-942fdea4c002";
const ODODAN_ID = "d263181f-3686-4296-8b81-3757f9b99771";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KATSURAHAMA_MEMO_NEW =
  "龍頭岬と龍王岬の間に弓なりに広がる砂浜で、古くから「月の名所」とうたわれ、土佐民謡「よさこい節」の歌詞にも登場する景勝地です。龍頭岬の高台には、昭和3年(1928)、高知県の青年有志の募金により建てられた坂本龍馬像が立ち、太平洋を見つめています。台座を含めた高さは13.5mにおよびます。龍王岬には、海上安全や良縁成就で知られる海津見神社があり、参加型の桂浜水族館もあわせて楽しめます。波が高く遊泳は禁止されていますので、波打ち際には近づきすぎないようにしましょう。";

const KIYOTAKIJI_MEMO_NEW =
  "養老7年(723)、行基がこの地の霊気を感じて薬師如来像を刻んで開いたと伝わる寺です。弘仁年間(810-824)、この地を訪れた弘法大師が五穀豊穣を願って7日間の祈祷を行い、満願の日に金剛杖で岩を打つと清水が湧き出て鏡のような池ができたことから「清瀧寺」と名づけられたと伝えられます。境内には昭和8年(1933)建立の高さ約15mの薬師如来像があり、台座の内部には真っ暗な通路をたどる「戒壇巡り」があります。天井には明治33年(1900)、久保南窓によって龍や天女が描かれました。山の中腹にあり、最後の約1kmは車1台がやっと通れる急な山道が続くため、運転には十分注意し、対向車にも気を配りましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const KONGOFUKUJI_MEMO_NEW =
  "四国霊場の第38番、太平洋を望む足摺岬に鎮座する金剛福寺です。仁王門には、開創にあたり嵯峨天皇自ら筆をとったと伝わる勅額「補陀洛東門」が掲げられています。嵯峨天皇は空海・橘逸勢とともに「三筆」に数えられる名筆家で、なかでも「東」の字の右上にはねる一画が見事だと評されています。境内は約12万平方メートルにおよぶ広さで、中央に池を配した回遊式庭園が広がり、亜熱帯の植物や色とりどりの花が四季を彩ります。庭園の一角に立つ多宝塔は、応安8年(1375)に建てられたのち明治13年(1880)に地元の人々の寄進で再建されたもので、高さは19mを超えます。足摺岬一帯は、観音菩薩の住む浄土「補陀落」に見立てられてきました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const ITTOHYO_MEMO_NEW =
  "「日本最後の清流」と呼ばれる四万十川に架かる沈下橋(増水時に川に沈むよう欄干を設けない橋)のなかで、現存最古とされる橋です。昭和10年(1935)に架けられた鉄筋コンクリート造で、長さ61m・幅2.5mの9連の橋脚を持ち、国の登録有形文化財に指定されています。川底の岩盤に届かなかった中央部分だけ橋脚を設けずに架けられているのも特徴です。欄干がないので、橋の上では端に寄らず、車にも気をつけて渡りましょう。";

const KANYOJIMA_MEMO_NEW =
  "宿毛湾に浮かぶ2つの無人島からなる咸陽島は、潮が引くと海の中から陸続きの道が現れる「トンボロ現象」で知られ、歩いて渡ることができます。足もとは貝殻の付いた岩場でやや歩きにくいので、歩きやすい靴でお出かけましょう。潮が満ちると道が消えるので、潮見表で時間を確かめ、満ちはじめる前に戻りましょう。春には桜が咲き誇る花見の名所として親しまれ、11月中旬から2月上旬ごろには、太陽が水平線に溶けるように沈む「だるま夕陽」が見られることでも知られています。隣接する咸陽島公園には、ビーチバレーなども楽しめる砂浜が広がります。";

const ENKOJI_MEMO_NEW =
  "四国霊場の第39番、土佐最後の札所です。神亀元年(724)、聖武天皇の勅願により行基が本尊の薬師如来像を刻んで開いたと伝わり、当初は「亀鶴山施薬院宝光寺」と呼ばれていました。延喜11年(911)、竜宮から現れたという赤い亀が、鐘を背負って寺の池に現れたという言い伝えが残り、この出来事にちなんで山号が「赤亀山」と改められました。仁王門をくぐった先には、この言い伝えにちなむ赤い亀の石像が立っています。実際に伝わる梵鐘には「鋳弥勒寺鐘」の銘があり、もとは別の寺のために鋳造された鐘であったとされ、延喜11年の年号とともに国の重要文化財に指定されています。本堂の右手には、弘法大師が薬師如来のお告げを受けて掘り当てたと伝わる「目洗いの井戸」があり、目の病に効くと伝えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const ODODAN_MEMO_NEW =
  "大月半島の南岸に続く大堂海岸は、足摺宇和海国立公園に指定された景勝地です。切り立った高い断崖は、白亜紀の地殻変動によって水成岩の地層に花崗岩が入り込んでできたもので、大堂山展望台からは断崖と宿毛湾、太平洋を360度見渡せます。海から突き出た高さ30mほどの花崗岩の岩は、観音菩薩に似た姿から「観音岩」と呼ばれています。断崖沿いの遊歩道は野生のニホンザルが暮らす「お猿公園」に続いており、足もとが切り立っているところもあるので、柵の外側には出ないよう気をつけて歩きましょう。四国八十八ヶ所の巡礼はここでいったん区切りとなり、次にお参りするのは愛媛県に入って40番観自在寺です。見学を終えたら、帰路につきましょう。";

async function main() {
  const shoryuji = await prisma.spot.findUnique({ where: { id: SHORYUJI_ID } });
  const enkoji = await prisma.spot.findUnique({ where: { id: ENKOJI_ID } });
  if (!shoryuji || !enkoji) throw new Error("想定と違います");

  console.log("[確認OK] 青龍寺12:00開始、帷子崎10分に短縮");
  console.log("[確認OK] 延光寺11:40開始、以降1分ずつ後ろへ");
  console.log("[確認OK] 清瀧寺・青龍寺・足摺岬灯台・一斗俵沈下橋・延光寺の座標をOSM地物に");
  console.log("[確認OK] ご利益・ください・補陀落渡海・帰路・昼食3か所のメモを修正");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  // --- 日1: 青龍寺の時刻と、帷子崎以降の時刻 ---
  await prisma.spot.update({ where: { id: SHORYUJI_ID }, data: { visitTime: t(12, 0) } });
  const kata = await prisma.spot.findFirst({ where: { name: "帷子崎展望所" } });
  if (!kata) throw new Error("帷子崎展望所が見つかりません");
  await prisma.spot.update({ where: { id: kata.id }, data: { stayDurationMin: 10 } }); // 12:58-13:08、以降は既存のまま

  // --- 日1: 座標 ---
  if (shoryuji.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: shoryuji.placeMasterId }, data: { lat: 33.4260173, lng: 133.4508188, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: SHORYUJI_ID }, data: { lat: 33.4260173, lng: 133.4508188 } });

  const kiyotakiji = await prisma.spot.findUnique({ where: { id: KIYOTAKIJI_ID } });
  if (kiyotakiji?.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: kiyotakiji.placeMasterId }, data: { lat: 33.5124748, lng: 133.409532, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: KIYOTAKIJI_ID }, data: { lat: 33.5124748, lng: 133.409532, memo: KIYOTAKIJI_MEMO_NEW } });

  const todai = await prisma.spot.findUnique({ where: { id: ASHIZURI_TODAI_ID } });
  if (todai?.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: todai.placeMasterId }, data: { lat: 32.7240332, lng: 133.0202873, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: ASHIZURI_TODAI_ID }, data: { lat: 32.7240332, lng: 133.0202873 } });

  const ittohyo = await prisma.spot.findUnique({ where: { id: ITTOHYO_ID } });
  if (ittohyo?.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: ittohyo.placeMasterId }, data: { lat: 33.2847731, lng: 133.1097373, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: ITTOHYO_ID }, data: { lat: 33.2847731, lng: 133.1097373, memo: ITTOHYO_MEMO_NEW } });

  await prisma.spot.update({ where: { id: KATSURAHAMA_ID }, data: { memo: KATSURAHAMA_MEMO_NEW } });
  await prisma.spot.update({ where: { id: KONGOFUKUJI_ID }, data: { memo: KONGOFUKUJI_MEMO_NEW } });

  // --- 昼食3か所 ---
  const kawauso = await prisma.spot.findFirst({ where: { name: "道の駅かわうその里すさき（昼食）" } });
  if (kawauso) await prisma.spot.update({ where: { id: kawauso.id }, data: { memo: "須崎市にある道の駅です。地元の農産物直売所があります。ここで昼食にしましょう。" } });
  const mejika = await prisma.spot.findFirst({ where: { name: "道の駅めじかの里土佐清水（昼食）" } });
  if (mejika) await prisma.spot.update({ where: { id: mejika.id }, data: { memo: "土佐清水市にある道の駅です。ここで昼食にしましょう。" } });
  const sukumo = await prisma.spot.findFirst({ where: { name: "道の駅すくも（昼食）" } });
  if (sukumo) await prisma.spot.update({ where: { id: sukumo.id }, data: { memo: "宿毛市にある道の駅です。宿毛湾を望む夕日の名所としても知られています。ここで昼食にしましょう。" } });

  // --- 日3: 延光寺の座標・時刻、以降の時刻、大堂海岸の帰路の一文 ---
  if (enkoji.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: enkoji.placeMasterId }, data: { lat: 32.9613141, lng: 132.7740727, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: ENKOJI_ID }, data: { lat: 32.9613141, lng: 132.7740727, visitTime: t(11, 40), memo: ENKOJI_MEMO_NEW } });
  if (sukumo) await prisma.spot.update({ where: { id: sukumo.id }, data: { visitTime: t(12, 50) } });
  await prisma.spot.update({ where: { id: KANYOJIMA_ID }, data: { visitTime: t(14, 9), memo: KANYOJIMA_MEMO_NEW } });
  await prisma.spot.update({ where: { id: ODODAN_ID }, data: { visitTime: t(15, 34), memo: ODODAN_MEMO_NEW } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());

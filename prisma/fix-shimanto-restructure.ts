/**
 * 組み直し、44e8538a（四万十川と沈下橋、「日本最後の清流」を望む日帰りプラン）。(10本目/10)
 *
 * 点の直し(OSM・Nominatim。生データAPIで実在の点に):
 *  佐田沈下橋 32.9931,132.9389(4けた。中村の町なかに約6km引き寄せられた値) →
 *    tourism=viewpoint node4472139789「佐田沈下橋」33.0154318,132.8859487
 *  三里沈下橋 33.011187,132.873003 → tourism=attraction node5537425922「三里沈下橋」
 *    33.0111100,132.8728927(約15mの丸めの直し)
 *  高瀬沈下橋・一條神社は、すでにOSMの値と一致(変更なし)
 *
 * 旅の足の組み直し(routed-carで測り直し。車の分にはOSRM+5分を適用。乗用車でも那須と
 *  同じ決まり):
 *  高瀬沈下橋→三里沈下橋 12分(車5.86km・6.5分+5、もと5分。法務の指摘)
 *  四万十川の屋形船(三里乗船場)→佐田沈下橋 12分(車4,745m・6.2分+5、もと10分)
 *  佐田沈下橋→中村駅のあたり(昼食) 14分(車7,537m・8.9分+5)
 *  中村駅のあたり(昼食)→一條神社 7分(車1,702m・2.0分+5)
 *  四万十市立郷土博物館→あきついお 11分(車5.9分+5、もと10分。法務の指摘)
 *
 * 昼食: 「周辺の飲食店で昼食をとりましょう。」とあったが、正しい佐田沈下橋の点のまわり
 *  約1kmにOSMの飲食店がなく、橋から約60mにあった「屋形舟さこや」も、四万十市観光協会の
 *  公式サイト(shimanto-kankou.com/food)で閉業と確認した。中村の市街地(一條神社・郷土
 *  博物館のそば)には、同じ公式サイトに食事処が多数掲載されているため、新規スポット
 *  「中村駅のあたり（昼食）」(railway=station node8383599027「中村」33.9843748,
 *  132.9440278、店ではない点。駅前の中村大橋通に、公式サイト掲載の食事処が複数ある)を、
 *  佐田沈下橋と一條神社の間に追加した。店の名前は書かない。40分、13:18始まりで
 *  11:30〜13:30の中
 *
 * 入口・帰りの一文を追加(中村駅⇔高瀬沈下橋・あきついお、routed-car+5):
 *  高瀬沈下橋への入口: 中村駅からレンタカーでおよそ16分(車13.4km・10.4分+5)
 *  あきついおからの帰り: 中村駅までレンタカーでおよそ10分(車3.5km・4.4分+5)
 *
 * 言葉の直し:
 *  佐田沈下橋「多くの人に親しまれています」「四万十川を代表する観光スポットです」
 *   (出典のない評価)を削除
 *  行き先の名前「屋形船 四万十の碧」は運航している所の名前に当たるため「四万十川の屋形船」
 *   に変更(企画運営の決定)。メモの中にも「四万十の碧」の名前は書かない
 *  あきついおの終わりの文「見学を終えたら、車で四万十市街・中村駅方面へ戻りましょう」→
 *   帰りの一文の形に。タイトル・説明文の「定番」を外す(那須・昇仙峡と同じ扱い)
 *  すべての行き先(最後を除く)の書き出しを「〜から車でおよそN分、◯◯に着きます。」の形に
 *   そろえ、終わりの文に「この後は、〜でおよそN分、◯◯へ向かいましょう」を追加
 *
 * 佐田沈下橋の滞在を100→60分に短縮(昼食の時間を別のスポットに移したため。決まりA、
 *  縮めるのはいつでも可)
 *
 * 時刻の組み直し: 高瀬沈下橋09:00(50分)→三里沈下橋10:02(40分)→屋形船10:52(60分)→
 *  佐田沈下橋12:04(60分)→中村駅のあたり(昼食)13:18(40分)→一條神社14:05(30分)→
 *  郷土博物館14:45(60分)→あきついお15:56(60分)、終わり16:56(日帰りの発車16:30〜17:00の中)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "44e8538a-315e-4ab9-8ed5-1451de24b872";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TAKASE = "高瀬沈下橋";
const MISATO = "三里沈下橋";
const YAKATABUNE = "屋形船 四万十の碧";
const SADA = "佐田沈下橋";
const ICHIJOU = "一條神社";
const KYODO = "四万十市立郷土博物館";
const AKITSUIO = "四万十川学遊館あきついお";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const takase = await prisma.spot.findFirstOrThrow({ where: { name: TAKASE, day: { itineraryId: ITIN_ID } } });
  const misato = await prisma.spot.findFirstOrThrow({ where: { name: MISATO, day: { itineraryId: ITIN_ID } } });
  const yakatabune = await prisma.spot.findFirstOrThrow({ where: { name: YAKATABUNE, day: { itineraryId: ITIN_ID } } });
  const sada = await prisma.spot.findFirstOrThrow({ where: { name: SADA, day: { itineraryId: ITIN_ID } } });
  const ichijou = await prisma.spot.findFirstOrThrow({ where: { name: ICHIJOU, day: { itineraryId: ITIN_ID } } });
  const kyodo = await prisma.spot.findFirstOrThrow({ where: { name: KYODO, day: { itineraryId: ITIN_ID } } });
  const akitsuio = await prisma.spot.findFirstOrThrow({ where: { name: AKITSUIO, day: { itineraryId: ITIN_ID } } });

  const checks: { name: string; lat: number; lng: number; got: { lat: unknown; lng: unknown } }[] = [
    { name: MISATO, lat: 33.011187, lng: 132.873003, got: misato },
    { name: SADA, lat: 32.9931, lng: 132.9389, got: sada },
  ];
  for (const c of checks) {
    if (Math.abs(Number(c.got.lat) - c.lat) > 1e-4 || Math.abs(Number(c.got.lng) - c.lng) > 1e-4) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致(現在 ${c.got.lat},${c.got.lng})`);
    }
  }

  const TAKASE_MEMO_OLD =
    "高瀬沈下橋は、全長232.3mの沈下橋で、四万十川の沈下橋の中でも長い橋の一つです。昭和48年(1973)に架けられました。沈下橋は、増水時に川に沈んで橋の流失を防ぐという工夫から、欄干が設けられていないのが特徴です。川面とほとんど段差のない橋の上から眺める四万十川の流れを、静かに楽しみましょう。欄干がない橋のため、車の運転や歩行には気をつけましょう。";
  const TAKASE_MEMO_NEW =
    "中村駅からレンタカーでおよそ16分、高瀬沈下橋に着きます。全長232.3mの沈下橋で、四万十川の沈下橋の中でも長い橋の一つです。昭和48年(1973)に架けられました。沈下橋は、増水時に川に沈んで橋の流失を防ぐという工夫から、欄干が設けられていないのが特徴です。川面とほとんど段差のない橋の上から眺める四万十川の流れを、静かに楽しみましょう。欄干がない橋のため、車の運転や歩行には気をつけましょう。この後は、車でおよそ12分、三里沈下橋へ向かいましょう。";
  if (takase.memo !== TAKASE_MEMO_OLD) throw new Error("高瀬沈下橋: memo現在値が期待と不一致");

  const MISATO_MEMO_OLD =
    "高瀬沈下橋からは車で5分ほどです。三里沈下橋は、全長145.8mの沈下橋で、昭和38年(1963)に架けられました。佐田沈下橋・高瀬沈下橋とあわせて、四万十川を代表する沈下橋として知られています。橋のたもとから眺める川と山々の景色は、四万十川らしい原風景を今に伝えています。欄干がない橋のため、車の運転や歩行には気をつけましょう。";
  const MISATO_MEMO_NEW =
    "高瀬沈下橋から車でおよそ12分、三里沈下橋に着きます。全長145.8mの沈下橋で、昭和38年(1963)に架けられました。佐田沈下橋・高瀬沈下橋とあわせて、四万十川を代表する沈下橋として知られています。橋のたもとから眺める川と山々の景色は、四万十川らしい原風景を今に伝えています。欄干がない橋のため、車の運転や歩行には気をつけましょう。この後は、歩いておよそ10分、四万十川の屋形船の乗船場へ向かいましょう。";
  if (misato.memo !== MISATO_MEMO_OLD) throw new Error("三里沈下橋: memo現在値が期待と不一致");

  const YAKATABUNE_MEMO_OLD =
    "三里沈下橋からは歩いて10分ほどです(三里乗船場から乗船します)。屋形船「四万十の碧」は、三里沈下橋から佐田沈下橋までの約4kmを、屋形船で行き来する遊覧船です。沈下橋の下をくぐり抜けながら川面から眺める四万十川は、陸から見るのとはまた違った趣があります。予約が必要な場合があるので、訪れる前に確認しましょう。";
  const YAKATABUNE_MEMO_NEW =
    "三里沈下橋から歩いておよそ10分、四万十川の屋形船の乗船場(三里乗船場)に着きます。三里沈下橋から佐田沈下橋までの約4kmを、屋形船で行き来する遊覧船です。沈下橋の下をくぐり抜けながら川面から眺める四万十川は、陸から見るのとはまた違った趣があります。予約が必要な場合があるので、訪れる前に確認しましょう。この後は、車でおよそ12分、佐田沈下橋へ向かいましょう。";
  if (yakatabune.memo !== YAKATABUNE_MEMO_OLD) throw new Error("屋形船: memo現在値が期待と不一致");

  const SADA_MEMO_OLD =
    "三里乗船場からは車で10分ほどです。佐田沈下橋は、「日本最後の清流」と呼ばれる四万十川の最も下流に架かる沈下橋で、全長およそ291.6m、幅およそ4.2mと、川に40本以上ある沈下橋の中でも最長とされています。昭和47年(1972)に架けられたこの橋には、増水時に水中に沈んで流失を防ぐという沈下橋ならではの工夫から、欄干が設けられていません。そのため、水面とほとんど段差のない橋の上に立つと、まるで川と一体になったかのような独特の風情を味わうことができ、四万十川を代表する観光スポットとして、多くの人に親しまれています。橋の上から眺める川面と、対岸まで続く長い橋のシルエットは、まさに清流の川そのものが主役の景観です。周辺の飲食店で昼食をとりましょう。欄干がない橋のため、車の運転や歩行にはくれぐれも気をつけましょう。";
  const SADA_MEMO_NEW =
    "三里乗船場から車でおよそ12分、佐田沈下橋に着きます。「日本最後の清流」と呼ばれる四万十川の最も下流に架かる沈下橋で、全長およそ291.6m、幅およそ4.2mと、川に40本以上ある沈下橋の中でも最長とされています。昭和47年(1972)に架けられたこの橋には、増水時に水中に沈んで流失を防ぐという沈下橋ならではの工夫から、欄干が設けられていません。そのため、水面とほとんど段差のない橋の上に立つと、まるで川と一体になったかのような独特の風情を味わうことができます。橋の上から眺める川面と、対岸まで続く長い橋のシルエットは、まさに清流の川そのものが主役の景観です。欄干がない橋のため、車の運転や歩行にはくれぐれも気をつけましょう。この後は、車でおよそ14分、中村駅のあたりへ向かいましょう。";
  if (sada.memo !== SADA_MEMO_OLD) throw new Error("佐田沈下橋: memo現在値が期待と不一致");

  const NAKAMURA_MEMO_NEW =
    "佐田沈下橋から車でおよそ14分、中村駅のあたりに着きます。駅前の中村大橋通には、食事ができる店が集まっています。ここで昼食にしましょう。この後は、車でおよそ7分、一條神社へ向かいましょう。";

  const ICHIJOU_MEMO_OLD =
    "佐田沈下橋からは車で5分ほどです。一條神社は、応仁の乱を避けて中村に下向した前関白・一条教房を祖とする土佐一条氏の遺徳をしのび、地元有志によって建立された神社です。教房の父・一条兼良をはじめ、土佐一条氏歴代の霊が祀られています。創建は文久2年(1862)で、現在の社殿は昭和19年(1944)の建立です。地元では「いちじょこさん」の愛称で親しまれています。静かに、敬意をもってお参りしましょう。";
  const ICHIJOU_MEMO_NEW =
    "中村駅から車でおよそ7分、一條神社に着きます。応仁の乱を避けて中村に下向した前関白・一条教房を祖とする土佐一条氏の遺徳をしのび、地元有志によって建立された神社です。教房の父・一条兼良をはじめ、土佐一条氏歴代の霊が祀られています。創建は文久2年(1862)で、現在の社殿は昭和19年(1944)の建立です。地元では「いちじょこさん」の愛称で親しまれています。静かに、敬意をもってお参りしましょう。この後は、歩いておよそ10分、四万十市立郷土博物館へ向かいましょう。";
  if (ichijou.memo !== ICHIJOU_MEMO_OLD) throw new Error("一條神社: memo現在値が期待と不一致");

  const KYODO_MEMO_OLD =
    "一條神社からは歩いて10分ほどです。四万十市立郷土博物館は、中村城跡が残る為松公園の一角に建つ、城の形をした資料館です。四万十川とともに歩んできたこの土地の自然・歴史・文化を、「川とともに生きるまち」をテーマに紹介しています。天守閣風の建物からは、四万十川や市街地を見渡すこともできます。休館日があるので、訪れる前に公式の案内で確かめましょう。";
  const KYODO_MEMO_NEW =
    "一條神社から歩いておよそ10分、四万十市立郷土博物館に着きます。中村城跡が残る為松公園の一角に建つ、城の形をした資料館です。四万十川とともに歩んできたこの土地の自然・歴史・文化を、「川とともに生きるまち」をテーマに紹介しています。天守閣風の建物からは、四万十川や市街地を見渡すこともできます。休館日があるので、訪れる前に公式の案内で確かめましょう。この後は、車でおよそ11分、四万十川学遊館あきついおへ向かいましょう。";
  if (kyodo.memo !== KYODO_MEMO_OLD) throw new Error("四万十市立郷土博物館: memo現在値が期待と不一致");

  const AKITSUIO_MEMO_OLD =
    "四万十市立郷土博物館からは車で10分ほどです。四万十川学遊館あきついおは、四万十市トンボ自然公園にある、トンボと魚の博物館です。とんぼ館では、トンボの標本や生態を紹介し、さかな館では、四万十川に生息するアカメなど、国内外の淡水魚・汽水魚をあわせておよそ120種500尾展示しています。トンボ自然公園には池や湿地をめぐる散策路もあり、四万十川の自然を身近に感じることができます。休館日があるので、訪れる前に公式の案内で確かめましょう。 見学を終えたら、車で四万十市街・中村駅方面へ戻りましょう。";
  const AKITSUIO_MEMO_NEW =
    "四万十市立郷土博物館から車でおよそ11分、四万十川学遊館あきついおに着きます。四万十市トンボ自然公園にある、トンボと魚の博物館です。とんぼ館では、トンボの標本や生態を紹介し、さかな館では、四万十川に生息するアカメなど、国内外の淡水魚・汽水魚をあわせておよそ120種500尾展示しています。トンボ自然公園には池や湿地をめぐる散策路もあり、四万十川の自然を身近に感じることができます。休館日があるので、訪れる前に公式の案内で確かめましょう。帰りは、車でおよそ10分の中村駅まで戻りましょう。四万十川と沈下橋、「日本最後の清流」を望む日帰りプランは、これで終わりです。";
  if (akitsuio.memo !== AKITSUIO_MEMO_OLD) throw new Error("四万十川学遊館あきついお: memo現在値が期待と不一致");

  const TITLE_OLD = "四万十川と沈下橋、「日本最後の清流」を望む定番日帰りプラン";
  const TITLE_NEW = "四万十川と沈下橋、「日本最後の清流」を望む日帰りプラン";
  const DESC_OLD = "「日本最後の清流」と称される四万十川。欄干のない沈下橋が点在する風景を望む、四万十観光の定番プランです。";
  const DESC_NEW = "「日本最後の清流」と称される四万十川。欄干のない沈下橋が点在する風景を望む、日帰りプランです。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.title !== TITLE_OLD) throw new Error("title現在値が期待と不一致");
  if (itin.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  console.log(`\n[高瀬沈下橋]\n旧: ${TAKASE_MEMO_OLD}\n新: ${TAKASE_MEMO_NEW}`);
  console.log(`\n[三里沈下橋]\n旧: ${MISATO_MEMO_OLD}\n新: ${MISATO_MEMO_NEW}`);
  console.log(`\n[四万十川の屋形船(名前を変更。もと「屋形船 四万十の碧」)]\n旧: ${YAKATABUNE_MEMO_OLD}\n新: ${YAKATABUNE_MEMO_NEW}`);
  console.log(`\n[佐田沈下橋]\n旧: ${SADA_MEMO_OLD}\n新: ${SADA_MEMO_NEW}`);
  console.log(`\n[中村駅のあたり（昼食）(新規)]\n新: ${NAKAMURA_MEMO_NEW}`);
  console.log(`\n[一條神社]\n旧: ${ICHIJOU_MEMO_OLD}\n新: ${ICHIJOU_MEMO_NEW}`);
  console.log(`\n[四万十市立郷土博物館]\n旧: ${KYODO_MEMO_OLD}\n新: ${KYODO_MEMO_NEW}`);
  console.log(`\n[四万十川学遊館あきついお]\n旧: ${AKITSUIO_MEMO_OLD}\n新: ${AKITSUIO_MEMO_NEW}`);
  console.log(`\n[タイトル]\n旧: ${TITLE_OLD}\n新: ${TITLE_NEW}`);
  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`高瀬沈下橋: 座標変更なし / 時刻09:00(変更なし) / 滞在50分(変更なし)`);
  console.log(`三里沈下橋: 座標33.0111100,132.8728927 / 時刻09:55→10:02 / 滞在40分(変更なし) / incoming car5→12分(OSRM6.5分+5)`);
  console.log(`四万十川の屋形船(名前変更): 座標変更なし / 時刻10:45→10:52 / 滞在60分(変更なし) / incoming walk10分(変更なし)`);
  console.log(`佐田沈下橋: 座標33.0154318,132.8859487 / 時刻11:55→12:04 / 滞在100→60分 / incoming car10→12分(OSRM6.2分+5)`);
  console.log(`中村駅のあたり（昼食）(新規): 座標32.9843748,132.9440278 / 時刻13:18 / 滞在40分 / incoming car14分(OSRM8.9分+5)`);
  console.log(`一條神社: 座標変更なし / 時刻13:40→14:05 / 滞在30分(変更なし) / incoming car5→7分(OSRM2.0分+5)`);
  console.log(`四万十市立郷土博物館: 座標変更なし / 時刻14:20→14:45 / 滞在60分(変更なし) / incoming walk10分(変更なし)`);
  console.log(`四万十川学遊館あきついお: 座標変更なし / 時刻15:30→15:56 / 滞在60分(変更なし) / incoming car10→11分(OSRM5.9分+5)`);
  console.log("終わり: 15:56+60分=16:56（日帰りの発車16:30〜17:00の中）。帰りは車でおよそ10分の中村駅");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = takase.dayId;

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
    await setDaySpotOrder(
      dayId,
      [
        { id: takase.id, data: { memo: TAKASE_MEMO_NEW } },
        {
          id: misato.id,
          data: {
            memo: MISATO_MEMO_NEW,
            lat: 33.01111,
            lng: 132.8728927,
            visitTime: t(10, 2),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
          },
        },
        { id: yakatabune.id, data: { name: "四万十川の屋形船", memo: YAKATABUNE_MEMO_NEW, visitTime: t(10, 52) } },
        {
          id: sada.id,
          data: {
            memo: SADA_MEMO_NEW,
            lat: 33.0154318,
            lng: 132.8859487,
            visitTime: t(12, 4),
            stayDurationMin: 60,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
          },
        },
        {
          create: {
            name: "中村駅のあたり（昼食）",
            lat: 32.9843748,
            lng: 132.9440278,
            memo: NAKAMURA_MEMO_NEW,
            visitTime: t(13, 18),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 14 }] },
          },
        },
        {
          id: ichijou.id,
          data: {
            memo: ICHIJOU_MEMO_NEW,
            visitTime: t(14, 5),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
          },
        },
        { id: kyodo.id, data: { memo: KYODO_MEMO_NEW, visitTime: t(14, 45) } },
        {
          id: akitsuio.id,
          data: {
            memo: AKITSUIO_MEMO_NEW,
            visitTime: t(15, 56),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 11 }] },
          },
        },
      ],
      { remove: [], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

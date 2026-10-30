/**
 * #29 竜串海岸とジョン万次郎資料館(47214a80) ラウンド4: 本番全点確認での座標の是正
 *
 * 法務の本番確認で、もとからある5点が決まりに合わないと指摘された。最初の案内に誤りが
 * あり(別の点の番号を伝えていた)、法務が道具を直して再確認した結果にもとづき、5点とも
 * このスクリプトで直す。
 *
 * 1. 竜串グラスボート・見残し海岸: 竜串海岸と同じ点だったのを、「竜串観光汽船
 *    （グラスボート）」node4984013237(shop=ticket、乗り場そのもの、Nominatimの値)に
 *    修正。メモの「乗り場」の記述と正確に合う。
 * 2. 柏島: 島の面(place=island)の中心だったのを、「柏島漁港」node13430146501
 *    (man_made=harbour、Nominatimの値、現在値から約463m、もう一つの柏島漁港node
 *    13430116600より近い)に修正。メモに漁港のことばを補って点と合わせる。
 * 3. 白山洞門: 地名(place=locality)の点だったのを、地理院の地名検索の値そのもの
 *    (32.723203,133.013886、#121福泉寺と同じ扱い)に修正。現在値とはほぼ同じ(約27m)。
 * 4. 大岐海岸: 砂浜のway(389572324)のNominatim中心だったのを、同じwayの実在の頂点の
 *    うち中心に最も近いもの(32.8194085,132.9511375、現在値から約60m、生のnode)に修正。
 * 5. 中浜(ジョン万次郎生家): 地名(place=quarter)の点だったのを、企画運営の指示で、
 *    土佐清水市観光協会の生家のページ(https://www.shimizu-kankou.com/spot/manjiroseika/)
 *    の住所「高知県土佐清水市中浜252-5」を地理院の住所検索にかけた値(32.760227,
 *    132.965225、現在値から約110m)に修正。郵便局の点(現在値から約220m、生家とは別施設)
 *    は使わない。
 *
 * 座標の直しに伴い、まわりの区間をOSRMで測り直した:
 * ・足摺海洋館→竜串グラスボート(新点): 9→8分
 * ・竜串グラスボート(新点)→大堂海岸: 40→35分
 * ・大堂海岸→柏島(新点): 9→13分
 * ・大岐海岸(新点)→ジョン万次郎資料館: 8→13分
 * ・ジョン万次郎資料館→中浜(新点): 10→15分
 * ・中浜(新点)→唐人駄場遺跡: 8→12分
 * Day1の出発は16:50→16:48(範囲16:30〜17:00内)。Day2は、中浜の点の直しで9分増えた分を
 * 中浜35→30・白山洞門20→11の滞在短縮(決まりA)で吸収し、出発は16:31でもとのまま。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const SATOUMI = "ae5b6cd0-a4dc-42e4-8c01-79c607d56991";
const GLASS_BOAT = "e28e2334-4b4d-4bd7-9216-13ded80bc187";
const ODO_KAIGAN = "fb050c23-3dfd-45c9-bc1f-4ab1097ee065";
const KASHIWAJIMA = "824dd1c4-52ec-4a95-b802-80a9bba71275";
const OKI_KAIGAN = "15aa47d3-02e7-4f57-bfed-70030bab903f";
const MANJIRO_SHIRYOKAN = "d68b111e-a317-403c-ab7a-83d2a865f517";
const NAKANOHAMA = "8eaee671-8d0f-476e-a023-fde6bb6ac543";
const TOJINDABA = "d2c28316-82aa-46fb-b631-c70b9add2080";
const ASHIZURIMISAKI_INFO_NAME = "足摺岬観光案内所";
const HAKUSAN_DOMON = "3c56a4b2-1af0-4d32-ac41-e323cf4b379d";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KASHIWAJIMA_MEMO_OLD =
  "大堂海岸から車でおよそ9分、橋を渡って柏島に着きます。黒潮と豊後水道の流れがぶつかる海域に浮かぶ小島で、抜群の透明度を誇るエメラルドグリーンの海は、まるで船が宙に浮いているように見えると評判です。多くの魚種が生息する海として、国内屈指のダイビングスポットともいわれています。島内の集落を歩きながら、橋の上や岸辺から、透き通った海の色をゆっくりと眺めましょう。竜串海岸から続いた、この日めぐった海中美も、ここでひと区切りです。この夜は、柏島のあたりの宿に泊まりましょう。";
const KASHIWAJIMA_MEMO_NEW =
  "大堂海岸から車でおよそ13分、橋を渡って柏島漁港のあたりに着きます。黒潮と豊後水道の流れがぶつかる海域に浮かぶ小島で、抜群の透明度を誇るエメラルドグリーンの海は、まるで船が宙に浮いているように見えると評判です。多くの魚種が生息する海として、国内屈指のダイビングスポットともいわれています。島内の集落を歩きながら、橋の上や岸辺から、透き通った海の色をゆっくりと眺めましょう。竜串海岸から続いた、この日めぐった海中美も、ここでひと区切りです。この夜は、柏島のあたりの宿に泊まりましょう。";

const SATOUMI_MEMO_OLD =
  "竜串海岸から車でおよそ9分、足摺海洋館「SATOUMI」に着きます。およそ350種1万5千点の生き物を、70基の水槽で紹介する水族館で、黒潮の恵みを受けた足摺の海の生態系を、大きな水槽でまるごと再現しています。館内にはカフェもあるので、ここで昼食にしましょう。館内をゆっくりとめぐって、足摺の海の豊かさを体感しましょう。この後は、車でおよそ9分、竜串グラスボート乗り場へ向かいましょう。";
const SATOUMI_MEMO_NEW =
  "竜串海岸から車でおよそ9分、足摺海洋館「SATOUMI」に着きます。およそ350種1万5千点の生き物を、70基の水槽で紹介する水族館で、黒潮の恵みを受けた足摺の海の生態系を、大きな水槽でまるごと再現しています。館内にはカフェもあるので、ここで昼食にしましょう。館内をゆっくりとめぐって、足摺の海の豊かさを体感しましょう。この後は、車でおよそ8分、竜串グラスボート乗り場へ向かいましょう。";

const GLASS_BOAT_MEMO_OLD =
  "足摺海洋館「SATOUMI」から車でおよそ9分、竜串グラスボートの乗り場に着きます。底がガラス張りになった船に乗り込み、船上から竜串の海に群生するテーブルサンゴや、色とりどりの熱帯魚が泳ぐ海中の景色を眺めることができます。航路の先には、弘法大師がこの絶景を見残したという言い伝えが名の由来と伝わる見残し海岸があり、上陸すれば、竜串とはまた違った表情の奇岩群を間近で歩くこともできます。天候により運航状況が変わるので、訪れる前に公式サイトで確かめましょう。竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせて楽しみましょう。この後は、車でおよそ40分、大月町の大堂海岸へ向かいましょう。";
const GLASS_BOAT_MEMO_NEW =
  "足摺海洋館「SATOUMI」から車でおよそ8分、竜串グラスボートの乗り場に着きます。底がガラス張りになった船に乗り込み、船上から竜串の海に群生するテーブルサンゴや、色とりどりの熱帯魚が泳ぐ海中の景色を眺めることができます。航路の先には、弘法大師がこの絶景を見残したという言い伝えが名の由来と伝わる見残し海岸があり、上陸すれば、竜串とはまた違った表情の奇岩群を間近で歩くこともできます。天候により運航状況が変わるので、訪れる前に公式サイトで確かめましょう。竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせて楽しみましょう。この後は、車でおよそ35分、大月町の大堂海岸へ向かいましょう。";

const ODO_KAIGAN_MEMO_OLD =
  "竜串グラスボート乗り場から車でおよそ40分、大月町の大堂海岸に着きます。切り立った白い岩肌の断崖が海岸線に連なり、断崖の縁に沿って整備された遊歩道を歩きながら、青い海と白い岩壁が織りなす大パノラマを眺めることができます。大堂山展望台まで登れば、柏島の島影まで見渡す360度の景色が広がります。周辺には「大堂お猿公園」もあり、およそ200匹の野生のニホンザルが暮らす姿を見られることもあります。断崖の縁には近づかず、遊歩道から眺めましょう。この後は、車でおよそ9分、柏島へ向かいましょう。";
const ODO_KAIGAN_MEMO_NEW =
  "竜串グラスボート乗り場から車でおよそ35分、大月町の大堂海岸に着きます。切り立った白い岩肌の断崖が海岸線に連なり、断崖の縁に沿って整備された遊歩道を歩きながら、青い海と白い岩壁が織りなす大パノラマを眺めることができます。大堂山展望台まで登れば、柏島の島影まで見渡す360度の景色が広がります。周辺には「大堂お猿公園」もあり、およそ200匹の野生のニホンザルが暮らす姿を見られることもあります。断崖の縁には近づかず、遊歩道から眺めましょう。この後は、車でおよそ13分、柏島へ向かいましょう。";

const OKI_KAIGAN_MEMO_OLD =
  "旅の2日目は、宿(柏島のあたり)から車でおよそ48分の大岐海岸から始めます。真っ白な砂浜と緑の松林が1.6kmにわたって弧を描く美しい海岸で、足摺国立公園の東の玄関口ともいわれています。近年はサーフスポットとしても人気を集めているほか、絶滅危惧種のアカウミガメが産卵のために上陸することでも知られています。朝の澄んだ空気の中、白い砂浜をのんびりと歩きましょう。この後は、車でおよそ8分、ジョン万次郎の資料館へ向かいましょう。";
const OKI_KAIGAN_MEMO_NEW =
  "旅の2日目は、宿(柏島のあたり)から車でおよそ48分の大岐海岸から始めます。真っ白な砂浜と緑の松林が1.6kmにわたって弧を描く美しい海岸で、足摺国立公園の東の玄関口ともいわれています。近年はサーフスポットとしても人気を集めているほか、絶滅危惧種のアカウミガメが産卵のために上陸することでも知られています。朝の澄んだ空気の中、白い砂浜をのんびりと歩きましょう。この後は、車でおよそ13分、ジョン万次郎の資料館へ向かいましょう。";

const MANJIRO_SHIRYOKAN_MEMO_OLD =
  "大岐海岸から車でおよそ8分、ジョン万次郎資料館に着きます。土佐清水市中浜の漁師の家に生まれたジョン万次郎は、天保12年(1841)、14歳のときに漁に出て嵐に遭い、仲間とともに無人島に漂着したのち、アメリカの捕鯨船に救助されました。船長のホイットフィールドに気に入られ、そのままアメリカへ渡った万次郎は、現地の学校で英語や数学、航海術などを学び、10年後、帰国して幕府に仕えることになります。鎖国の時代にあって、生きた英語力と国際知識を持つ万次郎は、帰国後、幕府に仕えて通訳や航海術の指導にあたり、万延元年(1860)には、条約の批准書を交換する遣米使節に随行して太平洋を渡った咸臨丸に技術顧問として乗り組むなど、日本の近代化に力を尽くしました。館内では、漂流からアメリカでの生活、帰国後の功績までを、模型やパネル、映像でドラマチックに紹介しています。この後は、車でおよそ10分、万次郎の生まれ育った中浜地区へ向かいましょう。";
const MANJIRO_SHIRYOKAN_MEMO_NEW =
  "大岐海岸から車でおよそ13分、ジョン万次郎資料館に着きます。土佐清水市中浜の漁師の家に生まれたジョン万次郎は、天保12年(1841)、14歳のときに漁に出て嵐に遭い、仲間とともに無人島に漂着したのち、アメリカの捕鯨船に救助されました。船長のホイットフィールドに気に入られ、そのままアメリカへ渡った万次郎は、現地の学校で英語や数学、航海術などを学び、10年後、帰国して幕府に仕えることになります。鎖国の時代にあって、生きた英語力と国際知識を持つ万次郎は、帰国後、幕府に仕えて通訳や航海術の指導にあたり、万延元年(1860)には、条約の批准書を交換する遣米使節に随行して太平洋を渡った咸臨丸に技術顧問として乗り組むなど、日本の近代化に力を尽くしました。館内では、漂流からアメリカでの生活、帰国後の功績までを、模型やパネル、映像でドラマチックに紹介しています。この後は、車でおよそ15分、万次郎の生まれ育った中浜地区へ向かいましょう。";

const NAKANOHAMA_MEMO_OLD =
  "ジョン万次郎資料館から車でおよそ10分、万次郎が生まれ育った中浜地区に着きます。生誕地の碑のそばには、残された写真をもとに、平成22年(2010)に復元された茅葺き屋根の生家があります。木造平屋の質素なたたずまいから、漁師の家に生まれ育った少年が、のちに幕末の国際人として活躍するまでの道のりに思いを馳せることができます。海辺の小さな漁村の風景を、静かに歩きましょう。この後は、車でおよそ8分、唐人駄場遺跡へ向かいましょう。";
const NAKANOHAMA_MEMO_NEW =
  "ジョン万次郎資料館から車でおよそ15分、万次郎が生まれ育った中浜地区に着きます。生誕地の碑のそばには、残された写真をもとに、平成22年(2010)に復元された茅葺き屋根の生家があります。木造平屋の質素なたたずまいから、漁師の家に生まれ育った少年が、のちに幕末の国際人として活躍するまでの道のりに思いを馳せることができます。海辺の小さな漁村の風景を、静かに歩きましょう。この後は、車でおよそ12分、唐人駄場遺跡へ向かいましょう。";

const TOJINDABA_MEMO_OLD =
  "中浜地区から車でおよそ8分、足摺半島の付け根、標高およそ400mの高原に広がる唐人駄場遺跡に着きます。縄文時代早期にまでさかのぼる石器や土器片が出土している場所で、丘の上には大小の巨石群が点在し、環状に並ぶ配置から、古代の祭祀の場だったのではないかとも考えられています。巨石の上によじ登ることもでき、足摺の山並みと海を望む360度の大パノラマが広がります。石の上は滑りやすいこともあるので、足元に気をつけて歩きましょう。この後は、車でおよそ11分、足摺岬観光案内所へ向かいましょう。";
const TOJINDABA_MEMO_NEW =
  "中浜地区から車でおよそ12分、足摺半島の付け根、標高およそ400mの高原に広がる唐人駄場遺跡に着きます。縄文時代早期にまでさかのぼる石器や土器片が出土している場所で、丘の上には大小の巨石群が点在し、環状に並ぶ配置から、古代の祭祀の場だったのではないかとも考えられています。巨石の上によじ登ることもでき、足摺の山並みと海を望む360度の大パノラマが広がります。石の上は滑りやすいこともあるので、足元に気をつけて歩きましょう。この後は、車でおよそ11分、足摺岬観光案内所へ向かいましょう。";

async function main() {
  const ids = [SATOUMI, GLASS_BOAT, ODO_KAIGAN, KASHIWAJIMA, OKI_KAIGAN, MANJIRO_SHIRYOKAN, NAKANOHAMA, TOJINDABA, HAKUSAN_DOMON];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } }, include: { transitLegs: true } });
  const byId = new Map(spots.map((s) => [s.id, s]));
  const infoSpot = await prisma.spot.findFirst({ where: { name: ASHIZURIMISAKI_INFO_NAME } });
  if (!infoSpot) throw new Error("足摺岬観光案内所が見つかりません");

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  const checkLatLng = (s: { lat: any; lng: any }, lat: number, lng: number, label: string) => {
    const curLat = s.lat?.toNumber() ?? 0;
    const curLng = s.lng?.toNumber() ?? 0;
    if (Math.abs(curLat - lat) > 1e-6 || Math.abs(curLng - lng) > 1e-6) {
      throw new Error(`${label}: 座標の現在値が期待と不一致`);
    }
  };

  checkLatLng(byId.get(GLASS_BOAT)!, 32.785493, 132.866025, "竜串グラスボート");
  checkLatLng(byId.get(KASHIWAJIMA)!, 32.769492, 132.622703, "柏島");
  checkLatLng(byId.get(HAKUSAN_DOMON)!, 32.72345, 133.01386, "白山洞門");
  checkLatLng(byId.get(OKI_KAIGAN)!, 32.819197, 132.950644, "大岐海岸");
  checkLatLng(byId.get(NAKANOHAMA)!, 32.759273, 132.965337, "中浜");

  checkTime(KASHIWAJIMA, 16, 10, "柏島");
  checkTime(MANJIRO_SHIRYOKAN, 10, 23, "ジョン万次郎資料館");
  checkTime(NAKANOHAMA, 11, 23, "中浜");
  checkTime(TOJINDABA, 12, 6, "唐人駄場遺跡");
  checkTime(HAKUSAN_DOMON, 13, 58, "白山洞門");

  if (byId.get(KASHIWAJIMA)!.memo !== KASHIWAJIMA_MEMO_OLD) throw new Error("柏島: memo現在値が期待と不一致");
  if (byId.get(SATOUMI)!.memo !== SATOUMI_MEMO_OLD) throw new Error("足摺海洋館: memo現在値が期待と不一致");
  if (byId.get(GLASS_BOAT)!.memo !== GLASS_BOAT_MEMO_OLD) throw new Error("竜串グラスボート: memo現在値が期待と不一致");
  if (byId.get(ODO_KAIGAN)!.memo !== ODO_KAIGAN_MEMO_OLD) throw new Error("大堂海岸: memo現在値が期待と不一致");
  if (byId.get(OKI_KAIGAN)!.memo !== OKI_KAIGAN_MEMO_OLD) throw new Error("大岐海岸: memo現在値が期待と不一致");
  if (byId.get(MANJIRO_SHIRYOKAN)!.memo !== MANJIRO_SHIRYOKAN_MEMO_OLD) throw new Error("ジョン万次郎資料館: memo現在値が期待と不一致");
  if (byId.get(NAKANOHAMA)!.memo !== NAKANOHAMA_MEMO_OLD) throw new Error("中浜: memo現在値が期待と不一致");
  if (byId.get(TOJINDABA)!.memo !== TOJINDABA_MEMO_OLD) throw new Error("唐人駄場遺跡: memo現在値が期待と不一致");

  const glassBoatLeg = byId.get(GLASS_BOAT)!.transitLegs[0];
  if (!glassBoatLeg || glassBoatLeg.transitDurationMin !== 9) throw new Error("竜串グラスボート: legの現在値が期待と不一致");
  const odoLeg = byId.get(ODO_KAIGAN)!.transitLegs[0];
  if (!odoLeg || odoLeg.transitDurationMin !== 40) throw new Error("大堂海岸: legの現在値が期待と不一致");
  const kashiwajimaLeg = byId.get(KASHIWAJIMA)!.transitLegs[0];
  if (!kashiwajimaLeg || kashiwajimaLeg.transitDurationMin !== 9) throw new Error("柏島: legの現在値が期待と不一致");
  const nakanohamaLeg = byId.get(NAKANOHAMA)!.transitLegs[0];
  if (!nakanohamaLeg || nakanohamaLeg.transitDurationMin !== 10) throw new Error("中浜: legの現在値が期待と不一致");
  if (byId.get(NAKANOHAMA)!.stayDurationMin !== 35) throw new Error("中浜: 滞在の現在値が期待と不一致");
  const tojindabaLeg = byId.get(TOJINDABA)!.transitLegs[0];
  if (!tojindabaLeg || tojindabaLeg.transitDurationMin !== 8) throw new Error("唐人駄場遺跡: legの現在値が期待と不一致");
  if (byId.get(HAKUSAN_DOMON)!.stayDurationMin !== 20) throw new Error("白山洞門: 滞在の現在値が期待と不一致");
  const infoTime = infoSpot.visitTime;
  if (!infoTime || infoTime.getUTCHours() !== 13 || infoTime.getUTCMinutes() !== 17) throw new Error("足摺岬観光案内所: visitTimeの現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log(
    "[Day1] 竜串海岸11:23(50)→足摺海洋館12:22(70,car9、昼食)→竜串グラスボート13:40(70,car8)→大堂海岸15:25(30,car35)→柏島16:08(40,car13、16:48出発)"
  );
  console.log(
    "[Day2] 大岐海岸09:00(75)→ジョン万次郎資料館10:28(50,car13)→中浜11:33(30,car15)→唐人駄場遺跡12:15(60,car12)→足摺岬観光案内所13:26(35,car11、昼食)→白山洞門14:07(11,car6)→万次郎足湯14:20(12,walk2)→金剛福寺14:40(36,walk2+car6)→足摺岬15:26(65,walk10、16:31出発=もとと同じ)"
  );
  console.log(
    "[座標] 竜串グラスボート→node4984013237「竜串観光汽船（グラスボート）」(shop=ticket、乗り場そのもの)、柏島→node13430146501「柏島漁港」(man_made=harbour)、白山洞門→地理院の地名検索の値(32.723203,133.013886、現在値とほぼ同じ)、大岐海岸→砂浜wayの実在の頂点、中浜→生家住所(中浜252-5)の地理院住所検索の値(32.760227,132.965225)に修正"
  );
  console.log(
    "[leg] 足摺海洋館→グラスボート9→8分、グラスボート→大堂海岸40→35分、大堂海岸→柏島9→13分、大岐海岸→ジョン万次郎資料館8→13分、ジョン万次郎資料館→中浜10→15分、中浜→唐人駄場遺跡8→12分"
  );
  console.log("[文] 柏島の書き出しに「柏島漁港のあたり」を補い、点と合わせる");
  console.log("[滞在] 中浜の点の直しで増えた9分を、中浜35→30・白山洞門20→11の短縮(決まりA)で吸収。出発は16:31でもとのまま");
  console.log("\n[書き出し・締めの直し(分数が変わった6区間、12か所)]");
  console.log("足摺海洋館の締め: 「この後は、車でおよそ8分、竜串グラスボート乗り場へ向かいましょう。」");
  console.log("竜串グラスボートの書き出し: 「足摺海洋館「SATOUMI」から車でおよそ8分、竜串グラスボートの乗り場に着きます。」");
  console.log("竜串グラスボートの締め: 「この後は、車でおよそ35分、大月町の大堂海岸へ向かいましょう。」");
  console.log("大堂海岸の書き出し: 「竜串グラスボート乗り場から車でおよそ35分、大月町の大堂海岸に着きます。」");
  console.log("大堂海岸の締め: 「この後は、車でおよそ13分、柏島へ向かいましょう。」");
  console.log("柏島の書き出し: 「大堂海岸から車でおよそ13分、橋を渡って柏島漁港のあたりに着きます。」");
  console.log("大岐海岸の締め: 「この後は、車でおよそ13分、ジョン万次郎の資料館へ向かいましょう。」");
  console.log("ジョン万次郎資料館の書き出し: 「大岐海岸から車でおよそ13分、ジョン万次郎資料館に着きます。」");
  console.log("ジョン万次郎資料館の締め: 「この後は、車でおよそ15分、万次郎の生まれ育った中浜地区へ向かいましょう。」");
  console.log("中浜の書き出し: 「ジョン万次郎資料館から車でおよそ15分、万次郎が生まれ育った中浜地区に着きます。」");
  console.log("中浜の締め: 「この後は、車でおよそ12分、唐人駄場遺跡へ向かいましょう。」");
  console.log("唐人駄場遺跡の書き出し: 「中浜地区から車でおよそ12分、足摺半島の付け根、標高およそ400mの高原に広がる唐人駄場遺跡に着きます。」");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Day1
    await tx.spot.update({ where: { id: SATOUMI }, data: { memo: SATOUMI_MEMO_NEW } });
    await tx.spot.update({
      where: { id: GLASS_BOAT },
      data: { lat: 32.788845, lng: 132.8674122, visitTime: t(13, 40), memo: GLASS_BOAT_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({ where: { spotId: GLASS_BOAT }, data: { transitDurationMin: 8 } });
    await tx.spot.update({ where: { id: ODO_KAIGAN }, data: { visitTime: t(15, 25), memo: ODO_KAIGAN_MEMO_NEW } });
    await tx.spotTransitLeg.updateMany({ where: { spotId: ODO_KAIGAN }, data: { transitDurationMin: 35 } });
    await tx.spot.update({
      where: { id: KASHIWAJIMA },
      data: { lat: 32.7695578, lng: 132.6276507, visitTime: t(16, 8), memo: KASHIWAJIMA_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({ where: { spotId: KASHIWAJIMA }, data: { transitDurationMin: 13 } });

    // Day2
    await tx.spot.update({ where: { id: OKI_KAIGAN }, data: { lat: 32.8194085, lng: 132.9511375, memo: OKI_KAIGAN_MEMO_NEW } });
    await tx.spot.update({
      where: { id: MANJIRO_SHIRYOKAN },
      data: { visitTime: t(10, 28), memo: MANJIRO_SHIRYOKAN_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({ where: { spotId: MANJIRO_SHIRYOKAN }, data: { transitDurationMin: 13 } });
    await tx.spot.update({
      where: { id: NAKANOHAMA },
      data: { lat: 32.760227, lng: 132.965225, visitTime: t(11, 33), stayDurationMin: 30, memo: NAKANOHAMA_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({ where: { spotId: NAKANOHAMA }, data: { transitDurationMin: 15 } });
    await tx.spot.update({ where: { id: TOJINDABA }, data: { visitTime: t(12, 15), memo: TOJINDABA_MEMO_NEW } });
    await tx.spotTransitLeg.updateMany({ where: { spotId: TOJINDABA }, data: { transitDurationMin: 12 } });
    await tx.spot.update({ where: { id: infoSpot.id }, data: { visitTime: t(13, 26) } });
    await tx.spot.update({
      where: { id: HAKUSAN_DOMON },
      data: { lat: 32.723203, lng: 133.013886, visitTime: t(14, 7), stayDurationMin: 11 },
    });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

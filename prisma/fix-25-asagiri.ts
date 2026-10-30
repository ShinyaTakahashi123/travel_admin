/**
 * #25 朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日(66d185f1)
 * 初日・最終日の見直し
 *
 * [Day1(初日)] 1か所目(白糸の滝)が09:00着で、入口(新富士駅)の一文はあったが時刻がなく、
 * レンタカーの手続きと運転が「車でおよそ30分」と合算されていた。新富士駅に10:30ごろ着
 * (旅の入口は10:30より早くしない)+手続き15分+運転28分(OSRM実測23.2分+駐車5分)で
 * 1か所目着11:13に。7か所あったが、この時刻では全部回れないため、富士ミルクランド
 * (まかいの牧場と酪農体験のテーマが重なる)を外し6か所に(タイトルのまかいの牧場、
 * 説明文の白糸の滝は残す)。まかいの牧場の昼食(着13:28)が13:30を超えないよう、
 * 白糸の滝・白糸自然公園・内野神社の滞在を短縮(決まりA)。あさぎり温泉→陣馬の滝を
 * 直結(OSRM実測5.45分+駐車5分=10分)。
 * 結果: 白糸の滝11:13(50)→白糸自然公園12:13(45,walk10)→内野神社13:03(20,car5)→
 * まかいの牧場13:28(100,car5、昼食)→あさぎり温泉15:11(60,car3)→陣馬の滝16:21
 * (28,car10、16:49出発)
 *
 * [法務指摘・ラウンド2] 座標: 白糸自然公園→way742742276(約300m)。静岡県立朝霧野外活動
 * センター→way484473842(約280m)。田貫湖→湖の中心(水の上)だったのを、メモにある「事前
 * 予約制のキャンプ場」である「田貫湖キャンプ場」way1244553042(約366m)に。あさぎり温泉
 * 風の湯→OSMのway710867340(amenity=public_bath)のNominatimの値(35.328302,138.593655、
 * 今の点から約1km)に。前後の区間(まかいの牧場→あさぎり温泉3→10分、あさぎり温泉→陣馬の滝
 * 10→15分)をOSRMで測り直し、+12分はまかいの牧場100→93分・あさぎり温泉60→55分の滞在短縮
 * (決まりA)で吸収し、15:11着・16:49出発は変えていない。朝霧高原は同じ名前のバス停で決まり
 * 361によりそのまま。道の駅朝霧高原はすでにservicesのway1016168500と一致(変更なし)。
 * 前からある車の区間をすべてOSRMで確認し、2本が範囲外だったため直す: 静岡県立朝霧野外
 * 活動センター→ふもとっぱら(20分→実測5.44分の上限13.16分を超過→10分)。白糸自然公園の
 * 点の直しに伴い、白糸の滝→白糸自然公園も10分→12分に。
 *
 * [人穴富士講遺跡の座標・ラウンド3] 今の点は大字「人穴」の中心で、遺跡から約3.5km東に
 * ずれていた。OSMに専用の点はなく、地理院の住所検索も大字止まりだったが、地理院の地名検索
 * (名前)で「人穴」の注記が2件見つかり、法務の提案でWikipediaの人穴浅間神社の座標
 * (35.361639,138.591056、記事本文の座標表記)と比べたところ、注記の1件(35.361725,
 * 138.590922)が約10mの差で一致したため、こちらを採用。点が約3.5km動いたため、田貫湖→
 * 人穴富士講遺跡の区間を14分→実測10.6分+駐車5分=16分に再計算(26分は誤り)。帰りの新富士駅
 * までの分数も29分に測り直した(新富士駅の駅ノード35.1421319,138.6634609で算出)。
 *
 * [朝霧自然公園の座標] メモの「朝霧アリーナ」「展望デッキ」にOSMで名前のある点はなし
 * (Overpass・OSM API両方で確認)。今の点が公園のway(801448707)内の歩ける場所(芝生)に
 * あることをpoint-in-polygonで確認し、企画運営・法務の「1件ずつの例外」により変更しない。
 *
 * 文: 朝霧高原の書き出しに宿からの分数(車で約4分)を追加。朝霧高原・ふもとっぱらの
 * 「眺めてみてください」を「眺めましょう」に。人穴富士講遺跡の田貫湖・帰りの分数を直し、
 * レンタカー返却の手続き(15分ほど)を追加。内野神社には、すでに「参拝の際は、敬意を込めて
 * 手を合わせましょう。」という決まりで認められた形の一文があるため、変更しない
 *
 * [Day2(最終日、1泊2日)] 人穴富士講遺跡の区間直し(26→16分)で15:33着が早まり、最終日の
 * 出発が16:30を下回るため、決まりの順(①短縮した滞在を戻す→②最終日の1か所目を9:30まで
 * 後ろへ)により、朝霧高原の着を09:00→09:05に(8:30〜9:30の範囲内)。これにより全体が
 * +5分動き、人穴富士講遺跡は15:30着・滞在60分(もとのまま)で出発16:30(もとの16:33より
 * 早く、範囲内)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const DAY1 = "8bff39d8-ada1-4112-9a0e-03a1cc7fc5d4";
const DAY2 = "c0446d66-30bd-4b9d-906e-8ca9e4b354de";

const SHIRAITO = "75924d7e-9cdf-4a4b-917a-6fb0367a4c73";
const SHIRAITO_PARK = "500abbb7-c62e-4738-9503-722c6ded8a1c";
const UCHINO_JINJA = "6b56a3cf-f7c0-423a-8c27-c5912576a197";
const MAKAI = "c322d0a2-2485-4ae7-9f3c-ea4030018eed";
const ASAGIRI_ONSEN = "da28fe04-25f9-48f4-a922-d1e467923a11";
const MILK_LAND = "5dd29cf4-bbdc-4adb-8e1c-b67763379d8a";
const JINBA_NO_TAKI = "df91ce80-96ee-4bd7-a4f8-196496f8521e";

const ASAGIRI_KOGEN = "5a7c28c3-15d0-48c0-9479-474e17e471a3";
const ASAGIRI_PARK = "26c0b47a-d774-4379-b261-55e50a5a8a7b";
const KATSUDO_CENTER = "50b1d42e-b513-4738-b67d-97fa0051d32c";
const FUMOTOPPARA = "c5b6ae86-9e30-4e72-8bb9-e67f2202aac5";
const MICHINOEKI = "3e86c294-ba39-4ce0-a75c-babfa12da220";
const TANUKIKO = "f2f15e6d-f5ca-4dec-a5b9-1bc017bc4459";
const HITOANA = "ce27b7b4-7186-47a8-8c1c-3e81def6fa3c";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const SHIRAITO_MEMO_OLD =
  "新富士駅でレンタカーを借り、車でおよそ30分、旅の1日目は白糸の滝から始まります。富士山の雪解け水が、水を通しやすい新富士火山層と通しにくい古富士火山層の境目から湧き出し、幅およそ200m、高さおよそ20mの崖一面に、何百もの筋になって流れ落ちる滝です。細い流れが幾重にも連なるさまが、白い糸を垂らしたように見えることが名前の由来と伝えられています。隣接する音止の滝とあわせて、国の名勝・天然記念物に指定され、平成25年(2013)には、世界文化遺産「富士山-信仰の対象と芸術の源泉」の構成資産にも登録されました。滝つぼ周辺は足元が滑りやすいため、十分注意しながら眺めましょう。この後は、車でおよそ10分、白糸自然公園へ向かいましょう。";
const SHIRAITO_MEMO_NEW =
  "新富士駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約28分の白糸の滝へ。旅の1日目は白糸の滝から始まります。富士山の雪解け水が、水を通しやすい新富士火山層と通しにくい古富士火山層の境目から湧き出し、幅およそ200m、高さおよそ20mの崖一面に、何百もの筋になって流れ落ちる滝です。細い流れが幾重にも連なるさまが、白い糸を垂らしたように見えることが名前の由来と伝えられています。隣接する音止の滝とあわせて、国の名勝・天然記念物に指定され、平成25年(2013)には、世界文化遺産「富士山-信仰の対象と芸術の源泉」の構成資産にも登録されました。滝つぼ周辺は足元が滑りやすいため、十分注意しながら眺めましょう。この後は、車でおよそ10分、白糸自然公園へ向かいましょう。";

const ASAGIRI_ONSEN_MEMO_OLD =
  "まかいの牧場から車でおよそ3分、あさぎり温泉 風の湯に着きます。富士山の地下深くからくみ上げた、バナジウムを含む天然水を使用した日帰り温泉施設です。岩塩を使った岩塩風呂などもあり、牧場めぐりで歩き疲れた体をゆっくりと休められます。浴場では、ほかの方が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。この後は、車でおよそ5分、富士ミルクランドへ向かいましょう。";
const ASAGIRI_ONSEN_MEMO_NEW =
  "まかいの牧場から車でおよそ10分、あさぎり温泉 風の湯に着きます。富士山の地下深くからくみ上げた、バナジウムを含む天然水を使用した日帰り温泉施設です。岩塩を使った岩塩風呂などもあり、牧場めぐりで歩き疲れた体をゆっくりと休められます。浴場では、ほかの方が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。この後は、車でおよそ15分、陣馬の滝へ向かいましょう。";

const JINBA_NO_TAKI_MEMO_OLD =
  "富士ミルクランドから車でおよそ10分、陣馬の滝に着きます。源頼朝が、かつてこの地で富士の巻狩りを行った際に陣を張ったことが、名前の由来と伝えられています。富士山の伏流水が湧き出す小さな滝で、滝つぼのすぐそばまで近づける、静かな穴場として親しまれています。足元が滑りやすい場所もあるため、気をつけて歩きましょう。1日目はここまでです。今夜はこの近くの宿に泊まります。";
const JINBA_NO_TAKI_MEMO_NEW =
  "あさぎり温泉 風の湯から車でおよそ15分、陣馬の滝に着きます。源頼朝が、かつてこの地で富士の巻狩りを行った際に陣を張ったことが、名前の由来と伝えられています。富士山の伏流水が湧き出す小さな滝で、滝つぼのすぐそばまで近づける、静かな穴場として親しまれています。足元が滑りやすい場所もあるため、気をつけて歩きましょう。1日目はここまでです。今夜はこの近くの宿に泊まります。";

const ASAGIRI_KOGEN_MEMO_OLD =
  "2日目は、朝霧高原から歩き始めます。富士山の西麓、標高およそ700から1000メートルに広がる高原地帯で、5月から8月にかけて朝夕に霧が発生しやすいことが、この名前の由来と伝えられています。建久4年(1193)、源頼朝がこの地で大規模な巻狩り「富士の巻狩り」を行ったという記録も残る、古くから人と自然が共生してきた土地です。今では全国有数の酪農地帯として知られ、広大な牧草地でホルスタイン種の牛がのびのびと放牧される風景が広がっています。富士山を間近に望む雄大な景色を眺めてみてください。この後は、車でおよそ3分、朝霧自然公園へ向かいましょう。";
const ASAGIRI_KOGEN_MEMO_NEW =
  "宿を出て、車でおよそ4分、朝霧高原に着きます。富士山の西麓、標高およそ700から1000メートルに広がる高原地帯で、5月から8月にかけて朝夕に霧が発生しやすいことが、この名前の由来と伝えられています。建久4年(1193)、源頼朝がこの地で大規模な巻狩り「富士の巻狩り」を行ったという記録も残る、古くから人と自然が共生してきた土地です。今では全国有数の酪農地帯として知られ、広大な牧草地でホルスタイン種の牛がのびのびと放牧される風景が広がっています。富士山を間近に望む雄大な景色を眺めましょう。この後は、車でおよそ3分、朝霧自然公園へ向かいましょう。";

const KATSUDO_CENTER_MEMO_OLD =
  "朝霧自然公園から車でおよそ6分、静岡県立朝霧野外活動センターに着きます。静岡県が設置する、青少年の野外活動を目的とした施設です。富士山を望む広大な敷地には、キャンプ場や体育館、研修棟などが整い、学校や団体の野外活動・自然体験の場として利用されています。この後は、車でおよそ20分、ふもとっぱらへ向かいましょう。";
const KATSUDO_CENTER_MEMO_NEW =
  "朝霧自然公園から車でおよそ6分、静岡県立朝霧野外活動センターに着きます。静岡県が設置する、青少年の野外活動を目的とした施設です。富士山を望む広大な敷地には、キャンプ場や体育館、研修棟などが整い、学校や団体の野外活動・自然体験の場として利用されています。この後は、車でおよそ10分、ふもとっぱらへ向かいましょう。";

const FUMOTOPPARA_MEMO_OLD =
  "静岡県立朝霧野外活動センターから車でおよそ20分、ふもとっぱらに着きます。毛無山のふもとに広がる広大な草原で、かつて東京農業大学の研修農場として使われていた土地が、平成16年(2004)に返還されたことをきっかけに、富士山を望む体験型の宿泊・休暇施設として生まれ変わりました。さかのぼれば戦国時代には金の採掘が行われ、山崩れのあとは植林によって今の姿に育てられてきたという、長い歴史を持つ土地でもあります。さえぎるものが何もない草原の向こうに、富士山がそびえる開放的な景色は、朝霧高原の中でも人気の高い眺めとして親しまれています。昨日の牧場めぐりとはまた違う、雄大な草原の富士山を眺めてみてください。ここで昼食にしましょう。この後は、車でおよそ7分、道の駅朝霧高原へ向かいましょう。";
const FUMOTOPPARA_MEMO_NEW =
  "静岡県立朝霧野外活動センターから車でおよそ10分、ふもとっぱらに着きます。毛無山のふもとに広がる広大な草原で、かつて東京農業大学の研修農場として使われていた土地が、平成16年(2004)に返還されたことをきっかけに、富士山を望む体験型の宿泊・休暇施設として生まれ変わりました。さかのぼれば戦国時代には金の採掘が行われ、山崩れのあとは植林によって今の姿に育てられてきたという、長い歴史を持つ土地でもあります。さえぎるものが何もない草原の向こうに、富士山がそびえる開放的な景色は、朝霧高原の中でも人気の高い眺めとして親しまれています。昨日の牧場めぐりとはまた違う、雄大な草原の富士山を眺めましょう。ここで昼食にしましょう。この後は、車でおよそ7分、道の駅朝霧高原へ向かいましょう。";

const TANUKIKO_MEMO_OLD =
  "道の駅朝霧高原から車でおよそ18分、田貫湖に着きます。大正12年(1923)の関東大震災をきっかけに芝川の水量が減り、灌漑のため昭和10年(1935)から堤防が築かれてできた人造湖で、昭和24年(1949)に今の姿になりました。湖畔からは富士山を望むことができ、年に2回、山頂から太陽が昇る「ダイヤモンド富士」が見られることでも知られています。ほとりには、事前予約制のキャンプ場もあります。この後は、車でおよそ14分、人穴富士講遺跡へ向かいましょう。";
const TANUKIKO_MEMO_NEW =
  "道の駅朝霧高原から車でおよそ18分、田貫湖に着きます。大正12年(1923)の関東大震災をきっかけに芝川の水量が減り、灌漑のため昭和10年(1935)から堤防が築かれてできた人造湖で、昭和24年(1949)に今の姿になりました。湖畔からは富士山を望むことができ、年に2回、山頂から太陽が昇る「ダイヤモンド富士」が見られることでも知られています。ほとりには、事前予約制のキャンプ場もあります。この後は、車でおよそ26分、人穴富士講遺跡へ向かいましょう。";

const HITOANA_MEMO_OLD =
  "田貫湖から車でおよそ14分、人穴富士講遺跡に着きます。富士山世界文化遺産の構成資産のひとつで、富士講の開祖とされる長谷川角行が修行したと伝わる洞窟です。江戸時代にかけて、富士講の信者たちが、この地におよそ230基もの碑塔を建てました。碑塔のまわりでは、静かに過ごしましょう。朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日の旅は、これで終わりです。新富士駅まで車でおよそ20分戻り、レンタカーを返却してから、新幹線などで帰路につきましょう。";
const HITOANA_MEMO_NEW =
  "田貫湖から車でおよそ16分、人穴富士講遺跡に着きます。富士山世界文化遺産の構成資産のひとつで、富士講の開祖とされる長谷川角行が修行したと伝わる洞窟です。江戸時代にかけて、富士講の信者たちが、この地におよそ230基もの碑塔を建てました。碑塔のまわりでは、静かに過ごしましょう。朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日の旅は、これで終わりです。新富士駅まで車でおよそ29分戻り、レンタカーを返却(手続きに15分ほど)してから、新幹線などで帰路につきましょう。";

async function main() {
  const ids = [
    SHIRAITO,
    SHIRAITO_PARK,
    UCHINO_JINJA,
    MAKAI,
    ASAGIRI_ONSEN,
    MILK_LAND,
    JINBA_NO_TAKI,
    ASAGIRI_KOGEN,
    ASAGIRI_PARK,
    KATSUDO_CENTER,
    FUMOTOPPARA,
    MICHINOEKI,
    TANUKIKO,
    HITOANA,
  ];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } }, include: { transitLegs: true } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  const checkStay = (id: string, min: number, label: string) => {
    if (byId.get(id)!.stayDurationMin !== min) throw new Error(`${label}: 滞在の現在値が期待と不一致`);
  };
  const checkLeg = (id: string, min: number, label: string) => {
    const legs = byId.get(id)!.transitLegs;
    if (!legs.length || legs[0].transitDurationMin !== min) throw new Error(`${label}: 直前の区間の現在値が期待と不一致`);
  };
  const checkLatLng = (id: string, lat: number, lng: number, label: string) => {
    const s = byId.get(id)!;
    const curLat = s.lat?.toNumber() ?? 0;
    const curLng = s.lng?.toNumber() ?? 0;
    if (Math.abs(curLat - lat) > 1e-6 || Math.abs(curLng - lng) > 1e-6) {
      throw new Error(`${label}: 座標の現在値が期待と不一致`);
    }
  };

  checkTime(SHIRAITO, 9, 0, "白糸の滝");
  checkTime(SHIRAITO_PARK, 10, 25, "白糸自然公園");
  checkTime(UCHINO_JINJA, 11, 35, "内野神社");
  checkTime(MAKAI, 12, 5, "まかいの牧場");
  checkTime(ASAGIRI_ONSEN, 13, 48, "あさぎり温泉");
  checkTime(JINBA_NO_TAKI, 16, 3, "陣馬の滝");
  checkTime(ASAGIRI_KOGEN, 9, 0, "朝霧高原");
  checkTime(ASAGIRI_PARK, 10, 13, "朝霧自然公園");
  checkTime(KATSUDO_CENTER, 11, 19, "静岡県立朝霧野外活動センター");
  checkTime(FUMOTOPPARA, 12, 4, "ふもとっぱら");
  checkTime(MICHINOEKI, 13, 11, "道の駅朝霧高原");
  checkTime(TANUKIKO, 13, 59, "田貫湖");
  checkTime(HITOANA, 15, 33, "人穴富士講遺跡");

  checkStay(SHIRAITO, 75, "白糸の滝");
  checkStay(SHIRAITO_PARK, 65, "白糸自然公園");
  checkStay(UCHINO_JINJA, 25, "内野神社");
  checkStay(ASAGIRI_ONSEN, 70, "あさぎり温泉");
  checkStay(JINBA_NO_TAKI, 30, "陣馬の滝");
  checkStay(ASAGIRI_KOGEN, 70, "朝霧高原");
  checkStay(ASAGIRI_PARK, 60, "朝霧自然公園");
  checkStay(KATSUDO_CENTER, 25, "静岡県立朝霧野外活動センター");
  checkStay(FUMOTOPPARA, 60, "ふもとっぱら");
  checkStay(MICHINOEKI, 30, "道の駅朝霧高原");
  checkStay(TANUKIKO, 80, "田貫湖");
  checkStay(HITOANA, 60, "人穴富士講遺跡の現在の滞在");

  checkLeg(SHIRAITO_PARK, 10, "白糸の滝→白糸自然公園");
  checkLeg(ASAGIRI_ONSEN, 3, "まかいの牧場→あさぎり温泉");
  checkLeg(KATSUDO_CENTER, 6, "朝霧自然公園→活動センター");
  checkLeg(FUMOTOPPARA, 20, "活動センター→ふもとっぱら");
  checkLeg(HITOANA, 14, "田貫湖→人穴富士講遺跡");

  checkLatLng(SHIRAITO_PARK, 35.310149, 138.583142, "白糸自然公園");
  checkLatLng(ASAGIRI_ONSEN, 35.335109, 138.584708, "あさぎり温泉");
  checkLatLng(KATSUDO_CENTER, 35.384752, 138.587194, "静岡県立朝霧野外活動センター");
  checkLatLng(TANUKIKO, 35.344103, 138.561279, "田貫湖");
  checkLatLng(HITOANA, 35.363745, 138.629189, "人穴富士講遺跡");

  if (byId.get(SHIRAITO)!.memo !== SHIRAITO_MEMO_OLD) throw new Error("白糸の滝: memo現在値が期待と不一致");
  if (byId.get(ASAGIRI_ONSEN)!.memo !== ASAGIRI_ONSEN_MEMO_OLD) throw new Error("あさぎり温泉: memo現在値が期待と不一致");
  if (byId.get(JINBA_NO_TAKI)!.memo !== JINBA_NO_TAKI_MEMO_OLD) throw new Error("陣馬の滝: memo現在値が期待と不一致");
  if (byId.get(ASAGIRI_KOGEN)!.memo !== ASAGIRI_KOGEN_MEMO_OLD) throw new Error("朝霧高原: memo現在値が期待と不一致");
  if (byId.get(KATSUDO_CENTER)!.memo !== KATSUDO_CENTER_MEMO_OLD) throw new Error("静岡県立朝霧野外活動センター: memo現在値が期待と不一致");
  if (byId.get(FUMOTOPPARA)!.memo !== FUMOTOPPARA_MEMO_OLD) throw new Error("ふもとっぱら: memo現在値が期待と不一致");
  if (byId.get(TANUKIKO)!.memo !== TANUKIKO_MEMO_OLD) throw new Error("田貫湖: memo現在値が期待と不一致");
  if (byId.get(HITOANA)!.memo !== HITOANA_MEMO_OLD) throw new Error("人穴富士講遺跡: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log(
    "[Day1] 富士ミルクランドを外し6か所に。白糸の滝11:13(50)→白糸自然公園12:15(43,walk12)→内野神社13:03(20,car5)→まかいの牧場13:28(93,car5、昼食)→あさぎり温泉15:11(55,car10)→陣馬の滝16:21(28,car15、16:49出発)"
  );
  console.log(
    "[Day1 座標] 白糸自然公園→way742742276(35.3074488,138.5835211)。あさぎり温泉 風の湯→way710867340のNominatimの値(35.328302,138.593655、約1km)。前後の区間を測り直し、まかいの牧場→あさぎり温泉3→10分、あさぎり温泉→陣馬の滝10→15分に(Nominatimの値でも分数は変わらず)。+12分はまかいの牧場100→93分・あさぎり温泉60→55分の滞在短縮で吸収し、15:11着・16:49出発は変えていません"
  );
  console.log(
    "[文] 白糸の滝の入口に時刻と手続きの一文を追加。あさぎり温泉の書き出し・結び、陣馬の滝の書き出しの分数を直した形に更新"
  );
  console.log(
    "[Day2 座標] 静岡県立朝霧野外活動センター→way484473842(35.3872492,138.5872635)、田貫湖→田貫湖キャンプ場way1244553042(35.3412253,138.5593273)、朝霧自然公園→今の点(way801448707の重心付近)は公園内の芝生部分にあることを確認し変更なし(企画運営の1件ずつの例外)、人穴富士講遺跡→地理院の地名検索の注記点(35.361725,138.590922、大字の中心から約3.5km西)にWikipediaの座標(35.361639,138.591056)も近く一致したため採用"
  );
  console.log(
    "[Day2] 人穴富士講遺跡の点が約3.5km動いたため、田貫湖→人穴富士講遺跡の区間を14→16分に(26分は誤りだったため訂正)、活動センター→ふもとっぱらの区間を20→10分に直しました。この結果、人穴富士講遺跡が15:33→15:25相当まで早まり、最終日の出発が16:30を下回るため、決まりの順(①短縮した滞在を戻す→②最終日の1か所目を9:30まで後ろへ)により、朝霧高原の着を9:00→9:05に。朝霧自然公園10:18、活動センター11:24、ふもとっぱら11:59、道の駅13:06、田貫湖13:54、人穴富士講遺跡15:30(滞在60分のまま)→出発16:30(もとの16:33より早く、範囲内)"
  );
  console.log(
    "[Day2 文] 朝霧高原の書き出しに宿からの分数を追加し「眺めてみてください」を「眺めましょう」に。ふもとっぱらも同様に「眺めましょう」に。人穴富士講遺跡の田貫湖からの分数(26→16分)・帰りの新富士駅までの分数(20→29分、OSRMで測り直し)・レンタカー返却の手続き(15分ほど)を追加"
  );

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1,
      [
        { id: SHIRAITO, data: { visitTime: t(11, 13), stayDurationMin: 50, memo: SHIRAITO_MEMO_NEW } },
        {
          id: SHIRAITO_PARK,
          data: {
            visitTime: t(12, 15),
            stayDurationMin: 43,
            lat: 35.3074488,
            lng: 138.5835211,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
          },
        },
        { id: UCHINO_JINJA, data: { visitTime: t(13, 3), stayDurationMin: 20 } },
        { id: MAKAI, data: { visitTime: t(13, 28), stayDurationMin: 93 } },
        {
          id: ASAGIRI_ONSEN,
          data: {
            visitTime: t(15, 11),
            stayDurationMin: 55,
            lat: 35.328302,
            lng: 138.593655,
            memo: ASAGIRI_ONSEN_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
          },
        },
        {
          id: JINBA_NO_TAKI,
          data: {
            visitTime: t(16, 21),
            stayDurationMin: 28,
            memo: JINBA_NO_TAKI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
          },
        },
      ],
      { remove: [MILK_LAND], tx }
    );

    await setDaySpotOrder(
      DAY2,
      [
        { id: ASAGIRI_KOGEN, data: { visitTime: t(9, 5), memo: ASAGIRI_KOGEN_MEMO_NEW } },
        { id: ASAGIRI_PARK, data: { visitTime: t(10, 18) } },
        {
          id: KATSUDO_CENTER,
          data: { visitTime: t(11, 24), lat: 35.3872492, lng: 138.5872635, memo: KATSUDO_CENTER_MEMO_NEW },
        },
        {
          id: FUMOTOPPARA,
          data: {
            visitTime: t(11, 59),
            memo: FUMOTOPPARA_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
          },
        },
        { id: MICHINOEKI, data: { visitTime: t(13, 6) } },
        {
          id: TANUKIKO,
          data: {
            visitTime: t(13, 54),
            lat: 35.3412253,
            lng: 138.5593273,
            memo: TANUKIKO_MEMO_NEW,
          },
        },
        {
          id: HITOANA,
          data: {
            visitTime: t(15, 30),
            lat: 35.361725,
            lng: 138.590922,
            memo: HITOANA_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 16 }] },
          },
        },
      ],
      { tx }
    );
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

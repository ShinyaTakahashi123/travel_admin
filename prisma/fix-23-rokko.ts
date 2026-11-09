/**
 * #23 六甲山の夜景と有馬温泉、神戸の絶景と湯めぐり1泊2日(0fe4fa73)
 * 初日・最終日の見直し
 *
 * [Day1(初日)] 1か所目(六甲ケーブル山上駅)が09:30着で、入口(阪急六甲駅)の一文に時刻が
 * なかった。阪急六甲駅に10:30ごろ着(旅の入口は10:30より早くしない)+バス15分+
 * ケーブルカー10分(手続きなし、電車・バスの乗り継ぎのため)で1か所目着10:55に。この
 * 時刻では7か所すべてもとの長さで回れないため、六甲山牧場90→70分・六甲高山植物園60→
 * 50分・六甲ガーデンテラス70→55分・ROKKO森の音ミュージアム58→45分に短縮(決まりA、
 * 水増しではなく短縮)。昼食は六甲ガーデンテラス(着14:25で13:30を超える)から、すでに
 * 食事に触れている六甲山牧場(着12:05、11:30〜13:30の範囲内)に移す。
 * 結果: 六甲ケーブル山上駅10:55(20)→記念碑台11:25(30,walk10)→六甲山牧場12:05
 * (70,bus10、昼食)→六甲高山植物園13:30(50,bus15)→六甲ガーデンテラス14:25
 * (55,walk5)→ROKKO森の音ミュージアム15:32(45,walk12)→六甲山天覧台16:27
 * (30,bus10、16:57出発)
 *
 * [法務指摘の2回目] 入口「神戸市バス」→会社名のため「バス」に。六甲山天覧台に宿の一文と
 * 有馬へのロープウェーの分数(約12分、公式サイト・NAVITIME確認)を追加。瑞宝寺公園の点を
 * node6373329589(34.795324,135.256118、法務指摘)に直し、前後のleg(銀の湯→13分、
 * →金の湯14分、実測)を直す。六甲山牧場の点をバス停node5198817243(六甲山牧場、
 * 34.7519836,135.2088090)に直す(既存のバス停のため既存のleg10分は変更なし)。
 * 六甲高山植物園・有馬の温泉街は、OSMに個別の名前つきの点が見当たらず(六甲高山植物園は
 * 「garden」のway自体のみ、有馬の温泉街は特定の店の点のみで通り自体の名前つきの点なし)、
 * 法務・企画運営に例外の判断を相談する。
 * [Day2] 2日目以降の朝の決まりで湯泉神社の書き出しに分数(歩いて約5分、宿の場所は未定の
 * ため目安)を追加。「歩いてすぐ」(太閤の湯殿館・温泉寺・念仏寺・有馬玩具博物館の書き出しと、
 * その前のスポットの結びの文)を「歩いて約1分」に直す。帰りの一文(有馬玩具博物館)に
 * 有馬温泉駅までの分数(歩いて約11分、実測)を追加。瑞宝寺公園の点の直しに伴い、銀の湯・
 * 金の湯の時刻が各+1〜3分動くが16:30〜17:00の範囲内
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const DAY1 = "0f24a14c-4581-47de-829c-38e975d61024";

const SANJOEKI = "52812b14-2c3d-4161-8a48-82b4a58bd901";
const KINENHIDAI = "b14bd17c-4fee-4b96-9561-8dfbc75cc72a";
const BOKUJO = "f4749435-7e73-4f7e-acbd-904a20a68838";
const SHOKUBUTSUEN = "d2c19b0c-e6d3-488a-90a8-f88caa951c64";
const GARDEN_TERRACE = "51e524ac-3bb4-40e3-985a-5a67faf1b416";
const ORGEL_MUSEUM = "dc90aab9-0346-4ea4-80aa-9079425ca968";
const TENRANDAI = "344e459e-2f68-4fba-8713-6f6aca03d733";

const DAY2 = "e9833151-5ee3-45a8-b7b1-59c8bc196ddb";
const YUSEN_JINJA = "372984f0-0f0d-494b-926e-0d5dd4500677";
const TAIKOU = "2137fb59-078d-4d56-8da3-5adf759ea4d3";
const ONSENJI = "0bdd2c0a-d4cf-4119-a2ca-8045aad8ba64";
const NENBUTSUJI = "28200391-23b7-48d0-802a-75e250798cbe";
const ARIMA_STREET = "b19762d1-a80d-4af5-acd6-384e233a7a3c";
const GIN_NO_YU = "f9fe3ed3-85d1-4d44-abc6-468ef2b435eb";
const ZUIHOJI = "aa350b13-87c2-4f7a-b65f-fcb1b659ebcb";
const KIN_NO_YU = "653c374d-551e-48dc-99f0-b3f0cfa383b1";
const OMOCHA_HAKUBUTSUKAN = "bb32d07e-acca-43b0-9b99-381caa919873";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const SANJOEKI_MEMO_OLD =
  "阪急六甲駅から神戸市バスでおよそ15分、六甲ケーブル下駅へ行き、ケーブルカーでおよそ10分、六甲ケーブル山上駅に着きます。昭和7年(1932)に開業した、歴史あるケーブルカーです。平成11年(1999)に登場した3代目の車両は、欧州風のクラシックタイプと、明治末の路面電車をイメージしたレトロタイプの2種類があり、どちらも床や座席に天然木を使い、天井をガラス張りにした展望車がつながれています。山麓から山上まで、レトロな車両に揺られながら上ってみましょう。この後は、歩いておよそ10分、記念碑台へ向かいましょう。";
const SANJOEKI_MEMO_NEW =
  "阪急六甲駅に10時30分ごろ着いたら、バスでおよそ15分、六甲ケーブル下駅へ行き、ケーブルカーでおよそ10分、六甲ケーブル山上駅に着きます。昭和7年(1932)に開業した、歴史あるケーブルカーです。平成11年(1999)に登場した3代目の車両は、欧州風のクラシックタイプと、明治末の路面電車をイメージしたレトロタイプの2種類があり、どちらも床や座席に天然木を使い、天井をガラス張りにした展望車がつながれています。山麓から山上まで、レトロな車両に揺られながら上ってみましょう。この後は、歩いておよそ10分、記念碑台へ向かいましょう。";

const BOKUJO_MEMO_OLD =
  "記念碑台からバスでおよそ10分、六甲山牧場に着きます。六甲山の広々とした自然の中に広がる牧場で、羊やヤギ、牛たちが草を食む姿を見られます。乳搾りやバター作りなどの体験も楽しめます。動物にふれるときは係の人の案内に従い、勝手に食べ物を与えないようにしましょう。牧場で育まれた食材を使った料理も味わえます。この後は、バスでおよそ15分、六甲高山植物園へ向かいましょう。";
const BOKUJO_MEMO_NEW =
  "記念碑台からバスでおよそ10分、六甲山牧場に着きます。六甲山の広々とした自然の中に広がる牧場で、羊やヤギ、牛たちが草を食む姿を見られます。乳搾りやバター作りなどの体験も楽しめます。動物にふれるときは係の人の案内に従い、勝手に食べ物を与えないようにしましょう。牧場で育まれた食材を使った料理も味わえるので、ここで昼食にしましょう。この後は、バスでおよそ15分、六甲高山植物園へ向かいましょう。";

const GARDEN_TERRACE_MEMO_OLD =
  "六甲高山植物園から歩いておよそ5分、六甲ガーデンテラスに着きます。食事処やお土産店が並ぶ、山上の休憩スポットです。ここで昼食をとりましょう。デッキからは、大阪湾や神戸の市街地を見渡せます。この後は、歩いておよそ12分、ROKKO森の音ミュージアムへ向かいましょう。";
const GARDEN_TERRACE_MEMO_NEW =
  "六甲高山植物園から歩いておよそ5分、六甲ガーデンテラスに着きます。食事処やお土産店が並ぶ、山上の休憩スポットです。デッキからは、大阪湾や神戸の市街地を見渡せます。この後は、歩いておよそ12分、ROKKO森の音ミュージアムへ向かいましょう。";

const TENRANDAI_MEMO_OLD =
  "ROKKO森の音ミュージアムからバスでおよそ10分、六甲山天覧台に着きます。標高931mの六甲山の山上に広がる展望スポットで、六甲ケーブル山上駅のすぐそばにあります。大阪から神戸にかけての市街地や大阪湾を一望する眺めが魅力です。昭和28年(1953)、関西電力の副社長がコラムの中で、この一帯の1か月分の電気代をドルに換算すると100万ドルになると紹介したのがきっかけとなり、当初は「100万ドルの夜景」と呼ばれるようになりました。その後、物価の変動などを経て、今では「1000万ドルの夜景」とも呼ばれています。日没の早い季節は、夕暮れから街の明かりがともり始める様子が見られることもあります。夜景を見るなら、日没の時刻を確かめましょう。見学を終えたら、今夜の宿がある有馬温泉へ向かいましょう。";
const TENRANDAI_MEMO_NEW =
  "ROKKO森の音ミュージアムからバスでおよそ10分、六甲山天覧台に着きます。標高931mの六甲山の山上に広がる展望スポットで、六甲ケーブル山上駅のすぐそばにあります。大阪から神戸にかけての市街地や大阪湾を一望する眺めが魅力です。昭和28年(1953)、関西電力の副社長がコラムの中で、この一帯の1か月分の電気代をドルに換算すると100万ドルになると紹介したのがきっかけとなり、当初は「100万ドルの夜景」と呼ばれるようになりました。その後、物価の変動などを経て、今では「1000万ドルの夜景」とも呼ばれています。日没の早い季節は、夕暮れから街の明かりがともり始める様子が見られることもあります。日が暮れるころまでここで待つと、夜景も見られます。日没の時刻は季節で変わるので、前もって確かめましょう。有馬温泉へ向かうバスやロープウェーの最終の時刻も、あわせて確かめましょう。見学を終えたら、バスで約10分の六甲山頂駅へ行き、ロープウェーで約12分の有馬温泉へ向かいましょう。この夜は、有馬温泉の宿に泊まりましょう。";

const YUSEN_JINJA_MEMO_OLD =
  "有馬温泉の宿を出て、湯泉神社に着きます。有馬を最初に見つけたと伝わる大己貴命・少彦名命をまつる古社です。延喜式神名帳(927年に整えられた神社の名簿)にもその名が記される、歴史ある神社です。3羽の傷ついたカラスが水たまりで水を浴びているのを見て、その水が温泉だと見つけたという開湯伝説が伝わります。参道や本殿のそばのモミジは、紅葉の時期には美しく色づきます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、太閤の湯殿館へ向かいましょう。";
const YUSEN_JINJA_MEMO_NEW =
  "有馬温泉の宿を出て、歩いて約5分、湯泉神社に着きます。有馬を最初に見つけたと伝わる大己貴命・少彦名命をまつる古社です。延喜式神名帳(927年に整えられた神社の名簿)にもその名が記される、歴史ある神社です。3羽の傷ついたカラスが水たまりで水を浴びているのを見て、その水が温泉だと見つけたという開湯伝説が伝わります。参道や本殿のそばのモミジは、紅葉の時期には美しく色づきます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いて約1分、太閤の湯殿館へ向かいましょう。";

const TAIKOU_MEMO_OLD =
  "湯泉神社から歩いてすぐ、太閤の湯殿館に着きます。豊臣秀吉が築いたとされる湯山御殿の跡に立つ資料館です。御殿は徳川の時代に取り壊されて埋められ、その上に建てられた極楽寺が、平成7年(1995)の阪神・淡路大震災で傷んだ際の修復工事で、岩風呂や蒸し風呂の遺構が見つかりました。竹の管で温泉の蒸気を床下に取り込む、半地下式の蒸し風呂の遺構を間近に見られます。出土した茶器や瓦なども展示されています。この後は、歩いてすぐ、温泉寺へ向かいましょう。";
const TAIKOU_MEMO_NEW =
  "湯泉神社から歩いて約1分、太閤の湯殿館に着きます。豊臣秀吉が築いたとされる湯山御殿の跡に立つ資料館です。御殿は徳川の時代に取り壊されて埋められ、その上に建てられた極楽寺が、平成7年(1995)の阪神・淡路大震災で傷んだ際の修復工事で、岩風呂や蒸し風呂の遺構が見つかりました。竹の管で温泉の蒸気を床下に取り込む、半地下式の蒸し風呂の遺構を間近に見られます。出土した茶器や瓦なども展示されています。この後は、歩いて約1分、温泉寺へ向かいましょう。";

const ONSENJI_MEMO_OLD =
  "太閤の湯殿館から歩いてすぐ、温泉寺に着きます。神亀元年(724)、僧・行基が薬師如来のお告げを受けて開いたと伝わる寺院です。平安時代末期、有馬の地を襲った大洪水で温泉が荒れた際には、僧・仁西がこの地を訪れて温泉を復興し、12の宿を営んで今の温泉街の基礎を整えたと伝えられています。毎年1月のはじめには、行基と仁西の木像を温泉で清める「入初式」が行われています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、念仏寺へ向かいましょう。";
const ONSENJI_MEMO_NEW =
  "太閤の湯殿館から歩いて約1分、温泉寺に着きます。神亀元年(724)、僧・行基が薬師如来のお告げを受けて開いたと伝わる寺院です。平安時代末期、有馬の地を襲った大洪水で温泉が荒れた際には、僧・仁西がこの地を訪れて温泉を復興し、12の宿を営んで今の温泉街の基礎を整えたと伝えられています。毎年1月のはじめには、行基と仁西の木像を温泉で清める「入初式」が行われています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いて約1分、念仏寺へ向かいましょう。";

const NENBUTSUJI_MEMO_OLD =
  "温泉寺から歩いてすぐ、念仏寺に着きます。豊臣秀吉の妻・淀殿の別荘だったとも伝わる、高台にあるお寺です。天文7年(1538)に創建され、慶長年間(1596〜1615)ごろに今の場所へ移ったと伝えられています。正徳2年(1712)に建てられた本堂は、有馬温泉に残る建物の中でも、もっとも古いとされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ2分、有馬の温泉街へ向かいましょう。";
const NENBUTSUJI_MEMO_NEW =
  "温泉寺から歩いて約1分、念仏寺に着きます。豊臣秀吉の妻・淀殿の別荘だったとも伝わる、高台にあるお寺です。天文7年(1538)に創建され、慶長年間(1596〜1615)ごろに今の場所へ移ったと伝えられています。正徳2年(1712)に建てられた本堂は、有馬温泉に残る建物の中でも、もっとも古いとされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ2分、有馬の温泉街へ向かいましょう。";

const ARIMA_STREET_MEMO_OLD =
  "念仏寺から歩いておよそ2分、有馬の温泉街に着きます。坂道の両側に旅館や土産物店、食事処が並ぶ、湯の町らしい通りです。ここで昼食をとりましょう。食事を終えたら、通りを少し歩いて、湯の町の風情を感じてみましょう。この後は、歩いておよそ3分、銀の湯へ向かいましょう。";
const ARIMA_STREET_MEMO_NEW =
  "念仏寺から歩いておよそ2分、有馬の温泉街に着きます。「湯本坂」という坂道の両側に旅館や土産物店、食事処が並ぶ、湯の町らしい通りです。ここで昼食をとりましょう。食事を終えたら、通りを少し歩いて、湯の町の風情を感じてみましょう。この後は、歩いておよそ3分、銀の湯へ向かいましょう。";

const GIN_NO_YU_MEMO_OLD =
  "有馬の温泉街から歩いておよそ3分、銀の湯に着きます。無色透明で、炭酸やラドンを含む「銀泉」を使った外湯です。有馬温泉には、鉄分や塩分を含み赤褐色に変わる「金泉」と、この銀泉の二種類の湯があります。金泉とはまた違う、さらりとした湯あたりを楽しみましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いておよそ10分、瑞宝寺公園へ向かいましょう。";
const GIN_NO_YU_MEMO_NEW =
  "有馬の温泉街から歩いておよそ3分、銀の湯に着きます。無色透明で、炭酸やラドンを含む「銀泉」を使った外湯です。有馬温泉には、鉄分や塩分を含み赤褐色に変わる「金泉」と、この銀泉の二種類の湯があります。金泉とはまた違う、さらりとした湯あたりを楽しみましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いておよそ13分、瑞宝寺公園へ向かいましょう。";

const ZUIHOJI_MEMO_OLD =
  "銀の湯から歩いておよそ10分、瑞宝寺公園に着きます。明治6年(1873)に廃寺となった瑞宝寺の跡を公園にしたもので、有馬温泉でも指折りの紅葉の名所として知られています。秋にはおよそ2500本のカエデが色づき、豊臣秀吉が「いくら見ていても飽きない」と賞賛したと伝わる庭は「日暮らしの庭」と呼ばれています。紅葉の季節でなくても、山あいの静かな庭園の雰囲気を楽しめます。この後は、歩いておよそ12分、金の湯へ向かいましょう。";
const ZUIHOJI_MEMO_NEW =
  "銀の湯から歩いておよそ13分、瑞宝寺公園に着きます。明治6年(1873)に廃寺となった瑞宝寺の跡を公園にしたもので、有馬温泉でも指折りの紅葉の名所として知られています。秋にはおよそ2500本のカエデが色づき、豊臣秀吉が「いくら見ていても飽きない」と賞賛したと伝わる庭は「日暮らしの庭」と呼ばれています。紅葉の季節でなくても、山あいの静かな庭園の雰囲気を楽しめます。この後は、歩いておよそ14分、金の湯へ向かいましょう。";

const KIN_NO_YU_MEMO_OLD =
  "瑞宝寺公園から歩いておよそ12分、金の湯に着きます。有馬温泉街の中心にある外湯で、鉄分や塩分を多く含み、空気に触れると赤褐色に変わる「金泉」の湯につかりましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いてすぐ、有馬玩具博物館へ向かいましょう。";
const KIN_NO_YU_MEMO_NEW =
  "瑞宝寺公園から歩いておよそ14分、金の湯に着きます。有馬温泉街の中心にある外湯で、鉄分や塩分を多く含み、空気に触れると赤褐色に変わる「金泉」の湯につかりましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いて約1分、有馬玩具博物館へ向かいましょう。";

const OMOCHA_HAKUBUTSUKAN_MEMO_OLD =
  "金の湯から歩いてすぐ、有馬玩具博物館に着きます。平成15年(2003)に開館した、4階建ての玩具博物館です。チェコやドイツの伝統的な木製のミニチュアから、現代のおもちゃ、からくり仕掛けのおもちゃ、鉄道模型やブリキのおもちゃまで、幅広いコレクションが並びます。童心に返って、懐かしいおもちゃや珍しいおもちゃを眺めてみましょう。見学を終えたら、有馬温泉街を歩いて、帰りの神戸電鉄有馬温泉駅へ向かいましょう。";
const OMOCHA_HAKUBUTSUKAN_MEMO_NEW =
  "金の湯から歩いて約1分、有馬玩具博物館に着きます。平成15年(2003)に開館した、4階建ての玩具博物館です。チェコやドイツの伝統的な木製のミニチュアから、現代のおもちゃ、からくり仕掛けのおもちゃ、鉄道模型やブリキのおもちゃまで、幅広いコレクションが並びます。童心に返って、懐かしいおもちゃや珍しいおもちゃを眺めてみましょう。見学を終えたら、有馬温泉街を歩いて約11分、帰りの神戸電鉄有馬温泉駅へ向かいましょう。";

async function main() {
  const day1Ids = [SANJOEKI, KINENHIDAI, BOKUJO, SHOKUBUTSUEN, GARDEN_TERRACE, ORGEL_MUSEUM, TENRANDAI];
  const day2Ids = [YUSEN_JINJA, TAIKOU, ONSENJI, NENBUTSUJI, ARIMA_STREET, GIN_NO_YU, ZUIHOJI, KIN_NO_YU, OMOCHA_HAKUBUTSUKAN];
  const spots = await prisma.spot.findMany({ where: { id: { in: [...day1Ids, ...day2Ids] } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  checkTime(SANJOEKI, 9, 30, "六甲ケーブル山上駅");
  checkTime(KINENHIDAI, 10, 0, "記念碑台");
  checkTime(BOKUJO, 10, 40, "六甲山牧場");
  checkTime(SHOKUBUTSUEN, 12, 25, "六甲高山植物園");
  checkTime(GARDEN_TERRACE, 13, 30, "六甲ガーデンテラス");
  checkTime(ORGEL_MUSEUM, 14, 52, "ROKKO森の音ミュージアム");
  checkTime(TENRANDAI, 16, 0, "六甲山天覧台");
  if (byId.get(BOKUJO)!.stayDurationMin !== 90) throw new Error("六甲山牧場: 滞在の現在値が期待と不一致");
  if (byId.get(SHOKUBUTSUEN)!.stayDurationMin !== 60) throw new Error("六甲高山植物園: 滞在の現在値が期待と不一致");
  if (byId.get(GARDEN_TERRACE)!.stayDurationMin !== 70) throw new Error("六甲ガーデンテラス: 滞在の現在値が期待と不一致");
  if (byId.get(ORGEL_MUSEUM)!.stayDurationMin !== 58) throw new Error("ROKKO森の音ミュージアム: 滞在の現在値が期待と不一致");
  if (byId.get(SANJOEKI)!.memo !== SANJOEKI_MEMO_OLD) throw new Error("六甲ケーブル山上駅: memo現在値が期待と不一致");
  if (byId.get(BOKUJO)!.memo !== BOKUJO_MEMO_OLD) throw new Error("六甲山牧場: memo現在値が期待と不一致");
  if (byId.get(GARDEN_TERRACE)!.memo !== GARDEN_TERRACE_MEMO_OLD) throw new Error("六甲ガーデンテラス: memo現在値が期待と不一致");
  if (byId.get(TENRANDAI)!.memo !== TENRANDAI_MEMO_OLD) throw new Error("六甲山天覧台: memo現在値が期待と不一致");
  if (Number(byId.get(BOKUJO)!.lat) !== 34.750042 || Number(byId.get(BOKUJO)!.lng) !== 135.208238) {
    throw new Error("六甲山牧場: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(ZUIHOJI)!.lat) !== 34.794132 || Number(byId.get(ZUIHOJI)!.lng) !== 135.256761) {
    throw new Error("瑞宝寺公園: 座標の現在値が期待と不一致");
  }
  if (byId.get(ZUIHOJI)!.stayDurationMin !== 30) throw new Error("瑞宝寺公園: 滞在の現在値が期待と不一致");

  const checkTime2 = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  checkTime2(YUSEN_JINJA, 9, 0, "湯泉神社");
  checkTime2(TAIKOU, 9, 41, "太閤の湯殿館");
  checkTime2(ONSENJI, 10, 42, "温泉寺");
  checkTime2(NENBUTSUJI, 11, 33, "念仏寺");
  checkTime2(ARIMA_STREET, 12, 15, "有馬の温泉街");
  checkTime2(GIN_NO_YU, 13, 18, "銀の湯");
  checkTime2(ZUIHOJI, 14, 23, "瑞宝寺公園");
  checkTime2(KIN_NO_YU, 15, 5, "金の湯");
  checkTime2(OMOCHA_HAKUBUTSUKAN, 16, 1, "有馬玩具博物館");
  if (byId.get(YUSEN_JINJA)!.memo !== YUSEN_JINJA_MEMO_OLD) throw new Error("湯泉神社: memo現在値が期待と不一致");
  if (byId.get(TAIKOU)!.memo !== TAIKOU_MEMO_OLD) throw new Error("太閤の湯殿館: memo現在値が期待と不一致");
  if (byId.get(ONSENJI)!.memo !== ONSENJI_MEMO_OLD) throw new Error("温泉寺: memo現在値が期待と不一致");
  if (byId.get(NENBUTSUJI)!.memo !== NENBUTSUJI_MEMO_OLD) throw new Error("念仏寺: memo現在値が期待と不一致");
  if (byId.get(ARIMA_STREET)!.memo !== ARIMA_STREET_MEMO_OLD) throw new Error("有馬の温泉街: memo現在値が期待と不一致");
  if (Number(byId.get(ARIMA_STREET)!.lat) !== 34.796521 || Number(byId.get(ARIMA_STREET)!.lng) !== 135.248586) {
    throw new Error("有馬の温泉街: 座標の現在値が期待と不一致");
  }
  if (byId.get(GIN_NO_YU)!.memo !== GIN_NO_YU_MEMO_OLD) throw new Error("銀の湯: memo現在値が期待と不一致");
  if (byId.get(ZUIHOJI)!.memo !== ZUIHOJI_MEMO_OLD) throw new Error("瑞宝寺公園: memo現在値が期待と不一致");
  if (byId.get(KIN_NO_YU)!.memo !== KIN_NO_YU_MEMO_OLD) throw new Error("金の湯: memo現在値が期待と不一致");
  if (byId.get(OMOCHA_HAKUBUTSUKAN)!.memo !== OMOCHA_HAKUBUTSUKAN_MEMO_OLD) throw new Error("有馬玩具博物館: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("[Day1] 六甲ケーブル山上駅10:55(20)→記念碑台11:25(30,walk10)→六甲山牧場12:05(70,bus10、昼食)→六甲高山植物園13:30(50,bus15)→六甲ガーデンテラス14:25(55,walk5)→ROKKO森の音ミュージアム15:32(45,walk12)→六甲山天覧台16:27(30,bus10、16:57出発)");
  console.log("[文] 六甲ケーブル山上駅の入口に時刻を追加、「神戸市バス」→「バス」。昼食を六甲ガーデンテラスから六甲山牧場に移す。六甲山天覧台に夜景の一文・ロープウェー12分・宿の一文を追加");
  console.log("[座標] 六甲山牧場→バス停node5198817243(決まり361、法務確認)。瑞宝寺公園→node6373329589(法務指摘)。有馬の温泉街→「湯本坂」way690951979と一致(法務確認、座標は変更なし)");
  console.log("[Day2、瑞宝寺公園の点の直しに合わせ滞在30→25分で短縮し、見直す前の終わり16:51より遅くならないようにする] 湯泉神社09:00(40)→太閤の湯殿館09:41(60,walk1)→温泉寺10:42(50,walk1)→念仏寺11:33(40,walk1)→有馬の温泉街12:15(60,walk2)→銀の湯13:18(55,walk3)→瑞宝寺公園14:26(25,walk13)→金の湯15:05(55,walk14)→有馬玩具博物館16:01(50,walk1、16:51出発=見直す前と同じ)");
  console.log("[Day2 文] 湯泉神社の書き出しに分数(宿から約5分)を追加。「歩いてすぐ」→「歩いて約1分」(太閤の湯殿館・温泉寺・念仏寺・有馬玩具博物館とその前のスポットの結び)。帰りの一文に有馬温泉駅までの分数(約11分)を追加。有馬の温泉街に「湯本坂」の名前を追加");
  console.log("[座標の追加] 有馬の温泉街を「湯本坂」way690951979のNominatim値(34.796521,135.248585)に厳密に合わせる(企画運営指摘)。六甲高山植物園は、#21リトルワールドと同形の例外として企画運営が園のway自体の中心を承認(今回は座標の変更なし、チェックリストのメモに理由を残す)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1,
      [
        { id: SANJOEKI, data: { visitTime: t(10, 55), memo: SANJOEKI_MEMO_NEW } },
        { id: KINENHIDAI, data: { visitTime: t(11, 25) } },
        {
          id: BOKUJO,
          data: { visitTime: t(12, 5), stayDurationMin: 70, lat: 34.7519836, lng: 135.208809, memo: BOKUJO_MEMO_NEW },
        },
        { id: SHOKUBUTSUEN, data: { visitTime: t(13, 30), stayDurationMin: 50 } },
        { id: GARDEN_TERRACE, data: { visitTime: t(14, 25), stayDurationMin: 55, memo: GARDEN_TERRACE_MEMO_NEW } },
        { id: ORGEL_MUSEUM, data: { visitTime: t(15, 32), stayDurationMin: 45 } },
        { id: TENRANDAI, data: { visitTime: t(16, 27), memo: TENRANDAI_MEMO_NEW } },
      ],
      { tx }
    );

    await setDaySpotOrder(
      DAY2,
      [
        { id: YUSEN_JINJA, data: { memo: YUSEN_JINJA_MEMO_NEW } },
        { id: TAIKOU, data: { memo: TAIKOU_MEMO_NEW } },
        { id: ONSENJI, data: { memo: ONSENJI_MEMO_NEW } },
        { id: NENBUTSUJI, data: { memo: NENBUTSUJI_MEMO_NEW } },
        { id: ARIMA_STREET, data: { lat: 34.796521, lng: 135.248585, memo: ARIMA_STREET_MEMO_NEW } },
        { id: GIN_NO_YU, data: { memo: GIN_NO_YU_MEMO_NEW } },
        {
          id: ZUIHOJI,
          data: {
            visitTime: t(14, 26),
            stayDurationMin: 25,
            lat: 34.795324,
            lng: 135.256118,
            memo: ZUIHOJI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
          },
        },
        {
          id: KIN_NO_YU,
          data: {
            visitTime: t(15, 5),
            memo: KIN_NO_YU_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] },
          },
        },
        { id: OMOCHA_HAKUBUTSUKAN, data: { visitTime: t(16, 1), memo: OMOCHA_HAKUBUTSUKAN_MEMO_NEW } },
      ],
      { tx }
    );
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

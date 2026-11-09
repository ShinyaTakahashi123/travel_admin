/**
 * #29 竜串海岸とジョン万次郎資料館、足摺の海中美と歴史の1泊2日(47214a80)
 *
 * 初日の1か所目(竜串海岸)が09:00着で、入口の一文がなかった。中村駅(土佐くろしお鉄道)に
 * 10:30ごろ着(旅の入口は10:30より早くしない)+レンタカー手続き15分+運転38分(OSRM実測
 * 32.2分+5分、node8383599027→竜串海岸)で1か所目着11:23に。
 *
 * 6か所あったが、この時刻では全部回れないため、海のギャラリー(タイトル・説明文のいずれ
 * にも名前がなく、貝類の展示という竜串の海中美のテーマとはやや離れる)を外し5か所に。
 * 竜串海岸→足摺海洋館を直結(OSRM実測3.21分+5分=9分)。
 *
 * 足摺海洋館↔竜串グラスボートの区間は、もとは歩き(各12分)だったが、routed-footで測る
 * と実測30〜31分(道が大きく迂回)。環境省の足摺宇和海国立公園の周遊コースページ
 * (env.go.jp)では、この区間は「専用車」での移動とされており、車で測り直すとおよそ3分
 * (+5分=9分)。この旅はレンタカーでめぐる前提のため、車(9分)に変更。
 *
 * 入口の遅れ(143分)と区間の直し(海のギャラリーを外した分・足摺海洋館↔グラスボートを
 * 車にした分)で浮いた時間を埋めるため、5か所の滞在を決まりAで短縮: 竜串海岸70→50・
 * 足摺海洋館90→70(昼食)・竜串グラスボート90→70・大堂海岸40→30・柏島55→40。
 * 結果: 竜串海岸11:23(50)→足摺海洋館12:22(70,car9、昼食)→竜串グラスボート13:41
 * (70,car9)→大堂海岸15:31(30,car40)→柏島16:10(40,car9、16:50出発、初日の16:30〜
 * 17:00の範囲内)。
 *
 * 文は、竜串海岸に入口の時刻・レンタカー手続きの一文を追加。足摺海洋館の「のもおすすめ
 * です」(昼食の決まり違反の表現)を「しましょう」に直す。全スポットの「てみてください」
 * 「くださいに直す。柏島の結びは、1日目の終わりを「旅の締めくくり」と誤読されないよう、
 * 「この日めぐった海中美も、ここでひと区切り」の表現に直す(決まり: 締めの言葉は最後の
 * スポットだけ)。
 *
 * ラウンド2(法務・企画運営の本番前レビュー)で2日目の昼食を組み直した。最初の案
 * (金剛福寺の駐車場、着14:08・20分)は、着くのが13:30の目安を超える・20分では短すぎる・
 * 駐車場の点が例外なしには使えない、の3点で差し戻しとなった。企画運営の指示で、唐人駄場
 * 遺跡のあと先に足摺岬の集落へ移動して昼食をとる並びに組み直す: 唐人駄場遺跡のあと、新規
 * スポット「足摺岬観光案内所」(node4983997426、tourism=information、店ではない名前の
 * ある点、金剛福寺の目の前の食事処「足摺グランドレスト」・足摺岬214-13の食堂をWebSearch
 * で確認、店名はメモに書かない)に車でおよそ11分(OSRM実測5.88分+5分)、そこで昼食(35分)。
 * そこから車でおよそ6分(OSRM実測0.52分+5分)、白山洞門へ。以降は万次郎足湯→金剛福寺→
 * 足摺岬ともとの並びに戻す。
 *
 * ラウンド3(法務の全文確認)で3点を追加で直した:
 * 1. 万次郎足湯→金剛福寺(もと車5分): 白山洞門に停めた車まで歩いて戻る必要があるため、
 *    「歩いておよそ2分で白山洞門の駐車場に戻り、車でおよそ6分(OSRM実測0.43分+5分、
 *    白山洞門→金剛福寺)」の形に直す。増える3分は、万次郎足湯の滞在を15→12分に短縮して
 *    吸収(決まりA)。
 * 2. 足摺岬の帰りの一文: 「ご利用になれます」(ガイド口調)で分数・返却手続きもなかったため、
 *    「歩いておよそ10分で金剛福寺の駐車場の車に戻り、車でおよそ41分(OSRM実測35.54分+5分、
 *    金剛福寺→中村駅)の中村駅でレンタカーを返しましょう(返す手続きに15分ほど)。」に直す。
 * 3. 柏島の宿への一文「今夜はこの近くの宿で」を、2日目書き出しの「宿(柏島のあたり)」と
 *    そろえて「この夜は、柏島のあたりの宿に泊まりましょう。」に直す。
 *
 * 増えた17分(新規の往復11+6分のうち、もとの唐人駄場遺跡→白山洞門8分との差9分)と上記1の
 * 3分を埋めるため、白山洞門35→20・万次郎足湯30→12・金剛福寺50→36の滞在を短縮(決まりA、
 * 唐人駄場遺跡は60分のまま変更なし)。結果: 大岐海岸09:00(75)→ジョン万次郎資料館10:23
 * (50,car8)→中浜11:23(35,car10)→唐人駄場遺跡12:06(60,car8)→足摺岬観光案内所13:17
 * (35,car11、昼食)→白山洞門13:58(20,car6)→万次郎足湯14:20(12,walk2)→金剛福寺14:40
 * (36,walk2+car6)→足摺岬15:26(65,walk10、16:31出発=もとと同じ)。
 *
 * 全スポットの「てみてください」「ください」を「しましょう」に直す。全スポットの書き出し・
 * 終わりの文に実際の分数を追加(tcheck)。2日目1か所目(大岐海岸)に宿(柏島のあたり)
 * からの分数(OSRM実測42.04分+5分=48分)を追加。金剛福寺の祈りの一文を決まりの形に直す。
 *
 * 座標はNominatimで確認。竜串海岸(node10823593705)・竜串グラスボート・見残し海岸
 * (竜串海岸と同じ点、ボート乗り場が竜串海岸と同じ桟橋のため)・大堂海岸(node4664753388
 * 「大堂山展望台」)・柏島(way130956543)・大岐海岸(way389572324)・白山洞門
 * (node2569428195)・万次郎足湯(node2569428192)・金剛福寺(way1024256178「第38番
 * 札所金剛福寺」)は、現在値がNominatimと一致のため変更なし。ジョン万次郎資料館は、
 * way749870314(Nominatimの値、現在値から約52m)に修正。足摺岬は、メモが最初に触れる
 * 「展望台」の点(node4984012722「足摺岬展望台」、現在値から約253m)に修正。
 *
 * 【例外の判定(確定)】足摺海洋館「SATOUMI」(2023年開業)と唐人駄場遺跡は、OSM・地理院の
 * 住所検索・地名検索のいずれにも名前のある点が見当たらなかった。法務が地理院の基盤地図
 * 情報(zoom18)で確認したところ、SATOUMIの点は最も近い建物の輪郭から約34m(2023年開業の
 * 新しい建物が未反映の可能性)、唐人駄場の点は建物の輪郭から約11m(屋外の遺跡)で、企画運営
 * の判断により、いずれも「1件ずつの例外」として現状の点を維持する(法務・企画運営OK)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const DAY1 = "09c76a8d-bb32-4dcc-bd10-840ab01b0f15";
const DAY2 = "ef903b12-fc37-4f9d-81a4-73d9f7e79f3e";

const TATSUKUSHI = "81397fdd-0843-431f-b70a-1d29dab8922f";
const UMI_GALLERY = "9f6e7cb3-f520-4e09-8fa0-05203886b333";
const SATOUMI = "ae5b6cd0-a4dc-42e4-8c01-79c607d56991";
const GLASS_BOAT = "e28e2334-4b4d-4bd7-9216-13ded80bc187";
const ODO_KAIGAN = "fb050c23-3dfd-45c9-bc1f-4ab1097ee065";
const KASHIWAJIMA = "824dd1c4-52ec-4a95-b802-80a9bba71275";

const OKI_KAIGAN = "15aa47d3-02e7-4f57-bfed-70030bab903f";
const MANJIRO_SHIRYOKAN = "d68b111e-a317-403c-ab7a-83d2a865f517";
const NAKANOHAMA = "8eaee671-8d0f-476e-a023-fde6bb6ac543";
const TOJINDABA = "d2c28316-82aa-46fb-b631-c70b9add2080";
const HAKUSAN_DOMON = "3c56a4b2-1af0-4d32-ac41-e323cf4b379d";
const MANJIRO_ASHIYU = "e1153ba0-619f-451e-933a-47a1acc7d42f";
const KONGOFUKUJI = "16eb35dd-5c29-4ec7-911d-f29956fde192";
const ASHIZURIMISAKI = "693fc254-ce6e-480c-b829-8add99be1951";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const TATSUKUSHI_MEMO_OLD =
  "この旅はレンタカーなどでめぐります。旅の始まりは竜串海岸です。竜串周辺は、駐車場に車を置いて歩いてめぐりましょう。太平洋の荒波と強い風による長い年月の浸食を受け、新第三紀の砂岩・泥岩の地層が削られてできた、他に類を見ない奇岩の海岸です。岩肌には「蜂の巣構造」と呼ばれる無数の小さな穴が刻まれ、大竹・小竹・かぶと石など、それぞれに名付けられた奇岩・奇勝が点在する様子から、「地質の博物館」とも呼ばれています。昭和45年(1970)には、日本で最初に指定された海中公園(現在の海域公園)の一つとされています。波打ち際は滑りやすいところもあるので、足元に気をつけて歩いてみてください。この後は、歩いておよそ5分、海のギャラリーへ向かいましょう。";
const TATSUKUSHI_MEMO_NEW =
  "中村駅に10時30分ごろ着いたら、駅前でレンタカーを借りて(手続きに15分ほど)、車でおよそ38分、旅の始まりの竜串海岸に着きます。竜串周辺は、駐車場に車を置いて歩いてめぐりましょう。太平洋の荒波と強い風による長い年月の浸食を受け、新第三紀の砂岩・泥岩の地層が削られてできた、他に類を見ない奇岩の海岸です。岩肌には「蜂の巣構造」と呼ばれる無数の小さな穴が刻まれ、大竹・小竹・かぶと石など、それぞれに名付けられた奇岩・奇勝が点在する様子から、「地質の博物館」とも呼ばれています。昭和45年(1970)には、日本で最初に指定された海中公園(現在の海域公園)の一つとされています。波打ち際は滑りやすいところもあるので、足元に気をつけて歩きましょう。この後は、車でおよそ9分、足摺海洋館「SATOUMI」へ向かいましょう。";

const SATOUMI_MEMO_OLD =
  "海のギャラリーから歩いておよそ12分、足摺海洋館「SATOUMI」に着きます。およそ350種1万5千点の生き物を、70基の水槽で紹介する水族館で、黒潮の恵みを受けた足摺の海の生態系を、大きな水槽でまるごと再現しています。館内にはカフェもあるので、ここで昼食にするのもおすすめです。館内をゆっくりとめぐって、足摺の海の豊かさを体感してみてください。この後は、歩いておよそ12分、竜串グラスボート乗り場へ向かいましょう。";
const SATOUMI_MEMO_NEW =
  "竜串海岸から車でおよそ9分、足摺海洋館「SATOUMI」に着きます。およそ350種1万5千点の生き物を、70基の水槽で紹介する水族館で、黒潮の恵みを受けた足摺の海の生態系を、大きな水槽でまるごと再現しています。館内にはカフェもあるので、ここで昼食にしましょう。館内をゆっくりとめぐって、足摺の海の豊かさを体感しましょう。この後は、車でおよそ9分、竜串グラスボート乗り場へ向かいましょう。";

const GLASS_BOAT_MEMO_OLD =
  "足摺海洋館「SATOUMI」から歩いておよそ12分、竜串グラスボートの乗り場に着きます。底がガラス張りになった船に乗り込み、船上から竜串の海に群生するテーブルサンゴや、色とりどりの熱帯魚が泳ぐ海中の景色を眺めることができます。航路の先には、弘法大師がこの絶景を見残したという言い伝えが名の由来と伝わる見残し海岸があり、上陸すれば、竜串とはまた違った表情の奇岩群を間近で歩くこともできます。天候により運航状況が変わるので、訪れる前に公式サイトで確かめてください。竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせて楽しんでください。この後は、車でおよそ40分、大月町の大堂海岸へ向かいましょう。";
const GLASS_BOAT_MEMO_NEW =
  "足摺海洋館「SATOUMI」から車でおよそ9分、竜串グラスボートの乗り場に着きます。底がガラス張りになった船に乗り込み、船上から竜串の海に群生するテーブルサンゴや、色とりどりの熱帯魚が泳ぐ海中の景色を眺めることができます。航路の先には、弘法大師がこの絶景を見残したという言い伝えが名の由来と伝わる見残し海岸があり、上陸すれば、竜串とはまた違った表情の奇岩群を間近で歩くこともできます。天候により運航状況が変わるので、訪れる前に公式サイトで確かめましょう。竜串海岸から見残し海岸まで、太古の地球が刻んだ造形美と、生きたサンゴの海を、あわせて楽しみましょう。この後は、車でおよそ40分、大月町の大堂海岸へ向かいましょう。";

const KASHIWAJIMA_MEMO_OLD =
  "大堂海岸から車でおよそ9分、橋を渡って柏島に着きます。黒潮と豊後水道の流れがぶつかる海域に浮かぶ小島で、抜群の透明度を誇るエメラルドグリーンの海は、まるで船が宙に浮いているように見えると評判です。多くの魚種が生息する海として、国内屈指のダイビングスポットともいわれています。島内の集落を歩きながら、橋の上や岸辺から、透き通った海の色をゆっくりと眺めてみてください。竜串海岸から続いた足摺の海中美をめぐる旅も、ここで終わりです。今夜はこの近くの宿でゆっくり休みましょう。";
const KASHIWAJIMA_MEMO_NEW =
  "大堂海岸から車でおよそ9分、橋を渡って柏島に着きます。黒潮と豊後水道の流れがぶつかる海域に浮かぶ小島で、抜群の透明度を誇るエメラルドグリーンの海は、まるで船が宙に浮いているように見えると評判です。多くの魚種が生息する海として、国内屈指のダイビングスポットともいわれています。島内の集落を歩きながら、橋の上や岸辺から、透き通った海の色をゆっくりと眺めましょう。竜串海岸から続いた、この日めぐった海中美も、ここでひと区切りです。この夜は、柏島のあたりの宿に泊まりましょう。";

const OKI_KAIGAN_MEMO_OLD =
  "旅の2日目は、大岐海岸から始めます。真っ白な砂浜と緑の松林が1.6kmにわたって弧を描く美しい海岸で、足摺国立公園の東の玄関口ともいわれています。近年はサーフスポットとしても人気を集めているほか、絶滅危惧種のアカウミガメが産卵のために上陸することでも知られています。朝の澄んだ空気の中、白い砂浜をのんびりと歩いてみてください。この後は、車でおよそ8分、ジョン万次郎の資料館へ向かいましょう。";
const OKI_KAIGAN_MEMO_NEW =
  "旅の2日目は、宿(柏島のあたり)から車でおよそ48分の大岐海岸から始めます。真っ白な砂浜と緑の松林が1.6kmにわたって弧を描く美しい海岸で、足摺国立公園の東の玄関口ともいわれています。近年はサーフスポットとしても人気を集めているほか、絶滅危惧種のアカウミガメが産卵のために上陸することでも知られています。朝の澄んだ空気の中、白い砂浜をのんびりと歩きましょう。この後は、車でおよそ8分、ジョン万次郎の資料館へ向かいましょう。";

const TOJINDABA_MEMO_OLD =
  "中浜地区から車でおよそ8分、足摺半島の付け根、標高およそ400mの高原に広がる唐人駄場遺跡に着きます。縄文時代早期にまでさかのぼる石器や土器片が出土している場所で、丘の上には大小の巨石群が点在し、環状に並ぶ配置から、古代の祭祀の場だったのではないかとも考えられています。巨石の上によじ登ることもでき、足摺の山並みと海を望む360度の大パノラマが広がります。石の上は滑りやすいこともあるので、足元に気をつけて歩いてください。この後は、車でおよそ8分、白山洞門へ向かいましょう。";
const TOJINDABA_MEMO_NEW =
  "中浜地区から車でおよそ8分、足摺半島の付け根、標高およそ400mの高原に広がる唐人駄場遺跡に着きます。縄文時代早期にまでさかのぼる石器や土器片が出土している場所で、丘の上には大小の巨石群が点在し、環状に並ぶ配置から、古代の祭祀の場だったのではないかとも考えられています。巨石の上によじ登ることもでき、足摺の山並みと海を望む360度の大パノラマが広がります。石の上は滑りやすいこともあるので、足元に気をつけて歩きましょう。この後は、車でおよそ11分、足摺岬観光案内所へ向かいましょう。";

const ASHIZURIMISAKI_INFO_MEMO =
  "唐人駄場遺跡から車でおよそ11分、足摺岬観光案内所に着きます。足摺岬周辺の見どころや遊歩道を案内する施設で、すぐそばには食事処もあるので、ここで昼食にしましょう。腹ごしらえをしたら、車でおよそ6分、白山洞門へ向かいましょう。";

const HAKUSAN_DOMON_MEMO_OLD =
  "唐人駄場遺跡から車でおよそ8分、白山洞門に着きます。花崗岩の岩盤が、長い年月をかけて波に浸食されてできた海蝕洞で、高さおよそ16m・幅およそ17mという、日本最大級ともいわれる花崗岩の洞門です。昭和28年(1953)には高知県の天然記念物に指定されました。「万次郎足湯」からの眺めが一番のビューポイントとされ、洞門のそばまで続く遊歩道を歩けば、間近でその迫力を感じることもできます。足摺の荒々しい海岸美を、ゆっくりと眺めてみてください。この後は、歩いておよそ2分、万次郎足湯へ向かいましょう。";
const HAKUSAN_DOMON_MEMO_NEW =
  "足摺岬観光案内所から車でおよそ6分、白山洞門に着きます。花崗岩の岩盤が、長い年月をかけて波に浸食されてできた海蝕洞で、高さおよそ16m・幅およそ17mという、日本最大級ともいわれる花崗岩の洞門です。昭和28年(1953)には高知県の天然記念物に指定されました。「万次郎足湯」からの眺めが一番のビューポイントとされ、洞門のそばまで続く遊歩道を歩けば、間近でその迫力を感じることもできます。足摺の荒々しい海岸美を、ゆっくりと眺めましょう。この後は、歩いておよそ2分、万次郎足湯へ向かいましょう。";

const MANJIRO_ASHIYU_MEMO_OLD =
  "白山洞門から歩いておよそ2分、万次郎足湯に着きます。階段状に4つの浴槽が並ぶ足湯施設で、全面ガラス張りの窓からは、青い空と太平洋、そして日本有数の大きさを誇る白山洞門を一望できます。歩き疲れた足を、大パノラマを眺めながら休めてみてください。この後は、車でおよそ5分、金剛福寺へ向かいましょう。";
const MANJIRO_ASHIYU_MEMO_NEW =
  "白山洞門から歩いておよそ2分、万次郎足湯に着きます。階段状に4つの浴槽が並ぶ足湯施設で、全面ガラス張りの窓からは、青い空と太平洋、そして日本有数の大きさを誇る白山洞門を一望できます。歩き疲れた足を、大パノラマを眺めながら休めましょう。この後は、歩いておよそ2分で白山洞門の駐車場に戻り、車でおよそ6分、金剛福寺へ向かいましょう。";

const KONGOFUKUJI_MEMO_OLD =
  "万次郎足湯から車でおよそ5分、四国最南端の足摺岬に建つ金剛福寺に着きます。弘仁13年(822)、嵯峨天皇の勅願を受けた弘法大師が、翌弘仁14年(823)に三面千手観音像を刻んで本尊とし、開いたと伝えられる真言宗の寺院です。四国八十八箇所の第38番札所で、隣の第37番札所・岩本寺からおよそ90kmという、八十八箇所の中でも最も長い札所間の道のりを歩き終えた遍路たちが、たどり着く寺としても知られています。「南海の御殿」とも称される庭園には、亜熱帯の植物が生い茂り、四国の中でも南国らしい風情を漂わせています。参道沿いには食事処もあるので、ここで昼食にしましょう。静かに、敬意をもって参拝してください。この後は、遊歩道を歩いておよそ10分、足摺岬へ向かいましょう。";
const KONGOFUKUJI_MEMO_NEW =
  "万次郎足湯から歩いておよそ2分で白山洞門の駐車場に戻り、車でおよそ6分、四国最南端の足摺岬に建つ金剛福寺に着きます。弘仁13年(822)、嵯峨天皇の勅願を受けた弘法大師が、翌弘仁14年(823)に三面千手観音像を刻んで本尊とし、開いたと伝えられる真言宗の寺院です。四国八十八箇所の第38番札所で、隣の第37番札所・岩本寺からおよそ90kmという、八十八箇所の中でも最も長い札所間の道のりを歩き終えた遍路たちが、たどり着く寺としても知られています。「南海の御殿」とも称される庭園には、亜熱帯の植物が生い茂り、四国の中でも南国らしい風情を漂わせています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、遊歩道を歩いておよそ10分、足摺岬へ向かいましょう。";

const ASHIZURIMISAKI_MEMO_OLD =
  "金剛福寺から遊歩道を歩いておよそ10分、四国最南端の岬・足摺岬に着きます。展望台からは、視界をさえぎるもののない水平線が弧を描く、およそ270度の大パノラマが広がり、地球が丸いことを実感できる場所として知られています。高さ18mの足摺岬灯台は、大正3年(1914)の初点灯以来、太平洋を行き交う船を見守り続けています。岬の先端には、コンパスと三角定規を手にしたジョン万次郎の銅像が、自身が渡った海を見据えるようにたたずんでおり、昭和43年(1968)に除幕されました。2月から3月上旬には、周辺の斜面を彩るヤブツバキも見ごろを迎えます。竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで終わりです。お帰りは、駐車場に置いた車でご利用ください。";
const ASHIZURIMISAKI_MEMO_NEW =
  "金剛福寺から遊歩道を歩いておよそ10分、四国最南端の岬・足摺岬に着きます。展望台からは、視界をさえぎるもののない水平線が弧を描く、およそ270度の大パノラマが広がり、地球が丸いことを実感できる場所として知られています。高さ18mの足摺岬灯台は、大正3年(1914)の初点灯以来、太平洋を行き交う船を見守り続けています。岬の先端には、コンパスと三角定規を手にしたジョン万次郎の銅像が、自身が渡った海を見据えるようにたたずんでおり、昭和43年(1968)に除幕されました。2月から3月上旬には、周辺の斜面を彩るヤブツバキも見ごろを迎えます。竜串海岸から続いた足摺の海中美と歴史をめぐる旅も、ここで終わりです。見学を終えたら、歩いておよそ10分で金剛福寺の駐車場の車に戻り、車でおよそ41分の中村駅でレンタカーを返しましょう(返す手続きに15分ほど)。";

const NAKANOHAMA_MEMO_OLD =
  "ジョン万次郎資料館から車でおよそ10分、万次郎が生まれ育った中浜地区に着きます。生誕地の碑のそばには、残された写真をもとに、平成22年(2010)に復元された茅葺き屋根の生家があります。木造平屋の質素なたたずまいから、漁師の家に生まれ育った少年が、のちに幕末の国際人として活躍するまでの道のりに思いを馳せることができます。海辺の小さな漁村の風景を、静かに歩いてみてください。この後は、車でおよそ8分、唐人駄場遺跡へ向かいましょう。";
const NAKANOHAMA_MEMO_NEW =
  "ジョン万次郎資料館から車でおよそ10分、万次郎が生まれ育った中浜地区に着きます。生誕地の碑のそばには、残された写真をもとに、平成22年(2010)に復元された茅葺き屋根の生家があります。木造平屋の質素なたたずまいから、漁師の家に生まれ育った少年が、のちに幕末の国際人として活躍するまでの道のりに思いを馳せることができます。海辺の小さな漁村の風景を、静かに歩きましょう。この後は、車でおよそ8分、唐人駄場遺跡へ向かいましょう。";

async function main() {
  const day1Ids = [TATSUKUSHI, UMI_GALLERY, SATOUMI, GLASS_BOAT, ODO_KAIGAN, KASHIWAJIMA];
  const day2Ids = [
    OKI_KAIGAN,
    MANJIRO_SHIRYOKAN,
    NAKANOHAMA,
    TOJINDABA,
    HAKUSAN_DOMON,
    MANJIRO_ASHIYU,
    KONGOFUKUJI,
    ASHIZURIMISAKI,
  ];
  const spots = await prisma.spot.findMany({
    where: { id: { in: [...day1Ids, ...day2Ids] } },
    include: { transitLegs: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  const checkStay = (id: string, min: number, label: string) => {
    if (byId.get(id)!.stayDurationMin !== min) throw new Error(`${label}: 滞在の現在値が期待と不一致`);
  };
  const checkLeg = (id: string, min: number | null, mode: string | null, label: string) => {
    const legs = byId.get(id)!.transitLegs;
    if (min === null) {
      if (legs.length) throw new Error(`${label}: legsが空のはずが存在する`);
      return;
    }
    if (!legs.length || legs[0].transitDurationMin !== min || (mode && legs[0].transitMode !== mode)) {
      throw new Error(`${label}: 直前の区間の現在値が期待と不一致`);
    }
  };
  const checkLatLng = (id: string, lat: number, lng: number, label: string) => {
    const s = byId.get(id)!;
    const curLat = s.lat?.toNumber() ?? 0;
    const curLng = s.lng?.toNumber() ?? 0;
    if (Math.abs(curLat - lat) > 1e-6 || Math.abs(curLng - lng) > 1e-6) {
      throw new Error(`${label}: 座標の現在値が期待と不一致`);
    }
  };

  checkTime(TATSUKUSHI, 9, 0, "竜串海岸");
  checkTime(UMI_GALLERY, 10, 15, "海のギャラリー");
  checkTime(SATOUMI, 11, 7, "足摺海洋館");
  checkTime(GLASS_BOAT, 12, 49, "竜串グラスボート");
  checkTime(ODO_KAIGAN, 14, 59, "大堂海岸");
  checkTime(KASHIWAJIMA, 15, 48, "柏島");
  checkTime(OKI_KAIGAN, 9, 0, "大岐海岸");
  checkTime(MANJIRO_SHIRYOKAN, 10, 23, "ジョン万次郎資料館");
  checkTime(NAKANOHAMA, 11, 23, "中浜");
  checkTime(TOJINDABA, 12, 6, "唐人駄場遺跡");
  checkTime(HAKUSAN_DOMON, 13, 14, "白山洞門");
  checkTime(MANJIRO_ASHIYU, 13, 51, "万次郎足湯");
  checkTime(KONGOFUKUJI, 14, 26, "金剛福寺");
  checkTime(ASHIZURIMISAKI, 15, 26, "足摺岬");

  checkStay(TATSUKUSHI, 70, "竜串海岸");
  checkStay(UMI_GALLERY, 40, "海のギャラリー");
  checkStay(SATOUMI, 90, "足摺海洋館");
  checkStay(GLASS_BOAT, 90, "竜串グラスボート");
  checkStay(ODO_KAIGAN, 40, "大堂海岸");
  checkStay(KASHIWAJIMA, 55, "柏島");
  checkStay(OKI_KAIGAN, 75, "大岐海岸");
  checkStay(MANJIRO_SHIRYOKAN, 50, "ジョン万次郎資料館");
  checkStay(NAKANOHAMA, 35, "中浜");
  checkStay(TOJINDABA, 60, "唐人駄場遺跡");
  checkStay(HAKUSAN_DOMON, 35, "白山洞門");
  checkStay(MANJIRO_ASHIYU, 30, "万次郎足湯");
  checkStay(KONGOFUKUJI, 50, "金剛福寺");
  checkStay(ASHIZURIMISAKI, 65, "足摺岬");

  checkLeg(TATSUKUSHI, null, null, "竜串海岸");
  checkLeg(UMI_GALLERY, 5, "walk", "竜串海岸→海のギャラリー");
  checkLeg(SATOUMI, 12, "walk", "海のギャラリー→足摺海洋館");
  checkLeg(GLASS_BOAT, 12, "walk", "足摺海洋館→竜串グラスボート");
  checkLeg(ODO_KAIGAN, 40, "car", "竜串グラスボート→大堂海岸");
  checkLeg(KASHIWAJIMA, 9, "car", "大堂海岸→柏島");
  checkLeg(OKI_KAIGAN, null, null, "大岐海岸");
  checkLeg(MANJIRO_SHIRYOKAN, 8, "car", "大岐海岸→ジョン万次郎資料館");
  checkLeg(NAKANOHAMA, 10, "car", "ジョン万次郎資料館→中浜");
  checkLeg(TOJINDABA, 8, "car", "中浜→唐人駄場遺跡");
  checkLeg(HAKUSAN_DOMON, 8, "car", "唐人駄場遺跡→白山洞門");
  checkLeg(MANJIRO_ASHIYU, 2, "walk", "白山洞門→万次郎足湯");
  checkLeg(KONGOFUKUJI, 5, "car", "万次郎足湯→金剛福寺");
  checkLeg(ASHIZURIMISAKI, 10, "walk", "金剛福寺→足摺岬");

  checkLatLng(MANJIRO_SHIRYOKAN, 32.781765, 132.932404, "ジョン万次郎資料館");
  checkLatLng(ASHIZURIMISAKI, 32.72504, 133.01809, "足摺岬");

  if (byId.get(TATSUKUSHI)!.memo !== TATSUKUSHI_MEMO_OLD) throw new Error("竜串海岸: memo現在値が期待と不一致");
  if (byId.get(SATOUMI)!.memo !== SATOUMI_MEMO_OLD) throw new Error("足摺海洋館: memo現在値が期待と不一致");
  if (byId.get(GLASS_BOAT)!.memo !== GLASS_BOAT_MEMO_OLD) throw new Error("竜串グラスボート: memo現在値が期待と不一致");
  if (byId.get(KASHIWAJIMA)!.memo !== KASHIWAJIMA_MEMO_OLD) throw new Error("柏島: memo現在値が期待と不一致");
  if (byId.get(OKI_KAIGAN)!.memo !== OKI_KAIGAN_MEMO_OLD) throw new Error("大岐海岸: memo現在値が期待と不一致");
  if (byId.get(TOJINDABA)!.memo !== TOJINDABA_MEMO_OLD) throw new Error("唐人駄場遺跡: memo現在値が期待と不一致");
  if (byId.get(HAKUSAN_DOMON)!.memo !== HAKUSAN_DOMON_MEMO_OLD) throw new Error("白山洞門: memo現在値が期待と不一致");
  if (byId.get(MANJIRO_ASHIYU)!.memo !== MANJIRO_ASHIYU_MEMO_OLD) throw new Error("万次郎足湯: memo現在値が期待と不一致");
  if (byId.get(KONGOFUKUJI)!.memo !== KONGOFUKUJI_MEMO_OLD) throw new Error("金剛福寺: memo現在値が期待と不一致");
  if (byId.get(ASHIZURIMISAKI)!.memo !== ASHIZURIMISAKI_MEMO_OLD) throw new Error("足摺岬: memo現在値が期待と不一致");
  if (byId.get(NAKANOHAMA)!.memo !== NAKANOHAMA_MEMO_OLD) throw new Error("中浜: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log(
    "[Day1] 竜串海岸11:23(50)→足摺海洋館12:22(70,car9、昼食)→竜串グラスボート13:41(70,car9)→大堂海岸15:31(30,car40)→柏島16:10(40,car9、16:50出発)"
  );
  console.log(
    "[Day2] 大岐海岸09:00(75)→ジョン万次郎資料館10:23(50,car8)→中浜11:23(35,car10)→唐人駄場遺跡12:06(60,car8)→足摺岬観光案内所13:17(35,car11、昼食、新規)→白山洞門13:58(20,car6)→万次郎足湯14:20(12,walk2)→金剛福寺14:40(36,walk2+car6)→足摺岬15:26(65,walk10、16:31出発=もとと同じ)"
  );
  console.log("[除外] 海のギャラリー(タイトル・説明文に名前なし)を削除。竜串海岸→足摺海洋館を直結(car9)");
  console.log(
    "[mode] 足摺海洋館↔竜串グラスボート: もと歩き各12分だったが、routed-footで実測30〜31分(大きく迂回)。環境省の国立公園周遊コースページでは専用車移動とされており、車(各9分)に変更"
  );
  console.log(
    "[昼食] 足摺海洋館の「のもおすすめです」(決まり違反)を「しましょう」に。金剛福寺(寺社)の昼食は、唐人駄場遺跡のあとに新規スポット「足摺岬観光案内所」(店でない名前の点)を挿入して移動(着13:17、11:30〜13:30内、35分)"
  );
  console.log("[文] 全スポットの「てみてください」「ください」を「しましょう」に。柏島の結びを「締めくくり」と誤読されない表現に。金剛福寺の祈りの一文を決まりの形に");
  console.log(
    "[座標] ジョン万次郎資料館→way749870314(Nominatimの値、約52m)、足摺岬→node4984012722「足摺岬展望台」(Nominatimの値、約253m)に修正。他は現在値がNominatimと一致のため変更なし。足摺海洋館・唐人駄場遺跡は、法務の基盤地図情報確認を経て企画運営が1件ずつの例外として現状維持を確定"
  );

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1,
      [
        { id: TATSUKUSHI, data: { visitTime: t(11, 23), stayDurationMin: 50, memo: TATSUKUSHI_MEMO_NEW } },
        {
          id: SATOUMI,
          data: {
            visitTime: t(12, 22),
            stayDurationMin: 70,
            memo: SATOUMI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
          },
        },
        {
          id: GLASS_BOAT,
          data: {
            visitTime: t(13, 41),
            stayDurationMin: 70,
            memo: GLASS_BOAT_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
          },
        },
        { id: ODO_KAIGAN, data: { visitTime: t(15, 31), stayDurationMin: 30 } },
        { id: KASHIWAJIMA, data: { visitTime: t(16, 10), stayDurationMin: 40, memo: KASHIWAJIMA_MEMO_NEW } },
      ],
      { remove: [UMI_GALLERY], tx }
    );

    await setDaySpotOrder(
      DAY2,
      [
        { id: OKI_KAIGAN, data: { memo: OKI_KAIGAN_MEMO_NEW } },
        { id: MANJIRO_SHIRYOKAN, data: { lat: 32.7813927, lng: 132.9327159 } },
        { id: NAKANOHAMA, data: { memo: NAKANOHAMA_MEMO_NEW } },
        { id: TOJINDABA, data: { memo: TOJINDABA_MEMO_NEW } },
        {
          create: {
            name: "足摺岬観光案内所",
            address: "高知県土佐清水市足摺岬",
            lat: 32.7257643,
            lng: 133.019578,
            memo: ASHIZURIMISAKI_INFO_MEMO,
            visitTime: t(13, 17),
            stayDurationMin: 35,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 11 }] },
          },
        },
        {
          id: HAKUSAN_DOMON,
          data: {
            visitTime: t(13, 58),
            stayDurationMin: 20,
            memo: HAKUSAN_DOMON_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
          },
        },
        {
          id: MANJIRO_ASHIYU,
          data: {
            visitTime: t(14, 20),
            stayDurationMin: 12,
            memo: MANJIRO_ASHIYU_MEMO_NEW,
          },
        },
        {
          id: KONGOFUKUJI,
          data: {
            visitTime: t(14, 40),
            stayDurationMin: 36,
            memo: KONGOFUKUJI_MEMO_NEW,
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "walk", transitDurationMin: 2 },
                { orderNo: 2, transitMode: "car", transitDurationMin: 6 },
              ],
            },
          },
        },
        {
          id: ASHIZURIMISAKI,
          data: {
            lat: 32.7256763,
            lng: 133.0206821,
            memo: ASHIZURIMISAKI_MEMO_NEW,
          },
        },
      ],
      { tx }
    );
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

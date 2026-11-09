/**
 * ba8c13f1（筥崎宮と大濠公園、太宰府天満宮と水城跡、門司港レトロをめぐる福岡2泊3日）
 * 初日・最終日の見直し（2026-10-30）
 * 仕様: docs/specs/20261029-first-last-day-times.md
 * - 初日(Day1): 1か所目11時ごろ(10:45〜11:45)、16:30〜17:00に最後の行き先を出る、3か所以上
 * - 中の日(Day2): 時刻・並びは直さない（座標の精密確認のみ）
 * - 最終日・2泊以上(Day3): 14:30〜15:00に出る、3か所以上
 *
 * 初日: 8か所中7か所がタイトル・説明文に名前があり、唯一「博多町家ふるさと館」だけを外し
 * 7か所に（櫛田神社から直接川端通商店街へ歩くのとほぼ同じ距離だったため、ふるさと館の
 * 滞在35分＋前後の歩き往復をほぼ丸ごと浮かせる形）。入口に、博多駅から箱崎宮前駅までの
 * 地下鉄（中洲川端駅で箱崎線に乗り換え）の一文を追加（約12分、企画運営の指摘で公式の
 * 乗換案内の実例時刻を出典として明記。OSRM＝車の道のりは使わない）。
 *
 * 座標の直し（7章の決まり）: 福岡城跡（舞鶴公園）の現在値は何もない道の点で、本来の
 * 「大天守台跡」node4968414505（約494m）に直す。これに伴い福岡城跡→大濠公園の歩きが
 * walk5→20に大きく変わり、もとの「西どなり」という書き出しも歩いて約20分の表現に直す。
 * 川端通商店街も、OSMの「川端商店街」node（tourism=attraction）に6桁まで完全一致させる
 * 直しを追加（櫛田神社→川端通商店街 walk2→3）。他5か所（筥崎宮・櫛田神社・大濠公園・
 * 福岡市博物館・福岡タワー）は変更なし。
 *
 * この直しで延びる分を埋めるため、川端通商店街65→30分・福岡城跡50→40分・福岡市博物館
 * 50→40分・福岡タワー50→40分に短縮（決まりA、短縮のみ。筥崎宮・櫛田神社・大濠公園は
 * 変更なし）: 筥崎宮10:45(40)→櫛田神社11:50(40)→川端通商店街12:33(30,昼食)→
 * 福岡城跡13:28(40)→大濠公園14:28(45)→福岡市博物館15:33(40)→福岡タワー16:18(40、
 * 16:58出発)
 *
 * 中の日(Day2)は時刻・並びを直さない。座標の精密確認で、太宰府天満宮参道・光明禅寺の
 * 2か所をOSMの実在の点に6桁まで合わせる（参道33.5206,130.5333→33.519539,130.533487、
 * 光明禅寺33.518291,130.533759→33.518187,130.533933＝landuse=religiousのOSM way
 * 「光明禅寺」のNominatim中心に完全一致）。これに伴い戒壇院→参道walk20→23（本文も
 * 「歩いて約23分」に直す）・参道→光明禅寺walk5→3・光明禅寺→天満宮walk5→6が変わり、
 * 太宰府天満宮参道12:25→12:28・光明禅寺13:30→13:31・太宰府天満宮14:15→14:17・
 * 九州国立博物館15:25→15:27に時刻が繰り下がる（最終の帰りの電車の時刻は変えない）。
 * 水城跡・大宰府政庁跡・観世音寺・戒壇院・太宰府天満宮・九州国立博物館の座標は変更なし。
 * 水城跡の「〜してください」を「〜しましょう」に直す
 *
 * 最終日(Day3)は2泊以上の最終日のため14:30〜15:00の決まりが当たる。説明文・タイトルに
 * 名前のない関門海峡ミュージアム・和布刈神社を外し7か所に（九州鉄道記念館から関門海峡
 * 人道入口へ直接歩くのとほぼ同じ距離だったため、2か所分の滞在80分と前後の歩きをほぼ
 * 丸ごと浮かせる形）。座標の精密確認で、門司港レトロ地区・関門海峡人道入口の2か所も
 * 直す（レトロ地区33.9481,130.9639→33.9480717,130.9641736＝OSM way823695331「大連
 * 友好記念館」のNominatim値、地区に単一のOSM点はないため名前のある地物で代用。人道入口
 * 33.958204,130.968201→33.9612865,130.9630471＝OSM way90115760「関門トンネル人道
 * 入口」building、門司区=門司側であることを確認済み。いずれも法務の指摘2026-10-30
 * 10:43で名前のない/誤った点から変更）。税関→レトロ地区walk5→3・記念館→人道入口は
 * 新しい点でも実測33.3分で変更なし（walk33のまま）。帰りのバス約10分は、新しい点の
 * 近くの「和布刈神社前」バス停を経由して成り立つことを確認。税関→レトロ地区の直しで
 * レトロ地区11:50→11:48・記念館13:00→12:58・人道入口14:22→14:21に時刻が繰り下がる
 * （終了14:56、範囲内）。九州鉄道記念館60→50分に短縮（決まりA、短縮のみ。他6か所は
 * 変更なし）: 門司港駅09:30(25)→三井倶楽部10:00(40)→大阪商船10:45(25)→税関11:15(30)→
 * レトロ地区11:48(60,昼食)→記念館12:58(50)→人道入口14:21(35、14:56出発)。人道入口の
 * 末尾の帰りの一文はそのまま使える
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

// Day1
const DAY1 = "819ae55b-4127-499c-bfb5-85fb52eb38f7";
const HAKOZAKI = "a5260776-8e0e-4bd0-984a-6e7043ae5dda";
const KUSHIDA = "a73f6d75-da30-44b8-8476-2a2ea110bb1e";
const FURUSATOKAN = "a7239ce2-2015-4864-ab4a-b73808609de6"; // 削除
const KAWABATA = "8575f620-bc21-4f8a-97bb-c505a58e5220";
const FUKUOKAJO = "c8bb7014-fea6-4436-b211-5d5f0f1321e6";
const OHORI = "068acf29-1932-490e-9c42-fd85ff9c11e8";
const FUKUOKA_MUSEUM = "990d432a-2d54-49a4-a525-a9e93ab47f67";
const FUKUOKA_TOWER = "a08351ed-e648-4abd-9544-ddd915f54a95";

// Day2
const MIZUKI = "a5a26ff5-7ec4-4c2e-a0b0-af594e768321";
const SANDO = "5d99295d-8b05-471f-853b-a458b4f5a6a9"; // 太宰府天満宮参道
const KOMYOZENJI = "f38efe5a-e5f7-4be9-8b59-dd002d2bd575"; // 光明禅寺
const TENMANGU = "8cfe7abc-8bf0-4085-bb9e-832272c7d983"; // 太宰府天満宮
const KYUHAKU = "d7266cba-1f26-4d23-80ab-805cc8960e3f"; // 九州国立博物館

// Day3
const DAY3 = "e8873115-a9d9-43c7-94b9-583686e49f94";
const MOJIKO_STA = "2007ac80-3be4-47a0-86a7-0939aa9d0457";
const MITSUI_CLUB = "b1d16910-404e-47ff-984d-f15971cde6c7";
const OSAKA_SHOSEN = "66d62131-5d82-4049-a570-9c8c48033a14";
const ZEIKAN = "672c8a5a-7fa9-4155-aaa2-77e9b09a8b2c";
const RETRO_DISTRICT = "6c615384-ab70-4ce8-b180-80fc0d27b21c";
const RAILWAY_MUSEUM = "e9a94585-d737-4cd6-9af2-524f0dff9c10";
const KANMON_MUSEUM = "bc3f5978-a25a-4a98-b131-e67b3c07cff6"; // 削除
const MEKARI_JINJA = "8f24f645-6851-4e02-b85c-416d0da8f1f3"; // 削除
const PEDESTRIAN_ENTRANCE = "15e5e351-ae53-4685-9597-d8c84fd70941";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const HAKOZAKI_MEMO_OLD =
  "福岡の旅は、地下鉄箱崎線の箱崎宮前駅から歩いてすぐの筥崎宮から始めます。延長元年（923年）の創建と伝わる筑前国一宮で、日本三大八幡の一つともいわれます。文禄3年（1594年）に小早川隆景が建てた楼門は国の重要文化財で、亀山上皇の筆と伝わる「敵國降伏」の額が掲げられています。鎌倉時代の元寇にゆかりのある神社としても知られます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const HAKOZAKI_MEMO_NEW =
  "福岡の旅は、博多駅から地下鉄（中洲川端駅で箱崎線に乗り換え）で約12分の箱崎宮前駅に10時45分ごろ着いたら、歩いてすぐの筥崎宮から始めます。延長元年（923年）の創建と伝わる筑前国一宮で、日本三大八幡の一つともいわれます。文禄3年（1594年）に小早川隆景が建てた楼門は国の重要文化財で、亀山上皇の筆と伝わる「敵國降伏」の額が掲げられています。鎌倉時代の元寇にゆかりのある神社としても知られます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const KAWABATA_MEMO_OLD =
  "ふるさと館から歩いてすぐ。130年以上の歴史を持つ、博多を代表するアーケードの商店街で、博多祇園山笠のフィナーレ「追い山笠」のゴール地点としても知られます。老舗の食料品店などが並ぶ通りを歩き、このあたりで昼食にしましょう。";
const KAWABATA_MEMO_NEW =
  "櫛田神社から歩いてすぐ。130年以上の歴史を持つ、博多を代表するアーケードの商店街で、博多祇園山笠のフィナーレ「追い山笠」のゴール地点としても知られます。老舗の食料品店などが並ぶ通りを歩き、このあたりで昼食にしましょう。";

const FUKUOKAJO_MEMO_OLD =
  "中洲川端駅から地下鉄空港線で赤坂駅へ、歩いて約10分。初代福岡藩主・黒田長政が、慶長6年（1601年）から7年がかりで築いた平山城の跡で、国の史跡です。黒田家は12代・270年以上にわたってこの城を居城としました。国の重要文化財の多聞櫓などが残り、大天守台は展望台になっています。春は桜の名所としてにぎわいます。石垣や天守台の石段では足元に気をつけましょう。";
const FUKUOKAJO_MEMO_NEW =
  "中洲川端駅から地下鉄空港線で赤坂駅へ、歩いて約10分。初代福岡藩主・黒田長政が、慶長6年（1601年）から7年がかりで築いた平山城の跡で、国の史跡です。黒田家は12代・270年以上にわたってこの城を居城としました。国の重要文化財の多聞櫓などが残り、大天守台は展望台になっています。春は桜の名所としてにぎわいます。石垣や天守台の石段では足元に気をつけましょう。";

const OHORI_MEMO_OLD =
  "城跡の西どなりの大濠公園へ。古くは草ヶ江と呼ばれた博多湾の入り江で、福岡城を築くときに、城の外濠（大堀）として守りに使われました。昭和4年（1929年）に公園として開かれ、公園のほとんどを楕円形の大きな池が占めています。池のまわりの遊歩道を歩き、日本庭園や貸しボートも楽しめます（ボートでは係員の案内に従いましょう）。池のそばでは足元に気をつけましょう。";
const OHORI_MEMO_NEW =
  "福岡城跡から歩いて約20分、大濠公園に着きます。古くは草ヶ江と呼ばれた博多湾の入り江で、福岡城を築くときに、城の外濠（大堀）として守りに使われました。昭和4年（1929年）に公園として開かれ、公園のほとんどを楕円形の大きな池が占めています。池のまわりの遊歩道を歩き、日本庭園や貸しボートも楽しめます（ボートでは係員の案内に従いましょう）。池のそばでは足元に気をつけましょう。";

const MIZUKI_MEMO_OLD =
  "2日目は太宰府へ。天神駅から西鉄天神大牟田線で下大利駅へ向かい、歩いて約25分の水城跡から始めます。663年の白村江の戦いのあと、北部九州を守るために築かれた土塁の跡で、長さ約1.2km、高さ約10m、博多湾側には幅約60mの外濠があったとされ、国の特別史跡に指定されています。東門の北側にある水城館は、平成29年（2017年）に大宰府展示館の分館として開かれた施設で、パネルや映像で水城と大宰府を紹介し、展望台から水城跡を見渡せます。史跡の立ち入りできない所には入らないようにしましょう。休館日は公式の案内で確かめてください。";
const MIZUKI_MEMO_NEW =
  "2日目は太宰府へ。天神駅から西鉄天神大牟田線で下大利駅へ向かい、歩いて約25分の水城跡から始めます。663年の白村江の戦いのあと、北部九州を守るために築かれた土塁の跡で、長さ約1.2km、高さ約10m、博多湾側には幅約60mの外濠があったとされ、国の特別史跡に指定されています。東門の北側にある水城館は、平成29年（2017年）に大宰府展示館の分館として開かれた施設で、パネルや映像で水城と大宰府を紹介し、展望台から水城跡を見渡せます。史跡の立ち入りできない所には入らないようにしましょう。休館日は公式の案内で確かめましょう。";

const SANDO_MEMO_OLD =
  "戒壇院から東へ歩いて約20分。天満宮の表参道には土産物店や飲食店が軒を連ね、名物の梅ヶ枝餅が太宰府ならではの味として親しまれています。由来には諸説ありますが、太宰府へ移された道真公を気の毒に思った近所の老婆が、好物だった餅を梅の枝に刺して差し入れたという言い伝えがよく知られています。ここで昼食にしましょう。";
const SANDO_MEMO_NEW =
  "戒壇院から東へ歩いて約23分。天満宮の表参道には土産物店や飲食店が軒を連ね、名物の梅ヶ枝餅が太宰府ならではの味として親しまれています。由来には諸説ありますが、太宰府へ移された道真公を気の毒に思った近所の老婆が、好物だった餅を梅の枝に刺して差し入れたという言い伝えがよく知られています。ここで昼食にしましょう。";

const KOMYOZENJI_MEMO =
  "参道から歩いてすぐ。文永10年（1273年）に鉄牛円心が開いた禅寺で、苔の美しさから「苔寺」とも呼ばれます。前庭の「仏光石庭」は15の石で「光」の字をかたどり、裏庭の「一滴海庭」は苔を陸、白砂を海に見立てた枯山水で、昭和を代表する作庭家・重森三玲の手によるものです。平成26年（2014年）に福岡県の名勝に指定されました。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const TENMANGU_MEMO =
  "光明禅寺から歩いてすぐ。延喜19年（919年）、学問の神様として知られる菅原道真公をまつるために創建された、全国の天満宮の総本宮です。今の本殿は、天正19年（1591年）に小早川隆景が再建したもので、国の重要文化財に指定されています。道真公を慕って一夜のうちに京の都から飛んできたと伝わる「飛梅」も見どころです。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const KYUHAKU_MEMO =
  "天満宮から「虹のトンネル」と呼ばれる連絡通路を通って、歩いて約10分。平成17年（2005年）に開館した、東京・京都・奈良に続く日本で4番目の国立博物館で、「日本文化の形成をアジア史的観点から捉える」という基本理念のもと、旧石器時代から近世までの日本の歴史や文化を、アジアとの交流の中で紹介しています。ガラス張りの建物は、建築家・菊竹清訓の設計です。休館日は公式の案内で確かめましょう。帰りは西鉄太宰府駅から電車で福岡市内の宿へ戻ります。";

const RETRO_DISTRICT_MEMO =
  "税関の前から広がる門司港レトロ地区へ。明治から大正、昭和のはじめにかけて国際貿易港として栄えた門司港の面影を伝える、洋館やレンガ造りの建物が並ぶ一帯です。名物の焼きカレーを出す店も多いので、ここで昼食にしましょう。";

const RAILWAY_MUSEUM_MEMO_OLD =
  "レトロ地区から南へ歩いて約10分。明治24年（1891年）に建てられた、九州鉄道の本社だった赤れんがの建物を生かした鉄道の記念館で、九州の鉄道の歴史を紹介しています。屋外には、実際に九州を走った車両が並び、間近で見学できます。ミニ鉄道公園では、小さな列車の運転を体験することもできます。休館日は公式の案内で確かめましょう。";
const RAILWAY_MUSEUM_MEMO_NEW =
  "レトロ地区から南へ歩いて約10分。明治24年（1891年）に建てられた、九州鉄道の本社だった赤れんがの建物を生かした鉄道の記念館で、九州の鉄道の歴史を紹介しています。屋外には、実際に九州を走った車両が並び、間近で見学できます。ミニ鉄道公園では、小さな列車の運転を体験することもできます。休館日は公式の案内で確かめましょう。";

const PEDESTRIAN_ENTRANCE_MEMO_OLD =
  "神社から歩いて約10分、関門トンネル人道の門司側の入口へ。全長約780mの海底のトンネルで、歩いて約15分で本州の下関側へ渡れます。トンネルの中ほどには、福岡県と山口県の県境があります。帰りは、入口の近くからバスで約10分の門司港駅へ戻り、JRで。3日間の福岡の旅はここまでです。";
const PEDESTRIAN_ENTRANCE_MEMO_NEW =
  "九州鉄道記念館から歩いて約33分、関門トンネル人道の門司側の入口へ。全長約780mの海底のトンネルで、歩いて約15分で本州の下関側へ渡れます。トンネルの中ほどには、福岡県と山口県の県境があります。帰りは、入口の近くからバスで約10分の門司港駅へ戻り、JRで。3日間の福岡の旅はここまでです。";

async function main() {
  const spots = await prisma.spot.findMany({
    where: {
      id: {
        in: [
          HAKOZAKI,
          KAWABATA,
          FUKUOKAJO,
          OHORI,
          MIZUKI,
          SANDO,
          KOMYOZENJI,
          TENMANGU,
          KYUHAKU,
          RETRO_DISTRICT,
          RAILWAY_MUSEUM,
          PEDESTRIAN_ENTRANCE,
        ],
      },
    },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));
  if (byId.get(HAKOZAKI)!.memo !== HAKOZAKI_MEMO_OLD) throw new Error("筥崎宮: memo現在値が期待と不一致");
  if (byId.get(KAWABATA)!.memo !== KAWABATA_MEMO_OLD) throw new Error("川端通商店街: memo現在値が期待と不一致");
  if (byId.get(FUKUOKAJO)!.memo !== FUKUOKAJO_MEMO_OLD) throw new Error("福岡城跡: memo現在値が期待と不一致");
  if (byId.get(OHORI)!.memo !== OHORI_MEMO_OLD) throw new Error("大濠公園: memo現在値が期待と不一致");
  if (byId.get(MIZUKI)!.memo !== MIZUKI_MEMO_OLD) throw new Error("水城跡: memo現在値が期待と不一致");
  if (byId.get(SANDO)!.memo !== SANDO_MEMO_OLD) throw new Error("太宰府天満宮参道: memo現在値が期待と不一致");
  if (byId.get(KOMYOZENJI)!.memo !== KOMYOZENJI_MEMO) throw new Error("光明禅寺: memo現在値が期待と不一致");
  if (byId.get(TENMANGU)!.memo !== TENMANGU_MEMO) throw new Error("太宰府天満宮: memo現在値が期待と不一致");
  if (byId.get(KYUHAKU)!.memo !== KYUHAKU_MEMO) throw new Error("九州国立博物館: memo現在値が期待と不一致");
  if (byId.get(RETRO_DISTRICT)!.memo !== RETRO_DISTRICT_MEMO) throw new Error("門司港レトロ地区: memo現在値が期待と不一致");
  if (byId.get(RAILWAY_MUSEUM)!.memo !== RAILWAY_MUSEUM_MEMO_OLD) throw new Error("九州鉄道記念館: memo現在値が期待と不一致");
  if (byId.get(PEDESTRIAN_ENTRANCE)!.memo !== PEDESTRIAN_ENTRANCE_MEMO_OLD) throw new Error("関門海峡人道入口: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("[初日] 博多町家ふるさと館を削除。新しい並び（川端通商店街の座標直しで+1分）:");
  console.log("筥崎宮10:45(stay40)→[train25]→櫛田神社11:50(stay40)→[walk3]→川端通商店街12:33(stay30,昼食)→[train25]→福岡城跡13:28(stay40)→[walk20]→大濠公園14:28(stay45)→[bus20]→福岡市博物館15:33(stay40)→[walk5]→福岡タワー16:18(stay40、16:58出発)");
  console.log("入口: 博多駅から地下鉄（中洲川端駅で箱崎線に乗り換え）で約12分の箱崎宮前駅に10:45ごろ着→歩いてすぐ→筥崎宮10:45着");
  console.log("  出典: 福岡市地下鉄 箱崎線⇄空港線（中洲川端乗換）の実例時刻 https://ekitan.com/transit/fare/sf-7938/st-7930（箱崎宮前10:30発→中洲川端10:36着10:39発(乗換)→博多10:42着、合計12分）。方向は逆だが各駅停車・同区間のため往復とも同じ所要");
  console.log("[福岡城跡] 33.5883,130.3806(何もない道の点) → 33.5843676,130.3830774（OSM node4968414505「大天守台跡」、約494m）");
  console.log("[福岡城跡→大濠公園] walk5→walk20（新座標でのroutd-foot実測1,466m/19.5分）。「城跡の西どなり」の書き出しを歩いて約20分の表現に直す");
  console.log("[櫛田神社→川端通商店街] walk2→walk3（川端通商店街の座標を33.592553,130.410226=OSM node「川端商店街」に直した上でroutd-foot実測206m/2.78分）");
  console.log("筥崎宮・櫛田神社・福岡城跡・大濠公園・福岡市博物館・福岡タワーの座標は変更なし（OSMの実在の点と完全一致・ほぼ完全一致）");
  console.log("川端通商店街65→30分・福岡城跡50→40分・福岡市博物館50→40分・福岡タワー50→40分に短縮（決まりA、短縮のみ。筥崎宮・櫛田神社・大濠公園は変更なし）");
  console.log("\n[中の日(Day2)] 時刻・並びは直さない。座標の精密確認で3か所を直す（決まりA対象外。他5か所は変更なし）:");
  console.log("[太宰府天満宮参道] 33.5206,130.5333 → 33.519539,130.533487（OSM way「太宰府天満宮参道」のNominatim中心に一致）。戒壇院→参道 walk20→23（routed-foot実測1,747m/23.37分）に伴い書き出しも「歩いて約23分」に直す。visitTime12:25→12:28");
  console.log("[光明禅寺] 33.518291,130.533759 → 33.518187,130.533933（OSM way「光明禅寺」(landuse=religious,id1152781544)のNominatim中心に完全一致）。参道→光明禅寺 walk5→3（routed-foot実測224m/2.99分）。visitTime13:30→13:31。文中に距離の数字がないため本文は変更なし");
  console.log("[太宰府天満宮] 座標変更なし。光明禅寺→天満宮 walk5→6（routed-foot実測473m/6.3分）。visitTime14:15→14:17。文中に距離の数字がないため本文は変更なし");
  console.log("[九州国立博物館] 座標・leg変更なし(walk10のまま)。上流の繰り下がりでvisitTime15:25→15:27");
  console.log("[水城跡] 「確かめてください」→「確かめましょう」");
  console.log("\n[最終日(Day3)] 2泊以上の最終日のため14:30〜15:00の決まりが当たる。関門海峡ミュージアム・和布刈神社を削除。新しい並び（座標の精密確認で2か所を追加で直したため、以前の確認版から数分ずれています）:");
  console.log("門司港駅09:30(stay25)→[walk5]→三井倶楽部10:00(stay40)→[walk5]→大阪商船10:45(stay25)→[walk5]→税関11:15(stay30)→[walk3]→レトロ地区11:48(stay60,昼食)→[walk10]→記念館12:58(stay50)→[walk33]→人道入口14:21(stay35、14:56出発)");
  console.log("[門司港レトロ地区] 33.9481,130.9639 → 33.9480717,130.9641736（OSM way823695331「大連友好記念館」tourism=attraction、レトロ地区内の建物のNominatim値に完全一致。地区自体に単一のOSM点はないため名前のある地物を使用、法務の指摘2026-10-30 10:43）。税関→レトロ地区 walk5→3（routed-foot実測224m/2.99分）。visitTime11:50→11:48。文中に距離の数字がないため本文は変更なし");
  console.log("[九州鉄道記念館] 座標変更なし。レトロ地区→記念館 walk10（routed-foot実測781m/10.45分、四捨五入で変更なし）。上流の繰り下がりでvisitTime13:00→12:58");
  console.log("[関門海峡人道入口] 33.958204,130.968201 → 33.9612865,130.9630471（OSM way90115760「関門トンネル人道入口」building、北九州市門司区=門司側であることを確認。法務の指摘2026-10-30 10:43で名前のない点から変更）。記念館→人道入口 walk32→33（新座標でのrouted-foot実測2,495m/33.3分、変更後も33分のまま）。帰りのバス約10分は、新しい点から約250mの「和布刈神社前」バス停を経由して成り立つことを確認（直線距離1.8km・自動車道のり2.7km/約5分+乗降分）");
  console.log("記念館60→50分に短縮（決まりA、短縮のみ。他6か所は変更なし）");
  console.log("人道入口の末尾の帰りの一文はそのまま使える");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1,
      [
        { id: HAKOZAKI, data: { visitTime: t(10, 45), memo: HAKOZAKI_MEMO_NEW } },
        { id: KUSHIDA, data: { visitTime: t(11, 50) } },
        {
          id: KAWABATA,
          data: {
            visitTime: t(12, 33),
            stayDurationMin: 30,
            memo: KAWABATA_MEMO_NEW,
            lat: 33.5925534,
            lng: 130.4102258,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
          },
        },
        {
          id: FUKUOKAJO,
          data: {
            visitTime: t(13, 28),
            stayDurationMin: 40,
            memo: FUKUOKAJO_MEMO_NEW,
            lat: 33.5843676,
            lng: 130.3830774,
          },
        },
        {
          id: OHORI,
          data: {
            visitTime: t(14, 28),
            memo: OHORI_MEMO_NEW,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
          },
        },
        { id: FUKUOKA_MUSEUM, data: { visitTime: t(15, 33), stayDurationMin: 40 } },
        { id: FUKUOKA_TOWER, data: { visitTime: t(16, 18), stayDurationMin: 40 } },
      ],
      { remove: [FURUSATOKAN], tx }
    );

    await tx.spot.update({ where: { id: MIZUKI }, data: { memo: MIZUKI_MEMO_NEW } });
    await tx.spot.update({
      where: { id: SANDO },
      data: {
        visitTime: t(12, 28),
        memo: SANDO_MEMO_NEW,
        lat: 33.5195389,
        lng: 130.533487,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 23 }] },
      },
    });
    await tx.spot.update({
      where: { id: KOMYOZENJI },
      data: {
        visitTime: t(13, 31),
        lat: 33.5181872,
        lng: 130.5339331,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    });
    await tx.spot.update({
      where: { id: TENMANGU },
      data: {
        visitTime: t(14, 17),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    });
    await tx.spot.update({ where: { id: KYUHAKU }, data: { visitTime: t(15, 27) } });

    await setDaySpotOrder(
      DAY3,
      [
        { id: MOJIKO_STA, data: {} },
        { id: MITSUI_CLUB, data: {} },
        { id: OSAKA_SHOSEN, data: {} },
        { id: ZEIKAN, data: {} },
        {
          id: RETRO_DISTRICT,
          data: {
            visitTime: t(11, 48),
            lat: 33.9480717,
            lng: 130.9641736,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
          },
        },
        { id: RAILWAY_MUSEUM, data: { visitTime: t(12, 58), stayDurationMin: 50, memo: RAILWAY_MUSEUM_MEMO_NEW } },
        {
          id: PEDESTRIAN_ENTRANCE,
          data: {
            visitTime: t(14, 21),
            memo: PEDESTRIAN_ENTRANCE_MEMO_NEW,
            lat: 33.9612865,
            lng: 130.9630471,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 33 }] },
          },
        },
      ],
      { remove: [KANMON_MUSEUM, MEKARI_JINJA], tx }
    );
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

/**
 * リリース向けデータ作成・パイロット版
 *
 * 対象エリア: 京都市内（清水・祇園・河原町）/ 嵐山・嵯峨野 / 那覇市内 の3エリア。
 * 各エリアに、日帰り・1泊2日・2泊3日・3泊4日・4泊5日の5パターン（=5件）のしおりを作成する。
 * 各日5か所以上のスポットを巡り、スポット間の移動手段・スポット写真・訪問予定時刻など
 * 登録可能な項目をすべて埋める。
 *
 * 実行方法: npx tsx prisma/seed-pilot-launch.ts
 *
 * ⚠️ 住所・緯度経度・公式サイトはAI(Claude)の知識をもとにした概算値。本番投入前に
 * 地図サービス等との突合による裏取りを推奨する（requirements.md 4.4節と同じ注意）。
 * 画像はWikipedia(ja)のページ概要APIから取得したサムネイルをVercel Blobに再アップロードして使用。
 */

import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";
import existingPhotoCache from "./photo-cache.json";

type SpotSeed = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  memo: string;
  websiteUrl: string;
  wikiTitle: string;
};

const OFFICIAL_PLANNER_ID = "23329b17-06c7-4e3a-a026-c9f665f7b25d";
const ADMIN_ID = "9d49b865-1e5c-4e79-b602-c9909feba46a";

const TAG_BY_AREA: Record<string, string[]> = {
  kyoto_city: ["定番観光", "紅葉"],
  arashiyama: ["絶景", "定番観光"],
  naha: ["海・リゾート", "家族旅行"],
};
const PURPOSE_BY_AREA: Record<string, string[]> = {
  kyoto_city: ["お寺", "神社", "城・史跡"],
  arashiyama: ["自然", "絶景・フォトスポット", "パワースポット"],
  naha: ["ビーチ・海水浴", "城・史跡", "美術館・博物館"],
};

const AREAS: {
  key: string;
  areaId: string;
  prefectureId: string;
  areaName: string;
  prefectureName: string;
  spots: SpotSeed[];
  titles: Record<number, string>;
}[] = [
  {
    key: "kyoto_city",
    areaId: "5b461dee-a714-4707-ad5f-8ef7af003ef1",
    prefectureId: "30a8b9ca-07aa-4565-aa0e-64d7e07ca372",
    areaName: "京都市内（清水・祇園・河原町）",
    prefectureName: "京都府",
    titles: {
      0: "清水寺から祇園へ、着物で歩く京都さんぽプラン",
      1: "初めての京都！清水寺・祇園・錦市場を巡る鉄板プラン",
      2: "朝から夜まで満喫、京都の「和」を味わい尽くすプラン",
      3: "歴史と食を巡る、大人のための京都名所めぐり",
      4: "京都をとことん歩く。路地裏まで味わうじっくり旅",
    },
    spots: [
      { name: "清水寺", address: "京都市東山区清水1丁目294", lat: 34.9948, lng: 135.785, memo: "京都を代表する古刹。清水の舞台からの絶景は必見です。", websiteUrl: "https://www.kiyomizudera.or.jp/", wikiTitle: "清水寺" },
      { name: "八坂神社", address: "京都市東山区祇園町北側625", lat: 35.0037, lng: 135.7786, memo: "祇園のシンボル。朱塗りの楼門が美しい京都屈指の古社。", websiteUrl: "https://www.yasaka-jinja.or.jp/", wikiTitle: "八坂神社" },
      { name: "祇園花見小路", address: "京都市東山区祇園町南側", lat: 35.0032, lng: 135.7756, memo: "町家が並ぶ風情ある通り。運が良ければ舞妓さんにも。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "花見小路通" },
      { name: "高台寺", address: "京都市東山区高台寺下河原町526", lat: 35.0007, lng: 135.7807, memo: "ねねゆかりの禅寺。庭園と紅葉のライトアップで有名。", websiteUrl: "https://www.kodaiji.com/", wikiTitle: "高台寺" },
      { name: "二年坂・産寧坂", address: "京都市東山区清水2丁目", lat: 34.9977, lng: 135.7809, memo: "石畳の坂道に土産物店が並ぶ、京都散策の定番コース。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "産寧坂" },
      { name: "錦市場", address: "京都市中京区錦小路通", lat: 35.005, lng: 135.7649, memo: "「京の台所」と呼ばれる食べ歩き天国のアーケード商店街。", websiteUrl: "https://www.kyoto-nishiki.or.jp/", wikiTitle: "錦市場" },
      { name: "京都御所", address: "京都市上京区京都御苑3", lat: 35.0254, lng: 135.7622, memo: "かつての天皇の住まい。広大な御苑と美しい建築が見どころ。", websiteUrl: "https://sisetu.kunaicho.go.jp/guide/kyoto.html", wikiTitle: "京都御所" },
      { name: "鴨川", address: "京都市中京区", lat: 35.0068, lng: 135.7707, memo: "京都市民の憩いの川。等間隔に座るカップルでも有名。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "鴨川_(淀川水系)" },
      { name: "京都タワー", address: "京都市下京区烏丸通七条下る東塩小路町721-1", lat: 34.9876, lng: 135.7588, memo: "京都駅前にそびえるランドマーク。展望室からは市内を一望。", websiteUrl: "https://www.kyoto-tower.jp/", wikiTitle: "京都タワー" },
      { name: "建仁寺", address: "京都市東山区大和大路通四条下る小松町", lat: 35.0016, lng: 135.7726, memo: "京都最古の禅寺。俵屋宗達の「風神雷神図」でも有名。", websiteUrl: "https://www.kenninji.jp/", wikiTitle: "建仁寺" },
      { name: "平安神宮", address: "京都市左京区岡崎西天王町97", lat: 35.0161, lng: 135.7822, memo: "朱と緑が鮮やかな大鳥居が目印。広大な神苑の庭園も見どころ。", websiteUrl: "https://www.heianjingu.or.jp/", wikiTitle: "平安神宮" },
      { name: "先斗町", address: "京都市中京区", lat: 35.0059, lng: 135.7695, memo: "鴨川沿いに広がる情緒あふれる飲食店街。夜歩きにおすすめ。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "先斗町" },
      { name: "京都国立博物館", address: "京都市東山区茶屋町527", lat: 34.9906, lng: 135.7717, memo: "日本を代表する文化財の宝庫。レンガ造りの明治古都館も必見。", websiteUrl: "https://www.kyohaku.go.jp/", wikiTitle: "京都国立博物館" },
      { name: "六波羅蜜寺", address: "京都市東山区五条通大和大路上ル東", lat: 34.9975, lng: 135.7726, memo: "空也上人立像で知られる古刹。街なかにひっそり佇む名刹。", websiteUrl: "https://rokuhara.or.jp/", wikiTitle: "六波羅蜜寺" },
      { name: "河原町商店街", address: "京都市中京区河原町通", lat: 35.0063, lng: 135.7688, memo: "京都随一の繁華街。ショッピングや食事に便利な中心地。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "河原町通" },
      { name: "三十三間堂", address: "京都市東山区三十三間堂廻町657", lat: 34.9884, lng: 135.7717, memo: "千体の観音立像が並ぶ、圧巻のお堂。国宝建築としても有名。", websiteUrl: "https://sanjusangendo.jp/", wikiTitle: "三十三間堂" },
      { name: "法観寺（八坂の塔）", address: "京都市東山区八坂上町388", lat: 34.9989, lng: 135.7795, memo: "東山のシンボルとして親しまれる五重塔。塔からの眺めも良い。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "法観寺" },
      { name: "円山公園", address: "京都市東山区円山町", lat: 35.0028, lng: 135.7803, memo: "しだれ桜で有名な京都最古の公園。八坂神社に隣接。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "円山公園" },
      { name: "新京極商店街", address: "京都市中京区新京極通", lat: 35.0056, lng: 135.7679, memo: "京都の若者に人気のアーケード商店街。お土産探しにも便利。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "新京極通" },
      { name: "六角堂", address: "京都市中京区堂之前町248", lat: 35.0075, lng: 135.7607, memo: "生け花発祥の地として知られる古刹。街なかの穴場スポット。", websiteUrl: "https://www.ikenobo.jp/rokkakudo/", wikiTitle: "六角堂_(京都市)" },
      { name: "京都文化博物館", address: "京都市中京区三条高倉", lat: 35.0089, lng: 135.7607, memo: "京都の歴史と文化を紹介するミュージアム。レンガ造りの別館も見どころ。", websiteUrl: "https://www.bunpaku.or.jp/", wikiTitle: "京都文化博物館" },
      { name: "八坂庚申堂", address: "京都市東山区金園町390", lat: 34.9997, lng: 135.7804, memo: "カラフルなくくり猿が並ぶ、写真映えで人気のお堂。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "八坂庚申堂" },
    ],
  },
  {
    key: "arashiyama",
    areaId: "9a21f1db-dcac-49c6-ac18-9b4ea57f3b91",
    prefectureId: "30a8b9ca-07aa-4565-aa0e-64d7e07ca372",
    areaName: "嵐山・嵯峨野",
    prefectureName: "京都府",
    titles: {
      0: "竹林と渡月橋、絵になる嵐山を巡る弾丸プラン",
      1: "嵯峨野トロッコと竹林の小径、静寂の嵐山旅",
      2: "お寺めぐりと川下り、嵐山・嵯峨野をゆったり巡る旅",
      3: "嵐山の四季を感じる、庭園と古寺めぐり",
      4: "嵯峨野の隠れた名所まで。じっくり味わう嵐山旅",
    },
    spots: [
      { name: "渡月橋", address: "京都市西京区嵐山中尾下町", lat: 35.0094, lng: 135.6775, memo: "嵐山のシンボル。桂川に架かる橋からの眺めは絶景です。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "渡月橋" },
      { name: "竹林の道", address: "京都市右京区嵯峨小倉山田淵山町", lat: 35.0164, lng: 135.6693, memo: "青々とした竹林に包まれる、幻想的な散策路。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "嵯峨野の竹林" },
      { name: "天龍寺", address: "京都市右京区嵯峨天龍寺芒ノ馬場町68", lat: 35.0154, lng: 135.6742, memo: "世界遺産の禅寺。曹源池庭園は借景の美しさで有名。", websiteUrl: "https://www.tenryuji.com/", wikiTitle: "天龍寺" },
      { name: "野宮神社", address: "京都市右京区嵯峨野宮町1", lat: 35.0169, lng: 135.6716, memo: "黒木鳥居が珍しい縁結びの神社。竹林の入口に佇む。", websiteUrl: "https://www.nonomiya.com/", wikiTitle: "野宮神社" },
      { name: "嵐山モンキーパークいわたやま", address: "京都市西京区嵐山元録山町8", lat: 35.0074, lng: 135.6796, memo: "山頂から嵐山の絶景と野生の猿にも出会える人気スポット。", websiteUrl: "https://www.monkeypark.jp/", wikiTitle: "嵐山モンキーパークいわたやま" },
      { name: "大河内山荘庭園", address: "京都市右京区嵯峨小倉山田淵山町8", lat: 35.0181, lng: 135.6674, memo: "俳優・大河内傳次郎が築いた回遊式庭園。眺望が素晴らしい。", websiteUrl: "https://www.okochi-sanso.jp/", wikiTitle: "大河内山荘" },
      { name: "トロッコ嵐山駅", address: "京都市右京区嵯峨天龍寺車道町", lat: 35.0169, lng: 135.6763, memo: "保津峡を望むレトロな観光列車の乗り場。車窓からの景色は圧巻。", websiteUrl: "https://www.sagano-kanko.co.jp/", wikiTitle: "嵯峨野観光鉄道" },
      { name: "常寂光寺", address: "京都市右京区嵯峨小倉山小倉町3", lat: 35.0177, lng: 135.665, memo: "小倉山の中腹に建つ紅葉の名所。多宝塔からの眺めも見事。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "常寂光寺" },
      { name: "祇王寺", address: "京都市右京区嵯峨鳥居本小坂町32", lat: 35.0223, lng: 135.6642, memo: "苔むした庭が美しい、平家物語ゆかりのひっそりとした尼寺。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "祇王寺" },
      { name: "二尊院", address: "京都市右京区嵯峨二尊院門前長神町27", lat: 35.0198, lng: 135.6659, memo: "紅葉の馬場と呼ばれる参道が美しい、小倉山麓の古刹。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "二尊院" },
      { name: "化野念仏寺", address: "京都市右京区嵯峨鳥居本化野町17", lat: 35.0257, lng: 135.6614, memo: "数千体の石仏が並ぶ、静かで神秘的な雰囲気のお寺。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "化野念仏寺" },
      { name: "保津川下り乗船場", address: "亀岡市保津町下中島2", lat: 35.0193, lng: 135.5972, memo: "亀岡から嵐山まで、渓谷を下る船旅のスタート地点。", websiteUrl: "https://www.hozugawakudari.jp/", wikiTitle: "保津川下り" },
      { name: "嵐山公園", address: "京都市西京区嵐山中尾下町", lat: 35.0107, lng: 135.6789, memo: "渡月橋のたもとに広がる公園。桜や紅葉の名所でもある。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "嵐山公園" },
      { name: "車折神社", address: "京都市右京区嵯峨朝日町23", lat: 35.0157, lng: 135.6905, memo: "芸能人の朱塗り玉垣がずらりと並ぶ、芸能・芸術の神社。", websiteUrl: "https://www.kurumazakijinja.or.jp/", wikiTitle: "車折神社" },
      { name: "清凉寺（嵯峨釈迦堂）", address: "京都市右京区嵯峨釈迦堂藤ノ木町46", lat: 35.0182, lng: 135.6768, memo: "生身の釈迦像を本尊とする古刹。境内は静かで落ち着いた雰囲気。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "清凉寺" },
      { name: "落柿舎", address: "京都市右京区嵯峨小倉山緋明神町20", lat: 35.0179, lng: 135.6699, memo: "松尾芭蕉の弟子・向井去来の草庵跡。嵯峨野らしい鄙びた風情。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "落柿舎" },
      { name: "宝厳院", address: "京都市右京区嵯峨天龍寺芒ノ馬場町36", lat: 35.0146, lng: 135.6728, memo: "天龍寺の塔頭。「獅子吼の庭」と呼ばれる回遊式庭園が見事。", websiteUrl: "https://hogonin.jp/", wikiTitle: "宝厳院" },
      { name: "御髪神社", address: "京都市右京区嵯峨小倉山田淵山町10-2", lat: 35.0176, lng: 135.6683, memo: "日本で唯一、髪の毛を祀る珍しい神社。理美容関係者の参拝も多い。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "御髪神社" },
      { name: "嵐電嵐山駅", address: "京都市右京区嵯峨天龍寺造路町20-2", lat: 35.0129, lng: 135.6773, memo: "足湯や着物レンタルもある、レトロな路面電車のターミナル駅。", websiteUrl: "https://www.keifuku.co.jp/", wikiTitle: "嵐山駅_(京都府)" },
      { name: "法輪寺（嵯峨）", address: "京都市西京区嵐山虚空蔵山町68", lat: 35.0079, lng: 135.6805, memo: "渡月橋のたもとから望める古刹。十三まいりの寺としても有名。", websiteUrl: "https://ja.kyoto.travel/", wikiTitle: "法輪寺_(京都市西京区)" },
    ],
  },
  {
    key: "naha",
    areaId: "1fffb36c-4bb0-4c89-97c9-eff05f361a56",
    prefectureId: "3fd7fb9f-beed-4bb6-b831-eb514c81c664",
    areaName: "那覇市内",
    prefectureName: "沖縄県",
    titles: {
      0: "首里城と国際通り、沖縄の魅力ぎゅっと詰め込みプラン",
      1: "琉球王国の歴史を感じる、那覇の「今」を巡る旅",
      2: "グルメも歴史も。那覇の街をまるごと楽しむ旅",
      3: "市場めぐりから絶景ビーチまで、那覇満喫の旅",
      4: "琉球王国の歴史を辿る、那覇じっくり探訪の旅",
    },
    spots: [
      { name: "首里城公園", address: "那覇市首里金城町1-2", lat: 26.217, lng: 127.7192, memo: "琉球王国の栄華を伝える、朱色の世界遺産。", websiteUrl: "https://oki-park.jp/shurijo/", wikiTitle: "首里城" },
      { name: "国際通り", address: "那覇市牧志", lat: 26.2158, lng: 127.6893, memo: "那覇随一の繁華街。お土産店や飲食店が軒を連ねる。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "国際通り" },
      { name: "波の上ビーチ", address: "那覇市若狭1-25", lat: 26.2225, lng: 127.6767, memo: "那覇市街地から徒歩圏内の貴重なビーチ。夕日も美しい。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "波の上ビーチ" },
      { name: "壺屋やちむん通り", address: "那覇市壺屋1丁目", lat: 26.2129, lng: 127.6841, memo: "琉球焼き物の窯元が並ぶ、レトロな石畳の通り。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "壺屋焼" },
      { name: "第一牧志公設市場", address: "那覇市松尾2-10-1", lat: 26.2144, lng: 127.6873, memo: "「那覇の台所」。カラフルな island 魚や食材が並ぶ市場。", websiteUrl: "https://makishi-public-market.jp/", wikiTitle: "牧志公設市場" },
      { name: "波上宮", address: "那覇市若狭1-25-11", lat: 26.2226, lng: 127.6763, memo: "崖の上に鎮座する沖縄総鎮守。海を望む絶好のロケーション。", websiteUrl: "https://naminouegu.jp/", wikiTitle: "波上宮" },
      { name: "沖縄県立博物館・美術館", address: "那覇市おもろまち3-1-1", lat: 26.2211, lng: 127.6889, memo: "沖縄の自然・歴史・文化を学べる複合ミュージアム。", websiteUrl: "https://okimu.jp/", wikiTitle: "沖縄県立博物館・美術館" },
      { name: "福州園", address: "那覇市久米2-29-19", lat: 26.2153, lng: 127.6809, memo: "那覇市と中国福州市の友好を記念した本格的な中国式庭園。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "福州園" },
      { name: "奥武山公園", address: "那覇市奥武山町52", lat: 26.2058, lng: 127.6775, memo: "緑豊かな島全体が公園に。地元の憩いのスポット。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "奥武山公園" },
      { name: "泊いゆまち", address: "那覇市泊3-25-1", lat: 26.2249, lng: 127.6811, memo: "新鮮な沖縄の魚が並ぶ活気ある卸売市場。刺身の食べ比べも。", websiteUrl: "https://tomariiyumachi.com/", wikiTitle: "泊いゆまち" },
      { name: "識名園", address: "那覇市真地421-7", lat: 26.1975, lng: 127.6996, memo: "琉球王家の別邸だった世界遺産の庭園。静かな時間が流れる。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "識名園" },
      { name: "玉陵", address: "那覇市首里金城町1-3", lat: 26.2163, lng: 127.7169, memo: "歴代琉球国王が眠る世界遺産の陵墓。首里城のすぐそばに佇む。", websiteUrl: "https://oki-park.jp/tamaudun/", wikiTitle: "玉陵" },
      { name: "園比屋武御嶽石門", address: "那覇市首里真和志町1-7", lat: 26.2176, lng: 127.7183, memo: "琉球国王が旅の安全を祈願した拝所。首里城公園と並ぶ世界遺産。", websiteUrl: "https://oki-park.jp/shurijo/", wikiTitle: "園比屋武御嶽石門" },
      { name: "首里金城町石畳道", address: "那覇市首里金城町2丁目", lat: 26.2145, lng: 127.7188, memo: "琉球王国時代の石畳道が今も残る、風情ある坂道。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "金城町石畳道" },
      { name: "那覇市立壺屋焼物博物館", address: "那覇市壺屋1-9-32", lat: 26.2135, lng: 127.6835, memo: "やちむん（沖縄焼き物）の歴史と技法を紹介するミュージアム。", websiteUrl: "https://tsuboya-museum.naha.okinawa.jp/", wikiTitle: "那覇市立壺屋焼物博物館" },
      { name: "那覇市歴史博物館", address: "那覇市久茂地1-1-1", lat: 26.2144, lng: 127.6798, memo: "琉球王家ゆかりの品々を展示する、国際通り近くの博物館。", websiteUrl: "https://www.rekishi-archive.city.naha.okinawa.jp/", wikiTitle: "那覇市歴史博物館" },
      { name: "崇元寺石門", address: "那覇市泊1-9", lat: 26.2211, lng: 127.6845, memo: "琉球王家の菩提寺の正門跡。石造りの重厚な門が残る史跡。", websiteUrl: "https://www.naha-navi.or.jp/", wikiTitle: "崇元寺" },
    ],
  },
];

const TRANSIT_PATTERN: { mode: string; dur: number; line?: string }[] = [
  { mode: "walk", dur: 8 },
  { mode: "walk", dur: 12 },
  { mode: "bus", dur: 15, line: "路線バス" },
  { mode: "walk", dur: 6 },
];

// 文字列から決定論的な32bitシードを作る（同じ入力なら常に同じ乱数列になる）
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * しおり単位で決定論的にシャッフルしたスポット列を、5件ずつ日別に切り出す。
 * しおりごとに独立したシャッフル順を使うので、同一エリア内の別しおり・別日と
 * スポット構成が丸かぶりする確率を大幅に下げる。プールが尽きたら再シャッフルして
 * 補充するが、直前の並びと連続して同じスポットが来ないよう簡易的に調整する。
 */
function buildDayAssignments(pool: SpotSeed[], seedKey: string, dayCount: number, perDay: number): SpotSeed[][] {
  const rng = mulberry32(hashSeed(seedKey));
  const bucket: SpotSeed[] = [];

  function refill() {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    bucket.push(...shuffled);
  }

  const days: SpotSeed[][] = [];
  for (let d = 0; d < dayCount; d++) {
    while (bucket.length < perDay) refill();
    let picked = bucket.slice(0, perDay);
    let tries = 0;
    while (new Set(picked.map((s) => s.name)).size < picked.length && tries < pool.length) {
      bucket.push(bucket.shift()!);
      picked = bucket.slice(0, perDay);
      tries++;
    }
    bucket.splice(0, perDay);
    days.push(picked);
  }
  return days;
}

// ---- 画像取得・アップロード（スポット名でキャッシュ） ----
// 前回のパイロット実行ですでにアップロード済みの画像はそのまま再利用し、
// Wikipedia側への再リクエスト・再アップロードを避ける。
const imageCache = new Map<string, string | null>(Object.entries(existingPhotoCache as Record<string, string>));

async function fetchAndUploadImage(spot: SpotSeed): Promise<string | null> {
  if (imageCache.has(spot.name)) return imageCache.get(spot.name)!;
  try {
    const summaryRes = await fetch(
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(spot.wikiTitle)}`
    );
    if (!summaryRes.ok) throw new Error(`summary ${summaryRes.status}`);
    const summary = await summaryRes.json();
    const imgUrl: string | undefined = summary.originalimage?.source ?? summary.thumbnail?.source;
    if (!imgUrl) throw new Error("no image in summary");

    const imgRes = await fetch(imgUrl);
    if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const ext = imgUrl.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";

    const blob = await put(`pilot-launch/${encodeURIComponent(spot.name)}.${safeExt}`, buf, {
      access: "public",
      addRandomSuffix: true,
    });
    imageCache.set(spot.name, blob.url);
    console.log(`  画像取得OK: ${spot.name} -> ${blob.url}`);
    return blob.url;
  } catch (e) {
    console.warn(`  画像取得失敗: ${spot.name} (${(e as Error).message})`);
    imageCache.set(spot.name, null);
    return null;
  }
}

function addMinutes(base: Date, min: number): Date {
  return new Date(base.getTime() + min * 60000);
}

async function main() {
  for (const area of AREAS) {
    console.log(`\n=== ${area.prefectureName} ${area.areaName} ===`);

    // このエリアで使う全スポットの画像を先にまとめて取得（同名スポットは1回だけ）
    for (const spot of area.spots) {
      await fetchAndUploadImage(spot);
    }

    const tagNames = TAG_BY_AREA[area.key] ?? [];
    const purposeNames = PURPOSE_BY_AREA[area.key] ?? [];
    const tags = await prisma.tag.findMany({ where: { name: { in: tagNames } } });
    const purposeTags = await prisma.purposeTag.findMany({ where: { name: { in: purposeNames } } });

    for (const nights of [0, 1, 2, 3, 4]) {
      const dayCount = nights + 1;
      const title = area.titles[nights];

      const existing = await prisma.itinerary.findFirst({ where: { title, plannerAccountId: OFFICIAL_PLANNER_ID } });
      if (existing) {
        console.log(`既存のためスキップ: ${title}`);
        continue;
      }

      const dayAssignments = buildDayAssignments(area.spots, `${area.key}:${nights}`, dayCount, 5);
      const firstSpot = dayAssignments[0][0];
      const thumbnailUrl = imageCache.get(firstSpot.name) ?? null;

      const submittedAt = new Date(Date.now() - (10 - nights) * 24 * 60 * 60 * 1000);
      const reviewedAt = new Date(submittedAt.getTime() + 2 * 60 * 60 * 1000);

      const itinerary = await prisma.itinerary.create({
        data: {
          plannerAccountId: OFFICIAL_PLANNER_ID,
          title,
          description: `${firstSpot.name}をはじめ、${area.areaName}の人気スポットを1日5か所以上じっくり巡る、${
            nights === 0 ? "日帰り" : `${nights}泊${dayCount}日`
          }の欲張りモデルプランです。移動手段や滞在時間も具体的に記載しているので、そのまま旅の計画に使えます。`,
          nights,
          status: "published",
          thumbnailUrl,
          viewCount: BigInt(50 + Math.floor(Math.random() * 900)),
          likeCount: BigInt(0),
          submittedAt,
          reviewedAt,
          reviewedByAdminId: ADMIN_ID,
          areas: {
            create: [{ areaId: area.areaId }, { areaId: area.prefectureId }],
          },
          tags: { create: tags.map((t) => ({ tagId: t.id })) },
          purposeTags: { create: purposeTags.map((p) => ({ purposeTagId: p.id })) },
        },
      });

      for (let d = 1; d <= dayCount; d++) {
        const day = await prisma.day.create({ data: { itineraryId: itinerary.id, dayNumber: d } });
        const spots = dayAssignments[d - 1];

        let clock = new Date(2026, 0, 1, 9, 0, 0);
        for (let idx = 0; idx < spots.length; idx++) {
          const spot = spots[idx];
          const stayDurationMin = 40 + ((idx * 17 + (nights + 1) * 5) % 60); // 40〜99分でばらけさせる
          const visitTime = new Date(clock);

          const spotRow = await prisma.spot.create({
            data: {
              dayId: day.id,
              orderNo: idx + 1,
              name: spot.name,
              address: spot.address,
              lat: spot.lat,
              lng: spot.lng,
              visitTime,
              memo: spot.memo,
              stayDurationMin,
              websiteUrl: spot.websiteUrl,
              ...(idx === 0
                ? {}
                : (() => {
                    const t = TRANSIT_PATTERN[(idx - 1) % TRANSIT_PATTERN.length];
                    return { transitMode: t.mode, transitDurationMin: t.dur, transitLine: t.line ?? null };
                  })()),
            },
          });

          const imgUrl = imageCache.get(spot.name);
          if (imgUrl) {
            await prisma.photo.create({
              data: { spotId: spotRow.id, url: imgUrl, caption: spot.name },
            });
          }

          // 次のスポットへの移動時間ぶん時計を進める
          const nextTransit = TRANSIT_PATTERN[idx % TRANSIT_PATTERN.length];
          clock = addMinutes(visitTime, stayDurationMin + nextTransit.dur);
        }
      }

      console.log(`作成: ${title}`);
    }
  }

  console.log("\n完了しました。");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

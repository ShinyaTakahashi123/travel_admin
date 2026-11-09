/**
 * 83450b2a（屋台グルメと福岡タワー、博多の街を楽しむ日帰りプラン）の組み直し
 * （企画運営 11/04・11/05、法務 11/05）
 *
 * 【方針】
 * - 題・説明文・博多駅のメモから「屋台」「中洲屋台街」の記述を外す（中身にないため。企画運営・法務）。
 *   題は「屋台グルメと福岡タワー、博多の街を楽しむ日帰りプラン」→「能古島のフェリーと福岡タワー、
 *   博多港を巡る日帰りプラン」に変更（能古島・福岡タワーを中心のまま残し、ほかの本との重なりの
 *   数え方に影響しないようにした）
 * - のこのしまアイランドパーク・能古島展望台（ともに有料・私設）は行き先にも中心にもしない
 * - 博多駅（JR博多シティ・アミュプラザ）は行き先にしない。帰りの駅として最後の一文でのみ使う
 * - ベイサイドプレイス博多（商業施設の名前）→ 博多埠頭（場所の名前）に変更。店の紹介はしない
 * - 天神（地区の4けたの点）→ 水鏡天満宮（名前のある点）に変更し、行き先の中心にする
 * - 天神の滞在の中にあった昼食を、店でない別の行き先（バス停「福岡タワー南口」）に切り出す
 * - みずほPayPayドーム福岡は、試合のない日に40分いる中身（出典があり、会社の有料施設を
 *   すすめない内容）が見つからなかったため、企画運営の判断でシーサイドももち海浜公園（福岡市の
 *   公園、百道浜の浜）に差し替えた（4回目、下に詳しく書く）
 *
 * 【点】
 * - 能古島: 島側の渡船場 amenity=ferry_terminal node6570334685（33.6123614,130.3108133、
 *   6けた33.612361,130.310813）。法務が原文を確認済み
 * - 福岡タワー: man_made=tower way772670439（33.593274,130.351486）→ 今の値と一致、変更なし
 * - 昼食: highway=bus_stop「福岡タワー南口」node3661050391（33.5917146,130.3516538、
 *   6けた33.591715,130.351654）
 * - シーサイドももち海浜公園: 広い公園のため境界の中心は使わず、着く側の入口として、名前のある
 *   歩道橋「なぎさ橋」way107655288（highway=footway、bridge=yes、33.5955579,130.3570815、
 *   6けた33.595558,130.357082）を使用（7章の例外）
 * - 水鏡天満宮: amenity=place_of_worship way96531662（33.5924309,130.4019114、
 *   6けた33.592431,130.401911）
 * - 博多埠頭: amenity=ferry_terminal「ベイサイドプレイス博多埠頭」way168100626
 *   （33.6040735,130.3987470、6けた33.604074,130.398747）
 * - 博多駅（行き先にはしない）: building=train_station way72653571（33.5900413,130.4199026、
 *   6けた33.590041,130.419903）。帰りの一文でのみ使う
 *
 * 【区間・時刻（4回目の組み直し後。最終）】
 * - 能古島: 姪浜9:15発・能古9:25着の船（福岡市公式 https://www.city.fukuoka.lg.jp/kowan/kyakusen/
 *   hakata-port/hyo.html。能古～姪浜航路10分、姪浜発は毎時15分、能古発は毎時ちょうど）。
 *   鹿垣の案内板までの往復をOSRM routed-footで測り直すと1,531.8m・片道21分(1225.1秒)で、
 *   往復は約42分。見学を含めた滞在は60分(9:25→10:25)とし、11:00の便までの35分は待ち(other)、
 *   船は10分(other)。滞在を延ばして空き時間を埋めない
 * - 能古島→福岡タワー: 姪浜に戻ったあとのバス25分（もとの値のまま）
 * - 福岡タワー→昼食: 257.2m・206秒→4分(徒歩)
 * - 昼食→シーサイドももち海浜公園: 1,206.8m・965.8秒→17分(徒歩)
 * - シーサイドももち海浜公園→水鏡天満宮: 車5,148m・316.5秒の距離感からバス20分（もとのバス20分と
 *   同じ値を採用）
 * - 水鏡天満宮→博多埠頭: もとのバス15分のまま
 * - 博多埠頭→博多駅（帰りの一文のみ）: もとのバス20分のまま
 * - 滞在: 能古島60・福岡タワー50(変更なし)・昼食40・シーサイドももち海浜公園35・
 *   水鏡天満宮40・博多埠頭75（ベイサイドミュージアムとポートタワーの2つがあるため）
 * - 通しの時刻: 能古島9:25(60)→福岡タワー11:35(50)→昼食12:29(40)→
 *   シーサイドももち海浜公園13:26(35)→水鏡天満宮14:21(40)→博多埠頭15:16(75)→16:31発で終了
 *   （16:30〜17:00の中）
 *
 * 【事実の出典（公式のみ。確認2026-11-05）】
 * - 能古島の一般的な説明「博多湾にぽっかり浮かぶ、自然豊かな島」: 福岡市観光公式YOKANAVI
 *   https://yokanavi.com/spots/26801
 * - 鹿垣「江戸時代、能古島は福岡藩の鹿の猟場で最盛期には約600頭もの鹿がいました。鹿垣は鹿が
 *   田畑を荒らさないよう東西約2kmにわたって築かれた石垣で、現在も一部が残っています。」:
 *   YOKANAVI https://yokanavi.com/spots/64524 （法務の指摘で原文どおりに修正）
 * - 福岡タワー「234m・海浜タワーとして日本一・1989年よかトピアのモニュメント・8000枚のハーフ
 *   ミラー(ミラーセイルの愛称)・正三角柱・123mの最上階展望室」: 公式サイト
 *   https://www.fukuokatower.co.jp/ 、https://www.fukuokatower.co.jp/company/data.php
 * - 水鏡天満宮「菅原道真が祭られている」「天神様と呼ばれ、この一帯を天神と呼ぶように」: 福岡市
 *   中央区公式 https://www.city.fukuoka.lg.jp/chuoku/kikaku/charm-kankou/burarisanpo/tenjineki.html
 * - シーサイドももち海浜公園「福岡を代表するウォーターフロント」「背後のビル群と海浜の風景が
 *   美しい」「夏には海水浴も楽しめる」: 福岡市公式
 *   https://www.city.fukuoka.lg.jp/kowan/miryoku/fu-kei/seasidemomochi.html （更新2018年。
 *   遊泳期間の日程・波打ち際の注意の記載はないため、「遊泳できる期間は、公式サイトで確かめましょう」
 *   「波打ち際では、足元に気をつけましょう」を添えた）
 * - 博多ポートタワー「高さ100m、地上70mの展望室、360度のパノラマ」、博多港ベイサイドミュージアム
 *   「港の役割をパネル・模型で紹介」: 福岡市港湾局公式
 *   https://www.city.fukuoka.lg.jp/kowan/somu/hakata-port/port_museum.html
 *   （法務の指摘により「無料」「入館無料」「コンテナクレーンの操作体験」は書かない。クレーン体験は
 *   同ページで確認できなかった）
 *
 * 【2回目の小さな直し。企画運営11/05】
 * - ドーム「福岡ソフトバンクホークスの本拠地です」は会社名が入るため「プロ野球の球団の本拠地です」に直した
 * - ドームの書き出し「このあたりから」→「福岡タワー南口のあたりから」（どこからかを明記）
 *
 * 【3回目: 法務の指摘（11/05 14:27、本番の確認モードと原文の突き合わせ）への対応】
 * - ドーム「立ち寄って雰囲気を楽しんでみてください」: 「ください」で、ドームツアー・ミュージアムは
 *   会社が運営する有料のものなので、すすめる文ごと削除した（6章）
 * - 福岡タワーの結び「このあたりで昼食にしましょう」→「福岡タワー南口のあたりへ向かいましょう」
 *   （行き先を明記）
 * - 能古島の書き出しに「地下鉄空港線・姪浜駅から、バスで姪浜の渡船場に着きます。」を追加。
 *   姪浜駅から渡船場までの分数は、市営渡船の公式時刻表ページ
 *   https://www.city.fukuoka.lg.jp/kowan/kyakusen/hakata-port/hyo.html （確認2026-11-05、更新日
 *   2026年10月6日）にも、西鉄バス公式にも具体的な分数が見当たらなかったため、分数は書いていない
 *   （企画運営の判断で、分なしのこの書き方のままでよいことを確認済み）
 * - 水鏡天満宮: 中央区公式tenjineki.htmlに実際にあるのは「菅原道真が祭られている」「天神様と
 *   呼ばれたことから、この一帯を天神と呼ぶようになったといわれる」のみだったため、901年・四十川
 *   (薬院新川)・水面に映る姿・容見天神・1612年の黒田長政・忠之の文はすべて削除した
 * - 福岡タワー: 公式サイトで234m・海浜タワーとして日本一・1989年よかトピア・8000枚のハーフ
 *   ミラー・正三角柱・123mの最上階展望室を確認。「夕日の名所」は同サイトで確認できなかったため削除した
 * - ドーム: 球団公式サイト(softbankhawks.co.jp/stadium/)がメンテナンス中で確認できず、ほかの
 *   出典もWikipedia（公式ではない）しか見つからなかった（4回目でドーム自体を外したため、この項目は
 *   対応不要になった）
 *
 * 【4回目: 企画運営の判断（11/05）でドーム→シーサイドももち海浜公園に差し替え。法務の指摘2点も対応】
 * - ドームは「球団の本拠地」「開閉式の屋根」の2文しか確認できず、試合のない日の40分の中身がなかった
 *   ため、企画運営の判断で、福岡タワーのすぐそばの公共の公園（ほかのしおりと重ならないことをDBで
 *   確認済み）に差し替えた
 * - 博多埠頭「コンテナクレーンの操作を体験できるコーナーもあります」は、港湾局の公式ページに記載が
 *   見当たらなかったため削除した
 *
 * 【5回目の小さな直し。企画運営・法務11/05】
 * - 公園「人気のビーチです」の「人気」は使えない言葉のため「…海浜の風景が美しいビーチです。」に直した
 * - 「福岡タワーやみずほPayPayドーム福岡など、福岡を象徴する建物を望むこともできます。」は出典の
 *   ページになかった（あるのは「背後のビル群」のみ）ため削除した
 * - なぎさ橋→水鏡天満宮のバス20分: もとのドームからの値をそのまま使っていたため、道のりを
 *   測り直した。車の道のりは316.5秒で、もとの基準(ドーム→水鏡天満宮の419.8秒)より短いため、
 *   20分のままで短すぎない（企画運営・法務とも確認済み）
 * - なぎさ橋は7章の例外（広い公園の着く側の名前のある点）として、トラッキング資料のチェックリストに
 *   記録する
 *
 * 【6回目: 法務の指摘（11/05 14:41、写真）への対応】
 * - 天神の写真（File:Fukuoka_City_-_Watanabe-dori_Avenue_-_01.JPG、渡辺通りの写真。違う場所）と、
 *   ベイサイドプレイス博多の写真（File:Baysideplace001.jpg、商業施設の建物の写真）を削除した
 * - 能古島の写真・博多駅の写真（スポット削除で自動的に消える）は対象外
 * - 本番の表紙(thumbnailUrl)は能古島の写真で、上の2枚のどちらでもないことを確認済み（差し替え不要）
 *
 * 確認: 法務・企画運営
 */

import { prisma } from "../src/lib/prisma";

function t(h: number, m: number): Date {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ITINERARY_ID = "83450b2a-7a72-4c08-9ead-e69a14833b30";
const DAY_ID = "098e72e4-7df1-4229-a298-46248fedc051";

const NOKONOSHIMA_ID = "584872b3-06dc-4d83-9707-73e419a9fa8b";
const TOWER_ID = "3b6c4d0e-88c5-45c9-92d8-3cfdd8332efd";
const PARK_SPOT_ID = "7117332e-e84b-4288-9fe0-a9de4e67e081";
const TENJIN_ID = "57d6b2de-97aa-4938-b518-276d7e9b2da6"; // 水鏡天満宮に作り替え
const BAYSIDE_ID = "efa1f737-d2c0-4954-a688-a1b81564f8c9"; // 博多埠頭に作り替え
const STATION_ID = "a3d52bbf-d6a2-476a-89d1-d240dc121ff4"; // 削除（博多駅）

const NEW_TITLE = "能古島のフェリーと福岡タワー、博多港を巡る日帰りプラン";

const NEW_DESCRIPTION =
  "フェリーで渡る能古島から、福岡タワーやシーサイドももち海浜公園、水鏡天満宮、博多港のベイエリアまで。博多湾と街の両方を1日で楽しむプランです。";

const DELETE_SPOT_IDS = [STATION_ID];

// 行き先の名前・中身を変えたため、違う場所の写真になった2枚を消す
// （天神の通りの写真→水鏡天満宮、ベイサイドプレイス博多の商業施設の写真→博多埠頭。法務の指摘11/05）
const DELETE_PHOTO_IDS = [
  "52bd75cd-30b9-4b3a-a8b8-34a7eb7d7d94", // 天神（渡辺通りの写真）
  "81e3feb5-8196-405c-9eeb-a11030a2bbdf", // ベイサイドプレイス博多（商業施設の写真）
];

const UPDATE_SPOTS: {
  id: string;
  name?: string;
  visitTime: Date;
  stayDurationMin: number;
  memo: string;
  lat?: string;
  lng?: string;
  legs?: { transitMode: string; transitDurationMin: number }[];
}[] = [
  {
    id: NOKONOSHIMA_ID,
    visitTime: t(9, 25),
    stayDurationMin: 60,
    lat: "33.612361",
    lng: "130.310813",
    memo:
      "地下鉄空港線・姪浜駅から、バスで姪浜の渡船場に着きます。そこから船でおよそ10分です。（船の時刻は、公式の時刻表で確かめましょう。）博多湾にぽっかり浮かぶ、自然豊かな島、能古島に着きます。江戸時代、能古島は福岡藩の鹿の猟場で、最盛期には約600頭もの鹿がいました。渡船場から歩いておよそ21分のところには「鹿垣」の案内板があります。鹿垣は、鹿が田畑を荒らさないよう東西約2kmにわたって築かれた石垣で、現在も一部が残っています。案内板まで歩いて見学したら、渡船場へ戻りましょう。この後は、姪浜行きの船を待って乗船し、姪浜へ向かいましょう。",
  },
  {
    id: TOWER_ID,
    visitTime: t(11, 35),
    stayDurationMin: 50,
    memo:
      "能古島から姪浜渡船場へ戻り、バスでおよそ25分、福岡タワーに着きます。全長234mで、海浜タワーとしては日本一の高さといわれるタワーです。1989年(平成元年)、福岡市制100周年を記念するアジア太平洋博覧会(よかトピア)のモニュメントとして誕生しました。8000枚のハーフミラーが正三角柱のタワーを彩り、「ミラーセイル」の愛称で親しまれています。地上123mにある最上階の展望室からは、博多湾や福岡市街を一望できます。この後は、歩いておよそ4分、福岡タワー南口のあたりへ向かいましょう。",
    legs: [
      { transitMode: "other", transitDurationMin: 35 },
      { transitMode: "other", transitDurationMin: 10 },
      { transitMode: "bus", transitDurationMin: 25 },
    ],
  },
  {
    id: TENJIN_ID,
    name: "水鏡天満宮",
    visitTime: t(14, 21),
    stayDurationMin: 40,
    lat: "33.592431",
    lng: "130.401911",
    memo:
      "シーサイドももち海浜公園からバスでおよそ20分、水鏡天満宮に着きます。学問の神様として知られる菅原道真が祭られています。この神社が天神様と呼ばれたことから、このあたり一帯を天神と呼ぶようになったといわれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、バスでおよそ15分、博多埠頭へ向かいましょう。",
  },
  {
    id: BAYSIDE_ID,
    name: "博多埠頭",
    visitTime: t(15, 16),
    stayDurationMin: 75,
    lat: "33.604074",
    lng: "130.398747",
    memo:
      "水鏡天満宮からバスでおよそ15分、博多埠頭に着きます。博多港ベイサイドミュージアムでは、パネルや模型で港の役割を紹介しています。同じ敷地には、博多港のシンボルとして親しまれている博多ポートタワーもあります。高さ100mのタワーの地上70mには展望室があり、360度の大パノラマで博多の街と港を一望できます。デッキからは博多湾を行き交う船を眺めることもできます。見学を終えたら、帰りは、博多駅までバスでおよそ20分です。",
    legs: [{ transitMode: "bus", transitDurationMin: 15 }],
  },
];

const PARK_UPDATE = {
  id: PARK_SPOT_ID,
  name: "シーサイドももち海浜公園",
  visitTime: t(13, 26),
  stayDurationMin: 35,
  lat: "33.595558",
  lng: "130.357082",
  memo:
    "福岡タワー南口のあたりから歩いておよそ17分、シーサイドももち海浜公園に着きます。福岡を代表するウォーターフロントで、背後のビル群と海浜の風景が美しいビーチです。夏には海水浴も楽しめます。遊泳できる期間は、公式サイトで確かめましょう。波打ち際では、足元に気をつけましょう。この後は、バスでおよそ20分、水鏡天満宮へ向かいましょう。",
  leg: { transitMode: "walk", transitDurationMin: 17 },
};

const LUNCH = {
  id: "5e8f3c1a-9d26-4b74-8a1e-6c2b7f0e4d93",
  name: "福岡タワー南口のあたりで昼食",
  orderNo: 3,
  visitTime: t(12, 29),
  stayDurationMin: 40,
  lat: "33.591715",
  lng: "130.351654",
  memo:
    "福岡タワーから歩いておよそ4分、福岡タワー南口のあたりに着きます。このあたりで昼食にしましょう。腹ごしらえをしたら、歩いておよそ17分、シーサイドももち海浜公園へ向かいましょう。",
  leg: { transitMode: "walk", transitDurationMin: 4 },
};

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード ===");

  console.log("[題]", NEW_TITLE);
  console.log("[説明文]", NEW_DESCRIPTION);
  console.log("[削除するスポット]", DELETE_SPOT_IDS);
  console.log("[削除する写真(違う場所の写真になったため)]", DELETE_PHOTO_IDS);

  for (const s of UPDATE_SPOTS) {
    console.log("----");
    console.log("id:", s.id, s.name ? `名前(変更): ${s.name}` : "");
    console.log(
      "時刻:",
      `${String(s.visitTime.getUTCHours()).padStart(2, "0")}:${String(s.visitTime.getUTCMinutes()).padStart(2, "0")}`,
      "滞在:",
      s.stayDurationMin,
    );
    if (s.lat) console.log("座標:", s.lat, s.lng);
    console.log("memo:", s.memo);
    if (s.legs) console.log("  区間:", JSON.stringify(s.legs));
  }

  console.log("----");
  console.log("id:", PARK_UPDATE.id, `名前(変更): ${PARK_UPDATE.name}（ドームを作り替え）`);
  console.log(
    "時刻:",
    `${String(PARK_UPDATE.visitTime.getUTCHours()).padStart(2, "0")}:${String(PARK_UPDATE.visitTime.getUTCMinutes()).padStart(2, "0")}`,
    "滞在:",
    PARK_UPDATE.stayDurationMin,
  );
  console.log("座標:", PARK_UPDATE.lat, PARK_UPDATE.lng);
  console.log("memo:", PARK_UPDATE.memo);
  console.log("  区間:", JSON.stringify(PARK_UPDATE.leg));

  console.log("----");
  console.log("名前(新規):", LUNCH.name, "orderNo:", LUNCH.orderNo);
  console.log(
    "時刻:",
    `${String(LUNCH.visitTime.getUTCHours()).padStart(2, "0")}:${String(LUNCH.visitTime.getUTCMinutes()).padStart(2, "0")}`,
    "滞在:",
    LUNCH.stayDurationMin,
  );
  console.log("座標:", LUNCH.lat, LUNCH.lng);
  console.log("memo:", LUNCH.memo);
  console.log("  区間:", JSON.stringify(LUNCH.leg));

  if (!commit) {
    console.log("\n--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: ITINERARY_ID },
      data: { title: NEW_TITLE, description: NEW_DESCRIPTION },
    });

    for (const id of DELETE_SPOT_IDS) {
      await tx.spot.delete({ where: { id } });
    }

    for (const id of DELETE_PHOTO_IDS) {
      await tx.photo.delete({ where: { id } });
    }

    // orderNoの付け替え(unique(dayId, orderNo)にぶつからない順。後ろから動かす)
    await tx.spot.update({ where: { id: BAYSIDE_ID }, data: { orderNo: 6 } });
    await tx.spot.update({ where: { id: TENJIN_ID }, data: { orderNo: 5 } });
    await tx.spot.update({ where: { id: PARK_SPOT_ID }, data: { orderNo: 4 } });

    for (const s of UPDATE_SPOTS) {
      await tx.spot.update({
        where: { id: s.id },
        data: {
          visitTime: s.visitTime,
          stayDurationMin: s.stayDurationMin,
          memo: s.memo,
          ...(s.name ? { name: s.name } : {}),
          ...(s.lat ? { lat: s.lat, lng: s.lng } : {}),
        },
      });
      if (s.legs) {
        for (let i = 0; i < s.legs.length; i++) {
          await tx.spotTransitLeg.upsert({
            where: { spotId_orderNo: { spotId: s.id, orderNo: i + 1 } },
            create: {
              spotId: s.id,
              orderNo: i + 1,
              transitMode: s.legs[i].transitMode,
              transitDurationMin: s.legs[i].transitDurationMin,
            },
            update: {
              transitMode: s.legs[i].transitMode,
              transitDurationMin: s.legs[i].transitDurationMin,
            },
          });
        }
      }
    }

    await tx.spot.update({
      where: { id: PARK_UPDATE.id },
      data: {
        name: PARK_UPDATE.name,
        visitTime: PARK_UPDATE.visitTime,
        stayDurationMin: PARK_UPDATE.stayDurationMin,
        lat: PARK_UPDATE.lat,
        lng: PARK_UPDATE.lng,
        memo: PARK_UPDATE.memo,
      },
    });
    await tx.spotTransitLeg.updateMany({
      where: { spotId: PARK_UPDATE.id, orderNo: 1 },
      data: {
        transitMode: PARK_UPDATE.leg.transitMode,
        transitDurationMin: PARK_UPDATE.leg.transitDurationMin,
      },
    });

    await tx.spot.create({
      data: {
        id: LUNCH.id,
        dayId: DAY_ID,
        orderNo: LUNCH.orderNo,
        name: LUNCH.name,
        lat: LUNCH.lat,
        lng: LUNCH.lng,
        visitTime: LUNCH.visitTime,
        memo: LUNCH.memo,
        stayDurationMin: LUNCH.stayDurationMin,
        stampCategory: "gourmet",
      },
    });
    await tx.spotTransitLeg.create({
      data: {
        spotId: LUNCH.id,
        orderNo: 1,
        transitMode: LUNCH.leg.transitMode,
        transitDurationMin: LUNCH.leg.transitDurationMin,
      },
    });
  });

  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

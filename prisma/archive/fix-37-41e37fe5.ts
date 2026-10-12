/**
 * #37 41e37fe5（泉州の海と犬鳴山、堺の古墳と伝統産業）企画運営の指摘。
 * 1) D1-3 りんくうプレミアム・アウトレットは買い物の施設(単一の商業施設)のため、
 *    実在の田尻歴史館(大正期の洋館、田尻町、公開施設)に差し替える。座標はOSMに
 *    施設名の点がなかったため、GSI(国土地理院)の住所検索の点を使用(田尻歴史館、
 *    大阪府田尻町吉見1101番地)。
 * 2) D1-4 二色の浜公園の「旅の締めくくりに向けて、次はいよいよ本日最後の目的地」
 *    (犬鳴山は最後ではない)を、普通のつながりの文に直す。
 * 3) D2-5 さかい利晶の杜の書き出し「この旅の締めくくりは、さかい利晶の杜です」
 *    (D2の途中で最後ではない)を、前のスポットからのつながりの文に直す。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "41e37fe5-383f-47ff-9375-dda356f10a9a";
const DAY1_ID = "48854a6b-8333-4b87-830c-aeef44ca198b";

const RINKU_MEMO_TO_TAJIRI =
  "淡輪の海辺から北へ足を延ばすと見えてくるのが、関西空港の対岸に広がるりんくう公園です。1996年に開園し、2006年には高架下の部分も整備が進んで、今の姿になりました。泉佐野市から田尻町にまたがる約20.4ヘクタールの敷地は、緑あふれる「シンボル緑地」と、大理石の玉石を敷き詰めた人工のビーチが目を引く「シーサイド緑地」の二つのエリアからなります。シーサイド緑地の「マーブルビーチ」からは、関西空港へ離着陸する飛行機や連絡橋、さらには明石海峡大橋や淡路島まで一望でき、大阪湾のスケールの大きさを実感できます。夕暮れどきに訪れれば、飛行機のシルエットと茜色の空が重なる、ここならではの景色にも出会えるでしょう。景色を存分に楽しんだら、南海本線で吉見ノ里駅まで移動し、田尻歴史館へ向かいましょう(駅から歩いておよそ7分)。";

const TAJIRI_REKISHIKAN_MEMO =
  "りんくう公園から南海本線で吉見ノ里駅まで移動し、歩いておよそ7分、田尻歴史館に着きます。大阪合同紡績を興した実業家・谷口房蔵の別邸として大正時代に建てられた、洋館と和館からなる歴史的建造物です。平成5年(1993)に田尻町が取得し、一般に公開されています。ステイタスシンボルとして建てられたヨーロッパ様式の洋館の横に、日常生活のための和風住宅が設けられ、洋と和が調和するつくりが見どころです。当時の面影を残す建物を、ゆっくりと見学してみてください。この後は、南海本線で貝塚方面へ移動し、二色の浜公園へ向かいましょう。";

const NIIRO_MEMO_FULL =
  "田尻歴史館から南海本線で貝塚方面へ移動すると見えてくるのが、白い砂浜と青々とした松林のコントラストが美しい二色の浜公園です。その名の由来もまさにこの色合いにあり、砂浜の「白」と松林の「青」、二つの色が織りなす風景から「二色の浜」と呼ばれるようになったと伝えられています。この地が海浜リゾートとして整備されたのは1933年のこと、南海鉄道が「第二の浜寺」を目指して海浜村という施設を開設したのが始まりとされ、1950年には正式に公園として開設されました。長い年月を経た今も、大阪府内有数の松林と砂浜が残る貴重な景勝地です。2025年9月には園内にグランピング施設「うみテラス二色の浜」もオープンし、日帰りだけでなく宿泊で自然を楽しむ過ごし方もできるようになりました。潮風を感じながら松林を歩いたら、次はバスで、修験道の聖地・犬鳴山へと向かいましょう。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "2e814052-5419-4f2c-8242-f533ac578b2d", data: {} }, // 淡輪ときめきビーチ
    { id: "9f057b8f-e033-4f46-ac41-15a830364c4d", data: { memo: RINKU_MEMO_TO_TAJIRI } }, // りんくう公園
    {
      create: {
        name: "田尻歴史館",
        address: "大阪府泉南郡田尻町吉見1101-1",
        lat: 34.394188,
        lng: 135.287994,
        memo: TAJIRI_REKISHIKAN_MEMO,
        visitTime: t(11, 30),
        stayDurationMin: 40,
        transitMode: "train",
        transitDurationMin: 15,
        transitLine: "南海本線",
      },
    },
    {
      id: "f4923d36-7887-4cd9-8c0d-eb7db4f6d781", // 二色の浜公園
      data: { memo: NIIRO_MEMO_FULL, visitTime: t(12, 35), stayDurationMin: 58, transitMode: "train", transitDurationMin: 25, transitLine: "南海本線" },
    },
    { id: "d9631b1d-0daa-475f-97ff-7c4a03717799", data: { visitTime: t(14, 13), stayDurationMin: 41 } }, // 犬鳴山
    { id: "4d819062-eecb-459e-af39-5e611af6cad4", data: { visitTime: t(15, 4), stayDurationMin: 75 } }, // 湯元温泉荘・山乃湯
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  // D2-5 さかい利晶の杜: 書き出しのみ修正(順序・時刻は変更なし)
  const rishoNoMori = await findSpotInItinerary(ITIN, { spotName: "さかい利晶の杜" });
  const rishoFrom = "この旅の締めくくりは、さかい利晶の杜です。";
  const rishoTo = "堺伝統産業会館から歩いておよそ13分、さかい利晶の杜に着きます。";
  if (!rishoNoMori.memo!.includes(rishoFrom)) throw new Error("一致しません(さかい利晶の杜)");
  const rishoNewMemo = rishoNoMori.memo!.split(rishoFrom).join(rishoTo);
  console.log("さかい利晶の杜: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx, remove: ["6795bdab-e26e-4901-a07e-13d681d9cf57"] });
  }, { timeout: 60000 });
  await updateSpotInItinerary(ITIN, { spotId: rishoNoMori.id }, { memo: rishoNewMemo });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * 承認待ち見直し#1(那須いちご狩り)の直し直し。企画運営の指摘(2026-10-13)に対応。
 * 1. お金の話(料金・有料無料・予約の要否)を本文から消す
 * 2. 「ください」を「〜しましょう」に(神社の参拝の一文は除く)
 * 3. 出典サイト名・会社の施設名の宣伝的な書き方を消す
 * 4. 昼食をどうぶつ王国の訪問時間(12:35〜14:15、11:30〜13:30と重なる)の中で案内する形は保ち、
 *    スポット名に「（昼食）」を付けて分かりやすくする
 * 5. 南ヶ丘牧場の滞在を120分→50分に短縮し、那須ステンドグラス美術館(屋内、公式サイト
 *    https://sgm-nasu.com/ で営業時間9:30〜16:30・定休日ありを確認)を追加して16:30に終える
 * 6. 事実の確かめ:
 *    - 南ヶ丘牧場「明治創業」は誤り。公式サイト(https://www.minamigaoka.co.jp/company/)で
 *      「創業 1948年(昭和23年)11月」と確認したため、「昭和23年(1948)創業」に直す
 *    - 殺生石「那須町は自然のままの姿を保存する方針」は出典が見つからず、言い切れないため削除
 *    - どうぶつ王国の冬季休園の傾向は、公式サイトの営業カレンダー
 *      (https://nasu-oukoku.com/?calendar=...)で確認済み(2026年12月〜2027年3月の休園日を
 *      個別に確認。固定の曜日ではなく週替わりのため、本文には書かない)
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "pending36-01-nasu-fix2";

const ICHIGO_SPOT_ID = "cc9db79a-f746-421f-9e0c-2bddc366f314";
const SESSHOSEKI_SPOT_ID = "b49271b8-ed6b-4853-b2b1-6e85e62fe968";
const DOUBUTSU_SPOT_ID_NAME = "那須どうぶつ王国"; // 作り直すので名前で検索
const MINAMIGAOKA_SPOT_ID_NAME = "南ヶ丘牧場";
const DAY_ID = "468695c0-fd4b-4c20-af9c-208df69e6178";

const ICHIGO_MEMO =
  "栃木県が育成したブランドいちご「とちおとめ」や「とちあいか」などを楽しめる観光いちご園で、ハウスは立ったまま摘み取れる高設栽培です。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけで楽しみましょう。周辺には出荷用のいちご畑も広がっていますが、観光農園以外の畑には入らないようにしましょう。";

const SESSHOSEKI_MEMO =
  "松尾芭蕉が「奥の細道」の道中で立ち寄ったことでも知られる、国指定名勝の巨石です。平安時代の武将・上総介広常らに退治された九尾の狐が、化して毒石になったという伝説が伝わり、周辺は硫化水素などの火山ガスが噴出する「賽の河原」と呼ばれる荒涼とした景観が広がります。令和4年(2022)3月、長年入っていたひびが進み、石が真っ二つに割れたことが話題になりました。割れた状態を今も見ることができます。遊歩道は整備されていますが、ガスの噴出する場所には近づかないよう、案内表示に従いましょう。";

const DOUBUTSU_MEMO =
  "うさぎ・カピバラなどの小動物とふれあえる屋内中心の「王国タウン」と、鳥のショーなどを楽しむ屋外の「王国ファーム」からなる動物園です。冬は積雪や寒さに備え、屋内中心の王国タウンのみの営業になることが多く、不定期の休園日もあります。訪れる前に、公式サイトの営業カレンダーで確かめましょう。園内のレストランやカフェで、昼食をとりましょう。";

const SGM_MEMO =
  "カラフルなステンドグラスのチャペルや、アンティークのステンドグラス作品を展示する屋内の美術館です。ヨーロッパの教会を思わせる建物や庭園も見どころです。休館日があるため、訪れる前に公式サイトで確かめましょう。";

const MINAMIGAOKA_MEMO =
  "昭和23年(1948)創業の牧場です。牛や羊、ポニーなどの動物とふれあえるほか、バター作りやアイスクリーム作りの体験もできます。体験の内容や予約の要否は、公式サイトで確かめましょう。売店では、牧場で作ったチーズやソフトクリームも楽しめます。旅の最後に、ゆっくりと那須の牧場風景を楽しみましょう。";

async function main() {
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const sesshoseki = await prisma.spot.findUnique({ where: { id: SESSHOSEKI_SPOT_ID } });
  const doubutsu = await prisma.spot.findFirst({ where: { name: DOUBUTSU_SPOT_ID_NAME, dayId: DAY_ID } });
  const minamigaoka = await prisma.spot.findFirst({ where: { name: MINAMIGAOKA_SPOT_ID_NAME, dayId: DAY_ID } });
  const sgmExisting = await prisma.placeMaster.findFirst({ where: { name: "那須ステンドグラス美術館" } });
  if (!ichigo || !sesshoseki || !doubutsu || !minamigaoka) throw new Error("想定と違います(スポットが見つかりません)");
  if (sgmExisting) throw new Error("那須ステンドグラス美術館の台帳が既に存在します(想定外)");

  console.log("[確認OK] いちごの森・殺生石・どうぶつ王国・南ヶ丘牧場のメモを直す");
  console.log("[確認OK] どうぶつ王国の名前に「（昼食）」を追加");
  console.log("[確認OK] 南ヶ丘牧場の滞在を120分→50分、時刻を15:40開始に変更");
  console.log("[確認OK] 那須ステンドグラス美術館を14:30〜15:30で追加(台帳を新規作成)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: SESSHOSEKI_SPOT_ID }, data: { memo: SESSHOSEKI_MEMO } });
  await prisma.spot.update({
    where: { id: doubutsu.id },
    data: { name: "那須どうぶつ王国（昼食）", memo: DOUBUTSU_MEMO },
  });

  // 那須ステンドグラス美術館を台帳作成・取得
  const result = await uploadCommonsFile(
    "190725 Nasu Stained Glass Museum Nasu Tochigi pref Japan02s3.jpg",
    "那須ステンドグラス美術館",
    BLOB_PREFIX
  );
  if (!result) throw new Error("画像の取得・ライセンス確認に失敗しました(那須ステンドグラス美術館)");
  console.log("取得:", result.url, result.credit);
  const doubutsuPlace = await prisma.placeMaster.findFirst({ where: { name: "那須どうぶつ王国" } });
  const sgmPlace = await prisma.placeMaster.create({
    data: {
      name: "那須ステンドグラス美術館",
      address: "栃木県那須郡那須町高久丙1790",
      lat: 37.065746,
      lng: 140.024429,
      prefectureAreaId: doubutsuPlace!.prefectureAreaId,
      category: "museum",
      isWideArea: false,
      isMemorial: false,
      websiteUrl: "https://sgm-nasu.com/",
      photoUrl: result.url,
      photoAuthor: result.credit.author ?? null,
      photoLicense: result.credit.license ?? null,
      photoLicenseUrl: result.credit.licenseUrl ?? null,
      photoSourceUrl: result.credit.sourceUrl ?? null,
      source: "ai_collected",
      positionSource: "gsi",
      verifiedAt: new Date(),
    },
  });

  // どうぶつ王国(12:35+100分=14:15)から車15分で14:30着、60分滞在(15:30終了)
  const sgmSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: sgmPlace.id,
      orderNo: 5,
      name: "那須ステンドグラス美術館",
      address: "栃木県那須郡那須町高久丙1790",
      lat: 37.065746,
      lng: 140.024429,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)),
      memo: SGM_MEMO,
      stayDurationMin: 60,
      websiteUrl: "https://sgm-nasu.com/",
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sgmSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });
  await prisma.photo.create({
    data: {
      spotId: sgmSpot.id, url: result.url, caption: "那須ステンドグラス美術館",
      sourceUrl: result.credit.sourceUrl ?? null, author: result.credit.author ?? null,
      license: result.credit.license ?? null, licenseUrl: result.credit.licenseUrl ?? null,
    },
  });

  // 南ヶ丘牧場: orderNo 6、ステンドグラス美術館(14:30+60分=15:30)から車10分で15:40着、50分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: minamigaoka.id },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)), stayDurationMin: 50, memo: MINAMIGAOKA_MEMO },
  });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: minamigaoka.id }, data: { transitDurationMin: 10 } });

  console.log("  COMMITTED: #1 直し直し完了");
}
main().finally(() => prisma.$disconnect());

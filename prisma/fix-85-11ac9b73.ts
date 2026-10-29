/**
 * #85 知覧特攻平和会館と武家屋敷庭園、平和と歴史を学ぶ1泊2日 (11ac9b73-e139-4423-a4a0-5b32958f042d)
 * 初日・最終日の見直し(2回目。企画運営・法務との相談のうえ、組み直す)。
 *
 * 入口(JR鹿児島中央駅10:30着+手続き15分+車約50分=11:35)が丸ごと欠けていた。知覧特攻平和会館・
 * ホタル館 富屋食堂はともに慰霊の施設のため、滞在を削って昼食(11:30〜13:30ごろ)に収めるのは
 * 内容上避け、新規スポット「知覧で昼食」(点は店でないバス停「法務局前」node9983231560)を
 * 1か所目に立て、到着後まず昼食をとる形にする(企画運営・法務のC案)。これにより知覧特攻平和
 * 会館(100分)・ホタル館(40分)はもとの長さのまま。枕崎お魚センターは昼食の場所ではなく、
 * 見学・買い物の立ち寄りとして滞在を50→25分に短くする。それでも終了が遅くなるため、説明文に
 * 名前のない火之神公園を外し、お魚センター→輝津館を直接の道のりで測り直す(実測15分)。
 * 輝津館の滞在は50→45分に少しだけ短くし、終了を16:55(16:30〜17:00)に収める。
 * 表紙(thumbnailUrl)が知覧特攻平和会館(慰霊の場所)の写真だったため、知覧武家屋敷庭園の
 * 写真に差し替える(法務の指摘)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-85-11ac9b73.ts
 *   反映: npm run prod -- npx tsx prisma/fix-85-11ac9b73.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "11ac9b73-e139-4423-a4a0-5b32958f042d";
const DAY1_ID = "8170619a-045d-406f-bc96-148e67141778";

const KIRAN_HEIWA_ID = "dba4e4ba-4eea-472e-9071-b91655322cff";
const HOTARUKAN_ID = "809add95-aba9-4c8d-b1b9-af73e26148a4";
const MAKURAZAKI_ID = "6737e6af-016b-4604-a253-c94d0f6b5713";
const HINOKAMI_ID = "881d3e20-9fc0-4d6b-905e-f35ad65ed11f";
const KIZUIKAN_ID = "c767f4dc-bd90-49aa-8bfe-a3c5dfd08328";
const KANSHINKINENKAN_ID = "7321c19f-eb51-4d8b-9022-36da7fd7b924";
const BUKEYASHIKI_ID = "5b60199c-1949-4b4f-97ed-5f39509320c6";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const LUNCH_MEMO =
  "この旅は車でめぐります。JR鹿児島中央駅に10:30ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約50分の知覧へ。到着したら、まず知覧の町なかで昼食をとりましょう。";

const KIRAN_HEIWA_MEMO =
  "昼食のあとは、車で約5分の知覧特攻平和会館へ。特攻隊員の遺品や関係する資料を集めて展示し、戦争のむごさと命の大切さを後の世に伝え、世界の平和を願う施設です。展示の一つひとつに、ゆっくりと向き合いましょう。亡くなった方々をしのぶ場所ですので、静かに、敬意をもって見学しましょう。館内の撮影の決まりは、公式の案内に従いましょう。";

const MAKURAZAKI_MEMO =
  "知覧から南西へ、車で約35分の枕崎へ。かつお漁の港町の産物が集まる施設で、食事処では、枕崎で水揚げされた魚の料理を味わえます。かつお節など、港町ならではの品も並びます。少し立ち寄って、港町の雰囲気を味わいましょう。";

const KIZUIKAN_MEMO =
  "お魚センターから海沿いを西へ、車で約15分の坊津へ。坊津は、かつて中国や南の国々との交易で栄えた港町です。この資料館では、海を越えて運ばれた明の時代の焼き物や、漁や農の暮らしの道具などから、坊津の歩みを紹介しています。この夜は、車で約15分の枕崎の宿に泊まります。";

async function main() {
  const commit = process.argv.includes("--commit");

  const bukeyashikiPhoto = await prisma.photo.findFirstOrThrow({ where: { spotId: BUKEYASHIKI_ID } });

  console.log("=== #85 初日の見直し(2回目) ===\n");
  console.log(`表紙を知覧武家屋敷庭園の写真(${bukeyashikiPhoto.url})に差し替え`);
  console.log("1. 知覧で昼食(新規スポット、点はバス停「法務局前」node9983231560) 11:35(45分):");
  console.log(LUNCH_MEMO);
  console.log("\n2. 知覧特攻平和会館 12:25(100分、変更なし):");
  console.log(KIRAN_HEIWA_MEMO);
  console.log("\n3. ホタル館 富屋食堂 14:15(40分、変更なし)");
  console.log("4. 枕崎お魚センター 15:30(25分、もとは50分、昼食の一文を外す):");
  console.log(MAKURAZAKI_MEMO);
  console.log("\n5. 坊津歴史資料センター輝津館(最後) 16:10(45分、もとは50分、終了16:55、宿の一文を追加):");
  console.log(KIZUIKAN_MEMO);
  console.log("\n外す: 鑑真記念館・火之神公園(どちらも説明文に名前なし)");
  console.log("\n2日目: 時刻・内容ともに決まりに合っているため変更なし");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: bukeyashikiPhoto.url } });

    await setDaySpotOrder(
      DAY1_ID,
      [
        {
          create: {
            name: "知覧で昼食",
            lat: 31.374995,
            lng: 130.442782,
            visitTime: t(11, 35),
            stayDurationMin: 45,
            memo: LUNCH_MEMO,
          },
        },
        {
          id: KIRAN_HEIWA_ID,
          data: {
            visitTime: t(12, 25),
            stayDurationMin: 100,
            memo: KIRAN_HEIWA_MEMO,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
          },
        },
        { id: HOTARUKAN_ID, data: { visitTime: t(14, 15), stayDurationMin: 40 } },
        {
          id: MAKURAZAKI_ID,
          data: { visitTime: t(15, 30), stayDurationMin: 25, memo: MAKURAZAKI_MEMO },
        },
        {
          id: KIZUIKAN_ID,
          data: {
            visitTime: t(16, 10),
            stayDurationMin: 45,
            memo: KIZUIKAN_MEMO,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
          },
        },
      ],
      { remove: [KANSHINKINENKAN_ID, HINOKAMI_ID], tx }
    );
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #60 fb4c9c64（有田・伊万里）ユーザー決定「全部直す」の対象(旧Day2終了13:21)。
 * 滞在を延ばさず(決まりA)、大川内山(秘窯の里)の実在スポットを追加。
 * 「匠の技と藩窯時代を感じる大川内山半日コース」(伊万里市観光協会)として紹介される
 * とおり、大川内山は本来半日規模で回るエリアのため、窯元通り散策・伊万里鍋島焼会館
 * (昼食)を追加してDay2を16:30〜17:00に収めた。
 *
 * 追加: 伊万里鍋島焼会館(実在、大川内山の玄関口、鍋島焼の展示・販売と喫茶、
 * 座標はOSMの「大川内山」バス停(node 4378744090)を代替アンカー・住所は公式で確認)、
 * 窯元通り散策(実在、大川内山の集落、およそ30軒の窯元が並ぶ坂道。座標はOSMの
 * 「大川内山」集落点)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "b6ac32ca-f4ee-43ef-b124-09ee5ad33e72";

const KAIKAN_MEMO =
  "鍋島藩窯公園から歩いておよそ4分、大川内山の玄関口にある伊万里鍋島焼会館に着きます。鍋島青磁・鍋島染付・色鍋島など、大川内山の窯元ごとの作品を展示・販売しており、それぞれの窯の特徴を見比べながら見学できます。喫茶コーナーでは、伊万里焼の器で味わう軽食もあり、ここでお昼をとりましょう。この後は、歩いておよそ4分、窯元が軒を連ねる坂道、大川内山の窯元通りへ向かいましょう。";

const KAMAMOTODORI_MEMO =
  "伊万里鍋島焼会館から歩いておよそ4分、大川内山の窯元通りに着きます。谷あいの坂道におよそ30軒の窯元が軒を連ね、それぞれの窯ならではの器や作風を見比べながら歩けます。焼き物どうしを軽く打ち合わせて音を聞き分けたという、かつての「めおとし」の技にちなんだ風鈴の音色が、通りのあちこちから聞こえてきます。山あいに静かにたたずむ焼き物の里の風情を、ゆっくりと味わいながら散策してみてください。この後は、歩いておよそ4分、伊万里・有田焼伝統産業会館へ向かいましょう。";

const SANGYOKAIKAN_MEMO_NEW =
  "大川内山の窯元通りから歩いておよそ4分、伊万里・有田焼伝統産業会館に着きます。伊万里焼・有田焼の歴史や製法を紹介する施設で、大川内山の窯元めぐりの拠点としても利用されています。館内では、湯のみや皿などに絵付けを行う体験もでき、自分だけの器を作る記念にもぴったりです。旅の締めくくりに、伊万里・有田で受け継がれてきたやきものの技に触れてみてください。有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日をお楽しみいただけたことでしょう。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: "6c9f9754-0c75-4dda-9d36-a49526b28634", data: {} }, // 伊万里市陶器商家資料館
    { id: "e744d089-834b-4906-83d7-f7698615e57d", data: {} }, // 伊萬里神社
    { id: "e0ab5c7f-a3c3-4384-a724-8e7a58d665e7", data: {} }, // 鍋島藩窯公園(stay75のまま)
    {
      create: {
        name: "伊万里鍋島焼会館",
        address: "佐賀県伊万里市新天町622-13",
        lat: 33.2363482,
        lng: 129.8924804,
        memo: KAIKAN_MEMO,
        visitTime: t(12, 48),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "大川内山の窯元通り",
        address: "佐賀県伊万里市大川内町大川内山",
        lat: 33.2338557,
        lng: 129.8943208,
        memo: KAMAMOTODORI_MEMO,
        visitTime: t(13, 37),
        stayDurationMin: 137,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    { id: "987b1f3d-528f-46b5-8cc0-bd87cdab4a0c", data: { memo: SANGYOKAIKAN_MEMO_NEW, visitTime: t(15, 58), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 4 } }, // 伊万里・有田焼伝統産業会館
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY2_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

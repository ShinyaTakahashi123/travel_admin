/**
 * #60 fb4c9c64（有田・伊万里）企画運営の指摘(2026-09-30 12:31): 2日目に昼食の
 * 一言が2つあった(町なか09:59〜11:29「お昼をとるのもおすすめ」・伊万里鍋島焼会館
 * 13:54〜「ここでお昼をとりましょう」)。町なかは早すぎ、鍋島焼会館は遅すぎるため、
 * 昼食は伊万里鍋島焼会館の1か所にまとめ、鍋島藩窯公園より先に大川内山へ着く順番
 * (町なか→伊萬里神社→伊万里鍋島焼会館(昼食)→鍋島藩窯公園→窯元通り→伝統産業会館)
 * に組み替えて、12時台に昼食が来るようにした。町なかの本文から昼食の一言を削除し、
 * 滞在も90→75分に調整。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "b6ac32ca-f4ee-43ef-b124-09ee5ad33e72";

const MACHINAKA_MEMO_NEW =
  "伊万里市陶器商家資料館から歩いておよそ4分、伊万里駅前に着きます。駅前には、伊万里焼でつくられた大きな人形が並び、旅の記念に写真を撮る人も多いスポットです。ここから伊万里川沿いに広がる町なかを歩いてみましょう。川沿いの「あいあい通り」には、江戸時代から続く白壁の土蔵群が今も残り、伊万里津として栄えた頃の面影を伝えています。今も商いを続ける店が軒を連ねているので、昨日訪れた有田の窯元の歴史とあわせて、やきものを商った町の歴史にふれるひとときを過ごしましょう。この後は、歩いておよそ11分、伊萬里神社へ向かいましょう。";

const IMARI_JINJA_TAIL_FROM = "静かに、敬意をもってお参りください。この後は、バスでおよそ20分、秘窯の里・大川内山にある鍋島藩窯公園へ向かいましょう。";
const IMARI_JINJA_TAIL_TO = "静かに、敬意をもってお参りください。この後は、バスでおよそ20分、大川内山の玄関口にある伊万里鍋島焼会館へ向かいましょう。";

const KAIKAN_MEMO_NEW =
  "伊萬里神社からバスでおよそ20分、大川内山の玄関口にある伊万里鍋島焼会館に着きます。鍋島青磁・鍋島染付・色鍋島など、大川内山の窯元ごとの作品を展示・販売しており、それぞれの窯の特徴を見比べながら見学できます。喫茶コーナーでは、伊万里焼の器で味わう軽食もあり、ここでお昼をとりましょう。この後は、歩いておよそ4分、鍋島藩窯公園へ向かいましょう。";

const NABESHIMA_PARK_MEMO_NEW =
  "伊万里鍋島焼会館から歩いておよそ4分、大川内山にある鍋島藩窯公園に着きます。延宝3年(1675)、佐賀藩・鍋島家がこの地に御用窯を移して以来、将軍家や大名への献上品として、採算を度外視した最高級の磁器「鍋島」がつくられてきました。技術の流出を防ぐため、周囲を山に囲まれたこの谷あいには関所が設けられ、明治になるまでその存在は広く知られていなかったといい、「秘窯の里」と呼ばれています。公園内には、当時の関所や登り窯、陶工の家などが復元され、今も30ほどの窯元が伝統の技を受け継いでいます。山あいに静かにたたずむ焼き物の里の風情を、ゆっくりと味わいましょう。この後は、歩いておよそ4分、大川内山の窯元通りへ向かいましょう。";

async function main() {
  const day2Spots: SpotOrderItem[] = [
    { id: "6c9f9754-0c75-4dda-9d36-a49526b28634", data: {} }, // 資料館(変更なし)
    { id: "b40e3ff4-e78a-4306-a02c-b26f1d7f928f", data: { memo: MACHINAKA_MEMO_NEW, stayDurationMin: 75 } }, // 町なか
    { id: "e744d089-834b-4906-83d7-f7698615e57d", data: {} }, // 伊萬里神社(下でmemoを別途更新)
    { id: "a98d9881-f3f0-488c-ab42-3cfc02fd308e", data: { memo: KAIKAN_MEMO_NEW, visitTime: t(12, 20), stayDurationMin: 45, transitMode: "bus", transitDurationMin: 20 } }, // 伊万里鍋島焼会館
    { id: "e0ab5c7f-a3c3-4384-a724-8e7a58d665e7", data: { memo: NABESHIMA_PARK_MEMO_NEW, visitTime: t(13, 9), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 4 } }, // 鍋島藩窯公園
    { id: "33f778b6-3fcb-40cf-b72f-0c9125016515", data: { visitTime: t(14, 28), stayDurationMin: 85, transitMode: "walk", transitDurationMin: 4 } }, // 窯元通り
    { id: "987b1f3d-528f-46b5-8cc0-bd87cdab4a0c", data: { visitTime: t(15, 57), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 4 } }, // 伝統産業会館
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
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
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
    const jinja = await tx.spot.findFirstOrThrow({ where: { name: "伊萬里神社", day: { itineraryId: (await tx.day.findUniqueOrThrow({ where: { id: DAY2_ID } })).itineraryId } } });
    if (!jinja.memo!.includes(IMARI_JINJA_TAIL_FROM)) throw new Error("一致しません(伊萬里神社)");
    await tx.spot.update({ where: { id: jinja.id }, data: { memo: jinja.memo!.split(IMARI_JINJA_TAIL_FROM).join(IMARI_JINJA_TAIL_TO) } });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

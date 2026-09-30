/**
 * #63 1621a020（五箇山・白川郷）ユーザー決定「全部直す」の対象(旧D1 15:09・D2 15:09)。
 * 滞在を延ばさず(決まりA)、実在スポットを追加する。
 *
 * Day1: 白山宮のあとに流刑小屋(実在、南砺市田向、加賀藩の流刑小屋の唯一の現存例、
 * 県指定有形民俗文化財)・羽馬家住宅(実在、同じ田向、文化11年(1814)築の古い合掌
 * 家屋、国重要文化財)を追加し、新五箇山温泉ゆ～楽の滞在を60→90分に。
 *
 * Day2: 天守閣展望台のあとに野外博物館合掌造り民家園(実在、白川村荻町、25棟の
 * 合掌造りを移築・公開する野外博物館、そば打ち体験も。冬季(12〜2月)は営業時間が
 * 短くなるため本文に注意書きを追加)を追加。
 *
 * あわせて、作業前の見直しで見つけた既存の不具合2点も修正。
 * ・相倉伝統産業館の結びが「五箇山和紙の里へ」のままだったが、実際の一つ後は村上家
 * ・新五箇山温泉ゆ～楽の「ご宿泊いただきます」を「お泊まりください」に(案内口調)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";
const DAY2_ID = "85bec888-3775-474a-a81f-f41e3bf0f0e7";

// ---------- Day1 ----------
const HAKUSANGU_MEMO_NEW =
  "村上家から車でおよそ5分、上梨の白山宮に着きます。奈良時代の初め頃に人形山に創建されたと伝わり、1125年に今の場所へ移されたという長い歴史を持つ神社です。現在の本殿は1502年に再建されたもので、富山県内で最も古い木造建築のひとつとされ、国の重要文化財に指定されています。雪深い五箇山の気候から本殿を守るため、「鞘堂」と呼ばれる茅葺き屋根の建物の中に納められているのも特徴です。境内は、五箇山に伝わる民謡「こきりこ節」ゆかりの地としても知られています。静かに、敬意をもってお参りください。この後は、車でおよそ3分、田向の流刑小屋へ向かいましょう。";

const RYUKEIGOYA_MEMO =
  "白山宮から車でおよそ3分、田向の流刑小屋に着きます。江戸時代、加賀藩は重い罪を犯した者をこの地に閉じ込める「お縮小屋」を8棟設けており、流刑小屋はその唯一の現存例とされています。間口およそ2.8m、奥行きおよそ3.6mの小さな茅葺きの小屋で、扉には食事を差し入れるための小さな穴が開けられています。積雪で倒壊した後、昭和40年(1965)に復元されたもので、富山県の有形民俗文化財に指定されています。厳しい山あいの暮らしの、もう一つの歴史に触れてみてください。この後は、歩いておよそ2分、羽馬家住宅へ向かいましょう。";

const HABAKE_MEMO =
  "流刑小屋から歩いておよそ2分、羽馬家住宅に着きます。文化9年(1812)に材料の準備が始まり、文化11年(1814)に完成したと伝わる、五箇山でも古い部類に入る合掌家屋のひとつで、国の重要文化財に指定されています。規模は小さいながらも、当時の面影をよく残しており、五箇山の古い合掌造りの姿を今に伝えています。この後は、車でおよそ10分、五箇山和紙の里へ向かいましょう。";

// ---------- Day2 ----------
const TENSHUKAKU_MEMO_NEW =
  "明善寺から、坂道を上っておよそ12分(シャトルバスも利用できます)、天守閣展望台に着きます。集落を見下ろす高台にあり、眼下に広がる合掌造りの家並みと、その向こうにそびえる白山連峰を一望できる、白川郷いちの眺めとして知られています。坂道は足元に気をつけて、ゆっくりと上りましょう。田んぼの緑や、雪におおわれた冬景色など、季節ごとに表情を変える集落の姿を、高いところからゆっくりと眺めてみてください。この後は、歩いておよそ2分、野外博物館合掌造り民家園へ向かいましょう。";

const MINKAEN_MEMO =
  "天守閣展望台から歩いておよそ2分、野外博物館合掌造り民家園に着きます。村内各地から移築した合掌造りをはじめ、25棟の建物を保存・公開する野外博物館で、主屋は屋根裏まで見学できるほか、水車小屋やお堂なども点在しています。期間限定で、そば打ちなどの体験(有料・要予約)ができることもあります。冬季(12月〜2月)は営業時間が短くなるので、訪れる前に公式サイトで確かめてください。相倉・菅沼の集落から白川郷まで、五箇山と白川郷の合掌造りをめぐった1泊2日の旅を、ここで締めくくりましょう。";

const SOSANGYOKAN_MEMO_NEW =
  "相倉民俗館から歩いてすぐ、相倉伝統産業館に着きます。五箇山で育まれてきた塩硝づくりや和紙すき、養蚕といった伝統産業の歴史や道具を紹介する施設です。厳しい雪国の暮らしの中で、限られた資源を工夫して活かしてきた先人たちの知恵を、具体的な資料とともに学ぶことができます。集落の景観だけでなく、そこで実際に営まれてきた仕事の中身まで知ることができる、貴重な機会です。この後は、車でおよそ4分、上梨の村上家へ向かいましょう。";

const YURAKU_MEMO_NEW =
  "五箇山和紙の里から車でおよそ4分、庄川のほとりに立つ新五箇山温泉 ゆ～楽に着きます。地元の人々にも親しまれている日帰り温泉施設で、エメラルドグリーンに輝く庄川の流れを見下ろす露天風呂につかりながら、旅の疲れをゆっくりとほぐすことができます。浴室では撮影しないようにしましょう。館内の食事処では、山菜や川魚など、五箇山ならではの四季の味覚を楽しむこともできます。今夜は、この平・上梨エリアの宿にお泊まりください。訪れる前に、公式サイトで営業時間や休館日を確かめてください。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", data: {} },
    { id: "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7", data: {} },
    { id: "885aea12-01b6-43d2-82de-e0fa0b1c38e2", data: { memo: SOSANGYOKAN_MEMO_NEW } },
    { id: "2a21313a-a48c-4c1f-af68-872aa0601167", data: {} },
    { id: "4b2453bb-1890-4895-8260-89d6f890d6c6", data: { memo: HAKUSANGU_MEMO_NEW } },
    {
      create: {
        name: "流刑小屋",
        address: "富山県南砺市田向",
        lat: 36.4093682,
        lng: 136.932535,
        memo: RYUKEIGOYA_MEMO,
        visitTime: t(11, 58),
        stayDurationMin: 25,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "羽馬家住宅",
        address: "富山県南砺市田向",
        lat: 36.4084283,
        lng: 136.9320343,
        memo: HABAKE_MEMO,
        visitTime: t(12, 25),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", data: { visitTime: t(13, 0), stayDurationMin: 120, transitMode: "car", transitDurationMin: 10 } },
    { id: "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", data: { memo: YURAKU_MEMO_NEW, visitTime: t(15, 4), stayDurationMin: 90, transitMode: "car", transitDurationMin: 4 } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "a24dc82a-de3a-40a8-8feb-ba6386cc5e09", data: {} },
    { id: "cd83508a-d202-4a62-b1f1-d8e1b2fae8f1", data: {} },
    { id: "aeb77101-e9e5-4816-a623-c0f5dc707ae2", data: {} },
    { id: "dbf5cc44-3ba1-4f69-9e50-01273f0c0ae8", data: {} },
    { id: "0ee74b01-ba4e-4155-a6ac-f1811a6ed337", data: {} },
    { id: "e7e285ec-33b3-45aa-82a1-ba38226e7c85", data: {} },
    { id: "b654e334-4caa-4129-9fed-4f28edf26d23", data: {} },
    { id: "0dbc877a-025a-4873-a676-eebf91862101", data: {} },
    { id: "19955d06-9891-4fb9-bd45-936c4a48b554", data: { memo: TENSHUKAKU_MEMO_NEW, transitDurationMin: 12 } },
    {
      create: {
        name: "野外博物館合掌造り民家園",
        address: "岐阜県大野郡白川村荻町2499",
        lat: 36.263220,
        lng: 136.909330,
        memo: MINKAEN_MEMO,
        visitTime: t(15, 11),
        stayDurationMin: 80,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, dayId, order] of [[1, DAY1_ID, day1Spots], [2, DAY2_ID, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

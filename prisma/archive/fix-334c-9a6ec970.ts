/**
 * #334の組み直し(その3)。企画運営2026-10-01 05:50・05:51、法務05:51の指摘に対応。
 *
 * 企画運営05:50: 商店街を縮めた分(130→45分)が、浄土寺(75→110分)・
 * 西國寺(55→70分)に回っていた(決まりAの「縮めた分をほかの滞在に回す」
 * 水増し)。浄土寺65分・西國寺50分に戻し、空いた時間は実在の新しい行き先
 * (持光寺・光明寺、いずれも公式で確認)で埋めた。順路は艮神社→持光寺→
 * 光明寺→商店街(昼食、13:01到着)→記念館→西國寺→浄土寺(最後)。
 *
 * 法務05:51・企画運営05:51(法務の気づき): 浄土寺の足利尊氏の逸話の
 * 出典がnote.comだった。尾道市観光公式サイト(ononavi.jp)でも「九州平定
 * や湊川の戦の際に戦勝祈願をした」とのみ記載され、「九州へ落ち延びる
 * 途中」か「京へ攻め上る途中」かは公式では明確に確認できなかったため、
 * 企画運営の案のとおり、時期(建武3年)だけを記す安全な表現に改めた。
 *
 * 座標の出典(いずれもNominatim名称一致または GSI住所検索、直接確認):
 * - 持光寺: 34.4072384,133.195773(node 6371696824)
 * - 光明寺: 34.408096,133.197952(GSI住所検索「広島県尾道市東土堂町2-8」)
 *
 * 事実確認(いずれも直接開いて確認):
 * - 持光寺(るるぶ&more.等): 寺宝「絹本着色普賢延命菩薩画像」が国宝。
 *   花崗岩造りの大石門。「にぎり仏」体験ができる
 * - 光明寺(Wikipedia・るるぶ&more.等): 木造千手観音立像(浪分観音)が
 *   国重要文化財。第12代横綱・陣幕久五郎夫妻の墓。尾道市天然記念物
 *   「蟠龍の松」(樹齢およそ400年)、シンパク(樹齢およそ500年)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-334c-9a6ec970.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9a6ec970-81e7-4b20-b2f4-352ac108befe";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "持光寺" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const senkoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "千光寺" } });
  const tenneiji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天寧寺三重塔" } });
  const ushitora = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "艮神社" } });
  const shotengai = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "尾道本通り商店街" } });
  const kinenkan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "尾道商業会議所記念館" } });
  const saikokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "西國寺" } });
  const jodoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "浄土寺" } });

  await setDaySpotOrder(day1.id, [
    { id: senkoji.id, data: {} },
    { id: tenneiji.id, data: {} },
    {
      id: ushitora.id,
      data: {
        memo:
          "天寧寺三重塔からは、「猫の細道」と呼ばれる細い坂道を歩いておよそ5分です。この小径には、尾道出身の画家が丸い石に猫の絵を描いた「福石猫」が随所に置かれ、道沿いの古民家を改修した店をのぞきながら歩くのも楽しみの一つです。細道の先にある艮神社は、大同元年(806)の創建と伝えられ、尾道で最初にできた神社ともいわれています。境内には、樹齢およそ900年で広島県の天然記念物に指定されているクスノキが4株そびえ、大きく枝を広げています。坂の町の細道をゆっくりとたどりながら、静かに、敬意をもってお参りください。続いては、歩いておよそ8分の持光寺へ向かいましょう。",
      },
    },
    {
      create: {
        name: "持光寺",
        address: "尾道市西土堂町9-2",
        lat: 34.4072384,
        lng: 133.195773,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 53)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 8,
        memo:
          "艮神社からは歩いておよそ8分です。持光寺は、寺宝の「絹本着色普賢延命菩薩画像」が国宝に指定されている古刹です。正面に構える大きな石の門は花崗岩造りで、全国的にも珍しいつくりとして知られています。粘土を握って仏の形をつくる「にぎり仏」の体験もでき、参拝とあわせて手を動かしてみるのもおすすめです。静かに、敬意をもってお参りください。続いては、歩いておよそ4分の光明寺へ向かいましょう。",
      },
    },
    {
      create: {
        name: "光明寺",
        address: "尾道市東土堂町2-8",
        lat: 34.408096,
        lng: 133.197952,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 27)),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 4,
        memo:
          "持光寺からは歩いておよそ4分です。光明寺は、木造千手観音立像(浪分観音)が国の重要文化財に指定されている古刹です。境内には、江戸時代から続く大相撲で第12代横綱をつとめた陣幕久五郎夫妻の墓や顕彰碑もあり、力士ゆかりの寺としても知られています。樹齢およそ400年と伝えられる尾道市天然記念物「蟠龍の松」や、樹齢およそ500年のシンパクなど、長い年月を経た木々も見どころです。静かに、敬意をもってお参りください。続いては、歩いておよそ9分の尾道本通り商店街へ向かいましょう。",
      },
    },
    {
      id: shotengai.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 1)),
        transitDurationMin: 9,
        memo:
          "光明寺からは歩いておよそ9分です。到着したら、このあたりで昼食をとりましょう。尾道本通り商店街は、江戸時代から港町として栄えた尾道の歴史とともに発展してきた商店街で、芙美子通り、土堂中通り、本町センター街、絵のまち通り、尾道通りの5つの通りからなり、全長はおよそ1.2kmにおよびます。近年は「猫の町」としても知られる尾道らしく、商店街のあちこちに猫をモチーフにした雑貨や土産物を扱う店も見られます。レトロな雰囲気漂うカフェや雑貨店をのぞきながら、坂の町・尾道ならではの散策を味わってみましょう。続いては、歩いておよそ9分の尾道商業会議所記念館へ向かいましょう。",
      },
    },
    { id: kinenkan.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 55)) } },
    {
      id: saikokuji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 34)),
        stayDurationMin: 50,
      },
    },
    {
      id: jodoji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 34)),
        stayDurationMin: 65,
        memo:
          "西國寺からは歩いておよそ10分です。浄土寺は、本堂と多宝塔が国宝に指定され、山門と阿弥陀堂も国の重要文化財に指定されている、尾道を代表する名刹です。本堂の内陣には、建武3年(1336)に足利尊氏が参籠したと伝わる「尊氏の参籠の間」が残されています。国の名勝に指定された庭園もあわせて拝観することができ、国宝の建物と庭園が織りなす景観を、静かに味わうことができます。静かに、敬意をもってお参りください。千光寺から浄土寺まで、坂の町・尾道をたっぷり歩いた1日も、ここで締めくくりです。帰りは、尾道駅までバスでおよそ10分です。海沿いの海岸通りを眺めながらのお帰りにご利用ください。",
      },
    },
  ]);
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

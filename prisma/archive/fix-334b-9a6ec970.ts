/**
 * #334の組み直し(その2)。企画運営2026-10-01 05:42・05:43、法務05:42の指摘に対応。
 *
 * 企画運営05:42: 尾道本通り商店街130分は水増し(40〜50分が目安)。昼食の
 * 一言が「本文に見当たらない」との指摘 → 実際には西國寺に入っていたが、
 * 寺の境内では昼食はとれないため、食事ができる場所(商店街)に移した。
 * 空いた時間は尾道商業会議所記念館(公式で確認、現存する商業会議所建築
 * としては日本最古の鉄筋コンクリート造と伝えられる)を追加。
 *
 * 順路を、千光寺→天寧寺三重塔→艮神社→尾道本通り商店街(昼食、45分に
 * 短縮)→尾道商業会議所記念館(新規)→西國寺→浄土寺(最後)に組み直した。
 * 昼食の到着は11:48で11:30〜13:30の枠に収まる。
 *
 * 法務05:42:
 * ① 尾道本通り商店街の写真(Onomichi_Jodoji_05.JPG)が実際には浄土寺の
 *    本堂・多宝塔の写真だったため、商店街から外し浄土寺に付け替えた
 *    (表紙(thumbnail_url)は同じURLの文字列のため変更不要)。
 * ② 西國寺「尾道有数の大寺の風格」→「尾道でも大きな寺として知られる
 *    風格」に言い切りを和らげた。
 * ③ 天寧寺三重塔の配慮の一文はそのままでよいとのこと(変更なし)。
 *
 * 企画運営05:43(法務の気づき): 浄土寺の「鎌倉幕府滅亡の際、足利尊氏が
 * …」は、尊氏が浄土寺に立ち寄ったのは建武3年(1336)、九州へ落ち延びる
 * 途中のことで、鎌倉幕府滅亡(1333)とは別の出来事だったため訂正
 * (出典: note.com/powerspot_168、onomichitokyoto.com等で確認)。
 *
 * 尾道商業会議所記念館の座標: 34.4065531,133.1982209(Nominatim名称一致、
 * way 307664164)。事実確認(尾道市公式等、直接確認): 大正期建築、現存する
 * 商業会議所建築としては日本最古の鉄筋コンクリート造と伝えられる。
 * 2〜3階吹き抜けの議場、大正モダニズムの代表的建造物。入館無料(本文には
 * 「無料」の語を使わない決まりのため記載していない)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-334b-9a6ec970.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9a6ec970-81e7-4b20-b2f4-352ac108befe";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "尾道商業会議所記念館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const senkoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "千光寺" } });
  const tenneiji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "天寧寺三重塔" } });
  const ushitora = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "艮神社" } });
  const shotengai = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "尾道本通り商店街" } });
  const saikokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "西國寺" } });
  const jodoji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "浄土寺" } });

  await setDaySpotOrder(day1.id, [
    { id: senkoji.id, data: {} },
    { id: tenneiji.id, data: {} },
    {
      id: ushitora.id,
      data: {
        memo:
          "天寧寺三重塔からは、「猫の細道」と呼ばれる細い坂道を歩いておよそ5分です。この小径には、尾道出身の画家が丸い石に猫の絵を描いた「福石猫」が随所に置かれ、道沿いの古民家を改修した店をのぞきながら歩くのも楽しみの一つです。細道の先にある艮神社は、大同元年(806)の創建と伝えられ、尾道で最初にできた神社ともいわれています。境内には、樹齢およそ900年で広島県の天然記念物に指定されているクスノキが4株そびえ、大きく枝を広げています。坂の町の細道をゆっくりとたどりながら、静かに、敬意をもってお参りください。続いては、歩いておよそ6分の尾道本通り商店街へ向かいましょう。",
      },
    },
    {
      id: shotengai.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 51)),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 6,
        memo:
          "艮神社からは歩いておよそ6分です。到着したら、このあたりで昼食をとりましょう。尾道本通り商店街は、江戸時代から港町として栄えた尾道の歴史とともに発展してきた商店街で、芙美子通り、土堂中通り、本町センター街、絵のまち通り、尾道通りの5つの通りからなり、全長はおよそ1.2kmにおよびます。近年は「猫の町」としても知られる尾道らしく、商店街のあちこちに猫をモチーフにした雑貨や土産物を扱う店も見られます。レトロな雰囲気漂うカフェや雑貨店をのぞきながら、坂の町・尾道ならではの散策を味わってみましょう。続いては、歩いておよそ9分の尾道商業会議所記念館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "尾道商業会議所記念館",
        address: "尾道市土堂1丁目8-8",
        lat: 34.4065531,
        lng: 133.1982209,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 45)),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 9,
        memo:
          "尾道本通り商店街からは歩いておよそ9分です。尾道商業会議所記念館は、大正時代に建てられた、現存する商業会議所建築としては日本最古の鉄筋コンクリート造と伝えられる建物です。2階から3階にかけて吹き抜けとなった議場は、階段状の座席が今も残り、直線的なデザインが際立つ、大正モダニズムを代表する建築です。館内では、尾道の商業の歴史にまつわる資料を見ることができます。レトロな建物が点在する尾道らしい、大正時代の面影を感じてみましょう。続いては、歩いておよそ14分の西國寺へ向かいましょう。",
      },
    },
    {
      id: saikokuji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 24)),
        stayDurationMin: 70,
        transitMode: "walk",
        transitDurationMin: 14,
        memo:
          "尾道商業会議所記念館からは歩いておよそ14分です。西國寺は、天平年間(729〜749)、行基菩薩の開基と伝えられる、真言宗醍醐派の大本山です。参道の仁王門は広島県の重要文化財に指定されており、門の両脇には、健脚を願って奉納されたという、2mを超える大きな草鞋が掛けられています。石段を上った先の金堂は国の重要文化財に指定されており、足利6代将軍・義教が寄進したと伝えられる三重塔とあわせて、室町時代の趣を今に伝えています。108段の石段を上り下りしながら、尾道でも大きな寺として知られる風格を味わってみましょう。静かに、敬意をもってお参りください。続いては、歩いておよそ10分の浄土寺へ向かいましょう。",
      },
    },
    {
      id: jodoji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 44)),
        stayDurationMin: 110,
        memo:
          "西國寺からは歩いておよそ10分です。浄土寺は、本堂と多宝塔が国宝に指定され、山門と阿弥陀堂も国の重要文化財に指定されている、尾道を代表する名刹です。本堂の内陣には、建武3年(1336)、九州へ落ち延びる途中にこの地に立ち寄った足利尊氏が、戦勢の立て直しを祈願したと伝えられる「尊氏の参籠の間」が残されています。国の名勝に指定された庭園もあわせて拝観することができ、国宝の建物と庭園が織りなす景観を、静かに味わうことができます。静かに、敬意をもってお参りください。千光寺から浄土寺まで、坂の町・尾道をたっぷり歩いた1日も、ここで締めくくりです。帰りは、尾道駅までバスでおよそ10分です。海沿いの海岸通りを眺めながらのお帰りにご利用ください。",
      },
    },
  ]);

  // 商店街の誤った写真(実際は浄土寺の写真)を浄土寺へ付け替え
  const photo = await prisma.photo.findFirst({ where: { spotId: shotengai.id } });
  if (photo) {
    await prisma.photo.update({ where: { id: photo.id }, data: { spotId: jodoji.id } });
    console.log("photo reassigned:", photo.id);
  } else {
    console.log("photo already reassigned or none found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

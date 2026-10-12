/**
 * #335の続き。企画運営2026-10-01 06:06の指摘に対応。
 *
 * 1) 乗り物: 車3区間(鉄輪→血の池地獄・血の池地獄→明礬・明礬→竹瓦温泉)を、
 *    どこで借りるかの説明もなく使っていた。別府は地獄めぐりを走る実在の
 *    路線バス(亀の井バス)があるため、すべてバスに変更。鉄輪⇔血の池地獄は
 *    16番系統(およそ6分)、別府駅⇔鉄輪は1・2・5・7・41番系統(およそ17分)、
 *    鉄輪⇔明礬はおよそ7分(公式・べっぷぅ~に等で確認)。乗り継ぎ・待ち時間を
 *    含めた現実的な時間として、少し余裕を持たせた分数にしている。
 * 2) 竹瓦温泉95分(入浴・砂湯で60〜70分が目安)は水増し。65分に戻し、
 *    空いた時間は竹瓦小路(竹瓦温泉のすぐ隣、大正10年(1921)完成の現存する
 *    木造アーケード、近代化産業遺産、公式・るるぶ&more.等で確認。#475と
 *    行き先が重なってもよいとのことだが、本文は書き写さず独自に作成)を
 *    追加して埋めた。
 *
 * 竹瓦小路の座標: 33.277391,131.505907(竹瓦温泉の向かいのため、ほぼ
 * 同一地点。Nominatim名称一致の検索結果がなかったため、竹瓦温泉の座標に
 * ごく近い値を使用)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-335b-9c656920.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "9c656920-3b82-425e-915c-1caa49ba9e47";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "竹瓦小路" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const umi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "海地獄" } });
  const onishi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "鬼石坊主地獄" } });
  const kamado = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "かまど地獄" } });
  const oniyama = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "鬼山地獄" } });
  const shiraike = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白池地獄" } });
  const jigokumushi = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "地獄蒸し工房鉄輪" } });
  const chinoike = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "血の池地獄" } });
  const tatsumaki = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "龍巻地獄" } });
  const myoban = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "明礬湯の花小屋" } });
  const takegawara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "竹瓦温泉" } });

  await setDaySpotOrder(day1.id, [
    { id: umi.id, data: {} },
    { id: onishi.id, data: {} },
    { id: kamado.id, data: {} },
    {
      id: oniyama.id,
      data: {
        memo:
          "かまど地獄からは歩いておよそ2分です。鬼山地獄は、摂氏99度に達する高温の池が特徴の地獄です。大正12年(1923)、日本で初めて温泉熱を利用したワニの飼育を始めたと伝えられ、「ワニ地獄」の愛称でも親しまれています。現在も、クロコダイルやアリゲーターなど数十頭のワニが、温泉の恵みを受けて飼育されています。柵から身を乗り出したり手を入れたりせず、えさをあげないようにしましょう。熱帯の生き物が育つ意外な光景も、あわせて眺めてみましょう。続いては、歩いておよそ2分の白池地獄へ向かいましょう。",
      },
    },
    { id: shiraike.id, data: {} },
    { id: jigokumushi.id, data: {} },
    {
      id: chinoike.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 9)),
        transitMode: "bus",
        transitDurationMin: 10,
        memo:
          "地獄蒸し工房鉄輪からは、バスでおよそ10分です。鉄輪から血の池地獄・明礬方面へは、亀の井バスの路線バスが走っているので、これを利用して移動します。血の池地獄は、『豊後国風土記』にすでに「赤湯泉」として記録が残る、1300年以上の歴史を持ち、日本最古の天然地獄とも伝えられています。鮮やかな赤色は、地中深くの高温・高圧の環境で、酸化鉄や酸化マグネシウムを含む赤土が化学反応を起こし、熱泥となって湧き上がることで生まれています。まるで血の池のような、他に類を見ない独特の景観は、古くから人々を驚かせ、畏怖の念を抱かせてきたと伝えられています。海地獄の青とはまったく異なる、燃えるような赤の絶景を、あわせて眺めてみましょう。続いては、歩いておよそ2分の龍巻地獄へ向かいましょう。",
      },
    },
    {
      id: tatsumaki.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 41)),
        memo:
          "血の池地獄からは歩いておよそ2分です。龍巻地獄は、一定の間隔で熱湯と噴気を激しく噴き上げる間欠泉です。自然の力で噴出するため、噴出の間隔や高さは毎回異なり、待っている間の緊張感も楽しみの一つです。噴出時には熱湯が飛ぶことがあるので、係員の案内に従い、柵の内側から見学しましょう。続いては、バスでおよそ15分の明礬湯の花小屋へ向かいましょう。",
      },
    },
    {
      id: myoban.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 16)),
        transitMode: "bus",
        transitDurationMin: 15,
        memo:
          "龍巻地獄からは、バスでおよそ15分です。明礬湯の花小屋は、江戸時代から続く伝統的な製法で「湯の花」をつくる小屋が立ち並ぶ一帯です。温泉の蒸気が青粘土の層を通る中で化学反応が起き、石綿のような結晶となって育つ様子を、カヤぶき屋根の小屋の中で見ることができます。この製法は国の重要無形民俗文化財に、小屋が立ち並ぶ景観は国の重要文化的景観に指定されています。湯の花は1日およそ1ミリずつ成長し、40日から60日ほどかけて採取されると伝えられています。もうもうと立ちのぼる湯けむりに包まれた、独特の景観を眺めてみましょう。続いては、バスでおよそ20分の竹瓦小路へ向かいましょう。",
      },
    },
    {
      create: {
        name: "竹瓦小路",
        address: "別府市元町14",
        lat: 33.277391,
        lng: 131.505907,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 11)),
        stayDurationMin: 30,
        transitMode: "bus",
        transitDurationMin: 20,
        memo:
          "明礬湯の花小屋からは、バスでおよそ20分です。竹瓦小路は、大正10年(1921)に完成した、現存する木造アーケードとして知られる通りです。かつて別府港に上陸した湯治客が、雨に濡れずに竹瓦温泉まで歩けるようにと整備されました。南北におよそ60mのアーケードには飲食店が軒を連ね、平成21年(2009)には、別府温泉にまつわる近代化産業遺産の一つにも認定されています。日が暮れると竹細工の灯りがともり、昼とはまた違う趣を見せてくれます。レトロな町並みを、ゆっくりと歩いてみましょう。続いては、すぐそばの竹瓦温泉へ向かいましょう。",
      },
    },
    {
      id: takegawara.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 43)),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 2,
        memo:
          "竹瓦小路からは、すぐそばです。竹瓦温泉は、別府温泉を代表する共同浴場で、唐破風造りの堂々とした木造建築は、別府のシンボルの一つとして親しまれています。黒い砂の中に横たわり、上から砂をかけてもらう「砂湯」でも知られ、天然のサウナのような温もりを味わうことができます。浴場では、ほかの方が写らないよう撮影は控え、静かに過ごし、長湯を避けて水分をとりながら楽しみましょう。地獄めぐりで見てきた数々の色とりどりの湯を、最後は自分の肌で確かめてみましょう。別府地獄めぐり、極彩色の温泉地獄を巡る1日も、ここで締めくくりです。帰りは、JR別府駅まで歩いておよそ10分です。そこから電車でのお帰りにご利用ください。",
      },
    },
  ]);

  // 海地獄の写真(実際は血の池地獄の写真)を削除。血の池地獄に同じ写真が
  // あるため付け替えは不要(表紙はそのままでよいとのこと)。
  const wrongPhoto = await prisma.photo.findFirst({ where: { spotId: umi.id } });
  if (wrongPhoto) {
    await prisma.photo.delete({ where: { id: wrongPhoto.id } });
    console.log("wrong photo removed from 海地獄:", wrongPhoto.id);
  } else {
    console.log("no photo on 海地獄 (already removed)");
  }

  // 説明文「日本一の湧出量を誇る」に言い切りヘッジを追加
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "日本一の湧出量を誇る別府温泉の定番プランです。";
  const newDesc = "日本一ともいわれる湧出量を誇る別府温泉の定番プランです。";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(oldDesc, newDesc) } });
    console.log("description hedged");
  } else {
    console.log("description already hedged or text not found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

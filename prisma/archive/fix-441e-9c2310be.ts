/**
 * #441 9c2310be の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」、昼食と帰りの一言）
 * 2日目（車）: 萩反射炉 → 恵美須ヶ鼻造船所跡 → 明神池 → 笠山 →（越ヶ浜で昼食）→ 東光寺（新規）→ 吉田松陰誕生地（新規）→ 松陰神社・松下村塾（新規）→ 伊藤博文旧宅・別邸（新規）（8か所 09:00〜16:30）
 *   東光寺 8:30〜17:00、伊藤博文旧宅・別邸 9:00〜17:00（萩市観光協会）。本文に時刻は書かない
 * 本文の出典: 萩市観光協会 https://www.hagishi.com/search/detail.php?d=N（東光寺 100073／吉田松陰誕生地 100010／松陰神社 100007／松下村塾 100009／伊藤博文旧宅 100012／伊藤博文別邸 100013）
 * 座標の出典: OSM（東光寺 node 4354914290 34.4133065,131.4247590／松下村塾 way 555592247 34.412150,131.417335）、
 *   地理院の住所検索（伊藤博文旧宅「椿東1515」34.411201,131.417419／吉田松陰誕生地「椿東1433」34.410221,131.424149。どちらも OSM に点がないため）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-441e-9c2310be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9c2310be-66b4-4b74-a67f-481c454404a5";
const DAY2_ID = "33701db1-425d-413c-80db-2dbdedffac0f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["萩反射炉", "恵美須ヶ鼻造船所跡", "明神池", "笠山"].join()) throw new Error("2日目が想定と違います");
  const kasa = day.spots[3];
  const kasaMemo = rep(rep(kasa.memo ?? "", "旅の締めくくりは笠山へ。", "明神池から車で笠山へ。"), "萩の旅を、ここで締めくくりましょう。", "このあと、ふもとの越ヶ浜のあたりで昼食にしましょう。");
  const description = rep(it.description ?? "", "椿の群生林がある小さな火山・笠山へ。", "椿の群生林がある小さな火山・笠山をめぐり、午後は毛利家の菩提寺・東光寺、吉田松陰ゆかりの誕生地・松陰神社・松下村塾、伊藤博文旧宅へ。");

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: kasa.id, data: { memo: kasaMemo } },
    { create: { name: "東光寺", visitTime: t(13, 20), stayDurationMin: 40, transitMode: "car", transitDurationMin: 20, transitLine: null, lat: 34.413307, lng: 131.424759, address: "山口県萩市椿東1647",
      memo: "昼食のあとは、車で萩の東の松本地区にある東光寺へ。元禄4年（1691年）に萩藩3代藩主・毛利吉就が創建した黄檗宗の寺で、大照院とならぶ毛利家の菩提寺です。総門・三門・鐘楼・大雄宝殿は国の重要文化財に指定されています。本堂の裏には、3代吉就から11代までの奇数代の藩主とその夫人らの墓所（国の史跡）があり、墓前には藩士が寄進した500余基の石灯籠が並んでいます。" + RESPECT } },
    { create: { name: "吉田松陰誕生地", visitTime: t(14, 10), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.410221, lng: 131.424149, address: "山口県萩市椿東1433-1",
      memo: "東光寺から歩いて、吉田松陰誕生地へ。松陰は天保元年（1830年）に、萩藩士・杉百合之助の次男としてこの地で生まれました。萩の市内を一望できる「団子岩」とよばれる高台にあり、そばには、松陰と金子重輔が下田の海岸でペリー艦隊を望む姿の銅像が立っています。坂道を歩くので、足元に気をつけましょう。" } },
    { create: { name: "松陰神社・松下村塾", visitTime: t(14, 55), stayDurationMin: 50, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 34.41215, lng: 131.417335, address: "山口県萩市椿東",
      memo: "東光寺の駐車場へ戻り、車で松陰神社へ。吉田松陰をまつる神社で、明治40年（1907年）に創建されました。境内には、松陰が主宰した私塾・松下村塾が残っています。木造瓦葺き平屋建ての50㎡ほどの小さな建物で、松陰は身分にとらわれず塾生を受け入れ、わずか1年余りの間に、高杉晋作や伊藤博文など多くの人材が学びました。松下村塾は世界遺産にも登録されています。" + RESPECT } },
    { create: { name: "伊藤博文旧宅・別邸", visitTime: t(15, 55), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.411201, lng: 131.417419, address: "山口県萩市椿東1515",
      memo: "松陰神社から歩いて、伊藤博文旧宅へ。初代内閣総理大臣・伊藤博文が、明治元年（1868年）に兵庫県知事となるまでの本拠とした木造茅葺き平屋建ての家で、国の史跡です。隣の別邸は、伊藤博文が明治40年（1907年）に東京に建てた邸宅の一部を移築したもので、大広間の廊下の鏡天井などに明治の宮大工の技が見られます。萩の城下町と自然、維新の歴史をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返す場所まで安全運転で。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`笠山: ${kasaMemo.slice(0, 30)}…${kasaMemo.slice(-40)}`);
  console.log("2日目: 反射炉 09:00 → 造船所跡 → 明神池 → 笠山 10:50〜12:00 →（昼食）→（車20分）東光寺 13:20〜14:00 → 誕生地 14:10〜14:35 →（車）松陰神社・松下村塾 14:55〜15:45 → 伊藤博文旧宅・別邸 15:55〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY2_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

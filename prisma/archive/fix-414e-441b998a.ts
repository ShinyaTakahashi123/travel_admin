/**
 * #414 441b998a の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 最終日も16:30まで、決まり8「バス・電車がある区間はタクシーにしない」、宿・帰りの一言）
 * 1日目: …龍馬の生まれたまち記念館 →（路面電車）高知市立自由民権記念館 →（路面電車）横山隆一記念まんが館（宿の一言を足す）
 * 2日目: はりまや橋 →（MY遊バス）竹林寺 → 五台山公園展望テラス → 高知県立牧野植物園（昼食）→（MY遊バス）高知県立坂本龍馬記念館（新規）→ 桂浜（新規）（6か所 09:00〜16:30）
 *   MY遊バスは JR高知駅・はりまや橋・竹林寺前・牧野植物園正門前・桂浜などに停まる（こうち旅ネット）。路面電車は、自由民権記念館は桟橋車庫前、かるぽーとは菜園場町が最寄り
 *   龍馬記念館 9:00〜17:00（入館16:30まで）
 * 本文の出典: 高知市 https://www.city.kochi.kochi.jp/site/kanko/sakamotoryoumakinenkan.html ・/site/kanko/katsurahamakouen.html 、こうち旅ネット https://kochi-tabi.jp/my-bus/ 、
 *   高知市 自由民権記念館 https://www.city.kochi.kochi.jp/site/kanko/kinenkan.html 、かるぽーと アクセス https://www.bunkaplaza.or.jp/information/access/
 * 座標の出典: OSM（高知県立坂本龍馬記念館 way 250513019 33.496371,133.571918／桂浜 way 44407519 33.497159,133.575425）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-414e-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const DAY1_ID = "c56a49e0-4fb8-4b5c-bf0c-ac9ccfa49c27";
const DAY2_ID = "291317c4-4965-4aaf-8322-4d4289b48096";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const TRAM = "とさでん交通 路面電車";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("構成が想定と違います");
  const d1 = days[0].spots, d2 = days[1].spots;
  if (d1.map((s) => s.name).join() !== ["日曜市（高知）", "高知県立文学館", "ひろめ市場（昼食）", "龍馬の生まれたまち記念館", "高知市立自由民権記念館", "横山隆一記念まんが館"].join()) throw new Error("1日目が想定と違います");
  if (d2.map((s) => s.name).join() !== ["はりまや橋", "竹林寺", "五台山公園展望テラス", "高知県立牧野植物園（昼食）"].join()) throw new Error("2日目が想定と違います");

  const minken = d1[4], manga = d1[5];
  const minkenMemo = rep(minken.memo ?? "", "龍馬の生まれたまち記念館から車で約15分。", "記念館近くの上町一丁目電停から路面電車に乗り、はりまや橋で桟橋線に乗り換えて桟橋車庫前電停へ。");
  const mangaMemo = rep(
    rep(manga.memo ?? "", "自由民権記念館から車で約10分、高知市文化プラザかるぽーとの中にあります。", "路面電車ではりまや橋へ戻り、後免線に乗り換えて菜園場町電停へ。歩いて約3分の高知市文化プラザかるぽーとの中にあります。"),
    "休館日は公式の案内で確かめてから訪れましょう。", "休館日は公式の案内で確かめてから訪れましょう。今夜は高知の街なかに泊まります。");
  const [hari, chiku, tenbo, makino] = d2;
  const chikuMemo = rep(chiku.memo ?? "", "はりまや橋から車で約15分、", "はりまや橋からMY遊バスで約20分、");
  const descNew = rep(it.description ?? "", "牧野植物園で植物と昼食を楽しむ、高知の街なかの暮らしと文化にふれる1泊2日です。", "牧野植物園で植物と昼食を楽しんだら、午後はMY遊バスで桂浜へ。坂本龍馬記念館と月の名所の桂浜を訪ねる、高知の街なかの暮らしと文化にふれる1泊2日です。");

  const day1 = [
    ...d1.slice(0, 4).map((s) => ({ id: s.id, data: {} })),
    { id: minken.id, data: { memo: minkenMemo, visitTime: t(14, 45), stayDurationMin: 60, transitMode: "train", transitDurationMin: 25, transitLine: TRAM } },
    { id: manga.id, data: { memo: mangaMemo, visitTime: t(16, 5), stayDurationMin: 45, transitMode: "train", transitDurationMin: 20, transitLine: TRAM } },
  ];
  const day2 = [
    { id: hari.id, data: {} },
    { id: chiku.id, data: { memo: chikuMemo, visitTime: t(9, 50), stayDurationMin: 60, transitMode: "bus", transitDurationMin: 20, transitLine: "MY遊バス" } },
    { id: tenbo.id, data: { visitTime: t(11, 0), stayDurationMin: 30 } },
    { id: makino.id, data: { visitTime: t(11, 40), stayDurationMin: 120 } },
    { create: { name: "高知県立坂本龍馬記念館", visitTime: t(14, 15), stayDurationMin: 65, transitMode: "bus", transitDurationMin: 35, transitLine: "MY遊バス", lat: 33.496371, lng: 133.571918, address: "高知県高知市浦戸城山830",
      memo: "牧野植物園正門前からMY遊バスで桂浜へ。桂浜公園の中に建つ高知県立坂本龍馬記念館は、坂本龍馬に関する歴史資料をわかりやすく展示し、その人柄や業績、考え方も紹介する「龍馬への入口」ともいえる記念館です。1991年、龍馬の誕生日に開館し、2018年にリニューアルしました。「空白のステージ」や屋上の展望からは、太平洋の水平線を一望できます。" } },
    { create: { name: "桂浜", visitTime: t(15, 30), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.497159, lng: 133.575425, address: "高知県高知市浦戸",
      memo: "記念館から歩いて、雄大な太平洋に面した桂浜へ。月の名所としても名高く、よさこい節にも唄われている景勝地です。浜辺は波の変化が激しく、急に深くなっているので、波打ち際には近づかないようにしましょう。土佐の街と海をめぐる旅を、ここで締めくくりましょう。帰りは、MY遊バスか路線バスで高知駅・はりまや橋へ戻ります。最終便の時刻は公式の案内で確かめましょう。" } },
  ];
  console.log(`説明文: ${descNew}`);
  console.log(`自由民権: ${minkenMemo.slice(0, 60)}…`);
  console.log(`まんが館: ${mangaMemo.slice(0, 60)}…${mangaMemo.slice(-30)}`);
  console.log(`竹林寺: ${chikuMemo.slice(0, 40)}…`);
  console.log("1日目: …龍馬の生まれたまち記念館 13:20〜14:20 →（電車25分）自由民権記念館 14:45〜15:45 →（電車20分）まんが館 16:05〜16:50");
  console.log("2日目: はりまや橋 09:00 →（MY遊バス20分）竹林寺 09:50 → 展望テラス 11:00 → 牧野植物園 11:40〜13:40（昼食）→（MY遊バス35分）龍馬記念館 14:15〜15:20 → 桂浜 15:30〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: descNew } });
    await setDaySpotOrder(DAY1_ID, day1, { tx });
    await setDaySpotOrder(DAY2_ID, day2, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

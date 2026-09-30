/**
 * #380 e1871a37「野口英世記念館と磐梯山噴火記念館、猪苗代の偉人と自然史1泊2日」の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指示「平日にも成り立つ便で組み直す」）
 * 見つかった誤り:
 *   - 1日目: 「猪苗代駅から会津バスで野口英世記念館前へ」9:00着 → 平日の金の橋線は猪苗代駅9:28発が最初。周遊バス「ひでよくん号」は7/18〜11/8の土日祝だけ
 *     記念館前→長浜のバス（11時台）も周遊バス頼みだった。土津神社は「猪苗代駅から徒歩約20分」→ 実際は約2.6km（約40分）
 *   - 2日目: 五色沼を11:40に出て13:20に七日町着 → 裏磐梯高原駅は11:26の次が13:26。「噴火記念館の近くの五色沼入口」→ 実際は約1.1km離れている
 * 直し方（旅の足はバス・電車・歩き。タクシーは朝の猪苗代駅→記念館だけ、理由を本文に）:
 *   1日目: （タクシー）野口英世記念館 9:00 → 会津民俗館 →（湖岸の道を歩いて約35分）天鏡閣 → 長浜（昼食）→（金の橋線 長浜13:49→亀ヶ城入口）亀ヶ城公園 → 土津神社 → はじまりの美術館 16:40（猪苗代泊）
 *   2日目: （猪苗代駅8:15のバス→噴火記念館前）磐梯山噴火記念館 9:00 → 五色沼自然探勝路（五色沼入口から西へ、裏磐梯高原駅11:26のバス）→ 猪苗代駅前（新規・昼食）
 *          →（磐越西線12:52→会津若松13:20、周遊バス）七日町通り → 鶴ヶ城 → 御薬園 16:50。帰りは周遊バスで会津若松駅へ
 *   冬は噴火記念館が平日休み（12〜3月は土日祝など）、会津民俗館が休みがち、五色沼は雪の装備が要る、湖岸を歩くので、季節から冬を外し、本文の冬の一文も消す
 * 時刻の出典（NAVITIME 2026-09-30 平日）: 猪苗代駅→記念館前 https://www.navitime.co.jp/bus/diagram/timelist?departure=00026527&arrival=00385725&line=00032705 （9:28が最初）・
 *   長浜発 https://www.navitime.co.jp/diagram/bus/00385698/00032705/1/ （13:49。北窪行きで猪苗代駅・亀ヶ城入口を通る。停留所の順 https://www.navitime.co.jp/bus/company/00001098/route/00032705/ ）・
 *   猪苗代駅→五色沼入口 https://www.navitime.co.jp/bus/diagram/timelist?departure=00026527&arrival=00385639&line=00032701 （8:15→8:46、この先 噴火記念館前・裏磐梯高原駅）・
 *   裏磐梯高原駅発 https://www.navitime.co.jp/diagram/bus/00385730/00032701/0/ （11:26）・猪苗代→会津若松 https://www.navitime.co.jp/diagram/depArrTimeList?departure=00006159&arrival=00001138&line=00000199&updown=1 （12:52→13:20）・
 *   ひでよくん号 https://www.aizubus.com/sightseeing/bus/hideyokun ・噴火記念館の冬の開館 https://www.jalan.net/kankou/spt_07402cc3290031709/ （検索結果の要約）
 * 座標: 亀ヶ城公園は OSM node 2981137627、土津神社は OSM way 1422837188、猪苗代駅前は OSM 猪苗代駅 node 263083428 に取り直す（ほかは前のまま）
 * 猪苗代駅の近くの食事の店: 猪苗代観光協会 https://www.bandaisan.or.jp/category/eat/ ほか（店名は書かない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-380b-e1871a37.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e1871a37-9b27-41af-86b5-3d71a64ec4f9";
const DAY1_ID = "028c8948-0d6b-4125-97d0-eaf8a30614a1";
const DAY2_ID = "5109f915-664b-4f0c-93da-c645a6b1a9a9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// [名前, 時, 分, 滞在, 手段, 移動分, 路線, 置き換え[旧,新][], 座標?]
type R = [string, number, number, number, string | null, number | null, string | null, [string, string][], [number, number]?];
const D1: R[] = [
  ["野口英世記念館", 9, 0, 65, null, null, null, [["猪苗代駅から会津バスで野口英世記念館前へ、降りてすぐです。", "朝の早い時間は記念館へのバスの便がないので、猪苗代駅からタクシーで約10分です。"]]],
  ["会津民俗館", 10, 10, 30, "walk", 5, null, [["休館日は季節によって変わり、冬は休む日が多くなるので、公式の案内で確かめてから訪れましょう。", "休館日は公式の案内で確かめてから訪れましょう。"]]],
  ["天鏡閣", 11, 15, 60, "walk", 35, null, [["長浜のバス停から歩いて約10分、猪苗代湖を見下ろす丘に立つ洋館です。", "民俗館から、猪苗代湖の岸の道を西へ歩いて約35分。湖を見下ろす丘に立つ洋館です。"]]],
  ["長浜（猪苗代湖）", 12, 25, 75, "walk", 10, null, [["湖に入るときや岸辺を歩くときは、", "次のバスの時刻まで、湖畔でゆっくり過ごしましょう。湖に入るときや岸辺を歩くときは、"]]],
  ["亀ヶ城公園", 14, 10, 35, "bus", 30, "会津バス（長浜→亀ヶ城入口。猪苗代駅を通る）", [["土津神社から歩いて約15分。", "長浜のバス停から北窪行きのバスに乗り、猪苗代駅を通って亀ヶ城入口で降ります。"]], [37.5613975, 140.103793]],
  ["土津神社", 15, 0, 45, "walk", 15, null, [["バスで猪苗代駅に戻り、歩いて約20分。", "亀ヶ城公園から北へ歩いて約15分。"]], [37.5701004, 140.1006132]],
  ["はじまりの美術館", 16, 0, 40, "walk", 15, null, [["亀ヶ城公園から歩いて約10分。", "土津神社から町なかへ歩いて約15分。"]]],
];
const D2: R[] = [
  ["磐梯山噴火記念館", 9, 0, 45, null, null, null, [["猪苗代駅から裏磐梯方面のバスでおよそ30分です。", "猪苗代駅から裏磐梯方面のバスで約35分、磐梯山噴火記念館前で降りてすぐです。"]]],
  ["五色沼自然探勝路", 10, 0, 80, "walk", 15, null, [
    ["噴火記念館の近くの五色沼入口から、", "記念館から東へ歩いて約15分の五色沼入口から、西の裏磐梯高原駅まで、"],
    ["遊歩道から外れず、足元に気をつけて歩きましょう。冬は雪に覆われ、スノーシューなどの装備が要るので、公式の案内で確かめてください。", "遊歩道から外れず、足元に気をつけて歩きましょう。探勝路の終わりは、柳沼のそばの裏磐梯高原駅です。"],
  ]],
  ["猪苗代駅前", 12, 10, 35, "bus", 50, "会津バス（裏磐梯高原駅→猪苗代駅、約40分）", []],
  ["七日町通り", 13, 35, 55, "train", 50, "JR磐越西線（猪苗代→会津若松、約30分）・まちなか周遊バス（会津若松駅→七日町）", [
    ["柳沼のそばの裏磐梯高原駅からバスで猪苗代駅へ戻り、JR磐越西線で会津若松へ。", "猪苗代駅からJR磐越西線で約30分の会津若松駅へ出て、周遊バスで七日町へ。"],
    ["手打ちそばや田楽の店も多いので、ここで昼食にしましょう。", "蔵や商家の店先をのぞきながら、ゆっくり歩きましょう。"],
  ]],
  ["鶴ヶ城", 14, 45, 75, "bus", 15, "まちなか周遊バス（七日町→鶴ヶ城）", []],
  ["御薬園", 16, 20, 30, "walk", 20, null, [["2日間の旅はここで締めくくりです。", "帰りは周遊バスで会津若松駅へ。2日間の旅はここまでです。"]]],
];
const MEMO_EKIMAE = "裏磐梯高原駅からバスで約40分、猪苗代駅へ戻ります。駅の近くには食事のできる店もあるので、会津若松へ向かう電車を待つあいだに、ここで昼食にしましょう。";

const DESCRIPTION_OLD_WINTER = /冬/;

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] 季節 ${it.seasons.join(",")}`);
  if (it.days.map((d) => d.id).join() !== [DAY1_ID, DAY2_ID].join()) throw new Error("日の構成が想定と違います");
  if (DESCRIPTION_OLD_WINTER.test(it.description ?? "")) console.log("⚠ 説明文に「冬」があります");
  const build = (day: (typeof it.days)[number], rows: R[]) =>
    rows.map(([name, h, m, stay, mode, min, line, pairs, ll]) => {
      const base = { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: min, transitLine: line };
      if (name === "猪苗代駅前") return { create: { name, ...base, lat: 37.5463239, lng: 140.1032381, address: "福島県耶麻郡猪苗代町字千代田", memo: MEMO_EKIMAE } };
      const found = day.spots.filter((s) => s.name === name);
      if (found.length !== 1) throw new Error(`${name} が ${found.length} 件`);
      let memo = found[0].memo ?? "";
      for (const [o, n] of pairs) {
        if (!memo.includes(o)) throw new Error(`本文が想定と違います: ${name}`);
        memo = memo.replace(o, n);
      }
      return { id: found[0].id, data: { ...base, memo, ...(ll ? { lat: ll[0], lng: ll[1] } : {}) } };
    });
  const day1 = build(it.days[0], D1);
  const day2 = build(it.days[1], D2);
  if (day1.length !== it.days[0].spots.length || day2.length !== it.days[1].spots.length + 1) throw new Error("スポットの数が想定と違います");
  const hm = (x: number) => `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
  for (const [label, arr, rows] of [["1日目", day1, D1], ["2日目", day2, D2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    arr.forEach((x, i) => {
      const [name, h, m, stay, mode, min] = rows[i];
      const st = h * 60 + m;
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + stay)} ${mode ?? "-"}${gap} ${name}`);
      console.log(`   ${"id" in x ? x.data.memo : x.create.memo}`);
      prevEnd = st + stay;
    });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { seasons: ["spring", "summer", "autumn"] } });
      await setDaySpotOrder(DAY1_ID, day1 as never, { tx });
      await setDaySpotOrder(DAY2_ID, day2 as never, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

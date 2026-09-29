/**
 * チェックリスト #403 05da3252「三段壁と千畳敷、白浜の絶景海岸を巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。三段壁 → 千畳敷 → 崎の湯 → 白良浜（昼食）→ 円月島 → 京都大学白浜水族館 → 南方熊楠記念館（7か所 09:00〜16:30）
 * 既存の3か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあり、「千畳敷は三段壁の南側」は地図では北側で誤りだったので書き直す）
 * 既存の写真（三段壁の断崖・円月島）は目で見て合っているので残す
 * 座標の出典: Nominatim（三段壁 natural=cliff 33.6654412,135.3352178／千畳敷 natural=bare_rock 33.6708228,135.3304703／崎の湯 33.6769556,135.3370223／
 *   白良浜 33.6816194,135.3446904／円月島(高嶋) 33.6900590,135.3364589／京都大学白浜水族館 33.6927802,135.3375243／南方熊楠記念館 33.6936902,135.3361146）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-403-05da3252.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "05da3252-800c-4e58-ac4c-0dd2bdcd1369";
const DAY1_ID = "b87718ee-30de-40cc-b843-6cb682666827";
const SANDANBEKI_ID = "7b9a6669-3669-48a8-8b24-e2496b83a6f9";
const SENJOJIKI_ID = "828f98e1-35b4-4e76-aabe-57585531763a";
const ENGETSU_ID = "2ba82ef4-f10a-48a0-87b0-1e89f4506c78";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "南北に続く断崖の三段壁と、白い砂岩が広がる千畳敷をめぐり、海を目の前にした露天風呂・崎の湯へ。真っ白な砂の白良浜で昼食をとってから、白浜のシンボル・円月島を眺め、無脊椎動物の展示で知られる京都大学白浜水族館と、博物学者・南方熊楠の記念館を訪ねる、白浜の海岸を車でめぐる日帰りプランです。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });
const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});

const order = [
  upd(SANDANBEKI_ID, 9, 0, 50, null, null, 33.665441, 135.335218,
    "南北約2kmにわたって続く、高さ約50mの壮大な岩壁です。打ち寄せる波しぶきは迫力があります。地下には「三段壁洞窟」があり、エレベーターで地下36mまで下りて洞窟を見学できます。洞窟は源平合戦で源氏に加勢した熊野水軍の舟隠し場として知られ、番所小屋も再現されています。洞窟の中には牟婁大辯才天がまつられているので、静かに、敬意をもってお参りしましょう。断崖の上では、柵の外には出ず、足元に気をつけて景色を楽しみましょう。"),
  upd(SENJOJIKI_ID, 10, 0, 40, "car", 10, 33.670823, 135.33047,
    "三段壁から車で約10分、北へ少し戻った海岸です。約1800万年前から1500万年前に積もった砂岩が、長い年月をかけて波に削られてできた広い岩盤で、まるで畳を千枚も敷けるような広さであることから名付けられたとされています。白く柔らかい岩が太平洋に向かって広がり、波しぶきと岩の白さの対比が見事です。岩は滑りやすく、波をかぶることもあるので、海の近くまで行かず、足元に気をつけて歩きましょう。"),
  cre({
    name: "崎の湯", h: 10, m: 55, stay: 45, mode: "car", dur: 15, lat: 33.676956, lng: 135.337022, address: "和歌山県西牟婁郡白浜町1668",
    memo:
      "千畳敷から車で約15分。万葉の時代から受け継がれてきたと伝わる、歴史のある露天風呂です。自然に削られてできた大きな岩風呂からは、目の前に迫る海と波しぶきを間近に感じられます。お湯が海に流れるため、シャンプーや石けんは使えません。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。臨時に休むこともあるので、公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "白良浜（昼食）", h: 11, m: 50, stay: 70, mode: "car", dur: 10, lat: 33.681619, lng: 135.34469, address: "和歌山県西牟婁郡白浜町",
    memo:
      "崎の湯から車で約10分。その名のとおり、さらさらの真っ白な砂がおよそ620m続くビーチで、白い砂と海のエメラルドグリーンの対比が美しく、浜辺に並ぶヤシの木が南国のような雰囲気です。「日本の快水浴場百選」にも選ばれています。まわりの食事処で昼食をとり、浜辺を歩いてみましょう。泳ぐときは海水浴の期間と監視員がいる場所を確かめましょう。",
  }),
  upd(ENGETSU_ID, 13, 15, 30, "car", 15, 33.690059, 135.336459,
    "白良浜から車で約15分。南北約130m・東西約35m・高さ約25mの小島で、島の真ん中に円月形の穴が開いていることから「円月島」と呼ばれています。長い年月をかけて波に岩が削られ、今の形になったと考えられています。「日本の夕陽百選」にも選ばれ、春と秋には、穴に夕日が収まる瞬間が見られることもあります。"),
  cre({
    name: "京都大学白浜水族館", h: 13, m: 50, stay: 60, mode: "walk", dur: 5, lat: 33.69278, lng: 135.337524, address: "和歌山県西牟婁郡白浜町459",
    memo:
      "円月島の近くにある、京都大学の瀬戸臨海実験所に付属する水族館です。サンゴやエビ、カニ、ヒトデなどの無脊椎動物のコレクションは日本随一ともいわれ、250トンの大水槽などには、さまざまな魚も展示されています。学術的にも見ごたえのある展示を、ゆっくり見てまわりましょう。",
  }),
  cre({
    name: "南方熊楠記念館", h: 15, m: 0, stay: 90, mode: "walk", dur: 10, lat: 33.69369, lng: 135.336115, address: "和歌山県西牟婁郡白浜町3601-1",
    memo:
      "水族館から歩いて約10分。和歌山が生んだ、博物学・民俗学の世界的な学者・南方熊楠の業績を、約800点の遺品や遺稿で紹介する記念館です。熊楠が昭和天皇に進講したことで知られる粘菌（変形菌）を、顕微鏡で見ることもできます。屋上からは360度の眺めが広がり、白浜の海と町を見渡せます。休館日は公式の案内で確かめてから訪れましょう。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${SANDANBEKI_ID},${SENJOJIKI_ID},${ENGETSU_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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

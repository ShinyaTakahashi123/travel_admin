/**
 * #465 1f6c8824（浅草・上野・谷中 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 4か所 09:30〜13:12（隅田公園 →（銀座線）上野東照宮 → 不忍池 → 谷中銀座）で、本文はガイドの語り口だった
 *   午後は谷中から根津へ歩いて、谷根千の下町をめぐる（戻らない）
 *   隅田公園 9:10〜9:45 →（銀座線と歩き20分）上野東照宮 10:05〜10:40 →（歩き10分）不忍池 10:50〜11:30 →（歩き25分）谷中銀座商店街（昼食）11:55〜13:05
 *   →（歩き5分）朝倉彫塑館（新規）13:10〜14:15 →（歩き10分）徳川慶喜の墓（新規）14:25〜14:45 →（歩き5分）旧吉田屋酒店（新規）14:50〜15:20 →（歩き15分）根津神社（新規）15:35〜16:30
 *   閉まる時刻: 朝倉彫塑館 9:30〜16:30（入館16:00まで・月木休館）、旧吉田屋酒店 9:30〜16:30（月曜休館）。本文に時刻・曜日は書かない
 *   天王寺の五重塔跡は、焼失のいきさつに自死が関わるため入れない
 * 本文の出典: 台東区公式観光 https://t-navi.city.taito.lg.jp/spot/1011 ・/spot/1043 （隅田公園）・/spot/1035 （不忍池）・/spot/1037 （不忍池辯天堂）・/spot/1039 （谷中銀座）・/spot/1282 （徳川慶喜の墓）、
 *   上野東照宮 https://www.uenotoshogu.com/ 、朝倉彫塑館 https://www.taitogeibun.net/asakura/ 、旧吉田屋酒店 https://www.taitogeibun.net/shitamachi/shitamachi_annex/ 、
 *   根津神社 https://nedujinja.or.jp/about/ ・/keidaiannai/ ・/access/
 * 座標の出典: OSM（隅田公園 relation 14235095／上野東照宮 way 145344085／不忍池弁天堂 way 91725747／谷中銀座 way 737745076／台東区立朝倉彫塑館 way 209190478／
 *   徳川慶喜墓所 way 778183077／下町風俗資料館付設展示場 way 914133670／根津神社 way 464629204）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-465-1f6c8824.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1f6c8824-808f-40bf-aa0e-eb4835ce78ce";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "定番の雷門や仲見世通りから少し離れて、隅田川沿いの隅田公園から、上野東照宮と不忍池へ。谷中銀座商店街で食べ歩きをして、朝倉彫塑館、旧吉田屋酒店をたずね、根津神社まで、谷中・根津の下町を歩く、しっとり下町散策プランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["隅田公園", "上野東照宮", "不忍池", "谷中銀座商店街"].join()) throw new Error("構成が想定と違います");
  const [sumida, toshogu, shinobazu, yanaka] = day.spots;

  const order = [
    { id: sumida.id, data: { visitTime: t(9, 10), stayDurationMin: 35, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.715507, lng: 139.803143, address: "東京都台東区浅草1丁目",
      memo: "この旅は電車と歩きでめぐります。東京メトロ銀座線・都営浅草線・東武スカイツリーラインの浅草駅から歩いて約5分の隅田公園へ。隅田川の両岸に広がる公園で、江戸時代から桜の名所として知られ、吾妻橋から桜橋まで両岸に約1km続く桜並木は、日本さくら名所百選に選ばれています。川沿いを歩きながら、東京スカイツリーの眺めも楽しみましょう。" } },
    { id: toshogu.id, data: { visitTime: t(10, 5), stayDurationMin: 35, transitMode: "train", transitDurationMin: 20, transitLine: "東京メトロ銀座線", lat: 35.715367, lng: 139.770632, address: "東京都台東区上野公園9-88",
      memo: "浅草駅から東京メトロ銀座線で上野駅へ出て、上野公園の中の上野東照宮へ。1627年に創建された、徳川家康公をまつる神社です。金色殿などの豪華な建物は、戦争や地震にも崩れずに残った江戸初期の貴重な建築として、国の重要文化財に指定されています。" + RESPECT } },
    { id: shinobazu.id, data: { visitTime: t(10, 50), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.71214, lng: 139.771154, address: "東京都台東区上野公園5-20",
      memo: "東照宮から歩いて、不忍池へ。「鵜の池」「蓮池」「ボート池」の3つの池からなる天然の池で、春は桜、梅雨はあじさい、夏は蓮の花と、四季折々の景色が見られます。池に浮かぶ中之島の不忍池辯天堂は、寛永寺を開いた天海が、琵琶湖の竹生島の宝厳寺に見立てて建てたもので、池のどこからでもお参りできるよう八角形の建物になったといわれています。" + RESPECT } },
    { id: yanaka.id, data: { visitTime: t(11, 55), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 25, transitLine: null, lat: 35.727669, lng: 139.765317, address: "東京都台東区谷中3丁目",
      memo: "不忍池から北へ歩いて、谷中銀座商店街へ。1945年ごろに自然に生まれた商店街で、全長170mほどの短い通りに、さまざまな店が並び、昭和の懐かしい商店街の景観が残っています。商店街へ続く階段は「夕やけだんだん」と呼ばれ、下町を紅色に染める夕日の名所です。このあたりで食べ歩きをしながら昼食にしましょう。" } },
    { create: mk({ name: "朝倉彫塑館", h: 13, m: 10, stay: 65, mode: "walk", min: 5, lat: 35.726826, lng: 139.768538, address: "東京都台東区谷中7-18-10",
      memo: "夕やけだんだんを上がって、台東区立朝倉彫塑館へ。彫刻家・朝倉文夫のアトリエ兼住居だった建物で、中庭や屋上庭園があり、登録有形文化財です。漆塗りの床や畳の廊下があるため、靴を脱いで見学します（裏にゴムのついていない靴下で入ります）。工事などで見学できない場所があることもあるので、休館日とあわせて公式の案内で確かめましょう。" }) },
    { create: mk({ name: "徳川慶喜の墓", h: 14, m: 25, stay: 20, mode: "walk", min: 10, lat: 35.723408, lng: 139.771853, address: "東京都台東区谷中7丁目",
      memo: "朝倉彫塑館から谷中霊園のほうへ歩いて、徳川慶喜の墓へ。江戸幕府最後の将軍・徳川慶喜の墓で、谷中墓地と呼ばれる区域の寛永寺墓地にあり、都の史跡に指定されています。円墳状の墓で、慶喜とその妻の墓が並んでいます。慶喜は、公爵の位を授けた明治天皇への感謝から、仏式ではなく神式の葬儀を望んだため、この形になったとされます。墓所のまわりでは静かに見学しましょう。" }) },
    { create: mk({ name: "旧吉田屋酒店", h: 14, m: 50, stay: 30, mode: "walk", min: 5, lat: 35.72133, lng: 139.770977, address: "東京都台東区上野桜木2-10-6",
      memo: "慶喜の墓から歩いてすぐの、したまちミュージアム付設展示場「旧吉田屋酒店」へ。江戸時代から谷中で代々酒屋を営んでいた吉田屋の、1910年に建てられた建物を移したもので、出桁造りの商家の建物の中に、秤や漏斗、枡、樽、徳利、宣伝用のポスターや看板など、酒の商いの道具が並びます。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "根津神社", h: 15, m: 35, stay: 55, mode: "walk", min: 15, lat: 35.719973, lng: 139.760663, address: "東京都文京区根津1-28-9",
      memo: "旧吉田屋酒店から西へ歩いて、根津神社へ。日本武尊が千駄木の地に創祀したと伝えられる神社で、宝永3年（1706年）に完成した権現造りの本殿・幣殿・拝殿と、唐門・西門・透塀・楼門が欠けずに残り、国の重要文化財に指定されています。楼門は、江戸の神社の楼門で唯一残っているものです。乙女稲荷へ続く参道には、奉納された鳥居がたくさん並びます。つつじ苑に入れるのは4月のつつじまつりの期間だけです。" + RESPECT + "谷中・根津の下町をめぐる旅を、ここで締めくくりましょう。帰りは、東京メトロ千代田線の根津駅か千駄木駅まで歩きます。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 隅田公園 9:10 →（銀座線）上野東照宮 10:05 → 不忍池 10:50 → 谷中銀座（昼食）11:55 → 朝倉彫塑館 13:10 → 徳川慶喜の墓 14:25 → 旧吉田屋酒店 14:50 → 根津神社 15:35〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

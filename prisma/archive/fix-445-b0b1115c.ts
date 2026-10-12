/**
 * チェックリスト #445 b0b1115c「米子城跡と皆生温泉、歴史と海辺の湯を楽しむ1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目（歩きとバス）: 米子城跡 → 湊山公園（新規）→ 米子市立山陰歴史館（新規）→（昼食）→ 加茂川沿いの白壁土蔵（新規）→ 皆生温泉（2日目から移す）（5か所 09:00〜16:30）
 * 2日目（車）: 米子水鳥公園（新規）→ 大神山神社本社（新規）→ 大山寺（新規）→ 大神山神社奥宮（新規）（4か所 09:00〜13:30。帰る日）
 * 皆生温泉は1日目の終わりに移して、宿の温泉地として入る流れに（スポットIDはそのまま、日だけ移す）
 * 既存の2か所は本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 米子城跡: 「山陰随一の名城と評された」→ 県の観光サイトどおり「山陰一の名城となりました」を「といわれます」でぼかす。「2006年に本丸・二の丸・内膳丸が史跡」→ 範囲は書かず「平成18年（2006年）に国の史跡」に
 *   - 皆生温泉: 「塩化物泉系で保温力が高い」→ 泉質だけ。「トライアスロン通り」は確かめられないので外す
 * 写真: 米子城跡（本丸）・皆生温泉の写真は合っているので残す
 * 本文の出典: 米子市 https://www.city.yonago.lg.jp/4438.htm（米子城の歴史）、とっとり旅 https://www.tottori-guide.jp/tourism/tour/view/N（米子城跡 292／湊山公園 293／加茂川 237／皆生温泉 249／
 *   米子水鳥公園 236／大山寺本堂 289／大神山神社奥宮 199）、山陰歴史館 https://www.yonagobunka.net/rekishi/information/ 、皆生トライアスロン https://www.kaike-triathlon.com/?page_id=187
 * 座標の出典: Nominatim（米子城跡 35.4250090,133.3244542／湊山公園 35.4281061,133.3212773／米子市立山陰歴史館 35.4292598,133.3303955／加茂川橋 35.4311232,133.3294714／
 *   皆生温泉 温泉中央通り 35.4578458,133.3614042／米子水鳥公園 35.4422979,133.2877509／大神山神社（尾高）35.4180962,133.4058661／角磐山大山寺 35.3911780,133.5343806／大神山神社（奥宮）35.3889475,133.5384510）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-445-b0b1115c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b0b1115c-0677-4979-82d1-b4045b052e90";
const DAY1_ID = "5bdd4101-34e2-4b8c-b2ff-b317636eb6ed";
const DAY2_ID = "7d93bbdc-2b04-4898-b5ec-e8a12f5ad1ff";
const CASTLE = "90f703be-2860-4a96-87b3-3eb163aff665";
const KAIKE = "89aefb60-9ea4-46da-9d36-1c93494627f5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "1日目は、中海と大山を望む米子城跡から、湊山公園、昭和初期の洋館・山陰歴史館、白壁の土蔵が並ぶ加茂川沿いを歩き、日本海に面した皆生温泉へ。2日目は車で、野鳥が集まる米子水鳥公園から、大山のふもとの大神山神社、大山寺と奥宮へ。米子の歴史と海辺の湯、大山の信仰を楽しむ1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, line: string | null = null) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(CASTLE, 9, 0, 75, null, null, 35.425009, 133.324454,
    "旅の始まりは、JR米子駅から歩いて20分ほどの米子城跡へ。湊山に本格的な城を築き始めたのは西伯耆の領主・吉川広家で、天正19年（1591年）のことでした。関ヶ原の戦いのあと、伯耆国の領主として入った中村一忠が築城を続け、慶長7年（1602年）ごろに完成したといわれます。吉川広家の四重の天守に加えて五重の大天守が建てられ、山陰一の名城になったといわれています。建物は明治の初めに売却されて残っていませんが、石垣や礎石が城の形をよく伝えていて、平成18年（2006年）に国の史跡に指定されました。山頂からは大山や島根半島、中海、米子の街が見渡せます。石段や坂道が続くので、歩きやすい靴で登りましょう。"),
  cre("湊山公園", 10, 20, 30, "walk", 5, 35.428106, 133.321277, "鳥取県米子市西町",
    "城山のふもとに広がる湊山公園へ。日本庭園や桜の園、展望の丘などがある市民の憩いの場で、公園から見る中海の夕焼けは水面を真っ赤に染めるといわれます。日本庭園のそばには「清洞寺岩」と呼ばれる巨岩が並び、岩の上には米子城主ゆかりの人々の五輪塔が並んでいます。"),
  cre("米子市立山陰歴史館", 11, 10, 50, "walk", 20, 35.42926, 133.330396, "鳥取県米子市中町20",
    "湊山公園から歩いて、米子市立山陰歴史館へ。昭和5年（1930年）に米子市役所として建てられた、赤レンガ色のタイル張りの洋館で、鉄筋コンクリート3階建ての大きな建物は、建築当時は山陰随一といわれました。昭和52年（1977年）に市の有形文化財に指定されています。今は米子の民俗資料や米子城の資料などを展示する博物館になっています。休館日は公式の案内で確かめましょう。このあと、米子の街で昼食にしましょう。"),
  cre("加茂川沿いの白壁土蔵", 13, 15, 45, "walk", 5, 35.431123, 133.329471, "鳥取県米子市天神町",
    "昼食のあとは、旧市役所の横から米子港へと続く加茂川沿いを歩きましょう。川沿いには白壁の土蔵が建ち並ぶ古い商家の家並みが続き、米子がかつて栄えていた面影を今に残しています。ここからは、加茂川と中海をめぐる遊覧船も出ています。川沿いの道では足元に気をつけましょう。"),
  upd(KAIKE, 14, 30, 120, "bus", 30, 35.457846, 133.361404,
    "米子駅のほうから路線バスで、今夜の宿がある皆生温泉へ。弓ヶ浜半島の東の端にあり、日本海の美保湾に面した白砂青松の海岸線と、中国地方の最高峰・大山を眺められる温泉地です。昔から漁師のあいだで、皆生の沖合に潜ると温かい湯が湧いているといわれ、明治33年（1900年）に自噴泉が見つかりました。泉質はナトリウム・カルシウム－塩化物泉です。1981年、温泉開発60周年の企画から、日本で初めてのトライアスロンがこの海岸で開かれ、今も全日本トライアスロン皆生大会が続いています。海辺を歩いたら、宿でゆっくり湯につかりましょう。" + BATH),
];

const day2 = [
  cre("米子水鳥公園", 9, 0, 50, null, null, 35.442298, 133.287751, "鳥取県米子市彦名新田665",
    "2日目は車（レンタカーなど）でめぐります。まずは中海のほとりの米子水鳥公園へ。中海では、国内で確認された野鳥の42%の種類が観察されているといわれ、山陰屈指の野鳥の生息地です。冬には毎年約1000羽のコハクチョウが越冬し、カモ類やサギ類、国の天然記念物のマガンやヒシクイなども見られます。夏には水鳥の子育ての様子も観察できます。休館日は公式の案内で確かめましょう。"),
  cre("大神山神社（本社）", 10, 15, 35, "car", 25, 35.418096, 133.405866, "鳥取県米子市尾高",
    "水鳥公園から車で、大山のふもとにある大神山神社の本社へ。古くから「大神岳（おおかみのたけ）」と呼ばれた大山への信仰の中心となってきた神社で、明治時代の神仏分離で「大智明権現社」から今の名前に改められました。大山の中腹にある奥宮と、ふもとの本社の2社に分かれていて、本社は江戸時代にこの地に移されたものです。" + RESPECT),
  cre("大山寺", 11, 15, 45, "car", 25, 35.391178, 133.534381, "鳥取県西伯郡大山町大山",
    "本社から車で大山へ上り、中腹にある大山寺へ。平安時代以降、最盛期には100を超える寺院と3000人以上の僧兵をかかえ、比叡山や吉野山、高野山に劣らないほど栄えた一大修行道場だったといわれます。明治の神仏分離をきっかけに衰え、今は本堂と支院などが残っています。今の本堂は、昭和3年（1928年）に焼失したあと、昭和26年（1951年）に再建されたものです。大山への道は冬に雪が積もることがあるので、冬用タイヤなどの準備をして、安全に運転しましょう。" + RESPECT),
  cre("大神山神社奥宮", 12, 15, 60, "walk", 15, 35.388948, 133.538451, "鳥取県西伯郡大山町大山",
    "大山寺から、自然石を敷き詰めた長さ約700mの参道を歩いて、大神山神社奥宮へ。日本最大級の権現造りの社殿で、国の重要文化財に指定されています。建物の内部は、日本最大級とされる白檀塗りの鮮やかな壁画と彫刻で囲まれています。石畳の参道は、雨や雪の日は滑りやすいので気をつけて歩きましょう。" + RESPECT + "大山の信仰の地で、米子の旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== CASTLE || days[1].spots.map((s) => s.id).join() !== KAIKE) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.spot.update({ where: { id: KAIKE }, data: { dayId: DAY1_ID, orderNo: 9501 } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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

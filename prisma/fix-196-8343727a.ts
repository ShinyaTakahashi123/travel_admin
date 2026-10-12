/**
 * #196 8343727a「旭川サイクリングロードと半田山植物園、緑と水辺の1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所（旭川さくら並木）10:00〜11:00、2日目 1か所（半田山植物園）09:30〜10:40 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。
 *   タイトルの「旭川サイクリングロード」は公式の名前が確かめられないので、1日目は公式のサイクリングコースがある吉備路自転車道を自転車でめぐり、2日目に岡山市内の緑と水辺を歩く形にする
 * 1日目: レンタサイクル（JR備前一宮駅前で借り、JR総社駅前で返す。乗り捨てのできる店を選ぶ）、岡山市内に泊まる。2日目: 歩きと路線バス
 *   1日目: 備中高松城址 9:30 → 作山古墳 → 吉備路もてなしの館（昼食）→ 備中国分寺 → こうもり塚古墳 → 宝福寺 → 総社宮 16:30 → 総社駅から JR で岡山へ
 *   2日目: 半田山植物園 9:30 → 岡山駅前（昼食）→ 旭川さくらみち → 安住院 → 曹源寺 16:30 → 路線バスで岡山駅
 * タイトルを「吉備路自転車道と半田山植物園、古墳と寺社・緑と水辺をめぐる1泊2日」に、季節は四季のまま、説明文は書き直す
 * 吉備路のほかのしおり（5332b198: 後楽園・吉備津彦神社・吉備津神社・造山古墳・もてなしの館・備中国分寺・鬼ノ城）と、岡山市内の旭川さくらみち（573dd48c）の本文を読み、使っていない話で書いた
 *   （もてなしの館は五重塔を望む場所と季節のギャラリー、備中国分寺は寺域の広さ・礎石・塔の木材と心柱・初層の仏像、旭川さくらみちはさくらカーニバルと夜の明かり）。
 *   備中高松城址・作山古墳・こうもり塚古墳・宝福寺・総社宮・半田山植物園・安住院・曹源寺はほかのしおりにない。高松城の清水宗治の最期の話は入れない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（岡山観光WEB okayama-kanko.jp、総社市 city.soja.okayama.jp）:
 *   okayama-kanko.jp/course/detail_100513.html（吉備路のサイクリング: JR備前一宮駅前と JR総社駅前のレンタサイクル）／spot/10102 備中高松城址（天正10年の高松城水攻め・黒田官兵衛・公園として整備・7月中旬に約4,000㎡の堀に宗治蓮・資料館は10〜15時、月曜休館）／
 *   city.soja.okayama.jp/soshiki/26/2884.html 作山古墳（全国第10位、県下第2位の前方後円墳・全長約282m・5世紀中ごろ・中に立ち入ることができる最大の古墳）／spot/10775 吉備路もてなしの館（五重塔を望む・食事と買い物・毎週替わるギャラリー・火曜休み）／
 *   fc/location/12956 備中国分寺（聖武天皇の発願・東西約160m、南北約178mの寺域・南北朝に失い江戸時代に再建・礎石・五重塔は下3層が檜、上2層が松、心柱は礎石から頂上まで・初層に5体の仏像）／
 *   city.soja.okayama.jp/soshiki/26/2886.html こうもり塚古墳（全長約96m・6世紀後半・全長19.9mの石室は全国3位の規模・貝殻石灰岩の家形石棺）／spot/detail_10821.html 宝福寺（雪舟ゆかりの臨済宗の禅寺・三重塔は国の重要文化財・紅葉・坐禅）と
 *   city.soja.okayama.jp/soshiki/26/2878.html（三重塔は永和2年（1376）、県内で2番目に古い）／総社宮 city.soja.okayama.jp/site/kanko/3603.html・okayama-kanko.jp/spot/10808（総社の地名の由来・平安末期に国府の近く・備中国324社の神を合祀・
 *   古代様式の三島式庭園・本殿から放射状に延びる3つの回廊）／spot/10008 半田山植物園（約3,200種15万本・標高10〜85mの丘陵・頂上付近から市街地を一望・火曜休園）／spot/detail_10126.html 旭川さくらみち（東岸約1km・岡山さくらカーニバル・夜のライトアップ）／
 *   spot/10127 安住院（本堂、多宝塔、山門は県の重要文化財・多宝塔は池田綱政が後楽園の借景として建て始め、継政のときに完成・県下2番目の規模・「見かえりの塔」）／spot/10138 曹源寺（岡山藩主池田家の菩提寺・臨済宗・池泉回遊式の庭・紅葉）
 * 座標: OSM — 高松城址公園 node 4130581022（historic=castle）・作山古墳 node 4018170936・こうもり塚古墳 node 2478970947（archaeological_site）・吉備路もてなしの館 node 13103277740（shop=farm、施設そのものの点）・
 *   備中国分寺 node 4538946590・井山宝福寺 node 5309988746・岡山市半田山植物園 node 1423610359（garden）・岡山駅 node 265900340（railway=stop）・安住院 node 9337455747・曹源寺 node 6354703351（API で名前つき）／
 *   總社宮 way 630831699（Nominatim の中心）／旭川さくらみちは既存の点のまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-196-8343727a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8343727a-f061-4eba-bdba-92d051fc3d0e";
const DAY1_ID = "85185f68-d836-4e1c-9ca7-3c404a000686";
const DAY2_ID = "44767b6c-d4ee-4563-ba2b-be8e560ef39a";
const SAKURA = "db01e571-b660-4f77-8221-bb20a874480c";
const HANDAYAMA = "d1049967-d9b0-450c-9900-032782d9d658";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bike = (min: number) => ({ mode: "other" as const, min, line: "レンタサイクル" });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BIKE = "自転車道は歩く人も通るので、スピードを控えて走りましょう。";

const TITLE = "吉備路自転車道と半田山植物園、古墳と寺社・緑と水辺をめぐる1泊2日";
const DESCRIPTION =
  "1日目は自転車で吉備路へ。備中高松城址から、中に入れる大きな作山古墳、五重塔の備中国分寺、巨大な石室のこうもり塚古墳を走り、雪舟ゆかりの宝福寺と回廊の美しい総社宮へ。2日目は岡山市内で、丘の上の半田山植物園、旭川のさくらみち、多宝塔の安住院、池田家の菩提寺の曹源寺をめぐる、緑と水辺の1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("備中高松城址", { h: 9, m: 30, stay: 40, legs: [], lat: 34.6910316, lng: 133.8221533, address: "岡山県岡山市北区高松558-2",
    memo: "1日目は自転車でめぐります。JR備前一宮駅の前でレンタサイクルを借りて（総社駅前で返せる店を選びましょう）、約20分。天正10年（1582年）、羽柴秀吉の軍と毛利の軍が戦った「高松城水攻め」の舞台で、黒田官兵衛の策が実行された地と伝わります。今は公園になっていて、7月中旬には広い堀に「宗治蓮」が咲きます。資料館の開く時間と休みの日は公式の案内で確かめましょう。" + BIKE }),
  cre("作山古墳", { h: 10, m: 40, stay: 40, legs: [bike(30)], lat: 34.6643559, lng: 133.7685887, address: "岡山県総社市三須",
    memo: "高松城址から自転車で約30分。5世紀の中ごろに築かれた全長約282mの前方後円墳で、全国で10番目、県内で2番目の大きさです。天皇の墓とされていないため、中に入ることのできる古墳としては最大級とされ、墳丘を歩いて上れます。坂や段差があるので、足元に気をつけましょう。" }),
  cre("吉備路もてなしの館（昼食）", { h: 11, m: 30, stay: 50, legs: [bike(10)], lat: 34.6636995, lng: 133.7824285, address: "岡山県総社市宿418",
    memo: "作山古墳から自転車で約10分。備中国分寺の五重塔を望む場所にある施設で、食事のできるコーナーや買い物のコーナーがあり、毎週替わるギャラリーもあります。ここで昼食にしましょう。休みの日は公式の案内で確かめましょう。" }),
  cre("備中国分寺", { h: 12, m: 25, stay: 35, legs: [walk(5)], lat: 34.6665369, lng: 133.7818173, address: "岡山県総社市上林1046",
    memo: "もてなしの館から歩いて約5分。かつての寺域は東西約160m、南北約178mあったとされ、今も門などの礎石が残ります。今の建物は江戸時代に建て直されたもので、五重塔は下の3層が檜、上の2層が松で造られ、心柱は礎石から頂上までまっすぐ通っています。塔の初層には5体の仏像がまつられています。" + PRAY }),
  cre("こうもり塚古墳", { h: 13, m: 5, stay: 25, legs: [walk(5)], lat: 34.6672633, lng: 133.7861087, address: "岡山県総社市上林",
    memo: "国分寺から歩いて約5分。6世紀の後半に造られた全長約96mの前方後円墳で、全長19.9mの石室は、横穴式の石室としては全国で3番目の大きさとされます。石室には、井原の貝殻石灰岩で造った家の形の石棺が納められていました。古墳は亡くなった人をまつる場所なので、静かに見学しましょう。" }),
  cre("宝福寺", { h: 14, m: 0, stay: 70, legs: [bike(30)], lat: 34.6913933, lng: 133.7343085, address: "岡山県総社市井尻野",
    memo: "こうもり塚古墳から自転車で約30分。室町時代の画僧・雪舟が修行した臨済宗の禅寺です。永和2年（1376年）に建てられた三重塔は、県内で2番目に古い塔とされ、国の重要文化財です。秋には境内の紅葉も見どころです。" + PRAY }),
  cre("総社宮", { h: 15, m: 30, stay: 60, legs: [bike(20)], lat: 34.6767213, lng: 133.7538672, address: "岡山県総社市総社2-18-1",
    memo: "宝福寺から自転車で約20分。平安時代の末に備中国の国府の近くに造られ、備中国の324社の神をあわせてまつった社で、「総社」の地名の由来になったといわれます。前の庭は古い様式の三島式の庭で、本殿から3方向に延びる回廊が池の水面に影を映します。" + PRAY + "このあとは JR総社駅で自転車を返し、JRで岡山へ戻って、岡山の町の宿に泊まりましょう。" }),
];

const DAY2: X[] = [
  upd(HANDAYAMA, { h: 9, m: 30, stay: 90, legs: [], lat: 34.693227, lng: 133.930478, address: "岡山県岡山市北区法界院3-1",
    memo: "2日目は歩きと路線バスでめぐります。JR津山線の法界院駅から歩いて約15分。標高10mから85mの丘に、約3,200種、15万本の植物が育つ植物園で、季節ごとに梅や桜、ツツジ、アジサイ、バラなどが咲きます。頂上の近くからは岡山の町を見渡せます。坂道が多いので、歩きやすい靴で回りましょう。休園日は公式の案内で確かめましょう。" }),
  cre("岡山駅前（昼食）", { h: 11, m: 25, stay: 50, legs: [walk(15), train(5, "JR津山線（法界院→岡山）"), walk(5)], lat: 34.6653674, lng: 133.9178086, address: "岡山県岡山市北区駅元町",
    memo: "植物園から法界院駅へ歩いて約15分、JRで岡山駅へ（駅から歩く時間とあわせて約25分）。駅のまわりの食事の店で昼食にしましょう。" }),
  upd(SAKURA, { h: 12, m: 35, stay: 40, legs: [bus(15, "路線バス（岡山駅→後楽園前）"), walk(5)], lat: 34.6702, lng: 133.9349, address: "岡山県岡山市中区後楽園",
    memo: "岡山駅から路線バスで約15分の後楽園前へ、歩いて約5分（あわせて約20分）。旭川の東岸に約1km続く並木道で、春には「岡山さくらカーニバル」が開かれ、夜には並木が明かりで照らされます。花の季節でなくても、川風を受けながら土手の道を歩けます。" }, "旭川さくらみち"),
  cre("安住院", { h: 13, m: 45, stay: 60, legs: [walk(30)], lat: 34.6631864, lng: 133.9508909, address: "岡山県岡山市中区国富3-1-29",
    memo: "旭川さくらみちから東へ歩いて約30分。本堂と多宝塔、山門が県の重要文化財の寺です。多宝塔は、藩主の池田綱政が後楽園から眺める景色の一部として建て始め、次の継政のときに完成したもので、県内で2番目の大きさとされ、「見かえりの塔」とも呼ばれます。石段があるので、足元に気をつけましょう。" + PRAY }),
  cre("曹源寺", { h: 15, m: 15, stay: 75, legs: [walk(30)], lat: 34.659155, lng: 133.9726921, address: "岡山県岡山市中区円山1069",
    memo: "安住院から東へ歩いて約30分。岡山藩主・池田家の菩提寺で、臨済宗の禅寺です。池のまわりを歩いてめぐる庭があり、秋には紅葉が境内を彩ります。修行の場でもあるので、静かに歩きましょう。" + PRAY + "帰りは、路線バスで岡山駅へ戻りましょう（約20分）。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== SAKURA ||
    it.days[1].spots.map((s) => s.id).join() !== HANDAYAMA
  )
    throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.spot.update({ where: { id: SAKURA }, data: { dayId: DAY2_ID, orderNo: 901 } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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

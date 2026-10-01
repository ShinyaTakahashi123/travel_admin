/**
 * #210 b7de8da7「東福寺の通天橋と大原の里。京都の紅葉を満喫する秋の2日間」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 09:00〜18:40（清水寺の夜の拝観をスポットにしていた）・2日目 4か所 09:30〜13:45。
 *   夜はスポットにしない決まり（仕様書 6）なので、清水寺を昼に移し、夜のライトアップは青蓮院のメモで案内する。昼食の行がなく、移動の分が書き出しにないスポットがあった
 * 1日目（歩きとタクシー）: 東福寺 9:00 → 泉涌寺 →（タクシー）高台寺 → 二年坂・産寧坂（昼食）→ 清水寺 → 八坂神社 → 青蓮院 16:45（受付16:30まで）
 * 2日目（バスと電車、歩き）: 三千院 9:30 → 宝泉院 → 実光院 → 里の駅 大原（昼食）→ 寂光院 →（京都バス・叡山電車）詩仙堂 → 曼殊院 16:50（受付16:30まで）
 * 直した本文: 清水寺「長大なケヤキの柱139本」は公式（舞台を支えるのは18本）と違うので書き直し。12世紀の蹴鞠の話など確かめられない記述は外した。
 *   宝泉院の血天井は「戦いで亡くなった武将たちの血」の言い方をやめ、「伏見城の戦いにまつわる床板」に。五葉松は「樹齢約700年とされる」に。
 *   東福寺の「約2000本」は確かめられないので「多くのカエデ」に。泉涌寺の「東福寺ほど混雑しない」は外した
 * 本文の出典: 清水寺 https://www.kiyomizudera.or.jp/history/ （778年開創・伽藍の多くは1633年再建・舞台は約13m・欅の柱18本・懸造り・継ぎ手で釘を使わない・音羽の瀧）／
 *   青蓮院 https://www.shorenin.com/info/ ・/haikan/ ・/temple/ （青蓮坊が起源・天台宗の門跡・1788年の大火で仮御所・粟田御所・国の史跡・八坂神社から徒歩10分・門前の大楠・相阿弥作と伝わる池泉回遊式庭園・9:00〜17:00 受付16:30・春秋の夜間ライトアップ）／
 *   二年坂・産寧坂 京都観光Navi https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=691 （古くからの参詣路・石段と石畳の坂・江戸末期〜大正の町家）・京都市 https://www.city.kyoto.lg.jp/tokei/page/0000281305.html （重要伝統的建造物群保存地区）／
 *   里の駅 大原 https://www.satonoeki-ohara.com/ （旬の野菜の直売所・杵つき餅・大原の野菜を使う食事どころ、昼は11時から）／
 *   詩仙堂 https://kyoto-shisendo.net/ （石川丈山・約380年前・季節の花・鹿おどし・9:00〜17:00 受付16:45）／
 *   曼殊院 https://www.manshuinmonzeki.jp/history.html ・visit.html （延暦年間に最澄が比叡山に創建・明暦2年に現在地・勅使門の塀の5本の白い筋・小さな桂離宮・公家好みの庭・9:00〜17:00 受付16:30）／
 *   宝泉院 http://www.hosenin.net/ （9:00〜17:00 受付16:30）。そのほかの寺社の本文はもとの文を生かした
 * 座標の出典: OSM（Nominatim）— 東福寺 way 768987591／泉涌寺 way 878535619／高台寺 way 759391880／二年坂 way 30913263／清水寺 way 336641107／八坂神社 way 328903218／
 *   青蓮院 way 456124860／三千院 way 759390999／宝泉院 way 556023622／実光院 way 556023709／里の駅 大原 node 2298263326／寂光院 way 365835291／詩仙堂丈山寺 way 503289189／曼殊院 relation 15519150
 *   （宝泉院・実光院はもとが丸めた推定、泉涌寺・八坂神社は少しずれていたので、すべて OSM の点にそろえる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-210-b7de8da7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b7de8da7-4621-4e87-bc5c-38071741fcba";
const DAY1 = "c91f1850-79bc-4082-88f2-85f748e31e79";
const DAY2 = "e050ecc2-5ba2-42c3-8483-ad54ddcc1e58";
const ID = {
  tofuku: "d37ab3cb-a5c4-4e10-b582-5bb2581380d3",
  sennyu: "88224fc5-e935-4f94-84b1-47d624e9a444",
  kodai: "400e6e9c-dc89-4e5d-bc7d-9c6e2c48064a",
  yasaka: "3a26b37c-e052-4878-9830-dc5c7b99370c",
  kiyomizu: "e7df49bc-08c9-4f2a-a341-70c805677373",
  sanzen: "79612e76-2e3f-44fa-9eb6-5a77a4ed1075",
  hosen: "a37fb9de-3276-42bf-a40d-ad75efed2dea",
  jikko: "d6225abf-fe47-447a-b566-77126343bd42",
  jakko: "7a0f4558-c493-4a73-91ef-e6cf0833fc40",
};
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "1日目は紅葉の名所・東福寺から泉涌寺、高台寺、二年坂・産寧坂、清水寺、八坂神社を歩き、青蓮院で締めくくります。2日目はバスで大原へ足をのばし、三千院や宝泉院、寂光院など山里の紅葉を楽しんだら、一乗寺の詩仙堂と曼殊院へ。京都の秋の寺社をめぐる1泊2日プランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const D1 = [
  upd(ID.tofuku, { h: 9, m: 0, stay: 70, mode: null, min: null, lat: 34.9771706, lng: 135.7745754, address: "京都府京都市東山区本町15-778",
    memo: "この日は歩きとタクシーでめぐります。京都駅からJR奈良線で1駅の東福寺駅へ行き、歩いて約10分。奈良の東大寺と興福寺、両方の一字を取って名づけられたと伝えられる、京都五山に数えられる大禅寺です。鎌倉時代、摂政・九条道家が「東大寺のような規模、興福寺のような教学」を持つ寺を目指して発願し、円爾（聖一国師）を開山に迎えて建立されたと伝えられています。渓谷に架かる通天橋のまわりには多くのカエデが植えられ、その中には円爾が中国（宋）から持ち帰ったと伝わる、葉が3つに分かれる「通天モミジ」もあります。見下ろす「洗玉澗」の紅葉は、京都を代表する景色のひとつです。見頃の週末はとても混むので、早めに着くようにしましょう。" + PRAY }),
  upd(ID.sennyu, { h: 10, m: 25, stay: 45, mode: "walk", min: 15, lat: 34.9784527, lng: 135.7795322, address: "京都府京都市東山区泉涌寺山内町27",
    memo: "東福寺から歩いて約15分。皇室ゆかりの「御寺（みてら）」と呼ばれる古刹です。鎌倉時代、俊芿という僧がこの地を開いた際、境内から清水が湧き出したことが寺名の由来と伝えられています。境内には歴代の天皇・皇后の陵墓が営まれ、皇室の菩提所として「御寺」と呼ばれるようになりました。塔頭の今熊野観音寺のあたりも紅葉が美しいところです。" + PRAY }),
  upd(ID.kodai, { h: 11, m: 25, stay: 50, mode: "taxi", min: 15, lat: 35.0003033, lng: 135.7805956, address: "京都府京都市東山区高台寺下河原町526",
    memo: "泉涌寺からタクシーで約15分、東山へ。豊臣秀吉の正室・ねね（北政所）が、夫の菩提を弔うため慶長11年（1606年）に建てたと伝えられる寺です。「高台寺」という寺名は、ねねの戒名「高台院」にちなむとされ、造営にあたっては徳川家康が多額の資金援助をしたともいわれています。小堀遠州作と伝わる庭園にある臥龍池に映り込む紅葉が見どころです。" + PRAY }),
  cre("二年坂・産寧坂", { h: 12, m: 25, stay: 60, mode: "walk", min: 10, lat: 34.9984479, lng: 135.7808398, address: "京都府京都市東山区桝屋町",
    memo: "高台寺から歩いて約10分。祇園社や清水寺への古くからの参詣の道で、石段や折れ曲がった石畳の坂道に沿って、江戸時代の終わりから大正時代にかけて建てられた町家が並びます。八坂の塔などの寺社とともに歴史ある町並みを伝えており、国の重要伝統的建造物群保存地区に選ばれています。坂の途中には食事の店も多いので、ここで昼食にしましょう。石段は混み合うので、足元に気をつけましょう。" }),
  upd(ID.kiyomizu, { h: 13, m: 35, stay: 70, mode: "walk", min: 10, lat: 34.994303, lng: 135.7844389, address: "京都府京都市東山区清水1-294",
    memo: "産寧坂を上って歩いて約10分。778年に開かれたと伝わる、音羽山の中腹に広がる寺で、今の伽藍のほとんどは1633年に再建されたものです。本堂から張り出した舞台は、崖下から約13mの高さがあり、樹齢400年余りの欅の柱18本が「懸造り」と呼ばれる造りで支えています。木材どうしは「継ぎ手」で組まれ、釘は1本も使われていません。寺の名の由来となった音羽の瀧からは、今も清らかな水が湧き続けています。舞台の上は混み合うので、まわりに気をつけて歩きましょう。" + PRAY }),
  upd(ID.yasaka, { h: 15, m: 10, stay: 40, mode: "walk", min: 25, lat: 35.0036027, lng: 135.7782611, address: "京都府京都市東山区祇園町北側625",
    memo: "清水寺から産寧坂・二年坂、ねねの道を通って歩いて約25分、祇園へ。素戔嗚尊を祀る、全国の祇園社・八坂神社の総本社です。飛鳥時代、朝鮮半島から来た人物がこの地に素戔嗚尊を祀ったのが始まりとも、平安時代に僧が堂を建てたのが始まりとも伝えられています。夏の祇園祭は、平安時代に疫病がはやった際、神泉苑に66本の矛を立てて災いを払おうとしたことに由来するといわれる祭礼です。" + PRAY }),
  cre("青蓮院", { h: 16, m: 0, stay: 45, mode: "walk", min: 10, lat: 35.0076015, lng: 135.7833999, address: "京都府京都市東山区粟田口三条坊町69-1",
    memo: "八坂神社から円山公園を通って歩いて約10分。比叡山に最澄が設けた僧の住まいのひとつ「青蓮坊」が起こりと伝えられる、天台宗の門跡寺院です。江戸時代に御所が大火で焼けた際には仮の御所となり、「粟田御所」とも呼ばれて、境内は国の史跡に指定されています。門前の大きな楠を見上げ、相阿弥の作と伝えられる池泉回遊式の庭園を歩いて、この日を締めくくりましょう。春と秋には夜のライトアップも行われるので、時期は公式の案内で確かめましょう。" + PRAY + "この夜は、京都市内の宿に泊まりましょう。" }),
];

const D2 = [
  upd(ID.sanzen, { h: 9, m: 30, stay: 70, mode: null, min: null, lat: 35.1196423, lng: 135.8349235, address: "京都府京都市左京区大原来迎院町540",
    memo: "この日はバスと電車、歩きでめぐります。京都駅前から京都バスで約1時間の大原へ行き、歩いて約10分。延暦年間（782〜806年）、伝教大師最澄が比叡山に建てた庵が起源と伝えられる、天台宗の門跡寺院です。「三千院」という寺名は、一つの心の動きの中にもこの世のすべてが宿るという天台宗の教え「一念三千」に由来すると伝えられ、比叡山や近江坂本、洛中を転々としたのち、明治時代にこの大原の地に移りました。苔の庭と紅葉の取り合わせが美しい、大原を代表する寺院で、庭にたたずむ苔むした「わらべ地蔵」も親しまれています。" + PRAY }),
  upd(ID.hosen, { h: 10, m: 45, stay: 40, mode: "walk", min: 5, lat: 35.121352, lng: 135.8339989, address: "京都府京都市左京区大原勝林院町187",
    memo: "三千院から歩いて約5分。柱と柱の間を額縁に見立てて庭を眺める「額縁庭園」で知られます。「盤桓園」と名づけられたこの庭は、「盤桓」＝立ち去りがたい、という意味が込められていると伝えられ、樹齢約700年とされる五葉松がその中心を彩ります。書院の廊下の天井には、慶長5年（1600年）の伏見城の戦いにまつわる床板が使われていると伝えられ、「血天井」と呼ばれています。額縁の中の紅葉を、座ってゆっくり眺めましょう。" + PRAY }),
  upd(ID.jikko, { h: 11, m: 30, stay: 25, mode: "walk", min: 5, lat: 35.1205452, lng: 135.8340803, address: "京都府京都市左京区大原勝林院町",
    memo: "宝泉院から歩いて約5分。室町時代、宗信法印によって復興されたと伝えられる、天台声明の寺院・勝林院の子院です。庭には「不断桜」と呼ばれる十月桜が植えられ、10月から翌年4月にかけて途切れることなく花を咲かせ続けると伝えられています。そのため紅葉と桜、雪と桜、石楠花と桜と、季節ごとに違った組み合わせが同時に見られる珍しいお寺です。" + PRAY }),
  cre("里の駅 大原", { h: 12, m: 20, stay: 40, mode: "walk", min: 25, lat: 35.1141332, lng: 135.8233733, address: "京都府京都市左京区大原野村町",
    memo: "実光院から歩いて約25分、大原の里を南へ。大原とその近くの農村でとれた旬の野菜の直売所や、杵つき餅の工房、大原の野菜を使った料理を出す食事どころがある施設です。ここで昼食にしましょう。" }),
  upd(ID.jakko, { h: 13, m: 25, stay: 45, mode: "walk", min: 25, lat: 35.1240599, lng: 135.8208194, address: "京都府京都市左京区大原草生町676",
    memo: "里の駅から田園の中を北へ歩いて約25分。飛鳥時代、聖徳太子が父・用明天皇の菩提を弔うために建てたと伝えられる、平家物語ゆかりの静かな尼寺です。壇ノ浦の戦いのあと、安徳天皇の母・建礼門院がここで出家して余生を過ごしたと伝えられ、後白河法皇が彼女を訪ねた話は『平家物語』の最終章「大原御幸」として語り継がれています。参道の石段の紅葉が見事です。石段では足元に気をつけましょう。" + PRAY }),
  cre("詩仙堂丈山寺", { h: 15, m: 20, stay: 40, mode: "bus", min: 70, line: "京都バス", lat: 35.0437304, lng: 135.7961935, address: "京都府京都市左京区一乗寺門口町27",
    memo: "寂光院から歩いて約15分の大原のバス停へ戻り、京都バスで八瀬駅前へ。叡山電車に乗り換えて一乗寺駅で降り、歩いて約15分（あわせて約1時間10分）。江戸時代の文人・石川丈山が晩年を過ごした山荘で、約380年前に開かれたといわれます。季節ごとに花が移り変わる庭で、秋はススキやシュウメイギクが彩ります。丈山が考えたとされる「鹿おどし」の音にも耳をすませましょう。" + PRAY }),
  cre("曼殊院", { h: 16, m: 15, stay: 35, mode: "walk", min: 15, lat: 35.0489491, lng: 135.8031033, address: "京都府京都市左京区一乗寺竹ノ内町42",
    memo: "詩仙堂から北へ歩いて約15分。延暦年間に最澄が比叡山に開いたのが始まりとされる門跡寺院で、明暦2年（1656年）に今の地に移りました。勅使門の両側の塀に引かれた5本の白い筋は、寺の格式を今に伝えるものです。書院の意匠に桂離宮と共通するところが見られることから「小さな桂離宮」ともいわれ、公家好みの庭が広がります。" + PRAY + "帰りは、歩いて約20分の叡山電車の一乗寺駅から出町柳駅へ出て、京都駅方面へ帰りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const ids = it.days.map((d) => d.spots.map((s) => s.id).join());
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || ids[0] !== [ID.tofuku, ID.sennyu, ID.kodai, ID.yasaka, ID.kiyomizu].join() || ids[1] !== [ID.sanzen, ID.hosen, ID.jikko, ID.jakko].join())
    throw new Error("構成が想定と違います");
  const names = Object.fromEntries(it.days.flatMap((d) => d.spots.map((s) => [s.id, s.name])));
  for (const [label, day] of [["1日目", D1], ["2日目", D2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of day) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1, D1, { tx });
      await setDaySpotOrder(DAY2, D2, { tx });
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

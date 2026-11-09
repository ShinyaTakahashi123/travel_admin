/**
 * 奥の院の杉並木と燈籠堂、弘法大師の御廟を訪ねる祈りの旅(9d8e49e5)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 9d8e49e5 の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - 4072c8d3(日帰り)・15c4b54a(1泊2日)と行き先が大きく重なるため、題の中心の奥之院を残し、金剛峯寺・壇上伽藍・大門を外して、
 *   苅萱堂・高野山大師教会・女人堂(この本だけ)と六時の鐘を足す。女人堂〜高野山駅はバス専用道路で歩けず、公式の停留所の時刻表に女人堂がないため、女人堂は途中に回し、霊宝館で終えて千手院橋からバスで帰る(法務・企画運営 11/05)。霊宝館・金剛三昧院・徳川家霊台は残す(企画運営 11/05。
 *   高野山は公式で確かめられる行き先が限られるため、15c4b54a との重なり3つを了承)
 * - 奥之院は一の橋から入り、滞在の中で燈籠堂・御廟まで歩く(東大寺南大門と同じ形、7章)。次への歩きは燈籠堂から測る
 * - 点: 奥之院 入口「奥之院表参道一の橋案内所」way495742583(Nominatim)、苅萱堂 地理院地図の注記「苅萱堂」(OSM にお堂の点がなく、
 *   バス停そばの名前のない建物はどれか決められないため。企画運営の(a)(b)の順で確かめた)、昼食 バス停「千手院橋」node1898351685、
 *   大師教会 案内板 node7738725326、六時の鐘 way514883171(4072c8d3 と同じ)、金剛三昧院 node5092538163・霊宝館 way393562428・
 *   徳川家霊台 node4853424221(15c4b54a と同じ)、女人堂 place_of_worship node4853418822
 * - 区間(routing.openstreetmap.de routed-foot、秒から切り上げ): 一の橋→燈籠堂 1291.8秒(滞在の中)、燈籠堂→奥の院前 726.9→13、
 *   苅萱堂前→苅萱堂 1.8→1、苅萱堂→千手院橋 472.6→8、千手院橋→大師教会 368.9→7、大師教会→六時の鐘 173.5→3、六時の鐘→徳川家霊台 693.8→12、
 *   徳川家霊台→女人堂 366.9→7、女人堂→金剛三昧院 1131.0→19、金剛三昧院→霊宝館 809.4→14、霊宝館→千手院橋(東)のバス停 node1898351685 667.7→12(帰りの一文)
 * - バス(南海りんかんバスの公式の時刻表 PDF rinkan.co.jp/common/pdf/koyasan/timetable/): 高野山駅前 8:45→一の橋口 9:05(平日)、
 *   奥の院前 11:34→苅萱堂前 11:37(平日)。奥の院前に 11:23 に着き、待ち11分は other。苅萱堂前からお堂まで歩き1分(1.8秒)を足したので、苅萱堂から後ろは設計の表より1分ずつ遅い(11:38〜)。
 *   帰り: 千手院橋→高野山駅 乗車時間約22分(りんかんバス公式のおすすめコース rinkan.co.jp/koyasan/recommend/enjoy.html「千手院橋(東) 17:24発→高野山駅 17:35着 乗車時間約22分」、
 *   master.html「千手院橋 17:20発→高野山駅 17:35着 乗車時間約22分」)。メモに便の時刻は書かない
 * - 時刻: 9:30〜16:48。昼食 12:06
 * - 出典: koyasan.or.jp/meguru/(奥之院・燈籠堂・御廟・苅萱堂・大師教会・六時の鐘・徳川家霊台・女人堂)、koyasan.or.jp/experience/(授戒)、
 *   reihokan.or.jp/about/・/riyo/、online.bunka.go.jp/db/heritages/detail/123897(金剛三昧院多宝塔)
 * - 写真: 奥の院・徳川家霊台の写真はそのまま。表紙を奥の院の写真にする。壇上伽藍の写真はスポットと一緒に消える
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-koyasan-9d8e49e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "9d8e49e5-829f-44b3-b59f-8a8de36db689";
const DAY_ID = "f0c656c1-f426-4e09-bdea-73fa0078310e";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine?: string };
const legs = (...xs: [string, number, string?][]): Leg[] =>
  xs.map(([mode, min, line], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, ...(line ? { transitLine: line } : {}) }));
const L = (...xs: [string, number, string?][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number, string?][]) => ({ create: legs(...xs) });

const OKU = "77c1a56a-14e1-4dcc-b05c-c1a28f6f6f87";
const REIDAI = "70efb688-aa61-4443-b5c9-bf3d92c38e60";
const SANMAI = "34e21abf-a920-4ac5-985b-34b3fa1b7434";
const KONGOBU = "764e3c14-a24e-4564-a08c-9d0ecb39e08a"; // 外す
const GARAN = "91d3f89e-a838-490c-a6bb-df7d326e6f51"; // 外す
const REIHO = "b3b69d79-46a1-4bc9-b643-17372d6cae29";
const DAIMON = "7d98a144-71c1-4104-9f6d-bad58feda4a6"; // 外す
const REMOVE = [KONGOBU, GARAN, DAIMON];

const EXPECT: Record<string, string> = {
  [OKU]: "奥の院", [REIDAI]: "徳川家霊台", [SANMAI]: "金剛三昧院", [KONGOBU]: "金剛峯寺",
  [GARAN]: "壇上伽藍・根本大塔", [REIHO]: "高野山霊宝館", [DAIMON]: "大門",
};
const PHOTOS_EXPECT = ["1247ec82-618b-4241-85ef-f9f29e09606d", "15dee34f-6743-4d2c-8626-b762db925710", "4a7325d5-3eae-4deb-a402-3c179a668beb"].sort();
const THUMB_OLD =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-09/%25E5%25BE%25B3%25E5%25B7%259D%25E5%25AE%25B6%25E9%259C%258A%25E5%258F%25B0-79C0bjofL5k2jMLp89zQZWzttWcMUK.jpg";
const THUMB_NEW =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/photoadd-20261012-b2/%25E5%25A5%25A5%25E3%2581%25AE%25E9%2599%25A2-CakuRyy3QGTUzcQHIPpVq4YD4UwJNP.jpg";

const TITLE_OLD = "奥の院の杉並木と燈籠堂、弘法大師の御廟を訪ねる祈りの旅";
const TITLE_NEW = "奥之院の杉並木と燈籠堂、女人堂まで高野山の祈りの道をたどる日帰りプラン";
const DESC_OLD = "樹齢数百年の杉並木に、20万基を超える墓石や供養塔が並ぶ奥の院。弘法大師が今も瞑想を続けるとされる御廟までの参道を歩くプランです。";
const DESC_NEW =
  "一の橋から約2kmの杉木立の参道を歩いて燈籠堂と弘法大師御廟へ。午後は苅萱堂、高野山大師教会、六時の鐘、徳川家霊台、女人禁制の時代を伝える女人堂、国宝の多宝塔が残る金剛三昧院をめぐり、高野山霊宝館で寺宝にふれる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  oku:
    "高野山駅前からバスでおよそ20分、一の橋口で降りて、奥之院の入口の一の橋に着きます。バスの時刻は公式で確かめましょう。奥之院は、弘法大師が御入定されている高野山の信仰の中心の聖地で、一の橋から渡ってお参りするのが正式とされています。御廟まで約2kmの道は、樹齢千年に及ぶとされる杉木立に包まれ、20万基を超える墓石や祈念碑、慰霊碑が両側に続きます。墓石や供養塔のまわりでは、静かに過ごしましょう。参道の奥の燈籠堂は、高野山の第二世・真然大徳が建てたと伝わり、治安3年(1023)に藤原道長によって、ほぼ今の大きさになったとされます。堂内では「消えずの火」と呼ばれる燈籠が今も灯り続けています。その奥の弘法大師御廟は、大師信仰の中心の聖地です。御廟橋から先は、写真を撮らず静かにお参りしましょう。" +
    PRAY +
    "燈籠堂の開堂は6:00〜17:00です。この後は、燈籠堂から奥の院前のバス停まで歩いておよそ13分、バスでおよそ3分の苅萱堂へ向かいましょう。",
  karukaya:
    "燈籠堂から奥の院前のバス停まで歩いておよそ13分、バスでおよそ3分の苅萱堂前で降り、歩いておよそ1分で苅萱堂に着きます。バスの時刻は曜日で変わるので、公式の時刻表で確かめましょう。苅萱道心が出家したのち、この地で仏道の修行に明け暮れたと伝わるお堂で、苅萱道心と石道丸の話は古くから広く語り継がれてきました。" +
    PRAY +
    "この後は、歩いておよそ8分、千手院橋のあたりへ向かいましょう。",
  lunch: "苅萱堂から歩いておよそ8分、千手院橋のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ7分、高野山大師教会へ向かいましょう。",
  daishi:
    "千手院橋のあたりから歩いておよそ7分、高野山大師教会に着きます。高野山真言宗の布教などの総本部で、大講堂は高野山開創1100年を記念して大正14年(1925)に建てられ、弘法大師を本尊に、愛染明王と不動明王がまつられています。大講堂の奥の授戒堂では、阿闍梨から戒めの教えを授かり法話をいただく「授戒」が1日に何回か行われていて、加わることもできます。" +
    PRAY +
    "この後は、歩いておよそ3分、六時の鐘へ向かいましょう。",
  rokuji:
    "高野山大師教会から歩いておよそ3分、高い石垣の上に立つ六時の鐘に着きます。福島正則が父母の菩提を弔うために、元和4年(1618)に建てた鐘楼で、今も午前6時から午後10時まで、偶数の時刻に鐘をついて時を知らせています。この後は、歩いておよそ12分、徳川家霊台へ向かいましょう。",
  sanmai:
    "女人堂から歩いておよそ19分、金剛三昧院に着きます。建暦元年(1211)、北条政子が源頼朝の菩提を弔うために建てた禅定院が始まりとされる寺院です。境内の多宝塔は貞応2年(1223)に建てられたといわれ、石山寺の多宝塔とともに、最も古い時期の多宝塔に属するとされる国宝です。" +
    PRAY +
    "この後は、歩いておよそ14分、高野山霊宝館へ向かいましょう。",
  reiho:
    "金剛三昧院から歩いておよそ14分、高野山霊宝館に着きます。金剛峯寺をはじめ、高野山の寺院に伝わる仏像や仏画などの文化遺産を守り、公開するために、大正10年(1921)に開かれた施設です。宇治の平等院を模して建てられた本館は、大正の建物として登録有形文化財になっています。収蔵品は約2万8千点にのぼり、その中には国宝が21件、重要文化財が148件あります。展示は、企画展や特別展で入れ替わります。開館は9:00〜17:00(入館は16:30まで)です。祈りの道をたどった1日を締めくくったら、千手院橋のバス停まで歩いておよそ12分、高野山駅前行きのバスでおよそ22分です。バスの時刻は公式で確かめましょう。",
  reidai:
    "六時の鐘から歩いておよそ12分、徳川家霊台に着きます。寛永20年(1643)に三代将軍・家光が建てた霊廟で、並んで立つ2つの建物のうち、向かって右が家康、左が秀忠の霊舎です。国の重要文化財に指定されています。霊廟のまわりでは、静かに過ごしましょう。この後は、歩いておよそ7分、女人堂へ向かいましょう。",
  nyonin:
    "徳川家霊台から歩いておよそ7分、女人堂に着きます。かつて高野山には七つの登り口があり、明治5年(1872)に女人禁制が解かれるまで女性の立ち入りが厳しく制限されていたため、それぞれの登り口に女性のための参籠所が設けられ、女人堂と呼ばれました。今の女人堂は、そのうち唯一残る建物とされ、令和6年(2024)に和歌山県の文化財に指定されています。" +
    PRAY +
    "この後は、歩いておよそ19分、金剛三昧院へ向かいましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "奥之院(既存・改名。点 入口「奥之院表参道一の橋案内所」way495742583、区間なし。滞在の中で燈籠堂まで歩く)",
    item: { id: OKU, data: { name: "奥之院(一の橋から燈籠堂・御廟まで)", lat: "34.213659", lng: "135.595499", visitTime: T(9, 30), stayDurationMin: 100, memo: M.oku, transitLegs: { deleteMany: {} } } },
  },
  {
    label: "苅萱堂(新規。点 地理院地図の注記「苅萱堂」。燈籠堂→奥の院前 歩き13、待ち11、バス3、バス停から歩き1)",
    item: {
      create: {
        name: "苅萱堂", lat: "34.212406", lng: "135.593041", visitTime: T(11, 38), stayDurationMin: 20, memo: M.karukaya,
        transitLegs: C(["walk", 13], ["other", 11], ["bus", 3, "南海りんかんバス"], ["walk", 1]),
      },
    },
  },
  {
    label: "千手院橋のあたりで昼食(新規。点 バス停「千手院橋」node1898351685、歩き8)",
    item: { create: { name: "千手院橋のあたりで昼食", lat: "34.21302", lng: "135.586738", visitTime: T(12, 6), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["walk", 8]) } },
  },
  {
    label: "高野山大師教会(新規。点 案内板「高野山大師教会本部 高野山教化研修道場」node7738725326、歩き7)",
    item: {
      create: {
        name: "高野山大師教会", address: "伊都郡高野町高野山347", lat: "34.212148", lng: "135.582646",
        visitTime: T(12, 53), stayDurationMin: 45, memo: M.daishi, transitLegs: C(["walk", 7]),
      },
    },
  },
  {
    label: "六時の鐘(新規。点 way514883171、4072c8d3 と同じ。歩き3)",
    item: { create: { name: "六時の鐘", lat: "34.21325", lng: "135.583323", visitTime: T(13, 41), stayDurationMin: 10, memo: M.rokuji, transitLegs: C(["walk", 3]) } },
  },
  {
    label: "徳川家霊台(既存。点 node4853424221、15c4b54a と同じ。歩き12)",
    item: { id: REIDAI, data: { lat: "34.217454", lng: "135.583038", visitTime: T(14, 3), stayDurationMin: 20, memo: M.reidai, transitLegs: L(["walk", 12]) } },
  },
  {
    label: "女人堂(新規。点 place_of_worship node4853418822、歩き7)",
    item: { create: { name: "女人堂", lat: "34.218885", lng: "135.581109", visitTime: T(14, 30), stayDurationMin: 15, memo: M.nyonin, transitLegs: C(["walk", 7]) } },
  },
  {
    label: "金剛三昧院(既存。点 node5092538163、15c4b54a と同じ。歩き19)",
    item: { id: SANMAI, data: { lat: "34.210124", lng: "135.586984", visitTime: T(15, 4), stayDurationMin: 30, memo: M.sanmai, transitLegs: L(["walk", 19]) } },
  },
  {
    label: "高野山霊宝館(既存。点 way393562428、15c4b54a と同じ。歩き14、帰りの一文)",
    item: { id: REIHO, data: { lat: "34.211283", lng: "135.580888", visitTime: T(15, 48), stayDurationMin: 60, memo: M.reiho, transitLegs: L(["walk", 14]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (it?.thumbnailUrl !== THUMB_OLD) throw new Error(`表紙が想定と違います: ${it?.thumbnailUrl}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, url: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  if (!photos.some((p) => p.url === THUMB_NEW)) throw new Error("新しい表紙の写真(奥の院)が見つかりません");

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n表紙: 徳川家霊台の写真 → 奥の院の写真(どちらも今ある写真)\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create
      ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+")
      : lg?.deleteMany ? "(区間を消す)" : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 奥の院・徳川家霊台はそのまま、壇上伽藍の写真はスポットと一緒に消える");
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:06(13:30より前)/ 終わり 高野山霊宝館 16:48(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, thumbnailUrl: THUMB_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

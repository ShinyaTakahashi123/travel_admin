/**
 * 出雲大社、縁結びの神様に参拝する日帰り(bb5348fc)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の bb5348fc の欄。設計の表は企画運営・法務とも OK(11/04 20:30)。
 * - 21f198de とほぼ同じ回り方だったため、ほかの4本(21f198de・d686aaf2・7da7343c・33100ce1)と重なる日御碕灯台・日御碕神社・稲佐の浜を外し、
 *   旧大社駅も外して、古代出雲の遺跡(荒神谷・加茂岩倉)を入れる(企画運営)
 * - 弥生の森と西谷墳墓群を1つの行き先にまとめ、点は博物館 way411212826 の中心(企画運営、7章)
 * - 始まり 8:45 は開館 9:00 より前だったので 9:30 に。歩きはすべて実測以上、25分を超える歩きはなくす
 * - 点: 弥生の森 → way411212826 の中心、出雲大社・命主社・神門通り → 33100ce1 などと同じ点のまま、
 *   神祜殿 → way404484666(33100ce1 と同じ)、出雲阿国の墓 → historic=tomb node4582064232、
 *   荒神谷博物館 → tourism=museum way242778977 の中心、加茂岩倉遺跡 → 「加茂岩倉遺跡ガイダンス」tourism=museum way1290204531 の中心
 * - 区間(routing.openstreetmap.de): 店→弥生の森 車 5.2→11、弥生の森→出雲大社 車 13.4→19、出雲大社→神祜殿 歩 3.4→4、
 *   神祜殿→命主社 歩 4.4→5、命主社→神門通り 歩 13.4→14、神門通り→阿国の墓 歩 14.3→15、阿国の墓→出雲大社の駐車場 歩 9.3→10 ＋ 車 18.3→24、
 *   荒神谷→加茂岩倉 車 14.0→19、加茂岩倉→出雲市駅 車 19.8→25(帰りの一文)
 * - 時刻: 9:30〜16:55(加茂岩倉の閉館 17:00 より前)
 * - 題から「定番」を外す。神門通りの店・出雲そばの話、出典のない文を外す。お墓は「…のまわりでは、静かに過ごしましょう」の形
 * - 灯台・日御碕神社の写真は行き先と一緒に消える。表紙(出雲大社の写真)はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-izumo-bb5348fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";
const DAY_ID = "0298dd3b-20e6-4818-a87d-377c309b9543";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
type Leg = [Mode, number];
const L = (...legs: Leg[]) => ({ deleteMany: {}, create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });
const C = (...legs: Leg[]) => ({ create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });

const YAYOI = "9236fd0c-eb48-4ce1-ad4a-e1a6274484a1";
const TAISHA = "25ba1bc6-80c4-469f-9c39-207cb9bdc200";
const SHINKO = "75495bc3-200c-4680-b550-32ed8522a4f9";
const INOCHI = "0ea15387-7e48-4a95-8600-e07e3fd724dc";
const LUNCH = "7ecdb55f-47f0-4dc0-bcf2-fcc568295d2f";
const INASA = "66526a44-a8a2-45a0-96c2-c15bb94c2dd1"; // 外す
const OKUNI = "0a33963e-fecf-4814-be96-d95cd8b4f0a3";
const EKI = "4eb61bea-41f6-41af-b392-37eb4b77cf47"; // 外す
const TODAI = "7944cdf2-5a99-4171-b773-7b9df55db3cd"; // 外す(写真 bd16f782 も消える)
const HINO = "4870bc2b-cf0e-45f1-8357-0f91a3d0bf5b"; // 外す(写真 d6297331 も消える)
const REMOVE = [INASA, EKI, TODAI, HINO];

const EXPECT: Record<string, string> = {
  [YAYOI]: "出雲弥生の森博物館", [TAISHA]: "出雲大社", [SHINKO]: "神祜殿(宝物殿)", [INOCHI]: "命主社", [LUNCH]: "神門通りで昼食",
  [INASA]: "稲佐の浜", [OKUNI]: "出雲阿国の墓", [EKI]: "旧大社駅", [TODAI]: "出雲日御碕灯台", [HINO]: "日御碕神社",
};
const PHOTOS_EXPECT = ["f322fc0c-5991-48c6-8907-f9af4d503833", "bd16f782-e4d4-4053-be73-33cfdc83ae74", "d6297331-006b-4ade-935f-42c4d0611b3f"].sort();

const TITLE_OLD = "出雲大社、縁結びの神様に参拝する定番日帰りプラン";
const TITLE_NEW = "出雲大社と古代出雲の遺跡、弥生の森・荒神谷・加茂岩倉をめぐる日帰りプラン";
const DESC_OLD =
  "『古事記』にも登場する縁結びの神様・大国主大神を祀る出雲大社を中心に、神話の舞台や博物館、灯台もめぐる、出雲観光の定番日帰りプランです。";
const DESC_NEW =
  "出雲平野の王が葬られたと考えられている西谷墳墓群から出雲大社へ。命主社や神祜殿をたずね、銅剣と銅鐸がまとまって出土した荒神谷・加茂岩倉まで、古代出雲の歴史をレンタカーでめぐる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  yayoi:
    "JR出雲市駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ11分、出雲弥生の森博物館に着きます。博物館のとなりに広がる西谷墳墓群は、弥生時代後期の墳墓群で、国の史跡に指定されています。県の案内では、3・2・4・9号墓は全国最大級の四隅突出型墳丘墓とされ、代々の出雲平野の王が葬られたと考えられています。博物館では、西谷墳墓群の出土品や模型、調査のときの様子を展示しています。史跡公園では、築造時の姿に復元された2号墓や、墳丘に登って見学できる3号墓を見ることができます。西谷墳墓群のまわりでは、静かに過ごしましょう。博物館は、火曜日(祝日の場合は翌平日)と年末年始が休館です。この後は、車でおよそ19分、出雲大社へ向かいましょう。",
  taisha:
    `出雲弥生の森博物館から車でおよそ19分、出雲大社に着きます。大国主大神をおまつりする神社で、現在の御本殿は延享元年(1744)に造営されたものです。${PRAY}この後は、歩いておよそ4分、神祜殿へ向かいましょう。`,
  shinko:
    "出雲大社から歩いておよそ4分、神祜殿に着きます。出雲大社の宝物を展示する施設で、1階の中央には、2000年の発掘調査で見つかった13世紀中ごろの御本殿の心御柱が置かれています。2階には、東へ200mほど離れた命主社の境内から17世紀に出土した、勾玉と銅戈も展示されています。この後は、歩いておよそ5分、命主社へ向かいましょう。",
  inochi:
    `神祜殿から歩いておよそ5分、命主社に着きます。出雲大社の東に鎮座する摂社で、江戸時代の出雲大社本殿の造営の際に、社殿の背後の大石の下から、ヒスイの勾玉と青銅器が出土したと記録されています。今も、社殿の背後には大石があります。${PRAY}この後は、歩いておよそ14分、神門通りで昼食にしましょう。`,
  lunch:
    "命主社から歩いておよそ14分、神門通りで昼食にしましょう。この後は、歩いておよそ15分、出雲阿国の墓へ向かいましょう。",
  okuni:
    "神門通りから歩いておよそ15分、出雲阿国の墓に着きます。出雲阿国は、歌舞伎の始まりをつくったと伝えられる女性芸能者で、ここは阿国ゆかりの墓所です。小高い丘の墓地の中にあります。出雲阿国の墓のまわりでは、静かに過ごしましょう。この後は、出雲大社の駐車場まで歩いておよそ10分、そこから車でおよそ24分、荒神谷博物館へ向かいましょう。",
  kojindani:
    "出雲阿国の墓から、出雲大社の駐車場まで歩いておよそ10分、そこから車でおよそ24分、荒神谷博物館に着きます。荒神谷遺跡は、昭和58年(1983)の農道の建設にともなう遺跡の分布調査で見つかりました。翌年の発掘調査では、4列に並んだ358本の銅剣が一度に出土し、博物館の案内では国内最多とされています。その翌年には、7mほど離れた場所から銅鐸6個と銅矛16本も出土しました。遺跡のまわりは史跡公園になっていて、復元された竪穴式住居もあります。展示室は火曜日(祝日の場合は、その直後の平日)が休みで、入館は16:30までです。この後は、車でおよそ19分、加茂岩倉遺跡へ向かいましょう。",
  kamoiwakura:
    "荒神谷博物館から車でおよそ19分、加茂岩倉遺跡ガイダンスに着きます。加茂岩倉遺跡は、平成8年(1996)に農道の工事中に見つかった遺跡で、39個の銅鐸が一度に出土しました。市の案内では、一度に出土した銅鐸の数として全国最多とされ、出土した銅鐸は平成20年(2008)に国宝に指定されています。銅鐸の出土地のそばにあるガイダンスでは、出土した銅鐸のレプリカや、ビデオ映像を見ることができます。火曜日(祝祭日を除く)と年末年始は休館です。閉館は17:00なので、時刻に気をつけましょう。帰りは、JR出雲市駅まで車でおよそ25分。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "出雲弥生の森博物館と西谷墳墓群(既存・改名。点 way411212826 の中心、始まり 8:45→9:30、入口の一文)",
    item: { id: YAYOI, data: { name: "出雲弥生の森博物館と西谷墳墓群", lat: "35.357989", lng: "132.781433", visitTime: T(9, 30), stayDurationMin: 75, memo: M.yayoi } },
  },
  { label: "出雲大社(既存。点そのまま、車20→19)", item: { id: TAISHA, data: { visitTime: T(11, 4), stayDurationMin: 70, memo: M.taisha, transitLegs: L(["car", 19]) } } },
  {
    label: "神祜殿(宝物殿)(既存。点 way404484666、33100ce1 と同じ。歩き3→4)",
    item: { id: SHINKO, data: { lat: "35.401118", lng: "132.686062", visitTime: T(12, 18), stayDurationMin: 20, memo: M.shinko, transitLegs: L(["walk", 4]) } },
  },
  {
    label: "命主社(既存。点 33100ce1 と同じ 35.401014,132.68869。歩き3→5)",
    item: { id: INOCHI, data: { lat: "35.401014", lng: "132.68869", visitTime: T(12, 43), stayDurationMin: 10, memo: M.inochi, transitLegs: L(["walk", 5]) } },
  },
  { label: "神門通りで昼食(既存。点そのまま、歩き10→14)", item: { id: LUNCH, data: { visitTime: T(13, 7), stayDurationMin: 40, memo: M.lunch, transitLegs: L(["walk", 14]) } } },
  {
    label: "出雲阿国の墓(既存。点 historic=tomb node4582064232、歩き15)",
    item: { id: OKUNI, data: { lat: "35.399373", lng: "132.679536", visitTime: T(14, 2), stayDurationMin: 10, memo: M.okuni, transitLegs: L(["walk", 15]) } },
  },
  {
    label: "荒神谷博物館(新規。点 tourism=museum way242778977 の中心、歩き10＋車24)",
    item: {
      create: {
        name: "荒神谷博物館と荒神谷遺跡", address: "出雲市斐川町神庭873-8", lat: "35.376696", lng: "132.850418",
        visitTime: T(14, 46), stayDurationMin: 70, memo: M.kojindani, transitLegs: C(["walk", 10], ["car", 24]),
      },
    },
  },
  {
    label: "加茂岩倉遺跡(新規。点「加茂岩倉遺跡ガイダンス」tourism=museum way1290204531 の中心、車19、帰りの一文)",
    item: {
      create: {
        name: "加茂岩倉遺跡", address: "雲南市加茂町", lat: "35.359145", lng: "132.882622",
        visitTime: T(16, 15), stayDurationMin: 40, memo: M.kamoiwakura, transitLegs: C(["car", 19]),
      },
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 灯台 bd16f782・日御碕神社 d6297331 は行き先と一緒に消える。出雲大社 f322fc0c(表紙)はそのまま");
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:07(13:30より前)/ 終わり 加茂岩倉遺跡 16:55(日帰りの 16:30〜17:00、閉館 17:00 より前)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

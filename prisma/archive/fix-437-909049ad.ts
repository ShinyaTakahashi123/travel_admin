/**
 * チェックリスト #437 909049ad「川平湾、石垣島を代表するコバルトブルーを望む定番日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。石垣市立八重山博物館（新規）→ 桃林寺（新規）→ 玉取崎展望台（新規）→ 平久保崎（新規）→（昼食）→ 米原のヤエヤマヤシ群落（新規）→ 川平湾 → 御神崎（新規）（7か所 09:00〜16:40）
 * 既存の川平湾の本文は、開いた公式で確かめられない記述（日本百景、ミシュラン・グリーンガイドの3つ星、約300種のサンゴ・1,000種以上の熱帯魚、遊泳禁止の理由）が多かったので、
 *   文化遺産オンライン（名勝「川平湾及び於茂登岳」）の説明で書き直す
 * 写真: 川平湾の写真は合っているので残す
 * 本文の出典: 石垣市観光交流協会 石垣市立八重山博物館 https://yaeyama.or.jp/%E7%9F%B3%E5%9E%A3%E5%B8%82%E7%AB%8B%E5%85%AB%E9%87%8D%E5%B1%B1%E5%8D%9A%E7%89%A9%E9%A4%A8/ ・
 *   桃林寺 https://yaeyama.or.jp/%E6%A1%83%E6%9E%97%E5%AF%BA/ ・玉取崎展望台 https://yaeyama.or.jp/%E7%8E%89%E5%8F%96%E5%B4%8E%E5%B1%95%E6%9C%9B%E5%8F%B0/ ・
 *   平久保崎 https://yaeyama.or.jp/%E5%B9%B3%E4%B9%85%E4%BF%9D%E5%B4%8E/ ・米原ヤエヤマヤシ群落 https://yaeyama.or.jp/%E7%B1%B3%E5%8E%9F%E3%83%A4%E3%82%A8%E3%83%A4%E3%83%9E%E3%83%A4%E3%82%B7%E7%BE%A4%E8%90%BD-2/ ・
 *   御神崎 https://yaeyama.or.jp/%E5%BE%A1%E7%A5%9E%E5%B4%8E/ ・グラスボート https://yaeyama.or.jp/play/glassboat/ ／川平湾 文化遺産オンライン https://online.bunka.go.jp/heritages/detail/140097
 * 座標の出典: Nominatim（石垣市立八重山博物館 24.3380672,124.1595799／桃林寺 24.3437512,124.1555183／玉取崎展望台 24.4905396,124.2788718／平久保崎 24.6119999,124.3163538／
 *   米原のヤエヤマヤシ群落 24.4508940,124.1949470／川平湾 24.4500748,124.1436464／御神崎灯台 24.4525990,124.0786570）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-437-909049ad.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "909049ad-4221-402a-b7e0-61d8d794adb7";
const DAY1_ID = "37442ef3-bf09-43c5-8c5c-bf6a963f43c6";
const KABIRA = "473e1227-d716-4e2c-b57f-037487fd0eaf";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "八重山の歴史と文化を知る八重山博物館と桃林寺から、平久保半島を望む玉取崎展望台、島の北端の平久保崎、ヤエヤマヤシの群落をめぐり、名勝の川平湾へ。最後は島の最西端・御神崎の断崖からの眺めで締めくくる、石垣島をぐるりと車でめぐる日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("石垣市立八重山博物館", 9, 0, 50, null, null, 24.338067, 124.15958, "沖縄県石垣市登野城4-1",
    "旅の始まりは、石垣市の中心部にある石垣市立八重山博物館へ。八重山の歴史と文化を知ることができる民族資料や美術工芸品を収蔵・展示しています。これから島をめぐる前に、八重山の暮らしと歴史にふれておきましょう。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("桃林寺", 10, 0, 25, "car", 10, 24.343751, 124.155518, "沖縄県石垣市石垣285",
    "博物館から車ですぐ。八重山最古の寺院とされ、薩摩藩から八重山への社寺建築の進言を受けた琉球王国の尚寧王によって、1614年に鑑翁西堂を開山として創建されました。今は臨済宗妙心寺派の寺院で、入口の仁王像は沖縄県に現存する最古の木彫りの像とされます。" + RESPECT),
  cre("玉取崎展望台", 10, 55, 30, "car", 30, 24.49054, 124.278872, "沖縄県石垣市伊原間",
    "桃林寺から車で島の北へ。平久保半島と石垣の海を一望できる景勝地で、展望台からは左に伊原間湾、正面にはんな岳、右に美しいサンゴ礁の海が広がります。展望台へ続く遊歩道には、一年中ハイビスカスの花が咲いています。"),
  cre("平久保崎", 11, 50, 40, "car", 25, 24.612, 124.316354, "沖縄県石垣市平久保",
    "玉取崎展望台から車で、平久保半島の最北端・平久保崎へ。灯台のあたりからは、右手に太平洋、左手に東シナ海という景色が広がります。平久保崎灯台は「恋する灯台」にも認定されています。岬では風が強いこともあるので、足元に気をつけましょう。このあと、北部で昼食にしましょう。"),
  cre("米原のヤエヤマヤシ群落", 14, 0, 35, "car", 35, 24.450894, 124.194947, "沖縄県石垣市",
    "昼食のあとは、米原のヤエヤマヤシ群落へ。ヤエヤマヤシは、八重山諸島の中でも石垣島と西表島にしか生えない固有種の珍しいヤシで、幹の太さ30cm、高さ25mにもなる大型のヤシです。その美しさから「世界でもっとも美しいヤシ」と称されることもあり、群落は国の天然記念物に指定されています。散策道は滑りやすく、階段も多いので、歩きやすい靴で歩きましょう。"),
  {
    id: KABIRA,
    data: {
      visitTime: t(14, 50), stayDurationMin: 60, transitMode: "car", transitDurationMin: 15, transitLine: null, lat: 24.450075, lng: 124.143646,
      memo: "米原から車で、名勝の川平湾へ。石垣島の北西岸にある、サンゴ礁の切れ目で外の海とつながる湾で、湾には小島が横たわり、その西北に真謝離やサイ離をはじめとする9つの隆起珊瑚礁の岩島が点在しています。平成9年（1997年）に、於茂登岳とあわせて国の名勝「川平湾及び於茂登岳」に指定されました。湾内はグラスボートでめぐることができ、船の底からサンゴや魚を眺められます。海に入るときは、現地の案内や決まりに従いましょう。",
    },
  },
  cre("御神崎", 16, 5, 35, "car", 15, 24.452599, 124.078657, "沖縄県石垣市崎枝",
    "川平湾から車で、石垣島の最西端・御神崎へ。断崖絶壁から見渡す景色は荒々しく、先端には御神崎灯台が立っています。春先にはテッポウユリなどの花があたりを彩り、夕日の名所としても知られています。断崖の近くでは足元に気をつけましょう。石垣島をぐるりとめぐる旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== KABIRA) throw new Error("構成が想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "川平湾(既存)" : d.name} ${String(d.memo).length}字`);
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

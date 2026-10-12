/**
 * チェックリスト #377 d7672ba8「スパリゾートハワイアンズ、南国リゾート気分を楽しむ定番プラン」の見直し（しおりえ(制作補助2)）
 * 白水阿弥陀堂 → いわき市石炭・化石館 ほるる → スパリゾートハワイアンズ → 温泉神社 → さはこの湯公衆浴場（5か所 09:00〜16:50）
 * 既存のハワイアンズはIDのまま本文・時刻・座標を直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-377-d7672ba8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d7672ba8-0106-459a-ba9b-b46a13b5e0b8";
const DAY1_ID = "04f5c80b-169d-45d2-8f67-65a69a4eae27";
const HAWAIIANS_ID = "a63836cb-23d4-4162-a87e-49a58dd3a924";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "映画『フラガール』の舞台としても知られるスパリゾートハワイアンズを中心に、国宝の白水阿弥陀堂、常磐炭田の歴史を伝える石炭・化石館、古くからの湯の町・いわき湯本温泉をめぐる日帰りプラン。炭鉱の町が南国リゾートに生まれ変わった物語をたどります。";

const MEMO_HAWAIIANS =
  "湯本駅前から送迎バスで約15分。かつて常磐炭田の炭鉱の町だったこの地に生まれた、南国リゾート施設です。石炭を掘ると大量に湧き出す温泉は、長く採掘の悩みの種でしたが、石炭産業が衰えていくなか、その温泉を生かしてハワイのような楽園をつくろうという発想から、1966年に「常磐ハワイアンセンター」として開業しました。炭鉱で働く人の家族の娘たちがダンサーとなって踊ったフラダンスショーの誕生の物語は、2006年に映画『フラガール』として描かれ、大きな話題になりました。館内で昼食をとりながら、温水プールや温泉、フラダンスのショーを楽しみましょう。ショーの時間は公式の案内で確かめてください。プールや浴場では、ほかの人を撮らないなど館内の決まりを守りましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode?: string; dur?: number; line?: string; lat: number; lng: number; address: string; memo: string };

const BEFORE: NewSpot[] = [
  {
    name: "白水阿弥陀堂",
    h: 9, m: 0, stay: 60,
    lat: 37.039525, lng: 140.837271,
    address: "福島県いわき市内郷白水町広畑221",
    memo:
      "JR常磐線の内郷駅から歩いて約20分。平安時代の終わり、1160年に、奥州藤原氏の藤原清衡の娘・徳姫が、亡き夫・岩城則道の供養のために建てたと伝えられる阿弥陀堂です。ゆるやかな曲線を描く屋根をもつ、平安時代後期を代表する阿弥陀堂の建築で、1952年に国宝に指定され、福島県でただ一つの国宝の建物とされています。発掘調査で、お堂が大きな池の中島に建っていたことが分かり、池をめぐらせた浄土庭園が整えられています。池の向こうにお堂を望むと、極楽浄土を思い描いた当時の人々の祈りが伝わってくるようです。拝観できる時間は季節で変わり、休みの日もあるので、公式の案内で確かめましょう。今も祈りが続くお堂ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "いわき市石炭・化石館 ほるる",
    h: 10, m: 45, stay: 60, mode: "train", dur: 45, line: "JR常磐線（内郷→湯本、1駅。駅まで徒歩約20分、湯本駅から徒歩約15分）",
    lat: 37.01279, lng: 140.848444,
    address: "福島県いわき市常磐湯本町向田",
    memo:
      "内郷駅からJR常磐線で1駅、湯本駅から歩いて約15分。常磐炭田の歴史と、地元で見つかった化石を紹介する博物館で、愛称は「ほるる」です。ロビーで出迎えてくれるのは、1968年に地元の高校生が見つけたクビナガリュウ「フタバスズキリュウ」の全身復元骨格。館内の模擬坑道では、地下600mへ下りていくような体験をしながら、昔から近年までの石炭の掘り方の移り変わりをたどれます。戦後の日本の復興を支えた炭鉱の暮らしを知っておくと、このあと訪れるハワイアンズの誕生の物語がぐっと身近に感じられます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
];

const AFTER: NewSpot[] = [
  {
    name: "温泉神社",
    h: 15, m: 45, stay: 25, mode: "bus", dur: 30, line: "スパリゾートハワイアンズ送迎バス（ハワイアンズ→湯本駅、約15分）",
    lat: 37.008304, lng: 140.845432,
    address: "福島県いわき市常磐湯本町三函322",
    memo:
      "送迎バスで湯本駅に戻り、歩いて約10分。いわき湯本温泉を守る神社で、673年に湯の岳の山頂からこの三函の地へ移されたと伝えられ、平安時代の延喜式にも名が載る古い社です。いわき湯本温泉は古くから「三函の御湯」とも呼ばれ、道後・有馬と並ぶ日本三古湯の一つともいわれます。境内には、湯の岳の岩を用いた「むすび磐境」があります。湯で体を清め、神社で心を清めてきた温泉の町の信仰にふれてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "さはこの湯公衆浴場",
    h: 16, m: 15, stay: 35, mode: "walk", dur: 5,
    lat: 37.010261, lng: 140.845756,
    address: "福島県いわき市常磐湯本町三函176-1",
    memo:
      "温泉神社から歩いてすぐの公衆浴場です。名前は、この地の古い呼び名「佐波古（さはこ）」にちなみ、江戸時代の終わりごろの建築様式を再現した純和風の建物が目を引きます。源泉かけ流しの硫黄泉で、檜風呂と岩風呂があります。旅の終わりに、昔ながらの湯の町の雰囲気の中で、ひと風呂浴びていきましょう。浴場ではほかの人を撮らず、施設の決まりを守りましょう。帰りは、ここから歩いて湯本駅へ向かいます。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode ?? null, transitDurationMin: s.dur ?? null, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID) throw new Error("日の構成が想定と違います");
  const ids = days[0].spots.map((s) => s.id).join(",");
  if (ids !== HAWAIIANS_ID) throw new Error(`既存スポットが想定と違います: ${ids}`);

  const order = [
    ...BEFORE.map(toCreate),
    { id: HAWAIIANS_ID, data: { visitTime: t(12, 15), stayDurationMin: 180, transitMode: "bus", transitDurationMin: 30, transitLine: "スパリゾートハワイアンズ送迎バス（湯本駅→ハワイアンズ、約15分）", lat: 36.992452, lng: 140.813201, memo: MEMO_HAWAIIANS } },
    ...AFTER.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${gap} ${"id" in x ? "スパリゾートハワイアンズ(既存)" : d.name} ${String(d.memo).length}字`);
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

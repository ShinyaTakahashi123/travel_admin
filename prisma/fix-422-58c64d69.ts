/**
 * チェックリスト #422 58c64d69「鶴ヶ城と七日町通り、定番の会津若松さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。鶴ヶ城 → 茶室麟閣 →（車）御薬園 →（車）会津武家屋敷（昼食）→（車）飯盛山（白虎隊十九士の墓）→ さざえ堂 →（車）七日町通り（7か所 09:00〜16:35）
 * 既存の2か所はIDのまま、本文を一文ずつ確かめて書き直す（前の本文は案内役の話し言葉「皆様、…」で、公式と合わない記述もあった）:
 *   - 鶴ヶ城: 「天正から文禄に蒲生氏郷が築いた」は、公式の「約630年前に葦名直盛が築いた東黒川館が始まり」と合わないので直す（氏郷は1593年に天守閣を完成）。
 *     鶴千代の由来・保科正之の命の赤瓦は確かめられないので外す
 *   - 七日町通り: 会津五街道の記述などは確かめられないので、公式の説明（七の日の市が名の由来・西の玄関口）に直す
 * 既存の写真（鶴ヶ城の天守と走長屋）は目で見て合っているので残す
 * 本文の出典: 会津若松観光ナビ「会津若松の見どころを巡る1日コース」https://www.aizukanko.com/course/787 （鶴ヶ城・御薬園・白虎隊十九士の墓・さざえ堂・七日町通り）／
 *   さざえ堂 https://www.aizukanko.com/spot/138 ／鶴ヶ城の年表 https://www.tsurugajo.com/tsurugajo/aizu-history/ ／鶴ヶ城 https://www.tsurugajo.com/tsurugajo/ ／
 *   茶室麟閣 https://www.tsurugajo.com/tsurugajo/rinkaku/ ／御薬園 https://www.tsurugajo.com/tsurugajo/oyakuen/ ／会津武家屋敷 https://www.bukeyashiki.com/
 * 座標の出典: Nominatim（鶴ヶ城 37.4877353,139.9297661／麟閣 37.4867678,139.9308172／御薬園 37.4910814,139.9439165／会津武家屋敷 37.4855462,139.9535340／
 *   さざえ堂 37.5049913,139.9535242／七日町通り 37.5011455,139.9184378）、OSM/Overpass（白虎隊士十九士の墓 37.5041602,139.9544793）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-422-58c64d69.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "58c64d69-20fc-4509-912f-a99098a6d0fe";
const DAY1_ID = "5e27dde1-6233-44cb-a447-0c28bfbba751";
const CASTLE_ID = "c86e8148-2b5d-44ca-857f-c4eb60a95f5a";
const NANOKA_ID = "bf71b92f-1d32-4e31-b39e-fc1cf64fdb88";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "赤瓦の天守閣がそびえる鶴ヶ城と千家ゆかりの茶室麟閣、大名庭園の御薬園をめぐり、会津武家屋敷で武家の暮らしにふれて昼食を。白虎隊ゆかりの飯盛山とさざえ堂を訪ね、最後はレトロな七日町通りでお土産探し。会津若松の歴史と町並みを車でめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(CASTLE_ID, 9, 0, 80, null, null, 37.487735, 139.929766,
    "約630年前に葦名直盛が築いた東黒川館が始まりといわれる城で、蒲生氏郷が会津の領主となったあと、文禄2年（1593年）に天守閣が完成し、黒川の地名を若松に改めました。幕末の戊辰戦争では、約1か月に及ぶ激しい攻防戦に耐えた名城として知られています。明治7年に取り壊されましたが、昭和40年に再建され、平成23年に赤瓦の姿となりました。国内唯一の赤瓦の天守閣とされ、内部は郷土博物館になっていて、会津の歴史にふれられます。約1,000本の桜に包まれる城としても知られています。"),
  cre("茶室麟閣", 10, 25, 30, "walk", 5, 37.486768, 139.930817, "福島県会津若松市追手町1-1（鶴ヶ城城址公園内）",
    "天守閣から歩いてすぐ、千家ゆかりの茶室です。天正19年（1591年）、千利休が豊臣秀吉に死を命じられたとき、利休の茶道が絶えるのを惜しんだ会津城主・蒲生氏郷が、利休の子・少庵を会津にかくまい、徳川家康とともに秀吉に千家の再興を願い出ました。そのときに建てたのがこの麟閣と伝えられています。少庵はのちに許されて京都へ帰り、千家を再興しました。"),
  cre("御薬園", 11, 15, 45, "car", 15, 37.491081, 139.943917, "福島県会津若松市花春町8-1",
    "鶴ヶ城から車で約15分。約600年前の室町時代、会津守護職の葦名盛久が、霊泉の湧くこの地に別荘を建てたのが始まりとされる庭園です。会津松平藩の藩祖・保科正之が大名庭園として整え、2代藩主の正経は、疫病から領民を救うための薬草の研究に薬草園を設けました。戊辰戦争のときには、ここで新政府軍の病人の治療も行ったため、戦火に巻き込まれずに往時の姿をとどめています。江戸時代の代表的な大名型山水庭園として、国の名勝に指定されています。"),
  cre("会津武家屋敷（昼食）", 12, 15, 90, "car", 15, 37.485546, 139.953534, "福島県会津若松市東山町大字石山字院内1",
    "御薬園から車で約15分。西郷頼母邸を中心に、家老屋敷や中畑陣屋など数々の重要文化財から、武家の時代の暮らしをしのべる施設です。館内には無料の音声ガイドがあり、展示内容を分かりやすく解説しています。お食事処もあるので、ここで昼食にしましょう。歴史的な建物のゾーンには階段や敷石、段差があるので、足元に気をつけて歩きましょう。"),
  cre("飯盛山（白虎隊十九士の墓）", 14, 5, 45, "car", 20, 37.50416, 139.954479, "福島県会津若松市一箕町八幡弁天下",
    "武家屋敷から車で約20分。戊辰戦争のとき、16〜17歳の少年たちで編成された白虎士中二番隊は、戸の口原の合戦場から退き、飯盛山にたどり着きました。黒煙の中に見え隠れする鶴ヶ城の天守閣を見て、城が落ちたと思い、自決したと伝えられています。ただ一人生き残った飯沼貞吉によって、その物語は広く知られるようになりました。墓前では、春と秋に墓前祭が行われます。墓所は祈りの場ですので、静かに、敬意をもってお参りください。"),
  cre("さざえ堂", 14, 55, 30, "walk", 5, 37.504991, 139.953524, "福島県会津若松市一箕町八幡弁天下",
    "白虎隊士の墓から歩いて約5分。寛政8年（1796年）に建てられた、高さ16.5m、六角三層のお堂で、正式名称は「円通三匝堂」といいます。当時飯盛山にあった正宗寺の住職・郁堂が考案した建物で、かつては二重らせんのスロープに沿って西国三十三観音像が安置され、お参りすると三十三観音参りができるといわれていました。上りと下りがまったく別の通路になった一方通行の造りで、国の重要文化財に指定されています。"),
  cre("七日町通り", 15, 40, 55, "car", 15, 37.501146, 139.918438, "福島県会津若松市七日町",
    "飯盛山から車で約15分。毎月七の日に市が立ったのが名前の由来で、藩政時代には会津若松の西の玄関口としてにぎわった通りです。今も蔵造りの店や洋館が軒を連ねるレトロな町並みで、近くの野口英世青春通りとともに、会津の民工芸品の店や酒蔵が並びます。旅の最後に、会津のお土産を選びましょう。お酒は20歳から。車を運転する人は飲まないでください。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${CASTLE_ID},${NANOKA_ID}`) throw new Error("構成が想定と違います");
  // 七日町通りは最後に置くので、既存IDのまま upd で書き直す
  const nanoka = order.pop()!;
  const nanokaData = (nanoka as { create: Record<string, unknown> }).create;
  order.push({ id: NANOKA_ID, data: { visitTime: nanokaData.visitTime, stayDurationMin: nanokaData.stayDurationMin, transitMode: nanokaData.transitMode, transitDurationMin: nanokaData.transitDurationMin, transitLine: null, lat: nanokaData.lat, lng: nanokaData.lng, memo: nanokaData.memo } } as never);
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

/**
 * チェックリスト #434 8a4dbdb6「グラバー園と大浦天主堂、定番の異国情緒あふれる日帰りプラン」の見直し（しおりえ(制作補助2)）
 * グラバー園 → 大浦天主堂 → 長崎孔子廟（新規）→ オランダ坂（新規）→ 長崎新地中華街（新規、昼食）→ 出島（新規）→（路面電車）眼鏡橋（新規）（7か所 09:00〜16:30）
 * 既存の2か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - グラバー園: グラバーの来日年・出身、亀山社中や討幕派の支援、日本初の鉄道の試験走行、「和洋の様式を組み合わせた最初期の建物」は開いた公式で確かめられないので外す
 *   - 大浦天主堂: 「およそ250年」「信徒発見のマリア像が右側の脇祭壇に」は確かめられないので外す
 * 写真: グラバー園・大浦天主堂の写真は合っているので残す
 * 本文の出典: グラバー園 https://glover-garden.jp/ ・ https://glover-garden.jp/about ／長崎市公式観光サイト https://www.at-nagasaki.jp/spot/N（大浦天主堂 102／オランダ坂 105／
 *   東山手洋風住宅群 86／長崎孔子廟 108／長崎新地中華街 111／眼鏡橋 95）／出島 https://nagasakidejima.jp/history ・ https://nagasakidejima.jp/restoration/
 * 座標の出典: Nominatim（グラバー園 32.7333666,129.8690550／大浦天主堂 32.7341890,129.8701625／長崎孔子廟 32.7354575,129.8726153／オランダ坂 32.7382861,129.8731563／
 *   長崎新地中華街 32.7414507,129.8753319／出島 32.7434177,129.8729620／眼鏡橋 32.7471650,129.8801025）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-434-8a4dbdb6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8a4dbdb6-47ad-41b4-b035-91e9ebee8d20";
const DAY1_ID = "17c09f27-e6ee-45f1-9a92-98d7aaf8af70";
const GLOVER = "51dec54d-ce94-40c2-b81c-e49a70e960aa";
const OURA = "0f6357f5-1da8-4339-b6e4-f814164d8db5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "日本最古の木造洋風建築とされる旧グラバー住宅のあるグラバー園と、国宝の大浦天主堂から、孔子廟、石畳のオランダ坂を歩き、新地中華街で昼食を。午後は出島で鎖国時代の西洋への窓を訪ね、最後は眼鏡橋へ。長崎の異国情緒をめぐる定番の日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, line: string | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, address, memo },
});

const order = [
  upd(GLOVER, 9, 0, 80, null, null, 32.733367, 129.869055,
    "旅の始まりはグラバー園へ。1863年（文久3年）に南山手に建てられたトーマス・ブレーク・グラバーの邸宅（旧グラバー住宅）をはじめ、旧リンガー住宅・旧オルト住宅の3棟の国指定重要文化財と、長崎市内に点在していた貴重な伝統的建造物を移築・復元した園です。旧グラバー住宅は、現存する日本最古の木造洋風建築とされ、2015年に世界遺産に登録されました。南山手の高台からの美しい眺めも楽しみましょう。"),
  upd(OURA, 10, 25, 40, "walk", 5, 32.734189, 129.870163,
    "グラバー園から歩いてすぐ。幕末の開国後に長崎の居留地に建てられ、国内に現存する最古の教会として知られるゴシック様式の教会で、国宝です。1864年の末に完成し、翌年3月、浦上の潜伏キリシタンが訪れて信仰を告白した、世界の宗教史上にも類を見ない「信徒発見」の舞台となりました。直前に列聖された「日本二十六聖殉教者」に捧げられた教会です。1933年に国宝となり、原爆による損傷の修復を経て1953年に再び国宝に指定され、2018年には世界文化遺産「長崎と天草地方の潜伏キリシタン関連遺産」の構成資産になりました。見学の決まりや撮影の可否は、公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもって見学してください。"),
  cre("長崎孔子廟", 11, 15, 40, "walk", 10, null, 32.735458, 129.872615, "長崎県長崎市",
    "大浦天主堂から歩いて約10分。『論語』で知られる孔子をまつる霊廟で、1893年（明治26年）に中国清朝政府と華僑によって建てられ、日本で唯一の本格的な中国様式の霊廟とされます。極彩色の中国建築の美しさを間近に見られ、中国歴代博物館も併設されています。" + RESPECT),
  cre("オランダ坂", 12, 0, 30, "walk", 5, null, 32.738286, 129.873156, "長崎県長崎市東山手町",
    "孔子廟から歩いてすぐ、洋風住宅が立ち並ぶ東山手地区の石畳の坂へ。開国後も、長崎では東洋人以外の外国人を「オランダさん」と呼んでいたため、外国人居留地の坂はすべて「オランダさんが通る坂」＝オランダ坂と呼ばれていたと考えられています。坂を上った先には、1890年代ごろに建てられた7棟の木造洋館「東山手洋風住宅群」（市指定有形文化財）が残ります。石畳は雨の日に滑りやすいので、足元に気をつけましょう。"),
  cre("長崎新地中華街", 12, 40, 60, "walk", 10, null, 32.741451, 129.875332, "長崎県長崎市新地町",
    "オランダ坂から歩いて、横浜・神戸と並ぶ日本三大中華街のひとつとされる長崎新地中華街へ。南北・東西あわせて約250mの十字路に、中華料理店や中国菓子、中国雑貨の店など約40店が並んでいます。ここで昼食にしましょう。"),
  cre("出島", 13, 50, 90, "walk", 10, null, 32.743418, 129.872962, "長崎県長崎市出島町",
    "中華街から歩いて出島へ。寛永13年（1636年）、長崎を代表する豪商の「出島町人」25人の共同出資で完成した人工の島です。寛永18年（1641年）には平戸のオランダ商館がここに移され、安政6年（1859年）にオランダ商館が閉鎖されるまでの218年間、日本で唯一、西欧に開かれた窓として、日本の近代化に大きな役割を果たしました。長崎市は昭和26年度から整備に取り組み、19世紀初頭の出島の姿の復元を進めています。"),
  cre("眼鏡橋", 15, 35, 55, "train", 15, "長崎電気軌道", 32.747165, 129.880103, "長崎県長崎市魚の町",
    "出島から路面電車で眼鏡橋へ。寛永11年（1634年）に、興福寺の黙子如定禅師が架けたとされる、現存する最古のアーチ型石橋の一つとされる、国の重要文化財です。川面に映る影が二つの円を描き、眼鏡のように見えることから名付けられたといわれ、東京の日本橋、山口の錦帯橋と並ぶ日本三名橋のひとつともいわれます。1982年の長崎大水害で一部が崩れましたが、翌年に復元されました。水位が低いときは、階段で川べりに降りて水辺を歩くこともできます。中島川沿いの景色を眺めながら、旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [GLOVER, OURA].join()) throw new Error("構成が想定と違います");
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

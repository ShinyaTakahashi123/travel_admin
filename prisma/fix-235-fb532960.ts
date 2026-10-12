/**
 * #235 fb532960「原爆ドームと平和記念公園、定番の平和学習日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:50 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「…となったことでしょう」）
 * 企画運営 10/11: 慰霊の場所として静かに敬意をもって見学する一文を入れ、観光の楽しさを強調する言い方はしない。数字は公式の文面どおりの場合だけ。
 *   資料館の混雑の一文はよい。午後は平和の学びと合う場所を、雰囲気が急に変わらない順で
 * 路面電車と歩きの旅（JR広島駅から）:
 *   原爆ドーム 9:00 → 平和記念公園 → 広島平和記念資料館 → 平和記念公園レストハウス（昼食・軽食）→ 袋町小学校平和資料館 → 旧日本銀行広島支店 → 縮景園 16:30 → 広島駅
 *   #3155fabf（尾道・広島）・#78026dc9・#998ecdfc と、原爆ドーム・平和記念公園・資料館・縮景園が重なるので、それぞれの本文を読んで、使っていない話で書いた
 *   （縮景園は3本とも元和6年・浅野長晟・上田宗箇を使っているので、名前の由来・名勝の指定・被爆と復旧の話にした）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   広島市 平和記念公園 https://www.city.hiroshima.lg.jp/site/hiroshima-park/7480.html （三角州の最上流部・原爆死没者の慰霊と世界恒久平和の祈念のための都市公園・江戸時代から昭和初期の中心的な繁華街・
 *     昭和20年8月6日に一発の原子爆弾で一瞬のうちに破壊・原爆ドーム、資料館、モニュメント、被爆したアオギリ・原爆ドームの柵の内側は立ち入り禁止で外から見学）
 *   広島平和記念資料館 公式 https://hpmmuseum.jp/ （被爆者の遺品や被爆の惨状を示す写真、資料・本館「被爆の実相」・東館「核兵器の危険性」「広島の歩み」・被爆者証言ビデオ・混雑状況）
 *   広島市 被爆建物リスト https://www.city.hiroshima.lg.jp/atomicbomb-peace/fukko/1021101/1026920/1026921/ —
 *     1020867 レストハウス（1929年に大正屋呉服店・1944年に燃料会館・爆心地から170m・地下室を除き全焼・公園内で被爆前の面影を残す唯一の建物）／
 *     1020869 袋町小学校平和資料館（爆心地から460m・外形だけ残して焼失・避難場所や救護所・安否を尋ねる場・平成14年に西校舎の一部を保存して開設）／
 *     1020789 旧日本銀行広島支店（爆心地から380m・中区袋町5番21号）
 *   ひろしま観光ナビ dive-hiroshima https://dive-hiroshima.com/explore/2994/ （レストハウス: 2階に軽飲食の提供コーナーと被爆ピアノ・1階に観光案内所・天井に被爆の跡）
 *   縮景園 公式 https://shukkeien.jp/history/ ・/introduction/ （林羅山の詩の序文「海山をその地に縮め…」が名の由来・1940年に広島県へ寄贈、名勝に指定・
 *     1945年の原子爆弾で壊滅的な状態・1949年からの復旧は約30年をかけて完成・四季の花）
 * 座標: OSM — 原爆ドーム relation 1506282・平和記念公園 relation 1971933・資料館本館 way 60867023・レストハウス way 94900741・旧日本銀行広島支店 relation 20312086・縮景園 way 69827593
 *   （いずれも Nominatim の中心）／袋町小学校平和資料館 node 4280116101（API で名前つきを確かめた）
 * 写真: 平和記念公園のスポットに付いている写真（コモンズ Hiroshima_Peace_Memorial_Museum_1.jpg）は資料館の建物なので、新しい資料館のスポットへ移し、説明も直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-235-fb532960.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fb532960-0b0c-4170-948e-d484b575f739";
const DAY_ID = "ee3f09af-df3d-42ae-8529-57885dfbe623";
const DOME = "5d6e3da2-64dc-406d-a827-9ee832c2af45";
const PARK = "592ec25b-a973-4b7e-9f01-877f51d548b5";
const MUSEUM_PHOTO = "3705f195-1ba1-40b6-801f-522b1342b72d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const QUIET = "犠牲になった方々を悼む場所ですので、静かに、敬意をもって見学しましょう。";

const DESCRIPTION =
  "原爆ドームと平和記念公園、広島平和記念資料館をたずね、原子爆弾が広島にもたらしたことを学びます。午後は、被爆の跡を今に伝えるレストハウスや袋町小学校平和資料館、旧日本銀行広島支店を歩き、被爆から長い年月をかけて復旧した縮景園で一日を終える、路面電車と歩きの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(DOME, { h: 9, m: 0, stay: 30, legs: [], lat: 34.3954661, lng: 132.4535245, address: "広島県広島市中区大手町1-10",
    memo: "この旅は路面電車と歩きでめぐります。JR広島駅から路面電車に乗り、「原爆ドーム前」で降りてすぐ（あわせて約20分）。昭和20年8月6日、一発の原子爆弾によって、このあたり一帯は一瞬のうちに破壊されました。ドームの柵の内側には入れないので、外から見学します。" + QUIET }),
  upd(PARK, { h: 9, m: 35, stay: 45, legs: [walk(5)], lat: 34.3931714, lng: 132.4523008, address: "広島県広島市中区中島町1",
    memo: "原爆ドームから川を渡り、歩いて約5分。川が分かれる三角州のいちばん上流に、原爆で亡くなった人々の慰霊と、世界の恒久平和を祈って開かれた公園です。かつてこのあたりは、江戸時代から昭和のはじめまで、広島でいちばんにぎわう繁華街でした。園内には、平和の願いを込めた数々の碑や、被爆したアオギリの木が残っています。慰霊碑や碑の前では、静かに手を合わせましょう。" }),
  cre("広島平和記念資料館", { h: 10, m: 25, stay: 100, legs: [walk(5)], lat: 34.3918121, lng: 132.4521048, address: "広島県広島市中区中島町1-2",
    memo: "公園の中を歩いて約5分。被爆した人々の遺品や、被爆の惨状を伝える写真や資料を通して、1945年8月6日に広島で何が起きたのかを伝える資料館です。本館で被爆の実相にふれ、東館では核兵器の危険性や、被爆の前後の広島の歩みを学べます。被爆者の証言の映像を見られるコーナーもあります。混み合う日もあるので、時間に余裕をもって訪ねましょう。混雑の様子は公式の案内で確かめられます。" + QUIET }),
  cre("平和記念公園レストハウス", { h: 12, m: 15, stay: 50, legs: [walk(10)], lat: 34.3938262, lng: 132.4532554, address: "広島県広島市中区中島町1-1",
    memo: "資料館から公園の北へ歩いて約10分。1929年に呉服店として建てられ、のちに「燃料会館」と呼ばれた建物で、爆心地から約170mにありながら形をとどめた、公園の中でただひとつ被爆前の面影を残す建物です。2階には軽い食事のできるコーナーがあるので、ここで昼食にしましょう。2階には被爆したピアノも展示され、通路の天井には被爆による火災の跡や傷んだ梁が見られます。" }),
  cre("袋町小学校平和資料館", { h: 13, m: 20, stay: 40, legs: [walk(15)], lat: 34.3915462, lng: 132.4582518, address: "広島県広島市中区袋町6-36",
    memo: "レストハウスから元安橋を渡り、町の中を東へ歩いて約15分。爆心地から約460mにあった小学校の校舎で、原爆によって外の形だけを残して焼けました。焼け残った校舎は避難場所や救護所となり、子どもや先生、地域の人々の安否を尋ねる場所にもなりました。平成14年に西校舎の一部を残して、平和資料館が開かれています。開館日と時間は公式の案内で確かめましょう。" + QUIET }),
  cre("旧日本銀行広島支店", { h: 14, m: 5, stay: 30, legs: [walk(5)], lat: 34.3914376, lng: 132.4567273, address: "広島県広島市中区袋町5-21",
    memo: "袋町小学校平和資料館から歩いて約5分。爆心地から約380mにあった銀行の建物で、被爆の跡を今に伝える被爆建物として、広島市が残しています。公開の日と時間は公式の案内で確かめましょう。" + QUIET }),
  cre("縮景園", { h: 15, m: 10, stay: 80, legs: [walk(10), { mode: "train", min: 10, line: "広島電鉄（路面電車）" }, walk(15)], lat: 34.4003377, lng: 132.4674494, address: "広島県広島市中区上幟町2-11",
    memo: "旧日本銀行から歩いて紙屋町の電停へ行き、路面電車で八丁堀へ向かい、歩いて約15分（あわせて約35分）。江戸時代のはじめに築かれた大名の庭園で、儒学者の林羅山が「海山をその地に縮め」と詠んだ詩の言葉が名の由来とされています。昭和15年に名勝に指定されたわずか5年後、原子爆弾によって壊滅的な被害を受けましたが、昭和24年から約30年をかけて元の姿へと復旧されました。四季の花や木々に包まれた庭を、ゆっくり歩きましょう。池のまわりでは足元に気をつけましょう。帰りは、路面電車で広島駅へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [DOME, PARK].join()) throw new Error("構成が想定と違います");
  if (!it.days[0].spots[1].photos.some((p) => p.id === MUSEUM_PHOTO)) throw new Error("写真が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}\n写真: 平和記念公園の資料館の写真を、資料館のスポットへ移す`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
      const museum = await tx.spot.findFirstOrThrow({ where: { dayId: DAY_ID, name: "広島平和記念資料館" } });
      const moved = await tx.photo.updateMany({ where: { id: MUSEUM_PHOTO, spotId: PARK }, data: { spotId: museum.id, caption: "広島平和記念資料館" } });
      if (moved.count !== 1) throw new Error("写真を移せませんでした");
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

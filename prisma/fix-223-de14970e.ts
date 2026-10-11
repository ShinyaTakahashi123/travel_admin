/**
 * #223 de14970e「大山祇神社、日本総鎮守と称される大三島の古社を訪ねるプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「お参りください」）。
 *   「文化財85件」「全国のおよそ4割」など、出典で確かめられない数字があった（神社の公式は「約8割」）
 * 車の旅（JR今治駅の近くでレンタカーを借りて返す）:
 *   大山祇神社 9:00 → 大山祇神社宝物館 → 大三島美術館 → 道の駅多々羅しまなみ公園（昼食）→ 今治市岩田健母と子のミュージアム → 伯方塩業 大三島工場 → マーレ・グラッシア大三島 16:30 → 今治駅
 *   #221（自転車）と大山祇神社・宝物館・道の駅多々羅が重なるので、取り上げることを変えて文を別に書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   大山祇神社 公式 https://oomishimagu.jp/about/ （日本総鎮守・伊予国一の宮・大山積大神・古事記と日本書紀に山の神・小千命の御手植の楠と伝える・樹齢2600年あまり）／
 *     今治地方観光協会 https://www.oideya.gr.jp/spot-c/ohyamazumi/ （2010年に再建の総門・総ヒノキ造り・高さ12m・楠群は国の天然記念物）
 *   宝物館 公式 https://oomishimagu.jp/treasure/ （全国の国宝・国の重要文化財の指定を受けた武具類の約8割・甲冑の保存は全国一・日本最古の平安中期の鎧・「国宝の島」）／
 *     https://oomishimagu.jp/information/post-154/ （開館 9時〜16時30分、最終入館16時）
 *   大三島美術館 愛媛県 いよ観ネット https://www.iyokannet.jp/spot/217 （大山祇神社に隣接・現代日本画の作品など約1000点・和紙張りの壁・田渕俊夫、中島千波、竹内浩一・裏に枯山水の庭園・カフェ・9時〜17時 月曜休）
 *   道の駅多々羅しまなみ公園 今治地方観光協会 /spot-c/tatara-3/ （多々羅大橋のたもと・レストラン 10時〜16時・水軍と海をイメージした水軍公園・かぶとをかたどった多々羅展望台）
 *   岩田健母と子のミュージアム いよ観ネット /spot/3318 （宗方小学校跡の宿泊施設の校庭・岩田健の彫刻44点・母と子・見て触れて・伊東豊雄の設計・芝生の中庭を白いコンクリートが円形に囲む・9時〜17時 月曜休）
 *   伯方塩業 大三島工場 今治地方観光協会 /spot-c/hakataengyo/ （天日塩田塩を日本の海水で溶かして原料に・にがりをほどよく残す・製造工程の見学・9時〜15時30分 見学は16時まで・休業日あり）
 *   マーレ・グラッシア大三島 今治地方観光協会 /spot-c/maregracia/ （平成13年・タラソテラピーを取り入れた海洋温浴施設・海水風呂・露天風呂・10時〜20時・水曜休）
 * 座標: OSM — 大山祇神社 way 699380682・宝物館 way 699380696・大三島美術館 way 701686267・道の駅多々羅しまなみ公園 way 162341341・
 *   伯方塩業大三島工場 way 759625081・マーレ・グラッシア大三島 way 699404887（いずれも Nominatim の中心）／岩田健母と子のミュージアム relation 11699323（同）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-223-de14970e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "de14970e-a4e3-4965-8e4d-48880047786b";
const DAY_ID = "01054ac3-dfce-4687-9dec-188ec69bac07";
const JINJA = "6c4f2216-8fff-4c2d-8828-e9b3ac6f1182";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "「日本総鎮守」と尊ばれてきた大三島の大山祇神社にお参りし、武具の名品が並ぶ宝物館と、となりの大三島美術館の日本画を見てまわります。昼は多々羅大橋のたもとの道の駅で。午後は母と子の彫刻のミュージアムや塩づくりの工場を訪ね、海水の温浴施設で締めくくる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(JINJA, { h: 9, m: 0, stay: 60, legs: [], lat: 34.2481398, lng: 133.0053057, address: "愛媛県今治市大三島町宮浦3327",
    memo: "この旅は車でめぐります。JR今治駅の近くでレンタカーを借りて、しまなみ海道を通り、車で約50分の大三島・宮浦へ。伊予国の一の宮で、古くから「日本総鎮守」と尊ばれてきた神社です。祀られている大山積大神は、古事記や日本書紀に山の神として記されています。総ヒノキ造りの総門をくぐると、本殿の正面に、大山積大神の子孫・小千命が植えたと伝えられる御神木の楠がそびえます。" + PRAY }),
  cre("大山祇神社宝物館", { h: 10, m: 5, stay: 55, legs: [{ mode: "walk", min: 5 }], lat: 34.2474757, lng: 133.004448, address: "愛媛県今治市大三島町宮浦3327",
    memo: "本殿から歩いて約5分。神社によると、全国で国宝や国の重要文化財に指定された武具類の約8割がここに収められ、大三島は「国宝の島」とも呼ばれています。日本で最も古いとされる平安時代中期の鎧から、鎌倉時代、戦国時代の名品まで、それぞれの時代の甲冑を見比べられます。神前に納められてきた品々なので、館内では静かに鑑賞しましょう。拝観の時間は公式の案内で確かめましょう。" }),
  cre("大三島美術館", { h: 11, m: 10, stay: 40, legs: [{ mode: "walk", min: 10 }], lat: 34.2491295, lng: 133.0033661, address: "愛媛県今治市大三島町宮浦9099-1",
    memo: "宝物館から歩いて約10分、神社のとなりへ。緑の中に白い壁が映える美術館で、現代の日本画の作品などを数多く収めています。和紙張りの壁の展示室で、田渕俊夫や中島千波、竹内浩一らの日本画をゆっくり鑑賞できます。美術館の裏には、自由に見学できる枯山水の庭も広がります。休館日は公式の案内で確かめましょう。" }),
  cre("道の駅多々羅しまなみ公園", { h: 12, m: 10, stay: 50, legs: [{ mode: "car", min: 20 }], lat: 34.2543778, lng: 133.0541171, address: "愛媛県今治市上浦町井口9180-2",
    memo: "宮浦から車で約20分、島の東の多々羅大橋のたもとへ。レストランのある道の駅なので、ここで昼食にしましょう。公園の中には、水軍と海をイメージした水軍公園があり、かぶとの形をした展望台もあります。" }),
  cre("今治市岩田健母と子のミュージアム", { h: 13, m: 35, stay: 40, legs: [{ mode: "car", min: 35 }], lat: 34.1944673, lng: 132.9539187, address: "愛媛県今治市大三島町宗方5208-2",
    memo: "道の駅から車で約35分、島の南西の宗方へ。小学校の跡を生かした宿泊施設の校庭に建つ彫刻の美術館で、彫刻家・岩田健による、母と子を主なテーマにした作品44点が並びます。作品は、見て、触れて、感じることができます。建物は建築家・伊東豊雄の設計で、白いコンクリートの壁が芝生の中庭を円く囲みます。休館日は公式の案内で確かめましょう。" }),
  cre("伯方塩業 大三島工場", { h: 14, m: 40, stay: 45, legs: [{ mode: "car", min: 25 }], lat: 34.2404612, lng: 132.9942181, address: "愛媛県今治市大三島町台32",
    memo: "ミュージアムから車で約25分、島の西の台へ。「伯方の塩」をつくる工場で、海外の天日塩田の塩を日本の海水で溶かし、にがりをほどよく残して仕上げる製造の工程を見学できます。点検などで見学できない日もあるので、事前に公式の案内で確かめましょう。" }),
  cre("マーレ・グラッシア大三島", { h: 15, m: 30, stay: 60, legs: [{ mode: "car", min: 5 }], lat: 34.2416482, lng: 132.9940073, address: "愛媛県今治市大三島町宮浦5902",
    memo: "工場から車で約5分。海の力を生かす療法・タラソテラピーを取り入れた、海水の温浴施設です。海水風呂や露天風呂で、一日の疲れをいやせます。休館日は公式の案内で確かめましょう。湯につかる前後には、水分をとりましょう。帰りは、車で約50分のJR今治駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== JINJA) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "大山祇神社(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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

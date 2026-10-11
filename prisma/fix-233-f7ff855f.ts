/**
 * #233 f7ff855f「国宝・松本城、現存12天守の名城を巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:00 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ようこそお越しくださいました」「ごゆっくりお楽しみください」）。
 *   「唯一の平城」「国宝5城の一つ」などは出典で確かめていないので書かない。タイトルの「現存12天守」も確かめていないので、タイトルを内容に合わせて変える
 * 車の旅（JR松本駅の近くでレンタカーを借りて返す）:
 *   松本城 9:00 → 日本浮世絵博物館 → 中町通り（昼食）→ 松本民芸館 → 馬場家住宅 16:30 → 松本駅
 *   松本のほかのしおり（#fa3afe40・#f507e490・#760fe248: 松本城・旧開智学校・中町・縄手・美術館・博物館など）と松本城・中町通りが重なるので、文は別に書いた
 *   松本市歴史の里は、OSM に点がなく国土地理院も大字の点だけなので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   国宝松本城 公式 https://www.matsumoto-castle.jp/about （戦国時代の永正年間の深志城が始まり・現存する五重六階の天守の中で日本最古の国宝の城・黒と白の対比とアルプス）／
 *     https://www.matsumoto-castle.jp/about/tower/details （壁の下部は黒漆塗の下見板で雨水から壁を守る・壁の厚さ約29cm・石落・窓のない「隠し階」・最も急な61度の階段）
 *   松本市公式観光サイト 松本旅のしらべ https://visitmatsumoto.com/spot/detail_<番号>.html —
 *     1020 日本浮世絵博物館（松本出身の酒井家が5代200年かけて集めた浮世絵・昭和57年開館・10:00〜17:00・月曜休）／
 *     1082 中町通り（善光寺街道沿いの商家の町並み・なまこ壁の白と黒の土蔵造り・カフェやレストラン）／
 *     1014 松本民芸館（なまこ壁の蔵造り・昭和37年に丸山太郎が創館・今は松本市が運営・約800点の常設展示・9:00〜17:00・火曜休）／
 *     1017 馬場家住宅（江戸時代末期の本棟造の屋敷構え・国の重要文化財・藩主をもてなす家格の旧家・9:00〜17:00・火曜休）
 * 座標: OSM — 松本城 way 300077872・日本浮世絵博物館 way 314532861・中町通り way 149397114・馬場家住宅 way 789117384（いずれも Nominatim の中心）／
 *   国土地理院の番地の点 — 松本民芸館（里山辺1313番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-233-f7ff855f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f7ff855f-7d65-4b94-80b6-7e44604d4259";
const DAY_ID = "88eea446-6cbf-4c25-a9be-9b10e392f4d0";
const SHIRO = "08b4ef62-dc08-4630-bebf-909642b315b0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });

const TITLE = "国宝・松本城と浮世絵、民芸と蔵の町をめぐる日帰りプラン";
const DESCRIPTION =
  "黒と白の天守がアルプスに映える国宝・松本城で、城の造りの工夫を見てまわり、浮世絵の博物館へ。昼は蔵造りの町並みが残る中町通りで食事をとり、午後は民芸の品を集めた松本民芸館と、江戸時代末期の旧家の屋敷が残る馬場家住宅をめぐる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(SHIRO, { h: 9, m: 0, stay: 100, legs: [], lat: 36.2386353, lng: 137.9688709, address: "長野県松本市丸の内4-1",
    memo: "この旅は車でめぐります。JR松本駅の近くでレンタカーを借りて、車で約10分。戦国時代の深志城が始まりとされ、今に残る五重六階の天守の中で、日本で最も古い国宝の城といわれています。天守の壁の下の黒い部分は漆を塗った板で、屋根で防ぎきれない雨水から壁を守るためのものです。中に入ると、厚さ約29cmの壁や、石垣を登る敵に備えた「石落」、外から見えない窓のない階など、守りの工夫を見られます。最も急な階段は61度もあるので、手すりにつかまり、ゆっくり上り下りしましょう。" }),
  cre("日本浮世絵博物館", { h: 11, m: 0, stay: 50, legs: [car(20)], lat: 36.2318866, lng: 137.9345921, address: "長野県松本市島立2206-1",
    memo: "松本城から車で約20分、市の西の島立へ。松本の酒井家が5代、200年にわたって集めた浮世絵を、後の世に伝えるために昭和57年に開かれた博物館で、版画のほか、肉筆の作品や版本も収められています。休館日は公式の案内で確かめましょう。" }),
  cre("中町通り", { h: 12, m: 15, stay: 60, legs: [car(25)], lat: 36.2337986, lng: 137.9714588, address: "長野県松本市中央2丁目",
    memo: "博物館から車で約25分、町の中心へ戻ります（近くの駐車場に停めて歩きます）。善光寺街道沿いに江戸時代から栄えた商家の町並みで、火事から町を守るために漆喰で仕上げた「なまこ壁」の白と黒の土蔵造りが今も数多く残ります。通りにはカフェやレストランも並ぶので、ここで昼食にしましょう。町並みには今も人が暮らし、商いをしているので、静かに歩きましょう。" }),
  cre("松本民芸館", { h: 13, m: 35, stay: 75, legs: [car(20)], lat: 36.242893, lng: 137.995071, address: "長野県松本市里山辺1313-1",
    memo: "中町通りから車で約20分、市の東の里山辺へ。なまこ壁の蔵造りの建物に、民芸の考えをあらわす品々を集めた館で、昭和37年に、柳宗悦の民芸運動に共感した丸山太郎が開き、今は松本市が運営しています。焼き物や漆器、箪笥、郷土玩具など、日本と世界の暮らしの道具が並びます。休館日は公式の案内で確かめましょう。" }),
  cre("馬場家住宅", { h: 15, m: 15, stay: 75, legs: [car(25)], lat: 36.1672116, lng: 137.9857908, address: "長野県松本市内田357-6",
    memo: "民芸館から車で約25分、市の南の内田へ。江戸時代の終わりに建てられた本棟造の屋敷の構えが、ほぼそのまま残る旧家で、藩主をもてなすための特別な家格をもった家として、国の重要文化財に指定されています。屋敷の中や庭を歩き、昔の暮らしにふれられます。休館日は公式の案内で確かめましょう。帰りは、車で約25分のJR松本駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== SHIRO) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "松本城(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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

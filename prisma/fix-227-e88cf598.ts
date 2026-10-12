/**
 * #227 e88cf598「三朝温泉、高濃度ラジウム泉を楽しむ定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:00 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ようこそ」「ご体感ください」）。
 *   写真1枚（説明は「三朝温泉 株湯」）は、コモンズの説明では三朝橋のたもとから撮った河原風呂と三徳川で、株湯ではなかった
 * 車の旅（JR倉吉駅の近くでレンタカーを借りて返す）:
 *   三朝温泉 株湯 9:30 → 薬師の湯 → 重森三玲の庭「三楽庭」→ 三朝バイオリン美術館 → ふるさと健康むら（昼食）→ 鳥取二十世紀梨記念館 → 中国庭園 燕趙園 16:30 → 倉吉駅
 *   #476fb1d7（三朝橋・河原風呂・恋谷橋・三朝神社・三徳山・倉吉の町並み）とは株湯だけ重なるので、文は別に書いた
 *   キュリー公園・曹源寺・馬場の滝は、OSM に名前つきの点がなく、国土地理院も大字の点だけなので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 三朝温泉観光協会 https://misasaonsen.jp/sightseeings/<名前>/ —
 *   sightseeing-1072 株湯（三朝温泉の起源・元祖の湯・別名「元湯」・隣に無料の足湯と飲泉場・飲泉は24時間）／
 *   sightseeing-1090 薬師の湯（温泉の薬効を祈る温泉街の神様「お薬師さん」の広場・足湯と飲泉場）／
 *   sightseeing-988 作庭家「重森 三玲」公園（昭和を代表する作庭家・三楽庭・昭和29年に池庭、昭和30年と41年に枯山水）／
 *   sightseeing-991 三朝バイオリン美術館（弦楽器の製作と演奏がテーマ・1階に製作の工程や道具、材料）／
 *   sightseeing-1033 ふるさと健康むら（三朝織・白狼焼などの体験工房・物産館・喫茶で三朝米と神倉大豆の納豆ご飯、うどん、そば・8:30〜17:30）
 *   鳥取県観光連盟 https://www.tottori-guide.jp/tourism/tour/view/166 （鳥取二十世紀梨記念館: 日本で唯一の梨がテーマの博物館・倉吉パークスクエア・枝の広がり20mの二十世紀梨の巨木・世界の梨品種コレクション）／
 *   /view/137 （燕趙園: 鳥取県と中国河北省の友好のシンボル・国内最大級の中国庭園・東郷湖畔・皇家園林方式・中国の技師の設計と中国産の材料・瑠璃色の瓦・中国雑伎ショー）
 * 座標: OSM — 株湯 way 1307989745・燕趙園 way 399372163（いずれも Nominatim の中心）／
 *   国土地理院の住所検索の番地の点 — 薬師の湯（三朝町三朝933番地）・三楽庭（三朝町三朝791番地）・三朝バイオリン美術館（三朝町三朝199番地）・
 *   ふるさと健康むら（三朝町横手15番地）・鳥取二十世紀梨記念館（倉吉市駄経寺町198番地）。どれも OSM に名前つきの点がなかった
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-227-e88cf598.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e88cf598-ee6a-4351-a185-f90ff6ed7b78";
const DAY_ID = "491b7ec7-f43b-4990-b6e7-0aaba41cec0e";
const KABUYU = "a08d09d0-c014-4d70-96ea-c62f7ed86d9f";
const WRONG_PHOTO = "4847f747-7064-4047-8af8-1ef859c40272";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "三朝温泉の始まりとされる株湯で足湯と飲泉を楽しみ、温泉街のお薬師さんや重森三玲の庭、バイオリン美術館を歩いてめぐります。昼は体験工房のあるふるさと健康むらで。午後は倉吉の二十世紀梨記念館と、東郷湖のほとりの中国庭園・燕趙園を訪ねる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(KABUYU, { h: 9, m: 30, stay: 40, legs: [], lat: 35.4076218, lng: 133.8982651, address: "鳥取県東伯郡三朝町三朝634-1",
    memo: "この旅は車でめぐります。JR倉吉駅の近くでレンタカーを借りて、車で約20分の三朝温泉へ。三朝温泉はここから始まったといわれる元祖の湯で、「元湯」とも呼ばれる共同浴場です。となりには足湯と飲泉場があり、気軽に温泉にふれられます。足湯では、ほかの人に湯がかからないように気をつけましょう。" }),
  cre("薬師の湯", { h: 10, m: 15, stay: 20, legs: [{ mode: "walk", min: 5 }], lat: 35.410049, lng: 133.89389, address: "鳥取県東伯郡三朝町三朝933",
    memo: "株湯から温泉街を歩いて約5分。温泉の薬効を祈る温泉街の神様「お薬師さん」が祀られた広場にある足湯と飲泉場で、健康を願ってお参りする人も多い場所です。" + PRAY }),
  cre("重森三玲の庭「三楽庭」", { h: 10, m: 40, stay: 30, legs: [{ mode: "walk", min: 5 }], lat: 35.408833, lng: 133.89444, address: "鳥取県東伯郡三朝町三朝791-1",
    memo: "薬師の湯から歩いて約5分。昭和を代表する作庭家・重森三玲が三朝で手がけた庭で、昭和29年に池の庭が、のちに昭和30年と41年に枯山水が造られ、「三楽庭」と名付けられました。温泉街の中で、石と砂が描く景色を静かに眺められます。" }),
  cre("三朝バイオリン美術館", { h: 11, m: 25, stay: 45, legs: [{ mode: "walk", min: 15 }], lat: 35.416885, lng: 133.901184, address: "鳥取県東伯郡三朝町三朝199-1",
    memo: "三楽庭から温泉街の奥へ歩いて約15分。弦楽器の製作と演奏をテーマにした、国内でも珍しい美術館です。1階では、バイオリンができるまでの工程や道具、材料が紹介されています。休館日は公式の案内で確かめましょう。" }),
  cre("ふるさと健康むら", { h: 12, m: 25, stay: 60, legs: [{ mode: "walk", min: 10 }, { mode: "car", min: 5 }], lat: 35.411915, lng: 133.88501, address: "鳥取県東伯郡三朝町横手15-1",
    memo: "株湯のそばに停めた車へ歩いて戻り、車で約5分（あわせて約15分）。三朝の草木で染める三朝織や白狼焼など、三朝ならではの体験工房と物産館のある施設です。館内の喫茶で、三朝の米と神倉大豆を使った納豆ご飯や、うどん・そばの昼食にしましょう。" }),
  cre("鳥取二十世紀梨記念館", { h: 13, m: 50, stay: 60, legs: [{ mode: "car", min: 25 }], lat: 35.432331, lng: 133.834625, address: "鳥取県倉吉市駄経寺町198-4",
    memo: "三朝から車で約25分、倉吉パークスクエアへ。梨をテーマにした博物館は国内でここだけとされ、枝が20mも広がる二十世紀梨の大きな木がシンボルです。梨の歴史や産業の展示のほか、世界の梨の品種のコレクションも見られます。休館日は公式の案内で確かめましょう。" }),
  cre("中国庭園 燕趙園", { h: 15, m: 15, stay: 75, legs: [{ mode: "car", min: 25 }], lat: 35.4656388, lng: 133.892375, address: "鳥取県東伯郡湯梨浜町引地565-1",
    memo: "記念館から車で約25分、東郷湖のほとりへ。鳥取県と中国の河北省の友好のしるしとして造られた、国内最大級とされる中国庭園です。中国の歴代の皇帝が好んだ庭の形を再現し、中国の技師が設計して中国産の材料で建てられた建物には、瑠璃色の瓦や色あざやかな飾りが施されています。中国の伝統の雑伎の公演も行われています。帰りは、車で約20分のJR倉吉駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== KABUYU) throw new Error("構成が想定と違います");
  if (it.days[0].spots[0].photos.map((p) => p.id).join() !== WRONG_PHOTO) throw new Error("写真が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "三朝温泉 株湯(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}\n外す写真: ${WRONG_PHOTO}（表紙は空にする）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: null } });
      await tx.photo.delete({ where: { id: WRONG_PHOTO } });
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

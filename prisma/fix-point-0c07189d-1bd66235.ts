/**
 * 0c07189d(堀切峠)・1bd66235(鳥取城跡)の点のそろえ(2026-11-05、しおりえ(制作補助2))。
 * docs/content/20261102-daytrip-coord-scan.md の「点のそろえ」の欄(457行・460行、企画運営 11/04)。
 * - 0c07189d 堀切峠 31.776669,131.482211 → バス停「堀切峠」node5919555152 31.7768245,131.4821614(d6c081e8・af30d135・1d72e477 と同じ)。
 *   1か所目なので入る区間はない。堀切峠→堀川運河 2577.8秒(規則383行の範囲 車48〜70)に今の車50なので、区間・時刻・メモは変えない。
 * - 1bd66235 鳥取城跡 35.507455,134.238346 → 着く側の入口の碑「鳥取城跡 久松公園」historic=memorial node8024938325 35.5073969,134.2360398
 *   (c946b414 と同じ)。測り直し(routing.openstreetmap.de): 白兎神社・白兎海岸→鳥取城跡 640.0秒で、今の車11は短すぎるので車16、
 *   鳥取城跡→鳥取県立博物館 366.6秒で歩き6→7。1泊2日の最終日で終わりを遅らせないため、のびた6分は鳥取城跡の滞在を 40→34分にして合わせ、
 *   鳥取城跡の着き 13:12→13:17、鳥取県立博物館の着き 13:58 から後はそのまま。
 *   メモの分: 白兎の結び「車でおよそ20分」(区間と合っていなかった)→16分、鳥取城跡の書き出し 11→16分・結び 6→7分、博物館の書き出し 6→7分。
 *   法務の指摘(11/05 11:16)で一緒に直す文: 鳥取城跡の「鳥取の渇え殺し」という呼び名を外す、白兎の「お参りください」を外し、
 *   結びの前に祈りの一文を入れる。白兎の滞在の中の昼食は、あとで1bd66235の2日目の組み直しとして直す(企画運営)。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-point-0c07189d-1bd66235.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const legs = (mode: string, min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

type Rep = [string, string];
type Fix = {
  itin: string; spotId: string; name: string;
  old: { lat?: string; lng?: string; visit?: string; stay?: number; legs?: string };
  data: { lat?: string; lng?: string; visitTime?: Date; stayDurationMin?: number; transitLegs?: ReturnType<typeof legs> };
  reps: Rep[];
};
const FIXES: Fix[] = [
  { itin: "0c07189d", spotId: "f3e35b62-e7fb-4bfe-867e-e194d395dc69", name: "堀切峠", old: { lat: "31.776669", lng: "131.482211" }, data: { lat: "31.776825", lng: "131.482161" }, reps: [] },
  {
    itin: "1bd66235", spotId: "caf86db0-19ba-4bc5-9cf9-7788eedffaaa", name: "白兎神社・白兎海岸", old: {}, data: {},
    reps: [
      ["境内には白うさぎの愛らしい石像が並び、参道では静かに、敬意をもってお参りください。", "境内には白うさぎの愛らしい石像が並んでいます。"],
      [
        "この後は、車でおよそ20分、市街に戻って鳥取城跡へ向かいましょう。",
        "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、車でおよそ16分、市街に戻って鳥取城跡へ向かいましょう。",
      ],
    ],
  },
  {
    itin: "1bd66235", spotId: "0df911db-2114-4dea-ba67-5f28ea46b096", name: "鳥取城跡",
    old: { lat: "35.507455", lng: "134.238346", visit: "13:12", stay: 40, legs: "car11" },
    data: { lat: "35.507397", lng: "134.23604", visitTime: T(13, 17), stayDurationMin: 34, transitLegs: legs("car", 16) },
    reps: [
      ["白兎神社・白兎海岸から車でおよそ11分、", "白兎神社・白兎海岸から車でおよそ16分、"],
      ["羽柴秀吉による「鳥取の渇え殺し」と呼ばれる兵糧攻めの舞台としても知られる山城です。", "羽柴秀吉による兵糧攻めの舞台としても知られる山城です。"],
      ["この後は、歩いておよそ6分、鳥取県立博物館へ向かいましょう。", "この後は、歩いておよそ7分、鳥取県立博物館へ向かいましょう。"],
    ],
  },
  {
    itin: "1bd66235", spotId: "d1de6450-5420-4b58-9d94-49d385a5b4bd", name: "鳥取県立博物館",
    old: { visit: "13:58", legs: "walk6" }, data: { transitLegs: legs("walk", 7) },
    reps: [["鳥取城跡から歩いておよそ6分、", "鳥取城跡から歩いておよそ7分、"]],
  },
];

const count = (s: string, sub: string) => s.split(sub).length - 1;
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");

async function main() {
  const plans: { f: Fix; memo?: string }[] = [];
  for (const f of FIXES) {
    const s = await prisma.spot.findUnique({
      where: { id: f.spotId },
      select: { name: true, lat: true, lng: true, visitTime: true, stayDurationMin: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } } },
    });
    if (!s || s.name !== f.name || !s.day.itineraryId.startsWith(f.itin)) throw new Error(`${f.itin}: スポットが想定と違います「${s?.name}」`);
    const legStr = s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
    if (f.old.lat && (String(s.lat) !== f.old.lat || String(s.lng) !== f.old.lng)) throw new Error(`${f.name}: 今の点が想定と違います ${s.lat},${s.lng}`);
    if (f.old.visit && hm(s.visitTime) !== f.old.visit) throw new Error(`${f.name}: 今の時刻が想定と違います ${hm(s.visitTime)}`);
    if (f.old.stay !== undefined && s.stayDurationMin !== f.old.stay) throw new Error(`${f.name}: 今の滞在が想定と違います ${s.stayDurationMin}`);
    if (f.old.legs && legStr !== f.old.legs) throw new Error(`${f.name}: 今の区間が想定と違います ${legStr}`);
    let memo = s.memo ?? "";
    for (const [a, b] of f.reps) {
      if (count(memo, a) !== 1) throw new Error(`${f.name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
      memo = memo.replace(a, b);
    }
    plans.push({ f, memo: f.reps.length ? memo : undefined });
    const d = f.data;
    const newLegs = d.transitLegs ? d.transitLegs.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : legStr;
    console.log(
      `■ ${f.itin} ${f.name}\n  点 ${s.lat},${s.lng} → ${d.lat ?? "(そのまま)"},${d.lng ?? ""}／着 ${hm(s.visitTime)} → ${d.visitTime ? hm(d.visitTime) : "(そのまま)"}／滞在 ${s.stayDurationMin} → ${d.stayDurationMin ?? "(そのまま)"}／区間 ${legStr} → ${newLegs}` +
        f.reps.map(([a, b]) => `\n  文「${a}」→「${b}」`).join("") +
        (f.reps.length ? `\n  直したあとのメモ: ${memo}` : "")
    );
  }
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const { f, memo } of plans) await tx.spot.update({ where: { id: f.spotId }, data: { ...f.data, ...(memo !== undefined ? { memo } : {}) } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

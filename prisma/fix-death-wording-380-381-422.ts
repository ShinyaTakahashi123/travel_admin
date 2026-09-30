/**
 * 亡くなり方・亡くなった人の数の言い方の直し（しおりえ(制作補助2)、2026-09-30 法務の洗い出し docs/legal/20260930-death-wording-scan.md、企画運営の依頼）
 * - #380 e1871a37 磐梯山噴火記念館: 「477人が亡くなったとされる」→ 数を外す
 * - #381 e25ac636 壇ノ浦古戦場: 「碇を担いで海に身を投じたと伝わる平知盛像」→「平知盛像」、「安徳天皇が入水されたと伝わる旨を記した碑」→「安徳天皇をしのぶ碑」
 * - #422 58c64d69 飯盛山（白虎隊十九士の墓）: 「自決したと伝えられています」ほか、亡くなり方・年齢を外し「戊辰戦争で亡くなった白虎隊士の墓」に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-death-wording-380-381-422.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FIXES: { itineraryId: string; dayNumber: number; spotName: string; pairs: [string, string][] }[] = [
  {
    itineraryId: "e1871a37-9b27-41af-86b5-3d71a64ec4f9", dayNumber: 2, spotName: "磐梯山噴火記念館",
    pairs: [["岩なだれがふもとの集落をのみこみ、477人が亡くなったとされる大きな災害になりました。", "岩なだれがふもとの集落をのみこみ、多くの人が亡くなる大きな災害になりました。"]],
  },
  {
    itineraryId: "e25ac636", dayNumber: 0, spotName: "壇ノ浦古戦場",
    pairs: [["源義経像と、碇を担いで海に身を投じたと伝わる平知盛像が向かい合って立ち、安徳天皇が入水されたと伝わる旨を記した碑もあります。", "源義経像と、平知盛像が向かい合って立ち、安徳天皇をしのぶ碑もあります。"]],
  },
  {
    itineraryId: "58c64d69-20fc-4509-912f-a99098a6d0fe", dayNumber: 1, spotName: "飯盛山（白虎隊十九士の墓）",
    pairs: [[
      "戊辰戦争のとき、16〜17歳の少年たちで編成された白虎士中二番隊は、戸の口原の合戦場から退き、飯盛山にたどり着きました。黒煙の中に見え隠れする鶴ヶ城の天守閣を見て、城が落ちたと思い、自決したと伝えられています。ただ一人生き残った飯沼貞吉によって、その物語は広く知られるようになりました。",
      "戊辰戦争のとき、会津藩の若い藩士たちで編成された白虎士中二番隊は、戸の口原の合戦場から退き、この飯盛山にたどり着きました。山の中腹には、戊辰戦争で亡くなった白虎隊士の墓が並びます。のちに隊士の一人、飯沼貞吉が語り残したことで、その物語は広く知られるようになりました。",
    ]],
  },
];

async function main() {
  for (const f of FIXES) {
    let id = f.itineraryId;
    if (id.length < 36) {
      const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(`select id::text id from itinerary where id::text like $1`, id + "%");
      if (rows.length !== 1) throw new Error(`しおりが1本に決まりません: ${id}`);
      id = rows[0].id;
    }
    const it = await prisma.itinerary.findUniqueOrThrow({ where: { id }, select: { title: true } });
    const loc = f.dayNumber ? { dayNumber: f.dayNumber, spotName: f.spotName } : { spotName: f.spotName };
    const s = await findSpotInItinerary(id, loc as never);
    let memo = s.memo ?? "";
    for (const [o, n] of f.pairs) {
      if (!memo.includes(o)) throw new Error(`本文が想定と違います: ${f.spotName}`);
      memo = memo.replace(o, n);
    }
    console.log(`\n■ ${id.slice(0, 8)} ${it.title} / ${f.spotName}\n${memo}`);
    if (COMMIT) await updateSpotInItinerary(id, { spotId: s.id } as never, { memo });
  }
  console.log(COMMIT ? "\n書き込みました。" : "\n確認モードです。--commit で書き込みます。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

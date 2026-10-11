/**
 * #387 ea38491a「熊本市現代美術館と下通アーケード、街なかアート散策1泊2日」の続き（しおりえ(制作補助2)、企画運営の依頼 2026-10-11「案A」）
 * 令和8年（2026年）7月28日の熊本地震のあとの状況を、1日目の行き先ごとに確かめて直す:
 *   熊本県伝統工芸館: 7月29日に臨時休館と報じられたが、公式のお知らせ（https://kumamoto-kougeikan.jp/announcement/）が更新されておらず、今の営業を確かめられないので外す。
 *     近くの代わり（夏目漱石内坪井旧居は地震で休館、県立美術館分館は展示室の一部が使えない）も確かめられなかったので、ほかの行き先の時間を整えて9:00〜16:30にする
 *   熊本城: 熊本日日新聞 https://kumanichi.com/articles/2023937 （8月13日に天守閣や特別見学通路の公開を再開）・熊本城公式 https://castle.kumamoto-guide.jp/news/detail/1459 （9月18日時点で通常営業）
 *     → 2026年の地震のあとの一文を足す（#243 の文とは書き分けた）
 *   加藤神社: 公式 https://www.kato-jinja.or.jp/ の「神社までの道路開通のお知らせ」（8月7日9時に参拝道を再開・北大手門跡付近は片側交互通行・二の丸駐車場から歩いての参拝を勧める・石垣の復旧は長くかかる）
 *     → 歩いて参拝し、案内に従う一文を足す
 *   桜の馬場 城彩苑: fix-387b で、わくわく座の休館の一文に直した。ここでは前のスポットからの移動の文だけ直す
 *   熊本市現代美術館: 美術手帖 https://bijutsutecho.com/magazine/news/headline/32846 （8月9日に全館で再開）→ そのまま
 *   上通アーケード: 営業の制限の情報なし → そのまま
 *   藤崎八旛宮: 公式 https://www.fujisakigu.or.jp/ （8月4日に例大祭の神幸行列の中止を告知。参拝の制限のお知らせはない）→ そのまま（本文に祭りの日程は書いていない）
 *   2日目の水前寺成趣園: 公式 https://www.suizenji.or.jp/ （7月30日から通常開園・8月29日「通常どおり開園」）／熊本博物館・県立美術館: 熊本城公式 9月18日時点で通常営業 → そのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-387c-ea38491a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ea38491a-1d85-432a-b2ed-6687d493e6ef";
const DAY1 = "3afaaccb-7823-4880-b9ab-2ae68192c04d";
const CASTLE = "18f4a311-bf65-418f-9d53-b7f08c2ec457";
const KATO = "fda6eb67-0148-4186-b709-ab1933e0196f";
const KOGEIKAN = "39fa6669-05b9-459e-adfc-db1c1ff3ebd9";
const JOSAIEN = "b54826c7-ed54-487c-9409-0403cab593a3";
const CAMK = "d458be04-606a-4bdb-920e-fa301d3cf0a8";
const KAMITORI = "4a56e589-b253-4b24-b6c2-9aa5fb702406";
const FUJISAKI = "6a28a873-3d5f-4284-9560-45662b2a2fa5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// 本文の直し（前後の文はそのまま）
const EDITS: Record<string, { from: string; to: string }[]> = {
  [CASTLE]: [{
    from: "城全体の復旧は今も続いているので、",
    to: "令和8年（2026年）7月の地震でも石垣などが傷みましたが、天守閣と特別見学通路は8月から再び公開されています。城全体の復旧は今も続き、通れない所もあるので、",
  }],
  [KATO]: [{
    from: "境内からは、復旧を終えた天守閣の姿を間近に望めます。",
    to: "境内からは、天守閣の姿を間近に望めます。2026年の地震で傷んだ石垣の復旧が続き、神社へ向かう道には片側交互通行の所もあるので、歩いてお参りし、現地の案内に従いましょう。",
  }],
  [JOSAIEN]: [{ from: "工芸館から城の南側へ歩いて約15分、", to: "加藤神社から城の南側へ歩いて約20分、" }],
};

type Plan = { id: string; h: number; m: number; stay: number; walk: number };
const PLAN: Plan[] = [
  { id: CASTLE, h: 9, m: 0, stay: 90, walk: 0 },
  { id: KATO, h: 10, m: 35, stay: 35, walk: 5 },
  { id: JOSAIEN, h: 11, m: 30, stay: 60, walk: 20 },
  { id: CAMK, h: 12, m: 50, stay: 90, walk: 20 },
  { id: KAMITORI, h: 14, m: 25, stay: 60, walk: 5 },
  { id: FUJISAKI, h: 15, m: 40, stay: 50, walk: 15 },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const d1 = it.days[0];
  if (d1.id !== DAY1 || d1.spots.map((s) => s.id).join() !== [CASTLE, KATO, KOGEIKAN, JOSAIEN, CAMK, KAMITORI, FUJISAKI].join()) throw new Error("構成が想定と違います");
  const byId = new Map(d1.spots.map((s) => [s.id, s]));
  const items = PLAN.map((p) => {
    let memo = byId.get(p.id)!.memo ?? "";
    for (const e of EDITS[p.id] ?? []) {
      if (memo.split(e.from).length !== 2) throw new Error(`${byId.get(p.id)!.name}: 直す文が見つからない`);
      memo = memo.replace(e.from, e.to);
    }
    return {
      id: p.id,
      data: {
        visitTime: t(p.h, p.m),
        stayDurationMin: p.stay,
        memo,
        transitLegs: { deleteMany: {}, ...(p.walk ? { create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: p.walk, transitLine: null }] } : {}) },
      },
    };
  });
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・徒歩${p.walk}分${st - prevEnd !== p.walk ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + p.stay)}${gap} ${byId.get(p.id)!.name}`);
    prevEnd = st + p.stay;
  }
  for (const id of Object.keys(EDITS)) console.log(`\n--- ${byId.get(id)!.name}\n${items.find((x) => x.id === id)!.data.memo}`);
  console.log(`\n熊本県伝統工芸館を外す: ${KOGEIKAN}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY1, items, { tx, remove: [KOGEIKAN] }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

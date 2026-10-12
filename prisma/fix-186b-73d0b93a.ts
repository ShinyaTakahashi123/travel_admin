/**
 * #186 73d0b93a の続き（しおりえ(制作補助2)）: 企画運営の確認で3点を直す
 *   ① 本栖湖: 今の千円札（令和6年から）の裏は北斎の「神奈川沖浪裏」なので、「平成16年（2004年）から発行された千円札」と過去の言い方にする
 *      （日本銀行 boj.or.jp/note_tfjgs/note/valid/issue.htm: E号券の千円券は平成16（2004）年11月1日発行開始・裏面は富士山と桜、今の千円券は令和6（2024）年7月3日発行開始・裏面は富嶽三十六景（神奈川沖浪裏））
 *   ② 富岳風穴: OSM の洞穴の入口の点 n7398711915 は小数の末尾が 0 で、手で写した値の疑いがあるので、名前つきの入口の料金所 n2098060090「富岳風穴」（35.4781267,138.6579604）に変える
 *   ③ 長池親水公園と産屋ヶ崎で湖面に映る富士山の話が2回あり、62195fcc の文とも似ているので、長池の一文を外し、産屋ヶ崎の一文を言い換える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-186b-73d0b93a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "73d0b93a-5979-41c5-8d67-3cdf7bbbf1da";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from?: string; to?: string; lat?: number; lng?: number }[] = [
  {
    name: "本栖湖",
    from: "撮った写真は、千円札の裏の図柄に使われています。",
    to: "撮った写真は、平成16年（2004年）から発行された千円札の裏の図柄に使われました。",
  },
  { name: "富岳風穴", lat: 35.4781267, lng: 138.6579604 },
  { name: "長池親水公園", from: "風のない日には、湖面に富士山が映ることもあります。", to: "" },
  {
    name: "産屋ヶ崎",
    from: "風のない晴れた日には、湖面に映る「逆さ富士」が見られることもあります。",
    to: "条件がそろえば、岬の先から、湖に逆さに映る富士山を写真に収めることもできます。",
  },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    let memo = s[0].memo ?? "";
    if (p.from !== undefined) {
      if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
      memo = memo.replace(p.from, p.to!);
    }
    console.log(`${p.name}${p.lat ? ` 座標 ${s[0].lat},${s[0].lng} → ${p.lat},${p.lng}` : ""}:\n  ${memo}\n`);
    return { id: s[0].id, data: { memo, ...(p.lat ? { lat: p.lat, lng: p.lng } : {}) } };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: o.data });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

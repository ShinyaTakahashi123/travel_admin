/**
 * #236 0534e5d3 の明善寺郷土館と高山陣屋の本文の書き分け（しおりえ(制作補助2)、企画運営の指摘を受けて、ほかのしおりと見比べた 10/11）
 * - 明善寺郷土館: #8d2e4984 の「本堂、庫裏、鐘楼が合掌造りのまま残る…本堂では…障壁画」と同じ組み立てだったので、
 *   出典（白川郷観光協会 https://shirakawa-go.gr.jp/active/12/ ）の囲炉裏を毎日焚いている話を中心に書き直す
 * - 高山陣屋: #d492e85b の「幕末に全国60数か所…当時の建物がほぼ完全な形で残る唯一」と同じ組み立てだったので、
 *   出典（飛騨高山旅ガイド https://www.hidatakayama.or.jp/spot/detail_1106.html ）の別の話（森林資源のため安永6年に郡代へ格上げ・身分で異なる出入り口・御役所・白洲）で書き直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-236c-0534e5d3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const MYOZENJI = "b3a80e59-c6e4-4d52-8d20-ff73f99aaee4";
const JINYA = "464a5142-7c70-4eec-85fb-6c625d958a03";
const COMMIT = process.argv.includes("--commit");
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const EDITS = [
  { id: MYOZENJI, head: "和田家から集落の中を南へ歩いて約10分。",
    memo: "和田家から集落の中を南へ歩いて約10分。合掌造りのお寺の庫裏を郷土館として公開していて、囲炉裏には毎日火が入れられ、昔ながらの火の香りにふれられます。雪をかぶった合掌造りのお寺の姿も、冬ならではの眺めです。" + PRAY },
  { id: JINYA, head: "中橋を渡り、歩いて約5分。",
    memo: "中橋を渡り、歩いて約5分。江戸時代に飛騨国を治めた幕府の役所で、森林の資源に恵まれた飛騨の重要さから、安永6年には代官所から郡代役所へ格上げされました。身分によって出入りする口が分けられていたことや、郡代が政務をとった部屋、罪を裁いた白洲などから、当時の役所のしくみを知ることができます。入場できる時間は公式の案内で確かめましょう。この夜は、高山の宿に泊まりましょう。" },
];

async function main() {
  const ops = [];
  for (const e of EDITS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: e.id } });
    if (!(s.memo ?? "").startsWith(e.head)) throw new Error(`${s.name}: 本文が想定と違います`);
    console.log(`${s.name}: ${e.memo}\n`);
    ops.push(prisma.spot.update({ where: { id: e.id }, data: { memo: e.memo } }));
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

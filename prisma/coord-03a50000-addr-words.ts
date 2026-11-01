/**
 * 03a50000（小豆島・日帰り）の追加の直し（しおりえ(制作補助2)、企画運営 11/02 の指示）
 * 1. 迷路のまちの住所の欄「香川県小豆郡土庄町土庄本町」→「香川県小豆郡土庄町」。「土庄本町」は確かめられないため外す
 *    （地理院の逆ジオコーダーで点 34.485194,134.185702 は 土庄町 大字「土庄」）
 * 2. ほかのスポットの、決まりで禁じた言葉（ください・おすすめ・〜してみてください）を、勧めない・言い切らない形に。文の中身は変えない
 *    オリーブ公園の「小豆島を代表する公園」は出典がないため「代表する」を外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-03a50000-addr-words.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const MEIRO = "7cac4872-f50a-4dd4-a6d3-3c4506024dfb";
const COMMIT = process.argv.includes("--commit");
const ADDR_FROM = "香川県小豆郡土庄町土庄本町";
const ADDR_TO = "香川県小豆郡土庄町";

const MEMO_EDITS: { id: string; edits: { from: string; to: string }[] }[] = [
  {
    id: "5b3cc001-a879-4972-baa0-ac8d0ca896b9", // 寒霞渓
    edits: [
      { from: "訪れる前に公式サイトで運行状況を確かめてください。", to: "訪れる前に公式サイトで運行状況を確かめておきましょう。" },
      { from: "四季折々の彩りを、ゆっくり楽しんでください。", to: "四季折々の彩りを、ゆっくり眺められます。" },
    ],
  },
  {
    id: "3b6c5a12-f228-4cdf-b999-ff29b4eb9e68", // マルキン醤油記念館
    edits: [{ from: "この一帯を少し歩いてみるのもおすすめです。", to: "この一帯を少し歩けます。" }],
  },
  {
    id: "cacba44a-d3c1-483a-8523-269469030c7d", // 岬の分教場
    edits: [{ from: "昭和初期の学び舎の雰囲気を感じてみてください。", to: "昭和初期の学び舎の雰囲気に触れられます。" }],
  },
  {
    id: "04792cb8-1448-4a83-a8f4-93fc37ef8356", // 二十四の瞳映画村
    edits: [{ from: "海を望む懐かしい町並みを、のんびりと歩いてみてください。", to: "海を望む懐かしい町並みを、のんびりと歩けます。" }],
  },
  {
    id: "f467fd32-dd87-4cbe-a6f3-6ba353cf37e9", // 道の駅 小豆島オリーブ公園
    edits: [
      { from: "知られる小豆島を代表する公園で、", to: "知られる小豆島の公園で、" },
      { from: "ゆっくりと園内を散策してみてください。", to: "ゆっくりと園内を散策できます。" },
    ],
  },
];

async function main() {
  const m = await prisma.spot.findUniqueOrThrow({ where: { id: MEIRO } });
  if (m.address !== ADDR_FROM) throw new Error(`${m.name}: いまの住所が想定と違います（${m.address}）`);
  console.log(`■ ${m.name}（${m.lat},${m.lng}）\n  住所 ${m.address} → ${ADDR_TO}`);

  const updates: { id: string; memo: string }[] = [];
  for (const { id, edits } of MEMO_EDITS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    let memo = s.memo ?? "";
    for (const e of edits) {
      if (memo.split(e.from).length !== 2) throw new Error(`${s.name}: 「${e.from}」が1か所ではありません`);
      memo = memo.replace(e.from, e.to);
    }
    const bad = memo.match(/ください|おすすめ|よいでしょう|みてください/g);
    console.log(`\n■ ${s.name}（メモだけ）`);
    for (const e of edits) console.log(`  「${e.from}」→「${e.to}」`);
    console.log(`  直したあとのメモ:\n  ${memo}${bad ? `\n  ⚠ 残っている言葉: ${bad.join("・")}` : ""}`);
    updates.push({ id, memo });
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: MEIRO }, data: { address: ADDR_TO } }),
    ...updates.map((u) => prisma.spot.update({ where: { id: u.id }, data: { memo: u.memo } })),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

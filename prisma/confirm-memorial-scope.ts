/**
 * 慰霊の印(isMemorial)の範囲拡大(企画運営2026-10-14 10:08 伝達、ユーザー決定)の
 * 確認モード専用スクリプト。
 *
 * 決まった範囲:「資料館・震災の伝承の場所・慰霊塔・護国神社・お墓を全部含める」
 * 現在は place_master・spot とも isMemorial=true が0件(登録時 --no-memorial のため)。
 *
 * このスクリプトは読み取り専用。件数と一覧(種類ごと)を出すだけで、
 * 書き込み(--commit)は行わない。企画運運営・法務が一覧を確かめたあと、
 * 対象を決めてから別の本登録スクリプトで isMemorial: true を立てる。
 *
 * 実行方法: npm run prod -- npx tsx prisma/confirm-memorial-scope.ts
 */
import { prisma } from "../src/lib/prisma";

type Group = {
  label: string;
  // name(またはcategory)に対するキーワード(いずれか含めば候補)
  keywords: string[];
  // 除外したい語(候補から誤って拾った一般名詞など)
  excludeKeywords?: string[];
};

const GROUPS: Group[] = [
  {
    label: "資料館(戦争・災害に関わるもの)",
    keywords: [
      "平和祈念", "平和記念", "戦争", "特攻", "原爆", "戦没", "空襲", "戦災", "戦跡",
      "震災", "津波", "防災", "被爆", "疎開",
    ],
  },
  {
    label: "震災の伝承の場所",
    keywords: ["震災", "津波", "伝承", "復興祈念", "被災"],
  },
  {
    label: "慰霊塔・慰霊碑",
    keywords: ["慰霊塔", "慰霊碑", "忠魂碑", "殉難", "殉職", "鎮魂"],
  },
  {
    label: "護国神社",
    keywords: ["護国神社"],
  },
  {
    label: "お墓(著名な陵墓・墓所)",
    keywords: ["天皇陵", "皇后陵", "之墓", "の墓", "御廟", "御陵", "墓所", "奥津城", "古墳"],
    // 古墳は「お墓」に該当するものだけを拾いたいが、名前だけでは区別しづらいため
    // 一覧に出してから目視で判断する(除外はしない)
  },
];

async function main() {
  console.log("[接続先チェック] host:", new URL(process.env.DATABASE_URL!).host);
  console.log("=== 確認モード(書き込みなし) ===\n");

  const all = await prisma.placeMaster.findMany({
    select: { id: true, name: true, category: true, address: true, isMemorial: true },
    orderBy: { name: "asc" },
  });
  console.log(`place_master 総件数: ${all.length}件 / 現在 isMemorial=true: ${all.filter((p) => p.isMemorial).length}件\n`);

  const seen = new Set<string>();
  let totalCandidates = 0;

  for (const g of GROUPS) {
    const hits = all.filter((p) => g.keywords.some((kw) => p.name.includes(kw)));
    console.log(`--- ${g.label}: ${hits.length}件 ---`);
    for (const h of hits) {
      console.log(`  [${h.category ?? "?"}] ${h.name}${h.address ? "  (" + h.address + ")" : ""}  id=${h.id}`);
      seen.add(h.id);
    }
    totalCandidates += hits.length;
    console.log();
  }

  // 参考: category="museum" だが上の戦争・震災キーワードに引っかからなかった資料館も、
  // 見落としがないか目視できるよう別途一覧を出す(対象に含めるかは企画運営・法務の判断)
  const otherMuseums = all.filter(
    (p) => p.category === "museum" && !GROUPS.some((g) => g.keywords.some((kw) => p.name.includes(kw)))
  );
  console.log(`--- (参考)category=museum でキーワードに引っかからなかった資料館: ${otherMuseums.length}件 ---`);
  for (const h of otherMuseums) {
    console.log(`  ${h.name}${h.address ? "  (" + h.address + ")" : ""}  id=${h.id}`);
  }
  console.log();

  console.log(`\n候補(重複除く)合計: ${seen.size}件 / 単純合計(重複含む): ${totalCandidates}件`);
  console.log("\nこれは確認モードです。書き込みは行っていません。");
}

main().finally(() => prisma.$disconnect());

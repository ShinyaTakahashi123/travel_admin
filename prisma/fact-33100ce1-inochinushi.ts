/**
 * 事実の直し: 33100ce1（日御碕神社と日御碕灯台、出雲の岬と絶景を巡る1泊2日）の命主社のメモ（しおりえ(制作補助2)）
 * docs/content/20261102-daytrip-coord-scan.md（33100ce1・bb5348fc の命主社の行、企画運営 11/04: 組み直しの順番より先に直してよい）
 * - 祀る神: 「あめのみなかぬしのかみ」→ 出雲大社の公式の境外の摂末社の案内
 *   https://izumooyashiro.or.jp/precinct/keidai-index/setumatu の「神魂伊能知奴志神社（命主社）御祭神 神産巣日大神（かみむすひのおおかみ）」
 *   （島根県神社庁の案内でも神皇産霊神。bb5348fc の「神皇産霊神(かみむすびのかみ)」は同じ神で、直さない）
 * - 「樹齢1000年ともいわれる」は、出典を見つけられなかったので外す（ムクノキがあることは OSM「大社のムクノキ」node4649149085）
 * - 銅戈・勾玉の出土は、島根県の真名井遺跡の案内（https://www.pref.shimane.lg.jp/life/bunka/bunkazai/shiseki/sanninshisekinwkaigi/shiseki-exploration/manai.html、
 *   命主社の背後の大石の下からヒスイ製の勾玉と銅戈）と合うので、そのまま
 * 文だけの直し（点・時刻・移動は変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fact-33100ce1-inochinushi.ts [--commit]
 */
import { main } from "./lib/coordfix-lib";

main("33100ce1-b739-4342-826f-4de81880d252", [
  {
    id: "848f7a92-b96e-429f-9ae2-8cb321d84976",
    label: "命主社",
    memo: [
      { from: "出雲大社の摂社のひとつで、「あめのみなかぬしのかみ」を祀る古社です。", to: "出雲大社の摂社のひとつで、神産巣日大神(かみむすひのおおかみ)を祀る古社です。" },
      { from: "境内には、樹齢1000年ともいわれる大きなムクノキがそびえ、", to: "境内には、大きなムクノキがそびえ、" },
    ],
  },
]);

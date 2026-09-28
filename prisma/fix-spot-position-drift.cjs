/**
 * 公開中・承認待ちしおりの位置ずれ修正スクリプト(2026-09-28作成)
 * docs/content/20260928-spot-position-drift.md の50件(大日寺を除く49件)が対象。
 *
 * 「正しい位置」は、しおりID・スポット名ではなく「正規化した名前(丸括弧を除いたもの)＋都道府県」で
 * 該当スポットを探し、現在の値がこの値と離れている(緯度経度どちらかが0.0005度=約50m超ずれている)
 * ものだけを更新する。
 *
 * 実行方法:
 *   確認モード(本番読み取りのみ): npm run prod -- node prisma/fix-spot-position-drift.cjs
 *   本登録(企画運営の確認・OKのあと): npm run prod -- node prisma/fix-spot-position-drift.cjs --commit
 */
const {createRequire}=require("module");const r=createRequire(process.cwd()+"/package.json");
r("dotenv").config();const {PrismaClient}=r("@prisma/client");const {PrismaPg}=r("@prisma/adapter-pg");
const p=new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL})});

const COMMIT = process.argv.includes("--commit");

// docs/content/20260928-spot-position-drift.md の「採用案」列にもとづく
const CORRECT = [
  ["青い池", "北海道", 43.493490, 142.614098, "3件中2件が一致、Nominatimも同じ値"],
  ["一斗俵沈下橋", "高知県", 33.284762, 133.109889, "Nominatim(一斗俵川)に近い"],
  ["美瑛の丘", "北海道", 43.59, 142.44, "北西の丘展望公園に近い方(要現地確認)"],
  ["丹後由良", "京都府", 35.5978, 135.2508, "3件中2件が一致"],
  ["経ヶ岬灯台", "京都府", 35.777139, 135.223361, "Nominatimと完全に一致"],
  ["三愛の丘展望公園", "北海道", 43.556945, 142.478368, "Nominatimと完全に一致"],
  ["長安寺", "神奈川県", 35.2735, 139.0128, "Nominatimで仙石原と確認"],
  ["淡輪ときめきビーチ", "大阪府", 34.3439, 135.1808, "要現地確認"],
  ["銀山温泉街", "山形県", 38.5697, 140.5808, "3件中2件が一致"],
  ["白銀の滝", "山形県", 38.5711, 140.5811, "3件中2件が一致"],
  ["琴引浜", "京都府", 35.699722, 135.041944, "Nominatimに近い"],
  ["水間寺", "大阪府", 34.398858, 135.385606, "Nominatimと完全に一致"],
  ["丹後国分寺跡", "京都府", 35.580056, 135.180056, "Nominatimと完全に一致"],
  ["旧軽井沢銀座通り", "長野県", 36.34842, 138.59703, "要現地確認"],
  ["大沼国定公園", "北海道", 41.9772, 140.6822, "Nominatim(大沼公園駅)に近い"],
  ["高湯通り", "山形県", 38.167871, 140.39601, "Nominatimと完全に一致"],
  ["蔵王ロープウェイ", "山形県", 38.161118, 140.394722, "本文を読み比べ同一施設と確認、住所と整合"],
  ["箱根海賊船", "神奈川県", 35.209722, 139.004444, "要現地確認"],
  ["成相寺", "京都府", 35.595439, 135.187372, "Nominatimと完全に一致"],
  ["ジョン万次郎資料館", "高知県", 32.781765, 132.932404, "Nominatimと完全に一致"],
  ["中禅寺湖", "栃木県", 36.740556, 139.462222, "3件中2件が完全一致"],
  ["拓真館", "北海道", 43.53, 142.489444, "Nominatimと完全に一致"],
  ["伊根の舟屋", "京都府", 35.6935, 135.2683, "3件中2件が一致"],
  ["トラピスチヌ修道院", "北海道", 41.78785, 140.822514, "Nominatimと完全に一致"],
  ["傘松公園", "京都府", 35.5869, 135.1947, "Nominatimと完全に一致、4件中2件が一致"],
  ["遠刈田温泉", "宮城県", 38.1381, 140.5967, "要現地確認"],
  ["来島海峡展望館", "愛媛県", 34.11356, 132.977005, "Nominatimと完全に一致"],
  ["能古島", "福岡県", 33.6383, 130.3081, "2件一致"],
  ["二色の浜公園", "大阪府", 34.4258, 135.3492, "2件一致"],
  ["天橋立", "京都府", 35.5561, 135.1892, "南側の文珠を代表点に(要現地確認)"],
  ["坂本八幡宮", "福岡県", 33.516778, 130.513472, "Nominatimと完全に一致"],
  ["金森赤レンガ倉庫", "北海道", 41.766111, 140.7175, "5件中3件が一致"],
  ["旧函館区公会堂", "北海道", 41.765028, 140.708889, "Nominatimと完全に一致、2件一致"],
  ["竈門神社", "福岡県", 33.5364, 130.5439, "2件一致"],
  ["高松塚古墳", "奈良県", 34.462222, 135.806472, "2件一致"],
  ["ベイサイドプレイス博多", "福岡県", 33.6014, 130.4103, "2件一致"],
  ["奈良文化財研究所飛鳥資料館", "奈良県", 34.4783, 135.8156, "2件一致"],
  ["大石公園", "山梨県", 35.5233, 138.7465, "Nominatimと完全に一致"],
  ["函館ハリストス正教会", "北海道", 41.762778, 140.712222, "2件一致"],
  ["金峯山寺", "奈良県", 34.3639, 135.8672, "2件一致"],
  ["さかい利晶の杜", "大阪府", 34.575952, 135.47026, "Nominatimと完全に一致"],
  ["まんだら湯", "兵庫県", 35.624456, 134.805731, "要現地確認(Nominatim見つからず)"],
  ["如意輪寺", "奈良県", 34.364556, 135.867861, "Nominatimと完全に一致"],
  ["南宗寺", "大阪府", 34.569019, 135.468478, "Nominatimと完全に一致"],
  ["りんくう公園", "大阪府", 34.412469, 135.295489, "2件一致"],
  ["天武・持統天皇陵", "奈良県", 34.468756, 135.807825, "Nominatimと完全に一致"],
  ["りんくうプレミアム・アウトレット", "大阪府", 34.406389, 135.296083, "Nominatimと完全に一致"],
  ["夢京橋キャッスルロード", "滋賀県", 35.27436, 136.25972, "2件一致"],
  ["壺屋やちむん通り", "沖縄県", 26.212461, 127.69236, "Nominatimと完全に一致"],
];

function stripParen(name) {
  return name.replace(/[（(][^）)]+[）)]/g, "").trim() || name;
}
const EPS = 0.0005; // 約50m

(async () => {
  const host = new URL(process.env.DATABASE_URL).host;
  console.log("[接続先チェック] host:", host);
  console.log(COMMIT ? "=== 修正モード ===" : "=== 確認モード（書き込みなし） ===");

  const its = await p.itinerary.findMany({
    where: { status: { in: ["published", "pending"] } },
    include: { days: { include: { spots: true } }, areas: { include: { area: true } } },
  });

  let totalTargets = 0, totalUpdated = 0, totalAlreadyOk = 0, totalNotFound = 0;

  for (const [name, pref, lat, lng, reason] of CORRECT) {
    const matches = [];
    for (const it of its) {
      const prefectureNames = it.areas.map((a) => a.area).filter((a) => a.level === "prefecture").map((a) => a.name);
      if (!prefectureNames.includes(pref)) continue;
      for (const d of it.days) {
        for (const s of d.spots) {
          if (stripParen(s.name) !== name) continue;
          matches.push({ spotId: s.id, itineraryId: it.id, itineraryTitle: it.title, status: it.status, spotName: s.name, lat: s.lat == null ? null : Number(s.lat), lng: s.lng == null ? null : Number(s.lng) });
        }
      }
    }
    if (matches.length === 0) { console.log(`\n[NG] 「${name}」(${pref}) のスポットが見つかりません`); totalNotFound++; continue; }

    console.log(`\n### ${name} (${pref}) 採用案: ${lat},${lng} — ${reason}`);
    for (const m of matches) {
      totalTargets++;
      const diff = m.lat == null || m.lng == null ? Infinity : Math.max(Math.abs(m.lat - lat), Math.abs(m.lng - lng));
      if (diff < EPS) {
        console.log(`  [そのまま] [${m.itineraryTitle}](${m.status}) 今: ${m.lat},${m.lng}`);
        totalAlreadyOk++;
        continue;
      }
      console.log(`  [直す] [${m.itineraryTitle}](${m.status}) 今: ${m.lat},${m.lng} → 新: ${lat},${lng}`);
      if (COMMIT) {
        await p.spot.update({ where: { id: m.spotId }, data: { lat, lng } });
        totalUpdated++;
      }
    }
  }

  console.log(`\n対象スポット総数: ${totalTargets} / そのまま(すでに正しい): ${totalAlreadyOk} / 見つからず: ${totalNotFound}`);
  if (COMMIT) {
    console.log(`更新した件数: ${totalUpdated}`);
  } else {
    console.log(`直す予定の件数: ${totalTargets - totalAlreadyOk}`);
    console.log("これは確認モードです。書き込みは行っていません。企画運営の確認・OKのあと --commit を付けて実行してください。");
  }
})().finally(() => p.$disconnect());

/**
 * チェックリスト #294 の修正記録(見直し2の続き、自分で発見)。
 * しおり「三朝川の河原風呂、野趣あふれる混浴露天と温泉街1泊2日」
 * (476fb1d7-5930-48de-894f-98a40c9f9333)
 *
 * 企画運営から出典の追加確認を依頼されたのを機に、陣所の館の現況を
 * Wikipedia(直接開いて確認)で調べたところ、2021年4月1日から「耐震基準を
 * 満たしておらず、工作物落下の危険性がある」との理由で閉館中(当面の間)と
 * 判明。館内には入れない状態のため、この本文のまま案内すると閉館中の施設に
 * 入れると誤解させてしまう。
 *
 * スポット名を「陣所の館」から「三朝温泉本通り」に変更し、本文を「館内で
 * 見学する」内容から、温泉本通り沿いに点在する「湯の街ギャラリー」(旅館や
 * 店舗の軒先を飾る展示、現在も見学可)を歩く内容に全面的に書き直した。
 * 陣所の館(建物・大綱の由来)は、閉館中であることを明記したうえで、外観の
 * 説明にとどめた。
 *
 * 出典(直接開いたURL):
 * https://ja.wikipedia.org/wiki/陣所の館 (閉館の事実)
 * https://misasaonsen.jp/sightseeings/sightseeing-2881/ (三朝温泉ポータル
 * 公式。綱は80m・胴回り最大2m・重さ2t)
 *
 * 座標・滞在時間・移動時間・宿の一言は変更していない。
 *
 * あわせて法務の指摘: 飛龍閣の「国の登録有形文化財に指定されており」は、
 * 登録有形文化財は「指定」ではなく「登録」のため、「登録されており」に修正。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-294e-476fb1d7.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "476fb1d7-5930-48de-894f-98a40c9f9333";

async function main() {
  const jinsho = await findSpotInItinerary(ITIN_ID, { spotName: "陣所の館" });
  const row = await prisma.spot.findUniqueOrThrow({ where: { id: jinsho.id } });
  if (row.name === "陣所の館") {
    await updateSpotInItinerary(ITIN_ID, { spotId: jinsho.id }, {
      name: "三朝温泉本通り",
      memo:
        "三朝神社からは歩いて8分ほどです。三朝橋のたもとから東へのびる温泉本通りは、石畳の小道沿いに旅館や店舗の軒先を飾る小さな展示「湯の街ギャラリー」が点在する通りです。世界の珍しい理容器具を集めたコーナーや、かじか蛙の人形を集めたコーナーなど、店ごとに趣向を凝らした展示をのぞきながら、そぞろ歩いてみましょう。通り沿いに立つ「陣所の館」は、毎年5月ごろに行われる「花湯まつり」の綱引き神事「陣所」で使う、重さおよそ2トン・長さ80mの大綱を伝える建物ですが、現在は建物の耐震性の問題で休館中のため、外観の見学にとどめましょう。 今夜はこの近くの宿に宿泊します。",
    });
  }
  const hiryukaku = await findSpotInItinerary(ITIN_ID, { spotName: "飛龍閣" });
  const hiryukakuRow = await prisma.spot.findUniqueOrThrow({ where: { id: hiryukaku.id } });
  const oldText = "国の登録有形文化財に指定されており";
  if (hiryukakuRow.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hiryukaku.id }, {
      memo: hiryukakuRow.memo.replace(oldText, "国の登録有形文化財に登録されており"),
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

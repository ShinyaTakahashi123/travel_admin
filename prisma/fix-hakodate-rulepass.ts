/**
 * 法務の10章見直し、函館(1c95d06d)の分。(v2: 法務・企画運営の直し指示を反映)
 *  1. 昼食の一文: 金森赤レンガ倉庫(10:58〜11:53)は決まりの昼食の時間帯(11:30〜13:30)の
 *     うち最後の23分だけなので使わない。函館山(12:08着・50分)の山頂展望台にレストラン
 *     「ジェノバ」があることを公式サイト(334.co.jp)で確かめたので、ここに追加。店の名前・
 *     営業時間・料金などの変わりやすい情報は書かない
 *  2. カトリック元町教会(lng=140.7132): OSM上の正しい点と同じ値（誤検出）のため直さない
 *  3. 湯の川温泉(日帰り入浴)(lat=41.7797,lng=140.7856): 温泉街全体を指すスポットで名前の
 *     ある地物がないため、7章の例外として市電の停留所「湯の川温泉」の点に直す
 *     （企画運営・法務OK、docs/content/20261102-winter-feature-rule-pass.md に記録済み）
 *  4. 追加の見直し。終わりの文・書き出しの文に分がない2区間（分は今の移動のまま）
 *     函館ハリストス正教会↔カトリック元町教会(歩2)／五稜郭タワー↔湯の川温泉 足湯
 *     「湯巡り舞台」(市電28)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "1c95d06d-e976-4728-8ccb-00d5d5690287";

type Fix = { name: string; from: string; to: string };

const fixes: Fix[] = [
  {
    name: "函館山",
    from: "ロープウェイは点検などで運休することがあるので、運行状況を公式サイトで確かめましょう。",
    to: "ロープウェイは点検などで運休することがあるので、運行状況を公式サイトで確かめましょう。山頂展望台にはレストランもあるので、ここで昼食にしましょう。営業時間などは公式サイトで確かめましょう。",
  },
  {
    name: "函館ハリストス正教会",
    from: "この後は、歩いてすぐのカトリック元町教会へ向かいましょう。",
    to: "この後は、歩いておよそ2分、カトリック元町教会へ向かいましょう。",
  },
  {
    name: "カトリック元町教会",
    from: "函館ハリストス正教会から歩いてすぐ、高さ33mの尖塔がそびえるカトリック元町教会に着きます。",
    to: "函館ハリストス正教会から歩いておよそ2分、高さ33mの尖塔がそびえるカトリック元町教会に着きます。",
  },
  {
    name: "五稜郭タワー",
    from: "この後は、市電で湯の川温泉へ向かいましょう。",
    to: "この後は、市電でおよそ28分、湯の川温泉へ向かいましょう。",
  },
  {
    name: "湯の川温泉 足湯「湯巡り舞台」",
    from: "五稜郭タワーから市電で湯の川温泉まで移動し、電停前にある足湯「湯巡り舞台」に着きます。",
    to: "五稜郭タワーから市電でおよそ28分、湯の川温泉まで移動し、電停前にある足湯「湯巡り舞台」に着きます。",
  },
];

const YUNOKAWA_NAME = "湯の川温泉(日帰り入浴)";
const YUNOKAWA_OLD_LAT = 41.7797;
const YUNOKAWA_OLD_LNG = 140.7856;
const YUNOKAWA_NEW_LAT = 41.78004;
const YUNOKAWA_NEW_LNG = 140.785172;

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const updates: { id: string; name: string; before: string; after: string }[] = [];
  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    const already = updates.find((u) => u.id === spot.id);
    const base = already ? already.after : spot.memo ?? "";
    if (!base.includes(f.from)) throw new Error(`${f.name}: 期待する文「${f.from}」が見つかりません`);
    const after = base.replace(f.from, f.to);
    if (already) already.after = after;
    else updates.push({ id: spot.id, name: f.name, before: spot.memo ?? "", after });
  }
  for (const u of updates) {
    console.log(`\n[${u.name}]\n旧: ${u.before}\n新: ${u.after}`);
  }

  const yunokawa = await prisma.spot.findFirstOrThrow({ where: { name: YUNOKAWA_NAME, day: { itineraryId: ITIN_ID } } });
  if (Math.abs(Number(yunokawa.lat) - YUNOKAWA_OLD_LAT) > 1e-6 || Math.abs(Number(yunokawa.lng) - YUNOKAWA_OLD_LNG) > 1e-6) {
    throw new Error(`${YUNOKAWA_NAME}: 座標現在値が期待と不一致`);
  }
  console.log(`\n[${YUNOKAWA_NAME}] 座標: ${YUNOKAWA_OLD_LAT},${YUNOKAWA_OLD_LNG} → ${YUNOKAWA_NEW_LAT},${YUNOKAWA_NEW_LNG}（市電停留所「湯の川温泉」、7章の例外）`);

  console.log("\n※カトリック元町教会(lng=140.7132)は誤検出のため直しません");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of updates) {
      await tx.spot.update({ where: { id: u.id }, data: { memo: u.after } });
    }
    await tx.spot.update({ where: { id: yunokawa.id }, data: { lat: YUNOKAWA_NEW_LAT, lng: YUNOKAWA_NEW_LNG } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

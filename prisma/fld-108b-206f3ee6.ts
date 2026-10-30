/**
 * #108 206f3ee6 の追加の直し（しおりえ(制作補助2)、法務 10/30 16:32）
 * 1. きさいや広場の点: 同じ名前のバス停 node 3152602997 → 道の駅の services way 440436800 の値 33.222501,132.55842。
 *    測り直し: 樺崎砲台跡から 936m・12.5分（12→13。着きを 11:31→11:32、滞在 50→49 で 12:21 に出るのは同じ）、宇和島駅まで 1,070m・14.3分（文の14→15）。
 *    開明学校の「卯之町駅から歩いておよそ6分」も 495m・6.6分なので 7分に（列車の区間51分の中で、時刻は変わらない）
 * 2. 2日目の書き出しに宿からの行き方と分数（決まり70）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-108b-206f3ee6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const KUSHIMA = "a0df5c5f-2ec3-47a3-ad4f-4f5da9bc3250";
const KISAIYA = "559f7433-8d9a-4c42-a37a-2729760f35b8";
const KAIMEI = "d62c0fac-bf50-4302-adda-6c259dc1ed46";
const COMMIT = process.argv.includes("--commit");
const FROM: [number, number] = [33.222143, 132.558288];
const TO: [number, number] = [33.222501, 132.55842];

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KUSHIMA]: [
    { from: "天赦園と伊達博物館から一夜明け、今日は九島へ向かいます。", to: "宇和島駅のまわりの宿からタクシーでおよそ11分、2日目は九島から。" },
    { from: "九島へのバスは本数が少ないため、宇和島駅のまわりの宿からタクシーでおよそ11分、九島大橋を渡って九島に着きます。", to: "九島へのバスは本数が少ないため、タクシーで九島大橋を渡ります。" },
  ],
  [KISAIYA]: [
    { from: "樺崎砲台跡から歩いておよそ12分、", to: "樺崎砲台跡から歩いておよそ13分、" },
    { from: "宇和島駅まで歩いておよそ14分、", to: "宇和島駅まで歩いておよそ15分、" },
  ],
  [KAIMEI]: [{ from: "卯之町駅から歩いておよそ6分、", to: "卯之町駅から歩いておよそ7分、" }],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [KUSHIMA, KISAIYA, KAIMEI] } }, include: { transitLegs: true } });
  const by = (id: string) => spots.find((s) => s.id === id)!;
  const k = by(KISAIYA);
  if (Number(k.lat) !== FROM[0] || Number(k.lng) !== FROM[1]) throw new Error(`きさいや広場: いまの座標が想定と違います（${k.lat},${k.lng}）`);
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = by(id);
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
      console.log(`${s.name}: → ${e.to}`);
    }
    memos[id] = m;
  }
  const hm = (d: Date | null) => (d ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "-");
  console.log(`きさいや広場: 座標 ${FROM.join(",")} → ${TO.join(",")}、時刻 ${hm(k.visitTime)}（${k.stayDurationMin}分、${k.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+")}）→ 11:32（49分、walk13）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: KISAIYA },
      data: {
        lat: TO[0],
        lng: TO[1],
        memo: memos[KISAIYA],
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 32)),
        stayDurationMin: 49,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13, transitLine: null }] },
      },
    });
    await tx.spot.update({ where: { id: KUSHIMA }, data: { memo: memos[KUSHIMA] } });
    await tx.spot.update({ where: { id: KAIMEI }, data: { memo: memos[KAIMEI] } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

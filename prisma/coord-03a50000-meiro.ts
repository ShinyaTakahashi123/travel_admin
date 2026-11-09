/**
 * 見直しのあとの座標の直し 1（しおりえ(制作補助2)、企画運営 11/02 の割り当て。docs/content/20261030-after-review-coord-todo.md）
 * 03a50000（小豆島・日帰り）の迷路のまち: いまの点は OSM の案内図「「迷路のまち」とは・・・」（information=map、node 10858814531）。
 *   #40（464a25fa）で決めた点、OSM「妖怪美術館02」tourism=museum way 966167850（Nominatim 34.4851942,134.1857019）にそろえる。
 * routed-foot: エンジェルロード→新しい点 1,041m 13.9分（もとの11分は、もとの点でも 1,104m 14.7分で短かった）→ 14分にする。
 *   着く時刻 16:19 → 16:22（滞在35はそのまま、16:57まで）。
 *   新しい点→土渕海峡の点（車をとめた所）189m 2.5分 →「およそ3分」。
 * メモ（法務・企画運営 11/02 の差し戻し）:
 *   エンジェルロード: 「およそ11分」→「14分」、「ください」2つを勧めない形に。
 *   迷路のまち: 由来は https://meipam.net/「海賊の侵入や戦乱に備えて、路地を迷路のように入り組ませたと言われている迷路のまち。」
 *     アートは同じページ（「迷路のまち」に妖怪美術館などのアート作品）。南北朝・海風・「数少ない」・白壁は確かめられず消す。
 *     「おすすめです」を消し、車に戻る一言を足す。
 * 追加（企画運営 11/02 00:5x・法務 00:51）: 土渕海峡→エンジェルロード routed-foot 1,155m 15.4分 → 歩11を15に。エンジェルロードは 15:18→15:22、滞在50→46（最後は16:57のまま）。
 *   土渕海峡のメモ: https://tabi-mag.jp/dofutchi/「小豆島と前島の間にある海峡です」「1996年に「世界で一番狭い海峡」…としてギネス認定された」
 *     「土庄町商工観光課では「世界一狭い海峡横断証明書」…も発行してくれます」「最狭部分には…永代橋（えいたいはし）が架かり」「世界一狭い土渕海峡を渡ろう！」。料金は書かない。
 *   エンジェルロードの「恋人の聖地」: https://tabi-mag.jp/ka0135/「「道の真ん中で手をつないだカップルは結ばれる」という伝説も生まれ、恋人の聖地にもなっています」（もとの文のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-03a50000-meiro.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const SPOT = "7cac4872-f50a-4dd4-a6d3-3c4506024dfb";
const ANGEL = "364758e8-765c-4fa4-8700-3256fc7b28aa";
const STRAIT = "cc9dd91a-af8d-4451-9a45-433315511da8";
const STRAIT_MEMO_HEAD = "道の駅 小豆島オリーブ公園から車でおよそ18分、土庄の中心部を流れる土渕海峡に着きます。";
const STRAIT_MEMO =
  "道の駅 小豆島オリーブ公園から車でおよそ18分、土庄町の土渕海峡に着きます。小豆島と前島の間にある海峡で、1996年に「世界で一番狭い海峡」としてギネスの認定を受けています。土庄町の商工観光課では、海峡を渡った証しの「世界一狭い海峡横断証明書」を発行しています。いちばん狭い所に架かる永代橋を歩いて、海峡を渡れます。この後は、車をとめたまま、歩いておよそ15分、エンジェルロードへ向かいましょう。";
const ANGEL_TIME_FROM = Date.UTC(1970, 0, 1, 15, 18);
const ANGEL_TIME_TO = new Date(Date.UTC(1970, 0, 1, 15, 22));
const COMMIT = process.argv.includes("--commit");
const FROM: [number, number] = [34.485941, 134.186568];
const TO: [number, number] = [34.4851942, 134.1857019];
const TIME_FROM = Date.UTC(1970, 0, 1, 16, 19);
const TIME_TO = new Date(Date.UTC(1970, 0, 1, 16, 22));
const WALK_FROM = 11;
const WALK_TO = 14;
const MEIRO_MEMO_HEAD = "エンジェルロードから歩いておよそ11分、土庄本町の迷路のまちに着きます。南北朝時代、";
const MEIRO_MEMO =
  "エンジェルロードから歩いておよそ14分、迷路のまちに着きます。海賊の侵入や戦乱に備えて、路地を迷路のように入り組ませたと伝えられる町並みです。細い路地の中には、妖怪美術館をはじめとするアートの施設があります。地図を片手に、ときには地図を見ずに、細い路地を歩けます。住まいの路地なので、家の敷地には入らず、静かに歩きましょう。寒霞渓の絶景から醤油の町、映画の舞台、オリーブの丘、海峡と砂の道、そして迷路のまちまで、小豆島をめぐる今日の旅を、ここで締めくくりましょう。帰りは、歩いておよそ3分、土渕海峡にとめた車に戻り、土庄港へ向かってフェリーに乗りましょう。";
const ANGEL_EDITS = [
  { from: "土渕海峡から歩いておよそ11分、", to: "土渕海峡から歩いておよそ15分、" },
  { from: "向かいの島へ渡れるようになる、小豆島を代表する景勝地です。", to: "向かいの島へ渡れるようになる景勝地です。" },
  { from: "訪れる前に公式サイトの潮見表で確かめてください。", to: "訪れる前に公式サイトの潮見表で確かめておきましょう。" },
  { from: "ゆっくりと歩いてみてください。", to: "ゆっくりと歩けます。" },
  { from: "この後は、歩いておよそ11分、土庄本町の迷路のまちへ向かいましょう。", to: "この後は、歩いておよそ14分、迷路のまちへ向かいましょう。" },
];

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT }, include: { transitLegs: true } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  if (s.visitTime?.getTime() !== TIME_FROM) throw new Error(`${s.name}: いまの時刻が想定と違います（${s.visitTime?.toISOString()}）`);
  if (s.transitLegs.length !== 1 || s.transitLegs[0].transitMode !== "walk" || s.transitLegs[0].transitDurationMin !== WALK_FROM)
    throw new Error(`${s.name}: いまの移動が想定と違います（${JSON.stringify(s.transitLegs)}）`);
  if (!(s.memo ?? "").startsWith(MEIRO_MEMO_HEAD)) throw new Error(`${s.name}: いまのメモが想定と違います`);

  const t = await prisma.spot.findUniqueOrThrow({ where: { id: STRAIT } });
  if (!(t.memo ?? "").startsWith(STRAIT_MEMO_HEAD)) throw new Error(`${t.name}: いまのメモが想定と違います`);
  const a = await prisma.spot.findUniqueOrThrow({ where: { id: ANGEL }, include: { transitLegs: true } });
  if (a.visitTime?.getTime() !== ANGEL_TIME_FROM || a.stayDurationMin !== 50) throw new Error(`${a.name}: いまの時刻・滞在が想定と違います`);
  if (a.transitLegs.length !== 1 || a.transitLegs[0].transitMode !== "walk" || a.transitLegs[0].transitDurationMin !== 11)
    throw new Error(`${a.name}: いまの移動が想定と違います（${JSON.stringify(a.transitLegs)}）`);
  let angelMemo = a.memo ?? "";
  for (const e of ANGEL_EDITS) {
    if (angelMemo.split(e.from).length !== 2) throw new Error(`${a.name}: 「${e.from}」が1か所ではありません`);
    angelMemo = angelMemo.replace(e.from, e.to);
  }

  console.log(`■ ${t.name}（メモだけ）
  もとのメモ:
  ${t.memo}
  直したあとのメモ:
  ${STRAIT_MEMO}
`);
  console.log(`■ ${a.name}
  時刻 15:18 → 15:22
  滞在 50 → 46（15:22〜16:08）
  移動 歩11 → 歩15`);
  for (const e of ANGEL_EDITS) console.log(`  「${e.from}」→「${e.to}」`);
  console.log(`  直したあとのメモ:\n  ${angelMemo}`);
  console.log(`\n■ ${s.name}\n  座標 ${s.lat},${s.lng} → ${TO[0]},${TO[1]}`);
  console.log(`  時刻 16:19 → 16:22（滞在${s.stayDurationMin}分はそのまま）\n  移動 歩${WALK_FROM} → 歩${WALK_TO}`);
  console.log(`  もとのメモ:\n  ${s.memo}\n  直したあとのメモ:\n  ${MEIRO_MEMO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: STRAIT }, data: { memo: STRAIT_MEMO } }),
    prisma.spot.update({ where: { id: ANGEL }, data: { memo: angelMemo, visitTime: ANGEL_TIME_TO, stayDurationMin: 46 } }),
    prisma.spotTransitLeg.update({ where: { id: a.transitLegs[0].id }, data: { transitDurationMin: 15 } }),
    prisma.spot.update({ where: { id: SPOT }, data: { lat: TO[0], lng: TO[1], visitTime: TIME_TO, memo: MEIRO_MEMO } }),
    prisma.spotTransitLeg.update({ where: { id: s.transitLegs[0].id }, data: { transitDurationMin: WALK_TO } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

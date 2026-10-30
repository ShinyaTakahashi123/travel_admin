/**
 * #89 会津・磐梯3泊4日の訂正その2。法務が本番で全27か所を確認して見つけた指摘を直す。
 *
 * 文(使わない言葉・言い切り):
 * - 初日 東山温泉「気をつけてください」→「気をつけましょう」
 * - 2日目 大内宿町並み展示館・3日目 野口英世記念館「バスの便がないので」→確かめられる事実(歩く
 *   と約〇分かかるので)に
 * - 2日目 大内宿「ゆっくり歩いてみてください」→「歩いてみましょう」
 * - 3日目 裏磐梯ビジターセンター「確かめてください」→「確かめましょう」
 * - 4日目 野口英世青春館の「周遊バス「あかべぇ」」→「周遊バス」
 *
 * 移動: 4日目1か所目(福島県立博物館)に残っていた古いtransitLeg(bus/25)を消す(1か所目の
 * 移動は書き出しの文に入っているので空にする)。
 *
 * 座標(同じ場所は同じ点に。案内板・道・地名の点を避ける):
 * - さざえ堂: 案内板の点 → さざえ堂の建物(way258640103)の中心(約10m)
 * - 東山温泉: 道「東山温泉線」の中心 → バス停「東山温泉駅」(node2272244943、メモの移動の
 *   行き先と同じ名前)
 * - 大内宿: 地名の点(place=hamlet) → 大内宿観光案内所(way311847242、通りに面した案内所)
 * - 湯野上温泉駅: バス停の点 → 駅そのもの(railway=station、node263252928、約48m)
 * - 飯盛山: 道路に近い点 → 白虎隊士の墓(情報板、node6763912254、メモの文言と同じ名前)
 * - 野口英世青春館: バス停「野口英世青春館前」(node5044177621)に厳密化(約5m、もとの点は
 *   このバス停とほぼ同じ場所だったため実質変更なし)
 * - はじまりの美術館: 住所(福島県耶麻郡猪苗代町新町4873番地)の地理院の点が今の値と完全に
 *   一致(GSIで確認)。変更しない
 * - 茶室麟閣: node418991912(カフェとして使われている建物、約17m)
 * - 塔のへつり: 駅の点(今の値) → メモが「駅で降りて歩いて約5分」の景色を見る内容のため、
 *   景色の名前の地物「塔のへつり吊り橋」(way223100885、約380m)に
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-89-c3b9522c-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-89-c3b9522c-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "c3b9522c-ed27-4728-bf23-8eab5f95b521";

const HIGASHIYAMA_ID = "9e4ff654-2a81-45f5-949c-b6395c32594a";
const OUCHIJUKU_TENJIKAN_ID = "fb0debca-093e-441a-b512-093a32c16ede";
const NOGUCHI_KINENKAN_ID = "b67cc7d5-2d4a-4709-b27b-4d2b836bb4ae";
const OUCHIJUKU_ID = "c60c3309-2fac-4f7e-b42c-c4e9a5b04558";
const VISITOR_CENTER_ID = "cd3a622b-86b9-4c8e-b627-7da829bb5979";
const SEISHUNKAN_ID = "9f5d2931-e121-42d8-8a87-cc8290b098c4";
const FUKUSHIMAHAKUBUTSUKAN_ID = "cec1ac0d-786a-4386-a80a-c004ca58c79e";

const SAZAEDO_ID = "c2a0087c-b3ed-47a1-a5c3-7bd57df1d245";
const YUNOKAMI_ID = "4c40dac2-95c3-43a5-b329-326e08455720";
const IIMORIYAMA_ID = "f954ae6a-464b-4877-8815-bca2844bfbb1";
const RINKAKU_ID = "87868327-d2c7-493c-b4a6-cd3ab2efb91b";
const TONOHETSURI_ID = "339c9aa1-3c46-4b27-97f2-0c2d0beb2a39";

const HIGASHIYAMA_FIND = "川沿いの道では足元に気をつけてください。";
const HIGASHIYAMA_REPLACE = "川沿いの道では足元に気をつけましょう。";

const OUCHIJUKU_TENJIKAN_FIND = "塔のへつりから大内宿へはバスの便がないので、タクシーで約20分（前もって予約しておくと安心です）。";
const OUCHIJUKU_TENJIKAN_REPLACE = "塔のへつりから大内宿までは歩くと3時間以上かかるので、タクシーで約20分です（前もって予約しておくと安心です）。";

const NOGUCHI_KINENKAN_FIND = "朝の早い時間は記念館へのバスの便がないので、駅からタクシーで約10分です。";
const NOGUCHI_KINENKAN_REPLACE = "朝の早い時間は駅から記念館まで歩くと1時間ほどかかるので、タクシーで約10分です。";

const OUCHIJUKU_FIND = "帰りのバスは本数が少ないので、その時刻に合わせて、ゆっくり歩いてみてください。";
const OUCHIJUKU_REPLACE = "帰りのバスは本数が少ないので、その時刻に合わせて歩いてみましょう。";

const VISITOR_CENTER_FIND = "休館日は公式の案内で確かめてください。";
const VISITOR_CENTER_REPLACE = "休館日は公式の案内で確かめましょう。";

const SEISHUNKAN_FIND = "三の丸口から周遊バス「あかべぇ」で野口英世青春館前へ。";
const SEISHUNKAN_REPLACE = "三の丸口から周遊バスで野口英世青春館前へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [higashiyama, tenjikan, kinenkan, ouchijuku, visitorCenter, seishunkan] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: HIGASHIYAMA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OUCHIJUKU_TENJIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NOGUCHI_KINENKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OUCHIJUKU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: VISITOR_CENTER_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SEISHUNKAN_ID } }),
  ]);

  for (const [label, text, find] of [
    ["東山温泉", higashiyama.memo ?? "", HIGASHIYAMA_FIND],
    ["大内宿町並み展示館", tenjikan.memo ?? "", OUCHIJUKU_TENJIKAN_FIND],
    ["野口英世記念館", kinenkan.memo ?? "", NOGUCHI_KINENKAN_FIND],
    ["大内宿", ouchijuku.memo ?? "", OUCHIJUKU_FIND],
    ["裏磐梯ビジターセンター", visitorCenter.memo ?? "", VISITOR_CENTER_FIND],
    ["野口英世青春館", seishunkan.memo ?? "", SEISHUNKAN_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newHigashiyamaMemo = higashiyama.memo!.replace(HIGASHIYAMA_FIND, HIGASHIYAMA_REPLACE);
  const newTenjikanMemo = tenjikan.memo!.replace(OUCHIJUKU_TENJIKAN_FIND, OUCHIJUKU_TENJIKAN_REPLACE);
  const newKinenkanMemo = kinenkan.memo!.replace(NOGUCHI_KINENKAN_FIND, NOGUCHI_KINENKAN_REPLACE);
  const newOuchijukuMemo = ouchijuku.memo!.replace(OUCHIJUKU_FIND, OUCHIJUKU_REPLACE);
  const newVisitorCenterMemo = visitorCenter.memo!.replace(VISITOR_CENTER_FIND, VISITOR_CENTER_REPLACE);
  const newSeishunkanMemo = seishunkan.memo!.replace(SEISHUNKAN_FIND, SEISHUNKAN_REPLACE);

  console.log("=== #89 訂正その2 ===\n");
  console.log("--- 文 ---");
  console.log("東山温泉:", newHigashiyamaMemo.slice(-60));
  console.log("大内宿町並み展示館:", newTenjikanMemo.slice(0, 80));
  console.log("野口英世記念館:", newKinenkanMemo.slice(0, 80));
  console.log("大内宿:", newOuchijukuMemo.slice(-60));
  console.log("裏磐梯ビジターセンター:", newVisitorCenterMemo.slice(-40));
  console.log("野口英世青春館:", newSeishunkanMemo.slice(0, 40));

  console.log("\n--- 移動 ---");
  console.log("福島県立博物館の古いtransitLeg(bus/25)を削除");

  console.log("\n--- 座標 ---");
  console.log("さざえ堂: 37.5045,139.953926(さざえ堂の建物の中心)");
  console.log("東山温泉: 37.4787771,139.9603992(バス停「東山温泉駅」)");
  console.log("大内宿: 37.3301683,139.8605812(大内宿観光案内所)");
  console.log("湯野上温泉駅: 37.3035478,139.8954093(駅そのもの)");
  console.log("飯盛山: 37.5041522,139.954369(白虎隊士の墓)");
  console.log("野口英世青春館: 37.4976056,139.9271812(バス停「野口英世青春館前」、約5m)");
  console.log("茶室麟閣: 37.486923,139.9308047(node418991912)");
  console.log("塔のへつり: 37.274194,139.906082(吊り橋、約380m)");
  console.log("はじまりの美術館: 変更なし(GSIの住所の点と完全一致を確認済み)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: HIGASHIYAMA_ID }, data: { memo: newHigashiyamaMemo, lat: 37.4787771, lng: 139.9603992 } }),
    prisma.spot.update({ where: { id: OUCHIJUKU_TENJIKAN_ID }, data: { memo: newTenjikanMemo } }),
    prisma.spot.update({ where: { id: NOGUCHI_KINENKAN_ID }, data: { memo: newKinenkanMemo } }),
    prisma.spot.update({ where: { id: OUCHIJUKU_ID }, data: { memo: newOuchijukuMemo, lat: 37.3301683, lng: 139.8605812 } }),
    prisma.spot.update({ where: { id: VISITOR_CENTER_ID }, data: { memo: newVisitorCenterMemo } }),
    prisma.spot.update({ where: { id: SEISHUNKAN_ID }, data: { memo: newSeishunkanMemo, lat: 37.4976056, lng: 139.9271812 } }),
    prisma.spot.update({ where: { id: SAZAEDO_ID }, data: { lat: 37.5045, lng: 139.953926 } }),
    prisma.spot.update({ where: { id: YUNOKAMI_ID }, data: { lat: 37.3035478, lng: 139.8954093 } }),
    prisma.spot.update({ where: { id: IIMORIYAMA_ID }, data: { lat: 37.5041522, lng: 139.954369 } }),
    prisma.spot.update({ where: { id: RINKAKU_ID }, data: { lat: 37.486923, lng: 139.9308047 } }),
    prisma.spot.update({ where: { id: TONOHETSURI_ID }, data: { lat: 37.274194, lng: 139.906082 } }),
    prisma.spot.update({ where: { id: FUKUSHIMAHAKUBUTSUKAN_ID }, data: { transitLegs: { deleteMany: {} } } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

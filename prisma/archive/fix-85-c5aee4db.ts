/**
 * #85 c5aee4db（天橋立と伊根の舟屋、海と絶景の丹後めぐり旅）D1分。
 * 通常の見直し(決まり: 4か所以上、開始8:30〜9:30、終了16:30〜17:00、
 * 滞在を延ばさない、宿の一言、昼食の一言、言い切り、座標)。
 *
 * 経ヶ岬灯台の84分は、駐車場から灯台までの片道徒歩約20分(往復40分、公式・
 * 現地レポートで確認)を含む長さのため、水増しではないと判断。ただしその
 * アクセスの説明が本文になかったため追加。「初めて灯がともされた」に
 * ヘッジを追加(言い切り対策)。
 *
 * 丹後国分寺跡の84分は、遺構(礎石のみ)の見学としては長すぎる(決まりA)ため
 * 25分に短縮。隣接する京都府立丹後郷土資料館は長期臨時休館中(2024年7月〜
 * 2027年3月頃予定、公式サイトで確認)のため追加候補から除外。
 *
 * 空いた時間は、天橋立ビューランド(実在、南側の展望リフト・モノレール、
 * OSM way 539368280。冬季は16:30閉園のため最終スポットにはせず先に配置)、
 * 智恩寺(実在、日本三文殊の一つとされる名刹、拝観自由・無休、OSM way
 * 683935012)を追加して埋めた。伊根の舟屋に昼食の一言を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KYOGAMISAKI_MEMO =
  "丹後半島の最北端、日本海を見渡す白亜の灯台です。明治31年（1898年）に初めて灯がともされたと伝えられる、日本でも数少ない「第1等灯台」の一つ。フランス製のレンズは重さ5トンにもおよび、同じ規格のレンズが使われているのは全国でも犬吠埼や室戸岬などわずかな灯台に限られるという貴重なものです。灯台の建材を切り出した石切り場の跡が、今も足元の海岸に残されています。駐車場から灯台までは、上り坂の遊歩道を歩いておよそ20分。歩きやすい靴で、景色を楽しみながらゆっくり向かいましょう。";

const INE_MEMO =
  "1階が船のガレージ、2階が住居という、全国的にも珍しい建築様式の家並みが、伊根湾の海際に立ち並ぶ漁村です。もとは山の中腹に集落を構えていましたが、18世紀ごろ、漁をしやすいよう海辺へ移り住むようになったと伝えられています。湾に沿って約230軒の舟屋が連なる景観は2005年、漁村として全国で初めて国の重要伝統的建造物群保存地区に選定されました。舟をそのまま収納できる1階のつくりに、ここならではの暮らしぶりがうかがえます。舟屋を改装した食事処も点在しているので、ここで昼食にするのもおすすめです。";

const KOKUBUNJI_MEMO =
  "天橋立を見下ろす高台に残る、奈良時代の寺院跡です。聖武天皇が天平13年（741年）に発した「国分寺建立の詔」を受け、各地に建てられた国分寺の一つと伝えられています。奈良時代には全国に疫病や社会不安が広がっており、仏教の力で国を鎮めようとしたのがその背景でした。今は礎石などが残るのみですが、かつてこの地に大きな伽藍があったことに思いをはせながら歩いてみてください。この後は、車でおよそ9分、天橋立ビューランドへ向かいましょう。";

const VIEWLAND_MEMO =
  "丹後国分寺跡から車でおよそ9分、天橋立の南側にそびえる天橋立ビューランドに着きます。リフトやモノレールで山上へ登ると、股のぞきをして見ると天橋立が天へ舞い上がる龍のように見えるという「飛龍観」を楽しめます。北側の傘松公園から見る「昇龍観」とは、また違った角度からの絶景です。営業時間は季節によって変わるので、訪れる前に公式サイトで確かめましょう。この後は、車でおよそ10分、智恩寺へ向かいましょう。";

const CHIONJI_MEMO =
  "天橋立ビューランドから車でおよそ10分、天橋立のたもとに立つ智恩寺に着きます。日本三文殊の一つとされる名刹で、知恵を授かる文殊菩薩をまつることから「切戸の文殊」とも呼ばれ、受験生をはじめ多くの参拝者が訪れます。室町時代建立と伝わる多宝塔は国の重要文化財に指定されており、境内の「智恵の輪灯籠」は、江戸時代に航海の安全を願って建てられたとされ、輪をくぐると智恵を授かるといわれています。すぐそばには、天橋立の入口にかかる廻旋橋もあり、あわせて眺めてみてください。静かに、敬意をもってお参りください。今夜は近くの宿でゆっくりお休みください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "7721a48b-add6-4f86-86bc-e455f61d5d2c", data: {} }, // 琴引浜
    { id: "3ed4d230-3b02-49f4-ac39-4057dcf51088", data: { memo: KYOGAMISAKI_MEMO } }, // 経ヶ岬灯台
    { id: "5cc71901-3648-4dfc-b001-23ff64deda5b", data: { memo: INE_MEMO } }, // 伊根の舟屋
    { id: "08cd6903-ce8a-4924-ba78-c70cd6c53c55", data: {} }, // 丹後由良
    {
      id: "fa8a3736-b0c3-4f72-88a4-429ddaa9a35f", // 丹後国分寺跡
      data: { memo: KOKUBUNJI_MEMO, stayDurationMin: 25 },
    },
    {
      create: {
        name: "天橋立ビューランド",
        address: "京都府宮津市字文珠437",
        lat: 35.552395,
        lng: 135.1815922,
        memo: VIEWLAND_MEMO,
        visitTime: t(14, 52),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    {
      create: {
        name: "智恩寺",
        address: "京都府宮津市文珠466",
        lat: 35.5586839,
        lng: 135.1840746,
        memo: CHIONJI_MEMO,
        visitTime: t(15, 42),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "7721a48b-add6-4f86-86bc-e455f61d5d2c": 50,
    "3ed4d230-3b02-49f4-ac39-4057dcf51088": 84,
    "5cc71901-3648-4dfc-b001-23ff64deda5b": 41,
    "08cd6903-ce8a-4924-ba78-c70cd6c53c55": 58,
  };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

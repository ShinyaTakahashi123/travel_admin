/**
 * #82(朝から夜まで満喫、京都の「和」を味わい尽くすプラン、2泊3日、
 * 2eb3162a)の初日・最終日の見直し。
 *
 * 【言葉づかいの直し】「〜してください」「〜お過ごしください」
 * 「〜てみてください」「〜締めくくってください」など、決まりに合わない
 * 言い方が13か所あったため、「〜しましょう」「〜てみましょう」に直した
 * (清水寺・六波羅蜜寺・祇園白川の「お参りください」は既存の許容形の
 * ため変更なし)。
 *
 * 【座標(法務の指摘、16か所)】祇園花見小路・八坂神社・法観寺・八坂庚申堂・
 * 清水寺・京都国立博物館・建仁寺・先斗町・鴨川(四条大橋)・河原町商店街
 * (四条河原町)・錦市場(錦天満宮、入口の目印)・京都文化博物館・京都御所
 * (建礼門)・三十三間堂・六波羅蜜寺をOSMの名前の点に直した。円山公園は
 * メモが「名物のしだれ桜」の内容のため、企画運営が取得したしだれ桜の
 * 木そのもの(node4517278152)の点を使用。座標を直した前後の移動を
 * 測り直したが、すべて実測との差5分未満でほぼ一致、変更なし。
 *
 * 【Day1(初日)】09:00開始で範囲外だったため、入口の一文を、実際の
 * 乗り物(バス)と歩きの実測に基づく形に直した(JR京都駅に10時30分ごろ
 * 着(入口は10:30より前にしない決まり)→市バスで約20分の「祇園」で降り、
 * 歩いて約3分→祇園花見小路10:53着)。このままでは終了が17:07になるため、
 * 滞在を細かく削るのではなく、法務・企画運営の判断で、説明文に名前の
 * 出てこないねねの道(写真0枚、高台寺と三年坂を結ぶ短い通路)を外した。
 * 高台寺→三年坂の直接の区間を測り直し(実測6.8分、7分に直す)。知恩院→
 * 青蓮院(walk)の移動も測り直し(4分→実測9.2分、短すぎた、9分に直す)。
 * 知恩院に昼食の一文を追加した(法務の指摘、3日とも昼食の一文がなかった
 * ため)。
 *
 * 新しい時刻: 祇園花見小路10:53(44)→八坂神社11:42(28)→
 * 知恩院12:17(44、昼食)→青蓮院13:10(36)→円山公園13:55(44)→
 * 高台寺14:44(48)→三年坂（産寧坂）15:39(36)→
 * 法観寺（八坂の塔）16:17(20)→八坂庚申堂16:42(16、〜16:58)
 *
 * 【Day2(中日)】すでに決まり(8:30〜9:30開始・16:30〜17:00終了)に合うため
 * 時刻は変更不要だったが、祇園白川→鴨川(walk)が5分→実測11.0分(短すぎた)
 * だったため11分に直し、以降を+6分ずらして終了を16:35→16:41にした
 * (範囲内)。六波羅蜜寺に昼食の一文を追加した。
 *
 * 【Day3(最終日、2泊以上のため決まりは14:30〜15:00)】現状09:00開始・
 * 16:34終了と大きく外れていた。企画運営の判断で、説明文に名前が出て
 * こない新京極商店街・京都文化博物館を外し(文化博物館の写真1枚は
 * 表紙未使用)、並びを「京都御所→平安神宮→河原町商店街→錦市場(昼食)→
 * 二条城」に変えた(御所・平安神宮が北側、河原町・錦市場・二条城が
 * 南〜西側でまとまり、無理な移動がない)。移動は実際に使う乗り物(バス・
 * 地下鉄)で測り直し: 御所→平安神宮(もとのまま12分)、平安神宮→
 * 河原町(新規、バスでおよそ18分)、河原町→錦市場(歩いておよそ7分、
 * 実測7.1分)、錦市場→二条城(新規、地下鉄でおよそ20分)。1か所目(京都
 * 御所)に宿からの行き方を追加し、最後(二条城)に帰りの一文を追加した。
 * 滞在は御所・二条城のみわずかに短縮し、ほかはもとのまま(延ばしなし)。
 *
 * 新しい時刻: 京都御所09:00(55)→平安神宮10:07(65)→
 * 河原町商店街11:30(40)→錦市場12:17(63、昼食)→二条城13:40(80、〜15:00)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-82-2eb3162a.ts
 *   反映: npm run prod -- npx tsx prisma/fix-82-2eb3162a.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "3f586cfa-7f30-4d07-9a97-726ad75e50b7";
const DAY2_ID = "5158a894-0338-4826-89ce-62cb30c5ae40";
const DAY3_ID = "2e4e44c8-5a6f-4155-a244-5192d5cf52d4";

// Day1
const GION_ID = "33d8a806-1740-4053-9193-578a4cb5099b";
const YASAKA_ID = "89a9a4b2-6287-4054-9298-d66000f13193";
const CHIONIN_ID = "81db5270-9899-4bff-9f25-f75bd108a62d";
const SHORENIN_ID = "e8ace3c2-2c03-46a0-a4e6-808c2e086797";
const MARUYAMA_ID = "90bb66b9-5be3-48a3-953e-3558e37b7dec";
const KODAIJI_ID = "4c6f0c71-4a32-44f0-aa4e-a948461e707b";
const NENENOMICHI_ID = "18ab92d0-51b4-4775-8355-de0a373e1402";
const SANNENZAKA_ID = "e94f2871-08e2-46c7-a372-5655e8b952d7";
const HOKANJI_ID = "6ec5f619-8127-4006-aa3e-099c345f9a1b";
const KOSHINDO_ID = "2f92fd44-e327-4041-9fc9-7a2e9a7129ae";

// Day2
const KIYOMIZU_ID = "a42b9e9a-5242-4dd7-9c02-9dccee067a89";
const HAKUBUTSUKAN2_ID = "ffb9d2c7-00d7-4ffc-8dc2-aa02d99a389d";
const SANJUSANGENDO_ID = "e7ca8cea-ee18-4632-99f8-024fd433a93a";
const ROKUHARAMITSUJI_ID = "93e93465-db88-4176-a42d-89a21fcf3228";
const KENNINJI_ID = "7fb6e998-67f4-4bdf-881d-37c975a27b5b";
const SHIRAKAWA_ID = "6380f73b-c1c6-40e1-9521-986b8fe1a955";
const KAMOGAWA_ID = "774a4508-2bd5-4c7c-a7a5-af859af52a75";
const PONTOCHO_ID = "91dd3666-6af1-47ed-ade8-548c88d85af9";

// Day3
const KAWARAMACHI_ID = "4f05d84d-a432-4ef0-bfba-141750a0a531";
const SHINKYOGOKU_ID = "30ecd3e6-8ca4-4ebd-b39c-b74cd73db40e";
const NISHIKI_ID = "a4b42610-97ee-465c-b978-213511bb0c54";
const BUNKAHAKUBUTSUKAN_ID = "36e79951-b488-4bf8-a96c-caf549a0d6f3";
const GOSHO_ID = "ca692169-498a-49be-bd5d-af3152dade5c";
const HEIANJINGU_ID = "8942782c-6834-492b-ba27-f4dcc18a0539";
const NIJOJO_ID = "671dc6a9-a919-44b2-b9ea-11474f6a5f93";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// ---- 座標 ----
const COORDS = {
  GION: { lat: 35.002524, lng: 135.7747856 },
  YASAKA: { lat: 35.0036027, lng: 135.7782611 },
  MARUYAMA: { lat: 35.0036127, lng: 135.7802998 }, // 円山公園、しだれ桜(node4517278152)。メモが「名物のしだれ桜」の内容のため
  HOKANJI: { lat: 34.9984113, lng: 135.7793113 },
  KOSHINDO: { lat: 34.9983685, lng: 135.7787632 },
  KIYOMIZU: { lat: 34.994303, lng: 135.7844389 },
  HAKUBUTSUKAN2: { lat: 34.989896, lng: 135.7728606 },
  KENNINJI: { lat: 35.0002572, lng: 135.7737408 },
  PONTOCHO: { lat: 35.0042456, lng: 135.7712126 },
  KAMOGAWA: { lat: 35.0038208, lng: 135.7715003 }, // 四条大橋
  KAWARAMACHI: { lat: 35.0037796, lng: 135.76932 }, // 四条河原町
  NISHIKI: { lat: 35.0050563, lng: 135.7674152 }, // 錦天満宮(入口の目印)
  BUNKAHAKUBUTSUKAN: { lat: 35.0094898, lng: 135.7623128 },
  GOSHO: { lat: 35.02329, lng: 135.7621463 }, // 建礼門
  SANJUSANGENDO: { lat: 34.9881723, lng: 135.7717781 },
  ROKUHARAMITSUJI: { lat: 34.9970611, lng: 135.77333 },
};

// ---- 言葉づかい・文言の直し ----
const GION_FIND = "紅殻格子と犬矢来が続くお茶屋建築の町並みは、今も景観保全地区として大切に守られ、1日の始まりにふさわしい祇園情緒を味わえます。";
const GION_REPLACE =
  "JR京都駅に10時30分ごろ着いたら、市バスで約20分の「祇園」で降り、歩いて約3分の祇園花見小路へ。紅殻格子と犬矢来が続くお茶屋建築の町並みは、今も景観保全地区として大切に守られ、1日の始まりにふさわしい祇園情緒を味わえます。";

const YASAKA_FIND = "朝の澄んだ空気の中、静かに、敬意をもって参拝してください。";
const YASAKA_REPLACE = "朝の澄んだ空気の中、静かに、敬意をもって参拝しましょう。";

const CHIONIN_FIND = "今も多くの僧侶が修行する場ですので、境内では静かに、敬意をもってお過ごしください。";
const CHIONIN_REPLACE =
  "今も多くの僧侶が修行する場ですので、境内では静かに、敬意をもって過ごしましょう。このあたりで、昼食にしましょう。";

const SHORENIN_FIND1 = "知恩院から歩いておよそ4分、青蓮院に着きます。";
const SHORENIN_REPLACE1 = "知恩院から歩いておよそ9分、青蓮院に着きます。";
const SHORENIN_FIND2 = "今も法要が営まれる寺院ですので、境内では静かに、敬意をもってお過ごしください。";
const SHORENIN_REPLACE2 = "今も法要が営まれる寺院ですので、境内では静かに、敬意をもって過ごしましょう。";

const KODAIJI_FIND1 = "今も法要が営まれるお寺ですので、境内では静かに、敬意をもってお過ごしください。";
const KODAIJI_REPLACE1 = "今も法要が営まれるお寺ですので、境内では静かに、敬意をもって過ごしましょう。";
const KODAIJI_FIND2 = "この後は、ねねの道を歩いてみましょう。";
const KODAIJI_REPLACE2 = "この後は、三年坂を歩いてみましょう。";

const SANNENZAKA_FIND1 = "ねねの道から歩いておよそ4分、三年坂(産寧坂)に着きます。";
const SANNENZAKA_REPLACE1 = "高台寺から歩いておよそ7分、三年坂(産寧坂)に着きます。";
const SANNENZAKA_FIND2 = "石畳につまずかないよう、足元に気をつけながら散策を楽しんでください。";
const SANNENZAKA_REPLACE2 = "石畳につまずかないよう、足元に気をつけながら散策を楽しみましょう。";

const HOKANJI_FIND = "静かに、敬意をもって参拝してください。";
const HOKANJI_REPLACE = "静かに、敬意をもって参拝しましょう。";

const KOSHINDO_FIND1 = "参拝の際は、静かに、敬意をもってお過ごしください。";
const KOSHINDO_REPLACE1 = "参拝の際は、静かに、敬意をもって過ごしましょう。";
const KOSHINDO_FIND2 = "カラフルな境内を眺めながら、東山さんぽの1日目を締めくくってください。";
const KOSHINDO_REPLACE2 =
  "カラフルな境内を眺めながら、東山さんぽの1日目を締めくくりましょう。この夜は、京都市内の宿に泊まりましょう。";

const SANJUSANGENDO_FIND = "壮観な観音像の群れを、静かに、敬意をもって拝観してください。";
const SANJUSANGENDO_REPLACE = "壮観な観音像の群れを、静かに、敬意をもって拝観しましょう。";

const ROKUHARAMITSUJI_FIND = "静かに、敬意をもってお参りください。";
const ROKUHARAMITSUJI_REPLACE = "静かに、敬意をもってお参りください。このあたりで、昼食にしましょう。";

const KENNINJI_FIND = "静かに、敬意をもって拝観してください。";
const KENNINJI_REPLACE = "静かに、敬意をもって拝観しましょう。";

const PONTOCHO_FIND = "今日はここで、朝から夜まで京都の「和」を味わい尽くす2日目を締めくくってください。";
const PONTOCHO_REPLACE =
  "今日はここで、朝から夜まで京都の「和」を味わい尽くす2日目を締めくくりましょう。この夜も、京都市内の宿に泊まりましょう。";

const HEIANJINGU_FIND = "参拝の際は、静かに、敬意をもってお過ごしください。";
const HEIANJINGU_REPLACE = "参拝の際は、静かに、敬意をもって過ごしましょう。";

const NIJOJO_FIND = "平安神宮から電車と徒歩でおよそ18分、二条城に着きます。";
const NIJOJO_REPLACE1 = "錦市場から地下鉄と徒歩でおよそ20分、二条城に着きます。";
const NIJOJO_FIND2 = "江戸幕府の始まりと終わりを見届けた城で、朝から夜まで京都の「和」を味わい尽くす2泊3日の旅を締めくくってください。";
const NIJOJO_REPLACE2 =
  "江戸幕府の始まりと終わりを見届けた城で、朝から夜まで京都の「和」を味わい尽くす2泊3日の旅を締めくくりましょう。見学を終えたら、市バスや地下鉄で京都駅へ向かい、帰りの新幹線や電車に乗りましょう。";

const NISHIKI_FIND = "「京の台所」と呼ばれる食べ歩き天国のアーケード商店街です。";
const NISHIKI_REPLACE =
  "河原町商店街から歩いて約7分、「京の台所」と呼ばれる食べ歩き天国のアーケード商店街です。このあたりで、昼食にしましょう。";

const GOSHO_FIND1 = "かつての天皇の住まいです。";
const GOSHO_REPLACE1 = "3日目は、宿から市バスで約15分の京都御所へ。かつての天皇の住まいです。";
const GOSHO_FIND2 = "広大な御苑と美しい建築が見どころです。";
const GOSHO_REPLACE2 = "広大な御苑と美しい建築が見どころです。公開の時間や休みの日は、公式の案内で確かめましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const spots = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: GION_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YASAKA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CHIONIN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHORENIN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KODAIJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SANNENZAKA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HOKANJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KOSHINDO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SANJUSANGENDO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ROKUHARAMITSUJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KENNINJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: PONTOCHO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HEIANJINGU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NIJOJO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NISHIKI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GOSHO_ID } }),
  ]);
  const [
    gion,
    yasaka,
    chionin,
    shorenin,
    kodaiji,
    sannenzaka,
    hokanji,
    koshindo,
    sanjusangendo,
    rokuharamitsuji,
    kenninji,
    pontocho,
    heianjingu,
    nijojo,
    nishiki,
    gosho,
  ] = spots;

  for (const [label, spot, find] of [
    ["祇園花見小路", gion, GION_FIND],
    ["八坂神社", yasaka, YASAKA_FIND],
    ["知恩院", chionin, CHIONIN_FIND],
    ["青蓮院(1)", shorenin, SHORENIN_FIND1],
    ["青蓮院(2)", shorenin, SHORENIN_FIND2],
    ["高台寺(1)", kodaiji, KODAIJI_FIND1],
    ["高台寺(2)", kodaiji, KODAIJI_FIND2],
    ["三年坂(1)", sannenzaka, SANNENZAKA_FIND1],
    ["三年坂(2)", sannenzaka, SANNENZAKA_FIND2],
    ["法観寺", hokanji, HOKANJI_FIND],
    ["八坂庚申堂(1)", koshindo, KOSHINDO_FIND1],
    ["八坂庚申堂(2)", koshindo, KOSHINDO_FIND2],
    ["三十三間堂", sanjusangendo, SANJUSANGENDO_FIND],
    ["六波羅蜜寺", rokuharamitsuji, ROKUHARAMITSUJI_FIND],
    ["建仁寺", kenninji, KENNINJI_FIND],
    ["先斗町", pontocho, PONTOCHO_FIND],
    ["平安神宮", heianjingu, HEIANJINGU_FIND],
    ["二条城(1)", nijojo, NIJOJO_FIND],
    ["二条城(2)", nijojo, NIJOJO_FIND2],
    ["錦市場", nishiki, NISHIKI_FIND],
    ["京都御所(1)", gosho, GOSHO_FIND1],
    ["京都御所(2)", gosho, GOSHO_FIND2],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newGionMemo = gion.memo!.replace(GION_FIND, GION_REPLACE);
  const newYasakaMemo = yasaka.memo!.replace(YASAKA_FIND, YASAKA_REPLACE);
  const newChioninMemo = chionin.memo!.replace(CHIONIN_FIND, CHIONIN_REPLACE);
  const newShoreninMemo = shorenin.memo!.replace(SHORENIN_FIND1, SHORENIN_REPLACE1).replace(SHORENIN_FIND2, SHORENIN_REPLACE2);
  const newKodaijiMemo = kodaiji.memo!.replace(KODAIJI_FIND1, KODAIJI_REPLACE1).replace(KODAIJI_FIND2, KODAIJI_REPLACE2);
  const newSannenzakaMemo = sannenzaka.memo!.replace(SANNENZAKA_FIND1, SANNENZAKA_REPLACE1).replace(SANNENZAKA_FIND2, SANNENZAKA_REPLACE2);
  const newHokanjiMemo = hokanji.memo!.replace(HOKANJI_FIND, HOKANJI_REPLACE);
  const newKoshindoMemo = koshindo.memo!.replace(KOSHINDO_FIND1, KOSHINDO_REPLACE1).replace(KOSHINDO_FIND2, KOSHINDO_REPLACE2);
  const newSanjusangendoMemo = sanjusangendo.memo!.replace(SANJUSANGENDO_FIND, SANJUSANGENDO_REPLACE);
  const newRokuharamitsujiMemo = rokuharamitsuji.memo!.replace(ROKUHARAMITSUJI_FIND, ROKUHARAMITSUJI_REPLACE);
  const newKenninjiMemo = kenninji.memo!.replace(KENNINJI_FIND, KENNINJI_REPLACE);
  const newPontochoMemo = pontocho.memo!.replace(PONTOCHO_FIND, PONTOCHO_REPLACE);
  const newHeianjinguMemo = heianjingu.memo!.replace(HEIANJINGU_FIND, HEIANJINGU_REPLACE);
  const newNijojoMemo = nijojo.memo!.replace(NIJOJO_FIND, NIJOJO_REPLACE1).replace(NIJOJO_FIND2, NIJOJO_REPLACE2);
  const newNishikiMemo = nishiki.memo!.replace(NISHIKI_FIND, NISHIKI_REPLACE);
  const newGoshoMemo = gosho.memo!.replace(GOSHO_FIND1, GOSHO_REPLACE1).replace(GOSHO_FIND2, GOSHO_REPLACE2);

  const GATEWAY_STATION_ARRIVAL_MIN = 10 * 60 + 30; // JR京都駅10:30ごろ着
  console.log(
    `[確かめ] 入口の到着時刻 ${Math.floor(GATEWAY_STATION_ARRIVAL_MIN / 60)}:${String(GATEWAY_STATION_ARRIVAL_MIN % 60).padStart(2, "0")} は10:30以降か → ${GATEWAY_STATION_ARRIVAL_MIN >= 10 * 60 + 30 ? "OK" : "NG"}`
  );
  console.log("=== #82 Day1: 初日の開始を10:53に、ねねの道を外す ===\n");
  console.log(
    "祇園花見小路10:53(44)→八坂神社11:42(28)→知恩院12:17(44、昼食)→青蓮院13:10(36)→円山公園13:55(44)→高台寺14:44(48)→三年坂15:39(36)→法観寺16:17(20)→八坂庚申堂16:42(16、〜16:58)"
  );
  console.log("\n=== #82 Day2: 祇園白川→鴨川の移動の直し、昼食追加 ===\n");
  console.log("祇園白川(無変更)→鴨川(leg5→11分、+6分ずれ)→先斗町(+6分、〜16:41)、六波羅蜜寺に昼食追加");
  console.log("\n=== #82 Day3: 新京極・京都文化博物館を外し、並びを変える ===\n");
  console.log("[新京極商店街][京都文化博物館] 削除");
  console.log(
    "京都御所09:00(55)→平安神宮10:07(65)→河原町商店街11:30(40)→錦市場12:17(63、昼食)→二条城13:40(80、〜15:00)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  // Day1
  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: GION_ID, data: { visitTime: T(10, 53), stayDurationMin: 44, memo: newGionMemo, ...COORDS.GION } },
      { id: YASAKA_ID, data: { visitTime: T(11, 42), stayDurationMin: 28, memo: newYasakaMemo, ...COORDS.YASAKA } },
      { id: CHIONIN_ID, data: { visitTime: T(12, 17), stayDurationMin: 44, memo: newChioninMemo } },
      {
        id: SHORENIN_ID,
        data: {
          visitTime: T(13, 10),
          stayDurationMin: 36,
          memo: newShoreninMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      { id: MARUYAMA_ID, data: { visitTime: T(13, 55), stayDurationMin: 44, ...COORDS.MARUYAMA } },
      { id: KODAIJI_ID, data: { visitTime: T(14, 44), stayDurationMin: 48, memo: newKodaijiMemo } },
      {
        id: SANNENZAKA_ID,
        data: {
          visitTime: T(15, 39),
          stayDurationMin: 36,
          memo: newSannenzakaMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      { id: HOKANJI_ID, data: { visitTime: T(16, 17), stayDurationMin: 20, memo: newHokanjiMemo, ...COORDS.HOKANJI } },
      { id: KOSHINDO_ID, data: { visitTime: T(16, 42), stayDurationMin: 16, memo: newKoshindoMemo, ...COORDS.KOSHINDO } },
    ],
    { remove: [NENENOMICHI_ID] }
  );

  // Day2
  await prisma.spot.update({ where: { id: KIYOMIZU_ID }, data: { ...COORDS.KIYOMIZU } });
  await prisma.spot.update({ where: { id: HAKUBUTSUKAN2_ID }, data: { ...COORDS.HAKUBUTSUKAN2 } });
  await prisma.spot.update({
    where: { id: SANJUSANGENDO_ID },
    data: { memo: newSanjusangendoMemo, ...COORDS.SANJUSANGENDO },
  });
  await prisma.spot.update({
    where: { id: ROKUHARAMITSUJI_ID },
    data: { memo: newRokuharamitsujiMemo, ...COORDS.ROKUHARAMITSUJI },
  });
  await prisma.spot.update({ where: { id: KENNINJI_ID }, data: { memo: newKenninjiMemo, ...COORDS.KENNINJI } });
  await prisma.spot.update({
    where: { id: KAMOGAWA_ID },
    data: {
      visitTime: T(15, 11),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
      ...COORDS.KAMOGAWA,
    },
  });
  await prisma.spot.update({
    where: { id: PONTOCHO_ID },
    data: { visitTime: T(16, 1), memo: newPontochoMemo, ...COORDS.PONTOCHO },
  });

  // Day3
  await setDaySpotOrder(
    DAY3_ID,
    [
      { id: GOSHO_ID, data: { visitTime: T(9, 0), stayDurationMin: 55, memo: newGoshoMemo, ...COORDS.GOSHO } },
      { id: HEIANJINGU_ID, data: { visitTime: T(10, 7), stayDurationMin: 65, memo: newHeianjinguMemo } },
      {
        id: KAWARAMACHI_ID,
        data: {
          visitTime: T(11, 30),
          stayDurationMin: 40,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 18 }] },
          ...COORDS.KAWARAMACHI,
        },
      },
      {
        id: NISHIKI_ID,
        data: {
          visitTime: T(12, 17),
          stayDurationMin: 63,
          memo: newNishikiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
          ...COORDS.NISHIKI,
        },
      },
      {
        id: NIJOJO_ID,
        data: {
          visitTime: T(13, 40),
          stayDurationMin: 80,
          memo: newNijojoMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "train", transitDurationMin: 20 }] },
        },
      },
    ],
    { remove: [SHINKYOGOKU_ID, BUNKAHAKUBUTSUKAN_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

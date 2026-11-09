/**
 * 秋田市民市場と川反(c77a7701)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の c77a7701 の欄。設計の表は企画運営・法務とも OK(11/04 21時台)。
 * - 秋田市民市場は6章で行き先から外す(建物の中に店が集まった市場。秋田まるごと市場と同じ扱い、企画運営・法務)
 * - 市場を外すと b2fee0b1 とほぼ同じ行き先になるため、主題を「古代の秋田城跡と土崎の港町」に替える(企画運営の案A)。
 *   川反・赤れんが郷土館・ねぶり流し館・県立美術館・文化創造館も外し、b2fee0b1 と重なるのは千秋公園だけにする
 * - 天徳寺は、境内を見学できるという公式の出典が見つからないため入れない(企画運営・法務)
 * - レンタカーの日帰り(JR秋田駅の近くの店は 8:00 から。店の名前は書かない)
 * - 点: 秋田城跡歴史資料館と政庁跡 → 案内板「史跡秋田城跡案内図」node12079801587(法務)、外郭東門 → historic=memorial node12081888878、
 *   古四王神社 → place_of_worship way451081566、昼食 → 道の駅の highway=services way433848962 の中心(企画運営)、
 *   セリオンの展望室 → tourism=viewpoint node12875184203(法務)、土崎みなと歴史伝承館 → tourism=museum way766598484、
 *   千秋公園 → 中土橋側の案内板「千秋公園の由来」node12103449876(企画運営の決定)
 * - 区間(routing.openstreetmap.de): 店→資料館 車 10.0→15、資料館→東門 車 1.0→6、東門→古四王 車 1.5→7、古四王→昼食 車 5.3→11、
 *   昼食→セリオン 歩 3.6→4、セリオン→伝承館 車 2.0→7、伝承館→千秋公園 車 9.7→15、千秋公園→秋田駅 車 2.0→7(帰りの一文)
 * - 時刻: 9:30〜16:30。千秋公園は100分ちょうど(上限)
 * - 秋田市民市場の写真と表紙を外し、表紙を外郭東門の写真(Commons、CC BY-SA 4.0)に替える。千秋公園の写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-akita-c77a7701.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const commit = process.argv.includes("--commit");
const ITIN_ID = "c77a7701-a11c-42e5-bc23-b018c6a27cd2";
const DAY_ID = "0b904495-9f10-4ba6-aaca-b124c6a73505";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
const L = (mode: Mode, min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });
const C = (mode: Mode, min: number) => ({ create: [{ orderNo: 1, transitMode: mode, transitDurationMin: min }] });

const ICHIBA = "88c51bc1-3b76-4162-9ab6-dbaf920186bf"; // 外す(写真 eda7917c も一緒に消える)
const KAWABATA = "5c856c8d-2485-4f6d-8756-6d0eb5d74136"; // 外す
const AKARENGA = "29ad839a-2ed2-48f5-8be4-db1fe16b260a"; // 外す
const NEBURI = "d924cf52-2ab0-4357-a99f-645f6e458f23"; // 外す
const BIJUTSU = "29d97b2f-021b-444a-96fe-371656c855d5"; // 外す
const SOZO = "e515e290-5e10-4c56-9bc3-6b06c724f45a"; // 外す
const SENSHU = "9e6c7b8d-777f-43d8-b2d7-9cbfe62663e9";
const REMOVE = [ICHIBA, KAWABATA, AKARENGA, NEBURI, BIJUTSU, SOZO];

const EXPECT: Record<string, string> = {
  [ICHIBA]: "秋田市民市場", [KAWABATA]: "川反", [AKARENGA]: "赤れんが郷土館", [NEBURI]: "秋田市民俗芸能伝承館(ねぶり流し館)",
  [BIJUTSU]: "秋田県立美術館", [SOZO]: "秋田市文化創造館", [SENSHU]: "千秋公園",
};
const ICHIBA_PHOTO = "eda7917c-4ab9-49d8-9ef2-23bbf8904ff2";
const SENSHU_PHOTO = "ed407946-b805-4f46-96ba-0a2e3f1c7064";

const TITLE_OLD = "秋田市民市場と川反、あきた食文化を満喫するグルメプラン";
const TITLE_NEW = "古代の秋田城跡と土崎の港町、千秋公園をめぐる日帰りプラン";
const DESC_OLD =
  "きりたんぽや稲庭うどんなど地元食材が並ぶ秋田市民市場と、郷土料理店が軒を連ねる川反エリア。歴史散策とは違う、秋田の「食」を楽しむプランです。";
const DESC_NEW =
  "奈良時代に置かれた秋田城の跡と古四王神社から、曳山と港の歴史を伝える土崎、日本海を望むタワーの展望室、久保田城跡の千秋公園まで、レンタカーでめぐる日帰りプランです。";
const THUMB_OLD =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/commons-replacement/akita-shimin-ichiba-2-txBggOzSmpsL7jUWtQ1IoUoMQa0glx.jpg";
const COVER_FILE = "East gate of Akita Castle 20220409.jpg";
const COVER_SPOT = "秋田城跡の外郭東門と鵜ノ木地区";
const BLOB_PREFIX = "rework-20261104-c77a7701";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  shiryokan:
    "JR秋田駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ15分、秋田城跡歴史資料館に着きます。秋田城は、奈良時代から平安時代にかけて出羽国に置かれた大きな地方官庁で、天平5年(733)に高清水岡へ移された「出羽柵」が、のちに秋田城と呼ばれるようになりました。市の案内では、東北各地に造られた古代の城柵の中で、最も北にあるものとされています。資料館では、発掘調査で見つかった出土品を展示しています。資料館から歩いておよそ3分の政庁跡には、秋田城ができたころの政庁が復元されていて、晴れた日には正殿の真南に鳥海山が見えることがあります。年末年始は休館です。この後は、車でおよそ6分、外郭東門と鵜ノ木地区へ向かいましょう。",
  tomon:
    "秋田城跡歴史資料館から車でおよそ6分、外郭東門に着きます。秋田城の外側の区画を囲んだ外郭の東の門で、奈良時代の創建期の姿をもとに立体的に復元され、平成9年度に完成しました。門の左右に続く築地塀も、創建期の姿で復元されています。東門を抜けると、古代沼が広がる鵜ノ木地区に出ます。ここには秋田城に付属したお寺があったと考えられていて、沼地のそばには、奈良時代の水洗トイレも復元されています。建物の中の公開は休みになることがあるので、公式の案内で確かめましょう。この後は、車でおよそ7分、古四王神社へ向かいましょう。",
  koshio:
    `外郭東門から車でおよそ7分、古四王神社に着きます。建御雷神と大彦命をまつる神社で、かつては、社殿が北向きに建てられていたと伝えられています。近くの秋田城とは、歴史の上で深いつながりがあると言われています。${PRAY}この後は、車でおよそ11分、土崎港のあたりで昼食にしましょう。`,
  lunch:
    "古四王神社から車でおよそ11分、土崎港のあたりで昼食にしましょう。この後は、歩いておよそ4分、ポートタワー・セリオンの展望室へ向かいましょう。",
  selion:
    "昼食の場所から歩いておよそ4分、ポートタワー・セリオンに着きます。平成6年(1994)に開業した全高143mのタワーで、地上100mに展望室があります。秋田の市街や日本海を見渡せ、晴れた日には遠くに鳥海山が見えることもあります。この後は、車でおよそ7分、土崎みなと歴史伝承館へ向かいましょう。",
  denshokan:
    "ポートタワー・セリオンから車でおよそ7分、土崎みなと歴史伝承館に着きます。港町・土崎の歴史を伝える市の施設で、ユネスコの無形文化遺産に登録された「土崎神明社祭の曳山行事」を、高さ11.5mの曳山の展示や映像で紹介しています。北前船の10分の1の模型なども並びます。土崎空襲を伝える展示室には、空襲を受けた旧日本石油秋田製油所の倉庫の一部が移されています。静かに、敬意をもって見学しましょう。火曜日(休日の場合は翌日)と年末年始は休館です。この後は、車でおよそ15分、千秋公園へ向かいましょう。",
  senshu:
    "土崎みなと歴史伝承館から車でおよそ15分、千秋公園の入口に着きます。慶長8年(1603)に初代秋田藩主の佐竹義宣が築き、佐竹氏が12代にわたって居城とした久保田城の跡に整えられた公園です。自然の台地を利用した久保田城は、石垣や天守閣を持たない平山城であったとされています。お堀や本丸跡をめぐりながら、ゆっくり歩きましょう。帰りは、JR秋田駅まで車でおよそ7分。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "秋田城跡歴史資料館と政庁跡(新規。点は案内板「史跡秋田城跡案内図」node12079801587、始まり 9:30、入口の一文)",
    item: { create: { name: "秋田城跡歴史資料館と政庁跡", address: "秋田市寺内焼山9-6", lat: "39.740066", lng: "140.078532", visitTime: T(9, 30), stayDurationMin: 75, memo: M.shiryokan } },
  },
  {
    label: "秋田城跡の外郭東門と鵜ノ木地区(新規。点は historic=memorial node12081888878、写真と表紙)",
    item: { create: { name: COVER_SPOT, address: "秋田市寺内", lat: "39.740037", lng: "140.082795", visitTime: T(10, 51), stayDurationMin: 35, memo: M.tomon, transitLegs: C("car", 6) } },
  },
  {
    label: "古四王神社(新規。点は place_of_worship way451081566)",
    item: { create: { name: "古四王神社", address: "秋田市寺内児桜", lat: "39.736307", lng: "140.08319", visitTime: T(11, 33), stayDurationMin: 25, memo: M.koshio, transitLegs: C("car", 7) } },
  },
  {
    label: "土崎港のあたりで昼食(新規。点は道の駅の highway=services way433848962 の中心、店でない)",
    item: { create: { name: "土崎港のあたりで昼食", address: "秋田市土崎港西", lat: "39.752339", lng: "140.061656", visitTime: T(12, 9), stayDurationMin: 40, memo: M.lunch, transitLegs: C("car", 11) } },
  },
  {
    label: "ポートタワー・セリオンの展望室(新規。点は tourism=viewpoint node12875184203)",
    item: { create: { name: "ポートタワー・セリオンの展望室", address: "秋田市土崎港西", lat: "39.752848", lng: "140.061396", visitTime: T(12, 53), stayDurationMin: 35, memo: M.selion, transitLegs: C("walk", 4) } },
  },
  {
    label: "土崎みなと歴史伝承館(新規。点は tourism=museum way766598484)",
    item: { create: { name: "土崎みなと歴史伝承館", address: "秋田市土崎港西三丁目10-27", lat: "39.75624", lng: "140.066966", visitTime: T(13, 35), stayDurationMin: 60, memo: M.denshokan, transitLegs: C("car", 7) } },
  },
  {
    label: "千秋公園(既存。点は案内板「千秋公園の由来」node12103449876、帰りの一文)",
    item: { id: SENSHU, data: { lat: "39.720215", lng: "140.122813", visitTime: T(14, 50), stayDurationMin: 100, memo: M.senshu, transitLegs: L("car", 15) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (it?.thumbnailUrl !== THUMB_OLD) throw new Error(`表紙が想定と違います: ${it?.thumbnailUrl}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  const photoIds = photos.map((p) => p.id).sort();
  if (JSON.stringify(photoIds) !== JSON.stringify([ICHIBA_PHOTO, SENSHU_PHOTO].sort())) throw new Error(`写真が想定と違います: ${photoIds.join(",")}`);

  const cover = await fetchCommonsImageInfo(COVER_FILE);
  if (!cover) throw new Error("表紙の写真の情報が取れません(ライセンスを確かめる)");

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n`);
  console.log(`表紙: ${THUMB_OLD}\n→ Commons「${COVER_FILE}」(${cover.credit.author}、${cover.credit.license}、${cover.credit.licenseUrl}、${cover.credit.sourceUrl})を「${COVER_SPOT}」の写真として登録し、表紙にする\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})${id === ICHIBA ? `。写真 ${ICHIBA_PHOTO} も消える` : ""}`);
  console.log(`  千秋公園の写真 ${SENSHU_PHOTO} はそのまま`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:09(13:30より前)/ 終わり 千秋公園 16:30(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  const up = await uploadCommonsFile(COVER_FILE, COVER_SPOT, BLOB_PREFIX);
  if (!up) throw new Error("表紙の写真を保存できませんでした");
  const items = SPOTS.map((r) => {
    if ("create" in r.item && r.item.create.name === COVER_SPOT) {
      return { create: { ...r.item.create, photos: { create: [{ url: up.url, caption: "秋田城跡の外郭東門", ...up.credit }] } } } as SpotOrderItem;
    }
    return r.item;
  });
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, thumbnailUrl: up.url } });
      await setDaySpotOrder(DAY_ID, items, { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log(`書き込みました。表紙: ${up.url}`);
}
main().finally(() => prisma.$disconnect());

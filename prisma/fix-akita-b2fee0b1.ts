/**
 * 秋田市民俗芸能伝承館でねぶり流し体験(b2fee0b1)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の b2fee0b1 の欄。設計の表は企画運営・法務とも OK(11/04 21時台)。
 * - 秋田まるごと市場は6章で行き先から外す(店の集まった商業施設)
 * - 行き先が f62dcf1c とほぼ同じだったため、主題を「竿燈と秋田の暮らし・民家」に替える(企画運営の案A)。
 *   千秋公園・県立美術館・赤れんが郷土館も外し、ほかのしおりと重なるのはねぶり流し館・旧金子家住宅の2か所だけにする
 * - 旧奈良家住宅→追分駅の歩きが 29.3分になるため、レンタカーにする(企画運営、案A-2)。市内は民俗芸能伝承館の駐車場(普通車7台、市の公式)に停める
 * - 県立博物館・旧奈良家住宅は冬は 16:00 に閉まるので朝に回す。旧松倉家住宅(県の有形文化財の町家)を足す。文化創造館は建物の話で見られる長さにする
 * - 点: 秋田県立博物館 → museum way245392656、旧奈良家住宅 → museum way554913754、旧松倉家住宅 → way780144381、
 *   昼食 → バス停「通町」node5526437620(店でない)、民俗芸能伝承館 → museum way463211300(今の点から約420m 直す)、
 *   旧金子家住宅 → way463216615(今のまま)、文化創造館 → community_centre way461526244
 * - 区間(routing.openstreetmap.de): 店→博物館 車 18.0→23、博物館→奈良家 車 1.6→7、奈良家→松倉家 車 17.6→23、
 *   松倉家→駐車場 車 4.3→10 ＋ 歩 1.3→2、昼食→伝承館 歩 1.3→2、伝承館→金子家 歩 0.2→1、金子家→創造館 歩 8.6→9、
 *   帰り 創造館→駐車場 歩 8.4→9 ＋ 車 2.9→8
 * - 時刻: 9:30〜16:30
 * - 千秋公園・赤れんが郷土館の写真は行き先と一緒に消える。表紙(赤れんが郷土館の写真)も消えるので、
 *   旧松倉家住宅の写真(Commons、掬茶、CC BY-SA 4.0)を登録して表紙にする(旧奈良家住宅の写真は Commons に見つからなかった)
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-akita-b2fee0b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const commit = process.argv.includes("--commit");
const ITIN_ID = "b2fee0b1-f957-4d81-9338-a35ef506b5e6";
const DAY_ID = "878b6c6c-7d71-4151-a303-edb9ce56d8bd";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Mode = "walk" | "car";
type Leg = [Mode, number];
const L = (...legs: Leg[]) => ({ deleteMany: {}, create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });
const C = (...legs: Leg[]) => ({ create: legs.map(([m, n], i) => ({ orderNo: i + 1, transitMode: m, transitDurationMin: n })) });

const DENSHO = "65523682-1bc5-4218-b924-a0114505b76d";
const SENSHU = "ca8d63be-6d4a-4a16-8dd5-224708d6d4c4"; // 外す(写真 6865772e も消える)
const BIJUTSU = "319da2bd-6f86-45d4-872f-c6ed0aef39d7"; // 外す
const AKARENGA = "10bd2f24-bc87-4d8b-9ac5-d960424f92e8"; // 外す(写真 c7f07a92 も消える)
const KANEKO = "17b7a70c-5d91-48f8-96f5-b3a58680c45b";
const MARUGOTO = "1aaa04e6-7a3b-4cac-a8b8-514653cd0ba3"; // 外す
const REMOVE = [SENSHU, BIJUTSU, AKARENGA, MARUGOTO];

const EXPECT: Record<string, string> = {
  [DENSHO]: "秋田市民俗芸能伝承館", [SENSHU]: "千秋公園", [BIJUTSU]: "秋田県立美術館",
  [AKARENGA]: "秋田市立赤れんが郷土館", [KANEKO]: "旧金子家住宅", [MARUGOTO]: "秋田まるごと市場",
};
const PHOTOS_EXPECT = ["6865772e-30e4-4db5-ab75-63795a6c2b79", "c7f07a92-9852-48e9-bc8e-498dd51c47c3"].sort();

const TITLE_OLD = "秋田市民俗芸能伝承館でねぶり流し体験、伝統文化を学ぶプラン";
const TITLE_NEW = "ねぶり流し館と旧奈良家住宅、竿燈と秋田の暮らしをたどる日帰りプラン";
const DESC_OLD = "「ねぶり流し館」の愛称で親しまれる、竿燈まつりの用具を展示する伝承館。秋田の伝統芸能と祭り文化にふれるプランです。";
const DESC_NEW =
  "秋田県立博物館と豪農の家・旧奈良家住宅から、町家の旧松倉家住宅、竿燈を伝えるねぶり流し館と商家の旧金子家住宅、旧県立美術館の建物を生かした文化創造館まで、秋田の暮らしと祭りの文化をレンタカーでめぐる日帰りプランです。";
const COVER_FILE = "Former Matsukura's House (Akita).jpg";
const COVER_SPOT = "旧松倉家住宅";
const BLOB_PREFIX = "rework-20261104-b2fee0b1";

const M = {
  museum:
    "JR秋田駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ23分、秋田県立博物館に着きます。人文展示室と自然展示室のほか、菅江真澄資料センターがある博物館です。開館は4月から10月が9:30〜16:30、11月から3月が9:30〜16:00で、月曜日(休日の場合はその次の平日)と年末年始は休館です。この後は、車でおよそ7分、分館の旧奈良家住宅へ向かいましょう。",
  nara:
    "秋田県立博物館から車でおよそ7分、分館の旧奈良家住宅に着きます。豪農として栄えた奈良家の住まいで、江戸時代中期の宝暦年間(1751〜1763)に建てられたとされています。建物の両端の入口が前に突き出す「両中門造り」は、秋田県中央海岸部の農家に特徴的な建て方とされ、昭和40年(1965)に国の重要文化財に指定されました。土間の中央には、八角形の大黒柱と、ニワイロリと呼ばれる大きな囲炉裏があります。休館日は本館と同じです。この後は、車でおよそ23分、旧松倉家住宅へ向かいましょう。",
  matsukura:
    "旧奈良家住宅から車でおよそ23分、旧松倉家住宅に着きます。江戸時代に交通や流通の要だった羽州街道と酒田街道(羽州浜街道)の合流地点にある町家です。江戸時代後期以降の秋田の町家の形を今に伝え、明治期の町家として最も完成されたものとされ、秋田県の有形文化財に指定されています。利用時間は9:00〜16:30で、火曜日(休日の場合は翌日)と年末年始は休館です。この後は、車でおよそ10分、駐車場から歩いておよそ2分、大町のあたりで昼食にしましょう。",
  lunch:
    "旧松倉家住宅から車でおよそ10分、駐車場から歩いておよそ2分、大町のあたりで昼食にしましょう。この後は、歩いておよそ2分、秋田市民俗芸能伝承館へ向かいましょう。",
  densho:
    "昼食の場所から歩いておよそ2分、秋田市民俗芸能伝承館に着きます。竿燈をはじめとする郷土の民俗行事や芸能を伝えるため、平成4年(1992)に開館した施設で、「ねぶり流し館」の愛称で親しまれています。竿燈は、夏の睡魔を払い流す「眠り流し」の行事に、七夕やお盆の風習、豊作祈願が結びついたもので、江戸時代中期に始まったとされています。竿燈まつりは毎年8月3日から6日に行われますが、1階の展示ホールでは、竿燈や土崎神明社祭の曳山行事のパネル・梵天などをいつも展示していて、竿燈の演技を体験できるコーナーもあります。2階と3階では、秋田の民俗芸能を資料や映像で紹介しています。休館日は年末年始です。この後は、歩いておよそ1分、となりの旧金子家住宅へ向かいましょう。",
  kaneko:
    "伝承館から歩いておよそ1分、旧金子家住宅に着きます。入館は、となりの民俗芸能伝承館からです。金子家は、江戸時代後期に質屋・古着商を営み、明治初期に呉服や太物(綿織物・麻織物)などの卸商を始め、昭和50年までこの店で商いを続けました。建物は江戸時代後期の町家の特徴を残す主屋と土蔵からなり、明治19年の俵屋火事で主屋は焼けましたが、土蔵は焼け残りました。主屋は明治20年ごろに建て直されています。平成9年(1997)に秋田市の有形文化財に指定されました。この後は、歩いておよそ9分、秋田市文化創造館へ向かいましょう。",
  souzou:
    "旧金子家住宅から歩いておよそ9分、秋田市文化創造館に着きます。1967年に秋田県立美術館として建てられた建物を生かした施設です。独特な形の屋根と円い窓は、藤田嗣治の大壁画「秋田の行事」を展示するため、藤田の助言によって大空間に光が降り注ぐよう設計されたものです。開館は9:00〜21:00で、火曜日(休日の場合は翌平日)と年末年始は休館です。帰りは、駐車場まで歩いておよそ9分、そこから車でおよそ8分。JR秋田駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "秋田県立博物館(新規。点 museum way245392656、始まり 9:30、入口の一文)",
    item: { create: { name: "秋田県立博物館", address: "秋田市金足鳰崎字後山52", lat: "39.817337", lng: "140.065915", visitTime: T(9, 30), stayDurationMin: 100, memo: M.museum } },
  },
  {
    label: "旧奈良家住宅(新規。点 museum way554913754、車7)",
    item: { create: { name: "旧奈良家住宅", address: "秋田市金足小泉字上前8", lat: "39.823217", lng: "140.065234", visitTime: T(11, 17), stayDurationMin: 50, memo: M.nara, transitLegs: C(["car", 7]) } },
  },
  {
    label: "旧松倉家住宅(新規。点 way780144381、車23、写真と表紙)",
    item: { create: { name: COVER_SPOT, address: "秋田市旭南二丁目7-29", lat: "39.708339", lng: "140.111211", visitTime: T(12, 30), stayDurationMin: 40, memo: M.matsukura, transitLegs: C(["car", 23]) } },
  },
  {
    label: "大町のあたりで昼食(新規。点 バス停「通町」node5526437620、店でない。車10＋歩き2)",
    item: { create: { name: "大町のあたりで昼食", address: "秋田市大町", lat: "39.720466", lng: "140.118112", visitTime: T(13, 22), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["car", 10], ["walk", 2]) } },
  },
  {
    label: "秋田市民俗芸能伝承館(既存。点 museum way463211300 に直す、歩き2)",
    item: { id: DENSHO, data: { lat: "39.720361", lng: "140.116972", visitTime: T(14, 4), stayDurationMin: 60, memo: M.densho, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] } } },
  },
  {
    label: "旧金子家住宅(既存。点 way463216615 のまま、歩き1)",
    item: { id: KANEKO, data: { lat: "39.720233", lng: "140.116984", visitTime: T(15, 5), stayDurationMin: 35, memo: M.kaneko, transitLegs: L(["walk", 1]) } },
  },
  {
    label: "秋田市文化創造館(新規。点 community_centre way461526244、歩き9、帰りの一文)",
    item: { create: { name: "秋田市文化創造館", address: "秋田市千秋明徳町3-16", lat: "39.719265", lng: "140.122812", visitTime: T(15, 49), stayDurationMin: 41, memo: M.souzou, transitLegs: C(["walk", 9]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  const densholegs = await prisma.spotTransitLeg.count({ where: { spotId: DENSHO } });
  if (densholegs > 0) throw new Error(`伝承館(今は最初)に区間が残っています: ${densholegs}`);
  const cover = await fetchCommonsImageInfo(COVER_FILE);
  if (!cover) throw new Error("表紙の写真の情報が取れません(ライセンスを確かめる)");

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n`);
  console.log(`表紙: 赤れんが郷土館の写真(行き先と一緒に消える)\n→ Commons「${COVER_FILE}」(${cover.credit.author}、${cover.credit.license}、${cover.credit.licenseUrl}、${cover.credit.sourceUrl})を「${COVER_SPOT}」の写真として登録し、表紙にする\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})${id === SENSHU ? "。写真 6865772e も消える" : id === AKARENGA ? "。写真 c7f07a92 も消える" : ""}`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:22(13:30より前)/ 終わり 文化創造館 16:30(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  const up = await uploadCommonsFile(COVER_FILE, COVER_SPOT, BLOB_PREFIX);
  if (!up) throw new Error("表紙の写真を保存できませんでした");
  const items = SPOTS.map((r) => {
    if ("create" in r.item && r.item.create.name === COVER_SPOT) {
      return { create: { ...r.item.create, photos: { create: [{ url: up.url, caption: "旧松倉家住宅", ...up.credit }] } } } as SpotOrderItem;
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

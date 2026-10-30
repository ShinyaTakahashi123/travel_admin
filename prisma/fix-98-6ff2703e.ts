/**
 * #98 空の展望台と下町情緒。天王寺・あべのぶらり旅 の初日・最終日の見直し。
 *
 * 初日: 天王寺動物園が09:30と早すぎたので、入口(JR/地下鉄 天王寺駅、徒歩実測9分、
 * routed-foot)から組み直し、10:45開始・16:50終了に(10:45〜11:45・16:30〜17:00の範囲)。
 * 歩きの区間は routing.openstreetmap.de/routed-foot の道のり(m)÷75m/分で測り直した。
 * 滞在はすべてもとの長さ以下(延ばしなし)。
 *
 * 2日目(1泊2日の最終日): 歩き・阪堺電車を測り直すと軒並み短くなり(駅すぱあとの時刻表・
 * routed-footで実測)、滞在を変えずに計算すると終了16:18でfloor(16:30)より12分早く
 * なってしまう。1か所目(09:30)はfloorの上限で、滞在もどこも延ばしていないため、
 * 決まり(移動の書き方371)の順番で①②は使えず、③実在の行き先を足すことにした
 * (企画運営・法務の判断、2026-10-30)。堀越神社とてんしばの間に「茶臼山」(天王寺公園内、
 * 大坂の陣の舞台、OSM node517409158 natural=peak)を9分の滞在で足す。これにより
 * 終了は16:32(見直す前と同じ)に収まる。
 * 事実の出典: 大阪府公式ページのみ(家康の本陣・1986年発掘調査・古墳説への疑問、
 * https://www.pref.osaka.lg.jp/o180150/bunkazaihogo/bunkazai/tennoujikouen.html)。
 * 真田信繁の本陣は、不動産会社サイトのみの出典だったため書かない(企画運営の指摘)。
 * 古墳とも伝えられる場所のため、お墓の一文「〇〇のまわりでは、静かに過ごしましょう。」
 * を入れた。
 *
 * 座標の訂正(法務の指摘、2026-10-30 13:19): 四天王寺は、一度node4451791508(境内地図の
 * 案内板の点)に直したが、これは施設の点でなく使えないと指摘を受け、もとの値
 * 34.654719,135.516798(OSM way579077537と一致)に戻した。てんしばは、公園全体の
 * 中心(way579430110)でなく、メモにある「入り口」に当たる名前つきの点
 * 「てんしばゲート」(node2289173516、barrier=gate)34.648972,135.509706に直した。
 * これにより四天王寺の前後・てんしばの前後の分数を測り直した(偶然、四天王寺の前後は
 * もとの値と同じ9分、てんしばの前後の一方も同じ10分になった)。阿倍王子神社の座標
 * (34.630954,135.509179、OSM way1137827944と一致)は変更していない(法務への前回報告で
 * wayの番号を安倍晴明神社のものと誤記していたための確認依頼だった)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-98-6ff2703e.ts
 *   反映: npm run prod -- npx tsx prisma/fix-98-6ff2703e.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ZOO_ID = "f005bd11-2695-4e84-b367-03fd31b8c393";
const SHINSEKAI_ID = "cb20c4f9-d498-4f6e-b37d-a451bf420e25";
const BIJUTSUKAN_ID = "33a8dab7-d1f5-4b78-8241-5b701bdf62ba";
const ISSHINJI_ID = "05f526b8-d384-412f-82fa-466111f8d2ee";
const ANGOJINJA_ID = "e60e4036-1030-474a-8102-b3b2ba44dc85";
const KIYOMIZUDERA_ID = "410c733f-3c7a-40ca-9061-d8a3640bd1f8";
const AIZENDO_ID = "79498ea4-32a3-4d7b-9d60-bdcefb353382";
const OEJINJA_ID = "c1cffa2d-31d8-411c-abd7-994aa67a6a9e";
const KUCHINAWAZAKA_ID = "160c2576-5432-4389-9262-c32b05fad4e3";

const DAY2_ID = "9ba78754-874a-4ad5-84b0-335291a2e111";
const SHITENNOJI_ID = "4cf66542-88f2-409a-bbb0-2b775e9429e7";
const HORIKOSHIJINJA_ID = "1922b418-505c-44f3-bc0d-a0465eea2652";
const TENSHIBA_ID = "6e3e9a37-5453-4e25-bd74-6c75a041761e";
const HARUKAS_ID = "c0fcd229-44e5-4507-8486-7d60cc82f517";
const SUMIYOSHITAISHA_ID = "f0c57e73-4e69-4026-b240-54ae0a425d22";
const ABEOUJIJINJA_ID = "d882c9d7-4650-4fae-b0d8-ea8c44f3a221";
const ABENOSEIMEIJINJA_ID = "96ac4437-8ead-4d46-a02c-bd2b6a3575e6";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const VISIT_TIMES: { id: string; h: number; m: number }[] = [
  { id: ZOO_ID, h: 10, m: 45 },
  { id: SHINSEKAI_ID, h: 12, m: 23 },
  { id: BIJUTSUKAN_ID, h: 13, m: 16 },
  { id: ISSHINJI_ID, h: 14, m: 8 },
  { id: ANGOJINJA_ID, h: 14, m: 39 },
  { id: KIYOMIZUDERA_ID, h: 14, m: 59 },
  { id: AIZENDO_ID, h: 15, m: 33 },
  { id: OEJINJA_ID, h: 16, m: 6 },
  { id: KUCHINAWAZAKA_ID, h: 16, m: 31 },
  { id: SHITENNOJI_ID, h: 9, m: 30 },
  { id: HORIKOSHIJINJA_ID, h: 11, m: 9 },
  { id: TENSHIBA_ID, h: 11, m: 49 },
  { id: HARUKAS_ID, h: 12, m: 49 },
  { id: SUMIYOSHITAISHA_ID, h: 14, m: 21 },
  { id: ABEOUJIJINJA_ID, h: 15, m: 44 },
  { id: ABENOSEIMEIJINJA_ID, h: 16, m: 12 },
];

const COORD_UPDATES: { id: string; label: string; lat: number; lng: number }[] = [
  { id: KIYOMIZUDERA_ID, label: "清水寺(玉出の滝)", lat: 34.655207, lng: 135.511734 },
  { id: TENSHIBA_ID, label: "てんしば(てんしばゲート)", lat: 34.648972, lng: 135.509706 },
];

const STAY_UPDATES: { id: string; label: string; min: number }[] = [
  { id: ZOO_ID, label: "天王寺動物園", min: 92 },
  { id: SHINSEKAI_ID, label: "新世界", min: 45 },
  { id: BIJUTSUKAN_ID, label: "大阪市立美術館", min: 47 },
  { id: ISSHINJI_ID, label: "一心寺", min: 25 },
  { id: ANGOJINJA_ID, label: "安居神社", min: 17 },
  { id: KIYOMIZUDERA_ID, label: "清水寺(玉出の滝)", min: 27 },
];

const LEG_UPDATES: { spotId: string; label: string; min: number }[] = [
  { spotId: SHINSEKAI_ID, label: "動物園→新世界", min: 6 },
  { spotId: BIJUTSUKAN_ID, label: "新世界→美術館", min: 8 },
  { spotId: ISSHINJI_ID, label: "美術館→一心寺", min: 5 },
  { spotId: ANGOJINJA_ID, label: "一心寺→安居神社", min: 6 },
  { spotId: KIYOMIZUDERA_ID, label: "安居神社→清水寺", min: 3 },
  { spotId: OEJINJA_ID, label: "愛染堂→大江神社", min: 3 },
  { spotId: HORIKOSHIJINJA_ID, label: "四天王寺→堀越神社", min: 9 },
];

const MEMO_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: ZOO_ID,
    label: "天王寺動物園(入口の一文)",
    find: "この旅は電車と路面電車、歩きでめぐります。JRや地下鉄の天王寺駅から歩いて約5分。",
    replace: "この旅は電車と路面電車、歩きでめぐります。JRや地下鉄の天王寺駅に10:35ごろ着いたら、歩いておよそ9分。",
  },
  {
    id: SHINSEKAI_ID,
    label: "新世界(書き出し)",
    find: "動物園の北側から歩いて約10分。",
    replace: "動物園の北側から歩いて約6分。",
  },
  {
    id: BIJUTSUKAN_ID,
    label: "大阪市立美術館(書き出し)",
    find: "新世界から天王寺公園を通って歩いて約15分。",
    replace: "新世界から天王寺公園を通って歩いて約8分。",
  },
  {
    id: ISSHINJI_ID,
    label: "一心寺(書き出し)",
    find: "美術館から北へ歩いて約8分。",
    replace: "美術館から北へ歩いて約5分。",
  },
  {
    id: ANGOJINJA_ID,
    label: "安居神社(書き出し)",
    find: "一心寺から坂を上って約3分。",
    replace: "一心寺から坂を上って約6分。",
  },
  {
    id: KIYOMIZUDERA_ID,
    label: "清水寺(書き出し)",
    find: "安居神社から天王寺七坂の一つ、天神坂を上って約5分。",
    replace: "安居神社から天王寺七坂の一つ、天神坂を上って約3分。",
  },
  {
    id: OEJINJA_ID,
    label: "大江神社(書き出し)",
    find: "愛染堂から愛染坂を上ってすぐ。",
    replace: "愛染堂から愛染坂を上って約3分。",
  },
  {
    id: SHITENNOJI_ID,
    label: "四天王寺(書き出し)",
    find: "地下鉄の四天王寺前夕陽ヶ丘駅から歩いて約5分。",
    replace: "宿のある天王寺のあたりから地下鉄で一駅の四天王寺前夕陽ヶ丘駅へ。駅から歩いて約9分。",
  },
  {
    id: HORIKOSHIJINJA_ID,
    label: "堀越神社(書き出し)",
    find: "四天王寺から南西へ歩いて約15分。",
    replace: "四天王寺から南西へ歩いて約9分。",
  },
  {
    id: TENSHIBA_ID,
    label: "てんしば(書き出し)",
    find: "堀越神社から歩いて約5分。",
    replace: "茶臼山から歩いて約7分。",
  },
  {
    id: SUMIYOSHITAISHA_ID,
    label: "住吉大社(書き出し)",
    find: "ハルカスのそばの天王寺駅前から路面電車の阪堺電車に乗り、約20分の住吉鳥居前で降りてすぐ（あわせて約25分）。",
    replace: "ハルカスのそばの天王寺駅前から路面電車に乗り、約16分の住吉鳥居前で降りて歩いて約4分（あわせて約22分）。",
  },
  {
    id: ABEOUJIJINJA_ID,
    label: "阿倍王子神社(書き出し)",
    find: "住吉鳥居前から阪堺電車で東天下茶屋へ戻り、南東へ歩いて約5分（あわせて約19分）。",
    replace: "住吉鳥居前から路面電車で東天下茶屋へ戻り、南東へ歩いて約4分（あわせて約13分）。",
  },
  {
    id: ABENOSEIMEIJINJA_ID,
    label: "安倍晴明神社(帰りの一文)",
    find: "帰りは、東天下茶屋から阪堺電車で天王寺駅前へ戻りましょう。",
    replace: "見学を終えたら、歩いて約2分の東天下茶屋電停へ。路面電車で約5分の天王寺駅前へ戻りましょう。",
  },
];

const CHAUSUYAMA_MEMO =
  "堀越神社から歩いて約4分、大坂の陣の舞台となった丘に着きます。大坂冬の陣(1614年)では、徳川家康がこの丘に本陣を置きました。全長200mの前方後円墳だったとも伝えられますが、昭和61年(1986)の発掘調査で家康の本陣の建物や堀の跡が見つかり、規模には疑問も持たれています。古墳ともいわれる場所なので、茶臼山のまわりでは、静かに過ごしましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(MEMO_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of MEMO_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of MEMO_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #98 初日・最終日の見直し ===\n");
  console.log("[時刻]");
  for (const v of VISIT_TIMES) {
    console.log(`  ${v.id} => ${String(v.h).padStart(2, "0")}:${String(v.m).padStart(2, "0")}`);
  }
  console.log("\n[滞在(分)]");
  for (const s of STAY_UPDATES) {
    console.log(`  ${s.label}: ${s.min}分`);
  }
  console.log("  茶臼山(新規): 9分");
  console.log("\n[座標]");
  for (const c of COORD_UPDATES) {
    console.log(`  ${c.label}: ${c.lat},${c.lng}`);
  }
  console.log("  茶臼山(新規、node517409158): 34.6518614,135.5114555");
  console.log("\n[移動(分)]");
  for (const l of LEG_UPDATES) {
    console.log(`  ${l.label}: ${l.min}分`);
  }
  console.log("  堀越神社→茶臼山: 4分");
  console.log("  茶臼山→てんしば: 7分(てんしばゲートの新しい点で測り直し)");
  console.log("\n[メモ]");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 70));
    console.log();
  }
  console.log("[茶臼山(新規スポットのメモ)]");
  console.log(CHAUSUYAMA_MEMO);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const v of VISIT_TIMES) {
      await tx.spot.update({ where: { id: v.id }, data: { visitTime: t(v.h, v.m) } });
    }
    for (const s of STAY_UPDATES) {
      await tx.spot.update({ where: { id: s.id }, data: { stayDurationMin: s.min } });
    }
    for (const c of COORD_UPDATES) {
      await tx.spot.update({ where: { id: c.id }, data: { lat: c.lat, lng: c.lng } });
    }
    for (const l of LEG_UPDATES) {
      await tx.spotTransitLeg.updateMany({ where: { spotId: l.spotId }, data: { transitDurationMin: l.min } });
    }
    for (const id of ids) {
      await tx.spot.update({ where: { id }, data: { memo: memoById.get(id)! } });
    }

    // 2日目: 堀越神社とてんしばの間に茶臼山を差し込む
    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: SHITENNOJI_ID, data: {} },
        { id: HORIKOSHIJINJA_ID, data: {} },
        {
          create: {
            name: "茶臼山",
            lat: 34.6518614,
            lng: 135.5114555,
            visitTime: t(11, 33),
            stayDurationMin: 9,
            memo: CHAUSUYAMA_MEMO,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        { id: TENSHIBA_ID, data: { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] } } },
        { id: HARUKAS_ID, data: {} },
        { id: SUMIYOSHITAISHA_ID, data: {} },
        { id: ABEOUJIJINJA_ID, data: {} },
        { id: ABENOSEIMEIJINJA_ID, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

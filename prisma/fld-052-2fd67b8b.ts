/**
 * 初日・最終日の見直し #52 2fd67b8b「グランフロントと中崎町、新旧が交わる梅田さんぽ旅」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a。企画運営 10/30 の判断）
 * 1泊2日・歩き。初日を11時ごろからにし、説明文（1日目＝梅田、2日目＝中央公会堂・天神橋筋）に合わせて並べ直す。歩きはどれも routed-foot の道のり
 * 1日目: 東梅田駅 10:45ごろ → 歩5 → 露天神社 10:50（50→40）→ 歩9 → HEP FIVE観覧車 11:39 → 歩6 → 茶屋町 12:20（58→50、昼食）→ 歩9 → 中崎町 13:19 →
 *   歩20 → グラングリーン大阪 14:19 → 歩7 → 梅田スカイビル 15:07 → 歩36 → 中之島公園 16:24〜16:54（45→30）
 * 2日目: なにわ橋駅から歩6 → 中央公会堂 9:30（1日目から移す）→ 歩3 → 東洋陶磁美術館 10:23（1日目から移す。9:30〜17:00、月曜休館 https://www.moco.or.jp/visit/）→
 *   歩13 → 天神橋筋商店街 11:21（昼食）→ 歩3 → 大阪天満宮 12:22 → 歩17 → 造幣博物館 13:14（9:00〜16:45、水曜休館 https://osaka-info.jp/spot/mint-museum/）→
 *   歩23 → 大阪城天守閣 14:22（75→60）→ 歩14 → 西の丸庭園 15:36（60→30。3〜10月 9:00〜17:00、11〜2月 9:00〜16:30 https://osaka-info.jp/spot/osaka-castle-nishinomaru-garden/）→
 *   歩9 → 豊国神社 16:15〜16:35 → 歩18 で JR大阪城公園駅。終わりはもとの 16:43 より前
 *   扇町公園・大阪歴史博物館は外す（タイトル・説明文にない。扇町公園は点が公園の中心と案内しかない）
 * 点: 露天神社 way 482761129、HEP FIVE観覧車 way 332292139、茶屋町 = 鶴乃茶屋跡 node 7746787706、中崎町 = 中崎町駅（メモを駅のあたりからに、決まり361）、
 *   グラングリーン = 公園の中の彫刻「GRAND GREEN OSAKA」node 12466781968（企画運営 10/30）、中之島公園 = バラ園 way 732596351（法務 10/30）、梅田スカイビル = 空中庭園展望台 node 4325335299、中央公会堂 way 162382613、
 *   天神橋筋商店街 way 436748627（天神橋一丁目）、大阪天満宮 way 363304259、西の丸庭園 = 迎賓館 way 176301507、豊国神社 way 1093296634
 * 説明文: 中之島公園を1日目の夕方に、2日目に大阪城を入れる形に直す（企画運営）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-052-2fd67b8b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2fd67b8b-59c6-4ea4-ab01-b27e2414a53e";
const DAY1_ID = "f79366ce-05ce-407e-afff-a82355a9f79b";
const DAY2_ID = "e063b7c8-86a7-424b-a45a-dfa99436916e";
const TSUYU = "68009067-b5fb-41ce-8715-9bfc826f8625";
const HEP = "247f6838-7638-4526-918a-eeec9e4f8dde";
const CHAYA = "aabce37f-a3d3-421d-8471-f2f63ef766f9";
const NAKA = "5c95e383-768c-42a7-a4e9-d7493e6e033f";
const GG = "cc1174a3-d9ae-4b21-9deb-34e21533d8dd";
const SKY = "64f70a82-d141-4ea0-86d2-df68a065137a";
const NAKANO = "ebe1ee70-ade0-44a8-8995-0cefd5a2625f";
const KOKAI = "45116e76-b3ba-45c3-9a27-2e53fc38b804";
const TOYO = "f291802d-b0cc-445c-bfc1-00139fed9da3";
const OGI = "1e3226ab-406a-4d30-95a2-c00617f44676";
const TENMA = "e4da007f-9d8d-4c1c-9f99-e18b86ff441b";
const TENJIN = "94364d94-f7db-4f6c-a987-6da2a2680980";
const ZOHEI = "3fb12224-d134-4d2e-8383-58b842842281";
const TENSHU = "1607f556-d309-4298-a106-6fdf1edfad5a";
const NISHI = "8df2d766-d513-44e7-a7a4-bc75d0b092ed";
const HOKOKU = "483c710a-8a9f-45ca-b156-ccd945ad8500";
const REKI = "4b6372e3-a4a2-4900-9ac7-6e85ad5fec0c";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "1日目は縁結びの神様・露天神社からHEP FIVEの観覧車、緑あふれるグラングリーン大阪、梅田スカイビルの空中庭園まで。2日目は中之島公園やレトロな中央公会堂、天神橋筋商店街を巡る、梅田の新旧を味わう1泊2日です。";
const DESC_TO = "1日目は縁結びの神様・露天神社からHEP FIVEの観覧車、緑あふれるグラングリーン大阪、梅田スカイビルの空中庭園をめぐり、夕方は中之島公園へ。2日目はレトロな中央公会堂から天神橋筋商店街、大阪城までを巡る、梅田の新旧を味わう1泊2日です。";

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [TSUYU]: { from: [34.7012, 135.4998], to: [34.699127, 135.500839] },
  [HEP]: { from: [34.7028, 135.5011], to: [34.703996, 135.500092] },
  [CHAYA]: { from: [34.7052, 135.5019], to: [34.707063, 135.499471] },
  [GG]: { from: [34.704, 135.495], to: [34.704312, 135.493461] },
  [NAKANO]: { from: [34.6924, 135.507757], to: [34.693353, 135.506187] },
  [SKY]: { from: [34.7053, 135.4906], to: [34.7053, 135.49014] },
  [KOKAI]: { from: [34.6935, 135.5011], to: [34.69354, 135.504009] },
  [TENJIN]: { from: [34.698, 135.515], to: [34.696398, 135.51177] },
  [TENMA]: { from: [34.6961, 135.5128], to: [34.69609, 135.512765] },
  [NISHI]: { from: [34.6857, 135.5242], to: [34.688108, 135.522924] },
  [HOKOKU]: { from: [34.6842, 135.5264], to: [34.684242, 135.526413] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TSUYU]: [
    {
      from: "旅の始まりは、露天神社です。大阪メトロ東梅田駅から徒歩約5分の、梅田・曽根崎の総鎮守",
      to: "大阪メトロの東梅田駅に10時45分ごろ着いたら、歩いておよそ5分、旅の始まりの露天神社に着きます。梅田・曽根崎の総鎮守",
    },
    {
      from: "静かに、敬意をもってお参りください。境内をゆっくりお参りしたら、次はHEP FIVEの観覧車へ向かいましょう。",
      to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ9分、HEP FIVEの観覧車へ向かいましょう。",
    },
  ],
  [HEP]: [
    { from: "続いてやってきたのは、赤い観覧車が目印のショッピングビル、HEP FIVEです。", to: "露天神社から歩いておよそ9分、赤い観覧車が目印のショッピングビル、HEP FIVEに着きます。" },
    { from: "梅田の街並みをゆっくりと見渡すことができますよ。乗る前に立ち寄っていただきたいのが、", to: "梅田の街並みをゆっくりと見渡せます。乗る前に立ち寄りたいのが、" },
    { from: "ひと休みがてら、次は茶屋町の街並みを歩いてみましょう。", to: "この後は、歩いておよそ6分、茶屋町へ向かいましょう。" },
  ],
  [CHAYA]: [
    {
      from: "HEP FIVEから少し歩くと、おしゃれなカフェやセレクトショップが並ぶ茶屋町に入ります。",
      to: "HEP FIVEから歩いておよそ6分、おしゃれなカフェやセレクトショップが並ぶ茶屋町の、鶴乃茶屋跡のあたりに着きます。",
    },
    { from: "今も地名として受け継がれているのですね。", to: "今も地名として受け継がれています。" },
    {
      from: "街を歩きながら、そんな地名の由来に思いを馳せてみるのも面白いですね。散策を終えたら、次は歩いておよそ6分、中崎町へ向かいましょう。",
      to: "通りに並ぶカフェや飲食店で、昼食にしましょう。この後は、歩いておよそ9分、中崎町へ向かいましょう。",
    },
  ],
  [NAKA]: [
    {
      from: "茶屋町から歩いておよそ6分、レトロな街並みが残る中崎町に着きます。",
      to: "茶屋町から歩いておよそ9分、地下鉄の中崎町駅のあたりから、レトロな街並みが残る中崎町の路地に入ります。",
    },
    {
      from: "町並みを、のんびりと歩いてみてください。小腹がすいてきたら、長屋を改装したカフェやレストランで昼食をとるのもおすすめです。この後は、歩いておよそ13分、グラングリーン大阪へ向かいましょう。",
      to: "町並みを、のんびりと歩きましょう。この後は、歩いておよそ18分、グラングリーン大阪へ向かいましょう。",
    },
  ],
  [GG]: [
    { from: "次に訪れるのは、JR大阪駅の北側に広がる、グラングリーン大阪です。", to: "中崎町から歩いておよそ18分、大阪駅の北側、グランフロント大阪と同じ「うめきた」のエリアに広がる、グラングリーン大阪のサウスパークに着きます。" },
    {
      from: "ビル群に囲まれた開放的な空間で一息ついたら、次は梅田スカイビルの空中庭園展望台を目指しましょう。",
      to: "公園の中には「GRAND GREEN OSAKA」の文字のオブジェもあります。ビル群に囲まれた開放的な空間で一息ついたら、この後は、歩いておよそ6分、梅田スカイビルへ向かいましょう。",
    },
  ],
  [SKY]: [
    { from: "グラングリーン大阪から歩いておよそ5分、", to: "グラングリーン大阪から歩いておよそ6分、" },
    { from: "日本からは唯一この梅田スカイビルが選ばれました。", to: "日本からはこの梅田スカイビルが選ばれました。" },
    {
      from: "気になる方はのぞいてみてください。展望を楽しんだら、次は歩いておよそ26分、中之島公園へ向かいましょう。",
      to: "気になったら、のぞいてみましょう。展望を楽しんだら、この後は、歩いておよそ34分、中之島公園へ向かいましょう。",
    },
  ],
  [NAKANO]: [
    { from: "梅田スカイビルから歩いておよそ26分、", to: "梅田スカイビルから歩いておよそ34分、" },
    {
      from: "130年以上にわたる公園の歴史に思いを馳せてみてください。散策を終えたら、次は大阪市中央公会堂へ向かいましょう。",
      to: "130年以上にわたる公園の歴史に思いを馳せましょう。この夜は、中之島や淀屋橋のあたりの宿に泊まりましょう。",
    },
  ],
  [KOKAI]: [
    {
      from: "中之島公園から歩いておよそ9分、川沿いに見えてくるのが、赤レンガと白い石造りのコントラストが目を引く、大阪市中央公会堂です。",
      to: "梅田さんぽ2日目は、京阪中之島線のなにわ橋駅から歩いておよそ6分、赤レンガと白い石造りのコントラストが目を引く、大阪市中央公会堂から始めます。",
    },
    {
      from: "この重厚な建築を眺めながら、しばし歴史に思いを馳せてみてください。この後は、歩いておよそ5分、大阪市立東洋陶磁美術館へ向かいましょう。",
      to: "館内は貸し会場のため、自由に見学できるのは地下1階だけです。この重厚な建築を眺めながら、しばし歴史に思いを馳せましょう。この後は、歩いておよそ3分、大阪市立東洋陶磁美術館へ向かいましょう。",
    },
  ],
  [TOYO]: [
    { from: "大阪市中央公会堂から歩いておよそ5分、", to: "大阪市中央公会堂から歩いておよそ3分、" },
    {
      from: "静けさに包まれた展示室で、東洋陶磁の美をじっくりと味わってみてください。中之島の建築めぐりも、1日目はここで締めくくりです。今夜はこの近くの宿でゆっくり休みましょう。",
      to: "静けさに包まれた展示室で、東洋陶磁の美をじっくりと味わいましょう。この後は、歩いておよそ13分、天神橋筋商店街へ向かいましょう。",
    },
  ],
  [TENJIN]: [
    { from: "大阪天満宮から歩いてすぐ、天神橋一丁目から", to: "大阪市立東洋陶磁美術館から歩いておよそ13分、天神橋一丁目から" },
    {
      from: "ちょうどお昼どきになるころなので、食べ歩きをしながら、あるいは商店街の食堂で昼食をとるのもおすすめです。お土産を探しながら、活気ある商店街の空気を存分に楽しんでください。散策を終えたら、次は歩いておよそ9分、造幣博物館へ向かいましょう。",
      to: "ちょうどお昼どきになるころなので、商店街の食堂などで昼食にしましょう。お土産を探しながら、活気ある商店街の空気を楽しみましょう。この後は、歩いておよそ3分、大阪天満宮へ向かいましょう。",
    },
  ],
  [TENMA]: [
    { from: "扇町公園から歩いておよそ10分、大阪天満宮に着きます。", to: "天神橋筋商店街から歩いておよそ3分、大阪天満宮に着きます。" },
    { from: "すぐそばの天神橋筋商店街は、", to: "さきほど歩いた天神橋筋商店街は、" },
    {
      from: "境内をゆっくりお参りしたら、静かに、敬意をもって過ごしてください。この後は、歩いてすぐ、天神橋筋商店街へ向かいましょう。",
      to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ17分、造幣博物館へ向かいましょう。",
    },
  ],
  [ZOHEI]: [
    { from: "天神橋筋商店街から歩いておよそ9分、", to: "大阪天満宮から歩いておよそ17分、" },
    {
      from: "休館日があるので、訪れる前に公式サイトで確かめておくと安心です。見学を終えたら、次は大阪城公園を歩いておよそ27分、大阪城天守閣へ向かいましょう。",
      to: "休館日があるので、訪れる前に公式サイトで確かめましょう。この後は、大阪城公園を歩いておよそ23分、大阪城天守閣へ向かいましょう。",
    },
  ],
  [TENSHU]: [
    { from: "造幣博物館から大阪城公園を歩いておよそ27分、", to: "造幣博物館から大阪城公園を歩いておよそ23分、" },
    { from: "この後は、歩いておよそ4分、西の丸庭園へ向かいましょう。", to: "この後は、歩いておよそ14分、西の丸庭園へ向かいましょう。" },
  ],
  [NISHI]: [
    { from: "大阪城天守閣から歩いておよそ4分、", to: "大阪城天守閣から歩いておよそ14分、" },
    {
      from: "緑の芝生と天守閣が織りなす景色を、ゆっくりと味わってみてください。この後は、歩いておよそ4分、豊国神社へ向かいましょう。",
      to: "開園の時間は季節で変わり、迎賓館の中に入れる日も限られるので、公式の案内で確かめましょう。緑の芝生と天守閣が織りなす景色を、ゆっくりと味わいましょう。この後は、歩いておよそ9分、豊国神社へ向かいましょう。",
    },
  ],
  [HOKOKU]: [
    { from: "西の丸庭園から歩いておよそ4分、", to: "西の丸庭園から歩いておよそ9分、" },
    {
      from: "静かに、敬意をもってお参りください。この後は、歩いておよそ7分、大阪歴史博物館へ向かいましょう。",
      to: "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。梅田の新旧から中之島、大阪城までをめぐった2日間の梅田さんぽ旅も、ここで終わりです。見学を終えたら、歩いておよそ18分のJR大阪城公園駅から帰りましょう。",
    },
  ],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TSUYU, h: 10, m: 50, stay: 40, legs: [] },
  { id: HEP, h: 11, m: 39, stay: 35, legs: [walk(9)] },
  { id: CHAYA, h: 12, m: 20, stay: 50, legs: [walk(6)] },
  { id: NAKA, h: 13, m: 19, stay: 40, legs: [walk(9)] },
  { id: GG, h: 14, m: 17, stay: 41, legs: [walk(18)] },
  { id: SKY, h: 15, m: 4, stay: 41, legs: [walk(6)] },
  { id: NAKANO, h: 16, m: 19, stay: 30, legs: [walk(34)] },
];
const DAY2: Plan = [
  { id: KOKAI, h: 9, m: 30, stay: 30, legs: [] },
  { id: TOYO, h: 10, m: 3, stay: 45, legs: [walk(3)] },
  { id: TENJIN, h: 11, m: 1, stay: 58, legs: [walk(13)] },
  { id: TENMA, h: 12, m: 2, stay: 35, legs: [walk(3)] },
  { id: ZOHEI, h: 12, m: 54, stay: 45, legs: [walk(17)] },
  { id: TENSHU, h: 14, m: 2, stay: 75, legs: [walk(23)] },
  { id: NISHI, h: 15, m: 31, stay: 35, legs: [walk(14)] },
  { id: HOKOKU, h: 16, m: 15, stay: 20, legs: [walk(9)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文が想定と違います");
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [TSUYU, HEP, CHAYA, NAKA, GG, SKY, NAKANO, KOKAI, TOYO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [OGI, TENMA, TENJIN, ZOHEI, TENSHU, NISHI, HOKOKU, REKI].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    for (const w of ["ください", "おすすめ", "よいでしょう", "扇町公園", "歴史博物館", "ですね", "ますよ"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
    memos[id] = m;
  }
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log(`\n説明文 → ${DESC_TO}`);
  console.log("外す: 扇町公園・大阪歴史博物館（2日目）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) => ({
      id: p.id,
      data: {
        ...timeLegs(p.h, p.m, p.stay, p.legs),
        ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
        ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
      },
    }));
  await prisma.$transaction(
    async (tx) => {
      // 中央公会堂・東洋陶磁美術館を2日目へ移す（写真を残すため作り直さない。orderNo は一時的に大きな番号）
      await tx.spot.update({ where: { id: KOKAI }, data: { dayId: DAY2_ID, orderNo: 9001 } });
      await tx.spot.update({ where: { id: TOYO }, data: { dayId: DAY2_ID, orderNo: 9002 } });
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx, remove: [OGI, REKI] });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

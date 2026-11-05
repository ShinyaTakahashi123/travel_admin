/**
 * 堂崎天主堂、五島のキリシタンの歴史をたどる日帰りプラン(40f8801b)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 40f8801b の欄。点だけの直しの案を出したところ、朝の船で 9:30 に堂崎に着けず、
 * 最終の船にも乗れないため、まとめて組み直しにする(企画運営 11/05 10:0x)。
 * - 題の中心の堂崎天主堂を残す。三井楽教会は OSM・地理院の注記に点がなく(DBの点は大字「三井楽町岳」の点)外す。
 *   大瀬崎灯台展望所は 7d6f199f と2つ目の重なりになるので外し、井持浦教会だけを中心でない1つの重なりとする(企画運営 11/05)。
 *   水ノ浦教会は b7eb511a(1泊2日)の2日目と重なる(これだけ)。行き先は4か所(昼食を除く)で、最終便の例外の表の最小の数(4)
 * - 旅の足: 長崎港から朝の船で福江港(9:05着の便)。港の近くでレンタカー(手続き15分)。帰りも同じ店で返し、最終のフェリー(16:50発)に間に合う「最終便」の例外
 *   (7d6f199f と同じ考え方。船の便と店の場所の出典は fix-goto-7d6f199f.ts)
 * - 点: 堂崎天主堂 way734662407(今の点のまま、11/03 に直した点)、楠原教会 今の点のまま(OSM「楠原教会」way1523090261 から約5m)、
 *   水ノ浦教会 node6326615995(今の点のまま)、昼食 「五島市 岐宿支所」node11161501852(32.7502082,128.7599495 を6けたに丸め)、
 *   井持浦教会 node2707991640(32.618073,128.609791 から直す。7d6f199f と同じ点)、
 *   レンタカーの店 地理院の住所検索「三尾野三丁目1番9号」32.690624,128.84111(店の名前はメモに書かない)
 * - 区間(routing.openstreetmap.de routed-car、秒から切り上げ＋5): 港→店 送迎8(7d6f199f と同じ)、店→堂崎 652.5→16(書き出し)、
 *   堂崎→楠原 1097.3→24、楠原→水ノ浦 209.6→9、水ノ浦→岐宿支所 60.3→7、岐宿支所→井持浦 1620.4→33、井持浦→店 1739.1→34(帰りの一文)
 * - 時刻: 9:05着＋降りる10＋送迎8＋手続き15＋車16＝堂崎 9:54。昼食 12:44。井持浦 14:02〜14:42。返却と送迎のあと港に 15:34 ごろ、16:50 発まで約76分
 * - 出典(五島市公式「五島の島たび」): 堂崎教会 goto.nagasaki-tabinet.com/junrei/332、楠原教会 /junrei/693、楠原牢屋跡 /junrei/1088、
 *   水ノ浦教会 /junrei/1087、井持浦教会とルルド /spot/670・/junrei/670(見学の注意「ミサ、冠婚葬祭時には不可の場合もあります」は 693・1087・670)
 * - 写真: 堂崎の1枚(28c0e167)はそのまま。外す大瀬崎の写真(5f5eb084、Osezaki_lighthouse.jpg)はスポットと一緒に消える。季節はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-goto-40f8801b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "40f8801b-fa0c-4c22-9744-4992fcb77d19";
const DAY_ID = "dbc808c3-191d-4a3a-a62d-ea403cbceebd";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const DOZAKI = "6c29617f-1a2c-4980-8407-18fd5f4979ac";
const KUSUHARA = "a9c13b6b-51df-4d37-b111-4cbe17180127";
const MIZUNOURA = "e1dbff5a-e0c3-4f90-a0d9-68b5d4468042";
const MIIRAKU = "521c2706-6a72-467b-9268-3e83ad3a5f45"; // 外す
const IMOCHIURA = "14b97197-c8af-4988-8e97-6d106d11e5d7";
const OSEZAKI = "c3c5cf77-6d63-405d-b51d-42f6242e967b"; // 外す
const REMOVE = [MIIRAKU, OSEZAKI];

const EXPECT: Record<string, string> = {
  [DOZAKI]: "堂崎天主堂", [KUSUHARA]: "楠原教会", [MIZUNOURA]: "水ノ浦教会", [MIIRAKU]: "三井楽教会",
  [IMOCHIURA]: "井持浦教会", [OSEZAKI]: "大瀬崎灯台展望所",
};
const PHOTOS_EXPECT = ["28c0e167-78c9-419c-9a7c-c6653dfcf472", "5f5eb084-6351-4131-bdfa-16b94b681173"].sort();
const PHOTOS_AFTER = ["28c0e167-78c9-419c-9a7c-c6653dfcf472"];

const TITLE_OLD = "堂崎天主堂、五島のキリシタンの歴史をたどる定番日帰りプラン";
const TITLE_NEW = "堂崎天主堂、五島のキリシタンの歴史をたどる日帰りプラン";
const DESC_OLD = "レンガ造りの美しい堂崎天主堂は、五島のキリスト教信仰の歴史を伝える資料館も併設。岐宿・三井楽エリアに点在する教会もあわせてめぐる、「潜伏キリシタン関連遺産」ゆかりの地を巡る定番プランです。";
const DESC_NEW = "れんが造りの堂崎天主堂から、岐宿の楠原教会と水ノ浦教会、日本で最初とされるルルドのある井持浦教会へ。五島のキリシタンの歴史をたどる、福江島の日帰りプランです。";

const PRAY = "今も大切に守られている祈りの場ですので、静かに、敬意をもって見学しましょう。";
const MASS = "ミサや冠婚葬祭のときは見学できないことがあり、閉まっている日もあります。";
const M = {
  dozaki:
    "長崎港から朝の船で福江港に着いたら、港の近くでレンタカーを借り(手続きに15分ほど)、車でおよそ16分走ると、堂崎天主堂です。船の運航と時刻は、公式で確かめましょう。禁教が解かれたあと、五島のキリシタンの復興のために訪れたフランス人宣教師のマルマン神父が、明治13年(1880)に、五島で最初とされる天主堂を木造で建てました。今のれんが造りの教会堂は、そのあとに着任したペリュー神父のもとで明治41年(1908)に完成したもので、資材の一部はイタリアから運ばれました。中は木造で、色ガラスの窓と、こうもり天井が見られます。今は、弾圧の歴史や資料を展示する資料館として公開されていて、昭和49年(1974)に長崎県の有形文化財に指定されました。開館の時間は季節によって変わるので、公式で確かめましょう。" +
    PRAY +
    "この後は、車でおよそ24分、楠原教会へ向かいましょう。",
  kusuhara:
    "堂崎天主堂から車でおよそ24分、岐宿町の楠原教会に着きます。楠原は、寛政9年(1797)に五島藩の求めで外海から渡ってきたキリシタンが移り住み、切り開いた地区です。明治元年(1868)の末に久賀島から始まった「五島崩れ」と呼ばれる弾圧はこの地にも及び、信者が捕らえられました。今のれんが造りの教会は、明治45年(1912)にようやく建てられたもので、下五島に残る教会の中では、堂崎教会に次いで2番目に古いとされています。教会の近くには、信者が入れられた牢屋を、残っていた材木で小さく復元した楠原牢屋跡もあります。" +
    MASS +
    PRAY +
    "この後は、車でおよそ9分、水ノ浦教会へ向かいましょう。",
  mizunoura:
    "楠原教会から車でおよそ9分、白い水ノ浦教会に着きます。水ノ浦の信徒は、寛政9年(1797)に外海から移り住んだ5人の男性とその家族に始まると伝えられています。明治元年(1868)には、「五島崩れ」がクリスマスの日にこの地に及びました。明治13年(1880)に最初の教会が建てられ、昭和13年(1938)に、鉄川与助の設計と施工で今の木造の教会に建て替えられました。ロマネスク、ゴシック、和風の造りが混ざった白い建物で、木造の教会堂では最大級の大きさといわれています。高台には、二十六聖人の一人で五島出身のヨハネ五島の像や、弾圧の時代の牢跡があります。" +
    MASS +
    PRAY +
    "この後は、車でおよそ7分、岐宿の町へ向かいましょう。",
  lunch:
    "水ノ浦教会から車でおよそ7分、岐宿の町に着きます。このあたりで昼食にしましょう。この後は、車でおよそ33分、井持浦教会へ向かいましょう。",
  imochiura:
    "岐宿の町から車でおよそ33分、福江島の南西、玉之浦町の井持浦教会に着きます。明治30年(1897)に建てられたれんが造りの教会は台風で倒れ、昭和63年(1988)に、コンクリート造りの今の教会として建て直されました。境内のルルドは、バチカンにルルドの洞窟が再現されたと聞いたペリュー神父が、五島の信徒に呼びかけ、島のあちこちから形の変わった岩や石を運んで、明治32年(1899)にできあがりました。日本のルルドの中で、最初に造られたものといわれています。ミサや冠婚葬祭のときは見学できないことがあります。" +
    PRAY +
    "旅の終わりは、福江の店まで車でおよそ34分です。車を返したら福江港へ。帰りの船の時刻も、公式で確かめておきましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "堂崎天主堂(既存。1か所目、区間なし。点 way734662407 のまま。写真はそのまま)",
    item: { id: DOZAKI, data: { visitTime: T(9, 54), stayDurationMin: 60, memo: M.dozaki, transitLegs: { deleteMany: {} } } },
  },
  {
    label: "楠原教会(既存。点 way1523090261 のそば、今のまま、車24)",
    item: { id: KUSUHARA, data: { visitTime: T(11, 18), stayDurationMin: 30, memo: M.kusuhara, transitLegs: L(["car", 24]) } },
  },
  {
    label: "水ノ浦教会(既存。点 node6326615995 のまま、車9)",
    item: { id: MIZUNOURA, data: { visitTime: T(11, 57), stayDurationMin: 40, memo: M.mizunoura, transitLegs: L(["car", 9]) } },
  },
  {
    label: "岐宿で昼食(新規。点「五島市 岐宿支所」node11161501852、車7)",
    item: { create: { name: "岐宿で昼食", lat: "32.750208", lng: "128.75995", visitTime: T(12, 44), stayDurationMin: 45, memo: M.lunch, transitLegs: C(["car", 7]) } },
  },
  {
    label: "井持浦教会(既存。点 32.618073,128.609791 → node2707991640、車33、帰りの一文)",
    item: {
      id: IMOCHIURA,
      data: { lat: "32.619183", lng: "128.611793", visitTime: T(14, 2), stayDurationMin: 40, memo: M.imochiura, transitLegs: L(["car", 33]) },
    },
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
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  const kept = photos.filter((p) => !REMOVE.includes(p.spotId)).map((p) => p.id);
  if (JSON.stringify(kept) !== JSON.stringify(PHOTOS_AFTER)) throw new Error(`残る写真が想定と違います: ${kept.join(",")}`);

  console.log(`題:\n  ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}${d.address ? `\n  住所: ${d.address}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log(`  写真: 残る ${PHOTOS_AFTER.join(",")}(堂崎)。外す大瀬崎の写真 5f5eb084 はスポットと一緒に消える`);
  console.log("\n  始まり 堂崎天主堂 9:54(福江港 9:05 着＋10＋8＋15＋16)/ 昼食 12:44(13:30まで)/ 終わり 井持浦教会 14:42(最終便の例外。港に15:34ごろ、16:50発まで約76分)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

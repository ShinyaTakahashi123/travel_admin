/**
 * #190 78eab247「朝市の海鮮とレトロな街並み、函館グルメさんぽ1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 08:30〜17:00（金森赤レンガ倉庫のあと湯の川まで約3時間あく）、2日目 3か所 09:30〜12:10 で、昼食の一言と帰りの一言がなく、移動も「車」と「バス」だけでレンタカーの話がなかった。
 *   湯の川温泉の写真は湯の川温泉の電停（停留場）の写真なので外す。食べ歩きの話は朝市・昼食だけになるので、タイトルを内容に合わせる
 * 市電・タクシーと歩きの旅（JR函館駅から。湯の川温泉に泊まる）:
 *   1日目: 函館朝市（朝食）8:30 → 摩周丸 → 八幡坂 → 函館ハリストス正教会 → 船魂神社 → 金森赤レンガ倉庫（昼食）→ 函館公園 → 函館八幡宮 → 湯倉神社 → 湯の川温泉の足湯 16:40 → 宿
 *   2日目: 見晴公園・香雪園 9:30 → トラピスチヌ修道院 → 函館山（昼食と展望）→ 立待岬 → 五稜郭公園 16:30 → 市電で函館駅前
 * タイトルを「朝市と元町の坂、湯の川と五稜郭をめぐる函館さんぽ1泊2日」に、季節は四季のまま、説明文は書き直す
 * 函館のほかのしおり（79db7413・bb3ae76a・b6c6744a・896c41e3・1c95d06d）の本文を読み、同じ言い回しにならないよう、出典の公式の文から新しく書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（北海道の観光公式サイト HOKKAIDO LOVE! visit-hokkaido.jp）:
 *   spot/detail_10031 函館朝市（1945年に農家の立ち売りから・約3ha・約250店・活いか釣堀）／detail_10201 摩周丸（青森と函館を結んだ青函連絡船・操舵室と無線通信室・模型や部品・甲板）／
 *   detail_10089 八幡坂（石畳が港へまっすぐ・赤い煙突の摩周丸・春は桜、冬は雪・夕暮れに街灯）／detail_10017 函館ハリストス正教会（1860年ロシア領事館の聖堂・1861年聖ニコライ・
 *   1907年の大火で焼失、1916年再建・重要文化財・八角の鐘楼と6つの玉ねぎ形のクーポル・鐘の音で「ガンガン寺」・冬季休館と曜日による見学時間）／detail_13052 船魂神社（1135年良忍上人・海上安全・義経の伝説）／
 *   detail_10036 金森赤レンガ倉庫（1887年創業、1909年再建、1988年に複合施設・レストラン・ガラス工芸、オルゴール、オルゴールの制作体験）／detail_12220 函館公園（1879年市民の協力で・国の名勝・こどものくにの
 *   日本最古の観覧車・約400本の桜・津軽海峡を望む）／detail_11294 函館八幡宮（1445年・1880年に今の場所へ・大正時代の本殿・開拓、海、漁業の守り・石段）／detail_11450 湯倉神社（1654年に松前藩主の病が
 *   湯治で快癒・藩主の母が社殿を改修し薬師如来像を奉納）／spa/spot/detail_10615 湯の川温泉（北海道三大温泉郷の一つ・松前藩主の伝説・津軽海峡を望む露天風呂・足湯）／detail_10211 見晴公園・香雪園
 *   （1890年代に岩船家の別荘・北海道唯一の国指定文化財庭園（名勝）・約150種類の庭木・レンガ造りの温室と園亭・約100mのカエデ並木）／detail_11176 トラピスチヌ修道院（日本初の女子修道院・1898年創立・
 *   1927年再建の聖堂・ゴシックとロマネスク・前庭・資料室・手作りのマダレナケーキ）／detail_10033 函館山山頂展望台（津軽海峡と函館湾に挟まれた町・ランチも楽しめるレストラン）と detail_10094 函館山ロープウェイ
 *   （125人乗り・約3分・秋頃にロープウェイのみ運休する期間）／detail_10030 立待岬（異国船を監視する要所・海抜約30m・大森浜・津軽半島と下北半島・啄木一族の墓所と与謝野寛、晶子夫妻の歌碑・ハマナス）／
 *   detail_10034 五稜郭公園（16世紀ヨーロッパの城塞都市がお手本の星形・北海道唯一の特別史跡・約1500本の桜・堀のボート・2010年に箱館奉行所を復元）
 * 座標: OSM — 函館朝市 way 1117395054（marketplace）・摩周丸 way 263925780（museum）・函館ハリストス正教会 way 254175356・函館公園 way 60577180・函館八幡宮 way 1213037094・見晴公園 way 579803461・
 *   トラピスチヌ修道院 way 241420140（monastery）・五稜郭公園 way 39635898（Nominatim の中心）／八幡坂 node 5329294424（attraction）・船魂神社 node 4508571711・金森赤レンガ倉庫 node 2476094422（shop=mall、
 *   施設そのものの点）・湯倉神社 node 2509573841・湯の川温泉足湯「湯巡り舞台」node 2700680941（viewpoint）・函館山展望台 node 5603043222（viewpoint）・立待岬 node 4912828921（viewpoint）（API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-190-78eab247.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "78eab247-c4ae-4d91-b3d0-e30d0f0c1998";
const DAY1_ID = "38daf822-aa36-46f0-830c-71823a3f2423";
const DAY2_ID = "400c5e37-19e2-40d1-ad1a-bcef32e5cd90";
const ASAICHI = "4448481d-c1cd-41bb-9a7b-3392e9990012";
const HARISTOS = "eb7647b4-be95-44bd-916f-6912609a00cd";
const HACHIMANZAKA = "6f2628ad-5870-4616-9665-433e22d2498b";
const KANEMORI = "6fae6c98-41b6-4e5f-8d1f-f61d1f663ce2";
const YUNOKAWA = "441f6e7b-6067-4d4f-8201-84695f4bb4fe";
const TRAPPISTINE = "257b5b6a-1c0d-4a34-83e1-32aa193fc33b";
const TACHIMACHI = "7275ae17-bc76-4bb2-a8a2-e890ef7541ca";
const HAKODATEYAMA = "8377aeed-ebca-43cb-bf58-b6bf051ef791";
const REMOVE_PHOTOS = ["e5b569c9-1fd8-497b-8040-ebd4b8d657f1"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const tram = (min: number, line: string) => ({ mode: "train" as const, min, line });
const taxi = (min: number) => ({ mode: "taxi" as const, min });
const other = (min: number, line: string) => ({ mode: "other" as const, min, line });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const TITLE = "朝市と元町の坂、湯の川と五稜郭をめぐる函館さんぽ1泊2日";
const DESCRIPTION =
  "1日目は函館朝市の朝ごはんから、青函連絡船の摩周丸、八幡坂と元町の教会や神社、金森赤レンガ倉庫での昼食、函館公園と函館八幡宮をめぐり、市電で湯の川温泉へ。2日目は香雪園の庭とトラピスチヌ修道院、函館山の山頂での昼食、立待岬、五稜郭公園をたずねる、市電と歩きの函館1泊2日です。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(ASAICHI, { h: 8, m: 30, stay: 60, legs: [], lat: 41.7722393, lng: 140.724817, address: "北海道函館市若松町9-19",
    memo: "この旅は市電と歩きでめぐります。JR函館駅から歩いて約1分。終戦直後の1945年に、近くの農家が野菜の立ち売りを始めたことから育った市場で、今では約3haの敷地に約250の店が集まっています。朝ごはんは、ここで海鮮丼などを味わいましょう。生け簀で泳ぐイカを自分で釣り上げる「活いか釣堀」もあります。" }, "函館朝市（朝食）"),
  cre("函館市青函連絡船記念館摩周丸", { h: 9, m: 35, stay: 60, legs: [walk(5)], lat: 41.7729301, lng: 140.7218544, address: "北海道函館市若松町12",
    memo: "朝市から歩いて約5分。かつて青森と函館を結んだ青函連絡船「摩周丸」の船内を公開している記念館です。船長が指揮をとった操舵室や、当時の面影を残す無線通信室がそのまま残り、模型や船の部品の展示から連絡船の歴史をたどれます。甲板に出ると函館港を見渡せます。" }),
  upd(HACHIMANZAKA, { h: 10, m: 55, stay: 15, legs: [walk(20)], lat: 41.7637939, lng: 140.7117728, address: "北海道函館市元町",
    memo: "摩周丸から歩いて約20分。坂の上に立つと、港へ向かって一直線に下る石畳の先に、さきほど見学した摩周丸の赤い煙突が見えます。春は桜、冬は雪が坂をいろどり、夕暮れには街灯が石畳を照らします。坂道は車も通るので、写真を撮るときは車に気をつけましょう。" }),
  upd(HARISTOS, { h: 11, m: 15, stay: 30, legs: [walk(5)], lat: 41.7628449, lng: 140.7122129, address: "北海道函館市元町3-13",
    memo: "八幡坂の上から歩いて約5分。1860年にロシア領事館の聖堂として建てられたのが始まりで、1861年に来日した聖ニコライによって、日本の正教の歩みが始まったとされます。1907年の大火で焼けたのち、1916年に建て直された今の聖堂は、白い壁に緑の屋根、八角形の鐘楼と6つの玉ねぎ形の屋根をのせた姿で、国の重要文化財です。祈りの時間に鳴り響く鐘の音から「ガンガン寺」とも呼ばれます。冬は見学できない期間があり、見学の時間も曜日で変わるので、公式の案内で確かめましょう。" + PRAY }),
  cre("船魂神社", { h: 11, m: 50, stay: 15, legs: [walk(5)], lat: 41.7634249, lng: 140.7100491, address: "北海道函館市元町7-2",
    memo: "ハリストス正教会から歩いて約5分。1135年に、良忍上人がこの地を神の宿る場所だと里の人々に伝え、海の安全を祈って建てたと伝わる神社です。源義経の一行が津軽海峡で嵐にあったとき、神の導きで難を逃れたという伝説も残ります。" + PRAY }),
  upd(KANEMORI, { h: 12, m: 20, stay: 60, legs: [walk(15)], lat: 41.7661843, lng: 140.7164492, address: "北海道函館市末広町14-12",
    memo: "船魂神社から港の方へ坂を下って歩いて約15分。1887年に始まり、1909年に建て直された赤レンガの倉庫群で、1988年に店やレストランが集まる施設に生まれ変わりました。レストランもあるので、ここで昼食にしましょう。ガラス工芸の品やオルゴールの店をのぞいたり、オルゴールづくりを体験したりもできます。" }, "金森赤レンガ倉庫（昼食）"),
  cre("函館公園", { h: 13, m: 40, stay: 50, legs: [walk(20)], lat: 41.7563066, lng: 140.715673, address: "北海道函館市青柳町",
    memo: "金森赤レンガ倉庫から歩いて約20分。1879年に、市民が資材や労力を出し合ってつくった公園で、国の名勝です。園内の小さな遊園地「こどものくに」には、今に残る観覧車として日本で最も古いとされる観覧車があり、高台からは津軽海峡を望めます。春には約400本の桜が咲きます。" }),
  cre("函館八幡宮", { h: 14, m: 42, stay: 30, legs: [walk(12)], lat: 41.753471, lng: 140.7102817, address: "北海道函館市谷地頭町",
    memo: "函館公園から歩いて約12分、函館山のふもとへ。1445年に始まり、1880年に今の場所へ移った神社で、大正時代に完成した本殿は、屋根の曲線が美しい木造の社殿です。北海道の開拓や海の仕事、漁業に携わる人々を守る神として信仰されてきました。社殿へは石段を上るので、足元に気をつけましょう。" + PRAY }),
  cre("湯倉神社", { h: 15, m: 58, stay: 20, legs: [walk(10), tram(35, "函館市電（谷地頭→湯の川温泉）"), walk(1)], lat: 41.7820825, lng: 140.7910153, address: "北海道函館市湯川町2丁目",
    memo: "八幡宮から谷地頭の電停へ歩いて約10分、市電で湯の川温泉の電停まで約35分（あわせて約46分）。湯の川温泉の始まりと結びつく神社で、1654年に松前藩の藩主の病が、この地の湯で湯治をして治ったことを機に始まったと伝わります。藩主の母が社殿を直し、薬師如来像を納めたといわれます。" + PRAY }),
  upd(YUNOKAWA, { h: 16, m: 25, stay: 15, legs: [walk(7)], lat: 41.7796142, lng: 140.7856804, address: "北海道函館市湯川町1丁目",
    memo: "湯倉神社から歩いて約7分。北海道三大温泉郷の一つに数えられる湯の川温泉の足湯で、地元の人も旅の人も気軽に立ち寄れます。足湯でもほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。この日は湯の川温泉の宿に泊まりましょう。津軽海峡を望む露天風呂のある宿もあります。" }, "湯の川温泉（足湯「湯巡り舞台」）"),
];

const DAY2: X[] = [
  cre("見晴公園・香雪園", { h: 9, m: 30, stay: 50, legs: [], lat: 41.7934443, lng: 140.8034978, address: "北海道函館市見晴町",
    memo: "湯の川温泉の宿から歩いて約20分。明治時代の豪商・岩船家の別荘として整えられた庭園「香雪園」を中心とする公園で、香雪園は北海道でただ一つの国の名勝の庭園とされます。約150種類の木々が植えられ、レンガ造りの温室や茶室風の園亭が点在します。秋には約100m続くカエデの並木が色づきます。" }),
  upd(TRAPPISTINE, { h: 10, m: 40, stay: 40, legs: [taxi(15), walk(5)], lat: 41.7875774, lng: 140.822574, address: "北海道函館市上湯川町346",
    memo: "見晴公園からタクシーで約15分、坂を歩いて約5分（あわせて約20分）。1898年に開かれた、日本で初めての女子修道院として知られる修道院です。赤レンガの聖堂は1927年に建て直されたもので、ゴシックとロマネスクの様式が調和しています。見学できるのは前庭で、売店のそばの資料室では修道院の歴史を学べます。修道女たちが手づくりする焼き菓子も知られています。" + PRAY }),
  upd(HAKODATEYAMA, { h: 12, m: 0, stay: 80, legs: [taxi(35), other(3, "函館山ロープウェイ"), walk(2)], lat: 41.7594299, lng: 140.7046412, address: "北海道函館市函館山",
    memo: "トラピスチヌ修道院からタクシーで約35分、函館山ロープウェイの山麓駅から、125人が乗れる大きなゴンドラで約3分、山頂へ（あわせて約40分）。山頂の展望台からは、津軽海峡と函館湾にはさまれた函館の町を見渡せます。展望台のレストランで、景色を眺めながら昼食にしましょう。ロープウェイは点検で運休する期間があるので、公式の案内で確かめましょう。乗るときは係の人の案内に従いましょう。" }, "函館山（昼食と展望）"),
  upd(TACHIMACHI, { h: 13, m: 45, stay: 30, legs: [other(3, "函館山ロープウェイ"), taxi(22)], lat: 41.7450295, lng: 140.7211846, address: "北海道函館市住吉町",
    memo: "ロープウェイで山を下り、タクシーで約22分（あわせて約25分）。函館山の南の端で津軽海峡に突き出た岬で、かつては異国の船を見張る要所でした。海抜約30mの断崖からは大森浜の海岸線を見下ろせ、晴れた日には青森県の津軽半島や下北半島まで見渡せます。散策路のそばには石川啄木一族の墓や、与謝野寛・晶子夫妻の歌碑があり、初夏にはハマナスが咲きます。お墓のまわりでは静かにしましょう。崖のふちには近づかないようにしましょう。" }),
  cre("五稜郭公園", { h: 15, m: 10, stay: 80, legs: [walk(20), tram(25, "函館市電（谷地頭→五稜郭公園前）"), walk(10)], lat: 41.7969004, lng: 140.7571559, address: "北海道函館市五稜郭町44",
    memo: "立待岬から谷地頭の電停へ歩いて約20分、市電で五稜郭公園前まで約25分、歩いて約10分（あわせて約55分）。16世紀のヨーロッパの城塞都市をお手本にした、星の形の五稜郭のあとに広がる公園で、北海道でただ一つの特別史跡とされます。春には約1500本の桜が咲き、堀でボートに乗ることもできます。2010年には、かつての箱館奉行所が復元されました。帰りは、五稜郭公園前の電停から市電で函館駅前へ戻りましょう（約15分）。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    it.days.length !== 2 ||
    it.days[0].id !== DAY1_ID ||
    it.days[1].id !== DAY2_ID ||
    it.days[0].spots.map((s) => s.id).join() !== [ASAICHI, HARISTOS, HACHIMANZAKA, KANEMORI, YUNOKAWA].join() ||
    it.days[1].spots.map((s) => s.id).join() !== [TRAPPISTINE, TACHIMACHI, HAKODATEYAMA].join()
  )
    throw new Error("構成が想定と違います");
  const yp = it.days[0].spots[4].photos;
  if (yp.map((p) => p.id).join() !== REMOVE_PHOTOS.join() || yp.some((p) => p.url === it.thumbnailUrl)) throw new Error("外す写真が想定と違います");
  show("1日目", DAY1);
  show("2日目", DAY2);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
      await setDaySpotOrder(DAY2_ID, DAY2, { tx });
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

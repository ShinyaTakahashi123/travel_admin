/**
 * #221 d66711cc「しまなみ海道サイクリング、来島海峡から大三島を渡る1泊2日」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 1か所 10:00〜11:00・2日目 1か所 09:30〜10:10 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご宿泊いただきます」）。
 *   1日目のサンライズ糸山は、令和8年3月31日に閉館していた（今治市 https://www.city.imabari.ehime.jp/kanko/spot/?a=21 ）。
 *   隣の今治糸山レンタサイクルは営業を続けているので、スポットの名前と本文を「今治糸山レンタサイクル」に直す
 * 1日目（レンタサイクル）: 今治糸山レンタサイクル 9:00 →（来島海峡大橋）亀老山展望公園 → 道の駅よしうみいきいき館（昼食）→ 村上海賊ミュージアム →（伯方・大島大橋）開山公園 16:30（伯方島に泊まる）
 * 2日目: 大山祇神社 9:30 → 大山祇神社宝物館 → 道の駅多々羅しまなみ公園（昼食・自転車を返す）→ 多々羅大橋 →（路線バス）今治市伊東豊雄建築ミュージアム → ところミュージアム大三島 16:30 → バスで今治へ
 *   #285・#491（尾道側の因島・生口島）とは重ならない。#222（来島海峡展望館）・#223（大山祇神社）は、のちの見直しで書き分ける
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 今治市 観光情報 https://www.city.imabari.ehime.jp/kanko/spot/?a=<番号> —
 *   今治糸山レンタサイクル 21（来島海峡大橋のたもと・サンライズ糸山は閉館・8時30分〜19時、12〜2月は18時）／
 *   亀老山展望公園 182（標高307.8m・大島の南端・瀬戸内海国立公園・隈研吾の設計の展望台・来島海峡大橋・来島海峡の潮流・晴れた日に石鎚山）／
 *   村上海賊ミュージアム 195（戦国時代の村上海賊・文献や出土品・9時〜17時 入館16時30分・最寄りのレンタサイクルは道の駅よしうみいきいき館）／
 *   開山公園 206（春は約1000本の桜・頂上の展望台から伯方・大島大橋、大三島橋、多々羅大橋・つつじ・遊具）／
 *   大山祇神社 226（樹齢約2,600年の大楠・楠群は国の天然記念物・伊藤博文の社号石・水軍の武将の信仰・17時閉門）／
 *   大山祇神社宝物館 228（国宝・重要文化財の武具類の多く・源頼朝や源義経・村上海賊の法楽連歌・8時30分〜17時 入館16時30分）／
 *   道の駅多々羅しまなみ公園 210（多々羅大橋の袂・世界一（建設当時）の斜張橋・レストラン・産直・しあわせの鐘・レンタサイクル）／
 *   伊東豊雄建築ミュージアム 249（伊東豊雄の軌跡を展示・スティールハットとシルバーハット・施設自体が作品・9時〜17時）／
 *   ところミュージアム大三島 248（現代アート美術館・立体作品・オープンテラスから多島美・9時〜17時・宮浦港から宗方港行のバス約20分）
 *   道の駅よしうみいきいき館 今治地方観光協会 https://www.oideya.gr.jp/spot-c/ikiikikan/ （来島海峡大橋の目の前・いけすの魚介の海鮮バーベキューや七輪焼き・レストラン 10:00〜14:00）
 * 座標: OSM — サンライズ糸山（レンタサイクル）way 162654199（Nominatim の中心）／亀老山展望公園 way 904726914（同）／道の駅よしうみいきいき館 way 625735287（同）／
 *   村上海賊ミュージアム node 1423730145（OSM の名前は旧名の「村上水軍博物館」）／開山公園 way 1215602128（同）／大山祇神社 way 699380682（同）／宝物館 way 699380696（同）／
 *   道の駅多々羅しまなみ公園 way 162341341（同）／多々羅大橋 way 753018479（同）／伊東豊雄建築ミュージアム relation 20987010（同）／ところミュージアム大三島 way 235377720（同）
 *   入れなかった所: 鼻栗瀬戸展望台・多々羅展望台（OSM に名前つきの点がなく、国土地理院も大字の点だけ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-221-d66711cc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d66711cc-25fd-406e-b98d-3155df878f5c";
const DAY1 = "2b382220-405a-4a2b-b036-9d66cb595354";
const DAY2 = "409eeefe-ec10-480a-9261-c457a025d269";
const ITOYAMA = "76631b32-9eaa-422b-ad4c-15509450d8d5";
const TATARA = "e744e586-8b19-449a-bfe7-5a5ededc0fe3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BIKE = "自転車で走るときは、ヘルメットをかぶり、車に気をつけて走りましょう。";

const DESCRIPTION =
  "今治の糸山でレンタサイクルを借りて、来島海峡大橋から大島、伯方島、大三島へと、しまなみ海道を自転車で渡る1泊2日です。亀老山展望公園や村上海賊ミュージアム、大山祇神社をめぐり、多々羅大橋のたもとで自転車を返したら、大三島の建築とアートのミュージアムで締めくくります。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string; name?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ ...(s.name ? { name: s.name } : {}), visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { ...base(s), name, ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
const bike = (min: number): Leg => ({ mode: "other", min });

const D1: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(ITOYAMA, { name: "今治糸山レンタサイクル", h: 9, m: 0, stay: 20, legs: [], lat: 34.1103315, lng: 132.9773595, address: "愛媛県今治市砂場町2-8-1",
    memo: "この旅は、自転車でしまなみ海道を渡ります。JR今治駅からタクシーで約15分の糸山へ。来島海峡大橋のたもとにあるレンタサイクルの拠点で、ここで自転車を借りて出発します（隣のサイクリングターミナル「サンライズ糸山」は閉館しています）。" + BIKE }),
  cre("亀老山展望公園", { h: 10, m: 30, stay: 40, legs: [bike(70)], lat: 34.1201239, lng: 133.0341105, address: "愛媛県今治市吉海町南浦487-4",
    memo: "来島海峡大橋を自転車で渡り、大島の南の山を上って約1時間10分。標高307.8mの山頂にある展望公園で、建築家・隈研吾の設計による展望台からは、来島海峡大橋と、日本三大急潮のひとつとされる来島海峡の潮の流れ、晴れた日には石鎚山まで見渡せます。山道は急な上り坂が続くので、無理をせず、自転車を押して歩くのもよいでしょう。" }),
  cre("道の駅よしうみいきいき館", { h: 11, m: 40, stay: 60, legs: [bike(30)], lat: 34.1275706, lng: 133.0219715, address: "愛媛県今治市吉海町名4520-2",
    memo: "亀老山から坂を下って、自転車で約30分。来島海峡大橋を目の前にのぞむ道の駅で、いけすの魚介を使った海鮮バーベキューや七輪焼きを楽しめます。ここで昼食にしましょう。下り坂はスピードを出しすぎないように気をつけましょう。" }),
  cre("村上海賊ミュージアム", { h: 13, m: 30, stay: 70, legs: [bike(50)], lat: 34.1688899, lng: 133.0876143, address: "愛媛県今治市宮窪町宮窪1285",
    memo: "道の駅から大島の島内を北東へ、自転車で約50分の宮窪へ。戦国時代に「海の大名」とも呼ばれ、海を自在に行き来した村上海賊の姿を、文献や出土品から紹介するミュージアムです。休館日は公式の案内で確かめましょう。" }),
  cre("開山公園", { h: 15, m: 40, stay: 50, legs: [bike(60)], lat: 34.2288276, lng: 133.0656759, address: "愛媛県今治市伯方町伊方",
    memo: "ミュージアムから伯方・大島大橋を渡り、自転車で約1時間の伯方島の開山へ。春には約1000本の桜が咲く公園で、頂上の展望台からは、伯方・大島大橋、大三島橋、多々羅大橋を一度に見渡せます。山の上までは上り坂です。この夜は、伯方島の宿に泊まりましょう。" }),
];

const D2: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("大山祇神社", { h: 9, m: 30, stay: 50, legs: [], lat: 34.2481398, lng: 133.0053057, address: "愛媛県今治市大三島町宮浦3327",
    memo: "この日も自転車でめぐります。伯方島の宿から大三島橋を渡り、自転車で約50分の大三島・宮浦へ。境内の中央には樹齢約2,600年とされる大楠があり、神社の楠の群れは国の天然記念物です。社号の石は初代内閣総理大臣・伊藤博文が参拝の記念に書いたもので、昔は水軍の武将たちの信仰も集めました。" + PRAY }),
  cre("大山祇神社宝物館", { h: 10, m: 25, stay: 45, legs: [{ mode: "walk", min: 5 }], lat: 34.2474757, lng: 133.004448, address: "愛媛県今治市大三島町宮浦3327",
    memo: "境内から歩いてすぐ。国宝や重要文化財に指定された武具の多くを収蔵・展示する宝物館で、源頼朝や源義経など、歴史上の人物ゆかりの品々を間近に見られます。村上海賊の武将たちが詠んだ連歌も、数多く奉納されています。" }),
  cre("道の駅多々羅しまなみ公園", { h: 11, m: 55, stay: 55, legs: [bike(45)], lat: 34.2543778, lng: 133.0541171, address: "愛媛県今治市上浦町井口9180-2",
    memo: "宮浦から自転車で約45分、多々羅大橋のたもとへ。建設当時は世界一の斜張橋とされた多々羅大橋のそばにある道の駅で、レストランや産地直売所、しあわせの鐘などがあります。ここで昼食にしましょう。レンタサイクルの返却もできるので、ここで自転車を返しましょう（返せる場所と時間は公式の案内で確かめましょう）。" }),
  upd(TATARA, { h: 13, m: 0, stay: 40, legs: [{ mode: "walk", min: 10 }], lat: 34.2598052, lng: 133.0647935, address: "愛媛県今治市上浦町井口",
    memo: "道の駅から歩いて約10分。大三島と、広島県の生口島を結ぶ斜張橋で、建設当時は世界一の斜張橋とされました。橋のたもとから、空へ向かって伸びる塔と、張りわたされたケーブルの姿を間近に見上げられます。歩道を歩くときは、自転車に気をつけましょう。" }),
  cre("今治市伊東豊雄建築ミュージアム", { h: 14, m: 25, stay: 60, legs: [{ mode: "walk", min: 10 }, { mode: "bus", min: 15, line: "瀬戸内海交通（宮浦港行き）" }, { mode: "bus", min: 20, line: "瀬戸内海交通（宗方港行き）" }],
    lat: 34.2134355, lng: 132.9504076, address: "愛媛県今治市大三島町浦戸2418",
    memo: "橋から大三島バスストップへ歩き、路線バスで宮浦港へ行き、宗方港行きのバスに乗り換えて、ところミュージアムで降りて歩いてすぐ（あわせて約45分）。建築家・伊東豊雄の仕事の歩みを紹介するミュージアムで、展示の建物「スティールハット」と「シルバーハット」も伊東豊雄の設計による、施設そのものが作品です。バスの本数は多くないので、時刻を公式の時刻表で確かめましょう。" }),
  cre("ところミュージアム大三島", { h: 15, m: 30, stay: 60, legs: [{ mode: "walk", min: 5 }], lat: 34.215102, lng: 132.9519808, address: "愛媛県今治市大三島町浦戸2362-3",
    memo: "伊東豊雄建築ミュージアムから歩いて約5分。アメリカで活動するノエ・カッツやマリソール、イタリアのジャコモ・マンズーなど、海外の作家の作品を中心に展示する現代アートの美術館で、館内のオープンテラスからは瀬戸内海の島々が見渡せます。帰りは、ところミュージアムのバス停から路線バスで宮浦港へ行き、今治駅へ向かうバスに乗り換えましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || it.days[0].spots.map((s) => s.id).join() !== ITOYAMA || it.days[1].spots.map((s) => s.id).join() !== TATARA) throw new Error("構成が想定と違います");
  for (const [label, day] of [["1日目", D1], ["2日目", D2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of day) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
      const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${d.name ?? "多々羅大橋"}${"id" in x ? "(既存)" : ""} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1, D1, { tx });
      await setDaySpotOrder(DAY2, D2, { tx });
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

/**
 * チェックリスト #399 fd9af1f7「世界遺産・佐渡金山、江戸時代の採掘坑道を巡る定番日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。史跡佐渡金山 → 北沢浮遊選鉱場跡 → 尖閣湾揚島遊園（昼食）→ きらりうむ佐渡 → 佐渡奉行所跡 → 京町通り（6か所 09:00〜16:30）
 * 既存の佐渡金山はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。写真（道遊坑の中）は目で見て合っているので残す
 * 座標の出典: Nominatim（史跡 佐渡金山 tourism=attraction 38.0409082,138.2577522／尖閣湾揚島遊園 38.0938940,138.2486450／きらりうむ佐渡 38.0300033,138.2403219／
 *   佐渡奉行所跡 38.0358044,138.2396866／バス停「佐渡版画村」38.0354128,138.2408046（京町通りまで徒歩1分）、OSM/Overpass（北沢浮遊選鉱場跡 38.036779,138.242108）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-399-fd9af1f7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fd9af1f7-8f27-4e9a-ab8c-31619adeb036";
const DAY1_ID = "9c5b6c96-7e69-4f85-9800-0066ce459341";
const KINZAN_ID = "cfa533b2-658b-49f9-9fcf-5ca1ff47e6e1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界遺産「佐渡島の金山」の相川で、江戸時代の坑道や山が割れた「道遊の割戸」を見学し、近代の北沢浮遊選鉱場跡へ。昼は尖閣湾の景色を眺め、午後はガイダンス施設で金銀山の歴史をつかんでから、佐渡奉行所跡と京町通りを歩く、車でめぐる日帰りプランです。";

const MEMO_KINZAN =
  "両津港から車で約50分。世界遺産「佐渡島の金山」の主要な鉱山の一つ、相川金銀山の一部を公開している見学施設です。基本の「佐渡金山コース」では、宗太夫坑と道遊坑の2つの坑道をめぐり、時代ごとの金銀の採掘の様子を知ることができます。コースの途中では、佐渡金山のシンボル「道遊の割戸」にも近づけます。江戸時代の露天掘りの跡で、金脈を掘り進むうちに山がV字に割れたような姿になり、山頂の割れ目は幅約30m、深さ約74mにも達します。坑道の中では足元に気をつけ、歩きやすい靴で見学しましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const AFTER: NewSpot[] = [
  {
    name: "北沢浮遊選鉱場跡", h: 10, m: 50, stay: 40, mode: "car", dur: 10, lat: 38.036779, lng: 138.242108, address: "新潟県佐渡市相川北沢町3-2",
    memo:
      "佐渡金山から車で山を下りて約10分。発電所やシックナーなど、鉱山の近代化を支えた施設群（国の史跡）が集まる北沢地区にある選鉱場の跡です。もとは銅の製造で使われていた浮遊選鉱法を金銀の採取に応用し、日本で初めて実用化に成功しました。戦時下の大増産計画で大規模な設備が整えられ、1か月に最大5万tもの鉱石を処理できたことから「東洋一」とうたわれました。残るコンクリートの基礎が、往時の繁栄を語っています。",
  },
  {
    name: "尖閣湾揚島遊園（昼食）", h: 11, m: 50, stay: 90, mode: "car", dur: 20, lat: 38.093894, lng: 138.248645, address: "新潟県佐渡市北狄1561",
    memo:
      "北沢から海沿いを車で約20分。「尖閣湾」の第5景「揚島峡湾」に建つ観光施設で、展望台から、北欧のフィヨルドにたとえられる入り組んだ海岸の景色を一望できます。周辺は「全国渚百選」にも選ばれた海中公園で、湾内をめぐる海中透視船も運航しています。園内には軽食堂もあるので、景色を眺めながら昼食にしましょう。冬の営業は公式の案内で確かめてください。",
  },
  {
    name: "きらりうむ佐渡", h: 13, m: 45, stay: 60, mode: "car", dur: 25, lat: 38.030003, lng: 138.240322, address: "新潟県佐渡市相川三町目浜町18-1",
    memo:
      "尖閣湾から車で相川の町へ。佐渡金銀山の玄関口となるガイダンス施設で、金銀山の価値や魅力を、プロジェクションマッピングや大型映像、金銀山の歴史絵巻などでわかりやすく紹介しています。このあと歩く奉行所跡や京町通りの前に、ここで金銀山の町の全体像をつかんでおきましょう。",
  },
  {
    name: "佐渡奉行所跡", h: 14, m: 55, stay: 50, mode: "walk", dur: 10, lat: 38.035804, lng: 138.239687, address: "新潟県佐渡市相川広間町1-1",
    memo:
      "きらりうむ佐渡から坂道を歩いて約10分。金脈の発見によって佐渡は幕府の直轄地となり、1603年、相川に佐渡奉行所が置かれました。2000年に「御役所」の部分が復元され、「役所」や「白洲」などの司法・行政の場に加えて、金銀を精製する「寄勝場」の働きもあわせもつ、佐渡ならではの奉行所の姿を伝えています。金の精錬の工程の一部を体験できる作業場もあります。",
  },
  {
    name: "京町通り", h: 15, m: 50, stay: 40, mode: "walk", dur: 5, lat: 38.035413, lng: 138.240805, address: "新潟県佐渡市相川",
    memo:
      "奉行所跡から歩いてすぐ。相川金銀山と奉行所を結んだメインストリートで、時鐘楼のある下京町から中京町、上京町へと坂道を上っていきます。かつては鉱山で働く人々の住まいや多くの商店が軒を並べ、細い路地のあちこちに当時の町づくりの名残りが見られます。金山の町の面影を感じながら、ゆっくり歩いてみましょう。帰りは両津港まで車で約50分です。",
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== KINZAN_ID) throw new Error("構成が想定と違います");

  const order = [
    { id: KINZAN_ID, data: { visitTime: t(9, 0), stayDurationMin: 100, transitMode: null, transitDurationMin: null, transitLine: null, lat: 38.040908, lng: 138.257752, memo: MEMO_KINZAN } },
    ...AFTER.map(cre),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "佐渡金山(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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

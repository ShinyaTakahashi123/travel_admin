/**
 * チェックリスト #442 a3e15012「フラワーロードと運河クルーズ、定番のハウステンボス日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅（企画運営と相談のうえ 案A）: 旧佐世保無線電信所（針尾送信所）（新規）→ フラワーロード → 運河クルーズ → ドムトールン（新規）→（昼食）→ パレス ハウステンボス（新規）
 *   → アムステルダムシティの街並み（新規）（6か所 09:00〜16:30）
 * ハウステンボスは公式の営業時間カレンダー（https://www.huistenbosch.co.jp/opentime/）で毎日10:00開場なので、朝は車で10〜15分ほどの針尾送信所（9:00から見学できる）を最初に
 * 園内は、公式で確かめられる建物・景観だけを書き、入れ替わりの多いアトラクション・ショー・イベントの名前と料金は書かない（企画運営の了承 2026-09-30）
 * 既存の2か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）。「中世オランダの街並みを忠実に再現」「オランダ政府の協力」「12世紀に漁村として始まり…になぞらえて」は開いた公式で確かめられないので外す
 * 写真: 2か所に同じ写真（ドムトールンから見下ろした街並みと運河、JKT-c）が付いていた。運河は写っているので運河クルーズには残し、風車も花畑も写っていないフラワーロードのほうは消す（表紙は同じ写真のまま）
 * 本文の出典: 佐世保市 https://www.city.sasebo.lg.jp/keizai/kankou/nihonisan/chinjyufu_hariosousinsyo-sougou.html ・https://www.city.sasebo.lg.jp/kyouiku/bunzai/kengaku.html （針尾送信所）、
 *   ハウステンボス公式 https://www.huistenbosch.co.jp/enjoy/145（ドムトールン）・/enjoy/163（パレス ハウステンボス）・/enjoy/174（カナルクルーザー）・/mottohtbssb/huistenbosch/（フラワーロード、ドムトールン、アムステルダムシティ）・
 *   /aboutus/company/history.html（1992年グランドオープン）・よくあるご質問（「森の家」の意味、約152ha）
 * 座標の出典: Nominatim（針尾送信所 電信室 33.0668632,129.7514178）、OSM/Overpass（フラワーロードの風車 node 2211504428 33.088277,129.791081／カナルクルーザー乗り場 node 1789792310 33.088349,129.790509／
 *   ドムトールン展望室 node 4693066189 33.084418,129.786058／パレス ハウステンボス（美術館・博物館）node 1423797459 33.079586,129.783576／スタッドハウス way 211142501 33.084014,129.787558）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-442-a3e15012.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a3e15012-77c4-44cc-a9c8-122166b98c68";
const DAY1_ID = "cf10e91a-583a-4f38-b658-62d034077306";
const FLOWER = "b25d7131-8979-46a9-b6a2-5c34ffd738c4";
const CANAL = "7cba3674-6e94-494e-a4c7-2e5e1d1a3833";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "朝は車で、国の重要文化財の旧佐世保無線電信所（針尾送信所）へ。そのあとハウステンボスに入り、風車と花畑のフラワーロード、運河をめぐるクルーザー、地上80mの展望室があるドムトールン、オランダの宮殿を再現したパレス ハウステンボス、花時計のあるアムステルダムシティの街並みを歩いてめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("旧佐世保無線電信所（針尾送信所）", 9, 0, 40, null, null, 33.066863, 129.751418, "長崎県佐世保市針尾中町382",
    "今日は車（レンタカーなど）でめぐります。ハウステンボスが開く前に、針尾島にある旧佐世保無線電信所（針尾送信所）へ。旧海軍が設けた長波の無線電信所の一つで、大正7年（1918年）に着工し、大正11年（1922年）に完成しました。国内でも最初期のコンクリート建造物で、今に残る唯一の長波通信施設とされ、3基の無線塔や電信室などが国の重要文化財に指定されています。見学は30分ほどが目安で、保存会の方の案内を受けることもできます。見学できる時間は公式の案内で確かめましょう。歩道は整備されていないので歩きやすい靴で、立ち入り禁止の場所には入らず、保存会の方の指示に従って見学しましょう。"),
  upd(FLOWER, 10, 0, 40, "car", 20, 33.088277, 129.791081,
    "針尾送信所から車でハウステンボスへ。車は駐車場に置いて、ここからは園内を歩いてめぐります。ハウステンボスは1992年に開業した、ヨーロッパのような街並みが広がるテーマパークで、名前はオランダ語で「森の家」を意味します。敷地は約152haもあります。フラワーロードは、風車と花畑がオランダの田園風景を思わせる、ハウステンボスを象徴する場所です。咲いている花や開場の時間は季節によって変わるので、公式の案内で確かめてから出かけましょう。"),
  upd(CANAL, 10, 50, 30, "walk", 10, 33.088349, 129.790509,
    "フラワーロードの近くの乗り場から、カナルクルーザーで運河をめぐりましょう。全長約6kmの運河をゆっくり進むクラシカルな船で、船の上からは、ヨーロッパのような街並みと田園風景を360度楽しめます。水の音や風を感じながら、ドムトールンのあるタワーシティのほうへ向かいます。運航の時刻は公式の案内で確かめましょう。"),
  cre("ドムトールン（ハウステンボス）", 11, 25, 45, "walk", 5, 33.084418, 129.786058, "長崎県佐世保市ハウステンボス町1-1",
    "園内のどこからでも見える、ハウステンボスのシンボルタワー・ドムトールンへ。オランダのユトレヒトにある、14世紀に建てられたゴシック様式の時計塔を再現した塔です。エレベーターで地上80mの展望室に上がれば、場内の全景はもちろん、大村湾まで見晴らす景色が広がります。展望室からの眺めを楽しんだら、このあたりで昼食にしましょう。"),
  cre("パレス ハウステンボス", 13, 25, 105, "walk", 15, 33.079586, 129.783576, "長崎県佐世保市ハウステンボス町1-1",
    "昼食のあとは、園の南にあるパレス ハウステンボスへ。オランダ王室の特別な承認を受けて、ウィレム＝アレクサンダー国王が住まいとしている宮殿の外観を忠実に再現した建物で、「ハウステンボス」という名前もこの宮殿に由来します。宮殿の後ろに広がるバロック式庭園は、18世紀に設計されながら実現しなかった「幻の庭園」をよみがえらせたものです。館内の美術館では、さまざまな展示が行われています。"),
  cre("アムステルダムシティの街並み（ハウステンボス）", 15, 30, 60, "walk", 20, 33.084014, 129.787558, "長崎県佐世保市ハウステンボス町1-1",
    "パレス ハウステンボスから歩いて、園の中ほどのアムステルダムシティへ。広場のまわりには、オランダのゴーダ市を再現した街並みが広がり、スタッドハウスの建物のまわりは季節の花で彩られています。花時計も人気の撮影スポットです。人が多い場所なので、まわりに気をつけて歩きましょう。ヨーロッパの街角を歩くような気分で、ハウステンボスの一日を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [FLOWER, CANAL].join()) throw new Error("構成が想定と違います");
  const flowerPhotos = days[0].spots[0].photos;
  if (flowerPhotos.length !== 1 || !flowerPhotos[0].sourceUrl?.includes("Huis_Ten_Bosch_-_01.jpg")) throw new Error("フラワーロードの写真が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`写真: フラワーロードの写真 ${flowerPhotos[0].id} を消す（運河クルーズの同じ写真と表紙は残す）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.delete({ where: { id: flowerPhotos[0].id } });
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

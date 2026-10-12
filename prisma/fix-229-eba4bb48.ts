/**
 * #229 eba4bb48「大森町並みと龍源寺間歩、世界遺産・石見銀山の定番プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:50 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お楽しみいただけたことでしょう」）。
 *   写真1枚（説明は「大森町並み」）は、コモンズの説明では清水谷製錬所跡で、町並みではなかった
 * バスと歩きの旅（JR大田市駅から路線バスで大森へ）:
 *   龍源寺間歩 9:30 → 佐毘売山神社 → 清水寺 → 下河原吹屋跡 → 大森町並み（昼食）→ 栄泉寺 → 観世音寺 → 井戸神社 → 石見銀山資料館 16:30 → バスで大田市駅
 *   #44ade3e4（五百羅漢・城上神社・いも代官ミュージアム・勝源寺・龍源寺間歩・佐毘売山神社）・#34e2b41c（温泉津・資料館・熊谷家・清水谷・豊栄神社）と重なる所は文を別に書いた
 *   旧河島家・西性寺・町並み交流センターは、OSM に名前つきの点がなく、国土地理院も大森町の点だけなので入れなかった
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 島根県大田市観光サイト https://www.ginzan-wm.jp/purpose_post/<名前>/ —
 *   ryugenjimabu 龍源寺間歩（ただひとつ年間を通して公開・御直山五カ山のひとつ・江戸時代中頃の代官所直営の坑道・約600m・公開157m（新坑道と合わせ273m）・ノミの跡・7つの間歩が国の史跡）／
 *   佐毘売山神社（龍源寺間歩の出口から約200m・急な石段・15世紀中頃・鉱山の守り神・金山彦命・全国一の規模の山神社・文政2年再建）／
 *   清水寺（推古天皇の時代の創建と伝わる真言宗・天池寺・延暦17年に清水谷へ・家康から拝領の辻ヶ花染丁字文胴服は国の重要文化財・格天井に大久保長安の家紋）／
 *   下河原吹屋跡（発掘で見つかった17世紀初めの銀の精錬の跡・鉛を使う灰吹法）／oomori（代官所跡を見ながら食事のできる店）／
 *   栄泉寺（井戸平左衛門がさつま芋のことを聞いたといわれる・曹洞宗・朱塗りの竜宮門）／
 *   kanzeon 観世音寺（岩盤を刻んだ石段・仁王・十六羅漢・大森代官所の祈願寺・寛政の大火・本堂と山門は万延元年再建・石州瓦の家並みが一望）／
 *   井戸神社（代官・井戸平左衛門・さつまいもを広めた・「いも代官」・勝海舟の筆の額）／
 *   imodaikan いも代官ミュージアム（石見銀山資料館。代官所跡・採掘道具や古文書、鉱石、絵巻・旧迩摩郡役所の建物・門長屋・火曜休）
 * 座標: OSM — 龍源寺間歩 node 13091382540・佐毘賣山神社 node 7460556085・清水寺 node 7460556285・下河原吹屋跡 node 13387988716・榮泉寺 node 7460629185・
 *   観世音寺 node 7460629186・石見銀山資料館 node 1423618360（node は API で名前つきを確かめる）／井戸神社 way 612482499（Nominatim の中心）
 *   推定: 大森町並みは町並み全体の点がないので、町並みの中の小路「御銀蔵小路」way 612924296 の Nominatim の中心
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-229-eba4bb48.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "eba4bb48-2fcd-41ad-a10a-e602a2778fe2";
const DAY_ID = "8011d3bf-3a7b-4235-b299-16d8fa5628cc";
const MACHINAMI = "6c0aa4a9-83c3-4af0-90eb-2a0a1d4d5e76";
const RYUGENJI = "c6f7d89b-593b-4ffe-9e5d-bb3b6d1680df";
const WRONG_PHOTO = "20ed4117-ebf9-407a-bc81-160f8c7d7b4c";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const walk = (min: number): { mode: "walk"; min: number } => ({ mode: "walk", min });

const DESCRIPTION =
  "龍源寺間歩で江戸時代の坑道を歩き、鉱山の守り神の佐毘売山神社や、銀を精錬した下河原吹屋跡をたどって大森の町並みへ。昼食のあとは、代官所の祈願寺だった観世音寺や、いも代官を祀る井戸神社、代官所跡の資料館をめぐる、石見銀山をバスと歩きで楽しむ日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(RYUGENJI, { h: 9, m: 30, stay: 50, legs: [], lat: 35.0997661, lng: 132.4287954, address: "島根県大田市大森町ニ183",
    memo: "この旅はバスと歩きでめぐります。JR大田市駅から路線バスで約25分の大森代官所跡へ行き、銀山川沿いの道を歩いて約45分。江戸時代の中ごろに開かれた代官所直営の坑道で、石見銀山の間歩の中で、ただひとつ年間を通して公開されています。全長約600mのうち一部を歩くことができ、壁にはノミで掘った跡が今も残ります。坑道の中は足元がぬれていることもあるので、歩きやすい靴で、頭上にも気をつけましょう。" }),
  cre("佐毘売山神社", { h: 10, m: 30, stay: 20, legs: [walk(10)], lat: 35.0991275, lng: 132.4316738, address: "島根県大田市大森町",
    memo: "龍源寺間歩の出口から歩いて約10分。15世紀中ごろに創建された鉱山の守り神で、製錬の神・金山彦命を祀り、全国一の規模の山神社とされています。今の建物は文政2年に再建されたものです。境内までは急な石段が続くので、足元に気をつけましょう。" + PRAY }),
  cre("清水寺", { h: 11, m: 15, stay: 25, legs: [walk(25)], lat: 35.1049642, lng: 132.4369639, address: "島根県大田市大森町",
    memo: "佐毘売山神社から坂を下り、歩いて約25分。推古天皇の時代の創建と伝わる真言宗の古刹で、銀山の開発にかかわった領主や代官たちに信仰されました。徳川家康から授けられたという胴服は国の重要文化財で、本堂の格天井には、銀山奉行・大久保長安の家紋が描かれています。" + PRAY }),
  cre("下河原吹屋跡", { h: 11, m: 55, stay: 15, legs: [walk(15)], lat: 35.1101644, lng: 132.4395145, address: "島根県大田市大森町",
    memo: "清水寺から歩いて約15分。発掘調査で初めて見つかった、江戸時代のはじめ、17世紀初めの銀の精錬の跡です。ここでは鉛を使う「灰吹法」という方法で、鉱石から銀を取り出していました。" }),
  upd(MACHINAMI, { h: 12, m: 30, stay: 60, legs: [walk(20)], lat: 35.1206869, lng: 132.4475384, address: "島根県大田市大森町",
    memo: "吹屋跡から町の中を北へ歩いて約20分。石見銀山を治める代官所が置かれ、役人や商人の屋敷が並んだ大森の町並みで、赤い石州瓦の家々が連なります。代官所跡の近くには、川の音を聞きながら食事のできる店もあるので、このあたりで昼食にしましょう。町並みには今も人が暮らしているので、静かに歩きましょう。" }),
  cre("栄泉寺", { h: 13, m: 40, stay: 20, legs: [walk(10)], lat: 35.1160189, lng: 132.4453511, address: "島根県大田市大森町",
    memo: "町並みを南へ歩いて約10分。代官・井戸平左衛門が、旅の僧からさつま芋のことを聞いたといわれる曹洞宗の寺です。朱塗りの山門は「竜宮門」とも呼ばれ、この地方では珍しい形の門です。" + PRAY }),
  cre("観世音寺", { h: 14, m: 10, stay: 30, legs: [walk(10)], lat: 35.1189922, lng: 132.4461663, address: "島根県大田市大森町",
    memo: "栄泉寺から歩いて約10分。岩山の上に建つ真言宗の寺で、江戸時代には大森代官所が銀山の繁栄を祈る祈願寺でした。寛政の大火で建物はすべて焼け、今の本堂や山門は万延元年に再建されたものです。岩盤を刻んだ石段を上ると、境内の一角から石州瓦の家並みを見渡せます。石段は急なので、足元に気をつけましょう。" + PRAY }),
  cre("井戸神社", { h: 14, m: 55, stay: 25, legs: [walk(15)], lat: 35.1199627, lng: 132.4481186, address: "島根県大田市大森町",
    memo: "観世音寺から歩いて約15分。享保の大飢饉のとき、さつまいもを石見に取り入れて広め、領民を救ったとされる代官・井戸平左衛門を祀る神社で、領民から「いも代官」と慕われました。拝殿には、勝海舟の筆による額が掲げられています。" + PRAY }),
  cre("石見銀山資料館", { h: 15, m: 25, stay: 65, legs: [walk(5)], lat: 35.122164, lng: 132.448042, address: "島根県大田市大森町ハ51-1",
    memo: "井戸神社から歩いて約5分。石見銀山を治めた代官所の跡にあり、明治の郡役所の建物を使った資料館です。採掘の道具や古文書、鉱石、絵巻などから、当時の銀山の様子を学べます。江戸時代に再建された門長屋も残ります。休館日と入館できる時間は公式の案内で確かめましょう。帰りは、近くの大森代官所跡のバス停から路線バスで大田市駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [MACHINAMI, RYUGENJI].join()) throw new Error("構成が想定と違います");
  const photo = it.days[0].spots[0].photos.find((p) => p.id === WRONG_PHOTO);
  if (!photo) throw new Error("写真が想定と違います");
  const clearCover = it.thumbnailUrl === photo.url;
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${nm} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}\n外す写真: ${WRONG_PHOTO}（表紙${clearCover ? "も空にする" : "はこの写真ではない"}）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, ...(clearCover ? { thumbnailUrl: null } : {}) } });
      await tx.photo.delete({ where: { id: WRONG_PHOTO } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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

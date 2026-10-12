/**
 * #129 cc984fa1の直し(6回目)。企画運営(2026-10-11)の指摘: 「近くに行き
 * 先が足りない」は決まりの例外にならないため、午後に#10・#218・#232と
 * 重ならない実在の行き先を追加する。候補のうち、英賀神社(姫路市飾磨区)・
 * 斑鳩寺(太子町)を、書写山から姫路駅を経由して南へ向かう順で追加。
 *
 * 座標(OSM):
 * - 英賀神社: 34.8061789, 134.6398458(osm way 255738988)
 * - 斑鳩寺: 34.8374614, 134.5756117(osm way 253639530)
 *
 * 出典:
 * - 英賀神社: 日本三代実録に記載の古社、英賀彦神・英賀姫神(播磨国を
 *   開拓した夫婦神)、播磨風土記にも記載。英賀城(播磨三大城の一つ、
 *   天正8年/1580年に羽柴秀吉の攻めで焼失)の跡地でもある
 *   (tabi-mag.jp/hg0382/ほかで確認)。
 * - 斑鳩寺: 推古天皇の時代、聖徳太子にゆかりがあると伝えられる古刹。
 *   三重塔は永禄8年(1565)、赤松政秀の建立で、天文10年(1541)の火災を
 *   免れた建物。国の重要文化財(tabi-mag.jp/hg0399/で確認)。拝観時間・
 *   拝観料は公式で確かめられなかったため、本文で「お出かけ前に確かめる」
 *   旨を明記。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAIZANDO_END_FROM = "参拝を終えたら、参道を戻ってロープウェイで下山し、バスで姫路駅へ戻りましょう。";
const KAIZANDO_END_TO =
  "参拝を終えたら、参道を戻ってロープウェイで下山し、バスでおよそ70分、姫路駅を経由して英賀神社へ向かいましょう。";

const AGA_MEMO =
  "書写山から姫路駅を経由してバスでおよそ70分、英賀神社に着きます。平安時代編さんの『日本三代実録』にも記載される古社で、播磨国を切り開いたと伝えられる夫婦神・英賀彦神と英賀姫神を祭神としています。「英賀」という地名自体、この二柱の神の名にちなむとされ、奈良時代の『播磨国風土記』にも登場します。このあたりは、別所氏の三木城・小寺氏の御着城と並び播磨三大城の一つに数えられた英賀城の跡地でもあり、天正8年(1580)、羽柴秀吉の攻めによって落城しました。戦国時代の港町として栄えた英賀の歴史に思いを馳せながら、敬意を持ってお参りしましょう。この後は、車でおよそ20分、斑鳩寺へ向かいましょう。";

const IKARUGA_MEMO =
  "英賀神社から車でおよそ20分、斑鳩寺に着きます。推古天皇の時代、聖徳太子が播磨の地に水田を与えられたことにちなんで開かれたと伝えられる天台宗の古刹で、法隆寺(斑鳩寺)とのゆかりが深いことから、同じ「斑鳩寺」の名で呼ばれています。境内に立つ三重塔は永禄8年(1565)、赤松政秀によって建てられたもので、天文10年(1541)の火災を免れた貴重な建物として、国の重要文化財に指定されています。本堂や三重塔をめぐりながら、聖徳太子ゆかりの古刹のたたずまいを楽しみましょう。拝観時間や行事による参拝の制限があることもあるので、お出かけ前に公式で確かめましょう。参拝を終えたら、車でおよそ25分、姫路駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;

  const ropeway = await findSpotInItinerary(itinId, { spotName: "書寫山ロープウェイ" });
  const niomon = await findSpotInItinerary(itinId, { spotName: "仁王門" });
  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });

  if (!kaizando.memo?.includes(KAIZANDO_END_FROM)) throw new Error("開山堂の文言が想定外です");

  console.log("確認OK。dayId:", ropeway.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const items: SpotOrderItem[] = [
    { id: ropeway.id, data: {} },
    { id: niomon.id, data: {} },
    { id: maniden.id, data: {} },
    { id: sannodo.id, data: {} },
    { id: kaizando.id, data: { memo: kaizando.memo!.replace(KAIZANDO_END_FROM, KAIZANDO_END_TO) } },
    {
      create: {
        name: "英賀神社",
        memo: AGA_MEMO,
        lat: 34.8061789,
        lng: 134.6398458,
        visitTime: t(14, 0),
        stayDurationMin: 40,
      },
    },
    {
      create: {
        name: "斑鳩寺",
        memo: IKARUGA_MEMO,
        lat: 34.8374614,
        lng: 134.5756117,
        visitTime: t(15, 0),
        stayDurationMin: 90,
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
      },
    },
  ];
  await setDaySpotOrder(ropeway.dayId, items, {});

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

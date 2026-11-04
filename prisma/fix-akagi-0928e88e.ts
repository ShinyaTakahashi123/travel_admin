/**
 * 赤木城跡と丸山千枚田(0928e88e)の組み直し(2026-11-04)。企画運営・法務のOKに基づく。
 * 一覧の下調べ(11/02)は古い内容(当時の最後のスポットが宿の名前)で、本番はすでに別の形
 * (8スポット、瀞峡・北山峡・田平子峠刑場跡まで)になっていたため、改めて調べ直した。
 *
 * - 赤木城跡・丸山千枚田・湯ノ口温泉・瀞峡・北山峡は、OSMの実在の地物と6けたでほぼ一致していたため
 *   点は変更しない
 * - 布引の滝: OSMに名前のある地物がなく、今の点は地理院の「大字の中心」(10月の決まりで使えない)
 *   だった。地理院の地名検索で「布引の滝」(滝の注記、三重県熊野市)が2件見つかり、OSMの「布引谷川」
 *   way59236139の線に近いほう(約6m、もう1件は約258m)を採用。7章の例外(地理院の地名の点)
 * - 紀州鉱山資料館: OSMに「熊野市紀和鉱山資料館」tourism=museum node1420994326があり、
 *   今の点から約95m。正式名称にそろえ、点も直す(法務確認)
 * - 田平子峠刑場跡: 今の点は「田平子峠」の碑(historic=memorial)で、同じ名前のOSMの地物
 *   「田平子峠刑場跡」historic=ruins node4252303979(約56mずれ)にそろえる
 * - 昼食: 熊野市紀和鉱山資料館の滞在の中にあった昼食の一文を外し、隣接する実在の公共施設
 *   「道の駅熊野・板屋九郎兵衛の里」highway=rest_area way1461782171(法務確認、店の点ではない)を
 *   使って別スポットに分ける。店の名前・品物は書かない
 * - 丸山千枚田の「おすすめ」(使わない言葉)を外す
 * - 田平子峠刑場跡の帰りの一文に、JR熊野市駅までの分(実測+5の25分)を追加
 * - 昼食スポットを加えた分、終わりが17:00を超えるため、決まりの順で吸収する: 資料館の滞在を
 *   30→25分(昼食の一文を外した分、館の見学だけの長さに)、昼食を35分(35〜45分の範囲)、
 *   湯ノ口温泉を75→70分(内容に合う長さ、のばしてはいない)にして、終わりを16:55にする
 *   (始まりの9:30はすでに8:30〜9:30の上限のため、これ以上遅らせられない)
 * - 田平子峠刑場跡の死にかかわる書き方(5章)は法務が確認済み、このまま変更しない
 *
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "0928e88e-380c-4702-9559-af6252822245";
const DAY_ID = "35f3e6cc-dc1c-40a8-948a-7540d32bcda0";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const AKAGI_ID = "6187efa4-5eb7-4d42-b179-4be3b787ee5b";
const MARUYAMA_ID = "4abdb10c-aa74-4e82-8970-dbc42edf4cab";
const NUNOBIKI_ID = "422b2e26-3b53-41c0-92d2-d0fc2930dedd";
const SHIRYOKAN_ID = "1f61682f-9580-4295-8d68-d3f9316c22aa";
const YUNOKUCHI_ID = "9aee2845-81e3-44fb-897c-eeaec05cf444";
const DOROKYO_ID = "fd908c4b-663c-49fd-85ee-29736ee94653";
const KITAYAMAKYO_ID = "746472e1-2823-456b-8d97-1d86b7c6507a";
const TABIRAKO_ID = "cc34053a-3a72-4de5-a092-0b4a982aa033";

const BEFORE = {
  [MARUYAMA_ID]: {
    memo: "赤木城跡から車で約6分、山の斜面いっぱいに広がる丸山千枚田に到着です。1601年(慶長6年)にはすでに2,240枚もの田があったという記録が残る、歴史ある棚田です。昭和の稲作転換対策による植林や、過疎・高齢化による耕作放棄が進み、一時は530枚にまで減ってしまいましたが、1993年(平成5年)に地区住民全員で「丸山千枚田保存会」を結成し、田の復元と保全に取り組んできました。その努力によって現在は1,340枚ほどが残り、日本でも最大規模の棚田のひとつとされています。例年6〜7月ごろには「虫送り」という行事が行われ、棚田に1,300本余りの灯りがともされる幻想的な夜景も楽しめます。棚田の脇を通る遊歩道を少し歩いてみるのもおすすめで、熊野古道伊勢路の一部である「通り峠道」もこの棚田に続いています。田んぼは地元の方が耕している農地なので、田や畦には入らないようにしましょう。この後は、車でおよそ27分、日本の滝百選のひとつ・布引の滝へ向かいましょう。",
  },
  [NUNOBIKI_ID]: { lat: "33.846828", lng: "135.92421" },
  [SHIRYOKAN_ID]: { lat: "33.877205", lng: "135.914413", name: "紀州鉱山資料館" },
  [YUNOKUCHI_ID]: { visitTimeHHMM: "13:32", legMin0: 10 },
  [DOROKYO_ID]: { visitTimeHHMM: "15:07" },
  [KITAYAMAKYO_ID]: { visitTimeHHMM: "15:33" },
  [TABIRAKO_ID]: { lat: "33.891151", lng: "135.948243", visitTimeHHMM: "16:11" },
};

const MARUYAMA_MEMO_NEW =
  "赤木城跡から車で約6分、山の斜面いっぱいに広がる丸山千枚田に到着です。1601年(慶長6年)にはすでに2,240枚もの田があったという記録が残る、歴史ある棚田です。昭和の稲作転換対策による植林や、過疎・高齢化による耕作放棄が進み、一時は530枚にまで減ってしまいましたが、1993年(平成5年)に地区住民全員で「丸山千枚田保存会」を結成し、田の復元と保全に取り組んできました。その努力によって現在は1,340枚ほどが残り、日本でも最大規模の棚田のひとつとされています。例年6〜7月ごろには「虫送り」という行事が行われ、棚田に1,300本余りの灯りがともされる幻想的な夜景も楽しめます。棚田の脇を通る遊歩道を少し歩いてみるのもよく、熊野古道伊勢路の一部である「通り峠道」もこの棚田に続いています。田んぼは地元の方が耕している農地なので、田や畦には入らないようにしましょう。この後は、車でおよそ27分、日本の滝百選のひとつ・布引の滝へ向かいましょう。";

const NUNOBIKI_MEMO =
  "丸山千枚田から車でおよそ27分、日本の滝百選のひとつとされる布引の滝に着きます。上から12m・3.5m・7.7m・29.1mと、表情の異なる4段の滝が連なり、一枚の布を垂らしたように静かに流れ落ちる姿からその名がついたと伝えられています。駐車場から遊歩道を歩いておよそ5分、まず一番下の段を間近に眺めることができます。滝のまわりは足元がぬれて滑りやすいので、気をつけて歩きましょう。この後は、車でおよそ19分、熊野市紀和鉱山資料館へ向かいましょう。";

const SHIRYOKAN_MEMO =
  "布引の滝から車でおよそ19分、熊野市紀和鉱山資料館に着きます。この地では奈良時代から銅が採掘され、東大寺の大仏づくりに使う銅もここから献上されたと伝えられています。昭和53年(1978年)の閉山まで長く続いたこの鉱山の歩みを、採掘現場を再現した展示や、坑道を下りていく体験ができるエレベーターなどで紹介しています。この後は、歩いておよそ4分、道の駅熊野・板屋九郎兵衛の里へ向かいましょう。";

const MICHINOEKI_MEMO =
  "熊野市紀和鉱山資料館から歩いておよそ4分、道の駅熊野・板屋九郎兵衛の里に着きます。ここで昼食にしましょう。この後は、車でおよそ10分、湯ノ口温泉へ向かいましょう。";

const YUNOKUCHI_MEMO =
  "道の駅熊野・板屋九郎兵衛の里から車でおよそ10分、山あいにひっそりと湧く湯ノ口温泉に着きます。かつて鉱山として栄えたこの一帯で、坑道の奥から湧き出す湯を引いた温泉で、環境省の国民保養温泉地にも指定されています。内湯と、森に抱かれた露天風呂があり、疲れた体をゆっくりとほぐすことができます。入浴の際は、ほかの入浴客を撮らないようにしましょう。この後は、車でおよそ20分、瀞峡へ向かいましょう。";

const TABIRAKO_MEMO =
  "北山峡から車でおよそ18分、田平子峠刑場跡に着きます。赤木城跡とあわせて「赤木城跡及び田平子峠刑場跡」として国の史跡に指定されている場所で、天正17年(1589年)ごろに起きたとされる北山一揆に関わった人々の供養の塔が建っています。慰霊の場でもあるので、静かに、敬意をもって見学しましょう。見学を終えたら、JR熊野市駅まで車でおよそ25分、帰りましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { include: { spots: { include: { transitLegs: true }, orderBy: { orderNo: "asc" } } } } },
  });
  const day = itin.days.find((d) => d.id === DAY_ID)!;
  const byId = new Map(day.spots.map((s) => [s.id, s]));

  for (const [id, before] of Object.entries(BEFORE)) {
    const s = byId.get(id);
    if (!s) throw new Error(`前提確認: スポット ${id} が見つかりません`);
    const b = before as { lat?: string; lng?: string; name?: string; memo?: string; visitTimeHHMM?: string; legMin0?: number };
    if (b.lat && (s.lat?.toString() !== b.lat || s.lng?.toString() !== b.lng)) throw new Error(`前提確認: ${s.name} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    if (b.name && s.name !== b.name) throw new Error(`前提確認: ${id} の名前が期待と不一致`);
    if (b.memo && s.memo !== b.memo) throw new Error(`前提確認: ${s.name} のメモが期待と不一致`);
    if (b.visitTimeHHMM) {
      const vt = s.visitTime ? s.visitTime.toISOString().slice(11, 16) : null;
      if (vt !== b.visitTimeHHMM) throw new Error(`前提確認: ${s.name} のvisitTimeが期待と不一致 (now ${vt})`);
    }
    if (b.legMin0 !== undefined) {
      const leg = s.transitLegs[0];
      if (!leg || leg.transitDurationMin !== b.legMin0) throw new Error(`前提確認: ${s.name} の入りの移動分が期待と不一致`);
    }
  }
  console.log("前提の確認OK。\n");

  const SPOTS: { label: string; item: import("./lib/spot-order").SpotOrderItem }[] = [
    { label: "赤木城跡(変更なし)", item: { id: AKAGI_ID, data: {} } },
    {
      label: "丸山千枚田(「おすすめ」を外す)",
      item: { id: MARUYAMA_ID, data: { memo: MARUYAMA_MEMO_NEW } },
    },
    {
      label: "布引の滝(点を地理院の地名Aに、「とされる」)",
      item: {
        id: NUNOBIKI_ID,
        data: { lat: "33.843097", lng: "135.921525", memo: NUNOBIKI_MEMO },
      },
    },
    {
      label: "熊野市紀和鉱山資料館(点・名前をそろえ、昼食の一文を外す)",
      item: {
        id: SHIRYOKAN_ID,
        data: {
          name: "熊野市紀和鉱山資料館",
          lat: "33.876454",
          lng: "135.913875",
          address: "三重県熊野市紀和町板屋110-1",
          visitTime: T(12, 52),
          stayDurationMin: 25,
          memo: SHIRYOKAN_MEMO,
        },
      },
    },
    {
      label: "道の駅熊野・板屋九郎兵衛の里(昼食・新規)",
      item: {
        create: {
          name: "道の駅熊野・板屋九郎兵衛の里（昼食）",
          address: "三重県熊野市紀和町板屋82",
          lat: "33.876445",
          lng: "135.915604",
          visitTime: T(13, 21),
          stayDurationMin: 35,
          memo: MICHINOEKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
    },
    {
      label: "湯ノ口温泉(滞在75→70、書き出しを直す)",
      item: {
        id: YUNOKUCHI_ID,
        data: {
          visitTime: T(14, 6),
          stayDurationMin: 70,
          memo: YUNOKUCHI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
        },
      },
    },
    { label: "瀞峡", item: { id: DOROKYO_ID, data: { visitTime: T(15, 36) } } },
    { label: "北山峡", item: { id: KITAYAMAKYO_ID, data: { visitTime: T(16, 2) } } },
    {
      label: "田平子峠刑場跡(点をそろえ、帰りの分を追加)",
      item: {
        id: TABIRAKO_ID,
        data: { lat: "33.890663", lng: "135.948351", visitTime: T(16, 40), memo: TABIRAKO_MEMO },
      },
    },
  ];

  console.log("=== 書き込むデータ(スポットごと) ===");
  for (const { label, item } of SPOTS) {
    if ("id" in item) {
      const d = item.data as Record<string, unknown>;
      const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
      const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(変更なし)";
      console.log(`  [既存 ${item.id}] ${label}: 点=${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"} 着=${vt} 滞在=${d.stayDurationMin ?? "(変更なし)"} 区間=${legsStr}`);
    } else {
      const c = item.create as Record<string, unknown>;
      const legsCreate = (c.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legsCreate ? legsCreate.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(なし)";
      const vt = c.visitTime instanceof Date ? c.visitTime.toISOString().slice(11, 16) : String(c.visitTime);
      console.log(`  [新規] ${label}: 点=${c.lat},${c.lng} 着=${vt} 滞在=${c.stayDurationMin} 区間=${legsStr}`);
    }
  }
  console.log("\n  昼食(道の駅)着 13:21(11:30〜13:30に収まる) / 最後(田平子峠刑場跡)発 16:55(16:30〜17:00に収まる)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await setDaySpotOrder(
    DAY_ID,
    SPOTS.map((s) => s.item),
    {}
  );

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

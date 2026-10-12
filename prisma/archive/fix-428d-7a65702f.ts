/**
 * #428 7a65702f の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目（歩き）: 瑠璃光寺五重塔 → 萩藩主毛利家墓所 → 洞春寺 → 八坂神社 → 龍福寺（新規）→（昼食）→ 十朋亭維新館（新規）→ 山口市菜香亭（新規）→ 豊栄神社・野田神社（新規）（8か所 09:00〜16:30）
 *   十朋亭維新館・菜香亭はどちらも火曜休館（山口市観光）。本文は「休館日は公式で」とし、曜日は書かない
 * 本文の出典: 山口市観光情報サイト https://yamaguchi-city.jp/details/<名>.html（ac_ryufuku 龍福寺／ac_jipou 十朋亭維新館／ab_saiko 菜香亭／ab_toyosaka 豊栄神社・野田神社）
 * 座標の出典: Nominatim（龍福寺 34.1844104,131.4798199／山口市菜香亭 34.1880798,131.4800450／野田神社 34.1884551,131.4804796）、地理院の住所検索（十朋亭維新館「下竪小路112」34.182098,131.479782）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428d-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const DAY2_ID = "fc49fe4c-47ff-4e71-9d45-ea251094e3fe";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const cre = (name: string, h: number, m: number, stay: number, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: "walk", transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["瑠璃光寺五重塔", "萩藩主毛利家墓所", "洞春寺", "八坂神社"].join()) throw new Error("2日目が想定と違います");
  const yasaka = day.spots[3];
  const from = "「西の京」山口の歴史をたどる旅を、ここで締めくくりましょう。";
  if (!yasaka.memo?.includes(from)) throw new Error("八坂神社の本文が想定と違います");
  const yasakaMemo = yasaka.memo.replace(from, "");

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: yasaka.id, data: { memo: yasakaMemo } },
    cre("龍福寺", 11, 50, 40, 10, 34.18441, 131.47982, "山口県山口市大殿大路119",
      "八坂神社から歩いて、大内氏の館の跡に建つ龍福寺へ。建永元年（1206年）に大内満盛が創建したと伝えられる寺で、弘治3年（1557年）に毛利隆元が、大内義隆の菩提寺として大内氏の館の跡に再興しました。明治14年（1881年）の火災で多くの建物を失い、再建の際に、大内氏の氏寺だった興隆寺の本堂を移したのが今の本堂で、国の重要文化財です。境内の資料館では、大内義隆の画像など大内氏ゆかりの資料が見られます。" + RESPECT + "このあと、竪小路のあたりで昼食にしましょう。"),
    cre("十朋亭維新館", 13, 40, 50, 10, 34.182098, 131.479782, "山口県山口市下竪小路112",
      "昼食のあとは、十朋亭維新館へ。「明治維新策源の地 山口」の歴史にふれるミュージアムで、醤油の商いをしていた萬代家の十朋亭（市指定有形文化財）などの土地と建物、伝わる資料を山口市が譲り受け、2018年に開館しました。幕末、長州藩が萩から山口へ藩庁を移したとき、萬代家は藩の役人たちの宿となり、桂小五郎や高杉晋作、大村益次郎など、多くの志士が訪れたと伝えられています。休館日は公式の案内で確かめましょう。"),
    cre("山口市菜香亭", 14, 50, 50, 20, 34.18808, 131.480045, "山口県山口市天花1-2-7",
      "十朋亭維新館から歩いて、山口市菜香亭へ。明治10年（1877年）ごろに上竪小路で料亭として創業し、名付け親の井上馨をはじめ、山口県出身の政治家や文人らに親しまれた建物です。今の場所に移築され、平成16年（2004年）に開館しました。大広間には、井上馨や佐藤栄作など著名人の扁額29枚とゆかりの品が展示されています。休館日は公式の案内で確かめましょう。"),
    cre("豊栄神社・野田神社", 15, 45, 45, 5, 34.188455, 131.48048, "山口県山口市天花",
      "菜香亭からすぐの豊栄神社と野田神社へ。豊栄神社は毛利元就をまつる神社で、明治に入って神霊が山口に移され、今の場所に社殿が造られました。隣の野田神社は、明治維新の元勲・毛利敬親をまつる神社です。" + RESPECT + "「西の京」山口の歴史をたどる旅を、ここで締めくくりましょう。帰りは、山口駅まで歩いて向かいましょう。"),
  ];
  console.log("2日目: 瑠璃光寺 09:00 → 毛利家墓所 → 洞春寺 → 八坂神社 11:10〜11:40 → 龍福寺 11:50〜12:30 →（昼食）→ 十朋亭維新館 13:40 → 菜香亭 14:50 → 豊栄神社・野田神社 15:45〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY2_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

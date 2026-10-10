/**
 * チェックリスト #427 76211b51「五大堂と瑞巌寺、日本三景・松島の定番社寺めぐり日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 雄島（新規）→ 瑞巌寺 → 円通院 → 観瀾亭（新規）→（昼食）→ 松島島巡り観光船（新規）→ 五大堂 → 福浦島（新規）（7か所 09:00〜16:30）
 * 瑞巌寺は月によって閉門が早い（1月は15時30分）ので午前に、円通院（拝観 9:00〜16:00）も午前にする
 * 既存の3か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 瑞巌寺「天長5年（828）」→ 公式は「9世紀初頭、慈覚大師円仁が開いた天台宗延福寺が前身」。杉並木の伐採の話は開いた公式で確かめられないので外す
 *   - 円通院「フィレンツェを象徴する水仙」「小堀遠州の作と伝わる庭園」、五大堂「すかし橋は気を引き締めるため」は確かめられないので外す
 * 写真: 五大堂・瑞巌寺の写真は合っているので残す（円通院は写真なし）
 * 本文の出典: 松島観光協会 https://www.matsushima-kanko.com/miru/detail.php?id=N（瑞巌寺 140／五大堂 141／雄島 142／円通院 143／観瀾亭 144）、
 *   瑞巌寺の拝観時間 https://www.zuiganji.or.jp/guide/ ／松島島巡り観光船 https://www.matsushima.or.jp/course/ ／福浦島 https://www.matsushima.or.jp/charm/tourism_spot.html
 * 座標の出典: Nominatim（雄島 38.3652752,141.0626310／瑞巌寺 38.3721758,141.0595579／円通院 38.3712885,141.0599598／観瀾亭 38.3693514,141.0616991／
 *   松島島巡り観光船 38.3701325,141.0655615／五大堂 38.3697244,141.0642082／福浦島 38.3670646,141.0712510）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-427-76211b51.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "76211b51-1237-4329-beae-90dd8796b2e3";
const DAY1_ID = "d331f4a9-45d3-476a-ae8b-19c13c51e1df";
const GODAIDO = "8b32ab01-9149-453a-8947-68abc126056f";
const ZUIGANJI = "547f0242-0e73-45da-bc1f-bda962e0fcea";
const ENTSUIN = "8322aa43-02ae-4e2a-b982-7b951346ec80";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "日本三景の一つ・松島で、伊達家ゆかりの瑞巌寺と円通院、藩主の月見の亭だった観瀾亭をめぐり、午後は遊覧船で湾内の島々へ。松島のシンボル・五大堂、霊場の雄島、朱塗りの橋で渡る福浦島も歩く、松島の定番の社寺と島めぐりの日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("雄島", 9, 0, 40, null, null, 38.365275, 141.062631, "宮城県宮城郡松島町松島浪打浜",
    "旅の始まりは雄島へ。朱塗りの渡月橋を渡ってたどり着く島で、108の岩窟があったといわれ、今も50ほどが残っています。岩窟の中には五輪塔や、壁に法名が彫られたものが多く、死者の浄土往生を願った石の塔婆・板碑も見られます。中世の松島は「奥州の高野」と呼ばれる死者供養の霊場でした。島の奥には、見仏上人が12年にわたって修行したと伝わる見仏堂の跡があります。" + RESPECT),
  upd(ZUIGANJI, 9, 50, 70, "walk", 10, 38.372176, 141.059558,
    "雄島から歩いて約10分。正式名称を「松島青龍山瑞巌円福禅寺」という、臨済宗妙心寺派の禅寺です。9世紀のはじめに慈覚大師円仁が開いた天台宗の延福寺が前身と伝えられ、13世紀中ごろには北条時頼が法身性西禅師を開山に迎えて臨済宗に改め、寺名を円福寺としました。関ヶ原の戦いのあと仙台に治府を定めた伊達政宗は、衰えていた円福寺の復興に力を注ぎ、紀州熊野に用材を求め、畿内から名工130名を招いて、慶長14年（1609年）に5年の歳月をかけた工事を終えました。以後、江戸時代を通じて伊達家の菩提寺となりました。本堂は国宝に指定されています。拝観の時間は月によって違うので、公式の案内で確かめましょう。" + RESPECT),
  upd(ENTSUIN, 11, 5, 45, "walk", 5, 38.371289, 141.05996,
    "瑞巌寺の西隣。仙台藩2代藩主・伊達忠宗の次男・光宗の霊廟です。正保2年（1645年）に19歳の若さで亡くなった光宗を悼んで忠宗が開き、霊屋「三慧殿」は正保4年（1647年）に完成しました。支倉常長がヨーロッパから伝えた西洋文化の影響が強く、厨子の扉の内側には日本最古といわれる西洋バラが描かれています。「バラ寺」の愛称は、のちの住職が院内に色とりどりのバラを植えて開放したことにちなみます。" + RESPECT),
  cre("観瀾亭", 11, 55, 30, "walk", 5, 38.369351, 141.061699, "宮城県宮城郡松島町松島字町内",
    "円通院から歩いてすぐ、海沿いに建つ観瀾亭へ。「観瀾」とは、さざ波を観るという意味です。もとは豊臣秀吉の伏見桃山城にあった茶室を伊達政宗がもらい受けて江戸の藩邸に移し、2代藩主・忠宗が「1本1石も変えぬように」と命じて、海路でここに移したと伝えられています。藩主の姫君の松島遊覧や、幕府の巡見使の宿泊・接待に使われた「御仮屋」の一部が残る建物で、県の有形文化財です。床の間の張付絵や襖絵は仙台藩の絵師・佐久間修理の作で、国の重要文化財に指定されています。このあと、松島海岸のあたりで昼食にしましょう。"),
  cre("松島島巡り観光船（仁王丸コース）", 13, 30, 60, "walk", 5, 38.370133, 141.065562, "宮城県宮城郡松島町松島字町内85",
    "昼食のあとは、遊覧船で松島湾の島々をめぐりましょう。松島島巡り観光船の「仁王丸コース」は、全長約17kmのコースを約50分で周遊し、雄島や双子島、千貫島、かぶと島など、陸からは見られない島々の風景や、人が住む島々を案内してくれます。出航の時間は公式の時刻表で確かめましょう。"),
  upd(GODAIDO, 14, 40, 30, "walk", 5, 38.369724, 141.064208,
    "遊覧船を降りたら、松島のシンボル・五大堂へ。大同年中（807〜809年）に坂上田村麻呂が東征のときに毘沙門堂を建て、のちに慈覚大師円仁が五大明王像を安置したことから、五大堂と呼ばれるようになりました。今の建物は伊達政宗が慶長9年（1604年）に再建したもので、東北地方に現存する最古の桃山建築とされ、国の重要文化財です。堂の四面の蟇股には、方位に合わせて十二支の彫刻が施されています。秘仏の五大明王像は、33年に一度ご開帳されています。御堂へ渡る橋では足元に気をつけましょう。" + RESPECT),
  cre("福浦島", 15, 25, 65, "walk", 15, 38.367065, 141.071251, "宮城県宮城郡松島町松島福浦島",
    "五大堂から歩いて約15分。朱塗りの橋（出会い橋）で知られる福浦島は、海の上を歩いて渡る島で、自然公園になっています。島の中からしか眺められない島々や、めずらしい木々もあり、島を一周するのに約45分ほどかかります。松島湾の景色を眺めながら、旅を締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [GODAIDO, ZUIGANJI, ENTSUIN].join()) throw new Error("構成が想定と違います");
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

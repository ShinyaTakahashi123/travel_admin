/**
 * #203 a71cf39b「松山城、現存12天守の一つを望む定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 松山城 1か所 09:30〜11:00 で、行き方・昼食の一言がなく、本文はツアーガイドの話し方（「皆様」「ご覧ください」）
 * 路面電車と歩き: JR松山駅前から路面電車で大街道へ → 松山城 9:00 → 二之丸史跡庭園 → 萬翠荘 → 大街道（昼食）→ 坂の上の雲ミュージアム →（路面電車）子規記念博物館 → 伊佐爾波神社 16:40
 *   → 道後温泉駅から路面電車でJR松山駅へ。ほかのしおり（#495 など）の文は使わず、公式の出典から書いた
 * 本文の出典: 松山城 https://www.matsuyamajo.jp/discover/history.html （1602年・加藤嘉明・寛永4年に転封・蒲生氏・松平定行・天明4年元旦に落雷・文政3年から35年をかけ安政元年(1854)に落成）・
 *   https://www.matsuyamajo.jp/discover/tenshu.html （連立式・中庭・三重三階地下一階・黒船来航の翌年に落成した江戸時代最後の完全な城郭建築・瓦の葵の御紋・最上階から360度）／
 *   二之丸史跡庭園 https://www.matsuyamajo.jp/ninomaru/ （表御殿跡・奥御殿跡・柑橘と草花で部屋の間取りを表す・大井戸遺構の露出展示）／
 *   萬翠荘 https://www.bansuisou.org/ （大正11年・久松定謨伯爵の別邸・フランス生活が長く純フランス風・社交の場・国の重要文化財）／
 *   大街道 https://www.mcvb.jp/kankou/detail1.php?sid=164&cid=1 （検索結果の要約: 長さ483mのアーケード・飲食店）／
 *   坂の上の雲ミュージアム https://www.sakanouenokumomuseum.jp/about/construction/ （安藤忠雄・地下1階地上4階・各階がひとつづきのスロープ・空に向かって5度広がった逆三角錐）・
 *     https://www.sakanouenokumomuseum.jp/about/actionplan/ （2007年開館・まち全体を「屋根のない博物館」とする構想の中核）／
 *   子規記念博物館 https://shiki-museum.com/aboutus/overview.php （正岡子規の世界をとおして松山や文学に親しむ文学系の博物館・道後公園・2階と3階が展示室）／
 *   伊佐爾波神社 https://www.pref.ehime.jp/ehimenotakara/12.html （延喜式内社・寛文7年(1667)に松平定長が造営・八幡造・国の重要文化財）・https://www.mcvb.jp/kankou/detail1.php?sid=71&cid=1 （流鏑馬の成就のお礼・日本三大八幡造りの一つ・二十二面の和算額）
 * 開く時間（本文には書かない）: 坂の上の雲ミュージアム 9:00〜18:30 原則月曜休／萬翠荘・子規記念博物館の休館日は公式で
 * 座標: #495（e9a900e3、法✅企✅）と同じ点（松山城・二之丸史跡庭園・萬翠荘・大街道・坂の上の雲ミュージアム・子規記念博物館・伊佐爾波神社）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-203-a71cf39b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a71cf39b-efb6-4338-a893-72c3ca0f9df2";
const DAY_ID = "f28cbea4-eb15-4ad0-8474-38dc69fce91f";
const MATSUYAMAJO = "7bd656c7-b27a-446d-85bd-e02edd3b2899";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION =
  "JR松山駅前から路面電車で大街道へ出て、ロープウェイで上る松山城から始める日帰りプランです。二之丸史跡庭園とフランス風の洋館・萬翠荘をめぐり、大街道で昼食。午後は坂の上の雲ミュージアムから路面電車で道後へ向かい、子規記念博物館と伊佐爾波神社をたずねます。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  { id: MATSUYAMAJO, data: data({ h: 9, m: 0, stay: 100, mode: null, min: null, lat: 33.845651, lng: 132.765746, address: "愛媛県松山市丸之内1",
    memo: "この旅は路面電車と歩きでめぐります。JR松山駅前から路面電車で大街道へ向かい、ロープウェイかリフトで城山を上ります。松山城は、関ヶ原の戦いの功で20万石の大名となった加藤嘉明が、慶長7年（1602年）に築き始めた城です。天守は天明4年（1784年）の元旦に落雷で焼け、文政3年（1820年）から35年をかけて、安政元年（1854年）に再び完成しました。黒船来航の翌年に落成した、江戸時代最後の完全な城郭建築とされ、天守・小天守・櫓を渡櫓でつないで中庭を囲む「連立式」の構えが見どころです。最上階からは松山の市街を360度見渡せます。天守の中の階段は急なので、足元に気をつけましょう。" }) },
  cre("二之丸史跡庭園", { h: 11, m: 0, stay: 35, mode: "walk", min: 20, lat: 33.842727, lng: 132.764423, address: "愛媛県松山市丸之内",
    memo: "ロープウェイで下り、城山の南西のふもとへ歩いて約20分。藩の政治の中心だった表御殿と、藩主の家族が暮らした奥御殿の跡を庭園として整えた場所で、表御殿の跡では、いろいろな柑橘や草花を植えて昔の部屋の間取りを表しています。発掘で見つかった大きな井戸の遺構も、そのままの姿で見られます。" }),
  cre("萬翠荘", { h: 11, m: 50, stay: 35, mode: "walk", min: 15, lat: 33.842466, lng: 132.768202, address: "愛媛県松山市一番町3丁目3-7",
    memo: "庭園から歩いて約15分。旧松山藩主の子孫・久松定謨伯爵が、大正11年（1922年）に別邸として建てた洋館です。伯爵が陸軍の駐在武官として長くフランスで暮らしたことから、純フランス風の建物になりました。当時は各界の名士が集まる社交の場で、戦災を免れて建てられたころの姿をそのまま残し、国の重要文化財に指定されています。" }),
  cre("大街道", { h: 12, m: 35, stay: 60, mode: "walk", min: 10, lat: 33.8395, lng: 132.766, address: "愛媛県松山市大街道",
    memo: "萬翠荘から歩いて約10分。路面電車の大街道の電停から南へのびる、長さ483mのアーケードの商店街で、松山いちばんのにぎわいを見せる通りです。飲食店も多いので、ここで昼食にしましょう。" }),
  cre("坂の上の雲ミュージアム", { h: 13, m: 45, stay: 60, mode: "walk", min: 10, lat: 33.841771, lng: 132.769208, address: "愛媛県松山市一番町3丁目20",
    memo: "大街道から歩いて約10分。小説『坂の上の雲』をテーマにしたミュージアムで、松山のまち全体を「屋根のない博物館」とする構想の中心として、2007年に開館しました。安藤忠雄の設計で、空に向かって少し広がる逆三角錐の形をしており、地下1階から地上4階までの各階がひとつづきのスロープでつながっています。休館日は公式の案内で確かめましょう。" }),
  cre("子規記念博物館", { h: 15, m: 10, stay: 50, mode: "train", min: 25, line: "伊予鉄道 市内電車（大街道〜道後温泉）", lat: 33.849667, lng: 132.787167, address: "愛媛県松山市道後公園1-30",
    memo: "大街道の電停から路面電車で道後温泉へ向かい、歩いて道後公園へ（あわせて約25分）。正岡子規の世界を通して、松山や文学に親しんでもらうための文学の博物館で、2階と3階に展示室があります。俳句の世界に入る前に、子規の歩みにふれておきましょう。休館日は公式の案内で確かめましょう。" }),
  cre("伊佐爾波神社", { h: 16, m: 10, stay: 30, mode: "walk", min: 10, lat: 33.850751, lng: 132.788961, address: "愛媛県松山市桜谷町173",
    memo: "博物館から歩いて約10分。延喜式にも名の見える古い神社で、今の社殿は、松山藩主・松平定長が流鏑馬の成功を願い、かなえられたお礼として寛文7年（1667年）に造営したものです。日本三大八幡造りの一つに数えられ、国の重要文化財に指定されています。回廊には、江戸時代の数学の発展を伝える二十二面の和算額も掛けられています。社殿へは長い石段を上るので、足元に気をつけましょう。" + RESPECT + "帰りは、道後温泉駅から路面電車でJR松山駅へ戻りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: true } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== MATSUYAMAJO) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? "松山城(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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

/**
 * チェックリスト #407 0df57d67「青の洞門と羅漢寺、耶馬渓の絶景と信仰を巡るプラン」の見直し（しおりえ(制作補助2)）
 * 車の旅。耶馬渓橋 → 青の洞門 → 古羅漢の景 → 羅漢寺 → 道の駅 耶馬トピア（昼食）→ 耶馬溪ダム → 一目八景（7か所 09:00〜16:30）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述（法道仙人・3,700体など）もあったので書き直す）
 * 羅漢寺は撮影禁止・入山許可証が必要などの決まりを本文に。青の洞門は2026年4月から歩行者のみ通行できる（車は通れない）
 * 既存の写真（競秀峰と山国川・羅漢寺の本堂）は目で見て場所は合っているので残す（羅漢寺の写真は境内で撮られたもの。法務に判断を依頼）
 * 本文の出典（中津耶馬渓観光協会）: 耶馬渓橋 https://nakatsuyaba.com/pages/177/ ／青の洞門 https://nakatsuyaba.com/pages/114/ ／競秀峰 https://nakatsuyaba.com/pages/200/ ／
 *   古羅漢の景 https://nakatsuyaba.com/pages/176/ ／羅漢寺 https://nakatsuyaba.com/pages/106/ ／耶馬トピア https://nakatsuyaba.com/pages/210/ ／
 *   耶馬渓風物館 https://nakatsuyaba.com/pages/179/ ／耶馬渓ダム https://nakatsuyaba.com/pages/182/ ／一目八景 https://nakatsuyaba.com/pages/181/ ／日本三大紅葉 https://nakatsuyaba.com/pages/35/
 * 座標の出典: Nominatim（耶馬渓橋 33.5031716,131.1701318／青の洞門 tourism=attraction 33.4993279,131.1726041／古羅漢 33.4810931,131.1809724／
 *   羅漢寺 33.4815199,131.1866660／道の駅 耶馬トピア 33.4898832,131.1744866／耶馬溪ダム dam 33.4469661,131.1241637／一目八景 33.3712227,131.1651282）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-407-0df57d67.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0df57d67-3dc2-4af0-8b22-74933cfcc298";
const DAY1_ID = "b6e48c48-1a85-4649-baa2-d03eb32c5a69";
const DOMON_ID = "342c5d90-c4c7-4418-b339-5bbd4d97ae61";
const RAKANJI_ID = "15c5cf8c-bd5e-418e-b772-19a3f8d76c3a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "江戸時代に禅海和尚が掘り抜いたと伝わる青の洞門と、奇岩が連なる競秀峰、日本で唯一の8連石造アーチ橋とされる耶馬渓橋をめぐり、岩壁に伽藍が溶け込む羅漢寺にお参り。道の駅で本耶馬渓産のそばの昼食をとってから、耶馬溪ダムを経て、日光・嵐山とならぶ日本三大紅葉ともされる耶馬渓の中でも絶景で知られる、深耶馬溪の一目八景へ。耶馬渓の絶景と信仰を車でめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("耶馬渓橋（オランダ橋）", 9, 0, 20, null, null, 33.503172, 131.170132, "大分県中津市本耶馬渓町曽木・樋田",
    "青の洞門の下流、山国川にかかる石橋で、1923年に完成しました。日本で唯一の8連石造アーチ橋とされ、日本最長の石造アーチ橋ともいわれ、2022年に国の重要文化財に指定されました。長崎県に多い水平な石積みを採用していることから、地元では「オランダ橋」の愛称で呼ばれているといわれます。橋のたもとでは、カエルの親子の像が迎えてくれます。"),
  upd(DOMON_ID, 9, 30, 60, "walk", 10, 33.499328, 131.172604,
    "耶馬渓橋から歩いて約10分。江戸時代、ここには競秀峰の岩壁に鎖を命綱にした危険な道しかなく、諸国巡礼の途中に立ち寄った禅海和尚が、人馬が命を落とすのを見て心を痛め、享保20年（1735年）から掘り始めたと伝わるトンネルです。托鉢で資金を集め、雇った石工たちとノミと鎚だけで掘り続け、30年余りたった明和元年（1764年）に完成しました。明治の大改修で原型の多くは失われましたが、トンネルの一部や明かり採り窓に、当時の手掘りの跡が残っています。洞門の上には、巨峰や奇岩が約1kmにわたって連なる名勝・競秀峰がそびえます。洞門は歩いてのみ通れ、車は通れないので、近くの駐車場に止めて歩きましょう。"),
  cre("古羅漢の景", 10, 40, 20, "car", 10, 33.481093, 131.180972, "大分県中津市本耶馬渓町折元・跡田",
    "青の洞門から車で約10分。羅漢寺の前に屏風を広げたように、頂上に奇怪な岩峰や天然橋をもつ高さ100mほどの丘が続く景色です。山上に羅漢さまが並んでいるような姿から名付けられたようで、付近の石仏が一夜のうちに飛び移ったという伝説もあります。前には駐車場があり、山上にかけて自然歩道も整えられています。岩場では足元に気をつけて歩きましょう。"),
  upd(RAKANJI_ID, 11, 10, 60, "walk", 10, 33.48152, 131.186666,
    "古羅漢の下のトンネルをくぐって向かいます。曹洞宗の寺院で、無漏窟に坐す日本最古とされる石造五百羅漢像や、普済楼の千体地蔵尊をはじめ、数千体の石仏を境内の岩屋に安置しています。巨大な岩壁に伽藍が溶け込むたたずまいで知られ、石仏群は2014年に国の重要文化財に指定されました。入山には、仁王門前の受付で入山許可証を受け取ります。境内は写真撮影禁止でカメラは持ち込めず、携帯電話の使用や食事の持ち込み、お酒を飲んだ人の入山もできないので、決まりを守りましょう。雨や悪天候で閉門することもあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("道の駅 耶馬トピア（昼食）", 12, 30, 75, "car", 15, 33.489883, 131.174487, "大分県中津市本耶馬渓町曽木2193-1",
    "羅漢寺から車で約15分。本耶馬渓産のそばを自前の石臼で挽いた、挽きたて・打ちたて・茹でたてのそばが味わえる道の駅です。食事を出さない日もあるので、公式の案内で確かめておきましょう。館内の日本遺産センター耶馬渓風物館では、禅海和尚に関する資料や、青の洞門を舞台にした菊池寛の小説「恩讐の彼方に」のマジックビジョン、この地方で使われていた民具などを見られます。"),
  cre("耶馬溪ダム", 14, 5, 30, "car", 20, 33.446966, 131.124164, "大分県中津市耶馬溪町大字柿坂",
    "耶馬トピアから車で約20分。山移川の水をたくわえた人工湖で、まわりを耶馬溪特有の岩ともみじに囲まれ、季節ごとに違った表情を見せます。1985年に完成した多目的ダムで、湖面では水上スキーなどのウォータースポーツも盛んです。水辺では足元に気をつけましょう。"),
  cre("一目八景", 15, 0, 90, "car", 25, 33.371223, 131.165128, "大分県中津市耶馬溪町大字深耶馬3152",
    "耶馬溪ダムから車で約25分、深耶馬溪の中心にある景勝地です。群猿山、鳶ノ巣山、嘯猿山、夫婦岩、雄鹿長尾の峰、烏帽子岩、仙人岩、海望嶺などの岩峰を一望できることから名付けられました。展望台からの眺めのほか、川向こうの遊歩道からも違った景色を楽しめます。若葉の新緑から紅葉の季節まで、一年中鮮やかな景観を見せてくれます。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${DOMON_ID},${RAKANJI_ID}`) throw new Error("構成が想定と違います");
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

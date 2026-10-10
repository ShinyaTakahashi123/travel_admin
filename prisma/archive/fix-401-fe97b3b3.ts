/**
 * チェックリスト #401 fe97b3b3「アメリカ村で古着ハンティング、若者文化を楽しむミナミ散策プラン」の見直し（しおりえ(制作補助2)）
 * 難波八阪神社 → 法善寺横丁 → 道頓堀 → アメリカ村（昼食）→ 心斎橋筋商店街 → 黒門市場 → 日本橋でんでんタウン（7か所 09:00〜16:30、すべて徒歩）
 * 既存の4か所はIDのまま直す。前の本文は、確かめられない記述（店の名前・人名・年・火災の年など）や個々の店・看板の名前が多かったので、公式の観光案内で確かめられたことだけで書き直す
 * 既存の4か所の写真は目で見て合っているので残す
 * 座標の出典: Nominatim（難波八坂神社 34.6614819,135.4967325／三角公園 34.6720980,135.4979275／心斎橋筋商店街 34.6719459,135.5013498／法善寺横丁 34.6681845,135.5026705／
 *   道頓堀 place=locality 34.6690306,135.5015715／黒門市場 marketplace 34.6653277,135.5069795／でんでんタウン place=locality 34.6592152,135.5058245）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-401-fe97b3b3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "fe97b3b3-ed31-428e-bdac-1ccebda6bb24";
const DAY1_ID = "b161ead0-bffa-4c70-81a4-df4d29c8b34b";
const AMEMURA_ID = "d315e828-905a-4259-89b9-c7082b23b0dd";
const SHINSAIBASHI_ID = "977306f5-9a6a-4392-acc1-6f863d83d6c3";
const HOZENJI_ID = "0902c353-4bf9-4ecf-b0d6-b5665b7f277e";
const DOTONBORI_ID = "a4a3d6b7-d6e9-40b3-8b47-7c05fb1f7cb6";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "大きな獅子の顔の舞台で知られる難波八阪神社から、石畳の法善寺横丁、巨大な看板が並ぶ道頓堀へ。昼は古着と若者文化の街・アメリカ村で過ごし、心斎橋筋商店街を歩いてから、大阪の台所・黒門市場、アニメやゲームの店が集まる日本橋でんでんタウンまで、ミナミのカルチャーを歩いてめぐる日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});

const order = [
  {
    create: {
      name: "難波八阪神社", visitTime: t(9, 0), stayDurationMin: 40, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.661482, lng: 135.496733, address: "大阪府大阪市浪速区元町2丁目",
      memo:
        "素盞嗚尊をまつる神社です。境内の「獅子殿」は、高さ12m・奥行き7m・幅7mの大きな獅子の頭の形をした舞台で、1974年に本殿とともに完成しました。目はライト、鼻はスピーカーの役目をしており、大きな口で邪気を飲み込み、勝運を招くといわれます。正月や夏祭りには、この舞台で神楽や獅子舞などが奉納されます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    },
  },
  upd(HOZENJI_ID, 9, 55, 30, "walk", 15, 34.668185, 135.502671,
    "難波八阪神社から歩いて約15分。ミナミの繁華街にありながら、静かななにわの情緒を残す横丁です。長さ80m・幅3mの2本の石畳の路地が東西にのび、老舗の割烹やバー、お好み焼きや串カツの店が並びます。もとは浄土宗の法善寺の境内で、参拝客を相手にした露店が横丁に発展しました。戦争中の空襲で寺も横丁も焼けましたが、戦後に復活し、織田作之助の小説『夫婦善哉』の舞台としても知られます。横丁の奥の水掛不動尊は、願いを込めた人々がかける水で全身が緑の苔におおわれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(DOTONBORI_ID, 10, 30, 45, "walk", 5, 34.669031, 135.501572,
    "法善寺横丁から歩いてすぐ。巨大な立体看板が立ち並ぶ、ミナミを代表する繁華街です。道頓堀の名は、慶長17年（1612年）に私財をなげうって川を開削した安井道頓の名に由来するとされています。その後、芝居や歌舞伎の娯楽の街として栄え、茶屋も増えたことが、今の食とライブエンターテインメントの街のもとになりました。川沿いの遊歩道「とんぼりリバーウオーク」を歩きながら、看板が並ぶ川の景色を眺めてみましょう。"),
  upd(AMEMURA_ID, 11, 25, 90, "walk", 10, 34.672098, 135.497928,
    "道頓堀から歩いて約10分。長堀通りから道頓堀までの一帯に広がる、関西の若者文化をリードしてきた街で、中心には三角公園があります。江戸時代、このあたりは大阪湾から道頓堀を遡って炭が集められたことから「炭屋町」と呼ばれていました。1970年代に倉庫を改装した店で古着やジーンズが売られ始め、アメリカ西海岸で仕入れた中古レコードや雑貨も話題になって、今の街の姿につながりました。古着やレコードの店をのぞきながら、ここで昼食にしましょう。"),
  upd(SHINSAIBASHI_ID, 13, 5, 50, "walk", 10, 34.671946, 135.50135,
    "アメリカ村から歩いて約10分。長堀通の南側から宗右衛門町通まで、南北に約580m続くアーケードの商店街です。江戸時代には書籍店や古書店、小道具屋、琴三味線の店、呉服屋などが並び、明治には舶来品を扱う店や時計店が増えました。大正・昭和には呉服屋がデパートに変わり、「心ブラ」と呼ばれる買い物の散歩を楽しむ若者たちでにぎわいました。創業数百年の老舗から流行の服飾店までが混在する通りを歩いてみましょう。"),
  {
    create: {
      name: "黒門市場", visitTime: t(14, 10), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.665328, lng: 135.50698, address: "大阪府大阪市中央区日本橋2丁目",
      memo:
        "心斎橋筋商店街から歩いて約15分。千日前から南へ約580m続く、江戸時代後期から続く市場で、「浪速っ子の胃袋」を支えてきました。文政5〜6年（1822〜1823年）ごろ、日本橋の圓明寺のあたりにあった黒い山門の近くに商人が集まり、堺や紀州から入ってきた魚を売ったのが始まりといわれます。料亭の板前さんの買い出しが多いことから、フグや鮮魚の店が多く、青物や果物の店も並びます。食べ歩きのときは、ごみを持ち帰り、通行のじゃまにならないようにしましょう。",
    },
  },
  {
    create: {
      name: "日本橋でんでんタウン", visitTime: t(15, 20), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.659215, lng: 135.505825, address: "大阪府大阪市浪速区日本橋",
      memo:
        "黒門市場から歩いて約10分、堺筋沿いのアーケードに店が並ぶ商店街です。古くから電気街として発展してきましたが、今はマンガやアニメ、ゲーム、フィギュア、トレーディングカードなどを扱う店が集まり、西日本最大規模の電気街・オタク街といわれます。プラモデルや電子工作の品、中古品やジャンク品の店も多く、掘り出し物探しも楽しめます。帰りは南海・地下鉄のなんば駅や、地下鉄の日本橋駅・恵美須町駅から帰れます。",
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const ids = days[0]?.spots.map((s) => s.id).join();
  if (days.length !== 1 || days[0].id !== DAY1_ID || ids !== `${AMEMURA_ID},${SHINSAIBASHI_ID},${HOZENJI_ID},${DOTONBORI_ID}`) throw new Error("構成が想定と違います");
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

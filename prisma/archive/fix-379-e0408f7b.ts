/**
 * チェックリスト #379 e0408f7b「宇和島城、現存12天守の一つを望む定番日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 宇和島城 → 伊達博物館 → 天赦園 → 道の駅きさいや広場（昼食）→ 歴史資料館 → 和霊神社 → 宇和津彦神社（7か所 09:00〜16:30、徒歩）
 * 既存の宇和島城はIDのまま直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-379-e0408f7b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e0408f7b-636a-4e62-9f24-0ed4ee25c2bc";
const DAY1_ID = "47a90fa7-ad83-437c-99d3-295125f8fcbc";
const CASTLE_ID = "fc33a778-cfc5-48b4-bd1e-660520396a7f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "築城の名手・藤堂高虎が築いた宇和島城から、伊達家ゆかりの博物館や大名庭園・天赦園、明治の洋館、城下の神社まで、宇和島の町を歩いてめぐる日帰りプランです。お昼は郷土料理の宇和島鯛めしを。";

const MEMO_CASTLE =
  "JR宇和島駅から歩いて城山のふもとへ。ふもとから天守までは、石段と山道を15分ほど上ります。築城の名手として知られた藤堂高虎が、文禄4年（1595年）に宇和郡を与えられて入り、翌年から築き始めた城です。高虎は、実際には五角形の縄張りなのに、外からは四角形に見えるように設計し、攻める側の目を欺いたと伝えられています。高虎が去ったあとは伊達家の居城となり、今の天守は2代藩主・伊達宗利が寛文6年（1666年）ごろに建て替えたものです。江戸時代から残る全国12の天守の一つで、国の重要文化財に指定され、日本100名城（公益財団法人日本城郭協会の選定）にも選ばれています。三重三階の天守からは、城下町と宇和海を見渡せます。石段は急なところがあるので、足元に気をつけて上りましょう。天守に入れる時間は季節で変わるので、公式の案内で確かめてください。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; lat: number; lng: number; address: string; memo: string };

const NEW: NewSpot[] = [
  {
    name: "宇和島市立伊達博物館", h: 10, m: 30, stay: 60, dur: 10, lat: 33.215916, lng: 132.562638, address: "愛媛県宇和島市",
    memo:
      "城山を下りて歩いて約10分。宇和島を治めた伊達家に伝わる古文書や武具・甲冑、婚礼の調度品などを展示し、宇和島伊達藩の大名文化を紹介する博物館です。仙台の伊達政宗の長男・秀宗が宇和島に入って始まった宇和島伊達家の歩みを、実物の品々でたどれます。建物の老朽化のため、建て替えにともなう長い休館が予定されています。休館日とあわせて、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "天赦園", h: 11, m: 35, stay: 55, dur: 5, lat: 33.215352, lng: 132.561003, address: "愛媛県宇和島市",
    memo:
      "伊達博物館のとなり、7代藩主・伊達宗紀（春山）が隠居の場所としてつくった池泉回遊式の庭園です。「天赦園」の名は、伊達政宗の漢詩の一節「残躯は天の赦す所 楽しまずして是を如何せん」にちなむと伝えられます。伊達家の家紋「竹に雀」にちなんで、池をめぐるようにさまざまな珍しい竹が植えられているのも見どころ。池にかかる太鼓橋のような藤棚には白玉藤が咲き、この庭ならではの景色をつくります。休園日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "道の駅 うわじま きさいや広場", h: 12, m: 45, stay: 60, dur: 15, lat: 33.222423, lng: 132.558236, address: "愛媛県宇和島市",
    memo:
      "天赦園から歩いて約15分、宇和島港のそばにある道の駅です。宇和海でとれる魚や柑橘など、地元の産物が並びます。ここで昼食にしましょう。宇和島の郷土料理「宇和島鯛めし」は、生の鯛の切り身を、卵を溶いたたれにからめて、温かいごはんにのせて食べるものです。",
  },
  {
    name: "宇和島市立歴史資料館", h: 13, m: 55, stay: 30, dur: 10, lat: 33.226452, lng: 132.554664, address: "愛媛県宇和島市住吉町2丁目4-36",
    memo:
      "きさいや広場から歩いて約10分。明治17年（1884年）に宇和島警察署の庁舎として建てられた木造2階建ての洋風の建物を移して、資料館として使っています。三角形の破風をのせて張り出した玄関や、西洋風の上げ下げ窓など、この地方では早い時期の本格的な洋風建築とされ、国の登録有形文化財にもなっています。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "和霊神社", h: 14, m: 45, stay: 40, dur: 20, lat: 33.229795, lng: 132.565317, address: "愛媛県宇和島市和霊町",
    memo:
      "歴史資料館から歩いて約20分。祭神は、宇和島藩の初代藩主・伊達秀宗の家臣で、藩の総奉行として藩政の立て直しに力を尽くした山家清兵衛公頼です。清兵衛は1620年、政敵の陰謀によって命を落としましたが、その後、事件にかかわった人々が次々と不慮の死をとげたため、人々は清兵衛の霊を恐れ、城の北のこの地にまつったのが始まりと伝えられます。今では「和霊さま」と呼ばれ、地元の人々に親しまれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "宇和津彦神社", h: 15, m: 50, stay: 40, dur: 25, lat: 33.215216, lng: 132.573088, address: "愛媛県宇和島市野川",
    memo:
      "和霊神社から歩いて約25分。宇和島の城下の総鎮守とされてきた神社で、景行天皇の皇子・国乳別皇子とされる宇和津彦神をまつっています。古くは別の場所に鎮座し、のちに城下のこの地に移されたと伝えられます。城下町を見守ってきた社で、伊達家の城下町めぐりを締めくくりましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。帰りはJR宇和島駅まで歩いて向かいます。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: "walk", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== CASTLE_ID) throw new Error("構成が想定と違います");

  const order = [
    { id: CASTLE_ID, data: { visitTime: t(9, 0), stayDurationMin: 80, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.220713, lng: 132.564428, memo: MEMO_CASTLE } },
    ...NEW.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "宇和島城(既存)" : d.name} ${String(d.memo).length}字`);
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

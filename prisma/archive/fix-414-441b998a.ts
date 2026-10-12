/**
 * チェックリスト #414 441b998a「日曜市とはりまや橋、土佐の街なかカルチャーを楽しむ1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目（日曜）: 日曜市 → 高知県立文学館 → ひろめ市場（昼食）→ 龍馬の生まれたまち記念館 →（タクシー）高知市立自由民権記念館（5か所 09:00〜16:00）
 * 2日目（月曜）: はりまや橋 →（タクシー）竹林寺 → 五台山公園展望テラス → 高知県立牧野植物園（昼食）（4か所 09:00〜14:15）
 *   2日目は月曜なので、月曜休館の施設（横山隆一記念まんが館・自由民権記念館）は2日目に入れない
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す。よさこい節の歌詞の引用も外す）。タイトルは内容に合っているのでそのまま
 * 既存の写真（はりまや橋の欄干）は目で見て合っているので残す
 * 本文の出典（高知市の観光情報サイト）: 日曜市 https://www.city.kochi.kochi.jp/site/kanko/nichiyouichi.html ・ https://www.city.kochi.kochi.jp/site/gairoichi/guide.html ・ /enjoy.html ／
 *   県立文学館 https://www.city.kochi.kochi.jp/site/kanko/kenritubungakukan.html ／ひろめ市場 https://www.city.kochi.kochi.jp/site/kanko/hirome.html ・ https://hirome.co.jp/ ／
 *   龍馬の生まれたまち記念館 https://www.city.kochi.kochi.jp/site/kanko/ryomanoumaretamachikinenkan.html ／自由民権記念館 https://www.city.kochi.kochi.jp/site/kanko/kinenkan.html ／
 *   はりまや橋 https://www.city.kochi.kochi.jp/site/kanko/harimayabashi.html ・ https://www.pref.kochi.lg.jp/info/harimaya.html ／からくり時計 https://www.city.kochi.kochi.jp/site/kanko/karakuritokei.html ／
 *   竹林寺 https://www.city.kochi.kochi.jp/site/kanko/chikurinji.html ／五台山公園 https://www.city.kochi.kochi.jp/site/kanko/godaisan.html ／
 *   牧野植物園 https://www.city.kochi.kochi.jp/site/kanko/makinosyokubutuen.html ・ https://www.makino.or.jp/
 * 座標の出典: Nominatim（追手筋 33.5615890,133.5383738／高知県立文学館 33.5618051,133.5333173／ひろめ市場 33.5604480,133.5356877／
 *   高知市立自由民権記念館 33.5430456,133.5503791／はりまや橋 33.5596002,133.5423649／竹林寺 33.5465090,133.5767482／五台山展望台 33.5468220,133.5740049／
 *   牧野植物園 33.5483309,133.5791220）、OSM/Overpass（龍馬の生まれたまち記念館 33.556407,133.524589）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-414-441b998a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "441b998a-82ce-43fd-849a-ee82c277dd46";
const DAY1_ID = "c56a49e0-4fb8-4b5c-bf0c-ac9ccfa49c27";
const DAY2_ID = "291317c4-4965-4aaf-8322-4d4289b48096";
const ICHI_ID = "0a70734e-31a2-4051-9201-c83ccccce215";
const HARIMAYA_ID = "a5f61cac-28a0-4dad-9100-7eb9b37e2ab3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "300年以上の歴史をもつ土佐の日曜市を朝から歩き、県立文学館を訪ねて、好きな店の料理を持ち寄るひろめ市場で昼食を。龍馬の生まれたまち記念館と自由民権記念館で、土佐の人と歴史にふれます。2日目は、よさこい節の恋物語で知られるはりまや橋から五台山へ。竹林寺にお参りし、展望テラスから浦戸湾を眺め、牧野植物園で植物と昼食を楽しむ、高知の街なかの暮らしと文化にふれる1泊2日です。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(ICHI_ID, 9, 0, 100, null, null, 33.561589, 133.538374,
    "元禄3年（1690年）以来、300年以上の歴史をもつ土佐の日曜市です。高知城の追手門からまっすぐ東へ延びる追手筋に、全長約1kmにわたって約300店が軒を並べ、新鮮な野菜や果物のほか、金物や打ち刃物、植木なども売られています。出店者の多くが生産者なので、旬の食べ方や育て方の話を聞けるのも楽しみのひとつです。年始とよさこい祭りの期間を除く毎週日曜日に開かれ、午後になると片付けを始める店も多いので、朝のうちに訪れましょう。"),
  cre("高知県立文学館", 10, 50, 50, "walk", 10, 33.561805, 133.533317, "高知県高知市丸ノ内1-1-20",
    "日曜市から歩いて約10分。太平洋と四国山地に囲まれた土佐の独特の風土から育った多くの文学者を、紀貫之の『土佐日記』から現在の作品まで、作家とともに紹介する文学館です。臨時休館もあるので、公式の案内で確かめてから訪れましょう。"),
  cre("ひろめ市場（昼食）", 11, 55, 75, "walk", 10, 33.560448, 133.535688, "高知県高知市帯屋町2丁目3-1",
    "文学館から歩いて約10分。土佐藩の家老の屋敷跡の近くにあり、一帯が「弘人屋敷」と呼ばれていたことから名付けられた市場です。「お城下広場」や「龍馬通り」など7つのブロックに、鮮魚店や精肉店、雑貨の店、飲食店が集まっています。好きな店で買ったものを、市場のあちこちにあるテーブルに持ち寄って食べるスタイルなので、ここで昼食にしましょう。お酒は20歳から。"),
  cre("龍馬の生まれたまち記念館", 13, 30, 60, "walk", 15, 33.556407, 133.524589, "高知県高知市上町2丁目6-33",
    "ひろめ市場から歩いて約15分。坂本龍馬が生まれ育った上町にある記念館で、龍馬が土佐藩を脱藩するまでの少年・青年時代のエピソードを、映像や音声で紹介しています。バーチャル体験の映像システムもあります。記念館を起点に、町に点在する龍馬ゆかりの史跡をめぐるまち歩きも楽しめます。"),
  cre("高知市立自由民権記念館", 14, 50, 70, "taxi", 15, 33.543046, 133.550379, "高知県高知市桟橋通4丁目14-3",
    "龍馬の生まれたまち記念館から車で約15分。「自由は土佐の山間より出づ」といわれ、近代日本の政治史に大きな役割を果たした土佐の自由民権運動の歩みと、活動した人々を、写真や文献、諷刺画、模型、映像で紹介する記念館です。「自由のともしび」をいただく4基の塔を連ねた外観も特徴です。休館日は公式の案内で確かめてから訪れましょう。"),
];

const day2 = [
  upd(HARIMAYA_ID, 9, 0, 30, null, null, 33.5596, 133.542365,
    "よさこい節に唄われ、五台山竹林寺の僧・純信と、お馬の恋物語の舞台として知られる橋です。江戸時代に、堀川をはさんで商いをしていた「播磨屋」と「櫃屋」が、行き来のために私設の橋を架けたのが名の由来といわれています。今は「はりまや橋・葉山庭園よさこい公園」として整えられ、昔のはりまや橋が復元されて、純信・お馬のモニュメントもあります。橋の東側には、よさこい節の音楽に合わせて人形が登場するからくり時計もあります。"),
  cre("竹林寺", 9, 45, 60, "taxi", 15, 33.546509, 133.576748, "高知県高知市五台山3577",
    "はりまや橋から車で約15分、五台山にある四国霊場第31番札所です。聖武天皇の命を受けた行基が、唐の五台山に似たこの地に創建したと伝わり、四国霊場八十八カ所で唯一、文殊菩薩を本尊とする学問の寺ともいわれます。本堂は国の重要文化財で、宝物館の仏像17体もすべて国の重要文化財です。よさこい節の恋物語の純信も、この寺の僧でした。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("五台山公園展望テラス", 10, 55, 30, "walk", 10, 33.546822, 133.574005, "高知県高知市吸江210-1",
    "竹林寺から歩いて約10分。ツツジの名所として知られる五台山公園の中腹にある展望テラスで、高知市街地や浦戸湾を見渡せます。"),
  cre("高知県立牧野植物園（昼食）", 11, 35, 160, "walk", 10, 33.548331, 133.579122, "高知県高知市五台山4200-6",
    "展望テラスから歩いて約10分。日本で初めて植物に学名をつけたとされる世界的な植物学者で、「植物分類学の父」と呼ばれる牧野富太郎博士を記念した植物園です。自然に近い状態で、およそ3,000種類の植物が四季折々の姿を見せてくれます。園内には牧野富太郎記念館や温室、レストランがあるので、ここで昼食にしましょう。メンテナンスのための休園日もあるので、公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== ICHI_ID || days[1].spots.map((s) => s.id).join() !== HARIMAYA_ID
  ) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`--- ${label}`);
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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

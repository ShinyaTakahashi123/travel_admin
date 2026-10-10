/**
 * チェックリスト #409 1766f8c2「わんこそば挑戦と岩手県立美術館、盛岡グルメ&アートプラン」の見直し（しおりえ(制作補助2)）
 * 岩手県立美術館 →（車）盛岡城跡公園 → 石割桜 → 盛岡の街なかで昼食（わんこそば）→ 岩手銀行赤レンガ館 → もりおか啄木・賢治青春館 → 盛岡八幡宮（7か所 09:30〜16:30）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。タイトルのわんこそばの行き先がなかったので昼食に入れる（店の名前は書かない）
 * 既存の写真（美術館のグランドギャラリー・城跡の石垣）は目で見て合っているので残す
 * 本文の出典: 美術館 https://www.ima.or.jp/ ・ http://www.ima.or.jp/collection/yorozu/ ・ /matsumoto/ ・ /hunakoshi/ ／
 *   盛岡城跡公園 https://www.city.morioka.iwate.jp/kurashi/midori/koen/1010491.html ・ https://www.city.morioka.iwate.jp/kankou/kankou/1037106/rekishi/1009470/1009474.html ／
 *   石割桜 https://www.city.morioka.iwate.jp/kankou/kankou/1037103/1037212/sakura/1007959.html ・ http://www.bunka.pref.iwate.jp/archive/hist143 ／
 *   わんこそば（岩手県生めん協同組合）http://i-namamen.com/threemen.html ／赤レンガ館 https://www.iwagin-akarengakan.jp/redbrick/ ／
 *   青春館 https://seishunkan.jp/about ・ https://seishunkan.jp/ ／盛岡八幡宮 https://morioka8man.jp/yuisyo
 * 座標の出典: Nominatim（岩手県立美術館 39.6932472,141.1245736／盛岡城 historic=castle 39.7001247,141.1502054／石割桜 39.7037896,141.1512335／
 *   昼食は城跡公園前の大通一丁目のバス停「盛岡城跡公園」の点 39.7015948,141.1499456（街なかの一点として）／岩手銀行赤レンガ館 39.7006850,141.1551263／
 *   もりおか啄木・賢治青春館 39.6996304,141.1543675／盛岡八幡宮 39.6953481,141.1640146）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-409-1766f8c2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "1766f8c2-8d00-4dd7-b89d-578f9a4295b5";
const DAY1_ID = "e8877883-5899-4061-86ad-356294687f9e";
const MUSEUM_ID = "6aecd1c6-11ae-43b8-af78-e7544d71e978";
const CASTLE_ID = "c7397c91-59bf-4fb8-a365-f5bc983fcc71";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "岩手ゆかりの作家を紹介する岩手県立美術館でアートにふれ、南部氏の盛岡城跡公園の石垣と、岩の割れ目から伸びる石割桜へ。昼食は盛岡名物のわんこそばに挑戦し、午後は辰野金吾ゆかりの岩手銀行赤レンガ館と、啄木と賢治の青春をたどる青春館を訪ね、盛岡八幡宮にお参り。盛岡の「食」と「文化」を楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(MUSEUM_ID, 9, 30, 90, null, null, 39.693247, 141.124574,
    "盛岡市の本宮にある県立の美術館で、岩手ゆかりの作家の作品を中心に紹介しています。花巻（旧土沢）出身の洋画家・萬鐵五郎は、東京美術学校の卒業制作《裸体美人》が日本のフォーヴィスムの先駆的な作品と位置付けられる画家です。盛岡で育った洋画家・松本竣介と、彫刻家・舟越保武は、県立盛岡中学校の同期でした。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(CASTLE_ID, 11, 20, 50, "car", 15, 39.700125, 141.150205,
    "美術館から車で約15分。南部氏が築いた盛岡城の跡で、石垣はすべて城内とその周辺で産出した花崗岩で築かれています。本丸東側には、築城当初の慶長年間のものと考えられる、自然石を多く用いた盛岡城で最も古い石垣が残り、時代によって異なる積み方を見比べられます。二ノ丸には、石川啄木の歌碑「不来方のお城の草に寝ころびて 空に吸はれし 十五の心」があります。「日本の名城100選」や「日本の歴史公園100選」にも選ばれています。石垣の近くでは立ち入りの決まりに従い、足元に気をつけて歩きましょう。"),
  cre("石割桜", 12, 15, 15, "walk", 5, 39.70379, 141.151234, "岩手県盛岡市内丸",
    "城跡公園から歩いて約5分、盛岡地方裁判所の敷地内にある桜です。巨大な花崗岩の狭い割れ目から突き出た、樹齢350〜400年といわれるエドヒガンザクラで、大正12年（1923年）に国の天然記念物に指定されました。裁判所の敷地なので、決まりを守って静かに眺めましょう。ペットを連れての立ち入りは控えましょう。"),
  cre("盛岡の街なかで昼食（わんこそば）", 12, 40, 60, "walk", 10, 39.701595, 141.149946, "岩手県盛岡市大通一丁目",
    "石割桜から歩いて約10分、城跡公園のまわりの街なかで昼食にしましょう。盛岡名物のわんこそばは、祖先から伝わる「おもてなしの心」から生まれた食文化で、宴の席で大勢のお客をもてなすために考えられたと伝えられています。一口大に小分けにしたそばを、さまざまな薬味とともに味わい、お給仕さんとの掛け合いも楽しみのひとつです。前もって予約しておくのがおすすめです。"),
  cre("岩手銀行赤レンガ館", 13, 50, 40, "walk", 10, 39.700685, 141.155126, "岩手県盛岡市中ノ橋通一丁目2-20",
    "昼食のあとは歩いて約10分、中ノ橋のそばへ。明治44年（1911年）に盛岡銀行の本店として落成した建物で、東京駅でも知られる辰野・葛西建築設計事務所の設計です。辰野金吾が設計した建築としては、東北地方に唯一残る作品とされています。銀行としての営業を終えたあと、約3年半の保存修理を経て一般公開されました。国の重要文化財に指定されています。"),
  cre("もりおか啄木・賢治青春館", 14, 35, 45, "walk", 5, 39.69963, 141.154368, "岩手県盛岡市中ノ橋通一丁目1-25",
    "赤レンガ館から歩いてすぐ。明治期に建てられた旧第九十銀行本店本館を保存活用した、国の重要文化財の建物です。時期はすれ違いながらも同じ盛岡中学校に学んだ石川啄木と宮沢賢治が青春を過ごした盛岡のまちと、二人について紹介しています。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("盛岡八幡宮", 15, 40, 50, "walk", 20, 39.695348, 141.164015, "岩手県盛岡市八幡町13-1",
    "青春館から歩いて約20分。延宝8年（1680年）に第29代南部重信公が建立したと伝わる神社で、品陀和気命（応神天皇）をまつり、農業や商業、学問など暮らしの根源の神として、地域の人々の崇敬を集めてきました。今の社殿は平成9年に建て直されたもので、色あざやかな彫刻を施した朱塗りの大社殿が見どころです。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${MUSEUM_ID},${CASTLE_ID}`) throw new Error("構成が想定と違います");
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

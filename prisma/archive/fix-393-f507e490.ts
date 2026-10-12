/**
 * チェックリスト #393 f507e490「松本市美術館と旧開智学校、アートと近代建築を楽しむ1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 旧制高等学校記念館 → 松本市美術館 → 中町通り（昼食）→ 松本市はかり資料館 → 松本市時計博物館 → 松本市立博物館 → 松本城（7か所 09:00〜16:55）
 * 2日目: 旧開智学校 → 旧司祭館 →（JR大糸線）碌山美術館 → 穂高駅前（昼食）→ 穂高神社 →（タクシー）大王わさび農場（6か所 09:00〜16:25）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）
 * 座標の出典: Nominatim（旧制高等学校記念館 36.2311721,137.9824893／松本市美術館 36.2315567,137.9766471／松本市中町蔵の会館 36.2335932,137.9713243／
 *   バス停「はかり資料館」36.2338747,137.9726916（資料館の前の停留所。建物の点がないため）／松本市時計博物館 36.2337977,137.9686296／松本市立博物館 36.2352771,137.9690178／
 *   松本城 tourism=museum 36.2386353,137.9688709／旧開智学校 36.2430494,137.9682435／旧司祭館 36.2431467,137.9676812／碌山美術館 36.3437459,137.8814651／
 *   穂高駅 36.339565,137.8817573／穂高神社 36.3386244,137.8843104／大王わさび農場 36.3386266,137.9099429）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-393-f507e490.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f507e490-d079-42fb-bf98-12be010ccf3d";
const DAY1_ID = "85f4fb96-a8ce-4a85-b264-b633b8d95cfd";
const DAY2_ID = "1f68318d-e78b-4718-96fd-d9e958a02b59";
const ARTMUSE_ID = "8a26ac07-c264-4d9e-9bbc-de71b3e081ee";
const KAICHI_ID = "3105b92d-f964-4736-8c5b-a115047b074d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "大正の木造校舎が残る旧制松本高校や、草間彌生の作品にふれる松本市美術館、蔵の町並みの中町通りや小さな博物館をめぐり、国宝の松本城へ。2日目は明治の擬洋風建築の旧開智学校と西洋館の旧司祭館を見学し、安曇野へ足をのばして、教会のような碌山美術館やわさび田の広がる農場を訪ねる、アートと近代建築を楽しむ1泊2日プランです。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });

const day1 = [
  cre({
    name: "旧制高等学校記念館（あがたの森）", h: 9, m: 0, stay: 60, mode: null, dur: null, lat: 36.231172, lng: 137.982489, address: "長野県松本市県",
    memo:
      "松本駅から歩いて約20分、あがたの森公園の中にある、大正8年（1919年）に開校した旧制松本高等学校の校舎と記念館です。大正9年に建てられた本館と大正11年に建てられた講堂は、大正期の代表的な木造洋風建築として、2007年に国の重要文化財に指定されました。となりの記念館では、全国の旧制高校の資料や、学生たちの暮らしを紹介しています。木造の廊下や窓枠に、100年前の学び舎の空気を感じてみましょう。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  {
    id: ARTMUSE_ID,
    data: {
      visitTime: t(10, 10), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 36.231557, lng: 137.976647,
      memo:
        "あがたの森から歩いて約10分。松本市出身の芸術家・草間彌生の作品を紹介するコレクション展示「草間彌生 魂のおきどころ」で知られる美術館です。水玉や南瓜など、草間彌生ならではのモチーフに囲まれる展示のほか、郷土ゆかりの作家の作品や、季節ごとの企画展も開かれています。休館日は公式の案内で確かめてから訪れましょう。",
    },
  },
  cre({
    name: "中町通り（昼食）", h: 11, m: 50, stay: 60, mode: "walk", dur: 10, lat: 36.233593, lng: 137.971324, address: "長野県松本市中央2丁目",
    memo:
      "美術館から歩いて約10分。善光寺街道沿いに江戸時代から栄えた商家の町並みで、江戸の末や明治の大火から町を守るために建てられた、漆喰の「なまこ壁」の白と黒の土蔵が今も多く残っています。老舗と新しい店が並び、松本民芸家具やクラフトの店、カフェや食事処もあるので、ここで昼食にしましょう。",
  }),
  cre({
    name: "松本市はかり資料館", h: 12, m: 55, stay: 30, mode: "walk", dur: 5, lat: 36.233875, lng: 137.972692, address: "長野県松本市中央3-4-21",
    memo:
      "中町通りの中ほどにある小さな資料館です。明治時代から昭和61年（1986年）まで営業していた度量衡店の建物と資料を松本市が譲り受け、1989年に開館しました。「測る」「計る」「量る」ための、変わった形や素材、いろいろな使い道のはかりに出会えます。蔵の町の商家の建物も見どころです。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "松本市時計博物館", h: 13, m: 30, stay: 45, mode: "walk", dur: 5, lat: 36.233798, lng: 137.96863, address: "長野県松本市中央1丁目",
    memo:
      "はかり資料館から歩いて約5分、女鳥羽川のほとりにある博物館です。時計の研究家・収集家だった本田親蔵が生涯をかけて集めた古時計のコレクションを中心に、国内外の古時計を展示しています。2002年に開館し、外壁の日本最大級の振り子時計が目印です。時を刻む道具の移り変わりをたどってみましょう。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "松本市立博物館", h: 14, m: 25, stay: 60, mode: "walk", dur: 10, lat: 36.235277, lng: 137.969018, address: "長野県松本市大手3丁目",
    memo:
      "時計博物館から歩いて約10分。明治時代に始まった歴史をもつ博物館で、2023年10月、かつて武士の屋敷が並んだ松本城の三の丸の大名町通り沿いに新しい建物で開館しました。常設展では、松本の暮らしと歴史、行事などをテーマごとに紹介しています。このあと訪れる松本城と城下町の成り立ちを知っておくと、見学がいっそう楽しくなります。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "松本城", h: 15, m: 35, stay: 80, mode: "walk", dur: 10, lat: 36.238635, lng: 137.968871, address: "長野県松本市丸の内",
    memo:
      "博物館から歩いて約10分。戦国時代の深志城に始まる城で、現存する五重六階の天守の中で日本最古とされる国宝の城です。大天守・乾小天守・渡櫓・辰巳附櫓・月見櫓の5つの建物がつながり、黒と白の外観と、背後の北アルプスの山並みの眺めが見どころです。天守の中の階段はとても急なので、手すりを持ってゆっくり上り下りしましょう。入場の時間は公式の案内で確かめてから向かいましょう。",
  }),
];

const day2 = [
  {
    id: KAICHI_ID,
    data: {
      visitTime: t(9, 0), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.243049, lng: 137.968244,
      memo:
        "松本駅から周遊バスで約13分、または歩いて約25分。明治9年（1876年）に建てられた小学校の校舎で、地元の大工棟梁・立石清重が手がけた、文明開化の時代の「擬洋風建築」の代表作です。正面の八角形の塔や、竜と雲の彫刻の上で天使が校名の看板を支える玄関の飾りが見どころです。2019年に、近代の学校建築として初めて国宝に指定されました。耐震工事を終えて2024年11月に公開が再開されています。館内では靴を脱いで見学します。休館日は公式の案内で確かめてから訪れましょう。",
    },
  },
  cre({
    name: "旧司祭館", h: 10, m: 5, stay: 30, mode: "walk", dur: 5, lat: 36.243147, lng: 137.967681, address: "長野県松本市開智2丁目",
    memo:
      "旧開智学校のとなりにある西洋館です。明治22年（1889年）、フランス人のクレマン神父が建てた司祭館で、県内に残る最も古い司祭館とされ、長野県宝に指定されています。外壁の下見板張りは、アメリカの開拓時代の船大工の技法を残すアーリー・アメリカン様式の特徴を備え、各部屋に暖炉があり、1階・2階ともにベランダのある、今では珍しい純西洋館です。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "碌山美術館", h: 11, m: 40, stay: 70, mode: "train", dur: 65, line: "JR大糸線（松本→穂高、約30分。旧司祭館から松本駅へ徒歩約25分、穂高駅から徒歩約7分）",
    lat: 36.343746, lng: 137.881465, address: "長野県安曇野市穂高5095-1",
    memo:
      "安曇野出身の彫刻家・荻原守衛（碌山）の作品を伝える美術館です。1958年、約30万人の寄付によって開館しました。つたにおおわれた教会のようなれんが造りの碌山館は、国の登録有形文化財です。代表作の彫刻「女」は、明治以降の彫刻として初めて国の重要文化財に指定された作品といわれます。安曇野の緑の中に建つ建物と作品を、ゆっくり味わいましょう。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "穂高駅前（昼食）", h: 13, m: 0, stay: 50, mode: "walk", dur: 10, lat: 36.339565, lng: 137.881757, address: "長野県安曇野市穂高",
    memo:
      "碌山美術館から歩いて約7分、JR大糸線の穂高駅のまわりで昼食にしましょう。駅の近くには食事のできる店があります。午後は駅から歩いてすぐの穂高神社へ向かい、そのあと、わさび農場へはタクシーで向かいます。",
  }),
  cre({
    name: "穂高神社", h: 13, m: 55, stay: 45, mode: "walk", dur: 5, lat: 36.338624, lng: 137.88431, address: "長野県安曇野市穂高",
    memo:
      "穂高駅から歩いて約3分。穂高見命をまつる神社で、安曇野の本宮のほか、上高地の明神池のほとりに奥宮、奥穂高岳の山頂に嶺宮があります。平安時代の延喜式にも記された古い神社で、信濃の国の大切な社として崇められてきました。秋の御船祭では、穂高人形を飾った大きな船が町を練り歩きます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "大王わさび農場", h: 14, m: 55, stay: 95, mode: "taxi", dur: 15, lat: 36.338627, lng: 137.909943, address: "長野県安曇野市穂高",
    memo:
      "穂高駅からタクシーで約10分。大正時代に、砂利ばかりの荒れ地を20年かけて切り開いてつくられた、国内でも最大級のわさび農場です。北アルプスの雪解け水が地中にしみこんだ伏流水が湧き出し、清らかな水の流れの中でわさびが育てられています。川にかかる3つの水車小屋は、安曇野の原風景として親しまれています。わさび田の中の小道を歩きながら、澄んだ水の流れを眺めましょう。水辺は滑りやすいので足元に気をつけましょう。帰りはタクシーで穂高駅へ戻ります。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== ARTMUSE_ID || days[1].spots.map((s) => s.id).join() !== KAICHI_ID) throw new Error("既存スポットが想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === ARTMUSE_ID ? "松本市美術館(既存)" : "旧開智学校(既存)") : d.name} ${String(d.memo).length}字`);
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

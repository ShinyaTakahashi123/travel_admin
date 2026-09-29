/**
 * チェックリスト #402 ff3e9cd9「片山津温泉とあやとりはし、加賀温泉郷2つの湯めぐり1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目（車）: 片山津温泉（総湯と柴山潟）→ 中谷宇吉郎 雪の科学館 → 那谷寺 → 山代温泉の温泉街（昼食）→ 九谷焼窯跡展示館 → 山代温泉 古総湯（6か所 09:00〜16:30）
 * 2日目（徒歩、最後だけタクシー）: こおろぎ橋 → あやとりはし → 鶴仙渓（黒谷橋・芭蕉堂）→ 医王寺 → 山中温泉の温泉街（昼食）→ 山中温泉 芭蕉の館 → 山中座 → 山中温泉 菊の湯 → 山中塗うるし座（9か所 09:00〜16:30）
 * 中身が3つの温泉地になるので、タイトルの「2つの湯めぐり」を「3つの湯めぐり」に直す
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。片山津温泉の点は総湯の点に、あやとりはしの住所（片山津温泉の住所になっていた）は山中温泉河鹿町に直す
 * 写真: あやとりはしに付いていた写真（20090913加賀三湖Tagged.jpg）は、文字入りの加賀平野の空撮で橋の写真ではないので外し、
 *   https://commons.wikimedia.org/wiki/File:AyatoriHashi_2018.jpg（藤谷良秀、CC BY-SA 4.0、位置情報 36.245348,136.375845 が橋と一致、目で見てS字の赤い橋と確認）に替える。
 *   片山津温泉の写真（柴山潟のほとりの温泉街）は合っているので残す（表紙のまま）
 * 座標の出典: Nominatim（加賀片山津温泉 総湯 36.3453186,136.3689009／中谷宇吉郎 雪の科学館 36.3523740,136.3625206／那谷寺 華王殿 36.3132356,136.4206063／
 *   山代温泉総湯 36.2885922,136.3613506／九谷焼窯跡展示館 36.2939530,136.3662360／芭蕉堂 36.2500325,136.3762074／国分山医王寺 36.2492412,136.3718603／
 *   山中温泉芭蕉の館 36.2461792,136.3738735／総湯 菊の湯（男湯）36.2469404,136.3732751／山中漆器伝統産業会館 36.2561414,136.3718268）、
 *   OSM/Overpass（山代温泉古総湯 36.288966,136.361462／こおろぎ橋 36.240988,136.371668／綾取り橋 36.245468,136.375788／バス停「山中温泉バスターミナル」36.250136,136.374675（温泉街の中）／
 *   山中座は菊の湯（女湯）の点 36.2470176,136.3727801 のとなり（山中座自体の点がないため、菊の湯の向かいとして女湯側の点を使う）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-402-ff3e9cd9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ff3e9cd9-724f-4c8c-80bf-0c0807335c48";
const DAY1_ID = "66266a45-8e0f-4d26-b144-a5d6a995a7cd";
const DAY2_ID = "fc218b15-dd98-490a-8f63-f726c6fb7c75";
const KATAYAMAZU_ID = "c2ed361f-644c-4773-9a89-2b9529c8739f";
const AYATORI_ID = "61714f7b-ec6b-437d-a25d-eb6acd22091e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const WRONG_PHOTO_SOURCE = "20090913%E5%8A%A0%E8%B3%80%E4%B8%89%E6%B9%96Tagged.jpg";
const AYATORI_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/d/d6/AyatoriHashi_2018.jpg";
const AYATORI_PAGE = "https://commons.wikimedia.org/wiki/File:AyatoriHashi_2018.jpg";

const TITLE = "片山津・山代・山中温泉とあやとりはし、加賀温泉郷3つの湯めぐり1泊2日";
const DESCRIPTION =
  "加賀温泉郷の3つの温泉地をめぐる1泊2日。1日目は車で、柴山潟のほとりの片山津温泉から、雪の科学館、岩屋の古刹・那谷寺をめぐり、九谷焼ゆかりの山代温泉で明治の総湯を復元した古総湯に入ります。2日目は山中温泉で、鶴仙渓のこおろぎ橋やあやとりはしを歩き、芭蕉ゆかりの寺や総湯「菊の湯」、山中漆器にふれます。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; lat: number; lng: number; address: string; memo: string };
const cre = (s: NewSpot) => ({ create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } });
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。";

const day1 = [
  {
    id: KATAYAMAZU_ID,
    data: {
      name: "片山津温泉（総湯と柴山潟）", visitTime: t(9, 0), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.345319, lng: 136.368901, address: "石川県加賀市片山津温泉乙65-2",
      memo:
        "柴山潟のほとりに広がる片山津温泉の総湯から旅を始めましょう。2012年に開館した総湯は、建築家・谷口吉生の設計で、外観のほとんどがガラス張りです。建物からは、白山連峰を背景にした柴山潟の眺めが楽しめます。浴室は、湖面と湯船がひと続きに見える「潟の湯」と、森の景色に安らぐ「森の湯」の2つで、男女が定期的に入れ替わります。朝から開いているので、ひと風呂浴びてから出発するのもよいでしょう。" + BATH,
    },
  },
  cre({
    name: "中谷宇吉郎 雪の科学館", h: 10, m: 0, stay: 60, mode: "car", dur: 10, lat: 36.352374, lng: 136.362521, address: "石川県加賀市潮津町イ106",
    memo:
      "総湯から車で約10分。「雪は天から送られた手紙である」の言葉で知られ、初めて人工雪をつくることに成功した中谷宇吉郎を記念して、出身地の片山津に加賀市が建てた科学館で、設計は建築家・磯崎新です。科学、随筆、映画、絵など宇吉郎の多才な業績にふれられ、ダイヤモンドダストや氷のペンダントづくりなど、美しくふしぎな実験も楽しめます。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "那谷寺", h: 11, m: 25, stay: 70, mode: "car", dur: 25, lat: 36.313236, lng: 136.420606, address: "石川県小松市那谷町ユ122",
    memo:
      "雪の科学館から車で約25分。717年に泰澄によって開かれたと伝わるお寺で、白山の神を信仰し、洞窟の中に千手観音をまつっています。洞窟は母の胎内にたとえられ、古くから生まれ変わりを願う「胎内くぐり」の聖地とされてきました。中世の戦乱で伽藍が焼失しましたが、江戸時代に加賀藩3代藩主・前田利常が再興し、今は国の重要文化財の建物7棟と名勝の庭園があります。境内を歩くときは足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "山代温泉の温泉街（昼食）", h: 12, m: 55, stay: 55, mode: "car", dur: 20, lat: 36.288592, lng: 136.361351, address: "石川県加賀市山代温泉",
    memo:
      "那谷寺から車で約20分、山代温泉へ。古くから多くの文化人に愛され、九谷焼が再興された地でもある温泉地です。温泉街の中心「湯の曲輪」には、赤瓦に板張りの外壁の総湯が建ち、九谷焼の作家たちによる手描きのタイルが浴室を彩っています。まわりの食事処で昼食にしましょう。",
  }),
  cre({
    name: "九谷焼窯跡展示館", h: 14, m: 0, stay: 70, mode: "walk", dur: 10, lat: 36.293953, lng: 136.366236, address: "石川県加賀市山代温泉19-101-9",
    memo:
      "湯の曲輪から歩いて約10分。江戸時代前期の古九谷のような色絵磁器を復活させようと、大聖寺の豪商・豊田伝右衛門が江戸時代後期に築いた吉田屋窯の跡（国の史跡）を、発掘されたままの姿で公開しています。九谷焼として現存最古とされる昭和15年の登り窯や、九谷焼の窯元の住まい兼工房だった古民家もあります。絵付けやろくろの体験もできます（要予約）。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "山代温泉 古総湯", h: 15, m: 20, stay: 70, mode: "walk", dur: 10, lat: 36.288966, lng: 136.361462, address: "石川県加賀市山代温泉18-128",
    memo:
      "窯跡展示館から湯の曲輪へ戻って歩いて約10分。明治時代の総湯を復元した共同浴場で、こけら葺きの屋根と2階の窓が印象的です。内装には当時最先端だったステンドグラスが光を落とし、壁は拭き漆、タイルには当時の絵柄を再現した九谷焼が使われています。浴室には蛇口やシャワーがなく、かけ湯をしてから湯船につかる昔ながらの入り方を体験できます。" + BATH + "今夜は加賀温泉郷の宿に泊まります。",
  }),
];

const day2 = [
  cre({
    name: "こおろぎ橋", h: 9, m: 0, stay: 30, mode: null, dur: null, lat: 36.240988, lng: 136.371668, address: "石川県加賀市山中温泉下谷町",
    memo:
      "2日目は山中温泉から。大聖寺川の渓谷・鶴仙渓の上流にかかる、風雅な総ひのき造りの橋です。かつて道がとても危なかったので「行路危」と呼ばれたとも、秋の夜に鳴くこおろぎに由来するともいわれます。四季を通じて山中温泉を代表する景勝地で、多くの湯治客が訪れてきました。",
  }),
  {
    id: AYATORI_ID,
    data: {
      visitTime: t(9, 50), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 36.245468, lng: 136.375788, address: "石川県加賀市山中温泉河鹿町",
      memo:
        "こおろぎ橋から鶴仙渓に沿って歩いて約20分。華道家・勅使河原宏のデザインによる、S字型のユニークな橋です。ほかにない形と、美しい紅紫色のモダンさをあわせもち、橋の上からは鶴仙渓の渓谷を見下ろせます。",
    },
  },
  cre({
    name: "鶴仙渓（黒谷橋・芭蕉堂）", h: 10, m: 30, stay: 40, mode: "walk", dur: 10, lat: 36.250033, lng: 136.376207, address: "石川県加賀市山中温泉東町",
    memo:
      "あやとりはしから遊歩道を下流へ。鶴仙渓は、山中の温泉街に沿って流れる大聖寺川の渓谷で、上流のこおろぎ橋から黒谷橋までの約1.3kmの区間をいい、渓谷沿いに遊歩道が整えられています。下流の黒谷橋のたもとには、松尾芭蕉をまつる芭蕉堂があります。遊歩道は川の近くを通り、ぬれて滑りやすいところもあるので、足元に気をつけて歩きましょう。",
  }),
  cre({
    name: "医王寺", h: 11, m: 20, stay: 40, mode: "walk", dur: 10, lat: 36.249241, lng: 136.37186, address: "石川県加賀市山中温泉薬師町リ1-1",
    memo:
      "黒谷橋から歩いて約10分、温泉街を見下ろす高台に建つ真言宗の古いお寺です。山中温泉を開いた行基の創建と伝えられ、温泉の守護寺として親しまれています。民謡「山中節」にも「西ゃ薬師」と唄われ、展示室には山中温泉の縁起絵巻や、芭蕉が残したと伝わる杖も収められています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "山中温泉の温泉街（昼食）", h: 12, m: 10, stay: 55, mode: "walk", dur: 10, lat: 36.250136, lng: 136.374675, address: "石川県加賀市山中温泉",
    memo:
      "医王寺から温泉街へ下りて、昼食にしましょう。温泉の祖・長谷部神社を中心に広がる「ゆげ街道」には、山中漆器や九谷焼のギャラリー、カフェや食事処が並び、散策が楽しめます。",
  }),
  cre({
    name: "山中温泉 芭蕉の館", h: 13, m: 15, stay: 40, mode: "walk", dur: 10, lat: 36.246179, lng: 136.373874, address: "石川県加賀市山中温泉本町2丁目",
    memo:
      "明治中期の宿屋の建物を生かした資料館で、お茶を飲みながら美しい庭を眺められます。松尾芭蕉ゆかりの資料や、山中漆器の作品も展示されています。休館日は公式の案内で確かめてから訪れましょう。",
  }),
  cre({
    name: "山中座", h: 14, m: 0, stay: 35, mode: "walk", dur: 5, lat: 36.247018, lng: 136.37278, address: "石川県加賀市山中温泉薬師町ム1",
    memo:
      "温泉街の中心にある施設で、館内の内装は、のべ約1500人の山中漆器の職人の手でつくられました。総湯「菊の湯」、温泉民謡「山中節」、山中漆器という山中温泉の3つの魅力を一度に味わえる館です。",
  }),
  cre({
    name: "山中温泉 菊の湯", h: 14, m: 40, stay: 60, mode: "walk", dur: 5, lat: 36.24694, lng: 136.373275, address: "石川県加賀市山中温泉湯の出町レ1",
    memo:
      "山中座のとなりにある、山中温泉の総湯です。山中温泉は1300年の歴史をもつといわれる温泉地で、「奥の細道」の旅の途中に訪れた芭蕉も気に入り、「山中や菊は手折らじ湯の匂い」と詠みました。総湯は「菊の湯」と呼ばれ、男湯と女湯が別の建物になって並んでいます。地元の人も通う、さらりとしたお湯です。" + BATH + "休館日は公式の案内で確かめてください。",
  }),
  cre({
    name: "山中塗うるし座（山中漆器伝統産業会館）", h: 15, m: 55, stay: 35, mode: "taxi", dur: 10, lat: 36.256141, lng: 136.371827, address: "石川県加賀市山中温泉塚谷町イ268-2",
    memo:
      "温泉街からタクシーで約10分。山中漆器の歴史を語る名品から、今の名工の作品まで伝統工芸品を広く展示し、日用の食器から茶道具まで山中漆器を販売しています。旅の最後に、器のお土産を選びましょう。閉館の時間と休館日は公式の案内で確かめてください。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  if (days[0].spots.map((s) => s.id).join() !== KATAYAMAZU_ID || days[1].spots.map((s) => s.id).join() !== AYATORI_ID) throw new Error("既存スポットが想定と違います");
  const wrong = await prisma.photo.findMany({ where: { spotId: AYATORI_ID } });
  if (wrong.length !== 1 || !wrong[0].sourceUrl?.includes(WRONG_PHOTO_SOURCE)) throw new Error("あやとりはしの写真が想定と違います");
  console.log(`外す写真: ${wrong[0].sourceUrl}`);

  console.log(`タイトル: ${TITLE}
説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === KATAYAMAZU_ID ? "片山津温泉(既存)" : "あやとりはし(既存)") : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(AYATORI_IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const jpeg = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
  const blob = await put("fix-402/ayatorihashi.jpg", jpeg, { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.photo.delete({ where: { id: wrong[0].id } });
      await tx.photo.create({ data: { spotId: AYATORI_ID, url: blob.url, sourceUrl: AYATORI_PAGE, author: "藤谷良秀", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0" } });
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

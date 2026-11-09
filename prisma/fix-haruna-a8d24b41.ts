/**
 * 伊香保グリーン牧場で動物とふれあう、家族で楽しむ高原プラン(a8d24b41)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の a8d24b41 の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - 伊香保グリーン牧場は会社が営む有料の体験施設なので6章で外す。牧場を外すと水澤寺・石段街・露天風呂が 8e7d688e と重なるため、
 *   題を榛名(榛名神社・榛名湖)の側に移し、伊香保の場所は河鹿橋の1つだけ残す(エリア「伊香保温泉」はつないだまま。企画運営 11/05)
 * - 旅の足: 渋川駅の近くでレンタカー(手続き15分)。帰りは渋川駅の近くで車を返す
 * - 点: 河鹿橋 36.492077,138.914869(8e7d688e・7f723012 と同じ)、ビジターセンター way263787574(Nominatim)、
 *   榛名富士山頂 node747066532、昼食 バス停「榛名湖」node10132662092、天神峠 mountain_pass node922076357(石燈籠は峠の頂上)、
 *   榛名歴史民俗資料館 tourism=museum way389223149、榛名神社 門前のバス停「榛名神社」node10125899899(着く側の名前のある点。本社 way631522240 までの参道の往復は滞在の中。法務 11/05)
 * - 区間(routing.openstreetmap.de、車は秒から切り上げ＋5、歩きは切り上げ): 渋川駅→河鹿橋 1111.0秒→24(書き出し)、河鹿橋→ビジターセンター 822.5→19、
 *   ビジターセンター→榛名高原駅 300.4→6、ロープウェイ 待ち15(15分間隔)＋乗車3(2分50秒)、帰りも同じ、榛名高原駅→ビジターセンター 300.4→6、
 *   ビジターセンター→榛名湖バス停 167.9→8、榛名湖→天神峠 55.7→6、天神峠→資料館 368.4→12、資料館→榛名神社のバス停(歩) 108.6→2、
 *   榛名神社バス停→渋川駅 2198.7→42(帰りの一文)
 * - 時刻: 9:30〜16:40。昼食 13:00
 * - 出典:
 *   河鹿橋 city.shibukawa.lg.jp/kankou/event/matsuri/p000308.html(湯元付近、新緑と紅葉の名所、紅葉は10月下旬から11月中旬、
 *     老朽化のため改修し令和8年2月19日から通行可、たもとの駐車は18台程度)、gunma-kanko.jp/spots/166(朱色の太鼓橋)
 *   ビジターセンター・散策路・榛名山 pref.gunma.jp/page/1223.html(動植物や地質の面から成り立ちを紹介、9時〜15時45分・水曜14時45分まで、
 *     火曜と金曜休館、ハイキングコース「榛名湖畔(20分)ビジターセンターわき→…」、掃部ケ岳1449m、カルデラと火口湖)
 *   ロープウェイ・山頂 tanigawadake-rw.com/haruna/(15分間隔、所要2分50秒、強風・雷・積雪で見合わせ、榛名富士山神社 木花開耶姫命 明治42年に榛名神社の末社)、
 *     pref.gunma.jp/page/1223.html(湖畔と山頂1,391mを約3分、赤城山や秩父・谷川連峰、遠くは日本アルプス)
 *   天神峠の石燈籠 city.takasaki.gunma.jp/site/cultural-assets/5551.html(峠の頂上、塩原太助の寄進とされる、高さ7m以上、市指定。出典の「文化2年(1815)」は年号と西暦が食い違うので年は書かない。法務 11/05)
 *   資料館 city.takasaki.gunma.jp/soshiki/91/(昭和60年10月開館、榛名神社や宿坊の資料)・/site/cultural-assets/4643.html(9:30〜16:00、火曜休館)
 *   榛名神社 haruna.or.jp/?page_id=14(延長5年の神名帳に上野国十二社、天海僧正による復興)・?page_id=18(本社・幣殿・拝殿は国の重要文化財、
 *     文化3年の再建、本社は御姿岩に接し岩奥に御神体)・?page_id=20(バス停から徒歩15分)・トップ(10月1日から閉門17時)
 *   冬: 道は県の冬期閉鎖に入っていない(pref.gunma.jp/page/11074.html)が、ロープウェイの冬の運行が公式で確かめられないため季節から冬を外す(企画運営 11/05)
 * - 写真: 牧場の写真はスポットと一緒に消える。榛名湖の写真をビジターセンターの行き先に残し、表紙にする
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-haruna-a8d24b41.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "a8d24b41-ba0b-4c96-944e-5d2be0e4433b";
const DAY_ID = "7fb1220f-3b96-4ebf-bde9-319243c27562";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine?: string };
const legs = (...xs: [string, number, string?][]): Leg[] =>
  xs.map(([mode, min, line], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, ...(line ? { transitLine: line } : {}) }));
const L = (...xs: [string, number, string?][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number, string?][]) => ({ create: legs(...xs) });

const BOKUJO = "113d5146-2d17-447b-bbe2-ff626466741b"; // 外す
const MIZUSAWA = "091174fc-5f22-4e79-8d53-3bf281ec4af5"; // 外す
const ISHIDAN = "73317ed8-07f9-40c3-b29d-0b84d9820e3f"; // 外す
const ROTEN = "e4fc42f6-86ce-47df-9ebe-09df4dd0041a"; // 外す
const KAJIKA = "51b96a00-f62e-4644-9865-2ccba4b460f8";
const HARUNAKO = "d5b3fddf-d176-451e-8039-9ed40948fa6c"; // ビジターセンターと湖畔の散策路に改名
const REMOVE = [BOKUJO, MIZUSAWA, ISHIDAN, ROTEN];

const EXPECT: Record<string, string> = {
  [BOKUJO]: "伊香保グリーン牧場", [MIZUSAWA]: "水澤寺", [ISHIDAN]: "伊香保石段街", [ROTEN]: "伊香保露天風呂", [KAJIKA]: "河鹿橋", [HARUNAKO]: "榛名湖",
};
const PHOTOS_EXPECT = ["d4777eba-03f9-4355-b558-65bbbce0273d", "2eafd61e-8d30-476e-9928-26b767cd352d"].sort();
const THUMB_OLD =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-08/%25E4%25BC%258A%25E9%25A6%2599%25E4%25BF%259D%25E3%2582%25B0%25E3%2583%25AA%25E3%2583%25BC%25E3%2583%25B3%25E7%2589%25A7%25E5%25A0%25B4-EQkJgUP8Bi54ZYf6KqUEEM3gayLRwT.jpg";
const THUMB_NEW =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/photoadd-20261012-b12/%25E6%25A6%259B%25E5%2590%258D%25E6%25B9%2596-JnuVaThfcIkekqJh2vsy0tgQNMPgcJ.jpg";

const TITLE_OLD = "伊香保グリーン牧場で動物とふれあう、家族で楽しむ高原プラン";
const TITLE_NEW = "榛名神社と榛名湖、伊香保の河鹿橋から榛名山をめぐる日帰りプラン";
const DESC_OLD = "羊やアルパカなどの動物とふれあえる伊香保グリーン牧場を中心に、高原の爽やかな空気を満喫する、家族向けのプランです。";
const DESC_NEW =
  "渋川駅でレンタカーを借りて、伊香保温泉の河鹿橋から榛名山へ。榛名湖のほとりで県立榛名公園ビジターセンターと湖畔の散策路を歩き、ロープウェイで榛名富士の山頂へ。午後は天神峠の石燈籠、高崎市の榛名歴史民俗資料館、国の重要文化財の社殿が残る榛名神社をたずねる日帰りプランです。ビジターセンターと資料館は火曜日などが休館日なので、事前に確かめましょう。";

const SEASONS_OLD = ["spring", "summer", "autumn", "winter"];
const SEASONS_NEW = ["spring", "summer", "autumn"]; // ロープウェイの冬の運行が公式で確かめられないため冬を外す(企画運営 11/05)

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  kajika:
    "渋川駅の近くでレンタカーを借りて(手続きに15分ほど)、車でおよそ24分、伊香保温泉の湯元のあたりに架かる河鹿橋に着きます。春の新緑と秋の紅葉の名所として知られる朱色の太鼓橋で、腐食などの傷みが進んでいたため改修され、令和8年(2026)2月から再び渡れるようになりました。紅葉の見ごろは、例年10月下旬から11月中旬です。橋のたもとの駐車スペースは台数が限られています。この後は、車でおよそ19分、榛名湖のほとりの県立榛名公園ビジターセンターへ向かいましょう。",
  vc:
    "河鹿橋から車でおよそ19分、榛名湖のほとりの県立榛名公園ビジターセンターに着きます。榛名山の成り立ちや今の姿を、動植物と地質の面から紹介する群馬県の施設です。榛名山は、最高峰の掃部ケ岳(1449m)などの外輪山と、中央火口丘の榛名富士などからなり、山頂のカルデラの中で、火口湖の榛名湖が水をたたえています。ビジターセンターのわきからは、木立の中を歩く平らな湖畔の散策路が湖の北側へ続いていて、片道20分ほどで歩けます。開館は9:00〜15:45(水曜は14:45まで)で、火曜日と金曜日は休館です。この後は、歩いておよそ6分の高原駅から、ロープウェイで榛名富士の山頂へ向かいましょう。",
  summit:
    "ビジターセンターから歩いておよそ6分の高原駅でロープウェイに乗り、およそ3分で榛名富士の山頂に着きます。ロープウェイは15分おきに動いていて、待つ時間も見ておきましょう。強風などで運転を見合わせることがあるので、運行は公式で確かめましょう。標高1,391mの山頂からは、晴れた日には赤城山や秩父・谷川の山々、遠くは日本アルプスまで見渡せます。山頂には、木花開耶姫命をまつり、明治42年(1909)に榛名神社の末社となった榛名富士山神社があります。" +
    PRAY +
    "この後は、ロープウェイで湖畔へ戻り、車でおよそ8分、榛名湖のあたりへ向かいましょう。",
  lunch:
    "榛名富士の山頂からロープウェイで湖畔へ戻り、車でおよそ8分、榛名湖のあたりに着きます。このあたりで昼食にしましょう。この後は、車でおよそ6分、天神峠へ向かいましょう。",
  tenjin:
    "榛名湖のあたりから車でおよそ6分、天神峠に着きます。峠の頂上には、榛名湖を望むように大きな石燈籠が立っています。江戸時代の後期に、江戸本所の豪商・塩原太助が寄進したとされ、高さは7m以上あり、高崎市の重要有形民俗文化財に指定されています。この後は、車でおよそ12分、榛名歴史民俗資料館へ向かいましょう。",
  shiryo:
    "天神峠から車でおよそ12分、榛名神社の門前の榛名歴史民俗資料館に着きます。旧榛名町の歴史や民俗の資料を集め、伝えるために昭和60年(1985)に開かれた高崎市の資料館で、榛名神社や門前の宿坊などに伝わる資料を通して、古くから榛名山に祈りをささげてきた人々の暮らしを紹介しています。開館は9:30〜16:00で、火曜日(祝日のときは翌日)などは休館です。この後は、歩いておよそ2分、榛名神社の門前へ向かいましょう。",
  shrine:
    "榛名歴史民俗資料館から歩いておよそ2分、榛名神社の門前に着きます。延長5年(927)にまとめられた記録の『神名帳』に、上野国十二社の一つとして載る古い神社で、江戸時代の初めには天海僧正によって復興されたと伝わります。門前のバス停から本社までは、杉木立の中の参道を歩いて15分ほどで、往復で30分ほどかかります。参道には石段や坂があるので、足もとに気をつけて歩きましょう。本社・幣殿・拝殿は文化3年(1806)に建て直されたもので、国の重要文化財に指定されています。本社は御姿岩に接していて、その岩の奥に御神体がまつられています。" +
    PRAY +
    "開門と閉門の時刻は季節で変わるので、公式で確かめましょう。旅を締めくくったら、門前から資料館のそばに置いた車へ戻り、渋川駅まで車でおよそ42分です。駅の近くで車を返しましょう。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "河鹿橋(既存。1か所目へ。点 36.492077,138.914869 のまま、区間なし)",
    item: { id: KAJIKA, data: { lat: "36.492077", lng: "138.914869", visitTime: T(9, 30), stayDurationMin: 20, memo: M.kajika, transitLegs: { deleteMany: {} } } },
  },
  {
    label: "県立榛名公園ビジターセンターと湖畔の散策路(既存の榛名湖を改名。点 way263787574、車19。榛名湖の写真はそのまま)",
    item: {
      id: HARUNAKO,
      data: {
        name: "県立榛名公園ビジターセンターと湖畔の散策路", address: "高崎市榛名湖町845", lat: "36.471711", lng: "138.873813",
        visitTime: T(10, 9), stayDurationMin: 85, memo: M.vc, transitLegs: L(["car", 19]),
      },
    },
  },
  {
    label: "榛名富士山頂(新規。点 node747066532。歩き6、待ち15、ロープウェイ3)",
    item: {
      create: {
        name: "榛名富士山頂", lat: "36.47549", lng: "138.877833", visitTime: T(11, 58), stayDurationMin: 30, memo: M.summit,
        transitLegs: C(["walk", 6], ["other", 15], ["other", 3, "ロープウェイ"]),
      },
    },
  },
  {
    label: "榛名湖のあたりで昼食(新規。点 バス停「榛名湖」node10132662092。ロープウェイ3、待ち15、歩き6、車8)",
    item: {
      create: {
        name: "榛名湖のあたりで昼食", lat: "36.470183", lng: "138.863843", visitTime: T(13, 0), stayDurationMin: 40, memo: M.lunch,
        transitLegs: C(["other", 3, "ロープウェイ"], ["other", 15], ["walk", 6], ["car", 8]),
      },
    },
  },
  {
    label: "天神峠の石燈籠(新規。点 mountain_pass「天神峠」node922076357、車6)",
    item: { create: { name: "天神峠の石燈籠", address: "高崎市榛名湖町", lat: "36.470064", lng: "138.859169", visitTime: T(13, 46), stayDurationMin: 15, memo: M.tenjin, transitLegs: C(["car", 6]) } },
  },
  {
    label: "榛名歴史民俗資料館(新規。点 tourism=museum way389223149、車12)",
    item: {
      create: {
        name: "榛名歴史民俗資料館", address: "高崎市榛名山町138-1", lat: "36.452959", lng: "138.848338",
        visitTime: T(14, 13), stayDurationMin: 45, memo: M.shiryo, transitLegs: C(["car", 12]),
      },
    },
  },
  {
    label: "榛名神社(新規。点 門前のバス停「榛名神社」node10125899899、本社までの参道の往復は滞在の中。歩き2、帰りの一文)",
    item: {
      create: {
        name: "榛名神社", lat: "36.453844", lng: "138.84811",
        visitTime: T(15, 0), stayDurationMin: 100, memo: M.shrine, transitLegs: C(["walk", 2]),
      },
    },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true, seasons: true } });
  if (JSON.stringify(it?.seasons) !== JSON.stringify(SEASONS_OLD)) throw new Error(`季節が想定と違います: ${JSON.stringify(it?.seasons)}`);
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (it?.thumbnailUrl !== THUMB_OLD) throw new Error(`表紙が想定と違います: ${it?.thumbnailUrl}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, url: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  if (!photos.some((p) => p.url === THUMB_NEW)) throw new Error("新しい表紙の写真(榛名湖)が見つかりません");

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: ${SEASONS_OLD.join(",")} → ${SEASONS_NEW.join(",")}(冬を外す)\n表紙: 牧場の写真 → 榛名湖の写真(今ある写真)\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = d.transitLegs as { create?: Leg[]; deleteMany?: object } | undefined;
    const legsStr = lg?.create
      ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+")
      : lg?.deleteMany ? "(区間を消す)" : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("  写真: 牧場の写真はスポットと一緒に消える。榛名湖の写真はビジターセンターの行き先に残す");
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:00(13:30より前)/ 終わり 榛名神社 16:40(日帰りの 16:30〜17:00、閉門17:00の前)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, thumbnailUrl: THUMB_NEW, seasons: SEASONS_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

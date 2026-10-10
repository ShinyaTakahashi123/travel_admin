/**
 * #83 afb492ce（武家屋敷通りを歩く、「みちのくの小京都」角館さんぽ日帰りプラン）
 *
 * 決まり4か所以上・9時〜17時の見直し。既存は角館武家屋敷通り・角館樺細工伝承館の
 * 2か所のみで、4か所未満・終了とも規定外だった。決まりAにもとづき実在するスポットを
 * 追加し、企画運営の指摘に3ラウンドで対応した経緯を含む(下記コメント参照)。
 *
 * 座標: すべてNominatim(OSM)で確認。
 *
 * 【1巡目】安藤醸造・角館歴史村青柳家・桧木内川堤を追加(5か所09:30〜15:10、終了が
 * 短めのため企画運営に相談)。
 *
 * 【2巡目・企画運営の指摘6点】
 * 1) 新潮社記念文学館・平福記念美術館を追加し終了を16:32に(石黒家は令和8年11月30日に
 *    一般公開休止予定のため見送り)
 * 2) 武家屋敷通りの滞在95分→70分に短縮。昼食は青柳家(80分)にまとめる
 * 3) 青柳家の「写真美術館」→公式の「幕末写真館」に訂正、出典のない「刀を持ち上げる
 *    体験」を削除。公式(http://www.samuraiworld.com/)の施設名(母屋・武器庫・
 *    解体新書記念館・秋田郷土館・武家道具館・ハイカラ館・幕末写真館・時代体験庵)にあわせる
 * 4) 武家屋敷通り「お楽しみください」→「楽しんでください」、樺細工伝承館
 *    「感じていただけることと思います」→「感じられます」
 * 5) 安藤醸造の「自慢の」を削除
 * 6) 桧木内川堤の「春先」→「春(例年4月下旬ごろ)」
 *
 * 【3巡目・企画運営の指摘3点】
 * 1) 平福記念美術館は「親子2代の作品を見せる小さめの市立美術館」であり85分は長い
 *    (決まりA)。また冬季(12〜3月)は16:30閉館・16:00最終入館
 *    (仙北市公式 https://www.city.semboku.akita.jp/sightseeing/hirafuku/riyou.html。
 *    4〜11月は17:00閉館・16:30最終入館)。青柳家→平福記念美術館(60分)→桧木内川堤
 *    (最後、16:30ごろ終了)の順に入れ替え、美術館の滞在中に冬季の閉館時刻を超えない
 *    位置に配置した。
 * 2) 新潮社記念文学館の「17歳で東京へ出て新潮社の前身となる出版社を興し」は、17歳で
 *    会社を興したように読めるため訂正。佐藤義亮は明治11年(1878)2月18日生まれ、
 *    明治28年(1895)3月に17歳で上京し(出典: Wikipedia「佐藤義亮」
 *    https://ja.wikipedia.org/wiki/佐藤義亮)、印刷所で働くなどしたのち、
 *    明治29年(1896)7月10日、18歳で新声社を興して雑誌『新声』を創刊したと確認できた
 *    (同上。秋田県立博物館 https://www.akihaku.jp/digital/collection/contents.php?serial_no=73&category=8&lang=
 *    も1896年の新声社創立を確認しているが、上京時の年齢の記載はなかったため、
 *    年齢の出典はWikipediaのみ)。
 * 3) このファイルを記録として残す(admin-site/prisma/fix-83-afb492ce.ts)。プッシュは
 *    10/5まで保留(admin-site/prisma/配下のスクリプトはCLAUDE.mdの例外ルール対象)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ANDOJOZO_MEMO =
  "旅の始まりは安藤醸造です。嘉永6年(1853)創業の味噌・醤油の醸造元で、代々角館の地主を務めてきた安藤家が、副業として醸造業を手がけたのが始まりと伝えられています。本店には、東北でも最も古いとされる「座敷蔵」と「文庫蔵」がれんが造りのまま残されており、座敷蔵は今も冠婚葬祭の場として使われています。蔵の中を見学したあとは、味噌や醤油の試食もでき、伝統の製法から生まれる味わいを確かめることができます。この後は、歩いておよそ5分、新潮社記念文学館へ向かいましょう。";

const SHINCHOSHA_MEMO =
  "安藤醸造から歩いておよそ5分、新潮社記念文学館に着きます。出版社・新潮社の創業者で、角館町出身の佐藤義亮の生涯と功績を紹介する文学館です。義亮は明治28年(1895)、17歳で単身東京へ出て、印刷所で働くなどしたのち、明治29年(1896)、新潮社の前身となる新声社を興して雑誌『新声』を創刊し、のちに数々の文豪の作品を世に送り出す出版社へと育て上げました。館内には、義亮の直筆原稿や書簡、新潮社にゆかりのある文豪たちの資料が展示されており、角館から日本の近代文学を支えた一人の生涯をたどることができます。この後は、歩いておよそ9分、角館武家屋敷通りへ向かいましょう。";

const BUKEYASHIKI_MEMO =
  "新潮社記念文学館から歩いておよそ9分、角館武家屋敷通りに着きます。江戸時代の武家町の面影を色濃く残す、国の重要伝統的建造物群保存地区です。この地を治めた佐竹北家の初代・義隣は、京都の公家の家から養子に入った人物で、望郷の思いから角館の地に「小倉山」「加茂川」など京都にちなむ名を付けたと伝えられています。義隣の子・義明のもとに京都から嫁いだ妻が持参した3本の苗木が始まりと伝えられるしだれ桜は、今では400本ほどに増えて通りを彩り、樹齢300年を超える古木も多く、162本が国の天然記念物に指定されています。この歴史が、角館が「みちのくの小京都」と呼ばれる由来のひとつになっています。黒板塀が続く通り沿いには、内部を公開している屋敷も多く、当時の武家の暮らしぶりをうかがい知ることができます。しだれ桜と黒板塀が織りなす「みちのくの小京都」の町並みを、ゆっくりと歩いて楽しんでください。この後は、歩いておよそ5分、角館樺細工伝承館へ向かいましょう。";

const KABAZAIKU_MEMO =
  "武家屋敷通りから歩いておよそ5分、角館樺細工伝承館に着きます。樺細工は、山桜の樹皮を使った角館ならではの工芸品で、天明年間(1781〜1789)ごろ、佐竹北家の武士・藤村彦六がよそから製法を伝えたのが始まりとされています。もともとは下級武士の内職として、印籠や根付などが手がけられていましたが、明治維新後、職を失った武士たちがこれを本業とするようになり、角館を代表する産業へと育っていきました。館内には、木肌の美しさを生かした茶筒や文箱などの製品が並び、山桜の樹皮とは思えないほどの精巧な仕上がりに驚かされます。武家屋敷の町並みを歩いたあとにこの伝承館を訪れると、武士の暮らしと手仕事のつながりが、より身近に感じられます。この後は、歩いておよそ3分、角館歴史村・青柳家へ向かいましょう。";

const AOYAGIKE_MEMO =
  "角館樺細工伝承館から歩いておよそ3分、角館でも指折りの規模を誇るとされる武家屋敷、角館歴史村・青柳家に着きます。佐竹北家の重臣を務めた青柳家の屋敷を公開したもので、広い敷地には、当時のままの主屋のほか、武具を展示する武器庫、『解体新書』にゆかりの品を集めた解体新書記念館、秋田の郷土資料を展示する秋田郷土館、生活道具を紹介する武家道具館、洋館のハイカラ館、幕末の写真資料を展示する幕末写真館など、複数の見学施設が点在しています。時代体験庵では、着物の試着体験も楽しめます。四季折々の表情を見せる庭園も見どころの一つで、青々とした木々や苔むした庭石が、屋敷の落ち着いた佇まいを引き立てています。ここで昼食にするのもおすすめです。敷地が広く見どころも多いので、時間に余裕を持って歩いてみてください。この後は、歩いておよそ5分、平福記念美術館へ向かいましょう。";

const HIRAFUKU_MEMO =
  "角館歴史村・青柳家から歩いておよそ5分、仙北市立角館町平福記念美術館に着きます。角館出身の日本画家・平福穂庵と、その子で同じく日本画家として活躍した平福百穂、親子2代の作品を中心に紹介する美術館です。穂庵は幕末から明治にかけて、狩野派や円山四条派の画法を学びながら独自の画風を確立し、百穂もまた、父の画業を受け継ぎながら、近代日本画の新しい表現を切り開いた画家として知られています。角館が育んだ絵師たちの作品に、じっくりとふれてみてください。この後は、歩いておよそ5分、桧木内川堤へ向かいましょう。";

const HINOKINAIGAWA_MEMO =
  "平福記念美術館から歩いておよそ5分、角館の町を流れる桧木内川の堤に着きます。左岸の堤防上には、総延長およそ1,950mにわたってソメイヨシノの並木道が続いており、昭和9年(1934)、地元の住民有志や小中学生の手によって苗木が植えられたのが始まりと伝えられています。桜のトンネルが見られるのは春(例年4月下旬ごろ)のわずかな期間だけですが、それ以外の季節も、川のせせらぎを聞きながら歩ける気持ちの良い散策路として親しまれています。武家屋敷通りの重厚な黒板塀とはまた違う、開放的な川辺の景色を眺めながら、旅の締めくくりに歩いてみてください。安藤醸造から武家屋敷通り、青柳家とめぐった、角館さんぽも、ここで無事に終了です。お疲れさまでした。";

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: { contains: "武家屋敷通りを歩く" } },
    select: { id: true },
  });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const byName = (n: string) => {
    const s = day.spots.find((x) => x.name === n);
    if (!s) throw new Error(`見つかりません: ${n}`);
    return s.id;
  };
  const ANDOJOZO = byName("安藤醸造");
  const SHINCHOSHA = byName("新潮社記念文学館");
  const BUKEYASHIKI = byName("角館武家屋敷通り");
  const KABAZAIKU = byName("角館樺細工伝承館");
  const AOYAGIKE = byName("角館歴史村・青柳家");
  const HIRAFUKU = byName("平福記念美術館");
  const HINOKINAIGAWA = byName("桧木内川堤");

  const spots: SpotOrderItem[] = [
    { id: ANDOJOZO, data: { memo: ANDOJOZO_MEMO, visitTime: t(9, 30), stayDurationMin: 35, transitMode: null, transitDurationMin: null, transitLine: null } },
    { id: SHINCHOSHA, data: { memo: SHINCHOSHA_MEMO, visitTime: t(10, 10), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: BUKEYASHIKI, data: { memo: BUKEYASHIKI_MEMO, visitTime: t(10, 54), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 9, transitLine: null } },
    { id: KABAZAIKU, data: { memo: KABAZAIKU_MEMO, visitTime: t(12, 9), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: AOYAGIKE, data: { memo: AOYAGIKE_MEMO, visitTime: t(12, 57), stayDurationMin: 80, transitMode: "walk", transitDurationMin: 3, transitLine: null } },
    { id: HIRAFUKU, data: { memo: HIRAFUKU_MEMO, visitTime: t(14, 22), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { id: HINOKINAIGAWA, data: { memo: HINOKINAIGAWA_MEMO, visitTime: t(15, 27), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const stay = d.stayDurationMin as number;
    console.log(`${hm(st)}-${hm(st + stay)} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}分${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} memo${String(d.memo).length}字`);
    prevEnd = st + stay;
  }
  console.log(`終了: ${hm(prevEnd)}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day.id, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

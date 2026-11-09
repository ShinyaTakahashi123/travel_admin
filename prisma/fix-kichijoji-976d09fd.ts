/**
 * 井の頭公園とジブリ美術館、吉祥寺さんぽ日帰りプラン(976d09fd)の組み直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 976d09fd の欄(組み直しが要るしおり)。11/05 0時に制作から制作補助2へ移った分。
 * - 8aa6d1e5・ff50f5a4 と行き先が大きく重なるため、題の中心の井の頭恩賜公園・ジブリ美術館と、この本だけの井の頭弁財天を残し、
 *   玉川上水緑道・禅林寺・山本有三記念館・井の頭自然文化園・武蔵野八幡宮・ハーモニカ横丁を外す(企画運営 11/05)
 * - 代わりに、井の頭池と同じ武蔵野の湧き水でつながる国分寺(本番にしおりのない場所)を午前に入れる。昼食がなかったので足す。題・説明文の「定番」を外す
 * - 点: 殿ヶ谷戸庭園 受付の「サービスセンター」way568436069(Nominatim の中心。国分寺駅の南口から入る側。法務 11/05)、真姿の池 way767787508(Nominatim)、
 *   湧水園・資料館 入口の案内板「旧本多家住宅長屋門」node7168646962(お鷹の道から着く側の入口。企画運営 11/05)、
 *   武蔵国分寺跡 金堂跡 node1695675145、昼食 JR西国分寺駅 node2559434140(メモが駅のあたり)、
 *   ジブリ way1558848181(8aa6d1e5 と同じ)、弁財天 way305689256(今のまま)、井の頭恩賜公園 七井橋 way31877607(8aa6d1e5・ff50f5a4 と同じ)
 * - 区間(routing.openstreetmap.de routed-foot、秒から切り上げ): 国分寺駅→サービスセンター 235.8秒→4、サービスセンター→真姿の池 1006.0→17、真姿の池→長屋門 141.8→3、
 *   長屋門→金堂跡 226.1→4、金堂跡→西国分寺駅 1110.1→19、三鷹駅→ジブリ 1169.4→20、ジブリ→弁財天 598.2→10、弁財天→七井橋 247.3→5、
 *   七井橋→吉祥寺駅 484.5→9(帰りの一文)。電車 西国分寺→三鷹 17(JR の11月の時刻表で平日昼の上り 12〜16分＋1)
 * - 時刻: 9:30〜16:45。昼食 12:23。ジブリは13時の回(指定時刻から1時間以内に入場)に 13:40 着
 * - 湧水園の点は入口の案内板。7章の「着く側の入口・案内板」として扱い、例外の記録はいらない(企画運営 11/05)。
 *   サービスセンターは庭園の面(relation8098366)の北の端、名前のない門 node5468753981 から約50mの中にある
 * - 出典: 殿ヶ谷戸 tokyo-park.or.jp/park/tonogayato/index.html、お鷹の道・真姿の池 city.kokubunji.tokyo.jp/shisetsu/kouen/1005195/1004229.html、
 *   湧水園 …/shisetsu/kouen/1005196/1004237.html、資料館 …/1005196/1004239.html、武蔵国分寺跡 …/1005196/1004222.html、
 *   長屋門 kokubunji-citypro.jp/article/879/、ジブリ ghibli-museum.jp/ticket/・/about/、
 *   ジブリ・弁財天・風の散歩道 city.mitaka.lg.jp/c_service/056/056884.html、
 *   井の頭恩賜公園 kensetsu.metro.tokyo.lg.jp/jimusho/seibuk/inokashira/index.html・/midokoro/index
 * - 電車: timetables.jreast.co.jp/2611/timetable/tt1156/1156040.html(西国分寺 中央線 上り 平日)、
 *   列車 timetables.jreast.co.jp/2611/train/155/158541.html(12:01→三鷹12:17)・158551(12:10→12:23)・158571(12:14→12:30)・158701(13:10→13:22)
 * - 写真: Commons から4枚(殿ヶ谷戸・真姿の池・国分寺跡・弁財天)。弁財天の写真を表紙に。ジブリの写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-kichijoji-976d09fd.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";
import { fetchCommonsImageInfo, uploadCommonsFile } from "./lib/commons-photo";

const commit = process.argv.includes("--commit");
const ITIN_ID = "976d09fd-43f3-4440-8fcf-373554fe6b8d";
const DAY_ID = "884a7d0f-b5af-42e9-81cc-f02d157d9ca2";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number; transitLine?: string };
const legs = (...xs: [string, number, string?][]): Leg[] =>
  xs.map(([mode, min, line], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min, ...(line ? { transitLine: line } : {}) }));
const L = (...xs: [string, number, string?][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number, string?][]) => ({ create: legs(...xs) });

const JOSUI = "d699fc6f-38e4-4fab-8db6-ed246e878f10"; // 外す
const ZENRIN = "7380b6c1-2dab-43bb-af21-52038427e1de"; // 外す
const YUZO = "f9e4033c-203c-4188-ada5-ed529224175d"; // 外す
const GHIBLI = "5ec0e2c6-f241-4402-9ddb-026815350ac5";
const BUNKAEN = "14a1f2f5-6f57-4c01-83d0-1c15330b216e"; // 外す
const PARK = "2f25848f-f000-4655-90c2-0c216e2349ce";
const BENTEN = "343321f3-cc4e-4030-8ba5-3de2267ef440";
const HACHIMAN = "b63083a8-a62d-4f76-a45f-3a41d11d47f1"; // 外す
const HARMONICA = "a13d4f67-8b1d-4bd9-af05-791e60998b02"; // 外す
const REMOVE = [JOSUI, ZENRIN, YUZO, BUNKAEN, HACHIMAN, HARMONICA];

const EXPECT: Record<string, string> = {
  [JOSUI]: "玉川上水緑道", [ZENRIN]: "禅林寺（太宰治の墓）", [YUZO]: "山本有三記念館", [GHIBLI]: "三鷹の森ジブリ美術館",
  [BUNKAEN]: "井の頭自然文化園", [PARK]: "井の頭恩賜公園", [BENTEN]: "井の頭弁財天", [HACHIMAN]: "武蔵野八幡宮", [HARMONICA]: "ハーモニカ横丁",
};
const GHIBLI_PHOTO = "cd777aaf-67ee-4c04-a2d3-2622dcdb4fc9"; // そのまま
const PHOTOS_EXPECT = [
  "b7dce502-8c6a-4f9b-9285-6fbf675619e0", "39d4a6cc-843a-4fa4-be53-89cea5453a23", "2bf3e629-bf53-4785-b520-3edd7b90c3d3",
  GHIBLI_PHOTO, "556c5086-2169-4943-a321-d390b6ba25f4",
].sort();
const THUMB_OLD =
  "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/batch2/%25E7%258E%2589%25E5%25B7%259D%25E4%25B8%258A%25E6%25B0%25B4%25E7%25B7%2591%25E9%2581%2593-vgAwvhDNOdnvMONhVgFxSOBJs3NTp2.jpg";
const BLOB_PREFIX = "rework-20261105-976d09fd";

const TITLE_OLD = "井の頭公園とジブリ美術館、吉祥寺さんぽ日帰りプラン";
const TITLE_NEW = "井の頭公園とジブリ美術館、国分寺の湧き水もたどる日帰りプラン";
const DESC_OLD =
  "玉川上水緑道の散策から、太宰治が眠る禅林寺、山本有三記念館、三鷹の森ジブリ美術館、武蔵野八幡宮まで。緑と文学、映画の世界を1日で楽しむ、吉祥寺・三鷹の定番プランです。";
const DESC_NEW =
  "国分寺の殿ヶ谷戸庭園、名水百選のお鷹の道・真姿の池、武蔵国分寺跡を歩いたあと、JR中央線で三鷹へ。三鷹の森ジブリ美術館(日時指定の予約制)を見学し、井の頭弁財天と井の頭池のほとりで1日を終える、武蔵野の湧き水をたどる日帰りプランです。おたかの道湧水園とジブリ美術館は休みの日が違うので、事前に確かめましょう。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  tono:
    "JR中央線の国分寺駅で降り、南口から歩いておよそ4分、殿ヶ谷戸庭園からこの日を始めます。武蔵野の段丘の崖と、その下に刻まれた谷の地形をそのまま庭に取り込んだ回遊式林泉庭園です。大正2年から4年(1913〜1915)にかけて江口定條の別荘として整えられ、昭和4年(1929)に岩崎家の別邸となりました。のちに都が買い取り、昭和54年(1979)に庭園として開かれ、平成23年(2011)には国の名勝に指定されています。崖下の池に注ぐ湧き水は、古くは「次郎弁天の清水」と呼ばれた名水です。開園は9:00〜17:00(入園は16:30まで)で、休みは12月29日から1月1日までです。この後は、歩いておよそ17分、お鷹の道・真姿の池湧水群へ向かいましょう。",
  masugata:
    "殿ヶ谷戸庭園から歩いておよそ17分、国分寺崖線の下を流れる小川沿いの小道「お鷹の道」に着きます。江戸時代、このあたりの村々が尾張徳川家の鷹狩りの場に指定されていたことにちなむ名で、崖下からわき出た水を集める流れに沿って、およそ350mの遊歩道が続きます。真姿の池をはじめとする崖下の湧水群は、昭和60年(1985)に「名水百選」の一つに選ばれました。池の名は、病に苦しんだ玉造小町が国分寺の薬師如来にお参りし、この池の水で身を清めると病が癒えたという言い伝えに由来すると伝わります。池には弁財天がまつられています。" +
    PRAY +
    "この後は、歩いておよそ3分、おたかの道湧水園へ向かいましょう。",
  yusuien:
    "真姿の池から歩いておよそ3分、おたかの道湧水園に着きます。お鷹の道の北側にある国分寺市の歴史公園で、入口には、弘化5年(1848)に建てられた旧国分寺村の名主の家の長屋門が残っています。園内は国分寺崖線にかかり、崖線一帯には湧き水の源など豊かな自然が残っています。園内の武蔵国分寺跡資料館では、史跡から出た出土品や、発掘調査で分かってきたことを紹介しています。武蔵国分寺の七重塔を10分の1の大きさで復元した模型も置かれています。開園は9:00〜17:00(入園は16:45まで)で、月曜日(祝日・振替休日のときは直後の平日)と年末年始は休みです。この後は、歩いておよそ4分、武蔵国分寺跡へ向かいましょう。",
  kokubunji:
    "おたかの道湧水園から歩いておよそ4分、武蔵国分寺跡に着きます。天平13年(741)、聖武天皇が国ごとに国分寺を建てるよう命じ、武蔵国では、都と国府(今の府中市)を結ぶ古代の道「東山道武蔵路」をはさんで、東に僧寺、西に尼寺が置かれました。伽藍は元弘3年(1333)に焼失したと伝わり、今は金堂や講堂の跡を見ることができます。大正11年(1922)に国の史跡に指定されました。この後は、歩いておよそ19分、JR西国分寺駅へ向かいましょう。",
  lunch:
    "武蔵国分寺跡から歩いておよそ19分、JR西国分寺駅に着きます。駅のあたりで昼食にしましょう。この後は、JR中央線の上りで三鷹駅へ向かいます。",
  ghibli:
    "西国分寺駅からJR中央線でおよそ17分の三鷹駅で降り、南口から玉川上水沿いの「風の散歩道」を歩いておよそ20分で、三鷹の森ジブリ美術館に着きます。スタジオジブリの作品を中心にアニメーションを幅広く紹介する美術館で、平成13年(2001)10月に開館しました。建物は、それ自体を1本の映画のようにつくるという考えのもと、宮﨑駿監督がデザインしました。館内では、ここでしか見られないオリジナルの映像作品も上映されています。入場は日時を指定する予約制で、指定した時刻から1時間以内に入る決まりです。この日は13時の回に合わせておくと、ゆとりをもって入れます。火曜日のほかにも休館日があるので、公式の開館カレンダーで確かめましょう。この後は、歩いておよそ10分、井の頭弁財天へ向かいましょう。",
  benten:
    "三鷹の森ジブリ美術館から歩いておよそ10分、井の頭池の中の島にまつられる井の頭弁財天に着きます。縁起では、平安時代の天慶年間(938〜946)に源経基が建てたと伝わり、今の社殿は昭和2年(1927)に建て直されたものです。江戸時代には、神田上水の水源を守る水の神、また音楽や芸能の神として江戸の町の人々に信仰され、まわりの石橋や水盤には、奉納した江戸の商人の名が刻まれています。" +
    PRAY +
    "この後は、歩いておよそ5分、井の頭恩賜公園の七井橋へ向かいましょう。",
  park:
    "井の頭弁財天から歩いておよそ5分、井の頭池の中ほどに架かる七井橋に着きます。井の頭恩賜公園は大正6年(1917)に開かれた都立公園で、かつて湧き口がいくつもあったことから「七井の池」とも呼ばれた井の頭池を中心に、雑木林の御殿山や西園が広がります。池は神田川の源流で、江戸時代には「神田上水」の水源として江戸の町に水を送っていました。池の西の端には、徳川家康がこの池の水で茶をたてたことから名が付いたとされる「お茶の水」もあります。橋の上から池を眺め、国分寺の崖下の湧き水から始まった1日を締めくくりましょう。見終えたら、吉祥寺駅まで歩いておよそ9分です。そこから帰りましょう。",
};

// 新しく登録する写真(Commons)。表紙は弁財天の写真
const PH = {
  tono: { file: "Tonogayato Garden 20200830-5.jpg", caption: "殿ヶ谷戸庭園の崖下の池" },
  masugata: { file: "Masugata Pond.jpg", caption: "真姿の池" },
  kokubunji: { file: "Musashi-kokubunji-ato kondou.JPG", caption: "武蔵国分寺跡の金堂跡" },
  benten: { file: "Inokashira Benzaiten Shrine.jpg", caption: "井の頭池と井の頭弁財天" },
};
type PhKey = keyof typeof PH;
const COVER: PhKey = "benten";

type Row = { label: string; photo?: PhKey; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "殿ヶ谷戸庭園(新規。点 受付の「サービスセンター」way568436069 の Nominatim の中心)",
    photo: "tono",
    item: { create: { name: "殿ヶ谷戸庭園", address: "国分寺市南町2-16", lat: "35.699018", lng: "139.481917", visitTime: T(9, 30), stayDurationMin: 50, memo: M.tono } },
  },
  {
    label: "お鷹の道・真姿の池湧水群(新規。点 真姿の池 way767787508 natural=water の Nominatim の中心、歩き17)",
    photo: "masugata",
    item: {
      create: {
        name: "お鷹の道・真姿の池湧水群", address: "国分寺市東元町3丁目・西元町1丁目", lat: "35.694083", lng: "139.473863",
        visitTime: T(10, 37), stayDurationMin: 25, memo: M.masugata, transitLegs: C(["walk", 17]),
      },
    },
  },
  {
    label: "おたかの道湧水園・武蔵国分寺跡資料館(新規。点 入口の案内板「旧本多家住宅長屋門」node7168646962、歩き3)",
    item: {
      create: {
        name: "おたかの道湧水園・武蔵国分寺跡資料館", address: "国分寺市西元町1-13-10", lat: "35.693437", lng: "139.472753",
        visitTime: T(11, 5), stayDurationMin: 35, memo: M.yusuien, transitLegs: C(["walk", 3]),
      },
    },
  },
  {
    label: "武蔵国分寺跡(新規。点 武蔵国分寺僧寺金堂跡 node1695675145 historic=archaeological_site、歩き4)",
    photo: "kokubunji",
    item: {
      create: {
        name: "武蔵国分寺跡", address: "国分寺市西元町1丁目〜4丁目", lat: "35.69196", lng: "139.47147",
        visitTime: T(11, 44), stayDurationMin: 20, memo: M.kokubunji, transitLegs: C(["walk", 4]),
      },
    },
  },
  {
    label: "西国分寺駅のあたりで昼食(新規。点 JR西国分寺駅 node2559434140 railway=station、メモが駅のあたり。歩き19)",
    item: {
      create: {
        name: "西国分寺駅のあたりで昼食", lat: "35.699748", lng: "139.466083",
        visitTime: T(12, 23), stayDurationMin: 40, memo: M.lunch, transitLegs: C(["walk", 19]),
      },
    },
  },
  {
    label: "三鷹の森ジブリ美術館(既存。点 way1558848181、電車17＋歩き20。写真はそのまま)",
    item: { id: GHIBLI, data: { lat: "35.696252", lng: "139.570451", visitTime: T(13, 40), stayDurationMin: 100, memo: M.ghibli, transitLegs: L(["train", 17, "JR中央線"], ["walk", 20]) } },
  },
  {
    label: "井の頭弁財天(既存。点 way305689256 のまま、歩き10。表紙の写真を足す)",
    photo: "benten",
    item: { id: BENTEN, data: { lat: "35.699553", lng: "139.574783", visitTime: T(15, 30), stayDurationMin: 20, memo: M.benten, transitLegs: L(["walk", 10]) } },
  },
  {
    label: "井の頭恩賜公園(既存。点 七井橋 way31877607、8aa6d1e5・ff50f5a4 と同じ。歩き5、帰りの一文)",
    item: { id: PARK, data: { lat: "35.699921", lng: "139.57733", visitTime: T(15, 55), stayDurationMin: 50, memo: M.park, transitLegs: L(["walk", 5]) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, thumbnailUrl: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  if (it?.thumbnailUrl !== THUMB_OLD) throw new Error(`表紙が想定と違います: ${it?.thumbnailUrl}`);
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);

  const infos = {} as Record<PhKey, NonNullable<Awaited<ReturnType<typeof fetchCommonsImageInfo>>>>;
  for (const k of Object.keys(PH) as PhKey[]) {
    const info = await fetchCommonsImageInfo(PH[k].file);
    if (!info) throw new Error(`写真の情報が取れません(ライセンスを確かめる): ${PH[k].file}`);
    infos[k] = info;
  }

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}（「吉祥寺さんぽ」「定番」を外す）\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節: そのまま\n`);
  console.log(`表紙: ${THUMB_OLD}\n→ 「${PH[COVER].file}」の写真(井の頭弁財天に登録するもの)\n`);
  for (const { label, photo, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const lg = (d.transitLegs as { create?: Leg[] } | undefined)?.create;
    const legsStr = lg ? lg.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+") : "(区間なし)";
    const ph = photo ? `\n  写真を足す: Commons「${PH[photo].file}」(${infos[photo].credit.author}、${infos[photo].credit.license}、${infos[photo].credit.sourceUrl}) 説明「${PH[photo].caption}」` : "";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}${ph}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log(`  ジブリ美術館の写真 ${GHIBLI_PHOTO} はそのまま。外すスポットの写真4枚はスポットと一緒に消える`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 12:23(13:30より前)/ ジブリ 13:40 着(13時の回、14:00まで)/ 終わり 井の頭恩賜公園 16:45(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  const ups = {} as Record<PhKey, { url: string; credit: Record<string, unknown> }>;
  for (const k of Object.keys(PH) as PhKey[]) {
    const up = await uploadCommonsFile(PH[k].file, PH[k].caption, BLOB_PREFIX);
    if (!up) throw new Error(`写真を保存できませんでした: ${PH[k].file}`);
    ups[k] = up;
  }
  const items = SPOTS.map(({ photo, item }) => {
    if (!photo) return item;
    const p = { create: [{ url: ups[photo].url, caption: PH[photo].caption, ...ups[photo].credit }] };
    return ("id" in item ? { id: item.id, data: { ...item.data, photos: p } } : { create: { ...item.create, photos: p } }) as SpotOrderItem;
  });
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW, thumbnailUrl: ups[COVER].url } });
      await setDaySpotOrder(DAY_ID, items, { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log(`書き込みました。表紙: ${ups[COVER].url}`);
}
main().finally(() => prisma.$disconnect());

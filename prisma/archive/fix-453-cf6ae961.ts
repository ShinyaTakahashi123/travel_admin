/**
 * #453 cf6ae961（渋谷・原宿 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * もとは 1日目 9:00〜13:45（根津美術館が9時始まりだが開館は10時）、2日目 9:00〜15:25（センター街・ハチ公像に84分ずつ＝決まりA）。本文は一行の紹介だけだった
 * 1日目（歩き）: 明治神宮 9:00 → 明治神宮ミュージアム（新規）10:20 → 竹下通り 11:20 → 表参道（昼食）11:55〜13:00 → 太田記念美術館（新規）13:05
 *   → 根津美術館 14:15 → 岡本太郎記念館（新規）15:30〜16:30（宿の一言）
 * 2日目（歩き）: 代々木公園 9:00 → 渋谷区立松濤美術館（新規）10:10 → 忠犬ハチ公像（昼食）11:25 → 金王八幡宮（新規）12:35 → 國學院大學博物館（新規）13:15
 *   → 氷川神社（渋谷・新規）14:20 → SHIBUYA SKY 15:15〜16:30（帰りの一言）
 *   キャットストリート・渋谷センター街・渋谷ヒカリエは、店の並ぶ通りや商業施設で本文にできる確かな出典がないので外す
 *   白根記念渋谷区郷土博物館・文学館は令和9年2月まで改修で全館休館のため使わない
 *   閉まる時刻: 明治神宮は日の入りで閉門、ミュージアム 10:00〜16:30（木曜休館）、太田記念 10:30〜17:30（月曜・展示替え休館）、根津 10:00〜17:00（月曜・展示替え休館）、
 *   岡本太郎記念館 10:00〜18:00（火曜休館）、松濤美術館（月曜・展示替え休館）、國學院大學博物館 10:00〜18:00（不定休）、SHIBUYA SKY 10:00〜22:30。本文に時刻・曜日は書かない
 * 本文の出典: 明治神宮 https://www.meijijingu.or.jp/about/ ・/access/ ・/museum/ 、竹下通り商店会 https://www.takeshita-street.com/about.html 、GO TOKYO https://www.gotokyo.org/jp/destinations/western-tokyo/aoyama-and-omotesando/index.html ・/jp/spot/1749/ （渋谷スカイ）、
 *   太田記念美術館 https://www.ukiyoe-ota-muse.jp/about 、根津美術館 https://www.nezu-muse.or.jp/jp/visit/ ・/jp/visit/faq/ 、岡本太郎記念館 https://taro-okamoto.or.jp/access/ 、
 *   東京都公園協会 https://www.tokyo-park.or.jp/park/yoyogi/index.html 、松濤美術館 https://shoto-museum.jp/aboutthemuseum/outline/ 、渋谷区 https://www.city.shibuya.tokyo.jp/shisetsu/koen/kuritsu-koen/park_nabesima.html （鍋島松濤公園）、
 *   渋谷区立図書館 https://www.lib.city.shibuya.tokyo.jp/shibuya/about-shibuya/hachiko/ 、金王八幡宮 https://www.konno-hachimangu.jp/ 、國學院大學 https://www.kokugakuin.ac.jp/education/campusfacilities/p2 、
 *   東京都神社庁 http://www.tokyo-jinjacho.or.jp/shibuya/3272 （氷川神社）
 * 座標の出典: OSM（明治神宮 way 469908925／明治神宮ミュージアム way 1135849071／竹下通り way 26604007／表参道 way 15772071／太田記念美術館 way 139043736／根津美術館 way 139972313／
 *   岡本太郎記念館 node 1966249089／代々木公園 relation 19862716／渋谷区立松濤美術館 way 95633646／忠犬ハチ公像 node 597685675／金王八幡宮 way 141293484／國學院大學博物館 node 1420771752／
 *   氷川神社 way 158406782／渋谷スクランブルスクエア way 617560918）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-453-cf6ae961.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "cf6ae961-1b58-486b-8b4f-fcae6f7e0516";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "1日目は明治神宮の杜とミュージアムから、竹下通り、表参道、浮世絵の太田記念美術館、根津美術館、岡本太郎記念館へ。2日目は代々木公園から松濤美術館、忠犬ハチ公像、金王八幡宮、國學院大學博物館、氷川神社をめぐり、最後は地上229mの展望施設・SHIBUYA SKYへ。緑と都会、両方の渋谷を楽しむ1泊2日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });
const upd = (h: number, m: number, stay: number, mode: string | null, min: number | null, lat: number, lng: number, address: string, memo: string, name?: string) =>
  ({ ...(name ? { name } : {}), visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: min, transitLine: null, lat, lng, address, memo });

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 2) throw new Error("日数が想定と違います");
  if (days[0].spots.map((s) => s.name).join() !== ["根津美術館", "表参道", "キャットストリート", "竹下通り", "明治神宮"].join()) throw new Error("1日目が想定と違います");
  if (days[1].spots.map((s) => s.name).join() !== ["代々木公園", "渋谷センター街", "忠犬ハチ公像", "渋谷スクランブルスクエア", "渋谷ヒカリエ"].join()) throw new Error("2日目が想定と違います");
  const [nezu, omote, cat, takeshita, meiji] = days[0].spots;
  const [yoyogi, center, hachi, scramble, hikarie] = days[1].spots;

  const day1 = [
    { id: meiji.id, data: upd(9, 0, 70, null, null, 35.674842, 139.699627, "東京都渋谷区代々木神園町1-1",
      "この旅は電車と歩きでめぐります。JR山手線の原宿駅から歩いてすぐの入口から、杜の参道を歩いて明治神宮へ（入口から御社殿までは約10分）。大正9年（1920年）に、明治天皇と昭憲皇太后をおまつりするために創建された神社です。約70万平方メートルの杜は、全国から献木された約10万本を植えて造られた人工林で、「永遠の杜」を目指して育てられてきました。" + RESPECT) },
    { create: mk({ name: "明治神宮ミュージアム", h: 10, m: 20, stay: 45, mode: "walk", min: 10, lat: 35.672274, lng: 139.702168, address: "東京都渋谷区代々木神園町1-1",
      memo: "御社殿から南参道を戻って、明治神宮ミュージアムへ。令和元年（2019年）に開館した、明治天皇・昭憲皇太后ゆかりの品々を保存・展示する施設で、ゆるやかな勾配の屋根が特徴の建物は隈研吾の設計です。2階の宝物展示室では、エドアルド・キヨッソーネが描いた御肖像や、修復された「六頭曳儀装車」などを見ることができます。休館日は公式の案内で確かめましょう。" }) },
    { id: takeshita.id, data: upd(11, 20, 25, "walk", 15, 35.670907, 139.704861, "東京都渋谷区神宮前1丁目",
      "ミュージアムから原宿駅の方へ歩いて、竹下通りへ。戦後、代々木にできた米軍の宿舎・ワシントンハイツ向けの店が開いたのが始まりで、DCブランドや「竹の子族」、タレントショップ、ヒップホップと、時代ごとの若者文化を発信してきた通りです。人通りが多いので、はぐれないように気をつけましょう。") },
    { id: omote.id, data: upd(11, 55, 65, "walk", 10, 35.669508, 139.703303, "東京都渋谷区神宮前",
      "竹下通りを抜けて、明治神宮へ続く表参道へ。見事なケヤキ並木の通りで、沿道には店や個性的な建築が並びます。表参道のあたりで昼食にしましょう。") },
    { create: mk({ name: "太田記念美術館", h: 13, m: 5, stay: 50, mode: "walk", min: 5, lat: 35.669407, lng: 139.704903, address: "東京都渋谷区神宮前1-10-10",
      memo: "表参道から少し入ったところにある太田記念美術館へ。五代太田清藏が集めた約12,000点の浮世絵をもとに、昭和55年（1980年）に正式に開館した、浮世絵専門の美術館です。常設展示はなく、テーマを変えながら展覧会を開いています。展示替えの期間などは休館するので、公式の案内で確かめましょう。" }) },
    { id: nezu.id, data: upd(14, 15, 70, "walk", 20, 35.662243, 139.717255, "東京都港区南青山6丁目5-1",
      "表参道を青山の方へ歩き、南青山の根津美術館へ（表参道駅からは歩いて約8分）。東武鉄道の社長などを務めた実業家・根津嘉一郎が集めた作品を公開するために創立された美術館で、収蔵品は約7,600件、その中には国宝7件、重要文化財93件が含まれます。起伏や池のある庭園も散策できます（茶室の中には入れません）。休館日は公式の案内で確かめましょう。") },
    { create: mk({ name: "岡本太郎記念館", h: 15, m: 30, stay: 60, mode: "walk", min: 5, lat: 35.661272, lng: 139.71553, address: "東京都港区南青山6-1-19",
      memo: "根津美術館から歩いてすぐの岡本太郎記念館へ。岡本太郎が1954年から、84歳で亡くなる1996年まで40年以上暮らしたアトリエ兼住居です。建築家・坂倉準三の設計で、ブロックを積んだ壁の上に凸レンズ形の屋根をのせたユニークな建物です。休館日は公式の案内で確かめましょう。杜と美術館をめぐった1日目を、ここで締めくくりましょう。今夜は東京に泊まります。" }) },
  ];
  const day2 = [
    { id: yoyogi.id, data: upd(9, 0, 50, null, null, 35.671405, 139.695172, "東京都渋谷区代々木神園町2-1",
      "2日目は、JR山手線の原宿駅から歩いて約3分の代々木公園から。陸軍の代々木練兵場だったこの場所は、戦後は米軍の宿舎敷地・ワシントンハイツとなり、東京オリンピックの選手村を経て公園になりました。開園当時の木々は大きく育ち、となりの明治神宮の緑とともに森をつくっています。高さ15〜30mの噴水や水回廊もあります。") },
    { create: mk({ name: "渋谷区立松濤美術館", h: 10, m: 10, stay: 60, mode: "walk", min: 20, lat: 35.658685, lng: 139.691792, address: "東京都渋谷区松濤2-14-14",
      memo: "公園から南へ歩いて、松濤の渋谷区立松濤美術館へ。昭和56年（1981年）に開館した美術館で、白井晟一研究所の設計による建物は、花崗岩（紅雲石）を割肌のまま積んだ外壁や、オニキスを使った玄関の光天井が特徴です。展示替えの期間などは休館するので、公式の案内で確かめましょう。近くの鍋島松濤公園は、紀伊徳川家の下屋敷の払い下げを受けた鍋島家が、明治9年に茶園を開いて「松濤」の銘で茶を売り出したことにちなむ公園で、湧水池と水車があります。" }) },
    { id: hachi.id, data: upd(11, 25, 60, "walk", 15, 35.65906, 139.700628, "東京都渋谷区道玄坂1丁目",
      "松濤から歩いて、渋谷駅前の忠犬ハチ公像へ。ハチは大正12年（1923年）に秋田県大館で生まれた秋田犬で、東京帝国大学農学部の上野英三郎教授に飼われていました。大正14年に教授が亡くなったあとも、渋谷駅で帰りを待ち続けたと伝えられています。最初の像は昭和9年（1934年）に安藤照の作で建てられましたが、戦時中の金属回収で失われ、今の像は昭和23年（1948年）に、息子の安藤士が作った2代目です。駅のまわりで昼食にしましょう。") },
    { create: mk({ name: "金王八幡宮", h: 12, m: 35, stay: 30, mode: "walk", min: 10, lat: 35.657577, lng: 139.706217, address: "東京都渋谷区渋谷3-5-12",
      memo: "渋谷駅から東へ歩いて約5分の金王八幡宮へ。寛治6年（1092年）に鎮座したと伝わり、応神天皇をまつります。源頼朝に仕えた渋谷金王丸の名が伝わる神社で、今の社殿は、徳川家光が3代将軍に決まったお礼に、乳母の春日局と守役の青山忠俊が奉納したと伝わるもので、渋谷区の有形文化財です。一枝に一重と八重の花がまじって咲く「金王桜」は、渋谷区の天然記念物です。" + RESPECT }) },
    { create: mk({ name: "國學院大學博物館", h: 13, m: 15, stay: 60, mode: "walk", min: 10, lat: 35.656217, lng: 139.7112, address: "東京都渋谷区東4丁目",
      memo: "金王八幡宮から六本木通りを東へ歩いて、國學院大學博物館へ。大学が持つ学術資料を公開する博物館で、考古の「遺跡に見るモノと心」、神道の「神社祭礼に見るモノと心」、校史の「國學院の学術資産に見るモノと心」の3つのゾーンと、企画展示のゾーンがあります。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "氷川神社（渋谷）", h: 14, m: 20, stay: 40, mode: "walk", min: 5, lat: 35.655079, lng: 139.710829, address: "東京都渋谷区東2-5-6",
      memo: "博物館のすぐ近くの氷川神社へ。慶長10年に記された縁起によると、景行天皇の時代、日本武尊の東征のときに、素盞鳴尊をこの地に勧請したのが始まりと伝わります。約4,000坪の境内には、江戸郊外三大相撲の一つとされる「金王相撲」の相撲場の跡があります。" + RESPECT }) },
    { id: scramble.id, data: upd(15, 15, 75, "walk", 15, 35.658379, 139.702216, "東京都渋谷区渋谷2丁目24-12",
      "氷川神社から明治通りを歩いて渋谷駅へ戻り、渋谷スクランブルスクエアの展望施設「SHIBUYA SKY」へ。地上229mの屋外展望空間から東京の街を360度見渡せ、東京スカイツリーや富士山を眺められることもあり、足元には渋谷スクランブル交差点が見えます。臨時休業や営業時間の短縮があるので、公式の案内で確かめましょう。緑の杜と都会の景色をめぐる旅を、ここで締めくくりましょう。帰りは、渋谷駅から。",
      "SHIBUYA SKY（渋谷スクランブルスクエア）") },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  for (const [i, d] of [day1, day2].entries()) for (const x of d as any[]) { const v = x.create ?? x.data; console.log(`D${i + 1} ${v.visitTime.toISOString().slice(11, 16)}+${v.stayDurationMin} ${v.transitMode ?? "-"}/${v.transitDurationMin ?? "-"} ${v.name ?? "(既存)"}`); }
  console.log(`外す: ${cat.name}, ${center.name}, ${hikarie.name}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(days[0].id, day1 as any, { tx, remove: [cat.id] });
    await setDaySpotOrder(days[1].id, day2 as any, { tx, remove: [center.id, hikarie.id] });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

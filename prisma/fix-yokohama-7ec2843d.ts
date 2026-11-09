/**
 * 7ec2843d(カップヌードルミュージアムと帆船日本丸)の組み直し(2026-11-05、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない)。企画運営・法務の判断(11/05 20時台)。
 * - カップヌードルミュージアム横浜(1社の体験施設)・よこはまコスモワールド(会社の有料の遊び場)を外す。
 *   残りが 1a32349e とほぼ同じ道すじになるので、帆船日本丸を中心に、1a32349e・76319c13 にない公共の行き先で組み直す。
 *   汽車道・横浜赤レンガ倉庫・大さん橋も外す。象の鼻パークは 1a32349e と同じ点で、中心でない重なり1つ(文は新しく書く)。
 * - 点: 日本丸メモリアルパーク 35.45448,139.633446(way36073763 の Nominatim の中心。今のまま)、運河パーク way36073768 の中心
 *   35.453203,139.636579、海外移住資料館 node1420826275、昼食 バス停「馬車道駅前」node2206330029、横浜税関 node1420825622、
 *   象の鼻パーク 35.44968,139.643193(1a32349e と同じ)、日本大通り way220880588 の中心 35.44742,139.643137、
 *   ニュースパーク node1420822762「日本新聞博物館（ニュースパーク）」35.446352,139.642701
 * - 区間(routing.openstreetmap.de routed-foot): 書き出し 桜木町駅 node2738954706→日本丸 425.5秒(およそ8分)、日本丸→運河パーク 515.5→9、
 *   運河パーク→資料館 442.5→8、資料館→昼食 474.3→8、昼食→税関 528.2→9、税関→象の鼻 377.5→7、象の鼻→日本大通り 415.9→7、
 *   日本大通り→ニュースパーク 106.1→2、帰り ニュースパーク→日本大通り駅 127.7(およそ3分)
 * - 時刻: 9:30・70 → 10:49・20 → 11:17・60 → 昼食 12:25・45 → 13:19・40 → 14:06・30 → 14:43・20 → 15:05・85 → 16:30
 * - 出典: 帆船日本丸 nippon-maru.or.jp/nipponmaru/history-2/・トップ、海外移住資料館 jica.go.jp/domestic/jomm/、
 *   横浜税関 customs.go.jp/yokohama/museum/tenjishitsu.htm、象の鼻 横浜市 …/zonohana/zounohana.html・shokai/02.html・saiseibi/03.html、
 *   日本大通り 横浜市 …/gairoju/tree.html・ガーデンネックレス横浜、運河パーク 横浜市 …/taikan/asobu/spot/umibe.html、ニュースパーク newspark.jp・/about/
 * - 題・説明文を帆船日本丸の中心に書き直す。目的のタグ「テーマパーク」「夜景」を外し「美術館・博物館」を付ける。季節はそのまま
 * - 写真: 今の2枚はコスモワールドと赤レンガ倉庫に付いていて、スポットと一緒に消える。表紙(thumbnailUrl)はこの台本では変えず、
 *   続けて出す写真の台本で日本丸などの写真を足して表紙も替える(企画運営 11/05)
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-yokohama-7ec2843d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "7ec2843d-c476-4133-9441-300181791c23";
const DAY_ID = "ed59b49a-9876-4da1-bc83-85884ff06d25";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

const NIPPONMARU = "a78886fb-674d-486e-9eb5-564ac85106d7";
const KISHAMICHI = "dfd89e9e-0c39-4db2-885b-aff247d1f124"; // 外す
const CUPNOODLE = "45c99ce2-5a20-43fa-8b03-a669a374a423"; // 外す
const COSMO = "169a56dd-067d-4f20-a2d1-11536181cfeb"; // 外す
const REDBRICK = "31130ad7-6094-415f-9cf0-711b77c56a6c"; // 外す
const ZOUNOHANA = "943de8fe-8e17-4b5e-a7c4-a74d7e27bbdb"; // 「象の鼻パーク・大さん橋」→「象の鼻パーク」に名前と点・文を直す
const REMOVE = [KISHAMICHI, CUPNOODLE, COSMO, REDBRICK];
const EXPECT: [string, string][] = [
  [NIPPONMARU, "日本丸メモリアルパーク"], [KISHAMICHI, "汽車道"], [CUPNOODLE, "カップヌードルミュージアム横浜"],
  [COSMO, "よこはまコスモワールド"], [REDBRICK, "横浜赤レンガ倉庫"], [ZOUNOHANA, "象の鼻パーク・大さん橋"],
];
const PHOTOS_EXPECT = ["f250d7bc-21d8-4e95-a5a6-5a3e54b58b5f", "627d46a1-a944-42ea-9a62-3df5242ddc64"].sort();

const TITLE_OLD = "カップヌードルミュージアムと帆船日本丸、みなとみらい散策プラン";
const TITLE_NEW = "帆船日本丸と開港の港町、みなとみらいから日本大通りへ歩く日帰りプラン";
const DESC_NEW =
  "「太平洋の白鳥」と呼ばれた帆船日本丸から、日本人の海外移住の歴史を伝える海外移住資料館、横浜税関の資料展示室、横浜の港の始まりの地とされる象の鼻パーク、日本で初めての西洋式街路とされる日本大通りを歩き、新聞の歴史にふれるニュースパークまでめぐる日帰りプランです。";
const TAGS_REMOVE = ["テーマパーク", "夜景"];
const TAG_ADD = "美術館・博物館";

const M = {
  nipponmaru:
    "桜木町駅から歩いておよそ8分、日本丸メモリアルパークに着きます。公園の中の石造りのドックには、「太平洋の白鳥」と呼ばれた帆船日本丸が、現役のころのままの姿で保存されています。日本丸は昭和5年(1930)に造られた練習帆船で、昭和59年(1984)までのおよそ54年間に、地球45.4周分にあたる延べ183万kmを航海し、11,500名もの実習生を育てました。昭和60年(1985)からここで一般に公開され、今は国の重要文化財にもなっています。まずは公園を歩いて帆船の姿を眺め、10時の公開に合わせて船の中へ入りましょう。すべての帆を広げる「総帆展帆」が行われる日もあります。船の公開は10時から17時までで、月曜日などは休みなので、休みの日は公式の案内で確かめましょう。この後は、歩いておよそ9分、運河パークへ向かいましょう。",
  unga:
    "日本丸メモリアルパークから歩いておよそ9分、運河パークに着きます。新港地区の玄関口にある、運河に沿って整えられた公園で、運河越しに汽車道を眺められます。この後は、歩いておよそ8分、JICA横浜 海外移住資料館へ向かいましょう。",
  jomm:
    "運河パークから歩いておよそ8分、JICA横浜の中にある海外移住資料館に着きます。北米・中南米を中心に、海を渡った日本人の移住の歴史と、移住した人々や日系人の今のようすを紹介する資料館です。閲覧室には、海外移住に関する約2万点の文献や資料が集められています。展示場は火曜日から日曜日の10時から18時までで、月曜日などは休みなので、休みの日は公式の案内で確かめましょう。この後は、歩いておよそ8分、馬車道のあたりへ向かいましょう。",
  lunch:
    "JICA横浜 海外移住資料館から歩いておよそ8分、馬車道のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ9分、横浜税関へ向かいましょう。",
  customs:
    "馬車道のあたりから歩いておよそ9分、横浜税関に着きます。本関の1階にある資料展示室「クイーンのひろば」では、運上所と呼ばれたころの門を再現した入口や、密輸の手口を再現した展示、知的財産を侵害する品物の展示などを通して、税関の仕事にふれられます。展示室は10時から16時までで、年末年始は休みです。展示室の中では、飲食はできません。この後は、歩いておよそ7分、象の鼻パークへ向かいましょう。",
  zounohana:
    "横浜税関から歩いておよそ7分、象の鼻パークに着きます。安政6年(1859)に横浜港が開港すると、港には東波止場と西波止場の二つの波止場が作られ、その東波止場が時代とともに少しずつ形を変えて、今の「象の鼻」のもとになりました。大さん橋のつけねから左へ延びる防波堤を上から見ると象の鼻に似ていることから、この名で呼ばれています。防波堤は明治20年代後半の姿に復元され、関東大震災で沈んだ石積みの形も見られるようになっています。横浜の港の始まりの場所として、開港150周年の平成21年(2009)6月2日、開港記念日に公園として開かれました。この後は、歩いておよそ7分、日本大通りへ向かいましょう。",
  nihonodori:
    "象の鼻パークから歩いておよそ7分、日本大通りに着きます。日本で初めての西洋式の街路とされる通りで、大きなイチョウの並木が、象の鼻地区へ向かって一直線に延びています。季節にはチューリップやユリなどの花も見られます。並木の下を歩いて、開港のころの町づくりを思い浮かべましょう。この後は、歩いておよそ2分、ニュースパークへ向かいましょう。",
  newspark:
    "日本大通りから歩いておよそ2分、ニュースパーク（日本新聞博物館）に着きます。日刊新聞発祥の地とされる横浜にある、日本新聞協会が運営する情報と新聞の博物館です。3階の常設展示室と2階の企画展示室で、新聞やジャーナリズムが果たしてきた役割を、歴史の資料と体験型の展示から学べます。新聞記者になって取材を体験するゲームもあり、確かな情報の大切さを考えるきっかけになります。開館は10時から17時までで、入館は16時30分までです。休みの日は公式の案内で確かめましょう。旅を締めくくったら、日本大通り駅までは歩いておよそ3分です。",
};

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true, purposeTags: { select: { purposeTag: { select: { id: true, name: true } } } } } });
  if (!it || it.title !== TITLE_OLD) throw new Error(`題が想定と違います「${it?.title}」`);
  const tagNames = it.purposeTags.map((t) => t.purposeTag.name).sort();
  if (JSON.stringify(tagNames) !== JSON.stringify([...TAGS_REMOVE].sort())) throw new Error(`目的のタグが想定と違います ${tagNames}`);
  const addTag = await prisma.purposeTag.findUnique({ where: { name: TAG_ADD }, select: { id: true } });
  if (!addTag) throw new Error("足すタグがありません");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" }, select: { id: true, name: true, day: { select: { itineraryId: true } } } });
  if (JSON.stringify(spots.map((s) => [s.id, s.name])) !== JSON.stringify(EXPECT)) throw new Error(`スポットが想定と違います: ${spots.map((s) => s.name).join(",")}`);
  if (spots[0].day.itineraryId !== ITIN_ID) throw new Error("日がしおりと合いません");
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true, spotId: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います ${photos.map((p) => p.id)}`);
  if (photos.some((p) => !REMOVE.includes(p.spotId))) throw new Error("残すスポットに写真があります(想定外)");

  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "日本丸メモリアルパーク(中心。今の点)", item: { id: NIPPONMARU, data: { visitTime: T(9, 30), stayDurationMin: 70, memo: M.nipponmaru, transitLegs: { deleteMany: {} } } } },
    { label: "運河パーク(新規。way36073768)", item: { create: { name: "運河パーク", address: "横浜市中区新港2-2-1", lat: "35.453203", lng: "139.636579", visitTime: T(10, 49), stayDurationMin: 20, memo: M.unga, transitLegs: C(["walk", 9]) } } },
    { label: "JICA横浜 海外移住資料館(新規。node1420826275)", item: { create: { name: "JICA横浜 海外移住資料館", address: "横浜市中区新港2-3-1", lat: "35.454579", lng: "139.640573", visitTime: T(11, 17), stayDurationMin: 60, memo: M.jomm, transitLegs: C(["walk", 8]) } } },
    { label: "馬車道のあたりで昼食(新規。バス停 node2206330029)", item: { create: { name: "馬車道のあたりで昼食", lat: "35.450258", lng: "139.63781", visitTime: T(12, 25), stayDurationMin: 45, memo: M.lunch, transitLegs: C(["walk", 8]) } } },
    { label: "横浜税関 資料展示室(新規。node1420825622)", item: { create: { name: "横浜税関 資料展示室", address: "横浜市中区海岸通1-1", lat: "35.449368", lng: "139.642231", visitTime: T(13, 19), stayDurationMin: 40, memo: M.customs, transitLegs: C(["walk", 9]) } } },
    {
      label: "象の鼻パーク(今の「象の鼻パーク・大さん橋」を改名。1a32349e と同じ点)",
      item: { id: ZOUNOHANA, data: { name: "象の鼻パーク", lat: "35.44968", lng: "139.643193", visitTime: T(14, 6), stayDurationMin: 30, memo: M.zounohana, transitLegs: L(["walk", 7]) } },
    },
    { label: "日本大通り(新規。way220880588)", item: { create: { name: "日本大通り", lat: "35.44742", lng: "139.643137", visitTime: T(14, 43), stayDurationMin: 20, memo: M.nihonodori, transitLegs: C(["walk", 7]) } } },
    {
      label: "ニュースパーク（日本新聞博物館）(新規。node1420822762)",
      item: { create: { name: "ニュースパーク（日本新聞博物館）", address: "横浜市中区日本大通11", lat: "35.446352", lng: "139.642701", visitTime: T(15, 5), stayDurationMin: 85, memo: M.newspark, transitLegs: C(["walk", 2]) } },
    },
  ];

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}\n説明文 → ${DESC_NEW}\n目的のタグ: ${TAGS_REMOVE.join("・")} → ${TAG_ADD}\n季節: そのまま\n`);
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(`■ ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${hm(d.visitTime as Date)}／滞在 ${d.stayDurationMin}／区間 ${ls}／点 ${d.lat ?? "(今のまま)"},${d.lng ?? ""}\n  メモ: ${d.memo}`);
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT.find((e) => e[0] === id)![1]}`);
  console.log("  写真2枚(コスモワールド・赤レンガ倉庫)はスポットと一緒に消える。表紙はこの台本では変えない\n\n  終わり ニュースパーク 15:05+85=16:30。帰り 日本大通り駅まで歩いておよそ3分");
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await tx.itineraryPurposeTag.deleteMany({ where: { itineraryId: ITIN_ID, purposeTag: { name: { in: TAGS_REMOVE } } } });
      await tx.itineraryPurposeTag.create({ data: { itineraryId: ITIN_ID, purposeTagId: addTag.id } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

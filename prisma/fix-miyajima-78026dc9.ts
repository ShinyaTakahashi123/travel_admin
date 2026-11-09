/**
 * 大聖院と紅葉谷公園、宮島1泊2日(78026dc9)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の 78026dc9 の欄。
 * - 1日目: 五重塔を外す(宮島観光協会の公式に「令和8年12月まで工事中。現在はご覧いただけません」、企画運営 (a))。
 *   大願寺(80分)の中の昼食を、表参道商店街の「大杓文字」tourism=attraction node5603040022(店でない名前のある点、企画運営 (d))の
 *   昼食の行き先(40分)に分ける。千畳閣の点 → way142668904(約2m)。歩きを routed-foot の実測に合わせる
 *   (桟橋→千畳閣 10.1→11、千畳閣→昼食 4.3→5、昼食→紅葉谷 12.5→13、紅葉谷→大聖院 11.6→12、大聖院→大願寺 6.7→7、大願寺→水族館 4.6→5)。
 *   大願寺は 80→36分(昼食を分けた分)。終わり 16:30 は変わらない
 * - 2日目(最終日、終わり 16:37 より遅くしない): 比治山公園を外し(名前のある入口がなく、公園の面の中心だった。企画運営 (b))、
 *   現代美術館のメモで公園にふれる。広島城の点 → 998ecdfc と同じ天守閣の点、縮景園 → 北門 node13132914674。
 *   歩きを実測に合わせる(天守閣→護国神社 4.8→5、護国神社→北門 12.8→13、北門→美術館 3.3→4、美術館→本通 19.5→20、本通→頼山陽 5.4→6、
 *   頼山陽→袋町小学校平和資料館 2.9→3)。本通の昼食 50→45(昼食は35〜45分、企画運営・法務)。
 *   頼山陽→現代美術館の「路面電車22分」は出どころが分からず乗り継ぎも要るので使わず、タクシー(routed-car 袋町小→現代美術館 4.6分＋5＝10)に(企画運営)。
 *   そのぶん終わりが早まるので、決まりの順で、始まり 9:00→9:10(昼食 13:27 が 13:30 を越えない範囲)と、本物の行き先「袋町小学校平和資料館」
 *   (20分、tourism=museum node4280116101、fb532960 と同じ点)を足して合わせる。終わり 16:37→16:36。
 *   JR 宮島口〜新白島「約25分」は ekitan の時刻表の経路が出典(JR西日本の公式は開けなかった)。本文に「最新の時刻は公式の時刻表で確かめましょう」
 * - 公式で誤りと分かった文を直す: 広島城の天守(2026年3月に閉城、公式 rijo-castle.jp)、縮景園の「2代藩主」(公式は初代)と名前の由来・
 *   「名園100選」(公式 shukkeien.jp/history)、県立美術館の開館(公式 hpam.jp: 昭和43年、中国地方初の公立美術館)、
 *   頼山陽の生年(県の公式は1780)。出典のない文(千畳閣「宮島最大の木造建築」、現代美術館「6割が地下」など)を外す
 * - 祈りの一文を決まりの形に。護国神社は戦没者をまつる神社として慰霊の形に。1日目・2日目の書き出し・終わり・帰りに分を入れる
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-miyajima-78026dc9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "78026dc9-a399-4d83-b4aa-3e2353a9fe4f";
const DAY1_ID = "20c9abab-9eff-4390-bd30-b4d78e8cecb4";
const DAY2_ID = "2a556418-b293-432a-a2b2-4292f1aa458f";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk" as const, transitDurationMin: min }] });

// 1日目
const SENJOKAKU = "1b6021c9-cc82-4d63-87a4-60ba7b172ced";
const GOJUNOTO = "cd42e5fc-b654-46e0-8178-471e074aacc7"; // 外す
const MOMIJIDANI = "c7afe28a-fe12-4f5e-914a-2a302a3bbd92";
const DAISHOIN = "9fd28556-e733-40bd-8c82-b6909a5bbbc5";
const DAIGANJI = "a472b502-43b9-4f90-b4a7-cced0b3f8613";
const AQUARIUM = "9d398c10-c88b-4875-b653-6883547bbcc7";
// 2日目
const HIROSHIMAJO = "3cb1098d-a23f-4b6c-b2f7-e8d1225992b1";
const GOKOKU = "4f82d51b-e64a-4ff2-9638-47d5c58e8a85";
const SHUKKEIEN = "3383f8af-8155-45c9-91af-e8941f7b8abf";
const KENBI = "6d78bb47-0575-41b2-8c46-532b69fbd8ee";
const HONDORI = "ac468b22-5f54-4c44-b20c-f7ac8739d309";
const RAISANYO = "3520a723-7333-4d09-8755-0f62abcab995";
const HIJIYAMA = "fc66df31-1caa-4ac6-982a-47e348977b44"; // 外す
const MOCA = "96dd0f8b-f014-4e77-98c4-e080ba81e8c7";
const TAXI = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "taxi" as const, transitDurationMin: min }] });

// 書き込む前に、今のスポット名を確かめる(別のスポットを書きかえないため)
const EXPECT: Record<string, string> = {
  [SENJOKAKU]: "千畳閣", [GOJUNOTO]: "五重塔", [MOMIJIDANI]: "紅葉谷公園", [DAISHOIN]: "大聖院", [DAIGANJI]: "大願寺", [AQUARIUM]: "宮島水族館",
  [HIROSHIMAJO]: "広島城", [GOKOKU]: "広島護国神社", [SHUKKEIEN]: "縮景園", [KENBI]: "広島県立美術館", [HONDORI]: "本通商店街",
  [RAISANYO]: "頼山陽史跡資料館", [HIJIYAMA]: "比治山公園", [MOCA]: "広島市現代美術館",
};

const M = {
  senjokaku:
    "JR宮島口駅からフェリーで宮島に11時ごろ着いたら、宮島桟橋から歩いておよそ11分、千畳閣(豊国神社)に着きます。天正15年(1587)、豊臣秀吉の命により安国寺恵瓊が建立を始めた大経堂で、857畳の畳を敷けるほどの広さがあります。秀吉の急死によって工事が止まり、今も未完成のまま残されています。明治の神仏分離により、もとの本尊は大願寺に移され、ここは秀吉と加藤清正を祀る豊国神社となりました。吹き抜けの広々とした空間を、柱の間を歩きながら眺めてみましょう。となりの五重塔は、修理の工事で見られないことがあるので、公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。宮島には野生の鹿が多く暮らしていますが、食べ物を与えたり、近づきすぎたりしないようにしましょう。この後は、歩いておよそ5分、表参道商店街のあたりへ向かいましょう。",
  lunch:
    "千畳閣から歩いておよそ5分、宮島の表参道商店街のあたりで、昼食にしましょう。この後は、歩いておよそ13分、紅葉谷公園へ向かいましょう。",
  momijidani:
    "表参道商店街のあたりから歩いておよそ13分、紅葉谷公園に着きます。厳島神社の背後にそびえる弥山の山麓、渓谷沿いに広がる紅葉の名所で、およそ700本ものカエデが植えられ、中でもイロハカエデが最も多くを占めているとされます。公園内を流れる紅葉谷川には、周囲の自然と調和するように整えられた砂防施設があり、まるで日本庭園のような趣を見せています。例年11月中旬から下旬にかけてが紅葉の見頃で、赤い欄干の紅葉橋を色とりどりの葉が彩る光景は、多くの人に親しまれてきました。この公園はまた、弥山への登山道「紅葉谷コース」の入口や、宮島ロープウエーの紅葉谷駅への道ともつながっています。渓谷のせせらぎを聞きながら、静かな散策のひとときを過ごしましょう。この後は、歩いておよそ12分、大聖院へ向かいましょう。",
  daishoin:
    "紅葉谷公園から歩いておよそ12分、大聖院に着きます。大同元年(806)、弘法大師が唐からの帰りに弥山で修行を修め、開いたと伝えられる寺院で、宮島で最も古い寺院とされています。明治の神仏分離までは、厳島神社の法会や祭事を司る別当職でした。豊臣秀吉は宮島に立ち寄った際に大聖院で連歌の会を開き、初代内閣総理大臣の伊藤博文も深く信仰して何度も訪れたと伝えられています。境内の観音堂には十一面観音菩薩像が、摩尼殿には弥山三鬼大権現が祀られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、大願寺へ向かいましょう。",
  daiganji:
    "大聖院から歩いておよそ7分、大願寺に着きます。真言宗の寺院で、本尊の厳島弁財天は、江ノ島・竹生島とともに日本三大弁財天の一つとされています。明治の神仏分離までは、多くの社寺の修理や造営を担っていました。平成18年(2006)に再建された護摩堂には、白檀でつくられた高さおよそ4mの不動明王像が安置されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ5分、宮島水族館へ向かいましょう。",
  aquarium:
    "大願寺から歩いておよそ5分、宮島水族館(みやじマリン)に着きます。瀬戸内海の生き物を中心に展示する水族館です。スナメリをはじめ、カキいかだを再現した展示や、生き物に直接触れられる「ふれあいの磯」など、瀬戸内の自然を身近に感じられる展示が揃っています。生き物に触れるときはやさしく、触れたあとは手を洗うようにしましょう。休館日は公式の案内で確かめましょう。この夜は、宮島の宿に泊まりましょう。",
  hiroshimajo:
    "宮島桟橋からフェリーでJR宮島口へ渡り(約10分)、JR山陽本線で新白島駅へ(約25分)、駅から歩いておよそ18分、2日目は広島城から始まります。最新の時刻は公式の時刻表で確かめましょう。天正17年(1589)、毛利輝元が太田川河口の三角州に築城を始めた城で、「鯉城」の愛称でも親しまれています。天守は、昭和20年(1945)の原爆により倒壊し、昭和33年(1958)に外観が復元されました。その天守は、コンクリートの劣化や設備の老朽化などから令和8年(2026)3月に閉城し、今は外から眺めることができます。最新の案内は公式で確かめましょう。石垣や堀は築城当時の面影を伝えていて、広い城跡公園を散策できます。この後は、歩いておよそ5分、広島護国神社へ向かいましょう。",
  gokoku:
    "広島城から歩いておよそ5分、広島護国神社に着きます。郷土のために尽くし、亡くなった人々の御霊をまつる神社で、原爆で社殿を失ったのち、昭和31年(1956)に広島城跡のこの地に再建されました。戦争で亡くなった方々の御霊をまつる、今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ13分、縮景園へ向かいましょう。",
  shukkeien:
    "広島護国神社から歩いておよそ13分、縮景園に着きます。元和6年(1620)から、広島浅野藩の初代藩主・浅野長晟が別邸の庭園として築いた大名庭園で、作庭したのは、茶人としても知られる家老の上田宗箇です。名前は、儒学者の林羅山が詠んだ詩の序文「海山をその地に縮め風景をこの楼に聚む」に由来するといわれます。池を中心にめぐる回遊式の庭園で、橋や築山、茶室などが配され、四季折々の景色を楽しめます。昭和15年(1940)に名勝に指定されたあと、原爆で大きな被害を受けましたが、昭和24年(1949)から約30年をかけて復旧されました。池のまわりでは足元に気をつけましょう。この後は、歩いておよそ4分、広島県立美術館へ向かいましょう。",
  kenbi:
    "縮景園から歩いておよそ4分、広島県立美術館に着きます。昭和43年(1968)、中国地方で初めての公立美術館として、名勝縮景園のとなりに開館し、平成8年(1996)に全面リニューアルされました。庭園と美術館をあわせて楽しめる場所として親しまれています。広島ゆかりの作家の作品をはじめ、さまざまな所蔵品を紹介しています。休館日は公式の案内で確かめましょう。この後は、歩いておよそ20分、本通商店街へ向かいましょう。",
  hondori:
    "広島県立美術館から歩いておよそ20分、本通商店街に着きます。広島市の中心部にある、アーケードに覆われた商店街で、飲食店や土産物店など、さまざまな店が並んでいます。このあたりで昼食にしましょう。この後は、歩いておよそ6分、頼山陽史跡資料館へ向かいましょう。",
  raisanyo:
    "本通商店街から歩いておよそ6分、頼山陽史跡資料館に着きます。江戸時代後期の歴史家・漢詩人の頼山陽(1780〜1832)は、ここで11歳から30歳までの青少年時代を過ごしました。21歳のときに脱藩騒動を起こして屋敷内の一室に幽閉され、その部屋は「頼山陽居室」として国の史跡に指定されています。代表作の歴史書『日本外史』は、この居室で書き始められたと伝えられています。居室は原爆で焼失したのち、昭和33年(1958)に復元されました。歴史書が書き始められた場所に、思いをはせてみましょう。この後は、歩いておよそ3分、袋町小学校平和資料館へ向かいましょう。",
  fukuromachi:
    "頼山陽史跡資料館から歩いておよそ3分、袋町小学校平和資料館に着きます。爆心地から南東へおよそ460mにあった小学校で、被爆した西校舎の一部が平和資料館として残されています。西校舎の壁には、被爆した人の消息を知らせる伝言が、今も残されています。被爆の記憶を伝える場所ですので、静かに、敬意をもって見学しましょう。休館日は公式の案内で確かめましょう。この後は、路面電車は乗り継ぎが要るので、タクシーを呼んで、およそ10分、広島市現代美術館へ向かいましょう。",
  moca:
    "袋町小学校平和資料館から、タクシーでおよそ10分、この旅の締めくくり、広島市現代美術館に着きます。市内を見渡す緑豊かな比治山公園の中にある美術館で、全国で初めて現代美術に本格的に取り組む公立美術館として、平成元年(1989)に開館しました。建物は建築家・黒川紀章の設計で、比治山の自然の景観と調和するように造られています。国内外の現代美術の作品を、静かな環境の中で鑑賞できます。休館日は公式の案内で確かめましょう。宮島の古刹と渓谷、広島市内の城と庭をめぐる旅はこれで終わりです。帰りは、歩いておよそ23分の広島駅へ向かい、新幹線や電車に乗りましょう。",
};

type Row = { label: string; item: SpotOrderItem };

const DAY1: Row[] = [
  { label: "千畳閣(点 way142668904、書き出し11分、祈りの一文)", item: { id: SENJOKAKU, data: { lat: "34.297304", lng: "132.320269", visitTime: T(11, 11), stayDurationMin: 40, memo: M.senjokaku } } },
  {
    label: "表参道商店街のあたりで昼食(新規。点は大杓文字 node5603040022、店でない)",
    item: { create: { name: "表参道商店街のあたりで昼食", address: "広島県廿日市市宮島町", lat: "34.299048", lng: "132.321814", visitTime: T(11, 56), stayDurationMin: 40, memo: M.lunch, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] } } },
  },
  { label: "紅葉谷公園(歩き13)", item: { id: MOMIJIDANI, data: { visitTime: T(12, 49), stayDurationMin: 30, memo: M.momijidani, transitLegs: W(13) } } },
  { label: "大聖院(歩き12、公式に合わせて書き直し)", item: { id: DAISHOIN, data: { visitTime: T(13, 31), stayDurationMin: 41, memo: M.daishoin, transitLegs: W(12) } } },
  { label: "大願寺(歩き7、滞在80→36、昼食を分ける)", item: { id: DAIGANJI, data: { visitTime: T(14, 19), stayDurationMin: 36, memo: M.daiganji, transitLegs: W(7) } } },
  { label: "宮島水族館(歩き5)", item: { id: AQUARIUM, data: { visitTime: T(15, 0), stayDurationMin: 90, memo: M.aquarium, transitLegs: W(5) } } },
];

const DAY2: Row[] = [
  { label: "広島城(点を天守閣 998ecdfc と同じ、始まり 9:10、天守の閉城)", item: { id: HIROSHIMAJO, data: { lat: "34.40275", lng: "132.45903", visitTime: T(9, 10), stayDurationMin: 55, memo: M.hiroshimajo } } },
  { label: "広島護国神社(歩き5、祈り・慰霊の一文)", item: { id: GOKOKU, data: { visitTime: T(10, 10), stayDurationMin: 20, memo: M.gokoku, transitLegs: W(5) } } },
  { label: "縮景園(点を北門、歩き13、初代藩主)", item: { id: SHUKKEIEN, data: { lat: "34.401448", lng: "132.466374", visitTime: T(10, 43), stayDurationMin: 75, memo: M.shukkeien, transitLegs: W(13) } } },
  { label: "広島県立美術館(歩き4、開館の誤りを直す)", item: { id: KENBI, data: { visitTime: T(12, 2), stayDurationMin: 65, memo: M.kenbi, transitLegs: W(4) } } },
  { label: "本通商店街(歩き20、昼食 13:27、50→45)", item: { id: HONDORI, data: { visitTime: T(13, 27), stayDurationMin: 45, memo: M.hondori, transitLegs: W(20) } } },
  { label: "頼山陽史跡資料館(歩き6、生年を公式に)", item: { id: RAISANYO, data: { visitTime: T(14, 18), stayDurationMin: 40, memo: M.raisanyo, transitLegs: W(6) } } },
  {
    label: "袋町小学校平和資料館(新規。点は tourism=museum node4280116101、fb532960 と同じ。歩き3)",
    item: { create: { name: "袋町小学校平和資料館", address: "広島県広島市中区袋町6-36", lat: "34.391546", lng: "132.458252", visitTime: T(15, 1), stayDurationMin: 20, memo: M.fukuromachi, transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] } } },
  },
  {
    label: "広島市現代美術館(タクシー10、比治山公園を外してメモでふれる、帰りの分)",
    item: { id: MOCA, data: { visitTime: T(15, 31), stayDurationMin: 65, memo: M.moca, transitLegs: TAXI(10) } },
  },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: { in: [DAY1_ID, DAY2_ID] } }, select: { id: true, name: true, dayId: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);

  const show = (day: string, rows: Row[], removed: string[]) => {
    console.log(`\n=== ${day} ===`);
    for (const { label, item } of rows) {
      const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
      const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
      const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
      console.log(`■ ${"id" in item ? "[既存]" : "[新規]"} ${label}\n  着 ${vt}／滞在 ${d.stayDurationMin}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`);
    }
    for (const r of removed) console.log(`■ [外す] ${EXPECT[r]} (${r})`);
  };
  show("1日目", DAY1, [GOJUNOTO]);
  show("2日目", DAY2, [HIJIYAMA]);
  console.log("\n  1日目: 昼食 11:56(13:30より前)/ 終わり 宮島水族館 16:30 / 2日目: 始まり 9:10、昼食(本通)13:27、終わり 16:36(もとの 16:37 より遅くない)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1.map((r) => r.item), { tx, remove: [GOJUNOTO] });
      await setDaySpotOrder(DAY2_ID, DAY2.map((r) => r.item), { tx, remove: [HIJIYAMA] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

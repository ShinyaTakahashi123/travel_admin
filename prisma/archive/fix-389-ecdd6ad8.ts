/**
 * チェックリスト #389 ecdd6ad8「金峯山寺と吉水神社、桜と信仰の山・吉野を歩く旅」の見直し（しおりえ(制作補助2)）
 * 既存の本文は一行の仮の文だったので、すべてサイトの紹介文として書き直す。座標も多くが数百m〜2.5kmずれていたので直す
 * 1日目: 吉野神宮 → 吉野ロープウェイ → 金峯山寺 → 吉水神社 → 吉野山（中千本・昼食）→ 桜本坊 → 竹林院群芳園 → 如意輪寺（8か所 09:00〜16:30）
 * 2日目: 金峯神社 → 西行庵 → 高城山展望台 → 吉野水分神社 → 花矢倉展望台（昼食）→（近鉄）橿原神宮 → 神武天皇陵（7か所 09:00〜16:40）
 * 竹林院群芳園・如意輪寺は2日目から1日目へ移す（日をまたぐ移動も含め、1つのトランザクションで行う）
 * 座標の出典: OSM/Overpass（吉野神宮 34.38461,135.84555／千本口駅 34.37519,135.85396／金峯山寺 34.36838,135.85885／吉水神社 34.36728,135.86193／桜本坊 34.36117,135.86328／
 *   竹林院 34.36027,135.86286／如意輪寺 34.36466,135.86756／吉野水分神社 34.35394,135.87314／花矢倉展望台 34.35544,135.87180／西行庵 34.33826,135.88046）、
 *   国土地理院（金峯神社 34.342699,135.879378／高城山 34.350349,135.878053）、Nominatim（橿原神宮 34.4878022,135.7884958／神武天皇 畝傍山東北陵 34.4972551,135.7880042）、
 *   吉野山（中千本）は吉水神社石鳥居（OSM 34.365791,135.861657）のあたりの町並みとして、その点を使う
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-389-ecdd6ad8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ecdd6ad8-31a0-4e4d-9816-7297a3025225";
const DAY1_ID = "ee2bc50c-986a-4eb1-bf3b-b81135341eaa";
const DAY2_ID = "9796ff91-05ec-479c-8a7b-fd8b122f5f70";
const ID = {
  ropeway: "6579d4aa-757f-404c-b753-4418aaded504",
  yoshimizu: "2547f320-6dd3-4841-8345-bdbc1f407c86",
  sakuramoto: "cbbaedcb-af8c-4bc9-8508-ebd5e6f7c6c7",
  kinpusen: "aeb8bbe6-5b7e-4a8c-bf55-4b7ec7e1a8e7",
  yoshinoyama: "1d9ab461-2388-4335-9752-9e45ce916bc3",
  chikurin: "a8c4b703-2194-435e-8435-925aa361dd11",
  nyoirin: "13fdb997-4ce3-4f26-b42d-4a6e75ce0480",
  takagi: "206653c7-c910-4e06-b722-5ab21fdcfe19",
  mikumari: "3f16a0ce-0962-4358-8c2d-166154e1ec47",
  kinpujinja: "f56c027c-b210-4741-9ca8-803b61f0b709",
};
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "桜と修験道の山・吉野を歩いてめぐる1泊2日。1日目はロープウェイで吉野山に上り、国宝の蔵王堂がそびえる金峯山寺や、南朝ゆかりの吉水神社・如意輪寺を参拝し、中千本の宿坊の庭園へ。2日目は奥千本の金峯神社や西行庵から上千本へと山を下り、午後は近鉄で橿原へ向かい、橿原神宮を訪ねます。桜の時期の旅です。";

type Upd = { id: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string | null; lat: number; lng: number; memo: string };
type New = { name: string; h: number; m: number; stay: number; mode: string | null; dur: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };

const upd = (u: Upd) => ({ id: u.id, data: { visitTime: t(u.h, u.m), stayDurationMin: u.stay, transitMode: u.mode, transitDurationMin: u.dur, transitLine: u.line ?? null, lat: u.lat, lng: u.lng, memo: u.memo } });
const cre = (n: New) => ({ create: { name: n.name, visitTime: t(n.h, n.m), stayDurationMin: n.stay, transitMode: n.mode, transitDurationMin: n.dur, transitLine: n.line ?? null, lat: n.lat, lng: n.lng, address: n.address, memo: n.memo } });

const day1 = [
  cre({
    name: "吉野神宮", h: 9, m: 0, stay: 40, mode: null, dur: null, lat: 34.38461, lng: 135.84555, address: "奈良県吉野郡吉野町吉野山3226",
    memo:
      "近鉄吉野線の吉野神宮駅から歩いて約20分。南北朝の時代に吉野に朝廷を開いた後醍醐天皇をまつる神社で、明治22年（1889年）に明治天皇の意向によって創建されました。今の社殿は昭和7年（1932年）の改築で、檜で造られた本殿や拝殿は、近代の神社建築を代表するものとされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  upd({
    id: ID.ropeway, h: 10, m: 10, stay: 15, mode: "walk", dur: 30, lat: 34.37519, lng: 135.85396,
    memo:
      "吉野神宮から歩いて約30分、千本口駅からロープウェイで吉野山へ上ります。1929年に運行を始めた、国内で最も古いとされるロープウェイで、機械遺産にも登録されています。乗っている時間は数分ですが、窓の外に広がる下千本の山肌を眺めながら、吉野山の入口へ向かいましょう。運行の日や時間は季節で変わるので、公式の案内で確かめてください。",
  }),
  upd({
    id: ID.kinpusen, h: 10, m: 35, stay: 60, mode: "walk", dur: 10, lat: 34.36838, lng: 135.85885,
    memo:
      "吉野山駅から歩いて約10分、修験道の総本山です。修験道の開祖・役行者が山中の修行で感得したという金剛蔵王権現の姿を、ヤマザクラの木に刻んでまつったのが始まりと伝えられ、これが吉野山と桜の深い結びつきの原点ともいわれます。本堂の蔵王堂は国宝で、木造の古い建物としては東大寺大仏殿に次ぐ大きさといわれます。国宝の仁王門は大規模な修理の最中なので、蔵王堂を中心にお参りしましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  upd({
    id: ID.yoshimizu, h: 11, m: 45, stay: 40, mode: "walk", dur: 10, lat: 34.36728, lng: 135.86193,
    memo:
      "金峯山寺から歩いて約10分。もとは金峯山寺の僧坊「吉水院」だった神社で、源頼朝に追われた源義経が静御前や弁慶とひととき身を寄せたと伝えられ、南北朝の時代には後醍醐天皇が仮の御所を構えたといわれます。安土桃山時代には、豊臣秀吉が大がかりな花見の本陣を置いたとも伝わります。境内からは、中千本・上千本の山の斜面に桜が重なって見える「一目千本」の眺めが広がります。世界遺産「紀伊山地の霊場と参詣道」の一部です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  upd({
    id: ID.yoshinoyama, h: 12, m: 30, stay: 60, mode: "walk", dur: 5, lat: 34.365791, lng: 135.861657,
    memo:
      "吉水神社の鳥居の前に続く、中千本の町並みです。吉野山の桜は、ふもとから下千本・中千本・上千本・奥千本と、山の高さによって咲く時期が少しずつずれ、時期によっては山全体で長く花を楽しめます。歌人・西行もこの地の桜を愛し、多くの歌を詠んだといわれます。参道沿いには葛の菓子や食事処の店が並ぶので、ここで昼食にしましょう。桜の時期はとても混み合うので、足元と周りの人に気をつけて歩きましょう。",
  }),
  upd({
    id: ID.sakuramoto, h: 13, m: 40, stay: 30, mode: "walk", dur: 10, lat: 34.36117, lng: 135.86328,
    memo:
      "中千本の町並みから歩いて約10分のお寺です。天武天皇がまだ大海人皇子と呼ばれていたころ、吉野で冬の夜に、山に満開の桜が咲く夢を見て、翌朝、夢のとおり一本の桜が咲いているのを見つけ、その木の下に寺を建てたのが始まりと伝えられています。桜にゆかりの深い吉野らしい由来をもつ寺です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  { id: ID.chikurin, data: { visitTime: t(14, 15), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.36027, lng: 135.86286, memo:
    "桜本坊から歩いてすぐ、宿坊の竹林院に伝わる庭園「群芳園」です。文禄3年（1594年）、豊臣秀吉が吉野で花見をした折に、千利休が手を加えて桃山風の庭に整えたといわれ、當麻寺中之坊・慈光院の庭と並んで「大和三庭園」の一つに数えられています。池のまわりを歩きながら、吉野の山並みとあわせて庭の景色を楽しみましょう。竹林院は宿坊でもあるので、この日の宿にするのもよいでしょう。" } },
  { id: ID.nyoirin, data: { visitTime: t(15, 30), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 30, transitLine: null, lat: 34.36466, lng: 135.86756, memo:
    "竹林院から谷をはさんだ向かいの山すそへ歩いて約30分。平安時代、延喜年間に開かれたと伝わるお寺で、南北朝の時代には後醍醐天皇の勅願寺と定められました。本堂の裏手には、吉野で崩御された後醍醐天皇の陵「塔尾陵」があり、天皇陵としては珍しく北を向いて営まれています。宝物殿には、楠木正行が戦いに向かう前に辞世の歌を矢じりで刻んだと伝わる扉が残ります。陵は宮内庁が管理しているので柵の中には入らず、お寺とあわせて今も祈りが続く場所ですので、静かに、敬意をもってお参りください。" } },
];

const day2 = [
  upd({
    id: ID.kinpujinja, h: 9, m: 0, stay: 40, mode: null, dur: null, lat: 34.342699, lng: 135.879378,
    memo:
      "2日目は、中千本から奥千本口へ向かうバスで奥千本へ（バスは桜の時期などに運行するので、時刻は公式の案内で確かめてください）。奥千本の森にひっそりと立つ、金峯山の地主の神・金山毘古神をまつる古い神社です。少し下った所にある「隠れ塔」は、源義経が追っ手から逃れるために身を隠し、屋根を蹴破って抜け出したという言い伝えから「義経の隠れ塔」とも呼ばれます。世界遺産「紀伊山地の霊場と参詣道」の一部です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "西行庵", h: 10, m: 0, stay: 30, mode: "walk", dur: 20, lat: 34.33826, lng: 135.88046, address: "奈良県吉野郡吉野町吉野山",
    memo:
      "金峯神社から山道を歩いて約20分、奥千本の谷あいにある小さな庵です。平安時代の終わり、武士の身分を捨てて出家した歌人・西行が、ここで数年を過ごしたと伝えられます。近くには、西行が歌に詠んだという「苔清水」が今も湧き、西行を慕った松尾芭蕉も二度ここを訪れて句を残しました。山道は細く滑りやすいところもあるので、歩きやすい靴で、足元に気をつけて歩きましょう。",
  }),
  upd({
    id: ID.takagi, h: 11, m: 0, stay: 30, mode: "walk", dur: 30, lat: 34.350349, lng: 135.878053,
    memo:
      "西行庵から金峯神社の前を通って歩いて約30分、上千本と奥千本の間にそびえる高城山の山頂の展望台です。吉野山の尾根や、遠くの山並みを見渡せ、ここから上千本へと山を下っていく道のりの中で、ひと息つける場所です。展望台のまわりは足元が悪いところもあるので、気をつけて歩きましょう。",
  }),
  upd({
    id: ID.mikumari, h: 11, m: 45, stay: 35, mode: "walk", dur: 15, lat: 34.35394, lng: 135.87314,
    memo:
      "高城山から歩いて約15分。水の分配をつかさどる天水分大神をまつる神社で、「子守明神」とも呼ばれてきました。豊臣秀吉がここで子を授かるよう祈り、秀頼が生まれたと伝えられ、今の社殿はその秀頼が慶長9年（1604年）に建て直したものです。桃山様式の本殿や楼門などは国の重要文化財で、世界遺産の一部でもあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "花矢倉展望台", h: 12, m: 30, stay: 60, mode: "walk", dur: 10, lat: 34.35544, lng: 135.8718, address: "奈良県吉野郡吉野町吉野山1711",
    memo:
      "吉野水分神社から歩いて約10分、上千本にある展望台です。源義経ゆかりの伝承が残る場所で、眼下には吉野の山並みと、昨日お参りした蔵王堂の大きな屋根が見えます。展望台のそばには茶屋もあるので、景色を眺めながら昼食にしましょう。ここからは山を下り、吉野山駅からロープウェイで吉野駅へ向かいます。",
  }),
  cre({
    name: "橿原神宮", h: 15, m: 15, stay: 50, mode: "train", dur: 105, line: "近鉄吉野線（吉野→橿原神宮前、約45分。花矢倉から吉野山駅まで徒歩約50分・ロープウェイ、橿原神宮前駅から徒歩約10分）",
    lat: 34.487802, lng: 135.788496, address: "奈良県橿原市久米町934",
    memo:
      "花矢倉から山を下り、ロープウェイと近鉄吉野線で橿原神宮前へ、駅から歩いて約10分です。『日本書紀』で初代の天皇・神武天皇が橿原宮で即位したと記されるこの地に、明治23年（1890年）に創建された神社で、神武天皇とその皇后をまつります。本殿には、京都御所の賢所として建てられた建物が移されたと伝えられます。背後にそびえる畝傍山とあわせて、広い境内を歩いてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  }),
  cre({
    name: "神武天皇陵（畝傍山東北陵）", h: 16, m: 20, stay: 20, mode: "walk", dur: 15, lat: 34.497255, lng: 135.788004, address: "奈良県橿原市大久保町",
    memo:
      "橿原神宮の北門から歩いて約15分。初代の天皇とされる神武天皇の陵で、宮内庁が管理しています。周りを濠が囲み、深い森に包まれた静かな場所です。陵墓は祈りの場ですので、拝所から静かに、敬意をもってお参りしましょう。2日間の旅はここで締めくくりです。帰りは近鉄の畝傍御陵前駅か橿原神宮前駅へ向かいます。",
  }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  const d1 = days[0].spots.map((s) => s.id).sort().join();
  const d2 = days[1].spots.map((s) => s.id).sort().join();
  if (d1 !== [ID.ropeway, ID.yoshimizu, ID.sakuramoto, ID.kinpusen, ID.yoshinoyama].sort().join() || d2 !== [ID.chikurin, ID.nyoirin, ID.takagi, ID.mikumari, ID.kinpujinja].sort().join()) throw new Error("既存スポットが想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots.map((s) => [s.id, s.name])));
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, arr] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of arr) {
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
      // 竹林院群芳園・如意輪寺を2日目から1日目へ移す（番号の衝突を避けて9500番台に置き、下の並べ替えで振り直す）
      await tx.spot.update({ where: { id: ID.chikurin }, data: { dayId: DAY1_ID, orderNo: 9501 } });
      await tx.spot.update({ where: { id: ID.nyoirin }, data: { dayId: DAY1_ID, orderNo: 9502 } });
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

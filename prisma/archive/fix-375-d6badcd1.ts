/**
 * チェックリスト #375 d6badcd1「天鼓林と石門、渓谷奥へ分け入る昇仙峡じっくり1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 長潭橋から仙娥滝まで昇仙峡を歩いて上り、滝上・ロープウェイへ（9か所）
 * 2日目: 甲府の町（甲府城跡・藤村記念館・武田神社・信玄ミュージアム・甲州夢小路・県立美術館・芸術の森公園、7か所）
 * - 既存の天鼓林(1日目)はIDのまま直す。既存の石門(2日目)はIDのまま1日目へ移す
 * - 天鼓林に付いていた写真は実際には覚円峰の写真(Kakuenpou_in_autumn.jpg)なので、新しい覚円峰のスポットに付け替える
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-375-d6badcd1.ts        … 確認モード
 *                     npm run prod -- npx tsx prisma/fix-375-d6badcd1.ts --commit … 書き込み
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d6badcd1-3d74-443c-acff-931643910c69";
const DAY1_ID = "3e01d47d-6e98-4493-bab3-15a125fa43ac";
const DAY2_ID = "ce9b5ead-ac69-421e-a7aa-044722247b4d";
const TENKORIN_ID = "a4fb873b-1da8-4959-86fe-625233cad9a3";
const ISHIMON_ID = "3f165b93-b4a0-428a-a6be-86258e00a8ba";
const COMMIT = process.argv.includes("--commit");

const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type NewSpot = {
  name: string;
  h: number;
  m: number;
  stay: number;
  mode?: string;
  dur?: number;
  line?: string;
  lat: number;
  lng: number;
  address: string;
  memo: string;
};

const DESCRIPTION =
  "歩くと足元から鼓のような音が響くという天鼓林や、巨岩のアーチ・石門をたどり、長潭橋から仙娥滝まで昇仙峡を一日かけて歩いて上ります。午後はロープウェイで山上のパノラマ台へ。2日目は甲府の町で、甲府城跡や武田神社、ミレーの作品で知られる県立美術館をめぐる1泊2日です。";

const MEMO_TENKORIN =
  "長潭橋から渓谷沿いの遊歩道を歩いておよそ40分、山梨県の天然記念物に指定されている天鼓林に着きます。林の中の決まった場所で足を強く踏み鳴らすと、地面の下から鼓を打つような音が返ってくることで知られます。地盤の固い奥秩父の山あいならではの現象とされ、なかでも昇仙峡の天鼓林は澄んだ音が響くことで名高い場所です。木々に囲まれた静かな林で、トイレもあるので、渓谷歩きのひと休みにもちょうどよいところ。林を傷めないよう、道から外れずに音を確かめてみましょう。";

const MEMO_ISHIMON =
  "覚円峰から少し上ると、道ばたに長田円右衛門の碑が立っています。江戸時代の天保年間、地元の円右衛門が親族や村々の協力を得て、9年の歳月をかけてこの荒川沿いに「御岳新道」を切り開き、それが今の昇仙峡の道のもとになったと伝えられています。碑を過ぎた先にあるのが石門です。巨大な花崗岩が寄り合ってできた天然のアーチで、よく見ると岩の先端どうしはわずかに離れているのに、崩れずに今の姿を保っています。道はこの門の下をくぐって続くので、見上げながら通り抜けてみましょう。頭上の岩や足元の段差に気をつけて進みましょう。";

const DAY1: NewSpot[] = [
  {
    name: "長潭橋",
    h: 9, m: 0, stay: 20,
    lat: 35.727215, lng: 138.548875,
    address: "山梨県甲府市高成町",
    memo:
      "甲府駅南口のバスターミナルから山梨交通バスで約30分、昇仙峡口で降りてすぐです。昇仙峡の入口、天神森で荒川に架かるアーチ橋で、1925年（大正14年）に完成しました。山梨県内に残る戦前のコンクリートアーチ道路橋の中ではもっとも古いものとされ、2012年には土木学会の選奨土木遺産に選ばれています。ここから上流の仙娥滝までのおよそ4kmは「御嶽昇仙峡」として1953年に国の特別名勝に指定され、名前のついた奇岩がいくつも続きます。今日はこの渓谷を一日かけて歩いて上ります。橋の上から、これから分け入る谷の入口を眺めてから出発しましょう。",
  },
  // 天鼓林(既存) 10:00 は下で組み立てる
  {
    name: "羅漢寺",
    h: 10, m: 40, stay: 20, mode: "walk", dur: 10,
    lat: 35.737723, lng: 138.561412,
    address: "山梨県甲斐市吉沢",
    memo:
      "天鼓林の先で吊り橋を渡り、50段ほどの石段を上ると羅漢寺があります。かつては背後にそびえる羅漢寺山の峰々に小さなお堂を置き、山全体を修行の場としていたと伝わる古いお寺です。もとは真言宗で、戦国時代の大永年間に再建されたときに曹洞宗に改められたといわれます。お寺に伝わる木造の五百羅漢像は山梨県の文化財に指定され、今は阿弥陀如来坐像とともに保存庫に大切に納められています。渓谷の音を聞きながら、境内でひと息つきましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "覚円峰",
    h: 11, m: 35, stay: 25, mode: "walk", dur: 35,
    lat: 35.745, lng: 138.566389,
    address: "山梨県甲府市高成町",
    memo:
      "羅漢寺から遊歩道をさらに上ると、昇仙峡のシンボル・覚円峰が目の前にそびえます。花崗岩が長い年月をかけて風化と川の流れに削られ、高さ約180mにわたってほぼ垂直に切り立った岩峰です。その昔、覚円という僧がこの頂で修行したという言い伝えが、名前の由来とされています。あたりには「夢の松島」と呼ばれる景色も広がり、白い岩肌と松の緑、秋には紅葉が重なる眺めは渓谷歩きのハイライトです。遊歩道は車道と並ぶ区間もあるので、車に気をつけ、柵の外には出ないようにしましょう。",
  },
  // 石門(既存・2日目から移す) 12:10
  {
    name: "仙娥滝",
    h: 12, m: 35, stay: 25, mode: "walk", dur: 5,
    lat: 35.749617, lng: 138.566302,
    address: "山梨県甲府市高成町",
    memo:
      "石門をくぐって昇仙橋を渡ると、渓谷のいちばん奥にかかる仙娥滝に着きます。落差は約30m、花崗岩の岩肌を削りながら勢いよく流れ落ちる滝で、「日本の滝百選」にも選ばれています。名前は、中国の伝説で月に昇ったとされる仙女・嫦娥にちなむと伝えられています。長潭橋から歩いてきた渓谷のゴールらしく、水しぶきと滝の音に包まれる場所です。滝のまわりの岩は濡れて滑りやすいので、足元に気をつけましょう。ここから180段ほどの石段を上ると、お店の並ぶ滝上に出ます。",
  },
  {
    name: "昇仙峡 影絵の森美術館",
    h: 13, m: 5, stay: 75, mode: "walk", dur: 5,
    lat: 35.750991, lng: 138.566333,
    address: "山梨県甲府市高成町1035-2",
    memo:
      "滝上に着いたら、昇仙峡 影絵の森美術館へ。影絵作家の藤城清治さんが監修・設計に携わった、影絵を常設で展示する美術館です。暗い展示室に、光を通して色鮮やかに浮かび上がる影絵の作品が並び、渓谷の自然とはまた違う、幻想的な世界を楽しめます。竹久夢二など、ほかの作家の作品も展示されています。となりの「昇仙峡 森の駅」には食事処もあるので、ここで山梨の郷土料理・ほうとうなどの昼食をとるのもおすすめです。",
  },
  {
    name: "昇仙峡ロープウェイ（パノラマ台）",
    h: 14, m: 35, stay: 80, mode: "other", dur: 15,
    lat: 35.74879, lng: 138.55482,
    address: "山梨県甲府市",
    memo:
      "滝上から歩いて約10分の仙娥滝駅からロープウェイに乗り、約5分で山上のパノラマ台駅へ。1964年に開業したロープウェイで、晴れた日には富士山や南アルプスの山々を見渡せます。時間に余裕があれば、羅漢寺山の頂・弥三郎岳まで歩いてみましょう。片道20分ほどです。山上には、樹齢350年を超えるといわれる楢の木をまつる「和合権現」もあります。祈りの場でもあるので、静かに、敬意をもってお参りしましょう。弥三郎岳の頂上付近は岩場なので、歩きやすい靴で、無理をせず足元に気をつけて。強風などで運休することがあるので、お出かけ前に公式の案内を確かめてください。",
  },
  {
    name: "昇仙峡 水晶街道（滝上）",
    h: 16, m: 10, stay: 40, mode: "other", dur: 15,
    lat: 35.7522, lng: 138.5638,
    address: "山梨県甲府市",
    memo:
      "ロープウェイで下りたら、滝上の通りを歩きましょう。昇仙峡の奥の山々は水晶を産したところで、江戸時代に京都の職人から水晶を磨く技を学んだことが、のちに甲府が宝飾の町として発展するもとになったといわれます。この歩みは、日本遺産「甲州の匠の源流・御嶽昇仙峡」の物語にもなっています。通りには水晶や宝石を扱う店が並び、きらめく石を眺めながら歩くだけでも楽しいひとときです。今夜は甲府駅周辺の宿へ。昇仙峡滝上のバス停から甲府駅まではバスでおよそ1時間です。便が多くないので、帰りの時刻は公式の時刻表で確かめておきましょう。",
  },
];

const DAY2: NewSpot[] = [
  {
    name: "舞鶴城公園（甲府城跡）",
    h: 9, m: 0, stay: 60,
    lat: 35.664489, lng: 138.569692,
    address: "山梨県甲府市丸の内1丁目5-4",
    memo:
      "2日目は甲府の町めぐりです。甲府駅南口から歩いて約5分、甲府城の跡を整えた舞鶴城公園から始めましょう。甲府城は、武田氏が滅んだあと、豊臣秀吉の家臣・加藤光泰らが本格的に築き、浅野長政の時代、慶長5年（1600年）ごろに完成したといわれる城です。天守が建っていたかどうかは今もはっきりしていませんが、天守台は築かれた当時の姿を残し、上ると甲府盆地や晴れた日の富士山を見渡せます。明治のはじめに取り壊された鉄門は、絵図や発掘調査をもとに復元され、2013年から公開されています。日本100名城（公益財団法人日本城郭協会の選定）の一つです。石垣の上は段差が大きいので、足元に気をつけて歩きましょう。",
  },
  {
    name: "藤村記念館",
    h: 10, m: 12, stay: 40, mode: "walk", dur: 12,
    lat: 35.6675, lng: 138.5686,
    address: "山梨県甲府市北口",
    memo:
      "甲府駅北口の広場に建つ、明治8年（1875年）に旧睦沢村（今の甲斐市）の学校として建てられた校舎です。明治のはじめ、県令・藤村紫朗のもとで県内に広まった洋風の建物は「藤村式建築」と呼ばれ、左右対称の2階建てに中央のバルコニー、屋根の上に突き出た塔（太鼓楼）が特徴です。この様式の学校は県内に100以上建てられたといわれます。校舎は武田神社の境内への移築をへて、2010年に今の場所へ移され、国の重要文化財に指定されています。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "武田神社",
    h: 11, m: 7, stay: 60, mode: "bus", dur: 15, line: "山梨交通バス（甲府駅北口→武田神社、約8分）",
    lat: 35.686889, lng: 138.577472,
    address: "山梨県甲府市古府中町2611",
    memo:
      "甲府駅北口の2番のりばからバスで約8分。戦国大名・武田信玄をまつる神社で、信虎・信玄・勝頼の武田氏三代が本拠とした館「躑躅ヶ崎館」の跡に、1919年（大正8年）に創建されました。館は1519年、信虎がこの地に本拠を移して構えたのが始まりとされ、境内のまわりには当時の堀や土塁が今も残り、館の跡は国の史跡「武田氏館跡」になっています。堀にかかる神橋を渡って、戦国の城下の中心だった場所を歩いてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "信玄ミュージアム（甲府市武田氏館跡歴史館）",
    h: 12, m: 12, stay: 50, mode: "walk", dur: 5,
    lat: 35.68525, lng: 138.57706,
    address: "山梨県甲府市",
    memo:
      "武田神社の向かいにある、武田氏館跡の発掘の成果と武田氏三代の歩みを紹介する施設で、2019年に開館しました。館の跡から見つかった品々や、戦国時代の甲府盆地のようすをたどる展示があり、映像では若き日の信玄が昔の甲府を案内してくれます。敷地には、1933年に建てられた料亭旅館の建物「旧堀田古城園」も残り、国の登録有形文化財になっています。さきほど歩いた堀や土塁の意味が、ここでよく分かります。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "甲州夢小路",
    h: 13, m: 17, stay: 80, mode: "bus", dur: 15, line: "山梨交通バス（武田神社→甲府駅北口、約8分）",
    lat: 35.666889, lng: 138.571389,
    address: "山梨県甲府市丸の内1丁目1-25",
    memo:
      "バスで甲府駅北口に戻り、東へ歩いてすぐの甲州夢小路へ。甲府城の城下町として栄えた江戸時代から昭和のはじめごろまでのまちなみを再現した一角で、飲食店やみやげ物の店が並びます。ここで昼食にしましょう。目印は高さ15mの「時の鐘」。江戸時代の寛文年間ごろに城下に置かれ、火事で焼けたあと文化15年（1818年）に建て直され、明治5年（1872年）ごろまで町に時を告げていた鐘を、2013年に新しく造ったものです。ボタンを押すと鐘の音を聞くこともできます。",
  },
  {
    name: "山梨県立美術館",
    h: 14, m: 57, stay: 75, mode: "bus", dur: 20, line: "山梨交通バス（甲府駅南口バスターミナル→山梨県立美術館、約15分）",
    lat: 35.660491, lng: 138.537443,
    address: "山梨県甲府市貢川",
    memo:
      "甲府駅南口のバスターミナルからバスで約15分。1978年に開館した美術館で、最初に収められたミレーの《種をまく人》をはじめ、ミレーとバルビゾン派の作品を数多く所蔵していることで知られ、「ミレーの美術館」として親しまれています。畑で働く人々や農村の風景を描いた作品が並ぶ展示室は、落ち着いた空気の中でゆっくり向き合える場所です。山梨ゆかりの作家や日本の近現代の作品も見られます。休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "芸術の森公園",
    h: 16, m: 15, stay: 30, mode: "walk", dur: 3,
    lat: 35.659785, lng: 138.536956,
    address: "山梨県甲府市貢川1丁目",
    memo:
      "美術館のまわりに広がる公園で、ロダンやヘンリー・ムーア、ブールデル、マイヨールなどの彫刻が芝生や木立の中に置かれています。バラ園や日本庭園もあり、晴れた日には富士山も望めます。美術館で見た作品の余韻にひたりながら、ゆっくり歩いて旅を締めくくりましょう。甲府駅へは、美術館前からバスでおよそ15分です。",
  },
];

function toCreate(s: NewSpot) {
  return {
    create: {
      name: s.name,
      visitTime: t(s.h, s.m),
      stayDurationMin: s.stay,
      transitMode: s.mode ?? null,
      transitDurationMin: s.dur ?? null,
      transitLine: s.line ?? null,
      lat: s.lat,
      lng: s.lng,
      address: s.address,
      memo: s.memo,
    },
  };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("日の構成が想定と違います");
  // 1回目の --commit が setDaySpotOrder で止まり、説明文の更新と石門の1日目への移動(9500番)だけが入った状態からも再開できるようにする
  const tenkorin = days[0].spots.find((s) => s.id === TENKORIN_ID);
  const ishimonMoved = days[0].spots.find((s) => s.id === ISHIMON_ID && s.orderNo === 9500);
  const ishimon = days[1].spots.find((s) => s.id === ISHIMON_ID) ?? ishimonMoved;
  if (!tenkorin || !ishimon) throw new Error("既存スポットが見つかりません");
  const okFresh = days[0].spots.length === 1 && days[1].spots.length === 1;
  const okResume = !!ishimonMoved && days[0].spots.length === 2 && days[1].spots.length === 0;
  if (!okFresh && !okResume) throw new Error("既存のスポット数が想定と違います");
  console.log(okResume ? "再開: 石門は1日目(9500番)に移動済み" : "はじめから");
  const photo = await prisma.photo.findMany({ where: { spotId: TENKORIN_ID } });
  console.log(`天鼓林の写真: ${photo.map((p) => p.sourceUrl).join(", ")}`);

  const day1Order = [
    toCreate(DAY1[0]),
    { id: TENKORIN_ID, data: { visitTime: t(10, 0), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 40, transitLine: null, lat: 35.736, lng: 138.5622, address: "山梨県甲府市", memo: MEMO_TENKORIN } },
    toCreate(DAY1[1]),
    toCreate(DAY1[2]),
    { id: ISHIMON_ID, data: { visitTime: t(12, 10), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.7482, lng: 138.5668, address: "山梨県甲府市高成町", memo: MEMO_ISHIMON } },
    ...DAY1.slice(3).map(toCreate),
  ];
  const day2Order = DAY2.map(toCreate);

  const show = (label: string, arr: typeof day1Order) => {
    console.log(`\n${label}`);
    for (const x of arr) {
      const d = "id" in x ? (x.data as Record<string, unknown>) : (x.create as Record<string, unknown>);
      const vt = d.visitTime as Date;
      const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const name = "id" in x ? (x.id === TENKORIN_ID ? "天鼓林(既存)" : "石門(既存・2日目から移動)") : (d.name as string);
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"} ${name} (${d.lat},${d.lng}) ${String(d.memo).length}字`);
    }
  };
  console.log(`説明文: ${DESCRIPTION}`);
  show("1日目", day1Order);
  show("2日目", day2Order);

  if (!COMMIT) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
  // 石門を1日目へ移す(番号の衝突を避けるため9500番に置く)。直後のsetDaySpotOrderで正しい番号に振り直す
  if (!ishimonMoved) await prisma.spot.update({ where: { id: ISHIMON_ID }, data: { dayId: DAY1_ID, orderNo: 9500 } });
  await setDaySpotOrder(DAY1_ID, day1Order);
  await setDaySpotOrder(DAY2_ID, day2Order);
  // 天鼓林に付いていた覚円峰の写真を、新しい覚円峰のスポットへ付け替える
  const kakuen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "覚円峰", day: { itineraryId: ITINERARY_ID } } });
  const moved = await prisma.photo.updateMany({ where: { spotId: TENKORIN_ID }, data: { spotId: kakuen.id } });
  console.log(`\n書き込みました。写真の付け替え: ${moved.count}件 → 覚円峰(${kakuen.id})`);
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

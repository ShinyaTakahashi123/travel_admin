/**
 * 27d28702(千本鳥居と抹茶の香り、伏見・宇治を歩く欲張り散策プラン)の文の直し。
 *
 * 点はすべてOSMの名前のある地物に一致していたため変更なし(制作補助2の11/02の下調べ
 * 「藤森神社が約1.3km違う・伏見稲荷の滞在121分・宇治川に点がない」は、すでに別の経緯
 * で直っていた)。企画運営の指摘(2026-11-04)で、次を直す:
 *
 * 1. 区間: 御香宮神社→伏見大手筋商店街が実測5.02分で、5分のままだった(0.2分でも切り
 *    上げる決まり)。6分に直し、御香宮神社の書き出しの分・伏見大手筋商店街の着時刻・
 *    そのあとの時刻のつながりも1分ずつ直す(最後の伏見稲荷大社発は16:41→16:42、
 *    16:30〜17:00の中)。
 *
 * 2. 祈りの一文(5か所): 宇治上神社・御香宮神社・藤森神社・伏見稲荷大社の
 *    「静かに、敬意をもってお参りください。」、三室戸寺の「静かに、敬意をもって
 *    拝観しましょう。」を、決まりの一文「今も祈りが続く場所ですので、静かに、敬意を
 *    もってお参りしましょう。」にそろえる。
 *
 * 3. 宇治川: 「宇治茶の老舗が軒を連ねています」はそのまま(通りの特徴、6章337行目)に
 *    残すが、「抹茶を使った甘味やお茶をゆっくり味わいましょう」は飲食を勧める文のため
 *    「清流を眺めながら、ゆっくりとした時間を過ごしましょう。」に直す。
 *
 * 3.5 伏見大手筋商店街の「和菓子店や酒屋、食事ができる店が並ぶ商店街です。」は、
 *     開いて確かめられる出典がなかったため外した(06d30178の「食事ができる店が
 *     点在するエリアです」と同じ扱い、法務2026-11-04)。
 *
 * 4. 事実の確かめ(開いた出典、2026-11-04):
 *    - 藤森神社「競馬ファンの参拝も多い」: nippon.com(開いて確認)に「馬事関係者の祭典
 *      である11月の『しんしん祭』では、参拝する馬や騎手を目当てに競馬ファンも詰めかける」
 *      とあったため、祭りの名前を入れて書き直した。「約1800年前、神功皇后によって創建」
 *      は公式の由緒文が見つからず、
 *      伝承としてしか確かめられなかったため、「創建の時期は明らかではありませんが、
 *      神功皇后によるものと伝えられ、およそ1800年前にさかのぼるとされています」に
 *      ヘッジした(南宗寺の家康伝説と同じ扱い)。
 *    - 三室戸寺「5000坪」「50種」: 公式(mimurotoji.com)に記載がなく外した。
 *      「2万株」(あじさい園ページ)「250鉢の蓮」(蓮園ページ)は公式で確認、残す。
 *      「極楽浄土のような光景をつくります」は評価の言葉のため外した。
 *    - 宇治川「大正15年に鵜飼が復活」「蜻蛉日記」: 京都宇治観光協会のパンフレット
 *      (kyoto-uji-kankou.or.jp)等で確認。残す。
 *    - 御香宮神社「貞観4年」「清和天皇より名を賜った」: 国土交通省 観光庁多言語
 *      解説文データベース(mlit.go.jp/tagengo-db)で確認。残す。
 *    - 伏見稲荷大社「3万社以上」: 公式(inari.jp)の「全国に30,000社あるといわれ」に
 *      合わせ「3万社」に直した(「以上」は公式にない)。「往復2時間」は公式に記載が
 *      なく、第三者の記事でも2〜3時間と差があったため、時間の記載を外し「稲荷山の
 *      頂上まで登ることもできますが」に直した。
 *
 * 5. 題・説明文(企画運営の指摘。サイトの声としてやわらかく):
 *    - 題: 「千本鳥居と抹茶の香り、伏見・宇治を歩く欲張り散策プラン」→
 *      「千本鳥居と抹茶の香り、伏見・宇治をめぐる日帰りプラン」
 *    - 説明文: 「…伏見・宇治の名水と信仰スポットを巡る、日帰りの散策プランです。」→
 *      「…伏見・宇治の名水と祈りの場を巡る、日帰りの散策プランです。」
 *
 * 使い方: npm run prod -- npx tsx prisma/fix-fushimi-27d28702.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const ITINERARY_ID = "27d28702-2f4b-4134-947c-b2725f9b90c0";
const DAY_ID = "97624a9f-2092-4665-9e5e-73eb4ceae841";

const NEW_TITLE = "千本鳥居と抹茶の香り、伏見・宇治をめぐる日帰りプラン";
const NEW_DESCRIPTION =
  "宇治上神社の静けさから、宇治川のせせらぎ、三室戸寺、御香宮神社、藤森神社、伏見稲荷大社まで。伏見・宇治の名水と祈りの場を巡る、日帰りの散策プランです。";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

type Leg = { min: number; mode: "walk" | "taxi" | "train" };

const SPOTS: {
  label: string;
  id: string;
  name: string;
  lat: number;
  lng: number;
  visitTime: Date;
  stayDurationMin: number;
  memo: string;
  legs: Leg[];
}[] = [
  {
    label: "宇治上神社(祈りの一文だけ変更)",
    id: "395e55e7-6e55-4be8-9cfb-25b889c7d3e3",
    name: "宇治上神社",
    lat: 34.892053,
    lng: 135.811457,
    visitTime: T(9, 0),
    stayDurationMin: 45,
    memo: "JR宇治駅から歩いておよそ18分、現存最古の神社建築とされる本殿を持つ世界遺産、宇治上神社に着きます。祭神は応神天皇・仁徳天皇・菟道稚郎子の三柱。本殿は平安時代後期、11世紀後半の建立と伝えられ、3棟の内殿を1つの覆屋で包む珍しい形式をしています。隣接する平等院の鎮守社として、平等院の支援を受けながら整えられてきたと伝えられ、平等院とあわせて世界遺産に登録されています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ9分、宇治川へ向かいましょう。",
    legs: [],
  },
  {
    label: "宇治川(飲食を勧める文だけ変更)",
    id: "e819d6b0-100f-4edb-bb20-ed882643fd37",
    name: "宇治川",
    lat: 34.893037,
    lng: 135.806336,
    visitTime: T(9, 54),
    stayDurationMin: 40,
    memo: "宇治上神社から歩いておよそ9分、宇治橋のたもとに着きます。平安時代には貴族の間で鵜飼が楽しまれ、『蜻蛉日記』にもその様子が記されていると伝えられていますが、殺生を禁じる仏教の教えが広まるとともに衰退したといわれます。大正15年に鵜飼が復活し、今も夏には鵜匠が鵜を操る「宇治川の鵜飼」が夏の風物詩として親しまれています。宇治橋のたもとには紫式部の像も立っており、橋を渡って続くまち並みには宇治茶の老舗が並んでいます。清流を眺めながら、ゆっくりとした時間を過ごしましょう。続いては、歩いておよそ23分、三室戸寺へ向かいましょう。",
    legs: [{ min: 9, mode: "walk" }],
  },
  {
    label: "三室戸寺(未確認の数字を外し、祈りの一文を変更)",
    id: "32a615ea-ddd4-417c-a37c-dff18b1a76d7",
    name: "三室戸寺",
    lat: 34.899781,
    lng: 135.818701,
    visitTime: T(10, 57),
    stayDurationMin: 62,
    memo: "宇治川から歩いておよそ23分、アジサイと蓮で知られる「花の寺」、三室戸寺に着きます。宝亀元年（770年）、山中から見つかった黄金の仏像を本尊として、光仁天皇の勅願で創建されたと伝えられています。庭園には2万株のアジサイが咲き誇り、7月には本堂前の蓮園に250鉢の蓮が並びます。西国三十三所の十番札所でもあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。続いては、タクシーでおよそ17分、御香宮神社へ向かいましょう。",
    legs: [{ min: 23, mode: "walk" }],
  },
  {
    label: "御香宮神社(祈りの一文・次の区間の分だけ変更)",
    id: "8c2974b2-1e52-403f-b233-d28f7e710dda",
    name: "御香宮神社",
    lat: 34.934091,
    lng: 135.767393,
    visitTime: T(12, 16),
    stayDurationMin: 53,
    memo: "三室戸寺からタクシーでおよそ17分、名水が湧くことからその名がついた伏見の氏神様、御香宮神社に着きます。貞観4年（862年）、境内から良い香りのする水が湧き出し、その水を飲むと病がたちまち癒えたという言い伝えから、時の清和天皇より「御香宮」の名を賜ったと伝えられています。境内の「御香水」は伏見の地名の由来という説もあり、今も名水として親しまれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。続いては、歩いておよそ6分、伏見大手筋商店街へ向かいましょう。",
    legs: [{ min: 17, mode: "taxi" }],
  },
  {
    label: "伏見大手筋商店街(着く区間の分、出典のない店の文を外す)",
    id: "bbd8ae79-7aa5-4824-af78-332ff48933af",
    name: "伏見大手筋商店街",
    lat: 34.932984,
    lng: 135.764626,
    visitTime: T(13, 15),
    stayDurationMin: 40,
    memo: "御香宮神社から歩いておよそ6分、伏見大手筋商店街に着きます。ここで昼食にしましょう。この後は、タクシーでおよそ10分、藤森神社へ向かいましょう。",
    legs: [{ min: 6, mode: "walk" }],
  },
  {
    label: "藤森神社(競馬ファンの文に出典、創建の文をヘッジ、祈りの一文を変更)",
    id: "f50f0581-28ca-46d1-8696-d1e2e95e537e",
    name: "藤森神社",
    lat: 34.950184,
    lng: 135.771701,
    visitTime: T(14, 5),
    stayDurationMin: 45,
    memo: "伏見大手筋商店街からタクシーでおよそ10分、勝運と馬の神社として知られ、11月の「しんしん祭」には競馬ファンの参拝も多い藤森神社に着きます。創建の時期は明らかではありませんが、神功皇后によるものと伝えられ、およそ1800年前にさかのぼるとされています。洛南深草の氏神として崇敬されてきました。毎年5月に行われる「藤森祭」は、菖蒲の節句発祥の祭ともいわれ、「菖蒲」が「尚武」に通じることから、勝負運を願う人々の信仰を集めています。祭りで奉納される「駈馬神事」の勇壮さから、馬の守護神としても知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。続いては、タクシーでおよそ12分、伏見稲荷大社へ向かいましょう。",
    legs: [{ min: 10, mode: "taxi" }],
  },
  {
    label: "伏見稲荷大社(未確認の数字を外し、祈りの一文を変更)",
    id: "d982c7dc-dd2c-4471-a59d-d8d59b68d4f3",
    name: "伏見稲荷大社",
    lat: 34.966983,
    lng: 135.77476,
    visitTime: T(15, 2),
    stayDurationMin: 100,
    memo: "藤森神社からタクシーでおよそ12分、旅の最後は伏見稲荷大社です。和銅4年(711)の創建と伝えられ、全国に3万社あるといわれる稲荷神社の総本宮で、商売繁盛や五穀豊穣の神として篤い信仰を集めてきました。稲荷山の麓から山腹にかけて、朱色の鳥居がすき間なく並ぶ「千本鳥居」は、参拝者が祈願成就のお礼として奉納してきたもので、鳥居のトンネルをくぐりながら歩く体験は、京都を代表する光景のひとつといわれます。稲荷山の頂上まで登ることもできますが、四つ辻あたりまでの散策でも十分に見ごたえがあります。石段が続く場所もあるので、足元に気をつけて歩きましょう。時間に応じて、無理のない範囲で鳥居のトンネルを楽しみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。帰りは、歩いておよそ6分の稲荷駅から、電車に乗りましょう。",
    legs: [{ min: 12, mode: "taxi" }],
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  console.log(`\n[題] ${NEW_TITLE}`);
  console.log(`[説明文] ${NEW_DESCRIPTION}`);

  let prevDepartMin: number | null = null;
  for (const s of SPOTS) {
    const legSum: number = s.legs.reduce((sum, l) => sum + l.min, 0);
    const legText = s.legs.length === 0 ? "(先頭)" : s.legs.map((l) => `${l.min}分(${l.mode})`).join("+");
    const arriveMin = s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes();
    console.log(`\n[${s.label}]`);
    console.log(`  名前: ${s.name}`);
    console.log(`  点: ${s.lat},${s.lng}`);
    console.log(`  着: ${s.visitTime.toISOString().slice(11, 16)} 滞在: ${s.stayDurationMin}分 区間: ${legText}`);
    console.log(`  memo: ${s.memo}`);
    if (prevDepartMin !== null) {
      const expectedArrive: number = prevDepartMin + legSum;
      if (expectedArrive !== arriveMin) {
        throw new Error(`${s.label}: 時刻のつながりが合いません(前のスポット発${prevDepartMin}分+区間${legSum}分=${expectedArrive}分 ≠ 着${arriveMin}分)`);
      }
    }
    prevDepartMin = arriveMin + s.stayDurationMin;
  }

  const last = SPOTS[SPOTS.length - 1];
  const endMin = prevDepartMin!;
  console.log(`\n最後(${last.name})発: ${Math.floor(endMin / 60)}:${String(endMin % 60).padStart(2, "0")}(16:30〜17:00に収まる想定。もとは16:41)`);
  console.log(`昼食(伏見大手筋商店街)着: ${SPOTS[4].visitTime.toISOString().slice(11, 16)}(13:30より前)`);

  if (!commit) {
    console.log("\n(確認モード。--commit で書き込みます)");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: NEW_TITLE, description: NEW_DESCRIPTION } });

    await setDaySpotOrder(
      DAY_ID,
      SPOTS.map((s) => ({
        id: s.id,
        data: { name: s.name, lat: s.lat, lng: s.lng, visitTime: s.visitTime, stayDurationMin: s.stayDurationMin, memo: s.memo },
      })),
      { tx }
    );

    const spots = await tx.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
    for (let i = 0; i < spots.length; i++) {
      const legs = SPOTS[i].legs;
      await tx.spotTransitLeg.deleteMany({ where: { spotId: spots[i].id } });
      for (let j = 0; j < legs.length; j++) {
        await tx.spotTransitLeg.create({
          data: { spotId: spots[i].id, orderNo: j + 1, transitMode: legs[j].mode, transitDurationMin: legs[j].min },
        });
      }
    }
  });
  console.log("\n書き込みました。");
}
main().finally(() => prisma.$disconnect());

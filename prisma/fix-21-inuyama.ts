/**
 * #21 リトルワールドと日本モンキーパーク、犬山の体験型テーマパーク1泊2日(20a8c441)
 * 初日・最終日の見直し
 *
 * [Day1]
 * - 大縣神社: 入口の一文がなく、レンタカーの手続きと運転が「車で約20分」と合算されていた
 *   (決まり: 手続き15分と運転は分けて書く)。名鉄犬山駅(10:30ごろ着、旅の入口は10:30より
 *   早くしない)+手続き15分+運転18分(OSRM実測12.68分+駐車5分)で1か所目着11:03に
 * - リトルワールドは平日は通年10:00〜16:00閉館(公式サイト確認)。野外展示を16:00より前に
 *   出られるよう、本館展示・野外展示・浅間神社の滞在を短縮(決まりA、水増しではなく短縮)
 * - 本館展示→浅間神社の既存leg(ともにcar15)が実測と大きく違っていた。法務の指摘で、入口と
 *   同じくOSRM+駐車5分で測り直す(大縣神社→本館展示24.7分→30分、野外展示→浅間神社
 *   21.3分→26分)
 * - 東之宮古墳: 古墳(お墓)のため「〇〇のまわりでは、静かに過ごしましょう」の決まりの一文に
 *   直す(もとは「静かに外から眺めましょう」で形が違っていた)
 * [Day2]
 * - 桃太郎神社: 宿からの移動が距離(km)のみで分数がなかったため、宿の目安(名鉄犬山駅)から
 *   OSRM実測の分数(約7分)を追加(時刻9:30は変更なし)
 * - 東之宮古墳: 帰りの一文が「名鉄犬山駅まで車で約10分」のみで、実際は山をふもとまで
 *   歩いて下りる区間(既存の着leg walk15と対称)が抜けていたため、歩き15分+運転4分(OSRM
 *   実測)に直す(時刻・滞在は変更なし、文のみ)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const OAGATA = "eca9a471-074c-4368-940a-d62c8c483178";
const HONKAN = "5f1617a3-53b8-4448-b910-252085c8f985";
const LUNCH1 = "e47a8f90-347e-4491-b0c1-1f640dfa028a";
const YAGAI = "2685573d-7ae3-4c6f-9db6-2d6be4caa4b9";
const SENGEN = "7db7d9b9-4104-4d72-9e5f-c90ed39f19af";
const MOMOTARO = "2147c60e-3f87-425c-bbb6-325684197c21";
const HIGASHINOMIYA = "f77aa132-fedf-4e34-b810-138f1e12510d";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const OAGATA_MEMO_OLD =
  "この旅は車でめぐります。名鉄犬山駅前でレンタカーを借りて、車で約20分。尾張の国を開いた祖先の神・大縣大神をまつる神社で、「尾張の二宮」として親しまれています。本宮山の山頂から今の場所にまつられて、長い歴史を重ねてきたと伝わります。本殿は、寛文元年（1661年）に尾張藩2代藩主・徳川光友が建て直したもので、「大縣造」と呼ばれる、ほかに例のない形とされ、国の重要文化財です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const OAGATA_MEMO_NEW =
  "この旅は車でめぐります。名鉄犬山駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約18分の大縣神社へ。尾張の国を開いた祖先の神・大縣大神をまつる神社で、「尾張の二宮」として親しまれています。本宮山の山頂から今の場所にまつられて、長い歴史を重ねてきたと伝わります。本殿は、寛文元年（1661年）に尾張藩2代藩主・徳川光友が建て直したもので、「大縣造」と呼ばれる、ほかに例のない形とされ、国の重要文化財です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const HONKAN_MEMO_OLD =
  "大縣神社から車で約15分。1983年に開かれた野外民族博物館です。まず本館展示へ。70をこえる国と地域から集めた約6,000点の資料を、「進化・技術・言語・社会・価値」の5つのテーマで紹介していて、世界の人々の暮らしを広く見渡せます。開館と閉館の時間、休館日は日によって違うので、公式の案内で確かめましょう。";
const HONKAN_MEMO_NEW =
  "大縣神社から車で約30分。1983年に開かれた野外民族博物館です。まず本館展示へ。70をこえる国と地域から集めた約6,000点の資料を、「進化・技術・言語・社会・価値」の5つのテーマで紹介していて、世界の人々の暮らしを広く見渡せます。開館と閉館の時間、休館日は日によって違うので、公式の案内で確かめましょう。";

const SENGEN_MEMO_OLD =
  "リトルワールドから車で約15分。東に入鹿池、西に濃尾平野を見下ろす尾張冨士にまつられた神社で、子どもの守り神・木花開耶姫命をまつります。子どもを20歳まで神の「預け子」として、無事な成長を祈る習わしが伝わります。江戸時代に、祭神が村人の夢に現れて、となりの本宮山より低いことを嘆き、山頂に石を積み上げれば願いをかなえると告げたという「背比べ」の言い伝えがあり、「天下の奇祭」と呼ばれる石上げ祭のもとになっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。今夜は、犬山の宿に泊まります。";
const SENGEN_MEMO_NEW =
  "リトルワールドから車で約26分。東に入鹿池、西に濃尾平野を見下ろす尾張冨士にまつられた神社で、子どもの守り神・木花開耶姫命をまつります。子どもを20歳まで神の「預け子」として、無事な成長を祈る習わしが伝わります。江戸時代に、祭神が村人の夢に現れて、となりの本宮山より低いことを嘆き、山頂に石を積み上げれば願いをかなえると告げたという「背比べ」の言い伝えがあり、「天下の奇祭」と呼ばれる石上げ祭のもとになっています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。今夜は、犬山の宿に泊まります。";

const MOMOTARO_MEMO_OLD =
  "この日も車でめぐります。宿から、犬山城から木曽川を約3.3kmさかのぼったところへ。犬山に伝わる桃太郎伝説をまつる神社で、おばあさんが洗濯をしたという「洗濯岩」なども案内されています。境内には、コンクリート像の作家として知られる浅野祥雲がつくった、桃太郎伝説の像がたくさん並びます。宝物館の時間は公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const MOMOTARO_MEMO_NEW =
  "この日も車でめぐります。宿から車で約7分、犬山城から木曽川を約3.3kmさかのぼった桃太郎神社に着きます。犬山に伝わる桃太郎伝説をまつる神社で、おばあさんが洗濯をしたという「洗濯岩」なども案内されています。境内には、コンクリート像の作家として知られる浅野祥雲がつくった、桃太郎伝説の像がたくさん並びます。宝物館の時間は公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const HIGASHINOMIYA_MEMO_OLD =
  "遊園地から車で山のふもとへ行き、遊歩道を歩いて約15分。標高143mの白山平山の山頂にある、全長約72mの前方後方墳で、愛知県で最も古いものの一つとされます。つくられてから1700年以上たちますが、形がよく残っています。三角縁神獣鏡などの鏡が見つかり、国の重要文化財になっています。遊歩道には解説の看板があります。古い時代のお墓なので、静かに外から眺めましょう。帰りは、名鉄犬山駅まで車で約10分、レンタカーを返しましょう。";
const HIGASHINOMIYA_MEMO_NEW =
  "遊園地から車で山のふもとへ行き、遊歩道を歩いて約15分。標高143mの白山平山の山頂にある、全長約72mの前方後方墳で、愛知県で最も古いものの一つとされます。つくられてから1700年以上たちますが、形がよく残っています。三角縁神獣鏡などの鏡が見つかり、国の重要文化財になっています。遊歩道には解説の看板があります。古墳のまわりでは、静かに過ごしましょう。帰りは、遊歩道を歩いて約15分でふもとまで下りたら、車で約4分の名鉄犬山駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const ids = [OAGATA, HONKAN, LUNCH1, YAGAI, SENGEN, MOMOTARO, HIGASHINOMIYA];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) {
      throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
    }
  };
  checkTime(OAGATA, 9, 30, "大縣神社");
  checkTime(HONKAN, 10, 20, "本館展示");
  checkTime(LUNCH1, 11, 35, "リトルワールド昼食");
  checkTime(YAGAI, 12, 30, "野外展示");
  checkTime(SENGEN, 15, 45, "浅間神社");
  if (byId.get(OAGATA)!.stayDurationMin !== 35) throw new Error("大縣神社: 滞在の現在値が期待と不一致");
  if (byId.get(HONKAN)!.stayDurationMin !== 70) throw new Error("本館展示: 滞在の現在値が期待と不一致");
  if (byId.get(YAGAI)!.stayDurationMin !== 180) throw new Error("野外展示: 滞在の現在値が期待と不一致");
  if (byId.get(SENGEN)!.stayDurationMin !== 45) throw new Error("浅間神社: 滞在の現在値が期待と不一致");
  if (byId.get(OAGATA)!.memo !== OAGATA_MEMO_OLD) throw new Error("大縣神社: memo現在値が期待と不一致");
  if (byId.get(HONKAN)!.memo !== HONKAN_MEMO_OLD) throw new Error("本館展示: memo現在値が期待と不一致");
  if (byId.get(SENGEN)!.memo !== SENGEN_MEMO_OLD) throw new Error("浅間神社: memo現在値が期待と不一致");
  if (byId.get(MOMOTARO)!.memo !== MOMOTARO_MEMO_OLD) throw new Error("桃太郎神社: memo現在値が期待と不一致");
  if (byId.get(HIGASHINOMIYA)!.memo !== HIGASHINOMIYA_MEMO_OLD) throw new Error("東之宮古墳: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("[Day1 時刻のつながり、法務指摘でOSRM+駐車5分に直す] 大縣神社11:03(滞在30)→本館展示12:03(滞在50,leg car30)→昼食12:58(滞在50,leg walk5)→野外展示13:53(滞在125,leg walk5、発15:58は閉館16:00の2分前)→浅間神社16:24(滞在30,leg car26、発16:54)");
  console.log("[Day1 文] 大縣神社: 入口+レンタカー手続き15分+運転18分の一文を新規追加。本館展示「約15分」→「約30分」。浅間神社「約15分」→「約26分」。東之宮古墳「静かに外から眺めましょう」→「古墳のまわりでは、静かに過ごしましょう」(お墓の決まりの一文)");
  console.log("[Day2] 時刻・滞在は変更なし。桃太郎神社「宿から、…木曽川を約3.3kmさかのぼった」→「宿から車で約7分、…木曽川を約3.3kmさかのぼった」。東之宮古墳の帰り「車で約10分」→「歩いて約15分でふもとまで下りたら、車で約4分」");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: OAGATA },
      data: { visitTime: t(11, 3), stayDurationMin: 30, memo: OAGATA_MEMO_NEW },
    });
    await tx.spot.update({
      where: { id: HONKAN },
      data: {
        visitTime: t(12, 3),
        stayDurationMin: 50,
        memo: HONKAN_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 30 }] },
      },
    });
    await tx.spot.update({ where: { id: LUNCH1 }, data: { visitTime: t(12, 58) } });
    await tx.spot.update({ where: { id: YAGAI }, data: { visitTime: t(13, 53), stayDurationMin: 125 } });
    await tx.spot.update({
      where: { id: SENGEN },
      data: {
        visitTime: t(16, 24),
        stayDurationMin: 30,
        memo: SENGEN_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 26 }] },
      },
    });
    await tx.spot.update({ where: { id: MOMOTARO }, data: { memo: MOMOTARO_MEMO_NEW } });
    await tx.spot.update({ where: { id: HIGASHINOMIYA }, data: { memo: HIGASHINOMIYA_MEMO_NEW } });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

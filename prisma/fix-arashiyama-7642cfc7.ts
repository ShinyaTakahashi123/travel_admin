/**
 * 竹林と渡月橋、嵐山(7642cfc7)の組み直し(2026-11-04)。企画運営・法務のOKに基づく。
 * - 点の直し: 大河内山荘庭園→入場券売場node6875192885、常寂光寺→way925807376、
 *   嵐電嵐山駅→way279279195(建物、今の点は約270mずれ)、嵐山公園→バス停「嵐山公園」node1740834849
 *   (7章の例外。公園は広すぎて境内中心が使えず、名前のある地物が着く場所のバス停しかないため。
 *   ほかの3本が使う35.011989,135.678226は名前のある地物がなく、そろえる対象から外す)、
 *   車折神社→way407472696
 * - 【重大】「檀林寺」(5番目)は実在の檀林寺(嵯峨鳥居本、渡月橋から2〜3km)とは別の場所で、
 *   実在しない行き先だった。渡月橋のそばの実在の行き先に差し替える(企画運営・法務の判断)
 * - 回る順番を見直し、「竹林の小径」「渡月橋」を新しい行き先として追加(題の「竹林と渡月橋」が
 *   どちらも行き先にない問題もあわせて直す)。大河内山荘のすぐそば(2分)に竹林の小径があるため、
 *   大河内山荘→竹林の小径→常寂光寺の順にする(遠回りなし)
 * - 昼食は渡月橋のスポットに混ぜず、別の行き先(渡月橋北詰、バス停の点、店でない)に分ける
 * - 嵐電嵐山駅の滞在を53分→12分(駅は10〜15分の決まり)。嵐山公園は79分→45分(昼食を分けた分、
 *   中身に合う長さに)
 * - 常寂光寺→嵐電嵐山駅の「バス10分」は路線が確かめられないため、実測の歩き18分に直す
 * - 始まりを9:00→9:30(8:30〜9:30の中)に遅らせ、昼食(13:08)・終わり(16:34)が決まりに収まるようにする
 * - 使わない言葉(「写真映え」「絵になる」「穴場」「弾丸」)を外し、祈りの一文を決まりの形に。
 *   説明文の「太秦の鹿王院」の誤りを直す。1か所目に嵯峨嵐山駅からの行き方の一文を追加
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "7642cfc7-d103-4558-88eb-53c7c84a66d0";
const DAY_ID = "1dad405f-4e32-4c1c-9284-570844548ab1";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OOKOCHI_ID = "1542ea4f-bacf-4513-8f83-f2b4ce2c2bec";
const JOJAKKOJI_ID = "95cba298-fde8-4468-a423-494a29eb26b6";
const ARASHIYAMA_EKI_ID = "c7c38db9-00e2-4fc4-ac34-9b5d2894e2ea";
const ARASHIYAMA_KOEN_ID = "52bbd90a-7ea2-42b2-b794-4330ad29444d";
const TOGETSUKYO_ID = "ef0e24a6-ac6f-424e-a6b4-2dbb815d9193"; // 旧「檀林寺」を渡月橋として再利用
const KURUMAZAKI_ID = "2dea341b-04a8-4d00-934b-345efb088e02";
const ROKUOIN_ID = "333af0a1-699e-474e-a01b-b9b7e83590ac";
const KORYUJI_ID = "8926d1ee-35a0-4099-9b1f-99e693e81c8e";

const DESC_OLD =
  "大河内山荘庭園の絶景から常寂光寺、嵐電嵐山駅、渡月橋のたもとの嵐山公園、太秦の鹿王院・広隆寺まで。嵐山らしい竹林と庭園の風景を効率よく回るプランです。";
const DESC_NEW =
  "大河内山荘庭園から竹林の小径、常寂光寺、嵐電嵐山駅、嵐山公園、渡月橋、車折神社、鹿王院、広隆寺まで。嵐山・嵯峨野の見どころを一日でめぐるプランです。";
const TITLE_OLD = "竹林と渡月橋、絵になる嵐山を巡る弾丸プラン";
const TITLE_NEW = "竹林の小径と渡月橋、大河内山荘から嵐山をめぐる日帰りプラン";

const OOKOCHI_MEMO_OLD =
  "嵯峨野めぐりの入口に、まず訪れたいのがこの庭園です。昭和の映画スター・大河内傳次郎が1931年、34歳のときから約30年をかけて、庭師とともに一木一草まで手を入れて完成させたと伝えられています。書院造や数寄屋造を融合させた「大乗閣」など、園内の建物は国の登録有形文化財。小倉山の中腹から見渡す嵐山や京都市街の眺めは、写真映えする絶景ポイントとしても人気です。";
const OOKOCHI_MEMO_NEW =
  "嵯峨嵐山駅から歩いておよそ12分、嵯峨野めぐりの入口に、まず訪れたいのがこの庭園です。昭和の映画スター・大河内傳次郎が1931年、34歳のときから約30年をかけて、庭師とともに一木一草まで手を入れて完成させたと伝えられています。書院造や数寄屋造を融合させた「大乗閣」など、園内の建物は国の登録有形文化財。小倉山の中腹からは、嵐山や京都市街の眺めが広がります。この後は、歩いておよそ2分、竹林の小径へ向かいましょう。";

const CHIKURIN_MEMO =
  "大河内山荘から歩いておよそ2分、竹林の小径に着きます。嵯峨野を代表する竹林の遊歩道で、空へ向かってまっすぐ伸びる竹が道の両側を覆い、風に揺れる葉音や、葉の隙間からこぼれる光が独特の雰囲気をつくります。かつてこの一帯は平安貴族の別荘地で、竹は建材や工芸品の材料として古くから育てられてきたと伝えられています。この後は、歩いておよそ8分、常寂光寺へ向かいましょう。";

const JOJAKKOJI_MEMO =
  "竹林の小径から歩いておよそ8分、小倉山の中腹に建つ常寂光寺に着きます。紅葉の名所として知られ、安土桃山時代に日蓮宗の僧・日禎が開いたとされ、寺の名は仏教が説く理想の浄土「常寂光土」になぞらえて名づけられたと伝えられています。歌人・藤原定家が『小倉百人一首』を編んだという山荘「時雨亭」の跡地との説もあるこの一帯、茅葺きの仁王門から多宝塔へ続く石段の眺めが見どころです。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ18分、嵐電嵐山駅へ向かいましょう。";

const ARASHIYAMA_EKI_MEMO =
  "常寂光寺から歩いておよそ18分、レトロな路面電車、嵐電のターミナル駅に着きます。1910年に嵐山電車軌道の駅として開業した歴史ある駅で、2013年のリニューアルでホーム内に嵐山温泉の湯を使った足湯や、着物姿の柱が並ぶ「キモノフォレスト」が整いました。この後は、歩いておよそ7分、嵐山公園へ向かいましょう。";

const ARASHIYAMA_KOEN_MEMO =
  "嵐電嵐山駅から歩いておよそ7分、渡月橋のたもとに広がる公園に着きます。上流の「亀山地区」は、山の形が亀の甲羅に似ていることが名前の由来と伝えられ、桂川の中州にある「中之島地区」とあわせて、渡月橋を中心とした景観をつくっています。桜や紅葉の名所としても知られています。この後は、歩いておよそ2分、渡月橋へ向かいましょう。";

const TOGETSUKYO_MEMO =
  "嵐山公園から歩いておよそ2分、渡月橋に着きます。承和3年(836)、僧・道昌が架けたのが始まりと伝えられる橋で、現在の名は、亀山上皇が「くまなき月の渡るに似る」と詠んだことに由来するといわれています。嵐山を背景に桂川に架かるこの橋は、嵐山を象徴する景観として古くから親しまれてきました。この後は、歩いておよそ4分、渡月橋北詰へ向かいましょう。";

const KITAZUME_MEMO =
  "渡月橋から歩いておよそ4分、渡月橋北詰に着きます。嵐山本通りの入口にあたり、食事処が軒を連ねる一帯です。ここで昼食にしましょう。この後は、歩いておよそ15分、車折神社へ向かいましょう。";

const KURUMAZAKI_MEMO =
  "渡月橋北詰から歩いておよそ15分、ユニークな逸話を持つこの神社に着きます。平安時代の学者・清原頼業を祀り、後嵯峨天皇の牛車の轅(ながえ)がこの前で突然折れたことから「車折」の名がついたと伝えられています。境内の「芸能神社」を彩る、俳優や歌手の名を記した朱塗りの玉垣がずらりと並ぶ光景は、名物の一つです。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ11分、鹿王院へ向かいましょう。";

const ROKUOIN_MEMO =
  "車折神社から歩いておよそ11分、鹿王院に着きます。室町幕府3代将軍・足利義満が康暦2年(1380)に建てた宝幢寺の塔頭として、嘉慶元年(1387)、開山・春屋妙葩の寿塔(生前のお墓)を守るために建てられた禅寺です。参道の両側に広がる紅葉や新緑の並木道と、その先に見える嵐山・小倉山の借景庭園が見どころです。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、嵐電でおよそ8分、広隆寺へ向かいましょう。";

const KORYUJI_MEMO =
  "鹿王院から嵐電でおよそ8分、太秦広隆寺駅で降りると、広隆寺に着きます。推古11年(603)、聖徳太子から仏像を授かった秦河勝が建立したと伝えられる、京都でも有数の古い歴史を持つ寺院です。霊宝殿に安置される国宝第1号の弥勒菩薩半跏思惟像は、その柔和な微笑みから「アルカイック・スマイル」とも称され、飛鳥・奈良時代の仏教美術を代表する名品として知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。嵐山めぐりの締めくくりに、時代を超えた美しさに触れてみましょう。";

const BEFORE = {
  [OOKOCHI_ID]: { lat: "35.0181", lng: "135.6674", visitTime: "09:00", memo: OOKOCHI_MEMO_OLD }, // 新しい点は書き込みデータのlat/lngで直す
  [JOJAKKOJI_ID]: { lat: "35.0177", lng: "135.665", visitTime: "09:50", legMin: 5 },
  [ARASHIYAMA_EKI_ID]: { lat: "35.0129", lng: "135.6773", visitTime: "10:40", stay: 53, legMin: 10 },
  [ARASHIYAMA_KOEN_ID]: { lat: "35.0107", lng: "135.6789", visitTime: "11:38", stay: 79, legMin: 5 },
  [TOGETSUKYO_ID]: { lat: "35.015362", lng: "135.677887", visitTime: "13:07", legMin: 10 },
  [KURUMAZAKI_ID]: { lat: "35.0157", lng: "135.6905", visitTime: "14:12", legMin: 20 },
  [ROKUOIN_ID]: { visitTime: "15:24", legMin: 10 },
  [KORYUJI_ID]: { visitTime: "15:57" },
};

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { include: { spots: { include: { transitLegs: true }, orderBy: { orderNo: "asc" } } } } },
  });
  if (itin.title !== TITLE_OLD) throw new Error("前提確認: 題が期待と不一致");
  if (itin.description !== DESC_OLD) throw new Error("前提確認: 説明文が期待と不一致");
  const day = itin.days.find((d) => d.id === DAY_ID)!;
  const byId = new Map(day.spots.map((s) => [s.id, s]));

  for (const [id, before] of Object.entries(BEFORE)) {
    const s = byId.get(id);
    if (!s) throw new Error(`前提確認: スポット ${id} が見つかりません`);
    if ("lat" in before && (s.lat?.toString() !== before.lat || s.lng?.toString() !== before.lng)) {
      throw new Error(`前提確認: ${s.name} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    }
    const vt = s.visitTime ? s.visitTime.toISOString().slice(11, 16) : null;
    if (vt !== before.visitTime) throw new Error(`前提確認: ${s.name} のvisitTimeが期待と不一致 (now ${vt})`);
    if ("stay" in before && s.stayDurationMin !== before.stay) throw new Error(`前提確認: ${s.name} の滞在が期待と不一致`);
    if ("legMin" in before) {
      const leg = s.transitLegs[0];
      if (!leg || leg.transitDurationMin !== before.legMin) throw new Error(`前提確認: ${s.name} の入りの移動分が期待と不一致`);
    }
    if ("memo" in before && before.memo !== undefined && s.memo !== before.memo) {
      throw new Error(`前提確認: ${s.name} のメモが期待と不一致`);
    }
  }
  console.log("前提の確認OK。\n");

  // 書き込むデータそのもの(この配列)を、確認モードの表示にも--commitの書き込みにも、同じものを使う
  const SPOTS: { label: string; item: import("./lib/spot-order").SpotOrderItem }[] = [
    {
      label: "大河内山荘庭園(点を入場券売場node6875192885に)",
      item: {
        id: OOKOCHI_ID,
        data: { lat: "35.016542", lng: "135.670234", visitTime: T(9, 30), memo: OOKOCHI_MEMO_NEW, transitLegs: { deleteMany: {} } },
      },
    },
    {
      label: "竹林の小径(新規)",
      item: {
        create: {
          name: "竹林の小径",
          address: "京都市右京区嵯峨小倉山田淵山町",
          lat: "35.016796",
          lng: "135.671266",
          visitTime: T(10, 17),
          memo: CHIKURIN_MEMO,
          stayDurationMin: 20,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
    },
    {
      label: "常寂光寺(点をそろえ)",
      item: {
        id: JOJAKKOJI_ID,
        data: {
          lat: "35.01964",
          lng: "135.668572",
          visitTime: T(10, 45),
          memo: JOJAKKOJI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
    },
    {
      label: "嵐電嵐山駅(点をそろえ、滞在53→12)",
      item: {
        id: ARASHIYAMA_EKI_ID,
        data: {
          lat: "35.015224",
          lng: "135.6777",
          visitTime: T(11, 43),
          stayDurationMin: 12,
          memo: ARASHIYAMA_EKI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] },
        },
      },
    },
    {
      label: "嵐山公園(点を7章の例外でバス停に、滞在79→45)",
      item: {
        id: ARASHIYAMA_KOEN_ID,
        data: {
          lat: "35.011834",
          lng: "135.677526",
          visitTime: T(12, 2),
          stayDurationMin: 45,
          memo: ARASHIYAMA_KOEN_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
    },
    {
      label: "渡月橋(旧「檀林寺」を差し替え)",
      item: {
        id: TOGETSUKYO_ID,
        data: {
          name: "渡月橋",
          address: "京都市西京区嵐山中尾下町",
          lat: "35.012875",
          lng: "135.677764",
          visitTime: T(12, 49),
          stayDurationMin: 15,
          memo: TOGETSUKYO_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
    },
    {
      label: "渡月橋北詰(昼食・新規。点はバス停「嵐山(渡月橋北詰)」node4326497991、店ではない)",
      item: {
        create: {
          name: "渡月橋北詰",
          address: "京都府京都市右京区嵯峨天龍寺芒ノ馬場町",
          lat: "35.013671",
          lng: "135.679353",
          visitTime: T(13, 8),
          memo: KITAZUME_MEMO,
          stayDurationMin: 40,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
    },
    {
      label: "車折神社(点をそろえ)",
      item: {
        id: KURUMAZAKI_ID,
        data: {
          lat: "35.015817",
          lng: "135.688926",
          visitTime: T(14, 3),
          memo: KURUMAZAKI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
        },
      },
    },
    {
      label: "鹿王院(穴場を外す、祈りの一文)",
      item: {
        id: ROKUOIN_ID,
        data: {
          visitTime: T(15, 16),
          memo: ROKUOIN_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
        },
      },
    },
    {
      label: "広隆寺(祈りの一文、ください→しょう)",
      item: { id: KORYUJI_ID, data: { visitTime: T(15, 49), memo: KORYUJI_MEMO } },
    },
  ];

  console.log("=== 書き込むデータ(スポットごと: 点・時刻・滞在・区間) ===");
  for (const { label, item } of SPOTS) {
    if ("id" in item) {
      const d = item.data as Record<string, unknown>;
      const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
      const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(変更なし)";
      console.log(`  [既存 ${item.id}] ${label}: 点=${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"} 着=${vt} 滞在=${d.stayDurationMin ?? "(変更なし)"} 区間=${legsStr}`);
    } else {
      const c = item.create as Record<string, unknown>;
      const legsCreate = (c.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
      const legsStr = legsCreate ? legsCreate.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(なし)";
      const vt = c.visitTime instanceof Date ? c.visitTime.toISOString().slice(11, 16) : String(c.visitTime);
      console.log(`  [新規] ${label}: 点=${c.lat},${c.lng} 着=${vt} 滞在=${c.stayDurationMin} 区間=${legsStr}`);
    }
  }
  console.log("\n  昼食(渡月橋北詰)着 13:08(11:30〜13:30に収まる) / 最後(広隆寺)発 16:34(16:30〜17:00に収まる)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
    await setDaySpotOrder(
      DAY_ID,
      SPOTS.map((s) => s.item),
      { tx }
    );
  }, { timeout: 60000 });

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

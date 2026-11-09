/**
 * 0582b3c4（嵐山の四季を感じる、庭園と古寺めぐり）#9
 * 法務指摘の3回目の直し(2026-10-30): 座標4か所・文の誤り3か所・昼食1か所・帰りの一文1か所
 *
 * 1. 渡月橋(Day2 1か所目・昼食の点とも): 信号の点(node243776548)→橋way519319727
 *    (35.012875,135.677764)。これに伴いモンキーパークへの歩きwalk5→3、渡月橋のあたり
 *    (昼食)への歩き(法輪寺から)walk8→7に実測し直す
 * 2. 宝筐院: node2854304822(35.02249,135.673543)。滝口寺からの歩きwalk12→11に実測し直す
 * 3. 大覚寺: way1157357955(35.028682,135.679484)。清凉寺からの歩きwalk10→13に実測し直す
 *    (もとの文は「15分」で、どちらとも食い違っていた)。法務の指摘でDay2全体の時刻のつながりを
 *    見直した結果、モンキーパーク(leg5→3)・渡月橋のあたり(leg8→7)の2か所の短縮(合計-3分)が
 *    大覚寺の+3分とちょうど打ち消し合うため、大覚寺のvisitTime(15:30)・発(16:35)は変わらない。
 *    ただし間の4か所(モンキーパーク・法輪寺・渡月橋のあたり・車折神社・清凉寺)のvisitTimeは
 *    legの変化どおりに前へ詰める(各-2〜-3分、発のみで着時刻の表示に使う)
 * 4. 保津川下り乗船場: way250294715(35.01721,135.586931)。乗船場はこの点のままで、次の
 *    常寂光寺への歩き(walk11)は下船地点(渡月橋の少し上流)からの実測のため変更しない
 * 5. 直指庵の書き出し「およそ25分」→実測どおり「36分」(DBのleg36は正しかった、文のみ)
 * 6. 大河内山荘庭園「このあたりの店で昼食にしましょう」→「ここで昼食にしましょう」
 *    (滞在100分の中であることを明確にする直し、時刻は変更しない)
 * 7. 愛宕念仏寺の帰り: 「嵯峨嵐山駅まで戻り、帰りの電車に乗りましょう」→「嵯峨嵐山駅まで
 *    歩いて約37分で戻り、帰りましょう」(routed-foot実測2,772m/36.95分)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const TOGETSUKYO = "f2d91f6c-dbc2-4ce3-ad48-cd988569c0d3";
const MONKEYPARK = "d89354d7-8888-486d-bff0-c9e3833efac7";
const HORINJI = "77cacfaf-c886-4a36-a982-046fead8baba";
const DAIKAKUJI = "f9b94711-7b6d-4473-aa35-20854bd5b5a5";
const OKOCHI = "83ac2d04-0945-4b57-a0d3-bd1c06b2949b";
const JIKIAN = "b53a8c54-0053-4931-99bb-db7e8e479080";
const HOGOIN = "a1991d80-83bb-419e-b79f-de7fd7768a21";
const DAY2 = "887c305e-021f-42b8-9f01-29ea1f3668be";
const HOZUGAWA = "2e777cc6-dc0a-4bc0-85f5-2ec9750a4416";
const ATAGO = "224fa9db-a29f-49a6-8772-b38f915ecf75";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const MONKEYPARK_MEMO_OLD =
  "渡月橋から歩いて約5分のところに、野生のニホンザルに出会える山があります。1954年に京都大学の研究者たちが観察を始め、1957年に一般公開できるよう整備されたのが始まりと伝えられています。「嵐山群」と呼ばれるこの群れは、70年近くにわたる観察で全個体の親子関係が記録されているという、世界的にも珍しい調査対象。人がサルに危害を加えないルールのもと、自然な姿のサルたちと出会えます。山頂からの眺めも見事です。";
const MONKEYPARK_MEMO_NEW =
  "渡月橋から歩いて約3分のところに、野生のニホンザルに出会える山があります。1954年に京都大学の研究者たちが観察を始め、1957年に一般公開できるよう整備されたのが始まりと伝えられています。「嵐山群」と呼ばれるこの群れは、70年近くにわたる観察で全個体の親子関係が記録されているという、世界的にも珍しい調査対象。人がサルに危害を加えないルールのもと、自然な姿のサルたちと出会えます。山頂からの眺めも見事です。";

const HORINJI_MEMO_OLD =
  "嵐山モンキーパークから歩いて約6分、渡月橋のたもとから見上げる古刹です。天長6年（829年）に僧・道昌が虚空蔵菩薩を安置したのが始まりと伝えられ、「嵯峨の虚空蔵さん」の愛称で親しまれています。平安時代、清和天皇が13歳で成人の証の法要をこの寺で営んだ故事にちなみ、子どもが13歳になると知恵を授かりに参拝する「十三まいり」の風習が生まれたといいます。静かに、敬意をもって拝観しましょう。お参りを終えたら、歩いて約8分、渡月橋のあたりへ下りましょう。";
const HORINJI_MEMO_NEW =
  "嵐山モンキーパークから歩いて約6分、渡月橋のたもとから見上げる古刹です。天長6年（829年）に僧・道昌が虚空蔵菩薩を安置したのが始まりと伝えられ、「嵯峨の虚空蔵さん」の愛称で親しまれています。平安時代、清和天皇が13歳で成人の証の法要をこの寺で営んだ故事にちなみ、子どもが13歳になると知恵を授かりに参拝する「十三まいり」の風習が生まれたといいます。静かに、敬意をもって拝観しましょう。お参りを終えたら、歩いて約7分、渡月橋のあたりへ下りましょう。";

const DAIKAKUJI_MEMO_OLD =
  "清凉寺から歩いておよそ15分、大覚寺に着きます。もとは嵯峨天皇の離宮・嵯峨院で、天皇の没後に寺院として開かれたのが始まりと伝えられ、真言宗大覚寺派の総本山として今も多くの参拝者を集めています。境内に広がる大沢池は、日本最古の人工の林泉として知られ、平安貴族が舟遊びを楽しんだ庭園の面影を今に伝えています。時代劇の撮影地としても知られる由緒ある建物の数々を、静かに、敬意をもってめぐりましょう。2日目の旅は、ここで締めくくりです。この夜は、嵐山・嵯峨野の宿に泊まりましょう。";
const DAIKAKUJI_MEMO_NEW =
  "清凉寺から歩いて約13分、大覚寺に着きます。もとは嵯峨天皇の離宮・嵯峨院で、天皇の没後に寺院として開かれたのが始まりと伝えられ、真言宗大覚寺派の総本山として今も多くの参拝者を集めています。境内に広がる大沢池は、日本最古の人工の林泉として知られ、平安貴族が舟遊びを楽しんだ庭園の面影を今に伝えています。時代劇の撮影地としても知られる由緒ある建物の数々を、静かに、敬意をもってめぐりましょう。2日目の旅は、ここで締めくくりです。この夜は、嵐山・嵯峨野の宿に泊まりましょう。";

const OKOCHI_MEMO_OLD =
  "御髪神社から歩いて約2分、昭和の映画スター・大河内傳次郎が築いた庭園に着きます。1931年、34歳のときから亡くなる1962年まで、約30年をかけて庭師とともに一木一草に手を入れ続けたと伝えられています。書院造や数寄屋造を融合させた「大乗閣」など、園内の建物は国の登録有形文化財。小倉山から見渡す眺めを楽しんだら、このあたりの店で昼食にしましょう。そのあと直指庵へ向かいましょう。";
const OKOCHI_MEMO_NEW =
  "御髪神社から歩いて約2分、昭和の映画スター・大河内傳次郎が築いた庭園に着きます。1931年、34歳のときから亡くなる1962年まで、約30年をかけて庭師とともに一木一草に手を入れ続けたと伝えられています。書院造や数寄屋造を融合させた「大乗閣」など、園内の建物は国の登録有形文化財。小倉山から見渡す眺めを楽しんだら、ここで昼食にしましょう。そのあと直指庵へ向かいましょう。";

const JIKIAN_MEMO_OLD =
  "大河内山荘庭園から歩いておよそ25分、北嵯峨の静かな田園風景の先にある直指庵に着きます。江戸時代前期、独照性円という禅僧が営んだ草庵が始まりと伝えられ、幕末には近衛家の老女・津崎村岡局が晩年を過ごした寺としても知られています。境内には、訪れた人が自由に思いを綴ることのできる「想い出草」という自由帳があり、今も多くの参拝者の言葉が積み重ねられています。静かに、敬意をもって拝観しましょう。すぐそばの滝口寺へ向かいましょう。";
const JIKIAN_MEMO_NEW =
  "大河内山荘庭園から歩いておよそ36分、北嵯峨の静かな田園風景の先にある直指庵に着きます。江戸時代前期、独照性円という禅僧が営んだ草庵が始まりと伝えられ、幕末には近衛家の老女・津崎村岡局が晩年を過ごした寺としても知られています。境内には、訪れた人が自由に思いを綴ることのできる「想い出草」という自由帳があり、今も多くの参拝者の言葉が積み重ねられています。静かに、敬意をもって拝観しましょう。すぐそばの滝口寺へ向かいましょう。";

const HOGOIN_MEMO_OLD =
  "滝口寺から歩いておよそ12分、宝筐院に着きます。平安時代の草創と伝えられ、南北朝時代には、敵対する立場にあった足利義詮と楠木正行(小楠公)の墓が並んで建てられたことで知られる寺院です。争いを超えて弔われた両者の墓を訪ねながら、こぢんまりとした庭園を歩けます。静かに、敬意をもって拝観しましょう。3日目の旅は、ここで締めくくりです。この夜も、嵐山・嵯峨野の宿に泊まりましょう。";
const HOGOIN_MEMO_NEW =
  "滝口寺から歩いておよそ11分、宝筐院に着きます。平安時代の草創と伝えられ、南北朝時代には、敵対する立場にあった足利義詮と楠木正行(小楠公)の墓が並んで建てられたことで知られる寺院です。争いを超えて弔われた両者の墓を訪ねながら、こぢんまりとした庭園を歩けます。静かに、敬意をもって拝観しましょう。3日目の旅は、ここで締めくくりです。この夜も、嵐山・嵯峨野の宿に泊まりましょう。";

const ATAGO_MEMO_OLD =
  "化野念仏寺から歩いておよそ10分、愛宕念仏寺に着きます。奈良時代に称徳天皇の勅願で創建されたと伝えられ、昭和の時代、彫刻家・西村公朝が住職を務めていたころ、一般の参拝者が自ら彫った1200体を超える石造の羅漢像が境内を埋め尽くしています。一体ずつ表情が異なる羅漢像をめぐりながら、静かな時間を過ごせます。静かに、敬意をもって拝観しましょう。拝観を終えたら、4日間の嵐山・嵯峨野めぐりはここで締めくくりです。嵯峨嵐山駅まで戻り、帰りの電車に乗りましょう。";
const ATAGO_MEMO_NEW =
  "化野念仏寺から歩いておよそ10分、愛宕念仏寺に着きます。奈良時代に称徳天皇の勅願で創建されたと伝えられ、昭和の時代、彫刻家・西村公朝が住職を務めていたころ、一般の参拝者が自ら彫った1200体を超える石造の羅漢像が境内を埋め尽くしています。一体ずつ表情が異なる羅漢像をめぐりながら、静かな時間を過ごせます。静かに、敬意をもって拝観しましょう。拝観を終えたら、4日間の嵐山・嵯峨野めぐりはここで締めくくりです。嵯峨嵐山駅まで歩いて約37分で戻り、帰りましょう。";

async function main() {
  const ids = [TOGETSUKYO, MONKEYPARK, HORINJI, DAIKAKUJI, OKOCHI, JIKIAN, HOGOIN, HOZUGAWA, ATAGO];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  // 渡月橋のあたり(昼食)は作成時にIDが自動生成されるため、名前で探す
  const lunchSpot = await prisma.spot.findFirst({ where: { name: "渡月橋のあたり" } });
  if (!lunchSpot) throw new Error("渡月橋のあたり(昼食)が見つかりません");
  const kurumazaki = await prisma.spot.findFirst({ where: { dayId: DAY2, name: "車折神社" } });
  if (!kurumazaki) throw new Error("車折神社が見つかりません");
  const seiryoji = await prisma.spot.findFirst({ where: { dayId: DAY2, name: "清凉寺（嵯峨釈迦堂）" } });
  if (!seiryoji) throw new Error("清凉寺が見つかりません");

  if (Number(byId.get(TOGETSUKYO)!.lat) !== 35.013655 || Number(byId.get(TOGETSUKYO)!.lng) !== 135.677852) {
    throw new Error("渡月橋: 座標の現在値が期待と不一致");
  }
  if (Number(lunchSpot.lat) !== 35.013655 || Number(lunchSpot.lng) !== 135.677852) {
    throw new Error("渡月橋のあたり: 座標の現在値が期待と不一致");
  }
  if (byId.get(MONKEYPARK)!.memo !== MONKEYPARK_MEMO_OLD) throw new Error("モンキーパーク: memo現在値が期待と不一致");
  if (byId.get(HORINJI)!.memo !== HORINJI_MEMO_OLD) throw new Error("法輪寺: memo現在値が期待と不一致");
  if (byId.get(DAIKAKUJI)!.memo !== DAIKAKUJI_MEMO_OLD) throw new Error("大覚寺: memo現在値が期待と不一致");
  if (byId.get(OKOCHI)!.memo !== OKOCHI_MEMO_OLD) throw new Error("大河内山荘庭園: memo現在値が期待と不一致");
  if (byId.get(JIKIAN)!.memo !== JIKIAN_MEMO_OLD) throw new Error("直指庵: memo現在値が期待と不一致");
  if (byId.get(HOGOIN)!.memo !== HOGOIN_MEMO_OLD) throw new Error("宝筐院: memo現在値が期待と不一致");
  if (byId.get(ATAGO)!.memo !== ATAGO_MEMO_OLD) throw new Error("愛宕念仏寺: memo現在値が期待と不一致");
  if (Number(byId.get(HOZUGAWA)!.lat) !== 35.017587 || Number(byId.get(HOZUGAWA)!.lng) !== 135.587324) {
    throw new Error("保津川下り乗船場: 座標の現在値が期待と不一致");
  }
  const checkTime = (s: { visitTime: Date | null }, h: number, m: number, label: string) => {
    if (!s.visitTime || s.visitTime.getUTCHours() !== h || s.visitTime.getUTCMinutes() !== m) {
      throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
    }
  };
  checkTime(byId.get(MONKEYPARK)!, 10, 22, "モンキーパーク");
  checkTime(byId.get(HORINJI)!, 11, 45, "法輪寺");
  checkTime(lunchSpot, 12, 43, "渡月橋のあたり");
  checkTime(kurumazaki, 13, 23, "車折神社");
  checkTime(seiryoji, 14, 29, "清凉寺");
  checkTime(byId.get(DAIKAKUJI)!, 15, 30, "大覚寺");
  checkTime(byId.get(HOGOIN)!, 16, 17, "宝筐院");

  console.log("前提の確認OK。渡月橋のあたり(昼食)の実際のID:", lunchSpot.id, "\n");
  console.log("[座標] 渡月橋・渡月橋のあたり → 35.012875,135.677764(橋way519319727)");
  console.log("[座標] 宝筐院 → 35.02249,135.673543(node2854304822)");
  console.log("[座標] 大覚寺 → 35.028682,135.679484(way1157357955)");
  console.log("[座標] 保津川下り乗船場 → 35.01721,135.586931(way250294715、下流側の歩きは変更しない)");
  console.log("[文] モンキーパーク「約5分」→「約3分」/法輪寺「約8分」→「約7分」/宝筐院「12分」→「11分」/大覚寺「15分」→「13分」(leg10→13)/直指庵「25分」→「36分」(文のみ)/大河内山荘庭園「このあたりの店で」→「ここで」(昼食)/愛宕念仏寺「戻り」→「歩いて約37分で戻り」");
  console.log("[Day2の時刻のつながり(法務指摘で再計算)] モンキーパーク10:22→10:20/法輪寺11:45→11:43/渡月橋のあたり12:43→12:40/車折神社13:23→13:20/清凉寺14:29→14:26/大覚寺15:30→変更なし(-3分の短縮と+3分の延びが打ち消し合うため)");
  console.log("[Day3] 宝筐院16:17→16:16(-1分、発16:47→16:46)");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: TOGETSUKYO }, data: { lat: 35.012875, lng: 135.677764 } });
    await tx.spot.update({ where: { id: lunchSpot.id }, data: { lat: 35.012875, lng: 135.677764 } });
    await tx.spot.update({
      where: { id: MONKEYPARK },
      data: {
        visitTime: t(10, 20),
        memo: MONKEYPARK_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    });
    await tx.spot.update({ where: { id: HORINJI }, data: { visitTime: t(11, 43), memo: HORINJI_MEMO_NEW } });
    await tx.spot.update({
      where: { id: lunchSpot.id },
      data: {
        visitTime: t(12, 40),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    });
    await tx.spot.update({ where: { id: kurumazaki.id }, data: { visitTime: t(13, 20) } });
    await tx.spot.update({ where: { id: seiryoji.id }, data: { visitTime: t(14, 26) } });
    await tx.spot.update({
      where: { id: DAIKAKUJI },
      data: {
        lat: 35.028682,
        lng: 135.679484,
        memo: DAIKAKUJI_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
      },
    });
    await tx.spot.update({ where: { id: OKOCHI }, data: { memo: OKOCHI_MEMO_NEW } });
    await tx.spot.update({ where: { id: JIKIAN }, data: { memo: JIKIAN_MEMO_NEW } });
    await tx.spot.update({
      where: { id: HOGOIN },
      data: {
        lat: 35.02249,
        lng: 135.673543,
        visitTime: t(16, 16),
        memo: HOGOIN_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
      },
    });
    await tx.spot.update({ where: { id: HOZUGAWA }, data: { lat: 35.01721, lng: 135.586931 } });
    await tx.spot.update({ where: { id: ATAGO }, data: { memo: ATAGO_MEMO_NEW } });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

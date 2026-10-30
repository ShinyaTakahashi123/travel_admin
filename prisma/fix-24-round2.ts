/**
 * #24 十和田湖の遊覧船と展望台めぐり、奥入瀬渓流を歩く1泊2日(d1e7bf32)
 * 法務指摘の2回目(2026-10-30): 座標6点・文3点
 *
 * [座標]
 * - 十和田神社: 度分秒から直した値の形だったのを、way586654325(40.433161,140.892145)に直す
 * - 発荷峠展望台: 建物way216109758「発荷峠展望台」(40.408797,140.864253)に微修正
 * - 瞰湖台: place=locality(地名)の点だったのを、「瞰湖台展望台」node3239593971
 *   (40.440723,140.917735)に直す。子ノ口への区間(タクシー)がOSRM実測5.75分+駐車5分=11分に
 *   (もとの6分は旧点のraw OSRM値で駐車5分を含んでいなかった)
 * - 子ノ口: place=neighbourhood(広い場所)の点だったのを、メモに出てくる「子ノ口橋」
 *   way111063854(40.478508,140.941165)に直す。子ノ口→銚子大滝・銚子大滝→石ヶ戸・
 *   石ヶ戸→奥入瀬渓流館のrouted-footは、新旧どちらの点でも2〜3時間という実際とかけ離れた
 *   値になった(奥入瀬渓流の遊歩道がOSMの徒歩経路網にうまく乗っていないため)ため、環境省
 *   公式の区間ごとの案内(https://www.env.go.jp/nature/nationalparks/list/towada-hachimantai/course/01/)
 *   で確かめ直した。子ノ口→銚子大滝は公式30分で、もとの値と一致(変更なし)。銚子大滝→石ヶ戸
 *   (銚子大滝→白糸の滝25分+白糸の滝→雲井の滝70分+雲井の滝→阿修羅の流れ25分+阿修羅の流れ
 *   →石ヶ戸35分=155分)はもとの140分と違ったため155分に直す。石ヶ戸→奥入瀬渓流館(石ヶ戸→
 *   三乱の流れ15分+三乱の流れ→奥入瀬渓流館75分=90分)はもとの70分と違ったため90分に直す
 * - 石ヶ戸: OSM「石ヶ戸」node2417882327(40.54046,140.978945)に微修正
 * - 十和田市現代美術館: way556758191(40.614003,141.208965)に微修正。奥入瀬渓流館からの
 *   legは、新旧どちらの点でもOSRM実測17.3分+駐車5分=22分で、もとの33分は点とは無関係に
 *   実測より長すぎたため直す
 *
 * [文]
 * - 十和田神社: 祈りの一文を決まりの形「今も祈りが続く場所ですので、静かに、敬意をもって
 *   お参りしましょう。」に直す
 * - 子ノ口: 「…水の表情を眺めてみてください。」→「…眺めましょう。」
 * - 石ヶ戸: 「ここで昼食をとるのもよいでしょう。」→「ここで昼食をとりましょう。」
 *
 * 石ヶ戸は昼食の場所のため滞在を変更せず、十和田市現代美術館も滞在を変更しない。公式に
 * そろえた分(+15+20=+35分)は、瞰湖台・子ノ口・銚子大滝・奥入瀬渓流館の滞在を短縮して
 * 吸収(決まりA)し、終わりは16:32でもとの16:38より早くする
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const JINJA = "98dcfd25-9d0c-49cb-9285-26709f8255ce";
const HOKKETOGE = "b76cc257-74c0-430d-afed-74d10fc63838";
const KANKODAI = "c2f1efb6-c46e-4b92-8d18-73bbbdd84306";
const NENOKUCHI = "67c59f9f-52c7-44a7-aced-832c827c4d89";
const CHOSHI_OTAKI = "f2df823f-364b-48ce-b38e-8edcf3c7a16a";
const ISHIGEDO = "d817eb3f-8c5a-46c7-9a5e-29c0f2238d15";
const OIRASE_KAN = "12486d1d-2454-4543-9c36-c9720ac9bdef";
const BIJUTSUKAN = "2e754346-7743-41ea-82d4-02d7aa96157c";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const JINJA_MEMO_OLD =
  "休屋のあたりから歩いておよそ11分、十和田湖畔にひっそりと鎮まる十和田神社に着きます。蝦夷平定に赴いた坂上田村麻呂がこの地に社を創建したという言い伝えと、熊野で修行を重ねた僧・南祖坊が、湖の主であったという八郎太郎との力比べの末にこの地に住まうことになったという龍神伝説と、二つの由緒が今に伝わっています。古くから水と龍神への信仰を集めてきた社とされ、杉の巨木が並ぶ参道を歩くと、清らかな空気が感じられます。地域の人々が大切に守り続けてきた信仰の場でもあるので、静かに、敬意をもってお参りください。この後は、歩いておよそ4分、乙女の像へ向かいましょう。";
const JINJA_MEMO_NEW =
  "休屋のあたりから歩いておよそ11分、十和田湖畔にひっそりと鎮まる十和田神社に着きます。蝦夷平定に赴いた坂上田村麻呂がこの地に社を創建したという言い伝えと、熊野で修行を重ねた僧・南祖坊が、湖の主であったという八郎太郎との力比べの末にこの地に住まうことになったという龍神伝説と、二つの由緒が今に伝わっています。古くから水と龍神への信仰を集めてきた社とされ、杉の巨木が並ぶ参道を歩くと、清らかな空気が感じられます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ4分、乙女の像へ向かいましょう。";

const KANKODAI_MEMO_OLD =
  "宿を出て、タクシーでおよそ4分、瞰湖台に着きます。標高583mの峠にある展望台で、御倉半島と中山半島の付け根にあたり、十和田湖の中でも透明度が高いといわれる中湖(なかのうみ)を目の前に見下ろすことができます。運がよければ、湖を行き交う遊覧船の姿を眺めることもできます。この後は、タクシーでおよそ6分、子ノ口へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";
const KANKODAI_MEMO_NEW =
  "宿を出て、タクシーでおよそ4分、瞰湖台に着きます。標高583mの峠にある展望台で、御倉半島と中山半島の付け根にあたり、十和田湖の中でも透明度が高いといわれる中湖(なかのうみ)を目の前に見下ろすことができます。運がよければ、湖を行き交う遊覧船の姿を眺めることもできます。この後は、タクシーでおよそ11分、子ノ口へ向かいましょう。この先は路線バスの便が少ないため、タクシーを利用します。";

const NENOKUCHI_MEMO_OLD =
  "瞰湖台からタクシーでおよそ6分、子ノ口に着きます。十和田神社にお参りし、乙女の像を訪ね、遊覧船や展望台巡りを楽しんだ昨日の旅を振り返りながら、湖から渓流へと変わりゆく水の表情を眺めてみてください。長い距離を歩くので、歩きやすい靴で、飲み物を持って歩きましょう。 この後は、歩いておよそ30分、銚子大滝へ向かいましょう。";
const NENOKUCHI_MEMO_NEW =
  "瞰湖台からタクシーでおよそ11分、子ノ口に着きます。十和田神社にお参りし、乙女の像を訪ね、遊覧船や展望台巡りを楽しんだ昨日の旅を振り返りながら、湖から渓流へと変わりゆく水の表情を眺めましょう。長い距離を歩くので、歩きやすい靴で、飲み物を持って歩きましょう。 この後は、歩いておよそ30分、銚子大滝へ向かいましょう。";

const CHOSHI_OTAKI_MEMO_OLD =
  "子ノ口から歩いておよそ30分、銚子大滝に着きます。十和田湖から流れ出る奥入瀬渓流の本流にかかる滝としては随一とされ、高さおよそ7m、幅およそ20mの流れが豪快な音を立てて落ちています。滝の上に川がないため、魚が十和田湖へさかのぼれない「魚止めの滝」としても知られています。春の新緑、夏の深緑、秋の紅葉、冬の氷瀑と、四季それぞれの表情を見せてくれます。渓流沿いの遊歩道は滑りやすいところがあるので、足元に気をつけ、川に近づきすぎないようにしましょう。落石や倒木にも気をつけ、立ち入り禁止の場所には入らないようにしましょう。 この後は、歩いておよそ140分、石ヶ戸へ向かいましょう。道中には雲井の滝や阿修羅の流れなど、渓流ならではの見どころが続きます。";
const CHOSHI_OTAKI_MEMO_NEW =
  "子ノ口から歩いておよそ30分、銚子大滝に着きます。十和田湖から流れ出る奥入瀬渓流の本流にかかる滝としては随一とされ、高さおよそ7m、幅およそ20mの流れが豪快な音を立てて落ちています。滝の上に川がないため、魚が十和田湖へさかのぼれない「魚止めの滝」としても知られています。春の新緑、夏の深緑、秋の紅葉、冬の氷瀑と、四季それぞれの表情を見せてくれます。渓流沿いの遊歩道は滑りやすいところがあるので、足元に気をつけ、川に近づきすぎないようにしましょう。落石や倒木にも気をつけ、立ち入り禁止の場所には入らないようにしましょう。 この後は、歩いておよそ155分、石ヶ戸へ向かいましょう。道中には雲井の滝や阿修羅の流れなど、渓流ならではの見どころが続きます。";

const ISHIGEDO_MEMO_OLD =
  "銚子大滝から歩いておよそ140分、雲井の滝や阿修羅の流れなど渓流沿いの見どころを眺めながら、石ヶ戸に着きます。「石ヶ戸」とは地元の方言で岩屋を意味し、大きな岩の塊が木々に支えられるようにしてつくる岩陰には、鬼にまつわる言い伝えが残っています。奥入瀬渓流沿いで唯一とされる休憩所があり、軽食や土産物を扱う売店、トイレも整っています。ここで昼食をとるのもよいでしょう。この後は、歩いておよそ70分、焼山へ向かいましょう。";
const ISHIGEDO_MEMO_NEW =
  "銚子大滝から歩いておよそ155分、雲井の滝や阿修羅の流れなど渓流沿いの見どころを眺めながら、石ヶ戸に着きます。「石ヶ戸」とは地元の方言で岩屋を意味し、大きな岩の塊が木々に支えられるようにしてつくる岩陰には、鬼にまつわる言い伝えが残っています。奥入瀬渓流沿いで唯一とされる休憩所があり、軽食や土産物を扱う売店、トイレも整っています。ここで昼食をとりましょう。この後は、歩いておよそ90分、焼山へ向かいましょう。";

const OIRASE_KAN_MEMO_OLD =
  "石ヶ戸から歩いておよそ70分、奥入瀬渓流の終点にあたる焼山に着き、奥入瀬渓流館に立ち寄ります。渓流の成り立ちや、そこに暮らす動植物を解説する展示があり、ガイドカウンターには自然に詳しいスタッフが常駐しています。物産コーナーには渓流散策グッズのほか、青森りんごを使ったカフェもあります。営業時間は季節によって変わるので、訪れる前に確かめておきましょう。子ノ口から続いた渓流沿いの散策も、ここでひと区切りです。この後は、焼山の乗り場からタクシーに乗り、十和田市現代美術館へ向かいましょう。";
const OIRASE_KAN_MEMO_NEW =
  "石ヶ戸から歩いておよそ90分、奥入瀬渓流の終点にあたる焼山に着き、奥入瀬渓流館に立ち寄ります。渓流の成り立ちや、そこに暮らす動植物を解説する展示があり、ガイドカウンターには自然に詳しいスタッフが常駐しています。物産コーナーには渓流散策グッズのほか、青森りんごを使ったカフェもあります。営業時間は季節によって変わるので、訪れる前に確かめておきましょう。子ノ口から続いた渓流沿いの散策も、ここでひと区切りです。この後は、焼山の乗り場からタクシーに乗り、十和田市現代美術館へ向かいましょう。";

const BIJUTSUKAN_MEMO_OLD =
  "焼山からタクシーでおよそ33分、官庁街通りに面した十和田市現代美術館に着きます。草間彌生の「愛はとこしえ十和田でうたう」や、奈良美智の「夜露死苦ガール2012」、ロン・ミュエクの「スタンディング・ウーマン」など、国内外の現代アーティストの作品を、建物と一体になった展示室でじっくり見ることができます。館の前に広がる官庁街通りには、鈴木康広の「はじまりの果実」をはじめとする屋外アート作品が点在しており、入館しなくても歩きながら眺めることができます。休館日は公式サイトで確かめてから訪れましょう。美術館からは、十和田市中央のバス停まで歩き、八戸駅や七戸十和田駅へ向かうバスで戻りましょう。";
const BIJUTSUKAN_MEMO_NEW =
  "焼山からタクシーでおよそ22分、官庁街通りに面した十和田市現代美術館に着きます。草間彌生の「愛はとこしえ十和田でうたう」や、奈良美智の「夜露死苦ガール2012」、ロン・ミュエクの「スタンディング・ウーマン」など、国内外の現代アーティストの作品を、建物と一体になった展示室でじっくり見ることができます。館の前に広がる官庁街通りには、鈴木康広の「はじまりの果実」をはじめとする屋外アート作品が点在しており、入館しなくても歩きながら眺めることができます。休館日は公式サイトで確かめてから訪れましょう。美術館からは、十和田市中央のバス停まで歩き、八戸駅や七戸十和田駅へ向かうバスで戻りましょう。";

async function main() {
  const ids = [JINJA, HOKKETOGE, KANKODAI, NENOKUCHI, CHOSHI_OTAKI, ISHIGEDO, OIRASE_KAN, BIJUTSUKAN];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checkTime = (id: string, h: number, m: number, label: string) => {
    const v = byId.get(id)!.visitTime;
    if (!v || v.getUTCHours() !== h || v.getUTCMinutes() !== m) throw new Error(`${label}: visitTimeの現在値が期待と不一致`);
  };
  if (Number(byId.get(JINJA)!.lat) !== 40.433194 || Number(byId.get(JINJA)!.lng) !== 140.892222) {
    throw new Error("十和田神社: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(HOKKETOGE)!.lat) !== 40.408787 || Number(byId.get(HOKKETOGE)!.lng) !== 140.864257) {
    throw new Error("発荷峠展望台: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(KANKODAI)!.lat) !== 40.439296 || Number(byId.get(KANKODAI)!.lng) !== 140.916438) {
    throw new Error("瞰湖台: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(NENOKUCHI)!.lat) !== 40.479196 || Number(byId.get(NENOKUCHI)!.lng) !== 140.940292) {
    throw new Error("子ノ口: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(ISHIGEDO)!.lat) !== 40.540613 || Number(byId.get(ISHIGEDO)!.lng) !== 140.978257) {
    throw new Error("石ヶ戸: 座標の現在値が期待と不一致");
  }
  if (Number(byId.get(BIJUTSUKAN)!.lat) !== 40.613899 || Number(byId.get(BIJUTSUKAN)!.lng) !== 141.209351) {
    throw new Error("十和田市現代美術館: 座標の現在値が期待と不一致");
  }
  checkTime(KANKODAI, 9, 0, "瞰湖台");
  checkTime(NENOKUCHI, 9, 30, "子ノ口");
  checkTime(CHOSHI_OTAKI, 10, 30, "銚子大滝");
  checkTime(ISHIGEDO, 13, 15, "石ヶ戸");
  checkTime(OIRASE_KAN, 14, 55, "奥入瀬渓流館");
  checkTime(BIJUTSUKAN, 15, 53, "十和田市現代美術館");
  if (byId.get(KANKODAI)!.stayDurationMin !== 24) throw new Error("瞰湖台: 滞在の現在値が期待と不一致");
  if (byId.get(NENOKUCHI)!.stayDurationMin !== 30) throw new Error("子ノ口: 滞在の現在値が期待と不一致");
  if (byId.get(CHOSHI_OTAKI)!.stayDurationMin !== 25) throw new Error("銚子大滝: 滞在の現在値が期待と不一致");
  if (byId.get(OIRASE_KAN)!.stayDurationMin !== 25) throw new Error("奥入瀬渓流館: 滞在の現在値が期待と不一致");
  if (byId.get(JINJA)!.memo !== JINJA_MEMO_OLD) throw new Error("十和田神社: memo現在値が期待と不一致");
  if (byId.get(KANKODAI)!.memo !== KANKODAI_MEMO_OLD) throw new Error("瞰湖台: memo現在値が期待と不一致");
  if (byId.get(NENOKUCHI)!.memo !== NENOKUCHI_MEMO_OLD) throw new Error("子ノ口: memo現在値が期待と不一致");
  if (byId.get(CHOSHI_OTAKI)!.memo !== CHOSHI_OTAKI_MEMO_OLD) throw new Error("銚子大滝: memo現在値が期待と不一致");
  if (byId.get(ISHIGEDO)!.memo !== ISHIGEDO_MEMO_OLD) throw new Error("石ヶ戸: memo現在値が期待と不一致");
  if (byId.get(OIRASE_KAN)!.memo !== OIRASE_KAN_MEMO_OLD) throw new Error("奥入瀬渓流館: memo現在値が期待と不一致");
  if (byId.get(BIJUTSUKAN)!.memo !== BIJUTSUKAN_MEMO_OLD) throw new Error("十和田市現代美術館: memo現在値が期待と不一致");

  console.log("前提の確認OK。\n");
  console.log("[座標] 十和田神社→way586654325。発荷峠展望台→way216109758。瞰湖台→「瞰湖台展望台」node3239593971。子ノ口→「子ノ口橋」way111063854。石ヶ戸→node2417882327。十和田市現代美術館→way556758191");
  console.log("[Day2 時刻のつながり、環境省公式で区間を確かめ直した] 瞰湖台09:00(15)→子ノ口09:26(20,car11)→銚子大滝10:16(17,walk30、公式と一致・変更なし)→石ヶ戸13:08(30,walk155、公式に合わせ140→155、昼食)→奥入瀬渓流館15:08(17,walk90、公式に合わせ70→90)→十和田市現代美術館15:47(45,car22、16:32出発=もとの16:38より早い)");
  console.log("[文] 十和田神社の祈りの一文を決まりの形に直す。子ノ口「眺めてみてください」→「眺めましょう」。石ヶ戸「昼食をとるのもよいでしょう」→「昼食をとりましょう」。銚子大滝・石ヶ戸・奥入瀬渓流館の分数を環境省公式に合わせて更新");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: JINJA }, data: { lat: 40.433161, lng: 140.892145, memo: JINJA_MEMO_NEW } });
    await tx.spot.update({ where: { id: HOKKETOGE }, data: { lat: 40.408797, lng: 140.864253 } });
    await tx.spot.update({
      where: { id: KANKODAI },
      data: { stayDurationMin: 15, lat: 40.440723, lng: 140.917735, memo: KANKODAI_MEMO_NEW },
    });
    await tx.spot.update({
      where: { id: NENOKUCHI },
      data: {
        visitTime: t(9, 26),
        stayDurationMin: 20,
        lat: 40.478508,
        lng: 140.941165,
        memo: NENOKUCHI_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 11 }] },
      },
    });
    await tx.spot.update({
      where: { id: CHOSHI_OTAKI },
      data: { visitTime: t(10, 16), stayDurationMin: 17, memo: CHOSHI_OTAKI_MEMO_NEW },
    });
    await tx.spot.update({
      where: { id: ISHIGEDO },
      data: {
        visitTime: t(13, 8),
        lat: 40.54046,
        lng: 140.978945,
        memo: ISHIGEDO_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 155 }] },
      },
    });
    await tx.spot.update({
      where: { id: OIRASE_KAN },
      data: {
        visitTime: t(15, 8),
        stayDurationMin: 17,
        memo: OIRASE_KAN_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 90 }] },
      },
    });
    await tx.spot.update({
      where: { id: BIJUTSUKAN },
      data: {
        visitTime: t(15, 47),
        lat: 40.614003,
        lng: 141.208965,
        memo: BIJUTSUKAN_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 22 }] },
      },
    });
  });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

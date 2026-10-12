/**
 * #129 cc984fa1(書寫山圓教寺、西の比叡山と呼ばれる古刹を訪ねる姫路の
 * 歴史旅)の全面見直し。
 *
 * もとは「書寫山ロープウェイ」「圓教寺」(摩尼殿・三之堂をまとめて1つの
 * スポットで説明)の2か所のみ(09:30〜11:45)で4か所未満。終始案内役の
 * 話し方(皆様・ご案内する・お楽しみください・ご案内いたします・
 * お楽しみいただけたことでしょう)。
 *
 * #10(54f0fa20、姫路城と書写山圓教寺の1泊2日)でも同じ書写山の内容を
 * 扱っているため、文章は別に書いた(同じ事実でも表現・切り口を変える)。
 * #10では摩尼殿・大講堂三之堂・開山堂の3か所だったが、ここでは単体の
 * 日帰りプランとして、書写の里・美術工芸館(姫路市立、山麓駅のそば)・
 * 仁王門(三棟造り、境内入口)も加え、6か所に組み直した。
 *
 * 座標(すべてOSM、#10と同じ地点は同じ値を使用):
 * - 書写の里・美術工芸館: 34.8807120, 134.6666080(osm node 1423058680)
 * - 書写山ロープウェイ山麓駅: 34.878576, 134.666726(osm node 309465913、
 *   #10のfix-10cで確認済みの実点)
 * - 仁王門: 34.8889646, 134.6604727(osm way 255365943)
 * - 摩尼殿: 34.891426, 134.657542(osm way 28174996、#10のfix-10dで確認済み)
 * - 大講堂・三之堂: 34.892547, 134.654782(osm way 255365946、#10と同じ)
 * - 開山堂: 34.892938, 134.653194(osm way 255365921、#10と同じ)
 *
 * 出典: 仁王門の三棟造りはmlit.go.jp/tagengo-db/R2-01607.html、境内の
 * 東谷・中谷・西谷の区分はwalkerplus.com記事で確認。書写の里・美術
 * 工芸館は姫路市立(姫路市公式サイトで確認)。
 *
 * 【企画運営への申し送り】書写山単体の内容では、通常の見学時間で
 * 6か所を回っても13:17終了にしかならない。姫路市街側の行き先を足すと
 * #10・#218・#232と重なるため、今回は6か所・滞在は通常の長さのまま
 * 報告する。延長が必要な場合は指示を仰ぐ。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SATO_MEMO =
  "JR姫路駅から神姫バスでおよそ30分、書写山ロープウェイ山麓駅のそばにある書写の里・美術工芸館に着きます。姫路市立の美術館で、書写出身の僧・清水公照にゆかりの泥仏や書、播磨地方に伝わる伝統工芸品などを展示しています。竹林に囲まれた静かな環境で、山に入る前のひとときを過ごしましょう。この後は、歩いておよそ5分、書写山ロープウェイ山麓駅へ向かいましょう。";

const ROPEWAY_MEMO =
  "書写の里・美術工芸館から歩いておよそ5分、書写山ロープウェイ山麓駅に着きます。姫路市街の北西に位置する書写山の山麓と山上とを結ぶロープウェイで、昭和33年(1958)に開業しました。山麓駅からおよそ4分の空中散歩で山上駅まで運んでくれ、窓の外には姫路市街や瀬戸内海まで見渡す景色が広がります。山上駅には展望デッキもあり、播磨平野を一望できます。この後は、仁王門を抜けて、西の比叡山と呼ばれる古刹・圓教寺の境内へ向かいましょう。";

const NIOMON_MEMO =
  "山上駅から参道を歩いておよそ10分、仁王門に着きます。書寫山圓教寺の表玄関にあたる門で、俗世と聖域の境目を示しています。東大寺や法隆寺など、日本でも古い寺院にだけ見られる「三棟造り」という珍しい様式で建てられています。この先、仁王門から十妙院までを「東谷」、摩尼殿までを「中谷」、大講堂・食堂・常行堂から開山堂のある奥の院までを「西谷」と呼びます。この後は、参道を歩いておよそ10分、摩尼殿へ向かいましょう。";

const MANIDEN_MEMO =
  "仁王門から参道を歩いておよそ10分、断崖に張り出すように建つ舞台造りの本堂・摩尼殿が見えてきます。康保3年(966)、性空上人がこの地に草庵を結んだのが始まりと伝えられ、古くから「西の比叡山」とも呼ばれてきました。中世には比叡山・大山とともに天台宗の三大道場の一つともいわれ、西国三十三所第二十七番札所として今も多くの参拝者を集めています。清水寺の舞台のように、崖にせり出した懸造りの本堂からの眺めも見どころです。境内は今も修行や参拝が続けられる祈りの場ですので、敬意を持ってお参りしましょう。この後は、山道を歩いておよそ15分、大講堂・三之堂へ向かいましょう。";

const SANNODO_MEMO =
  "摩尼殿から山道を歩いておよそ15分、境内の中でも最奥に近い「西谷」にあたる「三之堂」と呼ばれる一角に着きます。学問と修行の場である大講堂、僧侶の食事の場だった食堂、不断念仏を唱えた常行堂の3つが、コの字型に向かい合って建つ荘厳な空間で、いずれも室町時代の建築として国の重要文化財に指定されています。食堂は、1階が写経道場、2階が寺宝の展示館になっており、内部を見学できます。この趣ある佇まいから、映画『ラストサムライ』をはじめ、数多くの時代劇や映画のロケ地にも選ばれてきました。山道には坂や段差があるので、足元に気をつけて歩きましょう。この後は、歩いておよそ3分、開山堂へ向かいましょう。";

const KAIZANDO_MEMO =
  "三之堂からさらに奥へ、開山堂に着きます。圓教寺を開いた性空上人を祀る、江戸時代初期を代表する建築で、軒下の四隅には、名工・左甚五郎の作と伝えられる力士の彫刻が施されています。今にも軒を持ち上げそうな力士の姿を、間近で見上げてみましょう。書写山での拝観の締めくくりに、敬意を持って参拝しましょう。参拝を終えたら、参道を戻ってロープウェイで下山し、バスで姫路駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;

  const ropeway = await findSpotInItinerary(itinId, { spotName: "書寫山ロープウェイ" });
  const enkyoji = await findSpotInItinerary(itinId, { spotName: "圓教寺" });

  console.log("確認OK。dayId:", ropeway.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        title: "書寫山圓教寺、仁王門から奥之院までめぐる姫路の歴史旅",
        description:
          "ロープウェイで登る書写山の中腹に建つ圓教寺。「西の比叡山」とも呼ばれる古刹の仁王門・摩尼殿・三之堂・開山堂を、山麓の美術館とあわせてめぐるプランです。",
      },
    });

    const items: SpotOrderItem[] = [
      {
        create: {
          name: "書写の里・美術工芸館",
          memo: SATO_MEMO,
          lat: 34.880712,
          lng: 134.666608,
          visitTime: t(8, 30),
          stayDurationMin: 40,
        },
      },
      {
        id: ropeway.id,
        data: {
          memo: ROPEWAY_MEMO,
          lat: 34.878576,
          lng: 134.666726,
          visitTime: t(9, 15),
          stayDurationMin: 15,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        create: {
          name: "仁王門",
          memo: NIOMON_MEMO,
          lat: 34.8889646,
          lng: 134.6604727,
          visitTime: t(9, 34),
          stayDurationMin: 20,
          transitLegs: { create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 4, transitLine: null }] },
        },
      },
      {
        id: enkyoji.id,
        data: {
          name: "摩尼殿",
          memo: MANIDEN_MEMO,
          lat: 34.891426,
          lng: 134.657542,
          visitTime: t(10, 9),
          stayDurationMin: 60,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        create: {
          name: "大講堂・三之堂",
          memo: SANNODO_MEMO,
          lat: 34.892547,
          lng: 134.654782,
          visitTime: t(11, 24),
          stayDurationMin: 75,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
        },
      },
      {
        create: {
          name: "開山堂（奥之院）",
          memo: KAIZANDO_MEMO,
          lat: 34.892938,
          lng: 134.653194,
          visitTime: t(12, 42),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(ropeway.dayId, items, {});
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

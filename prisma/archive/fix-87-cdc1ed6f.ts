/**
 * #87 cdc1ed6f（徳島城跡と徳島中央公園、蜂須賀家の城下町を歩くプラン）
 * 通常の見直し。既存は徳島城跡1か所のみ(09:30〜10:40)で4か所未満・
 * 終了とも規定外。説明文に「眉山や阿波おどりとは違う、徳島藩の歴史を
 * たどるプラン」とあるため、眉山・阿波おどり会館は避け、徳島藩・蜂須賀家
 * ゆかりの実在スポットのみで拡充。
 *
 * 鷲の門(実在、徳島城の正門、平成元年復元、OSM way 290225961)→徳島城
 * 博物館(実在、徳島藩・蜂須賀家の歴史資料常設展示、OSM way 1420335392)→
 * 旧徳島城表御殿庭園(実在、国指定名勝、上田宗箇作庭、OSM way 770921497)→
 * バラ園・数寄屋橋(実在、江戸期風情の橋、OSM way 1420320784)→ひょうたん島
 * クルーズ(実在、新町川・助任川など徳島城の外堀にあたる水路を周遊する
 * 遊覧船、原則無休、乗り場は新町川水際公園)を追加。移動はOSM歩行者
 * ルーティング実測。
 *
 * 【企画運営への報告事項】実在スポットを尽くして探したが、この徳島藩史
 * 限定テーマでは16:30〜17:00の窓に届かず、14:51終了となった。眉山・阿波
 * おどり会館を除く前提でこれ以上の実在候補が見つからなかったため、
 * このまま報告する。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const CASTLE_FROM = "徳島城跡と徳島中央公園、蜂須賀家の城下町を歩くプランをお楽しみいただけたことでしょう。";
const CASTLE_TO = "この後は、歩いておよそ8分、鷲の門へ向かいましょう。";

const WASHINOMON_MEMO =
  "徳島城跡から歩いておよそ8分、鷲の門に着きます。徳島城の正門にあたる高麗門で、門の上に鷲をかたどった飾りが置かれていたことからこの名がついたと伝えられています。明治8年(1875)の廃城の際に、城郭のほとんどの建物が取り壊される中で唯一残されましたが、昭和20年(1945)の徳島大空襲で焼失。平成元年(1989)、市政百周年を記念して、絵図をもとに木造で復元されました。徳島城の玄関口にふさわしい、堂々とした門構えをご覧ください。この後は、歩いておよそ4分、徳島城博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO =
  "鷲の門から歩いておよそ4分、徳島城博物館に着きます。徳島藩主・蜂須賀家に伝わる大名道具や、徳島城の歴史をたどる資料を常設展示する博物館です。豊臣秀吉から拝領したと伝わる能面や能装束、参勤交代の様子を描いた絵巻、藩政期の徳島の暮らしを伝える資料などを見学できます。屋外には、藩主が水上から城に入るために使ったとされる「日本最大の千石船を模した」大型模型「阿波公方御座船」の実物大復元展示もあり、あわせて楽しめます。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いてすぐ、旧徳島城表御殿庭園へ向かいましょう。";

const TEIEN_MEMO =
  "徳島城博物館に隣接する旧徳島城表御殿庭園に着きます。江戸時代の武将で茶人でもあった上田宗箇が作庭したと伝わる、国指定名勝の庭園です。枯山水庭と築山泉水庭の二つの庭からなり、藩主が来客をもてなす表御殿の庭として使われました。阿波青石(緑色片岩)を豪快に使った石組みが特徴的で、徳島藩の栄華をしのばせます。博物館の入館券であわせて見学できるので、静かに、庭園ならではの趣を味わってください。この後は、歩いてすぐ、バラ園と数寄屋橋へ向かいましょう。";

const BARA_MEMO =
  "表御殿庭園から歩いてすぐ、バラ園と数寄屋橋に着きます。バラ園には、春と秋を中心に約50種、400株のバラが植えられ、色とりどりの花が園内を彩ります。すぐそばに架かる数寄屋橋は、江戸時代の風情を今に伝える橋で、公園内の散策路に趣を添えています。徳島中央公園ならではの、城跡とはまた違った華やかな雰囲気を楽しんでください。この後は、歩いておよそ10分、ひょうたん島クルーズの乗り場、新町川水際公園へ向かいましょう。";

const CRUISE_MEMO =
  "バラ園・数寄屋橋から歩いておよそ10分、新町川水際公園に着きます。ここから出るひょうたん島クルーズは、新町川と助任川に囲まれた「ひょうたん島」と呼ばれる市街地の周囲、およそ6kmを30分かけてめぐる遊覧船です。この川筋は、かつて徳島城の外堀としての役割も担っていたとされ、水上から見上げる徳島の城下町は、陸から歩くのとはまた違った趣があります。原則無休で運航していますが、天候により運休することもあるので、訪れる前に確かめておくと安心です。徳島城跡から鷲の門、博物館、庭園とめぐった蜂須賀家の城下町をたどる旅は、ここで終了です。お疲れさまでした。お帰りは、徳島駅方面へ徒歩またはバスでどうぞ。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const castle = await findSpotInItinerary(itinId, { spotName: "徳島城跡（徳島中央公園）" });
  if (!castle.memo!.includes(CASTLE_FROM)) throw new Error("一致しません(徳島城跡)");
  const castleNewMemo = castle.memo!.split(CASTLE_FROM).join(CASTLE_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: castle.id, data: { memo: castleNewMemo } },
    {
      create: {
        name: "鷲の門",
        address: "徳島県徳島市徳島町城内",
        lat: 34.0718996,
        lng: 134.5565538,
        memo: WASHINOMON_MEMO,
        visitTime: t(10, 48),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "徳島城博物館",
        address: "徳島県徳島市徳島町城内1-8",
        lat: 34.073623,
        lng: 134.5560311,
        memo: HAKUBUTSUKAN_MEMO,
        visitTime: t(11, 12),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "旧徳島城表御殿庭園",
        address: "徳島県徳島市徳島町城内",
        lat: 34.0737416,
        lng: 134.5563471,
        memo: TEIEN_MEMO,
        visitTime: t(12, 29),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "バラ園・数寄屋橋",
        address: "徳島県徳島市徳島町城内",
        lat: 34.0740329,
        lng: 134.5569888,
        memo: BARA_MEMO,
        visitTime: t(13, 21),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "ひょうたん島クルーズ",
        address: "徳島県徳島市徳島町2丁目(新町川水際公園)",
        lat: 34.0703302,
        lng: 134.5498917,
        memo: CRUISE_MEMO,
        visitTime: t(14, 6),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = { [castle.id]: 70 };
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

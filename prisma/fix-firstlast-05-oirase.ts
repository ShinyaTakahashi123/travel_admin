/**
 * 3b17f9a0（奥入瀬渓流・十和田湖1泊2日）初日の見直し（2026-10-30。企画運営・法務の指摘で
 * 複数回組み直し。最終版は「上流へ片道だけ歩き、上流のバス停から乗る」形、法務案④）
 * 仕様: docs/specs/20261029-first-last-day-times.md。1泊2日のため最終日(Day2)は決まりどおり直さない。
 *
 * 「遠い場所の例外」（企画運営・ユーザー承認、2026-10-30）: 奥入瀬渓流は八戸駅からのバスが
 * 1日2便（八戸駅発JRバス、十和田市公式資料で10:00・13:30）しかなく、10:30以降に入口へ着く
 * 通常の決まりでは初日が成立しないため、入口（八戸駅）9:50ごろ着の例外を使う。
 * 列車・バスの名前・発着の時刻は本文に書かない決まり（法務指摘）のため「午前のJRバス」
 * 「最新の時刻は公式の時刻表で確かめましょう」の形にする。
 *
 * 出典（すべて公式。法務指摘を受け、より新しいJRバス東北自社サイトの時刻を優先）:
 * - 発着の全体像（八戸駅⇔渓流、渓流館・子ノ口・休屋の所要）: 十和田市都市整備建築課
 *   「関係時刻表」(2024-04-16、city.towada.lg.jp/shisei/access/files/jikokuhyou.pdf)。
 *   渓流館→子ノ口29分、子ノ口→休屋15分（あわせて44分）
 * - 停留所ごとの時刻（現行、2026-10-30確認）: JRバス東北公式サイト
 *   jrbustohoku.co.jp/towadako-oirase/ 。渓流館・石ヶ戸・雲井の滝の時刻が掲載されており、
 *   渓流館を基準に石ヶ戸は+8分、雲井の滝は+14分で終日一定（例: 渓流館11:36→石ヶ戸11:44→
 *   雲井の滝11:50）。この差から、雲井の滝→休屋は 44-14=30分と算出
 * - 渓流館から先の徒歩の区間時間: 環境省 十和田八幡平国立公園 公式コース案内
 *   (env.go.jp/nature/nationalparks/list/towada-hachimantai/course/01/)。
 *   渓流館→三乱の流れ75分→石ヶ戸15分（あわせて90分/5.0km）→阿修羅の流れ35分/1.7km→
 *   雲井の滝25分/1.1km（石ヶ戸→雲井の滝を直接歩く場合は35+25=60分）
 * - 十和田湖遊覧船は正確な時刻表が確認できなかったため、雲井の滝から休屋まではJRバスを使う
 *
 * 阿修羅の流れは、OSM・地理院（住所検索）のどちらにも名前の点がなく、周囲300mも川と
 * 国道102号しかないため、7章の決まりによりスポットとしては外す（企画運営指摘、2026-10-30）。
 * 内容は、もとの文を生かして雲井の滝のメモの書き出しで、歩く途中の見どころとして紹介する。
 * 浮いた時間は延ばさず、そのまま雲井の滝でのバス待ちの余裕にする。
 *
 * 組み方: 渓流館(11:36)→徒歩90分→石ヶ戸(13:12、昼食24分、途中に阿修羅の流れ)→
 * 徒歩60分→雲井の滝(14:36、44分の余裕を見てバスへ)→バス30分→御前ヶ浜/休屋(15:50)→
 * 散策45分→16:35に宿へ
 *
 * 座標の直し（7章の決まり。OSM/Nominatimの値に）:
 * - 奥入瀬渓流館: OSM node 6161325321
 * - 石ヶ戸: OSM node 2417882327
 * - 雲井の滝: OSM node 753051812
 * - 御前ヶ浜（新規、十和田湖遊覧船のスポットを転用）: OSM way 1287876823
 * - （Day2、時刻は変更なし）十和田神社: OSM way 586654325
 * - （Day2、時刻は変更なし）乙女の像: OSM node 5599655373
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");

const RYUUKAN = "e34e2457-12b5-45e3-9b37-c46d8ff518b6";
const ISHIGEDO = "c3cba7a7-090c-4895-9e27-97b7e6eca432";
const ASHURA = "fae2d041-5edd-473b-9cdc-0c1d8e53fb6d"; // 削除（名前の点がないため）
const KUMOI = "d1685284-86c5-48d8-90f8-99c11745efd4";
const TOWADA_JINJA = "5643714c-b098-4147-bedf-f14e5ae4ba74"; // Day2, 座標のみ
const OTOME = "08f598a2-d6da-4910-8085-f083a1949f51"; // Day2, 座標のみ
const TAMADARE = "0bb5c45a-98f6-438f-bdc3-a18d3b5323dc"; // 削除
const SHIRAITO = "f85ee975-ecb3-4d0d-9e43-5576edfe5eba"; // 削除
const KUDAN = "3c52600b-fc9a-4922-a0df-de2aad168f96"; // 削除
const CHOUSHI = "96ed660e-05b4-4557-ba16-a2dc595176e3"; // 削除
const GORYOU = "cd7c40dc-9057-4f05-bce5-37dd667d1fba"; // 削除
const KONOGUCHI = "b487f6d8-4d3d-4fab-a4ff-38e6a1232f12"; // 削除
const YUURANSEN = "061a19e8-d725-4709-930b-5f6e79cbded7"; // 御前ヶ浜に転用

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESC_OLD =
  "渓流沿いの遊歩道を歩いて奥入瀬の滝や急流をめぐり、遊覧船で湖上から紅葉を眺めて十和田湖畔に宿泊。2日目は展望台などをめぐる1泊2日プランです。例年の見頃は10月中旬〜下旬。バスと徒歩を組み合わせて、見どころを効率よくめぐります。";
const DESC_NEW =
  "渓流沿いの遊歩道を歩いて奥入瀬の滝や急流をめぐり、バスで十和田湖畔の休屋へ。2日目は展望台などをめぐる1泊2日プランです。例年の見頃は10月中旬〜下旬。バスと徒歩を組み合わせてめぐります。";

const RYUUKAN_MEMO_OLD =
  "前泊した八戸市内から、朝早くのJRバス東北で奥入瀬渓流の入口まで向かいましょう。およそ2時間の道のりです。こちらが渓流の散策の入口となる「奥入瀬渓流館」です。館内では、渓流がどのようにして生まれたのか、そこに暮らす動植物の様子などを、パネルや映像、模型を通して紹介しています。これから歩く渓流の見どころを、あらかじめ知っておくことで、実際の風景がより一層心に残るものになるでしょう。館内にはネイチャーガイドが常駐する案内カウンターもあるので、季節ごとの見頃の情報なども気軽に尋ねられます。売店やカフェも併設されているので、散策前の準備やひとやすみにもどうぞご利用ください。それでは、いよいよ渓流歩きへ向かいましょう。";
const RYUUKAN_MEMO_NEW =
  "八戸駅に9時50分ごろ着いたら、十和田湖方面へ向かう午前のJRバスに乗りましょう（奥入瀬渓流行きのバスは1日に数便のため、最新の時刻は公式の時刻表で確かめましょう）。渓流沿いを進み、奥入瀬渓流館までおよそ1時間半です。こちらが渓流の散策の入口となる「奥入瀬渓流館」です。館内では、渓流がどのようにして生まれたのか、そこに暮らす動植物の様子などを、パネルや映像、模型を通して紹介しています。それでは、遊歩道を歩いて石ヶ戸まで向かいましょう。";

const ISHIGEDO_MEMO_OLD =
  "渓流館を後にして最初に立ち寄るのが「石ヶ戸」です。この地方の言葉で「石でできた小屋」を意味する名の通り、桂の木に支えられた大きな一枚岩が小屋のように見えることから、そう呼ばれるようになったと伝えられています。その昔、この場所を根城にしていた女盗賊の伝説も残されているのだそうです。休憩所も設けられているので、これから始まる渓流歩きの前に、身支度を整えるのにもちょうどよい場所です。紅葉の季節、色づき始めた木々を眺めながら、ここから十和田湖を目指す旅の第一歩を踏み出してまいりましょう。";
const ISHIGEDO_MEMO_NEW =
  "渓流館から遊歩道をおよそ90分歩くと、「石ヶ戸」に着きます。この地方の言葉で「石でできた小屋」を意味する名の通り、桂の木に支えられた大きな一枚岩が小屋のように見えることから、そう呼ばれるようになったと伝えられています。その昔、この場所を根城にしていた女盗賊の伝説も残されているのだそうです。休憩所もあるので、ここで昼食をとりましょう（売店は季節や時間によって開いていないこともあるので、昼食を持っていくと安心です）。身支度を整えたら、雲井の滝へ向かいましょう。";

const KUMOI_MEMO_OLD =
  "渓流を代表する滝のひとつ「雲井の滝」に着きます。崖を流れ落ちる水しぶきが雲のように舞う様子から名付けられたと伝えられるこの滝は、四季それぞれに異なる表情を見せることで知られています。冬には周囲が雪に覆われ、幻想的な氷の姿へと姿を変えるのだそうですが、今の季節は、色づいた木々を背景に、白い水しぶきが一段と映える美しい眺めを楽しめます。遊歩道からも近く、秋の澄んだ空気の中で、滝の音とともにゆっくりと楽しめる見どころです。この先、玉簾の滝・白絹の滝へ向かう道すがら、腰を据えて昼食をとるのにもよい頃合いです。";
const KUMOI_MEMO_NEW =
  "石ヶ戸から遊歩道をおよそ60分歩くと、渓流を代表する滝のひとつ「雲井の滝」に着きます。途中には、荒々しく岩を噛むように流れる姿から「阿修羅の流れ」と呼ばれる早瀬もあり、赤や黄に色づいた木々と白く泡立つ流れが重なり合う、紅葉の季節ならではの景色が広がります。雲井の滝は、崖を流れ落ちる水しぶきが雲のように舞う様子から名付けられたと伝えられ、四季それぞれに異なる表情を見せることで知られています。冬には周囲が雪に覆われ、幻想的な氷の姿へと姿を変えるのだそうですが、今の季節は、色づいた木々を背景に、白い水しぶきが一段と映える美しい眺めを楽しめます。遊歩道からも近く、秋の澄んだ空気の中で、滝の音とともにゆっくりと楽しめる見どころです。ここからは、JRバスに乗って十和田湖畔の休屋へ向かいましょう（バスの時刻に遅れないよう、早めにバス停へ向かいましょう。バス停の場所・時刻は公式の時刻表で確かめましょう）。";

const YUURANSEN_NAME_NEW = "御前ヶ浜";
const YUURANSEN_MEMO_OLD =
  "子ノ口からは、十和田湖遊覧船に乗って、今夜の宿がある休屋まで湖を渡ります。子ノ口から休屋まではおよそ50分の船旅で、御倉半島や中山半島など、陸路からは見えない湖岸の景色を楽しめます。渓流歩きの疲れを癒やしながら、甲板から十和田湖の雄大な眺めを楽しんでください。休屋に着いたら、今夜の宿でゆっくりお休みください。";
const YUURANSEN_MEMO_NEW =
  "雲井の滝からJRバスに乗って、十和田湖畔の休屋へ向かいましょう。休屋に着いたら、湖畔の御前ヶ浜を歩いてみましょう。波の静かな十和田湖の湖面と、色づく木々が織りなす景色が広がります。浜のそばには、彫刻家・高村光太郎が手掛けた「乙女の像」も立ち、夕暮れどきの静かな佇まいを眺められます（2日目に、あらためて間近で見学します）。この夜は、休屋の宿に泊まりましょう。";

async function main() {
  const itinerary = await prisma.itinerary.findUniqueOrThrow({
    where: { id: "3b17f9a0-a0ae-492e-bf20-9132f52d1574" },
    include: { days: { orderBy: { dayNumber: "asc" } } },
  });
  const day1 = itinerary.days.find((d) => d.dayNumber === 1);
  if (!day1) throw new Error("day1 not found");

  if (itinerary.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  const spots = await prisma.spot.findMany({
    where: { id: { in: [RYUUKAN, ISHIGEDO, KUMOI, YUURANSEN, TOWADA_JINJA, OTOME] } },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));
  const ryuukan = byId.get(RYUUKAN)!;
  const ishigedo = byId.get(ISHIGEDO)!;
  const kumoi = byId.get(KUMOI)!;
  const yuuransen = byId.get(YUURANSEN)!;
  const towadaJinja = byId.get(TOWADA_JINJA)!;
  const otome = byId.get(OTOME)!;

  if (ryuukan.memo !== RYUUKAN_MEMO_OLD) throw new Error("奥入瀬渓流館: memo現在値が期待と不一致");
  if (ishigedo.memo !== ISHIGEDO_MEMO_OLD) throw new Error("石ヶ戸: memo現在値が期待と不一致");
  if (kumoi.memo !== KUMOI_MEMO_OLD) throw new Error("雲井の滝: memo現在値が期待と不一致");
  if (yuuransen.memo !== YUURANSEN_MEMO_OLD) throw new Error("十和田湖遊覧船: memo現在値が期待と不一致");
  if (ryuukan.lat?.toString() !== "40.5746" || ryuukan.lng?.toString() !== "140.9788") {
    throw new Error(`奥入瀬渓流館: 座標現在値が期待と不一致。現在値=${ryuukan.lat},${ryuukan.lng}`);
  }
  if (ishigedo.lat?.toString() !== "40.540613" || ishigedo.lng?.toString() !== "140.978257") {
    throw new Error(`石ヶ戸: 座標現在値が期待と不一致。現在値=${ishigedo.lat},${ishigedo.lng}`);
  }
  if (kumoi.lat?.toString() !== "40.5202" || kumoi.lng?.toString() !== "140.9732") {
    throw new Error(`雲井の滝: 座標現在値が期待と不一致。現在値=${kumoi.lat},${kumoi.lng}`);
  }
  if (towadaJinja.lat?.toString() !== "40.433194" || towadaJinja.lng?.toString() !== "140.892222") {
    throw new Error(`十和田神社: 座標現在値が期待と不一致。現在値=${towadaJinja.lat},${towadaJinja.lng}`);
  }
  if (otome.lat?.toString() !== "40.4329" || otome.lng?.toString() !== "140.8897") {
    throw new Error(`乙女の像: 座標現在値が期待と不一致。現在値=${otome.lat},${otome.lng}`);
  }
  console.log("前提の確認OK。\n");

  console.log("[説明文] 遊覧船→バスの記述に直す");
  console.log("\n[初日] 阿修羅の流れ(名前の点がないため外す)・玉簾の滝・白絹の滝・九段の滝・銚子大滝・五両ノ滝・子ノ口を削除。新しい並び（片道のみ、往復なし）:");
  console.log("奥入瀬渓流館(11:36,stay6)→[walk90]→石ヶ戸(13:12,stay24,昼食)→[walk60、途中に阿修羅の流れ]→雲井の滝(14:36,stay44、余裕を見てバスへ)→[bus30]→御前ヶ浜(15:50,stay45、16:35出発)");
  console.log("\n[奥入瀬渓流館] 座標 40.5746,140.9788 → 40.5745801,140.9787529（OSM node 6161325321）");
  console.log("[石ヶ戸] 座標 40.540613,140.978257 → 40.5404603,140.9789452（OSM node 2417882327）");
  console.log("[雲井の滝] 座標 40.5202,140.9732 → 40.520293,140.973099（OSM node 753051812）");
  console.log("[十和田湖遊覧船→御前ヶ浜] 名前・内容を変更。座標 40.4795,140.9399 → 40.4318323,140.8904687（OSM way 1287876823）");
  console.log("[Day2・十和田神社] 座標 40.433194,140.892222 → 40.4331605,140.892145（OSM way 586654325。時刻は変更なし）");
  console.log("[Day2・乙女の像] 座標 40.4329,140.8897 → 40.4328958,140.8897409（OSM node 5599655373。時刻は変更なし）");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinerary.id }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      day1.id,
      [
        {
          id: RYUUKAN,
          data: { visitTime: t(11, 36), stayDurationMin: 6, memo: RYUUKAN_MEMO_NEW, lat: 40.5745801, lng: 140.9787529 },
        },
        {
          id: ISHIGEDO,
          data: {
            visitTime: t(13, 12),
            stayDurationMin: 24,
            memo: ISHIGEDO_MEMO_NEW,
            lat: 40.5404603,
            lng: 140.9789452,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 90 }] },
          },
        },
        {
          id: KUMOI,
          data: {
            visitTime: t(14, 36),
            stayDurationMin: 44,
            memo: KUMOI_MEMO_NEW,
            lat: 40.520293,
            lng: 140.973099,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 60 }] },
          },
        },
        {
          id: YUURANSEN,
          data: {
            name: YUURANSEN_NAME_NEW,
            visitTime: t(15, 50),
            stayDurationMin: 45,
            memo: YUURANSEN_MEMO_NEW,
            lat: 40.4318323,
            lng: 140.8904687,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 30 }] },
          },
        },
      ],
      { remove: [ASHURA, TAMADARE, SHIRAITO, KUDAN, CHOUSHI, GORYOU, KONOGUCHI], tx }
    );
    await tx.spot.update({ where: { id: TOWADA_JINJA }, data: { lat: 40.4331605, lng: 140.892145 } });
    await tx.spot.update({ where: { id: OTOME }, data: { lat: 40.4328958, lng: 140.8897409 } });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());

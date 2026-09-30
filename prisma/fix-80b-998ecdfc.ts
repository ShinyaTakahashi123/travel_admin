/**
 * #80 998ecdfc（広島城と縮景園、広島藩の歴史と庭園を巡るプラン）ユーザー決定
 * 「全部直す」の対象(現状15:51終了、16:30〜17:00の窓に届かず)。滞在を
 * 延ばさず(決まりA)、二葉の里歴史の散歩道の続きにある実在スポットを追加。
 * 国前寺のあとに尾長天満宮(実在、延喜元年[901]創建伝承・二葉山山麓七福神
 * めぐりの一つ、OSM node 2787766991)、聖光寺(実在、毛利輝元が広島城築城の
 * 地を検分した際に立ち寄ったと伝わる曹洞宗寺院、OSM node 2787766987)を追加。
 * 移動はOSM歩行者ルーティング実測(国前寺→尾長天満宮 282m/4分、
 * 尾長天満宮→聖光寺 576m/8分)。flow-checkの指摘(国前寺の帰りの一言なし)も
 * 併せて解消。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOKUZENJI_MEMO =
  "広島東照宮から歩いておよそ8分、日蓮宗の由緒寺院、国前寺に着きます。暦応3年(1340)に「暁忍寺」として開かれたと伝わる古刹で、明暦2年(1656)、広島藩2代藩主・浅野光晟の正室、満姫の帰依を受けて浅野家の菩提寺となり、現在の寺号に改められました。本堂と庫裏は国の重要文化財に指定されており、江戸時代の寺院建築を今に伝えています。寺宝には、中国の高僧・鳩摩羅什の木像や、怪異譚『稲生物怪録』の主人公・稲生武太夫にまつわる品も伝わり、歴史と伝承の両方にふれられる寺として知られています。参拝の際は、敬意を持ってお参りしましょう。この後は、歩いておよそ4分、尾長天満宮へ向かいましょう。";

const ONAGA_MEMO =
  "国前寺から歩いておよそ4分、尾長天満宮に着きます。延喜元年(901年)、大宰府へ左遷される道中の菅原道真がこの尾長山(二葉山)のふもとに立ち寄ったという伝承に始まる古社です。久寿元年(1154年)には、安芸国守・平清盛が山中で暴風雨に遭った際に道真の加護を祈り、九死に一生を得たことから社殿を創建したと伝わります。鳥居をくぐると立派な隨神門があり、石段を上ると広島の街並みを少し見渡せます。原爆にも耐えた建物の一つとしても知られています。静かに、敬意をもってお参りください。この後は、歩いておよそ8分、聖光寺へ向かいましょう。";

const SEIKOJI_MEMO =
  "尾長天満宮から歩いておよそ8分、聖光寺に着きます。曹洞宗の寺院で、広島城を築いた毛利輝元が、天正17年(1589年)に築城の地を検分した際、この寺に立ち寄ったと伝わります。平成元年(1989年)には、高台に金色の聖観音像が建立されました。広島城から始まったこの日の旅を、築城ゆかりのこの寺で締めくくりましょう。静かに、敬意をもってお参りください。お帰りは、JR広島駅や周辺のバス停をご利用ください。旅はここで終了です。お疲れさまでした。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '998ecdfc%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "984c5ac7-fea5-47a4-abd9-5efb6d22d677", data: {} }, // 広島城
    { id: "1abc4dec-30e6-4d53-b50e-7f236f7dff65", data: {} }, // 縮景園
    { id: "34e6133e-d2f2-46d8-b0af-d26a3c133207", data: {} }, // 広島県立美術館
    { id: "59475c9f-e6a5-444e-b1dc-7dab97e27e89", data: {} }, // 饒津神社
    { id: "7eea8925-2a25-4600-bd2f-8005b4e15cfb", data: {} }, // 広島東照宮
    {
      id: "71bb25ab-adf6-41c7-b012-b6b7c6898af0", // 国前寺
      data: { memo: KOKUZENJI_MEMO },
    },
    {
      create: {
        name: "尾長天満宮",
        address: "広島県広島市東区山根町32-1",
        lat: 34.4043646,
        lng: 132.4800107,
        memo: ONAGA_MEMO,
        visitTime: t(15, 55),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      create: {
        name: "聖光寺",
        address: "広島県広島市東区山根町29-1",
        lat: 34.4027266,
        lng: 132.4831710,
        memo: SEIKOJI_MEMO,
        visitTime: t(16, 28),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "984c5ac7-fea5-47a4-abd9-5efb6d22d677": 50,
    "1abc4dec-30e6-4d53-b50e-7f236f7dff65": 70,
    "34e6133e-d2f2-46d8-b0af-d26a3c133207": 90,
    "59475c9f-e6a5-444e-b1dc-7dab97e27e89": 30,
    "7eea8925-2a25-4600-bd2f-8005b4e15cfb": 45,
    "71bb25ab-adf6-41c7-b012-b6b7c6898af0": 50,
  };
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

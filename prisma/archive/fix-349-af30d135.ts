/**
 * #349(af30d135 鵜戸神宮、崖に埋め込まれた社殿を訪ねる定番日帰りプラン)。
 * もとは鵜戸神宮(09:30)の1か所のみで、終了が10:40と16:30〜17:00の外、
 * 口調も皆様/ご案内/お楽しみくださいのままだった。実在の4か所(青島神社・
 * 堀切峠・道の駅フェニックス・サンメッセ日南)を新規に追加し、5か所・
 * 09:30開始・16:34終了にした。昼食は道の駅フェニックスで(11:30、
 * 11:30〜13:30の範囲内)。宮崎駅前でレンタカーを借りる一言を明記。
 * 説明文の「ご利益で知られる」もご利益の言い方のため外す。
 *
 * 座標はすべてNominatimで確認(2026-10-01)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "5d106f12-8bfb-464f-bfe0-67eafe3df1b2";
const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";
const UDO_ID = "efaee18b-0a25-4c66-9d35-9c5df6ce7a9e";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "青島神社", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const udo = await prisma.spot.findFirstOrThrow({ where: { id: UDO_ID } });
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });

  const udoOld = "波音に包まれながらお参りする、他にはない神社ならではの体験を、静かに、敬意をもってお楽しみください。";
  const udoNext = "波音に包まれながらお参りする、他にはない神社ならではの体験です。今も多くの人が参拝に訪れる祈りの場ですので、静かに、敬意をもってお参りください。日南海岸をめぐる一日は、ここで終わりです。帰りは、車でおよそ1時間の宮崎駅へ向かい、レンタカーを返却してから、帰路につきましょう。";
  if (!udo.memo?.includes(udoOld)) throw new Error("udo anchor not found");

  const descOld = "縁結び・安産のご利益で知られる、日南海岸を代表する定番プランです。";
  const descNext = "縁結び・安産の神社として親しまれる、日南海岸を代表する定番プランです。";
  if (!itin.description?.includes(descOld)) throw new Error("description anchor not found");
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(descOld, descNext) } });
  console.log("description: 御利益 wording softened");

  await setDaySpotOrder(DAY1_ID, [
    {
      create: {
        name: "青島神社",
        address: "宮崎市青島2-13-1",
        lat: 31.8044125,
        lng: 131.4750916,
        visitTime: t(9, 30),
        stayDurationMin: 75,
        memo:
          "日南海岸をめぐる旅は、青島神社からスタートです。宮崎駅前でレンタカーを借り、車でおよそ25分の道のりです。青島は、周囲およそ1.5kmの小島で、島全体が青島神社の境内となっており、ビロウ樹をはじめとする熱帯・亜熱帯植物の群生地として、国の特別天然記念物に指定されています。御祭神は、海神の娘・豊玉姫命の妹とされる彦火火出見尊の后・豊玉姫命(山幸彦の后)で、縁結びの神社として親しまれています。境内の夫婦ビロウには、願いごとによって色の異なる紙縒(こより)を結ぶことができます。南国情緒あふれる島内を歩き、海に囲まれた神社ならではの雰囲気を味わいましょう。見学を終えたら、車でおよそ9分の堀切峠へ向かいましょう。",
      },
    },
    {
      create: {
        name: "堀切峠",
        address: "宮崎市内海",
        lat: 31.7768245,
        lng: 131.4821614,
        visitTime: t(10, 54),
        stayDurationMin: 33,
        transitMode: "car",
        transitDurationMin: 9,
        memo:
          "青島神社からは、車でおよそ9分です。堀切峠は、日南海岸沿いの国道にある峠で、太平洋の広がりと、波の侵食によってできた波状岩「鬼の洗濯板」を一望できる、日南海岸ドライブ随一とされる展望スポットです。フェニックスの並木が南国らしい雰囲気を添え、天気のよい日には、はるか沖合まで見渡せます。海沿いの爽快な景色を、しばし眺めてみましょう。続いては、車でおよそ3分の道の駅フェニックスへ向かいましょう。",
      },
    },
    {
      create: {
        name: "道の駅フェニックス",
        address: "宮崎市内海乙3089",
        lat: 31.7688886,
        lng: 131.478289,
        visitTime: t(11, 30),
        stayDurationMin: 90,
        transitMode: "car",
        transitDurationMin: 3,
        memo:
          "堀切峠からは、車でおよそ3分です。道の駅フェニックスは、日南海岸を望む高台にある道の駅で、宮崎の特産品や海産物を扱う売店と、地元の食材を使った食事処が並んでいます。ここで昼食をとるとよいでしょう。展望デッキからは、堀切峠と同じく鬼の洗濯板と太平洋の景色を眺めることができ、フェニックスの木々に南国らしさを感じられます。お土産探しとランチを楽しみながら、ひと休みしましょう。見学を終えたら、車でおよそ21分のサンメッセ日南へ向かいましょう。",
      },
    },
    {
      create: {
        name: "サンメッセ日南",
        address: "日南市宮浦2650",
        lat: 31.6632784,
        lng: 131.4609574,
        visitTime: t(13, 21),
        stayDurationMin: 80,
        transitMode: "car",
        transitDurationMin: 21,
        memo:
          "道の駅フェニックスからは、車でおよそ21分です。サンメッセ日南は、太平洋を望む丘の上に、7体のモアイ像が並ぶテーマパークです。これらのモアイ像は、イースター島の長老会から特別な許可を得て復刻された、世界で唯一のモアイ像とされています。日本の修復チームが、倒れていたイースター島の本物のモアイ像の修復に協力したことが、復刻を許された由来と伝えられています。丘の上からは、日南海岸の雄大な海景色を一望できます。モアイ像と海の絶景が織りなす、南国ムード満点の風景を楽しみましょう。続いては、車でおよそ8分の鵜戸神宮へ向かいましょう。",
      },
    },
    {
      id: udo.id,
      data: { visitTime: t(14, 49), stayDurationMin: 105, transitMode: "car", transitDurationMin: 8, memo: udo.memo.replace(udoOld, udoNext) },
    },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

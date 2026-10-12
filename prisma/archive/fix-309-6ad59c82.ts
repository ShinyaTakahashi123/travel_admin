/**
 * チェックリスト #309 の修正記録(ふだんの見直し)。
 * しおり「エンジェルロード、潮が引くと現れる砂の道を歩くプラン」
 * (6ad59c82-04f7-40ae-87ff-959dc70801cc)
 *
 * 本番で1か所・09:30〜10:30のみで、決まり(1日4か所以上・終了16:30〜
 * 17:00)に届いていないことが判明。小豆島の実在の観光地5件を追加した。
 * ガイド口調も地の文に統一。
 *
 * 1. 土渕海峡(way 251018998): 1996年、世界一狭い海峡としてギネス認定。
 *    出典(直接開いたURL): https://shodoshima.or.jp/sightseeing/detail.php?id=217
 *    (小豆島観光協会公式)
 * 2. 中山千枚田(node 5537594822): 平成11年(1999)、日本の棚田百選に選定。
 *    出典: https://www.town.shodoshima.lg.jp/kanko/miru/nature/sennmaida.html
 *    (小豆島町公式)
 * 3. 小豆島オリーブ公園(道の駅、way 690263357の周辺一帯): 日本のオリーブ
 *    栽培発祥の地、ギリシャ・ミロス島との友好の証のギリシャ風車。
 *    出典: 複数の観光サイトで裏取り(オリーブ発祥・ギリシャ風車の由来)。
 * 4. 二十四の瞳映画村(way 426547200): 映画「二十四の瞳」のオープンセット
 *    を活用した施設。
 *    出典(直接開いたURL): https://www.24hitomi.or.jp/sp/eigamura/
 *    (二十四の瞳映画村公式)
 * 5. 岬の分教場(苗羽小学校田浦分校、node 704279829): 明治35年(1902)築、
 *    実際に使われていた分校で、昭和29年(1954)版映画「二十四の瞳」の
 *    ロケに使われた実物の校舎。
 *    出典: https://shodoshima.or.jp/sightseeing/detail.php?id=247
 *    (小豆島観光協会公式)
 *
 * 座標はNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-309-6ad59c82.ts
 * (実行済み。土渕海峡の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6ad59c82-04f7-40ae-87ff-959dc70801cc";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "土渕海峡")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const angel = spots.find((s) => s.name === "エンジェルロード")!;

  await updateSpotInItinerary(ITIN_ID, { spotId: angel.id }, {
    memo:
      "1日に2回、干潮の時間帯にだけ姿を現す砂の道で、対岸の弁天島をはじめとする小島と、小豆島本島とを結んでいます。満ち引きによって陸と島の間の海が割れ、道が現れては消えていくこの不思議な自然現象は「トンボロ現象」と呼ばれています。大切な人と手をつないで渡ると願いが叶うと言い伝えられ、多くのカップルや旅行者に親しまれています。弁天島には「約束の丘展望台」もあり、エンジェルロードを一望しながら、鐘を鳴らすこともできます。道が現れる時間は日によって異なるため、事前に潮見表で確かめておでかけください。潮が満ちはじめる前に、早めに戻りましょう。潮が満ちては引く、自然が生み出す神秘的な光景を、ゆっくりと楽しみましょう。",
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: angel.id, data: {} },
        {
          create: {
            name: "土渕海峡",
            address: "香川県小豆郡土庄町淵崎甲",
            lat: 34.485942,
            lng: 134.1868966,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 45)),
            stayDurationMin: 25,
            transitMode: "walk",
            transitDurationMin: 15,
            memo:
              "エンジェルロードからは徒歩15分ほどです。土渕海峡は、土庄町の前島と本島の間を流れる、全長およそ2.5kmの海峡です。狭いところでは幅およそ9.93mしかなく、平成8年(1996)、幅の狭さでギネス世界記録に認定されています。海峡には3つの橋が架かっており、中でも特に狭い地点に架かる「永代橋」を渡ると、海峡制覇を体験できます。土庄町役場では、記念に横断証明書を発行しています。",
          },
        },
        {
          create: {
            name: "中山千枚田",
            address: "香川県小豆郡小豆島町中山",
            lat: 34.5041931,
            lng: 134.2394248,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 25)),
            stayDurationMin: 25,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "土渕海峡からは車で15分ほどです。中山千枚田は、小豆島の中央部、標高およそ150〜250mの斜面に、南北朝時代から江戸時代中期にかけて開墾されたと伝わる、およそ800枚の棚田です。平成11年(1999)、香川県内で唯一「日本の棚田百選」に選ばれました。湯船山から湧き出る、名水百選の一つ「湯船の湧水」で稲が育てられています。石垣を積み重ねた棚田が幾重にも連なる、小豆島ならではの里山風景を眺めましょう。",
          },
        },
        {
          create: {
            name: "小豆島オリーブ公園",
            address: "香川県小豆郡小豆島町西村甲1941-1",
            lat: 34.4728503,
            lng: 134.2737026,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 5)),
            stayDurationMin: 110,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "中山千枚田からは車で15分ほどです。小豆島オリーブ公園は、瀬戸内海を望む丘に広がる、日本のオリーブ栽培発祥の地に開かれた公園です。シンボルの白いギリシャ風車は、小豆島と姉妹島提携を結ぶギリシャ・ミロス島との友好の証として、平成4年に建てられました。エーゲ海を思わせる瀬戸内海の青とのコントラストが美しく、人気の撮影スポットになっています。園内には、オリーブ製品を扱う土産物店や、食事処もあるので、ここで昼食をとりましょう。オリーブ畑を散策しながら、島の特産品の歴史にふれてみましょう。",
          },
        },
        {
          create: {
            name: "二十四の瞳映画村",
            address: "香川県小豆郡小豆島町田浦甲931",
            lat: 34.4454611,
            lng: 134.2855521,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 5)),
            stayDurationMin: 90,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "小豆島オリーブ公園からは車で10分ほどです。二十四の瞳映画村は、小豆島出身の作家・壺井栄の小説「二十四の瞳」を原作とした映画のオープンセットを活用した施設です。大正から昭和初期の風情を再現した木造校舎や漁師の家、茶屋などの建物が立ち並び、壺井栄文学館では作家ゆかりの品々を、松竹座映画館では「二十四の瞳」の上映を見ることができます。瀬戸内海を見渡す海岸沿いで、懐かしい時代の雰囲気を味わいましょう。",
          },
        },
        {
          create: {
            name: "岬の分教場(苗羽小学校田浦分校)",
            address: "香川県小豆郡小豆島町田浦甲1360",
            lat: 34.4522676,
            lng: 134.2861096,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 47)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 12,
            memo:
              "二十四の瞳映画村からは徒歩12分ほどです。岬の分教場は、明治35年(1902)に建てられた、苗羽小学校田浦分校の旧校舎です。昭和46年(1971)まで、およそ70年にわたって実際に使われていた分校で、昭和29年(1954)版の映画「二十四の瞳」のロケでは、この本物の校舎が使われました。木の机や椅子、オルガンなど、当時のままの教室の様子が今に伝えられています。実際に子どもたちが学んでいた、素朴な木造校舎の姿をじっくりと見学しましょう。見学を終えたら、車で土庄港・高松方面へ戻りましょう。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "1日2回、干潮時にだけ現れる砂の道「エンジェルロード」。寒霞渓とは違う、小豆島ならではの神秘的な絶景を楽しむプランです。世界一狭い土渕海峡、日本の棚田百選・中山千枚田、小豆島オリーブ公園、二十四の瞳映画村と実在の岬の分教場まで、小豆島の定番と穴場を一日で巡ります。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

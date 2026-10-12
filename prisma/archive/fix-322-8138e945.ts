/**
 * #322 世界遺産・百舌鳥古墳群と刃物の街、堺の歴史を巡る日帰りプラン
 * (8138e945)。チェックリスト: 5か所09:00〜14:05で終了(窓外)。
 *
 * 実在スポット2つを追加(履中天皇陵古墳・妙国寺)し、既存の不具合も
 * まとめて修正した:
 * - 堺伝統産業会館の住所・座標が、さかい利晶の杜のものを誤って流用した
 *   コピペミスだった(どちらも「堺市堺区宿院町西2丁1-1」になっていた)。
 *   正しい住所(堺市堺区材木町西一丁1-30、出典: city.sakai.lg.jp・
 *   sakaidensan.jp公式)に修正
 * - 堺市博物館→南宗寺の区間が「車でおよそ5分」(誤った座標のため実際は
 *   もっと近い誤表示)になっていたのを含め、4か所で時刻の計算が合って
 *   いなかった(itinerary-audit検出)。全区間を座標から再計算
 * - 「車と公共交通が混在」(決まり8): さかい利晶の杜→堺伝統産業会館の
 *   車移動を、実際の距離(約1km)から徒歩に変更し、車をなくした
 * - 仁徳天皇陵古墳の「日本最大の古墳」「国内最大規模」に決まり9のヘッジを追加
 * - 堺市博物館の「2026年4月にリニューアルオープンしたばかりで」(先の
 *   予定・日程の記載に類する言い方)を、具体的な年を出さない表現に修正
 * - 昼食の一言・帰りの一言を追加
 *
 * 座標の出典:
 * - 履中天皇陵古墳: Nominatim名称一致(南側拝所付近)。node 10186268708,
 *   34.5561961,135.4788721
 * - 妙国寺: Nominatim名称一致。way 257246073, 34.5811682,135.4814384
 * - 堺伝統産業会館(堺伝匠館): GSI住所検索の完全番地(材木町西一丁1-30、
 *   公式住所と一致。近くの「堺伝匠館前」バス停/駐輪場のOverpass名称一致
 *   ノードともほぼ同じ座標でクロスチェック済み)。34.582767,135.477448
 *
 * 事実確認:
 * - 履中天皇陵古墳: 墳丘長365m、日本で3番目の規模、百舌鳥古墳群南部
 *   (city.sakai.lg.jp・sakai-tcb.or.jp公式)
 * - 妙国寺: 樹齢1100年ともいわれる大蘇鉄(国指定天然記念物)、本能寺の変の
 *   当日に徳川家康が堺見物中にこの寺に滞在していたと伝わる、幕末の堺事件の
 *   舞台(sakai-tcb.or.jp・city.sakai.lg.jp公式)。堺事件では「命を落とした」
 *   という言い方にとどめ、亡くなり方(切腹)は書かない
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-322-8138e945.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8138e945-07a7-491e-8239-3422405ebb78";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const nintoku = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "仁徳天皇陵古墳（大仙古墳）" } });
  const hakubutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "堺市博物館" } });
  const nanshuji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "南宗寺" } });
  const rishonomori = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "さかい利晶の杜" } });
  const denshokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "堺伝統産業会館" } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "妙国寺" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const nintokuMemo = (nintoku.memo ?? "")
    .replace("まず訪れるのは、日本最大の古墳、仁徳天皇陵古墳です。", "まず訪れるのは、日本最大とされる古墳、仁徳天皇陵古墳です。")
    .replace("墳丘の全長は約486mで国内最大規模。", "墳丘の全長は約486mで国内最大規模とされています。");

  const hakubutsukanMemo = (hakubutsukan.memo ?? "").replace(
    "2026年4月にリニューアルオープンしたばかりで、古代の常設展示が一新されたほか、",
    "近年リニューアルされ、古代の常設展示が一新されたほか、"
  );

  const rishonomoriMemo = (rishonomori.memo ?? "").replace(
    "南宗寺から歩いてすぐ、次にご案内するのは「さかい利晶の杜」です。",
    "南宗寺から歩いてすぐです。到着したら、まずこのあたりで昼食をとりましょう。「さかい利晶の杜」は、"
  );

  const denshokanMemo = (denshokan.memo ?? "")
    .replace(
      "この日の締めくくりは、堺伝統産業会館です。",
      "さかい利晶の杜からは歩いておよそ13分です。堺伝統産業会館(堺伝匠館)は、"
    )
    .replace(
      "今日一日、古墳の時代から茶の湯の文化、そして伝統産業まで、堺の奥深い歴史をたっぷり巡ってきました。",
      "続いては、歩いておよそ5分の妙国寺へ向かいましょう。"
    );

  await setDaySpotOrder(day1.id, [
    { id: nintoku.id, data: { memo: nintokuMemo, stayDurationMin: 50 } },
    {
      id: hakubutsukan.id,
      data: {
        memo: hakubutsukanMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 2)),
        stayDurationMin: 60,
      },
    },
    {
      create: {
        name: "履中天皇陵古墳",
        address: "堺市西区北条町",
        lat: 34.5561961,
        lng: 135.4788721,
        visitTime: new Date(Date.UTC(1970, 0, 1, 11, 10)),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 8,
        memo:
          "堺市博物館からは歩いておよそ8分です。履中天皇陵古墳(ミサンザイ古墳)は、百舌鳥古墳群南部にある前方後円墳で、墳丘長およそ365m、日本で3番目の規模とされる大きさを誇ります。仁徳天皇陵古墳とあわせて、百舌鳥古墳群を代表する巨大古墳の一つです。南側の拝所のほか、東側の濠沿いの周遊路からも、その規模を実感できます。静かに、周濠沿いの散策を楽しみましょう。続いては、バスでおよそ20分の南宗寺へ向かいましょう。",
      },
    },
    {
      id: nanshuji.id,
      data: {
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 5)),
        stayDurationMin: 50,
        transitMode: "bus",
        transitDurationMin: 20,
      },
    },
    {
      id: rishonomori.id,
      data: { memo: rishonomoriMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 5)), stayDurationMin: 60 },
    },
    {
      id: denshokan.id,
      data: {
        memo: denshokanMemo,
        address: "堺市堺区材木町西一丁1-30",
        lat: 34.582767,
        lng: 135.477448,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 18)),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 13,
      },
    },
    {
      create: {
        name: "妙国寺",
        address: "堺市堺区材木町東4丁1-4",
        lat: 34.5811682,
        lng: 135.4814384,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 18)),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "堺伝統産業会館からは歩いておよそ5分です。妙国寺は、永禄5年(1562)、日蓮宗の日珖上人が開いた寺院です。境内には、樹齢1100年ともいわれる大蘇鉄(国指定天然記念物)があり、織田信長がこの木を安土城に移させたところ、夜な夜な堺へ帰りたいと泣いたという言い伝えが残っています。天正10年(1582)、本能寺の変が起きた当日、徳川家康は堺見物の途上でこの寺に滞在していたとも伝えられています。幕末には、土佐藩士たちがこの地で命を落とした「堺事件」の舞台としても知られています。古墳の時代から茶の湯の文化、伝統産業、そして幕末まで、堺の奥深い歴史をたどる一日の締めくくりに、静かに境内を眺めてみましょう。見学を終えたら、阪堺線「妙国寺前」駅か、南海本線「堺」駅まで歩きましょう(いずれも徒歩10分程度)。",
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["履中天皇陵古墳", "walk", 8],
    ["南宗寺", "bus", 20],
    ["さかい利晶の杜", "walk", 10],
    ["堺伝統産業会館", "walk", 13],
    ["妙国寺", "walk", 5],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

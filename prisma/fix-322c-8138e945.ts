/**
 * #322の続き。企画運営2026-10-01 00:09の3点。
 * 1) 妙国寺の75分は長すぎた。拝観時間を確かめたところ10:00〜16:30(最終
 *    受付の明記はないが拝観終了時刻そのものが16:30、出典: 各観光サイト)
 *    だったため、40分に短縮し、拝観時間に間に合うよう順番の前の方に移動。
 *    空いた時間は、企画運営の提案どおり山口家住宅(江戸初期の町家、国重要
 *    文化財)・清学院(修験道の寺院、寺子屋の歴史、河口慧海ゆかり)を追加。
 *    どちらも最終入館16:30(city.sakai.lg.jp公式)のため、この2つも16:30
 *    より前に訪問が終わるよう並べ、最終入館の制約がない堺伝統産業会館
 *    (10:00〜17:00、最終入館の記載なし)を最後に回した。
 * 2) 堺市博物館の締めの一文が「南宗寺へ向かいましょう」のままで、実際の
 *    次のスポット(履中天皇陵古墳)と食い違っていた。南宗寺の書き出しにも、
 *    履中天皇陵古墳からのバスの行き方がなかったため、あわせて直した。
 * 3) 話し言葉「実は」「ご注意ください」「まず訪れるのは」「続いて訪れるのは」
 *    を、ふつうの書き方に直した。
 *
 * 座標の出典: 山口家住宅、Nominatim名称一致。node 5712619222,
 * 34.5866572,135.4825197。清学院、Nominatim名称一致。way 1486473278,
 * 34.5911346,135.4828234
 * 事実確認: 妙国寺 拝観10:00〜16:30(各観光サイトで確認)。山口家住宅
 * 10:00〜17:00・最終入館16:30、国重要文化財(city.sakai.lg.jp公式)。
 * 清学院 10:00〜17:00・最終入館16:30、登録有形文化財、寺子屋「清光堂」の
 * 歴史、河口慧海ゆかり(city.sakai.lg.jp公式)。堺伝匠館 10:00〜17:00
 * (sakaidensan.jp公式)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-322c-8138e945.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "8138e945-07a7-491e-8239-3422405ebb78";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "山口家住宅" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const nintoku = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "仁徳天皇陵古墳（大仙古墳）" } });
  const hakubutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "堺市博物館" } });
  const richu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "履中天皇陵古墳" } });
  const nanshuji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "南宗寺" } });
  const rishonomori = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "さかい利晶の杜" } });
  const myokokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "妙国寺" } });
  const denshokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "堺伝統産業会館" } });

  const nintokuMemo = (nintoku.memo ?? "")
    .replace("実は学術的には被葬者は確定していません。", "学術的には被葬者は確定していません。")
    .replace(
      "まず訪れるのは、日本最大とされる古墳、仁徳天皇陵古墳です。",
      "仁徳天皇陵古墳は、日本最大とされる古墳です。"
    );

  const hakubutsukanMemo = (hakubutsukan.memo ?? "").replace(
    "展示をじっくり見たあとは、少し街なかへ足を延ばし、千利休ゆかりの禅寺、南宗寺へ向かいましょう。",
    "展示をじっくり見たあとは、続いて履中天皇陵古墳へ向かいましょう。"
  );

  const nanshujiMemo = (nanshuji.memo ?? "")
    .replace(
      "続いて訪れるのは、戦国武将・三好長慶ゆかりの禅寺、南宗寺です。",
      "履中天皇陵古墳からはバスでおよそ20分です。南宗寺は、戦国武将・三好長慶ゆかりの禅寺です。"
    )
    .replace("この寺には、実は面白い言い伝えが残っています。", "この寺には、面白い言い伝えが残っています。");

  const rishonomoriMemo = (rishonomori.memo ?? "").replace(
    "ここにあるのはあくまで再現・復元であり、国宝そのものではありませんのでご注意ください。",
    "ここにあるのはあくまで再現・復元であり、国宝そのものではありません。"
  );

  const myokokujiMemo =
    "さかい利晶の杜からは歩いておよそ15分です。妙国寺は、永禄5年(1562)、日蓮宗の日珖上人が開いた寺院です。境内には、樹齢1100年ともいわれる大蘇鉄(国指定天然記念物)があり、織田信長がこの木を安土城に移させたところ、夜な夜な堺へ帰りたいと泣いたという言い伝えが残っています。天正10年(1582)、本能寺の変が起きた当日、徳川家康は堺見物の途上でこの寺に滞在していたとも伝えられています。幕末には、土佐藩士たちがこの地で命を落とした「堺事件」の舞台としても知られています。静かに、敬意をもって境内を眺めてみましょう。続いては、歩いておよそ8分の山口家住宅へ向かいましょう。";

  const denshokanMemo =
    "清学院からは歩いておよそ13分です。堺伝統産業会館(堺伝匠館)は、堺打刃物をはじめ、浪華本染め、堺線香、堺手織緞通、堺五月鯉幟、昆布加工品など、堺に伝わるさまざまな伝統産業品を、見て・買って・体験できる施設になっています。なかでも主役といえるのが堺打刃物です。プロの料理人が使う包丁として国内シェアの約9割を占めるといわれ、その確かな技術は1982年に経済産業大臣指定の伝統的工芸品にも認定されました。職人が丁寧に仕上げた一本一本の刃物を間近で見ると、堺という街が古くから「ものづくりの町」として発展してきたことが実感できるはずです。刃物のほかにも線香や染物など、堺ならではのお土産探しにもぴったりの場所です。古墳の時代から茶の湯の文化、町家の暮らし、そして伝統産業まで、堺の奥深い歴史をたどる一日の締めくくりに、じっくりと見て回りましょう。見学を終えたら、阪堺線「妙国寺前」駅か、南海本線「堺」駅まで歩きましょう(いずれも徒歩10分程度)。";

  await setDaySpotOrder(day1.id, [
    { id: nintoku.id, data: { memo: nintokuMemo } },
    { id: hakubutsukan.id, data: { memo: hakubutsukanMemo } },
    { id: richu.id, data: {} },
    { id: nanshuji.id, data: { memo: nanshujiMemo } },
    {
      id: rishonomori.id,
      data: { memo: rishonomoriMemo, stayDurationMin: 55 },
    },
    {
      id: myokokuji.id,
      data: {
        memo: myokokujiMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 15)),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 15,
      },
    },
    {
      create: {
        name: "山口家住宅",
        address: "堺市堺区錦之町東1丁2-31",
        lat: 34.5866572,
        lng: 135.4825197,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 3)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 8,
        memo:
          "妙国寺からは歩いておよそ8分です。堺市立町家歴史館 山口家住宅は、江戸時代初期に建てられ、昭和41年(1966)に国の重要文化財に指定された町家です。当時の堺商人の暮らしぶりを伝える、貴重な建築として公開されています。続いては、歩いておよそ7分の清学院へ向かいましょう。",
      },
    },
    {
      create: {
        name: "清学院",
        address: "堺市堺区北旅籠町西1丁3-13",
        lat: 34.5911346,
        lng: 135.4828234,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 7,
        memo:
          "山口家住宅からは歩いておよそ7分です。堺市立町家歴史館 清学院は、江戸時代後期に修験道の寺院として建てられ、幕末から明治にかけては「清光堂」という寺子屋として、地域の子どもたちに読み書きを教えていました。初めてヒマラヤを越えチベットに入った日本人として知られる、河口慧海もこの寺子屋で学んだと伝えられています。堺の教育の歴史に思いを馳せてみましょう。続いては、歩いておよそ13分の堺伝統産業会館へ向かいましょう。",
      },
    },
    {
      id: denshokan.id,
      data: {
        memo: denshokanMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 16, 23)),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 13,
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["妙国寺", "walk", 15],
    ["山口家住宅", "walk", 8],
    ["清学院", "walk", 7],
    ["堺伝統産業会館", "walk", 13],
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

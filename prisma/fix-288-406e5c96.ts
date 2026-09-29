/**
 * チェックリスト #288（docs/content/20260929-itinerary-4spots-9to16-checklist.md）対応。
 * しおり「グリコサインとたこ焼き、道頓堀を食べ歩く日帰りプラン」(406e5c96-ffef-4536-a312-0204de681b97)
 *
 * このしおりに対応するhandmade-gen形式のseedファイルが見当たらなかった(batch2などの
 * 旧い方式で作成されたとみられる)ため、DBを直接更新した記録としてこのスクリプトを残す。
 *
 * 内容: 既存5か所(新世界→通天閣→でんでんタウン→黒門市場→法善寺横丁、09:00〜15:05)は
 * 口調・内容ともサイト標準で良質だったが、決まり2(終了16:30〜17:00)未達。加えて、
 * タイトルの「グリコサインとたこ焼き」「道頓堀を食べ歩く」に対応するスポットが1つも
 * なかったため、法善寺横丁のあとに道頓堀(新規)を追加した。6か所、09:00〜16:40に到達。
 *
 * 出典: 道頓堀の開削・命名 https://ja.wikipedia.org/wiki/道頓堀 、
 * グリコサインの設置年・代数(昭和10年[1935]初代・現在6代目) 江崎グリコ公式
 * https://www.glico.com/jp/health/contents/glicosign/ (WebFetchで開いて確認済み、
 * 「1935年に建造」「2014年10月に6代目として設置」の記載と一致)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-288-406e5c96.ts
 * (実行済み。再実行しても道頓堀スポットが重複作成されるため、再実行しないこと)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const V = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY_ID = "c41a6ce8-390d-4c6f-baf2-ba6bd904b804";

async function main() {
  const current = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY_ID,
      [
        ...current.map((s) => ({ id: s.id, data: {} })),
        {
          create: {
            name: "道頓堀",
            address: "大阪市中央区道頓堀1丁目",
            lat: 34.668926,
            lng: 135.5010546,
            visitTime: V(15, 10),
            stayDurationMin: 90,
            memo: "法善寺横丁からは歩いてすぐです。道頓堀は、江戸時代初期の慶長17年(1612)に開削が始まり、元和元年(1615)に完成した運河です。開削に尽力した安井道頓の功績をたたえて、この名がついたと伝えられています。芝居小屋が並ぶ娯楽の町として栄えた歴史を持ち、今も飲食店やネオン看板が軒を連ねる大阪随一の繁華街です。中でも道頓堀のシンボルといえるのが、道頓堀グリコサインです。昭和10年(1935)に初代の看板が設置されて以来、幾度かのリニューアルを経て、現在の看板は6代目にあたります。両手を広げて走るランナーの姿は、大阪観光の記念写真の定番となっています。たこ焼きなど大阪らしい食べ歩きグルメも楽しみながら、旅の締めくくりに道頓堀の賑わいを味わいましょう。",
          },
        },
      ],
      { tx }
    );
    const spots = await tx.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
    const last = spots[spots.length - 1];
    await tx.spotTransitLeg.deleteMany({ where: { spotId: last.id } });
    await tx.spotTransitLeg.create({ data: { spotId: last.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });
    await tx.spot.update({ where: { id: last.id }, data: { transitMode: "walk", transitDurationMin: 5 } });
  }, { timeout: 60000 });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

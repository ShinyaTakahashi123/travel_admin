/**
 * #370の続き。企画運営の指摘2点に対応。
 *
 * 1. 薩摩伝承館: 宿の名前(指宿白水館)を外す件、法務の判断にそろえる
 *    (企画運営から法務へ指示を統一)。「指宿白水館の敷地内に建つ」→
 *    「錦江湾に面した敷地に建つ」に修正。
 * 2. 殿様湯: 出典(tabi-mag.jp/kg0030/)を読み直すと、家紋入りの石造りの
 *    湯船は「浴場の跡」として残る見るものであり、実際に入浴できる施設は
 *    公衆浴場「二月田温泉 殿様湯」であるため、見るものと入浴する場所を
 *    書き分けた。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-370e-d0407258.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "a602dd91-f920-439a-8ccb-2e187f19a5a2";

async function main() {
  const denshokan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "薩摩伝承館" } });
  const tonosama = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "殿様湯" } });

  const denOld = "指宿白水館の敷地内に建つ美術館で、";
  const denNew = "錦江湾に面した敷地に建つ美術館で、";

  const tonoOld =
    "天保2年(1831)、薩摩藩10代藩主・島津斉興が、長井温泉から湯治用の別邸をこの地に移したことに由来する温泉で、丸に十の字の島津家の家紋が入った石造りの湯船に浸かることができます。源泉かけ流しの、歴史ある共同浴場でひとときを過ごしましょう。";
  const tonoNew =
    "天保2年(1831)、薩摩藩10代藩主・島津斉興が、長井温泉から湯治用の別邸をこの地に移したことに由来する温泉です。公衆浴場の脇には当時の浴場の跡が残り、丸に十の字の島津家の家紋が入った石造りの湯船を見ることができます。源泉かけ流しの、歴史ある公衆浴場「二月田温泉 殿様湯」で、ひとときを過ごしましょう。";

  if (!denshokan.memo?.includes(denOld) && !tonosama.memo?.includes(tonoOld)) {
    console.log("already applied, skipping");
    return;
  }

  if (denshokan.memo?.includes(denOld)) {
    await prisma.spot.update({ where: { id: denshokan.id }, data: { memo: denshokan.memo.replace(denOld, denNew) } });
  }
  if (tonosama.memo?.includes(tonoOld)) {
    await prisma.spot.update({ where: { id: tonosama.id }, data: { memo: tonosama.memo.replace(tonoOld, tonoNew) } });
  }

  console.log("#370続き: 薩摩伝承館の宿名を外し、殿様湯の家紋の湯船を見るものとして書き分けた");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

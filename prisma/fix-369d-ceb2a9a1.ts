/**
 * #369の続き。企画運営の指摘3点に対応。
 *
 * 1. 白米千枚田の結びが旧文のまま「車で輪島キリコ会館へ向かいましょう」
 *    だったのを「輪島塗会館」に修正。
 * 2. 輪島塗会館の座標(37.3942,136.9001)は、建物way(572514616)の一部の
 *    ノードから概算した丸めた値だったため、#356で使用しているのと同じ
 *    実点(37.394086,136.900154)にそろえた。
 * 3. 總持寺祖院の重要文化財指定(2024年10月・16棟)の出典: 文化庁の報道発表
 *    https://www.bunka.go.jp/koho_hodo_oshirase/hodohappyo/94122701.html
 *    (令和6年10月18日、文化審議会が「總持寺祖院 16棟 石川県輪島市」を
 *    重要文化財に指定するよう答申したと記載。本文の内容と一致)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-369d-ceb2a9a1.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "c3e04cfa-0484-4fae-b8cd-27ae788efaff";

async function main() {
  const senmaida = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白米千枚田" } });
  const wajimanuri = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "輪島塗会館" } });

  const closingOld = "見学を終えたら、車で輪島キリコ会館へ向かいましょう。";
  const closingNew = "見学を終えたら、車で輪島塗会館へ向かいましょう。";

  if (!senmaida.memo?.includes(closingOld) && wajimanuri.lat?.toString() === "37.394086") {
    console.log("already applied, skipping");
    return;
  }

  if (senmaida.memo?.includes(closingOld)) {
    await prisma.spot.update({
      where: { id: senmaida.id },
      data: { memo: senmaida.memo.replace(closingOld, closingNew) },
    });
  }

  await prisma.spot.update({
    where: { id: wajimanuri.id },
    data: { lat: 37.394086, lng: 136.900154 },
  });

  console.log("#369続き: 白米千枚田の結びを修正、輪島塗会館の座標を#356と同じ実点にそろえた");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #25(a54e45e0)の直し(企画運営承認、2026-10-13)。新しい行き先を足す代わりに、
 * 大塚古墳(77分)を45分に短縮し、高良大社(45→65分、竹林・展望はメモにすでに
 * あり)と田主丸駅とかっぱの町並み(35→47分)に分けて加える。
 * あわせて、田主丸駅の「平成4年(1992)、河童をかたどった駅舎に建て替え」は
 * 公式(久留米市・JR九州)での確認ができなかったため、年・経緯を外し
 * 「河童をかたどった駅舎です」程度に書きかえる。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const KORA_ID = "2a255442-adaa-40be-9a64-b591c2272a8c";
const TANUSHIMARU_ID = "4d412ea4-9ec9-4b5d-aee4-9815d2f64363";
const KYOHO_ID = "a857e6a8-ada1-4e01-a682-c12626cbff9a";

const TANUSHIMARU_MEMO_NEW =
  "筑後川はたびたび洪水を起こしてきたことから、この流域には古くから河童(かっぱ)にまつわる言い伝えが数多く残っており、田主丸はその中心地の一つとされています。JR久大本線の田主丸駅は、河童をかたどった駅舎です。駅前や町なかには河童の像やモニュメントが点在し、散策しながら河童伝説の雰囲気を楽しめます。";

async function main() {
  const kora = await prisma.spot.findUnique({ where: { id: KORA_ID } });
  const tanushimaru = await prisma.spot.findUnique({ where: { id: TANUSHIMARU_ID } });
  const kyoho = await prisma.spot.findUnique({ where: { id: KYOHO_ID } });
  if (!kora || !tanushimaru || !kyoho) throw new Error("想定と違います");

  console.log("[確認OK] 高良大社の滞在:", kora.stayDurationMin, "→ 65分");
  console.log("[確認OK] 田主丸駅とかっぱの町並みの滞在:", tanushimaru.stayDurationMin, "→ 47分、memoから1992年の記述を削除");
  console.log("[確認OK] 大塚古墳の滞在:", kyoho.stayDurationMin, "→ 45分");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: KORA_ID }, data: { stayDurationMin: 65 } });
  await prisma.spot.update({
    where: { id: TANUSHIMARU_ID },
    data: { stayDurationMin: 47, memo: TANUSHIMARU_MEMO_NEW, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 53)) },
  });
  await prisma.spot.update({
    where: { id: KYOHO_ID },
    data: { stayDurationMin: 45, visitTime: new Date(Date.UTC(1970, 0, 1, 15, 45)) },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

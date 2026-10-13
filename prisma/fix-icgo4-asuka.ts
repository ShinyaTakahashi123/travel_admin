/**
 * いちご狩り#4(明日香, 14a5c98b)の直し(法務指摘、2026-10-13)。
 * 1. 石舞台古墳「国内最大級の規模を誇ります」→「国内最大級とされます」(言い切りをぼかす)
 * 2. 甘樫丘: 出どころ不明だった座標を、OSMの「甘樫丘展望台」(node 806503545、
 *    tourism=viewpoint、34.4810201,135.81758)に修正。メモが「展望台からは…」と
 *    述べているため、展望台そのものの点を使う
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ISHIBUTAI_ID = "c7270a6b-33a1-4af8-bf7b-6169396e5dbb";
const AMAKASHI_ID = "cdffa705-95df-4b7d-958f-e0f6c2233752";

const ISHIBUTAI_MEMO_NEW =
  "6世紀末から7世紀初めごろに築かれたとされる、一辺約50mの方墳です。盛られていた土が失われ、30数個の巨石を積んだ横穴式石室が露出した姿で残っており、天井石は約77トンと推定されるこの石室は、国内最大級とされます。蘇我馬子の墓とする説が有力で、平らな天井石の上面が舞台のように見えることから「石舞台」の名がついたと伝わります。国の特別史跡に指定されており、国営飛鳥歴史公園の一角として整備されています。";

const AMAKASHI_LAT = 34.4810201;
const AMAKASHI_LNG = 135.81758;

async function main() {
  const ishibutai = await prisma.spot.findUnique({ where: { id: ISHIBUTAI_ID } });
  const amakashi = await prisma.spot.findUnique({ where: { id: AMAKASHI_ID } });
  if (!ishibutai || !amakashi) throw new Error("想定と違います");

  console.log("[1] 石舞台古墳: 「国内最大級の規模を誇ります」→「国内最大級とされます」");
  console.log("[2] 甘樫丘:", amakashi.lat, amakashi.lng, "→", AMAKASHI_LAT, AMAKASHI_LNG, "(OSM node 806503545 甘樫丘展望台)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: ISHIBUTAI_ID }, data: { memo: ISHIBUTAI_MEMO_NEW } });

  if (amakashi.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: amakashi.placeMasterId },
      data: { lat: AMAKASHI_LAT, lng: AMAKASHI_LNG, positionSource: "osm" },
    });
  }
  await prisma.spot.update({ where: { id: AMAKASHI_ID }, data: { lat: AMAKASHI_LAT, lng: AMAKASHI_LNG } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #110 76319c13の直し(2回目)。itinerary-audit.cjsで、既存本文(私の今回の
 * 変更前から入っていた箇所)に2件の言い切り・料金の言葉が見つかった。
 * ① 大さん橋「24時間無料で開放されていて」→料金の言葉(無料)を削除
 * ② 大さん橋「横浜屈指の絶景スポットです」→「横浜屈指ともいわれる」
 * ③ 赤レンガ倉庫「日本初の荷役用エレベーター」→「日本初とされる」
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OSANBASHI_FROM = "天然芝とウッドデッキが広がるこの屋上広場は24時間無料で開放されていて、みなとみらいのビル群と海を一望できる、横浜屈指の絶景スポットです。";
const OSANBASHI_TO = "天然芝とウッドデッキが広がるこの屋上広場は24時間開放されていて、みなとみらいのビル群と海を一望できる、横浜屈指ともいわれる絶景スポットです。";

const AKARENGA_FROM = "荷物を運ぶ日本初の荷役用エレベーターや、火災を防ぐ防火扉、消火用のスプリンクラーまで備えた、当時としては最新鋭の倉庫でした。";
const AKARENGA_TO = "荷物を運ぶ日本初とされる荷役用エレベーターや、火災を防ぐ防火扉、消火用のスプリンクラーまで備えた、当時としては最新鋭の倉庫でした。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const osanbashi = await findSpotInItinerary(itinId, { spotName: "横浜港大さん橋国際客船ターミナル" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "横浜赤レンガ倉庫" });

  if (!osanbashi.memo!.includes(OSANBASHI_FROM)) throw new Error("大さん橋の文言が想定外です");
  if (!akarenga.memo!.includes(AKARENGA_FROM)) throw new Error("赤レンガ倉庫の文言が想定外です");
  console.log("確認OK: 2件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: osanbashi.id }, { memo: osanbashi.memo!.replace(OSANBASHI_FROM, OSANBASHI_TO) });
  await updateSpotInItinerary(itinId, { spotId: akarenga.id }, { memo: akarenga.memo!.replace(AKARENGA_FROM, AKARENGA_TO) });
  console.log("COMMITTED: 2件");
}
main().finally(() => prisma.$disconnect());

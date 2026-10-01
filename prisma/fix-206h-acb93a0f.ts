/**
 * #206 acb93a0f（田沢湖）の直し（しおりえ(制作補助2)、2026-10-01）
 * 姫観音像の点 node 10089664154 は、名前のない駐車場の頂点だった（自分の OSM の XML の読み取りの不具合。#201・#204 と同じ）。
 * 本当の姫観音像は node 10089738062「姫観音像」historic=wayside_shrine 39.7480499,140.6763238 で、白浜（way 1278652792）から北西へ約2.4km、
 *   御座石へ向かう途中にある。「湖岸の遊歩道を北へ約15分歩きます」も合わないので、組み替える:
 *   白浜（スポットの名前を「白浜」に、点は白浜の way の中心 39.7335101,140.6974245）10:00〜10:40（船着き場から歩いてすぐ）
 *   → 姫観音（新規、点は node 10089738062）10:45〜11:05（車で約5分）→ 御座石神社 11:15（車で約10分。以降は変えない）
 *   本文の出典は fix-206 と同じ（白浜 04_shirahama.html：以前は鳴き砂・遊歩道 約1km／姫観音 04_himekan.html）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206h-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "cb412991-fdf1-43da-b3e7-c568905e3424";
const SHIRA = "29f0a147-4811-42de-b912-3fd8aac095f2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const OLD_SHIRA =
  "船を降りたら、湖岸の遊歩道を北へ約15分歩きます。白浜は、かつて鳴き砂として知られ、その白さから名づけられた浜です。湖畔には姫観音が湖に向かって立っています。昭和15年に、国の方針で玉川の強い酸性の水を湖に引き入れ、湖を貯水のためのダムとしたことで、湖の多くの魚がいなくなりました。姫観音は、その魚たちと湖の神・たつこ姫を慰めるために、まわりの寺の住職たちが中心となって建てたものです。静かに見学しましょう。湖岸では足元に気をつけましょう。";
const NEW_SHIRA = "船を降りたら、湖岸を北へ歩いてすぐの白浜へ。かつて鳴き砂として知られ、その白さから名づけられた浜で、湖岸には約1kmの遊歩道があります。湖岸では足元に気をつけましょう。";
const HIME = {
  name: "姫観音", visitTime: t(10, 45), stayDurationMin: 20, transitMode: "car", transitDurationMin: 5, transitLine: null,
  lat: 39.7480499, lng: 140.6763238, address: "秋田県仙北市田沢湖田沢",
  memo: "白浜から車で湖岸を北西へ約5分。湖畔に、姫観音が湖に向かって立っています。昭和15年に、国の方針で玉川の強い酸性の水を湖に引き入れ、湖を貯水のためのダムとしたことで、湖の多くの魚がいなくなりました。姫観音は、その魚たちと湖の神・たつこ姫を慰めるために、まわりの寺の住職たちが中心となって建てたものです。静かに見学しましょう。",
};
const GOZA_FROM = "遊歩道を白浜まで歩いて戻り、車で湖を時計回りに約20分、北岸の御座石へ（あわせて約35分）。";
const GOZA_TO = "姫観音から車で湖を時計回りに約10分、北岸の御座石へ。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
  if (spots[1]?.id !== SHIRA || spots[1].memo !== OLD_SHIRA || spots[2]?.name !== "御座石神社" || !spots[2].memo?.startsWith(GOZA_FROM)) throw new Error("構成が想定と違います");
  const items: unknown[] = [{ id: spots[0].id, data: {} }];
  items.push({ id: SHIRA, data: { name: "白浜", visitTime: t(10, 0), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 5, lat: 39.7335101, lng: 140.6974245, memo: NEW_SHIRA } });
  items.push({ create: HIME });
  items.push({ id: spots[2].id, data: { transitDurationMin: 10, memo: spots[2].memo.replace(GOZA_FROM, GOZA_TO) } });
  for (const s of spots.slice(3)) items.push({ id: s.id, data: {} });
  console.log(`白浜 10:00〜10:40 → 姫観音 10:45〜11:05（新規）→ 御座石神社 11:15（車10分）\n白浜: ${NEW_SHIRA}\n姫観音: ${HIME.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY_ID, items as never, { tx }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

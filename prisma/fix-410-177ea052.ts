/**
 * チェックリスト #410 177ea052「梅と花火と温泉街。冬の熱海を楽しむ日帰り旅」の見直し（しおりえ(制作補助2)、進め方は企画運営の了承済み）
 * MOA美術館 →（タクシー）熱海銀座（昼食）→ 起雲閣 →（タクシー）熱海梅園 → 來宮神社 →（タクシー）熱海サンビーチ（6か所 09:30〜16:30）
 * 夜の熱海海上花火大会（20:20）のスポットは外し（夜の催しはスポットにせず、メモで案内）、サンビーチのメモに一言。タイトルも内容に合わせて変える
 * 既存の5か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す）。起雲閣を新しく入れる
 * 写真: 熱海銀座の写真（RZ_Atami_Ginza_Theater_A.jpg）は成人向けの劇場の看板が大きく写っているので外す（ほかに銀座通りの合う写真が見つからない）
 *   熱海サンビーチの写真（熱海01.JPG）は夏の海水浴の人出で水着の人が大勢写っているので、
 *   https://commons.wikimedia.org/wiki/File:View_of_Atami_Sun_Beach_from_northeast_-_Mar_14,_2024.jpg（m-louis .®、CC BY-SA 2.0、目で見て砂浜とヤシ並木を確認）に替える
 *   MOA美術館・熱海梅園の写真は目で見て合っているので残す。表紙は MOA美術館のまま。花火の写真はスポットと一緒に消える
 * 本文の出典（熱海市の観光サイト あたみニュース）: MOA https://www.ataminews.gr.jp/spot/112 ／來宮神社 https://www.ataminews.gr.jp/spot/115 ／
 *   熱海梅園 https://www.ataminews.gr.jp/spot/105 ／起雲閣 https://www.ataminews.gr.jp/spot/114 ／銀座商店街 https://www.ataminews.gr.jp/spot/329 ／
 *   サンビーチ https://www.ataminews.gr.jp/spot/119 ／海上花火大会 https://www.ataminews.gr.jp/event/8/
 * 座標の出典: Nominatim（MOA美術館 35.1092616,139.0753345／熱海銀座は国道135号のバス停「銀座」の点 35.0953608,139.0754480（通りの点がないため）／
 *   起雲閣 35.0927353,139.0714359／熱海梅園 35.0982716,139.0589567／來宮神社 35.1001041,139.0678772／熱海サンビーチ 35.0982401,139.0768609）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-410-177ea052.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "177ea052-e17b-4922-8151-54de866305f5";
const DAY1_ID = "31dce24a-0ff5-451d-bb3c-5b9e43709329";
const MOA_ID = "dfe12404-e1d3-47b9-b473-ba7e5b79153f";
const KINOMIYA_ID = "642b488c-9293-47a0-827d-07e762bbde13";
const BAIEN_ID = "423d77b9-dfdc-45de-b3b5-9a106459fa0c";
const GINZA_ID = "cdae7946-058c-478c-b117-1e99c0c405c7";
const BEACH_ID = "bf16595c-0807-424f-8ce5-56bbb5c8f63b";
const HANABI_ID = "e379b613-f6ab-4485-9992-d78e05ffb223";
const IMAGE = "https://upload.wikimedia.org/wikipedia/commons/b/b1/View_of_Atami_Sun_Beach_from_northeast_-_Mar_14%2C_2024.jpg";
const PAGE = "https://commons.wikimedia.org/wiki/File:View_of_Atami_Sun_Beach_from_northeast_-_Mar_14,_2024.jpg";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "梅と温泉街、冬の熱海を楽しむ日帰り旅";
const DESCRIPTION =
  "熱海を代表するMOA美術館から、昭和の面影が残る熱海銀座で昼食を。文豪たちに愛された起雲閣を見学し、日本で最も早咲きの梅で知られる熱海梅園と、大楠の御神木がそびえる來宮神社をめぐって、最後は熱海サンビーチへ。熱海梅園の梅まつりは例年1月〜3月ごろ。冬の熱海の温泉街を楽しむ日帰りプランです。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  upd(MOA_ID, 9, 30, 90, null, null, 35.109262, 139.075335,
    "東洋美術の絵画・書跡・工芸を中心に、国宝3点、重要文化財67点を含む約3500点を収蔵する、熱海を代表する美術館です。尾形光琳の最高傑作とされる国宝「紅白梅図屏風」は期間限定の公開で、例年2月ごろ、梅の季節に合わせて公開されます。高台に建ち、館内のメインロビーやムア広場からは、伊豆大島や初島などの眺めが広がります。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(GINZA_ID, 11, 20, 70, "taxi", 15, 35.095361, 139.075448,
    "MOA美術館からタクシーで約15分。かつて熱海の中心としてにぎわった銀座通りの商店街で、入口の交差点の角には、1975年まで銀行だった建物を使った熱海商工会議所が、重厚でレトロな姿を残しています。軒先に干物が吊るされた店や、昭和のままの姿の喫茶店のほか、地元の素材を使ったカフェやスイーツの店もあります。ここで昼食にしましょう。",
    { name: "熱海銀座（昼食）" }),
  cre("起雲閣", 12, 40, 60, "walk", 10, 35.092735, 139.071436, "静岡県熱海市昭和町4-2",
    "熱海銀座から歩いて約10分。1919年（大正8年）に別荘として築かれ、「熱海の三大別荘」とたたえられた名邸をもとにした建物です。1947年（昭和22年）からは旅館として、山本有三、志賀直哉、谷崎潤一郎、太宰治など、多くの文豪にも愛されました。今は熱海市の文化財として公開され、日本家屋の本館や離れ、日本・中国・欧州の装飾を融合させた洋館、緑豊かな庭園を見学できます。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(BAIEN_ID, 13, 50, 60, "taxi", 10, 35.098272, 139.058957,
    "起雲閣からタクシーで約10分。日本で最も早咲きの梅と、最も遅い紅葉が見られるといわれる庭園です。樹齢100年を超える古木を含む60品種・469本の梅と、約380本の紅葉樹があり、例年1月〜3月ごろには梅まつり、11月〜12月ごろにはもみじまつりが開かれます。内務省の長与専斎が、温泉による保養には適度な運動も大切だと提唱したことから造られ、1886年（明治19年）に開園しました。園内の散策を楽しみましょう。"),
  upd(KINOMIYA_ID, 15, 5, 40, "walk", 15, 35.100104, 139.067877,
    "熱海梅園から歩いて約15分。来福・縁起の神として古くから信仰されている神社で、本殿の横には、国の天然記念物に指定された、樹齢二千百年ともいわれる大楠の御神木があります。幹を一回りすると寿命が一年延びると伝えられ、願い事のある人は、思うことを誰にもいわずに一回りするとよいともいわれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(BEACH_ID, 16, 0, 30, "taxi", 15, 35.09824, 139.076861,
    "來宮神社からタクシーで約15分。ヤシの並木通りと白い砂浜、立ち並ぶホテルが、外国のリゾートのような雰囲気をつくるビーチです。夜は、照明デザイナーの石井幹子氏が手がけた、日本で初めてとされるビーチのライトアップも見られます。冬にも、夜に熱海海上花火大会が開かれる日があります。三方を山に囲まれた熱海湾に音が響く、1952年から続く花火大会なので、見たい人は公式の開催日を確かめてみましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${MOA_ID},${KINOMIYA_ID},${BAIEN_ID},${GINZA_ID},${BEACH_ID},${HANABI_ID}`) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));
  const ginzaPhoto = await prisma.photo.findMany({ where: { spotId: GINZA_ID } });
  if (ginzaPhoto.length !== 1 || !ginzaPhoto[0].sourceUrl?.includes("Atami_Ginza_Theater")) throw new Error("銀座の写真が想定と違います");
  const beachPhoto = await prisma.photo.findMany({ where: { spotId: BEACH_ID } });
  if (beachPhoto.length !== 1 || !beachPhoto[0].sourceUrl?.includes("%E7%86%B1%E6%B5%B701.JPG")) throw new Error("サンビーチの写真が想定と違います");

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`削除: ${names[HANABI_ID]}／銀座の写真を外す／サンビーチの写真を替える`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-410/atami-sun-beach.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("上げた写真:", blob.url);
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.photo.delete({ where: { id: ginzaPhoto[0].id } });
      await tx.photo.update({ where: { id: beachPhoto[0].id }, data: { url: blob.url, sourceUrl: PAGE, author: "m-louis .®", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0" } });
      await setDaySpotOrder(DAY1_ID, order, { tx, remove: [HANABI_ID] });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

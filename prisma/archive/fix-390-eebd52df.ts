/**
 * チェックリスト #390 eebd52df「雪国館と川端康成ゆかりの地、小説「雪国」の舞台をたどるプラン」の見直し（しおりえ(制作補助2)）
 * 雪国館 → 主水公園（雪国の碑）→ 諏訪社の大杉 → 湯沢高原ロープウェイ → 湯沢高原パノラマパーク（昼食）→ CoCoLo湯沢（7か所 09:00〜16:30）
 * 既存の2か所はIDのまま直す。前の本文は案内役の話し言葉（「皆様、本日ご案内するのは…」）で、出典で確かめられない記述
 *   （川端の直筆の冒頭の一文・愛用品、諏訪神社の創建年・祭神・再建年・「恋の物語石」）があったので書き直す。「諏訪神社」は観光の公式の呼び名に合わせ「諏訪社の大杉」にする
 * 雪国館の座標は町役場のあたり（36.93408,138.81739）になっていたので、OSMの建物の点に直す
 * 座標の出典: OSM/Overpass（湯沢町歴史民俗資料館「雪国館」 36.93897,138.80558／諏訪社 36.946568,138.801379／湯沢高原ロープウェイ 山麓側の端 36.940065,138.804039・山頂側の端 36.937534,138.79068）、
 *   Nominatim（主水公園 36.9394566,138.8072207／CoCoLo湯沢 36.9365349,138.8086373）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-390-eebd52df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "eebd52df-4af9-478e-9f67-95784b9af2d2";
const DAY1_ID = "86882543-8f41-4ed0-9208-5a3ec60844dd";
const YUKIGUNI_ID = "2fec9aa7-9566-4cc6-9d33-2164eba6e944";
const SUWA_ID = "9ceba5a9-6267-4125-9edb-9ce11f3e35d2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "川端康成が小説「雪国」を書いた越後湯沢で、雪国の暮らしと物語の世界を紹介する雪国館、冒頭の一文を刻んだ碑、駒子が涼んだ大杉をたどる文学散歩。午後はロープウェイで山の上のパノラマパークへ上って越後の山々を眺め、最後は駅の中の店で地酒やお米のお土産を選ぶ日帰りプランです。";

const MEMO_YUKIGUNI =
  "JR越後湯沢駅の西口から歩いて約7分、正式には「湯沢町歴史民俗資料館」という資料館です。川端康成は昭和9年（1934年）から湯沢の温泉宿に滞在し、この地を舞台に小説『雪国』を書き進めました。館内には『雪国』の世界を紹介する展示があり、ヒロイン駒子のモデルとされる芸者・松栄が住んでいた部屋が移されています。雪深い土地の暮らしの道具や、昭和の初めごろの住まいを再現した展示、町の歴史の展示もあり、豪雪地の暮らしの知恵にもふれられます。休館日は公式の案内で確かめてから訪れましょう。";

const MEMO_SUWA =
  "主水公園から歩いて約20分、温泉街の奥の小高い所にある諏訪社です。境内には樹齢約400年とされる杉の大木があり、湯沢町の天然記念物に指定されています。小説『雪国』でヒロインの駒子が涼をとった大杉とされ、川端康成が作品の構想を練った場所ともいわれます。物語の一場面を思い浮かべながら、大杉を見上げてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; lat: number; lng: number; address: string; memo: string };

const PARK: NewSpot = {
  name: "主水公園（雪国の碑）", h: 10, m: 15, stay: 15, mode: "walk", dur: 5, lat: 36.939457, lng: 138.807221, address: "新潟県南魚沼郡湯沢町湯沢361-1",
  memo:
    "雪国館から歩いてすぐの公園です。園内の「雪国の碑」には、「国境の長いトンネルを抜けると雪国であった。夜の底が白くなった。」という小説の冒頭の一文が、川端康成の筆跡で刻まれています。物語の始まりの一文を、この土地で味わってみましょう。冬は公園の中の除雪がされず入れないので、雪のない時期に訪れましょう。",
};

const AFTER: NewSpot[] = [
  {
    name: "湯沢高原ロープウェイ", h: 11, m: 45, stay: 15, mode: "walk", dur: 15, lat: 36.940065, lng: 138.804039, address: "新潟県南魚沼郡湯沢町湯沢",
    memo:
      "諏訪社から歩いて約15分、山麓駅からロープウェイに乗ります。全長約1300m、166人が乗れる世界最大級のロープウェイで、山の上のパノラマパークまで約7分で上ります。窓の外に広がる湯沢の町と山並みを眺めましょう。季節の変わり目などに運休する期間があるので、運行の日は公式の案内で確かめてください。",
  },
  {
    name: "湯沢高原パノラマパーク", h: 12, m: 10, stay: 160, mode: "other", dur: 10, lat: 36.937534, lng: 138.79068, address: "新潟県南魚沼郡湯沢町湯沢",
    memo:
      "ロープウェイの山頂駅を出ると広がる高原です。雪のない季節は、高山植物園「アルプの里」で、高い山でしか見られない高山植物をはじめ、季節の花々を見ながら散策できます。冬はスキー場になり、雪をかぶった越後の山々を見渡せます。展望のデッキや食事処もあるので、景色を眺めながら昼食にしましょう。山の上は町より気温が低いので、上着を持って行きましょう。",
  },
  {
    name: "CoCoLo湯沢", h: 15, m: 15, stay: 75, mode: "other", dur: 25, lat: 36.936535, lng: 138.808637, address: "新潟県南魚沼郡湯沢町湯沢",
    memo:
      "ロープウェイで山を下り、山麓駅から歩いて約10分、越後湯沢駅の中にある商業施設です。笹だんごや南魚沼のお米、米菓、新潟の地酒など、越後の名産品が並び、日本酒の飲みくらべができる店もあります。お酒を飲むときは飲みすぎに気をつけ、車を運転する人は飲まないようにしましょう。帰りの列車の時間まで、お土産選びを楽しんでください。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${YUKIGUNI_ID},${SUWA_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: YUKIGUNI_ID, data: { visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.93897, lng: 138.80558, memo: MEMO_YUKIGUNI } },
    toCreate(PARK),
    { id: SUWA_ID, data: { name: "諏訪社の大杉", visitTime: t(10, 50), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 36.946568, lng: 138.801379, memo: MEMO_SUWA } },
    ...AFTER.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === YUKIGUNI_ID ? "雪国館(既存)" : "諏訪社の大杉(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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

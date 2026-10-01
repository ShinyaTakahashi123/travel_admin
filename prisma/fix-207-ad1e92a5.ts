/**
 * #207 ad1e92a5「唐戸市場と関門海峡、フグと絶景を楽しむ定番日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:10 で、行き方・帰りの一言がなく、本文はツアーガイドの話し方（「皆様」「お楽しみいただけたことでしょう」）。
 *   移動の手段が車になっていたが、唐戸市場と唐戸桟橋は歩いてすぐ。関門海峡（唐戸桟橋周辺）の座標が海の上だったので直す
 * 歩きと連絡船: 唐戸市場 9:00 →（連絡船）巌流島 →（連絡船）関門海峡（唐戸桟橋周辺）→（連絡船）門司港レトロ（昼食）→ 九州鉄道記念館 → 門司港駅
 *   → 関門海峡ミュージアム → 門司港レトロ展望室 16:30 → 門司港駅からJRで（下関へも連絡船で戻れる）
 *   #381（e25ac636）と重ならないよう、赤間神宮・壇ノ浦・海響館・人道などは入れない。#381 の文は使わない
 * 本文の出典: 唐戸市場 https://yamaguchi-tourism.jp/spot/detail_11069.html （下関駅からバスで約10分・ふぐ・2階の食堂・金〜日と祝日の活きいき馬関街）・https://www.karatoichiba.com/ ／
 *   巌流島 https://yamaguchi-tourism.jp/blog/detail_370.html （周囲1.6km・1612年の決闘・正式名 船島・1973年まで島民・唐戸から連絡船で約10分・武蔵と小次郎の像・船島神社・島内の目安 約50分）／
 *   門司港レトロ https://www.mojiko.info/ （飲食 https://www.mojiko.info/eat/index.html ）／九州鉄道記念館 https://www.mojiko.info/spot/tetudo.html ・https://www.k-rhm.jp/ （旧九州鉄道本社の赤レンガ・実物車両・第2水曜休）／
 *   門司港駅 https://www.mojiko.info/spot/jrmojiko.html （1914年に門司駅として開業・1942年に改称・1988年に駅舎として初めて重要文化財・2019年に復原・ネオルネサンス様式・0哩標）／
 *   関門海峡ミュージアム https://www.mojiko.info/spot/museum.html （平成15年開館・海峡アトリウム・海峡歴史回廊・大正時代の街並み・2019年リニューアル）／
 *   門司港レトロ展望室 https://www.mojiko.info/spot/tenbo.html （黒川紀章設計のレトロハイマート31階・高さ103m）
 * 座標の出典: OSM（Nominatim）— 唐戸市場 way 221599486／巌流島 relation 8444040／唐戸桟橋 way 225454789／門司港レトロ node 9079593378／九州鉄道記念館 way 32387865／
 *   門司港駅 relation 2532442／関門海峡ミュージアム way 969230646／門司港レトロハイマート展望室 node 2959854421
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-207-ad1e92a5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ad1e92a5-bfea-413b-9385-efd118b1c89a";
const DAY_ID = "0f62c515-97e9-46f8-b89a-9e15f1aff9a4";
const KARATO = "283246ec-c948-4a96-b4a9-8272500daa97";
const KAIKYO = "13618bd3-4fbb-406a-8a01-929b50dc0fd9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "下関の台所・唐戸市場から、連絡船で武蔵と小次郎の決闘の島・巌流島へ。唐戸に戻って関門海峡を船で渡り、九州側の門司港レトロで昼食をとったら、九州鉄道記念館と重要文化財の門司港駅、関門海峡ミュージアムをめぐり、展望室から海峡を見渡します。船で本州と九州を行き来する日帰りプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(KARATO, { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 33.9566245, lng: 130.945817, address: "山口県下関市唐戸町5-50",
    memo: "この旅は歩きと連絡船でめぐります。JR下関駅からバスで約10分の唐戸へ。唐戸市場は「関門の台所」と呼ばれる市場で、ふぐの取扱量が全国一の下関らしく、店先には新鮮な魚介が並びます。金曜から日曜と祝日には、にぎり寿司や海鮮丼、ふく汁などの屋台が並ぶ「活きいき馬関街」も開かれます。市場の中は床がぬれていることがあるので、足元に気をつけましょう。" }),
  cre("巌流島", { h: 10, m: 0, stay: 50, mode: "other", min: 20, lat: 33.9333522, lng: 130.9298037, address: "山口県下関市（巌流島）",
    memo: "市場から唐戸の乗り場へ歩き、連絡船で約10分（あわせて約20分）。関門海峡に浮かぶ周囲1.6kmの小さな島で、正式な名は船島です。1612年に宮本武蔵と佐々木小次郎が決闘をした地として知られ、敗れた小次郎の流派の名から「巌流島」と呼ばれるようになったといわれます。展望広場の武蔵と小次郎の像や、人工の砂浜に置かれた伝馬船、船島神社などをめぐりましょう。1973年までは島に人が暮らしていました。船の便は公式の案内で確かめましょう。" }),
  upd(KAIKYO, { h: 11, m: 0, stay: 15, mode: "other", min: 10, lat: 33.9558221, lng: 130.9423204, address: "山口県下関市唐戸町",
    memo: "巌流島から連絡船で唐戸へ戻ります。唐戸の桟橋のあたりからは、本州と九州の間をたくさんの船が行き交う関門海峡と、対岸の門司港の町並みが目の前に広がります。ここから九州へは、門司港行きの連絡船に乗り換えて渡ります。岸壁のそばでは足元に気をつけましょう。" }),
  cre("門司港レトロ", { h: 11, m: 25, stay: 70, mode: "other", min: 10, lat: 33.945187, lng: 130.9645495, address: "福岡県北九州市門司区港町",
    memo: "唐戸から連絡船で関門海峡を渡り、九州側の門司港へ。港のまわりには明治から大正のころの建物が残り、門司港レトロとして整えられています。飲食店も多いので、このあたりで昼食にしましょう。" }),
  cre("九州鉄道記念館", { h: 12, m: 45, stay: 60, mode: "walk", min: 10, lat: 33.9432669, lng: 130.961775, address: "福岡県北九州市門司区清滝2丁目3-29",
    memo: "門司港レトロから歩いて約10分。旧九州鉄道の本社だった赤レンガの建物を生かした鉄道の博物館で、明治時代に九州で造られた木造の客車や、なつかしい蒸気機関車などの実物の車両が並びます。休館日は公式の案内で確かめましょう。" }),
  cre("門司港駅", { h: 13, m: 50, stay: 25, mode: "walk", min: 5, lat: 33.9451155, lng: 130.9614754, address: "福岡県北九州市門司区西海岸1丁目5-31",
    memo: "記念館から歩いて約5分。大正3年（1914年）に門司駅として開業し、昭和17年（1942年）に門司港駅と名を改めた駅で、1988年に鉄道の駅舎として初めて国の重要文化財に指定されました。左右対称のネオルネサンス様式の木造駅舎は、2019年に復原工事を終えています。構内には九州の鉄道の起点を示す「0哩（ゼロマイル）」の標もあります。今も使われている駅なので、ほかの利用者のじゃまにならないように見学しましょう。" }),
  cre("関門海峡ミュージアム", { h: 14, m: 25, stay: 70, mode: "walk", min: 10, lat: 33.9437966, lng: 130.9567859, address: "福岡県北九州市門司区西海岸1丁目3-3",
    memo: "門司港駅から歩いて約10分。関門海峡の昔と今を五感で感じられるミュージアムで、海峡にまつわる歴史を再現した展示や、大正時代の町並みの再現などがあります。休館日は公式の案内で確かめましょう。" }),
  cre("門司港レトロ展望室", { h: 15, m: 50, stay: 40, mode: "walk", min: 15, lat: 33.9484316, lng: 130.9641434, address: "福岡県北九州市門司区東港町",
    memo: "ミュージアムから歩いて約15分。建築家・黒川紀章が設計した高層マンションの31階にある展望室で、高さ103mから関門海峡や門司港レトロの町並み、渡ってきた下関の町を見渡せます。帰りは、門司港駅からJRで帰りましょう。下関へ戻るときは、門司港から連絡船で唐戸へ渡れます。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [KARATO, KAIKYO].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (x.id === KARATO ? "唐戸市場(既存)" : "関門海峡(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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

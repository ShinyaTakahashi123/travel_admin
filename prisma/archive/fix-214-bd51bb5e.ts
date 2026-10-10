/**
 * #214 bd51bb5e「成田山新勝寺と表参道、定番の門前町さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜12:40 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お楽しみいただけたことでしょう」）。
 *   表参道の点は成田山薬師堂の点、新勝寺の点は度分秒から直した値だった
 * 電車・バス・歩き（JR・京成の成田駅から）:
 *   成田山新勝寺 9:00 → 成田山公園 → 成田山表参道（昼食）→（成田駅からバス）房総のむら → 龍角寺古墳群（岩屋古墳）→ 風土記の丘資料館 16:30 →（バスで成田駅か安食駅へ）
 *   #25・#466（成田）と重ならないよう、午後は房総のむらと龍角寺古墳群にし、成田山の文はもとの文を生かして別に書いた
 * 本文の出典: 新勝寺・公園・表参道はもとの本文（天慶3年の開山・三重塔 正徳2年・額堂・水琴窟・書道美術館・参道約800m・鰻）を生かし、言い方だけ直した
 *   房総のむら https://www.chiba-muse.or.jp/MURA/ （9:00〜16:30・月曜休（祝休日は火曜））・/aboutus/ （昭和61年開館・平成16年に房総風土記の丘と統合・武家・商家・農家）・
 *   /facility/page-1521181423063/ （商家の町並み: 佐原などを参考にめし屋・そば屋から鍛冶屋まで16軒）・/facility/page-1519175606779/ （武家屋敷: 佐倉の武居家がモデル）・
 *   /facility/page-1519312671176/ （古墳群: 115基・敷地内に78基・約32ha・101号古墳の埴輪の復元）・/facility/page-1677732114704/ （風土記の丘資料館: 国史跡「龍角寺古墳群・岩屋古墳」・全国最大の方墳 岩屋古墳のジオラマ・浅間山古墳の石室の実物大模型・7世紀創建の龍角寺）・
 *   /visit/page-1519754757602/ （JR成田駅からバスで約20分、徒歩約10分）
 * 座標: OSM — 成田山新勝寺 way 273746634（Nominatim の中心）／成田山公園 way 273767998（同）／成田山表参道 way 1017790798「表参道」（同）／
 *   房総のむら way 1149555676（同）／岩屋古墳 way 240578532（同）／風土記の丘資料館 node 2483069719（API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-214-bd51bb5e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "bd51bb5e-0c5c-4b1e-98de-c6a125a64de5";
const DAY_ID = "06834a93-0d15-4b21-91c7-b0b38b1229d3";
const SANDO = "1a331170-28c0-4688-9dc5-b0816cd31da4";
const JI = "addf5e21-8181-4c85-b530-911bae6378c3";
const PARK = "c04dc6f2-281d-43f7-81e0-8623232f7fea";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "朝の成田山新勝寺にお参りし、境内の奥の成田山公園を歩いて、表参道で昼食に。午後はバスで房総のむらへ足をのばし、昔の町並みを再現した商家や武家屋敷、龍角寺古墳群と風土記の丘資料館をめぐる、電車とバス、歩きの日帰りプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(JI, { h: 9, m: 0, stay: 75, mode: null, min: null, lat: 35.7863311, lng: 140.3172238, address: "千葉県成田市成田1",
    memo: "この旅は電車とバス、歩きでめぐります。JRか京成の成田駅から、表参道を歩いて約15分。天慶3年（940年）、平将門の乱を鎮めるため、朱雀天皇の命を受けた寛朝大僧正が、弘法大師空海ゆかりの不動明王像をこの地に奉じて、21日間護摩を焚いて祈ったのが始まりと伝えられる寺です。祈りの最後の日に乱が収まったことから、以来「成田のお不動様」として信仰を集め、今も護摩祈祷が続けられています。" + PRAY }),
  upd(PARK, { h: 10, m: 20, stay: 60, mode: "walk", min: 5, lat: 35.7865667, lng: 140.320777, address: "千葉県成田市成田1",
    memo: "大本堂から境内の奥へ歩いて約5分。公園へ向かう途中には、正徳2年（1712年）に建てられた三重塔や、絵馬や額を納める額堂などが並びます。園内には、詩歌を刻んだ石碑や、水の音が響く水琴窟などが点在し、成田山書道美術館では書の作品を見ることもできます。園内の坂や階段では足元に気をつけましょう。" }),
  upd(SANDO, { h: 11, m: 30, stay: 60, mode: "walk", min: 10, lat: 35.7840817, lng: 140.3169287, address: "千葉県成田市仲町",
    memo: "公園から境内を戻って表参道へ、歩いて約10分。成田駅から新勝寺まで続く約800mの参道で、江戸時代の面影を残す建物が並びます。成田詣でが盛んになったころから、鰻料理が参拝の人たちに親しまれてきたといわれ、今も鰻の店が多く並ぶ通りです。ここで昼食にしましょう。" }),
  cre("房総のむら", { h: 13, m: 15, stay: 90, mode: "bus", min: 45, line: "路線バス（竜角寺台車庫行き）", lat: 35.8253826, lng: 140.2731497, address: "千葉県印旛郡栄町龍角寺1028",
    memo: "表参道から成田駅へ歩いて戻り、バスで約20分、降りて歩いて約10分（あわせて約45分）。千葉県の伝統的な暮らしや技を体験しながら学べる、県立の体験型の博物館です。佐原などの古い町並みを参考に、めし屋やそば屋から鍛冶屋までの店先を再現した商家の町並みや、佐倉の武士の家をモデルにした武家屋敷、農家などが並びます。休館日は公式の案内で確かめましょう。" }),
  cre("龍角寺古墳群・岩屋古墳", { h: 14, m: 55, stay: 40, mode: "walk", min: 10, lat: 35.8211189, lng: 140.2770517, address: "千葉県印旛郡栄町龍角寺",
    memo: "房総のむらの商家の町並みから歩いて約10分、風土記の丘の林の中へ。龍角寺古墳群は115基の古墳からなり、約32haの園内には78基が残されていて、遊歩道を歩きながら間近に見られます。なかでも岩屋古墳は、全国最大の方墳とされ、国の史跡に指定されています。埴輪を復元した古墳もあります。遊歩道から外れないように歩きましょう。" }),
  cre("風土記の丘資料館", { h: 15, m: 45, stay: 45, mode: "walk", min: 10, lat: 35.8232451, lng: 140.2699309, address: "千葉県印旛郡栄町龍角寺1028",
    memo: "岩屋古墳から歩いて約10分。龍角寺古墳群のガイダンス施設を兼ねた資料館で、古墳群で最も大きな前方後円墳・浅間山古墳の石室を実物大で再現した模型や、岩屋古墳のジオラマ、7世紀に開かれた古い寺・龍角寺に関わる資料などが並びます。帰りは、房総のむらのバス停からバスで成田駅か、JR成田線の安食駅へ向かいましょう。バスの本数は多くないので、時刻を公式の時刻表で確かめましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [SANDO, JI, PARK].join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    const nm = "id" in x ? it.days[0].spots.find((s) => s.id === x.id)!.name + "(既存)" : d.name;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${nm} ${String(d.memo).length}字`);
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

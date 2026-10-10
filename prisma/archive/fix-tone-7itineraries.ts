/**
 * 企画運営2026-10-01 06:27の依頼。公開中の全しおりを案内口調
 * (お疲れさまでした/お楽しみください/ご案内/お楽しみいただけ/皆様/ご覧ください/ご堪能)
 * で検索したところ、制作補助の範囲(#251〜#374)で企✅済みの7本にまだ残っていた。
 * 時刻・行き先は変えず、該当する文だけを直す(口調のみの直しのため法務の確認は不要とのこと)。
 *
 * #251 15185f58 秩父ミューズパーク: 「ご案内するのは」「お楽しみください」「ご案内いたします」
 * #265 22e33bac 門司港駅: 「ご覧ください」
 * #289 40f8801b 水ノ浦教会・大瀬崎灯台展望所: 「お楽しみください」
 * #290 429aa0c4 とれとれ市場・白良浜: 「お楽しみください」
 * #310 6d8232c0 あべのハルカス: 「ご案内するのは」「いかがでしょうか」も案内口調のためあわせて直す
 * #312 7133c8fe 祖谷渓小便小僧展望台・落合集落: 「ご案内するのは/します」「お楽しみください」
 * #313 720bdfcb 有田内山伝統的建造物群・陶山神社: 「ご案内するのは」「お楽しみください」
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-tone-7itineraries.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

type Rep = { itinId: string; spotName: string; old: string; next: string };

const reps: Rep[] = [
  {
    itinId: "15185f58-5c6a-441b-a1a0-321b50f7a606",
    spotName: "秩父ミューズパーク",
    old: "旅の2日目にご案内するのは秩父ミューズパークです。",
    next: "旅の2日目は、秩父ミューズパークからです。",
  },
  {
    itinId: "15185f58-5c6a-441b-a1a0-321b50f7a606",
    spotName: "秩父ミューズパーク",
    old: "開放感あふれる自然の中で、ゆったりとした時間をお楽しみください。散策のあとは、秩父夜祭の魅力を伝える秩父まつり会館へとご案内いたします。",
    next: "開放感あふれる自然の中で、ゆったりとした時間を過ごしましょう。散策のあとは、秩父夜祭の魅力を伝える秩父まつり会館へ向かいましょう。",
  },
  {
    itinId: "22e33bac-7b3c-4cc1-bd56-d225434ade10",
    spotName: "門司港駅",
    old: "大正ロマンあふれる木造駅舎の佇まいを、じっくりとご覧ください。",
    next: "大正ロマンあふれる木造駅舎の佇まいを、じっくりと眺めてみましょう。",
  },
  {
    itinId: "40f8801b-fa0c-4c22-9744-4992fcb77d19",
    spotName: "水ノ浦教会",
    old: "丘の上に立つ純白の聖堂と、眼下に広がる岐宿湾の眺めをあわせてお楽しみください。",
    next: "丘の上に立つ純白の聖堂と、眼下に広がる岐宿湾の眺めをあわせて眺めてみましょう。",
  },
  {
    itinId: "40f8801b-fa0c-4c22-9744-4992fcb77d19",
    spotName: "大瀬崎灯台展望所",
    old: "旅の締めくくりに、五島列島ならではの雄大な景色をお楽しみください。",
    next: "旅の締めくくりに、五島列島ならではの雄大な景色を眺めてみましょう。",
  },
  {
    itinId: "429aa0c4-7d53-4cb8-b830-cbf7885a1f29",
    spotName: "とれとれ市場",
    old: "新鮮な海の幸を、思う存分お楽しみください。",
    next: "新鮮な海の幸を、思う存分味わってみましょう。",
  },
  {
    itinId: "429aa0c4-7d53-4cb8-b830-cbf7885a1f29",
    spotName: "白良浜",
    old: "青い海と真っ白な砂浜のコントラストを眺めながら、南国リゾートさながらの開放的なひとときをお楽しみください。",
    next: "青い海と真っ白な砂浜のコントラストを眺めながら、南国リゾートさながらの開放的なひとときを過ごしましょう。",
  },
  {
    itinId: "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038",
    spotName: "あべのハルカス",
    old: "旅の最後にご案内するのは、大阪のランドマーク、あべのハルカスです。",
    next: "旅の最後は、大阪のランドマーク、あべのハルカスです。",
  },
  {
    itinId: "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038",
    spotName: "あべのハルカス",
    old: "最後は大阪を一望する空の上から締めくくってみてはいかがでしょうか。",
    next: "最後は大阪を一望する空の上から締めくくります。",
  },
  {
    itinId: "7133c8fe-1bb5-4d3f-b644-653c74f59419",
    spotName: "祖谷渓 小便小僧展望台",
    old: "ご案内するのは、祖谷渓 小便小僧展望台です。",
    next: "最初に向かうのは、祖谷渓 小便小僧展望台です。",
  },
  {
    itinId: "7133c8fe-1bb5-4d3f-b644-653c74f59419",
    spotName: "祖谷渓 小便小僧展望台",
    old: "断崖の先に広がる深い渓谷美を、柵の内側からお楽しみください。",
    next: "断崖の先に広がる深い渓谷美を、柵の内側から眺めてみましょう。",
  },
  {
    itinId: "7133c8fe-1bb5-4d3f-b644-653c74f59419",
    spotName: "落合集落",
    old: "旅の2日目は、落合集落からご案内します。",
    next: "旅の2日目は、落合集落からです。",
  },
  {
    itinId: "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb",
    spotName: "有田内山伝統的建造物群",
    old: "ご案内するのは、有田内山伝統的建造物群です。",
    next: "最初に訪れるのは、有田内山伝統的建造物群です。",
  },
  {
    itinId: "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb",
    spotName: "有田内山伝統的建造物群",
    old: "時代を超えて受け継がれてきたやきものの町並みを、ゆっくりと歩いてお楽しみください。",
    next: "時代を超えて受け継がれてきたやきものの町並みを、ゆっくりと歩いて楽しんでみましょう。",
  },
  {
    itinId: "720bdfcb-fba0-4b55-b949-ae25f4ff3bbb",
    spotName: "陶山神社",
    old: "有田焼の粋を集めた、ここでしか見られない神社の姿をお楽しみください。",
    next: "有田焼の粋を集めた、ここでしか見られない神社の姿を眺めてみましょう。",
  },
];

async function main() {
  for (const r of reps) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: r.spotName, day: { itineraryId: r.itinId } } });
    if (spot.memo?.includes(r.next)) {
      console.log(`[${r.itinId.slice(0, 8)}] ${r.spotName}: already fixed`);
      continue;
    }
    if (!spot.memo?.includes(r.old)) {
      throw new Error(`[${r.itinId.slice(0, 8)}] ${r.spotName}: text not found: ${r.old}`);
    }
    await updateSpotInItinerary(r.itinId, { spotId: spot.id }, { memo: spot.memo.replace(r.old, r.next) });
    console.log(`[${r.itinId.slice(0, 8)}] ${r.spotName}: fixed`);
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * #81 af5a402c 企画運営の指摘(2026-09-30 18:33)。
 * 1) 定禅寺通りの70分は並木道を歩くだけとしては長すぎる(決まりA)。30分に短縮。
 * 2) 昼食が牛たん通り(13:54〜、fix-81bで追加した文言)では遅すぎる(仕様は
 *    11:30〜13:30ごろ)。仙台朝市(定禅寺通りのあとに移動、11時台着)を昼食の
 *    場所にし、牛たん通りの「遅めの昼食」の文言は削除、滞在も50分に短縮。
 * 空いた時間(定禅寺通り-40分、牛たん通り-20分)は、東北大学史料館(実在、
 * 大正15年[1926]建築の登録有形文化財、魯迅の記念展示、OSM node 6355870986)
 * を定禅寺通りのあとに新規追加して埋めた(決まりA、縮めた分をほかへ移さない)。
 * 開館は平日のみ(公式サイトで確認)のため、その旨をメモに明記。移動はOSM
 * 歩行者ルーティング実測(定禅寺通り→史料館1.46km/20分、史料館→朝市1.01km/14分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TEIZENJI_MEMO =
  "せんだいメディアテークから歩いておよそ7分、仙台を象徴する並木道、定禅寺通りに着きます。かつてこの通り沿いにあった「定禅寺」という寺の名にちなんで名付けられた、仙台の中心部を東西に貫く並木道です。昭和33年(1958)から植え始められたケヤキが4列に連なり、「杜の都」仙台を象徴する景観として、日本の道100選にも選ばれています。夏には青葉を茂らせたケヤキがトンネルのような木陰をつくり、秋にはジャズフェスティバルの音色が通りに響き、冬には「SENDAI光のページェント」として、無数の電飾がケヤキを彩ります。季節ごとに違う表情を見せてくれるこの並木道を、のんびりと歩いてみてください。この後は、歩いておよそ20分、東北大学史料館へ向かいましょう。";

const SHIRYOKAN_MEMO =
  "定禅寺通りから歩いておよそ20分、東北大学片平キャンパスにある東北大学史料館に着きます。大正15年(1926)に東北帝国大学附属図書館閲覧室として建てられた、ロマネスク風の外壁と塔屋が印象的な建物で、国の登録有形文化財に登録されています。館内では、東北大学の歩みを伝える常設展のほか、この地にあった仙台医学専門学校に学んだ魯迅にまつわる記念展示も見学できます。開館は平日のみで、土日祝日と夏期休業・年末年始は休館のため、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ14分、仙台朝市へ向かいましょう。";

const ASAICHI_MEMO =
  "東北大学史料館から歩いておよそ14分、仙台駅のほど近く、地元で「仙台の台所」として親しまれる仙台朝市に着きます。戦後の闇市を起源とする商店街で、鮮魚店や青果店、惣菜店など、およそ100mの通りに個性豊かな店が軒を連ねています。観光客向けというより、地元の人々の暮らしに根ざした市場ならではの活気があり、旬の魚介や東北の野菜、乾物などを眺めて歩くだけでも楽しい時間になります。市場内の食堂やお店で、ここで昼食にするのもおすすめです。掘り出し物を探しながら、仙台の食文化を肌で感じてみてください。この後は、歩いておよそ5分、SS30の展望フロアへ向かいましょう。";

const GYUTAN_MEMO =
  "SS30から歩いておよそ7分、JR仙台駅3階にある牛たん通り・すし通りに着きます。仙台名物・牛たん焼きの専門店が軒を連ねる「牛たん通り」と、新鮮な寿司を味わえる「すし通り」からなる飲食街で、仙台城をモチーフにした外観にリニューアルされています。厚切りの牛たんを炭火で焼き上げ、麦飯とテールスープを添えて出す仙台風の牛たん焼きは、戦後の仙台で生まれたとされる名物料理です。数ある店の中から好みの一軒を選んで、小腹を満たすのにもぴったりです。この後は、歩いておよそ26分、榴岡公園へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'af5a402c%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const day2Spots: SpotOrderItem[] = [
    { id: "64255c90-2aff-4406-95fd-1ed1ad4646a0", data: {} }, // せんだいメディアテーク
    {
      id: "6f76a6fd-0ac3-4ac2-90eb-2ee8b1ab1043", // 定禅寺通り
      data: { memo: TEIZENJI_MEMO, stayDurationMin: 30 },
    },
    {
      create: {
        name: "東北大学史料館",
        address: "宮城県仙台市青葉区片平2-1-1",
        lat: 38.2534889,
        lng: 140.8733031,
        memo: SHIRYOKAN_MEMO,
        visitTime: t(11, 37),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      id: "4d8e8f66-fa4f-43c5-a593-e9d6d23ede2a", // 仙台朝市
      data: { memo: ASAICHI_MEMO, visitTime: t(12, 26), stayDurationMin: 60, transitDurationMin: 14 },
    },
    { id: "a81107c0-d39d-454b-98ad-72cdebf68532", data: {} }, // SS30展望フロア
    {
      id: "8623d44b-2337-46e3-ba60-7b5bf05b64ef", // 牛たん通り・すし通り
      data: { memo: GYUTAN_MEMO, stayDurationMin: 50 },
    },
    { id: "3fef4965-17f8-494e-a86c-af15150617dd", data: {} }, // 榴岡公園
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "64255c90-2aff-4406-95fd-1ed1ad4646a0": 70,
    "a81107c0-d39d-454b-98ad-72cdebf68532": 35,
  };
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

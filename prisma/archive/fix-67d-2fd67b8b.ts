/**
 * #67 2fd67b8b（梅田さんぽ）ユーザー決定「全部直す」の対象(現状D1 16:09・D2 15:27)。
 * 滞在を延ばさず(決まりA)、実在スポットを追加。
 * D1: 大阪市中央公会堂のあとに大阪市立東洋陶磁美術館(実在、中之島一丁目、
 * OSM way 162382612、安宅コレクションの東洋陶磁で知られる、国宝「油滴天目茶碗」は
 * 展示期間限定のため常設扱いにしない)を追加。
 * D2: 大阪城天守閣のあとに大阪歴史博物館(実在、大手前四丁目、OSM node 4920617728、
 * NHK大阪放送局との合築、地下に難波宮の遺構)を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TOYOTOJI_MEMO =
  "大阪市中央公会堂から歩いておよそ5分、大阪市立東洋陶磁美術館に着きます。実業家・安宅英一が蒐集した「安宅コレクション」の寄贈を受けて昭和57年(1982)に開館した、東洋陶磁を専門とする美術館です。中国・朝鮮半島・日本などの陶磁器を中心に、国宝2件を含む優れたコレクションを収蔵しています。2022年には増築・リニューアルが行われ、ガラス張りの新しいエントランスが誕生しました。国宝「油滴天目茶碗」は展示期間が限られているので、見学したい場合は訪れる前に公式サイトで確かめましょう。静けさに包まれた展示室で、東洋陶磁の美をじっくりと味わってみてください。";

const REKISHI_MEMO =
  "大阪城天守閣から歩いておよそ10分、大阪歴史博物館に着きます。NHK大阪放送局の新放送会館との合築施設として平成13年(2001)に開館した博物館で、敷地の地下には、大阪の歴史のルーツとされる古代の宮殿・難波宮の遺構が保存されています。10階の古代フロアから見学をスタートし、中世・近世、近代・現代へと、フロアを下りながら大阪の歴史をたどっていく構成が特徴です。最上階からは、隣接する難波宮跡公園や大阪城の眺めも楽しめます。地下の遺構見学ツアーが実施されていることもあるので、訪れる前に公式サイトで確かめましょう。1400年にわたる大阪の歴史に、じっくりと触れてみてください。2日間の梅田さんぽ旅も、ここで無事に終了です。お疲れさまでした。お帰りは、大阪メトロ谷町線・中央線「谷町四丁目駅」(徒歩およそ3分)からご利用ください。";

async function main() {
  const day1Id = "f79366ce-05ce-407e-afff-a82355a9f79b";
  const day2Id = "e063b7c8-86a7-424b-a45a-dfa99436916e";

  const day1Spots: SpotOrderItem[] = [
    { id: "68009067-b5fb-41ce-8715-9bfc826f8625", data: {} },
    { id: "247f6838-7638-4526-918a-eeec9e4f8dde", data: {} },
    { id: "aabce37f-a3d3-421d-8471-f2f63ef766f9", data: {} },
    { id: "5c95e383-768c-42a7-a4e9-d7493e6e033f", data: {} },
    { id: "cc1174a3-d9ae-4b21-9deb-34e21533d8dd", data: {} },
    { id: "64f70a82-d141-4ea0-86d2-df68a065137a", data: {} },
    { id: "ebe1ee70-ade0-44a8-8995-0cefd5a2625f", data: {} },
    { id: "45116e76-b3ba-45c3-9a27-2e53fc38b804", data: {} },
    {
      create: {
        name: "大阪市立東洋陶磁美術館",
        address: "大阪府大阪市北区中之島1-1-26",
        lat: 34.693421,
        lng: 135.505487,
        memo: TOYOTOJI_MEMO,
        visitTime: t(16, 14),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "990a3437-08dd-41a2-8db8-b9cfbd57713e", data: {} },
    { id: "1e3226ab-406a-4d30-95a2-c00617f44676", data: {} },
    { id: "e4da007f-9d8d-4c1c-9f99-e18b86ff441b", data: {} },
    { id: "94364d94-f7db-4f6c-a987-6da2a2680980", data: {} },
    { id: "3fb12224-d134-4d2e-8383-58b842842281", data: {} },
    {
      id: "1607f556-d309-4298-a106-6fdf1edfad5a",
      data: {
        memo:
          "造幣博物館を出て少し北へ歩くと、明治4年(1871)に造幣寮の応接所として建てられた、白い漆喰壁が美しい洋風建築、泉布観が見えてきます。イギリス人技師ウォートルスが設計した、ベランダを巡らせたコロニアル様式の建物で、国の重要文化財に指定されています。内部の公開は例年春の数日間に限られていますが、通りからその趣のある外観を眺めることができます。泉布観の前を通り過ぎたら、大川に架かる橋を渡って大阪城公園に入り、園内を歩いておよそ27分、大阪城天守閣に到着します。天正11年(1583)、天下統一をめざす豊臣秀吉によって築造が始められた大坂城ですが、現在そびえ立つ天守閣は、大坂夏の陣での焼失、江戸時代の落雷による再焼失を経て、昭和6年(1931)に市民の寄付によって復興されたものです。地上55m、5層8階の内部には、豊臣秀吉にゆかりの品々や、大坂城にまつわる資料、甲冑や兜などが展示されているほか、徳川幕府が地中に埋めた豊臣時代の石垣を、地下で見学できるコーナーもあります。最上階の展望台からは、大阪の街並みを見渡すことができます。この後は、歩いておよそ10分、大阪歴史博物館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "大阪歴史博物館",
        address: "大阪府大阪市中央区大手前4-1-32",
        lat: 34.682618,
        lng: 135.520813,
        memo: REKISHI_MEMO,
        visitTime: t(15, 37),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${label} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1Id, day1Spots, { tx });
    await setDaySpotOrder(day2Id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

/**
 * #348の続き。企画運営12:12・法務12:13の指摘に対応。
 * 1) 草千里ヶ浜→阿蘇火山博物館のつなぎの文のずれ(3分→6分に修正し忘れ)。
 * 2) 中岳火口「有料道路が閉鎖され」→「火口へ向かう道路が閉鎖され」。
 * 3) 中岳火口の座標が丸めた値に見えたため、OSMの実点(中岳の山頂、peak)に
 *    修正。
 * 4) 米塚の伝説が不正確だった。阿蘇市公式(米塚及び草千里ヶ浜のページ)で
 *    確認し、「健磐龍命が収穫した米を積み上げてできた」「頂上のくぼみは
 *    米を手ですくって人々に分け与えた跡とされる」に修正。
 * 5) 大観峰「くじゅう連山や遠く九重の山並み」の重複を解消。
 * 6) 草千里ヶ浜の国指定(平成25年)は阿蘇市公式で確認済み、問題なし。
 * 7) 順番を草千里→博物館→中岳火口→米塚(下り道すがら)→阿蘇神社に変更
 *    (企画運営のおすすめ、上って下ってまた上る動きを解消)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-348c-aecf9d8c.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "bb5b5ef5-bbab-43f0-b272-1adea65a1dcc";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const kusasenri = await prisma.spot.findFirstOrThrow({ where: { name: "草千里ヶ浜", dayId: DAY1_ID } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇火山博物館", dayId: DAY1_ID } });
  const komezuka = await prisma.spot.findFirstOrThrow({ where: { name: "米塚", dayId: DAY1_ID } });
  const nakadake = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇山上（中岳火口）", dayId: DAY1_ID } });
  const jinja = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇神社", dayId: DAY1_ID } });
  const daikanbo = await prisma.spot.findFirstOrThrow({ where: { name: "大観峰", dayId: DAY1_ID } });
  const uchinomaki = await prisma.spot.findFirstOrThrow({ where: { name: "内牧温泉", dayId: DAY1_ID } });

  if (kusasenri.memo?.includes("歩いておよそ6分の阿蘇火山博物館")) {
    console.log("already applied, skipping");
    return;
  }

  const kusasenriOld = "見学を終えたら、歩いておよそ3分の阿蘇火山博物館へ向かいましょう。";
  const kusasenriNext = "見学を終えたら、歩いておよそ6分の阿蘇火山博物館へ向かいましょう。";
  if (!kusasenri.memo?.includes(kusasenriOld)) throw new Error("kusasenri anchor not found");

  const museumOld = "これから訪れる中岳火口の成り立ちを、先に学んでおきましょう。続いては、車でおよそ6分の米塚へ向かいましょう。";
  const museumNext = "これから訪れる中岳火口の成り立ちを、先に学んでおきましょう。続いては、車でおよそ12分の中岳火口へ向かいましょう。";
  if (!museum.memo?.includes(museumOld)) throw new Error("museum anchor not found");

  const nakadakeOld =
    "米塚からは、車でおよそ13分です。阿蘇山上、中岳火口は、今なお活発な活動を続ける中岳の火口で、直径およそ600m、深さおよそ130mという規模です。荒々しい噴煙や、条件がそろえば青みを帯びたコバルトブルーの火口湖を間近に望める、迫力満点のスポットです。阿蘇山は今も噴火警戒レベルに応じて火口周辺への立入りが規制されることがあり、レベルによっては有料道路が閉鎖され、火口の見学ができない場合もあります。草千里ヶ浜や阿蘇山上ターミナル周辺は、規制時にも散策を楽しめることが多いエリアです。火山ガスが出ることがあるため、ぜんそくや心臓の病気のある方は、火口周辺に近づかないようにしましょう。今も息づく大地の鼓動を体感できる、活火山ならではの迫力を、事前に規制情報を確かめたうえで楽しみましょう。続いては、車でおよそ17分の阿蘇神社へ向かいましょう。";
  const nakadakeNext =
    "阿蘇火山博物館からは、車でおよそ12分です。阿蘇山上、中岳火口は、今なお活発な活動を続ける中岳の火口で、直径およそ600m、深さおよそ130mという規模です。荒々しい噴煙や、条件がそろえば青みを帯びたコバルトブルーの火口湖を間近に望める、迫力満点のスポットです。阿蘇山は今も噴火警戒レベルに応じて火口周辺への立入りが規制されることがあり、レベルによっては火口へ向かう道路が閉鎖され、火口の見学ができない場合もあります。草千里ヶ浜や阿蘇山上ターミナル周辺は、規制時にも散策を楽しめることが多いエリアです。火山ガスが出ることがあるため、ぜんそくや心臓の病気のある方は、火口周辺に近づかないようにしましょう。今も息づく大地の鼓動を体感できる、活火山ならではの迫力を、事前に規制情報を確かめたうえで楽しみましょう。続いては、車でおよそ14分の米塚へ向かいましょう。";
  if (!nakadake.memo?.includes(nakadakeOld)) throw new Error("nakadake anchor not found");

  const komezukaOld =
    "阿蘇火山博物館からは、車でおよそ6分です。米塚は、標高およそ954mの小さな円錐形の火山で、お椀を伏せたような姿から、その名がついたと伝えられています。頂上には小さなくぼみがあり、米を一升ますで量って頂上に盛ったところ、心優しい神様がその一升を人々に分け与えたという伝説も残っています。現在は浸食を防ぐため、山に立ち入ることはできませんが、道路沿いから望む、緑に覆われた愛らしい姿は、阿蘇のシンボルの一つとして親しまれています。車窓や展望スポットから、阿蘇らしい独特な地形を眺めてみましょう。続いては、車でおよそ13分の中岳火口へ向かいましょう。";
  const komezukaNext =
    "中岳火口からは、車でおよそ14分です。米塚は、阿蘇神社の主祭神・健磐龍命が収穫した米を積み上げてできたと伝わる、お椀を伏せたような姿の小さな円錐形の火山です。実際にはおよそ3000年前に形成された単成火山(スコリア丘)で、毎年の野焼きによって美しい草原景観が保たれています。頂上のくぼみは、健磐龍命が米を手ですくって人々に分け与えた跡とされています。現在は浸食を防ぐため、山に立ち入ることはできませんが、道路沿いから望む、緑に覆われた愛らしい姿は、阿蘇のシンボルの一つとして親しまれています。車窓や展望スポットから、阿蘇らしい独特な地形を眺めてみましょう。続いては、車でおよそ18分の阿蘇神社へ向かいましょう。";
  if (!komezuka.memo?.includes(komezukaOld)) throw new Error("komezuka anchor not found");

  const jinjaOld = "中岳火口からは、車でおよそ17分です。";
  const jinjaNext = "米塚からは、車でおよそ18分です。";
  if (!jinja.memo?.includes(jinjaOld)) throw new Error("jinja anchor not found");

  const daikanboOld = "晴れた日には、くじゅう連山や遠く九重の山並みまで見渡すことができ、牧草地を馬や牛がのんびりと歩く牧歌的な風景も広がります。";
  const daikanboNext = "晴れた日には、遠くくじゅう連山まで見渡すことができ、牧草地を馬や牛がのんびりと歩く牧歌的な風景も広がります。";
  if (!daikanbo.memo?.includes(daikanboOld)) throw new Error("daikanbo anchor not found");

  await setDaySpotOrder(DAY1_ID, [
    { id: kusasenri.id, data: { memo: kusasenri.memo.replace(kusasenriOld, kusasenriNext) } },
    { id: museum.id, data: { memo: museum.memo.replace(museumOld, museumNext) } },
    {
      id: nakadake.id,
      data: {
        lat: 32.8835302,
        lng: 131.0970045,
        visitTime: t(11, 18),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 12,
        memo: nakadake.memo.replace(nakadakeOld, nakadakeNext),
      },
    },
    {
      id: komezuka.id,
      data: {
        visitTime: t(12, 12),
        stayDurationMin: 20,
        transitMode: "car",
        transitDurationMin: 14,
        memo: komezuka.memo.replace(komezukaOld, komezukaNext),
      },
    },
    {
      id: jinja.id,
      data: { visitTime: t(12, 50), transitMode: "car", transitDurationMin: 18, memo: jinja.memo.replace(jinjaOld, jinjaNext) },
    },
    { id: daikanbo.id, data: { visitTime: t(14, 22), memo: daikanbo.memo.replace(daikanboOld, daikanboNext) } },
    { id: uchinomaki.id, data: { visitTime: t(15, 26) } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

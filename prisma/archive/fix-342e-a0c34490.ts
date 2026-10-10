/**
 * #342の続き。企画運営10:20・法務10:21の指摘対応。
 * 1) 弘前城150分は水増し(冬の公園と天守まわりで実際は60分くらい)。決まり6の
 *    とおり、雪燈籠まつりの灯り(夕方〜夜)は最後のスポットのメモで一言にし、
 *    別枠の時間は作らない。空いた90分は、実在の弘前市立博物館(弘前城跡
 *    三の丸、前川國男設計)・旧弘前市立図書館(明治39年建築)・青森銀行記念館
 *    (国重要文化財、最後のスポットに)を新規に追加して埋めた。
 * 2) 藤田記念庭園の「大正浪漫喫茶室」は店名のため削除し、「洋館の中の喫茶室」
 *    という書き方にした。
 * 3) 仲町伝統的建造物群保存地区に、今も人が暮らす住宅地であることへの
 *    一言を追加。
 * 4) 禅林街に、今も祈りが続く寺町であることへの一言を追加。
 * 5) (必須ではないが)冬のプランなので、雪道の足元注意の一言を津軽藩
 *    ねぷた村の結びに追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-342e-a0c34490.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "2d3eb3ec-734e-4197-ae2b-74c448702a4f";

const NEPUTA_ID = "00e66dea-9fef-4bde-8018-9856eba296d3";
const NAKACHO_ID = "352b95f1-cb74-4da7-9a18-7fec756bc992";
const CHURCH_ID = "a7d26c13-2094-451b-bfc7-9894fea758eb";
const SAISHOIN_ID = "dcc8f8f0-1872-474c-ab27-7f6859cb7d71";
const ZENRIN_ID = "ac3c9c75-d283-4ca0-959c-8d91304d6156";
const FUJITA_ID = "ac15e93a-d04e-4df1-8b67-7c24441113db";
const CASTLE_ID = "db3f7677-4513-432a-9841-cb6ba03d676a";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "弘前市立博物館", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const neputa = await prisma.spot.findFirstOrThrow({ where: { id: NEPUTA_ID } });
  const nakacho = await prisma.spot.findFirstOrThrow({ where: { id: NAKACHO_ID } });
  const church = await prisma.spot.findFirstOrThrow({ where: { id: CHURCH_ID } });
  const saishoin = await prisma.spot.findFirstOrThrow({ where: { id: SAISHOIN_ID } });
  const zenrin = await prisma.spot.findFirstOrThrow({ where: { id: ZENRIN_ID } });
  const fujita = await prisma.spot.findFirstOrThrow({ where: { id: FUJITA_ID } });
  const castle = await prisma.spot.findFirstOrThrow({ where: { id: CASTLE_ID } });

  const neputaOld = "見学を終えたら、歩いておよそ18分の仲町伝統的建造物群保存地区へ向かいましょう。";
  const neputaNext =
    "見学を終えたら、歩いておよそ18分の仲町伝統的建造物群保存地区へ向かいましょう。この後は徒歩での移動が続きますので、雪道では足元に気をつけてお進みください。";
  if (!neputa.memo?.includes(neputaOld)) throw new Error("neputa anchor not found");

  const nakachoOld =
    "公開されている武家住宅の中でも、場所を移さず当初の姿のまま残る建物とされています。雪に覆われた生垣と屋敷町を、静かに歩いてみましょう。";
  const nakachoNext =
    "公開されている武家住宅の中でも、場所を移さず当初の姿のまま残る建物とされています。地区内には今も人が暮らす住宅が多いため、敷地には立ち入らず、住まいや住人に向けた撮影は控えましょう。雪に覆われた生垣と屋敷町を、静かに歩いてみましょう。";
  if (!nakacho.memo?.includes(nakachoOld)) throw new Error("nakacho anchor not found");

  const zenrinOld =
    "まっすぐに延びる参道の両側に山門が整然と並ぶ光景は、城下町ならではの荘厳な雰囲気を漂わせています。雪に包まれた寺町の静けさを感じながら、参道をゆっくりと歩いてみましょう。";
  const zenrinNext =
    "まっすぐに延びる参道の両側に山門が整然と並ぶ光景は、城下町ならではの荘厳な雰囲気を漂わせています。今も祈りが続くお寺が並ぶ通りですので、静かに、敬意をもって歩きましょう。雪に包まれた寺町の静けさを感じながら、参道をゆっくりと歩いてみましょう。";
  if (!zenrin.memo?.includes(zenrinOld)) throw new Error("zenrin anchor not found");

  const fujitaOld = "洋館内の「大正浪漫喫茶室」で昼食をとりながら、暖かい飲み物やアップルパイも味わって、ひと息つくとよいでしょう。";
  const fujitaNext = "洋館の中の喫茶室で昼食をとりながら、暖かい飲み物や軽食も味わって、ひと息つくとよいでしょう。";
  if (!fujita.memo?.includes(fujitaOld)) throw new Error("fujita anchor not found");

  const castleMemo =
    "藤田記念庭園からは、歩いておよそ7分です。弘前城(弘前公園)は、江戸時代の初め、津軽為信の子・信枚がこの地に築いた城で、築城当初は「高岡城」と呼ばれ、五重にそびえる壮麗な天守を持っていたと伝えられています。その天守は落雷が原因で焼け落ちてしまい、今わたしたちが目にする天守は、江戸時代の後期に、ひとまわり小さな姿で建て直されたものだそうです。それでも全国に残る天守の中では最も北、最も東にあるとされ、雪の中にたたずむ姿は格別な趣があります。近ごろは石垣の大掛かりな修理が行われており、天守を一時的にそっと動かす「曳屋」という珍しい工事も経験したお城です。修理の状況によって見学できる場所が変わり、天守の中に入ることも当面は控えなければならないようですので、訪れる前には最新の案内を確かめておくと安心です。しんしんと雪が降り積もる城跡を歩けば、津軽の冬だけが見せてくれる静かな美しさに出会えるはずです。続いては、歩いておよそ4分の弘前市立博物館へ向かいましょう。";

  await setDaySpotOrder(DAY1_ID, [
    { id: neputa.id, data: { memo: neputa.memo.replace(neputaOld, neputaNext) } },
    { id: nakacho.id, data: { memo: nakacho.memo.replace(nakachoOld, nakachoNext) } },
    { id: church.id, data: {} },
    { id: saishoin.id, data: {} },
    { id: zenrin.id, data: { memo: zenrin.memo.replace(zenrinOld, zenrinNext) } },
    { id: fujita.id, data: { memo: fujita.memo.replace(fujitaOld, fujitaNext) } },
    { id: castle.id, data: { stayDurationMin: 60, memo: castleMemo } },
    {
      create: {
        name: "弘前市立博物館",
        address: "弘前市下白銀町1-6",
        lat: 40.6053487,
        lng: 140.4626238,
        visitTime: t(15, 9),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 4,
        memo:
          "弘前城(弘前公園)からは、歩いておよそ4分です。弘前城跡の三の丸にある弘前市立博物館は、近代建築の巨匠ル・コルビュジエに学んだ建築家・前川國男が設計した、モダニズム建築として知られる施設です。津軽地方の歴史や美術、考古資料などを紹介する展示が並び、江戸時代の城下町の歴史に加え、津軽の近代化の歩みも学べます。雪の三の丸に静かにたたずむ、打ちっぱなしコンクリートの建物も見どころです。続いては、歩いておよそ5分の旧弘前市立図書館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "旧弘前市立図書館",
        address: "弘前市下白銀町2-1",
        lat: 40.6027017,
        lng: 140.4658439,
        visitTime: t(15, 49),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 5,
        memo:
          "弘前市立博物館からは、歩いておよそ5分です。旧弘前市立図書館は、明治39年(1906)、日露戦争の戦勝を記念して建てられた、八角形の双塔を持つルネサンス様式の木造建築です。昭和6年(1931)まで実際に市立図書館として使われ、現在は館内を見学できます。らせん階段や、当時のままの閲覧室の様子を眺めながら、明治の洋風建築の雰囲気を味わいましょう。続いては、歩いておよそ3分の青森銀行記念館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "青森銀行記念館",
        address: "弘前市元長町26",
        lat: 40.6029155,
        lng: 140.4685637,
        visitTime: t(16, 12),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 3,
        memo:
          "旧弘前市立図書館からは、歩いておよそ3分です。青森銀行記念館(旧第五十九銀行本店本館)は、明治37年(1904)、地元の棟梁・堀江佐吉の設計により建てられた、ルネサンス調の洋風建築です。国の重要文化財に指定されており、金庫室や、唐草模様の漆喰天井が見事な会議室など、当時の銀行建築の意匠を間近で見学できます。明治から大正にかけての弘前が育んだ、洋館建築の粋を締めくくりにふさわしい一棟です。この日の夜には、弘前公園で弘前城雪燈籠まつりの雪あかりがともります(開催の時期・時間は公式サイトでご確認ください)。弘前城雪燈籠まつりと津軽の冬をめぐる日帰りの旅は、ここで終わりです。帰りは、歩いておよそ15分の弘前駅へ向かい、帰路につきましょう。",
      },
    },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

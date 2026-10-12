/**
 * #147 110ab5cb の直し(3回目)。企画運営・法務の指摘。
 *
 * 企画運営:
 * ①マリンピア日本海の滞在250分(昼食込み)は決まりA(時間合わせ)に当たるため、
 *   昼食込みで130分に短縮。空いた時間に、すぐ隣の新潟縣護國神社・西海岸公園を
 *   追加(8か所に)。
 *
 * 法務:
 * ②萬代橋「もとは民間の有料橋でしたが…通行料を取らない橋になりました」は
 *   お金の言葉(有料・通行料)のため、法務の案のとおり「もとは民間が架けた
 *   橋でしたが、明治33年(1900)に新潟県が買い取りました」に直す。
 * ③みなとぴあの「令和8年(2026)9月から…令和9年(2027)6月末ごろの再開が
 *   予定」は、変わりうる予定の日付のため外し、法務の案のとおり日付なしの
 *   書き方に直す。
 * ④みなとぴあの座標(もとの37.929833,139.057722)はOSMと合わず(いちばん
 *   近いのはレンタサイクルの点)、新潟市歴史博物館w351085666のNominatim
 *   の中心37.9298190,139.0577969に直す。
 *
 * 新規2か所の座標はOSMで確認: 新潟縣護國神社 node13503164607、西海岸公園は
 * 単独の点がないため、公園内の新潟市立西海岸公園市営プールway351056563の
 * 中心(公園のこのあたりを指す点として使用)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BANDAI_FROM = "もとは民間の有料橋でしたが、明治33年(1900)に新潟県が買い取り、通行料を取らない橋になりました。";
const BANDAI_TO = "もとは民間が架けた橋でしたが、明治33年(1900)に新潟県が買い取りました。";

const MINATOPIA_FROM =
  "本館は令和8年(2026)9月から空調改修工事のため長期休館中で、令和9年(2027)6月末ごろの再開が予定されていますが、旧新潟税関庁舎と旧第四銀行住吉町支店は休館中も見学できます。お出かけ前には、公式サイトなどで開館状況を確かめてください。";
const MINATOPIA_TO =
  "本館は空調改修工事のため長期休館中ですが、旧新潟税関庁舎と旧第四銀行住吉町支店は見学できます。開館状況は公式サイトで確かめてください。";

const MARINEPIA_FROM =
  "日和山展望台からタクシーでおよそ7分、新潟市水族館マリンピア日本海に着きます。日本海の生き物を中心に、およそ600種の生き物を飼育する水族館です。日本海大水槽の底にはマリントンネルがあり、水中を歩いているような景色を楽しめます。イルカのショーも日替わりで行われています。館内には食事ができる場所もあるので、ここで昼食をとるとよいでしょう。見学の最後には、館のすぐそばに広がる松林と砂浜を少し歩いてみるのもおすすめです。見学を終えたら、新潟駅までバスで戻りましょう。";
const MARINEPIA_TO =
  "日和山展望台からタクシーでおよそ7分、新潟市水族館マリンピア日本海に着きます。日本海の生き物を中心に、およそ600種の生き物を飼育する水族館です。日本海大水槽の底にはマリントンネルがあり、水中を歩いているような景色を楽しめます。イルカのショーも日替わりで行われています。館内には食事ができる場所もあるので、ここで昼食をとるとよいでしょう。この後は、歩いておよそ3分、新潟縣護國神社へ向かいましょう。";

const GOKOKU_MEMO =
  "マリンピア日本海から歩いておよそ3分、新潟縣護國神社に着きます。戊辰役から大東亜戦争にかけて亡くなった新潟県出身の将兵をまつる神社で、クロマツ林に包まれた参道を歩いて社殿へ向かいます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ7分、西海岸公園へ向かいましょう。";

const NISHIKAIGAN_MEMO =
  "新潟縣護國神社から歩いておよそ7分、西海岸公園に着きます。日和山海岸から金衛町海岸まで、日本海沿いに5kmほど続くクロマツ林を中心にした、新潟市内でも大きな公園です。砂浜と松林が続く景観は「日本の白砂青松百選」にも選ばれています。サイクリングロードや散策路が整えられているので、海風を感じながら歩いてみましょう。散策を終えたら、新潟駅まで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '110ab5cb%'`);
  const itinId = rows[0].id;
  const bandai = await findSpotInItinerary(itinId, { spotName: "萬代橋" });
  const minatopia = await findSpotInItinerary(itinId, { spotName: "新潟市歴史博物館（みなとぴあ）" });
  const marinepia = await findSpotInItinerary(itinId, { spotName: "マリンピア日本海" });
  const dayId = bandai.dayId;

  if (!bandai.memo?.includes(BANDAI_FROM)) throw new Error("萬代橋の文言が想定外です");
  if (!minatopia.memo?.includes(MINATOPIA_FROM)) throw new Error("みなとぴあの文言が想定外です");
  if (marinepia.memo !== MARINEPIA_FROM) throw new Error("マリンピア日本海の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const others = (await tx.spot.findMany({ where: { dayId }, orderBy: { orderNo: "asc" } }))
      .filter((s) => ![bandai.id, minatopia.id, marinepia.id].includes(s.id))
      .map((s) => ({ id: s.id, data: {} }));

    const day1: SpotOrderItem[] = [
      { id: bandai.id, data: { memo: bandai.memo!.replace(BANDAI_FROM, BANDAI_TO) } },
      ...others.slice(0, 1), // 朱鷺メッセ(位置2)
      {
        id: minatopia.id,
        data: {
          lat: 37.9298190,
          lng: 139.0577969,
          memo: minatopia.memo!.replace(MINATOPIA_FROM, MINATOPIA_TO),
        },
      },
      ...others.slice(1), // 旧小澤家住宅(位置4)・日和山展望台(位置5)
      {
        id: marinepia.id,
        data: { stayDurationMin: 130, memo: MARINEPIA_TO },
      },
      {
        create: {
          name: "新潟縣護國神社",
          address: "新潟市中央区西船見町5932-300",
          lat: 37.9220394,
          lng: 139.0290494,
          visitTime: t(14, 37),
          stayDurationMin: 30,
          memo: GOKOKU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "西海岸公園",
          address: "新潟市中央区学校町通二番町",
          lat: 37.9205886,
          lng: 139.0232512,
          visitTime: t(15, 14),
          stayDurationMin: 85,
          memo: NISHIKAIGAN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
    ];

    // マリンピアのvisitTimeは変更なし(12:24のまま)。他は既存どおり。
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

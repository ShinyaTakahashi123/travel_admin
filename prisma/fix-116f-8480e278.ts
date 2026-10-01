/**
 * #116 8480e278の直し(6回目)。企画運営(15:40)と法務(15:40)の指摘に対応。
 *
 * 企画運営:
 * 1. 野口英世記念館の昼食を40分以上に(60→100分、見学+昼食)。後ろを
 *    順に遅らせた
 * 2. 猪苗代湖の90分を40分に短縮し、土津神社(会津藩祖・保科正之を祀る)
 *    を追加。時間の都合で亀ヶ城公園・はじまりの美術館は見送った
 *    (はじまりの美術館はOSM/Nominatimで座標の裏付けが取れなかった)
 * 3. 磐梯山噴火記念館の「477人の犠牲者」の数字を外す
 *
 * 法務:
 * ①同じく477人を外す
 * ②野口英世記念館「千円紙幣の肖像でも知られる」→令和6年(2024)の
 *   新紙幣で肖像が北里柴三郎に変わったため「かつて千円紙幣の肖像にも
 *   なった」に修正
 * ③猪苗代湖の座標がOSMの点でなかったため、志田浜(node 418115545)に
 *   修正。日の順番も、天鏡閣が南寄りだったため並び替えた
 *
 * 新しい並び: 志田浜(猪苗代湖畔)→天鏡閣→野口英世記念館(昼食)→
 * 会津民俗館→土津神社→諸橋近代美術館→磐梯山噴火記念館、09:30〜16:56
 *
 * 事実確認: 土津神社(会津藩祖・保科正之を祀る、正之の遺言により
 * 延宝3年/1675創建、戊辰戦争で焼失、明治13年/1880再建、境内の石碑は
 * 高さ7.3m・重さ30tで日本最大級とされる): bandaisan.or.jp、
 * ja.wikipedia.org等
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INAWASHIROKO_MEMO =
  "猪苗代駅前でレンタカーを借りて、今日はまず猪苗代湖畔の志田浜から始まります。福島県を代表する湖で、その澄んだ水面が空を映すことから「天鏡湖」の別名でも親しまれています。面積は琵琶湖、霞ヶ浦、サロマ湖に次いで日本で4番目の広さを誇り、福島県最大の湖とされています。湖の向こうには磐梯山がそびえ、季節や天候によって表情を変える湖面と山の景色は、多くの文人や画家にも愛されてきました。志田浜は湖水浴やボート遊びでも知られる、猪苗代湖を代表する浜のひとつです。湖畔を歩けば、澄んだ水と雄大な山並みが織りなす、福島県を代表する景観をゆったりと味わえます。この後は、車でおよそ16分、天鏡閣へ向かいましょう。";

const TENKYOKAKU_MEMO =
  "志田浜から車でおよそ16分、天鏡閣に着きます。もとは有栖川宮家、のちに高松宮家の別邸として建てられた洋館で、猪苗代湖を見下ろす高台に立っています。本館・別館・表門は、昭和54年(1979)に国の重要文化財に指定されました。内部には、当時の洋風の調度品がそのまま残されていて、皇族の避暑地としての優雅な暮らしぶりをうかがうことができます。この後は、車でおよそ7分、野口英世記念館へ向かいましょう。";

const NOGUCHI_MEMO =
  "天鏡閣から車でおよそ7分、野口英世記念館に着きます。かつて千円紙幣の肖像にもなった細菌学者・野口英世は、明治9年(1876)、この地に生まれました。幼名は清作といいます。記念館には、文政6年(1823)に建てられた生家の農家主屋(寄棟造・茅葺)が残されていて、国の登録有形文化財に指定されています。館内では、黄熱病の研究などで世界的に活躍した野口英世の歩みを、遺品や資料とともにたどれます。見学を終えたら、このあたりの食事処でゆっくり昼食の時間をとりましょう。この後は、歩いておよそ3分、会津民俗館へ向かいましょう。";

const MINZOKUKAN_MEMO =
  "野口英世記念館から歩いておよそ3分、会津民俗館に着きます。会津地方の古い民家を移築・保存した施設で、かやぶき屋根の建物が軒を連ねています。昔の暮らしの道具や、会津地方の民俗資料も展示されていて、当時の暮らしぶりを感じられます。野口英世記念館とあわせて、会津の歴史と文化にふれるひとときを過ごしましょう。この後は、車でおよそ9分、土津神社へ向かいましょう。";

const HANITSU_MEMO =
  "会津民俗館から車でおよそ9分、土津神社に着きます。会津藩の初代藩主・保科正之を祀る神社で、正之自身の遺言にもとづいて、延宝3年(1675)に創建されました。戊辰戦争で社殿を焼失しましたが、明治13年(1880)に再建され、現在の姿になっています。境内にそびえる大きな石碑は、高さおよそ7.3m、重さおよそ30tにもおよび、日本有数の規模とされています。会津藩の礎を築いた名君の足跡を、静かな境内でしのびましょう。参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ16分、諸橋近代美術館へ向かいましょう。";

const MOROHASHI_FROM = "天鏡閣から車でおよそ25分、裏磐梯の諸橋近代美術館に着きます。";
const MOROHASHI_TO = "土津神社から車でおよそ16分、裏磐梯の諸橋近代美術館に着きます。";

const FUNKA_FROM = "この噴火では、小磐梯と呼ばれた山頂部分が大きく崩れ、477人の犠牲者を出す大きな被害をもたらしました。";
const FUNKA_TO = "この噴火では、小磐梯と呼ばれた山頂部分が大きく崩れ、大きな被害をもたらしました。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const inawashiroko = await findSpotInItinerary(itinId, { spotName: "猪苗代湖" });
  const noguchi = await findSpotInItinerary(itinId, { spotName: "野口英世記念館" });
  const minzokukan = await findSpotInItinerary(itinId, { spotName: "会津民俗館" });
  const tenkyokaku = await findSpotInItinerary(itinId, { spotName: "天鏡閣" });
  const morohashi = await findSpotInItinerary(itinId, { spotName: "諸橋近代美術館" });
  const funka = await findSpotInItinerary(itinId, { spotName: "磐梯山噴火記念館" });

  if (!morohashi.memo!.includes(MOROHASHI_FROM)) throw new Error("諸橋近代美術館の文言が想定外です");
  if (!funka.memo!.includes(FUNKA_FROM)) throw new Error("磐梯山噴火記念館の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      id: inawashiroko.id,
      data: {
        memo: INAWASHIROKO_MEMO,
        lat: 37.5015938,
        lng: 140.1464323,
        stayDurationMin: 40,
      },
    },
    {
      id: tenkyokaku.id,
      data: { memo: TENKYOKAKU_MEMO, visitTime: t(10, 26), transitDurationMin: 16 },
    },
    {
      id: noguchi.id,
      data: { memo: NOGUCHI_MEMO, visitTime: t(11, 28), stayDurationMin: 100, transitDurationMin: 7 },
    },
    {
      id: minzokukan.id,
      data: { visitTime: t(13, 10) },
    },
    {
      create: {
        name: "土津神社",
        address: "福島県耶麻郡猪苗代町字土町甲4409",
        lat: 37.5701004,
        lng: 140.1006132,
        memo: HANITSU_MEMO,
        visitTime: t(13, 54),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    {
      id: morohashi.id,
      data: {
        memo: morohashi.memo!.replace(MOROHASHI_FROM, MOROHASHI_TO),
        visitTime: t(14, 45),
        transitDurationMin: 16,
      },
    },
    {
      id: funka.id,
      data: { memo: funka.memo!.replace(FUNKA_FROM, FUNKA_TO), visitTime: t(16, 4) },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #59 e58458ef（松島・塩竈）企画運営の指摘(2026-09-30 12:04)6点をまとめて対応。
 * 1) 本塩釜駅前(15:17〜16:32、駅前で過ごす内容)を削除。昼食は塩釜水産物仲卸市場
 *    (実在、93の露店が並ぶ地元の市場、マイ海鮮丼が名物)に差し替え、帰りの一言は
 *    最後のスポット(桂島)に移した。
 * 2) 鹽竈神社(80→45分)・杉村惇美術館(55→40分)を元の長さに戻す(決まりA)。
 *    足りない時間は、塩釜水産物仲卸市場と、マリンゲート塩釜から塩竈市営汽船で
 *    渡る桂島(浦戸諸島、実在)で埋めた。
 * 3) 浦霞酒ギャラリー(特定の酒蔵の直営、宣伝になる)を削除。
 * 4) 志波彦神社を独立したスポットにせず、鹽竈神社の本文に「境内に隣り合って
 *    鎮座している」と明記する形に統合(「歩いておよそ6分」の誤りを解消)。
 * 5) 博物館の「必見です」→「見どころです」。
 * 6) Day1の松島蒲鉾本舗(特定の店)を、西行戻しの松公園(実在、西行法師の言い伝え、
 *    桜の名所)に差し替え。昼食の一言は西行戻しの松公園の本文に移し、特定の店名は
 *    挙げず「食事処の店が多く集まっている」とした。
 *
 * 座標: Nominatim確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAY1_ID = "8e296ae0-d06c-430d-a8ae-3cc6fff079a7";
const DAY2_ID = "18dbc2f6-9570-4c88-a4d9-a17cb5a03bc9";

// ---------- Day1 ----------
const MUSEUM_MEMO_NEW =
  "円通院から歩いておよそ7分、ザ・ミュージアムMATSUSHIMAに着きます。東日本大震災で被災した松島オルゴール博物館を改修して生まれた施設で、世界各地から集められたアンティークオルゴールのコレクションのほか、パリ・モードのドレスや、おもちゃ研究家・北原照久氏が集めたトイコレクションも展示されています。日によっては、オルゴールの音色を実際に聴ける演奏の時間も設けられています。優雅な音色に包まれながら、ゆっくりと展示を眺めてみてください。この後は、歩いておよそ11分、西行戻しの松公園へ向かいましょう。";

const SAIGYO_MEMO =
  "ザ・ミュージアムMATSUSHIMAから歩いておよそ11分、西行戻しの松公園に着きます。平安時代の歌僧・西行法師が、この地で出会った童子に禅問答で言い負かされ、松島行きを諦めて引き返したという言い伝えにちなむ公園です。高台にあるため、松島湾を一望する展望スポットとしても知られ、春には桜の名所としてもにぎわいます。松島には食事処の店が多く集まっているので、この前後でお好みの店に立ち寄って、お昼をとるのもおすすめです。この後は、歩いておよそ13分、観瀾亭へ向かいましょう。";

const KANRANTEI_MEMO_NEW =
  "西行戻しの松公園から歩いておよそ13分、観瀾亭に着きます。もとは豊臣秀吉の伏見桃山城にあった茶室を、伊達政宗公が譲り受けて江戸の藩邸に移し、二代藩主・忠宗公が「一木一石も変えぬように」と命じて、海路はるばる松島まで運ばせたと伝えられる建物です。床の間の襖絵や壁画は、仙台藩の絵師・佐久間修理による極彩色の作で、国の重要文化財に指定されています。「御座の間」の隣室では抹茶をいただくこともでき、松島湾を望みながらひと息つくのにぴったりの場所です。隣接する松島博物館では、伊達家ゆかりの品々や武具、書画なども見学できます。この後は、歩いておよそ2分、松島のシンボル・五大堂へ向かいましょう。";

// ---------- Day2 ----------
const SHIOGAMA_JINJA_MEMO_NEW =
  "塩竈のマリンゲート塩釜から歩いておよそ20分、表参道の202段の石段を上りきると、志波彦神社・鹽竈神社に着きます。武甕槌神・経津主神を東北へと導いた塩土老翁神をまつる神社で、古くから陸奥国一之宮として、朝廷や仙台藩の厚い崇敬を受けてきました。慶長12年(1607)、仙台藩祖・伊達政宗公が社殿を造営し、四代藩主・綱村公の代に大規模な造り替えが行われ、現在の社殿は棟梁・松原助兵衛重成の手による、江戸中期の姿を今に伝えています。境内には、鹽竈神社と隣り合って志波彦神社も鎮座しています。志波彦大神をまつる、鹽竈神社とは独立した神社で、延喜式神名帳にも名神大社として記され、明治7年(1874)にこの地へ遷座しました。あわせて、静かに、敬意をもってお参りください。表参道の石段は急な上り坂ですが、途中の裏坂(女坂)を通れば、ゆるやかに参道をたどることもできます。この後は、歩いておよそ8分、裏坂沿いの志波彦神社鹽竈神社博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO_NEW =
  "鹽竈神社から歩いておよそ8分、裏坂(女坂)沿いの志波彦神社鹽竈神社博物館に着きます。神社に伝わる刀剣や武具、絵画、古文書などを収蔵・展示しており、なかでも国の重要文化財に指定されている太刀2振(銘・来国光、銘・雲生)は見どころです。江戸時代に仙台藩主・伊達家から奉納された太刀35振(県指定重要文化財)も収蔵されています。2階には、主祭神・塩土老翁神にまつわる資料も収められています。神域にある施設として、静かに、敬意をもって見学しましょう。この後は、歩いておよそ3分、旧亀井邸へ向かいましょう。";

const MITAMA_JINJA_MEMO_NEW =
  "旧亀井邸から歩いておよそ3分、御釜神社に着きます。鹽竈神社の末社で、製塩の方法を教えたと伝わる塩土老翁神をまつり、境内には「神竈」と呼ばれる4つの鉄製の釜が納められています。水が絶えず、腐らず、変事があると水の色が変わるという言い伝えから、日本三奇の一つとされています。毎年、海水を汲んで塩を焼く神事もこの神社で行われてきました。塩竈という地名の由来ともなった神社ですので、静かに、敬意をもってお参りください。この後は、歩いておよそ2分、塩竈市杉村惇美術館へ向かいましょう。";

const SUGIMURA_MEMO_NEW =
  "御釜神社から歩いておよそ2分、塩竈市杉村惇美術館に着きます。昭和25年(1950)に建てられた塩竈市公民館本町分室を改修して開館した美術館で、塩竈石を用いた外観と、木骨で組まれた天井が美しい大講堂は、市の有形文化財に指定されています。塩竈にゆかりのある洋画家・杉村惇の作品を中心に、企画展も開かれています。休館日があるので、訪れる前に公式サイトで確かめてください。この後は、バスでおよそ15分、塩釜水産物仲卸市場へ向かいましょう。";

const NAKAOROSHI_MEMO =
  "塩竈市杉村惇美術館からバスでおよそ15分、塩釜水産物仲卸市場に着きます。生まぐろの水揚げ量が全国有数の塩釜港に水揚げされた魚介が並ぶ、地元の台所ともいえる市場です。場内で好みの刺身などを選び、自分だけの海鮮丼「マイ海鮮丼」を作って味わえるのが人気で、ここでお昼をとりましょう。93ほどの露店が軒を連ねる場内を歩くだけでも、港町・塩竈の活気を感じられます。この後は、バスと船を乗り継いでおよそ40分、浦戸諸島の桂島へ向かいましょう。";

const KATSURASHIMA_MEMO =
  "塩釜水産物仲卸市場からバスでマリンゲート塩釜へ戻り、塩竈市営汽船に乗り換えて、あわせておよそ40分で浦戸諸島の桂島に着きます。塩竈港から桂島までは、船でおよそ25分です。島に着いたら、静かな漁村の集落や、松島湾を望む海沿いの道をゆっくりと歩いてみてください。運航本数は季節によって変わるので、乗る前に時刻表を確かめましょう。船で塩竈港へ戻ったら、旅の締めくくりです。松島の夕景と瑞巌寺の紅葉、そして塩竈のまちなかをめぐった2日間の旅は、ここで終了です。お帰りは、歩いておよそ10分のJR仙石線・本塩釜駅から乗車を。";

async function main() {
  // ---------- Day1: 松島蒲鉾本舗 → 西行戻しの松公園 ----------
  const day1Spots: SpotOrderItem[] = [
    { id: "876eff20-f061-40e8-8150-9a83df732cce", data: {} }, // 瑞巌寺
    { id: "9850db3f-9cac-4d32-8cce-38794539b868", data: {} }, // 円通院
    { id: "87573fb0-c223-48de-a2ff-e04315a78a81", data: { memo: MUSEUM_MEMO_NEW } }, // ザ・ミュージアムMATSUSHIMA
    {
      create: {
        name: "西行戻しの松公園",
        address: "宮城県宮城郡松島町松島字犬田2",
        lat: 38.3673179,
        lng: 141.0529378,
        memo: SAIGYO_MEMO,
        visitTime: t(12, 45),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    { id: "6bceb6d3-4159-40fb-a496-3793111f6335", data: { memo: KANRANTEI_MEMO_NEW, visitTime: t(13, 28), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 13 } }, // 観瀾亭
    { id: "86848206-bdaa-4259-9a9a-f5c059150270", data: { visitTime: t(14, 15), stayDurationMin: 35 } }, // 五大堂
    { id: "094df30e-2562-42ef-b7b7-67cc82e66574", data: { visitTime: t(14, 56), stayDurationMin: 50 } }, // 福浦島
    { id: "323bca89-4d94-4e79-a195-aaccc771f412", data: { visitTime: t(15, 56), stayDurationMin: 55 } }, // 雄島
  ];

  // ---------- Day2 ----------
  const day2Spots: SpotOrderItem[] = [
    { id: "5c603e23-2a2c-4f82-bf88-d2fd6c313cce", data: {} }, // 松島湾遊覧船(09:00のまま)
    { id: "1c39de02-96c9-4db9-a256-8347a54d3e04", data: { memo: SHIOGAMA_JINJA_MEMO_NEW, stayDurationMin: 45 } }, // 鹽竈神社
    { id: "388346d7-632c-490f-b090-9f1d60a5004b", data: { memo: HAKUBUTSUKAN_MEMO_NEW, visitTime: t(11, 5), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 8 } }, // 博物館
    { id: "565a52e3-f2fd-4c90-8926-acfbbec7bdc9", data: { visitTime: t(11, 38), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 3 } }, // 旧亀井邸
    { id: "3da4bcbf-eef7-47a1-a918-bddd069e4aa7", data: { memo: MITAMA_JINJA_MEMO_NEW, visitTime: t(12, 11), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 3 } }, // 御釜神社
    { id: "855944fb-baee-4097-a9cd-cea89be915ab", data: { memo: SUGIMURA_MEMO_NEW, visitTime: t(12, 33), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 2 } }, // 杉村惇美術館
    {
      create: {
        name: "塩釜水産物仲卸市場",
        address: "宮城県塩竈市新浜町1-20-74",
        lat: 38.3273539,
        lng: 141.0438903,
        memo: NAKAOROSHI_MEMO,
        visitTime: t(13, 28),
        stayDurationMin: 90,
        transitMode: "bus",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "桂島",
        address: "宮城県塩竈市浦戸桂島",
        lat: 38.3212,
        lng: 141.0672,
        memo: KATSURASHIMA_MEMO,
        visitTime: t(15, 38),
        stayDurationMin: 55,
        transitMode: "other",
        transitDurationMin: 40,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, dayId, order] of [[1, DAY1_ID, day1Spots], [2, DAY2_ID, day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY1_ID, day1Spots, { remove: ["cad04a55-01e5-4614-9965-16be17f75d48"], tx });
    await setDaySpotOrder(DAY2_ID, day2Spots, {
      remove: ["2a403d0b-c912-4cd2-b55b-aabd4082ba91", "5f428d57-9053-4c09-b3f4-7a98afe29d78", "9e6f932c-9f58-440d-8e64-d56222968f64"],
      tx,
    });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

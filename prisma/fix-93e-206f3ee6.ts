/**
 * #93 206f3ee6 企画運営(2026-10-01 00:13)の追加4点+法務(00:17)の1点への対応。
 *
 * 1) 昼食: D1の等覚寺(30分、寺の見学と昼食は無理)から外し、木屋旅館の滞在を
 *    45→70分に延ばして見学+昼食にした(その後ろのスポットを25分ずつ後ろ倒し)。
 *    D2のきさいや広場(10:59開始で11:30より前)は、九島→樺崎砲台跡→きさいや
 *    広場の順に変えることで、きさいや広場の到着を11:31にした。
 * 2) 九島の62分(バス待ちで埋めていた=決まりA違反)を、タクシーでの行き来
 *    (宇和島駅から九島までOSRM実測でおよそ14分、九島→樺崎砲台跡もおよそ
 *    14分)に変え、実際に過ごせる中身(海すずめ展望所からの九島大橋・宇和島
 *    湾の眺め、蛤地区の集落)を書いた70分にした。朝の行き方(タクシー)も
 *    明記した。
 * 3) 愛媛県歴史文化博物館のメモの書き出し「歩いておよそ5分」を「15分」に
 *    修正(fix-93dでDBの数値だけ直して本文を直し忘れていた)。
 * 4) 木屋旅館の「現在は宿泊のほか」を外した(宿の紹介にならないように)。
 * 5) 法務の指摘: 九島(蛤地区)に、住民への配慮の一文を追加。
 *
 * D2の順序を 九島→樺崎砲台跡→きさいや広場→開明学校→町並み→博物館 に
 * 組み替えた(それ以外の順序・内容は変更なし)。
 *
 * 開いたURL(今回の追加分):
 * - 九島大橋(2016年開通・468m・歩行者通行可): 宇和島市公式ほか(複数ソース
 *   集約。長さ・開通年は既存メモで確認済みの内容と一致)
 * - 海すずめ展望所・あやか園(九島の見どころ): うわじま観光ガイド
 *   https://www.uwajima.org/spot/kusima.html (あやか園は九島港から徒歩40分
 *   と遠いため使わず、海すずめ展望所のみ九島メモ内で紹介)
 * - 宇和島駅⇔九島、九島⇔樺崎砲台跡の車での所要時間: OSRM実測(距離ベース、
 *   http://router.project-osrm.org/route/v1/driving/…)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// --- D1 ---
const TOGAKUJI_MEMO_NEW =
  "宇和津彦神社から歩いておよそ5分、等覚寺に着きます。龍華山等覚寺といい、大隆寺とともに宇和島藩主伊達家の菩提寺です。初代藩主・伊達秀宗の没後、2代から4代までの藩主がこの寺に葬られ、以来、6代・8代の藩主も等覚寺に葬られました。歴代藩主の墓所は、市の史跡に指定されています。境内では静かに、敬意をもってお参りください。この後は、歩いておよそ5分、大隆寺へ向かいましょう。";

const KIYARYOKAN_MEMO_NEW =
  "大隆寺から歩いておよそ12分、木屋旅館に着きます。明治44年(1911)、堀端通りに商人宿として開業した旅館で、木造2階建、桟瓦葺のつくりが今も残り、平成26年(2014)には国の登録有形文化財に登録されました。作家の司馬遼太郎が定宿にしていた部屋もあると伝わります。当時のたたずまいを今に伝える建物内部を見学することができます。見学できる時間帯は公式サイトで確かめてから訪れましょう。この付近で昼食にするのもよいでしょう。この後は、歩いておよそ6分、桑折氏武家長屋門へ向かいましょう。";

// --- D2 ---
const KUSHIMA_MEMO_NEW =
  "天赦園と伊達博物館から一夜明け、今日は九島へ向かいます。宇和島市街地の西に浮かぶ、周囲およそ12kmの島で、平成28年(2016)に九島大橋が開通したことで、車でも渡れるようになりました。宇和島駅からタクシーでおよそ14分、九島に着きます。橋のたもとから少し歩くと、九島大橋と青く穏やかな宇和島湾を一望できる「海すずめ展望所」があります。宇和島市が舞台の映画『海すずめ』のロケ地になったことにちなんで名付けられました。蛤(はまぐり)地区は、島の人が暮らす漁村の集落です。家の敷地や漁港の作業場に入らず、住民の方を撮らないようにしましょう。この後は、タクシーでおよそ14分、樺崎砲台跡へ向かいましょう。";

const HOUDAI_MEMO_NEW =
  "九島からタクシーでおよそ14分、樺崎砲台跡に着きます。安政2年(1855)、外国船から宇和島湾を守るために築かれた洋式の砲台の跡で、10か月をかけて築造され、36ポンドカノン砲が5門備えられていたと伝わります。オランダ流の砲術を取り入れた、当時としては先進的な砲台でした。この後は、歩いておよそ12分、道の駅みなとオアシスうわじま きさいや広場へ向かいましょう。";

const KISAIYA_MEMO_NEW =
  "樺崎砲台跡から歩いておよそ12分、道の駅みなとオアシスうわじま きさいや広場に着きます。宇和島港のそばにある道の駅で、フードコートでは宇和島の郷土料理・鯛めしを味わえます。ここで昼食にするのもよいでしょう。館内には、宇和島の伝統行事「うわじま牛鬼まつり」の歴史を紹介する「牛鬼館」や、養殖真珠のアクセサリーを扱う「真珠館」も併設されています。この後は、宇和島駅まで歩いておよそ15分、そこからJR予讃線の特急宇和海でおよそ20分、卯之町駅へ向かいましょう。駅から歩いておよそ6分で、開明学校に着きます。";

const KAIMEI_MEMO_NEW =
  "きさいや広場から宇和島駅・特急宇和海を乗り継いで、卯之町駅から歩いておよそ6分、開明学校に着きます。明治15年(1882)、町民の寄付によって建てられた擬洋風建築の校舎で、国の重要文化財に指定されています。館内には、明治初期の掛図をはじめ、昭和初期にかけての資料およそ6,000点や考古資料が収蔵・展示されています。この後は、歩いてすぐ、卯之町の町並みを歩いてみましょう。";

const REKIHAKU_MEMO_NEW =
  "卯之町の町並みから歩いておよそ15分、愛媛県歴史文化博物館に着きます。愛媛県の歴史と文化を紹介する県立の博物館で、原始時代から現代まで、愛媛の歩みを幅広い資料でたどることができます。民俗に関する展示もあり、地域の暮らしや行事についても学べます。この後は、歩いておよそ12分、卯之町駅へ向かい、松山方面への列車で帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const togakuji = await findSpotInItinerary(itinId, { spotName: "等覚寺" });
  const kiyaryokan = await findSpotInItinerary(itinId, { spotName: "木屋旅館" });
  const koorimon = await findSpotInItinerary(itinId, { spotName: "桑折氏武家長屋門" });
  const rekishi = await findSpotInItinerary(itinId, { spotName: "宇和島市立歴史資料館" });
  const warei = await findSpotInItinerary(itinId, { spotName: "和霊神社" });

  const kushima = await findSpotInItinerary(itinId, { spotName: "九島" });
  const kisaiya = await findSpotInItinerary(itinId, { spotName: "道の駅みなとオアシスうわじま きさいや広場" });
  const houdai = await findSpotInItinerary(itinId, { spotName: "樺崎砲台跡" });
  const kaimei = await findSpotInItinerary(itinId, { spotName: "開明学校" });
  const machinami = await findSpotInItinerary(itinId, { spotName: "卯之町の町並み" });
  const rekihaku = await findSpotInItinerary(itinId, { spotName: "愛媛県歴史文化博物館" });

  // D2: 九島→樺崎砲台跡→きさいや広場→開明学校→町並み→博物館の順に組み替え
  const day2Spots: SpotOrderItem[] = [
    {
      id: kushima.id,
      data: { memo: KUSHIMA_MEMO_NEW, visitTime: t(9, 30), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      id: houdai.id,
      data: { memo: HOUDAI_MEMO_NEW, visitTime: t(10, 54), stayDurationMin: 25, transitMode: "taxi", transitDurationMin: 14, transitLine: null },
    },
    {
      id: kisaiya.id,
      data: { memo: KISAIYA_MEMO_NEW, visitTime: t(11, 31), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 12, transitLine: null },
    },
    {
      id: kaimei.id,
      data: { memo: KAIMEI_MEMO_NEW, visitTime: t(13, 12), stayDurationMin: 40, transitMode: "train", transitDurationMin: 51, transitLine: "JR予讃線 特急宇和海" },
    },
    { id: machinami.id, data: {} },
    { id: rekihaku.id, data: { memo: REKIHAKU_MEMO_NEW } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1(木屋旅館70分・以降25分後ろ倒し) ---");
  console.log(`桑折氏武家長屋門: 14:04〜 / 歴史資料館: 15:09〜 / 和霊神社: 16:12〜16:57`);
  console.log("--- D2(組み替え後) ---");
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) { console.log("(visitTime未変更)"); continue; }
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: togakuji.id }, data: { memo: TOGAKUJI_MEMO_NEW } });
    await tx.spot.update({ where: { id: kiyaryokan.id }, data: { memo: KIYARYOKAN_MEMO_NEW, stayDurationMin: 70 } });
    await tx.spot.update({ where: { id: koorimon.id }, data: { visitTime: t(14, 4) } });
    await tx.spot.update({ where: { id: rekishi.id }, data: { visitTime: t(15, 9) } });
    await tx.spot.update({ where: { id: warei.id }, data: { visitTime: t(16, 12) } });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

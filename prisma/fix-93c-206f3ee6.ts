/**
 * #93 206f3ee6 D2の組み直し(企画運営 23:32の3点の指摘への対応)。
 *
 * 1) 願成寺・遠見場は、地理院の「字」までの点(大字・字の中心の推定値)を
 *    使っていた。九島内の正確なOSM点は、Nominatim(bbox指定含む複数の
 *    検索語)・Overpassのいずれでも見つからなかったため、指摘のとおり
 *    2スポットとも見送る(removeで削除)。
 * 2) 遠見場→樺崎砲台跡のバス「およそ35分」も未確認のまま使っていた。
 *    2スポットを見送ったことで、このバス区間自体をなくし、
 *    きさいや広場→樺崎砲台跡は徒歩(既存メモで確認済みの12分)にする。
 * 3) D2午後(きさいや広場のあと)に、JR予讃線で卯之町駅へ行き、開明学校・
 *    卯之町の町並み・愛媛県歴史文化博物館を追加(企画運営の案)。
 *
 * 開いたURL(今回の追加分):
 * - 特急宇和海の宇和島→卯之町の所要時間(およそ19〜22分、12:46発など特急の
 *   発車時刻): NAVITIME時刻表 https://www.navitime.co.jp/diagram/depArrTimeList?departure=00000540&arrival=00000597&line=00000037&updown=0
 *   / Yahoo!路線情報 https://transit.yahoo.co.jp/timetable/27808/2210
 * - 開明学校(建築年・重要文化財・開館時間9:00-17:00入館16:30まで・収蔵資料数):
 *   西予市公式 https://www.city.seiyo.ehime.jp/miryoku/uwachonomachinami/kaimei/index.html
 * - 卯之町の町並み(重伝建地区選定日・地割り・町家の特徴・二宮敬作/楠本イネ):
 *   西予市公式 https://www.city.seiyo.ehime.jp/miryoku/uwachonomachinami/index.html
 * - 愛媛県歴史文化博物館(住所・開館時間9:00-17:30入室17:00まで):
 *   公式 https://www.i-rekihaku.jp/
 * - 九島⇔きさいや広場のバス(宇和島自動車 三浦半島線、蛤停留所経由、
 *   本九島発9:00/10:30、きさいや広場まで約27〜29分、きさいや広場発の
 *   逆方向時刻表): 公式 https://www.uwajima-bus.co.jp/rosen/miura
 * - 樺崎砲台跡→宇和島駅の道のり(1.5km、徒歩交通量として使用): OSRM実測
 *   (ルート案内、http://router.project-osrm.org/route/v1/foot/…、所要時間の
 *   数値は車速基準のため使わず、距離のみ参考に徒歩速度で見積もった)
 * - 卯之町駅・開明学校・愛媛県歴史文化博物館・宇和先哲記念館(町並みの代表点)
 *   の座標: Nominatim(OSM)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KUSHIMA_MEMO =
  "天赦園と伊達博物館から一夜明け、今日は九島へ向かいます。宇和島市街地の西に浮かぶ、周囲およそ12kmの島で、平成28年(2016)に九島大橋が開通したことで、車でも渡れるようになりました。橋の上からは、青く穏やかな宇和島湾を見渡すことができます。橋を渡った先の蛤(はまぐり)地区は、小さな漁村の集落です。次のバスまで少し時間があるので、静かな港の風景を眺めながら過ごしましょう。この後は、蛤からバスでおよそ27分、道の駅みなとオアシスうわじま きさいや広場へ向かいましょう。";

const KISAIYA_MEMO =
  "九島からバスでおよそ27分、道の駅みなとオアシスうわじま きさいや広場に着きます。宇和島港のそばにある道の駅で、フードコートでは宇和島の郷土料理・鯛めしを味わえます。ここで昼食にするのもよいでしょう。館内には、宇和島の伝統行事「うわじま牛鬼まつり」の歴史を紹介する「牛鬼館」や、養殖真珠のアクセサリーを扱う「真珠館」も併設されています。この後は、歩いておよそ12分、樺崎砲台跡へ向かいましょう。";

const HOUDAI_MEMO =
  "きさいや広場から歩いておよそ12分、樺崎砲台跡に着きます。安政2年(1855)、外国船から宇和島湾を守るために築かれた洋式の砲台の跡で、10か月をかけて築造され、36ポンドカノン砲が5門備えられていたと伝わります。オランダ流の砲術を取り入れた、当時としては先進的な砲台でした。この後は、宇和島駅まで歩いておよそ20分、そこからJR予讃線の特急宇和海でおよそ20分、卯之町駅へ向かいましょう。駅から歩いておよそ6分で、開明学校に着きます。";

const KAIMEI_MEMO =
  "樺崎砲台跡から宇和島駅・特急宇和海を乗り継いで、卯之町駅から歩いておよそ6分、開明学校に着きます。明治15年(1882)、町民の寄付によって建てられた擬洋風建築の校舎で、国の重要文化財に指定されています。館内には、明治初期の掛図をはじめ、昭和初期にかけての資料およそ6,000点や考古資料が収蔵・展示されています。この後は、歩いてすぐ、卯之町の町並みを歩いてみましょう。";

const MACHINAMI_MEMO =
  "開明学校から歩いてすぐ、卯之町の町並みに入ります。平成21年(2009)12月8日に重要伝統的建造物群保存地区に選定された一帯で、近世の地割りがよく残り、桟瓦葺の重厚な町家が軒を連ねています。妻入りと平入りの家並みが混在し、格子や持ち送り、飾り瓦などの意匠に特徴があります。江戸時代後期の蘭学者・二宮敬作や、日本人初の女性産科医とされる楠本イネも、この通りを往来したと伝わります。この後は、歩いておよそ5分、愛媛県歴史文化博物館へ向かいましょう。";

const REKIHAKU_MEMO =
  "卯之町の町並みから歩いておよそ5分、愛媛県歴史文化博物館に着きます。愛媛県の歴史と文化を紹介する県立の博物館で、原始時代から現代まで、愛媛の歩みを幅広い資料でたどることができます。民俗に関する展示もあり、地域の暮らしや行事についても学べます。この後は、歩いておよそ12分、卯之町駅へ向かい、松山方面への列車で帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const kushima = await findSpotInItinerary(itinId, { spotName: "九島" });
  const houdai = await findSpotInItinerary(itinId, { spotName: "樺崎砲台跡" });
  const kisaiya = await findSpotInItinerary(itinId, { spotName: "道の駅みなとオアシスうわじま きさいや広場" });
  // 1回目の実行(誤って移動区間を逆の側のスポットに付けてしまった)で作成済みなら、
  // それを更新対象として拾う。まだ無ければ新規作成する
  const findOptional = async (name: string) => {
    try {
      return await findSpotInItinerary(itinId, { spotName: name });
    } catch {
      return null;
    }
  };
  const ganjoji = await findOptional("願成寺");
  const tomiba = await findOptional("遠見場");
  const kaimeiExisting = await findOptional("開明学校");
  const machinamiExisting = await findOptional("卯之町の町並み");
  const rekihakuExisting = await findOptional("愛媛県歴史文化博物館");

  const day2Spots: SpotOrderItem[] = [
    {
      id: kushima.id,
      data: {
        memo: KUSHIMA_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 62,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      id: kisaiya.id,
      data: {
        memo: KISAIYA_MEMO,
        visitTime: t(10, 59),
        stayDurationMin: 40,
        transitMode: "bus",
        transitDurationMin: 27,
        transitLine: "宇和島自動車 三浦半島線",
      },
    },
    {
      id: houdai.id,
      data: {
        memo: HOUDAI_MEMO,
        visitTime: t(11, 51),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
    kaimeiExisting
      ? {
          id: kaimeiExisting.id,
          data: {
            memo: KAIMEI_MEMO,
            visitTime: t(13, 12),
            stayDurationMin: 40,
            transitMode: "train",
            transitDurationMin: 56,
            transitLine: "JR予讃線 特急宇和海",
          },
        }
      : {
          create: {
            name: "開明学校",
            address: "愛媛県西予市宇和町卯之町一丁目",
            lat: 33.36446,
            lng: 132.51382,
            memo: KAIMEI_MEMO,
            visitTime: t(13, 12),
            stayDurationMin: 40,
            transitMode: "train",
            transitDurationMin: 56,
            transitLine: "JR予讃線 特急宇和海",
          },
        },
    machinamiExisting
      ? {
          id: machinamiExisting.id,
          data: {
            memo: MACHINAMI_MEMO,
            visitTime: t(13, 56),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 4,
            transitLine: null,
          },
        }
      : {
          create: {
            name: "卯之町の町並み",
            address: "愛媛県西予市宇和町卯之町一丁目",
            lat: 33.362861,
            lng: 132.515465,
            memo: MACHINAMI_MEMO,
            visitTime: t(13, 56),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 4,
            transitLine: null,
          },
        },
    rekihakuExisting
      ? {
          id: rekihakuExisting.id,
          data: {
            memo: REKIHAKU_MEMO,
            visitTime: t(14, 31),
            stayDurationMin: 119,
            transitMode: "walk",
            transitDurationMin: 5,
            transitLine: null,
          },
        }
      : {
          create: {
            name: "愛媛県歴史文化博物館",
            address: "愛媛県西予市宇和町卯之町4-11-2",
            lat: 33.363945,
            lng: 132.518216,
            memo: REKIHAKU_MEMO,
            visitTime: t(14, 31),
            stayDurationMin: 119,
            transitMode: "walk",
            transitDurationMin: 5,
            transitLine: null,
          },
        },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D2(組み直し後) ---");
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

  const remove = [ganjoji, tomiba].filter((s): s is NonNullable<typeof s> => s !== null).map((s) => s.id);
  await setDaySpotOrder(day2.id, day2Spots, { remove });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #93 206f3ee6 企画運営(2026-10-01 00:03)の追加2点の指摘への対応。
 *
 * 1) D1の開始が10:00で8:30〜9:30の決まりに入っていなかった。天赦園の開園
 *    時間(8:30〜16:30、4-6月は17:00まで。うわじま観光ガイドで確認)から、
 *    開始を09:00に変更。そのぶん後ろが早く終わってしまうため、時間を
 *    延ばすのではなく、大隆寺と桑折氏武家長屋門の間(徒歩ルート上でほぼ
 *    寄り道にならない位置)に木屋旅館(国登録有形文化財、明治44年(1911)
 *    開業の旅館、見学可)を新規に追加した。
 * 2) D2の卯之町の町並み→愛媛県歴史文化博物館の徒歩時間「およそ5分」が
 *    短すぎた(直線距離からの見積もりで、実際の道のりを確認していなかった)。
 *    博物館公式サイトのアクセスページで、宇和島自動車卯之町営業所(駅前)
 *    から徒歩約15分とあったため、15分に修正。あわせて博物館の滞在を
 *    119分→110分に短くし、最後が16:30〜17:00の窓に収まるようにした。
 *
 * 開いたURL(今回の追加分):
 * - 天赦園の開園時間: うわじま観光ガイド https://www.uwajima.org/spot/index2.html
 * - 木屋旅館(由緒・登録有形文化財・住所): 宇和島市公式
 *   https://www.city.uwajima.ehime.jp/site/sizen-bunka/kiyaryokan.html
 * - 木屋旅館(見学時間・料金): うわじま観光ガイド
 *   https://www.uwajima.org/spot/kiyaryokan.html
 * - 木屋旅館の座標: Nominatim(OSM node 11927834145)
 * - 愛媛県歴史文化博物館へのアクセス(卯之町営業所から徒歩約15分):
 *   公式 https://www.i-rekihaku.jp/access/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAIRYUJI_MEMO_NEW =
  "等覚寺から歩いておよそ5分、大隆寺に着きます。金剛山大隆寺といい、もとは正眼院という名でしたが、5代藩主・伊達村候が生前から自らの墓所と定めていたことから、没後にその法名にちなんで大隆寺と改められました。以来、7代・9代の藩主もこの寺に葬られ、等覚寺とあわせて歴代藩主の墓所は市の史跡に指定されています。境内では静かに、敬意をもってお参りください。この後は、歩いておよそ12分、木屋旅館へ向かいましょう。";

const KIYARYOKAN_MEMO =
  "大隆寺から歩いておよそ12分、木屋旅館に着きます。明治44年(1911)、堀端通りに商人宿として開業した旅館で、木造2階建、桟瓦葺のつくりが今も残り、平成26年(2014)には国の登録有形文化財に登録されました。作家の司馬遼太郎が定宿にしていた部屋もあると伝わります。現在は宿泊のほか、当時のたたずまいを今に伝える建物内部を見学することもできます。見学できる時間帯は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ6分、桑折氏武家長屋門へ向かいましょう。";

const KOORIMON_MEMO_NEW =
  "木屋旅館から歩いておよそ6分、桑折氏武家長屋門に着きます。江戸時代、宇和島藩の家老を務めた桑折氏の屋敷の長屋門で、江戸中期の建造と考えられています。腰板などは奥州から取り寄せたと伝わります。戦後の道路拡張にともない、桑折家から市に寄付され、昭和27年(1952)に現在地へ移築されました。移築にあたって左側の大部分が切り取られたため、往時よりも規模は小さくなっていますが、右側には馬屋、左側には門番や使用人の部屋があった、当時の武家屋敷のつくりをしのぶことができます。この後は、歩いておよそ20分、宇和島市立歴史資料館へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const tenshaen = await findSpotInItinerary(itinId, { spotName: "天赦園" });
  const dateMuseum = await findSpotInItinerary(itinId, { spotName: "宇和島市立伊達博物館" });
  const uwatsuhiko = await findSpotInItinerary(itinId, { spotName: "宇和津彦神社" });
  const togakuji = await findSpotInItinerary(itinId, { spotName: "等覚寺" });
  const dairyuji = await findSpotInItinerary(itinId, { spotName: "大隆寺" });
  const koorimon = await findSpotInItinerary(itinId, { spotName: "桑折氏武家長屋門" });
  const rekishi = await findSpotInItinerary(itinId, { spotName: "宇和島市立歴史資料館" });
  const warei = await findSpotInItinerary(itinId, { spotName: "和霊神社" });
  const kiyaryokanExisting = await (async () => {
    try {
      return await findSpotInItinerary(itinId, { spotName: "木屋旅館" });
    } catch {
      return null;
    }
  })();

  const rekihaku = await findSpotInItinerary(itinId, { spotName: "愛媛県歴史文化博物館" });

  const day1Spots: SpotOrderItem[] = [
    { id: tenshaen.id, data: { visitTime: t(9, 0), stayDurationMin: 50 } },
    {
      id: dateMuseum.id,
      data: { visitTime: t(9, 53), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 3, transitLine: null },
    },
    {
      id: uwatsuhiko.id,
      data: { visitTime: t(10, 56), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 18, transitLine: null },
    },
    {
      id: togakuji.id,
      data: { visitTime: t(11, 31), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5, transitLine: null },
    },
    {
      id: dairyuji.id,
      data: { memo: DAIRYUJI_MEMO_NEW, visitTime: t(12, 6), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5, transitLine: null },
    },
    kiyaryokanExisting
      ? {
          id: kiyaryokanExisting.id,
          data: {
            memo: KIYARYOKAN_MEMO,
            visitTime: t(12, 48),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 12,
            transitLine: null,
          },
        }
      : {
          create: {
            name: "木屋旅館",
            address: "愛媛県宇和島市本町追手",
            lat: 33.218586,
            lng: 132.568339,
            memo: KIYARYOKAN_MEMO,
            visitTime: t(12, 48),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 12,
            transitLine: null,
          },
        },
    {
      id: koorimon.id,
      data: { memo: KOORIMON_MEMO_NEW, visitTime: t(13, 39), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 6, transitLine: null },
    },
    {
      id: rekishi.id,
      data: { visitTime: t(14, 44), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 20, transitLine: null },
    },
    {
      id: warei.id,
      data: { visitTime: t(15, 47), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 18, transitLine: null },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      id: rekihaku.id,
      data: { visitTime: t(14, 41), stayDurationMin: 110, transitMode: "walk", transitDurationMin: 15, transitLine: null },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[]) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots);
  printSchedule("D2(博物館のみ変更)", day2Spots);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    // D2は既存2件の更新のみ(順序・削除の変更なし)なので、個別updateで済ませる
    await tx.spot.update({ where: { id: rekihaku.id }, data: { visitTime: t(14, 41), stayDurationMin: 110, transitMode: "walk", transitDurationMin: 15, transitLine: null } });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #119 949c4f43の直し(3回目)。企画運営(16:23)の指摘。決まりA違反
 * (滞在を延ばして時間を埋めていた)を直し、Day1に実在の行き先を
 * 3か所追加して、縮めた分を正しく埋め直した。
 *
 * 滞在を企画運営の目安に合わせて短縮: ドムトールン135→45分、
 * パレスハウステンボス180→110分(見学+昼食)。
 * 座標もOSMの点に修正(パレスハウステンボス・ドムトールンとも
 * 丸めた値だった)。
 *
 * 新しい並び: 弓張岳展望台→海上自衛隊佐世保史料館→佐世保市博物館
 * 島瀬美術センター→旧佐世保無線電信所(針尾送信所)→西海橋→
 * パレスハウステンボス(昼食)→ドムトールン、09:00〜16:38。
 *
 * 事実確認: 佐世保市博物館島瀬美術センター(美術・歴史資料の展示):
 * OSM確認。旧佐世保無線電信所(針尾送信所)(大正11年/1922完成、
 * 高さ136mの無線塔3基が現存、国の重要文化財、戦艦大和出撃の際の
 * 「ニイタカヤマノボレ」の電文を発信したと伝わる): 検索結果各種。
 * 西海橋(昭和30年/1955完成、当時東洋一の規模のアーチ橋とされ、
 * 針尾瀬戸をまたぐ): 検索結果各種
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YUMIHARI_FROM = "この後は、車でおよそ10分、海上自衛隊佐世保史料館へ向かいましょう。";
const YUMIHARI_TO = "この後は、車でおよそ10分、海上自衛隊佐世保史料館へ向かいましょう。";

const SAILTOWER_FROM = "7階の展望ロビーからは、佐世保港を一望できます。この後は、車でおよそ23分、パレスハウステンボスへ向かいましょう。";
const SAILTOWER_TO = "7階の展望ロビーからは、佐世保港を一望できます。この後は、車でおよそ3分、佐世保市博物館島瀬美術センターへ向かいましょう。";

const SHIMASE_MEMO =
  "海上自衛隊佐世保史料館から車でおよそ3分、佐世保市博物館島瀬美術センターに着きます。佐世保の美術と歴史を紹介する文化施設で、郷土ゆかりの作家の作品や、地域の歴史資料を所蔵・展示しています。企画展も定期的に開かれていて、佐世保の文化的な一面にふれられる場所です。この後は、車でおよそ20分、旧佐世保無線電信所へ向かいましょう。";

const HARIO_MEMO =
  "佐世保市博物館島瀬美術センターから車でおよそ20分、旧佐世保無線電信所(針尾送信所)に着きます。大正11年(1922)に完成した、高さ136mの無線塔3基が今も残る施設で、国の重要文化財に指定されています。かつて海軍の無線通信施設として使われ、戦艦大和が出撃した際の暗号電文「ニイタカヤマノボレ」も、ここから発信されたと伝えられています。巨大な鉄塔3基が三角形に並んで立つ姿は、ほかに類を見ない独特の景観です。この後は、車でおよそ5分、西海橋へ向かいましょう。";

const SAIKAIBASHI_MEMO =
  "旧佐世保無線電信所から車でおよそ5分、西海橋に着きます。針尾瀬戸をまたぐアーチ橋で、昭和30年(1955)の完成当時、東洋一の規模を誇るアーチ橋とされていました。橋の下を流れる針尾瀬戸は、1日に4回、満潮と干潮によって激しい渦潮が発生することでも知られています。橋のたもとの公園から、渦潮や行き交う船の様子を眺められます。この後は、車でおよそ10分、パレスハウステンボスへ向かいましょう。";

const PALACE_FROM = "海上自衛隊佐世保史料館から車でおよそ23分、パレスハウステンボスに着きます。";
const PALACE_TO = "西海橋から車でおよそ10分、パレスハウステンボスに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const yumihari = await findSpotInItinerary(itinId, { spotName: "弓張岳展望台" });
  const sailtower = await findSpotInItinerary(itinId, { spotName: "海上自衛隊佐世保史料館" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  if (!sailtower.memo!.includes(SAILTOWER_FROM)) throw new Error("海上自衛隊佐世保史料館の文言が想定外です");
  if (!palace.memo!.includes(PALACE_FROM)) throw new Error("パレスハウステンボスの文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: yumihari.id, data: { stayDurationMin: 45 } },
    {
      id: sailtower.id,
      data: { memo: sailtower.memo!.replace(SAILTOWER_FROM, SAILTOWER_TO), stayDurationMin: 80 },
    },
    {
      create: {
        name: "佐世保市博物館島瀬美術センター",
        address: "長崎県佐世保市島瀬町6-22",
        lat: 33.172722,
        lng: 129.720668,
        memo: SHIMASE_MEMO,
        visitTime: t(11, 13),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "旧佐世保無線電信所",
        address: "長崎県佐世保市針尾中町382",
        lat: 33.0668632,
        lng: 129.7514178,
        memo: HARIO_MEMO,
        visitTime: t(12, 28),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "西海橋",
        address: "長崎県佐世保市針尾東町",
        lat: 33.0531345,
        lng: 129.7578466,
        memo: SAIKAIBASHI_MEMO,
        visitTime: t(13, 13),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      id: palace.id,
      data: {
        memo: palace.memo!.replace(PALACE_FROM, PALACE_TO),
        visitTime: t(13, 48),
        stayDurationMin: 110,
        transitDurationMin: 10,
      },
    },
    {
      id: dom.id,
      data: { visitTime: t(15, 43), stayDurationMin: 45 },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

/**
 * #86 c77a7701（秋田市民市場と川反、あきた食文化を満喫するグルメプラン）
 * 通常の見直し。既存は2か所のみ(10:00開始、12:30終了)で4か所未満・開始・
 * 終了とも規定外。決まりAで実在スポットを追加。
 *
 * 開始を10:00→09:00に変更(市民市場は5時開店のため問題なし)。市民市場の
 * あとに川反(既存、ここで昼食も。今は2番目のため最終スポットの結びを修正、
 * 90分は昼食を含む実際に過ごせる長さ)→秋田市民俗芸能伝承館(ねぶり流し館、
 * 実在、竿燈の実物大展示、隣接する旧金子家住宅もあわせて見学、OSM way
 * 463211300)→秋田県立美術館(実在、藤田嗣治の大壁画「秋田の行事」、OSM
 * way 461361664)→秋田市文化創造館(実在、旧県立美術館を活用した多目的
 * アートセンター、OSM way 461526244)→千秋公園(実在、旧久保田城跡。御隅櫓・
 * 佐竹史料館・彌高神社・胡月池など見どころが多く、公式・観光ガイドで
 * 1.5〜2時間が目安とされるため120分は妥当)の順に追加。移動はOSM歩行者
 * ルーティング実測。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ICHIBA_MEMO =
  "本日ご案内するのは秋田市民市場です。秋田駅から歩いて5分ほどのこちらは、昭和26年(1951)に「朝倉市場」として開設され、のちに「秋田市民市場」と改称された、地元で長く親しまれてきた市場です。館内にはきりたんぽや稲庭うどんといった秋田の郷土食材、新鮮な魚介や惣菜を扱う店が軒を連ね、「秋田の台所」とも呼ばれてきました。きりたんぽは、かつて山で炭焼きや杉の伐採をしていた人々が、残り飯を潰して鍋に入れて食べたのが始まりと伝えられ、稲庭うどんは江戸時代、久保田藩領の稲庭村で生まれ、日本三大うどんの一つとされるまでになりました。地元の人々の暮らしに根づいた市場の活気を、目と舌でお楽しみください。市場を歩いたあとは、秋田を代表する歓楽街、川反へとご案内いたします。";

const KAWABATA_MEMO =
  "秋田市民市場から歩いておよそ5分、川反に着きます。旭川沿いに広がるこの一帯は、東北でも屈指の歓楽街とされています。「川反」という地名は、旭川を挟んで武士の住む町(内町)の反対側にあることに由来すると伝えられ、江戸時代には町人の町として栄えました。明治19年(1886)に起きた大火で、被災した芸者屋や料理店がこの地に移り集まったことがきっかけとなり、歓楽街としての川反が形づくられたのだそうです。夜になれば郷土料理店や小料理屋に明かりがともり、秋田の地酒や旬の魚介を目当てに多くの人でにぎわいますが、昼間の川反もまた、老舗の建物や路地の佇まいに、歓楽街としての長い歴史をしのぶことができます。郷土料理店の中にはお昼から営業する店もあるので、ここで昼食にするのもおすすめです。食後は、老舗の建物や路地の佇まいを、のんびりと歩いてみてください。この後は、歩いておよそ6分、秋田市民俗芸能伝承館(ねぶり流し館)へ向かいましょう。";

const NEBURI_MEMO =
  "川反から歩いておよそ6分、秋田市民俗芸能伝承館(ねぶり流し館)に着きます。夏の風物詩・竿燈まつりをはじめ、秋田に伝わる郷土芸能を紹介する施設で、1階の展示ホールには実物大の竿燈が展示され、実際に手に持って重さを体感することもできます。2階では、秋田万歳や黒川番楽といった郷土芸能を、等身大の人形やパネルで紹介しています。隣接する旧金子家住宅は、江戸時代から続く商家の建物で、あわせて見学すると当時の町家の暮らしぶりもうかがえます。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ9分、秋田県立美術館へ向かいましょう。";

const BIJUTSUKAN_MEMO =
  "ねぶり流し館から歩いておよそ9分、秋田県立美術館に着きます。秋田市出身の実業家・平野政吉が集めた、洋画家・藤田嗣治の作品を中心に収蔵する美術館です。中でも目玉は、縦3.65m、横20.5mにおよぶ大壁画「秋田の行事」。昭和12年(1937)、平野の依頼を受けた藤田が、竿燈まつりや正月行事など、当時の秋田の暮らしを描いた大作で、画面いっぱいに広がる迫力ある構図が見る人を圧倒します。建築家・安藤忠雄が設計した現在の建物も、水面を望む階段状の展示空間が特徴で、あわせて楽しめます。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ5分、秋田市文化創造館へ向かいましょう。";

const BUNKASOZO_MEMO =
  "秋田県立美術館から歩いておよそ5分、秋田市文化創造館に着きます。平成25年(2013)まで秋田県立美術館として使われていた建物を活用した、多目的なアートセンターです。展覧会やワークショップ、音楽会など、ジャンルを問わずさまざまな文化活動が日替わりで行われており、訪れるたびに違う表情を見せてくれます。館内を自由に歩いて、今どんな催しが行われているか、のぞいてみてください。この後は、歩いておよそ6分、千秋公園へ向かいましょう。";

const SENSHU_MEMO =
  "秋田市文化創造館から歩いておよそ6分、千秋公園に着きます。秋田藩主・佐竹氏の居城であった久保田城の跡地を整備した公園で、園内には見どころが数多く点在しています。かつての隅櫓を復元した御隅櫓の展望室からは秋田市街を一望でき、佐竹史料館では佐竹氏ゆかりの資料を見学できます。久保田藩出身の国学者・平田篤胤をまつる彌高神社や、日本庭園のような趣の胡月池もあわせて、ゆっくりと園内を歩いてみてください。静かに、敬意をもってお参りください。秋田の食文化と歴史をたどる旅は、ここで終了です。お疲れさまでした。お帰りは、秋田駅方面へ徒歩またはバスでどうぞ。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    {
      id: "88c51bc1-3b76-4162-9ab6-dbaf920186bf", // 秋田市民市場
      data: { memo: ICHIBA_MEMO, visitTime: t(9, 0) },
    },
    {
      id: "5c856c8d-2485-4f6d-8756-6d0eb5d74136", // 川反
      data: { memo: KAWABATA_MEMO, visitTime: t(9, 55), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 5 },
    },
    {
      create: {
        name: "秋田市民俗芸能伝承館(ねぶり流し館)",
        address: "秋田県秋田市大町一丁目3-30",
        lat: 39.7203611,
        lng: 140.1169722,
        memo: NEBURI_MEMO,
        visitTime: t(11, 31),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      create: {
        name: "秋田県立美術館",
        address: "秋田県秋田市中通一丁目4-2",
        lat: 39.7174373,
        lng: 140.1215722,
        memo: BIJUTSUKAN_MEMO,
        visitTime: t(12, 20),
        stayDurationMin: 80,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    {
      create: {
        name: "秋田市文化創造館",
        address: "秋田県秋田市千秋明徳町3-16",
        lat: 39.7192655,
        lng: 140.1228122,
        memo: BUNKASOZO_MEMO,
        visitTime: t(13, 45),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "千秋公園",
        address: "秋田県秋田市千秋公園",
        lat: 39.7221538,
        lng: 140.1252380,
        memo: SENSHU_MEMO,
        visitTime: t(14, 36),
        stayDurationMin: 120,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());

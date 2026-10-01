/**
 * #110 76319c13(横浜)の組み直し。元は4か所(09:30〜14:30ごろ)で、終了のみ
 * 規定外。各スポットの滞在はいずれも妥当な長さで水増しは見当たらない
 * ため、新しい実在の行き先(横浜開港資料館・氷川丸・関帝廟・横浜媽祖廟)を
 * 追加して時間を埋めた(行き先を足す形)。
 *
 * 横浜は#64(1a32349e、港の見える丘公園と元町)・#76(7ec2843d、カップ
 * ヌードルミュージアムと帆船日本丸)もすでに見直し済みで、#64は氷川丸・
 * 横浜マリンタワーを、#76は大さん橋・赤レンガ倉庫を使っている。このため:
 * - 氷川丸は#64と同じ場所だが、#64が昭和5年の客船建造・チャップリンの
 *   一等客室・操舵室復元など「平時の豪華客船」の側面を書いているのに
 *   対し、こちらは「戦時中に海軍の特設病院船として傷病兵を運んだ」側面
 *   を中心に書き、事実・文章とも書き分けた
 * - 大さん橋・赤レンガ倉庫は、#76の実際の本文を確認し、すでに文章・
 *   構成とも別物であることを確かめた(このしおりの既存本文のため変更なし)
 * - 横浜開港資料館・関帝廟・横浜媽祖廟は、#64・#76いずれでも使われて
 *   いない新規の場所
 *
 * 新規4か所はOSM生APIで実在のノード座標を確認済み:
 * - 横浜開港資料館 35.4474356,139.6433917
 * - 氷川丸(山下公園前に係留、公園と同じ地点を使用) 35.445778,139.64975
 * - 横浜関帝廟 35.4424530,139.6452218
 * - 横浜媽祖廟 35.4421806,139.6474835
 *
 * 事実確認(開いたURL):
 * - 横浜開港資料館(旧横浜英国総領事館、明治2年1869領事館設置・関東
 *   大震災で倒壊・昭和6年1931イギリス工務省設計で再建、開館9:30〜17:00
 *   月曜休館): http://www.kaikou.city.yokohama.jp/usage-guidance/index.html
 * - 氷川丸(昭和5年1930横浜船渠で竣工・外板厚15mm丸窓・戦時中は海軍
 *   特設病院船として24航海でおよそ3万人の傷病兵を輸送・昭和35年1960
 *   引退後保存船に改装・昭和36年1961年5月山下公園に係留):
 *   https://ja.wikipedia.org/wiki/氷川丸 ほか
 * - 横浜関帝廟(1862年ごろ祠として創建・1871年本格的な廟に・現在の建物
 *   は4代目で平成2年1990完成、境内無料・本殿参拝は線香が必要、9:00〜
 *   19:00年中無休): WebSearch各種
 * - 横浜媽祖廟(平成18年2006創建、お堂内部の参拝にはお布施が必要):
 *   WebSearch各種(料金の具体額は本文に書かない)
 *
 * 赤レンガ倉庫に昼食の一文を追加(11:40〜12:40、ちょうど正午をまたぐ
 * 時間帯)。山下公園の氷川丸についての記載から、「別途チケットが必要」
 * という料金の言葉と「公園とは別の見学施設なので立ち寄らない」という
 * 前提を削除し、この後氷川丸へ向かう流れに直した。横浜中華街の本文に
 * あった関帝廟の詳しい由来(関帝廟のスポット自体で書くため重複を避け
 * 削除)も整理した。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAIKOSHIRYOKAN_MEMO =
  "みなとみらい線・日本大通り駅からすぐ、旅の始まりは横浜開港資料館です。明治2年(1869)、この地にイギリス領事館が置かれて以来、昭和47年(1972)に領事館が廃止されるまで、100年以上にわたってイギリスとゆかりのある土地でした。現在の建物は、関東大震災で倒壊した旧領事館に代わり、イギリス工務省の設計により昭和6年(1931)に鉄筋コンクリート造で再建されたものです。館内には、黒船来航から開港にいたる横浜の歴史を伝える資料が展示されています。この後は、歩いておよそ10分、大さん橋へ向かいましょう。";

const OSANBASHI_FROM = "みなとみらい線・日本大通り駅から徒歩約7分、世界各国のクルーズ客船が発着する、横浜港の海の玄関口が横浜港大さん橋国際客船ターミナルです。";
const OSANBASHI_TO = "横浜開港資料館から歩いておよそ10分、横浜港大さん橋国際客船ターミナルに着きます。世界各国のクルーズ客船が発着する、横浜港の海の玄関口です。";

const AKARENGA_FROM = "倉庫の中を歩くと、太い鉄骨や高い天井にその頑丈さが今も感じられます。ショップやレストランをひとめぐりしたら、海沿いの遊歩道を歩いて山下公園へ向かいましょう。潮風を感じながらの散歩も気持ちがいいものです。";
const AKARENGA_TO = "倉庫の中を歩くと、太い鉄骨や高い天井にその頑丈さが今も感じられます。ショップやレストランが並んでいるので、ここで昼食にしましょう。この後は、海沿いの遊歩道を歩いておよそ20分、山下公園へ向かいましょう。潮風を感じながらの散歩も気持ちがいいものです。";

const YAMASHITA_FROM = "公園の沖に浮かぶ大きな船は氷川丸で、1930年に就航した貨客船です。喜劇王チャップリンも乗船したことで知られていますが、こちらは公園とは別の有料の見学施設なので、船内をじっくり見たい方は別途チケットが必要です。園内にある沈床花壇のあたりは、かつて氷川丸のための船溜まりがあった場所で、そばに架かる小さな橋がその名残だといわれています。花壇を眺めながらひと休みしたら、このまま歩いて横浜中華街へ向かいましょう。";
const YAMASHITA_TO = "公園の沖に浮かぶ大きな船は氷川丸で、1930年に就航した貨客船です。喜劇王チャップリンも乗船したことで知られています。園内にある沈床花壇のあたりは、かつて氷川丸のための船溜まりがあった場所で、そばに架かる小さな橋がその名残だといわれています。花壇を眺めながらひと休みしたら、この後は、歩いてすぐ、氷川丸へ向かいましょう。";

const HIKAWAMARU_MEMO =
  "山下公園から歩いてすぐ、公園前に係留された氷川丸に着きます。昭和5年(1930)、横浜船渠(現在のJMU横浜事業所)で建造された貨客船で、太平洋の荒波に耐えられるよう、外板の厚さは15mm、船窓には角のない丸窓が採用されました。戦時中は海軍の特設病院船となり、船体を白く塗り替えて赤十字を描き、24回の航海でおよそ3万人の傷病兵を運んだと伝えられています。終戦後は復員船・引き揚げ船としての役目を終え、昭和35年(1960)に現役を退いたのち保存船として整備され、昭和36年(1961)5月から山下公園に係留されています。この後は、歩いておよそ5分、横浜中華街へ向かいましょう。";

const CHUKAGAI_FROM_OPEN = "山下公園から歩いてすぐ、色とりどりの看板と食欲をそそる香りに包まれるのが横浜中華街です。";
const CHUKAGAI_TO_OPEN = "氷川丸から歩いておよそ5分、色とりどりの看板と食欲をそそる香りに包まれる横浜中華街に着きます。";

const CHUKAGAI_FROM_END = "関帝廟は1862年ごろに小さな祠として始まり、1871年に本格的なお廟になりましたが、関東大震災や戦災で被害を受けるたびに再建され、今の建物は4代目にあたり1990年に完成しました。食べ歩きはもちろん、そうした歴史に思いを馳せながら街を歩くと、また違った中華街の魅力に気づくはずです。これで今日のさんぽも締めくくりです。";
const CHUKAGAI_TO_END = "食べ歩きを楽しみながら、歴史に思いを馳せて街を歩くと、また違った中華街の魅力に気づくはずです。この後は、歩いておよそ3分、関帝廟へ向かいましょう。";

const KANTEIBYO_MEMO =
  "横浜中華街から歩いておよそ3分、関帝廟に着きます。1862年ごろ、横浜に住む中国人たちが航海の安全や商売繁盛を願って建てた祠が始まりとされ、1871年には本格的な廟として整備されました。関東大震災や横浜大空襲で焼失するたびに再建され、現在の建物は4代目にあたり、平成2年(1990)に完成しています。極彩色の装飾が施された中国の伝統建築で、商売の神様として知られる関羽が祀られています。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ3分、横浜媽祖廟へ向かいましょう。";

const MASOBYO_MEMO =
  "関帝廟から歩いておよそ3分、この旅の締めくくり、横浜媽祖廟に着きます。平成18年(2006)に建てられた比較的新しい廟で、航海の安全を守る女神として中国や台湾の沿岸部で広く信仰される媽祖が祀られています。極彩色の彫刻や装飾に彩られた堂内は、中華街のなかでも異彩を放つ荘厳な空間です。参拝の際は、敬意を込めて手を合わせましょう。みなとみらいの絶景と中華街グルメ、横浜港町をめぐる旅はこれで終わりです。帰りは、みなとみらい線・元町・中華街駅から電車で戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76319c13%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const osanbashi = await findSpotInItinerary(itinId, { spotName: "横浜港大さん橋国際客船ターミナル" });
  const akarenga = await findSpotInItinerary(itinId, { spotName: "横浜赤レンガ倉庫" });
  const yamashita = await findSpotInItinerary(itinId, { spotName: "山下公園" });
  const chukagai = await findSpotInItinerary(itinId, { spotName: "横浜中華街" });

  if (!osanbashi.memo!.includes(OSANBASHI_FROM)) throw new Error("大さん橋の文言が想定外です");
  if (!akarenga.memo!.includes(AKARENGA_FROM)) throw new Error("赤レンガ倉庫の文言が想定外です");
  if (!yamashita.memo!.includes(YAMASHITA_FROM)) throw new Error("山下公園の文言が想定外です");
  if (!chukagai.memo!.includes(CHUKAGAI_FROM_OPEN)) throw new Error("中華街の文言①が想定外です");
  if (!chukagai.memo!.includes(CHUKAGAI_FROM_END)) throw new Error("中華街の文言②が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const chukagaiMemo = chukagai.memo!.replace(CHUKAGAI_FROM_OPEN, CHUKAGAI_TO_OPEN).replace(CHUKAGAI_FROM_END, CHUKAGAI_TO_END);

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "横浜開港資料館",
        address: "神奈川県横浜市中区日本大通3",
        lat: 35.4474356,
        lng: 139.6433917,
        memo: KAIKOSHIRYOKAN_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 40,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    { id: osanbashi.id, data: { memo: osanbashi.memo!.replace(OSANBASHI_FROM, OSANBASHI_TO), visitTime: t(10, 20), transitMode: "walk", transitDurationMin: 10 } },
    { id: akarenga.id, data: { memo: akarenga.memo!.replace(AKARENGA_FROM, AKARENGA_TO), visitTime: t(11, 40) } },
    { id: yamashita.id, data: { memo: yamashita.memo!.replace(YAMASHITA_FROM, YAMASHITA_TO), visitTime: t(13, 0) } },
    {
      create: {
        name: "氷川丸",
        address: "神奈川県横浜市中区山下町279",
        lat: 35.445778,
        lng: 139.64975,
        memo: HIKAWAMARU_MEMO,
        visitTime: t(13, 32),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: chukagai.id, data: { memo: chukagaiMemo, visitTime: t(14, 32), transitMode: "walk", transitDurationMin: 5 } },
    {
      create: {
        name: "関帝廟",
        address: "神奈川県横浜市中区山下町140",
        lat: 35.442453,
        lng: 139.6452218,
        memo: KANTEIBYO_MEMO,
        visitTime: t(15, 55),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "横浜媽祖廟",
        address: "神奈川県横浜市中区山下町136",
        lat: 35.4421806,
        lng: 139.6474835,
        memo: MASOBYO_MEMO,
        visitTime: t(16, 18),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

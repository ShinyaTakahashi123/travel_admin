/**
 * チェックリスト #310 の修正記録(企画運営2点・法務4点)。
 * しおり「あべのハルカスと四天王寺、天王寺の絶景と歴史を巡るプラン」
 * (6d8232c0-df97-4f32-b8c3-6d8c9d3f0038)
 *
 * 企画運営の指摘:
 * 1. 堀越神社(45→25分)・てんしば(96→65分)の滞在が、決まりAの水増しに
 *    見える(半端な数で前の時刻に合わせたよう)。縮め、空いた時間は実在の
 *    慶沢園・茶臼山を追加して埋めた。
 *    慶沢園(way 765953897): 住友家15代・吉左衛門(春翠)が大正7年(1918)に
 *    完成させた日本庭園、庭師・小川治兵衛の作。
 *    出典(直接開いたURL): https://www.city.osaka.lg.jp/kyoiku/page/0000008995.html
 *    (大阪市教育委員会公式、市指定文化財)
 *    茶臼山(node 517409158): 大坂冬の陣で徳川家康、夏の陣で真田幸村の
 *    本陣が置かれた史跡。
 *    出典: https://osaka-info.jp/spot/chausuyama-tennoji-park/
 *    (大阪観光局公式サイト OSAKA-INFO)
 * 2. 堀越神社・四天王寺・大阪市立美術館・てんしばの話し言葉("〜して
 *    くださいね""やってまいりました"等)を地の文に統一。
 *
 * 法務の指摘:
 * 1. descriptionの「西日本一の高さを誇る」→「西日本一の高さとされる」。
 * 2. 堀越神社の「大阪でも人気のパワースポットのひとつです」を削除
 *    (ご利益を強調する言い方)。
 * 3. てんしばの締めの一文(旧:最後はハルカスへ)を、新世界・通天閣が
 *    間に入ったので「次は、新世界・通天閣へ向かいます」に修正。
 * 4. 新世界の「大きなフグの看板」(づぼらやの看板)は、令和2年(2020)9月
 *    に撤去されたことが確認できたため削除。
 *    出典(直接開いたURL): https://abeno.keizai.biz/headline/3529/
 *    (あべの経済新聞。「づぼらや新世界本店、ふぐちょうちんを撤去」)
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 * 縮めた分がほかのスポットの滞在に移っていないことを確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-310b-6d8232c0.ts
 * (実行済み。慶沢園の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "慶沢園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const horikoshi = spots.find((s) => s.name === "堀越神社")!;
  const shitennoji = spots.find((s) => s.name === "四天王寺")!;
  const bijutsukan = spots.find((s) => s.name === "大阪市立美術館")!;
  const tenshiba = spots.find((s) => s.name === "天王寺公園（てんしば）")!;
  const shinsekai = spots.find((s) => s.name === "新世界・通天閣")!;
  const harukas = spots.find((s) => s.name === "あべのハルカス")!;

  const horikoshiMemo =
    "JR・地下鉄・近鉄の天王寺駅から徒歩約10分、この旅は堀越神社からスタートします。ここは「一生に一度だけ、願いを叶えてくれる神様」として知られる神社で、この言い伝えにあやかろうと、遠方からも参拝者が「ひと夢祈願」に訪れます。創建は、推古天皇の時代にまでさかのぼると伝えられています。聖徳太子が、叔父である崇峻天皇の徳を偲び、四天王寺の建立と同じ頃にこの神社を建てたのが始まりとされているのです。御祭神の崇峻天皇は、歴代の天皇の中で唯一、家臣の手によって命を落とされたと伝わる、少し悲しい歴史を背負われた方でもあります。ちなみに「堀越」という社名は、明治の中頃までこの境内の南側にあった堀を、参拝者が「越えて」お参りしていたことに由来するともいわれています。願い事はひとつだけ、心を込めてお祈りしましょう。 今も信仰が続く場所ですので、静かに、敬意をもってお参りください。";

  const shitennojiMemo =
    "堀越神社からは徒歩10分ほどです。四天王寺は、日本最古級の仏教寺院の一つです。593年に聖徳太子が建立したと伝えられ、境内には「四天王寺式伽藍配置」と呼ばれる、日本最古級の建築様式の一つが今も大切に受け継がれています。このお寺が創建された背景には、聖徳太子と物部守屋との戦いがあったと伝わっています。戦況が厳しいなか、太子自らが四天王像を彫り、「この戦に勝利できたなら、四天王をお祀りするお寺を建てます」と誓願したことが、四天王寺のはじまりだとされているのです。もうひとつ注目したいのが、「敬田院・施薬院・療病院・悲田院」という四箇院の仕組みです。信仰の場だけでなく、福祉や医療を担う施設としての機能もあわせ持つ、当時としては先進的な複合施設だったといわれています。境内にそびえる五重塔は、焼失と再建を繰り返し、現在の姿は7回目の再建と伝わります。長い歴史の重みを感じながら、ゆっくりと境内を巡りましょう。 今も信仰が続く場所ですので、静かに、敬意をもってお参りください。";

  const bijutsukanMemo =
    "四天王寺からは徒歩10分ほどです。続いて訪れるのは、大阪市立美術館です。2025年3月にリニューアルオープンし、これまでとはひと味違った姿を見せています。今回の改修でまず注目したいのが、新しく設けられたバリアフリー対応のエントランスです。誰もが快適に利用できるよう配慮された造りになっています。そしてもうひとつの見どころが、美しい日本庭園「慶沢園」を望むことができるテラスです。芸術鑑賞の合間に、緑豊かな庭園を眺めながら一息つける、心和むスペースとなっています。館内では収蔵エリアも拡大され、空調設備も新しく刷新されており、貴重な作品を守るための環境づくりにもしっかりと力が入れられています。歴史あるこの美術館が、どのように生まれ変わったのか、その変化を確かめてみましょう。";

  const tenshibaMemo =
    "茶臼山からは徒歩7分ほどです。「てんしば」こと天王寺公園は、大阪でも人気の憩いのスポットです。あべのハルカスを背景にした、およそ7,000平方メートルにおよぶ広々とした芝生広場が魅力で、この開放的な景観が評価され、2016年度のグッドデザイン賞、建築・環境デザイン部門でBEST100の金賞に選ばれました。2015年10月、官民が連携した再整備の取り組みによって、天王寺公園のエントランス部分、およそ2.5ヘクタールがリニューアルオープンしました。それ以前は柵に囲われ、近寄りがたい公園だったといわれていますから、その変わりようには驚かされます。緑の芝生の上で、あべのハルカスを眺めながらのんびりと過ごしましょう。次は、新世界・通天閣へ向かいます。";

  const shinsekaiMemo =
    "天王寺公園(てんしば)からは徒歩13分ほどです。新世界は、明治36年(1903)に開かれた第5回内国勧業博覧会の跡地に発展した繁華街です。跡地の東半分には天王寺公園が、西半分には博覧会のシンボルとして通天閣(初代)がつくられたことが、この街のはじまりと伝えられています。現在の通天閣は2代目で、昭和31年(1956)に開業しました。通天閣の南に続くジャンジャン横丁には、串カツ店や将棋クラブなどおよそ50軒が軒を連ね、昭和の下町情緒を今に伝えています。足をなでると幸運が訪れるといわれる「ビリケンさん」も見どころです。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: horikoshi.id, data: { stayDurationMin: 25, memo: horikoshiMemo } },
        { id: shitennoji.id, data: { memo: shitennojiMemo } },
        { id: bijutsukan.id, data: { memo: bijutsukanMemo } },
        {
          create: {
            name: "慶沢園",
            address: "大阪市天王寺区茶臼山町1-82",
            lat: 34.6497113,
            lng: 135.5114229,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 6,
            memo:
              "大阪市立美術館からは徒歩6分ほどです。慶沢園は、住友家15代当主・住友吉左衛門(春翠)が、本邸とともに大正7年(1918)に完成させた日本庭園です。名庭師として知られる小川治兵衛が設計・施工を手がけました。大正10年、大阪市が美術館の建設用地を探していることを知った春翠は、慶沢園を含む茶臼山一帯の土地を大阪市に寄贈することを申し出ました。池を中心に築山や滝を配した、回遊式庭園の趣を今に伝えています。四季折々の景色を眺めながら、静かなひとときを過ごしましょう。",
          },
        },
        {
          create: {
            name: "茶臼山",
            address: "大阪市天王寺区茶臼山町",
            lat: 34.6518614,
            lng: 135.5114555,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 48)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 4,
            memo:
              "慶沢園からは徒歩4分ほどです。茶臼山は、標高およそ26mの小高い丘です。大坂冬の陣(1614)では徳川家康の本陣が、翌年の大坂夏の陣(1615)では、豊臣方の武将・真田幸村(信繁)の本陣が置かれた、大坂の陣ゆかりの史跡です。家康の首を狙う幸村が、この地に陣を敷いて先制攻撃を仕掛けたと伝えられています。山頂には、大坂の陣に関する史料や地図、石碑などが設置されています。周辺には食事処もあるので、ここで昼食をとりましょう。歴史の舞台となった丘に立ち、戦国時代の大阪に思いをはせてみましょう。",
          },
        },
        { id: tenshiba.id, data: { stayDurationMin: 65, transitMode: "walk", transitDurationMin: 7, memo: tenshibaMemo } },
        { id: shinsekai.id, data: { memo: shinsekaiMemo } },
        { id: harukas.id, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  // づぼらやのフグ提灯(令和2年9月撤去)の記述を削除
  const shinsekaiRow = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "新世界・通天閣" } });
  const oldFugu = "大きなフグの看板や、";
  if (shinsekaiRow.memo?.includes(oldFugu)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shinsekaiRow.id }, {
      memo: shinsekaiRow.memo.replace(oldFugu, ""),
    });
  }

  // visitTimeの再計算(堀越神社以降を順に積み上げ)
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "堀越神社") {
      cursor = new Date(s.visitTime!.getTime() + s.stayDurationMin! * 60000);
      continue;
    }
    if (cursor == null) continue;
    const base: Date = cursor;
    const start: Date = new Date(base.getTime() + (s.transitDurationMin ?? 0) * 60000);
    if (s.visitTime?.getTime() !== start.getTime()) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: start });
    }
    cursor = new Date(start.getTime() + (s.stayDurationMin ?? 0) * 60000);
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description?.includes("西日本一の高さを誇るあべのハルカス")) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: {
        description: itin.description
          .replace("西日本一の高さを誇るあべのハルカス", "西日本一の高さとされるあべのハルカス")
          .replace(
            "そして西日本一の高さとされるあべのハルカスの展望台まで。古刹の歴史と下町情緒、高層ビルの絶景を1日で楽しむプランです。",
            "慶沢園・茶臼山の歴史、昭和レトロな新世界・通天閣、そして西日本一の高さとされるあべのハルカスの展望台まで。古刹の歴史と下町情緒、高層ビルの絶景を1日で楽しむプランです。"
          ),
      },
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

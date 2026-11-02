/**
 * 組み直し、416d4fb5（仙娥滝と覚円峰、国の特別名勝・昇仙峡の渓谷美を歩く日帰りプラン）。
 * (9本目/10・v3)
 *
 * v3の直し(法務の指摘・企画運営の決定、2026-11-02): 昇仙峡影絵の森美術館の点が、昼食の
 *  バス停「昇仙峡滝上」(35.7509182,138.5664219)とまったく同じ値になっていた(法務の指摘)。
 *  公式の住所(甲府市高成町1035-2)を地理院地図の住所検索で引いたが、町名までしか点が出ず、
 *  番地までは出なかった(企画運営の指示どおり、番地まで出ない場合は②の案)。②として、
 *  美術館も7章の例外でバス停「昇仙峡滝上」と同じ点を使う(もともと徒歩1分の距離にあり、
 *  昼食の点と同じ値になることは一覧に記録する)
 *
 * v2の直し(法務の指摘・企画運営の決定、2026-11-02):
 *  1. 石門をスポットから外す(名前のある道の頂点が見つからなかったため。企画運営の決定。
 *     丸めた値は使わない)。遊歩道の途中に石門があることは、仙娥滝のメモの中で触れる
 *  2. 昼食のスポット「昇仙峡滝上」を新規追加(highway=bus_stop node13130453701
 *     35.7509182,138.5664219、店ではない点)。覚円峰から歩いておよそ9分(いまの
 *     覚円峰→影絵の森美術館と同じ道のり。この停留所は影絵の森美術館とほぼ同じ場所に
 *     ある)。昇仙峡観光協会の公式サイト(shosenkyo-kankoukyokai.com/食べる.html)で、
 *     ロープウェイ・遊歩道の入口近くにそば・ほうとうの店が複数あることを確認。店名は
 *     書かない。40分、11:34始まりで11:30〜13:30の中
 *  3. 入口の一文を追加(甲府駅から車でおよそ25分、OSRM19.9分+5)
 *  4. 舞鶴城公園の最後に帰りの一文を追加(甲府駅まで歩いておよそ12分、routed-foot
 *     844m・11.3分)
 *  5. 武田神社の終わりの文に分を追加(「歩いておよそ5分」)
 *  6. 覚円峰の点は地理院地図の地名「覚円峰」を使用(35.7473284,138.5652269。地理院を
 *     使ったことを記録)
 *
 * (v1からの直し: 仙娥滝・信玄ミュージアムの点をOSMの実在の点に丸めの直し。武田神社は
 *  変更なし。言葉の直し(「ください」4つ・「評判」・「数えられ」・「締めくくって」)、
 *  タイトル・説明文の「定番」を外す、はそのまま)
 *
 * 旅の足の組み直し(routed-footで測り直し):
 *  仙娥滝→覚円峰(石門を外したため直行) 5分(375m・5.0分)
 *  覚円峰→昇仙峡滝上(昼食) 9分(631m・8.4分)
 *  昇仙峡滝上→影絵の森美術館 1分(ほぼ同じ場所、0.0分)
 *  舞鶴城公園→甲府駅(帰り) 12分(844m・11.3分)
 *
 * 始まりを09:00→09:15に変更(石門を外した分・覚円峰の点が動いた分を踏まえ、昼食の
 *  始まりが11:30〜13:30に入り、終わりが16:30〜17:00に収まるように。決まりA、始まりを
 *  遅らせるのは日帰りの範囲〈8:30〜9:30〉の中で可)
 *
 * この組み直しで終わりは16:47(日帰りの発車16:30〜17:00の中)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "416d4fb5-5d59-4886-97f2-e36c88377b52";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const PANORAMA = "昇仙峡ロープウェイ(パノラマ台)";
const SENGATAKI = "仙娥滝";
const ISHIMON = "石門";
const KAKUENHO = "覚円峰";
const KAGEENOMORI = "昇仙峡影絵の森美術館";
const TAKEDAJINJA = "武田神社";
const SHINGEN = "信玄ミュージアム(甲府市武田氏館跡歴史館)";
const MAIZURUJO = "舞鶴城公園";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const panorama = await prisma.spot.findFirstOrThrow({ where: { name: PANORAMA, day: { itineraryId: ITIN_ID } } });
  const sengataki = await prisma.spot.findFirstOrThrow({ where: { name: SENGATAKI, day: { itineraryId: ITIN_ID } } });
  const ishimon = await prisma.spot.findFirstOrThrow({ where: { name: ISHIMON, day: { itineraryId: ITIN_ID } } });
  const kakuenho = await prisma.spot.findFirstOrThrow({ where: { name: KAKUENHO, day: { itineraryId: ITIN_ID } } });
  const kageenomori = await prisma.spot.findFirstOrThrow({ where: { name: KAGEENOMORI, day: { itineraryId: ITIN_ID } } });
  const takedajinja = await prisma.spot.findFirstOrThrow({ where: { name: TAKEDAJINJA, day: { itineraryId: ITIN_ID } } });
  const shingen = await prisma.spot.findFirstOrThrow({ where: { name: SHINGEN, day: { itineraryId: ITIN_ID } } });
  const maizurujo = await prisma.spot.findFirstOrThrow({ where: { name: MAIZURUJO, day: { itineraryId: ITIN_ID } } });

  const checks: { name: string; lat: number; lng: number; got: { lat: unknown; lng: unknown } }[] = [
    { name: SENGATAKI, lat: 35.749508, lng: 138.566183, got: sengataki },
    { name: KAKUENHO, lat: 35.745, lng: 138.566389, got: kakuenho },
    { name: SHINGEN, lat: 35.68525, lng: 138.57706, got: shingen },
  ];
  for (const c of checks) {
    if (Math.abs(Number(c.got.lat) - c.lat) > 1e-4 || Math.abs(Number(c.got.lng) - c.lng) > 1e-4) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致(現在 ${c.got.lat},${c.got.lng})`);
    }
  }

  const PANORAMA_MEMO_OLD =
    "車は滝上の駐車場に停めて、昇仙峡ロープウェイに乗り、山頂のパノラマ台へ向かいます。仙娥滝駅からおよそ5分の空中散歩で、山頂に到着です。パノラマ台からは、富士山や南アルプスの山並み、眼下に広がる甲府盆地まで、大パノラマを楽しめます。強風などの際は運休することがあるので、お出かけ前に公式の案内を確かめてください。山頂は岩場もあるので、足元に気をつけて楽しみましょう。山頂を満喫したら、再びロープウェイで麓へ下りましょう。この後は、仙娥滝へ向かいます。";
  const PANORAMA_MEMO_NEW =
    "甲府駅から車でおよそ25分、昇仙峡ロープウェイに乗り、山頂のパノラマ台へ向かいます。車は滝上の駐車場に停めましょう。仙娥滝駅からおよそ5分の空中散歩で、山頂に到着です。パノラマ台からは、富士山や南アルプスの山並み、眼下に広がる甲府盆地まで、大パノラマを楽しめます。強風などの際は運休することがあるので、お出かけ前に公式の案内を確かめましょう。山頂は岩場もあるので、足元に気をつけて楽しみましょう。山頂を満喫したら、再びロープウェイで麓へ下りましょう。この後は、歩いておよそ5分、仙娥滝へ向かいます。";
  if (panorama.memo !== PANORAMA_MEMO_OLD) throw new Error("パノラマ台: memo現在値が期待と不一致");

  const SENGATAKI_MEMO_OLD =
    "昇仙峡は日本一の渓谷美といわれ、国の特別名勝にも指定されています。その最奥部にかかる仙娥滝は、落差およそ30メートル、地殻変動による断層に沿って、花崗岩の岩肌を削りながら流れ落ちる、迫力ある姿を見せてくれます。周囲には木々の緑が広がり、水しぶきとともに清々しい空気を感じられます。名前の由来は、中国の神話で月へ昇っていったとされる女性・嫦娥(じょうが)にちなむと伝えられており、「日本の滝百選」にも選ばれている名瀑です。水しぶきで岩が滑りやすくなっているところもあるので、足元に気をつけてください。この後は、歩いておよそ10分、奇岩「石門」へ向かいましょう。";
  const SENGATAKI_MEMO_NEW =
    "昇仙峡ロープウェイで麓まで下りたら、歩いておよそ5分、仙娥滝に着きます。昇仙峡は日本一の渓谷美といわれ、国の特別名勝にも指定されています。その最奥部にかかる仙娥滝は、落差およそ30メートル、地殻変動による断層に沿って、花崗岩の岩肌を削りながら流れ落ちる、迫力ある姿を見せてくれます。周囲には木々の緑が広がり、水しぶきとともに清々しい空気を感じられます。名前の由来は、中国の神話で月へ昇っていったとされる女性・嫦娥(じょうが)にちなむと伝えられており、「日本の滝百選」にも選ばれている名瀑です。渓谷沿いの遊歩道を進むと、2つの巨大な花崗岩が寄り添うようにそびえ立つ奇岩「石門」も見えてきます。水しぶきで岩が滑りやすくなっているところもあるので、足元に気をつけましょう。この後は、歩いておよそ5分、シンボルの覚円峰へ向かいましょう。";
  if (sengataki.memo !== SENGATAKI_MEMO_OLD) throw new Error("仙娥滝: memo現在値が期待と不一致");

  const ISHIMON_MEMO_OLD =
    "仙娥滝から歩いておよそ10分、渓谷沿いの遊歩道に現れる奇岩「石門」に着きます。2つの巨大な花崗岩が寄り添うようにそびえ立ち、先端がわずかに離れた天然のアーチを描くことから「石門」と名づけられたと伝えられています。長い年月をかけて花崗岩が風化と水の浸食を受けてできた、昇仙峡ならではの奇岩の一つです。この後は、歩いておよそ10分、シンボルの覚円峰へ向かいましょう。";
  if (ishimon.memo !== ISHIMON_MEMO_OLD) throw new Error("石門: memo現在値が期待と不一致(削除前の確認)");

  const KAKUENHO_MEMO_OLD =
    "覚円峰は、昇仙峡のシンボルともいわれる岩峰です。長い年月をかけて花崗岩が風化と水の浸食を受け、水面からほぼ垂直に切り立つ姿となりました。名前は、覚円という僧がこの岩の頂上で修行を行ったという言い伝えに由来するとされています。対岸には天狗岩と呼ばれる岩も望むことができ、あわせて楽しめます。青空を背に堂々とそびえる岩峰の姿は、見る人を圧倒すると評判です。特別名勝に指定された渓谷ならではの雄大な景色を、目に焼き付けてください。この後は、来た道を歩いて滝上まで戻り(のぼり坂でおよそ27分)、昇仙峡影絵の森美術館へ向かいましょう。";
  const KAKUENHO_MEMO_NEW =
    "仙娥滝から歩いておよそ5分、覚円峰に着きます。昇仙峡のシンボルともいわれる岩峰です。長い年月をかけて花崗岩が風化と水の浸食を受け、水面からほぼ垂直に切り立つ姿となりました。名前は、覚円という僧がこの岩の頂上で修行を行ったという言い伝えに由来するとされています。対岸には天狗岩と呼ばれる岩も望むことができ、あわせて楽しめます。青空を背に堂々とそびえる岩峰の姿は、見る人を圧倒する迫力があります。特別名勝に指定された渓谷ならではの雄大な景色を、目に焼き付けましょう。この後は、歩いておよそ9分、昇仙峡滝上のあたりへ向かいましょう。";
  if (kakuenho.memo !== KAKUENHO_MEMO_OLD) throw new Error("覚円峰: memo現在値が期待と不一致");

  const TAKIGAMI_MEMO_NEW =
    "覚円峰から歩いておよそ9分、昇仙峡滝上のあたりに着きます。昇仙峡ロープウェイの駐車場に近く、そばやほうとうが食べられる店が集まっています。ここで昼食にしましょう。この後は、歩いておよそ1分、昇仙峡影絵の森美術館へ向かいましょう。";

  const KAGEENOMORI_MEMO_OLD =
    "覚円峰から歩いて滝上まで戻り(のぼり坂でおよそ27分)、昇仙峡影絵の森美術館に着きます。光と影で幻想的な世界を描き出す「影絵」の第一人者、藤城清治の作品を中心に、山下清や竹久夢二など、ジャンルを超えた作家たちの作品も常設で展示されています。光と影が織りなす、夢幻的な世界をゆっくりと味わってみてください。この後は、車でおよそ17分、武田信玄ゆかりの武田神社へ向かいましょう。";
  const KAGEENOMORI_MEMO_NEW =
    "昇仙峡滝上のあたりから歩いておよそ1分、昇仙峡影絵の森美術館に着きます。光と影で幻想的な世界を描き出す「影絵」の第一人者、藤城清治の作品を中心に、山下清や竹久夢二など、ジャンルを超えた作家たちの作品も常設で展示されています。光と影が織りなす、夢幻的な世界をゆっくりと味わいましょう。この後は、車でおよそ17分、武田信玄ゆかりの武田神社へ向かいましょう。";
  if (kageenomori.memo !== KAGEENOMORI_MEMO_OLD) throw new Error("昇仙峡影絵の森美術館: memo現在値が期待と不一致");

  const TAKEDAJINJA_MEMO_OLD =
    "昇仙峡影絵の森美術館から車でおよそ17分、武田信玄を祀る武田神社に着きます。戦国大名・武田信虎、信玄、勝頼の武田氏3代が60年余りにわたって居館とした、躑躅ヶ崎館の跡地(国の史跡)に鎮座しています。境内の宝物殿には、国の重要文化財に指定される太刀「吉岡一文字」をはじめ、武田家伝来と伝わる甲冑や、信玄の軍配など、ゆかりの品々が展示されています。静かに、敬意をもってお参りください。この後は、神社の向かいにある信玄ミュージアムへ向かいましょう。";
  const TAKEDAJINJA_MEMO_NEW =
    "昇仙峡影絵の森美術館から車でおよそ17分、武田信玄を祀る武田神社に着きます。戦国大名・武田信虎、信玄、勝頼の武田氏3代が60年余りにわたって居館とした、躑躅ヶ崎館の跡地(国の史跡)に鎮座しています。境内の宝物殿には、国の重要文化財に指定される太刀「吉岡一文字」をはじめ、武田家伝来と伝わる甲冑や、信玄の軍配など、ゆかりの品々が展示されています。静かに、敬意をもってお参りください。この後は、歩いておよそ5分、神社の向かいにある信玄ミュージアムへ向かいましょう。";
  if (takedajinja.memo !== TAKEDAJINJA_MEMO_OLD) throw new Error("武田神社: memo現在値が期待と不一致");

  const SHINGEN_MEMO_OLD =
    "武田神社の向かいにある信玄ミュージアム(甲府市武田氏館跡歴史館)は、国史跡・武田氏館跡の発掘成果や、武田氏3代の歩みを紹介するガイダンス施設として、平成31年(2019年)に開館しました。館の跡から出土した品々や、戦国時代の甲府盆地の様子をたどる展示を通じて、先ほど歩いた武田神社の境内が、かつてどのような館だったのかをより深く知ることができます。休館日があるので、訪れる前に公式の案内で開館状況を確かめてください。この後は、車でおよそ10分、甲府城跡に整備された舞鶴城公園へ向かいましょう。";
  const SHINGEN_MEMO_NEW =
    "武田神社から歩いておよそ5分、向かいにある信玄ミュージアム(甲府市武田氏館跡歴史館)に着きます。国史跡・武田氏館跡の発掘成果や、武田氏3代の歩みを紹介するガイダンス施設として、平成31年(2019年)に開館しました。館の跡から出土した品々や、戦国時代の甲府盆地の様子をたどる展示を通じて、先ほど歩いた武田神社の境内が、かつてどのような館だったのかをより深く知ることができます。休館日があるので、訪れる前に公式の案内で開館状況を確かめましょう。この後は、車でおよそ10分、甲府城跡に整備された舞鶴城公園へ向かいましょう。";
  if (shingen.memo !== SHINGEN_MEMO_OLD) throw new Error("信玄ミュージアム: memo現在値が期待と不一致");

  const MAIZURUJO_MEMO_OLD =
    "信玄ミュージアムから車でおよそ10分、甲府城の城跡に整備された舞鶴城公園に着きます。甲府城は、日本百名城の一つに数えられ、豊臣秀吉の指示により、天正18年(1590年)の天下統一のあとに築城が始まったと伝えられています。天守台からは、富士山や南アルプスの山並みとともに、甲府盆地を見渡すことができます。石垣に沿って、平成16年(2004年)に復元された稲荷櫓や、平成19年(2007年)に復元された山手御門など、歴史的な建物もめぐってみてください。昇仙峡の渓谷美から甲府の歴史まで、山梨をめぐる今日の旅を締めくくってください。";
  const MAIZURUJO_MEMO_NEW =
    "信玄ミュージアムから車でおよそ10分、甲府城の城跡に整備された舞鶴城公園に着きます。甲府城は、日本百名城のひとつとされ、豊臣秀吉の指示により、天正18年(1590年)の天下統一のあとに築城が始まったと伝えられています。天守台からは、富士山や南アルプスの山並みとともに、甲府盆地を見渡すことができます。石垣に沿って、平成16年(2004年)に復元された稲荷櫓や、平成19年(2007年)に復元された山手御門など、歴史的な建物もめぐってみましょう。帰りは、歩いておよそ12分の甲府駅から、電車に乗りましょう。昇仙峡の渓谷美から甲府の歴史まで、山梨をめぐる今日の旅は、これで終わりです。";
  if (maizurujo.memo !== MAIZURUJO_MEMO_OLD) throw new Error("舞鶴城公園: memo現在値が期待と不一致");

  const TITLE_OLD = "仙娥滝と覚円峰、国の特別名勝・昇仙峡の渓谷美を歩く定番日帰りプラン";
  const TITLE_NEW = "仙娥滝と覚円峰、国の特別名勝・昇仙峡の渓谷美を歩く日帰りプラン";
  const DESC_OLD = "「日本一の渓谷美」と称される昇仙峡。落差30mの仙娥滝や、奇岩・覚円峰を眺めながら渓谷沿いを歩く、定番の日帰りプランです。";
  const DESC_NEW = "「日本一の渓谷美」と称される昇仙峡。落差30mの仙娥滝や、奇岩・覚円峰を眺めながら渓谷沿いを歩く、日帰りプランです。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.title !== TITLE_OLD) throw new Error("title現在値が期待と不一致");
  if (itin.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  console.log(`\n[パノラマ台]\n旧: ${PANORAMA_MEMO_OLD}\n新: ${PANORAMA_MEMO_NEW}`);
  console.log(`\n[仙娥滝]\n旧: ${SENGATAKI_MEMO_OLD}\n新: ${SENGATAKI_MEMO_NEW}`);
  console.log(`\n[石門]\n削除(スポットから外す)`);
  console.log(`\n[覚円峰]\n旧: ${KAKUENHO_MEMO_OLD}\n新: ${KAKUENHO_MEMO_NEW}`);
  console.log(`\n[昇仙峡滝上のあたり（昼食）(新規)]\n新: ${TAKIGAMI_MEMO_NEW}`);
  console.log(`\n[昇仙峡影絵の森美術館]\n旧: ${KAGEENOMORI_MEMO_OLD}\n新: ${KAGEENOMORI_MEMO_NEW}`);
  console.log(`\n[武田神社]\n旧: ${TAKEDAJINJA_MEMO_OLD}\n新: ${TAKEDAJINJA_MEMO_NEW}`);
  console.log(`\n[信玄ミュージアム]\n旧: ${SHINGEN_MEMO_OLD}\n新: ${SHINGEN_MEMO_NEW}`);
  console.log(`\n[舞鶴城公園]\n旧: ${MAIZURUJO_MEMO_OLD}\n新: ${MAIZURUJO_MEMO_NEW}`);
  console.log(`\n[タイトル]\n旧: ${TITLE_OLD}\n新: ${TITLE_NEW}`);
  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`昇仙峡ロープウェイ(パノラマ台): 座標変更なし / 時刻09:00→09:15 / 滞在40分(変更なし)`);
  console.log(`仙娥滝: 座標35.7494784,138.5660912 / 時刻09:45→10:00 / 滞在40分(変更なし) / incoming other5分(変更なし)`);
  console.log(`石門: 削除`);
  console.log(`覚円峰: 座標35.7473284,138.5652269(地理院地図) / 時刻11:05→10:45 / 滞在40分(変更なし) / incoming walk5分(直行、もと石門経由で合計20分)`);
  console.log(`昇仙峡滝上のあたり（昼食）(新規): 座標35.7509182,138.5664219 / 時刻11:34 / 滞在40分 / incoming walk9分`);
  console.log(`昇仙峡影絵の森美術館: 座標35.7509182,138.5664219(7章の例外、昼食の点と同じ) / 時刻12:12→12:15 / 滞在55分(変更なし) / incoming walk1分`);
  console.log(`武田神社: 座標変更なし / 時刻13:24→13:27 / 滞在75分(変更なし) / incoming car17分(変更なし)`);
  console.log(`信玄ミュージアム: 座標35.6852534,138.5771355 / 時刻14:44→14:47 / 滞在50分(変更なし) / incoming walk5分(変更なし)`);
  console.log(`舞鶴城公園: 座標変更なし / 時刻15:44→15:47 / 滞在60分(変更なし) / incoming car10分(変更なし)`);
  console.log("終わり: 15:47+60分=16:47（日帰りの発車16:30〜17:00の中）。帰りは歩いておよそ12分の甲府駅");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = panorama.dayId;

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
    await setDaySpotOrder(
      dayId,
      [
        { id: panorama.id, data: { memo: PANORAMA_MEMO_NEW, visitTime: t(9, 15) } },
        {
          id: sengataki.id,
          data: {
            memo: SENGATAKI_MEMO_NEW,
            lat: 35.7494784,
            lng: 138.5660912,
            visitTime: t(10, 0),
          },
        },
        {
          id: kakuenho.id,
          data: {
            memo: KAKUENHO_MEMO_NEW,
            lat: 35.7473284,
            lng: 138.5652269,
            visitTime: t(10, 45),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        {
          create: {
            name: "昇仙峡滝上のあたり（昼食）",
            lat: 35.7509182,
            lng: 138.5664219,
            memo: TAKIGAMI_MEMO_NEW,
            visitTime: t(11, 34),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
          },
        },
        {
          id: kageenomori.id,
          data: {
            memo: KAGEENOMORI_MEMO_NEW,
            lat: 35.7509182,
            lng: 138.5664219,
            visitTime: t(12, 15),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
          },
        },
        { id: takedajinja.id, data: { memo: TAKEDAJINJA_MEMO_NEW, visitTime: t(13, 27) } },
        {
          id: shingen.id,
          data: {
            memo: SHINGEN_MEMO_NEW,
            lat: 35.6852534,
            lng: 138.5771355,
            visitTime: t(14, 47),
          },
        },
        { id: maizurujo.id, data: { memo: MAIZURUJO_MEMO_NEW, visitTime: t(15, 47) } },
      ],
      { remove: [ishimon.id], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());

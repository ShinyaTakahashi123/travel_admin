/**
 * #97 3993afce 黒壁スクエアと琵琶湖畔、長浜をじっくり満喫する1泊2日。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元は1日目2か所(10:00〜13:40)・2日目1か所(09:30〜10:10)で、4か所未満・
 * 開始/終了時刻とも決まりに合っていなかった。両日とも実在の行き先を追加し、
 * 8:30〜9:30開始・16:30〜17:00終了の形にした。あわせて元の文章にあった
 * ツアーガイド口調(皆様/ご案内/お楽しみください/お楽しみいただけ)も、
 * サイト標準の「〜しましょう/〜です」口調に直した。
 *
 * 新規に追加したスポットの座標:
 * - 大通寺: 既存の公開中しおり「長浜城と黒壁スクエア、豊臣秀吉ゆかりの
 *   城下町を歩く日帰りプラン」で使用済みの値を再利用(35.382801,136.269577)
 * - 長浜八幡宮・舎那院・知善院・長浜曳山博物館・豊公園・長浜港・竹生島:
 *   Nominatimの名前検索で新たに確認(PowerShellのInvoke-RestMethod使用)
 * - 長浜鉄道スクエア: 既存の公開中しおりで使用済みの値を再利用(35.376723,136.266)
 *
 * 開いたURL(事実確認):
 * - 長浜曳山まつり ユネスコ無形文化遺産(2016年登録)・長浜曳山博物館:
 *   https://nagahama-hikiyama.or.jp/presently/ , https://nagahama-hikiyama.or.jp/event/164/ ,
 *   https://www.biwakokisen.co.jp/tourist_info/58773/
 * - 旧長浜駅舎(現存する日本最古の鉄道駅舎、明治15年): https://www.keihanhotels-resorts.co.jp/biwakohotel/sightseeing/tetsudoumuseum/
 * - 大通寺(含山軒庭園・蘭亭庭園、伏見城の移築): https://oniwa.garden/daitsu-ji-temple-garden-%E5%A4%A7%E9%80%9A%E5%AF%BA%E5%90%AB%E5%B1%B1%E8%BB%92%E5%8F%8A%E3%81%B3%E8%98%AD%E4%BA%AD%E5%BA%AD%E5%9C%92/
 * - 長浜八幡宮・舎那院(由緒): https://tabi-mag.jp/sg0222/ , https://ja.wikipedia.org/wiki/%E8%88%8E%E9%82%A3%E9%99%A2
 * - 知善院(小谷城からの移築・長浜城搦手門): https://cmeg.jp/w/castles/6177/pins/31414
 * - 豊国神社 長浜(隠れ豊国さんの由来): https://ja.wikipedia.org/wiki/%E8%B1%8A%E5%9B%BD%E7%A5%9E%E7%A4%BE_(%E9%95%B7%E6%B5%9C%E5%B8%82)
 * - 竹生島・宝厳寺・都久夫須麻神社: https://www.chikubushima.jp/origin/ , https://ja.wikipedia.org/wiki/%E9%83%BD%E4%B9%85%E5%A4%AB%E9%A0%88%E9%BA%BB%E7%A5%9E%E7%A4%BE
 * - 琵琶湖汽船 竹生島クルーズ 時刻表(長浜港10:15発、冬季も運航): https://www.biwakokisen.co.jp/cruise/chikubu/price_time/
 * - 豊公園(桜およそ600本・日本さくら名所100選): https://www.nippon.com/ja/guide-to-japan/sakura00125042/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "黒壁スクエアと琵琶湖畔、長浜をじっくり満喫する1泊2日";
const DESCRIPTION =
  "ガラス工芸体験や食べ歩きを楽しみながら、琵琶湖畔の景色も満喫する、長浜をじっくり味わう1泊2日プランです。";

const OTSUJI_MEMO =
  "旅の1日目は、大通寺から始まります。真宗大谷派の長浜別院で、地元では「長浜御坊」とも呼ばれています。本堂は、徳川家康が教如に寄進した伏見城の殿舎を、承応年間(1652〜54)にこの地へ移築したものと伝わります。含山軒庭園と蘭亭庭園はどちらも国の名勝に指定されており、含山軒庭園は伊吹山を借景にした枯山水、蘭亭庭園は反橋のかかる池泉庭園で、松や木犀の老樹が趣を添えています。歴史ある伽藍と庭園を眺めながら、長浜の旅のはじまりを感じてみてください。この後は、歩いておよそ8分、長浜八幡宮へ向かいましょう。";

const HACHIMANGU_MEMO =
  "大通寺から歩いておよそ8分、長浜八幡宮に着きます。延久元年(1069)、源義家が後三条天皇の勅願を受け、京都の石清水八幡宮から分霊を勧請して創建したと伝わる古社です。天正2年(1574)には、長浜城主となった羽柴秀吉が社殿を修復しました。毎年春に行われる長浜曳山まつりは、この八幡宮の例祭にあわせて執り行われるもので、秀吉が男子誕生の祝いに町人へ砂金を贈り、それを元手に曳山が造られたのが始まりと伝えられています。この後は、歩いてすぐ、隣の舎那院へ向かいましょう。";

const SHANAIN_MEMO =
  "長浜八幡宮のすぐ隣にある舎那院は、真言宗豊山派の寺院です。明治の神仏分離までは八幡宮の別当寺でした。平安時代前期に空海が開山したと伝わり、平安中期には源義家がここで戦勝祈願を行ったともいわれています。その後、戦火で焼失しましたが、安土桃山時代に豊臣秀吉が再建しました。静かな境内を歩きながら、神仏が共にあった時代の面影を感じてみてください。この後は、歩いておよそ11分、知善院へ向かいましょう。";

const CHIZENIN_MEMO =
  "舎那院から歩いておよそ11分、知善院に着きます。天台宗真盛派の寺院で、豊臣秀吉が長浜城を築いた際、小谷城から移してこの地の鬼門を守らせたと伝わります。表門は、長浜城の搦手門を移したものといわれ、本堂には阿弥陀三尊のほか、大坂城落城の際に持ち出されたと伝わる秀吉の木造も祀られています。長浜城の遺構をいまに伝える、静かな寺です。この後は、歩いておよそ6分、長浜曳山博物館へ向かいましょう。";

const HIKIYAMA_MEMO =
  "知善院から歩いておよそ6分、長浜曳山博物館に着きます。ユネスコ無形文化遺産に登録された長浜曳山まつりをテーマにした博物館で、実際に祭りで曳かれる4基の曳山のうち2基を常時展示しています。精巧な彫刻や金具、漆塗りの装飾を間近で見ることができ、館内では曳山の修復作業の様子や、祭りを支える後継者育成の取り組みも紹介されています。この後は、歩いておよそ5分、黒壁スクエアへ向かいましょう。";

const KUROKABE_MEMO =
  "長浜曳山博物館から歩いておよそ5分、黒壁スクエアに着きます。北国街道と大手門通りが交わる「札の辻」を中心に広がる、江戸時代から明治時代の古い建物を生かした街並みです。象徴的な「黒壁ガラス館」は、明治33年(1900)に第百三十国立銀行長浜支店として建てられたもので、黒漆喰の外観から地元の人々に「黒壁銀行」と呼ばれ親しまれてきました。銀行としての役目を終えたのち、平成元年(1989)にガラス美術館として生まれ変わり、これをきっかけに周辺一帯がガラス工芸を軸にした街並みへと整備されていきました。今では、湖北を代表する観光地として、多くの人でにぎわっています。ガラス工房での吹きガラス体験に挑戦したり、レトロな街並みを歩きながら昼食をとったり、大手門通りや北国街道沿いの町家をのぞいたりと、思い思いに長い時間を過ごせる場所です。この後は、歩いておよそ3分、豊国神社へ向かいましょう。";

const TOYOKUNI_MEMO =
  "黒壁スクエアから歩いておよそ3分、豊国神社に着きます。慶長3年(1598)に豊臣秀吉が没すると、長浜の町民はその3回忌にあたる慶長5年(1600)、遺徳を偲んでこの社を建てました。江戸時代に入ると、豊臣家を滅ぼした江戸幕府によって秀吉を祀ることが禁じられ、社殿は取り壊されてしまいます。それでも町民たちは、御神像をひそかに家々で祀り続け、明治31年(1898)の秀吉300回忌にあわせて、ようやく社殿が改めて造営されました。長浜の人々が守り抜いた秀吉への信仰の跡を、静かに見て回ってみてください。1日目はここまでです。今夜はこの近くの宿に泊まります。";

const KEIUNKAN_MEMO =
  "長浜での2日目は、慶雲館から始まります。明治20年(1887)、京都へ行幸した明治天皇の帰路にあわせ、長浜での休憩所(行在所)として、近江の実業家・浅見又蔵が私財を投じて建てた和風建築です。尾張産の総檜造りによる2階建ての建物で、建設費は当時としては破格の1万円にのぼったと伝えられています。当時の内閣総理大臣・伊藤博文が「慶雲館」と名付けたとされ、庭園は、近代日本庭園の先駆者として知られる7代目・小川治兵衛が手がけました。庭園部分は国の名勝に指定されており、毎年1月から3月にかけては「長浜盆梅展」が開かれます。静かな朝の庭園を眺めながら、明治の面影を残す建築美を楽しんでください。この後は、歩いておよそ3分、長浜鉄道スクエアへ向かいましょう。";

const TETSUDO_MEMO =
  "慶雲館から歩いておよそ3分、長浜鉄道スクエアに着きます。中心となる旧長浜駅舎は、明治15年(1882)に建てられた、現存する日本最古の鉄道駅舎です。鹿鳴館調の石灰コンクリート造りで、壁の厚さは50センチにもなります。イギリス人鉄道技師ホルサムらが設計し、施工は神戸の稲葉弥助が担当しました。明治36年(1903)に現在の長浜駅の位置へ新しい駅舎が完成するまで、20年にわたって日本の鉄道交通の要衝としての役目を果たしました。当時の駅舎や車両の展示を見ながら、鉄道黎明期の空気を感じてみてください。この後は、歩いておよそ9分、長浜港へ向かいましょう。";

const CHIKUBUSHIMA_MEMO =
  "長浜鉄道スクエアから歩いておよそ9分、長浜港に着きます。港で乗船の手続きをすませ、琵琶湖汽船のクルーズ船で竹生島へ渡ります。竹生島は、琵琶湖の北部に浮かぶ小さな島で、古くから「神の棲む島」として敬われてきました。宝厳寺は、神亀元年(724)、聖武天皇の命を受けた僧・行基が開いたと伝わる西国三十三所第三十番札所です。国宝に指定されている唐門は、豊国廟の建物を移したものと伝わります。隣り合う都久夫須麻神社は、かつて宝厳寺と一体となって祀られており、日本三弁天の一つに数えられています。龍神拝所から鳥居に向かって素焼きの皿を投げる「かわらけ投げ」でも知られています。船を降りてからの上陸時間はおよそ90分で、急な石段を上りながら、湖に浮かぶ島ならではの静けさを味わえます。この後は、船と徒歩で長浜港へ戻り、長浜城歴史博物館へ向かいましょう。";

const CASTLE_MEMO =
  "長浜港から歩いておよそ11分、長浜城歴史博物館に着きます。天正元年(1573)、織田信長に命じられて浅井氏の旧領・長浜を治めることになった羽柴(豊臣)秀吉が、初めて自らの居城として築いたと伝わるのが長浜城です。江戸時代前期に廃城となり、建物や石垣の多くは彦根城や大通寺に移築されましたが、わずかな石垣と井戸だけが跡地に残されていました。現在の天守は、昭和58年(1983)、安土桃山時代の城郭を模して復元されたもので、2階・3階では湖北や長浜ゆかりの資料、秀吉と浅井長政・石田三成ら長浜と縁の深い人物たちの足跡が紹介されています。5階の展望台からは、琵琶湖と長浜の街並みを一望できます。この後は、歩いてすぐ、豊公園へ向かいましょう。";

const HOKO_MEMO =
  "長浜城歴史博物館を出てすぐ、天守を取り囲む豊公園に着きます。長浜城の跡地一帯を整備した、琵琶湖に面した広々とした公園です。およそ600本の桜が植えられており、「日本さくら名所100選」にも選ばれています。湖岸沿いの遊歩道を歩けば、竹生島の浮かぶ湖面や対岸の山並みまで見渡せます。ベンチで一息ついたり、湖から吹く風を感じながら岸辺を歩いたりと、旅の最後にゆっくり過ごすのにちょうどよい場所です。黒壁スクエアのにぎわいから、静かな琵琶湖畔まで、長浜をじっくり満喫する1泊2日はこれで終わりです。帰りは、JR長浜駅から徒歩またはバスでどうぞ。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const kurokabe = await findSpotInItinerary(itinId, { spotName: "黒壁スクエア" });
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });
  const keiunkan = await findSpotInItinerary(itinId, { spotName: "慶雲館" });

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "大通寺",
        address: "滋賀県長浜市大宮町",
        lat: 35.382801,
        lng: 136.269577,
        memo: OTSUJI_MEMO,
        visitTime: t(8, 40),
        stayDurationMin: 65,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "長浜八幡宮",
        address: "滋賀県長浜市宮前町",
        lat: 35.3824661,
        lng: 136.2740964,
        memo: HACHIMANGU_MEMO,
        visitTime: t(9, 53),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "舎那院",
        address: "滋賀県長浜市宮前町",
        lat: 35.3831251,
        lng: 136.2750749,
        memo: SHANAIN_MEMO,
        visitTime: t(10, 30),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "知善院",
        address: "滋賀県長浜市三ツ矢元町",
        lat: 35.3836045,
        lng: 136.2671937,
        memo: CHIZENIN_MEMO,
        visitTime: t(11, 6),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    {
      create: {
        name: "長浜曳山博物館",
        address: "滋賀県長浜市元浜町",
        lat: 35.3813046,
        lng: 136.2689049,
        memo: HIKIYAMA_MEMO,
        visitTime: t(11, 37),
        stayDurationMin: 58,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    {
      id: kurokabe.id,
      data: { memo: KUROKABE_MEMO, visitTime: t(12, 40), stayDurationMin: 210, transitMode: "walk", transitDurationMin: 5, transitLine: null },
    },
    {
      create: {
        name: "豊国神社",
        address: "滋賀県長浜市南呉服町",
        lat: 35.3805,
        lng: 136.264722,
        memo: TOYOKUNI_MEMO,
        visitTime: t(16, 13),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      id: keiunkan.id,
      data: { memo: KEIUNKAN_MEMO, visitTime: t(9, 0), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      create: {
        name: "長浜鉄道スクエア",
        address: "滋賀県長浜市北船町",
        lat: 35.376723,
        lng: 136.266,
        memo: TETSUDO_MEMO,
        visitTime: t(9, 33),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "竹生島",
        address: "滋賀県長浜市早崎町",
        lat: 35.4222061,
        lng: 136.1436993,
        memo: CHIKUBUSHIMA_MEMO,
        visitTime: t(10, 15),
        stayDurationMin: 160,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
    {
      id: castle.id,
      data: { memo: CASTLE_MEMO, visitTime: t(13, 6), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 11, transitLine: null },
    },
    {
      create: {
        name: "豊公園",
        address: "滋賀県長浜市公園町",
        lat: 35.3762635,
        lng: 136.2625104,
        memo: HOKO_MEMO,
        visitTime: t(14, 40),
        stayDurationMin: 120,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, spots] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
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
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE, description: DESCRIPTION } });
    // 長浜城歴史博物館は元は1日目のスポットだが、2日目に組み直すため先にdayIdを移す
    await tx.spot.update({ where: { id: castle.id }, data: { dayId: day2.id } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

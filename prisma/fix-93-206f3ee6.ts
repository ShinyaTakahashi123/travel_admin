/**
 * #93 206f3ee6（天赦園と九島、宇和島藩主の庭園と離島風景を楽しむ1泊2日）
 * 通常の見直し。既存はD1天赦園1か所(10:00〜10:50)・D2九島1か所(09:30〜10:30)
 * のみで、両日とも4か所未満・終了とも規定外。両方の本文がツアーガイド口調
 * ("皆様、本日ご案内するのは"等)だったため書き直した。
 *
 * 【企画運営の案(23:21)を採用】D1は天赦園→伊達博物館→寺町(宇和津彦神社・
 * 等覚寺・大隆寺)→城下(桑折氏武家長屋門・歴史資料館)→和霊神社の順(戻らない
 * 道をOSM実測で確認)。説明文の前提により宇和島城・闘牛は使わない。
 * D2は鳥屋ヶ森(YAMAPの実測で駐車場から登山口まで70分、登山口から山頂まで
 * 65分の本格的な登山コースと判明したため、観光のしおりには使わない)を
 * 見送り、既存メモにあった願成寺・遠見場(狼煙場跡)を独立したスポットにし、
 * 九島大橋を渡って戻ったあとの行き先として樺崎砲台跡・きさいや広場を追加。
 *
 * 開いたURL:
 * - 伊達博物館(展示・開館時間): https://travel.yahoo.co.jp/kanko/spot-00002905/
 * - 桑折氏武家長屋門(由緒・移築の経緯): https://www.city.uwajima.ehime.jp/site/sizen-bunka/5koorimon.html
 * - 宇和島市立歴史資料館(建物の由来・建築年): https://www.city.uwajima.ehime.jp/site/siryoukan/rekishitop.html
 * - 伊達家墓所(等覚寺・大隆寺、歴代藩主の埋葬先): https://www.city.uwajima.ehime.jp/site/sizen-bunka/103104datekebosyo.html
 * - 願成寺(鯨大師、由緒): うわじま観光ガイド https://www.uwajima.org/spot/kusima.html
 * - 遠見場(狼煙場跡、所要時間15分): 同上
 * - 樺崎砲台跡(築造年・大砲): WebSearch集約(愛媛県観光サイト・トリップアドバイザー等)
 * - きさいや広場(牛鬼館・真珠館・アクセス): https://tabiiro.jp/leisure/s/206306-uwajima-kisaiyahiroba/
 * - 九島⇔宇和島市街のバス(宇和島自動車、はまぐり停留所): WebSearch集約
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "伊達家ゆかりの大名庭園・天赦園と、九島大橋で渡れる離島・九島。宇和島城や闘牛とは違う、城下の史跡めぐりと離島風景を楽しむ1泊2日です。";

const TENSHAEN_MEMO =
  "宇和島藩2代藩主・伊達宗利が海を埋め立てて築いた「浜御殿」を起源とする庭園です。寛文12年(1672)に築かれ、文久3年(1863)、のちに百歳近くまで長生きしたことで知られる7代藩主・伊達宗紀が隠居後の住まいとして移り住み、慶応2年(1866)、現在の池泉回遊式庭園が完成しました。「天赦園」という名は、藩祖・伊達政宗が隠居後に詠んだ漢詩「馬上少年過ぐ 世は平にして白髪多し 残躯は天の赦す所 楽しまずして是を如何せん」にちなんで名付けられたと伝えられています。園内には、伊達家の家紋「竹に雀」にちなんで多くの竹が植えられ、藤棚や花菖蒲も見事で、国の名勝に指定されています。この後は、歩いておよそ3分、宇和島市立伊達博物館へ向かいましょう。";

const DATE_MUSEUM_MEMO =
  "天赦園から歩いておよそ3分、宇和島市立伊達博物館に着きます。伊達家に伝わる武具甲冑や書画、陶磁器、衣装などを展示しており、なかでも婚礼調度品の展示が充実しています。伊達家ゆかりの品々を通して、宇和島藩の歴史に触れることができます。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ18分、宇和津彦神社へ向かいましょう。";

const UWATSUHIKO_MEMO =
  "伊達博物館から歩いておよそ18分、宇和津彦神社に着きます。祭神は宇和津彦命ほか二柱で、創建の年代ははっきりしませんが、平安時代の記録にすでにその名が見えます。寛永9年(1632)、初代宇和島藩主・伊達秀宗が城下を整えた際、この地に社を建てて遷座し、藩の一の宮と定めたと伝わります。静かに、敬意をもってお参りください。この後は、歩いておよそ5分、等覚寺へ向かいましょう。";

const TOGAKUJI_MEMO =
  "宇和津彦神社から歩いておよそ5分、等覚寺に着きます。龍華山等覚寺といい、大隆寺とともに宇和島藩主伊達家の菩提寺です。初代藩主・伊達秀宗の没後、2代から4代までの藩主がこの寺に葬られ、以来、6代・8代の藩主も等覚寺に葬られました。歴代藩主の墓所は、市の史跡に指定されています。境内では静かに、敬意をもってお参りください。この付近で昼食にするのもよいでしょう。この後は、歩いておよそ5分、大隆寺へ向かいましょう。";

const DAIRYUJI_MEMO =
  "等覚寺から歩いておよそ5分、大隆寺に着きます。金剛山大隆寺といい、もとは正眼院という名でしたが、5代藩主・伊達村候が生前から自らの墓所と定めていたことから、没後にその法名にちなんで大隆寺と改められました。以来、7代・9代の藩主もこの寺に葬られ、等覚寺とあわせて歴代藩主の墓所は市の史跡に指定されています。境内では静かに、敬意をもってお参りください。この後は、歩いておよそ20分、桑折氏武家長屋門へ向かいましょう。";

const KOORIMON_MEMO =
  "大隆寺から歩いておよそ20分、桑折氏武家長屋門に着きます。江戸時代、宇和島藩の家老を務めた桑折氏の屋敷の長屋門で、江戸中期の建造と考えられています。腰板などは奥州から取り寄せたと伝わります。戦後の道路拡張にともない、桑折家から市に寄付され、昭和27年(1952)に現在地へ移築されました。移築にあたって左側の大部分が切り取られたため、往時よりも規模は小さくなっていますが、右側には馬屋、左側には門番や使用人の部屋があった、当時の武家屋敷のつくりをしのぶことができます。この後は、歩いておよそ20分、宇和島市立歴史資料館へ向かいましょう。";

const REKISHI_MEMO =
  "桑折氏武家長屋門から歩いておよそ20分、宇和島市立歴史資料館に着きます。明治17年(1884)、宇和島広小路に宇和島警察署として建てられた建物で、和と洋の様式をあわせ持つ「擬洋風建築」として知られています。昭和28年に西海町へ移築されたのち、平成4年(1992)にこの地に戻され、平成8年(1996)には国の登録有形文化財に指定されました。館内では、常設展のほか、大正から昭和にかけて活躍した宇和島出身の画家・高畠華宵に関する展示も見られます。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いておよそ18分、和霊神社へ向かいましょう。";

const WAREI_MEMO =
  "宇和島市立歴史資料館から歩いておよそ18分、和霊神社に着きます。漁業をはじめとする産業の神として、中四国に広く信仰を集める和霊信仰の総本山です。祭神の山家清兵衛は、初代藩主・伊達秀宗のもとで産業の振興や民政の安定に力を尽くした家老でした。大鳥居をくぐり、太鼓橋を渡った先の随神門には、日本最大級ともいわれる「おたふく」「たかはな」の面が掲げられ、入母屋造の本殿が静かなたたずまいを見せています。境内では静かに、敬意をもってお参りください。今夜は宇和島市内の宿に泊まります。";

const KUSHIMA_MEMO =
  "天赦園と伊達博物館から一夜明け、今日は九島へ向かいます。宇和島市街地の西に浮かぶ、周囲およそ12kmの島で、平成28年(2016)に九島大橋が開通したことで、車でも渡れるようになりました。橋の上からは、青く穏やかな宇和島湾を見渡すことができます。この後は、歩いておよそ27分、願成寺へ向かいましょう。";

const GANJOJI_MEMO =
  "九島大橋から歩いておよそ27分、願成寺に着きます。遍照山願成寺といい、弘法大師が開いたと伝えられ、地元では「鯨大師」とも呼ばれています。この一帯がかつて鯨谷と呼ばれていたことにちなむといわれ、弘法大師がこの地に渡るとき、渡し舟を頼んだ農夫のために、杖で地面を打って清水を湧かせたという伝説も残っています。かつては四国八十八ヶ所の番外札所でしたが、寛永8年(1631)、渡海の不便から寺は城下へ移され、大師堂だけがこの地に残りました。静かに、敬意をもってお参りください。この後は、細く急な山道を歩いておよそ15分、遠見場へ向かいましょう。";

const TOMIBA_MEMO =
  "願成寺から急な山道を歩いておよそ15分、遠見場に着きます。江戸時代、参勤交代の大名行列の位置を城下へ知らせるために設けられた狼煙場の跡で、佐田岬から城下までに置かれた5か所のうち、もっとも城下に近い場所だったと伝わります。山道は足元が悪いところもあるので、歩きやすい靴で気をつけて歩きましょう。小さく開けた場所からは、宇和海の穏やかな眺めが広がり、山道を登ってきた疲れを癒してくれます。この後は、来た道を戻り、バスでおよそ35分、樺崎砲台跡へ向かいましょう。この先は徒歩では遠いため、宇和島自動車のバスを利用します。";

const HOUDAI_MEMO =
  "遠見場から来た道を戻り、バスでおよそ35分、樺崎砲台跡に着きます。安政2年(1855)、外国船から宇和島湾を守るために築かれた洋式の砲台の跡で、10か月をかけて築造され、36ポンドカノン砲が5門備えられていたと伝わります。オランダ流の砲術を取り入れた、当時としては先進的な砲台でした。この後は、歩いておよそ12分、道の駅みなとオアシスうわじま きさいや広場へ向かいましょう。";

const KISAIYA_MEMO =
  "樺崎砲台跡から歩いておよそ12分、道の駅みなとオアシスうわじま きさいや広場に着きます。宇和島港のそばにある道の駅で、フードコートでは宇和島の郷土料理・鯛めしを味わえます。ここで昼食にするのもよいでしょう。館内には、宇和島の伝統行事「うわじま牛鬼まつり」の歴史を紹介する「牛鬼館」や、養殖真珠のアクセサリーを扱う「真珠館」も併設されています。天赦園から続いた宇和島の旅は、ここで締めくくりです。宇和島駅へは、歩いておよそ15分、またはバスで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const tenshaen = await findSpotInItinerary(itinId, { spotName: "天赦園" });
  const kushima = await findSpotInItinerary(itinId, { spotName: "九島" });

  const day1Spots: SpotOrderItem[] = [
    { id: tenshaen.id, data: { memo: TENSHAEN_MEMO, visitTime: t(10, 0), stayDurationMin: 50 } },
    {
      create: {
        name: "宇和島市立伊達博物館",
        address: "愛媛県宇和島市御殿町9-14",
        lat: 33.2159805,
        lng: 132.562659,
        memo: DATE_MUSEUM_MEMO,
        visitTime: t(10, 53),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "宇和津彦神社",
        address: "愛媛県宇和島市野川新",
        lat: 33.2152162,
        lng: 132.5730878,
        memo: UWATSUHIKO_MEMO,
        visitTime: t(11, 56),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
    {
      create: {
        name: "等覚寺",
        address: "愛媛県宇和島市野川",
        lat: 33.2171585,
        lng: 132.5740074,
        memo: TOGAKUJI_MEMO,
        visitTime: t(12, 31),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "大隆寺",
        address: "愛媛県宇和島市宇和津町",
        lat: 33.2152819,
        lng: 132.5763182,
        memo: DAIRYUJI_MEMO,
        visitTime: t(13, 6),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "桑折氏武家長屋門",
        address: "愛媛県宇和島市鶴島町",
        lat: 33.220924,
        lng: 132.5651523,
        memo: KOORIMON_MEMO,
        visitTime: t(13, 56),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "宇和島市立歴史資料館",
        address: "愛媛県宇和島市住吉町2丁目",
        lat: 33.226452,
        lng: 132.554664,
        memo: REKISHI_MEMO,
        visitTime: t(15, 1),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 20,
        transitLine: null,
      },
    },
    {
      create: {
        name: "和霊神社",
        address: "愛媛県宇和島市和霊元町4丁目",
        lat: 33.2299382,
        lng: 132.5653263,
        memo: WAREI_MEMO,
        visitTime: t(16, 4),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    {
      id: kushima.id,
      data: {
        memo: KUSHIMA_MEMO,
        visitTime: t(9, 30),
        stayDurationMin: 20,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      create: {
        name: "願成寺",
        address: "愛媛県宇和島市蛤",
        lat: 33.231876,
        lng: 132.525269,
        memo: GANJOJI_MEMO,
        visitTime: t(10, 17),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 27,
        transitLine: null,
      },
    },
    {
      create: {
        name: "遠見場",
        address: "愛媛県宇和島市蛤(九島)",
        lat: 33.231876,
        lng: 132.525269,
        memo: TOMIBA_MEMO,
        visitTime: t(11, 12),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "樺崎砲台跡",
        address: "愛媛県宇和島市住吉町2丁目",
        lat: 33.2268428,
        lng: 132.5546931,
        memo: HOUDAI_MEMO,
        visitTime: t(12, 17),
        stayDurationMin: 30,
        transitMode: "bus",
        transitDurationMin: 35,
        transitLine: "宇和島自動車 三浦半島線",
      },
    },
    {
      create: {
        name: "道の駅みなとオアシスうわじま きさいや広場",
        address: "愛媛県宇和島市弁天町1丁目318-16",
        lat: 33.2221433,
        lng: 132.5582876,
        memo: KISAIYA_MEMO,
        visitTime: t(12, 59),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 12,
        transitLine: null,
      },
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
  printSchedule("D2", day2Spots);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());

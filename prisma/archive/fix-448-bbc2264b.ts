/**
 * #448 bbc2264b（大津 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜11:40（疏水 →（車）大津館）。北から南へ、電車と歩きでめぐる（戻らない）
 *   びわ湖大津館 9:00〜10:00 →（歩き25分）近江神宮（新規）10:25〜11:20 →（歩き10分）近江大津宮錦織遺跡（新規）11:30〜11:50
 *   →（京阪石山坂本線20分）旧大津公会堂（新規・昼食）12:10〜13:05 →（歩き10分）琵琶湖疏水（大津閘門）13:15〜13:45
 *   →（歩き10分）三井寺（新規）13:55〜15:10 →（歩き5分）大津市歴史博物館（新規）15:15〜16:30
 *   閉まる時刻: 大津館 9:00〜21:00（イングリッシュガーデンは3〜11月 9:00〜17:00、12〜2月は休園）、近江神宮 6:00〜18:00（時計館宝物館 9:30〜16:30・月曜休館）、
 *   三井寺 9:00〜16:30（受付16:00まで）、大津市歴史博物館 9:00〜17:00（入館16:30まで）・月曜休館。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉で、疏水の座標は京都市山科区（34.9998,135.799）になっていたので、大津の閘門の点に直す
 * 本文の出典: びわ湖大津館 https://www.biwako-otsukan.jp/goannai.php ・/access.php 、大津市 https://www.city.otsu.lg.jp/soshiki/035/1809/g/koen/koen/1390489052308.html （大津館）・
 *   https://www.city.otsu.lg.jp/soshiki/010/2406/o/69160.html （琵琶湖疏水施設の国宝・重要文化財指定）、近江神宮 http://oumijingu.org/pages/90/ ・/pages/98/ ・/pages/85/ 、
 *   びわ湖大津トラベルガイド https://otsu.or.jp/thingstodo/spot99 （錦織遺跡）、滋賀県観光情報 https://www.biwako-visitors.jp/spot/detail/19105/ （旧大津公会堂）・/spot/detail/92/ （三井寺）、
 *   日本遺産 琵琶湖疏水 https://biwakososui.city.kyoto.lg.jp/story/ ・/place/detail/2 （大津閘門）・/place/detail/4 （第1トンネル入口）、三井寺 https://miidera1200.jp/information 、
 *   大津市歴史博物館 https://www.rekihaku.otsu.shiga.jp/guide/index.html ・/event/jyousetsu/theme_6.html
 * 座標の出典: OSM（びわ湖大津館 node 9587065731／近江神宮 node 2567367907／近江大津宮錦織遺跡 第一地点 way 723943298／旧大津公会堂 way 270862521／
 *   大津閘門 node 576884616／三井寺（園城寺）node 4619790890／大津市歴史博物館 way 468934478）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-448-bbc2264b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "bbc2264b-5108-4228-8d22-35f42dd603c7";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "琵琶湖のほとりに建つ、昭和9年の旧ホテル・びわ湖大津館から、天智天皇をお祀りする近江神宮、近江大津宮の跡へ。昼食は旧大津公会堂で。午後は琵琶湖疏水の大津閘門から三井寺へ歩き、大津市歴史博物館で古都大津の歩みをたどる、湖畔と歴史の日帰りさんぽです。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["琵琶湖疏水", "びわ湖大津館"].join()) throw new Error("構成が想定と違います");
  const [sosui, otsukan] = day.spots;

  const order = [
    { id: otsukan.id, data: { visitTime: t(9, 0), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.026715, lng: 135.867743, address: "滋賀県大津市柳が崎5-35",
      memo: "この旅は電車と歩きでめぐります。JR湖西線の大津京駅か、京阪石山坂本線の近江神宮前駅から歩いて約20分で、琵琶湖のほとりの柳が崎湖畔公園にある、びわ湖大津館へ。1934年（昭和9年）に、外国人観光客を迎えるための県内初の国際観光ホテルとして建てられた、旧琵琶湖ホテルの本館です。東京の歌舞伎座や明治生命館などで知られる岡田信一郎がつくった岡田建築事務所の設計で、桃山様式と呼ばれる和風の外観と、洋風の内装を組み合わせています。ホテルだったころは「湖国の迎賓館」として、昭和天皇をはじめ多くの皇族や、ヘレン・ケラー、川端康成などを迎えました。1998年にホテルが移ったあと、取り壊しを惜しむ市民の声を受けて大津市が改修して残し、2002年から文化施設として開かれています。となりのイングリッシュガーデンは冬のあいだ休園するので、公式の案内で確かめましょう。" } },
    { create: { name: "近江神宮", visitTime: t(10, 25), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 25, transitLine: null, lat: 35.03244, lng: 135.851309, address: "滋賀県大津市神宮町",
      memo: "大津館から歩いて、近江神宮へ。飛鳥から近江大津宮へ都を移した天智天皇をお祀りする神社で、昭和15年（1940年）に創建されました。天智天皇が漏刻（水時計）をつくって時を知らせ始めたとされることから、6月10日の「時の記念日」が定められています。境内には、日本の時刻制度発祥の地に設けられた、わが国最初の時計博物館とされる「時計館宝物館」もあります。休館日は公式の案内で確かめましょう。" + RESPECT } },
    { create: { name: "近江大津宮錦織遺跡", visitTime: t(11, 30), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.028272, lng: 135.854968, address: "滋賀県大津市錦織",
      memo: "近江神宮から近江神宮前駅の方へ歩いて、近江大津宮錦織遺跡へ。667年、天智天皇は都を奈良の飛鳥から近江大津宮へ移しましたが、672年の壬申の乱で都は廃れました。その後長いあいだ宮の場所ははっきりしませんでしたが、昭和40年代に宮跡らしい遺構が見つかり、国の史跡に指定されています。" } },
    { create: { name: "旧大津公会堂", visitTime: t(12, 10), stayDurationMin: 55, transitMode: "train", transitDurationMin: 20, transitLine: "京阪石山坂本線", lat: 35.010436, lng: 135.865345, address: "滋賀県大津市浜大津",
      memo: "近江神宮前駅から京阪石山坂本線でびわ湖浜大津駅へ。駅から歩いてすぐの旧大津公会堂は、昭和9年（1934年）に「大津公会堂」として建てられ、名前や使い方を変えながら市民の交流の場として親しまれてきた建物です。レトロな外観をそのままに、今は館内にレストランが入り、景観重要建造物にも指定されています。ここで昼食にしましょう。" } },
    { id: sosui.id, data: { name: "琵琶湖疏水（大津閘門）", visitTime: t(13, 15), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.012317, lng: 135.857769, address: "滋賀県大津市三井寺町",
      memo: "公会堂から西へ歩いて、琵琶湖疏水の大津閘門へ。琵琶湖疏水は、東京への遷都で人口が大きく減った京都を立て直すため、第3代京都府知事の北垣国道が計画し、工部大学校を卒業したばかりの田邉朔郎を担当者に迎えて、明治18年（1885年）に工事が始まり、明治23年（1890年）に第1疏水が完成しました。大津閘門は、琵琶湖と疏水の水位の差を調整して舟を通すための門で、日本初のレンガ造りの本格的な閘門として注目を集めました。疏水沿いを西へ歩くと、伊藤博文の揮ごうによる「気象萬千」の扁額を掲げた第1トンネルの入口も見られます。第1トンネルは、令和7年（2025年）に国宝に指定されました。水辺では、柵の外に出ないようにしましょう。" } },
    { create: { name: "三井寺（園城寺）", visitTime: t(13, 55), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.01339, lng: 135.852847, address: "滋賀県大津市園城寺町",
      memo: "疏水沿いを歩いて、三井寺（園城寺）へ。天台寺門宗の総本山で、境内に天智・天武・持統の三天皇の産湯に使われたとされる霊泉があることから「御井の寺」と呼ばれ、のちに「三井寺」と通称されるようになりました。国宝の金堂をはじめ、西国第十四番札所の観音堂、釈迦堂、唐院など多くのお堂が並び、国宝・重要文化財は100点あまりにのぼります。近江八景の「三井の晩鐘」や、弁慶の引摺り鐘でも知られます。" + RESPECT } },
    { create: { name: "大津市歴史博物館", visitTime: t(15, 15), stayDurationMin: 75, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.01545, lng: 135.85278, address: "滋賀県大津市御陵町2-2",
      memo: "三井寺から北へ歩いてすぐ、大津市歴史博物館へ。大津の歴史と文化を紹介する博物館で、常設展示では、発掘調査の成果をもとに近江大津宮の中心部の建物の配置を再現した復元模型や、大津宮の周りの古代寺院などを紹介していて、午前に訪ねた大津宮の歴史をふり返ることができます。休館日は公式の案内で確かめましょう。琵琶湖のほとりの洋館と、疏水や古都大津の歴史をめぐる旅を、ここで締めくくりましょう。帰りは、京阪石山坂本線の大津市役所前駅か三井寺駅から。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 大津館 9:00 → 近江神宮 10:25 → 錦織遺跡 11:30 → 旧大津公会堂 12:10〜13:05 → 大津閘門 13:15 → 三井寺 13:55〜15:10 → 歴史博物館 15:15〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

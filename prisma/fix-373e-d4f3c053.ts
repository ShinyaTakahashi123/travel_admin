/**
 * #373の続き。企画運営・法務の指摘に対応した大幅な組み直し。
 *
 * 企画運営の指摘:
 * 1. 決まりA: 近い場所どうしなのに滞在が長すぎた(ネコの細道60分・艮神社55分・
 *    昼食90/100分・各寺60〜75分)。小さな寺社・路地は20〜35分、昼食は
 *    70〜110分(食事+散策)に見直し、空いた時間には#491と重ならない新しい
 *    行き先(おのみち歴史博物館・おのみち映画資料館・御袖天満宮)を追加した。
 *    #491(千光寺と浄土寺…尾道・広島3泊4日)のDay1と、千光寺・美術館・
 *    艮神社・天寧寺・西國寺・浄土寺・持光寺が重なるが、西郷寺・尾道渡船・
 *    おのみち歴史博物館・おのみち映画資料館・御袖天満宮は重ならない。
 * 2. 乗り継ぎの空白(美術館・浄土寺・ネコの細道の前の区間)を埋めた。
 * 3-4. 法務とあわせて座標を修正、スポット名とつなぎの文の表記をそろえた
 *    (「猫の細道」ではなく「ネコの細道」に統一)。
 * 5. 1日目(千光寺)・2日目(天寧寺)それぞれの書き出しに、どう来たかの一文を
 *    確認・追加した。
 * 6. 西郷寺の「最古」に、直接ヘッジをつけた。
 *
 * 法務の指摘(記録8064399):
 * ① 尾道渡船に、乗船時の案内に従う一文を追加。
 * ② 座標4か所を修正: 美術館(w679798418、34.410001,133.195726)、
 *    ネコの細道(w599997417、34.410557,133.200455)、尾道渡船(n8255588836
 *    「土堂桟橋(尾道渡船)」、34.406650,133.200783)、海岸通り(n8273486120
 *    「中央桟橋」、34.407426,133.202553、推定)。
 *
 * 新しい時刻:
 * Day1(09:00〜16:30、8か所): 千光寺(45)→美術館(65)→持光寺(25)→
 *   おのみち歴史博物館(25)→おのみち映画資料館(25)→昼食(70)→西國寺(50)→
 *   浄土寺(65)
 * Day2(09:30〜16:47、7か所): 天寧寺(60)→ネコの細道(35)→艮神社(35)→
 *   御袖天満宮(30)→昼食(110)→西郷寺(55)→尾道渡船(55)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-373e-d4f3c053.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "d4f3c053-82a3-4add-8171-d77bbdb1cd63";
const DAY1_ID = "e708eacb-a5bc-45c4-8e50-b75d9b2ad14b";
const DAY2_ID = "d2670dc7-26f6-4415-b272-7d108d5f3a8e";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const senkoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千光寺" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "尾道市立美術館" } });
  const jikoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "持光寺" } });
  const lunch1 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "本通り商店街で昼食" } });
  const saikokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "西國寺" } });
  const jodoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄土寺" } });

  const tenneiji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "天寧寺" } });
  const nekohodo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "ネコの細道" } });
  const ushitora = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "艮神社" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "海岸通りで昼食" } });
  const saigoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "西郷寺" } });
  const tosen = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "尾道渡船" } });

  if (senkoji.stayDurationMin === 45) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "安藤忠雄設計の尾道市立美術館と、猫たちが暮らす細い路地「ネコの細道」。千光寺や浄土寺をはじめとする尾道の寺町ならではの古刹、映画ゆかりの資料館、対岸の向島へ渡る渡船も訪ね歩く、坂の町・尾道の路地裏散策を楽しむ1泊2日です。",
    },
  });

  await setDaySpotOrder(DAY1_ID, [
    {
      id: senkoji.id,
      data: {
        stayDurationMin: 45,
        memo: "尾道駅からバスでおよそ5分の長江口から、千光寺山ロープウェイで山頂まで登り、尾道の旅は千光寺から始まります。大同元年(806)、弘法大師によって開かれたと伝えられる古寺で、尾道三山の一つ・千光寺山の中腹に位置しています。貞享3年(1686)に建てられた、舞台づくりの本堂は「赤堂」とも呼ばれ、朱色の外観が特徴です。本尊の千手観音は33年に一度だけ開帳される秘仏で、聖徳太子の作とも伝えられています。本堂の裏手には「くさり山」と呼ばれる岩場があり、鎖をつたって登る修行の場として知られています。尾道水道を見下ろす眺めも楽しみながら、敬意をもって境内を巡りましょう。見学を終えたら、歩いて尾道市立美術館へ向かいましょう。",
      },
    },
    {
      id: bijutsukan.id,
      data: {
        lat: 34.410001,
        lng: 133.195726,
        visitTime: T(10, 0),
        stayDurationMin: 65,
        memo: "千光寺から歩いて15分ほど、次に訪れるのは尾道市立美術館です。昭和55年(1980)、NHK尾道放送局の跡地に開館した美術館で、平成15年(2003)、建築家・安藤忠雄の設計によって改築され、今の姿に生まれ変わりました。国の重要文化財・西郷寺本堂を思わせる寄棟造の本館と、打ち放しコンクリートにガラス張りの外壁を組み合わせた新館、対照的な2つの建物から成り立っています。千光寺公園の一角という立地から、館内の展示とあわせて、尾道の街並みや尾道水道を望む眺めも魅力の一つです。現代アートの企画展を中心に、様々な展覧会が催されています。伝統的な建築様式と、安藤建築ならではのモダンな意匠、両方を味わいながら、じっくりと見学しましょう。見学を終えたら、歩いて持光寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
      },
    },
    {
      id: jikoji.id,
      data: {
        visitTime: T(11, 20),
        stayDurationMin: 25,
        memo: "尾道市立美術館から歩いて15分ほど、次に訪れるのは持光寺です。境内の「延命門」と呼ばれる石門は、裏山の花崗岩37個を組み合わせて造られた珍しい門で、本来は上に建物を乗せ、竜宮造りの門にする構想だったと伝えられています。住職の案内のもと、粘土で仏様を形づくる「にぎり仏」の体験でも親しまれている寺です。坂の町らしい石段の参道を、敬意をもって歩きましょう。見学を終えたら、歩いておのみち歴史博物館へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
      },
    },
    {
      create: {
        name: "おのみち歴史博物館",
        address: "尾道市久保1丁目14-1",
        lat: 34.409785,
        lng: 133.204943,
        visitTime: T(12, 1),
        stayDurationMin: 25,
        memo: "持光寺から歩いて16分ほど、次に訪れるのはおのみち歴史博物館です。国の重要文化財・旧尾道銀行本店を改装した博物館で、大正ロマンの漂う館内には、尾道ゆかりの豪商や文人たちの美術品が並びます。北前船で栄えた江戸時代の尾道の様子を伝える絵屏風の複製画や、尾道出身の小説家・林芙美子にまつわる資料も展示されています。かつて銀行だった名残の大金庫の鉄扉も見どころです。見学を終えたら、歩いておのみち映画資料館へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
      },
    },
    {
      create: {
        name: "おのみち映画資料館",
        address: "尾道市久保1丁目14-10",
        lat: 34.409563,
        lng: 133.205327,
        visitTime: T(12, 28),
        stayDurationMin: 25,
        memo: "おのみち歴史博物館から歩いて2分ほど、次に訪れるのはおのみち映画資料館です。古い土蔵を活用した資料館で、尾道を舞台にした数々の映画のロケ地写真やポスター、ミニシアターを楽しめます。尾道出身の映画監督・大林宣彦が、故郷を舞台に手がけた「転校生」「時をかける少女」「さびしんぼう」の尾道三部作をはじめ、尾道にゆかりのある映画の世界にふれましょう。見学を終えたら、歩いてお昼の場所へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: lunch1.id,
      data: {
        visitTime: T(12, 58),
        stayDurationMin: 70,
        memo: "おのみち映画資料館から歩いて5分ほど、お昼は本通り商店街で食事をとりましょう。JR尾道駅から東へおよそ1.2kmにわたって続くアーケード商店街で、昔ながらの商店と新しい店が入り混じる、レトロな町並みが続いています。尾道水道沿いの海岸通りには、おしゃれな飲食店も並んでいます。坂の町ならではの商店街の雰囲気を楽しみながら、ゆっくりと食事をとりましょう。お腹を満たしたら、バスで西國寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
    {
      id: saikokuji.id,
      data: {
        visitTime: T(14, 20),
        stayDurationMin: 50,
        memo: "本通り商店街からバスでおよそ12分、次に訪れるのは西國寺です。天平年間(729〜749)、行基によって開かれたと伝えられる真言宗の大寺院で、尾道水道を見下ろす高台に広がっています。慶安元年(1648)に建てられた仁王門には、健脚を祈願して奉納された、長さ2メートルを超える大わらじが掛けられており、寺のシンボルとなっています。永享元年(1429)、室町幕府6代将軍・足利義教の寄進により建てられた三重塔は、国の重要文化財に指定されています。急な石段を上りながら、敬意をもって境内を巡りましょう。見学を終えたら、歩いて浄土寺へ向かいましょう。",
      },
    },
    {
      id: jodoji.id,
      data: {
        visitTime: T(15, 25),
        stayDurationMin: 65,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
        memo: "西國寺から歩いて15分ほど、今日最後に訪れるのは浄土寺です。推古天皇の時代、聖徳太子によって開かれたと伝えられる古刹で、境内全体が国宝に指定されている、全国でも数少ない寺の一つとされています。元亨元年(1325)の火災のあと、嘉暦2年(1327)に再建された本堂と、嘉暦4年(1329)に建てられた多宝塔が、ともに国宝に指定されています。本堂は、平安時代以来の様式に、鎌倉時代に伝わった中国の建築様式を取り入れた、折衷様の建物として知られています。山門や茶室「露滴庵」なども国の重要文化財に指定されており、見どころの多い境内を、敬意をもってじっくりと巡りましょう。見学を終えたら、今夜はこの近くの宿に宿泊します。",
      },
    },
  ]);

  await setDaySpotOrder(DAY2_ID, [
    {
      id: tenneiji.id,
      data: {
        stayDurationMin: 60,
        memo: "宿から歩いておよそ15分、尾道の旅の2日目は天寧寺から始まります。貞治6年(1367)、室町幕府2代将軍・足利義詮の寄進によって開かれた曹洞宗の寺です。創建時は五重塔でしたが、江戸時代に上層部が取り払われ、今は「海雲塔」と呼ばれる三重塔として残り、国の重要文化財に指定されています。境内の羅漢堂には、表情豊かな五百羅漢の像が並び、見ごたえがあります。坂の町らしい石段の参道を、敬意をもって上りましょう。見学を終えたら、歩いてネコの細道へ向かいましょう。",
      },
    },
    {
      id: nekohodo.id,
      data: {
        lat: 34.410557,
        lng: 133.200455,
        visitTime: T(10, 32),
        stayDurationMin: 35,
        memo: nekohodo.memo?.replace(
          "天寧寺から歩いて8分ほど、次に訪れるのは猫の細道です。",
          "天寧寺から歩いて2分ほど、次に訪れるのはネコの細道です。"
        ),
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: ushitora.id,
      data: {
        visitTime: T(11, 9),
        stayDurationMin: 35,
        memo: "ネコの細道から歩いて2分ほど、次に訪れるのは艮神社です。大同元年(806)の創建と伝えられ、尾道市内では最も古いとされる神社です。樹齢900年から1000年ともいわれる、幹回りおよそ7メートルの大楠が、広島県の天然記念物に指定されています。坂道の町並みを見下ろす、静かな境内で知られ、映画のロケ地としても使われてきました。静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて御袖天満宮へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      create: {
        name: "御袖天満宮",
        address: "尾道市長江2丁目",
        lat: 34.413402,
        lng: 133.20215,
        visitTime: T(11, 50),
        stayDurationMin: 30,
        memo: "艮神社から歩いて6分ほど、次に訪れるのは御袖天満宮です。延喜元年(901)、無実の罪で大宰府へ向かう途中の菅原道真が、この地に立ち寄ったと伝えられる神社です。道真をもてなした里人たちに、自らの衣の袖を御神体として残したことが、名前の由来とされています。社殿前に続く55段の石段は、一枚の長さ5.2メートルの石から作られた見事なもので、映画「転校生」のロケ地としても知られています。室町時代の作とされる狛犬も見どころです。静かに、敬意をもってお参りしましょう。見学を終えたら、歩いてお昼の場所へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
    {
      id: lunch2.id,
      data: {
        lat: 34.407426,
        lng: 133.202553,
        visitTime: T(12, 32),
        stayDurationMin: 110,
        memo: "御袖天満宮から歩いて12分ほど、お昼は尾道水道沿いの海岸通りで食事をとりましょう。対岸の向島を望む海沿いには、カフェや食事処が並んでいます。行き交う船を眺めながら食事を楽しんだあとは、海岸通りをぶらぶらと歩いて、尾道水道の風景を満喫しましょう。見学を終えたら、歩いて西郷寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
      },
    },
    {
      id: saigoji.id,
      data: {
        visitTime: T(14, 38),
        stayDurationMin: 55,
        memo: "海岸通りから歩いて16分ほど、次に訪れるのは西郷寺です。正慶年間(1332〜1334)、時宗の僧・他阿一心によって開かれたと伝えられる、時宗の寺院としては最古とされる建物を今に残す寺です。文和2年(1353)に建てられた本堂は、流れるような屋根の曲線が特徴で、天井には音の反響が楽しめる「鳴き龍」があることでも知られています。本堂・山門ともに、国の重要文化財に指定されています。静かに手を合わせ、敬意をもって参拝しましょう。本堂の中央で手を打つと、天井に反響する鳴き龍の音も楽しめます。見学を終えたら、歩いて尾道渡船の乗り場へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
      },
    },
    {
      id: tosen.id,
      data: {
        lat: 34.40665,
        lng: 133.200783,
        visitTime: T(15, 52),
        stayDurationMin: 55,
        memo: "西郷寺から歩いて19分ほど、旅の最後に訪れるのは尾道渡船です。尾道と対岸の向島・兼吉港を、わずか3分ほどで結ぶ小さな渡し船で、寛政年間から文化年間(1789〜1817)ごろに開かれたと伝えられる、尾道で最も古いとされる渡船です。渡船に乗るときは、係の人の案内に従いましょう。向島側の船着き場には、映画のロケセットが移築され、今も当時の小道具などが展示されています。短い船旅の先に広がる、昔ながらの渡船風景を楽しみましょう。見学を終えたら、渡船で尾道へ戻り、尾道駅へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 19 }] },
      },
    },
  ]);

  console.log("#373続き: 大幅に組み直し(企画運営・法務の指摘対応)。Day1 09:00〜16:30、Day2 09:30〜16:47着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

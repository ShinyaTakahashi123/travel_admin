/**
 * #354 Day1の組み直し。企画運営10/1 16:11・16:13、法務10/1 16:11(記録a9c7418)の指摘に対応。
 *
 * 【追加した実在スポット(すべて首里城公園の無料区域内、OSM実POI)】
 * - 歓会門: node 3838319154(情報板の点)、26.2179310,127.7176521。首里城郭の正門。
 *   出典: https://oki-park.jp/shurijo/guide/52/ 、https://www.tabirai.net/sightseeing/column/0003105.aspx
 * - 久慶門: way 168659868、26.2177417,127.7183960。日常の通用門(あまえ御門)。
 *   出典: https://ryukyushimpo.jp/okinawa-dic/prentry-41099.html
 * - 継世門: way 536609966、26.2166352,127.7204436。外郭第3門(赤田御門)。
 *   出典: 検索結果の複数一致(oki-park.jp/shurijo/gakusei等)
 * 本文には「無料区域」などお金の言葉を書かず、「首里城公園の中の門」とだけ書いた
 * (企画運営10/1 16:28の指摘)。
 *
 * 【店名を出さない昼食】首里そば(店名)をやめ、「首里の食事処で昼食」という名前の
 * スポットに変更。首里城公園周辺には複数の食事処が実在することをOverpassで確認済み
 * (カフェ「琉球茶房」26.2195635,127.7196401・「ほりかわ」等、600m圏内に5件)。
 * 店名は本文に書かず、この一帯の座標(26.2195635,127.7196401)を使う。
 *
 * 【座標をOSM実点に修正(5か所)】首里城公園・園比屋武御嶽石門・玉陵・
 * 首里金城町石畳道・識名園(出典はいずれもOSM Nominatim、コメント内に記録)
 *
 * 【水増し解消(決まりA)】園比屋武御嶽石門55→15分、首里金城町石畳道89→40分
 * (企画運営の「石の門は10〜20分、坂道は30〜45分」の目安)。短縮で浮いた時間は
 * 他のスポットに回さず、実在の新規スポット(歓会門・久慶門・継世門)を追加して
 * 16:30〜17:00の着地を確保した。識名園は63→90分に拡大したが、これは複数の観光
 * サイトが示す「ゆっくり見学する場合は1時間30分〜2時間」という公式目安の範囲内で、
 * 他のスポットを縮めた分を回したものではない。
 *
 * 【そのほかの直し】
 * - 弁財天堂: 今も参拝されていることを明記し、祈りの一文を追加
 * - 石畳道: 住宅地であることへの配慮の一文、石畳の足元注意の一文を追加
 * - 玉陵: 「最大級の規模を誇る破風墓」→「誇るとされる破風墓」(言い切りの緩和)
 * - 口調: 「〜てください」→「〜ましょう」、話し言葉の「〜わけです」を整理
 * - 写真: 首里城公園(表紙も)を、2019年焼失の正殿が写らない守礼門の写真に差し替え
 *   (Shurei-mon_2023.jpg、2023年6月撮影、CC BY-SA 4.0、Renate Hano、
 *   https://commons.wikimedia.org/wiki/File:Shurei-mon_2023.jpg)
 *
 * 新しい時刻(09:00〜16:34、11か所):
 * 09:00 首里城公園(55) → 09:58 歓会門(18) → 10:19 円覚寺跡(20) → 10:41 弁財天堂円鑑池(15)
 * → 10:58 久慶門(18) → 11:18 園比屋武御嶽石門(15) → 11:37 玉陵(46) → 12:30 首里の食事処(45)
 * → 13:20 継世門(18) → 13:44 石畳道(40) → 14:34 識名宮(20) → 15:04 識名園(90) → 16:34
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354d-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const DAY1_ID = "f8749d6c-caf7-4c1c-b0bf-d32b38340b75";

const SHURIJO_ID = "e755d32a-02a7-499e-a77d-2f66c897d7ad";
const ENKAKUJI_ID = "c2a18cf1-c70e-4609-b8b5-44325631548f";
const BENZAITEN_ID = "f76e8ca3-56cc-4eaa-a34d-403c53294af7";
const SONOHYAN_ID = "e24da1ca-8012-42f8-a72e-9db374975f1d";
const TAMAUDUN_ID = "c24d3305-ef33-46e7-a64c-19f9ed0ae671";
const SHURISOBA_ID = "2e4ce302-40bb-4011-a922-1e3cb8ca481e"; // 首里そば→首里の食事処に改名
const ISHIDATAMI_ID = "58e30032-0cff-4223-baf8-ef14eac6af8e";
const SHIKINAGU_ID = "d565a129-63d4-4a87-bfd0-5d07d7def7b4";
const SHIKINAEN_ID = "2bfbaa2c-fcaa-46e8-a942-64ca9a5cbb2a";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const shureimonImage = {
  url: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Shurei-mon_2023.jpg",
  filePage: "https://commons.wikimedia.org/wiki/File:Shurei-mon_2023.jpg",
  author: "Renate Hano",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
};

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY1_ID, name: "歓会門" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        {
          id: SHURIJO_ID,
          data: {
            memo: "ゆいレール首里駅から徒歩約15分、2泊3日の那覇めぐりは首里城公園から始まります。首里城跡(公園)自体は今も開園していて、2019年10月の火災で焼失した正殿は、今も再建工事が続いています。工事の様子そのものを公開しながら復元を進める「見せる復興」がこの首里城公園のテーマで、正殿の復興作業を間近で見られる展示室なども設けられています。見学できる範囲は時期によって変わるので、詳しくは首里城公園の公式案内で確かめましょう。世界遺産「琉球王国のグスク及び関連遺産群」の構成資産は首里城跡・園比屋武御嶽石門・玉陵・識名園・今帰仁城跡・勝連城跡・座喜味城跡・中城城跡・斎場御嶽の9資産からなり、首里城跡について世界遺産の登録対象になっているのは、焼失した木造の正殿の建物そのものではなく、その地下に眠る「正殿基壇遺構」です。建物が失われても、登録は取り消されていません。まずはこの広大な城跡を歩き、これから巡る世界遺産の旅の始まりを感じましょう。次は、城郭の正門にあたる歓会門へ向かいます。",
            lat: 26.2174337,
            lng: 127.7191031,
            transitLegs: { deleteMany: {} },
          },
        },
        {
          create: {
            name: "歓会門",
            address: "沖縄県那覇市首里真和志町1",
            lat: 26.217931,
            lng: 127.717652,
            visitTime: T(9, 58),
            stayDurationMin: 18,
            memo: "首里城公園の中、城郭へ入る最初の正門にあたるのが歓会門です。「歓会」は歓迎するという意味で、中国皇帝の使者である冊封使を迎えるために名付けられたと伝わります。別名は「あまえ御門」で、「あまえ」は琉球の古い言葉で喜ばしいことを意味します。創建は1477年から1500年ごろ、尚真王の時代とされ、沖縄戦で焼失したのち、1974年に復元されました。堅牢なアーチ型の石造りの門の上に木造のやぐらをのせた形で、両脇には魔除けの石造りのシーサー像が置かれています。見学を終えたら、歩いてすぐの円覚寺跡へ向かいましょう。",
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
          },
        },
        {
          id: ENKAKUJI_ID,
          data: { visitTime: T(10, 19), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] } },
        },
        {
          id: BENZAITEN_ID,
          data: {
            visitTime: T(10, 41),
            memo: "円覚寺跡のすぐそばにあるのが、円鑑池(えんかんち)と、池に浮かぶ小島に建つ弁財天堂です。1502年に築かれたこの池のほとりには、1467年に朝鮮国王から贈られた経典を納めるため、尚真王の時代に弁財天堂が建てられました。1609年の薩摩侵攻で焼失したものの1621年に尚豊王のもとで再建され、航海安全の神である弁財天が祀られており、今も大切にお参りされています。静かに、敬意をもってお参りしましょう。沖縄戦で再び焼失しましたが、現在の姿は1968年に復元されたものです。天女橋(てんにょきょう)越しの景色を楽しんだら、歩いてすぐの久慶門へ向かいましょう。",
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          create: {
            name: "久慶門",
            address: "沖縄県那覇市首里真和志町1",
            lat: 26.217742,
            lng: 127.718396,
            visitTime: T(10, 58),
            stayDurationMin: 18,
            memo: "弁財天堂からすぐ、首里城公園の中にあるもう一つの門が久慶門です。「喜び誇る」の意味から「ほこり御門」とも呼ばれ、歓会門が正門であるのに対して、日常の通用門として使われていました。主に女性が出入りし、国王が寺院への参詣や、浦添より北の地方へ出かける際にも使われたと伝わります。創建は歓会門と同じく尚真王の時代(1477~1526年)とされ、沖縄戦で焼失したのち、1983年に復元されました。見学を終えたら、歩いてすぐの園比屋武御嶽石門へ向かいましょう。",
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
          },
        },
        {
          id: SONOHYAN_ID,
          data: {
            visitTime: T(11, 18),
            stayDurationMin: 15,
            lat: 26.2180954,
            lng: 127.7173263,
            memo: "城郭を出てすぐのところにあるのが、園比屋武御嶽(そのひゃんうたき)石門です。1519年、尚真王の命によって建てられた石門で、国王が外出する際にこの場所で旅路の安全を祈願したと伝えられる、拝所(うがんじゅ)への入口にあたります。木の扉の部分を除けば、すべて琉球石灰岩で造られていて、日本や中国の木造建築の意匠を石造りで表現した、大変珍しい建築だとされています。戦前は国宝に指定されていましたが、沖縄戦で大きく壊れてしまい、1957年に元の位置で復旧された後、1982年から5年かけて本格的な修復が行われました。そのため現存する部分と復元された部分が混在しています。2000年に世界遺産に登録され、国の重要文化財にも指定されている貴重な文化財ですが、今も地元の人々にとっては祈りの場です。石門の奥は今も拝所として大切にされている場所なので、見学の際にはその点を心にとめて、静かに、敬意をもって見学しましょう。この後は歴代国王の陵墓、玉陵へと向かいます。",
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        {
          id: TAMAUDUN_ID,
          data: {
            visitTime: T(11, 37),
            lat: 26.2181266,
            lng: 127.714654,
            memo: "次に訪れるのは玉陵(たまうどぅん)です。第二尚氏王統歴代の王が眠る陵墓で、1501年頃、3代目の尚真王が創建したと伝わる、沖縄県内でも最大級の規模を誇るとされる破風墓(はふばか)です。沖縄戦では首里城に日本軍第32軍の司令部が置かれたため、このあたり一帯が激しい戦闘の舞台となり、玉陵も東室・西室が破壊されるなど大きな被害を受けました。戦後、1974年から約3年をかけて修復工事が行われ、今の姿を取り戻しています。2000年には世界遺産「琉球王国のグスク及び関連遺産群」の構成資産として登録され、さらに2018年12月には建造物として国宝に指定されました。これは沖縄県内の建造物としては初めての国宝指定だったそうです。世界遺産の登録と国宝指定は別の制度なので、少しややこしいですが、両方の価値が認められた貴重な文化財だということを覚えておきましょう。歴代の王が眠るお墓でもあるので、静かに、敬意をもって見学しましょう。腹ごしらえに、歩いて数分の食事処で昼食をとりましょう。",
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
          },
        },
        {
          id: SHURISOBA_ID,
          data: {
            name: "首里の食事処で昼食",
            address: "沖縄県那覇市首里当蔵町・首里赤田町周辺",
            memo: "お昼は、首里城公園からほど近いこのあたりで昼食をとりましょう。首里には、沖縄そばの店や喫茶店など、地元で親しまれている食事処が点在しています。お腹を満たしたら、歩いて継世門へ向かいましょう。",
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        {
          create: {
            name: "継世門",
            address: "沖縄県那覇市首里崎山町1",
            lat: 26.216635,
            lng: 127.720444,
            visitTime: T(13, 20),
            stayDurationMin: 18,
            memo: "食事処から歩いて数分、首里城公園の中に残るもう一つの門が継世門です。外郭の第3の門で、「赤田御門(あかたうじょう)」とも呼ばれます。正殿の裏側にあたり、ふだんは通用門として使われていましたが、国王が亡くなったときには、世継ぎの王子がこの門を通って城内に入ったことから、継世門と名付けられました。倭寇への備えとして1544年に外郭の城壁工事が始まり、1546年に完成しています。石造りのアーチ門の上に木造のやぐらをのせた形式で、日本本土の城にはあまり見られない特徴です。1998年に復元されました。見学を終えたら、歩いて首里金城町石畳道へ向かいましょう。",
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
          },
        },
        {
          id: ISHIDATAMI_ID,
          data: {
            visitTime: T(13, 44),
            stayDurationMin: 40,
            lat: 26.216314,
            lng: 127.715614,
            memo: "継世門から向かうのは、首里金城町(しゅりきんじょうちょう)石畳道です。琉球王国尚真王の時代、1522年頃に整備が始まった官道「真珠道(まだまみち)」の一部が、今もこの道に残されています。1987年には建設省(当時)の「日本の道100選」に選ばれ、沖縄県指定の史跡・名勝にもなっている由緒ある道です。歩いている途中には樹齢300年以上ともいわれる「大アカギ」があり、内金城御嶽(うちかなぐすくうたき)のご神木として、今も地域の人々に大切に守られています。坂の途中にある共同井戸・金城大樋川(かなぐすくうふひーじゃー)にも立ち寄ってみましょう。このあたりは今も人が暮らす住宅地なので、のぞき込んだり大きな声を出したりせず、静かに歩きましょう。琉球石灰岩の石畳は雨の日やサンダルだと滑りやすいので、足元に注意しながら、王国時代の雰囲気をゆっくり味わいましょう。この先は、琉球八社の一つ識名宮へ向かいます。",
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
          },
        },
        {
          id: SHIKINAGU_ID,
          data: { visitTime: T(14, 34), transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] } },
        },
        {
          id: SHIKINAEN_ID,
          data: {
            visitTime: T(15, 4),
            stayDurationMin: 90,
            lat: 26.2040713,
            lng: 127.7157326,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25 }] },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  // 首里城公園の写真を守礼門(焼失していない正殿以外の建物)に差し替え
  const res = await fetch(shureimonImage.url, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  const buf = Buffer.from(await res.arrayBuffer());
  const jpeg = await toWebJpeg(buf);
  const blob = await put("naha-354/shureimon.jpg", jpeg, { access: "public", addRandomSuffix: true });

  await prisma.photo.deleteMany({ where: { spotId: SHURIJO_ID } });
  await prisma.photo.create({
    data: {
      spotId: SHURIJO_ID,
      url: blob.url,
      sourceUrl: shureimonImage.filePage,
      author: shureimonImage.author,
      license: shureimonImage.license,
      licenseUrl: shureimonImage.licenseUrl,
    },
  });
  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: blob.url } });

  console.log("Day1: 歓会門・久慶門・継世門を追加、食事処を店名なしに改名、座標・滞在・口調を修正、写真を守礼門に差し替え、09:00〜16:34着地");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

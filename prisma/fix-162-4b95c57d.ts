/**
 * #162(竹林と紫陽花、鎌倉の名庭と自然をゆったり巡る1泊2日、4b95c57d)
 * を両日とも4か所以上・開始08:30〜09:30/終了16:30〜17:00に組み直す。
 *
 * Day1は報国寺・杉本寺・鶴岡八幡宮の3か所だけで12:30終了(4か所未満・
 * 終了時刻とも違反)、昼食の区間もなかった。Day2は明月院・円覚寺の2か所
 * だけで11:30終了(同じく違反)、昼食もなかった。
 *
 * 鶴岡八幡宮・円覚寺は、既存の別のしおり「鶴岡八幡宮と北鎌倉の禅寺…」
 * (dba1a628)にも登場するが、確認したところ取り上げている事実が違う
 * (鶴岡八幡宮: あちらは創建の経緯・若宮大路の設計、こちらは段葛の由来・
 * 舞殿の悲恋・大銀杏の倒伏。円覚寺: あちらは開山の由来のみ、こちらは
 * 洪鐘・水晶塔の仏舎利も加えた内容)ため、文はそのまま使った。
 *
 * 新設した4か所(浄妙寺・瑞泉寺・東慶寺・海蔵寺)は、他の鎌倉のしおり
 * 3本のいずれにも登場しない(DBで確認済み)。
 *
 * 昼食は、Day1は浄妙寺の境内にある石窯ガーデンテラス(寺の敷地内の店の
 * ため、座標は浄妙寺と同じ実点を使用)で、拝観とあわせて長めの滞在に。
 * Day2は北鎌倉駅のまわり(駅の実点を使用、店の点は使わない決まりのため)
 * で、独立した昼食の区間とした。
 *
 * 新しい時刻:
 * Day1(09:30〜16:30、5か所): 報国寺09:30(80)→杉本寺11:05(40)→
 *   浄妙寺11:50(110、昼食含む)→瑞泉寺13:48(75)→鶴岡八幡宮15:24(66)
 * Day2(09:30〜16:30、5か所): 明月院09:30(70)→東慶寺10:47(55)→
 *   昼食11:46(100)→円覚寺13:29(90)→海蔵寺15:12(78)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";
const DAY2_ID = "66dbae38-0451-4b6b-87ff-9dc1068d1a1f";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const hokokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "報国寺" } });
  const sugimotodera = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "杉本寺" } });
  const tsurugaoka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "鶴岡八幡宮" } });
  const meigetsuin = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "明月院" } });
  const engakuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "円覚寺" } });

  if (hokokuji.stayDurationMin === 80) {
    console.log("already applied, skipping");
    return;
  }

  // ---------- Day1 ----------
  await setDaySpotOrder(DAY1_ID, [
    { id: hokokuji.id, data: { stayDurationMin: 80 } },
    {
      id: sugimotodera.id,
      data: {
        stayDurationMin: 40,
        memo: sugimotodera.memo?.replace(
          "杉本寺の参拝を終えたら、鎌倉のシンボルともいえる鶴岡八幡宮へと足を延ばしましょう。",
          "杉本寺の参拝を終えたら、歩いて浄妙寺へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "浄妙寺",
        address: "鎌倉市浄明寺",
        lat: 35.3233781,
        lng: 139.5713235,
        visitTime: T(11, 50),
        stayDurationMin: 110,
        memo: "杉本寺から歩いて5分ほど、次に訪れるのは浄妙寺です。文治4年(1188)、源頼朝の重臣であった足利義兼を開基として創建された寺で、至徳3年(1386)に足利義満が鎌倉五山を定めた際には第五位に位置づけられました。中興の開基は足利尊氏の父・貞氏と伝えられ、室町時代には七堂伽藍と23の塔頭を擁する大寺院だったといわれています。現在の本堂は宝暦6年(1756)に再建されたもので、境内全体が国の史跡に指定されています。枯山水庭園を眺めながら抹茶をいただける茶堂・喜泉庵や、境内奥の高台にある石窯ガーデンテラス(大正11年に建てられた旧貴族院議員邸を改装した店)では、庭園を眺めながらお昼を楽しむこともできます。少し長めに滞在して、お寺の雰囲気を味わいながら、ゆっくりとお昼を食べていきましょう。見学を終えたら、歩いて瑞泉寺へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
    {
      create: {
        name: "瑞泉寺",
        address: "鎌倉市二階堂",
        lat: 35.3274452,
        lng: 139.5751194,
        visitTime: T(13, 48),
        stayDurationMin: 75,
        memo: "浄妙寺から歩いて8分ほど、次に訪れるのは瑞泉寺です。鎌倉時代末期の高僧・夢窓疎石が開山し、嘉暦2年(1327)に創建されたと伝えられる臨済宗円覚寺派の寺で、関東十刹の一つに数えられています。境内は国の史跡に、庭園は国の名勝に指定されており、夢窓疎石自らが手がけたと伝わるこの庭は、鎌倉時代から伝わるものとしては鎌倉に現存する唯一の例とされています。「花の寺」としても知られ、冬の水仙、早春の梅、春の諸葛菜、夏の芙蓉と、一年を通じてさまざまな花が境内を彩ります。岩壁をくり抜いた独特の造形の庭園を眺めながら、静かなひとときを過ごしましょう。見学を終えたら、歩いて鶴岡八幡宮へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
      },
    },
    {
      id: tsurugaoka.id,
      data: {
        visitTime: T(15, 24),
        stayDurationMin: 66,
        memo: tsurugaoka.memo?.replace(
          "杉本寺から歩みを進め、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。",
          "瑞泉寺から歩いておよそ21分、鎌倉観光のハイライトともいえる鶴岡八幡宮に到着です。"
        ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
      },
    },
  ]);

  // ---------- Day2 ----------
  await setDaySpotOrder(DAY2_ID, [
    {
      id: meigetsuin.id,
      data: {
        stayDurationMin: 70,
        memo: meigetsuin.memo?.replace(
          "緑と歴史を堪能したら、同じく鎌倉五山の名刹、円覚寺へ向かいましょう。",
          "緑と歴史を堪能したら、歩いて東慶寺へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "東慶寺",
        address: "鎌倉市山ノ内",
        lat: 35.3344963,
        lng: 139.5453542,
        visitTime: T(10, 47),
        stayDurationMin: 55,
        memo: "明月院から歩いて7分ほど、次に訪れるのは東慶寺です。山号を松岡山といい、弘安8年(1285)、8代執権・北条時宗の妻であった覚山尼を開山として開かれた臨済宗円覚寺派の寺です。覚山尼が定めたと伝わる「縁切寺法」により、離縁を望む女性を受け入れる寺として知られるようになり、江戸時代には駆け込み寺・縁切り寺として広く知られる存在だったといわれています。明治36年(1903)からは尼寺としての歴史を離れ、禅寺として新たな歩みを始めました。境内の松岡宝蔵では、聖観音立像や離縁状など、寺に伝わる文化財の数々を見ることができます。四季を通じて花の絶えない、静かな境内を歩いてみましょう。見学を終えたら、歩いて北鎌倉駅のまわりへ向かい、お昼を食べましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    },
    {
      create: {
        name: "北鎌倉駅のまわりで昼食",
        address: "鎌倉市山ノ内",
        lat: 35.3371844,
        lng: 139.5451566,
        visitTime: T(11, 46),
        stayDurationMin: 100,
        memo: "東慶寺から歩いて4分ほど、お昼はJR北鎌倉駅のまわりで食事をとりましょう。駅のすぐそばには、老舗の甘味処や、鎌倉野菜を使った食事処などが点在しています。少し長めにとって、ゆっくりと休みながら食事を楽しみましょう。食事を終えたら、歩いて円覚寺へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      id: engakuji.id,
      data: {
        visitTime: T(13, 29),
        stayDurationMin: 90,
        memo: engakuji.memo
          ?.replace(
            "明月院から歩いてほど近く、旅の締めくくりに訪れるのは円覚寺です。",
            "北鎌倉駅のまわりから歩いて3分ほど、次に訪れるのは円覚寺です。"
          )
          .replace(
            "竹の庭に始まり、あじさいの参道、そして格式ある禅寺の空気まで、自然と歴史を味わい尽くす1泊2日の締めくくりにふさわしい一日となるでしょう。",
            "見学を終えたら、歩いて海蔵寺へ向かいましょう。"
          ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    },
    {
      create: {
        name: "海蔵寺",
        address: "鎌倉市扇ガ谷",
        lat: 35.3288581,
        lng: 139.5452632,
        visitTime: T(15, 12),
        stayDurationMin: 78,
        memo: "円覚寺から歩いて13分ほど、1泊2日の旅の最後に訪れるのは海蔵寺です。もとは七堂伽藍を備えた真言宗の寺でしたが、元弘3年(1333)の鎌倉幕府滅亡の際に焼失し、応永元年(1394)、関東管領・足利氏満の命を受けた上杉氏定によって、禅寺として再建されました。「花の寺」として知られ、梅や水仙、萩、そして海棠など、四季折々の花が境内を彩ります。仏殿の裏手には、弘法大師が掘ったと伝わる「十六の井」があり、岩肌をくり抜いた中に、70cmほどの丸い穴が4列4行に並び、今も澄んだ水をたたえています。山門のそばには、鎌倉十井の一つに数えられる「底脱の井」もあります。竹の庭に始まり、紫陽花の参道、禅寺の庭園、そして清らかな井戸の水まで、自然と歴史を味わい尽くした1泊2日の締めくくりにふさわしいひとときを過ごしましょう。見学を終えたら、歩いて鎌倉駅へ戻り、帰りましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
      },
    },
  ]);

  console.log("#162: 両日とも4か所未満・終了時刻を是正。Day1 5か所09:30〜16:30、Day2 5か所09:30〜16:30に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

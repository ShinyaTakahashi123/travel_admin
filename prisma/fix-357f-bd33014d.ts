/**
 * #357 企画運営の7点指摘(2026-10-11)に対応。
 *
 * ■必ず直すところ
 * 1. Day1 稲佐山への行き方: 長崎県美術館→淵神社駅は港をはさんで反対側のため、
 *    バス(新地中華街→ロープウェイ前、約20分)とロープウェイ(淵神社駅→稲佐岳駅、約6分)の
 *    2区間にtransitLegsを分割。稲佐山の到着時刻も合わせて変更(15:28→15:39)。
 *    出典: 長崎バス3・4番系統(長崎駅前〜ロープウェイ前)、淵神社駅(OSM node 2847255162)。
 * 2. Day2 オランダ坂の100分(決まりA)を45分に短縮し、空いた時間に実在スポットを追加:
 *    東山手十二番館(OSM way 723797161、旧居留地私学歴史資料館、9:00〜17:00開館・無料)、
 *    孔子廟(OSM way 242835730、長崎孔子廟・中国歴代博物館、9:30〜18:00開館)。
 *    孔子廟が1泊2日の最後のスポットになるため、締めの一文もここに移す。
 * 3. Day2の始まり: 日本二十六聖人記念館の開館は9:00(長崎市公式)のため、08:45→09:00に変更。
 *    Day2の以降の時刻をすべて+15分でずらす。
 * 4. 最後の一文「世界新三大夜景と鎖国時代の歴史を巡った」(夜景の旅ではなくなったため)を、
 *    孔子廟の締めの一文として夜景に触れない形に書き直す。
 * 5. Day1 眼鏡橋の書き出し: 「長崎駅前から路面電車で約4分の「めがね橋」電停から
 *    歩いて約3分」という具体的な行き方に変更。
 * ■できれば直すところ
 * 6. 日本二十六聖人記念館「慶長元年(1597)」→「慶長元年12月（1597年2月）」に変更。
 * 7. 稲佐山「稲佐山だけでなく鍋冠山や風頭公園、女神大橋など…」の一文を削除。
 *
 * 新しい時刻:
 * Day1 08:45〜16:44(8か所、稲佐山の到着のみ変更)
 * Day2 09:00〜16:55(8か所、二十六聖人記念館09:00開始+東山手十二番館・孔子廟を追加)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-357f-bd33014d.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";
const DAY2_ID = "dd32bb08-f965-4553-b5a2-8837e4c5f644";
const INASAYAMA_ID = "529782c7-7313-47da-8369-ef598ff7f9e2";
const DEJIMA_ID = "a95826b1-67c7-4d97-8629-d9a8f18094e4";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  await prisma.$transaction(async (tx) => {
    // --- Day1 ---

    // 1. 長崎県美術館: 稲佐山への行き方の書き出しを修正
    const bijutsukan = await tx.spot.findFirstOrThrow({
      where: { name: "長崎県美術館", day: { itineraryId: ITIN_ID } },
    });
    const oldBi = "見学を終えたら、長崎ロープウェイで稲佐山へ向かいましょう。";
    const newBi = "見学を終えたら、新地中華街バス停から長崎バスで「ロープウェイ前」へ向かい、淵神社駅から長崎ロープウェイで稲佐山へ向かいましょう。";
    if (bijutsukan.memo?.includes(oldBi)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: bijutsukan.id }, { memo: bijutsukan.memo.replace(oldBi, newBi) }, { tx });
      console.log("長崎県美術館: 稲佐山への行き方を修正");
    } else {
      console.log("長崎県美術館: 既に対応済み");
    }

    // 1・7. 稲佐山: 到着の行き方(2区間)・時刻・削除する一文
    const inasa = await tx.spot.findFirstOrThrow({ where: { id: INASAYAMA_ID } });
    const oldOpen = "長崎県美術館から、長崎ロープウェイでおよそ15分、次に訪れるのは稲佐山です。";
    const newOpen = "長崎県美術館から長崎バスで「ロープウェイ前」まで約20分、淵神社駅から長崎ロープウェイでおよそ6分、次に訪れるのは稲佐山です。";
    const oldSentence = "すり鉢状の地形に家々が立ち並ぶ長崎港を取り囲む市街地を一望でき、稲佐山だけでなく鍋冠山や風頭公園、女神大橋など、さまざまな場所から表情豊かな景色を楽しめる土地としても知られています。";
    const newSentence = "すり鉢状の地形に家々が立ち並ぶ長崎港を取り囲む市街地を一望できます。";
    if (inasa.memo?.includes(oldOpen)) {
      const newMemo = inasa.memo.replace(oldOpen, newOpen).replace(oldSentence, newSentence);
      await tx.spot.update({
        where: { id: INASAYAMA_ID },
        data: {
          visitTime: T(15, 39),
          memo: newMemo,
          transitLegs: {
            deleteMany: {},
            create: [
              { orderNo: 1, transitMode: "bus", transitDurationMin: 20, transitLine: "長崎バス(新地中華街→ロープウェイ前)" },
              { orderNo: 2, transitMode: "other", transitDurationMin: 6, transitLine: "長崎ロープウェイ" },
            ],
          },
        },
      });
      console.log("稲佐山: 行き方(2区間)・到着時刻・本文を修正");
    } else {
      console.log("稲佐山: 既に対応済み");
    }

    // 5. 眼鏡橋: 書き出しを具体的な行き方に変更
    const megane = await tx.spot.findFirstOrThrow({
      where: { name: "眼鏡橋", day: { itineraryId: ITIN_ID } },
    });
    const oldMegane = "路面電車やバスでアクセスできる中島川のほとりから、長崎の旅は眼鏡橋から始まります。";
    const newMegane = "長崎駅前から路面電車で約4分の「めがね橋」電停から歩いて約3分、中島川のほとりに架かる眼鏡橋から、長崎の旅が始まります。";
    if (megane.memo?.includes(oldMegane)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: megane.id }, { memo: megane.memo.replace(oldMegane, newMegane) }, { tx });
      console.log("眼鏡橋: 書き出しを修正");
    } else {
      console.log("眼鏡橋: 既に対応済み");
    }

    // --- Day2 ---
    const oranda = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "オランダ坂" } });
    if (oranda.stayDurationMin === 45) {
      console.log("Day2: 既に対応済み");
      return;
    }

    const kinenkan = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "日本二十六聖人記念館" } });
    const wharf = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "出島ワーフで昼食" } });
    const mizube = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "長崎水辺の森公園" } });
    const oura = await tx.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "大浦天主堂" } });

    const oldDate = "慶長元年(1597)、ここ西坂で、";
    const newDate = "慶長元年12月（1597年2月）、ここ西坂で、";
    const kinenkanMemo = kinenkan.memo?.includes(oldDate) ? kinenkan.memo.replace(oldDate, newDate) : kinenkan.memo!;

    const orandaMemo =
      "大浦天主堂から歩いてすぐ、次に訪れるのはオランダ坂です。安政4年(1857)、江戸幕府が長崎に外国人居留地を開設することを計画し、万延元年(1860)から諸外国に貸し出された、旧居留地の石畳の坂道です。出島に暮らすオランダ人にちなみ、長崎の人々が東洋人以外を「オランダさん」と呼んだことから、居留地にある坂は「オランダさんが通る坂」、つまりオランダ坂と呼ばれるようになったと伝えられています。沿道には、異国情緒あふれる洋館が今も建ち並んでいます。石畳の坂道を歩きながら、鎖国の時代を経て開かれた、長崎の国際都市としての歴史を感じましょう。見学を終えたら、歩いてすぐの東山手十二番館へ向かいましょう。";

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: kinenkan.id, data: { visitTime: T(9, 0), memo: kinenkanMemo } },
        { id: DEJIMA_ID, data: { visitTime: T(10, 25) } },
        { id: wharf.id, data: { visitTime: T(11, 58) } },
        { id: mizube.id, data: { visitTime: T(12, 58) } },
        { id: oura.id, data: { visitTime: T(13, 58) } },
        { id: oranda.id, data: { visitTime: T(15, 10), stayDurationMin: 45, memo: orandaMemo } },
        {
          create: {
            name: "東山手十二番館",
            address: "長崎県長崎市東山手町3-7",
            lat: 32.7378367,
            lng: 129.8735993,
            visitTime: T(15, 56),
            stayDurationMin: 20,
            memo: "オランダ坂から歩いてすぐ、次に訪れるのは東山手十二番館です。安政6年(1859)の開港を機に長崎に築かれた外国人居留地に残る、洋風住宅の一つです。現在は旧居留地私学歴史資料館として、この地に創設されたミッション系の私立学校や、その創設に携わった人々の資料を展示しています。当時の面影を残す洋館を見学しながら、オランダ坂沿いに今も建ち並ぶ異国情緒あふれる町並みを味わいましょう。見学を終えたら、歩いて孔子廟へ向かいましょう。",
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
          },
        },
        {
          create: {
            name: "孔子廟",
            address: "長崎県長崎市大浦町10-36",
            lat: 32.7354575,
            lng: 129.8726153,
            visitTime: T(16, 20),
            stayDurationMin: 35,
            memo: "東山手十二番館から歩いて4分ほど、旅の最後に訪れるのは孔子廟です。明治26年(1893)、清朝政府と在日の中国の人々の協力によって建てられた、本格的な中国様式の孔子廟です。奥の博物館には、中国の博物館から提供された文物の数々が展示されています。極彩色の彫刻が施された本格的な中国建築を、静かに、敬意をもって見学しましょう。見学を終えたら、長崎駅へ戻り、鎖国時代の歴史をたどった1泊2日の旅を締めくくりましょう。",
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
      ],
      { tx }
    );
    console.log("Day2: オランダ坂を45分に短縮、東山手十二番館・孔子廟を追加、09:00開始に変更");
  }, { timeout: 60000 });

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

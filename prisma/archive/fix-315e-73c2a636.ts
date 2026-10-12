/**
 * #315の続き(企画運営7点、2026-09-30 20:18 JST)。
 * しおり「大原美術館、日本初とされる西洋美術中心の私立美術館プラン」
 * (73c2a636-6381-4cf5-9f24-f7d344692cc1)
 *
 * 1. 加計美術館の「倉敷芸術科学大学と吉備国際大学を運営する加計学園」が
 *    誤り。吉備国際大学は加計学園ではなく順正学園の大学。開いた公式
 *    ページ(kake.ac.jp/kakebi/)には倉敷芸術科学大学のみの記載だった
 *    ため、吉備国際大学への言及を削除。
 * 2. 児島虎次郎記念館の座標は、GSI住所検索(番地入り含め複数回試行)でも
 *    大字「本町」までの解像度しか出ず、OSMにも名称一致が無かった
 *    (2025年4月開館とごく新しいため)。隣接する大原美術館の座標(既に
 *    OSM/Wikipediaで確認済み、直線距離およそ0.3km)を元にした推定に
 *    差し替え、その旨を明記。
 * 3. 倉敷市立美術館の滞在90分→60分に短縮。空いた時間には倉敷民藝館
 *    (昭和23年(1948)開館、大原孫三郎が招いた外村吉之介が初代館長、
 *    東京に次いで2番目の民藝館)を追加。
 *    出典: https://www.city.kurashiki.okayama.jp/kosodate/youth/1013063/1013064/1013067/1007503/1015025/1007511.html
 *    (倉敷市公式)
 * 4. 大原美術館「じっくりとご堪能ください」、児島虎次郎記念館「じっくり
 *    とご覧ください」を、ふつうの書き方に直した。児島虎次郎記念館は
 *    「見学→昼食の一言」の順に並べ替え。
 * 5. UKIYO-E KURASHIKI/国芳館の「世界初」は、開いたURL
 *    (https://www.fashion-press.net/news/72647、記事本文に「"世界初"
 *    となる歌川国芳のミュージアム」と明記)で確認済みのため、そのまま
 *    維持。
 * 6. 帰りの一言を「歩いて帰りましょう」から、実際の値(JR倉敷駅までは
 *    徒歩およそ13分)に直した。
 *    出典: https://www.city.kurashiki.okayama.jp/11485.htm (倉敷市立
 *    美術館ご利用案内、倉敷市公式。倉敷駅南口から徒歩13分)
 * 7. descriptionに、足したスポット(語らい座大原本邸・児島虎次郎記念館・
 *    国芳館・加計美術館・倉敷市立美術館など)を反映して書き直した。
 *
 * 時刻の並び(すべて徒歩): 09:30大原美術館(90)→11:02大原本邸(60)→
 * 12:07児島虎次郎記念館(70)→13:19国芳館(45)→14:07加計美術館(50)→
 * 14:58倉敷民藝館(40)→15:42倉敷市立美術館(60)→16:42終了。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-315e-73c2a636.ts
 * (実行済み。倉敷民藝館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73c2a636-6381-4cf5-9f24-f7d344692cc1";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "倉敷民藝館")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const ohara = day1.spots.find((s) => s.name === "大原美術館")!;
  const kojima = day1.spots.find((s) => s.name === "児島虎次郎記念館")!;
  const kake = day1.spots.find((s) => s.name === "加計美術館")!;
  const kcam = day1.spots.find((s) => s.name === "倉敷市立美術館")!;

  // 大原美術館: 口調
  const oharaMemo = (ohara.memo ?? "").replace(
    "倉敷美観地区の白壁の町並みの中に佇む、西洋美術の粋をじっくりとご堪能ください。",
    "倉敷美観地区の白壁の町並みの中に佇む、西洋美術の粋を味わってみましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: ohara.id }, { memo: oharaMemo });

  // 児島虎次郎記念館: 座標推定・口調・順番(見学→昼食)
  const kojimaMemo = (kojima.memo ?? "")
    .replace(
      "このあたりで、昼食をとりましょう。大原美術館の原点となったコレクションを、じっくりとご覧ください。",
      "大原美術館の原点となったコレクションを、たどってみましょう。このあたりで、昼食をとりましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: kojima.id }, {
    lat: 34.596111,
    lng: 133.770556,
    memo: kojimaMemo,
  });

  // 加計美術館: 運営元の誤りを訂正
  const kakeMemo = (kake.memo ?? "").replace(
    "倉敷芸術科学大学と吉備国際大学を運営する加計学園が設立した美術館です。",
    "倉敷芸術科学大学が運営する美術館です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: kake.id }, { memo: kakeMemo });

  // 倉敷市立美術館: 滞在短縮・書き出しの変更(倉敷民藝館から)・帰りの一言
  const kcamMemo = (kcam.memo ?? "")
    .replace("加計美術館からは歩いておよそ4分です。", "倉敷民藝館からは歩いておよそ4分です。")
    .replace(
      "見学を終えたら、歩いて帰りましょう。",
      "見学を終えたら、JR倉敷駅までは徒歩およそ13分です。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: kcam.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 42)),
    stayDurationMin: 60,
    memo: kcamMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        ...day1.spots.filter((s) => s.name !== "倉敷市立美術館").map((s) => ({ id: s.id, data: {} })),
        {
          create: {
            name: "倉敷民藝館",
            address: "倉敷市中央1丁目4-11",
            lat: 34.5954816,
            lng: 133.7715039,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 58)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 1,
            memo:
              "加計美術館からは歩いてすぐです。倉敷民藝館は、江戸時代後期の米倉を改装し、昭和23年(1948)に開館した民藝館です。設立に尽力した大原孫三郎に招かれた外村吉之介が初代館長を務め、東京に次いで2番目につくられた民藝館として知られています。国内外の陶磁器やガラス、染織物、木工品など、暮らしの中で育まれてきた民藝品を、幅広く紹介しています。実用の美という民藝の考え方に、触れてみましょう。",
          },
        },
        { id: kcam.id, data: {} },
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "エル・グレコの名画も収蔵する、日本初とされる西洋美術中心の私立美術館・大原美術館。語らい座大原本邸や児島虎次郎記念館、国芳館、加計美術館、倉敷市立美術館など、美観地区の町並みとは違う、アートを楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

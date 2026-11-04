/**
 * 千秋公園と秋田県立美術館、秋田市内さんぽ(f62dcf1c)の組み直し(2026-11-04、しおりえ(制作補助2))。企画運営・法務の判断に基づく。
 * docs/content/20261102-daytrip-coord-scan.md の f62dcf1c の欄(11/04 夜に組み直しの欄へ足したもの)。設計の表は企画運営・法務とも OK(11/04 21時台)。
 * - 秋田市民市場は6章で行き先から外す(c77a7701 と同じ扱い)。題の「定番」を外す
 * - ねぶり流し館・旧金子家住宅は b2fee0b1 に入っているので外す(企画運営)。代わりに秋田市立千秋美術館を足す
 * - 千秋公園の点は c77a7701 と同じ中土橋側の案内板「千秋公園の由来」node12103449876 にそろえる(企画運営の「点のそろえ」)
 * - 昼食の点は、商業施設(エリアなかいち)の点から、バス停「中通一丁目」node5526437614 に替える(店でない点)
 * - 点: 佐竹史料館 → way461359313(OSM の名前は誤字で「資料館」)、県立美術館 → way461361664、千秋美術館 → museum node4568671983、
 *   赤れんが郷土館 → way748909188
 * - 区間(routing.openstreetmap.de routed-foot): 駅→千秋公園 6.4→7、千秋公園→史料館 5.6→6、史料館→県立美術館 8.5→9、
 *   県立美術館→昼食 3.7→4、昼食→千秋美術館 6.5→7、千秋美術館→赤れんが 12.2→13、赤れんが→駅 10.2→11(帰りの一文)
 * - 時刻: 9:30〜16:30。赤れんが郷土館は 70分まで、空いた分は千秋公園に回して 81分(企画運営)
 * - 写真: 千秋公園(表紙)と県立美術館の写真はそのまま
 * 確認モードは、書き込むデータ(SPOTS)から直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-akita-f62dcf1c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "f62dcf1c-c574-4658-8654-5492cbca334e";
const DAY_ID = "89a85ce2-70ed-4e5b-8b91-066a8a4880b2";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const W = (min: number) => ({ deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: min }] });
const WC = (min: number) => ({ create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: min }] });

const SENSHU = "c548bc2f-a34f-4dc3-90a0-871b20126ba5";
const SATAKE = "e9c4f873-e6e1-4acf-a373-29f7a78a02dd";
const BIJUTSU = "c647b09d-388d-4cd9-a53d-26bd6d60e70d";
const NAKAICHI = "6ce58b31-3143-48ce-9dd7-c76ac01d4076"; // 名前と点を替えて昼食に
const AKARENGA = "8bda08f5-69da-4ac2-8b99-7ed15bb74f96";
const NEBURI = "b7f9b9e2-8ea3-4ac3-a958-2a4f3403cbaf"; // 外す
const KANEKO = "6c69303a-2e7f-46da-87b0-5af824175628"; // 外す
const ICHIBA = "938e0b6f-e542-481a-9914-1bd15a43e832"; // 外す
const REMOVE = [NEBURI, KANEKO, ICHIBA];

const EXPECT: Record<string, string> = {
  [SENSHU]: "千秋公園", [SATAKE]: "秋田市立佐竹史料館", [BIJUTSU]: "秋田県立美術館", [NAKAICHI]: "エリアなかいち（昼食）",
  [AKARENGA]: "秋田市立赤れんが郷土館", [NEBURI]: "ねぶり流し館（秋田市民俗芸能伝承館）", [KANEKO]: "旧金子家住宅", [ICHIBA]: "秋田市民市場",
};
const PHOTOS_EXPECT = ["24252102-6719-4c5a-a590-56cdaa0e53f9", "5a9ff08e-5bf2-48b7-a868-c4dfc595a5a9"].sort();

const TITLE_OLD = "千秋公園と秋田県立美術館、定番の秋田市内さんぽ日帰りプラン";
const TITLE_NEW = "千秋公園と佐竹史料館、秋田の美術と赤れんが郷土館をめぐる日帰りプラン";
const DESC_OLD =
  "佐竹氏の久保田城の跡の千秋公園と佐竹史料館で秋田藩の歴史にふれ、藤田嗣治の大壁画「秋田の行事」のある秋田県立美術館へ。午後は明治の赤れんがの銀行建築や、竿燈を手に持って体験できるねぶり流し館、江戸時代の町家をめぐり、最後は駅近くの市場で秋田の味を探す、秋田市内の歩いてまわる日帰りプランです。";
const DESC_NEW =
  "久保田城の跡の千秋公園と佐竹史料館で秋田藩の歴史にふれ、藤田嗣治の大壁画「秋田の行事」のある秋田県立美術館と、秋田蘭画を常設展示する千秋美術館へ。最後は旧秋田銀行本店本館の赤れんが郷土館をたずねる、秋田駅から歩いてまわる日帰りプランです。";

const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const M = {
  senshu:
    `JR秋田駅から歩いておよそ7分、千秋公園の入口に着きます。慶長7年(1602)から明治2年(1869)の版籍奉還まで、12代267年続いた秋田藩佐竹氏の居城、久保田城の跡です。明治29年(1896)に公園として整えられ、秋田の「秋」に長久の意の「千」を冠して名づけられたといわれています。園内には、市制100周年を記念して本丸の北西に復元された御隅櫓や、公園内に唯一残る江戸時代の建物とされる御物頭御番所があり、お堀や本丸・二の丸の跡をめぐりながら歩けます。園内には彌高神社などの神社もあります。${PRAY}御隅櫓は12月から3月まで休館です。この後は、歩いておよそ6分、佐竹史料館へ向かいましょう。`,
  satake:
    "千秋公園から歩いておよそ6分、秋田市立佐竹史料館に着きます。佐竹氏や秋田藩にかかわる歴史資料を展示し、御隅櫓・御物頭御番所とともに秋田藩の藩政時代を紹介する史料館で、平成2年(1990)に開館し、令和7年(2025)にリニューアルオープンしました。開館は9:00〜16:30です。年末年始のほか、展示替えの期間などに展示室を休むことがあるので、公式の案内で確かめましょう。この後は、歩いておよそ9分、秋田県立美術館へ向かいましょう。",
  bijutsu:
    "佐竹史料館から歩いておよそ9分、秋田県立美術館に着きます。藤田嗣治の作品を展示する美術館で、藤田が昭和12年(1937)当時の秋田を描いた大壁画「秋田の行事」も展示しています。開館は10:00〜18:00(チケットの販売は17:30まで)です。休館日は不定期なので、公式の案内で確かめましょう。この後は、歩いておよそ4分、中通のあたりで昼食にしましょう。",
  lunch:
    "秋田県立美術館から歩いておよそ4分、中通のあたりで昼食にしましょう。この後は、歩いておよそ7分、秋田市立千秋美術館へ向かいましょう。",
  senshuArt:
    "昼食の場所から歩いておよそ7分、秋田市立千秋美術館に着きます。18世紀後半の洋風画「秋田蘭画」と、日本の伝統美に基づく岡田謙三の洋画を常設展示し、国内外の美術を紹介する特別展も開いています。開館は10:00〜18:00(入館は17:30まで)で、年末年始(12月29日から1月3日まで)、アトリオン全館点検日などは休館です。この後は、歩いておよそ13分、秋田市立赤れんが郷土館へ向かいましょう。",
  akarenga:
    "千秋美術館から歩いておよそ13分、秋田市立赤れんが郷土館に着きます。平成6年(1994)に国の重要文化財に指定された旧秋田銀行本店本館の建物を生かした郷土館で、勝平得之記念館もあわせた施設です。館内には、企画展示室のほか、郷土秋田の自然や風俗をテーマにした木版画家・勝平得之の作品を紹介する常設展示室と、人間国宝の鍛金家・関谷四郎の作品を紹介する記念室があります。観覧は9:30〜16:30(入館は16:15まで)です。年末年始のほか、展示替えの期間などに休むことがあるので、公式の案内で確かめましょう。帰りは、JR秋田駅まで歩いておよそ11分です。",
};

type Row = { label: string; item: SpotOrderItem };
const SPOTS: Row[] = [
  {
    label: "千秋公園(既存。点 案内板「千秋公園の由来」node12103449876、c77a7701 と同じ。始まり 9:00→9:30、入口の一文)",
    item: { id: SENSHU, data: { lat: "39.720215", lng: "140.122813", visitTime: T(9, 30), stayDurationMin: 81, memo: M.senshu } },
  },
  {
    label: "佐竹史料館(既存・改名。点 way461359313 のまま、歩き6)",
    item: { id: SATAKE, data: { name: "秋田市立佐竹史料館", lat: "39.719861", lng: "140.124799", visitTime: T(10, 57), stayDurationMin: 50, memo: M.satake, transitLegs: W(6) } },
  },
  {
    label: "秋田県立美術館(既存。点 way461361664 のまま、歩き9)",
    item: { id: BIJUTSU, data: { lat: "39.717437", lng: "140.121572", visitTime: T(11, 56), stayDurationMin: 75, memo: M.bijutsu, transitLegs: W(9) } },
  },
  {
    label: "中通のあたりで昼食(既存のなかいちを改名。点 バス停「中通一丁目」node5526437614、店でない。歩き4)",
    item: { id: NAKAICHI, data: { name: "中通のあたりで昼食", lat: "39.716453", lng: "140.119883", visitTime: T(13, 15), stayDurationMin: 40, memo: M.lunch, transitLegs: W(4) } },
  },
  {
    label: "秋田市立千秋美術館(新規。点 tourism=museum node4568671983、歩き7)",
    item: {
      create: {
        name: "秋田市立千秋美術館", address: "秋田市中通二丁目3-8(アトリオン内)", lat: "39.71726", lng: "140.124383",
        visitTime: T(14, 2), stayDurationMin: 65, memo: M.senshuArt, transitLegs: WC(7),
      },
    },
  },
  {
    label: "秋田市立赤れんが郷土館(既存。点 way748909188 のまま、歩き13、帰りの一文)",
    item: { id: AKARENGA, data: { lat: "39.716723", lng: "140.115865", visitTime: T(15, 20), stayDurationMin: 70, memo: M.akarenga, transitLegs: W(13) } },
  },
];

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { title: true, description: true } });
  if (it?.title !== TITLE_OLD || it?.description !== DESC_OLD) throw new Error("題か説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, select: { id: true, name: true } });
  for (const [id, name] of Object.entries(EXPECT)) {
    const s = spots.find((x) => x.id === id);
    if (!s || s.name !== name) throw new Error(`今のスポットが想定と違います: ${id} 想定「${name}」 実際「${s?.name}」`);
  }
  if (spots.length !== Object.keys(EXPECT).length) throw new Error(`スポットの数が想定と違います: ${spots.length}`);
  const photos = await prisma.photo.findMany({ where: { spot: { dayId: DAY_ID } }, select: { id: true } });
  if (JSON.stringify(photos.map((p) => p.id).sort()) !== JSON.stringify(PHOTOS_EXPECT)) throw new Error(`写真が想定と違います: ${photos.map((p) => p.id).join(",")}`);
  const firstLegs = await prisma.spotTransitLeg.count({ where: { spotId: SENSHU } });
  if (firstLegs > 0) throw new Error(`千秋公園(最初のまま)に区間が残っています: ${firstLegs}`);

  console.log(`題: ${TITLE_OLD}\n→ ${TITLE_NEW}（「定番」を外す）\n説明文:\n  ${DESC_OLD}\n→ ${DESC_NEW}\n季節・表紙: そのまま\n`);
  for (const { label, item } of SPOTS) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const vt = d.visitTime instanceof Date ? d.visitTime.toISOString().slice(11, 16) : "(変更なし)";
    const legs = (d.transitLegs as { create?: { transitMode: string; transitDurationMin: number }[] } | undefined)?.create;
    const legsStr = legs ? legs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : "(区間なし)";
    console.log(
      `■ ${"id" in item ? "[既存]" : "[新規]"} ${label}${d.name ? `\n  名前: ${d.name}` : ""}\n  着 ${vt}／滞在 ${d.stayDurationMin ?? "(変更なし)"}／区間 ${legsStr}／点 ${d.lat ?? "(変更なし)"},${d.lng ?? "(変更なし)"}\n  ${d.memo}`
    );
  }
  for (const id of REMOVE) console.log(`■ [外す] ${EXPECT[id]} (${id})`);
  console.log("\n  始まり 9:30(8:30〜9:30)/ 昼食 13:15(13:30より前)/ 終わり 赤れんが郷土館 16:30(日帰りの 16:30〜17:00)");

  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITIN_ID }, data: { title: TITLE_NEW, description: DESC_NEW } });
      await setDaySpotOrder(DAY_ID, SPOTS.map((r) => r.item), { tx, remove: REMOVE });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
